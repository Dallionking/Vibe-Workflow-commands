#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { WebSocketServer } from './websocket-server.js';
import { AgentManager } from './agent-manager.js';
import { TaskQueue } from './task-queue.js';
import { GitManager } from './git-manager.js';
import { loadConfig, validateConfig } from '../common/config.js';
import { log } from '../common/logger.js';
import { generateId } from '../common/utils.js';
class OrchestratorMCP {
    server;
    wsServer;
    agentManager;
    taskQueue;
    gitManager;
    config;
    projectContext = null;
    constructor() {
        this.config = loadConfig();
        validateConfig(this.config);
        this.server = new Server({
            name: 'vibe-orchestrator-mcp',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
                prompts: {},
            },
        });
        this.wsServer = new WebSocketServer(this.config);
        this.agentManager = new AgentManager(this.config);
        this.taskQueue = new TaskQueue();
        this.gitManager = new GitManager(this.config);
        this.setupHandlers();
        this.setupEventListeners();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'spawn_agents',
                    description: 'Spawn multiple specialized agents for parallel development',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            project_description: {
                                type: 'string',
                                description: 'Description of the project to work on'
                            },
                            tasks: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        title: { type: 'string' },
                                        description: { type: 'string' },
                                        domain: { type: 'string' },
                                        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
                                        dependencies: { type: 'array', items: { type: 'string' } },
                                        files: { type: 'array', items: { type: 'string' } }
                                    },
                                    required: ['title', 'description', 'domain']
                                }
                            },
                            agent_roles: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Specific agent roles to spawn (frontend, backend, testing, etc.)'
                            }
                        },
                        required: ['project_description', 'tasks']
                    }
                },
                {
                    name: 'get_project_status',
                    description: 'Get current status of agents and tasks',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            include_agents: { type: 'boolean', default: true },
                            include_tasks: { type: 'boolean', default: true },
                            include_git: { type: 'boolean', default: false }
                        }
                    }
                },
                {
                    name: 'distribute_task',
                    description: 'Manually distribute a task to a specific agent',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            task_id: { type: 'string' },
                            agent_id: { type: 'string' },
                            priority: { type: 'number', default: 1 }
                        },
                        required: ['task_id', 'agent_id']
                    }
                },
                {
                    name: 'merge_agent_work',
                    description: 'Merge completed work from agents back to main branch',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            agent_ids: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Agent IDs whose work should be merged'
                            },
                            strategy: {
                                type: 'string',
                                enum: ['merge', 'rebase', 'squash'],
                                default: 'merge'
                            }
                        }
                    }
                },
                {
                    name: 'terminate_agents',
                    description: 'Terminate specific agents or all agents',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            agent_ids: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Specific agent IDs to terminate. If empty, terminates all agents'
                            },
                            force: { type: 'boolean', default: false }
                        }
                    }
                },
                {
                    name: 'create_project_context',
                    description: 'Initialize project context for multi-agent development',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            description: { type: 'string' },
                            framework: { type: 'string' },
                            root_path: { type: 'string' }
                        },
                        required: ['name', 'description', 'framework']
                    }
                }
            ]
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'spawn_agents':
                        return await this.handleSpawnAgents(args);
                    case 'get_project_status':
                        return await this.handleGetProjectStatus(args);
                    case 'distribute_task':
                        return await this.handleDistributeTask(args);
                    case 'merge_agent_work':
                        return await this.handleMergeAgentWork(args);
                    case 'terminate_agents':
                        return await this.handleTerminateAgents(args);
                    case 'create_project_context':
                        return await this.handleCreateProjectContext(args);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }
            }
            catch (error) {
                log.error(`Tool ${name} error:`, error);
                throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error.message}`);
            }
        });
    }
    setupEventListeners() {
        this.wsServer.on('agent_connected', (agentId) => {
            log.agent.spawned(agentId, 'unknown', 'pending');
        });
        this.wsServer.on('agent_disconnected', (agentId) => {
            this.agentManager.removeAgent(agentId);
        });
        this.wsServer.on('agent_message', (agentId, message) => {
            this.handleAgentMessage(agentId, message);
        });
        this.agentManager.on('agent_ready', (agent) => {
            this.distributeQueuedTasks();
        });
        this.taskQueue.on('task_queued', (task) => {
            this.distributeQueuedTasks();
        });
    }
    async handleSpawnAgents(args) {
        const { project_description, tasks, agent_roles } = args;
        // Create project context if not exists
        if (!this.projectContext) {
            this.projectContext = {
                id: generateId(),
                name: 'Multi-Agent Project',
                description: project_description,
                rootPath: process.cwd(),
                framework: 'unknown',
                dependencies: [],
                architecture: {},
                tasks: [],
                agents: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
        }
        // Convert tasks to proper Task objects
        const taskObjects = tasks.map((task) => ({
            id: generateId(),
            title: task.title,
            description: task.description,
            priority: task.priority || 'medium',
            status: 'pending',
            dependencies: task.dependencies || [],
            domain: task.domain,
            estimatedEffort: 1,
            files: task.files || [],
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        // Add tasks to queue
        taskObjects.forEach(task => this.taskQueue.addTask(task));
        // Determine which agents to spawn
        const rolesToSpawn = agent_roles || this.determineRequiredRoles(taskObjects);
        // Spawn agents
        const spawnedAgents = await Promise.all(rolesToSpawn.map(async (role) => {
            const agent = await this.agentManager.spawnAgent(role, this.projectContext.rootPath);
            const worktree = await this.gitManager.createWorktree(agent.id, agent.branch);
            log.agent.spawned(agent.id, role, agent.branch);
            return { agent, worktree };
        }));
        // Start WebSocket server if not already running
        if (!this.wsServer.isRunning()) {
            await this.wsServer.start();
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        message: 'Agents spawned successfully',
                        agents: spawnedAgents.map(({ agent, worktree }) => ({
                            id: agent.id,
                            role: agent.role.name,
                            branch: agent.branch,
                            worktree: worktree.path,
                            status: agent.status
                        })),
                        tasks: taskObjects.map(task => ({
                            id: task.id,
                            title: task.title,
                            status: task.status,
                            domain: task.domain,
                            priority: task.priority
                        })),
                        orchestrator: {
                            host: this.config.host,
                            port: this.config.port,
                            websocket: `ws://${this.config.host}:${this.config.port}/agent`
                        }
                    }, null, 2)
                }
            ]
        };
    }
    async handleGetProjectStatus(args) {
        const { include_agents = true, include_tasks = true, include_git = false } = args;
        const status = {
            orchestrator: {
                status: 'running',
                agents_count: this.agentManager.getAgents().length,
                tasks_queued: this.taskQueue.getPendingTasks().length,
                tasks_in_progress: this.taskQueue.getInProgressTasks().length,
                tasks_completed: this.taskQueue.getCompletedTasks().length
            }
        };
        if (include_agents) {
            status.agents = this.agentManager.getAgents().map(agent => ({
                id: agent.id,
                role: agent.role.name,
                status: agent.status,
                branch: agent.branch,
                current_tasks: agent.currentTasks.length,
                completed_tasks: agent.completedTasks,
                success_rate: agent.successRate,
                last_heartbeat: agent.lastHeartbeat
            }));
        }
        if (include_tasks) {
            status.tasks = {
                pending: this.taskQueue.getPendingTasks().map(task => ({
                    id: task.id,
                    title: task.title,
                    domain: task.domain,
                    priority: task.priority
                })),
                in_progress: this.taskQueue.getInProgressTasks().map(task => ({
                    id: task.id,
                    title: task.title,
                    domain: task.domain,
                    assigned_to: task.assignedTo,
                    priority: task.priority
                })),
                completed: this.taskQueue.getCompletedTasks().map(task => ({
                    id: task.id,
                    title: task.title,
                    domain: task.domain,
                    completed_at: task.completedAt
                }))
            };
        }
        if (include_git) {
            status.git = {
                worktrees: await this.gitManager.listWorktrees(),
                current_branch: await this.gitManager.getCurrentBranch()
            };
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
    async handleDistributeTask(args) {
        const { task_id, agent_id, priority } = args;
        const task = this.taskQueue.getTask(task_id);
        if (!task) {
            throw new Error(`Task ${task_id} not found`);
        }
        const agent = this.agentManager.getAgent(agent_id);
        if (!agent) {
            throw new Error(`Agent ${agent_id} not found`);
        }
        await this.assignTaskToAgent(task, agent);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        message: `Task ${task_id} assigned to agent ${agent_id}`,
                        task: {
                            id: task.id,
                            title: task.title,
                            status: task.status
                        },
                        agent: {
                            id: agent.id,
                            role: agent.role.name,
                            status: agent.status
                        }
                    }, null, 2)
                }
            ]
        };
    }
    async handleMergeAgentWork(args) {
        const { agent_ids, strategy = 'merge' } = args;
        const agentsToMerge = agent_ids && agent_ids.length > 0
            ? agent_ids.map((id) => this.agentManager.getAgent(id)).filter(Boolean)
            : this.agentManager.getAgents().filter(agent => agent.status === 'idle' && agent.completedTasks > 0);
        const mergeResults = await Promise.all(agentsToMerge.map(async (agent) => {
            try {
                const result = await this.gitManager.mergeWorktree(agent.branch, 'main', strategy);
                if (result.success) {
                    log.git.mergeCompleted(agent.branch, 'main', result.mergeCommit || 'unknown');
                }
                return { agent: agent.id, result };
            }
            catch (error) {
                log.git.conflict(agent.branch, 'merge', error.message);
                return { agent: agent.id, error: error.message };
            }
        }));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        message: 'Merge operation completed',
                        results: mergeResults
                    }, null, 2)
                }
            ]
        };
    }
    async handleTerminateAgents(args) {
        const { agent_ids, force = false } = args;
        const agentsToTerminate = agent_ids && agent_ids.length > 0
            ? agent_ids
            : this.agentManager.getAgents().map(agent => agent.id);
        const terminationResults = await Promise.all(agentsToTerminate.map(async (agentId) => {
            try {
                const agent = this.agentManager.getAgent(agentId);
                if (agent) {
                    await this.agentManager.terminateAgent(agentId, force);
                    await this.gitManager.cleanupWorktree(agent.branch);
                    return { agent: agentId, success: true };
                }
                return { agent: agentId, error: 'Agent not found' };
            }
            catch (error) {
                return { agent: agentId, error: error.message };
            }
        }));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        message: 'Agent termination completed',
                        results: terminationResults
                    }, null, 2)
                }
            ]
        };
    }
    async handleCreateProjectContext(args) {
        const { name, description, framework, root_path } = args;
        this.projectContext = {
            id: generateId(),
            name,
            description,
            rootPath: root_path || process.cwd(),
            framework,
            dependencies: [],
            architecture: {},
            tasks: [],
            agents: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        message: 'Project context created',
                        context: this.projectContext
                    }, null, 2)
                }
            ]
        };
    }
    determineRequiredRoles(tasks) {
        const roleMap = new Map();
        tasks.forEach(task => {
            const domain = task.domain.toLowerCase();
            if (domain.includes('frontend') || domain.includes('ui') || domain.includes('react')) {
                roleMap.set('frontend', (roleMap.get('frontend') || 0) + 1);
            }
            if (domain.includes('backend') || domain.includes('api') || domain.includes('server')) {
                roleMap.set('backend', (roleMap.get('backend') || 0) + 1);
            }
            if (domain.includes('database') || domain.includes('sql') || domain.includes('schema')) {
                roleMap.set('database', (roleMap.get('database') || 0) + 1);
            }
            if (domain.includes('test') || domain.includes('spec') || domain.includes('coverage')) {
                roleMap.set('testing', (roleMap.get('testing') || 0) + 1);
            }
            if (domain.includes('deploy') || domain.includes('docker') || domain.includes('ci')) {
                roleMap.set('devops', (roleMap.get('devops') || 0) + 1);
            }
            if (domain.includes('doc') || domain.includes('readme') || domain.includes('guide')) {
                roleMap.set('documentation', (roleMap.get('documentation') || 0) + 1);
            }
        });
        // Return roles with at least one task
        return Array.from(roleMap.keys()).filter(role => roleMap.get(role) > 0);
    }
    async distributeQueuedTasks() {
        const pendingTasks = this.taskQueue.getPendingTasks();
        const availableAgents = this.agentManager.getAgents().filter(agent => agent.status === 'idle' && agent.currentTasks.length < agent.role.maxConcurrentTasks);
        for (const task of pendingTasks) {
            const suitableAgent = this.findSuitableAgent(availableAgents, task);
            if (suitableAgent) {
                await this.assignTaskToAgent(task, suitableAgent);
            }
        }
    }
    findSuitableAgent(agents, task) {
        return agents.find(agent => {
            return agent.role.capabilities.some(capability => task.domain.toLowerCase().includes(capability.toLowerCase()) ||
                task.description.toLowerCase().includes(capability.toLowerCase()));
        }) || null;
    }
    async assignTaskToAgent(task, agent) {
        // Update task status
        task.status = 'claimed';
        task.assignedTo = agent.id;
        task.updatedAt = new Date();
        // Update agent
        agent.currentTasks.push(task);
        agent.status = 'busy';
        // Send task to agent via WebSocket
        this.wsServer.sendToAgent(agent.id, {
            type: 'task_assigned',
            task: task,
            timestamp: Date.now()
        });
        this.taskQueue.updateTask(task);
        this.agentManager.updateAgent(agent);
        log.agent.taskClaimed(agent.id, task.id);
    }
    async handleAgentMessage(agentId, message) {
        const agent = this.agentManager.getAgent(agentId);
        if (!agent)
            return;
        switch (message.type) {
            case 'task_completed':
                await this.handleTaskCompleted(agentId, message.payload);
                break;
            case 'task_failed':
                await this.handleTaskFailed(agentId, message.payload);
                break;
            case 'status_update':
                await this.handleStatusUpdate(agentId, message.payload);
                break;
            case 'heartbeat':
                agent.lastHeartbeat = new Date();
                this.agentManager.updateAgent(agent);
                break;
        }
    }
    async handleTaskCompleted(agentId, payload) {
        const { taskId, results } = payload;
        const agent = this.agentManager.getAgent(agentId);
        if (!agent)
            return;
        const task = this.taskQueue.getTask(taskId);
        if (!task)
            return;
        // Update task
        task.status = 'completed';
        task.completedAt = new Date();
        task.updatedAt = new Date();
        // Update agent
        agent.currentTasks = agent.currentTasks.filter(t => t.id !== taskId);
        agent.completedTasks++;
        agent.status = agent.currentTasks.length > 0 ? 'busy' : 'idle';
        this.taskQueue.updateTask(task);
        this.agentManager.updateAgent(agent);
        log.agent.taskCompleted(agentId, taskId, Date.now() - task.createdAt.getTime());
        // Distribute more tasks if available
        this.distributeQueuedTasks();
    }
    async handleTaskFailed(agentId, payload) {
        const { taskId, error } = payload;
        const agent = this.agentManager.getAgent(agentId);
        if (!agent)
            return;
        const task = this.taskQueue.getTask(taskId);
        if (!task)
            return;
        // Update task
        task.status = 'failed';
        task.updatedAt = new Date();
        // Update agent
        agent.currentTasks = agent.currentTasks.filter(t => t.id !== taskId);
        agent.status = agent.currentTasks.length > 0 ? 'busy' : 'idle';
        this.taskQueue.updateTask(task);
        this.agentManager.updateAgent(agent);
        log.agent.error(agentId, new Error(error), { taskId });
    }
    async handleStatusUpdate(agentId, payload) {
        const agent = this.agentManager.getAgent(agentId);
        if (!agent)
            return;
        // Update agent metadata
        if (payload.metadata) {
            agent.metadata = { ...agent.metadata, ...payload.metadata };
            this.agentManager.updateAgent(agent);
        }
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        log.system.ready(this.config.port);
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            log.system.shutdown();
            await this.shutdown();
            process.exit(0);
        });
    }
    async shutdown() {
        await this.wsServer.stop();
        await this.agentManager.terminateAllAgents();
        await this.gitManager.cleanupAllWorktrees();
    }
}
// Start the orchestrator
const orchestrator = new OrchestratorMCP();
orchestrator.start().catch(error => {
    log.system.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map