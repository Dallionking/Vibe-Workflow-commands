/**
 * Slash Command Adapter
 * Integrates context-enhanced commands with Claude's slash command system
 */

import { CommandFactory } from '../commands/base-command.js';
import { VibeCommandEnhancer } from '../../context/integration/vibe-command-enhancer.js';
import { DynamicContextManager } from '../../context/assembly/dynamic-context-manager.js';

export class SlashCommandAdapter {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.enhancer = null;
    this.contextManager = null;
    this.initialized = false;
  }

  /**
   * Initialize the adapter with context engineering
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Initialize context engineering if enabled
      if (process.env.VIBE_CONTEXT_ENABLED !== 'false') {
        this.enhancer = new VibeCommandEnhancer(this.projectRoot);
        await this.enhancer.initialize();
        
        this.contextManager = new DynamicContextManager(this.projectRoot);
        
        console.log('✅ Context engineering initialized for slash commands');
      }
      
      // Register all commands
      await this.registerCommands();
      
      this.initialized = true;
      
    } catch (error) {
      console.error('Failed to initialize slash command adapter:', error);
      // Continue without context enhancement
      this.initialized = true;
    }
  }

  /**
   * Register all Vibe commands
   */
  async registerCommands() {
    // Dynamically import all command classes
    const commandModules = [
      '../commands/vibe-init-enhanced.js',
      '../commands/vibe-step.js',
      '../commands/vibe-retrofit.js',
      '../commands/vibe-validate.js',
      '../commands/vibe-context.js',
      '../commands/vibe-learn.js',
      '../commands/vibe-status.js'
    ];
    
    for (const modulePath of commandModules) {
      try {
        const module = await import(modulePath);
        const CommandClass = module.default || module[Object.keys(module)[0]];
        
        if (CommandClass) {
          CommandFactory.register(CommandClass);
        }
      } catch (error) {
        console.warn(`Failed to load command module ${modulePath}:`, error.message);
      }
    }
  }

  /**
   * Handle slash command execution
   */
  async handleCommand(commandString, args = []) {
    // Ensure initialized
    await this.initialize();
    
    // Parse command
    const { commandName, params } = this.parseCommand(commandString, args);
    
    // Check if command exists
    const command = CommandFactory.get(commandName);
    if (!command) {
      return {
        error: true,
        message: `Unknown command: /${commandName}`,
        suggestions: this.getSimilarCommands(commandName)
      };
    }
    
    try {
      // Prepare execution options
      const options = await this.prepareExecutionOptions(commandName, params);
      
      // Execute command
      const result = await CommandFactory.execute(commandName, params, options);
      
      // Format result for Claude
      return this.formatResult(result, commandName);
      
    } catch (error) {
      return this.formatError(error, commandName);
    }
  }

  /**
   * Parse command string and arguments
   */
  parseCommand(commandString, args) {
    // Remove leading slash if present
    const cleanCommand = commandString.startsWith('/') 
      ? commandString.slice(1) 
      : commandString;
    
    // Handle different command formats
    let commandName = cleanCommand;
    let params = {};
    
    // Parse positional arguments
    if (args.length > 0) {
      // First arg is often the main parameter
      const command = CommandFactory.get(commandName);
      if (command) {
        // Map positional args to named params
        const requiredParams = command.requiredParams || [];
        args.forEach((arg, index) => {
          if (index < requiredParams.length) {
            params[requiredParams[index]] = arg;
          }
        });
        
        // Parse any key=value pairs
        args.forEach(arg => {
          if (arg.includes('=')) {
            const [key, value] = arg.split('=', 2);
            params[key] = this.parseValue(value);
          }
        });
      }
    }
    
    return { commandName, params };
  }

  /**
   * Parse parameter values
   */
  parseValue(value) {
    // Boolean values
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Numeric values
    if (/^\d+$/.test(value)) return parseInt(value, 10);
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
    
    // JSON values
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        return JSON.parse(value);
      } catch {
        // Not valid JSON, return as string
      }
    }
    
    return value;
  }

  /**
   * Prepare execution options with context
   */
  async prepareExecutionOptions(commandName, params) {
    const options = {};
    
    // Add context if available
    if (this.enhancer && this.contextManager) {
      try {
        // Assemble context for command
        const context = await this.contextManager.assembleContext(commandName, params);
        options._context = context;
        options._contextStats = this.contextManager.getContextStats();
        
      } catch (error) {
        console.warn('Failed to assemble context:', error.message);
        // Continue without context
      }
    }
    
    // Add learning system if available
    if (this.enhancer?.learningSystem) {
      options._learningSystem = this.enhancer.learningSystem;
    }
    
    return options;
  }

  /**
   * Format successful result for Claude
   */
  formatResult(result, commandName) {
    // Handle different result formats
    if (typeof result === 'string') {
      return { success: true, output: result };
    }
    
    if (result.success === false) {
      return {
        error: true,
        message: result.message || `Command ${commandName} failed`,
        details: result.details
      };
    }
    
    // Standard result format
    const formatted = {
      success: true,
      command: commandName,
      timestamp: new Date().toISOString()
    };
    
    // Add result data
    if (result.output) formatted.output = result.output;
    if (result.message) formatted.message = result.message;
    if (result.nextSteps) formatted.nextSteps = result.nextSteps;
    if (result.projectPath) formatted.projectPath = result.projectPath;
    
    // Add context usage if available
    if (result.contextUsed) {
      formatted.contextUsage = {
        tokens: result.contextUsed.tokens,
        layers: result.contextUsed.layers,
        sections: result.contextUsed.sections
      };
    }
    
    // Format next steps as actionable items
    if (formatted.nextSteps && Array.isArray(formatted.nextSteps)) {
      formatted.formattedOutput = this.formatNextSteps(formatted.nextSteps);
    }
    
    return formatted;
  }

  /**
   * Format error for Claude
   */
  formatError(error, commandName) {
    const formatted = {
      error: true,
      command: commandName,
      message: error.message,
      timestamp: new Date().toISOString()
    };
    
    // Add help text if validation error
    if (error.message.includes('Required parameter')) {
      const help = CommandFactory.getHelp(commandName);
      if (help) {
        formatted.usage = help.usage;
        formatted.requiredParams = help.requiredParams;
        formatted.optionalParams = help.optionalParams;
      }
    }
    
    // Add stack trace in debug mode
    if (process.env.VIBE_DEBUG === 'true') {
      formatted.stack = error.stack;
    }
    
    return formatted;
  }

  /**
   * Format next steps for display
   */
  formatNextSteps(steps) {
    let output = '\n✅ Command completed successfully!\n\n';
    output += '📋 Next Steps:\n';
    
    steps.forEach((step, index) => {
      output += `${index + 1}. ${step}\n`;
    });
    
    return output;
  }

  /**
   * Get similar command suggestions
   */
  getSimilarCommands(commandName) {
    const allCommands = CommandFactory.getAll().map(cmd => cmd.name);
    const suggestions = [];
    
    // Simple similarity check
    allCommands.forEach(cmd => {
      if (cmd.includes(commandName) || commandName.includes(cmd)) {
        suggestions.push(cmd);
      }
    });
    
    // Levenshtein distance for better suggestions
    if (suggestions.length === 0) {
      const distances = allCommands.map(cmd => ({
        command: cmd,
        distance: this.levenshteinDistance(commandName, cmd)
      }));
      
      distances.sort((a, b) => a.distance - b.distance);
      suggestions.push(...distances.slice(0, 3).map(d => d.command));
    }
    
    return suggestions;
  }

  /**
   * Calculate Levenshtein distance between strings
   */
  levenshteinDistance(a, b) {
    const matrix = [];
    
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }

  /**
   * Get command help
   */
  getHelp(commandName) {
    if (commandName) {
      return CommandFactory.getHelp(commandName);
    }
    
    // Return all commands help
    const allHelp = CommandFactory.getAllHelp();
    
    let output = '📚 Vibe Commands Help\n\n';
    
    // Group commands by category
    const categories = {
      'Core Workflow': ['vibe-init', 'vibe-step-1', 'vibe-step-2', 'vibe-step-3'],
      'Validation': ['vibe-validate-work', 'vibe-ui-healer', 'vibe-test-runner'],
      'Retrofit': ['vibe-retrofit', 'vibe-retrofit-analyze', 'vibe-retrofit-plan'],
      'Context': ['vibe-context', 'vibe-learn'],
      'Utility': ['vibe-status', 'vibe-phase', 'vibe-export', 'vibe-help']
    };
    
    Object.entries(categories).forEach(([category, commands]) => {
      output += `### ${category}\n`;
      
      commands.forEach(cmdName => {
        const help = allHelp.find(h => h.name === cmdName);
        if (help) {
          output += `- **/${help.name}** - ${help.description}\n`;
          output += `  Usage: \`${help.usage}\`\n`;
          
          if (help.contextEnabled) {
            output += `  ✨ Context-enhanced\n`;
          }
        }
      });
      
      output += '\n';
    });
    
    return output;
  }

  /**
   * Get system metrics
   */
  getMetrics() {
    const commandMetrics = CommandFactory.getMetrics();
    
    // Calculate aggregate metrics
    let totalExecutions = 0;
    let totalContextHits = 0;
    let totalFailures = 0;
    
    Object.values(commandMetrics).forEach(metrics => {
      totalExecutions += metrics.executions;
      totalContextHits += metrics.contextHits;
      totalFailures += metrics.failures;
    });
    
    return {
      commands: commandMetrics,
      aggregate: {
        totalExecutions,
        totalContextHits,
        totalFailures,
        contextUsageRate: totalExecutions > 0 
          ? (totalContextHits / totalExecutions * 100).toFixed(1) + '%'
          : '0%',
        successRate: totalExecutions > 0
          ? ((totalExecutions - totalFailures) / totalExecutions * 100).toFixed(1) + '%'
          : '0%'
      }
    };
  }
}

/**
 * Create and export singleton instance
 */
let adapterInstance = null;

export function getSlashCommandAdapter(projectRoot = process.cwd()) {
  if (!adapterInstance) {
    adapterInstance = new SlashCommandAdapter(projectRoot);
  }
  return adapterInstance;
}

/**
 * Main handler function for Claude integration
 */
export async function handleSlashCommand(commandString, ...args) {
  const adapter = getSlashCommandAdapter();
  return adapter.handleCommand(commandString, args);
}