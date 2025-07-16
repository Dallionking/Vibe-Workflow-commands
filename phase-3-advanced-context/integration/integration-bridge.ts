/**
 * Integration Bridge
 * Phase 3: Advanced Context Features - Tier 2.5
 * 
 * Implements the communication bridge between PRP and Field Protocol systems
 * with connection management, sync operations, and health monitoring.
 */

import {
    IntegrationBridge as IIntegrationBridge,
    BridgeStatus,
    SyncResult,
    SyncConflict,
    IntegrationMessage,
    MessageAcknowledgment
} from './interfaces';

export class IntegrationBridge implements IIntegrationBridge {
    private connected = false;
    private bidirectionalSyncEnabled = false;
    private lastSync: Date = new Date();
    private messagesProcessed = 0;
    private errorCount = 0;
    private latencyHistory: number[] = [];
    private throughputHistory: number[] = [];
    private connectionStartTime: Date | null = null;
    private syncInterval: NodeJS.Timeout | null = null;
    private healthCheckInterval: NodeJS.Timeout | null = null;
    private connectionRetryCount = 0;
    private maxRetries = 5;
    private retryDelayMs = 1000;
    
    // Connection pools and channels
    private prpConnection: ConnectionChannel | null = null;
    private fieldProtocolConnection: ConnectionChannel | null = null;
    private messageBuffer: IntegrationMessage[] = [];
    private syncQueue: SyncOperation[] = [];
    private conflictResolver: ConflictResolver;
    
    constructor() {
        this.conflictResolver = new ConflictResolver();
    }
    
    /**
     * Establish connection between systems
     */
    async connect(): Promise<void> {
        console.log('🔗 Establishing Integration Bridge connection');
        
        try {
            await this.establishConnections();
            await this.initializeChannels();
            
            // Set connected to true before initial sync (which needs connection)
            this.connected = true;
            this.connectionStartTime = new Date();
            this.connectionRetryCount = 0;
            
            // Now perform initial sync
            try {
                await this.performInitialSync();
            } catch (syncError) {
                // If sync fails, mark as disconnected
                this.connected = false;
                throw syncError;
            }
            
            this.startPeriodicSync();
            this.startHealthMonitoring();
            
            console.log('✅ Integration Bridge connected successfully');
            
        } catch (error) {
            console.log('❌ Failed to connect Integration Bridge:', error);
            
            if (this.connectionRetryCount < this.maxRetries) {
                this.connectionRetryCount++;
                console.log(`🔄 Retrying connection (${this.connectionRetryCount}/${this.maxRetries})`);
                
                await this.delay(this.retryDelayMs * this.connectionRetryCount);
                return this.connect();
            }
            
            throw new Error(`Failed to connect after ${this.maxRetries} attempts: ${error}`);
        }
    }
    
    /**
     * Disconnect the bridge
     */
    async disconnect(): Promise<void> {
        console.log('⚠️ Disconnecting Integration Bridge');
        
        this.connected = false;
        
        // Stop periodic operations
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        
        // Process remaining messages
        await this.flushMessageBuffer();
        
        // Close connections
        await this.closeConnections();
        
        console.log('✅ Integration Bridge disconnected');
    }
    
    /**
     * Check if bridge is connected
     */
    isConnected(): boolean {
        return this.connected && this.prpConnection?.isActive() && this.fieldProtocolConnection?.isActive();
    }
    
    /**
     * Get current bridge status
     */
    getStatus(): BridgeStatus {
        const uptime = this.connectionStartTime ? 
            (Date.now() - this.connectionStartTime.getTime()) / 1000 : 0;
        
        const averageLatency = this.latencyHistory.length > 0 ?
            this.latencyHistory.reduce((sum, latency) => sum + latency, 0) / this.latencyHistory.length : 0;
        
        const throughput = this.throughputHistory.length > 0 ?
            this.throughputHistory[this.throughputHistory.length - 1] : 0;
        
        const health = this.calculateHealthStatus();
        
        return {
            connected: this.isConnected(),
            lastSync: this.lastSync,
            messagesProcessed: this.messagesProcessed,
            errorCount: this.errorCount,
            averageLatency,
            throughput,
            health
        };
    }
    
    /**
     * Enable bidirectional synchronization
     */
    async enableBidirectionalSync(): Promise<void> {
        console.log('🔄 Enabling bidirectional synchronization');
        
        this.validateConnection();
        
        this.bidirectionalSyncEnabled = true;
        
        // Perform full sync to ensure consistency
        await this.syncState();
        
        console.log('✅ Bidirectional synchronization enabled');
    }
    
    /**
     * Disable bidirectional synchronization
     */
    async disableBidirectionalSync(): Promise<void> {
        console.log('⏸️ Disabling bidirectional synchronization');
        
        this.bidirectionalSyncEnabled = false;
        
        console.log('✅ Bidirectional synchronization disabled');
    }
    
    /**
     * Synchronize state between systems
     */
    async syncState(): Promise<SyncResult> {
        console.log('🔄 Synchronizing state between systems');
        
        this.validateConnection();
        
        const startTime = Date.now();
        const syncTimestamp = new Date();
        const conflicts: SyncConflict[] = [];
        let itemsSynced = 0;
        const errors: string[] = [];
        
        try {
            // Collect sync operations
            const syncOperations = await this.collectSyncOperations();
            
            // Process sync operations
            for (const operation of syncOperations) {
                try {
                    const result = await this.processSyncOperation(operation);
                    
                    if (result.conflicts.length > 0) {
                        conflicts.push(...result.conflicts);
                    }
                    
                    itemsSynced += result.itemsSynced;
                    
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
                    errors.push(`Operation ${operation.id}: ${errorMessage}`);
                    console.log(`❌ Sync operation failed: ${errorMessage}`);
                }
            }
            
            // Resolve conflicts
            if (conflicts.length > 0) {
                await this.resolveConflicts(conflicts);
            }
            
            this.lastSync = syncTimestamp;
            
            const duration = Date.now() - startTime;
            this.updateLatencyHistory(duration);
            
            const result: SyncResult = {
                success: errors.length === 0,
                itemsSynced,
                errors,
                duration,
                timestamp: syncTimestamp,
                conflicts
            };
            
            console.log(`${result.success ? '✅' : '⚠️'} Sync complete: ${itemsSynced} items, ${conflicts.length} conflicts, ${errors.length} errors`);
            return result;
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
            console.log(`❌ Sync failed: ${errorMessage}`);
            
            return {
                success: false,
                itemsSynced: 0,
                errors: [errorMessage],
                duration: Date.now() - startTime,
                timestamp: syncTimestamp,
                conflicts: []
            };
        }
    }
    
    /**
     * Send message through bridge
     */
    async sendMessage(message: IntegrationMessage): Promise<MessageAcknowledgment> {
        this.validateConnection();
        
        const startTime = Date.now();
        
        try {
            // Determine target connection
            const targetConnection = message.target === 'prp' ? 
                this.prpConnection : this.fieldProtocolConnection;
            
            if (!targetConnection || !targetConnection.isActive()) {
                throw new Error(`Target connection (${message.target}) is not active`);
            }
            
            // Send message
            await targetConnection.send(message);
            
            this.messagesProcessed++;
            this.updateLatencyHistory(Date.now() - startTime);
            
            return {
                received: true,
                processed: true,
                timestamp: new Date(),
                processingTime: Date.now() - startTime,
                status: 'success'
            };
            
        } catch (error) {
            this.errorCount++;
            const errorMessage = error instanceof Error ? error.message : 'Unknown send error';
            
            return {
                received: false,
                processed: false,
                timestamp: new Date(),
                processingTime: Date.now() - startTime,
                status: 'error',
                errorMessage
            };
        }
    }
    
    // Private implementation methods
    private async establishConnections(): Promise<void> {
        console.log('🔌 Establishing system connections');
        
        // Create PRP connection
        this.prpConnection = new ConnectionChannel('prp', {
            host: 'localhost',
            port: 8001,
            protocol: 'ws',
            timeout: 5000,
            maxRetries: 3
        });
        
        // Create Field Protocol connection
        this.fieldProtocolConnection = new ConnectionChannel('field_protocol', {
            host: 'localhost',
            port: 8002,
            protocol: 'ws',
            timeout: 5000,
            maxRetries: 3
        });
        
        // Connect both channels
        await Promise.all([
            this.prpConnection.connect(),
            this.fieldProtocolConnection.connect()
        ]);
        
        console.log('✅ System connections established');
    }
    
    private async initializeChannels(): Promise<void> {
        console.log('📡 Initializing communication channels');
        
        // Setup message handlers
        this.prpConnection?.onMessage((message) => {
            this.handleIncomingMessage(message, 'prp');
        });
        
        this.fieldProtocolConnection?.onMessage((message) => {
            this.handleIncomingMessage(message, 'field_protocol');
        });
        
        // Setup error handlers
        this.prpConnection?.onError((error) => {
            this.handleConnectionError('prp', error);
        });
        
        this.fieldProtocolConnection?.onError((error) => {
            this.handleConnectionError('field_protocol', error);
        });
        
        console.log('✅ Communication channels initialized');
    }
    
    private async performInitialSync(): Promise<void> {
        console.log('🔄 Performing initial state synchronization');
        
        const result = await this.syncState();
        
        if (!result.success) {
            throw new Error(`Initial sync failed: ${result.errors.join(', ')}`);
        }
        
        console.log('✅ Initial synchronization complete');
    }
    
    private startPeriodicSync(): void {
        if (!this.bidirectionalSyncEnabled) return;
        
        this.syncInterval = setInterval(async () => {
            if (this.isConnected()) {
                await this.syncState();
            }
        }, 30000); // Sync every 30 seconds
    }
    
    private startHealthMonitoring(): void {
        this.healthCheckInterval = setInterval(() => {
            this.performHealthCheck();
        }, 10000); // Check every 10 seconds
    }
    
    private performHealthCheck(): void {
        // Check connection health
        if (!this.isConnected()) {
            console.log('⚠️ Bridge connection health degraded');
            this.attemptReconnection();
        }
        
        // Update throughput metrics
        this.updateThroughputHistory();
        
        // Trim history arrays to prevent memory leaks
        this.trimHistoryArrays();
    }
    
    private async attemptReconnection(): Promise<void> {
        if (this.connectionRetryCount >= this.maxRetries) {
            console.log('❌ Maximum reconnection attempts reached');
            return;
        }
        
        console.log('🔄 Attempting to reconnect bridge');
        
        try {
            await this.connect();
        } catch (error) {
            console.log('❌ Reconnection failed:', error);
        }
    }
    
    private updateLatencyHistory(latency: number): void {
        this.latencyHistory.push(latency);
        if (this.latencyHistory.length > 100) {
            this.latencyHistory = this.latencyHistory.slice(-100);
        }
    }
    
    private updateThroughputHistory(): void {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Count messages processed in the last minute
        const recentMessages = this.messagesProcessed; // Simplified
        const throughput = recentMessages / 60; // Messages per second
        
        this.throughputHistory.push(throughput);
        if (this.throughputHistory.length > 60) {
            this.throughputHistory = this.throughputHistory.slice(-60);
        }
    }
    
    private trimHistoryArrays(): void {
        const maxHistory = 1000;
        
        if (this.latencyHistory.length > maxHistory) {
            this.latencyHistory = this.latencyHistory.slice(-maxHistory);
        }
        
        if (this.throughputHistory.length > maxHistory) {
            this.throughputHistory = this.throughputHistory.slice(-maxHistory);
        }
    }
    
    private calculateHealthStatus(): 'healthy' | 'degraded' | 'critical' | 'offline' {
        if (!this.isConnected()) {
            return 'offline';
        }
        
        const averageLatency = this.latencyHistory.length > 0 ?
            this.latencyHistory.reduce((sum, latency) => sum + latency, 0) / this.latencyHistory.length : 0;
        
        const errorRate = this.messagesProcessed > 0 ? this.errorCount / this.messagesProcessed : 0;
        
        if (errorRate > 0.1 || averageLatency > 5000) {
            return 'critical';
        } else if (errorRate > 0.05 || averageLatency > 2000) {
            return 'degraded';
        } else {
            return 'healthy';
        }
    }
    
    private async collectSyncOperations(): Promise<SyncOperation[]> {
        const operations: SyncOperation[] = [];
        
        // Collect PRP state changes
        if (this.prpConnection?.isActive()) {
            const prpOperations = await this.collectPRPSyncOperations();
            operations.push(...prpOperations);
        }
        
        // Collect Field Protocol state changes
        if (this.fieldProtocolConnection?.isActive()) {
            const fieldOperations = await this.collectFieldProtocolSyncOperations();
            operations.push(...fieldOperations);
        }
        
        return operations;
    }
    
    private async collectPRPSyncOperations(): Promise<SyncOperation[]> {
        // Simplified - would collect actual PRP state changes
        return [{
            id: `prp_sync_${Date.now()}`,
            type: 'prp_state',
            source: 'prp',
            target: 'field_protocol',
            data: { templates: [], validations: [] },
            timestamp: new Date(),
            priority: 'normal'
        }];
    }
    
    private async collectFieldProtocolSyncOperations(): Promise<SyncOperation[]> {
        // Simplified - would collect actual Field Protocol state changes
        return [{
            id: `field_sync_${Date.now()}`,
            type: 'field_state',
            source: 'field_protocol',
            target: 'prp',
            data: { fields: [], patterns: [] },
            timestamp: new Date(),
            priority: 'normal'
        }];
    }
    
    private async processSyncOperation(operation: SyncOperation): Promise<OperationResult> {
        console.log(`⚙️ Processing sync operation: ${operation.id}`);
        
        const conflicts: SyncConflict[] = [];
        let itemsSynced = 0;
        
        try {
            // Check for conflicts
            const potentialConflicts = await this.detectConflicts(operation);
            
            if (potentialConflicts.length > 0) {
                conflicts.push(...potentialConflicts);
                
                // Skip automatic resolution for manual conflicts
                const manualConflicts = conflicts.filter(c => c.resolution === 'manual');
                if (manualConflicts.length > 0) {
                    console.log(`⚠️ Manual conflicts detected for operation ${operation.id}`);
                    return { conflicts, itemsSynced: 0 };
                }
            }
            
            // Apply operation
            await this.applyOperation(operation);
            itemsSynced = this.calculateItemCount(operation);
            
            console.log(`✅ Sync operation completed: ${operation.id}`);
            
        } catch (error) {
            console.log(`❌ Sync operation failed: ${operation.id}`, error);
            throw error;
        }
        
        return { conflicts, itemsSynced };
    }
    
    private async detectConflicts(operation: SyncOperation): Promise<SyncConflict[]> {
        const conflicts: SyncConflict[] = [];
        
        // Simplified conflict detection
        // In a real implementation, this would check for:
        // - Concurrent modifications
        // - Version conflicts
        // - Data inconsistencies
        
        return conflicts;
    }
    
    private async applyOperation(operation: SyncOperation): Promise<void> {
        const targetConnection = operation.target === 'prp' ? 
            this.prpConnection : this.fieldProtocolConnection;
        
        if (!targetConnection || !targetConnection.isActive()) {
            throw new Error(`Target connection (${operation.target}) is not active`);
        }
        
        // Send operation to target system
        const message: IntegrationMessage = {
            id: `sync_msg_${operation.id}`,
            timestamp: new Date(),
            source: operation.source,
            target: operation.target,
            type: 'synchronization_update',
            payload: {
                data: operation.data,
                metadata: {
                    size: JSON.stringify(operation.data).length,
                    format: 'json',
                    checksum: this.calculateChecksum(JSON.stringify(operation.data)),
                    version: '1.0.0',
                    sourceTimestamp: operation.timestamp
                },
                schema: `${operation.type}_v1`
            },
            priority: operation.priority,
            context: {
                sessionId: `sync_session_${Date.now()}`,
                requestId: operation.id,
                correlationId: `sync_corr_${Date.now()}`,
                environment: 'development',
                tags: ['sync', operation.type],
                customHeaders: {}
            }
        };
        
        await targetConnection.send(message);
    }
    
    private calculateItemCount(operation: SyncOperation): number {
        // Calculate number of items being synced
        if (Array.isArray(operation.data)) {
            return operation.data.length;
        } else if (typeof operation.data === 'object' && operation.data !== null) {
            return Object.keys(operation.data).length;
        }
        return 1;
    }
    
    private async resolveConflicts(conflicts: SyncConflict[]): Promise<void> {
        console.log(`🔧 Resolving ${conflicts.length} conflicts`);
        
        for (const conflict of conflicts) {
            await this.conflictResolver.resolve(conflict);
        }
        
        console.log('✅ Conflicts resolved');
    }
    
    private handleIncomingMessage(message: IntegrationMessage, source: string): void {
        console.log(`📥 Received message from ${source}: ${message.type}`);
        
        // Add to message buffer for processing
        this.messageBuffer.push(message);
        
        // Process buffer if it gets too large
        if (this.messageBuffer.length > 100) {
            this.flushMessageBuffer();
        }
    }
    
    private handleConnectionError(source: string, error: any): void {
        console.log(`❌ Connection error from ${source}:`, error);
        this.errorCount++;
        
        // Attempt to recover connection
        this.attemptReconnection();
    }
    
    private async flushMessageBuffer(): Promise<void> {
        if (this.messageBuffer.length === 0) return;
        
        console.log(`📤 Flushing ${this.messageBuffer.length} buffered messages`);
        
        const messages = [...this.messageBuffer];
        this.messageBuffer = [];
        
        for (const message of messages) {
            try {
                await this.sendMessage(message);
            } catch (error) {
                console.log(`❌ Failed to flush message ${message.id}:`, error);
            }
        }
    }
    
    private async closeConnections(): Promise<void> {
        console.log('🔌 Closing system connections');
        
        const closePromises: Promise<void>[] = [];
        
        if (this.prpConnection) {
            closePromises.push(this.prpConnection.close());
        }
        
        if (this.fieldProtocolConnection) {
            closePromises.push(this.fieldProtocolConnection.close());
        }
        
        await Promise.all(closePromises);
        
        this.prpConnection = null;
        this.fieldProtocolConnection = null;
        
        console.log('✅ System connections closed');
    }
    
    private validateConnection(): void {
        if (!this.isConnected()) {
            throw new Error('Bridge is not connected');
        }
    }
    
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    private calculateChecksum(data: string): string {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    /**
     * Get bridge statistics
     */
    getStatistics(): {
        uptime: number;
        messagesProcessed: number;
        errorCount: number;
        averageLatency: number;
        currentThroughput: number;
        connectionHealth: string;
    } {
        const uptime = this.connectionStartTime ? 
            (Date.now() - this.connectionStartTime.getTime()) / 1000 : 0;
        
        const averageLatency = this.latencyHistory.length > 0 ?
            this.latencyHistory.reduce((sum, latency) => sum + latency, 0) / this.latencyHistory.length : 0;
        
        const currentThroughput = this.throughputHistory.length > 0 ?
            this.throughputHistory[this.throughputHistory.length - 1] : 0;
        
        return {
            uptime,
            messagesProcessed: this.messagesProcessed,
            errorCount: this.errorCount,
            averageLatency,
            currentThroughput,
            connectionHealth: this.calculateHealthStatus()
        };
    }
}

// Helper classes
class ConnectionChannel {
    private name: string;
    private config: ConnectionConfig;
    private active = false;
    private messageHandler: ((message: IntegrationMessage) => void) | null = null;
    private errorHandler: ((error: any) => void) | null = null;
    
    constructor(name: string, config: ConnectionConfig) {
        this.name = name;
        this.config = config;
    }
    
    async connect(): Promise<void> {
        console.log(`🔌 Connecting to ${this.name} at ${this.config.host}:${this.config.port}`);
        
        // Simulate connection establishment
        await this.delay(100);
        
        this.active = true;
        console.log(`✅ Connected to ${this.name}`);
    }
    
    async close(): Promise<void> {
        console.log(`🔌 Closing connection to ${this.name}`);
        this.active = false;
    }
    
    isActive(): boolean {
        return this.active;
    }
    
    async send(message: IntegrationMessage): Promise<void> {
        if (!this.active) {
            throw new Error(`Connection to ${this.name} is not active`);
        }
        
        // Simulate message sending
        await this.delay(10);
    }
    
    onMessage(handler: (message: IntegrationMessage) => void): void {
        this.messageHandler = handler;
    }
    
    onError(handler: (error: any) => void): void {
        this.errorHandler = handler;
    }
    
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class ConflictResolver {
    async resolve(conflict: SyncConflict): Promise<void> {
        console.log(`🔧 Resolving conflict: ${conflict.type}`);
        
        switch (conflict.resolution) {
            case 'auto_resolve':
                await this.autoResolve(conflict);
                break;
            case 'defer':
                await this.deferConflict(conflict);
                break;
            case 'manual':
                console.log(`⚠️ Manual resolution required for conflict: ${conflict.description}`);
                break;
        }
    }
    
    private async autoResolve(conflict: SyncConflict): Promise<void> {
        // Implement automatic conflict resolution logic
        console.log(`🔄 Auto-resolving conflict: ${conflict.description}`);
    }
    
    private async deferConflict(conflict: SyncConflict): Promise<void> {
        // Defer conflict resolution for later
        console.log(`⏸️ Deferring conflict resolution: ${conflict.description}`);
    }
}

// Internal interfaces
interface ConnectionConfig {
    host: string;
    port: number;
    protocol: 'ws' | 'tcp' | 'http';
    timeout: number;
    maxRetries: number;
}

interface SyncOperation {
    id: string;
    type: string;
    source: 'prp' | 'field_protocol';
    target: 'prp' | 'field_protocol';
    data: any;
    timestamp: Date;
    priority: 'critical' | 'high' | 'normal' | 'low';
}

interface OperationResult {
    conflicts: SyncConflict[];
    itemsSynced: number;
}