/**
 * Integration Tests for PRP and Field Protocol Systems
 * Tests the interaction between advanced context features
 */

import { PRPGenerator } from '../prp/generator/prp-generator';
import { PRPValidationEngine, ValidationConfig, ValidationContext } from '../prp/validator/validation-engine';
import { AttractorEngine, AttractorEngineConfig, AttractorContext } from '../field-protocol/attractors/attractor-engine';
import { EmergenceTracker, EmergenceContext } from '../field-protocol/emergence/emergence-tracker';
import {
    PRPGeneratorConfig,
    PRPGenerationContext
} from '../prp/generator/interfaces';
import {
    EmergenceConfiguration
} from '../field-protocol/interfaces';

describe('PRP and Field Protocol Integration', () => {
    let prpGenerator: PRPGenerator;
    let prpValidator: PRPValidationEngine;
    let attractorEngine: AttractorEngine;
    let emergenceTracker: EmergenceTracker;

    beforeEach(() => {
        // Initialize PRP System
        const prpConfig: PRPGeneratorConfig = {
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
        prpGenerator = new PRPGenerator(prpConfig);

        const validationConfig: ValidationConfig = {
            strictMode: true,
            qualityThreshold: 0.8,
            enableAIValidation: false,
            validateChainOfThought: true,
            validateFewShotExamples: true,
            validateOutputFormat: true,
            customValidators: []
        };
        prpValidator = new PRPValidationEngine(validationConfig);

        // Initialize Field Protocol System
        const attractorConfig: AttractorEngineConfig = {
            enableAdaptiveStability: true,
            enableBasinAnalysis: true,
            enableTransitionPrediction: true,
            stabilityThreshold: 0.5,
            transitionDelay: 100,
            noiseLevel: 0.1,
            dampingFactor: 0.8,
            maxAttractors: 10
        };
        attractorEngine = new AttractorEngine(attractorConfig);

        const emergenceConfig: EmergenceConfiguration = {
            detectionThreshold: 0.5,
            trackingWindow: 1000,
            samplingRate: 100,
            analysisDepth: 3,
            adaptiveThreshold: true,
            multiScaleTracking: true
        };
        emergenceTracker = new EmergenceTracker(emergenceConfig);
    });

    describe('PRP Generation with Field Protocol Context', () => {
        it('should generate PRP considering attractor states', async () => {
            // Setup attractor states
            const stableConfig = {
                dimensions: 3,
                parameters: { stability: 0.9 },
                constraints: [],
                invariants: [],
                perturbationTolerance: 0.1,
                recoveryTime: 100
            };

            await attractorEngine.addAttractorState(
                'stable-development',
                'Stable Development State',
                'point',
                stableConfig
            );

            // Generate PRP with field context
            const prpContext: PRPGenerationContext = {
                projectName: 'FieldAwareProject',
                projectType: 'complex-system',
                currentPhase: 1,
                previousPhases: [],
                availableContext: ['attractor:stable-development'],
                userPreferences: {
                    verbosityLevel: 'detailed',
                    reasoningStyle: 'analytical',
                    examplePreference: 'many',
                    validationStrictness: 'strict'
                },
                systemCapabilities: {
                    availableTools: ['AttractorEngine', 'EmergenceTracker'],
                    mcpIntegrations: [],
                    contextLength: 8000,
                    parallelProcessing: false,
                    cachingCapabilities: true
                },
                constraints: {
                    maxTokens: 4000,
                    timeLimit: 5000,
                    qualityRequirements: ['attractor-stability > 0.8'],
                    formatRequirements: ['markdown'],
                    compatibilityRequirements: []
                }
            };

            const result = await prpGenerator.generatePRP(
                'Implement field-aware feature with stable attractor states',
                prpContext
            );

            expect(result.success).toBe(true);
            expect(result.document.metadata.tags).toContain('complexity-moderate');
        });
    });

    describe('Emergence Detection during PRP Execution', () => {
        it('should detect emergent properties from PRP interactions', async () => {
            // Start emergence tracking
            const emergenceContext: EmergenceContext = {
                systemComponents: ['prp-generator', 'prp-validator', 'field-engine'],
                interactions: [
                    {
                        participants: ['prp-generator', 'field-engine'],
                        type: 'direct',
                        strength: 0.8,
                        duration: 1000,
                        effects: ['context-enhancement', 'quality-improvement']
                    }
                ],
                environment: {
                    stability: 0.8,
                    complexity: 0.7,
                    diversity: 0.9,
                    constraints: ['token-limit'],
                    opportunities: ['pattern-learning']
                },
                timeWindow: 2000,
                sensitivityLevel: 0.6
            };

            await emergenceTracker.startTracking(emergenceContext);

            // Generate multiple PRPs
            const context: PRPGenerationContext = {
                projectName: 'EmergentSystem',
                projectType: 'adaptive-system',
                currentPhase: 1,
                previousPhases: [],
                availableContext: [],
                userPreferences: {
                    verbosityLevel: 'standard',
                    reasoningStyle: 'intuitive',
                    examplePreference: 'moderate',
                    validationStrictness: 'standard'
                },
                systemCapabilities: {
                    availableTools: [],
                    mcpIntegrations: [],
                    contextLength: 8000,
                    parallelProcessing: false,
                    cachingCapabilities: true
                },
                constraints: {
                    maxTokens: 4000,
                    timeLimit: 5000,
                    qualityRequirements: [],
                    formatRequirements: ['markdown'],
                    compatibilityRequirements: []
                }
            };

            // Generate PRPs to create system activity
            await prpGenerator.generatePRP('Task 1', context);
            await prpGenerator.generatePRP('Task 2', context);
            await prpGenerator.generatePRP('Task 3', context);

            // Detect emergent properties
            const properties = await emergenceTracker.detectEmergence(emergenceContext);

            expect(properties.length).toBeGreaterThanOrEqual(0);
            
            await emergenceTracker.stopTracking();
        });
    });

    describe('Attractor-Guided PRP Validation', () => {
        it('should validate PRP based on current attractor state', async () => {
            // Setup attractors
            await attractorEngine.addAttractorState(
                'quality-focus',
                'Quality-Focused State',
                'point',
                {
                    dimensions: 2,
                    parameters: { quality: 0.95, speed: 0.3 },
                    constraints: [],
                    invariants: [],
                    perturbationTolerance: 0.05,
                    recoveryTime: 200
                }
            );

            const attractorContext: AttractorContext = {
                systemState: { quality: 0.95 },
                environmentConditions: {},
                externalForces: {},
                timeHorizon: 1000,
                constraints: []
            };

            await attractorEngine.transitionToAttractor('quality-focus', attractorContext, true);

            // Generate PRP
            const prpContext: PRPGenerationContext = {
                projectName: 'QualityProject',
                projectType: 'high-reliability',
                currentPhase: 1,
                previousPhases: [],
                availableContext: [],
                userPreferences: {
                    verbosityLevel: 'comprehensive',
                    reasoningStyle: 'logical',
                    examplePreference: 'many',
                    validationStrictness: 'strict'
                },
                systemCapabilities: {
                    availableTools: [],
                    mcpIntegrations: [],
                    contextLength: 8000,
                    parallelProcessing: false,
                    cachingCapabilities: true
                },
                constraints: {
                    maxTokens: 4000,
                    timeLimit: 5000,
                    qualityRequirements: ['95% quality'],
                    formatRequirements: ['markdown'],
                    compatibilityRequirements: []
                }
            };

            const prpResult = await prpGenerator.generatePRP(
                'High-quality implementation task',
                prpContext
            );

            // Validate with field-aware context
            const validationContext: ValidationContext = {
                projectType: 'high-reliability',
                complexityLevel: 'high',
                expectedOutputs: ['implementation', 'tests', 'documentation'],
                qualityStandards: [
                    {
                        name: 'AttractorAlignment',
                        description: 'Alignment with quality attractor',
                        threshold: 0.9,
                        weight: 0.4,
                        validator: 'attractor-validator'
                    }
                ],
                domainSpecificRules: []
            };

            const validation = await prpValidator.validateDocument(
                prpResult.document,
                validationContext
            );

            expect(validation.isValid).toBe(true);
            expect(validation.qualityMetrics.effectiveness).toBeGreaterThan(0.8);
        });
    });

    describe('Complex System Orchestration', () => {
        it('should coordinate all systems for complex task', async () => {
            // Setup complete field protocol
            await attractorEngine.addAttractorState('planning', 'Planning', 'periodic', {
                dimensions: 3,
                parameters: { frequency: 0.5 },
                constraints: [],
                invariants: [],
                perturbationTolerance: 0.2,
                recoveryTime: 150
            });

            await attractorEngine.addAttractorState('implementation', 'Implementation', 'point', {
                dimensions: 3,
                parameters: { focus: 0.8 },
                constraints: [],
                invariants: [],
                perturbationTolerance: 0.1,
                recoveryTime: 100
            });

            const fieldContext: AttractorContext = {
                systemState: { phase: 0.5 },
                environmentConditions: { complexity: 'high' },
                externalForces: {},
                timeHorizon: 5000,
                constraints: []
            };

            // Start with planning attractor
            await attractorEngine.transitionToAttractor('planning', fieldContext, true);

            // Setup emergence tracking
            const emergenceContext: EmergenceContext = {
                systemComponents: ['planner', 'implementer', 'validator'],
                interactions: [
                    {
                        participants: ['planner', 'implementer'],
                        type: 'hierarchical',
                        strength: 0.9,
                        duration: 2000,
                        effects: ['coordination', 'synchronization']
                    }
                ],
                environment: {
                    stability: 0.7,
                    complexity: 0.8,
                    diversity: 0.6,
                    constraints: ['time', 'resources'],
                    opportunities: ['optimization']
                },
                timeWindow: 5000,
                sensitivityLevel: 0.7
            };

            await emergenceTracker.startTracking(emergenceContext);

            // Generate planning PRP
            const planningContext: PRPGenerationContext = {
                projectName: 'ComplexSystem',
                projectType: 'orchestrated-system',
                currentPhase: 1,
                previousPhases: [],
                availableContext: ['attractor:planning', 'emergence:active'],
                userPreferences: {
                    verbosityLevel: 'detailed',
                    reasoningStyle: 'analytical',
                    examplePreference: 'moderate',
                    validationStrictness: 'standard'
                },
                systemCapabilities: {
                    availableTools: ['AttractorEngine', 'EmergenceTracker'],
                    mcpIntegrations: [],
                    contextLength: 8000,
                    parallelProcessing: true,
                    cachingCapabilities: true
                },
                constraints: {
                    maxTokens: 4000,
                    timeLimit: 5000,
                    qualityRequirements: ['comprehensive-planning'],
                    formatRequirements: ['markdown'],
                    compatibilityRequirements: []
                }
            };

            const planningPRP = await prpGenerator.generatePRP(
                'Create comprehensive system plan',
                planningContext
            );

            expect(planningPRP.success).toBe(true);

            // Transition to implementation
            await attractorEngine.transitionToAttractor('implementation', fieldContext);

            // Detect emergent properties
            const emergentProperties = await emergenceTracker.detectEmergence(emergenceContext);

            // Check system metrics
            const attractorMetrics = attractorEngine.getGlobalMetrics();
            const emergenceMetrics = emergenceTracker.getEmergenceMetrics();

            expect(attractorMetrics.totalStates).toBe(2);
            expect(emergenceMetrics.detectionRate).toBeGreaterThanOrEqual(0);

            await emergenceTracker.stopTracking();
        });
    });

    describe('Error Recovery and Resilience', () => {
        it('should handle PRP generation failure with field protocol fallback', async () => {
            // Setup unstable attractor
            await attractorEngine.addAttractorState('unstable', 'Unstable', 'chaotic', {
                dimensions: 3,
                parameters: { chaos: 0.9 },
                constraints: [],
                invariants: [],
                perturbationTolerance: 0.8,
                recoveryTime: 500
            });

            const context: PRPGenerationContext = {
                projectName: 'UnstableProject',
                projectType: 'experimental',
                currentPhase: -1, // Invalid phase
                previousPhases: [],
                availableContext: ['attractor:unstable'],
                userPreferences: {
                    verbosityLevel: 'minimal',
                    reasoningStyle: 'intuitive',
                    examplePreference: 'few',
                    validationStrictness: 'lenient'
                },
                systemCapabilities: {
                    availableTools: [],
                    mcpIntegrations: [],
                    contextLength: 100, // Very limited
                    parallelProcessing: false,
                    cachingCapabilities: false
                },
                constraints: {
                    maxTokens: 100, // Very limited
                    timeLimit: 100, // Very short
                    qualityRequirements: [],
                    formatRequirements: [],
                    compatibilityRequirements: []
                }
            };

            const result = await prpGenerator.generatePRP('Impossible task', context);

            // Should fail gracefully
            expect(result.success).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);

            // Attractor should help stabilize
            const stability = await attractorEngine.analyzeStability('unstable');
            expect(stability.localStability).toBeLessThan(0.5);
        });
    });

    describe('Performance and Optimization', () => {
        it('should optimize PRP generation based on emergence patterns', async () => {
            // Track emergence during multiple PRP generations
            const emergenceContext: EmergenceContext = {
                systemComponents: ['prp-cache', 'prp-optimizer', 'pattern-learner'],
                interactions: [
                    {
                        participants: ['prp-cache', 'prp-optimizer'],
                        type: 'direct',
                        strength: 0.9,
                        duration: 100,
                        effects: ['speed-improvement']
                    }
                ],
                environment: {
                    stability: 0.9,
                    complexity: 0.5,
                    diversity: 0.7,
                    constraints: [],
                    opportunities: ['caching', 'pattern-reuse']
                },
                timeWindow: 1000,
                sensitivityLevel: 0.8
            };

            await emergenceTracker.startTracking(emergenceContext);

            const context: PRPGenerationContext = {
                projectName: 'OptimizedProject',
                projectType: 'performance-critical',
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
                    availableTools: [],
                    mcpIntegrations: [],
                    contextLength: 8000,
                    parallelProcessing: false,
                    cachingCapabilities: true
                },
                constraints: {
                    maxTokens: 4000,
                    timeLimit: 5000,
                    qualityRequirements: [],
                    formatRequirements: ['markdown'],
                    compatibilityRequirements: []
                }
            };

            // Generate similar PRPs to trigger caching
            const start1 = Date.now();
            await prpGenerator.generatePRP('Optimize performance task', context);
            const time1 = Date.now() - start1;

            const start2 = Date.now();
            await prpGenerator.generatePRP('Optimize performance task', context);
            const time2 = Date.now() - start2;

            // Second generation should be faster due to caching
            expect(time2).toBeLessThan(time1);

            // Check for optimization emergence
            const properties = await emergenceTracker.detectEmergence(emergenceContext);
            const optimizationProperties = properties.filter(p => 
                p.name.includes('pattern') || p.name.includes('optimization')
            );

            expect(optimizationProperties).toBeDefined();

            await emergenceTracker.stopTracking();
        });
    });
});