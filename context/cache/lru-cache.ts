/**
 * LRU Cache Implementation for Context Fragments
 * Optimizes performance through intelligent caching with configurable policies
 */

import { ContextFragment, ContextPriority } from '../types/context.types';

/**
 * Cache Configuration
 */
export interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  strategy: 'lru' | 'lfu' | 'priority-weighted';
  persistToDisk: boolean;
  evictionPolicy: 'strict-lru' | 'priority-aware' | 'adaptive';
}

/**
 * Cache Entry with metadata
 */
interface CacheEntry<T> {
  key: string;
  value: T;
  accessCount: number;
  lastAccessed: number;
  created: number;
  priority: ContextPriority;
  size: number; // Token count for fragments
}

/**
 * Cache Statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  totalAccesses: number;
  hitRate: number;
  currentSize: number;
  maxSize: number;
  memoryUsage: number; // Estimated memory in tokens
}

/**
 * LRU Cache with priority-aware eviction
 */
export class LRUCache<T extends ContextFragment> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private stats: CacheStats;
  private accessOrder: string[] = []; // For LRU ordering
  private cleanupTimer?: NodeJS.Timeout;
  private memoryThreshold: number = 50 * 1024 * 1024; // 50MB

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 500, // Reduced default size
      ttl: config.ttl || 1800000, // 30 minutes default (reduced)
      strategy: config.strategy || 'priority-weighted',
      persistToDisk: config.persistToDisk || false,
      evictionPolicy: config.evictionPolicy || 'priority-aware'
    };

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalAccesses: 0,
      hitRate: 0,
      currentSize: 0,
      maxSize: this.config.maxSize,
      memoryUsage: 0
    };

    // Start cleanup timer for memory optimization
    this.startPeriodicCleanup();
  }

  /**
   * Get item from cache
   */
  public get(key: string): T | null {
    this.stats.totalAccesses++;
    
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check TTL
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Update access metadata
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    // Update LRU order
    this.updateAccessOrder(key);
    
    this.stats.hits++;
    this.updateHitRate();
    
    return entry.value;
  }

  /**
   * Put item in cache
   */
  public put(key: string, value: T): void {
    const now = Date.now();
    const size = value.tokenEstimate;

    // Check if key already exists
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.stats.memoryUsage -= existing.size;
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    }

    // Create new entry
    const entry: CacheEntry<T> = {
      key,
      value,
      accessCount: 1,
      lastAccessed: now,
      created: now,
      priority: value.priority,
      size
    };

    // Ensure capacity
    this.ensureCapacity();

    // Add to cache
    this.cache.set(key, entry);
    this.accessOrder.push(key);
    this.stats.memoryUsage += size;
    this.stats.currentSize = this.cache.size;
  }

  /**
   * Remove item from cache
   */
  public remove(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    this.cache.delete(key);
    this.removeFromAccessOrder(key);
    this.stats.memoryUsage -= entry.size;
    this.stats.currentSize = this.cache.size;
    
    return true;
  }

  /**
   * Check if key exists in cache
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    // Check TTL
    if (this.isExpired(entry)) {
      this.remove(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all entries
   */
  public clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.stats.currentSize = 0;
    this.stats.memoryUsage = 0;
  }

  /**
   * Start periodic cleanup for memory optimization
   */
  private startPeriodicCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.performMemoryOptimization();
    }, 60000); // Every minute
  }

  /**
   * Perform memory optimization
   */
  private performMemoryOptimization(): void {
    // Remove expired entries
    this.cleanup();
    
    // Check memory usage
    const currentMemory = this.estimateMemoryUsage();
    if (currentMemory > this.memoryThreshold) {
      this.aggressiveCleanup();
    }
    
    // Update stats
    this.updateMemoryStats();
  }

  /**
   * Aggressive cleanup for memory pressure
   */
  private aggressiveCleanup(): void {
    const targetSize = Math.floor(this.config.maxSize * 0.7); // Keep 70%
    
    while (this.cache.size > targetSize) {
      // Remove least recently used items first
      const oldestKey = this.accessOrder[0];
      if (oldestKey) {
        this.remove(oldestKey);
      } else {
        break;
      }
    }
  }

  /**
   * Estimate memory usage
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      // Estimate size based on content length and object overhead
      totalSize += entry.value.content.length * 2; // UTF-16 encoding
      totalSize += 1000; // Object overhead estimate
    }
    
    return totalSize;
  }

  /**
   * Update memory statistics
   */
  private updateMemoryStats(): void {
    this.stats.memoryUsage = this.estimateMemoryUsage();
    this.stats.currentSize = this.cache.size;
    this.updateHitRate();
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.clear();
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get all keys sorted by access recency
   */
  public getKeys(): string[] {
    return [...this.accessOrder];
  }

  /**
   * Get entries by priority (highest first)
   */
  public getByPriority(): T[] {
    return Array.from(this.cache.values())
      .sort((a, b) => b.priority - a.priority)
      .map(entry => entry.value);
  }

  /**
   * Cleanup expired entries
   */
  public cleanup(): number {
    let cleanedCount = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        this.remove(key);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Cleanup expired entries (alias for cleanup)
   */
  public cleanupExpired(): number {
    return this.cleanup();
  }

  /**
   * Resize cache capacity
   */
  public resize(newMaxSize: number): void {
    this.config.maxSize = newMaxSize;
    this.stats.maxSize = newMaxSize;
    
    if (this.cache.size > newMaxSize) {
      this.ensureCapacity();
    }
  }

  /**
   * Update cache configuration
   */
  public updateConfig(updates: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (updates.maxSize) {
      this.resize(updates.maxSize);
    }
  }

  /**
   * Export cache state for persistence
   */
  public export(): CacheExport<T> {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      value: entry.value,
      metadata: {
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed,
        created: entry.created,
        priority: entry.priority,
        size: entry.size
      }
    }));

    return {
      config: this.config,
      stats: this.stats,
      entries,
      accessOrder: [...this.accessOrder],
      timestamp: Date.now()
    };
  }

  /**
   * Import cache state from persistence
   */
  public import(data: CacheExport<T>): void {
    this.clear();
    this.config = data.config;
    this.stats = data.stats;
    this.accessOrder = data.accessOrder;

    for (const entry of data.entries) {
      const cacheEntry: CacheEntry<T> = {
        key: entry.key,
        value: entry.value,
        accessCount: entry.metadata.accessCount,
        lastAccessed: entry.metadata.lastAccessed,
        created: entry.metadata.created,
        priority: entry.metadata.priority,
        size: entry.metadata.size
      };

      this.cache.set(entry.key, cacheEntry);
    }
  }

  // Private helper methods

  private isExpired(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    return (now - entry.created) > this.config.ttl;
  }

  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private ensureCapacity(): void {
    while (this.cache.size >= this.config.maxSize) {
      const evicted = this.evictOne();
      if (evicted) {
        this.stats.evictions++;
      } else {
        break; // Safety break
      }
    }
  }

  private evictOne(): boolean {
    if (this.cache.size === 0) {
      return false;
    }

    let keyToEvict: string;

    switch (this.config.evictionPolicy) {
      case 'strict-lru':
        keyToEvict = this.accessOrder[0];
        break;
      
      case 'priority-aware':
        keyToEvict = this.findLowPriorityLRUKey();
        break;
      
      case 'adaptive':
        keyToEvict = this.findAdaptiveEvictionKey();
        break;
      
      default:
        keyToEvict = this.accessOrder[0];
    }

    if (keyToEvict) {
      this.remove(keyToEvict);
      return true;
    }

    return false;
  }

  private findLowPriorityLRUKey(): string {
    // Find the least recently used item among lowest priority items
    const entries = Array.from(this.cache.entries());
    const lowestPriority = Math.min(...entries.map(([, entry]) => entry.priority));
    
    const lowPriorityEntries = entries.filter(([, entry]) => entry.priority === lowestPriority);
    
    if (lowPriorityEntries.length === 0) {
      return this.accessOrder[0]; // Fallback to LRU
    }

    // Find LRU among low priority entries
    let oldestKey = lowPriorityEntries[0][0];
    let oldestAccess = lowPriorityEntries[0][1].lastAccessed;

    for (const [key, entry] of lowPriorityEntries) {
      if (entry.lastAccessed < oldestAccess) {
        oldestKey = key;
        oldestAccess = entry.lastAccessed;
      }
    }

    return oldestKey;
  }

  private findAdaptiveEvictionKey(): string {
    // Adaptive strategy considers frequency, recency, and priority
    const entries = Array.from(this.cache.entries());
    let bestScore = Infinity;
    let bestKey = this.accessOrder[0];

    for (const [key, entry] of entries) {
      const recencyScore = (Date.now() - entry.lastAccessed) / 1000; // Seconds since last access
      const frequencyScore = 1 / Math.max(entry.accessCount, 1); // Inverse of access count
      const priorityScore = (6 - entry.priority) * 10; // Higher penalty for lower priority

      const compositeScore = recencyScore + frequencyScore + priorityScore;

      if (compositeScore < bestScore) {
        bestScore = compositeScore;
        bestKey = key;
      }
    }

    return bestKey;
  }

  private updateHitRate(): void {
    if (this.stats.totalAccesses > 0) {
      this.stats.hitRate = (this.stats.hits / this.stats.totalAccesses) * 100;
    }
  }
}

/**
 * Cache export format for persistence
 */
interface CacheExport<T> {
  config: CacheConfig;
  stats: CacheStats;
  entries: Array<{
    key: string;
    value: T;
    metadata: {
      accessCount: number;
      lastAccessed: number;
      created: number;
      priority: ContextPriority;
      size: number;
    };
  }>;
  accessOrder: string[];
  timestamp: number;
}

/**
 * Cache Factory for creating configured cache instances with intelligent optimizations
 */
export class CacheFactory {
  private static instances = new Map<string, LRUCache<any>>();
  private static performanceMetrics = new Map<string, CachePerformanceMetrics>();

  public static createFragmentCache(name: string, config?: Partial<CacheConfig>): LRUCache<ContextFragment> {
    if (this.instances.has(name)) {
      return this.instances.get(name)!;
    }

    // Intelligent sizing based on available memory
    const availableMemory = this.getAvailableMemory();
    const optimizedSize = this.calculateOptimalCacheSize(availableMemory);

    const defaultConfig: Partial<CacheConfig> = {
      maxSize: Math.min(optimizedSize, config?.maxSize || 500),
      ttl: config?.ttl || this.calculateOptimalTTL(name),
      strategy: 'priority-weighted',
      evictionPolicy: 'priority-aware'
    };

    const cache = new LRUCache<ContextFragment>({ ...defaultConfig, ...config });
    this.instances.set(name, cache);
    
    // Initialize performance tracking
    this.performanceMetrics.set(name, {
      averageResponseTime: 0,
      hitRateTrend: [],
      memoryEfficiency: 100,
      lastOptimization: Date.now()
    });
    
    return cache;
  }

  // Performance optimization methods
  private static getAvailableMemory(): number {
    const memInfo = process.memoryUsage();
    return memInfo.heapTotal - memInfo.heapUsed;
  }

  private static calculateOptimalCacheSize(availableMemory: number): number {
    // Allocate 10% of available memory to cache, with reasonable bounds
    const optimalSize = Math.floor(availableMemory / (1024 * 100)); // ~10KB per item estimate
    return Math.max(100, Math.min(1000, optimalSize));
  }

  private static calculateOptimalTTL(cacheName: string): number {
    // Adaptive TTL based on cache usage patterns
    const metrics = this.performanceMetrics.get(cacheName);
    if (!metrics) return 1800000; // 30 minutes default

    // Longer TTL for high-hit caches, shorter for low-hit
    const baseTime = 1800000; // 30 minutes
    const hitRateAvg = metrics.hitRateTrend.length > 0 
      ? metrics.hitRateTrend.reduce((a, b) => a + b) / metrics.hitRateTrend.length 
      : 50;

    if (hitRateAvg > 80) return baseTime * 2; // 1 hour for high-hit
    if (hitRateAvg < 30) return baseTime / 2;  // 15 minutes for low-hit
    return baseTime; // 30 minutes default
  }

  public static optimizeAllCaches(): void {
    for (const [name, cache] of this.instances.entries()) {
      const stats = cache.getStats();
      const metrics = this.performanceMetrics.get(name);
      
      if (metrics) {
        // Update hit rate trend
        metrics.hitRateTrend.push(stats.hitRate);
        if (metrics.hitRateTrend.length > 10) {
          metrics.hitRateTrend.shift(); // Keep only last 10 measurements
        }
        
        // Trigger cache optimization if performance is poor
        if (stats.hitRate < 30 && Date.now() - metrics.lastOptimization > 300000) { // 5 minutes
          this.performCacheOptimization(name, cache);
          metrics.lastOptimization = Date.now();
        }
      }
    }
  }

  private static performCacheOptimization(name: string, cache: any): void {
    console.log(`🔧 Optimizing cache: ${name}`);
    // Clear low-priority, rarely accessed items
    // This would be implemented based on cache-specific logic
    cache.optimizeEntries?.();
  }

  public static getCache(name: string): LRUCache<any> | null {
    return this.instances.get(name) || null;
  }

  public static removeCache(name: string): boolean {
    return this.instances.delete(name);
  }

  public static getAllCaches(): Map<string, LRUCache<any>> {
    return new Map(this.instances);
  }
}

interface CachePerformanceMetrics {
  averageResponseTime: number;
  hitRateTrend: number[];
  memoryEfficiency: number;
  lastOptimization: number;
}

/**
 * Singleton instances for common cache types
 */
export const fragmentCache = CacheFactory.createFragmentCache('fragments', {
  maxSize: 300, // Reduced for memory optimization
  ttl: 1800000, // 30 minutes
  evictionPolicy: 'priority-aware'
});

export const assemblyCache = CacheFactory.createFragmentCache('assembly-results', {
  maxSize: 100, // Reduced for memory optimization
  ttl: 900000, // 15 minutes
  evictionPolicy: 'priority-aware'
});