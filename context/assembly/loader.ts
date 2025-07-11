/**
 * Context Loader
 * Dynamically loads and assembles context from all layers
 */

import { 
  ContextLayer, 
  ContextContent, 
  AssembledContext, 
  AssemblyContext,
  ContextLayerType,
  TokenBudget 
} from '../types/context.types';
import { GlobalContextLayer } from '../layers/global';
import { PhaseContextLayer } from '../layers/phase';
import { TaskContextLayer } from '../layers/task';
import { ContextPrioritizer } from './prioritizer';
import { ContextValidator } from './validator';
import * as path from 'path';

export class ContextLoader {
  private globalLayer: GlobalContextLayer;
  private phaseLayer: PhaseContextLayer;
  private taskLayer: TaskContextLayer;
  private prioritizer: ContextPrioritizer;
  private validator: ContextValidator;
  private projectRoot: string;
  private cache: Map<string, AssembledContext> = new Map();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    
    // Initialize layers
    this.globalLayer = new GlobalContextLayer(projectRoot);
    this.phaseLayer = new PhaseContextLayer(projectRoot);
    this.taskLayer = new TaskContextLayer(projectRoot);
    
    // Initialize helpers
    this.prioritizer = new ContextPrioritizer();
    this.validator = new ContextValidator();
  }

  async initialize(): Promise<void> {
    // Load global context once
    await this.globalLayer.load();
  }

  async loadGlobalContext(): Promise<ContextLayer> {
    await this.globalLayer.refresh();
    return this.globalLayer;
  }

  async loadPhaseContext(phase: string): Promise<ContextLayer> {
    this.phaseLayer.setPhase(phase);
    await this.phaseLayer.load(phase);
    return this.phaseLayer;
  }

  async loadTaskContext(task: string, params?: Record<string, any>): Promise<ContextLayer> {
    this.taskLayer.setTask(task);
    await this.taskLayer.load(task, params);
    return this.taskLayer;
  }

  async assembleContext(command: string, params: any): Promise<AssembledContext> {
    const startTime = Date.now();
    
    // Check cache first
    const cacheKey = this.getCacheKey(command, params);
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return {
        ...cached,
        performance: {
          ...cached.performance,
          cacheHit: true,
          assemblyTime: Date.now() - startTime
        }
      };
    }

    // Create assembly context
    const assemblyContext: AssemblyContext = {
      command,
      params,
      currentPhase: params.phase,
      currentTask: params.task || command,
      tokenBudget: {
        total: 8000, // Default token budget
        used: 0,
        reserved: 0,
        available: 8000
      }
    };

    // Load all layers
    const layers: ContextLayer[] = [];
    
    // Always include global
    layers.push(await this.loadGlobalContext());
    
    // Include phase if specified
    if (assemblyContext.currentPhase) {
      layers.push(await this.loadPhaseContext(assemblyContext.currentPhase));
    }
    
    // Include task context
    layers.push(await this.loadTaskContext(assemblyContext.currentTask || command, params));

    // Validate layers
    const validationResults = await Promise.all(
      layers.map(layer => this.validator.validateLayer(layer))
    );
    
    // Check for critical errors
    const criticalErrors = validationResults
      .flatMap(result => result.errors)
      .filter(error => error.severity === 'critical');
    
    if (criticalErrors.length > 0) {
      throw new Error(`Context validation failed: ${criticalErrors[0].message}`);
    }

    // Prioritize and assemble content
    const allContents = layers.flatMap(layer => layer.contents);
    const prioritizedContents = this.prioritizer.prioritize(
      allContents, 
      assemblyContext.tokenBudget
    );

    // Build final context
    const contextSections = this.buildContextSections(prioritizedContents, layers);
    const assembledContent = this.formatContext(contextSections);
    
    // Calculate metrics
    const tokenCount = Math.ceil(assembledContent.length / 4);
    const compressionRatio = this.calculateCompressionRatio(allContents, prioritizedContents);

    const assembled: AssembledContext = {
      content: assembledContent,
      tokens: tokenCount,
      layers: layers.map(l => l.name),
      metadata: {
        source: 'context-assembly',
        timestamp: new Date(),
        version: '1.0',
        tags: ['assembled', command]
      },
      performance: {
        assemblyTime: Date.now() - startTime,
        compressionRatio,
        cacheHit: false,
        tokenEfficiency: tokenCount / assemblyContext.tokenBudget.total
      }
    };

    // Cache the result
    this.cache.set(cacheKey, assembled);
    
    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    return assembled;
  }

  private buildContextSections(
    contents: ContextContent[], 
    layers: ContextLayer[]
  ): Record<string, string> {
    const sections: Record<string, string> = {};

    // Group by type and layer
    const groups = new Map<string, ContextContent[]>();
    
    contents.forEach(content => {
      const key = `${content.layer}-${content.type}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(content);
    });

    // Build sections
    groups.forEach((items, key) => {
      const [layer, type] = key.split('-');
      const sectionName = this.getSectionName(layer as ContextLayerType, type);
      sections[sectionName] = items.map(item => item.content).join('\n\n');
    });

    return sections;
  }

  private getSectionName(layer: ContextLayerType, type: string): string {
    const names: Record<string, string> = {
      'global-instruction': 'Global Rules and Standards',
      'global-knowledge': 'Project Configuration',
      'phase-instruction': 'Phase Requirements',
      'phase-knowledge': 'Phase Context',
      'phase-pattern': 'Learned Patterns',
      'task-instruction': 'Task Instructions',
      'task-knowledge': 'Current Context'
    };
    
    return names[`${layer}-${type}`] || `${layer} ${type}`;
  }

  private formatContext(sections: Record<string, string>): string {
    const formatted: string[] = [
      '# Assembled Context for Current Task',
      '',
      'This context has been dynamically assembled from multiple layers to provide the most relevant information for the current task.',
      ''
    ];

    // Order sections by importance
    const sectionOrder = [
      'Task Instructions',
      'Phase Requirements',
      'Global Rules and Standards',
      'Current Context',
      'Phase Context',
      'Learned Patterns',
      'Project Configuration'
    ];

    sectionOrder.forEach(sectionName => {
      if (sections[sectionName]) {
        formatted.push(`## ${sectionName}`);
        formatted.push('');
        formatted.push(sections[sectionName]);
        formatted.push('');
      }
    });

    // Add any remaining sections
    Object.entries(sections).forEach(([name, content]) => {
      if (!sectionOrder.includes(name)) {
        formatted.push(`## ${name}`);
        formatted.push('');
        formatted.push(content);
        formatted.push('');
      }
    });

    return formatted.join('\n');
  }

  private getCacheKey(command: string, params: any): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join(',');
    return `${command}:${sortedParams}`;
  }

  private isCacheValid(cached: AssembledContext): boolean {
    const maxAge = 5 * 60 * 1000; // 5 minutes
    const age = Date.now() - cached.metadata.timestamp.getTime();
    return age < maxAge;
  }

  private calculateCompressionRatio(
    original: ContextContent[], 
    compressed: ContextContent[]
  ): number {
    const originalTokens = original.reduce((sum, c) => sum + (c.tokens || 0), 0);
    const compressedTokens = compressed.reduce((sum, c) => sum + (c.tokens || 0), 0);
    
    if (originalTokens === 0) return 1;
    return compressedTokens / originalTokens;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number, keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}