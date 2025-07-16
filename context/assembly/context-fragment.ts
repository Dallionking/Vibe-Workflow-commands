/**
 * Context Fragment Implementation
 * Atomic units of context information with priority and token management
 */

import {
  ContextFragment,
  ContextFragmentType,
  ContextPriority,
  ContextMetadata,
  FragmentValidation,
  ValidationError,
  ValidationWarning
} from '../types/context.types';

/**
 * Context Fragment Factory
 * Creates and manages context fragments with proper validation and token estimation
 */
export class ContextFragmentFactory {
  private tokenEstimator: TokenEstimator;

  constructor() {
    this.tokenEstimator = new TokenEstimator();
  }

  /**
   * Create a new context fragment
   */
  public createFragment(
    type: ContextFragmentType,
    content: string,
    priority: ContextPriority,
    metadata: Partial<ContextMetadata>
  ): ContextFragment {
    const id = this.generateFragmentId(type);
    const tokenEstimate = this.tokenEstimator.estimate(content);
    const timestamp = Date.now();

    const fullMetadata: ContextMetadata = {
      source: metadata.source || { type: 'external', provider: 'unknown', dataType: 'text' },
      priority,
      ttl: metadata.ttl,
      tags: metadata.tags || [type],
      dependencies: metadata.dependencies || [],
      created: timestamp,
      lastModified: timestamp
    };

    const validation = this.validateContent(type, content);

    return {
      id,
      type,
      content,
      priority,
      tokenEstimate,
      metadata: fullMetadata,
      validation
    };
  }

  /**
   * Create fragment from global context
   */
  public createGlobalFragment(
    subtype: 'rules' | 'config',
    content: string,
    priority: ContextPriority = ContextPriority.HIGH
  ): ContextFragment {
    const type: ContextFragmentType = subtype === 'rules' ? 'global-rules' : 'global-config';

    return this.createFragment(type, content, priority, {
      source: { type: 'global', scope: 'system' },
      tags: ['global', subtype],
      ttl: undefined // Global context doesn't expire
    });
  }

  /**
   * Create fragment from phase context
   */
  public createPhaseFragment(
    phaseNumber: number,
    phaseName: string,
    subtype: 'context' | 'history',
    content: string,
    priority: ContextPriority = ContextPriority.MEDIUM
  ): ContextFragment {
    const type: ContextFragmentType = subtype === 'context' ? 'phase-context' : 'phase-history';

    return this.createFragment(type, content, priority, {
      source: { type: 'phase', phaseNumber, phaseName },
      tags: ['phase', `phase-${phaseNumber}`, subtype],
      ttl: 24 * 60 * 60 * 1000 // 24 hours
    });
  }

  /**
   * Create fragment from task context
   */
  public createTaskFragment(
    taskId: string,
    taskType: string,
    subtype: 'context' | 'state',
    content: string,
    priority: ContextPriority = ContextPriority.MEDIUM
  ): ContextFragment {
    const type: ContextFragmentType = subtype === 'context' ? 'task-context' : 'task-state';

    return this.createFragment(type, content, priority, {
      source: { type: 'task', taskId, taskType },
      tags: ['task', taskType, subtype],
      ttl: 60 * 60 * 1000 // 1 hour
    });
  }

  /**
   * Create fragment from memory
   */
  public createMemoryFragment(
    memoryType: 'pattern' | 'decision',
    content: string,
    priority: ContextPriority = ContextPriority.LOW
  ): ContextFragment {
    const type: ContextFragmentType = `memory-${memoryType}`;

    return this.createFragment(type, content, priority, {
      source: { type: 'memory', memoryType },
      tags: ['memory', memoryType],
      ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  /**
   * Create fragment from command context
   */
  public createCommandFragment(
    commandName: string,
    commandType: string,
    content: string,
    priority: ContextPriority = ContextPriority.MEDIUM
  ): ContextFragment {
    return this.createFragment('command-context', content, priority, {
      source: { type: 'command', commandName, commandType },
      tags: ['command', commandName, commandType],
      ttl: 30 * 60 * 1000 // 30 minutes
    });
  }

  /**
   * Update fragment content and recalculate tokens
   */
  public updateFragment(fragment: ContextFragment, newContent: string): ContextFragment {
    const updatedFragment = { ...fragment };
    updatedFragment.content = newContent;
    updatedFragment.tokenEstimate = this.tokenEstimator.estimate(newContent);
    updatedFragment.metadata.lastModified = Date.now();
    updatedFragment.validation = this.validateContent(fragment.type, newContent);

    return updatedFragment;
  }

  /**
   * Check if fragment is expired
   */
  public isExpired(fragment: ContextFragment): boolean {
    if (!fragment.metadata.ttl) {
      return false; // No TTL means never expires
    }

    const now = Date.now();
    const expirationTime = fragment.metadata.created + fragment.metadata.ttl;
    return now > expirationTime;
  }

  /**
   * Compress fragment content to reduce token usage
   */
  public compressFragment(fragment: ContextFragment, targetTokens: number): ContextFragment {
    if (fragment.tokenEstimate <= targetTokens) {
      return fragment; // Already within target
    }

    const compressionRatio = targetTokens / fragment.tokenEstimate;
    const targetLength = Math.floor(fragment.content.length * compressionRatio);

    // Simple compression: truncate and add summary
    const truncatedContent = fragment.content.substring(0, targetLength - 50);
    const compressedContent = `${truncatedContent  }\n... [content compressed]`;

    return this.updateFragment(fragment, compressedContent);
  }

  // Private helper methods

  private generateFragmentId(type: ContextFragmentType): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${type}-${timestamp}-${random}`;
  }

  private validateContent(type: ContextFragmentType, content: string): FragmentValidation {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic validation
    if (!content || content.trim().length === 0) {
      errors.push({
        code: 'EMPTY_CONTENT',
        message: 'Fragment content cannot be empty',
        severity: 'error'
      });
    }

    // Type-specific validation
    switch (type) {
    case 'global-rules':
      this.validateGlobalRules(content, errors, warnings);
      break;
    case 'phase-context':
      this.validatePhaseContext(content, errors, warnings);
      break;
    case 'task-context':
      this.validateTaskContext(content, errors, warnings);
      break;
    }

    // Token limit warnings
    const tokens = this.tokenEstimator.estimate(content);
    if (tokens > 1000) {
      warnings.push({
        code: 'HIGH_TOKEN_COUNT',
        message: `Fragment has ${tokens} tokens, consider compression`,
        suggestion: 'Use compressFragment() to reduce token usage'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      lastValidated: Date.now()
    };
  }

  private validateGlobalRules(content: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Check for required global rule patterns
    const requiredPatterns = ['systematic', 'quality', 'context'];
    const missingPatterns = requiredPatterns.filter(pattern =>
      !content.toLowerCase().includes(pattern)
    );

    if (missingPatterns.length > 0) {
      warnings.push({
        code: 'MISSING_RULE_PATTERNS',
        message: `Missing recommended patterns: ${missingPatterns.join(', ')}`,
        suggestion: 'Consider including systematic development, quality standards, and context preservation rules'
      });
    }
  }

  private validatePhaseContext(content: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Check for phase context structure
    const requiredElements = ['objective', 'progress', 'tasks'];
    const missingElements = requiredElements.filter(element =>
      !content.toLowerCase().includes(element)
    );

    if (missingElements.length > 0) {
      warnings.push({
        code: 'INCOMPLETE_PHASE_CONTEXT',
        message: `Missing phase elements: ${missingElements.join(', ')}`,
        suggestion: 'Include phase objectives, progress status, and task information'
      });
    }
  }

  private validateTaskContext(content: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Check for task context structure
    if (!content.includes('task') && !content.includes('objective')) {
      warnings.push({
        code: 'UNCLEAR_TASK_CONTEXT',
        message: 'Task context should clearly describe the task and its objective',
        suggestion: 'Include task description and objective in the content'
      });
    }
  }
}

/**
 * Token Estimator
 * Estimates token count for text content
 */
export class TokenEstimator {
  private readonly AVG_CHARS_PER_TOKEN = 3.5; // Average for English text
  private readonly tokenCache = new Map<string, number>();

  /**
   * Estimate token count for content
   */
  public estimate(content: string): number {
    // Check cache first
    if (this.tokenCache.has(content)) {
      return this.tokenCache.get(content)!;
    }

    // Simple estimation based on character count
    // More sophisticated tokenization could be added later
    const estimate = Math.ceil(content.length / this.AVG_CHARS_PER_TOKEN);

    // Cache result
    this.tokenCache.set(content, estimate);

    // Clean cache if it gets too large
    if (this.tokenCache.size > 1000) {
      const firstKey = this.tokenCache.keys().next().value;
      if (firstKey) {
        this.tokenCache.delete(firstKey);
      }
    }

    return estimate;
  }

  /**
   * Estimate token count for multiple fragments
   */
  public estimateTotal(fragments: ContextFragment[]): number {
    return fragments.reduce((total, fragment) => total + fragment.tokenEstimate, 0);
  }

  /**
   * Clear token cache
   */
  public clearCache(): void {
    this.tokenCache.clear();
  }
}

/**
 * Fragment Collection
 * Manages collections of context fragments with utility methods
 */
export class FragmentCollection {
  private fragments: Map<string, ContextFragment> = new Map();

  /**
   * Add fragment to collection
   */
  public add(fragment: ContextFragment): void {
    this.fragments.set(fragment.id, fragment);
  }

  /**
   * Remove fragment from collection
   */
  public remove(fragmentId: string): boolean {
    return this.fragments.delete(fragmentId);
  }

  /**
   * Get fragment by ID
   */
  public get(fragmentId: string): ContextFragment | undefined {
    return this.fragments.get(fragmentId);
  }

  /**
   * Get all fragments
   */
  public getAll(): ContextFragment[] {
    return Array.from(this.fragments.values());
  }

  /**
   * Get fragments by type
   */
  public getByType(type: ContextFragmentType): ContextFragment[] {
    return this.getAll().filter(fragment => fragment.type === type);
  }

  /**
   * Get fragments by priority (minimum priority)
   */
  public getByPriority(minPriority: ContextPriority): ContextFragment[] {
    return this.getAll().filter(fragment => fragment.priority >= minPriority);
  }

  /**
   * Get fragments sorted by priority (highest first)
   */
  public getSortedByPriority(): ContextFragment[] {
    return this.getAll().sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove expired fragments
   */
  public removeExpired(factory: ContextFragmentFactory): number {
    let removedCount = 0;

    for (const [id, fragment] of this.fragments) {
      if (factory.isExpired(fragment)) {
        this.fragments.delete(id);
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Get total token count
   */
  public getTotalTokens(): number {
    return this.getAll().reduce((total, fragment) => total + fragment.tokenEstimate, 0);
  }

  /**
   * Clear all fragments
   */
  public clear(): void {
    this.fragments.clear();
  }

  /**
   * Get collection size
   */
  public size(): number {
    return this.fragments.size;
  }
}

/**
 * Singleton instances
 */
export const contextFragmentFactory = new ContextFragmentFactory();
export const tokenEstimator = new TokenEstimator();
