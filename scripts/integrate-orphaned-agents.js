#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Script to integrate orphaned agent files into claude.json
 * Adds useful utility commands that were developed but not registered
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Integrating orphaned agents into Vibe Workflow...\n');

// Load current claude.json
const claudeJsonPath = path.join(__dirname, '..', 'claude.json');
const claudeConfig = JSON.parse(fs.readFileSync(claudeJsonPath, 'utf8'));

// Define orphaned agents to integrate
const orphanedAgents = [
  {
    name: "vibe-system-update",
    description: "Update entire Vibe Coding system to latest version",
    agent: "agents/utilities/system-updater.md",
    parameters: ["--check", "--force", "--backup", "--branch", "--dry-run"],
    outputs: ["updated system", "backup", "update report"],
    mcps: []
  },
  {
    name: "vibe-mark-task-complete",
    description: "Mark tasks as complete in phase documents when Claude forgets",
    agent: "agents/utilities/task-marker.md",
    parameters: ["--phase", "--task", "--subtask", "--all-tier", "--interactive"],
    outputs: ["updated phase documents", "progress report"],
    mcps: []
  },
  {
    name: "vibe-step-1-orchestrator",
    description: "Advanced orchestrator for Step 1 ideation with multi-agent coordination",
    agent: "agents/step-1-ideation/orchestrator.md",
    requires: [".vibe-status.md"],
    outputs: ["orchestrated ideation", "multi-agent coordination"],
    mcps: ["context7", "perplexity", "sequential-thinking"]
  },
  {
    name: "vibe-step-2-orchestrator", 
    description: "Advanced orchestrator for Step 2 architecture with specialized agents",
    agent: "agents/step-2-architecture/orchestrator.md",
    requires: ["docs/01-project-specification.md"],
    outputs: ["orchestrated architecture", "multi-agent analysis"],
    mcps: ["context7", "perplexity", "sequential-thinking"]
  },
  {
    name: "vibe-slice-generator",
    description: "Alternative vertical slice generator with enhanced features",
    agent: "agents/step-8-vertical-slices/slice-generator.md",
    requires: ["docs/06-technical-specification.md"],
    outputs: ["enhanced vertical slices", "alternative implementations"],
    mcps: ["context7", "sequential-thinking"]
  }
];

// Check which agents already exist
let addedCount = 0;
let skippedCount = 0;

orphanedAgents.forEach(agent => {
  const exists = claudeConfig.commands.some(cmd => cmd.name === agent.name);
  
  if (exists) {
    console.log(`⚠️  Skipping ${agent.name} - already exists in claude.json`);
    skippedCount++;
  } else {
    // Verify the agent file exists
    const agentPath = path.join(__dirname, '..', agent.agent);
    if (!fs.existsSync(agentPath)) {
      console.log(`❌ Cannot add ${agent.name} - agent file not found: ${agent.agent}`);
      return;
    }
    
    // Add to commands array
    claudeConfig.commands.push(agent);
    console.log(`✅ Added ${agent.name} to claude.json`);
    addedCount++;
  }
});

// Sort commands alphabetically by name for consistency
claudeConfig.commands.sort((a, b) => a.name.localeCompare(b.name));

// Write updated claude.json
if (addedCount > 0) {
  fs.writeFileSync(claudeJsonPath, JSON.stringify(claudeConfig, null, 2) + '\n');
  console.log(`\n✨ Integration complete! Added ${addedCount} new commands.`);
  console.log('\n📋 Next steps:');
  console.log('  1. Run: node scripts/generate-slash-commands.js');
  console.log('  2. The new commands will be available in Claude Code');
  console.log('\n🎯 New commands added:');
  orphanedAgents
    .filter(agent => !claudeConfig.commands.some(cmd => cmd.name === agent.name))
    .forEach(agent => {
      console.log(`  - /${agent.name}`);
    });
} else {
  console.log('\nℹ️  No new agents were added (all already integrated or missing files).');
}

// Report on remaining orphaned files
console.log('\n📊 Orphaned files status:');
console.log(`  - Integrated: ${addedCount}`);
console.log(`  - Already exists: ${skippedCount}`);
console.log(`  - Still orphaned: ${14 - addedCount - skippedCount} (may be YAML agents or deprecated)`);

// Suggest YAML agent migration
if (fs.existsSync(path.join(__dirname, '..', 'agents', 'yaml-based'))) {
  console.log('\n💡 Note: YAML-based agents are managed separately and don\'t need claude.json entries.');
  console.log('   See docs/YAML-AGENT-SYSTEM.md for more information.');
}