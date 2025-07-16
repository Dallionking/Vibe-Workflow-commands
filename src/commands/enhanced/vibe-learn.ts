/**
 * Enhanced vibe-learn Command
 * Learning system for pattern recognition and improvement
 */

import { BaseCommand, CommandParams, CommandResult } from '../base-command';
import { ContextLearningSystem } from '../../../context/memory/learning-system';
import { PatternRecognizer } from '../../../context/memory/patterns';
import * as fs from 'fs';
import * as path from 'path';

interface LearnParams extends CommandParams {
  from?: 'success' | 'failure' | 'patterns' | 'all';
  type?: string;
  threshold?: number;
  export?: boolean;
}

export class VibeLearnCommand extends BaseCommand {
  private learningSystem: ContextLearningSystem;
  private patternRecognizer: PatternRecognizer;

  constructor() {
    super({
      name: 'vibe-learn',
      description: 'Learn from project patterns and improve context',
      contextRequired: true,
      tokenBudget: 4000,
      mcpTools: ['context7'],
      patterns: ['learning', 'pattern-recognition']
    });

    this.learningSystem = new ContextLearningSystem(this.projectRoot);
    this.patternRecognizer = new PatternRecognizer(this.projectRoot);
  }

  protected async implement(params: LearnParams): Promise<CommandResult> {
    const {
      from = 'all',
      type,
      threshold = 80,
      export: shouldExport = false
    } = params;

    try {
      console.log('\n🧠 Starting Learning Process...');
      console.log(`\n🎯 Learning from: ${from}`);

      let learningResults;

      switch (from) {
      case 'success':
        learningResults = await this.learnFromSuccesses(type);
        break;

      case 'failure':
        learningResults = await this.learnFromFailures(type);
        break;

      case 'patterns':
        learningResults = await this.learnFromPatterns(type, threshold);
        break;

      case 'all':
        learningResults = await this.comprehensiveLearning(type, threshold);
        break;

      default:
        return {
          success: false,
          error: `Unknown learning source: ${from}`
        };
      }

      // Process learning results
      const processed = await this.processLearningResults(learningResults);

      // Update context system with learnings
      await this.updateContextWithLearnings(processed);

      // Export if requested
      if (shouldExport) {
        const exportPath = await this.exportLearnings(processed);
        console.log(`\n📦 Learnings exported to: ${exportPath}`);
      }

      // Generate report
      const output = this.formatLearningOutput(processed);

      return {
        success: true,
        output,
        data: processed
      };

    } catch (error) {
      return {
        success: false,
        error: `Learning process failed: ${error}`
      };
    }
  }

  private async learnFromSuccesses(type?: string): Promise<any> {
    console.log('\n✅ Analyzing successful patterns...');

    const successes = {
      patterns: [],
      insights: [],
      recommendations: []
    };

    // Analyze successful command executions
    const commandHistory = await this.learningSystem.getCommandHistory();
    const successfulCommands = commandHistory.filter(cmd => cmd.success && cmd.metrics?.executionTime < 5000);

    // Extract patterns from successful executions
    for (const cmd of successfulCommands) {
      if (!type || cmd.type === type) {
        const pattern = {
          command: cmd.name,
          context: cmd.contextUsed,
          parameters: cmd.parameters,
          performance: cmd.metrics,
          timestamp: cmd.timestamp
        };

        // Check if this represents a recurring pattern
        const similar = await this.findSimilarPatterns(pattern, successes.patterns);
        if (similar.length >= 3) {
          successes.insights.push({
            type: 'recurring-success',
            description: `Command ${cmd.name} consistently performs well with similar parameters`,
            confidence: 90
          });
        }

        successes.patterns.push(pattern);
      }
    }

    // Analyze successful code patterns
    const codePatterns = await this.patternRecognizer.findSuccessfulPatterns();
    successes.patterns.push(...codePatterns);

    // Generate recommendations
    if (successes.patterns.length > 10) {
      successes.recommendations.push('Consider creating command shortcuts for frequently successful patterns');
    }

    return successes;
  }

  private async learnFromFailures(type?: string): Promise<any> {
    console.log('\n❌ Analyzing failure patterns...');

    const failures = {
      patterns: [],
      insights: [],
      recommendations: []
    };

    // Analyze failed command executions
    const commandHistory = await this.learningSystem.getCommandHistory();
    const failedCommands = commandHistory.filter(cmd => !cmd.success);

    // Group failures by error type
    const errorGroups: Record<string, any[]> = {};

    for (const cmd of failedCommands) {
      if (!type || cmd.type === type) {
        const errorType = this.categorizeError(cmd.error);

        if (!errorGroups[errorType]) {
          errorGroups[errorType] = [];
        }

        errorGroups[errorType].push({
          command: cmd.name,
          error: cmd.error,
          context: cmd.contextUsed,
          timestamp: cmd.timestamp
        });
      }
    }

    // Analyze error patterns
    Object.entries(errorGroups).forEach(([errorType, errors]) => {
      if (errors.length >= 2) {
        failures.insights.push({
          type: 'recurring-failure',
          errorType,
          occurrences: errors.length,
          description: `${errorType} errors occur frequently`,
          examples: errors.slice(0, 3)
        });

        // Generate specific recommendations
        const recommendation = this.getErrorRecommendation(errorType, errors);
        if (recommendation) {
          failures.recommendations.push(recommendation);
        }
      }
    });

    // Analyze code anti-patterns
    const antiPatterns = await this.patternRecognizer.findAntiPatterns();
    failures.patterns.push(...antiPatterns);

    return failures;
  }

  private async learnFromPatterns(type?: string, threshold: number): Promise<any> {
    console.log(`\n🔍 Analyzing code patterns (threshold: ${threshold}%)...`);

    const patterns = {
      discovered: [],
      validated: [],
      insights: [],
      recommendations: []
    };

    // Discover patterns in codebase
    const discovered = await this.patternRecognizer.analyzeCodebase();

    // Filter by type if specified
    const filtered = type
      ? discovered.filter(p => p.type === type)
      : discovered;

    // Validate patterns against threshold
    for (const pattern of filtered) {
      if (pattern.confidence >= threshold) {
        patterns.validated.push(pattern);

        // Generate insights for high-confidence patterns
        if (pattern.confidence >= 95) {
          patterns.insights.push({
            type: 'high-confidence-pattern',
            pattern: pattern.name,
            description: `${pattern.name} is used consistently across the codebase`,
            usage: pattern.usage
          });
        }
      } else {
        patterns.discovered.push(pattern);
      }
    }

    // Analyze pattern relationships
    const relationships = await this.analyzePatternRelationships(patterns.validated);
    if (relationships.length > 0) {
      patterns.insights.push(...relationships);
    }

    // Generate recommendations
    if (patterns.validated.length > 5) {
      patterns.recommendations.push('Document validated patterns in CLAUDE.md for consistency');
    }

    if (patterns.discovered.length > patterns.validated.length) {
      patterns.recommendations.push(
        `${patterns.discovered.length} patterns below threshold - consider standardizing or removing`
      );
    }

    return patterns;
  }

  private async comprehensiveLearning(type?: string, threshold: number): Promise<any> {
    console.log('\n🌐 Performing comprehensive learning analysis...');

    // Combine all learning approaches
    const [successes, failures, patterns] = await Promise.all([
      this.learnFromSuccesses(type),
      this.learnFromFailures(type),
      this.learnFromPatterns(type, threshold)
    ]);

    // Cross-reference insights
    const comprehensive = {
      patterns: [...successes.patterns, ...failures.patterns, ...patterns.validated],
      insights: [],
      recommendations: [],
      summary: {
        totalPatterns: 0,
        successPatterns: successes.patterns.length,
        failurePatterns: failures.patterns.length,
        codePatterns: patterns.validated.length,
        confidenceScore: 0
      }
    };

    // Merge and deduplicate insights
    const allInsights = [
      ...successes.insights,
      ...failures.insights,
      ...patterns.insights
    ];

    comprehensive.insights = this.deduplicateInsights(allInsights);

    // Generate holistic recommendations
    comprehensive.recommendations = this.generateHolisticRecommendations(
      successes,
      failures,
      patterns
    );

    // Calculate overall confidence
    comprehensive.summary.totalPatterns = comprehensive.patterns.length;
    comprehensive.summary.confidenceScore = this.calculateOverallConfidence(
      comprehensive.patterns
    );

    return comprehensive;
  }

  private async processLearningResults(results: any): Promise<any> {
    const processed = {
      patterns: [],
      rules: [],
      contextUpdates: [],
      metrics: {
        patternsProcessed: 0,
        rulesGenerated: 0,
        contextImprovements: 0
      }
    };

    // Process patterns
    for (const pattern of results.patterns || []) {
      const processedPattern = await this.processPattern(pattern);
      if (processedPattern) {
        processed.patterns.push(processedPattern);
        processed.metrics.patternsProcessed++;
      }
    }

    // Generate rules from insights
    for (const insight of results.insights || []) {
      const rule = this.generateRuleFromInsight(insight);
      if (rule) {
        processed.rules.push(rule);
        processed.metrics.rulesGenerated++;
      }
    }

    // Create context updates
    processed.contextUpdates = this.generateContextUpdates(
      processed.patterns,
      processed.rules
    );
    processed.metrics.contextImprovements = processed.contextUpdates.length;

    return processed;
  }

  private async processPattern(pattern: any): Promise<any> {
    // Validate pattern
    if (!pattern.name || !pattern.type) {
      return null;
    }

    // Enhance pattern with metadata
    return {
      ...pattern,
      id: this.generatePatternId(pattern),
      processed: new Date().toISOString(),
      version: '1.0',
      tags: this.generatePatternTags(pattern)
    };
  }

  private generateRuleFromInsight(insight: any): any {
    const ruleTypes: Record<string, any> = {
      'recurring-success': {
        type: 'optimization',
        priority: 'high',
        action: 'prefer',
        description: `Prefer ${insight.description}`
      },
      'recurring-failure': {
        type: 'validation',
        priority: 'critical',
        action: 'prevent',
        description: `Prevent ${insight.errorType} errors`
      },
      'high-confidence-pattern': {
        type: 'convention',
        priority: 'medium',
        action: 'enforce',
        description: `Enforce ${insight.pattern} pattern`
      }
    };

    const ruleTemplate = ruleTypes[insight.type];
    if (!ruleTemplate) {
      return null;
    }

    return {
      ...ruleTemplate,
      id: this.generateRuleId(insight),
      source: insight,
      created: new Date().toISOString()
    };
  }

  private generateContextUpdates(patterns: any[], rules: any[]): any[] {
    const updates = [];

    // Group patterns by type
    const patternGroups: Record<string, any[]> = {};
    patterns.forEach(pattern => {
      if (!patternGroups[pattern.type]) {
        patternGroups[pattern.type] = [];
      }
      patternGroups[pattern.type].push(pattern);
    });

    // Create updates for each group
    Object.entries(patternGroups).forEach(([type, groupPatterns]) => {
      if (groupPatterns.length >= 3) {
        updates.push({
          layer: 'global',
          section: `${type}-patterns`,
          content: this.formatPatternsForContext(groupPatterns),
          priority: 'medium'
        });
      }
    });

    // Add high-priority rules to context
    const criticalRules = rules.filter(r => r.priority === 'critical');
    if (criticalRules.length > 0) {
      updates.push({
        layer: 'global',
        section: 'validation-rules',
        content: this.formatRulesForContext(criticalRules),
        priority: 'high'
      });
    }

    return updates;
  }

  private async updateContextWithLearnings(processed: any): Promise<void> {
    console.log('\n🔄 Updating context system with learnings...');

    // Update pattern library
    if (processed.patterns.length > 0) {
      await this.updatePatternLibrary(processed.patterns);
    }

    // Update validation rules
    if (processed.rules.length > 0) {
      await this.updateValidationRules(processed.rules);
    }

    // Apply context updates
    for (const update of processed.contextUpdates) {
      await this.applyContextUpdate(update);
    }

    // Record learning event
    await this.learningSystem.recordLearningEvent({
      timestamp: new Date().toISOString(),
      metrics: processed.metrics,
      updates: processed.contextUpdates.length
    });
  }

  private async updatePatternLibrary(patterns: any[]): Promise<void> {
    const libraryPath = path.join(this.projectRoot, '.vibe/patterns.json');

    let library = { patterns: [], lastUpdated: '' };
    if (fs.existsSync(libraryPath)) {
      library = JSON.parse(fs.readFileSync(libraryPath, 'utf-8'));
    }

    // Merge new patterns
    patterns.forEach(pattern => {
      const existing = library.patterns.findIndex((p: any) => p.id === pattern.id);
      if (existing >= 0) {
        // Update existing pattern
        library.patterns[existing] = {
          ...library.patterns[existing],
          ...pattern,
          updateCount: (library.patterns[existing].updateCount || 0) + 1
        };
      } else {
        // Add new pattern
        library.patterns.push(pattern);
      }
    });

    library.lastUpdated = new Date().toISOString();

    // Save updated library
    const dir = path.dirname(libraryPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2));
  }

  private async updateValidationRules(rules: any[]): Promise<void> {
    const rulesPath = path.join(this.projectRoot, '.vibe/validation-rules.json');

    let ruleSet = { rules: [], lastUpdated: '' };
    if (fs.existsSync(rulesPath)) {
      ruleSet = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
    }

    // Add new rules
    rules.forEach(rule => {
      if (!ruleSet.rules.find((r: any) => r.id === rule.id)) {
        ruleSet.rules.push(rule);
      }
    });

    ruleSet.lastUpdated = new Date().toISOString();

    // Save updated rules
    const dir = path.dirname(rulesPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(rulesPath, JSON.stringify(ruleSet, null, 2));
  }

  private async applyContextUpdate(update: any): Promise<void> {
    // This would interface with the context manager
    // For now, we'll simulate the update
    console.log(`  📄 Updating ${update.layer} layer: ${update.section}`);
  }

  private async exportLearnings(processed: any): Promise<string> {
    const exportDir = path.join(this.projectRoot, 'docs/learnings');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const exportPath = path.join(
      exportDir,
      `learning-export-${new Date().toISOString().split('T')[0]}.json`
    );

    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      patterns: processed.patterns,
      rules: processed.rules,
      metrics: processed.metrics
    };

    fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2));

    return exportPath;
  }

  private formatLearningOutput(processed: any): string {
    const sections: Record<string, string> = {};

    // Summary
    sections['Learning Complete'] = '✅';

    // Metrics
    const metrics = [
      `Patterns Processed: ${processed.metrics.patternsProcessed}`,
      `Rules Generated: ${processed.metrics.rulesGenerated}`,
      `Context Improvements: ${processed.metrics.contextImprovements}`
    ];
    sections['Metrics'] = metrics.join('\n');

    // Key Insights
    if (processed.patterns.length > 0) {
      const topPatterns = processed.patterns
        .sort((a: any, b: any) => (b.confidence || 0) - (a.confidence || 0))
        .slice(0, 5)
        .map((p: any) => `- ${p.name} (${p.type}): ${p.confidence || 'N/A'}% confidence`);

      sections['Top Patterns'] = topPatterns.join('\n');
    }

    // Rules Summary
    if (processed.rules.length > 0) {
      const rulesSummary = [
        `Critical: ${processed.rules.filter((r: any) => r.priority === 'critical').length}`,
        `High: ${processed.rules.filter((r: any) => r.priority === 'high').length}`,
        `Medium: ${processed.rules.filter((r: any) => r.priority === 'medium').length}`
      ];
      sections['Rules Generated'] = rulesSummary.join(' | ');
    }

    // Context Updates
    if (processed.contextUpdates.length > 0) {
      const updates = processed.contextUpdates
        .map((u: any) => `- ${u.layer}/${u.section} (${u.priority})`)
        .slice(0, 5);

      sections['Context Updates'] = updates.join('\n');
    }

    // Next Steps
    sections['Next Steps'] = '1. Review generated patterns and rules\n2. Run /vibe-context update to apply learnings\n3. Continue development with improved context';

    return this.formatOutput(sections);
  }

  // Helper methods
  private async findSimilarPatterns(pattern: any, existing: any[]): Promise<any[]> {
    return existing.filter(p =>
      p.command === pattern.command &&
      JSON.stringify(p.parameters) === JSON.stringify(pattern.parameters)
    );
  }

  private categorizeError(error: string): string {
    if (!error) {
      return 'unknown';
    }

    if (error.includes('validation')) {
      return 'validation';
    }
    if (error.includes('not found')) {
      return 'missing-resource';
    }
    if (error.includes('permission')) {
      return 'permission';
    }
    if (error.includes('timeout')) {
      return 'performance';
    }
    if (error.includes('syntax')) {
      return 'syntax';
    }

    return 'other';
  }

  private getErrorRecommendation(errorType: string, errors: any[]): string | null {
    const recommendations: Record<string, string> = {
      'validation': 'Add pre-execution validation checks',
      'missing-resource': 'Implement resource existence checks before operations',
      'permission': 'Review file permissions and access controls',
      'performance': 'Optimize slow operations or increase timeouts',
      'syntax': 'Add syntax validation and linting'
    };

    return recommendations[errorType] || null;
  }

  private async analyzePatternRelationships(patterns: any[]): Promise<any[]> {
    const relationships = [];

    // Find patterns that often appear together
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const cooccurrence = await this.checkPatternCooccurrence(
          patterns[i],
          patterns[j]
        );

        if (cooccurrence > 0.7) {
          relationships.push({
            type: 'pattern-relationship',
            description: `${patterns[i].name} and ${patterns[j].name} often appear together`,
            confidence: cooccurrence * 100
          });
        }
      }
    }

    return relationships;
  }

  private async checkPatternCooccurrence(pattern1: any, pattern2: any): Promise<number> {
    // Simplified cooccurrence check
    if (pattern1.usage && pattern2.usage) {
      const locations1 = new Set(pattern1.usage.locations);
      const locations2 = new Set(pattern2.usage.locations);

      const intersection = [...locations1].filter(x => locations2.has(x));
      const union = new Set([...locations1, ...locations2]);

      return intersection.length / union.size;
    }

    return 0;
  }

  private deduplicateInsights(insights: any[]): any[] {
    const seen = new Set();
    return insights.filter(insight => {
      const key = `${insight.type}-${insight.description}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private generateHolisticRecommendations(
    successes: any,
    failures: any,
    patterns: any
  ): string[] {
    const recommendations = [];

    // Success-based recommendations
    if (successes.patterns.length > failures.patterns.length * 2) {
      recommendations.push('Project shows strong positive patterns - document and enforce these');
    }

    // Failure-based recommendations
    if (failures.insights.length > 3) {
      recommendations.push('Multiple failure patterns detected - implement preventive validation');
    }

    // Pattern-based recommendations
    if (patterns.validated.length < patterns.discovered.length / 2) {
      recommendations.push('Many patterns below confidence threshold - standardize codebase');
    }

    // Combined insights
    if (successes.insights.length > 0 && failures.insights.length > 0) {
      recommendations.push('Balance successful patterns with failure prevention strategies');
    }

    return recommendations;
  }

  private calculateOverallConfidence(patterns: any[]): number {
    if (patterns.length === 0) {
      return 0;
    }

    const confidences = patterns
      .map(p => p.confidence || 50)
      .filter(c => c > 0);

    return Math.round(
      confidences.reduce((sum, c) => sum + c, 0) / confidences.length
    );
  }

  private generatePatternId(pattern: any): string {
    const components = [
      pattern.type,
      pattern.name.toLowerCase().replace(/\s+/g, '-'),
      Date.now().toString(36)
    ];
    return components.join('-');
  }

  private generateRuleId(insight: any): string {
    const components = [
      'rule',
      insight.type,
      Date.now().toString(36)
    ];
    return components.join('-');
  }

  private generatePatternTags(pattern: any): string[] {
    const tags = [pattern.type];

    if (pattern.confidence > 90) {
      tags.push('high-confidence');
    }
    if (pattern.usage?.count > 10) {
      tags.push('frequently-used');
    }
    if (pattern.autoGenerated) {
      tags.push('auto-generated');
    }

    return tags;
  }

  private formatPatternsForContext(patterns: any[]): string {
    const lines = ['## Pattern Library', ''];

    patterns.forEach(pattern => {
      lines.push(`### ${pattern.name}`);
      lines.push(`- Type: ${pattern.type}`);
      lines.push(`- Confidence: ${pattern.confidence}%`);
      lines.push(`- Usage: ${pattern.usage?.count || 0} occurrences`);
      lines.push('');
    });

    return lines.join('\n');
  }

  private formatRulesForContext(rules: any[]): string {
    const lines = ['## Validation Rules', ''];

    rules.forEach(rule => {
      lines.push(`### ${rule.description}`);
      lines.push(`- Priority: ${rule.priority}`);
      lines.push(`- Action: ${rule.action}`);
      lines.push('');
    });

    return lines.join('\n');
  }
}
