/**
 * Token Optimizer
 * Phase 3: Advanced Context Features - Tier 3.2
 *
 * Intelligent token usage optimization with context compression, pruning,
 * batch processing, and efficiency analytics for advanced context systems.
 */

export interface TokenOptimizationConfig {
    enabled: boolean;
    compressionRatio: number;
    priorityThreshold: number;
    batchSize: number;
    enableContextPruning: boolean;
    enableCompression: boolean;
    enableBatching: boolean;
    maxContextLength: number;
    preserveImportant: boolean;
    adaptiveOptimization: boolean;
}

export interface TokenContext {
    id: string;
    content: string;
    type: 'system' | 'user' | 'assistant' | 'function' | 'context';
    priority: number;
    importance: number;
    tokenCount: number;
    timestamp: Date;
    metadata: TokenMetadata;
    dependencies: string[];
}

export interface TokenMetadata {
    source: string;
    category: string;
    tags: string[];
    compressed: boolean;
    compressionRatio?: number;
    lastAccessed: Date;
    accessCount: number;
    retentionScore: number;
}

export interface CompressionResult {
    original: string;
    compressed: string;
    tokenSaved: number;
    compressionRatio: number;
    quality: number;
    reversible: boolean;
}

export interface PruningResult {
    originalContexts: TokenContext[];
    prunedContexts: TokenContext[];
    tokensSaved: number;
    pruningStrategy: string;
    preservedImportant: boolean;
}

export interface BatchResult {
    batchId: string;
    contexts: TokenContext[];
    totalTokens: number;
    optimizedTokens: number;
    tokensSaved: number;
    processingTime: number;
}

export interface TokenOptimizationResult {
    improvement: number;
    originalTokens: number;
    optimizedTokens: number;
    tokensSaved: number;
    compressionResults: CompressionResult[];
    pruningResults: PruningResult;
    batchResults: BatchResult[];
    metrics: TokenOptimizationMetrics;
    recommendations: string[];
}

export interface TokenOptimizationMetrics {
    totalContexts: number;
    totalTokens: number;
    compressedTokens: number;
    prunedTokens: number;
    batchedTokens: number;
    averageCompressionRatio: number;
    averagePruningRatio: number;
    efficiencyScore: number;
    qualityScore: number;
    processingTime: number;
}

interface TokenAnalysis {
    frequency: Map<string, number>;
    importance: Map<string, number>;
    relationships: Map<string, string[]>;
    patterns: TokenPattern[];
    redundancy: RedundancyAnalysis;
}

interface TokenPattern {
    pattern: string;
    frequency: number;
    contexts: string[];
    importance: number;
    compressible: boolean;
}

interface RedundancyAnalysis {
    duplicates: string[];
    nearDuplicates: Array<{ content: string; similarity: number; contexts: string[] }>;
    repetitivePatterns: TokenPattern[];
    redundancyScore: number;
}

interface CompressionStrategy {
    name: 'dictionary' | 'pattern' | 'semantic' | 'hybrid';
    enabled: boolean;
    parameters: any;
    effectiveness: number;
}

interface PruningStrategy {
    name: 'importance' | 'recency' | 'frequency' | 'semantic' | 'hybrid';
    enabled: boolean;
    parameters: any;
    aggressiveness: number;
}

export class TokenOptimizer {
  private config: TokenOptimizationConfig;
  private contexts: Map<string, TokenContext> = new Map();
  private tokenAnalysis: TokenAnalysis;
  private compressionStrategies: CompressionStrategy[];
  private pruningStrategies: PruningStrategy[];
  private optimizationHistory: TokenOptimizationResult[] = [];
  private compressionCache: Map<string, CompressionResult> = new Map();
  private metrics: TokenOptimizationMetrics;

  constructor(config: Partial<TokenOptimizationConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      compressionRatio: config.compressionRatio || 0.7,
      priorityThreshold: config.priorityThreshold || 0.8,
      batchSize: config.batchSize || 100,
      enableContextPruning: config.enableContextPruning ?? true,
      enableCompression: config.enableCompression ?? true,
      enableBatching: config.enableBatching ?? true,
      maxContextLength: config.maxContextLength || 4000,
      preserveImportant: config.preserveImportant ?? true,
      adaptiveOptimization: config.adaptiveOptimization ?? true
    };

    this.tokenAnalysis = {
      frequency: new Map(),
      importance: new Map(),
      relationships: new Map(),
      patterns: [],
      redundancy: {
        duplicates: [],
        nearDuplicates: [],
        repetitivePatterns: [],
        redundancyScore: 0
      }
    };

    this.compressionStrategies = [
      {
        name: 'dictionary',
        enabled: true,
        parameters: { minFrequency: 3 },
        effectiveness: 0.7
      },
      {
        name: 'pattern',
        enabled: true,
        parameters: { minPatternLength: 5 },
        effectiveness: 0.6
      },
      {
        name: 'semantic',
        enabled: true,
        parameters: { similarityThreshold: 0.8 },
        effectiveness: 0.8
      }
    ];

    this.pruningStrategies = [
      {
        name: 'importance',
        enabled: true,
        parameters: { threshold: 0.3 },
        aggressiveness: 0.5
      },
      {
        name: 'recency',
        enabled: true,
        parameters: { maxAge: 3600000 }, // 1 hour
        aggressiveness: 0.3
      }
    ];

    this.metrics = {
      totalContexts: 0,
      totalTokens: 0,
      compressedTokens: 0,
      prunedTokens: 0,
      batchedTokens: 0,
      averageCompressionRatio: 0,
      averagePruningRatio: 0,
      efficiencyScore: 0,
      qualityScore: 0,
      processingTime: 0
    };

    this.initializeTokenOptimizer();
    console.log('🔧 Token Optimizer initialized');
  }

  /**
     * Add context for optimization
     */
  addContext(context: TokenContext): void {
    // Calculate token count if not provided
    if (!context.tokenCount) {
      context.tokenCount = this.estimateTokenCount(context.content);
    }

    // Calculate importance if not provided
    if (!context.importance) {
      context.importance = this.calculateImportance(context);
    }

    this.contexts.set(context.id, context);
    this.updateTokenAnalysis(context);
    this.metrics.totalContexts = this.contexts.size;
    this.metrics.totalTokens += context.tokenCount;

    console.log(`📝 Added context: ${context.id} (${context.tokenCount} tokens)`);
  }

  /**
     * Optimize token usage for all contexts
     */
  async optimizeTokenUsage(): Promise<TokenOptimizationResult> {
    console.log('🚀 Starting token optimization');

    const startTime = Date.now();
    const originalTokens = this.getTotalTokens();

    try {
      // Analyze current token usage
      await this.analyzeTokenUsage();

      // Apply compression
      const compressionResults = this.config.enableCompression
        ? await this.applyCompression()
        : [];

      // Apply pruning
      const pruningResults = this.config.enableContextPruning
        ? await this.applyPruning()
        : this.getEmptyPruningResult();

      // Apply batching
      const batchResults = this.config.enableBatching
        ? await this.applyBatching()
        : [];

      // Calculate results
      const optimizedTokens = this.getTotalTokens();
      const tokensSaved = originalTokens - optimizedTokens;
      const improvement = originalTokens > 0 ? tokensSaved / originalTokens : 0;

      // Update metrics
      this.updateOptimizationMetrics(compressionResults, pruningResults, batchResults);

      // Generate recommendations
      const recommendations = await this.generateOptimizationRecommendations();

      const result: TokenOptimizationResult = {
        improvement,
        originalTokens,
        optimizedTokens,
        tokensSaved,
        compressionResults,
        pruningResults,
        batchResults,
        metrics: { ...this.metrics },
        recommendations
      };

      // Store optimization history
      this.optimizationHistory.push(result);
      if (this.optimizationHistory.length > 10) {
        this.optimizationHistory.shift();
      }

      const processingTime = Date.now() - startTime;
      this.metrics.processingTime = processingTime;

      console.log(`✅ Token optimization completed: ${tokensSaved} tokens saved (${(improvement * 100).toFixed(1)}% improvement)`);

      return result;

    } catch (error) {
      console.error(`❌ Token optimization failed: ${error}`);
      return this.getFailedOptimizationResult(originalTokens, error);
    }
  }

  /**
     * Compress specific context
     */
  async compressContext(contextId: string): Promise<CompressionResult | null> {
    const context = this.contexts.get(contextId);
    if (!context) {
      return null;
    }

    return await this.compressContent(context.content, context.type);
  }

  /**
     * Get optimized context content
     */
  getOptimizedContent(contextId: string): string | null {
    const context = this.contexts.get(contextId);
    if (!context) {
      return null;
    }

    return context.content;
  }

  /**
     * Get optimization metrics
     */
  getMetrics(): TokenOptimizationMetrics {
    return { ...this.metrics };
  }

  /**
     * Get optimization history
     */
  getOptimizationHistory(): TokenOptimizationResult[] {
    return [...this.optimizationHistory];
  }

  /**
     * Update configuration
     */
  updateConfig(newConfig: Partial<TokenOptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Token optimizer configuration updated');
  }

  /**
     * Clear optimization cache
     */
  clearCache(): void {
    this.compressionCache.clear();
    console.log('🧹 Token optimization cache cleared');
  }

  // Private methods
  private initializeTokenOptimizer(): void {
    // Start periodic optimization if adaptive
    if (this.config.adaptiveOptimization) {
      setInterval(() => {
        this.adaptiveOptimization();
      }, 600000); // Every 10 minutes
    }
  }

  private estimateTokenCount(content: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(content.length / 4);
  }

  private calculateImportance(context: TokenContext): number {
    let importance = 0;

    // Base importance by type
    const typeImportance = {
      system: 0.9,
      function: 0.8,
      context: 0.7,
      user: 0.6,
      assistant: 0.5
    };
    importance += typeImportance[context.type] || 0.5;

    // Adjust for priority
    importance += context.priority * 0.3;

    // Adjust for recency
    const age = Date.now() - context.timestamp.getTime();
    const recencyScore = Math.max(0, 1 - age / 3600000); // 1 hour max
    importance += recencyScore * 0.2;

    return Math.min(1, importance);
  }

  private updateTokenAnalysis(context: TokenContext): void {
    // Update frequency analysis
    const words = context.content.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) { // Ignore short words
        const current = this.tokenAnalysis.frequency.get(word) || 0;
        this.tokenAnalysis.frequency.set(word, current + 1);
      }
    });

    // Update importance mapping
    this.tokenAnalysis.importance.set(context.id, context.importance);

    // Update relationships
    if (context.dependencies.length > 0) {
      this.tokenAnalysis.relationships.set(context.id, context.dependencies);
    }
  }

  private async analyzeTokenUsage(): Promise<void> {
    console.log('📊 Analyzing token usage patterns');

    // Analyze patterns
    await this.analyzeTokenPatterns();

    // Analyze redundancy
    await this.analyzeRedundancy();

    // Update analysis metrics
    this.updateAnalysisMetrics();
  }

  private async analyzeTokenPatterns(): Promise<void> {
    const patterns: TokenPattern[] = [];

    // Find common phrases and patterns
    const allContent = Array.from(this.contexts.values()).map(c => c.content).join(' ');
    const phrases = this.extractPhrases(allContent);

    for (const [phrase, frequency] of phrases.entries()) {
      if (frequency >= 3 && phrase.length >= 10) { // Minimum threshold
        const contexts = Array.from(this.contexts.values())
          .filter(c => c.content.includes(phrase))
          .map(c => c.id);

        patterns.push({
          pattern: phrase,
          frequency,
          contexts,
          importance: this.calculatePatternImportance(phrase, contexts),
          compressible: frequency >= 5 && phrase.length >= 20
        });
      }
    }

    this.tokenAnalysis.patterns = patterns.sort((a, b) => b.frequency - a.frequency);
  }

  private async analyzeRedundancy(): Promise<void> {
    const duplicates: string[] = [];
    const nearDuplicates: Array<{ content: string; similarity: number; contexts: string[] }> = [];

    const contentMap = new Map<string, string[]>();

    // Group by content
    for (const [id, context] of this.contexts.entries()) {
      const content = context.content.trim();
      if (!contentMap.has(content)) {
        contentMap.set(content, []);
      }
            contentMap.get(content)!.push(id);
    }

    // Find exact duplicates
    for (const [content, contextIds] of contentMap.entries()) {
      if (contextIds.length > 1) {
        duplicates.push(content);
      }
    }

    // Find near duplicates (simplified similarity check)
    const contents = Array.from(contentMap.keys());
    for (let i = 0; i < contents.length; i++) {
      for (let j = i + 1; j < contents.length; j++) {
        const similarity = this.calculateSimilarity(contents[i], contents[j]);
        if (similarity > 0.8) {
          nearDuplicates.push({
            content: contents[i],
            similarity,
            contexts: [...contentMap.get(contents[i])!, ...contentMap.get(contents[j])!]
          });
        }
      }
    }

    this.tokenAnalysis.redundancy = {
      duplicates,
      nearDuplicates,
      repetitivePatterns: this.tokenAnalysis.patterns.filter(p => p.frequency > 10),
      redundancyScore: (duplicates.length + nearDuplicates.length) / this.contexts.size
    };
  }

  private async applyCompression(): Promise<CompressionResult[]> {
    console.log('🗜️ Applying compression strategies');

    const results: CompressionResult[] = [];

    for (const [contextId, context] of this.contexts.entries()) {
      if (context.metadata.compressed) {
        continue;
      }

      const compressionResult = await this.compressContent(context.content, context.type);
      if (compressionResult && compressionResult.compressionRatio >= this.config.compressionRatio) {
        // Apply compression
        context.content = compressionResult.compressed;
        context.tokenCount = this.estimateTokenCount(compressionResult.compressed);
        context.metadata.compressed = true;
        context.metadata.compressionRatio = compressionResult.compressionRatio;

        results.push(compressionResult);
        this.metrics.compressedTokens += compressionResult.tokenSaved;
      }
    }

    return results;
  }

  private async compressContent(content: string, type: string): Promise<CompressionResult | null> {
    // Check cache first
    const cacheKey = `${type}:${this.hashContent(content)}`;
    if (this.compressionCache.has(cacheKey)) {
      return this.compressionCache.get(cacheKey)!;
    }

    let bestResult: CompressionResult | null = null;

    for (const strategy of this.compressionStrategies) {
      if (!strategy.enabled) {
        continue;
      }

      const result = await this.applyCompressionStrategy(content, strategy);
      if (result && (!bestResult || result.compressionRatio > bestResult.compressionRatio)) {
        bestResult = result;
      }
    }

    if (bestResult) {
      this.compressionCache.set(cacheKey, bestResult);
    }

    return bestResult;
  }

  private async applyCompressionStrategy(
    content: string,
    strategy: CompressionStrategy
  ): Promise<CompressionResult | null> {
    switch (strategy.name) {
    case 'dictionary':
      return this.applyDictionaryCompression(content, strategy.parameters);
    case 'pattern':
      return this.applyPatternCompression(content, strategy.parameters);
    case 'semantic':
      return this.applySemanticCompression(content, strategy.parameters);
    default:
      return null;
    }
  }

  private applyDictionaryCompression(content: string, params: any): CompressionResult {
    // Replace frequent words/phrases with shorter tokens
    let compressed = content;
    let tokensSaved = 0;

    const frequentPatterns = this.tokenAnalysis.patterns
      .filter(p => p.frequency >= params.minFrequency)
      .slice(0, 50); // Top 50 patterns

    frequentPatterns.forEach((pattern, index) => {
      const token = `{${index}}`;
      const regex = new RegExp(pattern.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = (compressed.match(regex) || []).length;

      if (matches > 0) {
        compressed = compressed.replace(regex, token);
        tokensSaved += matches * (pattern.pattern.length - token.length) / 4; // Rough token estimation
      }
    });

    const originalTokens = this.estimateTokenCount(content);
    const compressedTokens = this.estimateTokenCount(compressed);
    const actualTokensSaved = originalTokens - compressedTokens;

    return {
      original: content,
      compressed,
      tokenSaved: actualTokensSaved,
      compressionRatio: actualTokensSaved / originalTokens,
      quality: 0.9, // Dictionary compression is high quality
      reversible: true
    };
  }

  private applyPatternCompression(content: string, params: any): CompressionResult {
    // Simplified pattern-based compression
    let compressed = content;

    // Remove redundant whitespace
    compressed = compressed.replace(/\s+/g, ' ').trim();

    // Compress common patterns
    const compressionMap = {
      ' and ': '&',
      ' the ': ' ',
      ' that ': ' ',
      ' with ': 'w/',
      ' from ': 'fr/',
      ' have ': 'hv',
      ' will ': "'ll",
      ' would ': "'d"
    };

    for (const [pattern, replacement] of Object.entries(compressionMap)) {
      compressed = compressed.replace(new RegExp(pattern, 'g'), replacement);
    }

    const originalTokens = this.estimateTokenCount(content);
    const compressedTokens = this.estimateTokenCount(compressed);
    const tokensSaved = originalTokens - compressedTokens;

    return {
      original: content,
      compressed,
      tokenSaved: tokensSaved,
      compressionRatio: tokensSaved / originalTokens,
      quality: 0.8,
      reversible: false
    };
  }

  private applySemanticCompression(content: string, params: any): CompressionResult {
    // Simplified semantic compression - remove redundant information
    let compressed = content;

    // Remove redundant sentences (very simplified)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    const uniqueSentences = [];

    for (const sentence of sentences) {
      const isDuplicate = uniqueSentences.some(existing =>
        this.calculateSimilarity(sentence, existing) > params.similarityThreshold
      );

      if (!isDuplicate) {
        uniqueSentences.push(sentence);
      }
    }

    compressed = `${uniqueSentences.join('. ')  }.`;

    const originalTokens = this.estimateTokenCount(content);
    const compressedTokens = this.estimateTokenCount(compressed);
    const tokensSaved = originalTokens - compressedTokens;

    return {
      original: content,
      compressed,
      tokenSaved: tokensSaved,
      compressionRatio: tokensSaved / originalTokens,
      quality: 0.7,
      reversible: false
    };
  }

  private async applyPruning(): Promise<PruningResult> {
    console.log('✂️ Applying context pruning');

    const originalContexts = Array.from(this.contexts.values());
    const contextsToRemove: string[] = [];

    // Apply pruning strategies
    for (const strategy of this.pruningStrategies) {
      if (!strategy.enabled) {
        continue;
      }

      const candidates = await this.getPruningCandidates(strategy);
      contextsToRemove.push(...candidates);
    }

    // Remove duplicates and preserve important contexts
    const uniqueCandidates = [...new Set(contextsToRemove)];
    const finalCandidates = this.config.preserveImportant
      ? uniqueCandidates.filter(id => {
        const context = this.contexts.get(id);
        return context && context.importance < this.config.priorityThreshold;
      })
      : uniqueCandidates;

    // Calculate tokens saved
    let tokensSaved = 0;
    finalCandidates.forEach(id => {
      const context = this.contexts.get(id);
      if (context) {
        tokensSaved += context.tokenCount;
        this.contexts.delete(id);
      }
    });

    const prunedContexts = Array.from(this.contexts.values());
    this.metrics.prunedTokens += tokensSaved;

    return {
      originalContexts,
      prunedContexts,
      tokensSaved,
      pruningStrategy: this.pruningStrategies.filter(s => s.enabled).map(s => s.name).join(', '),
      preservedImportant: this.config.preserveImportant
    };
  }

  private async getPruningCandidates(strategy: PruningStrategy): Promise<string[]> {
    const candidates: string[] = [];

    switch (strategy.name) {
    case 'importance':
      for (const [id, context] of this.contexts.entries()) {
        if (context.importance < strategy.parameters.threshold) {
          candidates.push(id);
        }
      }
      break;

    case 'recency':
      const cutoffTime = Date.now() - strategy.parameters.maxAge;
      for (const [id, context] of this.contexts.entries()) {
        if (context.timestamp.getTime() < cutoffTime) {
          candidates.push(id);
        }
      }
      break;
    }

    return candidates;
  }

  private async applyBatching(): Promise<BatchResult[]> {
    console.log('📦 Applying context batching');

    const results: BatchResult[] = [];
    const contexts = Array.from(this.contexts.values());

    // Group contexts into batches
    for (let i = 0; i < contexts.length; i += this.config.batchSize) {
      const batch = contexts.slice(i, i + this.config.batchSize);
      const batchResult = await this.processBatch(batch, i);
      results.push(batchResult);
    }

    return results;
  }

  private async processBatch(contexts: TokenContext[], batchIndex: number): Promise<BatchResult> {
    const startTime = Date.now();
    const batchId = `batch_${batchIndex}_${Date.now()}`;

    const originalTokens = contexts.reduce((sum, c) => sum + c.tokenCount, 0);

    // Apply batch-level optimizations
    // For now, this is simplified - in practice you'd implement more sophisticated batching
    let optimizedTokens = originalTokens;

    // Simple deduplication within batch
    const uniqueContent = new Set(contexts.map(c => c.content));
    if (uniqueContent.size < contexts.length) {
      const deduplicationSavings = originalTokens * 0.1; // Estimate 10% savings
      optimizedTokens = originalTokens - deduplicationSavings;
    }

    const tokensSaved = originalTokens - optimizedTokens;
    const processingTime = Date.now() - startTime;

    this.metrics.batchedTokens += tokensSaved;

    return {
      batchId,
      contexts,
      totalTokens: originalTokens,
      optimizedTokens,
      tokensSaved,
      processingTime
    };
  }

  // Utility methods
  private getTotalTokens(): number {
    return Array.from(this.contexts.values()).reduce((sum, context) => sum + context.tokenCount, 0);
  }

  private extractPhrases(text: string): Map<string, number> {
    const phrases = new Map<string, number>();
    const words = text.toLowerCase().split(/\s+/);

    // Extract 2-5 word phrases
    for (let length = 2; length <= 5; length++) {
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(' ');
        if (phrase.length >= 10) { // Minimum phrase length
          phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
        }
      }
    }

    return phrases;
  }

  private calculatePatternImportance(pattern: string, contexts: string[]): number {
    // Calculate importance based on contexts and frequency
    const avgContextImportance = contexts.reduce((sum, id) => {
      const context = this.contexts.get(id);
      return sum + (context?.importance || 0);
    }, 0) / contexts.length;

    return Math.min(1, avgContextImportance + (pattern.length / 100));
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simplified Jaccard similarity
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  private hashContent(content: string): string {
    // Simple hash function for caching
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  private updateOptimizationMetrics(
    compressionResults: CompressionResult[],
    pruningResults: PruningResult,
    batchResults: BatchResult[]
  ): void {
    this.metrics.totalContexts = this.contexts.size;
    this.metrics.totalTokens = this.getTotalTokens();

    if (compressionResults.length > 0) {
      this.metrics.averageCompressionRatio =
                compressionResults.reduce((sum, r) => sum + r.compressionRatio, 0) / compressionResults.length;
    }

    if (pruningResults.tokensSaved > 0) {
      this.metrics.averagePruningRatio =
                pruningResults.tokensSaved / pruningResults.originalContexts.reduce((sum, c) => sum + c.tokenCount, 0);
    }

    // Calculate efficiency and quality scores
    this.metrics.efficiencyScore = Math.min(1, (this.metrics.compressedTokens + this.metrics.prunedTokens) / this.metrics.totalTokens);
    this.metrics.qualityScore = compressionResults.length > 0
      ? compressionResults.reduce((sum, r) => sum + r.quality, 0) / compressionResults.length
      : 0.8;
  }

  private updateAnalysisMetrics(): void {
    // Update frequency-based metrics
    console.log(`📈 Analysis complete: ${this.tokenAnalysis.patterns.length} patterns, ${this.tokenAnalysis.redundancy.duplicates.length} duplicates`);
  }

  private async generateOptimizationRecommendations(): Promise<string[]> {
    const recommendations: string[] = [];

    if (this.metrics.averageCompressionRatio < 0.5) {
      recommendations.push('Consider more aggressive compression strategies');
    }

    if (this.tokenAnalysis.redundancy.redundancyScore > 0.3) {
      recommendations.push('High redundancy detected, enable more aggressive deduplication');
    }

    if (this.metrics.totalTokens > this.config.maxContextLength) {
      recommendations.push('Context length exceeds maximum, consider more aggressive pruning');
    }

    if (this.tokenAnalysis.patterns.length > 100) {
      recommendations.push('Many repetitive patterns found, improve compression dictionary');
    }

    return recommendations;
  }

  private getEmptyPruningResult(): PruningResult {
    return {
      originalContexts: Array.from(this.contexts.values()),
      prunedContexts: Array.from(this.contexts.values()),
      tokensSaved: 0,
      pruningStrategy: 'disabled',
      preservedImportant: true
    };
  }

  private getFailedOptimizationResult(originalTokens: number, error: any): TokenOptimizationResult {
    return {
      improvement: 0,
      originalTokens,
      optimizedTokens: originalTokens,
      tokensSaved: 0,
      compressionResults: [],
      pruningResults: this.getEmptyPruningResult(),
      batchResults: [],
      metrics: { ...this.metrics },
      recommendations: [`Optimization failed: ${error.message}`]
    };
  }

  private async adaptiveOptimization(): Promise<void> {
    if (!this.config.adaptiveOptimization || this.contexts.size === 0) {
      return;
    }

    try {
      await this.optimizeTokenUsage();
    } catch (error) {
      console.error('Adaptive token optimization failed:', error);
    }
  }
}
