const chalk = require('chalk');
const channelMonitor = require('./channel-monitor');
const contextManager = require('./context-manager');

class AgentMonitor {
    constructor() {
        this.connectedAgents = new Map();
        this.expectedAgents = new Map();
        this.lastHeartbeat = new Map();
    }

    async initialize(expectedAgents) {
        // Set expected agents from setup
        expectedAgents.forEach(agent => {
            this.expectedAgents.set(agent.name, {
                ...agent,
                connected: false,
                lastSeen: null
            });
        });

        // Monitor for agent connections
        channelMonitor.on('message', (msg) => {
            if (msg.metadata.type === 'agent-ready' || 
                msg.metadata.type === 'agent-startup') {
                this.handleAgentConnection(msg);
            }
            
            // Track all messages as heartbeats
            this.lastHeartbeat.set(msg.agent, new Date());
        });

        // Start periodic status display
        this.startStatusDisplay();
    }

    handleAgentConnection(message) {
        const agentName = message.agent;
        const terminal = message.content.match(/Terminal (\d+)/)?.[1];
        
        this.connectedAgents.set(agentName, {
            name: agentName,
            terminal: terminal || 'Unknown',
            connectedAt: new Date(message.timestamp),
            status: 'active'
        });

        // Update expected agents
        if (this.expectedAgents.has(agentName)) {
            const expected = this.expectedAgents.get(agentName);
            expected.connected = true;
            expected.lastSeen = new Date();
        }

        // Show connection notification
        this.showConnectionNotification(agentName, terminal);
    }

    showConnectionNotification(agentName, terminal) {
        console.log(chalk.green(`\n✅ Agent Connected: ${agentName} (Terminal ${terminal})`));
        
        // Check if all expected agents are connected
        const allConnected = Array.from(this.expectedAgents.values())
            .every(agent => agent.connected);
        
        if (allConnected) {
            console.log(chalk.cyan.bold('\n🎉 All agents connected! System ready for workflows.\n'));
            this.showQuickCommands();
        } else {
            this.showConnectionStatus();
        }
    }

    showConnectionStatus() {
        console.log(chalk.yellow('\n📊 Connection Status:'));
        
        const connected = Array.from(this.expectedAgents.values())
            .filter(a => a.connected).length;
        const total = this.expectedAgents.size;
        
        console.log(chalk.gray(`Connected: ${connected}/${total}`));
        
        // Show waiting for
        const waiting = Array.from(this.expectedAgents.values())
            .filter(a => !a.connected)
            .map(a => `${a.name} (Terminal ${a.terminal})`);
        
        if (waiting.length > 0) {
            console.log(chalk.gray(`Waiting for: ${waiting.join(', ')}`));
        }
    }

    showQuickCommands() {
        console.log(chalk.cyan('Quick Commands:'));
        console.log(chalk.white('  /workflow list       - See available workflows'));
        console.log(chalk.white('  /workflow run test   - Run a test workflow'));
        console.log(chalk.white('  /channel show        - View agent communications'));
        console.log(chalk.white('  /agents status       - Show detailed agent status\n'));
    }

    async startStatusDisplay() {
        // Show status every 30 seconds if not all connected
        setInterval(() => {
            const allConnected = Array.from(this.expectedAgents.values())
                .every(agent => agent.connected);
            
            if (!allConnected) {
                this.displayWaitingStatus();
            }
        }, 30000);
    }

    displayWaitingStatus() {
        console.log(chalk.yellow('\n⏳ Still waiting for agents...'));
        this.showConnectionStatus();
        
        // Show help for missing agents
        const missing = Array.from(this.expectedAgents.values())
            .filter(a => !a.connected);
        
        if (missing.length > 0) {
            console.log(chalk.gray('\nFor each missing agent:'));
            missing.forEach(agent => {
                console.log(chalk.gray(`Terminal ${agent.terminal}: /agent ${agent.name} --terminal-id=${agent.terminal}`));
            });
        }
    }

    async getDetailedStatus() {
        const status = {
            summary: {
                expected: this.expectedAgents.size,
                connected: this.connectedAgents.size,
                active: 0,
                inactive: 0
            },
            agents: []
        };

        // Check agent activity
        const now = new Date();
        
        for (const [name, agent] of this.connectedAgents) {
            const lastSeen = this.lastHeartbeat.get(name);
            const inactive = lastSeen && (now - lastSeen) > 60000; // 1 minute
            
            status.agents.push({
                name: name,
                terminal: agent.terminal,
                connectedAt: agent.connectedAt,
                lastActivity: lastSeen,
                status: inactive ? 'inactive' : 'active'
            });
            
            if (inactive) {
                status.summary.inactive++;
            } else {
                status.summary.active++;
            }
        }

        // Add missing agents
        for (const [name, expected] of this.expectedAgents) {
            if (!this.connectedAgents.has(name)) {
                status.agents.push({
                    name: name,
                    terminal: expected.terminal,
                    status: 'not-connected',
                    expected: true
                });
            }
        }

        return status;
    }

    async displayAgentGrid() {
        const status = await this.getDetailedStatus();
        
        console.log(chalk.cyan.bold('\n🤖 Agent Status Grid\n'));
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.white(
            'Agent Name'.padEnd(20) + 
            'Terminal'.padEnd(10) + 
            'Status'.padEnd(15) + 
            'Last Activity'
        ));
        console.log(chalk.gray('─'.repeat(60)));
        
        status.agents.forEach(agent => {
            const statusColor = agent.status === 'active' ? chalk.green :
                               agent.status === 'inactive' ? chalk.yellow :
                               chalk.red;
            
            const activity = agent.lastActivity ? 
                `${Math.round((new Date() - agent.lastActivity) / 1000)}s ago` :
                'Never';
            
            console.log(
                chalk.white(agent.name.padEnd(20)) +
                chalk.gray(agent.terminal.toString().padEnd(10)) +
                statusColor(agent.status.padEnd(15)) +
                chalk.gray(activity)
            );
        });
        
        console.log(chalk.gray('─'.repeat(60)));
        console.log(chalk.cyan(
            `Summary: ${status.summary.connected}/${status.summary.expected} connected, ` +
            `${status.summary.active} active`
        ));
    }

    async checkSystemHealth() {
        const issues = [];
        const warnings = [];
        
        // Check for disconnected agents
        const disconnected = Array.from(this.expectedAgents.values())
            .filter(a => !a.connected);
        
        if (disconnected.length > 0) {
            issues.push(`${disconnected.length} agents not connected`);
        }
        
        // Check for inactive agents
        const now = new Date();
        for (const [name, lastSeen] of this.lastHeartbeat) {
            if (lastSeen && (now - lastSeen) > 300000) { // 5 minutes
                warnings.push(`${name} has been inactive for >5 minutes`);
            }
        }
        
        // Check channel size
        try {
            const fs = require('fs').promises;
            const channelPath = '.workflow/context/channel.md';
            const stats = await fs.stat(channelPath);
            
            if (stats.size > 400 * 1024) { // 400KB
                warnings.push('Channel file approaching rotation threshold');
            }
        } catch (error) {
            // Channel doesn't exist yet
        }
        
        return {
            healthy: issues.length === 0,
            issues,
            warnings
        };
    }
}

module.exports = new AgentMonitor();