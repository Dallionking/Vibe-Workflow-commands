/**
 * Enhanced vibe-init Command
 * Demonstrates context engineering integration with backward compatibility
 */

import { BaseVibeCommand } from './base-command.js';
import { DynamicContextManager } from '../context/assembly/dynamic-context-manager.js';
import { CommandContextRegistry } from '../context/registry/command-registry.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class VibeInitCommand extends BaseVibeCommand {
  constructor() {
    super({
      name: 'vibe-init',
      description: 'Initialize a new Vibe project with context-aware setup',
      contextEnabled: true,
      fallbackEnabled: true
    });
    
    // Get command context from registry
    this.commandContext = CommandContextRegistry.get('vibe-init');
  }

  /**
   * Validate command parameters
   */
  async validate(params) {
    if (!params.projectName) {
      throw new Error('Project name is required. Usage: /vibe-init <project-name>');
    }
    
    // Validate project name format
    const validNameRegex = /^[a-z0-9-]+$/;
    if (!validNameRegex.test(params.projectName)) {
      throw new Error('Project name must contain only lowercase letters, numbers, and hyphens');
    }
    
    // Check if directory already exists
    const projectPath = path.join(process.cwd(), params.projectName);
    try {
      await fs.access(projectPath);
      throw new Error(`Directory ${params.projectName} already exists`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  /**
   * Execute with context enhancement
   */
  async executeWithContext(params, context) {
    const { projectName, template = 'default', options = {} } = params;
    
    console.log('🚀 Initializing Vibe project with enhanced context...');
    console.log(`📊 Context available: ${context.tokens} tokens across ${context.layers.length} layers`);
    
    // Extract relevant context sections
    const projectConventions = this.extractSection(context, 'project-conventions');
    const qualityStandards = this.extractSection(context, 'quality-standards');
    const securityPolicies = this.extractSection(context, 'security-policies');
    const projectStructure = this.extractSection(context, 'project-structure');
    
    // Create enhanced project structure
    const projectPath = await this.createProjectStructure({
      name: projectName,
      template,
      conventions: projectConventions,
      standards: qualityStandards,
      security: securityPolicies,
      structure: projectStructure,
      contextAware: true
    });
    
    // Initialize git with context-aware configuration
    await this.initializeGit(projectPath, {
      message: this.generateCommitMessage(projectConventions),
      branches: this.determineBranches(projectConventions),
      hooks: this.generateGitHooks(qualityStandards)
    });
    
    // Create enhanced CLAUDE.md
    await this.createClaudeMd(projectPath, {
      context,
      projectConventions,
      qualityStandards,
      securityPolicies
    });
    
    // Initialize context engineering infrastructure
    if (options.enableContextEngineering !== false) {
      await this.initializeContextEngineering(projectPath, context);
    }
    
    // Create initial .vibe-status.md
    await this.createVibeStatus(projectPath, {
      template,
      contextVersion: context.version || '2.0',
      initTimestamp: new Date()
    });
    
    // Store project metadata
    await this.storeProjectMetadata(projectPath, {
      name: projectName,
      template,
      contextEnabled: true,
      contextVersion: context.version,
      initTimestamp: new Date(),
      enabledFeatures: this.extractEnabledFeatures(options),
      tokenBudget: this.commandContext?.tokenBudget || 4000
    });
    
    // Generate and display next steps
    const nextSteps = this.generateNextSteps(projectName, template, context);
    
    return {
      success: true,
      projectPath,
      contextUsed: {
        tokens: context.tokens,
        layers: context.layers.length,
        sections: Object.keys(context.sections || {})
      },
      nextSteps
    };
  }

  /**
   * Legacy execution without context
   */
  async executeLegacy(params) {
    const { projectName, template = 'default' } = params;
    
    console.log('🚀 Initializing Vibe project...');
    
    // Create basic project structure
    const projectPath = await this.createProjectStructure({
      name: projectName,
      template,
      contextAware: false
    });
    
    // Basic git initialization
    await this.initializeGit(projectPath, {
      message: 'Initial commit',
      branches: ['main']
    });
    
    // Create basic CLAUDE.md
    await this.createBasicClaudeMd(projectPath);
    
    // Create initial .vibe-status.md
    await this.createVibeStatus(projectPath, {
      template,
      initTimestamp: new Date()
    });
    
    return {
      success: true,
      projectPath,
      nextSteps: [
        `Run \`cd ${projectName}\` to enter the project`,
        'Run `/vibe-step-1` to begin ideation',
        'Run `/vibe-status` to check project status'
      ]
    };
  }

  /**
   * Create project directory structure
   */
  async createProjectStructure(config) {
    const { name, template, conventions, structure, contextAware } = config;
    const projectPath = path.join(process.cwd(), name);
    
    // Create main project directory
    await fs.mkdir(projectPath, { recursive: true });
    
    // Define directory structure based on template and context
    const dirs = this.getDirectoryStructure(template, structure, contextAware);
    
    // Create all directories
    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }
    
    // Create initial files
    const files = this.getInitialFiles(template, conventions, contextAware);
    
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(projectPath, filePath);
      await fs.writeFile(fullPath, content);
    }
    
    return projectPath;
  }

  /**
   * Get directory structure based on template
   */
  getDirectoryStructure(template, customStructure, contextAware) {
    const baseStructure = [
      'src',
      'tests',
      'docs',
      'docs/vibe-coding',
      'phases',
      '.vibe'
    ];
    
    const templateStructures = {
      default: [],
      saas: ['src/api', 'src/components', 'src/pages', 'src/services', 'src/utils'],
      mobile: ['src/screens', 'src/components', 'src/navigation', 'src/services'],
      api: ['src/routes', 'src/controllers', 'src/models', 'src/middleware'],
      cli: ['src/commands', 'src/utils', 'bin']
    };
    
    const contextDirs = contextAware ? [
      'context',
      'context/layers/instructional',
      'context/layers/knowledge', 
      'context/layers/operational',
      'context/memory',
      'context/patterns',
      'context/validation'
    ] : [];
    
    return [
      ...baseStructure,
      ...(templateStructures[template] || []),
      ...(customStructure || []),
      ...contextDirs
    ];
  }

  /**
   * Get initial files based on template
   */
  getInitialFiles(template, conventions, contextAware) {
    const files = {
      'README.md': this.generateReadme(template),
      '.gitignore': this.generateGitignore(template),
      'package.json': this.generatePackageJson(template, contextAware),
      '.env.example': this.generateEnvExample(contextAware)
    };
    
    // Add template-specific files
    switch (template) {
      case 'saas':
        files['src/index.tsx'] = '// Entry point for SaaS application\n';
        files['tsconfig.json'] = this.generateTsConfig();
        break;
      case 'api':
        files['src/server.js'] = '// API server entry point\n';
        break;
      case 'cli':
        files['bin/cli.js'] = '#!/usr/bin/env node\n// CLI entry point\n';
        break;
    }
    
    // Add context-aware files
    if (contextAware) {
      files['context/config.json'] = JSON.stringify({
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
          commands: this.getCommandTokenBudgets()
        }
      }, null, 2);
    }
    
    return files;
  }

  /**
   * Initialize git repository
   */
  async initializeGit(projectPath, config) {
    const { message, branches, hooks } = config;
    
    // Initialize git
    await this.execCommand('git init', projectPath);
    
    // Create branches
    for (const branch of branches) {
      if (branch !== 'main') {
        await this.execCommand(`git checkout -b ${branch}`, projectPath);
      }
    }
    
    // Switch back to main
    await this.execCommand('git checkout main', projectPath);
    
    // Create git hooks if provided
    if (hooks) {
      const hooksPath = path.join(projectPath, '.git/hooks');
      for (const [hookName, hookContent] of Object.entries(hooks)) {
        const hookPath = path.join(hooksPath, hookName);
        await fs.writeFile(hookPath, hookContent);
        await fs.chmod(hookPath, 0o755);
      }
    }
    
    // Initial commit
    await this.execCommand('git add .', projectPath);
    await this.execCommand(`git commit -m "${message}"`, projectPath);
  }

  /**
   * Create enhanced CLAUDE.md
   */
  async createClaudeMd(projectPath, config) {
    const { context, projectConventions, qualityStandards, securityPolicies } = config;
    
    const content = `# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## Project Overview
This is a Vibe-powered project using systematic development methodology with context engineering enhancements.

## Context Engineering
This project uses advanced context engineering for optimal AI interactions:
- **Token Budget**: ${context.tokenBudget || this.commandContext?.tokenBudget || 4000} tokens
- **Context Version**: ${context.version || '2.0'}
- **Learning Enabled**: ${context.learningEnabled !== false}
- **Optimization**: Automatic token optimization and caching

## Project Conventions
${projectConventions || `
- Follow Vibe Coding methodology strictly
- Use semantic commit messages
- Maintain comprehensive documentation
- Write tests for all features (95%+ coverage)
`}

## Quality Standards
${qualityStandards || `
- Code Coverage: 95%+ required
- Documentation: All public APIs must be documented
- Testing: Unit, integration, and e2e tests required
- Performance: Core operations < 100ms
- Security: Follow OWASP guidelines
`}

## Security Policies
${securityPolicies || `
- Never commit sensitive data
- Use environment variables for configuration
- Implement proper authentication and authorization
- Regular security audits required
- Follow principle of least privilege
`}

## Development Workflow
1. Always check \`.vibe-status.md\` for current project state
2. Read previous step outputs in \`docs/vibe-coding/\`
3. Follow phase documents in \`phases/\`
4. Use \`/vibe-context\` to monitor context usage
5. Run \`/vibe-validate-work\` before completing tasks

## Available Commands
- \`/vibe-status\` - Check project status
- \`/vibe-step-[1-10]\` - Execute Vibe methodology steps
- \`/vibe-context\` - Manage context engineering
- \`/vibe-learn\` - View AI learning insights
- \`/vibe-validate-work\` - Validate current work
- \`/vibe-retrofit\` - Apply Vibe patterns to existing code

## Context Layers
This project uses layered context for optimal AI performance:
1. **Instructional Layer** - Methodology and guidelines
2. **Knowledge Layer** - Project documentation and outputs
3. **Operational Layer** - Runtime state and history

Generated on: ${new Date().toISOString()}
`;
    
    await fs.writeFile(path.join(projectPath, 'CLAUDE.md'), content);
  }

  /**
   * Create basic CLAUDE.md for legacy mode
   */
  async createBasicClaudeMd(projectPath) {
    const content = `# CLAUDE.md

This file provides guidance to Claude Code when working with this project.

## Project Overview
A Vibe-powered project following systematic development methodology.

## Core Principles
1. Follow the 10-step Vibe Coding methodology
2. Maintain 95%+ test coverage
3. Write comprehensive documentation
4. Use semantic commit messages

## Development Workflow
1. Check \`.vibe-status.md\` for current state
2. Read previous outputs in \`docs/vibe-coding/\`
3. Follow phase documents in \`phases/\`
4. Validate work before completion

Generated on: ${new Date().toISOString()}
`;
    
    await fs.writeFile(path.join(projectPath, 'CLAUDE.md'), content);
  }

  /**
   * Initialize context engineering infrastructure
   */
  async initializeContextEngineering(projectPath, context) {
    console.log('📦 Setting up context engineering infrastructure...');
    
    // Create context configuration
    const contextConfig = {
      version: context.version || '2.0',
      projectRoot: projectPath,
      enabled: true,
      features: {
        layeredContext: true,
        tokenOptimization: true,
        caching: true,
        learning: true,
        validation: true,
        monitoring: true
      },
      tokenBudgets: {
        default: 200000,
        warning: 0.8,
        critical: 0.95,
        commands: this.getCommandTokenBudgets()
      },
      layers: {
        instructional: { priority: 10, cacheable: true },
        knowledge: { priority: 7, cacheable: true },
        operational: { priority: 5, cacheable: false }
      }
    };
    
    await fs.writeFile(
      path.join(projectPath, 'context/config.json'),
      JSON.stringify(contextConfig, null, 2)
    );
    
    // Create initial patterns file
    const patterns = {
      version: '1.0',
      patterns: [],
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(projectPath, 'context/patterns/patterns.json'),
      JSON.stringify(patterns, null, 2)
    );
    
    // Create learning system initialization
    const learningConfig = {
      enabled: true,
      sessionTracking: true,
      patternRecognition: true,
      insights: {
        minConfidence: 0.7,
        maxInsights: 10
      }
    };
    
    await fs.writeFile(
      path.join(projectPath, 'context/memory/learning-config.json'),
      JSON.stringify(learningConfig, null, 2)
    );
  }

  /**
   * Helper methods
   */
  
  extractSection(context, sectionName) {
    return context.sections?.[sectionName] || 
           context.layers?.find(l => l.name === sectionName)?.content ||
           null;
  }
  
  generateCommitMessage(conventions) {
    const style = conventions?.commitStyle || 'conventional';
    
    switch (style) {
      case 'conventional':
        return 'feat: initialize new Vibe project with context engineering';
      case 'semantic':
        return 'Initialize: New Vibe project with enhanced context support';
      case 'descriptive':
        return 'Initialize new Vibe project with context engineering infrastructure';
      default:
        return 'Initial commit';
    }
  }
  
  determineBranches(conventions) {
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
  
  generateGitHooks(standards) {
    const hooks = {};
    
    if (standards?.requireTests) {
      hooks['pre-commit'] = `#!/bin/sh
# Run tests before commit
npm test || exit 1
`;
    }
    
    if (standards?.requireLinting) {
      hooks['pre-commit'] = (hooks['pre-commit'] || '#!/bin/sh\n') + `
# Run linting
npm run lint || exit 1
`;
    }
    
    return hooks;
  }
  
  extractEnabledFeatures(options) {
    return {
      contextEngineering: options.enableContextEngineering !== false,
      learning: options.enableLearning !== false,
      validation: options.enableValidation !== false,
      monitoring: options.enableMonitoring !== false
    };
  }
  
  getCommandTokenBudgets() {
    const registry = CommandContextRegistry.getAll();
    const budgets = {};
    
    registry.forEach((context, command) => {
      budgets[command] = context.tokenBudget;
    });
    
    return budgets;
  }
  
  generateNextSteps(projectName, template, context) {
    const steps = [];
    
    // Navigation step
    steps.push(`Run \`cd ${projectName}\` to enter the project`);
    
    // Context-aware next steps
    if (context.hasSection?.('project-roadmap')) {
      const roadmap = this.extractSection(context, 'project-roadmap');
      if (roadmap?.immediateSteps) {
        steps.push(...roadmap.immediateSteps);
      }
    } else {
      // Default Vibe workflow steps
      steps.push('Run `/vibe-step-1` to begin ideation and research');
      steps.push('Run `/vibe-status` to check project status');
    }
    
    // Add context engineering steps
    if (context.enabled !== false) {
      steps.push('Run `/vibe-context status` to view context usage');
      steps.push('Run `/vibe-learn insights` to see AI learning insights');
    }
    
    // Template-specific steps
    switch (template) {
      case 'saas':
        steps.push('Run `npm install` to install dependencies');
        steps.push('Run `npm run dev` to start development server');
        break;
      case 'api':
        steps.push('Run `npm install` to install dependencies');
        steps.push('Set up your `.env` file based on `.env.example`');
        break;
      case 'cli':
        steps.push('Run `npm link` to make CLI available globally');
        break;
    }
    
    return steps;
  }
  
  async createVibeStatus(projectPath, metadata) {
    const content = `# Vibe Project Status

## Project Information
- **Name**: ${path.basename(projectPath)}
- **Template**: ${metadata.template}
- **Created**: ${metadata.initTimestamp.toISOString()}
- **Context Version**: ${metadata.contextVersion || 'Legacy'}

## Current Phase
- **Phase**: Initialization
- **Step**: Project Setup Complete
- **Status**: ✅ Ready for Step 1

## Completed Steps
- [x] Project initialization
- [x] Directory structure creation
- [x] Git repository setup
- [x] CLAUDE.md configuration
${metadata.contextVersion ? '- [x] Context engineering setup' : ''}

## Next Steps
1. Run \`/vibe-step-1\` to begin ideation
2. Define project goals and requirements
3. Research market and technical landscape

## Context Usage
${metadata.contextVersion ? `- Token Budget: ${this.commandContext?.tokenBudget || 4000}
- Layers: Instructional, Knowledge, Operational
- Learning: Enabled
- Optimization: Enabled` : '- Context Engineering: Not enabled'}

Last Updated: ${new Date().toISOString()}
`;
    
    await fs.writeFile(path.join(projectPath, '.vibe-status.md'), content);
  }
  
  async storeProjectMetadata(projectPath, metadata) {
    const vibeDir = path.join(projectPath, '.vibe');
    await fs.mkdir(vibeDir, { recursive: true });
    
    await fs.writeFile(
      path.join(vibeDir, 'project.json'),
      JSON.stringify(metadata, null, 2)
    );
  }
  
  generateReadme(template) {
    return `# Vibe Project

A systematically developed project using Vibe Coding methodology.

## Getting Started

1. Check project status: \`/vibe-status\`
2. Begin development: \`/vibe-step-1\`
3. View context usage: \`/vibe-context\`

## Project Structure

\`\`\`
.
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
│   └── vibe-coding/  # Vibe step outputs
├── phases/           # Development phases
├── context/          # Context engineering
└── .vibe/            # Vibe metadata
\`\`\`

## Development Workflow

Follow the Vibe Coding 10-step methodology for systematic development.
`;
  }
  
  generateGitignore(template) {
    const base = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/

# Production
build/
dist/
out/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Vibe
.vibe/cache/
.vibe/tmp/
context/cache/
context/memory/sessions/
`;
    
    const templateSpecific = {
      saas: '\n# Next.js\n.next/\n*.tsbuildinfo\n',
      mobile: '\n# React Native\n*.jsbundle\nios/Pods/\n',
      api: '\n# Logs\nlogs/\n*.log\n'
    };
    
    return base + (templateSpecific[template] || '');
  }
  
  generatePackageJson(template, contextAware) {
    const base = {
      name: 'vibe-project',
      version: '0.1.0',
      private: true,
      scripts: {
        test: 'jest',
        'test:coverage': 'jest --coverage',
        lint: 'eslint src',
        'vibe:status': 'vibe status',
        'vibe:validate': 'vibe validate-work'
      },
      devDependencies: {
        jest: '^29.0.0',
        eslint: '^8.0.0'
      }
    };
    
    if (contextAware) {
      base.scripts['context:status'] = 'vibe context status';
      base.scripts['context:optimize'] = 'vibe context optimize';
      base.scripts['learn:insights'] = 'vibe learn insights';
    }
    
    // Add template-specific dependencies
    switch (template) {
      case 'saas':
        base.dependencies = {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          next: '^13.0.0'
        };
        base.scripts.dev = 'next dev';
        base.scripts.build = 'next build';
        break;
      case 'api':
        base.dependencies = {
          express: '^4.18.0',
          cors: '^2.8.5',
          dotenv: '^16.0.0'
        };
        base.scripts.start = 'node src/server.js';
        base.scripts.dev = 'nodemon src/server.js';
        break;
    }
    
    return JSON.stringify(base, null, 2);
  }
  
  generateEnvExample(contextAware) {
    let content = `# Environment Configuration

# Node Environment
NODE_ENV=development

# API Configuration
API_PORT=3000
API_HOST=localhost
`;
    
    if (contextAware) {
      content += `
# Context Engineering
VIBE_CONTEXT_ENABLED=true
VIBE_LEARNING_ENABLED=true
VIBE_TOKEN_OPTIMIZATION=true
VIBE_SHOW_INSIGHTS=true
VIBE_DEBUG=false

# Token Budgets
VIBE_TOKEN_BUDGET_DEFAULT=200000
VIBE_TOKEN_WARNING_THRESHOLD=0.8
VIBE_TOKEN_CRITICAL_THRESHOLD=0.95
`;
    }
    
    return content;
  }
  
  generateTsConfig() {
    return JSON.stringify({
      compilerOptions: {
        target: 'es2020',
        module: 'commonjs',
        lib: ['es2020'],
        jsx: 'react-jsx',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: 'node',
        allowJs: true,
        noEmit: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', 'build']
    }, null, 2);
  }
  
  async execCommand(command, cwd) {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    try {
      await execAsync(command, { cwd });
    } catch (error) {
      console.warn(`Command failed: ${command}`, error.message);
    }
  }
}

// Export for use in command system
export default VibeInitCommand;