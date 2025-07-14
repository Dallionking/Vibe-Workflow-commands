/**
 * Enhanced vibe-init Command
 * Context-aware project initialization
 */

import { BaseCommand, CommandParams, CommandResult } from '../base-command';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface InitParams extends CommandParams {
  projectName: string;
  template?: string;
  skipGit?: boolean;
  contextMode?: 'basic' | 'advanced';
}

export class VibeInitCommand extends BaseCommand {
  constructor() {
    super({
      name: 'vibe-init',
      description: 'Initialize a new Vibe Coding project with context engineering',
      contextRequired: true,
      tokenBudget: 4000,
      patterns: ['project-structure']
    });
  }

  protected async implement(params: InitParams): Promise<CommandResult> {
    const { projectName, template = 'default', skipGit = false } = params;
    
    if (!projectName) {
      return {
        success: false,
        error: 'Project name is required',
        output: 'Usage: /vibe-init <project-name> [--template=<template>] [--skip-git]'
      };
    }

    const projectPath = path.join(this.projectRoot, projectName);
    
    // Check if directory already exists
    if (fs.existsSync(projectPath)) {
      return {
        success: false,
        error: `Directory ${projectName} already exists`
      };
    }

    try {
      // Create project structure
      this.createProjectStructure(projectPath);
      
      // Generate CLAUDE.md based on context
      const claudeMdContent = this.generateClaudeMd(params);
      fs.writeFileSync(path.join(projectPath, 'CLAUDE.md'), claudeMdContent);
      
      // Create .vibe-status.md
      const statusContent = this.generateStatusFile(projectName);
      fs.writeFileSync(path.join(projectPath, '.vibe-status.md'), statusContent);
      
      // Create context configuration
      const contextConfig = this.generateContextConfig(params);
      fs.writeFileSync(
        path.join(projectPath, '.vibe', 'context.config.json'),
        JSON.stringify(contextConfig, null, 2)
      );
      
      // Initialize git if not skipped
      if (!skipGit) {
        this.initializeGit(projectPath);
      }
      
      // Create initial directories
      this.createInitialDirectories(projectPath, template);
      
      // Generate output
      const output = this.formatOutput({
        'Project Initialized': `✅ ${projectName}`,
        'Location': projectPath,
        'Template': template,
        'Context Mode': params.contextMode || 'advanced',
        'Next Steps': this.getNextSteps(projectName)
      });

      return {
        success: true,
        output,
        data: {
          projectPath,
          contextEnabled: true,
          template
        }
      };

    } catch (error) {
      // Clean up on failure
      if (fs.existsSync(projectPath)) {
        fs.rmSync(projectPath, { recursive: true, force: true });
      }
      
      return {
        success: false,
        error: `Failed to initialize project: ${error}`
      };
    }
  }

  private createProjectStructure(projectPath: string): void {
    // Create main directories
    const directories = [
      projectPath,
      path.join(projectPath, '.vibe'),
      path.join(projectPath, 'docs', 'vibe-coding'),
      path.join(projectPath, 'phases'),
      path.join(projectPath, 'src'),
      path.join(projectPath, 'tests'),
      path.join(projectPath, 'templates')
    ];

    directories.forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
    });
  }

  private generateClaudeMd(params: InitParams): string {
    const isAdvanced = params.contextMode === 'advanced' || !params.contextMode;
    
    if (params._context && isAdvanced) {
      // Use context to generate intelligent CLAUDE.md
      const conventions = this.getContextSection(params._context, 'Project Conventions') || '';
      const standards = this.getContextSection(params._context, 'Quality Standards') || '';
      
      return `# CLAUDE.md v2.0

---
version: 2.0
project_type: ${params.template || 'full-stack'}
created: ${new Date().toISOString()}
context_layers:
  global:
    enabled: true
    budget: 2000
  phase:
    enabled: true
    budget: 3000
  task:
    enabled: true
    budget: 2000
---

## Context Layers

### L1: Global Rules (Always Active)
${conventions || 'Project-wide rules and standards will be defined here.'}

#### Project Conventions
- Code Style: Follow ESLint and Prettier configurations
- Naming: Use descriptive names, avoid abbreviations
- File Structure: Feature-based organization
- Comments: Write self-documenting code

#### Quality Standards
${standards || '- Maintain 95%+ test coverage\n- All code must be typed (TypeScript)\n- Follow accessibility guidelines'}

#### Security Policies
- Never commit sensitive data
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP guidelines

### L2: Phase Context (Current Phase)
Dynamic context based on current development phase.

### L3: Task Context (Current Task)
Task-specific context and recent changes.

## Validation Gates

\`\`\`yaml
phase_1_to_2:
  conditions:
    - all_tests_passing: true
    - documentation_complete: true
\`\`\`

## Pattern Library
Patterns will be learned and added as development progresses.

## Notes
This project uses Vibe Coding methodology with context engineering enhancements.`;
    }
    
    // Fallback to basic CLAUDE.md
    return `# ${params.projectName}

## Project Overview
This project was initialized with Vibe Coding methodology.

## Conventions
- Follow standard coding practices
- Write tests for all features
- Document all public APIs

## Getting Started
1. Review the Vibe Coding steps in docs/vibe-coding/
2. Start with /vibe-step-1-ideation
3. Follow the methodology through all 10 steps`;
  }

  private generateStatusFile(projectName: string): string {
    return `# Vibe Coding Status

**Project**: ${projectName}
**Created**: ${new Date().toISOString()}
**Current Phase**: initialization
**Context Mode**: Advanced

## Progress Tracking

### Completed Phases
- [x] Project Initialization

### Upcoming Phases
- [ ] Step 1: Feature Ideation
- [ ] Step 2: System Architecture
- [ ] Step 3: Project Setup
- [ ] Step 4: UI/UX Principles
- [ ] Step 5: Detailed UI/UX Design
- [ ] Step 6: Backend Design
- [ ] Step 7: Development Phases
- [ ] Step 8: Refinement
- [ ] Step 9: Review
- [ ] Step 10: Implementation

## Context Engineering Status
- ✅ Context layers configured
- ✅ Validation gates defined
- ✅ Learning system initialized
- ⏳ Pattern library empty (will populate during development)

## Next Steps
Run \`/vibe-step-1-ideation\` to begin the feature ideation process.`;
  }

  private generateContextConfig(params: InitParams): any {
    return {
      version: '1.0.0',
      projectName: params.projectName,
      template: params.template || 'default',
      layers: [
        {
          type: 'global',
          enabled: true,
          budget: 2000,
          sources: ['CLAUDE.md', 'package.json', '.eslintrc.json']
        },
        {
          type: 'phase',
          enabled: true,
          budget: 3000,
          sources: ['phases/*.md', 'docs/vibe-coding/*.md', '.vibe-status.md']
        },
        {
          type: 'task',
          enabled: true,
          budget: 2000,
          sources: ['git-status', 'recent-files', 'error-context']
        }
      ],
      features: {
        enableCompression: true,
        enableCaching: true,
        enableLearning: true,
        enableMetrics: true,
        debugMode: process.env.VIBE_DEBUG === 'true'
      }
    };
  }

  private initializeGit(projectPath: string): void {
    try {
      // Initialize git
      execSync('git init', { cwd: projectPath });
      
      // Create .gitignore
      const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Production
build/
dist/

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# Vibe Context
.vibe/context-memory.json
.vibe/cache/`;
      
      fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
      
      // Initial commit
      execSync('git add -A', { cwd: projectPath });
      execSync('git commit -m "Initial commit - Vibe Coding project initialized"', { 
        cwd: projectPath 
      });
    } catch (error) {
      console.warn('Git initialization failed:', error);
    }
  }

  private createInitialDirectories(projectPath: string, template: string): void {
    // Template-specific directories
    const templateDirs: Record<string, string[]> = {
      'react': ['src/components', 'src/hooks', 'src/styles', 'public'],
      'node': ['src/routes', 'src/services', 'src/models', 'src/utils'],
      'fullstack': ['client/src', 'server/src', 'shared/types'],
      'default': ['src/lib', 'src/utils']
    };

    const dirs = templateDirs[template] || templateDirs.default;
    
    dirs.forEach(dir => {
      fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
    });
    
    // Create README.md
    const readme = `# ${path.basename(projectPath)}

A Vibe Coding project with context engineering enhancements.

## Getting Started

1. Review the methodology in \`docs/vibe-coding/\`
2. Check current status in \`.vibe-status.md\`
3. Use Vibe commands to progress through phases

## Commands

- \`/vibe-status\` - Check current project status
- \`/vibe-step-1-ideation\` - Start feature ideation
- \`/vibe-help\` - Get help with commands

## Context Engineering

This project uses advanced context engineering for improved AI assistance.
Configuration can be found in \`.vibe/context.config.json\`.`;
    
    fs.writeFileSync(path.join(projectPath, 'README.md'), readme);
  }

  private getNextSteps(projectName: string): string {
    return `1. cd ${projectName}
2. Run /vibe-step-1-ideation to begin feature ideation
3. Follow the Vibe Coding methodology through all 10 steps
4. Use /vibe-status to track progress
5. Use /vibe-help for command assistance`;
  }
}