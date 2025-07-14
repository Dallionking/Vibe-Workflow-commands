/**
 * Enhanced vibe-validate-work Command
 * Context-aware work validation for quality assurance
 */

import { BaseCommand, CommandParams, CommandResult } from '../base-command';
import { VibeValidationSystem } from '../../../context/validation/validation-integration';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ValidateParams extends CommandParams {
  phase?: string;
  strict?: boolean;
  fix?: boolean;
  report?: 'summary' | 'detailed' | 'markdown';
}

export class VibeValidateWorkCommand extends BaseCommand {
  private validator: VibeValidationSystem;

  constructor() {
    super({
      name: 'vibe-validate-work',
      description: 'Validate code quality, tests, and phase completion',
      contextRequired: true,
      tokenBudget: 4000,
      mcpTools: ['context7'],
      patterns: ['validation', 'quality-check']
    });
    
    this.validator = new VibeValidationSystem(this.projectRoot);
  }

  protected async implement(params: ValidateParams): Promise<CommandResult> {
    const { phase, strict = false, fix = false, report = 'summary' } = params;

    try {
      console.log('\n🔍 Starting Work Validation...');
      
      // Determine what to validate
      const validationScope = await this.determineScope(phase);
      console.log(`\n🎯 Validation Scope: ${validationScope.description}`);
      
      // Run validation checks
      const results = {
        codeQuality: await this.validateCodeQuality(fix),
        tests: await this.validateTests(),
        coverage: await this.validateCoverage(),
        phaseCompletion: await this.validatePhaseCompletion(validationScope),
        documentation: await this.validateDocumentation(validationScope),
        integrations: await this.validateIntegrations()
      };
      
      // Calculate overall status
      const overallSuccess = this.calculateOverallStatus(results, strict);
      
      // Generate validation report
      const validationReport = this.generateReport(results, report, overallSuccess);
      
      // Save report if detailed
      if (report === 'detailed' || report === 'markdown') {
        const reportPath = path.join(
          this.projectRoot,
          'docs/validation',
          `validation-${new Date().toISOString().split('T')[0]}.md`
        );
        await this.writeFileWithValidation(reportPath, validationReport);
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
      }
      
      // Update project status
      if (overallSuccess && phase) {
        await this.updatePhaseValidation(phase, results);
      }
      
      // Format output
      const output = this.formatValidationOutput(results, overallSuccess, strict);

      return {
        success: overallSuccess,
        output,
        data: {
          results,
          scope: validationScope,
          report: validationReport
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Validation failed: ${error}`
      };
    }
  }

  private async determineScope(phase?: string): Promise<any> {
    if (phase) {
      // Validate specific phase
      return {
        type: 'phase',
        phase,
        description: `Phase ${phase}`,
        files: await this.getPhaseFiles(phase)
      };
    }
    
    // Determine current phase from status
    const currentPhase = await this.getCurrentPhase();
    if (currentPhase) {
      return {
        type: 'current-phase',
        phase: currentPhase,
        description: `Current Phase (${currentPhase})`,
        files: await this.getRecentlyModifiedFiles()
      };
    }
    
    // Full project validation
    return {
      type: 'full',
      description: 'Full Project',
      files: await this.getAllProjectFiles()
    };
  }

  private async validateCodeQuality(autoFix: boolean): Promise<any> {
    const result = {
      passed: true,
      issues: [],
      fixed: 0
    };
    
    try {
      // Run linter
      const lintCommand = this.detectLintCommand();
      if (lintCommand) {
        console.log('\n🧪 Running linter...');
        
        if (autoFix && lintCommand.includes('eslint')) {
          execSync(`${lintCommand} --fix`, { cwd: this.projectRoot });
          result.fixed = parseInt(execSync(`${lintCommand} --format json | jq '.[] | .fixableErrorCount + .fixableWarningCount' | jq -s add`, { cwd: this.projectRoot }).toString()) || 0;
        } else {
          const lintResult = execSync(lintCommand, { cwd: this.projectRoot }).toString();
          if (lintResult.includes('error') || lintResult.includes('warning')) {
            result.passed = false;
            result.issues.push('Linting errors found');
          }
        }
      }
      
      // Run type checker if TypeScript
      if (fs.existsSync(path.join(this.projectRoot, 'tsconfig.json'))) {
        console.log('\n📝 Running TypeScript type check...');
        try {
          execSync('npx tsc --noEmit', { cwd: this.projectRoot });
        } catch (error) {
          result.passed = false;
          result.issues.push('TypeScript errors found');
        }
      }
      
    } catch (error) {
      result.passed = false;
      result.issues.push(`Code quality check failed: ${error.message}`);
    }
    
    return result;
  }

  private async validateTests(): Promise<any> {
    const result = {
      passed: true,
      total: 0,
      passing: 0,
      failing: 0,
      skipped: 0
    };
    
    try {
      const testCommand = this.detectTestCommand();
      if (testCommand) {
        console.log('\n🧪 Running tests...');
        
        const testOutput = execSync(`${testCommand} --json`, { 
          cwd: this.projectRoot,
          encoding: 'utf-8'
        });
        
        // Parse test results (format depends on test runner)
        const results = JSON.parse(testOutput);
        result.total = results.numTotalTests || 0;
        result.passing = results.numPassedTests || 0;
        result.failing = results.numFailedTests || 0;
        result.skipped = results.numPendingTests || 0;
        
        result.passed = result.failing === 0;
      } else {
        result.passed = false;
        result.issues = ['No test command found'];
      }
    } catch (error) {
      result.passed = false;
      result.issues = [`Test execution failed: ${error.message}`];
    }
    
    return result;
  }

  private async validateCoverage(): Promise<any> {
    const result = {
      passed: true,
      percentage: 0,
      threshold: 95,
      details: {}
    };
    
    try {
      const coveragePath = path.join(this.projectRoot, 'coverage/coverage-summary.json');
      
      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
        
        // Calculate overall coverage
        const total = coverage.total;
        if (total) {
          const metrics = ['lines', 'statements', 'functions', 'branches'];
          let sum = 0;
          
          metrics.forEach(metric => {
            if (total[metric]) {
              const pct = total[metric].pct || 0;
              result.details[metric] = pct;
              sum += pct;
            }
          });
          
          result.percentage = Math.round(sum / metrics.length);
          result.passed = result.percentage >= result.threshold;
        }
      } else {
        result.passed = false;
        result.issues = ['No coverage report found'];
      }
    } catch (error) {
      result.passed = false;
      result.issues = [`Coverage check failed: ${error.message}`];
    }
    
    return result;
  }

  private async validatePhaseCompletion(scope: any): Promise<any> {
    const result = {
      passed: true,
      completed: [],
      pending: [],
      blocked: []
    };
    
    if (scope.type === 'phase' || scope.type === 'current-phase') {
      const phasePath = path.join(this.projectRoot, 'phases', `phase-${scope.phase}.md`);
      
      if (fs.existsSync(phasePath)) {
        const content = fs.readFileSync(phasePath, 'utf-8');
        
        // Check subtasks
        const subtaskRegex = /- \[([ x])\] (.+)/g;
        let match;
        
        while ((match = subtaskRegex.exec(content)) !== null) {
          const isCompleted = match[1] === 'x';
          const task = match[2];
          
          if (isCompleted) {
            result.completed.push(task);
          } else {
            result.pending.push(task);
          }
        }
        
        // Check for blockers
        const blockerMatch = content.match(/## Blockers\n([\s\S]*?)(?=\n##|$)/);
        if (blockerMatch && blockerMatch[1].trim()) {
          result.blocked = blockerMatch[1]
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.replace(/^-\s*/, ''));
        }
        
        result.passed = result.pending.length === 0 && result.blocked.length === 0;
      }
    }
    
    return result;
  }

  private async validateDocumentation(scope: any): Promise<any> {
    const result = {
      passed: true,
      exists: [],
      missing: [],
      outdated: []
    };
    
    // Required documentation files
    const requiredDocs = [
      'README.md',
      'CLAUDE.md',
      '.vibe-status.md'
    ];
    
    // Phase-specific docs
    if (scope.phase) {
      requiredDocs.push(`docs/vibe-coding/${String(scope.phase).padStart(2, '0')}-*.md`);
      requiredDocs.push(`phases/phase-${scope.phase}*.md`);
    }
    
    for (const doc of requiredDocs) {
      if (doc.includes('*')) {
        // Glob pattern
        const files = await this.findFiles(doc);
        if (files.length > 0) {
          result.exists.push(...files);
        } else {
          result.missing.push(doc);
        }
      } else {
        const docPath = path.join(this.projectRoot, doc);
        if (fs.existsSync(docPath)) {
          result.exists.push(doc);
          
          // Check if outdated (older than source files)
          const docMtime = fs.statSync(docPath).mtime;
          const isOutdated = await this.isDocumentationOutdated(doc, docMtime, scope);
          if (isOutdated) {
            result.outdated.push(doc);
          }
        } else {
          result.missing.push(doc);
        }
      }
    }
    
    result.passed = result.missing.length === 0 && result.outdated.length === 0;
    
    return result;
  }

  private async validateIntegrations(): Promise<any> {
    const result = {
      passed: true,
      active: [],
      failed: [],
      warnings: []
    };
    
    // Check MCP integrations
    const mcpTools = ['context7', 'perplexity-ask', 'sequential-thinking'];
    
    for (const tool of mcpTools) {
      // This would check actual MCP availability
      // For now, simulate based on environment
      if (process.env[`MCP_${tool.toUpperCase().replace('-', '_')}_ENABLED`] !== 'false') {
        result.active.push(tool);
      } else {
        result.warnings.push(`MCP tool ${tool} is not configured`);
      }
    }
    
    // Check Git integration
    try {
      execSync('git status', { cwd: this.projectRoot });
      result.active.push('git');
    } catch {
      result.failed.push('git');
      result.passed = false;
    }
    
    return result;
  }

  private calculateOverallStatus(results: any, strict: boolean): boolean {
    const criticalChecks = ['codeQuality', 'tests'];
    const importantChecks = ['coverage', 'phaseCompletion'];
    
    // Critical checks must pass
    for (const check of criticalChecks) {
      if (results[check] && !results[check].passed) {
        return false;
      }
    }
    
    // In strict mode, all checks must pass
    if (strict) {
      for (const check of Object.keys(results)) {
        if (results[check] && !results[check].passed) {
          return false;
        }
      }
    }
    
    // In normal mode, important checks can have warnings
    let warnings = 0;
    for (const check of importantChecks) {
      if (results[check] && !results[check].passed) {
        warnings++;
      }
    }
    
    return warnings < 2; // Allow up to 1 warning
  }

  private generateReport(results: any, format: string, overallSuccess: boolean): string {
    if (format === 'summary') {
      return this.generateSummaryReport(results, overallSuccess);
    } else if (format === 'detailed') {
      return this.generateDetailedReport(results, overallSuccess);
    } else {
      return this.generateMarkdownReport(results, overallSuccess);
    }
  }

  private generateSummaryReport(results: any, success: boolean): string {
    const lines = [
      `Overall Status: ${success ? '✅ PASSED' : '❌ FAILED'}`,
      '',
      'Summary:'
    ];
    
    Object.entries(results).forEach(([check, result]: [string, any]) => {
      const status = result.passed ? '✅' : '❌';
      lines.push(`  ${status} ${check}`);
    });
    
    return lines.join('\n');
  }

  private generateDetailedReport(results: any, success: boolean): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      overallStatus: success ? 'passed' : 'failed',
      results
    }, null, 2);
  }

  private generateMarkdownReport(results: any, success: boolean): string {
    const lines = [
      '# Validation Report',
      '',
      `**Date**: ${new Date().toISOString()}`,
      `**Status**: ${success ? '✅ PASSED' : '❌ FAILED'}`,
      '',
      '## Results',
      ''
    ];
    
    // Code Quality
    lines.push('### Code Quality');
    lines.push(`- **Status**: ${results.codeQuality.passed ? 'Passed' : 'Failed'}`);
    if (results.codeQuality.issues?.length > 0) {
      lines.push(`- **Issues**: ${results.codeQuality.issues.join(', ')}`);
    }
    if (results.codeQuality.fixed > 0) {
      lines.push(`- **Auto-fixed**: ${results.codeQuality.fixed} issues`);
    }
    lines.push('');
    
    // Tests
    lines.push('### Tests');
    lines.push(`- **Status**: ${results.tests.passed ? 'Passed' : 'Failed'}`);
    lines.push(`- **Total**: ${results.tests.total}`);
    lines.push(`- **Passing**: ${results.tests.passing}`);
    lines.push(`- **Failing**: ${results.tests.failing}`);
    lines.push('');
    
    // Coverage
    lines.push('### Test Coverage');
    lines.push(`- **Status**: ${results.coverage.passed ? 'Passed' : 'Failed'}`);
    lines.push(`- **Overall**: ${results.coverage.percentage}% (threshold: ${results.coverage.threshold}%)`);
    if (results.coverage.details) {
      Object.entries(results.coverage.details).forEach(([metric, value]) => {
        lines.push(`- **${metric}**: ${value}%`);
      });
    }
    lines.push('');
    
    // Phase Completion
    lines.push('### Phase Completion');
    lines.push(`- **Completed**: ${results.phaseCompletion.completed.length}`);
    lines.push(`- **Pending**: ${results.phaseCompletion.pending.length}`);
    lines.push(`- **Blocked**: ${results.phaseCompletion.blocked.length}`);
    lines.push('');
    
    // Documentation
    lines.push('### Documentation');
    lines.push(`- **Status**: ${results.documentation.passed ? 'Complete' : 'Incomplete'}`);
    if (results.documentation.missing.length > 0) {
      lines.push(`- **Missing**: ${results.documentation.missing.join(', ')}`);
    }
    if (results.documentation.outdated.length > 0) {
      lines.push(`- **Outdated**: ${results.documentation.outdated.join(', ')}`);
    }
    lines.push('');
    
    // Integrations
    lines.push('### Integrations');
    lines.push(`- **Active**: ${results.integrations.active.join(', ') || 'None'}`);
    if (results.integrations.failed.length > 0) {
      lines.push(`- **Failed**: ${results.integrations.failed.join(', ')}`);
    }
    if (results.integrations.warnings.length > 0) {
      lines.push(`- **Warnings**: ${results.integrations.warnings.join(', ')}`);
    }
    
    return lines.join('\n');
  }

  private formatValidationOutput(results: any, success: boolean, strict: boolean): string {
    const sections: Record<string, string> = {};
    
    // Overall Status
    sections['Validation ' + (success ? 'Passed' : 'Failed')] = success ? '✅' : '❌';
    
    // Individual Results
    const resultSummary: string[] = [];
    Object.entries(results).forEach(([check, result]: [string, any]) => {
      const icon = result.passed ? '✅' : '❌';
      const name = check.replace(/([A-Z])/g, ' $1').trim();
      resultSummary.push(`${icon} ${name}`);
    });
    sections['Results'] = resultSummary.join('\n');
    
    // Issues
    const issues: string[] = [];
    Object.entries(results).forEach(([check, result]: [string, any]) => {
      if (!result.passed && result.issues) {
        issues.push(...result.issues);
      }
    });
    
    if (issues.length > 0) {
      sections['Issues Found'] = issues.map(i => `⚠️  ${i}`).join('\n');
    }
    
    // Next Steps
    if (success) {
      sections['Next Steps'] = 'All checks passed! Ready to proceed to the next phase.';
    } else {
      sections['Next Steps'] = `1. Fix the issues listed above\n2. Run /vibe-validate-work again\n3. Use --fix flag to auto-fix some issues\n${strict ? '4. Consider running without --strict for warnings' : ''}`;
    }
    
    return this.formatOutput(sections);
  }

  // Helper methods
  private detectLintCommand(): string | null {
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      if (packageJson.scripts?.lint) {
        return 'npm run lint';
      }
      
      if (packageJson.devDependencies?.eslint) {
        return 'npx eslint .';
      }
    }
    
    return null;
  }

  private detectTestCommand(): string | null {
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      if (packageJson.scripts?.test) {
        return 'npm test';
      }
    }
    
    return null;
  }

  private async getCurrentPhase(): Promise<string | null> {
    const statusPath = path.join(this.projectRoot, '.vibe-status.md');
    if (fs.existsSync(statusPath)) {
      const content = fs.readFileSync(statusPath, 'utf-8');
      const match = content.match(/Current Phase:\s*(\S+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  private async getPhaseFiles(phase: string): Promise<string[]> {
    // Get files related to specific phase
    const patterns = [
      `phases/phase-${phase}*.md`,
      `docs/vibe-coding/${String(phase).padStart(2, '0')}-*.md`,
      `src/**/*${phase}*`
    ];
    
    const files: string[] = [];
    for (const pattern of patterns) {
      const found = await this.findFiles(pattern);
      files.push(...found);
    }
    
    return files;
  }

  private async getRecentlyModifiedFiles(): Promise<string[]> {
    try {
      const output = execSync(
        'git diff --name-only HEAD~5..HEAD',
        { cwd: this.projectRoot, encoding: 'utf-8' }
      );
      return output.split('\n').filter(f => f.trim());
    } catch {
      return [];
    }
  }

  private async getAllProjectFiles(): Promise<string[]> {
    return ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'];
  }

  private async findFiles(pattern: string): Promise<string[]> {
    // This would use glob to find files
    // Simplified for now
    return [];
  }

  private async isDocumentationOutdated(
    doc: string,
    docMtime: Date,
    scope: any
  ): Promise<boolean> {
    // Check if documentation is older than related source files
    if (scope.files) {
      for (const file of scope.files) {
        const filePath = path.join(this.projectRoot, file);
        if (fs.existsSync(filePath)) {
          const fileMtime = fs.statSync(filePath).mtime;
          if (fileMtime > docMtime) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private async updatePhaseValidation(phase: string, results: any): Promise<void> {
    const validationPath = path.join(
      this.projectRoot,
      '.vibe',
      'validations',
      `phase-${phase}.json`
    );
    
    const validation = {
      phase,
      timestamp: new Date().toISOString(),
      passed: true,
      results
    };
    
    const dir = path.dirname(validationPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(validationPath, JSON.stringify(validation, null, 2));
  }
}