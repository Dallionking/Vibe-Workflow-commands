/**
 * CLAUDE.md Integration with Context System
 * Bridges CLAUDE.md v2.0 with the three-tier context loading system
 */

import { ClaudeMdParser } from './claude-md-parser';
import { ContextLoader } from './assembly/loader';
import { GlobalContext } from './layers/global';
import { PhaseContext } from './layers/phase';
import { TaskContext } from './layers/task';
import { 
  ContextConfig, 
  ContextContent,
  ValidationGate,
  DynamicTrigger 
} from './types/context.types';

interface ClaudeMdIntegrationOptions {
  claudeMdPath?: string;
  enableDynamic?: boolean;
  enableValidation?: boolean;
  enableLearning?: boolean;
  cacheResults?: boolean;
}

export class ClaudeMdIntegration {
  private claudeMdPath: string;
  private options: ClaudeMdIntegrationOptions;
  private parsedDoc: any;
  private contextLoader: ContextLoader;
  private dynamicTriggers: Set<string> = new Set();

  constructor(options: ClaudeMdIntegrationOptions = {}) {
    this.claudeMdPath = options.claudeMdPath || 'CLAUDE.md';
    this.options = {
      enableDynamic: true,
      enableValidation: true,
      enableLearning: true,
      cacheResults: true,
      ...options
    };
    
    this.contextLoader = new ContextLoader();
  }

  /**
   * Initialize integration
   */
  async initialize(): Promise<void> {
    // Parse CLAUDE.md
    this.parsedDoc = await ClaudeMdParser.parse(this.claudeMdPath);
    
    // Validate document
    const validation = ClaudeMdParser.validate(this.parsedDoc);
    if (!validation.valid) {
      console.error('CLAUDE.md validation errors:', validation.errors);
      throw new Error('Invalid CLAUDE.md format');
    }

    // Configure context loader with CLAUDE.md settings
    await this.configureContextLoader();
    
    // Register context providers
    this.registerContextProviders();
    
    // Setup dynamic triggers if enabled
    if (this.options.enableDynamic) {
      this.setupDynamicTriggers();
    }
  }

  /**
   * Configure context loader based on CLAUDE.md
   */
  private async configureContextLoader(): Promise<void> {
    const claudeConfig = ClaudeMdParser.toContextConfig(this.parsedDoc);
    const loaderConfig = await this.contextLoader.getConfig();
    
    // Merge configurations
    const mergedConfig: ContextConfig = {
      ...loaderConfig,
      ...claudeConfig,
      layers: this.mergeLayers(loaderConfig.layers || [], claudeConfig.layers || []),
      features: {
        ...loaderConfig.features,
        ...this.parsedDoc.metadata.features
      }
    };

    // Apply merged configuration
    await this.contextLoader.updateConfig(mergedConfig);
  }

  /**
   * Merge layer configurations
   */
  private mergeLayers(base: any[], claude: any[]): any[] {
    const merged = [...base];
    
    claude.forEach(claudeLayer => {
      const existingIndex = merged.findIndex(l => l.type === claudeLayer.type);
      if (existingIndex >= 0) {
        // Merge with existing layer
        merged[existingIndex] = {
          ...merged[existingIndex],
          ...claudeLayer,
          sources: [
            ...new Set([
              ...merged[existingIndex].sources,
              ...claudeLayer.sources
            ])
          ]
        };
      } else {
        // Add new layer
        merged.push(claudeLayer);
      }
    });

    return merged;
  }

  /**
   * Register context providers with CLAUDE.md content
   */
  private registerContextProviders(): void {
    // Register global context provider
    this.contextLoader.registerProvider('claude-global', async () => {
      const sections = ClaudeMdParser.getSectionsForLayer(this.parsedDoc, 'global');
      return this.sectionsToContent(sections);
    });

    // Register phase context provider
    this.contextLoader.registerProvider('claude-phase', async (context) => {
      const currentPhase = context.phase || 'default';
      const sections = ClaudeMdParser.getSectionsForPhase(this.parsedDoc, currentPhase);
      return this.sectionsToContent(sections);
    });

    // Register task context provider
    this.contextLoader.registerProvider('claude-task', async (context) => {
      const currentTask = context.task || 'default';
      const sections = ClaudeMdParser.getSectionsForTask(this.parsedDoc, currentTask);
      return this.sectionsToContent(sections);
    });

    // Register dynamic context provider
    if (this.options.enableDynamic) {
      this.contextLoader.registerProvider('claude-dynamic', async () => {
        const triggers = Array.from(this.dynamicTriggers);
        const sections = ClaudeMdParser.getDynamicSections(this.parsedDoc, triggers);
        return this.sectionsToContent(sections);
      });
    }
  }

  /**
   * Convert sections to context content
   */
  private sectionsToContent(sections: any[]): ContextContent[] {
    return sections.map(section => ({
      type: 'text',
      content: `### ${section.title}\n\n${section.content}`,
      metadata: {
        source: 'CLAUDE.md',
        section: section.title,
        type: section.type,
        qualifier: section.qualifier
      }
    }));
  }

  /**
   * Setup dynamic triggers
   */
  private setupDynamicTriggers(): void {
    // Monitor file operations
    this.contextLoader.on('file:open', (file: string) => {
      const ext = file.split('.').pop();
      this.dynamicTriggers.add(`file:*.${ext}`);
      this.dynamicTriggers.add(`file:${file}`);
    });

    // Monitor tool usage
    this.contextLoader.on('tool:use', (tool: string) => {
      this.dynamicTriggers.add(`tool:${tool}`);
    });

    // Monitor environment
    this.contextLoader.on('env:detect', (env: string) => {
      this.dynamicTriggers.add(`env:${env}`);
    });
  }

  /**
   * Load context for current state
   */
  async loadContext(options: {
    phase?: string;
    task?: string;
    files?: string[];
    tools?: string[];
  } = {}): Promise<any> {
    // Update triggers based on current state
    if (options.files) {
      options.files.forEach(file => {
        const ext = file.split('.').pop();
        this.dynamicTriggers.add(`file:*.${ext}`);
      });
    }

    if (options.tools) {
      options.tools.forEach(tool => {
        this.dynamicTriggers.add(`tool:${tool}`);
      });
    }

    // Check validation gates if enabled
    if (this.options.enableValidation && options.phase) {
      const gates = ClaudeMdParser.getValidationGates(this.parsedDoc, options.phase);
      await this.validateGates(gates);
    }

    // Load context through the loader
    return this.contextLoader.load({
      phase: options.phase,
      task: options.task,
      metadata: {
        triggers: Array.from(this.dynamicTriggers)
      }
    });
  }

  /**
   * Validate gates
   */
  private async validateGates(gates: ValidationGate[]): Promise<void> {
    for (const gate of gates) {
      const result = await this.validateGate(gate);
      if (!result.passed) {
        if (this.parsedDoc.metadata.features?.validationStrictMode) {
          throw new Error(`Validation gate '${gate.id}' failed: ${result.errors.join(', ')}`);
        } else {
          console.warn(`⚠️  Validation gate '${gate.id}' failed:`, result.errors);
        }
      }
    }
  }

  /**
   * Validate individual gate
   */
  private async validateGate(gate: ValidationGate): Promise<{
    passed: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    // Check required sections
    if (gate.requires.sections) {
      const availableSections = this.parsedDoc.sections.map((s: any) => s.title);
      gate.requires.sections.forEach(required => {
        if (!availableSections.some((s: string) => 
          s.toLowerCase().includes(required.toLowerCase())
        )) {
          errors.push(`Missing required section: ${required}`);
        }
      });
    }

    // Check required files
    if (gate.requires.files) {
      const fs = require('fs');
      for (const file of gate.requires.files) {
        if (!fs.existsSync(file)) {
          errors.push(`Missing required file: ${file}`);
        }
      }
    }

    // Check previous gates
    if (gate.requires.previousGates) {
      // This would check gate completion status
      // Implementation depends on state management
    }

    // Check conditions
    if (gate.requires.conditions) {
      // This would evaluate custom conditions
      // Implementation depends on condition system
    }

    return {
      passed: errors.length === 0,
      errors
    };
  }

  /**
   * Get effective context configuration
   */
  getEffectiveConfig(): ContextConfig {
    return this.contextLoader.getConfig();
  }

  /**
   * Get section content by ID
   */
  getSectionContent(sectionId: string): string | null {
    const section = this.parsedDoc.sections.find((s: any) => 
      s.title.toLowerCase().replace(/\s+/g, '-') === sectionId.toLowerCase()
    );
    return section ? section.content : null;
  }

  /**
   * Get sections for current context
   */
  getSectionsForContext(layerType: string, qualifier?: string): any[] {
    switch (layerType) {
      case 'global':
        return ClaudeMdParser.getSectionsForLayer(this.parsedDoc, 'global');
      case 'phase':
        return qualifier 
          ? ClaudeMdParser.getSectionsForPhase(this.parsedDoc, qualifier)
          : [];
      case 'task':
        return qualifier
          ? ClaudeMdParser.getSectionsForTask(this.parsedDoc, qualifier)
          : [];
      case 'dynamic':
        return ClaudeMdParser.getDynamicSections(
          this.parsedDoc, 
          Array.from(this.dynamicTriggers)
        );
      default:
        return [];
    }
  }

  /**
   * Update CLAUDE.md content
   */
  async updateSection(sectionId: string, newContent: string): Promise<void> {
    const sectionIndex = this.parsedDoc.sections.findIndex((s: any) =>
      s.title.toLowerCase().replace(/\s+/g, '-') === sectionId.toLowerCase()
    );

    if (sectionIndex >= 0) {
      this.parsedDoc.sections[sectionIndex].content = newContent;
      
      // Export updated document
      ClaudeMdParser.export(this.parsedDoc, this.claudeMdPath);
      
      // Reload if caching is disabled
      if (!this.options.cacheResults) {
        await this.initialize();
      }
    }
  }

  /**
   * Add dynamic trigger
   */
  addDynamicTrigger(trigger: string): void {
    this.dynamicTriggers.add(trigger);
  }

  /**
   * Clear dynamic triggers
   */
  clearDynamicTriggers(): void {
    this.dynamicTriggers.clear();
  }

  /**
   * Get validation gates for phase
   */
  getValidationGates(phase: string): ValidationGate[] {
    return ClaudeMdParser.getValidationGates(this.parsedDoc, phase);
  }

  /**
   * Export current state
   */
  exportState(): {
    config: ContextConfig;
    triggers: string[];
    sections: any[];
  } {
    return {
      config: this.getEffectiveConfig(),
      triggers: Array.from(this.dynamicTriggers),
      sections: this.parsedDoc.sections
    };
  }
}