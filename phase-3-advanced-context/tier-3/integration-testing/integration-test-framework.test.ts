/**
 * Tests for Integration Test Framework
 * Phase 3: Advanced Context Features - Tier 3.3
 *
 * Comprehensive test suite for integration testing framework
 * with error handling and edge case coverage.
 */

import { IntegrationTestFramework } from './integration-test-framework';
import { ValidationTestSuite } from './validation-test-suite';
import { StressTestSuite } from './stress-test-suite';

// Mock the dependencies
jest.mock('./validation-test-suite');
jest.mock('./stress-test-suite');

describe('IntegrationTestFramework', () => {
  let framework: IntegrationTestFramework;
  let mockValidationSuite: jest.Mocked<ValidationTestSuite>;
  let mockStressSuite: jest.Mocked<StressTestSuite>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mocked classes
    (ValidationTestSuite as jest.MockedClass<typeof ValidationTestSuite>).mockClear();
    (StressTestSuite as jest.MockedClass<typeof StressTestSuite>).mockClear();

    framework = new IntegrationTestFramework();

    // Get mock instances
    mockValidationSuite = (ValidationTestSuite as jest.MockedClass<typeof ValidationTestSuite>).mock.instances[0] as jest.Mocked<ValidationTestSuite>;
    mockStressSuite = (StressTestSuite as jest.MockedClass<typeof StressTestSuite>).mock.instances[0] as jest.Mocked<StressTestSuite>;
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      expect(framework).toBeDefined();
      expect(ValidationTestSuite).toHaveBeenCalled();
      expect(StressTestSuite).toHaveBeenCalled();
    });

    it('should initialize test scenarios', () => {
      const scenarios = (framework as any).testScenarios;
      expect(scenarios.size).toBeGreaterThan(0);
      expect(scenarios.has('prp-field-integration')).toBe(true);
      expect(scenarios.has('chain-of-thought-validation')).toBe(true);
      expect(scenarios.has('few-shot-learning')).toBe(true);
    });
  });

  describe('runIntegrationTests', () => {
    beforeEach(() => {
      // Mock validation suite methods
      mockValidationSuite.runValidationSuite.mockResolvedValue({
        passed: true,
        totalTests: 10,
        passedTests: 10,
        failedTests: 0,
        skippedTests: 0,
        duration: 1000,
        testResults: [],
        coverage: {
          statements: 95,
          branches: 90,
          functions: 92,
          lines: 94
        }
      });

      // Mock stress suite methods
      mockStressSuite.runStressTests.mockResolvedValue({
        passed: true,
        scenarios: [],
        duration: 2000,
        resourceUsage: {
          peakMemory: 100,
          peakCpu: 50,
          averageResponseTime: 100,
          maxConcurrentConnections: 10
        },
        errors: []
      });
    });

    it('should run all test scenarios successfully', async () => {
      const result = await framework.runIntegrationTests();

      expect(result.success).toBe(true);
      expect(result.totalScenarios).toBeGreaterThan(0);
      expect(result.passedScenarios).toBe(result.totalScenarios);
      expect(result.failedScenarios).toBe(0);
      expect(result.scenarioResults).toHaveLength(result.totalScenarios);
    });

    it('should handle scenario failures', async () => {
      // Mock a failing validation
      mockValidationSuite.runValidationSuite.mockResolvedValueOnce({
        passed: false,
        totalTests: 10,
        passedTests: 8,
        failedTests: 2,
        skippedTests: 0,
        duration: 1000,
        testResults: [],
        coverage: {
          statements: 85,
          branches: 80,
          functions: 82,
          lines: 84
        }
      });

      const result = await framework.runIntegrationTests();

      expect(result.success).toBe(false);
      expect(result.failedScenarios).toBeGreaterThan(0);
    });

    it('should handle test execution errors', async () => {
      // Mock validation suite to throw error
      mockValidationSuite.runValidationSuite.mockRejectedValue(new Error('Validation failed'));

      const result = await framework.runIntegrationTests();

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Error in scenario');
    });
  });

  describe('runScenario', () => {
    it('should execute specific scenario', async () => {
      const scenario = (framework as any).testScenarios.get('prp-field-integration');
      const result = await (framework as any).runScenario(scenario);

      expect(result).toBeDefined();
      expect(result.scenarioId).toBe('prp-field-integration');
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should handle pre-test setup', async () => {
      const scenario = (framework as any).testScenarios.get('chain-of-thought-validation');
      const setupSpy = jest.spyOn(framework as any, 'setupChainOfThought').mockResolvedValue(undefined);

      await (framework as any).runScenario(scenario);

      expect(setupSpy).toHaveBeenCalled();
    });

    it('should handle post-test cleanup', async () => {
      const scenario = (framework as any).testScenarios.get('few-shot-learning');
      const cleanupSpy = jest.spyOn(framework as any, 'cleanupFewShot').mockResolvedValue(undefined);

      await (framework as any).runScenario(scenario);

      expect(cleanupSpy).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle setup errors gracefully', async () => {
      const scenario = (framework as any).testScenarios.get('prp-field-integration');
      jest.spyOn(framework as any, 'setupPRPField').mockRejectedValue(new Error('Setup failed'));

      const result = await (framework as any).runScenario(scenario);

      expect(result.passed).toBe(false);
      expect(result.errors).toContain('Setup failed: Setup failed');
    });

    it('should handle test execution errors', async () => {
      const scenario = {
        scenarioId: 'test-scenario',
        name: 'Test Scenario',
        description: 'Test',
        requiredSystems: [],
        testSuites: ['validation'],
        performanceTargets: {},
        successCriteria: { minPassRate: 0.95 },
        tests: [() => {
          throw new Error('Test error');
        }]
      };

      const result = await (framework as any).runScenario(scenario);

      expect(result.passed).toBe(false);
      expect(result.errors).toContain('Test execution failed: Test error');
    });

    it('should handle cleanup errors', async () => {
      const scenario = (framework as any).testScenarios.get('few-shot-learning');
      jest.spyOn(framework as any, 'cleanupFewShot').mockRejectedValue(new Error('Cleanup failed'));

      // Should not throw, but log error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await (framework as any).runScenario(scenario);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Cleanup failed'));
      consoleSpy.mockRestore();
    });
  });

  describe('performance validation', () => {
    it('should validate performance targets', async () => {
      const performanceData = {
        responseTime: 150,
        throughput: 90,
        errorRate: 0.02,
        resourceUtilization: 0.75
      };

      const targets = {
        maxResponseTime: 200,
        minThroughput: 80,
        maxErrorRate: 0.05,
        maxResourceUtilization: 0.8
      };

      const result = await (framework as any).validatePerformance(performanceData, targets);

      expect(result.passed).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should detect performance violations', async () => {
      const performanceData = {
        responseTime: 250,
        throughput: 70,
        errorRate: 0.1,
        resourceUtilization: 0.9
      };

      const targets = {
        maxResponseTime: 200,
        minThroughput: 80,
        maxErrorRate: 0.05,
        maxResourceUtilization: 0.8
      };

      const result = await (framework as any).validatePerformance(performanceData, targets);

      expect(result.passed).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations).toContain(expect.stringContaining('Response time'));
    });
  });

  describe('test suite integration', () => {
    it('should run validation suite when required', async () => {
      const scenario = {
        scenarioId: 'test',
        name: 'Test',
        description: 'Test',
        requiredSystems: [],
        testSuites: ['validation'],
        performanceTargets: {},
        successCriteria: { minPassRate: 0.95 },
        tests: []
      };

      await (framework as any).runTestSuites(scenario);

      expect(mockValidationSuite.runValidationSuite).toHaveBeenCalled();
    });

    it('should run stress tests when required', async () => {
      const scenario = {
        scenarioId: 'test',
        name: 'Test',
        description: 'Test',
        requiredSystems: [],
        testSuites: ['stress'],
        performanceTargets: {},
        successCriteria: { minPassRate: 0.95 },
        tests: []
      };

      await (framework as any).runTestSuites(scenario);

      expect(mockStressSuite.runStressTests).toHaveBeenCalled();
    });

    it('should skip test suites when none required', async () => {
      const scenario = {
        scenarioId: 'test',
        name: 'Test',
        description: 'Test',
        requiredSystems: [],
        testSuites: [],
        performanceTargets: {},
        successCriteria: { minPassRate: 0.95 },
        tests: []
      };

      const results = await (framework as any).runTestSuites(scenario);

      expect(results).toEqual({});
      expect(mockValidationSuite.runValidationSuite).not.toHaveBeenCalled();
      expect(mockStressSuite.runStressTests).not.toHaveBeenCalled();
    });
  });

  describe('success criteria evaluation', () => {
    it('should pass when meeting all criteria', () => {
      const criteria = {
        minPassRate: 0.95,
        maxDuration: 5000,
        maxErrors: 2
      };

      const results = {
        passRate: 0.96,
        duration: 4000,
        errors: []
      };

      const evaluation = (framework as any).evaluateSuccessCriteria(results, criteria);

      expect(evaluation.passed).toBe(true);
      expect(evaluation.violations).toHaveLength(0);
    });

    it('should fail when not meeting criteria', () => {
      const criteria = {
        minPassRate: 0.95,
        maxDuration: 5000,
        maxErrors: 2
      };

      const results = {
        passRate: 0.90,
        duration: 6000,
        errors: ['error1', 'error2', 'error3']
      };

      const evaluation = (framework as any).evaluateSuccessCriteria(results, criteria);

      expect(evaluation.passed).toBe(false);
      expect(evaluation.violations.length).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty test scenarios', async () => {
      (framework as any).testScenarios.clear();

      const result = await framework.runIntegrationTests();

      expect(result.success).toBe(true);
      expect(result.totalScenarios).toBe(0);
      expect(result.scenarioResults).toHaveLength(0);
    });

    it('should handle missing test functions', async () => {
      const scenario = {
        scenarioId: 'broken',
        name: 'Broken Scenario',
        description: 'Test',
        requiredSystems: [],
        testSuites: [],
        performanceTargets: {},
        successCriteria: { minPassRate: 0.95 },
        tests: [null, undefined] // Invalid test functions
      };

      const result = await (framework as any).runScenario(scenario);

      expect(result.passed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle concurrent test execution', async () => {
      // Run multiple scenarios in parallel
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(framework.runIntegrationTests());
      }

      const results = await Promise.all(promises);

      // All should complete without interference
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.totalScenarios).toBeGreaterThan(0);
      });
    });
  });
});
