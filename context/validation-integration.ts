/**
 * Validation System Integration
 * Demonstrates how to integrate all validation components
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  ValidationGate, 
  ValidationResult,
  GateContext
} from './types/context.types';
import { ValidationGateSystem } from './validation-gates';
import { ValidationExecutionEngine } from './validation-engine';
import { PhaseTransitionValidator } from './phase-transition-validator';
import { CommandValidationHooks, CommandContext } from './command-validation-hooks';
import { ValidationReporter, ReportOptions } from './validation-reporter';

export class VibeValidationSystem {
  private gateSystem: ValidationGateSystem;
  private executionEngine: ValidationExecutionEngine;
  private phaseValidator: PhaseTransitionValidator;
  private commandHooks: CommandValidationHooks;
  private reporter: ValidationReporter;
  private initialized: boolean = false;

  constructor() {
    // Initialize core components
    this.gateSystem = new ValidationGateSystem();
    this.executionEngine = new ValidationExecutionEngine(this.gateSystem);
    this.phaseValidator = new PhaseTransitionValidator(this.gateSystem);
    this.commandHooks = new CommandValidationHooks(this.gateSystem, this.phaseValidator);
    this.reporter = new ValidationReporter();
  }

  /**
   * Initialize the validation system
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Register default validation gates
    this.registerDefaultGates();
    
    // Register custom conditions
    this.registerCustomConditions();
    
    // Register command hooks
    this.registerCommandHooks();
    
    // Set up event listeners
    this.setupEventListeners();

    this.initialized = true;
  }

  /**
   * Execute command with full validation
   */
  async executeCommand(
    command: string,
    args: string[],
    options: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    result?: any;
    validation: {
      pre?: any;
      post?: any;
    };
    report?: string;
  }> {
    const context: CommandContext = {
      command,
      args,
      options,
      phase: options.phase || this.phaseValidator.getState().currentPhase,
      task: options.task,
      user: options.user || 'system',
      timestamp: new Date()
    };

    // Pre-command validation
    const preValidation = await this.commandHooks.validatePreCommand(context);
    
    if (!preValidation.proceed) {
      const report = this.generateValidationReport(preValidation, 'pre-command');
      return {
        success: false,
        validation: { pre: preValidation },
        report
      };
    }

    // Execute command (simulated)
    let commandResult: any;
    try {
      commandResult = await this.simulateCommandExecution(command, args, options);
    } catch (error) {
      return {
        success: false,
        result: error,
        validation: { pre: preValidation }
      };
    }

    // Post-command validation
    const postValidation = await this.commandHooks.validatePostCommand(context, commandResult);
    
    // Generate comprehensive report
    const report = this.generateComprehensiveReport({
      command,
      preValidation,
      postValidation,
      commandResult
    });

    return {
      success: postValidation.success,
      result: commandResult,
      validation: {
        pre: preValidation,
        post: postValidation
      },
      report
    };
  }

  /**
   * Validate phase transition
   */
  async validatePhaseTransition(toPhase: string): Promise<{
    allowed: boolean;
    report: string;
    blockers?: string[];
  }> {
    const result = await this.phaseValidator.canTransition(
      this.phaseValidator.getState().currentPhase,
      toPhase
    );

    const report = this.reporter.generatePhaseProgressReport(
      this.phaseValidator.getState(),
      this.phaseValidator.getPhaseProgress()
    );

    return {
      allowed: result.allowed,
      report,
      blockers: result.blockers
    };
  }

  /**
   * Execute phase transition with validation
   */
  async transitionToPhase(toPhase: string): Promise<{
    success: boolean;
    report: string;
    errors?: string[];
  }> {
    const result = await this.phaseValidator.transitionTo(toPhase);
    
    let report = '';
    if (result.validation) {
      report = this.reporter.generateReport(result.validation, {
        format: 'markdown',
        verbosity: 'detailed'
      });
    }

    return {
      success: result.success,
      report,
      errors: result.errors
    };
  }

  /**
   * Get validation status dashboard
   */
  async getValidationDashboard(): Promise<string> {
    const phaseState = this.phaseValidator.getState();
    const phaseProgress = this.phaseValidator.getPhaseProgress();
    const gateStatus = this.gateSystem.exportStatus();
    const executionHistory = this.commandHooks.getExecutionHistory(10);

    let dashboard = '# Vibe Validation Dashboard\n\n';
    
    // Phase progress
    dashboard += '## Phase Progress\n';
    dashboard += this.reporter.generatePhaseProgressReport(phaseState, phaseProgress, {
      format: 'markdown'
    });
    
    // Recent validations
    dashboard += '\n\n## Recent Command Validations\n';
    if (executionHistory.length > 0) {
      dashboard += '| Command | Status | Errors | Warnings | Time |\n';
      dashboard += '|---------|--------|--------|----------|------|\n';
      
      executionHistory.forEach(record => {
        const status = record.successful ? '✅' : '❌';
        dashboard += `| ${record.command} | ${status} | ${record.errors.length} | ${record.warnings.length} | ${record.timestamp.toLocaleTimeString()} |\n`;
      });
    } else {
      dashboard += '_No recent command executions_\n';
    }

    // Gate status summary
    dashboard += '\n\n## Validation Gate Status\n';
    const gates = Object.entries(gateStatus);
    const passed = gates.filter(([_, s]) => s.status === 'passed').length;
    const failed = gates.filter(([_, s]) => s.status === 'failed').length;
    const pending = gates.filter(([_, s]) => s.status === 'pending').length;
    
    dashboard += `- **Total Gates:** ${gates.length}\n`;
    dashboard += `- **Passed:** ${passed} ✅\n`;
    dashboard += `- **Failed:** ${failed} ❌\n`;
    dashboard += `- **Pending:** ${pending} ⏳\n`;

    return dashboard;
  }

  /**
   * Register default validation gates
   */
  private registerDefaultGates(): void {
    const gates: ValidationGate[] = [
      // Project setup gates
      {
        id: 'project-initialized',
        name: 'Project Initialized',
        phase: 'initial',
        type: 'pre-execution',
        severity: 'error',
        requires: {
          files: ['package.json', '.gitignore'],
          conditions: ['has_project_description']
        },
        description: 'Ensures project is properly initialized'
      },
      
      // Code quality gates
      {
        id: 'code-quality',
        name: 'Code Quality Standards',
        phase: 'implementation',
        type: 'continuous',
        severity: 'warning',
        requires: {
          conditions: ['passes_linting', 'no_console_logs']
        },
        description: 'Maintains code quality standards'
      },
      
      // Test coverage gates
      {
        id: 'test-coverage',
        name: 'Test Coverage Requirements',
        phase: 'testing',
        type: 'post-execution',
        severity: 'error',
        requires: {
          conditions: ['has_tests', 'coverage_threshold_met']
        },
        description: 'Ensures adequate test coverage'
      },
      
      // Documentation gates
      {
        id: 'documentation-complete',
        name: 'Documentation Completeness',
        phase: 'deployment',
        type: 'pre-execution',
        severity: 'warning',
        requires: {
          files: ['README.md', 'CHANGELOG.md'],
          conditions: ['has_api_docs', 'has_deployment_guide']
        },
        description: 'Verifies documentation is complete'
      }
    ];

    this.gateSystem.registerGates(gates);
  }

  /**
   * Register custom validation conditions
   */
  private registerCustomConditions(): void {
    // No console logs condition
    this.gateSystem.registerCondition('no_console_logs', async (context) => {
      const files = context.files.filter(f => f.endsWith('.ts') || f.endsWith('.js'));
      
      for (const file of files) {
        try {
          const content = await fs.promises.readFile(file, 'utf-8');
          if (content.includes('console.log')) {
            return false;
          }
        } catch {
          // Ignore file read errors
        }
      }
      
      return true;
    });

    // Coverage threshold condition
    this.gateSystem.registerCondition('coverage_threshold_met', async (context) => {
      const coverageFile = 'coverage/coverage-summary.json';
      
      try {
        const coverage = JSON.parse(await fs.promises.readFile(coverageFile, 'utf-8'));
        const totalCoverage = coverage.total?.lines?.pct || 0;
        return totalCoverage >= 80;
      } catch {
        return false;
      }
    });

    // API docs condition
    this.gateSystem.registerCondition('has_api_docs', async (context) => {
      return fs.existsSync('docs/api.md') || fs.existsSync('api-docs');
    });

    // Deployment guide condition
    this.gateSystem.registerCondition('has_deployment_guide', async (context) => {
      const possibleFiles = ['DEPLOYMENT.md', 'docs/deployment.md', 'deploy/README.md'];
      return possibleFiles.some(f => fs.existsSync(f));
    });
  }

  /**
   * Register command validation hooks
   */
  private registerCommandHooks(): void {
    // Build command hook
    this.commandHooks.registerHook({
      id: 'build-prerequisites',
      name: 'Build Prerequisites Check',
      commands: ['build'],
      stage: 'pre',
      priority: 100,
      enabled: true,
      validate: async (context) => {
        const errors: string[] = [];
        
        // Check if source files exist
        if (!fs.existsSync('src')) {
          errors.push('Source directory not found');
        }
        
        // Check if tsconfig exists for TS projects
        if (fs.existsSync('tsconfig.json')) {
          try {
            JSON.parse(await fs.promises.readFile('tsconfig.json', 'utf-8'));
          } catch {
            errors.push('Invalid tsconfig.json');
          }
        }
        
        return {
          passed: errors.length === 0,
          errors,
          shouldProceed: false
        };
      }
    });

    // Deploy command hook
    this.commandHooks.registerHook({
      id: 'deploy-safety',
      name: 'Deploy Safety Check',
      commands: ['deploy'],
      stage: 'pre',
      priority: 95,
      enabled: true,
      validate: async (context) => {
        const warnings: string[] = [];
        const errors: string[] = [];
        
        // Check if on main branch
        // In real implementation, check actual git branch
        const isMainBranch = true; // Placeholder
        
        if (!isMainBranch) {
          warnings.push('Not on main branch');
        }
        
        // Check if tests passed
        const testsPassed = await this.checkTestResults();
        if (!testsPassed) {
          errors.push('Tests must pass before deployment');
        }
        
        return {
          passed: errors.length === 0,
          errors,
          warnings,
          shouldProceed: errors.length === 0
        };
      }
    });
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Execution engine events
    this.executionEngine.on('validation:start', (data) => {
      console.log(`🔍 Starting validation for phase: ${data.phase}`);
    });

    this.executionEngine.on('gate:complete', (result) => {
      if (result.status === 'failed') {
        console.log(`❌ Gate failed: ${result.gateName}`);
      }
    });

    // Command hooks events
    this.commandHooks.on('validation:pre:failed', (data) => {
      console.log(`⚠️  Pre-command validation failed: ${data.errors.join(', ')}`);
    });

    // Phase validator events
    this.phaseValidator.on('phase:transition:complete', (data) => {
      console.log(`✅ Transitioned to phase: ${data.to}`);
    });
  }

  /**
   * Helper methods
   */
  private async simulateCommandExecution(
    command: string,
    args: string[],
    options: Record<string, any>
  ): Promise<any> {
    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      command,
      args,
      options,
      output: `Executed ${command} successfully`,
      exitCode: 0
    };
  }

  private async checkTestResults(): Promise<boolean> {
    // In real implementation, check actual test results
    return true;
  }

  private generateValidationReport(validation: any, stage: string): string {
    const report = [`## ${stage} Validation Report\n`];
    
    if (validation.errors && validation.errors.length > 0) {
      report.push('### Errors');
      validation.errors.forEach((error: string) => {
        report.push(`- ❌ ${error}`);
      });
    }
    
    if (validation.warnings && validation.warnings.length > 0) {
      report.push('\n### Warnings');
      validation.warnings.forEach((warning: string) => {
        report.push(`- ⚠️  ${warning}`);
      });
    }
    
    return report.join('\n');
  }

  private generateComprehensiveReport(data: any): string {
    const sections: string[] = ['# Command Execution Report\n'];
    
    sections.push(`## Command: ${data.command}`);
    sections.push(`Executed at: ${new Date().toISOString()}\n`);
    
    // Pre-validation results
    if (data.preValidation) {
      sections.push('## Pre-Command Validation');
      sections.push(this.generateValidationReport(data.preValidation, 'Pre-command'));
    }
    
    // Command result
    sections.push('\n## Command Execution');
    sections.push(`Status: ${data.commandResult?.exitCode === 0 ? '✅ Success' : '❌ Failed'}`);
    if (data.commandResult?.output) {
      sections.push(`Output: ${data.commandResult.output}`);
    }
    
    // Post-validation results
    if (data.postValidation) {
      sections.push('\n## Post-Command Validation');
      sections.push(this.generateValidationReport(data.postValidation, 'Post-command'));
      
      // Improvements
      if (data.postValidation.improvements && data.postValidation.improvements.length > 0) {
        sections.push('\n## Suggested Improvements');
        data.postValidation.improvements.forEach((imp: string) => {
          sections.push(`- 💡 ${imp}`);
        });
      }
    }
    
    return sections.join('\n');
  }
}

/**
 * Example usage
 */
export async function demonstrateValidationSystem(): Promise<void> {
  console.log('🚀 Vibe Validation System Demo\n');
  
  // Initialize system
  const validationSystem = new VibeValidationSystem();
  await validationSystem.initialize();
  
  // Example 1: Execute command with validation
  console.log('📋 Example 1: Build Command with Validation');
  const buildResult = await validationSystem.executeCommand('build', ['--prod'], {
    phase: 'implementation'
  });
  
  console.log('Result:', buildResult.success ? '✅ Success' : '❌ Failed');
  if (buildResult.report) {
    console.log('\nReport Preview:');
    console.log(buildResult.report.substring(0, 500) + '...');
  }
  
  // Example 2: Validate phase transition
  console.log('\n📋 Example 2: Phase Transition Validation');
  const transitionCheck = await validationSystem.validatePhaseTransition('testing');
  
  console.log('Can transition:', transitionCheck.allowed ? '✅ Yes' : '❌ No');
  if (transitionCheck.blockers) {
    console.log('Blockers:', transitionCheck.blockers);
  }
  
  // Example 3: Get validation dashboard
  console.log('\n📋 Example 3: Validation Dashboard');
  const dashboard = await validationSystem.getValidationDashboard();
  console.log(dashboard);
  
  // Example 4: Execute phase transition
  console.log('\n📋 Example 4: Execute Phase Transition');
  const transitionResult = await validationSystem.transitionToPhase('testing');
  
  console.log('Transition result:', transitionResult.success ? '✅ Success' : '❌ Failed');
  if (transitionResult.errors) {
    console.log('Errors:', transitionResult.errors);
  }
}

// Run demo if executed directly
if (require.main === module) {
  demonstrateValidationSystem().catch(console.error);
}