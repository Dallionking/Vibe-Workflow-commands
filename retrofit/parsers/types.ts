/**
 * Parser Types and Interfaces
 * Phase 2: Retrofit Context Enhancement
 */

export interface Parser {
    language: string;
    parse(code: string): Promise<AST>;
    extractPatterns(ast: AST): Promise<ParsedPattern[]>;
    validateSyntax(code: string): Promise<SyntaxValidation>;
}

export interface AST {
    type: string;
    body: ASTNode[];
    sourceType: 'script' | 'module';
    language: string;
    metadata: ASTMetadata;
}

export interface ASTNode {
    type: string;
    start: number;
    end: number;
    loc: SourceLocation;
    [key: string]: any;
}

export interface SourceLocation {
    start: Position;
    end: Position;
}

export interface Position {
    line: number;
    column: number;
}

export interface ASTMetadata {
    version: string;
    parser: string;
    parsingTime: number;
    complexity: number;
}

export interface ParsedPattern {
    type: string;
    name: string;
    signature: string;
    parameters?: Parameter[];
    returnType?: string;
    modifiers?: string[];
    annotations?: Annotation[];
    location: SourceLocation;
}

export interface Parameter {
    name: string;
    type?: string;
    optional: boolean;
    defaultValue?: string;
}

export interface Annotation {
    name: string;
    arguments?: string[];
}

export interface SyntaxValidation {
    valid: boolean;
    errors: SyntaxError[];
    warnings: SyntaxWarning[];
}

export interface SyntaxError {
    message: string;
    line: number;
    column: number;
    severity: 'error' | 'fatal';
}

export interface SyntaxWarning {
    message: string;
    line: number;
    column: number;
    rule: string;
}
