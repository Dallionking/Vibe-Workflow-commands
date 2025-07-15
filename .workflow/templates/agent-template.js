// Multi-Agent Template for Claude Code Instances
// This template provides the base structure for specialized agents

class AgentTemplate {
    constructor(name, terminalId, specializations = []) {
        this.name = name;
        this.terminalId = terminalId;
        this.specializations = specializations;
        this.status = 'initializing';
        this.currentTasks = [];
        this.completedTasks = 0;
        this.channelFile = '.workflow/context/channel.md';
        this.isMonitoring = false;
        this.lastChannelCheck = Date.now();
    }

    // Agent Lifecycle
    async initialize() {
        this.status = 'connected';
        console.log(`🤖 Agent ${this.name} initialized on terminal ${this.terminalId}`);
        console.log(`Specializations: ${this.specializations.join(', ')}`);
        
        await this.reportConnection();
        await this.startMonitoring();
    }

    async reportConnection() {
        const message = `
## Agent Connection
**Name**: ${this.name}
**Terminal**: ${this.terminalId}
**Specializations**: ${this.specializations.join(', ')}
**Status**: Connected
**Timestamp**: ${new Date().toISOString()}
`;
        
        await this.appendToChannel(message);
    }

    // Task Monitoring and Execution
    async startMonitoring() {
        this.isMonitoring = true;
        console.log(`📡 Monitoring channel for tasks...`);
        
        // In a real implementation, this would use file watchers
        // For now, agents should check the channel periodically
        setInterval(() => this.checkForTasks(), 5000);
    }

    async checkForTasks() {
        try {
            const fs = require('fs').promises;
            const content = await fs.readFile(this.channelFile, 'utf8');
            
            // Look for new task assignments for this agent
            const taskPattern = new RegExp(
                `\\*\\*Agent\\*\\*: ${this.name}[\\s\\S]*?\\*\\*Auto-Execute\\*\\*: true`,
                'g'
            );
            
            const matches = content.match(taskPattern);
            if (matches) {
                for (const match of matches) {
                    await this.processTaskAssignment(match);
                }
            }
        } catch (error) {
            console.error('Error checking for tasks:', error);
        }
    }

    async processTaskAssignment(taskText) {
        // Parse task details from the assignment text
        const task = this.parseTaskAssignment(taskText);
        
        if (this.hasTaskBeenProcessed(task.id)) {
            return; // Skip already processed tasks
        }

        console.log(`📋 New task assigned: ${task.description}`);
        
        // Add to current tasks
        this.currentTasks.push(task);
        
        // Auto-execute if specified
        if (task.autoExecute) {
            await this.executeTask(task);
        }
    }

    parseTaskAssignment(taskText) {
        const extractValue = (pattern) => {
            const match = taskText.match(pattern);
            return match ? match[1].trim() : '';
        };

        return {
            id: extractValue(/\*\*Task ID\*\*: (.*)/),
            type: extractValue(/\*\*Type\*\*: (.*)/),
            description: extractValue(/\*\*Description\*\*: (.*)/),
            dependencies: extractValue(/\*\*Dependencies\*\*: (.*)/).split(', ').filter(Boolean),
            estimatedTime: parseInt(extractValue(/\*\*Estimated Time\*\*: (\d+)/)) || 30,
            autoExecute: taskText.includes('**Auto-Execute**: true')
        };
    }

    hasTaskBeenProcessed(taskId) {
        return this.currentTasks.some(t => t.id === taskId) ||
               this.completedTasks.some(t => t.id === taskId);
    }

    // Task Execution Engine
    async executeTask(task) {
        console.log(`🚀 Executing task: ${task.description}`);
        
        await this.reportTaskStart(task);
        
        try {
            // Specialized execution based on task type and agent capabilities
            const result = await this.performSpecializedTask(task);
            
            await this.completeTask(task, result);
            
        } catch (error) {
            console.error(`❌ Task execution failed:`, error);
            await this.reportTaskFailure(task, error);
        }
    }

    async performSpecializedTask(task) {
        // Override this method in specialized agents
        const strategy = this.getExecutionStrategy(task.type);
        
        if (strategy) {
            return await strategy.execute(task);
        }
        
        // Default execution
        console.log(`Performing ${task.type} task: ${task.description}`);
        
        // Simulate work (replace with actual implementation)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            status: 'completed',
            output: `Task completed by ${this.name}`,
            timestamp: new Date().toISOString()
        };
    }

    getExecutionStrategy(taskType) {
        // Define execution strategies for different task types
        const strategies = {
            research: {
                execute: async (task) => {
                    console.log('🔍 Executing research task...');
                    // Use Context7, Perplexity, UltraThink
                    return { type: 'research', findings: 'Research completed' };
                }
            },
            implementation: {
                execute: async (task) => {
                    console.log('⚙️ Executing implementation task...');
                    // Use coding tools, file operations
                    return { type: 'code', files: ['example.js'], status: 'implemented' };
                }
            },
            testing: {
                execute: async (task) => {
                    console.log('🧪 Executing testing task...');
                    // Run tests, validate coverage
                    return { type: 'test', coverage: '95%', status: 'passed' };
                }
            }
        };

        return strategies[taskType];
    }

    // Communication Methods
    async appendToChannel(message) {
        try {
            const fs = require('fs').promises;
            const timestamp = new Date().toISOString();
            const entry = `\n---\n**${timestamp}**\n${message}\n`;
            
            await fs.appendFile(this.channelFile, entry);
        } catch (error) {
            console.error('Failed to write to channel:', error);
        }
    }

    async reportTaskStart(task) {
        const message = `
## Task Started
**Agent**: ${this.name}
**Task**: ${task.description}
**Type**: ${task.type}
**Status**: In Progress
`;
        await this.appendToChannel(message);
    }

    async completeTask(task, result) {
        // Remove from current tasks
        this.currentTasks = this.currentTasks.filter(t => t.id !== task.id);
        
        // Add to completed
        task.completedAt = new Date().toISOString();
        task.result = result;
        this.completedTasks++;

        console.log(`✅ Task completed: ${task.description}`);

        await this.reportTaskCompletion(task, result);
    }

    async reportTaskCompletion(task, result) {
        const message = `
## Task Completed
**Agent**: ${this.name}
**Task**: ${task.description}
**Duration**: ${task.estimatedTime} minutes
**Result**: ${JSON.stringify(result, null, 2)}
**Status**: ✅ Complete
`;
        await this.appendToChannel(message);
    }

    async reportTaskFailure(task, error) {
        const message = `
## Task Failed
**Agent**: ${this.name}
**Task**: ${task.description}
**Error**: ${error.message}
**Status**: ❌ Failed
`;
        await this.appendToChannel(message);
    }

    // Status and Utilities
    getStatus() {
        return {
            name: this.name,
            terminalId: this.terminalId,
            specializations: this.specializations,
            status: this.status,
            currentTasks: this.currentTasks.length,
            completedTasks: this.completedTasks,
            isMonitoring: this.isMonitoring
        };
    }

    // Command Interface for Manual Control
    async processCommand(command, args = []) {
        switch (command) {
            case 'status':
                return this.getStatus();
                
            case 'tasks':
                return {
                    current: this.currentTasks,
                    completed: this.completedTasks
                };
                
            case 'execute':
                if (args.length > 0) {
                    const taskDescription = args.join(' ');
                    const task = {
                        id: Date.now(),
                        description: taskDescription,
                        type: 'manual',
                        autoExecute: true
                    };
                    await this.executeTask(task);
                    return 'Task executed';
                }
                return 'Usage: execute <task description>';
                
            case 'help':
                return `
Agent Commands:
status    - Show agent status
tasks     - Show current and completed tasks  
execute   - Manually execute a task
help      - Show this help
`;
                
            default:
                return `Unknown command: ${command}`;
        }
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentTemplate;
}

// Usage example for creating specialized agents:
/*
class ResearchAgent extends AgentTemplate {
    constructor(terminalId) {
        super('research-agent', terminalId, ['research', 'documentation', 'analysis']);
    }
    
    async performSpecializedTask(task) {
        if (task.type === 'research') {
            // Use Context7, Perplexity, UltraThink
            console.log('🔍 Running UltraThink research...');
            // Implementation here
        }
        return await super.performSpecializedTask(task);
    }
}
*/