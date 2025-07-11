/**
 * Validation System Test Suite
 * Comprehensive tests for the validation gate system
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  ValidationGate, 
  ValidationResult,
  GateContext
} from '../types/context.types';
import { ValidationGateSystem } from '../validation-gates';
import { ValidationExecutionEngine } from '../validation-engine';
import { PhaseTransitionValidator } from '../phase-transition-validator';
import { CommandValidationHooks } from '../command-validation-hooks';
import { ValidationReporter } from '../validation-reporter';

describe('ValidationGateSystem', () => {
  let gateSystem: ValidationGateSystem;

  beforeEach(() => {
    gateSystem = new ValidationGateSystem();
  });

  describe('Gate Registration', () => {
    it('should register a validation gate', () => {
      const gate: ValidationGate = {
        id: 'test-gate',
        name: 'Test Gate',
        phase: 'testing',
        type: 'pre-execution',
        severity: 'error',
        requires: {
          files: ['test.txt']
        }
      };

      gateSystem.registerGate(gate);
      const gates = gateSystem.getGatesForPhase('testing');
      
      expect(gates).toHaveLength(1);
      expect(gates[0].id).toBe('test-gate');
    });

    it('should register multiple gates', () => {
      const gates: ValidationGate[] = [
        {
          id: 'gate-1',
          name: 'Gate 1',
          phase: 'build',
          type: 'pre-execution',
          severity: 'error',
          requires: {}
        },
        {
          id: 'gate-2',
          name: 'Gate 2',
          phase: 'build',
          type: 'post-execution',
          severity: 'warning',
          requires: {}
        }
      ];

      gateSystem.registerGates(gates);
      const phaseGates = gateSystem.getGatesForPhase('build');
      
      expect(phaseGates).toHaveLength(2);
    });
  });

  describe('Gate Validation', () => {
    it('should validate a passing gate', async () => {
      const gate: ValidationGate = {
        id: 'pass-gate',
        name: 'Passing Gate',
        phase: 'test',
        type: 'pre-execution',
        severity: 'error',
        requires: {
          conditions: ['always_true']
        }
      };

      gateSystem.registerGate(gate);
      gateSystem.registerCondition('always_true', async () => true);

      const result = await gateSystem.validateGate('pass-gate');
      
      expect(result.passed).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a failing gate', async () => {
      const gate: ValidationGate = {
        id: 'fail-gate',
        name: 'Failing Gate',
        phase: 'test',
        type: 'pre-execution',
        severity: 'error',
        requires: {
          files: ['non-existent-file.txt']
        }
      };

      gateSystem.registerGate(gate);
      const result = await gateSystem.validateGate('fail-gate');
      
      expect(result.passed).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors?.[0].message).toContain('Missing or inaccessible file');
    });

    it('should validate with custom validator', async () => {
      const gate: ValidationGate = {
        id: 'custom-gate',
        name: 'Custom Gate',
        phase: 'test',
        type: 'pre-execution',
        severity: 'error',
        requires: {}
      };

      gateSystem.registerGate(gate);
      gateSystem.registerValidator('custom-gate', async (gate, context) => {
        return {
          passed: context.metadata?.customValue === 'expected',
          errors: context.metadata?.customValue !== 'expected' 
            ? [{ rule: 'custom', message: 'Custom validation failed', severity: 'error' }]
            : []
        };
      });

      const result = await gateSystem.validateGate('custom-gate', {
        metadata: { customValue: 'expected' }
      });
      
      expect(result.passed).toBe(true);
    });
  });

  describe('Phase Validation', () => {
    it('should validate all gates for a phase', async () => {
      const gates: ValidationGate[] = [
        {
          id: 'phase-gate-1',
          name: 'Phase Gate 1',
          phase: 'deploy',
          type: 'pre-execution',
          severity: 'error',
          requires: { conditions: ['always_true'] }
        },
        {
          id: 'phase-gate-2',
          name: 'Phase Gate 2',
          phase: 'deploy',
          type: 'pre-execution',
          severity: 'warning',
          requires: { conditions: ['always_false'] }
        }
      ];

      gateSystem.registerGates(gates);
      gateSystem.registerCondition('always_true', async () => true);
      gateSystem.registerCondition('always_false', async () => false);

      const result = await gateSystem.validatePhase('deploy');
      
      expect(result.passed).toBe(false);
      expect(result.gates).toHaveLength(2);
      expect(result.gates[0].passed).toBe(true);
      expect(result.gates[1].passed).toBe(false);
    });
  });
});

describe('ValidationExecutionEngine', () => {
  let gateSystem: ValidationGateSystem;
  let executionEngine: ValidationExecutionEngine;

  beforeEach(() => {
    gateSystem = new ValidationGateSystem();
    executionEngine = new ValidationExecutionEngine(gateSystem);
  });

  describe('Phase Execution', () => {
    it('should execute pre-execution gates', async () => {
      const gate: ValidationGate = {
        id: 'pre-exec-gate',
        name: 'Pre-execution Gate',
        phase: 'build',
        type: 'pre-execution',
        severity: 'error',
        requires: { conditions: ['always_true'] }
      };

      gateSystem.registerGate(gate);
      gateSystem.registerCondition('always_true', async () => true);

      const result = await executionEngine.executePhaseValidation('build');
      
      expect(result.phase).toBe('build');
      expect(result.summary.total).toBe(1);
      expect(result.summary.passed).toBe(1);
      expect(result.summary.failed).toBe(0);
    });

    it('should handle gate failures with retry', async () => {
      let attempts = 0;
      const gate: ValidationGate = {
        id: 'retry-gate',
        name: 'Retry Gate',
        phase: 'test',
        type: 'pre-execution',
        severity: 'error',
        requires: { conditions: ['retry_condition'] }
      };

      gateSystem.registerGate(gate);
      gateSystem.registerCondition('retry_condition', async () => {
        attempts++;
        return attempts > 2; // Fail first 2 attempts
      });

      const result = await executionEngine.executePhaseValidation('test', {}, {
        maxRetries: 3,
        retryDelay: 10
      });
      
      expect(result.summary.passed).toBe(1);
      expect(result.gates[0].attempts).toBe(3);
    });

    it('should apply auto-fix when available', async () => {
      const gate: ValidationGate = {
        id: 'autofix-gate',
        name: 'Auto-fix Gate',
        phase: 'lint',
        type: 'pre-execution',
        severity: 'error',
        requires: { conditions: ['needs_fix'] },
        autoFix: async (context, errors) => {
          // Simulate fixing the issue
          return true;
        }
      };

      let needsFix = true;
      gateSystem.registerGate(gate);
      gateSystem.registerCondition('needs_fix', async () => {
        const result = !needsFix;
        needsFix = false; // Fixed after first check
        return result;
      });

      const result = await executionEngine.executePhaseValidation('lint', {}, {
        autoFix: true,
        maxRetries: 2
      });
      
      expect(result.summary.passed).toBe(1);
      expect(result.gates[0].fixApplied).toBe(true);
    });
  });

  describe('Improvement Suggestions', () => {
    it('should generate improvement suggestions for failures', async () => {
      const gate: ValidationGate = {
        id: 'coverage-gate',
        name: 'Coverage Gate',
        phase: 'test',
        type: 'post-execution',
        severity: 'error',
        requires: { conditions: ['coverage_check'] }
      };

      gateSystem.registerGate(gate);
      gateSystem.registerCondition('coverage_check', async () => false);

      const result = await executionEngine.executePhaseValidation('test');
      
      expect(result.improvements.length).toBeGreaterThan(0);
      expect(result.improvements[0].type).toBe('process');
    });
  });
});

describe('PhaseTransitionValidator', () => {
  let gateSystem: ValidationGateSystem;
  let phaseValidator: PhaseTransitionValidator;

  beforeEach(() => {
    gateSystem = new ValidationGateSystem();
    phaseValidator = new PhaseTransitionValidator(gateSystem, '.test-vibe/phase-state.json');
  });

  describe('Phase Registration', () => {
    it('should register a phase', () => {
      phaseValidator.registerPhase({
        id: 'custom-phase',
        name: 'Custom Phase',
        order: 10,
        description: 'A custom phase',
        prerequisites: [],
        deliverables: [],
        validationGates: []
      });

      const progress = phaseValidator.getPhaseProgress();
      expect(progress.remaining).toContain('custom-phase');
    });
  });

  describe('Transition Validation', () => {
    it('should check if transition is allowed', async () => {
      const result = await phaseValidator.canTransition('initial', 'requirements');
      
      expect(result.allowed).toBeDefined();
      expect(result.conditions).toBeDefined();
      expect(result.blockers).toBeDefined();
    });

    it('should block transition with missing prerequisites', async () => {
      phaseValidator.registerTransition({
        from: 'phase-a',
        to: 'phase-b',
        conditions: [
          {
            type: 'gate',
            target: 'missing-gate',
            required: true
          }
        ]
      });

      const result = await phaseValidator.canTransition('phase-a', 'phase-b');
      
      expect(result.allowed).toBe(false);
      expect(result.blockers.length).toBeGreaterThan(0);
    });
  });

  describe('Phase Progress', () => {
    it('should track phase progress', () => {
      const progress = phaseValidator.getPhaseProgress();
      
      expect(progress.current).toBeDefined();
      expect(progress.completed).toBeDefined();
      expect(progress.remaining).toBeDefined();
      expect(progress.progress).toBeGreaterThanOrEqual(0);
      expect(progress.progress).toBeLessThanOrEqual(100);
    });
  });
});

describe('CommandValidationHooks', () => {
  let gateSystem: ValidationGateSystem;
  let phaseValidator: PhaseTransitionValidator;
  let commandHooks: CommandValidationHooks;

  beforeEach(() => {
    gateSystem = new ValidationGateSystem();
    phaseValidator = new PhaseTransitionValidator(gateSystem);
    commandHooks = new CommandValidationHooks(gateSystem, phaseValidator);
  });

  describe('Hook Registration', () => {
    it('should register a command hook', () => {
      commandHooks.registerHook({
        id: 'test-hook',
        name: 'Test Hook',
        commands: ['test'],
        stage: 'pre',
        priority: 50,
        enabled: true,
        validate: async () => ({ passed: true })
      });

      const plan = commandHooks.createExecutionPlan({
        command: 'test',
        args: [],
        options: {},
        phase: 'test',
        timestamp: new Date()
      });

      expect(plan.preHooks.length).toBeGreaterThan(0);
    });
  });

  describe('Pre-command Validation', () => {
    it('should validate pre-command hooks', async () => {
      commandHooks.registerHook({
        id: 'pre-test',
        name: 'Pre Test',
        commands: ['build'],
        stage: 'pre',
        priority: 100,
        enabled: true,
        validate: async () => ({
          passed: true,
          warnings: ['This is a warning']
        })
      });

      const result = await commandHooks.validatePreCommand({
        command: 'build',
        args: [],
        options: {},
        phase: 'build',
        timestamp: new Date()
      });

      expect(result.proceed).toBe(true);
      expect(result.warnings).toContain('This is a warning');
    });

    it('should block execution on critical failures', async () => {
      commandHooks.registerHook({
        id: 'critical-check',
        name: 'Critical Check',
        commands: ['deploy'],
        stage: 'pre',
        priority: 100,
        enabled: true,
        validate: async () => ({
          passed: false,
          errors: ['Critical error'],
          shouldProceed: false
        })
      });

      const result = await commandHooks.validatePreCommand({
        command: 'deploy',
        args: [],
        options: {},
        phase: 'deploy',
        timestamp: new Date()
      });

      expect(result.proceed).toBe(false);
      expect(result.errors).toContain('Critical error');
    });
  });

  describe('Post-command Validation', () => {
    it('should validate post-command hooks', async () => {
      commandHooks.registerHook({
        id: 'post-test',
        name: 'Post Test',
        commands: ['test'],
        stage: 'post',
        priority: 50,
        enabled: true,
        validate: async (context) => ({
          passed: true,
          suggestions: ['Consider adding more tests']
        })
      });

      const result = await commandHooks.validatePostCommand(
        {
          command: 'test',
          args: [],
          options: {},
          phase: 'test',
          timestamp: new Date()
        },
        { exitCode: 0, output: 'Tests passed' }
      );

      expect(result.success).toBe(true);
      expect(result.improvements).toContain('Consider adding more tests');
    });
  });
});

describe('ValidationReporter', () => {
  let reporter: ValidationReporter;

  beforeEach(() => {
    reporter = new ValidationReporter();
  });

  describe('Report Generation', () => {
    const mockResult = {
      phase: 'test',
      timestamp: new Date(),
      duration: 1234,
      gates: [
        {
          gateId: 'test-gate',
          gateName: 'Test Gate',
          type: 'pre-execution' as const,
          status: 'passed' as const,
          attempts: 1,
          result: { passed: true, errors: [] },
          duration: 100
        }
      ],
      summary: {
        total: 1,
        passed: 1,
        failed: 0,
        warnings: 0,
        skipped: 0,
        fixedAutomatically: 0,
        successRate: 1.0
      },
      improvements: []
    };

    it('should generate terminal report', () => {
      const report = reporter.generateReport(mockResult, {
        format: 'terminal',
        colorize: false
      });

      expect(report).toContain('VALIDATION PASSED');
      expect(report).toContain('Test Gate');
      expect(report).toContain('Success Rate: 100.0%');
    });

    it('should generate markdown report', () => {
      const report = reporter.generateReport(mockResult, {
        format: 'markdown'
      });

      expect(report).toContain('# Validation Report');
      expect(report).toContain('## Summary');
      expect(report).toContain('✅ PASSED');
    });

    it('should generate HTML report', () => {
      const report = reporter.generateReport(mockResult, {
        format: 'html'
      });

      expect(report).toContain('<!DOCTYPE html>');
      expect(report).toContain('<h1>Validation Report</h1>');
      expect(report).toContain('class="summary passed"');
    });

    it('should generate JSON report', () => {
      const report = reporter.generateReport(mockResult, {
        format: 'json'
      });

      const parsed = JSON.parse(report);
      expect(parsed.phase).toBe('test');
      expect(parsed.summary.total).toBe(1);
      expect(parsed.summary.passed).toBe(1);
    });
  });

  describe('Report Options', () => {
    const mockResult = {
      phase: 'test',
      timestamp: new Date(),
      duration: 1234,
      gates: [
        {
          gateId: 'pass-gate',
          gateName: 'Passing Gate',
          type: 'pre-execution' as const,
          status: 'passed' as const,
          attempts: 1,
          result: { passed: true, errors: [] },
          duration: 100
        },
        {
          gateId: 'fail-gate',
          gateName: 'Failing Gate',
          type: 'pre-execution' as const,
          status: 'failed' as const,
          attempts: 3,
          result: { 
            passed: false, 
            errors: [{ rule: 'test', message: 'Test failed', severity: 'error' as const }] 
          },
          duration: 300
        }
      ],
      summary: {
        total: 2,
        passed: 1,
        failed: 1,
        warnings: 0,
        skipped: 0,
        fixedAutomatically: 0,
        successRate: 0.5
      },
      improvements: [
        {
          gateId: 'fail-gate',
          type: 'testing' as const,
          priority: 'high' as const,
          suggestion: 'Add more comprehensive tests',
          rationale: 'Test coverage is below threshold',
          estimatedImpact: 'Improve reliability by 30%'
        }
      ]
    };

    it('should exclude successes when requested', () => {
      const report = reporter.generateReport(mockResult, {
        format: 'markdown',
        includeSuccesses: false
      });

      expect(report).toContain('Failing Gate');
      expect(report).not.toContain('Passing Gate');
    });

    it('should include suggestions when enabled', () => {
      const report = reporter.generateReport(mockResult, {
        format: 'markdown',
        includeSuggestions: true
      });

      expect(report).toContain('Improvement Suggestions');
      expect(report).toContain('Add more comprehensive tests');
    });

    it('should respect verbosity levels', () => {
      const minimalReport = reporter.generateReport(mockResult, {
        format: 'terminal',
        verbosity: 'minimal',
        colorize: false
      });

      const detailedReport = reporter.generateReport(mockResult, {
        format: 'terminal',
        verbosity: 'detailed',
        colorize: false
      });

      expect(detailedReport.length).toBeGreaterThan(minimalReport.length);
      expect(detailedReport).toContain('Type:');
      expect(detailedReport).toContain('Attempts:');
    });
  });
});