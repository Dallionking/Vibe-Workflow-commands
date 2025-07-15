/**
 * Retrofit Context Enhancement Types
 * Defines interfaces and types for Phase 2 retrofit functionality
 */

import { ContextPriority } from '../../context/types/context.types';

// Re-export ContextPriority for convenience
export { ContextPriority };

// Core Retrofit Types
export interface RetrofitContext {
  L0_Discovery: DiscoveryContext;      // Codebase analysis
  L1_Preservation: PreservationContext; // What to protect
  L2_Improvement: ImprovementContext;   // What to enhance
  L3_Evolution: EvolutionContext;       // Migration path
}

export interface DiscoveryContext {
  codebaseStructure: CodebaseStructure;
  patterns: CodePattern[];
  dependencies: DependencyMap;
  techStack: TechnologyStack;
  conventions: ConventionSet;
}

export interface PreservationContext {
  criticalPatterns: CodePattern[];
  businessLogic: BusinessLogicMap;
  dataStructures: DataStructureMap;
  apiContracts: ApiContractMap;
  preservationRules: PreservationRule[];
}

export interface ImprovementContext {
  opportunities: ImprovementOpportunity[];
  modernizationPaths: ModernizationPath[];
  performanceGains: PerformanceOpportunity[];
  qualityMetrics: QualityMetrics;
  recommendations: Recommendation[];
}

export interface EvolutionContext {
  migrationPlan: MigrationPlan;
  phaseStrategy: PhaseStrategy;
  riskAssessment: RiskAssessment;
  rollbackStrategy: RollbackStrategy;
  validationCriteria: ValidationCriteria[];
}

// Pattern Recognition Types
export interface CodePattern {
  id: string;
  type: PatternType;
  name: string;
  description: string;
  confidence: number;
  language: SupportedLanguage;
  examples: CodeExample[];
  metadata: PatternMetadata;
}

export interface CodeExample {
  source: string;
  location: FileLocation;
  context: string;
  frequency: number;
}

export interface FileLocation {
  file: string;
  line: number;
  column: number;
  length: number;
}

export interface PatternMetadata {
  category: PatternCategory;
  priority: ContextPriority;
  stability: number; // 0-1, how consistent this pattern is
  coverage: number;  // 0-1, how widespread in codebase
  lastUpdated: Date;
  dependencies: string[];
}

export enum PatternType {
  NAMING_CONVENTION = 'naming_convention',
  ARCHITECTURAL = 'architectural',
  STYLING = 'styling',
  TESTING = 'testing',
  ERROR_HANDLING = 'error_handling',
  DATA_FLOW = 'data_flow',
  COMPONENT_STRUCTURE = 'component_structure',
  API_PATTERN = 'api_pattern',
  STATE_MANAGEMENT = 'state_management',
  CONFIGURATION = 'configuration'
}

export enum PatternCategory {
  CRITICAL = 'critical',     // Must preserve exactly
  IMPORTANT = 'important',   // Should preserve
  PREFERRED = 'preferred',   // Nice to preserve
  OPTIONAL = 'optional'      // Can be changed
}

export enum SupportedLanguage {
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
  GO = 'go',
  RUST = 'rust',
  GENERIC = 'generic'
}

// Codebase Analysis Types
export interface CodebaseStructure {
  rootPath: string;
  directories: DirectoryNode[];
  fileTypes: FileTypeAnalysis;
  entryPoints: string[];
  buildSystem: BuildSystemInfo;
}

export interface DirectoryNode {
  name: string;
  path: string;
  children: DirectoryNode[];
  files: FileNode[];
  purpose: DirectoryPurpose;
}

export interface FileNode {
  name: string;
  path: string;
  extension: string;
  size: number;
  language: SupportedLanguage;
  imports: string[];
  exports: string[];
  complexity: number;
}

export enum DirectoryPurpose {
  SOURCE = 'source',
  TESTS = 'tests',
  CONFIG = 'config',
  BUILD = 'build',
  DOCS = 'docs',
  ASSETS = 'assets',
  TOOLS = 'tools',
  UNKNOWN = 'unknown'
}

export interface FileTypeAnalysis {
  sourceFiles: number;
  testFiles: number;
  configFiles: number;
  documentationFiles: number;
  assetFiles: number;
  totalFiles: number;
}

export interface BuildSystemInfo {
  type: BuildSystemType;
  configFiles: string[];
  dependencies: DependencyInfo[];
  scripts: ScriptInfo[];
}

export enum BuildSystemType {
  NPM = 'npm',
  YARN = 'yarn',
  PNPM = 'pnpm',
  MAVEN = 'maven',
  GRADLE = 'gradle',
  PIP = 'pip',
  POETRY = 'poetry',
  CARGO = 'cargo',
  GO_MOD = 'go_mod',
  UNKNOWN = 'unknown'
}

export interface DependencyInfo {
  name: string;
  version: string;
  type: DependencyType;
  source: string;
}

export enum DependencyType {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  PEER = 'peer',
  OPTIONAL = 'optional'
}

export interface ScriptInfo {
  name: string;
  command: string;
  purpose: ScriptPurpose;
}

export enum ScriptPurpose {
  BUILD = 'build',
  TEST = 'test',
  START = 'start',
  DEPLOY = 'deploy',
  LINT = 'lint',
  FORMAT = 'format',
  CUSTOM = 'custom'
}

// Convention and Style Types
export interface ConventionSet {
  naming: NamingConventions;
  formatting: FormattingConventions;
  organization: OrganizationConventions;
  testing: TestingConventions;
}

export interface NamingConventions {
  variables: NamingStyle;
  functions: NamingStyle;
  classes: NamingStyle;
  files: NamingStyle;
  directories: NamingStyle;
  constants: NamingStyle;
}

export enum NamingStyle {
  CAMEL_CASE = 'camelCase',
  PASCAL_CASE = 'PascalCase',
  SNAKE_CASE = 'snake_case',
  KEBAB_CASE = 'kebab-case',
  SCREAMING_SNAKE_CASE = 'SCREAMING_SNAKE_CASE',
  MIXED = 'mixed'
}

export interface FormattingConventions {
  indentation: IndentationStyle;
  quotes: QuoteStyle;
  semicolons: SemicolonStyle;
  lineEndings: LineEndingStyle;
  maxLineLength: number;
}

export enum IndentationStyle {
  SPACES_2 = 'spaces_2',
  SPACES_4 = 'spaces_4',
  TABS = 'tabs',
  MIXED = 'mixed'
}

export enum QuoteStyle {
  SINGLE = 'single',
  DOUBLE = 'double',
  BACKTICK = 'backtick',
  MIXED = 'mixed'
}

export enum SemicolonStyle {
  ALWAYS = 'always',
  NEVER = 'never',
  MIXED = 'mixed'
}

export enum LineEndingStyle {
  LF = 'lf',
  CRLF = 'crlf',
  MIXED = 'mixed'
}

export interface OrganizationConventions {
  directoryStructure: DirectoryStructurePattern;
  fileOrganization: FileOrganizationPattern;
  importStyle: ImportStylePattern;
}

export enum DirectoryStructurePattern {
  FEATURE_BASED = 'feature_based',
  LAYER_BASED = 'layer_based',
  DOMAIN_BASED = 'domain_based',
  HYBRID = 'hybrid',
  FLAT = 'flat'
}

export enum FileOrganizationPattern {
  SINGLE_RESPONSIBILITY = 'single_responsibility',
  GROUPED_BY_TYPE = 'grouped_by_type',
  GROUPED_BY_FEATURE = 'grouped_by_feature',
  MIXED = 'mixed'
}

export enum ImportStylePattern {
  ABSOLUTE_IMPORTS = 'absolute_imports',
  RELATIVE_IMPORTS = 'relative_imports',
  MIXED_IMPORTS = 'mixed_imports',
  BARREL_EXPORTS = 'barrel_exports'
}

export interface TestingConventions {
  framework: TestingFramework;
  fileNaming: TestFileNaming;
  organization: TestOrganization;
  coverage: CoverageRequirements;
}

export enum TestingFramework {
  JEST = 'jest',
  MOCHA = 'mocha',
  JASMINE = 'jasmine',
  VITEST = 'vitest',
  PYTEST = 'pytest',
  JUNIT = 'junit',
  UNKNOWN = 'unknown'
}

export enum TestFileNaming {
  DOT_TEST = '.test',
  DOT_SPEC = '.spec',
  UNDERSCORE_TEST = '_test',
  TEST_SUFFIX = 'Test',
  MIXED = 'mixed'
}

export enum TestOrganization {
  COLOCATED = 'colocated',
  SEPARATE_DIRECTORY = 'separate_directory',
  MIRROR_STRUCTURE = 'mirror_structure',
  MIXED = 'mixed'
}

export interface CoverageRequirements {
  minimum: number;
  target: number;
  types: CoverageType[];
}

export enum CoverageType {
  STATEMENT = 'statement',
  BRANCH = 'branch',
  FUNCTION = 'function',
  LINE = 'line'
}

// Technology Stack Types
export interface TechnologyStack {
  frontend: TechnologyInfo[];
  backend: TechnologyInfo[];
  database: TechnologyInfo[];
  infrastructure: TechnologyInfo[];
  tools: TechnologyInfo[];
}

export interface TechnologyInfo {
  name: string;
  version: string;
  category: TechnologyCategory;
  confidence: number;
  usage: TechnologyUsage;
}

export enum TechnologyCategory {
  FRAMEWORK = 'framework',
  LIBRARY = 'library',
  RUNTIME = 'runtime',
  DATABASE = 'database',
  TOOL = 'tool',
  SERVICE = 'service'
}

export enum TechnologyUsage {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  UTILITY = 'utility',
  LEGACY = 'legacy'
}

// Improvement and Evolution Types
export interface ImprovementOpportunity {
  id: string;
  type: ImprovementType;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  priority: number;
  benefits: string[];
  risks: string[];
}

export enum ImprovementType {
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  MAINTAINABILITY = 'maintainability',
  SCALABILITY = 'scalability',
  ACCESSIBILITY = 'accessibility',
  USER_EXPERIENCE = 'user_experience',
  DEVELOPER_EXPERIENCE = 'developer_experience'
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum EffortLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface ModernizationPath {
  from: TechnologyInfo;
  to: TechnologyInfo;
  steps: ModernizationStep[];
  timeline: string;
  risks: string[];
  benefits: string[];
}

export interface ModernizationStep {
  description: string;
  order: number;
  dependencies: string[];
  estimatedTime: string;
  validationCriteria: string[];
}

export interface PerformanceOpportunity {
  type: PerformanceType;
  location: FileLocation;
  description: string;
  impact: ImpactLevel;
  solution: string;
}

export enum PerformanceType {
  BUNDLE_SIZE = 'bundle_size',
  RUNTIME_SPEED = 'runtime_speed',
  MEMORY_USAGE = 'memory_usage',
  NETWORK_REQUESTS = 'network_requests',
  DATABASE_QUERIES = 'database_queries',
  CACHING = 'caching'
}

export interface QualityMetrics {
  complexity: ComplexityMetrics;
  maintainability: MaintainabilityMetrics;
  testability: TestabilityMetrics;
  security: SecurityMetrics;
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  depthOfInheritance: number;
  linesOfCode: number;
}

export interface MaintainabilityMetrics {
  duplicatedCode: number;
  technicalDebt: number;
  codeSmells: number;
  documentationCoverage: number;
}

export interface TestabilityMetrics {
  testCoverage: number;
  testQuality: number;
  mockability: number;
  isolation: number;
}

export interface SecurityMetrics {
  vulnerabilities: VulnerabilityInfo[];
  securityScore: number;
  complianceLevel: ComplianceLevel;
}

export interface VulnerabilityInfo {
  type: VulnerabilityType;
  severity: SeverityLevel;
  location: FileLocation;
  description: string;
  recommendation: string;
}

export enum VulnerabilityType {
  XSS = 'xss',
  SQL_INJECTION = 'sql_injection',
  CSRF = 'csrf',
  INSECURE_DEPENDENCIES = 'insecure_dependencies',
  SENSITIVE_DATA_EXPOSURE = 'sensitive_data_exposure'
}

export enum SeverityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info'
}

export enum ComplianceLevel {
  COMPLIANT = 'compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  NON_COMPLIANT = 'non_compliant',
  UNKNOWN = 'unknown'
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: RecommendationType;
  priority: number;
  effort: EffortLevel;
  impact: ImpactLevel;
  steps: RecommendationStep[];
}

export enum RecommendationType {
  REFACTOR = 'refactor',
  UPGRADE = 'upgrade',
  MIGRATE = 'migrate',
  OPTIMIZE = 'optimize',
  SECURE = 'secure',
  DOCUMENT = 'document'
}

export interface RecommendationStep {
  description: string;
  order: number;
  automated: boolean;
  validationCriteria: string[];
}

// Migration and Evolution Types
export interface MigrationPlan {
  phases: MigrationPhase[];
  timeline: string;
  dependencies: PhaseDependency[];
  rollbackStrategy: RollbackStrategy;
}

export interface MigrationPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  tasks: MigrationTask[];
  validationCriteria: ValidationCriteria[];
  rollbackPoint: RollbackPoint;
}

export interface MigrationTask {
  id: string;
  description: string;
  type: TaskType;
  automated: boolean;
  estimatedTime: string;
  dependencies: string[];
  validationSteps: string[];
}

export enum TaskType {
  CODE_CHANGE = 'code_change',
  CONFIG_CHANGE = 'config_change',
  DEPENDENCY_UPDATE = 'dependency_update',
  DATA_MIGRATION = 'data_migration',
  INFRASTRUCTURE_CHANGE = 'infrastructure_change',
  TESTING = 'testing',
  VALIDATION = 'validation'
}

export interface PhaseDependency {
  phase: string;
  dependsOn: string[];
  type: DependencyType;
}

export interface PhaseStrategy {
  approach: MigrationApproach;
  parallelization: ParallelizationStrategy;
  riskMitigation: RiskMitigationStrategy[];
}

export enum MigrationApproach {
  BIG_BANG = 'big_bang',
  INCREMENTAL = 'incremental',
  PARALLEL_RUN = 'parallel_run',
  STRANGLER_FIG = 'strangler_fig'
}

export enum ParallelizationStrategy {
  SEQUENTIAL = 'sequential',
  PARALLEL_BY_FEATURE = 'parallel_by_feature',
  PARALLEL_BY_LAYER = 'parallel_by_layer',
  PARALLEL_BY_TEAM = 'parallel_by_team'
}

export enum RiskMitigationStrategy {
  FEATURE_FLAGS = 'feature_flags',
  CANARY_DEPLOYMENT = 'canary_deployment',
  BLUE_GREEN_DEPLOYMENT = 'blue_green_deployment',
  ROLLBACK_PLAN = 'rollback_plan',
  MONITORING = 'monitoring'
}

export interface RiskAssessment {
  risks: Risk[];
  overallRiskLevel: RiskLevel;
  mitigationStrategies: RiskMitigationStrategy[];
}

export interface Risk {
  id: string;
  description: string;
  likelihood: Likelihood;
  impact: ImpactLevel;
  category: RiskCategory;
  mitigation: string;
}

export enum Likelihood {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

export enum RiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  MINIMAL = 'minimal'
}

export enum RiskCategory {
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  OPERATIONAL = 'operational',
  SECURITY = 'security',
  COMPLIANCE = 'compliance'
}

export interface RollbackStrategy {
  triggers: RollbackTrigger[];
  steps: RollbackStep[];
  timeLimit: string;
  dataRecovery: DataRecoveryPlan;
}

export interface RollbackTrigger {
  condition: string;
  automated: boolean;
  threshold: string;
}

export interface RollbackStep {
  description: string;
  order: number;
  automated: boolean;
  timeEstimate: string;
}

export interface DataRecoveryPlan {
  backupStrategy: BackupStrategy;
  recoveryTime: string;
  dataIntegrityChecks: string[];
}

export enum BackupStrategy {
  FULL_BACKUP = 'full_backup',
  INCREMENTAL_BACKUP = 'incremental_backup',
  SNAPSHOT = 'snapshot',
  TRANSACTION_LOG = 'transaction_log'
}

export interface ValidationCriteria {
  name: string;
  description: string;
  type: ValidationType;
  automated: boolean;
  successCriteria: string[];
  failureCriteria: string[];
}

export enum ValidationType {
  FUNCTIONAL = 'functional',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  INTEGRATION = 'integration',
  USER_ACCEPTANCE = 'user_acceptance'
}

export interface RollbackPoint {
  id: string;
  description: string;
  timestamp: Date;
  dataSnapshot: string;
  codeSnapshot: string;
  configSnapshot: string;
}

// Additional utility types
export type DependencyMap = Map<string, DependencyInfo[]>;
export type BusinessLogicMap = Map<string, BusinessLogicInfo>;
export type DataStructureMap = Map<string, DataStructureInfo>;
export type ApiContractMap = Map<string, ApiContractInfo>;

export interface BusinessLogicInfo {
  location: FileLocation;
  complexity: number;
  dependencies: string[];
  testCoverage: number;
  criticality: CriticalityLevel;
}

export enum CriticalityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface DataStructureInfo {
  name: string;
  type: DataStructureType;
  schema: any;
  usage: DataUsageInfo[];
  migrations: DataMigrationInfo[];
}

export enum DataStructureType {
  DATABASE_TABLE = 'database_table',
  API_MODEL = 'api_model',
  INTERFACE = 'interface',
  CLASS = 'class',
  TYPE = 'type'
}

export interface DataUsageInfo {
  location: FileLocation;
  operation: DataOperation;
  frequency: number;
}

export enum DataOperation {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  VALIDATE = 'validate'
}

export interface DataMigrationInfo {
  version: string;
  description: string;
  script: string;
  rollback: string;
}

export interface ApiContractInfo {
  endpoint: string;
  method: HttpMethod;
  parameters: ApiParameter[];
  responses: ApiResponse[];
  authentication: AuthenticationType;
  versioning: ApiVersioning;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation: ValidationRule[];
}

export interface ValidationRule {
  type: ValidationType;
  value: any;
  message: string;
}

export interface ApiResponse {
  statusCode: number;
  description: string;
  schema: any;
  examples: any[];
}

export enum AuthenticationType {
  NONE = 'none',
  API_KEY = 'api_key',
  BASIC_AUTH = 'basic_auth',
  BEARER_TOKEN = 'bearer_token',
  OAUTH2 = 'oauth2',
  JWT = 'jwt'
}

export interface ApiVersioning {
  strategy: VersioningStrategy;
  currentVersion: string;
  supportedVersions: string[];
  deprecationPolicy: DeprecationPolicy;
}

export enum VersioningStrategy {
  URL_PATH = 'url_path',
  QUERY_PARAMETER = 'query_parameter',
  HEADER = 'header',
  CONTENT_TYPE = 'content_type'
}

export interface DeprecationPolicy {
  warningPeriod: string;
  removalTimeline: string;
  migrationGuide: string;
}

export interface PreservationRule {
  id: string;
  name: string;
  description: string;
  type: PreservationRuleType;
  scope: PreservationScope;
  conditions: PreservationCondition[];
  actions: PreservationAction[];
}

export enum PreservationRuleType {
  MUST_PRESERVE = 'must_preserve',
  SHOULD_PRESERVE = 'should_preserve',
  MAY_MODIFY = 'may_modify',
  SHOULD_MODERNIZE = 'should_modernize'
}

export enum PreservationScope {
  GLOBAL = 'global',
  MODULE = 'module',
  FUNCTION = 'function',
  CLASS = 'class',
  VARIABLE = 'variable',
  INTERFACE = 'interface'
}

export interface PreservationCondition {
  type: ConditionType;
  field: string;
  operator: ConditionOperator;
  value: any;
}

export enum ConditionType {
  PATTERN_MATCH = 'pattern_match',
  FILE_EXTENSION = 'file_extension',
  DIRECTORY_PATH = 'directory_path',
  DEPENDENCY = 'dependency',
  ANNOTATION = 'annotation',
  COMMENT = 'comment'
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  REGEX = 'regex',
  EXISTS = 'exists',
  NOT_EXISTS = 'not_exists'
}

export interface PreservationAction {
  type: ActionType;
  description: string;
  parameters: Record<string, any>;
}

export enum ActionType {
  PRESERVE_EXACT = 'preserve_exact',
  PRESERVE_SEMANTIC = 'preserve_semantic',
  MODERNIZE_SYNTAX = 'modernize_syntax',
  ADD_TYPES = 'add_types',
  EXTRACT_INTERFACE = 'extract_interface',
  DOCUMENT = 'document',
  TEST = 'test'
}