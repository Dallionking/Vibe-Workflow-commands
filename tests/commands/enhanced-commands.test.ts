/**
 * Enhanced Commands Tests
 * Test suite for context-enhanced Vibe commands
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { VibeInitCommand } from '../../src/commands/enhanced/vibe-init';
import { VibeRetrofitCommand } from '../../src/commands/enhanced/vibe-retrofit';
import { VibeStep1Command } from '../../src/commands/enhanced/vibe-step-1';
import { VibeValidateWorkCommand } from '../../src/commands/enhanced/vibe-validate-work';
import { VibeUIHealerCommand } from '../../src/commands/enhanced/vibe-ui-healer';
import { VibeContextCommand } from '../../src/commands/enhanced/vibe-context';
import { VibeLearnCommand } from '../../src/commands/enhanced/vibe-learn';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Enhanced Commands', () => {
  let testDir: string;
  
  beforeEach(() => {
    testDir = path.join(os.tmpdir(), `vibe-cmd-test-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });
    
    // Set test environment
    process.env.VIBE_DEBUG = 'false';
    process.env.VIBE_CONTEXT_ENABLED = 'true';
    
    // Create basic project structure
    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        scripts: {
          test: 'jest',
          lint: 'eslint .'
        },
        devDependencies: {
          jest: '^29.0.0',
          eslint: '^8.0.0'
        }
      })
    );
  });
  
  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });
  
  describe('VibeInitCommand', () => {
    it('should initialize a new project with context', async () => {
      const command = new VibeInitCommand();
      const projectName = 'test-app';
      
      const result = await command.execute({
        projectName,
        template: 'default',
        skipGit: true
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.projectPath).toContain(projectName);
      
      // Check created files
      const projectPath = path.join(testDir, projectName);
      expect(fs.existsSync(path.join(projectPath, 'CLAUDE.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, '.vibe-status.md'))).toBe(true);
      expect(fs.existsSync(path.join(projectPath, '.vibe/context.config.json'))).toBe(true);
      
      // Verify CLAUDE.md v2.0 format
      const claudeMd = fs.readFileSync(path.join(projectPath, 'CLAUDE.md'), 'utf-8');
      expect(claudeMd).toContain('version: 2.0');
      expect(claudeMd).toContain('## Context Layers');
    });
    
    it('should fail if project already exists', async () => {
      const command = new VibeInitCommand();
      const projectName = 'existing';
      
      // Create existing directory
      fs.mkdirSync(path.join(testDir, projectName));
      
      const result = await command.execute({
        projectName,
        skipGit: true
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists');
    });
    
    it('should support different templates', async () => {
      const command = new VibeInitCommand();
      
      const result = await command.execute({
        projectName: 'react-app',
        template: 'react',
        skipGit: true
      });
      
      expect(result.success).toBe(true);
      
      const projectPath = path.join(testDir, 'react-app');
      expect(fs.existsSync(path.join(projectPath, 'src/components'))).toBe(true);
    });
  });
  
  describe('VibeRetrofitCommand', () => {
    beforeEach(() => {
      // Create existing project structure
      fs.writeFileSync(
        path.join(testDir, 'CLAUDE.md'),
        '# Existing Project'
      );
      
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      
      fs.writeFileSync(
        path.join(srcDir, 'index.js'),
        'function main() { console.log("Hello"); }'
      );
      
      fs.writeFileSync(
        path.join(srcDir, 'utils.js'),
        'export function helper() { return true; }'
      );
    });
    
    it('should analyze existing codebase', async () => {
      const command = new VibeRetrofitCommand();
      
      const result = await command.execute({
        analyze: true,
        research: false
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.analysis.fileCount).toBeGreaterThan(0);
      expect(result.data?.analysis.languages).toContain('javascript');
    });
    
    it('should detect patterns in codebase', async () => {
      const command = new VibeRetrofitCommand();
      
      const result = await command.execute({
        includePatterns: true
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.patterns).toBeDefined();
      expect(Array.isArray(result.data?.patterns)).toBe(true);
    });
    
    it('should create retrofit documentation', async () => {
      const command = new VibeRetrofitCommand();
      
      const result = await command.execute({
        outputPath: 'docs/retrofit'
      });
      
      expect(result.success).toBe(true);
      
      const retrofitPlan = path.join(testDir, 'docs/retrofit/retrofit-plan.md');
      expect(fs.existsSync(retrofitPlan)).toBe(true);
      
      const content = fs.readFileSync(retrofitPlan, 'utf-8');
      expect(content).toContain('Retrofit Plan');
      expect(content).toContain('Implementation Plan');
    });
  });
  
  describe('VibeStep1Command', () => {
    beforeEach(() => {
      // Initialize project first
      fs.writeFileSync(
        path.join(testDir, 'CLAUDE.md'),
        '# Test Project\nproject_type: saas'
      );
      
      fs.writeFileSync(
        path.join(testDir, '.vibe-status.md'),
        '# Status\nCurrent Phase: initialization'
      );
    });
    
    it('should generate feature ideation', async () => {
      const command = new VibeStep1Command();
      
      const result = await command.execute({
        feature: 'User Authentication',
        research: false
      });
      
      expect(result.success).toBe(true);
      
      const ideationPath = path.join(testDir, 'docs/vibe-coding/01-feature-ideation.md');
      expect(fs.existsSync(ideationPath)).toBe(true);
      
      const content = fs.readFileSync(ideationPath, 'utf-8');
      expect(content).toContain('Feature Ideation');
      expect(content).toContain('User Authentication');
    });
    
    it('should update project status', async () => {
      const command = new VibeStep1Command();
      
      await command.execute({
        feature: 'Test Feature'
      });
      
      const status = fs.readFileSync(path.join(testDir, '.vibe-status.md'), 'utf-8');
      expect(status).toContain('[x] Step 1: Feature Ideation');
      expect(status).toContain('Step 1 Completed');
    });
    
    it('should fail without prerequisites', async () => {
      // Remove CLAUDE.md
      fs.unlinkSync(path.join(testDir, 'CLAUDE.md'));
      
      const command = new VibeStep1Command();
      const result = await command.execute({});
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('not initialized');
    });
  });
  
  describe('VibeValidateWorkCommand', () => {
    beforeEach(() => {
      // Create test files
      const srcDir = path.join(testDir, 'src');
      fs.mkdirSync(srcDir);
      
      fs.writeFileSync(
        path.join(srcDir, 'test.js'),
        'const x = 1;\nconsole.log(x);'
      );
      
      // Mock test results
      fs.mkdirSync(path.join(testDir, 'coverage'));
      fs.writeFileSync(
        path.join(testDir, 'coverage/coverage-summary.json'),
        JSON.stringify({
          total: {
            lines: { pct: 85 },
            statements: { pct: 85 },
            functions: { pct: 80 },
            branches: { pct: 75 }
          }
        })
      );
    });
    
    it('should validate code quality', async () => {
      const command = new VibeValidateWorkCommand();
      
      const result = await command.execute({
        strict: false,
        report: 'summary'
      });
      
      expect(result.success).toBeDefined();
      expect(result.data?.results.codeQuality).toBeDefined();
      expect(result.data?.results.coverage).toBeDefined();
    });
    
    it('should generate detailed reports', async () => {
      const command = new VibeValidateWorkCommand();
      
      const result = await command.execute({
        report: 'markdown'
      });
      
      expect(result.success).toBeDefined();
      expect(result.data?.report).toContain('# Validation Report');
      expect(result.data?.report).toContain('Code Quality');
      expect(result.data?.report).toContain('Test Coverage');
    });
    
    it('should validate specific phase', async () => {
      // Create phase file
      const phasesDir = path.join(testDir, 'phases');
      fs.mkdirSync(phasesDir);
      
      fs.writeFileSync(
        path.join(phasesDir, 'phase-1.md'),
        '# Phase 1\n- [x] Task 1\n- [ ] Task 2'
      );
      
      const command = new VibeValidateWorkCommand();
      
      const result = await command.execute({
        phase: '1'
      });
      
      expect(result.data?.results.phaseCompletion).toBeDefined();
      expect(result.data?.results.phaseCompletion.completed).toContain('Task 1');
      expect(result.data?.results.phaseCompletion.pending).toContain('Task 2');
    });
  });
  
  describe('VibeUIHealerCommand', () => {
    beforeEach(() => {
      // Create component files
      const componentsDir = path.join(testDir, 'src/components');
      fs.mkdirSync(componentsDir, { recursive: true });
      
      fs.writeFileSync(
        path.join(componentsDir, 'Button.jsx'),
        `export function Button({ children, onClick }) {
          return (
            <button 
              style={{ color: '#ff0000', padding: '10px' }}
              onClick={onClick}
            >
              {children}
            </button>
          );
        }`
      );
      
      // Create design system
      fs.writeFileSync(
        path.join(testDir, 'design-system.json'),
        JSON.stringify({
          name: 'Test Design System',
          colors: {
            primary: '#007bff',
            danger: '#dc3545'
          },
          spacing: {
            sm: '8px',
            md: '16px'
          }
        })
      );
    });
    
    it('should validate UI components', async () => {
      const command = new VibeUIHealerCommand();
      
      const result = await command.execute({
        component: 'Button'
      });
      
      expect(result.success).toBeDefined();
      expect(result.data?.results).toBeDefined();
      expect(result.data?.healthScore).toBeDefined();
    });
    
    it('should detect design system violations', async () => {
      const command = new VibeUIHealerCommand();
      
      const result = await command.execute({
        component: 'Button',
        designSystem: 'design-system.json'
      });
      
      // Should detect non-design-system color
      const issues = result.data?.results[0]?.issues || [];
      const designSystemIssue = issues.find((i: any) => 
        i.type === 'design-system'
      );
      
      expect(designSystemIssue).toBeDefined();
    });
    
    it('should check accessibility', async () => {
      // Create component with accessibility issues
      fs.writeFileSync(
        path.join(testDir, 'src/components/Image.jsx'),
        '<img src="test.jpg" />'
      );
      
      const command = new VibeUIHealerCommand();
      
      const result = await command.execute({
        component: 'Image'
      });
      
      const issues = result.data?.results[0]?.issues || [];
      const a11yIssue = issues.find((i: any) => 
        i.type === 'accessibility' && i.description.includes('alt')
      );
      
      expect(a11yIssue).toBeDefined();
    });
  });
  
  describe('VibeContextCommand', () => {
    it('should show context information', async () => {
      const command = new VibeContextCommand();
      
      const result = await command.execute({
        action: 'show',
        layer: 'all'
      });
      
      expect(result.success).toBe(true);
      expect(result.output).toContain('Context Statistics');
      expect(result.data?.stats).toBeDefined();
    });
    
    it('should update context layers', async () => {
      const command = new VibeContextCommand();
      
      const result = await command.execute({
        action: 'update',
        layer: 'global'
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.updated).toContain('global');
    });
    
    it('should optimize context', async () => {
      const command = new VibeContextCommand();
      
      const result = await command.execute({
        action: 'optimize',
        layer: 'all'
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.totalSaved).toBeDefined();
      expect(result.output).toContain('Optimization Complete');
    });
  });
  
  describe('VibeLearnCommand', () => {
    it('should learn from patterns', async () => {
      const command = new VibeLearnCommand();
      
      const result = await command.execute({
        from: 'patterns',
        threshold: 70
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.metrics).toBeDefined();
      expect(result.output).toContain('Learning Complete');
    });
    
    it('should export learnings', async () => {
      const command = new VibeLearnCommand();
      
      const result = await command.execute({
        from: 'all',
        export: true
      });
      
      expect(result.success).toBe(true);
      
      // Check export file was created
      const exportDir = path.join(testDir, 'docs/learnings');
      expect(fs.existsSync(exportDir)).toBe(true);
      
      const files = fs.readdirSync(exportDir);
      expect(files.some(f => f.endsWith('.json'))).toBe(true);
    });
  });
  
  describe('Command Integration', () => {
    it('should work with context enhancement', async () => {
      // Initialize project
      const initCmd = new VibeInitCommand();
      await initCmd.execute({
        projectName: 'integrated-test',
        skipGit: true
      });
      
      const projectPath = path.join(testDir, 'integrated-test');
      process.chdir(projectPath);
      
      // Run ideation
      const ideationCmd = new VibeStep1Command();
      const ideationResult = await ideationCmd.execute({
        feature: 'Test Feature',
        _context: {
          content: 'Test context',
          tokens: 100,
          layers: [],
          version: '2.0',
          optimized: false
        }
      });
      
      expect(ideationResult.success).toBe(true);
      expect(ideationResult.data?.contextUsed).toBe(true);
    });
  });
});