/**
 * Enhanced vibe-retrofit Command
 * Context-aware codebase retrofitting
 */

import { BaseCommand, CommandParams, CommandResult } from '../base-command';
import { PatternRecognizer } from '../../../context/memory/patterns';
import { Pattern } from '../../../context/types/context.types';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

interface RetrofitParams extends CommandParams {
  analyze?: boolean;
  outputPath?: string;
  includePatterns?: boolean;
}

export class VibeRetrofitCommand extends BaseCommand {
  private patternRecognizer: PatternRecognizer;

  constructor() {
    super({
      name: 'vibe-retrofit',
      description: 'Retrofit existing codebase with Vibe Coding methodology',
      contextRequired: true,
      tokenBudget: 6000,
      mcpTools: ['context7'],
      patterns: ['component', 'api', 'test', 'structure']
    });
    
    this.patternRecognizer = new PatternRecognizer(this.projectRoot);
  }

  protected async implement(params: RetrofitParams): Promise<CommandResult> {
    const { analyze = false, outputPath = 'docs/vibe-retrofit', includePatterns = true } = params;

    try {
      // Phase 1: Analyze codebase
      console.log('\n🔍 Analyzing existing codebase...');
      const analysis = await this.analyzeCodebase();
      
      // Phase 2: Detect patterns
      console.log('\n🧬 Detecting patterns...');
      const patterns = await this.patternRecognizer.analyzeCodebase();
      
      // Phase 3: Generate retrofit plan
      console.log('\n📋 Generating retrofit plan...');
      const retrofitPlan = this.generateRetrofitPlan(analysis, patterns, params);
      
      // Phase 4: Create Vibe structure
      console.log('\n🏗️  Creating Vibe Coding structure...');
      await this.createVibeStructure(analysis, patterns);
      
      // Phase 5: Write documentation
      console.log('\n📝 Writing documentation...');
      await this.writeRetrofitDocumentation(outputPath, analysis, patterns, retrofitPlan);
      
      // Generate output
      const output = this.formatOutput({
        'Retrofit Analysis Complete': '✅',
        'Files Analyzed': `${analysis.fileCount} files`,
        'Patterns Detected': `${patterns.length} patterns`,
        'Confidence Score': `${this.calculateConfidenceScore(patterns)}%`,
        'Documentation': path.join(outputPath, 'retrofit-plan.md'),
        'Next Steps': this.getRetrofitNextSteps()
      });

      return {
        success: true,
        output,
        data: {
          analysis,
          patterns: patterns.map(p => ({
            type: p.type,
            name: p.name,
            confidence: p.confidence
          })),
          retrofitPlan
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Retrofit analysis failed: ${error}`
      };
    }
  }

  private async analyzeCodebase(): Promise<any> {
    const analysis = {
      fileCount: 0,
      languages: new Set<string>(),
      frameworks: new Set<string>(),
      structure: {
        hasTests: false,
        hasDocs: false,
        hasConfig: false,
        entryPoints: [] as string[]
      },
      dependencies: {} as Record<string, string>,
      metrics: {
        totalLines: 0,
        avgFileSize: 0,
        testCoverage: 0
      }
    };

    // Analyze package.json if exists
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      analysis.dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      // Detect frameworks
      if (analysis.dependencies.react) analysis.frameworks.add('react');
      if (analysis.dependencies.vue) analysis.frameworks.add('vue');
      if (analysis.dependencies.angular) analysis.frameworks.add('angular');
      if (analysis.dependencies.express) analysis.frameworks.add('express');
      if (analysis.dependencies.nest) analysis.frameworks.add('nestjs');
    }

    // Analyze file structure
    const files = glob.sync('**/*.{js,ts,jsx,tsx,py,go,java}', {
      cwd: this.projectRoot,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });

    analysis.fileCount = files.length;

    // Detect languages
    files.forEach(file => {
      const ext = path.extname(file);
      switch (ext) {
        case '.js':
        case '.jsx':
          analysis.languages.add('javascript');
          break;
        case '.ts':
        case '.tsx':
          analysis.languages.add('typescript');
          break;
        case '.py':
          analysis.languages.add('python');
          break;
        case '.go':
          analysis.languages.add('go');
          break;
        case '.java':
          analysis.languages.add('java');
          break;
      }
    });

    // Check for common directories
    analysis.structure.hasTests = fs.existsSync(path.join(this.projectRoot, 'tests')) ||
                                  fs.existsSync(path.join(this.projectRoot, '__tests__')) ||
                                  files.some(f => f.includes('.test.') || f.includes('.spec.'));
    
    analysis.structure.hasDocs = fs.existsSync(path.join(this.projectRoot, 'docs')) ||
                                 fs.existsSync(path.join(this.projectRoot, 'README.md'));
    
    analysis.structure.hasConfig = fs.existsSync(path.join(this.projectRoot, '.eslintrc.json')) ||
                                   fs.existsSync(path.join(this.projectRoot, 'tsconfig.json'));

    // Find entry points
    const commonEntryPoints = ['index', 'main', 'app', 'server', 'client'];
    analysis.structure.entryPoints = files.filter(file => 
      commonEntryPoints.some(entry => path.basename(file).startsWith(entry))
    );

    return analysis;
  }

  private generateRetrofitPlan(analysis: any, patterns: Pattern[], params: RetrofitParams): any {
    const plan = {
      phases: [] as any[],
      estimatedEffort: 'medium',
      preserveExisting: true,
      recommendations: [] as string[]
    };

    // Phase 1: Documentation
    plan.phases.push({
      name: 'Documentation & Analysis',
      tasks: [
        'Generate comprehensive documentation from existing code',
        'Create CLAUDE.md with detected patterns',
        'Document existing architecture',
        'Create feature inventory'
      ],
      effort: '1-2 days'
    });

    // Phase 2: Structure
    plan.phases.push({
      name: 'Vibe Structure Setup',
      tasks: [
        'Create Vibe Coding directory structure',
        'Set up phase tracking',
        'Initialize context engineering',
        'Create project status tracking'
      ],
      effort: '1 day'
    });

    // Phase 3: Pattern Library
    if (params.includePatterns && patterns.length > 0) {
      plan.phases.push({
        name: 'Pattern Library Creation',
        tasks: [
          `Document ${patterns.filter(p => p.type === 'component').length} component patterns`,
          `Document ${patterns.filter(p => p.type === 'api').length} API patterns`,
          `Document ${patterns.filter(p => p.type === 'test').length} test patterns`,
          'Create pattern usage guidelines'
        ],
        effort: '2-3 days'
      });
    }

    // Phase 4: Testing Strategy
    if (!analysis.structure.hasTests) {
      plan.phases.push({
        name: 'Testing Implementation',
        tasks: [
          'Set up testing framework',
          'Create test templates based on patterns',
          'Write tests for critical paths',
          'Set up coverage reporting'
        ],
        effort: '3-5 days'
      });
    }

    // Recommendations based on analysis
    if (!analysis.languages.has('typescript') && analysis.languages.has('javascript')) {
      plan.recommendations.push('Consider migrating to TypeScript for better type safety');
    }

    if (!analysis.structure.hasTests) {
      plan.recommendations.push('Implement comprehensive testing strategy (target 95% coverage)');
    }

    if (patterns.filter(p => p.confidence < 70).length > patterns.length * 0.3) {
      plan.recommendations.push('Standardize coding patterns for better consistency');
    }

    return plan;
  }

  private async createVibeStructure(analysis: any, patterns: Pattern[]): Promise<void> {
    // Create Vibe directories if they don't exist
    const vibeDirs = [
      '.vibe',
      'docs/vibe-coding',
      'phases',
      'templates'
    ];

    vibeDirs.forEach(dir => {
      const dirPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    // Create or update CLAUDE.md
    if (!fs.existsSync(path.join(this.projectRoot, 'CLAUDE.md'))) {
      const claudeMd = this.generateClaudeMdFromPatterns(analysis, patterns);
      fs.writeFileSync(path.join(this.projectRoot, 'CLAUDE.md'), claudeMd);
    }

    // Create .vibe-status.md
    if (!fs.existsSync(path.join(this.projectRoot, '.vibe-status.md'))) {
      const statusContent = `# Vibe Coding Status - Retrofitted Project

**Retrofit Date**: ${new Date().toISOString()}
**Current Phase**: retrofit-complete
**Mode**: Progressive Enhancement

## Retrofit Summary
- Files Analyzed: ${analysis.fileCount}
- Languages: ${Array.from(analysis.languages).join(', ')}
- Frameworks: ${Array.from(analysis.frameworks).join(', ')}
- Patterns Detected: ${patterns.length}

## Next Steps
1. Review detected patterns in CLAUDE.md
2. Start implementing Vibe phases for new features
3. Gradually refactor existing code to match patterns
4. Use /vibe-validate-work to ensure quality`;

      fs.writeFileSync(path.join(this.projectRoot, '.vibe-status.md'), statusContent);
    }

    // Create context config
    const contextConfigPath = path.join(this.projectRoot, '.vibe', 'context.config.json');
    if (!fs.existsSync(contextConfigPath)) {
      const config = {
        version: '1.0.0',
        mode: 'retrofit',
        patterns: patterns.map(p => ({
          id: p.id,
          type: p.type,
          confidence: p.confidence
        }))
      };
      fs.writeFileSync(contextConfigPath, JSON.stringify(config, null, 2));
    }
  }

  private generateClaudeMdFromPatterns(analysis: any, patterns: Pattern[]): string {
    const highConfidencePatterns = patterns.filter(p => p.confidence > 80);
    
    return `# CLAUDE.md v2.0 - Retrofitted Project

---
version: 2.0
mode: retrofit
languages: ${Array.from(analysis.languages).join(', ')}
frameworks: ${Array.from(analysis.frameworks).join(', ')}
---

## Detected Patterns

${patterns.map(p => `### ${p.name}
- Type: ${p.type}
- Confidence: ${p.confidence}%
- Usage: ${p.usage.count} occurrences

\`\`\`${this.getLanguageForPattern(p, analysis)}
${p.examples[0] || 'Pattern example'}
\`\`\`
`).join('\n')}

## Project Conventions (Detected)

${this.generateConventionsFromPatterns(patterns)}

## Quality Standards
- Maintain existing test coverage
- Follow detected patterns for consistency
- Document new features comprehensively
- Use TypeScript for new code (if applicable)

## Migration Strategy
1. New features follow Vibe Coding methodology
2. Refactor existing code gradually
3. Maintain backward compatibility
4. Document all changes

## Notes
This project has been retrofitted with Vibe Coding methodology.
Original patterns have been preserved and documented.`;
  }

  private getLanguageForPattern(pattern: Pattern, analysis: any): string {
    if (analysis.languages.has('typescript')) return 'typescript';
    if (analysis.languages.has('javascript')) return 'javascript';
    return 'text';
  }

  private generateConventionsFromPatterns(patterns: Pattern[]): string {
    const conventions: string[] = [];
    
    // Component conventions
    const componentPatterns = patterns.filter(p => p.type === 'component');
    if (componentPatterns.length > 0) {
      const dominant = componentPatterns.sort((a, b) => b.confidence - a.confidence)[0];
      conventions.push(`- Components: ${dominant.pattern}`);
    }

    // API conventions
    const apiPatterns = patterns.filter(p => p.type === 'api');
    if (apiPatterns.length > 0) {
      const dominant = apiPatterns.sort((a, b) => b.confidence - a.confidence)[0];
      conventions.push(`- APIs: ${dominant.pattern}`);
    }

    // Test conventions
    const testPatterns = patterns.filter(p => p.type === 'test');
    if (testPatterns.length > 0) {
      const dominant = testPatterns.sort((a, b) => b.confidence - a.confidence)[0];
      conventions.push(`- Tests: ${dominant.pattern}`);
    }

    return conventions.join('\n') || '- Conventions will be established as patterns emerge';
  }

  private async writeRetrofitDocumentation(
    outputPath: string, 
    analysis: any, 
    patterns: Pattern[], 
    plan: any
  ): Promise<void> {
    const fullPath = path.join(this.projectRoot, outputPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    // Write main retrofit plan
    const planContent = `# Vibe Coding Retrofit Plan

Generated: ${new Date().toISOString()}

## Project Analysis

### Overview
- **Files Analyzed**: ${analysis.fileCount}
- **Languages**: ${Array.from(analysis.languages).join(', ')}
- **Frameworks**: ${Array.from(analysis.frameworks).join(', ')}
- **Has Tests**: ${analysis.structure.hasTests ? 'Yes' : 'No'}
- **Has Documentation**: ${analysis.structure.hasDocs ? 'Yes' : 'No'}

### Detected Patterns
${patterns.map(p => `- **${p.name}** (${p.type}): ${p.confidence}% confidence`).join('\n')}

## Implementation Plan

${plan.phases.map((phase: any, index: number) => `### Phase ${index + 1}: ${phase.name}
**Estimated Effort**: ${phase.effort}

Tasks:
${phase.tasks.map((task: string) => `- ${task}`).join('\n')}
`).join('\n')}

## Recommendations
${plan.recommendations.map((rec: string) => `- ${rec}`).join('\n')}

## Pattern Details

${patterns.slice(0, 10).map(p => `### ${p.name}
- **Type**: ${p.type}
- **Confidence**: ${p.confidence}%
- **Occurrences**: ${p.usage.count}
- **Locations**: ${p.usage.locations.slice(0, 3).join(', ')}${p.usage.locations.length > 3 ? '...' : ''}

Example:
\`\`\`
${p.examples[0]}
\`\`\`
`).join('\n')}

## Next Steps
1. Review this retrofit plan
2. Execute phases in order
3. Use Vibe commands for new development
4. Gradually refactor existing code`;

    fs.writeFileSync(path.join(fullPath, 'retrofit-plan.md'), planContent);

    // Write pattern library
    if (patterns.length > 0) {
      const patternLibrary = `# Pattern Library

Auto-detected patterns from existing codebase.

${Object.entries(this.groupPatternsByType(patterns)).map(([type, typePatterns]) => `
## ${type.charAt(0).toUpperCase() + type.slice(1)} Patterns

${typePatterns.map(p => `### ${p.name}
\`\`\`
${p.examples[0]}
\`\`\`

**Confidence**: ${p.confidence}%
**Usage**: ${p.usage.count} times
`).join('\n')}
`).join('\n')}`;

      fs.writeFileSync(path.join(fullPath, 'pattern-library.md'), patternLibrary);
    }
  }

  private groupPatternsByType(patterns: Pattern[]): Record<string, Pattern[]> {
    const grouped: Record<string, Pattern[]> = {};
    
    patterns.forEach(pattern => {
      if (!grouped[pattern.type]) {
        grouped[pattern.type] = [];
      }
      grouped[pattern.type].push(pattern);
    });
    
    // Sort each group by confidence
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => b.confidence - a.confidence);
    });
    
    return grouped;
  }

  private calculateConfidenceScore(patterns: Pattern[]): number {
    if (patterns.length === 0) return 0;
    
    const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    return Math.round(avgConfidence);
  }

  private getRetrofitNextSteps(): string {
    return `1. Review retrofit plan in docs/vibe-retrofit/
2. Review detected patterns in CLAUDE.md
3. Start implementing new features with Vibe methodology
4. Use /vibe-validate-work to ensure quality
5. Gradually refactor existing code to match patterns`;
  }
}