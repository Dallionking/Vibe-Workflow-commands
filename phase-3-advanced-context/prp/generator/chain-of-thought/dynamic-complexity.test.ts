/**
 * Tests for Dynamic Complexity Adjustment System
 * Phase 3: Advanced Context Features - Tier 2.1
 */

import {
    DynamicComplexityEngine,
    DynamicComplexityConfig,
    ComplexityLevel,
    ComplexityMetrics,
    ComplexityAdjustment,
    ComplexityImpact,
    ComplexityPattern
} from './dynamic-complexity';

import { ReasoningStep } from '../interfaces';
import { ReasoningContext } from './reasoning-chain';

describe('DynamicComplexityEngine', () => {
    let engine: DynamicComplexityEngine;
    let defaultConfig: DynamicComplexityConfig;
    let testContext: ReasoningContext;
    let testSteps: ReasoningStep[];

    beforeEach(() => {
        defaultConfig = {
            enableRealTimeAdjustment: true,
            enablePredictiveAdjustment: true,
            enableLearningFromHistory: true,
            adjustmentThreshold: 0.1,
            maxComplexityLevel: 'extreme',
            stabilizationPeriod: 3,
            learningRate: 0.1
        };

        engine = new DynamicComplexityEngine(defaultConfig);

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
                description: 'First step with complex analysis',
                expectedOutput: 'Analysis results',
                dependencies: [],
                validationRules: ['consistency', 'accuracy']
            },
            {
                id: 'step-2',
                order: 2,
                description: 'Second step building complexity',
                expectedOutput: 'Complex calculations',
                dependencies: ['step-1'],
                validationRules: ['completeness', 'logical', 'efficiency']
            },
            {
                id: 'step-3',
                order: 3,
                description: 'Third step with multiple dependencies',
                expectedOutput: 'Synthesis results',
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

        it('should initialize complexity patterns', () => {
            const patterns = (engine as any).complexityPatterns as Map<string, ComplexityPattern>;
            expect(patterns.size).toBeGreaterThan(0);
            expect(patterns.has('recursive_problem')).toBe(true);
            expect(patterns.has('multi_constraint')).toBe(true);
            expect(patterns.has('domain_crossing')).toBe(true);
        });

        it('should initialize current complexity metrics', () => {
            const currentComplexity = (engine as any).currentComplexity as ComplexityMetrics;
            expect(currentComplexity.structural).toBeDefined();
            expect(currentComplexity.logical).toBeDefined();
            expect(currentComplexity.domain).toBeDefined();
            expect(currentComplexity.temporal).toBeDefined();
            expect(currentComplexity.cognitive).toBeDefined();
            expect(currentComplexity.overall).toBeDefined();
        });
    });

    describe('complexity analysis', () => {
        it('should analyze complexity across multiple dimensions', async () => {
            const content = 'This is a complex problem requiring multiple steps of analysis and synthesis';
            const metrics = await engine.analyzeComplexity(content, testContext, testSteps);

            expect(metrics.structural).toBeGreaterThan(0);
            expect(metrics.logical).toBeGreaterThan(0);
            expect(metrics.domain).toBeGreaterThan(0);
            expect(metrics.temporal).toBeGreaterThan(0);
            expect(metrics.cognitive).toBeGreaterThan(0);
            expect(metrics.overall).toBeGreaterThan(0);
            expect(metrics.overall).toBeLessThanOrEqual(1.0);
        });

        it('should calculate structural complexity correctly', () => {
            const calculateStructural = (engine as any).calculateStructuralComplexity.bind(engine);
            const longContent = 'word '.repeat(500);
            const manySteps = new Array(15).fill(testSteps[0]);
            
            const complexity = calculateStructural(longContent, manySteps);
            expect(complexity).toBeGreaterThan(0.3);
            expect(complexity).toBeLessThanOrEqual(1.0);
        });

        it('should calculate logical complexity correctly', () => {
            const calculateLogical = (engine as any).calculateLogicalComplexity.bind(engine);
            const logicalContent = 'Therefore, because of this, however we must consider that furthermore';
            
            const complexity = calculateLogical(logicalContent, testSteps);
            expect(complexity).toBeGreaterThan(0.4);
            expect(complexity).toBeLessThanOrEqual(1.0);
        });

        it('should calculate domain complexity correctly', () => {
            const calculateDomain = (engine as any).calculateDomainComplexity.bind(engine);
            
            const mathContext = { ...testContext, domain: 'mathematics' };
            const mathComplexity = calculateDomain(mathContext);
            expect(mathComplexity).toBe(0.7);

            const generalContext = { ...testContext, domain: 'general' };
            const generalComplexity = calculateDomain(generalContext);
            expect(generalComplexity).toBe(0.2);
        });

        it('should calculate temporal complexity correctly', () => {
            const calculateTemporal = (engine as any).calculateTemporalComplexity.bind(engine);
            const timeConstrainedContext = {
                ...testContext,
                constraints: ['urgent deadline', 'time critical', 'immediate action required']
            };
            
            const complexity = calculateTemporal(timeConstrainedContext, testSteps);
            expect(complexity).toBeGreaterThan(0.3);
            expect(complexity).toBeLessThanOrEqual(1.0);
        });

        it('should calculate cognitive complexity correctly', () => {
            const calculateCognitive = (engine as any).calculateCognitiveComplexity.bind(engine);
            const cognitiveContent = 'analyze synthesize evaluate compare contrast integrate optimize';
            const multiConstraintContext = {
                ...testContext,
                constraints: ['constraint1', 'constraint2', 'constraint3', 'constraint4']
            };
            
            const complexity = calculateCognitive(cognitiveContent, multiConstraintContext, testSteps);
            expect(complexity).toBeGreaterThan(0.4);
            expect(complexity).toBeLessThanOrEqual(1.0);
        });

        it('should calculate overall complexity as weighted average', () => {
            const calculateOverall = (engine as any).calculateOverallComplexity.bind(engine);
            const overall = calculateOverall(0.5, 0.6, 0.7, 0.4, 0.8);
            
            expect(overall).toBeGreaterThan(0.5);
            expect(overall).toBeLessThan(0.7);
        });
    });

    describe('complexity level mapping', () => {
        it('should map metrics to complexity levels correctly', () => {
            const metricsToLevel = (engine as any).metricsToLevel.bind(engine);
            
            expect(metricsToLevel(0.1)).toBe('minimal');
            expect(metricsToLevel(0.3)).toBe('low');
            expect(metricsToLevel(0.5)).toBe('moderate');
            expect(metricsToLevel(0.7)).toBe('high');
            expect(metricsToLevel(0.9)).toBe('extreme');
        });

        it('should map levels to metrics correctly', () => {
            const levelToMetrics = (engine as any).levelToMetrics.bind(engine);
            
            expect(levelToMetrics('minimal')).toBe(0.1);
            expect(levelToMetrics('low')).toBe(0.3);
            expect(levelToMetrics('moderate')).toBe(0.5);
            expect(levelToMetrics('high')).toBe(0.7);
            expect(levelToMetrics('extreme')).toBe(0.9);
        });
    });

    describe('complexity adjustment', () => {
        it('should determine when adjustment is needed', async () => {
            const metrics: ComplexityMetrics = {
                structural: 0.8,
                logical: 0.7,
                domain: 0.6,
                temporal: 0.5,
                cognitive: 0.9,
                overall: 0.75
            };

            const shouldAdjust = (engine as any).shouldAdjustComplexity.bind(engine);
            const result = await shouldAdjust(metrics, testContext, testSteps);
            
            expect(typeof result).toBe('boolean');
        });

        it('should create complexity adjustments', async () => {
            const metrics: ComplexityMetrics = {
                structural: 0.8,
                logical: 0.7,
                domain: 0.6,
                temporal: 0.5,
                cognitive: 0.9,
                overall: 0.75
            };

            const adjustment = await engine.adjustComplexity(metrics, testContext, testSteps);
            
            if (adjustment) {
                expect(adjustment.id).toBeDefined();
                expect(adjustment.timestamp).toBeInstanceOf(Date);
                expect(adjustment.fromLevel).toBeDefined();
                expect(adjustment.toLevel).toBeDefined();
                expect(adjustment.reason).toBeDefined();
                expect(['increase', 'decrease', 'stabilize']).toContain(adjustment.adjustmentType);
                expect(adjustment.impact).toBeDefined();
                expect(adjustment.confidence).toBeGreaterThan(0);
            }
        });

        it('should calculate adjustment impact correctly', () => {
            const calculateImpact = (engine as any).calculateAdjustmentImpact.bind(engine);
            const impact = calculateImpact('low', 'high', {} as ComplexityMetrics);
            
            expect(impact.stepCountChange).toBeDefined();
            expect(impact.validationChange).toBeDefined();
            expect(impact.resourceChange).toBeDefined();
            expect(impact.timeChange).toBeDefined();
            expect(impact.qualityChange).toBeDefined();
        });

        it('should apply complexity adjustments', async () => {
            const adjustment: ComplexityAdjustment = {
                id: 'test-adjustment',
                timestamp: new Date(),
                fromLevel: 'moderate',
                toLevel: 'high',
                reason: 'Test adjustment',
                adjustmentType: 'increase',
                impact: {
                    stepCountChange: 2,
                    validationChange: 1,
                    resourceChange: 1,
                    timeChange: 5,
                    qualityChange: 0.1
                },
                confidence: 0.8
            };

            const applyAdjustment = (engine as any).applyComplexityAdjustment.bind(engine);
            await applyAdjustment(adjustment, testContext, testSteps);

            expect(testContext.complexity).toBeCloseTo(0.7, 1);
            expect(testContext.metadata.complexityAdjustment).toEqual(adjustment);
        });
    });

    describe('complexity prediction', () => {
        it('should predict future complexity', async () => {
            const prediction = await engine.predictComplexity(testContext, testSteps, 3);
            
            expect(['minimal', 'low', 'moderate', 'high', 'extreme']).toContain(prediction.predictedLevel);
            expect(prediction.confidence).toBeGreaterThan(0);
            expect(prediction.confidence).toBeLessThanOrEqual(1.0);
            expect(prediction.factors).toBeInstanceOf(Array);
            expect(prediction.recommendations).toBeInstanceOf(Array);
        });

        it('should handle disabled predictive adjustment', async () => {
            const disabledConfig = {
                ...defaultConfig,
                enablePredictiveAdjustment: false
            };

            const disabledEngine = new DynamicComplexityEngine(disabledConfig);
            const prediction = await disabledEngine.predictComplexity(testContext, testSteps);

            expect(prediction.predictedLevel).toBe('moderate');
            expect(prediction.confidence).toBe(0.5);
            expect(prediction.factors).toHaveLength(0);
            expect(prediction.recommendations).toHaveLength(0);
        });

        it('should analyze step complexity trends', () => {
            const analyzeStepTrend = (engine as any).analyzeStepComplexityTrend.bind(engine);
            const increasingSteps = [
                { ...testSteps[0], validationRules: ['basic'] },
                { ...testSteps[1], validationRules: ['basic', 'intermediate'] },
                { ...testSteps[2], validationRules: ['basic', 'intermediate', 'advanced'] }
            ];

            const trend = analyzeStepTrend(increasingSteps);
            expect(trend).toBeGreaterThan(0);
        });

        it('should calculate prediction confidence', () => {
            const calculateConfidence = (engine as any).calculatePredictionConfidence.bind(engine);
            const recentAdjustments: ComplexityAdjustment[] = [
                {
                    id: 'adj1',
                    timestamp: new Date(),
                    fromLevel: 'low',
                    toLevel: 'moderate',
                    reason: 'test',
                    adjustmentType: 'increase',
                    impact: {} as ComplexityImpact,
                    confidence: 0.8
                }
            ];

            const confidence = calculateConfidence(recentAdjustments, ['factor1', 'factor2']);
            expect(confidence).toBeGreaterThan(0);
            expect(confidence).toBeLessThanOrEqual(1.0);
        });
    });

    describe('complexity-adjusted step generation', () => {
        it('should generate minimal complexity steps', async () => {
            const generateMinimal = (engine as any).generateMinimalSteps.bind(engine);
            const minimalSteps = generateMinimal(testSteps, testContext);

            expect(minimalSteps.length).toBeLessThanOrEqual(3);
            expect(minimalSteps[0].validationRules.length).toBeLessThanOrEqual(2);
        });

        it('should generate low complexity steps', async () => {
            const generateLow = (engine as any).generateLowComplexitySteps.bind(engine);
            const lowSteps = generateLow(testSteps, testContext);

            expect(lowSteps.length).toBeLessThanOrEqual(5);
            expect(lowSteps[0].validationRules.length).toBeLessThanOrEqual(3);
        });

        it('should generate moderate complexity steps', async () => {
            const generateModerate = (engine as any).generateModerateComplexitySteps.bind(engine);
            const moderateSteps = generateModerate(testSteps, testContext);

            expect(moderateSteps).toEqual(testSteps);
        });

        it('should generate high complexity steps', async () => {
            const generateHigh = (engine as any).generateHighComplexitySteps.bind(engine);
            const highSteps = generateHigh(testSteps, testContext);

            expect(highSteps.length).toBeGreaterThan(testSteps.length);
            const validationSteps = highSteps.filter((step: any) => step.id.includes('validation'));
            expect(validationSteps.length).toBeGreaterThan(0);
        });

        it('should generate extreme complexity steps', async () => {
            const generateExtreme = (engine as any).generateExtremeComplexitySteps.bind(engine);
            const extremeSteps = generateExtreme(testSteps, testContext);

            expect(extremeSteps.length).toBeGreaterThan(testSteps.length * 2);
            const decomposedSteps = extremeSteps.filter((step: any) => step.id.includes('_analyze'));
            expect(decomposedSteps.length).toBeGreaterThan(0);
        });

        it('should decompose steps correctly', () => {
            const decomposeStep = (engine as any).decomposeStep.bind(engine);
            const decomposed = decomposeStep(testSteps[0]);

            expect(decomposed).toHaveLength(3);
            expect(decomposed[0].id).toContain('_analyze');
            expect(decomposed[1].id).toContain('_plan');
            expect(decomposed[2].id).toContain('_execute');
        });

        it('should generate complexity-adjusted steps for all levels', async () => {
            const levels: ComplexityLevel[] = ['minimal', 'low', 'moderate', 'high', 'extreme'];
            
            for (const level of levels) {
                const adjustedSteps = await engine.generateComplexityAdjustedSteps(
                    testSteps,
                    level,
                    testContext
                );
                
                expect(adjustedSteps).toBeInstanceOf(Array);
                expect(adjustedSteps.length).toBeGreaterThan(0);
            }
        });
    });

    describe('complexity monitoring', () => {
        it('should monitor complexity in real-time', async () => {
            const monitoring = await engine.monitorComplexity(testContext, testSteps);

            expect(['minimal', 'low', 'moderate', 'high', 'extreme']).toContain(monitoring.currentLevel);
            expect(['increasing', 'decreasing', 'stable']).toContain(monitoring.trajectory);
            expect(monitoring.alerts).toBeInstanceOf(Array);
            expect(monitoring.recommendations).toBeInstanceOf(Array);
        });

        it('should generate alerts for extreme complexity', async () => {
            const extremeContext = {
                ...testContext,
                complexity: 0.95
            };

            const currentComplexity = (engine as any).currentComplexity as ComplexityMetrics;
            currentComplexity.overall = 0.95;
            currentComplexity.cognitive = 0.85;

            const monitoring = await engine.monitorComplexity(extremeContext, testSteps);

            expect(monitoring.alerts).toContain('Extreme complexity detected');
            expect(monitoring.alerts).toContain('High cognitive load');
            expect(monitoring.recommendations.length).toBeGreaterThan(0);
        });

        it('should generate alerts for lengthy chains', async () => {
            const longSteps = new Array(15).fill(testSteps[0]);
            const currentComplexity = (engine as any).currentComplexity as ComplexityMetrics;
            currentComplexity.overall = 0.8;

            const history = (engine as any).complexityHistory as ComplexityAdjustment[];
            history.push({
                id: 'test',
                timestamp: new Date(),
                fromLevel: 'moderate',
                toLevel: 'high',
                reason: 'test',
                adjustmentType: 'increase',
                impact: {} as ComplexityImpact,
                confidence: 0.8
            });

            const analyzeTrajectory = (engine as any).analyzeComplexityTrajectory.bind(engine);
            (engine as any).analyzeComplexityTrajectory = jest.fn().mockReturnValue('increasing');

            const monitoring = await engine.monitorComplexity(testContext, longSteps);

            expect(monitoring.alerts).toContain('Lengthy reasoning chain with increasing complexity');
            expect(monitoring.recommendations).toContain('Add intermediate synthesis steps to maintain coherence');
        });
    });

    describe('complexity patterns', () => {
        it('should identify complexity patterns', async () => {
            const identifyPatterns = (engine as any).identifyComplexityPatterns.bind(engine);
            const recursiveSteps = [
                {
                    ...testSteps[0],
                    description: 'Recursive algorithm implementation with iterative refinement'
                }
            ];

            const patterns = await identifyPatterns(testContext, recursiveSteps);
            expect(patterns).toContain('recursive_problem');
        });

        it('should handle multi-constraint patterns', async () => {
            const identifyPatterns = (engine as any).identifyComplexityPatterns.bind(engine);
            const constraintSteps = [
                {
                    ...testSteps[0],
                    description: 'Multiple constraints optimization with competing requirements'
                }
            ];

            const patterns = await identifyPatterns(testContext, constraintSteps);
            expect(patterns).toContain('multi_constraint');
        });

        it('should handle domain-crossing patterns', async () => {
            const identifyPatterns = (engine as any).identifyComplexityPatterns.bind(engine);
            const crossDomainSteps = [
                {
                    ...testSteps[0],
                    description: 'Interdisciplinary approach with cross-domain integration'
                }
            ];

            const patterns = await identifyPatterns(testContext, crossDomainSteps);
            expect(patterns).toContain('domain_crossing');
        });
    });

    describe('complexity trajectory analysis', () => {
        it('should analyze increasing trajectory', () => {
            const history = (engine as any).complexityHistory as ComplexityAdjustment[];
            history.push(
                {
                    id: '1',
                    timestamp: new Date(),
                    fromLevel: 'low',
                    toLevel: 'moderate',
                    reason: 'test',
                    adjustmentType: 'increase',
                    impact: {} as ComplexityImpact,
                    confidence: 0.8
                },
                {
                    id: '2',
                    timestamp: new Date(),
                    fromLevel: 'moderate',
                    toLevel: 'high',
                    reason: 'test',
                    adjustmentType: 'increase',
                    impact: {} as ComplexityImpact,
                    confidence: 0.8
                }
            );

            const analyzeTrajectory = (engine as any).analyzeComplexityTrajectory.bind(engine);
            const trajectory = analyzeTrajectory();

            expect(trajectory).toBe('increasing');
        });

        it('should analyze decreasing trajectory', () => {
            const history = (engine as any).complexityHistory as ComplexityAdjustment[];
            history.push(
                {
                    id: '1',
                    timestamp: new Date(),
                    fromLevel: 'high',
                    toLevel: 'moderate',
                    reason: 'test',
                    adjustmentType: 'decrease',
                    impact: {} as ComplexityImpact,
                    confidence: 0.8
                },
                {
                    id: '2',
                    timestamp: new Date(),
                    fromLevel: 'moderate',
                    toLevel: 'low',
                    reason: 'test',
                    adjustmentType: 'decrease',
                    impact: {} as ComplexityImpact,
                    confidence: 0.8
                }
            );

            const analyzeTrajectory = (engine as any).analyzeComplexityTrajectory.bind(engine);
            const trajectory = analyzeTrajectory();

            expect(trajectory).toBe('decreasing');
        });

        it('should analyze stable trajectory', () => {
            const analyzeTrajectory = (engine as any).analyzeComplexityTrajectory.bind(engine);
            const trajectory = analyzeTrajectory();

            expect(trajectory).toBe('stable');
        });
    });

    describe('dependency analysis', () => {
        it('should calculate dependency depth correctly', () => {
            const calculateDepth = (engine as any).calculateDependencyDepth.bind(engine);
            const nestedSteps = [
                { id: 'step-1', dependencies: [] },
                { id: 'step-2', dependencies: ['step-1'] },
                { id: 'step-3', dependencies: ['step-2'] },
                { id: 'step-4', dependencies: ['step-3'] }
            ];

            const depth = calculateDepth(nestedSteps);
            expect(depth).toBe(3);
        });

        it('should handle circular dependencies gracefully', () => {
            const calculateDepth = (engine as any).calculateDependencyDepth.bind(engine);
            const circularSteps = [
                { id: 'step-1', dependencies: ['step-2'] },
                { id: 'step-2', dependencies: ['step-1'] }
            ];

            const depth = calculateDepth(circularSteps);
            expect(depth).toBeGreaterThanOrEqual(0);
        });
    });

    describe('learning from adjustments', () => {
        it('should learn from complexity adjustments', async () => {
            const adjustment: ComplexityAdjustment = {
                id: 'test-adjustment',
                timestamp: new Date(),
                fromLevel: 'moderate',
                toLevel: 'high',
                reason: 'Test learning',
                adjustmentType: 'increase',
                impact: {} as ComplexityImpact,
                confidence: 0.9
            };

            const learnFromAdjustment = (engine as any).learnFromAdjustment.bind(engine);
            await learnFromAdjustment(adjustment, testContext);

            const learningData = (engine as any).learningData as Map<string, number>;
            const key = 'moderate_high_engineering';
            expect(learningData.has(key)).toBe(true);
            expect(learningData.get(key)).toBe(1);
        });

        it('should update learning rate based on success', async () => {
            const history = (engine as any).complexityHistory as ComplexityAdjustment[];
            
            // Add successful adjustments
            for (let i = 0; i < 15; i++) {
                history.push({
                    id: `adj-${i}`,
                    timestamp: new Date(),
                    fromLevel: 'moderate',
                    toLevel: 'high',
                    reason: 'test',
                    adjustmentType: 'increase',
                    impact: {} as ComplexityImpact,
                    confidence: 0.9
                });
            }

            const adjustment: ComplexityAdjustment = {
                id: 'test-adjustment',
                timestamp: new Date(),
                fromLevel: 'moderate',
                toLevel: 'high',
                reason: 'Test learning rate',
                adjustmentType: 'increase',
                impact: {} as ComplexityImpact,
                confidence: 0.9
            };

            const learnFromAdjustment = (engine as any).learnFromAdjustment.bind(engine);
            await learnFromAdjustment(adjustment, testContext);

            const config = (engine as any).config as DynamicComplexityConfig;
            expect(config.learningRate).toBeGreaterThan(0.1);
        });
    });

    describe('complexity statistics', () => {
        it('should provide accurate complexity statistics', async () => {
            // Perform some adjustments to generate history
            const metrics: ComplexityMetrics = {
                structural: 0.8,
                logical: 0.7,
                domain: 0.6,
                temporal: 0.5,
                cognitive: 0.9,
                overall: 0.75
            };

            await engine.adjustComplexity(metrics, testContext, testSteps);
            await engine.adjustComplexity(metrics, testContext, testSteps);

            const stats = engine.getComplexityStatistics();

            expect(stats.currentMetrics).toBeDefined();
            expect(stats.adjustmentHistory).toBeGreaterThanOrEqual(0);
            expect(stats.averageComplexity).toBeGreaterThanOrEqual(0);
            expect(['increasing', 'decreasing', 'stable']).toContain(stats.complexityTrend);
            expect(stats.learningPatterns).toBeGreaterThanOrEqual(0);
        });

        it('should handle empty history gracefully', () => {
            const emptyEngine = new DynamicComplexityEngine(defaultConfig);
            const stats = emptyEngine.getComplexityStatistics();

            expect(stats.currentMetrics).toBeDefined();
            expect(stats.adjustmentHistory).toBe(0);
            expect(stats.averageComplexity).toBe(0.5);
            expect(stats.complexityTrend).toBe('stable');
            expect(stats.learningPatterns).toBe(0);
        });
    });

    describe('configuration handling', () => {
        it('should respect real-time adjustment configuration', async () => {
            const disabledConfig = {
                ...defaultConfig,
                enableRealTimeAdjustment: false
            };

            const disabledEngine = new DynamicComplexityEngine(disabledConfig);
            const metrics: ComplexityMetrics = {
                structural: 0.8,
                logical: 0.7,
                domain: 0.6,
                temporal: 0.5,
                cognitive: 0.9,
                overall: 0.75
            };

            const adjustment = await disabledEngine.adjustComplexity(metrics, testContext, testSteps);
            expect(adjustment).toBeNull();
        });

        it('should respect learning configuration', () => {
            const noLearningConfig = {
                ...defaultConfig,
                enableLearningFromHistory: false
            };

            const noLearningEngine = new DynamicComplexityEngine(noLearningConfig);
            expect((noLearningEngine as any).config.enableLearningFromHistory).toBe(false);
        });

        it('should handle different max complexity levels', () => {
            const limitedConfig = {
                ...defaultConfig,
                maxComplexityLevel: 'moderate' as ComplexityLevel
            };

            const limitedEngine = new DynamicComplexityEngine(limitedConfig);
            expect((limitedEngine as any).config.maxComplexityLevel).toBe('moderate');
        });
    });

    describe('error handling', () => {
        it('should handle invalid complexity values gracefully', async () => {
            const invalidMetrics: ComplexityMetrics = {
                structural: -1,
                logical: 2,
                domain: NaN,
                temporal: Infinity,
                cognitive: undefined as any,
                overall: null as any
            };

            const result = await engine.adjustComplexity(invalidMetrics, testContext, testSteps);
            expect(result).toBeDefined();
        });

        it('should handle empty content gracefully', async () => {
            const metrics = await engine.analyzeComplexity('', testContext, []);
            expect(metrics).toBeDefined();
            expect(metrics.overall).toBeGreaterThanOrEqual(0);
        });

        it('should handle missing context properties', async () => {
            const incompleteContext = {
                complexity: 0.5,
                domain: 'test'
            } as ReasoningContext;

            const metrics = await engine.analyzeComplexity('test content', incompleteContext, testSteps);
            expect(metrics).toBeDefined();
        });
    });
});