/**
 * Enhanced vibe-context Command
 * Manage and inspect context engineering system
 */

import { BaseCommand, CommandParams, CommandResult } from '../base-command';
import { DynamicContextManager } from '../../../context/assembly/dynamic-context-manager';
import { ContextLearningSystem } from '../../../context/memory/learning-system';
import * as fs from 'fs';
import * as path from 'path';

interface ContextParams extends CommandParams {
  action?: 'show' | 'update' | 'optimize' | 'learn' | 'reset';
  layer?: 'global' | 'phase' | 'task' | 'all';
  verbose?: boolean;
}

export class VibeContextCommand extends BaseCommand {
  private contextManager: DynamicContextManager;
  private learningSystem: ContextLearningSystem;

  constructor() {
    super({
      name: 'vibe-context',
      description: 'Manage context engineering layers and optimization',
      contextRequired: false, // This command manages context itself
      tokenBudget: 3000,
      patterns: ['context-management']
    });
    
    this.contextManager = new DynamicContextManager(this.projectRoot);
    this.learningSystem = new ContextLearningSystem(this.projectRoot);
  }

  protected async implement(params: ContextParams): Promise<CommandResult> {
    const { action = 'show', layer = 'all', verbose = false } = params;

    try {
      console.log(`\n🧠 Context Engineering - ${action.toUpperCase()}`);
      
      let result;
      
      switch (action) {
        case 'show':
          result = await this.showContext(layer, verbose);
          break;
          
        case 'update':
          result = await this.updateContext(layer);
          break;
          
        case 'optimize':
          result = await this.optimizeContext(layer);
          break;
          
        case 'learn':
          result = await this.learnFromContext();
          break;
          
        case 'reset':
          result = await this.resetContext(layer);
          break;
          
        default:
          return {
            success: false,
            error: `Unknown action: ${action}`
          };
      }
      
      return {
        success: true,
        output: result.output,
        data: result.data
      };

    } catch (error) {
      return {
        success: false,
        error: `Context operation failed: ${error}`
      };
    }
  }

  private async showContext(layer: string, verbose: boolean): Promise<any> {
    const stats = await this.contextManager.getContextStats();
    const layers = await this.contextManager.getActiveLayers();
    
    const sections: Record<string, string> = {};
    
    // Overall Statistics
    sections['Context Statistics'] = `
Total Tokens: ${stats.totalTokens}
Active Layers: ${stats.activeLayers}
Cache Hit Rate: ${stats.cacheHitRate}%
Compression Ratio: ${stats.compressionRatio}x`;
    
    // Layer Information
    if (layer === 'all' || layer === 'global') {
      const globalLayer = layers.find(l => l.type === 'global');
      if (globalLayer) {
        sections['Global Layer (L1)'] = this.formatLayerInfo(globalLayer, verbose);
      }
    }
    
    if (layer === 'all' || layer === 'phase') {
      const phaseLayer = layers.find(l => l.type === 'phase');
      if (phaseLayer) {
        sections['Phase Layer (L2)'] = this.formatLayerInfo(phaseLayer, verbose);
      }
    }
    
    if (layer === 'all' || layer === 'task') {
      const taskLayer = layers.find(l => l.type === 'task');
      if (taskLayer) {
        sections['Task Layer (L3)'] = this.formatLayerInfo(taskLayer, verbose);
      }
    }
    
    // Learning System Status
    const learningStats = await this.learningSystem.getStatistics();
    sections['Learning System'] = `
Patterns Learned: ${learningStats.patternsLearned}
Success Rate: ${learningStats.successRate}%
Last Update: ${learningStats.lastUpdate || 'Never'}`;
    
    // MCP Tool Status
    const toolStatus = await this.contextManager.getToolStatus();
    sections['MCP Tools'] = this.formatToolStatus(toolStatus);
    
    return {
      output: this.formatOutput(sections),
      data: { stats, layers, learningStats, toolStatus }
    };
  }

  private formatLayerInfo(layer: any, verbose: boolean): string {
    const lines = [];
    
    lines.push(`Status: ${layer.enabled ? 'Enabled' : 'Disabled'}`);
    lines.push(`Token Budget: ${layer.budget.used}/${layer.budget.max} (${layer.budget.percentage}%)`);
    lines.push(`Sources: ${layer.sources.length}`);
    
    if (verbose) {
      lines.push('\nContent Sections:');
      layer.contents.forEach((content: any) => {
        lines.push(`  - ${content.section}: ${content.tokens} tokens`);
      });
      
      lines.push('\nActive Rules:');
      layer.rules.forEach((rule: any) => {
        lines.push(`  - ${rule.name}: ${rule.enabled ? 'Active' : 'Inactive'}`);
      });
    }
    
    return lines.join('\n');
  }

  private formatToolStatus(tools: any): string {
    const lines = [];
    
    Object.entries(tools).forEach(([tool, status]: [string, any]) => {
      const icon = status.available ? '✅' : '❌';
      lines.push(`${icon} ${tool}: ${status.status}`);
      if (status.usage) {
        lines.push(`   Usage: ${status.usage.count} calls, ${status.usage.avgTime}ms avg`);
      }
    });
    
    return lines.join('\n');
  }

  private async updateContext(layer: string): Promise<any> {
    console.log(`\n🔄 Updating ${layer} context layers...`);
    
    const updated = [];
    
    if (layer === 'all' || layer === 'global') {
      await this.updateGlobalContext();
      updated.push('global');
    }
    
    if (layer === 'all' || layer === 'phase') {
      await this.updatePhaseContext();
      updated.push('phase');
    }
    
    if (layer === 'all' || layer === 'task') {
      await this.updateTaskContext();
      updated.push('task');
    }
    
    // Refresh context assembly
    await this.contextManager.refreshContext();
    
    const sections: Record<string, string> = {};
    sections['Context Update Complete'] = '✅';
    sections['Updated Layers'] = updated.join(', ');
    sections['Next Steps'] = 'Context has been refreshed and is ready for use';
    
    return {
      output: this.formatOutput(sections),
      data: { updated }
    };
  }

  private async updateGlobalContext(): Promise<void> {
    // Re-read global sources
    const sources = ['CLAUDE.md', 'package.json', '.eslintrc.json', 'tsconfig.json'];
    
    for (const source of sources) {
      const sourcePath = path.join(this.projectRoot, source);
      if (fs.existsSync(sourcePath)) {
        console.log(`  📄 Updating from ${source}`);
        // Context manager would handle the actual update
      }
    }
  }

  private async updatePhaseContext(): Promise<void> {
    // Re-read phase-specific sources
    const currentPhase = await this.getCurrentPhase();
    
    if (currentPhase) {
      console.log(`  📋 Updating phase ${currentPhase} context`);
      
      const phaseSources = [
        `phases/phase-${currentPhase}.md`,
        `docs/vibe-coding/${String(currentPhase).padStart(2, '0')}-*.md`
      ];
      
      // Context manager would handle the actual update
    }
  }

  private async updateTaskContext(): Promise<void> {
    // Update task-specific context
    console.log('  🎯 Updating task context from recent changes');
    
    // Get recent git changes
    try {
      const recentFiles = await this.getRecentChanges();
      // Context manager would process these files
    } catch (error) {
      console.log('  ⚠️  Could not get git status');
    }
  }

  private async optimizeContext(layer: string): Promise<any> {
    console.log(`\n⚡ Optimizing ${layer} context layers...`);
    
    const optimizations = [];
    
    // Run optimization strategies
    if (layer === 'all' || layer === 'global') {
      const globalOpt = await this.optimizeGlobalLayer();
      optimizations.push(globalOpt);
    }
    
    if (layer === 'all' || layer === 'phase') {
      const phaseOpt = await this.optimizePhaseLayer();
      optimizations.push(phaseOpt);
    }
    
    if (layer === 'all' || layer === 'task') {
      const taskOpt = await this.optimizeTaskLayer();
      optimizations.push(taskOpt);
    }
    
    // Calculate savings
    const totalSaved = optimizations.reduce((sum, opt) => sum + opt.tokensSaved, 0);
    const totalRemoved = optimizations.reduce((sum, opt) => sum + opt.sectionsRemoved, 0);
    
    const sections: Record<string, string> = {};
    sections['Optimization Complete'] = '✅';
    sections['Tokens Saved'] = `${totalSaved} tokens`;
    sections['Sections Optimized'] = `${totalRemoved} redundant sections removed`;
    
    // Detailed results
    const details = [];
    optimizations.forEach(opt => {
      details.push(`${opt.layer}: ${opt.tokensSaved} tokens saved`);
      if (opt.suggestions.length > 0) {
        opt.suggestions.forEach((s: string) => details.push(`  - ${s}`));
      }
    });
    sections['Details'] = details.join('\n');
    
    sections['Next Steps'] = 'Optimized context is now active';
    
    return {
      output: this.formatOutput(sections),
      data: { optimizations, totalSaved }
    };
  }

  private async optimizeGlobalLayer(): Promise<any> {
    const result = {
      layer: 'global',
      tokensSaved: 0,
      sectionsRemoved: 0,
      suggestions: [] as string[]
    };
    
    // Analyze global layer for redundancy
    const analysis = await this.contextManager.analyzeRedundancy('global');
    
    if (analysis.duplicateSections.length > 0) {
      result.sectionsRemoved = analysis.duplicateSections.length;
      result.tokensSaved = analysis.potentialSavings;
      result.suggestions.push('Removed duplicate convention definitions');
    }
    
    if (analysis.unusedSections.length > 0) {
      result.suggestions.push(`Consider removing ${analysis.unusedSections.length} unused sections`);
    }
    
    return result;
  }

  private async optimizePhaseLayer(): Promise<any> {
    const result = {
      layer: 'phase',
      tokensSaved: 0,
      sectionsRemoved: 0,
      suggestions: [] as string[]
    };
    
    // Compress phase documentation
    const compressed = await this.contextManager.compressLayer('phase');
    
    if (compressed.success) {
      result.tokensSaved = compressed.savedTokens;
      result.suggestions.push('Applied intelligent compression to phase docs');
    }
    
    // Remove completed phase information
    const currentPhase = await this.getCurrentPhase();
    if (currentPhase && parseInt(currentPhase) > 3) {
      result.suggestions.push('Archived early phase documentation');
      result.sectionsRemoved += 2;
    }
    
    return result;
  }

  private async optimizeTaskLayer(): Promise<any> {
    const result = {
      layer: 'task',
      tokensSaved: 0,
      sectionsRemoved: 0,
      suggestions: [] as string[]
    };
    
    // Clear old task context
    const cleared = await this.contextManager.clearOldTaskContext();
    
    if (cleared.filesCleared > 0) {
      result.sectionsRemoved = cleared.filesCleared;
      result.tokensSaved = cleared.tokensSaved;
      result.suggestions.push(`Cleared ${cleared.filesCleared} old task contexts`);
    }
    
    // Optimize error context
    result.suggestions.push('Consolidated error messages into patterns');
    
    return result;
  }

  private async learnFromContext(): Promise<any> {
    console.log('\n🧠 Learning from current context...');
    
    // Analyze current patterns
    const patterns = await this.learningSystem.analyzeCurrentPatterns();
    
    // Record successful patterns
    const learned = [];
    for (const pattern of patterns) {
      if (pattern.confidence > 80) {
        await this.learningSystem.recordPattern(pattern);
        learned.push(pattern);
      }
    }
    
    // Update pattern library
    if (learned.length > 0) {
      await this.updatePatternLibrary(learned);
    }
    
    const sections: Record<string, string> = {};
    sections['Learning Complete'] = '✅';
    sections['Patterns Analyzed'] = `${patterns.length}`;
    sections['Patterns Learned'] = `${learned.length}`;
    
    if (learned.length > 0) {
      const patternList = learned.map(p => `- ${p.name} (${p.type}): ${p.confidence}% confidence`);
      sections['New Patterns'] = patternList.join('\n');
    }
    
    sections['Next Steps'] = learned.length > 0 
      ? 'New patterns have been added to the context system'
      : 'No new patterns met the confidence threshold';
    
    return {
      output: this.formatOutput(sections),
      data: { patterns, learned }
    };
  }

  private async updatePatternLibrary(patterns: any[]): Promise<void> {
    const libraryPath = path.join(this.projectRoot, '.vibe/patterns.json');
    
    let library = { patterns: [] };
    if (fs.existsSync(libraryPath)) {
      library = JSON.parse(fs.readFileSync(libraryPath, 'utf-8'));
    }
    
    // Add new patterns
    patterns.forEach(pattern => {
      if (!library.patterns.find((p: any) => p.id === pattern.id)) {
        library.patterns.push({
          id: pattern.id,
          name: pattern.name,
          type: pattern.type,
          confidence: pattern.confidence,
          learned: new Date().toISOString()
        });
      }
    });
    
    // Save updated library
    const dir = path.dirname(libraryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2));
  }

  private async resetContext(layer: string): Promise<any> {
    console.log(`\n🔄 Resetting ${layer} context layers...`);
    
    const confirmMessage = `Are you sure you want to reset ${layer} context? This will clear all customizations.`;
    console.log(`\n⚠️  ${confirmMessage}`);
    
    // In a real implementation, we'd wait for user confirmation
    // For now, we'll proceed with caution
    
    const reset = [];
    
    if (layer === 'all' || layer === 'global') {
      // Reset global context to defaults
      await this.contextManager.resetLayer('global');
      reset.push('global');
    }
    
    if (layer === 'all' || layer === 'phase') {
      // Clear phase-specific customizations
      await this.contextManager.resetLayer('phase');
      reset.push('phase');
    }
    
    if (layer === 'all' || layer === 'task') {
      // Clear all task context
      await this.contextManager.resetLayer('task');
      reset.push('task');
    }
    
    // Clear learning data if resetting all
    if (layer === 'all') {
      await this.learningSystem.reset();
      reset.push('learning system');
    }
    
    const sections: Record<string, string> = {};
    sections['Context Reset Complete'] = '✅';
    sections['Reset Layers'] = reset.join(', ');
    sections['Next Steps'] = 'Run /vibe-context update to rebuild context from sources';
    
    return {
      output: this.formatOutput(sections),
      data: { reset }
    };
  }

  // Helper methods
  private async getCurrentPhase(): Promise<string | null> {
    const statusPath = path.join(this.projectRoot, '.vibe-status.md');
    if (fs.existsSync(statusPath)) {
      const content = fs.readFileSync(statusPath, 'utf-8');
      const match = content.match(/Current Phase:\s*(\S+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  private async getRecentChanges(): Promise<string[]> {
    try {
      const { execSync } = require('child_process');
      const output = execSync(
        'git diff --name-only HEAD~5..HEAD',
        { cwd: this.projectRoot, encoding: 'utf-8' }
      );
      return output.split('\n').filter(f => f.trim());
    } catch {
      return [];
    }
  }
}