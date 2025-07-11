/**
 * Task Context Layer (L3)
 * Task-specific context that changes based on current task execution
 */

import { ContextLayer, ContextContent, ContextLayerType, TokenBudget } from '../types/context.types';
import * as fs from 'fs';
import * as path from 'path';

export class TaskContextLayer implements ContextLayer {
  type: ContextLayerType = 'task';
  name = 'Task Context Layer';
  enabled = true;
  contents: ContextContent[] = [];
  budget: TokenBudget;
  rules = [];

  private projectRoot: string;
  private currentTask: string | null = null;
  private taskHistory: Array<{task: string, timestamp: Date}> = [];
  private executionContext: Map<string, any> = new Map();

  constructor(projectRoot: string, tokenBudget: number = 2000) {
    this.projectRoot = projectRoot;
    this.budget = {
      total: tokenBudget,
      used: 0,
      reserved: 0,
      available: tokenBudget
    };
  }

  async load(taskName?: string, taskParams?: Record<string, any>): Promise<void> {
    if (taskName) {
      this.currentTask = taskName;
      this.taskHistory.push({ task: taskName, timestamp: new Date() });
    }

    // Clear previous contents
    this.contents = [];

    if (this.currentTask) {
      // Load task-specific instructions
      await this.loadTaskInstructions();
      
      // Load recent file changes
      await this.loadRecentChanges();
      
      // Load task parameters
      if (taskParams) {
        this.loadTaskParameters(taskParams);
      }
      
      // Load error context if retrying
      await this.loadErrorContext();
      
      // Load related code context
      await this.loadCodeContext();
    }

    // Update token usage
    this.updateTokenUsage();
  }

  private async loadTaskInstructions(): Promise<void> {
    // Map task names to specific instructions
    const taskInstructions = this.getTaskInstructions(this.currentTask || '');
    
    if (taskInstructions) {
      this.contents.push({
        id: `task-${this.currentTask}-instructions`,
        type: 'instruction',
        layer: 'task',
        priority: 'critical',
        content: taskInstructions,
        metadata: {
          source: 'task-instructions',
          timestamp: new Date(),
          version: '1.0',
          tags: ['task', 'instructions', this.currentTask || '']
        }
      });
    }
  }

  private getTaskInstructions(taskName: string): string | null {
    const instructions: Record<string, string> = {
      'vibe-init': `Initialize a new Vibe Coding project:
1. Create project structure with all required directories
2. Initialize git repository with .gitignore
3. Create initial CLAUDE.md with project conventions
4. Set up phase tracking in .vibe-status.md
5. Create templates directory with phase templates`,
      
      'vibe-step-1-ideation': `Execute Step 1 - Feature Ideation:
1. Use MCP tools to research similar features
2. Generate comprehensive feature specifications
3. Create user stories and acceptance criteria
4. Define success metrics
5. Output to docs/vibe-coding/01-feature-ideation.md`,
      
      'vibe-retrofit': `Retrofit existing codebase:
1. Analyze current code structure and patterns
2. Detect technology stack and conventions
3. Create pattern library from existing code
4. Generate retrofit plan maintaining compatibility
5. Preserve all existing functionality`,
      
      'vibe-validate-work': `Validate code quality:
1. Run static code analysis
2. Check test coverage (must be 95%+)
3. Scan for security vulnerabilities
4. Verify integration points
5. Check documentation completeness`,
      
      'vibe-ui-healer': `Validate and heal UI components:
1. Launch browser automation with Playwright
2. Take screenshots of all UI states
3. Grade against design system (target 8+/10)
4. Auto-fix accessibility issues
5. Validate responsive breakpoints`
    };
    
    return instructions[taskName] || null;
  }

  private async loadRecentChanges(): Promise<void> {
    try {
      // Get git status for recent changes
      const { execSync } = require('child_process');
      const gitStatus = execSync('git status --porcelain', { 
        cwd: this.projectRoot,
        encoding: 'utf-8'
      });
      
      if (gitStatus.trim()) {
        this.contents.push({
          id: 'recent-changes',
          type: 'knowledge',
          layer: 'task',
          priority: 'high',
          content: `Recent changes:\n${gitStatus}`,
          metadata: {
            source: 'git-status',
            timestamp: new Date(),
            version: '1.0',
            tags: ['changes', 'git', 'current']
          }
        });
      }
      
      // Get last commit for context
      const lastCommit = execSync('git log -1 --oneline', {
        cwd: this.projectRoot,
        encoding: 'utf-8'
      });
      
      if (lastCommit.trim()) {
        this.contents.push({
          id: 'last-commit',
          type: 'knowledge',
          layer: 'task',
          priority: 'medium',
          content: `Last commit: ${lastCommit}`,
          metadata: {
            source: 'git-log',
            timestamp: new Date(),
            version: '1.0',
            tags: ['commit', 'git', 'history']
          }
        });
      }
    } catch (error) {
      // Git not available or not a git repo
      console.debug('Git context not available:', error);
    }
  }

  private loadTaskParameters(params: Record<string, any>): void {
    const paramString = Object.entries(params)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join('\n');
    
    this.contents.push({
      id: 'task-parameters',
      type: 'knowledge',
      layer: 'task',
      priority: 'high',
      content: `Task parameters:\n${paramString}`,
      metadata: {
        source: 'task-params',
        timestamp: new Date(),
        version: '1.0',
        tags: ['parameters', 'task', 'input']
      }
    });
    
    // Store in execution context
    Object.entries(params).forEach(([key, value]) => {
      this.executionContext.set(key, value);
    });
  }

  private async loadErrorContext(): Promise<void> {
    // Check if we have stored error context from previous attempts
    const errorKey = `error-${this.currentTask}`;
    const storedError = this.executionContext.get(errorKey);
    
    if (storedError) {
      this.contents.push({
        id: 'previous-error',
        type: 'knowledge',
        layer: 'task',
        priority: 'critical',
        content: `Previous attempt failed with:\n${storedError}\n\nPlease avoid this error in the current attempt.`,
        metadata: {
          source: 'error-context',
          timestamp: new Date(),
          version: '1.0',
          tags: ['error', 'retry', 'context']
        }
      });
    }
  }

  private async loadCodeContext(): Promise<void> {
    // Load relevant code based on task
    const codeFiles = this.getRelevantCodeFiles(this.currentTask || '');
    
    for (const file of codeFiles) {
      const filePath = path.join(this.projectRoot, file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const summary = this.summarizeCode(content, file);
        
        if (summary) {
          this.contents.push({
            id: `code-context-${path.basename(file)}`,
            type: 'knowledge',
            layer: 'task',
            priority: 'medium',
            content: summary,
            metadata: {
              source: file,
              timestamp: new Date(),
              version: '1.0',
              tags: ['code', 'context', path.extname(file).substring(1)]
            }
          });
        }
      }
    }
  }

  private getRelevantCodeFiles(taskName: string): string[] {
    const fileMap: Record<string, string[]> = {
      'vibe-retrofit': [
        'src/index.ts',
        'src/main.ts',
        'src/App.tsx',
        'src/app.ts'
      ],
      'vibe-validate-work': [
        '.eslintrc.json',
        'jest.config.js',
        'vitest.config.ts',
        'tsconfig.json'
      ],
      'vibe-ui-healer': [
        'src/styles/theme.ts',
        'src/components/index.ts',
        'tailwind.config.js'
      ]
    };
    
    return fileMap[taskName] || [];
  }

  private summarizeCode(content: string, filename: string): string {
    const lines = content.split('\n');
    const maxLines = 50;
    
    if (lines.length <= maxLines) {
      return content;
    }
    
    // Extract imports and exports
    const imports = lines.filter(line => line.includes('import') || line.includes('require'));
    const exports = lines.filter(line => line.includes('export'));
    
    // Extract function/class signatures
    const signatures = lines.filter(line => 
      line.includes('function') || 
      line.includes('class') || 
      line.includes('interface') ||
      line.includes('const') && line.includes('=>')
    );
    
    return [
      `File: ${filename} (${lines.length} lines)`,
      '',
      'Imports:',
      ...imports.slice(0, 10),
      '',
      'Key definitions:',
      ...signatures.slice(0, 20),
      '',
      'Exports:',
      ...exports.slice(0, 10)
    ].join('\n');
  }

  private updateTokenUsage(): void {
    const totalChars = this.contents.reduce((sum, content) => {
      return sum + content.content.length;
    }, 0);
    
    this.budget.used = Math.ceil(totalChars / 4);
    this.budget.available = this.budget.total - this.budget.used;
    
    this.contents.forEach(content => {
      content.tokens = Math.ceil(content.content.length / 4);
    });
  }

  setTask(taskName: string): void {
    this.currentTask = taskName;
  }

  setError(error: string): void {
    if (this.currentTask) {
      this.executionContext.set(`error-${this.currentTask}`, error);
    }
  }

  clearError(): void {
    if (this.currentTask) {
      this.executionContext.delete(`error-${this.currentTask}`);
    }
  }

  getTaskHistory(): Array<{task: string, timestamp: Date}> {
    return [...this.taskHistory];
  }

  async refresh(): Promise<void> {
    await this.load(this.currentTask || undefined);
  }
}