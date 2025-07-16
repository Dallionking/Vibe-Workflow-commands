/**
 * Tests for PRP Generator Helper Functions
 */

import { PRPGeneratorHelpers } from './prp-generator-helpers';
import {
    ReasoningStep,
    ThoughtProcess,
    ValidationCheck,
    EmergentInsight,
    FewShotExample
} from './interfaces';

describe('PRPGeneratorHelpers', () => {
    describe('analyzeReasoningComplexity', () => {
        it('should return base complexity for simple content', async () => {
            const complexity = await PRPGeneratorHelpers.analyzeReasoningComplexity('Simple task');
            expect(complexity).toBeLessThan(3);
        });

        it('should increase complexity for distributed systems', async () => {
            const complexity = await PRPGeneratorHelpers.analyzeReasoningComplexity(
                'Build a distributed concurrent system with high performance'
            );
            expect(complexity).toBeGreaterThan(5);
        });

        it('should consider content length', async () => {
            const longContent = 'word '.repeat(600);
            const complexity = await PRPGeneratorHelpers.analyzeReasoningComplexity(longContent);
            expect(complexity).toBeGreaterThan(2);
        });

        it('should detect technical terms', async () => {
            const complexity = await PRPGeneratorHelpers.analyzeReasoningComplexity(
                'Implement API with database cache queue async thread process'
            );
            expect(complexity).toBeGreaterThan(3);
        });

        it('should cap complexity at 10', async () => {
            const veryComplex = 'distributed concurrent optimize performance architecture ' +
                'design integration security authentication scale scalability ' +
                'api database cache queue stream async sync thread process '.repeat(10);
            const complexity = await PRPGeneratorHelpers.analyzeReasoningComplexity(veryComplex);
            expect(complexity).toBe(10);
        });
    });

    describe('generateReasoningSteps', () => {
        it('should generate basic steps for low complexity', async () => {
            const steps = await PRPGeneratorHelpers.generateReasoningSteps(
                'Simple task',
                2,
                { projectName: 'Test' }
            );
            
            expect(steps.length).toBeGreaterThanOrEqual(3);
            expect(steps[0].description).toContain('Analyze requirements');
            expect(steps[steps.length - 1].description).toContain('Implement solution');
        });

        it('should add architecture step for moderate complexity', async () => {
            const steps = await PRPGeneratorHelpers.generateReasoningSteps(
                'Complex task',
                4,
                { projectName: 'Test' }
            );
            
            expect(steps.some(s => s.description.includes('architecture'))).toBe(true);
        });

        it('should add performance step for high complexity', async () => {
            const steps = await PRPGeneratorHelpers.generateReasoningSteps(
                'Very complex task',
                6,
                { projectName: 'Test' }
            );
            
            expect(steps.some(s => s.description.includes('performance'))).toBe(true);
        });

        it('should add edge case handling for very high complexity', async () => {
            const steps = await PRPGeneratorHelpers.generateReasoningSteps(
                'Extremely complex task',
                8,
                { projectName: 'Test' }
            );
            
            expect(steps.some(s => s.description.includes('edge cases'))).toBe(true);
        });

        it('should maintain proper dependencies', async () => {
            const steps = await PRPGeneratorHelpers.generateReasoningSteps(
                'Task',
                5,
                { projectName: 'Test' }
            );
            
            // First step should have no dependencies
            expect(steps[0].dependencies).toHaveLength(0);
            
            // Later steps should depend on earlier ones
            expect(steps[1].dependencies).toContain('step-1');
            
            // Final step should depend on all previous
            const finalStep = steps[steps.length - 1];
            expect(finalStep.dependencies.length).toBe(steps.length - 1);
        });
    });

    describe('generateThoughtProcess', () => {
        it('should generate complete thought process', async () => {
            const steps: ReasoningStep[] = [
                {
                    id: 'step-1',
                    order: 1,
                    description: 'Test step',
                    expectedOutput: 'Output',
                    dependencies: [],
                    validationRules: []
                }
            ];
            
            const thoughtProcess = await PRPGeneratorHelpers.generateThoughtProcess(
                'Test content',
                steps,
                { projectName: 'TestProject', projectType: 'web-application' }
            );
            
            expect(thoughtProcess.initialAnalysis).toContain('TestProject');
            expect(thoughtProcess.problemDecomposition).toHaveLength(3);
            expect(thoughtProcess.solutionApproach).toContain('systematic implementation');
            expect(thoughtProcess.alternativeConsiderations).toHaveLength(4);
            expect(thoughtProcess.finalSynthesis).toContain('1-step process');
        });

        it('should scale problem decomposition with steps', async () => {
            const manySteps: ReasoningStep[] = Array(8).fill(null).map((_, i) => ({
                id: `step-${i + 1}`,
                order: i + 1,
                description: `Step ${i + 1}`,
                expectedOutput: 'Output',
                dependencies: [],
                validationRules: []
            }));
            
            const thoughtProcess = await PRPGeneratorHelpers.generateThoughtProcess(
                'Complex content',
                manySteps,
                { projectName: 'Complex', projectType: 'enterprise' }
            );
            
            expect(thoughtProcess.problemDecomposition.length).toBe(4);
        });

        it('should generate appropriate alternatives for web apps', async () => {
            const thoughtProcess = await PRPGeneratorHelpers.generateThoughtProcess(
                'Web app content',
                [],
                { projectName: 'WebApp', projectType: 'web-application' }
            );
            
            expect(thoughtProcess.alternativeConsiderations.some(alt => 
                alt.includes('server-side rendering')
            )).toBe(true);
        });

        it('should generate architecture alternatives when mentioned', async () => {
            const thoughtProcess = await PRPGeneratorHelpers.generateThoughtProcess(
                'Design the architecture for the system',
                [],
                { projectName: 'System', projectType: 'backend' }
            );
            
            expect(thoughtProcess.alternativeConsiderations.some(alt => 
                alt.includes('Monolithic vs microservices')
            )).toBe(true);
        });

        it('should include database alternatives when relevant', async () => {
            const thoughtProcess = await PRPGeneratorHelpers.generateThoughtProcess(
                'Setup database storage',
                [],
                { projectName: 'DataApp', projectType: 'data-platform' }
            );
            
            expect(thoughtProcess.alternativeConsiderations.some(alt => 
                alt.includes('SQL vs NoSQL')
            )).toBe(true);
        });
    });

    describe('generateValidationChecks', () => {
        it('should generate all validation check types', async () => {
            const steps: ReasoningStep[] = [
                {
                    id: 'step-1',
                    order: 1,
                    description: 'Test',
                    expectedOutput: 'Output',
                    dependencies: [],
                    validationRules: []
                }
            ];
            
            const checks = await PRPGeneratorHelpers.generateValidationChecks(
                steps,
                { projectName: 'Test' }
            );
            
            expect(checks).toHaveLength(4);
            expect(checks.map(c => c.checkType)).toEqual([
                'logical',
                'factual',
                'consistency',
                'completeness'
            ]);
        });

        it('should have proper validation prompts', async () => {
            const checks = await PRPGeneratorHelpers.generateValidationChecks(
                [],
                {}
            );
            
            checks.forEach(check => {
                expect(check.criteria).toBeTruthy();
                expect(check.expectedResult).toBeTruthy();
                expect(check.validationPrompt).toBeTruthy();
            });
        });
    });

    describe('identifyEmergentInsights', () => {
        it('should identify modular architecture insight for complex problems', async () => {
            const process: ThoughtProcess = {
                initialAnalysis: 'Complex analysis',
                problemDecomposition: ['step1', 'step2', 'step3', 'step4'],
                solutionApproach: 'Modular approach',
                alternativeConsiderations: [],
                finalSynthesis: 'Final synthesis'
            };
            
            const insights = await PRPGeneratorHelpers.identifyEmergentInsights(
                process,
                [],
                { projectType: 'enterprise' }
            );
            
            expect(insights.some(i => i.insight.includes('modular architecture'))).toBe(true);
            expect(insights[0].implications).toHaveLength(3);
            expect(insights[0].actionItems).toHaveLength(3);
        });

        it('should identify performance optimization for performance-critical projects', async () => {
            const insights = await PRPGeneratorHelpers.identifyEmergentInsights(
                {} as ThoughtProcess,
                [],
                { projectType: 'high-performance-api' }
            );
            
            expect(insights.some(i => i.insight.includes('Performance-critical'))).toBe(true);
        });

        it('should identify quality focus with multiple validation checks', async () => {
            const checks: ValidationCheck[] = Array(4).fill({
                checkType: 'logical',
                criteria: 'Test',
                expectedResult: 'Pass',
                validationPrompt: 'Check'
            });
            
            const insights = await PRPGeneratorHelpers.identifyEmergentInsights(
                {} as ThoughtProcess,
                checks,
                {}
            );
            
            expect(insights.some(i => i.insight.includes('quality-focused'))).toBe(true);
        });

        it('should set appropriate confidence levels', async () => {
            const insights = await PRPGeneratorHelpers.identifyEmergentInsights(
                { problemDecomposition: ['1', '2', '3', '4'] } as ThoughtProcess,
                [],
                {}
            );
            
            insights.forEach(insight => {
                expect(insight.confidence).toBeGreaterThan(0);
                expect(insight.confidence).toBeLessThanOrEqual(1);
                expect(insight.relevance).toBeGreaterThan(0);
                expect(insight.relevance).toBeLessThanOrEqual(1);
            });
        });
    });

    describe('getRelevantExamples', () => {
        it('should return API example for API-related content', async () => {
            const examples = await PRPGeneratorHelpers.getRelevantExamples(
                'Create an API endpoint',
                {}
            );
            
            expect(examples).toHaveLength(1);
            expect(examples[0].scenario).toContain('RESTful API');
            expect(examples[0].output).toContain('router');
            expect(examples[0].quality).toBe('excellent');
        });

        it('should return database example for database content', async () => {
            const examples = await PRPGeneratorHelpers.getRelevantExamples(
                'Implement database query',
                {}
            );
            
            expect(examples).toHaveLength(1);
            expect(examples[0].scenario).toContain('database query');
            expect(examples[0].output).toContain('searchUsers');
        });

        it('should return empty array for unmatched content', async () => {
            const examples = await PRPGeneratorHelpers.getRelevantExamples(
                'Some random content',
                {}
            );
            
            expect(examples).toHaveLength(0);
        });
    });

    describe('generateNewExamples', () => {
        it('should generate example when existing count is low', async () => {
            const examples = await PRPGeneratorHelpers.generateNewExamples(
                'Test content',
                { projectType: 'web-app' },
                1
            );
            
            expect(examples).toHaveLength(1);
            expect(examples[0].scenario).toContain('web-app');
            expect(examples[0].quality).toBe('good');
            expect(examples[0].relevance).toBe(0.7);
        });

        it('should not generate if enough examples exist', async () => {
            const examples = await PRPGeneratorHelpers.generateNewExamples(
                'Test content',
                {},
                3
            );
            
            expect(examples).toHaveLength(0);
        });

        it('should include proper structure in generated examples', async () => {
            const examples = await PRPGeneratorHelpers.generateNewExamples(
                'Build a feature',
                { projectType: 'saas' },
                0
            );
            
            expect(examples[0].id).toContain('generated-');
            expect(examples[0].input).toBeTruthy();
            expect(examples[0].reasoning).toContain('best practices');
            expect(examples[0].output).toContain('class Solution');
            expect(examples[0].complexity).toBe(0.5);
        });
    });
});