/**
 * Core Context Engineering Types for Vibe Coding System
 * Based on research from OpenAI Agents SDK and TypeScript best practices
 */

// ============================================================================
// Base Context Types
// ============================================================================

/**
 * Context Pattern for Learning System
 */
export interface ContextPattern {
  id: string;
  type: 'sequence' | 'priority-distribution' | 'content-similarity' | 'assembly';
  name: string;
  description: string;
  fragmentSignature: any[];
  contextSignature: string;
  confidence: number;
  usage: number;
  lastUsed: number;
  created: number;
}

/**
 * Context Decision for Learning System
 */
export interface ContextDecision {
  id: string;
  contextId: string;
  decision: string;
  reasoning: string;
  outcome: 'success' | 'failure' | 'partial';
  contextSignature: string;
  confidence: number;
  timestamp: number;
}

/**
 * Learning Metrics for Context Memory
 */
export interface LearningMetrics {
  patternsLearned: number;
  decisionsRecorded: number;
  recommendationsGenerated: number;
  accuracyRate: number;
  lastUpdated: number;
}

/**
 * Memory Entry for Context Storage
 */
export interface MemoryEntry {
  id: string;
  key: string;
  content: string;
  type: 'pattern' | 'decision' | 'learning';
  priority: ContextPriority;
  accessCount: number;
  created: number;
  lastAccessed: number;
}

/**
 * Pattern Recognition Result
 */
export interface PatternRecognition {
  identifiedPatterns: ContextPattern[];
  confidenceScore: number;
  recommendations: string[];
  appliedPatterns: string[];
  timestamp: number;
}

/**
 * Base context interface inspired by OpenAI Agents' RunContext pattern
 */
export interface BaseContext<T = unknown> {
  readonly id: string;
  readonly timestamp: number;
  readonly version: string;
  data: T;
  metadata: ContextMetadata;
}

/**
 * Context metadata for tracking and validation
 */
export interface ContextMetadata {
  source: ContextSource;
  priority: ContextPriority;
  ttl?: number; // Time to live in milliseconds
  tags: string[];
  dependencies: string[];
  created: number;
  lastModified: number;
}

/**
 * Context sources using discriminated unions for type safety
 */
export type ContextSource =
  | { type: 'global'; scope: 'system' | 'user' | 'project' }
  | { type: 'phase'; phaseNumber: number; phaseName: string }
  | { type: 'task'; taskId: string; taskType: string }
  | { type: 'memory'; memoryType: 'pattern' | 'decision' | 'learning' }
  | { type: 'command'; commandName: string; commandType: string }
  | { type: 'external'; provider: string; dataType: string };

/**
 * Priority levels for context selection
 */
export enum ContextPriority {
  CRITICAL = 1000,
  HIGH = 800,
  MEDIUM = 500,
  LOW = 200,
  MINIMAL = 100
}

// ============================================================================
// Context Fragment Architecture
// ============================================================================

/**
 * Context fragment - atomic unit of context information
 * Inspired by OpenAI's context management patterns
 */
export interface ContextFragment {
  readonly id: string;
  readonly type: ContextFragmentType;
  content: string;
  priority: ContextPriority;
  tokenEstimate: number;
  metadata: ContextMetadata;
  validation: FragmentValidation;
}

/**
 * Context fragment types using discriminated unions
 */
export type ContextFragmentType =
  | 'global-rules'
  | 'global-config'
  | 'phase-context'
  | 'phase-history'
  | 'task-context'
  | 'task-state'
  | 'memory-pattern'
  | 'memory-decision'
  | 'command-context'
  | 'external-data';

/**
 * Fragment validation information
 */
export interface FragmentValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  lastValidated: number;
}

export interface ValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  suggestion?: string;
}

// ============================================================================
// Three-Layer Context System
// ============================================================================

/**
 * Three-layer context system as specified in Phase 1
 */
export interface ContextLayers {
  L1_Global: GlobalContextLayer;
  L2_Phase: PhaseContextLayer;
  L3_Task: TaskContextLayer;
}

/**
 * L1: Global Context - Always Active
 */
export interface GlobalContextLayer extends BaseContext<GlobalContextData> {
  layer: 'global';
  rules: GlobalRule[];
  configuration: GlobalConfiguration;
  preferences: UserPreferences;
}

export interface GlobalContextData {
  systemRules: string[];
  projectInfo: ProjectInfo;
  userProfile: UserProfile;
  toolConfigurations: ToolConfiguration[];
}

export interface GlobalRule {
  id: string;
  name: string;
  description: string;
  rule: string;
  enabled: boolean;
  priority: ContextPriority;
}

export interface GlobalConfiguration {
  mcpTools: MCPToolConfig[];
  qualityStandards: QualityStandard[];
  developmentPatterns: DevelopmentPattern[];
}

/**
 * L2: Phase Context - Current Phase
 */
export interface PhaseContextLayer extends BaseContext<PhaseContextData> {
  layer: 'phase';
  phaseNumber: number;
  phaseName: string;
  phaseState: PhaseState;
  dependencies: PhaseDependency[];
}

export interface PhaseContextData {
  objectives: string[];
  requirements: PhaseRequirement[];
  progress: PhaseProgress;
  outputs: PhaseOutput[];
  validationCriteria: ValidationCriteria[];
}

export interface PhaseState {
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  currentTier: number;
  currentSubtask: string;
  completedTasks: string[];
  blockers: PhaseBlocker[];
}

/**
 * L3: Task Context - Current Task
 */
export interface TaskContextLayer extends BaseContext<TaskContextData> {
  layer: 'task';
  taskId: string;
  taskType: TaskType;
  parentTask?: string;
  subtasks: string[];
}

export interface TaskContextData {
  objective: string;
  instructions: string[];
  parameters: TaskParameter[];
  expectedOutputs: ExpectedOutput[];
  validationRules: ValidationRule[];
}

export type TaskType =
  | 'implementation'
  | 'research'
  | 'validation'
  | 'documentation'
  | 'testing'
  | 'integration'
  | 'optimization';

// ============================================================================
// Supporting Types
// ============================================================================

export interface ProjectInfo {
  name: string;
  description: string;
  type: 'saas' | 'mobile' | 'enterprise' | 'library' | 'other';
  technologies: string[];
  architecture: string;
}

export interface UserProfile {
  preferences: UserPreferences;
  experience: ExperienceLevel;
  focusAreas: string[];
}

export interface UserPreferences {
  codeStyle: CodeStylePreferences;
  documentation: DocumentationPreferences;
  testing: TestingPreferences;
}

export interface CodeStylePreferences {
  indentation: 'tabs' | 'spaces';
  spacing: number;
  lineLength: number;
  conventions: string[];
}

export interface DocumentationPreferences {
  format: 'markdown' | 'jsdoc' | 'typedoc' | 'custom';
  detail: 'minimal' | 'standard' | 'comprehensive';
  examples: boolean;
}

export interface TestingPreferences {
  framework: string;
  coverage: number;
  types: ('unit' | 'integration' | 'e2e')[];
}

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface MCPToolConfig {
  name: string;
  enabled: boolean;
  priority: ContextPriority;
  configuration: Record<string, unknown>;
}

export interface QualityStandard {
  name: string;
  description: string;
  criteria: QualityCriteria[];
  threshold: number;
}

export interface QualityCriteria {
  metric: string;
  target: number;
  required: boolean;
}

export interface DevelopmentPattern {
  name: string;
  description: string;
  pattern: string;
  examples: string[];
  applicability: string[];
}

export interface PhaseRequirement {
  id: string;
  description: string;
  type: 'functional' | 'non-functional' | 'quality' | 'documentation';
  priority: ContextPriority;
  satisfied: boolean;
}

export interface PhaseProgress {
  completionPercentage: number;
  tasksCompleted: number;
  tasksTotal: number;
  timeSpent: number;
  estimatedRemaining: number;
}

export interface PhaseOutput {
  type: 'code' | 'documentation' | 'configuration' | 'test' | 'artifact';
  path: string;
  description: string;
  validated: boolean;
}

export interface ValidationCriteria {
  id: string;
  description: string;
  validator: string;
  required: boolean;
  passed?: boolean;
}

export interface PhaseBlocker {
  id: string;
  description: string;
  type: 'dependency' | 'resource' | 'technical' | 'decision';
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolution?: string;
}

export interface PhaseDependency {
  phaseNumber: number;
  phaseName: string;
  type: 'blocks' | 'enhances' | 'optional';
  satisfied: boolean;
}

export interface TaskParameter {
  name: string;
  type: string;
  value: unknown;
  required: boolean;
  description: string;
}

export interface ExpectedOutput {
  type: string;
  format: string;
  description: string;
  validationRules: string[];
}

export interface ValidationRule {
  id: string;
  description: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ToolConfiguration {
  toolName: string;
  enabled: boolean;
  priority: ContextPriority;
  settings: Record<string, unknown>;
}

// ============================================================================
// Context Assembly Types
// ============================================================================

/**
 * Token budget management for context assembly
 */
export interface TokenBudget {
  total: number;
  reserved: number;
  available: number;
  used: number;
  allocation: TokenAllocation;
}

export interface TokenAllocation {
  global: number;
  phase: number;
  task: number;
  memory: number;
  buffer: number;
}

/**
 * Context assembly configuration
 */
export interface ContextAssemblyConfig {
  tokenBudget: TokenBudget;
  priorityWeights: PriorityWeights;
  fallbackStrategy: FallbackStrategy;
  cacheConfig: CacheConfiguration;
}

export interface PriorityWeights {
  [ContextPriority.CRITICAL]: number;
  [ContextPriority.HIGH]: number;
  [ContextPriority.MEDIUM]: number;
  [ContextPriority.LOW]: number;
  [ContextPriority.MINIMAL]: number;
}

export type FallbackStrategy =
  | 'truncate-oldest'
  | 'truncate-lowest-priority'
  | 'compress-content'
  | 'summarize-content'
  | 'fail-fast';

export interface CacheConfiguration {
  maxSize: number;
  ttl: number;
  strategy: 'lru' | 'lfu' | 'ttl' | 'fifo';
  persistToDisk: boolean;
}

// ============================================================================
// Export All Types  
// ============================================================================

// All types are already exported above