import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { log } from '../common/logger.js';
export class WebSocketServer extends EventEmitter {
    wss = null;
    server = null;
    clients = new Map();
    config;
    running = false;
    constructor(config) {
        super();
        this.config = config;
    }
    async start() {
        if (this.running)
            return;
        this.server = createServer();
        this.wss = new WSServer({ server: this.server });
        this.wss.on('connection', (ws, req) => {
            const clientId = uuidv4();
            this.clients.set(clientId, ws);
            log.info(`WebSocket client connected: ${clientId}`);
            this.emit('agent_connected', clientId);
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleMessage(clientId, message);
                }
                catch (error) {
                    log.error(`Failed to parse message from ${clientId}:`, error);
                    ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
                }
            });
            ws.on('close', () => {
                this.clients.delete(clientId);
                log.info(`WebSocket client disconnected: ${clientId}`);
                this.emit('agent_disconnected', clientId);
            });
            ws.on('error', (error) => {
                log.error(`WebSocket error for client ${clientId}:`, error);
                this.clients.delete(clientId);
                this.emit('agent_disconnected', clientId);
            });
            // Send welcome message
            ws.send(JSON.stringify({
                type: 'welcome',
                clientId,
                timestamp: Date.now()
            }));
        });
        return new Promise((resolve, reject) => {
            this.server.listen(this.config.port, this.config.host, (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    this.running = true;
                    log.info(`WebSocket server started on ${this.config.host}:${this.config.port}`);
                    resolve();
                }
            });
        });
    }
    async stop() {
        if (!this.running)
            return;
        // Close all client connections
        this.clients.forEach((ws, clientId) => {
            ws.close(1000, 'Server shutting down');
        });
        this.clients.clear();
        // Close WebSocket server
        if (this.wss) {
            this.wss.close();
        }
        // Close HTTP server
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    this.running = false;
                    log.info('WebSocket server stopped');
                    resolve();
                });
            });
        }
        this.running = false;
    }
    isRunning() {
        return this.running;
    }
    handleMessage(clientId, message) {
        try {
            // Validate message structure
            if (!message.type) {
                throw new Error('Message must have a type');
            }
            // Add client ID to message
            const agentMessage = {
                id: message.id || uuidv4(),
                timestamp: message.timestamp || Date.now(),
                type: message.type,
                agentId: clientId,
                payload: message.payload || {}
            };
            log.debug(`Received message from ${clientId}:`, agentMessage);
            this.emit('agent_message', clientId, agentMessage);
            // Handle specific message types
            switch (message.type) {
                case 'agent_register':
                    this.handleAgentRegister(clientId, message.payload);
                    break;
                case 'heartbeat':
                    this.handleHeartbeat(clientId);
                    break;
                case 'task_request':
                    this.handleTaskRequest(clientId, message.payload);
                    break;
                case 'task_completed':
                    this.handleTaskCompleted(clientId, message.payload);
                    break;
                case 'task_failed':
                    this.handleTaskFailed(clientId, message.payload);
                    break;
                case 'status_update':
                    this.handleStatusUpdate(clientId, message.payload);
                    break;
                case 'sync_request':
                    this.handleSyncRequest(clientId, message.payload);
                    break;
                default:
                    log.warn(`Unknown message type: ${message.type} from ${clientId}`);
            }
        }
        catch (error) {
            log.error(`Error handling message from ${clientId}:`, error);
            this.sendToClient(clientId, {
                type: 'error',
                message: error.message,
                timestamp: Date.now()
            });
        }
    }
    handleAgentRegister(clientId, payload) {
        const { role, capabilities, branch } = payload;
        log.info(`Agent registered: ${clientId} as ${role} on branch ${branch}`);
        this.sendToClient(clientId, {
            type: 'registration_confirmed',
            agentId: clientId,
            timestamp: Date.now()
        });
        this.emit('agent_registered', clientId, { role, capabilities, branch });
    }
    handleHeartbeat(clientId) {
        this.sendToClient(clientId, {
            type: 'heartbeat_ack',
            timestamp: Date.now()
        });
    }
    handleTaskRequest(clientId, payload) {
        log.info(`Task request from ${clientId}:`, payload);
        this.emit('task_request', clientId, payload);
    }
    handleTaskCompleted(clientId, payload) {
        const { taskId, results } = payload;
        log.info(`Task completed by ${clientId}: ${taskId}`);
        this.emit('task_completed', clientId, { taskId, results });
    }
    handleTaskFailed(clientId, payload) {
        const { taskId, error } = payload;
        log.warn(`Task failed by ${clientId}: ${taskId} - ${error}`);
        this.emit('task_failed', clientId, { taskId, error });
    }
    handleStatusUpdate(clientId, payload) {
        log.debug(`Status update from ${clientId}:`, payload);
        this.emit('status_update', clientId, payload);
    }
    handleSyncRequest(clientId, payload) {
        const { files, message } = payload;
        log.info(`Sync request from ${clientId} for ${files.length} files`);
        this.emit('sync_request', clientId, { files, message });
    }
    sendToClient(clientId, message) {
        const ws = this.clients.get(clientId);
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            log.warn(`Cannot send message to ${clientId}: connection not available`);
            return false;
        }
        try {
            ws.send(JSON.stringify(message));
            log.debug(`Sent message to ${clientId}:`, message);
            return true;
        }
        catch (error) {
            log.error(`Failed to send message to ${clientId}:`, error);
            return false;
        }
    }
    sendToAgent(agentId, message) {
        return this.sendToClient(agentId, message);
    }
    broadcast(message, excludeClientId) {
        let sentCount = 0;
        this.clients.forEach((ws, clientId) => {
            if (clientId !== excludeClientId && ws.readyState === WebSocket.OPEN) {
                try {
                    ws.send(JSON.stringify(message));
                    sentCount++;
                }
                catch (error) {
                    log.error(`Failed to broadcast to ${clientId}:`, error);
                }
            }
        });
        log.debug(`Broadcast message to ${sentCount} clients:`, message);
        return sentCount;
    }
    getConnectedClients() {
        return Array.from(this.clients.keys());
    }
    getClientCount() {
        return this.clients.size;
    }
    isClientConnected(clientId) {
        const ws = this.clients.get(clientId);
        return ws ? ws.readyState === WebSocket.OPEN : false;
    }
    disconnectClient(clientId, reason) {
        const ws = this.clients.get(clientId);
        if (!ws)
            return false;
        try {
            ws.close(1000, reason || 'Disconnected by server');
            this.clients.delete(clientId);
            log.info(`Disconnected client ${clientId}: ${reason || 'No reason provided'}`);
            return true;
        }
        catch (error) {
            log.error(`Failed to disconnect client ${clientId}:`, error);
            return false;
        }
    }
    // Health check endpoint
    async healthCheck() {
        const details = {
            running: this.running,
            connectedClients: this.getClientCount(),
            port: this.config.port,
            host: this.config.host
        };
        return {
            healthy: this.running,
            details
        };
    }
}
//# sourceMappingURL=websocket-server.js.map