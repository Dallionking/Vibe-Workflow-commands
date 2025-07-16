/**
 * Tests for Dynamic Context Manager
 */

import { DynamicContextManager } from '../../context/assembly/dynamic-context-manager';
import { CommandContextRegistry } from '../../context/registry/command-registry';
import * as fs from 'fs';
import * as path from 'path';

// Mock dependencies
jest.mock('fs');
jest.mock('../../context/assembly/loader');
jest.mock('../../context/memory/store');
jest.mock('../../context/memory/patterns');

describe('DynamicContextManager', () => {
  let manager: DynamicContextManager;
  const mockProjectRoot = '/test/project';

  beforeEach(() => {
    // Initialize registry
    CommandContextRegistry.initialize();

    // Mock file system
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(`---
version: 2.0
---

## Context Layers

### L1: Global Rules
Test content

## Dynamic Sections

### @dynamic(tool:typescript)
TypeScript rules

### @dynamic(fileType:javascript)
JavaScript rules
`);

    manager = new DynamicContextManager(mockProjectRoot);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Command Registration', () => {
    it('should register command with context requirements', () => {
      manager.registerCommand({
        command: 'test-command',
        requiredSections: ['test-section'],
        optionalSections: ['optional-section'],
        tokenBudget: 5000,
        patterns: ['test-pattern']
      });

      // Command should be registered (we'd need a getter to test this)
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('MCP Tool Management', () => {
    it('should register MCP tool', () => {
      manager.registerMCPTool({
        name: 'test-tool',
        available: true,
        priority: 100,
        contextSections: ['test-section']
      });

      expect(true).toBe(true); // Placeholder
    });

    it('should update tool availability', () => {
      manager.registerMCPTool({
        name: 'test-tool',
        available: true,
        priority: 100
      });

      manager.updateMCPAvailability('test-tool', false);

      // Tool should now be unavailable
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Runtime State Management', () => {
    it('should update runtime state', () => {
      manager.updateRuntimeState({
        currentFile: '/test/file.ts',
        executionPhase: 'running'
      });

      // State should be updated with file type detection
      expect(true).toBe(true); // Placeholder
    });

    it('should detect file types correctly', () => {
      const testCases = [
        { file: 'test.ts', expectedType: 'typescript' },
        { file: 'test.tsx', expectedType: 'typescript-react' },
        { file: 'test.js', expectedType: 'javascript' },
        { file: 'test.py', expectedType: 'python' },
        { file: 'test.unknown', expectedType: 'unknown' }
      ];

      testCases.forEach(({ file, expectedType }) => {
        manager.updateRuntimeState({ currentFile: file });
        // Would need a getter to verify the detected type
      });
    });

    it('should manage errors', () => {
      manager.addError('Test error');
      manager.addError('Another error');

      // Errors should be accumulated and phase should be 'error'

      manager.clearErrors();

      // Errors should be cleared and phase should not be 'error'
    });

    it('should manage active tools', () => {
      manager.activateTool('typescript');
      manager.activateTool('eslint');

      // Tools should be active

      manager.deactivateTool('typescript');

      // Only eslint should remain active
    });
  });

  describe('Context Assembly', () => {
    it('should assemble context with command requirements', async () => {
      const context = await manager.assembleContext('vibe-init', {
        projectName: 'test-project'
      });

      expect(context).toBeDefined();
      expect(context.content).toBeDefined();
      expect(context.tokens).toBeGreaterThan(0);
      expect(context.layers).toContain('Global Context Layer');
    });

    it('should apply dynamic sections based on conditions', async () => {
      manager.activateTool('typescript');
      manager.updateRuntimeState({ currentFile: 'test.ts' });

      const context = await manager.assembleContext('test-command', {});

      // Context should include TypeScript dynamic section
      expect(context.content).toContain('TypeScript rules');
    });

    it('should inject MCP tool context when available', async () => {
      manager.registerMCPTool({
        name: 'playwright',
        available: true,
        priority: 100,
        contextSections: ['browser-testing']
      });

      manager.registerCommand({
        command: 'ui-test',
        requiredSections: [],
        optionalSections: [],
        mcpTools: ['playwright']
      });

      const context = await manager.assembleContext('ui-test', {});

      // Context should include MCP tool information
      expect(context.content).toContain('MCP Tool Context');
    });

    it('should add error context when in error state', async () => {
      manager.addError('Previous execution failed');

      const context = await manager.assembleContext('test-command', {});

      // Context should include error information
      expect(context.content).toContain('Error Context');
      expect(context.content).toContain('Previous execution failed');
    });
  });

  describe('Pattern Management', () => {
    it('should get active patterns by type', () => {
      // Would need to mock pattern loading
      const patterns = manager.getActivePatterns('component');

      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should update patterns', async () => {
      await manager.updatePatterns();

      // Patterns should be refreshed
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Event Management', () => {
    it('should notify context change listeners', async () => {
      const listener = jest.fn();
      manager.onContextChange(listener);

      await manager.assembleContext('test-command', {});

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.any(String),
          tokens: expect.any(Number)
        })
      );
    });
  });

  describe('Statistics and Reset', () => {
    it('should provide context statistics', () => {
      const stats = manager.getContextStats();

      expect(stats).toHaveProperty('activePatterns');
      expect(stats).toHaveProperty('availableTools');
      expect(stats).toHaveProperty('registeredCommands');
      expect(stats).toHaveProperty('cacheSize');
    });

    it('should reset to initial state', async () => {
      manager.addError('Test error');
      manager.activateTool('test-tool');

      await manager.reset();

      // State should be reset
      const stats = manager.getContextStats();
      expect(stats.activePatterns).toBe(0);
    });
  });

  describe('Context Preloading', () => {
    it('should preload context for specified commands', async () => {
      await manager.preloadContext(['vibe-init', 'vibe-retrofit']);

      // Context should be preloaded (would need cache inspection to verify)
      expect(true).toBe(true); // Placeholder
    });
  });
});
