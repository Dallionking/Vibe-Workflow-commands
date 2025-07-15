/**
 * L1: Global Context Layer Implementation
 * Always active context that provides system-wide rules and configuration
 */

import {
  GlobalContextLayer,
  GlobalContextData,
  GlobalRule,
  GlobalConfiguration,
  UserPreferences,
  ContextPriority,
  ProjectInfo,
  UserProfile,
  ToolConfiguration,
  MCPToolConfig,
  QualityStandard,
  DevelopmentPattern,
  ContextMetadata
} from '../types/context.types';

/**
 * Global Context Manager
 * Manages L1 context that is always active across all phases and tasks
 */
export class GlobalContextManager {
  private globalContext: GlobalContextLayer | null = null;
  private readonly defaultRules: GlobalRule[] = [
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
    },
    {
      id: 'context-preservation',
      name: 'Context Preservation',
      description: 'Maintain project state across all steps',
      rule: 'Always preserve and enhance context between operations',
      enabled: true,
      priority: ContextPriority.HIGH
    },
    {
      id: 'mcp-integration',
      name: 'MCP Integration',
      description: 'Leverage Context7, Perplexity, and other tools systematically',
      rule: 'Use MCP tools in priority order: Context7 → Perplexity → Sequential Thinking → GitHub',
      enabled: true,
      priority: ContextPriority.HIGH
    },
    {
      id: 'professional-output',
      name: 'Professional Output',
      description: 'Generate enterprise-ready documentation automatically',
      rule: 'All outputs must meet enterprise standards with comprehensive documentation',
      enabled: true,
      priority: ContextPriority.MEDIUM
    }
  ];

  private readonly defaultConfiguration: GlobalConfiguration = {
    mcpTools: [
      {
        name: 'Context7',
        enabled: true,
        priority: ContextPriority.CRITICAL,
        configuration: { timeout: 30000, maxRetries: 3 }
      },
      {
        name: 'Perplexity',
        enabled: true,
        priority: ContextPriority.HIGH,
        configuration: { timeout: 45000, maxQueries: 10 }
      },
      {
        name: 'Sequential Thinking',
        enabled: true,
        priority: ContextPriority.HIGH,
        configuration: { maxThoughts: 10, timeout: 60000 }
      },
      {
        name: 'GitHub',
        enabled: true,
        priority: ContextPriority.MEDIUM,
        configuration: { timeout: 30000, maxFiles: 100 }
      }
    ],
    qualityStandards: [
      {
        name: 'Test Coverage',
        description: 'Minimum test coverage requirement',
        criteria: [
          { metric: 'line-coverage', target: 95, required: true },
          { metric: 'branch-coverage', target: 90, required: true },
          { metric: 'function-coverage', target: 95, required: true }
        ],
        threshold: 95
      },
      {
        name: 'Code Quality',
        description: 'Code quality standards',
        criteria: [
          { metric: 'complexity', target: 10, required: true },
          { metric: 'duplication', target: 5, required: true },
          { metric: 'maintainability', target: 80, required: true }
        ],
        threshold: 80
      }
    ],
    developmentPatterns: [
      {
        name: 'Universal Format',
        description: 'Standard format for vertical slices',
        pattern: 'feature → implementation → testing → documentation → integration',
        examples: ['user-auth-slice.md', 'payment-processing-slice.md'],
        applicability: ['all-features', 'vertical-slices']
      },
      {
        name: 'MCP Integration',
        description: 'Pattern for integrating MCP tools',
        pattern: 'validate → research → implement → test → document',
        examples: ['context7-research.ts', 'perplexity-validation.ts'],
        applicability: ['research-tasks', 'validation-tasks']
      }
    ]
  };

  /**
   * Initialize global context with default or provided configuration
   */
  public async initialize(
    projectInfo?: ProjectInfo,
    userProfile?: UserProfile,
    customRules?: GlobalRule[],
    customConfig?: Partial<GlobalConfiguration>
  ): Promise<GlobalContextLayer> {
    const contextId = `global-${Date.now()}`;
    const timestamp = Date.now();

    const globalData: GlobalContextData = {
      systemRules: this.defaultRules.map(rule => rule.rule),
      projectInfo: projectInfo || this.getDefaultProjectInfo(),
      userProfile: userProfile || this.getDefaultUserProfile(),
      toolConfigurations: this.buildToolConfigurations()
    };

    const metadata: ContextMetadata = {
      source: { type: 'global', scope: 'system' },
      priority: ContextPriority.CRITICAL,
      tags: ['global', 'system', 'always-active'],
      dependencies: [],
      created: timestamp,
      lastModified: timestamp
    };

    this.globalContext = {
      id: contextId,
      timestamp,
      version: '1.0.0',
      layer: 'global',
      data: globalData,
      metadata,
      rules: customRules || this.defaultRules,
      configuration: { ...this.defaultConfiguration, ...customConfig },
      preferences: userProfile?.preferences || this.getDefaultUserPreferences()
    };

    return this.globalContext;
  }

  /**
   * Get current global context
   */
  public getContext(): GlobalContextLayer | null {
    return this.globalContext;
  }

  /**
   * Update global context with new data
   */
  public async updateContext(
    updates: Partial<GlobalContextData>,
    newRules?: GlobalRule[],
    configUpdates?: Partial<GlobalConfiguration>
  ): Promise<GlobalContextLayer> {
    if (!this.globalContext) {
      throw new Error('Global context not initialized. Call initialize() first.');
    }

    const timestamp = Date.now();

    // Update data
    this.globalContext.data = {
      ...this.globalContext.data,
      ...updates
    };

    // Update rules if provided
    if (newRules) {
      this.globalContext.rules = newRules;
    }

    // Update configuration if provided
    if (configUpdates) {
      this.globalContext.configuration = {
        ...this.globalContext.configuration,
        ...configUpdates
      };
    }

    // Update metadata
    this.globalContext.metadata.lastModified = timestamp;

    return this.globalContext;
  }

  /**
   * Add or update a global rule
   */
  public addRule(rule: GlobalRule): void {
    if (!this.globalContext) {
      throw new Error('Global context not initialized');
    }

    const existingIndex = this.globalContext.rules.findIndex(r => r.id === rule.id);
    if (existingIndex >= 0) {
      this.globalContext.rules[existingIndex] = rule;
    } else {
      this.globalContext.rules.push(rule);
    }

    this.globalContext.metadata.lastModified = Date.now();
  }

  /**
   * Remove a global rule
   */
  public removeRule(ruleId: string): boolean {
    if (!this.globalContext) {
      throw new Error('Global context not initialized');
    }

    const initialLength = this.globalContext.rules.length;
    this.globalContext.rules = this.globalContext.rules.filter(r => r.id !== ruleId);
    
    if (this.globalContext.rules.length < initialLength) {
      this.globalContext.metadata.lastModified = Date.now();
      return true;
    }
    
    return false;
  }

  /**
   * Get enabled rules sorted by priority
   */
  public getEnabledRules(): GlobalRule[] {
    if (!this.globalContext) {
      return [];
    }

    return this.globalContext.rules
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Export global context for serialization
   */
  public exportContext(): GlobalContextLayer | null {
    return this.globalContext ? { ...this.globalContext } : null;
  }

  /**
   * Import global context from serialized data
   */
  public importContext(context: GlobalContextLayer): void {
    this.globalContext = context;
  }

  // Private helper methods

  private getDefaultProjectInfo(): ProjectInfo {
    return {
      name: 'Vibe Workflow Commands',
      description: 'Advanced AI-assisted development workflow system',
      type: 'library',
      technologies: ['TypeScript', 'Node.js', 'Claude', 'MCP'],
      architecture: 'modular-agent-system'
    };
  }

  private getDefaultUserProfile(): UserProfile {
    return {
      preferences: this.getDefaultUserPreferences(),
      experience: 'advanced',
      focusAreas: ['ai-assistance', 'workflow-automation', 'code-quality']
    };
  }

  private getDefaultUserPreferences(): UserPreferences {
    return {
      codeStyle: {
        indentation: 'spaces',
        spacing: 2,
        lineLength: 100,
        conventions: ['camelCase', 'PascalCase', 'kebab-case-files']
      },
      documentation: {
        format: 'markdown',
        detail: 'comprehensive',
        examples: true
      },
      testing: {
        framework: 'jest',
        coverage: 95,
        types: ['unit', 'integration', 'e2e']
      }
    };
  }

  private buildToolConfigurations(): ToolConfiguration[] {
    return [
      {
        toolName: 'TodoWrite',
        enabled: true,
        priority: ContextPriority.HIGH,
        settings: { autoTrack: true, maxTasks: 50 }
      },
      {
        toolName: 'Bash',
        enabled: true,
        priority: ContextPriority.MEDIUM,
        settings: { timeout: 120000, safeMode: true }
      },
      {
        toolName: 'Read',
        enabled: true,
        priority: ContextPriority.MEDIUM,
        settings: { maxFileSize: 1000000, encoding: 'utf-8' }
      },
      {
        toolName: 'Write',
        enabled: true,
        priority: ContextPriority.MEDIUM,
        settings: { backup: true, validateSyntax: true }
      }
    ];
  }
}

/**
 * Singleton instance for global context management
 */
export const globalContextManager = new GlobalContextManager();