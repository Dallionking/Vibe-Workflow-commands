/**
 * Jest Configuration for Vibe Workflow Commands
 * Optimized for TypeScript testing with comprehensive coverage
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // TypeScript support
  preset: 'ts-jest',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts',
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary', 
    'lcov',
    'html',
    'json'
  ],
  
  // Coverage thresholds (95% as per Vibe Coding standards)
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './context/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  // Files to collect coverage from
  collectCoverageFrom: [
    'context/**/*.ts',
    'scripts/**/*.js',
    'agents/**/*.ts',
    '!**/__tests__/**',
    '!**/*.test.ts',
    '!**/*.spec.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  
  // Module resolution
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@context/(.*)$': '<rootDir>/context/$1',
    '^@scripts/(.*)$': '<rootDir>/scripts/$1',
    '^@agents/(.*)$': '<rootDir>/agents/$1'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Test result processor
  testResultsProcessor: undefined,
  
  // Global test setup
  globalSetup: undefined,
  globalTeardown: undefined,
  
  // Watch mode configuration
  watchman: true,
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/.git/'
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/mcps/',
    '<rootDir>/vibe-coding-claude/'
  ],
  
  // Transform files
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: false,
      tsconfig: 'tsconfig.json'
    }]
  },
  
  // Reporters
  reporters: [
    'default'
  ],
  
  // Test execution
  maxWorkers: '50%',
  passWithNoTests: true,
  
  // Snapshot configuration
  updateSnapshot: false,
  
  // Cache configuration
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache'
};