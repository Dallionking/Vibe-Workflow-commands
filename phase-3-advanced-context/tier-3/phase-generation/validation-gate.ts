/**
 * Validation Gate
 * Phase 3: Advanced Context Features - Tier 3.1
 *
 * Comprehensive validation system for PRP phases with quality gates,
 * automated validation, and continuous improvement feedback.
 */

import { ValidationResult, ValidationIssue, PRPPhaseConfig } from './prp-phase-generator';

export interface ValidationGateConfig {
    strictMode: boolean;
    qualityThresholds: {
        clarity: number;
        completeness: number;
        actionability: number;
        testability: number;
    };
    requiredSections: string[];
    customValidators: CustomValidator[];
    autoFix: boolean;
    reportingLevel: 'minimal' | 'detailed' | 'comprehensive';
}

export interface CustomValidator {
    id: string;
    name: string;
    description: string;
    validator: (phase: any) => ValidationResult;
    priority: 'low' | 'medium' | 'high';
    category: 'structure' | 'content' | 'quality' | 'performance';
}

export interface ValidationReport {
    phaseId: string;
    timestamp: Date;
    overallScore: number;
    passed: boolean;
    results: ValidationResult[];
    recommendations: Recommendation[];
    metrics: ValidationMetrics;
    summary: ValidationSummary;
}

export interface Recommendation {
    id: string;
    type: 'improvement' | 'fix' | 'enhancement';
    priority: 'low' | 'medium' | 'high';
    description: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
    implementation: string;
}

export interface ValidationMetrics {
    totalValidations: number;
    passedValidations: number;
    failedValidations: number;
    warningCount: number;
    processingTime: number;
    qualityScore: number;
    improvementScore: number;
}

export interface ValidationSummary {
    strengths: string[];
    weaknesses: string[];
    criticalIssues: string[];
    quickWins: string[];
    longTermImprovements: string[];
}

export class ValidationGate {
  private config: ValidationGateConfig;
  private validators: Map<string, CustomValidator> = new Map();
  private validationHistory: Map<string, ValidationReport[]> = new Map();
  private qualityTrends: Map<string, number[]> = new Map();

  constructor(config: Partial<ValidationGateConfig> = {}) {
    this.config = {
      strictMode: config.strictMode || false,
      qualityThresholds: {
        clarity: 0.8,
        completeness: 0.85,
        actionability: 0.9,
        testability: 0.75,
        ...config.qualityThresholds
      },
      requiredSections: config.requiredSections || [
        'objective',
        'successCriteria',
        'contextRequirements',
        'validationCheckpoints'
      ],
      customValidators: config.customValidators || [],
      autoFix: config.autoFix || false,
      reportingLevel: config.reportingLevel || 'detailed'
    };

    this.initializeValidators();
    console.log('🚪 Validation Gate initialized');
  }

  /**
     * Validate phase with comprehensive quality checks
     */
  async validatePhase(phase: any): Promise<ValidationResult> {
    console.log(`🔍 Validating phase: ${phase.id || 'unknown'}`);

    const startTime = Date.now();
    const validationResults: ValidationResult[] = [];
    const issues: ValidationIssue[] = [];

    try {
      // Run core validations
      const coreResults = await this.runCoreValidations(phase);
      validationResults.push(...coreResults);

      // Run quality assessments
      const qualityResults = await this.runQualityAssessments(phase);
      validationResults.push(...qualityResults);

      // Run custom validators
      const customResults = await this.runCustomValidators(phase);
      validationResults.push(...customResults);

      // Collect all issues
      validationResults.forEach(result => {
        issues.push(...result.issues);
      });

      // Calculate overall score
      const overallScore = this.calculateOverallScore(validationResults);
      const passed = this.determinePassStatus(overallScore, issues);

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        validationResults,
        issues
      );

      // Create validation report
      const report = this.createValidationReport(
        phase,
        overallScore,
        passed,
        validationResults,
        recommendations,
        Date.now() - startTime
      );

      // Store validation history
      this.storeValidationHistory(phase.id || 'unknown', report);

      // Apply auto-fixes if enabled
      if (this.config.autoFix && !passed) {
        await this.applyAutoFixes(phase, issues);
      }

      const processingTime = Date.now() - startTime;
      console.log(`✅ Phase validation completed in ${processingTime}ms (Score: ${overallScore})`);

      return {
        passed,
        score: overallScore,
        details: {
          clarity: this.getScoreForCategory(validationResults, 'clarity'),
          completeness: this.getScoreForCategory(validationResults, 'completeness'),
          actionability: this.getScoreForCategory(validationResults, 'actionability')
        },
        issues
      };

    } catch (error) {
      console.error(`❌ Phase validation failed: ${error}`);
      return {
        passed: false,
        score: 0,
        details: {
          clarity: 0,
          completeness: 0,
          actionability: 0
        },
        issues: [{
          id: 'validation_error',
          type: 'error',
          message: `Validation failed: ${error.message}`,
          suggestion: 'Check phase structure and validation configuration',
          severity: 10
        }]
      };
    }
  }

  /**
     * Add custom validator
     */
  addValidator(validator: CustomValidator): void {
    this.validators.set(validator.id, validator);
    console.log(`✅ Added custom validator: ${validator.name}`);
  }

  /**
     * Remove custom validator
     */
  removeValidator(validatorId: string): void {
    this.validators.delete(validatorId);
    console.log(`🗑️ Removed validator: ${validatorId}`);
  }

  /**
     * Get validation history for phase
     */
  getValidationHistory(phaseId: string): ValidationReport[] {
    return this.validationHistory.get(phaseId) || [];
  }

  /**
     * Get quality trend for phase
     */
  getQualityTrend(phaseId: string): number[] {
    return this.qualityTrends.get(phaseId) || [];
  }

  /**
     * Update validation configuration
     */
  updateConfig(newConfig: Partial<ValidationGateConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Validation configuration updated');
  }

  // Private methods
  private initializeValidators(): void {
    // Structure validators
    this.validators.set('structure', {
      id: 'structure',
      name: 'Structure Validator',
      description: 'Validates phase structure and required sections',
      validator: (phase) => this.validateStructure(phase),
      priority: 'high',
      category: 'structure'
    });

    // Content validators
    this.validators.set('content', {
      id: 'content',
      name: 'Content Validator',
      description: 'Validates content quality and completeness',
      validator: (phase) => this.validateContent(phase),
      priority: 'high',
      category: 'content'
    });

    // Quality validators
    this.validators.set('quality', {
      id: 'quality',
      name: 'Quality Validator',
      description: 'Validates overall quality metrics',
      validator: (phase) => this.validateQuality(phase),
      priority: 'medium',
      category: 'quality'
    });

    // Add custom validators from config
    this.config.customValidators.forEach(validator => {
      this.validators.set(validator.id, validator);
    });
  }

  private async runCoreValidations(phase: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Structure validation
    const structureResult = await this.validateStructure(phase);
    results.push(structureResult);

    // Required sections validation
    const sectionsResult = await this.validateRequiredSections(phase);
    results.push(sectionsResult);

    // Dependencies validation
    const dependenciesResult = await this.validateDependencies(phase);
    results.push(dependenciesResult);

    return results;
  }

  private async runQualityAssessments(phase: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Clarity assessment
    const clarityResult = await this.assessClarity(phase);
    results.push(clarityResult);

    // Completeness assessment
    const completenessResult = await this.assessCompleteness(phase);
    results.push(completenessResult);

    // Actionability assessment
    const actionabilityResult = await this.assessActionability(phase);
    results.push(actionabilityResult);

    // Testability assessment
    const testabilityResult = await this.assessTestability(phase);
    results.push(testabilityResult);

    return results;
  }

  private async runCustomValidators(phase: any): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const validator of this.validators.values()) {
      try {
        const result = await validator.validator(phase);
        results.push(result);
      } catch (error) {
        results.push({
          passed: false,
          score: 0,
          details: {},
          issues: [{
            id: `${validator.id}_error`,
            type: 'error',
            message: `Validator ${validator.name} failed: ${error.message}`,
            suggestion: 'Check validator implementation',
            severity: 5
          }]
        });
      }
    }

    return results;
  }

  private validateStructure(phase: any): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check if phase has basic structure
    if (!phase || typeof phase !== 'object') {
      issues.push({
        id: 'structure_invalid',
        type: 'error',
        message: 'Phase must be a valid object',
        suggestion: 'Ensure phase is properly structured',
        severity: 10
      });
      return { passed: false, score: 0, details: {}, issues };
    }

    // Check for required properties
    const requiredProps = ['id', 'name', 'description'];
    for (const prop of requiredProps) {
      if (!phase[prop]) {
        issues.push({
          id: `structure_missing_${prop}`,
          type: 'error',
          message: `Missing required property: ${prop}`,
          suggestion: `Add ${prop} property to phase`,
          severity: 8
        });
        score -= 25;
      }
    }

    return {
      passed: score >= 70,
      score: Math.max(0, score),
      details: { structure: score },
      issues
    };
  }

  private validateRequiredSections(phase: any): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    for (const section of this.config.requiredSections) {
      if (!phase[section]) {
        issues.push({
          id: `section_missing_${section}`,
          type: 'error',
          message: `Missing required section: ${section}`,
          suggestion: `Add ${section} section to phase`,
          severity: 7
        });
        score -= 100 / this.config.requiredSections.length;
      }
    }

    return {
      passed: score >= 70,
      score: Math.max(0, score),
      details: { sections: score },
      issues
    };
  }

  private validateDependencies(phase: any): ValidationResult {
    const issues: ValidationIssue[] = [];
    let score = 100;

    if (phase.dependencies) {
      // Check if dependencies are properly formatted
      if (!Array.isArray(phase.dependencies)) {
        issues.push({
          id: 'dependencies_format',
          type: 'error',
          message: 'Dependencies must be an array',
          suggestion: 'Format dependencies as array of strings',
          severity: 6
        });
        score -= 30;
      }

      // Check for circular dependencies (simplified check)
      if (Array.isArray(phase.dependencies)) {
        const selfReference = phase.dependencies.includes(phase.id);
        if (selfReference) {
          issues.push({
            id: 'dependencies_circular',
            type: 'error',
            message: 'Circular dependency detected',
            suggestion: 'Remove self-references from dependencies',
            severity: 9
          });
          score -= 50;
        }
      }
    }

    return {
      passed: score >= 70,
      score: Math.max(0, score),
      details: { dependencies: score },
      issues
    };
  }

  private async assessClarity(phase: any): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 0;

    // Assess description clarity
    if (phase.description) {
      const descriptionScore = this.calculateClarityScore(phase.description);
      score += descriptionScore * 0.4;
    }

    // Assess objective clarity
    if (phase.objective) {
      const objectiveScore = this.calculateClarityScore(
        JSON.stringify(phase.objective)
      );
      score += objectiveScore * 0.3;
    }

    // Assess success criteria clarity
    if (phase.successCriteria) {
      const criteriaScore = this.calculateClarityScore(
        JSON.stringify(phase.successCriteria)
      );
      score += criteriaScore * 0.3;
    }

    // Check against threshold
    if (score < this.config.qualityThresholds.clarity * 100) {
      issues.push({
        id: 'clarity_low',
        type: 'warning',
        message: 'Phase clarity is below threshold',
        suggestion: 'Improve clarity of descriptions and objectives',
        severity: 4
      });
    }

    return {
      passed: score >= this.config.qualityThresholds.clarity * 100,
      score: Math.max(0, score),
      details: { clarity: score },
      issues
    };
  }

  private async assessCompleteness(phase: any): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 0;

    // Check content completeness
    const contentElements = [
      'description', 'objective', 'successCriteria',
      'contextRequirements', 'validationCheckpoints'
    ];

    let completedElements = 0;
    for (const element of contentElements) {
      if (phase[element]) {
        completedElements++;
        const elementScore = this.calculateCompletenessScore(phase[element]);
        score += elementScore * (100 / contentElements.length) / 100;
      }
    }

    score = (score / contentElements.length) * 100;

    // Check against threshold
    if (score < this.config.qualityThresholds.completeness * 100) {
      issues.push({
        id: 'completeness_low',
        type: 'warning',
        message: 'Phase completeness is below threshold',
        suggestion: 'Add missing content elements and enhance existing ones',
        severity: 5
      });
    }

    return {
      passed: score >= this.config.qualityThresholds.completeness * 100,
      score: Math.max(0, score),
      details: { completeness: score },
      issues
    };
  }

  private async assessActionability(phase: any): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 0;

    // Check for actionable elements
    if (phase.objective) {
      score += this.calculateActionabilityScore(JSON.stringify(phase.objective)) * 0.3;
    }

    if (phase.successCriteria) {
      score += this.calculateActionabilityScore(JSON.stringify(phase.successCriteria)) * 0.3;
    }

    if (phase.validationCheckpoints) {
      score += this.calculateActionabilityScore(JSON.stringify(phase.validationCheckpoints)) * 0.4;
    }

    // Check against threshold
    if (score < this.config.qualityThresholds.actionability * 100) {
      issues.push({
        id: 'actionability_low',
        type: 'warning',
        message: 'Phase actionability is below threshold',
        suggestion: 'Add more specific actions and clear steps',
        severity: 6
      });
    }

    return {
      passed: score >= this.config.qualityThresholds.actionability * 100,
      score: Math.max(0, score),
      details: { actionability: score },
      issues
    };
  }

  private async assessTestability(phase: any): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 0;

    // Check for testable elements
    if (phase.successCriteria) {
      score += this.calculateTestabilityScore(JSON.stringify(phase.successCriteria)) * 0.5;
    }

    if (phase.validationCheckpoints) {
      score += this.calculateTestabilityScore(JSON.stringify(phase.validationCheckpoints)) * 0.5;
    }

    // Check against threshold
    if (score < this.config.qualityThresholds.testability * 100) {
      issues.push({
        id: 'testability_low',
        type: 'warning',
        message: 'Phase testability is below threshold',
        suggestion: 'Add measurable criteria and validation methods',
        severity: 4
      });
    }

    return {
      passed: score >= this.config.qualityThresholds.testability * 100,
      score: Math.max(0, score),
      details: { testability: score },
      issues
    };
  }

  // Scoring methods
  private calculateClarityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;

    // Shorter sentences generally indicate better clarity
    return Math.max(0, 100 - Math.max(0, avgSentenceLength - 50));
  }

  private calculateCompletenessScore(content: any): number {
    const textContent = typeof content === 'string' ? content : JSON.stringify(content);
    const words = textContent.split(/\s+/).length;
    const hasStructure = typeof content === 'object' && content !== null;

    let score = Math.min(100, words * 2);
    if (hasStructure) {
      score += 20;
    }

    return Math.min(100, score);
  }

  private calculateActionabilityScore(text: string): number {
    const actionWords = ['implement', 'create', 'build', 'design', 'develop', 'test', 'validate', 'measure'];
    const actionCount = actionWords.reduce((count, word) => {
      return count + (text.toLowerCase().split(word).length - 1);
    }, 0);

    return Math.min(100, actionCount * 15);
  }

  private calculateTestabilityScore(text: string): number {
    const testableWords = ['verify', 'test', 'validate', 'measure', 'check', 'assert', 'confirm'];
    const testableCount = testableWords.reduce((count, word) => {
      return count + (text.toLowerCase().split(word).length - 1);
    }, 0);

    return Math.min(100, testableCount * 20);
  }

  // Utility methods
  private calculateOverallScore(results: ValidationResult[]): number {
    if (results.length === 0) {
      return 0;
    }

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return totalScore / results.length;
  }

  private determinePassStatus(score: number, issues: ValidationIssue[]): boolean {
    const errorCount = issues.filter(i => i.type === 'error').length;
    const criticalIssues = issues.filter(i => i.severity >= 8).length;

    return score >= 70 && errorCount === 0 && criticalIssues === 0;
  }

  private generateRecommendations(
    results: ValidationResult[],
    issues: ValidationIssue[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Generate recommendations based on issues
    for (const issue of issues) {
      if (issue.type === 'error' && issue.severity >= 7) {
        recommendations.push({
          id: `fix_${issue.id}`,
          type: 'fix',
          priority: 'high',
          description: issue.message,
          impact: 'Critical issue that must be resolved',
          effort: 'medium',
          implementation: issue.suggestion
        });
      } else if (issue.type === 'warning') {
        recommendations.push({
          id: `improve_${issue.id}`,
          type: 'improvement',
          priority: 'medium',
          description: issue.message,
          impact: 'Quality improvement',
          effort: 'low',
          implementation: issue.suggestion
        });
      }
    }

    return recommendations;
  }

  private createValidationReport(
    phase: any,
    overallScore: number,
    passed: boolean,
    results: ValidationResult[],
    recommendations: Recommendation[],
    processingTime: number
  ): ValidationReport {
    const metrics: ValidationMetrics = {
      totalValidations: results.length,
      passedValidations: results.filter(r => r.passed).length,
      failedValidations: results.filter(r => !r.passed).length,
      warningCount: results.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'warning').length, 0),
      processingTime,
      qualityScore: overallScore,
      improvementScore: this.calculateImprovementScore(phase.id, overallScore)
    };

    const summary: ValidationSummary = {
      strengths: this.identifyStrengths(results),
      weaknesses: this.identifyWeaknesses(results),
      criticalIssues: this.identifyCriticalIssues(results),
      quickWins: this.identifyQuickWins(recommendations),
      longTermImprovements: this.identifyLongTermImprovements(recommendations)
    };

    return {
      phaseId: phase.id || 'unknown',
      timestamp: new Date(),
      overallScore,
      passed,
      results,
      recommendations,
      metrics,
      summary
    };
  }

  private storeValidationHistory(phaseId: string, report: ValidationReport): void {
    if (!this.validationHistory.has(phaseId)) {
      this.validationHistory.set(phaseId, []);
    }

    const history = this.validationHistory.get(phaseId)!;
    history.push(report);

    // Keep only last 10 reports
    if (history.length > 10) {
      history.shift();
    }

    // Update quality trend
    this.updateQualityTrend(phaseId, report.overallScore);
  }

  private updateQualityTrend(phaseId: string, score: number): void {
    if (!this.qualityTrends.has(phaseId)) {
      this.qualityTrends.set(phaseId, []);
    }

    const trend = this.qualityTrends.get(phaseId)!;
    trend.push(score);

    // Keep only last 20 scores
    if (trend.length > 20) {
      trend.shift();
    }
  }

  private async applyAutoFixes(phase: any, issues: ValidationIssue[]): Promise<void> {
    console.log('🔧 Applying auto-fixes...');

    for (const issue of issues) {
      if (issue.type === 'error' && issue.severity < 8) {
        // Apply simple fixes
        await this.applySimpleFix(phase, issue);
      }
    }
  }

  private async applySimpleFix(phase: any, issue: ValidationIssue): Promise<void> {
    // Simple auto-fix implementations
    if (issue.id.startsWith('structure_missing_')) {
      const property = issue.id.replace('structure_missing_', '');
      if (!phase[property]) {
        phase[property] = `Auto-generated ${property}`;
      }
    }
  }

  private getScoreForCategory(results: ValidationResult[], category: string): number {
    const categoryResults = results.filter(r => r.details[category] !== undefined);
    if (categoryResults.length === 0) {
      return 0;
    }

    const total = categoryResults.reduce((sum, r) => sum + r.details[category], 0);
    return total / categoryResults.length;
  }

  private calculateImprovementScore(phaseId: string, currentScore: number): number {
    const history = this.getValidationHistory(phaseId);
    if (history.length < 2) {
      return 0;
    }

    const previousScore = history[history.length - 2].overallScore;
    return currentScore - previousScore;
  }

  private identifyStrengths(results: ValidationResult[]): string[] {
    const strengths: string[] = [];

    for (const result of results) {
      if (result.passed && result.score >= 85) {
        strengths.push(`High quality in ${Object.keys(result.details)[0] || 'validation'}`);
      }
    }

    return strengths;
  }

  private identifyWeaknesses(results: ValidationResult[]): string[] {
    const weaknesses: string[] = [];

    for (const result of results) {
      if (!result.passed || result.score < 70) {
        weaknesses.push(`Low quality in ${Object.keys(result.details)[0] || 'validation'}`);
      }
    }

    return weaknesses;
  }

  private identifyCriticalIssues(results: ValidationResult[]): string[] {
    const critical: string[] = [];

    for (const result of results) {
      const criticalIssues = result.issues.filter(i => i.severity >= 8);
      critical.push(...criticalIssues.map(i => i.message));
    }

    return critical;
  }

  private identifyQuickWins(recommendations: Recommendation[]): string[] {
    return recommendations
      .filter(r => r.effort === 'low' && r.priority === 'medium')
      .map(r => r.description);
  }

  private identifyLongTermImprovements(recommendations: Recommendation[]): string[] {
    return recommendations
      .filter(r => r.effort === 'high' && r.type === 'enhancement')
      .map(r => r.description);
  }

  private async validateContent(phase: any): Promise<ValidationResult> {
    const details: { clarity: number; completeness: number; actionability: number; } = {
      clarity: 0,
      completeness: 0,
      actionability: 0
    };
    const issues: ValidationIssue[] = [];
    const suggestions: Suggestion[] = [];

    try {
      // Validate content clarity
      details.clarity = this.assessClarity(phase);
      if (details.clarity < this.config.thresholds.clarity) {
        issues.push({
          type: 'content',
          message: 'Content clarity is below threshold',
          severity: 6,
          location: 'content',
          suggestion: 'Improve clarity by adding examples and better explanations'
        });
      }

      // Validate content completeness
      details.completeness = this.assessCompleteness(phase);
      if (details.completeness < this.config.thresholds.completeness) {
        issues.push({
          type: 'content',
          message: 'Content is incomplete',
          severity: 7,
          location: 'content',
          suggestion: 'Add missing sections and details'
        });
      }

      // Validate content actionability
      details.actionability = this.assessActionability(phase);
      if (details.actionability < this.config.thresholds.actionability) {
        issues.push({
          type: 'content',
          message: 'Content lacks actionable items',
          severity: 5,
          location: 'content',
          suggestion: 'Add concrete steps and action items'
        });
      }

      const score = (details.clarity + details.completeness + details.actionability) / 3 * 100;

      return {
        validatorId: 'content',
        passed: issues.filter(i => i.severity >= 7).length === 0,
        score,
        issues,
        suggestions,
        details
      };
    } catch (error) {
      return {
        validatorId: 'content',
        passed: false,
        score: 0,
        issues: [{
          type: 'error',
          message: `Content validation error: ${error instanceof Error ? error.message : String(error)}`,
          severity: 10,
          location: 'content'
        }],
        suggestions: [],
        details
      };
    }
  }

  private async validateQuality(phase: any): Promise<ValidationResult> {
    const details: { clarity: number; completeness: number; actionability: number; } = {
      clarity: 0,
      completeness: 0,
      actionability: 0
    };
    const issues: ValidationIssue[] = [];
    const suggestions: Suggestion[] = [];

    try {
      // Assess overall quality metrics
      const qualityMetrics = {
        structure: this.assessStructureQuality(phase),
        content: this.assessContentQuality(phase),
        examples: this.assessExampleQuality(phase),
        documentation: this.assessDocumentationQuality(phase)
      };

      details.clarity = (qualityMetrics.structure + qualityMetrics.documentation) / 2;
      details.completeness = (qualityMetrics.content + qualityMetrics.examples) / 2;
      details.actionability = (qualityMetrics.structure + qualityMetrics.content + qualityMetrics.examples) / 3;

      // Check quality thresholds
      if (details.clarity < this.config.thresholds.clarity) {
        issues.push({
          type: 'quality',
          message: 'Overall clarity needs improvement',
          severity: 5,
          location: 'quality',
          suggestion: 'Improve structure and documentation'
        });
      }

      if (details.completeness < this.config.thresholds.completeness) {
        issues.push({
          type: 'quality',
          message: 'Quality standards not fully met',
          severity: 6,
          location: 'quality',
          suggestion: 'Enhance content and add more examples'
        });
      }

      const score = (details.clarity + details.completeness + details.actionability) / 3 * 100;

      return {
        validatorId: 'quality',
        passed: issues.filter(i => i.severity >= 7).length === 0,
        score,
        issues,
        suggestions,
        details
      };
    } catch (error) {
      return {
        validatorId: 'quality',
        passed: false,
        score: 0,
        issues: [{
          type: 'error',
          message: `Quality validation error: ${error instanceof Error ? error.message : String(error)}`,
          severity: 10,
          location: 'quality'
        }],
        suggestions: [],
        details
      };
    }
  }

  private assessClarity(content: any): number {
    if (!content || typeof content !== 'object') {
      return 0;
    }

    let clarityScore = 0.5; // Base score

    // Check for clear structure
    if (content.structure) {
      clarityScore += 0.2;
    }

    // Check for clear language
    if (content.language?.clear) {
      clarityScore += 0.2;
    }

    // Check for examples
    if (content.examples && content.examples.length > 0) {
      clarityScore += 0.1;
    }

    return Math.min(clarityScore, 1.0);
  }

  private assessCompleteness(content: any): number {
    if (!content) {
      return 0;
    }

    let completenessScore = 0.3; // Base score

    // Check required sections
    const requiredSections = ['objectives', 'requirements', 'implementation', 'validation'];
    const presentSections = requiredSections.filter(section => content[section]);
    completenessScore += (presentSections.length / requiredSections.length) * 0.7;

    return Math.min(completenessScore, 1.0);
  }

  private assessActionability(content: any): number {
    if (!content) {
      return 0;
    }

    let actionabilityScore = 0.2; // Base score

    // Check for action items
    if (content.actionItems && content.actionItems.length > 0) {
      actionabilityScore += 0.3;
    }

    // Check for clear steps
    if (content.steps && content.steps.length > 0) {
      actionabilityScore += 0.3;
    }

    // Check for measurable outcomes
    if (content.outcomes && content.outcomes.length > 0) {
      actionabilityScore += 0.2;
    }

    return Math.min(actionabilityScore, 1.0);
  }

  private assessStructureQuality(phase: any): number {
    if (!phase?.structure) {
      return 0.5;
    }
    // Add more sophisticated structure assessment logic
    return 0.8;
  }

  private assessContentQuality(phase: any): number {
    if (!phase?.content) {
      return 0.5;
    }
    // Add more sophisticated content assessment logic
    return 0.75;
  }

  private assessExampleQuality(phase: any): number {
    if (!phase?.examples || phase.examples.length === 0) {
      return 0.3;
    }
    // Add more sophisticated example assessment logic
    return 0.85;
  }

  private assessDocumentationQuality(phase: any): number {
    if (!phase?.documentation) {
      return 0.4;
    }
    // Add more sophisticated documentation assessment logic
    return 0.9;
  }
}
