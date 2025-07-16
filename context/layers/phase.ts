/**
 * L2: Phase Context Layer Implementation
 * Phase-specific context that changes based on current development phase
 */

import {
  PhaseContextLayer,
  PhaseContextData,
  PhaseState,
  PhaseRequirement,
  PhaseProgress,
  PhaseOutput,
  ValidationCriteria,
  PhaseBlocker,
  PhaseDependency,
  ContextPriority,
  ContextMetadata
} from '../types/context.types';

/**
 * Phase Context Manager
 * Manages L2 context specific to the current development phase
 */
export class PhaseContextManager {
  private phaseContext: PhaseContextLayer | null = null;
  private phaseHistory: Map<number, PhaseContextLayer> = new Map();

  /**
   * Initialize phase context for a specific phase
   */
  public async initializePhase(
    phaseNumber: number,
    phaseName: string,
    objectives: string[],
    requirements: PhaseRequirement[],
    dependencies: PhaseDependency[] = []
  ): Promise<PhaseContextLayer> {
    const contextId = `phase-${phaseNumber}-${Date.now()}`;
    const timestamp = Date.now();

    const phaseData: PhaseContextData = {
      objectives,
      requirements,
      progress: this.createInitialProgress(requirements.length),
      outputs: [],
      validationCriteria: this.generateValidationCriteria(requirements)
    };

    const phaseState: PhaseState = {
      status: 'not-started',
      currentTier: 1,
      currentSubtask: '',
      completedTasks: [],
      blockers: []
    };

    const metadata: ContextMetadata = {
      source: { type: 'phase', phaseNumber, phaseName },
      priority: ContextPriority.HIGH,
      tags: ['phase', `phase-${phaseNumber}`, phaseName.toLowerCase().replace(/\s+/g, '-')],
      dependencies: dependencies.map(dep => `phase-${dep.phaseNumber}`),
      created: timestamp,
      lastModified: timestamp
    };

    this.phaseContext = {
      id: contextId,
      timestamp,
      version: '1.0.0',
      layer: 'phase',
      phaseNumber,
      phaseName,
      data: phaseData,
      metadata,
      phaseState,
      dependencies
    };

    // Store in history
    this.phaseHistory.set(phaseNumber, { ...this.phaseContext });

    return this.phaseContext;
  }

  /**
   * Get current phase context
   */
  public getCurrentPhase(): PhaseContextLayer | null {
    return this.phaseContext;
  }

  /**
   * Get phase context by number
   */
  public getPhase(phaseNumber: number): PhaseContextLayer | null {
    return this.phaseHistory.get(phaseNumber) || null;
  }

  /**
   * Update phase progress
   */
  public updateProgress(
    completedTasks: string[],
    currentTier?: number,
    currentSubtask?: string
  ): void {
    if (!this.phaseContext) {
      throw new Error('No active phase context');
    }

    // Update completed tasks
    this.phaseContext.phaseState.completedTasks = [
      ...new Set([...this.phaseContext.phaseState.completedTasks, ...completedTasks])
    ];

    // Update current position
    if (currentTier !== undefined) {
      this.phaseContext.phaseState.currentTier = currentTier;
    }
    if (currentSubtask !== undefined) {
      this.phaseContext.phaseState.currentSubtask = currentSubtask;
    }

    // Recalculate progress
    const totalTasks = this.getTotalTaskCount();
    const completedCount = this.phaseContext.phaseState.completedTasks.length;

    this.phaseContext.data.progress = {
      ...this.phaseContext.data.progress,
      completionPercentage: totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0,
      tasksCompleted: completedCount,
      tasksTotal: totalTasks
    };

    // Update status based on progress
    if (completedCount === 0) {
      this.phaseContext.phaseState.status = 'not-started';
    } else if (completedCount === totalTasks) {
      this.phaseContext.phaseState.status = 'completed';
    } else {
      this.phaseContext.phaseState.status = 'in-progress';
    }

    this.phaseContext.metadata.lastModified = Date.now();
  }

  /**
   * Add phase output
   */
  public addOutput(output: PhaseOutput): void {
    if (!this.phaseContext) {
      throw new Error('No active phase context');
    }

    this.phaseContext.data.outputs.push(output);
    this.phaseContext.metadata.lastModified = Date.now();
  }

  /**
   * Add phase blocker
   */
  public addBlocker(blocker: PhaseBlocker): void {
    if (!this.phaseContext) {
      throw new Error('No active phase context');
    }

    this.phaseContext.phaseState.blockers.push(blocker);

    // Update status if critical blocker
    if (blocker.severity === 'critical') {
      this.phaseContext.phaseState.status = 'blocked';
    }

    this.phaseContext.metadata.lastModified = Date.now();
  }

  /**
   * Resolve phase blocker
   */
  public resolveBlocker(blockerId: string, resolution: string): boolean {
    if (!this.phaseContext) {
      throw new Error('No active phase context');
    }

    const blocker = this.phaseContext.phaseState.blockers.find(b => b.id === blockerId);
    if (!blocker) {
      return false;
    }

    blocker.resolution = resolution;

    // Remove resolved blocker
    this.phaseContext.phaseState.blockers = this.phaseContext.phaseState.blockers.filter(
      b => b.id !== blockerId
    );

    // Update status if no more critical blockers
    const criticalBlockers = this.phaseContext.phaseState.blockers.filter(
      b => b.severity === 'critical'
    );

    if (criticalBlockers.length === 0 && this.phaseContext.phaseState.status === 'blocked') {
      this.phaseContext.phaseState.status = 'in-progress';
    }

    this.phaseContext.metadata.lastModified = Date.now();
    return true;
  }

  /**
   * Validate phase requirements
   */
  public validateRequirements(): ValidationCriteria[] {
    if (!this.phaseContext) {
      throw new Error('No active phase context');
    }

    const results: ValidationCriteria[] = [];

    for (const criteria of this.phaseContext.data.validationCriteria) {
      const requirement = this.phaseContext.data.requirements.find(
        req => req.id === criteria.id
      );

      if (requirement) {
        criteria.passed = requirement.satisfied;
        results.push(criteria);
      }
    }

    return results;
  }

  /**
   * Check if phase dependencies are satisfied
   */
  public checkDependencies(): boolean {
    if (!this.phaseContext) {
      return false;
    }

    return this.phaseContext.dependencies.every(dep => {
      if (dep.type === 'optional') {
        return true;
      }
      return dep.satisfied;
    });
  }

  /**
   * Mark phase as completed
   */
  public completePhase(finalOutputs: PhaseOutput[]): void {
    if (!this.phaseContext) {
      throw new Error('No active phase context');
    }

    // Add final outputs
    this.phaseContext.data.outputs.push(...finalOutputs);

    // Update state
    this.phaseContext.phaseState.status = 'completed';
    this.phaseContext.data.progress.completionPercentage = 100;

    // Validate all requirements
    const validationResults = this.validateRequirements();
    const allValid = validationResults.every(v => v.passed === true);

    if (!allValid) {
      console.warn('Phase completed but not all validation criteria passed');
    }

    this.phaseContext.metadata.lastModified = Date.now();

    // Update history
    this.phaseHistory.set(this.phaseContext.phaseNumber, { ...this.phaseContext });
  }

  /**
   * Get phase summary for context assembly
   */
  public getPhaseSummary(): string {
    if (!this.phaseContext) {
      return 'No active phase';
    }

    const { phaseName, phaseNumber, phaseState, data } = this.phaseContext;
    const { status, currentTier, completedTasks } = phaseState;
    const { completionPercentage, tasksCompleted, tasksTotal } = data.progress;

    return `Phase ${phaseNumber}: ${phaseName}
Status: ${status}
Progress: ${completionPercentage.toFixed(1)}% (${tasksCompleted}/${tasksTotal} tasks)
Current Tier: ${currentTier}
Recent Tasks: ${completedTasks.slice(-3).join(', ')}
Objectives: ${data.objectives.slice(0, 2).join(', ')}${data.objectives.length > 2 ? '...' : ''}`;
  }

  /**
   * Get all phase contexts for historical analysis
   */
  public getAllPhases(): PhaseContextLayer[] {
    return Array.from(this.phaseHistory.values());
  }

  /**
   * Export phase context for serialization
   */
  public exportPhaseContext(): PhaseContextLayer | null {
    return this.phaseContext ? { ...this.phaseContext } : null;
  }

  /**
   * Import phase context from serialized data
   */
  public importPhaseContext(context: PhaseContextLayer): void {
    this.phaseContext = context;
    this.phaseHistory.set(context.phaseNumber, { ...context });
  }

  // Private helper methods

  private createInitialProgress(requirementCount: number): PhaseProgress {
    return {
      completionPercentage: 0,
      tasksCompleted: 0,
      tasksTotal: this.estimateTaskCount(requirementCount),
      timeSpent: 0,
      estimatedRemaining: this.estimateTimeRemaining(requirementCount)
    };
  }

  private generateValidationCriteria(requirements: PhaseRequirement[]): ValidationCriteria[] {
    return requirements.map(req => ({
      id: req.id,
      description: req.description,
      validator: this.getValidatorForRequirement(req),
      required: req.priority >= ContextPriority.HIGH,
      passed: undefined
    }));
  }

  private getValidatorForRequirement(requirement: PhaseRequirement): string {
    switch (requirement.type) {
    case 'functional':
      return 'function-validator';
    case 'non-functional':
      return 'performance-validator';
    case 'quality':
      return 'quality-validator';
    case 'documentation':
      return 'documentation-validator';
    default:
      return 'generic-validator';
    }
  }

  private getTotalTaskCount(): number {
    // This would be calculated based on phase requirements and structure
    // For now, return estimated count
    return this.phaseContext?.data.progress.tasksTotal || 0;
  }

  private estimateTaskCount(requirementCount: number): number {
    // Estimate based on requirement count and complexity
    return Math.max(requirementCount * 2, 10);
  }

  private estimateTimeRemaining(requirementCount: number): number {
    // Estimate in hours based on requirement count
    return requirementCount * 4; // 4 hours per requirement on average
  }
}

/**
 * Singleton instance for phase context management
 */
export const phaseContextManager = new PhaseContextManager();
