/**
 * Context Layer Tests
 * Test suite for context layer functionality
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { GlobalContextLayer } from '../../context/layers/global';
import { PhaseContextLayer } from '../../context/layers/phase';
import { TaskContextLayer } from '../../context/layers/task';
import { ContextLayerType } from '../../context/types/context.types';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Context Layers', () => {
  let testDir: string;

  beforeEach(() => {
    // Create temp test directory
    testDir = path.join(os.tmpdir(), `vibe-test-${Date.now()}`);
    fs.mkdirSync(testDir, { recursive: true });

    // Create test files
    fs.writeFileSync(
      path.join(testDir, 'CLAUDE.md'),
      '# Test Project\n\n## Project Conventions\nTest conventions'
    );

    fs.writeFileSync(
      path.join(testDir, 'package.json'),
      JSON.stringify({ name: 'test-project', version: '1.0.0' })
    );
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  describe('GlobalContextLayer', () => {
    it('should load global context from CLAUDE.md', async () => {
      const layer = new GlobalContextLayer(testDir);
      await layer.load();

      expect(layer.type).toBe('global' as ContextLayerType);
      expect(layer.name).toBe('Global Context');
      expect(layer.enabled).toBe(true);
      expect(layer.contents.length).toBeGreaterThan(0);

      const claudeMdContent = layer.contents.find(c => c.section === 'CLAUDE.md');
      expect(claudeMdContent).toBeDefined();
      expect(claudeMdContent?.content).toContain('Test Project');
    });

    it('should respect token budget', async () => {
      const layer = new GlobalContextLayer(testDir);
      layer.budget.max = 100; // Very small budget

      await layer.load();

      const totalTokens = layer.getTokenCount();
      expect(totalTokens).toBeLessThanOrEqual(100);
    });

    it('should handle missing files gracefully', async () => {
      const emptyDir = path.join(testDir, 'empty');
      fs.mkdirSync(emptyDir);

      const layer = new GlobalContextLayer(emptyDir);
      await layer.load();

      expect(layer.contents.length).toBe(0);
    });

    it('should apply content rules', async () => {
      const layer = new GlobalContextLayer(testDir);

      // Add exclusion rule
      layer.rules.push({
        name: 'exclude-test',
        type: 'exclude',
        pattern: /Test/,
        enabled: true
      });

      await layer.load();

      const hasTestContent = layer.contents.some(c =>
        c.content.includes('Test')
      );
      expect(hasTestContent).toBe(false);
    });
  });

  describe('PhaseContextLayer', () => {
    beforeEach(() => {
      // Create phase files
      const phasesDir = path.join(testDir, 'phases');
      fs.mkdirSync(phasesDir);

      fs.writeFileSync(
        path.join(phasesDir, 'phase-1.md'),
        '# Phase 1\n\n## Tasks\n- Task 1\n- Task 2'
      );

      const docsDir = path.join(testDir, 'docs', 'vibe-coding');
      fs.mkdirSync(docsDir, { recursive: true });

      fs.writeFileSync(
        path.join(docsDir, '01-ideation.md'),
        '# Feature Ideation\n\nTest ideation content'
      );
    });

    it('should load phase-specific content', async () => {
      const layer = new PhaseContextLayer(testDir);
      layer.setCurrentPhase(1);

      await layer.load();

      expect(layer.contents.length).toBeGreaterThan(0);

      const phaseContent = layer.contents.find(c =>
        c.section === 'phase-1'
      );
      expect(phaseContent).toBeDefined();
      expect(phaseContent?.content).toContain('Phase 1');
    });

    it('should prioritize current phase content', async () => {
      const layer = new PhaseContextLayer(testDir);
      layer.setCurrentPhase(1);

      await layer.load();

      const priorities = layer.contents.map(c => c.priority);
      const maxPriority = Math.max(...priorities);

      const phaseContent = layer.contents.find(c =>
        c.section === 'phase-1'
      );
      expect(phaseContent?.priority).toBe(maxPriority);
    });

    it('should handle phase transitions', async () => {
      const layer = new PhaseContextLayer(testDir);

      // Load phase 1
      layer.setCurrentPhase(1);
      await layer.load();
      const phase1Contents = [...layer.contents];

      // Transition to phase 2
      layer.setCurrentPhase(2);
      await layer.load();

      // Should have different contents
      expect(layer.contents).not.toEqual(phase1Contents);
    });
  });

  describe('TaskContextLayer', () => {
    it('should track recent changes', async () => {
      const layer = new TaskContextLayer(testDir);

      // Simulate file changes
      layer.addRecentFile('src/test.ts');
      layer.addRecentFile('src/another.ts');

      await layer.load();

      const recentFiles = layer.contents.find(c =>
        c.section === 'recent-changes'
      );
      expect(recentFiles).toBeDefined();
      expect(recentFiles?.content).toContain('src/test.ts');
      expect(recentFiles?.content).toContain('src/another.ts');
    });

    it('should include error context when present', async () => {
      const layer = new TaskContextLayer(testDir);

      // Add error context
      layer.addError('Test error message');
      layer.addError('Another error');

      await layer.load();

      const errorContent = layer.contents.find(c =>
        c.section === 'error-context'
      );
      expect(errorContent).toBeDefined();
      expect(errorContent?.content).toContain('Test error message');
      expect(errorContent?.priority).toBeGreaterThan(5);
    });

    it('should compress old task context', async () => {
      const layer = new TaskContextLayer(testDir);

      // Add many files to trigger compression
      for (let i = 0; i < 50; i++) {
        layer.addRecentFile(`src/file${i}.ts`);
      }

      await layer.load();

      // Should compress to stay within budget
      const totalTokens = layer.getTokenCount();
      expect(totalTokens).toBeLessThanOrEqual(layer.budget.max);
    });
  });

  describe('Layer Integration', () => {
    it('should coordinate between layers', async () => {
      const globalLayer = new GlobalContextLayer(testDir);
      const phaseLayer = new PhaseContextLayer(testDir);
      const taskLayer = new TaskContextLayer(testDir);

      // Load all layers
      await Promise.all([
        globalLayer.load(),
        phaseLayer.load(),
        taskLayer.load()
      ]);

      // Check no duplicate content
      const allContents = [
        ...globalLayer.contents,
        ...phaseLayer.contents,
        ...taskLayer.contents
      ];

      const contentIds = allContents.map(c => c.id);
      const uniqueIds = [...new Set(contentIds)];

      expect(uniqueIds.length).toBe(contentIds.length);
    });

    it('should respect total token budget', async () => {
      const layers = [
        new GlobalContextLayer(testDir),
        new PhaseContextLayer(testDir),
        new TaskContextLayer(testDir)
      ];

      // Set budgets
      layers[0].budget.max = 1000;
      layers[1].budget.max = 1500;
      layers[2].budget.max = 500;

      // Load all
      await Promise.all(layers.map(l => l.load()));

      // Check total
      const totalTokens = layers.reduce((sum, l) =>
        sum + l.getTokenCount(), 0
      );

      expect(totalTokens).toBeLessThanOrEqual(3000);
    });
  });
});
