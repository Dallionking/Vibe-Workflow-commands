export interface AgentRole {
  id: string;
  name: string;
  capabilities: string[];
  description: string;
  systemPrompt: string;
  allowedTools: string[];
  maxConcurrentTasks: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'claimed' | 'in_progress' | 'completed' | 'failed';
  assignedTo?: string;
  dependencies: string[];
  domain: string;
  estimatedEffort: number;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface Agent {
  id: string;
  role: AgentRole;
  status: 'idle' | 'busy' | 'error' | 'terminated';
  branch: string;
  currentTasks: Task[];
  completedTasks: number;
  successRate: number;
  lastHeartbeat: Date;
  workingDirectory: string;
  processId?: number;
  metadata?: Record<string, any>;
}

export interface AgentMessage {
  id: string;
  timestamp: number;
  type: 'task_claim' | 'status_update' | 'completion' | 'error' | 'sync' | 'heartbeat';
  agentId: string;
  payload: any;
}

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  rootPath: string;
  framework: string;
  dependencies: string[];
  architecture: any;
  tasks: Task[];
  agents: Agent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrchestratorConfig {
  host: string;
  port: number;
  ssl: boolean;
  auth: {
    type: 'none' | 'token' | 'oauth';
    secret?: string;
  };
  agents: {
    maxConcurrent: number;
    defaultTimeout: number;
    heartbeatInterval: number;
    reconnectAttempts: number;
  };
  git: {
    worktreePath: string;
    mergeStrategy: 'merge' | 'rebase' | 'squash';
    autoMerge: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file?: string;
  };
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (params: any) => Promise<any>;
}

export interface MCPPrompt {
  name: string;
  description: string;
  arguments: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
  handler: (args: any) => Promise<any>;
}

export enum EventType {
  // Task Management
  TASK_CREATED = 'task.created',
  TASK_CLAIMED = 'task.claimed',
  TASK_STARTED = 'task.started',
  TASK_COMPLETED = 'task.completed',
  TASK_FAILED = 'task.failed',
  
  // Agent Lifecycle
  AGENT_SPAWNED = 'agent.spawned',
  AGENT_READY = 'agent.ready',
  AGENT_BUSY = 'agent.busy',
  AGENT_IDLE = 'agent.idle',
  AGENT_TERMINATED = 'agent.terminated',
  
  // Synchronization
  SYNC_REQUESTED = 'sync.requested',
  SYNC_STARTED = 'sync.started',
  SYNC_COMPLETED = 'sync.completed',
  MERGE_CONFLICT = 'merge.conflict',
  
  // System
  SYSTEM_READY = 'system.ready',
  SYSTEM_SHUTDOWN = 'system.shutdown',
  ERROR = 'error'
}

export interface SystemEvent {
  type: EventType;
  timestamp: Date;
  data: any;
  source?: string;
}

export interface GitWorktree {
  path: string;
  branch: string;
  agentId: string;
  locked: boolean;
  lastCommit?: string;
}

export interface MergeResult {
  success: boolean;
  conflicts?: Array<{
    file: string;
    type: 'content' | 'delete' | 'rename';
    details: string;
  }>;
  mergeCommit?: string;
  error?: string;
}

export interface AgentCapabilities {
  domains: string[];
  tools: string[];
  languages: string[];
  frameworks: string[];
  maxComplexity: number;
  preferredFileTypes: string[];
}