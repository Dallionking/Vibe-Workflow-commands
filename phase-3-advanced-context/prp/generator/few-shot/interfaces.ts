/**
 * Few-shot Learning Interfaces
 * Phase 3: Advanced Context Features - Tier 2.2
 *
 * Defines interfaces for intelligent example selection and context-aware matching
 * in the PRP (Prompt Response Processing) system.
 */

import { ReasoningContext } from '../chain-of-thought/reasoning-chain';

export interface FewShotExample {
    id: string;
    context: ExampleContext;
    input: string;
    output: string;
    reasoning: string[];
    metadata: ExampleMetadata;
    quality: ExampleQuality;
    tags: string[];
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ExampleContext {
    domain: string;
    complexity: number;
    constraints: string[];
    techniques: string[];
    patterns: string[];
    objectives: string[];
    resources: string[];
}

export interface ExampleMetadata {
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;
    successRate: number;
    averageRating: number;
    source: string;
    author?: string;
    verified: boolean;
    learningObjectives: string[];
}

export interface ExampleQuality {
    clarity: number;
    completeness: number;
    accuracy: number;
    relevance: number;
    effectiveness: number;
    overall: number;
}

export interface SimilarityMetrics {
    contextual: number;
    semantic: number;
    structural: number;
    functional: number;
    domain: number;
    overall: number;
}

export interface ExampleMatch {
    example: FewShotExample;
    similarity: SimilarityMetrics;
    relevanceScore: number;
    confidence: number;
    reasons: string[];
    adaptations?: string[];
}

export interface ExampleSelection {
    selectedExamples: ExampleMatch[];
    totalCandidates: number;
    selectionCriteria: SelectionCriteria;
    diversityScore: number;
    coverageScore: number;
    qualityScore: number;
    recommendations: string[];
}

export interface SelectionCriteria {
    maxExamples: number;
    minSimilarity: number;
    diversityWeight: number;
    qualityWeight: number;
    recencyWeight: number;
    domainRelevance: number;
    complexityMatch: number;
    enableAdaptation: boolean;
    qualityThreshold: number;
}

export interface FewShotLearningConfig {
    maxExamples: number;
    similarityThreshold: number;
    diversityRequirement: number;
    qualityThreshold: number;
    enableContextualAdaptation: boolean;
    enableSemanticSimilarity: boolean;
    enableStructuralMatching: boolean;
    enableDomainSpecific: boolean;
    cacheSize: number;
    learningEnabled: boolean;
}

export interface ContextVector {
    features: Map<string, number>;
    embeddings?: number[];
    categories: string[];
    weights: Map<string, number>;
}

export interface AdaptationStrategy {
    type: 'direct' | 'analogical' | 'transformational' | 'compositional';
    description: string;
    transformations: Transformation[];
    confidence: number;
    requirements: string[];
}

export interface Transformation {
    target: string;
    operation: 'replace' | 'modify' | 'add' | 'remove' | 'rearrange';
    parameters: Record<string, any>;
    explanation: string;
}

export interface LearningFeedback {
    exampleId: string;
    outcome: 'success' | 'partial' | 'failure';
    effectiveness: number;
    issues: string[];
    improvements: string[];
    contextFactors: string[];
}

export interface ExampleRepository {
    examples: Map<string, FewShotExample>;
    indices: {
        byDomain: Map<string, Set<string>>;
        byCategory: Map<string, Set<string>>;
        byComplexity: Map<string, Set<string>>;
        byTags: Map<string, Set<string>>;
    };
    qualityMetrics: Map<string, ExampleQuality>;
    usageStats: Map<string, { count: number; lastUsed: Date; successRate: number }>;
}

export interface SimilarityComputation {
    computeContextualSimilarity(
        context1: ExampleContext,
        context2: ExampleContext
    ): number;

    computeSemanticSimilarity(
        text1: string,
        text2: string
    ): Promise<number>;

    computeStructuralSimilarity(
        reasoning1: string[],
        reasoning2: string[]
    ): number;

    computeFunctionalSimilarity(
        input1: string,
        output1: string,
        input2: string,
        output2: string
    ): number;

    computeDomainSimilarity(
        domain1: string,
        domain2: string
    ): number;
}

export interface ExampleMatcher {
    findSimilarExamples(
        targetContext: ReasoningContext,
        targetInput: string,
        criteria: SelectionCriteria
    ): Promise<ExampleMatch[]>;

    rankExamples(
        examples: ExampleMatch[],
        criteria: SelectionCriteria
    ): ExampleMatch[];

    selectDiverseSet(
        rankedExamples: ExampleMatch[],
        maxExamples: number,
        diversityWeight: number
    ): ExampleSelection;
}

export interface ExampleAdaptor {
    adaptExample(
        example: FewShotExample,
        targetContext: ReasoningContext,
        strategy: AdaptationStrategy
    ): Promise<FewShotExample>;

    generateAdaptationStrategy(
        example: FewShotExample,
        targetContext: ReasoningContext
    ): AdaptationStrategy;

    validateAdaptation(
        originalExample: FewShotExample,
        adaptedExample: FewShotExample,
        targetContext: ReasoningContext
    ): boolean;
}

export interface LearningAnalytics {
    analyzeUsagePatterns(): {
        mostUsedExamples: { id: string; count: number }[];
        domainDistribution: Map<string, number>;
        successRateByCategory: Map<string, number>;
        complexityPreferences: Map<string, number>;
    };

    identifyGaps(): {
        underrepresentedDomains: string[];
        missingComplexityLevels: string[];
        lowQualityExamples: string[];
        improvementOpportunities: string[];
    };

    recommendImprovements(): {
        newExamplesNeeded: { domain: string; category: string; difficulty: string }[];
        exampleUpdates: { id: string; issues: string[]; suggestions: string[] }[];
        qualityImprovements: { id: string; targetAreas: string[] }[];
    };
}

export interface ExampleGenerator {
    generateSyntheticExample(
        targetDomain: string,
        targetComplexity: number,
        requirements: string[]
    ): Promise<FewShotExample>;

    augmentExample(
        baseExample: FewShotExample,
        variations: string[]
    ): Promise<FewShotExample[]>;

    validateGeneratedExample(
        example: FewShotExample
    ): { isValid: boolean; issues: string[]; quality: ExampleQuality };
}
