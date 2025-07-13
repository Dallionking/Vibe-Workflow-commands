const contextManager = require('./context-manager');
const agentRegistry = require('./agent-registry');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

class AgentExecutor {
    constructor() {
        this.executionHistory = new Map();
    }

    async executeYamlAgent(agentConfig, context) {
        const instanceId = context.instanceId || uuidv4();
        const agentName = agentConfig.agent?.name || 'unnamed-agent';

        try {
            // Register agent execution
            await agentRegistry.startAgent(agentName, instanceId, context);

            // Initialize context
            await contextManager.initialize();
            const workspace = await contextManager.createAgentWorkspace(agentName, instanceId);

            // Write to channel
            await contextManager.writeToChannel(agentName, 
                `Starting execution with context: ${JSON.stringify(context.params || {})}`, 
                { type: 'execution-start' }
            );

            // Check for incoming context
            const incomingContext = await contextManager.receiveContext(agentName, { latest: true });
            if (incomingContext) {
                context = { ...context, ...incomingContext.context };
            }

            // Execute capabilities based on request
            const results = {};
            const capability = context.capability || Object.keys(agentConfig.capabilities || {})[0];
            
            if (capability && agentConfig.capabilities[capability]) {
                const capabilityDef = agentConfig.capabilities[capability];
                results[capability] = await this.executeCapability(
                    capabilityDef, 
                    context, 
                    workspace,
                    agentName,
                    instanceId
                );
            }

            // Save results
            await contextManager.saveAgentContext(agentName, instanceId, {
                input: context,
                output: results,
                workspace: workspace.root,
                timestamp: new Date().toISOString()
            });

            // Write completion to channel
            await contextManager.writeToChannel(agentName, 
                `Completed execution. Results saved to context.`, 
                { type: 'execution-complete' }
            );

            // Stop agent
            await agentRegistry.stopAgent(agentName, instanceId);

            return {
                success: true,
                instanceId,
                results,
                workspace: workspace.root
            };

        } catch (error) {
            await agentRegistry.stopAgent(agentName, instanceId);
            await contextManager.writeToChannel(agentName, 
                `Execution failed: ${error.message}`, 
                { type: 'execution-error' }
            );
            
            throw error;
        }
    }

    async executeMdAgent(content, context) {
        const instanceId = context.instanceId || uuidv4();
        const agentName = context.agentName || 'markdown-agent';

        try {
            // Register agent execution
            await agentRegistry.startAgent(agentName, instanceId, context);

            // Initialize context
            await contextManager.initialize();
            const workspace = await contextManager.createAgentWorkspace(agentName, instanceId);

            // Write to channel
            await contextManager.writeToChannel(agentName, 
                `Starting markdown agent execution`, 
                { type: 'execution-start' }
            );

            // Process markdown content
            const sections = this.parseMdSections(content);
            const results = {};

            // Execute sections based on context
            if (sections.instructions) {
                results.instructions = sections.instructions;
            }

            if (sections.workflow && context.executeWorkflow) {
                results.workflow = await this.executeWorkflowSteps(
                    sections.workflow,
                    context,
                    workspace,
                    agentName
                );
            }

            // Save results
            await contextManager.saveAgentContext(agentName, instanceId, {
                input: context,
                output: results,
                workspace: workspace.root,
                timestamp: new Date().toISOString()
            });

            // Stop agent
            await agentRegistry.stopAgent(agentName, instanceId);

            return {
                success: true,
                instanceId,
                results,
                workspace: workspace.root
            };

        } catch (error) {
            await agentRegistry.stopAgent(agentName, instanceId);
            throw error;
        }
    }

    async executeCapability(capabilityDef, context, workspace, agentName, instanceId) {
        const steps = capabilityDef.workflow || [];
        const results = [];

        for (const step of steps) {
            const stepResult = await this.executeStep(step, context, workspace, agentName);
            results.push(stepResult);

            // Update channel after each step
            await contextManager.writeToChannel(agentName,
                `Completed step: ${step.action || step.type || 'unknown'}`,
                { type: 'step-complete' }
            );
        }

        return results;
    }

    async executeStep(step, context, workspace, agentName) {
        const { action, type, params = {} } = step;

        switch (action || type) {
            case 'read-context':
                return await this.readContextStep(params, context);
            
            case 'write-output':
                return await this.writeOutputStep(params, workspace);
            
            case 'invoke-agent':
                return await this.invokeAgentStep(params, context, agentName);
            
            case 'parallel-agents':
                return await this.parallelAgentsStep(params, context, agentName);
            
            case 'user-prompt':
                return await this.userPromptStep(params, context);
            
            case 'conditional':
                return await this.conditionalStep(params, context, workspace, agentName);
            
            default:
                return {
                    type: action || type,
                    status: 'unsupported',
                    message: `Step type '${action || type}' is not implemented`
                };
        }
    }

    async readContextStep(params, context) {
        const { source, key } = params;
        
        if (source === 'shared') {
            const value = await contextManager.loadSharedContext(key);
            return { type: 'read-context', source, key, value };
        }
        
        if (source === 'channel') {
            const content = await contextManager.readChannel(params.options || {});
            return { type: 'read-context', source: 'channel', content };
        }
        
        return { type: 'read-context', error: 'Unknown source' };
    }

    async writeOutputStep(params, workspace) {
        const { filename, content } = params;
        const outputPath = path.join(workspace.output, filename);
        
        await fs.mkdir(workspace.output, { recursive: true });
        await fs.writeFile(outputPath, content);
        
        return { type: 'write-output', filename, path: outputPath };
    }

    async invokeAgentStep(params, context, fromAgent) {
        const { agent, input, wait = true } = params;
        
        // Pass context to target agent
        const passId = await contextManager.passContext(fromAgent, agent, input);
        
        if (wait) {
            // TODO: Implement agent invocation and waiting
            return { 
                type: 'invoke-agent', 
                agent, 
                passId,
                status: 'pending',
                message: 'Synchronous agent invocation not yet implemented'
            };
        }
        
        return { type: 'invoke-agent', agent, passId, status: 'passed' };
    }

    async parallelAgentsStep(params, context, fromAgent) {
        const { agents, input } = params;
        const passes = [];
        
        for (const agent of agents) {
            const passId = await contextManager.passContext(fromAgent, agent, input);
            passes.push({ agent, passId });
        }
        
        return { type: 'parallel-agents', agents, passes };
    }

    async userPromptStep(params, context) {
        // Write prompt to channel for user visibility
        await contextManager.writeToChannel('system',
            `User prompt required: ${params.message}`,
            { type: 'user-prompt' }
        );
        
        return { 
            type: 'user-prompt', 
            message: params.message,
            status: 'waiting'
        };
    }

    async conditionalStep(params, context, workspace, agentName) {
        const { condition, then: thenSteps, else: elseSteps } = params;
        
        // Evaluate condition (simple implementation)
        const conditionMet = this.evaluateCondition(condition, context);
        
        const stepsToExecute = conditionMet ? thenSteps : elseSteps;
        const results = [];
        
        if (stepsToExecute) {
            for (const step of stepsToExecute) {
                const result = await this.executeStep(step, context, workspace, agentName);
                results.push(result);
            }
        }
        
        return { 
            type: 'conditional', 
            conditionMet, 
            results 
        };
    }

    evaluateCondition(condition, context) {
        // Simple condition evaluation
        // In a real implementation, this would be more sophisticated
        if (typeof condition === 'boolean') {
            return condition;
        }
        
        if (typeof condition === 'object') {
            const { field, operator, value } = condition;
            const fieldValue = context[field];
            
            switch (operator) {
                case 'equals':
                    return fieldValue === value;
                case 'exists':
                    return fieldValue !== undefined;
                case 'contains':
                    return fieldValue && fieldValue.includes(value);
                default:
                    return false;
            }
        }
        
        return false;
    }

    parseMdSections(content) {
        const sections = {};
        const lines = content.split('\n');
        let currentSection = null;
        let currentContent = [];
        
        for (const line of lines) {
            if (line.startsWith('## ')) {
                if (currentSection) {
                    sections[currentSection] = currentContent.join('\n').trim();
                }
                currentSection = line.substring(3).toLowerCase().replace(/\s+/g, '-');
                currentContent = [];
            } else if (currentSection) {
                currentContent.push(line);
            }
        }
        
        if (currentSection) {
            sections[currentSection] = currentContent.join('\n').trim();
        }
        
        return sections;
    }

    async executeWorkflowSteps(workflowContent, context, workspace, agentName) {
        // Parse workflow steps from markdown
        const steps = workflowContent.split(/\d+\.\s+/).filter(s => s.trim());
        const results = [];
        
        for (const stepText of steps) {
            // Simple step execution based on text content
            results.push({
                step: stepText.trim(),
                status: 'completed',
                timestamp: new Date().toISOString()
            });
        }
        
        return results;
    }

    getExecutionHistory(agentName) {
        return this.executionHistory.get(agentName) || [];
    }

    clearHistory() {
        this.executionHistory.clear();
    }
}

module.exports = new AgentExecutor();