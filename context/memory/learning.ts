/**
 * Context Learning System
 * Learns from development sessions to improve future context assembly
 */

import {
  ContextMemory,
  Pattern,
  Decision,
  TeamPreference,
  SessionOutcome,
  MemorySession
} from '../types/context.types';
import { ContextMemoryStore } from './store';
import { PatternRecognizer } from './patterns';

export interface LearningInsight {
  type: 'pattern' | 'preference' | 'optimization' | 'warning';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  recommendation?: string;
}

export interface LearningMetrics {
  patternAccuracy: number;
  contextEfficiency: number;
  successRate: number;
  tokenSavings: number;
  improvementTrend: number;
}

export class ContextLearningSystem {
  private memoryStore: ContextMemoryStore;
  private patternRecognizer: PatternRecognizer;
  private learningThreshold = 3; // Minimum occurrences before learning

  constructor(projectRoot: string) {
    this.memoryStore = new ContextMemoryStore(projectRoot);
    this.patternRecognizer = new PatternRecognizer(projectRoot);
  }

  async learnFromSession(session: MemorySession): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Store the session
    this.memoryStore.addSession(session);

    // Learn from successful sessions
    if (session.outcome.success) {
      // Extract and learn patterns
      const patternInsights = await this.learnPatterns(session);
      insights.push(...patternInsights);

      // Learn team preferences
      const preferenceInsights = this.learnPreferences(session);
      insights.push(...preferenceInsights);

      // Learn optimization opportunities
      const optimizationInsights = this.learnOptimizations(session);
      insights.push(...optimizationInsights);
    } else {
      // Learn from failures
      const failureInsights = this.learnFromFailure(session);
      insights.push(...failureInsights);
    }

    // Save learnings
    this.memoryStore.save();

    return insights;
  }

  private async learnPatterns(session: MemorySession): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Check if any new patterns emerged
    if (session.outcome.learnedPatterns && session.outcome.learnedPatterns.length > 0) {
      for (const pattern of session.outcome.learnedPatterns) {
        this.memoryStore.addPattern(pattern);
        
        insights.push({
          type: 'pattern',
          title: `New ${pattern.type} pattern discovered`,
          description: `Identified pattern: ${pattern.pattern}`,
          confidence: pattern.confidence,
          actionable: true,
          recommendation: `Consider using this pattern for future ${pattern.type} implementations`
        });
      }
    }

    // Reinforce existing patterns that were used successfully
    const activePatterns = session.context.activePatterns || [];
    for (const patternId of activePatterns) {
      this.memoryStore.updatePatternConfidence(patternId, 2); // Increase confidence
    }

    // Check for pattern evolution
    const similarSessions = this.memoryStore.getSessionsByCommand(session.command);
    if (similarSessions.length >= this.learningThreshold) {
      const evolutionInsight = this.detectPatternEvolution(similarSessions);
      if (evolutionInsight) insights.push(evolutionInsight);
    }

    return insights;
  }

  private detectPatternEvolution(sessions: MemorySession[]): LearningInsight | null {
    // Group patterns by type
    const patternUsage = new Map<string, number>();
    
    sessions.forEach(session => {
      session.context.activePatterns?.forEach(patternId => {
        patternUsage.set(patternId, (patternUsage.get(patternId) || 0) + 1);
      });
    });

    // Find trending patterns
    const trending = Array.from(patternUsage.entries())
      .sort(([, a], [, b]) => b - a)
      .filter(([, count]) => count > sessions.length * 0.6);

    if (trending.length > 0) {
      const patterns = trending.map(([id]) => 
        this.memoryStore.getPatterns().find(p => p.id === id)
      ).filter(Boolean);

      return {
        type: 'pattern',
        title: 'Pattern Evolution Detected',
        description: `Consistent use of ${patterns[0]?.name} pattern across similar tasks`,
        confidence: 85,
        actionable: true,
        recommendation: 'Standardize this pattern in your codebase guidelines'
      };
    }

    return null;
  }

  private learnPreferences(session: MemorySession): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Extract preferences from successful outcomes
    const metrics = session.outcome.metrics;
    
    // Code style preferences
    if (metrics.codeStyleScore && metrics.codeStyleScore > 90) {
      const codeContext = session.context.layers
        .flatMap(l => l.contents)
        .find(c => c.type === 'instruction');
      
      if (codeContext) {
        this.memoryStore.addPreference({
          category: 'code-style',
          preference: 'current-style',
          examples: [codeContext.content.substring(0, 200)],
          strength: metrics.codeStyleScore
        });
      }
    }

    // Performance preferences
    if (metrics.performanceScore && metrics.performanceScore > 85) {
      const preference: TeamPreference = {
        category: 'performance',
        preference: 'optimization-focus',
        examples: [`Token efficiency: ${session.context.tokenUsage.used}/${session.context.tokenUsage.total}`],
        strength: metrics.performanceScore
      };
      
      this.memoryStore.addPreference(preference);
      
      insights.push({
        type: 'preference',
        title: 'Performance Preference Noted',
        description: 'Your team values performance optimization',
        confidence: 75,
        actionable: true,
        recommendation: 'Context will prioritize performance-related content'
      });
    }

    return insights;
  }

  private learnOptimizations(session: MemorySession): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Token usage optimization
    const tokenEfficiency = session.context.tokenUsage.used / session.context.tokenUsage.total;
    
    if (tokenEfficiency < 0.6 && session.outcome.success) {
      insights.push({
        type: 'optimization',
        title: 'Token Usage Optimization',
        description: `Only ${Math.round(tokenEfficiency * 100)}% of allocated tokens were needed`,
        confidence: 90,
        actionable: true,
        recommendation: 'Reduce token budget for similar tasks to improve efficiency'
      });
    }

    // Context layer optimization
    const layerUsage = this.analyzeLayerUsage(session);
    if (layerUsage.unusedLayers.length > 0) {
      insights.push({
        type: 'optimization',
        title: 'Unused Context Layers',
        description: `Layers not used: ${layerUsage.unusedLayers.join(', ')}`,
        confidence: 80,
        actionable: true,
        recommendation: 'Consider disabling these layers for similar tasks'
      });
    }

    return insights;
  }

  private analyzeLayerUsage(session: MemorySession): { 
    usedLayers: string[]; 
    unusedLayers: string[]; 
  } {
    const allLayers = ['global', 'phase', 'task'];
    const usedLayers = session.context.layers
      .filter(l => l.contents.length > 0)
      .map(l => l.type);
    
    const unusedLayers = allLayers.filter(l => !usedLayers.includes(l));
    
    return { usedLayers, unusedLayers };
  }

  private learnFromFailure(session: MemorySession): LearningInsight[] {
    const insights: LearningInsight[] = [];

    // Record the failure as a decision
    const decision: Decision = {
      id: `failure-${Date.now()}`,
      type: 'execution-failure',
      context: session.command,
      choice: 'failed-execution',
      reasoning: session.outcome.feedback || 'Unknown failure',
      timestamp: new Date(),
      impact: 'negative'
    };
    
    this.memoryStore.recordDecision(decision);

    // Look for failure patterns
    const similarFailures = this.memoryStore.getDecisionsByType('execution-failure')
      .filter(d => d.context === session.command);
    
    if (similarFailures.length >= this.learningThreshold) {
      insights.push({
        type: 'warning',
        title: 'Recurring Failure Pattern',
        description: `Command '${session.command}' has failed ${similarFailures.length} times`,
        confidence: 95,
        actionable: true,
        recommendation: 'Review command implementation and context requirements'
      });
    }

    // Analyze token usage in failures
    if (session.context.tokenUsage.used > session.context.tokenUsage.total * 0.95) {
      insights.push({
        type: 'warning',
        title: 'Token Limit May Cause Failures',
        description: 'Context was near token limit when failure occurred',
        confidence: 70,
        actionable: true,
        recommendation: 'Increase token budget or improve context prioritization'
      });
    }

    return insights;
  }

  async getRecommendations(command: string, params: any): Promise<string[]> {
    const recommendations: string[] = [];

    // Get similar past sessions
    const similarSessions = this.memoryStore.getSessionsByCommand(command);
    const successfulSessions = similarSessions.filter(s => s.outcome.success);
    
    if (successfulSessions.length > 0) {
      // Token budget recommendation
      const avgTokens = successfulSessions.reduce((sum, s) => 
        sum + s.context.tokenUsage.used, 0
      ) / successfulSessions.length;
      
      recommendations.push(
        `Recommended token budget: ${Math.ceil(avgTokens * 1.2)} tokens (based on ${successfulSessions.length} successful executions)`
      );

      // Pattern recommendations
      const commonPatterns = this.findCommonPatterns(successfulSessions);
      if (commonPatterns.length > 0) {
        recommendations.push(
          `Recommended patterns: ${commonPatterns.map(p => p.name).join(', ')}`
        );
      }
    }

    // Preference-based recommendations
    const strongPreferences = this.memoryStore.getStrongPreferences();
    if (strongPreferences.length > 0) {
      recommendations.push(
        `Team preferences detected: ${strongPreferences.map(p => p.category).join(', ')}`
      );
    }

    // Failure warnings
    const failures = this.memoryStore.getDecisionsByType('execution-failure')
      .filter(d => d.context === command);
    
    if (failures.length > 0) {
      recommendations.push(
        `⚠️ Warning: This command has failed ${failures.length} time(s) previously`
      );
    }

    return recommendations;
  }

  private findCommonPatterns(sessions: MemorySession[]): Pattern[] {
    const patternCounts = new Map<string, number>();
    
    sessions.forEach(session => {
      session.context.activePatterns?.forEach(patternId => {
        patternCounts.set(patternId, (patternCounts.get(patternId) || 0) + 1);
      });
    });

    // Get patterns used in >60% of sessions
    const threshold = sessions.length * 0.6;
    const commonPatternIds = Array.from(patternCounts.entries())
      .filter(([, count]) => count >= threshold)
      .map(([id]) => id);

    return commonPatternIds
      .map(id => this.memoryStore.getPatterns().find(p => p.id === id))
      .filter(Boolean) as Pattern[];
  }

  getLearningMetrics(): LearningMetrics {
    const sessions = this.memoryStore.getRecentSessions(50);
    const successRate = this.memoryStore.getSuccessRate();
    
    // Calculate pattern accuracy
    const patternsWithHighConfidence = this.memoryStore.getPatterns()
      .filter(p => p.confidence > 80).length;
    const totalPatterns = this.memoryStore.getPatterns().length;
    const patternAccuracy = totalPatterns > 0 ? 
      (patternsWithHighConfidence / totalPatterns) * 100 : 0;

    // Calculate context efficiency
    const avgTokenEfficiency = sessions.reduce((sum, s) => {
      const efficiency = s.context.tokenUsage.used / s.context.tokenUsage.total;
      return sum + efficiency;
    }, 0) / Math.max(sessions.length, 1);

    // Calculate token savings
    const potentialTokens = sessions.reduce((sum, s) => 
      sum + s.context.tokenUsage.total, 0
    );
    const actualTokens = sessions.reduce((sum, s) => 
      sum + s.context.tokenUsage.used, 0
    );
    const tokenSavings = potentialTokens > 0 ? 
      ((potentialTokens - actualTokens) / potentialTokens) * 100 : 0;

    // Calculate improvement trend
    const recentSessions = sessions.slice(-10);
    const olderSessions = sessions.slice(-20, -10);
    
    const recentSuccess = recentSessions.filter(s => s.outcome.success).length;
    const olderSuccess = olderSessions.filter(s => s.outcome.success).length;
    
    const improvementTrend = olderSessions.length > 0 ?
      ((recentSuccess / recentSessions.length) - (olderSuccess / olderSessions.length)) * 100 : 0;

    return {
      patternAccuracy,
      contextEfficiency: avgTokenEfficiency * 100,
      successRate,
      tokenSavings,
      improvementTrend
    };
  }

  async suggestContextImprovements(): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];
    const metrics = this.getLearningMetrics();

    // Low success rate
    if (metrics.successRate < 70) {
      insights.push({
        type: 'warning',
        title: 'Low Success Rate',
        description: `Only ${Math.round(metrics.successRate)}% of recent sessions succeeded`,
        confidence: 100,
        actionable: true,
        recommendation: 'Review error patterns and adjust context assembly strategy'
      });
    }

    // Poor context efficiency
    if (metrics.contextEfficiency > 90) {
      insights.push({
        type: 'optimization',
        title: 'Context Overload',
        description: 'Context is consistently near capacity',
        confidence: 85,
        actionable: true,
        recommendation: 'Increase token budgets or improve content prioritization'
      });
    }

    // Positive improvement trend
    if (metrics.improvementTrend > 10) {
      insights.push({
        type: 'optimization',
        title: 'Positive Learning Trend',
        description: `${Math.round(metrics.improvementTrend)}% improvement in recent sessions`,
        confidence: 90,
        actionable: false
      });
    }

    // Pattern recommendations
    const underusedPatterns = this.memoryStore.getPatterns()
      .filter(p => p.confidence > 80 && p.usage.count < 5);
    
    if (underusedPatterns.length > 0) {
      insights.push({
        type: 'pattern',
        title: 'Underutilized High-Confidence Patterns',
        description: `${underusedPatterns.length} patterns with high confidence are rarely used`,
        confidence: 75,
        actionable: true,
        recommendation: 'Review and promote these patterns in your development workflow'
      });
    }

    return insights;
  }
}