#!/usr/bin/env node

/**
 * Context Engineering Performance Benchmark Runner
 * Executes comprehensive performance testing for the context system
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Benchmark configuration
const BENCHMARK_CONFIG = {
  outputDir: path.join(process.cwd(), 'performance-reports'),
  timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
  enableGC: true,
  iterations: 1
};

/**
 * Print usage information
 */
function printUsage() {
  console.log('\n📊 Context Engineering Benchmark Runner\n');
  console.log('Usage: npm run benchmark [options]\n');
  console.log('Options:');
  console.log('  --quick        Run quick benchmarks (fewer samples)');
  console.log('  --full         Run comprehensive benchmarks (more samples)');
  console.log('  --memory       Focus on memory usage analysis');
  console.log('  --performance  Focus on speed/throughput analysis');
  console.log('  --output DIR   Specify output directory for reports');
  console.log('  --iterations N Run benchmarks N times (default: 1)');
  console.log('  --gc           Enable garbage collection between tests');
  console.log('  --help         Show this help message');
  console.log('\nExamples:');
  console.log('  npm run benchmark --quick');
  console.log('  npm run benchmark --full --gc');
  console.log('  npm run benchmark --memory --output ./reports');
  console.log('');
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...BENCHMARK_CONFIG };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
        break;
      case '--quick':
        config.mode = 'quick';
        break;
      case '--full':
        config.mode = 'full';
        break;
      case '--memory':
        config.focus = 'memory';
        break;
      case '--performance':
        config.focus = 'performance';
        break;
      case '--output':
        if (i + 1 < args.length) {
          config.outputDir = path.resolve(args[i + 1]);
          i++;
        }
        break;
      case '--iterations':
        if (i + 1 < args.length) {
          config.iterations = parseInt(args[i + 1]);
          i++;
        }
        break;
      case '--gc':
        config.enableGC = true;
        break;
      case '--no-gc':
        config.enableGC = false;
        break;
      default:
        console.warn(`Unknown option: ${args[i]}`);
    }
  }
  
  return config;
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created output directory: ${dir}`);
  }
}

/**
 * Generate TypeScript benchmark configuration
 */
function generateBenchmarkConfig(config) {
  const benchmarkConfig = {
    samples: 100,
    warmup: 10,
    fragmentCount: 50,
    contentSize: 'medium',
    enableMemoryLearning: true
  };
  
  if (config.mode === 'quick') {
    benchmarkConfig.samples = 20;
    benchmarkConfig.warmup = 5;
    benchmarkConfig.fragmentCount = 20;
  } else if (config.mode === 'full') {
    benchmarkConfig.samples = 200;
    benchmarkConfig.warmup = 20;
    benchmarkConfig.fragmentCount = 100;
  }
  
  if (config.focus === 'memory') {
    benchmarkConfig.fragmentCount = 200;
    benchmarkConfig.contentSize = 'large';
  } else if (config.focus === 'performance') {
    benchmarkConfig.samples = 500;
    benchmarkConfig.contentSize = 'small';
  }
  
  return benchmarkConfig;
}

/**
 * Run TypeScript compilation
 */
async function compileBenchmarks() {
  console.log('🔨 Compiling TypeScript benchmarks...');
  
  return new Promise((resolve, reject) => {
    const tsc = spawn('npx', ['tsc', '--build'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    tsc.on('close', (code) => {
      if (code === 0) {
        console.log('✅ TypeScript compilation completed');
        resolve();
      } else {
        console.error('❌ TypeScript compilation failed');
        reject(new Error(`tsc failed with code ${code}`));
      }
    });
    
    tsc.on('error', (error) => {
      console.error('❌ Failed to start TypeScript compiler:', error.message);
      reject(error);
    });
  });
}

/**
 * Run benchmarks
 */
async function runBenchmarks(config) {
  const benchmarkConfig = generateBenchmarkConfig(config);
  const outputFile = path.join(config.outputDir, `benchmark-${config.timestamp}.json`);
  const reportFile = path.join(config.outputDir, `report-${config.timestamp}.md`);
  
  console.log('🚀 Starting Context Engineering Benchmarks...');
  console.log(`Configuration: ${JSON.stringify(benchmarkConfig, null, 2)}`);
  console.log(`Output: ${outputFile}`);
  console.log('');
  
  const nodeArgs = [];
  if (config.enableGC) {
    nodeArgs.push('--expose-gc');
  }
  
  const benchmarkScript = `
    const { ContextBenchmarks } = require('./dist/context/performance/context-benchmarks.js');
    const fs = require('fs');
    
    async function run() {
      const benchmarks = new ContextBenchmarks();
      const config = ${JSON.stringify(benchmarkConfig)};
      
      try {
        console.log('📊 Running benchmark suite...');
        const results = await benchmarks.runAllBenchmarks(config);
        
        // Export results
        const exportData = benchmarks.exportResults();
        fs.writeFileSync('${outputFile}', exportData);
        console.log('💾 Results exported to: ${outputFile}');
        
        // Generate report
        const report = benchmarks.generateReport();
        fs.writeFileSync('${reportFile}', report);
        console.log('📄 Report saved to: ${reportFile}');
        
        // Print summary
        console.log('\\n📈 Benchmark Summary:');
        for (const [name, result] of results) {
          const duration = result.averageDuration.toFixed(2);
          const throughput = result.throughput.toFixed(2);
          const memory = (result.memoryStats.averageHeapUsed / 1024 / 1024).toFixed(2);
          console.log(`${name}: ${duration}ms avg, ${throughput} ops/sec, ${memory}MB memory`);
        }
        
        console.log('\\n✅ Benchmarks completed successfully!');
        
      } catch (error) {
        console.error('❌ Benchmark failed:', error);
        process.exit(1);
      }
    }
    
    run();
  `;
  
  return new Promise((resolve, reject) => {
    const node = spawn('node', [...nodeArgs, '-e', benchmarkScript], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    node.on('close', (code) => {
      if (code === 0) {
        resolve({ outputFile, reportFile });
      } else {
        reject(new Error(`Benchmark failed with code ${code}`));
      }
    });
    
    node.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Analyze benchmark results
 */
function analyzeBenchmarkResults(outputFile) {
  console.log('\\n🔍 Analyzing benchmark results...');
  
  try {
    const data = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    const benchmarks = new Map(data.benchmarks);
    
    const analysis = {
      performance: {
        fast: [],
        slow: [],
        average: 0
      },
      memory: {
        efficient: [],
        heavy: [],
        average: 0
      },
      throughput: {
        high: [],
        low: [],
        average: 0
      },
      issues: []
    };
    
    let totalDuration = 0;
    let totalMemory = 0;
    let totalThroughput = 0;
    
    for (const [name, result] of benchmarks) {
      totalDuration += result.averageDuration;
      totalMemory += result.memoryStats.averageHeapUsed;
      totalThroughput += result.throughput;
      
      // Performance analysis
      if (result.averageDuration < 10) {
        analysis.performance.fast.push({ name, duration: result.averageDuration });
      } else if (result.averageDuration > 100) {
        analysis.performance.slow.push({ name, duration: result.averageDuration });
        analysis.issues.push(`${name} is slow: ${result.averageDuration.toFixed(2)}ms`);
      }
      
      // Memory analysis
      const memoryMB = result.memoryStats.averageHeapUsed / 1024 / 1024;
      if (memoryMB < 1) {
        analysis.memory.efficient.push({ name, memory: memoryMB });
      } else if (memoryMB > 10) {
        analysis.memory.heavy.push({ name, memory: memoryMB });
        analysis.issues.push(`${name} uses high memory: ${memoryMB.toFixed(2)}MB`);
      }
      
      // Throughput analysis
      if (result.throughput > 100) {
        analysis.throughput.high.push({ name, throughput: result.throughput });
      } else if (result.throughput < 10) {
        analysis.throughput.low.push({ name, throughput: result.throughput });
        analysis.issues.push(`${name} has low throughput: ${result.throughput.toFixed(2)} ops/sec`);
      }
    }
    
    analysis.performance.average = totalDuration / benchmarks.size;
    analysis.memory.average = totalMemory / benchmarks.size / 1024 / 1024;
    analysis.throughput.average = totalThroughput / benchmarks.size;
    
    // Print analysis
    console.log(`Average performance: ${analysis.performance.average.toFixed(2)}ms`);
    console.log(`Average memory usage: ${analysis.memory.average.toFixed(2)}MB`);
    console.log(`Average throughput: ${analysis.throughput.average.toFixed(2)} ops/sec`);
    
    if (analysis.issues.length > 0) {
      console.log('\\n⚠️  Performance Issues:');
      analysis.issues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log('\\n✅ No performance issues detected!');
    }
    
    return analysis;
    
  } catch (error) {
    console.error('❌ Failed to analyze results:', error.message);
    return null;
  }
}

/**
 * Main execution function
 */
async function main() {
  const config = parseArgs();
  
  try {
    // Ensure output directory
    ensureOutputDir(config.outputDir);
    
    // Compile TypeScript
    await compileBenchmarks();
    
    // Run benchmarks for specified iterations
    const results = [];
    for (let i = 0; i < config.iterations; i++) {
      if (config.iterations > 1) {
        console.log(`\n🔄 Running iteration ${i + 1} of ${config.iterations}...`);
      }
      
      const result = await runBenchmarks({
        ...config,
        timestamp: `${config.timestamp}-${i + 1}`
      });
      results.push(result);
      
      // Short pause between iterations
      if (i < config.iterations - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Analyze results
    if (results.length > 0) {
      const analysis = analyzeBenchmarkResults(results[0].outputFile);
      
      if (analysis && analysis.issues.length > 0) {
        console.log('\\n💡 Recommendations:');
        console.log('  - Consider optimizing slow operations (>100ms)');
        console.log('  - Reduce memory usage for heavy operations (>10MB)');
        console.log('  - Improve throughput for low-performance operations (<10 ops/sec)');
      }
    }
    
    console.log(`\n🎉 Benchmark run completed! Reports saved to: ${config.outputDir}`);
    
  } catch (error) {
    console.error('💥 Benchmark run failed:', error.message);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\\n👋 Benchmark interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\\n👋 Benchmark terminated');
  process.exit(143);
});

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = {
  runBenchmarks,
  analyzeBenchmarkResults,
  BENCHMARK_CONFIG
};