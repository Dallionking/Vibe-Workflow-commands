class LoadBalancer {
    constructor() {
        this.agentWorkloads = new Map();
        this.taskQueue = [];
        this.agentSpecializations = new Map();
    }

    async distributeWork(tasks, agents) {
        // Group tasks by type
        const taskGroups = this.groupTasksByType(tasks);
        
        // Assign tasks based on agent specialization
        const assignments = new Map();
        
        for (const [agentName, agent] of agents) {
            const specialization = this.agentSpecializations.get(agentName);
            const relevantTasks = this.findRelevantTasks(taskGroups, specialization);
            
            assignments.set(agentName, relevantTasks);
            
            // Update workload tracking
            this.agentWorkloads.set(agentName, {
                taskCount: relevantTasks.length,
                estimatedTime: this.estimateTime(relevantTasks),
                status: 'assigned'
            });
        }
        
        return assignments;
    }

    groupTasksByType(tasks) {
        const groups = {
            frontend: [],
            backend: [],
            database: [],
            testing: [],
            documentation: [],
            integration: []
        };
        
        tasks.forEach(task => {
            const type = this.determineTaskType(task);
            if (groups[type]) {
                groups[type].push(task);
            }
        });
        
        return groups;
    }

    determineTaskType(task) {
        const taskName = task.name.toLowerCase();
        
        if (taskName.includes('component') || taskName.includes('ui') || taskName.includes('view')) {
            return 'frontend';
        } else if (taskName.includes('api') || taskName.includes('endpoint') || taskName.includes('service')) {
            return 'backend';
        } else if (taskName.includes('schema') || taskName.includes('migration') || taskName.includes('query')) {
            return 'database';
        } else if (taskName.includes('test') || taskName.includes('spec')) {
            return 'testing';
        } else if (taskName.includes('docs') || taskName.includes('readme')) {
            return 'documentation';
        }
        
        return 'integration';
    }

    findRelevantTasks(taskGroups, specialization) {
        if (!specialization) return [];
        
        const relevantTasks = [];
        specialization.expertise.forEach(area => {
            if (taskGroups[area]) {
                relevantTasks.push(...taskGroups[area]);
            }
        });
        
        return relevantTasks;
    }

    async rebalanceWork() {
        // Find overloaded agents
        const overloaded = [];
        const underutilized = [];
        
        for (const [agent, workload] of this.agentWorkloads) {
            if (workload.taskCount > 10) {
                overloaded.push(agent);
            } else if (workload.taskCount < 3) {
                underutilized.push(agent);
            }
        }
        
        // Redistribute tasks
        if (overloaded.length > 0 && underutilized.length > 0) {
            // Move tasks from overloaded to underutilized agents
            console.log(`Rebalancing work: ${overloaded.length} overloaded, ${underutilized.length} underutilized`);
        }
    }

    registerSpecialization(agentName, specialization) {
        this.agentSpecializations.set(agentName, {
            expertise: specialization.expertise || [],
            capacity: specialization.capacity || 5,
            speed: specialization.speed || 1.0
        });
    }

    estimateTime(tasks) {
        // Simple estimation: 10 minutes per task
        return tasks.length * 10;
    }

    getWorkloadStatus() {
        const status = {
            totalAgents: this.agentWorkloads.size,
            totalTasks: 0,
            agentStatus: []
        };
        
        for (const [agent, workload] of this.agentWorkloads) {
            status.totalTasks += workload.taskCount;
            status.agentStatus.push({
                agent,
                tasks: workload.taskCount,
                estimatedTime: workload.estimatedTime,
                status: workload.status
            });
        }
        
        return status;
    }
}

module.exports = new LoadBalancer();