/**
 * PRP Context Types
 * Phase 3: Advanced Context Features - Tier 2.5
 */

export interface ContextRequest {
    type: string;
    parameters: Record<string, any>;
    filters: Record<string, any>;
    sessionId?: string;
    userId?: string;
    targetSystem?: string;
    metadata?: Record<string, any>;
}

export interface ContextResponse {
    data: any;
    metadata: ContextResponseMetadata;
    validation: ContextValidation;
    errors: ContextError[];
}

export interface ContextResponseMetadata {
    timestamp: Date;
    requestId: string;
    processingTime: number;
    source: string;
}

export interface ContextValidation {
    isValid: boolean;
    score: number;
    details: Record<string, any>;
}

export interface ContextError {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
    context?: any;
}

export interface ContextualHint {
    type: string;
    content: string;
    relevance: number;
    metadata: Record<string, any>;
}

export interface ContextualPattern {
    id: string;
    pattern: string;
    frequency: number;
    confidence: number;
    metadata: Record<string, any>;
}

export interface ContextualInsight {
    id: string;
    type: string;
    content: string;
    confidence: number;
    supporting_evidence: string[];
    metadata: Record<string, any>;
}