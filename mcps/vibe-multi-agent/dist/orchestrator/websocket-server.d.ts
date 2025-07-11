import { EventEmitter } from 'events';
export declare class WebSocketServer extends EventEmitter {
    private wss;
    private server;
    private clients;
    private config;
    private running;
    constructor(config: any);
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    private handleMessage;
    private handleAgentRegister;
    private handleHeartbeat;
    private handleTaskRequest;
    private handleTaskCompleted;
    private handleTaskFailed;
    private handleStatusUpdate;
    private handleSyncRequest;
    sendToClient(clientId: string, message: any): boolean;
    sendToAgent(agentId: string, message: any): boolean;
    broadcast(message: any, excludeClientId?: string): number;
    getConnectedClients(): string[];
    getClientCount(): number;
    isClientConnected(clientId: string): boolean;
    disconnectClient(clientId: string, reason?: string): boolean;
    healthCheck(): Promise<{
        healthy: boolean;
        details: any;
    }>;
}
