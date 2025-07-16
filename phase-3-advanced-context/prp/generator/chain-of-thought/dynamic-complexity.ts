/**
 * Dynamic Complexity Adjustment System
 * Phase 3: Advanced Context Features - Tier 2.1
 * 
 * Implements adaptive complexity management for reasoning chains,
 * automatically adjusting reasoning depth and approach based on
 * real-time assessment of problem complexity and progress.
 */

import { ReasoningStep } from '../interfaces';
import { ReasoningContext } from './reasoning-chain';

export type ComplexityLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'extreme';

export interface ComplexityMetrics {
    structural: number;
    logical: number;
    domain: number;
    temporal: number;
    cognitive: number;
    overall: number;
}

export interface ComplexityAdjustment {
    id: string;
    timestamp: Date;
    fromLevel: ComplexityLevel;
    toLevel: ComplexityLevel;
    reason: string;
    adjustmentType: 'increase' | 'decrease' | 'stabilize';
    impact: ComplexityImpact;
    confidence: number;
}

export interface ComplexityImpact {
    stepCountChange: number;
    validationChange: number;
    resourceChange: number;
    timeChange: number;
    qualityChange: number;
}

export interface ComplexityPattern {
    pattern: string;
    indicators: string[];
    complexityIncrease: number;
    adjustmentStrategy: string;
    examples: string[];
}

export interface DynamicComplexityConfig {
    enableRealTimeAdjustment: boolean;
    enablePredictiveAdjustment: boolean;
    enableLearningFromHistory: boolean;
    adjustmentThreshold: number;
    maxComplexityLevel: ComplexityLevel;
    stabilizationPeriod: number;
    learningRate: number;
}

export class DynamicComplexityEngine {
    private config: DynamicComplexityConfig;
    private currentComplexity: ComplexityMetrics;
    private complexityHistory: ComplexityAdjustment[];
    private complexityPatterns: Map<string, ComplexityPattern>;
    private learningData: Map<string, number>;
    private stabilizationTimer: number;
    
    constructor(config: DynamicComplexityConfig) {
        this.config = config;
        this.currentComplexity = this.initializeComplexity();
        this.complexityHistory = [];
        this.complexityPatterns = new Map();
        this.learningData = new Map();
        this.stabilizationTimer = 0;
        
        this.initializeComplexityPatterns();
    }
    
    /**
     * Analyze and calculate current complexity metrics
     */
    async analyzeComplexity(
        content: string,
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<ComplexityMetrics> {
        console.log('📊 Analyzing complexity across multiple dimensions...');
        
        // Structural complexity
        const structural = this.calculateStructuralComplexity(content, steps);
        
        // Logical complexity
        const logical = this.calculateLogicalComplexity(content, steps);
        
        // Domain complexity
        const domain = this.calculateDomainComplexity(context);
        
        // Temporal complexity
        const temporal = this.calculateTemporalComplexity(context, steps);
        
        // Cognitive complexity
        const cognitive = this.calculateCognitiveComplexity(content, context, steps);
        
        // Overall complexity (weighted average)
        const overall = this.calculateOverallComplexity(structural, logical, domain, temporal, cognitive);
        
        const metrics: ComplexityMetrics = {
            structural,
            logical,
            domain,
            temporal,
            cognitive,
            overall
        };
        
        console.log(`📈 Complexity analysis complete: ${overall.toFixed(2)} overall`);
        return metrics;
    }
    
    /**
     * Adjust complexity based on current metrics and context
     */
    async adjustComplexity(
        currentMetrics: ComplexityMetrics,
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<ComplexityAdjustment | null> {
        const currentLevel = this.metricsToLevel(currentMetrics.overall);
        const shouldAdjust = await this.shouldAdjustComplexity(currentMetrics, context, steps);
        
        if (!shouldAdjust) {
            this.stabilizationTimer++;
            return null;
        }
        
        const targetLevel = await this.determineTargetComplexity(currentMetrics, context, steps);
        
        if (currentLevel === targetLevel) {
            return null;
        }
        
        const adjustment = await this.createComplexityAdjustment(
            currentLevel,
            targetLevel,
            currentMetrics,
            context,
            steps
        );
        
        // Apply adjustment
        await this.applyComplexityAdjustment(adjustment, context, steps);
        
        // Store in history
        this.complexityHistory.push(adjustment);
        
        // Learn from adjustment if enabled
        if (this.config.enableLearningFromHistory) {
            await this.learnFromAdjustment(adjustment, context);
        }
        
        this.stabilizationTimer = 0;
        console.log(`🔄 Complexity adjusted from ${currentLevel} to ${targetLevel}`);
        
        return adjustment;
    }
    
    /**
     * Predict future complexity based on current trends
     */
    async predictComplexity(
        context: ReasoningContext,
        steps: ReasoningStep[],
        lookaheadSteps: number = 3
    ): Promise<{
        predictedLevel: ComplexityLevel;
        confidence: number;
        factors: string[];
        recommendations: string[];
    }> {
        if (!this.config.enablePredictiveAdjustment) {
            return {
                predictedLevel: 'moderate',
                confidence: 0.5,
                factors: [],
                recommendations: []
            };
        }
        
        console.log(`🔮 Predicting complexity for next ${lookaheadSteps} steps...`);
        
        const factors: string[] = [];
        const recommendations: string[] = [];
        let predictedComplexity = this.currentComplexity.overall;
        
        // Analyze trends
        const recentAdjustments = this.complexityHistory.slice(-5);
        const increasingTrend = recentAdjustments.filter(a => a.adjustmentType === 'increase').length;
        const decreasingTrend = recentAdjustments.filter(a => a.adjustmentType === 'decrease').length;
        
        if (increasingTrend > decreasingTrend) {
            predictedComplexity += 0.1 * increasingTrend;
            factors.push('Increasing complexity trend detected');
            recommendations.push('Prepare for complexity management strategies');
        }
        
        // Analyze step progression
        const stepComplexityTrend = this.analyzeStepComplexityTrend(steps);
        if (stepComplexityTrend > 0.1) {
            predictedComplexity += stepComplexityTrend;
            factors.push('Step complexity increasing');
            recommendations.push('Consider step consolidation or decomposition');
        }
        
        // Analyze domain factors
        if (context.domain !== 'general') {
            const domainComplexity = this.getDomainComplexityFactor(context.domain);
            if (domainComplexity > 0.7) {
                predictedComplexity += 0.1;
                factors.push(`${context.domain} domain complexity`);
                recommendations.push('Apply domain-specific complexity management');
            }
        }
        
        // Analyze constraint impact
        if (context.constraints.length > 3) {
            predictedComplexity += context.constraints.length * 0.02;
            factors.push('Multiple constraints detected');
            recommendations.push('Prioritize constraint handling');
        }
        
        // Calculate confidence
        const confidence = this.calculatePredictionConfidence(recentAdjustments, factors);
        
        return {
            predictedLevel: this.metricsToLevel(Math.min(predictedComplexity, 1.0)),
            confidence,
            factors,
            recommendations
        };
    }
    
    /**
     * Generate complexity-adjusted reasoning steps
     */
    async generateComplexityAdjustedSteps(
        baseSteps: ReasoningStep[],
        targetComplexity: ComplexityLevel,
        context: ReasoningContext
    ): Promise<ReasoningStep[]> {
        const adjustedSteps: ReasoningStep[] = [];
        
        switch (targetComplexity) {
            case 'minimal':
                return this.generateMinimalSteps(baseSteps, context);
            case 'low':
                return this.generateLowComplexitySteps(baseSteps, context);
            case 'moderate':
                return this.generateModerateComplexitySteps(baseSteps, context);
            case 'high':
                return this.generateHighComplexitySteps(baseSteps, context);
            case 'extreme':
                return this.generateExtremeComplexitySteps(baseSteps, context);
            default:
                return baseSteps;
        }
    }
    
    /**
     * Monitor complexity in real-time
     */
    async monitorComplexity(
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<{
        currentLevel: ComplexityLevel;
        trajectory: 'increasing' | 'decreasing' | 'stable';
        alerts: string[];
        recommendations: string[];
    }> {
        const currentLevel = this.metricsToLevel(this.currentComplexity.overall);
        const trajectory = this.analyzeComplexityTrajectory();
        const alerts: string[] = [];
        const recommendations: string[] = [];
        
        // Check for alerts
        if (this.currentComplexity.overall > 0.9) {
            alerts.push('Extreme complexity detected');
            recommendations.push('Consider problem decomposition');
        }
        
        if (this.currentComplexity.cognitive > 0.8) {
            alerts.push('High cognitive load');
            recommendations.push('Add cognitive load management strategies');
        }
        
        if (steps.length > 10 && trajectory === 'increasing') {
            alerts.push('Lengthy reasoning chain with increasing complexity');
            recommendations.push('Consider intermediate synthesis steps');
        }
        
        // Check for optimization opportunities
        if (this.currentComplexity.structural > 0.7 && this.currentComplexity.logical < 0.5) {
            recommendations.push('Optimize structural complexity while maintaining logical rigor');
        }
        
        return {
            currentLevel,
            trajectory,
            alerts,
            recommendations
        };
    }
    
    // Private calculation methods
    private calculateStructuralComplexity(content: string, steps: ReasoningStep[]): number {
        let complexity = 0.3; // Base structural complexity
        
        // Content-based factors
        const wordCount = content.split(/\s+/).length;
        complexity += Math.min(wordCount / 2000, 0.3);
        
        const sentenceCount = content.split(/[.!?]+/).length;
        complexity += Math.min(sentenceCount / 50, 0.2);
        
        // Step-based factors
        complexity += Math.min(steps.length / 20, 0.3);
        
        // Dependency complexity
        const totalDependencies = steps.reduce((sum, s) => sum + s.dependencies.length, 0);
        complexity += Math.min(totalDependencies / 30, 0.2);
        
        return Math.min(complexity, 1.0);
    }
    
    private calculateLogicalComplexity(content: string, steps: ReasoningStep[]): number {
        let complexity = 0.4; // Base logical complexity
        
        // Logical indicators in content
        const logicalIndicators = [
            'therefore', 'because', 'however', 'moreover', 'furthermore',
            'consequently', 'thus', 'hence', 'although', 'unless'
        ];
        
        const logicalTerms = logicalIndicators.filter(term => 
            content.toLowerCase().includes(term)
        );
        
        complexity += Math.min(logicalTerms.length / 10, 0.3);
        
        // Conditional logic
        if (content.includes('if') || content.includes('when')) {
            complexity += 0.1;
        }
        
        // Validation rule complexity
        const validationRules = steps.flatMap(s => s.validationRules);
        const logicalValidation = validationRules.filter(rule => 
            rule.includes('logical') || rule.includes('consistency')
        );
        
        complexity += Math.min(logicalValidation.length / 10, 0.3);
        
        return Math.min(complexity, 1.0);
    }
    
    private calculateDomainComplexity(context: ReasoningContext): number {
        const domainComplexityMap: Record<string, number> = {
            'general': 0.2,
            'mathematics': 0.7,
            'engineering': 0.8,
            'research': 0.6,
            'analysis': 0.5,
            'design': 0.4,
            'implementation': 0.6,
            'optimization': 0.9,
            'architecture': 0.7,
            'system-design': 0.8
        };
        
        return domainComplexityMap[context.domain] || 0.5;
    }
    
    private calculateTemporalComplexity(context: ReasoningContext, steps: ReasoningStep[]): number {
        let complexity = 0.3; // Base temporal complexity
        
        // Constraint-based temporal pressure
        const timeConstraints = context.constraints.filter(c => 
            c.includes('time') || c.includes('deadline') || c.includes('urgent')
        );
        
        complexity += Math.min(timeConstraints.length / 3, 0.3);
        
        // Step sequence complexity
        const maxOrder = Math.max(...steps.map(s => s.order));
        complexity += Math.min(maxOrder / 20, 0.2);
        
        // Dependency temporal complexity
        const dependencyDepth = this.calculateDependencyDepth(steps);
        complexity += Math.min(dependencyDepth / 10, 0.2);
        
        return Math.min(complexity, 1.0);
    }
    
    private calculateCognitiveComplexity(
        content: string,
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): number {
        let complexity = 0.4; // Base cognitive complexity
        
        // Cognitive load indicators
        const cognitiveIndicators = [
            'analyze', 'synthesize', 'evaluate', 'compare', 'contrast',
            'integrate', 'optimize', 'balance', 'prioritize', 'decide'
        ];
        
        const cognitiveTerms = cognitiveIndicators.filter(term => 
            content.toLowerCase().includes(term)
        );
        
        complexity += Math.min(cognitiveTerms.length / 8, 0.3);
        
        // Multiple constraint handling
        if (context.constraints.length > 2) {
            complexity += Math.min(context.constraints.length / 10, 0.2);
        }
        
        // Multitasking complexity
        const parallelSteps = steps.filter(s => s.dependencies.length === 0);
        if (parallelSteps.length > 3) {
            complexity += 0.1;
        }
        
        return Math.min(complexity, 1.0);
    }
    
    private calculateOverallComplexity(
        structural: number,
        logical: number,
        domain: number,
        temporal: number,
        cognitive: number
    ): number {
        // Weighted average with emphasis on different factors
        const weights = {
            structural: 0.2,
            logical: 0.25,
            domain: 0.2,
            temporal: 0.15,
            cognitive: 0.2
        };
        
        return (
            structural * weights.structural +
            logical * weights.logical +
            domain * weights.domain +
            temporal * weights.temporal +
            cognitive * weights.cognitive
        );
    }
    
    private metricsToLevel(metrics: number): ComplexityLevel {
        if (metrics < 0.2) return 'minimal';
        if (metrics < 0.4) return 'low';
        if (metrics < 0.6) return 'moderate';
        if (metrics < 0.8) return 'high';
        return 'extreme';
    }
    
    private async shouldAdjustComplexity(
        metrics: ComplexityMetrics,
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<boolean> {
        if (!this.config.enableRealTimeAdjustment) return false;
        
        const difference = Math.abs(metrics.overall - this.currentComplexity.overall);
        const exceedsThreshold = difference > this.config.adjustmentThreshold;
        const stabilizationPeriodPassed = this.stabilizationTimer >= this.config.stabilizationPeriod;
        
        return exceedsThreshold && stabilizationPeriodPassed;
    }
    
    private async determineTargetComplexity(
        metrics: ComplexityMetrics,
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<ComplexityLevel> {
        const currentLevel = this.metricsToLevel(metrics.overall);
        
        // Check for patterns that suggest adjustment
        const patterns = await this.identifyComplexityPatterns(context, steps);
        
        for (const pattern of patterns) {
            const patternData = this.complexityPatterns.get(pattern);
            if (patternData) {
                const adjustedComplexity = metrics.overall + patternData.complexityIncrease;
                const adjustedLevel = this.metricsToLevel(adjustedComplexity);
                
                if (adjustedLevel !== currentLevel) {
                    return adjustedLevel;
                }
            }
        }
        
        return currentLevel;
    }
    
    private async createComplexityAdjustment(
        fromLevel: ComplexityLevel,
        toLevel: ComplexityLevel,
        metrics: ComplexityMetrics,
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<ComplexityAdjustment> {
        const adjustmentType = this.getAdjustmentType(fromLevel, toLevel);
        const impact = this.calculateAdjustmentImpact(fromLevel, toLevel, metrics);
        
        return {
            id: `complexity_adjustment_${Date.now()}`,
            timestamp: new Date(),
            fromLevel,
            toLevel,
            reason: `Complexity adjustment based on ${adjustmentType} requirements`,
            adjustmentType,
            impact,
            confidence: 0.8
        };
    }
    
    private async applyComplexityAdjustment(
        adjustment: ComplexityAdjustment,
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<void> {
        // Update current complexity
        this.currentComplexity.overall = this.levelToMetrics(adjustment.toLevel);
        
        // Apply context modifications
        context.complexity = this.currentComplexity.overall;
        context.metadata.complexityAdjustment = adjustment;
        
        console.log(`🔧 Applied complexity adjustment: ${adjustment.fromLevel} → ${adjustment.toLevel}`);
    }
    
    private levelToMetrics(level: ComplexityLevel): number {
        const levelMap = {
            minimal: 0.1,
            low: 0.3,
            moderate: 0.5,
            high: 0.7,
            extreme: 0.9
        };
        return levelMap[level];
    }
    
    private getAdjustmentType(fromLevel: ComplexityLevel, toLevel: ComplexityLevel): 'increase' | 'decrease' | 'stabilize' {
        const fromValue = this.levelToMetrics(fromLevel);
        const toValue = this.levelToMetrics(toLevel);
        
        if (toValue > fromValue) return 'increase';
        if (toValue < fromValue) return 'decrease';
        return 'stabilize';
    }
    
    private calculateAdjustmentImpact(
        fromLevel: ComplexityLevel,
        toLevel: ComplexityLevel,
        metrics: ComplexityMetrics
    ): ComplexityImpact {
        const levelDifference = this.levelToMetrics(toLevel) - this.levelToMetrics(fromLevel);
        
        return {
            stepCountChange: Math.round(levelDifference * 5),
            validationChange: Math.round(levelDifference * 3),
            resourceChange: Math.round(levelDifference * 2),
            timeChange: Math.round(levelDifference * 10),
            qualityChange: levelDifference * 0.1
        };
    }
    
    private initializeComplexity(): ComplexityMetrics {
        return {
            structural: 0.3,
            logical: 0.4,
            domain: 0.3,
            temporal: 0.3,
            cognitive: 0.4,
            overall: 0.35
        };
    }
    
    private initializeComplexityPatterns(): void {
        const patterns: ComplexityPattern[] = [
            {
                pattern: 'recursive_problem',
                indicators: ['recursive', 'iterative', 'self-referential'],
                complexityIncrease: 0.3,
                adjustmentStrategy: 'decomposition',
                examples: ['recursive algorithms', 'self-improving systems']
            },
            {
                pattern: 'multi_constraint',
                indicators: ['multiple constraints', 'competing requirements'],
                complexityIncrease: 0.2,
                adjustmentStrategy: 'constraint_prioritization',
                examples: ['optimization problems', 'resource allocation']
            },
            {
                pattern: 'domain_crossing',
                indicators: ['interdisciplinary', 'cross-domain', 'multi-domain'],
                complexityIncrease: 0.25,
                adjustmentStrategy: 'domain_integration',
                examples: ['bioengineering', 'computational linguistics']
            }
        ];
        
        patterns.forEach(pattern => {
            this.complexityPatterns.set(pattern.pattern, pattern);
        });
    }
    
    private async identifyComplexityPatterns(
        context: ReasoningContext,
        steps: ReasoningStep[]
    ): Promise<string[]> {
        const identifiedPatterns: string[] = [];
        
        const allText = steps.map(s => s.description).join(' ').toLowerCase();
        
        for (const [patternName, pattern] of this.complexityPatterns) {
            const hasIndicators = pattern.indicators.some(indicator => 
                allText.includes(indicator.toLowerCase())
            );
            
            if (hasIndicators) {
                identifiedPatterns.push(patternName);
            }
        }
        
        return identifiedPatterns;
    }
    
    private analyzeComplexityTrajectory(): 'increasing' | 'decreasing' | 'stable' {
        const recent = this.complexityHistory.slice(-3);
        if (recent.length < 2) return 'stable';
        
        const increases = recent.filter(a => a.adjustmentType === 'increase').length;
        const decreases = recent.filter(a => a.adjustmentType === 'decrease').length;
        
        if (increases > decreases) return 'increasing';
        if (decreases > increases) return 'decreasing';
        return 'stable';
    }
    
    private analyzeStepComplexityTrend(steps: ReasoningStep[]): number {
        if (steps.length < 3) return 0;
        
        const recentSteps = steps.slice(-3);
        const complexityIndicators = recentSteps.map(step => 
            step.validationRules.length + step.dependencies.length
        );
        
        // Calculate trend
        const first = complexityIndicators[0];
        const last = complexityIndicators[complexityIndicators.length - 1];
        
        return (last - first) / 10; // Normalize
    }
    
    private getDomainComplexityFactor(domain: string): number {
        const domainMap: Record<string, number> = {
            'mathematics': 0.8,
            'engineering': 0.9,
            'research': 0.7,
            'optimization': 0.95,
            'system-design': 0.85
        };
        
        return domainMap[domain] || 0.5;
    }
    
    private calculatePredictionConfidence(
        recentAdjustments: ComplexityAdjustment[],
        factors: string[]
    ): number {
        let confidence = 0.5;
        
        // Historical accuracy
        if (recentAdjustments.length > 0) {
            const avgConfidence = recentAdjustments.reduce((sum, adj) => sum + adj.confidence, 0) / recentAdjustments.length;
            confidence = (confidence + avgConfidence) / 2;
        }
        
        // Factor strength
        confidence += Math.min(factors.length / 5, 0.3);
        
        return Math.min(confidence, 1.0);
    }
    
    private calculateDependencyDepth(steps: ReasoningStep[]): number {
        const visited = new Set<string>();
        let maxDepth = 0;
        
        const calculateDepth = (stepId: string, currentDepth: number): number => {
            if (visited.has(stepId)) return currentDepth;
            visited.add(stepId);
            
            const step = steps.find(s => s.id === stepId);
            if (!step) return currentDepth;
            
            let depth = currentDepth;
            for (const dep of step.dependencies) {
                depth = Math.max(depth, calculateDepth(dep, currentDepth + 1));
            }
            
            return depth;
        };
        
        for (const step of steps) {
            maxDepth = Math.max(maxDepth, calculateDepth(step.id, 0));
        }
        
        return maxDepth;
    }
    
    private async learnFromAdjustment(
        adjustment: ComplexityAdjustment,
        context: ReasoningContext
    ): Promise<void> {
        const key = `${adjustment.fromLevel}_${adjustment.toLevel}_${context.domain}`;
        this.learningData.set(key, (this.learningData.get(key) || 0) + 1);
        
        // Update learning rate
        const totalAdjustments = this.complexityHistory.length;
        if (totalAdjustments > 10) {
            const successRate = this.complexityHistory.filter(a => a.confidence > 0.8).length / totalAdjustments;
            this.config.learningRate = Math.min(successRate, 0.9);
        }
    }
    
    // Step generation methods for different complexity levels
    private generateMinimalSteps(baseSteps: ReasoningStep[], context: ReasoningContext): ReasoningStep[] {
        // Simplify to essential steps only
        return baseSteps.slice(0, 3).map(step => ({
            ...step,
            validationRules: step.validationRules.slice(0, 2),
            dependencies: step.dependencies.slice(0, 1)
        }));
    }
    
    private generateLowComplexitySteps(baseSteps: ReasoningStep[], context: ReasoningContext): ReasoningStep[] {
        // Keep basic steps with minimal validation
        return baseSteps.slice(0, 5).map(step => ({
            ...step,
            validationRules: step.validationRules.slice(0, 3)
        }));
    }
    
    private generateModerateComplexitySteps(baseSteps: ReasoningStep[], context: ReasoningContext): ReasoningStep[] {
        // Standard complexity - return as is
        return baseSteps;
    }
    
    private generateHighComplexitySteps(baseSteps: ReasoningStep[], context: ReasoningContext): ReasoningStep[] {
        // Add additional validation and intermediate steps
        const enhancedSteps = baseSteps.map(step => ({
            ...step,
            validationRules: [...step.validationRules, 'thoroughness', 'accuracy']
        }));
        
        // Add intermediate validation steps
        const validationSteps: ReasoningStep[] = [];
        for (let i = 2; i < enhancedSteps.length; i += 3) {
            validationSteps.push({
                id: `validation_${i}`,
                order: i + 0.5,
                description: 'Intermediate validation and quality check',
                expectedOutput: 'Validation report with quality metrics',
                dependencies: [enhancedSteps[i].id],
                validationRules: ['consistency', 'progress-quality']
            });
        }
        
        return [...enhancedSteps, ...validationSteps].sort((a, b) => a.order - b.order);
    }
    
    private generateExtremeComplexitySteps(baseSteps: ReasoningStep[], context: ReasoningContext): ReasoningStep[] {
        // Maximum complexity with comprehensive validation and decomposition
        const decomposedSteps: ReasoningStep[] = [];
        
        for (const step of baseSteps) {
            // Decompose each step into sub-steps
            const subSteps = this.decomposeStep(step);
            decomposedSteps.push(...subSteps);
        }
        
        // Add comprehensive validation
        const validationSteps: ReasoningStep[] = [];
        for (let i = 1; i < decomposedSteps.length; i += 2) {
            validationSteps.push({
                id: `comprehensive_validation_${i}`,
                order: i + 0.5,
                description: 'Comprehensive validation with multiple criteria',
                expectedOutput: 'Detailed validation report with recommendations',
                dependencies: [decomposedSteps[i].id],
                validationRules: ['logical', 'consistency', 'completeness', 'accuracy', 'efficiency']
            });
        }
        
        return [...decomposedSteps, ...validationSteps].sort((a, b) => a.order - b.order);
    }
    
    private decomposeStep(step: ReasoningStep): ReasoningStep[] {
        return [
            {
                id: `${step.id}_analyze`,
                order: step.order,
                description: `Analyze requirements for: ${step.description}`,
                expectedOutput: `Analysis results for ${step.description}`,
                dependencies: step.dependencies,
                validationRules: ['analytical-depth', 'requirement-clarity']
            },
            {
                id: `${step.id}_plan`,
                order: step.order + 0.33,
                description: `Plan implementation for: ${step.description}`,
                expectedOutput: `Implementation plan for ${step.description}`,
                dependencies: [`${step.id}_analyze`],
                validationRules: ['plan-feasibility', 'resource-consideration']
            },
            {
                id: `${step.id}_execute`,
                order: step.order + 0.66,
                description: `Execute: ${step.description}`,
                expectedOutput: step.expectedOutput,
                dependencies: [`${step.id}_plan`],
                validationRules: [...step.validationRules, 'execution-quality']
            }
        ];
    }
    
    /**
     * Get complexity statistics
     */
    getComplexityStatistics(): {
        currentMetrics: ComplexityMetrics;
        adjustmentHistory: number;
        averageComplexity: number;
        complexityTrend: string;
        learningPatterns: number;
    } {
        const averageComplexity = this.complexityHistory.length > 0 ?
            this.complexityHistory.reduce((sum, adj) => sum + this.levelToMetrics(adj.toLevel), 0) / this.complexityHistory.length :
            0.5;
        
        return {
            currentMetrics: this.currentComplexity,
            adjustmentHistory: this.complexityHistory.length,
            averageComplexity,
            complexityTrend: this.analyzeComplexityTrajectory(),
            learningPatterns: this.learningData.size
        };
    }
}