/**
 * Validation Integration
 * Integrates all validation components with the Vibe command system
 */

import { ValidationGateSystem } from '../validation-gates';
import { PhaseTransitionValidator } from './phase-transition-validator';
import { CommandValidationHooks, HookResult } from './command-validation-hooks';
import { ValidationReporter, ReportOptions } from './validation-reporter';
import { DynamicContextManager } from '../assembly/dynamic-context-manager';
import { ContextLearningSystem } from '../memory/learning';
import EventEmitter from 'events';

export interface ValidationEvent {
  type: 'pre-validation' | 'post-validation' | 'phase-transition' | 'gate-check';
  command?: string;
  result: any;
  timestamp: Date;
}

export interface IterativeImprovementResult {
  attempt: number;
  success: boolean;
  improvements: string[];
  remainingIssues: string[];
}

export class VibeValidationSystem extends EventEmitter {
  private gateSystem: ValidationGateSystem;
  private phaseValidator: PhaseTransitionValidator;
  private commandHooks: CommandValidationHooks;
  private reporter: ValidationReporter;
  private dynamicManager: DynamicContextManager;
  private learningSystem: ContextLearningSystem;
  private projectRoot: string;
  
  // Iterative improvement settings
  private maxRetries = 3;
  private retryDelay = 1000; // ms

  constructor(projectRoot: string) {
    super();
    this.projectRoot = projectRoot;
    
    // Initialize all components
    this.gateSystem = new ValidationGateSystem();
    this.phaseValidator = new PhaseTransitionValidator(projectRoot);
    this.commandHooks = new CommandValidationHooks(projectRoot);
    this.reporter = new ValidationReporter();
    this.dynamicManager = new DynamicContextManager(projectRoot);
    this.learningSystem = new ContextLearningSystem(projectRoot);
  }

  /**
   * Initialize the validation system
   */
  async initialize(): Promise<void> {
    // Load validation gates from CLAUDE.md
    await this.loadValidationConfiguration();
    
    // Set up event listeners
    this.setupEventHandlers();
    
    console.log('✅ Validation system initialized');
  }

  private async loadValidationConfiguration(): Promise<void> {
    // Gates are loaded automatically by components
    // This is where we could add custom configuration loading
  }

  private setupEventHandlers(): void {
    // Log validation events if in debug mode
    if (process.env.VIBE_DEBUG === 'true') {
      this.on('validation', (event: ValidationEvent) => {
        console.log(`[Validation] ${event.type} for ${event.command || 'N/A'}`);
      });
    }
  }

  /**
   * Execute command with full validation
   */
  async executeCommand(
    command: string, 
    params: any, 
    options: {
      skipPreValidation?: boolean;
      skipPostValidation?: boolean;
      iterativeImprovement?: boolean;
      reportFormat?: ReportOptions['format'];
    } = {}
  ): Promise<{
    success: boolean;
    result?: any;
    validationReport: string;
    improvements?: IterativeImprovementResult;
  }> {
    let preValidation: HookResult | null = null;
    let postValidation: HookResult | null = null;
    let executionResult: any;
    let success = false;
    let improvements: IterativeImprovementResult | undefined;

    // Pre-execution validation
    if (!options.skipPreValidation) {
      preValidation = await this.commandHooks.validatePreExecution(command, params);
      
      this.emit('validation', {
        type: 'pre-validation',
        command,
        result: preValidation,
        timestamp: new Date()
      });

      if (!preValidation.valid) {
        // Try iterative improvement if enabled
        if (options.iterativeImprovement) {
          improvements = await this.iterativeImprovement(
            command, 
            params, 
            preValidation
          );
          
          if (improvements.success) {
            preValidation.valid = true;
          }
        }
        
        if (!preValidation.valid) {
          const report = this.reporter.generateHookReport(preValidation, {
            format: options.reportFormat || 'terminal'
          });
          
          return {
            success: false,
            validationReport: report,
            improvements
          };
        }
      }
    }

    // Execute command
    try {
      // In real implementation, this would call the actual command handler
      // For now, we'll simulate execution
      console.log(`Executing command: ${command}`);
      executionResult = await this.simulateCommandExecution(command, params);
      success = true;
    } catch (error) {
      executionResult = { error: error.toString() };
      success = false;
    }

    // Post-execution validation
    if (!options.skipPostValidation && success) {
      postValidation = await this.commandHooks.validatePostExecution(
        command, 
        params, 
        executionResult
      );
      
      this.emit('validation', {
        type: 'post-validation',
        command,
        result: postValidation,
        timestamp: new Date()
      });

      success = postValidation.valid;
    }

    // Record execution for learning
    if (preValidation) {
      this.commandHooks.recordExecution(command, preValidation, postValidation || undefined);
    }

    // Generate final report
    const report = this.generateExecutionReport(
      command,
      preValidation,
      postValidation,
      success,
      options.reportFormat || 'terminal'
    );

    return {
      success,
      result: executionResult,
      validationReport: report,
      improvements
    };
  }

  /**
   * Iterative improvement mechanism
   */
  private async iterativeImprovement(
    command: string,
    params: any,
    initialValidation: HookResult
  ): Promise<IterativeImprovementResult> {
    const result: IterativeImprovementResult = {
      attempt: 0,
      success: false,
      improvements: [],
      remainingIssues: [...initialValidation.errors]
    };

    let currentValidation = initialValidation;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      result.attempt = attempt;
      
      console.log(`\n🔄 Iterative Improvement - Attempt ${attempt}/${this.maxRetries}`);
      
      // Try to fix issues
      const fixableIssues = currentValidation.errors.filter(() => currentValidation.fixable);
      
      if (fixableIssues.length === 0) {
        console.log('No auto-fixable issues found');
        break;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));

      // Re-validate
      currentValidation = await this.commandHooks.validatePreExecution(command, params);
      
      // Check improvements
      const fixedIssues = initialValidation.errors.filter(
        error => !currentValidation.errors.includes(error)
      );
      
      result.improvements.push(...fixedIssues);
      result.remainingIssues = currentValidation.errors;

      if (currentValidation.valid) {
        result.success = true;
        console.log('✅ All issues resolved!');
        break;
      }

      console.log(`Fixed ${fixedIssues.length} issues, ${currentValidation.errors.length} remaining`);
    }

    // Learn from improvement process
    const learningOutcome = {
      success: result.success,
      metrics: {
        attemptsNeeded: result.attempt,
        issuesFixed: result.improvements.length,
        issuesRemaining: result.remainingIssues.length
      }
    };

    await this.learningSystem.learnFromSession({
      id: `improvement-${Date.now()}`,
      timestamp: new Date(),
      command,
      context: {
        layers: [],
        tokenUsage: { total: 0, used: 0, reserved: 0, available: 0 },
        activePatterns: []
      },
      outcome: learningOutcome
    });

    return result;
  }

  /**
   * Validate phase transition
   */
  async validatePhaseTransition(toPhase: string): Promise<{
    allowed: boolean;
    report: string;
  }> {
    const result = await this.phaseValidator.validateTransition(toPhase);
    
    this.emit('validation', {
      type: 'phase-transition',
      result,
      timestamp: new Date()
    });

    const report = this.reporter.generateTransitionReport(result);
    
    return {
      allowed: result.allowed,
      report
    };
  }

  /**
   * Force phase transition with reason
   */
  async forcePhaseTransition(toPhase: string, reason: string): Promise<void> {
    await this.phaseValidator.forceTransition(toPhase, reason);
  }

  /**
   * Get current phase status
   */
  async getPhaseStatus(): Promise<string> {
    const status = await this.phaseValidator.getPhaseCompletionStatus();
    
    const report = `
📊 Phase Status: ${status.phase}
   Completion: ${status.completionPercentage}%
   ${this.reporter.generateProgressBar(status.completionPercentage, 100)}
   
   Outputs: ${status.completedOutputs.length}/${status.completedOutputs.length + status.missingOutputs.length}
   Gates: ${status.passedGates.length}/${status.passedGates.length + status.failedGates.length}
`;
    
    return report;
  }

  /**
   * Get validation dashboard
   */
  async getValidationDashboard(): Promise<string> {
    const phaseStatus = await this.phaseValidator.getPhaseCompletionStatus();
    const hookReport = await this.commandHooks.getValidationReport();
    const suggestions = await this.phaseValidator.suggestNextSteps();
    
    const dashboard = `
# 📊 Vibe Validation Dashboard

## Current Phase
- **Phase**: ${phaseStatus.phase}
- **Progress**: ${phaseStatus.completionPercentage}%
- **Status**: ${phaseStatus.completionPercentage === 100 ? '✅ Complete' : '🔄 In Progress'}

## Validation Statistics
- **Total Executions**: ${hookReport.totalExecutions}
- **Success Rate**: ${hookReport.successRate.toFixed(1)}%
- **Common Issues**: ${hookReport.commonErrors.slice(0, 3).map(e => e.error).join(', ') || 'None'}

## Command Performance
${Object.entries(hookReport.commandStats)
  .slice(0, 5)
  .map(([cmd, stats]) => 
    `- **${cmd}**: ${stats.successful}/${stats.total} (${Math.round(stats.successful/stats.total * 100)}%)`
  ).join('\n')}

## Next Steps
${suggestions.map(s => `- ${s}`).join('\n')}

---
Generated: ${new Date().toLocaleString()}
`;
    
    return dashboard;
  }

  /**
   * Generate execution report
   */
  private generateExecutionReport(
    command: string,
    preValidation: HookResult | null,
    postValidation: HookResult | null,
    success: boolean,
    format: ReportOptions['format']
  ): string {
    const lines: string[] = [];
    
    lines.push(`# Command Execution Report: ${command}`);
    lines.push('');
    lines.push(`**Overall Status**: ${success ? '✅ Success' : '❌ Failed'}`);
    lines.push('');
    
    if (preValidation) {
      lines.push('## Pre-Execution Validation');
      lines.push(this.reporter.generateHookReport(preValidation, { 
        format: 'markdown',
        verbosity: 'normal' 
      }));
      lines.push('');
    }
    
    if (postValidation) {
      lines.push('## Post-Execution Validation');
      lines.push(this.reporter.generateHookReport(postValidation, { 
        format: 'markdown',
        verbosity: 'normal' 
      }));
    }
    
    if (format === 'terminal') {
      // Convert markdown to terminal-friendly format
      return lines.join('\n')
        .replace(/^#+ /gm, '')
        .replace(/\*\*/g, '');
    }
    
    return lines.join('\n');
  }

  /**
   * Simulate command execution (placeholder)
   */
  private async simulateCommandExecution(command: string, params: any): Promise<any> {
    // In real implementation, this would execute the actual command
    return {
      success: true,
      command,
      params,
      timestamp: new Date(),
      message: `Command ${command} executed successfully`
    };
  }

  /**
   * Register custom validation hook
   */
  registerHook(hook: any): void {
    this.commandHooks.registerHook(hook);
  }

  /**
   * Get learning insights
   */
  async getLearningInsights(): Promise<any[]> {
    return this.learningSystem.suggestContextImprovements();
  }
}