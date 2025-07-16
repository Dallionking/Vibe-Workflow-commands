/**
 * Enhanced Retrofit Commands
 * Phase 2: Retrofit Context Enhancement
 *
 * New and enhanced retrofit commands with context engineering
 */

import { EnhancedCodebaseAnalyzer } from '../analyzer/enhanced-analyzer';
import { AdaptiveAgentGenerator } from '../agents/adaptive-generator';
import { CompatibilityAssuranceSystem } from '../compatibility/assurance-system';
import { RetrofitContextBuilder } from '../context-layers';

export interface CommandOptions {
    contextMode?: 'adaptive' | 'strict' | 'learning';
    validationGates?: 'none' | 'basic' | 'strict';
    contextDepth?: 'shallow' | 'medium' | 'deep';
    patternLearning?: boolean;
    interactive?: boolean;
    dryRun?: boolean;
}

export interface CommandResult {
    success: boolean;
    message: string;
    data?: any;
    warnings: string[];
    errors: string[];
    nextSteps: string[];
}

export class EnhancedRetrofitCommands {
  private analyzer: EnhancedCodebaseAnalyzer;
  private agentGenerator: AdaptiveAgentGenerator;
  private compatibilitySystem: CompatibilityAssuranceSystem;
  private contextBuilder: RetrofitContextBuilder;

  constructor() {
    this.analyzer = new EnhancedCodebaseAnalyzer();
    this.agentGenerator = new AdaptiveAgentGenerator();
    this.compatibilitySystem = new CompatibilityAssuranceSystem();
    this.contextBuilder = new RetrofitContextBuilder();
  }

  /**
     * Enhanced vibe-retrofit-existing command
     * /vibe-retrofit-existing --context-mode=adaptive --validation-gates=strict
     */
  async vibeRetrofitExisting(options: CommandOptions = {}): Promise<CommandResult> {
    console.log('🚀 Enhanced Retrofit Existing Project');
    console.log(`Mode: ${options.contextMode || 'adaptive'}`);
    console.log(`Validation: ${options.validationGates || 'strict'}`);

    const warnings: string[] = [];
    const errors: string[] = [];
    const nextSteps: string[] = [];

    try {
      // Step 1: Enhanced codebase analysis
      console.log('\n📊 Step 1: Enhanced Codebase Analysis');
      const contextProfile = await this.analyzer.generateContextProfile('./');

      if (contextProfile.debt.priority === 'critical') {
        warnings.push('Critical technical debt detected - review debt report before proceeding');
      }

      // Step 2: Pattern learning and adaptation
      console.log('\n🧠 Step 2: Pattern Learning and Adaptation');
      const patterns = await this.analyzer.analyzePatterns('./');

      if (patterns.confidence < 0.8) {
        warnings.push('Pattern confidence below 80% - consider manual review');
      }

      // Step 3: Adaptive agent generation
      console.log('\n🤖 Step 3: Adaptive Agent Generation');
      const agents = await this.agentGenerator.generateFromPatterns(patterns);
      await this.agentGenerator.customizeForProject(contextProfile);

      // Step 4: Compatibility assurance
      if (options.validationGates !== 'none') {
        console.log('\n🛡️ Step 4: Compatibility Assurance');
        const regressionReport = await this.compatibilitySystem.preventRegressions([
          'unit-tests', 'integration-tests', 'e2e-tests'
        ]);

        if (!regressionReport.passed) {
          errors.push(`${regressionReport.summary.regressions} regressions detected`);
        }
      }

      // Step 5: Context layer setup
      console.log('\n🏗️ Step 5: Context Layer Setup');
      await this.setupRetrofitContext(contextProfile);

      // Generate next steps
      nextSteps.push('Run /vibe-retrofit-context validate to verify setup');
      nextSteps.push('Review generated agents in .vibe/agents/');
      nextSteps.push('Check compatibility report in .vibe/reports/');

      if (warnings.length > 0) {
        nextSteps.push('Address warnings before proceeding to production');
      }

      return {
        success: errors.length === 0,
        message: `Enhanced retrofit complete. ${agents.length} adaptive agents generated.`,
        data: {
          agents: agents.length,
          patterns: patterns.patterns.size,
          debt: contextProfile.debt.totalScore,
          quality: contextProfile.quality.overall
        },
        warnings,
        errors,
        nextSteps
      };

    } catch (error) {
      errors.push(`Retrofit failed: ${error.message}`);
      return {
        success: false,
        message: 'Enhanced retrofit failed',
        warnings,
        errors,
        nextSteps: ['Check error logs', 'Ensure project has valid structure']
      };
    }
  }

  /**
     * Upgraded vibe-analyze-codebase command
     * /vibe-analyze-codebase --context-depth=deep --pattern-learning=enabled
     */
  async vibeAnalyzeCodebase(options: CommandOptions = {}): Promise<CommandResult> {
    console.log('🔍 Enhanced Codebase Analysis');
    console.log(`Depth: ${options.contextDepth || 'deep'}`);
    console.log(`Pattern Learning: ${options.patternLearning ? 'enabled' : 'disabled'}`);

    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Deep analysis based on context depth
      const depth = options.contextDepth || 'deep';

      let contextProfile;
      if (depth === 'deep') {
        contextProfile = await this.analyzer.generateContextProfile('./');
      } else {
        // Lighter analysis for shallow/medium
        const patterns = await this.analyzer.analyzePatterns('./');
        const debt = await this.analyzer.quantifyTechnicalDebt('./');
        contextProfile = { patterns, debt };
      }

      // Pattern learning if enabled
      if (options.patternLearning) {
        console.log('🧠 Learning patterns from codebase...');
        // Pattern learning would be implemented here
      }

      // Generate analysis report
      await this.generateAnalysisReport(contextProfile);

      // Check for critical issues
      if (contextProfile.debt && contextProfile.debt.priority === 'critical') {
        warnings.push('Critical technical debt requires immediate attention');
      }

      return {
        success: true,
        message: 'Enhanced codebase analysis complete',
        data: contextProfile,
        warnings,
        errors,
        nextSteps: [
          'Review analysis report in .vibe/reports/analysis.md',
          'Consider running /vibe-retrofit-existing to apply improvements',
          'Check pattern library in .vibe/patterns/'
        ]
      };

    } catch (error) {
      errors.push(`Analysis failed: ${error.message}`);
      return {
        success: false,
        message: 'Enhanced analysis failed',
        warnings,
        errors,
        nextSteps: ['Check project structure', 'Ensure proper file permissions']
      };
    }
  }

  /**
     * New vibe-retrofit-context command suite
     */
  async vibeRetrofitContext(subcommand: string, options: CommandOptions = {}): Promise<CommandResult> {
    console.log(`🎯 Retrofit Context: ${subcommand}`);

    switch (subcommand) {
    case 'learn':
      return await this.retrofitContextLearn(options);
    case 'apply':
      return await this.retrofitContextApply(options);
    case 'validate':
      return await this.retrofitContextValidate(options);
    case 'export':
      return await this.retrofitContextExport(options);
    default:
      return {
        success: false,
        message: `Unknown subcommand: ${subcommand}`,
        warnings: [],
        errors: [`Invalid subcommand: ${subcommand}`],
        nextSteps: [
          'Available subcommands: learn, apply, validate, export',
          'Example: /vibe-retrofit-context learn --interactive'
        ]
      };
    }
  }

  /**
     * /vibe-retrofit-context learn - Learn from existing code
     */
  private async retrofitContextLearn(options: CommandOptions): Promise<CommandResult> {
    console.log('🧠 Learning from existing codebase...');

    try {
      // Build discovery context
      const discovery = await this.contextBuilder.buildDiscoveryContext('./');

      // Learn patterns
      const patterns = await this.analyzer.analyzePatterns('./');

      // Save learned context
      await this.saveLearnedContext({ discovery, patterns });

      return {
        success: true,
        message: `Learned ${patterns.patterns.size} pattern types from codebase`,
        data: { patterns: patterns.patterns.size, confidence: patterns.confidence },
        warnings: [],
        errors: [],
        nextSteps: [
          'Run /vibe-retrofit-context apply to apply learned patterns',
          'Review learned patterns in .vibe/context/learned.json'
        ]
      };

    } catch (error) {
      return {
        success: false,
        message: 'Learning failed',
        warnings: [],
        errors: [error.message],
        nextSteps: ['Check codebase structure', 'Ensure read permissions']
      };
    }
  }

  /**
     * /vibe-retrofit-context apply - Apply learned patterns
     */
  private async retrofitContextApply(options: CommandOptions): Promise<CommandResult> {
    console.log('🎯 Applying learned patterns...');

    try {
      // Load learned context
      const learnedContext = await this.loadLearnedContext();

      if (!learnedContext) {
        return {
          success: false,
          message: 'No learned context found',
          warnings: [],
          errors: ['Run /vibe-retrofit-context learn first'],
          nextSteps: ['Execute learning phase before applying']
        };
      }

      // Generate agents based on learned patterns
      const agents = await this.agentGenerator.generateFromPatterns(learnedContext.patterns);

      // Apply context-aware customizations
      const contextProfile = await this.analyzer.generateContextProfile('./');
      await this.agentGenerator.customizeForProject(contextProfile);

      // Save generated agents
      await this.saveGeneratedAgents(agents);

      return {
        success: true,
        message: `Applied learned patterns, generated ${agents.length} adaptive agents`,
        data: { agents: agents.length },
        warnings: [],
        errors: [],
        nextSteps: [
          'Run /vibe-retrofit-context validate to verify application',
          'Test generated agents in .vibe/agents/'
        ]
      };

    } catch (error) {
      return {
        success: false,
        message: 'Pattern application failed',
        warnings: [],
        errors: [error.message],
        nextSteps: ['Check learned context', 'Verify project structure']
      };
    }
  }

  /**
     * /vibe-retrofit-context validate - Ensure consistency
     */
  private async retrofitContextValidate(options: CommandOptions): Promise<CommandResult> {
    console.log('✅ Validating retrofit context consistency...');

    try {
      const validationResults = [];

      // Validate context layers
      const contextValid = await this.validateContextLayers();
      validationResults.push({ name: 'Context Layers', valid: contextValid });

      // Validate generated agents
      const agentsValid = await this.validateGeneratedAgents();
      validationResults.push({ name: 'Generated Agents', valid: agentsValid });

      // Validate compatibility
      const compatibilityValid = await this.validateCompatibility();
      validationResults.push({ name: 'Compatibility', valid: compatibilityValid });

      const allValid = validationResults.every(r => r.valid);
      const invalidCount = validationResults.filter(r => !r.valid).length;

      return {
        success: allValid,
        message: allValid ?
          'All validations passed' :
          `${invalidCount} validation(s) failed`,
        data: { validationResults },
        warnings: allValid ? [] : ['Some validations failed'],
        errors: [],
        nextSteps: allValid ? [
          'Retrofit context is ready for use',
          'Consider exporting for team sharing'
        ] : [
          'Review failed validations',
          'Fix issues and re-validate'
        ]
      };

    } catch (error) {
      return {
        success: false,
        message: 'Validation failed',
        warnings: [],
        errors: [error.message],
        nextSteps: ['Check validation setup', 'Ensure proper configuration']
      };
    }
  }

  /**
     * /vibe-retrofit-context export - Export for team sharing
     */
  private async retrofitContextExport(options: CommandOptions): Promise<CommandResult> {
    console.log('📤 Exporting retrofit context for team sharing...');

    try {
      // Gather all context data
      const exportData = {
        patterns: await this.loadLearnedContext(),
        agents: await this.loadGeneratedAgents(),
        configuration: await this.loadConfiguration(),
        timestamp: new Date().toISOString(),
        version: '2.0.0'
      };

      // Create export package
      const exportPath = await this.createExportPackage(exportData);

      return {
        success: true,
        message: 'Retrofit context exported successfully',
        data: { exportPath, size: JSON.stringify(exportData).length },
        warnings: [],
        errors: [],
        nextSteps: [
          `Share export package: ${exportPath}`,
          'Team members can import using /vibe-retrofit-context import',
          'Include documentation for team onboarding'
        ]
      };

    } catch (error) {
      return {
        success: false,
        message: 'Export failed',
        warnings: [],
        errors: [error.message],
        nextSteps: ['Check export permissions', 'Ensure context is complete']
      };
    }
  }

  // Private helper methods
  private async setupRetrofitContext(contextProfile: any): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    // Create .vibe directory structure
    const vibeDir = path.join(process.cwd(), '.vibe');
    await fs.mkdir(vibeDir, { recursive: true });
    await fs.mkdir(path.join(vibeDir, 'context'), { recursive: true });
    await fs.mkdir(path.join(vibeDir, 'agents'), { recursive: true });
    await fs.mkdir(path.join(vibeDir, 'patterns'), { recursive: true });
    await fs.mkdir(path.join(vibeDir, 'reports'), { recursive: true });

    // Save context profile
    await fs.writeFile(
      path.join(vibeDir, 'context', 'profile.json'),
      JSON.stringify(contextProfile, null, 2)
    );

    // Create context configuration
    const contextConfig = {
      version: '2.0.0',
      created: new Date().toISOString(),
      layers: {
        L0_Discovery: 'enabled',
        L1_Preservation: 'enabled',
        L2_Improvement: 'enabled',
        L3_Evolution: 'enabled'
      },
      features: {
        patternLearning: true,
        adaptiveAgents: true,
        compatibilityAssurance: true
      }
    };

    await fs.writeFile(
      path.join(vibeDir, 'context', 'config.json'),
      JSON.stringify(contextConfig, null, 2)
    );
  }

  private async generateAnalysisReport(contextProfile: any): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    // Ensure reports directory exists
    const reportsDir = path.join(process.cwd(), '.vibe', 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    // Generate comprehensive analysis report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPatterns: contextProfile.patterns?.patterns?.size || 0,
        patternConfidence: contextProfile.patterns?.confidence || 0,
        technicalDebt: contextProfile.debt?.totalScore || 0,
        qualityScore: contextProfile.quality?.overall || 0,
        maintainabilityIndex: contextProfile.profile?.maintainabilityIndex || 0
      },
      patterns: contextProfile.patterns,
      debt: contextProfile.debt,
      quality: contextProfile.quality,
      recommendations: contextProfile.recommendations || []
    };

    // Save JSON report
    await fs.writeFile(
      path.join(reportsDir, 'analysis.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate markdown report
    const markdown = this.generateMarkdownReport(report);
    await fs.writeFile(
      path.join(reportsDir, 'analysis.md'),
      markdown
    );
  }

  private async saveLearnedContext(context: any): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    const contextDir = path.join(process.cwd(), '.vibe', 'context');
    await fs.mkdir(contextDir, { recursive: true });

    // Save learned context with timestamp
    const learnedData = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      discovery: context.discovery,
      patterns: {
        patterns: context.patterns.patterns instanceof Map ?
          Object.fromEntries(context.patterns.patterns) :
          context.patterns.patterns,
        confidence: context.patterns.confidence,
        conventions: context.patterns.conventions
      }
    };

    await fs.writeFile(
      path.join(contextDir, 'learned.json'),
      JSON.stringify(learnedData, null, 2)
    );
  }

  private async loadLearnedContext(): Promise<any> {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const contextPath = path.join(process.cwd(), '.vibe', 'context', 'learned.json');
      const data = await fs.readFile(contextPath, 'utf8');
      const parsed = JSON.parse(data);

      // Convert patterns back to Map if needed
      if (parsed.patterns && typeof parsed.patterns.patterns === 'object') {
        parsed.patterns.patterns = new Map(Object.entries(parsed.patterns.patterns));
      }

      return parsed;
    } catch (error) {
      return null;
    }
  }

  private async saveGeneratedAgents(agents: any[]): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    const agentsDir = path.join(process.cwd(), '.vibe', 'agents');
    await fs.mkdir(agentsDir, { recursive: true });

    // Save each agent individually
    for (const agent of agents) {
      const agentPath = path.join(agentsDir, `${agent.name}.json`);
      await fs.writeFile(agentPath, JSON.stringify(agent, null, 2));
    }

    // Save agents manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      agents: agents.map(a => ({
        name: a.name,
        type: a.type,
        role: a.role,
        capabilities: a.capabilities.length
      }))
    };

    await fs.writeFile(
      path.join(agentsDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
  }

  private async loadGeneratedAgents(): Promise<any[]> {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const agentsDir = path.join(process.cwd(), '.vibe', 'agents');
      const manifestPath = path.join(agentsDir, 'manifest.json');

      const manifestData = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestData);

      const agents = [];
      for (const agentInfo of manifest.agents) {
        const agentPath = path.join(agentsDir, `${agentInfo.name}.json`);
        const agentData = await fs.readFile(agentPath, 'utf8');
        agents.push(JSON.parse(agentData));
      }

      return agents;
    } catch (error) {
      return [];
    }
  }

  private async loadConfiguration(): Promise<any> {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const configPath = path.join(process.cwd(), '.vibe', 'context', 'config.json');
      const data = await fs.readFile(configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {
        version: '2.0.0',
        layers: {},
        features: {}
      };
    }
  }

  private async validateContextLayers(): Promise<boolean> {
    try {
      const fs = require('fs').promises;
      const path = require('path');

      // Check if context directory exists
      const contextDir = path.join(process.cwd(), '.vibe', 'context');
      await fs.access(contextDir);

      // Validate required files
      const requiredFiles = ['config.json', 'profile.json'];
      for (const file of requiredFiles) {
        await fs.access(path.join(contextDir, file));
      }

      // Validate configuration structure
      const configPath = path.join(contextDir, 'config.json');
      const configData = await fs.readFile(configPath, 'utf8');
      const config = JSON.parse(configData);

      return config.layers && config.features && config.version;
    } catch (error) {
      return false;
    }
  }

  private async validateGeneratedAgents(): Promise<boolean> {
    try {
      const fs = require('fs').promises;
      const path = require('path');

      // Check if agents directory exists
      const agentsDir = path.join(process.cwd(), '.vibe', 'agents');
      await fs.access(agentsDir);

      // Check if manifest exists
      const manifestPath = path.join(agentsDir, 'manifest.json');
      await fs.access(manifestPath);

      // Validate manifest structure
      const manifestData = await fs.readFile(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestData);

      if (!manifest.agents || !Array.isArray(manifest.agents)) {
        return false;
      }

      // Validate each agent file exists and has proper structure
      for (const agentInfo of manifest.agents) {
        const agentPath = path.join(agentsDir, `${agentInfo.name}.json`);
        await fs.access(agentPath);

        const agentData = await fs.readFile(agentPath, 'utf8');
        const agent = JSON.parse(agentData);

        // Validate agent structure
        if (!agent.name || !agent.type || !agent.capabilities) {
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  private async validateCompatibility(): Promise<boolean> {
    try {
      // Run basic compatibility checks
      const regressionReport = await this.compatibilitySystem.preventRegressions([
        'basic-functionality'
      ]);

      return regressionReport.passed;
    } catch (error) {
      return false;
    }
  }

  private async createExportPackage(data: any): Promise<string> {
    const fs = require('fs').promises;
    const path = require('path');

    const exportsDir = path.join(process.cwd(), '.vibe', 'exports');
    await fs.mkdir(exportsDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `retrofit-context-export-${timestamp}.json`;
    const exportPath = path.join(exportsDir, filename);

    await fs.writeFile(exportPath, JSON.stringify(data, null, 2));

    return exportPath;
  }

  private generateMarkdownReport(report: any): string {
    const timestamp = new Date(report.timestamp).toLocaleString();

    return `# Retrofit Context Analysis Report

**Generated:** ${timestamp}

## Summary

- **Total Patterns:** ${report.summary.totalPatterns}
- **Pattern Confidence:** ${Math.round(report.summary.patternConfidence * 100)}%
- **Technical Debt Score:** ${report.summary.technicalDebt}
- **Quality Score:** ${Math.round(report.summary.qualityScore * 100)}%
- **Maintainability Index:** ${Math.round(report.summary.maintainabilityIndex)}

## Patterns Analysis

${report.patterns ? `### Detected Patterns\n\n${  this.formatPatterns(report.patterns)}` : 'No patterns data available'}

## Technical Debt

${report.debt ? `### Debt Analysis\n\n${  this.formatDebt(report.debt)}` : 'No debt data available'}

## Quality Metrics

${report.quality ? `### Quality Assessment\n\n${  this.formatQuality(report.quality)}` : 'No quality data available'}

## Recommendations

${report.recommendations.length > 0 ? report.recommendations.map((r: any, i: number) => `${i + 1}. **${r.title}**: ${r.description}`).join('\n') : 'No recommendations available'}

---

*Generated by Vibe Coding Retrofit Context Enhancement v2.0.0*`;
  }

  private formatPatterns(patterns: any): string {
    if (!patterns.patterns) {
      return 'No patterns detected';
    }

    const patternMap = patterns.patterns instanceof Map ? patterns.patterns : new Map(Object.entries(patterns.patterns));

    let output = '';
    for (const [type, patternList] of patternMap) {
      output += `**${type}:** ${Array.isArray(patternList) ? patternList.length : 0} patterns\n`;
    }

    return output;
  }

  private formatDebt(debt: any): string {
    return `**Total Score:** ${debt.totalScore}\n**Priority:** ${debt.priority}\n**Issues:** ${debt.issues?.length || 0} identified`;
  }

  private formatQuality(quality: any): string {
    return `**Overall:** ${Math.round(quality.overall * 100)}%\n**Maintainability:** ${Math.round(quality.maintainability * 100)}%\n**Reliability:** ${Math.round(quality.reliability * 100)}%`;
  }
}
