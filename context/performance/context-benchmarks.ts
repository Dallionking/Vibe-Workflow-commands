/**
 * Context Engineering System Benchmarks
 * Comprehensive performance testing for all context components
 */

import { PerformanceMonitor } from './performance-monitor';
import { ContextFragmentFactory } from '../assembly/context-fragment';
import { ContextAssembler } from '../assembly/context-assembler';
import { LRUCache } from '../cache/lru-cache';
import { ContextMemoryManager } from '../memory/context-memory';
import { CommandContextProvider } from '../integration/command-provider';
import { ContextPriority, ContextFragment } from '../types/context.types';

/**
 * Benchmark Configuration
 */
interface BenchmarkConfig {
  samples: number;
  warmup: number;
  fragmentCount: number;
  contentSize: 'small' | 'medium' | 'large';
  enableMemoryLearning: boolean;
}

/**
 * Default benchmark configuration
 */
const DEFAULT_CONFIG: BenchmarkConfig = {
  samples: 100,
  warmup: 10,
  fragmentCount: 50,
  contentSize: 'medium',
  enableMemoryLearning: true
};

/**
 * Context System Benchmark Suite
 */
export class ContextBenchmarks {
  private monitor: PerformanceMonitor;
  private factory: ContextFragmentFactory;
  private assembler: ContextAssembler;
  private cache: LRUCache<ContextFragment>;
  private memory: ContextMemoryManager;
  private provider: CommandContextProvider;

  constructor() {
    this.monitor = new PerformanceMonitor();
    this.factory = new ContextFragmentFactory();
    this.assembler = new ContextAssembler();
    this.cache = new LRUCache({ maxSize: 1000, ttl: 60000 });
    this.memory = new ContextMemoryManager();
    this.provider = new CommandContextProvider();
  }

  /**
   * Run all benchmarks
   */
  public async runAllBenchmarks(config: Partial<BenchmarkConfig> = {}): Promise<Map<string, any>> {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    const results = new Map();

    console.log('🚀 Starting Context Engineering Benchmarks...\n');

    try {
      // Fragment operations
      results.set('fragment-creation', await this.benchmarkFragmentCreation(finalConfig));
      results.set('fragment-validation', await this.benchmarkFragmentValidation(finalConfig));
      results.set('token-estimation', await this.benchmarkTokenEstimation(finalConfig));

      // Cache operations
      results.set('cache-put', await this.benchmarkCachePut(finalConfig));
      results.set('cache-get', await this.benchmarkCacheGet(finalConfig));
      results.set('cache-eviction', await this.benchmarkCacheEviction(finalConfig));

      // Context assembly
      results.set('context-assembly', await this.benchmarkContextAssembly(finalConfig));
      results.set('context-selection', await this.benchmarkContextSelection(finalConfig));
      results.set('token-budget', await this.benchmarkTokenBudgetManagement(finalConfig));

      // Memory & learning
      results.set('pattern-recognition', await this.benchmarkPatternRecognition(finalConfig));
      results.set('decision-recording', await this.benchmarkDecisionRecording(finalConfig));
      results.set('memory-retrieval', await this.benchmarkMemoryRetrieval(finalConfig));

      // Integration
      results.set('command-context', await this.benchmarkCommandContext(finalConfig));
      results.set('validation-gates', await this.benchmarkValidationGates(finalConfig));

      console.log('✅ All benchmarks completed successfully!\n');
      
    } catch (error) {
      console.error('❌ Benchmark failed:', error);
      throw error;
    }

    return results;
  }

  /**
   * Fragment creation benchmark
   */
  private async benchmarkFragmentCreation(config: BenchmarkConfig) {
    const content = this.generateContent(config.contentSize);
    
    return await this.monitor.benchmark(
      'Fragment Creation',
      () => {
        this.factory.createFragment(
          'task-context',
          content,
          ContextPriority.MEDIUM,
          { source: { type: 'task', taskId: 'test', taskType: 'implementation' } }
        );
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Fragment validation benchmark
   */
  private async benchmarkFragmentValidation(config: BenchmarkConfig) {
    const fragments = this.createTestFragments(config.fragmentCount, config.contentSize);
    let index = 0;
    
    return await this.monitor.benchmark(
      'Fragment Validation',
      () => {
        const fragment = fragments[index % fragments.length];
        // Validate fragment by checking its properties
        const isValid = fragment.validation.isValid && 
                        fragment.content.length > 0 &&
                        fragment.tokenEstimate > 0;
        index++;
        // Store result for side effect
        (global as any).lastValidationResult = isValid;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Token estimation benchmark
   */
  private async benchmarkTokenEstimation(config: BenchmarkConfig) {
    const content = this.generateContent(config.contentSize);
    
    return await this.monitor.benchmark(
      'Token Estimation',
      () => {
        this.factory['tokenEstimator'].estimate(content);
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Cache put operation benchmark
   */
  private async benchmarkCachePut(config: BenchmarkConfig) {
    const fragments = this.createTestFragments(config.fragmentCount, config.contentSize);
    let index = 0;
    
    return await this.monitor.benchmark(
      'Cache Put',
      () => {
        const fragment = fragments[index % fragments.length];
        this.cache.put(`key-${index}`, fragment);
        index++;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Cache get operation benchmark
   */
  private async benchmarkCacheGet(config: BenchmarkConfig) {
    // Pre-populate cache
    const fragments = this.createTestFragments(config.fragmentCount, config.contentSize);
    fragments.forEach((fragment, i) => {
      this.cache.put(`key-${i}`, fragment);
    });

    let index = 0;
    
    return await this.monitor.benchmark(
      'Cache Get',
      () => {
        this.cache.get(`key-${index % config.fragmentCount}`);
        index++;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Cache eviction benchmark
   */
  private async benchmarkCacheEviction(config: BenchmarkConfig) {
    const smallCache = new LRUCache<ContextFragment>({ maxSize: 10, ttl: 60000 });
    const fragments = this.createTestFragments(20, config.contentSize);
    let index = 0;
    
    return await this.monitor.benchmark(
      'Cache Eviction',
      () => {
        const fragment = fragments[index % fragments.length];
        smallCache.put(`key-${index}`, fragment); // Will trigger eviction
        index++;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Context assembly benchmark
   */
  private async benchmarkContextAssembly(config: BenchmarkConfig) {
    return await this.monitor.benchmark(
      'Context Assembly',
      async () => {
        await this.assembler.assembleContext();
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Context selection benchmark
   */
  private async benchmarkContextSelection(config: BenchmarkConfig) {
    const fragments = this.createTestFragments(config.fragmentCount, config.contentSize);
    
    return await this.monitor.benchmark(
      'Context Selection',
      () => {
        this.assembler['selectFragments'](fragments);
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Token budget management benchmark
   */
  private async benchmarkTokenBudgetManagement(config: BenchmarkConfig) {
    const fragments = this.createTestFragments(config.fragmentCount, config.contentSize);
    
    return await this.monitor.benchmark(
      'Token Budget Management',
      () => {
        // Simulate token budget calculation
        const totalTokens = fragments.reduce((sum, f) => sum + f.tokenEstimate, 0);
        const budget = 8000;
        const withinBudget = totalTokens <= budget;
        // Store result for side effect
        (global as any).lastBudgetResult = { totalTokens, budget, withinBudget };
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Pattern recognition benchmark
   */
  private async benchmarkPatternRecognition(config: BenchmarkConfig) {
    const fragments = this.createTestFragments(config.fragmentCount, config.contentSize);
    
    return await this.monitor.benchmark(
      'Pattern Recognition',
      () => {
        this.memory.analyzeContext(fragments);
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Decision recording benchmark
   */
  private async benchmarkDecisionRecording(config: BenchmarkConfig) {
    const fragments = this.createTestFragments(10, config.contentSize);
    let index = 0;
    
    return await this.monitor.benchmark(
      'Decision Recording',
      () => {
        this.memory.recordDecision(
          `context-${index}`,
          'selected-fragments',
          'optimal-priority-distribution',
          index % 3 === 0 ? 'success' : 'partial',
          fragments
        );
        index++;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Memory retrieval benchmark
   */
  private async benchmarkMemoryRetrieval(config: BenchmarkConfig) {
    // Pre-populate memory
    for (let i = 0; i < 50; i++) {
      this.memory.storeMemory(`key-${i}`, `content-${i}`, 'pattern', ContextPriority.MEDIUM);
    }

    let index = 0;
    
    return await this.monitor.benchmark(
      'Memory Retrieval',
      () => {
        this.memory.getMemory(`key-${index % 50}`);
        index++;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Command context generation benchmark
   */
  private async benchmarkCommandContext(config: BenchmarkConfig) {
    const commands = ['Read', 'Write', 'Bash', 'Edit', 'vibe-init'];
    let index = 0;
    
    return await this.monitor.benchmark(
      'Command Context Generation',
      async () => {
        const command = commands[index % commands.length];
        await this.provider.getCommandContext(command);
        index++;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Validation gates benchmark
   */
  private async benchmarkValidationGates(config: BenchmarkConfig) {
    const fragments = this.createTestFragments(10, config.contentSize);
    
    return await this.monitor.benchmark(
      'Validation Gates',
      () => {
        // Simulate validation logic
        const hasValidFragments = fragments.every(f => f.validation.isValid);
        const totalTokens = fragments.reduce((sum, f) => sum + f.tokenEstimate, 0);
        const withinBudget = totalTokens <= 8000;
        const validationResult = {
          passed: hasValidFragments && withinBudget,
          errors: hasValidFragments ? [] : ['Invalid fragments detected'],
          warnings: withinBudget ? [] : ['Token budget exceeded']
        };
        // Store result for side effect
        (global as any).lastValidationGateResult = validationResult;
      },
      { samples: config.samples, warmup: config.warmup }
    );
  }

  /**
   * Generate performance report
   */
  public generateReport(): string {
    return this.monitor.generateReport();
  }

  /**
   * Export benchmark results
   */
  public exportResults(): string {
    return this.monitor.exportMetrics();
  }

  /**
   * Helper: Create test fragments
   */
  private createTestFragments(count: number, size: 'small' | 'medium' | 'large'): ContextFragment[] {
    const fragments: ContextFragment[] = [];
    const content = this.generateContent(size);
    
    for (let i = 0; i < count; i++) {
      const priority = Object.values(ContextPriority)[i % Object.values(ContextPriority).length];
      const fragment = this.factory.createFragment(
        'task-context',
        `${content}-${i}`,
        priority as ContextPriority,
        { source: { type: 'task', taskId: `test-${i}`, taskType: 'testing' } }
      );
      fragments.push(fragment);
    }
    
    return fragments;
  }

  /**
   * Helper: Generate content of specified size
   */
  private generateContent(size: 'small' | 'medium' | 'large'): string {
    const base = 'This is test content for performance benchmarking. ';
    
    switch (size) {
      case 'small':
        return base.repeat(5); // ~250 characters
      case 'medium':
        return base.repeat(20); // ~1000 characters
      case 'large':
        return base.repeat(100); // ~5000 characters
      default:
        return base.repeat(20);
    }
  }
}

/**
 * Run benchmarks from command line
 */
export async function runBenchmarks(): Promise<void> {
  const benchmarks = new ContextBenchmarks();
  
  console.log('📊 Context Engineering Performance Benchmarks\n');
  console.log('Configuration:');
  console.log(`- Samples per test: ${DEFAULT_CONFIG.samples}`);
  console.log(`- Warmup runs: ${DEFAULT_CONFIG.warmup}`);
  console.log(`- Fragment count: ${DEFAULT_CONFIG.fragmentCount}`);
  console.log(`- Content size: ${DEFAULT_CONFIG.contentSize}`);
  console.log('');

  const startTime = Date.now();
  
  try {
    const results = await benchmarks.runAllBenchmarks();
    const duration = Date.now() - startTime;
    
    console.log(`\n⏱️  Total benchmark time: ${(duration / 1000).toFixed(2)}s\n`);
    
    // Print summary
    console.log('📈 Performance Summary:');
    for (const [name, result] of results) {
      console.log(`${name}: ${result.averageDuration.toFixed(2)}ms avg, ${result.throughput.toFixed(2)} ops/sec`);
    }
    
    // Generate detailed report
    const report = benchmarks.generateReport();
    console.log('\n' + report);
    
    // Check for performance issues
    const issues = analyzePerformanceIssues(results);
    if (issues.length > 0) {
      console.log('\n⚠️  Performance Issues Detected:');
      issues.forEach(issue => console.log(`- ${issue}`));
    } else {
      console.log('\n✅ No performance issues detected!');
    }
    
  } catch (error) {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  }
}

/**
 * Analyze benchmark results for performance issues
 */
function analyzePerformanceIssues(results: Map<string, any>): string[] {
  const issues: string[] = [];
  
  for (const [name, result] of results) {
    // Check for slow operations (>100ms average)
    if (result.averageDuration > 100) {
      issues.push(`${name} is slow: ${result.averageDuration.toFixed(2)}ms average`);
    }
    
    // Check for high memory usage (>10MB average)
    if (result.memoryStats.averageHeapUsed > 10 * 1024 * 1024) {
      issues.push(`${name} uses high memory: ${(result.memoryStats.averageHeapUsed / 1024 / 1024).toFixed(2)}MB average`);
    }
    
    // Check for low throughput (<10 ops/sec)
    if (result.throughput < 10) {
      issues.push(`${name} has low throughput: ${result.throughput.toFixed(2)} ops/sec`);
    }
    
    // Check for high variability (std dev > 50% of average)
    if (result.standardDeviation > result.averageDuration * 0.5) {
      issues.push(`${name} has high variability: ${result.standardDeviation.toFixed(2)}ms std dev`);
    }
  }
  
  return issues;
}

// Export for use as module
export { BenchmarkConfig, DEFAULT_CONFIG };