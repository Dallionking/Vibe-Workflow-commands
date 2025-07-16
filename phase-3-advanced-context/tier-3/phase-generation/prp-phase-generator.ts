/**
 * PRP Phase Generator
 * Phase 3: Advanced Context Features - Tier 3.1
 *
 * Enhanced phase generation system that transforms existing phases to PRP format,
 * creates new phases with validation gates, and integrates example pattern library.
 */

import { PhaseTransformer } from './phase-transformer';
import { ValidationGate } from './validation-gate';
import { ExamplePatternLibrary } from './example-pattern-library';

export interface PRPPhaseConfig {
    id: string;
    name: string;
    description: string;
    complexity: 'low' | 'medium' | 'high';
    dependencies: string[];
    validation: ValidationCriteria;
    examples: ExamplePattern[];
    templates: PRPTemplate[];
}

export interface ValidationCriteria {
    requiredFields: string[];
    qualityThresholds: {
        clarity: number;
        completeness: number;
        actionability: number;
    };
    contextRequirements: string[];
    outputValidation: (result: any) => boolean;
}

export interface ExamplePattern {
    id: string;
    name: string;
    description: string;
    input: any;
    output: any;
    context: string;
    quality: number;
    metadata: {
        domain: string;
        complexity: number;
        recency: number;
        usage: number;
    };
}

export interface PRPTemplate {
    id: string;
    name: string;
    description: string;
    structure: {
        sections: TemplateSection[];
        placeholders: Placeholder[];
        conditionalBlocks: ConditionalBlock[];
    };
    validation: ValidationRule[];
    examples: ExampleUsage[];
}

export interface TemplateSection {
    id: string;
    name: string;
    description: string;
    required: boolean;
    content: string;
    validation: ValidationRule[];
}

export interface Placeholder {
    id: string;
    name: string;
    description: string;
    type: 'text' | 'number' | 'boolean' | 'array' | 'object';
    defaultValue?: any;
    validation: ValidationRule[];
}

export interface ConditionalBlock {
    id: string;
    condition: string;
    content: string;
    alternatives: ConditionalBlock[];
}

export interface ValidationRule {
    id: string;
    type: 'required' | 'format' | 'length' | 'custom';
    condition: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}

export interface ExampleUsage {
    id: string;
    scenario: string;
    input: any;
    output: any;
    explanation: string;
}

export interface PhaseGenerationResult {
    success: boolean;
    phase: PRPPhaseConfig;
    validation: ValidationResult;
    metrics: GenerationMetrics;
    warnings: string[];
    errors: string[];
}

export interface ValidationResult {
    passed: boolean;
    score: number;
    details: {
        clarity: number;
        completeness: number;
        actionability: number;
    };
    issues: ValidationIssue[];
}

export interface ValidationIssue {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
    severity: number;
}

export interface GenerationMetrics {
    processingTime: number;
    complexityScore: number;
    validationTime: number;
    exampleMatches: number;
    templateUsage: number;
    cacheHits: number;
}

export class PRPPhaseGenerator {
  private phaseTransformer: PhaseTransformer;
  private validationGate: ValidationGate;
  private exampleLibrary: ExamplePatternLibrary;
  private phaseCache: Map<string, PRPPhaseConfig> = new Map();
  private templateCache: Map<string, PRPTemplate> = new Map();
  private validationCache: Map<string, ValidationResult> = new Map();

  constructor() {
    this.phaseTransformer = new PhaseTransformer();
    this.validationGate = new ValidationGate();
    this.exampleLibrary = new ExamplePatternLibrary();
    console.log('🏗️ PRP Phase Generator initialized');
  }

  /**
     * Transform existing phase to PRP format
     */
  async transformExistingPhase(
    phaseId: string,
    existingPhase: any,
    config: Partial<PRPPhaseConfig> = {}
  ): Promise<PhaseGenerationResult> {
    console.log(`🔄 Transforming existing phase: ${phaseId}`);

    const startTime = Date.now();

    try {
      // Get cached result if available
      const cacheKey = `transform_${phaseId}`;
      if (this.phaseCache.has(cacheKey)) {
        console.log(`⚡ Using cached transformation for ${phaseId}`);
        return {
          success: true,
          phase: this.phaseCache.get(cacheKey)!,
          validation: this.validationCache.get(cacheKey)!,
          metrics: {
            processingTime: Date.now() - startTime,
            complexityScore: 0,
            validationTime: 0,
            exampleMatches: 0,
            templateUsage: 0,
            cacheHits: 1
          },
          warnings: [],
          errors: []
        };
      }

      // Transform phase using PRP structure
      const transformedPhase = await this.phaseTransformer.transformToPhaseFormat(
        existingPhase,
        config
      );

      // Enhance with examples from pattern library
      const enhancedPhase = await this.enhanceWithExamples(
        transformedPhase,
        phaseId
      );

      // Apply validation gates
      const validationResult = await this.validationGate.validatePhase(
        enhancedPhase
      );

      // Generate final phase configuration
      const finalPhase: PRPPhaseConfig = {
        id: phaseId,
        name: config.name || transformedPhase.name,
        description: config.description || transformedPhase.description,
        complexity: this.calculateComplexity(enhancedPhase),
        dependencies: config.dependencies || [],
        validation: this.createValidationCriteria(enhancedPhase),
        examples: enhancedPhase.examples || [],
        templates: await this.generateTemplates(enhancedPhase)
      };

      // Cache results
      this.phaseCache.set(cacheKey, finalPhase);
      this.validationCache.set(cacheKey, validationResult);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Phase transformation completed in ${processingTime}ms`);

      return {
        success: validationResult.passed,
        phase: finalPhase,
        validation: validationResult,
        metrics: {
          processingTime,
          complexityScore: this.calculateComplexityScore(finalPhase),
          validationTime: validationResult.score,
          exampleMatches: enhancedPhase.examples?.length || 0,
          templateUsage: finalPhase.templates.length,
          cacheHits: 0
        },
        warnings: validationResult.issues.filter(i => i.type === 'warning').map(i => i.message),
        errors: validationResult.issues.filter(i => i.type === 'error').map(i => i.message)
      };

    } catch (error) {
      console.error(`❌ Phase transformation failed: ${error}`);
      return {
        success: false,
        phase: {} as PRPPhaseConfig,
        validation: {
          passed: false,
          score: 0,
          details: { clarity: 0, completeness: 0, actionability: 0 },
          issues: [{
            id: 'transform_error',
            type: 'error',
            message: `Transformation failed: ${error.message}`,
            suggestion: 'Check phase structure and configuration',
            severity: 10
          }]
        },
        metrics: {
          processingTime: Date.now() - startTime,
          complexityScore: 0,
          validationTime: 0,
          exampleMatches: 0,
          templateUsage: 0,
          cacheHits: 0
        },
        warnings: [],
        errors: [error.message]
      };
    }
  }

  /**
     * Generate new phase with PRP format
     */
  async generateNewPhase(
    phaseId: string,
    requirements: {
            objective: string;
            constraints: string[];
            inputs: any[];
            outputs: any[];
            context: string;
        },
    config: Partial<PRPPhaseConfig> = {}
  ): Promise<PhaseGenerationResult> {
    console.log(`🆕 Generating new phase: ${phaseId}`);

    const startTime = Date.now();

    try {
      // Find relevant examples from pattern library
      const relevantExamples = await this.exampleLibrary.findSimilarExamples(
        requirements.objective,
        { maxExamples: 5, minSimilarity: 0.7 }
      );

      // Select best template based on requirements
      const bestTemplate = await this.selectBestTemplate(
        requirements,
        relevantExamples
      );

      // Generate phase structure
      const generatedPhase = await this.generatePhaseStructure(
        phaseId,
        requirements,
        bestTemplate,
        relevantExamples
      );

      // Apply validation gates
      const validationResult = await this.validationGate.validatePhase(
        generatedPhase
      );

      // Create final phase configuration
      const finalPhase: PRPPhaseConfig = {
        id: phaseId,
        name: config.name || generatedPhase.name,
        description: config.description || generatedPhase.description,
        complexity: this.calculateComplexity(generatedPhase),
        dependencies: config.dependencies || [],
        validation: this.createValidationCriteria(generatedPhase),
        examples: relevantExamples,
        templates: [bestTemplate]
      };

      const processingTime = Date.now() - startTime;
      console.log(`✅ Phase generation completed in ${processingTime}ms`);

      return {
        success: validationResult.passed,
        phase: finalPhase,
        validation: validationResult,
        metrics: {
          processingTime,
          complexityScore: this.calculateComplexityScore(finalPhase),
          validationTime: validationResult.score,
          exampleMatches: relevantExamples.length,
          templateUsage: 1,
          cacheHits: 0
        },
        warnings: validationResult.issues.filter(i => i.type === 'warning').map(i => i.message),
        errors: validationResult.issues.filter(i => i.type === 'error').map(i => i.message)
      };

    } catch (error) {
      console.error(`❌ Phase generation failed: ${error}`);
      return {
        success: false,
        phase: {} as PRPPhaseConfig,
        validation: {
          passed: false,
          score: 0,
          details: { clarity: 0, completeness: 0, actionability: 0 },
          issues: [{
            id: 'generation_error',
            type: 'error',
            message: `Generation failed: ${error.message}`,
            suggestion: 'Check requirements and template availability',
            severity: 10
          }]
        },
        metrics: {
          processingTime: Date.now() - startTime,
          complexityScore: 0,
          validationTime: 0,
          exampleMatches: 0,
          templateUsage: 0,
          cacheHits: 0
        },
        warnings: [],
        errors: [error.message]
      };
    }
  }

  /**
     * Update existing phase generation commands
     */
  async updatePhaseCommands(
    phaseId: string,
    updates: Partial<PRPPhaseConfig>
  ): Promise<boolean> {
    console.log(`🔄 Updating phase commands for: ${phaseId}`);

    try {
      // Get existing phase
      const existingPhase = this.phaseCache.get(phaseId);
      if (!existingPhase) {
        throw new Error(`Phase ${phaseId} not found in cache`);
      }

      // Apply updates
      const updatedPhase: PRPPhaseConfig = {
        ...existingPhase,
        ...updates
      };

      // Re-validate updated phase
      const validationResult = await this.validationGate.validatePhase(
        updatedPhase
      );

      if (!validationResult.passed) {
        console.warn(`⚠️ Updated phase ${phaseId} failed validation`);
        return false;
      }

      // Update cache
      this.phaseCache.set(phaseId, updatedPhase);
      this.validationCache.set(phaseId, validationResult);

      console.log(`✅ Phase commands updated successfully for ${phaseId}`);
      return true;

    } catch (error) {
      console.error(`❌ Phase command update failed: ${error}`);
      return false;
    }
  }

  /**
     * Get phase generation statistics
     */
  getGenerationStats(): {
        totalPhases: number;
        cacheHitRate: number;
        averageProcessingTime: number;
        validationSuccessRate: number;
        } {
    const totalPhases = this.phaseCache.size;
    const validationSuccesses = Array.from(this.validationCache.values())
      .filter(v => v.passed).length;

    return {
      totalPhases,
      cacheHitRate: 0.8, // Placeholder - would track actual cache hits
      averageProcessingTime: 250, // Placeholder - would track actual times
      validationSuccessRate: validationSuccesses / totalPhases || 0
    };
  }

  // Private helper methods
  private async enhanceWithExamples(
    phase: any,
    phaseId: string
  ): Promise<any> {
    const examples = await this.exampleLibrary.findSimilarExamples(
      phase.description,
      { maxExamples: 3, minSimilarity: 0.6 }
    );

    return {
      ...phase,
      examples
    };
  }

  private calculateComplexity(phase: any): 'low' | 'medium' | 'high' {
    const factors = [
      phase.templates?.length || 0,
      phase.examples?.length || 0,
      phase.dependencies?.length || 0
    ];

    const totalComplexity = factors.reduce((sum, factor) => sum + factor, 0);

    if (totalComplexity <= 5) {
      return 'low';
    }
    if (totalComplexity <= 10) {
      return 'medium';
    }
    return 'high';
  }

  private calculateComplexityScore(phase: PRPPhaseConfig): number {
    const weights = {
      templates: 0.3,
      examples: 0.2,
      dependencies: 0.3,
      validation: 0.2
    };

    return (
      (phase.templates.length * weights.templates) +
            (phase.examples.length * weights.examples) +
            (phase.dependencies.length * weights.dependencies) +
            (phase.validation.requiredFields.length * weights.validation)
    );
  }

  private createValidationCriteria(phase: any): ValidationCriteria {
    return {
      requiredFields: ['name', 'description', 'examples'],
      qualityThresholds: {
        clarity: 0.8,
        completeness: 0.85,
        actionability: 0.9
      },
      contextRequirements: ['project_context', 'phase_context'],
      outputValidation: (result: any) => {
        return result?.success && result.validation?.passed;
      }
    };
  }

  private async generateTemplates(phase: any): Promise<PRPTemplate[]> {
    // Generate templates based on phase structure
    const baseTemplate: PRPTemplate = {
      id: `template_${phase.id}`,
      name: `${phase.name} Template`,
      description: `Template for ${phase.name} phase`,
      structure: {
        sections: [
          {
            id: 'objective',
            name: 'Objective',
            description: 'Phase objective and goals',
            required: true,
            content: phase.description || '',
            validation: []
          }
        ],
        placeholders: [],
        conditionalBlocks: []
      },
      validation: [],
      examples: []
    };

    return [baseTemplate];
  }

  private async selectBestTemplate(
    requirements: any,
    examples: ExamplePattern[]
  ): Promise<PRPTemplate> {
    // Select template based on requirements and examples
    return {
      id: 'generated_template',
      name: 'Generated Template',
      description: 'Template generated from requirements',
      structure: {
        sections: [
          {
            id: 'main',
            name: 'Main Content',
            description: 'Main phase content',
            required: true,
            content: requirements.objective,
            validation: []
          }
        ],
        placeholders: [],
        conditionalBlocks: []
      },
      validation: [],
      examples: []
    };
  }

  private async generatePhaseStructure(
    phaseId: string,
    requirements: any,
    template: PRPTemplate,
    examples: ExamplePattern[]
  ): Promise<any> {
    return {
      id: phaseId,
      name: `Generated Phase ${phaseId}`,
      description: requirements.objective,
      template,
      examples
    };
  }
}
