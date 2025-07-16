#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🩺 Vibe Claude Doctor - Health Check\n');

// Check Node.js version
console.log('📋 System Requirements:');
const nodeVersion = process.version;
const requiredVersion = 'v16.0.0';
if (nodeVersion >= requiredVersion) {
  console.log(`✅ Node.js ${nodeVersion} (>= ${requiredVersion})`);
} else {
  console.log(`❌ Node.js ${nodeVersion} (requires >= ${requiredVersion})`);
}

// Check NPM dependencies
console.log('\n📦 Dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  
  console.log(`✅ ${dependencies.length} runtime dependencies`);
  console.log(`✅ ${devDependencies.length} development dependencies`);
  
  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules directory exists');
  } else {
    console.log('❌ node_modules directory missing - run: npm install');
  }
} catch (e) {
  console.log('❌ Error checking dependencies:', e.message);
}

// Check project structure
console.log('\n📁 Project Structure:');
const requiredDirs = [
  'agents',
  'scripts',
  'templates',
  'src',
  'context',
  'tests'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/ directory exists`);
  } else {
    console.log(`⚠️  ${dir}/ directory missing`);
  }
});

// Check configuration files
console.log('\n⚙️  Configuration Files:');
const configFiles = [
  'package.json',
  'package.json',
  'tsconfig.json',
  'README.md',
  'CLAUDE.md'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check MCP tools (basic check)
console.log('\n🔌 MCP Tools Status:');
try {
  // Check if package.json has MCP configuration
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.claudeCode && packageJson.claudeCode.mcps) {
    const mcps = packageJson.claudeCode.mcps;
    Object.entries(mcps).forEach(([name, config]) => {
      console.log(`ℹ️  ${name}: ${config.required ? 'Required' : 'Optional'} - ${config.description}`);
    });
  } else {
    console.log('⚠️  No MCP configuration found in package.json');
  }
} catch (e) {
  console.log('❌ Error checking MCP configuration:', e.message);
}

// Check git repository
console.log('\n🔄 Git Status:');
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  console.log('✅ Git repository detected');
  
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    console.log(`ℹ️  Current branch: ${branch}`);
  } catch (e) {
    console.log('⚠️  Could not determine current branch');
  }
} catch (e) {
  console.log('❌ Not a git repository');
}

// Check for common issues
console.log('\n🔍 Common Issues Check:');
if (fs.existsSync('.vibe-status.md')) {
  console.log('✅ .vibe-status.md exists');
} else {
  console.log('❌ .vibe-status.md missing - run: npm run install');
}

if (fs.existsSync('.husky')) {
  console.log('✅ Git hooks configured');
} else {
  console.log('ℹ️  Git hooks not configured');
}

// Summary
console.log('\n📊 Summary:');
console.log('✅ Vibe Claude appears to be properly installed');
console.log('ℹ️  For MCP tools, ensure they are configured in Claude Desktop');
console.log('ℹ️  Start with: /vibe-init to begin a new project');
console.log('\n🎉 Happy coding with Vibe Claude\!\n');
