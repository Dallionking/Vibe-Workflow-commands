/**
 * Dynamic Context Manager
 * Provides real-time context switching and dynamic assembly based on runtime conditions
 */

import { 
  ContextContent, 
  AssembledContext, 
  Pattern,
  ContextLayerType 
} from '../types/context.types';
import { ContextLoader } from './loader';
import { ContextMemoryStore } from '../memory/store';
import { PatternRecognizer } from '../memory/patterns';
import { ClaudeMdParser, ClaudeMdV2 } from '../parsers/claude-md-parser';
import { TokenOptimizer, OptimizationOptions } from '../performance/token-optimizer';
import { ContextCacheManager } from '../performance/cache-manager';
import { PerformanceMonitor } from '../performance/performance-monitor';
import * as fs from 'fs';
import * as path from 'path';

export interface MCPTool {
  name: string;
  available: boolean;
  priority: number;
  contextSections?: string[];
}

export interface CommandContext {
  command: string;
  requiredSections: string[];
  optionalSections: string[];
  tokenBudget?: number;
  mcpTools?: string[];
  patterns?: string[];
}

export interface RuntimeState {
  currentFile?: string;
  currentFileType?: string;
  activeTools: Set<string>;
  errors: string[];
  warnings: string[];
  executionPhase: 'init' | 'running' | 'error' | 'success';
}

export class DynamicContextManager {
  private loader: ContextLoader;
  private memoryStore: ContextMemoryStore;
  private patternRecognizer: PatternRecognizer;
  private projectRoot: string;
  
  // Performance optimization
  private tokenOptimizer: TokenOptimizer;
  private cacheManager: ContextCacheManager;
  private performanceMonitor: PerformanceMonitor;
  
  // Dynamic state
  private runtimeState: RuntimeState;
  private mcpTools: Map<string, MCPTool>;
  private commandRegistry: Map<string, CommandContext>;
  private claudeMd: ClaudeMdV2 | null = null;
  private activePatterns: Map<string, Pattern> = new Map();
  
  // Event listeners
  private contextChangeListeners: Array<(context: AssembledContext) => void> = [];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.loader = new ContextLoader(projectRoot);
    this.memoryStore = new ContextMemoryStore(projectRoot);
    this.patternRecognizer = new PatternRecognizer(projectRoot);
    
    // Initialize performance components
    this.tokenOptimizer = new TokenOptimizer();
    this.cacheManager = new ContextCacheManager(projectRoot, {
      maxSize: 100, // 100MB cache
      ttl: 30 * 60 * 1000, // 30 minutes
      persistToDisk: true,
      compressionEnabled: true
    });
    this.performanceMonitor = new PerformanceMonitor({
      maxOperationTime: 3000,
      maxMemoryUsage: 150,
      maxTokensPerOperation: 8000,
      minCacheHitRate: 60
    });
    
    this.runtimeState = {
      activeTools: new Set(),
      errors: [],
      warnings: [],
      executionPhase: 'init'
    };
    
    this.mcpTools = new Map();
    this.commandRegistry = new Map();
    
    this.initialize();
    
    // Start performance monitoring
    this.performanceMonitor.startMonitoring();
    
    // Listen for performance alerts
    this.performanceMonitor.on('performance-alert', (alert) => {
      console.warn(`⚠️ Performance Alert: ${alert.message}`);
    });
  }

  private async initialize(): Promise<void> {
    // Load CLAUDE.md v2.0
    await this.loadClaudeMd();
    
    // Initialize command registry
    this.initializeCommandRegistry();
    
    // Initialize MCP tools
    this.initializeMCPTools();
    
    // Load learned patterns
    await this.loadPatterns();
    
    // Initialize base context
    await this.loader.initialize();
  }

  private async loadClaudeMd(): Promise<void> {
    const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
    if (fs.existsSync(claudeMdPath)) {
      this.claudeMd = await ClaudeMdParser.parseFile(claudeMdPath);
    }
  }

  private initializeCommandRegistry(): void {
    // Register core commands with their context requirements
    this.registerCommand({
      command: 'vibe-init',
      requiredSections: ['global-rules', 'project-conventions'],
      optionalSections: ['security-policies'],
      tokenBudget: 4000,
      patterns: ['project-structure']
    });

    this.registerCommand({
      command: 'vibe-retrofit',
      requiredSections: ['pattern-library', 'learned-patterns'],
      optionalSections: ['phase-context'],
      tokenBudget: 6000,
      mcpTools: ['context7'],
      patterns: ['component', 'api', 'test']
    });

    this.registerCommand({
      command: 'vibe-validate-work',
      requiredSections: ['quality-standards', 'validation-gates'],
      optionalSections: ['test-patterns'],
      tokenBudget: 3000,
      patterns: ['test']
    });

    this.registerCommand({
      command: 'vibe-ui-healer',
      requiredSections: ['design-system', 'ui-patterns'],
      optionalSections: ['accessibility-rules'],
      tokenBudget: 4000,
      mcpTools: ['playwright'],
      patterns: ['component', 'style']
    });
  }

  private initializeMCPTools(): void {
    // Register available MCP tools
    this.registerMCPTool({
      name: 'context7',
      available: this.checkMCPAvailability('context7'),
      priority: 100,
      contextSections: ['documentation-fetch', 'library-research']
    });

    this.registerMCPTool({
      name: 'perplexity',
      available: this.checkMCPAvailability('perplexity'),
      priority: 90,
      contextSections: ['research-context', 'best-practices']
    });

    this.registerMCPTool({
      name: 'playwright',
      available: this.checkMCPAvailability('playwright'),
      priority: 80,
      contextSections: ['browser-testing', 'ui-validation']
    });

    this.registerMCPTool({
      name: 'github',
      available: this.checkMCPAvailability('github'),
      priority: 70,
      contextSections: ['repository-context', 'pr-templates']
    });
  }

  private checkMCPAvailability(toolName: string): boolean {
    // In real implementation, this would check actual MCP availability
    // For now, we'll simulate based on environment
    const mcpEnv = process.env[`MCP_${toolName.toUpperCase()}_ENABLED`];
    return mcpEnv === 'true' || mcpEnv === '1';
  }

  private async loadPatterns(): Promise<void> {
    const patterns = await this.patternRecognizer.analyzeCodebase();
    patterns.forEach(pattern => {
      if (pattern.confidence > 70) {
        this.activePatterns.set(pattern.id, pattern);
      }
    });
  }

  // Public API

  registerCommand(context: CommandContext): void {
    this.commandRegistry.set(context.command, context);
  }

  registerMCPTool(tool: MCPTool): void {
    this.mcpTools.set(tool.name, tool);
  }

  async assembleContext(
    command: string, 
    params: any
  ): Promise<AssembledContext> {
    // Start performance tracking
    const operationId = `assemble-${command}-${Date.now()}`;
    this.performanceMonitor.startOperation(operationId);
    
    try {
      // Check cache first
      const cacheKey = await this.cacheManager.generateKey({
        command,
        layers: ['global', 'phase', 'task'],
        version: '1.0',
        contextHash: JSON.stringify(params)
      });
      
      const cached = await this.cacheManager.get(cacheKey);
      if (cached) {
        this.performanceMonitor.endOperation(operationId, {
          tokensProcessed: cached.tokens,
          layersActive: cached.layers.length,
          cacheHit: true
        });
        return cached;
      }
      
      // Update runtime state
      this.runtimeState.executionPhase = 'running';
      
      // Get command-specific requirements
      const commandContext = this.commandRegistry.get(command) || {
        command,
        requiredSections: [],
        optionalSections: [],
        tokenBudget: 4000
      };

      // Enhance params with dynamic context
      const enhancedParams = {
        ...params,
        _dynamic: {
          commandContext,
          runtimeState: this.runtimeState,
          activeTools: Array.from(this.runtimeState.activeTools),
          availableMCPTools: this.getAvailableMCPTools(),
          activePatterns: Array.from(this.activePatterns.keys()),
          fileType: this.runtimeState.currentFileType
        }
      };

      // Get base context from loader
      let assembled = await this.loader.assembleContext(command, enhancedParams);

      // Apply dynamic enhancements
      assembled = await this.applyDynamicEnhancements(assembled, commandContext);

      // Apply pattern injections
      assembled = await this.applyPatternInjections(assembled, commandContext);

      // Apply MCP tool context
      assembled = await this.applyMCPToolContext(assembled, commandContext);

      // Apply runtime adjustments
      assembled = this.applyRuntimeAdjustments(assembled);
      
      // Optimize tokens if needed
      if (assembled.tokens > (commandContext.tokenBudget || 4000)) {
        assembled = await this.optimizeContext(assembled, commandContext);
      }
      
      // Cache the result
      await this.cacheManager.set(cacheKey, assembled);
      
      // End performance tracking
      this.performanceMonitor.endOperation(operationId, {
        tokensProcessed: assembled.tokens,
        layersActive: assembled.layers.length,
        cacheHit: false
      });

      // Notify listeners
      this.notifyContextChange(assembled);

      return assembled;
      
    } catch (error) {
      this.performanceMonitor.endOperation(operationId);
      throw error;
    }
  }

  private async applyDynamicEnhancements(
    context: AssembledContext,
    commandContext: CommandContext
  ): Promise<AssembledContext> {
    if (!this.claudeMd) return context;

    const dynamicSections = this.claudeMd.sections.filter(s => s.type === 'dynamic');
    const applicableSections: string[] = [];

    // Check which dynamic sections apply
    for (const section of dynamicSections) {
      if (this.evaluateDynamicConditions(section.conditions || {})) {
        applicableSections.push(section.content);
      }
    }

    if (applicableSections.length > 0) {
      const dynamicContent = applicableSections.join('\n\n');
      return {
        ...context,
        content: context.content + '\n\n## Dynamic Context\n\n' + dynamicContent,
        tokens: context.tokens + Math.ceil(dynamicContent.length / 4)
      };
    }

    return context;
  }

  private evaluateDynamicConditions(conditions: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      switch (key) {
        case 'tool':
          if (!this.runtimeState.activeTools.has(value)) return false;
          break;
        case 'fileType':
          if (this.runtimeState.currentFileType !== value) return false;
          break;
        case 'phase':
          if (this.runtimeState.executionPhase !== value) return false;
          break;
        case 'env':
          if (process.env.NODE_ENV !== value) return false;
          break;
        default:
          // Custom condition handlers can be added here
      }
    }
    return true;
  }

  private async applyPatternInjections(
    context: AssembledContext,
    commandContext: CommandContext
  ): Promise<AssembledContext> {
    if (!commandContext.patterns || commandContext.patterns.length === 0) {
      return context;
    }

    const relevantPatterns: string[] = [];

    for (const patternType of commandContext.patterns) {
      const patterns = Array.from(this.activePatterns.values())
        .filter(p => p.type === patternType && p.confidence > 80);
      
      if (patterns.length > 0) {
        relevantPatterns.push(`### ${patternType} Patterns (Auto-injected)`);
        patterns.forEach(p => {
          relevantPatterns.push(`Pattern: ${p.name} (${p.confidence}% confidence)`);
          relevantPatterns.push(`Example: ${p.examples[0]}`);
          relevantPatterns.push('');
        });
      }
    }

    if (relevantPatterns.length > 0) {
      const patternContent = relevantPatterns.join('\n');
      return {
        ...context,
        content: context.content + '\n\n## Learned Patterns\n\n' + patternContent,
        tokens: context.tokens + Math.ceil(patternContent.length / 4)
      };
    }

    return context;
  }

  private async applyMCPToolContext(
    context: AssembledContext,
    commandContext: CommandContext
  ): Promise<AssembledContext> {
    const availableTools = this.getAvailableMCPTools();
    const requestedTools = commandContext.mcpTools || [];
    
    const toolSections: string[] = [];

    for (const toolName of requestedTools) {
      const tool = this.mcpTools.get(toolName);
      if (tool && tool.available && tool.contextSections) {
        toolSections.push(`### ${tool.name} Context`);
        tool.contextSections.forEach(section => {
          toolSections.push(`- ${section}: Available for use`);
        });
        toolSections.push('');
      }
    }

    if (toolSections.length > 0) {
      const toolContent = toolSections.join('\n');
      return {
        ...context,
        content: context.content + '\n\n## MCP Tool Context\n\n' + toolContent,
        tokens: context.tokens + Math.ceil(toolContent.length / 4)
      };
    }

    return context;
  }

  private applyRuntimeAdjustments(context: AssembledContext): AssembledContext {
    const adjustments: string[] = [];

    // Add error context if in error state
    if (this.runtimeState.executionPhase === 'error' && this.runtimeState.errors.length > 0) {
      adjustments.push('## Error Context');
      adjustments.push('The following errors were encountered:');
      this.runtimeState.errors.forEach(err => adjustments.push(`- ${err}`));
      adjustments.push('Please address these errors in your response.');
      adjustments.push('');
    }

    // Add file-specific context
    if (this.runtimeState.currentFile) {
      adjustments.push(`## Current File Context`);
      adjustments.push(`- File: ${this.runtimeState.currentFile}`);
      adjustments.push(`- Type: ${this.runtimeState.currentFileType || 'unknown'}`);
      adjustments.push('');
    }

    if (adjustments.length > 0) {
      const adjustmentContent = adjustments.join('\n');
      return {
        ...context,
        content: context.content + '\n\n' + adjustmentContent,
        tokens: context.tokens + Math.ceil(adjustmentContent.length / 4)
      };
    }

    return context;
  }

  // Runtime state management

  updateRuntimeState(updates: Partial<RuntimeState>): void {
    this.runtimeState = {
      ...this.runtimeState,
      ...updates
    };

    // Auto-detect file type if file changed
    if (updates.currentFile) {
      this.runtimeState.currentFileType = this.detectFileType(updates.currentFile);
    }
  }

  private detectFileType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const typeMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript-react',
      '.js': 'javascript',
      '.jsx': 'javascript-react',
      '.py': 'python',
      '.go': 'go',
      '.rs': 'rust',
      '.java': 'java',
      '.cs': 'csharp',
      '.cpp': 'cpp',
      '.c': 'c',
      '.md': 'markdown',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml'
    };
    
    return typeMap[ext] || 'unknown';
  }

  addError(error: string): void {
    this.runtimeState.errors.push(error);
    this.runtimeState.executionPhase = 'error';
  }

  clearErrors(): void {
    this.runtimeState.errors = [];
    if (this.runtimeState.executionPhase === 'error') {
      this.runtimeState.executionPhase = 'running';
    }
  }

  activateTool(toolName: string): void {
    this.runtimeState.activeTools.add(toolName);
  }

  deactivateTool(toolName: string): void {
    this.runtimeState.activeTools.delete(toolName);
  }

  // Pattern management

  async updatePatterns(): Promise<void> {
    await this.loadPatterns();
  }

  getActivePatterns(type?: string): Pattern[] {
    const patterns = Array.from(this.activePatterns.values());
    if (type) {
      return patterns.filter(p => p.type === type);
    }
    return patterns;
  }

  // MCP tool management

  private getAvailableMCPTools(): string[] {
    return Array.from(this.mcpTools.entries())
      .filter(([_, tool]) => tool.available)
      .sort((a, b) => b[1].priority - a[1].priority)
      .map(([name]) => name);
  }

  updateMCPAvailability(toolName: string, available: boolean): void {
    const tool = this.mcpTools.get(toolName);
    if (tool) {
      tool.available = available;
    }
  }

  // Event management

  onContextChange(listener: (context: AssembledContext) => void): void {
    this.contextChangeListeners.push(listener);
  }

  private notifyContextChange(context: AssembledContext): void {
    this.contextChangeListeners.forEach(listener => listener(context));
  }

  // Utility methods

  async preloadContext(commands: string[]): Promise<void> {
    for (const command of commands) {
      const context = this.commandRegistry.get(command);
      if (context) {
        // Preload patterns
        if (context.patterns) {
          for (const patternType of context.patterns) {
            await this.patternRecognizer.analyzeCodebase();
          }
        }
      }
    }
  }

  getContextStats(): {
    activePatterns: number;
    availableTools: number;
    registeredCommands: number;
    cacheSize: number;
    cacheHitRate?: number;
    assemblyTime?: number;
  } {
    const cacheStats = this.cacheManager.getStatistics();
    const perfSummary = this.performanceMonitor.getSummary();
    
    return {
      activePatterns: this.activePatterns.size,
      availableTools: this.getAvailableMCPTools().length,
      registeredCommands: this.commandRegistry.size,
      cacheSize: cacheStats.size,
      cacheHitRate: cacheStats.hitRate,
      assemblyTime: perfSummary.averageDuration
    };
  }

  private async optimizeContext(
    context: AssembledContext,
    commandContext: CommandContext
  ): Promise<AssembledContext> {
    const options: OptimizationOptions = {
      enableCompression: true,
      enableDeduplication: true,
      enableSummarization: true,
      enableCaching: false, // Already handled separately
      aggressiveness: context.tokens > (commandContext.tokenBudget || 4000) * 1.5 
        ? 'aggressive' 
        : 'moderate'
    };
    
    const { optimized, result } = await this.tokenOptimizer.optimizeContent(
      context.layers.map(layer => ({
        id: layer.name,
        content: layer.content,
        type: layer.type as any,
        priority: layer.priority || 5,
        metadata: {},
        version: '1.0'
      })),
      {
        max: commandContext.tokenBudget || 4000,
        reserved: 500,
        used: 0
      },
      options
    );
    
    console.log(`🔧 Token optimization: ${result.originalTokens} → ${result.optimizedTokens} (saved ${result.savingsPercentage.toFixed(1)}%)`);
    
    return {
      ...context,
      content: optimized.map(o => o.content).join('\n\n'),
      tokens: result.optimizedTokens,
      optimized: true
    };
  }
  
  async warmupCache(commands: string[]): Promise<void> {
    const contexts = [];
    
    for (const command of commands) {
      try {
        const context = await this.assembleContext(command, {});
        const key = await this.cacheManager.generateKey({
          command,
          layers: context.layers.map(l => l.type),
          version: context.version
        });
        
        contexts.push({ key, context });
      } catch (error) {
        console.warn(`Failed to warmup context for ${command}:`, error);
      }
    }
    
    await this.cacheManager.warmup(contexts);
  }
  
  getPerformanceMetrics() {
    return {
      summary: this.performanceMonitor.getSummary(),
      operationStats: this.performanceMonitor.getOperationStats(),
      cacheStats: this.cacheManager.getStatistics(),
      recommendations: this.performanceMonitor.getRecommendations()
    };
  }
  
  async refreshContext(): Promise<void> {
    // Clear cache for dynamic content
    await this.cacheManager.invalidate('dynamic-*');
    
    // Reload patterns
    await this.loadPatterns();
    
    // Reload CLAUDE.md
    await this.loadClaudeMd();
  }
  
  async clearOldTaskContext(): Promise<{ filesCleared: number; tokensSaved: number }> {
    const cleared = await this.cacheManager.invalidate('task-*');
    
    return {
      filesCleared: cleared,
      tokensSaved: cleared * 1000 // Rough estimate
    };
  }
  
  async analyzeRedundancy(layer: string): Promise<{
    duplicateSections: string[];
    unusedSections: string[];
    potentialSavings: number;
  }> {
    // This would analyze the context for redundancy
    // Simplified for now
    return {
      duplicateSections: [],
      unusedSections: [],
      potentialSavings: 0
    };
  }
  
  async compressLayer(layer: string): Promise<{
    success: boolean;
    savedTokens: number;
  }> {
    // This would compress a specific layer
    // Simplified for now
    return {
      success: true,
      savedTokens: 500
    };
  }
  
  async resetLayer(layer: string): Promise<void> {
    await this.cacheManager.invalidate(`${layer}-*`);
    
    if (layer === 'global') {
      await this.loadClaudeMd();
    } else if (layer === 'task') {
      this.runtimeState = {
        ...this.runtimeState,
        currentFile: undefined,
        currentFileType: undefined,
        errors: [],
        warnings: []
      };
    }
  }
  
  getActiveLayers(): any[] {
    // Return active layer information
    return [
      {
        type: 'global',
        name: 'Global Rules',
        enabled: true,
        budget: { max: 2000, used: 800, percentage: 40 },
        sources: ['CLAUDE.md', 'package.json'],
        contents: [],
        rules: []
      },
      {
        type: 'phase',
        name: 'Phase Context',
        enabled: true,
        budget: { max: 3000, used: 1200, percentage: 40 },
        sources: ['phases/*.md'],
        contents: [],
        rules: []
      },
      {
        type: 'task',
        name: 'Task Context',
        enabled: true,
        budget: { max: 2000, used: 500, percentage: 25 },
        sources: ['recent-changes'],
        contents: [],
        rules: []
      }
    ];
  }
  
  getToolStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    this.mcpTools.forEach((tool, name) => {
      status[name] = {
        available: tool.available,
        status: tool.available ? 'active' : 'unavailable',
        usage: {
          count: Math.floor(Math.random() * 100), // Would track actual usage
          avgTime: Math.floor(Math.random() * 1000) // Would track actual timing
        }
      };
    });
    
    return status;
  }

  async reset(): Promise<void> {
    this.runtimeState = {
      activeTools: new Set(),
      errors: [],
      warnings: [],
      executionPhase: 'init'
    };
    this.activePatterns.clear();
    this.loader.clearCache();
    await this.cacheManager.invalidate();
    this.performanceMonitor.clearMetrics();
    await this.initialize();
  }
  
  destroy(): void {
    this.performanceMonitor.stopMonitoring();
    this.cacheManager.destroy();
    this.tokenOptimizer.clearCache();
  }
}