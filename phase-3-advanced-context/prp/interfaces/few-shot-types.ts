/**
 * PRP Few-Shot Learning Types
 * Phase 3: Advanced Context Features - Tier 2.5
 */

export interface SelectionCriteria {
    maxExamples: number;
    minSimilarity: number;
    qualityThreshold: number;
    diversityWeight: number;
    qualityWeight: number;
    recencyWeight: number;
    domainRelevance: number;
    complexityMatch: number;
    enableAdaptation: boolean;
}

export interface ExampleSelection {
    examples: FewShotExample[];
    criteria: SelectionCriteria;
    metadata: {
        totalAvailable: number;
        selectionTime: number;
        qualityScore: number;
    };
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

export interface SimilarityMetric {
    semantic: number;
    structural: number;
    contextual: number;
    combined: number;
}

export interface ExampleAdapter {
    adapt(example: FewShotExample, context: any): FewShotExample;
    validate(example: FewShotExample): boolean;
    score(example: FewShotExample): number;
}

export interface FewShotConfig {
    selectionCriteria: SelectionCriteria;
    adaptationRules: AdaptationRule[];
    validationRules: ValidationRule[];
}

export interface AdaptationRule {
    id: string;
    condition: string;
    transformation: string;
    priority: number;
}

export interface ValidationRule {
    id: string;
    condition: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}
