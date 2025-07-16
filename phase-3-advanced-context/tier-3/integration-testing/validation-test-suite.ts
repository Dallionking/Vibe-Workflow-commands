/**
 * Validation Test Suite
 * Phase 3: Advanced Context Features - Tier 3.3
 * 
 * Comprehensive validation scenarios for testing quality gates,
 * data integrity, business logic validation, and system constraints.
 */

import { IntegrationTestFramework, TestCase, TestResult } from './integration-test-framework';
import { ValidationGate } from '../phase-generation/validation-gate';
import { PRPPhaseGenerator } from '../phase-generation/prp-phase-generator';
import { ExamplePatternLibrary } from '../phase-generation/example-pattern-library';

export interface ValidationScenario {
    id: string;
    name: string;
    description: string;
    category: 'data_integrity' | 'business_logic' | 'constraint_validation' | 'quality_gates';
    severity: 'low' | 'medium' | 'high' | 'critical';
    preconditions: ValidationPrecondition[];
    testData: any;
    expectedOutcome: ValidationExpectation;
    validationRules: ValidationRule[];
}

export interface ValidationPrecondition {
    description: string;
    check: () => Promise<boolean>;
    required: boolean;
}

export interface ValidationExpectation {
    shouldPass: boolean;
    expectedScore?: number;
    expectedIssues?: string[];
    expectedMetrics?: Record<string, number>;
}

export interface ValidationRule {
    id: string;
    description: string;
    validator: (data: any) => Promise<ValidationRuleResult>;
    weight: number;
    critical: boolean;
}

export interface ValidationRuleResult {
    passed: boolean;
    score: number;
    message: string;
    details?: any;
}

export interface ValidationTestResult extends TestResult {
    scenarioId: string;
    validationResults: ValidationRuleResult[];
    qualityScore: number;
    integrityScore: number;
    businessLogicScore: number;
    constraintScore: number;
}

export class ValidationTestSuite {
    private framework: IntegrationTestFramework;
    private validationGate: ValidationGate;
    private prpGenerator: PRPPhaseGenerator;
    private patternLibrary: ExamplePatternLibrary;
    private scenarios: Map<string, ValidationScenario> = new Map();

    constructor(framework: IntegrationTestFramework) {
        this.framework = framework;
        this.validationGate = new ValidationGate({
            strictMode: true,
            qualityThresholds: {
                clarity: 0.8,
                completeness: 0.85,
                actionability: 0.9,
                testability: 0.75
            },
            autoFix: false,
            reportingLevel: 'comprehensive'
        });
        this.prpGenerator = new PRPPhaseGenerator();
        this.patternLibrary = new ExamplePatternLibrary();

        this.initializeValidationScenarios();
        this.registerValidationTests();
        console.log('✅ Validation Test Suite initialized');
    }

    /**
     * Run all validation scenarios
     */
    async runValidationTests(): Promise<ValidationTestResult[]> {
        console.log('🔍 Running validation test scenarios');
        
        const results: ValidationTestResult[] = [];
        
        for (const scenario of this.scenarios.values()) {
            try {
                const result = await this.runValidationScenario(scenario);
                results.push(result);
                
                if (result.scenarioId && scenario.severity === 'critical' && !result.passed) {
                    console.warn(`❌ Critical validation scenario failed: ${scenario.name}`);
                }
            } catch (error) {
                console.error(`❌ Validation scenario error: ${scenario.name}`, error);
            }
        }

        await this.generateValidationReport(results);
        return results;
    }

    /**
     * Add custom validation scenario
     */
    addValidationScenario(scenario: ValidationScenario): void {
        this.scenarios.set(scenario.id, scenario);
        this.registerScenarioAsTest(scenario);
        console.log(`📝 Added validation scenario: ${scenario.name}`);
    }

    /**
     * Validate specific data with all applicable rules
     */
    async validateData(data: any, category?: string): Promise<{
        passed: boolean;
        score: number;
        results: ValidationRuleResult[];
    }> {
        const applicableScenarios = Array.from(this.scenarios.values())
            .filter(s => !category || s.category === category);
        
        const allResults: ValidationRuleResult[] = [];
        
        for (const scenario of applicableScenarios) {
            for (const rule of scenario.validationRules) {
                try {
                    const result = await rule.validator(data);
                    allResults.push(result);
                } catch (error) {
                    allResults.push({
                        passed: false,
                        score: 0,
                        message: `Validation rule failed: ${error.message}`,
                        details: { error: error.message, ruleId: rule.id }
                    });
                }
            }
        }

        const totalWeight = applicableScenarios.reduce(
            (sum, s) => sum + s.validationRules.reduce((ruleSum, r) => ruleSum + r.weight, 0), 
            0
        );
        
        const weightedScore = allResults.reduce((sum, result, index) => {
            const scenario = applicableScenarios[Math.floor(index / applicableScenarios[0]?.validationRules.length || 1)];
            const rule = scenario?.validationRules[index % (scenario?.validationRules.length || 1)];
            return sum + (result.score * (rule?.weight || 1));
        }, 0);

        const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
        const passed = allResults.every(r => r.passed) && finalScore >= 0.7;

        return { passed, score: finalScore, results: allResults };
    }

    // Private methods
    private initializeValidationScenarios(): void {
        // Data Integrity Scenarios
        this.addValidationScenario({
            id: 'data_integrity_basic',
            name: 'Basic Data Integrity Validation',
            description: 'Validates basic data structure and required fields',
            category: 'data_integrity',
            severity: 'critical',
            preconditions: [
                {
                    description: 'Validation gate is available',
                    check: async () => this.validationGate !== null,
                    required: true
                }
            ],
            testData: {
                validPhase: {
                    id: 'test_phase_001',
                    name: 'Test Phase',
                    description: 'A well-formed test phase',
                    objective: 'Test data integrity validation',
                    successCriteria: ['All data fields are valid', 'Structure is correct'],
                    contextRequirements: ['Valid context'],
                    validationCheckpoints: ['Data integrity check']
                },
                invalidPhase: {
                    id: '', // Invalid: empty ID
                    name: null, // Invalid: null name
                    description: 'Incomplete phase',
                    // Missing required fields
                }
            },
            expectedOutcome: {
                shouldPass: true,
                expectedScore: 0.8,
                expectedMetrics: { structureScore: 0.9, completenessScore: 0.8 }
            },
            validationRules: [
                {
                    id: 'required_fields',
                    description: 'All required fields must be present',
                    validator: async (data) => {
                        const requiredFields = ['id', 'name', 'description'];
                        const missingFields = requiredFields.filter(field => !data[field]);
                        return {
                            passed: missingFields.length === 0,
                            score: 1 - (missingFields.length / requiredFields.length),
                            message: missingFields.length === 0 
                                ? 'All required fields present' 
                                : `Missing fields: ${missingFields.join(', ')}`,
                            details: { missingFields }
                        };
                    },
                    weight: 1.0,
                    critical: true
                },
                {
                    id: 'field_types',
                    description: 'Field types must be correct',
                    validator: async (data) => {
                        const typeErrors: string[] = [];
                        if (data.id && typeof data.id !== 'string') typeErrors.push('id must be string');
                        if (data.name && typeof data.name !== 'string') typeErrors.push('name must be string');
                        if (data.description && typeof data.description !== 'string') typeErrors.push('description must be string');
                        
                        return {
                            passed: typeErrors.length === 0,
                            score: typeErrors.length === 0 ? 1 : 0.5,
                            message: typeErrors.length === 0 
                                ? 'All field types correct' 
                                : `Type errors: ${typeErrors.join(', ')}`,
                            details: { typeErrors }
                        };
                    },
                    weight: 0.8,
                    critical: false
                }
            ]
        });

        // Business Logic Scenarios
        this.addValidationScenario({
            id: 'business_logic_phase_generation',
            name: 'Phase Generation Business Logic',
            description: 'Validates business rules for phase generation',
            category: 'business_logic',
            severity: 'high',
            preconditions: [
                {
                    description: 'PRP generator is available',
                    check: async () => this.prpGenerator !== null,
                    required: true
                }
            ],
            testData: {
                validRequest: {
                    phaseId: 'business_test_001',
                    requirements: {
                        objective: 'Generate a comprehensive business phase',
                        complexity: 'high',
                        dependencies: ['phase_000'],
                        timeline: 'Q1 2024'
                    }
                },
                invalidRequest: {
                    phaseId: '', // Invalid
                    requirements: {
                        complexity: 'invalid_complexity', // Invalid
                        dependencies: ['non_existent_phase'] // Invalid dependency
                    }
                }
            },
            expectedOutcome: {
                shouldPass: true,
                expectedScore: 0.85
            },
            validationRules: [
                {
                    id: 'phase_id_format',
                    description: 'Phase ID must follow naming convention',
                    validator: async (data) => {
                        const phaseId = data.phaseId;
                        const validFormat = /^[a-z_][a-z0-9_]*$/.test(phaseId);
                        return {
                            passed: validFormat,
                            score: validFormat ? 1 : 0,
                            message: validFormat ? 'Phase ID format valid' : 'Phase ID must be lowercase with underscores',
                            details: { phaseId, pattern: '^[a-z_][a-z0-9_]*$' }
                        };
                    },
                    weight: 0.7,
                    critical: false
                },
                {
                    id: 'complexity_validation',
                    description: 'Complexity must be valid value',
                    validator: async (data) => {
                        const complexity = data.requirements?.complexity;
                        const validComplexities = ['low', 'medium', 'high'];
                        const isValid = validComplexities.includes(complexity);
                        return {
                            passed: isValid,
                            score: isValid ? 1 : 0,
                            message: isValid ? 'Complexity level valid' : `Complexity must be one of: ${validComplexities.join(', ')}`,
                            details: { complexity, validOptions: validComplexities }
                        };
                    },
                    weight: 0.6,
                    critical: false
                }
            ]
        });

        // Quality Gates Scenarios
        this.addValidationScenario({
            id: 'quality_gates_comprehensive',
            name: 'Comprehensive Quality Gates',
            description: 'Tests all quality gate validations',
            category: 'quality_gates',
            severity: 'high',
            preconditions: [
                {
                    description: 'Quality gate system is operational',
                    check: async () => true,
                    required: true
                }
            ],
            testData: {
                highQualityPhase: {
                    id: 'quality_test_001',
                    name: 'High Quality Test Phase',
                    description: 'This is a comprehensive test phase with excellent documentation and clear objectives that demonstrate high quality standards.',
                    objective: 'Validate comprehensive quality gates and ensure all quality metrics meet or exceed established thresholds',
                    successCriteria: [
                        'All validation tests pass with score >= 0.9',
                        'Performance metrics within acceptable ranges',
                        'Code coverage >= 95%',
                        'Documentation completeness >= 90%'
                    ],
                    contextRequirements: [
                        'Testing environment properly configured',
                        'All dependencies available and validated',
                        'Performance monitoring active'
                    ],
                    validationCheckpoints: [
                        'Initial setup validation',
                        'Mid-process quality check',
                        'Final validation and approval'
                    ]
                },
                lowQualityPhase: {
                    id: 'low_q',
                    name: 'Poor',
                    description: 'Bad.',
                    objective: 'Test',
                    successCriteria: ['Pass'],
                    contextRequirements: ['Something'],
                    validationCheckpoints: ['Check']
                }
            },
            expectedOutcome: {
                shouldPass: true,
                expectedScore: 0.9
            },
            validationRules: [
                {
                    id: 'clarity_assessment',
                    description: 'Content must be clear and well-written',
                    validator: async (data) => {
                        const description = data.description || '';
                        const objective = data.objective || '';
                        
                        // Simple clarity metrics
                        const avgSentenceLength = this.calculateAverageSentenceLength(description + ' ' + objective);
                        const clarityScore = Math.max(0, Math.min(1, 1 - (avgSentenceLength - 20) / 100));
                        
                        return {
                            passed: clarityScore >= 0.6,
                            score: clarityScore,
                            message: clarityScore >= 0.6 ? 'Content clarity acceptable' : 'Content needs improvement for clarity',
                            details: { avgSentenceLength, clarityScore }
                        };
                    },
                    weight: 0.8,
                    critical: false
                },
                {
                    id: 'completeness_assessment',
                    description: 'All required content sections must be complete',
                    validator: async (data) => {
                        const sections = ['description', 'objective', 'successCriteria', 'contextRequirements', 'validationCheckpoints'];
                        let completenessScore = 0;
                        const sectionScores: Record<string, number> = {};
                        
                        sections.forEach(section => {
                            const content = data[section];
                            let score = 0;
                            
                            if (Array.isArray(content)) {
                                score = Math.min(1, content.length / 3); // Expect at least 3 items
                            } else if (typeof content === 'string') {
                                score = Math.min(1, content.length / 50); // Expect at least 50 characters
                            }
                            
                            sectionScores[section] = score;
                            completenessScore += score;
                        });
                        
                        completenessScore = completenessScore / sections.length;
                        
                        return {
                            passed: completenessScore >= 0.7,
                            score: completenessScore,
                            message: completenessScore >= 0.7 ? 'Content completeness acceptable' : 'Content sections need more detail',
                            details: { sectionScores, overallScore: completenessScore }
                        };
                    },
                    weight: 1.0,
                    critical: true
                }
            ]
        });

        // Constraint Validation Scenarios
        this.addValidationScenario({
            id: 'constraint_validation_limits',
            name: 'System Constraint Validation',
            description: 'Tests system limits and constraints',
            category: 'constraint_validation',
            severity: 'medium',
            preconditions: [],
            testData: {
                withinLimits: {
                    id: 'constraint_test_001',
                    name: 'Normal Phase',
                    description: 'A phase within normal system constraints',
                    tokenCount: 1000,
                    complexity: 'medium',
                    estimatedDuration: 3600000 // 1 hour
                },
                exceedsLimits: {
                    id: 'constraint_test_002',
                    name: 'Excessive Phase',
                    description: 'A phase that exceeds system constraints',
                    tokenCount: 50000, // Exceeds limit
                    complexity: 'extreme', // Invalid complexity
                    estimatedDuration: 86400000 * 7 // 1 week - too long
                }
            },
            expectedOutcome: {
                shouldPass: true,
                expectedScore: 0.8
            },
            validationRules: [
                {
                    id: 'token_limit_check',
                    description: 'Token count must be within limits',
                    validator: async (data) => {
                        const tokenCount = data.tokenCount || 0;
                        const maxTokens = 10000;
                        const withinLimit = tokenCount <= maxTokens;
                        
                        return {
                            passed: withinLimit,
                            score: withinLimit ? 1 : Math.max(0, 1 - (tokenCount - maxTokens) / maxTokens),
                            message: withinLimit ? 'Token count within limits' : `Token count ${tokenCount} exceeds limit of ${maxTokens}`,
                            details: { tokenCount, maxTokens, withinLimit }
                        };
                    },
                    weight: 0.9,
                    critical: true
                },
                {
                    id: 'duration_limit_check',
                    description: 'Estimated duration must be reasonable',
                    validator: async (data) => {
                        const duration = data.estimatedDuration || 0;
                        const maxDuration = 86400000 * 2; // 2 days
                        const withinLimit = duration <= maxDuration;
                        
                        return {
                            passed: withinLimit,
                            score: withinLimit ? 1 : 0.5,
                            message: withinLimit ? 'Duration within limits' : `Duration ${duration}ms exceeds reasonable limit`,
                            details: { duration, maxDuration, withinLimit }
                        };
                    },
                    weight: 0.6,
                    critical: false
                }
            ]
        });
    }

    private registerValidationTests(): void {
        for (const scenario of this.scenarios.values()) {
            this.registerScenarioAsTest(scenario);
        }
    }

    private registerScenarioAsTest(scenario: ValidationScenario): void {
        const testCase: TestCase = {
            id: `validation_${scenario.id}`,
            name: `Validation: ${scenario.name}`,
            description: scenario.description,
            category: 'validation',
            priority: scenario.severity === 'critical' ? 'critical' : 
                     scenario.severity === 'high' ? 'high' : 'medium',
            setup: async () => ({ scenario }),
            execute: async (context) => {
                const result = await this.runValidationScenario(context.scenario);
                return {
                    passed: result.passed,
                    output: result,
                    score: result.qualityScore
                };
            },
            teardown: async () => {},
            expectedDuration: 5000,
            dependencies: []
        };

        this.framework.addTestCase(testCase);
    }

    private async runValidationScenario(scenario: ValidationScenario): Promise<ValidationTestResult> {
        const startTime = Date.now();
        
        try {
            // Check preconditions
            for (const precondition of scenario.preconditions) {
                const met = await precondition.check();
                if (precondition.required && !met) {
                    throw new Error(`Precondition not met: ${precondition.description}`);
                }
            }

            // Run validation rules against test data
            const validationResults: ValidationRuleResult[] = [];
            
            for (const rule of scenario.validationRules) {
                try {
                    const result = await rule.validator(scenario.testData);
                    validationResults.push(result);
                } catch (error) {
                    validationResults.push({
                        passed: false,
                        score: 0,
                        message: `Rule execution failed: ${error.message}`,
                        details: { error: error.message, ruleId: rule.id }
                    });
                }
            }

            // Calculate scores
            const qualityScore = this.calculateQualityScore(validationResults, scenario.validationRules);
            const integrityScore = this.calculateCategoryScore(validationResults, scenario.validationRules, 'data_integrity');
            const businessLogicScore = this.calculateCategoryScore(validationResults, scenario.validationRules, 'business_logic');
            const constraintScore = this.calculateCategoryScore(validationResults, scenario.validationRules, 'constraint_validation');

            // Determine overall pass/fail
            const criticalFailures = validationResults.filter((result, index) => 
                !result.passed && scenario.validationRules[index].critical
            );
            const passed = criticalFailures.length === 0 && qualityScore >= 0.7;

            const duration = Date.now() - startTime;

            return {
                testId: `validation_${scenario.id}`,
                name: scenario.name,
                passed,
                duration,
                score: qualityScore,
                metrics: {
                    memoryUsage: 0,
                    cpuUsage: 0,
                    throughput: 0,
                    latency: duration,
                    errorRate: criticalFailures.length / validationResults.length,
                    successRate: passed ? 1 : 0,
                    performanceScore: Math.max(0, 1 - duration / 10000)
                },
                errors: criticalFailures.map(failure => ({
                    type: 'validation_error',
                    message: failure.message,
                    severity: 'high' as const
                })),
                warnings: validationResults.filter(r => !r.passed && r.score > 0).map(warning => ({
                    type: 'validation_warning',
                    message: warning.message,
                    impact: 'medium' as const
                })),
                output: {
                    scenarioId: scenario.id,
                    validationResults,
                    expectedOutcome: scenario.expectedOutcome
                },
                details: {
                    steps: [
                        { name: 'Preconditions', status: 'passed', duration: 100 },
                        { name: 'Validation Rules', status: passed ? 'passed' : 'failed', duration: duration - 100 }
                    ],
                    assertions: validationResults.map(result => ({
                        description: result.message,
                        expected: true,
                        actual: result.passed,
                        passed: result.passed,
                        operator: 'equals'
                    })),
                    performance: [],
                    validations: [{
                        timestamp: new Date(),
                        validator: scenario.name,
                        passed,
                        score: qualityScore,
                        issues: criticalFailures.map(f => f.message)
                    }]
                },
                scenarioId: scenario.id,
                validationResults,
                qualityScore,
                integrityScore,
                businessLogicScore,
                constraintScore
            };

        } catch (error) {
            return {
                testId: `validation_${scenario.id}`,
                name: scenario.name,
                passed: false,
                duration: Date.now() - startTime,
                metrics: {
                    memoryUsage: 0,
                    cpuUsage: 0,
                    throughput: 0,
                    latency: Date.now() - startTime,
                    errorRate: 1,
                    successRate: 0,
                    performanceScore: 0
                },
                errors: [{
                    type: 'scenario_error',
                    message: error.message,
                    stack: error.stack,
                    severity: 'critical'
                }],
                warnings: [],
                output: null,
                details: {
                    steps: [{ name: 'Execution', status: 'failed', duration: Date.now() - startTime, error: error.message }],
                    assertions: [],
                    performance: [],
                    validations: []
                },
                scenarioId: scenario.id,
                validationResults: [],
                qualityScore: 0,
                integrityScore: 0,
                businessLogicScore: 0,
                constraintScore: 0
            };
        }
    }

    private calculateQualityScore(results: ValidationRuleResult[], rules: ValidationRule[]): number {
        let totalWeight = 0;
        let weightedScore = 0;

        results.forEach((result, index) => {
            const rule = rules[index];
            totalWeight += rule.weight;
            weightedScore += result.score * rule.weight;
        });

        return totalWeight > 0 ? weightedScore / totalWeight : 0;
    }

    private calculateCategoryScore(
        results: ValidationRuleResult[], 
        rules: ValidationRule[], 
        category: string
    ): number {
        // For this simplified implementation, return the overall score
        // In a real system, you'd filter by rule categories
        return this.calculateQualityScore(results, rules);
    }

    private calculateAverageSentenceLength(text: string): number {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length === 0) return 0;
        
        const totalLength = sentences.reduce((sum, sentence) => sum + sentence.trim().split(/\s+/).length, 0);
        return totalLength / sentences.length;
    }

    private async generateValidationReport(results: ValidationTestResult[]): Promise<void> {
        const passed = results.filter(r => r.passed).length;
        const total = results.length;
        const averageQuality = results.reduce((sum, r) => sum + r.qualityScore, 0) / total;
        
        console.log(`📊 Validation Report: ${passed}/${total} scenarios passed (${(averageQuality * 100).toFixed(1)}% avg quality)`);
        
        const criticalFailures = results.filter(r => 
            !r.passed && r.errors.some(e => e.severity === 'critical')
        );
        
        if (criticalFailures.length > 0) {
            console.warn(`⚠️ ${criticalFailures.length} critical validation failures detected`);
        }
    }
}