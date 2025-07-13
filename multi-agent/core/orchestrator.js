const EventEmitter = require('events');
const agentLoader = require('./agent-loader');
const agentRegistry = require('./agent-registry');
const agentExecutor = require('./agent-executor');
const contextManager = require('./context-manager');
const channelMonitor = require('./channel-monitor');
const channelRotator = require('./channel-rotator');
const agentGenerator = require('./agent-generator');
const dependencyCoordinator = require('./dependency-coordinator');
const { v4: uuidv4 } = require('uuid');

class Orchestrator extends EventEmitter {
    constructor(name = 'main-orchestrator') {
        super();
        this.name = name;
        this.workflows = new Map();
        this.runningWorkflows = new Map();
        this.agentInstances = new Map();
    }

    async initialize() {
        // Initialize context manager
        await contextManager.initialize();
        
        // Start channel monitor
        await channelMonitor.start();
        
        // Initialize dependency coordinator
        await dependencyCoordinator.initialize();
        
        // Subscribe to channel events
        channelMonitor.on('message', (msg) => this.handleChannelMessage(msg));
        
        // Set up channel rotation monitoring
        this.setupChannelRotation();
        
        // Load all available agents
        await this.loadAgents();
        
        // Generate phase-specific agents if needed
        await this.generatePhaseAgents();
        
        this.emit('orchestrator:initialized', { name: this.name });
    }

    async loadAgents() {
        const agents = await agentLoader.loadAllAgents();
        
        for (const [name, agent] of agents) {
            agentRegistry.register(name, agent);
        }
        
        this.emit('agents:loaded', { count: agents.size });
    }

    async generatePhaseAgents() {
        // Check current phase and generate appropriate agents
        const currentPhase = await this.getCurrentPhase();
        
        if (currentPhase) {
            const projectContext = await this.getProjectContext();
            const agents = await agentGenerator.generateAgentForPhase(currentPhase, projectContext);
            
            // Register generated agents
            for (const agent of agents) {
                const loaded = await agentLoader.loadAgent(agent.name);
                if (loaded) {
                    agentRegistry.register(agent.name, loaded);
                }
            }
            
            await contextManager.writeToChannel(this.name,
                `Generated ${agents.length} agents for ${currentPhase}`,
                { type: 'agents-generated', phase: currentPhase }
            );
        }
    }

    async getCurrentPhase() {
        try {
            const fs = require('fs').promises;
            const status = await fs.readFile('.vibe-status.md', 'utf8');
            const match = status.match(/Current Phase:\s*(phase-\d+)/i);
            return match ? match[1] : null;
        } catch (error) {
            return null;
        }
    }

    async getProjectContext() {
        try {
            const fs = require('fs').promises;
            const status = await fs.readFile('.vibe-status.md', 'utf8');
            return {
                projectName: status.match(/Project:\s*(.+)/)?.[1] || 'Unknown',
                type: status.match(/Type:\s*(.+)/)?.[1] || 'Unknown',
                phase: await this.getCurrentPhase()
            };
        } catch (error) {
            return { projectName: 'Unknown', type: 'Unknown' };
        }
    }

    setupChannelRotation() {
        // Check channel size periodically
        setInterval(async () => {
            const rotated = await channelRotator.checkRotation();
            if (rotated) {
                this.emit('channel:rotated');
            }
        }, 30000); // Check every 30 seconds
    }

    async defineWorkflow(workflowName, definition) {
        this.workflows.set(workflowName, definition);
        this.emit('workflow:defined', { name: workflowName });
    }

    async executeWorkflow(workflowName, context = {}) {
        const workflow = this.workflows.get(workflowName);
        
        if (!workflow) {
            throw new Error(`Workflow '${workflowName}' not found`);
        }

        const workflowId = uuidv4();
        const workflowContext = {
            id: workflowId,
            name: workflowName,
            startTime: new Date(),
            context,
            status: 'running',
            currentStep: 0,
            results: []
        };

        this.runningWorkflows.set(workflowId, workflowContext);

        try {
            // Write workflow start to channel
            await contextManager.writeToChannel(this.name,
                `Starting workflow: ${workflowName} (${workflowId})`,
                { type: 'workflow-start', workflowId }
            );

            // Execute workflow steps
            const results = await this.executeWorkflowSteps(workflow, workflowContext);

            // Update workflow context
            workflowContext.status = 'completed';
            workflowContext.endTime = new Date();
            workflowContext.results = results;

            // Write workflow completion
            await contextManager.writeToChannel(this.name,
                `Completed workflow: ${workflowName} (${workflowId})`,
                { type: 'workflow-complete', workflowId }
            );

            this.emit('workflow:completed', { workflowId, results });

            return {
                workflowId,
                status: 'completed',
                results
            };

        } catch (error) {
            workflowContext.status = 'failed';
            workflowContext.error = error.message;
            
            await contextManager.writeToChannel(this.name,
                `Workflow failed: ${workflowName} (${workflowId}) - ${error.message}`,
                { type: 'workflow-error', workflowId }
            );

            this.emit('workflow:failed', { workflowId, error });
            
            throw error;
        } finally {
            this.runningWorkflows.delete(workflowId);
        }
    }

    async executeWorkflowSteps(workflow, workflowContext) {
        const results = [];
        const steps = workflow.steps || [];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            workflowContext.currentStep = i;

            this.emit('step:start', { 
                workflowId: workflowContext.id, 
                stepIndex: i, 
                step 
            });

            try {
                const result = await this.executeStep(step, workflowContext);
                results.push(result);

                this.emit('step:complete', { 
                    workflowId: workflowContext.id, 
                    stepIndex: i, 
                    result 
                });

            } catch (error) {
                this.emit('step:failed', { 
                    workflowId: workflowContext.id, 
                    stepIndex: i, 
                    error 
                });

                if (!step.continueOnError) {
                    throw error;
                }

                results.push({ error: error.message });
            }
        }

        return results;
    }

    async executeStep(step, workflowContext) {
        const { type, agent, agents, params = {}, parallel = false } = step;

        switch (type) {
            case 'agent':
                return await this.executeSingleAgent(agent, params, workflowContext);
            
            case 'parallel':
                return await this.executeParallelAgents(agents || [], params, workflowContext);
            
            case 'sequential':
                return await this.executeSequentialAgents(agents || [], params, workflowContext);
            
            case 'conditional':
                return await this.executeConditional(step, workflowContext);
            
            case 'loop':
                return await this.executeLoop(step, workflowContext);
            
            case 'user-approval':
                return await this.requestUserApproval(step, workflowContext);
            
            default:
                throw new Error(`Unknown step type: ${type}`);
        }
    }

    async executeSingleAgent(agentName, params, workflowContext) {
        const agent = agentRegistry.get(agentName);
        
        if (!agent) {
            throw new Error(`Agent '${agentName}' not found`);
        }

        const instanceId = uuidv4();
        const context = {
            ...params,
            instanceId,
            workflowId: workflowContext.id,
            workflowContext: workflowContext.context,
            previousResults: workflowContext.results
        };

        // Track agent instance
        this.agentInstances.set(instanceId, {
            agentName,
            workflowId: workflowContext.id,
            startTime: new Date()
        });

        try {
            const result = await agent.execute(context);
            
            // Store result in shared context for other agents
            await contextManager.saveSharedContext(
                `${workflowContext.id}-${agentName}`,
                result
            );

            return {
                agent: agentName,
                instanceId,
                result
            };

        } finally {
            this.agentInstances.delete(instanceId);
        }
    }

    async executeParallelAgents(agents, params, workflowContext) {
        const promises = agents.map(agentName => 
            this.executeSingleAgent(agentName, params, workflowContext)
                .catch(error => ({ agent: agentName, error: error.message }))
        );

        return await Promise.all(promises);
    }

    async executeSequentialAgents(agents, params, workflowContext) {
        const results = [];
        let previousResult = null;

        for (const agentName of agents) {
            const agentParams = {
                ...params,
                previousResult
            };

            const result = await this.executeSingleAgent(agentName, agentParams, workflowContext);
            results.push(result);
            previousResult = result;
        }

        return results;
    }

    async executeConditional(step, workflowContext) {
        const { condition, then: thenSteps, else: elseSteps } = step;
        
        const conditionMet = await this.evaluateCondition(condition, workflowContext);
        
        const stepsToExecute = conditionMet ? thenSteps : elseSteps;
        
        if (!stepsToExecute || stepsToExecute.length === 0) {
            return { conditionMet, executed: false };
        }

        const subWorkflow = {
            steps: stepsToExecute
        };

        const results = await this.executeWorkflowSteps(subWorkflow, workflowContext);
        
        return {
            conditionMet,
            executed: true,
            results
        };
    }

    async executeLoop(step, workflowContext) {
        const { condition, steps, maxIterations = 100 } = step;
        const results = [];
        let iteration = 0;

        while (iteration < maxIterations) {
            const shouldContinue = await this.evaluateCondition(condition, {
                ...workflowContext,
                loopIteration: iteration,
                loopResults: results
            });

            if (!shouldContinue) {
                break;
            }

            const subWorkflow = { steps };
            const iterationResults = await this.executeWorkflowSteps(subWorkflow, workflowContext);
            results.push(iterationResults);
            
            iteration++;
        }

        return {
            iterations: iteration,
            results
        };
    }

    async requestUserApproval(step, workflowContext) {
        const { message, timeout = 300000 } = step; // 5 minute default timeout

        await contextManager.writeToChannel(this.name,
            `User approval required: ${message}`,
            { 
                type: 'user-approval',
                workflowId: workflowContext.id,
                stepIndex: workflowContext.currentStep
            }
        );

        // In a real implementation, this would wait for user input
        // For now, we'll simulate approval
        return {
            approved: true,
            timestamp: new Date().toISOString(),
            message: 'Auto-approved for demonstration'
        };
    }

    async evaluateCondition(condition, context) {
        if (typeof condition === 'function') {
            return await condition(context);
        }

        if (typeof condition === 'object') {
            const { type, field, operator, value } = condition;
            
            if (type === 'field') {
                const fieldValue = this.getFieldValue(context, field);
                return this.compareValues(fieldValue, operator, value);
            }
            
            if (type === 'script') {
                // Evaluate JavaScript expression
                try {
                    const fn = new Function('context', `return ${condition.expression}`);
                    return fn(context);
                } catch (error) {
                    console.error('Condition evaluation error:', error);
                    return false;
                }
            }
        }

        return Boolean(condition);
    }

    getFieldValue(context, field) {
        const parts = field.split('.');
        let value = context;
        
        for (const part of parts) {
            if (value && typeof value === 'object') {
                value = value[part];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    compareValues(fieldValue, operator, targetValue) {
        switch (operator) {
            case 'equals':
            case '==':
                return fieldValue == targetValue;
            case 'strictEquals':
            case '===':
                return fieldValue === targetValue;
            case 'notEquals':
            case '!=':
                return fieldValue != targetValue;
            case 'greaterThan':
            case '>':
                return fieldValue > targetValue;
            case 'lessThan':
            case '<':
                return fieldValue < targetValue;
            case 'contains':
                return fieldValue && fieldValue.includes && fieldValue.includes(targetValue);
            case 'exists':
                return fieldValue !== undefined && fieldValue !== null;
            case 'notExists':
                return fieldValue === undefined || fieldValue === null;
            default:
                return false;
        }
    }

    handleChannelMessage(message) {
        // Handle inter-agent communication
        if (message.metadata.type === 'agent-request' && message.metadata.target === this.name) {
            this.handleAgentRequest(message);
        }
    }

    async handleAgentRequest(message) {
        // Parse request from message
        try {
            const request = JSON.parse(message.content);
            
            if (request.action === 'invoke-agent') {
                const result = await this.executeSingleAgent(
                    request.agent,
                    request.params || {},
                    { id: 'direct-invocation', context: {} }
                );
                
                await contextManager.writeToChannel(this.name,
                    JSON.stringify(result),
                    { 
                        type: 'agent-response',
                        target: message.agent
                    }
                );
            }
        } catch (error) {
            await contextManager.writeToChannel(this.name,
                `Error handling request: ${error.message}`,
                { 
                    type: 'agent-error',
                    target: message.agent
                }
            );
        }
    }

    async getWorkflowStatus(workflowId) {
        const workflow = this.runningWorkflows.get(workflowId);
        
        if (!workflow) {
            return { status: 'not-found' };
        }
        
        return {
            id: workflow.id,
            name: workflow.name,
            status: workflow.status,
            currentStep: workflow.currentStep,
            startTime: workflow.startTime,
            endTime: workflow.endTime,
            error: workflow.error
        };
    }

    async stopWorkflow(workflowId) {
        const workflow = this.runningWorkflows.get(workflowId);
        
        if (!workflow) {
            return false;
        }
        
        workflow.status = 'stopped';
        this.runningWorkflows.delete(workflowId);
        
        await contextManager.writeToChannel(this.name,
            `Workflow stopped: ${workflow.name} (${workflowId})`,
            { type: 'workflow-stopped', workflowId }
        );
        
        return true;
    }

    async shutdown() {
        // Stop all running workflows
        for (const [workflowId, workflow] of this.runningWorkflows) {
            await this.stopWorkflow(workflowId);
        }
        
        // Stop channel monitor
        await channelMonitor.stop();
        
        // Clear registries
        agentRegistry.clear();
        
        this.emit('orchestrator:shutdown', { name: this.name });
    }
}

module.exports = Orchestrator;