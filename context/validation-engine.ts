/**
 * Validation Gate Execution Engine
 * Core engine for executing validation gates with iterative improvement
 */

import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';
import { 
  ValidationGate, 
  ValidationResult, 
  GateContext,
  ValidationError,
  ValidationWarning
} from './types/context.types';
import { ValidationGateSystem } from './validation-gates';

export interface ValidationExecutionOptions {
  maxRetries?: number;
  retryDelay?: number;
  autoFix?: boolean;
  continueOnWarning?: boolean;
  continueOnError?: boolean;
  parallel?: boolean;
  timeout?: number;
}

export interface ValidationExecutionResult {
  phase: string;
  timestamp: Date;
  duration: number;
  gates: GateExecutionResult[];
  summary: ValidationSummary;
  improvements: ImprovementSuggestion[];
}

export interface GateExecutionResult {
  gateId: string;
  gateName: string;
  type: 'pre-execution' | 'post-execution' | 'continuous';
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  attempts: number;
  result: ValidationResult;
  fixApplied?: boolean;
  duration: number;
}

export interface ValidationSummary {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  skipped: number;
  fixedAutomatically: number;
  successRate: number;
}

export interface ImprovementSuggestion {
  gateId: string;
  type: 'process' | 'code' | 'documentation' | 'testing';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  rationale: string;
  estimatedImpact: string;
}

export class ValidationExecutionEngine extends EventEmitter {
  private gateSystem: ValidationGateSystem;
  private executionHistory: ValidationExecutionResult[] = [];
  private improvementPatterns: Map<string, ImprovementPattern> = new Map();

  constructor(gateSystem: ValidationGateSystem) {
    super();
    this.gateSystem = gateSystem;
    this.initializeImprovementPatterns();
  }

  /**
   * Execute validation gates for a phase
   */
  async executePhaseValidation(
    phase: string, 
    context: Partial<GateContext> = {},
    options: ValidationExecutionOptions = {}
  ): Promise<ValidationExecutionResult> {
    const startTime = Date.now();
    const gates = this.gateSystem.getGatesForPhase(phase);
    
    this.emit('validation:start', { phase, gateCount: gates.length });

    // Separate gates by type
    const preExecutionGates = gates.filter(g => g.type === 'pre-execution');
    const postExecutionGates = gates.filter(g => g.type === 'post-execution');
    const continuousGates = gates.filter(g => g.type === 'continuous');

    const results: GateExecutionResult[] = [];

    // Execute pre-execution gates
    if (preExecutionGates.length > 0) {
      this.emit('validation:phase', { type: 'pre-execution', count: preExecutionGates.length });
      const preResults = await this.executeGates(preExecutionGates, context, options);
      results.push(...preResults);

      // Check if we should continue after pre-execution failures
      if (!this.shouldContinue(preResults, options)) {
        return this.createExecutionResult(phase, startTime, results);
      }
    }

    // Execute continuous gates (these run in parallel with main execution)
    if (continuousGates.length > 0) {
      this.emit('validation:phase', { type: 'continuous', count: continuousGates.length });
      // Start continuous validation in background
      this.startContinuousValidation(continuousGates, context, options);
    }

    // Simulate main execution pause (in real implementation, this is where the actual work happens)
    this.emit('validation:main-execution', { phase });

    // Execute post-execution gates
    if (postExecutionGates.length > 0) {
      this.emit('validation:phase', { type: 'post-execution', count: postExecutionGates.length });
      const postResults = await this.executeGates(postExecutionGates, context, options);
      results.push(...postResults);
    }

    const executionResult = this.createExecutionResult(phase, startTime, results);
    
    // Generate improvement suggestions
    executionResult.improvements = this.generateImprovements(executionResult);
    
    // Store in history for learning
    this.executionHistory.push(executionResult);
    
    this.emit('validation:complete', executionResult);
    
    return executionResult;
  }

  /**
   * Execute a set of gates
   */
  private async executeGates(
    gates: ValidationGate[],
    context: Partial<GateContext>,
    options: ValidationExecutionOptions
  ): Promise<GateExecutionResult[]> {
    if (options.parallel) {
      return Promise.all(gates.map(gate => this.executeGate(gate, context, options)));
    } else {
      const results: GateExecutionResult[] = [];
      for (const gate of gates) {
        const result = await this.executeGate(gate, context, options);
        results.push(result);
        
        // Check if we should stop execution
        if (result.status === 'failed' && !options.continueOnError) {
          break;
        }
      }
      return results;
    }
  }

  /**
   * Execute a single gate with retry and auto-fix logic
   */
  private async executeGate(
    gate: ValidationGate,
    context: Partial<GateContext>,
    options: ValidationExecutionOptions
  ): Promise<GateExecutionResult> {
    const startTime = Date.now();
    const maxRetries = options.maxRetries || 3;
    let attempts = 0;
    let lastResult: ValidationResult | null = null;
    let fixApplied = false;

    this.emit('gate:start', { gateId: gate.id, gateName: gate.name });

    while (attempts < maxRetries) {
      attempts++;
      
      try {
        // Execute validation
        const result = await this.executeWithTimeout(
          () => this.gateSystem.validateGate(gate.id, context),
          options.timeout || 30000
        );
        
        lastResult = result;

        // If passed, we're done
        if (result.passed) {
          const execResult = this.createGateResult(gate, 'passed', attempts, result, fixApplied, startTime);
          this.emit('gate:complete', execResult);
          return execResult;
        }

        // Check severity and auto-fix
        if (gate.severity === 'warning' && options.continueOnWarning) {
          const execResult = this.createGateResult(gate, 'warning', attempts, result, fixApplied, startTime);
          this.emit('gate:complete', execResult);
          return execResult;
        }

        // Try auto-fix if available and enabled
        if (options.autoFix && gate.autoFix && attempts < maxRetries) {
          this.emit('gate:autofix', { gateId: gate.id, attempt: attempts });
          
          const fullContext = this.buildFullContext(gate, context);
          const fixed = await gate.autoFix(fullContext, result.errors || []);
          
          if (fixed) {
            fixApplied = true;
            // Wait before retry
            if (options.retryDelay) {
              await this.delay(options.retryDelay);
            }
            continue;
          }
        }

        // If we can't fix and shouldn't continue, fail
        if (!options.continueOnError) {
          const execResult = this.createGateResult(gate, 'failed', attempts, result, fixApplied, startTime);
          this.emit('gate:complete', execResult);
          return execResult;
        }

      } catch (error) {
        this.emit('gate:error', { gateId: gate.id, error, attempt: attempts });
        
        lastResult = {
          passed: false,
          errors: [{
            rule: gate.id,
            message: `Validation error: ${error}`,
            severity: 'critical'
          }]
        };
      }
    }

    // Max retries reached
    const execResult = this.createGateResult(
      gate, 
      'failed', 
      attempts, 
      lastResult || { passed: false, errors: [] }, 
      fixApplied, 
      startTime
    );
    
    this.emit('gate:complete', execResult);
    return execResult;
  }

  /**
   * Start continuous validation in background
   */
  private startContinuousValidation(
    gates: ValidationGate[],
    context: Partial<GateContext>,
    options: ValidationExecutionOptions
  ): void {
    // In a real implementation, this would run continuously
    // For now, we'll just execute once asynchronously
    setImmediate(async () => {
      for (const gate of gates) {
        try {
          await this.executeGate(gate, context, options);
        } catch (error) {
          this.emit('continuous:error', { gateId: gate.id, error });
        }
      }
    });
  }

  /**
   * Generate improvement suggestions based on execution results
   */
  private generateImprovements(result: ValidationExecutionResult): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];
    
    // Analyze failure patterns
    const failedGates = result.gates.filter(g => g.status === 'failed');
    
    for (const gate of failedGates) {
      // Check if this is a recurring failure
      const pattern = this.findImprovementPattern(gate.gateId, gate.result.errors || []);
      
      if (pattern) {
        suggestions.push({
          gateId: gate.gateId,
          type: pattern.type,
          priority: pattern.priority,
          suggestion: pattern.suggestion,
          rationale: pattern.rationale,
          estimatedImpact: pattern.estimatedImpact
        });
      }
    }

    // Add phase-level suggestions
    if (result.summary.successRate < 0.8) {
      suggestions.push({
        gateId: 'phase-validation',
        type: 'process',
        priority: 'high',
        suggestion: 'Consider breaking down this phase into smaller, more manageable steps',
        rationale: `Success rate is only ${(result.summary.successRate * 100).toFixed(1)}%`,
        estimatedImpact: 'Could improve success rate by 20-30%'
      });
    }

    return suggestions;
  }

  /**
   * Find improvement pattern for a gate
   */
  private findImprovementPattern(gateId: string, errors: ValidationError[]): ImprovementPattern | null {
    // Check historical data
    const history = this.getGateHistory(gateId);
    
    if (history.failureRate > 0.3) {
      // This gate fails frequently
      const errorTypes = errors.map(e => e.rule).join(',');
      
      for (const [key, pattern] of this.improvementPatterns) {
        if (pattern.matches(gateId, errorTypes, history)) {
          return pattern;
        }
      }
    }

    return null;
  }

  /**
   * Get historical data for a gate
   */
  private getGateHistory(gateId: string): GateHistory {
    const executions = this.executionHistory
      .flatMap(e => e.gates)
      .filter(g => g.gateId === gateId);

    const failures = executions.filter(e => e.status === 'failed').length;
    
    return {
      totalExecutions: executions.length,
      failures,
      failureRate: executions.length > 0 ? failures / executions.length : 0,
      averageAttempts: executions.reduce((sum, e) => sum + e.attempts, 0) / (executions.length || 1)
    };
  }

  /**
   * Initialize improvement patterns
   */
  private initializeImprovementPatterns(): void {
    // Missing documentation pattern
    this.improvementPatterns.set('missing-docs', {
      type: 'documentation',
      priority: 'medium',
      suggestion: 'Create comprehensive documentation templates',
      rationale: 'Documentation validation frequently fails',
      estimatedImpact: 'Reduce documentation-related failures by 50%',
      matches: (gateId, errors, history) => 
        errors.includes('documentation') && history.failureRate > 0.3
    });

    // Test coverage pattern
    this.improvementPatterns.set('low-coverage', {
      type: 'testing',
      priority: 'high',
      suggestion: 'Implement automated test generation',
      rationale: 'Test coverage consistently below threshold',
      estimatedImpact: 'Increase test coverage to 95%+',
      matches: (gateId, errors, history) => 
        errors.includes('coverage') && history.failureRate > 0.5
    });

    // Code quality pattern
    this.improvementPatterns.set('code-quality', {
      type: 'code',
      priority: 'medium',
      suggestion: 'Set up pre-commit hooks with auto-formatting',
      rationale: 'Code quality checks frequently fail',
      estimatedImpact: 'Eliminate 90% of formatting issues',
      matches: (gateId, errors, history) => 
        (errors.includes('lint') || errors.includes('format')) && history.failureRate > 0.4
    });

    // Dependency pattern
    this.improvementPatterns.set('dependencies', {
      type: 'process',
      priority: 'high',
      suggestion: 'Implement dependency update automation',
      rationale: 'Dependency-related failures are common',
      estimatedImpact: 'Reduce dependency issues by 70%',
      matches: (gateId, errors, history) => 
        errors.includes('dependencies') && history.failureRate > 0.2
    });
  }

  /**
   * Helper methods
   */
  private shouldContinue(results: GateExecutionResult[], options: ValidationExecutionOptions): boolean {
    const hasErrors = results.some(r => r.status === 'failed');
    const hasWarnings = results.some(r => r.status === 'warning');
    
    if (hasErrors && !options.continueOnError) return false;
    if (hasWarnings && !options.continueOnWarning) return false;
    
    return true;
  }

  private createExecutionResult(
    phase: string,
    startTime: number,
    gates: GateExecutionResult[]
  ): ValidationExecutionResult {
    const summary: ValidationSummary = {
      total: gates.length,
      passed: gates.filter(g => g.status === 'passed').length,
      failed: gates.filter(g => g.status === 'failed').length,
      warnings: gates.filter(g => g.status === 'warning').length,
      skipped: gates.filter(g => g.status === 'skipped').length,
      fixedAutomatically: gates.filter(g => g.fixApplied).length,
      successRate: gates.length > 0 
        ? gates.filter(g => g.status === 'passed').length / gates.length 
        : 1
    };

    return {
      phase,
      timestamp: new Date(),
      duration: Date.now() - startTime,
      gates,
      summary,
      improvements: []
    };
  }

  private createGateResult(
    gate: ValidationGate,
    status: 'passed' | 'failed' | 'warning' | 'skipped',
    attempts: number,
    result: ValidationResult,
    fixApplied: boolean,
    startTime: number
  ): GateExecutionResult {
    return {
      gateId: gate.id,
      gateName: gate.name,
      type: gate.type,
      status,
      attempts,
      result,
      fixApplied,
      duration: Date.now() - startTime
    };
  }

  private buildFullContext(gate: ValidationGate, partial: Partial<GateContext>): GateContext {
    return {
      phase: gate.phase,
      task: partial.task,
      files: partial.files || [],
      sections: partial.sections || [],
      previousGates: Object.keys(this.gateSystem.exportStatus())
        .filter(id => this.gateSystem.getGateStatus(id)?.status === 'passed'),
      metadata: partial.metadata || {}
    };
  }

  private async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Validation timeout')), timeout)
      )
    ]);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Export execution history
   */
  exportHistory(): ValidationExecutionResult[] {
    return [...this.executionHistory];
  }

  /**
   * Clear execution history
   */
  clearHistory(): void {
    this.executionHistory = [];
  }
}

// Helper interfaces
interface ImprovementPattern {
  type: 'process' | 'code' | 'documentation' | 'testing';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  rationale: string;
  estimatedImpact: string;
  matches: (gateId: string, errors: string, history: GateHistory) => boolean;
}

interface GateHistory {
  totalExecutions: number;
  failures: number;
  failureRate: number;
  averageAttempts: number;
}