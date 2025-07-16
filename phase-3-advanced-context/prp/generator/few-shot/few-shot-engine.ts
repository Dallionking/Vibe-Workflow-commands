/**
 * Few-shot Learning Engine
 * Phase 3: Advanced Context Features - Tier 2.2
 * 
 * Main orchestrator for intelligent few-shot learning with context-aware 
 * example selection, adaptation, and learning feedback integration.
 */

import {
    FewShotLearningConfig,
    FewShotExample,
    ExampleRepository,
    ExampleSelection,
    ExampleMatch,
    SelectionCriteria,
    LearningFeedback,
    ExampleContext,
    ExampleQuality,
    ExampleMetadata
} from './interfaces';

import { ReasoningContext } from '../chain-of-thought/reasoning-chain';
import { SimilarityEngine } from './similarity-engine';
import { IntelligentExampleMatcher } from './example-matcher';

export class FewShotLearningEngine {
    private config: FewShotLearningConfig;
    private repository: ExampleRepository;
    private similarityEngine: SimilarityEngine;
    private matcher: IntelligentExampleMatcher;
    private learningHistory: LearningFeedback[] = [];
    private adaptationCache: Map<string, FewShotExample> = new Map();
    
    constructor(config: FewShotLearningConfig) {
        this.config = config;
        this.repository = this.initializeRepository();
        this.similarityEngine = new SimilarityEngine();
        this.matcher = new IntelligentExampleMatcher(this.repository);
    }
    
    /**
     * Select examples for a given context and input
     */
    async selectExamples(
        context: ReasoningContext,
        input: string,
        maxExamples?: number
    ): Promise<ExampleSelection> {
        console.log(`🎯 Selecting examples for context: ${context.domain} (complexity: ${context.complexity})`);
        
        const criteria: SelectionCriteria = this.createSelectionCriteria(
            context,
            maxExamples || this.config.maxExamples
        );
        
        // Find similar examples
        const similarExamples = await this.matcher.findSimilarExamples(
            context,
            input,
            criteria
        );
        
        // Rank examples
        const rankedExamples = this.matcher.rankExamples(similarExamples, criteria);
        
        // Select diverse set
        const selection = this.matcher.selectDiverseSet(
            rankedExamples,
            criteria.maxExamples,
            criteria.diversityWeight
        );
        
        // Apply adaptations if enabled
        if (criteria.enableAdaptation) {
            selection.selectedExamples = await this.adaptSelectedExamples(
                selection.selectedExamples,
                context,
                input
            );
        }
        
        // Update usage statistics
        this.updateUsageStatistics(selection.selectedExamples);
        
        console.log(`✅ Selected ${selection.selectedExamples.length} examples with diversity score: ${selection.diversityScore.toFixed(2)}`);
        return selection;
    }
    
    /**
     * Add new example to repository
     */
    async addExample(example: FewShotExample): Promise<void> {
        console.log(`📝 Adding new example: ${example.id}`);
        
        // Validate example
        const validation = this.validateExample(example);
        if (!validation.isValid) {
            throw new Error(`Invalid example: ${validation.issues.join(', ')}`);
        }
        
        // Store in repository
        this.repository.examples.set(example.id, example);
        
        // Update indices
        this.updateRepositoryIndices(example);
        
        // Update quality metrics
        this.repository.qualityMetrics.set(example.id, example.quality);
        
        // Initialize usage stats
        this.repository.usageStats.set(example.id, {
            count: 0,
            lastUsed: new Date(),
            successRate: 0
        });
        
        console.log(`✅ Example ${example.id} added to repository`);
    }
    
    /**
     * Update example quality based on feedback
     */
    async updateExampleQuality(
        exampleId: string,
        feedback: LearningFeedback
    ): Promise<void> {
        console.log(`📊 Updating quality for example: ${exampleId}`);
        
        const example = this.repository.examples.get(exampleId);
        if (!example) {
            throw new Error(`Example ${exampleId} not found`);
        }
        
        // Update quality metrics based on feedback
        const currentQuality = example.quality;
        const updatedQuality = this.computeUpdatedQuality(currentQuality, feedback);
        
        example.quality = updatedQuality;
        this.repository.qualityMetrics.set(exampleId, updatedQuality);
        
        // Update usage statistics
        const usageStats = this.repository.usageStats.get(exampleId);
        if (usageStats) {
            const successValue = feedback.outcome === 'success' ? 1 : 
                                feedback.outcome === 'partial' ? 0.5 : 0;
            usageStats.successRate = (usageStats.successRate * 0.9 + successValue * 0.1);
            usageStats.lastUsed = new Date();
        }
        
        // Store learning feedback
        this.learningHistory.push(feedback);
        
        // Learn from feedback if enabled
        if (this.config.learningEnabled) {
            await this.learnFromFeedback(feedback);
        }
        
        console.log(`✅ Quality updated for example ${exampleId}: ${updatedQuality.overall.toFixed(2)}`);
    }
    
    /**
     * Generate synthetic examples for underrepresented areas
     */
    async generateSyntheticExamples(
        domain: string,
        complexity: number,
        count: number = 5
    ): Promise<FewShotExample[]> {
        console.log(`🔬 Generating ${count} synthetic examples for ${domain} (complexity: ${complexity})`);
        
        const syntheticExamples: FewShotExample[] = [];
        
        // Find template examples from the domain
        const templateExamples = this.findTemplateExamples(domain, complexity);
        
        for (let i = 0; i < count; i++) {
            const template = templateExamples[i % templateExamples.length];
            const synthetic = await this.generateSyntheticExample(template, domain, complexity);
            syntheticExamples.push(synthetic);
        }
        
        // Validate generated examples
        const validExamples = syntheticExamples.filter(example => {
            const validation = this.validateExample(example);
            return validation.isValid;
        });
        
        console.log(`✅ Generated ${validExamples.length} valid synthetic examples`);
        return validExamples;
    }
    
    /**
     * Analyze repository gaps and recommend improvements
     */
    analyzeRepositoryGaps(): {
        underrepresentedDomains: string[];
        missingComplexityLevels: { domain: string; level: number }[];
        lowQualityExamples: { id: string; quality: number }[];
        recommendations: string[];
    } {
        console.log('📈 Analyzing repository gaps');
        
        const domainCounts = new Map<string, number>();
        const complexityDistribution = new Map<string, Map<string, number>>();
        const lowQualityExamples: { id: string; quality: number }[] = [];
        
        // Analyze current distribution
        for (const [id, example] of this.repository.examples) {
            // Domain counts
            domainCounts.set(example.context.domain, 
                (domainCounts.get(example.context.domain) || 0) + 1);
            
            // Complexity distribution by domain
            if (!complexityDistribution.has(example.context.domain)) {
                complexityDistribution.set(example.context.domain, new Map());
            }
            const complexityLevel = this.getComplexityLevel(example.context.complexity);
            const domainComplexity = complexityDistribution.get(example.context.domain)!;
            domainComplexity.set(complexityLevel, (domainComplexity.get(complexityLevel) || 0) + 1);
            
            // Quality analysis
            if (example.quality.overall < 0.6) {
                lowQualityExamples.push({ id, quality: example.quality.overall });
            }
        }
        
        // Identify gaps
        const allDomains = Array.from(domainCounts.keys());
        const averageCount = Array.from(domainCounts.values()).reduce((a, b) => a + b, 0) / allDomains.length;
        const underrepresentedDomains = allDomains.filter(domain => 
            domainCounts.get(domain)! < averageCount * 0.5
        );
        
        const complexityLevels = ['low', 'medium', 'high'];
        const missingComplexityLevels: { domain: string; level: number }[] = [];
        
        for (const [domain, complexity] of complexityDistribution) {
            complexityLevels.forEach((level, index) => {
                if (!complexity.has(level)) {
                    missingComplexityLevels.push({ domain, level: (index + 1) * 0.33 });
                }
            });
        }
        
        // Generate recommendations
        const recommendations = this.generateRepositoryRecommendations(
            underrepresentedDomains,
            missingComplexityLevels,
            lowQualityExamples
        );
        
        return {
            underrepresentedDomains,
            missingComplexityLevels,
            lowQualityExamples,
            recommendations
        };
    }
    
    /**
     * Get learning analytics
     */
    getLearningAnalytics(): {
        totalExamples: number;
        qualityDistribution: { excellent: number; good: number; fair: number; poor: number };
        domainCoverage: Map<string, number>;
        usagePatterns: { mostUsed: string[]; leastUsed: string[] };
        learningTrends: { improving: number; declining: number; stable: number };
    } {
        const totalExamples = this.repository.examples.size;
        const qualityDistribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
        const domainCoverage = new Map<string, number>();
        
        // Analyze quality distribution
        for (const [id, example] of this.repository.examples) {
            const quality = example.quality.overall;
            if (quality >= 0.9) qualityDistribution.excellent++;
            else if (quality >= 0.7) qualityDistribution.good++;
            else if (quality >= 0.5) qualityDistribution.fair++;
            else qualityDistribution.poor++;
            
            domainCoverage.set(example.context.domain, 
                (domainCoverage.get(example.context.domain) || 0) + 1);
        }
        
        // Analyze usage patterns
        const usageEntries = Array.from(this.repository.usageStats.entries())
            .sort((a, b) => b[1].count - a[1].count);
        
        const usagePatterns = {
            mostUsed: usageEntries.slice(0, 5).map(([id]) => id),
            leastUsed: usageEntries.slice(-5).map(([id]) => id).reverse()
        };
        
        // Analyze learning trends
        const learningTrends = this.analyzeLearningTrends();
        
        return {
            totalExamples,
            qualityDistribution,
            domainCoverage,
            usagePatterns,
            learningTrends
        };
    }
    
    // Private helper methods
    private initializeRepository(): ExampleRepository {
        return {
            examples: new Map(),
            indices: {
                byDomain: new Map(),
                byCategory: new Map(),
                byComplexity: new Map(),
                byTags: new Map()
            },
            qualityMetrics: new Map(),
            usageStats: new Map()
        };
    }
    
    private createSelectionCriteria(
        context: ReasoningContext,
        maxExamples: number
    ): SelectionCriteria {
        return {
            maxExamples,
            minSimilarity: this.config.similarityThreshold,
            qualityThreshold: this.config.qualityThreshold,
            diversityWeight: this.config.diversityRequirement,
            qualityWeight: this.config.qualityThreshold,
            recencyWeight: 0.1,
            domainRelevance: context.domain === 'general' ? 0.5 : 0.8,
            complexityMatch: 0.3,
            enableAdaptation: this.config.enableContextualAdaptation
        };
    }
    
    private async adaptSelectedExamples(
        examples: ExampleMatch[],
        context: ReasoningContext,
        input: string
    ): Promise<ExampleMatch[]> {
        const adaptedExamples: ExampleMatch[] = [];
        
        for (const match of examples) {
            const cacheKey = `${match.example.id}_${context.domain}_${context.complexity}`;
            
            let adaptedExample = this.adaptationCache.get(cacheKey);
            if (!adaptedExample) {
                adaptedExample = await this.adaptExample(match.example, context);
                this.adaptationCache.set(cacheKey, adaptedExample);
            }
            
            adaptedExamples.push({
                ...match,
                example: adaptedExample,
                adaptations: match.adaptations || []
            });
        }
        
        return adaptedExamples;
    }
    
    private async adaptExample(
        example: FewShotExample,
        targetContext: ReasoningContext
    ): Promise<FewShotExample> {
        // Create adapted example
        const adapted: FewShotExample = {
            ...example,
            id: `${example.id}_adapted_${Date.now()}`,
            context: this.adaptContext(example.context, targetContext),
            input: this.adaptInput(example.input, targetContext),
            output: this.adaptOutput(example.output, targetContext),
            reasoning: this.adaptReasoning(example.reasoning, targetContext),
            metadata: {
                ...example.metadata,
                source: `adapted_from_${example.id}`,
                createdAt: new Date()
            }
        };
        
        return adapted;
    }
    
    private adaptContext(originalContext: ExampleContext, targetContext: ReasoningContext): ExampleContext {
        return {
            domain: targetContext.domain,
            complexity: targetContext.complexity,
            constraints: [...originalContext.constraints, ...targetContext.constraints],
            techniques: originalContext.techniques,
            patterns: originalContext.patterns,
            objectives: originalContext.objectives,
            resources: [...originalContext.resources, ...(targetContext.metadata.resources || [])]
        };
    }
    
    private adaptInput(originalInput: string, targetContext: ReasoningContext): string {
        // Simple domain-based adaptation
        if (targetContext.domain !== 'general') {
            return originalInput.replace(/\b(problem|challenge|task)\b/gi, 
                `${targetContext.domain} $1`);
        }
        return originalInput;
    }
    
    private adaptOutput(originalOutput: string, targetContext: ReasoningContext): string {
        // Complexity-based adaptation
        if (targetContext.complexity > 0.7) {
            return `${originalOutput}\n\nAdditional considerations for high complexity: Consider multiple solution paths and validate assumptions.`;
        } else if (targetContext.complexity < 0.3) {
            return originalOutput.split('\n')[0]; // Simplify for low complexity
        }
        return originalOutput;
    }
    
    private adaptReasoning(originalReasoning: string[], targetContext: ReasoningContext): string[] {
        const adapted = [...originalReasoning];
        
        // Add domain-specific reasoning steps
        if (targetContext.domain !== 'general') {
            adapted.unshift(`Consider ${targetContext.domain}-specific factors and constraints`);
        }
        
        // Add complexity-appropriate steps
        if (targetContext.complexity > 0.7) {
            adapted.push('Validate solution robustness and consider edge cases');
        }
        
        return adapted;
    }
    
    private updateUsageStatistics(selectedExamples: ExampleMatch[]): void {
        for (const match of selectedExamples) {
            const stats = this.repository.usageStats.get(match.example.id);
            if (stats) {
                stats.count++;
                stats.lastUsed = new Date();
            }
        }
    }
    
    private validateExample(example: FewShotExample): { isValid: boolean; issues: string[] } {
        const issues: string[] = [];
        
        if (!example.id) issues.push('Missing example ID');
        if (!example.input || example.input.length < 10) issues.push('Input too short or missing');
        if (!example.output || example.output.length < 10) issues.push('Output too short or missing');
        if (!example.reasoning || example.reasoning.length === 0) issues.push('Missing reasoning steps');
        if (!example.context.domain) issues.push('Missing domain');
        if (example.context.complexity < 0 || example.context.complexity > 1) {
            issues.push('Invalid complexity value');
        }
        
        return { isValid: issues.length === 0, issues };
    }
    
    private updateRepositoryIndices(example: FewShotExample): void {
        // Update domain index
        if (!this.repository.indices.byDomain.has(example.context.domain)) {
            this.repository.indices.byDomain.set(example.context.domain, new Set());
        }
        this.repository.indices.byDomain.get(example.context.domain)!.add(example.id);
        
        // Update category index
        if (!this.repository.indices.byCategory.has(example.category)) {
            this.repository.indices.byCategory.set(example.category, new Set());
        }
        this.repository.indices.byCategory.get(example.category)!.add(example.id);
        
        // Update complexity index
        const complexityLevel = this.getComplexityLevel(example.context.complexity);
        if (!this.repository.indices.byComplexity.has(complexityLevel)) {
            this.repository.indices.byComplexity.set(complexityLevel, new Set());
        }
        this.repository.indices.byComplexity.get(complexityLevel)!.add(example.id);
        
        // Update tags index
        example.tags.forEach(tag => {
            if (!this.repository.indices.byTags.has(tag)) {
                this.repository.indices.byTags.set(tag, new Set());
            }
            this.repository.indices.byTags.get(tag)!.add(example.id);
        });
    }
    
    private computeUpdatedQuality(
        currentQuality: ExampleQuality,
        feedback: LearningFeedback
    ): ExampleQuality {
        const effectivenessImpact = feedback.effectiveness;
        const outcomeImpact = feedback.outcome === 'success' ? 0.1 : 
                             feedback.outcome === 'partial' ? 0.05 : -0.1;
        
        const updateFactor = 0.1; // Learning rate
        
        return {
            clarity: Math.max(0, Math.min(1, currentQuality.clarity + outcomeImpact * updateFactor)),
            completeness: Math.max(0, Math.min(1, currentQuality.completeness + outcomeImpact * updateFactor)),
            accuracy: Math.max(0, Math.min(1, currentQuality.accuracy + outcomeImpact * updateFactor)),
            relevance: Math.max(0, Math.min(1, currentQuality.relevance + effectivenessImpact * updateFactor)),
            effectiveness: Math.max(0, Math.min(1, currentQuality.effectiveness + effectivenessImpact * updateFactor)),
            overall: Math.max(0, Math.min(1, currentQuality.overall + outcomeImpact * updateFactor))
        };
    }
    
    private async learnFromFeedback(feedback: LearningFeedback): Promise<void> {
        // Implement learning algorithm to improve selection and adaptation
        // This is a simplified version - could be enhanced with ML algorithms
        
        if (feedback.outcome === 'failure') {
            // Analyze what went wrong and adjust selection criteria
            console.log(`🔍 Learning from failure in example ${feedback.exampleId}`);
            
            // Could implement more sophisticated learning here
            feedback.issues.forEach(issue => {
                console.log(`  Issue: ${issue}`);
            });
        }
    }
    
    private findTemplateExamples(domain: string, complexity: number): FewShotExample[] {
        const domainExamples = Array.from(this.repository.indices.byDomain.get(domain) || [])
            .map(id => this.repository.examples.get(id)!)
            .filter(Boolean)
            .filter(example => Math.abs(example.context.complexity - complexity) < 0.3)
            .sort((a, b) => b.quality.overall - a.quality.overall);
        
        return domainExamples.slice(0, 3); // Top 3 quality examples as templates
    }
    
    private async generateSyntheticExample(
        template: FewShotExample,
        domain: string,
        complexity: number
    ): Promise<FewShotExample> {
        // Generate synthetic example based on template
        const synthetic: FewShotExample = {
            id: `synthetic_${domain}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            context: {
                ...template.context,
                domain,
                complexity
            },
            input: this.generateSyntheticInput(template.input, domain),
            output: this.generateSyntheticOutput(template.output, domain),
            reasoning: this.generateSyntheticReasoning(template.reasoning, domain),
            metadata: {
                createdAt: new Date(),
                usageCount: 0,
                successRate: 0,
                averageRating: 0.7,
                source: 'synthetic',
                verified: false,
                learningObjectives: template.metadata.learningObjectives
            },
            quality: {
                clarity: 0.7,
                completeness: 0.7,
                accuracy: 0.7,
                relevance: 0.8,
                effectiveness: 0.7,
                overall: 0.72
            },
            tags: [...template.tags, 'synthetic'],
            category: template.category,
            difficulty: template.difficulty
        };
        
        return synthetic;
    }
    
    private generateSyntheticInput(templateInput: string, domain: string): string {
        // Simple synthetic input generation
        return templateInput.replace(/\b(example|instance|case)\b/gi, `${domain} example`);
    }
    
    private generateSyntheticOutput(templateOutput: string, domain: string): string {
        // Simple synthetic output generation
        return templateOutput.replace(/\b(solution|result|outcome)\b/gi, `${domain} solution`);
    }
    
    private generateSyntheticReasoning(templateReasoning: string[], domain: string): string[] {
        return templateReasoning.map(step => 
            step.replace(/\b(analysis|approach|method)\b/gi, `${domain} $1`)
        );
    }
    
    private getComplexityLevel(complexity: number): string {
        if (complexity < 0.33) return 'low';
        if (complexity < 0.67) return 'medium';
        return 'high';
    }
    
    private generateRepositoryRecommendations(
        underrepresentedDomains: string[],
        missingComplexityLevels: { domain: string; level: number }[],
        lowQualityExamples: { id: string; quality: number }[]
    ): string[] {
        const recommendations: string[] = [];
        
        if (underrepresentedDomains.length > 0) {
            recommendations.push(
                `Add more examples for underrepresented domains: ${underrepresentedDomains.join(', ')}`
            );
        }
        
        if (missingComplexityLevels.length > 0) {
            recommendations.push(
                `Fill complexity gaps in domains: ${missingComplexityLevels.map(m => m.domain).join(', ')}`
            );
        }
        
        if (lowQualityExamples.length > 0) {
            recommendations.push(
                `Improve or replace ${lowQualityExamples.length} low-quality examples`
            );
        }
        
        if (this.repository.examples.size < 50) {
            recommendations.push('Consider adding more examples to improve diversity and coverage');
        }
        
        return recommendations;
    }
    
    private analyzeLearningTrends(): { improving: number; declining: number; stable: number } {
        const recentFeedback = this.learningHistory.slice(-50);
        let improving = 0;
        let declining = 0;
        let stable = 0;
        
        // Analyze trends in recent feedback
        recentFeedback.forEach(feedback => {
            if (feedback.effectiveness > 0.7) improving++;
            else if (feedback.effectiveness < 0.4) declining++;
            else stable++;
        });
        
        return { improving, declining, stable };
    }
    
    /**
     * Get engine statistics
     */
    getEngineStatistics(): {
        repositorySize: number;
        cacheSize: number;
        learningHistorySize: number;
        averageQuality: number;
        domainCoverage: number;
    } {
        const averageQuality = Array.from(this.repository.examples.values())
            .reduce((sum, example) => sum + example.quality.overall, 0) / this.repository.examples.size || 0;
        
        return {
            repositorySize: this.repository.examples.size,
            cacheSize: this.adaptationCache.size,
            learningHistorySize: this.learningHistory.length,
            averageQuality,
            domainCoverage: this.repository.indices.byDomain.size
        };
    }
    
    /**
     * Clear caches and reset learning history
     */
    clearCaches(): void {
        this.adaptationCache.clear();
        this.learningHistory = [];
        this.similarityEngine.clearCaches();
        this.matcher.clearHistory();
        console.log('🗑️  Few-shot learning engine caches cleared');
    }
}