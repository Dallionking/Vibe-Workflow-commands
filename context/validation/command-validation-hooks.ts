/**
 * Command Validation Hooks
 * Pre and post execution validation for Vibe commands
 */

import { ValidationGateSystem } from '../validation-gates';
import { DynamicContextManager } from '../assembly/dynamic-context-manager';
import { ContextMemoryStore } from '../memory/store';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface ValidationHook {
  id: string;
  name: string;
  type: 'pre' | 'post' | 'both';
  commands: string[] | '*';
  validate: (context: HookContext) => Promise<HookResult>;
  autoFix?: (context: HookContext) => Promise<boolean>;
}

export interface HookContext {
  command: string;
  params: any;
  projectRoot: string;
  phase?: string;
  previousResult?: any;
}

export interface HookResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  fixable: boolean;
  metadata?: Record<string, any>;
}

export class CommandValidationHooks {
  private gateSystem: ValidationGateSystem;
  private dynamicManager: DynamicContextManager;
  private memoryStore: ContextMemoryStore;
  private projectRoot: string;
  private hooks: Map<string, ValidationHook> = new Map();
  private executionHistory: Array<{
    command: string;
    timestamp: Date;
    preValidation: HookResult;
    postValidation?: HookResult;
  }> = [];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.gateSystem = new ValidationGateSystem();
    this.dynamicManager = new DynamicContextManager(projectRoot);
    this.memoryStore = new ContextMemoryStore(projectRoot);
    
    this.registerDefaultHooks();
  }

  private registerDefaultHooks(): void {
    // Git status check
    this.registerHook({
      id: 'git-status-check',
      name: 'Git Status Validation',
      type: 'pre',
      commands: ['vibe-commit', 'vibe-deploy', 'git-commit'],
      validate: async (context) => {
        try {
          const status = execSync('git status --porcelain', {
            cwd: context.projectRoot,
            encoding: 'utf-8'
          });
          
          const hasChanges = status.trim().length > 0;
          
          return {
            valid: hasChanges,
            errors: hasChanges ? [] : ['No changes to commit'],
            warnings: [],
            suggestions: hasChanges ? [] : ['Make some changes before committing'],
            fixable: false,
            metadata: { gitStatus: status }
          };
        } catch (error) {
          return {
            valid: false,
            errors: ['Git repository not found'],
            warnings: [],
            suggestions: ['Initialize git with: git init'],
            fixable: true
          };
        }
      },
      autoFix: async (context) => {
        try {
          execSync('git init', { cwd: context.projectRoot });
          return true;
        } catch {
          return false;
        }
      }
    });

    // Test coverage check
    this.registerHook({
      id: 'test-coverage',
      name: 'Test Coverage Validation',
      type: 'post',
      commands: ['vibe-validate-work', 'vibe-test-runner'],
      validate: async (context) => {
        const result = context.previousResult;
        const coverage = result?.coverage || 0;
        const required = 95;
        
        return {
          valid: coverage >= required,
          errors: coverage < required ? 
            [`Test coverage ${coverage}% is below required ${required}%`] : [],
          warnings: coverage < required + 5 ? 
            ['Test coverage is close to minimum threshold'] : [],
          suggestions: coverage < required ? 
            ['Write more tests to increase coverage'] : [],
          fixable: false,
          metadata: { coverage, required }
        };
      }
    });

    // Dependency check
    this.registerHook({
      id: 'dependency-check',
      name: 'Dependency Validation',
      type: 'pre',
      commands: ['vibe-init', 'vibe-install', 'npm-install'],
      validate: async (context) => {
        const packageJsonPath = path.join(context.projectRoot, 'package.json');
        
        if (!fs.existsSync(packageJsonPath)) {
          return {
            valid: false,
            errors: ['package.json not found'],
            warnings: [],
            suggestions: ['Run npm init to create package.json'],
            fixable: true
          };
        }
        
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          const hasDeps = packageJson.dependencies || packageJson.devDependencies;
          
          return {
            valid: true,
            errors: [],
            warnings: !hasDeps ? ['No dependencies defined'] : [],
            suggestions: [],
            fixable: false,
            metadata: { packageName: packageJson.name }
          };
        } catch (error) {
          return {
            valid: false,
            errors: ['Invalid package.json'],
            warnings: [],
            suggestions: ['Fix package.json syntax'],
            fixable: false
          };
        }
      },
      autoFix: async (context) => {
        try {
          execSync('npm init -y', { cwd: context.projectRoot });
          return true;
        } catch {
          return false;
        }
      }
    });

    // Build artifact check
    this.registerHook({
      id: 'build-artifacts',
      name: 'Build Artifacts Validation',
      type: 'post',
      commands: ['vibe-build', 'npm-build'],
      validate: async (context) => {
        const distPath = path.join(context.projectRoot, 'dist');
        const buildPath = path.join(context.projectRoot, 'build');
        
        const hasArtifacts = fs.existsSync(distPath) || fs.existsSync(buildPath);
        
        return {
          valid: hasArtifacts,
          errors: hasArtifacts ? [] : ['No build artifacts found'],
          warnings: [],
          suggestions: hasArtifacts ? [] : ['Check build configuration'],
          fixable: false,
          metadata: {
            distExists: fs.existsSync(distPath),
            buildExists: fs.existsSync(buildPath)
          }
        };
      }
    });

    // Documentation completeness
    this.registerHook({
      id: 'documentation-check',
      name: 'Documentation Validation',
      type: 'both',
      commands: ['vibe-step-*', 'vibe-document'],
      validate: async (context) => {
        const phase = context.phase || 'unknown';
        const docPath = path.join(
          context.projectRoot, 
          'docs/vibe-coding',
          `${phase}.md`
        );
        
        const exists = fs.existsSync(docPath);
        let completeness = 0;
        
        if (exists) {
          const content = fs.readFileSync(docPath, 'utf-8');
          // Simple completeness check based on content length and sections
          const sections = content.match(/^##\s/gm)?.length || 0;
          const length = content.length;
          completeness = Math.min(100, (sections * 10) + (length / 100));
        }
        
        return {
          valid: exists && completeness > 80,
          errors: !exists ? ['Documentation file not found'] : 
                  completeness <= 80 ? ['Documentation incomplete'] : [],
          warnings: completeness > 80 && completeness < 90 ? 
                   ['Documentation could be more detailed'] : [],
          suggestions: completeness < 90 ? 
                      ['Add more sections and details to documentation'] : [],
          fixable: !exists,
          metadata: { exists, completeness, path: docPath }
        };
      },
      autoFix: async (context) => {
        const phase = context.phase || 'unknown';
        const docPath = path.join(
          context.projectRoot, 
          'docs/vibe-coding',
          `${phase}.md`
        );
        
        // Create directory if needed
        const dir = path.dirname(docPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Create basic template
        const template = `# ${phase.charAt(0).toUpperCase() + phase.slice(1)} Documentation

## Overview
[Add overview here]

## Details
[Add details here]

## Next Steps
[Add next steps here]
`;
        
        fs.writeFileSync(docPath, template);
        return true;
      }
    });

    // Security scan
    this.registerHook({
      id: 'security-scan',
      name: 'Security Validation',
      type: 'post',
      commands: ['vibe-validate-work', 'vibe-security-scan'],
      validate: async (context) => {
        // Check for common security issues
        const issues: string[] = [];
        
        // Check for hardcoded secrets
        const files = this.findFiles(context.projectRoot, ['.js', '.ts', '.jsx', '.tsx']);
        for (const file of files.slice(0, 100)) { // Limit to 100 files for performance
          const content = fs.readFileSync(file, 'utf-8');
          
          // Simple patterns - in real implementation use proper secret scanning
          if (content.match(/api[_-]?key\s*=\s*["'][^"']+["']/i)) {
            issues.push(`Potential hardcoded API key in ${file}`);
          }
          if (content.match(/password\s*=\s*["'][^"']+["']/i)) {
            issues.push(`Potential hardcoded password in ${file}`);
          }
        }
        
        return {
          valid: issues.length === 0,
          errors: issues,
          warnings: [],
          suggestions: issues.length > 0 ? 
            ['Use environment variables for sensitive data'] : [],
          fixable: false,
          metadata: { filesScanned: files.length }
        };
      }
    });
  }

  registerHook(hook: ValidationHook): void {
    this.hooks.set(hook.id, hook);
  }

  async validatePreExecution(command: string, params: any): Promise<HookResult> {
    const applicableHooks = this.getApplicableHooks(command, 'pre');
    const results: HookResult[] = [];
    
    for (const hook of applicableHooks) {
      const context: HookContext = {
        command,
        params,
        projectRoot: this.projectRoot,
        phase: await this.getCurrentPhase()
      };
      
      const result = await hook.validate(context);
      results.push(result);
      
      // Try auto-fix if available and needed
      if (!result.valid && result.fixable && hook.autoFix) {
        console.log(`🔧 Attempting auto-fix for ${hook.name}...`);
        const fixed = await hook.autoFix(context);
        
        if (fixed) {
          console.log(`✅ Auto-fix successful`);
          // Re-validate after fix
          const revalidated = await hook.validate(context);
          results[results.length - 1] = revalidated;
        } else {
          console.log(`❌ Auto-fix failed`);
        }
      }
    }
    
    return this.mergeResults(results);
  }

  async validatePostExecution(
    command: string, 
    params: any, 
    executionResult: any
  ): Promise<HookResult> {
    const applicableHooks = this.getApplicableHooks(command, 'post');
    const results: HookResult[] = [];
    
    for (const hook of applicableHooks) {
      const context: HookContext = {
        command,
        params,
        projectRoot: this.projectRoot,
        phase: await this.getCurrentPhase(),
        previousResult: executionResult
      };
      
      const result = await hook.validate(context);
      results.push(result);
    }
    
    return this.mergeResults(results);
  }

  private getApplicableHooks(command: string, type: 'pre' | 'post'): ValidationHook[] {
    return Array.from(this.hooks.values()).filter(hook => {
      // Check type
      if (hook.type !== type && hook.type !== 'both') {
        return false;
      }
      
      // Check command match
      if (hook.commands === '*') {
        return true;
      }
      
      // Check exact match or pattern match
      return hook.commands.some(cmd => {
        if (cmd.includes('*')) {
          const pattern = cmd.replace('*', '.*');
          return new RegExp(`^${pattern}$`).test(command);
        }
        return cmd === command;
      });
    });
  }

  private mergeResults(results: HookResult[]): HookResult {
    const merged: HookResult = {
      valid: results.every(r => r.valid),
      errors: [],
      warnings: [],
      suggestions: [],
      fixable: results.some(r => r.fixable),
      metadata: {}
    };
    
    results.forEach(result => {
      merged.errors.push(...result.errors);
      merged.warnings.push(...result.warnings);
      merged.suggestions.push(...result.suggestions);
      Object.assign(merged.metadata!, result.metadata || {});
    });
    
    // Remove duplicates
    merged.errors = [...new Set(merged.errors)];
    merged.warnings = [...new Set(merged.warnings)];
    merged.suggestions = [...new Set(merged.suggestions)];
    
    return merged;
  }

  private async getCurrentPhase(): Promise<string> {
    const statusPath = path.join(this.projectRoot, '.vibe-status.md');
    
    if (fs.existsSync(statusPath)) {
      const content = fs.readFileSync(statusPath, 'utf-8');
      const match = content.match(/Current Phase:\s*(.+)/);
      if (match) {
        return match[1].trim().toLowerCase().replace(/\s+/g, '-');
      }
    }
    
    return 'unknown';
  }

  private findFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];
    
    const walk = (currentDir: string) => {
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry.name);
          
          if (entry.isDirectory() && 
              !entry.name.startsWith('.') && 
              entry.name !== 'node_modules') {
            walk(fullPath);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    };
    
    walk(dir);
    return files;
  }

  recordExecution(
    command: string, 
    preValidation: HookResult, 
    postValidation?: HookResult
  ): void {
    this.executionHistory.push({
      command,
      timestamp: new Date(),
      preValidation,
      postValidation
    });
    
    // Keep only last 100 executions
    if (this.executionHistory.length > 100) {
      this.executionHistory = this.executionHistory.slice(-100);
    }
  }

  getExecutionHistory(command?: string): typeof this.executionHistory {
    if (command) {
      return this.executionHistory.filter(e => e.command === command);
    }
    return this.executionHistory;
  }

  async getValidationReport(): Promise<{
    totalExecutions: number;
    successRate: number;
    commonErrors: Array<{ error: string; count: number }>;
    commandStats: Record<string, { total: number; successful: number }>;
  }> {
    const stats: Record<string, { total: number; successful: number }> = {};
    const errorCounts: Record<string, number> = {};
    
    this.executionHistory.forEach(execution => {
      // Update command stats
      if (!stats[execution.command]) {
        stats[execution.command] = { total: 0, successful: 0 };
      }
      stats[execution.command].total++;
      
      if (execution.preValidation.valid && 
          (!execution.postValidation || execution.postValidation.valid)) {
        stats[execution.command].successful++;
      }
      
      // Count errors
      [...execution.preValidation.errors, 
       ...(execution.postValidation?.errors || [])].forEach(error => {
        errorCounts[error] = (errorCounts[error] || 0) + 1;
      });
    });
    
    const totalExecutions = this.executionHistory.length;
    const successfulExecutions = this.executionHistory.filter(e => 
      e.preValidation.valid && (!e.postValidation || e.postValidation.valid)
    ).length;
    
    return {
      totalExecutions,
      successRate: totalExecutions > 0 ? 
        (successfulExecutions / totalExecutions) * 100 : 0,
      commonErrors: Object.entries(errorCounts)
        .map(([error, count]) => ({ error, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      commandStats: stats
    };
  }
}