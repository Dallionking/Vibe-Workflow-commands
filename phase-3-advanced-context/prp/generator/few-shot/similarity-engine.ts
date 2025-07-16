/**
 * Similarity Engine for Few-shot Learning
 * Phase 3: Advanced Context Features - Tier 2.2
 *
 * Implements sophisticated similarity computation algorithms for intelligent
 * example selection and context-aware matching.
 */

import {
  SimilarityComputation,
  SimilarityMetrics,
  ExampleContext,
  ContextVector,
  FewShotExample
} from './interfaces';

export class SimilarityEngine implements SimilarityComputation {
  private contextVectorCache: Map<string, ContextVector> = new Map();
  private semanticCache: Map<string, number> = new Map();
  private domainHierarchy: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDomainHierarchy();
  }

  /**
     * Compute overall similarity between two examples
     */
  async computeOverallSimilarity(
    example1: FewShotExample,
    example2: FewShotExample,
    weights: { contextual: number; semantic: number; structural: number; functional: number; domain: number } =
    { contextual: 0.3, semantic: 0.25, structural: 0.2, functional: 0.15, domain: 0.1 }
  ): Promise<SimilarityMetrics> {
    console.log(`🔍 Computing similarity between examples ${example1.id} and ${example2.id}`);

    const contextual = this.computeContextualSimilarity(example1.context, example2.context);
    const semantic = await this.computeSemanticSimilarity(example1.input, example2.input);
    const structural = this.computeStructuralSimilarity(example1.reasoning, example2.reasoning);
    const functional = this.computeFunctionalSimilarity(
      example1.input, example1.output,
      example2.input, example2.output
    );
    const domain = this.computeDomainSimilarity(example1.context.domain, example2.context.domain);

    const overall = (
      contextual * weights.contextual +
            semantic * weights.semantic +
            structural * weights.structural +
            functional * weights.functional +
            domain * weights.domain
    );

    return {
      contextual,
      semantic,
      structural,
      functional,
      domain,
      overall
    };
  }

  /**
     * Compute contextual similarity between two contexts
     */
  computeContextualSimilarity(context1: ExampleContext, context2: ExampleContext): number {
    let similarity = 0;
    let totalWeight = 0;

    // Complexity similarity (30% weight)
    const complexityWeight = 0.3;
    const complexitySim = 1 - Math.abs(context1.complexity - context2.complexity);
    similarity += complexitySim * complexityWeight;
    totalWeight += complexityWeight;

    // Constraints similarity (20% weight)
    const constraintsWeight = 0.2;
    const constraintsSim = this.computeSetSimilarity(
      new Set(context1.constraints),
      new Set(context2.constraints)
    );
    similarity += constraintsSim * constraintsWeight;
    totalWeight += constraintsWeight;

    // Techniques similarity (20% weight)
    const techniquesWeight = 0.2;
    const techniquesSim = this.computeSetSimilarity(
      new Set(context1.techniques),
      new Set(context2.techniques)
    );
    similarity += techniquesSim * techniquesWeight;
    totalWeight += techniquesWeight;

    // Patterns similarity (15% weight)
    const patternsWeight = 0.15;
    const patternsSim = this.computeSetSimilarity(
      new Set(context1.patterns),
      new Set(context2.patterns)
    );
    similarity += patternsSim * patternsWeight;
    totalWeight += patternsWeight;

    // Objectives similarity (10% weight)
    const objectivesWeight = 0.1;
    const objectivesSim = this.computeSetSimilarity(
      new Set(context1.objectives),
      new Set(context2.objectives)
    );
    similarity += objectivesSim * objectivesWeight;
    totalWeight += objectivesWeight;

    // Resources similarity (5% weight)
    const resourcesWeight = 0.05;
    const resourcesSim = this.computeSetSimilarity(
      new Set(context1.resources),
      new Set(context2.resources)
    );
    similarity += resourcesSim * resourcesWeight;
    totalWeight += resourcesWeight;

    return similarity / totalWeight;
  }

  /**
     * Compute semantic similarity between two text strings
     */
  async computeSemanticSimilarity(text1: string, text2: string): Promise<number> {
    const cacheKey = `${text1}|||${text2}`;
    if (this.semanticCache.has(cacheKey)) {
      return this.semanticCache.get(cacheKey)!;
    }

    // Simple semantic similarity based on word overlap and structure
    const similarity = this.computeTextSimilarity(text1, text2);

    this.semanticCache.set(cacheKey, similarity);
    if (this.semanticCache.size > 1000) {
      // Clear oldest entries
      const entries = Array.from(this.semanticCache.entries());
      this.semanticCache.clear();
      entries.slice(-500).forEach(([key, value]) => {
        this.semanticCache.set(key, value);
      });
    }

    return similarity;
  }

  /**
     * Compute structural similarity between reasoning steps
     */
  computeStructuralSimilarity(reasoning1: string[], reasoning2: string[]): number {
    if (reasoning1.length === 0 && reasoning2.length === 0) {
      return 1.0;
    }
    if (reasoning1.length === 0 || reasoning2.length === 0) {
      return 0.0;
    }

    // Length similarity
    const lengthSim = 1 - Math.abs(reasoning1.length - reasoning2.length) /
                          Math.max(reasoning1.length, reasoning2.length);

    // Step-by-step similarity using dynamic programming
    const stepSim = this.computeSequenceSimilarity(reasoning1, reasoning2);

    // Pattern similarity
    const patternSim = this.computeReasoningPatternSimilarity(reasoning1, reasoning2);

    return (lengthSim * 0.3 + stepSim * 0.5 + patternSim * 0.2);
  }

  /**
     * Compute functional similarity between input-output pairs
     */
  computeFunctionalSimilarity(
    input1: string,
    output1: string,
    input2: string,
    output2: string
  ): number {
    // Input similarity
    const inputSim = this.computeTextSimilarity(input1, input2);

    // Output similarity
    const outputSim = this.computeTextSimilarity(output1, output2);

    // Transformation similarity (how similar the input->output transformation is)
    const transformSim = this.computeTransformationSimilarity(
      input1, output1,
      input2, output2
    );

    return (inputSim * 0.4 + outputSim * 0.4 + transformSim * 0.2);
  }

  /**
     * Compute domain similarity
     */
  computeDomainSimilarity(domain1: string, domain2: string): number {
    if (domain1 === domain2) {
      return 1.0;
    }

    // Check domain hierarchy
    const hierarchy1 = this.domainHierarchy.get(domain1) || [];
    const hierarchy2 = this.domainHierarchy.get(domain2) || [];

    // Find common ancestors
    const commonAncestors = hierarchy1.filter(h => hierarchy2.includes(h));

    if (commonAncestors.length > 0) {
      // Similarity based on hierarchy level
      const maxLevel = Math.max(hierarchy1.length, hierarchy2.length);
      const commonLevel = Math.max(...commonAncestors.map(a =>
        Math.min(hierarchy1.indexOf(a), hierarchy2.indexOf(a))
      ));
      return (maxLevel - commonLevel) / maxLevel;
    }

    // Fallback to string similarity
    return this.computeTextSimilarity(domain1, domain2);
  }

  /**
     * Create context vector for similarity computation
     */
  createContextVector(context: ExampleContext): ContextVector {
    const cacheKey = JSON.stringify(context);
    if (this.contextVectorCache.has(cacheKey)) {
      return this.contextVectorCache.get(cacheKey)!;
    }

    const features = new Map<string, number>();
    const weights = new Map<string, number>();

    // Add complexity feature
    features.set('complexity', context.complexity);
    weights.set('complexity', 0.3);

    // Add categorical features
    context.constraints.forEach((constraint, index) => {
      features.set(`constraint_${constraint}`, 1.0);
      weights.set(`constraint_${constraint}`, 0.2 / context.constraints.length);
    });

    context.techniques.forEach((technique, index) => {
      features.set(`technique_${technique}`, 1.0);
      weights.set(`technique_${technique}`, 0.2 / context.techniques.length);
    });

    context.patterns.forEach((pattern, index) => {
      features.set(`pattern_${pattern}`, 1.0);
      weights.set(`pattern_${pattern}`, 0.15 / context.patterns.length);
    });

    context.objectives.forEach((objective, index) => {
      features.set(`objective_${objective}`, 1.0);
      weights.set(`objective_${objective}`, 0.1 / context.objectives.length);
    });

    context.resources.forEach((resource, index) => {
      features.set(`resource_${resource}`, 1.0);
      weights.set(`resource_${resource}`, 0.05 / context.resources.length);
    });

    const vector: ContextVector = {
      features,
      weights,
      categories: [context.domain, ...context.patterns, ...context.techniques]
    };

    this.contextVectorCache.set(cacheKey, vector);
    return vector;
  }

  /**
     * Compute similarity between context vectors
     */
  computeVectorSimilarity(vector1: ContextVector, vector2: ContextVector): number {
    const allFeatures = new Set([
      ...vector1.features.keys(),
      ...vector2.features.keys()
    ]);

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const feature of allFeatures) {
      const value1 = vector1.features.get(feature) || 0;
      const value2 = vector2.features.get(feature) || 0;
      const weight = Math.max(
        vector1.weights.get(feature) || 0,
        vector2.weights.get(feature) || 0
      );

      const weightedValue1 = value1 * weight;
      const weightedValue2 = value2 * weight;

      dotProduct += weightedValue1 * weightedValue2;
      norm1 += weightedValue1 * weightedValue1;
      norm2 += weightedValue2 * weightedValue2;
    }

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Private helper methods
  private computeSetSimilarity(set1: Set<string>, set2: Set<string>): number {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    if (union.size === 0) {
      return 1.0;
    }
    return intersection.size / union.size;
  }

  public computeTextSimilarity(text1: string, text2: string): number {
    if (text1 === text2) {
      return 1.0;
    }
    if (!text1 || !text2) {
      return 0.0;
    }

    // Tokenize and normalize
    const tokens1 = this.tokenize(text1.toLowerCase());
    const tokens2 = this.tokenize(text2.toLowerCase());

    // Jaccard similarity
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    const jaccard = intersection.size / union.size;

    // Length similarity
    const lengthSim = 1 - Math.abs(text1.length - text2.length) /
                          Math.max(text1.length, text2.length);

    // Edit distance similarity
    const editSim = this.computeEditDistanceSimilarity(text1, text2);

    return (jaccard * 0.5 + lengthSim * 0.2 + editSim * 0.3);
  }

  private computeSequenceSimilarity(seq1: string[], seq2: string[]): number {
    const m = seq1.length;
    const n = seq2.length;

    if (m === 0 && n === 0) {
      return 1.0;
    }
    if (m === 0 || n === 0) {
      return 0.0;
    }

    // Dynamic programming for longest common subsequence
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (this.computeTextSimilarity(seq1[i - 1], seq2[j - 1]) > 0.7) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return (2 * dp[m][n]) / (m + n);
  }

  private computeReasoningPatternSimilarity(reasoning1: string[], reasoning2: string[]): number {
    // Extract reasoning patterns (e.g., "analyze -> synthesize -> conclude")
    const patterns1 = this.extractReasoningPatterns(reasoning1);
    const patterns2 = this.extractReasoningPatterns(reasoning2);

    return this.computeSetSimilarity(new Set(patterns1), new Set(patterns2));
  }

  private computeTransformationSimilarity(
    input1: string, output1: string,
    input2: string, output2: string
  ): number {
    // Analyze the type of transformation
    const transform1 = this.analyzeTransformation(input1, output1);
    const transform2 = this.analyzeTransformation(input2, output2);

    return this.computeSetSimilarity(new Set(transform1), new Set(transform2));
  }

  private computeEditDistanceSimilarity(text1: string, text2: string): number {
    const maxLen = Math.max(text1.length, text2.length);
    if (maxLen === 0) {
      return 1.0;
    }

    const distance = this.levenshteinDistance(text1, text2);
    return 1 - (distance / maxLen);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],     // deletion
            dp[i][j - 1],     // insertion
            dp[i - 1][j - 1]  // substitution
          );
        }
      }
    }

    return dp[m][n];
  }

  private tokenize(text: string): string[] {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  private extractReasoningPatterns(reasoning: string[]): string[] {
    const patterns: string[] = [];

    // Look for common reasoning patterns
    const keywordPatterns = [
      'analyze', 'synthesize', 'evaluate', 'compare', 'contrast',
      'deduce', 'infer', 'conclude', 'hypothesize', 'verify'
    ];

    reasoning.forEach(step => {
      const stepLower = step.toLowerCase();
      keywordPatterns.forEach(pattern => {
        if (stepLower.includes(pattern)) {
          patterns.push(pattern);
        }
      });
    });

    return patterns;
  }

  private analyzeTransformation(input: string, output: string): string[] {
    const transformations: string[] = [];

    const inputLen = input.length;
    const outputLen = output.length;

    if (outputLen > inputLen * 1.5) {
      transformations.push('expansion');
    } else if (outputLen < inputLen * 0.5) {
      transformations.push('compression');
    } else {
      transformations.push('refinement');
    }

    // Analyze content transformation
    if (output.includes('solution') || output.includes('answer')) {
      transformations.push('solution_generation');
    }

    if (output.includes('analysis') || output.includes('breakdown')) {
      transformations.push('analysis');
    }

    if (output.includes('synthesis') || output.includes('combination')) {
      transformations.push('synthesis');
    }

    return transformations;
  }

  private initializeDomainHierarchy(): void {
    // Define domain hierarchy for similarity computation
    this.domainHierarchy.set('mathematics', ['stem', 'quantitative']);
    this.domainHierarchy.set('physics', ['stem', 'quantitative', 'science']);
    this.domainHierarchy.set('chemistry', ['stem', 'quantitative', 'science']);
    this.domainHierarchy.set('biology', ['stem', 'science']);
    this.domainHierarchy.set('engineering', ['stem', 'quantitative', 'applied']);
    this.domainHierarchy.set('computer-science', ['stem', 'quantitative', 'applied']);
    this.domainHierarchy.set('data-science', ['stem', 'quantitative', 'applied']);
    this.domainHierarchy.set('statistics', ['stem', 'quantitative']);
    this.domainHierarchy.set('economics', ['social-science', 'quantitative']);
    this.domainHierarchy.set('psychology', ['social-science']);
    this.domainHierarchy.set('sociology', ['social-science']);
    this.domainHierarchy.set('philosophy', ['humanities']);
    this.domainHierarchy.set('literature', ['humanities']);
    this.domainHierarchy.set('history', ['humanities']);
    this.domainHierarchy.set('business', ['applied', 'management']);
    this.domainHierarchy.set('marketing', ['applied', 'management']);
    this.domainHierarchy.set('finance', ['applied', 'quantitative']);
    this.domainHierarchy.set('law', ['applied']);
    this.domainHierarchy.set('medicine', ['applied', 'science']);
    this.domainHierarchy.set('general', []);
  }

  /**
     * Get similarity statistics
     */
  getStatistics(): {
        cacheSize: number;
        semanticCacheHits: number;
        contextVectorCacheHits: number;
        averageComputationTime: number;
        } {
    return {
      cacheSize: this.semanticCache.size + this.contextVectorCache.size,
      semanticCacheHits: this.semanticCache.size,
      contextVectorCacheHits: this.contextVectorCache.size,
      averageComputationTime: 0 // Would be tracked with timing instrumentation
    };
  }

  /**
     * Clear caches
     */
  clearCaches(): void {
    this.semanticCache.clear();
    this.contextVectorCache.clear();
    console.log('🗑️  Similarity engine caches cleared');
  }
}
