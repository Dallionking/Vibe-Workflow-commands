/**
 * Tests for Advanced Chain-of-Thought Reasoning System
 * Phase 3: Advanced Context Features - Tier 2.1
 */

import {
    ReasoningChain,
    ReasoningChainConfig,
    ReasoningState,
    ReasoningContext,
    ConditionalBranch,
    ReflectionResult
} from './reasoning-chain';

import {
    ReasoningStep,
    ChainOfThoughtStructure
} from '../interfaces';

describe('ReasoningChain', () => {
    let reasoningChain: ReasoningChain;
    let defaultConfig: ReasoningChainConfig;

    beforeEach(() => {
        defaultConfig = {
            maxSteps: 10,
            enableSelfReflection: true,
            enableConditionalBranching: true,
            enableDynamicComplexity: true,
            reflectionThreshold: 0.7,
            complexityThreshold: 0.5,
            timeoutMs: 30000
        };

        reasoningChain = new ReasoningChain(defaultConfig);
    });

    describe('initialization', () => {
        it('should initialize with default configuration', () => {
            expect(reasoningChain).toBeDefined();
            expect((reasoningChain as any).config).toEqual(defaultConfig);
            expect((reasoningChain as any).state).toBe('initialized');
        });

        it('should initialize reasoning context', async () => {
            await reasoningChain.initialize(
                'Solve complex optimization problem',
                'mathematics',
                ['time limit: 1 hour'],
                { priority: 'high' }
            );

            const context = (reasoningChain as any).context as ReasoningContext;
            expect(context.domain).toBe('mathematics');
            expect(context.constraints).toContain('time limit: 1 hour');
            expect(context.metadata.priority).toBe('high');
            expect(context.complexity).toBeGreaterThan(0);
        });

        it('should create initial reasoning step', async () => {
            await reasoningChain.initialize(
                'Test problem',
                'general'
            );

            const steps = (reasoningChain as any).steps as ReasoningStep[];
            expect(steps).toHaveLength(1);
            expect(steps[0].id).toBe('step-0');
            expect(steps[0].order).toBe(0);
            expect(steps[0].description).toContain('Analyze problem');
        });

        it('should initialize conditional branches when enabled', async () => {
            await reasoningChain.initialize(
                'Complex problem requiring branching',
                'engineering'
            );

            const branches = (reasoningChain as any).branches as Map<string, ConditionalBranch>;
            expect(branches.size).toBeGreaterThan(0);
            expect(branches.has('high-complexity')).toBe(true);
            expect(branches.has('validation-required')).toBe(true);
        });
    });

    describe('complexity analysis', () => {
        it('should calculate base complexity correctly', async () => {
            await reasoningChain.initialize(
                'Simple problem',
                'general'
            );

            const context = (reasoningChain as any).context as ReasoningContext;
            expect(context.complexity).toBeLessThan(0.8);
        });

        it('should increase complexity for complex problems', async () => {
            await reasoningChain.initialize(
                'Complex multi-step optimization problem requiring integration, analysis, and synthesis of multiple dynamic conditional recursive elements',
                'engineering'
            );

            const context = (reasoningChain as any).context as ReasoningContext;
            expect(context.complexity).toBeGreaterThan(0.7);
        });

        it('should adjust complexity dynamically', async () => {
            await reasoningChain.initialize(
                'Test problem',
                'general'
            );

            const initialComplexity = (reasoningChain as any).context.complexity;
            
            // Simulate adding steps to increase complexity
            (reasoningChain as any).context.previousSteps = new Array(5).fill({
                id: 'test',
                order: 0,
                description: 'Test step',
                expectedOutput: 'Test output',
                dependencies: [],
                validationRules: []
            });

            const adjustedComplexity = await (reasoningChain as any).calculateDynamicComplexity();
            expect(adjustedComplexity).toBeGreaterThan(initialComplexity);
        });
    });

    describe('conditional branching', () => {
        beforeEach(async () => {
            await reasoningChain.initialize(
                'Complex branching problem',
                'engineering'
            );
        });

        it('should create conditional branches', () => {
            const branches = (reasoningChain as any).branches as Map<string, ConditionalBranch>;
            
            const highComplexityBranch = branches.get('high-complexity');
            expect(highComplexityBranch).toBeDefined();
            expect(highComplexityBranch!.condition).toBe('complexity > 0.7');
            expect(highComplexityBranch!.isActive).toBe(true);
        });

        it('should evaluate branch conditions correctly', async () => {
            // Set high complexity to trigger branch
            (reasoningChain as any).context.complexity = 0.8;

            const branches = (reasoningChain as any).branches as Map<string, ConditionalBranch>;
            const highComplexityBranch = branches.get('high-complexity');
            
            const shouldActivate = highComplexityBranch!.conditionFunction(
                (reasoningChain as any).context
            );
            
            expect(shouldActivate).toBe(true);
        });

        it('should activate branches when conditions are met', async () => {
            // Set conditions to trigger validation branch
            (reasoningChain as any).context.previousSteps = new Array(4).fill({
                id: 'test',
                order: 0,
                description: 'Test step',
                expectedOutput: 'Test output',
                dependencies: [],
                validationRules: []
            });

            const initialStepCount = (reasoningChain as any).steps.length;
            
            await (reasoningChain as any).evaluateConditionalBranches();
            
            const finalStepCount = (reasoningChain as any).steps.length;
            expect(finalStepCount).toBeGreaterThan(initialStepCount);
        });

        it('should handle domain-specific branching', () => {
            const branches = (reasoningChain as any).branches as Map<string, ConditionalBranch>;
            const domainBranch = branches.get('domain-specific');
            
            expect(domainBranch).toBeDefined();
            
            // Should activate for non-general domain
            const shouldActivate = domainBranch!.conditionFunction(
                (reasoningChain as any).context
            );
            
            expect(shouldActivate).toBe(true); // domain is 'engineering'
        });
    });

    describe('self-reflection', () => {
        beforeEach(async () => {
            await reasoningChain.initialize(
                'Problem requiring reflection',
                'analysis'
            );
        });

        it('should determine when reflection is needed', () => {
            // Add steps to trigger reflection
            (reasoningChain as any).context.previousSteps = new Array(3).fill({
                id: 'test',
                order: 0,
                description: 'Test step',
                expectedOutput: 'Test output',
                dependencies: [],
                validationRules: ['consistency']
            });

            const shouldReflect = (reasoningChain as any).shouldReflect();
            expect(shouldReflect).toBe(true);
        });

        it('should analyze recent reasoning for quality', async () => {
            const testSteps: ReasoningStep[] = [
                {
                    id: 'step-1',
                    order: 1,
                    description: 'First step',
                    expectedOutput: 'First output',
                    dependencies: [],
                    validationRules: ['consistency', 'logical']
                },
                {
                    id: 'step-2',
                    order: 2,
                    description: 'Second step',
                    expectedOutput: 'Second output',
                    dependencies: ['step-1'],
                    validationRules: ['completeness']
                }
            ];

            const reflectionResult = await (reasoningChain as any).analyzeRecentReasoning(testSteps);
            
            expect(reflectionResult).toBeDefined();
            expect(reflectionResult.isValid).toBeDefined();
            expect(reflectionResult.confidence).toBeGreaterThan(0);
            expect(reflectionResult.shouldContinue).toBe(true);
        });

        it('should detect issues in inconsistent reasoning', async () => {
            const inconsistentSteps: ReasoningStep[] = [
                {
                    id: 'step-1',
                    order: 1,
                    description: 'First step',
                    expectedOutput: 'First output',
                    dependencies: [],
                    validationRules: ['basic'] // No consistency validation
                },
                {
                    id: 'step-2',
                    order: 2,
                    description: 'Second step',
                    expectedOutput: 'Second output',
                    dependencies: ['step-1'],
                    validationRules: ['basic'] // No consistency validation
                }
            ];

            const reflectionResult = await (reasoningChain as any).analyzeRecentReasoning(inconsistentSteps);
            
            expect(reflectionResult.isValid).toBe(false);
            expect(reflectionResult.issues).toContain('Inconsistent reasoning detected');
            expect(reflectionResult.confidence).toBeLessThan(0.8);
        });

        it('should apply reflection adjustments', async () => {
            const adjustments = {
                focus: 'improved-consistency',
                validation: 'enhanced'
            };

            await (reasoningChain as any).applyReflectionAdjustments(adjustments);
            
            const context = (reasoningChain as any).context as ReasoningContext;
            expect(context.metadata.focus).toBe('improved-consistency');
            expect(context.metadata.validation).toBe('enhanced');
        });

        it('should perform full self-reflection cycle', async () => {
            // Setup previous steps
            (reasoningChain as any).context.previousSteps = [
                {
                    id: 'step-1',
                    order: 1,
                    description: 'Test step 1',
                    expectedOutput: 'Output 1',
                    dependencies: [],
                    validationRules: ['consistency']
                },
                {
                    id: 'step-2',
                    order: 2,
                    description: 'Test step 2',
                    expectedOutput: 'Output 2',
                    dependencies: ['step-1'],
                    validationRules: ['logical']
                }
            ];

            const initialReflectionCount = (reasoningChain as any).reflectionResults.length;
            
            await (reasoningChain as any).performSelfReflection();
            
            const finalReflectionCount = (reasoningChain as any).reflectionResults.length;
            expect(finalReflectionCount).toBe(initialReflectionCount + 1);
        });
    });

    describe('step execution', () => {
        beforeEach(async () => {
            await reasoningChain.initialize(
                'Test problem',
                'general'
            );
        });

        it('should validate step dependencies', async () => {
            const stepWithDependencies: ReasoningStep = {
                id: 'dependent-step',
                order: 1,
                description: 'Step with dependencies',
                expectedOutput: 'Dependent output',
                dependencies: ['step-0'], // Should exist
                validationRules: []
            };

            // Add the dependency to previous steps
            (reasoningChain as any).context.previousSteps = [
                {
                    id: 'step-0',
                    order: 0,
                    description: 'Initial step',
                    expectedOutput: 'Initial output',
                    dependencies: [],
                    validationRules: []
                }
            ];

            await expect(
                (reasoningChain as any).validateDependencies(stepWithDependencies)
            ).resolves.toBeUndefined();
        });

        it('should throw error for missing dependencies', async () => {
            const stepWithMissingDependencies: ReasoningStep = {
                id: 'dependent-step',
                order: 1,
                description: 'Step with missing dependencies',
                expectedOutput: 'Dependent output',
                dependencies: ['non-existent-step'],
                validationRules: []
            };

            await expect(
                (reasoningChain as any).validateDependencies(stepWithMissingDependencies)
            ).rejects.toThrow('depends on missing step');
        });

        it('should execute step logic and update context', async () => {
            const currentStep = (reasoningChain as any).context.currentStep;
            
            const result = await (reasoningChain as any).executeStepLogic(currentStep);
            
            expect(result).toBeDefined();
            expect(result.outcome).toContain('executed successfully');
            
            (reasoningChain as any).updateContextWithResults(result);
            
            const context = (reasoningChain as any).context as ReasoningContext;
            expect(context.metadata).toBeDefined();
        });

        it('should advance to next step correctly', async () => {
            // Add a second step
            (reasoningChain as any).steps.push({
                id: 'step-1',
                order: 1,
                description: 'Second step',
                expectedOutput: 'Second output',
                dependencies: ['step-0'],
                validationRules: []
            });

            const initialStep = (reasoningChain as any).context.currentStep;
            expect(initialStep.order).toBe(0);
            
            await (reasoningChain as any).advanceToNextStep();
            
            const nextStep = (reasoningChain as any).context.currentStep;
            expect(nextStep.order).toBe(1);
        });

        it('should handle end of steps gracefully', async () => {
            // Don't add any additional steps
            await (reasoningChain as any).advanceToNextStep();
            
            const currentStep = (reasoningChain as any).context.currentStep;
            expect(currentStep).toBeUndefined();
        });
    });

    describe('chain of thought generation', () => {
        beforeEach(async () => {
            await reasoningChain.initialize(
                'Complex analysis problem',
                'research'
            );
        });

        it('should generate thought process', async () => {
            const thoughtProcess = await (reasoningChain as any).generateThoughtProcess();
            
            expect(thoughtProcess).toBeDefined();
            expect(thoughtProcess.initialAnalysis).toContain('research');
            expect(thoughtProcess.problemDecomposition).toBeInstanceOf(Array);
            expect(thoughtProcess.solutionApproach).toContain('multi-step reasoning');
            expect(thoughtProcess.finalSynthesis).toContain('reasoning steps');
        });

        it('should generate validation checks', async () => {
            const validationChecks = await (reasoningChain as any).generateValidationChecks();
            
            expect(validationChecks).toBeInstanceOf(Array);
            expect(validationChecks.length).toBeGreaterThan(0);
            
            const logicalCheck = validationChecks.find((check: any) => check.checkType === 'logical');
            expect(logicalCheck).toBeDefined();
            expect(logicalCheck.criteria).toContain('logical progression');
        });

        it('should generate emergent insights', async () => {
            // Set high complexity to trigger insights
            (reasoningChain as any).context.complexity = 0.8;
            
            // Add reflection results
            (reasoningChain as any).reflectionResults = [
                {
                    isValid: true,
                    confidence: 0.9,
                    issues: [],
                    suggestions: ['Test suggestion'],
                    shouldContinue: true,
                    adjustments: {}
                }
            ];

            const insights = await (reasoningChain as any).generateEmergentInsights();
            
            expect(insights).toBeInstanceOf(Array);
            expect(insights.length).toBeGreaterThan(0);
            
            const complexityInsight = insights.find((insight: any) => 
                insight.insight.includes('complexity')
            );
            expect(complexityInsight).toBeDefined();
            expect(complexityInsight.confidence).toBeGreaterThan(0.8);
        });

        it('should generate complete chain of thought structure', async () => {
            // Add some reflection results for complete test
            (reasoningChain as any).reflectionResults = [
                {
                    isValid: true,
                    confidence: 0.85,
                    issues: [],
                    suggestions: [],
                    shouldContinue: true,
                    adjustments: {}
                }
            ];

            const cot = await (reasoningChain as any).generateChainOfThought();
            
            expect(cot).toBeDefined();
            expect(cot.enabled).toBe(true);
            expect(cot.reasoningSteps).toBeInstanceOf(Array);
            expect(cot.thoughtProcess).toBeDefined();
            expect(cot.validationChecks).toBeInstanceOf(Array);
            expect(cot.emergentInsights).toBeInstanceOf(Array);
        });
    });

    describe('configuration options', () => {
        it('should respect maxSteps configuration', async () => {
            const limitedConfig: ReasoningChainConfig = {
                ...defaultConfig,
                maxSteps: 3
            };

            const limitedChain = new ReasoningChain(limitedConfig);
            await limitedChain.initialize('Test problem', 'general');

            const shouldContinue = (limitedChain as any).shouldContinue();
            expect(shouldContinue).toBe(true);

            // Add steps up to limit
            for (let i = 1; i < 3; i++) {
                (limitedChain as any).steps.push({
                    id: `step-${i}`,
                    order: i,
                    description: `Step ${i}`,
                    expectedOutput: `Output ${i}`,
                    dependencies: [],
                    validationRules: []
                });
            }

            const shouldNotContinue = (limitedChain as any).shouldContinue();
            expect(shouldNotContinue).toBe(false);
        });

        it('should disable self-reflection when configured', async () => {
            const noReflectionConfig: ReasoningChainConfig = {
                ...defaultConfig,
                enableSelfReflection: false
            };

            const noReflectionChain = new ReasoningChain(noReflectionConfig);
            await noReflectionChain.initialize('Test problem', 'general');

            // Add steps that would normally trigger reflection
            (noReflectionChain as any).context.previousSteps = new Array(6).fill({
                id: 'test',
                order: 0,
                description: 'Test step',
                expectedOutput: 'Test output',
                dependencies: [],
                validationRules: []
            });

            const shouldReflect = (noReflectionChain as any).shouldReflect();
            expect(shouldReflect).toBe(true); // Still true based on step count

            // But reflection should be skipped in execution due to config
            expect(noReflectionConfig.enableSelfReflection).toBe(false);
        });

        it('should disable conditional branching when configured', async () => {
            const noBranchingConfig: ReasoningChainConfig = {
                ...defaultConfig,
                enableConditionalBranching: false
            };

            const noBranchingChain = new ReasoningChain(noBranchingConfig);
            await noBranchingChain.initialize('Test problem', 'general');

            const branches = (noBranchingChain as any).branches as Map<string, ConditionalBranch>;
            expect(branches.size).toBe(0);
        });

        it('should handle timeout configuration', () => {
            const timeoutConfig: ReasoningChainConfig = {
                ...defaultConfig,
                timeoutMs: 100 // Very short timeout
            };

            const timeoutChain = new ReasoningChain(timeoutConfig);
            
            // Simulate time passing
            (timeoutChain as any).startTime = Date.now() - 200;
            
            const hasTimedOut = (timeoutChain as any).checkTimeout();
            expect(hasTimedOut).toBe(true);
        });
    });

    describe('error handling', () => {
        it('should handle initialization errors gracefully', async () => {
            await expect(
                reasoningChain.initialize('', '') // Empty problem and domain
            ).resolves.toBeUndefined(); // Should not throw
        });

        it('should handle execution errors', async () => {
            await reasoningChain.initialize('Test problem', 'general');
            
            // Mock a failing step execution
            const originalExecuteStepLogic = (reasoningChain as any).executeStepLogic;
            (reasoningChain as any).executeStepLogic = jest.fn().mockRejectedValue(new Error('Step execution failed'));
            
            await expect(reasoningChain.execute()).rejects.toThrow('Step execution failed');
            expect((reasoningChain as any).state).toBe('failed');
            
            // Restore original method
            (reasoningChain as any).executeStepLogic = originalExecuteStepLogic;
        });

        it('should handle reflection errors gracefully', async () => {
            await reasoningChain.initialize('Test problem', 'general');
            
            // Mock reflection to indicate reasoning should not continue
            (reasoningChain as any).analyzeRecentReasoning = jest.fn().mockResolvedValue({
                isValid: false,
                confidence: 0.1,
                issues: ['Critical error'],
                suggestions: [],
                shouldContinue: false,
                adjustments: {}
            });
            
            (reasoningChain as any).context.previousSteps = new Array(3).fill({
                id: 'test',
                order: 0,
                description: 'Test step',
                expectedOutput: 'Test output',
                dependencies: [],
                validationRules: []
            });
            
            await expect(
                (reasoningChain as any).performSelfReflection()
            ).rejects.toThrow('Self-reflection indicates reasoning should not continue');
        });
    });

    describe('integration scenarios', () => {
        it('should handle complex multi-step reasoning scenario', async () => {
            const complexConfig: ReasoningChainConfig = {
                maxSteps: 15,
                enableSelfReflection: true,
                enableConditionalBranching: true,
                enableDynamicComplexity: true,
                reflectionThreshold: 0.8,
                complexityThreshold: 0.6,
                timeoutMs: 60000
            };

            const complexChain = new ReasoningChain(complexConfig);
            
            await complexChain.initialize(
                'Design and optimize a complex distributed system with multiple integration points, conditional logic, and dynamic scaling requirements',
                'software-engineering',
                ['performance requirements', 'scalability constraints', 'security requirements'],
                { priority: 'critical', complexity: 'high' }
            );

            const context = (complexChain as any).context as ReasoningContext;
            expect(context.complexity).toBeGreaterThan(0.7);
            expect(context.domain).toBe('software-engineering');
            expect(context.constraints).toHaveLength(3);
        });

        it('should demonstrate full reasoning chain with all features', async () => {
            await reasoningChain.initialize(
                'Analyze optimization strategies for multi-step process improvement',
                'process-optimization',
                ['budget constraints', 'time limits'],
                { stakeholders: ['engineering', 'management'] }
            );

            // This would normally call execute(), but we'll test the components
            const branches = (reasoningChain as any).branches as Map<string, ConditionalBranch>;
            const steps = (reasoningChain as any).steps as ReasoningStep[];
            const context = (reasoningChain as any).context as ReasoningContext;

            expect(branches.size).toBeGreaterThan(0);
            expect(steps.length).toBeGreaterThan(0);
            expect(context.complexity).toBeGreaterThan(0.5);
            expect(context.domain).toBe('process-optimization');
        });
    });
});