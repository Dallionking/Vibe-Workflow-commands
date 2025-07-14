/**
 * Vibe Command Enhancer
 * Integrates dynamic context system with existing Vibe commands
 */

import { DynamicContextManager } from '../assembly/dynamic-context-manager';
import { CommandContextRegistry } from '../registry/command-registry';
import { ContextLearningSystem } from '../memory/learning';
import { AssembledContext, MemorySession, SessionOutcome } from '../types/context.types';
import * as fs from 'fs';
import * as path from 'path';

export interface EnhancedCommand {
  command: string;
  originalHandler: Function;
  enhancedHandler: Function;
}

export class VibeCommandEnhancer {
  private dynamicManager: DynamicContextManager;
  private learningSystem: ContextLearningSystem;
  private projectRoot: string;
  private enhancedCommands: Map<string, EnhancedCommand> = new Map();
  
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.dynamicManager = new DynamicContextManager(projectRoot);
    this.learningSystem = new ContextLearningSystem(projectRoot);
  }

  /**
   * Enhance a Vibe command with dynamic context
   */
  enhanceCommand(
    command: string, 
    originalHandler: Function
  ): Function {
    const enhancedHandler = async (params: any) => {
      const startTime = Date.now();
      let outcome: SessionOutcome;
      let assembledContext: AssembledContext | null = null;

      try {
        // Pre-execution: Get recommendations
        const recommendations = await this.learningSystem.getRecommendations(
          command, 
          params
        );
        
        if (recommendations.length > 0) {
          console.log('\n📊 Context Recommendations:');
          recommendations.forEach(rec => console.log(`  - ${rec}`));
        }

        // Update runtime state based on current execution
        this.updateRuntimeState(params);

        // Assemble dynamic context
        assembledContext = await this.dynamicManager.assembleContext(command, params);
        
        // Inject context into params
        const enhancedParams = {
          ...params,
          _context: assembledContext,
          _contextStats: this.dynamicManager.getContextStats()
        };

        // Execute original command with enhanced params
        const result = await originalHandler(enhancedParams);

        // Post-execution: Learn from success
        outcome = {
          success: true,
          metrics: this.extractMetrics(result),
          learnedPatterns: await this.detectNewPatterns(command, params, result)
        };

        return result;

      } catch (error) {
        // Learn from failure
        this.dynamicManager.addError(error.toString());
        
        outcome = {
          success: false,
          metrics: {},
          feedback: error.toString()
        };

        throw error;

      } finally {
        // Record session for learning
        if (assembledContext) {
          const session: MemorySession = {
            id: `session-${Date.now()}`,
            timestamp: new Date(),
            command,
            context: {
              layers: [],
              tokenUsage: {
                total: assembledContext.tokens,
                used: assembledContext.tokens,
                reserved: 0,
                available: 0
              },
              activePatterns: this.dynamicManager.getActivePatterns().map(p => p.id)
            },
            outcome
          };

          // Learn from the session
          const insights = await this.learningSystem.learnFromSession(session);
          
          if (insights.length > 0 && process.env.VIBE_SHOW_INSIGHTS === 'true') {
            console.log('\n💡 Learning Insights:');
            insights.forEach(insight => {
              console.log(`  [${insight.type}] ${insight.title}`);
              if (insight.recommendation) {
                console.log(`    → ${insight.recommendation}`);
              }
            });
          }
        }

        // Log performance metrics
        const duration = Date.now() - startTime;
        if (process.env.VIBE_DEBUG === 'true') {
          console.log(`\n⏱️  Command completed in ${duration}ms`);
          console.log(`📊 Context stats:`, this.dynamicManager.getContextStats());
        }
      }
    };

    // Store enhanced command
    this.enhancedCommands.set(command, {
      command,
      originalHandler,
      enhancedHandler
    });

    return enhancedHandler;
  }

  /**
   * Update runtime state based on command parameters
   */
  private updateRuntimeState(params: any): void {
    // Update current file if provided
    if (params.file || params.path) {
      const filePath = params.file || params.path;
      this.dynamicManager.updateRuntimeState({
        currentFile: filePath,
        currentFileType: this.detectFileType(filePath)
      });
    }

    // Update active tools based on command
    if (params.tools) {
      params.tools.forEach((tool: string) => {
        this.dynamicManager.activateTool(tool);
      });
    }

    // Clear previous errors
    this.dynamicManager.clearErrors();
  }

  /**
   * Extract metrics from command result
   */
  private extractMetrics(result: any): Record<string, number> {
    const metrics: Record<string, number> = {};

    // Extract common metrics
    if (result) {
      if (typeof result.testsPassed === 'number') {
        metrics.testsPassed = result.testsPassed;
      }
      if (typeof result.testsTotal === 'number') {
        metrics.testsTotal = result.testsTotal;
      }
      if (typeof result.coverage === 'number') {
        metrics.testCoverage = result.coverage;
      }
      if (typeof result.lintErrors === 'number') {
        metrics.lintErrors = result.lintErrors;
      }
      if (typeof result.performanceScore === 'number') {
        metrics.performanceScore = result.performanceScore;
      }
    }

    return metrics;
  }

  /**
   * Detect new patterns from command execution
   */
  private async detectNewPatterns(
    command: string, 
    params: any, 
    result: any
  ): Promise<any[]> {
    // This would integrate with pattern recognition
    // For now, return empty array
    return [];
  }

  /**
   * Detect file type from path
   */
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
      '.md': 'markdown',
      '.json': 'json',
      '.yaml': 'yaml'
    };
    
    return typeMap[ext] || 'unknown';
  }

  /**
   * Get enhanced command handler
   */
  getEnhancedHandler(command: string): Function | undefined {
    return this.enhancedCommands.get(command)?.enhancedHandler;
  }

  /**
   * Enhance all registered commands
   */
  async enhanceAllCommands(): Promise<void> {
    const commands = CommandContextRegistry.getAll();
    
    for (const [command, context] of commands) {
      // In a real implementation, we would get the original handlers
      // from the command system. For now, we'll create a mock.
      const mockHandler = async (params: any) => {
        console.log(`Executing ${command} with params:`, params);
        return { success: true };
      };
      
      this.enhanceCommand(command, mockHandler);
    }
  }

  /**
   * Export enhancement configuration
   */
  exportConfig(): {
    enhancedCommands: string[];
    contextStats: any;
    learningMetrics: any;
  } {
    return {
      enhancedCommands: Array.from(this.enhancedCommands.keys()),
      contextStats: this.dynamicManager.getContextStats(),
      learningMetrics: this.learningSystem.getLearningMetrics()
    };
  }

  /**
   * Create middleware for command execution
   */
  createMiddleware() {
    return async (command: string, params: any, next: Function) => {
      const enhanced = this.enhancedCommands.get(command);
      
      if (enhanced) {
        // Use enhanced handler
        return enhanced.enhancedHandler(params);
      } else {
        // Check if command should be enhanced
        const context = CommandContextRegistry.get(command);
        if (context) {
          // Enhance on the fly
          const enhancedHandler = this.enhanceCommand(command, next);
          return enhancedHandler(params);
        }
      }
      
      // Pass through to original handler
      return next(params);
    };
  }

  /**
   * Initialize enhancement system
   */
  async initialize(): Promise<void> {
    // Pre-load patterns for better performance
    await this.dynamicManager.updatePatterns();
    
    // Pre-load commonly used commands
    const commonCommands = [
      'vibe-init',
      'vibe-retrofit',
      'vibe-validate-work',
      'vibe-ui-healer'
    ];
    
    await this.dynamicManager.preloadContext(commonCommands);
    
    console.log('✅ Context enhancement system initialized');
  }
}

/**
 * Factory function to create and initialize enhancer
 */
export async function createVibeEnhancer(projectRoot: string): Promise<VibeCommandEnhancer> {
  const enhancer = new VibeCommandEnhancer(projectRoot);
  await enhancer.initialize();
  return enhancer;
}