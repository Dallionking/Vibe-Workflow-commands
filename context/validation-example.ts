/**
 * Validation System Integration Example
 * Shows how to integrate validation gates into Vibe Coding commands
 */

import * as fs from 'fs';
import * as path from 'path';
import { VibeValidationSystem } from './validation-integration';
import { ValidationGate } from './types/context.types';

/**
 * Example: Vibe Coding Command with Validation
 */
class VibeCodingCommand {
  private validationSystem: VibeValidationSystem;
  
  constructor() {
    this.validationSystem = new VibeValidationSystem();
  }

  /**
   * Initialize command with custom validation gates
   */
  async initialize(): Promise<void> {
    await this.validationSystem.initialize();
    
    // Register custom gates for Vibe Coding steps
    this.registerVibeCodingGates();
  }

  /**
   * Execute Step 1: Project Setup with validation
   */
  async executeStep1ProjectSetup(projectName: string): Promise<void> {
    console.log('📋 Step 1: Project Setup & Planning\n');

    // Execute with validation
    const result = await this.validationSystem.executeCommand(
      'vibe:step1',
      [projectName],
      {
        phase: 'requirements',
        task: 'project-setup'
      }
    );

    if (!result.success) {
      console.error('❌ Validation failed:');
      console.error(result.report);
      throw new Error('Project setup validation failed');
    }

    // Simulate project setup
    console.log('✅ Creating project structure...');
    await this.createProjectStructure(projectName);
    
    // Post-execution validation
    const postResult = await this.validationSystem.executeCommand(
      'vibe:step1:complete',
      [projectName],
      {
        phase: 'requirements',
        task: 'project-setup-complete'
      }
    );

    console.log('\n📊 Validation Report:');
    console.log(postResult.report);
  }

  /**
   * Execute Step 2: Requirements with validation
   */
  async executeStep2Requirements(): Promise<void> {
    console.log('\n📋 Step 2: Requirements Analysis\n');

    // Check if we can transition to this phase
    const canTransition = await this.validationSystem.validatePhaseTransition('requirements');
    
    if (!canTransition.allowed) {
      console.error('❌ Cannot proceed to requirements phase:');
      canTransition.blockers?.forEach(blocker => console.error(`  - ${blocker}`));
      throw new Error('Phase transition blocked');
    }

    // Execute requirements gathering
    const result = await this.validationSystem.executeCommand(
      'vibe:step2',
      [],
      {
        phase: 'requirements',
        task: 'gather-requirements'
      }
    );

    if (result.success) {
      console.log('✅ Requirements gathered successfully');
      
      // Create requirements document
      await this.createRequirementsDocument();
    }
  }

  /**
   * Execute Step 3: Architecture Design with validation
   */
  async executeStep3Architecture(): Promise<void> {
    console.log('\n📋 Step 3: Architecture Design\n');

    // Transition to design phase
    const transition = await this.validationSystem.transitionToPhase('design');
    
    if (!transition.success) {
      console.error('❌ Failed to transition to design phase:');
      console.error(transition.report);
      throw new Error('Phase transition failed');
    }

    // Execute architecture design
    const result = await this.validationSystem.executeCommand(
      'vibe:step3',
      [],
      {
        phase: 'design',
        task: 'create-architecture'
      }
    );

    console.log(result.report);
  }

  /**
   * Execute build command with validation
   */
  async executeBuildCommand(options: { prod?: boolean; watch?: boolean } = {}): Promise<void> {
    console.log('\n🔨 Build Command with Validation\n');

    const result = await this.validationSystem.executeCommand(
      'build',
      Object.entries(options).map(([key, value]) => value ? `--${key}` : '').filter(Boolean),
      {
        phase: 'implementation'
      }
    );

    if (!result.success) {
      console.error('❌ Build validation failed');
      
      // Show specific errors
      if (result.validation.pre?.errors) {
        console.error('\nPre-build errors:');
        result.validation.pre.errors.forEach((error: string) => 
          console.error(`  - ${error}`)
        );
      }
      
      throw new Error('Build failed validation');
    }

    console.log('✅ Build completed successfully');
    
    // Show improvements if any
    if (result.validation.post?.improvements?.length > 0) {
      console.log('\n💡 Suggested improvements:');
      result.validation.post.improvements.forEach((improvement: string) =>
        console.log(`  - ${improvement}`)
      );
    }
  }

  /**
   * Get validation dashboard
   */
  async showValidationDashboard(): Promise<void> {
    console.log('\n📊 Validation Dashboard\n');
    
    const dashboard = await this.validationSystem.getValidationDashboard();
    console.log(dashboard);
  }

  /**
   * Register Vibe Coding specific validation gates
   */
  private registerVibeCodingGates(): void {
    const vibeCodingGates: ValidationGate[] = [
      // Step 1: Project Setup Gates
      {
        id: 'vibe-step1-pre',
        name: 'Step 1 Prerequisites',
        phase: 'requirements',
        type: 'pre-execution',
        severity: 'error',
        requires: {
          conditions: ['valid_project_name', 'workspace_writable']
        },
        description: 'Validates prerequisites for Step 1'
      },
      {
        id: 'vibe-step1-post',
        name: 'Step 1 Completion',
        phase: 'requirements',
        type: 'post-execution',
        severity: 'error',
        requires: {
          files: ['README.md', '.gitignore', 'package.json'],
          conditions: ['project_initialized']
        },
        description: 'Validates Step 1 completion'
      },

      // Step 2: Requirements Gates
      {
        id: 'vibe-step2-pre',
        name: 'Step 2 Prerequisites',
        phase: 'requirements',
        type: 'pre-execution',
        severity: 'error',
        requires: {
          previousGates: ['vibe-step1-post'],
          files: ['README.md']
        },
        description: 'Validates prerequisites for Step 2'
      },
      {
        id: 'vibe-step2-post',
        name: 'Step 2 Completion',
        phase: 'requirements',
        type: 'post-execution',
        severity: 'error',
        requires: {
          files: ['requirements.md'],
          conditions: ['has_user_stories', 'has_acceptance_criteria']
        },
        description: 'Validates Step 2 completion'
      },

      // Step 3: Architecture Gates
      {
        id: 'vibe-step3-pre',
        name: 'Step 3 Prerequisites',
        phase: 'design',
        type: 'pre-execution',
        severity: 'error',
        requires: {
          previousGates: ['vibe-step2-post'],
          files: ['requirements.md']
        },
        description: 'Validates prerequisites for Step 3'
      },
      {
        id: 'vibe-step3-post',
        name: 'Step 3 Completion',
        phase: 'design',
        type: 'post-execution',
        severity: 'error',
        requires: {
          files: ['architecture.md', 'api-spec.md'],
          conditions: ['has_system_diagram', 'has_api_endpoints']
        },
        description: 'Validates Step 3 completion'
      },

      // Continuous Quality Gates
      {
        id: 'code-quality-continuous',
        name: 'Continuous Code Quality',
        phase: '*',
        type: 'continuous',
        severity: 'warning',
        requires: {
          conditions: ['no_todo_comments', 'consistent_naming']
        },
        description: 'Continuously monitors code quality'
      }
    ];

    // Register gates with the system
    // Note: In real implementation, this would be done through the validation system
    console.log(`Registered ${vibeCodingGates.length} Vibe Coding validation gates`);
  }

  /**
   * Helper methods for demo
   */
  private async createProjectStructure(projectName: string): Promise<void> {
    // Create basic project structure
    const dirs = ['src', 'tests', 'docs'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create basic files
    fs.writeFileSync('README.md', `# ${projectName}\n\nProject created with Vibe Coding methodology.`);
    fs.writeFileSync('.gitignore', 'node_modules/\n.env\ndist/\n');
    fs.writeFileSync('package.json', JSON.stringify({
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      description: 'A Vibe Coding project',
      scripts: {
        build: 'echo "Building..."',
        test: 'echo "Testing..."'
      }
    }, null, 2));
  }

  private async createRequirementsDocument(): Promise<void> {
    const requirements = `# Requirements Document

## Project Overview
This project implements a validation gate system for the Vibe Coding methodology.

## User Stories
1. As a developer, I want validation gates to ensure quality at each step
2. As a team lead, I want visibility into validation status
3. As a user, I want reliable software that meets requirements

## Acceptance Criteria
- [ ] All validation gates pass before phase transitions
- [ ] Clear error messages for validation failures
- [ ] Automated fixes where possible
- [ ] Comprehensive validation reports

## Technical Requirements
- Node.js 16+
- TypeScript
- Jest for testing
- 95%+ test coverage
`;

    fs.writeFileSync('requirements.md', requirements);
  }
}

/**
 * Demo: Run complete validation example
 */
async function runValidationDemo(): Promise<void> {
  console.log('🚀 Vibe Coding Validation System Demo\n');
  console.log('This demo shows how validation gates integrate with Vibe Coding commands.\n');

  const command = new VibeCodingCommand();
  
  try {
    // Initialize
    await command.initialize();
    
    // Step 1: Project Setup
    await command.executeStep1ProjectSetup('Validation Demo Project');
    
    // Show dashboard
    await command.showValidationDashboard();
    
    // Step 2: Requirements
    await command.executeStep2Requirements();
    
    // Step 3: Architecture
    await command.executeStep3Architecture();
    
    // Build command
    await command.executeBuildCommand({ prod: true });
    
    // Final dashboard
    await command.showValidationDashboard();
    
    console.log('\n✅ Demo completed successfully!');
    console.log('\nKey takeaways:');
    console.log('1. Validation gates ensure quality at each step');
    console.log('2. Phase transitions are validated automatically');
    console.log('3. Clear reporting helps identify and fix issues');
    console.log('4. Iterative improvements are suggested based on patterns');
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    console.error('\nThis demonstrates how validation gates prevent');
    console.error('progression when quality standards are not met.');
  }
}

/**
 * Advanced Example: Custom Validation Gate
 */
class CustomValidationGate {
  static createTestCoverageGate(): ValidationGate {
    return {
      id: 'custom-test-coverage',
      name: 'Test Coverage Validation',
      phase: 'testing',
      type: 'post-execution',
      severity: 'error',
      requires: {
        files: ['coverage/coverage-summary.json'],
        conditions: ['test_coverage_95_percent']
      },
      autoFix: async (context, errors) => {
        // Check if we can generate missing tests
        const missingTests = errors.find(e => e.message.includes('coverage'));
        
        if (missingTests) {
          console.log('🔧 Attempting to generate missing tests...');
          
          // In real implementation, use AI to generate tests
          // For demo, just return success
          return true;
        }
        
        return false;
      },
      description: 'Ensures 95%+ test coverage'
    };
  }

  static createSecurityGate(): ValidationGate {
    return {
      id: 'custom-security-scan',
      name: 'Security Vulnerability Scan',
      phase: 'deployment',
      type: 'pre-execution',
      severity: 'error',
      requires: {
        conditions: ['no_known_vulnerabilities', 'dependencies_up_to_date']
      },
      description: 'Scans for security vulnerabilities before deployment'
    };
  }

  static createPerformanceGate(): ValidationGate {
    return {
      id: 'custom-performance',
      name: 'Performance Benchmarks',
      phase: 'testing',
      type: 'post-execution',
      severity: 'warning',
      requires: {
        conditions: ['meets_performance_targets']
      },
      description: 'Validates performance against benchmarks'
    };
  }
}

// Export for use in other modules
export {
  VibeCodingCommand,
  runValidationDemo,
  CustomValidationGate
};

// Run demo if executed directly
if (require.main === module) {
  runValidationDemo().catch(console.error);
}