/**
 * V1 Compatibility Adapter
 * Provides backward compatibility for projects using CLAUDE.md v1.0
 */

import { ContextContent, ContextLayerType } from '../types/context.types';
import { ClaudeMdParser } from '../parsers/claude-md-parser';
import * as fs from 'fs';
import * as path from 'path';

export class V1CompatibilityAdapter {
  private projectRoot: string;
  private v1Content: Record<string, string> = {};
  private isV1: boolean = false;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.detectVersion();
  }

  private detectVersion(): void {
    const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
    
    if (fs.existsSync(claudeMdPath)) {
      const content = fs.readFileSync(claudeMdPath, 'utf-8');
      const parser = new ClaudeMdParser(content);
      this.isV1 = parser.getVersion() === '1.0';
      
      if (this.isV1) {
        // Parse v1 content for adapter
        this.parseV1Content(content);
      }
    }
  }

  private parseV1Content(content: string): void {
    const sectionRegex = /^##\s+([^\n]+)\n([\s\S]*?)(?=^##\s+|\s*$)/gm;
    
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      this.v1Content[match[1].trim()] = match[2].trim();
    }
  }

  isV1Format(): boolean {
    return this.isV1;
  }

  adaptToContextContent(layer: ContextLayerType): ContextContent[] {
    if (!this.isV1) return [];

    const contents: ContextContent[] = [];
    
    switch (layer) {
      case 'global':
        contents.push(...this.adaptGlobalSections());
        break;
      case 'phase':
        contents.push(...this.adaptPhaseSections());
        break;
      case 'task':
        contents.push(...this.adaptTaskSections());
        break;
    }

    return contents;
  }

  private adaptGlobalSections(): ContextContent[] {
    const contents: ContextContent[] = [];
    const globalKeywords = [
      'convention', 'standard', 'policy', 'security', 
      'quality', 'guideline', 'rule', 'configuration'
    ];

    Object.entries(this.v1Content).forEach(([name, content]) => {
      const isGlobal = globalKeywords.some(keyword => 
        name.toLowerCase().includes(keyword) ||
        content.toLowerCase().includes(keyword)
      );

      if (isGlobal) {
        contents.push({
          id: `v1-global-${name.replace(/\s+/g, '-').toLowerCase()}`,
          type: 'instruction',
          layer: 'global',
          priority: this.determinePriority(name, content),
          content: content,
          metadata: {
            source: 'CLAUDE.md v1.0',
            timestamp: new Date(),
            version: '1.0',
            tags: ['v1-compat', 'global', ...this.extractTags(name)]
          }
        });
      }
    });

    return contents;
  }

  private adaptPhaseSections(): ContextContent[] {
    const contents: ContextContent[] = [];
    const phaseKeywords = [
      'phase', 'feature', 'requirement', 'specification',
      'architecture', 'design', 'implementation'
    ];

    Object.entries(this.v1Content).forEach(([name, content]) => {
      const isPhase = phaseKeywords.some(keyword => 
        name.toLowerCase().includes(keyword) ||
        content.toLowerCase().includes(keyword)
      );

      if (isPhase) {
        contents.push({
          id: `v1-phase-${name.replace(/\s+/g, '-').toLowerCase()}`,
          type: 'knowledge',
          layer: 'phase',
          priority: 'medium',
          content: content,
          metadata: {
            source: 'CLAUDE.md v1.0',
            timestamp: new Date(),
            version: '1.0',
            tags: ['v1-compat', 'phase', ...this.extractTags(name)]
          }
        });
      }
    });

    return contents;
  }

  private adaptTaskSections(): ContextContent[] {
    const contents: ContextContent[] = [];
    const taskKeywords = [
      'task', 'command', 'instruction', 'step',
      'action', 'operation', 'how to', 'guide'
    ];

    Object.entries(this.v1Content).forEach(([name, content]) => {
      const isTask = taskKeywords.some(keyword => 
        name.toLowerCase().includes(keyword) ||
        content.toLowerCase().includes(keyword)
      );

      if (isTask) {
        contents.push({
          id: `v1-task-${name.replace(/\s+/g, '-').toLowerCase()}`,
          type: 'instruction',
          layer: 'task',
          priority: 'high',
          content: content,
          metadata: {
            source: 'CLAUDE.md v1.0',
            timestamp: new Date(),
            version: '1.0',
            tags: ['v1-compat', 'task', ...this.extractTags(name)]
          }
        });
      }
    });

    return contents;
  }

  private determinePriority(name: string, content: string): 'critical' | 'high' | 'medium' | 'low' {
    const text = (name + ' ' + content).toLowerCase();
    
    if (text.includes('must') || text.includes('require') || 
        text.includes('critical') || text.includes('security')) {
      return 'critical';
    }
    
    if (text.includes('should') || text.includes('important') || 
        text.includes('standard')) {
      return 'high';
    }
    
    if (text.includes('prefer') || text.includes('recommend')) {
      return 'medium';
    }
    
    return 'low';
  }

  private extractTags(name: string): string[] {
    const tags: string[] = [];
    const words = name.toLowerCase().split(/\s+/);
    
    // Common tag mappings
    const tagMap: Record<string, string[]> = {
      'code': ['coding', 'style', 'convention'],
      'test': ['testing', 'quality', 'coverage'],
      'api': ['endpoint', 'rest', 'graphql'],
      'security': ['auth', 'validation', 'encryption'],
      'performance': ['optimization', 'speed', 'efficiency']
    };

    Object.entries(tagMap).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => words.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  async suggestMigration(): Promise<string> {
    if (!this.isV1) {
      return 'Your CLAUDE.md is already v2.0 format.';
    }

    const suggestions: string[] = [
      '# CLAUDE.md v1.0 Migration Suggestions',
      '',
      'Your project is using CLAUDE.md v1.0. Consider migrating to v2.0 for:',
      '- Better context management with layered architecture',
      '- Token budget optimization',
      '- Dynamic section loading',
      '- Pattern learning and memory',
      '',
      '## Quick Migration',
      '```bash',
      'npx vibe-migrate-claude',
      '```',
      '',
      '## Manual Migration Steps',
      '1. Add YAML frontmatter with version and context layers',
      '2. Reorganize sections into L1 (Global), L2 (Phase), L3 (Task)',
      '3. Add validation gates for phase transitions',
      '4. Include pattern library for common code patterns',
      '',
      '## Current Section Analysis'
    ];

    Object.keys(this.v1Content).forEach(section => {
      const layer = this.suggestLayer(section);
      suggestions.push(`- "${section}" → ${layer} layer`);
    });

    return suggestions.join('\n');
  }

  private suggestLayer(sectionName: string): string {
    const name = sectionName.toLowerCase();
    
    if (name.includes('convention') || name.includes('standard') || 
        name.includes('policy') || name.includes('security')) {
      return 'L1 (Global)';
    }
    
    if (name.includes('phase') || name.includes('feature') || 
        name.includes('requirement')) {
      return 'L2 (Phase)';
    }
    
    if (name.includes('task') || name.includes('command') || 
        name.includes('instruction')) {
      return 'L3 (Task)';
    }
    
    return 'L1 (Global) or General';
  }

  getV1Sections(): Record<string, string> {
    return { ...this.v1Content };
  }

  writeCompatibilityReport(outputPath: string): void {
    const report = {
      timestamp: new Date().toISOString(),
      isV1: this.isV1,
      sections: Object.keys(this.v1Content),
      suggestedMappings: Object.fromEntries(
        Object.keys(this.v1Content).map(section => [
          section,
          this.suggestLayer(section)
        ])
      ),
      migrationCommand: 'npx vibe-migrate-claude'
    };

    fs.writeFileSync(
      outputPath,
      JSON.stringify(report, null, 2),
      'utf-8'
    );
  }
}