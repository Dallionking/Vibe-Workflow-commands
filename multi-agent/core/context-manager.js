const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class ContextManager {
    constructor() {
        this.contextRoot = path.join(process.cwd(), '.workflow', 'context');
        this.channelFile = path.join(this.contextRoot, 'channel.md');
        this.agentContextDir = path.join(this.contextRoot, 'agents');
        this.sharedContextDir = path.join(this.contextRoot, 'shared');
    }

    async initialize() {
        // Create directory structure
        await fs.mkdir(this.contextRoot, { recursive: true });
        await fs.mkdir(this.agentContextDir, { recursive: true });
        await fs.mkdir(this.sharedContextDir, { recursive: true });

        // Initialize channel.md if it doesn't exist
        try {
            await fs.access(this.channelFile);
        } catch (e) {
            await this.initializeChannel();
        }
    }

    async initializeChannel() {
        const initialContent = `# Agent Communication Channel

This file serves as the primary communication channel between agents in the multi-agent workflow.

## Active Agents
None

## Messages
<!-- Agents will append their messages below -->

---
`;
        await fs.writeFile(this.channelFile, initialContent);
    }

    async writeToChannel(agentName, message, metadata = {}) {
        const timestamp = new Date().toISOString();
        
        // Enhanced message format with more metadata
        const entry = `
### [${timestamp}] ${agentName}
**Type:** ${metadata.type || 'message'}
${metadata.target ? `**Target:** ${metadata.target}` : ''}
${metadata.taskId ? `**TaskId:** ${metadata.taskId}` : ''}
${metadata.priority ? `**Priority:** ${metadata.priority}` : ''}
${metadata.status ? `**Status:** ${metadata.status}` : ''}

${message}

---
`;

        await fs.appendFile(this.channelFile, entry);
        
        // Emit events for real-time monitoring
        this.emit?.('message-written', { agentName, message, metadata, timestamp });
        
        // Auto-notify monitoring agents about critical messages
        if (metadata.type === 'task-assignment' || metadata.type === 'task-complete') {
            this.emit?.('critical-message', { agentName, message, metadata, timestamp });
        }
    }

    async readChannel(options = {}) {
        const content = await fs.readFile(this.channelFile, 'utf8');
        
        if (options.lastN) {
            // Return last N messages
            const messages = content.split('---').filter(m => m.trim());
            return messages.slice(-options.lastN).join('---');
        }
        
        if (options.since) {
            // Return messages since timestamp
            const messages = content.split('---').filter(m => {
                const timestampMatch = m.match(/\[(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\]/);
                if (timestampMatch) {
                    return new Date(timestampMatch[1]) > new Date(options.since);
                }
                return false;
            });
            return messages.join('---');
        }
        
        return content;
    }

    async saveAgentContext(agentName, instanceId, context) {
        const contextPath = path.join(this.agentContextDir, `${agentName}-${instanceId}.json`);
        await fs.writeFile(contextPath, JSON.stringify(context, null, 2));
    }

    async loadAgentContext(agentName, instanceId) {
        const contextPath = path.join(this.agentContextDir, `${agentName}-${instanceId}.json`);
        try {
            const content = await fs.readFile(contextPath, 'utf8');
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    }

    async saveSharedContext(key, value) {
        const contextPath = path.join(this.sharedContextDir, `${key}.json`);
        await fs.writeFile(contextPath, JSON.stringify(value, null, 2));
    }

    async loadSharedContext(key) {
        const contextPath = path.join(this.sharedContextDir, `${key}.json`);
        try {
            const content = await fs.readFile(contextPath, 'utf8');
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    }

    async createAgentWorkspace(agentName, instanceId) {
        const workspacePath = path.join(this.contextRoot, 'workspaces', `${agentName}-${instanceId}`);
        await fs.mkdir(workspacePath, { recursive: true });
        
        return {
            root: workspacePath,
            input: path.join(workspacePath, 'input'),
            output: path.join(workspacePath, 'output'),
            temp: path.join(workspacePath, 'temp')
        };
    }

    async passContext(fromAgent, toAgent, context, options = {}) {
        const passId = `${fromAgent}-to-${toAgent}-${Date.now()}`;
        const passPath = path.join(this.contextRoot, 'passes', `${passId}.json`);
        
        await fs.mkdir(path.dirname(passPath), { recursive: true });
        
        const passData = {
            from: fromAgent,
            to: toAgent,
            timestamp: new Date().toISOString(),
            context: context,
            options: options
        };
        
        await fs.writeFile(passPath, JSON.stringify(passData, null, 2));
        
        // Also write to channel for visibility
        await this.writeToChannel(fromAgent, `Passing context to ${toAgent}`, {
            type: 'context-pass',
            target: toAgent
        });
        
        return passId;
    }

    async receiveContext(agentName, options = {}) {
        const passesDir = path.join(this.contextRoot, 'passes');
        
        try {
            const files = await fs.readdir(passesDir);
            const relevantPasses = [];
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const content = await fs.readFile(path.join(passesDir, file), 'utf8');
                    const passData = JSON.parse(content);
                    
                    if (passData.to === agentName) {
                        relevantPasses.push(passData);
                    }
                }
            }
            
            // Sort by timestamp
            relevantPasses.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            if (options.latest) {
                return relevantPasses[0] || null;
            }
            
            return relevantPasses;
        } catch (e) {
            return options.latest ? null : [];
        }
    }

    async clearChannel() {
        await this.initializeChannel();
    }

    async archiveContext(archiveName) {
        const archiveDir = path.join(process.cwd(), '.workflow', 'archives', archiveName);
        await fs.mkdir(archiveDir, { recursive: true });
        
        // Copy current context to archive
        await this.copyDirectory(this.contextRoot, archiveDir);
        
        return archiveDir;
    }

    async copyDirectory(src, dest) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    async getContextSummary() {
        const summary = {
            channel: {
                exists: false,
                messageCount: 0,
                lastUpdate: null
            },
            agents: [],
            sharedContextKeys: [],
            passes: 0
        };
        
        try {
            // Channel info
            const channelStat = await fs.stat(this.channelFile);
            summary.channel.exists = true;
            summary.channel.lastUpdate = channelStat.mtime;
            
            const channelContent = await fs.readFile(this.channelFile, 'utf8');
            summary.channel.messageCount = (channelContent.match(/^###\s+\[/gm) || []).length;
            
            // Agent contexts
            const agentFiles = await fs.readdir(this.agentContextDir);
            summary.agents = agentFiles.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
            
            // Shared context keys
            const sharedFiles = await fs.readdir(this.sharedContextDir);
            summary.sharedContextKeys = sharedFiles.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
            
            // Passes count
            try {
                const passFiles = await fs.readdir(path.join(this.contextRoot, 'passes'));
                summary.passes = passFiles.filter(f => f.endsWith('.json')).length;
            } catch (e) {
                // Passes directory doesn't exist
            }
        } catch (e) {
            // Context not initialized
        }
        
        return summary;
    }
}

module.exports = new ContextManager();