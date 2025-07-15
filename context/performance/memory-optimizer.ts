/**
 * Memory Optimization Suite for Context Engineering System
 * Identifies and fixes memory leaks, optimizes caching, and manages memory usage
 */

import { PerformanceMonitor } from './performance-monitor';
import { LRUCache } from '../cache/lru-cache';
import { ContextFragment, ContextPriority } from '../types/context.types';

/**
 * Memory Analysis Result
 */
export interface MemoryAnalysis {
  totalHeapUsed: number;
  heapSize: number;
  external: number;
  arrayBuffers: number;
  rss: number;
  memoryLeaks: MemoryLeak[];
  recommendations: string[];
  optimizationScore: number; // 0-100
}

/**
 * Memory Leak Detection
 */
export interface MemoryLeak {
  type: 'cache-overflow' | 'circular-reference' | 'listener-leak' | 'timer-leak' | 'closure-leak';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  estimatedImpact: number; // MB
  remediation: string;
}

/**
 * Memory Optimization Configuration
 */
export interface MemoryConfig {
  maxHeapSize: number; // MB
  gcThreshold: number; // MB
  cacheOptimization: boolean;
  memoryMonitoring: boolean;
  leakDetection: boolean;
  autoCleanup: boolean;
}

/**
 * Memory Optimizer Class
 */
export class MemoryOptimizer {
  private monitor: PerformanceMonitor;
  private config: MemoryConfig;
  private memoryHistory: NodeJS.MemoryUsage[] = [];
  private cleanupTimers: NodeJS.Timeout[] = [];
  private weakRefs: WeakRef<any>[] = [];

  constructor(config: Partial<MemoryConfig> = {}) {
    this.monitor = new PerformanceMonitor();
    this.config = {
      maxHeapSize: 512, // 512MB default
      gcThreshold: 256, // 256MB trigger GC
      cacheOptimization: true,
      memoryMonitoring: true,
      leakDetection: true,
      autoCleanup: true,
      ...config
    };

    if (this.config.memoryMonitoring) {
      this.startMemoryMonitoring();
    }

    if (this.config.autoCleanup) {
      this.setupAutoCleanup();
    }
  }

  /**
   * Analyze current memory usage
   */
  public analyzeMemoryUsage(): MemoryAnalysis {
    const memUsage = process.memoryUsage();
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
    const externalMB = memUsage.external / 1024 / 1024;
    const rssMB = memUsage.rss / 1024 / 1024;

    const leaks = this.detectMemoryLeaks();
    const recommendations = this.generateRecommendations(memUsage, leaks);
    const score = this.calculateOptimizationScore(memUsage, leaks);

    return {
      totalHeapUsed: heapUsedMB,
      heapSize: heapTotalMB,
      external: externalMB,
      arrayBuffers: memUsage.arrayBuffers / 1024 / 1024,
      rss: rssMB,
      memoryLeaks: leaks,
      recommendations,
      optimizationScore: score
    };
  }

  /**
   * Optimize memory usage
   */
  public optimizeMemory(): Promise<MemoryAnalysis> {
    return new Promise((resolve) => {
      const beforeAnalysis = this.analyzeMemoryUsage();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Clear weak references
      this.cleanupWeakReferences();

      // Optimize caches
      if (this.config.cacheOptimization) {
        this.optimizeCaches();
      }

      // Clear internal buffers
      this.clearInternalBuffers();

      // Wait for GC to complete
      setTimeout(() => {
        const afterAnalysis = this.analyzeMemoryUsage();
        resolve(afterAnalysis);
      }, 100);
    });
  }

  /**
   * Detect memory leaks
   */
  private detectMemoryLeaks(): MemoryLeak[] {
    const leaks: MemoryLeak[] = [];

    // Check memory growth pattern
    if (this.memoryHistory.length > 10) {
      const recent = this.memoryHistory.slice(-10);
      const growth = recent[recent.length - 1].heapUsed - recent[0].heapUsed;
      const growthMB = growth / 1024 / 1024;

      if (growthMB > 50) {
        leaks.push({
          type: 'cache-overflow',
          severity: 'high',
          description: `Memory usage increased by ${growthMB.toFixed(2)}MB in recent operations`,
          estimatedImpact: growthMB,
          remediation: 'Consider reducing cache sizes or implementing more aggressive cleanup'
        });
      }
    }

    // Check for excessive heap size
    const currentHeap = process.memoryUsage().heapUsed / 1024 / 1024;
    if (currentHeap > this.config.maxHeapSize) {
      leaks.push({
        type: 'cache-overflow',
        severity: 'critical',
        description: `Heap usage (${currentHeap.toFixed(2)}MB) exceeds maximum (${this.config.maxHeapSize}MB)`,
        estimatedImpact: currentHeap - this.config.maxHeapSize,
        remediation: 'Immediate memory cleanup required'
      });
    }

    // Check for timer leaks (simulated)
    if (this.cleanupTimers.length > 5) {
      leaks.push({
        type: 'timer-leak',
        severity: 'medium',
        description: `${this.cleanupTimers.length} active timers detected`,
        estimatedImpact: 1,
        remediation: 'Clear unused timers and intervals'
      });
    }

    return leaks;
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(memUsage: NodeJS.MemoryUsage, leaks: MemoryLeak[]): string[] {
    const recommendations: string[] = [];
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;

    // Memory size recommendations
    if (heapUsedMB > 200) {
      recommendations.push('Consider reducing fragment cache sizes');
      recommendations.push('Implement more aggressive TTL for cached data');
    }

    if (heapUsedMB > 100) {
      recommendations.push('Enable periodic garbage collection');
      recommendations.push('Use weak references for large objects');
    }

    // Cache-specific recommendations
    recommendations.push('Set maximum cache entry limits');
    recommendations.push('Implement LRU eviction for all caches');
    recommendations.push('Use compression for large text content');

    // Leak-specific recommendations
    if (leaks.some(l => l.type === 'cache-overflow')) {
      recommendations.push('Reduce cache retention times');
      recommendations.push('Implement cache size monitoring');
    }

    if (leaks.some(l => l.type === 'timer-leak')) {
      recommendations.push('Clear all timers and intervals on cleanup');
      recommendations.push('Use AbortController for cancelable operations');
    }

    return recommendations;
  }

  /**
   * Calculate optimization score
   */
  private calculateOptimizationScore(memUsage: NodeJS.MemoryUsage, leaks: MemoryLeak[]): number {
    let score = 100;
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;

    // Deduct points for memory usage
    if (heapUsedMB > 50) score -= 10;
    if (heapUsedMB > 100) score -= 20;
    if (heapUsedMB > 200) score -= 30;

    // Deduct points for leaks
    for (const leak of leaks) {
      switch (leak.severity) {
        case 'low': score -= 5; break;
        case 'medium': score -= 15; break;
        case 'high': score -= 25; break;
        case 'critical': score -= 40; break;
      }
    }

    return Math.max(0, score);
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    const interval = setInterval(() => {
      const memUsage = process.memoryUsage();
      this.memoryHistory.push(memUsage);

      // Keep only last 100 entries
      if (this.memoryHistory.length > 100) {
        this.memoryHistory = this.memoryHistory.slice(-100);
      }

      // Trigger cleanup if needed
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      if (heapUsedMB > this.config.gcThreshold && global.gc) {
        global.gc();
      }
    }, 5000); // Every 5 seconds

    this.cleanupTimers.push(interval);
  }

  /**
   * Setup automatic cleanup
   */
  private setupAutoCleanup(): void {
    const cleanup = setInterval(() => {
      this.cleanupWeakReferences();
      this.optimizeCaches();
    }, 30000); // Every 30 seconds

    this.cleanupTimers.push(cleanup);
  }

  /**
   * Cleanup weak references
   */
  private cleanupWeakReferences(): void {
    this.weakRefs = this.weakRefs.filter(ref => ref.deref() !== undefined);
  }

  /**
   * Optimize caches (placeholder - would integrate with actual caches)
   */
  private optimizeCaches(): void {
    // This would be implemented to work with actual LRU caches
    // For now, it's a placeholder that simulates cache optimization
    
    // Simulate cache cleanup
    if (this.config.cacheOptimization) {
      // In real implementation, this would:
      // 1. Get all cache instances
      // 2. Check their sizes
      // 3. Force eviction if needed
      // 4. Compress large entries
      
      console.log('Cache optimization completed');
    }
  }

  /**
   * Clear internal buffers
   */
  private clearInternalBuffers(): void {
    // Clear performance monitor metrics older than 1 hour
    this.monitor.clear();
    
    // Clear old memory history
    if (this.memoryHistory.length > 50) {
      this.memoryHistory = this.memoryHistory.slice(-50);
    }
  }

  /**
   * Add weak reference for tracking
   */
  public trackObject(obj: any): void {
    this.weakRefs.push(new WeakRef(obj));
  }

  /**
   * Get memory statistics
   */
  public getMemoryStats(): any {
    const current = process.memoryUsage();
    const history = this.memoryHistory.slice(-10);
    
    return {
      current: {
        heapUsed: (current.heapUsed / 1024 / 1024).toFixed(2) + 'MB',
        heapTotal: (current.heapTotal / 1024 / 1024).toFixed(2) + 'MB',
        rss: (current.rss / 1024 / 1024).toFixed(2) + 'MB',
        external: (current.external / 1024 / 1024).toFixed(2) + 'MB'
      },
      trend: {
        samples: history.length,
        avgHeapUsed: history.length > 0 ? 
          (history.reduce((sum, h) => sum + h.heapUsed, 0) / history.length / 1024 / 1024).toFixed(2) + 'MB' : 
          '0MB'
      },
      optimization: {
        score: this.calculateOptimizationScore(current, this.detectMemoryLeaks()),
        activeTimers: this.cleanupTimers.length,
        trackedRefs: this.weakRefs.length
      }
    };
  }

  /**
   * Generate memory report
   */
  public generateReport(): string {
    const analysis = this.analyzeMemoryUsage();
    const stats = this.getMemoryStats();
    
    const report: string[] = [];
    report.push('# Memory Optimization Report');
    report.push(`Generated: ${new Date().toISOString()}\n`);

    // Current stats
    report.push('## Current Memory Usage');
    report.push(`- Heap Used: ${analysis.totalHeapUsed.toFixed(2)}MB`);
    report.push(`- Heap Size: ${analysis.heapSize.toFixed(2)}MB`);
    report.push(`- RSS: ${analysis.rss.toFixed(2)}MB`);
    report.push(`- External: ${analysis.external.toFixed(2)}MB`);
    report.push(`- Optimization Score: ${analysis.optimizationScore}/100\n`);

    // Memory leaks
    if (analysis.memoryLeaks.length > 0) {
      report.push('## Detected Memory Issues');
      for (const leak of analysis.memoryLeaks) {
        report.push(`### ${leak.type} (${leak.severity})`);
        report.push(`- Description: ${leak.description}`);
        report.push(`- Impact: ${leak.estimatedImpact.toFixed(2)}MB`);
        report.push(`- Remediation: ${leak.remediation}\n`);
      }
    } else {
      report.push('## Memory Health');
      report.push('✅ No memory leaks detected\n');
    }

    // Recommendations
    if (analysis.recommendations.length > 0) {
      report.push('## Optimization Recommendations');
      analysis.recommendations.forEach(rec => {
        report.push(`- ${rec}`);
      });
      report.push('');
    }

    return report.join('\n');
  }

  /**
   * Cleanup and stop monitoring
   */
  public dispose(): void {
    // Clear all timers
    this.cleanupTimers.forEach(timer => clearInterval(timer));
    this.cleanupTimers = [];

    // Clear references
    this.weakRefs = [];
    this.memoryHistory = [];

    // Clear monitor
    this.monitor.clear();
  }
}

/**
 * Global memory optimizer instance
 */
export const memoryOptimizer = new MemoryOptimizer({
  maxHeapSize: 256,
  gcThreshold: 128,
  cacheOptimization: true,
  memoryMonitoring: true,
  leakDetection: true,
  autoCleanup: true
});

/**
 * Utility functions for memory optimization
 */
export const MemoryUtils = {
  /**
   * Force garbage collection if available
   */
  forceGC(): boolean {
    if (global.gc) {
      global.gc();
      return true;
    }
    return false;
  },

  /**
   * Get current memory usage in MB
   */
  getCurrentMemoryMB(): number {
    return process.memoryUsage().heapUsed / 1024 / 1024;
  },

  /**
   * Check if memory usage is within limits
   */
  isMemoryHealthy(maxMB: number = 256): boolean {
    return this.getCurrentMemoryMB() < maxMB;
  },

  /**
   * Create a memory-efficient cache configuration
   */
  createOptimizedCacheConfig(maxSize: number = 1000): any {
    return {
      maxSize,
      ttl: 300000, // 5 minutes
      strategy: 'lru',
      persistToDisk: false,
      evictionPolicy: 'priority-aware'
    };
  },

  /**
   * Monitor memory usage for a specific operation
   */
  monitorOperation<T>(operation: () => T, operationName: string): T {
    const before = process.memoryUsage();
    const result = operation();
    const after = process.memoryUsage();
    
    const delta = after.heapUsed - before.heapUsed;
    if (delta > 10 * 1024 * 1024) { // 10MB threshold
      console.warn(`High memory usage in ${operationName}: ${(delta / 1024 / 1024).toFixed(2)}MB`);
    }
    
    return result;
  }
};