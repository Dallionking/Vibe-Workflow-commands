const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class TestingAgent {
  constructor(terminalId = '4') {
    this.name = 'testing-agent';
    this.terminalId = terminalId;
    this.role = 'tester';
    this.capabilities = [
      'test-creation',
      'test-execution', 
      'coverage-analysis',
      'quality-validation',
      'regression-testing',
      'integration-testing',
      'e2e-testing'
    ];
    this.channelPath = path.join('.workflow', 'context', 'channel.md');
    this.lastMessageTime = Date.now();
    this.isRunning = false;
  }

  async start() {
    console.log(`
🤖 ${this.name}-${this.terminalId} Starting...
📍 Role: ${this.role}
🖥️  Terminal: ${this.terminalId}

✅ ${this.name} is ready and monitoring
📋 Capabilities:
${this.capabilities.map(cap => `  • ${cap}`).join('\n')}

👁️  Monitoring:
  • channel.md for messages
  • test files for changes
  • source files for updates requiring tests
  • configuration files for test setup changes

💬 Waiting for tasks from orchestrator...
    `);

    // Start monitoring channel
    this.startChannelMonitoring();
    
    // Announce readiness
    await this.writeToChannel('Testing agent ready for quality assurance tasks', {
      type: 'agent-ready',
      capabilities: this.capabilities
    });
  }

  startChannelMonitoring() {
    // Poll channel every 2 seconds
    setInterval(async () => {
      if (!this.isRunning) {
        await this.checkChannel();
      }
    }, 2000);
  }

  async checkChannel() {
    try {
      const content = fs.readFileSync(this.channelPath, 'utf8');
      const messages = this.parseChannelMessages(content);
      
      // Process new messages
      for (const message of messages) {
        if (this.shouldProcessMessage(message)) {
          await this.handleMessage(message);
        }
      }
    } catch (error) {
      console.error('Error reading channel:', error.message);
    }
  }

  parseChannelMessages(content) {
    const messages = [];
    const blocks = content.split('---\n');
    
    for (const block of blocks) {
      if (block.trim()) {
        const lines = block.trim().split('\n');
        const message = {};
        
        // Parse header line
        const headerMatch = lines[0].match(/\[(.*?)\] (.*?) → (.*)/);
        if (headerMatch) {
          message.timestamp = headerMatch[1];
          message.agent = headerMatch[2];
          message.target = headerMatch[3];
        }
        
        // Parse metadata
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes(':')) {
            const [key, ...valueParts] = line.split(':');
            message[key.toLowerCase().trim()] = valueParts.join(':').trim();
          }
        }
        
        if (message.timestamp) {
          messages.push(message);
        }
      }
    }
    
    return messages;
  }

  shouldProcessMessage(message) {
    // Process if:
    // 1. Message is for this agent specifically
    // 2. Message is for all agents
    // 3. Message is for the tester role
    // 4. Message is newer than last processed
    
    const isForMe = message.target === this.name ||
                    message.target === `${this.name}-${this.terminalId}` ||
                    message.target === 'all-agents' ||
                    message.target === 'role:tester';
    
    const messageTime = new Date(message.timestamp).getTime();
    const isNew = messageTime > this.lastMessageTime;
    
    // Don't process our own messages
    const isOwnMessage = message.agent === `${this.name}-${this.terminalId}`;
    
    return isForMe && isNew && !isOwnMessage;
  }

  async handleMessage(message) {
    this.lastMessageTime = new Date(message.timestamp).getTime();
    
    console.log(`\n📨 Received message from ${message.agent}`);
    console.log(`   Type: ${message.type}`);
    console.log(`   Message: ${message.message}`);
    
    // Handle different message types
    switch (message.type) {
      case 'task-assignment':
        await this.handleTaskAssignment(message);
        break;
        
      case 'test-request':
        await this.handleTestRequest(message);
        break;
        
      case 'coverage-request':
        await this.handleCoverageRequest(message);
        break;
        
      case 'validation-request':
        await this.handleValidationRequest(message);
        break;
        
      case 'status-request':
        await this.reportStatus();
        break;
        
      default:
        console.log(`   ℹ️  Message type '${message.type}' noted but no action required`);
    }
  }

  async handleTaskAssignment(message) {
    this.isRunning = true;
    console.log(`\n🎯 Task assigned: ${message.message}`);
    
    // Acknowledge task
    await this.writeToChannel('Task acknowledged. Beginning quality assurance process.', {
      type: 'task-acknowledged',
      taskId: message.taskid || 'unknown'
    });
    
    // Determine task type and execute
    if (message.message.includes('test') || message.message.includes('validation')) {
      await this.executeTestingTask(message);
    }
    
    this.isRunning = false;
  }

  async handleTestRequest(message) {
    console.log(`\n🧪 Test request received`);
    await this.runTests(message.target || 'all');
  }

  async handleCoverageRequest(message) {
    console.log(`\n📊 Coverage analysis requested`);
    await this.analyzeCoverage();
  }

  async handleValidationRequest(message) {
    console.log(`\n✅ Validation requested`);
    await this.validateQuality();
  }

  async executeTestingTask(message) {
    console.log(`\n⚡ Executing testing task...`);
    
    // Report progress
    await this.writeToChannel('Starting comprehensive test suite...', {
      type: 'task-progress',
      status: 'running'
    });
    
    // Check what test framework is available
    const testCommand = await this.detectTestCommand();
    
    if (testCommand) {
      console.log(`\n🧪 Running tests with: ${testCommand}`);
      
      try {
        const { stdout, stderr } = await execPromise(testCommand);
        
        console.log('\n📋 Test Results:');
        console.log(stdout);
        
        if (stderr) {
          console.error('Test errors:', stderr);
        }
        
        await this.writeToChannel('Test execution completed', {
          type: 'test-complete',
          status: 'success',
          summary: this.extractTestSummary(stdout)
        });
        
      } catch (error) {
        console.error(`\n❌ Test execution failed: ${error.message}`);
        
        await this.writeToChannel(`Test execution failed: ${error.message}`, {
          type: 'test-failed',
          status: 'error',
          error: error.message
        });
      }
    } else {
      console.log('\n⚠️  No test command found in package.json');
      
      await this.writeToChannel('No test command found. Please configure testing framework.', {
        type: 'test-config-missing',
        status: 'warning'
      });
    }
  }

  async detectTestCommand() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check for test scripts
      if (packageJson.scripts) {
        if (packageJson.scripts.test) {
          return 'npm test';
        }
        if (packageJson.scripts['test:unit']) {
          return 'npm run test:unit';
        }
        if (packageJson.scripts['test:all']) {
          return 'npm run test:all';
        }
      }
      
      // Check for common test frameworks
      if (packageJson.devDependencies) {
        if (packageJson.devDependencies.jest) {
          return 'npx jest';
        }
        if (packageJson.devDependencies.vitest) {
          return 'npx vitest run';
        }
        if (packageJson.devDependencies.mocha) {
          return 'npx mocha';
        }
      }
      
    } catch (error) {
      console.log('Could not read package.json');
    }
    
    return null;
  }

  extractTestSummary(output) {
    // Extract test summary from output (Jest/Vitest format)
    const summaryMatch = output.match(/Tests?:?\s*(\d+)\s*(passed|failed|total)/gi);
    const coverageMatch = output.match(/Coverage:?\s*(\d+(\.\d+)?%)/i);
    
    return {
      tests: summaryMatch ? summaryMatch.join(', ') : 'No summary found',
      coverage: coverageMatch ? coverageMatch[1] : 'Coverage not reported'
    };
  }

  async runTests(target = 'all') {
    const testCommand = await this.detectTestCommand();
    
    if (testCommand) {
      console.log(`Running tests for: ${target}`);
      
      try {
        const command = target === 'all' ? testCommand : `${testCommand} ${target}`;
        const { stdout } = await execPromise(command);
        console.log(stdout);
        
        await this.writeToChannel(`Tests completed for ${target}`, {
          type: 'test-result',
          target: target,
          status: 'complete'
        });
        
      } catch (error) {
        console.error(`Test failed: ${error.message}`);
        
        await this.writeToChannel(`Tests failed for ${target}: ${error.message}`, {
          type: 'test-result',
          target: target,
          status: 'failed'
        });
      }
    }
  }

  async analyzeCoverage() {
    console.log('Analyzing test coverage...');
    
    try {
      const { stdout } = await execPromise('npm run coverage || npm test -- --coverage');
      console.log(stdout);
      
      await this.writeToChannel('Coverage analysis complete', {
        type: 'coverage-result',
        status: 'complete'
      });
      
    } catch (error) {
      console.error(`Coverage analysis failed: ${error.message}`);
    }
  }

  async validateQuality() {
    console.log('Running quality validation checks...');
    
    const checks = [];
    
    // Run linting
    try {
      await execPromise('npm run lint || npx eslint .');
      checks.push({ name: 'Linting', status: 'passed' });
    } catch (error) {
      checks.push({ name: 'Linting', status: 'failed', error: error.message });
    }
    
    // Run type checking
    try {
      await execPromise('npm run typecheck || npx tsc --noEmit');
      checks.push({ name: 'Type checking', status: 'passed' });
    } catch (error) {
      checks.push({ name: 'Type checking', status: 'failed', error: error.message });
    }
    
    // Report results
    await this.writeToChannel('Quality validation complete', {
      type: 'validation-result',
      checks: checks
    });
  }

  async reportStatus() {
    await this.writeToChannel(`Testing agent active and monitoring`, {
      type: 'status-report',
      running: this.isRunning,
      capabilities: this.capabilities,
      terminal: this.terminalId
    });
  }

  async writeToChannel(message, metadata = {}) {
    const timestamp = new Date().toISOString();
    
    const entry = `
[${timestamp}] ${this.name}-${this.terminalId} → orchestrator
TYPE: ${metadata.type || 'info'}
STATUS: ${metadata.status || 'active'}
MESSAGE: ${message}
${metadata.taskId ? `TASKID: ${metadata.taskId}` : ''}
${metadata.summary ? `SUMMARY: ${JSON.stringify(metadata.summary)}` : ''}
${metadata.checks ? `CHECKS: ${JSON.stringify(metadata.checks)}` : ''}
---`;

    fs.appendFileSync(this.channelPath, entry + '\n');
  }
}

// Start the agent
const agent = new TestingAgent('4');
agent.start();

// Keep process alive
process.stdin.resume();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Testing Agent shutting down...');
  process.exit(0);
});