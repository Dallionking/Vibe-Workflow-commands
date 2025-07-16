/**
 * Tests for Self-Reflection System
 * Phase 3: Advanced Context Features - Tier 2.1
 */

import {
  SelfReflectionEngine,
  SelfReflectionConfig,
  ReflectionType,
  ReflectionCriteria,
  ReflectionScore,
  ReflectionInsight,
  ReflectionSession
} from './self-reflection';

import { ReasoningStep } from '../interfaces';
import { ReasoningContext } from './reasoning-chain';

describe('SelfReflectionEngine', () => {
  let engine: SelfReflectionEngine;
  let defaultConfig: SelfReflectionConfig;
  let testContext: ReasoningContext;
  let testSteps: ReasoningStep[];

  beforeEach(() => {
    defaultConfig = {
      reflectionInterval: 3,
      enableContinuousReflection: true,
      enableMetacognition: true,
      qualityThreshold: 0.7,
      confidenceThreshold: 0.8,
      maxReflectionHistory: 10,
      enableLearningFromReflection: true
    };

    engine = new SelfReflectionEngine(defaultConfig);

    testContext = {
      complexity: 0.6,
      domain: 'engineering',
      constraints: ['time limit', 'budget constraint'],
      previousSteps: [],
      metadata: { quality: 0.8, resources: ['cpu', 'memory'] }
    };

    testSteps = [
      {
        id: 'step-1',
        order: 1,
        description: 'First reasoning step with detailed analysis',
        expectedOutput: 'Comprehensive analysis results',
        dependencies: [],
        validationRules: ['consistency', 'accuracy']
      },
      {
        id: 'step-2',
        order: 2,
        description: 'Second reasoning step building on first',
        expectedOutput: 'Refined analysis with conclusions',
        dependencies: ['step-1'],
        validationRules: ['completeness', 'logical']
      },
      {
        id: 'step-3',
        order: 3,
        description: 'Third reasoning step for synthesis',
        expectedOutput: 'Final synthesis and recommendations',
        dependencies: ['step-1', 'step-2'],
        validationRules: ['consistency', 'accuracy', 'completeness']
      }
    ];
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      expect(engine).toBeDefined();
      expect((engine as any).config).toEqual(defaultConfig);
    });

    it('should initialize reflection criteria', () => {
      const criteria = (engine as any).criteria as Map<ReflectionType, ReflectionCriteria>;
      expect(criteria.size).toBeGreaterThan(0);
      expect(criteria.has('quality')).toBe(true);
      expect(criteria.has('consistency')).toBe(true);
      expect(criteria.has('completeness')).toBe(true);
      expect(criteria.has('efficiency')).toBe(true);
      expect(criteria.has('accuracy')).toBe(true);
      expect(criteria.has('innovation')).toBe(true);
    });

    it('should initialize empty history and learning data', () => {
      const history = (engine as any).reflectionHistory as ReflectionSession[];
      const patterns = (engine as any).learningPatterns as Map<string, number>;

      expect(history).toHaveLength(0);
      expect(patterns.size).toBe(0);
    });
  });

  describe('reflection criteria evaluation', () => {
    it('should evaluate quality criteria correctly', async () => {
      const qualityEvaluator = (engine as any).evaluateQuality.bind(engine);
      const result = await qualityEvaluator(testSteps, testContext);

      expect(result.score).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.details).toContain('quality assessment');
      expect(result.evidence).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
    });

    it('should evaluate consistency criteria correctly', async () => {
      const consistencyEvaluator = (engine as any).evaluateConsistency.bind(engine);
      const result = await consistencyEvaluator(testSteps, testContext);

      expect(result.score).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.details).toContain('consistency assessment');
      expect(result.evidence).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
    });

    it('should evaluate completeness criteria correctly', async () => {
      const completenessEvaluator = (engine as any).evaluateCompleteness.bind(engine);
      const result = await completenessEvaluator(testSteps, testContext);

      expect(result.score).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.details).toContain('completeness assessment');
      expect(result.evidence).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
    });

    it('should evaluate efficiency criteria correctly', async () => {
      const efficiencyEvaluator = (engine as any).evaluateEfficiency.bind(engine);
      const result = await efficiencyEvaluator(testSteps, testContext);

      expect(result.score).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.details).toContain('efficiency assessment');
      expect(result.evidence).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
    });

    it('should evaluate accuracy criteria correctly', async () => {
      const accuracyEvaluator = (engine as any).evaluateAccuracy.bind(engine);
      const result = await accuracyEvaluator(testSteps, testContext);

      expect(result.score).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.details).toContain('accuracy assessment');
      expect(result.evidence).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
    });

    it('should evaluate innovation criteria correctly', async () => {
      const innovationEvaluator = (engine as any).evaluateInnovation.bind(engine);
      const result = await innovationEvaluator(testSteps, testContext);

      expect(result.score).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.details).toContain('innovation assessment');
      expect(result.evidence).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
    });
  });

  describe('reflection performance', () => {
    it('should perform comprehensive reflection', async () => {
      const result = await engine.performReflection(testSteps, testContext);

      expect(result.isValid).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.issues).toBeInstanceOf(Array);
      expect(result.suggestions).toBeInstanceOf(Array);
      expect(result.shouldContinue).toBeDefined();
      expect(result.adjustments).toBeDefined();
    });

    it('should handle high-quality reasoning', async () => {
      const highQualitySteps = testSteps.map(step => ({
        ...step,
        validationRules: ['consistency', 'accuracy', 'completeness', 'logical']
      }));

      const result = await engine.performReflection(highQualitySteps, testContext);

      expect(result.isValid).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.shouldContinue).toBe(true);
    });

    it('should detect low-quality reasoning', async () => {
      const lowQualitySteps = testSteps.map(step => ({
        ...step,
        description: 'Brief',
        validationRules: []
      }));

      const result = await engine.performReflection(lowQualitySteps, testContext);

      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should handle step range specification', async () => {
      const range = { start: 1, end: 2 };
      const result = await engine.performReflection(testSteps, testContext, range);

      expect(result).toBeDefined();
      expect(result.isValid).toBeDefined();
    });
  });

  describe('continuous reflection', () => {
    it('should trigger continuous reflection at intervals', async () => {
      const stepsAtInterval = new Array(3).fill(testSteps[0]);
      const result = await engine.continuousReflection(stepsAtInterval, testContext);

      expect(result).toBeDefined();
      expect(result?.isValid).toBeDefined();
    });

    it('should not trigger continuous reflection between intervals', async () => {
      const stepsNotAtInterval = new Array(2).fill(testSteps[0]);
      const result = await engine.continuousReflection(stepsNotAtInterval, testContext);

      expect(result).toBeNull();
    });

    it('should respect continuous reflection configuration', async () => {
      const disabledConfig = {
        ...defaultConfig,
        enableContinuousReflection: false
      };

      const disabledEngine = new SelfReflectionEngine(disabledConfig);
      const stepsAtInterval = new Array(3).fill(testSteps[0]);
      const result = await disabledEngine.continuousReflection(stepsAtInterval, testContext);

      expect(result).toBeNull();
    });
  });

  describe('metacognitive analysis', () => {
    it('should perform metacognitive analysis when enabled', async () => {
      const result = await engine.metacognitiveAnalysis(testSteps, testContext);

      expect(result.reasoningStrategy).toBeDefined();
      expect(result.cognitiveLoad).toBeGreaterThan(0);
      expect(result.biases).toBeInstanceOf(Array);
      expect(result.optimizations).toBeInstanceOf(Array);
    });

    it('should return default values when metacognition is disabled', async () => {
      const disabledConfig = {
        ...defaultConfig,
        enableMetacognition: false
      };

      const disabledEngine = new SelfReflectionEngine(disabledConfig);
      const result = await disabledEngine.metacognitiveAnalysis(testSteps, testContext);

      expect(result.reasoningStrategy).toBe('standard');
      expect(result.cognitiveLoad).toBe(0.5);
      expect(result.biases).toHaveLength(0);
      expect(result.optimizations).toHaveLength(0);
    });

    it('should identify reasoning strategies correctly', async () => {
      const parallelSteps = testSteps.map(step => ({
        ...step,
        dependencies: []
      }));

      const analyzeStrategy = (engine as any).analyzeReasoningStrategy.bind(engine);
      const strategy = analyzeStrategy(parallelSteps, testContext);

      expect(strategy).toBe('parallel');
    });

    it('should calculate cognitive load correctly', async () => {
      const complexContext = {
        ...testContext,
        complexity: 0.9
      };

      const calculateLoad = (engine as any).calculateCognitiveLoad.bind(engine);
      const cognitiveLoad = calculateLoad(testSteps, complexContext);

      expect(cognitiveLoad).toBeGreaterThan(0.5);
      expect(cognitiveLoad).toBeLessThanOrEqual(1.0);
    });

    it('should identify potential biases', async () => {
      const identifyBiases = (engine as any).identifyBiases.bind(engine);
      const biases = await identifyBiases(testSteps, testContext);

      expect(biases).toBeInstanceOf(Array);
      expect(biases.length).toBeGreaterThan(0);
    });

    it('should suggest optimizations', async () => {
      const longSteps = new Array(10).fill(testSteps[0]);
      const suggestOptimizations = (engine as any).suggestOptimizations.bind(engine);
      const optimizations = await suggestOptimizations(longSteps, testContext);

      expect(optimizations).toBeInstanceOf(Array);
      expect(optimizations.length).toBeGreaterThan(0);
    });
  });

  describe('insight generation', () => {
    it('should generate insights from reflection scores', async () => {
      const scores = new Map<ReflectionType, ReflectionScore>();
      scores.set('quality', {
        score: 0.5,
        confidence: 0.8,
        details: 'Quality below threshold',
        evidence: ['test evidence'],
        suggestions: ['improve quality']
      });

      const generateInsights = (engine as any).generateInsights.bind(engine);
      const insights = await generateInsights(scores, testContext);

      expect(insights).toBeInstanceOf(Array);
      expect(insights.length).toBeGreaterThan(0);

      const weakness = insights.find((insight: ReflectionInsight) => insight.type === 'weakness');
      expect(weakness).toBeDefined();
      expect(weakness?.actionable).toBe(true);
    });

    it('should generate contextual insights', async () => {
      const highComplexityContext = {
        ...testContext,
        complexity: 0.85,
        previousSteps: new Array(10).fill(testSteps[0])
      };

      const generateInsights = (engine as any).generateInsights.bind(engine);
      const insights = await generateInsights(new Map(), highComplexityContext);

      expect(insights).toBeInstanceOf(Array);
      expect(insights.length).toBeGreaterThan(0);

      const opportunity = insights.find((insight: ReflectionInsight) => insight.type === 'opportunity');
      const threat = insights.find((insight: ReflectionInsight) => insight.type === 'threat');

      expect(opportunity).toBeDefined();
      expect(threat).toBeDefined();
    });
  });

  describe('adjustment generation', () => {
    it('should generate appropriate adjustments', async () => {
      const scores = new Map<ReflectionType, ReflectionScore>();
      scores.set('quality', {
        score: 0.5,
        confidence: 0.8,
        details: 'Low quality',
        evidence: [],
        suggestions: []
      });

      const generateAdjustments = (engine as any).generateAdjustments.bind(engine);
      const adjustments = await generateAdjustments(scores, [], testContext);

      expect(adjustments).toBeDefined();
      expect(adjustments.increaseValidation).toBe(true);
      expect(adjustments.additionalReviewSteps).toBeGreaterThan(0);
    });

    it('should handle consistency adjustments', async () => {
      const scores = new Map<ReflectionType, ReflectionScore>();
      scores.set('consistency', {
        score: 0.6,
        confidence: 0.8,
        details: 'Consistency issues',
        evidence: [],
        suggestions: []
      });

      const generateAdjustments = (engine as any).generateAdjustments.bind(engine);
      const adjustments = await generateAdjustments(scores, [], testContext);

      expect(adjustments.enhanceConsistencyChecks).toBe(true);
      expect(adjustments.crossReferenceSteps).toBe(true);
    });

    it('should handle complexity-based adjustments', async () => {
      const highComplexityContext = {
        ...testContext,
        complexity: 0.85
      };

      const generateAdjustments = (engine as any).generateAdjustments.bind(engine);
      const adjustments = await generateAdjustments(new Map(), [], highComplexityContext);

      expect(adjustments.complexityHandling).toBe('enhanced');
      expect(adjustments.decompositionDepth).toBeGreaterThan(0);
    });
  });

  describe('recommendation system', () => {
    it('should recommend continue for good quality', () => {
      const makeRecommendation = (engine as any).makeRecommendation.bind(engine);
      const recommendation = makeRecommendation(0.8, []);

      expect(recommendation).toBe('continue');
    });

    it('should recommend adjust for medium quality', () => {
      const makeRecommendation = (engine as any).makeRecommendation.bind(engine);
      const recommendation = makeRecommendation(0.6, []);

      expect(recommendation).toBe('adjust');
    });

    it('should recommend restart for low quality', () => {
      const makeRecommendation = (engine as any).makeRecommendation.bind(engine);
      const highImpactIssues = [
        { type: 'weakness', impact: 'high', description: 'Major issue 1' },
        { type: 'weakness', impact: 'high', description: 'Major issue 2' },
        { type: 'weakness', impact: 'high', description: 'Major issue 3' }
      ];
      const recommendation = makeRecommendation(0.3, highImpactIssues);

      expect(recommendation).toBe('restart');
    });

    it('should recommend stop for critical issues', () => {
      const makeRecommendation = (engine as any).makeRecommendation.bind(engine);
      const criticalIssues = [
        { type: 'threat', impact: 'critical', description: 'Critical issue' }
      ];
      const recommendation = makeRecommendation(0.8, criticalIssues);

      expect(recommendation).toBe('stop');
    });
  });

  describe('learning from reflection', () => {
    it('should learn from reflection when enabled', async () => {
      const session: ReflectionSession = {
        id: 'test-session',
        timestamp: new Date(),
        stepRange: { start: 0, end: 2 },
        overallScore: 0.85,
        criteriaScores: new Map(),
        insights: [
          {
            type: 'strength',
            description: 'Good quality',
            impact: 'medium',
            actionable: true,
            recommendation: 'Maintain approach'
          }
        ],
        adjustments: {},
        recommendation: 'continue'
      };

      const learnFromReflection = (engine as any).learnFromReflection.bind(engine);
      await learnFromReflection(session);

      const patterns = (engine as any).learningPatterns as Map<string, number>;
      const knowledge = (engine as any).knowledgeBase as Map<string, any>;

      expect(patterns.size).toBeGreaterThan(0);
      expect(knowledge.size).toBeGreaterThan(0);
    });

    it('should update learning patterns correctly', async () => {
      const session: ReflectionSession = {
        id: 'test-session',
        timestamp: new Date(),
        stepRange: { start: 0, end: 2 },
        overallScore: 0.7,
        criteriaScores: new Map(),
        insights: [],
        adjustments: {},
        recommendation: 'adjust'
      };

      const learnFromReflection = (engine as any).learnFromReflection.bind(engine);
      await learnFromReflection(session);

      const patterns = (engine as any).learningPatterns as Map<string, number>;
      const adjustKey = 'adjust_0.7';

      expect(patterns.has(adjustKey)).toBe(true);
      expect(patterns.get(adjustKey)).toBe(1);
    });
  });

  describe('reflection statistics', () => {
    it('should provide accurate reflection statistics', async () => {
      // Perform some reflections to generate history
      await engine.performReflection(testSteps, testContext);
      await engine.performReflection(testSteps, testContext);

      const stats = engine.getReflectionStatistics();

      expect(stats.totalSessions).toBe(2);
      expect(stats.averageScore).toBeGreaterThan(0);
      expect(stats.mostCommonRecommendation).toBeDefined();
      expect(stats.topInsightTypes).toBeInstanceOf(Array);
      expect(stats.learningPatterns).toBeGreaterThan(0);
    });

    it('should handle empty history gracefully', () => {
      const emptyEngine = new SelfReflectionEngine(defaultConfig);
      const stats = emptyEngine.getReflectionStatistics();

      expect(stats.totalSessions).toBe(0);
      expect(stats.averageScore).toBe(0);
      expect(stats.mostCommonRecommendation).toBe('none');
      expect(stats.topInsightTypes).toHaveLength(0);
    });
  });

  describe('history management', () => {
    it('should maintain history size limit', async () => {
      const limitedConfig = {
        ...defaultConfig,
        maxReflectionHistory: 2
      };

      const limitedEngine = new SelfReflectionEngine(limitedConfig);

      // Perform more reflections than the limit
      for (let i = 0; i < 5; i++) {
        await limitedEngine.performReflection(testSteps, testContext);
      }

      const history = (limitedEngine as any).reflectionHistory as ReflectionSession[];
      expect(history.length).toBeLessThanOrEqual(2);
    });

    it('should store reflection sessions with complete data', async () => {
      await engine.performReflection(testSteps, testContext);

      const history = (engine as any).reflectionHistory as ReflectionSession[];
      expect(history.length).toBe(1);

      const session = history[0];
      expect(session.id).toBeDefined();
      expect(session.timestamp).toBeInstanceOf(Date);
      expect(session.stepRange).toBeDefined();
      expect(session.overallScore).toBeGreaterThan(0);
      expect(session.criteriaScores).toBeInstanceOf(Map);
      expect(session.insights).toBeInstanceOf(Array);
      expect(session.adjustments).toBeDefined();
      expect(session.recommendation).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle invalid reflection criteria gracefully', async () => {
      const invalidSteps: ReasoningStep[] = [];
      const result = await engine.performReflection(invalidSteps, testContext);

      expect(result).toBeDefined();
      expect(result.isValid).toBe(false);
    });

    it('should handle missing validation rules', async () => {
      const stepsWithoutValidation = testSteps.map(step => ({
        ...step,
        validationRules: []
      }));

      const result = await engine.performReflection(stepsWithoutValidation, testContext);

      expect(result).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should handle edge cases in insight generation', async () => {
      const extremeContext = {
        ...testContext,
        complexity: 1.0,
        previousSteps: new Array(20).fill(testSteps[0])
      };

      const result = await engine.performReflection(testSteps, extremeContext);

      expect(result).toBeDefined();
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });
});
