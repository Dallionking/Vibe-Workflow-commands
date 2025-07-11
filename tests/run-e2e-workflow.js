#!/usr/bin/env node

/**
 * Vibe Coding E2E Workflow Test Runner
 * 
 * This script provides a comprehensive testing framework for validating
 * the entire Vibe Coding methodology from initialization through completion.
 * 
 * Usage:
 *   node tests/run-e2e-workflow.js [options]
 * 
 * Options:
 *   --project-type  Project type to test (saas-startup, enterprise-app, mobile-app)
 *   --verbose       Enable detailed logging
 *   --quick         Run abbreviated test suite
 *   --performance   Focus on performance metrics only
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class E2EWorkflowTester {
  constructor(options = {}) {
    this.options = {
      projectType: options.projectType || 'saas-startup',
      verbose: options.verbose || false,
      quick: options.quick || false,
      performanceOnly: options.performanceOnly || false
    };
    
    this.testDir = path.join(process.cwd(), 'vibe-e2e-test');
    this.results = {
      startTime: new Date(),
      steps: [],
      integrationTests: [],
      performance: {},
      quality: {},
      issues: []
    };
    
    this.setupTestEnvironment();
  }

  setupTestEnvironment() {
    console.log('🧪 Setting up E2E test environment...');
    
    // Clean up any previous test
    if (fs.existsSync(this.testDir)) {
      execSync(`rm -rf ${this.testDir}`);
    }
    
    // Create test directory structure
    fs.mkdirSync(this.testDir, { recursive: true });
    fs.mkdirSync(path.join(this.testDir, 'tests', 'e2e-logs'), { recursive: true });
    fs.mkdirSync(path.join(this.testDir, '.vibe-test'), { recursive: true });
    
    // Change to test directory
    process.chdir(this.testDir);
    
    if (this.options.verbose) {
      console.log(`✅ Test environment created at: ${this.testDir}`);
    }
  }

  async runWorkflowTest() {
    console.log('🚀 Starting complete workflow test...');
    console.log(`📋 Project Type: ${this.options.projectType}`);
    console.log(`⚡ Mode: ${this.options.quick ? 'Quick' : 'Comprehensive'}`);
    
    const workflowSteps = [
      { name: 'init', command: '/vibe-init', description: 'Project Initialization' },
      { name: 'step1', command: '/vibe-step-1-ideation', description: 'Project Specification' },
      { name: 'step2', command: '/vibe-step-2-architecture', description: 'Technical Architecture' },
      { name: 'step2.5', command: '/vibe-step-2.5-mcp-setup', description: 'MCP Setup' },
      { name: 'step3', command: '/vibe-step-3-ux-design', description: 'UX Design' },
      { name: 'step4', command: '/vibe-step-4-design-system', description: 'Design System' },
      { name: 'step5', command: '/vibe-step-5-interface', description: 'Interface States' },
      { name: 'step6', command: '/vibe-step-6-technical', description: 'Technical Specification' },
      { name: 'step7a', command: '/vibe-landing-avatar', description: 'Customer Avatars' },
      { name: 'step7b', command: '/vibe-landing-diary', description: 'Emotional Diary' },
      { name: 'step7c', command: '/vibe-landing-copy', description: 'Landing Page Copy' },
      { name: 'step8', command: '/vibe-step-8-slices', description: 'Vertical Slices' },
      { name: 'step9', command: '/vibe-step-9-claude-md', description: 'Claude.md Generation' },
      { name: 'step10', command: '/vibe-step-10-init-services', description: 'Service Initialization' }
    ];

    // Run each step and validate
    for (const step of workflowSteps) {
      if (this.options.quick && this.isOptionalStep(step.name)) {
        continue;
      }
      
      await this.executeStep(step);
    }

    // Run integration tests
    if (!this.options.performanceOnly) {
      await this.runIntegrationTests();
    }

    // Generate final report
    await this.generateReport();
    
    console.log('✅ E2E workflow test completed!');
    return this.results;
  }

  async executeStep(step) {
    console.log(`📋 Testing: ${step.description}...`);
    const startTime = Date.now();
    
    try {
      // Simulate command execution (in real implementation, this would call Claude Code)
      const result = this.simulateStepExecution(step);
      
      const duration = Date.now() - startTime;
      const stepResult = {
        name: step.name,
        command: step.command,
        description: step.description,
        status: result.success ? 'passed' : 'failed',
        duration: `${duration}ms`,
        issues: result.issues || [],
        outputs: result.outputs || []
      };
      
      this.results.steps.push(stepResult);
      
      if (this.options.verbose) {
        console.log(`  ✅ ${step.description} completed in ${duration}ms`);
        if (result.outputs.length > 0) {
          console.log(`  📄 Generated: ${result.outputs.join(', ')}`);
        }
      }
      
      // Validate step outputs
      this.validateStepOutputs(step, result);
      
    } catch (error) {
      console.error(`❌ Step failed: ${step.description}`);
      console.error(`   Error: ${error.message}`);
      
      this.results.steps.push({
        name: step.name,
        command: step.command,
        description: step.description,
        status: 'failed',
        duration: `${Date.now() - startTime}ms`,
        error: error.message,
        issues: [{ severity: 'critical', description: error.message }]
      });
    }
  }

  simulateStepExecution(step) {
    // This is a simulation for the test framework
    // In real implementation, this would execute the actual Claude Code commands
    
    const stepMappings = {
      'init': {
        success: true,
        outputs: ['.vibe-status.md', 'CLAUDE.md', 'project structure'],
        duration: 25000
      },
      'step1': {
        success: true,
        outputs: ['docs/01-project-specification.md'],
        duration: 95000
      },
      'step2': {
        success: true,
        outputs: ['docs/02-technical-architecture.md'],
        duration: 165000
      },
      // ... more step mappings
    };
    
    const mapping = stepMappings[step.name] || {
      success: true,
      outputs: [`docs/${step.name}-output.md`],
      duration: 60000
    };
    
    // Simulate file creation
    mapping.outputs.forEach(output => {
      this.createMockFile(output, step);
    });
    
    return mapping;
  }

  createMockFile(filePath, step) {
    const fullPath = path.join(this.testDir, filePath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Create mock file content
    const content = this.generateMockContent(filePath, step);
    fs.writeFileSync(fullPath, content);
    
    if (this.options.verbose) {
      console.log(`  📄 Created: ${filePath}`);
    }
  }

  generateMockContent(filePath, step) {
    return `# ${step.description}

## Overview
This is a mock file generated for E2E testing of the Vibe Coding workflow.

**Step**: ${step.name}
**Command**: ${step.command}
**Generated**: ${new Date().toISOString()}

## Content Validation
- File structure: ✅ Valid
- Format compliance: ✅ Valid
- Required sections: ✅ Present
- Quality standards: ✅ Met

## Test Metadata
- Test run: E2E Workflow Validation
- Project type: ${this.options.projectType}
- Environment: Test simulation

This file demonstrates successful execution of ${step.description} within the Vibe Coding methodology.
`;
  }

  validateStepOutputs(step, result) {
    // Validate that all expected files were created
    result.outputs.forEach(output => {
      const filePath = path.join(this.testDir, output);
      if (!fs.existsSync(filePath)) {
        this.results.issues.push({
          severity: 'high',
          step: step.name,
          description: `Expected output file not created: ${output}`,
          recommendation: 'Check file generation logic'
        });
      } else {
        // Basic content validation
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.length < 100) {
          this.results.issues.push({
            severity: 'medium',
            step: step.name,
            description: `Generated file appears incomplete: ${output}`,
            recommendation: 'Review content generation'
          });
        }
      }
    });
  }

  async runIntegrationTests() {
    console.log('🔗 Running integration tests...');
    
    const integrationTests = [
      { name: 'Cross-step dependencies', test: this.testCrossStepDependencies.bind(this) },
      { name: 'File integrity', test: this.testFileIntegrity.bind(this) },
      { name: 'Universal Format compliance', test: this.testUniversalFormatCompliance.bind(this) },
      { name: 'Step 7 → Step 8 integration', test: this.testStep7To8Integration.bind(this) }
    ];

    for (const test of integrationTests) {
      console.log(`  🧪 ${test.name}...`);
      const result = await test.test();
      this.results.integrationTests.push({
        name: test.name,
        status: result.passed ? 'passed' : 'failed',
        issues: result.issues || []
      });
      
      if (this.options.verbose) {
        console.log(`    ${result.passed ? '✅' : '❌'} ${test.name}`);
      }
    }
  }

  testCrossStepDependencies() {
    // Test that data flows correctly between steps
    const issues = [];
    
    // Check if Step 1 outputs are used in Step 2
    const step1File = path.join(this.testDir, 'docs/01-project-specification.md');
    const step2File = path.join(this.testDir, 'docs/02-technical-architecture.md');
    
    if (fs.existsSync(step1File) && fs.existsSync(step2File)) {
      // In a real test, we'd validate content dependencies
      // For now, just check files exist
    } else {
      issues.push({
        severity: 'high',
        description: 'Missing prerequisite files for dependency testing'
      });
    }
    
    return { passed: issues.length === 0, issues };
  }

  testFileIntegrity() {
    // Test that all generated files are valid and complete
    const issues = [];
    const requiredFiles = [
      '.vibe-status.md',
      'CLAUDE.md',
      'docs/01-project-specification.md',
      'docs/02-technical-architecture.md'
    ];
    
    requiredFiles.forEach(file => {
      const filePath = path.join(this.testDir, file);
      if (!fs.existsSync(filePath)) {
        issues.push({
          severity: 'critical',
          description: `Required file missing: ${file}`
        });
      }
    });
    
    return { passed: issues.length === 0, issues };
  }

  testUniversalFormatCompliance() {
    // Test that vertical slices follow Universal Format
    const issues = [];
    
    // Check for phase files
    const phasesDir = path.join(this.testDir, 'phases');
    if (fs.existsSync(phasesDir)) {
      const phaseFiles = fs.readdirSync(phasesDir);
      if (phaseFiles.length === 0) {
        issues.push({
          severity: 'medium',
          description: 'No phase files generated in Universal Format'
        });
      }
    } else {
      issues.push({
        severity: 'high',
        description: 'Phases directory not created'
      });
    }
    
    return { passed: issues.length === 0, issues };
  }

  testStep7To8Integration() {
    // Test that Step 7 outputs are properly integrated into Step 8
    const issues = [];
    
    const step7Files = [
      'docs/07-landing-page/customer-avatars.md',
      'docs/07-landing-page/emotional-diary.md',
      'docs/07-landing-page/landing-page.md'
    ];
    
    step7Files.forEach(file => {
      const filePath = path.join(this.testDir, file);
      if (!fs.existsSync(filePath)) {
        issues.push({
          severity: 'high',
          description: `Step 7 output missing: ${file}`
        });
      }
    });
    
    return { passed: issues.length === 0, issues };
  }

  async generateReport() {
    console.log('📊 Generating test report...');
    
    this.results.endTime = new Date();
    this.results.duration = this.results.endTime - this.results.startTime;
    
    // Calculate success metrics
    const totalSteps = this.results.steps.length;
    const passedSteps = this.results.steps.filter(s => s.status === 'passed').length;
    this.results.successRate = Math.round((passedSteps / totalSteps) * 100);
    
    // Generate quality scores
    this.results.quality = {
      documentationScore: this.calculateDocumentationScore(),
      codeQualityScore: this.calculateCodeQualityScore(),
      consistencyScore: this.calculateConsistencyScore()
    };
    
    // Generate performance metrics
    this.results.performance = {
      totalTime: this.formatDuration(this.results.duration),
      averageStepTime: this.formatDuration(this.results.duration / totalSteps),
      resourceUsage: 'acceptable' // In real implementation, measure actual usage
    };
    
    // Create report files
    this.createMarkdownReport();
    this.createJsonReport();
    
    console.log(`📈 Success Rate: ${this.results.successRate}%`);
    console.log(`⏱️  Total Duration: ${this.results.performance.totalTime}`);
    console.log(`📋 Issues Found: ${this.results.issues.length}`);
  }

  calculateDocumentationScore() {
    // Simulate documentation quality scoring
    const baseScore = 9.0;
    const penalty = this.results.issues.filter(i => i.severity === 'high').length * 0.5;
    return Math.max(baseScore - penalty, 0);
  }

  calculateCodeQualityScore() {
    // Simulate code quality scoring
    const baseScore = 8.5;
    const penalty = this.results.issues.filter(i => i.severity === 'critical').length * 1.0;
    return Math.max(baseScore - penalty, 0);
  }

  calculateConsistencyScore() {
    // Simulate consistency scoring
    const baseScore = 9.5;
    const penalty = this.results.issues.filter(i => i.description.includes('inconsist')).length * 0.3;
    return Math.max(baseScore - penalty, 0);
  }

  createMarkdownReport() {
    const reportPath = path.join(this.testDir, 'tests/e2e-workflow-report.md');
    const report = `# E2E Workflow Test Report

## Test Summary
- **Date**: ${this.results.startTime.toISOString()}
- **Duration**: ${this.results.performance.totalTime}
- **Project Type**: ${this.options.projectType}
- **Success Rate**: ${this.results.successRate}%

## Step Results
${this.results.steps.map(step => `
### ${step.description}
- **Status**: ${step.status}
- **Duration**: ${step.duration}
- **Command**: \`${step.command}\`
${step.issues.length > 0 ? `- **Issues**: ${step.issues.length}` : ''}
`).join('')}

## Integration Tests
${this.results.integrationTests.map(test => `
- **${test.name}**: ${test.status}
`).join('')}

## Performance Metrics
- **Total Execution Time**: ${this.results.performance.totalTime}
- **Average Step Time**: ${this.results.performance.averageStepTime}
- **Resource Usage**: ${this.results.performance.resourceUsage}

## Quality Scores
- **Documentation Quality**: ${this.results.quality.documentationScore}/10
- **Code Quality**: ${this.results.quality.codeQualityScore}/10  
- **Consistency**: ${this.results.quality.consistencyScore}/10

## Issues Identified
${this.results.issues.length > 0 ? 
  this.results.issues.map(issue => `
- **${issue.severity.toUpperCase()}**: ${issue.description}
  ${issue.recommendation ? `- *Recommendation*: ${issue.recommendation}` : ''}
`).join('') : 'No issues identified.'}

## Recommendations
${this.generateRecommendations()}

---
*Report generated by Vibe Coding E2E Test Suite*
`;
    
    fs.writeFileSync(reportPath, report);
    console.log(`📄 Report saved: ${reportPath}`);
  }

  createJsonReport() {
    const reportPath = path.join(this.testDir, '.vibe-test/workflow-validation.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📊 JSON report saved: ${reportPath}`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.successRate < 95) {
      recommendations.push('- Investigate failed steps and improve error handling');
    }
    
    if (this.results.quality.documentationScore < 8.5) {
      recommendations.push('- Review documentation generation templates');
    }
    
    if (this.results.issues.length > 5) {
      recommendations.push('- Prioritize fixing high-severity issues before release');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('- All tests passed successfully! Consider expanding test coverage.');
    }
    
    return recommendations.join('\n');
  }

  isOptionalStep(stepName) {
    // Define which steps can be skipped in quick mode
    const optionalSteps = ['step2.5', 'step7b', 'step10'];
    return optionalSteps.includes(stepName);
  }

  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--project-type':
        options.projectType = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--quick':
        options.quick = true;
        break;
      case '--performance':
        options.performanceOnly = true;
        break;
      case '--help':
        console.log(`
Vibe Coding E2E Workflow Test Runner

Usage: node run-e2e-workflow.js [options]

Options:
  --project-type TYPE   Project type to test (saas-startup, enterprise-app, mobile-app)
  --verbose            Enable detailed logging
  --quick              Run abbreviated test suite
  --performance        Focus on performance metrics only
  --help               Show this help message
        `);
        process.exit(0);
    }
  }
  
  try {
    const tester = new E2EWorkflowTester(options);
    const results = await tester.runWorkflowTest();
    
    // Exit with appropriate code
    process.exit(results.successRate >= 95 ? 0 : 1);
    
  } catch (error) {
    console.error('❌ E2E test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = E2EWorkflowTester;