#!/usr/bin/env node

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Installing Vibe Coding Claude...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
const requiredVersion = 'v16.0.0';
const recommendedVersion = 'v20.0.0';
const isV24OrHigher = majorVersion >= 24;

if (nodeVersion < requiredVersion) {
  console.error(`❌ Node.js ${requiredVersion} or higher is required. You have ${nodeVersion}`);
  process.exit(1);
}

if (isV24OrHigher) {
  console.log(`⚠️  Node.js ${nodeVersion} detected - Multi-agent features require Node.js v20`);
  console.log('   The core Vibe commands will work, but enhanced multi-agent system requires Node.js v20');
  console.log('   To get full functionality, consider using nvm to install Node.js v20');
} else if (nodeVersion < recommendedVersion) {
  console.log(`✅ Node.js ${nodeVersion} is compatible`);
  console.log('   (Node.js v20 recommended for best performance)');
} else {
  console.log(`✅ Node.js ${nodeVersion} is fully compatible`);
}

// Create necessary directories
const dirs = [
  '.vibe',
  'docs/vibe-coding',
  '.workflow/context',
  'multi-agent/sessions'
];

console.log('\n📁 Creating directories...');
dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`ℹ️  Directory exists: ${dir}`);
  }
});

// Initialize status files
console.log('\n📄 Setting up status files...');
const statusFile = path.join(process.cwd(), '.vibe-status.md');
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, `# Vibe Coding Status

## Current Progress
- [ ] Step 1: Feature Ideation & Clarification
- [ ] Step 2: Architecture Definition
- [ ] Step 2.5: MCP Setup
- [ ] Step 3: UX Design & User Flow
- [ ] Step 4: Design System & Component Library
- [ ] Step 5: Interface States & Error Handling
- [ ] Step 6: Technical Specification
- [ ] Step 7: Landing Page & Marketing
- [ ] Step 8: Vertical Slices (Development Phases)
- [ ] Step 9: CLAUDE.md Documentation
- [ ] Step 10: Service Initialization

## Project Info
- **Created**: ${new Date().toISOString()}
- **Status**: Not Started
`);
  console.log('✅ Created .vibe-status.md');
} else {
  console.log('ℹ️  .vibe-status.md already exists');
}

// Setup git hooks if in git repository
console.log('\n🔧 Setting up git hooks...');
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  if (fs.existsSync(path.join(process.cwd(), 'scripts/setup-hooks.js'))) {
    execSync('node scripts/setup-hooks.js', { stdio: 'inherit' });
  } else {
    console.log('ℹ️  setup-hooks.js not found, skipping hooks setup');
  }
} catch (e) {
  console.log('ℹ️  Not a git repository, skipping hooks setup');
}

// Generate slash commands for Claude Code
console.log('\n🎯 Generating Claude Code slash commands...');
const generateCommandsScript = path.join(process.cwd(), 'scripts/generate-slash-commands.js');
if (fs.existsSync(generateCommandsScript)) {
  try {
    execSync(`node "${generateCommandsScript}"`, { stdio: 'inherit' });
    console.log('✅ Slash commands generated successfully');
  } catch (e) {
    console.error('❌ Failed to generate slash commands:', e.message);
  }
} else {
  console.log('⚠️  generate-slash-commands.js not found, skipping command generation');
}

// Check multi-agent installation
console.log('\n🤖 Checking multi-agent system...');
if (isV24OrHigher) {
  console.log('⚠️  Multi-agent MCP server requires Node.js v20 (you have v24+)');
  console.log('   To enable enhanced multi-agent features:');
  console.log('   1. Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash');
  console.log('   2. Install Node.js v20: nvm install 20');
  console.log('   3. Use Node.js v20: nvm use 20');
  console.log('   4. Run: cd multi-agent && ./install.sh');
} else {
  console.log('✅ Your Node.js version supports the multi-agent system');
  console.log('   To install: cd multi-agent && ./install.sh');
}

console.log('\n✨ Installation complete!');

// Summary based on Node.js version
if (isV24OrHigher) {
  console.log('\n📋 Installation Summary:');
  console.log('  ✅ Core Vibe-Workflow-commands installed');
  console.log('  ✅ 86 slash commands available');
  console.log('  ✅ Project structure created');
  console.log('  ⚠️  Multi-agent features require Node.js v20');
  console.log('\n📚 What you can do now:');
  console.log('  • Use all 86 Vibe slash commands');
  console.log('  • Run the complete Vibe methodology');
  console.log('  • Create and manage projects');
  console.log('\n📚 To enable multi-agent features:');
  console.log('  • Switch to Node.js v20 using nvm');
  console.log('  • Then run: cd multi-agent && ./install.sh');
} else {
  console.log('\n📚 Next steps:');
  console.log('  1. Install multi-agent system: cd multi-agent && ./install.sh');
  console.log('  2. Ensure Claude Desktop has MCP tools configured');
  console.log('  3. Run: npm run doctor (to check MCP connections)');
  console.log('  4. Start with: /vibe-init to begin a new project');
}

console.log('\nHappy coding! 🎉\n');
