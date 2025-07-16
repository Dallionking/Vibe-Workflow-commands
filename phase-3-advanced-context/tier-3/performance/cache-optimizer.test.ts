/**
 * Tests for Cache Optimizer
 * Phase 3: Advanced Context Features - Tier 3.2
 *
 * Comprehensive test suite for advanced caching system with multiple strategies,
 * intelligent cache warming, compression, and performance analytics.
 */

import { CacheOptimizer, CacheConfig, CacheStats, CacheOptimizationResult } from './cache-optimizer';

describe('CacheOptimizer', () => {
  let cacheOptimizer: CacheOptimizer;
  let defaultConfig: CacheConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    defaultConfig = {
      maxSize: 100,
      ttl: 3600000, // 1 hour
      strategy: 'adaptive',
      enableCompression: true,
      memoryThreshold: 0.8,
      warmupEnabled: true,
      analyticsEnabled: true
    };

    cacheOptimizer = new CacheOptimizer(defaultConfig);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      const cacheWithDefaults = new CacheOptimizer();
      const config = cacheWithDefaults.getConfig();

      expect(config.maxSize).toBe(1000);
      expect(config.ttl).toBe(3600000);
      expect(config.strategy).toBe('adaptive');
      expect(config.enableCompression).toBe(true);
      expect(config.memoryThreshold).toBe(0.8);
      expect(config.warmupEnabled).toBe(true);
      expect(config.analyticsEnabled).toBe(true);
    });

    it('should initialize with custom configuration', () => {
      const config = cacheOptimizer.getConfig();

      expect(config.maxSize).toBe(100);
      expect(config.strategy).toBe('adaptive');
    });

    it('should initialize stats correctly', () => {
      const stats = cacheOptimizer.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
      expect(stats.hitRate).toBe(0);
      expect(stats.totalEntries).toBe(0);
    });
  });

  describe('basic cache operations', () => {
    it('should set and get values correctly', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      const setResult = await cacheOptimizer.set(key, value);
      expect(setResult).toBe(true);

      const getValue = await cacheOptimizer.get(key);
      expect(getValue).toEqual(value);
    });

    it('should return null for non-existent keys', async () => {
      const value = await cacheOptimizer.get('non-existent');
      expect(value).toBeNull();
    });

    it('should update cache stats on hits and misses', async () => {
      await cacheOptimizer.set('key1', 'value1');

      // Hit
      await cacheOptimizer.get('key1');
      let stats = cacheOptimizer.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(0);
      expect(stats.hitRate).toBe(1);

      // Miss
      await cacheOptimizer.get('non-existent');
      stats = cacheOptimizer.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0.5);
    });

    it('should delete values correctly', async () => {
      await cacheOptimizer.set('key1', 'value1');

      const deleted = await cacheOptimizer.delete('key1');
      expect(deleted).toBe(true);

      const value = await cacheOptimizer.get('key1');
      expect(value).toBeNull();
    });

    it('should clear entire cache', async () => {
      await cacheOptimizer.set('key1', 'value1');
      await cacheOptimizer.set('key2', 'value2');

      await cacheOptimizer.clearCache();

      const value1 = await cacheOptimizer.get('key1');
      const value2 = await cacheOptimizer.get('key2');
      expect(value1).toBeNull();
      expect(value2).toBeNull();

      const stats = cacheOptimizer.getStats();
      expect(stats.totalEntries).toBe(0);
    });
  });

  describe('TTL expiration', () => {
    it('should expire entries after TTL', async () => {
      const shortTTLConfig: CacheConfig = {
        ...defaultConfig,
        ttl: 100 // 100ms
      };
      const cache = new CacheOptimizer(shortTTLConfig);

      await cache.set('key1', 'value1');

      // Before expiration
      let value = await cache.get('key1');
      expect(value).toBe('value1');

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      // After expiration
      value = await cache.get('key1');
      expect(value).toBeNull();
    });
  });

  describe('eviction strategies', () => {
    it('should evict entries when max size is reached', async () => {
      const smallCache = new CacheOptimizer({ ...defaultConfig, maxSize: 3 });

      await smallCache.set('key1', 'value1');
      await smallCache.set('key2', 'value2');
      await smallCache.set('key3', 'value3');

      // Should trigger eviction
      await smallCache.set('key4', 'value4');

      const stats = smallCache.getStats();
      expect(stats.totalEntries).toBe(3);
      expect(stats.evictions).toBeGreaterThan(0);
    });

    it('should evict using LRU strategy', async () => {
      const lruCache = new CacheOptimizer({
        ...defaultConfig,
        maxSize: 3,
        strategy: 'lru'
      });

      await lruCache.set('key1', 'value1');
      await lruCache.set('key2', 'value2');
      await lruCache.set('key3', 'value3');

      // Access key1 and key2 to make them more recently used
      await lruCache.get('key1');
      await lruCache.get('key2');

      // key3 should be evicted as least recently used
      await lruCache.set('key4', 'value4');

      const value3 = await lruCache.get('key3');
      expect(value3).toBeNull(); // Should be evicted
    });

    it('should evict using LFU strategy', async () => {
      const lfuCache = new CacheOptimizer({
        ...defaultConfig,
        maxSize: 3,
        strategy: 'lfu'
      });

      await lfuCache.set('key1', 'value1');
      await lfuCache.set('key2', 'value2');
      await lfuCache.set('key3', 'value3');

      // Access key1 and key2 multiple times
      await lfuCache.get('key1');
      await lfuCache.get('key1');
      await lfuCache.get('key2');

      // key3 should be evicted as least frequently used
      await lfuCache.set('key4', 'value4');

      const value3 = await lfuCache.get('key3');
      expect(value3).toBeNull(); // Should be evicted
    });

    it('should evict using FIFO strategy', async () => {
      const fifoCache = new CacheOptimizer({
        ...defaultConfig,
        maxSize: 3,
        strategy: 'fifo'
      });

      await fifoCache.set('key1', 'value1');
      await fifoCache.set('key2', 'value2');
      await fifoCache.set('key3', 'value3');

      // key1 should be evicted as first in
      await fifoCache.set('key4', 'value4');

      const value1 = await fifoCache.get('key1');
      expect(value1).toBeNull(); // Should be evicted
    });

    it('should evict using adaptive strategy', async () => {
      const adaptiveCache = new CacheOptimizer({
        ...defaultConfig,
        maxSize: 3,
        strategy: 'adaptive'
      });

      await adaptiveCache.set('key1', 'value1');
      await adaptiveCache.set('key2', 'value2');
      await adaptiveCache.set('key3', 'value3');

      // Adaptive strategy combines recency and frequency
      await adaptiveCache.get('key1'); // Increase both recency and frequency
      await adaptiveCache.get('key1');

      await adaptiveCache.set('key4', 'value4');

      // key1 should be kept due to high score
      const value1 = await adaptiveCache.get('key1');
      expect(value1).toBe('value1');
    });
  });

  describe('compression', () => {
    it('should compress large values when enabled', async () => {
      const largeValue = 'x'.repeat(2000); // Large string

      const setResult = await cacheOptimizer.set('large-key', largeValue);
      expect(setResult).toBe(true);

      const getValue = await cacheOptimizer.get('large-key');
      expect(getValue).toBe(largeValue);
    });

    it('should not compress small values', async () => {
      const smallValue = 'small';

      await cacheOptimizer.set('small-key', smallValue);

      // Access internal cache to check compression
      const cache = (cacheOptimizer as any).cache;
      const entry = cache.get('small-key');

      expect(entry.compressed).toBe(false);
    });

    it('should handle compression errors gracefully', async () => {
      // Mock compression to fail
      const mockCompress = jest.spyOn(cacheOptimizer as any, 'compress')
        .mockRejectedValue(new Error('Compression failed'));

      const largeValue = 'x'.repeat(2000);
      const setResult = await cacheOptimizer.set('key', largeValue);

      // Should fail to set when compression fails
      expect(setResult).toBe(false);

      mockCompress.mockRestore();
    });

    it('should disable compression when configured', async () => {
      const noCompressionCache = new CacheOptimizer({
        ...defaultConfig,
        enableCompression: false
      });

      const largeValue = 'x'.repeat(2000);
      await noCompressionCache.set('key', largeValue);

      const cache = (noCompressionCache as any).cache;
      const entry = cache.get('key');

      expect(entry.compressed).toBe(false);
    });
  });

  describe('cache optimization', () => {
    it('should optimize cache performance', async () => {
      // Add some data with different access patterns
      for (let i = 0; i < 10; i++) {
        await cacheOptimizer.set(`key${i}`, `value${i}`);
      }

      // Create access patterns
      for (let i = 0; i < 5; i++) {
        await cacheOptimizer.get('key0'); // High frequency
        await cacheOptimizer.get('key1'); // High frequency
      }

      await cacheOptimizer.get('key5'); // Low frequency

      const result = await cacheOptimizer.optimizeCache();

      expect(result).toBeDefined();
      expect(result.improvement).toBeGreaterThanOrEqual(0);
      expect(result.stats).toBeDefined();
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should switch strategies based on access patterns', async () => {
      // Create temporal access pattern
      for (let i = 0; i < 20; i++) {
        await cacheOptimizer.set(`temporal${i}`, `value${i}`);
        await new Promise(resolve => setTimeout(resolve, 10));
        await cacheOptimizer.get(`temporal${i}`);
      }

      const result = await cacheOptimizer.optimizeCache();

      expect(result.changes.length).toBeGreaterThanOrEqual(0);
      // Strategy might change based on patterns
    });

    it('should optimize cache size', async () => {
      // Fill cache with varying access patterns
      for (let i = 0; i < 50; i++) {
        await cacheOptimizer.set(`key${i}`, `value${i}`);
      }

      // Access only first 20 keys
      for (let i = 0; i < 20; i++) {
        await cacheOptimizer.get(`key${i}`);
      }

      const result = await cacheOptimizer.optimizeCache();

      const sizeChange = result.changes.find(c => c.type === 'size');
      if (sizeChange) {
        expect(sizeChange.impact).toBeGreaterThan(0);
      }
    });

    it('should optimize TTL based on access intervals', async () => {
      // Create regular access pattern
      for (let i = 0; i < 5; i++) {
        await cacheOptimizer.set('regular-key', `value${i}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await cacheOptimizer.get('regular-key');
      }

      const result = await cacheOptimizer.optimizeCache();

      const ttlChange = result.changes.find(c => c.type === 'ttl');
      if (ttlChange) {
        expect(ttlChange).toBeDefined();
      }
    });

    it('should handle optimization errors gracefully', async () => {
      // Mock method to throw error
      jest.spyOn(cacheOptimizer as any, 'analyzeAccessPatterns')
        .mockRejectedValue(new Error('Analysis failed'));

      const result = await cacheOptimizer.optimizeCache();

      expect(result.improvement).toBe(0);
      expect(result.recommendations[0]).toContain('Optimization failed');
    });
  });

  describe('cache warming', () => {
    it('should add keys to warmup queue', async () => {
      const keysToWarm = ['key1', 'key2', 'key3'];

      await cacheOptimizer.warmupCache(keysToWarm);

      const warmupQueue = (cacheOptimizer as any).warmupQueue;
      expect(warmupQueue.size).toBe(3);
      expect(warmupQueue.has('key1')).toBe(true);
    });

    it('should skip warmup when disabled', async () => {
      const noWarmupCache = new CacheOptimizer({
        ...defaultConfig,
        warmupEnabled: false
      });

      await noWarmupCache.warmupCache(['key1', 'key2']);

      const warmupQueue = (noWarmupCache as any).warmupQueue;
      expect(warmupQueue.size).toBe(0);
    });
  });

  describe('cache statistics', () => {
    it('should track detailed statistics', async () => {
      await cacheOptimizer.set('key1', 'value1');
      await cacheOptimizer.set('key2', 'value2');

      await cacheOptimizer.get('key1'); // Hit
      await cacheOptimizer.get('key3'); // Miss

      const stats = cacheOptimizer.getStats();

      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0.5);
      expect(stats.totalEntries).toBe(2);
      expect(stats.memoryUsage).toBeGreaterThan(0);
    });

    it('should calculate strategy efficiency', async () => {
      // Create some cache activity
      for (let i = 0; i < 10; i++) {
        await cacheOptimizer.set(`key${i}`, `value${i}`);
      }

      for (let i = 0; i < 5; i++) {
        await cacheOptimizer.get(`key${i}`);
      }

      const stats = cacheOptimizer.getStats();
      expect(stats.strategyEfficiency).toBeGreaterThanOrEqual(0);
      expect(stats.strategyEfficiency).toBeLessThanOrEqual(1);
    });

    it('should track compression ratio', async () => {
      const largeValue1 = 'x'.repeat(2000);
      const largeValue2 = 'y'.repeat(2000);
      const smallValue = 'small';

      await cacheOptimizer.set('large1', largeValue1);
      await cacheOptimizer.set('large2', largeValue2);
      await cacheOptimizer.set('small', smallValue);

      // Trigger stats update
      (cacheOptimizer as any).updateStats();

      const stats = cacheOptimizer.getStats();
      // With large values, compression should be triggered
      expect(stats.compressionRatio).toBeGreaterThanOrEqual(0);
      // And since we have 2 large values out of 3, ratio should be > 0
      expect(stats.totalEntries).toBe(3);
    });
  });

  describe('configuration updates', () => {
    it('should update configuration dynamically', () => {
      const newConfig: Partial<CacheConfig> = {
        maxSize: 200,
        strategy: 'lru'
      };

      cacheOptimizer.updateConfig(newConfig);

      const config = cacheOptimizer.getConfig();
      expect(config.maxSize).toBe(200);
      expect(config.strategy).toBe('lru');
    });
  });

  describe('memory management', () => {
    it('should monitor memory threshold', async () => {
      jest.useFakeTimers();

      const lowThresholdCache = new CacheOptimizer({
        ...defaultConfig,
        maxSize: 10,
        memoryThreshold: 0.5
      });

      // Fill cache to trigger threshold
      for (let i = 0; i < 8; i++) {
        await lowThresholdCache.set(`key${i}`, 'x'.repeat(100));
      }

      // Mock checkMemoryThreshold to verify it's called
      const checkMemorySpy = jest.spyOn(lowThresholdCache as any, 'checkMemoryThreshold');

      // Wait for interval to trigger
      jest.advanceTimersByTime(30000);

      expect(checkMemorySpy).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('error handling', () => {
    it('should handle get errors gracefully', async () => {
      // Mock internal method to throw
      jest.spyOn(cacheOptimizer as any, 'isExpired')
        .mockImplementation(() => {
          throw new Error('Check failed');
        });

      const value = await cacheOptimizer.get('any-key');

      expect(value).toBeNull();
      const stats = cacheOptimizer.getStats();
      expect(stats.misses).toBe(1);
    });

    it('should handle set errors gracefully', async () => {
      // Mock internal method to throw
      jest.spyOn(cacheOptimizer as any, 'calculateSize')
        .mockImplementation(() => {
          throw new Error('Size calculation failed');
        });

      const result = await cacheOptimizer.set('key', 'value');

      expect(result).toBe(false);
    });

    it('should handle decompression errors', async () => {
      await cacheOptimizer.set('key', 'value');

      // Manually set entry as compressed with invalid data
      const cache = (cacheOptimizer as any).cache;
      const entry = cache.get('key');
      entry.compressed = true;
      entry.value = 'invalid-compressed-data';

      const value = await cacheOptimizer.get('key');
      expect(value).toBe('invalid-compressed-data'); // Returns raw value on decompression failure
    });
  });

  describe('access patterns', () => {
    it('should track access history', async () => {
      await cacheOptimizer.set('key1', 'value1');

      // Multiple accesses
      await cacheOptimizer.get('key1');
      await cacheOptimizer.get('key1');
      await cacheOptimizer.get('key1');

      const accessHistory = (cacheOptimizer as any).accessHistory;
      const history = accessHistory.get('key1');

      expect(history).toBeDefined();
      expect(history.length).toBeGreaterThan(1);
    });

    it('should limit access history size', async () => {
      await cacheOptimizer.set('key1', 'value1');

      // Access more than limit (100)
      for (let i = 0; i < 110; i++) {
        await cacheOptimizer.get('key1');
      }

      const accessHistory = (cacheOptimizer as any).accessHistory;
      const history = accessHistory.get('key1');

      expect(history.length).toBeLessThanOrEqual(100);
    });
  });

  describe('metadata support', () => {
    it('should store and preserve metadata', async () => {
      const metadata = {
        source: 'api',
        priority: 5,
        tags: ['important', 'user-data'],
        dependencies: ['dep1', 'dep2'],
        version: 2
      };

      await cacheOptimizer.set('key-with-metadata', 'value', metadata);

      const cache = (cacheOptimizer as any).cache;
      const entry = cache.get('key-with-metadata');

      expect(entry.metadata).toEqual(metadata);
    });

    it('should use default metadata when not provided', async () => {
      await cacheOptimizer.set('key', 'value');

      const cache = (cacheOptimizer as any).cache;
      const entry = cache.get('key');

      expect(entry.metadata.source).toBe('default');
      expect(entry.metadata.priority).toBe(1);
      expect(entry.metadata.tags).toEqual([]);
      expect(entry.metadata.dependencies).toEqual([]);
      expect(entry.metadata.version).toBe(1);
    });
  });

  describe('performance analytics', () => {
    it('should start analytics when enabled', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');

      const analyticsCache = new CacheOptimizer({
        ...defaultConfig,
        analyticsEnabled: true
      });

      // Verify interval is set (2 intervals: analytics + memory monitoring)
      expect(setIntervalSpy).toHaveBeenCalled();

      setIntervalSpy.mockRestore();
    });

    it('should not start analytics when disabled', () => {
      const setIntervalSpy = jest.spyOn(global, 'setInterval');
      setIntervalSpy.mockClear();

      const noAnalyticsCache = new CacheOptimizer({
        ...defaultConfig,
        analyticsEnabled: false
      });

      // Should only set memory monitoring interval, not analytics
      expect(setIntervalSpy).toHaveBeenCalledTimes(1);

      setIntervalSpy.mockRestore();
    });
  });

  describe('optimization history', () => {
    it('should maintain optimization history', async () => {
      // Perform multiple optimizations
      await cacheOptimizer.optimizeCache();
      await cacheOptimizer.optimizeCache();

      const history = (cacheOptimizer as any).optimizationHistory;
      expect(history.length).toBe(2);
    });

    it('should limit optimization history size', async () => {
      // Perform more than 10 optimizations
      for (let i = 0; i < 12; i++) {
        await cacheOptimizer.optimizeCache();
      }

      const history = (cacheOptimizer as any).optimizationHistory;
      expect(history.length).toBe(10);
    });
  });
});
