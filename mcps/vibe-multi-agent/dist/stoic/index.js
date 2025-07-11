#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { StoicPlanner } from './planner.js';
import { TaskGenerator } from './task-generator.js';
import { ArchitectureAnalyzer } from './architecture-analyzer.js';
import { log } from '../common/logger.js';
import { generateId } from '../common/utils.js';
class StoicMCP {
    server;
    planner;
    taskGenerator;
    architectureAnalyzer;
    constructor() {
        this.server = new Server({
            name: 'vibe-stoic-mcp',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
                prompts: {},
            },
        });
        this.planner = new StoicPlanner();
        this.taskGenerator = new TaskGenerator();
        this.architectureAnalyzer = new ArchitectureAnalyzer();
        this.setupHandlers();
    }
    setupHandlers() {
        // Tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'strategic_planning',
                    description: 'Generate comprehensive strategic plan and architecture for a project',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            project_description: {
                                type: 'string',
                                description: 'Detailed description of the project to plan'
                            },
                            constraints: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Any constraints or requirements to consider'
                            },
                            preferences: {
                                type: 'object',
                                properties: {
                                    framework: { type: 'string' },
                                    database: { type: 'string' },
                                    deployment: { type: 'string' },
                                    testing: { type: 'string' }
                                },
                                description: 'Technology preferences and choices'
                            },
                            spawn_agents: {
                                type: 'boolean',
                                default: true,
                                description: 'Whether to automatically spawn agents after planning'
                            }
                        },
                        required: ['project_description']
                    }
                },
                {
                    name: 'generate_tasks',
                    description: 'Generate detailed task breakdown from project architecture',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            architecture: {
                                type: 'object',
                                description: 'Project architecture from strategic planning'
                            },
                            granularity: {
                                type: 'string',
                                enum: ['high', 'medium', 'low'],
                                default: 'medium',
                                description: 'Level of task granularity'
                            },
                            include_testing: {
                                type: 'boolean',
                                default: true,
                                description: 'Include testing tasks'
                            },
                            include_documentation: {
                                type: 'boolean',
                                default: true,
                                description: 'Include documentation tasks'
                            }
                        },
                        required: ['architecture']
                    }
                },
                {
                    name: 'analyze_architecture',
                    description: 'Analyze project architecture and provide recommendations',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            architecture: {
                                type: 'object',
                                description: 'Project architecture to analyze'
                            },
                            focus_areas: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Specific areas to focus analysis on'
                            }
                        },
                        required: ['architecture']
                    }
                },
                {
                    name: 'estimate_effort',
                    description: 'Estimate development effort and timeline',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            tasks: {
                                type: 'array',
                                items: { type: 'object' },
                                description: 'Array of tasks to estimate'
                            },
                            team_size: {
                                type: 'number',
                                default: 1,
                                description: 'Number of developers'
                            },
                            experience_level: {
                                type: 'string',
                                enum: ['junior', 'mid', 'senior'],
                                default: 'mid',
                                description: 'Team experience level'
                            }
                        },
                        required: ['tasks']
                    }
                }
            ]
        }));
        // Prompts
        this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
            prompts: [
                {
                    name: 'stoic',
                    description: 'STOIC strategic planning and architecture phase',
                    arguments: [
                        {
                            name: 'project_description',
                            description: 'Detailed description of the project to plan',
                            required: true
                        },
                        {
                            name: 'constraints',
                            description: 'Any constraints or requirements (comma-separated)',
                            required: false
                        },
                        {
                            name: 'preferences',
                            description: 'Technology preferences in JSON format',
                            required: false
                        }
                    ]
                },
                {
                    name: 'architecture_review',
                    description: 'Review and validate project architecture',
                    arguments: [
                        {
                            name: 'architecture',
                            description: 'Project architecture to review (JSON format)',
                            required: true
                        }
                    ]
                },
                {
                    name: 'task_breakdown',
                    description: 'Break down project into detailed tasks',
                    arguments: [
                        {
                            name: 'architecture',
                            description: 'Project architecture (JSON format)',
                            required: true
                        },
                        {
                            name: 'granularity',
                            description: 'Task granularity level (high/medium/low)',
                            required: false
                        }
                    ]
                }
            ]
        }));
        // Tool call handler
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'strategic_planning':
                        return await this.handleStrategicPlanning(args);
                    case 'generate_tasks':
                        return await this.handleGenerateTasks(args);
                    case 'analyze_architecture':
                        return await this.handleAnalyzeArchitecture(args);
                    case 'estimate_effort':
                        return await this.handleEstimateEffort(args);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }
            }
            catch (error) {
                log.error(`STOIC tool ${name} error:`, error);
                throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
            }
        });
        // Prompt handler
        this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'stoic':
                        return await this.handleStoicPrompt(args);
                    case 'architecture_review':
                        return await this.handleArchitectureReviewPrompt(args);
                    case 'task_breakdown':
                        return await this.handleTaskBreakdownPrompt(args);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt: ${name}`);
                }
            }
            catch (error) {
                log.error(`STOIC prompt ${name} error:`, error);
                throw new McpError(ErrorCode.InternalError, `Prompt execution failed: ${error.message}`);
            }
        });
    }
    async handleStrategicPlanning(args) {
        const { project_description, constraints = [], preferences = {}, spawn_agents = true } = args;
        log.info('Starting strategic planning process');
        // Generate strategic plan
        const strategicPlan = await this.planner.generateStrategicPlan({
            description: project_description,
            constraints,
            preferences
        });
        // Analyze architecture
        const architectureAnalysis = await this.architectureAnalyzer.analyzeArchitecture(strategicPlan.architecture);
        // Generate tasks
        const tasks = await this.taskGenerator.generateTasks(strategicPlan.architecture, {
            granularity: 'medium',
            includeTestingTasks: true,
            includeDocumentationTasks: true
        });
        // Estimate effort
        const effort = await this.estimateProjectEffort(tasks);
        const result = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            project: {
                name: strategicPlan.project.name,
                description: project_description,
                type: strategicPlan.project.type
            },
            architecture: strategicPlan.architecture,
            analysis: architectureAnalysis,
            tasks,
            effort,
            phases: strategicPlan.phases,
            recommendations: strategicPlan.recommendations,
            spawn_agents,
            next_steps: spawn_agents ? [
                'Review the strategic plan and architecture',
                'Confirm task breakdown and priorities',
                'Spawn specialized agents for parallel development',
                'Begin development with continuous integration'
            ] : [
                'Review the strategic plan and architecture',
                'Manually create project structure',
                'Begin development following the phases'
            ]
        };
        log.info('Strategic planning completed');
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    async handleGenerateTasks(args) {
        const { architecture, granularity = 'medium', include_testing = true, include_documentation = true } = args;
        const tasks = await this.taskGenerator.generateTasks(architecture, {
            granularity,
            includeTestingTasks: include_testing,
            includeDocumentationTasks: include_documentation
        });
        const result = {
            tasks,
            summary: {
                total_tasks: tasks.length,
                by_domain: this.groupTasksByDomain(tasks),
                by_priority: this.groupTasksByPriority(tasks),
                estimated_duration: this.calculateTotalDuration(tasks)
            }
        };
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    }
    async handleAnalyzeArchitecture(args) {
        const { architecture, focus_areas = [] } = args;
        const analysis = await this.architectureAnalyzer.analyzeArchitecture(architecture, focus_areas);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(analysis, null, 2)
                }
            ]
        };
    }
    async handleEstimateEffort(args) {
        const { tasks, team_size = 1, experience_level = 'mid' } = args;
        const effort = await this.estimateProjectEffort(tasks, team_size, experience_level);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(effort, null, 2)
                }
            ]
        };
    }
    async handleStoicPrompt(args) {
        const { project_description, constraints, preferences } = args;
        const constraintsList = constraints ? constraints.split(',').map((c) => c.trim()) : [];
        const preferencesObj = preferences ? JSON.parse(preferences) : {};
        const systemPrompt = `You are the STOIC strategic planning agent for the Vibe Coding multi-agent system.

Your role is to:
1. Analyze the project requirements thoroughly
2. Design a comprehensive architecture
3. Create a strategic implementation plan
4. Recommend technology choices
5. Identify potential challenges and solutions

Project Description: ${project_description}

Constraints: ${constraintsList.length > 0 ? constraintsList.join(', ') : 'None specified'}

Preferences: ${JSON.stringify(preferencesObj, null, 2)}

Follow the Vibe Coding methodology:
- Strategic thinking and planning
- Quality-first approach (95% test coverage)
- Scalable and maintainable architecture
- Modern development practices
- Comprehensive documentation

Provide a detailed strategic plan including:
- Project architecture and technology stack
- Implementation phases and milestones
- Task breakdown and dependencies
- Risk assessment and mitigation strategies
- Resource requirements and timeline`;
        const userPrompt = `Please create a comprehensive strategic plan for this project. Focus on:

1. **Architecture Design**: Create a scalable, maintainable architecture
2. **Technology Stack**: Recommend appropriate technologies
3. **Implementation Strategy**: Define clear phases and milestones
4. **Task Breakdown**: Identify all major tasks and dependencies
5. **Quality Assurance**: Ensure 95% test coverage strategy
6. **Risk Management**: Identify potential challenges and solutions

Return the plan in a structured JSON format that can be used by the multi-agent system.`;
        return {
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ]
        };
    }
    async handleArchitectureReviewPrompt(args) {
        const { architecture } = args;
        const systemPrompt = `You are an architecture review specialist in the Vibe Coding multi-agent system.

Your role is to:
1. Review and validate the provided architecture
2. Identify potential issues and improvements
3. Ensure scalability and maintainability
4. Verify alignment with best practices
5. Provide specific recommendations

Architecture to review:
${JSON.stringify(JSON.parse(architecture), null, 2)}

Focus on:
- Scalability and performance
- Security considerations
- Code maintainability
- Testing strategies
- Deployment and DevOps
- Documentation completeness`;
        const userPrompt = `Please conduct a thorough architecture review. Provide:

1. **Overall Assessment**: Is this architecture sound?
2. **Strengths**: What are the positive aspects?
3. **Weaknesses**: What needs improvement?
4. **Specific Recommendations**: Concrete steps to improve
5. **Risk Assessment**: Potential challenges and mitigation strategies
6. **Implementation Priority**: What should be addressed first?

Return your analysis in a structured format.`;
        return {
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ]
        };
    }
    async handleTaskBreakdownPrompt(args) {
        const { architecture, granularity = 'medium' } = args;
        const systemPrompt = `You are a task breakdown specialist in the Vibe Coding multi-agent system.

Your role is to:
1. Break down the architecture into specific, actionable tasks
2. Define clear dependencies between tasks
3. Assign appropriate priorities
4. Ensure comprehensive coverage
5. Create tasks suitable for different agent specializations

Architecture:
${JSON.stringify(JSON.parse(architecture), null, 2)}

Task Granularity: ${granularity}

Create tasks for these domains:
- Frontend development
- Backend development
- Database design
- Testing and QA
- DevOps and deployment
- Documentation

Each task should include:
- Clear title and description
- Domain/specialization
- Priority level
- Dependencies
- Estimated effort
- Success criteria`;
        const userPrompt = `Please create a comprehensive task breakdown. Ensure:

1. **Complete Coverage**: All aspects of the architecture are covered
2. **Proper Dependencies**: Tasks are properly sequenced
3. **Balanced Distribution**: Tasks are well-distributed across domains
4. **Clear Scope**: Each task has a clear, achievable scope
5. **Quality Focus**: Include testing and documentation tasks
6. **Agent Suitability**: Tasks are suitable for specialized agents

Return the task breakdown in JSON format with task objects containing all required fields.`;
        return {
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ]
        };
    }
    groupTasksByDomain(tasks) {
        const grouped = {};
        tasks.forEach(task => {
            grouped[task.domain] = (grouped[task.domain] || 0) + 1;
        });
        return grouped;
    }
    groupTasksByPriority(tasks) {
        const grouped = {};
        tasks.forEach(task => {
            grouped[task.priority] = (grouped[task.priority] || 0) + 1;
        });
        return grouped;
    }
    calculateTotalDuration(tasks) {
        return tasks.reduce((total, task) => total + (task.estimatedEffort || 1), 0);
    }
    async estimateProjectEffort(tasks, teamSize = 1, experienceLevel = 'mid') {
        const baseEffort = this.calculateTotalDuration(tasks);
        // Experience multipliers
        const experienceMultipliers = {
            junior: 1.5,
            mid: 1.0,
            senior: 0.7
        };
        // Team size efficiency (diminishing returns)
        const teamEfficiency = Math.min(teamSize, 5) * 0.8 + Math.max(0, teamSize - 5) * 0.3;
        const adjustedEffort = baseEffort * experienceMultipliers[experienceLevel] / teamEfficiency;
        return {
            total_tasks: tasks.length,
            base_effort_hours: baseEffort,
            adjusted_effort_hours: adjustedEffort,
            team_size: teamSize,
            experience_level: experienceLevel,
            estimated_weeks: Math.ceil(adjustedEffort / (40 * teamSize)), // 40 hours per week
            breakdown: {
                frontend: tasks.filter(t => t.domain === 'frontend').length,
                backend: tasks.filter(t => t.domain === 'backend').length,
                database: tasks.filter(t => t.domain === 'database').length,
                testing: tasks.filter(t => t.domain === 'testing').length,
                devops: tasks.filter(t => t.domain === 'devops').length,
                documentation: tasks.filter(t => t.domain === 'documentation').length
            }
        };
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        log.info('STOIC MCP server started');
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            log.info('STOIC MCP server shutting down');
            process.exit(0);
        });
    }
}
// Start the STOIC MCP server
const stoicMCP = new StoicMCP();
stoicMCP.start().catch(error => {
    log.error('Failed to start STOIC MCP server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map