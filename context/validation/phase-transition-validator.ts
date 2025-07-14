/**
 * Phase Transition Validator
 * Manages validation gates for Vibe Coding phase transitions
 */

import { ValidationGateSystem } from '../validation-gates';
import { ClaudeMdParser, ClaudeMdV2 } from '../parsers/claude-md-parser';
import { ContextMemoryStore } from '../memory/store';
import * as fs from 'fs';
import * as path from 'path';

export interface PhaseDefinition {
  name: string;
  number: number;
  requiredOutputs: string[];
  validationGates: string[];
  prerequisites: string[];
}

export interface TransitionResult {
  allowed: boolean;
  fromPhase: string;
  toPhase: string;
  failedGates: string[];
  missingOutputs: string[];
  warnings: string[];
  suggestions: string[];
}

export class PhaseTransitionValidator {
  private gateSystem: ValidationGateSystem;
  private memoryStore: ContextMemoryStore;
  private projectRoot: string;
  private claudeMd: ClaudeMdV2 | null = null;
  private currentPhase: string = 'initialization';
  
  // Standard Vibe Coding phases
  private phases: Map<string, PhaseDefinition> = new Map();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.gateSystem = new ValidationGateSystem();
    this.memoryStore = new ContextMemoryStore(projectRoot);
    
    this.initializePhases();
    this.loadClaudeMd();
  }

  private initializePhases(): void {
    // Define standard Vibe Coding phases
    const standardPhases: PhaseDefinition[] = [
      {
        name: 'initialization',
        number: 0,
        requiredOutputs: ['CLAUDE.md', '.vibe-status.md'],
        validationGates: ['project-initialized'],
        prerequisites: []
      },
      {
        name: 'ideation',
        number: 1,
        requiredOutputs: ['docs/vibe-coding/01-feature-ideation.md'],
        validationGates: ['ideation-complete'],
        prerequisites: ['initialization']
      },
      {
        name: 'architecture',
        number: 2,
        requiredOutputs: ['docs/vibe-coding/02-system-architecture.md'],
        validationGates: ['architecture-approved'],
        prerequisites: ['ideation']
      },
      {
        name: 'project-setup',
        number: 3,
        requiredOutputs: ['package.json', 'tsconfig.json', '.gitignore'],
        validationGates: ['project-setup-complete'],
        prerequisites: ['architecture']
      },
      {
        name: 'ui-principles',
        number: 4,
        requiredOutputs: ['docs/vibe-coding/04-ui-ux-principles.md'],
        validationGates: ['ui-principles-defined'],
        prerequisites: ['project-setup']
      },
      {
        name: 'detailed-design',
        number: 5,
        requiredOutputs: ['docs/vibe-coding/05-detailed-ui-ux-design.md'],
        validationGates: ['design-complete'],
        prerequisites: ['ui-principles']
      },
      {
        name: 'backend-design',
        number: 6,
        requiredOutputs: ['docs/vibe-coding/06-backend-design.md'],
        validationGates: ['backend-design-complete'],
        prerequisites: ['detailed-design']
      },
      {
        name: 'phase-planning',
        number: 7,
        requiredOutputs: ['phases/'],
        validationGates: ['phases-defined'],
        prerequisites: ['backend-design']
      },
      {
        name: 'refinement',
        number: 8,
        requiredOutputs: ['docs/vibe-coding/08-refinement.md'],
        validationGates: ['refinement-complete'],
        prerequisites: ['phase-planning']
      },
      {
        name: 'review',
        number: 9,
        requiredOutputs: ['docs/vibe-coding/09-review.md'],
        validationGates: ['review-complete'],
        prerequisites: ['refinement']
      },
      {
        name: 'implementation',
        number: 10,
        requiredOutputs: ['src/'],
        validationGates: ['implementation-ready'],
        prerequisites: ['review']
      }
    ];

    standardPhases.forEach(phase => {
      this.phases.set(phase.name, phase);
    });
  }

  private async loadClaudeMd(): Promise<void> {
    const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
    if (fs.existsSync(claudeMdPath)) {
      this.claudeMd = await ClaudeMdParser.parseFile(claudeMdPath);
      
      // Register validation gates from CLAUDE.md
      if (this.claudeMd.validationGates) {
        this.registerGatesFromClaudeMd(this.claudeMd.validationGates);
      }
    }
  }

  private registerGatesFromClaudeMd(gates: Record<string, any>): void {
    Object.entries(gates).forEach(([gateName, gateConfig]) => {
      this.gateSystem.registerGate({
        id: gateName,
        name: gateName,
        description: `Gate: ${gateName}`,
        conditions: this.parseConditions(gateConfig.conditions || []),
        preValidation: gateConfig.preValidation,
        postValidation: gateConfig.postValidation
      });
    });
  }

  private parseConditions(conditions: any[]): any[] {
    // Parse conditions from CLAUDE.md format
    return conditions.map(condition => {
      if (typeof condition === 'object') {
        return condition;
      }
      // Handle string conditions
      return { type: 'custom', value: condition };
    });
  }

  async getCurrentPhase(): Promise<string> {
    // Check .vibe-status.md for current phase
    const statusPath = path.join(this.projectRoot, '.vibe-status.md');
    
    if (fs.existsSync(statusPath)) {
      const content = fs.readFileSync(statusPath, 'utf-8');
      const phaseMatch = content.match(/Current Phase:\s*(.+)/);
      if (phaseMatch) {
        this.currentPhase = phaseMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
      }
    }
    
    return this.currentPhase;
  }

  async validateTransition(toPhase: string): Promise<TransitionResult> {
    const fromPhase = await this.getCurrentPhase();
    const result: TransitionResult = {
      allowed: true,
      fromPhase,
      toPhase,
      failedGates: [],
      missingOutputs: [],
      warnings: [],
      suggestions: []
    };

    // Get phase definitions
    const currentPhaseDef = this.phases.get(fromPhase);
    const targetPhaseDef = this.phases.get(toPhase);

    if (!targetPhaseDef) {
      result.allowed = false;
      result.warnings.push(`Unknown phase: ${toPhase}`);
      return result;
    }

    // Check prerequisites
    if (!targetPhaseDef.prerequisites.includes(fromPhase) && 
        targetPhaseDef.number !== 0) {
      result.allowed = false;
      result.warnings.push(
        `Cannot transition from ${fromPhase} to ${toPhase}. ` +
        `Prerequisites: ${targetPhaseDef.prerequisites.join(', ')}`
      );
    }

    // Validate current phase completion
    if (currentPhaseDef) {
      // Check required outputs
      for (const output of currentPhaseDef.requiredOutputs) {
        const outputPath = path.join(this.projectRoot, output);
        if (!fs.existsSync(outputPath)) {
          result.missingOutputs.push(output);
          result.allowed = false;
        }
      }

      // Check validation gates
      for (const gateId of currentPhaseDef.validationGates) {
        const gateResult = await this.gateSystem.validateGate(gateId, {
          phase: fromPhase,
          files: currentPhaseDef.requiredOutputs,
          sections: [],
          previousGates: [],
          metadata: { toPhase }
        });

        if (!gateResult.passed) {
          result.failedGates.push(gateId);
          result.allowed = false;
          result.warnings.push(...gateResult.errors);
          result.suggestions.push(...gateResult.suggestions);
        }
      }
    }

    // Add suggestions based on failures
    if (result.missingOutputs.length > 0) {
      result.suggestions.push(
        `Complete missing outputs: ${result.missingOutputs.join(', ')}`
      );
    }

    if (result.failedGates.length > 0) {
      result.suggestions.push(
        `Fix validation issues for gates: ${result.failedGates.join(', ')}`
      );
    }

    // Record transition attempt
    this.recordTransitionAttempt(result);

    return result;
  }

  private recordTransitionAttempt(result: TransitionResult): void {
    this.memoryStore.recordDecision({
      id: `transition-${Date.now()}`,
      type: 'phase-transition',
      context: `${result.fromPhase} → ${result.toPhase}`,
      choice: result.allowed ? 'proceed' : 'blocked',
      reasoning: result.warnings.join('; ') || 'All validations passed',
      timestamp: new Date(),
      impact: result.allowed ? 'positive' : 'negative'
    });
  }

  async forceTransition(toPhase: string, reason: string): Promise<void> {
    // Allow forced transition with documentation
    const fromPhase = await this.getCurrentPhase();
    
    // Update status
    const statusPath = path.join(this.projectRoot, '.vibe-status.md');
    let content = '';
    
    if (fs.existsSync(statusPath)) {
      content = fs.readFileSync(statusPath, 'utf-8');
      content = content.replace(
        /Current Phase:\s*.+/,
        `Current Phase: ${toPhase}`
      );
    } else {
      content = `# Vibe Coding Status\n\nCurrent Phase: ${toPhase}\n`;
    }
    
    // Add forced transition note
    content += `\n\n## Forced Transition Note\n`;
    content += `- From: ${fromPhase}\n`;
    content += `- To: ${toPhase}\n`;
    content += `- Reason: ${reason}\n`;
    content += `- Timestamp: ${new Date().toISOString()}\n`;
    
    fs.writeFileSync(statusPath, content);
    
    // Record in memory
    this.memoryStore.recordDecision({
      id: `forced-transition-${Date.now()}`,
      type: 'forced-phase-transition',
      context: `${fromPhase} → ${toPhase}`,
      choice: 'force',
      reasoning: reason,
      timestamp: new Date(),
      impact: 'neutral'
    });
    
    this.currentPhase = toPhase;
  }

  async getPhaseCompletionStatus(): Promise<{
    phase: string;
    completedOutputs: string[];
    missingOutputs: string[];
    passedGates: string[];
    failedGates: string[];
    completionPercentage: number;
  }> {
    const phase = await this.getCurrentPhase();
    const phaseDef = this.phases.get(phase);
    
    if (!phaseDef) {
      return {
        phase,
        completedOutputs: [],
        missingOutputs: [],
        passedGates: [],
        failedGates: [],
        completionPercentage: 0
      };
    }

    const status = {
      phase,
      completedOutputs: [] as string[],
      missingOutputs: [] as string[],
      passedGates: [] as string[],
      failedGates: [] as string[],
      completionPercentage: 0
    };

    // Check outputs
    for (const output of phaseDef.requiredOutputs) {
      const outputPath = path.join(this.projectRoot, output);
      if (fs.existsSync(outputPath)) {
        status.completedOutputs.push(output);
      } else {
        status.missingOutputs.push(output);
      }
    }

    // Check gates
    for (const gateId of phaseDef.validationGates) {
      const gateStatus = await this.gateSystem.getGateStatus(gateId);
      if (gateStatus?.status === 'passed') {
        status.passedGates.push(gateId);
      } else {
        status.failedGates.push(gateId);
      }
    }

    // Calculate completion
    const totalRequirements = 
      phaseDef.requiredOutputs.length + phaseDef.validationGates.length;
    const completed = 
      status.completedOutputs.length + status.passedGates.length;
    
    status.completionPercentage = totalRequirements > 0 ? 
      Math.round((completed / totalRequirements) * 100) : 0;

    return status;
  }

  getPhaseDefinition(phaseName: string): PhaseDefinition | undefined {
    return this.phases.get(phaseName);
  }

  getAllPhases(): PhaseDefinition[] {
    return Array.from(this.phases.values()).sort((a, b) => a.number - b.number);
  }

  async getTransitionHistory(): Promise<Array<{
    timestamp: Date;
    from: string;
    to: string;
    success: boolean;
    reason?: string;
  }>> {
    const decisions = this.memoryStore.getDecisionsByType('phase-transition');
    
    return decisions.map(decision => {
      const [from, to] = decision.context.split(' → ');
      return {
        timestamp: decision.timestamp,
        from,
        to,
        success: decision.choice === 'proceed',
        reason: decision.reasoning
      };
    });
  }

  async suggestNextSteps(): Promise<string[]> {
    const status = await this.getPhaseCompletionStatus();
    const suggestions: string[] = [];

    // Suggest completing missing outputs
    if (status.missingOutputs.length > 0) {
      suggestions.push(
        `Complete missing outputs for ${status.phase}: ${status.missingOutputs.join(', ')}`
      );
    }

    // Suggest fixing failed gates
    if (status.failedGates.length > 0) {
      suggestions.push(
        `Fix validation issues: ${status.failedGates.join(', ')}`
      );
    }

    // If phase is complete, suggest next phase
    if (status.completionPercentage === 100) {
      const currentPhaseDef = this.phases.get(status.phase);
      if (currentPhaseDef) {
        const nextPhase = Array.from(this.phases.values())
          .find(p => p.number === currentPhaseDef.number + 1);
        
        if (nextPhase) {
          suggestions.push(`Ready to transition to ${nextPhase.name}`);
        }
      }
    }

    return suggestions;
  }
}