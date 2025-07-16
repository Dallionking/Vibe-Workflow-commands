#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Installing Vibe Coding Claude...\n');

// Check Node.js version
const nodeVersion = process.version;
const requiredVersion = 'v16.0.0';
if (nodeVersion < requiredVersion) {
  console.error(`❌ Node.js ${requiredVersion} or higher is required. You have ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js ${nodeVersion} is compatible`);

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

console.log('\n✨ Installation complete!');
console.log('\n📚 Next steps:');
console.log('  1. Ensure Claude Desktop has MCP tools configured');
console.log('  2. Run: npm run doctor (to check MCP connections)');
console.log('  3. Start with: /vibe-init to begin a new project');
console.log('\nHappy coding! 🎉\n');
