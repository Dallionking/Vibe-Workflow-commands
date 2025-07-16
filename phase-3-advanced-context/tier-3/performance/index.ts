/**
 * Performance Optimization Suite Index
 * Phase 3: Advanced Context Features - Tier 3.2
 *
 * Export all performance optimization components for comprehensive
 * performance analysis, caching, monitoring, and optimization.
 */

export * from './performance-optimizer';
export * from './benchmark-framework';
export * from './cache-optimizer';
export * from './performance-monitor';
export * from './lazy-load-manager';
export * from './token-optimizer';

// Re-export main classes for convenience
export { PerformanceOptimizer } from './performance-optimizer';
export { BenchmarkFramework } from './benchmark-framework';
export { CacheOptimizer } from './cache-optimizer';
export { PerformanceMonitor } from './performance-monitor';
export { LazyLoadManager } from './lazy-load-manager';
export { TokenOptimizer } from './token-optimizer';

// Export type definitions from PerformanceOptimizer
export type {
  PerformanceConfig,
  AlertThresholds,
  PerformanceMetrics,
  CoordinationMetrics,
  ResourceMetrics,
  OptimizationResult,
  Improvement,
  Recommendation,
  BenchmarkResult
} from './performance-optimizer';

// Export type definitions from BenchmarkFramework
export type {
  BenchmarkConfig,
  BenchmarkResult as BenchmarkFrameworkResult,
  BenchmarkMetadata,
  GCStats,
  BenchmarkSuite,
  BenchmarkFunction,
  BenchmarkRunner
} from './benchmark-framework';

// Export type definitions from CacheOptimizer
export type {
  CacheConfig,
  CacheEntry,
  CacheEntryMetadata,
  CacheStats,
  CacheOptimizationResult,
  CacheOptimizationChange
} from './cache-optimizer';

// Export type definitions from PerformanceMonitor
export type {
  MonitoringConfig,
  MetricSample,
  MetricSeries,
  MetricAggregations,
  TrendAnalysis,
  Alert,
  PerformanceReport,
  TrendSummary,
  HealthStatus
} from './performance-monitor';

// Export type definitions from LazyLoadManager
export type {
  LazyLoadConfig,
  LoadableResource,
  ResourceMetadata,
  LoadingChunk,
  LoadingStrategy,
  PredictionModel,
  ResourcePrediction,
  AccessPattern,
  LazyLoadOptimizationResult,
  LazyLoadMetrics
} from './lazy-load-manager';

// Export type definitions from TokenOptimizer
export type {
  TokenOptimizationConfig,
  TokenContext,
  TokenMetadata,
  CompressionResult,
  PruningResult,
  BatchResult,
  TokenOptimizationResult,
  TokenOptimizationMetrics
} from './token-optimizer';
