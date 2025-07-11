/**
 * Phase Context Layer (L2)
 * Phase-specific context that changes based on current development phase
 */

import { ContextLayer, ContextContent, ContextLayerType, TokenBudget, Pattern } from '../types/context.types';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

export class PhaseContextLayer implements ContextLayer {
  type: ContextLayerType = 'phase';
  name = 'Phase Context Layer';
  enabled = true;
  contents: ContextContent[] = [];
  budget: TokenBudget;
  rules = [];

  private projectRoot: string;
  private currentPhase: string | null = null;
  private phaseHistory: string[] = [];

  constructor(projectRoot: string, tokenBudget: number = 3000) {
    this.projectRoot = projectRoot;
    this.budget = {
      total: tokenBudget,
      used: 0,
      reserved: 0,
      available: tokenBudget
    };
  }

  async load(phaseName?: string): Promise<void> {
    if (phaseName) {
      this.currentPhase = phaseName;
    }

    // Clear previous contents
    this.contents = [];

    // Load current phase context
    if (this.currentPhase) {
      await this.loadPhaseDocumentation();
      await this.loadPhaseDependencies();
      await this.loadPhasePatterns();
      await this.loadPreviousPhaseOutputs();
    }

    // Load project state
    await this.loadProjectState();

    // Update token usage
    this.updateTokenUsage();
  }

  private async loadPhaseDocumentation(): Promise<void> {
    const phasePath = path.join(this.projectRoot, 'phases', `${this.currentPhase}.md`);
    
    if (fs.existsSync(phasePath)) {
      const content = fs.readFileSync(phasePath, 'utf-8');
      
      // Extract key sections
      const sections = this.parsePhaseDocument(content);
      
      // Add phase description
      if (sections.description) {
        this.contents.push({
          id: `phase-${this.currentPhase}-description`,
          type: 'knowledge',
          layer: 'phase',
          priority: 'high',
          content: sections.description,
          metadata: {
            source: `phases/${this.currentPhase}.md`,
            timestamp: new Date(),
            version: '1.0',
            tags: ['phase', 'description', this.currentPhase || '']
          }
        });
      }
      
      // Add implementation tasks
      if (sections.tasks) {
        this.contents.push({
          id: `phase-${this.currentPhase}-tasks`,
          type: 'instruction',
          layer: 'phase',
          priority: 'critical',
          content: sections.tasks,
          metadata: {
            source: `phases/${this.currentPhase}.md`,
            timestamp: new Date(),
            version: '1.0',
            tags: ['phase', 'tasks', this.currentPhase || '']
          }
        });
      }
      
      // Add PRPs if present
      if (sections.prps) {
        this.contents.push({
          id: `phase-${this.currentPhase}-prps`,
          type: 'instruction',
          layer: 'phase',
          priority: 'high',
          content: sections.prps,
          metadata: {
            source: `phases/${this.currentPhase}.md`,
            timestamp: new Date(),
            version: '1.0',
            tags: ['phase', 'prps', 'requirements', this.currentPhase || '']
          }
        });
      }
    }
  }

  private parsePhaseDocument(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    
    // Extract description
    const descMatch = content.match(/## Feature Description([\s\S]*?)(?=##|$)/);
    if (descMatch) {
      sections.description = descMatch[1].trim();
    }
    
    // Extract implementation tasks
    const tasksMatch = content.match(/## Implementation Tasks:([\s\S]*?)(?=##|$)/);
    if (tasksMatch) {
      sections.tasks = tasksMatch[1].trim();
    }
    
    // Extract PRPs
    const prpsMatch = content.match(/## Product Requirements Prompt \(PRP\)([\s\S]*?)(?=##|$)/);
    if (prpsMatch) {
      sections.prps = prpsMatch[1].trim();
    }
    
    // Extract context requirements
    const contextMatch = content.match(/## Context Assembly Layer([\s\S]*?)(?=##|$)/);
    if (contextMatch) {
      sections.context = contextMatch[1].trim();
    }
    
    return sections;
  }

  private async loadPhaseDependencies(): Promise<void> {
    // Load dependencies from phase document
    const phasePath = path.join(this.projectRoot, 'phases', `${this.currentPhase}.md`);
    
    if (fs.existsSync(phasePath)) {
      const content = fs.readFileSync(phasePath, 'utf-8');
      const dependencies = this.extractDependencies(content);
      
      if (dependencies.length > 0) {
        this.contents.push({
          id: `phase-${this.currentPhase}-dependencies`,
          type: 'knowledge',
          layer: 'phase',
          priority: 'high',
          content: `Phase dependencies:\n${dependencies.join('\n')}`,
          metadata: {
            source: `phases/${this.currentPhase}.md`,
            timestamp: new Date(),
            version: '1.0',
            tags: ['dependencies', 'phase', this.currentPhase || ''],
            dependencies
          }
        });
      }
    }
  }

  private extractDependencies(content: string): string[] {
    const dependencies: string[] = [];
    
    // Look for dependency patterns
    const depPatterns = [
      /depends on:\s*([^\n]+)/gi,
      /requires:\s*([^\n]+)/gi,
      /phase_dependencies:\s*\n((?:\s*-[^\n]+\n)+)/gi
    ];
    
    for (const pattern of depPatterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1].includes('-')) {
          // List format
          const items = match[1].split('\n')
            .map(line => line.trim())
            .filter(line => line.startsWith('-'))
            .map(line => line.substring(1).trim());
          dependencies.push(...items);
        } else {
          // Single line
          dependencies.push(match[1].trim());
        }
      }
    }
    
    return [...new Set(dependencies)];
  }

  private async loadPhasePatterns(): Promise<void> {
    // Load patterns from context memory
    const memoryPath = path.join(this.projectRoot, '.vibe', 'context-memory.json');
    
    if (fs.existsSync(memoryPath)) {
      try {
        const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
        const phasePatterns = memory.patterns?.filter((p: Pattern) => 
          p.usage.locations.some((loc: string) => loc.includes(this.currentPhase || ''))
        );
        
        if (phasePatterns && phasePatterns.length > 0) {
          this.contents.push({
            id: `phase-${this.currentPhase}-patterns`,
            type: 'pattern',
            layer: 'phase',
            priority: 'medium',
            content: this.formatPatterns(phasePatterns),
            metadata: {
              source: 'context-memory',
              timestamp: new Date(),
              version: '1.0',
              tags: ['patterns', 'learned', this.currentPhase || '']
            }
          });
        }
      } catch (error) {
        console.error('Error loading phase patterns:', error);
      }
    }
  }

  private formatPatterns(patterns: Pattern[]): string {
    return patterns.map(p => 
      `Pattern: ${p.name}\nType: ${p.type}\nConfidence: ${p.confidence}%\nExample: ${p.examples[0]}`
    ).join('\n\n');
  }

  private async loadPreviousPhaseOutputs(): Promise<void> {
    // Get phase number
    const phaseNum = this.extractPhaseNumber(this.currentPhase || '');
    if (phaseNum <= 1) return;
    
    // Load outputs from previous phases
    const docsPath = path.join(this.projectRoot, 'docs', 'vibe-coding');
    
    for (let i = 1; i < phaseNum; i++) {
      const outputFiles = glob.sync(path.join(docsPath, `0${i}-*.md`));
      
      for (const file of outputFiles) {
        const filename = path.basename(file);
        const content = fs.readFileSync(file, 'utf-8');
        
        // Summarize content to save tokens
        const summary = this.summarizeOutput(content, filename);
        
        if (summary) {
          this.contents.push({
            id: `previous-output-${filename}`,
            type: 'knowledge',
            layer: 'phase',
            priority: 'medium',
            content: summary,
            metadata: {
              source: file,
              timestamp: new Date(),
              version: '1.0',
              tags: ['previous-phase', 'output', `phase-${i}`]
            }
          });
        }
      }
    }
  }

  private extractPhaseNumber(phaseName: string): number {
    const match = phaseName.match(/phase[_-]?(\d+)/i);
    return match ? parseInt(match[1]) : 0;
  }

  private summarizeOutput(content: string, filename: string): string {
    // Extract key sections for summary
    const sections = [];
    
    // Look for important markers
    if (filename.includes('requirements')) {
      const reqMatch = content.match(/## (?:Functional |Technical |)Requirements([\s\S]*?)(?=##|$)/i);
      if (reqMatch) sections.push(`Requirements: ${reqMatch[1].trim().substring(0, 200)}...`);
    }
    
    if (filename.includes('architecture')) {
      const archMatch = content.match(/## (?:System |)Architecture([\s\S]*?)(?=##|$)/i);
      if (archMatch) sections.push(`Architecture: ${archMatch[1].trim().substring(0, 200)}...`);
    }
    
    if (filename.includes('api')) {
      const apiMatch = content.match(/## API (?:Endpoints|Design)([\s\S]*?)(?=##|$)/i);
      if (apiMatch) sections.push(`API Design: ${apiMatch[1].trim().substring(0, 200)}...`);
    }
    
    return sections.length > 0 ? sections.join('\n\n') : '';
  }

  private async loadProjectState(): Promise<void> {
    const stateFiles = [
      '.vibe-status.md',
      'current_status.md',
      'features.md'
    ];
    
    for (const file of stateFiles) {
      const filePath = path.join(this.projectRoot, file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const summary = this.summarizeState(content, file);
        
        if (summary) {
          this.contents.push({
            id: `project-state-${file}`,
            type: 'knowledge',
            layer: 'phase',
            priority: 'high',
            content: summary,
            metadata: {
              source: file,
              timestamp: new Date(),
              version: '1.0',
              tags: ['state', 'project', 'current']
            }
          });
        }
      }
    }
  }

  private summarizeState(content: string, filename: string): string {
    if (filename === '.vibe-status.md') {
      // Extract current phase and progress
      const phaseMatch = content.match(/Current Phase:\s*([^\n]+)/);
      const progressMatch = content.match(/Progress:\s*([^\n]+)/);
      return `Current Phase: ${phaseMatch?.[1] || 'Unknown'}\n${progressMatch?.[0] || ''}`;
    }
    
    // For other files, take first 500 chars
    return content.substring(0, 500) + (content.length > 500 ? '...' : '');
  }

  private updateTokenUsage(): void {
    const totalChars = this.contents.reduce((sum, content) => {
      return sum + content.content.length;
    }, 0);
    
    this.budget.used = Math.ceil(totalChars / 4);
    this.budget.available = this.budget.total - this.budget.used;
    
    this.contents.forEach(content => {
      content.tokens = Math.ceil(content.content.length / 4);
    });
  }

  setPhase(phaseName: string): void {
    if (this.currentPhase && this.currentPhase !== phaseName) {
      this.phaseHistory.push(this.currentPhase);
    }
    this.currentPhase = phaseName;
  }

  getPhaseHistory(): string[] {
    return [...this.phaseHistory];
  }

  async refresh(): Promise<void> {
    await this.load(this.currentPhase || undefined);
  }
}