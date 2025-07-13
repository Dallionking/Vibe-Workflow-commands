const EventEmitter = require('events');

class AgentRegistry extends EventEmitter {
    constructor() {
        super();
        this.agents = new Map();
        this.runningAgents = new Map();
        this.agentCapabilities = new Map();
        this.agentDependencies = new Map();
    }

    register(agentName, agentDefinition) {
        if (this.agents.has(agentName)) {
            throw new Error(`Agent '${agentName}' is already registered`);
        }

        this.agents.set(agentName, agentDefinition);
        
        // Extract and index capabilities
        if (agentDefinition.config && agentDefinition.config.capabilities) {
            this.agentCapabilities.set(agentName, Object.keys(agentDefinition.config.capabilities));
        }

        // Extract and index dependencies
        if (agentDefinition.config && agentDefinition.config.dependencies) {
            this.agentDependencies.set(agentName, agentDefinition.config.dependencies);
        }

        this.emit('agent:registered', { name: agentName, definition: agentDefinition });
        return true;
    }

    unregister(agentName) {
        if (!this.agents.has(agentName)) {
            return false;
        }

        // Check if agent is running
        if (this.runningAgents.has(agentName)) {
            throw new Error(`Cannot unregister agent '${agentName}' while it's running`);
        }

        this.agents.delete(agentName);
        this.agentCapabilities.delete(agentName);
        this.agentDependencies.delete(agentName);

        this.emit('agent:unregistered', { name: agentName });
        return true;
    }

    get(agentName) {
        return this.agents.get(agentName);
    }

    has(agentName) {
        return this.agents.has(agentName);
    }

    list() {
        return Array.from(this.agents.keys());
    }

    listByCapability(capability) {
        const matchingAgents = [];
        
        for (const [agentName, capabilities] of this.agentCapabilities) {
            if (capabilities.includes(capability)) {
                matchingAgents.push(agentName);
            }
        }
        
        return matchingAgents;
    }

    listByType(type) {
        const matchingAgents = [];
        
        for (const [name, definition] of this.agents) {
            if (definition.type === type) {
                matchingAgents.push(name);
            }
        }
        
        return matchingAgents;
    }

    async startAgent(agentName, instanceId, context) {
        if (!this.agents.has(agentName)) {
            throw new Error(`Agent '${agentName}' not found in registry`);
        }

        const runningKey = `${agentName}:${instanceId}`;
        if (this.runningAgents.has(runningKey)) {
            throw new Error(`Agent instance '${runningKey}' is already running`);
        }

        this.runningAgents.set(runningKey, {
            agentName,
            instanceId,
            startTime: new Date(),
            context,
            status: 'running'
        });

        this.emit('agent:started', { agentName, instanceId });
    }

    async stopAgent(agentName, instanceId) {
        const runningKey = `${agentName}:${instanceId}`;
        
        if (!this.runningAgents.has(runningKey)) {
            return false;
        }

        const instance = this.runningAgents.get(runningKey);
        instance.status = 'stopped';
        instance.endTime = new Date();

        this.runningAgents.delete(runningKey);
        this.emit('agent:stopped', { agentName, instanceId, duration: instance.endTime - instance.startTime });
        
        return true;
    }

    getRunningAgents() {
        return Array.from(this.runningAgents.values());
    }

    getAgentInstances(agentName) {
        const instances = [];
        
        for (const [key, instance] of this.runningAgents) {
            if (instance.agentName === agentName) {
                instances.push(instance);
            }
        }
        
        return instances;
    }

    validateDependencies(agentName) {
        const dependencies = this.agentDependencies.get(agentName) || [];
        const missing = [];

        for (const dep of dependencies) {
            if (!this.agents.has(dep)) {
                missing.push(dep);
            }
        }

        return {
            valid: missing.length === 0,
            missing
        };
    }

    getAgentMetrics() {
        const metrics = {};
        
        for (const [name, definition] of this.agents) {
            metrics[name] = {
                type: definition.type,
                capabilities: this.agentCapabilities.get(name) || [],
                dependencies: this.agentDependencies.get(name) || [],
                instances: this.getAgentInstances(name).length
            };
        }
        
        return metrics;
    }

    clear() {
        this.agents.clear();
        this.runningAgents.clear();
        this.agentCapabilities.clear();
        this.agentDependencies.clear();
        this.emit('registry:cleared');
    }
}

module.exports = new AgentRegistry();