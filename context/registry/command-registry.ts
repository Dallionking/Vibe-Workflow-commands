/**
 * Command Context Registry
 * Central registry for all Vibe commands and their context requirements
 */

import { CommandContext } from '../assembly/dynamic-context-manager';

export class CommandContextRegistry {
  private static registry: Map<string, CommandContext> = new Map();
  
  static initialize(): void {
    // Core Vibe Commands
    this.registerVibeInitCommands();
    this.registerVibeStepCommands();
    this.registerVibeRetrofitCommands();
    this.registerVibeValidationCommands();
    this.registerVibeUtilityCommands();
  }

  private static registerVibeInitCommands(): void {
    this.registry.set('vibe-init', {
      command: 'vibe-init',
      requiredSections: [
        'global-rules',
        'project-conventions',
        'quality-standards',
        'security-policies'
      ],
      optionalSections: [
        'project-structure',
        'git-configuration'
      ],
      tokenBudget: 4000,
      patterns: ['project-structure']
    });

    this.registry.set('vibe-clean-slate', {
      command: 'vibe-clean-slate',
      requiredSections: [
        'project-conventions',
        'clean-slate-rules'
      ],
      optionalSections: [],
      tokenBudget: 2000
    });
  }

  private static registerVibeStepCommands(): void {
    // Step 1: Ideation
    this.registry.set('vibe-step-1-ideation', {
      command: 'vibe-step-1-ideation',
      requiredSections: [
        'ideation-guidelines',
        'research-methods'
      ],
      optionalSections: [
        'market-analysis',
        'user-research'
      ],
      tokenBudget: 5000,
      mcpTools: ['perplexity', 'context7'],
      patterns: []
    });

    // Step 2: Architecture
    this.registry.set('vibe-step-2-architecture', {
      command: 'vibe-step-2-architecture',
      requiredSections: [
        'architecture-principles',
        'system-design',
        'previous-ideation'
      ],
      optionalSections: [
        'scalability-patterns',
        'security-architecture'
      ],
      tokenBudget: 6000,
      mcpTools: ['context7'],
      patterns: ['architecture', 'api']
    });

    // Step 3: Project Setup
    this.registry.set('vibe-step-3-project-setup', {
      command: 'vibe-step-3-project-setup',
      requiredSections: [
        'project-structure',
        'dependency-management',
        'development-environment'
      ],
      optionalSections: [
        'ci-cd-setup',
        'docker-configuration'
      ],
      tokenBudget: 4000,
      patterns: ['project-structure']
    });

    // Step 4: UI/UX Principles
    this.registry.set('vibe-step-4-ui-ux-principles', {
      command: 'vibe-step-4-ui-ux-principles',
      requiredSections: [
        'design-principles',
        'user-experience',
        'accessibility-standards'
      ],
      optionalSections: [
        'design-system',
        'component-library'
      ],
      tokenBudget: 5000,
      mcpTools: ['perplexity'],
      patterns: ['component', 'style']
    });

    // Step 5: Detailed Design
    this.registry.set('vibe-step-5-detailed-ui-ux-design', {
      command: 'vibe-step-5-detailed-ui-ux-design',
      requiredSections: [
        'design-specifications',
        'component-designs',
        'interaction-flows'
      ],
      optionalSections: [
        'animation-guidelines',
        'responsive-design'
      ],
      tokenBudget: 6000,
      patterns: ['component', 'style']
    });

    // Step 6: Backend Design
    this.registry.set('vibe-step-6-backend-design', {
      command: 'vibe-step-6-backend-design',
      requiredSections: [
        'api-design',
        'database-schema',
        'backend-architecture'
      ],
      optionalSections: [
        'microservices',
        'message-queues'
      ],
      tokenBudget: 6000,
      mcpTools: ['context7'],
      patterns: ['api', 'database']
    });

    // Step 7: Phases
    this.registry.set('vibe-step-7-phases', {
      command: 'vibe-step-7-phases',
      requiredSections: [
        'phase-planning',
        'milestone-definition',
        'dependency-mapping'
      ],
      optionalSections: [
        'risk-assessment',
        'timeline-estimation'
      ],
      tokenBudget: 5000,
      patterns: []
    });

    // Step 8: Refinement
    this.registry.set('vibe-step-8-refinement', {
      command: 'vibe-step-8-refinement',
      requiredSections: [
        'refinement-criteria',
        'quality-metrics',
        'previous-outputs'
      ],
      optionalSections: [
        'performance-optimization',
        'security-hardening'
      ],
      tokenBudget: 5000,
      patterns: []
    });

    // Step 9: Review
    this.registry.set('vibe-step-9-review', {
      command: 'vibe-step-9-review',
      requiredSections: [
        'review-checklist',
        'quality-gates',
        'all-previous-outputs'
      ],
      optionalSections: [
        'stakeholder-feedback',
        'compliance-check'
      ],
      tokenBudget: 7000,
      patterns: []
    });

    // Step 10: Coding
    this.registry.set('vibe-step-10-coding', {
      command: 'vibe-step-10-coding',
      requiredSections: [
        'coding-standards',
        'implementation-guide',
        'phase-documents'
      ],
      optionalSections: [
        'code-templates',
        'testing-strategy'
      ],
      tokenBudget: 8000,
      mcpTools: ['github'],
      patterns: ['component', 'api', 'test']
    });
  }

  private static registerVibeRetrofitCommands(): void {
    this.registry.set('vibe-retrofit', {
      command: 'vibe-retrofit',
      requiredSections: [
        'pattern-detection',
        'compatibility-requirements',
        'existing-codebase'
      ],
      optionalSections: [
        'migration-strategy',
        'deprecation-plan'
      ],
      tokenBudget: 6000,
      mcpTools: ['context7'],
      patterns: ['component', 'api', 'test', 'structure']
    });

    this.registry.set('vibe-retrofit-analyze', {
      command: 'vibe-retrofit-analyze',
      requiredSections: [
        'codebase-analysis',
        'pattern-recognition'
      ],
      optionalSections: [
        'tech-debt-assessment'
      ],
      tokenBudget: 5000,
      patterns: ['component', 'api', 'test', 'structure']
    });

    this.registry.set('vibe-retrofit-plan', {
      command: 'vibe-retrofit-plan',
      requiredSections: [
        'retrofit-strategy',
        'phase-breakdown',
        'risk-mitigation'
      ],
      optionalSections: [
        'rollback-plan'
      ],
      tokenBudget: 5000
    });

    this.registry.set('vibe-retrofit-implement', {
      command: 'vibe-retrofit-implement',
      requiredSections: [
        'implementation-steps',
        'compatibility-layer',
        'testing-strategy'
      ],
      optionalSections: [
        'performance-impact'
      ],
      tokenBudget: 6000,
      patterns: ['component', 'api', 'test']
    });
  }

  private static registerVibeValidationCommands(): void {
    this.registry.set('vibe-validate-work', {
      command: 'vibe-validate-work',
      requiredSections: [
        'validation-criteria',
        'quality-standards',
        'test-requirements'
      ],
      optionalSections: [
        'performance-metrics',
        'security-checks'
      ],
      tokenBudget: 4000,
      patterns: ['test']
    });

    this.registry.set('vibe-ui-healer', {
      command: 'vibe-ui-healer',
      requiredSections: [
        'design-system',
        'ui-standards',
        'accessibility-rules'
      ],
      optionalSections: [
        'browser-compatibility',
        'responsive-breakpoints'
      ],
      tokenBudget: 5000,
      mcpTools: ['playwright'],
      patterns: ['component', 'style']
    });

    this.registry.set('vibe-test-runner', {
      command: 'vibe-test-runner',
      requiredSections: [
        'test-configuration',
        'coverage-requirements'
      ],
      optionalSections: [
        'test-patterns',
        'mock-strategies'
      ],
      tokenBudget: 3000,
      patterns: ['test']
    });

    this.registry.set('vibe-validate-phase', {
      command: 'vibe-validate-phase',
      requiredSections: [
        'phase-requirements',
        'completion-criteria',
        'validation-gates'
      ],
      optionalSections: [
        'stakeholder-signoff'
      ],
      tokenBudget: 4000
    });
  }

  private static registerVibeUtilityCommands(): void {
    this.registry.set('vibe-status', {
      command: 'vibe-status',
      requiredSections: [
        'project-state',
        'current-phase'
      ],
      optionalSections: [
        'recent-changes'
      ],
      tokenBudget: 2000
    });

    this.registry.set('vibe-phase', {
      command: 'vibe-phase',
      requiredSections: [
        'phase-navigation',
        'phase-context'
      ],
      optionalSections: [],
      tokenBudget: 2000
    });

    this.registry.set('vibe-context', {
      command: 'vibe-context',
      requiredSections: [
        'context-management',
        'memory-status'
      ],
      optionalSections: [
        'pattern-library'
      ],
      tokenBudget: 3000
    });

    this.registry.set('vibe-learn', {
      command: 'vibe-learn',
      requiredSections: [
        'learning-system',
        'pattern-recognition'
      ],
      optionalSections: [
        'optimization-suggestions'
      ],
      tokenBudget: 3000
    });

    this.registry.set('vibe-reformat-phases', {
      command: 'vibe-reformat-phases',
      requiredSections: [
        'phase-format',
        'migration-rules'
      ],
      optionalSections: [],
      tokenBudget: 2000
    });

    this.registry.set('vibe-export', {
      command: 'vibe-export',
      requiredSections: [
        'export-formats',
        'documentation-standards'
      ],
      optionalSections: [
        'template-customization'
      ],
      tokenBudget: 3000
    });

    this.registry.set('vibe-help', {
      command: 'vibe-help',
      requiredSections: [
        'command-reference',
        'usage-examples'
      ],
      optionalSections: [
        'troubleshooting'
      ],
      tokenBudget: 2000
    });
  }

  static get(command: string): CommandContext | undefined {
    return this.registry.get(command);
  }

  static getAll(): Map<string, CommandContext> {
    return new Map(this.registry);
  }

  static register(context: CommandContext): void {
    this.registry.set(context.command, context);
  }

  static getCommandsByMCPTool(toolName: string): CommandContext[] {
    return Array.from(this.registry.values()).filter(
      context => context.mcpTools?.includes(toolName)
    );
  }

  static getCommandsByPattern(patternType: string): CommandContext[] {
    return Array.from(this.registry.values()).filter(
      context => context.patterns?.includes(patternType)
    );
  }

  static getRequiredSections(command: string): string[] {
    const context = this.registry.get(command);
    return context?.requiredSections || [];
  }

  static getTokenBudget(command: string): number {
    const context = this.registry.get(command);
    return context?.tokenBudget || 4000; // Default budget
  }

  static export(): Record<string, CommandContext> {
    const exported: Record<string, CommandContext> = {};
    this.registry.forEach((value, key) => {
      exported[key] = value;
    });
    return exported;
  }
}

// Initialize on load
CommandContextRegistry.initialize();