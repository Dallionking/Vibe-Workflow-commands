/**
 * Field Protocol Core Types
 * Phase 3: Advanced Context Features - Tier 2.5
 */

export interface FieldProtocol {
    id: string;
    name: string;
    type: string;
    config: FieldProtocolConfig;
    status: FieldProtocolStatus;
    metadata: Record<string, any>;
}

export interface FieldProtocolConfig {
    parameters: Record<string, any>;
    constraints: Record<string, any>;
    optimization: {
        enabled: boolean;
        targets: string[];
        strategy: string;
    };
}

export interface FieldProtocolStatus {
    active: boolean;
    healthy: boolean;
    lastActivity: Date;
    metrics: FieldProtocolMetrics;
}

export interface FieldProtocolMetrics {
    throughput: number;
    latency: number;
    errorRate: number;
    resourceUtilization: number;
}

export interface FieldProtocolMessage {
    id: string;
    type: string;
    payload: any;
    timestamp: Date;
    source: string;
    target: string;
}

export interface FieldProtocolResponse {
    id: string;
    requestId: string;
    status: number;
    data: any;
    errors: FieldProtocolError[];
    metadata: Record<string, any>;
}

export interface FieldProtocolContext {
    requestId: string;
    sessionId: string;
    userId: string;
    permissions: string[];
    metadata: Record<string, any>;
}

export interface FieldProtocolHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    components: Record<string, ComponentHealth>;
    lastCheck: Date;
}

export interface ComponentHealth {
    status: 'up' | 'down' | 'degraded';
    latency: number;
    errorRate: number;
    lastCheck: Date;
}

export interface FieldProtocolPerformance {
    averageResponseTime: number;
    throughput: number;
    concurrentUsers: number;
    resourceUtilization: ResourceUtilization;
}

export interface ResourceUtilization {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
}

export interface FieldProtocolConnection {
    id: string;
    type: string;
    status: 'connected' | 'disconnected' | 'connecting';
    lastActivity: Date;
    metadata: Record<string, any>;
}

export interface FieldProtocolValidation {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: ValidationSuggestion[];
}

export interface ValidationError {
    code: string;
    message: string;
    field?: string;
    details?: any;
}

export interface ValidationWarning {
    code: string;
    message: string;
    field?: string;
    details?: any;
}

export interface ValidationSuggestion {
    code: string;
    message: string;
    recommendation: string;
    impact: 'low' | 'medium' | 'high';
}

export interface FieldProtocolError {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    context?: any;
}

export interface FieldProtocolRequest {
    id: string;
    type: string;
    payload: any;
    context: FieldProtocolContext;
    metadata: Record<string, any>;
}

export interface FieldProtocolSystemConfig {
    maxConcurrentConnections: number;
    defaultTimeout: number;
    retryPolicy: {
        maxAttempts: number;
        backoffStrategy: 'linear' | 'exponential';
        baseDelay: number;
    };
}

export interface FieldProtocolSystemStatus {
    healthy: boolean;
    uptime: number;
    activeConnections: number;
    totalRequests: number;
    errorRate: number;
}

export interface FieldProtocolSystemMessage {
    id: string;
    type: string;
    payload: any;
    timestamp: Date;
    source: string;
}

export interface FieldProtocolSystemResponse {
    id: string;
    status: number;
    data: any;
    timestamp: Date;
}

export interface FieldProtocolSystemContext {
    requestId: string;
    sessionId: string;
    userId: string;
    permissions: string[];
    metadata: Record<string, any>;
}

export interface FieldProtocolSystemMetrics {
    throughput: number;
    latency: number;
    errorRate: number;
    resourceUtilization: {
        cpu: number;
        memory: number;
        disk: number;
    };
}

export interface FieldProtocolSystemHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    components: Record<string, ComponentHealth>;
    lastCheck: Date;
}

export interface FieldProtocolSystemPerformance {
    averageResponseTime: number;
    throughput: number;
    concurrentUsers: number;
    resourceUtilization: ResourceUtilization;
}

export interface FieldProtocolSystemConnection {
    id: string;
    type: string;
    status: 'connected' | 'disconnected' | 'connecting';
    lastActivity: Date;
    metadata: Record<string, any>;
}

export interface FieldProtocolSystemValidation {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: ValidationSuggestion[];
}
