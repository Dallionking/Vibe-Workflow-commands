# Vibe Command Enhancement Strategy with Context Engineering

## Executive Summary

This document outlines a comprehensive strategy for enhancing core Vibe commands with the context engineering infrastructure while maintaining backward compatibility. The enhancement introduces intelligent context management, adaptive learning, and token optimization to all Vibe commands.

## Current State Analysis

### Existing Infrastructure
1. **DynamicContextManager** - Runtime context assembly and management
2. **CommandContextRegistry** - Central registry of all command specifications
3. **VibeCommandEnhancer** - Integration layer for command enhancement
4. **ContextLearningSystem** - Adaptive learning from command execution
5. **Validation System** - Command validation with pre/post hooks

### Missing Components
1. Actual command implementations (currently only registry exists)
2. Integration points with existing slash command system
3. Progressive enhancement migration path
4. Context-aware command handlers
5. Backward compatibility layer

## Enhancement Architecture

```
┌─────────────────────────────────────────────────────────┐
│                User Input (/vibe-init)                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Command Router (Enhanced)                   │
│         ┌───────────┴───────────┐                       │
│         ▼                       ▼                       │
│   Context Check           Legacy Handler                │
│   (if enabled)            (if disabled)                 │
└─────────┬───────────────────────┴───────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│           Context Enhancement Pipeline                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐    │
│  │ Validate │→ │ Assemble │→ │ Token Optimize    │    │
│  │ Command  │  │ Context  │  │ & Prioritize      │    │
│  └──────────┘  └──────────┘  └───────────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Enhanced Command Execution                  │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────┐   │
│  │ Pre-execute  │→ │  Execute   │→ │ Post-execute │   │
│  │ Hooks        │  │  Command   │  │ Learning     │   │
│  └──────────────┘  └────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Command Enhancement Patterns

### 1. Base Command Structure

```javascript
// src/commands/base-command.js
export class BaseVibeCommand {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.contextEnabled = config.contextEnabled ?? true;
    this.registry = CommandContextRegistry.get(this.name);
  }

  async execute(params, context = null) {
    // Pre-execution validation
    await this.validate(params);
    
    // Execute with or without context
    const result = context && this.contextEnabled
      ? await this.executeWithContext(params, context)
      : await this.executeLegacy(params);
    
    // Post-execution processing
    await this.postProcess(result, params, context);
    
    return result;
  }

  async validate(params) {
    // Override in subclasses
  }

  async executeWithContext(params, context) {
    // Override in subclasses
  }

  async executeLegacy(params) {
    // Override in subclasses
  }

  async postProcess(result, params, context) {
    // Override in subclasses
  }
}
```

### 2. Enhanced vibe-init Command

```javascript
// src/commands/vibe-init.js
import { BaseVibeCommand } from './base-command.js';
import { DynamicContextManager } from '../context/assembly/dynamic-context-manager.js';
import { createProjectStructure, initializeGit } from '../utils/project-utils.js';

export class VibeInitCommand extends BaseVibeCommand {
  constructor() {
    super({
      name: 'vibe-init',
      description: 'Initialize a new Vibe project with context-aware setup',
      contextEnabled: true
    });
  }

  async validate(params) {
    if (!params.projectName) {
      throw new Error('Project name is required');
    }
    
    // Check if directory already exists
    if (await this.directoryExists(params.projectName)) {
      throw new Error(`Directory ${params.projectName} already exists`);
    }
  }

  async executeWithContext(params, context) {
    const { projectName, template = 'default' } = params;
    
    console.log('🚀 Initializing Vibe project with enhanced context...');
    
    // Extract relevant context sections
    const projectConventions = context.getSection('project-conventions');
    const qualityStandards = context.getSection('quality-standards');
    const securityPolicies = context.getSection('security-policies');
    
    // Create project structure
    const projectPath = await createProjectStructure({
      name: projectName,
      template,
      conventions: projectConventions,
      standards: qualityStandards,
      security: securityPolicies
    });
    
    // Initialize git with context-aware commit message
    await initializeGit(projectPath, {
      message: this.generateCommitMessage(context),
      branches: this.determineBranches(context)
    });
    
    // Create CLAUDE.md with project-specific context
    await this.createClaudeMd(projectPath, context);
    
    // Initialize context engineering if enabled
    if (params.enableContextEngineering) {
      await this.initializeContextEngineering(projectPath);
    }
    
    // Store project initialization metadata
    await this.storeProjectMetadata(projectPath, {
      template,
      contextVersion: context.version,
      initTimestamp: new Date(),
      enabledFeatures: this.extractEnabledFeatures(params)
    });
    
    return {
      success: true,
      projectPath,
      nextSteps: this.generateNextSteps(template, context)
    };
  }

  async executeLegacy(params) {
    const { projectName, template = 'default' } = params;
    
    console.log('🚀 Initializing Vibe project...');
    
    // Basic project structure creation
    const projectPath = await createProjectStructure({
      name: projectName,
      template
    });
    
    // Basic git initialization
    await initializeGit(projectPath);
    
    return {
      success: true,
      projectPath,
      nextSteps: [
        'Run `cd ' + projectName + '` to enter the project',
        'Run `/vibe-step-1` to begin ideation',
        'Run `/vibe-status` to check project status'
      ]
    };
  }

  generateCommitMessage(context) {
    const conventions = context.getSection('project-conventions');
    const style = conventions?.commitStyle || 'conventional';
    
    switch (style) {
      case 'conventional':
        return 'feat: initialize new Vibe project with context engineering';
      case 'semantic':
        return 'Initialize: New Vibe project with enhanced context support';
      default:
        return 'Initial commit';
    }
  }

  determineBranches(context) {
    const conventions = context.getSection('project-conventions');
    const strategy = conventions?.branchingStrategy || 'git-flow';
    
    switch (strategy) {
      case 'git-flow':
        return ['main', 'develop'];
      case 'github-flow':
        return ['main'];
      case 'gitlab-flow':
        return ['main', 'production'];
      default:
        return ['main'];
    }
  }

  async createClaudeMd(projectPath, context) {
    const claudeMdContent = `# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## Project Overview
${context.getSection('project-overview') || 'A Vibe-powered project with systematic development methodology.'}

## Conventions
${context.getSection('project-conventions') || 'Follow standard Vibe conventions.'}

## Quality Standards
${context.getSection('quality-standards') || 'Maintain 95%+ test coverage and comprehensive documentation.'}

## Security Policies
${context.getSection('security-policies') || 'Follow OWASP guidelines and security best practices.'}

## Context Engineering
This project uses context engineering for optimal AI interactions.
- Token Budget: ${context.tokenBudget}
- Priority Sections: ${context.prioritySections.join(', ')}
- Learning Enabled: ${context.learningEnabled}

Generated on: ${new Date().toISOString()}
Context Version: ${context.version}
`;

    await this.writeFile(path.join(projectPath, 'CLAUDE.md'), claudeMdContent);
  }

  async initializeContextEngineering(projectPath) {
    // Create context directories
    const contextDirs = [
      'context/layers/instructional',
      'context/layers/knowledge',
      'context/layers/operational',
      'context/memory',
      'context/patterns',
      'context/validation'
    ];
    
    for (const dir of contextDirs) {
      await this.createDirectory(path.join(projectPath, dir));
    }
    
    // Create initial context configuration
    const contextConfig = {
      version: '2.0',
      enabled: true,
      features: {
        layeredContext: true,
        tokenOptimization: true,
        caching: true,
        learning: true,
        validation: true
      },
      tokenBudgets: {
        default: 200000,
        commands: {
          'vibe-init': 4000,
          'vibe-step-1': 5000,
          'vibe-step-2': 6000,
          'vibe-step-10': 8000
        }
      }
    };
    
    await this.writeFile(
      path.join(projectPath, 'context/config.json'),
      JSON.stringify(contextConfig, null, 2)
    );
  }

  generateNextSteps(template, context) {
    const steps = [];
    
    // Add navigation step
    steps.push(`Run \`cd ${params.projectName}\` to enter the project`);
    
    // Add context-aware next steps
    if (context.hasSection('project-roadmap')) {
      const roadmap = context.getSection('project-roadmap');
      steps.push(...roadmap.immediateSteps);
    } else {
      // Default steps
      steps.push('Run `/vibe-step-1` to begin ideation');
      steps.push('Run `/vibe-status` to check project status');
    }
    
    // Add context engineering steps if enabled
    if (context.learningEnabled) {
      steps.push('Run `/vibe-context` to view context usage');
      steps.push('Run `/vibe-learn` to see AI learning insights');
    }
    
    return steps;
  }
}
```

### 3. Enhanced Step Commands

```javascript
// src/commands/vibe-step.js
export class VibeStepCommand extends BaseVibeCommand {
  constructor(stepNumber) {
    super({
      name: `vibe-step-${stepNumber}`,
      description: `Execute step ${stepNumber} of Vibe methodology`,
      contextEnabled: true
    });
    this.stepNumber = stepNumber;
  }

  async executeWithContext(params, context) {
    // Load previous step outputs for continuity
    const previousOutputs = await this.loadPreviousOutputs();
    
    // Inject previous outputs into context
    context.addLayer({
      type: 'knowledge',
      content: previousOutputs,
      priority: 8
    });
    
    // Get step-specific instructions
    const stepInstructions = context.getSection(`step-${this.stepNumber}-instructions`);
    
    // Execute step with MCP tools if specified
    const mcpTools = context.mcpTools || [];
    const results = await this.executeStepWithTools(params, {
      instructions: stepInstructions,
      tools: mcpTools,
      context
    });
    
    // Store output for next steps
    await this.storeStepOutput(results);
    
    // Update project status
    await this.updateProjectStatus({
      currentStep: this.stepNumber,
      completedAt: new Date(),
      results
    });
    
    return results;
  }

  async executeStepWithTools(params, config) {
    const { instructions, tools, context } = config;
    const results = {};
    
    // Execute with each required tool
    for (const tool of tools) {
      if (tool === 'context7' && context.hasSection('research-queries')) {
        results.research = await this.executeContext7Research(
          context.getSection('research-queries'),
          context
        );
      }
      
      if (tool === 'perplexity' && context.hasSection('analysis-prompts')) {
        results.analysis = await this.executePerplexityAnalysis(
          context.getSection('analysis-prompts'),
          context
        );
      }
    }
    
    // Generate step output based on instructions and tool results
    results.output = await this.generateStepOutput({
      instructions,
      toolResults: results,
      context
    });
    
    return results;
  }

  async loadPreviousOutputs() {
    const outputs = [];
    
    for (let i = 1; i < this.stepNumber; i++) {
      const outputPath = `docs/vibe-coding/0${i}-*.md`;
      const files = await this.glob(outputPath);
      
      for (const file of files) {
        outputs.push({
          step: i,
          content: await this.readFile(file),
          metadata: this.extractMetadata(file)
        });
      }
    }
    
    return outputs;
  }
}
```

### 4. Enhanced Retrofit Command

```javascript
// src/commands/vibe-retrofit.js
export class VibeRetrofitCommand extends BaseVibeCommand {
  constructor() {
    super({
      name: 'vibe-retrofit',
      description: 'Retrofit existing codebase with Vibe patterns',
      contextEnabled: true
    });
  }

  async executeWithContext(params, context) {
    const { targetPath, options = {} } = params;
    
    console.log('🔧 Starting Vibe retrofit with context awareness...');
    
    // Phase 1: Analyze existing codebase
    const analysis = await this.analyzeCodebase(targetPath, context);
    
    // Phase 2: Generate retrofit plan
    const plan = await this.generateRetrofitPlan(analysis, context);
    
    // Phase 3: Apply retrofits progressively
    const results = await this.applyRetrofits(plan, {
      ...options,
      context
    });
    
    // Phase 4: Validate retrofitted code
    const validation = await this.validateRetrofit(results, context);
    
    // Store retrofit history for learning
    await this.storeRetrofitHistory({
      analysis,
      plan,
      results,
      validation,
      context: context.summary()
    });
    
    return {
      success: validation.passed,
      summary: this.generateRetrofitSummary(results),
      validation,
      nextSteps: this.generateNextSteps(validation)
    };
  }

  async analyzeCodebase(targetPath, context) {
    const patterns = context.getSection('pattern-detection');
    const analyzer = new CodebaseAnalyzer({
      patterns,
      depth: context.analysisDepth || 3
    });
    
    // Analyze structure
    const structure = await analyzer.analyzeStructure(targetPath);
    
    // Detect existing patterns
    const detectedPatterns = await analyzer.detectPatterns(targetPath, patterns);
    
    // Assess compatibility
    const compatibility = await analyzer.assessCompatibility(
      structure,
      context.getSection('compatibility-requirements')
    );
    
    // Generate tech debt report
    const techDebt = await analyzer.analyzeTechDebt(targetPath);
    
    return {
      structure,
      patterns: detectedPatterns,
      compatibility,
      techDebt,
      metrics: await analyzer.gatherMetrics(targetPath)
    };
  }

  async generateRetrofitPlan(analysis, context) {
    const planner = new RetrofitPlanner({
      strategy: context.getSection('retrofit-strategy'),
      priorities: context.getSection('retrofit-priorities')
    });
    
    // Create phased plan
    const phases = await planner.createPhases(analysis);
    
    // Assign risk levels
    const risks = await planner.assessRisks(phases, analysis.compatibility);
    
    // Generate rollback strategies
    const rollback = await planner.generateRollbackStrategies(phases);
    
    // Optimize for minimal disruption
    const optimized = await planner.optimizePlan(phases, {
      maxDisruption: context.maxDisruptionLevel || 0.3,
      preserveApi: context.preserveExistingApi || true
    });
    
    return {
      phases: optimized,
      risks,
      rollback,
      estimatedDuration: planner.estimateDuration(optimized),
      requiredResources: planner.calculateResources(optimized)
    };
  }

  async applyRetrofits(plan, options) {
    const results = {
      phases: [],
      modified: [],
      created: [],
      errors: []
    };
    
    for (const phase of plan.phases) {
      try {
        console.log(`📝 Applying phase: ${phase.name}`);
        
        // Create compatibility layer if needed
        if (phase.requiresCompatLayer) {
          await this.createCompatibilityLayer(phase, options.context);
        }
        
        // Apply transformations
        const phaseResult = await this.applyPhaseTransformations(phase, options);
        
        // Run incremental tests
        if (options.testIncremental) {
          const tests = await this.runIncrementalTests(phaseResult);
          phaseResult.tests = tests;
        }
        
        results.phases.push(phaseResult);
        results.modified.push(...phaseResult.modified);
        results.created.push(...phaseResult.created);
        
      } catch (error) {
        results.errors.push({
          phase: phase.name,
          error: error.message,
          rollback: await this.rollbackPhase(phase)
        });
        
        if (!options.continueOnError) {
          break;
        }
      }
    }
    
    return results;
  }
}
```

### 5. Context-Specific Commands

```javascript
// src/commands/vibe-context.js
export class VibeContextCommand extends BaseVibeCommand {
  constructor() {
    super({
      name: 'vibe-context',
      description: 'Manage and view context engineering state',
      contextEnabled: true
    });
  }

  async executeWithContext(params, context) {
    const { action = 'status' } = params;
    
    switch (action) {
      case 'status':
        return this.showContextStatus(context);
      
      case 'optimize':
        return this.optimizeContext(context);
      
      case 'export':
        return this.exportContext(context, params.format);
      
      case 'reset':
        return this.resetContext(params.scope);
      
      case 'analyze':
        return this.analyzeContextUsage(params.timeframe);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async showContextStatus(context) {
    const stats = context.getStats();
    const manager = new DynamicContextManager(process.cwd());
    
    console.log('\n📊 Context Engineering Status');
    console.log('=============================\n');
    
    console.log('Token Usage:');
    console.log(`  Current: ${stats.tokens.used.toLocaleString()} / ${stats.tokens.total.toLocaleString()}`);
    console.log(`  Available: ${stats.tokens.available.toLocaleString()} (${stats.tokens.percentUsed}%)`);
    
    console.log('\nActive Layers:');
    stats.layers.forEach(layer => {
      console.log(`  ${layer.type}: ${layer.count} sections (${layer.tokens.toLocaleString()} tokens)`);
    });
    
    console.log('\nLearning Metrics:');
    const learning = await manager.getLearningMetrics();
    console.log(`  Sessions: ${learning.totalSessions}`);
    console.log(`  Patterns: ${learning.patternsLearned}`);
    console.log(`  Success Rate: ${learning.successRate}%`);
    
    console.log('\nCache Performance:');
    console.log(`  Hit Rate: ${stats.cache.hitRate}%`);
    console.log(`  Size: ${stats.cache.size} entries`);
    console.log(`  Memory: ${(stats.cache.memoryUsage / 1024 / 1024).toFixed(2)} MB`);
    
    if (stats.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      stats.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
      });
    }
    
    return stats;
  }

  async optimizeContext(context) {
    console.log('🔧 Optimizing context...\n');
    
    const optimizer = new ContextOptimizer();
    const before = context.getStats();
    
    // Apply optimization strategies
    const strategies = [
      'deduplication',
      'compression',
      'prioritization',
      'caching'
    ];
    
    const results = {};
    for (const strategy of strategies) {
      console.log(`Applying ${strategy}...`);
      results[strategy] = await optimizer.apply(strategy, context);
    }
    
    const after = context.getStats();
    
    console.log('\n✅ Optimization Complete');
    console.log(`  Tokens saved: ${before.tokens.used - after.tokens.used}`);
    console.log(`  Reduction: ${((1 - after.tokens.used / before.tokens.used) * 100).toFixed(1)}%`);
    
    return {
      before,
      after,
      strategies: results
    };
  }
}

// src/commands/vibe-learn.js
export class VibeLearnCommand extends BaseVibeCommand {
  constructor() {
    super({
      name: 'vibe-learn',
      description: 'View and manage AI learning insights',
      contextEnabled: true
    });
  }

  async executeWithContext(params, context) {
    const learningSystem = new ContextLearningSystem(process.cwd());
    const { action = 'insights' } = params;
    
    switch (action) {
      case 'insights':
        return this.showInsights(learningSystem, params.filter);
      
      case 'patterns':
        return this.showPatterns(learningSystem);
      
      case 'recommendations':
        return this.getRecommendations(learningSystem, params.command);
      
      case 'export':
        return this.exportLearnings(learningSystem, params.format);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async showInsights(learningSystem, filter) {
    const insights = await learningSystem.getInsights({
      filter,
      limit: 10,
      sortBy: 'impact'
    });
    
    console.log('\n💡 Learning Insights');
    console.log('===================\n');
    
    insights.forEach((insight, index) => {
      console.log(`${index + 1}. [${insight.type}] ${insight.title}`);
      console.log(`   Impact: ${insight.impact} | Confidence: ${insight.confidence}%`);
      console.log(`   ${insight.description}`);
      
      if (insight.recommendation) {
        console.log(`   → Recommendation: ${insight.recommendation}`);
      }
      
      if (insight.examples.length > 0) {
        console.log(`   Examples: ${insight.examples.slice(0, 2).join(', ')}`);
      }
      
      console.log();
    });
    
    return insights;
  }
}
```

## Progressive Enhancement Strategy

### Phase 1: Foundation (Week 1)
1. **Setup Command Router**
   ```javascript
   // src/router/command-router.js
   export class EnhancedCommandRouter {
     constructor() {
       this.commands = new Map();
       this.enhancer = null;
       this.contextEnabled = process.env.VIBE_CONTEXT_ENABLED === 'true';
     }
     
     async initialize() {
       if (this.contextEnabled) {
         this.enhancer = await createVibeEnhancer(process.cwd());
       }
       
       // Register all commands
       this.registerCommands();
     }
     
     async execute(commandName, params) {
       const command = this.commands.get(commandName);
       
       if (!command) {
         throw new Error(`Unknown command: ${commandName}`);
       }
       
       if (this.contextEnabled && this.enhancer) {
         // Execute with context enhancement
         const enhancedHandler = this.enhancer.getEnhancedHandler(commandName) 
           || this.enhancer.enhanceCommand(commandName, command.execute.bind(command));
         
         return enhancedHandler(params);
       } else {
         // Execute legacy
         return command.execute(params);
       }
     }
   }
   ```

2. **Create Base Commands**
   - Implement BaseVibeCommand class
   - Create command factory system
   - Setup command registration

### Phase 2: Core Commands (Week 2)
1. **Enhance vibe-init**
   - Add context-aware project setup
   - Implement template selection based on context
   - Create intelligent CLAUDE.md generation

2. **Enhance vibe-step commands**
   - Implement context continuity between steps
   - Add MCP tool integration
   - Create output chaining system

3. **Enhance vibe-retrofit**
   - Add pattern detection with context
   - Implement progressive retrofitting
   - Create compatibility layer generation

### Phase 3: Validation Commands (Week 3)
1. **Enhance vibe-validate-work**
   - Context-aware validation rules
   - Learning from validation failures
   - Adaptive threshold adjustment

2. **Enhance vibe-ui-healer**
   - Context-based UI pattern detection
   - Automated fix suggestions
   - Visual regression prevention

3. **Enhance vibe-test-runner**
   - Context-aware test generation
   - Coverage optimization
   - Test prioritization

### Phase 4: Utility Commands (Week 4)
1. **Create vibe-context command**
   - Context status dashboard
   - Optimization tools
   - Export/import functionality

2. **Create vibe-learn command**
   - Learning insights viewer
   - Pattern browser
   - Recommendation engine

3. **Enhance vibe-status**
   - Context-aware status display
   - Progress tracking with insights
   - Next step recommendations

## Backward Compatibility

### 1. Feature Flags
```javascript
// config/features.js
export const FEATURES = {
  CONTEXT_ENGINEERING: process.env.VIBE_CONTEXT_ENABLED === 'true',
  LEARNING_SYSTEM: process.env.VIBE_LEARNING_ENABLED === 'true',
  TOKEN_OPTIMIZATION: process.env.VIBE_TOKEN_OPT_ENABLED === 'true',
  LEGACY_MODE: process.env.VIBE_LEGACY_MODE === 'true'
};
```

### 2. Gradual Migration
```javascript
// src/migration/context-migrator.js
export class ContextMigrator {
  async migrate(projectPath) {
    const steps = [
      this.backupProject,
      this.createContextDirs,
      this.migrateConfig,
      this.updateCommands,
      this.validateMigration
    ];
    
    for (const step of steps) {
      await step.call(this, projectPath);
    }
  }
}
```

### 3. Compatibility Layer
```javascript
// src/compat/legacy-adapter.js
export class LegacyAdapter {
  static wrapCommand(command) {
    return {
      ...command,
      execute: async (params) => {
        // Convert new params to legacy format
        const legacyParams = this.convertParams(params);
        
        // Execute legacy command
        const result = await command.executeLegacy(legacyParams);
        
        // Convert result to new format
        return this.convertResult(result);
      }
    };
  }
}
```

## Testing Strategy

### 1. Unit Tests
```javascript
// tests/commands/vibe-init.test.js
describe('VibeInitCommand', () => {
  describe('with context enabled', () => {
    it('should create project with context-aware setup', async () => {
      const command = new VibeInitCommand();
      const context = mockContext({
        sections: ['project-conventions', 'quality-standards']
      });
      
      const result = await command.executeWithContext(
        { projectName: 'test-project' },
        context
      );
      
      expect(result.success).toBe(true);
      expect(result.projectPath).toContain('test-project');
      expect(fs.existsSync(path.join(result.projectPath, 'CLAUDE.md'))).toBe(true);
    });
  });
  
  describe('legacy mode', () => {
    it('should create basic project structure', async () => {
      const command = new VibeInitCommand();
      const result = await command.executeLegacy({ projectName: 'test-project' });
      
      expect(result.success).toBe(true);
      expect(result.projectPath).toContain('test-project');
    });
  });
});
```

### 2. Integration Tests
```javascript
// tests/integration/command-flow.test.js
describe('Command Flow Integration', () => {
  it('should maintain context between steps', async () => {
    const router = new EnhancedCommandRouter();
    await router.initialize();
    
    // Execute step 1
    const step1Result = await router.execute('vibe-step-1', {
      research: 'AI coding assistant'
    });
    
    // Execute step 2 - should have access to step 1 output
    const step2Result = await router.execute('vibe-step-2', {});
    
    expect(step2Result.context).toContain('step-1 output');
  });
});
```

## Performance Optimization

### 1. Lazy Loading
```javascript
// src/utils/lazy-loader.js
export class LazyCommandLoader {
  constructor() {
    this.commands = new Map();
  }
  
  async load(commandName) {
    if (!this.commands.has(commandName)) {
      const module = await import(`../commands/${commandName}.js`);
      this.commands.set(commandName, new module.default());
    }
    
    return this.commands.get(commandName);
  }
}
```

### 2. Context Caching
```javascript
// src/cache/context-cache.js
export class ContextCache {
  constructor() {
    this.cache = new LRU({
      max: 100,
      ttl: 1000 * 60 * 60, // 1 hour
      updateAgeOnGet: true
    });
  }
  
  async get(key, generator) {
    const cached = this.cache.get(key);
    if (cached) return cached;
    
    const value = await generator();
    this.cache.set(key, value);
    return value;
  }
}
```

### 3. Parallel Processing
```javascript
// src/utils/parallel-processor.js
export class ParallelProcessor {
  async processCommands(commands) {
    const chunks = this.chunkArray(commands, 3); // Process 3 at a time
    const results = [];
    
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(cmd => this.processCommand(cmd))
      );
      results.push(...chunkResults);
    }
    
    return results;
  }
}
```

## Monitoring and Analytics

### 1. Command Metrics
```javascript
// src/monitoring/command-metrics.js
export class CommandMetrics {
  async record(command, execution) {
    const metrics = {
      command: command.name,
      timestamp: new Date(),
      duration: execution.duration,
      tokenUsage: execution.context?.tokens,
      success: execution.success,
      errors: execution.errors
    };
    
    await this.store(metrics);
    await this.checkThresholds(metrics);
  }
}
```

### 2. Context Dashboard
```javascript
// src/dashboard/context-dashboard.js
export class ContextDashboard {
  async render() {
    const stats = await this.gatherStats();
    
    console.log(chalk.bold('\n📊 Vibe Context Dashboard\n'));
    
    this.renderTokenUsage(stats.tokens);
    this.renderCommandPerformance(stats.commands);
    this.renderLearningInsights(stats.learning);
    this.renderRecommendations(stats.recommendations);
  }
}
```

## Implementation Timeline

### Week 1: Foundation
- [ ] Implement base command structure
- [ ] Create command router with context support
- [ ] Setup testing framework
- [ ] Create migration tools

### Week 2: Core Commands
- [ ] Enhance vibe-init with context
- [ ] Enhance all vibe-step commands
- [ ] Enhance vibe-retrofit command
- [ ] Add MCP tool integration

### Week 3: Validation & Quality
- [ ] Enhance validation commands
- [ ] Implement UI healer improvements
- [ ] Create test runner enhancements
- [ ] Add quality gates

### Week 4: Utilities & Polish
- [ ] Create context management commands
- [ ] Implement learning system commands
- [ ] Add monitoring and analytics
- [ ] Create documentation

### Week 5: Testing & Optimization
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Release preparation

## Success Metrics

1. **Performance**
   - 30-50% reduction in token usage
   - < 100ms context assembly time
   - 95%+ cache hit rate for common operations

2. **Quality**
   - 100% backward compatibility
   - 95%+ test coverage
   - Zero breaking changes

3. **Adoption**
   - Seamless migration path
   - Clear documentation
   - Positive developer feedback

## Conclusion

This enhancement strategy provides a comprehensive approach to integrating context engineering with Vibe commands while maintaining backward compatibility and enabling progressive enhancement. The modular architecture ensures that teams can adopt features gradually and benefit from immediate improvements in AI interaction quality and efficiency.