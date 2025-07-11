import { EventEmitter } from 'events';
import { Agent, Task } from '../common/types.js';
export declare class AgentManager extends EventEmitter {
    private agents;
    private processes;
    private config;
    constructor(config: any);
    spawnAgent(roleId: string, workingDirectory: string): Promise<Agent>;
    private startClaudeProcess;
    private buildSystemPrompt;
    private setupProcessCommunication;
    private handleAgentMessage;
    private handleTaskCompleted;
    private handleTaskFailed;
    private handleStatusUpdate;
    assignTask(agentId: string, task: Task): Promise<void>;
    terminateAgent(agentId: string, force?: boolean): Promise<void>;
    terminateAllAgents(force?: boolean): Promise<void>;
    getAgent(agentId: string): Agent | undefined;
    getAgents(): Agent[];
    getAgentsByRole(roleId: string): Agent[];
    getAvailableAgents(): Agent[];
    getBusyAgents(): Agent[];
    updateAgent(agent: Agent): void;
    removeAgent(agentId: string): boolean;
    getAgentStats(): any;
    healthCheck(): Promise<{
        healthy: boolean;
        details: any;
    }>;
}
