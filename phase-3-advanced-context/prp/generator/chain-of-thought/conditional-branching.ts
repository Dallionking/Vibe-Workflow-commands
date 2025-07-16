/**
 * Conditional Branching System for Advanced Reasoning
 * Phase 3: Advanced Context Features - Tier 2.1
 *
 * Implements sophisticated conditional logic for dynamic reasoning paths
 * based on context, complexity, and intermediate results.
 */

import { ReasoningStep } from '../interfaces';
import { ReasoningContext } from './reasoning-chain';

export type BranchConditionType = 'complexity' | 'domain' | 'progress' | 'quality' | 'resource' | 'custom';

export interface BranchCondition {
    type: BranchConditionType;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'matches' | 'custom';
    value: any;
    customEvaluator?: (context: ReasoningContext) => boolean;
}

export interface ConditionalBranch {
    id: string;
    name: string;
    description: string;
    conditions: BranchCondition[];
    conditionLogic: 'and' | 'or' | 'not';
    priority: number;
    isActive: boolean;
    nextSteps: string[];
    stepTemplates: ReasoningStepTemplate[];
    metadata: Record<string, any>;
}

export interface ReasoningStepTemplate {
    id: string;
    description: string;
    expectedOutput: string;
    validationRules: string[];
    dependencies: string[];
    estimatedComplexity: number;
    resourceRequirements: string[];
}

export interface BranchActivationResult {
    branchId: string;
    activated: boolean;
    reason: string;
    generatedSteps: ReasoningStep[];
    contextModifications: Record<string, any>;
}

export interface BranchingConfig {
    maxActiveBranches: number;
    enableBranchPriority: boolean;
    enableBranchConflictResolution: boolean;
    enableDynamicBranchGeneration: boolean;
    branchEvaluationInterval: number;
}

export class ConditionalBranchingEngine {
  private config: BranchingConfig;
  private branches: Map<string, ConditionalBranch>;
  private activeBranches: Set<string>;
  private branchHistory: BranchActivationResult[];
  private evaluationCount: number;

  constructor(config: BranchingConfig) {
    this.config = config;
    this.branches = new Map();
    this.activeBranches = new Set();
    this.branchHistory = [];
    this.evaluationCount = 0;

    this.initializeDefaultBranches();
  }

  /**
     * Register a new conditional branch
     */
  registerBranch(branch: ConditionalBranch): void {
    this.branches.set(branch.id, branch);
    console.log(`🌿 Registered branch: ${branch.name} (${branch.id})`);
  }

  /**
     * Remove a conditional branch
     */
  removeBranch(branchId: string): boolean {
    const removed = this.branches.delete(branchId);
    this.activeBranches.delete(branchId);

    if (removed) {
      console.log(`🗑️  Removed branch: ${branchId}`);
    }

    return removed;
  }

  /**
     * Evaluate all branches and activate applicable ones
     */
  async evaluateBranches(context: ReasoningContext): Promise<BranchActivationResult[]> {
    this.evaluationCount++;
    const results: BranchActivationResult[] = [];

    // Skip evaluation if not at interval
    if (this.evaluationCount % this.config.branchEvaluationInterval !== 0) {
      return results;
    }

    console.log(`🔍 Evaluating ${this.branches.size} branches...`);

    // Sort branches by priority if enabled
    const branchesToEvaluate = Array.from(this.branches.values());
    if (this.config.enableBranchPriority) {
      branchesToEvaluate.sort((a, b) => b.priority - a.priority);
    }

    for (const branch of branchesToEvaluate) {
      if (!branch.isActive) {
        continue;
      }

      const result = await this.evaluateBranch(branch, context);
      results.push(result);

      if (result.activated) {
        this.activeBranches.add(branch.id);
        this.branchHistory.push(result);

        // Check if we've reached max active branches
        if (this.activeBranches.size >= this.config.maxActiveBranches) {
          console.log(`⚠️  Max active branches (${this.config.maxActiveBranches}) reached`);
          break;
        }
      }
    }

    // Handle branch conflicts if enabled
    if (this.config.enableBranchConflictResolution) {
      await this.resolveBranchConflicts(results);
    }

    console.log(`✅ Branch evaluation complete: ${results.filter(r => r.activated).length} branches activated`);
    return results;
  }

  /**
     * Evaluate a single branch
     */
  async evaluateBranch(branch: ConditionalBranch, context: ReasoningContext): Promise<BranchActivationResult> {
    const conditionsMet = this.evaluateConditions(branch.conditions, branch.conditionLogic, context);

    if (!conditionsMet) {
      return {
        branchId: branch.id,
        activated: false,
        reason: 'Conditions not met',
        generatedSteps: [],
        contextModifications: {}
      };
    }

    // Generate steps from templates
    const generatedSteps = await this.generateStepsFromTemplates(
      branch.stepTemplates,
      context,
      branch.id
    );

    // Prepare context modifications
    const contextModifications = {
      [`branch_${branch.id}_activated`]: true,
      [`branch_${branch.id}_timestamp`]: Date.now(),
      ...branch.metadata
    };

    return {
      branchId: branch.id,
      activated: true,
      reason: 'All conditions satisfied',
      generatedSteps,
      contextModifications
    };
  }

  /**
     * Evaluate branch conditions
     */
  private evaluateConditions(
    conditions: BranchCondition[],
    logic: 'and' | 'or' | 'not',
    context: ReasoningContext
  ): boolean {
    if (conditions.length === 0) {
      return true;
    }

    const results = conditions.map(condition => this.evaluateCondition(condition, context));

    switch (logic) {
    case 'and':
      return results.every(result => result);
    case 'or':
      return results.some(result => result);
    case 'not':
      return !results.some(result => result);
    default:
      return false;
    }
  }

  /**
     * Evaluate a single condition
     */
  private evaluateCondition(condition: BranchCondition, context: ReasoningContext): boolean {
    if (condition.customEvaluator) {
      return condition.customEvaluator(context);
    }

    let contextValue: any;

    switch (condition.type) {
    case 'complexity':
      contextValue = context.complexity;
      break;
    case 'domain':
      contextValue = context.domain;
      break;
    case 'progress':
      contextValue = context.previousSteps.length;
      break;
    case 'quality':
      contextValue = context.metadata.quality || 0.5;
      break;
    case 'resource':
      contextValue = context.metadata.resources || [];
      break;
    case 'custom':
      contextValue = context.metadata[condition.value] || null;
      break;
    default:
      return false;
    }

    return this.compareValues(contextValue, condition.operator, condition.value);
  }

  /**
     * Compare values based on operator
     */
  private compareValues(contextValue: any, operator: string, conditionValue: any): boolean {
    switch (operator) {
    case 'eq':
      return contextValue === conditionValue;
    case 'ne':
      return contextValue !== conditionValue;
    case 'gt':
      return contextValue > conditionValue;
    case 'lt':
      return contextValue < conditionValue;
    case 'gte':
      return contextValue >= conditionValue;
    case 'lte':
      return contextValue <= conditionValue;
    case 'contains':
      return Array.isArray(contextValue) ?
        contextValue.includes(conditionValue) :
        String(contextValue).includes(String(conditionValue));
    case 'matches':
      return new RegExp(conditionValue).test(String(contextValue));
    default:
      return false;
    }
  }

  /**
     * Generate reasoning steps from templates
     */
  private async generateStepsFromTemplates(
    templates: ReasoningStepTemplate[],
    context: ReasoningContext,
    branchId: string
  ): Promise<ReasoningStep[]> {
    const steps: ReasoningStep[] = [];

    for (const template of templates) {
      const step: ReasoningStep = {
        id: `${branchId}_${template.id}`,
        order: context.previousSteps.length + steps.length + 1,
        description: this.interpolateTemplate(template.description, context),
        expectedOutput: this.interpolateTemplate(template.expectedOutput, context),
        dependencies: template.dependencies,
        validationRules: template.validationRules
      };

      steps.push(step);
    }

    return steps;
  }

  /**
     * Interpolate template variables with context values
     */
  private interpolateTemplate(template: string, context: ReasoningContext): string {
    return template
      .replace(/\{domain\}/g, context.domain)
      .replace(/\{complexity\}/g, context.complexity.toString())
      .replace(/\{stepCount\}/g, context.previousSteps.length.toString())
      .replace(/\{constraints\}/g, context.constraints.join(', '));
  }

  /**
     * Resolve conflicts between activated branches
     */
  private async resolveBranchConflicts(results: BranchActivationResult[]): Promise<void> {
    const activatedResults = results.filter(r => r.activated);

    if (activatedResults.length <= 1) {
      return;
    }

    console.log(`🔧 Resolving conflicts between ${activatedResults.length} branches...`);

    // Simple conflict resolution: highest priority wins
    const branches = activatedResults.map(r => this.branches.get(r.branchId)!);
    branches.sort((a, b) => b.priority - a.priority);

    // Deactivate lower priority branches
    for (let i = 1; i < branches.length; i++) {
      const branch = branches[i];
      this.activeBranches.delete(branch.id);

      const result = results.find(r => r.branchId === branch.id);
      if (result) {
        result.activated = false;
        result.reason = 'Deactivated due to conflict resolution';
      }

      console.log(`🚫 Deactivated branch ${branch.id} due to conflict`);
    }
  }

  /**
     * Generate dynamic branches based on context
     */
  async generateDynamicBranches(context: ReasoningContext): Promise<ConditionalBranch[]> {
    if (!this.config.enableDynamicBranchGeneration) {
      return [];
    }

    const dynamicBranches: ConditionalBranch[] = [];

    // Generate complexity-based branch
    if (context.complexity > 0.8) {
      dynamicBranches.push({
        id: `dynamic_high_complexity_${Date.now()}`,
        name: 'Dynamic High Complexity Branch',
        description: 'Generated branch for high complexity scenarios',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.8
          }
        ],
        conditionLogic: 'and',
        priority: 5,
        isActive: true,
        nextSteps: ['complexity-breakdown', 'risk-analysis'],
        stepTemplates: [
          {
            id: 'complexity-breakdown',
            description: 'Break down complex problem into manageable components',
            expectedOutput: 'List of simplified sub-problems',
            validationRules: ['decomposition-quality', 'completeness'],
            dependencies: [],
            estimatedComplexity: 0.6,
            resourceRequirements: ['analysis-time', 'domain-expertise']
          }
        ],
        metadata: {
          generated: true,
          timestamp: Date.now()
        }
      });
    }

    // Generate domain-specific branch
    if (context.domain !== 'general') {
      dynamicBranches.push({
        id: `dynamic_domain_${context.domain}_${Date.now()}`,
        name: `Dynamic ${context.domain} Branch`,
        description: `Generated branch for ${context.domain} domain`,
        conditions: [
          {
            type: 'domain',
            operator: 'eq',
            value: context.domain
          }
        ],
        conditionLogic: 'and',
        priority: 3,
        isActive: true,
        nextSteps: ['domain-analysis'],
        stepTemplates: [
          {
            id: 'domain-analysis',
            description: 'Apply {domain}-specific analysis techniques',
            expectedOutput: 'Domain-specific insights and recommendations',
            validationRules: ['domain-accuracy', 'expertise-level'],
            dependencies: [],
            estimatedComplexity: 0.5,
            resourceRequirements: ['domain-knowledge']
          }
        ],
        metadata: {
          generated: true,
          domain: context.domain,
          timestamp: Date.now()
        }
      });
    }

    // Register generated branches
    for (const branch of dynamicBranches) {
      this.registerBranch(branch);
    }

    return dynamicBranches;
  }

  /**
     * Get branch statistics
     */
  getBranchStatistics(): {
        totalBranches: number;
        activeBranches: number;
        branchActivationHistory: number;
        averageActivationRate: number;
        topBranches: { id: string; name: string; activationCount: number }[];
        } {
    const activationCounts = new Map<string, number>();

    this.branchHistory.forEach(result => {
      if (result.activated) {
        activationCounts.set(result.branchId, (activationCounts.get(result.branchId) || 0) + 1);
      }
    });

    const topBranches = Array.from(activationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => ({
        id,
        name: this.branches.get(id)?.name || 'Unknown',
        activationCount: count
      }));

    return {
      totalBranches: this.branches.size,
      activeBranches: this.activeBranches.size,
      branchActivationHistory: this.branchHistory.length,
      averageActivationRate: this.branchHistory.filter(r => r.activated).length / Math.max(this.branchHistory.length, 1),
      topBranches
    };
  }

  /**
     * Clear branch history
     */
  clearHistory(): void {
    this.branchHistory = [];
    this.evaluationCount = 0;
    console.log('🗑️  Branch history cleared');
  }

  /**
     * Initialize default branches
     */
  private initializeDefaultBranches(): void {
    const defaultBranches: ConditionalBranch[] = [
      {
        id: 'high-complexity',
        name: 'High Complexity Handler',
        description: 'Activates for complex reasoning scenarios',
        conditions: [
          {
            type: 'complexity',
            operator: 'gt',
            value: 0.7
          }
        ],
        conditionLogic: 'and',
        priority: 8,
        isActive: true,
        nextSteps: ['complexity-analysis', 'decomposition'],
        stepTemplates: [
          {
            id: 'complexity-analysis',
            description: 'Analyze complexity factors and challenges',
            expectedOutput: 'Detailed complexity assessment',
            validationRules: ['thoroughness', 'accuracy'],
            dependencies: [],
            estimatedComplexity: 0.4,
            resourceRequirements: ['analysis-time']
          },
          {
            id: 'decomposition',
            description: 'Decompose complex problem into sub-problems',
            expectedOutput: 'Hierarchical problem breakdown',
            validationRules: ['completeness', 'logical-structure'],
            dependencies: ['complexity-analysis'],
            estimatedComplexity: 0.6,
            resourceRequirements: ['structural-thinking']
          }
        ],
        metadata: {
          type: 'default',
          category: 'complexity'
        }
      },
      {
        id: 'validation-checkpoint',
        name: 'Validation Checkpoint',
        description: 'Adds validation steps after multiple reasoning steps',
        conditions: [
          {
            type: 'progress',
            operator: 'gt',
            value: 3
          }
        ],
        conditionLogic: 'and',
        priority: 6,
        isActive: true,
        nextSteps: ['intermediate-validation'],
        stepTemplates: [
          {
            id: 'intermediate-validation',
            description: 'Validate reasoning progress and quality',
            expectedOutput: 'Validation report with recommendations',
            validationRules: ['logical-consistency', 'progress-quality'],
            dependencies: [],
            estimatedComplexity: 0.3,
            resourceRequirements: ['validation-time']
          }
        ],
        metadata: {
          type: 'default',
          category: 'validation'
        }
      },
      {
        id: 'domain-specialization',
        name: 'Domain Specialization',
        description: 'Activates for non-general domain problems',
        conditions: [
          {
            type: 'domain',
            operator: 'ne',
            value: 'general'
          }
        ],
        conditionLogic: 'and',
        priority: 4,
        isActive: true,
        nextSteps: ['domain-analysis'],
        stepTemplates: [
          {
            id: 'domain-analysis',
            description: 'Apply domain-specific reasoning patterns',
            expectedOutput: 'Domain-specific insights and approaches',
            validationRules: ['domain-accuracy', 'specialization-depth'],
            dependencies: [],
            estimatedComplexity: 0.5,
            resourceRequirements: ['domain-expertise']
          }
        ],
        metadata: {
          type: 'default',
          category: 'domain'
        }
      }
    ];

    defaultBranches.forEach(branch => this.registerBranch(branch));
    console.log(`🌱 Initialized ${defaultBranches.length} default branches`);
  }
}
