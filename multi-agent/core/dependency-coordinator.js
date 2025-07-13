const EventEmitter = require('events');
const contextManager = require('./context-manager');
const channelMonitor = require('./channel-monitor');

class DependencyCoordinator extends EventEmitter {
    constructor() {
        super();
        this.dependencies = new Map();
        this.completedTasks = new Set();
        this.waitingAgents = new Map();
        this.blockingChains = new Map();
    }

    async initialize() {
        // Monitor channel for dependency-related messages
        channelMonitor.on('message', (msg) => this.handleMessage(msg));
    }

    async registerDependency(agent, dependency) {
        if (!this.dependencies.has(agent)) {
            this.dependencies.set(agent, []);
        }
        
        this.dependencies.get(agent).push({
            ...dependency,
            status: 'pending',
            registeredAt: new Date()
        });

        // Check if dependency is already satisfied
        await this.checkDependency(agent, dependency);
    }

    async handleMessage(message) {
        // Handle completion messages
        if (message.metadata.type === 'task-complete') {
            const completedTask = {
                agent: message.agent,
                task: message.content,
                timestamp: message.timestamp
            };
            
            this.completedTasks.add(JSON.stringify(completedTask));
            await this.notifyWaitingAgents(completedTask);
        }

        // Handle dependency requests
        if (message.metadata.type === 'dependency-check') {
            await this.respondToDependencyCheck(message);
        }

        // Handle blocking notifications
        if (message.metadata.type === 'blocked-by-dependency') {
            await this.handleBlockedAgent(message);
        }
    }

    async checkDependency(agent, dependency) {
        const isSatisfied = await this.isDependencySatisfied(dependency);
        
        if (isSatisfied) {
            await this.notifyAgentDependencyMet(agent, dependency);
        } else {
            // Add to waiting list
            if (!this.waitingAgents.has(dependency.id)) {
                this.waitingAgents.set(dependency.id, []);
            }
            this.waitingAgents.get(dependency.id).push(agent);
        }
        
        return isSatisfied;
    }

    async isDependencySatisfied(dependency) {
        switch (dependency.type) {
            case 'task-complete':
                return this.isTaskComplete(dependency.agent, dependency.task);
            
            case 'phase-complete':
                return await this.isPhaseComplete(dependency.phase);
            
            case 'file-exists':
                return await this.doesFileExist(dependency.path);
            
            case 'context-available':
                return await this.isContextAvailable(dependency.key);
            
            case 'agent-ready':
                return await this.isAgentReady(dependency.agent);
            
            default:
                return false;
        }
    }

    isTaskComplete(agent, task) {
        const taskKey = JSON.stringify({ agent, task });
        return Array.from(this.completedTasks).some(completed => 
            completed.includes(agent) && completed.includes(task)
        );
    }

    async isPhaseComplete(phase) {
        try {
            const statusPath = `.vibe-status.md`;
            const fs = require('fs').promises;
            const status = await fs.readFile(statusPath, 'utf8');
            return status.includes(`${phase}: ✅ Complete`);
        } catch (error) {
            return false;
        }
    }

    async doesFileExist(filePath) {
        try {
            const fs = require('fs').promises;
            await fs.access(filePath);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isContextAvailable(key) {
        const context = await contextManager.loadSharedContext(key);
        return context !== null;
    }

    async isAgentReady(agentName) {
        // Check if agent has sent a ready message
        const messages = await channelMonitor.getMessages({
            agent: agentName,
            type: 'agent-ready'
        });
        return messages.length > 0;
    }

    async notifyWaitingAgents(completedTask) {
        // Check all waiting agents to see if their dependencies are now met
        for (const [dependencyId, agents] of this.waitingAgents) {
            for (const agent of agents) {
                const deps = this.dependencies.get(agent) || [];
                
                for (const dep of deps) {
                    if (await this.isDependencySatisfied(dep)) {
                        await this.notifyAgentDependencyMet(agent, dep);
                    }
                }
            }
        }
    }

    async notifyAgentDependencyMet(agent, dependency) {
        await contextManager.writeToChannel('dependency-coordinator',
            `Dependency satisfied for ${agent}: ${JSON.stringify(dependency)}`,
            {
                type: 'dependency-satisfied',
                target: agent
            }
        );
        
        this.emit('dependency:satisfied', { agent, dependency });
    }

    async handleBlockedAgent(message) {
        const { agent, blockedBy, estimatedWait } = JSON.parse(message.content);
        
        // Track blocking chains
        if (!this.blockingChains.has(agent)) {
            this.blockingChains.set(agent, []);
        }
        this.blockingChains.get(agent).push({
            blockedBy,
            since: new Date(),
            estimatedWait
        });

        // Check for circular dependencies
        const circular = this.detectCircularDependency(agent);
        if (circular) {
            await this.handleCircularDependency(circular);
        }

        // Notify orchestrator of blocking
        await contextManager.writeToChannel('dependency-coordinator',
            `BLOCKING: ${agent} is blocked by ${blockedBy}`,
            {
                type: 'agent-blocked',
                severity: 'warning'
            }
        );
    }

    detectCircularDependency(agent, visited = new Set()) {
        if (visited.has(agent)) {
            return Array.from(visited);
        }
        
        visited.add(agent);
        
        const blocks = this.blockingChains.get(agent) || [];
        for (const block of blocks) {
            const circular = this.detectCircularDependency(block.blockedBy, visited);
            if (circular) {
                return circular;
            }
        }
        
        visited.delete(agent);
        return null;
    }

    async handleCircularDependency(agents) {
        await contextManager.writeToChannel('dependency-coordinator',
            `CRITICAL: Circular dependency detected: ${agents.join(' -> ')}`,
            {
                type: 'circular-dependency',
                severity: 'critical',
                agents: agents
            }
        );
        
        // Request orchestrator intervention
        this.emit('circular:dependency', { agents });
    }

    async requestDependencyStatus(agent) {
        const deps = this.dependencies.get(agent) || [];
        const status = {
            agent,
            totalDependencies: deps.length,
            satisfied: 0,
            pending: 0,
            blocked: 0,
            details: []
        };
        
        for (const dep of deps) {
            const isSatisfied = await this.isDependencySatisfied(dep);
            if (isSatisfied) {
                status.satisfied++;
                dep.status = 'satisfied';
            } else {
                status.pending++;
                dep.status = 'pending';
            }
            
            status.details.push({
                ...dep,
                isSatisfied
            });
        }
        
        return status;
    }

    async visualizeDependencyGraph() {
        const graph = {
            nodes: [],
            edges: []
        };
        
        // Add all agents as nodes
        for (const [agent, deps] of this.dependencies) {
            graph.nodes.push({
                id: agent,
                type: 'agent',
                blocked: this.blockingChains.has(agent)
            });
            
            // Add edges for dependencies
            for (const dep of deps) {
                if (dep.agent) {
                    graph.edges.push({
                        from: agent,
                        to: dep.agent,
                        type: dep.type,
                        satisfied: await this.isDependencySatisfied(dep)
                    });
                }
            }
        }
        
        return graph;
    }

    async resolveDependencyConflict(agent1, agent2, resource) {
        // Implement priority-based resolution
        const priority1 = await this.getAgentPriority(agent1);
        const priority2 = await this.getAgentPriority(agent2);
        
        const winner = priority1 > priority2 ? agent1 : agent2;
        const waiter = winner === agent1 ? agent2 : agent1;
        
        await contextManager.writeToChannel('dependency-coordinator',
            `Dependency conflict resolved: ${winner} gets priority for ${resource}`,
            {
                type: 'conflict-resolved',
                winner,
                waiter,
                resource
            }
        );
        
        return { winner, waiter };
    }

    async getAgentPriority(agent) {
        // Priority based on phase and role
        const phaseMatch = agent.match(/phase-(\d+)/);
        const phasePriority = phaseMatch ? parseInt(phaseMatch[1]) : 5;
        
        const rolePriority = {
            'orchestrator': 10,
            'primary': 8,
            'support': 5,
            'helper': 3
        };
        
        const role = await this.getAgentRole(agent);
        return (10 - phasePriority) + (rolePriority[role] || 5);
    }

    async getAgentRole(agent) {
        // Look up agent role from registry
        const agentRegistry = require('./agent-registry');
        const agentDef = agentRegistry.get(agent);
        return agentDef?.config?.agent?.role || 'support';
    }

    async broadcastDependencyUpdate(update) {
        await contextManager.writeToChannel('dependency-coordinator',
            JSON.stringify(update),
            {
                type: 'dependency-update',
                target: 'all-agents'
            }
        );
    }

    getDependencyMetrics() {
        const metrics = {
            totalDependencies: 0,
            satisfiedDependencies: 0,
            waitingAgents: this.waitingAgents.size,
            blockedAgents: this.blockingChains.size,
            circularDependencies: 0
        };
        
        for (const [agent, deps] of this.dependencies) {
            metrics.totalDependencies += deps.length;
            metrics.satisfiedDependencies += deps.filter(d => d.status === 'satisfied').length;
        }
        
        return metrics;
    }
}

module.exports = new DependencyCoordinator();