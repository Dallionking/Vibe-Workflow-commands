/**
 * Enhanced Vibe Retrofit Commands
 * Phase 2: Tier 3 - Integration and Quality Assurance
 *
 * Integrates all retrofit context engineering components into unified commands
 */

import { EnhancedRetrofitCommands, CommandOptions, CommandResult } from '../../../retrofit/commands/enhanced-commands';
import { promises as fs } from 'fs';
import { join } from 'path';

export class VibeRetrofitCommand {
  private enhancedCommands: EnhancedRetrofitCommands;

  constructor() {
    this.enhancedCommands = new EnhancedRetrofitCommands();
  }

  /**
     * Enhanced /vibe-retrofit-existing command
     * Usage: /vibe-retrofit-existing [path] --context-mode=adaptive --validation-gates=strict
     */
  async executeRetrofitExisting(args: string[] = []): Promise<void> {
    console.log('🚀 Starting Enhanced Retrofit Existing...\n');

    // Parse arguments
    const options = this.parseOptions(args);
    const targetPath = args.find(arg => !arg.startsWith('-')) || './';

    // Validate target path
    if (!await this.validatePath(targetPath)) {
      console.error(`❌ Invalid path: ${targetPath}`);
      return;
    }

    // Display configuration
    this.displayConfiguration(options);

    // Execute enhanced retrofit
    const result = await this.enhancedCommands.vibeRetrofitExisting(options);

    // Display results
    this.displayResults(result);

    // Save results for future reference
    await this.saveResults(result, 'retrofit-existing');
  }

  /**
     * Enhanced /vibe-analyze-codebase command
     * Usage: /vibe-analyze-codebase --context-depth=deep --pattern-learning=enabled
     */
  async executeAnalyzeCodebase(args: string[] = []): Promise<void> {
    console.log('🔍 Starting Enhanced Codebase Analysis...\n');

    // Parse arguments
    const options = this.parseOptions(args);

    // Display configuration
    this.displayConfiguration(options);

    // Execute enhanced analysis
    const result = await this.enhancedCommands.vibeAnalyzeCodebase(options);

    // Display results
    this.displayResults(result);

    // Save results for future reference
    await this.saveResults(result, 'analyze-codebase');
  }

  /**
     * New /vibe-retrofit-context command suite
     * Usage: /vibe-retrofit-context [learn|apply|validate|export] [options]
     */
  async executeRetrofitContext(args: string[] = []): Promise<void> {
    const subcommand = args[0];

    if (!subcommand) {
      this.displayContextHelp();
      return;
    }

    console.log(`🎯 Starting Retrofit Context: ${subcommand}\n`);

    // Parse remaining arguments
    const options = this.parseOptions(args.slice(1));

    // Display configuration for non-help commands
    if (subcommand !== 'help') {
      this.displayConfiguration(options);
    }

    // Execute context command
    const result = await this.enhancedCommands.vibeRetrofitContext(subcommand, options);

    // Display results
    this.displayResults(result);

    // Save results for future reference
    await this.saveResults(result, `retrofit-context-${subcommand}`);
  }

  // Private helper methods
  private parseOptions(args: string[]): CommandOptions {
    const options: CommandOptions = {};

    for (const arg of args) {
      if (arg.startsWith('--context-mode=')) {
        options.contextMode = arg.split('=')[1] as 'adaptive' | 'strict' | 'learning';
      } else if (arg.startsWith('--validation-gates=')) {
        options.validationGates = arg.split('=')[1] as 'none' | 'basic' | 'strict';
      } else if (arg.startsWith('--context-depth=')) {
        options.contextDepth = arg.split('=')[1] as 'shallow' | 'medium' | 'deep';
      } else if (arg === '--pattern-learning=enabled') {
        options.patternLearning = true;
      } else if (arg === '--interactive') {
        options.interactive = true;
      } else if (arg === '--dry-run') {
        options.dryRun = true;
      }
    }

    return options;
  }

  private async validatePath(path: string): Promise<boolean> {
    try {
      const stats = await fs.stat(path);
      return stats.isDirectory();
    } catch (error) {
      return false;
    }
  }

  private displayConfiguration(options: CommandOptions): void {
    console.log('⚙️  Configuration:');
    console.log(`   Context Mode: ${options.contextMode || 'adaptive'}`);
    console.log(`   Validation Gates: ${options.validationGates || 'strict'}`);
    console.log(`   Context Depth: ${options.contextDepth || 'deep'}`);
    console.log(`   Pattern Learning: ${options.patternLearning ? 'enabled' : 'disabled'}`);
    console.log(`   Interactive: ${options.interactive ? 'enabled' : 'disabled'}`);
    console.log(`   Dry Run: ${options.dryRun ? 'enabled' : 'disabled'}`);
    console.log('');
  }

  private displayResults(result: CommandResult): void {
    console.log('\n📊 Results:');
    console.log(`   Success: ${result.success ? '✅' : '❌'}`);
    console.log(`   Message: ${result.message}`);

    if (result.data) {
      console.log('   Data:');
      for (const [key, value] of Object.entries(result.data)) {
        console.log(`     ${key}: ${value}`);
      }
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (result.nextSteps.length > 0) {
      console.log('\n📋 Next Steps:');
      result.nextSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
    }

    console.log('');
  }

  private displayContextHelp(): void {
    console.log('🎯 Retrofit Context Commands:\n');
    console.log('Available subcommands:');
    console.log('  learn      - Learn patterns from existing codebase');
    console.log('  apply      - Apply learned patterns to generate agents');
    console.log('  validate   - Validate context consistency');
    console.log('  export     - Export context for team sharing');
    console.log('');
    console.log('Examples:');
    console.log('  /vibe-retrofit-context learn --interactive');
    console.log('  /vibe-retrofit-context apply --dry-run');
    console.log('  /vibe-retrofit-context validate');
    console.log('  /vibe-retrofit-context export');
    console.log('');
  }

  private async saveResults(result: CommandResult, commandType: string): Promise<void> {
    try {
      // Ensure .vibe/reports directory exists
      const reportsDir = join(process.cwd(), '.vibe', 'reports');
      await fs.mkdir(reportsDir, { recursive: true });

      // Save detailed results
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${commandType}-${timestamp}.json`;
      const filepath = join(reportsDir, filename);

      await fs.writeFile(filepath, JSON.stringify(result, null, 2));

      console.log(`📁 Results saved to: ${filepath}`);

    } catch (error) {
      console.warn(`⚠️  Could not save results: ${error.message}`);
    }
  }
}

// Export for Claude Code integration
export const vibeRetrofitCommand = new VibeRetrofitCommand();

// Command exports for slash command system
export const executeRetrofitExisting = vibeRetrofitCommand.executeRetrofitExisting.bind(vibeRetrofitCommand);
export const executeAnalyzeCodebase = vibeRetrofitCommand.executeAnalyzeCodebase.bind(vibeRetrofitCommand);
export const executeRetrofitContext = vibeRetrofitCommand.executeRetrofitContext.bind(vibeRetrofitCommand);
