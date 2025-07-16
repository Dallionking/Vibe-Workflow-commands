/**
 * PRP Validation Engine
 * Phase 3: Advanced Context Features
 *
 * Comprehensive validation framework for PRP documents ensuring
 * quality, consistency, and effectiveness of generated prompts.
 */

import {
  PRPDocument,
  PRPValidation,
  ValidationIssue,
  ValidationRecommendation,
  ValidationCriteria,
  QualityMetrics,
  PRPContent,
  ChainOfThoughtStructure,
  FewShotExample
} from '../generator/interfaces';

export interface ValidationConfig {
    strictMode: boolean;
    qualityThreshold: number;
    enableAIValidation: boolean;
    validateChainOfThought: boolean;
    validateFewShotExamples: boolean;
    validateOutputFormat: boolean;
    customValidators: CustomValidator[];
}

export interface CustomValidator {
    name: string;
    description: string;
    validator: (document: PRPDocument) => Promise<ValidationResult>;
    weight: number;
    enabled: boolean;
}

export interface ValidationResult {
    passed: boolean;
    score: number;
    issues: ValidationIssue[];
    recommendations: ValidationRecommendation[];
    metrics: Partial<QualityMetrics>;
}

export interface ValidationContext {
    projectType: string;
    complexityLevel: string;
    expectedOutputs: string[];
    qualityStandards: QualityStandard[];
    domainSpecificRules: DomainRule[];
}

export interface QualityStandard {
    name: string;
    description: string;
    threshold: number;
    weight: number;
    validator: string;
}

export interface DomainRule {
    domain: string;
    rule: string;
    severity: 'error' | 'warning' | 'info';
    validator: string;
}

export class PRPValidationEngine {
  private config: ValidationConfig;
  private validators: Map<string, CustomValidator>;
  private qualityAnalyzer: QualityAnalyzer;
  private coherenceChecker: CoherenceChecker;
  private consistencyValidator: ConsistencyValidator;

  constructor(config: ValidationConfig) {
    this.config = config;
    this.validators = new Map();
    this.qualityAnalyzer = new QualityAnalyzer();
    this.coherenceChecker = new CoherenceChecker();
    this.consistencyValidator = new ConsistencyValidator();

    this.initializeValidators();
  }

  /**
     * Validate a PRP document comprehensively
     */
  async validateDocument(
    document: PRPDocument,
    context: ValidationContext
  ): Promise<PRPValidation> {
    const validationStart = Date.now();
    const allIssues: ValidationIssue[] = [];
    const allRecommendations: ValidationRecommendation[] = [];
    const qualityMetrics: QualityMetrics = {
      clarity: 0,
      completeness: 0,
      consistency: 0,
      coherence: 0,
      effectiveness: 0,
      efficiency: 0,
      maintainability: 0
    };

    try {
      // 1. Structural validation
      const structuralResult = await this.validateStructure(document);
      allIssues.push(...structuralResult.issues);
      allRecommendations.push(...structuralResult.recommendations);

      // 2. Content quality validation
      const qualityResult = await this.validateContentQuality(
        document.content,
        context
      );
      allIssues.push(...qualityResult.issues);
      allRecommendations.push(...qualityResult.recommendations);
      Object.assign(qualityMetrics, qualityResult.metrics);

      // 3. Chain of Thought validation
      if (this.config.validateChainOfThought && document.content.chainOfThought.enabled) {
        const cotResult = await this.validateChainOfThought(
          document.content.chainOfThought,
          context
        );
        allIssues.push(...cotResult.issues);
        allRecommendations.push(...cotResult.recommendations);
      }

      // 4. Few-shot examples validation
      if (this.config.validateFewShotExamples && document.content.fewShotExamples.length > 0) {
        const fewShotResult = await this.validateFewShotExamples(
          document.content.fewShotExamples,
          context
        );
        allIssues.push(...fewShotResult.issues);
        allRecommendations.push(...fewShotResult.recommendations);
      }

      // 5. Output format validation
      if (this.config.validateOutputFormat) {
        const formatResult = await this.validateOutputFormat(
          document.content.outputFormat,
          context
        );
        allIssues.push(...formatResult.issues);
        allRecommendations.push(...formatResult.recommendations);
      }

      // 6. Validation criteria consistency
      const criteriaResult = await this.validateCriteria(
        document.content.validationCriteria,
        context
      );
      allIssues.push(...criteriaResult.issues);
      allRecommendations.push(...criteriaResult.recommendations);

      // 7. Custom validators
      for (const validator of this.validators.values()) {
        if (validator.enabled) {
          const customResult = await validator.validator(document);
          allIssues.push(...customResult.issues);
          allRecommendations.push(...customResult.recommendations);
        }
      }

      // 8. Calculate overall validation score
      const validationScore = this.calculateValidationScore(
        allIssues,
        qualityMetrics,
        context
      );

      // 9. Determine if validation passed
      const isValid = validationScore >= this.config.qualityThreshold &&
                           !allIssues.some(issue => issue.type === 'error');

      return {
        isValid,
        validationScore,
        issues: allIssues,
        recommendations: allRecommendations,
        qualityMetrics
      };

    } catch (error) {
      return {
        isValid: false,
        validationScore: 0,
        issues: [{
          type: 'error',
          severity: 'critical',
          message: `Validation failed: ${(error as Error).message || 'Unknown error'}`,
          location: 'validation-engine',
          suggestedFix: 'Review document structure and content',
          autoFixable: false
        }],
        recommendations: [],
        qualityMetrics
      };
    }
  }

  /**
     * Validate document structure
     */
  private async validateStructure(document: PRPDocument): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];
    const metrics: Partial<QualityMetrics> = {};

    // Check required fields
    if (!document.id || !document.name || !document.version) {
      issues.push({
        type: 'error',
        severity: 'high',
        message: 'Missing required document fields (id, name, version)',
        location: 'document-header',
        suggestedFix: 'Ensure all required fields are populated',
        autoFixable: true
      });
    }

    // Check content structure
    if (!document.content) {
      issues.push({
        type: 'error',
        severity: 'critical',
        message: 'Document content is missing',
        location: 'document-content',
        suggestedFix: 'Generate document content',
        autoFixable: false
      });
    } else {
      // Validate content completeness
      const requiredFields = [
        'systemPrompt',
        'contextPrompt',
        'instructionPrompt',
        'outputFormat'
      ];

      for (const field of requiredFields) {
        if (!(document.content as any)[field]) {
          issues.push({
            type: 'error',
            severity: 'high',
            message: `Missing required content field: ${field}`,
            location: `content.${field}`,
            suggestedFix: `Generate ${field} content`,
            autoFixable: true
          });
        }
      }
    }

    // Check metadata completeness
    if (!document.metadata) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Document metadata is missing',
        location: 'document-metadata',
        suggestedFix: 'Generate document metadata',
        autoFixable: true
      });
    }

    metrics.completeness = this.calculateCompleteness(document);

    return {
      passed: issues.filter(i => i.type === 'error').length === 0,
      score: metrics.completeness || 0,
      issues,
      recommendations,
      metrics
    };
  }

  /**
     * Validate content quality
     */
  private async validateContentQuality(
    content: PRPContent,
    context: ValidationContext
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];
    const metrics: Partial<QualityMetrics> = {};

    // Clarity validation
    metrics.clarity = await this.analyzeClarity(content);
    if (metrics.clarity < 0.7) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Content clarity is below threshold',
        location: 'content-clarity',
        suggestedFix: 'Improve prompt clarity and structure',
        autoFixable: false
      });
    }

    // Coherence validation
    metrics.coherence = await this.checkCoherence(content);
    if (metrics.coherence < 0.8) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Content coherence needs improvement',
        location: 'content-coherence',
        suggestedFix: 'Improve logical flow and connections',
        autoFixable: false
      });
    }

    // Consistency validation
    metrics.consistency = await this.validateConsistency(
      content,
      context
    );
    if (metrics.consistency < 0.85) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Content consistency issues detected',
        location: 'content-consistency',
        suggestedFix: 'Ensure consistent terminology and style',
        autoFixable: false
      });
    }

    // Effectiveness estimation
    metrics.effectiveness = await this.estimateEffectiveness(content, context);
    if (metrics.effectiveness < 0.75) {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        description: 'Content effectiveness could be improved',
        impact: 'Better prompt results and user satisfaction',
        effort: 3,
        implementation: 'Enhance examples and instructions'
      });
    }

    // Calculate remaining metrics
    metrics.efficiency = this.calculateEfficiency(content);
    metrics.completeness = this.calculateContentCompleteness(content);
    metrics.maintainability = this.calculateMaintainability(content);

    return {
      passed: issues.filter(i => i.type === 'error').length === 0,
      score: (metrics.clarity + metrics.coherence + metrics.consistency + metrics.effectiveness) / 4,
      issues,
      recommendations,
      metrics
    };
  }

  /**
     * Validate Chain of Thought structure
     */
  private async validateChainOfThought(
    cot: ChainOfThoughtStructure,
    context: ValidationContext
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];
    const metrics: Partial<QualityMetrics> = {};

    // Check reasoning steps
    if (cot.reasoningSteps.length === 0) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Chain of Thought enabled but no reasoning steps defined',
        location: 'chainOfThought.reasoningSteps',
        suggestedFix: 'Add reasoning steps for complex problem solving',
        autoFixable: false
      });
    }

    // Validate step dependencies
    for (const step of cot.reasoningSteps) {
      if (step.dependencies.length > 0) {
        for (const dep of step.dependencies) {
          const depExists = cot.reasoningSteps.some(s => s.id === dep);
          if (!depExists) {
            issues.push({
              type: 'error',
              severity: 'high',
              message: `Step ${step.id} depends on non-existent step ${dep}`,
              location: `chainOfThought.reasoningSteps.${step.id}`,
              suggestedFix: `Add step ${dep} or remove dependency`,
              autoFixable: false
            });
          }
        }
      }
    }

    // Check thought process completeness
    if (!cot.thoughtProcess.initialAnalysis) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        description: 'Add initial analysis to thought process',
        impact: 'Better problem understanding and solution approach',
        effort: 2,
        implementation: 'Generate initial analysis section'
      });
    }

    // Validate validation checks
    if (cot.validationChecks.length === 0) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        description: 'Add validation checks to Chain of Thought',
        impact: 'Improved reliability and accuracy',
        effort: 3,
        implementation: 'Add logical and consistency checks'
      });
    }

    return {
      passed: issues.filter(i => i.type === 'error').length === 0,
      score: 0.85, // Base score for valid CoT
      issues,
      recommendations,
      metrics
    };
  }

  /**
     * Validate few-shot examples
     */
  private async validateFewShotExamples(
    examples: FewShotExample[],
    context: ValidationContext
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];
    const metrics: Partial<QualityMetrics> = {};

    // Check example quality
    for (const example of examples) {
      if (example.quality === 'poor') {
        issues.push({
          type: 'warning',
          severity: 'medium',
          message: `Example ${example.id} has poor quality rating`,
          location: `fewShotExamples.${example.id}`,
          suggestedFix: 'Improve example quality or remove',
          autoFixable: false
        });
      }

      if (example.relevance < 0.7) {
        issues.push({
          type: 'warning',
          severity: 'medium',
          message: `Example ${example.id} has low relevance (${example.relevance})`,
          location: `fewShotExamples.${example.id}`,
          suggestedFix: 'Increase relevance or replace example',
          autoFixable: false
        });
      }
    }

    // Check example diversity
    const scenarios = examples.map(e => e.scenario);
    const uniqueScenarios = new Set(scenarios);
    if (uniqueScenarios.size < scenarios.length * 0.8) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        description: 'Increase diversity of few-shot examples',
        impact: 'Better generalization and learning',
        effort: 3,
        implementation: 'Add examples covering different scenarios'
      });
    }

    return {
      passed: issues.filter(i => i.type === 'error').length === 0,
      score: 0.8, // Base score for valid examples
      issues,
      recommendations,
      metrics
    };
  }

  /**
     * Validate output format specification
     */
  private async validateOutputFormat(
    outputFormat: any,
    context: ValidationContext
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];
    const metrics: Partial<QualityMetrics> = {};

    // Check format specification
    if (!outputFormat.format) {
      issues.push({
        type: 'error',
        severity: 'high',
        message: 'Output format not specified',
        location: 'outputFormat.format',
        suggestedFix: 'Specify output format (markdown, json, etc.)',
        autoFixable: true
      });
    }

    // Check structure completeness
    if (!outputFormat.structure?.sections) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Output structure not properly defined',
        location: 'outputFormat.structure',
        suggestedFix: 'Define clear output structure with sections',
        autoFixable: false
      });
    }

    // Check examples
    if (!outputFormat.examples || outputFormat.examples.length === 0) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        description: 'Add output format examples',
        impact: 'Clearer expectations and better results',
        effort: 2,
        implementation: 'Provide concrete output examples'
      });
    }

    return {
      passed: issues.filter(i => i.type === 'error').length === 0,
      score: 0.85, // Base score for valid format
      issues,
      recommendations,
      metrics
    };
  }

  /**
     * Validate criteria consistency
     */
  private async validateCriteria(
    criteria: ValidationCriteria[],
    context: ValidationContext
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];
    const metrics: Partial<QualityMetrics> = {};

    // Check minimum criteria
    if (criteria.length < 3) {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        description: 'Add more validation criteria',
        impact: 'Better quality assurance',
        effort: 2,
        implementation: 'Define additional quality criteria'
      });
    }

    // Check weight distribution
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.1) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: `Criteria weights sum to ${totalWeight}, should be 1.0`,
        location: 'validationCriteria.weights',
        suggestedFix: 'Adjust weights to sum to 1.0',
        autoFixable: true
      });
    }

    // Check critical criteria
    const criticalCriteria = criteria.filter(c => c.criticalityLevel === 'critical');
    if (criticalCriteria.length === 0) {
      recommendations.push({
        type: 'improvement',
        priority: 'low',
        description: 'Consider adding critical validation criteria',
        impact: 'Ensure essential quality standards',
        effort: 1,
        implementation: 'Identify and add critical criteria'
      });
    }

    return {
      passed: issues.filter(i => i.type === 'error').length === 0,
      score: 0.9, // Base score for valid criteria
      issues,
      recommendations,
      metrics
    };
  }

  // Private helper methods
  private initializeValidators(): void {
    // Initialize built-in validators
    this.registerValidator({
      name: 'token-budget',
      description: 'Validates token budget compliance',
      validator: this.validateTokenBudget.bind(this),
      weight: 0.1,
      enabled: true
    });

    this.registerValidator({
      name: 'domain-specific',
      description: 'Validates domain-specific requirements',
      validator: this.validateDomainSpecific.bind(this),
      weight: 0.15,
      enabled: true
    });

    // Register custom validators from config
    if (this.config.customValidators) {
      for (const customValidator of this.config.customValidators) {
        this.registerValidator(customValidator);
      }
    }
  }

  private registerValidator(validator: CustomValidator): void {
    this.validators.set(validator.name, validator);
  }

  private calculateValidationScore(
    issues: ValidationIssue[],
    qualityMetrics: QualityMetrics,
    context: ValidationContext
  ): number {
    // Base score from quality metrics
    const baseScore = (
      qualityMetrics.clarity +
            qualityMetrics.completeness +
            qualityMetrics.consistency +
            qualityMetrics.coherence +
            qualityMetrics.effectiveness +
            qualityMetrics.efficiency +
            qualityMetrics.maintainability
    ) / 7;

    // Penalty for issues
    const errorPenalty = issues.filter(i => i.type === 'error').length * 0.2;
    const warningPenalty = issues.filter(i => i.type === 'warning').length * 0.1;

    return Math.max(0, baseScore - errorPenalty - warningPenalty);
  }

  private calculateCompleteness(document: PRPDocument): number {
    const requiredFields = [
      'id', 'name', 'version', 'content', 'metadata'
    ];

    const presentFields = requiredFields.filter(field => (document as any)[field]);
    return presentFields.length / requiredFields.length;
  }

  private async estimateEffectiveness(
    content: PRPContent,
    context: ValidationContext
  ): Promise<number> {
    // Placeholder for effectiveness estimation
    return 0.8;
  }

  private async validateTokenBudget(document: PRPDocument): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];

    if (document.performance.tokenUsage.budgetUtilization > 0.95) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        message: 'Token budget utilization exceeds 95%',
        location: 'performance.tokenUsage',
        suggestedFix: 'Optimize content for token efficiency',
        autoFixable: false
      });
    }

    return {
      passed: issues.filter(i => i.type === 'error').length === 0,
      score: 1.0 - (document.performance.tokenUsage.budgetUtilization - 0.8) / 0.2,
      issues,
      recommendations,
      metrics: {}
    };
  }

  private async validateDomainSpecific(document: PRPDocument): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const recommendations: ValidationRecommendation[] = [];

    // Domain-specific validation would be implemented here
    // This is a placeholder

    return {
      passed: true,
      score: 0.85,
      issues,
      recommendations,
      metrics: {}
    };
  }

  private async analyzeClarity(content: PRPContent): Promise<number> {
    // Basic clarity analysis based on content structure
    let score = 0.5;

    // Clear system prompt
    if (content.systemPrompt && content.systemPrompt.length > 50) {
      score += 0.1;
    }

    // Clear instructions
    if (content.instructionPrompt && content.instructionPrompt.length > 100) {
      score += 0.1;
    }

    // Has examples
    if (content.fewShotExamples && content.fewShotExamples.length > 0) {
      score += 0.15;
    }

    // Has validation criteria
    if (content.validationCriteria && content.validationCriteria.length > 0) {
      score += 0.15;
    }

    return Math.min(1.0, score);
  }

  private async checkCoherence(content: PRPContent): Promise<number> {
    // Basic coherence check
    let score = 0.6;

    // Chain of thought enabled
    if (content.chainOfThought && content.chainOfThought.enabled) {
      score += 0.2;
    }

    // Output format specified
    if (content.outputFormat && content.outputFormat.format) {
      score += 0.2;
    }

    return Math.min(1.0, score);
  }

  private async validateConsistency(
    content: PRPContent,
    context: ValidationContext
  ): Promise<number> {
    // Basic consistency validation
    let score = 0.7;

    // Validation criteria weights sum to 1
    if (content.validationCriteria) {
      const weightSum = content.validationCriteria.reduce((sum, c) => sum + c.weight, 0);
      if (Math.abs(weightSum - 1.0) < 0.01) {
        score += 0.15;
      }
    }

    // Project type consistency
    if (context.projectType) {
      score += 0.15;
    }

    return Math.min(1.0, score);
  }

  private calculateEfficiency(content: PRPContent): number {
    // Efficiency based on structure and conciseness
    let score = 0.7;

    // Efficient token usage
    if (content.constraintsAndLimitations && content.constraintsAndLimitations.length > 0) {
      score += 0.1;
    }

    // Output format defined
    if (content.outputFormat && content.outputFormat.format) {
      score += 0.2;
    }

    return Math.min(1.0, score);
  }

  private calculateContentCompleteness(content: PRPContent): number {
    // Completeness based on required fields
    let filledFields = 0;
    const totalFields = 7;

    if (content.systemPrompt) {
      filledFields++;
    }
    if (content.contextPrompt) {
      filledFields++;
    }
    if (content.instructionPrompt) {
      filledFields++;
    }
    if (content.chainOfThought) {
      filledFields++;
    }
    if (content.fewShotExamples) {
      filledFields++;
    }
    if (content.validationCriteria) {
      filledFields++;
    }
    if (content.outputFormat) {
      filledFields++;
    }

    return filledFields / totalFields;
  }

  private calculateMaintainability(content: PRPContent): number {
    // Maintainability based on structure and clarity
    let score = 0.6;

    // Well-structured chain of thought
    if (content.chainOfThought && content.chainOfThought.enabled) {
      score += 0.2;
    }

    // Clear validation criteria
    if (content.validationCriteria && content.validationCriteria.length > 0) {
      score += 0.2;
    }

    return Math.min(1.0, score);
  }
}

// Supporting classes
class QualityAnalyzer {
  async analyzeClarity(content: PRPContent): Promise<number> {
    // Analyze prompt clarity
    return 0.85; // Placeholder
  }
}

class CoherenceChecker {
  async checkCoherence(content: PRPContent): Promise<number> {
    // Check logical coherence
    return 0.88; // Placeholder
  }
}

class ConsistencyValidator {
  async validateConsistency(content: PRPContent, context: ValidationContext): Promise<number> {
    // Validate consistency
    return 0.82; // Placeholder
  }
}
