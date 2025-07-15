// Multi-Agent Orchestrator Configuration
// Manages coordination between specialized Claude Code instances

class MultiAgentOrchestrator {
    constructor() {
        this.agents = new Map();
        this.tasks = [];
        this.channels = {
            main: '.workflow/context/channel.md',
            status: '.workflow/context/status.json',
            logs: '.workflow/context/logs.txt'
        };
        this.workflows = new Map();
        this.isActive = false;
    }

    // Agent Management
    registerAgent(name, terminalId, specializations = []) {
        const agent = {
            name,
            terminalId,
            specializations,
            status: 'connected',
            lastSeen: new Date(),
            currentTasks: [],
            completedTasks: 0
        };
        
        this.agents.set(name, agent);
        this.logEvent(`Agent ${name} registered on terminal ${terminalId}`);
        return agent;
    }

    // Intelligent Task Breakdown and Assignment
    async analyzeAndAssignTask(taskDescription) {
        const analysis = this.analyzeTaskComplexity(taskDescription);
        const breakdown = this.breakdownTask(analysis);
        
        for (const subtask of breakdown) {
            const assignedAgent = this.findBestAgent(subtask);
            if (assignedAgent) {
                await this.assignTask(assignedAgent, subtask);
            }
        }
        
        return breakdown;
    }

    analyzeTaskComplexity(description) {
        // AI-like task analysis
        const keywords = {
            research: ['research', 'investigate', 'analyze', 'study', 'documentation'],
            coding: ['implement', 'create', 'build', 'develop', 'code', 'feature'],
            testing: ['test', 'validate', 'verify', 'check', 'coverage'],
            frontend: ['ui', 'component', 'react', 'vue', 'angular', 'styling'],
            backend: ['api', 'server', 'database', 'endpoint', 'service']
        };

        const analysis = {
            type: 'unknown',
            complexity: 'medium',
            estimatedTime: 30,
            dependencies: [],
            requiredSpecializations: []
        };

        // Analyze task type based on keywords
        for (const [type, terms] of Object.entries(keywords)) {
            if (terms.some(term => description.toLowerCase().includes(term))) {
                analysis.requiredSpecializations.push(type);
            }
        }

        // Determine complexity
        if (description.length > 200 || analysis.requiredSpecializations.length > 2) {
            analysis.complexity = 'high';
            analysis.estimatedTime = 60;
        } else if (description.length < 50) {
            analysis.complexity = 'low';
            analysis.estimatedTime = 15;
        }

        return analysis;
    }

    breakdownTask(analysis) {
        const subtasks = [];
        
        if (analysis.requiredSpecializations.includes('research')) {
            subtasks.push({
                type: 'research',
                description: 'Research and gather requirements',
                dependencies: [],
                estimatedTime: 15
            });
        }

        if (analysis.requiredSpecializations.includes('coding')) {
            subtasks.push({
                type: 'implementation',
                description: 'Implement core functionality',
                dependencies: ['research'],
                estimatedTime: 30
            });
        }

        if (analysis.requiredSpecializations.includes('testing')) {
            subtasks.push({
                type: 'testing',
                description: 'Create and run tests',
                dependencies: ['implementation'],
                estimatedTime: 15
            });
        }

        return subtasks;
    }

    findBestAgent(subtask) {
        let bestAgent = null;
        let bestScore = -1;

        for (const [name, agent] of this.agents) {
            if (agent.status !== 'connected') continue;

            let score = 0;
            
            // Specialization match
            if (agent.specializations.includes(subtask.type)) {
                score += 10;
            }

            // Current workload (prefer less busy agents)
            score -= agent.currentTasks.length * 2;

            // Experience (completed tasks)
            score += Math.min(agent.completedTasks, 5);

            if (score > bestScore) {
                bestScore = score;
                bestAgent = agent;
            }
        }

        return bestAgent;
    }

    async assignTask(agent, task) {
        task.id = Date.now() + Math.random();
        task.assignedTo = agent.name;
        task.status = 'assigned';
        task.assignedAt = new Date();

        agent.currentTasks.push(task);
        this.tasks.push(task);

        // Write task to channel for agent to pick up
        await this.writeToChannel(`
## Task Assignment
**Agent**: ${agent.name}
**Task ID**: ${task.id}
**Type**: ${task.type}
**Description**: ${task.description}
**Dependencies**: ${task.dependencies.join(', ')}
**Estimated Time**: ${task.estimatedTime} minutes

**Status**: Ready for execution
**Auto-Execute**: true
`);

        this.logEvent(`Task ${task.id} assigned to ${agent.name}`);
    }

    // Communication System
    async writeToChannel(message) {
        const timestamp = new Date().toISOString();
        const entry = `\n---\n**${timestamp}**\n${message}\n`;
        
        // Append to channel file
        const fs = require('fs').promises;
        try {
            await fs.appendFile(this.channels.main, entry);
        } catch (error) {
            console.error('Failed to write to channel:', error);
        }
    }

    async initializeChannel() {
        const fs = require('fs').promises;
        const initialContent = `# Multi-Agent Communication Channel

This file facilitates real-time communication between Claude Code agents.
Agents monitor this file for task assignments and coordination messages.

## Status: ${this.isActive ? 'ACTIVE' : 'INACTIVE'}
## Orchestrator Started: ${new Date().toISOString()}

---
`;
        
        try {
            await fs.writeFile(this.channels.main, initialContent);
            this.logEvent('Communication channel initialized');
        } catch (error) {
            console.error('Failed to initialize channel:', error);
        }
    }

    // Status and Monitoring
    getStatus() {
        return {
            active: this.isActive,
            agents: Array.from(this.agents.values()),
            activeTasks: this.tasks.filter(t => t.status !== 'completed').length,
            completedTasks: this.tasks.filter(t => t.status === 'completed').length
        };
    }

    logEvent(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        console.log(logEntry.trim());
        
        // Also write to log file
        const fs = require('fs');
        try {
            fs.appendFileSync(this.channels.logs, logEntry);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }
    }

    // Workflow Management
    loadWorkflow(name) {
        const workflows = {
            'full-stack-feature': {
                steps: [
                    { type: 'research', agent: 'research-agent' },
                    { type: 'backend', agent: 'backend-agent' },
                    { type: 'frontend', agent: 'frontend-agent' },
                    { type: 'testing', agent: 'testing-agent' }
                ]
            },
            'ui-component': {
                steps: [
                    { type: 'design-research', agent: 'research-agent' },
                    { type: 'component-creation', agent: 'frontend-agent' },
                    { type: 'testing', agent: 'testing-agent' }
                ]
            }
        };
        
        return workflows[name];
    }

    async executeWorkflow(workflowName, description) {
        const workflow = this.loadWorkflow(workflowName);
        if (!workflow) {
            throw new Error(`Workflow '${workflowName}' not found`);
        }

        this.logEvent(`Starting workflow: ${workflowName}`);
        
        for (const step of workflow.steps) {
            const agent = this.agents.get(step.agent);
            if (agent) {
                await this.assignTask(agent, {
                    type: step.type,
                    description: `${description} (${step.type})`,
                    dependencies: [],
                    estimatedTime: 20
                });
            }
        }
    }

    // Command Interface
    async processCommand(command, args = []) {
        switch (command) {
            case 'task':
                return await this.analyzeAndAssignTask(args.join(' '));
                
            case 'workflow':
                if (args.length < 2) return 'Usage: workflow <name> <description>';
                return await this.executeWorkflow(args[0], args.slice(1).join(' '));
                
            case 'status':
                return this.getStatus();
                
            case 'help':
                return this.getHelpText();
                
            default:
                return `Unknown command: ${command}`;
        }
    }

    getHelpText() {
        return `
Multi-Agent Orchestrator Commands:

task <description>     - Analyze and auto-assign task to best agent
workflow <name> <desc> - Execute predefined workflow
status                 - Show all agents and current tasks
help                   - Show this help text

Available Workflows:
- full-stack-feature   - Complete feature development
- ui-component         - UI component creation

Agent Communication:
All agents monitor .workflow/context/channel.md for assignments.
Tasks are automatically executed when assigned.
`;
    }

    // Initialization
    async start() {
        this.isActive = true;
        await this.initializeChannel();
        this.logEvent('Multi-Agent Orchestrator started');
        
        console.log(`
🤖 Multi-Agent System Initialized

Communication Channel: ${this.channels.main}
Status: ACTIVE
Registered Agents: ${this.agents.size}

Ready for agent connections and task assignments.
Use 'help' for available commands.
`);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiAgentOrchestrator;
}

// Global instance for interactive use
if (typeof global !== 'undefined') {
    global.orchestrator = new MultiAgentOrchestrator();
}