/**
 * Tests for Conditional Branching System
 * Phase 3: Advanced Context Features - Tier 2.1
 */

import {
  ConditionalBranchingEngine,
  ConditionalBranch,
  BranchCondition,
  BranchActivationResult,
  BranchingConfig,
  ReasoningStepTemplate
} from './conditional-branching';

import { ReasoningContext } from './reasoning-chain';

describe('ConditionalBranchingEngine', () => {
  let engine: ConditionalBranchingEngine;
  let defaultConfig: BranchingConfig;
  let testContext: ReasoningContext;

  beforeEach(() => {
    defaultConfig = {
      maxActiveBranches: 3,
      enableBranchPriority: true,
      enableBranchConflictResolution: true,
      enableDynamicBranchGeneration: true,
      branchEvaluationInterval: 1
    };

    engine = new ConditionalBranchingEngine(defaultConfig);

    testContext = {
      complexity: 0.6,
      domain: 'engineering',
      constraints: ['time limit', 'budget constraint'],
      previousSteps: [],
      metadata: { quality: 0.8, resources: ['cpu', 'memory'] }
    };
  });

  describe('branch registration', () => {
    it('should register new branches', () => {
      const branch: ConditionalBranch = {
        id: 'test-branch',
        name: 'Test Branch',
        description: 'Test branch for unit testing',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.5
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: ['test-step'],
        stepTemplates: [
          {
            id: 'test-step',
            description: 'Test step template',
            expectedOutput: 'Test output',
            validationRules: ['test-validation'],
            dependencies: [],
            estimatedComplexity: 0.3,
            resourceRequirements: ['test-resource']
          }
        ],
        metadata: { type: 'test' }
      };

      engine.registerBranch(branch);

      const branches = (engine as any).branches as Map<string, ConditionalBranch>;
      expect(branches.has('test-branch')).toBe(true);
      expect(branches.get('test-branch')?.name).toBe('Test Branch');
    });

    it('should remove branches', () => {
      const branch: ConditionalBranch = {
        id: 'remove-test',
        name: 'Remove Test',
        description: 'Branch to be removed',
        conditions: [],
        conditionLogic: 'and',
        priority: 1,
        isActive: true,
        nextSteps: [],
        stepTemplates: [],
        metadata: {}
      };

      engine.registerBranch(branch);
      expect(engine.removeBranch('remove-test')).toBe(true);
      expect(engine.removeBranch('non-existent')).toBe(false);
    });
  });

  describe('condition evaluation', () => {
    it('should evaluate complexity conditions correctly', async () => {
      const complexityBranch: ConditionalBranch = {
        id: 'complexity-branch',
        name: 'Complexity Branch',
        description: 'Branch for high complexity',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.5
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: ['complexity-step'],
        stepTemplates: [
          {
            id: 'complexity-step',
            description: 'Handle complexity',
            expectedOutput: 'Complexity analysis',
            validationRules: ['complexity-validation'],
            dependencies: [],
            estimatedComplexity: 0.4,
            resourceRequirements: ['analysis-time']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(complexityBranch);

      const results = await engine.evaluateBranches(testContext);
      expect(results.length).toBeGreaterThan(0);

      const complexityResult = results.find(r => r.branchId === 'complexity-branch');
      expect(complexityResult?.activated).toBe(true);
    });

    it('should evaluate domain conditions correctly', async () => {
      const domainBranch: ConditionalBranch = {
        id: 'domain-branch',
        name: 'Domain Branch',
        description: 'Branch for specific domain',
        conditions: [
          {
            type: 'domain',
            operator: 'eq',
            value: 'engineering'
          }
        ],
        conditionLogic: 'and',
        priority: 3,
        isActive: true,
        nextSteps: ['domain-step'],
        stepTemplates: [
          {
            id: 'domain-step',
            description: 'Apply domain-specific logic',
            expectedOutput: 'Domain analysis',
            validationRules: ['domain-validation'],
            dependencies: [],
            estimatedComplexity: 0.5,
            resourceRequirements: ['domain-expertise']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(domainBranch);

      const results = await engine.evaluateBranches(testContext);
      const domainResult = results.find(r => r.branchId === 'domain-branch');
      expect(domainResult?.activated).toBe(true);
    });

    it('should evaluate progress conditions correctly', async () => {
      // Add some previous steps
      testContext.previousSteps = new Array(5).fill({
        id: 'prev-step',
        order: 0,
        description: 'Previous step',
        expectedOutput: 'Previous output',
        dependencies: [],
        validationRules: []
      });

      const progressBranch: ConditionalBranch = {
        id: 'progress-branch',
        name: 'Progress Branch',
        description: 'Branch for progress milestone',
        conditions: [
          {
            type: 'progress',
            operator: 'gt',
            value: 3
          }
        ],
        conditionLogic: 'and',
        priority: 4,
        isActive: true,
        nextSteps: ['progress-step'],
        stepTemplates: [
          {
            id: 'progress-step',
            description: 'Handle progress milestone',
            expectedOutput: 'Progress analysis',
            validationRules: ['progress-validation'],
            dependencies: [],
            estimatedComplexity: 0.3,
            resourceRequirements: ['review-time']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(progressBranch);

      const results = await engine.evaluateBranches(testContext);
      const progressResult = results.find(r => r.branchId === 'progress-branch');
      expect(progressResult?.activated).toBe(true);
    });

    it('should evaluate custom conditions correctly', async () => {
      const customBranch: ConditionalBranch = {
        id: 'custom-branch',
        name: 'Custom Branch',
        description: 'Branch with custom evaluator',
        conditions: [
          {
            type: 'custom',
            operator: 'custom',
            value: null,
            customEvaluator: (context) => context.complexity > 0.5 && context.domain === 'engineering'
          }
        ],
        conditionLogic: 'and',
        priority: 6,
        isActive: true,
        nextSteps: ['custom-step'],
        stepTemplates: [
          {
            id: 'custom-step',
            description: 'Custom logic step',
            expectedOutput: 'Custom analysis',
            validationRules: ['custom-validation'],
            dependencies: [],
            estimatedComplexity: 0.4,
            resourceRequirements: ['custom-expertise']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(customBranch);

      const results = await engine.evaluateBranches(testContext);
      const customResult = results.find(r => r.branchId === 'custom-branch');
      expect(customResult?.activated).toBe(true);
    });
  });

  describe('condition logic', () => {
    it('should handle AND logic correctly', async () => {
      const andBranch: ConditionalBranch = {
        id: 'and-branch',
        name: 'AND Branch',
        description: 'Branch with AND logic',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.5
          },
          {
            type: 'domain',
            operator: 'eq',
            value: 'engineering'
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: ['and-step'],
        stepTemplates: [
          {
            id: 'and-step',
            description: 'AND logic step',
            expectedOutput: 'AND analysis',
            validationRules: ['and-validation'],
            dependencies: [],
            estimatedComplexity: 0.5,
            resourceRequirements: ['combined-expertise']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(andBranch);

      const results = await engine.evaluateBranches(testContext);
      const andResult = results.find(r => r.branchId === 'and-branch');
      expect(andResult?.activated).toBe(true);
    });

    it('should handle OR logic correctly', async () => {
      const orBranch: ConditionalBranch = {
        id: 'or-branch',
        name: 'OR Branch',
        description: 'Branch with OR logic',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.9 // This should be false
          },
          {
            type: 'domain',
            operator: 'eq',
            value: 'engineering' // This should be true
          }
        ],
        conditionLogic: 'or',
        priority: 5,
        isActive: true,
        nextSteps: ['or-step'],
        stepTemplates: [
          {
            id: 'or-step',
            description: 'OR logic step',
            expectedOutput: 'OR analysis',
            validationRules: ['or-validation'],
            dependencies: [],
            estimatedComplexity: 0.5,
            resourceRequirements: ['flexible-expertise']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(orBranch);

      const results = await engine.evaluateBranches(testContext);
      const orResult = results.find(r => r.branchId === 'or-branch');
      expect(orResult?.activated).toBe(true);
    });

    it('should handle NOT logic correctly', async () => {
      const notBranch: ConditionalBranch = {
        id: 'not-branch',
        name: 'NOT Branch',
        description: 'Branch with NOT logic',
        conditions: [
          {
            type: 'domain',
            operator: 'eq',
            value: 'mathematics' // This should be false
          }
        ],
        conditionLogic: 'not',
        priority: 5,
        isActive: true,
        nextSteps: ['not-step'],
        stepTemplates: [
          {
            id: 'not-step',
            description: 'NOT logic step',
            expectedOutput: 'NOT analysis',
            validationRules: ['not-validation'],
            dependencies: [],
            estimatedComplexity: 0.5,
            resourceRequirements: ['alternative-expertise']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(notBranch);

      const results = await engine.evaluateBranches(testContext);
      const notResult = results.find(r => r.branchId === 'not-branch');
      expect(notResult?.activated).toBe(true);
    });
  });

  describe('comparison operators', () => {
    it('should handle all comparison operators', async () => {
      const operators = ['eq', 'ne', 'gt', 'lt', 'gte', 'lte'];

      for (const operator of operators) {
        const evaluateCondition = (engine as any).evaluateCondition.bind(engine);

        const condition: BranchCondition = {
          type: 'complexity',
          operator: operator as any,
          value: 0.5
        };

        const result = evaluateCondition(condition, testContext);
        expect(typeof result).toBe('boolean');
      }
    });

    it('should handle contains operator', async () => {
      const evaluateCondition = (engine as any).evaluateCondition.bind(engine);

      const condition: BranchCondition = {
        type: 'resource',
        operator: 'contains',
        value: 'cpu'
      };

      const result = evaluateCondition(condition, testContext);
      expect(result).toBe(true);
    });

    it('should handle matches operator', async () => {
      const evaluateCondition = (engine as any).evaluateCondition.bind(engine);

      const condition: BranchCondition = {
        type: 'domain',
        operator: 'matches',
        value: 'eng.*'
      };

      const result = evaluateCondition(condition, testContext);
      expect(result).toBe(true);
    });
  });

  describe('step generation', () => {
    it('should generate steps from templates', async () => {
      const templates: ReasoningStepTemplate[] = [
        {
          id: 'template-1',
          description: 'Template step for {domain}',
          expectedOutput: 'Analysis for {domain} with complexity {complexity}',
          validationRules: ['template-validation'],
          dependencies: [],
          estimatedComplexity: 0.4,
          resourceRequirements: ['domain-knowledge']
        },
        {
          id: 'template-2',
          description: 'Follow-up step with {stepCount} previous steps',
          expectedOutput: 'Follow-up analysis',
          validationRules: ['follow-up-validation'],
          dependencies: ['template-1'],
          estimatedComplexity: 0.3,
          resourceRequirements: ['analysis-time']
        }
      ];

      const generateSteps = (engine as any).generateStepsFromTemplates.bind(engine);
      const steps = await generateSteps(templates, testContext, 'test-branch');

      expect(steps).toHaveLength(2);
      expect(steps[0].description).toContain('engineering');
      expect(steps[0].expectedOutput).toContain('0.6');
      expect(steps[1].description).toContain('0 previous steps');
    });

    it('should interpolate template variables correctly', async () => {
      const interpolateTemplate = (engine as any).interpolateTemplate.bind(engine);

      const template = 'Processing {domain} with complexity {complexity} and {stepCount} steps';
      const result = interpolateTemplate(template, testContext);

      expect(result).toContain('engineering');
      expect(result).toContain('0.6');
      expect(result).toContain('0 steps');
    });
  });

  describe('branch priority and conflict resolution', () => {
    it('should prioritize branches correctly', async () => {
      const lowPriorityBranch: ConditionalBranch = {
        id: 'low-priority',
        name: 'Low Priority',
        description: 'Low priority branch',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.1
          }
        ],
        conditionLogic: 'and',
        priority: 1,
        isActive: true,
        nextSteps: ['low-step'],
        stepTemplates: [
          {
            id: 'low-step',
            description: 'Low priority step',
            expectedOutput: 'Low priority output',
            validationRules: ['low-validation'],
            dependencies: [],
            estimatedComplexity: 0.2,
            resourceRequirements: ['minimal-resources']
          }
        ],
        metadata: {}
      };

      const highPriorityBranch: ConditionalBranch = {
        id: 'high-priority',
        name: 'High Priority',
        description: 'High priority branch',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.1
          }
        ],
        conditionLogic: 'and',
        priority: 10,
        isActive: true,
        nextSteps: ['high-step'],
        stepTemplates: [
          {
            id: 'high-step',
            description: 'High priority step',
            expectedOutput: 'High priority output',
            validationRules: ['high-validation'],
            dependencies: [],
            estimatedComplexity: 0.8,
            resourceRequirements: ['premium-resources']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(lowPriorityBranch);
      engine.registerBranch(highPriorityBranch);

      const results = await engine.evaluateBranches(testContext);

      // High priority branch should be evaluated first
      const highResult = results.find(r => r.branchId === 'high-priority');
      const lowResult = results.find(r => r.branchId === 'low-priority');

      expect(highResult?.activated).toBe(true);
      expect(lowResult?.activated).toBe(false); // Deactivated due to conflict resolution
    });

    it('should handle max active branches limit', async () => {
      const limitedEngine = new ConditionalBranchingEngine({
        ...defaultConfig,
        maxActiveBranches: 2
      });

      // Create 3 branches that should all activate
      for (let i = 1; i <= 3; i++) {
        const branch: ConditionalBranch = {
          id: `branch-${i}`,
          name: `Branch ${i}`,
          description: `Branch ${i}`,
          conditions: [
            {
              type: 'complexity',
              operator: 'gt',
              value: 0.1
            }
          ],
          conditionLogic: 'and',
          priority: i,
          isActive: true,
          nextSteps: [`step-${i}`],
          stepTemplates: [
            {
              id: `step-${i}`,
              description: `Step ${i}`,
              expectedOutput: `Output ${i}`,
              validationRules: ['validation'],
              dependencies: [],
              estimatedComplexity: 0.3,
              resourceRequirements: ['resources']
            }
          ],
          metadata: {}
        };

        limitedEngine.registerBranch(branch);
      }

      const results = await limitedEngine.evaluateBranches(testContext);
      const activatedCount = results.filter(r => r.activated).length;

      expect(activatedCount).toBeLessThanOrEqual(2);
    });
  });

  describe('dynamic branch generation', () => {
    it('should generate dynamic branches for high complexity', async () => {
      const highComplexityContext = {
        ...testContext,
        complexity: 0.85
      };

      const dynamicBranches = await engine.generateDynamicBranches(highComplexityContext);

      expect(dynamicBranches.length).toBeGreaterThan(0);
      const complexityBranch = dynamicBranches.find(b => b.id.includes('high_complexity'));
      expect(complexityBranch).toBeDefined();
      expect(complexityBranch?.metadata.generated).toBe(true);
    });

    it('should generate dynamic branches for specific domains', async () => {
      const specificDomainContext = {
        ...testContext,
        domain: 'machine-learning'
      };

      const dynamicBranches = await engine.generateDynamicBranches(specificDomainContext);

      expect(dynamicBranches.length).toBeGreaterThan(0);
      const domainBranch = dynamicBranches.find(b => b.id.includes('machine-learning'));
      expect(domainBranch).toBeDefined();
      expect(domainBranch?.metadata.domain).toBe('machine-learning');
    });

    it('should not generate dynamic branches when disabled', async () => {
      const disabledEngine = new ConditionalBranchingEngine({
        ...defaultConfig,
        enableDynamicBranchGeneration: false
      });

      const dynamicBranches = await disabledEngine.generateDynamicBranches(testContext);
      expect(dynamicBranches).toHaveLength(0);
    });
  });

  describe('evaluation intervals', () => {
    it('should respect evaluation intervals', async () => {
      const intervalEngine = new ConditionalBranchingEngine({
        ...defaultConfig,
        branchEvaluationInterval: 3
      });

      const branch: ConditionalBranch = {
        id: 'interval-branch',
        name: 'Interval Branch',
        description: 'Branch for interval testing',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.1
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: ['interval-step'],
        stepTemplates: [
          {
            id: 'interval-step',
            description: 'Interval step',
            expectedOutput: 'Interval output',
            validationRules: ['interval-validation'],
            dependencies: [],
            estimatedComplexity: 0.3,
            resourceRequirements: ['interval-resources']
          }
        ],
        metadata: {}
      };

      intervalEngine.registerBranch(branch);

      // First evaluation (count = 1) - should skip
      let results = await intervalEngine.evaluateBranches(testContext);
      expect(results).toHaveLength(0);

      // Second evaluation (count = 2) - should skip
      results = await intervalEngine.evaluateBranches(testContext);
      expect(results).toHaveLength(0);

      // Third evaluation (count = 3) - should evaluate
      results = await intervalEngine.evaluateBranches(testContext);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('branch statistics', () => {
    it('should provide accurate branch statistics', async () => {
      const testBranch: ConditionalBranch = {
        id: 'stats-branch',
        name: 'Stats Branch',
        description: 'Branch for statistics testing',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.1
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: ['stats-step'],
        stepTemplates: [
          {
            id: 'stats-step',
            description: 'Statistics step',
            expectedOutput: 'Statistics output',
            validationRules: ['stats-validation'],
            dependencies: [],
            estimatedComplexity: 0.3,
            resourceRequirements: ['stats-resources']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(testBranch);

      // Trigger some evaluations
      await engine.evaluateBranches(testContext);
      await engine.evaluateBranches(testContext);

      const stats = engine.getBranchStatistics();

      expect(stats.totalBranches).toBeGreaterThan(0);
      expect(stats.branchActivationHistory).toBeGreaterThan(0);
      expect(stats.averageActivationRate).toBeGreaterThan(0);
      expect(stats.topBranches).toBeInstanceOf(Array);
    });

    it('should clear branch history', () => {
      engine.clearHistory();

      const stats = engine.getBranchStatistics();
      expect(stats.branchActivationHistory).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should handle invalid branch conditions gracefully', async () => {
      const invalidBranch: ConditionalBranch = {
        id: 'invalid-branch',
        name: 'Invalid Branch',
        description: 'Branch with invalid conditions',
        conditions: [
          {
            type: 'custom' as any,
            operator: 'invalid' as any,
            value: null
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: ['invalid-step'],
        stepTemplates: [
          {
            id: 'invalid-step',
            description: 'Invalid step',
            expectedOutput: 'Invalid output',
            validationRules: ['invalid-validation'],
            dependencies: [],
            estimatedComplexity: 0.3,
            resourceRequirements: ['invalid-resources']
          }
        ],
        metadata: {}
      };

      engine.registerBranch(invalidBranch);

      const results = await engine.evaluateBranches(testContext);
      const invalidResult = results.find(r => r.branchId === 'invalid-branch');
      expect(invalidResult?.activated).toBe(false);
    });

    it('should handle empty step templates', async () => {
      const emptyBranch: ConditionalBranch = {
        id: 'empty-branch',
        name: 'Empty Branch',
        description: 'Branch with empty templates',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.1
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: [],
        stepTemplates: [],
        metadata: {}
      };

      engine.registerBranch(emptyBranch);

      const results = await engine.evaluateBranches(testContext);
      const emptyResult = results.find(r => r.branchId === 'empty-branch');
      expect(emptyResult?.activated).toBe(true);
      expect(emptyResult?.generatedSteps).toHaveLength(0);
    });
  });

  describe('default branches', () => {
    it('should initialize with default branches', () => {
      const branches = (engine as any).branches as Map<string, ConditionalBranch>;

      expect(branches.has('high-complexity')).toBe(true);
      expect(branches.has('validation-checkpoint')).toBe(true);
      expect(branches.has('domain-specialization')).toBe(true);
    });

    it('should activate default branches correctly', async () => {
      const highComplexityContext = {
        ...testContext,
        complexity: 0.8
      };

      const results = await engine.evaluateBranches(highComplexityContext);

      const complexityResult = results.find(r => r.branchId === 'high-complexity');
      expect(complexityResult?.activated).toBe(true);
      expect(complexityResult?.generatedSteps.length).toBeGreaterThan(0);
    });
  });
});
