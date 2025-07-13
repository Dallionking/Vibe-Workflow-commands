const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const chokidar = require('chokidar');

class ChannelMonitor extends EventEmitter {
    constructor() {
        super();
        this.channelPath = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
        this.watcher = null;
        this.lastProcessedLine = 0;
        this.messageHandlers = new Map();
    }

    async start() {
        // Ensure channel exists
        await this.ensureChannel();

        // Start watching the channel file
        this.watcher = chokidar.watch(this.channelPath, {
            persistent: true,
            ignoreInitial: true
        });

        this.watcher.on('change', async () => {
            await this.processNewMessages();
        });

        // Process any existing messages
        await this.processNewMessages();

        this.emit('monitor:started');
    }

    async stop() {
        if (this.watcher) {
            await this.watcher.close();
            this.watcher = null;
        }
        this.emit('monitor:stopped');
    }

    async ensureChannel() {
        const dir = path.dirname(this.channelPath);
        await fs.mkdir(dir, { recursive: true });

        try {
            await fs.access(this.channelPath);
        } catch (e) {
            const initialContent = `# Agent Communication Channel

This file serves as the primary communication channel between agents in the multi-agent workflow.

## Active Agents
None

## Messages
<!-- Agents will append their messages below -->

---
`;
            await fs.writeFile(this.channelPath, initialContent);
        }
    }

    async processNewMessages() {
        const content = await fs.readFile(this.channelPath, 'utf8');
        const lines = content.split('\n');
        
        let currentMessage = null;
        let inMessage = false;
        
        for (let i = this.lastProcessedLine; i < lines.length; i++) {
            const line = lines[i];
            
            // Check for message start
            if (line.match(/^###\s+\[[\d-T:.Z]+\]\s+(.+)$/)) {
                // Process previous message if exists
                if (currentMessage) {
                    await this.handleMessage(currentMessage);
                }
                
                // Start new message
                const match = line.match(/^###\s+\[([\d-T:.Z]+)\]\s+(.+)$/);
                currentMessage = {
                    timestamp: match[1],
                    agent: match[2],
                    metadata: {},
                    content: [],
                    lineStart: i
                };
                inMessage = true;
            } else if (inMessage && line.startsWith('**Type:**')) {
                currentMessage.metadata.type = line.replace('**Type:**', '').trim();
            } else if (inMessage && line.startsWith('**Target:**')) {
                currentMessage.metadata.target = line.replace('**Target:**', '').trim();
            } else if (inMessage && line === '---') {
                // End of message
                if (currentMessage) {
                    await this.handleMessage(currentMessage);
                    currentMessage = null;
                    inMessage = false;
                }
            } else if (inMessage && currentMessage) {
                currentMessage.content.push(line);
            }
        }
        
        // Handle last message if not terminated
        if (currentMessage) {
            await this.handleMessage(currentMessage);
        }
        
        this.lastProcessedLine = lines.length;
    }

    async handleMessage(message) {
        message.content = message.content.join('\n').trim();
        
        // Emit general message event
        this.emit('message', message);
        
        // Emit type-specific events
        if (message.metadata.type) {
            this.emit(`message:${message.metadata.type}`, message);
        }
        
        // Emit agent-specific events
        this.emit(`agent:${message.agent}`, message);
        
        // Call registered handlers
        if (message.metadata.target && this.messageHandlers.has(message.metadata.target)) {
            const handler = this.messageHandlers.get(message.metadata.target);
            await handler(message);
        }
    }

    registerHandler(agentName, handler) {
        this.messageHandlers.set(agentName, handler);
    }

    unregisterHandler(agentName) {
        this.messageHandlers.delete(agentName);
    }

    async getMessages(options = {}) {
        const content = await fs.readFile(this.channelPath, 'utf8');
        const messages = [];
        
        const lines = content.split('\n');
        let currentMessage = null;
        let inMessage = false;
        
        for (const line of lines) {
            if (line.match(/^###\s+\[[\d-T:.Z]+\]\s+(.+)$/)) {
                if (currentMessage) {
                    messages.push(currentMessage);
                }
                
                const match = line.match(/^###\s+\[([\d-T:.Z]+)\]\s+(.+)$/);
                currentMessage = {
                    timestamp: match[1],
                    agent: match[2],
                    metadata: {},
                    content: []
                };
                inMessage = true;
            } else if (inMessage && line.startsWith('**Type:**')) {
                currentMessage.metadata.type = line.replace('**Type:**', '').trim();
            } else if (inMessage && line.startsWith('**Target:**')) {
                currentMessage.metadata.target = line.replace('**Target:**', '').trim();
            } else if (inMessage && line === '---') {
                if (currentMessage) {
                    currentMessage.content = currentMessage.content.join('\n').trim();
                    messages.push(currentMessage);
                    currentMessage = null;
                    inMessage = false;
                }
            } else if (inMessage && currentMessage) {
                currentMessage.content.push(line);
            }
        }
        
        if (currentMessage) {
            currentMessage.content = currentMessage.content.join('\n').trim();
            messages.push(currentMessage);
        }
        
        // Apply filters
        let filtered = messages;
        
        if (options.agent) {
            filtered = filtered.filter(m => m.agent === options.agent);
        }
        
        if (options.type) {
            filtered = filtered.filter(m => m.metadata.type === options.type);
        }
        
        if (options.since) {
            filtered = filtered.filter(m => new Date(m.timestamp) > new Date(options.since));
        }
        
        if (options.limit) {
            filtered = filtered.slice(-options.limit);
        }
        
        return filtered;
    }

    async clearChannel() {
        await this.ensureChannel();
        this.lastProcessedLine = 0;
    }

    async getAgentActivity() {
        const messages = await this.getMessages();
        const activity = {};
        
        for (const message of messages) {
            if (!activity[message.agent]) {
                activity[message.agent] = {
                    messageCount: 0,
                    firstMessage: message.timestamp,
                    lastMessage: message.timestamp,
                    types: {}
                };
            }
            
            const agentActivity = activity[message.agent];
            agentActivity.messageCount++;
            agentActivity.lastMessage = message.timestamp;
            
            const type = message.metadata.type || 'general';
            agentActivity.types[type] = (agentActivity.types[type] || 0) + 1;
        }
        
        return activity;
    }
}

module.exports = new ChannelMonitor();