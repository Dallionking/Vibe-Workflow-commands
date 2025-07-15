/**
 * Context Memory Storage with Learning Capabilities
 * Stores and learns from context patterns, decisions, and usage
 */

import {
  ContextFragment,
  ContextPriority,
  ContextPattern,
  ContextDecision,
  LearningMetrics,
  MemoryEntry,
  PatternRecognition
} from '../types/context.types';

import { LRUCache } from '../cache/lru-cache';

/**
 * Memory Configuration
 */
export interface MemoryConfig {
  maxPatterns: number;
  maxDecisions: number;
  learningThreshold: number; // Minimum occurrences to establish pattern
  decayRate: number; // How quickly unused patterns fade
  persistenceInterval: number; // How often to save to disk (ms)
  adaptiveWeights: boolean; // Whether to adapt pattern weights over time
}

/**
 * Pattern Recognition Engine
 */
export class PatternRecognitionEngine {
  private patterns = new Map<string, ContextPattern>();
  private patternUsage = new Map<string, number>();
  private config: MemoryConfig;

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      maxPatterns: config.maxPatterns || 500,
      maxDecisions: config.maxDecisions || 1000,
      learningThreshold: config.learningThreshold || 3,
      decayRate: config.decayRate || 0.1,
      persistenceInterval: config.persistenceInterval || 300000, // 5 minutes
      adaptiveWeights: config.adaptiveWeights || true
    };
  }

  /**
   * Analyze context fragments to identify patterns
   */
  public analyzeFragments(fragments: ContextFragment[]): PatternRecognition {
    const recognition: PatternRecognition = {
      identifiedPatterns: [],
      confidenceScore: 0,
      recommendations: [],
      appliedPatterns: [],
      timestamp: Date.now()
    };

    // Analyze sequence patterns
    const sequencePatterns = this.identifySequencePatterns(fragments);
    recognition.identifiedPatterns.push(...sequencePatterns);

    // Analyze priority patterns
    const priorityPatterns = this.identifyPriorityPatterns(fragments);
    recognition.identifiedPatterns.push(...priorityPatterns);

    // Analyze content patterns
    const contentPatterns = this.identifyContentPatterns(fragments);
    recognition.identifiedPatterns.push(...contentPatterns);

    // Calculate confidence score
    recognition.confidenceScore = this.calculateConfidence(recognition.identifiedPatterns);

    // Generate recommendations
    recognition.recommendations = this.generateRecommendations(recognition.identifiedPatterns);

    return recognition;
  }

  /**
   * Learn from successful context assemblies
   */
  public learnFromAssembly(
    fragments: ContextFragment[],
    assemblyResult: any,
    userFeedback?: 'positive' | 'negative' | 'neutral'
  ): void {
    const signature = this.generateAssemblySignature(fragments);
    
    // Update pattern usage
    for (const fragment of fragments) {
      const patternKey = this.generatePatternKey(fragment);
      const currentUsage = this.patternUsage.get(patternKey) || 0;
      
      // Weight by user feedback
      let weight = 1;
      if (userFeedback === 'positive') weight = 1.5;
      if (userFeedback === 'negative') weight = 0.5;
      
      this.patternUsage.set(patternKey, currentUsage + weight);
    }

    // Create or update pattern
    this.updatePattern(signature, fragments, assemblyResult);
  }

  /**
   * Get pattern recommendations for context assembly
   */
  public getRecommendations(currentFragments: ContextFragment[]): ContextPattern[] {
    const similarPatterns: ContextPattern[] = [];
    
    for (const [, pattern] of this.patterns) {
      const similarity = this.calculateSimilarity(currentFragments, pattern.fragmentSignature);
      
      if (similarity > 0.7) { // 70% similarity threshold
        similarPatterns.push({
          ...pattern,
          confidence: similarity * pattern.confidence
        });
      }
    }

    return similarPatterns.sort((a, b) => b.confidence - a.confidence);
  }

  // Private pattern analysis methods

  private identifySequencePatterns(fragments: ContextFragment[]): ContextPattern[] {
    const patterns: ContextPattern[] = [];
    
    // Analyze fragment type sequences
    const typeSequence = fragments.map(f => f.type);
    const sequenceKey = typeSequence.join(' → ');
    
    if (this.patternUsage.has(sequenceKey) && this.patternUsage.get(sequenceKey)! >= this.config.learningThreshold) {
      patterns.push({
        id: `sequence-${Date.now()}`,
        type: 'sequence',
        name: 'Fragment Type Sequence',
        description: `Common sequence: ${sequenceKey}`,
        fragmentSignature: typeSequence,
        contextSignature: this.generateContextSignature(fragments),
        confidence: Math.min(this.patternUsage.get(sequenceKey)! / 10, 1),
        usage: this.patternUsage.get(sequenceKey)!,
        lastUsed: Date.now(),
        created: Date.now()
      });
    }

    return patterns;
  }

  private identifyPriorityPatterns(fragments: ContextFragment[]): ContextPattern[] {
    const patterns: ContextPattern[] = [];
    
    // Analyze priority distributions
    const priorityDist = new Map<ContextPriority, number>();
    fragments.forEach(f => {
      priorityDist.set(f.priority, (priorityDist.get(f.priority) || 0) + 1);
    });

    const distKey = Array.from(priorityDist.entries())
      .sort(([a], [b]) => b - a)
      .map(([priority, count]) => `${priority}:${count}`)
      .join(',');

    if (this.patternUsage.has(distKey) && this.patternUsage.get(distKey)! >= this.config.learningThreshold) {
      patterns.push({
        id: `priority-${Date.now()}`,
        type: 'priority-distribution',
        name: 'Priority Distribution Pattern',
        description: `Common priority distribution: ${distKey}`,
        fragmentSignature: Array.from(priorityDist.keys()),
        contextSignature: this.generateContextSignature(fragments),
        confidence: Math.min(this.patternUsage.get(distKey)! / 15, 1),
        usage: this.patternUsage.get(distKey)!,
        lastUsed: Date.now(),
        created: Date.now()
      });
    }

    return patterns;
  }

  private identifyContentPatterns(fragments: ContextFragment[]): ContextPattern[] {
    const patterns: ContextPattern[] = [];
    
    // Analyze common content keywords
    const contentKeywords = new Set<string>();
    
    fragments.forEach(f => {
      const words = f.content.toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3)
        .slice(0, 10); // Top 10 words per fragment
      
      words.forEach(word => contentKeywords.add(word));
    });

    if (contentKeywords.size > 5) {
      const keywordArray = Array.from(contentKeywords).sort();
      const contentKey = keywordArray.slice(0, 5).join(',');
      
      if (this.patternUsage.has(contentKey) && this.patternUsage.get(contentKey)! >= this.config.learningThreshold) {
        patterns.push({
          id: `content-${Date.now()}`,
          type: 'content-similarity',
          name: 'Content Keyword Pattern',
          description: `Common keywords: ${contentKey}`,
          fragmentSignature: keywordArray,
          contextSignature: this.generateContextSignature(fragments),
          confidence: Math.min(this.patternUsage.get(contentKey)! / 8, 1),
          usage: this.patternUsage.get(contentKey)!,
          lastUsed: Date.now(),
          created: Date.now()
        });
      }
    }

    return patterns;
  }

  private generateAssemblySignature(fragments: ContextFragment[]): string {
    const types = fragments.map(f => f.type).sort();
    const priorities = fragments.map(f => f.priority).sort();
    return `${types.join(',')}|${priorities.join(',')}`;
  }

  private generatePatternKey(fragment: ContextFragment): string {
    return `${fragment.type}-${fragment.priority}`;
  }

  private generateContextSignature(fragments: ContextFragment[]): string {
    return fragments
      .map(f => `${f.type}:${f.priority}:${f.tokenEstimate}`)
      .join('|');
  }

  private calculateSimilarity(fragments1: ContextFragment[], signature: any[]): number {
    const types1 = fragments1.map(f => f.type);
    const types2 = Array.isArray(signature) ? signature : [];
    
    if (types1.length === 0 || types2.length === 0) return 0;
    
    const intersection = types1.filter(t => types2.includes(t));
    const union = [...new Set([...types1, ...types2])];
    
    return intersection.length / union.length;
  }

  private calculateConfidence(patterns: ContextPattern[]): number {
    if (patterns.length === 0) return 0;
    
    const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    const usageWeight = Math.min(patterns.length / 5, 1);
    
    return avgConfidence * usageWeight;
  }

  private generateRecommendations(patterns: ContextPattern[]): string[] {
    const recommendations: string[] = [];
    
    patterns.forEach(pattern => {
      switch (pattern.type) {
        case 'sequence':
          recommendations.push(`Consider using the proven sequence: ${pattern.description}`);
          break;
        case 'priority-distribution':
          recommendations.push(`Optimal priority distribution found: ${pattern.description}`);
          break;
        case 'content-similarity':
          recommendations.push(`Similar content patterns suggest: ${pattern.description}`);
          break;
      }
    });

    return recommendations;
  }

  private updatePattern(signature: string, fragments: ContextFragment[], result: any): void {
    const existing = this.patterns.get(signature);
    
    if (existing) {
      existing.usage++;
      existing.lastUsed = Date.now();
      existing.confidence = Math.min(existing.confidence + 0.1, 1);
    } else {
      const newPattern: ContextPattern = {
        id: `pattern-${Date.now()}`,
        type: 'assembly',
        name: 'Assembly Pattern',
        description: `Pattern for ${fragments.length} fragments`,
        fragmentSignature: fragments.map(f => f.type),
        contextSignature: signature,
        confidence: 0.5,
        usage: 1,
        lastUsed: Date.now(),
        created: Date.now()
      };
      
      this.patterns.set(signature, newPattern);
    }

    // Cleanup old patterns if needed
    if (this.patterns.size > this.config.maxPatterns) {
      this.cleanupOldPatterns();
    }
  }

  private cleanupOldPatterns(): void {
    const sortedPatterns = Array.from(this.patterns.entries())
      .sort(([, a], [, b]) => a.lastUsed - b.lastUsed);
    
    const toRemove = sortedPatterns.slice(0, Math.floor(this.config.maxPatterns * 0.1));
    toRemove.forEach(([key]) => this.patterns.delete(key));
  }
}

/**
 * Context Memory Manager
 * Central hub for storing and retrieving context memory
 */
export class ContextMemoryManager {
  private patternEngine: PatternRecognitionEngine;
  private decisionHistory: Map<string, ContextDecision>;
  private memoryCache: Map<string, MemoryEntry>;
  private config: MemoryConfig;
  private learningMetrics: LearningMetrics;

  constructor(config: Partial<MemoryConfig> = {}) {
    this.config = {
      maxPatterns: config.maxPatterns || 500,
      maxDecisions: config.maxDecisions || 1000,
      learningThreshold: config.learningThreshold || 3,
      decayRate: config.decayRate || 0.1,
      persistenceInterval: config.persistenceInterval || 300000,
      adaptiveWeights: config.adaptiveWeights || true
    };

    this.patternEngine = new PatternRecognitionEngine(this.config);
    this.decisionHistory = new Map();
    this.memoryCache = new Map();

    this.learningMetrics = {
      patternsLearned: 0,
      decisionsRecorded: 0,
      recommendationsGenerated: 0,
      accuracyRate: 0,
      lastUpdated: Date.now()
    };
  }

  /**
   * Record a context decision for learning
   */
  public recordDecision(
    contextId: string,
    decision: string,
    reasoning: string,
    outcome: 'success' | 'failure' | 'partial',
    fragments: ContextFragment[]
  ): void {
    const contextDecision: ContextDecision = {
      id: `decision-${Date.now()}`,
      contextId,
      decision,
      reasoning,
      outcome,
      contextSignature: this.generateDecisionSignature(fragments),
      confidence: outcome === 'success' ? 1 : outcome === 'partial' ? 0.5 : 0.2,
      timestamp: Date.now()
    };

    this.decisionHistory.set(contextDecision.id, contextDecision);
    this.learningMetrics.decisionsRecorded++;
    
    // Learn from the decision
    this.patternEngine.learnFromAssembly(
      fragments, 
      { decision, outcome }, 
      outcome === 'success' ? 'positive' : outcome === 'failure' ? 'negative' : 'neutral'
    );
  }

  /**
   * Get recommendations based on similar contexts
   */
  public getRecommendations(fragments: ContextFragment[]): ContextPattern[] {
    const recommendations = this.patternEngine.getRecommendations(fragments);
    this.learningMetrics.recommendationsGenerated++;
    return recommendations;
  }

  /**
   * Analyze current context for patterns
   */
  public analyzeContext(fragments: ContextFragment[]): PatternRecognition {
    return this.patternEngine.analyzeFragments(fragments);
  }

  /**
   * Store memory entry
   */
  public storeMemory(
    key: string,
    content: string,
    type: 'pattern' | 'decision' | 'learning',
    priority: ContextPriority = ContextPriority.MEDIUM
  ): void {
    const memoryEntry: MemoryEntry = {
      id: `memory-${Date.now()}`,
      key,
      content,
      type,
      priority,
      accessCount: 0,
      created: Date.now(),
      lastAccessed: Date.now()
    };

    this.memoryCache.set(key, memoryEntry);
  }

  /**
   * Retrieve memory entry
   */
  public getMemory(key: string): MemoryEntry | null {
    const entry = this.memoryCache.get(key);
    if (entry) {
      entry.accessCount++;
      entry.lastAccessed = Date.now();
    }
    return entry || null;
  }

  /**
   * Get learning metrics
   */
  public getLearningMetrics(): LearningMetrics {
    // Update accuracy rate based on recent decisions
    this.updateAccuracyRate();
    return { ...this.learningMetrics };
  }

  /**
   * Export memory state
   */
  public exportMemory(): MemoryExport {
    return {
      config: this.config,
      patterns: this.patternEngine['patterns'],
      patternUsage: this.patternEngine['patternUsage'],
      decisions: Array.from(this.decisionHistory.entries()),
      memory: Array.from(this.memoryCache.entries()),
      metrics: this.learningMetrics,
      timestamp: Date.now()
    };
  }

  /**
   * Import memory state
   */
  public importMemory(data: MemoryExport): void {
    this.config = data.config;
    this.patternEngine['patterns'] = data.patterns;
    this.patternEngine['patternUsage'] = data.patternUsage;
    this.decisionHistory = new Map(data.decisions);
    this.memoryCache = new Map(data.memory);
    this.learningMetrics = data.metrics;
  }

  // Private helper methods

  private generateDecisionSignature(fragments: ContextFragment[]): string {
    return fragments
      .map(f => `${f.type}:${f.priority}`)
      .sort()
      .join('|');
  }

  private updateAccuracyRate(): void {
    const recentDecisions = Array.from(this.decisionHistory.values());
    if (recentDecisions.length === 0) {
      this.learningMetrics.accuracyRate = 0;
      return;
    }

    const successCount = recentDecisions.filter((d: ContextDecision) => d.outcome === 'success').length;
    this.learningMetrics.accuracyRate = (successCount / recentDecisions.length) * 100;
    this.learningMetrics.lastUpdated = Date.now();
  }
}

/**
 * Memory export format
 */
interface MemoryExport {
  config: MemoryConfig;
  patterns: Map<string, ContextPattern>;
  patternUsage: Map<string, number>;
  decisions: any; // LRU cache export
  memory: any; // LRU cache export
  metrics: LearningMetrics;
  timestamp: number;
}

/**
 * Singleton instance for context memory management
 */
export const contextMemoryManager = new ContextMemoryManager();