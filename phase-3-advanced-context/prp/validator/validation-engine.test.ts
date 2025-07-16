/**
 * Tests for PRP Validation Engine
 * Comprehensive validation framework testing
 */

import { PRPValidationEngine, ValidationConfig, ValidationContext } from './validation-engine';
import {
    PRPDocument,
    PRPContent,
    PRPValidation,
    ValidationIssue,
    ValidationRecommendation,
    QualityMetrics,
    ChainOfThoughtStructure,
    FewShotExample
} from '../generator/interfaces';

describe('PRPValidationEngine', () => {
    let validationEngine: PRPValidationEngine;
    let defaultConfig: ValidationConfig;
    let defaultContext: ValidationContext;
    let mockDocument: PRPDocument;

    beforeEach(() => {
        defaultConfig = {
            strictMode: true,
            qualityThreshold: 0.8,
            enableAIValidation: false,
            validateChainOfThought: true,
            validateFewShotExamples: true,
            validateOutputFormat: true,
            customValidators: []
        };

        defaultContext = {
            projectType: 'web-application',
            complexityLevel: 'moderate',
            expectedOutputs: ['implementation', 'tests', 'documentation'],
            qualityStandards: [
                {
                    name: 'TestCoverage',
                    description: '95% test coverage required',
                    threshold: 0.95,
                    weight: 0.3,
                    validator: 'test-coverage'
                }
            ],
            domainSpecificRules: []
        };

        validationEngine = new PRPValidationEngine(defaultConfig);

        // Create a mock PRP document for testing
        mockDocument = createMockPRPDocument();
    });

    describe('validateDocument', () => {
        it('should validate a complete and valid document', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            expect(validation.isValid).toBe(true);
            expect(validation.validationScore).toBeGreaterThan(0.8);
            expect(validation.issues.filter(i => i.type === 'error')).toHaveLength(0);
        });

        it('should detect missing required fields', async () => {
            const incompleteDoc = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    systemPrompt: '',
                    contextPrompt: ''
                }
            };

            const validation = await validationEngine.validateDocument(incompleteDoc, defaultContext);

            expect(validation.isValid).toBe(false);
            expect(validation.issues.some(i => 
                i.type === 'error' && i.location.includes('systemPrompt')
            )).toBe(true);
        });

        it('should provide quality metrics', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            const metrics = validation.qualityMetrics;
            expect(metrics.clarity).toBeGreaterThan(0);
            expect(metrics.completeness).toBeGreaterThan(0);
            expect(metrics.consistency).toBeGreaterThan(0);
            expect(metrics.coherence).toBeGreaterThan(0);
            expect(metrics.effectiveness).toBeGreaterThan(0);
            expect(metrics.efficiency).toBeGreaterThan(0);
            expect(metrics.maintainability).toBeGreaterThan(0);
        });

        it('should generate recommendations', async () => {
            const suboptimalDoc = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    fewShotExamples: [] // No examples
                }
            };

            const validation = await validationEngine.validateDocument(suboptimalDoc, defaultContext);

            expect(validation.recommendations.length).toBeGreaterThan(0);
            expect(validation.recommendations.some(r => 
                r.type === 'improvement' && r.description.includes('examples')
            )).toBe(true);
        });
    });

    describe('structural validation', () => {
        it('should validate document structure', async () => {
            const invalidDoc = {
                id: '',
                name: '',
                version: '',
                content: null
            } as any;

            const validation = await validationEngine.validateDocument(invalidDoc, defaultContext);

            expect(validation.isValid).toBe(false);
            expect(validation.issues.some(i => 
                i.severity === 'critical' && i.message.includes('content is missing')
            )).toBe(true);
        });

        it('should check metadata completeness', async () => {
            const docWithoutMetadata = {
                ...mockDocument,
                metadata: null
            } as any;

            const validation = await validationEngine.validateDocument(docWithoutMetadata, defaultContext);

            expect(validation.issues.some(i => 
                i.type === 'warning' && i.message.includes('metadata')
            )).toBe(true);
        });
    });

    describe('content quality validation', () => {
        it('should assess clarity below threshold', async () => {
            // Mock document with low clarity
            const unclearDoc = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    systemPrompt: 'Do stuff',
                    contextPrompt: 'Things',
                    instructionPrompt: 'Make it work'
                }
            };

            const validation = await validationEngine.validateDocument(unclearDoc, defaultContext);

            expect(validation.issues.some(i => 
                i.message.includes('clarity')
            )).toBe(true);
        });

        it('should check coherence', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            expect(validation.qualityMetrics.coherence).toBeGreaterThan(0);
        });

        it('should validate consistency', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            expect(validation.qualityMetrics.consistency).toBeGreaterThan(0);
        });
    });

    describe('Chain of Thought validation', () => {
        it('should validate CoT structure when enabled', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            expect(validation.isValid).toBe(true);
        });

        it('should detect missing reasoning steps', async () => {
            const docWithEmptyCoT = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    chainOfThought: {
                        enabled: true,
                        reasoningSteps: [],
                        thoughtProcess: mockDocument.content.chainOfThought.thoughtProcess,
                        validationChecks: [],
                        emergentInsights: []
                    }
                }
            };

            const validation = await validationEngine.validateDocument(docWithEmptyCoT, defaultContext);

            expect(validation.issues.some(i => 
                i.message.includes('reasoning steps')
            )).toBe(true);
        });

        it('should validate step dependencies', async () => {
            const docWithInvalidDeps = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    chainOfThought: {
                        ...mockDocument.content.chainOfThought,
                        reasoningSteps: [
                            {
                                id: 'step-1',
                                order: 1,
                                description: 'First step',
                                expectedOutput: 'Output',
                                dependencies: ['non-existent-step'],
                                validationRules: []
                            }
                        ]
                    }
                }
            };

            const validation = await validationEngine.validateDocument(docWithInvalidDeps, defaultContext);

            expect(validation.issues.some(i => 
                i.type === 'error' && i.message.includes('non-existent')
            )).toBe(true);
        });

        it('should skip CoT validation when disabled', async () => {
            const engineNoCoT = new PRPValidationEngine({
                ...defaultConfig,
                validateChainOfThought: false
            });

            const validation = await engineNoCoT.validateDocument(mockDocument, defaultContext);

            expect(validation.isValid).toBe(true);
        });
    });

    describe('few-shot examples validation', () => {
        it('should validate example quality', async () => {
            const docWithPoorExamples = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    fewShotExamples: [
                        {
                            id: 'ex-1',
                            scenario: 'Test',
                            input: 'Input',
                            reasoning: 'Reasoning',
                            output: 'Output',
                            quality: 'poor' as const,
                            relevance: 0.3,
                            complexity: 0.5
                        }
                    ]
                }
            };

            const validation = await validationEngine.validateDocument(docWithPoorExamples, defaultContext);

            expect(validation.issues.some(i => 
                i.message.includes('poor quality')
            )).toBe(true);
        });

        it('should check example relevance', async () => {
            const docWithLowRelevance = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    fewShotExamples: [
                        {
                            id: 'ex-1',
                            scenario: 'Test',
                            input: 'Input',
                            reasoning: 'Reasoning',
                            output: 'Output',
                            quality: 'good' as const,
                            relevance: 0.2,
                            complexity: 0.5
                        }
                    ]
                }
            };

            const validation = await validationEngine.validateDocument(docWithLowRelevance, defaultContext);

            expect(validation.issues.some(i => 
                i.message.includes('low relevance')
            )).toBe(true);
        });

        it('should recommend example diversity', async () => {
            const docWithSimilarExamples = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    fewShotExamples: [
                        createMockExample('Same scenario'),
                        createMockExample('Same scenario'),
                        createMockExample('Same scenario')
                    ]
                }
            };

            const validation = await validationEngine.validateDocument(docWithSimilarExamples, defaultContext);

            expect(validation.recommendations.some(r => 
                r.description.includes('diversity')
            )).toBe(true);
        });
    });

    describe('output format validation', () => {
        it('should validate output format specification', async () => {
            const docWithoutFormat = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    outputFormat: {
                        format: '' as any,
                        structure: mockDocument.content.outputFormat.structure,
                        examples: []
                    }
                }
            };

            const validation = await validationEngine.validateDocument(docWithoutFormat, defaultContext);

            expect(validation.issues.some(i => 
                i.type === 'error' && i.message.includes('Output format')
            )).toBe(true);
        });

        it('should check for output examples', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            const hasExampleRecommendation = validation.recommendations.some(r => 
                r.description.includes('output format examples')
            );
            expect(hasExampleRecommendation).toBe(true);
        });
    });

    describe('validation criteria consistency', () => {
        it('should validate criteria weights', async () => {
            const docWithInvalidWeights = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    validationCriteria: [
                        {
                            criterion: 'Quality',
                            description: 'Quality check',
                            validationMethod: 'automated' as const,
                            threshold: 0.8,
                            weight: 0.6,
                            criticalityLevel: 'required' as const
                        },
                        {
                            criterion: 'Performance',
                            description: 'Performance check',
                            validationMethod: 'automated' as const,
                            threshold: 0.7,
                            weight: 0.6,
                            criticalityLevel: 'required' as const
                        }
                    ]
                }
            };

            const validation = await validationEngine.validateDocument(docWithInvalidWeights, defaultContext);

            expect(validation.issues.some(i => 
                i.message.includes('weights sum')
            )).toBe(true);
        });

        it('should recommend critical criteria', async () => {
            const docWithoutCriticalCriteria = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    validationCriteria: mockDocument.content.validationCriteria.map(c => ({
                        ...c,
                        criticalityLevel: 'optional' as const
                    }))
                }
            };

            const validation = await validationEngine.validateDocument(docWithoutCriticalCriteria, defaultContext);

            expect(validation.recommendations.some(r => 
                r.description.includes('critical')
            )).toBe(true);
        });
    });

    describe('custom validators', () => {
        it('should run custom validators', async () => {
            let customValidatorRan = false;
            
            const engineWithCustom = new PRPValidationEngine({
                ...defaultConfig,
                customValidators: [
                    {
                        name: 'custom-test',
                        description: 'Test custom validator',
                        validator: async (doc) => {
                            customValidatorRan = true;
                            return {
                                passed: true,
                                score: 1.0,
                                issues: [],
                                recommendations: [],
                                metrics: {}
                            };
                        },
                        weight: 0.1,
                        enabled: true
                    }
                ]
            });

            await engineWithCustom.validateDocument(mockDocument, defaultContext);

            expect(customValidatorRan).toBe(true);
        });

        it('should skip disabled custom validators', async () => {
            let customValidatorRan = false;
            
            const engineWithDisabled = new PRPValidationEngine({
                ...defaultConfig,
                customValidators: [
                    {
                        name: 'disabled-test',
                        description: 'Disabled validator',
                        validator: async (doc) => {
                            customValidatorRan = true;
                            return {
                                passed: true,
                                score: 1.0,
                                issues: [],
                                recommendations: [],
                                metrics: {}
                            };
                        },
                        weight: 0.1,
                        enabled: false
                    }
                ]
            });

            await engineWithDisabled.validateDocument(mockDocument, defaultContext);

            expect(customValidatorRan).toBe(false);
        });
    });

    describe('validation scoring', () => {
        it('should calculate overall validation score', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            expect(validation.validationScore).toBeGreaterThan(0);
            expect(validation.validationScore).toBeLessThanOrEqual(1);
        });

        it('should penalize errors in score', async () => {
            const docWithErrors = {
                ...mockDocument,
                content: {
                    ...mockDocument.content,
                    systemPrompt: '' // Will cause error
                }
            };

            const validationWithErrors = await validationEngine.validateDocument(docWithErrors, defaultContext);
            const validationWithoutErrors = await validationEngine.validateDocument(mockDocument, defaultContext);

            expect(validationWithErrors.validationScore).toBeLessThan(validationWithoutErrors.validationScore);
        });

        it('should consider quality threshold', async () => {
            const validation = await validationEngine.validateDocument(mockDocument, defaultContext);

            if (validation.validationScore >= defaultConfig.qualityThreshold) {
                expect(validation.isValid).toBe(true);
            }
        });
    });

    describe('error handling', () => {
        it('should handle validation errors gracefully', async () => {
            const invalidDoc = null as any;

            const validation = await validationEngine.validateDocument(invalidDoc, defaultContext);

            expect(validation.isValid).toBe(false);
            expect(validation.validationScore).toBe(0);
            expect(validation.issues.some(i => 
                i.type === 'error' && i.severity === 'critical'
            )).toBe(true);
        });
    });
});

// Helper functions
function createMockPRPDocument(): PRPDocument {
    return {
        id: 'test-doc-1',
        name: 'Test Document',
        version: '1.0.0',
        source: {
            originalDocument: 'Test content',
            phaseNumber: 1,
            projectContext: 'TestProject',
            lastModified: new Date(),
            dependencies: [],
            relatedPhases: []
        },
        metadata: {
            promptType: 'phase',
            contextDepth: 'medium',
            reasoningPattern: 'chain-of-thought',
            complexity: 'moderate',
            tokenBudget: 4000,
            estimatedTokens: 3000,
            priority: 'high',
            tags: ['test']
        },
        content: {
            systemPrompt: 'You are an AI assistant',
            contextPrompt: 'Project context information',
            instructionPrompt: 'Please implement the following',
            chainOfThought: {
                enabled: true,
                reasoningSteps: [
                    {
                        id: 'step-1',
                        order: 1,
                        description: 'Analyze requirements',
                        expectedOutput: 'Requirements analysis',
                        dependencies: [],
                        validationRules: ['completeness']
                    }
                ],
                thoughtProcess: {
                    initialAnalysis: 'Initial analysis',
                    problemDecomposition: ['step1'],
                    solutionApproach: 'Approach',
                    alternativeConsiderations: [],
                    finalSynthesis: 'Synthesis'
                },
                validationChecks: [
                    {
                        checkType: 'logical',
                        criteria: 'Logic check',
                        expectedResult: 'Pass',
                        validationPrompt: 'Validate logic'
                    }
                ],
                emergentInsights: []
            },
            fewShotExamples: [
                createMockExample('Example 1')
            ],
            validationCriteria: [
                {
                    criterion: 'Quality',
                    description: 'Output quality',
                    validationMethod: 'automated',
                    threshold: 0.8,
                    weight: 0.5,
                    criticalityLevel: 'required'
                },
                {
                    criterion: 'Completeness',
                    description: 'Complete output',
                    validationMethod: 'automated',
                    threshold: 0.9,
                    weight: 0.5,
                    criticalityLevel: 'critical'
                }
            ],
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
            constraintsAndLimitations: ['Token limit: 4000']
        },
        validation: {
            isValid: true,
            validationScore: 0.85,
            issues: [],
            recommendations: [],
            qualityMetrics: {
                clarity: 0.85,
                completeness: 0.9,
                consistency: 0.88,
                coherence: 0.87,
                effectiveness: 0.85,
                efficiency: 0.83,
                maintainability: 0.86
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
}

function createMockExample(scenario: string): FewShotExample {
    return {
        id: `ex-${Date.now()}`,
        scenario,
        input: 'Example input',
        reasoning: 'Example reasoning',
        output: 'Example output',
        quality: 'good',
        relevance: 0.8,
        complexity: 0.5
    };
}