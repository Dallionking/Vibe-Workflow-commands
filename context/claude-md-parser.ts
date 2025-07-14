/**
 * CLAUDE.md Parser
 * Supports both v1.0 (legacy) and v2.0 (enhanced) formats
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { 
  ContextConfig, 
  ContextLayer, 
  ValidationGate,
  DynamicSection,
  ClaudeMdSection,
  ClaudeMdMetadata 
} from './types/context.types';

interface ParsedSection {
  type: string;
  qualifier?: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

interface ClaudeMdDocument {
  version: string;
  metadata: ClaudeMdMetadata;
  sections: ParsedSection[];
  raw: string;
}

export class ClaudeMdParser {
  private static readonly VERSION_PATTERN = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  private static readonly SECTION_PATTERN = /^#{1,6}\s+(?:@(\w+)(?::([^#\s]+))?\s+)?(.+)$/gm;
  
  /**
   * Parse CLAUDE.md file with version detection
   */
  static async parse(filePath: string): Promise<ClaudeMdDocument> {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const version = this.detectVersion(content);
    
    if (version === '2.0') {
      return this.parseV2(content);
    } else {
      return this.parseV1(content);
    }
  }

  /**
   * Parse synchronously
   */
  static parseSync(filePath: string): ClaudeMdDocument {
    const content = fs.readFileSync(filePath, 'utf-8');
    const version = this.detectVersion(content);
    
    if (version === '2.0') {
      return this.parseV2(content);
    } else {
      return this.parseV1(content);
    }
  }

  /**
   * Parse from string content
   */
  static parseContent(content: string): ClaudeMdDocument {
    const version = this.detectVersion(content);
    
    if (version === '2.0') {
      return this.parseV2(content);
    } else {
      return this.parseV1(content);
    }
  }

  /**
   * Detect CLAUDE.md version
   */
  private static detectVersion(content: string): string {
    // Check for YAML frontmatter with version
    const frontmatterMatch = content.match(this.VERSION_PATTERN);
    if (frontmatterMatch) {
      try {
        const metadata = yaml.load(frontmatterMatch[1]) as any;
        if (metadata?.version) {
          return metadata.version;
        }
      } catch (e) {
        // Invalid YAML, treat as v1.0
      }
    }
    
    // Check for @-prefixed sections (v2.0 indicator)
    if (content.includes('## @')) {
      return '2.0';
    }
    
    return '1.0';
  }

  /**
   * Parse v1.0 format (legacy)
   */
  private static parseV1(content: string): ClaudeMdDocument {
    const sections = this.extractSections(content);
    
    // Convert all sections to global context
    const parsedSections: ParsedSection[] = sections.map(section => ({
      type: 'global',
      title: section.title,
      content: section.content
    }));

    // Default v1.0 metadata
    const metadata: ClaudeMdMetadata = {
      version: '1.0',
      context: {
        global: {
          priority: 1000,
          maxTokens: 8000
        }
      }
    };

    return {
      version: '1.0',
      metadata,
      sections: parsedSections,
      raw: content
    };
  }

  /**
   * Parse v2.0 format (enhanced)
   */
  private static parseV2(content: string): ClaudeMdDocument {
    // Extract frontmatter
    const frontmatterMatch = content.match(this.VERSION_PATTERN);
    let metadata: ClaudeMdMetadata = {
      version: '2.0',
      context: {}
    };
    
    let mainContent = content;
    
    if (frontmatterMatch) {
      try {
        metadata = yaml.load(frontmatterMatch[1]) as ClaudeMdMetadata;
        mainContent = content.substring(frontmatterMatch[0].length);
      } catch (e) {
        console.error('Failed to parse YAML frontmatter:', e);
      }
    }

    // Parse sections with type annotations
    const sections = this.extractV2Sections(mainContent);

    return {
      version: '2.0',
      metadata,
      sections,
      raw: content
    };
  }

  /**
   * Extract sections from content (v1.0 style)
   */
  private static extractSections(content: string): Array<{title: string; content: string}> {
    const sections: Array<{title: string; content: string}> = [];
    const lines = content.split('\n');
    
    let currentSection: {title: string; content: string} | null = null;
    
    for (const line of lines) {
      const headerMatch = line.match(/^#{1,6}\s+(.+)$/);
      
      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: headerMatch[1].trim(),
          content: ''
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections.map(s => ({
      ...s,
      content: s.content.trim()
    }));
  }

  /**
   * Extract sections with v2.0 type annotations
   */
  private static extractV2Sections(content: string): ParsedSection[] {
    const sections: ParsedSection[] = [];
    const lines = content.split('\n');
    
    let currentSection: ParsedSection | null = null;
    
    for (const line of lines) {
      const headerMatch = line.match(/^#{1,6}\s+(?:@(\w+)(?::([^#\s]+))?\s+)?(.+)$/);
      
      if (headerMatch) {
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentSection.content.trim()
          });
        }
        
        currentSection = {
          type: headerMatch[1] || 'global',
          qualifier: headerMatch[2] || undefined,
          title: headerMatch[3].trim(),
          content: ''
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }
    
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentSection.content.trim()
      });
    }
    
    return sections;
  }

  /**
   * Convert parsed document to context configuration
   */
  static toContextConfig(doc: ClaudeMdDocument): Partial<ContextConfig> {
    const config: Partial<ContextConfig> = {
      version: doc.version
    };

    // Build layer configurations
    const layers: ContextLayer[] = [];
    const sectionsByType = this.groupSectionsByType(doc.sections);

    // Global layer
    if (sectionsByType.global?.length > 0) {
      layers.push({
        type: 'global',
        enabled: true,
        budget: doc.metadata.context?.global?.maxTokens || 2000,
        sources: ['CLAUDE.md#global'],
        rules: []
      });
    }

    // Phase layer
    const phaseSections = sectionsByType.phase || [];
    if (phaseSections.length > 0) {
      layers.push({
        type: 'phase',
        enabled: true,
        budget: doc.metadata.context?.phase?.maxTokens || 3000,
        sources: ['CLAUDE.md#phase'],
        rules: []
      });
    }

    // Task layer
    const taskSections = sectionsByType.task || [];
    if (taskSections.length > 0) {
      layers.push({
        type: 'task',
        enabled: true,
        budget: doc.metadata.context?.task?.maxTokens || 2000,
        sources: ['CLAUDE.md#task'],
        rules: []
      });
    }

    config.layers = layers;

    // Add validation configuration if present
    if (doc.metadata.validationGates) {
      config.validation = {
        enabled: true,
        rules: ['structure', 'content'],
        strictMode: doc.metadata.features?.validationStrictMode || false,
        autoFix: true
      };
    }

    return config;
  }

  /**
   * Group sections by type
   */
  private static groupSectionsByType(sections: ParsedSection[]): Record<string, ParsedSection[]> {
    const grouped: Record<string, ParsedSection[]> = {};
    
    sections.forEach(section => {
      if (!grouped[section.type]) {
        grouped[section.type] = [];
      }
      grouped[section.type].push(section);
    });
    
    return grouped;
  }

  /**
   * Get sections for specific context layer
   */
  static getSectionsForLayer(doc: ClaudeMdDocument, layerType: string): ParsedSection[] {
    return doc.sections.filter(section => section.type === layerType);
  }

  /**
   * Get sections for specific phase
   */
  static getSectionsForPhase(doc: ClaudeMdDocument, phase: string): ParsedSection[] {
    return doc.sections.filter(section => 
      section.type === 'phase' && 
      (!section.qualifier || section.qualifier.includes(phase))
    );
  }

  /**
   * Get sections for specific task
   */
  static getSectionsForTask(doc: ClaudeMdDocument, task: string): ParsedSection[] {
    return doc.sections.filter(section => 
      section.type === 'task' && 
      (!section.qualifier || section.qualifier.includes(task))
    );
  }

  /**
   * Get dynamic sections matching triggers
   */
  static getDynamicSections(doc: ClaudeMdDocument, triggers: string[]): ParsedSection[] {
    if (!doc.metadata.dynamicSections) {
      return [];
    }

    const matchingSections: ParsedSection[] = [];
    
    doc.metadata.dynamicSections.forEach(dynamic => {
      if (this.matchesTrigger(dynamic.trigger, triggers)) {
        const sections = doc.sections.filter(s => 
          dynamic.sections?.includes(s.title) || 
          (s.type === 'dynamic' && s.qualifier === dynamic.id)
        );
        matchingSections.push(...sections);
      }
    });

    return matchingSections;
  }

  /**
   * Check if trigger matches
   */
  private static matchesTrigger(trigger: string, activeTriggers: string[]): boolean {
    // Simple wildcard matching
    const pattern = trigger.replace('*', '.*');
    const regex = new RegExp(`^${pattern}$`);
    
    return activeTriggers.some(t => regex.test(t));
  }

  /**
   * Get validation gates for phase
   */
  static getValidationGates(doc: ClaudeMdDocument, phase: string): ValidationGate[] {
    if (!doc.metadata.validationGates) {
      return [];
    }

    return doc.metadata.validationGates.filter(gate => 
      gate.phase === phase || gate.phase === '*'
    );
  }

  /**
   * Validate document structure
   */
  static validate(doc: ClaudeMdDocument): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check version
    if (!doc.version) {
      errors.push('Missing version');
    }

    // Check metadata structure for v2.0
    if (doc.version === '2.0') {
      if (!doc.metadata.context) {
        errors.push('v2.0 requires context configuration');
      }

      // Validate section types
      const validTypes = ['global', 'phase', 'task', 'dynamic', 'validation'];
      doc.sections.forEach((section, index) => {
        if (!validTypes.includes(section.type)) {
          errors.push(`Invalid section type at index ${index}: ${section.type}`);
        }
      });

      // Validate validation gates
      if (doc.metadata.validationGates) {
        doc.metadata.validationGates.forEach((gate, index) => {
          if (!gate.id || !gate.phase || !gate.requires) {
            errors.push(`Invalid validation gate at index ${index}`);
          }
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Migrate v1.0 to v2.0
   */
  static migrate(v1Doc: ClaudeMdDocument): ClaudeMdDocument {
    if (v1Doc.version === '2.0') {
      return v1Doc;
    }

    const v2Sections: ParsedSection[] = [];
    
    // Analyze sections and categorize them
    v1Doc.sections.forEach(section => {
      const type = this.inferSectionType(section);
      v2Sections.push({
        ...section,
        type: type.type,
        qualifier: type.qualifier
      });
    });

    // Build v2.0 metadata
    const v2Metadata: ClaudeMdMetadata = {
      version: '2.0',
      context: {
        global: {
          priority: 1000,
          maxTokens: 2000
        },
        phase: {
          priority: 800,
          maxTokens: 3000
        },
        task: {
          priority: 600,
          maxTokens: 2000
        }
      },
      features: {
        autoCompression: true,
        contextLearning: true,
        dynamicPrioritization: true
      }
    };

    return {
      version: '2.0',
      metadata: v2Metadata,
      sections: v2Sections,
      raw: this.generateV2Content(v2Metadata, v2Sections)
    };
  }

  /**
   * Infer section type from content
   */
  private static inferSectionType(section: ParsedSection): { type: string; qualifier?: string } {
    const title = section.title.toLowerCase();
    const content = section.content.toLowerCase();

    // Phase indicators
    if (title.includes('planning') || title.includes('requirements')) {
      return { type: 'phase', qualifier: 'planning' };
    }
    if (title.includes('implementation') || title.includes('coding')) {
      return { type: 'phase', qualifier: 'implementation' };
    }
    if (title.includes('testing') || title.includes('test')) {
      return { type: 'phase', qualifier: 'testing' };
    }

    // Task indicators
    if (title.includes('git') || content.includes('commit')) {
      return { type: 'task', qualifier: 'git' };
    }
    if (title.includes('mcp') || title.includes('tool')) {
      return { type: 'dynamic', qualifier: 'mcp' };
    }

    // Default to global
    return { type: 'global' };
  }

  /**
   * Generate v2.0 content from metadata and sections
   */
  private static generateV2Content(metadata: ClaudeMdMetadata, sections: ParsedSection[]): string {
    let content = '---\n';
    content += yaml.dump(metadata);
    content += '---\n\n';
    content += '# CLAUDE.md\n\n';

    sections.forEach(section => {
      const qualifier = section.qualifier ? `:${section.qualifier}` : '';
      content += `## @${section.type}${qualifier} ${section.title}\n`;
      content += `${section.content}\n\n`;
    });

    return content;
  }

  /**
   * Export to v2.0 format
   */
  static export(doc: ClaudeMdDocument, filePath: string): void {
    const content = doc.version === '2.0' 
      ? doc.raw 
      : this.generateV2Content(doc.metadata, doc.sections);
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}