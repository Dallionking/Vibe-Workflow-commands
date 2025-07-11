/**
 * Validation Gate System
 * Implements validation gates defined in CLAUDE.md v2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import { ValidationGate, ValidationResult, ValidationCondition } from './types/context.types';

interface GateContext {
  phase: string;
  task?: string;
  files: string[];
  sections: string[];
  previousGates: string[];
  metadata: Record<string, any>;
}

interface GateRegistry {
  [gateId: string]: {
    gate: ValidationGate;
    status: 'pending' | 'passed' | 'failed';
    lastChecked?: Date;
    errors?: string[];
  };
}

export class ValidationGateSystem {
  private registry: GateRegistry = {};
  private conditionHandlers: Map<string, (context: GateContext) => Promise<boolean>> = new Map();
  private customValidators: Map<string, (gate: ValidationGate, context: GateContext) => Promise<ValidationResult>> = new Map();

  constructor() {
    this.registerDefaultConditions();
  }

  /**
   * Register a validation gate
   */
  registerGate(gate: ValidationGate): void {
    this.registry[gate.id] = {
      gate,
      status: 'pending'
    };
  }

  /**
   * Register multiple gates
   */
  registerGates(gates: ValidationGate[]): void {
    gates.forEach(gate => this.registerGate(gate));
  }

  /**
   * Register custom condition handler
   */
  registerCondition(name: string, handler: (context: GateContext) => Promise<boolean>): void {
    this.conditionHandlers.set(name, handler);
  }

  /**
   * Register custom validator
   */
  registerValidator(gateId: string, validator: (gate: ValidationGate, context: GateContext) => Promise<ValidationResult>): void {
    this.customValidators.set(gateId, validator);
  }

  /**
   * Validate gates for a phase
   */
  async validatePhase(phase: string, context: Partial<GateContext> = {}): Promise<{
    passed: boolean;
    gates: Array<{
      id: string;
      passed: boolean;
      errors: string[];
    }>;
  }> {
    const phaseGates = Object.values(this.registry)
      .filter(entry => 
        entry.gate.phase === phase || 
        entry.gate.phase === '*'
      )
      .map(entry => entry.gate);

    const results = await Promise.all(
      phaseGates.map(gate => this.validateGate(gate.id, context))
    );

    return {
      passed: results.every(r => r.passed),
      gates: results.map((r, i) => ({
        id: phaseGates[i].id,
        passed: r.passed,
        errors: r.errors
      }))
    };
  }

  /**
   * Validate a specific gate
   */
  async validateGate(gateId: string, context: Partial<GateContext> = {}): Promise<ValidationResult> {
    const entry = this.registry[gateId];
    if (!entry) {
      return {
        passed: false,
        errors: [`Gate '${gateId}' not found`]
      };
    }

    const gate = entry.gate;
    const fullContext = this.buildContext(gate, context);

    // Use custom validator if available
    if (this.customValidators.has(gateId)) {
      const validator = this.customValidators.get(gateId)!;
      const result = await validator(gate, fullContext);
      this.updateGateStatus(gateId, result);
      return result;
    }

    // Default validation
    const errors: string[] = [];

    // Validate required sections
    if (gate.requires.sections) {
      const missingSections = await this.validateSections(gate.requires.sections, fullContext);
      errors.push(...missingSections);
    }

    // Validate required files
    if (gate.requires.files) {
      const missingFiles = await this.validateFiles(gate.requires.files);
      errors.push(...missingFiles);
    }

    // Validate previous gates
    if (gate.requires.previousGates) {
      const failedGates = await this.validatePreviousGates(gate.requires.previousGates);
      errors.push(...failedGates);
    }

    // Validate conditions
    if (gate.requires.conditions) {
      const failedConditions = await this.validateConditions(gate.requires.conditions, fullContext);
      errors.push(...failedConditions);
    }

    const result: ValidationResult = {
      passed: errors.length === 0,
      errors
    };

    this.updateGateStatus(gateId, result);
    return result;
  }

  /**
   * Build full context for validation
   */
  private buildContext(gate: ValidationGate, partial: Partial<GateContext>): GateContext {
    return {
      phase: gate.phase,
      task: partial.task,
      files: partial.files || [],
      sections: partial.sections || [],
      previousGates: Object.keys(this.registry)
        .filter(id => this.registry[id].status === 'passed'),
      metadata: partial.metadata || {}
    };
  }

  /**
   * Validate required sections
   */
  private async validateSections(required: string[], context: GateContext): Promise<string[]> {
    const errors: string[] = [];
    
    for (const section of required) {
      if (!context.sections.some(s => 
        s.toLowerCase().includes(section.toLowerCase())
      )) {
        errors.push(`Missing required section: ${section}`);
      }
    }

    return errors;
  }

  /**
   * Validate required files
   */
  private async validateFiles(required: string[]): Promise<string[]> {
    const errors: string[] = [];
    
    for (const file of required) {
      try {
        await fs.promises.access(file, fs.constants.R_OK);
      } catch {
        errors.push(`Missing or inaccessible file: ${file}`);
      }
    }

    return errors;
  }

  /**
   * Validate previous gates
   */
  private async validatePreviousGates(required: string[]): Promise<string[]> {
    const errors: string[] = [];
    
    for (const gateId of required) {
      const entry = this.registry[gateId];
      if (!entry) {
        errors.push(`Unknown previous gate: ${gateId}`);
      } else if (entry.status !== 'passed') {
        errors.push(`Previous gate not passed: ${gateId}`);
      }
    }

    return errors;
  }

  /**
   * Validate conditions
   */
  private async validateConditions(conditions: string[], context: GateContext): Promise<string[]> {
    const errors: string[] = [];
    
    for (const condition of conditions) {
      const handler = this.conditionHandlers.get(condition);
      if (!handler) {
        errors.push(`Unknown condition: ${condition}`);
        continue;
      }

      try {
        const passed = await handler(context);
        if (!passed) {
          errors.push(`Condition failed: ${condition}`);
        }
      } catch (error) {
        errors.push(`Condition error '${condition}': ${error}`);
      }
    }

    return errors;
  }

  /**
   * Update gate status
   */
  private updateGateStatus(gateId: string, result: ValidationResult): void {
    const entry = this.registry[gateId];
    if (entry) {
      entry.status = result.passed ? 'passed' : 'failed';
      entry.lastChecked = new Date();
      entry.errors = result.errors;
    }
  }

  /**
   * Register default condition handlers
   */
  private registerDefaultConditions(): void {
    // Has project description
    this.registerCondition('has_project_description', async (context) => {
      return context.sections.some(s => 
        s.toLowerCase().includes('project') && 
        s.toLowerCase().includes('overview')
      );
    });

    // Has user stories
    this.registerCondition('has_user_stories', async (context) => {
      const requirementsFile = 'requirements.md';
      if (!fs.existsSync(requirementsFile)) {
        return false;
      }
      
      const content = await fs.promises.readFile(requirementsFile, 'utf-8');
      return content.toLowerCase().includes('user stor');
    });

    // Passes linting
    this.registerCondition('passes_linting', async (context) => {
      // Check for linting errors in recent files
      const lintResults = context.metadata.lintResults;
      return !lintResults || lintResults.errorCount === 0;
    });

    // Passes tests
    this.registerCondition('passes_tests', async (context) => {
      // Check test results
      const testResults = context.metadata.testResults;
      return testResults?.passed === true;
    });

    // Has documentation
    this.registerCondition('has_documentation', async (context) => {
      return context.files.some(f => 
        f.endsWith('.md') || 
        f.includes('README')
      );
    });

    // Has tests
    this.registerCondition('has_tests', async (context) => {
      return context.files.some(f => 
        f.includes('.test.') || 
        f.includes('.spec.') ||
        f.includes('__tests__')
      );
    });

    // Git clean
    this.registerCondition('git_clean', async (context) => {
      const gitStatus = context.metadata.gitStatus;
      return gitStatus?.clean === true;
    });

    // Dependencies installed
    this.registerCondition('dependencies_installed', async (context) => {
      return fs.existsSync('node_modules') || 
             fs.existsSync('vendor') || 
             fs.existsSync('.venv');
    });
  }

  /**
   * Get gate status
   */
  getGateStatus(gateId: string): {
    status: 'pending' | 'passed' | 'failed';
    lastChecked?: Date;
    errors?: string[];
  } | null {
    const entry = this.registry[gateId];
    if (!entry) return null;

    return {
      status: entry.status,
      lastChecked: entry.lastChecked,
      errors: entry.errors
    };
  }

  /**
   * Get all gates for phase
   */
  getGatesForPhase(phase: string): ValidationGate[] {
    return Object.values(this.registry)
      .filter(entry => 
        entry.gate.phase === phase || 
        entry.gate.phase === '*'
      )
      .map(entry => entry.gate);
  }

  /**
   * Reset gate status
   */
  resetGate(gateId: string): void {
    const entry = this.registry[gateId];
    if (entry) {
      entry.status = 'pending';
      entry.lastChecked = undefined;
      entry.errors = undefined;
    }
  }

  /**
   * Reset all gates
   */
  resetAllGates(): void {
    Object.keys(this.registry).forEach(gateId => this.resetGate(gateId));
  }

  /**
   * Export gate status
   */
  exportStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    Object.entries(this.registry).forEach(([id, entry]) => {
      status[id] = {
        phase: entry.gate.phase,
        status: entry.status,
        lastChecked: entry.lastChecked,
        errors: entry.errors
      };
    });

    return status;
  }

  /**
   * Import gate status
   */
  importStatus(status: Record<string, any>): void {
    Object.entries(status).forEach(([id, data]) => {
      if (this.registry[id]) {
        this.registry[id].status = data.status;
        this.registry[id].lastChecked = data.lastChecked ? new Date(data.lastChecked) : undefined;
        this.registry[id].errors = data.errors;
      }
    });
  }

  /**
   * Create gate report
   */
  createReport(): string {
    let report = '# Validation Gate Report\n\n';
    
    const phases = new Set(Object.values(this.registry).map(e => e.gate.phase));
    
    phases.forEach(phase => {
      report += `## Phase: ${phase}\n\n`;
      
      const phaseGates = Object.values(this.registry)
        .filter(e => e.gate.phase === phase);
      
      phaseGates.forEach(entry => {
        const statusIcon = entry.status === 'passed' ? '✅' : 
                          entry.status === 'failed' ? '❌' : '⏳';
        
        report += `### ${statusIcon} ${entry.gate.id}\n`;
        report += `- Status: ${entry.status}\n`;
        
        if (entry.lastChecked) {
          report += `- Last Checked: ${entry.lastChecked.toISOString()}\n`;
        }
        
        if (entry.errors && entry.errors.length > 0) {
          report += `- Errors:\n`;
          entry.errors.forEach(error => {
            report += `  - ${error}\n`;
          });
        }
        
        report += '\n';
      });
    });

    return report;
  }
}