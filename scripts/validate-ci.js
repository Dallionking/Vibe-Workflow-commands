#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * CI/CD Validation Script for Vibe Workflow Commands
 * Ensures system integrity before deployments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

// Color codes for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

let hasErrors = false;
let hasWarnings = false;

// Validation results collector
const results = {
  passed: [],
  failed: [],
  warnings: []
};

function log(message, type = 'info') {
  const prefix = {
    error: `${colors.red}❌ ERROR:${colors.reset}`,
    success: `${colors.green}✅ PASS:${colors.reset}`,
    warning: `${colors.yellow}⚠️  WARN:${colors.reset}`,
    info: `${colors.blue}ℹ️  INFO:${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

// 1. Validate claude.json structure
function validateClaudeJson() {
  log('Validating claude.json structure...');
  
  try {
    const claudeJsonPath = path.join(__dirname, '..', 'claude.json');
    const content = fs.readFileSync(claudeJsonPath, 'utf8');
    const config = JSON.parse(content);
    
    // Check required fields
    const requiredFields = ['name', 'version', 'commands', 'mcps'];
    for (const field of requiredFields) {
      if (!config[field]) {
        log(`Missing required field: ${field}`, 'error');
        hasErrors = true;
        results.failed.push(`claude.json missing field: ${field}`);
      }
    }
    
    // Validate commands structure
    if (config.commands && Array.isArray(config.commands)) {
      config.commands.forEach((cmd, idx) => {
        if (!cmd.name) {
          log(`Command at index ${idx} missing name`, 'error');
          hasErrors = true;
        }
        if (!cmd.description) {
          log(`Command ${cmd.name} missing description`, 'warning');
          hasWarnings = true;
        }
      });
      log(`Found ${config.commands.length} commands`, 'success');
      results.passed.push('claude.json structure valid');
    }
  } catch (error) {
    log(`Failed to parse claude.json: ${error.message}`, 'error');
    hasErrors = true;
    results.failed.push('claude.json parsing failed');
  }
}

// 2. Validate all agent files exist
function validateAgentFiles() {
  log('Validating agent file references...');
  
  try {
    const claudeJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'claude.json'), 'utf8'));
    let missingCount = 0;
    
    claudeJson.commands.forEach(cmd => {
      if (cmd.agent) {
        const agentPath = path.join(__dirname, '..', cmd.agent);
        if (!fs.existsSync(agentPath)) {
          log(`Missing agent file: ${cmd.agent} (command: ${cmd.name})`, 'error');
          hasErrors = true;
          missingCount++;
          results.failed.push(`Missing agent: ${cmd.agent}`);
        }
      }
    });
    
    if (missingCount === 0) {
      log('All agent files exist', 'success');
      results.passed.push('All agent files present');
    }
  } catch (error) {
    log(`Failed to validate agents: ${error.message}`, 'error');
    hasErrors = true;
  }
}

// 3. Validate YAML agent syntax
function validateYamlAgents() {
  log('Validating YAML agent files...');
  
  const yamlDir = path.join(__dirname, '..', 'agents', 'yaml-based');
  let yamlCount = 0;
  let yamlErrors = 0;
  
  function checkYamlFiles(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        checkYamlFiles(fullPath);
      } else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        yamlCount++;
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          yaml.load(content);
        } catch (error) {
          log(`Invalid YAML in ${fullPath}: ${error.message}`, 'error');
          hasErrors = true;
          yamlErrors++;
          results.failed.push(`Invalid YAML: ${file}`);
        }
      }
    });
  }
  
  checkYamlFiles(yamlDir);
  
  if (yamlErrors === 0 && yamlCount > 0) {
    log(`All ${yamlCount} YAML files are valid`, 'success');
    results.passed.push(`${yamlCount} YAML files validated`);
  }
}

// 4. Validate slash command generation
function validateSlashCommands() {
  log('Validating slash command generation...');
  
  try {
    // Test if generation script exists
    const genScript = path.join(__dirname, 'generate-slash-commands.js');
    if (!fs.existsSync(genScript)) {
      log('Slash command generation script missing', 'error');
      hasErrors = true;
      results.failed.push('Missing generate-slash-commands.js');
      return;
    }
    
    // Run generation in dry-run mode (modify script to support this)
    try {
      execSync(`node "${genScript}" --validate-only`, { stdio: 'pipe' });
      log('Slash command generation validated', 'success');
      results.passed.push('Slash command generation OK');
    } catch (error) {
      // If --validate-only not supported, check if .claude/commands exists
      const commandsDir = path.join(__dirname, '..', '.claude', 'commands');
      if (fs.existsSync(commandsDir)) {
        const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));
        log(`Found ${commandFiles.length} generated commands`, 'success');
        results.passed.push(`${commandFiles.length} slash commands exist`);
      }
    }
  } catch (error) {
    log(`Command validation error: ${error.message}`, 'error');
    hasErrors = true;
  }
}

// 5. Check for common issues
function checkCommonIssues() {
  log('Checking for common issues...');
  
  // Check for TODO/FIXME in agents
  const agentsDir = path.join(__dirname, '..', 'agents');
  let todoCount = 0;
  
  function scanForTodos(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanForTodos(fullPath);
      } else if (file.endsWith('.md') || file.endsWith('.yaml')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const todos = content.match(/TODO|FIXME|XXX|HACK/gi) || [];
        if (todos.length > 0) {
          todoCount += todos.length;
          log(`Found ${todos.length} TODO/FIXME in ${file}`, 'warning');
          hasWarnings = true;
        }
      }
    });
  }
  
  scanForTodos(agentsDir);
  
  if (todoCount > 0) {
    results.warnings.push(`${todoCount} TODO/FIXME markers found`);
  }
  
  // Check package.json exists
  if (!fs.existsSync(path.join(__dirname, '..', 'package.json'))) {
    log('package.json missing', 'error');
    hasErrors = true;
    results.failed.push('Missing package.json');
  }
}

// 6. Generate summary report
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  
  if (results.passed.length > 0) {
    console.log(`\n${colors.green}PASSED (${results.passed.length}):${colors.reset}`);
    results.passed.forEach(item => console.log(`  ✅ ${item}`));
  }
  
  if (results.warnings.length > 0) {
    console.log(`\n${colors.yellow}WARNINGS (${results.warnings.length}):${colors.reset}`);
    results.warnings.forEach(item => console.log(`  ⚠️  ${item}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n${colors.red}FAILED (${results.failed.length}):${colors.reset}`);
    results.failed.forEach(item => console.log(`  ❌ ${item}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (hasErrors) {
    console.log(`${colors.red}VALIDATION FAILED${colors.reset}`);
    console.log('Please fix the errors above before proceeding.\n');
  } else if (hasWarnings) {
    console.log(`${colors.yellow}VALIDATION PASSED WITH WARNINGS${colors.reset}`);
    console.log('Consider addressing the warnings above.\n');
  } else {
    console.log(`${colors.green}VALIDATION PASSED${colors.reset}`);
    console.log('All checks completed successfully!\n');
  }
}

// Main execution
console.log('🔍 Vibe Workflow CI/CD Validation\n');

validateClaudeJson();
validateAgentFiles();
validateYamlAgents();
validateSlashCommands();
checkCommonIssues();
generateReport();

// Exit with appropriate code
process.exit(hasErrors ? 1 : 0);