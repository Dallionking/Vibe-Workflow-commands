/**
 * Integration Controller
 * Phase 3: Advanced Context Features - Tier 2.5
 * 
 * Implements the main controller for bidirectional communication between
 * PRP and Field Protocol systems with message handling, routing, and monitoring.
 */

import {
    IntegrationController,
    IntegrationConfig,
    IntegrationMessage,
    IntegrationMessageType,
    MessageHandler,
    MessageHandlerResult,
    MessageAcknowledgment,
    ContextRequest,
    ContextResponse,
    BridgeStatus,
    IntegrationMetrics,
    HealthStatus,
    MessagePriority,
    ChannelConfig,
    MessageTypeCount,
    PerformanceMetrics,
    ReliabilityMetrics,
    ResourceUsageMetrics,
    ErrorMetrics
} from './interfaces';

import { IntegrationAdapter } from './integration-adapter';
import { IntegrationBridge } from './integration-bridge';

export class AdvancedIntegrationController implements IntegrationController {
    private config: IntegrationConfig;
    private messageHandlers: Map<IntegrationMessageType, MessageHandler[]> = new Map();
    private messageQueue: Map<MessagePriority, IntegrationMessage[]> = new Map();
    private adapter: IntegrationAdapter;
    private bridge: IntegrationBridge;
    private metrics: IntegrationMetrics;
    private isInitialized = false;
    private isShuttingDown = false;
    private processingInterval: NodeJS.Timeout | null = null;
    private metricsInterval: NodeJS.Timeout | null = null;
    private healthCheckInterval: NodeJS.Timeout | null = null;
    
    constructor() {
        this.adapter = new IntegrationAdapter();
        this.bridge = new IntegrationBridge();
        this.initializeMetrics();
        this.initializeMessageQueues();
    }
    
    /**
     * Initialize the integration controller with configuration
     */
    async initialize(config: IntegrationConfig): Promise<void> {
        console.log('🚀 Initializing Advanced Integration Controller');
        
        this.config = config;
        this.validateConfig(config);
        
        // Initialize message queues based on priority
        this.initializeMessageQueues();
        
        // Initialize adapter with configuration
        await this.adapter.initialize(config);
        
        // Connect the integration bridge
        await this.bridge.connect();
        
        // Start processing intervals
        this.startProcessingLoop();
        this.startMetricsCollection();
        this.startHealthMonitoring();
        
        // Register default message handlers
        this.registerDefaultHandlers();
        
        this.isInitialized = true;
        console.log('✅ Integration Controller initialized successfully');
    }
    
    /**
     * Send an integration message
     */
    async sendMessage(message: IntegrationMessage): Promise<MessageAcknowledgment> {
        this.validateInitialized();
        
        console.log(`📤 Sending message: ${message.type} (${message.priority})`);
        
        // Validate message format
        const validation = this.adapter.validateMessage(message);
        if (!validation.valid) {
            throw new Error(`Invalid message: ${validation.errors.map(e => e.message).join(', ')}`);
        }
        
        // Add to appropriate priority queue
        this.enqueueMessage(message);
        
        // Update metrics
        this.updateMessageMetrics(message);
        
        // Create acknowledgment
        const acknowledgment: MessageAcknowledgment = {
            received: true,
            processed: false,
            timestamp: new Date(),
            processingTime: 0,
            status: 'success'
        };
        
        // Set message acknowledgment
        message.acknowledgment = acknowledgment;
        
        console.log(`✅ Message queued: ${message.id}`);
        return acknowledgment;
    }
    
    /**
     * Register a message handler for a specific message type
     */
    registerMessageHandler(
        messageType: IntegrationMessageType,
        handler: MessageHandler
    ): void {
        console.log(`📝 Registering handler for message type: ${messageType}`);
        
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, []);
        }
        
        this.messageHandlers.get(messageType)!.push(handler);
        console.log(`✅ Handler registered for ${messageType}`);
    }
    
    /**
     * Request context information from connected systems
     */
    async requestContext(request: ContextRequest): Promise<ContextResponse> {
        this.validateInitialized();
        
        console.log(`🔍 Requesting context: ${request.type}`);
        
        const contextMessage: IntegrationMessage = {
            id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            source: 'prp',
            target: 'field_protocol',
            type: 'context_enhancement',
            payload: {
                data: request,
                metadata: {
                    size: JSON.stringify(request).length,
                    format: 'json',
                    checksum: this.calculateChecksum(JSON.stringify(request)),
                    version: '1.0.0',
                    sourceTimestamp: new Date()
                },
                schema: 'context_request_v1'
            },
            priority: 'high',
            context: {
                sessionId: `session_${Date.now()}`,
                requestId: request.type,
                correlationId: `corr_${Date.now()}`,
                environment: 'development',
                tags: ['context_request'],
                customHeaders: {}
            }
        };
        
        // Send context request
        await this.sendMessage(contextMessage);
        
        // Wait for response (simplified - in production would use proper async handling)
        const response = await this.waitForContextResponse(contextMessage.id);
        
        console.log(`✅ Context response received: ${response.status}`);
        return response;
    }
    
    /**
     * Shutdown the integration controller
     */
    async shutdown(): Promise<void> {
        console.log('⚠️ Shutting down Integration Controller');
        
        this.isShuttingDown = true;
        
        // Stop processing intervals
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }
        
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = null;
        }
        
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        
        // Process remaining messages
        await this.processRemainingMessages();
        
        // Disconnect bridge
        await this.bridge.disconnect();
        
        // Shutdown adapter
        await this.adapter.shutdown();
        
        this.isInitialized = false;
        console.log('✅ Integration Controller shutdown complete');
    }
    
    /**
     * Get current bridge status
     */
    getBridgeStatus(): BridgeStatus {
        return this.bridge.getStatus();
    }
    
    /**
     * Get integration metrics
     */
    getMetrics(): IntegrationMetrics {
        return { ...this.metrics };
    }
    
    /**
     * Get health status
     */
    async getHealthStatus(): Promise<HealthStatus> {
        const bridgeStatus = this.getBridgeStatus();
        const metrics = this.getMetrics();
        
        const overall = this.calculateOverallHealth(bridgeStatus, metrics);
        
        return {
            overall,
            components: [
                {
                    component: 'message_queue',
                    status: this.getQueueHealth(),
                    metrics: {
                        totalMessages: this.getTotalQueuedMessages(),
                        averageProcessingTime: metrics.performance.averageLatency
                    },
                    issues: this.getQueueIssues(),
                    lastCheck: new Date()
                },
                {
                    component: 'bridge',
                    status: bridgeStatus.health,
                    metrics: {
                        connected: bridgeStatus.connected,
                        messagesProcessed: bridgeStatus.messagesProcessed,
                        errorCount: bridgeStatus.errorCount
                    },
                    issues: bridgeStatus.errorCount > 0 ? ['Errors detected'] : [],
                    lastCheck: new Date()
                },
                {
                    component: 'adapter',
                    status: 'healthy', // Would implement actual health check
                    metrics: {},
                    issues: [],
                    lastCheck: new Date()
                }
            ],
            timestamp: new Date(),
            recommendations: this.generateHealthRecommendations(bridgeStatus, metrics)
        };
    }
    
    // Private implementation methods
    private validateConfig(config: IntegrationConfig): void {
        if (!config.messageQueueSize || config.messageQueueSize <= 0) {
            throw new Error('Invalid messageQueueSize in configuration');
        }
        
        if (!config.maxRetries || config.maxRetries < 0) {
            throw new Error('Invalid maxRetries in configuration');
        }
        
        if (!config.timeoutMs || config.timeoutMs <= 0) {
            throw new Error('Invalid timeoutMs in configuration');
        }
        
        if (!config.channels || config.channels.length === 0) {
            throw new Error('At least one channel must be configured');
        }
    }
    
    private validateInitialized(): void {
        if (!this.isInitialized) {
            throw new Error('Integration Controller is not initialized');
        }
        
        if (this.isShuttingDown) {
            throw new Error('Integration Controller is shutting down');
        }
    }
    
    private initializeMetrics(): void {
        this.metrics = {
            startTime: new Date(),
            messageCount: {
                prp_activation: 0,
                field_state_update: 0,
                emergence_notification: 0,
                resonance_change: 0,
                validation_request: 0,
                optimization_signal: 0,
                synchronization_update: 0,
                context_enhancement: 0,
                pattern_detection: 0,
                adaptive_feedback: 0
            },
            performance: {
                averageLatency: 0,
                maxLatency: 0,
                minLatency: Infinity,
                throughput: 0,
                processingRate: 0,
                queueLength: 0,
                concurrentConnections: 1
            },
            reliability: {
                uptime: 0,
                availability: 1.0,
                errorRate: 0,
                retryRate: 0,
                failoverCount: 0,
                recoveryTime: 0
            },
            resourceUsage: {
                cpuUsage: 0,
                memoryUsage: 0,
                diskUsage: 0,
                networkBandwidth: 0,
                fileDescriptors: 0,
                threadCount: 1
            },
            errors: {
                totalErrors: 0,
                errorsByType: {},
                errorsByPriority: {
                    critical: 0,
                    high: 0,
                    normal: 0,
                    low: 0
                },
                criticalErrors: 0,
                recentErrors: []
            }
        };
    }
    
    private initializeMessageQueues(): void {
        this.messageQueue.set('critical', []);
        this.messageQueue.set('high', []);
        this.messageQueue.set('normal', []);
        this.messageQueue.set('low', []);
    }
    
    private enqueueMessage(message: IntegrationMessage): void {
        const queue = this.messageQueue.get(message.priority);
        if (!queue) {
            throw new Error(`Invalid message priority: ${message.priority}`);
        }
        
        // Check queue capacity
        if (queue.length >= this.config.messageQueueSize) {
            // Remove oldest message if queue is full
            const removed = queue.shift();
            console.log(`⚠️ Queue full, removed message: ${removed?.id}`);
        }
        
        queue.push(message);
        this.metrics.performance.queueLength = this.getTotalQueuedMessages();
    }
    
    private getTotalQueuedMessages(): number {
        let total = 0;
        for (const queue of this.messageQueue.values()) {
            total += queue.length;
        }
        return total;
    }
    
    private startProcessingLoop(): void {
        this.processingInterval = setInterval(async () => {
            if (this.isShuttingDown) return;
            
            await this.processMessageQueues();
        }, 100); // Process every 100ms
    }
    
    private async processMessageQueues(): Promise<void> {
        const priorities: MessagePriority[] = ['critical', 'high', 'normal', 'low'];
        
        for (const priority of priorities) {
            const queue = this.messageQueue.get(priority);
            if (!queue || queue.length === 0) continue;
            
            // Process up to 10 messages per priority per cycle
            const messagesToProcess = queue.splice(0, 10);
            
            for (const message of messagesToProcess) {
                await this.processMessage(message);
            }
        }
    }
    
    private async processMessage(message: IntegrationMessage): Promise<void> {
        const startTime = Date.now();
        
        try {
            console.log(`⚙️ Processing message: ${message.id} (${message.type})`);
            
            // Get handlers for this message type
            const handlers = this.messageHandlers.get(message.type) || [];
            
            if (handlers.length === 0) {
                console.log(`⚠️ No handlers registered for message type: ${message.type}`);
                return;
            }
            
            // Process with all handlers
            for (const handler of handlers) {
                const result = await this.executeHandler(handler, message);
                
                if (!result.success) {
                    console.log(`❌ Handler failed for message ${message.id}: ${result.error}`);
                    this.recordError(message, result.error || 'Unknown handler error');
                }
            }
            
            // Update acknowledgment
            if (message.acknowledgment) {
                message.acknowledgment.processed = true;
                message.acknowledgment.processingTime = Date.now() - startTime;
                message.acknowledgment.status = 'success';
            }
            
            console.log(`✅ Message processed: ${message.id}`);
            
        } catch (error) {
            console.log(`❌ Error processing message ${message.id}:`, error);
            this.recordError(message, error instanceof Error ? error.message : 'Unknown error');
            
            if (message.acknowledgment) {
                message.acknowledgment.processed = false;
                message.acknowledgment.status = 'error';
                message.acknowledgment.errorMessage = error instanceof Error ? error.message : 'Unknown error';
            }
        }
        
        // Update performance metrics
        const processingTime = Date.now() - startTime;
        this.updatePerformanceMetrics(processingTime);
    }
    
    private async executeHandler(handler: MessageHandler, message: IntegrationMessage): Promise<MessageHandlerResult> {
        const startTime = Date.now();
        
        try {
            const result = await Promise.race([
                handler(message),
                this.timeoutPromise(this.config.timeoutMs)
            ]);
            
            const processingTime = Date.now() - startTime;
            
            if (result && typeof result === 'object' && 'success' in result) {
                return {
                    ...result,
                    metrics: {
                        processingTime,
                        memoryUsage: process.memoryUsage().heapUsed,
                        computationComplexity: this.calculateComplexity(message),
                        resourcesUsed: ['cpu', 'memory']
                    }
                };
            }
            
            return {
                success: true,
                metrics: {
                    processingTime,
                    memoryUsage: process.memoryUsage().heapUsed,
                    computationComplexity: this.calculateComplexity(message),
                    resourcesUsed: ['cpu', 'memory']
                }
            };
            
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Handler execution failed',
                metrics: {
                    processingTime: Date.now() - startTime,
                    memoryUsage: process.memoryUsage().heapUsed,
                    computationComplexity: this.calculateComplexity(message),
                    resourcesUsed: ['cpu', 'memory']
                }
            };
        }
    }
    
    private timeoutPromise(timeoutMs: number): Promise<MessageHandlerResult> {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Handler timeout after ${timeoutMs}ms`));
            }, timeoutMs);
        });
    }
    
    private updateMessageMetrics(message: IntegrationMessage): void {
        // Update message count by type
        if (message.type in this.metrics.messageCount) {
            (this.metrics.messageCount as any)[message.type]++;
        }
        
        // Update queue length
        this.metrics.performance.queueLength = this.getTotalQueuedMessages();
    }
    
    private updatePerformanceMetrics(processingTime: number): void {
        const perf = this.metrics.performance;
        
        // Update latency metrics
        if (processingTime > perf.maxLatency) {
            perf.maxLatency = processingTime;
        }
        
        if (processingTime < perf.minLatency) {
            perf.minLatency = processingTime;
        }
        
        // Calculate running average
        const totalMessages = Object.values(this.metrics.messageCount).reduce((sum, count) => sum + count, 0);
        perf.averageLatency = ((perf.averageLatency * (totalMessages - 1)) + processingTime) / totalMessages;
        
        // Update processing rate
        const uptimeSeconds = (Date.now() - this.metrics.startTime.getTime()) / 1000;
        perf.processingRate = totalMessages / uptimeSeconds;
        perf.throughput = perf.processingRate;
    }
    
    private recordError(message: IntegrationMessage, error: string): void {
        this.metrics.errors.totalErrors++;
        this.metrics.errors.errorsByPriority[message.priority]++;
        
        const errorType = message.type;
        if (!this.metrics.errors.errorsByType[errorType]) {
            this.metrics.errors.errorsByType[errorType] = 0;
        }
        this.metrics.errors.errorsByType[errorType]++;
        
        if (message.priority === 'critical') {
            this.metrics.errors.criticalErrors++;
        }
        
        // Add to recent errors
        this.metrics.errors.recentErrors.push({
            timestamp: new Date(),
            type: errorType,
            message: error,
            count: 1,
            lastOccurrence: new Date(),
            resolved: false
        });
        
        // Keep only last 100 errors
        if (this.metrics.errors.recentErrors.length > 100) {
            this.metrics.errors.recentErrors = this.metrics.errors.recentErrors.slice(-100);
        }
    }
    
    private calculateComplexity(message: IntegrationMessage): number {
        // Simple complexity calculation based on payload size and type
        const payloadSize = JSON.stringify(message.payload.data).length;
        const typeComplexity = this.getTypeComplexity(message.type);
        
        return Math.log(payloadSize) * typeComplexity;
    }
    
    private getTypeComplexity(messageType: IntegrationMessageType): number {
        const complexityMap: Record<IntegrationMessageType, number> = {
            prp_activation: 1.0,
            field_state_update: 1.5,
            emergence_notification: 2.0,
            resonance_change: 1.5,
            validation_request: 1.2,
            optimization_signal: 2.5,
            synchronization_update: 1.8,
            context_enhancement: 3.0,
            pattern_detection: 2.2,
            adaptive_feedback: 1.3
        };
        
        return complexityMap[messageType] || 1.0;
    }
    
    private startMetricsCollection(): void {
        this.metricsInterval = setInterval(() => {
            this.updateSystemMetrics();
        }, 5000); // Update every 5 seconds
    }
    
    private updateSystemMetrics(): void {
        // Update uptime
        const uptimeMs = Date.now() - this.metrics.startTime.getTime();
        this.metrics.reliability.uptime = uptimeMs / 1000;
        
        // Update resource usage (simplified)
        const memUsage = process.memoryUsage();
        this.metrics.resourceUsage.memoryUsage = memUsage.heapUsed;
        this.metrics.resourceUsage.cpuUsage = process.cpuUsage().user;
        
        // Update availability
        const totalMessages = Object.values(this.metrics.messageCount).reduce((sum, count) => sum + count, 0);
        const successfulMessages = totalMessages - this.metrics.errors.totalErrors;
        this.metrics.reliability.availability = totalMessages > 0 ? successfulMessages / totalMessages : 1.0;
        
        // Update error rate
        this.metrics.reliability.errorRate = totalMessages > 0 ? this.metrics.errors.totalErrors / totalMessages : 0;
    }
    
    private startHealthMonitoring(): void {
        this.healthCheckInterval = setInterval(async () => {
            await this.performHealthCheck();
        }, 30000); // Check every 30 seconds
    }
    
    private async performHealthCheck(): Promise<void> {
        const health = await this.getHealthStatus();
        
        if (health.overall === 'critical') {
            console.log('🚨 CRITICAL: Integration Controller health is critical');
            // Could trigger auto-recovery mechanisms here
        } else if (health.overall === 'degraded') {
            console.log('⚠️ WARNING: Integration Controller health is degraded');
        }
    }
    
    private calculateOverallHealth(bridgeStatus: BridgeStatus, metrics: IntegrationMetrics): 'healthy' | 'degraded' | 'critical' | 'offline' {
        if (!bridgeStatus.connected) {
            return 'offline';
        }
        
        if (metrics.errors.criticalErrors > 0 || metrics.reliability.errorRate > 0.1) {
            return 'critical';
        }
        
        if (metrics.reliability.errorRate > 0.05 || metrics.performance.averageLatency > 5000) {
            return 'degraded';
        }
        
        return 'healthy';
    }
    
    private getQueueHealth(): 'healthy' | 'degraded' | 'critical' | 'offline' {
        const queueLength = this.getTotalQueuedMessages();
        const maxCapacity = this.config.messageQueueSize;
        
        if (queueLength === 0) {
            return 'healthy';
        }
        
        const utilization = queueLength / maxCapacity;
        
        if (utilization > 0.9) {
            return 'critical';
        } else if (utilization > 0.7) {
            return 'degraded';
        } else {
            return 'healthy';
        }
    }
    
    private getQueueIssues(): string[] {
        const issues: string[] = [];
        const queueLength = this.getTotalQueuedMessages();
        const maxCapacity = this.config.messageQueueSize;
        
        if (queueLength > maxCapacity * 0.8) {
            issues.push('Queue utilization is high');
        }
        
        if (this.metrics.performance.averageLatency > 1000) {
            issues.push('High processing latency detected');
        }
        
        return issues;
    }
    
    private generateHealthRecommendations(bridgeStatus: BridgeStatus, metrics: IntegrationMetrics): any[] {
        const recommendations: any[] = [];
        
        if (metrics.performance.averageLatency > 1000) {
            recommendations.push({
                type: 'performance',
                description: 'High message processing latency detected',
                priority: 'high',
                impact: 'Slower response times',
                action: 'Consider increasing processing capacity or optimizing handlers'
            });
        }
        
        if (metrics.reliability.errorRate > 0.05) {
            recommendations.push({
                type: 'reliability',
                description: 'High error rate detected',
                priority: 'critical',
                impact: 'System reliability degradation',
                action: 'Investigate and fix recurring errors'
            });
        }
        
        if (this.getTotalQueuedMessages() > this.config.messageQueueSize * 0.8) {
            recommendations.push({
                type: 'capacity',
                description: 'Message queue approaching capacity',
                priority: 'medium',
                impact: 'Potential message loss',
                action: 'Increase queue size or processing rate'
            });
        }
        
        return recommendations;
    }
    
    private registerDefaultHandlers(): void {
        // Register default handlers for each message type
        
        this.registerMessageHandler('prp_activation', async (message) => {
            console.log('🎯 Handling PRP activation');
            return { success: true };
        });
        
        this.registerMessageHandler('field_state_update', async (message) => {
            console.log('🌊 Handling field state update');
            return { success: true };
        });
        
        this.registerMessageHandler('emergence_notification', async (message) => {
            console.log('🌟 Handling emergence notification');
            return { success: true };
        });
        
        this.registerMessageHandler('resonance_change', async (message) => {
            console.log('🔄 Handling resonance change');
            return { success: true };
        });
        
        this.registerMessageHandler('validation_request', async (message) => {
            console.log('✅ Handling validation request');
            return { success: true };
        });
        
        this.registerMessageHandler('optimization_signal', async (message) => {
            console.log('🎯 Handling optimization signal');
            return { success: true };
        });
        
        this.registerMessageHandler('synchronization_update', async (message) => {
            console.log('🔄 Handling synchronization update');
            return { success: true };
        });
        
        this.registerMessageHandler('context_enhancement', async (message) => {
            console.log('🧠 Handling context enhancement');
            return { success: true };
        });
        
        this.registerMessageHandler('pattern_detection', async (message) => {
            console.log('🔍 Handling pattern detection');
            return { success: true };
        });
        
        this.registerMessageHandler('adaptive_feedback', async (message) => {
            console.log('🔄 Handling adaptive feedback');
            return { success: true };
        });
    }
    
    private async waitForContextResponse(messageId: string): Promise<ContextResponse> {
        // Simplified implementation - in production would use proper event handling
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    requestId: messageId,
                    timestamp: new Date(),
                    data: {
                        fieldStates: [],
                        resonancePatterns: [],
                        emergenceEvents: [],
                        dynamicsAnalysis: [],
                        correlations: [],
                        predictions: []
                    },
                    metadata: {
                        processingTime: 100,
                        sourceSystem: 'field_protocol',
                        version: '1.0.0',
                        cacheHit: false
                    },
                    status: 'complete'
                });
            }, 1000);
        });
    }
    
    private async processRemainingMessages(): Promise<void> {
        console.log('🔄 Processing remaining messages before shutdown');
        
        let remainingMessages = this.getTotalQueuedMessages();
        let iterations = 0;
        const maxIterations = 100;
        
        while (remainingMessages > 0 && iterations < maxIterations) {
            await this.processMessageQueues();
            remainingMessages = this.getTotalQueuedMessages();
            iterations++;
            
            if (iterations % 10 === 0) {
                console.log(`⏳ ${remainingMessages} messages remaining (iteration ${iterations})`);
            }
        }
        
        if (remainingMessages > 0) {
            console.log(`⚠️ ${remainingMessages} messages could not be processed before shutdown`);
        } else {
            console.log('✅ All messages processed before shutdown');
        }
    }
    
    private calculateChecksum(data: string): string {
        // Simple checksum calculation (in production would use proper hashing)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    /**
     * Get controller statistics
     */
    getStatistics(): {
        messagesSent: number;
        messagesProcessed: number;
        averageLatency: number;
        errorRate: number;
        uptime: number;
        queueUtilization: number;
    } {
        const totalMessages = Object.values(this.metrics.messageCount).reduce((sum, count) => sum + count, 0);
        const queueLength = this.getTotalQueuedMessages();
        
        return {
            messagesSent: totalMessages,
            messagesProcessed: totalMessages - this.metrics.errors.totalErrors,
            averageLatency: this.metrics.performance.averageLatency,
            errorRate: this.metrics.reliability.errorRate,
            uptime: this.metrics.reliability.uptime,
            queueUtilization: queueLength / this.config.messageQueueSize
        };
    }
    
    /**
     * Clear metrics and reset counters
     */
    clearMetrics(): void {
        this.initializeMetrics();
        console.log('🗑️ Integration Controller metrics cleared');
    }
}