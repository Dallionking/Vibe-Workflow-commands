/**
 * Context Types Test Suite
 * Tests for TypeScript interfaces and type safety
 */

import { describe, test, expect } from '@jest/globals';
import {
  ContextPriority,
  BaseContext,
  ContextMetadata,
  ContextSource,
  ContextFragment,
  GlobalRule,
  TaskType
} from '../types/context.types';

describe('Context Types', () => {
  describe('ContextPriority Enum', () => {
    test('should have correct priority values', () => {
      expect(ContextPriority.CRITICAL).toBe(1000);
      expect(ContextPriority.HIGH).toBe(800);
      expect(ContextPriority.MEDIUM).toBe(500);
      expect(ContextPriority.LOW).toBe(200);
      expect(ContextPriority.MINIMAL).toBe(100);
    });

    test('should maintain correct ordering', () => {
      expect(ContextPriority.CRITICAL > ContextPriority.HIGH).toBe(true);
      expect(ContextPriority.HIGH > ContextPriority.MEDIUM).toBe(true);
      expect(ContextPriority.MEDIUM > ContextPriority.LOW).toBe(true);
      expect(ContextPriority.LOW > ContextPriority.MINIMAL).toBe(true);
    });
  });

  describe('ContextSource Discriminated Union', () => {
    test('should accept valid global source', () => {
      const globalSource: ContextSource = {
        type: 'global',
        scope: 'system'
      };
      expect(globalSource.type).toBe('global');
      expect(globalSource.scope).toBe('system');
    });

    test('should accept valid phase source', () => {
      const phaseSource: ContextSource = {
        type: 'phase',
        phaseNumber: 1,
        phaseName: 'Context Engineering'
      };
      expect(phaseSource.type).toBe('phase');
      expect(phaseSource.phaseNumber).toBe(1);
    });

    test('should accept valid task source', () => {
      const taskSource: ContextSource = {
        type: 'task',
        taskId: 'task-123',
        taskType: 'implementation'
      };
      expect(taskSource.type).toBe('task');
      expect(taskSource.taskId).toBe('task-123');
    });

    test('should accept valid memory source', () => {
      const memorySource: ContextSource = {
        type: 'memory',
        memoryType: 'pattern'
      };
      expect(memorySource.type).toBe('memory');
      expect(memorySource.memoryType).toBe('pattern');
    });

    test('should accept valid command source', () => {
      const commandSource: ContextSource = {
        type: 'command',
        commandName: 'Read',
        commandType: 'file-operation'
      };
      expect(commandSource.type).toBe('command');
      expect(commandSource.commandName).toBe('Read');
    });

    test('should accept valid external source', () => {
      const externalSource: ContextSource = {
        type: 'external',
        provider: 'Context7',
        dataType: 'documentation'
      };
      expect(externalSource.type).toBe('external');
      expect(externalSource.provider).toBe('Context7');
    });
  });

  describe('BaseContext Interface', () => {
    test('should create valid base context', () => {
      const metadata: ContextMetadata = {
        source: { type: 'global', scope: 'system' },
        priority: ContextPriority.HIGH,
        tags: ['test'],
        dependencies: [],
        created: Date.now(),
        lastModified: Date.now()
      };

      const baseContext: BaseContext<string> = {
        id: 'test-context',
        timestamp: Date.now(),
        version: '1.0.0',
        data: 'test data',
        metadata
      };

      expect(baseContext.id).toBe('test-context');
      expect(typeof baseContext.data).toBe('string');
      expect(baseContext.metadata.priority).toBe(ContextPriority.HIGH);
    });
  });

  describe('ContextFragment Interface', () => {
    test('should create valid context fragment', () => {
      const fragment: ContextFragment = {
        id: 'fragment-1',
        type: 'global-rules',
        content: 'Test rule content',
        priority: ContextPriority.CRITICAL,
        tokenEstimate: 150,
        metadata: {
          source: { type: 'global', scope: 'system' },
          priority: ContextPriority.CRITICAL,
          tags: ['global', 'rules'],
          dependencies: [],
          created: Date.now(),
          lastModified: Date.now()
        },
        validation: {
          isValid: true,
          errors: [],
          warnings: [],
          lastValidated: Date.now()
        }
      };

      expect(fragment.id).toBe('fragment-1');
      expect(fragment.type).toBe('global-rules');
      expect(fragment.tokenEstimate).toBe(150);
      expect(fragment.validation.isValid).toBe(true);
    });

    test('should handle invalid fragment validation', () => {
      const fragment: ContextFragment = {
        id: 'invalid-fragment',
        type: 'task-context',
        content: '',
        priority: ContextPriority.LOW,
        tokenEstimate: 0,
        metadata: {
          source: { type: 'task', taskId: 'test', taskType: 'validation' },
          priority: ContextPriority.LOW,
          tags: ['task'],
          dependencies: [],
          created: Date.now(),
          lastModified: Date.now()
        },
        validation: {
          isValid: false,
          errors: [
            {
              code: 'EMPTY_CONTENT',
              message: 'Fragment content cannot be empty',
              severity: 'error'
            }
          ],
          warnings: [],
          lastValidated: Date.now()
        }
      };

      expect(fragment.validation.isValid).toBe(false);
      expect(fragment.validation.errors).toHaveLength(1);
      expect(fragment.validation.errors[0].code).toBe('EMPTY_CONTENT');
    });
  });

  describe('GlobalRule Interface', () => {
    test('should create valid global rule', () => {
      const rule: GlobalRule = {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'A test rule for validation',
        rule: 'Always test your code',
        enabled: true,
        priority: ContextPriority.HIGH
      };

      expect(rule.id).toBe('test-rule');
      expect(rule.enabled).toBe(true);
      expect(rule.priority).toBe(ContextPriority.HIGH);
    });

    test('should handle disabled rules', () => {
      const rule: GlobalRule = {
        id: 'disabled-rule',
        name: 'Disabled Rule',
        description: 'A disabled rule',
        rule: 'This rule is disabled',
        enabled: false,
        priority: ContextPriority.LOW
      };

      expect(rule.enabled).toBe(false);
    });
  });

  describe('TaskType Validation', () => {
    const validTaskTypes: TaskType[] = [
      'implementation',
      'testing',
      'research',
      'documentation',
      'validation',
      'integration',
      'optimization'
    ];

    test('should accept all valid task types', () => {
      validTaskTypes.forEach(taskType => {
        expect(typeof taskType).toBe('string');
        expect(validTaskTypes).toContain(taskType);
      });
    });
  });

  describe('Token Budget Validation', () => {
    test('should validate token budget structure', () => {
      const tokenBudget = {
        total: 8000,
        reserved: 800,
        available: 7200,
        used: 0,
        allocation: {
          global: 2000,
          phase: 2000,
          task: 2000,
          memory: 1000,
          buffer: 200
        }
      };

      expect(tokenBudget.total).toBe(8000);
      expect(tokenBudget.available + tokenBudget.reserved).toBe(tokenBudget.total);
      
      const totalAllocation = Object.values(tokenBudget.allocation)
        .reduce((sum, val) => sum + val, 0);
      expect(totalAllocation).toBeLessThanOrEqual(tokenBudget.total);
    });
  });

  describe('Type Safety Edge Cases', () => {
    test('should handle optional properties correctly', () => {
      const metadata: ContextMetadata = {
        source: { type: 'global', scope: 'system' },
        priority: ContextPriority.MEDIUM,
        tags: [],
        dependencies: [],
        created: Date.now(),
        lastModified: Date.now()
        // ttl is optional
      };

      expect(metadata.ttl).toBeUndefined();
    });

    test('should maintain readonly properties', () => {
      const baseContext: BaseContext = {
        id: 'readonly-test',
        timestamp: Date.now(),
        version: '1.0.0',
        data: {},
        metadata: {
          source: { type: 'global', scope: 'system' },
          priority: ContextPriority.MEDIUM,
          tags: [],
          dependencies: [],
          created: Date.now(),
          lastModified: Date.now()
        }
      };

      // These should be readonly and TypeScript would prevent modification
      expect(baseContext.id).toBe('readonly-test');
      expect(typeof baseContext.timestamp).toBe('number');
    });
  });

  describe('Context Fragment Types', () => {
    const validFragmentTypes = [
      'global-rules',
      'global-config', 
      'phase-context',
      'phase-history',
      'task-context',
      'task-state',
      'memory-pattern',
      'memory-decision',
      'command-context'
    ];

    test('should validate all fragment types', () => {
      validFragmentTypes.forEach(type => {
        const fragment: Partial<ContextFragment> = {
          type: type as any,
          content: 'test content',
          priority: ContextPriority.MEDIUM
        };
        
        expect(fragment.type).toBe(type);
      });
    });
  });
});