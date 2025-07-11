import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import { Agent, AgentRole, Task } from '../common/types.js';
import { getAgentRole, getAgentRoles } from '../common/config.js';
import { generateAgentId, generateBranchName } from '../common/utils.js';
import { log } from '../common/logger.js';

export class AgentManager extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private processes: Map<string, ChildProcess> = new Map();
  private config: any;

  constructor(config: any) {
    super();
    this.config = config;
  }

  async spawnAgent(roleId: string, workingDirectory: string): Promise<Agent> {
    const role = getAgentRole(roleId);
    if (!role) {
      throw new Error(`Unknown agent role: ${roleId}`);
    }

    const agentId = generateAgentId(roleId);
    const branch = generateBranchName(agentId);

    const agent: Agent = {
      id: agentId,
      role,
      status: 'idle',
      branch,
      currentTasks: [],
      completedTasks: 0,
      successRate: 1.0,
      lastHeartbeat: new Date(),
      workingDirectory,
      metadata: {}
    };

    // Spawn Claude Code process for this agent
    const process = await this.startClaudeProcess(agent, workingDirectory);
    
    this.agents.set(agentId, agent);
    this.processes.set(agentId, process);

    log.info(`Agent spawned: ${agentId} (${role.name}) on branch ${branch}`);
    this.emit('agent_spawned', agent);

    return agent;
  }

  private async startClaudeProcess(agent: Agent, workingDirectory: string): Promise<ChildProcess> {
    const claudeArgs = [
      '--non-interactive',
      '--system-prompt', this.buildSystemPrompt(agent),
      '--working-directory', workingDirectory,
      '--session-id', `vibe-agent-${agent.id}`,
      '--tools', agent.role.allowedTools.join(','),
      '--config', JSON.stringify({
        orchestrator: {
          host: this.config.host,
          port: this.config.port,
          agentId: agent.id,
          role: agent.role.id,
          branch: agent.branch
        }
      })
    ];

    const claudeProcess = spawn('claude', claudeArgs, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: workingDirectory,
      env: {
        ...process.env,
        VIBE_AGENT_ID: agent.id,
        VIBE_AGENT_ROLE: agent.role.id,
        VIBE_AGENT_BRANCH: agent.branch,
        VIBE_ORCHESTRATOR_HOST: this.config.host,
        VIBE_ORCHESTRATOR_PORT: this.config.port.toString(),
        VIBE_ORCHESTRATOR_WS: `ws://${this.config.host}:${this.config.port}/agent`
      }
    });

    // Handle process events
    claudeProcess.on('spawn', () => {
      log.info(`Claude process spawned for agent ${agent.id}`);
      agent.processId = claudeProcess.pid;
      agent.status = 'idle';
      this.emit('agent_ready', agent);
    });

    claudeProcess.on('error', (error) => {
      log.error(`Claude process error for agent ${agent.id}:`, error);
      agent.status = 'error';
      this.emit('agent_error', agent, error);
    });

    claudeProcess.on('exit', (code, signal) => {
      log.info(`Claude process exited for agent ${agent.id}: code=${code}, signal=${signal}`);
      agent.status = 'terminated';
      this.processes.delete(agent.id);
      this.emit('agent_terminated', agent);
    });

    // Setup communication with Claude process
    this.setupProcessCommunication(agent, claudeProcess);

    return claudeProcess;
  }

  private buildSystemPrompt(agent: Agent): string {
    const basePrompt = agent.role.systemPrompt;
    
    const orchestratorInstructions = `

MULTI-AGENT ORCHESTRATION INSTRUCTIONS:
You are part of a multi-agent development team. Your role is: ${agent.role.name}

Your Agent ID: ${agent.id}
Your Branch: ${agent.branch}
Orchestrator WebSocket: ws://${this.config.host}:${this.config.port}/agent

COMMUNICATION PROTOCOL:
1. Connect to the orchestrator WebSocket on startup
2. Send regular heartbeats every 30 seconds
3. Request tasks when idle
4. Report progress and completion
5. Coordinate with other agents through the orchestrator

TASK HANDLING:
- You will receive tasks through the WebSocket connection
- Each task has an ID, description, files, and dependencies
- Work only on files assigned to your tasks
- Report completion with results
- Report failures with error details

COLLABORATION RULES:
- Work only on your assigned branch: ${agent.branch}
- Do not modify files being worked on by other agents
- Communicate conflicts through the orchestrator
- Follow the Vibe Coding quality standards (95% test coverage)

SPECIALIZED CAPABILITIES:
${agent.role.capabilities.map(cap => `- ${cap}`).join('\n')}

Start by connecting to the orchestrator and requesting your first task.
`;

    return basePrompt + orchestratorInstructions;
  }

  private setupProcessCommunication(agent: Agent, process: ChildProcess) {
    // Send initial connection message
    const connectionMessage = {
      type: 'connect_to_orchestrator',
      agentId: agent.id,
      role: agent.role.id,
      branch: agent.branch,
      orchestratorWs: `ws://${this.config.host}:${this.config.port}/agent`
    };

    process.stdin?.write(JSON.stringify(connectionMessage) + '\n');

    // Handle stdout
    process.stdout?.on('data', (data) => {
      const output = data.toString();
      log.debug(`Agent ${agent.id} stdout:`, output);
      
      try {
        const messages = output.split('\n').filter(line => line.trim());
        messages.forEach(line => {
          if (line.startsWith('{')) {
            const message = JSON.parse(line);
            this.handleAgentMessage(agent, message);
          }
        });
      } catch (error) {
        // Non-JSON output, likely just regular Claude output
        log.debug(`Agent ${agent.id} output:`, output);
      }
    });

    // Handle stderr
    process.stderr?.on('data', (data) => {
      const error = data.toString();
      log.warn(`Agent ${agent.id} stderr:`, error);
    });
  }

  private handleAgentMessage(agent: Agent, message: any) {
    switch (message.type) {
      case 'task_completed':
        this.handleTaskCompleted(agent, message.payload);
        break;
      case 'task_failed':
        this.handleTaskFailed(agent, message.payload);
        break;
      case 'status_update':
        this.handleStatusUpdate(agent, message.payload);
        break;
      case 'heartbeat':
        agent.lastHeartbeat = new Date();
        break;
      default:
        log.debug(`Unhandled message from agent ${agent.id}:`, message);
    }
  }

  private handleTaskCompleted(agent: Agent, payload: any) {
    const { taskId, results } = payload;
    
    // Remove task from current tasks
    agent.currentTasks = agent.currentTasks.filter(task => task.id !== taskId);
    agent.completedTasks++;
    agent.status = agent.currentTasks.length > 0 ? 'busy' : 'idle';
    
    // Update success rate
    const totalTasks = agent.completedTasks + agent.currentTasks.length;
    agent.successRate = agent.completedTasks / totalTasks;
    
    log.info(`Task completed by agent ${agent.id}: ${taskId}`);
    this.emit('task_completed', agent, taskId, results);
  }

  private handleTaskFailed(agent: Agent, payload: any) {
    const { taskId, error } = payload;
    
    // Remove task from current tasks
    agent.currentTasks = agent.currentTasks.filter(task => task.id !== taskId);
    agent.status = agent.currentTasks.length > 0 ? 'busy' : 'idle';
    
    log.warn(`Task failed by agent ${agent.id}: ${taskId} - ${error}`);
    this.emit('task_failed', agent, taskId, error);
  }

  private handleStatusUpdate(agent: Agent, payload: any) {
    if (payload.metadata) {
      agent.metadata = { ...agent.metadata, ...payload.metadata };
    }
    
    if (payload.status) {
      agent.status = payload.status;
    }
    
    this.emit('agent_status_update', agent);
  }

  async assignTask(agentId: string, task: Task): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    if (agent.currentTasks.length >= agent.role.maxConcurrentTasks) {
      throw new Error(`Agent ${agentId} is at capacity`);
    }

    // Add task to agent's current tasks
    agent.currentTasks.push(task);
    agent.status = 'busy';
    
    // Send task to Claude process
    const process = this.processes.get(agentId);
    if (process && process.stdin) {
      const taskMessage = {
        type: 'task_assigned',
        task,
        timestamp: Date.now()
      };
      
      process.stdin.write(JSON.stringify(taskMessage) + '\n');
      log.info(`Task assigned to agent ${agentId}: ${task.id}`);
    }

    this.emit('task_assigned', agent, task);
  }

  async terminateAgent(agentId: string, force: boolean = false): Promise<void> {
    const agent = this.agents.get(agentId);
    const process = this.processes.get(agentId);

    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    if (agent.currentTasks.length > 0 && !force) {
      throw new Error(`Agent ${agentId} has active tasks. Use force=true to terminate anyway.`);
    }

    // Send termination message to Claude process
    if (process && process.stdin) {
      const terminationMessage = {
        type: 'terminate',
        reason: force ? 'Forced termination' : 'Normal termination',
        timestamp: Date.now()
      };
      
      process.stdin.write(JSON.stringify(terminationMessage) + '\n');
      
      // Give process time to cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Kill process if still running
    if (process && !process.killed) {
      process.kill(force ? 'SIGKILL' : 'SIGTERM');
    }

    // Clean up
    this.agents.delete(agentId);
    this.processes.delete(agentId);

    log.info(`Agent terminated: ${agentId}`);
    this.emit('agent_terminated', agent);
  }

  async terminateAllAgents(force: boolean = false): Promise<void> {
    const terminationPromises = Array.from(this.agents.keys()).map(agentId =>
      this.terminateAgent(agentId, force)
    );

    await Promise.all(terminationPromises);
    log.info('All agents terminated');
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgentsByRole(roleId: string): Agent[] {
    return this.getAgents().filter(agent => agent.role.id === roleId);
  }

  getAvailableAgents(): Agent[] {
    return this.getAgents().filter(agent => 
      agent.status === 'idle' && 
      agent.currentTasks.length < agent.role.maxConcurrentTasks
    );
  }

  getBusyAgents(): Agent[] {
    return this.getAgents().filter(agent => agent.status === 'busy');
  }

  updateAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    this.emit('agent_updated', agent);
  }

  removeAgent(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    this.agents.delete(agentId);
    
    // Clean up process
    const process = this.processes.get(agentId);
    if (process && !process.killed) {
      process.kill('SIGTERM');
    }
    this.processes.delete(agentId);

    log.info(`Agent removed: ${agentId}`);
    this.emit('agent_removed', agent);
    return true;
  }

  getAgentStats(): any {
    const agents = this.getAgents();
    const roleStats = new Map<string, any>();

    agents.forEach(agent => {
      const roleId = agent.role.id;
      if (!roleStats.has(roleId)) {
        roleStats.set(roleId, {
          role: agent.role.name,
          count: 0,
          totalTasks: 0,
          completedTasks: 0,
          avgSuccessRate: 0,
          statuses: { idle: 0, busy: 0, error: 0, terminated: 0 }
        });
      }

      const stats = roleStats.get(roleId);
      stats.count++;
      stats.totalTasks += agent.currentTasks.length;
      stats.completedTasks += agent.completedTasks;
      stats.avgSuccessRate += agent.successRate;
      stats.statuses[agent.status]++;
    });

    // Calculate averages
    roleStats.forEach(stats => {
      stats.avgSuccessRate = stats.avgSuccessRate / stats.count;
    });

    return {
      totalAgents: agents.length,
      roleStats: Object.fromEntries(roleStats),
      overallStats: {
        totalTasks: agents.reduce((sum, agent) => sum + agent.currentTasks.length, 0),
        completedTasks: agents.reduce((sum, agent) => sum + agent.completedTasks, 0),
        avgSuccessRate: agents.reduce((sum, agent) => sum + agent.successRate, 0) / agents.length
      }
    };
  }

  // Health check
  async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    const agents = this.getAgents();
    const stats = this.getAgentStats();
    
    const unhealthyAgents = agents.filter(agent => 
      agent.status === 'error' || 
      (Date.now() - agent.lastHeartbeat.getTime()) > 60000 // 1 minute
    );

    return {
      healthy: unhealthyAgents.length === 0,
      details: {
        ...stats,
        unhealthyAgents: unhealthyAgents.map(agent => ({
          id: agent.id,
          role: agent.role.name,
          status: agent.status,
          lastHeartbeat: agent.lastHeartbeat
        }))
      }
    };
  }
}