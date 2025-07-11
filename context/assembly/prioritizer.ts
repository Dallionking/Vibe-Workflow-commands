/**
 * Context Prioritizer
 * Manages token budget and prioritizes context content
 */

import { 
  ContextContent, 
  ContextPriority, 
  TokenBudget 
} from '../types/context.types';

export class ContextPrioritizer {
  private priorityWeights: Record<ContextPriority, number> = {
    critical: 1000,
    high: 100,
    medium: 10,
    low: 1
  };

  private typeWeights: Record<string, number> = {
    instruction: 50,
    pattern: 30,
    knowledge: 20,
    memory: 10
  };

  prioritize(contents: ContextContent[], budget: TokenBudget): ContextContent[] {
    // Calculate scores for each content
    const scoredContents = contents.map(content => ({
      content,
      score: this.calculateScore(content)
    }));

    // Sort by score (highest first)
    scoredContents.sort((a, b) => b.score - a.score);

    // Select contents within budget
    const selected: ContextContent[] = [];
    let usedTokens = 0;

    for (const { content } of scoredContents) {
      const contentTokens = content.tokens || Math.ceil(content.content.length / 4);
      
      if (usedTokens + contentTokens <= budget.available) {
        selected.push(content);
        usedTokens += contentTokens;
      } else if (content.priority === 'critical') {
        // Always include critical content, compress if needed
        const compressed = this.compressContent(content, budget.available - usedTokens);
        if (compressed) {
          selected.push(compressed);
          usedTokens += compressed.tokens || 0;
        }
      }
    }

    return selected;
  }

  private calculateScore(content: ContextContent): number {
    const priorityScore = this.priorityWeights[content.priority];
    const typeScore = this.typeWeights[content.type] || 0;
    
    // Additional scoring factors
    let recencyScore = 0;
    if (content.metadata.timestamp) {
      const age = Date.now() - content.metadata.timestamp.getTime();
      const dayInMs = 24 * 60 * 60 * 1000;
      recencyScore = Math.max(0, 100 - (age / dayInMs) * 10);
    }

    // Dependency bonus
    const dependencyScore = (content.metadata.dependencies?.length || 0) * 5;

    // Tag relevance (could be enhanced with current task context)
    const tagScore = content.metadata.tags.length * 2;

    return priorityScore + typeScore + recencyScore + dependencyScore + tagScore;
  }

  private compressContent(content: ContextContent, maxTokens: number): ContextContent | null {
    const currentTokens = content.tokens || Math.ceil(content.content.length / 4);
    
    if (currentTokens <= maxTokens) {
      return content;
    }

    // Calculate compression ratio needed
    const compressionRatio = maxTokens / currentTokens;
    
    if (compressionRatio < 0.2) {
      // Too much compression needed, skip
      return null;
    }

    // Compress based on content type
    let compressed: string;
    
    switch (content.type) {
      case 'instruction':
        // Keep key instructions, remove examples
        compressed = this.compressInstructions(content.content, compressionRatio);
        break;
      
      case 'knowledge':
        // Summarize knowledge
        compressed = this.summarizeKnowledge(content.content, compressionRatio);
        break;
      
      case 'pattern':
        // Keep pattern signatures, remove examples
        compressed = this.compressPatterns(content.content, compressionRatio);
        break;
      
      default:
        // Simple truncation for other types
        compressed = this.truncateContent(content.content, compressionRatio);
    }

    return {
      ...content,
      content: compressed,
      tokens: Math.ceil(compressed.length / 4),
      metadata: {
        ...content.metadata,
        tags: [...content.metadata.tags, 'compressed']
      }
    };
  }

  private compressInstructions(content: string, ratio: number): string {
    const lines = content.split('\n');
    const important = lines.filter(line => 
      line.includes('MUST') ||
      line.includes('CRITICAL') ||
      line.includes('REQUIRED') ||
      line.match(/^\d+\./) || // Numbered items
      line.match(/^[-*]/) // Bullet points
    );

    const targetLines = Math.floor(important.length * ratio);
    return important.slice(0, Math.max(targetLines, 3)).join('\n');
  }

  private summarizeKnowledge(content: string, ratio: number): string {
    // Extract key information
    const sections = content.split('\n\n');
    const targetSections = Math.max(1, Math.floor(sections.length * ratio));
    
    // Prioritize sections with headers or key information
    const prioritizedSections = sections
      .map(section => ({
        section,
        score: this.scoreSectionImportance(section)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, targetSections)
      .map(s => s.section);

    return prioritizedSections.join('\n\n');
  }

  private scoreSectionImportance(section: string): number {
    let score = 0;
    
    // Headers indicate structure
    if (section.match(/^#+\s/m)) score += 50;
    
    // Code blocks are often important
    if (section.includes('```')) score += 30;
    
    // Lists contain key points
    if (section.match(/^[-*\d]+\./m)) score += 20;
    
    // Key terms
    const keyTerms = ['required', 'must', 'critical', 'important', 'note'];
    keyTerms.forEach(term => {
      if (section.toLowerCase().includes(term)) score += 10;
    });
    
    // Length penalty (prefer concise sections)
    score -= section.length / 100;
    
    return score;
  }

  private compressPatterns(content: string, ratio: number): string {
    // Keep pattern definitions, remove examples
    const lines = content.split('\n');
    const compressed: string[] = [];
    let inExample = false;
    
    for (const line of lines) {
      if (line.toLowerCase().includes('example:')) {
        inExample = true;
        compressed.push(line + ' [compressed]');
      } else if (inExample && line.trim() === '') {
        inExample = false;
      } else if (!inExample) {
        compressed.push(line);
      }
    }
    
    const result = compressed.join('\n');
    const targetLength = Math.floor(result.length * ratio);
    
    return result.substring(0, targetLength) + '...';
  }

  private truncateContent(content: string, ratio: number): string {
    const targetLength = Math.floor(content.length * ratio);
    
    // Try to truncate at a natural boundary
    const truncated = content.substring(0, targetLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    
    const cutPoint = Math.max(lastPeriod, lastNewline);
    
    if (cutPoint > targetLength * 0.8) {
      return truncated.substring(0, cutPoint + 1) + '...';
    }
    
    return truncated + '...';
  }

  adjustBudget(contents: ContextContent[], newBudget: TokenBudget): ContextContent[] {
    return this.prioritize(contents, newBudget);
  }

  getTokenUsage(contents: ContextContent[]): number {
    return contents.reduce((sum, content) => {
      return sum + (content.tokens || Math.ceil(content.content.length / 4));
    }, 0);
  }

  suggestOptimalBudget(contents: ContextContent[]): TokenBudget {
    // Calculate tokens needed for all critical content
    const criticalTokens = contents
      .filter(c => c.priority === 'critical')
      .reduce((sum, c) => sum + (c.tokens || Math.ceil(c.content.length / 4)), 0);
    
    // Calculate tokens for high priority
    const highTokens = contents
      .filter(c => c.priority === 'high')
      .reduce((sum, c) => sum + (c.tokens || Math.ceil(c.content.length / 4)), 0);
    
    // Suggest budget with 20% buffer
    const suggested = Math.ceil((criticalTokens + highTokens) * 1.2);
    
    return {
      total: suggested,
      used: 0,
      reserved: Math.ceil(suggested * 0.1), // 10% reserve
      available: Math.ceil(suggested * 0.9)
    };
  }
}