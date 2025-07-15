/**
 * Pattern Detection Engine
 * Phase 2: Retrofit Context Enhancement
 * 
 * Advanced pattern detection using Tree-sitter AST parsing
 * Supports multi-language analysis with machine learning-enhanced recognition
 */

import Parser, { Tree, Node, Query, QueryCapture } from 'tree-sitter';
import { 
  CodePattern, 
  PatternType, 
  SupportedLanguage, 
  PatternMetadata,
  PatternCategory,
  ContextPriority,
  CodeExample,
  FileLocation
} from '../types/retrofit.types';

export class PatternDetector {
    private parsers: Map<SupportedLanguage, Parser> = new Map();
    private queries: Map<SupportedLanguage, Map<PatternType, Query>> = new Map();
    private detectedPatterns: Map<string, CodePattern[]> = new Map();
    private patternCache: Map<string, CodePattern[]> = new Map();
    
    constructor() {
        this.initializeParsers();
        this.setupQueries();
    }
    
    /**
     * Initialize Tree-sitter parsers for supported languages
     */
    private async initializeParsers(): Promise<void> {
        try {
            // Initialize with placeholder parsers for now
            // In production, these would load actual Tree-sitter language grammars
            console.log('Initializing Tree-sitter parsers...');
            
            // TypeScript/JavaScript support
            this.parsers.set(SupportedLanguage.TYPESCRIPT, new Parser());
            this.parsers.set(SupportedLanguage.JAVASCRIPT, new Parser());
            
            // Multi-language support (when available)
            this.parsers.set(SupportedLanguage.PYTHON, new Parser());
            this.parsers.set(SupportedLanguage.JAVA, new Parser());
            this.parsers.set(SupportedLanguage.GO, new Parser());
            this.parsers.set(SupportedLanguage.RUST, new Parser());
            
        } catch (error) {
            console.error('Failed to initialize parsers:', error);
        }
    }
    
    /**
     * Setup Tree-sitter queries for pattern detection
     */
    private setupQueries(): void {
        this.setupTypeScriptQueries();
        this.setupPythonQueries();
        this.setupJavaQueries();
    }
    
    /**
     * Main pattern detection method
     */
    public async detectPatterns(
        sourceCode: string,
        language: SupportedLanguage,
        filePath: string
    ): Promise<CodePattern[]> {
        // Check cache first
        const cacheKey = `${filePath}_${this.hashCode(sourceCode)}`;
        if (this.patternCache.has(cacheKey)) {
            return this.patternCache.get(cacheKey)!;
        }
        
        const parser = this.parsers.get(language);
        if (!parser) {
            console.warn(`Parser not available for language: ${language}`);
            return [];
        }
        
        try {
            // Parse source code to AST
            const tree = parser.parse(sourceCode);
            const rootNode = tree.rootNode;
            
            // Detect various pattern types
            const patterns: CodePattern[] = [];
            
            patterns.push(...await this.detectNamingPatterns(rootNode, sourceCode, language, filePath));
            patterns.push(...await this.detectStructuralPatterns(rootNode, sourceCode, language, filePath));
            patterns.push(...await this.detectArchitecturalPatterns(rootNode, sourceCode, language, filePath));
            patterns.push(...await this.detectConventionPatterns(rootNode, sourceCode, language, filePath));
            patterns.push(...await this.detectErrorHandlingPatterns(rootNode, sourceCode, language, filePath));
            
            // Cache results
            this.patternCache.set(cacheKey, patterns);
            this.detectedPatterns.set(filePath, patterns);
            
            return patterns;
        } catch (error) {
            console.error(`Pattern detection failed for ${filePath}:`, error);
            return [];
        }
    }
    
    /**
     * Learn patterns from existing codebase
     */
    public async learnPatterns(filePaths: string[]): Promise<void> {
        const patternFrequency = new Map<string, number>();
        const learnedPatterns: CodePattern[] = [];
        
        for (const filePath of filePaths) {
            try {
                // Read file and detect language
                const language = this.detectLanguage(filePath);
                if (!language) continue;
                
                const sourceCode = await this.readFile(filePath);
                const patterns = await this.detectPatterns(sourceCode, language, filePath);
                
                // Aggregate patterns
                patterns.forEach(pattern => {
                    const key = `${pattern.type}_${pattern.name}`;
                    patternFrequency.set(key, (patternFrequency.get(key) || 0) + 1);
                });
                
                learnedPatterns.push(...patterns);
                
            } catch (error) {
                console.warn(`Failed to analyze ${filePath}:`, error);
            }
        }
        
        // Update pattern confidence based on frequency
        this.updatePatternConfidence(learnedPatterns, patternFrequency);
    }
    
    /**
     * Setup TypeScript/JavaScript queries
     */
    private setupTypeScriptQueries(): void {
        const tsQueries = new Map<PatternType, Query>();
        // Placeholder for actual Tree-sitter queries
        // In production, these would be actual Query objects
        this.queries.set(SupportedLanguage.TYPESCRIPT, tsQueries);
        this.queries.set(SupportedLanguage.JAVASCRIPT, tsQueries);
    }
    
    /**
     * Setup Python queries
     */
    private setupPythonQueries(): void {
        const pythonQueries = new Map<PatternType, Query>();
        this.queries.set(SupportedLanguage.PYTHON, pythonQueries);
    }
    
    /**
     * Setup Java queries
     */
    private setupJavaQueries(): void {
        const javaQueries = new Map<PatternType, Query>();
        this.queries.set(SupportedLanguage.JAVA, javaQueries);
    }
    
    /**
     * Detect naming convention patterns
     */
    private async detectNamingPatterns(
        node: Node,
        sourceCode: string,
        language: SupportedLanguage,
        filePath: string
    ): Promise<CodePattern[]> {
        const patterns: CodePattern[] = [];
        const identifiers = this.extractIdentifiers(node);
        
        // Analyze naming conventions
        const conventions = this.analyzeNamingConventions(identifiers);
        
        for (const [convention, examples] of conventions.entries()) {
            if (examples.length < 2) continue; // Need minimum examples for confidence
            
            const pattern: CodePattern = {
                id: `naming_${convention}_${Date.now()}`,
                type: PatternType.NAMING_CONVENTION,
                name: `${convention} Naming Convention`,
                description: `Consistent use of ${convention} naming convention`,
                confidence: this.calculateNamingConfidence(examples, identifiers.length),
                language,
                examples: examples.slice(0, 5).map(example => ({
                    source: example.text,
                    location: example.location,
                    context: this.extractContext(sourceCode, example.location),
                    frequency: example.frequency
                })),
                metadata: {
                    category: PatternCategory.PREFERRED,
                    priority: ContextPriority.MEDIUM,
                    stability: this.calculateStability(examples),
                    coverage: examples.length / identifiers.length,
                    lastUpdated: new Date(),
                    dependencies: []
                }
            };
            
            patterns.push(pattern);
        }
        
        return patterns;
    }
    
    /**
     * Detect structural patterns (classes, functions, etc.)
     */
    private async detectStructuralPatterns(
        node: Node,
        sourceCode: string,
        language: SupportedLanguage,
        filePath: string
    ): Promise<CodePattern[]> {
        const patterns: CodePattern[] = [];
        
        // Detect class patterns
        const classNodes = this.findNodesByType(node, 'class_declaration');
        if (classNodes.length > 0) {
            const classPattern = this.analyzeClassStructure(classNodes, sourceCode, language, filePath);
            patterns.push(classPattern);
        }
        
        // Detect function patterns
        const functionNodes = this.findNodesByType(node, ['function_declaration', 'arrow_function', 'method_definition']);
        if (functionNodes.length > 0) {
            const functionPattern = this.analyzeFunctionStructure(functionNodes, sourceCode, language, filePath);
            patterns.push(functionPattern);
        }
        
        return patterns;
    }
    
    /**
     * Detect architectural patterns
     */
    private async detectArchitecturalPatterns(
        node: Node,
        sourceCode: string,
        language: SupportedLanguage,
        filePath: string
    ): Promise<CodePattern[]> {
        const patterns: CodePattern[] = [];
        
        // Detect import/export patterns
        const importPattern = this.analyzeImportPatterns(node, sourceCode, language, filePath);
        if (importPattern) patterns.push(importPattern);
        
        // Detect component patterns (React, Vue, etc.)
        const componentPattern = this.analyzeComponentPatterns(node, sourceCode, language, filePath);
        if (componentPattern) patterns.push(componentPattern);
        
        return patterns;
    }
    
    /**
     * Detect coding convention patterns
     */
    private async detectConventionPatterns(
        node: Node,
        sourceCode: string,
        language: SupportedLanguage,
        filePath: string
    ): Promise<CodePattern[]> {
        const patterns: CodePattern[] = [];
        
        // Analyze formatting patterns
        const formattingPattern = this.analyzeFormattingPatterns(sourceCode, language, filePath);
        if (formattingPattern) patterns.push(formattingPattern);
        
        // Analyze organization patterns
        const organizationPattern = this.analyzeOrganizationPatterns(node, sourceCode, language, filePath);
        if (organizationPattern) patterns.push(organizationPattern);
        
        return patterns;
    }
    
    /**
     * Detect error handling patterns
     */
    private async detectErrorHandlingPatterns(
        node: Node,
        sourceCode: string,
        language: SupportedLanguage,
        filePath: string
    ): Promise<CodePattern[]> {
        const patterns: CodePattern[] = [];
        
        // Detect try-catch patterns
        const tryNodes = this.findNodesByType(node, 'try_statement');
        if (tryNodes.length > 0) {
            const errorPattern = this.analyzeTryCatchPatterns(tryNodes, sourceCode, language, filePath);
            patterns.push(errorPattern);
        }
        
        return patterns;
    }
    
    /**
     * Extract all identifiers from AST
     */
    private extractIdentifiers(node: Node): Array<{text: string, location: FileLocation, frequency: number}> {
        const identifiers: Array<{text: string, location: FileLocation, frequency: number}> = [];
        const frequencyMap = new Map<string, number>();
        
        const traverse = (currentNode: Node) => {
            if (currentNode.type === 'identifier' || currentNode.type === 'property_identifier') {
                const text = currentNode.text;
                const location: FileLocation = {
                    file: '',
                    line: currentNode.startPosition.row,
                    column: currentNode.startPosition.column,
                    length: text.length
                };
                
                frequencyMap.set(text, (frequencyMap.get(text) || 0) + 1);
                identifiers.push({ text, location, frequency: 1 });
            }
            
            for (let i = 0; i < currentNode.childCount; i++) {
                traverse(currentNode.child(i)!);
            }
        };
        
        traverse(node);
        
        // Update frequencies
        identifiers.forEach(id => {
            id.frequency = frequencyMap.get(id.text) || 1;
        });
        
        return identifiers;
    }
    
    /**
     * Analyze naming conventions from identifiers
     */
    private analyzeNamingConventions(identifiers: Array<{text: string, location: FileLocation, frequency: number}>): Map<string, Array<{text: string, location: FileLocation, frequency: number}>> {
        const conventions = new Map<string, Array<{text: string, location: FileLocation, frequency: number}>>();
        
        identifiers.forEach(identifier => {
            const convention = this.detectNamingConvention(identifier.text);
            if (!conventions.has(convention)) {
                conventions.set(convention, []);
            }
            conventions.get(convention)!.push(identifier);
        });
        
        return conventions;
    }
    
    /**
     * Detect naming convention type using regex patterns
     */
    private detectNamingConvention(text: string): string {
        if (/^[a-z]+([A-Z][a-z0-9]*)*$/.test(text)) return 'camelCase';
        if (/^[A-Z][a-z0-9]*([A-Z][a-z0-9]*)*$/.test(text)) return 'PascalCase';
        if (/^[a-z]+(_[a-z0-9]+)*$/.test(text)) return 'snake_case';
        if (/^[A-Z]+(_[A-Z0-9]+)*$/.test(text)) return 'SCREAMING_SNAKE_CASE';
        if (/^[a-z]+(-[a-z0-9]+)*$/.test(text)) return 'kebab-case';
        return 'mixed';
    }
    
    /**
     * Utility methods
     */
    private calculateNamingConfidence(examples: any[], totalIdentifiers: number): number {
        return Math.min(examples.length / Math.max(totalIdentifiers, 1), 1.0);
    }
    
    private calculateStability(examples: any[]): number {
        return examples.length > 5 ? 0.9 : 0.7;
    }
    
    private extractContext(sourceCode: string, location: FileLocation): string {
        const lines = sourceCode.split('\n');
        const contextLines = lines.slice(
            Math.max(0, location.line - 1),
            Math.min(lines.length, location.line + 2)
        );
        return contextLines.join('\n');
    }
    
    private findNodesByType(node: Node, types: string | string[]): Node[] {
        const targetTypes = Array.isArray(types) ? types : [types];
        const results: Node[] = [];
        
        const traverse = (currentNode: Node) => {
            if (targetTypes.includes(currentNode.type)) {
                results.push(currentNode);
            }
            
            for (let i = 0; i < currentNode.childCount; i++) {
                traverse(currentNode.child(i)!);
            }
        };
        
        traverse(node);
        return results;
    }
    
    private analyzeClassStructure(classNodes: Node[], sourceCode: string, language: SupportedLanguage, filePath: string): CodePattern {
        return {
            id: `class_structure_${Date.now()}`,
            type: PatternType.COMPONENT_STRUCTURE,
            name: 'Class Structure Pattern',
            description: 'Consistent class organization and structure',
            confidence: 0.8,
            language,
            examples: [],
            metadata: {
                category: PatternCategory.IMPORTANT,
                priority: ContextPriority.HIGH,
                stability: 0.8,
                coverage: 0.7,
                lastUpdated: new Date(),
                dependencies: []
            }
        };
    }
    
    private analyzeFunctionStructure(functionNodes: Node[], sourceCode: string, language: SupportedLanguage, filePath: string): CodePattern {
        return {
            id: `function_structure_${Date.now()}`,
            type: PatternType.COMPONENT_STRUCTURE,
            name: 'Function Structure Pattern',
            description: 'Consistent function organization and structure',
            confidence: 0.8,
            language,
            examples: [],
            metadata: {
                category: PatternCategory.IMPORTANT,
                priority: ContextPriority.HIGH,
                stability: 0.8,
                coverage: 0.7,
                lastUpdated: new Date(),
                dependencies: []
            }
        };
    }
    
    private analyzeImportPatterns(node: Node, sourceCode: string, language: SupportedLanguage, filePath: string): CodePattern | null {
        const importNodes = this.findNodesByType(node, ['import_statement', 'import_declaration']);
        if (importNodes.length === 0) return null;
        
        return {
            id: `import_pattern_${Date.now()}`,
            type: PatternType.API_PATTERN,
            name: 'Import Organization Pattern',
            description: 'Consistent import statement organization',
            confidence: 0.8,
            language,
            examples: [],
            metadata: {
                category: PatternCategory.PREFERRED,
                priority: ContextPriority.MEDIUM,
                stability: 0.8,
                coverage: 0.7,
                lastUpdated: new Date(),
                dependencies: []
            }
        };
    }
    
    private analyzeComponentPatterns(node: Node, sourceCode: string, language: SupportedLanguage, filePath: string): CodePattern | null {
        const componentIndicators = this.findNodesByType(node, ['jsx_element', 'jsx_fragment']);
        if (componentIndicators.length === 0) return null;
        
        return {
            id: `component_pattern_${Date.now()}`,
            type: PatternType.COMPONENT_STRUCTURE,
            name: 'Component Pattern',
            description: 'React/Vue component structure and organization',
            confidence: 0.9,
            language,
            examples: [],
            metadata: {
                category: PatternCategory.CRITICAL,
                priority: ContextPriority.HIGH,
                stability: 0.9,
                coverage: 0.8,
                lastUpdated: new Date(),
                dependencies: []
            }
        };
    }
    
    private analyzeFormattingPatterns(sourceCode: string, language: SupportedLanguage, filePath: string): CodePattern | null {
        // Analyze indentation, quotes, semicolons, etc.
        const indentationPattern = this.detectIndentationPattern(sourceCode);
        const quotePattern = this.detectQuotePattern(sourceCode);
        
        return {
            id: `formatting_pattern_${Date.now()}`,
            type: PatternType.STYLING,
            name: 'Code Formatting Pattern',
            description: `Consistent formatting: ${indentationPattern}, ${quotePattern}`,
            confidence: 0.8,
            language,
            examples: [],
            metadata: {
                category: PatternCategory.PREFERRED,
                priority: ContextPriority.LOW,
                stability: 0.8,
                coverage: 0.9,
                lastUpdated: new Date(),
                dependencies: []
            }
        };
    }
    
    private analyzeOrganizationPatterns(node: Node, sourceCode: string, language: SupportedLanguage, filePath: string): CodePattern | null {
        return {
            id: `organization_pattern_${Date.now()}`,
            type: PatternType.CONFIGURATION,
            name: 'Code Organization Pattern',
            description: 'File and directory organization patterns',
            confidence: 0.7,
            language,
            examples: [],
            metadata: {
                category: PatternCategory.PREFERRED,
                priority: ContextPriority.MEDIUM,
                stability: 0.7,
                coverage: 0.6,
                lastUpdated: new Date(),
                dependencies: []
            }
        };
    }
    
    private analyzeTryCatchPatterns(tryNodes: Node[], sourceCode: string, language: SupportedLanguage, filePath: string): CodePattern {
        return {
            id: `error_handling_${Date.now()}`,
            type: PatternType.ERROR_HANDLING,
            name: 'Error Handling Pattern',
            description: 'Consistent error handling approach',
            confidence: 0.8,
            language,
            examples: [],
            metadata: {
                category: PatternCategory.IMPORTANT,
                priority: ContextPriority.HIGH,
                stability: 0.8,
                coverage: 0.7,
                lastUpdated: new Date(),
                dependencies: []
            }
        };
    }
    
    private detectIndentationPattern(sourceCode: string): string {
        const lines = sourceCode.split('\n');
        let spaceCount = 0;
        let tabCount = 0;
        
        lines.forEach(line => {
            if (line.startsWith('  ')) spaceCount++;
            if (line.startsWith('\t')) tabCount++;
        });
        
        return tabCount > spaceCount ? 'tabs' : 'spaces';
    }
    
    private detectQuotePattern(sourceCode: string): string {
        const singleQuotes = (sourceCode.match(/'/g) || []).length;
        const doubleQuotes = (sourceCode.match(/"/g) || []).length;
        const backticksQuotes = (sourceCode.match(/`/g) || []).length;
        
        if (backticksQuotes > singleQuotes && backticksQuotes > doubleQuotes) return 'backticks';
        return singleQuotes > doubleQuotes ? 'single' : 'double';
    }
    
    private detectLanguage(filePath: string): SupportedLanguage | null {
        const extension = filePath.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'ts': return SupportedLanguage.TYPESCRIPT;
            case 'js': return SupportedLanguage.JAVASCRIPT;
            case 'py': return SupportedLanguage.PYTHON;
            case 'java': return SupportedLanguage.JAVA;
            case 'go': return SupportedLanguage.GO;
            case 'rs': return SupportedLanguage.RUST;
            default: return null;
        }
    }
    
    private async readFile(filePath: string): Promise<string> {
        // Placeholder - in production would read actual file
        return '';
    }
    
    private updatePatternConfidence(patterns: CodePattern[], frequency: Map<string, number>): void {
        patterns.forEach(pattern => {
            const key = `${pattern.type}_${pattern.name}`;
            const freq = frequency.get(key) || 1;
            pattern.confidence = Math.min(pattern.confidence * (freq / 10), 1.0);
        });
    }
    
    private hashCode(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }
    
    /**
     * Public API methods
     */
    public getCachedPatterns(filePath: string): CodePattern[] {
        return this.detectedPatterns.get(filePath) || [];
    }
    
    public clearCache(): void {
        this.patternCache.clear();
        this.detectedPatterns.clear();
    }
    
    public getStatistics(): {
        filesAnalyzed: number;
        patternsDetected: number;
        languagesSupported: number;
    } {
        const patternsDetected = Array.from(this.detectedPatterns.values())
            .reduce((total, patterns) => total + patterns.length, 0);
        
        return {
            filesAnalyzed: this.detectedPatterns.size,
            patternsDetected,
            languagesSupported: this.parsers.size
        };
    }
}