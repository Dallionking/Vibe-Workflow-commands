#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load claude.json
const claudeJsonPath = path.join(__dirname, '..', 'claude.json');
const claudeJson = JSON.parse(fs.readFileSync(claudeJsonPath, 'utf8'));

// Extract all agent file references from claude.json
const referencedAgents = new Set();

claudeJson.commands.forEach(command => {
  if (command.agent) {
    referencedAgents.add(command.agent);
  }
});

console.log('=== Missing Agent Files Report ===\n');
console.log(`Total agent files referenced in claude.json: ${referencedAgents.size}\n`);

// Check each referenced agent file
const missingAgents = [];
const existingAgents = [];

referencedAgents.forEach(agentPath => {
  const fullPath = path.join(__dirname, '..', agentPath);
  
  if (fs.existsSync(fullPath)) {
    existingAgents.push(agentPath);
  } else {
    missingAgents.push(agentPath);
  }
});

// Report results
console.log(`✅ Existing agent files: ${existingAgents.length}`);
console.log(`❌ Missing agent files: ${missingAgents.length}\n`);

if (missingAgents.length > 0) {
  console.log('Missing agent files:');
  console.log('-------------------');
  missingAgents.forEach((agent, index) => {
    console.log(`${index + 1}. ${agent}`);
    const command = claudeJson.commands.find(cmd => cmd.agent === agent);
    if (command) {
      console.log(`   Command: ${command.name}`);
      console.log(`   Description: ${command.description}`);
    }
    console.log('');
  });
  
  // Group missing files by directory
  const missingByDir = {};
  missingAgents.forEach(agent => {
    const dir = path.dirname(agent);
    if (!missingByDir[dir]) {
      missingByDir[dir] = [];
    }
    missingByDir[dir].push(path.basename(agent));
  });
  
  console.log('\nMissing files grouped by directory:');
  console.log('-----------------------------------');
  Object.entries(missingByDir).forEach(([dir, files]) => {
    console.log(`\n${dir}/`);
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  });
  
  // Create a list of mkdir and touch commands to create missing files
  console.log('\n\nCommands to create missing files:');
  console.log('=================================');
  
  // First, create directories
  const uniqueDirs = [...new Set(missingAgents.map(agent => path.dirname(agent)))];
  uniqueDirs.forEach(dir => {
    console.log(`mkdir -p "${dir}"`);
  });
  
  console.log('');
  
  // Then create files
  missingAgents.forEach(agent => {
    console.log(`touch "${agent}"`);
  });
  
} else {
  console.log('✅ All agent files referenced in claude.json exist!');
}

// Also check for agent files that exist but aren't referenced
console.log('\n\n=== Orphaned Agent Files Report ===\n');

const findAgentFiles = (dir, baseDir = '') => {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(baseDir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...findAgentFiles(fullPath, relativePath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(relativePath);
    }
  });
  
  return files;
};

const agentsDir = path.join(__dirname, '..', 'agents');
if (fs.existsSync(agentsDir)) {
  const allAgentFiles = findAgentFiles(agentsDir, 'agents');
  
  const orphanedFiles = allAgentFiles.filter(file => !referencedAgents.has(file));
  
  console.log(`Total .md files in agents/ directory: ${allAgentFiles.length}`);
  console.log(`Files referenced in claude.json: ${referencedAgents.size}`);
  console.log(`Orphaned files (exist but not referenced): ${orphanedFiles.length}\n`);
  
  if (orphanedFiles.length > 0) {
    console.log('Orphaned agent files:');
    console.log('--------------------');
    orphanedFiles.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
  }
}

// Summary
console.log('\n\n=== Summary ===');
console.log(`Missing files that need to be created: ${missingAgents.length}`);
console.log(`Existing files that are working: ${existingAgents.length}`);
if (fs.existsSync(agentsDir)) {
  const allAgentFiles = findAgentFiles(agentsDir, 'agents');
  const orphanedFiles = allAgentFiles.filter(file => !referencedAgents.has(file));
  console.log(`Orphaned files that could be removed: ${orphanedFiles.length}`);
}

process.exit(missingAgents.length > 0 ? 1 : 0);