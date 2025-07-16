/**
 * Context Assembler - Intelligent Context Selection and Assembly
 * Implements priority-based selection with token budget management
 */

import {
  ContextFragment,
  ContextPriority,
  TokenBudget,
  TokenAllocation,
  ContextAssemblyConfig,
  PriorityWeights,
  FallbackStrategy,
  ContextLayers
} from '../types/context.types';

import {
  ContextFragmentFactory,
  FragmentCollection,
  TokenEstimator
} from './context-fragment';

import { globalContextManager } from '../layers/global';
import { phaseContextManager } from '../layers/phase';
import { taskContextManager } from '../layers/task';

/**
 * Context Assembly Result
 */
export interface ContextAssemblyResult {
  fragments: ContextFragment[];
  totalTokens: number;
  budgetUsed: number;
  budgetRemaining: number;
  priorityBreakdown: Record<ContextPriority, number>;
  fallbacksApplied: FallbackApplication[];
  warnings: string[];
}

export interface FallbackApplication {
  strategy: FallbackStrategy;
  fragmentsAffected: string[];
  tokensSaved: number;
  description: string;
}

/**
 * Context Assembler
 * Main class for assembling context with intelligent selection and budget management
 */
export class ContextAssembler {
  private config: ContextAssemblyConfig;
  private fragmentFactory: ContextFragmentFactory;
  private tokenEstimator: TokenEstimator;

  constructor(config?: Partial<ContextAssemblyConfig>) {
    this.fragmentFactory = new ContextFragmentFactory();
    this.tokenEstimator = new TokenEstimator();
    this.config = this.buildDefaultConfig(config);
  }

  /**
   * Assemble context with intelligent selection and budget management
   */
  public async assembleContext(
    commandName?: string,
    additionalFragments: ContextFragment[] = []
  ): Promise<ContextAssemblyResult> {
    const startTime = Date.now();

    // Collect fragments from all layers
    const allFragments = await this.collectAllFragments(commandName);
    allFragments.push(...additionalFragments);

    // Remove expired fragments
    const validFragments = this.removeExpiredFragments(allFragments);

    // Apply intelligent selection
    const selectedFragments = this.selectFragments(validFragments);

    // Apply token budget management
    const budgetResult = this.applyTokenBudget(selectedFragments);

    // Build assembly result
    const result: ContextAssemblyResult = {
      fragments: budgetResult.fragments,
      totalTokens: budgetResult.totalTokens,
      budgetUsed: budgetResult.budgetUsed,
      budgetRemaining: this.config.tokenBudget.total - budgetResult.budgetUsed,
      priorityBreakdown: this.calculatePriorityBreakdown(budgetResult.fragments),
      fallbacksApplied: budgetResult.fallbacksApplied,
      warnings: budgetResult.warnings
    };

    // Log assembly metrics
    this.logAssemblyMetrics(result, Date.now() - startTime);

    return result;
  }

  /**
   * Assemble context for specific command
   */
  public async assembleForCommand(commandName: string): Promise<ContextAssemblyResult> {
    // Get command-specific context requirements
    const commandContext = this.getCommandContext(commandName);

    // Create command fragment
    const commandFragment = this.fragmentFactory.createCommandFragment(
      commandName,
      commandContext.type,
      commandContext.description,
      ContextPriority.HIGH
    );

    return this.assembleContext(commandName, [commandFragment]);
  }

  /**
   * Update assembly configuration
   */
  public updateConfig(updates: Partial<ContextAssemblyConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get current configuration
   */
  public getConfig(): ContextAssemblyConfig {
    return { ...this.config };
  }

  // Private implementation methods

  /**
   * Collect fragments from all context layers (Optimized with parallel loading)
   */
  private async collectAllFragments(commandName?: string): Promise<ContextFragment[]> {
    const fragments: ContextFragment[] = [];

    try {
      // Parallel loading for better performance
      const [globalContext, phaseContext, taskContext] = await Promise.all([
        Promise.resolve(globalContextManager.getContext()),
        Promise.resolve(phaseContextManager.getCurrentPhase()),
        Promise.resolve(taskContextManager.getCurrentTask())
      ]);

      // L1: Global Context Fragments
      if (globalContext) {
        fragments.push(...this.extractGlobalFragments(globalContext));
      }

      // L2: Phase Context Fragments
      if (phaseContext) {
        fragments.push(...this.extractPhaseFragments(phaseContext));
      }

      // L3: Task Context Fragments
      if (taskContext) {
        fragments.push(...this.extractTaskFragments(taskContext, commandName));
      }

      return fragments;
    } catch (error) {
      console.warn('Warning: Error collecting context fragments:', error instanceof Error ? error.message : String(error));
      return fragments; // Return partial results on error
    }
  }

  /**
   * Extract fragments from global context
   */
  private extractGlobalFragments(globalContext: any): ContextFragment[] {
    const fragments: ContextFragment[] = [];

    // Global rules fragment
    const rulesContent = globalContext.rules
      .filter((rule: any) => rule.enabled)
      .map((rule: any) => `${rule.name}: ${rule.rule}`)
      .join('\n');

    if (rulesContent) {
      fragments.push(
        this.fragmentFactory.createGlobalFragment('rules', rulesContent, ContextPriority.CRITICAL)
      );
    }

    // Global configuration fragment
    const configContent = this.buildGlobalConfigContent(globalContext);
    if (configContent) {
      fragments.push(
        this.fragmentFactory.createGlobalFragment('config', configContent, ContextPriority.HIGH)
      );
    }

    return fragments;
  }

  /**
   * Extract fragments from phase context
   */
  private extractPhaseFragments(phaseContext: any): ContextFragment[] {
    const fragments: ContextFragment[] = [];

    // Phase context fragment
    const phaseContent = phaseContextManager.getPhaseSummary();
    fragments.push(
      this.fragmentFactory.createPhaseFragment(
        phaseContext.phaseNumber,
        phaseContext.phaseName,
        'context',
        phaseContent,
        ContextPriority.HIGH
      )
    );

    // Phase history fragment (if significant progress)
    if (phaseContext.data.progress.completionPercentage > 10) {
      const historyContent = this.buildPhaseHistoryContent(phaseContext);
      fragments.push(
        this.fragmentFactory.createPhaseFragment(
          phaseContext.phaseNumber,
          phaseContext.phaseName,
          'history',
          historyContent,
          ContextPriority.MEDIUM
        )
      );
    }

    return fragments;
  }

  /**
   * Extract fragments from task context
   */
  private extractTaskFragments(taskContext: any, commandName?: string): ContextFragment[] {
    const fragments: ContextFragment[] = [];

    // Current task fragment
    const taskContent = taskContextManager.getTaskSummary();
    fragments.push(
      this.fragmentFactory.createTaskFragment(
        taskContext.taskId,
        taskContext.taskType,
        'context',
        taskContent,
        ContextPriority.HIGH
      )
    );

    // Command-specific task state
    if (commandName) {
      const commandContext = taskContextManager.getContextForCommand(commandName);
      const stateContent = this.buildTaskStateContent(commandContext);
      fragments.push(
        this.fragmentFactory.createTaskFragment(
          taskContext.taskId,
          taskContext.taskType,
          'state',
          stateContent,
          ContextPriority.MEDIUM
        )
      );
    }

    return fragments;
  }

  /**
   * Remove expired fragments
   */
  private removeExpiredFragments(fragments: ContextFragment[]): ContextFragment[] {
    return fragments.filter(fragment => !this.fragmentFactory.isExpired(fragment));
  }

  /**
   * Select fragments using intelligent algorithm
   */
  private selectFragments(fragments: ContextFragment[]): ContextFragment[] {
    // Sort by priority and relevance
    const sorted = fragments.sort((a, b) => {
      // Primary sort: priority
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }

      // Secondary sort: freshness (newer first)
      return b.metadata.lastModified - a.metadata.lastModified;
    });

    // Apply priority weights
    const weighted = this.applyPriorityWeights(sorted);

    return weighted;
  }

  /**
   * Apply priority weights to fragment selection
   */
  private applyPriorityWeights(fragments: ContextFragment[]): ContextFragment[] {
    const weights = this.config.priorityWeights;
    const selected: ContextFragment[] = [];

    // Calculate token allocation per priority
    const totalBudget = this.config.tokenBudget.available;
    const allocations = this.calculatePriorityAllocations(totalBudget);

    // Select fragments within each priority allocation
    for (const priority of [
      ContextPriority.CRITICAL,
      ContextPriority.HIGH,
      ContextPriority.MEDIUM,
      ContextPriority.LOW,
      ContextPriority.MINIMAL
    ]) {
      const priorityFragments = fragments.filter(f => f.priority === priority);
      const allocation = allocations[priority] || 0;

      const selectedInPriority = this.selectWithinBudget(priorityFragments, allocation);
      selected.push(...selectedInPriority);
    }

    return selected;
  }

  /**
   * Apply token budget management
   */
  private applyTokenBudget(fragments: ContextFragment[]): BudgetResult {
    const budget = this.config.tokenBudget;
    const fallbacksApplied: FallbackApplication[] = [];
    const warnings: string[] = [];
    let currentFragments = [...fragments];

    // Calculate initial token usage
    let totalTokens = this.tokenEstimator.estimateTotal(currentFragments);

    // Apply fallback strategies if over budget
    if (totalTokens > budget.available) {
      const fallbackResult = this.applyFallbackStrategies(currentFragments, budget.available);
      currentFragments = fallbackResult.fragments;
      totalTokens = fallbackResult.totalTokens;
      fallbacksApplied.push(...fallbackResult.fallbacksApplied);
      warnings.push(...fallbackResult.warnings);
    }

    return {
      fragments: currentFragments,
      totalTokens,
      budgetUsed: totalTokens,
      fallbacksApplied,
      warnings
    };
  }

  /**
   * Apply fallback strategies when over budget
   */
  private applyFallbackStrategies(
    fragments: ContextFragment[],
    budget: number
  ): FallbackResult {
    let currentFragments = [...fragments];
    let totalTokens = this.tokenEstimator.estimateTotal(currentFragments);
    const fallbacksApplied: FallbackApplication[] = [];
    const warnings: string[] = [];

    while (totalTokens > budget && currentFragments.length > 0) {
      const strategy = this.config.fallbackStrategy;

      switch (strategy) {
      case 'truncate-lowest-priority':
        const removed = this.removeLowPriorityFragments(currentFragments, 1);
        currentFragments = removed.remaining;
        if (removed.removed.length > 0) {
          fallbacksApplied.push({
            strategy,
            fragmentsAffected: removed.removed.map(f => f.id),
            tokensSaved: this.tokenEstimator.estimateTotal(removed.removed),
            description: `Removed ${removed.removed.length} low priority fragments`
          });
        }
        break;

      case 'compress-content':
        const compressed = this.compressFragments(currentFragments, budget);
        currentFragments = compressed.fragments;
        fallbacksApplied.push({
          strategy,
          fragmentsAffected: compressed.affectedIds,
          tokensSaved: compressed.tokensSaved,
          description: `Compressed ${compressed.affectedIds.length} fragments`
        });
        break;

      case 'truncate-oldest':
        const oldest = this.removeOldestFragments(currentFragments, 1);
        currentFragments = oldest.remaining;
        if (oldest.removed.length > 0) {
          fallbacksApplied.push({
            strategy,
            fragmentsAffected: oldest.removed.map(f => f.id),
            tokensSaved: this.tokenEstimator.estimateTotal(oldest.removed),
            description: `Removed ${oldest.removed.length} oldest fragments`
          });
        }
        break;

      case 'fail-fast':
        warnings.push(`Token budget exceeded: ${totalTokens} > ${budget}`);
        break;

      default:
        warnings.push(`Unknown fallback strategy: ${strategy}`);
        break;
      }

      totalTokens = this.tokenEstimator.estimateTotal(currentFragments);
    }

    return {
      fragments: currentFragments,
      totalTokens,
      fallbacksApplied,
      warnings
    };
  }

  // Helper methods for fallback strategies

  private removeLowPriorityFragments(
    fragments: ContextFragment[],
    count: number
  ): { remaining: ContextFragment[]; removed: ContextFragment[] } {
    const sorted = [...fragments].sort((a, b) => a.priority - b.priority);
    const removed = sorted.splice(0, count);
    return { remaining: sorted, removed };
  }

  private compressFragments(
    fragments: ContextFragment[],
    budget: number
  ): { fragments: ContextFragment[]; affectedIds: string[]; tokensSaved: number } {
    const targetTokensPerFragment = Math.floor(budget / fragments.length);
    let tokensSaved = 0;
    const affectedIds: string[] = [];

    const compressed = fragments.map(fragment => {
      if (fragment.tokenEstimate > targetTokensPerFragment) {
        const originalTokens = fragment.tokenEstimate;
        const compressedFragment = this.fragmentFactory.compressFragment(
          fragment,
          targetTokensPerFragment
        );
        tokensSaved += originalTokens - compressedFragment.tokenEstimate;
        affectedIds.push(fragment.id);
        return compressedFragment;
      }
      return fragment;
    });

    return { fragments: compressed, affectedIds, tokensSaved };
  }

  private removeOldestFragments(
    fragments: ContextFragment[],
    count: number
  ): { remaining: ContextFragment[]; removed: ContextFragment[] } {
    const sorted = [...fragments].sort((a, b) => a.metadata.created - b.metadata.created);
    const removed = sorted.splice(0, count);
    return { remaining: sorted, removed };
  }

  // Utility and configuration methods

  private buildDefaultConfig(config?: Partial<ContextAssemblyConfig>): ContextAssemblyConfig {
    const defaultBudget: TokenBudget = {
      total: 8000,
      reserved: 1000,
      available: 7000,
      used: 0,
      allocation: {
        global: 2000,
        phase: 2000,
        task: 2000,
        memory: 500,
        buffer: 500
      }
    };

    const defaultWeights: PriorityWeights = {
      [ContextPriority.CRITICAL]: 1.0,
      [ContextPriority.HIGH]: 0.8,
      [ContextPriority.MEDIUM]: 0.6,
      [ContextPriority.LOW]: 0.4,
      [ContextPriority.MINIMAL]: 0.2
    };

    return {
      tokenBudget: config?.tokenBudget || defaultBudget,
      priorityWeights: config?.priorityWeights || defaultWeights,
      fallbackStrategy: config?.fallbackStrategy || 'truncate-lowest-priority',
      cacheConfig: config?.cacheConfig || {
        maxSize: 1000,
        ttl: 3600000, // 1 hour
        strategy: 'lru',
        persistToDisk: false
      }
    };
  }

  private calculatePriorityAllocations(totalBudget: number): Record<ContextPriority, number> {
    const weights = this.config.priorityWeights;
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    return {
      [ContextPriority.CRITICAL]: Math.floor((totalBudget * weights[ContextPriority.CRITICAL]) / totalWeight),
      [ContextPriority.HIGH]: Math.floor((totalBudget * weights[ContextPriority.HIGH]) / totalWeight),
      [ContextPriority.MEDIUM]: Math.floor((totalBudget * weights[ContextPriority.MEDIUM]) / totalWeight),
      [ContextPriority.LOW]: Math.floor((totalBudget * weights[ContextPriority.LOW]) / totalWeight),
      [ContextPriority.MINIMAL]: Math.floor((totalBudget * weights[ContextPriority.MINIMAL]) / totalWeight)
    };
  }

  private selectWithinBudget(fragments: ContextFragment[], budget: number): ContextFragment[] {
    const selected: ContextFragment[] = [];
    let usedTokens = 0;

    for (const fragment of fragments) {
      if (usedTokens + fragment.tokenEstimate <= budget) {
        selected.push(fragment);
        usedTokens += fragment.tokenEstimate;
      }
    }

    return selected;
  }

  private calculatePriorityBreakdown(fragments: ContextFragment[]): Record<ContextPriority, number> {
    const breakdown: Record<ContextPriority, number> = {
      [ContextPriority.CRITICAL]: 0,
      [ContextPriority.HIGH]: 0,
      [ContextPriority.MEDIUM]: 0,
      [ContextPriority.LOW]: 0,
      [ContextPriority.MINIMAL]: 0
    };

    fragments.forEach(fragment => {
      breakdown[fragment.priority] += fragment.tokenEstimate;
    });

    return breakdown;
  }

  private getCommandContext(commandName: string): { type: string; description: string } {
    const commandContexts: Record<string, { type: string; description: string }> = {
      'Read': { type: 'file-operation', description: 'Reading file content for analysis or processing' },
      'Write': { type: 'file-operation', description: 'Writing content to file with validation' },
      'Edit': { type: 'file-operation', description: 'Editing existing file with precise modifications' },
      'Bash': { type: 'system-operation', description: 'Executing system command with safety checks' },
      'TodoWrite': { type: 'task-management', description: 'Managing task list and progress tracking' },
      'UltraThink': { type: 'analysis', description: 'Deep analysis and planning with multiple perspectives' },
      'WebFetch': { type: 'research', description: 'Fetching and analyzing web content' },
      'WebSearch': { type: 'research', description: 'Searching for relevant information online' }
    };

    return commandContexts[commandName] || { type: 'unknown', description: 'Unknown command context' };
  }

  private buildGlobalConfigContent(globalContext: any): string {
    const mcpTools = globalContext.configuration.mcpTools
      .filter((tool: any) => tool.enabled)
      .map((tool: any) => `${tool.name} (Priority: ${tool.priority})`)
      .join(', ');

    const qualityStandards = globalContext.configuration.qualityStandards
      .map((standard: any) => `${standard.name}: ${standard.threshold}%`)
      .join(', ');

    return `MCP Tools: ${mcpTools}\nQuality Standards: ${qualityStandards}`;
  }

  private buildPhaseHistoryContent(phaseContext: any): string {
    const { completedTasks, blockers } = phaseContext.phaseState;
    const recentTasks = completedTasks.slice(-5).join(', ');
    const activeBlockers = blockers.filter((b: any) => !b.resolution).length;

    return `Recent Tasks: ${recentTasks}\nActive Blockers: ${activeBlockers}\nProgress: ${phaseContext.data.progress.completionPercentage}%`;
  }

  private buildTaskStateContent(commandContext: any): string {
    const params = commandContext.relevantParameters
      .map((p: any) => `${p.name}: ${p.value}`)
      .join(', ');

    return `Command: ${commandContext.commandName}\nType: ${commandContext.taskType}\nParameters: ${params}`;
  }

  private logAssemblyMetrics(result: ContextAssemblyResult, assemblyTime: number): void {
    console.log(`Context Assembly Metrics:
Fragments: ${result.fragments.length}
Tokens Used: ${result.totalTokens}
Budget Utilization: ${((result.budgetUsed / (result.budgetUsed + result.budgetRemaining)) * 100).toFixed(1)}%
Assembly Time: ${assemblyTime}ms
Fallbacks Applied: ${result.fallbacksApplied.length}
Warnings: ${result.warnings.length}`);
  }
}

// Supporting interfaces
interface BudgetResult {
  fragments: ContextFragment[];
  totalTokens: number;
  budgetUsed: number;
  fallbacksApplied: FallbackApplication[];
  warnings: string[];
}

interface FallbackResult {
  fragments: ContextFragment[];
  totalTokens: number;
  fallbacksApplied: FallbackApplication[];
  warnings: string[];
}

/**
 * Singleton instance
 */
export const contextAssembler = new ContextAssembler();
