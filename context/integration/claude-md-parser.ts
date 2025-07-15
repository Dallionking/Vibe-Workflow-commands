/**
 * Enhanced CLAUDE.md v2.0 Format Parser
 * Supports new context engineering features and structured project instructions
 */

import { 
  GlobalRule, 
  GlobalConfiguration, 
  DevelopmentPattern,
  QualityStandard,
  ContextPriority,
  UserPreferences
} from '../types/context.types';

/**
 * CLAUDE.md v2.0 Structure
 */
export interface ClaudeMdV2 {
  version: '2.0';
  metadata: ClaudeMdMetadata;
  projectInfo: ProjectInformation;
  contextEngineering: ContextEngineeringConfig;
  globalRules: GlobalRule[];
  qualityStandards: QualityStandard[];
  developmentPatterns: DevelopmentPattern[];
  mcpIntegration: MCPIntegrationConfig;
  phases: PhaseConfiguration[];
  userPreferences: UserPreferences;
  customSections: CustomSection[];
}

/**
 * Metadata for CLAUDE.md v2.0
 */
interface ClaudeMdMetadata {
  version: '2.0';
  created: number;
  lastModified: number;
  generator: string;
  compatibility: string[];
}

/**
 * Project Information
 */
interface ProjectInformation {
  name: string;
  description: string;
  type: 'library' | 'application' | 'service' | 'tool';
  technologies: string[];
  architecture: string;
  repositoryUrl?: string;
  documentation?: string;
}

/**
 * Context Engineering Configuration
 */
interface ContextEngineeringConfig {
  enabled: boolean;
  tokenBudget: {
    total: number;
    allocation: {
      global: number;
      phase: number;
      task: number;
      memory: number;
      buffer: number;
    };
  };
  caching: {
    enabled: boolean;
    maxSize: number;
    ttl: number;
    strategy: 'lru' | 'lfu' | 'priority-weighted';
  };
  learning: {
    enabled: boolean;
    patternThreshold: number;
    adaptiveWeights: boolean;
  };
}

/**
 * MCP Integration Configuration
 */
interface MCPIntegrationConfig {
  enabled: boolean;
  tools: Array<{
    name: string;
    enabled: boolean;
    priority: ContextPriority;
    configuration: Record<string, unknown>;
  }>;
  fallbackStrategy: 'graceful' | 'essential' | 'fail-fast';
}

/**
 * Phase Configuration
 */
interface PhaseConfiguration {
  number: number;
  name: string;
  description: string;
  objectives: string[];
  requirements: string[];
  dependencies: number[];
  contextRules?: string[];
}

/**
 * Custom Section
 */
interface CustomSection {
  name: string;
  content: string;
  priority: ContextPriority;
  contextRelevant: boolean;
}

/**
 * CLAUDE.md v2.0 Parser
 */
export class ClaudeMdV2Parser {
  private readonly SECTION_MARKERS = {
    PROJECT_INFO: '## Project Information',
    CONTEXT_ENGINEERING: '## Context Engineering',
    GLOBAL_RULES: '## Global Rules',
    QUALITY_STANDARDS: '## Quality Standards',
    DEVELOPMENT_PATTERNS: '## Development Patterns',
    MCP_INTEGRATION: '## MCP Integration',
    PHASES: '## Phases',
    USER_PREFERENCES: '## User Preferences',
    CUSTOM: '## Custom:'
  };

  /**
   * Parse CLAUDE.md v2.0 content
   */
  public parse(content: string): ClaudeMdV2 {
    const sections = this.parseSections(content);
    
    return {
      version: '2.0',
      metadata: this.parseMetadata(sections),
      projectInfo: this.parseProjectInfo(sections),
      contextEngineering: this.parseContextEngineering(sections),
      globalRules: this.parseGlobalRules(sections),
      qualityStandards: this.parseQualityStandards(sections),
      developmentPatterns: this.parseDevelopmentPatterns(sections),
      mcpIntegration: this.parseMcpIntegration(sections),
      phases: this.parsePhases(sections),
      userPreferences: this.parseUserPreferences(sections),
      customSections: this.parseCustomSections(sections)
    };
  }

  /**
   * Generate CLAUDE.md v2.0 content
   */
  public generate(config: ClaudeMdV2): string {
    const sections: string[] = [];

    // Header
    sections.push('# CLAUDE.md v2.0\n');
    sections.push('Enhanced project configuration with Context Engineering support.\n');

    // Metadata
    sections.push(this.generateMetadataSection(config.metadata));

    // Project Information
    sections.push(this.generateProjectInfoSection(config.projectInfo));

    // Context Engineering
    sections.push(this.generateContextEngineeringSection(config.contextEngineering));

    // Global Rules
    sections.push(this.generateGlobalRulesSection(config.globalRules));

    // Quality Standards
    sections.push(this.generateQualityStandardsSection(config.qualityStandards));

    // Development Patterns
    sections.push(this.generateDevelopmentPatternsSection(config.developmentPatterns));

    // MCP Integration
    sections.push(this.generateMcpIntegrationSection(config.mcpIntegration));

    // Phases
    sections.push(this.generatePhasesSection(config.phases));

    // User Preferences
    sections.push(this.generateUserPreferencesSection(config.userPreferences));

    // Custom Sections
    config.customSections.forEach(section => {
      sections.push(this.generateCustomSection(section));
    });

    return sections.join('\n');
  }

  /**
   * Validate CLAUDE.md v2.0 structure
   */
  public validate(config: ClaudeMdV2): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Version check
    if (config.version !== '2.0') {
      errors.push('Invalid version. Expected 2.0');
    }

    // Required sections check
    if (!config.projectInfo || !config.projectInfo.name) {
      errors.push('Project information is required');
    }

    if (!config.globalRules || config.globalRules.length === 0) {
      warnings.push('No global rules defined');
    }

    // Context engineering validation
    if (config.contextEngineering.enabled) {
      const totalAllocation = Object.values(config.contextEngineering.tokenBudget.allocation)
        .reduce((sum, val) => sum + val, 0);
      
      if (totalAllocation > config.contextEngineering.tokenBudget.total) {
        errors.push('Token budget allocation exceeds total budget');
      }
    }

    // Phase validation
    const phaseNumbers = config.phases.map(p => p.number);
    const duplicates = phaseNumbers.filter((num, index) => phaseNumbers.indexOf(num) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate phase numbers: ${duplicates.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Migrate from v1.0 to v2.0
   */
  public migrateFromV1(v1Content: string): ClaudeMdV2 {
    // Parse existing v1 content
    const sections = this.parseSections(v1Content);
    
    // Extract legacy information
    const projectName = this.extractProjectName(v1Content);
    const existingRules = this.extractLegacyRules(v1Content);
    
    // Create v2 structure with defaults
    return {
      version: '2.0',
      metadata: {
        version: '2.0',
        created: Date.now(),
        lastModified: Date.now(),
        generator: 'ClaudeMdV2Parser',
        compatibility: ['claude-code', 'vibe-workflow']
      },
      projectInfo: {
        name: projectName || 'Migrated Project',
        description: 'Project migrated from CLAUDE.md v1.0',
        type: 'application',
        technologies: [],
        architecture: 'unknown'
      },
      contextEngineering: this.getDefaultContextConfig(),
      globalRules: existingRules,
      qualityStandards: this.getDefaultQualityStandards(),
      developmentPatterns: this.getDefaultDevelopmentPatterns(),
      mcpIntegration: this.getDefaultMcpConfig(),
      phases: [],
      userPreferences: this.getDefaultUserPreferences(),
      customSections: []
    };
  }

  // Private parsing methods

  private parseSections(content: string): Map<string, string> {
    const sections = new Map<string, string>();
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          sections.set(currentSection, currentContent.join('\n').trim());
        }
        
        // Start new section
        currentSection = line;
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection && currentContent.length > 0) {
      sections.set(currentSection, currentContent.join('\n').trim());
    }

    return sections;
  }

  private parseMetadata(sections: Map<string, string>): ClaudeMdMetadata {
    return {
      version: '2.0',
      created: Date.now(),
      lastModified: Date.now(),
      generator: 'ClaudeMdV2Parser',
      compatibility: ['claude-code', 'vibe-workflow']
    };
  }

  private parseProjectInfo(sections: Map<string, string>): ProjectInformation {
    const section = sections.get(this.SECTION_MARKERS.PROJECT_INFO) || '';
    
    return {
      name: this.extractValue(section, 'Name') || 'Unknown Project',
      description: this.extractValue(section, 'Description') || '',
      type: (this.extractValue(section, 'Type') as any) || 'application',
      technologies: this.extractArrayValue(section, 'Technologies'),
      architecture: this.extractValue(section, 'Architecture') || 'unknown'
    };
  }

  private parseContextEngineering(sections: Map<string, string>): ContextEngineeringConfig {
    const section = sections.get(this.SECTION_MARKERS.CONTEXT_ENGINEERING);
    
    if (!section || !section.includes('enabled: true')) {
      return {
        enabled: false,
        tokenBudget: { total: 8000, allocation: { global: 2000, phase: 2000, task: 2000, memory: 1000, buffer: 1000 } },
        caching: { enabled: true, maxSize: 1000, ttl: 3600000, strategy: 'lru' },
        learning: { enabled: true, patternThreshold: 3, adaptiveWeights: true }
      };
    }

    return this.getDefaultContextConfig();
  }

  private parseGlobalRules(sections: Map<string, string>): GlobalRule[] {
    const section = sections.get(this.SECTION_MARKERS.GLOBAL_RULES) || '';
    const rules: GlobalRule[] = [];
    
    const ruleMatches = section.match(/- \*\*(.*?)\*\*: (.*?)(?=\n- |$)/gs);
    
    if (ruleMatches) {
      ruleMatches.forEach((match, index) => {
        const [, name, rule] = match.match(/- \*\*(.*?)\*\*: (.*)/) || [];
        if (name && rule) {
          rules.push({
            id: `rule-${index}`,
            name: name.trim(),
            description: rule.trim(),
            rule: rule.trim(),
            enabled: true,
            priority: ContextPriority.HIGH
          });
        }
      });
    }

    return rules.length > 0 ? rules : this.getDefaultGlobalRules();
  }

  private parseQualityStandards(sections: Map<string, string>): QualityStandard[] {
    return this.getDefaultQualityStandards();
  }

  private parseDevelopmentPatterns(sections: Map<string, string>): DevelopmentPattern[] {
    return this.getDefaultDevelopmentPatterns();
  }

  private parseMcpIntegration(sections: Map<string, string>): MCPIntegrationConfig {
    return this.getDefaultMcpConfig();
  }

  private parsePhases(sections: Map<string, string>): PhaseConfiguration[] {
    const section = sections.get(this.SECTION_MARKERS.PHASES) || '';
    const phases: PhaseConfiguration[] = [];
    
    const phaseMatches = section.match(/### Phase (\d+): (.*?)\n(.*?)(?=### Phase|\Z)/gs);
    
    if (phaseMatches) {
      phaseMatches.forEach(match => {
        const [, number, name, content] = match.match(/### Phase (\d+): (.*?)\n(.*)/) || [];
        if (number && name) {
          phases.push({
            number: parseInt(number),
            name: name.trim(),
            description: content.trim(),
            objectives: [],
            requirements: [],
            dependencies: []
          });
        }
      });
    }

    return phases;
  }

  private parseUserPreferences(sections: Map<string, string>): UserPreferences {
    return this.getDefaultUserPreferences();
  }

  private parseCustomSections(sections: Map<string, string>): CustomSection[] {
    const customSections: CustomSection[] = [];
    
    for (const [key, content] of sections) {
      if (key.startsWith(this.SECTION_MARKERS.CUSTOM)) {
        const name = key.replace(this.SECTION_MARKERS.CUSTOM, '').trim();
        customSections.push({
          name,
          content,
          priority: ContextPriority.MEDIUM,
          contextRelevant: true
        });
      }
    }

    return customSections;
  }

  // Generation methods

  private generateMetadataSection(metadata: ClaudeMdMetadata): string {
    return `## Metadata
- Version: ${metadata.version}
- Generated: ${new Date(metadata.created).toISOString()}
- Last Modified: ${new Date(metadata.lastModified).toISOString()}
- Generator: ${metadata.generator}
- Compatibility: ${metadata.compatibility.join(', ')}

`;
  }

  private generateProjectInfoSection(info: ProjectInformation): string {
    return `## Project Information
- **Name**: ${info.name}
- **Description**: ${info.description}
- **Type**: ${info.type}
- **Technologies**: ${info.technologies.join(', ')}
- **Architecture**: ${info.architecture}
${info.repositoryUrl ? `- **Repository**: ${info.repositoryUrl}` : ''}

`;
  }

  private generateContextEngineeringSection(config: ContextEngineeringConfig): string {
    return `## Context Engineering
- **Enabled**: ${config.enabled}
- **Token Budget**: ${config.tokenBudget.total}
  - Global: ${config.tokenBudget.allocation.global}
  - Phase: ${config.tokenBudget.allocation.phase}
  - Task: ${config.tokenBudget.allocation.task}
  - Memory: ${config.tokenBudget.allocation.memory}
  - Buffer: ${config.tokenBudget.allocation.buffer}
- **Caching**: ${config.caching.enabled ? 'Enabled' : 'Disabled'}
  - Strategy: ${config.caching.strategy}
  - Max Size: ${config.caching.maxSize}
  - TTL: ${config.caching.ttl}ms
- **Learning**: ${config.learning.enabled ? 'Enabled' : 'Disabled'}
  - Pattern Threshold: ${config.learning.patternThreshold}
  - Adaptive Weights: ${config.learning.adaptiveWeights}

`;
  }

  private generateGlobalRulesSection(rules: GlobalRule[]): string {
    const ruleList = rules
      .filter(rule => rule.enabled)
      .map(rule => `- **${rule.name}**: ${rule.rule}`)
      .join('\n');

    return `## Global Rules
${ruleList}

`;
  }

  private generateQualityStandardsSection(standards: QualityStandard[]): string {
    const standardsList = standards
      .map(standard => `- **${standard.name}**: ${standard.threshold}%`)
      .join('\n');

    return `## Quality Standards
${standardsList}

`;
  }

  private generateDevelopmentPatternsSection(patterns: DevelopmentPattern[]): string {
    const patternsList = patterns
      .map(pattern => `- **${pattern.name}**: ${pattern.pattern}`)
      .join('\n');

    return `## Development Patterns
${patternsList}

`;
  }

  private generateMcpIntegrationSection(config: MCPIntegrationConfig): string {
    const toolsList = config.tools
      .filter(tool => tool.enabled)
      .map(tool => `- **${tool.name}**: Priority ${tool.priority}`)
      .join('\n');

    return `## MCP Integration
- **Enabled**: ${config.enabled}
- **Fallback Strategy**: ${config.fallbackStrategy}
- **Tools**:
${toolsList}

`;
  }

  private generatePhasesSection(phases: PhaseConfiguration[]): string {
    const phasesList = phases
      .map(phase => `### Phase ${phase.number}: ${phase.name}\n${phase.description}\n\n**Objectives**:\n${phase.objectives.map(obj => `- ${obj}`).join('\n')}\n\n**Requirements**:\n${phase.requirements.map(req => `- ${req}`).join('\n')}`)
      .join('\n\n');

    return `## Phases
${phasesList}

`;
  }

  private generateUserPreferencesSection(prefs: UserPreferences): string {
    return `## User Preferences
- **Code Style**: ${prefs.codeStyle.conventions.join(', ')}
- **Documentation**: ${prefs.documentation.format} (${prefs.documentation.detail})
- **Testing**: ${prefs.testing.framework} (${prefs.testing.coverage}% coverage)

`;
  }

  private generateCustomSection(section: CustomSection): string {
    return `## Custom: ${section.name}
${section.content}

`;
  }

  // Helper methods

  private extractValue(content: string, key: string): string | undefined {
    const match = content.match(new RegExp(`\\*\\*${key}\\*\\*:?\\s*(.+?)(?=\\n|$)`, 'i'));
    return match ? match[1].trim() : undefined;
  }

  private extractArrayValue(content: string, key: string): string[] {
    const value = this.extractValue(content, key);
    return value ? value.split(',').map(item => item.trim()).filter(Boolean) : [];
  }

  private extractProjectName(content: string): string | undefined {
    const match = content.match(/# (.+?)(?:\n|$)/);
    return match ? match[1].trim() : undefined;
  }

  private extractLegacyRules(content: string): GlobalRule[] {
    const rules: GlobalRule[] = [];
    const ruleMatches = content.match(/- .+/g);
    
    if (ruleMatches) {
      ruleMatches.forEach((rule, index) => {
        const cleanRule = rule.replace(/^- /, '').trim();
        if (cleanRule) {
          rules.push({
            id: `legacy-rule-${index}`,
            name: `Legacy Rule ${index + 1}`,
            description: cleanRule,
            rule: cleanRule,
            enabled: true,
            priority: ContextPriority.MEDIUM
          });
        }
      });
    }

    return rules;
  }

  // Default configurations

  private getDefaultContextConfig(): ContextEngineeringConfig {
    return {
      enabled: true,
      tokenBudget: {
        total: 8000,
        allocation: {
          global: 2000,
          phase: 2000,
          task: 2000,
          memory: 1000,
          buffer: 1000
        }
      },
      caching: {
        enabled: true,
        maxSize: 1000,
        ttl: 3600000,
        strategy: 'lru'
      },
      learning: {
        enabled: true,
        patternThreshold: 3,
        adaptiveWeights: true
      }
    };
  }

  private getDefaultGlobalRules(): GlobalRule[] {
    return [
      {
        id: 'systematic-development',
        name: 'Systematic Development',
        description: 'Follow the 10-step Vibe Coding methodology exactly',
        rule: 'Always follow systematic development patterns with proper validation',
        enabled: true,
        priority: ContextPriority.CRITICAL
      },
      {
        id: 'quality-standards',
        name: 'Quality Standards',
        description: 'Enforce 95%+ test coverage and Universal Format compliance',
        rule: 'Maintain 95%+ test coverage and follow Universal Format for all code',
        enabled: true,
        priority: ContextPriority.CRITICAL
      }
    ];
  }

  private getDefaultQualityStandards(): QualityStandard[] {
    return [
      {
        name: 'Test Coverage',
        description: 'Minimum test coverage requirement',
        criteria: [
          { metric: 'line-coverage', target: 95, required: true },
          { metric: 'branch-coverage', target: 90, required: true }
        ],
        threshold: 95
      }
    ];
  }

  private getDefaultDevelopmentPatterns(): DevelopmentPattern[] {
    return [
      {
        name: 'Universal Format',
        description: 'Standard format for vertical slices',
        pattern: 'feature → implementation → testing → documentation → integration',
        examples: ['user-auth-slice.md'],
        applicability: ['all-features']
      }
    ];
  }

  private getDefaultMcpConfig(): MCPIntegrationConfig {
    return {
      enabled: true,
      tools: [
        { name: 'Context7', enabled: true, priority: ContextPriority.CRITICAL, configuration: {} },
        { name: 'Perplexity', enabled: true, priority: ContextPriority.HIGH, configuration: {} }
      ],
      fallbackStrategy: 'graceful'
    };
  }

  private getDefaultUserPreferences(): UserPreferences {
    return {
      codeStyle: {
        indentation: 'spaces',
        spacing: 2,
        lineLength: 100,
        conventions: ['camelCase', 'PascalCase']
      },
      documentation: {
        format: 'markdown',
        detail: 'comprehensive',
        examples: true
      },
      testing: {
        framework: 'jest',
        coverage: 95,
        types: ['unit', 'integration']
      }
    };
  }
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Singleton parser instance
 */
export const claudeMdV2Parser = new ClaudeMdV2Parser();