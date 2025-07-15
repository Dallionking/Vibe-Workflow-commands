#!/usr/bin/env node

/**
 * Context Engineering Commands
 * Provides direct access to context system functionality
 */

const path = require('path');
const fs = require('fs');

/**
 * Context Analysis Command
 * Analyzes current context state and provides recommendations
 */
async function contextAnalyze(options = {}) {
  console.log('🔍 Analyzing Context State...\n');
  
  try {
    // Import context system modules
    const { memoryOptimizer } = require('../dist/context/performance/memory-optimizer.js');
    const { fragmentCache, assemblyCache } = require('../dist/context/cache/lru-cache.js');
    
    // Memory analysis
    const memoryAnalysis = memoryOptimizer.analyzeMemoryUsage();
    const memoryStats = memoryOptimizer.getMemoryStats();
    
    // Cache analysis
    const fragmentStats = fragmentCache.getStats();
    const assemblyStats = assemblyCache.getStats();
    
    console.log('📊 Context System Analysis Report');
    console.log('================================\n');
    
    // Memory Status
    console.log('🧠 Memory Status:');
    console.log(`   Heap Used: ${memoryAnalysis.totalHeapUsed.toFixed(2)}MB`);
    console.log(`   RSS: ${memoryAnalysis.rss.toFixed(2)}MB`);
    console.log(`   Optimization Score: ${memoryAnalysis.optimizationScore}/100`);
    console.log(`   Memory Leaks: ${memoryAnalysis.memoryLeaks.length}`);
    
    if (memoryAnalysis.memoryLeaks.length > 0) {
      console.log('\n⚠️  Memory Issues:');
      memoryAnalysis.memoryLeaks.forEach(leak => {
        console.log(`   - ${leak.type} (${leak.severity}): ${leak.description}`);
      });
    }
    
    // Cache Status
    console.log('\n📦 Cache Status:');
    console.log(`   Fragment Cache: ${fragmentStats.currentSize}/${fragmentStats.maxSize} entries`);
    console.log(`   Assembly Cache: ${assemblyStats.currentSize}/${assemblyStats.maxSize} entries`);
    console.log(`   Fragment Hit Rate: ${(fragmentStats.hitRate * 100).toFixed(1)}%`);
    console.log(`   Assembly Hit Rate: ${(assemblyStats.hitRate * 100).toFixed(1)}%`);
    
    // Context Files Status
    console.log('\n📁 Context Files:');
    const statusFiles = [
      '.vibe-status.md',
      'docs/vibe-coding/',
      'phases/',
      '.vibe/',
      'CLAUDE.md'
    ];
    
    for (const file of statusFiles) {
      const exists = fs.existsSync(file);
      const status = exists ? '✅' : '❌';
      console.log(`   ${status} ${file}`);
    }
    
    // Recommendations
    if (memoryAnalysis.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      memoryAnalysis.recommendations.forEach(rec => {
        console.log(`   - ${rec}`);
      });
    }
    
    // Health Score
    const healthScore = calculateHealthScore(memoryAnalysis, fragmentStats, assemblyStats);
    console.log(`\n🎯 Overall Health Score: ${healthScore}/100`);
    
    if (healthScore >= 80) {
      console.log('✅ Context system is healthy!');
    } else if (healthScore >= 60) {
      console.log('⚠️  Context system needs attention');
    } else {
      console.log('❌ Context system requires optimization');
    }
    
    return {
      memory: memoryAnalysis,
      caches: { fragment: fragmentStats, assembly: assemblyStats },
      healthScore,
      recommendations: memoryAnalysis.recommendations
    };
    
  } catch (error) {
    console.error('❌ Context analysis failed:', error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    
    console.log('\n💡 Fallback Analysis:');
    console.log('   - Context system may not be fully initialized');
    console.log('   - Run: npm run build to compile TypeScript files');
    console.log('   - Check: context/ directory exists and contains compiled files');
    
    return { error: error.message };
  }
}

/**
 * Context Optimization Command
 * Optimizes context system performance and memory usage
 */
async function contextOptimize(options = {}) {
  console.log('⚡ Optimizing Context System...\n');
  
  try {
    const { memoryOptimizer } = require('../dist/context/performance/memory-optimizer.js');
    const { fragmentCache, assemblyCache } = require('../dist/context/cache/lru-cache.js');
    
    // Before optimization
    const beforeAnalysis = memoryOptimizer.analyzeMemoryUsage();
    console.log(`📊 Before Optimization: ${beforeAnalysis.totalHeapUsed.toFixed(2)}MB heap`);
    
    // Perform optimization
    console.log('🧹 Cleaning up memory...');
    const afterAnalysis = await memoryOptimizer.optimizeMemory();
    
    console.log('🗄️  Optimizing caches...');
    fragmentCache.cleanupExpired();
    assemblyCache.cleanupExpired();
    
    // Force garbage collection if available
    if (global.gc) {
      console.log('♻️  Running garbage collection...');
      global.gc();
    }
    
    // After optimization
    console.log(`📊 After Optimization: ${afterAnalysis.totalHeapUsed.toFixed(2)}MB heap`);
    
    const memoryReduction = beforeAnalysis.totalHeapUsed - afterAnalysis.totalHeapUsed;
    if (memoryReduction > 0) {
      console.log(`✅ Memory reduced by ${memoryReduction.toFixed(2)}MB`);
    } else {
      console.log('ℹ️  No significant memory reduction achieved');
    }
    
    // Optimization report
    console.log('\n📈 Optimization Results:');
    console.log(`   Memory Score: ${beforeAnalysis.optimizationScore} → ${afterAnalysis.optimizationScore}`);
    console.log(`   Memory Leaks: ${beforeAnalysis.memoryLeaks.length} → ${afterAnalysis.memoryLeaks.length}`);
    
    if (afterAnalysis.optimizationScore > beforeAnalysis.optimizationScore) {
      console.log('✅ Context system optimization successful!');
    } else {
      console.log('⚠️  Limited optimization gains achieved');
    }
    
    return {
      before: beforeAnalysis,
      after: afterAnalysis,
      memoryReduction,
      improvement: afterAnalysis.optimizationScore - beforeAnalysis.optimizationScore
    };
    
  } catch (error) {
    console.error('❌ Context optimization failed:', error.message);
    return { error: error.message };
  }
}

/**
 * Context Validation Command
 * Validates context system integrity and configuration
 */
async function contextValidate(options = {}) {
  console.log('🔍 Validating Context System...\n');
  
  const validationResults = {
    files: [],
    configuration: [],
    performance: [],
    overall: true
  };
  
  try {
    // File structure validation
    console.log('📁 Validating File Structure...');
    const requiredFiles = [
      'context/types/context.types.ts',
      'context/assembly/context-assembler.ts',
      'context/assembly/context-fragment.ts',
      'context/cache/lru-cache.ts',
      'context/memory/context-memory.ts',
      'context/integration/command-provider.ts',
      'context/integration/claude-md-parser.ts',
      'context/performance/performance-monitor.ts',
      'context/performance/memory-optimizer.ts'
    ];
    
    for (const file of requiredFiles) {
      const exists = fs.existsSync(file);
      const status = exists ? 'PASS' : 'FAIL';
      const result = { file, status, exists };
      
      validationResults.files.push(result);
      if (!exists) validationResults.overall = false;
      
      console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    }
    
    // TypeScript compilation validation
    console.log('\n🔨 Validating TypeScript Compilation...');
    const distFiles = requiredFiles.map(f => f.replace('.ts', '.js').replace('context/', 'dist/context/'));
    
    for (const file of distFiles) {
      const exists = fs.existsSync(file);
      const status = exists ? 'PASS' : 'FAIL';
      const result = { file, status, exists, type: 'compilation' };
      
      validationResults.files.push(result);
      if (!exists) validationResults.overall = false;
      
      console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    }
    
    // Configuration validation
    console.log('\n⚙️  Validating Configuration...');
    const configChecks = [
      {
        name: 'package.json context config',
        check: () => {
          const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
          return pkg.config && pkg.config.contextEngineering === true;
        }
      },
      {
        name: 'TypeScript configuration',
        check: () => {
          const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
          return tsconfig.include && tsconfig.include.includes('context/**/*');
        }
      },
      {
        name: 'Jest configuration',
        check: () => {
          const jestConfig = require('../jest.config.js');
          return jestConfig.collectCoverageFrom && 
                 jestConfig.collectCoverageFrom.includes('context/**/*.ts');
        }
      }
    ];
    
    for (const check of configChecks) {
      try {
        const passed = check.check();
        const status = passed ? 'PASS' : 'FAIL';
        const result = { name: check.name, status, passed };
        
        validationResults.configuration.push(result);
        if (!passed) validationResults.overall = false;
        
        console.log(`   ${passed ? '✅' : '❌'} ${check.name}`);
      } catch (error) {
        validationResults.configuration.push({ 
          name: check.name, 
          status: 'ERROR', 
          error: error.message 
        });
        validationResults.overall = false;
        console.log(`   ❌ ${check.name}: ${error.message}`);
      }
    }
    
    // Performance validation (if context system is available)
    console.log('\n⚡ Validating Performance...');
    try {
      const { memoryOptimizer } = require('../dist/context/performance/memory-optimizer.js');
      const analysis = memoryOptimizer.analyzeMemoryUsage();
      
      const perfChecks = [
        {
          name: 'Memory usage < 100MB',
          passed: analysis.totalHeapUsed < 100,
          value: `${analysis.totalHeapUsed.toFixed(2)}MB`
        },
        {
          name: 'Optimization score > 70',
          passed: analysis.optimizationScore > 70,
          value: `${analysis.optimizationScore}/100`
        },
        {
          name: 'No critical memory leaks',
          passed: !analysis.memoryLeaks.some(l => l.severity === 'critical'),
          value: `${analysis.memoryLeaks.length} leaks`
        }
      ];
      
      for (const check of perfChecks) {
        validationResults.performance.push(check);
        if (!check.passed) validationResults.overall = false;
        
        console.log(`   ${check.passed ? '✅' : '❌'} ${check.name}: ${check.value}`);
      }
      
    } catch (error) {
      validationResults.performance.push({
        name: 'Performance analysis',
        passed: false,
        error: error.message
      });
      console.log(`   ⚠️  Performance validation skipped: ${error.message}`);
    }
    
    // Overall result
    console.log('\n🎯 Validation Summary:');
    console.log(`   Files: ${validationResults.files.filter(f => f.status === 'PASS').length}/${validationResults.files.length}`);
    console.log(`   Configuration: ${validationResults.configuration.filter(c => c.status === 'PASS').length}/${validationResults.configuration.length}`);
    console.log(`   Performance: ${validationResults.performance.filter(p => p.passed).length}/${validationResults.performance.length}`);
    
    if (validationResults.overall) {
      console.log('✅ Context system validation passed!');
    } else {
      console.log('❌ Context system validation failed');
      console.log('\n💡 Recommendations:');
      console.log('   - Run: npm run build to compile TypeScript');
      console.log('   - Run: npm run typecheck to check for errors');
      console.log('   - Run: npm test to verify functionality');
    }
    
    return validationResults;
    
  } catch (error) {
    console.error('❌ Context validation failed:', error.message);
    return { error: error.message, overall: false };
  }
}

/**
 * Context Memory Command
 * Manages context memory and learning patterns
 */
async function contextMemory(options = {}) {
  console.log('🧠 Context Memory Management...\n');
  
  try {
    // Import context memory system
    const { ContextMemoryManager } = require('../dist/context/memory/context-memory.js');
    const memoryManager = new ContextMemoryManager();
    
    const action = options.action || 'status';
    
    switch (action) {
      case 'status':
        console.log('📊 Memory Status Report:');
        const stats = memoryManager.getLearningMetrics();
        console.log(`   Total Patterns: ${stats.totalPatterns}`);
        console.log(`   Learning Score: ${stats.learningScore}/100`);
        console.log(`   Memory Efficiency: ${stats.memoryEfficiency}%`);
        console.log(`   Pattern Recognition: ${stats.patternRecognition}%`);
        break;
        
      case 'clear':
        console.log('🗑️  Clearing context memory...');
        await memoryManager.clearMemory();
        console.log('✅ Context memory cleared successfully');
        break;
        
      case 'export':
        console.log('📤 Exporting context memory...');
        const exported = await memoryManager.exportMemory();
        const filename = `context-memory-${new Date().toISOString().split('T')[0]}.json`;
        require('fs').writeFileSync(filename, JSON.stringify(exported, null, 2));
        console.log(`✅ Memory exported to ${filename}`);
        break;
        
      case 'analyze':
        console.log('🔍 Analyzing memory patterns...');
        const patterns = memoryManager.getTopPatterns(10);
        console.log('\n📈 Top Patterns:');
        patterns.forEach((pattern, index) => {
          console.log(`   ${index + 1}. ${pattern.name} (strength: ${pattern.strength})`);
        });
        break;
        
      default:
        console.log('Memory Commands:');
        console.log('  status  - Show memory status');
        console.log('  clear   - Clear memory');
        console.log('  export  - Export memory');
        console.log('  analyze - Analyze patterns');
    }
    
    return { success: true, action };
    
  } catch (error) {
    console.error('❌ Memory management failed:', error.message);
    return { error: error.message };
  }
}

/**
 * Calculate overall health score
 */
function calculateHealthScore(memoryAnalysis, fragmentStats, assemblyStats) {
  let score = 100;
  
  // Memory penalties
  if (memoryAnalysis.totalHeapUsed > 200) score -= 30;
  else if (memoryAnalysis.totalHeapUsed > 100) score -= 15;
  else if (memoryAnalysis.totalHeapUsed > 50) score -= 5;
  
  // Leak penalties
  score -= memoryAnalysis.memoryLeaks.length * 10;
  
  // Cache efficiency bonuses
  if (fragmentStats.hitRate > 0.8) score += 5;
  if (assemblyStats.hitRate > 0.8) score += 5;
  
  // Optimization score factor
  score = Math.min(score, memoryAnalysis.optimizationScore);
  
  return Math.max(0, Math.round(score));
}

/**
 * Export commands for use by claude.json
 */
module.exports = {
  contextAnalyze,
  contextOptimize,
  contextValidate,
  contextMemory,
  calculateHealthScore
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const options = {
    verbose: process.argv.includes('--verbose') || process.argv.includes('-v')
  };
  
  async function runCommand() {
    switch (command) {
      case 'analyze':
        await contextAnalyze(options);
        break;
      case 'optimize':
        await contextOptimize(options);
        break;
      case 'validate':
        await contextValidate(options);
        break;
      case 'memory':
        options.action = process.argv[3] || 'status';
        await contextMemory(options);
        break;
      default:
        console.log('Context Engineering Commands');
        console.log('============================');
        console.log('');
        console.log('Usage: node context-engineering.js <command> [action]');
        console.log('');
        console.log('Commands:');
        console.log('  analyze   - Analyze current context state');
        console.log('  optimize  - Optimize context system performance');
        console.log('  validate  - Validate context system integrity');
        console.log('  memory    - Manage context memory and patterns');
        console.log('');
        console.log('Memory actions:');
        console.log('  status    - Show memory status (default)');
        console.log('  clear     - Clear context memory');
        console.log('  export    - Export memory data');
        console.log('  analyze   - Analyze learning patterns');
        console.log('');
        console.log('Options:');
        console.log('  --verbose, -v  Show detailed output');
        break;
    }
  }
  
  runCommand().catch(error => {
    console.error('Command failed:', error.message);
    process.exit(1);
  });
}