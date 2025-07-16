/**
 * Pattern Types and Interfaces
 * Phase 2: Retrofit Context Enhancement
 */

export enum PatternType {
    COMPONENT = 'component',
    SERVICE = 'service',
    UTILITY = 'utility',
    MODEL = 'model',
    CONTROLLER = 'controller',
    MIDDLEWARE = 'middleware',
    CONFIGURATION = 'configuration',
    TEST = 'test',
    NAMING_CONVENTION = 'naming_convention',
    STRUCTURE_CONVENTION = 'structure_convention',
    DESIGN_PATTERN = 'design_pattern'
}

export interface DetectedPattern {
    type: PatternType;
    signature: string;
    confidence: number;
    location: CodeLocation;
    metadata: PatternMetadata;
}

export interface CodeLocation {
    file: string;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
}

export interface PatternMetadata {
    language: string;
    framework?: string;
    complexity: number;
    frequency: number;
    variants?: string[];
    relatedPatterns?: string[];
}

export interface AnalysisContext {
    projectType: string;
    framework?: string;
    language: string;
    existingPatterns: DetectedPattern[];
    preferences: AnalysisPreferences;
}

export interface AnalysisPreferences {
    strictness: 'loose' | 'moderate' | 'strict';
    includeAntiPatterns: boolean;
    learnFromUsage: boolean;
    prioritizeConsistency: boolean;
}

export interface PatternLibrary {
    patterns: Map<PatternType, DetectedPattern[]>;
    conventions: ConventionRules;
    antiPatterns: AntiPattern[];
    confidence: number;
}

export interface ConventionRules {
    naming: NamingConvention[];
    structure: StructureConvention[];
    formatting: FormattingConvention[];
}

export interface NamingConvention {
    type: 'variable' | 'function' | 'class' | 'file' | 'directory';
    pattern: string;
    examples: string[];
    confidence: number;
}

export interface StructureConvention {
    type: 'file_organization' | 'folder_structure' | 'import_order';
    pattern: string;
    description: string;
    confidence: number;
}

export interface FormattingConvention {
    type: 'indentation' | 'quotes' | 'semicolons' | 'spacing';
    rule: string;
    confidence: number;
}

export interface AntiPattern {
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion: string;
    pattern: string;
}
