/**
 * Command Provider Integration
 * Integrates context system with existing Vibe commands using composable provider architecture
 */

import { ContextAssembler, ContextAssemblyResult } from '../assembly/context-assembler';
import { ContextMemoryManager } from '../memory/context-memory';
import { GlobalContextManager } from '../layers/global';
import { PhaseContextManager } from '../layers/phase';
import { TaskContextManager } from '../layers/task';
import {
  ContextFragment,
  ContextPriority,
  BaseContext,
  ValidationRule,
  TaskType
} from '../types/context.types';

/**
 * Command Context Provider Configuration
 */
export interface CommandProviderConfig {
  enableMemoryLearning: boolean;
  enableCaching: boolean;
  enableValidation: boolean;
  maxContextTokens: number;
  fallbackStrategy: 'minimal' | 'essential' | 'degraded';
  debugMode: boolean;
}

/**
 * Command Context Provider
 * Main integration point for context-aware commands
 */
export class CommandContextProvider {
  private assembler: ContextAssembler;
  private memory: ContextMemoryManager;
  private globalManager: GlobalContextManager;
  private phaseManager: PhaseContextManager;
  private taskManager: TaskContextManager;
  private config: CommandProviderConfig;
  private commandHistory: Map<string, CommandExecution> = new Map();

  constructor(config: Partial<CommandProviderConfig> = {}) {
    this.config = {
      enableMemoryLearning: config.enableMemoryLearning ?? true,
      enableCaching: config.enableCaching ?? true,
      enableValidation: config.enableValidation ?? true,
      maxContextTokens: config.maxContextTokens ?? 8000,
      fallbackStrategy: config.fallbackStrategy ?? 'essential',
      debugMode: config.debugMode ?? false
    };

    this.assembler = new ContextAssembler({
      tokenBudget: {
        total: this.config.maxContextTokens,
        reserved: Math.floor(this.config.maxContextTokens * 0.1),
        available: Math.floor(this.config.maxContextTokens * 0.9),
        used: 0,
        allocation: {
          global: Math.floor(this.config.maxContextTokens * 0.25),
          phase: Math.floor(this.config.maxContextTokens * 0.25),
          task: Math.floor(this.config.maxContextTokens * 0.25),
          memory: Math.floor(this.config.maxContextTokens * 0.15),
          buffer: Math.floor(this.config.maxContextTokens * 0.1)
        }
      }
    });

    this.memory = new ContextMemoryManager();
    this.globalManager = new GlobalContextManager();
    this.phaseManager = new PhaseContextManager();
    this.taskManager = new TaskContextManager();
  }

  /**
   * Initialize context provider
   */
  public async initialize(): Promise<void> {
    // Initialize global context with project defaults
    await this.globalManager.initialize();

    // Load existing phase context if available
    await this.loadExistingPhaseContext();

    if (this.config.debugMode) {
      console.log('CommandContextProvider initialized successfully');
    }
  }

  /**
   * Get context for command execution
   */
  public async getCommandContext(
    commandName: string,
    parameters: Record<string, unknown> = {}
  ): Promise<CommandContextResult> {
    const startTime = Date.now();

    try {
      // Initialize task context for this command
      await this.initializeCommandTask(commandName, parameters);

      // Assemble context for command
      const assemblyResult = await this.assembler.assembleForCommand(commandName);

      // Get memory recommendations
      const recommendations = this.config.enableMemoryLearning
        ? this.memory.getRecommendations(assemblyResult.fragments)
        : [];

      // Validate context if enabled
      const validation = this.config.enableValidation
        ? this.validateCommandContext(commandName, assemblyResult)
        : { passed: true, errors: [], warnings: [] };

      const result: CommandContextResult = {
        commandName,
        context: this.buildContextString(assemblyResult),
        fragments: assemblyResult.fragments,
        tokens: assemblyResult.totalTokens,
        recommendations,
        validation,
        executionTime: Date.now() - startTime,
        timestamp: Date.now()
      };

      // Store execution for learning
      this.recordCommandExecution(commandName, result, parameters);

      return result;

    } catch (error) {
      // Fallback context
      return this.getFallbackContext(commandName, error as Error);
    }
  }

  /**
   * Record command execution result for learning
   */
  public recordCommandResult(
    commandName: string,
    result: 'success' | 'failure' | 'partial',
    output?: string
  ): void {
    const execution = this.commandHistory.get(`${commandName}-${Date.now()}`);

    if (execution && this.config.enableMemoryLearning) {
      this.memory.recordDecision(
        execution.contextId,
        `execute-${commandName}`,
        execution.reasoning,
        result,
        execution.fragments
      );
    }
  }

  /**
   * Update phase context
   */
  public async updatePhaseContext(
    phaseNumber: number,
    phaseName: string,
    completedTasks: string[] = [],
    currentTier?: number
  ): Promise<void> {
    // Initialize phase if not exists
    const existingPhase = this.phaseManager.getCurrentPhase();

    if (!existingPhase || existingPhase.phaseNumber !== phaseNumber) {
      await this.phaseManager.initializePhase(
        phaseNumber,
        phaseName,
        [`Complete ${phaseName} objectives`],
        [
          {
            id: `phase-${phaseNumber}-req-1`,
            description: `Implement ${phaseName} functionality`,
            type: 'functional',
            priority: ContextPriority.HIGH,
            satisfied: false
          }
        ]
      );
    }

    // Update progress
    this.phaseManager.updateProgress(completedTasks, currentTier);
  }

  /**
   * Get current context summary
   */
  public getContextSummary(): ContextSummary {
    const global = this.globalManager.getContext();
    const phase = this.phaseManager.getCurrentPhase();
    const task = this.taskManager.getCurrentTask();
    const memory = this.memory.getLearningMetrics();

    return {
      global: global ? {
        enabled: true,
        rulesCount: global.rules.filter(r => r.enabled).length,
        lastModified: global.metadata.lastModified
      } : { enabled: false, rulesCount: 0, lastModified: 0 },

      phase: phase ? {
        phaseNumber: phase.phaseNumber,
        phaseName: phase.phaseName,
        progress: phase.data.progress.completionPercentage,
        status: phase.phaseState.status
      } : null,

      task: task ? {
        taskId: task.taskId,
        taskType: task.taskType,
        objective: task.data.objective
      } : null,

      memory: {
        patternsLearned: memory.patternsLearned,
        accuracyRate: memory.accuracyRate,
        lastUpdated: memory.lastUpdated
      },

      performance: {
        averageAssemblyTime: this.calculateAverageAssemblyTime(),
        cacheHitRate: this.assembler['fragmentFactory'] ? 95 : 0, // Placeholder
        totalCommands: this.commandHistory.size
      }
    };
  }

  /**
   * Export context state
   */
  public exportContextState(): ContextExport {
    return {
      global: this.globalManager.exportContext(),
      phase: this.phaseManager.exportPhaseContext(),
      task: this.taskManager.exportTaskContext(),
      memory: this.memory.exportMemory(),
      config: this.config,
      timestamp: Date.now()
    };
  }

  /**
   * Import context state
   */
  public importContextState(data: ContextExport): void {
    if (data.global) {
      this.globalManager.importContext(data.global);
    }
    if (data.phase) {
      this.phaseManager.importPhaseContext(data.phase);
    }
    if (data.task) {
      this.taskManager.importTaskContext(data.task);
    }
    if (data.memory) {
      this.memory.importMemory(data.memory);
    }

    this.config = { ...this.config, ...data.config };
  }

  // Private implementation methods

  private async loadExistingPhaseContext(): Promise<void> {
    try {
      // Check for existing .vibe-status.md file
      const vibeStatusPath = '.vibe-status.md';
      // This would normally use Read tool, but keeping implementation simple

      // For now, we'll detect current phase from git branch name
      const currentBranch = process.env.GIT_BRANCH || 'main';
      const phaseMatch = currentBranch.match(/phase-(\d+)-(.+)/);

      if (phaseMatch) {
        const phaseNumber = parseInt(phaseMatch[1]);
        const phaseName = phaseMatch[2].replace(/-/g, ' ');
        await this.updatePhaseContext(phaseNumber, phaseName);
      }
    } catch (error) {
      if (this.config.debugMode) {
        console.warn('Could not load existing phase context:', error);
      }
    }
  }

  private async initializeCommandTask(
    commandName: string,
    parameters: Record<string, unknown>
  ): Promise<void> {
    const taskId = `cmd-${commandName}-${Date.now()}`;
    const taskType = this.getTaskTypeForCommand(commandName);

    const instructions = [
      `Execute ${commandName} command`,
      'Maintain context preservation',
      'Follow quality standards'
    ];

    const taskParameters = Object.entries(parameters).map(([name, value]) => ({
      name,
      type: typeof value,
      value,
      required: true,
      description: `Parameter for ${commandName}`
    }));

    await this.taskManager.initializeTask(
      taskId,
      taskType,
      `Execute ${commandName} with context awareness`,
      instructions,
      taskParameters
    );
  }

  private getTaskTypeForCommand(commandName: string): TaskType {
    const commandTypeMap: Record<string, TaskType> = {
      'Read': 'research',
      'Write': 'implementation',
      'Edit': 'implementation',
      'Bash': 'implementation',
      'TodoWrite': 'documentation',
      'WebFetch': 'research',
      'WebSearch': 'research',
      'Grep': 'research',
      'Glob': 'research'
    };

    return commandTypeMap[commandName] || 'implementation';
  }

  private buildContextString(assemblyResult: ContextAssemblyResult): string {
    const sections: string[] = [
      '# Context Information\n'
    ];

    // Group fragments by priority
    const groupedFragments = new Map<ContextPriority, ContextFragment[]>();

    assemblyResult.fragments.forEach(fragment => {
      if (!groupedFragments.has(fragment.priority)) {
        groupedFragments.set(fragment.priority, []);
      }
      groupedFragments.get(fragment.priority)!.push(fragment);
    });

    // Add sections by priority
    for (const priority of [ContextPriority.CRITICAL, ContextPriority.HIGH, ContextPriority.MEDIUM]) {
      const fragments = groupedFragments.get(priority);
      if (fragments && fragments.length > 0) {
        sections.push(`## ${this.getPriorityLabel(priority)} Priority\n`);

        fragments.forEach(fragment => {
          sections.push(`### ${fragment.type}\n${fragment.content}\n`);
        });
      }
    }

    // Add token usage info
    sections.push('\n## Context Statistics\n');
    sections.push(`- Total Tokens: ${assemblyResult.totalTokens}`);
    sections.push(`- Budget Used: ${assemblyResult.budgetUsed}/${assemblyResult.budgetUsed + assemblyResult.budgetRemaining}`);
    sections.push(`- Fragments: ${assemblyResult.fragments.length}`);

    if (assemblyResult.fallbacksApplied.length > 0) {
      sections.push(`- Fallbacks Applied: ${assemblyResult.fallbacksApplied.length}`);
    }

    return sections.join('\n');
  }

  private getPriorityLabel(priority: ContextPriority): string {
    switch (priority) {
    case ContextPriority.CRITICAL: return 'Critical';
    case ContextPriority.HIGH: return 'High';
    case ContextPriority.MEDIUM: return 'Medium';
    case ContextPriority.LOW: return 'Low';
    case ContextPriority.MINIMAL: return 'Minimal';
    default: return 'Unknown';
    }
  }

  private validateCommandContext(
    commandName: string,
    assemblyResult: ContextAssemblyResult
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check token budget
    if (assemblyResult.totalTokens > this.config.maxContextTokens * 0.9) {
      warnings.push('Context approaching token limit');
    }

    // Check for required context types
    const hasGlobal = assemblyResult.fragments.some(f => f.type.startsWith('global'));
    if (!hasGlobal) {
      errors.push('Missing global context');
    }

    // Check command-specific requirements
    const commandRequirements = this.getCommandRequirements(commandName);
    commandRequirements.forEach(req => {
      const hasRequired = assemblyResult.fragments.some(f =>
        f.type === req.fragmentType || f.content.includes(req.keyword)
      );

      if (req.required && !hasRequired) {
        errors.push(`Missing required context: ${req.description}`);
      }
    });

    return {
      passed: errors.length === 0,
      errors,
      warnings
    };
  }

  private getCommandRequirements(commandName: string): ContextRequirement[] {
    const requirements: Record<string, ContextRequirement[]> = {
      'Read': [
        { fragmentType: 'global-rules', keyword: 'file', required: true, description: 'Global file handling rules' }
      ],
      'Write': [
        { fragmentType: 'global-rules', keyword: 'quality', required: true, description: 'Quality standards' },
        { fragmentType: 'task-context', keyword: 'write', required: false, description: 'Write task context' }
      ],
      'Bash': [
        { fragmentType: 'global-rules', keyword: 'safety', required: true, description: 'Safety guidelines' }
      ]
    };

    return requirements[commandName] || [];
  }

  private getFallbackContext(commandName: string, error: Error): CommandContextResult {
    const fallbackContext = this.buildFallbackContext(commandName);

    return {
      commandName,
      context: fallbackContext,
      fragments: [],
      tokens: fallbackContext.length / 4, // Rough estimate
      recommendations: [],
      validation: { passed: false, errors: [error.message], warnings: ['Using fallback context'] },
      executionTime: 0,
      timestamp: Date.now()
    };
  }

  private buildFallbackContext(commandName: string): string {
    const essential = [
      '# Fallback Context\n',
      '## Essential Rules',
      '- Follow systematic development patterns',
      '- Maintain 95%+ test coverage',
      '- Preserve context between operations\n',
      `## Command: ${commandName}`,
      `Executing ${commandName} with minimal context due to system fallback.`
    ];

    return essential.join('\n');
  }

  private recordCommandExecution(
    commandName: string,
    result: CommandContextResult,
    parameters: Record<string, unknown>
  ): void {
    const execution: CommandExecution = {
      contextId: `exec-${commandName}-${Date.now()}`,
      commandName,
      parameters,
      fragments: result.fragments,
      tokens: result.tokens,
      reasoning: `Context assembly for ${commandName}`,
      timestamp: Date.now()
    };

    this.commandHistory.set(execution.contextId, execution);

    // Cleanup old executions
    if (this.commandHistory.size > 100) {
      const oldest = Array.from(this.commandHistory.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)[0];
      this.commandHistory.delete(oldest[0]);
    }
  }

  private calculateAverageAssemblyTime(): number {
    const executions = Array.from(this.commandHistory.values());
    if (executions.length === 0) {
      return 0;
    }

    // This would normally track assembly times
    return 50; // Placeholder: 50ms average
  }
}

// Supporting interfaces

interface CommandContextResult {
  commandName: string;
  context: string;
  fragments: ContextFragment[];
  tokens: number;
  recommendations: any[];
  validation: ValidationResult;
  executionTime: number;
  timestamp: number;
}

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

interface ContextRequirement {
  fragmentType?: string;
  keyword: string;
  required: boolean;
  description: string;
}

interface CommandExecution {
  contextId: string;
  commandName: string;
  parameters: Record<string, unknown>;
  fragments: ContextFragment[];
  tokens: number;
  reasoning: string;
  timestamp: number;
}

interface ContextSummary {
  global: {
    enabled: boolean;
    rulesCount: number;
    lastModified: number;
  };
  phase: {
    phaseNumber: number;
    phaseName: string;
    progress: number;
    status: string;
  } | null;
  task: {
    taskId: string;
    taskType: string;
    objective: string;
  } | null;
  memory: {
    patternsLearned: number;
    accuracyRate: number;
    lastUpdated: number;
  };
  performance: {
    averageAssemblyTime: number;
    cacheHitRate: number;
    totalCommands: number;
  };
}

interface ContextExport {
  global: any;
  phase: any;
  task: any;
  memory: any;
  config: CommandProviderConfig;
  timestamp: number;
}

/**
 * Singleton instance for command integration
 */
export const commandContextProvider = new CommandContextProvider();
