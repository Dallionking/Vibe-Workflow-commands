/**
 * System Integration Layer Interfaces
 * Phase 3: Advanced Context Features - Tier 2.5
 * 
 * Defines bidirectional communication interfaces between PRP (Prompt Response Patterns)
 * and Field Protocol systems for seamless integration and information flow.
 */

import { 
    PRPTemplate, 
    PRPValidation,
    FewShotExample 
} from '../prp/generator/interfaces';

import { 
    ResonanceField,
    ResonanceNetwork,
    EmergenceEvent
} from '../field-protocols/resonance/interfaces';

import {
    DynamicsField,
    PhaseTransition
} from '../field-protocols/dynamics/interfaces';

export interface IntegrationMessage {
    id: string;
    timestamp: Date;
    source: 'prp' | 'field_protocol';
    target: 'prp' | 'field_protocol';
    type: IntegrationMessageType;
    payload: MessagePayload;
    priority: MessagePriority;
    context: IntegrationContext;
    acknowledgment?: MessageAcknowledgment;
}

export type IntegrationMessageType = 
    | 'prp_activation'
    | 'field_state_update'
    | 'emergence_notification'
    | 'resonance_change'
    | 'validation_request'
    | 'optimization_signal'
    | 'synchronization_update'
    | 'context_enhancement'
    | 'pattern_detection'
    | 'adaptive_feedback';

export type MessagePriority = 'critical' | 'high' | 'normal' | 'low';

export interface MessagePayload {
    data: any;
    metadata: PayloadMetadata;
    schema: string;
    compression?: CompressionInfo;
    encryption?: EncryptionInfo;
}

export interface PayloadMetadata {
    size: number;
    format: 'json' | 'binary' | 'compressed';
    checksum: string;
    version: string;
    sourceTimestamp: Date;
    expirationTime?: Date;
}

export interface CompressionInfo {
    algorithm: 'gzip' | 'brotli' | 'lz4';
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
}

export interface EncryptionInfo {
    algorithm: 'aes-256' | 'rsa-2048';
    keyId: string;
    iv?: string;
    signature?: string;
}

export interface IntegrationContext {
    sessionId: string;
    userId?: string;
    requestId: string;
    chainId?: string;
    parentMessageId?: string;
    correlationId: string;
    environment: 'development' | 'staging' | 'production';
    tags: string[];
    customHeaders: Record<string, string>;
}

export interface MessageAcknowledgment {
    received: boolean;
    processed: boolean;
    timestamp: Date;
    processingTime: number;
    status: 'success' | 'error' | 'partial';
    errorMessage?: string;
    resultSummary?: string;
}

export interface PRPToFieldMessage extends IntegrationMessage {
    source: 'prp';
    target: 'field_protocol';
    payload: PRPToFieldPayload;
}

export interface FieldToPRPMessage extends IntegrationMessage {
    source: 'field_protocol';
    target: 'prp';
    payload: FieldToPRPPayload;
}

export interface PRPToFieldPayload extends MessagePayload {
    data: {
        prpTemplate?: PRPTemplate;
        validationResult?: PRPValidation;
        chainOfThought?: any; // ChainOfThoughtEnhancement from PRP system
        fewShotExamples?: FewShotExample[];
        contextRequest?: ContextRequest;
        optimizationHint?: OptimizationHint;
    };
}

export interface FieldToPRPPayload extends MessagePayload {
    data: {
        resonanceField?: ResonanceField;
        network?: ResonanceNetwork;
        emergenceEvent?: EmergenceEvent;
        dynamicsField?: DynamicsField;
        phaseTransition?: PhaseTransition;
        fieldState?: FieldStateUpdate;
        patternDetection?: PatternDetectionResult;
    };
}

export interface ContextRequest {
    type: 'field_state' | 'resonance_patterns' | 'emergence_events' | 'dynamics_analysis';
    parameters: ContextRequestParameters;
    filters: ContextFilter[];
    timeWindow?: TimeWindow;
    spatialBounds?: SpatialBounds;
}

export interface ContextRequestParameters {
    includeHistory: boolean;
    includeProjections: boolean;
    detailLevel: 'minimal' | 'standard' | 'comprehensive';
    analysisDepth: number;
    correlationThreshold: number;
    emergenceThreshold: number;
}

export interface ContextFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'contains';
    value: any;
    weight: number;
}

export interface TimeWindow {
    start: Date;
    end: Date;
    granularity: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days';
    timezone?: string;
}

export interface SpatialBounds {
    center: number[];
    radius: number;
    dimensions: number;
    coordinateSystem: 'cartesian' | 'spherical' | 'cylindrical';
}

export interface OptimizationHint {
    target: 'coherence' | 'emergence' | 'stability' | 'efficiency' | 'adaptability';
    direction: 'maximize' | 'minimize' | 'stabilize';
    constraints: OptimizationConstraint[];
    priority: number;
    timeframe: number;
}

export interface OptimizationConstraint {
    parameter: string;
    bounds: { min?: number; max?: number };
    weight: number;
    critical: boolean;
}

export interface FieldStateUpdate {
    fieldId: string;
    timestamp: Date;
    changes: StateChange[];
    emergenceLevel: number;
    coherenceLevel: number;
    stabilityIndex: number;
    predictedTrends: TrendPrediction[];
}

export interface StateChange {
    parameter: string;
    oldValue: any;
    newValue: any;
    changeRate: number;
    significance: number;
    confidence: number;
}

export interface TrendPrediction {
    parameter: string;
    direction: 'increasing' | 'decreasing' | 'stable' | 'oscillating' | 'chaotic';
    magnitude: number;
    timeframe: number;
    confidence: number;
    implications: string[];
}

export interface PatternDetectionResult {
    patternId: string;
    type: 'resonance' | 'emergence' | 'synchronization' | 'phase_transition' | 'cascade';
    strength: number;
    participants: string[];
    spatialExtent: number;
    temporalExtent: number;
    stability: number;
    implications: PatternImplication[];
}

export interface PatternImplication {
    type: 'optimization_opportunity' | 'stability_risk' | 'emergence_potential' | 'efficiency_gain';
    description: string;
    confidence: number;
    timeframe: number;
    recommendations: string[];
}

export interface IntegrationController {
    initialize(config: IntegrationConfig): Promise<void>;
    sendMessage(message: IntegrationMessage): Promise<MessageAcknowledgment>;
    registerMessageHandler(
        messageType: IntegrationMessageType,
        handler: MessageHandler
    ): void;
    requestContext(request: ContextRequest): Promise<ContextResponse>;
    shutdown(): Promise<void>;
}

export interface IntegrationConfig {
    messageQueueSize: number;
    maxRetries: number;
    timeoutMs: number;
    enableCompression: boolean;
    enableEncryption: boolean;
    enableMetrics: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    channels: ChannelConfig[];
}

export interface ChannelConfig {
    name: string;
    source: 'prp' | 'field_protocol';
    target: 'prp' | 'field_protocol';
    messageTypes: IntegrationMessageType[];
    priority: MessagePriority;
    bufferSize: number;
    batchSize: number;
    flushInterval: number;
}

export type MessageHandler = (message: IntegrationMessage) => Promise<MessageHandlerResult>;

export interface MessageHandlerResult {
    success: boolean;
    response?: IntegrationMessage;
    error?: string;
    metrics?: HandlerMetrics;
}

export interface HandlerMetrics {
    processingTime: number;
    memoryUsage: number;
    computationComplexity: number;
    resourcesUsed: string[];
}

export interface ContextResponse {
    requestId: string;
    timestamp: Date;
    data: ContextResponseData;
    metadata: ContextResponseMetadata;
    status: 'complete' | 'partial' | 'error';
    errorMessage?: string;
}

export interface ContextResponseData {
    fieldStates?: FieldStateSnapshot[];
    resonancePatterns?: ResonancePatternSnapshot[];
    emergenceEvents?: EmergenceEventSnapshot[];
    dynamicsAnalysis?: DynamicsAnalysisSnapshot[];
    correlations?: CorrelationAnalysis[];
    predictions?: PredictiveAnalysis[];
}

export interface ContextResponseMetadata {
    processingTime: number;
    confidence: number;
    dataQuality: number;
    sourceComponents: string[];
    version: string;
    correlationStrength: number;
}

export interface FieldStateSnapshot {
    fieldId: string;
    timestamp: Date;
    state: any;
    metrics: FieldMetrics;
    relationships: FieldRelationship[];
}

export interface FieldMetrics {
    energy: number;
    entropy: number;
    coherence: number;
    stability: number;
    emergence: number;
    influence: number;
}

export interface FieldRelationship {
    targetFieldId: string;
    relationshipType: 'resonance' | 'coupling' | 'interference' | 'dependency';
    strength: number;
    direction: 'bidirectional' | 'source_to_target' | 'target_to_source';
    stability: number;
}

export interface ResonancePatternSnapshot {
    patternId: string;
    timestamp: Date;
    participants: string[];
    frequency: number;
    amplitude: number;
    phase: number;
    coherence: number;
    stability: number;
    emergenceLevel: number;
}

export interface EmergenceEventSnapshot {
    eventId: string;
    timestamp: Date;
    type: string;
    strength: number;
    participants: string[];
    duration: number;
    spatialExtent: number;
    propagationPattern: PropagationPattern;
}

export interface PropagationPattern {
    speed: number;
    direction: number[];
    waveform: string;
    decay: number;
    amplification: number;
    interference: number;
}

export interface DynamicsAnalysisSnapshot {
    analysisId: string;
    timestamp: Date;
    fieldId: string;
    phaseTransitions: PhaseTransitionSnapshot[];
    energyFlows: EnergyFlowSnapshot[];
    optimizationResults: OptimizationResult[];
}

export interface PhaseTransitionSnapshot {
    transitionId: string;
    fromPhase: string;
    toPhase: string;
    trigger: string;
    duration: number;
    energyChange: number;
    stabilityChange: number;
}

export interface EnergyFlowSnapshot {
    flowId: string;
    source: string;
    target: string;
    flowRate: number;
    efficiency: number;
    losses: number;
    direction: number[];
}

export interface OptimizationResult {
    objective: string;
    initialValue: number;
    optimizedValue: number;
    improvement: number;
    iterations: number;
    convergenceTime: number;
    stability: number;
}

export interface CorrelationAnalysis {
    correlationId: string;
    timestamp: Date;
    variables: CorrelationVariable[];
    correlationMatrix: number[][];
    significantCorrelations: SignificantCorrelation[];
    causalityAnalysis?: CausalityAnalysis;
}

export interface CorrelationVariable {
    name: string;
    type: 'field_metric' | 'pattern_property' | 'event_attribute';
    source: string;
    timeWindow: TimeWindow;
    statistics: VariableStatistics;
}

export interface VariableStatistics {
    mean: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    autocorrelation: number[];
    trend: number;
}

export interface SignificantCorrelation {
    variable1: string;
    variable2: string;
    correlation: number;
    pValue: number;
    significance: 'weak' | 'moderate' | 'strong' | 'very_strong';
    lagged: boolean;
    lag?: number;
}

export interface CausalityAnalysis {
    method: 'granger' | 'convergent_cross_mapping' | 'transfer_entropy';
    causalRelationships: CausalRelationship[];
    confidence: number;
    assumptions: string[];
}

export interface CausalRelationship {
    cause: string;
    effect: string;
    strength: number;
    direction: 'unidirectional' | 'bidirectional';
    lag: number;
    confidence: number;
}

export interface PredictiveAnalysis {
    predictionId: string;
    timestamp: Date;
    target: string;
    timeHorizon: number;
    method: 'linear' | 'nonlinear' | 'ensemble' | 'neural_network';
    predictions: PredictionPoint[];
    confidence: ConfidenceInterval[];
    metrics: PredictionMetrics;
}

export interface PredictionPoint {
    time: Date;
    value: number;
    uncertainty: number;
    contributors: PredictionContributor[];
}

export interface PredictionContributor {
    variable: string;
    contribution: number;
    confidence: number;
}

export interface ConfidenceInterval {
    time: Date;
    lower: number;
    upper: number;
    level: number; // e.g., 0.95 for 95% confidence
}

export interface PredictionMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    meanAbsoluteError: number;
    rootMeanSquareError: number;
    r2Score: number;
}

export interface IntegrationAdapter {
    adaptPRPToField(prpData: any): FieldCompatibleData;
    adaptFieldToPRP(fieldData: any): PRPCompatibleData;
    validateMessage(message: IntegrationMessage): ValidationResult;
    transformPayload(payload: MessagePayload, targetSchema: string): MessagePayload;
}

export interface FieldCompatibleData {
    resonanceFields: ResonanceField[];
    dynamicsFields: DynamicsField[];
    networkUpdates: NetworkUpdate[];
    optimizationTargets: OptimizationTarget[];
}

export interface NetworkUpdate {
    updateType: 'add_node' | 'remove_node' | 'update_connection' | 'modify_cluster';
    targetId: string;
    data: any;
    timestamp: Date;
    source: string;
}

export interface OptimizationTarget {
    objective: string;
    constraints: any[];
    parameters: any[];
    priority: number;
    timeframe: number;
}

export interface PRPCompatibleData {
    templates: PRPTemplate[];
    enhancements: any[]; // ChainOfThoughtEnhancement from PRP system
    examples: FewShotExample[];
    validationCriteria: ValidationCriterion[];
    contextualHints: ContextualHint[];
}

export interface ValidationCriterion {
    name: string;
    type: 'structural' | 'semantic' | 'performance' | 'quality';
    weight: number;
    threshold: number;
    evaluator: string;
}

export interface ContextualHint {
    type: 'pattern_insight' | 'optimization_suggestion' | 'emergence_warning' | 'stability_note';
    content: string;
    relevance: number;
    timeframe: number;
    actionable: boolean;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: ValidationSuggestion[];
    score: number;
}

export interface ValidationError {
    code: string;
    message: string;
    field: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    suggestion?: string;
}

export interface ValidationWarning {
    code: string;
    message: string;
    field: string;
    impact: 'performance' | 'reliability' | 'compatibility' | 'usability';
    recommendation?: string;
}

export interface ValidationSuggestion {
    type: 'optimization' | 'enhancement' | 'best_practice' | 'performance';
    description: string;
    benefit: string;
    effort: 'low' | 'medium' | 'high';
    priority: number;
}

export interface IntegrationBridge {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    getStatus(): BridgeStatus;
    enableBidirectionalSync(): Promise<void>;
    disableBidirectionalSync(): Promise<void>;
    syncState(): Promise<SyncResult>;
}

export interface BridgeStatus {
    connected: boolean;
    lastSync: Date;
    messagesProcessed: number;
    errorCount: number;
    averageLatency: number;
    throughput: number;
    health: 'healthy' | 'degraded' | 'critical' | 'offline';
}

export interface SyncResult {
    success: boolean;
    itemsSynced: number;
    errors: string[];
    duration: number;
    timestamp: Date;
    conflicts: SyncConflict[];
}

export interface SyncConflict {
    type: 'data_mismatch' | 'version_conflict' | 'concurrent_modification';
    source: string;
    target: string;
    description: string;
    resolution: 'manual' | 'auto_resolve' | 'defer';
    priority: number;
}

export interface IntegrationMetrics {
    startTime: Date;
    messageCount: MessageTypeCount;
    performance: PerformanceMetrics;
    reliability: ReliabilityMetrics;
    resourceUsage: ResourceUsageMetrics;
    errors: ErrorMetrics;
}

export interface MessageTypeCount {
    prp_activation: number;
    field_state_update: number;
    emergence_notification: number;
    resonance_change: number;
    validation_request: number;
    optimization_signal: number;
    synchronization_update: number;
    context_enhancement: number;
    pattern_detection: number;
    adaptive_feedback: number;
}

export interface PerformanceMetrics {
    averageLatency: number;
    maxLatency: number;
    minLatency: number;
    throughput: number;
    processingRate: number;
    queueLength: number;
    concurrentConnections: number;
}

export interface ReliabilityMetrics {
    uptime: number;
    availability: number;
    errorRate: number;
    retryRate: number;
    failoverCount: number;
    recoveryTime: number;
}

export interface ResourceUsageMetrics {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkBandwidth: number;
    fileDescriptors: number;
    threadCount: number;
}

export interface ErrorMetrics {
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsByPriority: Record<MessagePriority, number>;
    criticalErrors: number;
    recentErrors: ErrorSummary[];
}

export interface ErrorSummary {
    timestamp: Date;
    type: string;
    message: string;
    count: number;
    lastOccurrence: Date;
    resolved: boolean;
}

export interface IntegrationHealthMonitor {
    checkHealth(): Promise<HealthStatus>;
    getMetrics(): IntegrationMetrics;
    enableAutoRecovery(): void;
    disableAutoRecovery(): void;
    setHealthThresholds(thresholds: HealthThresholds): void;
}

export interface HealthStatus {
    overall: 'healthy' | 'degraded' | 'critical' | 'offline';
    components: ComponentHealth[];
    timestamp: Date;
    recommendations: HealthRecommendation[];
}

export interface ComponentHealth {
    component: string;
    status: 'healthy' | 'degraded' | 'critical' | 'offline';
    metrics: any;
    issues: string[];
    lastCheck: Date;
}

export interface HealthRecommendation {
    type: 'performance' | 'reliability' | 'capacity' | 'configuration';
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
    action: string;
}

export interface HealthThresholds {
    latencyThreshold: number;
    errorRateThreshold: number;
    memoryUsageThreshold: number;
    cpuUsageThreshold: number;
    queueLengthThreshold: number;
    uptimeThreshold: number;
}