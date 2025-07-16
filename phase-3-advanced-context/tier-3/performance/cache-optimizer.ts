/**
 * Cache Optimizer
 * Phase 3: Advanced Context Features - Tier 3.2
 * 
 * Advanced caching system with multiple strategies (LRU, LFU, FIFO, Adaptive),
 * intelligent cache warming, compression, and performance analytics.
 */

export interface CacheConfig {
    maxSize: number;
    ttl: number;
    strategy: 'lru' | 'lfu' | 'fifo' | 'adaptive';
    enableCompression: boolean;
    memoryThreshold: number;
    warmupEnabled: boolean;
    analyticsEnabled: boolean;
}

export interface CacheEntry<T = any> {
    key: string;
    value: T;
    timestamp: number;
    lastAccessed: number;
    accessCount: number;
    size: number;
    compressed: boolean;
    metadata: CacheEntryMetadata;
}

export interface CacheEntryMetadata {
    source: string;
    priority: number;
    tags: string[];
    dependencies: string[];
    version: number;
}

export interface CacheStats {
    hits: number;
    misses: number;
    evictions: number;
    compressionRatio: number;
    memoryUsage: number;
    hitRate: number;
    averageAccessTime: number;
    totalEntries: number;
    strategyEfficiency: number;
}

export interface CacheOptimizationResult {
    improvement: number;
    oldStrategy: string;
    newStrategy: string;
    changes: CacheOptimizationChange[];
    stats: CacheStats;
    recommendations: string[];
}

export interface CacheOptimizationChange {
    type: 'strategy' | 'size' | 'ttl' | 'compression';
    description: string;
    impact: number;
    before: any;
    after: any;
}

interface CacheAccessPattern {
    key: string;
    frequency: number;
    recency: number;
    size: number;
    pattern: 'sequential' | 'random' | 'temporal';
}

export class CacheOptimizer {
    private cache: Map<string, CacheEntry> = new Map();
    private accessHistory: Map<string, number[]> = new Map();
    private stats: CacheStats;
    private config: CacheConfig;
    private compressionCache: Map<string, { compressed: string; ratio: number }> = new Map();
    private warmupQueue: Set<string> = new Set();
    private optimizationHistory: CacheOptimizationResult[] = [];

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            maxSize: config.maxSize || 1000,
            ttl: config.ttl || 3600000, // 1 hour
            strategy: config.strategy || 'adaptive',
            enableCompression: config.enableCompression || true,
            memoryThreshold: config.memoryThreshold || 0.8,
            warmupEnabled: config.warmupEnabled || true,
            analyticsEnabled: config.analyticsEnabled || true,
            ...config
        };

        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
            compressionRatio: 0,
            memoryUsage: 0,
            hitRate: 0,
            averageAccessTime: 0,
            totalEntries: 0,
            strategyEfficiency: 0
        };

        this.initializeCacheOptimizer();
        console.log('💾 Cache Optimizer initialized with', this.config.strategy, 'strategy');
    }

    /**
     * Get cached value
     */
    async get<T>(key: string): Promise<T | null> {
        const startTime = Date.now();
        
        try {
            const entry = this.cache.get(key);
            
            if (!entry) {
                this.stats.misses++;
                this.updateHitRate();
                return null;
            }

            // Check TTL
            if (this.isExpired(entry)) {
                this.cache.delete(key);
                this.stats.misses++;
                this.updateHitRate();
                return null;
            }

            // Update access patterns
            this.updateAccessPattern(key);
            
            // Update entry statistics
            entry.lastAccessed = Date.now();
            entry.accessCount++;

            this.stats.hits++;
            this.updateHitRate();
            
            // Decompress if needed
            let value = entry.value;
            if (entry.compressed && this.config.enableCompression) {
                value = await this.decompress(entry.value);
            }

            // Record access time
            const accessTime = Date.now() - startTime;
            this.updateAverageAccessTime(accessTime);

            return value as T;

        } catch (error) {
            console.error(`❌ Cache get error for key ${key}:`, error);
            this.stats.misses++;
            this.updateHitRate();
            return null;
        }
    }

    /**
     * Set cached value
     */
    async set<T>(
        key: string, 
        value: T, 
        metadata: Partial<CacheEntryMetadata> = {}
    ): Promise<boolean> {
        try {
            // Check if we need to evict entries
            if (this.cache.size >= this.config.maxSize) {
                await this.evictEntries();
            }

            // Compress if enabled and beneficial
            let finalValue = value;
            let compressed = false;
            let size = this.calculateSize(value);

            if (this.config.enableCompression && this.shouldCompress(value)) {
                const compressionResult = await this.compress(value);
                if (compressionResult.ratio > 0.3) { // Only use if compression saves 30%+
                    finalValue = compressionResult.compressed as T;
                    compressed = true;
                    size = this.calculateSize(finalValue);
                }
            }

            const entry: CacheEntry<T> = {
                key,
                value: finalValue,
                timestamp: Date.now(),
                lastAccessed: Date.now(),
                accessCount: 0,
                size,
                compressed,
                metadata: {
                    source: metadata.source || 'default',
                    priority: metadata.priority || 1,
                    tags: metadata.tags || [],
                    dependencies: metadata.dependencies || [],
                    version: metadata.version || 1
                }
            };

            this.cache.set(key, entry);
            this.updateMemoryUsage();
            this.stats.totalEntries = this.cache.size;

            // Update access history
            this.initializeAccessHistory(key);

            console.log(`💾 Cached ${key} (${compressed ? 'compressed' : 'uncompressed'}, ${size} bytes)`);
            return true;

        } catch (error) {
            console.error(`❌ Cache set error for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Remove cached value
     */
    async delete(key: string): Promise<boolean> {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.accessHistory.delete(key);
            this.updateMemoryUsage();
            this.stats.totalEntries = this.cache.size;
        }
        return deleted;
    }

    /**
     * Clear entire cache
     */
    async clearCache(): Promise<void> {
        this.cache.clear();
        this.accessHistory.clear();
        this.compressionCache.clear();
        this.warmupQueue.clear();
        this.updateMemoryUsage();
        this.stats.totalEntries = 0;
        console.log('🧹 Cache cleared');
    }

    /**
     * Optimize cache performance
     */
    async optimizeCache(): Promise<CacheOptimizationResult> {
        console.log('🚀 Starting cache optimization');
        
        const startTime = Date.now();
        const oldStrategy = this.config.strategy;
        const oldStats = { ...this.stats };
        const changes: CacheOptimizationChange[] = [];

        try {
            // Analyze current performance
            const accessPatterns = await this.analyzeAccessPatterns();
            const memoryUsage = await this.analyzeMemoryUsage();
            
            // Determine optimal strategy
            const optimalStrategy = await this.determineOptimalStrategy(accessPatterns);
            
            if (optimalStrategy !== this.config.strategy) {
                await this.switchStrategy(optimalStrategy);
                changes.push({
                    type: 'strategy',
                    description: `Switched from ${oldStrategy} to ${optimalStrategy}`,
                    impact: 0.2,
                    before: oldStrategy,
                    after: optimalStrategy
                });
            }

            // Optimize cache size
            const optimalSize = await this.determineOptimalSize(accessPatterns, memoryUsage);
            if (Math.abs(optimalSize - this.config.maxSize) > this.config.maxSize * 0.1) {
                const oldSize = this.config.maxSize;
                this.config.maxSize = optimalSize;
                changes.push({
                    type: 'size',
                    description: `Adjusted cache size from ${oldSize} to ${optimalSize}`,
                    impact: 0.15,
                    before: oldSize,
                    after: optimalSize
                });
            }

            // Optimize TTL
            const optimalTTL = await this.determineOptimalTTL(accessPatterns);
            if (Math.abs(optimalTTL - this.config.ttl) > this.config.ttl * 0.2) {
                const oldTTL = this.config.ttl;
                this.config.ttl = optimalTTL;
                changes.push({
                    type: 'ttl',
                    description: `Adjusted TTL from ${oldTTL}ms to ${optimalTTL}ms`,
                    impact: 0.1,
                    before: oldTTL,
                    after: optimalTTL
                });
            }

            // Optimize compression
            const compressionOptimization = await this.optimizeCompression();
            if (compressionOptimization.improvement > 0) {
                changes.push({
                    type: 'compression',
                    description: 'Optimized compression settings',
                    impact: compressionOptimization.improvement,
                    before: compressionOptimization.before,
                    after: compressionOptimization.after
                });
            }

            // Calculate overall improvement
            const newStats = this.getStats();
            const improvement = this.calculateImprovement(oldStats, newStats);

            // Generate recommendations
            const recommendations = await this.generateOptimizationRecommendations(
                accessPatterns,
                memoryUsage
            );

            const result: CacheOptimizationResult = {
                improvement,
                oldStrategy,
                newStrategy: this.config.strategy,
                changes,
                stats: newStats,
                recommendations
            };

            // Store optimization history
            this.optimizationHistory.push(result);
            if (this.optimizationHistory.length > 10) {
                this.optimizationHistory.shift();
            }

            const processingTime = Date.now() - startTime;
            console.log(`✅ Cache optimization completed in ${processingTime}ms (${(improvement * 100).toFixed(1)}% improvement)`);

            return result;

        } catch (error) {
            console.error(`❌ Cache optimization failed: ${error}`);
            return {
                improvement: 0,
                oldStrategy,
                newStrategy: this.config.strategy,
                changes: [],
                stats: this.getStats(),
                recommendations: [`Optimization failed: ${error.message}`]
            };
        }
    }

    /**
     * Warm up cache with predicted entries
     */
    async warmupCache(keys: string[]): Promise<void> {
        if (!this.config.warmupEnabled) return;
        
        console.log(`🔥 Warming up cache with ${keys.length} keys`);
        
        for (const key of keys) {
            this.warmupQueue.add(key);
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): CacheStats {
        this.updateStrategyEfficiency();
        return { ...this.stats };
    }

    /**
     * Get cache configuration
     */
    getConfig(): CacheConfig {
        return { ...this.config };
    }

    /**
     * Update cache configuration
     */
    updateConfig(newConfig: Partial<CacheConfig>): void {
        this.config = { ...this.config, ...newConfig };
        console.log('⚙️ Cache configuration updated');
    }

    // Private methods
    private initializeCacheOptimizer(): void {
        // Start periodic optimization if analytics enabled
        if (this.config.analyticsEnabled) {
            setInterval(() => {
                this.updateStats();
            }, 60000); // Update stats every minute
        }

        // Start memory monitoring
        setInterval(() => {
            this.checkMemoryThreshold();
        }, 30000); // Check every 30 seconds
    }

    private isExpired(entry: CacheEntry): boolean {
        return Date.now() - entry.timestamp > this.config.ttl;
    }

    private async evictEntries(): Promise<void> {
        const evictionCount = Math.ceil(this.config.maxSize * 0.1); // Evict 10%
        
        switch (this.config.strategy) {
            case 'lru':
                await this.evictLRU(evictionCount);
                break;
            case 'lfu':
                await this.evictLFU(evictionCount);
                break;
            case 'fifo':
                await this.evictFIFO(evictionCount);
                break;
            case 'adaptive':
                await this.evictAdaptive(evictionCount);
                break;
        }
        
        this.stats.evictions += evictionCount;
    }

    private async evictLRU(count: number): Promise<void> {
        const entries = Array.from(this.cache.entries())
            .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
            .slice(0, count);
        
        for (const [key] of entries) {
            this.cache.delete(key);
            this.accessHistory.delete(key);
        }
    }

    private async evictLFU(count: number): Promise<void> {
        const entries = Array.from(this.cache.entries())
            .sort(([, a], [, b]) => a.accessCount - b.accessCount)
            .slice(0, count);
        
        for (const [key] of entries) {
            this.cache.delete(key);
            this.accessHistory.delete(key);
        }
    }

    private async evictFIFO(count: number): Promise<void> {
        const entries = Array.from(this.cache.entries())
            .sort(([, a], [, b]) => a.timestamp - b.timestamp)
            .slice(0, count);
        
        for (const [key] of entries) {
            this.cache.delete(key);
            this.accessHistory.delete(key);
        }
    }

    private async evictAdaptive(count: number): Promise<void> {
        // Adaptive strategy combines LRU and LFU based on access patterns
        const entries = Array.from(this.cache.entries()).map(([key, entry]) => {
            const recencyScore = (Date.now() - entry.lastAccessed) / this.config.ttl;
            const frequencyScore = 1 / (entry.accessCount + 1);
            const adaptiveScore = recencyScore * 0.6 + frequencyScore * 0.4;
            
            return { key, entry, score: adaptiveScore };
        });

        entries.sort((a, b) => b.score - a.score);
        
        for (let i = 0; i < count && i < entries.length; i++) {
            const { key } = entries[i];
            this.cache.delete(key);
            this.accessHistory.delete(key);
        }
    }

    private shouldCompress(value: any): boolean {
        const size = this.calculateSize(value);
        return size > 1024; // Compress values larger than 1KB
    }

    private async compress(value: any): Promise<{ compressed: string; ratio: number }> {
        const original = JSON.stringify(value);
        const originalSize = original.length;
        
        // Simple compression simulation (in production, use actual compression)
        const compressed = btoa(original);
        const compressedSize = compressed.length;
        const ratio = 1 - (compressedSize / originalSize);
        
        return { compressed, ratio };
    }

    private async decompress(compressed: string): Promise<any> {
        try {
            const decompressed = atob(compressed);
            return JSON.parse(decompressed);
        } catch (error) {
            console.error('Decompression failed:', error);
            return compressed;
        }
    }

    private calculateSize(value: any): number {
        return JSON.stringify(value).length;
    }

    private updateAccessPattern(key: string): void {
        if (!this.accessHistory.has(key)) {
            this.accessHistory.set(key, []);
        }
        
        const history = this.accessHistory.get(key)!;
        history.push(Date.now());
        
        // Keep only recent history
        if (history.length > 100) {
            history.shift();
        }
    }

    private initializeAccessHistory(key: string): void {
        if (!this.accessHistory.has(key)) {
            this.accessHistory.set(key, [Date.now()]);
        }
    }

    private updateHitRate(): void {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }

    private updateAverageAccessTime(accessTime: number): void {
        const total = this.stats.hits + this.stats.misses;
        this.stats.averageAccessTime = 
            (this.stats.averageAccessTime * (total - 1) + accessTime) / total;
    }

    private updateMemoryUsage(): void {
        let totalSize = 0;
        for (const entry of this.cache.values()) {
            totalSize += entry.size;
        }
        this.stats.memoryUsage = totalSize;
    }

    private updateStats(): void {
        this.updateMemoryUsage();
        this.stats.totalEntries = this.cache.size;
        
        // Update compression ratio
        const compressedEntries = Array.from(this.cache.values()).filter(e => e.compressed);
        this.stats.compressionRatio = compressedEntries.length / this.cache.size;
    }

    private updateStrategyEfficiency(): void {
        // Calculate strategy efficiency based on hit rate and access patterns
        const hitRate = this.stats.hitRate;
        const avgAccessTime = this.stats.averageAccessTime;
        
        // Simple efficiency calculation (could be more sophisticated)
        this.stats.strategyEfficiency = hitRate * 0.7 + (1 / (avgAccessTime + 1)) * 0.3;
    }

    private checkMemoryThreshold(): void {
        const memoryUsageRatio = this.stats.memoryUsage / (this.config.maxSize * 1024); // Assume 1KB avg per entry
        
        if (memoryUsageRatio > this.config.memoryThreshold) {
            console.warn('⚠️ Cache memory threshold exceeded, triggering cleanup');
            this.evictEntries();
        }
    }

    private async analyzeAccessPatterns(): Promise<CacheAccessPattern[]> {
        const patterns: CacheAccessPattern[] = [];
        
        for (const [key, entry] of this.cache.entries()) {
            const history = this.accessHistory.get(key) || [];
            const frequency = entry.accessCount;
            const recency = (Date.now() - entry.lastAccessed) / this.config.ttl;
            
            // Determine access pattern
            let pattern: 'sequential' | 'random' | 'temporal' = 'random';
            if (history.length > 2) {
                const intervals = [];
                for (let i = 1; i < history.length; i++) {
                    intervals.push(history[i] - history[i-1]);
                }
                
                const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
                const variance = intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) / intervals.length;
                
                if (variance < avgInterval * 0.1) {
                    pattern = 'temporal'; // Regular intervals
                } else if (variance > avgInterval * 2) {
                    pattern = 'random'; // Highly variable
                } else {
                    pattern = 'sequential'; // Moderate variance
                }
            }
            
            patterns.push({
                key,
                frequency,
                recency,
                size: entry.size,
                pattern
            });
        }
        
        return patterns;
    }

    private async analyzeMemoryUsage(): Promise<{
        totalUsage: number;
        compressionSavings: number;
        largestEntries: string[];
        fragmentationRatio: number;
    }> {
        let totalUsage = 0;
        let compressionSavings = 0;
        const entrySizes: Array<{ key: string; size: number }> = [];
        
        for (const [key, entry] of this.cache.entries()) {
            totalUsage += entry.size;
            entrySizes.push({ key, size: entry.size });
            
            if (entry.compressed) {
                // Estimate compression savings (simplified)
                compressionSavings += entry.size * 0.3;
            }
        }
        
        entrySizes.sort((a, b) => b.size - a.size);
        const largestEntries = entrySizes.slice(0, 10).map(e => e.key);
        
        // Simple fragmentation calculation
        const fragmentationRatio = this.cache.size > 0 ? totalUsage / (this.cache.size * 100) : 0;
        
        return {
            totalUsage,
            compressionSavings,
            largestEntries,
            fragmentationRatio
        };
    }

    private async determineOptimalStrategy(patterns: CacheAccessPattern[]): Promise<'lru' | 'lfu' | 'fifo' | 'adaptive'> {
        // Analyze patterns to determine best strategy
        const temporalCount = patterns.filter(p => p.pattern === 'temporal').length;
        const randomCount = patterns.filter(p => p.pattern === 'random').length;
        const sequentialCount = patterns.filter(p => p.pattern === 'sequential').length;
        
        const highFrequencyCount = patterns.filter(p => p.frequency > 10).length;
        const recentAccessCount = patterns.filter(p => p.recency < 0.1).length;
        
        // Decision logic
        if (temporalCount > patterns.length * 0.5) {
            return 'lru'; // Temporal patterns benefit from LRU
        } else if (highFrequencyCount > patterns.length * 0.3) {
            return 'lfu'; // High frequency patterns benefit from LFU
        } else if (randomCount > patterns.length * 0.6) {
            return 'fifo'; // Random patterns may benefit from simple FIFO
        } else {
            return 'adaptive'; // Mixed patterns benefit from adaptive strategy
        }
    }

    private async determineOptimalSize(
        patterns: CacheAccessPattern[],
        memoryUsage: any
    ): Promise<number> {
        const activePatterns = patterns.filter(p => p.recency < 0.5);
        const optimalSize = Math.max(
            activePatterns.length * 1.5, // 50% buffer
            this.config.maxSize * 0.5,   // At least 50% of current
            100                          // Minimum size
        );
        
        return Math.min(optimalSize, this.config.maxSize * 2); // Max 2x current
    }

    private async determineOptimalTTL(patterns: CacheAccessPattern[]): Promise<number> {
        // Calculate average time between accesses
        const accessIntervals: number[] = [];
        
        for (const pattern of patterns) {
            const history = this.accessHistory.get(pattern.key) || [];
            if (history.length > 1) {
                for (let i = 1; i < history.length; i++) {
                    accessIntervals.push(history[i] - history[i-1]);
                }
            }
        }
        
        if (accessIntervals.length === 0) return this.config.ttl;
        
        const avgInterval = accessIntervals.reduce((sum, interval) => sum + interval, 0) / accessIntervals.length;
        
        // TTL should be 2-3x average access interval
        const optimalTTL = avgInterval * 2.5;
        
        return Math.max(
            Math.min(optimalTTL, this.config.ttl * 2),
            this.config.ttl * 0.5
        );
    }

    private async optimizeCompression(): Promise<{
        improvement: number;
        before: any;
        after: any;
    }> {
        const sizesBeforeOptimization = Array.from(this.cache.values()).map(e => e.size);
        const totalSizeBefore = sizesBeforeOptimization.reduce((sum, size) => sum + size, 0);
        
        // Analyze compression effectiveness
        let improvementCount = 0;
        let totalEntries = 0;
        
        for (const [key, entry] of this.cache.entries()) {
            if (!entry.compressed && this.shouldCompress(entry.value)) {
                const compressionResult = await this.compress(entry.value);
                if (compressionResult.ratio > 0.2) {
                    // Recompress with better ratio
                    entry.value = compressionResult.compressed;
                    entry.compressed = true;
                    entry.size = this.calculateSize(entry.value);
                    improvementCount++;
                }
            }
            totalEntries++;
        }
        
        const sizesAfterOptimization = Array.from(this.cache.values()).map(e => e.size);
        const totalSizeAfter = sizesAfterOptimization.reduce((sum, size) => sum + size, 0);
        
        const improvement = totalSizeBefore > 0 ? (totalSizeBefore - totalSizeAfter) / totalSizeBefore : 0;
        
        return {
            improvement,
            before: { totalSize: totalSizeBefore, compressed: false },
            after: { totalSize: totalSizeAfter, compressed: true }
        };
    }

    private calculateImprovement(oldStats: CacheStats, newStats: CacheStats): number {
        // Calculate weighted improvement across multiple metrics
        const hitRateImprovement = (newStats.hitRate - oldStats.hitRate) || 0;
        const accessTimeImprovement = oldStats.averageAccessTime > 0 
            ? (oldStats.averageAccessTime - newStats.averageAccessTime) / oldStats.averageAccessTime 
            : 0;
        const memoryImprovement = oldStats.memoryUsage > 0
            ? (oldStats.memoryUsage - newStats.memoryUsage) / oldStats.memoryUsage
            : 0;
        
        return hitRateImprovement * 0.5 + accessTimeImprovement * 0.3 + memoryImprovement * 0.2;
    }

    private async generateOptimizationRecommendations(
        patterns: CacheAccessPattern[],
        memoryUsage: any
    ): Promise<string[]> {
        const recommendations: string[] = [];
        
        if (this.stats.hitRate < 0.8) {
            recommendations.push('Consider increasing cache size to improve hit rate');
        }
        
        if (this.stats.averageAccessTime > 10) {
            recommendations.push('Consider enabling compression to reduce access time');
        }
        
        if (memoryUsage.fragmentationRatio > 0.7) {
            recommendations.push('High fragmentation detected, consider periodic cache cleanup');
        }
        
        const highFrequencyPatterns = patterns.filter(p => p.frequency > 20);
        if (highFrequencyPatterns.length > patterns.length * 0.2) {
            recommendations.push('Consider using LFU strategy for high-frequency access patterns');
        }
        
        if (memoryUsage.compressionSavings > memoryUsage.totalUsage * 0.3) {
            recommendations.push('Enable compression to reduce memory usage significantly');
        }
        
        return recommendations;
    }

    private async switchStrategy(newStrategy: 'lru' | 'lfu' | 'fifo' | 'adaptive'): Promise<void> {
        console.log(`🔄 Switching cache strategy from ${this.config.strategy} to ${newStrategy}`);
        this.config.strategy = newStrategy;
        
        // Strategy change may require cache reorganization
        // For now, we'll just update the configuration
        // In a production system, you might want to rebuild indices or reorder entries
    }
}