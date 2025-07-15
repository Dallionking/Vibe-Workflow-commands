#!/usr/bin/env node

/**
 * Test Runner for Vibe Workflow Commands
 * Supports multiple test types and comprehensive coverage reporting
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test configurations
const TEST_CONFIGS = {
  unit: {
    description: 'Run unit tests',
    pattern: 'context/**/__tests__/**/*.test.ts',
    setupFile: 'jest.setup.js',
    coverage: true
  },
  integration: {
    description: 'Run integration tests', 
    pattern: '**/__tests__/**/*.integration.test.ts',
    setupFile: 'jest.setup.js',
    coverage: true
  },
  context: {
    description: 'Run context system tests',
    pattern: 'context/**/__tests__/**/*.test.ts',
    setupFile: 'jest.setup.js',
    coverage: true
  },
  commands: {
    description: 'Run command tests',
    pattern: 'scripts/**/__tests__/**/*.test.ts',
    setupFile: 'jest.setup.js',
    coverage: false
  },
  performance: {
    description: 'Run performance tests',
    pattern: '**/__tests__/**/*.perf.test.ts',
    setupFile: 'jest.setup.js',
    coverage: false
  },
  all: {
    description: 'Run all tests',
    pattern: '**/__tests__/**/*.test.ts',
    setupFile: 'jest.setup.js',
    coverage: true
  }
};

function printUsage() {
  console.log('\nVibe Workflow Commands Test Runner\n');
  console.log('Usage: npm test [test-type]\n');
  console.log('Available test types:');
  
  Object.entries(TEST_CONFIGS).forEach(([type, config]) => {
    console.log(`  ${type.padEnd(15)} - ${config.description}`);
  });
  
  console.log('\nExamples:');
  console.log('  npm test              # Run all tests');
  console.log('  npm test unit         # Run only unit tests');
  console.log('  npm test context      # Run context system tests');
  console.log('  npm run test:coverage # Run with coverage report');
  console.log('');
}

function validateEnvironment() {
  // Check if Jest is available
  try {
    require.resolve('jest');
  } catch (error) {
    console.error('❌ Jest is not installed. Run: npm install');
    process.exit(1);
  }

  // Check if TypeScript is available
  try {
    require.resolve('typescript');
  } catch (error) {
    console.error('❌ TypeScript is not installed. Run: npm install');
    process.exit(1);
  }

  // Check if test files exist
  const contextTestDir = path.join(process.cwd(), 'context', '__tests__');
  if (!fs.existsSync(contextTestDir)) {
    console.error('❌ Context test directory not found:', contextTestDir);
    process.exit(1);
  }

  console.log('✅ Test environment validated');
}

function buildJestArgs(testType = 'all') {
  const config = TEST_CONFIGS[testType];
  
  if (!config) {
    console.error(`❌ Unknown test type: ${testType}`);
    printUsage();
    process.exit(1);
  }

  const args = [
    '--config', 'jest.config.js',
    '--testMatch', `<rootDir>/${config.pattern}`
  ];

  if (config.coverage) {
    args.push('--coverage');
  }

  if (process.env.WATCH === 'true') {
    args.push('--watch');
  }

  if (process.env.VERBOSE === 'true') {
    args.push('--verbose');
  }

  // Add additional Jest options from environment
  if (process.env.JEST_OPTIONS) {
    args.push(...process.env.JEST_OPTIONS.split(' '));
  }

  return args;
}

async function runTests(testType) {
  console.log(`\n🧪 Running ${TEST_CONFIGS[testType].description}...\n`);
  
  const jestArgs = buildJestArgs(testType);
  
  return new Promise((resolve, reject) => {
    const jest = spawn('npx', ['jest', ...jestArgs], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    jest.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${TEST_CONFIGS[testType].description} completed successfully`);
        resolve(code);
      } else {
        console.error(`\n❌ ${TEST_CONFIGS[testType].description} failed with code ${code}`);
        reject(new Error(`Tests failed with exit code ${code}`));
      }
    });

    jest.on('error', (error) => {
      console.error('❌ Failed to start Jest:', error.message);
      reject(error);
    });
  });
}

function generateTestReport() {
  const coverageDir = path.join(process.cwd(), 'coverage');
  const reportFile = path.join(coverageDir, 'lcov-report', 'index.html');
  
  if (fs.existsSync(reportFile)) {
    console.log(`\n📊 Coverage report generated: ${reportFile}`);
    console.log('💡 Tip: Open this file in your browser to view detailed coverage');
  }

  // Check if coverage thresholds were met
  const coverageFile = path.join(coverageDir, 'coverage-summary.json');
  if (fs.existsSync(coverageFile)) {
    try {
      const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
      const total = coverage.total;
      
      console.log('\n📈 Coverage Summary:');
      console.log(`  Lines:      ${total.lines.pct}%`);
      console.log(`  Functions:  ${total.functions.pct}%`);
      console.log(`  Branches:   ${total.branches.pct}%`);
      console.log(`  Statements: ${total.statements.pct}%`);
      
      const threshold = 95;
      const meetsThreshold = 
        total.lines.pct >= threshold &&
        total.functions.pct >= threshold &&
        total.branches.pct >= threshold &&
        total.statements.pct >= threshold;
      
      if (meetsThreshold) {
        console.log('✅ Coverage thresholds met (95%+ required)');
      } else {
        console.log('❌ Coverage thresholds not met (95%+ required)');
      }
      
    } catch (error) {
      console.warn('⚠️  Could not parse coverage summary');
    }
  }
}

async function main() {
  const testType = process.argv[2] || 'all';

  // Handle help/usage requests
  if (testType === '--help' || testType === '-h') {
    printUsage();
    return;
  }

  try {
    console.log('🔍 Validating test environment...');
    validateEnvironment();

    console.log(`🚀 Starting ${testType} tests...`);
    const startTime = Date.now();
    
    await runTests(testType);
    
    const duration = Date.now() - startTime;
    console.log(`\n⏱️  Tests completed in ${(duration / 1000).toFixed(2)}s`);

    if (TEST_CONFIGS[testType].coverage) {
      generateTestReport();
    }

    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    
    if (error.code === 'ENOENT') {
      console.error('💡 Tip: Make sure Jest is installed (npm install)');
    }
    
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n👋 Test execution interrupted');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Test execution terminated');
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
  runTests,
  validateEnvironment,
  TEST_CONFIGS
};