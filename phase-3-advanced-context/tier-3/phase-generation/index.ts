/**
 * Phase Generation Index
 * Phase 3: Advanced Context Features - Tier 3.1
 *
 * Export all phase generation components for enhanced PRP phase creation,
 * validation, and pattern-based development.
 */

export * from './prp-phase-generator';
export * from './phase-transformer';
export * from './validation-gate';
export * from './example-pattern-library';

// Re-export main classes for convenience
export { PRPPhaseGenerator } from './prp-phase-generator';
export { PhaseTransformer } from './phase-transformer';
export { ValidationGate } from './validation-gate';
export { ExamplePatternLibrary } from './example-pattern-library';

// Export type definitions
export type {
  PRPPhaseConfig,
  ValidationCriteria,
  ExamplePattern,
  PRPTemplate,
  PhaseGenerationResult,
  ValidationResult,
  ValidationIssue,
  GenerationMetrics
} from './prp-phase-generator';

export type {
  PhaseTransformationConfig,
  TransformationResult,
  TransformationChange,
  TransformationMetrics
} from './phase-transformer';

export type {
  ValidationGateConfig,
  CustomValidator,
  ValidationReport,
  Recommendation,
  ValidationMetrics,
  ValidationSummary
} from './validation-gate';

export type {
  PatternLibraryConfig,
  PatternSearchCriteria,
  PatternMatchResult,
  PatternSearchResult,
  PatternRecommendation,
  PatternEvolution,
  PatternAdaptation,
  PatternAnalytics,
  PatternQualityMetrics
} from './example-pattern-library';
