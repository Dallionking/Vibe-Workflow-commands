/**
 * PRP Reasoning Types
 * Phase 3: Advanced Context Features - Tier 2.5
 */

export interface ChainOfThoughtEnhancement {
    id: string;
    type: 'linear' | 'branching' | 'iterative';
    steps: ReasoningStep[];
    metadata: {
        complexity: number;
        confidence: number;
        processingTime: number;
    };
}

export interface ReasoningStep {
    id: string;
    type: string;
    input: any;
    output: any;
    reasoning: string;
    confidence: number;
    metadata: Record<string, any>;
}

export interface FewShotExample {
    id: string;
    input: any;
    output: any;
    context: string;
    quality: number;
    metadata: {
        domain: string;
        complexity: number;
        recency: number;
    };
}

export interface ReasoningContext {
    domain: string;
    complexity: number;
    constraints: string[];
    preferences: Record<string, any>;
    history: ReasoningStep[];
}

export interface ReasoningResult {
    conclusion: any;
    confidence: number;
    reasoning: string;
    alternatives: AlternativeReasoning[];
    metadata: Record<string, any>;
}

export interface AlternativeReasoning {
    id: string;
    conclusion: any;
    confidence: number;
    reasoning: string;
    pros: string[];
    cons: string[];
}