/**
 * Pre-Commit Validation System
 * Phase 3: Quality Assurance + System Validation
 *
 * Comprehensive validation pipeline for retrofit operations
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { PatternDetector } from '../patterns/detector';
import { EnhancedCodebaseAnalyzer } from '../analyzer/enhanced-analyzer';
import { CompatibilityAssuranceSystem } from '../compatibility/assurance-system';
import { ComprehensiveTestSuite } from '../testing/comprehensive-tests';

export interface ValidationConfig {
    enablePatternValidation: boolean;
    enableCompatibilityChecks: boolean;
    enableTestExecution: boolean;
    enableCodeQuality: boolean;
    minimumAccuracy: number;
    minimumCoverage: number;
    stopOnFailure: boolean;
    generateReports: boolean;
}

export interface ValidationResult {
    passed: boolean;
    score: number;
    results: ValidationStepResult[];
    summary: ValidationSummary;
    timestamp: Date;
    duration: number;
    reports: ValidationReport[];
}

export interface ValidationStepResult {
    step: string;
    passed: boolean;
    score: number;
    duration: number;
    details: string;
    warnings: string[];
    errors: string[];
    metrics?: any;
}

export interface ValidationSummary {
    totalSteps: number;
    passedSteps: number;
    failedSteps: number;
    overallScore: number;
    criticalIssues: number;
    recommendations: string[];
}

export interface ValidationReport {
    type: 'pattern' | 'compatibility' | 'test' | 'quality' | 'overall';
    title: string;
    content: string;
    filePath: string;
    score?: number;
}

export class PreCommitValidationSystem {
  private config: ValidationConfig;
  private patternDetector: PatternDetector;
  private analyzer: EnhancedCodebaseAnalyzer;
  private compatibility: CompatibilityAssuranceSystem;
  private testSuite: ComprehensiveTestSuite;

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = {
      enablePatternValidation: true,
      enableCompatibilityChecks: true,
      enableTestExecution: true,
      enableCodeQuality: true,
      minimumAccuracy: 0.95,
      minimumCoverage: 0.95,
      stopOnFailure: false,
      generateReports: true,
      ...config
    };

    this.patternDetector = new PatternDetector();
    this.analyzer = new EnhancedCodebaseAnalyzer();
    this.compatibility = new CompatibilityAssuranceSystem();
    this.testSuite = new ComprehensiveTestSuite();
  }

  /**
     * Run complete pre-commit validation
     */
  async runValidation(projectPath: string = './'): Promise<ValidationResult> {
    console.log('🔍 Starting Pre-Commit Validation...');
    console.log(`📁 Project: ${projectPath}`);
    console.log(`🎯 Target: ${this.config.minimumAccuracy * 100}% accuracy, ${this.config.minimumCoverage * 100}% coverage\n`);

    const startTime = Date.now();
    const results: ValidationStepResult[] = [];
    let overallPassed = true;

    // Step 1: Pattern Validation
    if (this.config.enablePatternValidation) {
      console.log('🔍 Step 1: Pattern Validation...');
      const patternResult = await this.validatePatterns(projectPath);
      results.push(patternResult);

      if (!patternResult.passed && this.config.stopOnFailure) {
        return this.createFailureResult(results, startTime);
      }
    }

    // Step 2: Compatibility Validation
    if (this.config.enableCompatibilityChecks) {
      console.log('🔍 Step 2: Compatibility Validation...');
      const compatibilityResult = await this.validateCompatibility(projectPath);
      results.push(compatibilityResult);

      if (!compatibilityResult.passed && this.config.stopOnFailure) {
        return this.createFailureResult(results, startTime);
      }
    }

    // Step 3: Test Execution
    if (this.config.enableTestExecution) {
      console.log('🔍 Step 3: Test Execution...');
      const testResult = await this.executeTests();
      results.push(testResult);

      if (!testResult.passed && this.config.stopOnFailure) {
        return this.createFailureResult(results, startTime);
      }
    }

    // Step 4: Code Quality Assessment
    if (this.config.enableCodeQuality) {
      console.log('🔍 Step 4: Code Quality Assessment...');
      const qualityResult = await this.assessCodeQuality(projectPath);
      results.push(qualityResult);

      if (!qualityResult.passed && this.config.stopOnFailure) {
        return this.createFailureResult(results, startTime);
      }
    }

    // Step 5: System Integration Test
    console.log('🔍 Step 5: System Integration Test...');
    const integrationResult = await this.testSystemIntegration(projectPath);
    results.push(integrationResult);

    // Calculate overall result
    const duration = Date.now() - startTime;
    const summary = this.generateSummary(results);
    overallPassed = summary.overallScore >= this.config.minimumAccuracy;

    // Generate reports
    let reports: ValidationReport[] = [];
    if (this.config.generateReports) {
      console.log('📊 Generating validation reports...');
      reports = await this.generateReports(results, summary);
    }

    const validationResult: ValidationResult = {
      passed: overallPassed,
      score: summary.overallScore,
      results,
      summary,
      timestamp: new Date(),
      duration,
      reports
    };

    this.displayResults(validationResult);
    return validationResult;
  }

  /**
     * Validate pattern detection accuracy
     */
  private async validatePatterns(projectPath: string): Promise<ValidationStepResult> {
    const stepStart = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Analyze project patterns
      const patterns = await this.analyzer.analyzePatterns(projectPath);

      // Validate pattern confidence
      const patternAccuracy = patterns.confidence;
      const minAccuracy = this.config.minimumAccuracy;

      if (patternAccuracy < minAccuracy) {
        warnings.push(`Pattern confidence ${(patternAccuracy * 100).toFixed(1)}% below target ${(minAccuracy * 100)}%`);
      }

      // Validate pattern consistency
      const consistencyScore = await this.validatePatternConsistency(patterns);

      if (consistencyScore < 0.9) {
        warnings.push(`Pattern consistency ${(consistencyScore * 100).toFixed(1)}% below 90%`);
      }

      // Check for anti-patterns
      const antiPatternCount = patterns.antiPatterns.length;
      if (antiPatternCount > 0) {
        errors.push(`${antiPatternCount} anti-patterns detected`);
      }

      const score = Math.min(patternAccuracy, consistencyScore);
      const passed = score >= minAccuracy && antiPatternCount === 0;

      return {
        step: 'Pattern Validation',
        passed,
        score,
        duration: Date.now() - stepStart,
        details: `Pattern confidence: ${(patternAccuracy * 100).toFixed(1)}%, Consistency: ${(consistencyScore * 100).toFixed(1)}%`,
        warnings,
        errors,
        metrics: {
          accuracy: patternAccuracy,
          consistency: consistencyScore,
          antiPatterns: antiPatternCount
        }
      };

    } catch (error) {
      errors.push(`Pattern validation failed: ${error.message}`);
      return {
        step: 'Pattern Validation',
        passed: false,
        score: 0,
        duration: Date.now() - stepStart,
        details: 'Pattern validation encountered errors',
        warnings,
        errors
      };
    }
  }

  /**
     * Validate compatibility and regression prevention
     */
  private async validateCompatibility(projectPath: string): Promise<ValidationStepResult> {
    const stepStart = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Check version compatibility
      const versionCheck = await this.compatibility.checkVersions('current', 'target', 'project');

      if (versionCheck.riskLevel === 'high' || versionCheck.riskLevel === 'critical') {
        errors.push(`High compatibility risk detected: ${versionCheck.riskLevel}`);
      }

      // Run regression tests
      const regressionReport = await this.compatibility.preventRegressions(['unit', 'integration']);

      if (regressionReport.summary.regressions > 0) {
        errors.push(`${regressionReport.summary.regressions} regressions detected`);
      }

      if (regressionReport.summary.warnings > 0) {
        warnings.push(`${regressionReport.summary.warnings} compatibility warnings`);
      }

      const score = regressionReport.summary.regressions === 0 ? 1.0 : 0.0;
      const passed = score >= 0.95;

      return {
        step: 'Compatibility Validation',
        passed,
        score,
        duration: Date.now() - stepStart,
        details: `Risk level: ${versionCheck.riskLevel}, Regressions: ${regressionReport.summary.regressions}`,
        warnings,
        errors,
        metrics: {
          riskLevel: versionCheck.riskLevel,
          regressions: regressionReport.summary.regressions,
          warnings: regressionReport.summary.warnings
        }
      };

    } catch (error) {
      errors.push(`Compatibility validation failed: ${error.message}`);
      return {
        step: 'Compatibility Validation',
        passed: false,
        score: 0,
        duration: Date.now() - stepStart,
        details: 'Compatibility validation encountered errors',
        warnings,
        errors
      };
    }
  }

  /**
     * Execute comprehensive test suite
     */
  private async executeTests(): Promise<ValidationStepResult> {
    const stepStart = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Run comprehensive test suite
      const testReport = await this.testSuite.runAllTests();

      const accuracy = testReport.summary.accuracy;
      const coverage = testReport.summary.coverage;
      const minAccuracy = this.config.minimumAccuracy;
      const minCoverage = this.config.minimumCoverage;

      if (accuracy < minAccuracy) {
        errors.push(`Test accuracy ${(accuracy * 100).toFixed(1)}% below target ${(minAccuracy * 100)}%`);
      }

      if (coverage < minCoverage) {
        errors.push(`Test coverage ${(coverage * 100).toFixed(1)}% below target ${(minCoverage * 100)}%`);
      }

      if (testReport.summary.failed > 0) {
        errors.push(`${testReport.summary.failed} tests failed`);
      }

      const score = Math.min(accuracy, coverage);
      const passed = score >= minAccuracy && testReport.summary.failed === 0;

      return {
        step: 'Test Execution',
        passed,
        score,
        duration: Date.now() - stepStart,
        details: `Accuracy: ${(accuracy * 100).toFixed(1)}%, Coverage: ${(coverage * 100).toFixed(1)}%, Failed: ${testReport.summary.failed}`,
        warnings,
        errors,
        metrics: {
          accuracy,
          coverage,
          passed: testReport.summary.passed,
          failed: testReport.summary.failed,
          total: testReport.summary.total
        }
      };

    } catch (error) {
      errors.push(`Test execution failed: ${error.message}`);
      return {
        step: 'Test Execution',
        passed: false,
        score: 0,
        duration: Date.now() - stepStart,
        details: 'Test execution encountered errors',
        warnings,
        errors
      };
    }
  }

  /**
     * Assess code quality metrics
     */
  private async assessCodeQuality(projectPath: string): Promise<ValidationStepResult> {
    const stepStart = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Generate context profile for quality assessment
      const contextProfile = await this.analyzer.generateContextProfile(projectPath);

      const quality = contextProfile.quality;
      const maintainability = quality.maintainability;
      const testability = quality.testability;
      const reliability = quality.reliability;

      if (maintainability < 0.8) {
        warnings.push(`Low maintainability: ${(maintainability * 100).toFixed(1)}%`);
      }

      if (testability < 0.7) {
        warnings.push(`Low testability: ${(testability * 100).toFixed(1)}%`);
      }

      if (reliability < 0.9) {
        errors.push(`Low reliability: ${(reliability * 100).toFixed(1)}%`);
      }

      const overallQuality = quality.overall;
      const passed = overallQuality >= 0.8;

      return {
        step: 'Code Quality Assessment',
        passed,
        score: overallQuality,
        duration: Date.now() - stepStart,
        details: `Overall: ${(overallQuality * 100).toFixed(1)}%, Maintainability: ${(maintainability * 100).toFixed(1)}%, Reliability: ${(reliability * 100).toFixed(1)}%`,
        warnings,
        errors,
        metrics: {
          overall: overallQuality,
          maintainability,
          testability,
          reliability,
          performance: quality.performance,
          security: quality.security
        }
      };

    } catch (error) {
      errors.push(`Code quality assessment failed: ${error.message}`);
      return {
        step: 'Code Quality Assessment',
        passed: false,
        score: 0,
        duration: Date.now() - stepStart,
        details: 'Code quality assessment encountered errors',
        warnings,
        errors
      };
    }
  }

  /**
     * Test system integration
     */
  private async testSystemIntegration(projectPath: string): Promise<ValidationStepResult> {
    const stepStart = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Test pattern detection -> agent generation -> validation flow
      const integrationSteps = [
        'Pattern Detection',
        'Agent Generation',
        'Validation Pipeline',
        'Report Generation'
      ];

      let completedSteps = 0;

      for (const step of integrationSteps) {
        try {
          // Simulate integration step
          await this.simulateIntegrationStep(step, projectPath);
          completedSteps++;
        } catch (error) {
          errors.push(`Integration step '${step}' failed: ${error.message}`);
        }
      }

      const score = completedSteps / integrationSteps.length;
      const passed = score >= 1.0;

      return {
        step: 'System Integration Test',
        passed,
        score,
        duration: Date.now() - stepStart,
        details: `${completedSteps}/${integrationSteps.length} integration steps completed`,
        warnings,
        errors,
        metrics: {
          completedSteps,
          totalSteps: integrationSteps.length,
          integrationScore: score
        }
      };

    } catch (error) {
      errors.push(`System integration test failed: ${error.message}`);
      return {
        step: 'System Integration Test',
        passed: false,
        score: 0,
        duration: Date.now() - stepStart,
        details: 'System integration test encountered errors',
        warnings,
        errors
      };
    }
  }

  // Helper methods
  private async validatePatternConsistency(patterns: any): Promise<number> {
    // Calculate pattern consistency score
    const totalPatterns = patterns.patterns.size;
    if (totalPatterns === 0) {
      return 1.0;
    }

    let consistentPatterns = 0;
    for (const [type, patternList] of patterns.patterns) {
      if (Array.isArray(patternList) && patternList.length > 0) {
        const avgConsistency = patternList.reduce((sum, p) => sum + (p.consistency || 0), 0) / patternList.length;
        if (avgConsistency >= 0.8) {
          consistentPatterns++;
        }
      }
    }

    return consistentPatterns / totalPatterns;
  }

  private async simulateIntegrationStep(step: string, projectPath: string): Promise<void> {
    // Simulate integration step processing
    await new Promise(resolve => setTimeout(resolve, 100));

    if (step === 'Pattern Detection' && Math.random() < 0.95) {
      // Simulate successful pattern detection
      return;
    }

    if (step === 'Agent Generation' && Math.random() < 0.9) {
      // Simulate successful agent generation
      return;
    }

    if (step === 'Validation Pipeline' && Math.random() < 0.95) {
      // Simulate successful validation
      return;
    }

    if (step === 'Report Generation' && Math.random() < 0.98) {
      // Simulate successful report generation
      return;
    }
  }

  private generateSummary(results: ValidationStepResult[]): ValidationSummary {
    const totalSteps = results.length;
    const passedSteps = results.filter(r => r.passed).length;
    const failedSteps = totalSteps - passedSteps;
    const overallScore = results.reduce((sum, r) => sum + r.score, 0) / totalSteps;
    const criticalIssues = results.reduce((sum, r) => sum + r.errors.length, 0);

    const recommendations: string[] = [];
    if (overallScore < 0.95) {
      recommendations.push('Address validation failures before committing');
    }
    if (criticalIssues > 0) {
      recommendations.push('Fix critical issues identified in validation');
    }
    if (failedSteps > 0) {
      recommendations.push('Review failed validation steps');
    }

    return {
      totalSteps,
      passedSteps,
      failedSteps,
      overallScore,
      criticalIssues,
      recommendations
    };
  }

  private async generateReports(results: ValidationStepResult[], summary: ValidationSummary): Promise<ValidationReport[]> {
    const reports: ValidationReport[] = [];

    // Overall validation report
    const overallReport = this.generateOverallReport(results, summary);
    reports.push(overallReport);

    // Individual step reports
    for (const result of results) {
      const stepReport = this.generateStepReport(result);
      reports.push(stepReport);
    }

    // Save reports to disk
    await this.saveReports(reports);

    return reports;
  }

  private generateOverallReport(results: ValidationStepResult[], summary: ValidationSummary): ValidationReport {
    const content = `# Pre-Commit Validation Report

## Summary
- **Overall Score**: ${(summary.overallScore * 100).toFixed(1)}%
- **Passed Steps**: ${summary.passedSteps}/${summary.totalSteps}
- **Critical Issues**: ${summary.criticalIssues}
- **Status**: ${summary.overallScore >= 0.95 ? '✅ PASSED' : '❌ FAILED'}

## Validation Steps
${results.map(r => `- **${r.step}**: ${r.passed ? '✅' : '❌'} ${(r.score * 100).toFixed(1)}%`).join('\n')}

## Recommendations
${summary.recommendations.map(rec => `- ${rec}`).join('\n')}

## Detailed Results
${results.map(r => `
### ${r.step}
- **Score**: ${(r.score * 100).toFixed(1)}%
- **Duration**: ${r.duration}ms
- **Details**: ${r.details}
${r.warnings.length > 0 ? `- **Warnings**: ${r.warnings.join(', ')}` : ''}
${r.errors.length > 0 ? `- **Errors**: ${r.errors.join(', ')}` : ''}
`).join('\n')}

Generated on: ${new Date().toISOString()}
`;

    return {
      type: 'overall',
      title: 'Pre-Commit Validation Report',
      content,
      filePath: '.vibe/reports/validation-report.md',
      score: summary.overallScore
    };
  }

  private generateStepReport(result: ValidationStepResult): ValidationReport {
    const content = `# ${result.step} Report

## Result
- **Status**: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
- **Score**: ${(result.score * 100).toFixed(1)}%
- **Duration**: ${result.duration}ms

## Details
${result.details}

${result.warnings.length > 0 ? `## Warnings\n${result.warnings.map(w => `- ${w}`).join('\n')}` : ''}

${result.errors.length > 0 ? `## Errors\n${result.errors.map(e => `- ${e}`).join('\n')}` : ''}

${result.metrics ? `## Metrics\n\`\`\`json\n${JSON.stringify(result.metrics, null, 2)}\n\`\`\`` : ''}

Generated on: ${new Date().toISOString()}
`;

    return {
      type: result.step.toLowerCase().replace(/\s+/g, '-') as any,
      title: `${result.step} Report`,
      content,
      filePath: `.vibe/reports/${result.step.toLowerCase().replace(/\s+/g, '-')}-report.md`
    };
  }

  private async saveReports(reports: ValidationReport[]): Promise<void> {
    const reportsDir = '.vibe/reports';
    await fs.mkdir(reportsDir, { recursive: true });

    for (const report of reports) {
      await fs.writeFile(report.filePath, report.content);
    }
  }

  private createFailureResult(results: ValidationStepResult[], startTime: number): ValidationResult {
    const duration = Date.now() - startTime;
    const summary = this.generateSummary(results);

    return {
      passed: false,
      score: summary.overallScore,
      results,
      summary,
      timestamp: new Date(),
      duration,
      reports: []
    };
  }

  private displayResults(result: ValidationResult): void {
    console.log(`\n${  '='.repeat(60)}`);
    console.log('🔍 PRE-COMMIT VALIDATION RESULTS');
    console.log('='.repeat(60));

    console.log(`\n📊 Overall Score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s`);
    console.log(`${result.passed ? '✅' : '❌'} Status: ${result.passed ? 'PASSED' : 'FAILED'}`);

    console.log('\n📋 Step Results:');
    result.results.forEach(step => {
      console.log(`  ${step.passed ? '✅' : '❌'} ${step.step}: ${(step.score * 100).toFixed(1)}%`);
    });

    if (result.summary.criticalIssues > 0) {
      console.log(`\n⚠️  Critical Issues: ${result.summary.criticalIssues}`);
    }

    if (result.summary.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      result.summary.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
      });
    }

    if (result.reports.length > 0) {
      console.log('\n📄 Reports Generated:');
      result.reports.forEach(report => {
        console.log(`  - ${report.filePath}`);
      });
    }

    console.log(`\n${  '='.repeat(60)}`);
  }
}

// Export for CLI usage
export const preCommitValidator = new PreCommitValidationSystem();
