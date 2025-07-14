/**
 * Test Setup
 * Global test configuration and utilities
 */

import { jest } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.VIBE_DEBUG = 'false';
process.env.VIBE_CONTEXT_ENABLED = 'true';
process.env.VIBE_LEARNING_ENABLED = 'false';
process.env.VIBE_CACHING_ENABLED = 'false';

// Mock console methods to reduce test output
if (process.env.SILENT_TESTS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
}

// Global test utilities
global.createTestDirectory = (): string => {
  const testDir = path.join(os.tmpdir(), `vibe-test-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  fs.mkdirSync(testDir, { recursive: true });
  return testDir;
};

global.cleanupTestDirectory = (dir: string): void => {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }
};

global.createTestProject = (dir: string, options: any = {}): void => {
  // Create basic project structure
  const defaults = {
    name: 'test-project',
    version: '1.0.0',
    description: 'Test project',
    main: 'index.js',
    scripts: {
      test: 'jest',
      lint: 'eslint .',
      build: 'tsc'
    },
    devDependencies: {
      jest: '^29.0.0',
      eslint: '^8.0.0',
      typescript: '^5.0.0'
    }
  };
  
  const packageJson = { ...defaults, ...options };
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create CLAUDE.md
  fs.writeFileSync(
    path.join(dir, 'CLAUDE.md'),
    `# ${packageJson.name}

## Project Overview
${packageJson.description}

## Conventions
- Use TypeScript
- Follow ESLint rules
- Write tests for all features`
  );
  
  // Create .vibe-status.md
  fs.writeFileSync(
    path.join(dir, '.vibe-status.md'),
    `# Vibe Coding Status

**Project**: ${packageJson.name}
**Current Phase**: testing
**Created**: ${new Date().toISOString()}`
  );
  
  // Create directories
  ['src', 'tests', 'docs', '.vibe'].forEach(subdir => {
    fs.mkdirSync(path.join(dir, subdir), { recursive: true });
  });
};

// Mock MCP tools
jest.mock('@anthropic/mcp', () => ({
  MCPClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    call: jest.fn().mockResolvedValue({ success: true })
  }))
}));

// Extend global namespace for TypeScript
declare global {
  function createTestDirectory(): string;
  function cleanupTestDirectory(dir: string): void;
  function createTestProject(dir: string, options?: any): void;
}

// Increase test timeout for CI environments
if (process.env.CI) {
  jest.setTimeout(60000);
}

// Clean up any leftover test directories before starting
beforeAll(() => {
  const tmpDir = os.tmpdir();
  const testDirs = fs.readdirSync(tmpDir).filter(name => name.startsWith('vibe-test-'));
  
  testDirs.forEach(dir => {
    try {
      fs.rmSync(path.join(tmpDir, dir), { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });
});

// Ensure all test directories are cleaned up
afterAll(() => {
  const tmpDir = os.tmpdir();
  const testDirs = fs.readdirSync(tmpDir).filter(name => name.startsWith('vibe-test-'));
  
  testDirs.forEach(dir => {
    try {
      fs.rmSync(path.join(tmpDir, dir), { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });
});