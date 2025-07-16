/**
 * Field Protocol Resonance Types  
 * Phase 3: Advanced Context Features - Tier 2.5
 */

export interface ResonanceField {
    id: string;
    name: string;
    frequency: number;
    amplitude: number;
    phase: number;
    harmonic: number;
    decay: number;
    quality: number;
    bandwidth: number;
    coupling: ResonanceCoupling[];
    metadata: Record<string, any>;
}

export interface ResonanceCoupling {
    fieldId: string;
    strength: number;
    type: 'constructive' | 'destructive' | 'neutral';
    phase_difference: number;
    bandwidth_overlap: number;
}

export interface ResonanceNetwork {
    id: string;
    name: string;
    fields: ResonanceField[];
    connections: ResonanceConnection[];
    emergentProperties: EmergentProperty[];
    stability: NetworkStability;
    metadata: Record<string, any>;
}

export interface ResonanceConnection {
    from: string;
    to: string;
    strength: number;
    type: string;
    delay: number;
    bandwidth: number;
    metadata: Record<string, any>;
}

export interface EmergentProperty {
    id: string;
    type: string;
    value: number;
    stability: number;
    confidence: number;
    metadata: Record<string, any>;
}

export interface NetworkStability {
    overall: number;
    local: number[];
    critical_points: ResonanceCriticalPoint[];
    resilience: number;
}

export interface ResonanceCriticalPoint {
    fieldId: string;
    type: 'stable' | 'unstable' | 'neutral';
    sensitivity: number;
    influence: number;
}

export interface EmergenceEvent {
    id: string;
    type: string;
    timestamp: Date;
    source: string;
    magnitude: number;
    duration: number;
    affected_fields: string[];
    metadata: Record<string, any>;
}

export interface ResonancePattern {
    id: string;
    name: string;
    signature: number[];
    frequency: number;
    occurrence: number;
    confidence: number;
    metadata: Record<string, any>;
}

export interface ResonanceDetector {
    detect(fields: ResonanceField[]): ResonancePattern[];
    analyze(pattern: ResonancePattern): ResonanceAnalysis;
    predict(pattern: ResonancePattern): ResonancePrediction;
}

export interface ResonanceAnalysis {
    pattern: ResonancePattern;
    characteristics: Record<string, number>;
    stability: number;
    predictability: number;
    metadata: Record<string, any>;
}

export interface ResonancePrediction {
    pattern: ResonancePattern;
    likelihood: number;
    timeframe: number;
    confidence: number;
    conditions: string[];
    metadata: Record<string, any>;
}