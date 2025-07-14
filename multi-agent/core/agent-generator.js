const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class AgentGenerator {
    constructor() {
        this.agentTemplates = new Map();
        this.phaseAgentMappings = this.definePhaseAgentMappings();
    }

    definePhaseAgentMappings() {
        return {
            'phase-1': {
                name: 'Ideation & Specification',
                agents: [
                    { name: 'ideation-agent', role: 'primary' },
                    { name: 'market-researcher', role: 'support' },
                    { name: 'requirement-analyst', role: 'support' }
                ]
            },
            'phase-2': {
                name: 'Technical Architecture',
                agents: [
                    { name: 'system-architect', role: 'primary' },
                    { name: 'database-designer', role: 'support' },
                    { name: 'api-designer', role: 'support' },
                    { name: 'security-architect', role: 'support' }
                ]
            },
            'phase-3': {
                name: 'UX Design',
                agents: [
                    { name: 'ux-designer', role: 'primary' },
                    { name: 'user-researcher', role: 'support' },
                    { name: 'accessibility-specialist', role: 'support' }
                ]
            },
            'phase-4': {
                name: 'Design System',
                agents: [
                    { name: 'design-system-architect', role: 'primary' },
                    { name: 'component-designer', role: 'support' },
                    { name: 'style-guide-creator', role: 'support' }
                ]
            },
            'phase-5': {
                name: 'Interface States',
                agents: [
                    { name: 'state-designer', role: 'primary' },
                    { name: 'interaction-designer', role: 'support' },
                    { name: 'animation-specialist', role: 'support' }
                ]
            },
            'phase-6': {
                name: 'Technical Specification',
                agents: [
                    { name: 'tech-spec-writer', role: 'primary' },
                    { name: 'api-documenter', role: 'support' },
                    { name: 'integration-planner', role: 'support' }
                ]
            },
            'phase-7': {
                name: 'Landing Page',
                agents: [
                    { name: 'copywriter', role: 'primary' },
                    { name: 'seo-specialist', role: 'support' },
                    { name: 'conversion-optimizer', role: 'support' }
                ]
            },
            'phase-8': {
                name: 'Vertical Slices',
                agents: [
                    { name: 'slice-coordinator', role: 'primary' },
                    { name: 'frontend-implementer', role: 'support' },
                    { name: 'backend-implementer', role: 'support' },
                    { name: 'test-implementer', role: 'support' }
                ]
            },
            'phase-9': {
                name: 'Claude.md Generation',
                agents: [
                    { name: 'documentation-orchestrator', role: 'primary' },
                    { name: 'code-example-generator', role: 'support' },
                    { name: 'best-practices-writer', role: 'support' }
                ]
            },
            'phase-10': {
                name: 'Init Services & Deploy',
                agents: [
                    { name: 'deployment-orchestrator', role: 'primary' },
                    { name: 'ci-cd-specialist', role: 'support' },
                    { name: 'monitoring-specialist', role: 'support' },
                    { name: 'performance-tuner', role: 'support' }
                ]
            }
        };
    }

    async generateAgentForPhase(phase, projectContext) {
        const phaseConfig = this.phaseAgentMappings[phase];
        if (!phaseConfig) {
            throw new Error(`Unknown phase: ${phase}`);
        }

        const agents = [];
        
        for (const agentConfig of phaseConfig.agents) {
            const agent = await this.createAgent({
                name: agentConfig.name,
                role: agentConfig.role,
                phase: phase,
                phaseName: phaseConfig.name,
                projectContext: projectContext
            });
            
            agents.push(agent);
        }

        return agents;
    }

    async createAgent(config) {
        const { name, role, phase, phaseName, projectContext } = config;
        
        const agentDefinition = {
            agent: {
                name: name,
                version: '1.0.0',
                purpose: this.generatePurpose(name, phaseName),
                role: role,
                phase: phase,
                created: new Date().toISOString()
            },
            
            background: {
                expertise: this.generateExpertise(name),
                experience: this.generateExperience(name),
                project_context: projectContext
            },
            
            responsibilities: this.generateResponsibilities(name, phase),
            
            capabilities: this.generateCapabilities(name, phase),
            
            dependencies: this.generateDependencies(name, phase, role),
            
            communication_protocol: {
                listens_for: this.generateListenEvents(name, role),
                broadcasts: this.generateBroadcastEvents(name, role),
                direct_messages_to: this.generateDirectMessageTargets(name, phase)
            },
            
            workflow_integration: {
                triggers: this.generateTriggers(name, phase),
                prerequisites: this.generatePrerequisites(name, phase),
                outputs: this.generateOutputs(name, phase)
            },
            
            tools_required: this.generateToolRequirements(name),
            
            error_handling: {
                retry_strategy: 'exponential_backoff',
                max_retries: 3,
                fallback_behavior: this.generateFallbackBehavior(name)
            }
        };

        // Save agent definition
        const agentPath = path.join(
            process.cwd(), 
            'multi-agent', 
            'agents', 
            'generated',
            phase,
            `${name}.yaml`
        );
        
        await fs.mkdir(path.dirname(agentPath), { recursive: true });
        await fs.writeFile(agentPath, yaml.dump(agentDefinition, { lineWidth: 120 }));
        
        return {
            name,
            path: agentPath,
            definition: agentDefinition
        };
    }

    generatePurpose(agentName, phaseName) {
        const purposes = {
            'ideation-agent': `Lead the ideation process for ${phaseName}, facilitating creative exploration and requirement gathering`,
            'system-architect': `Design robust, scalable technical architecture for the project`,
            'frontend-implementer': `Implement frontend components and features with high quality and performance`,
            'backend-implementer': `Develop backend services, APIs, and business logic`,
            'test-implementer': `Create comprehensive test suites ensuring code quality and reliability`,
            'deployment-orchestrator': `Manage deployment pipeline and ensure smooth production releases`
        };
        
        return purposes[agentName] || `Specialized agent for ${phaseName}`;
    }

    generateExpertise(agentName) {
        const expertiseMap = {
            'ideation-agent': ['product strategy', 'user research', 'market analysis'],
            'system-architect': ['system design', 'scalability', 'microservices', 'cloud architecture'],
            'frontend-implementer': ['React/Vue/Angular', 'state management', 'responsive design', 'performance'],
            'backend-implementer': ['Node.js/Python/Go', 'databases', 'API design', 'security'],
            'database-designer': ['SQL', 'NoSQL', 'data modeling', 'query optimization'],
            'test-implementer': ['unit testing', 'integration testing', 'e2e testing', 'TDD']
        };
        
        return expertiseMap[agentName] || ['general development'];
    }

    generateExperience(agentName) {
        return `10+ years of experience in ${this.generateExpertise(agentName).join(', ')}`;
    }

    generateResponsibilities(agentName, phase) {
        const baseResponsibilities = [
            `Monitor channel for ${phase} related messages`,
            'Coordinate with other agents in the phase',
            'Report progress and blockers',
            'Maintain quality standards'
        ];
        
        const specificResponsibilities = {
            'ideation-agent': [
                'Gather and refine project requirements',
                'Facilitate brainstorming sessions',
                'Create project specification documents',
                'Validate ideas against market needs'
            ],
            'system-architect': [
                'Design system architecture',
                'Create technical diagrams',
                'Define API contracts',
                'Ensure scalability and security'
            ],
            'frontend-implementer': [
                'Implement UI components',
                'Manage application state',
                'Ensure responsive design',
                'Optimize frontend performance'
            ]
        };
        
        return [
            ...baseResponsibilities,
            ...(specificResponsibilities[agentName] || [])
        ];
    }

    generateCapabilities(agentName, phase) {
        const capabilities = {};
        
        // Common capability
        capabilities[`execute_${phase.replace('-', '_')}_tasks`] = {
            description: `Execute tasks specific to ${phase}`,
            workflow: [
                {
                    action: 'read-context',
                    params: {
                        source: 'shared',
                        key: `${phase}-context`
                    }
                },
                {
                    action: 'process-task',
                    params: {
                        type: phase
                    }
                },
                {
                    action: 'write-output',
                    params: {
                        path: `outputs/${phase}/`
                    }
                }
            ]
        };
        
        return capabilities;
    }

    generateDependencies(agentName, phase, role) {
        const dependencies = [];
        
        if (role === 'support') {
            // Support agents depend on primary agent
            const phaseConfig = this.phaseAgentMappings[phase];
            const primaryAgent = phaseConfig.agents.find(a => a.role === 'primary');
            if (primaryAgent) {
                dependencies.push({
                    agent: primaryAgent.name,
                    type: 'coordination',
                    required: true
                });
            }
        }
        
        // Phase dependencies
        const phaseNumber = parseInt(phase.split('-')[1]);
        if (phaseNumber > 1) {
            dependencies.push({
                phase: `phase-${phaseNumber - 1}`,
                type: 'sequential',
                outputs: ['completed']
            });
        }
        
        return dependencies;
    }

    generateListenEvents(agentName, role) {
        const events = [
            'task-assignment',
            'status-request',
            'help-request'
        ];
        
        if (role === 'primary') {
            events.push('phase-coordination', 'workflow-update');
        }
        
        return events;
    }

    generateBroadcastEvents(agentName, role) {
        const events = [
            'task-complete',
            'status-update',
            'blocker-found'
        ];
        
        if (role === 'primary') {
            events.push('phase-progress', 'coordination-request');
        }
        
        return events;
    }

    generateDirectMessageTargets(agentName, phase) {
        const targets = ['orchestrator'];
        
        // Add phase-specific targets
        const phaseConfig = this.phaseAgentMappings[phase];
        if (phaseConfig) {
            phaseConfig.agents.forEach(agent => {
                if (agent.name !== agentName) {
                    targets.push(agent.name);
                }
            });
        }
        
        return targets;
    }

    generateTriggers(agentName, phase) {
        return [
            {
                type: 'phase-start',
                condition: `phase === '${phase}'`
            },
            {
                type: 'direct-request',
                from: 'orchestrator'
            },
            {
                type: 'dependency-complete',
                condition: 'all_dependencies_met'
            }
        ];
    }

    generatePrerequisites(agentName, phase) {
        const phaseNumber = parseInt(phase.split('-')[1]);
        const prerequisites = [];
        
        if (phaseNumber > 1) {
            prerequisites.push({
                type: 'phase-complete',
                phase: `phase-${phaseNumber - 1}`
            });
        }
        
        prerequisites.push({
            type: 'context-available',
            keys: ['project-config', `${phase}-requirements`]
        });
        
        return prerequisites;
    }

    generateOutputs(agentName, phase) {
        return [
            {
                type: 'file',
                path: `docs/${phase}/${agentName}-output.md`
            },
            {
                type: 'context',
                key: `${agentName}-results`
            },
            {
                type: 'channel-message',
                event: 'task-complete'
            }
        ];
    }

    generateToolRequirements(agentName) {
        const baseTools = {
            claude_code: ['Read', 'Write', 'TodoWrite'],
            mcp_tools: []
        };
        
        // Add specific tools based on agent type
        if (agentName.includes('research')) {
            baseTools.mcp_tools.push('perplexity_ask', 'web_search');
        }
        if (agentName.includes('implement')) {
            baseTools.claude_code.push('MultiEdit', 'Bash');
        }
        if (agentName.includes('test')) {
            baseTools.claude_code.push('Bash');
        }
        
        return baseTools;
    }

    generateFallbackBehavior(agentName) {
        return `Report failure to orchestrator and await further instructions`;
    }

    async generateRetrofitAgents(existingProject) {
        // For retrofitting existing projects
        const retrofitAgents = [
            {
                name: 'codebase-analyzer',
                purpose: 'Analyze existing codebase structure and patterns'
            },
            {
                name: 'dependency-mapper',
                purpose: 'Map out project dependencies and relationships'
            },
            {
                name: 'refactor-planner',
                purpose: 'Plan refactoring strategy for Vibe Coding integration'
            },
            {
                name: 'migration-agent',
                purpose: 'Handle migration of existing code to new structure'
            },
            {
                name: 'test-retrofitter',
                purpose: 'Add tests to existing untested code'
            }
        ];
        
        const agents = [];
        for (const config of retrofitAgents) {
            const agent = await this.createAgent({
                name: config.name,
                role: 'retrofit',
                phase: 'retrofit',
                phaseName: 'Retrofit Existing Project',
                projectContext: existingProject
            });
            agents.push(agent);
        }
        
        return agents;
    }
    
    async generateAdaptiveWorkflows(config) {
        const workflows = {};
        
        // Self-optimization workflow
        workflows.self_optimize = {
            description: 'Continuously improve performance based on feedback',
            triggers: ['performance-feedback', 'error-encountered'],
            steps: [
                { action: 'analyze-performance', params: { lookback: '7d' } },
                { action: 'identify-improvements', params: { threshold: 0.8 } },
                { action: 'update-strategies', params: { preserve_core: true } },
                { action: 'test-improvements', params: { sandbox: true } }
            ]
        };
        
        // Context adaptation workflow
        workflows.adapt_to_context = {
            description: 'Adapt behavior based on project context changes',
            triggers: ['context-change', 'new-requirements'],
            steps: [
                { action: 'analyze-context-change', params: { diff: true } },
                { action: 'assess-impact', params: { scope: 'capabilities' } },
                { action: 'modify-behavior', params: { gradual: true } },
                { action: 'validate-adaptation', params: { test_suite: true } }
            ]
        };
        
        // Skill development workflow
        workflows.develop_skills = {
            description: 'Learn new skills based on project needs',
            triggers: ['skill-gap-identified', 'technology-change'],
            steps: [
                { action: 'identify-skill-gap', params: { priority: 'high' } },
                { action: 'create-learning-plan', params: { timeframe: '2w' } },
                { action: 'practice-skill', params: { safe_environment: true } },
                { action: 'integrate-skill', params: { gradual_rollout: true } }
            ]
        };
        
        return workflows;
    }
    
    consolidateAgentRoles(agents) {
        // For small teams, combine similar roles
        const consolidated = [];
        const processedAgents = new Set();
        
        for (const agent of agents) {
            if (processedAgents.has(agent.name)) continue;
            
            const similarAgents = agents.filter(a => 
                this.areRolesSimilar(agent.name, a.name) && !processedAgents.has(a.name)
            );
            
            if (similarAgents.length > 1) {
                // Create consolidated agent
                const consolidatedName = this.createConsolidatedName(similarAgents);
                consolidated.push({
                    name: consolidatedName,
                    role: 'multi-role',
                    adaptiveFeatures: {
                        roles: similarAgents.map(a => a.name),
                        specialization: 'role-consolidation'
                    }
                });
                
                similarAgents.forEach(a => processedAgents.add(a.name));
            } else {
                consolidated.push(agent);
                processedAgents.add(agent.name);
            }
        }
        
        return consolidated;
    }
    
    areRolesSimilar(role1, role2) {
        const similarityMap = {
            'frontend': ['ui', 'component', 'design'],
            'backend': ['api', 'server', 'database'],
            'test': ['quality', 'validation', 'qa']
        };
        
        for (const [category, keywords] of Object.entries(similarityMap)) {
            const role1Match = keywords.some(keyword => role1.includes(keyword));
            const role2Match = keywords.some(keyword => role2.includes(keyword));
            if (role1Match && role2Match) return true;
        }
        
        return false;
    }
    
    createConsolidatedName(agents) {
        const names = agents.map(a => a.name.split('-')[0]).filter((name, index, arr) => arr.indexOf(name) === index);
        return names.join('-') + '-multi-agent';
    }
}

// Adaptive support classes
class ContextAnalyzer {
    async analyzeProject(projectContext) {
        // Simplified analysis - in real implementation would be more sophisticated
        return {
            complexity: Math.random() * 10, // Would analyze actual code complexity
            teamSize: projectContext.teamSize || 3,
            technologyStack: projectContext.technologies || ['javascript'],
            domain: projectContext.domain || 'general',
            timeline: projectContext.timeline || 'medium',
            riskLevel: projectContext.riskLevel || 'medium'
        };
    }
}

class SkillMatcher {
    matchSkillsToProject(requiredSkills, availableAgents) {
        // Match agent capabilities to project requirements
        return availableAgents.filter(agent => 
            requiredSkills.some(skill => agent.expertise.includes(skill))
        );
    }
}

class WorkloadBalancer {
    distributeWorkload(tasks, agents) {
        // Distribute tasks based on agent capacity and expertise
        const distribution = new Map();
        
        agents.forEach(agent => {
            distribution.set(agent.name, []);
        });
        
        tasks.forEach((task, index) => {
            const assignedAgent = agents[index % agents.length];
            distribution.get(assignedAgent.name).push(task);
        });
        
        return distribution;
    }
}

class PerformanceTracker {
    constructor() {
        this.metrics = new Map();
    }
    
    trackAgentPerformance(agentName, metrics) {
        if (!this.metrics.has(agentName)) {
            this.metrics.set(agentName, []);
        }
        
        this.metrics.get(agentName).push({
            timestamp: new Date().toISOString(),
            ...metrics
        });
    }
    
    getPerformanceTrends(agentName) {
        return this.metrics.get(agentName) || [];
    }
}

module.exports = new AgentGenerator();