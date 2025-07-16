/**
 * Tests for PRP Generator
 * Comprehensive test coverage for prompt generation functionality
 */

import { PRPGenerator } from './prp-generator';
import {
  PRPGeneratorConfig,
  PRPGenerationContext,
  PRPGenerationResult,
  PRPDocument,
  ChainOfThoughtStructure,
  FewShotExample,
  ValidationCriteria
} from './interfaces';

describe('PRPGenerator', () => {
  let generator: PRPGenerator;
  let defaultConfig: PRPGeneratorConfig;
  let defaultContext: PRPGenerationContext;

  beforeEach(() => {
    defaultConfig = {
      enableChainOfThought: true,
      enableFewShotLearning: true,
      enableSelfConsistency: false,
      maxTokenBudget: 4000,
      qualityThreshold: 0.8,
      validationLevel: 'standard',
      optimizationMode: 'balanced',
      cachingEnabled: true,
      parallelProcessing: false
    };

    defaultContext = {
      projectName: 'TestProject',
      projectType: 'web-application',
      currentPhase: 1,
      previousPhases: [],
      availableContext: [],
      userPreferences: {
        verbosityLevel: 'standard',
        reasoningStyle: 'logical',
        examplePreference: 'moderate',
        validationStrictness: 'standard'
      },
      systemCapabilities: {
        availableTools: ['Context7', 'Perplexity'],
        mcpIntegrations: ['github', 'supabase'],
        contextLength: 8000,
        parallelProcessing: false,
        cachingCapabilities: true
      },
      constraints: {
        maxTokens: 4000,
        timeLimit: 5000,
        qualityRequirements: ['95% test coverage'],
        formatRequirements: ['markdown'],
        compatibilityRequirements: []
      }
    };

    generator = new PRPGenerator(defaultConfig);
  });

  describe('generatePRP', () => {
    it('should generate a valid PRP document', async () => {
      const sourceContent = `
# Phase 1: Foundation
Implement basic CRUD operations for user management.
            `;

      const result = await generator.generatePRP(sourceContent, defaultContext);

      expect(result.success).toBe(true);
      expect(result.document).toBeDefined();
      expect(result.document.id).toContain('prp-TestProject-phase-1');
      expect(result.document.metadata.promptType).toBe('phase');
      expect(result.generationMetrics.qualityScore).toBeGreaterThan(0);
    });

    it('should handle empty source content gracefully', async () => {
      const result = await generator.generatePRP('', defaultContext);

      expect(result.success).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should respect token budget constraints', async () => {
      const largeContent = 'Large content '.repeat(1000);
      const result = await generator.generatePRP(largeContent, defaultContext);

      expect(result.success).toBe(true);
      expect(result.document.performance.tokenUsage.totalTokens)
        .toBeLessThanOrEqual(defaultConfig.maxTokenBudget);
    });

    it('should generate Chain of Thought when enabled', async () => {
      const sourceContent = 'Complex implementation task';
      const result = await generator.generatePRP(sourceContent, defaultContext);

      expect(result.success).toBe(true);
      expect(result.document.content.chainOfThought.enabled).toBe(true);
      expect(result.document.content.chainOfThought.reasoningSteps).toBeDefined();
    });

    it('should disable Chain of Thought when config disabled', async () => {
      const configWithoutCoT = { ...defaultConfig, enableChainOfThought: false };
      const generatorNoCoT = new PRPGenerator(configWithoutCoT);

      const result = await generatorNoCoT.generatePRP('Test content', defaultContext);

      expect(result.success).toBe(true);
      expect(result.document.content.chainOfThought.enabled).toBe(false);
    });

    it('should include few-shot examples when enabled', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      expect(result.success).toBe(true);
      expect(result.document.content.fewShotExamples).toBeDefined();
      expect(Array.isArray(result.document.content.fewShotExamples)).toBe(true);
    });

    it('should handle different project types', async () => {
      const contexts = [
        { ...defaultContext, projectType: 'mobile-app' },
        { ...defaultContext, projectType: 'api-service' },
        { ...defaultContext, projectType: 'data-pipeline' }
      ];

      for (const context of contexts) {
        const result = await generator.generatePRP('Test', context);
        expect(result.success).toBe(true);
        expect(result.document.source.projectContext).toBe(context.projectName);
      }
    });

    it('should incorporate previous phases', async () => {
      const contextWithPrevious = {
        ...defaultContext,
        currentPhase: 3,
        previousPhases: [1, 2]
      };

      const result = await generator.generatePRP('Phase 3 content', contextWithPrevious);

      expect(result.success).toBe(true);
      expect(result.document.source.dependencies).toContain('phase-1');
      expect(result.document.source.dependencies).toContain('phase-2');
    });
  });

  describe('validation integration', () => {
    it('should validate generated content', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      expect(result.document.validation.isValid).toBeDefined();
      expect(result.document.validation.validationScore).toBeGreaterThan(0);
      expect(result.document.validation.qualityMetrics).toBeDefined();
    });

    it('should provide recommendations for improvement', async () => {
      const lowQualityContent = 'TODO: implement';
      const result = await generator.generatePRP(lowQualityContent, defaultContext);

      expect(result.success).toBe(true);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('performance metrics', () => {
    it('should track generation time', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      expect(result.generationMetrics.processingTime).toBeGreaterThan(0);
      expect(result.document.performance.generationTime).toBeGreaterThan(0);
    });

    it('should calculate efficiency metrics', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      const efficiency = result.generationMetrics.efficiency;
      expect(efficiency).toBeGreaterThan(0);
      expect(efficiency).toBeLessThanOrEqual(1);
    });
  });

  describe('error handling', () => {
    it('should handle generator errors gracefully', async () => {
      // Simulate error by passing invalid context
      const invalidContext = {} as PRPGenerationContext;

      const result = await generator.generatePRP('Test', invalidContext);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.generationMetrics.qualityScore).toBe(0);
    });

    it('should provide helpful error messages', async () => {
      const contextWithInvalidPhase = {
        ...defaultContext,
        currentPhase: -1
      };

      const result = await generator.generatePRP('Test', contextWithInvalidPhase);

      expect(result.success).toBe(false);
      expect(result.errors[0]).toContain('phase');
    });
  });

  describe('reasoning pattern selection', () => {
    it('should select appropriate reasoning pattern', async () => {
      const simpleContent = 'Add a button';
      const complexContent = `
                Implement a distributed caching system with:
                - Multi-region support
                - Automatic failover
                - Data consistency guarantees
                - Performance monitoring
            `;

      const simpleResult = await generator.generatePRP(simpleContent, defaultContext);
      const complexResult = await generator.generatePRP(complexContent, defaultContext);

      expect(simpleResult.document.metadata.reasoningPattern).toBe('zero-shot');
      expect(complexResult.document.metadata.reasoningPattern).toBe('chain-of-thought');
    });
  });

  describe('output format generation', () => {
    it('should generate appropriate output format', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      expect(result.document.content.outputFormat).toBeDefined();
      expect(result.document.content.outputFormat.format).toBe('markdown');
      expect(result.document.content.outputFormat.structure).toBeDefined();
    });

    it('should include format examples', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      expect(result.document.content.outputFormat.examples).toBeDefined();
      expect(Array.isArray(result.document.content.outputFormat.examples)).toBe(true);
    });
  });

  describe('constraint handling', () => {
    it('should respect time constraints', async () => {
      const contextWithShortTime = {
        ...defaultContext,
        constraints: {
          ...defaultContext.constraints,
          timeLimit: 100 // Very short time limit
        }
      };

      const start = Date.now();
      const result = await generator.generatePRP('Test', contextWithShortTime);
      const elapsed = Date.now() - start;

      expect(result.success).toBe(true);
      // Allow some buffer for async operations
      expect(elapsed).toBeLessThan(200);
    });

    it('should include constraints in generated content', async () => {
      const result = await generator.generatePRP('Test', defaultContext);

      expect(result.document.content.constraintsAndLimitations).toBeDefined();
      expect(result.document.content.constraintsAndLimitations.length).toBeGreaterThan(0);
      expect(result.document.content.constraintsAndLimitations[0])
        .toContain('Maximum token budget');
    });
  });

  describe('caching functionality', () => {
    it('should cache templates when caching enabled', async () => {
      // Generate twice with same content
      const content = 'Test caching';
      const result1 = await generator.generatePRP(content, defaultContext);
      const result2 = await generator.generatePRP(content, defaultContext);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      // Second generation should be faster due to caching
      expect(result2.generationMetrics.processingTime)
        .toBeLessThan(result1.generationMetrics.processingTime);
    });
  });

  describe('validation criteria generation', () => {
    it('should generate appropriate validation criteria', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      const criteria = result.document.content.validationCriteria;
      expect(criteria.length).toBeGreaterThan(0);

      // Check for required criteria
      const criteriaNamesSet = new Set(criteria.map(c => c.criterion));
      expect(criteriaNamesSet.has('Output Quality')).toBe(true);
      expect(criteriaNamesSet.has('Completeness')).toBe(true);
      expect(criteriaNamesSet.has('Consistency')).toBe(true);
      expect(criteriaNamesSet.has('Coherence')).toBe(true);
    });

    it('should set appropriate weights for criteria', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      const criteria = result.document.content.validationCriteria;
      const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

      // Weights should sum to 1.0
      expect(totalWeight).toBeCloseTo(1.0, 2);
    });
  });

  describe('metadata generation', () => {
    it('should generate comprehensive metadata', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      const metadata = result.document.metadata;
      expect(metadata.promptType).toBeDefined();
      expect(metadata.contextDepth).toBeDefined();
      expect(metadata.complexity).toBeDefined();
      expect(metadata.priority).toBeDefined();
      expect(metadata.tags.length).toBeGreaterThan(0);
    });

    it('should generate appropriate tags', async () => {
      const result = await generator.generatePRP('Test content', defaultContext);

      const tags = result.document.metadata.tags;
      expect(tags).toContain('phase-1');
      expect(tags).toContain('project-web-application');
    });
  });
});
