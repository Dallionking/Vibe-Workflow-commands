/**
 * Token Optimization System
 * Intelligent token usage optimization for context engineering
 */

import { TokenBudget, ContextContent } from '../types/context.types';
import * as crypto from 'crypto';

export interface OptimizationResult {
  originalTokens: number;
  optimizedTokens: number;
  savings: number;
  savingsPercentage: number;
  techniques: string[];
}

export interface OptimizationOptions {
  enableCompression: boolean;
  enableDeduplication: boolean;
  enableSummarization: boolean;
  enableCaching: boolean;
  aggressiveness: 'conservative' | 'moderate' | 'aggressive';
}

export class TokenOptimizer {
  private cache: Map<string, string>;
  private compressionDictionary: Map<string, string>;
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.cache = new Map();
    this.compressionDictionary = new Map();
    this.initializeCompressionDictionary();
  }

  /**
   * Optimize context content to reduce token usage
   */
  async optimizeContent(
    content: ContextContent[],
    budget: TokenBudget,
    options: OptimizationOptions
  ): Promise<{
    optimized: ContextContent[];
    result: OptimizationResult;
  }> {
    const originalTokens = this.calculateTokens(content);
    let optimized = [...content];
    const techniques: string[] = [];

    // Apply optimization techniques based on options
    if (options.enableDeduplication) {
      optimized = await this.deduplicateContent(optimized);
      techniques.push('deduplication');
    }

    if (options.enableCompression) {
      optimized = await this.compressContent(optimized, options.aggressiveness);
      techniques.push('compression');
    }

    if (options.enableSummarization && originalTokens > budget.max) {
      optimized = await this.summarizeContent(optimized, budget, options.aggressiveness);
      techniques.push('summarization');
    }

    if (options.enableCaching) {
      optimized = await this.applyCaching(optimized);
      techniques.push('caching');
    }

    // Calculate results
    const optimizedTokens = this.calculateTokens(optimized);
    const savings = originalTokens - optimizedTokens;
    const savingsPercentage = (savings / originalTokens) * 100;

    return {
      optimized,
      result: {
        originalTokens,
        optimizedTokens,
        savings,
        savingsPercentage,
        techniques
      }
    };
  }

  /**
   * Remove duplicate content across sections
   */
  private async deduplicateContent(
    content: ContextContent[]
  ): Promise<ContextContent[]> {
    const seen = new Map<string, string>();
    const deduplicated: ContextContent[] = [];

    for (const item of content) {
      const contentHash = this.hashContent(item.content);
      
      if (!seen.has(contentHash)) {
        seen.set(contentHash, item.id);
        deduplicated.push(item);
      } else {
        // Keep reference to original
        deduplicated.push({
          ...item,
          content: `[See: ${seen.get(contentHash)}]`,
          metadata: {
            ...item.metadata,
            deduplicated: true,
            originalRef: seen.get(contentHash)
          }
        });
      }
    }

    return deduplicated;
  }

  /**
   * Compress content using various techniques
   */
  private async compressContent(
    content: ContextContent[],
    aggressiveness: string
  ): Promise<ContextContent[]> {
    return content.map(item => {
      let compressed = item.content;

      // Remove extra whitespace
      compressed = compressed.replace(/\s+/g, ' ').trim();

      // Apply dictionary compression
      if (aggressiveness !== 'conservative') {
        compressed = this.applyDictionaryCompression(compressed);
      }

      // Remove comments (for code content)
      if (item.type === 'code' && aggressiveness === 'aggressive') {
        compressed = this.removeComments(compressed);
      }

      // Minify JSON
      if (item.type === 'json') {
        try {
          compressed = JSON.stringify(JSON.parse(compressed));
        } catch {}
      }

      return {
        ...item,
        content: compressed,
        metadata: {
          ...item.metadata,
          compressed: true,
          compressionLevel: aggressiveness
        }
      };
    });
  }

  /**
   * Summarize content intelligently
   */
  private async summarizeContent(
    content: ContextContent[],
    budget: TokenBudget,
    aggressiveness: string
  ): Promise<ContextContent[]> {
    const currentTokens = this.calculateTokens(content);
    const targetTokens = Math.floor(budget.max * 0.8); // Leave 20% buffer
    
    if (currentTokens <= targetTokens) {
      return content;
    }

    // Sort by priority (keep high priority content)
    const sorted = [...content].sort((a, b) => 
      (b.priority || 0) - (a.priority || 0)
    );

    // Calculate reduction needed
    const reductionRatio = targetTokens / currentTokens;
    
    return sorted.map(item => {
      // High priority items are kept intact
      if (item.priority >= 8) {
        return item;
      }

      // Summarize based on content type
      let summarized = item.content;
      
      switch (item.type) {
        case 'documentation':
          summarized = this.summarizeDocumentation(summarized, reductionRatio);
          break;
        case 'code':
          summarized = this.summarizeCode(summarized, reductionRatio);
          break;
        case 'error':
          summarized = this.summarizeError(summarized);
          break;
        default:
          summarized = this.genericSummarize(summarized, reductionRatio);
      }

      return {
        ...item,
        content: summarized,
        metadata: {
          ...item.metadata,
          summarized: true,
          reductionRatio
        }
      };
    });
  }

  /**
   * Apply intelligent caching
   */
  private async applyCaching(
    content: ContextContent[]
  ): Promise<ContextContent[]> {
    const now = Date.now();
    
    return content.map(item => {
      const cacheKey = `${item.id}-${item.version || '1.0'}`;
      const cached = this.cache.get(cacheKey);

      if (cached) {
        const [cachedContent, timestamp] = cached.split('|||');
        const age = now - parseInt(timestamp);
        
        if (age < this.CACHE_TTL) {
          return {
            ...item,
            content: cachedContent,
            metadata: {
              ...item.metadata,
              cached: true,
              cacheAge: age
            }
          };
        }
      }

      // Cache new content
      this.cache.set(cacheKey, `${item.content}|||${now}`);
      
      return item;
    });
  }

  /**
   * Initialize compression dictionary with common patterns
   */
  private initializeCompressionDictionary(): void {
    // Common programming patterns
    this.compressionDictionary.set('function', 'fn');
    this.compressionDictionary.set('return', 'ret');
    this.compressionDictionary.set('const', 'c');
    this.compressionDictionary.set('export', 'exp');
    this.compressionDictionary.set('import', 'imp');
    this.compressionDictionary.set('async', 'as');
    this.compressionDictionary.set('await', 'aw');
    
    // Common words
    this.compressionDictionary.set('component', 'cmp');
    this.compressionDictionary.set('interface', 'if');
    this.compressionDictionary.set('implementation', 'impl');
    this.compressionDictionary.set('configuration', 'cfg');
    this.compressionDictionary.set('initialize', 'init');
  }

  /**
   * Apply dictionary-based compression
   */
  private applyDictionaryCompression(text: string): string {
    let compressed = text;
    
    this.compressionDictionary.forEach((short, long) => {
      // Only replace whole words
      const regex = new RegExp(`\\b${long}\\b`, 'g');
      compressed = compressed.replace(regex, short);
    });
    
    return compressed;
  }

  /**
   * Remove comments from code
   */
  private removeComments(code: string): string {
    // Remove single-line comments
    let cleaned = code.replace(/\/\/.*$/gm, '');
    
    // Remove multi-line comments
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove JSDoc comments
    cleaned = cleaned.replace(/\/\*\*[\s\S]*?\*\//g, '');
    
    return cleaned.trim();
  }

  /**
   * Summarize documentation content
   */
  private summarizeDocumentation(text: string, ratio: number): string {
    const lines = text.split('\n');
    const targetLines = Math.ceil(lines.length * ratio);
    
    // Keep headers and first paragraph of each section
    const summary: string[] = [];
    let inSection = false;
    let sectionLines = 0;
    
    for (const line of lines) {
      if (line.startsWith('#')) {
        // Always keep headers
        summary.push(line);
        inSection = true;
        sectionLines = 0;
      } else if (inSection && sectionLines < 2 && line.trim()) {
        // Keep first 2 lines of each section
        summary.push(line);
        sectionLines++;
      } else if (!line.trim()) {
        inSection = false;
      }
      
      if (summary.length >= targetLines) break;
    }
    
    return summary.join('\n') + '\n[... summarized]';
  }

  /**
   * Summarize code content
   */
  private summarizeCode(code: string, ratio: number): string {
    const lines = code.split('\n');
    
    // Keep imports, class/function signatures, and structure
    const summary: string[] = [];
    let inBody = false;
    let braceCount = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Always keep imports and exports
      if (trimmed.startsWith('import') || trimmed.startsWith('export')) {
        summary.push(line);
      }
      // Keep class and function definitions
      else if (trimmed.match(/^(class|function|const\s+\w+\s*=\s*(async\s*)?\()/)) {
        summary.push(line);
        inBody = true;
      }
      // Keep interface and type definitions
      else if (trimmed.match(/^(interface|type)\s+/)) {
        summary.push(line);
      }
      // Track braces to maintain structure
      else if (inBody) {
        if (trimmed.includes('{')) braceCount++;
        if (trimmed.includes('}')) braceCount--;
        
        if (braceCount === 0) {
          summary.push('  // ... implementation');
          summary.push('}');
          inBody = false;
        }
      }
    }
    
    return summary.join('\n');
  }

  /**
   * Summarize error messages
   */
  private summarizeError(error: string): string {
    const lines = error.split('\n');
    
    // Keep error type and message, truncate stack trace
    const summary: string[] = [];
    let stackStarted = false;
    
    for (const line of lines) {
      if (line.includes('at ') && line.includes('(')) {
        if (!stackStarted) {
          summary.push('[Stack trace truncated - ' + (lines.length - summary.length) + ' lines]');
          stackStarted = true;
        }
      } else {
        summary.push(line);
      }
    }
    
    return summary.join('\n');
  }

  /**
   * Generic text summarization
   */
  private genericSummarize(text: string, ratio: number): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const targetSentences = Math.max(1, Math.ceil(sentences.length * ratio));
    
    // Keep first and last sentences, sample from middle
    if (sentences.length <= targetSentences) {
      return text;
    }
    
    const summary: string[] = [];
    
    // Always keep first sentence
    summary.push(sentences[0]);
    
    // Sample middle sentences
    const middleCount = targetSentences - 2;
    if (middleCount > 0) {
      const step = Math.floor((sentences.length - 2) / middleCount);
      for (let i = 1; i <= middleCount; i++) {
        summary.push(sentences[i * step]);
      }
    }
    
    // Always keep last sentence
    if (targetSentences > 1) {
      summary.push(sentences[sentences.length - 1]);
    }
    
    return summary.join(' ') + ' [... summarized]';
  }

  /**
   * Calculate token count (simplified)
   */
  private calculateTokens(content: ContextContent[]): number {
    // Rough estimation: 1 token ≈ 4 characters
    return content.reduce((total, item) => {
      return total + Math.ceil(item.content.length / 4);
    }, 0);
  }

  /**
   * Hash content for deduplication
   */
  private hashContent(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Get optimization statistics
   */
  getStatistics(): {
    cacheSize: number;
    cacheHitRate: number;
    totalOptimizations: number;
  } {
    return {
      cacheSize: this.cache.size,
      cacheHitRate: 0, // Would track this in production
      totalOptimizations: 0 // Would track this in production
    };
  }

  /**
   * Clear optimization cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}