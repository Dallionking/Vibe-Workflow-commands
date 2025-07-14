#!/usr/bin/env node

/**
 * Test Runner
 * Comprehensive test execution for Vibe Commands
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_SUITES = {
  unit: {
    name: 'Unit Tests',
    pattern: 'tests/unit/**/*.test.ts',
    timeout: 30000
  },
  integration: {
    name: 'Integration Tests', 
    pattern: 'tests/integration/**/*.test.ts',
    timeout: 60000
  },
  context: {
    name: 'Context Engineering Tests',
    pattern: 'tests/context/**/*.test.ts',
    timeout: 45000
  },
  commands: {
    name: 'Command Tests',
    pattern: 'tests/commands/**/*.test.ts',
    timeout: 45000
  },
  performance: {
    name: 'Performance Tests',
    pattern: 'tests/context/performance.test.ts',
    timeout: 30000
  },
  all: {
    name: 'All Tests',
    pattern: 'tests/**/*.test.ts',
    timeout: 120000
  }
};

class TestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }
  
  async run(suites = ['all']) {
    console.log('🧪 Vibe Commands Test Runner');
    console.log('=============================\n');
    
    // Ensure test environment
    this.setupEnvironment();
    
    // Run selected test suites
    for (const suiteName of suites) {
      if (!TEST_SUITES[suiteName]) {
        console.error(`❌ Unknown test suite: ${suiteName}`);
        continue;
      }
      
      await this.runSuite(suiteName);
    }
    
    // Generate report
    this.generateReport();
    
    // Exit with appropriate code
    const failed = this.results.some(r => !r.success);
    process.exit(failed ? 1 : 0);
  }
  
  setupEnvironment() {
    // Ensure coverage directory exists
    const coverageDir = path.join(__dirname, '..', 'coverage');
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }
    
    // Set environment variables
    process.env.NODE_ENV = 'test';
    process.env.VIBE_DEBUG = 'false';
    process.env.SILENT_TESTS = 'true';
  }
  
  async runSuite(suiteName) {
    const suite = TEST_SUITES[suiteName];
    const startTime = Date.now();
    
    console.log(`
🔧 Running ${suite.name}...`);
    console.log(`   Pattern: ${suite.pattern}`);
    console.log(`   Timeout: ${suite.timeout}ms\n`);
    
    try {
      const cmd = `npx jest ${suite.pattern} --testTimeout=${suite.timeout}`;
      const output = execSync(cmd, {
        encoding: 'utf8',
        stdio: 'pipe',
        env: { ...process.env }
      });
      
      const duration = Date.now() - startTime;
      this.results.push({
        suite: suiteName,
        success: true,
        duration,
        output
      });
      
      console.log(`✅ ${suite.name} passed in ${(duration / 1000).toFixed(2)}s`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        suite: suiteName,
        success: false,
        duration,
        error: error.message,
        output: error.stdout || error.output
      });
      
      console.log(`❌ ${suite.name} failed in ${(duration / 1000).toFixed(2)}s`);
      if (error.stdout) {
        console.log('\nError Output:');
        console.log(error.stdout.toString());
      }
    }
  }
  
  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    
    console.log('\n\n=============================');
    console.log('📄 Test Report');
    console.log('=============================\n');
    
    // Summary
    console.log('📊 Summary:');
    console.log(`   Total Suites: ${this.results.length}`);
    console.log(`   Passed: ${passed} ✅`);
    console.log(`   Failed: ${failed} ❌`);
    console.log(`   Duration: ${(totalDuration / 1000).toFixed(2)}s\n`);
    
    // Details
    console.log('📋 Details:');
    this.results.forEach(result => {
      const icon = result.success ? '✅' : '❌';
      const suite = TEST_SUITES[result.suite];
      console.log(`   ${icon} ${suite.name}: ${(result.duration / 1000).toFixed(2)}s`);
    });
    
    // Coverage report if available
    this.checkCoverage();
    
    // Recommendations
    if (failed > 0) {
      console.log('\n💡 Recommendations:');
      console.log('   - Fix failing tests before committing');
      console.log('   - Run individual suites for faster feedback');
      console.log('   - Check test output above for details');
    }
    
    // Write JSON report
    const reportPath = path.join(__dirname, '..', 'coverage', 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      passed,
      failed,
      results: this.results
    }, null, 2));
    
    console.log(`\n💾 Full report saved to: ${reportPath}`);
  }
  
  checkCoverage() {
    const coveragePath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
    
    if (!fs.existsSync(coveragePath)) {
      return;
    }
    
    try {
      const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      const total = coverage.total;
      
      console.log('\n📈 Coverage:');
      console.log(`   Lines: ${total.lines.pct}%`);
      console.log(`   Statements: ${total.statements.pct}%`);
      console.log(`   Functions: ${total.functions.pct}%`);
      console.log(`   Branches: ${total.branches.pct}%`);
      
      // Check thresholds
      const thresholds = {
        lines: 85,
        statements: 85,
        functions: 80,
        branches: 80
      };
      
      let belowThreshold = false;
      Object.entries(thresholds).forEach(([metric, threshold]) => {
        if (total[metric].pct < threshold) {
          console.log(`   ⚠️  ${metric} coverage (${total[metric].pct}%) is below threshold (${threshold}%)`);
          belowThreshold = true;
        }
      });
      
      if (!belowThreshold) {
        console.log('   ✅ All coverage thresholds met!');
      }
      
    } catch (error) {
      console.log('\n⚠️  Could not read coverage report');
    }
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const suites = args.length > 0 ? args : ['all'];
  
  const runner = new TestRunner();
  runner.run(suites).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = TestRunner;