/**
 * Tests for Validation Gate
 * Phase 3: Advanced Context Features - Tier 3.1
 * 
 * Comprehensive test suite for phase validation gateway
 * with error handling and edge case coverage.
 */

import { ValidationGate } from './validation-gate';

describe('ValidationGate', () => {
    let validationGate: ValidationGate;

    beforeEach(() => {
        validationGate = new ValidationGate();
    });

    describe('initialization', () => {
        it('should initialize with validation rules', () => {
            expect(validationGate).toBeDefined();
            const rules = (validationGate as any).validationRules;
            expect(rules.size).toBeGreaterThan(0);
            expect(rules.has('structure')).toBe(true);
            expect(rules.has('content')).toBe(true);
            expect(rules.has('quality')).toBe(true);
        });

        it('should initialize quality thresholds', () => {
            const thresholds = (validationGate as any).qualityThresholds;
            expect(thresholds).toBeDefined();
            expect(thresholds.clarity).toBeGreaterThan(0);
            expect(thresholds.completeness).toBeGreaterThan(0);
            expect(thresholds.actionability).toBeGreaterThan(0);
        });
    });

    describe('validatePhase', () => {
        const validPhase = {
            metadata: {
                phase: 1,
                title: 'Test Phase',
                objectives: ['Objective 1', 'Objective 2'],
                estimatedHours: 40
            },
            structure: {
                sections: [
                    { id: 'planning', title: 'Planning' },
                    { id: 'implementation', title: 'Implementation' }
                ],
                requiredComponents: ['component1', 'component2']
            },
            content: {
                overview: 'This is a comprehensive test phase with detailed planning.',
                planning: {
                    tasks: ['Task 1', 'Task 2'],
                    deliverables: ['Deliverable 1']
                },
                implementation: {
                    steps: ['Step 1', 'Step 2'],
                    codeExamples: []
                }
            },
            quality: {
                testCoverage: 95,
                documentationCompleteness: 90,
                codeQuality: 88
            }
        };

        it('should validate a well-formed phase', async () => {
            const result = await validationGate.validatePhase(validPhase);
            
            expect(result.isValid).toBe(true);
            expect(result.score).toBeGreaterThan(0.8);
            expect(result.errors).toHaveLength(0);
            expect(result.warnings.length).toBeLessThanOrEqual(1);
        });

        it('should detect missing metadata', async () => {
            const invalidPhase = {
                ...validPhase,
                metadata: {
                    phase: 1,
                    // Missing title and objectives
                    estimatedHours: 40
                }
            };
            
            const result = await validationGate.validatePhase(invalidPhase);
            
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('title'))).toBe(true);
            expect(result.errors.some(e => e.includes('objectives'))).toBe(true);
        });

        it('should detect invalid structure', async () => {
            const invalidPhase = {
                ...validPhase,
                structure: {
                    sections: [], // Empty sections
                    requiredComponents: []
                }
            };
            
            const result = await validationGate.validatePhase(invalidPhase);
            
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('sections'))).toBe(true);
        });

        it('should detect poor content quality', async () => {
            const poorQualityPhase = {
                ...validPhase,
                content: {
                    overview: 'Short overview', // Too short
                    planning: {
                        tasks: [],
                        deliverables: []
                    },
                    implementation: {
                        steps: [],
                        codeExamples: []
                    }
                }
            };
            
            const result = await validationGate.validatePhase(poorQualityPhase);
            
            expect(result.isValid).toBe(false);
            expect(result.qualityScore).toBeLessThan(0.7);
        });

        it('should generate appropriate suggestions', async () => {
            const suboptimalPhase = {
                ...validPhase,
                quality: {
                    testCoverage: 70, // Below recommended
                    documentationCompleteness: 60,
                    codeQuality: 75
                }
            };
            
            const result = await validationGate.validatePhase(suboptimalPhase);
            
            expect(result.suggestions.length).toBeGreaterThan(0);
            expect(result.suggestions.some(s => s.includes('test coverage'))).toBe(true);
        });
    });

    describe('validation rules', () => {
        it('should validate structure correctly', async () => {
            const phase = {
                metadata: { phase: 1, title: 'Test', objectives: ['Test'], estimatedHours: 10 },
                structure: {
                    sections: [{ id: 'test', title: 'Test Section' }],
                    requiredComponents: ['component']
                },
                content: { overview: 'Overview' },
                quality: {}
            };
            
            const result = await (validationGate as any).validateStructure(phase);
            
            expect(result.passed).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate content quality', async () => {
            const phase = {
                content: {
                    overview: 'This is a detailed and comprehensive overview of the phase that provides clear context and objectives for implementation.',
                    planning: {
                        tasks: ['Task 1', 'Task 2', 'Task 3'],
                        deliverables: ['Deliverable 1', 'Deliverable 2']
                    }
                }
            };
            
            const result = await (validationGate as any).validateContent(phase);
            
            expect(result.passed).toBe(true);
            expect(result.score).toBeGreaterThan(0.7);
        });

        it('should validate quality metrics', async () => {
            const phase = {
                quality: {
                    testCoverage: 95,
                    documentationCompleteness: 90,
                    codeQuality: 88
                }
            };
            
            const result = await (validationGate as any).validateQuality(phase);
            
            expect(result.passed).toBe(true);
            expect(result.score).toBeGreaterThan(0.8);
        });
    });

    describe('edge cases', () => {
        it('should handle null phase', async () => {
            const result = await validationGate.validatePhase(null as any);
            
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Phase data is missing');
        });

        it('should handle undefined phase', async () => {
            const result = await validationGate.validatePhase(undefined as any);
            
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Phase data is missing');
        });

        it('should handle empty phase object', async () => {
            const result = await validationGate.validatePhase({} as any);
            
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should handle phases with missing nested properties', async () => {
            const phase = {
                metadata: { phase: 1 }, // Missing required fields
                structure: null,
                content: undefined,
                quality: {}
            };
            
            const result = await validationGate.validatePhase(phase as any);
            
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should handle validation rule errors gracefully', async () => {
            // Mock a validation rule to throw
            const originalRule = (validationGate as any).validationRules.get('structure');
            (validationGate as any).validationRules.set('structure', {
                validate: () => { throw new Error('Validation error'); }
            });
            
            const result = await validationGate.validatePhase({
                metadata: {},
                structure: {},
                content: {},
                quality: {}
            } as any);
            
            expect(result.isValid).toBe(false);
            expect(result.errors.some(e => e.includes('Structure validation failed'))).toBe(true);
            
            // Restore original rule
            (validationGate as any).validationRules.set('structure', originalRule);
        });
    });

    describe('quality assessment', () => {
        it('should assess clarity correctly', () => {
            const content = {
                overview: 'This is a clear, detailed, and comprehensive overview that explains the purpose and goals.',
                details: 'Additional clear information'
            };
            
            const clarity = (validationGate as any).assessClarity(content);
            
            expect(clarity).toBeGreaterThan(0.7);
        });

        it('should assess completeness correctly', () => {
            const phase = {
                metadata: { phase: 1, title: 'Test', objectives: ['Obj1'], estimatedHours: 40 },
                structure: { sections: [{ id: 's1', title: 'Section 1' }], requiredComponents: ['c1'] },
                content: { overview: 'Overview', planning: { tasks: ['t1'], deliverables: ['d1'] } },
                quality: { testCoverage: 90 }
            };
            
            const completeness = (validationGate as any).assessCompleteness(phase);
            
            expect(completeness).toBeGreaterThan(0.7);
        });

        it('should assess actionability correctly', () => {
            const content = {
                planning: {
                    tasks: ['Implement feature X', 'Test feature Y', 'Deploy to staging'],
                    deliverables: ['Feature documentation', 'Test results']
                },
                implementation: {
                    steps: ['Step 1: Setup', 'Step 2: Code', 'Step 3: Test']
                }
            };
            
            const actionability = (validationGate as any).assessActionability(content);
            
            expect(actionability).toBeGreaterThan(0.7);
        });
    });

    describe('performance', () => {
        it('should validate large phases efficiently', async () => {
            const largePhase = {
                metadata: {
                    phase: 1,
                    title: 'Large Phase',
                    objectives: Array(100).fill('Objective'),
                    estimatedHours: 200
                },
                structure: {
                    sections: Array(50).fill({ id: 'section', title: 'Section' }),
                    requiredComponents: Array(100).fill('component')
                },
                content: {
                    overview: 'x'.repeat(10000),
                    planning: {
                        tasks: Array(200).fill('Task'),
                        deliverables: Array(50).fill('Deliverable')
                    }
                },
                quality: {
                    testCoverage: 95,
                    documentationCompleteness: 90,
                    codeQuality: 88
                }
            };
            
            const startTime = Date.now();
            const result = await validationGate.validatePhase(largePhase);
            const duration = Date.now() - startTime;
            
            expect(result).toBeDefined();
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });
    });

    describe('concurrent validation', () => {
        it('should handle multiple validations concurrently', async () => {
            const phases = Array(10).fill(null).map((_, i) => ({
                metadata: {
                    phase: i + 1,
                    title: `Phase ${i + 1}`,
                    objectives: ['Objective'],
                    estimatedHours: 40
                },
                structure: {
                    sections: [{ id: 'section', title: 'Section' }],
                    requiredComponents: ['component']
                },
                content: {
                    overview: 'Overview text',
                    planning: { tasks: ['Task'], deliverables: ['Deliverable'] }
                },
                quality: { testCoverage: 90 }
            }));
            
            const results = await Promise.all(
                phases.map(phase => validationGate.validatePhase(phase))
            );
            
            expect(results).toHaveLength(10);
            results.forEach(result => {
                expect(result).toBeDefined();
                expect(result.score).toBeGreaterThan(0);
            });
        });
    });
});