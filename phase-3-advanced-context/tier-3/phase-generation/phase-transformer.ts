/**
 * Phase Transformer
 * Phase 3: Advanced Context Features - Tier 3.1
 * 
 * Transforms existing phase documents into PRP (Product Requirements Prompt) format
 * with enhanced structure, validation, and example integration.
 */

import { PRPPhaseConfig, ExamplePattern } from './prp-phase-generator';

export interface PhaseTransformationConfig {
    preserveStructure: boolean;
    enhanceContent: boolean;
    addExamples: boolean;
    validateOutput: boolean;
    targetFormat: 'markdown' | 'json' | 'yaml';
}

export interface TransformationResult {
    success: boolean;
    transformedPhase: any;
    changes: TransformationChange[];
    metrics: TransformationMetrics;
    warnings: string[];
    errors: string[];
}

export interface TransformationChange {
    type: 'add' | 'modify' | 'remove';
    section: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
}

export interface TransformationMetrics {
    processingTime: number;
    sectionsProcessed: number;
    enhancementsAdded: number;
    validationsPassed: number;
    contentSizeChange: number;
}

export class PhaseTransformer {
    private transformationCache: Map<string, any> = new Map();
    private sectionProcessors: Map<string, (content: string) => any> = new Map();

    constructor() {
        this.initializeSectionProcessors();
        console.log('🔄 Phase Transformer initialized');
    }

    /**
     * Transform existing phase to PRP format
     */
    async transformToPhaseFormat(
        existingPhase: any,
        config: Partial<PRPPhaseConfig> = {}
    ): Promise<any> {
        console.log(`🔄 Transforming phase to PRP format`);
        
        const startTime = Date.now();
        const changes: TransformationChange[] = [];
        
        try {
            // Parse existing phase structure
            const parsedPhase = this.parsePhaseStructure(existingPhase);
            
            // Transform core sections
            const transformedSections = await this.transformSections(
                parsedPhase,
                changes
            );

            // Add PRP-specific enhancements
            const enhancedPhase = await this.addPRPEnhancements(
                transformedSections,
                config,
                changes
            );

            // Validate transformed phase
            const validationResult = await this.validateTransformation(
                enhancedPhase,
                existingPhase
            );

            const processingTime = Date.now() - startTime;
            console.log(`✅ Phase transformation completed in ${processingTime}ms`);

            return {
                ...enhancedPhase,
                metadata: {
                    ...enhancedPhase.metadata,
                    transformedAt: new Date().toISOString(),
                    transformationTime: processingTime,
                    changes: changes.length,
                    validationPassed: validationResult.passed
                }
            };

        } catch (error) {
            console.error(`❌ Phase transformation failed: ${error}`);
            throw error;
        }
    }

    /**
     * Transform phase sections with enhanced structure
     */
    private async transformSections(
        parsedPhase: any,
        changes: TransformationChange[]
    ): Promise<any> {
        const transformedSections: any = {};

        // Transform each section using appropriate processor
        for (const [sectionName, sectionContent] of Object.entries(parsedPhase)) {
            const processor = this.sectionProcessors.get(sectionName) || 
                            this.sectionProcessors.get('default');
            
            if (processor) {
                const transformed = await processor(sectionContent as string);
                transformedSections[sectionName] = transformed;
                
                changes.push({
                    type: 'modify',
                    section: sectionName,
                    description: `Enhanced ${sectionName} section with PRP structure`,
                    impact: 'medium'
                });
            } else {
                transformedSections[sectionName] = sectionContent;
            }
        }

        return transformedSections;
    }

    /**
     * Add PRP-specific enhancements
     */
    private async addPRPEnhancements(
        transformedSections: any,
        config: Partial<PRPPhaseConfig>,
        changes: TransformationChange[]
    ): Promise<any> {
        const enhanced = { ...transformedSections };

        // Add objective section if not present
        if (!enhanced.objective) {
            enhanced.objective = this.generateObjectiveSection(enhanced);
            changes.push({
                type: 'add',
                section: 'objective',
                description: 'Added clear objective section',
                impact: 'high'
            });
        }

        // Add success criteria
        if (!enhanced.successCriteria) {
            enhanced.successCriteria = this.generateSuccessCriteria(enhanced);
            changes.push({
                type: 'add',
                section: 'successCriteria',
                description: 'Added measurable success criteria',
                impact: 'high'
            });
        }

        // Add context requirements
        if (!enhanced.contextRequirements) {
            enhanced.contextRequirements = this.generateContextRequirements(enhanced);
            changes.push({
                type: 'add',
                section: 'contextRequirements',
                description: 'Added context requirements',
                impact: 'medium'
            });
        }

        // Add validation checkpoints
        if (!enhanced.validationCheckpoints) {
            enhanced.validationCheckpoints = this.generateValidationCheckpoints(enhanced);
            changes.push({
                type: 'add',
                section: 'validationCheckpoints',
                description: 'Added validation checkpoints',
                impact: 'medium'
            });
        }

        // Add example patterns
        if (!enhanced.examplePatterns) {
            enhanced.examplePatterns = this.generateExamplePatterns(enhanced);
            changes.push({
                type: 'add',
                section: 'examplePatterns',
                description: 'Added example patterns',
                impact: 'medium'
            });
        }

        return enhanced;
    }

    /**
     * Initialize section processors
     */
    private initializeSectionProcessors(): void {
        // Description processor
        this.sectionProcessors.set('description', (content: string) => {
            return {
                original: content,
                enhanced: this.enhanceDescription(content),
                clarity: this.assessClarity(content),
                completeness: this.assessCompleteness(content),
                actionability: this.assessActionability(content)
            };
        });

        // Requirements processor
        this.sectionProcessors.set('requirements', (content: string) => {
            return {
                original: content,
                structured: this.structureRequirements(content),
                priority: this.prioritizeRequirements(content),
                validation: this.addRequirementValidation(content)
            };
        });

        // Implementation processor
        this.sectionProcessors.set('implementation', (content: string) => {
            return {
                original: content,
                steps: this.extractImplementationSteps(content),
                dependencies: this.identifyDependencies(content),
                validation: this.addImplementationValidation(content)
            };
        });

        // Default processor
        this.sectionProcessors.set('default', (content: string) => {
            return {
                original: content,
                enhanced: this.enhanceGenericContent(content)
            };
        });
    }

    /**
     * Parse phase structure from various formats
     */
    private parsePhaseStructure(phase: any): any {
        if (typeof phase === 'string') {
            // Parse markdown or text format
            return this.parseMarkdownPhase(phase);
        } else if (typeof phase === 'object') {
            // Already structured object
            return phase;
        } else {
            throw new Error('Unsupported phase format');
        }
    }

    /**
     * Parse markdown phase format
     */
    private parseMarkdownPhase(content: string): any {
        const sections: any = {};
        const lines = content.split('\n');
        let currentSection = '';
        let currentContent: string[] = [];

        for (const line of lines) {
            const headerMatch = line.match(/^#+\s+(.+)$/);
            if (headerMatch) {
                // Save previous section
                if (currentSection) {
                    sections[currentSection] = currentContent.join('\n');
                }
                
                // Start new section
                currentSection = headerMatch[1].toLowerCase().replace(/\s+/g, '_');
                currentContent = [];
            } else {
                currentContent.push(line);
            }
        }

        // Save last section
        if (currentSection) {
            sections[currentSection] = currentContent.join('\n');
        }

        return sections;
    }

    /**
     * Validate transformation quality
     */
    private async validateTransformation(
        transformedPhase: any,
        originalPhase: any
    ): Promise<{ passed: boolean; score: number; issues: string[] }> {
        const issues: string[] = [];
        let score = 100;

        // Check required sections
        const requiredSections = ['objective', 'successCriteria', 'contextRequirements'];
        for (const section of requiredSections) {
            if (!transformedPhase[section]) {
                issues.push(`Missing required section: ${section}`);
                score -= 20;
            }
        }

        // Check enhancement quality
        if (!transformedPhase.metadata?.transformationTime) {
            issues.push('Missing transformation metadata');
            score -= 10;
        }

        // Check content preservation
        const contentPreserved = this.validateContentPreservation(
            transformedPhase,
            originalPhase
        );
        if (!contentPreserved) {
            issues.push('Original content not properly preserved');
            score -= 15;
        }

        return {
            passed: score >= 70,
            score: Math.max(0, score),
            issues
        };
    }

    // Enhancement methods
    private enhanceDescription(content: string): string {
        // Add structure and clarity to description
        const enhanced = content
            .replace(/\n\n/g, '\n\n**Key Point:** ')
            .replace(/^/, '**Overview:** ');
        
        return enhanced;
    }

    private assessClarity(content: string): number {
        // Simple clarity assessment based on content structure
        const sentences = content.split(/[.!?]+/).filter(s => s.trim());
        const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
        
        // Shorter sentences generally indicate better clarity
        return Math.max(0, 100 - (avgSentenceLength - 50));
    }

    private assessCompleteness(content: string): number {
        // Assess completeness based on content length and structure
        const words = content.split(/\s+/).length;
        const hasStructure = /\n\n/.test(content);
        
        let score = Math.min(100, words * 2);
        if (hasStructure) score += 20;
        
        return Math.min(100, score);
    }

    private assessActionability(content: string): number {
        // Assess actionability based on action words and specificity
        const actionWords = ['implement', 'create', 'build', 'design', 'develop', 'test'];
        const actionCount = actionWords.reduce((count, word) => {
            return count + (content.toLowerCase().split(word).length - 1);
        }, 0);
        
        return Math.min(100, actionCount * 25);
    }

    private structureRequirements(content: string): any {
        // Structure requirements into categories
        const lines = content.split('\n').filter(line => line.trim());
        const functional: string[] = [];
        const nonFunctional: string[] = [];
        const technical: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.includes('performance') || trimmed.includes('security')) {
                nonFunctional.push(trimmed);
            } else if (trimmed.includes('API') || trimmed.includes('database')) {
                technical.push(trimmed);
            } else {
                functional.push(trimmed);
            }
        }

        return { functional, nonFunctional, technical };
    }

    private prioritizeRequirements(content: string): any {
        // Basic priority assignment
        const lines = content.split('\n').filter(line => line.trim());
        
        return lines.map((line, index) => ({
            requirement: line.trim(),
            priority: index < 3 ? 'high' : index < 7 ? 'medium' : 'low',
            order: index + 1
        }));
    }

    private addRequirementValidation(content: string): any {
        return {
            completeness: this.assessCompleteness(content),
            testability: this.assessTestability(content),
            clarity: this.assessClarity(content)
        };
    }

    private assessTestability(content: string): number {
        // Assess how testable the requirements are
        const testableWords = ['verify', 'test', 'validate', 'measure', 'check'];
        const testableCount = testableWords.reduce((count, word) => {
            return count + (content.toLowerCase().split(word).length - 1);
        }, 0);
        
        return Math.min(100, testableCount * 20);
    }

    private extractImplementationSteps(content: string): any[] {
        // Extract implementation steps from content
        const lines = content.split('\n').filter(line => line.trim());
        const steps: any[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.match(/^\d+\./) || line.match(/^[-*]\s/)) {
                steps.push({
                    order: steps.length + 1,
                    description: line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, ''),
                    estimated_time: this.estimateStepTime(line),
                    dependencies: this.identifyStepDependencies(line),
                    validation: this.createStepValidation(line)
                });
            }
        }

        return steps;
    }

    private identifyDependencies(content: string): string[] {
        // Identify dependencies from content
        const dependencyPatterns = [
            /requires?\s+([A-Za-z0-9\s]+)/gi,
            /depends?\s+on\s+([A-Za-z0-9\s]+)/gi,
            /needs?\s+([A-Za-z0-9\s]+)/gi
        ];

        const dependencies: string[] = [];
        for (const pattern of dependencyPatterns) {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                dependencies.push(match[1].trim());
            }
        }

        return [...new Set(dependencies)];
    }

    private addImplementationValidation(content: string): any {
        return {
            feasibility: this.assessFeasibility(content),
            completeness: this.assessCompleteness(content),
            testability: this.assessTestability(content)
        };
    }

    private assessFeasibility(content: string): number {
        // Basic feasibility assessment
        const complexityWords = ['complex', 'difficult', 'challenging', 'advanced'];
        const complexityCount = complexityWords.reduce((count, word) => {
            return count + (content.toLowerCase().split(word).length - 1);
        }, 0);
        
        return Math.max(0, 100 - (complexityCount * 20));
    }

    private enhanceGenericContent(content: string): string {
        // Generic content enhancement
        return content
            .replace(/\n\n/g, '\n\n> ')
            .replace(/^/, '**Content:** ');
    }

    // Generator methods
    private generateObjectiveSection(phase: any): any {
        return {
            primary: phase.description || 'Complete phase objectives',
            secondary: ['Maintain quality standards', 'Follow best practices'],
            success_metrics: ['Completion rate', 'Quality score', 'Time to completion'],
            acceptance_criteria: ['All requirements met', 'Validation passed', 'Documentation complete']
        };
    }

    private generateSuccessCriteria(phase: any): any {
        return {
            completion_criteria: [
                'All tasks completed successfully',
                'Quality validation passed',
                'Documentation updated'
            ],
            quality_metrics: {
                code_coverage: 95,
                test_pass_rate: 100,
                documentation_completeness: 90
            },
            performance_targets: {
                response_time: '< 200ms',
                throughput: '> 1000 req/s',
                error_rate: '< 0.1%'
            }
        };
    }

    private generateContextRequirements(phase: any): any {
        return {
            project_context: ['Project scope', 'Technology stack', 'Team structure'],
            phase_context: ['Previous phase outputs', 'Current phase inputs', 'Next phase requirements'],
            external_context: ['Market conditions', 'User feedback', 'Technical constraints'],
            validation_context: ['Quality standards', 'Performance benchmarks', 'Security requirements']
        };
    }

    private generateValidationCheckpoints(phase: any): any {
        return {
            pre_execution: ['Prerequisites validated', 'Context loaded', 'Resources available'],
            mid_execution: ['Progress tracked', 'Quality maintained', 'Issues identified'],
            post_execution: ['Objectives met', 'Quality validated', 'Documentation complete'],
            continuous: ['Performance monitored', 'Errors tracked', 'Feedback collected']
        };
    }

    private generateExamplePatterns(phase: any): any {
        return {
            input_patterns: ['Standard input format', 'Edge case handling', 'Error conditions'],
            output_patterns: ['Success responses', 'Error handling', 'Progress updates'],
            workflow_patterns: ['Happy path', 'Error recovery', 'Performance optimization'],
            integration_patterns: ['API usage', 'Database operations', 'External services']
        };
    }

    private validateContentPreservation(transformed: any, original: any): boolean {
        // Basic content preservation check
        const originalText = JSON.stringify(original).toLowerCase();
        const transformedText = JSON.stringify(transformed).toLowerCase();
        
        // Check if key content is preserved
        const keyWords = originalText.split(/\s+/).filter(word => word.length > 3);
        const preservedWords = keyWords.filter(word => transformedText.includes(word));
        
        return preservedWords.length / keyWords.length > 0.8;
    }

    // Helper methods
    private estimateStepTime(step: string): number {
        // Simple time estimation based on step complexity
        const complexityWords = ['complex', 'advanced', 'detailed', 'comprehensive'];
        const hasComplexity = complexityWords.some(word => step.toLowerCase().includes(word));
        
        return hasComplexity ? 60 : 30; // minutes
    }

    private identifyStepDependencies(step: string): string[] {
        // Identify dependencies for individual steps
        const depPattern = /after\s+([A-Za-z0-9\s]+)/gi;
        const matches = step.matchAll(depPattern);
        const dependencies: string[] = [];
        
        for (const match of matches) {
            dependencies.push(match[1].trim());
        }
        
        return dependencies;
    }

    private createStepValidation(step: string): any {
        return {
            required: true,
            validation_type: 'completion',
            success_criteria: 'Step completed successfully',
            failure_actions: ['Retry', 'Skip', 'Abort']
        };
    }
}