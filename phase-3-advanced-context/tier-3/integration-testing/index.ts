/**
 * Integration Testing Suite Index
 * Phase 3: Advanced Context Features - Tier 3.3
 *
 * Export all integration testing components for comprehensive
 * system testing, validation, stress testing, and quality assurance.
 */

export * from './integration-test-framework';
export * from './validation-test-suite';
export * from './stress-test-suite';

// Re-export main classes for convenience
export { IntegrationTestFramework } from './integration-test-framework';
export { ValidationTestSuite } from './validation-test-suite';
export { StressTestSuite } from './stress-test-suite';

// Export type definitions from IntegrationTestFramework
export type {
  TestSuiteConfig,
  TestCase,
  TestResult,
  TestMetrics,
  TestError,
  TestWarning,
  TestDetails,
  TestStep,
  TestAssertion,
  PerformanceSnapshot,
  ValidationSnapshot,
  TestSuiteResult,
  TestSummary,
  StressTestConfig,
  StressTestResult,
  StressTestDataPoint
} from './integration-test-framework';

// Export type definitions from ValidationTestSuite
export type {
  ValidationScenario,
  ValidationPrecondition,
  ValidationExpectation,
  ValidationRule,
  ValidationRuleResult,
  ValidationTestResult
} from './validation-test-suite';

// Export type definitions from StressTestSuite
export type {
  StressTestScenario,
  StressTestParameters,
  StressTestExpectations,
  BreakingPointThresholds,
  StressTestMetrics,
  BreakingPoint,
  StabilityAnalysis,
  ResourceUsageAnalysis,
  MemoryLeak,
  CpuSpike,
  StressRecommendation,
  ErrorPattern
} from './stress-test-suite';
