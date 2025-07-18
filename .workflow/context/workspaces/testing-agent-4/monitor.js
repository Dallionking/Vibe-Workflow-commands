const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Testing agent file monitoring patterns
const watchPatterns = [
  'tests/**/*.test.{js,ts,jsx,tsx}',
  'src/**/*.test.{js,ts,jsx,tsx}',
  'test/**/*.{js,ts,jsx,tsx}',
  '__tests__/**/*.{js,ts,jsx,tsx}',
  'cypress/**/*.{js,ts}',
  'e2e/**/*.{js,ts}',
  'src/**/*.{js,ts,jsx,tsx}', // Watch source files for changes
  'api/**/*.{js,ts}',
  'lib/**/*.{js,ts}'
];

// Testing-specific files to monitor
const configFiles = [
  'jest.config.js',
  'jest.config.ts',
  'vitest.config.js',
  'vitest.config.ts',
  'cypress.config.js',
  'cypress.config.ts',
  '.eslintrc.js',
  '.eslintrc.json',
  'tsconfig.json',
  'package.json'
];

class TestingAgentMonitor {
  constructor() {
    this.watcher = null;
    this.recentChanges = new Map();
    this.testQueue = [];
  }

  start() {
    console.log('🧪 Testing Agent File Monitor Starting...');
    
    // Combine all patterns
    const allPatterns = [...watchPatterns, ...configFiles];
    
    this.watcher = chokidar.watch(allPatterns, {
      persistent: true,
      ignoreInitial: true,
      cwd: process.cwd()
    });

    this.watcher
      .on('add', path => this.handleFileEvent('added', path))
      .on('change', path => this.handleFileEvent('changed', path))
      .on('unlink', path => this.handleFileEvent('deleted', path));

    console.log('📋 Monitoring patterns:');
    watchPatterns.forEach(pattern => console.log(`  • ${pattern}`));
    
    console.log('⚙️  Configuration files:');
    configFiles.forEach(file => console.log(`  • ${file}`));
  }

  handleFileEvent(event, filepath) {
    // Debounce rapid changes
    const now = Date.now();
    const lastChange = this.recentChanges.get(filepath) || 0;
    
    if (now - lastChange < 1000) {
      return; // Skip if changed within last second
    }
    
    this.recentChanges.set(filepath, now);
    
    console.log(`\n📝 File ${event}: ${filepath}`);
    
    // Determine action based on file type
    if (this.isTestFile(filepath)) {
      this.queueTestRun(filepath, 'test-file-change');
    } else if (this.isSourceFile(filepath)) {
      this.findAndQueueRelatedTests(filepath);
    } else if (this.isConfigFile(filepath)) {
      this.handleConfigChange(filepath);
    }
  }

  isTestFile(filepath) {
    return filepath.includes('.test.') || 
           filepath.includes('.spec.') ||
           filepath.includes('__tests__') ||
           filepath.includes('test/') ||
           filepath.includes('tests/') ||
           filepath.includes('cypress/') ||
           filepath.includes('e2e/');
  }

  isSourceFile(filepath) {
    return (filepath.includes('src/') || 
            filepath.includes('api/') || 
            filepath.includes('lib/')) &&
           !this.isTestFile(filepath);
  }

  isConfigFile(filepath) {
    return configFiles.some(config => filepath.endsWith(config));
  }

  queueTestRun(filepath, reason) {
    this.testQueue.push({
      file: filepath,
      reason: reason,
      timestamp: new Date().toISOString()
    });
    
    this.writeToChannel(
      `Test file changed: ${filepath}. Queuing test run.`,
      {
        type: 'test-queue',
        file: filepath,
        reason: reason
      }
    );
  }

  findAndQueueRelatedTests(sourceFile) {
    // Find corresponding test file
    const testPatterns = [
      sourceFile.replace(/\.(js|ts|jsx|tsx)$/, '.test.$1'),
      sourceFile.replace(/\.(js|ts|jsx|tsx)$/, '.spec.$1'),
      sourceFile.replace('src/', 'tests/').replace(/\.(js|ts|jsx|tsx)$/, '.test.$1'),
      sourceFile.replace('src/', '__tests__/').replace(/\.(js|ts|jsx|tsx)$/, '.test.$1')
    ];
    
    console.log(`🔍 Looking for tests related to: ${sourceFile}`);
    
    this.writeToChannel(
      `Source file changed: ${sourceFile}. Checking for related tests.`,
      {
        type: 'source-change',
        file: sourceFile,
        possibleTests: testPatterns
      }
    );
  }

  handleConfigChange(configFile) {
    console.log(`⚙️  Configuration changed: ${configFile}`);
    
    this.writeToChannel(
      `Configuration file changed: ${configFile}. May need to restart test runners.`,
      {
        type: 'config-change',
        file: configFile
      }
    );
  }

  writeToChannel(message, metadata) {
    const channelPath = path.join('.workflow', 'context', 'channel.md');
    const timestamp = new Date().toISOString();
    
    const entry = `
[${timestamp}] testing-agent-4 → all-agents
TYPE: ${metadata.type}
STATUS: active
MESSAGE: ${message}
${metadata.file ? `FILE: ${metadata.file}` : ''}
---`;

    fs.appendFileSync(channelPath, entry + '\n');
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

// Start monitoring
const monitor = new TestingAgentMonitor();
monitor.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Testing Agent Monitor shutting down...');
  monitor.stop();
  process.exit(0);
});