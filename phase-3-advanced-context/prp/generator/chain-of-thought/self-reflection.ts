/**
 * Self-Reflection System for Advanced Reasoning
 * Phase 3: Advanced Context Features - Tier 2.1
 *
 * Implements metacognitive capabilities for reasoning quality assessment,
 * error detection, and dynamic reasoning adjustment.
 */

import { ReasoningStep } from '../interfaces';
import { ReasoningContext, ReflectionResult } from './reasoning-chain';

export type ReflectionType = 'quality' | 'consistency' | 'completeness' | 'efficiency' | 'accuracy' | 'innovation';

export interface ReflectionCriteria {
    type: ReflectionType;
    name: string;
    description: string;
    weight: number;
    threshold: number;
    evaluator: (steps: ReasoningStep[], context: ReasoningContext) => Promise<ReflectionScore>;
}

export interface ReflectionScore {
    score: number;
    confidence: number;
    details: string;
    evidence: string[];
    suggestions: string[];
}

export interface ReflectionInsight {
    type: 'strength' | 'weakness' | 'opportunity' | 'threat';
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    actionable: boolean;
    recommendation: string;
}

export interface ReflectionSession {
    id: string;
    timestamp: Date;
    stepRange: { start: number; end: number };
    overallScore: number;
    criteriaScores: Map<ReflectionType, ReflectionScore>;
    insights: ReflectionInsight[];
    adjustments: Record<string, any>;
    recommendation: 'continue' | 'adjust' | 'restart' | 'stop';
}

export interface SelfReflectionConfig {
    reflectionInterval: number;
    enableContinuousReflection: boolean;
    enableMetacognition: boolean;
    qualityThreshold: number;
    confidenceThreshold: number;
    maxReflectionHistory: number;
    enableLearningFromReflection: boolean;
}

export class SelfReflectionEngine {
  private config: SelfReflectionConfig;
  private criteria: Map<ReflectionType, ReflectionCriteria>;
  private reflectionHistory: ReflectionSession[];
  private knowledgeBase: Map<string, any>;
  private learningPatterns: Map<string, number>;

  constructor(config: SelfReflectionConfig) {
    this.config = config;
    this.criteria = new Map();
    this.reflectionHistory = [];
    this.knowledgeBase = new Map();
    this.learningPatterns = new Map();

    this.initializeCriteria();
  }

  /**
     * Perform comprehensive self-reflection on reasoning steps
     */
  async performReflection(
    steps: ReasoningStep[],
    context: ReasoningContext,
    stepRange?: { start: number; end: number }
  ): Promise<ReflectionResult> {
    const sessionId = `reflection_${Date.now()}`;
    const range = stepRange || { start: 0, end: steps.length - 1 };

    console.log(`🤔 Starting reflection session ${sessionId} (steps ${range.start}-${range.end})`);

    // Evaluate each criteria
    const criteriaScores = new Map<ReflectionType, ReflectionScore>();
    let totalScore = 0;
    let totalWeight = 0;

    for (const [type, criteria] of this.criteria) {
      const score = await criteria.evaluator(steps, context);
      criteriaScores.set(type, score);

      totalScore += score.score * criteria.weight;
      totalWeight += criteria.weight;
    }

    const overallScore = totalScore / totalWeight;

    // Generate insights
    const insights = await this.generateInsights(criteriaScores, context);

    // Determine adjustments
    const adjustments = await this.generateAdjustments(criteriaScores, insights, context);

    // Make recommendation
    const recommendation = this.makeRecommendation(overallScore, insights);

    // Create reflection session
    const session: ReflectionSession = {
      id: sessionId,
      timestamp: new Date(),
      stepRange: range,
      overallScore,
      criteriaScores,
      insights,
      adjustments,
      recommendation
    };

    // Store in history
    this.reflectionHistory.push(session);
    this.maintainHistorySize();

    // Learn from reflection if enabled
    if (this.config.enableLearningFromReflection) {
      await this.learnFromReflection(session);
    }

    console.log(`✅ Reflection complete: ${overallScore.toFixed(2)} overall score, ${insights.length} insights`);

    return {
      isValid: overallScore >= this.config.qualityThreshold,
      confidence: this.calculateConfidence(criteriaScores),
      issues: this.extractIssues(insights),
      suggestions: this.extractSuggestions(insights),
      shouldContinue: recommendation === 'continue' || recommendation === 'adjust',
      adjustments
    };
  }

  /**
     * Continuous reflection monitoring
     */
  async continuousReflection(
    steps: ReasoningStep[],
    context: ReasoningContext
  ): Promise<ReflectionResult | null> {
    if (!this.config.enableContinuousReflection) {
      return null;
    }

    const shouldReflect = steps.length > 0 &&
                             steps.length % this.config.reflectionInterval === 0;

    if (!shouldReflect) {
      return null;
    }

    console.log('🔄 Continuous reflection triggered');
    return await this.performReflection(steps, context);
  }

  /**
     * Metacognitive analysis of reasoning process
     */
  async metacognitiveAnalysis(
    steps: ReasoningStep[],
    context: ReasoningContext
  ): Promise<{
        reasoningStrategy: string;
        cognitiveLoad: number;
        biases: string[];
        optimizations: string[];
    }> {
    if (!this.config.enableMetacognition) {
      return {
        reasoningStrategy: 'standard',
        cognitiveLoad: 0.5,
        biases: [],
        optimizations: []
      };
    }

    console.log('🧠 Performing metacognitive analysis...');

    // Analyze reasoning strategy
    const reasoningStrategy = this.analyzeReasoningStrategy(steps, context);

    // Calculate cognitive load
    const cognitiveLoad = this.calculateCognitiveLoad(steps, context);

    // Identify potential biases
    const biases = await this.identifyBiases(steps, context);

    // Suggest optimizations
    const optimizations = await this.suggestOptimizations(steps, context);

    return {
      reasoningStrategy,
      cognitiveLoad,
      biases,
      optimizations
    };
  }

  /**
     * Generate insights from reflection scores
     */
  private async generateInsights(
    scores: Map<ReflectionType, ReflectionScore>,
    context: ReasoningContext
  ): Promise<ReflectionInsight[]> {
    const insights: ReflectionInsight[] = [];

    for (const [type, score] of scores) {
      const criteria = this.criteria.get(type)!;

      if (score.score < criteria.threshold) {
        // Identify weakness
        insights.push({
          type: 'weakness',
          description: `${criteria.name} below threshold (${score.score.toFixed(2)} < ${criteria.threshold})`,
          impact: this.determineImpact(score.score, criteria.threshold),
          actionable: true,
          recommendation: score.suggestions[0] || `Improve ${criteria.name.toLowerCase()}`
        });
      } else if (score.score > criteria.threshold + 0.2) {
        // Identify strength
        insights.push({
          type: 'strength',
          description: `${criteria.name} exceeds expectations (${score.score.toFixed(2)})`,
          impact: 'medium',
          actionable: false,
          recommendation: `Maintain current ${criteria.name.toLowerCase()} approach`
        });
      }
    }

    // Generate contextual insights
    if (context.complexity > 0.8) {
      insights.push({
        type: 'opportunity',
        description: 'High complexity scenario may benefit from additional decomposition',
        impact: 'medium',
        actionable: true,
        recommendation: 'Consider breaking down complex steps into smaller components'
      });
    }

    if (context.previousSteps.length > 8) {
      insights.push({
        type: 'threat',
        description: 'Reasoning chain becoming lengthy, may lose coherence',
        impact: 'medium',
        actionable: true,
        recommendation: 'Add intermediate synthesis steps to maintain coherence'
      });
    }

    return insights;
  }

  /**
     * Generate adjustments based on insights
     */
  private async generateAdjustments(
    scores: Map<ReflectionType, ReflectionScore>,
    insights: ReflectionInsight[],
    context: ReasoningContext
  ): Promise<Record<string, any>> {
    const adjustments: Record<string, any> = {};

    // Quality adjustments
    const qualityScore = scores.get('quality');
    if (qualityScore && qualityScore.score < 0.7) {
      adjustments.increaseValidation = true;
      adjustments.additionalReviewSteps = Math.ceil((0.7 - qualityScore.score) * 5);
    }

    // Consistency adjustments
    const consistencyScore = scores.get('consistency');
    if (consistencyScore && consistencyScore.score < 0.8) {
      adjustments.enhanceConsistencyChecks = true;
      adjustments.crossReferenceSteps = true;
    }

    // Completeness adjustments
    const completenessScore = scores.get('completeness');
    if (completenessScore && completenessScore.score < 0.75) {
      adjustments.addCompletionChecks = true;
      adjustments.requireExplicitCoverage = true;
    }

    // Efficiency adjustments
    const efficiencyScore = scores.get('efficiency');
    if (efficiencyScore && efficiencyScore.score < 0.6) {
      adjustments.optimizeStepSequence = true;
      adjustments.eliminateRedundancy = true;
    }

    // Context-specific adjustments
    if (context.complexity > 0.8) {
      adjustments.complexityHandling = 'enhanced';
      adjustments.decompositionDepth = Math.ceil(context.complexity * 3);
    }

    // Insight-based adjustments
    for (const insight of insights) {
      if (insight.actionable && insight.impact === 'high') {
        adjustments[`insight_${insight.type}`] = insight.recommendation;
      }
    }

    return adjustments;
  }

  /**
     * Make recommendation based on reflection results
     */
  private makeRecommendation(
    overallScore: number,
    insights: ReflectionInsight[]
  ): 'continue' | 'adjust' | 'restart' | 'stop' {
    const criticalIssues = insights.filter(i => i.impact === 'critical');
    const highImpactIssues = insights.filter(i => i.impact === 'high');

    if (criticalIssues.length > 0) {
      return 'stop';
    }

    if (overallScore < 0.5 || highImpactIssues.length > 2) {
      return 'restart';
    }

    if (overallScore < this.config.qualityThreshold) {
      return 'adjust';
    }

    return 'continue';
  }

  /**
     * Initialize reflection criteria
     */
  private initializeCriteria(): void {
    const criteria: ReflectionCriteria[] = [
      {
        type: 'quality',
        name: 'Reasoning Quality',
        description: 'Overall quality of reasoning steps',
        weight: 0.25,
        threshold: 0.7,
        evaluator: this.evaluateQuality.bind(this)
      },
      {
        type: 'consistency',
        name: 'Logical Consistency',
        description: 'Consistency of reasoning throughout steps',
        weight: 0.2,
        threshold: 0.8,
        evaluator: this.evaluateConsistency.bind(this)
      },
      {
        type: 'completeness',
        name: 'Completeness',
        description: 'Completeness of reasoning coverage',
        weight: 0.2,
        threshold: 0.75,
        evaluator: this.evaluateCompleteness.bind(this)
      },
      {
        type: 'efficiency',
        name: 'Efficiency',
        description: 'Efficiency of reasoning process',
        weight: 0.15,
        threshold: 0.6,
        evaluator: this.evaluateEfficiency.bind(this)
      },
      {
        type: 'accuracy',
        name: 'Accuracy',
        description: 'Accuracy of reasoning conclusions',
        weight: 0.15,
        threshold: 0.8,
        evaluator: this.evaluateAccuracy.bind(this)
      },
      {
        type: 'innovation',
        name: 'Innovation',
        description: 'Innovation and creativity in reasoning',
        weight: 0.05,
        threshold: 0.5,
        evaluator: this.evaluateInnovation.bind(this)
      }
    ];

    criteria.forEach(c => this.criteria.set(c.type, c));
    console.log(`🧠 Initialized ${criteria.length} reflection criteria`);
  }

  // Evaluation methods
  private async evaluateQuality(steps: ReasoningStep[], context: ReasoningContext): Promise<ReflectionScore> {
    let qualityScore = 0.5;
    const evidence: string[] = [];
    const suggestions: string[] = [];

    // Check for validation rules
    const stepsWithValidation = steps.filter(s => s.validationRules.length > 0);
    qualityScore += (stepsWithValidation.length / steps.length) * 0.3;

    if (stepsWithValidation.length > 0) {
      evidence.push(`${stepsWithValidation.length}/${steps.length} steps have validation rules`);
    } else {
      suggestions.push('Add validation rules to reasoning steps');
    }

    // Check for clear descriptions
    const stepsWithGoodDescriptions = steps.filter(s => s.description.length > 20);
    qualityScore += (stepsWithGoodDescriptions.length / steps.length) * 0.2;

    if (stepsWithGoodDescriptions.length === steps.length) {
      evidence.push('All steps have detailed descriptions');
    } else {
      suggestions.push('Improve step descriptions for clarity');
    }

    return {
      score: Math.min(qualityScore, 1.0),
      confidence: 0.8,
      details: 'Quality assessment based on validation rules and descriptions',
      evidence,
      suggestions
    };
  }

  private async evaluateConsistency(steps: ReasoningStep[], context: ReasoningContext): Promise<ReflectionScore> {
    let consistencyScore = 0.8;
    const evidence: string[] = [];
    const suggestions: string[] = [];

    // Check for consistent validation rules
    const allValidationRules = steps.flatMap(s => s.validationRules);
    const uniqueRules = new Set(allValidationRules);

    if (uniqueRules.has('consistency') || uniqueRules.has('logical')) {
      consistencyScore += 0.1;
      evidence.push('Consistency validation rules present');
    } else {
      suggestions.push('Add consistency validation rules');
    }

    // Check for dependency consistency
    const allStepIds = new Set(steps.map(s => s.id));
    const allDependencies = steps.flatMap(s => s.dependencies);
    const invalidDependencies = allDependencies.filter(d => !allStepIds.has(d));

    if (invalidDependencies.length === 0) {
      consistencyScore += 0.1;
      evidence.push('All dependencies are valid');
    } else {
      consistencyScore -= 0.2;
      suggestions.push('Fix invalid step dependencies');
    }

    return {
      score: Math.min(consistencyScore, 1.0),
      confidence: 0.85,
      details: 'Consistency assessment based on validation rules and dependencies',
      evidence,
      suggestions
    };
  }

  private async evaluateCompleteness(steps: ReasoningStep[], context: ReasoningContext): Promise<ReflectionScore> {
    let completenessScore = 0.6;
    const evidence: string[] = [];
    const suggestions: string[] = [];

    // Check for expected output specification
    const stepsWithOutput = steps.filter(s => s.expectedOutput && s.expectedOutput.length > 10);
    completenessScore += (stepsWithOutput.length / steps.length) * 0.3;

    if (stepsWithOutput.length === steps.length) {
      evidence.push('All steps have expected output specifications');
    } else {
      suggestions.push('Add expected output specifications to all steps');
    }

    // Check for completeness validation
    const hasCompletenessValidation = steps.some(s => s.validationRules.includes('completeness'));
    if (hasCompletenessValidation) {
      completenessScore += 0.1;
      evidence.push('Completeness validation present');
    } else {
      suggestions.push('Add completeness validation checks');
    }

    return {
      score: Math.min(completenessScore, 1.0),
      confidence: 0.75,
      details: 'Completeness assessment based on output specifications and validation',
      evidence,
      suggestions
    };
  }

  private async evaluateEfficiency(steps: ReasoningStep[], context: ReasoningContext): Promise<ReflectionScore> {
    let efficiencyScore = 0.7;
    const evidence: string[] = [];
    const suggestions: string[] = [];

    // Check for reasonable number of steps
    const stepCount = steps.length;
    if (stepCount <= 6) {
      efficiencyScore += 0.2;
      evidence.push(`Reasonable step count: ${stepCount}`);
    } else if (stepCount > 10) {
      efficiencyScore -= 0.2;
      suggestions.push('Consider consolidating steps for better efficiency');
    }

    // Check for minimal dependencies
    const avgDependencies = steps.reduce((sum, s) => sum + s.dependencies.length, 0) / steps.length;
    if (avgDependencies < 2) {
      efficiencyScore += 0.1;
      evidence.push('Minimal step dependencies');
    } else {
      suggestions.push('Reduce step dependencies where possible');
    }

    return {
      score: Math.min(efficiencyScore, 1.0),
      confidence: 0.7,
      details: 'Efficiency assessment based on step count and dependencies',
      evidence,
      suggestions
    };
  }

  private async evaluateAccuracy(steps: ReasoningStep[], context: ReasoningContext): Promise<ReflectionScore> {
    let accuracyScore = 0.8;
    const evidence: string[] = [];
    const suggestions: string[] = [];

    // Check for accuracy validation rules
    const hasAccuracyValidation = steps.some(s =>
      s.validationRules.includes('accuracy') ||
            s.validationRules.includes('correctness')
    );

    if (hasAccuracyValidation) {
      accuracyScore += 0.1;
      evidence.push('Accuracy validation rules present');
    } else {
      suggestions.push('Add accuracy validation to critical steps');
    }

    // Check for domain-specific validation
    if (context.domain !== 'general') {
      const hasDomainValidation = steps.some(s =>
        s.validationRules.some((rule: any) => rule.includes(context.domain))
      );

      if (hasDomainValidation) {
        accuracyScore += 0.1;
        evidence.push('Domain-specific validation present');
      } else {
        suggestions.push('Add domain-specific validation rules');
      }
    }

    return {
      score: Math.min(accuracyScore, 1.0),
      confidence: 0.85,
      details: 'Accuracy assessment based on validation rules and domain specificity',
      evidence,
      suggestions
    };
  }

  private async evaluateInnovation(steps: ReasoningStep[], context: ReasoningContext): Promise<ReflectionScore> {
    let innovationScore = 0.5;
    const evidence: string[] = [];
    const suggestions: string[] = [];

    // Check for creative step descriptions
    const creativeKeywords = ['innovative', 'creative', 'novel', 'unique', 'alternative'];
    const creativeSteps = steps.filter(s =>
      creativeKeywords.some(keyword => s.description.toLowerCase().includes(keyword))
    );

    if (creativeSteps.length > 0) {
      innovationScore += 0.3;
      evidence.push(`${creativeSteps.length} steps show creative thinking`);
    } else {
      suggestions.push('Consider adding creative or alternative approaches');
    }

    // Check for diverse validation approaches
    const allValidationRules = steps.flatMap(s => s.validationRules);
    const uniqueValidationRules = new Set(allValidationRules);

    if (uniqueValidationRules.size > 5) {
      innovationScore += 0.2;
      evidence.push('Diverse validation approaches used');
    } else {
      suggestions.push('Explore diverse validation methods');
    }

    return {
      score: Math.min(innovationScore, 1.0),
      confidence: 0.6,
      details: 'Innovation assessment based on creative elements and diverse approaches',
      evidence,
      suggestions
    };
  }

  // Helper methods
  private calculateConfidence(scores: Map<ReflectionType, ReflectionScore>): number {
    const confidenceValues = Array.from(scores.values()).map(s => s.confidence);
    return confidenceValues.reduce((sum, conf) => sum + conf, 0) / confidenceValues.length;
  }

  private extractIssues(insights: ReflectionInsight[]): string[] {
    return insights
      .filter(i => i.type === 'weakness' || i.type === 'threat')
      .map(i => i.description);
  }

  private extractSuggestions(insights: ReflectionInsight[]): string[] {
    return insights
      .filter(i => i.actionable)
      .map(i => i.recommendation);
  }

  private determineImpact(score: number, threshold: number): 'low' | 'medium' | 'high' | 'critical' {
    const difference = threshold - score;
    if (difference > 0.4) {
      return 'critical';
    }
    if (difference > 0.2) {
      return 'high';
    }
    if (difference > 0.1) {
      return 'medium';
    }
    return 'low';
  }

  private maintainHistorySize(): void {
    if (this.reflectionHistory.length > this.config.maxReflectionHistory) {
      this.reflectionHistory = this.reflectionHistory.slice(-this.config.maxReflectionHistory);
    }
  }

  private async learnFromReflection(session: ReflectionSession): Promise<void> {
    // Update learning patterns
    const key = `${session.recommendation}_${session.overallScore.toFixed(1)}`;
    this.learningPatterns.set(key, (this.learningPatterns.get(key) || 0) + 1);

    // Update knowledge base
    session.insights.forEach(insight => {
      if (insight.actionable) {
        const knowledgeKey = `${insight.type}_${insight.impact}`;
        this.knowledgeBase.set(knowledgeKey, insight.recommendation);
      }
    });

    console.log(`📚 Learning from reflection: ${this.learningPatterns.size} patterns, ${this.knowledgeBase.size} knowledge items`);
  }

  private analyzeReasoningStrategy(steps: ReasoningStep[], context: ReasoningContext): string {
    const totalSteps = steps.length;
    const avgDependencies = steps.reduce((sum, s) => sum + s.dependencies.length, 0) / totalSteps;

    if (avgDependencies < 1) {
      return 'parallel';
    }
    if (avgDependencies > 2) {
      return 'hierarchical';
    }
    if (totalSteps > 8) {
      return 'comprehensive';
    }
    return 'sequential';
  }

  private calculateCognitiveLoad(steps: ReasoningStep[], context: ReasoningContext): number {
    const baseLoad = 0.3;
    const stepLoad = Math.min(steps.length * 0.05, 0.4);
    const complexityLoad = context.complexity * 0.2;
    const dependencyLoad = steps.reduce((sum, s) => sum + s.dependencies.length, 0) * 0.02;

    return Math.min(baseLoad + stepLoad + complexityLoad + dependencyLoad, 1.0);
  }

  private async identifyBiases(steps: ReasoningStep[], context: ReasoningContext): Promise<string[]> {
    const biases: string[] = [];

    // Check for confirmation bias
    const validationRules = steps.flatMap(s => s.validationRules);
    if (!validationRules.includes('alternative-perspectives')) {
      biases.push('confirmation bias');
    }

    // Check for anchoring bias
    if (steps.length > 3 && steps[0].dependencies.length === 0) {
      biases.push('anchoring bias');
    }

    // Check for availability bias
    if (context.domain === 'general' && steps.length < 4) {
      biases.push('availability bias');
    }

    return biases;
  }

  private async suggestOptimizations(steps: ReasoningStep[], context: ReasoningContext): Promise<string[]> {
    const optimizations: string[] = [];

    // Suggest parallel processing
    const parallelizable = steps.filter(s => s.dependencies.length === 0);
    if (parallelizable.length > 2) {
      optimizations.push('Consider parallel processing for independent steps');
    }

    // Suggest step consolidation
    if (steps.length > 8) {
      optimizations.push('Consider consolidating related steps');
    }

    // Suggest caching
    const repeatedValidation = steps.filter(s => s.validationRules.includes('consistency'));
    if (repeatedValidation.length > 3) {
      optimizations.push('Cache consistency validation results');
    }

    return optimizations;
  }

  /**
     * Get reflection statistics
     */
  getReflectionStatistics(): {
        totalSessions: number;
        averageScore: number;
        mostCommonRecommendation: string;
        topInsightTypes: string[];
        learningPatterns: number;
        } {
    const totalSessions = this.reflectionHistory.length;
    const averageScore = totalSessions > 0 ?
      this.reflectionHistory.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions : 0;

    const recommendations = this.reflectionHistory.map(s => s.recommendation);
    const mostCommonRecommendation = this.getMostCommon(recommendations);

    const allInsights = this.reflectionHistory.flatMap(s => s.insights);
    const insightTypes = allInsights.map(i => i.type);
    const topInsightTypes = Array.from(new Set(insightTypes)).slice(0, 3);

    return {
      totalSessions,
      averageScore,
      mostCommonRecommendation,
      topInsightTypes,
      learningPatterns: this.learningPatterns.size
    };
  }

  private getMostCommon(arr: string[]): string {
    const counts = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
  }
}
