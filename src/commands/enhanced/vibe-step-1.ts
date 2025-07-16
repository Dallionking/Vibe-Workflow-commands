/**
 * Enhanced vibe-step-1-ideation Command
 * Context-aware feature ideation with research integration
 */

import { BaseCommand, CommandParams, CommandResult } from '../base-command';
import * as fs from 'fs';
import * as path from 'path';

interface IdeationParams extends CommandParams {
  feature?: string;
  research?: boolean;
  template?: string;
}

export class VibeStep1Command extends BaseCommand {
  constructor() {
    super({
      name: 'vibe-step-1-ideation',
      description: 'Feature ideation with context-aware research',
      contextRequired: true,
      tokenBudget: 5000,
      mcpTools: ['perplexity-ask', 'context7'],
      patterns: ['feature-ideation']
    });
  }

  protected async implement(params: IdeationParams): Promise<CommandResult> {
    const { feature, research = true } = params;

    try {
      console.log('\n🧠 Starting Feature Ideation (Step 1)...');

      // Check prerequisites
      const projectReady = await this.checkPrerequisites();
      if (!projectReady) {
        return {
          success: false,
          error: 'Project not initialized. Run /vibe-init first.'
        };
      }

      // Load context for ideation
      const projectContext = await this.loadProjectContext();
      const existingIdeas = await this.loadExistingIdeas();

      // Prepare ideation prompt
      const prompt = this.buildIdeationPrompt(feature, projectContext, existingIdeas);

      // Execute ideation with context
      let ideationResult = '';

      if (params._context) {
        // Use context-enhanced ideation
        ideationResult = await this.contextualIdeation(prompt, params._context);

        // Activate research tools if enabled
        if (research) {
          this.activateMCPTool('perplexity-ask');
          this.activateMCPTool('context7');
        }
      } else {
        // Fallback to template-based ideation
        ideationResult = await this.templateIdeation(feature, params.template);
      }

      // Generate output files
      const outputPath = path.join(this.projectRoot, 'docs/vibe-coding/01-feature-ideation.md');
      await this.writeFileWithValidation(outputPath, ideationResult);

      // Update project status
      await this.updateProjectStatus('step-1-complete', {
        feature: feature || 'General Product Vision',
        timestamp: new Date().toISOString(),
        researchEnabled: research
      });

      // Learn from this ideation
      if (params._context?.learningSystem) {
        await this.recordIdeationPattern(feature, ideationResult);
      }

      // Generate output
      const output = this.formatOutput({
        'Feature Ideation Complete': '✅',
        'Feature': feature || 'General Product Vision',
        'Research': research ? 'Enabled' : 'Disabled',
        'Output': outputPath,
        'Next Steps': this.getNextSteps()
      });

      return {
        success: true,
        output,
        data: {
          feature,
          outputPath,
          contextUsed: !!params._context
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Feature ideation failed: ${error}`
      };
    }
  }

  private async checkPrerequisites(): Promise<boolean> {
    // Check for CLAUDE.md
    const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
    if (!fs.existsSync(claudeMdPath)) {
      return false;
    }

    // Check for .vibe-status.md
    const statusPath = path.join(this.projectRoot, '.vibe-status.md');
    if (!fs.existsSync(statusPath)) {
      return false;
    }

    return true;
  }

  private async loadProjectContext(): Promise<any> {
    const context = {
      projectType: '',
      existingFeatures: [],
      techStack: [],
      constraints: []
    };

    // Load from CLAUDE.md
    const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
    if (fs.existsSync(claudeMdPath)) {
      const content = fs.readFileSync(claudeMdPath, 'utf-8');

      // Extract project type
      const typeMatch = content.match(/project_type:\s*(.+)/i);
      if (typeMatch) {
        context.projectType = typeMatch[1].trim();
      }
    }

    // Load from package.json if exists
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      context.techStack = Object.keys(packageJson.dependencies || {});
    }

    return context;
  }

  private async loadExistingIdeas(): Promise<string[]> {
    const ideasPath = path.join(this.projectRoot, 'docs/ideas');
    const ideas: string[] = [];

    if (fs.existsSync(ideasPath)) {
      const files = fs.readdirSync(ideasPath);
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const content = fs.readFileSync(path.join(ideasPath, file), 'utf-8');
          const titleMatch = content.match(/^#\s+(.+)/m);
          if (titleMatch) {
            ideas.push(titleMatch[1]);
          }
        }
      });
    }

    return ideas;
  }

  private buildIdeationPrompt(
    feature: string | undefined,
    projectContext: any,
    existingIdeas: string[]
  ): string {
    let prompt = 'Generate a comprehensive feature ideation document for ';

    if (feature) {
      prompt += `the feature: "${feature}" `;
    } else {
      prompt += `a ${projectContext.projectType || 'software'} project `;
    }

    if (projectContext.techStack.length > 0) {
      prompt += `using ${projectContext.techStack.slice(0, 3).join(', ')} `;
    }

    if (existingIdeas.length > 0) {
      prompt += `\n\nExisting ideas to consider: ${existingIdeas.join(', ')}`;
    }

    prompt += `\n\nInclude:
1. Core concept and value proposition
2. User personas and pain points
3. Key features and capabilities
4. Technical considerations
5. Success metrics`;

    return prompt;
  }

  private async contextualIdeation(
    prompt: string,
    context: any
  ): Promise<string> {
    // This would integrate with the actual AI model
    // For now, return a structured template

    const conventions = this.getContextSection(context, 'Project Conventions');
    const standards = this.getContextSection(context, 'Quality Standards');

    return `# Feature Ideation Document

**Generated**: ${new Date().toISOString()}
**Context Mode**: Enhanced

## Executive Summary
${prompt}

## Context Analysis
${conventions ? `### Project Conventions\n${conventions}` : ''}
${standards ? `### Quality Standards\n${standards}` : ''}

## Feature Vision
[AI would generate comprehensive feature vision based on context]

## User Personas
[AI would identify and describe target users]

## Pain Points & Solutions
[AI would map pain points to proposed solutions]

## Core Features
[AI would detail key features and capabilities]

## Technical Architecture
[AI would outline technical approach]

## Success Metrics
[AI would define measurable success criteria]

## Implementation Roadmap
[AI would suggest phased implementation]

## Risk Analysis
[AI would identify potential risks and mitigations]

## Next Steps
Proceed to Step 2: System Architecture with /vibe-step-2-architecture`;
  }

  private async templateIdeation(
    feature: string | undefined,
    template: string | undefined
  ): Promise<string> {
    const templateName = template || 'default';
    const featureName = feature || 'Product Vision';

    return `# Feature Ideation Document

**Feature**: ${featureName}
**Template**: ${templateName}
**Generated**: ${new Date().toISOString()}

## Overview
This document outlines the ideation process for ${featureName}.

## Vision Statement
[Define the core vision and purpose]

## Target Users
### Primary Persona
- **Role**: [User role]
- **Goals**: [What they want to achieve]
- **Pain Points**: [Current frustrations]

### Secondary Persona
- **Role**: [User role]
- **Goals**: [What they want to achieve]
- **Pain Points**: [Current frustrations]

## Key Features
1. **Feature 1**: [Description]
2. **Feature 2**: [Description]
3. **Feature 3**: [Description]

## Technical Considerations
- **Architecture**: [High-level approach]
- **Technology Stack**: [Key technologies]
- **Integration Points**: [External systems]

## Success Metrics
- **Metric 1**: [Measurable outcome]
- **Metric 2**: [Measurable outcome]
- **Metric 3**: [Measurable outcome]

## MVP Scope
[Define minimum viable product features]

## Future Enhancements
[Potential future features and improvements]

## Next Steps
1. Review and refine this ideation document
2. Proceed to Step 2: System Architecture
3. Run: /vibe-step-2-architecture`;
  }

  private async updateProjectStatus(milestone: string, data: any): Promise<void> {
    const statusPath = path.join(this.projectRoot, '.vibe-status.md');

    if (fs.existsSync(statusPath)) {
      let content = fs.readFileSync(statusPath, 'utf-8');

      // Update step 1 to completed
      content = content.replace(
        /- \[ \] Step 1: Feature Ideation/,
        '- [x] Step 1: Feature Ideation'
      );

      // Add completion note
      const completionNote = `\n\n### Step 1 Completed
- Feature: ${data.feature}
- Timestamp: ${data.timestamp}
- Research: ${data.researchEnabled ? 'Enabled' : 'Disabled'}`;

      if (!content.includes('### Step 1 Completed')) {
        content += completionNote;
      }

      fs.writeFileSync(statusPath, content);
    }

    // Update runtime state
    this.updateRuntimeState({
      currentStep: 1,
      completedSteps: ['step-1'],
      lastUpdate: data.timestamp
    });
  }

  private async recordIdeationPattern(
    feature: string | undefined,
    result: string
  ): Promise<void> {
    // This would record successful patterns for future use
    const pattern = {
      type: 'ideation',
      feature: feature || 'general',
      timestamp: new Date().toISOString(),
      success: true,
      keyElements: this.extractKeyElements(result)
    };

    // Store pattern (would integrate with learning system)
    this.debug('Recording ideation pattern:', pattern);
  }

  private extractKeyElements(content: string): string[] {
    const elements: string[] = [];

    // Extract section headers
    const headers = content.match(/^##\s+(.+)/gm);
    if (headers) {
      elements.push(...headers.map(h => h.replace(/^##\s+/, '')));
    }

    return elements;
  }

  private getNextSteps(): string {
    return `1. Review the generated ideation document
2. Make any necessary adjustments
3. Run /vibe-step-2-architecture to design the system
4. Use /vibe-status to check progress`;
  }
}
