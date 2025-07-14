/**
 * Context Engineering Type Definitions
 * Core interfaces and types for the Vibe Coding context system
 */

// Context Layer Types
export type ContextLayerType = 'global' | 'phase' | 'task';
export type ContextPriority = 'critical' | 'high' | 'medium' | 'low';

// Token Budget Types
export interface TokenBudget {
  total: number;
  used: number;
  reserved: number;
  available: number;
}

// Context Content Types
export interface ContextContent {
  id: string;
  type: 'instruction' | 'knowledge' | 'pattern' | 'memory';
  layer: ContextLayerType;
  priority: ContextPriority;
  content: string;
  metadata: ContextMetadata;
  tokens?: number;
}

export interface ContextMetadata {
  source: string;
  timestamp: Date;
  version: string;
  tags: string[];
  dependencies?: string[];
  expiresAt?: Date;
}

// Layer Definitions
export interface ContextLayer {
  type: ContextLayerType;
  name: string;
  enabled: boolean;
  contents: ContextContent[];
  budget: TokenBudget;
  rules: LayerRule[];
}

export interface LayerRule {
  id: string;
  type: 'inclusion' | 'exclusion' | 'transformation';
  condition: RuleCondition;
  action: RuleAction;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'matches' | 'exists';
  value: any;
}

export interface RuleAction {
  type: 'include' | 'exclude' | 'compress' | 'transform';
  params?: Record<string, any>;
}

// Pattern Recognition Types
export interface Pattern {
  id: string;
  name: string;
  type: 'component' | 'api' | 'test' | 'style' | 'structure';
  pattern: string;
  examples: string[];
  confidence: number;
  usage: PatternUsage;
}

export interface PatternUsage {
  count: number;
  lastUsed: Date;
  locations: string[];
  variations: string[];
}

// Memory Types
export interface ContextMemory {
  projectId: string;
  sessions: MemorySession[];
  patterns: Pattern[];
  decisions: Decision[];
  preferences: TeamPreference[];
}

export interface MemorySession {
  id: string;
  timestamp: Date;
  command: string;
  context: ContextSnapshot;
  outcome: SessionOutcome;
}

export interface ContextSnapshot {
  layers: ContextLayer[];
  tokenUsage: TokenBudget;
  activePatterns: string[];
}

export interface SessionOutcome {
  success: boolean;
  metrics: Record<string, number>;
  feedback?: string;
  learnedPatterns?: Pattern[];
}

export interface Decision {
  id: string;
  type: string;
  context: string;
  choice: string;
  reasoning: string;
  timestamp: Date;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface TeamPreference {
  category: string;
  preference: string;
  examples: string[];
  strength: number;
}

// Validation Types
export interface ValidationRule {
  id: string;
  name: string;
  type: 'structure' | 'content' | 'performance' | 'consistency';
  validate: (context: ContextLayer) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  rule: string;
  message: string;
  location?: string;
  severity: 'critical' | 'error';
}

export interface ValidationWarning {
  rule: string;
  message: string;
  location?: string;
  severity: 'warning' | 'info';
}

// Assembly Types
export interface AssemblyStrategy {
  name: string;
  priority: number;
  applicable: (context: AssemblyContext) => boolean;
  assemble: (layers: ContextLayer[]) => AssembledContext;
}

export interface AssemblyContext {
  command: string;
  params: Record<string, any>;
  currentPhase?: string;
  currentTask?: string;
  tokenBudget: TokenBudget;
}

export interface AssembledContext {
  content: string;
  tokens: number;
  layers: string[];
  metadata: ContextMetadata;
  performance: PerformanceMetrics;
}

export interface PerformanceMetrics {
  assemblyTime: number;
  compressionRatio: number;
  cacheHit: boolean;
  tokenEfficiency: number;
}

// Cache Types
export interface CacheEntry {
  key: string;
  value: AssembledContext;
  timestamp: Date;
  hits: number;
  size: number;
}

export interface CacheConfig {
  maxSize: number;
  ttl: number;
  strategy: 'lru' | 'lfu' | 'fifo';
}

// Configuration Types
export interface ContextConfig {
  version: string;
  layers: ContextLayerConfig[];
  tokenBudget: TokenBudgetConfig;
  validation: ValidationConfig;
  cache: CacheConfig;
  features: FeatureFlags;
}

export interface ContextLayerConfig {
  type: ContextLayerType;
  enabled: boolean;
  budget: number;
  sources: string[];
  rules: LayerRule[];
}

export interface TokenBudgetConfig {
  total: number;
  distribution: Record<ContextLayerType, number>;
  reservePercent: number;
  compressionThreshold: number;
}

export interface ValidationConfig {
  enabled: boolean;
  rules: string[];
  strictMode: boolean;
  autoFix: boolean;
}

export interface FeatureFlags {
  enableCompression: boolean;
  enableCaching: boolean;
  enableLearning: boolean;
  enableMetrics: boolean;
  debugMode: boolean;
}

// Validation Gate Types
export interface ValidationGate {
  id: string;
  name: string;
  phase: string;
  type: 'pre-execution' | 'post-execution' | 'continuous';
  severity: 'error' | 'warning' | 'info';
  requires: ValidationRequirements;
  validate?: (context: GateContext) => Promise<ValidationResult>;
  autoFix?: (context: GateContext, errors: ValidationError[]) => Promise<boolean>;
  description?: string;
}

export interface ValidationRequirements {
  sections?: string[];
  files?: string[];
  previousGates?: string[];
  conditions?: string[];
  metadata?: Record<string, any>;
}

export interface ValidationCondition {
  name: string;
  description: string;
  check: (context: any) => Promise<boolean>;
}

export interface GateContext {
  phase: string;
  task?: string;
  files: string[];
  sections: string[];
  previousGates: string[];
  metadata: Record<string, any>;
}

// Dynamic Section Types
export interface DynamicSection {
  id: string;
  type: string;
  content: string | (() => Promise<string>);
  condition?: (context: any) => boolean;
  priority?: ContextPriority;
}

// Claude MD Types
export interface ClaudeMdSection {
  type: string;
  qualifier?: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface ClaudeMdMetadata {
  version: string;
  lastUpdated?: Date;
  author?: string;
  project?: string;
  [key: string]: any;
}

// Export utility type helpers
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys];