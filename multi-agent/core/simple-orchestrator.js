#!/usr/bin/env node

/**
 * Simple Multi-Agent Orchestrator
 * Real implementation that actually works with Claude Code
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chokidar = require('chokidar');

class SimpleOrchestrator {
    constructor() {
        this.channelFile = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
        this.agentStatus = new Map();
        this.taskQueue = [];
        this.isRunning = false;
        
        // Create readline interface
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'orchestrator> '
        });
        
        // Setup graceful shutdown
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
    }

    async start() {
        console.log('🚀 Simple Multi-Agent Orchestrator');
        console.log('═'.repeat(50));
        console.log('');
        console.log('This orchestrator coordinates Claude Code instances running as agents.');
        console.log('Each agent runs in its own terminal with a wrapper script.');
        console.log('');
        console.log('Available commands:');
        console.log('  task <agent> <description>  - Assign task to agent');
        console.log('  status                      - Show agent status');
        console.log('  agents                      - List available agents');
        console.log('  help                        - Show this help');
        console.log('  quit                        - Exit orchestrator');
        console.log('');
        
        // Ensure channel directory exists
        await this.ensureChannelExists();
        
        // Start monitoring channel for agent responses
        this.startChannelMonitoring();
        
        // Show setup instructions if no agents connected
        await this.checkInitialSetup();
        
        this.isRunning = true;
        this.rl.prompt();
        
        // Handle user input
        this.rl.on('line', (input) => {
            this.handleCommand(input.trim());
            if (this.isRunning) {
                this.rl.prompt();
            }
        });
        
        this.rl.on('close', () => {
            this.shutdown();
        });
    }

    async ensureChannelExists() {
        const channelDir = path.dirname(this.channelFile);
        
        try {
            await fs.promises.mkdir(channelDir, { recursive: true });
            
            // Initialize channel if it doesn't exist
            if (!fs.existsSync(this.channelFile)) {
                const initialContent = `# Multi-Agent Communication Channel

## System Status
- **Orchestrator**: Active
- **Active Agents**: 0
- **Last Updated**: ${new Date().toISOString()}

---

`;
                await fs.promises.writeFile(this.channelFile, initialContent);
            }
        } catch (error) {
            console.error('❌ Failed to setup channel:', error.message);
            process.exit(1);
        }
    }

    startChannelMonitoring() {
        if (!fs.existsSync(this.channelFile)) {
            console.log('⚠️  Channel file not found, creating...');
            return;
        }

        console.log('👁️  Monitoring channel for agent responses...');
        
        let lastSize = 0;
        try {
            lastSize = fs.statSync(this.channelFile).size;
        } catch (error) {
            // File doesn't exist yet
        }

        const watcher = chokidar.watch(this.channelFile, {
            persistent: true,
            ignoreInitial: true
        });

        watcher.on('change', () => {
            try {
                const currentSize = fs.statSync(this.channelFile).size;
                if (currentSize > lastSize) {
                    this.parseNewMessages(lastSize);
                    lastSize = currentSize;
                }
            } catch (error) {
                console.log('⚠️  Error reading channel updates:', error.message);
            }
        });

        watcher.on('error', (error) => {
            console.log('⚠️  Channel monitoring error:', error.message);
        });
    }

    parseNewMessages(fromPosition) {
        try {
            const content = fs.readFileSync(this.channelFile, 'utf8');
            const newContent = content.slice(fromPosition);
            
            // Look for agent messages
            const agentMessageRegex = /### \[(.*?)\] (.*?)\n\*\*Type:\*\* (.*?)\n/g;
            let match;
            
            while ((match = agentMessageRegex.exec(newContent)) !== null) {
                const [, timestamp, agentName, messageType] = match;
                
                if (messageType === 'agent-ready') {
                    this.handleAgentReady(agentName, timestamp);
                } else if (messageType === 'task-complete') {
                    this.handleTaskComplete(agentName, timestamp);
                } else if (messageType === 'agent-status') {
                    this.handleAgentStatus(agentName, timestamp);
                }
            }
        } catch (error) {
            console.log('⚠️  Error parsing messages:', error.message);
        }
    }

    handleAgentReady(agentName, timestamp) {
        this.agentStatus.set(agentName, {
            status: 'ready',
            lastSeen: new Date(timestamp),
            tasksCompleted: 0
        });
        
        console.log(`\n✅ ${agentName} is ready and monitoring`);
        if (this.isRunning) {
            this.rl.prompt();
        }
    }

    handleTaskComplete(agentName, timestamp) {
        const agent = this.agentStatus.get(agentName);
        if (agent) {
            agent.tasksCompleted++;
            agent.lastSeen = new Date(timestamp);
        }
        
        console.log(`\n🎉 ${agentName} completed a task`);
        if (this.isRunning) {
            this.rl.prompt();
        }
    }

    handleAgentStatus(agentName, timestamp) {
        const agent = this.agentStatus.get(agentName);
        if (agent) {
            agent.lastSeen = new Date(timestamp);
        }
        
        console.log(`\n📊 ${agentName} status update`);
        if (this.isRunning) {
            this.rl.prompt();
        }
    }

    async checkInitialSetup() {
        if (this.agentStatus.size === 0) {
            console.log('📋 No agents connected yet. To start agents:');
            console.log('');
            console.log('Terminal 2: ./multi-agent/scripts/start-research-agent.sh');
            console.log('Terminal 3: ./multi-agent/scripts/start-coding-agent.sh');  
            console.log('Terminal 4: ./multi-agent/scripts/start-testing-agent.sh');
            console.log('');
            console.log('(Scripts will be created if they don\'t exist)');
            console.log('');
        }
    }

    handleCommand(input) {
        if (!input) return;
        
        const [command, ...args] = input.split(' ');
        
        switch (command.toLowerCase()) {
            case 'task':
                this.assignTask(args);
                break;
            case 'status':
                this.showStatus();
                break;
            case 'agents':
                this.listAgents();
                break;
            case 'help':
                this.showHelp();
                break;
            case 'quit':
            case 'exit':
                this.shutdown();
                break;
            case 'clear':
                console.clear();
                break;
            default:
                console.log(`❌ Unknown command: ${command}`);
                console.log('Type "help" for available commands');
        }
    }

    assignTask(args) {
        if (args.length < 2) {
            console.log('❌ Usage: task <agent> <description>');
            console.log('Example: task research-agent Analyze the codebase for React patterns');
            return;
        }
        
        const agentName = args[0];
        const taskDescription = args.slice(1).join(' ');
        
        // Check if agent exists
        if (!this.agentStatus.has(agentName)) {
            console.log(`⚠️  Agent '${agentName}' not connected. Available agents:`);
            this.listAgents();
            return;
        }
        
        try {
            const message = `
### [${new Date().toISOString()}] orchestrator
**Type:** task-assignment
**Target:** ${agentName}
**Priority:** normal

**Task:** ${taskDescription}

**Instructions:**
- Read the task description carefully
- Execute the required work using Claude Code tools
- Report back with results and status
- Mark task as complete when finished

---

`;
            
            fs.appendFileSync(this.channelFile, message);
            console.log(`✅ Task assigned to ${agentName}`);
            console.log(`📝 Task: ${taskDescription}`);
            
        } catch (error) {
            console.log('❌ Failed to assign task:', error.message);
        }
    }

    showStatus() {
        console.log('\n📊 Agent Status Report');
        console.log('─'.repeat(60));
        
        if (this.agentStatus.size === 0) {
            console.log('No agents connected');
            return;
        }
        
        for (const [name, status] of this.agentStatus) {
            const timeSince = status.lastSeen ? 
                Math.round((Date.now() - status.lastSeen.getTime()) / 1000) : 'never';
            
            console.log(`${name.padEnd(20)} ${status.status.padEnd(10)} ${status.tasksCompleted} tasks   Last seen: ${timeSince}s ago`);
        }
        
        console.log('');
    }

    listAgents() {
        console.log('\n🤖 Available Agents');
        console.log('─'.repeat(30));
        
        const availableAgents = [
            { name: 'research-agent', description: 'Analyzes codebases and gathers information' },
            { name: 'coding-agent', description: 'Implements features and writes code' },
            { name: 'testing-agent', description: 'Creates tests and validates code quality' },
            { name: 'validation-agent', description: 'Validates compliance and conventions' }
        ];
        
        for (const agent of availableAgents) {
            const connected = this.agentStatus.has(agent.name) ? '✅' : '❌';
            console.log(`${connected} ${agent.name.padEnd(20)} ${agent.description}`);
        }
        
        console.log('');
        
        if (this.agentStatus.size === 0) {
            console.log('To start agents, run the wrapper scripts in separate terminals.');
        }
    }

    showHelp() {
        console.log('\n📖 Orchestrator Commands');
        console.log('─'.repeat(40));
        console.log('task <agent> <description>  Assign task to specific agent');
        console.log('status                      Show all agent status');
        console.log('agents                      List available agents');  
        console.log('clear                       Clear screen');
        console.log('help                        Show this help');
        console.log('quit                        Exit orchestrator');
        console.log('');
        console.log('📝 Example Usage:');
        console.log('task research-agent Analyze React components in src/');
        console.log('task coding-agent Create a UserCard component with props');
        console.log('task testing-agent Write tests for UserCard component');
        console.log('');
    }

    shutdown() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        console.log('\n👋 Shutting down orchestrator...');
        
        // Write shutdown message to channel
        try {
            const shutdownMessage = `
### [${new Date().toISOString()}] orchestrator
**Type:** system-shutdown

🛑 Orchestrator shutting down
All agents should continue monitoring until manually stopped.

---

`;
            fs.appendFileSync(this.channelFile, shutdownMessage);
        } catch (error) {
            // Ignore errors during shutdown
        }
        
        this.rl.close();
        process.exit(0);
    }
}

// Start orchestrator if run directly
if (require.main === module) {
    const orchestrator = new SimpleOrchestrator();
    orchestrator.start().catch(error => {
        console.error('❌ Orchestrator startup failed:', error.message);
        process.exit(1);
    });
}

module.exports = SimpleOrchestrator;