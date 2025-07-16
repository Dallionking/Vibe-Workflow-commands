/**
 * Tests for Performance Monitor
 * Phase 3: Advanced Context Features - Tier 3.2
 *
 * Comprehensive test suite for performance monitoring system
 * with error handling and edge case coverage.
 */

import { PerformanceMonitor, PerformanceMetrics, AlertThresholds } from './performance-monitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  let defaultThresholds: AlertThresholds;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    defaultThresholds = {
      maxResponseTime: 1000,
      maxMemoryUsage: 500,
      maxCpuUsage: 80,
      minThroughput: 10,
      maxErrorRate: 0.05
    };

    monitor = new PerformanceMonitor(defaultThresholds);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with default thresholds', () => {
      expect(monitor).toBeDefined();
      const thresholds = (monitor as any).alertThresholds;
      expect(thresholds).toEqual(defaultThresholds);
    });

    it('should initialize metrics tracking', () => {
      const metrics = (monitor as any).currentMetrics;
      expect(metrics).toBeDefined();
      expect(metrics.responseTime).toBe(0);
      expect(metrics.throughput).toBe(0);
      expect(metrics.errorRate).toBe(0);
    });

    it('should initialize monitoring state', () => {
      expect((monitor as any).isMonitoring).toBe(false);
      expect((monitor as any).metricsHistory).toEqual([]);
      expect((monitor as any).alerts).toEqual([]);
    });
  });

  describe('startMonitoring', () => {
    it('should start monitoring successfully', async () => {
      await monitor.startMonitoring();

      expect((monitor as any).isMonitoring).toBe(true);
      expect((monitor as any).monitoringInterval).toBeDefined();
    });

    it('should not start if already monitoring', async () => {
      await monitor.startMonitoring();
      const firstInterval = (monitor as any).monitoringInterval;

      await monitor.startMonitoring();
      const secondInterval = (monitor as any).monitoringInterval;

      expect(firstInterval).toBe(secondInterval);
    });

    it('should collect metrics periodically', async () => {
      const collectSpy = jest.spyOn(monitor as any, 'collectMetrics');

      await monitor.startMonitoring();

      // Advance timers to trigger collection
      jest.advanceTimersByTime(5000);

      expect(collectSpy).toHaveBeenCalled();
    });
  });

  describe('stopMonitoring', () => {
    it('should stop monitoring successfully', async () => {
      await monitor.startMonitoring();
      await monitor.stopMonitoring();

      expect((monitor as any).isMonitoring).toBe(false);
      expect((monitor as any).monitoringInterval).toBeNull();
    });

    it('should handle stop when not monitoring', async () => {
      await expect(monitor.stopMonitoring()).resolves.not.toThrow();
    });
  });

  describe('recordMetric', () => {
    it('should record response time metric', () => {
      monitor.recordMetric('responseTime', 250);

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.responseTime).toBe(250);
    });

    it('should record throughput metric', () => {
      monitor.recordMetric('throughput', 50);

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.throughput).toBe(50);
    });

    it('should record error rate metric', () => {
      monitor.recordMetric('errorRate', 0.02);

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.errorRate).toBe(0.02);
    });

    it('should update timestamp on metric recording', () => {
      const beforeTime = Date.now();
      monitor.recordMetric('responseTime', 100);
      const afterTime = Date.now();

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime);
      expect(metrics.timestamp.getTime()).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('getCurrentMetrics', () => {
    it('should return current metrics snapshot', () => {
      monitor.recordMetric('responseTime', 150);
      monitor.recordMetric('throughput', 100);
      monitor.recordMetric('errorRate', 0.01);

      const metrics = monitor.getCurrentMetrics();

      expect(metrics.responseTime).toBe(150);
      expect(metrics.throughput).toBe(100);
      expect(metrics.errorRate).toBe(0.01);
      expect(metrics.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getMetricsHistory', () => {
    it('should return empty history initially', () => {
      const history = monitor.getMetricsHistory();
      expect(history).toEqual([]);
    });

    it('should return metrics history after collection', async () => {
      await monitor.startMonitoring();

      // Record some metrics
      monitor.recordMetric('responseTime', 100);
      monitor.recordMetric('throughput', 50);

      // Trigger collection
      jest.advanceTimersByTime(5000);

      const history = monitor.getMetricsHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].responseTime).toBe(100);
    });

    it('should limit history size', async () => {
      await monitor.startMonitoring();

      // Fill history beyond limit
      for (let i = 0; i < 1200; i++) {
        (monitor as any).metricsHistory.push({
          responseTime: i,
          throughput: i,
          errorRate: 0,
          memoryUsage: 0,
          cpuUsage: 0,
          timestamp: new Date()
        });
      }

      // Trigger collection to trim history
      jest.advanceTimersByTime(5000);

      const history = monitor.getMetricsHistory();
      expect(history.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('alert detection', () => {
    beforeEach(async () => {
      await monitor.startMonitoring();
    });

    it('should detect high response time', () => {
      monitor.recordMetric('responseTime', 1500); // Above threshold

      jest.advanceTimersByTime(5000);

      const alerts = monitor.getActiveAlerts();
      expect(alerts.some(a => a.type === 'high_response_time')).toBe(true);
    });

    it('should detect high memory usage', () => {
      monitor.recordMetric('memoryUsage', 600); // Above threshold

      jest.advanceTimersByTime(5000);

      const alerts = monitor.getActiveAlerts();
      expect(alerts.some(a => a.type === 'high_memory_usage')).toBe(true);
    });

    it('should detect high CPU usage', () => {
      monitor.recordMetric('cpuUsage', 90); // Above threshold

      jest.advanceTimersByTime(5000);

      const alerts = monitor.getActiveAlerts();
      expect(alerts.some(a => a.type === 'high_cpu_usage')).toBe(true);
    });

    it('should detect low throughput', () => {
      monitor.recordMetric('throughput', 5); // Below threshold

      jest.advanceTimersByTime(5000);

      const alerts = monitor.getActiveAlerts();
      expect(alerts.some(a => a.type === 'low_throughput')).toBe(true);
    });

    it('should detect high error rate', () => {
      monitor.recordMetric('errorRate', 0.1); // Above threshold

      jest.advanceTimersByTime(5000);

      const alerts = monitor.getActiveAlerts();
      expect(alerts.some(a => a.type === 'high_error_rate')).toBe(true);
    });

    it('should clear alerts when metrics return to normal', () => {
      // Trigger alert
      monitor.recordMetric('responseTime', 1500);
      jest.advanceTimersByTime(5000);

      let alerts = monitor.getActiveAlerts();
      expect(alerts.length).toBeGreaterThan(0);

      // Return to normal
      monitor.recordMetric('responseTime', 500);
      jest.advanceTimersByTime(5000);

      alerts = monitor.getActiveAlerts();
      expect(alerts.some(a => a.type === 'high_response_time')).toBe(false);
    });
  });

  describe('getHealthStatus', () => {
    it('should return healthy status when all metrics are good', () => {
      monitor.recordMetric('responseTime', 500);
      monitor.recordMetric('throughput', 50);
      monitor.recordMetric('errorRate', 0.01);
      monitor.recordMetric('memoryUsage', 300);
      monitor.recordMetric('cpuUsage', 50);

      const status = monitor.getHealthStatus();

      expect(status.status).toBe('healthy');
      expect(status.score).toBeGreaterThan(0.8);
      expect(status.issues).toHaveLength(0);
    });

    it('should return warning status with minor issues', () => {
      monitor.recordMetric('responseTime', 900); // Near threshold
      monitor.recordMetric('throughput', 15);
      monitor.recordMetric('errorRate', 0.04);

      const status = monitor.getHealthStatus();

      expect(status.status).toBe('warning');
      expect(status.issues.length).toBeGreaterThan(0);
    });

    it('should return critical status with major issues', () => {
      monitor.recordMetric('responseTime', 2000); // Way above threshold
      monitor.recordMetric('errorRate', 0.2); // High error rate
      monitor.recordMetric('cpuUsage', 95); // Very high CPU

      const status = monitor.getHealthStatus();

      expect(status.status).toBe('critical');
      expect(status.score).toBeLessThan(0.5);
      expect(status.issues.length).toBeGreaterThan(1);
    });
  });

  describe('getPerformanceReport', () => {
    it('should generate comprehensive report', async () => {
      await monitor.startMonitoring();

      // Record various metrics
      monitor.recordMetric('responseTime', 250);
      monitor.recordMetric('throughput', 100);
      monitor.recordMetric('errorRate', 0.02);
      monitor.recordMetric('memoryUsage', 400);
      monitor.recordMetric('cpuUsage', 60);

      jest.advanceTimersByTime(5000);

      const report = await monitor.getPerformanceReport();

      expect(report).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.summary.averageResponseTime).toBeGreaterThan(0);
      expect(report.summary.averageThroughput).toBeGreaterThan(0);
      expect(report.currentHealth).toBeDefined();
      expect(report.alerts).toBeDefined();
      expect(report.recommendations).toBeInstanceOf(Array);
    });

    it('should include percentiles in report', async () => {
      await monitor.startMonitoring();

      // Record multiple response times
      const responseTimes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      responseTimes.forEach(rt => {
        monitor.recordMetric('responseTime', rt);
        jest.advanceTimersByTime(5000);
      });

      const report = await monitor.getPerformanceReport();

      expect(report.summary.p50ResponseTime).toBeDefined();
      expect(report.summary.p95ResponseTime).toBeDefined();
      expect(report.summary.p99ResponseTime).toBeDefined();
    });

    it('should generate recommendations based on metrics', async () => {
      monitor.recordMetric('responseTime', 1500);
      monitor.recordMetric('errorRate', 0.1);

      const report = await monitor.getPerformanceReport();

      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations.some(r => r.includes('response time'))).toBe(true);
      expect(report.recommendations.some(r => r.includes('error rate'))).toBe(true);
    });
  });

  describe('updateThresholds', () => {
    it('should update alert thresholds', () => {
      const newThresholds: Partial<AlertThresholds> = {
        maxResponseTime: 2000,
        maxErrorRate: 0.1
      };

      monitor.updateThresholds(newThresholds);

      const thresholds = (monitor as any).alertThresholds;
      expect(thresholds.maxResponseTime).toBe(2000);
      expect(thresholds.maxErrorRate).toBe(0.1);
      expect(thresholds.maxMemoryUsage).toBe(500); // Unchanged
    });
  });

  describe('error handling', () => {
    it('should handle metric collection errors', async () => {
      await monitor.startMonitoring();

      // Mock collectMetrics to throw
      jest.spyOn(monitor as any, 'collectSystemMetrics').mockImplementation(() => {
        throw new Error('Collection failed');
      });

      // Should not throw
      jest.advanceTimersByTime(5000);

      expect((monitor as any).isMonitoring).toBe(true);
    });

    it('should handle invalid metric values', () => {
      monitor.recordMetric('responseTime', -100); // Invalid negative
      monitor.recordMetric('errorRate', 2); // Invalid > 1

      const metrics = monitor.getCurrentMetrics();
      expect(metrics.responseTime).toBeGreaterThanOrEqual(0);
      expect(metrics.errorRate).toBeLessThanOrEqual(1);
    });
  });

  describe('memory leak prevention', () => {
    it('should clean up intervals on stop', async () => {
      await monitor.startMonitoring();
      const interval = (monitor as any).monitoringInterval;

      await monitor.stopMonitoring();

      expect((monitor as any).monitoringInterval).toBeNull();
      expect(clearInterval).toHaveBeenCalledWith(interval);
    });

    it('should limit alert history', async () => {
      await monitor.startMonitoring();

      // Generate many alerts
      for (let i = 0; i < 200; i++) {
        monitor.recordMetric('responseTime', 2000);
        jest.advanceTimersByTime(5000);
        monitor.recordMetric('responseTime', 100);
        jest.advanceTimersByTime(5000);
      }

      const alerts = (monitor as any).alertHistory;
      expect(alerts.length).toBeLessThanOrEqual(100);
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent metric recordings', () => {
      const promises = [];

      for (let i = 0; i < 100; i++) {
        promises.push(
          Promise.resolve().then(() => {
            monitor.recordMetric('responseTime', Math.random() * 1000);
            monitor.recordMetric('throughput', Math.random() * 100);
          })
        );
      }

      return Promise.all(promises).then(() => {
        const metrics = monitor.getCurrentMetrics();
        expect(metrics.responseTime).toBeGreaterThanOrEqual(0);
        expect(metrics.throughput).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
