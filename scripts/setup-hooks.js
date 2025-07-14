#!/usr/bin/env node

/**
 * Git Hooks Setup
 * Configure git hooks for the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🆕 Setting up git hooks...');

try {
  // Check if git is initialized
  try {
    execSync('git status', { stdio: 'ignore' });
  } catch {
    console.log('🔄 Initializing git repository...');
    execSync('git init');
  }
  
  // Install husky
  console.log('📦 Installing husky...');
  execSync('npm install --save-dev husky', { stdio: 'inherit' });
  
  // Initialize husky
  console.log('🔧 Initializing husky...');
  execSync('npx husky install', { stdio: 'inherit' });
  
  // Add prepare script to package.json
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (!packageJson.scripts.prepare) {
    packageJson.scripts.prepare = 'husky install';
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added prepare script to package.json');
  }
  
  // Create pre-commit hook
  console.log('🎯 Creating pre-commit hook...');
  execSync('npx husky add .husky/pre-commit "node scripts/pre-commit-validate.js"', {
    stdio: 'inherit'
  });
  
  // Create commit-msg hook for conventional commits
  console.log('📝 Creating commit-msg hook...');
  const commitMsgHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Conventional commit validation
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?!?: .{1,100}$'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ Invalid commit message format!"
    echo "\nCommit message must follow conventional commits:"
    echo "  <type>(<scope>): <subject>"
    echo "\nExamples:"
    echo "  feat: add context engineering support"
    echo "  fix(commands): resolve validation error"
    echo "  docs: update README with new features"
    echo "\nTypes: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
    exit 1
fi

echo "✅ Commit message format is valid"`;
  
  fs.writeFileSync(path.join(__dirname, '..', '.husky', 'commit-msg'), commitMsgHook);
  execSync('chmod +x .husky/commit-msg');
  
  // Create pre-push hook
  console.log('🚀 Creating pre-push hook...');
  const prePushHook = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run full test suite before push
echo "🚀 Running pre-push validation..."

# Run all tests
npm test

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Push aborted."
  exit 1
fi

echo "✅ Pre-push validation passed!"`;
  
  fs.writeFileSync(path.join(__dirname, '..', '.husky', 'pre-push'), prePushHook);
  execSync('chmod +x .husky/pre-push');
  
  console.log('\n✅ Git hooks setup complete!');
  console.log('\n📖 Hooks installed:');
  console.log('   - pre-commit: Runs validation before each commit');
  console.log('   - commit-msg: Enforces conventional commit format');
  console.log('   - pre-push: Runs full test suite before push');
  console.log('\n💡 To skip hooks (emergency only): use --no-verify flag');
  
} catch (error) {
  console.error('❌ Failed to setup git hooks:', error.message);
  process.exit(1);
}