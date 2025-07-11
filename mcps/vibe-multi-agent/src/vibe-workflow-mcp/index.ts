#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  ListToolsRequestSchema, 
  CallToolRequestSchema, 
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  McpError, 
  ErrorCode 
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from '../common/logger.js';
import { Task } from '../common/types.js';
import { generateId } from '../common/utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load Vibe commands
const VIBE_COMMANDS_PATH = join(__dirname, '../../../../commands');

interface VibeCommand {
  name: string;
  description: string;
  content: string;
  phase: number;
  type: 'planning' | 'execution';
}

class VibeWorkflowMCP {
  private server: Server;
  private commands: Map<string, VibeCommand> = new Map();
  private orchestratorHost: string;
  private orchestratorPort: number;

  constructor() {
    this.server = new Server(
      {
        name: 'vibe-workflow-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
        },
      }
    );

    this.orchestratorHost = process.env.ORCHESTRATOR_HOST || 'localhost';
    this.orchestratorPort = parseInt(process.env.ORCHESTRATOR_PORT || '8080');

    this.loadVibeCommands();
    this.setupHandlers();
  }

  private loadVibeCommands() {
    // Map of Vibe commands to their phases and types
    const commandConfig = {
      'vibe-project-ideate': { phase: 1, type: 'planning', file: 'vibe-project-ideate.md' },
      'vibe-feature-ideate': { phase: 1, type: 'planning', file: 'vibe-feature-ideate.md' },
      'vibe-steps-reference': { phase: 0, type: 'planning', file: 'vibe-steps-reference.md' },
      'vibe-coding-retrofit-system': { phase: 0, type: 'planning', file: 'vibe-coding-retrofit-system.md' },
      'vibe-retrofit-existing': { phase: 0, type: 'planning', file: 'vibe-retrofit-existing.md' },
      'vibe-retrofit-phases': { phase: 0, type: 'planning', file: 'vibe-retrofit-phases.md' },
      'vibe-generate-agents': { phase: 0, type: 'planning', file: 'vibe-generate-agents.md' }
    };

    // Load the actual command files
    for (const [name, config] of Object.entries(commandConfig)) {
      const filePath = join(VIBE_COMMANDS_PATH, config.file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');
        this.commands.set(name, {
          name,
          description: this.extractDescription(content),
          content,
          phase: config.phase,
          type: config.type as 'planning' | 'execution'
        });
      }
    }

    log.info(`Loaded ${this.commands.size} Vibe commands`);
  }

  private extractDescription(content: string): string {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return line.substring(2).trim();
      }
    }
    return 'Vibe Coding command';
  }

  private setupHandlers() {
    // Tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'vibe_full_workflow',
          description: 'Execute complete Vibe Coding workflow with multi-agent execution',
          inputSchema: {
            type: 'object',
            properties: {
              project_description: {
                type: 'string',
                description: 'Detailed description of the project to build'
              },
              phases_to_run: {
                type: 'array',
                items: { type: 'string' },
                description: 'Specific phases to run (default: all 10 phases)',
                default: ['all']
              },
              spawn_agents_at_phase: {
                type: 'number',
                default: 7,
                description: 'Phase number when to spawn execution agents'
              },
              agent_config: {
                type: 'object',
                properties: {
                  max_agents: { type: 'number', default: 5 },
                  agent_roles: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Specific agent roles to spawn'
                  }
                }
              }
            },
            required: ['project_description']
          }
        },
        {
          name: 'vibe_planning_phase',
          description: 'Run Vibe planning phases (1-6) without execution',
          inputSchema: {
            type: 'object',
            properties: {
              project_description: {
                type: 'string',
                description: 'Project to plan'
              },
              phases: {
                type: 'array',
                items: { type: 'number' },
                default: [1, 2, 3, 4, 5, 6],
                description: 'Which planning phases to run'
              }
            },
            required: ['project_description']
          }
        },
        {
          name: 'vibe_execution_phase',
          description: 'Run Vibe execution phases (7-10) with multi-agent support',
          inputSchema: {
            type: 'object',
            properties: {
              project_plan: {
                type: 'object',
                description: 'Project plan from planning phases'
              },
              phases: {
                type: 'array',
                items: { type: 'number' },
                default: [7, 8, 9, 10],
                description: 'Which execution phases to run'
              },
              spawn_agents: {
                type: 'boolean',
                default: true,
                description: 'Whether to spawn multiple agents'
              }
            },
            required: ['project_plan']
          }
        },
        {
          name: 'vibe_phase_status',
          description: 'Get status of current Vibe workflow',
          inputSchema: {
            type: 'object',
            properties: {
              include_agents: { type: 'boolean', default: true },
              include_phases: { type: 'boolean', default: true }
            }
          }
        }
      ]
    }));

    // Prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [
        {
          name: 'vibe_workflow',
          description: 'Complete Vibe Coding workflow with all 10 steps',
          arguments: [
            {
              name: 'project_description',
              description: 'Detailed project description',
              required: true
            }
          ]
        },
        {
          name: 'vibe_stoic',
          description: 'STOIC planning phase (Step 1)',
          arguments: [
            {
              name: 'project_description',
              description: 'Project to analyze strategically',
              required: true
            }
          ]
        },
        {
          name: 'vibe_inception',
          description: 'Inception phase (Step 2)',
          arguments: [
            {
              name: 'project_plan',
              description: 'Strategic plan from STOIC',
              required: true
            }
          ]
        }
      ]
    }));

    // Tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'vibe_full_workflow':
            return await this.handleFullWorkflow(args);
          case 'vibe_planning_phase':
            return await this.handlePlanningPhase(args);
          case 'vibe_execution_phase':
            return await this.handleExecutionPhase(args);
          case 'vibe_phase_status':
            return await this.handlePhaseStatus(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        log.error(`Vibe Workflow tool ${name} error:`, error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
      }
    });

    // Prompt handler
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Load the appropriate Vibe command content
        const command = this.commands.get(name) || this.commands.get(`vibe-${name}`);
        
        if (!command) {
          throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt: ${name}`);
        }

        return {
          messages: [
            {
              role: 'system',
              content: command.content
            },
            {
              role: 'user',
              content: this.buildUserPrompt(name, args)
            }
          ]
        };
      } catch (error) {
        log.error(`Vibe Workflow prompt ${name} error:`, error);
        throw new McpError(ErrorCode.InternalError, `Prompt execution failed: ${error.message}`);
      }
    });
  }

  private async handleFullWorkflow(args: any) {
    const { 
      project_description, 
      phases_to_run = ['all'], 
      spawn_agents_at_phase = 7,
      agent_config = {}
    } = args;

    log.info('Starting full Vibe Coding workflow');

    const workflow = {
      id: generateId(),
      project_description,
      phases: [],
      current_phase: 1,
      planning_complete: false,
      execution_started: false,
      agents_spawned: false,
      tasks: [],
      results: {}
    };

    // Phase 1-6: Planning (using existing Vibe commands)
    const planningPhases = [
      { number: 1, name: 'STOIC', command: 'vibe-project-ideate' },
      { number: 2, name: 'Inception', command: 'vibe-steps-reference' },
      { number: 3, name: 'Designer', command: 'vibe-steps-reference' },
      { number: 4, name: 'Innovator', command: 'vibe-feature-ideate' },
      { number: 5, name: 'Sensei', command: 'vibe-steps-reference' },
      { number: 6, name: 'Architect', command: 'vibe-steps-reference' }
    ];

    // Run planning phases
    for (const phase of planningPhases) {
      if (phases_to_run.includes('all') || phases_to_run.includes(phase.number.toString())) {
        log.info(`Running Phase ${phase.number}: ${phase.name}`);
        
        // Execute the Vibe command for this phase
        const phaseResult = await this.executeVibeCommand(phase.command, {
          project_description,
          previous_phases: workflow.phases
        });

        workflow.phases.push({
          number: phase.number,
          name: phase.name,
          status: 'completed',
          result: phaseResult
        });

        workflow.current_phase = phase.number + 1;
      }
    }

    workflow.planning_complete = true;

    // Extract tasks from planning phases
    workflow.tasks = this.extractTasksFromPhases(workflow.phases);

    // Phase 7-10: Execution (with multi-agent support)
    if (workflow.current_phase >= spawn_agents_at_phase && !workflow.agents_spawned) {
      log.info('Spawning execution agents');
      
      const spawnResult = await this.spawnExecutionAgents(workflow.tasks, agent_config);
      workflow.agents_spawned = true;
      workflow.results['agent_spawn'] = spawnResult;
    }

    // Run execution phases with agents
    const executionPhases = [
      { number: 7, name: 'Initializer', parallel: true },
      { number: 8, name: 'Builder', parallel: true },
      { number: 9, name: 'Quality Assurance', parallel: false },
      { number: 10, name: 'Deployer', parallel: false }
    ];

    for (const phase of executionPhases) {
      if (phases_to_run.includes('all') || phases_to_run.includes(phase.number.toString())) {
        log.info(`Running Phase ${phase.number}: ${phase.name}`);
        
        if (phase.parallel && workflow.agents_spawned) {
          // Distribute tasks to agents
          const executionResult = await this.executePhaseWithAgents(phase, workflow.tasks);
          workflow.phases.push({
            number: phase.number,
            name: phase.name,
            status: 'completed',
            result: executionResult
          });
        } else {
          // Single agent execution
          const phaseResult = await this.executeSingleAgentPhase(phase, workflow);
          workflow.phases.push({
            number: phase.number,
            name: phase.name,
            status: 'completed',
            result: phaseResult
          });
        }

        workflow.current_phase = phase.number + 1;
      }
    }

    workflow.execution_started = true;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            message: 'Vibe Coding workflow executed',
            workflow,
            next_steps: workflow.current_phase > 10 
              ? ['Project complete! Review the results and deployed application.']
              : [`Continue with phase ${workflow.current_phase}`]
          }, null, 2)
        }
      ]
    };
  }

  private async handlePlanningPhase(args: any) {
    const { project_description, phases = [1, 2, 3, 4, 5, 6] } = args;

    const results = {
      project_description,
      phases_completed: [],
      planning_output: {},
      extracted_tasks: []
    };

    // Run each planning phase using Vibe commands
    for (const phaseNum of phases) {
      const phaseConfig = this.getPhaseConfig(phaseNum);
      if (phaseConfig && phaseConfig.type === 'planning') {
        const result = await this.executeVibeCommand(phaseConfig.command, {
          project_description,
          previous_results: results.planning_output
        });

        results.phases_completed.push({
          number: phaseNum,
          name: phaseConfig.name,
          command: phaseConfig.command,
          result
        });

        results.planning_output[phaseConfig.name] = result;
      }
    }

    // Extract tasks from planning output
    results.extracted_tasks = this.extractTasksFromPlanningOutput(results.planning_output);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2)
        }
      ]
    };
  }

  private async handleExecutionPhase(args: any) {
    const { project_plan, phases = [7, 8, 9, 10], spawn_agents = true } = args;

    const results = {
      execution_started: new Date().toISOString(),
      phases_completed: [],
      agents_spawned: false,
      tasks_distributed: 0,
      tasks_completed: 0
    };

    // Spawn agents if requested
    if (spawn_agents) {
      const agentConfig = {
        max_agents: 5,
        agent_roles: this.determineAgentRoles(project_plan)
      };

      const spawnResult = await this.spawnExecutionAgents(project_plan.tasks || [], agentConfig);
      results.agents_spawned = true;
      results.tasks_distributed = spawnResult.tasks_distributed;
    }

    // Run execution phases
    for (const phaseNum of phases) {
      const phaseConfig = this.getPhaseConfig(phaseNum);
      if (phaseConfig && phaseConfig.type === 'execution') {
        const phaseResult = spawn_agents 
          ? await this.executePhaseWithAgents(phaseConfig, project_plan.tasks || [])
          : await this.executeSingleAgentPhase(phaseConfig, project_plan);

        results.phases_completed.push({
          number: phaseNum,
          name: phaseConfig.name,
          result: phaseResult
        });
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2)
        }
      ]
    };
  }

  private async handlePhaseStatus(args: any) {
    const { include_agents = true, include_phases = true } = args;

    // Get status from orchestrator
    const orchestratorStatus = await this.getOrchestratorStatus();

    const status = {
      workflow: {
        active: true,
        current_phase: this.getCurrentPhase(),
        planning_complete: this.isPlanningComplete(),
        execution_started: this.isExecutionStarted()
      }
    };

    if (include_phases) {
      status['phases'] = this.getPhaseStatuses();
    }

    if (include_agents) {
      status['agents'] = orchestratorStatus.agents || [];
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(status, null, 2)
        }
      ]
    };
  }

  private async executeVibeCommand(commandName: string, context: any): Promise<any> {
    const command = this.commands.get(commandName);
    if (!command) {
      throw new Error(`Vibe command not found: ${commandName}`);
    }

    // This would normally execute the command through Claude
    // For now, we'll simulate the execution
    log.info(`Executing Vibe command: ${commandName}`);
    
    return {
      command: commandName,
      executed_at: new Date().toISOString(),
      context,
      output: `Results from ${commandName} execution`
    };
  }

  private extractTasksFromPhases(phases: any[]): Task[] {
    const tasks: Task[] = [];
    
    // Extract tasks from each phase's output
    // This would parse the actual Vibe command outputs
    for (const phase of phases) {
      if (phase.result && phase.result.output) {
        // Parse tasks from the phase output
        // For now, we'll create sample tasks
        tasks.push({
          id: generateId(),
          title: `Task from ${phase.name}`,
          description: `Implementation task generated by ${phase.name} phase`,
          priority: 'medium',
          status: 'pending',
          dependencies: [],
          domain: this.inferDomain(phase.name),
          estimatedEffort: 3,
          files: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return tasks;
  }

  private extractTasksFromPlanningOutput(planningOutput: any): Task[] {
    // Similar to extractTasksFromPhases but for planning-specific output
    return this.extractTasksFromPhases(
      Object.entries(planningOutput).map(([name, result]) => ({
        name,
        result
      }))
    );
  }

  private async spawnExecutionAgents(tasks: Task[], agentConfig: any): Promise<any> {
    // Call orchestrator to spawn agents
    const spawnRequest = {
      project_description: 'Vibe Coding Execution Phase',
      tasks,
      agent_roles: agentConfig.agent_roles || ['frontend', 'backend', 'testing'],
      config: {
        max_concurrent: agentConfig.max_agents || 5
      }
    };

    log.info('Spawning execution agents via orchestrator');
    
    // This would call the orchestrator MCP
    return {
      agents_spawned: spawnRequest.agent_roles.length,
      tasks_distributed: tasks.length,
      orchestrator_url: `ws://${this.orchestratorHost}:${this.orchestratorPort}/agent`
    };
  }

  private async executePhaseWithAgents(phase: any, tasks: Task[]): Promise<any> {
    // Distribute phase-specific tasks to agents
    const phaseTasks = tasks.filter(task => 
      this.isTaskForPhase(task, phase.number)
    );

    log.info(`Executing phase ${phase.number} with ${phaseTasks.length} tasks across agents`);

    return {
      phase: phase.name,
      tasks_executed: phaseTasks.length,
      parallel_execution: true,
      completion_time: new Date().toISOString()
    };
  }

  private async executeSingleAgentPhase(phase: any, context: any): Promise<any> {
    log.info(`Executing phase ${phase.number} in single-agent mode`);

    return {
      phase: phase.name,
      single_agent_execution: true,
      completion_time: new Date().toISOString()
    };
  }

  private getPhaseConfig(phaseNumber: number): any {
    const phaseConfigs = {
      1: { name: 'STOIC', command: 'vibe-project-ideate', type: 'planning' },
      2: { name: 'Inception', command: 'vibe-steps-reference', type: 'planning' },
      3: { name: 'Designer', command: 'vibe-steps-reference', type: 'planning' },
      4: { name: 'Innovator', command: 'vibe-feature-ideate', type: 'planning' },
      5: { name: 'Sensei', command: 'vibe-steps-reference', type: 'planning' },
      6: { name: 'Architect', command: 'vibe-steps-reference', type: 'planning' },
      7: { name: 'Initializer', command: 'vibe-steps-reference', type: 'execution' },
      8: { name: 'Builder', command: 'vibe-steps-reference', type: 'execution' },
      9: { name: 'Quality', command: 'vibe-steps-reference', type: 'execution' },
      10: { name: 'Deployer', command: 'vibe-steps-reference', type: 'execution' }
    };

    return phaseConfigs[phaseNumber];
  }

  private determineAgentRoles(projectPlan: any): string[] {
    // Analyze project plan to determine needed agent roles
    const roles = new Set(['frontend', 'backend', 'testing']);

    if (projectPlan.database) {
      roles.add('database');
    }

    if (projectPlan.deployment) {
      roles.add('devops');
    }

    if (projectPlan.documentation) {
      roles.add('documentation');
    }

    return Array.from(roles);
  }

  private inferDomain(phaseName: string): string {
    const domainMap = {
      'Initializer': 'setup',
      'Builder': 'implementation',
      'Designer': 'frontend',
      'Architect': 'backend',
      'Quality': 'testing',
      'Deployer': 'devops'
    };

    return domainMap[phaseName] || 'general';
  }

  private isTaskForPhase(task: Task, phaseNumber: number): boolean {
    // Determine if a task belongs to a specific phase
    const phaseTaskMap = {
      7: ['setup', 'initialization'],
      8: ['implementation', 'frontend', 'backend'],
      9: ['testing', 'quality'],
      10: ['deployment', 'devops']
    };

    const phaseDomains = phaseTaskMap[phaseNumber] || [];
    return phaseDomains.includes(task.domain);
  }

  private async getOrchestratorStatus(): Promise<any> {
    // This would call the orchestrator to get status
    return {
      agents: [],
      tasks: {
        pending: 0,
        in_progress: 0,
        completed: 0
      }
    };
  }

  private getCurrentPhase(): number {
    // Track current phase in workflow
    return 1;
  }

  private isPlanningComplete(): boolean {
    // Check if planning phases (1-6) are complete
    return false;
  }

  private isExecutionStarted(): boolean {
    // Check if execution phases (7-10) have started
    return false;
  }

  private getPhaseStatuses(): any[] {
    // Return status of all phases
    return Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      name: this.getPhaseConfig(i + 1)?.name || `Phase ${i + 1}`,
      status: 'pending'
    }));
  }

  private buildUserPrompt(commandName: string, args: any): string {
    const prompts = {
      'vibe_workflow': `Execute the complete Vibe Coding workflow for: ${args.project_description}`,
      'vibe_stoic': `Perform STOIC strategic planning for: ${args.project_description}`,
      'vibe_inception': `Run Inception phase with plan: ${JSON.stringify(args.project_plan)}`
    };

    return prompts[commandName] || `Execute ${commandName} with args: ${JSON.stringify(args)}`;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    log.info('Vibe Workflow MCP server started');
    
    process.on('SIGINT', async () => {
      log.info('Vibe Workflow MCP server shutting down');
      process.exit(0);
    });
  }
}

// Start the server
const server = new VibeWorkflowMCP();
server.start().catch(error => {
  log.error('Failed to start Vibe Workflow MCP server:', error);
  process.exit(1);
});