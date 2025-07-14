/**
 * Performance Monitoring System
 * Real-time performance tracking for context engineering
 */

import { EventEmitter } from 'events';
import * as os from 'os';

export interface PerformanceMetrics {
  timestamp: number;
  operation: string;
  duration: number;
  memoryUsage: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  contextMetrics?: {
    tokensProcessed: number;
    layersActive: number;
    cacheHit: boolean;
    compressionRatio?: number;
  };
}

export interface PerformanceThresholds {
  maxOperationTime: number; // milliseconds
  maxMemoryUsage: number; // MB
  maxTokensPerOperation: number;
  minCacheHitRate: number; // percentage
}

export interface PerformanceSummary {
  totalOperations: number;
  averageDuration: number;
  maxDuration: number;
  minDuration: number;
  p95Duration: number;
  p99Duration: number;
  memoryPeak: number;
  cacheHitRate: number;
  tokenThroughput: number; // tokens per second
  alerts: PerformanceAlert[];
}

export interface PerformanceAlert {
  timestamp: number;
  type: 'duration' | 'memory' | 'tokens' | 'cache';
  message: string;
  value: number;
  threshold: number;
}

export class PerformanceMonitor extends EventEmitter {
  private metrics: PerformanceMetrics[];
  private alerts: PerformanceAlert[];
  private thresholds: PerformanceThresholds;
  private startTimes: Map<string, number>;
  private operationCounts: Map<string, number>;
  private readonly maxMetricsHistory = 1000;
  private monitoringInterval: NodeJS.Timeout | null;

  constructor(thresholds?: Partial<PerformanceThresholds>) {
    super();
    
    this.metrics = [];
    this.alerts = [];
    this.startTimes = new Map();
    this.operationCounts = new Map();
    
    this.thresholds = {
      maxOperationTime: 5000, // 5 seconds
      maxMemoryUsage: 100, // 100 MB
      maxTokensPerOperation: 10000,
      minCacheHitRate: 70, // 70%
      ...thresholds
    };
    
    this.monitoringInterval = null;
  }

  /**
   * Start monitoring system resources
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.monitoringInterval) {
      return;
    }
    
    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
    }, intervalMs);
    
    // Initial collection
    this.collectSystemMetrics();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Start timing an operation
   */
  startOperation(operationId: string): void {
    this.startTimes.set(operationId, Date.now());
  }

  /**
   * End timing an operation and record metrics
   */
  endOperation(
    operationId: string,
    contextMetrics?: PerformanceMetrics['contextMetrics']
  ): PerformanceMetrics | null {
    const startTime = this.startTimes.get(operationId);
    if (!startTime) {
      console.warn(`No start time found for operation: ${operationId}`);
      return null;
    }
    
    const duration = Date.now() - startTime;
    this.startTimes.delete(operationId);
    
    // Update operation count
    const count = this.operationCounts.get(operationId) || 0;
    this.operationCounts.set(operationId, count + 1);
    
    // Create metrics
    const metrics: PerformanceMetrics = {
      timestamp: Date.now(),
      operation: operationId,
      duration,
      memoryUsage: process.memoryUsage(),
      contextMetrics
    };
    
    // Store metrics
    this.addMetrics(metrics);
    
    // Check thresholds
    this.checkThresholds(metrics);
    
    // Emit event
    this.emit('operation-complete', metrics);
    
    return metrics;
  }

  /**
   * Record a performance metric directly
   */
  recordMetric(metrics: PerformanceMetrics): void {
    this.addMetrics(metrics);
    this.checkThresholds(metrics);
  }

  /**
   * Get performance summary
   */
  getSummary(operation?: string, timeWindowMs?: number): PerformanceSummary {
    const now = Date.now();
    const cutoff = timeWindowMs ? now - timeWindowMs : 0;
    
    // Filter metrics
    let relevantMetrics = this.metrics.filter(m => m.timestamp >= cutoff);
    if (operation) {
      relevantMetrics = relevantMetrics.filter(m => m.operation === operation);
    }
    
    if (relevantMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        maxDuration: 0,
        minDuration: 0,
        p95Duration: 0,
        p99Duration: 0,
        memoryPeak: 0,
        cacheHitRate: 0,
        tokenThroughput: 0,
        alerts: []
      };
    }
    
    // Calculate durations
    const durations = relevantMetrics.map(m => m.duration).sort((a, b) => a - b);
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);
    
    // Calculate percentiles
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);
    
    // Calculate memory peak
    const memoryPeak = Math.max(
      ...relevantMetrics.map(m => m.memoryUsage.heapUsed)
    ) / (1024 * 1024); // Convert to MB
    
    // Calculate cache hit rate
    const cacheMetrics = relevantMetrics.filter(m => m.contextMetrics?.cacheHit !== undefined);
    const cacheHits = cacheMetrics.filter(m => m.contextMetrics?.cacheHit).length;
    const cacheHitRate = cacheMetrics.length > 0 
      ? (cacheHits / cacheMetrics.length) * 100 
      : 0;
    
    // Calculate token throughput
    const totalTokens = relevantMetrics.reduce(
      (sum, m) => sum + (m.contextMetrics?.tokensProcessed || 0),
      0
    );
    const timeSpanSeconds = (relevantMetrics[relevantMetrics.length - 1].timestamp - relevantMetrics[0].timestamp) / 1000;
    const tokenThroughput = timeSpanSeconds > 0 ? totalTokens / timeSpanSeconds : 0;
    
    // Get relevant alerts
    const relevantAlerts = this.alerts.filter(a => a.timestamp >= cutoff);
    
    return {
      totalOperations: relevantMetrics.length,
      averageDuration: totalDuration / relevantMetrics.length,
      maxDuration: durations[durations.length - 1],
      minDuration: durations[0],
      p95Duration: durations[p95Index],
      p99Duration: durations[p99Index],
      memoryPeak,
      cacheHitRate,
      tokenThroughput,
      alerts: relevantAlerts
    };
  }

  /**
   * Get operation statistics
   */
  getOperationStats(): Map<string, {
    count: number;
    avgDuration: number;
    successRate: number;
  }> {
    const stats = new Map();
    
    // Group metrics by operation
    const operationGroups = new Map<string, PerformanceMetrics[]>();
    
    this.metrics.forEach(metric => {
      const group = operationGroups.get(metric.operation) || [];
      group.push(metric);
      operationGroups.set(metric.operation, group);
    });
    
    // Calculate stats for each operation
    operationGroups.forEach((metrics, operation) => {
      const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
      const successCount = metrics.filter(m => m.duration < this.thresholds.maxOperationTime).length;
      
      stats.set(operation, {
        count: metrics.length,
        avgDuration: totalDuration / metrics.length,
        successRate: (successCount / metrics.length) * 100
      });
    });
    
    return stats;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify({
        metrics: this.metrics,
        alerts: this.alerts,
        summary: this.getSummary(),
        operationStats: Array.from(this.getOperationStats().entries())
      }, null, 2);
    }
    
    // CSV format
    const headers = [
      'timestamp',
      'operation',
      'duration',
      'heapUsed',
      'tokensProcessed',
      'cacheHit'
    ].join(',');
    
    const rows = this.metrics.map(m => [
      m.timestamp,
      m.operation,
      m.duration,
      m.memoryUsage.heapUsed,
      m.contextMetrics?.tokensProcessed || 0,
      m.contextMetrics?.cacheHit || false
    ].join(','));
    
    return [headers, ...rows].join('\n');
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.metrics = [];
    this.alerts = [];
    this.startTimes.clear();
    this.operationCounts.clear();
  }

  /**
   * Set performance thresholds
   */
  setThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = {
      ...this.thresholds,
      ...thresholds
    };
  }

  /**
   * Get current thresholds
   */
  getThresholds(): PerformanceThresholds {
    return { ...this.thresholds };
  }

  /**
   * Add metrics and maintain history limit
   */
  private addMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);
    
    // Maintain history limit
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }
  }

  /**
   * Check if metrics exceed thresholds
   */
  private checkThresholds(metrics: PerformanceMetrics): void {
    // Check operation duration
    if (metrics.duration > this.thresholds.maxOperationTime) {
      this.addAlert({
        timestamp: Date.now(),
        type: 'duration',
        message: `Operation '${metrics.operation}' exceeded duration threshold`,
        value: metrics.duration,
        threshold: this.thresholds.maxOperationTime
      });
    }
    
    // Check memory usage
    const memoryMB = metrics.memoryUsage.heapUsed / (1024 * 1024);
    if (memoryMB > this.thresholds.maxMemoryUsage) {
      this.addAlert({
        timestamp: Date.now(),
        type: 'memory',
        message: `Memory usage exceeded threshold`,
        value: memoryMB,
        threshold: this.thresholds.maxMemoryUsage
      });
    }
    
    // Check token count
    if (metrics.contextMetrics?.tokensProcessed) {
      if (metrics.contextMetrics.tokensProcessed > this.thresholds.maxTokensPerOperation) {
        this.addAlert({
          timestamp: Date.now(),
          type: 'tokens',
          message: `Token count exceeded threshold for '${metrics.operation}'`,
          value: metrics.contextMetrics.tokensProcessed,
          threshold: this.thresholds.maxTokensPerOperation
        });
      }
    }
    
    // Check cache hit rate (periodic check)
    if (this.metrics.length % 100 === 0) {
      const summary = this.getSummary(undefined, 300000); // Last 5 minutes
      if (summary.cacheHitRate < this.thresholds.minCacheHitRate) {
        this.addAlert({
          timestamp: Date.now(),
          type: 'cache',
          message: `Cache hit rate below threshold`,
          value: summary.cacheHitRate,
          threshold: this.thresholds.minCacheHitRate
        });
      }
    }
  }

  /**
   * Add alert and emit event
   */
  private addAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);
    
    // Maintain alert history
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    // Emit alert event
    this.emit('performance-alert', alert);
  }

  /**
   * Collect system-wide metrics
   */
  private collectSystemMetrics(): void {
    const cpus = os.cpus();
    const totalCpu = cpus.reduce((sum, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      return sum + total;
    }, 0);
    
    const metrics: PerformanceMetrics = {
      timestamp: Date.now(),
      operation: 'system',
      duration: 0,
      memoryUsage: process.memoryUsage(),
      contextMetrics: {
        tokensProcessed: 0,
        layersActive: 0,
        cacheHit: false
      }
    };
    
    this.addMetrics(metrics);
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const summary = this.getSummary();
    const stats = this.getOperationStats();
    
    // Cache hit rate recommendations
    if (summary.cacheHitRate < 50) {
      recommendations.push(
        'Cache hit rate is low. Consider warming up cache with common contexts.'
      );
    }
    
    // Memory usage recommendations
    if (summary.memoryPeak > this.thresholds.maxMemoryUsage * 0.8) {
      recommendations.push(
        'Memory usage is approaching threshold. Enable more aggressive token optimization.'
      );
    }
    
    // Operation performance recommendations
    stats.forEach((stat, operation) => {
      if (stat.avgDuration > this.thresholds.maxOperationTime * 0.7) {
        recommendations.push(
          `Operation '${operation}' is slow. Consider optimizing or breaking into smaller operations.`
        );
      }
    });
    
    // Token throughput recommendations
    if (summary.tokenThroughput < 100) {
      recommendations.push(
        'Token processing throughput is low. Check for bottlenecks in context assembly.'
      );
    }
    
    return recommendations;
  }
}