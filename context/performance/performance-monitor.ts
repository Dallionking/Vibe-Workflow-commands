/**
 * Performance Monitoring Suite for Context Engineering System
 * Provides comprehensive benchmarking and real-time performance tracking
 */

import { performance } from 'perf_hooks';
import { ContextFragment, ContextPriority } from '../types/context.types';

/**
 * Performance Metrics Interface
 */
export interface PerformanceMetrics {
  operation: string;
  duration: number; // milliseconds
  memoryUsage: NodeJS.MemoryUsage;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * Benchmark Results
 */
export interface BenchmarkResults {
  operation: string;
  samples: number;
  averageDuration: number;
  medianDuration: number;
  minDuration: number;
  maxDuration: number;
  standardDeviation: number;
  memoryStats: {
    averageHeapUsed: number;
    peakHeapUsed: number;
    averageRSS: number;
    peakRSS: number;
  };
  throughput: number; // operations per second
}

/**
 * Performance Monitor Class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private benchmarks: Map<string, BenchmarkResults> = new Map();
  private activeOperations: Map<string, { start: number; startMemory: NodeJS.MemoryUsage }> = new Map();

  /**
   * Start timing an operation
   */
  public startOperation(operationId: string, operationName: string, metadata?: Record<string, unknown>): void {
    const start = performance.now();
    const startMemory = process.memoryUsage();

    this.activeOperations.set(operationId, { start, startMemory });
  }

  /**
   * End timing an operation
   */
  public endOperation(operationId: string, operationName: string): PerformanceMetrics | null {
    const active = this.activeOperations.get(operationId);
    if (!active) {
      console.warn(`No active operation found for ID: ${operationId}`);
      return null;
    }

    const end = performance.now();
    const endMemory = process.memoryUsage();
    const duration = end - active.start;

    const metric: PerformanceMetrics = {
      operation: operationName,
      duration,
      memoryUsage: {
        rss: endMemory.rss - active.startMemory.rss,
        heapTotal: endMemory.heapTotal - active.startMemory.heapTotal,
        heapUsed: endMemory.heapUsed - active.startMemory.heapUsed,
        external: endMemory.external - active.startMemory.external,
        arrayBuffers: endMemory.arrayBuffers - active.startMemory.arrayBuffers
      },
      timestamp: Date.now()
    };

    this.metrics.push(metric);
    this.activeOperations.delete(operationId);

    return metric;
  }

  /**
   * Measure a synchronous operation
   */
  public measureSync<T>(operationName: string, operation: () => T, metadata?: Record<string, unknown>): T {
    const operationId = `sync-${Date.now()}-${Math.random()}`;
    this.startOperation(operationId, operationName, metadata);

    try {
      const result = operation();
      this.endOperation(operationId, operationName);
      return result;
    } catch (error) {
      this.endOperation(operationId, operationName);
      throw error;
    }
  }

  /**
   * Measure an asynchronous operation
   */
  public async measureAsync<T>(operationName: string, operation: () => Promise<T>, metadata?: Record<string, unknown>): Promise<T> {
    const operationId = `async-${Date.now()}-${Math.random()}`;
    this.startOperation(operationId, operationName, metadata);

    try {
      const result = await operation();
      this.endOperation(operationId, operationName);
      return result;
    } catch (error) {
      this.endOperation(operationId, operationName);
      throw error;
    }
  }

  /**
   * Run performance benchmark
   */
  public async benchmark(
    operationName: string,
    operation: () => void | Promise<void>,
    options: { samples?: number; warmup?: number } = {}
  ): Promise<BenchmarkResults> {
    const { samples = 100, warmup = 10 } = options;
    const durations: number[] = [];
    const memorySnapshots: NodeJS.MemoryUsage[] = [];

    // Warmup runs
    for (let i = 0; i < warmup; i++) {
      await operation();
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Benchmark runs
    for (let i = 0; i < samples; i++) {
      const startMemory = process.memoryUsage();
      const start = performance.now();

      await operation();

      const end = performance.now();
      const endMemory = process.memoryUsage();

      durations.push(end - start);
      memorySnapshots.push({
        rss: endMemory.rss - startMemory.rss,
        heapTotal: endMemory.heapTotal - startMemory.heapTotal,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        external: endMemory.external - startMemory.external,
        arrayBuffers: endMemory.arrayBuffers - startMemory.arrayBuffers
      });
    }

    // Calculate statistics
    const sortedDurations = durations.slice().sort((a, b) => a - b);
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const medianDuration = sortedDurations[Math.floor(sortedDurations.length / 2)];
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    const variance = durations.reduce((acc, duration) => acc + Math.pow(duration - averageDuration, 2), 0) / durations.length;
    const standardDeviation = Math.sqrt(variance);

    const throughput = 1000 / averageDuration; // operations per second

    // Memory statistics
    const averageHeapUsed = memorySnapshots.reduce((acc, mem) => acc + mem.heapUsed, 0) / memorySnapshots.length;
    const peakHeapUsed = Math.max(...memorySnapshots.map(mem => mem.heapUsed));
    const averageRSS = memorySnapshots.reduce((acc, mem) => acc + mem.rss, 0) / memorySnapshots.length;
    const peakRSS = Math.max(...memorySnapshots.map(mem => mem.rss));

    const results: BenchmarkResults = {
      operation: operationName,
      samples,
      averageDuration,
      medianDuration,
      minDuration,
      maxDuration,
      standardDeviation,
      memoryStats: {
        averageHeapUsed,
        peakHeapUsed,
        averageRSS,
        peakRSS
      },
      throughput
    };

    this.benchmarks.set(operationName, results);
    return results;
  }

  /**
   * Get performance metrics for specific operation
   */
  public getMetrics(operationName?: string): PerformanceMetrics[] {
    if (operationName) {
      return this.metrics.filter(m => m.operation === operationName);
    }
    return [...this.metrics];
  }

  /**
   * Get benchmark results
   */
  public getBenchmark(operationName: string): BenchmarkResults | undefined {
    return this.benchmarks.get(operationName);
  }

  /**
   * Get all benchmark results
   */
  public getAllBenchmarks(): Map<string, BenchmarkResults> {
    return new Map(this.benchmarks);
  }

  /**
   * Generate performance report
   */
  public generateReport(): string {
    const report: string[] = [];
    report.push('# Context Engineering Performance Report');
    report.push(`Generated: ${new Date().toISOString()}\n`);

    // Benchmark results
    if (this.benchmarks.size > 0) {
      report.push('## Benchmark Results\n');

      for (const [name, results] of this.benchmarks) {
        report.push(`### ${name}`);
        report.push(`- Samples: ${results.samples}`);
        report.push(`- Average Duration: ${results.averageDuration.toFixed(2)}ms`);
        report.push(`- Median Duration: ${results.medianDuration.toFixed(2)}ms`);
        report.push(`- Min/Max: ${results.minDuration.toFixed(2)}ms / ${results.maxDuration.toFixed(2)}ms`);
        report.push(`- Standard Deviation: ${results.standardDeviation.toFixed(2)}ms`);
        report.push(`- Throughput: ${results.throughput.toFixed(2)} ops/sec`);
        report.push(`- Average Heap Usage: ${(results.memoryStats.averageHeapUsed / 1024 / 1024).toFixed(2)}MB`);
        report.push(`- Peak Heap Usage: ${(results.memoryStats.peakHeapUsed / 1024 / 1024).toFixed(2)}MB`);
        report.push('');
      }
    }

    // Recent metrics summary
    if (this.metrics.length > 0) {
      report.push('## Recent Metrics Summary\n');

      const operationGroups = this.groupMetricsByOperation();
      for (const [operation, metrics] of operationGroups) {
        const avgDuration = metrics.reduce((acc, m) => acc + m.duration, 0) / metrics.length;
        const avgMemory = metrics.reduce((acc, m) => acc + m.memoryUsage.heapUsed, 0) / metrics.length;

        report.push(`### ${operation}`);
        report.push(`- Calls: ${metrics.length}`);
        report.push(`- Average Duration: ${avgDuration.toFixed(2)}ms`);
        report.push(`- Average Memory Delta: ${(avgMemory / 1024 / 1024).toFixed(2)}MB`);
        report.push('');
      }
    }

    return report.join('\n');
  }

  /**
   * Clear all metrics and benchmarks
   */
  public clear(): void {
    this.metrics = [];
    this.benchmarks.clear();
    this.activeOperations.clear();
  }

  /**
   * Export metrics to JSON
   */
  public exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      benchmarks: Array.from(this.benchmarks.entries()),
      timestamp: Date.now()
    }, null, 2);
  }

  /**
   * Import metrics from JSON
   */
  public importMetrics(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.metrics = parsed.metrics || [];
      this.benchmarks = new Map(parsed.benchmarks || []);
    } catch (error) {
      throw new Error(`Failed to import metrics: ${error}`);
    }
  }

  // Private helper methods

  private groupMetricsByOperation(): Map<string, PerformanceMetrics[]> {
    const groups = new Map<string, PerformanceMetrics[]>();

    for (const metric of this.metrics) {
      const existing = groups.get(metric.operation) || [];
      existing.push(metric);
      groups.set(metric.operation, existing);
    }

    return groups;
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Performance monitoring decorators
 */
export function measurePerformance(operationName?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const name = operationName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      return performanceMonitor.measureSync(name, () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}

export function measureAsyncPerformance(operationName?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const name = operationName || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      return performanceMonitor.measureAsync(name, () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}
