/**
 * Performance Tests
 * Test suite for context performance optimization
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TokenOptimizer, OptimizationOptions } from '../../context/performance/token-optimizer';
import { ContextCacheManager } from '../../context/performance/cache-manager';
import { PerformanceMonitor } from '../../context/performance/performance-monitor';
import { ContextContent, TokenBudget } from '../../context/types/context.types';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

describe('Performance Optimization', () => {
  let testDir: string;
  
  beforeEach(() => {
    testDir = path.join(os.tmpdir(), `vibe-perf-test-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
  });
  
  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });
  
  describe('TokenOptimizer', () => {
    let optimizer: TokenOptimizer;
    
    beforeEach(() => {
      optimizer = new TokenOptimizer();
    });
    
    it('should reduce tokens through compression', async () => {
      const content: ContextContent[] = [{
        id: 'test-1',
        section: 'test',
        content: '   This   has   extra   whitespace   ',
        type: 'text',
        priority: 5,
        metadata: {},
        version: '1.0'
      }];
      
      const budget: TokenBudget = { max: 1000, reserved: 0, used: 0 };
      const options: OptimizationOptions = {
        enableCompression: true,
        enableDeduplication: false,
        enableSummarization: false,
        enableCaching: false,
        aggressiveness: 'moderate'
      };
      
      const { optimized, result } = await optimizer.optimizeContent(
        content,
        budget,
        options
      );
      
      expect(result.optimizedTokens).toBeLessThan(result.originalTokens);
      expect(optimized[0].content).toBe('This has extra whitespace');
      expect(result.techniques).toContain('compression');
    });
    
    it('should deduplicate content', async () => {
      const duplicateText = 'This is duplicate content';
      const content: ContextContent[] = [
        {
          id: 'test-1',
          section: 'section1',
          content: duplicateText,
          type: 'text',
          priority: 5,
          metadata: {},
          version: '1.0'
        },
        {
          id: 'test-2',
          section: 'section2',
          content: duplicateText,
          type: 'text',
          priority: 5,
          metadata: {},
          version: '1.0'
        }
      ];
      
      const budget: TokenBudget = { max: 1000, reserved: 0, used: 0 };
      const options: OptimizationOptions = {
        enableCompression: false,
        enableDeduplication: true,
        enableSummarization: false,
        enableCaching: false,
        aggressiveness: 'moderate'
      };
      
      const { optimized, result } = await optimizer.optimizeContent(
        content,
        budget,
        options
      );
      
      expect(optimized[1].content).toContain('[See:');
      expect(result.savingsPercentage).toBeGreaterThan(0);
      expect(result.techniques).toContain('deduplication');
    });
    
    it('should summarize when over budget', async () => {
      const longContent = 'Lorem ipsum '.repeat(1000);
      const content: ContextContent[] = [{
        id: 'test-1',
        section: 'test',
        content: longContent,
        type: 'documentation',
        priority: 3,
        metadata: {},
        version: '1.0'
      }];
      
      const budget: TokenBudget = { max: 100, reserved: 0, used: 0 };
      const options: OptimizationOptions = {
        enableCompression: false,
        enableDeduplication: false,
        enableSummarization: true,
        enableCaching: false,
        aggressiveness: 'aggressive'
      };
      
      const { optimized, result } = await optimizer.optimizeContent(
        content,
        budget,
        options
      );
      
      expect(result.optimizedTokens).toBeLessThanOrEqual(100);
      expect(optimized[0].content).toContain('[... summarized]');
      expect(result.techniques).toContain('summarization');
    });
    
    it('should preserve high priority content', async () => {
      const content: ContextContent[] = [
        {
          id: 'critical',
          section: 'critical',
          content: 'Critical content that must be preserved',
          type: 'text',
          priority: 10,
          metadata: {},
          version: '1.0'
        },
        {
          id: 'optional',
          section: 'optional',
          content: 'Optional content '.repeat(100),
          type: 'text',
          priority: 2,
          metadata: {},
          version: '1.0'
        }
      ];
      
      const budget: TokenBudget = { max: 50, reserved: 0, used: 0 };
      const options: OptimizationOptions = {
        enableCompression: true,
        enableDeduplication: true,
        enableSummarization: true,
        enableCaching: false,
        aggressiveness: 'aggressive'
      };
      
      const { optimized } = await optimizer.optimizeContent(
        content,
        budget,
        options
      );
      
      const criticalContent = optimized.find(o => o.id === 'critical');
      const optionalContent = optimized.find(o => o.id === 'optional');
      
      expect(criticalContent?.content).toBe('Critical content that must be preserved');
      expect(optionalContent?.content).toContain('summarized');
    });
  });
  
  describe('ContextCacheManager', () => {
    let cacheManager: ContextCacheManager;
    
    beforeEach(() => {
      cacheManager = new ContextCacheManager(testDir, {
        maxSize: 10,
        ttl: 1000,
        persistToDisk: true,
        compressionEnabled: true
      });
    });
    
    afterEach(() => {
      cacheManager.destroy();
    });
    
    it('should cache and retrieve content', async () => {
      const key = 'test-key';
      const content = { data: 'test content', tokens: 100 };
      
      await cacheManager.set(key, content);
      const retrieved = await cacheManager.get(key);
      
      expect(retrieved).toEqual(content);
      
      const stats = cacheManager.getStatistics();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(0);
    });
    
    it('should respect TTL', async () => {
      const key = 'ttl-test';
      const content = { data: 'expires' };
      
      await cacheManager.set(key, content, 100); // 100ms TTL
      
      // Should retrieve immediately
      expect(await cacheManager.get(key)).toEqual(content);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should be expired
      expect(await cacheManager.get(key)).toBeNull();
    });
    
    it('should generate consistent cache keys', () => {
      const params1 = {
        command: 'test-command',
        layers: ['global', 'phase'],
        version: '1.0'
      };
      
      const key1 = cacheManager.generateKey(params1);
      const key2 = cacheManager.generateKey(params1);
      
      expect(key1).toBe(key2);
      expect(key1).toMatch(/^[a-f0-9]{16}$/);
    });
    
    it('should evict entries when over size limit', async () => {
      // Set very small cache
      const smallCache = new ContextCacheManager(testDir, {
        maxSize: 0.001, // 1KB
        ttl: 60000,
        persistToDisk: false,
        compressionEnabled: false
      });
      
      // Add multiple entries
      const largeContent = 'x'.repeat(500);
      
      await smallCache.set('entry1', largeContent);
      await smallCache.set('entry2', largeContent);
      await smallCache.set('entry3', largeContent);
      
      const stats = smallCache.getStatistics();
      expect(stats.evictions).toBeGreaterThan(0);
      expect(stats.size).toBeLessThanOrEqual(1024); // 1KB in bytes
      
      smallCache.destroy();
    });
    
    it('should persist cache to disk', async () => {
      const key = 'persist-test';
      const content = { persistent: true };
      
      await cacheManager.set(key, content);
      
      // Create new instance
      const newCacheManager = new ContextCacheManager(testDir, {
        maxSize: 10,
        ttl: 60000,
        persistToDisk: true,
        compressionEnabled: true
      });
      
      // Should load from disk
      const retrieved = await newCacheManager.get(key);
      expect(retrieved).toEqual(content);
      
      newCacheManager.destroy();
    });
  });
  
  describe('PerformanceMonitor', () => {
    let monitor: PerformanceMonitor;
    
    beforeEach(() => {
      monitor = new PerformanceMonitor({
        maxOperationTime: 100,
        maxMemoryUsage: 500,
        maxTokensPerOperation: 1000,
        minCacheHitRate: 50
      });
    });
    
    afterEach(() => {
      monitor.stopMonitoring();
    });
    
    it('should track operation performance', () => {
      const operationId = 'test-op';
      
      monitor.startOperation(operationId);
      
      // Simulate work
      const start = Date.now();
      while (Date.now() - start < 50) {
        // Busy wait
      }
      
      const metrics = monitor.endOperation(operationId, {
        tokensProcessed: 500,
        layersActive: 3,
        cacheHit: false
      });
      
      expect(metrics).toBeDefined();
      expect(metrics!.duration).toBeGreaterThanOrEqual(50);
      expect(metrics!.contextMetrics?.tokensProcessed).toBe(500);
      
      const summary = monitor.getSummary();
      expect(summary.totalOperations).toBe(1);
      expect(summary.averageDuration).toBeGreaterThanOrEqual(50);
    });
    
    it('should generate performance alerts', (done) => {
      monitor.on('performance-alert', (alert) => {
        expect(alert.type).toBe('duration');
        expect(alert.value).toBeGreaterThan(alert.threshold);
        done();
      });
      
      const operationId = 'slow-op';
      monitor.startOperation(operationId);
      
      // Simulate slow operation
      setTimeout(() => {
        monitor.endOperation(operationId);
      }, 150);
    });
    
    it('should calculate operation statistics', () => {
      // Record multiple operations
      for (let i = 0; i < 10; i++) {
        monitor.startOperation(`op-${i}`);
        monitor.endOperation(`op-${i}`, {
          tokensProcessed: 100 * i,
          layersActive: 3,
          cacheHit: i % 2 === 0
        });
      }
      
      const stats = monitor.getOperationStats();
      expect(stats.size).toBeGreaterThan(0);
      
      const summary = monitor.getSummary();
      expect(summary.totalOperations).toBe(10);
      expect(summary.cacheHitRate).toBe(50);
    });
    
    it('should provide performance recommendations', () => {
      // Simulate poor cache performance
      for (let i = 0; i < 20; i++) {
        monitor.recordMetric({
          timestamp: Date.now(),
          operation: 'test',
          duration: 50,
          memoryUsage: process.memoryUsage(),
          contextMetrics: {
            tokensProcessed: 1000,
            layersActive: 3,
            cacheHit: false // All misses
          }
        });
      }
      
      const recommendations = monitor.getRecommendations();
      expect(recommendations).toContain(
        expect.stringContaining('Cache hit rate is low')
      );
    });
    
    it('should export metrics', () => {
      // Add some metrics
      monitor.recordMetric({
        timestamp: Date.now(),
        operation: 'export-test',
        duration: 100,
        memoryUsage: process.memoryUsage(),
        contextMetrics: {
          tokensProcessed: 500,
          layersActive: 3,
          cacheHit: true
        }
      });
      
      const jsonExport = monitor.exportMetrics('json');
      expect(jsonExport).toContain('export-test');
      
      const csvExport = monitor.exportMetrics('csv');
      expect(csvExport).toContain('timestamp,operation,duration');
      expect(csvExport).toContain('export-test');
    });
  });
  
  describe('Performance Integration', () => {
    it('should optimize and cache together', async () => {
      const optimizer = new TokenOptimizer();
      const cacheManager = new ContextCacheManager(testDir);
      
      const content: ContextContent[] = [{
        id: 'integrated',
        section: 'test',
        content: 'Content to optimize and cache',
        type: 'text',
        priority: 5,
        metadata: {},
        version: '1.0'
      }];
      
      // Optimize content
      const { optimized } = await optimizer.optimizeContent(
        content,
        { max: 1000, reserved: 0, used: 0 },
        {
          enableCompression: true,
          enableDeduplication: false,
          enableSummarization: false,
          enableCaching: false,
          aggressiveness: 'moderate'
        }
      );
      
      // Cache optimized content
      const cacheKey = 'optimized-content';
      await cacheManager.set(cacheKey, optimized);
      
      // Retrieve and verify
      const cached = await cacheManager.get(cacheKey);
      expect(cached).toEqual(optimized);
      
      cacheManager.destroy();
    });
  });
});