/**
 * Field Protocol Resonance System Interfaces
 * Phase 3: Advanced Context Features - Tier 2.3
 *
 * Defines interfaces for synchronization patterns, coherent behavior emergence,
 * and field resonance dynamics in the advanced context system.
 */

export interface ResonanceField {
    id: string;
    name: string;
    frequency: number;
    amplitude: number;
    phase: number;
    fieldType: 'cognitive' | 'semantic' | 'structural' | 'temporal' | 'emergent';
    harmonics: ResonanceHarmonic[];
    coherenceLevel: number;
    entropy: number;
    stability: number;
    metadata: FieldMetadata;
}

export interface ResonanceHarmonic {
    frequency: number;
    amplitude: number;
    phase: number;
    overtone: number;
    resonanceStrength: number;
    coherenceContribution: number;
}

export interface FieldMetadata {
    createdAt: Date;
    lastUpdate: Date;
    sourceContext: string;
    influenceRadius: number;
    decayRate: number;
    stabilityHistory: number[];
    emergencePatterns: string[];
}

export interface SynchronizationPattern {
    id: string;
    name: string;
    type: 'phase_lock' | 'frequency_match' | 'amplitude_sync' | 'harmonic_resonance' | 'emergent_coherence';
    participants: string[]; // Field IDs
    synchronizationStrength: number;
    coherenceMetrics: CoherenceMetrics;
    stabilityIndex: number;
    emergenceIndicators: EmergenceIndicator[];
    adaptiveParameters: AdaptiveParameter[];
}

export interface CoherenceMetrics {
    phase_coherence: number;
    frequency_coherence: number;
    amplitude_coherence: number;
    harmonic_coherence: number;
    overall_coherence: number;
    coherence_stability: number;
    emergence_potential: number;
}

export interface EmergenceIndicator {
    type: 'phase_transition' | 'pattern_formation' | 'collective_behavior' | 'information_integration' | 'adaptive_response';
    strength: number;
    confidence: number;
    timeWindow: number;
    spatialExtent: number;
    prerequisites: string[];
    observedAt: Date;
}

export interface AdaptiveParameter {
    name: string;
    currentValue: number;
    targetValue: number;
    adaptationRate: number;
    constraints: { min: number; max: number };
    influence: 'frequency' | 'amplitude' | 'phase' | 'coherence' | 'emergence';
    feedback: ParameterFeedback[];
}

export interface ParameterFeedback {
    timestamp: Date;
    value: number;
    effectiveness: number;
    context: string;
    adjustment: number;
}

export interface ResonanceNetwork {
    id: string;
    nodes: Map<string, ResonanceNode>;
    connections: Map<string, ResonanceConnection>;
    clusters: ResonanceCluster[];
    globalCoherence: number;
    networkEntropy: number;
    emergenceLevel: number;
    synchronizationPatterns: SynchronizationPattern[];
}

export interface ResonanceNode {
    id: string;
    field: ResonanceField;
    position: NetworkPosition;
    connections: string[];
    influence: number;
    stability: number;
    emergenceContribution: number;
    localCoherence: number;
}

export interface NetworkPosition {
    coordinates: number[];
    centrality: number;
    clustering: number;
    betweenness: number;
    eigenvector: number;
}

export interface ResonanceConnection {
    id: string;
    sourceId: string;
    targetId: string;
    strength: number;
    resonanceType: 'constructive' | 'destructive' | 'neutral' | 'adaptive';
    phaseRelation: number;
    frequencyRatio: number;
    coherenceContribution: number;
    stability: number;
    emergenceEffect: number;
}

export interface ResonanceCluster {
    id: string;
    nodeIds: string[];
    centerNode: string;
    clusterCoherence: number;
    synchronizationLevel: number;
    emergencePattern: string;
    stability: number;
    radius: number;
    density: number;
}

export interface FieldOscillator {
    frequency: number;
    amplitude: number;
    phase: number;
    dampingFactor: number;
    couplingStrength: number;
    nonlinearity: number;
    noiseLevel: number;
    adaptivity: number;
}

export interface CoherenceState {
    timestamp: Date;
    globalCoherence: number;
    localCoherences: Map<string, number>;
    synchronizationIndex: number;
    emergenceLevel: number;
    entropy: number;
    stability: number;
    phaseRelations: Map<string, number>;
    frequencyLocking: boolean;
    amplitudeSyncing: boolean;
}

export interface EmergenceEvent {
    id: string;
    type: EmergenceType;
    timestamp: Date;
    duration: number;
    participants: string[];
    strength: number;
    coherenceThreshold: number;
    precursors: string[];
    outcomes: string[];
    stability: number;
    propagation: EmergencePropagation;
}

export type EmergenceType =
    | 'spontaneous_synchronization'
    | 'phase_transition'
    | 'pattern_formation'
    | 'collective_oscillation'
    | 'information_cascade'
    | 'adaptive_restructuring'
    | 'coherent_amplification'
    | 'distributed_computation';

export interface EmergencePropagation {
    speed: number;
    direction: number[];
    waveform: 'linear' | 'exponential' | 'oscillatory' | 'chaotic';
    decay: number;
    amplification: number;
    interference: number;
}

export interface ResonanceDetector {
    detectResonance(fields: ResonanceField[]): ResonancePattern[];
    detectEmergence(network: ResonanceNetwork): EmergenceEvent[];
    detectSynchronization(nodes: ResonanceNode[]): SynchronizationPattern[];
    detectCoherence(state: CoherenceState): CoherenceMetrics;
}

export interface ResonancePattern {
    id: string;
    type: 'resonance' | 'anti_resonance' | 'beating' | 'harmonics' | 'chaos';
    participants: string[];
    frequency: number;
    amplitude: number;
    phase: number;
    stability: number;
    coherence: number;
    emergence: number;
    duration: number;
    strength: number;
}

export interface ResonanceSynthesizer {
    synthesizeFields(fields: ResonanceField[]): ResonanceField;
    amplifyResonance(pattern: ResonancePattern): ResonancePattern;
    dampResonance(pattern: ResonancePattern, factor: number): ResonancePattern;
    modulateFrequency(field: ResonanceField, modulation: FrequencyModulation): ResonanceField;
    phaseShift(field: ResonanceField, shift: number): ResonanceField;
}

export interface FrequencyModulation {
    type: 'am' | 'fm' | 'pm' | 'hybrid';
    modulationFrequency: number;
    modulationDepth: number;
    modulationPhase: number;
    harmonics: boolean;
}

export interface ResonanceController {
    initializeResonance(config: ResonanceConfig): Promise<ResonanceNetwork>;
    updateResonance(network: ResonanceNetwork, inputs: ResonanceInput[]): Promise<ResonanceNetwork>;
    stabilizeResonance(network: ResonanceNetwork): Promise<void>;
    emergenceControl(network: ResonanceNetwork, target: EmergenceTarget): Promise<EmergenceEvent>;
    adaptiveControl(network: ResonanceNetwork, feedback: ControlFeedback[]): Promise<void>;
}

export interface ResonanceConfig {
    networkSize: number;
    connectionDensity: number;
    baseFrequency: number;
    frequencySpread: number;
    couplingStrength: number;
    adaptivityLevel: number;
    noiseLevel: number;
    emergenceThreshold: number;
    stabilityRequired: number;
    coherenceTarget: number;
}

export interface ResonanceInput {
    fieldId: string;
    inputType: 'frequency' | 'amplitude' | 'phase' | 'coupling' | 'noise';
    value: number;
    duration: number;
    fadeIn: number;
    fadeOut: number;
    timestamp: Date;
}

export interface EmergenceTarget {
    type: EmergenceType;
    strength: number;
    duration: number;
    participants: string[];
    coherenceRequired: number;
    stabilityRequired: number;
    constraints: EmergenceConstraint[];
}

export interface EmergenceConstraint {
    parameter: string;
    operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'range';
    value: number | [number, number];
    priority: number;
    flexibility: number;
}

export interface ControlFeedback {
    timestamp: Date;
    fieldId: string;
    performance: number;
    coherence: number;
    stability: number;
    emergence: number;
    adaptation: number;
    recommendation: string;
}

export interface ResonanceAnalyzer {
    analyzeNetworkCoherence(network: ResonanceNetwork): CoherenceAnalysis;
    analyzeEmergencePatterns(events: EmergenceEvent[]): EmergenceAnalysis;
    analyzeSynchronization(patterns: SynchronizationPattern[]): SynchronizationAnalysis;
    analyzeStability(network: ResonanceNetwork, timeWindow: number): StabilityAnalysis;
    analyzeAdaptation(network: ResonanceNetwork, history: CoherenceState[]): AdaptationAnalysis;
}

export interface CoherenceAnalysis {
    overall: CoherenceMetrics;
    spatial: Map<string, CoherenceMetrics>;
    temporal: CoherenceMetrics[];
    patterns: CoherencePattern[];
    recommendations: string[];
}

export interface CoherencePattern {
    type: 'steady_state' | 'oscillatory' | 'intermittent' | 'chaotic' | 'emergent';
    frequency: number;
    amplitude: number;
    persistence: number;
    influence: number;
    predictability: number;
}

export interface EmergenceAnalysis {
    frequency: Map<EmergenceType, number>;
    duration: Map<EmergenceType, number>;
    strength: Map<EmergenceType, number>;
    cascades: EmergenceCascade[];
    triggers: EmergenceTrigger[];
    inhibitors: EmergenceInhibitor[];
    predictions: EmergencePrediction[];
}

export interface EmergenceCascade {
    initiator: EmergenceEvent;
    sequence: EmergenceEvent[];
    amplification: number;
    coherence: number;
    stability: number;
    duration: number;
}

export interface EmergenceTrigger {
    type: string;
    frequency: number;
    effectiveness: number;
    conditions: string[];
    threshold: number;
}

export interface EmergenceInhibitor {
    type: string;
    effectiveness: number;
    conditions: string[];
    threshold: number;
}

export interface EmergencePrediction {
    type: EmergenceType;
    probability: number;
    timeframe: number;
    precursors: string[];
    confidence: number;
    implications: string[];
}

export interface SynchronizationAnalysis {
    global: SynchronizationMetrics;
    local: Map<string, SynchronizationMetrics>;
    patterns: SynchronizationPattern[];
    stability: number;
    adaptability: number;
    efficiency: number;
}

export interface SynchronizationMetrics {
    phase_sync: number;
    frequency_sync: number;
    amplitude_sync: number;
    coherence: number;
    stability: number;
    emergence: number;
}

export interface StabilityAnalysis {
    overall: number;
    trends: StabilityTrend[];
    vulnerabilities: StabilityVulnerability[];
    resilience: number;
    adaptability: number;
    recommendations: string[];
}

export interface StabilityTrend {
    parameter: string;
    direction: 'increasing' | 'decreasing' | 'stable' | 'oscillating';
    rate: number;
    confidence: number;
    timeframe: number;
}

export interface StabilityVulnerability {
    type: string;
    severity: number;
    probability: number;
    triggers: string[];
    mitigations: string[];
}

export interface AdaptationAnalysis {
    adaptationRate: number;
    adaptationEfficiency: number;
    learningPatterns: AdaptationPattern[];
    convergence: ConvergenceAnalysis;
    robustness: number;
    plasticity: number;
}

export interface AdaptationPattern {
    type: 'gradual' | 'rapid' | 'oscillatory' | 'threshold' | 'nonlinear';
    parameters: string[];
    effectiveness: number;
    stability: number;
    generalization: number;
}

export interface ConvergenceAnalysis {
    isConverging: boolean;
    rate: number;
    target: CoherenceMetrics;
    timeToConvergence: number;
    confidence: number;
    obstacles: string[];
}

export interface ResonanceOptimizer {
    optimizeCoherence(network: ResonanceNetwork): Promise<OptimizationResult>;
    optimizeEmergence(network: ResonanceNetwork, target: EmergenceTarget): Promise<OptimizationResult>;
    optimizeStability(network: ResonanceNetwork): Promise<OptimizationResult>;
    optimizeAdaptation(network: ResonanceNetwork): Promise<OptimizationResult>;
    multiObjectiveOptimization(
        network: ResonanceNetwork,
        objectives: OptimizationObjective[]
    ): Promise<OptimizationResult>;
}

export interface OptimizationObjective {
    type: 'coherence' | 'emergence' | 'stability' | 'adaptation' | 'efficiency';
    weight: number;
    target: number;
    constraints: OptimizationConstraint[];
}

export interface OptimizationConstraint {
    parameter: string;
    bound: 'lower' | 'upper' | 'equality';
    value: number;
    priority: number;
}

export interface OptimizationResult {
    success: boolean;
    iterations: number;
    finalScore: number;
    improvements: Map<string, number>;
    adjustments: ParameterAdjustment[];
    convergence: ConvergenceInfo;
    recommendations: string[];
}

export interface ParameterAdjustment {
    parameter: string;
    originalValue: number;
    newValue: number;
    improvement: number;
    confidence: number;
}

export interface ConvergenceInfo {
    converged: boolean;
    finalError: number;
    iterations: number;
    convergenceRate: number;
    stability: number;
}
