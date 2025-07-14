/**
 * Phase Transition Validation System
 * Ensures smooth transitions between Vibe Coding phases
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  ValidationGate, 
  ValidationResult,
  GateContext,
  ValidationError
} from './types/context.types';
import { ValidationGateSystem } from './validation-gates';
import { ValidationExecutionEngine, ValidationExecutionResult } from './validation-engine';

export interface PhaseDefinition {
  id: string;
  name: string;
  order: number;
  description: string;
  prerequisites: string[];
  deliverables: PhaseDeliverable[];
  validationGates: string[];
  estimatedDuration?: string;
}

export interface PhaseDeliverable {
  name: string;
  type: 'file' | 'directory' | 'content' | 'artifact';
  path?: string;
  required: boolean;
  validation?: (content: any) => Promise<boolean>;
}

export interface PhaseTransition {
  from: string;
  to: string;
  conditions: TransitionCondition[];
  actions?: TransitionAction[];
}

export interface TransitionCondition {
  type: 'gate' | 'deliverable' | 'approval' | 'custom';
  target: string;
  required: boolean;
}

export interface TransitionAction {
  type: 'backup' | 'archive' | 'notify' | 'execute';
  config: Record<string, any>;
}

export interface PhaseState {
  currentPhase: string;
  startedAt: Date;
  completedPhases: CompletedPhase[];
  pendingTransition?: PendingTransition;
  validationHistory: ValidationExecutionResult[];
}

export interface CompletedPhase {
  phaseId: string;
  completedAt: Date;
  duration: number;
  deliverables: string[];
  validationResults: ValidationExecutionResult;
}

export interface PendingTransition {
  from: string;
  to: string;
  requestedAt: Date;
  conditions: ConditionStatus[];
  blockers: string[];
}

export interface ConditionStatus {
  condition: TransitionCondition;
  status: 'pending' | 'satisfied' | 'failed';
  checkedAt?: Date;
  details?: string;
}

export class PhaseTransitionValidator {
  private phases: Map<string, PhaseDefinition> = new Map();
  private transitions: Map<string, PhaseTransition[]> = new Map();
  private gateSystem: ValidationGateSystem;
  private executionEngine: ValidationExecutionEngine;
  private state: PhaseState;
  private stateFile: string;

  constructor(
    gateSystem: ValidationGateSystem,
    stateFile: string = '.vibe/phase-state.json'
  ) {
    this.gateSystem = gateSystem;
    this.executionEngine = new ValidationExecutionEngine(gateSystem);
    this.stateFile = stateFile;
    this.state = this.loadState();
    this.initializePhases();
    this.initializeTransitions();
  }

  /**
   * Register a phase definition
   */
  registerPhase(phase: PhaseDefinition): void {
    this.phases.set(phase.id, phase);
    
    // Register phase-specific validation gates
    const gates = this.createPhaseGates(phase);
    this.gateSystem.registerGates(gates);
  }

  /**
   * Register a phase transition
   */
  registerTransition(transition: PhaseTransition): void {
    const key = transition.from;
    const existing = this.transitions.get(key) || [];
    existing.push(transition);
    this.transitions.set(key, existing);
  }

  /**
   * Check if transition is allowed
   */
  async canTransition(fromPhase: string, toPhase: string): Promise<{
    allowed: boolean;
    conditions: ConditionStatus[];
    blockers: string[];
  }> {
    const transitions = this.transitions.get(fromPhase) || [];
    const transition = transitions.find(t => t.to === toPhase);
    
    if (!transition) {
      return {
        allowed: false,
        conditions: [],
        blockers: [`No transition defined from ${fromPhase} to ${toPhase}`]
      };
    }

    const conditions = await this.checkTransitionConditions(transition);
    const blockers = conditions
      .filter(c => c.status === 'failed' && c.condition.required)
      .map(c => c.details || `Condition '${c.condition.target}' not met`);

    return {
      allowed: blockers.length === 0,
      conditions,
      blockers
    };
  }

  /**
   * Execute phase transition
   */
  async transitionTo(toPhase: string): Promise<{
    success: boolean;
    fromPhase: string;
    toPhase: string;
    validation?: ValidationExecutionResult;
    errors?: string[];
  }> {
    const fromPhase = this.state.currentPhase;
    
    // Check if transition is allowed
    const { allowed, conditions, blockers } = await this.canTransition(fromPhase, toPhase);
    
    if (!allowed) {
      return {
        success: false,
        fromPhase,
        toPhase,
        errors: blockers
      };
    }

    // Store pending transition
    this.state.pendingTransition = {
      from: fromPhase,
      to: toPhase,
      requestedAt: new Date(),
      conditions,
      blockers: []
    };

    try {
      // Execute pre-transition validation
      const validation = await this.executionEngine.executePhaseValidation(
        toPhase,
        { phase: toPhase },
        { continueOnWarning: true }
      );

      // Check validation results
      if (validation.summary.failed > 0) {
        const errors = validation.gates
          .filter(g => g.status === 'failed')
          .map(g => `Gate '${g.gateName}' failed: ${g.result.errors?.map(e => e.message).join(', ')}`);

        return {
          success: false,
          fromPhase,
          toPhase,
          validation,
          errors
        };
      }

      // Execute transition actions
      const transition = this.transitions.get(fromPhase)?.find(t => t.to === toPhase);
      if (transition?.actions) {
        await this.executeTransitionActions(transition.actions);
      }

      // Complete current phase
      if (fromPhase !== 'initial') {
        await this.completePhase(fromPhase);
      }

      // Update state
      this.state.currentPhase = toPhase;
      this.state.pendingTransition = undefined;
      this.saveState();

      return {
        success: true,
        fromPhase,
        toPhase,
        validation
      };

    } catch (error) {
      return {
        success: false,
        fromPhase,
        toPhase,
        errors: [`Transition failed: ${error}`]
      };
    }
  }

  /**
   * Validate current phase completion
   */
  async validatePhaseCompletion(phaseId?: string): Promise<{
    complete: boolean;
    deliverables: DeliverableStatus[];
    validation: ValidationExecutionResult;
  }> {
    const phase = phaseId || this.state.currentPhase;
    const phaseDef = this.phases.get(phase);
    
    if (!phaseDef) {
      throw new Error(`Phase '${phase}' not found`);
    }

    // Check deliverables
    const deliverables = await this.checkDeliverables(phaseDef);
    
    // Execute phase validation
    const validation = await this.executionEngine.executePhaseValidation(
      phase,
      { phase },
      { continueOnWarning: true }
    );

    const complete = deliverables.every(d => d.status === 'complete') &&
                    validation.summary.failed === 0;

    return {
      complete,
      deliverables,
      validation
    };
  }

  /**
   * Get phase transition graph
   */
  getTransitionGraph(): {
    nodes: Array<{ id: string; label: string; current: boolean }>;
    edges: Array<{ from: string; to: string; conditions: number }>;
  } {
    const nodes = Array.from(this.phases.values()).map(phase => ({
      id: phase.id,
      label: phase.name,
      current: phase.id === this.state.currentPhase
    }));

    const edges: Array<{ from: string; to: string; conditions: number }> = [];
    
    for (const [from, transitions] of this.transitions) {
      for (const transition of transitions) {
        edges.push({
          from,
          to: transition.to,
          conditions: transition.conditions.length
        });
      }
    }

    return { nodes, edges };
  }

  /**
   * Get phase progress
   */
  getPhaseProgress(): {
    current: string;
    completed: string[];
    remaining: string[];
    progress: number;
  } {
    const allPhases = Array.from(this.phases.values()).sort((a, b) => a.order - b.order);
    const currentIndex = allPhases.findIndex(p => p.id === this.state.currentPhase);
    
    return {
      current: this.state.currentPhase,
      completed: this.state.completedPhases.map(p => p.phaseId),
      remaining: allPhases.slice(currentIndex + 1).map(p => p.id),
      progress: currentIndex >= 0 ? (currentIndex / allPhases.length) * 100 : 0
    };
  }

  /**
   * Private helper methods
   */
  private async checkTransitionConditions(transition: PhaseTransition): Promise<ConditionStatus[]> {
    const statuses: ConditionStatus[] = [];
    
    for (const condition of transition.conditions) {
      const status = await this.checkCondition(condition);
      statuses.push(status);
    }
    
    return statuses;
  }

  private async checkCondition(condition: TransitionCondition): Promise<ConditionStatus> {
    const status: ConditionStatus = {
      condition,
      status: 'pending',
      checkedAt: new Date()
    };

    try {
      switch (condition.type) {
        case 'gate':
          const gateStatus = this.gateSystem.getGateStatus(condition.target);
          if (gateStatus?.status === 'passed') {
            status.status = 'satisfied';
          } else {
            status.status = 'failed';
            status.details = `Gate '${condition.target}' not passed`;
          }
          break;

        case 'deliverable':
          // Check if deliverable exists
          const exists = await this.checkDeliverableExists(condition.target);
          status.status = exists ? 'satisfied' : 'failed';
          status.details = exists ? undefined : `Deliverable '${condition.target}' not found`;
          break;

        case 'approval':
          // In real implementation, check for approval
          status.status = 'satisfied'; // Placeholder
          break;

        case 'custom':
          // Execute custom validation
          status.status = 'satisfied'; // Placeholder
          break;
      }
    } catch (error) {
      status.status = 'failed';
      status.details = `Error checking condition: ${error}`;
    }

    return status;
  }

  private async checkDeliverables(phase: PhaseDefinition): Promise<DeliverableStatus[]> {
    const statuses: DeliverableStatus[] = [];
    
    for (const deliverable of phase.deliverables) {
      const status = await this.checkDeliverable(deliverable);
      statuses.push(status);
    }
    
    return statuses;
  }

  private async checkDeliverable(deliverable: PhaseDeliverable): Promise<DeliverableStatus> {
    const status: DeliverableStatus = {
      name: deliverable.name,
      type: deliverable.type,
      required: deliverable.required,
      status: 'missing'
    };

    try {
      if (deliverable.path) {
        const exists = await fs.promises.access(deliverable.path)
          .then(() => true)
          .catch(() => false);
        
        if (exists) {
          status.status = 'complete';
          
          // Run custom validation if provided
          if (deliverable.validation) {
            const content = deliverable.type === 'file' 
              ? await fs.promises.readFile(deliverable.path, 'utf-8')
              : deliverable.path;
            
            const valid = await deliverable.validation(content);
            if (!valid) {
              status.status = 'invalid';
              status.error = 'Custom validation failed';
            }
          }
        }
      }
    } catch (error) {
      status.status = 'error';
      status.error = `${error}`;
    }

    return status;
  }

  private async checkDeliverableExists(target: string): Promise<boolean> {
    try {
      await fs.promises.access(target);
      return true;
    } catch {
      return false;
    }
  }

  private async executeTransitionActions(actions: TransitionAction[]): Promise<void> {
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'backup':
            await this.executeBackupAction(action.config);
            break;
          case 'archive':
            await this.executeArchiveAction(action.config);
            break;
          case 'notify':
            await this.executeNotifyAction(action.config);
            break;
          case 'execute':
            await this.executeCustomAction(action.config);
            break;
        }
      } catch (error) {
        console.error(`Failed to execute ${action.type} action:`, error);
      }
    }
  }

  private async executeBackupAction(config: Record<string, any>): Promise<void> {
    // Implement backup logic
    console.log('Executing backup action:', config);
  }

  private async executeArchiveAction(config: Record<string, any>): Promise<void> {
    // Implement archive logic
    console.log('Executing archive action:', config);
  }

  private async executeNotifyAction(config: Record<string, any>): Promise<void> {
    // Implement notification logic
    console.log('Executing notify action:', config);
  }

  private async executeCustomAction(config: Record<string, any>): Promise<void> {
    // Execute custom command or script
    console.log('Executing custom action:', config);
  }

  private async completePhase(phaseId: string): Promise<void> {
    const phase = this.phases.get(phaseId);
    if (!phase) return;

    const completedPhase: CompletedPhase = {
      phaseId,
      completedAt: new Date(),
      duration: Date.now() - (this.state.startedAt?.getTime() || Date.now()),
      deliverables: phase.deliverables.map(d => d.name),
      validationResults: this.state.validationHistory[this.state.validationHistory.length - 1]
    };

    this.state.completedPhases.push(completedPhase);
  }

  private createPhaseGates(phase: PhaseDefinition): ValidationGate[] {
    const gates: ValidationGate[] = [];
    
    // Entry gate
    gates.push({
      id: `${phase.id}-entry`,
      name: `${phase.name} Entry Validation`,
      phase: phase.id,
      type: 'pre-execution',
      severity: 'error',
      requires: {
        previousGates: phase.prerequisites.map(p => `${p}-exit`),
        conditions: ['phase_prerequisites_met']
      },
      description: `Validates prerequisites for entering ${phase.name}`
    });

    // Exit gate
    gates.push({
      id: `${phase.id}-exit`,
      name: `${phase.name} Exit Validation`,
      phase: phase.id,
      type: 'post-execution',
      severity: 'error',
      requires: {
        files: phase.deliverables.filter(d => d.type === 'file').map(d => d.path!).filter(Boolean),
        conditions: ['phase_deliverables_complete']
      },
      description: `Validates deliverables for completing ${phase.name}`
    });

    return gates;
  }

  private initializePhases(): void {
    // Initialize Vibe Coding phases
    const vibePhases: PhaseDefinition[] = [
      {
        id: 'requirements',
        name: 'Requirements Analysis',
        order: 1,
        description: 'Gather and analyze project requirements',
        prerequisites: [],
        deliverables: [
          {
            name: 'Requirements Document',
            type: 'file',
            path: 'requirements.md',
            required: true
          }
        ],
        validationGates: ['requirements-entry', 'requirements-exit']
      },
      {
        id: 'design',
        name: 'System Design',
        order: 2,
        description: 'Create system architecture and design',
        prerequisites: ['requirements'],
        deliverables: [
          {
            name: 'Architecture Document',
            type: 'file',
            path: 'architecture.md',
            required: true
          },
          {
            name: 'API Specification',
            type: 'file',
            path: 'api-spec.md',
            required: true
          }
        ],
        validationGates: ['design-entry', 'design-exit']
      },
      {
        id: 'implementation',
        name: 'Implementation',
        order: 3,
        description: 'Implement the system',
        prerequisites: ['design'],
        deliverables: [
          {
            name: 'Source Code',
            type: 'directory',
            path: 'src',
            required: true
          },
          {
            name: 'Tests',
            type: 'directory',
            path: 'tests',
            required: true
          }
        ],
        validationGates: ['implementation-entry', 'implementation-exit']
      },
      {
        id: 'testing',
        name: 'Testing & QA',
        order: 4,
        description: 'Test and ensure quality',
        prerequisites: ['implementation'],
        deliverables: [
          {
            name: 'Test Report',
            type: 'file',
            path: 'test-report.md',
            required: true
          }
        ],
        validationGates: ['testing-entry', 'testing-exit']
      },
      {
        id: 'deployment',
        name: 'Deployment',
        order: 5,
        description: 'Deploy to production',
        prerequisites: ['testing'],
        deliverables: [
          {
            name: 'Deployment Guide',
            type: 'file',
            path: 'deployment.md',
            required: true
          }
        ],
        validationGates: ['deployment-entry', 'deployment-exit']
      }
    ];

    vibePhases.forEach(phase => this.registerPhase(phase));
  }

  private initializeTransitions(): void {
    // Initialize standard transitions
    const transitions: PhaseTransition[] = [
      {
        from: 'initial',
        to: 'requirements',
        conditions: [
          {
            type: 'custom',
            target: 'project_initialized',
            required: true
          }
        ]
      },
      {
        from: 'requirements',
        to: 'design',
        conditions: [
          {
            type: 'gate',
            target: 'requirements-exit',
            required: true
          },
          {
            type: 'deliverable',
            target: 'requirements.md',
            required: true
          }
        ],
        actions: [
          {
            type: 'backup',
            config: { source: 'requirements.md', destination: '.backup/' }
          }
        ]
      },
      {
        from: 'design',
        to: 'implementation',
        conditions: [
          {
            type: 'gate',
            target: 'design-exit',
            required: true
          },
          {
            type: 'deliverable',
            target: 'architecture.md',
            required: true
          },
          {
            type: 'deliverable',
            target: 'api-spec.md',
            required: true
          }
        ]
      },
      {
        from: 'implementation',
        to: 'testing',
        conditions: [
          {
            type: 'gate',
            target: 'implementation-exit',
            required: true
          },
          {
            type: 'custom',
            target: 'code_coverage_threshold',
            required: true
          }
        ]
      },
      {
        from: 'testing',
        to: 'deployment',
        conditions: [
          {
            type: 'gate',
            target: 'testing-exit',
            required: true
          },
          {
            type: 'approval',
            target: 'qa_approval',
            required: true
          }
        ],
        actions: [
          {
            type: 'notify',
            config: { message: 'Ready for deployment', channels: ['slack', 'email'] }
          }
        ]
      }
    ];

    transitions.forEach(t => this.registerTransition(t));
  }

  private loadState(): PhaseState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const data = fs.readFileSync(this.stateFile, 'utf-8');
        const state = JSON.parse(data);
        
        // Convert date strings back to Date objects
        state.startedAt = new Date(state.startedAt);
        state.completedPhases = state.completedPhases.map((p: any) => ({
          ...p,
          completedAt: new Date(p.completedAt)
        }));
        
        return state;
      }
    } catch (error) {
      console.error('Failed to load phase state:', error);
    }

    // Return default state
    return {
      currentPhase: 'initial',
      startedAt: new Date(),
      completedPhases: [],
      validationHistory: []
    };
  }

  private saveState(): void {
    try {
      const dir = path.dirname(this.stateFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error('Failed to save phase state:', error);
    }
  }

  /**
   * Get current state
   */
  getState(): PhaseState {
    return { ...this.state };
  }

  /**
   * Reset state
   */
  resetState(): void {
    this.state = {
      currentPhase: 'initial',
      startedAt: new Date(),
      completedPhases: [],
      validationHistory: []
    };
    this.saveState();
  }
}

// Helper interfaces
interface DeliverableStatus {
  name: string;
  type: string;
  required: boolean;
  status: 'complete' | 'missing' | 'invalid' | 'error';
  error?: string;
}