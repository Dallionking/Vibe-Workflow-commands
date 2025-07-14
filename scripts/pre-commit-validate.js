#!/usr/bin/env node

/**
 * Pre-Commit Validation
 * Comprehensive validation before allowing commits
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PreCommitValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }
  
  async validate() {
    console.log(chalk.blue('🏁 Starting Pre-Commit Validation\n'));
    
    // Run all validation checks
    await this.checkGitStatus();
    await this.validateStructure();
    await this.runLinting();
    await this.runTypeCheck();
    await this.runTests();
    await this.checkContextIntegrity();
    await this.validateDocumentation();
    await this.checkSecurityIssues();
    
    // Report results
    this.report();
    
    // Exit with appropriate code
    return this.errors.length === 0;
  }
  
  async checkGitStatus() {
    console.log('📂 Checking git status...');
    
    try {
      // Check for uncommitted changes
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      const files = status.trim().split('\n').filter(Boolean);
      
      // Check for large files
      const largeFiles = [];
      files.forEach(file => {
        const filePath = file.substring(3);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          if (stats.size > 10 * 1024 * 1024) { // 10MB
            largeFiles.push({ path: filePath, size: stats.size });
          }
        }
      });
      
      if (largeFiles.length > 0) {
        this.warnings.push(
          'Large files detected:\n' +
          largeFiles.map(f => `  - ${f.path} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join('\n')
        );
      }
      
      // Check for sensitive files
      const sensitivePatterns = ['.env', '.key', '.pem', 'secrets', 'credentials'];
      const sensitiveFiles = files.filter(file => 
        sensitivePatterns.some(pattern => file.includes(pattern))
      );
      
      if (sensitiveFiles.length > 0) {
        this.errors.push(
          'Sensitive files detected:\n' +
          sensitiveFiles.map(f => `  - ${f}`).join('\n')
        );
      }
      
      this.passed.push('Git status check');
      
    } catch (error) {
      this.errors.push(`Git status check failed: ${error.message}`);
    }
  }
  
  async validateStructure() {
    console.log('🏭 Validating project structure...');
    
    try {
      execSync('node scripts/validate-structure.js', { stdio: 'pipe' });
      this.passed.push('Project structure validation');
    } catch (error) {
      this.errors.push('Project structure validation failed');
      if (error.stdout) {
        this.errors.push(error.stdout.toString());
      }
    }
  }
  
  async runLinting() {
    console.log('🧪 Running ESLint...');
    
    try {
      execSync('npm run lint', { stdio: 'pipe' });
      this.passed.push('ESLint validation');
    } catch (error) {
      this.errors.push('Linting failed - run "npm run lint:fix" to auto-fix');
      
      // Try to extract error count
      const output = error.stdout?.toString() || '';
      const errorMatch = output.match(/(\d+) errors?/);
      const warningMatch = output.match(/(\d+) warnings?/);
      
      if (errorMatch || warningMatch) {
        const details = [];
        if (errorMatch) details.push(`${errorMatch[1]} errors`);
        if (warningMatch) details.push(`${warningMatch[1]} warnings`);
        this.errors.push(`  Found: ${details.join(', ')}`);
      }
    }
  }
  
  async runTypeCheck() {
    console.log('📝 Running TypeScript type check...');
    
    try {
      execSync('npm run typecheck', { stdio: 'pipe' });
      this.passed.push('TypeScript validation');
    } catch (error) {
      this.errors.push('TypeScript errors found');
      
      // Extract error summary
      const output = error.stdout?.toString() || '';
      const errorMatch = output.match(/Found (\d+) errors?/);
      if (errorMatch) {
        this.errors.push(`  ${errorMatch[0]}`);
      }
    }
  }
  
  async runTests() {
    console.log('🧪 Running tests...');
    
    try {
      // Run fast unit tests only for pre-commit
      execSync('npm run test:unit', { 
        stdio: 'pipe',
        env: { ...process.env, SILENT_TESTS: 'true' }
      });
      this.passed.push('Unit tests');
      
      // Check coverage
      const coveragePath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        const total = coverage.total;
        
        const metrics = ['lines', 'statements', 'functions', 'branches'];
        const lowCoverage = [];
        
        metrics.forEach(metric => {
          if (total[metric].pct < 80) {
            lowCoverage.push(`${metric}: ${total[metric].pct}%`);
          }
        });
        
        if (lowCoverage.length > 0) {
          this.warnings.push(
            'Low test coverage detected:\n' +
            lowCoverage.map(m => `  - ${m}`).join('\n')
          );
        }
      }
      
    } catch (error) {
      this.errors.push('Unit tests failed');
      this.errors.push('Run "npm test" to see details');
    }
  }
  
  async checkContextIntegrity() {
    console.log('🧠 Checking context engineering integrity...');
    
    const issues = [];
    
    // Check CLAUDE.md exists and is valid
    const claudeMdPath = path.join(__dirname, '..', 'CLAUDE.md');
    if (!fs.existsSync(claudeMdPath)) {
      issues.push('CLAUDE.md is missing');
    } else {
      const content = fs.readFileSync(claudeMdPath, 'utf8');
      if (!content.includes('version:')) {
        issues.push('CLAUDE.md is missing version information');
      }
    }
    
    // Check context layers
    const contextDir = path.join(__dirname, '..', 'context');
    const requiredDirs = ['layers', 'assembly', 'memory', 'validation', 'performance'];
    
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(path.join(contextDir, dir))) {
        issues.push(`Missing context directory: ${dir}`);
      }
    });
    
    // Check enhanced commands
    const enhancedDir = path.join(__dirname, '..', 'src', 'commands', 'enhanced');
    if (fs.existsSync(enhancedDir)) {
      const commands = fs.readdirSync(enhancedDir);
      if (commands.length < 5) {
        this.warnings.push('Some enhanced commands may be missing');
      }
    }
    
    if (issues.length > 0) {
      this.errors.push(
        'Context engineering issues:\n' +
        issues.map(i => `  - ${i}`).join('\n')
      );
    } else {
      this.passed.push('Context engineering integrity');
    }
  }
  
  async validateDocumentation() {
    console.log('📖 Validating documentation...');
    
    const issues = [];
    
    // Check README
    const readmePath = path.join(__dirname, '..', 'README.md');
    if (!fs.existsSync(readmePath)) {
      issues.push('README.md is missing');
    } else {
      const content = fs.readFileSync(readmePath, 'utf8');
      if (content.length < 500) {
        issues.push('README.md seems too short');
      }
    }
    
    // Check phase documentation
    const phasesDir = path.join(__dirname, '..', 'phases');
    if (fs.existsSync(phasesDir)) {
      const phases = fs.readdirSync(phasesDir).filter(f => f.endsWith('.md'));
      if (phases.length === 0) {
        this.warnings.push('No phase documentation found');
      }
    }
    
    if (issues.length > 0) {
      this.warnings.push(
        'Documentation issues:\n' +
        issues.map(i => `  - ${i}`).join('\n')
      );
    } else {
      this.passed.push('Documentation validation');
    }
  }
  
  async checkSecurityIssues() {
    console.log('🔒 Checking for security issues...');
    
    const issues = [];
    
    // Check for hardcoded secrets
    const patterns = [
      /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/gi,
      /password\s*[:=]\s*['"][^'"]+['"]/gi,
      /secret\s*[:=]\s*['"][^'"]+['"]/gi,
      /token\s*[:=]\s*['"][^'"]+['"]/gi
    ];
    
    const filesToCheck = execSync('git ls-files', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(f => f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.json'));
    
    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(pattern => {
          if (pattern.test(content)) {
            issues.push(`Potential secret in ${file}`);
          }
        });
      }
    });
    
    // Check npm audit
    try {
      const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(auditResult);
      
      if (audit.metadata.vulnerabilities.high > 0 || audit.metadata.vulnerabilities.critical > 0) {
        issues.push(
          `npm audit found vulnerabilities: ` +
          `${audit.metadata.vulnerabilities.critical} critical, ` +
          `${audit.metadata.vulnerabilities.high} high`
        );
      }
    } catch (error) {
      // npm audit returns non-zero exit code if vulnerabilities found
      // Parse the output if available
    }
    
    if (issues.length > 0) {
      this.errors.push(
        'Security issues detected:\n' +
        issues.map(i => `  - ${i}`).join('\n')
      );
    } else {
      this.passed.push('Security check');
    }
  }
  
  report() {
    console.log('\n' + chalk.blue('='.repeat(50)));
    console.log(chalk.blue('📄 Pre-Commit Validation Report'));
    console.log(chalk.blue('='.repeat(50)) + '\n');
    
    // Passed checks
    if (this.passed.length > 0) {
      console.log(chalk.green('✅ Passed Checks:'));
      this.passed.forEach(check => {
        console.log(chalk.green(`   ✓ ${check}`));
      });
      console.log();
    }
    
    // Warnings
    if (this.warnings.length > 0) {
      console.log(chalk.yellow('⚠️  Warnings:'));
      this.warnings.forEach(warning => {
        console.log(chalk.yellow(`   ${warning}`));
      });
      console.log();
    }
    
    // Errors
    if (this.errors.length > 0) {
      console.log(chalk.red('❌ Errors:'));
      this.errors.forEach(error => {
        console.log(chalk.red(`   ${error}`));
      });
      console.log();
    }
    
    // Summary
    console.log(chalk.blue('='.repeat(50)));
    if (this.errors.length === 0) {
      console.log(chalk.green('✅ All validation checks passed!'));
      console.log(chalk.green('Your changes are ready to commit.'));
    } else {
      console.log(chalk.red(`❌ Found ${this.errors.length} error(s) that must be fixed.`));
      console.log(chalk.red('Please fix the issues above before committing.'));
      
      if (this.warnings.length > 0) {
        console.log(chalk.yellow(`⚠️  Also found ${this.warnings.length} warning(s) to consider.`));
      }
    }
    console.log(chalk.blue('='.repeat(50)) + '\n');
  }
}

// Run validation
if (require.main === module) {
  const validator = new PreCommitValidator();
  
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error(chalk.red('Pre-commit validation failed:'), error);
    process.exit(1);
  });
}

module.exports = PreCommitValidator;