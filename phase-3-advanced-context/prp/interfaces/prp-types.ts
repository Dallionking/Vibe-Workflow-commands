/**
 * PRP System Core Types
 * Phase 3: Advanced Context Features - Tier 2.5
 */

export interface PRPTemplate {
    id: string;
    name: string;
    description: string;
    parameters: PRPParameter[];
    steps: PRPStep[];
    constraints: PRPConstraint[];
    expectedOutput: PRPOutputSchema;
    metadata: PRPMetadata;
}

export interface PRPValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}

export interface PRPParameter {
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
    description: string;
}

export interface PRPStep {
    id: string;
    name: string;
    description: string;
    type: string;
    parameters: Record<string, any>;
    dependencies: string[];
}

export interface PRPConstraint {
    type: string;
    condition: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}

export interface PRPOutputSchema {
    type: string;
    properties: Record<string, any>;
    required: string[];
}

export interface PRPMetadata {
    version: string;
    author: string;
    created: Date;
    modified: Date;
    tags: string[];
}

export interface PRPInstanceConfig {
    templateId: string;
    parameters: Record<string, any>;
    execution: {
        timeout: number;
        maxRetries: number;
        priority: number;
    };
}

export interface PRPContext {
    sessionId: string;
    userId: string;
    timestamp: Date;
    metadata: Record<string, any>;
}

export interface PRPResult {
    id: string;
    status: PRPStatus;
    output: any;
    metrics: PRPExecutionMetrics;
    errors: PRPError[];
    metadata: Record<string, any>;
}

export interface PRPExecutionMetrics {
    startTime: Date;
    endTime: Date;
    duration: number;
    memoryUsage: number;
    cpuUsage: number;
    steps: number;
}

export type PRPStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface PRPError {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
}

export interface PRPSystemConfig {
    maxConcurrentExecutions: number;
    defaultTimeout: number;
    retryPolicy: {
        maxAttempts: number;
        backoffStrategy: 'linear' | 'exponential';
        baseDelay: number;
    };
}

export interface PRPSystemStatus {
    healthy: boolean;
    uptime: number;
    activeExecutions: number;
    totalExecutions: number;
    errorRate: number;
}

export interface PRPSystemMessage {
    id: string;
    type: string;
    payload: any;
    timestamp: Date;
    source: string;
}

export interface PRPSystemResponse {
    id: string;
    status: number;
    data: any;
    timestamp: Date;
}

export interface PRPSystemContext {
    requestId: string;
    sessionId: string;
    userId: string;
    permissions: string[];
    metadata: Record<string, any>;
}

export interface PRPSystemMetrics {
    throughput: number;
    latency: number;
    errorRate: number;
    resourceUtilization: {
        cpu: number;
        memory: number;
        disk: number;
    };
}

export interface PRPSystemHealth {
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

export interface PRPSystemPerformance {
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

export interface PRPSystemConnection {
    id: string;
    type: string;
    status: 'connected' | 'disconnected' | 'connecting';
    lastActivity: Date;
    metadata: Record<string, any>;
}

export interface PRPSystemValidation {
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

export interface PRPContextRequest {
    type: string;
    parameters: Record<string, any>;
    filters: Record<string, any>;
    context: PRPContext;
}

export interface PRPContextResponse {
    data: any;
    metadata: PRPContextMetadata;
    validation: PRPContextValidation;
    errors: PRPContextError[];
}

export interface PRPContextMetadata {
    timestamp: Date;
    requestId: string;
    processingTime: number;
    source: string;
}

export interface PRPContextValidation {
    isValid: boolean;
    score: number;
    details: Record<string, any>;
}

export interface PRPContextError {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    context?: any;
}

export interface PRPRequest {
    id: string;
    type: string;
    payload: any;
    context: PRPContext;
    metadata: Record<string, any>;
}

export interface PRPResponse {
    id: string;
    requestId: string;
    status: number;
    data: any;
    errors: PRPError[];
    metadata: Record<string, any>;
}