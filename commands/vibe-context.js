#!/usr/bin/env node

/**
 * Vibe Context Commands
 * Main interface for context engineering functionality
 * 
 * Usage: /vibe-context <command> [options]
 */

const { 
  contextAnalyze, 
  contextOptimize, 
  contextValidate, 
  contextMemory 
} = require('./context-engineering');

/**
 * Main vibe-context command handler
 */
async function vibeContext(command, options = {}) {
  console.log('🔧 Vibe Context Engineering');
  console.log('===========================\n');
  
  switch (command) {
    case 'analyze':
      console.log('📊 Running context analysis...\n');
      return await contextAnalyze(options);
      
    case 'optimize':
      console.log('⚡ Running context optimization...\n');
      return await contextOptimize(options);
      
    case 'validate':
      console.log('✅ Running context validation...\n');
      return await contextValidate(options);
      
    case 'memory':
      console.log('🧠 Managing context memory...\n');
      return await contextMemory(options);
      
    default:
      console.log('Available Commands:');
      console.log('==================');
      console.log('');
      console.log('/vibe-context analyze   - Analyze current context state');
      console.log('/vibe-context optimize  - Optimize context performance');
      console.log('/vibe-context validate  - Validate context integrity');
      console.log('/vibe-context memory    - Manage context memory and learning');
      console.log('');
      console.log('Examples:');
      console.log('  /vibe-context analyze');
      console.log('  /vibe-context memory status');
      console.log('  /vibe-context optimize --verbose');
      console.log('');
      return { error: 'No command specified' };
  }
}

/**
 * Export for use by claude.json
 */
module.exports = {
  vibeContext,
  // Re-export individual commands for direct access
  contextAnalyze,
  contextOptimize,
  contextValidate,
  contextMemory
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const subcommand = process.argv[3];
  const options = {
    verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
    action: subcommand
  };
  
  async function runCommand() {
    try {
      const result = await vibeContext(command, options);
      if (result?.error) {
        console.error('❌ Command failed:', result.error);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error.message);
      process.exit(1);
    }
  }
  
  runCommand();
}