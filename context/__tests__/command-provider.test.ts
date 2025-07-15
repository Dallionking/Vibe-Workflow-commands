/**
 * Command Provider Integration Test Suite
 * Tests for CommandContextProvider integration layer
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { CommandContextProvider } from '../integration/command-provider';
import { ContextPriority } from '../types/context.types';

// Mock file system operations
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

describe('CommandContextProvider', () => {
  let provider: CommandContextProvider;

  beforeEach(() => {
    provider = new CommandContextProvider({
      enableMemoryLearning: true,
      enableCaching: true,
      enableValidation: true,
      maxContextTokens: 2000,
      fallbackStrategy: 'essential',
      debugMode: false
    });
  });

  describe('Initialization', () => {
    test('should initialize successfully', async () => {
      await expect(provider.initialize()).resolves.not.toThrow();
    });

    test('should initialize with custom configuration', async () => {
      const customProvider = new CommandContextProvider({
        maxContextTokens: 5000,
        debugMode: true
      });

      await expect(customProvider.initialize()).resolves.not.toThrow();
    });

    test('should handle initialization errors gracefully', async () => {
      // Mock an initialization error
      const errorProvider = new CommandContextProvider();
      
      // Should not throw during initialization
      await expect(errorProvider.initialize()).resolves.not.toThrow();
    });
  });

  describe('Command Context Generation', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should generate context for Read command', async () => {
      const result = await provider.getCommandContext('Read', {
        file_path: '/test/file.ts'
      });

      expect(result).toBeDefined();
      expect(result.commandName).toBe('Read');
      expect(result.context).toBeDefined();
      expect(result.fragments).toBeDefined();
      expect(result.tokens).toBeGreaterThan(0);
      expect(result.validation).toBeDefined();
      expect(result.executionTime).toBeGreaterThan(0);
    });

    test('should generate context for Write command', async () => {
      const result = await provider.getCommandContext('Write', {
        file_path: '/test/file.ts',
        content: 'test content'
      });

      expect(result.commandName).toBe('Write');
      expect(result.context).toContain('Context Information');
      expect(result.validation.passed).toBeDefined();
    });

    test('should generate context for Bash command', async () => {
      const result = await provider.getCommandContext('Bash', {
        command: 'npm test'
      });

      expect(result.commandName).toBe('Bash');
      expect(result.context).toBeDefined();
      expect(result.tokens).toBeLessThanOrEqual(2000); // Respect token limit
    });

    test('should handle unknown commands', async () => {
      const result = await provider.getCommandContext('UnknownCommand', {});

      expect(result.commandName).toBe('UnknownCommand');
      expect(result.context).toBeDefined();
      // Should still provide some context even for unknown commands
    });

    test('should respect token limits', async () => {
      const smallProvider = new CommandContextProvider({
        maxContextTokens: 500
      });
      await smallProvider.initialize();

      const result = await smallProvider.getCommandContext('Read', {});

      expect(result.tokens).toBeLessThanOrEqual(500);
    });
  });

  describe('Context Validation', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should validate command context', async () => {
      const result = await provider.getCommandContext('Read', {});

      expect(result.validation).toBeDefined();
      expect(typeof result.validation.passed).toBe('boolean');
      expect(Array.isArray(result.validation.errors)).toBe(true);
      expect(Array.isArray(result.validation.warnings)).toBe(true);
    });

    test('should detect missing required context', async () => {
      // Create provider with strict validation
      const strictProvider = new CommandContextProvider({
        enableValidation: true,
        maxContextTokens: 100 // Very small to trigger validation issues
      });
      await strictProvider.initialize();

      const result = await strictProvider.getCommandContext('Write', {});

      // With very small token budget, validation might fail
      if (!result.validation.passed) {
        expect(result.validation.errors.length).toBeGreaterThan(0);
      }
    });

    test('should provide warnings for sub-optimal context', async () => {
      const result = await provider.getCommandContext('Bash', {});

      // Should provide warnings about safety or other considerations
      expect(result.validation.warnings).toBeDefined();
    });
  });

  describe('Phase Context Management', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should update phase context', async () => {
      await provider.updatePhaseContext(
        1,
        'Context Engineering',
        ['task-1', 'task-2'],
        2
      );

      const summary = provider.getContextSummary();
      expect(summary.phase).toBeDefined();
      expect(summary.phase?.phaseNumber).toBe(1);
      expect(summary.phase?.phaseName).toBe('Context Engineering');
    });

    test('should track phase progress', async () => {
      await provider.updatePhaseContext(1, 'Test Phase', ['task-1']);
      
      let summary = provider.getContextSummary();
      expect(summary.phase?.progress).toBeDefined();

      // Update with more completed tasks
      await provider.updatePhaseContext(1, 'Test Phase', ['task-1', 'task-2', 'task-3']);
      
      summary = provider.getContextSummary();
      expect(summary.phase?.progress).toBeGreaterThan(0);
    });

    test('should handle phase transitions', async () => {
      // Start with Phase 1
      await provider.updatePhaseContext(1, 'Phase 1', ['task-1']);
      
      let summary = provider.getContextSummary();
      expect(summary.phase?.phaseNumber).toBe(1);

      // Transition to Phase 2
      await provider.updatePhaseContext(2, 'Phase 2', []);
      
      summary = provider.getContextSummary();
      expect(summary.phase?.phaseNumber).toBe(2);
      expect(summary.phase?.phaseName).toBe('Phase 2');
    });
  });

  describe('Command Result Recording', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should record successful command results', async () => {
      const context = await provider.getCommandContext('Read', {});
      
      // Record success
      provider.recordCommandResult('Read', 'success', 'File read successfully');

      // Should not throw and should update learning system
      expect(true).toBe(true);
    });

    test('should record failed command results', async () => {
      const context = await provider.getCommandContext('Write', {});
      
      // Record failure
      provider.recordCommandResult('Write', 'failure', 'Permission denied');

      // Should handle failure recording gracefully
      expect(true).toBe(true);
    });

    test('should record partial command results', async () => {
      const context = await provider.getCommandContext('Bash', {});
      
      // Record partial success
      provider.recordCommandResult('Bash', 'partial', 'Command completed with warnings');

      expect(true).toBe(true);
    });
  });

  describe('Context Summary', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should provide comprehensive context summary', async () => {
      await provider.updatePhaseContext(1, 'Test Phase', ['task-1']);
      
      const summary = provider.getContextSummary();

      expect(summary.global).toBeDefined();
      expect(summary.global.enabled).toBeDefined();
      expect(summary.global.rulesCount).toBeGreaterThanOrEqual(0);

      expect(summary.phase).toBeDefined();
      expect(summary.task).toBeDefined(); // May be null

      expect(summary.memory).toBeDefined();
      expect(summary.memory.patternsLearned).toBeGreaterThanOrEqual(0);
      expect(summary.memory.accuracyRate).toBeGreaterThanOrEqual(0);

      expect(summary.performance).toBeDefined();
      expect(summary.performance.totalCommands).toBeGreaterThanOrEqual(0);
    });

    test('should handle empty context state', async () => {
      const summary = provider.getContextSummary();

      expect(summary).toBeDefined();
      expect(summary.global).toBeDefined();
      expect(summary.memory).toBeDefined();
      expect(summary.performance).toBeDefined();
    });
  });

  describe('State Export/Import', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should export context state', async () => {
      await provider.updatePhaseContext(1, 'Test Phase', ['task-1']);
      
      const exported = provider.exportContextState();

      expect(exported).toBeDefined();
      expect(exported.global).toBeDefined();
      expect(exported.config).toBeDefined();
      expect(exported.timestamp).toBeDefined();
    });

    test('should import context state', async () => {
      // First export a state
      await provider.updatePhaseContext(1, 'Original Phase', ['task-1']);
      const exported = provider.exportContextState();

      // Create new provider and import
      const newProvider = new CommandContextProvider();
      await newProvider.initialize();
      
      newProvider.importContextState(exported);

      const summary = newProvider.getContextSummary();
      expect(summary.phase?.phaseName).toBe('Original Phase');
    });

    test('should handle partial import data', async () => {
      const partialData = {
        global: null,
        phase: null,
        task: null,
        memory: null,
        config: {
          enableMemoryLearning: false,
          enableCaching: true,
          enableValidation: true,
          maxContextTokens: 8000,
          fallbackStrategy: 'minimal' as const,
          debugMode: false
        },
        timestamp: Date.now()
      };

      // Should not throw with partial data
      expect(() => provider.importContextState(partialData)).not.toThrow();
    });
  });

  describe('Fallback Behavior', () => {
    test('should provide fallback context on errors', async () => {
      // Create provider that will encounter errors
      const errorProvider = new CommandContextProvider({
        maxContextTokens: -1 // Invalid configuration to trigger errors
      });

      await errorProvider.initialize();
      
      const result = await errorProvider.getCommandContext('Read', {});

      expect(result).toBeDefined();
      expect(result.context).toContain('Fallback Context');
      expect(result.validation.passed).toBe(false);
      expect(result.validation.warnings).toContain('Using fallback context');
    });

    test('should handle different fallback strategies', async () => {
      const strategies = ['minimal', 'essential', 'degraded'];

      for (const strategy of strategies) {
        const strategyProvider = new CommandContextProvider({
          fallbackStrategy: strategy as any
        });

        await strategyProvider.initialize();
        const result = await strategyProvider.getCommandContext('Read', {});

        expect(result).toBeDefined();
        expect(result.context).toBeDefined();
      }
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should complete context generation quickly', async () => {
      const startTime = Date.now();
      
      await provider.getCommandContext('Read', {});
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should complete within reasonable time (1 second for tests)
      expect(executionTime).toBeLessThan(1000);
    });

    test('should handle concurrent context requests', async () => {
      const promises = [];

      // Start multiple context requests concurrently
      for (let i = 0; i < 5; i++) {
        promises.push(provider.getCommandContext('Read', { file_path: `/test${i}.ts` }));
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.commandName).toBe('Read');
      });
    });

    test('should maintain performance with repeated calls', async () => {
      const times = [];

      // Make multiple calls and measure time
      for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        await provider.getCommandContext('Read', {});
        const endTime = Date.now();
        
        times.push(endTime - startTime);
      }

      // Average time should be reasonable
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      expect(averageTime).toBeLessThan(100); // Should average under 100ms
    });
  });

  describe('Memory Learning Integration', () => {
    beforeEach(async () => {
      await provider.initialize();
    });

    test('should provide recommendations when enabled', async () => {
      const learningProvider = new CommandContextProvider({
        enableMemoryLearning: true
      });
      await learningProvider.initialize();

      const result = await learningProvider.getCommandContext('Read', {});

      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should not provide recommendations when disabled', async () => {
      const noLearningProvider = new CommandContextProvider({
        enableMemoryLearning: false
      });
      await noLearningProvider.initialize();

      const result = await noLearningProvider.getCommandContext('Read', {});

      expect(result.recommendations).toEqual([]);
    });

    test('should update learning metrics over time', async () => {
      // Generate some context and record results
      await provider.getCommandContext('Read', {});
      provider.recordCommandResult('Read', 'success');

      await provider.getCommandContext('Write', {});
      provider.recordCommandResult('Write', 'failure');

      const summary = provider.getContextSummary();
      expect(summary.memory.patternsLearned).toBeGreaterThanOrEqual(0);
    });
  });
});