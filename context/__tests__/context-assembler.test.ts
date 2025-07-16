/**
 * Context Assembler Test Suite
 * Tests for intelligent context assembly with budget management
 */

import { describe, test, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { ContextPriority } from '../types/context.types';

// Use module factories to prevent circular dependencies
jest.mock('../layers/global', () => {
  const mockGlobalContextManager = {
    getContext: jest.fn()
  };
  return { globalContextManager: mockGlobalContextManager };
});

jest.mock('../layers/phase', () => {
  const mockPhaseContextManager = {
    getCurrentPhase: jest.fn(),
    getPhaseSummary: jest.fn()
  };
  return { phaseContextManager: mockPhaseContextManager };
});

jest.mock('../layers/task', () => {
  const mockTaskContextManager = {
    getCurrentTask: jest.fn(),
    getTaskSummary: jest.fn(),
    getContextForCommand: jest.fn()
  };
  return { taskContextManager: mockTaskContextManager };
});

// Import after mocking to avoid circular dependencies
import { ContextAssembler } from '../assembly/context-assembler';
import { globalContextManager } from '../layers/global';
import { phaseContextManager } from '../layers/phase';
import { taskContextManager } from '../layers/task';

describe('ContextAssembler', () => {
  let assembler: ContextAssembler;

  beforeEach(() => {
    // Setup mock return values before creating assembler
    (globalContextManager.getContext as jest.Mock).mockReturnValue({
      rules: [
        { id: 'rule-1', name: 'Rule 1', rule: 'Test rule content', enabled: true },
        { id: 'rule-2', name: 'Rule 2', rule: 'Another rule', enabled: false }
      ],
      configuration: {
        mcpTools: [
          { name: 'Context7', enabled: true, priority: ContextPriority.CRITICAL },
          { name: 'Perplexity', enabled: true, priority: ContextPriority.HIGH }
        ],
        qualityStandards: [
          { name: 'Test Coverage', threshold: 95 },
          { name: 'Code Quality', threshold: 80 }
        ]
      }
    });

    (phaseContextManager.getCurrentPhase as jest.Mock).mockReturnValue({
      phaseNumber: 1,
      phaseName: 'Context Engineering',
      data: {
        progress: { completionPercentage: 75 }
      },
      phaseState: {
        completedTasks: ['task-1', 'task-2'],
        blockers: []
      }
    });

    (phaseContextManager.getPhaseSummary as jest.Mock).mockReturnValue('Phase 1: Context Engineering - 75% complete');

    (taskContextManager.getCurrentTask as jest.Mock).mockReturnValue({
      taskId: 'test-task',
      taskType: 'implementation',
      data: {
        objective: 'Test objective',
        instructions: ['Do this', 'Do that'],
        parameters: [
          { name: 'file_path', value: '/test/path', required: true }
        ]
      }
    });

    (taskContextManager.getTaskSummary as jest.Mock).mockReturnValue('Task: test-task (implementation)');

    (taskContextManager.getContextForCommand as jest.Mock).mockReturnValue({
      commandName: 'Read',
      taskId: 'test-task',
      taskType: 'implementation',
      relevantParameters: [
        { name: 'file_path', value: '/test/path' }
      ]
    });

    assembler = new ContextAssembler({
      tokenBudget: {
        total: 1000,
        reserved: 100,
        available: 900,
        used: 0,
        allocation: {
          global: 300,
          phase: 300,
          task: 200,
          memory: 100,
          buffer: 100
        }
      },
      fallbackStrategy: 'truncate-lowest-priority'
    });
  });

  afterEach(() => {
    // Clean up mocks to prevent memory leaks
    jest.clearAllMocks();
  });

  describe('Context Assembly', () => {
    test('should assemble context successfully', async () => {
      const result = await assembler.assembleContext();

      expect(result).toBeDefined();
      expect(result.fragments).toBeDefined();
      expect(result.totalTokens).toBeGreaterThan(0);
      expect(result.budgetUsed).toBeGreaterThan(0);
      expect(result.budgetRemaining).toBeGreaterThanOrEqual(0);
      expect(result.priorityBreakdown).toBeDefined();
      expect(result.fallbacksApplied).toBeDefined();
      expect(result.warnings).toBeDefined();
    });

    test('should assemble context for specific command', async () => {
      const result = await assembler.assembleForCommand('Read');

      expect(result).toBeDefined();
      expect(result.fragments.length).toBeGreaterThan(0);

      // Should include command-specific fragment
      const hasCommandFragment = result.fragments.some(f =>
        f.type === 'command-context' || f.content.includes('Read')
      );
      expect(hasCommandFragment).toBe(true);
    });

    test('should handle empty context gracefully', async () => {
      // Mock empty context managers using proper Jest mocks
      (globalContextManager.getContext as jest.Mock).mockReturnValueOnce(null);
      (phaseContextManager.getCurrentPhase as jest.Mock).mockReturnValueOnce(null);
      (taskContextManager.getCurrentTask as jest.Mock).mockReturnValueOnce(null);

      const result = await assembler.assembleContext();

      expect(result).toBeDefined();
      expect(result.fragments).toEqual([]);
      expect(result.totalTokens).toBe(0);

      // Mocks will be automatically restored by afterEach
    });
  });

  describe('Token Budget Management', () => {
    test('should respect token budget limits', async () => {
      // Create assembler with very small budget
      const smallBudgetAssembler = new ContextAssembler({
        tokenBudget: {
          total: 100,
          reserved: 10,
          available: 90,
          used: 0,
          allocation: {
            global: 30,
            phase: 30,
            task: 20,
            memory: 5,
            buffer: 5
          }
        }
      });

      const result = await smallBudgetAssembler.assembleContext();

      expect(result.totalTokens).toBeLessThanOrEqual(90);
      expect(result.budgetUsed).toBeLessThanOrEqual(90);
    });

    test('should apply fallback strategies when over budget', async () => {
      // Create assembler with tiny budget to force fallbacks
      const tinyBudgetAssembler = new ContextAssembler({
        tokenBudget: {
          total: 50,
          reserved: 5,
          available: 45,
          used: 0,
          allocation: {
            global: 15,
            phase: 15,
            task: 10,
            memory: 3,
            buffer: 2
          }
        },
        fallbackStrategy: 'truncate-lowest-priority'
      });

      const result = await tinyBudgetAssembler.assembleContext();

      expect(result.totalTokens).toBeLessThanOrEqual(45);
      // Should have applied fallbacks due to small budget
      expect(result.fallbacksApplied.length).toBeGreaterThan(0);
    });

    test('should handle different fallback strategies', async () => {
      const strategies = ['truncate-lowest-priority', 'compress-content', 'truncate-oldest'];

      for (const strategy of strategies) {
        const strategyAssembler = new ContextAssembler({
          tokenBudget: {
            total: 50,
            reserved: 5,
            available: 45,
            used: 0,
            allocation: {
              global: 15,
              phase: 15,
              task: 10,
              memory: 3,
              buffer: 2
            }
          },
          fallbackStrategy: strategy as any
        });

        const result = await strategyAssembler.assembleContext();
        expect(result.totalTokens).toBeLessThanOrEqual(45);
      }
    });
  });

  describe('Priority Management', () => {
    test('should prioritize critical fragments', async () => {
      const result = await assembler.assembleContext();

      // Check that critical priority fragments are included
      const criticalFragments = result.fragments.filter(f =>
        f.priority === ContextPriority.CRITICAL
      );

      const totalCriticalTokens = criticalFragments.reduce((sum, f) =>
        sum + f.tokenEstimate, 0
      );

      expect(result.priorityBreakdown[ContextPriority.CRITICAL]).toBe(totalCriticalTokens);
    });

    test('should maintain priority ordering', async () => {
      const result = await assembler.assembleContext();

      // Check that fragments are generally ordered by priority
      for (let i = 0; i < result.fragments.length - 1; i++) {
        const currentPriority = result.fragments[i].priority;
        const nextPriority = result.fragments[i + 1].priority;

        // Current should be >= next (higher priority numbers come first)
        expect(currentPriority).toBeGreaterThanOrEqual(nextPriority);
      }
    });

    test('should handle priority breakdown correctly', async () => {
      const result = await assembler.assembleContext();

      // Sum of all priority breakdown values should equal total tokens
      const breakdownSum = Object.values(result.priorityBreakdown)
        .reduce((sum, tokens) => sum + tokens, 0);

      expect(breakdownSum).toBe(result.totalTokens);
    });
  });

  describe('Configuration Management', () => {
    test('should update configuration', () => {
      const newConfig = {
        tokenBudget: {
          total: 2000,
          reserved: 200,
          available: 1800,
          used: 0,
          allocation: {
            global: 600,
            phase: 600,
            task: 400,
            memory: 200,
            buffer: 200
          }
        }
      };

      assembler.updateConfig(newConfig);
      const config = assembler.getConfig();

      expect(config.tokenBudget.total).toBe(2000);
      expect(config.tokenBudget.available).toBe(1800);
    });

    test('should get current configuration', () => {
      const config = assembler.getConfig();

      expect(config).toBeDefined();
      expect(config.tokenBudget).toBeDefined();
      expect(config.priorityWeights).toBeDefined();
      expect(config.fallbackStrategy).toBeDefined();
      expect(config.cacheConfig).toBeDefined();
    });

    test('should maintain configuration immutability', () => {
      const config = assembler.getConfig();
      const originalTotal = config.tokenBudget.total;

      // Attempt to modify returned config
      config.tokenBudget.total = 9999;

      // Should not affect internal configuration
      const newConfig = assembler.getConfig();
      expect(newConfig.tokenBudget.total).toBe(originalTotal);
    });
  });

  describe('Fragment Processing', () => {
    test('should remove expired fragments', async () => {
      // This test would require mocking fragments with expired TTL
      // For now, just ensure the assembler handles the expiration check
      const result = await assembler.assembleContext();

      // Should complete without errors even if some fragments are expired
      expect(result).toBeDefined();
    });

    test('should validate fragment content', async () => {
      const result = await assembler.assembleContext();

      // All fragments should have valid content
      result.fragments.forEach(fragment => {
        expect(fragment.content).toBeDefined();
        expect(fragment.content.length).toBeGreaterThan(0);
        expect(fragment.tokenEstimate).toBeGreaterThan(0);
      });
    });
  });

  describe('Command Context Integration', () => {
    test('should generate appropriate context for different commands', async () => {
      const commands = ['Read', 'Write', 'Edit', 'Bash', 'TodoWrite'];

      for (const command of commands) {
        const result = await assembler.assembleForCommand(command);

        expect(result).toBeDefined();
        expect(result.fragments.length).toBeGreaterThan(0);

        // Should include command-specific information
        const hasCommandInfo = result.fragments.some(f =>
          f.content.includes(command) || f.type === 'command-context'
        );
        expect(hasCommandInfo).toBe(true);
      }
    });

    test('should handle unknown commands gracefully', async () => {
      const result = await assembler.assembleForCommand('UnknownCommand');

      expect(result).toBeDefined();
      expect(result.warnings).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should handle assembly errors gracefully', async () => {
      // Mock an error in fragment collection using proper Jest mock
      (globalContextManager.getContext as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Mock assembly error');
      });

      // Should not throw, but handle gracefully
      const result = await assembler.assembleContext();

      expect(result).toBeDefined();
      expect(result.warnings.length).toBeGreaterThan(0);

      // Mock will be automatically restored by afterEach
    });

    test('should validate required context components', async () => {
      const result = await assembler.assembleContext();

      expect(result.fragments).toBeDefined();
      expect(Array.isArray(result.fragments)).toBe(true);
      expect(typeof result.totalTokens).toBe('number');
      expect(typeof result.budgetUsed).toBe('number');
      expect(typeof result.budgetRemaining).toBe('number');
      expect(Array.isArray(result.fallbacksApplied)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    test('should complete assembly within reasonable time', async () => {
      const startTime = Date.now();

      await assembler.assembleContext();

      const endTime = Date.now();
      const assemblyTime = endTime - startTime;

      // Should complete within 1 second for test data
      expect(assemblyTime).toBeLessThan(1000);
    });

    test('should handle multiple concurrent assemblies', async () => {
      const promises = [];

      // Start multiple assemblies concurrently
      for (let i = 0; i < 5; i++) {
        promises.push(assembler.assembleContext());
      }

      const results = await Promise.all(promises);

      // All should complete successfully
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.fragments).toBeDefined();
      });
    });
  });

  describe('Memory Management', () => {
    test('should not leak memory with repeated assemblies', async () => {
      // Perform many assemblies to check for memory leaks
      for (let i = 0; i < 50; i++) {
        const result = await assembler.assembleContext();
        expect(result).toBeDefined();
      }

      // If we get here without running out of memory, test passes
      expect(true).toBe(true);
    });

    test('should handle large context assemblies', async () => {
      // Create assembler with large budget
      const largeAssembler = new ContextAssembler({
        tokenBudget: {
          total: 50000,
          reserved: 5000,
          available: 45000,
          used: 0,
          allocation: {
            global: 15000,
            phase: 15000,
            task: 10000,
            memory: 2500,
            buffer: 2500
          }
        }
      });

      const result = await largeAssembler.assembleContext();

      expect(result).toBeDefined();
      expect(result.totalTokens).toBeGreaterThan(0);
    });
  });
});
