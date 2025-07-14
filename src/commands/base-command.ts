/**
 * Base Command Class
 * Foundation for all context-enhanced Vibe commands
 */

import { DynamicContextManager } from '../../context/assembly/dynamic-context-manager';
import { VibeCommandEnhancer } from '../../context/integration/vibe-command-enhancer';
import { VibeValidationSystem } from '../../context/validation/validation-integration';
import { AssembledContext } from '../../context/types/context.types';
import * as fs from 'fs';
import * as path from 'path';

export interface CommandParams {
  [key: string]: any;
  _context?: AssembledContext;
  _contextStats?: any;
}

export interface CommandResult {
  success: boolean;
  output?: string;
  data?: any;
  error?: string;
  metrics?: Record<string, number>;
}

export interface CommandOptions {
  name: string;
  description: string;
  contextRequired?: boolean;
  tokenBudget?: number;
  mcpTools?: string[];
  patterns?: string[];
}

export abstract class BaseCommand {
  protected name: string;
  protected description: string;
  protected contextRequired: boolean;
  protected tokenBudget: number;
  protected mcpTools: string[];
  protected patterns: string[];
  
  protected dynamicManager?: DynamicContextManager;
  protected validationSystem?: VibeValidationSystem;
  protected projectRoot: string;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.contextRequired = options.contextRequired ?? true;
    this.tokenBudget = options.tokenBudget ?? 4000;
    this.mcpTools = options.mcpTools ?? [];
    this.patterns = options.patterns ?? [];
    
    // Detect project root
    this.projectRoot = this.detectProjectRoot();
    
    // Initialize context systems if enabled
    if (this.contextRequired && this.isContextEnabled()) {
      this.initializeContextSystems();
    }
  }

  private detectProjectRoot(): string {
    // Try to find project root by looking for key files
    let currentDir = process.cwd();
    
    while (currentDir !== path.dirname(currentDir)) {
      if (fs.existsSync(path.join(currentDir, 'package.json')) ||
          fs.existsSync(path.join(currentDir, '.git')) ||
          fs.existsSync(path.join(currentDir, 'CLAUDE.md'))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    
    // Default to current directory
    return process.cwd();
  }

  private isContextEnabled(): boolean {
    // Check environment variable or configuration
    return process.env.VIBE_CONTEXT_ENABLED !== 'false';
  }

  private initializeContextSystems(): void {
    try {
      this.dynamicManager = new DynamicContextManager(this.projectRoot);
      this.validationSystem = new VibeValidationSystem(this.projectRoot);
    } catch (error) {
      console.warn('Context systems initialization failed:', error);
      console.warn('Falling back to legacy mode');
    }
  }

  /**
   * Main execution method - handles context enhancement
   */
  async execute(params: CommandParams): Promise<CommandResult> {
    const startTime = Date.now();
    let result: CommandResult;

    try {
      // Pre-execution validation
      if (this.validationSystem) {
        const validation = await this.validationSystem.executeCommand(
          this.name,
          params,
          { skipPostValidation: true }
        );
        
        if (!validation.success) {
          return {
            success: false,
            error: 'Pre-execution validation failed',
            output: validation.validationReport
          };
        }
      }

      // Execute with or without context
      if (this.contextRequired && params._context) {
        result = await this.executeWithContext(params);
      } else {
        result = await this.executeLegacy(params);
      }

      // Post-execution validation
      if (this.validationSystem && result.success) {
        const validation = await this.validationSystem.executeCommand(
          this.name,
          params,
          { 
            skipPreValidation: true,
            reportFormat: 'markdown'
          }
        );
        
        if (!validation.success) {
          result.output = (result.output || '') + '\n\n' + validation.validationReport;
        }
      }

      // Add performance metrics
      result.metrics = {
        ...(result.metrics || {}),
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      result = {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }

    return result;
  }

  /**
   * Execute command with context enhancement
   */
  protected async executeWithContext(params: CommandParams): Promise<CommandResult> {
    // Extract context information
    const context = params._context!;
    const contextStats = params._contextStats;
    
    console.log(`\n🧠 Executing ${this.name} with context enhancement`);
    console.log(`   Context tokens: ${context.tokens}`);
    console.log(`   Active patterns: ${contextStats?.activePatterns || 0}`);
    console.log(`   Available tools: ${contextStats?.availableTools || 0}`);
    
    // Call implementation
    return this.implement(params);
  }

  /**
   * Execute command in legacy mode
   */
  protected async executeLegacy(params: CommandParams): Promise<CommandResult> {
    console.log(`\n📟 Executing ${this.name} in legacy mode`);
    return this.implement(params);
  }

  /**
   * Abstract method - must be implemented by subclasses
   */
  protected abstract implement(params: CommandParams): Promise<CommandResult>;

  /**
   * Helper method to read file with context
   */
  protected async readFileWithContext(filePath: string): Promise<string> {
    const absolutePath = path.isAbsolute(filePath) ? 
      filePath : path.join(this.projectRoot, filePath);
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return fs.readFileSync(absolutePath, 'utf-8');
  }

  /**
   * Helper method to write file with validation
   */
  protected async writeFileWithValidation(
    filePath: string, 
    content: string
  ): Promise<void> {
    const absolutePath = path.isAbsolute(filePath) ? 
      filePath : path.join(this.projectRoot, filePath);
    
    // Ensure directory exists
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(absolutePath, content, 'utf-8');
  }

  /**
   * Helper to get context sections
   */
  protected getContextSection(
    context: AssembledContext, 
    sectionName: string
  ): string | null {
    const sectionRegex = new RegExp(`## ${sectionName}\\n([\\s\\S]*?)(?=\\n##|$)`, 'i');
    const match = context.content.match(sectionRegex);
    return match ? match[1].trim() : null;
  }

  /**
   * Helper to update runtime state
   */
  protected updateRuntimeState(updates: any): void {
    if (this.dynamicManager) {
      this.dynamicManager.updateRuntimeState(updates);
    }
  }

  /**
   * Helper to activate MCP tool
   */
  protected activateMCPTool(toolName: string): void {
    if (this.dynamicManager) {
      this.dynamicManager.activateTool(toolName);
    }
  }

  /**
   * Get command metadata
   */
  getMetadata(): {
    name: string;
    description: string;
    contextRequired: boolean;
    tokenBudget: number;
    mcpTools: string[];
    patterns: string[];
  } {
    return {
      name: this.name,
      description: this.description,
      contextRequired: this.contextRequired,
      tokenBudget: this.tokenBudget,
      mcpTools: this.mcpTools,
      patterns: this.patterns
    };
  }

  /**
   * Format output for display
   */
  protected formatOutput(sections: Record<string, string>): string {
    const output: string[] = [];
    
    Object.entries(sections).forEach(([title, content]) => {
      output.push(`## ${title}`);
      output.push('');
      output.push(content);
      output.push('');
    });
    
    return output.join('\n').trim();
  }

  /**
   * Log debug information
   */
  protected debug(message: string, data?: any): void {
    if (process.env.VIBE_DEBUG === 'true') {
      console.log(`[${this.name}] ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }
}