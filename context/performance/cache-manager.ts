/**
 * Context Cache Manager
 * High-performance caching for context engineering
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ContextContent, AssembledContext } from '../types/context.types';

export interface CacheEntry {
  key: string;
  content: any;
  metadata: {
    created: number;
    accessed: number;
    hits: number;
    size: number;
    ttl: number;
  };
}

export interface CacheOptions {
  maxSize: number; // Max cache size in MB
  ttl: number; // Time to live in milliseconds
  persistToDisk: boolean;
  compressionEnabled: boolean;
}

export interface CacheStatistics {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  entries: number;
  evictions: number;
}

export class ContextCacheManager {
  private memoryCache: Map<string, CacheEntry>;
  private statistics: CacheStatistics;
  private readonly cacheDir: string;
  private readonly options: CacheOptions;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor(projectRoot: string, options?: Partial<CacheOptions>) {
    this.memoryCache = new Map();
    this.cacheDir = path.join(projectRoot, '.vibe', 'cache');
    
    this.options = {
      maxSize: 50, // 50MB default
      ttl: 15 * 60 * 1000, // 15 minutes default
      persistToDisk: true,
      compressionEnabled: true,
      ...options
    };
    
    this.statistics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
      entries: 0,
      evictions: 0
    };
    
    this.initialize();
  }

  /**
   * Initialize cache system
   */
  private initialize(): void {
    // Create cache directory if needed
    if (this.options.persistToDisk && !fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    
    // Load persisted cache
    if (this.options.persistToDisk) {
      this.loadPersistedCache();
    }
    
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  /**
   * Get cached context
   */
  async get(key: string): Promise<any | null> {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      this.statistics.misses++;
      return null;
    }
    
    // Check TTL
    const now = Date.now();
    if (now - entry.metadata.created > entry.metadata.ttl) {
      this.memoryCache.delete(key);
      this.statistics.misses++;
      return null;
    }
    
    // Update access metadata
    entry.metadata.accessed = now;
    entry.metadata.hits++;
    
    this.statistics.hits++;
    this.updateHitRate();
    
    return this.decompress(entry.content);
  }

  /**
   * Set cached context
   */
  async set(key: string, content: any, ttl?: number): Promise<void> {
    const compressed = await this.compress(content);
    const size = this.calculateSize(compressed);
    
    // Check if we need to evict entries
    if (this.needsEviction(size)) {
      await this.evictEntries(size);
    }
    
    const entry: CacheEntry = {
      key,
      content: compressed,
      metadata: {
        created: Date.now(),
        accessed: Date.now(),
        hits: 0,
        size,
        ttl: ttl || this.options.ttl
      }
    };
    
    this.memoryCache.set(key, entry);
    this.statistics.entries = this.memoryCache.size;
    this.statistics.size += size;
    
    // Persist to disk if enabled
    if (this.options.persistToDisk) {
      this.persistEntry(key, entry);
    }
  }

  /**
   * Generate cache key for context
   */
  generateKey(params: {
    command: string;
    layers: string[];
    version: string;
    contextHash?: string;
  }): string {
    const components = [
      params.command,
      params.layers.join('-'),
      params.version,
      params.contextHash || ''
    ].filter(Boolean);
    
    return crypto
      .createHash('sha256')
      .update(components.join('|'))
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Cache assembled context
   */
  async cacheContext(
    context: AssembledContext,
    params: any
  ): Promise<string> {
    const key = this.generateKey({
      command: params.command || 'unknown',
      layers: context.layers.map(l => l.type),
      version: context.version,
      contextHash: this.hashContext(context)
    });
    
    await this.set(key, context);
    return key;
  }

  /**
   * Get cached context by parameters
   */
  async getCachedContext(params: any): Promise<AssembledContext | null> {
    // Try multiple key variations
    const keys = [
      // Exact match
      this.generateKey({
        command: params.command,
        layers: params.layers || ['global', 'phase', 'task'],
        version: params.version || '1.0'
      }),
      // Without version
      this.generateKey({
        command: params.command,
        layers: params.layers || ['global', 'phase', 'task'],
        version: ''
      }),
      // Command only
      this.generateKey({
        command: params.command,
        layers: [],
        version: ''
      })
    ];
    
    for (const key of keys) {
      const cached = await this.get(key);
      if (cached) {
        return cached as AssembledContext;
      }
    }
    
    return null;
  }

  /**
   * Invalidate cache entries
   */
  async invalidate(pattern?: string): Promise<number> {
    let invalidated = 0;
    
    if (!pattern) {
      // Clear all
      invalidated = this.memoryCache.size;
      this.memoryCache.clear();
      this.statistics.size = 0;
      this.statistics.entries = 0;
    } else {
      // Clear matching pattern
      const regex = new RegExp(pattern);
      const toDelete: string[] = [];
      
      this.memoryCache.forEach((entry, key) => {
        if (regex.test(key)) {
          toDelete.push(key);
          this.statistics.size -= entry.metadata.size;
        }
      });
      
      toDelete.forEach(key => this.memoryCache.delete(key));
      invalidated = toDelete.length;
      this.statistics.entries = this.memoryCache.size;
    }
    
    // Clear disk cache if enabled
    if (this.options.persistToDisk) {
      await this.clearDiskCache(pattern);
    }
    
    return invalidated;
  }

  /**
   * Warm up cache with common contexts
   */
  async warmup(contexts: Array<{
    key: string;
    context: AssembledContext;
  }>): Promise<void> {
    console.log(`🔥 Warming up cache with ${contexts.length} contexts...`);
    
    for (const { key, context } of contexts) {
      await this.set(key, context, this.options.ttl * 2); // Double TTL for warmed entries
    }
  }

  /**
   * Get cache statistics
   */
  getStatistics(): CacheStatistics {
    return {
      ...this.statistics,
      hitRate: this.statistics.hitRate
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];
    let freedSize = 0;
    
    this.memoryCache.forEach((entry, key) => {
      if (now - entry.metadata.created > entry.metadata.ttl) {
        toDelete.push(key);
        freedSize += entry.metadata.size;
      }
    });
    
    toDelete.forEach(key => {
      this.memoryCache.delete(key);
      if (this.options.persistToDisk) {
        this.removePersistedEntry(key);
      }
    });
    
    if (toDelete.length > 0) {
      this.statistics.evictions += toDelete.length;
      this.statistics.size -= freedSize;
      this.statistics.entries = this.memoryCache.size;
    }
  }

  /**
   * Check if eviction is needed
   */
  private needsEviction(newSize: number): boolean {
    const maxSizeBytes = this.options.maxSize * 1024 * 1024;
    return (this.statistics.size + newSize) > maxSizeBytes;
  }

  /**
   * Evict entries using LRU strategy
   */
  private async evictEntries(requiredSize: number): Promise<void> {
    const maxSizeBytes = this.options.maxSize * 1024 * 1024;
    const targetSize = maxSizeBytes * 0.7; // Free up to 70% capacity
    
    // Sort by least recently accessed
    const entries = Array.from(this.memoryCache.entries())
      .sort((a, b) => a[1].metadata.accessed - b[1].metadata.accessed);
    
    let freedSize = 0;
    const toEvict: string[] = [];
    
    for (const [key, entry] of entries) {
      if (this.statistics.size - freedSize <= targetSize) {
        break;
      }
      
      toEvict.push(key);
      freedSize += entry.metadata.size;
    }
    
    // Evict entries
    toEvict.forEach(key => {
      this.memoryCache.delete(key);
      if (this.options.persistToDisk) {
        this.removePersistedEntry(key);
      }
    });
    
    this.statistics.evictions += toEvict.length;
    this.statistics.size -= freedSize;
    this.statistics.entries = this.memoryCache.size;
  }

  /**
   * Compress content if enabled
   */
  private async compress(content: any): Promise<any> {
    if (!this.options.compressionEnabled) {
      return content;
    }
    
    // Simple compression: JSON stringify with no whitespace
    if (typeof content === 'object') {
      return JSON.stringify(content);
    }
    
    return content;
  }

  /**
   * Decompress content if needed
   */
  private async decompress(content: any): Promise<any> {
    if (!this.options.compressionEnabled) {
      return content;
    }
    
    // Decompress JSON
    if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
      try {
        return JSON.parse(content);
      } catch {
        return content;
      }
    }
    
    return content;
  }

  /**
   * Calculate size of content
   */
  private calculateSize(content: any): number {
    if (typeof content === 'string') {
      return Buffer.byteLength(content, 'utf8');
    }
    
    return Buffer.byteLength(JSON.stringify(content), 'utf8');
  }

  /**
   * Hash context for cache key
   */
  private hashContext(context: AssembledContext): string {
    const content = context.layers.map(l => l.content).join('|');
    return crypto
      .createHash('md5')
      .update(content)
      .digest('hex')
      .substring(0, 8);
  }

  /**
   * Update hit rate statistics
   */
  private updateHitRate(): void {
    const total = this.statistics.hits + this.statistics.misses;
    this.statistics.hitRate = total > 0 ? (this.statistics.hits / total) * 100 : 0;
  }

  /**
   * Persist cache entry to disk
   */
  private async persistEntry(key: string, entry: CacheEntry): Promise<void> {
    const filePath = path.join(this.cacheDir, `${key}.cache`);
    
    try {
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(entry),
        'utf8'
      );
    } catch (error) {
      console.warn(`Failed to persist cache entry ${key}:`, error);
    }
  }

  /**
   * Remove persisted cache entry
   */
  private async removePersistedEntry(key: string): Promise<void> {
    const filePath = path.join(this.cacheDir, `${key}.cache`);
    
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // Ignore errors
    }
  }

  /**
   * Load persisted cache from disk
   */
  private async loadPersistedCache(): Promise<void> {
    if (!fs.existsSync(this.cacheDir)) {
      return;
    }
    
    try {
      const files = await fs.promises.readdir(this.cacheDir);
      const cacheFiles = files.filter(f => f.endsWith('.cache'));
      
      for (const file of cacheFiles) {
        try {
          const content = await fs.promises.readFile(
            path.join(this.cacheDir, file),
            'utf8'
          );
          
          const entry = JSON.parse(content) as CacheEntry;
          const key = path.basename(file, '.cache');
          
          // Check if still valid
          const now = Date.now();
          if (now - entry.metadata.created <= entry.metadata.ttl) {
            this.memoryCache.set(key, entry);
            this.statistics.size += entry.metadata.size;
          } else {
            // Remove expired entry
            await this.removePersistedEntry(key);
          }
        } catch {
          // Skip invalid entries
        }
      }
      
      this.statistics.entries = this.memoryCache.size;
      
    } catch (error) {
      console.warn('Failed to load persisted cache:', error);
    }
  }

  /**
   * Clear disk cache
   */
  private async clearDiskCache(pattern?: string): Promise<void> {
    if (!fs.existsSync(this.cacheDir)) {
      return;
    }
    
    try {
      const files = await fs.promises.readdir(this.cacheDir);
      const cacheFiles = files.filter(f => f.endsWith('.cache'));
      
      for (const file of cacheFiles) {
        if (!pattern || new RegExp(pattern).test(file)) {
          await fs.promises.unlink(path.join(this.cacheDir, file));
        }
      }
    } catch (error) {
      console.warn('Failed to clear disk cache:', error);
    }
  }

  /**
   * Destroy cache manager
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.memoryCache.clear();
  }
}