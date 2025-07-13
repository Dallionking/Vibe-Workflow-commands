const Orchestrator = require('./orchestrator');
const contextManager = require('./context-manager');
const agentMonitor = require('./agent-monitor');
const chalk = require('chalk');

class EnhancedOrchestrator extends Orchestrator {
    constructor() {
        super('main-orchestrator');
        this.isMainInterface = true;
        this.userCommands = this.defineUserCommands();
    }

    async initialize() {
        await super.initialize();
        
        // Show welcome message
        this.showWelcomeMessage();
        
        // Start command prompt
        this.startCommandInterface();
    }

    showWelcomeMessage() {
        console.log(chalk.cyan.bold('\n🎯 ORCHESTRATOR READY\n'));
        console.log(chalk.white('This is your main control terminal.'));
        console.log(chalk.white('Other agents are workers that respond to your commands.\n'));
        
        console.log(chalk.yellow('Quick Commands:'));
        console.log(chalk.gray('  help         - Show all commands'));
        console.log(chalk.gray('  status       - Show agent status'));
        console.log(chalk.gray('  task <desc>  - Assign a task'));
        console.log(chalk.gray('  workflow run - Execute a workflow\n'));
    }

    defineUserCommands() {
        return {
            'help': this.showHelp.bind(this),
            'status': this.showStatus.bind(this),
            'task': this.assignTask.bind(this),
            'workflow': this.handleWorkflow.bind(this),
            'broadcast': this.broadcastMessage.bind(this),
            'test': this.runTest.bind(this),
            'phase': this.showPhaseInfo.bind(this),
            'clear': this.clearScreen.bind(this)
        };
    }

    startCommandInterface() {
        // In real implementation, this would use readline
        console.log(chalk.green('orchestrator> ') + chalk.gray('(type commands here)'));
    }

    async handleUserCommand(input) {
        const [command, ...args] = input.trim().split(' ');
        const handler = this.userCommands[command];
        
        if (handler) {
            await handler(args.join(' '));
        } else {
            console.log(chalk.red(`Unknown command: ${command}`));
            console.log(chalk.gray('Type "help" for available commands'));
        }
    }

    async showHelp() {
        console.log(chalk.cyan('\n📚 Orchestrator Commands:\n'));
        
        const commands = [
            { cmd: 'help', desc: 'Show this help message' },
            { cmd: 'status', desc: 'Show status of all connected agents' },
            { cmd: 'task <description>', desc: 'Create and assign a task' },
            { cmd: 'workflow list', desc: 'List available workflows' },
            { cmd: 'workflow run <name>', desc: 'Execute a workflow' },
            { cmd: 'broadcast <message>', desc: 'Send message to all agents' },
            { cmd: 'test', desc: 'Run connection test' },
            { cmd: 'phase', desc: 'Show current Vibe Coding phase' },
            { cmd: 'clear', desc: 'Clear the screen' }
        ];
        
        commands.forEach(({ cmd, desc }) => {
            console.log(chalk.white(`  ${cmd.padEnd(20)} - ${desc}`));
        });
        
        console.log('\n');
    }

    async showStatus() {
        console.log(chalk.cyan('\n🤖 Agent Status:\n'));
        
        const status = await agentMonitor.getDetailedStatus();
        await agentMonitor.displayAgentGrid();
        
        // Show channel activity
        const recentMessages = await channelMonitor.getMessages({ limit: 5 });
        
        if (recentMessages.length > 0) {
            console.log(chalk.cyan('\n📨 Recent Activity:\n'));
            recentMessages.forEach(msg => {
                console.log(chalk.gray(`  ${msg.agent}: ${msg.content.substring(0, 50)}...`));
            });
        }
        
        console.log('\n');
    }

    async assignTask(taskDescription) {
        if (!taskDescription) {
            console.log(chalk.red('Please provide a task description'));
            console.log(chalk.gray('Example: task implement user login feature'));
            return;
        }
        
        console.log(chalk.yellow(`\n📋 Creating task: ${taskDescription}\n`));
        
        // Analyze task to determine best agent
        const taskType = this.analyzeTaskType(taskDescription);
        const targetAgent = this.selectAgentForTask(taskType);
        
        console.log(chalk.gray(`Task type: ${taskType}`));
        console.log(chalk.gray(`Assigning to: ${targetAgent}\n`));
        
        // Create task object
        const task = {
            id: Date.now().toString(),
            name: taskDescription,
            type: taskType,
            assignedTo: targetAgent,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        
        // Send task to agent
        await contextManager.writeToChannel(this.name,
            JSON.stringify(task),
            {
                type: 'task-assignment',
                target: targetAgent
            }
        );
        
        console.log(chalk.green(`✅ Task assigned to ${targetAgent}`));
        console.log(chalk.gray('Monitor channel.md for progress updates\n'));
    }

    analyzeTaskType(description) {
        const lower = description.toLowerCase();
        
        if (lower.includes('research') || lower.includes('analyze') || lower.includes('find')) {
            return 'research';
        } else if (lower.includes('implement') || lower.includes('code') || lower.includes('create')) {
            return 'implement';
        } else if (lower.includes('test') || lower.includes('verify') || lower.includes('check')) {
            return 'test';
        } else if (lower.includes('document') || lower.includes('write')) {
            return 'document';
        }
        
        return 'general';
    }

    selectAgentForTask(taskType) {
        // Get available agents
        const connectedAgents = Array.from(agentMonitor.connectedAgents.keys());
        
        // Match task type to agent
        const agentMap = {
            'research': ['research-agent', 'analyst-agent'],
            'implement': ['coding-agent', 'frontend-agent', 'backend-agent'],
            'test': ['testing-agent', 'qa-agent'],
            'document': ['documentation-agent', 'writer-agent']
        };
        
        const preferredAgents = agentMap[taskType] || [];
        
        // Find first available preferred agent
        for (const preferred of preferredAgents) {
            if (connectedAgents.includes(preferred)) {
                return preferred;
            }
        }
        
        // Fallback to any developer agent
        const devAgent = connectedAgents.find(a => 
            a.includes('agent') && a !== 'orchestrator'
        );
        
        return devAgent || 'all-agents';
    }

    async handleWorkflow(args) {
        const [action, ...params] = args.split(' ');
        
        switch (action) {
            case 'list':
                await this.listWorkflows();
                break;
            
            case 'run':
                await this.runWorkflow(params[0]);
                break;
            
            case 'status':
                await this.showWorkflowStatus();
                break;
            
            default:
                console.log(chalk.gray('Usage: workflow [list|run|status]'));
        }
    }

    async listWorkflows() {
        console.log(chalk.cyan('\n📂 Available Workflows:\n'));
        
        const workflowDir = '.workflow/definitions';
        try {
            const fs = require('fs').promises;
            const files = await fs.readdir(workflowDir);
            
            const workflows = files.filter(f => f.endsWith('.yaml'));
            
            workflows.forEach(file => {
                const name = file.replace('.yaml', '');
                console.log(chalk.white(`  • ${name}`));
            });
            
            console.log(chalk.gray(`\nRun with: workflow run <name>\n`));
            
        } catch (error) {
            console.log(chalk.red('No workflows found'));
            console.log(chalk.gray('Create workflows in .workflow/definitions/'));
        }
    }

    async broadcastMessage(message) {
        if (!message) {
            console.log(chalk.red('Please provide a message'));
            return;
        }
        
        await contextManager.writeToChannel(this.name,
            message,
            {
                type: 'broadcast',
                target: 'all-agents'
            }
        );
        
        console.log(chalk.green('📢 Message broadcast to all agents\n'));
    }

    async runTest() {
        console.log(chalk.yellow('\n🧪 Running connection test...\n'));
        
        // Send test message
        await contextManager.writeToChannel(this.name,
            'Connection test - please respond with your status',
            {
                type: 'status-request',
                target: 'all-agents'
            }
        );
        
        console.log(chalk.gray('Check channel.md for agent responses\n'));
    }

    async showPhaseInfo() {
        try {
            const fs = require('fs').promises;
            const status = await fs.readFile('.vibe-status.md', 'utf8');
            
            const phaseMatch = status.match(/Current Phase:\s*(phase-\d+)/i);
            const phase = phaseMatch ? phaseMatch[1] : 'Unknown';
            
            console.log(chalk.cyan(`\n📍 Current Phase: ${phase}\n`));
            
            // Show phase-specific agents
            const phaseAgents = {
                'phase-1': ['ideation-agent', 'research-agent'],
                'phase-2': ['architect-agent', 'database-agent'],
                'phase-3': ['ux-agent', 'design-agent'],
                'phase-4': ['design-system-agent'],
                'phase-5': ['state-designer-agent'],
                'phase-6': ['spec-writer-agent'],
                'phase-7': ['copywriter-agent'],
                'phase-8': ['slice-coordinator-agent'],
                'phase-9': ['documentation-agent'],
                'phase-10': ['deployment-agent']
            };
            
            const recommended = phaseAgents[phase] || [];
            if (recommended.length > 0) {
                console.log(chalk.yellow('Recommended agents for this phase:'));
                recommended.forEach(agent => {
                    console.log(chalk.gray(`  • ${agent}`));
                });
            }
            
            console.log('\n');
            
        } catch (error) {
            console.log(chalk.red('Could not read phase information'));
        }
    }

    clearScreen() {
        console.clear();
        this.showWelcomeMessage();
    }
}

// Auto-start orchestrator when module is loaded
async function startOrchestrator(config = {}) {
    const orchestrator = new EnhancedOrchestrator();
    await orchestrator.initialize();
    
    // Handle user input (in real implementation)
    console.log(chalk.cyan('\n💡 TIP: This orchestrator is your command center!\n'));
    console.log('In Claude Code, you can type commands directly.');
    console.log('Other terminals are worker agents that execute tasks.\n');
    
    // Example commands to show
    console.log(chalk.gray('Example commands:'));
    console.log(chalk.green('  status') + chalk.gray(' - Check which agents are connected'));
    console.log(chalk.green('  task research user authentication best practices') + chalk.gray(' - Assign research'));
    console.log(chalk.green('  workflow run feature-implementation') + chalk.gray(' - Run a workflow'));
    
    return orchestrator;
}

module.exports = {
    EnhancedOrchestrator,
    startOrchestrator
};