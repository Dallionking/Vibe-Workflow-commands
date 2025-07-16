/**
 * Tests for PRP System Interfaces
 * Validates interface structure and type safety
 */

import {
  PRPDocument,
  PRPContent,
  ChainOfThoughtStructure,
  FewShotExample,
  ValidationCriteria,
  PRPMetadata,
  PRPValidation,
  PRPGeneratorConfig,
  ReasoningStep,
  EmergentInsight,
  OutputFormat,
  TokenUsage
} from './interfaces';

describe('PRP System Interfaces', () => {
  describe('PRPDocument Interface', () => {
    it('should create a valid PRP document', () => {
      const mockDocument: PRPDocument = {
        id: 'test-doc-1',
        name: 'Test PRP Document',
        version: '1.0.0',
        source: {
          originalDocument: 'test content',
          phaseNumber: 1,
          projectContext: 'test project',
          lastModified: new Date(),
          dependencies: [],
          relatedPhases: []
        },
        metadata: {
          promptType: 'phase',
          contextDepth: 'deep',
          reasoningPattern: 'chain-of-thought',
          complexity: 'moderate',
          tokenBudget: 4000,
          estimatedTokens: 3000,
          priority: 'high',
          tags: ['test', 'phase-1']
        },
        content: {
          systemPrompt: 'You are an AI assistant',
          contextPrompt: 'Context information',
          instructionPrompt: 'Please implement',
          chainOfThought: {
            enabled: true,
            reasoningSteps: [],
            thoughtProcess: {
              initialAnalysis: 'Initial thoughts',
              problemDecomposition: ['step1', 'step2'],
              solutionApproach: 'Approach',
              alternativeConsiderations: [],
              finalSynthesis: 'Final thoughts'
            },
            validationChecks: [],
            emergentInsights: []
          },
          fewShotExamples: [],
          validationCriteria: [],
          outputFormat: {
            format: 'markdown',
            structure: {
              sections: [],
              ordering: [],
              formatting: {
                headerStyle: '#',
                listStyle: '-',
                codeBlockStyle: '```',
                linkFormat: '[text](url)',
                emphasisStyle: '*'
              }
            },
            examples: []
          },
          constraintsAndLimitations: []
        },
        validation: {
          isValid: true,
          validationScore: 0.85,
          issues: [],
          recommendations: [],
          qualityMetrics: {
            clarity: 0.9,
            completeness: 0.8,
            consistency: 0.85,
            coherence: 0.88,
            effectiveness: 0.82,
            efficiency: 0.86,
            maintainability: 0.84
          }
        },
        performance: {
          generationTime: 1000,
          tokenUsage: {
            inputTokens: 1000,
            outputTokens: 2000,
            totalTokens: 3000,
            costEstimate: 0.03,
            efficiency: 0.85,
            budgetUtilization: 0.75
          },
          successRate: 0.95,
          averageResponseTime: 1500,
          qualityScore: 0.88,
          userSatisfaction: 0.9,
          optimizationSuggestions: []
        }
      };

      expect(mockDocument.id).toBe('test-doc-1');
      expect(mockDocument.metadata.promptType).toBe('phase');
      expect(mockDocument.content.chainOfThought.enabled).toBe(true);
      expect(mockDocument.validation.isValid).toBe(true);
    });
  });

  describe('ChainOfThoughtStructure Interface', () => {
    it('should create valid reasoning steps', () => {
      const reasoningStep: ReasoningStep = {
        id: 'step-1',
        order: 1,
        description: 'Analyze requirements',
        expectedOutput: 'Requirements analysis',
        dependencies: [],
        validationRules: ['completeness', 'accuracy']
      };

      expect(reasoningStep.order).toBe(1);
      expect(reasoningStep.validationRules).toHaveLength(2);
    });

    it('should create emergent insights', () => {
      const insight: EmergentInsight = {
        insight: 'Pattern detected',
        confidence: 0.8,
        relevance: 0.9,
        implications: ['optimization possible'],
        actionItems: ['refactor code']
      };

      expect(insight.confidence).toBeGreaterThan(0);
      expect(insight.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('FewShotExample Interface', () => {
    it('should create valid few-shot examples', () => {
      const example: FewShotExample = {
        id: 'example-1',
        scenario: 'Implementation scenario',
        input: 'Input code',
        reasoning: 'Step by step reasoning',
        output: 'Output code',
        quality: 'excellent',
        relevance: 0.95,
        complexity: 0.7
      };

      expect(example.quality).toBe('excellent');
      expect(example.relevance).toBeGreaterThan(0.9);
    });

    it('should validate quality levels', () => {
      const qualityLevels: Array<FewShotExample['quality']> = [
        'excellent', 'good', 'acceptable', 'poor'
      ];

      qualityLevels.forEach(quality => {
        const example: FewShotExample = {
          id: 'test',
          scenario: 'test',
          input: 'test',
          reasoning: 'test',
          output: 'test',
          quality,
          relevance: 0.5,
          complexity: 0.5
        };
        expect(example.quality).toBeDefined();
      });
    });
  });

  describe('ValidationCriteria Interface', () => {
    it('should create validation criteria with proper weights', () => {
      const criteria: ValidationCriteria[] = [
        {
          criterion: 'Completeness',
          description: 'All sections complete',
          validationMethod: 'automated',
          threshold: 0.95,
          weight: 0.3,
          criticalityLevel: 'required'
        },
        {
          criterion: 'Quality',
          description: 'Code quality standards',
          validationMethod: 'hybrid',
          threshold: 0.8,
          weight: 0.3,
          criticalityLevel: 'critical'
        },
        {
          criterion: 'Performance',
          description: 'Performance requirements',
          validationMethod: 'manual',
          threshold: 0.7,
          weight: 0.4,
          criticalityLevel: 'recommended'
        }
      ];

      const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
      expect(totalWeight).toBe(1.0);

      criteria.forEach(criterion => {
        expect(criterion.threshold).toBeGreaterThan(0);
        expect(criterion.threshold).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('PRPGeneratorConfig Interface', () => {
    it('should create valid generator configuration', () => {
      const config: PRPGeneratorConfig = {
        enableChainOfThought: true,
        enableFewShotLearning: true,
        enableSelfConsistency: false,
        maxTokenBudget: 4000,
        qualityThreshold: 0.8,
        validationLevel: 'strict',
        optimizationMode: 'balanced',
        cachingEnabled: true,
        parallelProcessing: false
      };

      expect(config.maxTokenBudget).toBeGreaterThan(0);
      expect(config.qualityThreshold).toBeGreaterThan(0);
      expect(config.qualityThreshold).toBeLessThanOrEqual(1);
    });
  });

  describe('OutputFormat Interface', () => {
    it('should support multiple output formats', () => {
      const formats: Array<OutputFormat['format']> = [
        'markdown', 'json', 'yaml', 'structured-text'
      ];

      formats.forEach(format => {
        const outputFormat: OutputFormat = {
          format,
          structure: {
            sections: [],
            ordering: [],
            formatting: {
              headerStyle: '#',
              listStyle: '-',
              codeBlockStyle: '```',
              linkFormat: '[text](url)',
              emphasisStyle: '*'
            }
          },
          examples: []
        };
        expect(outputFormat.format).toBe(format);
      });
    });
  });

  describe('TokenUsage Interface', () => {
    it('should track token usage accurately', () => {
      const tokenUsage: TokenUsage = {
        inputTokens: 1000,
        outputTokens: 2000,
        totalTokens: 3000,
        costEstimate: 0.03,
        efficiency: 0.85,
        budgetUtilization: 0.75
      };

      expect(tokenUsage.totalTokens).toBe(
        tokenUsage.inputTokens + tokenUsage.outputTokens
      );
      expect(tokenUsage.efficiency).toBeGreaterThan(0);
      expect(tokenUsage.efficiency).toBeLessThanOrEqual(1);
      expect(tokenUsage.budgetUtilization).toBeGreaterThan(0);
      expect(tokenUsage.budgetUtilization).toBeLessThanOrEqual(1);
    });
  });

  describe('QualityMetrics Interface', () => {
    it('should validate quality metric ranges', () => {
      const metrics = {
        clarity: 0.9,
        completeness: 0.8,
        consistency: 0.85,
        coherence: 0.88,
        effectiveness: 0.82,
        efficiency: 0.86,
        maintainability: 0.84
      };

      Object.values(metrics).forEach(metric => {
        expect(metric).toBeGreaterThanOrEqual(0);
        expect(metric).toBeLessThanOrEqual(1);
      });

      const average = Object.values(metrics).reduce((sum, m) => sum + m, 0) /
                          Object.values(metrics).length;
      expect(average).toBeGreaterThan(0.8);
    });
  });
});
