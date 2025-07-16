/**
 * Pre-Commit Validation Index
 * Phase 3: Advanced Context Features - Tier 3.4
 *
 * Export all pre-commit validation and quality assurance components
 * for comprehensive quality gates and approval workflows.
 */

export * from './quality-assurance-framework';

// Re-export main class for convenience
export { QualityAssuranceFramework } from './quality-assurance-framework';

// Export type definitions
export type {
  QualityAssuranceConfig,
  QualityThresholds,
  ApprovalRequirements,
  EscalationRule,
  QualityCheck,
  QualityCheckContext,
  QualityCheckResult,
  QualityFinding,
  SourceLocation,
  QualityMetrics,
  QualityAssuranceResult,
  QualityAssuranceSummary,
  ApprovalStatus,
  QualityReport,
  QualityTrend,
  PrioritizedRecommendation,
  ActionItem
} from './quality-assurance-framework';
