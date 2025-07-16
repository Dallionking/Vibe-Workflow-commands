/**
 * Base Vibe Command Class
 * Foundation for all context-enhanced Vibe commands
 */

export class BaseVibeCommand {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.contextEnabled = config.contextEnabled ?? true;
    this.fallbackEnabled = config.fallbackEnabled ?? true;
    this.requiredParams = config.requiredParams || [];
    this.optionalParams = config.optionalParams || [];
    
    // Performance tracking
    this.metrics = {
      executions: 0,
      totalDuration: 0,
      failures: 0,
      contextHits: 0,
      fallbacks: 0
    };
  }

  /**
   * Main execution entry point
   */
  async execute(params, options = {}) {
    const startTime = Date.now();
    let result;
    let executionMode = 'unknown';
    
    try {
      // Validate parameters
      await this.validate(params);
      
      // Check if context is available and enabled
      const context = options._context;
      const contextStats = options._contextStats;
      
      if (context && this.contextEnabled && !options.forceLegacy) {
        // Execute with context enhancement
        executionMode = 'context-enhanced';
        this.metrics.contextHits++;
        
        // Log context usage if debug mode
        if (process.env.VIBE_DEBUG === 'true') {
          this.logContextUsage(context, contextStats);
        }
        
        result = await this.executeWithContext(params, context);
        
      } else if (this.fallbackEnabled) {
        // Execute in legacy mode
        executionMode = 'legacy';
        this.metrics.fallbacks++;
        
        if (this.contextEnabled && !context) {
          console.log('⚠️  Context not available, falling back to legacy mode');
        }
        
        result = await this.executeLegacy(params);
        
      } else {
        // Context required but not available
        throw new Error(
          `Context is required for ${this.name} but not available. ` +
          'Please ensure context engineering is properly configured.'
        );
      }
      
      // Post-process the result
      result = await this.postProcess(result, params, context);
      
      // Track success metrics
      this.metrics.executions++;
      
      return result;
      
    } catch (error) {
      // Track failure metrics
      this.metrics.failures++;
      
      // Log error with context
      console.error(`❌ Error in ${this.name}:`, error.message);
      
      if (process.env.VIBE_DEBUG === 'true') {
        console.error('Full error:', error);
        console.error('Params:', params);
        console.error('Execution mode:', executionMode);
      }
      
      // Allow commands to handle specific errors
      const handled = await this.handleError(error, params, options._context);
      if (handled) return handled;
      
      throw error;
      
    } finally {
      // Track performance
      const duration = Date.now() - startTime;
      this.metrics.totalDuration += duration;
      
      if (process.env.VIBE_PERF_TRACKING === 'true') {
        console.log(`⏱️  ${this.name} completed in ${duration}ms (${executionMode})`);
      }
      
      // Report to learning system if available
      if (options._learningSystem) {
        await this.reportToLearningSystem(options._learningSystem, {
          command: this.name,
          params,
          duration,
          executionMode,
          success: !result?.error,
          contextTokens: options._context?.tokens
        });
      }
    }
  }

  /**
   * Validate command parameters
   * Override in subclasses for specific validation
   */
  async validate(params) {
    // Check required parameters
    for (const param of this.requiredParams) {
      if (params[param] === undefined || params[param] === null) {
        throw new Error(`Required parameter '${param}' is missing for ${this.name}`);
      }
    }
    
    // Basic type validation
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;
      
      const expectedType = this.getExpectedType(key);
      if (expectedType && typeof value !== expectedType) {
        throw new Error(
          `Parameter '${key}' should be ${expectedType} but got ${typeof value}`
        );
      }
    }
  }

  /**
   * Execute command with context enhancement
   * Must be overridden in subclasses
   */
  async executeWithContext(params, context) {
    throw new Error(
      `executeWithContext not implemented for ${this.name}. ` +
      'Please implement this method in the command subclass.'
    );
  }

  /**
   * Execute command in legacy mode
   * Must be overridden in subclasses
   */
  async executeLegacy(params) {
    throw new Error(
      `executeLegacy not implemented for ${this.name}. ` +
      'Please implement this method in the command subclass.'
    );
  }

  /**
   * Post-process command results
   * Can be overridden for custom processing
   */
  async postProcess(result, params, context) {
    // Add standard metadata
    if (result && typeof result === 'object') {
      result._metadata = {
        command: this.name,
        timestamp: new Date().toISOString(),
        contextUsed: !!context,
        contextTokens: context?.tokens,
        executionMode: context ? 'enhanced' : 'legacy'
      };
    }
    
    return result;
  }

  /**
   * Handle specific errors
   * Can be overridden for custom error handling
   */
  async handleError(error, params, context) {
    // Return null to let error propagate
    // Return a value to recover from error
    return null;
  }

  /**
   * Log context usage for debugging
   */
  logContextUsage(context, stats) {
    console.log(`\n📊 Context Usage for ${this.name}:`);
    console.log(`  Total Tokens: ${context.tokens}`);
    console.log(`  Layers: ${context.layers?.length || 0}`);
    
    if (context.layers) {
      const layerStats = {};
      context.layers.forEach(layer => {
        layerStats[layer.type] = (layerStats[layer.type] || 0) + 1;
      });
      
      Object.entries(layerStats).forEach(([type, count]) => {
        console.log(`    ${type}: ${count} sections`);
      });
    }
    
    if (stats) {
      console.log(`  Cache Hits: ${stats.cacheHits || 0}`);
      console.log(`  Assembly Time: ${stats.assemblyTime || 0}ms`);
    }
    
    console.log('');
  }

  /**
   * Report execution to learning system
   */
  async reportToLearningSystem(learningSystem, execution) {
    try {
      await learningSystem.recordExecution(execution);
    } catch (error) {
      // Don't let learning system errors affect command execution
      if (process.env.VIBE_DEBUG === 'true') {
        console.warn('Failed to report to learning system:', error.message);
      }
    }
  }

  /**
   * Get expected parameter type
   * Can be overridden for custom type checking
   */
  getExpectedType(paramName) {
    const commonTypes = {
      projectName: 'string',
      template: 'string',
      file: 'string',
      path: 'string',
      stepNumber: 'number',
      force: 'boolean',
      verbose: 'boolean',
      dryRun: 'boolean'
    };
    
    return commonTypes[paramName];
  }

  /**
   * Get command metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      averageDuration: this.metrics.executions > 0 
        ? Math.round(this.metrics.totalDuration / this.metrics.executions)
        : 0,
      successRate: this.metrics.executions > 0
        ? ((this.metrics.executions - this.metrics.failures) / this.metrics.executions * 100).toFixed(1)
        : 0,
      contextUsageRate: this.metrics.executions > 0
        ? (this.metrics.contextHits / this.metrics.executions * 100).toFixed(1)
        : 0
    };
  }

  /**
   * Reset command metrics
   */
  resetMetrics() {
    this.metrics = {
      executions: 0,
      totalDuration: 0,
      failures: 0,
      contextHits: 0,
      fallbacks: 0
    };
  }

  /**
   * Helper method to check if a feature is enabled
   */
  isFeatureEnabled(feature) {
    const features = {
      context: process.env.VIBE_CONTEXT_ENABLED !== 'false',
      learning: process.env.VIBE_LEARNING_ENABLED === 'true',
      tokenOptimization: process.env.VIBE_TOKEN_OPTIMIZATION === 'true',
      caching: process.env.VIBE_CACHING_ENABLED !== 'false',
      validation: process.env.VIBE_VALIDATION_ENABLED !== 'false'
    };
    
    return features[feature] ?? false;
  }

  /**
   * Helper method to extract context section
   */
  extractContextSection(context, sectionName) {
    // Check direct sections
    if (context.sections?.[sectionName]) {
      return context.sections[sectionName];
    }
    
    // Check layers
    if (context.layers) {
      const layer = context.layers.find(l => 
        l.name === sectionName || 
        l.metadata?.sectionName === sectionName
      );
      
      if (layer) return layer.content;
    }
    
    // Check nested structure
    if (context.data?.[sectionName]) {
      return context.data[sectionName];
    }
    
    return null;
  }

  /**
   * Helper method to check if context has a section
   */
  contextHasSection(context, sectionName) {
    return this.extractContextSection(context, sectionName) !== null;
  }

  /**
   * Get command help text
   */
  getHelp() {
    const params = [
      ...this.requiredParams.map(p => `<${p}>`),
      ...this.optionalParams.map(p => `[${p}]`)
    ].join(' ');
    
    return {
      usage: `/${this.name} ${params}`.trim(),
      description: this.description,
      requiredParams: this.requiredParams,
      optionalParams: this.optionalParams,
      contextEnabled: this.contextEnabled,
      metrics: this.getMetrics()
    };
  }
}

/**
 * Command factory for creating commands
 */
export class CommandFactory {
  static commands = new Map();
  
  static register(CommandClass) {
    const instance = new CommandClass();
    this.commands.set(instance.name, instance);
    return instance;
  }
  
  static get(commandName) {
    return this.commands.get(commandName);
  }
  
  static getAll() {
    return Array.from(this.commands.values());
  }
  
  static async execute(commandName, params, options) {
    const command = this.get(commandName);
    
    if (!command) {
      throw new Error(`Unknown command: ${commandName}`);
    }
    
    return command.execute(params, options);
  }
  
  static getHelp(commandName) {
    const command = this.get(commandName);
    return command ? command.getHelp() : null;
  }
  
  static getAllHelp() {
    return this.getAll().map(cmd => ({
      name: cmd.name,
      ...cmd.getHelp()
    }));
  }
  
  static getMetrics() {
    const metrics = {};
    
    this.getAll().forEach(cmd => {
      metrics[cmd.name] = cmd.getMetrics();
    });
    
    return metrics;
  }
}