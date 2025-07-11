/**
 * Command Validation Hooks Framework
 * Integrates validation into the command execution lifecycle
 */

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { 
  ValidationGate, 
  ValidationResult,
  GateContext,
  ValidationError
} from './types/context.types';
import { ValidationGateSystem } from './validation-gates';
import { ValidationExecutionEngine, ValidationExecutionResult } from './validation-engine';
import { PhaseTransitionValidator } from './phase-transition-validator';

export interface CommandContext {
  command: string;
  args: string[];
  options: Record<string, any>;
  phase: string;
  task?: string;
  user?: string;
  timestamp: Date;
}

export interface ValidationHook {
  id: string;
  name: string;
  commands: string[] | '*';
  stage: 'pre' | 'post' | 'both';
  priority: number;
  enabled: boolean;
  validate: (context: CommandContext) => Promise<HookResult>;
}

export interface HookResult {
  passed: boolean;
  errors?: string[];
  warnings?: string[];
  metadata?: Record<string, any>;
  shouldProceed?: boolean;
  suggestions?: string[];
}

export interface CommandExecutionPlan {
  command: string;
  preHooks: ValidationHook[];
  postHooks: ValidationHook[];
  requiredGates: ValidationGate[];
  estimatedDuration?: number;
}

export interface CommandValidationConfig {
  enablePreValidation: boolean;
  enablePostValidation: boolean;
  failFast: boolean;
  autoFix: boolean;
  interactiveMode: boolean;
  bypassOnEmergency: boolean;
}

export class CommandValidationHooks extends EventEmitter {
  private hooks: Map<string, ValidationHook> = new Map();
  private gateSystem: ValidationGateSystem;
  private executionEngine: ValidationExecutionEngine;
  private phaseValidator: PhaseTransitionValidator;
  private config: CommandValidationConfig;
  private executionHistory: CommandExecutionRecord[] = [];

  constructor(
    gateSystem: ValidationGateSystem,
    phaseValidator: PhaseTransitionValidator,
    config: Partial<CommandValidationConfig> = {}
  ) {
    super();
    this.gateSystem = gateSystem;
    this.executionEngine = new ValidationExecutionEngine(gateSystem);
    this.phaseValidator = phaseValidator;
    this.config = {
      enablePreValidation: true,
      enablePostValidation: true,
      failFast: true,
      autoFix: true,
      interactiveMode: false,
      bypassOnEmergency: false,
      ...config
    };
    
    this.initializeDefaultHooks();
  }

  /**
   * Register a validation hook
   */
  registerHook(hook: ValidationHook): void {
    this.hooks.set(hook.id, hook);
    this.emit('hook:registered', { hookId: hook.id, hookName: hook.name });
  }

  /**
   * Execute pre-command validation
   */
  async validatePreCommand(context: CommandContext): Promise<{
    proceed: boolean;
    validationResult?: ValidationExecutionResult;
    hookResults: HookResult[];
    errors: string[];
    warnings: string[];
  }> {
    if (!this.config.enablePreValidation) {
      return { proceed: true, hookResults: [], errors: [], warnings: [] };
    }

    this.emit('validation:pre:start', context);

    // Get applicable hooks
    const hooks = this.getApplicableHooks(context.command, 'pre');
    const hookResults: HookResult[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    // Execute hooks in priority order
    for (const hook of hooks) {
      if (!hook.enabled) continue;

      try {
        const result = await this.executeHook(hook, context);
        hookResults.push(result);

        if (result.errors) errors.push(...result.errors);
        if (result.warnings) warnings.push(...result.warnings);

        if (!result.passed && this.config.failFast) {
          this.emit('validation:pre:failed', { hook: hook.name, errors: result.errors });
          return { 
            proceed: result.shouldProceed || false, 
            hookResults, 
            errors, 
            warnings 
          };
        }
      } catch (error) {
        errors.push(`Hook '${hook.name}' failed: ${error}`);
        if (this.config.failFast) {
          return { proceed: false, hookResults, errors, warnings };
        }
      }
    }

    // Execute phase validation gates
    let validationResult: ValidationExecutionResult | undefined;
    
    if (context.phase) {
      const gates = this.gateSystem.getGatesForPhase(context.phase)
        .filter(g => g.type === 'pre-execution');
      
      if (gates.length > 0) {
        validationResult = await this.executionEngine.executePhaseValidation(
          context.phase,
          {
            phase: context.phase,
            task: context.task,
            metadata: { command: context.command, args: context.args }
          },
          {
            autoFix: this.config.autoFix,
            continueOnWarning: true
          }
        );

        if (validationResult.summary.failed > 0) {
          errors.push(...validationResult.gates
            .filter(g => g.status === 'failed')
            .flatMap(g => g.result.errors?.map(e => e.message) || []));
        }
      }
    }

    const proceed = errors.length === 0 || !this.config.failFast;
    
    this.emit('validation:pre:complete', { 
      proceed, 
      errorCount: errors.length, 
      warningCount: warnings.length 
    });

    return { proceed, validationResult, hookResults, errors, warnings };
  }

  /**
   * Execute post-command validation
   */
  async validatePostCommand(
    context: CommandContext,
    commandResult: any
  ): Promise<{
    success: boolean;
    validationResult?: ValidationExecutionResult;
    hookResults: HookResult[];
    errors: string[];
    warnings: string[];
    improvements: string[];
  }> {
    if (!this.config.enablePostValidation) {
      return { 
        success: true, 
        hookResults: [], 
        errors: [], 
        warnings: [], 
        improvements: [] 
      };
    }

    this.emit('validation:post:start', context);

    // Get applicable hooks
    const hooks = this.getApplicableHooks(context.command, 'post');
    const hookResults: HookResult[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    const improvements: string[] = [];

    // Add command result to context
    const enrichedContext = {
      ...context,
      result: commandResult
    };

    // Execute hooks
    for (const hook of hooks) {
      if (!hook.enabled) continue;

      try {
        const result = await this.executeHook(hook, enrichedContext);
        hookResults.push(result);

        if (result.errors) errors.push(...result.errors);
        if (result.warnings) warnings.push(...result.warnings);
        if (result.suggestions) improvements.push(...result.suggestions);

      } catch (error) {
        errors.push(`Post-hook '${hook.name}' failed: ${error}`);
      }
    }

    // Execute phase validation gates
    let validationResult: ValidationExecutionResult | undefined;
    
    if (context.phase) {
      const gates = this.gateSystem.getGatesForPhase(context.phase)
        .filter(g => g.type === 'post-execution');
      
      if (gates.length > 0) {
        validationResult = await this.executionEngine.executePhaseValidation(
          context.phase,
          {
            phase: context.phase,
            task: context.task,
            metadata: { 
              command: context.command, 
              args: context.args,
              result: commandResult
            }
          },
          {
            autoFix: this.config.autoFix,
            continueOnWarning: true
          }
        );

        if (validationResult.summary.failed > 0) {
          errors.push(...validationResult.gates
            .filter(g => g.status === 'failed')
            .flatMap(g => g.result.errors?.map(e => e.message) || []));
        }

        // Add improvement suggestions
        improvements.push(...validationResult.improvements.map(i => i.suggestion));
      }
    }

    // Record execution
    this.recordExecution(context, {
      preValidation: null,
      postValidation: { hookResults, errors, warnings },
      result: commandResult,
      improvements
    });

    const success = errors.length === 0;
    
    this.emit('validation:post:complete', { 
      success, 
      errorCount: errors.length, 
      warningCount: warnings.length,
      improvementCount: improvements.length
    });

    return { 
      success, 
      validationResult, 
      hookResults, 
      errors, 
      warnings, 
      improvements 
    };
  }

  /**
   * Create command execution plan
   */
  async createExecutionPlan(context: CommandContext): Promise<CommandExecutionPlan> {
    const preHooks = this.getApplicableHooks(context.command, 'pre');
    const postHooks = this.getApplicableHooks(context.command, 'post');
    
    const gates = context.phase 
      ? this.gateSystem.getGatesForPhase(context.phase)
      : [];

    const requiredGates = gates.filter(g => 
      g.type === 'pre-execution' || g.type === 'continuous'
    );

    // Estimate duration based on historical data
    const estimatedDuration = this.estimateCommandDuration(context.command);

    return {
      command: context.command,
      preHooks,
      postHooks,
      requiredGates,
      estimatedDuration
    };
  }

  /**
   * Interactive validation mode
   */
  async interactiveValidation(
    context: CommandContext,
    preValidationResult: any
  ): Promise<{
    proceed: boolean;
    fixes: string[];
    bypassed: string[];
  }> {
    if (!this.config.interactiveMode) {
      return { proceed: true, fixes: [], bypassed: [] };
    }

    const fixes: string[] = [];
    const bypassed: string[] = [];

    // In a real implementation, this would interact with the user
    // For now, we'll simulate automatic responses
    
    if (preValidationResult.errors.length > 0) {
      this.emit('validation:interactive', {
        message: 'Validation errors found. Attempting automatic fixes...',
        errors: preValidationResult.errors
      });

      // Simulate fix attempts
      for (const error of preValidationResult.errors) {
        if (this.canAutoFix(error)) {
          fixes.push(error);
        } else if (this.config.bypassOnEmergency) {
          bypassed.push(error);
        }
      }
    }

    const proceed = fixes.length + bypassed.length === preValidationResult.errors.length;

    return { proceed, fixes, bypassed };
  }

  /**
   * Get validation report
   */
  generateValidationReport(commandId?: string): string {
    let report = '# Command Validation Report\n\n';
    
    if (commandId) {
      const record = this.executionHistory.find(r => r.id === commandId);
      if (record) {
        report += this.formatCommandRecord(record);
      }
    } else {
      // Summary report
      report += '## Summary\n\n';
      report += `- Total Commands: ${this.executionHistory.length}\n`;
      
      const successful = this.executionHistory.filter(r => r.successful).length;
      report += `- Successful: ${successful}\n`;
      report += `- Failed: ${this.executionHistory.length - successful}\n`;
      
      // Most common errors
      const errorCounts = new Map<string, number>();
      this.executionHistory.forEach(record => {
        record.errors.forEach(error => {
          errorCounts.set(error, (errorCounts.get(error) || 0) + 1);
        });
      });
      
      if (errorCounts.size > 0) {
        report += '\n## Common Errors\n\n';
        Array.from(errorCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .forEach(([error, count]) => {
            report += `- ${error} (${count} occurrences)\n`;
          });
      }
    }
    
    return report;
  }

  /**
   * Private helper methods
   */
  private initializeDefaultHooks(): void {
    // Git status check
    this.registerHook({
      id: 'git-status-check',
      name: 'Git Status Check',
      commands: ['commit', 'push', 'deploy'],
      stage: 'pre',
      priority: 100,
      enabled: true,
      validate: async (context) => {
        // Check if git is clean
        const gitClean = await this.checkGitStatus();
        
        if (!gitClean && context.command === 'deploy') {
          return {
            passed: false,
            errors: ['Uncommitted changes found. Please commit before deploying.'],
            shouldProceed: false
          };
        }
        
        return {
          passed: true,
          warnings: gitClean ? [] : ['Uncommitted changes detected']
        };
      }
    });

    // Dependency check
    this.registerHook({
      id: 'dependency-check',
      name: 'Dependency Check',
      commands: ['build', 'test', 'start'],
      stage: 'pre',
      priority: 90,
      enabled: true,
      validate: async (context) => {
        const depsInstalled = await this.checkDependencies();
        
        if (!depsInstalled) {
          return {
            passed: false,
            errors: ['Dependencies not installed. Run "npm install" first.'],
            shouldProceed: false
          };
        }
        
        return { passed: true };
      }
    });

    // Test coverage check
    this.registerHook({
      id: 'test-coverage-check',
      name: 'Test Coverage Check',
      commands: ['commit', 'push'],
      stage: 'post',
      priority: 80,
      enabled: true,
      validate: async (context) => {
        const coverage = await this.getTestCoverage();
        
        if (coverage < 80) {
          return {
            passed: false,
            warnings: [`Test coverage is ${coverage}%. Target is 80%.`],
            suggestions: ['Consider adding more tests before pushing.'],
            shouldProceed: true
          };
        }
        
        return { passed: true };
      }
    });

    // Build success check
    this.registerHook({
      id: 'build-success-check',
      name: 'Build Success Check',
      commands: ['deploy', 'publish'],
      stage: 'pre',
      priority: 95,
      enabled: true,
      validate: async (context) => {
        const buildExists = await this.checkBuildArtifacts();
        
        if (!buildExists) {
          return {
            passed: false,
            errors: ['No build artifacts found. Run build first.'],
            shouldProceed: false
          };
        }
        
        return { passed: true };
      }
    });

    // Documentation check
    this.registerHook({
      id: 'documentation-check',
      name: 'Documentation Check',
      commands: ['publish', 'release'],
      stage: 'pre',
      priority: 70,
      enabled: true,
      validate: async (context) => {
        const docsComplete = await this.checkDocumentation();
        
        if (!docsComplete) {
          return {
            passed: true,
            warnings: ['Documentation may be incomplete'],
            suggestions: ['Review and update documentation before release']
          };
        }
        
        return { passed: true };
      }
    });
  }

  private getApplicableHooks(command: string, stage: 'pre' | 'post' | 'both'): ValidationHook[] {
    return Array.from(this.hooks.values())
      .filter(hook => {
        const commandMatch = hook.commands === '*' || 
                           (Array.isArray(hook.commands) && hook.commands.includes(command));
        const stageMatch = hook.stage === 'both' || hook.stage === stage;
        
        return commandMatch && stageMatch;
      })
      .sort((a, b) => b.priority - a.priority);
  }

  private async executeHook(hook: ValidationHook, context: CommandContext): Promise<HookResult> {
    try {
      this.emit('hook:execute:start', { hookId: hook.id, context });
      
      const result = await hook.validate(context);
      
      this.emit('hook:execute:complete', { hookId: hook.id, result });
      
      return result;
    } catch (error) {
      this.emit('hook:execute:error', { hookId: hook.id, error });
      
      return {
        passed: false,
        errors: [`Hook execution failed: ${error}`]
      };
    }
  }

  private recordExecution(context: CommandContext, results: any): void {
    const record: CommandExecutionRecord = {
      id: `${context.command}-${Date.now()}`,
      command: context.command,
      args: context.args,
      timestamp: context.timestamp,
      phase: context.phase,
      successful: results.postValidation?.errors.length === 0,
      errors: [
        ...(results.preValidation?.errors || []),
        ...(results.postValidation?.errors || [])
      ],
      warnings: [
        ...(results.preValidation?.warnings || []),
        ...(results.postValidation?.warnings || [])
      ],
      improvements: results.improvements || [],
      duration: Date.now() - context.timestamp.getTime()
    };

    this.executionHistory.push(record);
    
    // Keep only last 1000 records
    if (this.executionHistory.length > 1000) {
      this.executionHistory = this.executionHistory.slice(-1000);
    }
  }

  private estimateCommandDuration(command: string): number {
    const history = this.executionHistory.filter(r => r.command === command);
    
    if (history.length === 0) {
      // Default estimates
      const estimates: Record<string, number> = {
        'build': 30000,
        'test': 60000,
        'deploy': 120000,
        'install': 45000,
        'default': 10000
      };
      
      return estimates[command] || estimates.default;
    }
    
    // Calculate average from history
    const totalDuration = history.reduce((sum, r) => sum + r.duration, 0);
    return Math.round(totalDuration / history.length);
  }

  private formatCommandRecord(record: CommandExecutionRecord): string {
    let report = `## Command: ${record.command}\n\n`;
    report += `- ID: ${record.id}\n`;
    report += `- Timestamp: ${record.timestamp.toISOString()}\n`;
    report += `- Phase: ${record.phase || 'N/A'}\n`;
    report += `- Duration: ${record.duration}ms\n`;
    report += `- Status: ${record.successful ? '✅ Success' : '❌ Failed'}\n`;
    
    if (record.errors.length > 0) {
      report += '\n### Errors\n';
      record.errors.forEach(error => {
        report += `- ${error}\n`;
      });
    }
    
    if (record.warnings.length > 0) {
      report += '\n### Warnings\n';
      record.warnings.forEach(warning => {
        report += `- ${warning}\n`;
      });
    }
    
    if (record.improvements.length > 0) {
      report += '\n### Suggested Improvements\n';
      record.improvements.forEach(improvement => {
        report += `- ${improvement}\n`;
      });
    }
    
    return report;
  }

  private canAutoFix(error: string): boolean {
    const autoFixablePatterns = [
      /formatting/i,
      /whitespace/i,
      /import.*order/i,
      /semicolon/i,
      /quotes/i
    ];
    
    return autoFixablePatterns.some(pattern => pattern.test(error));
  }

  // Mock implementation of check methods
  private async checkGitStatus(): Promise<boolean> {
    try {
      // In real implementation, check git status
      return true;
    } catch {
      return false;
    }
  }

  private async checkDependencies(): Promise<boolean> {
    return fs.existsSync('node_modules');
  }

  private async getTestCoverage(): Promise<number> {
    // In real implementation, parse coverage report
    return 85;
  }

  private async checkBuildArtifacts(): Promise<boolean> {
    return fs.existsSync('dist') || fs.existsSync('build');
  }

  private async checkDocumentation(): Promise<boolean> {
    return fs.existsSync('README.md') || fs.existsSync('docs');
  }

  /**
   * Export configuration
   */
  getConfig(): CommandValidationConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<CommandValidationConfig>): void {
    this.config = { ...this.config, ...config };
    this.emit('config:updated', this.config);
  }

  /**
   * Enable/disable hook
   */
  setHookEnabled(hookId: string, enabled: boolean): void {
    const hook = this.hooks.get(hookId);
    if (hook) {
      hook.enabled = enabled;
      this.emit('hook:updated', { hookId, enabled });
    }
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit?: number): CommandExecutionRecord[] {
    if (limit) {
      return this.executionHistory.slice(-limit);
    }
    return [...this.executionHistory];
  }
}

// Helper interfaces
interface CommandExecutionRecord {
  id: string;
  command: string;
  args: string[];
  timestamp: Date;
  phase?: string;
  successful: boolean;
  errors: string[];
  warnings: string[];
  improvements: string[];
  duration: number;
}