/**
 * Example Pattern Library
 * Phase 3: Advanced Context Features - Tier 3.1
 *
 * Comprehensive library of example patterns for PRP phase generation,
 * with intelligent matching, similarity scoring, and pattern evolution.
 */

import { ExamplePattern } from './prp-phase-generator';

export interface PatternLibraryConfig {
    maxPatterns: number;
    similarityThreshold: number;
    autoCleanup: boolean;
    patternCategories: string[];
    enableLearning: boolean;
    cacheTTL: number;
}

export interface PatternSearchCriteria {
    query: string;
    category?: string;
    domain?: string;
    complexity?: 'low' | 'medium' | 'high';
    maxExamples: number;
    minSimilarity: number;
    includeMetadata?: boolean;
}

export interface PatternMatchResult {
    pattern: ExamplePattern;
    similarity: number;
    relevance: number;
    confidence: number;
    matchReasons: string[];
    adaptationSuggestions: string[];
}

export interface PatternSearchResult {
    query: string;
    results: PatternMatchResult[];
    totalMatches: number;
    searchTime: number;
    recommendations: PatternRecommendation[];
}

export interface PatternRecommendation {
    type: 'similar' | 'complement' | 'alternative';
    pattern: ExamplePattern;
    reason: string;
    confidence: number;
}

export interface PatternEvolution {
    patternId: string;
    usageCount: number;
    lastUsed: Date;
    adaptations: PatternAdaptation[];
    successRate: number;
    feedbackScore: number;
}

export interface PatternAdaptation {
    id: string;
    adaptedFrom: string;
    changes: string[];
    success: boolean;
    context: string;
    timestamp: Date;
}

export interface PatternAnalytics {
    totalPatterns: number;
    categoryDistribution: Record<string, number>;
    usageStatistics: Record<string, number>;
    qualityMetrics: PatternQualityMetrics;
    popularPatterns: ExamplePattern[];
    improvementSuggestions: string[];
}

export interface PatternQualityMetrics {
    averageQuality: number;
    qualityDistribution: Record<string, number>;
    completenessScore: number;
    diversityScore: number;
    recencyScore: number;
}

export class ExamplePatternLibrary {
  private patterns: Map<string, ExamplePattern> = new Map();
  private patternEvolution: Map<string, PatternEvolution> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();
  private domainIndex: Map<string, Set<string>> = new Map();
  private similarityCache: Map<string, PatternMatchResult[]> = new Map();
  private config: PatternLibraryConfig;

  constructor(config: Partial<PatternLibraryConfig> = {}) {
    this.config = {
      maxPatterns: config.maxPatterns || 1000,
      similarityThreshold: config.similarityThreshold || 0.6,
      autoCleanup: config.autoCleanup || true,
      patternCategories: config.patternCategories || [
        'implementation', 'validation', 'testing', 'documentation',
        'architecture', 'design', 'deployment', 'monitoring'
      ],
      enableLearning: config.enableLearning || true,
      cacheTTL: config.cacheTTL || 3600000 // 1 hour
    };

    this.initializePatternLibrary();
    console.log('📚 Example Pattern Library initialized');
  }

  /**
     * Find similar examples based on criteria
     */
  async findSimilarExamples(
    query: string,
    criteria: Partial<PatternSearchCriteria>
  ): Promise<ExamplePattern[]> {
    console.log(`🔍 Searching for similar examples: "${query}"`);

    const searchCriteria: PatternSearchCriteria = {
      query,
      maxExamples: criteria.maxExamples || 5,
      minSimilarity: criteria.minSimilarity || this.config.similarityThreshold,
      category: criteria.category,
      domain: criteria.domain,
      complexity: criteria.complexity,
      includeMetadata: criteria.includeMetadata || false
    };

    const startTime = Date.now();

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(searchCriteria);
      if (this.similarityCache.has(cacheKey)) {
        console.log('⚡ Using cached search results');
        const cachedResults = this.similarityCache.get(cacheKey)!;
        return cachedResults.map(r => r.pattern);
      }

      // Find candidate patterns
      const candidates = await this.findCandidatePatterns(searchCriteria);

      // Calculate similarity scores
      const matchResults = await this.calculateSimilarityScores(
        query,
        candidates,
        searchCriteria
      );

      // Filter by similarity threshold
      const filteredResults = matchResults.filter(
        result => result.similarity >= searchCriteria.minSimilarity
      );

      // Sort by relevance and similarity
      filteredResults.sort((a, b) => {
        const aScore = a.similarity * 0.6 + a.relevance * 0.4;
        const bScore = b.similarity * 0.6 + b.relevance * 0.4;
        return bScore - aScore;
      });

      // Take top results
      const topResults = filteredResults.slice(0, searchCriteria.maxExamples);

      // Cache results
      this.similarityCache.set(cacheKey, topResults);

      // Update pattern usage
      if (this.config.enableLearning) {
        await this.updatePatternUsage(topResults.map(r => r.pattern.id));
      }

      const searchTime = Date.now() - startTime;
      console.log(`✅ Found ${topResults.length} similar examples in ${searchTime}ms`);

      return topResults.map(result => result.pattern);

    } catch (error) {
      console.error(`❌ Pattern search failed: ${error}`);
      return [];
    }
  }

  /**
     * Add new pattern to library
     */
  async addPattern(pattern: ExamplePattern): Promise<boolean> {
    console.log(`➕ Adding pattern: ${pattern.name}`);

    try {
      // Validate pattern
      const validationResult = await this.validatePattern(pattern);
      if (!validationResult.valid) {
        console.warn(`⚠️ Pattern validation failed: ${validationResult.errors.join(', ')}`);
        return false;
      }

      // Check for duplicates
      const existingPattern = await this.findDuplicatePattern(pattern);
      if (existingPattern) {
        console.warn(`⚠️ Similar pattern already exists: ${existingPattern.id}`);
        return false;
      }

      // Check capacity
      if (this.patterns.size >= this.config.maxPatterns) {
        if (this.config.autoCleanup) {
          await this.cleanupOldPatterns();
        } else {
          console.warn('⚠️ Pattern library at capacity');
          return false;
        }
      }

      // Add to library
      this.patterns.set(pattern.id, pattern);

      // Update indices
      await this.updateIndices(pattern);

      // Initialize evolution tracking
      if (this.config.enableLearning) {
        this.patternEvolution.set(pattern.id, {
          patternId: pattern.id,
          usageCount: 0,
          lastUsed: new Date(),
          adaptations: [],
          successRate: 0,
          feedbackScore: 0
        });
      }

      console.log(`✅ Pattern added successfully: ${pattern.id}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to add pattern: ${error}`);
      return false;
    }
  }

  /**
     * Update existing pattern
     */
  async updatePattern(
    patternId: string,
    updates: Partial<ExamplePattern>
  ): Promise<boolean> {
    console.log(`🔄 Updating pattern: ${patternId}`);

    try {
      const existingPattern = this.patterns.get(patternId);
      if (!existingPattern) {
        console.warn(`⚠️ Pattern not found: ${patternId}`);
        return false;
      }

      // Create updated pattern
      const updatedPattern: ExamplePattern = {
        ...existingPattern,
        ...updates
      };

      // Validate updated pattern
      const validationResult = await this.validatePattern(updatedPattern);
      if (!validationResult.valid) {
        console.warn(`⚠️ Updated pattern validation failed: ${validationResult.errors.join(', ')}`);
        return false;
      }

      // Update in library
      this.patterns.set(patternId, updatedPattern);

      // Update indices
      await this.updateIndices(updatedPattern);

      // Clear related cache entries
      this.clearRelatedCache(patternId);

      console.log(`✅ Pattern updated successfully: ${patternId}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to update pattern: ${error}`);
      return false;
    }
  }

  /**
     * Remove pattern from library
     */
  async removePattern(patternId: string): Promise<boolean> {
    console.log(`🗑️ Removing pattern: ${patternId}`);

    try {
      const pattern = this.patterns.get(patternId);
      if (!pattern) {
        console.warn(`⚠️ Pattern not found: ${patternId}`);
        return false;
      }

      // Remove from library
      this.patterns.delete(patternId);

      // Remove from indices
      await this.removeFromIndices(pattern);

      // Remove evolution tracking
      this.patternEvolution.delete(patternId);

      // Clear related cache entries
      this.clearRelatedCache(patternId);

      console.log(`✅ Pattern removed successfully: ${patternId}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to remove pattern: ${error}`);
      return false;
    }
  }

  /**
     * Get pattern analytics
     */
  getAnalytics(): PatternAnalytics {
    const totalPatterns = this.patterns.size;
    const categoryDistribution: Record<string, number> = {};
    const usageStatistics: Record<string, number> = {};
    const qualityScores: number[] = [];

    // Calculate distributions
    for (const pattern of this.patterns.values()) {
      const category = pattern.metadata.domain;
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
      qualityScores.push(pattern.quality);
    }

    // Calculate usage statistics
    for (const evolution of this.patternEvolution.values()) {
      const patternId = evolution.patternId;
      usageStatistics[patternId] = evolution.usageCount;
    }

    // Calculate quality metrics
    const qualityMetrics: PatternQualityMetrics = {
      averageQuality: qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length || 0,
      qualityDistribution: this.calculateQualityDistribution(qualityScores),
      completenessScore: this.calculateCompletenessScore(),
      diversityScore: this.calculateDiversityScore(),
      recencyScore: this.calculateRecencyScore()
    };

    // Get popular patterns
    const popularPatterns = this.getPopularPatterns(5);

    return {
      totalPatterns,
      categoryDistribution,
      usageStatistics,
      qualityMetrics,
      popularPatterns,
      improvementSuggestions: this.generateImprovementSuggestions()
    };
  }

  /**
     * Export patterns for backup
     */
  exportPatterns(): { patterns: ExamplePattern[]; evolution: PatternEvolution[] } {
    return {
      patterns: Array.from(this.patterns.values()),
      evolution: Array.from(this.patternEvolution.values())
    };
  }

  /**
     * Import patterns from backup
     */
  async importPatterns(data: {
        patterns: ExamplePattern[];
        evolution: PatternEvolution[];
    }): Promise<boolean> {
    console.log(`📥 Importing ${data.patterns.length} patterns`);

    try {
      // Clear existing data
      this.patterns.clear();
      this.patternEvolution.clear();
      this.categoryIndex.clear();
      this.domainIndex.clear();
      this.similarityCache.clear();

      // Import patterns
      for (const pattern of data.patterns) {
        await this.addPattern(pattern);
      }

      // Import evolution data
      for (const evolution of data.evolution) {
        this.patternEvolution.set(evolution.patternId, evolution);
      }

      console.log(`✅ Successfully imported ${data.patterns.length} patterns`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to import patterns: ${error}`);
      return false;
    }
  }

  // Private methods
  private initializePatternLibrary(): void {
    // Initialize with basic patterns
    this.addBasicPatterns();

    // Setup periodic cleanup
    if (this.config.autoCleanup) {
      setInterval(() => {
        this.cleanupOldPatterns();
        this.cleanupCache();
      }, this.config.cacheTTL);
    }
  }

  private async addBasicPatterns(): Promise<void> {
    const basicPatterns: ExamplePattern[] = [
      {
        id: 'basic_implementation',
        name: 'Basic Implementation Pattern',
        description: 'Standard implementation approach with validation',
        input: { type: 'implementation', complexity: 'medium' },
        output: { success: true, validated: true },
        context: 'General implementation context',
        quality: 0.8,
        metadata: {
          domain: 'implementation',
          complexity: 1,
          recency: 0.9,
          usage: 0
        }
      },
      {
        id: 'validation_checkpoint',
        name: 'Validation Checkpoint Pattern',
        description: 'Systematic validation with quality gates',
        input: { type: 'validation', requirements: ['completeness', 'accuracy'] },
        output: { validated: true, score: 0.95 },
        context: 'Quality assurance context',
        quality: 0.9,
        metadata: {
          domain: 'validation',
          complexity: 0.7,
          recency: 0.8,
          usage: 0
        }
      },
      {
        id: 'testing_framework',
        name: 'Testing Framework Pattern',
        description: 'Comprehensive testing with coverage analysis',
        input: { type: 'testing', coverage: 0.95 },
        output: { passed: true, coverage: 0.98 },
        context: 'Testing and quality assurance',
        quality: 0.85,
        metadata: {
          domain: 'testing',
          complexity: 0.8,
          recency: 0.7,
          usage: 0
        }
      }
    ];

    for (const pattern of basicPatterns) {
      await this.addPattern(pattern);
    }
  }

  private async findCandidatePatterns(
    criteria: PatternSearchCriteria
  ): Promise<ExamplePattern[]> {
    let candidates: ExamplePattern[] = Array.from(this.patterns.values());

    // Filter by category
    if (criteria.category) {
      const categoryPatterns = this.categoryIndex.get(criteria.category);
      if (categoryPatterns) {
        candidates = candidates.filter(p => categoryPatterns.has(p.id));
      }
    }

    // Filter by domain
    if (criteria.domain) {
      const domainPatterns = this.domainIndex.get(criteria.domain);
      if (domainPatterns) {
        candidates = candidates.filter(p => domainPatterns.has(p.id));
      }
    }

    // Filter by complexity
    if (criteria.complexity) {
      const complexityMap = { low: 0.3, medium: 0.6, high: 0.9 };
      const targetComplexity = complexityMap[criteria.complexity];
      candidates = candidates.filter(p =>
        Math.abs(p.metadata.complexity - targetComplexity) < 0.3
      );
    }

    return candidates;
  }

  private async calculateSimilarityScores(
    query: string,
    candidates: ExamplePattern[],
    criteria: PatternSearchCriteria
  ): Promise<PatternMatchResult[]> {
    const results: PatternMatchResult[] = [];

    for (const pattern of candidates) {
      const similarity = this.calculateTextSimilarity(query, pattern.description);
      const relevance = this.calculateRelevance(query, pattern, criteria);
      const confidence = this.calculateConfidence(pattern);

      const matchReasons = this.generateMatchReasons(query, pattern, similarity);
      const adaptationSuggestions = this.generateAdaptationSuggestions(query, pattern);

      results.push({
        pattern,
        similarity,
        relevance,
        confidence,
        matchReasons,
        adaptationSuggestions
      });
    }

    return results;
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Simple word-based similarity (could be enhanced with more sophisticated algorithms)
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];

    return intersection.length / union.length;
  }

  private calculateRelevance(
    query: string,
    pattern: ExamplePattern,
    criteria: PatternSearchCriteria
  ): number {
    let relevance = 0;

    // Base relevance from quality
    relevance += pattern.quality * 0.3;

    // Usage-based relevance
    const evolution = this.patternEvolution.get(pattern.id);
    if (evolution) {
      relevance += Math.min(evolution.usageCount / 100, 0.3);
    }

    // Recency relevance
    relevance += pattern.metadata.recency * 0.2;

    // Complexity match
    if (criteria.complexity) {
      const complexityMap = { low: 0.3, medium: 0.6, high: 0.9 };
      const targetComplexity = complexityMap[criteria.complexity];
      const complexityDiff = Math.abs(pattern.metadata.complexity - targetComplexity);
      relevance += (1 - complexityDiff) * 0.2;
    }

    return Math.min(relevance, 1);
  }

  private calculateConfidence(pattern: ExamplePattern): number {
    let confidence = pattern.quality * 0.5;

    const evolution = this.patternEvolution.get(pattern.id);
    if (evolution) {
      confidence += evolution.successRate * 0.3;
      confidence += Math.min(evolution.feedbackScore / 10, 0.2);
    }

    return Math.min(confidence, 1);
  }

  private generateMatchReasons(
    query: string,
    pattern: ExamplePattern,
    similarity: number
  ): string[] {
    const reasons: string[] = [];

    if (similarity > 0.7) {
      reasons.push('High textual similarity');
    }

    if (pattern.quality > 0.8) {
      reasons.push('High quality pattern');
    }

    const evolution = this.patternEvolution.get(pattern.id);
    if (evolution && evolution.usageCount > 10) {
      reasons.push('Frequently used pattern');
    }

    return reasons;
  }

  private generateAdaptationSuggestions(
    query: string,
    pattern: ExamplePattern
  ): string[] {
    const suggestions: string[] = [];

    // Basic adaptation suggestions
    suggestions.push('Adjust complexity level to match requirements');
    suggestions.push('Customize validation criteria');
    suggestions.push('Enhance with domain-specific examples');

    return suggestions;
  }

  private async validatePattern(pattern: ExamplePattern): Promise<{
        valid: boolean;
        errors: string[];
    }> {
    const errors: string[] = [];

    // Check required fields
    if (!pattern.id) {
      errors.push('Pattern ID is required');
    }
    if (!pattern.name) {
      errors.push('Pattern name is required');
    }
    if (!pattern.description) {
      errors.push('Pattern description is required');
    }
    if (pattern.quality < 0 || pattern.quality > 1) {
      errors.push('Quality must be between 0 and 1');
    }

    // Check metadata
    if (!pattern.metadata) {
      errors.push('Pattern metadata is required');
    } else {
      if (!pattern.metadata.domain) {
        errors.push('Domain is required in metadata');
      }
      if (pattern.metadata.complexity < 0 || pattern.metadata.complexity > 1) {
        errors.push('Complexity must be between 0 and 1');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private async findDuplicatePattern(pattern: ExamplePattern): Promise<ExamplePattern | null> {
    for (const existing of this.patterns.values()) {
      if (existing.id === pattern.id) {
        return existing;
      }

      // Check for similar content
      const similarity = this.calculateTextSimilarity(
        pattern.description,
        existing.description
      );

      if (similarity > 0.9) {
        return existing;
      }
    }

    return null;
  }

  private async updateIndices(pattern: ExamplePattern): Promise<void> {
    // Update category index
    const category = pattern.metadata.domain;
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, new Set());
    }
        this.categoryIndex.get(category)!.add(pattern.id);

        // Update domain index
        const domain = pattern.metadata.domain;
        if (!this.domainIndex.has(domain)) {
          this.domainIndex.set(domain, new Set());
        }
        this.domainIndex.get(domain)!.add(pattern.id);
  }

  private async removeFromIndices(pattern: ExamplePattern): Promise<void> {
    // Remove from category index
    const category = pattern.metadata.domain;
    const categorySet = this.categoryIndex.get(category);
    if (categorySet) {
      categorySet.delete(pattern.id);
      if (categorySet.size === 0) {
        this.categoryIndex.delete(category);
      }
    }

    // Remove from domain index
    const domain = pattern.metadata.domain;
    const domainSet = this.domainIndex.get(domain);
    if (domainSet) {
      domainSet.delete(pattern.id);
      if (domainSet.size === 0) {
        this.domainIndex.delete(domain);
      }
    }
  }

  private generateCacheKey(criteria: PatternSearchCriteria): string {
    return `${criteria.query}-${criteria.category || 'all'}-${criteria.domain || 'all'}-${criteria.complexity || 'all'}-${criteria.maxExamples}-${criteria.minSimilarity}`;
  }

  private async updatePatternUsage(patternIds: string[]): Promise<void> {
    for (const patternId of patternIds) {
      const evolution = this.patternEvolution.get(patternId);
      if (evolution) {
        evolution.usageCount++;
        evolution.lastUsed = new Date();
      }
    }
  }

  private async cleanupOldPatterns(): Promise<void> {
    const cutoffDate = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
    const patternsToRemove: string[] = [];

    for (const [patternId, evolution] of this.patternEvolution.entries()) {
      if (evolution.lastUsed < cutoffDate && evolution.usageCount < 5) {
        patternsToRemove.push(patternId);
      }
    }

    for (const patternId of patternsToRemove) {
      await this.removePattern(patternId);
    }

    if (patternsToRemove.length > 0) {
      console.log(`🧹 Cleaned up ${patternsToRemove.length} old patterns`);
    }
  }

  private cleanupCache(): void {
    // Simple cache cleanup - in production, you'd want more sophisticated TTL handling
    if (this.similarityCache.size > 100) {
      this.similarityCache.clear();
    }
  }

  private clearRelatedCache(patternId: string): void {
    // Clear cache entries that might contain this pattern
    const keysToDelete: string[] = [];
    for (const key of this.similarityCache.keys()) {
      // Simple check - in production, you'd want more sophisticated cache invalidation
      keysToDelete.push(key);
    }

    for (const key of keysToDelete) {
      this.similarityCache.delete(key);
    }
  }

  private calculateQualityDistribution(scores: number[]): Record<string, number> {
    const distribution = { low: 0, medium: 0, high: 0 };

    for (const score of scores) {
      if (score < 0.6) {
        distribution.low++;
      } else if (score < 0.8) {
        distribution.medium++;
      } else {
        distribution.high++;
      }
    }

    return distribution;
  }

  private calculateCompletenessScore(): number {
    const totalPatterns = this.patterns.size;
    const completePatterns = Array.from(this.patterns.values()).filter(p =>
      p.input && p.output && p.context && p.description
    ).length;

    return completePatterns / totalPatterns;
  }

  private calculateDiversityScore(): number {
    const domains = new Set(Array.from(this.patterns.values()).map(p => p.metadata.domain));
    const maxDomains = this.config.patternCategories.length;

    return domains.size / maxDomains;
  }

  private calculateRecencyScore(): number {
    const recencyScores = Array.from(this.patterns.values()).map(p => p.metadata.recency);
    return recencyScores.reduce((sum, score) => sum + score, 0) / recencyScores.length;
  }

  private getPopularPatterns(count: number): ExamplePattern[] {
    const evolutions = Array.from(this.patternEvolution.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, count);

    return evolutions.map(e => this.patterns.get(e.patternId)!).filter(p => p);
  }

  private generateImprovementSuggestions(): string[] {
    const suggestions: string[] = [];

    const analytics = this.getAnalytics();

    if (analytics.qualityMetrics.averageQuality < 0.7) {
      suggestions.push('Improve overall pattern quality');
    }

    if (analytics.qualityMetrics.diversityScore < 0.6) {
      suggestions.push('Add more patterns from different domains');
    }

    if (analytics.qualityMetrics.recencyScore < 0.5) {
      suggestions.push('Update patterns with more recent examples');
    }

    return suggestions;
  }
}
