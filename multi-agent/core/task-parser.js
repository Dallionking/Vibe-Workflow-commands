const fs = require('fs').promises;
const path = require('path');

class TaskParser {
    constructor() {
        this.taskMap = new Map();
        this.agentCapabilities = {
            'research-agent': ['ultrathink', 'analysis', 'documentation', 'best-practices'],
            'coding-agent': ['implementation', 'refactoring', 'infrastructure', 'integration'],
            'testing-agent': ['validation', 'coverage', 'quality-assurance', 'performance'],
            'orchestrator': ['coordination', 'workflow', 'task-assignment', 'status']
        };
    }

    /**
     * Parse tasks from channel.md messages
     */
    parseTaskFromMessage(message) {
        const task = {
            id: this.generateTaskId(),
            agent: message.agent,
            type: message.metadata.type,
            target: message.metadata.target,
            content: message.content,
            timestamp: message.timestamp,
            status: 'pending',
            dependencies: [],
            outputs: []
        };

        // Extract specific task details
        if (message.metadata.type === 'task-assignment') {
            task.description = this.extractTaskDescription(message.content);
            task.requirements = this.extractRequirements(message.content);
            task.expectedOutputs = this.extractExpectedOutputs(message.content);
        }

        return task;
    }

    /**
     * Intelligent task breakdown for complex requests
     */
    async breakdownComplexTask(description) {
        const tasks = [];
        
        // Analyze task complexity and requirements
        const analysis = this.analyzeTaskComplexity(description);
        
        if (analysis.requiresResearch) {
            tasks.push({
                id: this.generateTaskId(),
                type: 'research',
                agent: 'research-agent',
                description: `Research and analyze: ${description}`,
                priority: 'high',
                dependencies: []
            });
        }

        if (analysis.requiresImplementation) {
            tasks.push({
                id: this.generateTaskId(),
                type: 'implementation',
                agent: 'coding-agent',
                description: `Implement: ${description}`,
                priority: 'high',
                dependencies: analysis.requiresResearch ? [tasks[0].id] : []
            });
        }

        if (analysis.requiresTesting) {
            tasks.push({
                id: this.generateTaskId(),
                type: 'testing',
                agent: 'testing-agent',
                description: `Test and validate: ${description}`,
                priority: 'medium',
                dependencies: tasks.length > 0 ? [tasks[tasks.length - 1].id] : []
            });
        }

        return tasks;
    }

    /**
     * Analyze task complexity and determine required agents
     */
    analyzeTaskComplexity(description) {
        const keywords = description.toLowerCase();
        
        return {
            requiresResearch: this.containsKeywords(keywords, [
                'research', 'analyze', 'best practices', 'documentation', 
                'standards', 'requirements', 'specification'
            ]),
            
            requiresImplementation: this.containsKeywords(keywords, [
                'implement', 'create', 'build', 'develop', 'code',
                'feature', 'system', 'component', 'function'
            ]),
            
            requiresTesting: this.containsKeywords(keywords, [
                'test', 'validate', 'quality', 'coverage', 'verify'
            ]) || this.containsKeywords(keywords, [
                'implement', 'create', 'build' // Auto-test implementations
            ]),
            
            complexity: this.assessComplexity(keywords),
            estimatedTime: this.estimateTime(keywords),
            parallelizable: this.isParallelizable(keywords)
        };
    }

    /**
     * Generate executable task for specific agent types
     */
    generateExecutableTask(task, agentType) {
        const executable = {
            ...task,
            commands: [],
            validation: [],
            outputs: []
        };

        switch (agentType) {
            case 'research-agent':
                if (task.type === 'research' || task.description.includes('ultrathink')) {
                    executable.commands.push({
                        type: 'ultrathink',
                        command: `/ultrathink "${task.description}"`,
                        timeout: 300000 // 5 minutes
                    });
                }
                break;

            case 'coding-agent':
                if (task.type === 'implementation') {
                    executable.commands.push({
                        type: 'implementation',
                        steps: this.generateImplementationSteps(task.description),
                        validation: ['syntax-check', 'lint', 'type-check']
                    });
                }
                break;

            case 'testing-agent':
                if (task.type === 'testing') {
                    executable.commands.push({
                        type: 'testing',
                        steps: ['create-tests', 'run-tests', 'coverage-check'],
                        target: task.target || 'auto-detect',
                        threshold: 0.95
                    });
                }
                break;
        }

        return executable;
    }

    /**
     * Parse agent communication for inter-agent requests
     */
    parseInterAgentCommunication(message) {
        const communication = {
            from: message.agent,
            to: message.metadata.target,
            type: 'request',
            content: message.content,
            requiresResponse: true,
            priority: 'normal'
        };

        // Detect request types
        if (message.content.includes('please')) {
            communication.type = 'polite-request';
        } else if (message.content.includes('urgent') || message.content.includes('critical')) {
            communication.priority = 'high';
        } else if (message.content.includes('when available')) {
            communication.priority = 'low';
        }

        return communication;
    }

    /**
     * Utility methods
     */
    generateTaskId() {
        return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    assessComplexity(keywords) {
        const complexKeywords = [
            'system', 'architecture', 'integration', 'security', 
            'performance', 'scalability', 'microservices'
        ];
        
        const complexCount = complexKeywords.filter(k => keywords.includes(k)).length;
        
        if (complexCount >= 3) return 'high';
        if (complexCount >= 1) return 'medium';
        return 'low';
    }

    estimateTime(keywords) {
        // Simple heuristic for time estimation
        const timeIndicators = {
            'quick': 15,
            'simple': 30,
            'implement': 120,
            'system': 240,
            'architecture': 480
        };

        let totalMinutes = 60; // Default 1 hour
        
        for (const [keyword, minutes] of Object.entries(timeIndicators)) {
            if (keywords.includes(keyword)) {
                totalMinutes = Math.max(totalMinutes, minutes);
            }
        }

        return totalMinutes;
    }

    isParallelizable(keywords) {
        const parallelKeywords = ['frontend', 'backend', 'api', 'ui', 'database'];
        const sequentialKeywords = ['step', 'sequential', 'depends', 'after'];
        
        return this.containsKeywords(keywords, parallelKeywords) && 
               !this.containsKeywords(keywords, sequentialKeywords);
    }

    extractTaskDescription(content) {
        // Extract main task description from content
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.trim() && !line.startsWith('**') && !line.startsWith('-')) {
                return line.trim();
            }
        }
        return content.slice(0, 100) + '...';
    }

    extractRequirements(content) {
        const requirements = [];
        const lines = content.split('\n');
        
        let inRequirements = false;
        for (const line of lines) {
            if (line.includes('Requirements:') || line.includes('requirements:')) {
                inRequirements = true;
                continue;
            }
            
            if (inRequirements && line.startsWith('- ')) {
                requirements.push(line.slice(2).trim());
            } else if (inRequirements && line.trim() === '') {
                break;
            }
        }
        
        return requirements;
    }

    extractExpectedOutputs(content) {
        const outputs = [];
        const lines = content.split('\n');
        
        let inOutputs = false;
        for (const line of lines) {
            if (line.includes('Expected Output:') || line.includes('Deliverables:')) {
                inOutputs = true;
                continue;
            }
            
            if (inOutputs && line.startsWith('- ')) {
                outputs.push(line.slice(2).trim());
            } else if (inOutputs && line.trim() === '') {
                break;
            }
        }
        
        return outputs;
    }

    generateImplementationSteps(description) {
        // Generate specific implementation steps based on description
        const steps = ['analyze-requirements'];
        
        if (description.includes('api') || description.includes('backend')) {
            steps.push('create-api-structure', 'implement-endpoints', 'add-validation');
        }
        
        if (description.includes('ui') || description.includes('frontend')) {
            steps.push('create-components', 'implement-logic', 'add-styling');
        }
        
        if (description.includes('database') || description.includes('data')) {
            steps.push('design-schema', 'create-migrations', 'implement-queries');
        }
        
        steps.push('integrate-components', 'add-error-handling', 'update-documentation');
        
        return steps;
    }

    /**
     * Task status tracking
     */
    updateTaskStatus(taskId, status, output = null) {
        if (this.taskMap.has(taskId)) {
            const task = this.taskMap.get(taskId);
            task.status = status;
            task.lastUpdate = new Date().toISOString();
            
            if (output) {
                task.outputs.push({
                    timestamp: task.lastUpdate,
                    content: output
                });
            }
            
            this.taskMap.set(taskId, task);
        }
    }

    getTaskStatus(taskId) {
        return this.taskMap.get(taskId);
    }

    getAllTasks() {
        return Array.from(this.taskMap.values());
    }

    getTasksByAgent(agentName) {
        return this.getAllTasks().filter(task => task.agent === agentName);
    }

    getTasksByStatus(status) {
        return this.getAllTasks().filter(task => task.status === status);
    }
}

module.exports = TaskParser;