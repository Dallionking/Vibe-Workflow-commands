/**
 * Context Memory Store
 * Persistent storage for context memory and learned patterns
 */

import {
  ContextMemory,
  MemorySession,
  Pattern,
  Decision,
  TeamPreference,
  SessionOutcome
} from '../types/context.types';
import * as fs from 'fs';
import * as path from 'path';

export class ContextMemoryStore {
  private memoryPath: string;
  private memory: ContextMemory;
  private autoSaveInterval: NodeJS.Timer | null = null;
  private isDirty: boolean = false;

  constructor(projectRoot: string) {
    this.memoryPath = path.join(projectRoot, '.vibe', 'context-memory.json');
    this.memory = this.loadMemory();
    
    // Auto-save every 5 minutes
    this.startAutoSave();
  }

  private loadMemory(): ContextMemory {
    try {
      if (fs.existsSync(this.memoryPath)) {
        const data = fs.readFileSync(this.memoryPath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading context memory:', error);
    }

    // Initialize with empty memory
    return {
      projectId: this.generateProjectId(),
      sessions: [],
      patterns: [],
      decisions: [],
      preferences: []
    };
  }

  private generateProjectId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      if (this.isDirty) {
        this.save();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  save(): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.memoryPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save with pretty formatting for readability
      fs.writeFileSync(
        this.memoryPath,
        JSON.stringify(this.memory, null, 2),
        'utf-8'
      );
      
      this.isDirty = false;
    } catch (error) {
      console.error('Error saving context memory:', error);
    }
  }

  // Session Management
  addSession(session: MemorySession): void {
    this.memory.sessions.push(session);
    
    // Keep only last 100 sessions
    if (this.memory.sessions.length > 100) {
      this.memory.sessions = this.memory.sessions.slice(-100);
    }
    
    this.isDirty = true;
  }

  getRecentSessions(count: number = 10): MemorySession[] {
    return this.memory.sessions.slice(-count);
  }

  getSessionsByCommand(command: string): MemorySession[] {
    return this.memory.sessions.filter(s => s.command === command);
  }

  // Pattern Management
  addPattern(pattern: Pattern): void {
    const existing = this.memory.patterns.findIndex(p => p.id === pattern.id);
    
    if (existing >= 0) {
      // Update existing pattern
      this.memory.patterns[existing] = {
        ...this.memory.patterns[existing],
        ...pattern,
        usage: {
          ...this.memory.patterns[existing].usage,
          count: this.memory.patterns[existing].usage.count + 1,
          lastUsed: new Date()
        }
      };
    } else {
      // Add new pattern
      this.memory.patterns.push(pattern);
    }
    
    this.isDirty = true;
  }

  getPatterns(type?: string, minConfidence: number = 0): Pattern[] {
    return this.memory.patterns.filter(p => {
      const typeMatch = !type || p.type === type;
      const confidenceMatch = p.confidence >= minConfidence;
      return typeMatch && confidenceMatch;
    });
  }

  getPatternsByLocation(location: string): Pattern[] {
    return this.memory.patterns.filter(p => 
      p.usage.locations.some(loc => loc.includes(location))
    );
  }

  updatePatternConfidence(patternId: string, delta: number): void {
    const pattern = this.memory.patterns.find(p => p.id === patternId);
    if (pattern) {
      pattern.confidence = Math.max(0, Math.min(100, pattern.confidence + delta));
      this.isDirty = true;
    }
  }

  // Decision Management
  recordDecision(decision: Decision): void {
    this.memory.decisions.push(decision);
    
    // Keep only last 200 decisions
    if (this.memory.decisions.length > 200) {
      this.memory.decisions = this.memory.decisions.slice(-200);
    }
    
    this.isDirty = true;
  }

  getDecisionsByType(type: string): Decision[] {
    return this.memory.decisions.filter(d => d.type === type);
  }

  getPositiveDecisions(): Decision[] {
    return this.memory.decisions.filter(d => d.impact === 'positive');
  }

  // Team Preference Management
  addPreference(preference: TeamPreference): void {
    const existing = this.memory.preferences.findIndex(p => 
      p.category === preference.category && p.preference === preference.preference
    );
    
    if (existing >= 0) {
      // Strengthen existing preference
      this.memory.preferences[existing].strength = Math.min(
        100,
        this.memory.preferences[existing].strength + 10
      );
      
      // Add new examples
      const newExamples = preference.examples.filter(e => 
        !this.memory.preferences[existing].examples.includes(e)
      );
      this.memory.preferences[existing].examples.push(...newExamples);
      
      // Keep only last 10 examples
      if (this.memory.preferences[existing].examples.length > 10) {
        this.memory.preferences[existing].examples = 
          this.memory.preferences[existing].examples.slice(-10);
      }
    } else {
      // Add new preference
      this.memory.preferences.push(preference);
    }
    
    this.isDirty = true;
  }

  getPreferences(category?: string): TeamPreference[] {
    if (category) {
      return this.memory.preferences.filter(p => p.category === category);
    }
    return this.memory.preferences;
  }

  getStrongPreferences(minStrength: number = 70): TeamPreference[] {
    return this.memory.preferences.filter(p => p.strength >= minStrength);
  }

  // Analytics and Insights
  getSuccessRate(): number {
    const recentSessions = this.memory.sessions.slice(-50);
    if (recentSessions.length === 0) return 0;
    
    const successful = recentSessions.filter(s => s.outcome.success).length;
    return (successful / recentSessions.length) * 100;
  }

  getMostUsedPatterns(limit: number = 10): Pattern[] {
    return [...this.memory.patterns]
      .sort((a, b) => b.usage.count - a.usage.count)
      .slice(0, limit);
  }

  getMemoryStats(): {
    sessions: number;
    patterns: number;
    decisions: number;
    preferences: number;
    successRate: number;
    memorySize: number;
  } {
    const memorySize = Buffer.byteLength(JSON.stringify(this.memory));
    
    return {
      sessions: this.memory.sessions.length,
      patterns: this.memory.patterns.length,
      decisions: this.memory.decisions.length,
      preferences: this.memory.preferences.length,
      successRate: this.getSuccessRate(),
      memorySize
    };
  }

  // Cleanup and Maintenance
  pruneOldSessions(daysToKeep: number = 30): void {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysToKeep);
    
    this.memory.sessions = this.memory.sessions.filter(s => 
      new Date(s.timestamp) > cutoff
    );
    
    this.isDirty = true;
  }

  pruneUnusedPatterns(minUsageCount: number = 2): void {
    this.memory.patterns = this.memory.patterns.filter(p => 
      p.usage.count >= minUsageCount
    );
    
    this.isDirty = true;
  }

  export(): string {
    return JSON.stringify(this.memory, null, 2);
  }

  import(data: string): void {
    try {
      const imported = JSON.parse(data);
      
      // Validate structure
      if (imported.projectId && imported.sessions && imported.patterns) {
        this.memory = imported;
        this.isDirty = true;
        this.save();
      } else {
        throw new Error('Invalid memory format');
      }
    } catch (error) {
      throw new Error(`Failed to import memory: ${error}`);
    }
  }

  reset(): void {
    this.memory = {
      projectId: this.generateProjectId(),
      sessions: [],
      patterns: [],
      decisions: [],
      preferences: []
    };
    this.isDirty = true;
    this.save();
  }

  destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    if (this.isDirty) {
      this.save();
    }
  }
}