/**
 * LRU Cache Test Suite
 * Tests for LRUCache implementation with priority-aware eviction
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { LRUCache, CacheFactory } from '../cache/lru-cache';
import { ContextPriority, ContextFragment, ContextFragmentType, ContextMetadata, ContextSource, FragmentValidation } from '../types/context.types';

// Mock ContextFragment for testing
interface MockContextFragment extends ContextFragment {
  readonly id: string;
  readonly type: ContextFragmentType;
  content: string;
  priority: ContextPriority;
  tokenEstimate: number;
  metadata: ContextMetadata;
  validation: FragmentValidation;
}

function createMockFragment(
  id: string,
  content: string = 'test content',
  priority: ContextPriority = ContextPriority.MEDIUM,
  tokenEstimate: number = 100
): MockContextFragment {
  return {
    id,
    type: 'task-context' as ContextFragmentType,
    content,
    priority,
    tokenEstimate,
    metadata: {
      source: { type: 'task', taskId: id, taskType: 'testing' } as ContextSource,
      priority,
      tags: ['test'],
      dependencies: [],
      created: Date.now(),
      lastModified: Date.now()
    },
    validation: {
      isValid: true,
      errors: [],
      warnings: [],
      lastValidated: Date.now()
    }
  };
}

describe('LRUCache', () => {
  let cache: LRUCache<MockContextFragment>;

  beforeEach(() => {
    cache = new LRUCache<MockContextFragment>({
      maxSize: 5,
      ttl: 60000, // 1 minute
      strategy: 'lru',
      evictionPolicy: 'strict-lru'
    });
  });

  describe('Basic Operations', () => {
    test('should put and get items', () => {
      const fragment = createMockFragment('test-1');

      cache.put('test-1', fragment);
      const retrieved = cache.get('test-1');

      expect(retrieved).toBe(fragment);
      expect(cache.has('test-1')).toBe(true);
    });

    test('should return null for non-existent items', () => {
      const result = cache.get('non-existent');
      expect(result).toBe(null);
      expect(cache.has('non-existent')).toBe(false);
    });

    test('should remove items', () => {
      const fragment = createMockFragment('test-1');

      cache.put('test-1', fragment);
      expect(cache.has('test-1')).toBe(true);

      const removed = cache.remove('test-1');
      expect(removed).toBe(true);
      expect(cache.has('test-1')).toBe(false);
      expect(cache.get('test-1')).toBe(null);
    });

    test('should return false when removing non-existent item', () => {
      const removed = cache.remove('non-existent');
      expect(removed).toBe(false);
    });

    test('should clear all items', () => {
      cache.put('test-1', createMockFragment('test-1'));
      cache.put('test-2', createMockFragment('test-2'));

      expect(cache.getStats().currentSize).toBe(2);

      cache.clear();

      expect(cache.getStats().currentSize).toBe(0);
      expect(cache.has('test-1')).toBe(false);
      expect(cache.has('test-2')).toBe(false);
    });
  });

  describe('LRU Behavior', () => {
    test('should maintain LRU order', () => {
      // Fill cache to capacity
      for (let i = 1; i <= 5; i++) {
        cache.put(`test-${i}`, createMockFragment(`test-${i}`));
      }

      expect(cache.getStats().currentSize).toBe(5);

      // Add one more item, should evict least recently used
      cache.put('test-6', createMockFragment('test-6'));

      expect(cache.getStats().currentSize).toBe(5);
      expect(cache.has('test-1')).toBe(false); // Should be evicted
      expect(cache.has('test-6')).toBe(true);   // Should be added
    });

    test('should update LRU order on access', () => {
      // Fill cache
      for (let i = 1; i <= 5; i++) {
        cache.put(`test-${i}`, createMockFragment(`test-${i}`));
      }

      // Access test-1 to make it most recently used
      cache.get('test-1');

      // Add new item, should evict test-2 (now least recently used)
      cache.put('test-6', createMockFragment('test-6'));

      expect(cache.has('test-1')).toBe(true);  // Should still be there
      expect(cache.has('test-2')).toBe(false); // Should be evicted
      expect(cache.has('test-6')).toBe(true);  // Should be added
    });
  });

  describe('Priority-Aware Eviction', () => {
    beforeEach(() => {
      cache = new LRUCache<MockContextFragment>({
        maxSize: 3,
        ttl: 60000,
        strategy: 'priority-weighted',
        evictionPolicy: 'priority-aware'
      });
    });

    test('should prefer evicting low priority items', () => {
      const criticalFragment = createMockFragment('critical', 'critical content', ContextPriority.CRITICAL);
      const highFragment = createMockFragment('high', 'high content', ContextPriority.HIGH);
      const lowFragment = createMockFragment('low', 'low content', ContextPriority.LOW);

      cache.put('critical', criticalFragment);
      cache.put('high', highFragment);
      cache.put('low', lowFragment);

      // Add another item, should evict the low priority one
      const mediumFragment = createMockFragment('medium', 'medium content', ContextPriority.MEDIUM);
      cache.put('medium', mediumFragment);

      expect(cache.has('critical')).toBe(true);
      expect(cache.has('high')).toBe(true);
      expect(cache.has('medium')).toBe(true);
      expect(cache.has('low')).toBe(false); // Should be evicted
    });
  });

  describe('TTL (Time To Live)', () => {
    beforeEach(() => {
      cache = new LRUCache<MockContextFragment>({
        maxSize: 5,
        ttl: 100, // 100ms
        strategy: 'lru',
        evictionPolicy: 'strict-lru'
      });
    });

    test('should expire items after TTL', async () => {
      const fragment = createMockFragment('test-1');
      cache.put('test-1', fragment);

      expect(cache.has('test-1')).toBe(true);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      expect(cache.has('test-1')).toBe(false);
      expect(cache.get('test-1')).toBe(null);
    });

    test('should clean up expired items', async () => {
      cache.put('test-1', createMockFragment('test-1'));
      cache.put('test-2', createMockFragment('test-2'));

      expect(cache.getStats().currentSize).toBe(2);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      const cleanedCount = cache.cleanup();

      expect(cleanedCount).toBe(2);
      expect(cache.getStats().currentSize).toBe(0);
    });
  });

  describe('Statistics', () => {
    test('should track hit and miss statistics', () => {
      const fragment = createMockFragment('test-1');
      cache.put('test-1', fragment);

      // Test hits
      cache.get('test-1'); // hit
      cache.get('test-1'); // hit

      // Test misses
      cache.get('non-existent-1'); // miss
      cache.get('non-existent-2'); // miss

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
      expect(stats.totalAccesses).toBe(4);
      expect(stats.hitRate).toBe(50);
    });

    test('should track eviction statistics', () => {
      // Fill cache beyond capacity to trigger evictions
      for (let i = 1; i <= 7; i++) {
        cache.put(`test-${i}`, createMockFragment(`test-${i}`));
      }

      const stats = cache.getStats();
      expect(stats.evictions).toBe(2); // Should have 2 evictions (7 - 5)
      expect(stats.currentSize).toBe(5);
    });

    test('should track memory usage', () => {
      const fragment1 = createMockFragment('test-1', 'content', ContextPriority.MEDIUM, 100);
      const fragment2 = createMockFragment('test-2', 'content', ContextPriority.MEDIUM, 150);

      cache.put('test-1', fragment1);
      cache.put('test-2', fragment2);

      const stats = cache.getStats();
      expect(stats.memoryUsage).toBe(250); // 100 + 150 tokens
    });
  });

  describe('Configuration', () => {
    test('should resize cache capacity', () => {
      // Fill cache to original capacity (5)
      for (let i = 1; i <= 5; i++) {
        cache.put(`test-${i}`, createMockFragment(`test-${i}`));
      }

      expect(cache.getStats().currentSize).toBe(5);

      // Resize to smaller capacity
      cache.resize(3);

      expect(cache.getStats().maxSize).toBe(3);
      expect(cache.getStats().currentSize).toBeLessThanOrEqual(3);
    });

    test('should update configuration', () => {
      const originalStats = cache.getStats();

      cache.updateConfig({
        maxSize: 10,
        ttl: 120000,
        strategy: 'lfu'
      });

      const newStats = cache.getStats();
      expect(newStats.maxSize).toBe(10);
      expect(newStats.maxSize).not.toBe(originalStats.maxSize);
    });
  });

  describe('Export/Import', () => {
    test('should export cache state', () => {
      const fragment1 = createMockFragment('test-1');
      const fragment2 = createMockFragment('test-2');

      cache.put('test-1', fragment1);
      cache.put('test-2', fragment2);

      const exported = cache.export();

      expect(exported.entries).toHaveLength(2);
      expect(exported.accessOrder).toContain('test-1');
      expect(exported.accessOrder).toContain('test-2');
      expect(exported.config).toBeDefined();
      expect(exported.stats).toBeDefined();
      expect(exported.timestamp).toBeDefined();
    });

    test('should import cache state', () => {
      const fragment = createMockFragment('test-1');
      cache.put('test-1', fragment);

      const exported = cache.export();

      // Create new cache and import
      const newCache = new LRUCache<MockContextFragment>();
      newCache.import(exported);

      expect(newCache.has('test-1')).toBe(true);
      expect(newCache.get('test-1')).toEqual(fragment);
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero capacity', () => {
      const zeroCache = new LRUCache<MockContextFragment>({ maxSize: 0 });

      zeroCache.put('test-1', createMockFragment('test-1'));

      expect(zeroCache.has('test-1')).toBe(false);
      expect(zeroCache.getStats().currentSize).toBe(0);
    });

    test('should handle duplicate keys', () => {
      const fragment1 = createMockFragment('test-1', 'content 1');
      const fragment2 = createMockFragment('test-1', 'content 2');

      cache.put('test-1', fragment1);
      cache.put('test-1', fragment2); // Overwrite

      const retrieved = cache.get('test-1');
      expect(retrieved?.content).toBe('content 2');
      expect(cache.getStats().currentSize).toBe(1);
    });

    test('should handle large token estimates', () => {
      const largeFragment = createMockFragment('large', 'content', ContextPriority.MEDIUM, 999999);

      cache.put('large', largeFragment);

      const stats = cache.getStats();
      expect(stats.memoryUsage).toBe(999999);
    });
  });
});

describe('CacheFactory', () => {
  test('should create named cache instances', () => {
    const cache1 = CacheFactory.createFragmentCache('test-cache-1');
    const cache2 = CacheFactory.createFragmentCache('test-cache-2');

    expect(cache1).not.toBe(cache2);
    expect(CacheFactory.getCache('test-cache-1')).toBe(cache1);
    expect(CacheFactory.getCache('test-cache-2')).toBe(cache2);
  });

  test('should return same instance for same name', () => {
    const cache1 = CacheFactory.createFragmentCache('same-name');
    const cache2 = CacheFactory.createFragmentCache('same-name');

    expect(cache1).toBe(cache2);
  });

  test('should remove cache instances', () => {
    CacheFactory.createFragmentCache('removable-cache');

    expect(CacheFactory.getCache('removable-cache')).not.toBe(null);

    const removed = CacheFactory.removeCache('removable-cache');
    expect(removed).toBe(true);
    expect(CacheFactory.getCache('removable-cache')).toBe(null);
  });

  test('should get all cache instances', () => {
    // Clear any existing caches
    const existing = CacheFactory.getAllCaches();
    existing.forEach((_, name) => CacheFactory.removeCache(name));

    CacheFactory.createFragmentCache('cache-1');
    CacheFactory.createFragmentCache('cache-2');

    const allCaches = CacheFactory.getAllCaches();
    expect(allCaches.size).toBe(2);
    expect(allCaches.has('cache-1')).toBe(true);
    expect(allCaches.has('cache-2')).toBe(true);
  });

  test('should handle custom configuration', () => {
    const customCache = CacheFactory.createFragmentCache('custom-cache', {
      maxSize: 100,
      ttl: 300000,
      evictionPolicy: 'priority-aware'
    });

    const stats = customCache.getStats();
    expect(stats.maxSize).toBe(100);
  });
});
