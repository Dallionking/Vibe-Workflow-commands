const TaskParser = require('./task-parser');
const contextManager = require('./context-manager');

class OrchestratorIntelligence {
    constructor() {
        this.taskParser = new TaskParser();
        this.agentStatus = new Map();
        this.activeWorkflows = new Map();
        this.taskHistory = [];
    }

    /**
     * Intelligent task breakdown and assignment
     */
    async processUserCommand(input) {
        console.log(`\n🧠 Orchestrator analyzing: "${input}"`);
        
        const analysis = await this.analyzeUserIntent(input);
        const taskBreakdown = await this.createTaskBreakdown(analysis);
        const assignments = await this.createAgentAssignments(taskBreakdown);
        
        // Execute assignments automatically
        for (const assignment of assignments) {
            await this.assignTaskToAgent(assignment);
        }
        
        return {
            analysis,
            taskBreakdown,
            assignments,
            totalTasks: assignments.length,
            estimatedDuration: this.estimateWorkflowDuration(taskBreakdown)
        };
    }

    /**
     * Analyze user intent and requirements
     */
    async analyzeUserIntent(input) {
        const intent = {
            type: 'unknown',
            complexity: 'medium',
            priority: 'normal',
            domain: 'general',
            requiresResearch: false,
            requiresImplementation: false,
            requiresTesting: false,
            isWorkflow: false,
            keywords: []
        };

        const lowercaseInput = input.toLowerCase();
        intent.keywords = lowercaseInput.split(' ').filter(word => word.length > 2);

        // Determine intent type
        if (this.containsKeywords(lowercaseInput, ['implement', 'create', 'build', 'develop'])) {
            intent.type = 'implementation';
            intent.requiresImplementation = true;
            intent.requiresTesting = true; // Auto-add testing for implementations
        } else if (this.containsKeywords(lowercaseInput, ['research', 'analyze', 'investigate', 'study'])) {
            intent.type = 'research';
            intent.requiresResearch = true;
        } else if (this.containsKeywords(lowercaseInput, ['test', 'validate', 'verify', 'check'])) {
            intent.type = 'testing';
            intent.requiresTesting = true;
        } else if (this.containsKeywords(lowercaseInput, ['workflow', 'process', 'procedure'])) {
            intent.type = 'workflow';
            intent.isWorkflow = true;
        }

        // Determine complexity
        if (this.containsKeywords(lowercaseInput, ['system', 'architecture', 'complex', 'enterprise'])) {
            intent.complexity = 'high';
        } else if (this.containsKeywords(lowercaseInput, ['simple', 'quick', 'basic', 'small'])) {
            intent.complexity = 'low';
        }

        // Determine domain
        if (this.containsKeywords(lowercaseInput, ['auth', 'authentication', 'login', 'user'])) {
            intent.domain = 'authentication';
        } else if (this.containsKeywords(lowercaseInput, ['api', 'backend', 'server', 'endpoint'])) {
            intent.domain = 'backend';
        } else if (this.containsKeywords(lowercaseInput, ['ui', 'frontend', 'component', 'interface'])) {
            intent.domain = 'frontend';
        } else if (this.containsKeywords(lowercaseInput, ['database', 'data', 'schema', 'migration'])) {
            intent.domain = 'database';
        }

        // Auto-determine research requirements
        if (intent.complexity === 'high' || intent.domain !== 'general') {
            intent.requiresResearch = true;
        }

        // Determine priority
        if (this.containsKeywords(lowercaseInput, ['urgent', 'critical', 'asap', 'emergency'])) {
            intent.priority = 'high';
        } else if (this.containsKeywords(lowercaseInput, ['later', 'eventually', 'when available'])) {
            intent.priority = 'low';
        }

        return intent;
    }

    /**
     * Create comprehensive task breakdown
     */
    async createTaskBreakdown(analysis) {
        const tasks = [];

        // Research phase (if needed)
        if (analysis.requiresResearch) {
            tasks.push({
                id: this.generateTaskId(),
                type: 'research',
                agent: 'research-agent',
                title: `Research: ${analysis.domain} best practices`,
                description: `Conduct comprehensive research for ${analysis.domain} implementation`,
                priority: analysis.priority,
                estimatedDuration: 30,
                dependencies: [],
                commands: [{
                    type: 'ultrathink',
                    description: `Research ${analysis.domain} implementation best practices, architecture patterns, and modern approaches`
                }]
            });
        }

        // Implementation phase (if needed)
        if (analysis.requiresImplementation) {
            const implementationTask = {
                id: this.generateTaskId(),
                type: 'implementation',
                agent: 'coding-agent',
                title: `Implement: ${analysis.domain} feature`,
                description: `Implement ${analysis.domain} functionality based on research`,
                priority: analysis.priority,
                estimatedDuration: this.getImplementationDuration(analysis.complexity),
                dependencies: analysis.requiresResearch ? [tasks[0]?.id] : [],
                commands: [{
                    type: 'implementation',
                    steps: this.getImplementationSteps(analysis.domain),
                    validation: ['syntax-check', 'lint', 'type-check']
                }]
            };
            tasks.push(implementationTask);
        }

        // Testing phase (if needed)
        if (analysis.requiresTesting) {
            tasks.push({
                id: this.generateTaskId(),
                type: 'testing',
                agent: 'testing-agent',
                title: `Test: ${analysis.domain} validation`,
                description: `Create comprehensive tests and validate implementation`,
                priority: analysis.priority,
                estimatedDuration: 20,
                dependencies: analysis.requiresImplementation ? [tasks[tasks.length - 1]?.id] : [],
                commands: [{
                    type: 'testing',
                    steps: ['create-tests', 'run-tests', 'coverage-check'],
                    threshold: 0.95
                }]
            });
        }

        // Add documentation task for complex implementations
        if (analysis.complexity === 'high' && analysis.requiresImplementation) {
            tasks.push({
                id: this.generateTaskId(),
                type: 'documentation',
                agent: 'coding-agent',
                title: `Document: ${analysis.domain} implementation`,
                description: `Create comprehensive documentation for the implementation`,
                priority: 'normal',
                estimatedDuration: 15,
                dependencies: [tasks[tasks.length - 1]?.id],
                commands: [{
                    type: 'documentation',
                    sections: ['overview', 'usage', 'api', 'examples']
                }]
            });
        }

        return tasks;
    }

    /**
     * Create agent assignments with coordination
     */
    async createAgentAssignments(tasks) {
        const assignments = [];

        for (const task of tasks) {
            const assignment = {
                taskId: task.id,
                agent: task.agent,
                title: task.title,
                description: task.description,
                priority: task.priority,
                commands: task.commands,
                dependencies: task.dependencies,
                estimatedDuration: task.estimatedDuration,
                status: 'assigned',
                assignedAt: new Date().toISOString(),
                metadata: {
                    type: 'task-assignment',
                    target: task.agent,
                    orchestrator: 'auto-assignment'
                }
            };

            assignments.push(assignment);
        }

        return assignments;
    }

    /**
     * Assign task to specific agent
     */
    async assignTaskToAgent(assignment) {
        console.log(`\n📤 Assigning task to ${assignment.agent}: ${assignment.title}`);

        // Check if agent is available
        const agentStatus = this.agentStatus.get(assignment.agent);
        if (agentStatus && agentStatus.busy) {
            console.log(`⏸️ ${assignment.agent} is busy, queuing task`);
            // Queue for later (implement queueing logic)
        }

        // Send task assignment to channel
        await contextManager.writeToChannel('orchestrator',
            this.formatTaskAssignment(assignment),
            assignment.metadata
        );

        // Track assignment
        this.taskHistory.push({
            ...assignment,
            assignedAt: new Date().toISOString()
        });

        // Update agent status
        this.updateAgentStatus(assignment.agent, { busy: true, currentTask: assignment.taskId });
    }

    /**
     * Format task assignment for channel communication
     */
    formatTaskAssignment(assignment) {
        return `
🎯 **TASK ASSIGNMENT**: ${assignment.title}

**Description**: ${assignment.description}
**Priority**: ${assignment.priority}
**Estimated Duration**: ${assignment.estimatedDuration} minutes
**Dependencies**: ${assignment.dependencies.length > 0 ? assignment.dependencies.join(', ') : 'None'}

**Commands to Execute**:
${assignment.commands.map(cmd => `- ${cmd.type}: ${cmd.description || JSON.stringify(cmd)}`).join('\n')}

**Expected Deliverables**:
- Task completion confirmation
- Output artifacts (code, documentation, test results)
- Status updates during execution

**${assignment.agent}**: Please execute this task and report progress.`;
    }

    /**
     * Handle task completion from agents
     */
    async handleTaskCompletion(message) {
        const taskId = message.metadata.taskId;
        const agent = message.agent;

        console.log(`\n✅ Task completed by ${agent}: ${taskId}`);

        // Update agent status
        this.updateAgentStatus(agent, { busy: false, currentTask: null });

        // Check for dependent tasks that can now be executed
        await this.checkAndExecuteDependentTasks(taskId);

        // Update task history
        const taskIndex = this.taskHistory.findIndex(t => t.taskId === taskId);
        if (taskIndex >= 0) {
            this.taskHistory[taskIndex].status = 'completed';
            this.taskHistory[taskIndex].completedAt = new Date().toISOString();
        }
    }

    /**
     * Check and execute tasks that were waiting for dependencies
     */
    async checkAndExecuteDependentTasks(completedTaskId) {
        const waitingTasks = this.taskHistory.filter(task =>
            task.status === 'waiting' &&
            task.dependencies.includes(completedTaskId)
        );

        for (const task of waitingTasks) {
            const allDependenciesComplete = task.dependencies.every(depId =>
                this.taskHistory.find(t => t.taskId === depId)?.status === 'completed'
            );

            if (allDependenciesComplete) {
                console.log(`\n🔄 Dependencies satisfied, executing: ${task.title}`);
                task.status = 'assigned';
                await this.assignTaskToAgent(task);
            }
        }
    }

    /**
     * Utility methods
     */
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    generateTaskId() {
        return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    getImplementationDuration(complexity) {
        const durations = { low: 30, medium: 60, high: 120 };
        return durations[complexity] || 60;
    }

    getImplementationSteps(domain) {
        const steps = {
            'authentication': ['setup-auth-infrastructure', 'implement-login', 'add-security', 'integrate-frontend'],
            'backend': ['design-api', 'implement-endpoints', 'add-validation', 'setup-middleware'],
            'frontend': ['create-components', 'implement-logic', 'add-styling', 'integrate-api'],
            'database': ['design-schema', 'create-migrations', 'implement-queries', 'add-indexes']
        };
        return steps[domain] || ['analyze-requirements', 'implement-solution', 'add-validation', 'integrate'];
    }

    updateAgentStatus(agent, status) {
        this.agentStatus.set(agent, {
            ...this.agentStatus.get(agent),
            ...status,
            lastUpdate: new Date().toISOString()
        });
    }

    estimateWorkflowDuration(tasks) {
        // Calculate total duration considering parallel vs sequential execution
        let totalDuration = 0;
        const parallelTasks = tasks.filter(t => t.dependencies.length === 0);
        const sequentialTasks = tasks.filter(t => t.dependencies.length > 0);

        // Parallel tasks (max duration)
        if (parallelTasks.length > 0) {
            totalDuration = Math.max(...parallelTasks.map(t => t.estimatedDuration));
        }

        // Sequential tasks (sum)
        totalDuration += sequentialTasks.reduce((sum, t) => sum + t.estimatedDuration, 0);

        return totalDuration;
    }

    /**
     * Status and monitoring
     */
    getActiveWorkflows() {
        return Array.from(this.activeWorkflows.values());
    }

    getAgentStatuses() {
        return Array.from(this.agentStatus.entries()).map(([agent, status]) => ({
            agent,
            ...status
        }));
    }

    getTaskHistory(limit = 10) {
        return this.taskHistory.slice(-limit);
    }

    getCurrentTasks() {
        return this.taskHistory.filter(task => 
            task.status === 'assigned' || task.status === 'in-progress'
        );
    }
}

module.exports = OrchestratorIntelligence;