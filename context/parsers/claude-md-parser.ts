/**
 * CLAUDE.md Parser
 * Parses both v1.0 and v2.0 CLAUDE.md formats
 */

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ContextConfig, ContextLayerType } from '../types/context.types';

export interface ClaudeMdSection {
  type: 'global' | 'phase' | 'task' | 'dynamic' | 'validation' | 'general';
  name: string;
  content: string;
  conditions?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ClaudeMdV2 {
  version: string;
  metadata: Record<string, any>;
  sections: ClaudeMdSection[];
  contextLayers: {
    global: { enabled: boolean; budget: number };
    phase: { enabled: boolean; budget: number };
    task: { enabled: boolean; budget: number };
  };
  validationGates?: Record<string, any>;
  patternLibrary?: Record<string, string>;
}

export class ClaudeMdParser {
  private content: string;
  private version: string = '1.0';

  constructor(content: string) {
    this.content = content;
    this.detectVersion();
  }

  private detectVersion(): void {
    // Check for YAML frontmatter (v2.0 indicator)
    if (this.content.startsWith('---\n')) {
      const frontmatterEnd = this.content.indexOf('\n---\n', 4);
      if (frontmatterEnd > 0) {
        try {
          const frontmatter = this.content.substring(4, frontmatterEnd);
          const metadata = yaml.load(frontmatter) as any;
          this.version = metadata.version || '2.0';
        } catch {
          this.version = '1.0';
        }
      }
    }
    
    // Check for v2.0 section markers
    if (this.content.includes('### L1:') || this.content.includes('@global') || 
        this.content.includes('@phase') || this.content.includes('@task')) {
      this.version = '2.0';
    }
  }

  parse(): ClaudeMdV2 {
    if (this.version === '2.0') {
      return this.parseV2();
    } else {
      return this.convertV1ToV2(this.parseV1());
    }
  }

  private parseV2(): ClaudeMdV2 {
    const result: ClaudeMdV2 = {
      version: '2.0',
      metadata: {},
      sections: [],
      contextLayers: {
        global: { enabled: true, budget: 2000 },
        phase: { enabled: true, budget: 3000 },
        task: { enabled: true, budget: 2000 }
      }
    };

    // Parse frontmatter
    const frontmatterEnd = this.content.indexOf('\n---\n', 4);
    if (frontmatterEnd > 0) {
      const frontmatter = this.content.substring(4, frontmatterEnd);
      try {
        const metadata = yaml.load(frontmatter) as any;
        result.metadata = metadata;
        if (metadata.context_layers) {
          result.contextLayers = metadata.context_layers;
        }
      } catch (error) {
        console.error('Failed to parse frontmatter:', error);
      }
    }

    // Parse sections
    const mainContent = frontmatterEnd > 0 ? 
      this.content.substring(frontmatterEnd + 5) : this.content;

    // Parse L1, L2, L3 sections
    result.sections.push(...this.parseContextLayerSections(mainContent));

    // Parse validation gates
    const validationGates = this.parseValidationGates(mainContent);
    if (validationGates) {
      result.validationGates = validationGates;
    }

    // Parse pattern library
    const patternLibrary = this.parsePatternLibrary(mainContent);
    if (patternLibrary) {
      result.patternLibrary = patternLibrary;
    }

    // Parse dynamic sections
    result.sections.push(...this.parseDynamicSections(mainContent));

    // Parse remaining sections
    result.sections.push(...this.parseGeneralSections(mainContent));

    return result;
  }

  private parseContextLayerSections(content: string): ClaudeMdSection[] {
    const sections: ClaudeMdSection[] = [];

    // L1: Global Rules
    const globalMatch = content.match(/### L1: Global Rules[^#]*/);
    if (globalMatch) {
      const globalContent = this.extractSectionContent(globalMatch[0]);
      sections.push({
        type: 'global',
        name: 'Global Rules',
        content: globalContent
      });
    }

    // L2: Phase Context
    const phaseMatch = content.match(/### L2: Phase Context[^#]*/);
    if (phaseMatch) {
      const phaseContent = this.extractSectionContent(phaseMatch[0]);
      sections.push({
        type: 'phase',
        name: 'Phase Context',
        content: phaseContent
      });
    }

    // L3: Task Context
    const taskMatch = content.match(/### L3: Task Context[^#]*/);
    if (taskMatch) {
      const taskContent = this.extractSectionContent(taskMatch[0]);
      sections.push({
        type: 'task',
        name: 'Task Context',
        content: taskContent
      });
    }

    return sections;
  }

  private parseValidationGates(content: string): Record<string, any> | null {
    const gatesMatch = content.match(/## Validation Gates([\s\S]*?)(?=##|$)/);
    if (!gatesMatch) return null;

    const gatesContent = gatesMatch[1];
    const yamlMatch = gatesContent.match(/```yaml([\s\S]*?)```/);
    
    if (yamlMatch) {
      try {
        return yaml.load(yamlMatch[1]) as Record<string, any>;
      } catch (error) {
        console.error('Failed to parse validation gates:', error);
      }
    }

    return null;
  }

  private parsePatternLibrary(content: string): Record<string, string> | null {
    const libraryMatch = content.match(/## Pattern Library([\s\S]*?)(?=##|$)/);
    if (!libraryMatch) return null;

    const patterns: Record<string, string> = {};
    const patternRegex = /### ([^\n]+)\n```(?:typescript|javascript)?\n([\s\S]*?)```/g;
    
    let match;
    while ((match = patternRegex.exec(libraryMatch[1])) !== null) {
      patterns[match[1].trim()] = match[2].trim();
    }

    return Object.keys(patterns).length > 0 ? patterns : null;
  }

  private parseDynamicSections(content: string): ClaudeMdSection[] {
    const sections: ClaudeMdSection[] = [];
    const dynamicRegex = /### @dynamic\(([^)]+)\)([\s\S]*?)(?=###|##|$)/g;
    
    let match;
    while ((match = dynamicRegex.exec(content)) !== null) {
      const condition = match[1];
      const sectionContent = match[2].trim();
      
      // Parse condition
      const [key, value] = condition.split(':').map(s => s.trim());
      
      sections.push({
        type: 'dynamic',
        name: `Dynamic: ${condition}`,
        content: sectionContent,
        conditions: { [key]: value }
      });
    }

    return sections;
  }

  private parseGeneralSections(content: string): ClaudeMdSection[] {
    const sections: ClaudeMdSection[] = [];
    const sectionRegex = /## ([^#\n]+)([\s\S]*?)(?=##|$)/g;
    
    // Skip already parsed sections
    const skipSections = [
      'Context Layers', 'Validation Gates', 'Pattern Library',
      'Dynamic Sections'
    ];

    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
      const sectionName = match[1].trim();
      
      if (!skipSections.includes(sectionName) && !sectionName.startsWith('@')) {
        sections.push({
          type: 'general',
          name: sectionName,
          content: match[2].trim()
        });
      }
    }

    return sections;
  }

  private extractSectionContent(section: string): string {
    // Remove the header and clean up
    const lines = section.split('\n');
    const contentLines = lines.slice(1).join('\n').trim();
    
    // Extract subsections
    const subsections = contentLines.split(/\n####\s+/).slice(1);
    
    return subsections.map(subsection => {
      const [title, ...content] = subsection.split('\n');
      return `${title}:\n${content.join('\n').trim()}`;
    }).join('\n\n');
  }

  private parseV1(): Record<string, any> {
    // Simple v1 parsing - treat everything as sections
    const sections: Record<string, string> = {};
    const sectionRegex = /^##\s+([^\n]+)\n([\s\S]*?)(?=^##\s+|\s*$)/gm;
    
    let match;
    while ((match = sectionRegex.exec(this.content)) !== null) {
      sections[match[1].trim()] = match[2].trim();
    }

    return sections;
  }

  private convertV1ToV2(v1Sections: Record<string, any>): ClaudeMdV2 {
    const v2: ClaudeMdV2 = {
      version: '2.0',
      metadata: {
        migrated_from: '1.0',
        migration_date: new Date().toISOString()
      },
      sections: [],
      contextLayers: {
        global: { enabled: true, budget: 2000 },
        phase: { enabled: true, budget: 3000 },
        task: { enabled: true, budget: 2000 }
      }
    };

    // Categorize v1 sections into v2 layers
    Object.entries(v1Sections).forEach(([name, content]) => {
      const type = this.categorizeSection(name, content as string);
      v2.sections.push({
        type,
        name,
        content: content as string
      });
    });

    return v2;
  }

  private categorizeSection(name: string, content: string): ClaudeMdSection['type'] {
    const lowerName = name.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Global indicators
    if (lowerName.includes('convention') || lowerName.includes('standard') ||
        lowerName.includes('security') || lowerName.includes('quality') ||
        lowerName.includes('global') || lowerName.includes('project')) {
      return 'global';
    }

    // Phase indicators
    if (lowerName.includes('phase') || lowerName.includes('feature') ||
        lowerName.includes('requirement') || lowerContent.includes('phase')) {
      return 'phase';
    }

    // Task indicators
    if (lowerName.includes('task') || lowerName.includes('command') ||
        lowerName.includes('instruction') || lowerName.includes('step')) {
      return 'task';
    }

    // Validation indicators
    if (lowerName.includes('validation') || lowerName.includes('gate') ||
        lowerName.includes('check')) {
      return 'validation';
    }

    // Default to general
    return 'general';
  }

  getVersion(): string {
    return this.version;
  }

  static async parseFile(filePath: string): Promise<ClaudeMdV2> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parser = new ClaudeMdParser(content);
    return parser.parse();
  }

  static toContextConfig(claudeMd: ClaudeMdV2): Partial<ContextConfig> {
    return {
      version: claudeMd.version,
      layers: [
        {
          type: 'global' as ContextLayerType,
          enabled: claudeMd.contextLayers.global.enabled,
          budget: claudeMd.contextLayers.global.budget,
          sources: ['CLAUDE.md'],
          rules: []
        },
        {
          type: 'phase' as ContextLayerType,
          enabled: claudeMd.contextLayers.phase.enabled,
          budget: claudeMd.contextLayers.phase.budget,
          sources: ['phases/*.md'],
          rules: []
        },
        {
          type: 'task' as ContextLayerType,
          enabled: claudeMd.contextLayers.task.enabled,
          budget: claudeMd.contextLayers.task.budget,
          sources: ['git-status'],
          rules: []
        }
      ]
    };
  }

  static export(claudeMd: ClaudeMdV2): string {
    const lines: string[] = [];

    // Add frontmatter
    lines.push('---');
    lines.push(yaml.dump({
      version: claudeMd.version,
      ...claudeMd.metadata,
      context_layers: claudeMd.contextLayers
    }).trim());
    lines.push('---');
    lines.push('');

    // Add context layers section
    lines.push('## Context Layers');
    lines.push('');

    // Add layer sections
    const layerSections = claudeMd.sections.filter(s => 
      ['global', 'phase', 'task'].includes(s.type)
    );

    layerSections.forEach(section => {
      const layerPrefix = section.type === 'global' ? 'L1' :
                         section.type === 'phase' ? 'L2' : 'L3';
      lines.push(`### ${layerPrefix}: ${section.name}`);
      lines.push(section.content);
      lines.push('');
    });

    // Add validation gates
    if (claudeMd.validationGates) {
      lines.push('## Validation Gates');
      lines.push('```yaml');
      lines.push(yaml.dump(claudeMd.validationGates).trim());
      lines.push('```');
      lines.push('');
    }

    // Add pattern library
    if (claudeMd.patternLibrary) {
      lines.push('## Pattern Library');
      lines.push('');
      Object.entries(claudeMd.patternLibrary).forEach(([name, code]) => {
        lines.push(`### ${name}`);
        lines.push('```typescript');
        lines.push(code);
        lines.push('```');
        lines.push('');
      });
    }

    // Add dynamic sections
    const dynamicSections = claudeMd.sections.filter(s => s.type === 'dynamic');
    if (dynamicSections.length > 0) {
      lines.push('## Dynamic Sections');
      lines.push('');
      dynamicSections.forEach(section => {
        const condition = Object.entries(section.conditions || {})
          .map(([k, v]) => `${k}:${v}`)
          .join(',');
        lines.push(`### @dynamic(${condition})`);
        lines.push(section.content);
        lines.push('');
      });
    }

    // Add general sections
    const generalSections = claudeMd.sections.filter(s => s.type === 'general');
    generalSections.forEach(section => {
      lines.push(`## ${section.name}`);
      lines.push(section.content);
      lines.push('');
    });

    return lines.join('\n').trim();
  }
}