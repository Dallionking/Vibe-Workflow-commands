/**
 * Benchmark Framework
 * Phase 3: Advanced Context Features - Tier 3.2
 * 
 * Comprehensive benchmarking system with statistical analysis, performance testing,
 * and detailed reporting based on TypeScript testing patterns.
 */

export interface BenchmarkConfig {
    iterations: number;
    warmupRounds: number;
    collectGCMetrics: boolean;
    reportInterval: number;
    enableProfiling: boolean;
    statisticalAnalysis: boolean;
}

export interface BenchmarkResult {
    name: string;
    iterations: number;
    totalTime: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
    stdDeviation: number;
    throughput: number;
    memoryUsage: number;
    dataset: Dataset;
    metadata: BenchmarkMetadata;
}

export interface BenchmarkMetadata {
    timestamp: Date;
    platform: string;
    nodeVersion: string;
    memoryAvailable: number;
    cpuCores: number;
    gcStats?: GCStats;
}

export interface GCStats {
    collections: number;
    totalTime: number;
    averageTime: number;
    heapSizeBefore: number;
    heapSizeAfter: number;
}

export interface BenchmarkSuite {
    name: string;
    description: string;
    benchmarks: Map<string, BenchmarkFunction>;
    setup?: () => Promise<void>;
    teardown?: () => Promise<void>;
}

export interface BenchmarkFunction {
    name: string;
    description: string;
    fn: (benchmark: BenchmarkRunner) => Promise<void> | void;
    beforeEach?: () => Promise<void>;
    afterEach?: () => Promise<void>;
}

export interface BenchmarkRunner {
    iterations: number;
    addTimingFor(name: string, timing: number): void;
    recordMemoryUsage(usage: number): void;
    recordThroughput(operations: number, timeMs: number): void;
    startTimer(): Timer;
    benchmark(name: string, fn: () => void): void;
}

export class Dataset {
    public data: number[] = [];

    public add(value: number): void {
        this.data.push(value);
    }

    public mean(): number {
        if (this.data.length === 0) return 0;
        const sum = this.data.reduce((acc, val) => acc + val, 0);
        return sum / this.data.length;
    }

    public min(): number {
        if (this.data.length === 0) return 0;
        return Math.min(...this.data);
    }

    public max(): number {
        if (this.data.length === 0) return 0;
        return Math.max(...this.data);
    }

    public stdDev(): number {
        if (this.data.length === 0) return 0;
        const mean = this.mean();
        const sumOfSquares = this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
        return Math.sqrt(sumOfSquares / this.data.length);
    }

    public median(): number {
        if (this.data.length === 0) return 0;
        const sorted = [...this.data].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 === 0) {
            return (sorted[middle - 1] + sorted[middle]) / 2;
        } else {
            return sorted[middle];
        }
    }

    public percentile(p: number): number {
        if (this.data.length === 0) return 0;
        const sorted = [...this.data].sort((a, b) => a - b);
        const index = (p / 100) * (sorted.length - 1);
        
        if (index % 1 === 0) {
            return sorted[index];
        } else {
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index - lower;
            return sorted[lower] * (1 - weight) + sorted[upper] * weight;
        }
    }

    public variance(): number {
        if (this.data.length === 0) return 0;
        const mean = this.mean();
        return this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / this.data.length;
    }

    public getStatistics(): {
        mean: number;
        median: number;
        min: number;
        max: number;
        stdDev: number;
        variance: number;
        p95: number;
        p99: number;
        count: number;
    } {
        return {
            mean: this.mean(),
            median: this.median(),
            min: this.min(),
            max: this.max(),
            stdDev: this.stdDev(),
            variance: this.variance(),
            p95: this.percentile(95),
            p99: this.percentile(99),
            count: this.data.length
        };
    }
}

export class Timer {
    private startTime: number = 0;
    private endTime: number = 0;
    public time: number = 0;

    public start(): void {
        this.time = 0;
        this.startTime = this.now();
    }

    public end(): void {
        this.endTime = this.now();
        this.time = this.endTime - this.startTime;
    }

    public getElapsed(): number {
        return this.time;
    }

    public getElapsedMs(): number {
        return this.time / 1000000; // Convert nanoseconds to milliseconds
    }

    private now(): number {
        // Use high-resolution timer if available
        if (typeof process !== 'undefined' && process.hrtime) {
            const hrtime = process.hrtime();
            return hrtime[0] * 1000000000 + hrtime[1]; // Convert to nanoseconds
        }
        return Date.now() * 1000000; // Convert milliseconds to nanoseconds
    }
}

export class BenchmarkFramework {
    private config: BenchmarkConfig;
    private suites: Map<string, BenchmarkSuite> = new Map();
    private results: Map<string, BenchmarkResult> = new Map();
    private isRunning = false;

    constructor(config: BenchmarkConfig) {
        this.config = config;
        this.initializeBuiltInBenchmarks();
        console.log('📊 Benchmark Framework initialized');
    }

    /**
     * Add benchmark suite
     */
    addSuite(suite: BenchmarkSuite): void {
        this.suites.set(suite.name, suite);
        console.log(`✅ Added benchmark suite: ${suite.name}`);
    }

    /**
     * Add individual benchmark
     */
    addBenchmark(suiteName: string, benchmark: BenchmarkFunction): void {
        const suite = this.suites.get(suiteName);
        if (!suite) {
            throw new Error(`Suite ${suiteName} not found`);
        }
        
        suite.benchmarks.set(benchmark.name, benchmark);
        console.log(`✅ Added benchmark: ${benchmark.name} to suite: ${suiteName}`);
    }

    /**
     * Run comprehensive benchmark
     */
    async runComprehensiveBenchmark(): Promise<BenchmarkResult> {
        console.log('🚀 Running comprehensive benchmark suite');
        
        if (this.isRunning) {
            throw new Error('Benchmark already running');
        }

        this.isRunning = true;
        
        try {
            const allResults: BenchmarkResult[] = [];

            // Run all suites
            for (const [suiteName, suite] of this.suites.entries()) {
                console.log(`📋 Running suite: ${suiteName}`);
                
                // Suite setup
                if (suite.setup) {
                    await suite.setup();
                }

                // Run each benchmark in the suite
                for (const [benchmarkName, benchmark] of suite.benchmarks.entries()) {
                    const result = await this.runSingleBenchmark(
                        `${suiteName}.${benchmarkName}`,
                        benchmark
                    );
                    allResults.push(result);
                }

                // Suite teardown
                if (suite.teardown) {
                    await suite.teardown();
                }
            }

            // Combine results
            const combinedResult = this.combineResults('comprehensive', allResults);
            this.results.set('comprehensive', combinedResult);
            
            return combinedResult;

        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Run specific benchmark
     */
    async runBenchmark(name: string): Promise<BenchmarkResult> {
        console.log(`🎯 Running benchmark: ${name}`);
        
        if (this.isRunning) {
            throw new Error('Benchmark already running');
        }

        this.isRunning = true;
        
        try {
            // Find benchmark in suites
            for (const [suiteName, suite] of this.suites.entries()) {
                const benchmark = suite.benchmarks.get(name);
                if (benchmark) {
                    const result = await this.runSingleBenchmark(
                        `${suiteName}.${name}`,
                        benchmark
                    );
                    this.results.set(name, result);
                    return result;
                }
            }

            throw new Error(`Benchmark ${name} not found`);

        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Run quick benchmark for monitoring
     */
    async runQuickBenchmark(): Promise<BenchmarkResult> {
        const quickConfig = {
            ...this.config,
            iterations: 10,
            warmupRounds: 2
        };

        const originalConfig = this.config;
        this.config = quickConfig;

        try {
            return await this.runBenchmark('context_loading');
        } finally {
            this.config = originalConfig;
        }
    }

    /**
     * Get benchmark results
     */
    getResults(): Map<string, BenchmarkResult> {
        return new Map(this.results);
    }

    /**
     * Get specific result
     */
    getResult(name: string): BenchmarkResult | undefined {
        return this.results.get(name);
    }

    /**
     * Clear results
     */
    clearResults(): void {
        this.results.clear();
        console.log('🧹 Benchmark results cleared');
    }

    /**
     * Export results
     */
    exportResults(): { [key: string]: any } {
        const exported: { [key: string]: any } = {};
        
        for (const [name, result] of this.results.entries()) {
            exported[name] = {
                ...result,
                dataset: result.dataset.getStatistics()
            };
        }
        
        return exported;
    }

    // Private methods
    private async runSingleBenchmark(
        name: string,
        benchmark: BenchmarkFunction
    ): Promise<BenchmarkResult> {
        const dataset = new Dataset();
        const timer = new Timer();
        const results: { [key: string]: Dataset } = {};
        let totalMemoryUsage = 0;
        let totalThroughput = 0;
        let throughputCount = 0;

        const runner: BenchmarkRunner = {
            iterations: this.config.iterations,
            addTimingFor: (timingName: string, timing: number) => {
                if (!results[timingName]) {
                    results[timingName] = new Dataset();
                }
                results[timingName].add(timing);
            },
            recordMemoryUsage: (usage: number) => {
                totalMemoryUsage += usage;
            },
            recordThroughput: (operations: number, timeMs: number) => {
                totalThroughput += operations / (timeMs / 1000);
                throughputCount++;
            },
            startTimer: () => {
                const t = new Timer();
                t.start();
                return t;
            },
            benchmark: (subName: string, fn: () => void) => {
                const t = timer.startTimer();
                fn();
                t.end();
                this.addTimingFor(subName, t.getElapsedMs());
            }
        };

        // Warmup rounds
        for (let i = 0; i < this.config.warmupRounds; i++) {
            if (benchmark.beforeEach) {
                await benchmark.beforeEach();
            }
            
            await benchmark.fn(runner);
            
            if (benchmark.afterEach) {
                await benchmark.afterEach();
            }
        }

        // Actual benchmark runs
        for (let i = 0; i < this.config.iterations; i++) {
            if (benchmark.beforeEach) {
                await benchmark.beforeEach();
            }

            // Force garbage collection if available
            if (global.gc && this.config.collectGCMetrics) {
                global.gc();
            }

            // Record memory before
            const memoryBefore = this.getMemoryUsage();

            timer.start();
            await benchmark.fn(runner);
            timer.end();

            // Record memory after
            const memoryAfter = this.getMemoryUsage();
            totalMemoryUsage += memoryAfter - memoryBefore;

            dataset.add(timer.getElapsedMs());

            if (benchmark.afterEach) {
                await benchmark.afterEach();
            }
        }

        // Calculate statistics
        const totalTime = dataset.data.reduce((sum, time) => sum + time, 0);
        const averageTime = dataset.mean();
        const minTime = dataset.min();
        const maxTime = dataset.max();
        const stdDeviation = dataset.stdDev();
        const averageMemoryUsage = totalMemoryUsage / this.config.iterations;
        const averageThroughput = throughputCount > 0 ? totalThroughput / throughputCount : 0;

        const result: BenchmarkResult = {
            name,
            iterations: this.config.iterations,
            totalTime,
            averageTime,
            minTime,
            maxTime,
            stdDeviation,
            throughput: averageThroughput,
            memoryUsage: averageMemoryUsage,
            dataset,
            metadata: {
                timestamp: new Date(),
                platform: process.platform || 'unknown',
                nodeVersion: process.version || 'unknown',
                memoryAvailable: this.getTotalMemory(),
                cpuCores: this.getCpuCores(),
                gcStats: this.config.collectGCMetrics ? this.getGCStats() : undefined
            }
        };

        console.log(`✅ Benchmark ${name} completed: ${averageTime.toFixed(2)}ms avg`);
        return result;
    }

    private combineResults(name: string, results: BenchmarkResult[]): BenchmarkResult {
        if (results.length === 0) {
            throw new Error('No results to combine');
        }

        const combinedDataset = new Dataset();
        let totalTime = 0;
        let totalMemoryUsage = 0;
        let totalThroughput = 0;
        let totalIterations = 0;

        for (const result of results) {
            totalTime += result.totalTime;
            totalMemoryUsage += result.memoryUsage;
            totalThroughput += result.throughput;
            totalIterations += result.iterations;
            
            // Combine datasets
            combinedDataset.data.push(...result.dataset.data);
        }

        return {
            name,
            iterations: totalIterations,
            totalTime,
            averageTime: combinedDataset.mean(),
            minTime: combinedDataset.min(),
            maxTime: combinedDataset.max(),
            stdDeviation: combinedDataset.stdDev(),
            throughput: totalThroughput / results.length,
            memoryUsage: totalMemoryUsage / results.length,
            dataset: combinedDataset,
            metadata: {
                timestamp: new Date(),
                platform: process.platform || 'unknown',
                nodeVersion: process.version || 'unknown',
                memoryAvailable: this.getTotalMemory(),
                cpuCores: this.getCpuCores(),
                gcStats: this.config.collectGCMetrics ? this.getGCStats() : undefined
            }
        };
    }

    private initializeBuiltInBenchmarks(): void {
        // Context loading benchmark suite
        const contextSuite: BenchmarkSuite = {
            name: 'context',
            description: 'Context operations benchmarks',
            benchmarks: new Map([
                ['context_loading', {
                    name: 'context_loading',
                    description: 'Benchmark context loading operations',
                    fn: async (runner) => {
                        const timer = runner.startTimer();
                        
                        // Simulate context loading
                        await this.simulateContextLoading();
                        
                        timer.end();
                        runner.addTimingFor('context_loading', timer.getElapsedMs());
                        runner.recordMemoryUsage(this.getMemoryUsage());
                    }
                }],
                ['context_processing', {
                    name: 'context_processing',
                    description: 'Benchmark context processing operations',
                    fn: async (runner) => {
                        const timer = runner.startTimer();
                        
                        // Simulate context processing
                        await this.simulateContextProcessing();
                        
                        timer.end();
                        runner.addTimingFor('context_processing', timer.getElapsedMs());
                        runner.recordMemoryUsage(this.getMemoryUsage());
                    }
                }]
            ])
        };

        // Cache operations benchmark suite
        const cacheSuite: BenchmarkSuite = {
            name: 'cache',
            description: 'Cache operations benchmarks',
            benchmarks: new Map([
                ['cache_read', {
                    name: 'cache_read',
                    description: 'Benchmark cache read operations',
                    fn: async (runner) => {
                        const timer = runner.startTimer();
                        
                        // Simulate cache read
                        await this.simulateCacheRead();
                        
                        timer.end();
                        runner.addTimingFor('cache_read', timer.getElapsedMs());
                        runner.recordThroughput(100, timer.getElapsedMs());
                    }
                }],
                ['cache_write', {
                    name: 'cache_write',
                    description: 'Benchmark cache write operations',
                    fn: async (runner) => {
                        const timer = runner.startTimer();
                        
                        // Simulate cache write
                        await this.simulateCacheWrite();
                        
                        timer.end();
                        runner.addTimingFor('cache_write', timer.getElapsedMs());
                        runner.recordThroughput(100, timer.getElapsedMs());
                    }
                }]
            ])
        };

        this.addSuite(contextSuite);
        this.addSuite(cacheSuite);
    }

    // Simulation methods
    private async simulateContextLoading(): Promise<void> {
        // Simulate async context loading
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate some work
                let result = 0;
                for (let i = 0; i < 10000; i++) {
                    result += Math.random();
                }
                resolve();
            }, Math.random() * 10);
        });
    }

    private async simulateContextProcessing(): Promise<void> {
        // Simulate context processing
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate processing work
                let result = 0;
                for (let i = 0; i < 50000; i++) {
                    result += Math.sin(i);
                }
                resolve();
            }, Math.random() * 20);
        });
    }

    private async simulateCacheRead(): Promise<void> {
        // Simulate cache read
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate cache lookup
                const data = { value: Math.random() };
                resolve();
            }, Math.random() * 2);
        });
    }

    private async simulateCacheWrite(): Promise<void> {
        // Simulate cache write
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate cache storage
                const data = { value: Math.random(), timestamp: Date.now() };
                resolve();
            }, Math.random() * 5);
        });
    }

    // System metrics
    private getMemoryUsage(): number {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            return process.memoryUsage().heapUsed;
        }
        return 0;
    }

    private getTotalMemory(): number {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            return process.memoryUsage().heapTotal;
        }
        return 0;
    }

    private getCpuCores(): number {
        if (typeof require !== 'undefined') {
            try {
                const os = require('os');
                return os.cpus().length;
            } catch (e) {
                return 1;
            }
        }
        return 1;
    }

    private getGCStats(): GCStats | undefined {
        // In a real implementation, you'd collect actual GC stats
        return {
            collections: 0,
            totalTime: 0,
            averageTime: 0,
            heapSizeBefore: 0,
            heapSizeAfter: 0
        };
    }
}