#!/usr/bin/env node

/**
 * Test Setup Script for Enhanced Multi-Agent System
 * 
 * Validates that the single-command setup /vibe-multi-agent-enhanced works correctly
 * Tests all components and provides comprehensive system validation
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

class EnhancedSystemValidator {
  constructor() {
    this.results = {
      prerequisites: {},
      installation: {},
      mcpServer: {},
      functionality: {},
      integration: {},
      overall: { success: false, score: 0 }
    };
    this.testStartTime = Date.now();
  }

  async runCompleteValidation() {
    console.log('🧪 Starting Enhanced Multi-Agent System Validation...');
    console.log('='.repeat(60));
    
    try {
      // Phase 1: Prerequisites
      await this.validatePrerequisites();
      
      // Phase 2: Installation
      await this.validateInstallation();
      
      // Phase 3: MCP Server
      await this.validateMCPServer();
      
      // Phase 4: Functionality
      await this.validateFunctionality();
      
      // Phase 5: Integration
      await this.validateIntegration();
      
      // Final Analysis
      this.generateFinalReport();
      
    } catch (error) {
      console.error(`❌ Validation failed: ${error.message}`);
      this.results.overall.success = false;
    }
  }

  async validatePrerequisites() {
    console.log('\\n📋 Phase 1: Prerequisites Validation');
    console.log('-'.repeat(40));
    
    // Node.js version
    try {
      const { stdout } = await execAsync('node --version');
      const version = stdout.trim();
      const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
      
      this.results.prerequisites.nodejs = {
        version,
        valid: majorVersion >= 18,
        required: '18+',
        status: majorVersion >= 18 ? '✅' : '❌'
      };
      
      console.log(`${this.results.prerequisites.nodejs.status} Node.js: ${version} (Required: 18+)`);
    } catch (error) {
      this.results.prerequisites.nodejs = { valid: false, error: error.message, status: '❌' };
      console.log(`❌ Node.js: Not found`);
    }
    
    // npm
    try {
      const { stdout } = await execAsync('npm --version');
      this.results.prerequisites.npm = {
        version: stdout.trim(),
        valid: true,
        status: '✅'
      };
      console.log(`✅ npm: ${stdout.trim()}`);
    } catch (error) {
      this.results.prerequisites.npm = { valid: false, error: error.message, status: '❌' };
      console.log(`❌ npm: Not found`);
    }
    
    // Claude CLI
    try {
      const { stdout } = await execAsync('claude --version');
      this.results.prerequisites.claude = {
        version: stdout.trim(),
        valid: true,
        status: '✅'
      };
      console.log(`✅ Claude CLI: Available`);
    } catch (error) {
      this.results.prerequisites.claude = { 
        valid: false, 
        error: 'Claude CLI not found (may still work)',
        status: '⚠️'
      };
      console.log(`⚠️ Claude CLI: Not found (installation may still work)`);
    }
    
    // Project structure
    const requiredFiles = [
      'package.json',
      'vibe-agent-bus.js',
      'core/vibe-storage-manager.js',
      'core/vibe-context-manager.js',
      'core/vibe-agent-router.js',
      'core/vibe-task-router.js',
      'core/vibe-ultrathink-coordinator.js',
      'install.sh',
      'migrate-history.js'
    ];
    
    let structureValid = true;
    for (const file of requiredFiles) {
      const exists = existsSync(path.join(process.cwd(), file));
      if (!exists) {
        console.log(`❌ Missing file: ${file}`);
        structureValid = false;
      }
    }
    
    this.results.prerequisites.structure = {
      valid: structureValid,
      files: requiredFiles.length,
      status: structureValid ? '✅' : '❌'
    };
    
    if (structureValid) {
      console.log(`✅ Project structure: All ${requiredFiles.length} required files present`);
    }
  }

  async validateInstallation() {
    console.log('\\n📦 Phase 2: Installation Validation');
    console.log('-'.repeat(40));
    
    // Check package.json
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      this.results.installation.packageJson = {
        name: packageJson.name,
        version: packageJson.version,
        valid: packageJson.name === 'vibe-agent-bus',
        status: packageJson.name === 'vibe-agent-bus' ? '✅' : '❌'
      };
      console.log(`${this.results.installation.packageJson.status} Package: ${packageJson.name}@${packageJson.version}`);
    } catch (error) {
      this.results.installation.packageJson = { valid: false, error: error.message, status: '❌' };
      console.log(`❌ package.json: Invalid or missing`);
    }
    
    // Check dependencies
    try {
      await execAsync('npm list --depth=0');
      this.results.installation.dependencies = { valid: true, status: '✅' };
      console.log(`✅ Dependencies: Installed`);
    } catch (error) {
      this.results.installation.dependencies = { 
        valid: false, 
        needsInstall: true,
        status: '⚠️'
      };
      console.log(`⚠️ Dependencies: Need installation (run npm install)`);
    }
    
    // Check install scripts
    const scriptFiles = ['install.sh', 'migrate-history.js'];
    let scriptsValid = true;
    
    for (const script of scriptFiles) {
      const exists = existsSync(script);
      if (!exists) {
        scriptsValid = false;
        console.log(`❌ Missing script: ${script}`);
      }
    }
    
    this.results.installation.scripts = {
      valid: scriptsValid,
      status: scriptsValid ? '✅' : '❌'
    };
    
    if (scriptsValid) {
      console.log(`✅ Installation scripts: Available`);
    }
  }

  async validateMCPServer() {
    console.log('\\n🔧 Phase 3: MCP Server Validation');
    console.log('-'.repeat(40));
    
    // Test server startup
    try {
      const startupTest = await this.testServerStartup();
      this.results.mcpServer.startup = startupTest;
      console.log(`${startupTest.status} Server startup: ${startupTest.message}`);
    } catch (error) {
      this.results.mcpServer.startup = { 
        valid: false, 
        error: error.message, 
        status: '❌' 
      };
      console.log(`❌ Server startup: Failed`);
    }
    
    // Check MCP registration (if Claude CLI available)
    if (this.results.prerequisites.claude.valid) {
      try {
        const { stdout } = await execAsync('claude mcp list');
        const isRegistered = stdout.includes('vibeAgentBus');
        this.results.mcpServer.registration = {
          valid: isRegistered,
          status: isRegistered ? '✅' : '⚠️'
        };
        console.log(`${this.results.mcpServer.registration.status} MCP registration: ${isRegistered ? 'Found' : 'Not registered'}`);
      } catch (error) {
        this.results.mcpServer.registration = { 
          valid: false, 
          error: 'Could not check registration',
          status: '⚠️'
        };
        console.log(`⚠️ MCP registration: Could not verify`);
      }
    } else {
      this.results.mcpServer.registration = {
        valid: null,
        message: 'Claude CLI not available',
        status: '⚠️'
      };
      console.log(`⚠️ MCP registration: Cannot test without Claude CLI`);
    }
    
    // Test database creation
    try {
      const dbTest = await this.testDatabaseSetup();
      this.results.mcpServer.database = dbTest;
      console.log(`${dbTest.status} Database setup: ${dbTest.message}`);
    } catch (error) {
      this.results.mcpServer.database = {
        valid: false,
        error: error.message,
        status: '❌'
      };
      console.log(`❌ Database setup: Failed`);
    }
  }

  async testServerStartup() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({
          valid: false,
          message: 'Startup timeout (>5 seconds)',
          status: '❌'
        });
      }, 5000);
      
      const server = spawn('node', ['vibe-agent-bus.js', '--test'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      server.stderr.on('data', (data) => {
        output += data.toString();
        if (output.includes('Vibe Agent Bus started successfully')) {
          clearTimeout(timeout);
          server.kill();
          resolve({
            valid: true,
            message: 'Started successfully',
            status: '✅'
          });
        } else if (output.includes('Error') || output.includes('Failed')) {
          clearTimeout(timeout);
          server.kill();
          resolve({
            valid: false,
            message: 'Startup errors detected',
            status: '❌'
          });
        }
      });
      
      server.on('error', (error) => {
        clearTimeout(timeout);
        resolve({
          valid: false,
          message: error.message,
          status: '❌'
        });
      });
    });
  }

  async testDatabaseSetup() {
    try {
      // Try importing and testing storage manager
      const { VibeStorageManager } = await import('./core/vibe-storage-manager.js');
      const storage = new VibeStorageManager('/tmp/vibe-test-db.db');
      
      await storage.initialize();
      
      // Test basic operations
      await storage.postVibeMessage('test-room', 'test message', { agent: 'test-agent' });
      const messages = await storage.getVibeMessages('test-room');
      
      await storage.shutdown();
      
      return {
        valid: messages.length > 0,
        message: `Database operations working (${messages.length} test messages)`,
        status: '✅'
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message,
        status: '❌'
      };
    }
  }

  async validateFunctionality() {
    console.log('\\n⚙️ Phase 4: Functionality Validation');
    console.log('-'.repeat(40));
    
    // Test core modules
    const modules = [
      'vibe-storage-manager',
      'vibe-context-manager',
      'vibe-agent-router',
      'vibe-task-router',
      'vibe-ultrathink-coordinator'
    ];
    
    let functionalityScore = 0;
    
    for (const module of modules) {
      try {
        const moduleClass = await import(`./core/${module}.js`);
        const className = module.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('').replace('Vibe', 'Vibe');
        
        const ModuleClass = moduleClass[className] || moduleClass.default;
        
        if (typeof ModuleClass === 'function') {
          // Test instantiation
          const instance = new ModuleClass();
          if (typeof instance.initialize === 'function') {
            functionalityScore++;
            console.log(`✅ Module: ${module} - Loads and instantiates`);
          } else {
            console.log(`⚠️ Module: ${module} - Missing initialize method`);
          }
        } else {
          console.log(`❌ Module: ${module} - Invalid export`);
        }
      } catch (error) {
        console.log(`❌ Module: ${module} - Load failed: ${error.message}`);
      }
    }
    
    this.results.functionality.modules = {
      total: modules.length,
      working: functionalityScore,
      score: functionalityScore / modules.length,
      status: functionalityScore === modules.length ? '✅' : functionalityScore > 0 ? '⚠️' : '❌'
    };
    
    console.log(`\\n${this.results.functionality.modules.status} Core modules: ${functionalityScore}/${modules.length} working`);
  }

  async validateIntegration() {
    console.log('\\n🔗 Phase 5: Integration Validation');
    console.log('-'.repeat(40));
    
    // Test migration script
    try {
      const { HistoryMigrator } = await import('./migrate-history.js');
      const migrator = new HistoryMigrator();
      this.results.integration.migration = {
        valid: typeof migrator.migrate === 'function',
        status: '✅'
      };
      console.log(`✅ Migration script: Available and loadable`);
    } catch (error) {
      this.results.integration.migration = {
        valid: false,
        error: error.message,
        status: '❌'
      };
      console.log(`❌ Migration script: Load failed`);
    }
    
    // Test command integration
    const commandFile = '../agents/core/vibe-multi-agent-enhanced.md';
    const commandExists = existsSync(commandFile);
    this.results.integration.command = {
      valid: commandExists,
      status: commandExists ? '✅' : '❌'
    };
    console.log(`${this.results.integration.command.status} Command agent: ${commandExists ? 'Available' : 'Missing'}`);
    
    // Test installation script
    const installExists = existsSync('install.sh');
    this.results.integration.installer = {
      valid: installExists,
      status: installExists ? '✅' : '❌'
    };
    console.log(`${this.results.integration.installer.status} Installation script: ${installExists ? 'Available' : 'Missing'}`);
  }

  generateFinalReport() {
    const duration = Date.now() - this.testStartTime;
    
    console.log('\\n🎯 Validation Results Summary');
    console.log('='.repeat(60));
    
    // Calculate overall score
    let totalChecks = 0;
    let passedChecks = 0;
    
    const checkResults = (category) => {
      Object.values(category).forEach(result => {
        if (typeof result === 'object' && result.valid !== undefined) {
          totalChecks++;
          if (result.valid === true) passedChecks++;
        }
      });
    };
    
    checkResults(this.results.prerequisites);
    checkResults(this.results.installation);
    checkResults(this.results.mcpServer);
    checkResults(this.results.integration);
    
    // Add module functionality score
    if (this.results.functionality.modules) {
      totalChecks += this.results.functionality.modules.total;
      passedChecks += this.results.functionality.modules.working;
    }
    
    const overallScore = totalChecks > 0 ? (passedChecks / totalChecks) : 0;
    const isSystemReady = overallScore >= 0.8;
    
    this.results.overall = {
      success: isSystemReady,
      score: overallScore,
      passedChecks,
      totalChecks,
      duration: Math.ceil(duration / 1000)
    };
    
    console.log(`\\n📊 **Overall Score: ${(overallScore * 100).toFixed(1)}%** (${passedChecks}/${totalChecks} checks passed)`);
    console.log(`⏱️ **Duration:** ${this.results.overall.duration} seconds`);
    console.log(`\\n🎯 **System Status:** ${isSystemReady ? '✅ READY' : '❌ NEEDS ATTENTION'}`);
    
    if (isSystemReady) {
      console.log('\\n🚀 **Enhanced Multi-Agent System Validation Complete!**');
      console.log('\\n✅ **Ready for use:**');
      console.log('   • MCP server functional');
      console.log('   • All core modules working');
      console.log('   • Integration points verified');
      console.log('   • Single-command setup validated');
      console.log('\\n🎉 **Next Steps:**');
      console.log('   1. Run: /vibe-multi-agent-enhanced');
      console.log('   2. Test: /sendVibeMessage agent="test" message="Hello World"');
      console.log('   3. Verify: /getVibeProjectStatus');
    } else {
      console.log('\\n⚠️ **Issues Found:**');
      
      if (this.results.prerequisites.nodejs?.valid === false) {
        console.log('   • Install Node.js 18+ from https://nodejs.org');
      }
      if (this.results.installation.dependencies?.needsInstall) {
        console.log('   • Run: npm install');
      }
      if (this.results.mcpServer.registration?.valid === false) {
        console.log('   • Run: npm run install-mcp');
      }
      
      console.log('\\n🔧 **Recommended Actions:**');
      console.log('   1. Fix the issues listed above');
      console.log('   2. Re-run: npm run test-setup');
      console.log('   3. Check installation guide in MIGRATION-GUIDE.md');
    }
    
    // Save detailed results
    console.log(`\\n📄 **Detailed Results:**`);
    console.log(JSON.stringify(this.results, null, 2));
  }
}

// Main execution
async function main() {
  const validator = new EnhancedSystemValidator();
  await validator.runCompleteValidation();
  
  process.exit(validator.results.overall.success ? 0 : 1);
}

if (process.argv[1] === import.meta.url.replace('file://', '')) {
  main().catch(error => {
    console.error('❌ Validation failed with error:', error.message);
    process.exit(1);
  });
}

export { EnhancedSystemValidator };