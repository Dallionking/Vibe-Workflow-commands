/**
 * Product Requirements Prompts (PRP) System - Core Interfaces
 * Phase 3: Advanced Context Features
 *
 * Core interfaces for the PRP system implementing advanced prompt engineering
 * techniques including Chain-of-Thought reasoning and few-shot learning.
 */

/**
 * Core PRP Document Interface
 * Represents a transformed phase document as a structured prompt
 */
export interface PRPDocument {
    id: string;
    name: string;
    version: string;
    source: PRPSource;
    metadata: PRPMetadata;
    content: PRPContent;
    validation: PRPValidation;
    performance: PRPPerformance;
}

/**
 * Source information for PRP generation
 */
export interface PRPSource {
    originalDocument: string;
    phaseNumber: number;
    projectContext: string;
    lastModified: Date;
    dependencies: string[];
    relatedPhases: number[];
}

/**
 * Metadata for PRP documents
 */
export interface PRPMetadata {
    promptType: 'phase' | 'feature' | 'validation' | 'retrofit';
    contextDepth: 'shallow' | 'medium' | 'deep';
    reasoningPattern: 'chain-of-thought' | 'few-shot' | 'zero-shot' | 'self-consistency';
    complexity: 'simple' | 'moderate' | 'complex' | 'expert';
    tokenBudget: number;
    estimatedTokens: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
}

/**
 * Core content structure for PRP documents
 */
export interface PRPContent {
    systemPrompt: string;
    contextPrompt: string;
    instructionPrompt: string;
    chainOfThought: ChainOfThoughtStructure;
    fewShotExamples: FewShotExample[];
    validationCriteria: ValidationCriteria[];
    outputFormat: OutputFormat;
    constraintsAndLimitations: string[];
}

/**
 * Chain of Thought structure for complex reasoning
 */
export interface ChainOfThoughtStructure {
    enabled: boolean;
    reasoningSteps: ReasoningStep[];
    thoughtProcess: ThoughtProcess;
    validationChecks: ValidationCheck[];
    emergentInsights: EmergentInsight[];
}

/**
 * Individual reasoning step in CoT
 */
export interface ReasoningStep {
    id: string;
    order: number;
    description: string;
    expectedOutput: string;
    dependencies: string[];
    validationRules: string[];
}

/**
 * Thought process tracking
 */
export interface ThoughtProcess {
    initialAnalysis: string;
    problemDecomposition: string[];
    solutionApproach: string;
    alternativeConsiderations: string[];
    finalSynthesis: string;
}

/**
 * Validation check within CoT
 */
export interface ValidationCheck {
    checkType: 'logical' | 'factual' | 'consistency' | 'completeness';
    criteria: string;
    expectedResult: string;
    validationPrompt: string;
}

/**
 * Emergent insights from CoT reasoning
 */
export interface EmergentInsight {
    insight: string;
    confidence: number;
    relevance: number;
    implications: string[];
    actionItems: string[];
}

/**
 * Few-shot learning example
 */
export interface FewShotExample {
    id: string;
    scenario: string;
    input: string;
    reasoning: string;
    output: string;
    quality: 'excellent' | 'good' | 'acceptable' | 'poor';
    relevance: number;
    complexity: number;
}

/**
 * Validation criteria for PRP outputs
 */
export interface ValidationCriteria {
    criterion: string;
    description: string;
    validationMethod: 'automated' | 'manual' | 'hybrid';
    threshold: number;
    weight: number;
    criticalityLevel: 'optional' | 'recommended' | 'required' | 'critical';
}

/**
 * Output format specification
 */
export interface OutputFormat {
    format: 'markdown' | 'json' | 'yaml' | 'structured-text';
    structure: OutputStructure;
    examples: string[];
    validationSchema?: string;
}

/**
 * Output structure definition
 */
export interface OutputStructure {
    sections: OutputSection[];
    ordering: string[];
    formatting: FormattingRules;
}

/**
 * Individual output section
 */
export interface OutputSection {
    name: string;
    required: boolean;
    description: string;
    format: string;
    examples: string[];
    validationRules: string[];
}

/**
 * Formatting rules for output
 */
export interface FormattingRules {
    headerStyle: string;
    listStyle: string;
    codeBlockStyle: string;
    linkFormat: string;
    emphasisStyle: string;
}

/**
 * PRP validation results
 */
export interface PRPValidation {
    isValid: boolean;
    validationScore: number;
    issues: ValidationIssue[];
    recommendations: ValidationRecommendation[];
    qualityMetrics: QualityMetrics;
}

/**
 * Validation issue tracking
 */
export interface ValidationIssue {
    type: 'error' | 'warning' | 'info';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    location: string;
    suggestedFix: string;
    autoFixable: boolean;
}

/**
 * Validation recommendation
 */
export interface ValidationRecommendation {
    type: 'improvement' | 'optimization' | 'enhancement';
    priority: 'low' | 'medium' | 'high';
    description: string;
    impact: string;
    effort: number;
    implementation: string;
}

/**
 * Quality metrics for PRP documents
 */
export interface QualityMetrics {
    clarity: number;
    completeness: number;
    consistency: number;
    coherence: number;
    effectiveness: number;
    efficiency: number;
    maintainability: number;
}

/**
 * Performance metrics for PRP execution
 */
export interface PRPPerformance {
    generationTime: number;
    tokenUsage: TokenUsage;
    successRate: number;
    averageResponseTime: number;
    qualityScore: number;
    userSatisfaction: number;
    optimizationSuggestions: string[];
}

/**
 * Token usage tracking
 */
export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    costEstimate: number;
    efficiency: number;
    budgetUtilization: number;
}

/**
 * PRP Generator Configuration
 */
export interface PRPGeneratorConfig {
    enableChainOfThought: boolean;
    enableFewShotLearning: boolean;
    enableSelfConsistency: boolean;
    maxTokenBudget: number;
    qualityThreshold: number;
    validationLevel: 'basic' | 'standard' | 'strict' | 'comprehensive';
    optimizationMode: 'speed' | 'quality' | 'balanced';
    cachingEnabled: boolean;
    parallelProcessing: boolean;
}

/**
 * PRP Generation Context
 */
export interface PRPGenerationContext {
    projectName: string;
    projectType: string;
    currentPhase: number;
    previousPhases: number[];
    availableContext: string[];
    userPreferences: UserPreferences;
    systemCapabilities: SystemCapabilities;
    constraints: GenerationConstraints;
}

/**
 * User preferences for PRP generation
 */
export interface UserPreferences {
    verbosityLevel: 'minimal' | 'standard' | 'detailed' | 'comprehensive';
    reasoningStyle: 'logical' | 'creative' | 'analytical' | 'intuitive';
    examplePreference: 'few' | 'moderate' | 'many';
    validationStrictness: 'lenient' | 'standard' | 'strict';
}

/**
 * System capabilities
 */
export interface SystemCapabilities {
    availableTools: string[];
    mcpIntegrations: string[];
    contextLength: number;
    parallelProcessing: boolean;
    cachingCapabilities: boolean;
}

/**
 * Generation constraints
 */
export interface GenerationConstraints {
    maxTokens: number;
    timeLimit: number;
    qualityRequirements: string[];
    formatRequirements: string[];
    compatibilityRequirements: string[];
}

/**
 * PRP Generation Result
 */
export interface PRPGenerationResult {
    success: boolean;
    document: PRPDocument;
    generationMetrics: GenerationMetrics;
    warnings: string[];
    errors: string[];
    suggestions: string[];
}

/**
 * Generation metrics
 */
export interface GenerationMetrics {
    processingTime: number;
    tokensGenerated: number;
    qualityScore: number;
    complexityScore: number;
    innovationScore: number;
    efficiency: number;
}

/**
 * PRP Template Interface
 */
export interface PRPTemplate {
    id: string;
    name: string;
    version: string;
    description: string;
    category: string;
    template: string;
    variables: TemplateVariable[];
    examples: TemplateExample[];
    validation: TemplateValidation;
}

/**
 * Template variable
 */
export interface TemplateVariable {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    description: string;
    required: boolean;
    defaultValue?: any;
    validation?: string;
}

/**
 * Template example
 */
export interface TemplateExample {
    name: string;
    description: string;
    input: Record<string, any>;
    expectedOutput: string;
    quality: 'excellent' | 'good' | 'acceptable';
}

/**
 * Template validation
 */
export interface TemplateValidation {
    schema: string;
    rules: string[];
    examples: string[];
    tests: string[];
}
