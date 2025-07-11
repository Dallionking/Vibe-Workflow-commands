import { OrchestratorConfig, AgentRole } from './types.js';
export declare const DEFAULT_CONFIG: OrchestratorConfig;
export declare const DEFAULT_AGENT_ROLES: AgentRole[];
export declare function loadConfig(configPath?: string): OrchestratorConfig;
export declare function getAgentRole(roleId: string): AgentRole | undefined;
export declare function getAgentRoles(): AgentRole[];
export declare function validateConfig(config: OrchestratorConfig): boolean;
