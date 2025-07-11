/**
 * Global Context Layer (L1)
 * Always-active context that applies to all commands and operations
 */

import { ContextLayer, ContextContent, ContextLayerType, TokenBudget } from '../types/context.types';
import * as fs from 'fs';
import * as path from 'path';

export class GlobalContextLayer implements ContextLayer {
  type: ContextLayerType = 'global';
  name = 'Global Context Layer';
  enabled = true;
  contents: ContextContent[] = [];
  budget: TokenBudget;
  rules = [];

  private claudeMdPath: string;
  private projectRoot: string;

  constructor(projectRoot: string, tokenBudget: number = 2000) {
    this.projectRoot = projectRoot;
    this.claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
    this.budget = {
      total: tokenBudget,
      used: 0,
      reserved: 0,
      available: tokenBudget
    };
  }

  async load(): Promise<void> {
    // Load CLAUDE.md v2.0
    await this.loadClaudeMd();
    
    // Load project conventions
    await this.loadProjectConventions();
    
    // Load quality standards
    await this.loadQualityStandards();
    
    // Load security policies
    await this.loadSecurityPolicies();
    
    // Calculate token usage
    this.updateTokenUsage();
  }

  private async loadClaudeMd(): Promise<void> {
    try {
      if (fs.existsSync(this.claudeMdPath)) {
        const content = fs.readFileSync(this.claudeMdPath, 'utf-8');
        
        // Parse CLAUDE.md v2.0 format
        const sections = this.parseClaudeMdV2(content);
        
        // Add global rules section
        if (sections.globalRules) {
          this.contents.push({
            id: 'claude-global-rules',
            type: 'instruction',
            layer: 'global',
            priority: 'critical',
            content: sections.globalRules,
            metadata: {
              source: 'CLAUDE.md',
              timestamp: new Date(),
              version: '2.0',
              tags: ['rules', 'conventions', 'standards']
            }
          });
        }
      }
    } catch (error) {
      console.error('Error loading CLAUDE.md:', error);
    }
  }

  private parseClaudeMdV2(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    
    // Extract L1: Global Rules section
    const globalRulesMatch = content.match(/### L1: Global Rules \(Always Active\)([\s\S]*?)(?=###|##|$)/);
    if (globalRulesMatch) {
      sections.globalRules = globalRulesMatch[1].trim();
    }
    
    // Extract other global sections
    const projectConventionsMatch = content.match(/## Project Conventions([\s\S]*?)(?=##|$)/);
    if (projectConventionsMatch) {
      sections.projectConventions = projectConventionsMatch[1].trim();
    }
    
    const qualityStandardsMatch = content.match(/## Quality Standards([\s\S]*?)(?=##|$)/);
    if (qualityStandardsMatch) {
      sections.qualityStandards = qualityStandardsMatch[1].trim();
    }
    
    return sections;
  }

  private async loadProjectConventions(): Promise<void> {
    const conventionFiles = [
      '.eslintrc.json',
      '.prettierrc',
      'tsconfig.json',
      'package.json'
    ];
    
    for (const file of conventionFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const summary = this.summarizeConfig(file, content);
        
        if (summary) {
          this.contents.push({
            id: `convention-${file}`,
            type: 'knowledge',
            layer: 'global',
            priority: 'high',
            content: summary,
            metadata: {
              source: file,
              timestamp: new Date(),
              version: '1.0',
              tags: ['convention', 'configuration']
            }
          });
        }
      }
    }
  }

  private summarizeConfig(filename: string, content: string): string {
    try {
      const config = JSON.parse(content);
      
      switch (filename) {
        case '.eslintrc.json':
          return `ESLint Rules: ${Object.keys(config.rules || {}).length} rules configured. ` +
                 `Extends: ${(config.extends || []).join(', ')}`;
        
        case 'tsconfig.json':
          return `TypeScript: ${config.compilerOptions?.target || 'ES5'} target, ` +
                 `${config.compilerOptions?.module || 'commonjs'} modules, ` +
                 `strict mode: ${config.compilerOptions?.strict || false}`;
        
        case 'package.json':
          return `Project: ${config.name}, Dependencies: ${Object.keys(config.dependencies || {}).length}, ` +
                 `DevDependencies: ${Object.keys(config.devDependencies || {}).length}`;
        
        default:
          return null;
      }
    } catch {
      return null;
    }
  }

  private async loadQualityStandards(): Promise<void> {
    const standards = {
      testCoverage: '95%+ test coverage required for all code',
      codeStyle: 'Follow team style guide and linting rules',
      documentation: 'All public APIs must be documented',
      performance: 'No operations should block UI thread > 16ms',
      accessibility: 'WCAG 2.1 AA compliance for all UI components'
    };
    
    this.contents.push({
      id: 'quality-standards',
      type: 'instruction',
      layer: 'global',
      priority: 'critical',
      content: Object.entries(standards)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n'),
      metadata: {
        source: 'quality-standards',
        timestamp: new Date(),
        version: '1.0',
        tags: ['quality', 'standards', 'requirements']
      }
    });
  }

  private async loadSecurityPolicies(): Promise<void> {
    const policies = [
      'Never commit sensitive data or credentials',
      'Use environment variables for API keys',
      'Validate all user inputs',
      'Sanitize file paths',
      'Implement proper access controls',
      'Follow OWASP security guidelines'
    ];
    
    this.contents.push({
      id: 'security-policies',
      type: 'instruction',
      layer: 'global',
      priority: 'critical',
      content: policies.join('\n'),
      metadata: {
        source: 'security-policies',
        timestamp: new Date(),
        version: '1.0',
        tags: ['security', 'policies']
      }
    });
  }

  private updateTokenUsage(): void {
    // Simple token estimation (4 chars ≈ 1 token)
    const totalChars = this.contents.reduce((sum, content) => {
      return sum + content.content.length;
    }, 0);
    
    this.budget.used = Math.ceil(totalChars / 4);
    this.budget.available = this.budget.total - this.budget.used;
    
    // Store token count in each content item
    this.contents.forEach(content => {
      content.tokens = Math.ceil(content.content.length / 4);
    });
  }

  async refresh(): Promise<void> {
    this.contents = [];
    await this.load();
  }

  getContents(priority?: 'critical' | 'high' | 'medium' | 'low'): ContextContent[] {
    if (priority) {
      return this.contents.filter(c => c.priority === priority);
    }
    return this.contents;
  }

  compress(targetTokens: number): void {
    // Sort by priority (lowest first)
    const priorityOrder = ['low', 'medium', 'high', 'critical'];
    const sorted = [...this.contents].sort((a, b) => {
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });
    
    let currentTokens = this.budget.used;
    
    // Remove lowest priority items first
    while (currentTokens > targetTokens && sorted.length > 0) {
      const removed = sorted.shift();
      if (removed && removed.priority !== 'critical') {
        currentTokens -= removed.tokens || 0;
        this.contents = this.contents.filter(c => c.id !== removed.id);
      }
    }
    
    this.updateTokenUsage();
  }
}