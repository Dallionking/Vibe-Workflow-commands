/**
 * Example Matcher for Few-shot Learning
 * Phase 3: Advanced Context Features - Tier 2.2
 *
 * Implements intelligent example matching and selection algorithms for
 * context-aware few-shot learning in the PRP system.
 */

import {
  ExampleMatcher,
  ExampleMatch,
  ExampleSelection,
  FewShotExample,
  SelectionCriteria,
  SimilarityMetrics,
  ExampleRepository
} from './interfaces';

import { ReasoningContext } from '../chain-of-thought/reasoning-chain';
import { SimilarityEngine } from './similarity-engine';

export class IntelligentExampleMatcher implements ExampleMatcher {
  private similarityEngine: SimilarityEngine;
  private repository: ExampleRepository;
  private matchingHistory: Map<string, ExampleMatch[]> = new Map();
  private performanceMetrics: Map<string, { accuracy: number; latency: number }> = new Map();

  constructor(repository: ExampleRepository) {
    this.similarityEngine = new SimilarityEngine();
    this.repository = repository;
  }

  /**
     * Find similar examples based on target context and input
     */
  async findSimilarExamples(
    targetContext: ReasoningContext,
    targetInput: string,
    criteria: SelectionCriteria
  ): Promise<ExampleMatch[]> {
    console.log(`🔍 Finding similar examples for domain: ${targetContext.domain}`);
    const startTime = Date.now();

    // Convert reasoning context to example context
    const exampleContext = this.convertToExampleContext(targetContext);

    // Get candidate examples using efficient filtering
    const candidates = this.getCandidateExamples(exampleContext, criteria);
    console.log(`📋 Found ${candidates.length} candidate examples`);

    // Compute similarity for each candidate
    const matches: ExampleMatch[] = [];

    for (const candidate of candidates) {
      const similarity = await this.computeExampleSimilarity(
        exampleContext,
        targetInput,
        candidate,
        criteria
      );

      if (similarity.overall >= criteria.minSimilarity) {
        const match = await this.createExampleMatch(
          candidate,
          similarity,
          exampleContext,
          targetInput,
          criteria
        );
        matches.push(match);
      }
    }

    // Sort by relevance score
    matches.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const latency = Date.now() - startTime;
    this.recordPerformanceMetrics(targetContext.domain, matches.length, latency);

    console.log(`✅ Found ${matches.length} similar examples in ${latency}ms`);
    return matches.slice(0, criteria.maxExamples * 2); // Return extra for ranking
  }

  /**
     * Rank examples based on multiple criteria
     */
  rankExamples(examples: ExampleMatch[], criteria: SelectionCriteria): ExampleMatch[] {
    console.log(`📊 Ranking ${examples.length} examples`);

    return examples
      .map(example => this.calculateRankingScore(example, criteria))
      .sort((a, b) => b.rankingScore - a.rankingScore)
      .map(({ example }) => example);
  }

  /**
     * Select diverse set of examples
     */
  selectDiverseSet(
    rankedExamples: ExampleMatch[],
    maxExamples: number,
    diversityWeight: number
  ): ExampleSelection {
    console.log(`🎯 Selecting diverse set of ${maxExamples} examples from ${rankedExamples.length} candidates`);

    if (rankedExamples.length <= maxExamples) {
      return this.createExampleSelection(rankedExamples, rankedExamples.length, {
        maxExamples,
        diversityWeight,
        minSimilarity: 0,
        qualityThreshold: 0,
        qualityWeight: 0,
        recencyWeight: 0,
        domainRelevance: 0,
        complexityMatch: 0,
        enableAdaptation: false
      });
    }

    const selectedExamples: ExampleMatch[] = [];
    const remainingExamples = [...rankedExamples];

    // Select first example (highest ranked)
    selectedExamples.push(remainingExamples.shift()!);

    // Select remaining examples balancing quality and diversity
    while (selectedExamples.length < maxExamples && remainingExamples.length > 0) {
      const nextExample = this.selectNextDiverseExample(
        selectedExamples,
        remainingExamples,
        diversityWeight
      );

      selectedExamples.push(nextExample);
      const index = remainingExamples.indexOf(nextExample);
      remainingExamples.splice(index, 1);
    }

    return this.createExampleSelection(selectedExamples, rankedExamples.length, {
      maxExamples,
      diversityWeight,
      minSimilarity: 0,
      qualityThreshold: 0,
      qualityWeight: 0,
      recencyWeight: 0,
      domainRelevance: 0,
      complexityMatch: 0,
      enableAdaptation: false
    });
  }

  /**
     * Find examples by pattern matching
     */
  async findExamplesByPattern(
    pattern: string,
    domain?: string,
    maxResults: number = 10
  ): Promise<ExampleMatch[]> {
    console.log(`🔍 Finding examples by pattern: ${pattern}`);

    const matches: ExampleMatch[] = [];
    const examples = domain
      ? Array.from(this.repository.indices.byDomain.get(domain) || [])
        .map(id => this.repository.examples.get(id)!)
        .filter(Boolean)
      : Array.from(this.repository.examples.values());

    for (const example of examples) {
      if (this.matchesPattern(example, pattern)) {
        const patternSimilarity: SimilarityMetrics = {
          contextual: 0.8,
          semantic: this.computePatternSemanticSimilarity(example, pattern),
          structural: 0.7,
          functional: 0.6,
          domain: domain === example.context.domain ? 1.0 : 0.5,
          overall: 0.7
        };

        const match: ExampleMatch = {
          example,
          similarity: patternSimilarity,
          relevanceScore: patternSimilarity.overall,
          confidence: 0.8,
          reasons: [`Matches pattern: ${pattern}`],
          adaptations: []
        };

        matches.push(match);
      }
    }

    return matches
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
     * Get examples for specific learning objective
     */
  async getExamplesForLearningObjective(
    objective: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    maxResults: number = 5
  ): Promise<ExampleMatch[]> {
    console.log(`🎯 Finding examples for learning objective: ${objective} (${difficulty})`);

    const matches: ExampleMatch[] = [];

    for (const [id, example] of this.repository.examples) {
      if (example.difficulty === difficulty &&
                example.metadata.learningObjectives.some(obj =>
                  obj.toLowerCase().includes(objective.toLowerCase())
                )) {

        const similarity: SimilarityMetrics = {
          contextual: 0.9,
          semantic: 0.8,
          structural: 0.7,
          functional: 0.8,
          domain: 0.9,
          overall: 0.84
        };

        const match: ExampleMatch = {
          example,
          similarity,
          relevanceScore: similarity.overall * example.quality.overall,
          confidence: 0.9,
          reasons: [`Matches learning objective: ${objective}`, `Appropriate difficulty: ${difficulty}`],
          adaptations: []
        };

        matches.push(match);
      }
    }

    return matches
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  // Private helper methods
  private convertToExampleContext(reasoningContext: ReasoningContext): any {
    return {
      domain: reasoningContext.domain,
      complexity: reasoningContext.complexity,
      constraints: reasoningContext.constraints,
      techniques: reasoningContext.metadata.techniques || [],
      patterns: reasoningContext.metadata.patterns || [],
      objectives: reasoningContext.metadata.objectives || [],
      resources: reasoningContext.metadata.resources || []
    };
  }

  private getCandidateExamples(
    targetContext: any,
    criteria: SelectionCriteria
  ): FewShotExample[] {
    const candidates: FewShotExample[] = [];

    // Start with domain-specific examples
    const domainExamples = this.repository.indices.byDomain.get(targetContext.domain) || new Set();
    domainExamples.forEach(id => {
      const example = this.repository.examples.get(id);
      if (example) {
        candidates.push(example);
      }
    });

    // Add examples from related domains if we need more
    if (candidates.length < criteria.maxExamples * 3) {
      // Add general domain examples
      const generalExamples = this.repository.indices.byDomain.get('general') || new Set();
      generalExamples.forEach(id => {
        const example = this.repository.examples.get(id);
        if (example && !candidates.some(c => c.id === example.id)) {
          candidates.push(example);
        }
      });
    }

    // Filter by quality threshold
    return candidates.filter(example =>
      example.quality.overall >= criteria.qualityThreshold
    );
  }

  private async computeExampleSimilarity(
    targetContext: any,
    targetInput: string,
    candidate: FewShotExample,
    criteria: SelectionCriteria
  ): Promise<SimilarityMetrics> {
    // Create a mock example for the target
    const targetExample: FewShotExample = {
      id: 'target',
      context: targetContext,
      input: targetInput,
      output: '',
      reasoning: [],
      metadata: {
        createdAt: new Date(),
        usageCount: 0,
        successRate: 0,
        averageRating: 0,
        source: 'target',
        verified: false,
        learningObjectives: []
      },
      quality: {
        clarity: 0,
        completeness: 0,
        accuracy: 0,
        relevance: 0,
        effectiveness: 0,
        overall: 0
      },
      tags: [],
      category: '',
      difficulty: 'intermediate'
    };

    return await this.similarityEngine.computeOverallSimilarity(targetExample, candidate);
  }

  private async createExampleMatch(
    example: FewShotExample,
    similarity: SimilarityMetrics,
    targetContext: any,
    targetInput: string,
    criteria: SelectionCriteria
  ): Promise<ExampleMatch> {
    // Calculate relevance score
    const relevanceScore = this.calculateRelevanceScore(
      similarity,
      example.quality,
      example.metadata,
      criteria
    );

    // Calculate confidence
    const confidence = this.calculateMatchConfidence(similarity, example);

    // Generate reasons
    const reasons = this.generateMatchReasons(similarity, example, targetContext);

    // Generate adaptations if enabled
    const adaptations = criteria.enableAdaptation
      ? this.generateAdaptationSuggestions(example, targetContext, targetInput)
      : [];

    return {
      example,
      similarity,
      relevanceScore,
      confidence,
      reasons,
      adaptations
    };
  }

  private calculateRelevanceScore(
    similarity: SimilarityMetrics,
    quality: any,
    metadata: any,
    criteria: SelectionCriteria
  ): number {
    const similarityScore = similarity.overall * 0.4;
    const qualityScore = quality.overall * criteria.qualityWeight;
    const recencyScore = this.calculateRecencyScore(metadata.lastUsed) * criteria.recencyWeight;
    const usageScore = Math.min(metadata.successRate, 1.0) * 0.1;

    return similarityScore + qualityScore + recencyScore + usageScore;
  }

  private calculateMatchConfidence(similarity: SimilarityMetrics, example: FewShotExample): number {
    const baseConfidence = similarity.overall;
    const qualityBoost = example.quality.overall * 0.2;
    const verificationBoost = example.metadata.verified ? 0.1 : 0;
    const usageBoost = Math.min(example.metadata.usageCount / 100, 0.1);

    return Math.min(baseConfidence + qualityBoost + verificationBoost + usageBoost, 1.0);
  }

  private generateMatchReasons(
    similarity: SimilarityMetrics,
    example: FewShotExample,
    targetContext: any
  ): string[] {
    const reasons: string[] = [];

    if (similarity.domain > 0.8) {
      reasons.push(`Strong domain match (${example.context.domain})`);
    }

    if (similarity.contextual > 0.7) {
      reasons.push('Similar context and constraints');
    }

    if (similarity.semantic > 0.7) {
      reasons.push('Semantically similar input');
    }

    if (similarity.structural > 0.7) {
      reasons.push('Similar reasoning structure');
    }

    if (example.quality.overall > 0.8) {
      reasons.push('High quality example');
    }

    if (example.metadata.verified) {
      reasons.push('Verified example');
    }

    const complexityDiff = Math.abs(example.context.complexity - targetContext.complexity);
    if (complexityDiff < 0.2) {
      reasons.push('Similar complexity level');
    }

    return reasons;
  }

  private generateAdaptationSuggestions(
    example: FewShotExample,
    targetContext: any,
    targetInput: string
  ): string[] {
    const adaptations: string[] = [];

    // Domain adaptation
    if (example.context.domain !== targetContext.domain) {
      adaptations.push(`Adapt from ${example.context.domain} to ${targetContext.domain} context`);
    }

    // Complexity adaptation
    const complexityDiff = targetContext.complexity - example.context.complexity;
    if (complexityDiff > 0.2) {
      adaptations.push('Increase reasoning depth and detail');
    } else if (complexityDiff < -0.2) {
      adaptations.push('Simplify reasoning steps');
    }

    // Constraint adaptation
    const newConstraints = targetContext.constraints.filter(
      (c: string) => !example.context.constraints.includes(c)
    );
    if (newConstraints.length > 0) {
      adaptations.push(`Add consideration for: ${newConstraints.join(', ')}`);
    }

    return adaptations;
  }

  private calculateRankingScore(
    exampleMatch: ExampleMatch,
    criteria: SelectionCriteria
  ): { example: ExampleMatch; rankingScore: number } {
    const { similarity, example } = exampleMatch;

    let score = similarity.overall * 0.4;
    score += example.quality.overall * criteria.qualityWeight;
    score += this.calculateRecencyScore(example.metadata.lastUsed) * criteria.recencyWeight;
    score += (example.metadata.successRate || 0) * 0.1;

    // Penalize overused examples
    const usagePenalty = Math.min(example.metadata.usageCount / 1000, 0.2);
    score -= usagePenalty;

    return { example: exampleMatch, rankingScore: score };
  }

  private selectNextDiverseExample(
    selectedExamples: ExampleMatch[],
    remainingExamples: ExampleMatch[],
    diversityWeight: number
  ): ExampleMatch {
    let bestExample = remainingExamples[0];
    let bestScore = -1;

    for (const candidate of remainingExamples) {
      const qualityScore = candidate.relevanceScore * (1 - diversityWeight);
      const diversityScore = this.calculateDiversityScore(candidate, selectedExamples) * diversityWeight;
      const totalScore = qualityScore + diversityScore;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestExample = candidate;
      }
    }

    return bestExample;
  }

  private calculateDiversityScore(
    candidate: ExampleMatch,
    selectedExamples: ExampleMatch[]
  ): number {
    if (selectedExamples.length === 0) {
      return 1.0;
    }

    let minDistance = Infinity;

    for (const selected of selectedExamples) {
      const distance = this.calculateExampleDistance(candidate, selected);
      minDistance = Math.min(minDistance, distance);
    }

    return Math.min(minDistance, 1.0);
  }

  private calculateExampleDistance(example1: ExampleMatch, example2: ExampleMatch): number {
    // Calculate distance based on multiple factors
    const domainDistance = example1.example.context.domain === example2.example.context.domain ? 0 : 1;
    const categoryDistance = example1.example.category === example2.example.category ? 0 : 1;
    const complexityDistance = Math.abs(
      example1.example.context.complexity - example2.example.context.complexity
    );
    const difficultyDistance = this.getDifficultyDistance(
      example1.example.difficulty,
      example2.example.difficulty
    );

    return (domainDistance * 0.3 + categoryDistance * 0.2 +
                complexityDistance * 0.3 + difficultyDistance * 0.2);
  }

  private getDifficultyDistance(diff1: string, diff2: string): number {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const index1 = levels.indexOf(diff1);
    const index2 = levels.indexOf(diff2);
    return Math.abs(index1 - index2) / (levels.length - 1);
  }

  private createExampleSelection(
    selectedExamples: ExampleMatch[],
    totalCandidates: number,
    criteria: SelectionCriteria
  ): ExampleSelection {
    const diversityScore = this.calculateSelectionDiversity(selectedExamples);
    const coverageScore = this.calculateSelectionCoverage(selectedExamples);
    const qualityScore = this.calculateSelectionQuality(selectedExamples);
    const recommendations = this.generateSelectionRecommendations(
      selectedExamples,
      diversityScore,
      coverageScore,
      qualityScore
    );

    return {
      selectedExamples,
      totalCandidates,
      selectionCriteria: criteria,
      diversityScore,
      coverageScore,
      qualityScore,
      recommendations
    };
  }

  private calculateSelectionDiversity(examples: ExampleMatch[]): number {
    if (examples.length <= 1) {
      return 1.0;
    }

    let totalDistance = 0;
    let pairCount = 0;

    for (let i = 0; i < examples.length; i++) {
      for (let j = i + 1; j < examples.length; j++) {
        totalDistance += this.calculateExampleDistance(examples[i], examples[j]);
        pairCount++;
      }
    }

    return pairCount > 0 ? totalDistance / pairCount : 0;
  }

  private calculateSelectionCoverage(examples: ExampleMatch[]): number {
    const domains = new Set(examples.map(e => e.example.context.domain));
    const categories = new Set(examples.map(e => e.example.category));
    const difficulties = new Set(examples.map(e => e.example.difficulty));

    // Normalize by expected variety
    const domainCoverage = Math.min(domains.size / 3, 1.0);
    const categoryCoverage = Math.min(categories.size / 5, 1.0);
    const difficultyCoverage = Math.min(difficulties.size / 4, 1.0);

    return (domainCoverage + categoryCoverage + difficultyCoverage) / 3;
  }

  private calculateSelectionQuality(examples: ExampleMatch[]): number {
    if (examples.length === 0) {
      return 0;
    }

    const totalQuality = examples.reduce((sum, example) =>
      sum + example.example.quality.overall, 0
    );

    return totalQuality / examples.length;
  }

  private generateSelectionRecommendations(
    examples: ExampleMatch[],
    diversityScore: number,
    coverageScore: number,
    qualityScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (diversityScore < 0.5) {
      recommendations.push('Consider adding more diverse examples from different domains or categories');
    }

    if (coverageScore < 0.6) {
      recommendations.push('Add examples covering more difficulty levels or problem types');
    }

    if (qualityScore < 0.7) {
      recommendations.push('Include higher quality examples with better ratings');
    }

    if (examples.length < 3) {
      recommendations.push('Consider adding more examples for better coverage');
    }

    const verifiedCount = examples.filter(e => e.example.metadata.verified).length;
    if (verifiedCount / examples.length < 0.5) {
      recommendations.push('Include more verified examples for reliability');
    }

    return recommendations;
  }

  private calculateRecencyScore(lastUsed?: Date): number {
    if (!lastUsed) {
      return 0.5;
    }

    const daysSinceUsed = (Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUsed < 7) {
      return 1.0;
    }
    if (daysSinceUsed < 30) {
      return 0.8;
    }
    if (daysSinceUsed < 90) {
      return 0.6;
    }
    if (daysSinceUsed < 365) {
      return 0.4;
    }
    return 0.2;
  }

  private matchesPattern(example: FewShotExample, pattern: string): boolean {
    const patternLower = pattern.toLowerCase();

    return (
      example.input.toLowerCase().includes(patternLower) ||
            example.output.toLowerCase().includes(patternLower) ||
            example.reasoning.some(step => step.toLowerCase().includes(patternLower)) ||
            example.tags.some(tag => tag.toLowerCase().includes(patternLower)) ||
            example.context.patterns.some(p => p.toLowerCase().includes(patternLower))
    );
  }

  private computePatternSemanticSimilarity(example: FewShotExample, pattern: string): number {
    // Simple pattern matching similarity
    const text = `${example.input} ${example.output} ${example.reasoning.join(' ')}`;
    return this.similarityEngine.computeTextSimilarity(text.toLowerCase(), pattern.toLowerCase());
  }

  private recordPerformanceMetrics(domain: string, resultCount: number, latency: number): void {
    const existing = this.performanceMetrics.get(domain) || { accuracy: 0, latency: 0 };
    const accuracy = resultCount > 0 ? 1.0 : 0.0; // Simplified accuracy metric

    this.performanceMetrics.set(domain, {
      accuracy: (existing.accuracy * 0.9 + accuracy * 0.1),
      latency: (existing.latency * 0.9 + latency * 0.1)
    });
  }

  /**
     * Get matching statistics
     */
  getMatchingStatistics(): {
        totalMatches: number;
        averageLatency: number;
        cacheHitRate: number;
        domainPerformance: Map<string, { accuracy: number; latency: number }>;
        } {
    const totalMatches = this.matchingHistory.size;
    const averageLatency = Array.from(this.performanceMetrics.values())
      .reduce((sum, metric) => sum + metric.latency, 0) / this.performanceMetrics.size || 0;

    return {
      totalMatches,
      averageLatency,
      cacheHitRate: 0, // Would be calculated from actual cache metrics
      domainPerformance: new Map(this.performanceMetrics)
    };
  }

  /**
     * Clear matching history
     */
  clearHistory(): void {
    this.matchingHistory.clear();
    this.performanceMetrics.clear();
    console.log('🗑️  Example matcher history cleared');
  }
}
