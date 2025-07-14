/**
 * Retrofit Context Layers Implementation
 * Phase 2: Retrofit Context Enhancement
 * 
 * Four-tier context system for intelligent retrofitting
 */

// Import pattern types - will be created in patterns module
export interface DetectedPattern {
    name: string;
    file: string;
    confidence: number;
    type: string;
}

export interface PatternCategory {
    name: string;
    count: number;
    patterns: DetectedPattern[];
}

export interface PatternLibrary {
    patterns: DetectedPattern[];
    categories: PatternCategory[];
}

export interface RetrofitContext {
    L0_Discovery: DiscoveryContext;
    L1_Preservation: PreservationContext;
    L2_Improvement: ImprovementContext;
    L3_Evolution: EvolutionContext;
}

export interface DiscoveryContext {
    codebase: CodebaseProfile;
    patterns: PatternLibrary;
    dependencies: DependencyMap;
    architecture: ArchitectureProfile;
    technicalDebt: TechnicalDebtAnalysis;
}

export interface PreservationContext {
    criticalPaths: CriticalPath[];
    businessLogic: BusinessLogicMap;
    apiContracts: APIContract[];
    dataStructures: DataStructure[];
    performanceCritical: PerformanceCriticalPath[];
}

export interface ImprovementContext {
    opportunities: ImprovementOpportunity[];
    modernizationTargets: ModernizationTarget[];
    qualityEnhancements: QualityEnhancement[];
    securityUpdates: SecurityUpdate[];
    performanceOptimizations: PerformanceOptimization[];
}

export interface EvolutionContext {
    migrationPath: MigrationStep[];
    phaseStrategy: PhaseStrategy;
    rollbackPlan: RollbackPlan;
    validationGates: ValidationGate[];
    teamCoordination: TeamCoordinationPlan;
}

export class RetrofitContextBuilder {
    private context: Partial<RetrofitContext> = {};
    
    async buildDiscoveryContext(codebasePath: string): Promise<DiscoveryContext> {
        const discovery: DiscoveryContext = {
            codebase: await this.analyzeCodebase(codebasePath),
            patterns: await this.detectPatterns(codebasePath),
            dependencies: await this.mapDependencies(codebasePath),
            architecture: await this.analyzeArchitecture(codebasePath),
            technicalDebt: await this.analyzeTechnicalDebt(codebasePath)
        };
        
        this.context.L0_Discovery = discovery;
        return discovery;
    }
    
    async buildPreservationContext(discovery: DiscoveryContext): Promise<PreservationContext> {
        const preservation: PreservationContext = {
            criticalPaths: await this.identifyCriticalPaths(discovery),
            businessLogic: await this.mapBusinessLogic(discovery),
            apiContracts: await this.extractAPIContracts(discovery),
            dataStructures: await this.analyzeDataStructures(discovery),
            performanceCritical: await this.identifyPerformanceCritical(discovery)
        };
        
        this.context.L1_Preservation = preservation;
        return preservation;
    }
    
    async buildImprovementContext(
        discovery: DiscoveryContext, 
        preservation: PreservationContext
    ): Promise<ImprovementContext> {
        const improvement: ImprovementContext = {
            opportunities: await this.identifyOpportunities(discovery, preservation),
            modernizationTargets: await this.identifyModernizationTargets(discovery),
            qualityEnhancements: await this.identifyQualityEnhancements(discovery),
            securityUpdates: await this.identifySecurityUpdates(discovery),
            performanceOptimizations: await this.identifyPerformanceOptimizations(discovery)
        };
        
        this.context.L2_Improvement = improvement;
        return improvement;
    }
    
    async buildEvolutionContext(
        discovery: DiscoveryContext,
        preservation: PreservationContext,
        improvement: ImprovementContext
    ): Promise<EvolutionContext> {
        const evolution: EvolutionContext = {
            migrationPath: await this.planMigration(discovery, preservation, improvement),
            phaseStrategy: await this.planPhases(improvement),
            rollbackPlan: await this.createRollbackPlan(preservation),
            validationGates: await this.defineValidationGates(preservation),
            teamCoordination: await this.planTeamCoordination(improvement)
        };
        
        this.context.L3_Evolution = evolution;
        return evolution;
    }
    
    getCompleteContext(): RetrofitContext {
        if (!this.isContextComplete()) {
            throw new Error('Retrofit context is not complete. Build all layers first.');
        }
        
        return this.context as RetrofitContext;
    }
    
    private isContextComplete(): boolean {
        return !!(
            this.context.L0_Discovery &&
            this.context.L1_Preservation &&
            this.context.L2_Improvement &&
            this.context.L3_Evolution
        );
    }
    
    // Discovery layer implementations
    private async analyzeCodebase(path: string): Promise<CodebaseProfile> {
        const fs = require('fs').promises;
        const pathLib = require('path');
        
        try {
            // Analyze package.json for framework and language info
            const packageJsonPath = pathLib.join(path, 'package.json');
            let framework = 'unknown';
            let language = 'javascript';
            
            try {
                const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
                if (packageJson.dependencies?.react || packageJson.devDependencies?.react) framework = 'react';
                else if (packageJson.dependencies?.vue || packageJson.devDependencies?.vue) framework = 'vue';
                else if (packageJson.dependencies?.angular || packageJson.devDependencies?.angular) framework = 'angular';
                else if (packageJson.dependencies?.express || packageJson.devDependencies?.express) framework = 'express';
                
                if (packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript) language = 'typescript';
            } catch (e) {
                // Continue with defaults
            }
            
            // Count files and calculate size
            const stats = await this.getDirectoryStats(path);
            
            return {
                size: stats.totalFiles,
                language,
                framework,
                complexity: this.calculateComplexity(stats),
                maintainabilityIndex: this.calculateMaintainability(stats)
            };
        } catch (error) {
            throw new Error(`Failed to analyze codebase: ${error.message}`);
        }
    }
    
    private async detectPatterns(path: string): Promise<PatternLibrary> {
        const patterns: DetectedPattern[] = [];
        const fs = require('fs').promises;
        const pathLib = require('path');
        
        try {
            // Detect common architectural patterns
            const files = await this.getAllFiles(path, ['.js', '.ts', '.jsx', '.tsx']);
            
            for (const file of files) {
                const content = await fs.readFile(file, 'utf8');
                
                // Detect MVC pattern
                if (file.includes('/controllers/') || content.includes('controller')) {
                    patterns.push({
                        name: 'MVC Controller',
                        file,
                        confidence: 0.8,
                        type: 'architectural'
                    });
                }
                
                // Detect component patterns
                if (content.includes('export default function') || content.includes('const Component')) {
                    patterns.push({
                        name: 'React Component',
                        file,
                        confidence: 0.9,
                        type: 'component'
                    });
                }
                
                // Detect service patterns
                if (file.includes('/services/') || content.includes('class') && content.includes('Service')) {
                    patterns.push({
                        name: 'Service Pattern',
                        file,
                        confidence: 0.7,
                        type: 'service'
                    });
                }
            }
            
            return { patterns, categories: this.categorizePatterns(patterns) };
        } catch (error) {
            throw new Error(`Failed to detect patterns: ${error.message}`);
        }
    }
    
    private async mapDependencies(path: string): Promise<DependencyMap> {
        const fs = require('fs').promises;
        const pathLib = require('path');
        
        try {
            const packageJsonPath = pathLib.join(path, 'package.json');
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
            
            const direct: Dependency[] = [];
            const outdated: OutdatedDependency[] = [];
            const security: SecurityVulnerability[] = [];
            
            // Process production dependencies
            for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
                direct.push({
                    name,
                    version: version as string,
                    type: 'production',
                    size: 0 // Would need npm ls or similar to get actual size
                });
            }
            
            // Process development dependencies
            for (const [name, version] of Object.entries(packageJson.devDependencies || {})) {
                direct.push({
                    name,
                    version: version as string,
                    type: 'development',
                    size: 0
                });
            }
            
            // Check for known vulnerable packages (simplified)
            const knownVulnerabilities = ['lodash', 'moment', 'request'];
            for (const dep of direct) {
                if (knownVulnerabilities.includes(dep.name)) {
                    security.push({
                        dependency: dep.name,
                        severity: 'medium',
                        description: `${dep.name} has known vulnerabilities`,
                        fix: 'Update to latest version'
                    });
                }
            }
            
            return {
                direct,
                transitive: [], // Would need deeper analysis
                outdated,
                security
            };
        } catch (error) {
            throw new Error(`Failed to map dependencies: ${error.message}`);
        }
    }
    
    private async analyzeArchitecture(path: string): Promise<ArchitectureProfile> {
        const fs = require('fs').promises;
        const pathLib = require('path');
        
        const patterns: string[] = [];
        const antiPatterns: string[] = [];
        const layers: string[] = [];
        
        try {
            // Detect architectural patterns from directory structure
            const entries = await fs.readdir(path, { withFileTypes: true });
            const dirNames = entries.filter(e => e.isDirectory()).map(e => e.name);
            
            // Detect MVC pattern
            if (dirNames.includes('models') && dirNames.includes('views') && dirNames.includes('controllers')) {
                patterns.push('MVC');
                layers.push('Model', 'View', 'Controller');
            }
            
            // Detect layered architecture
            if (dirNames.includes('services') && dirNames.includes('repositories')) {
                patterns.push('Layered Architecture');
                layers.push('Service Layer', 'Repository Layer');
            }
            
            // Detect component-based architecture
            if (dirNames.includes('components')) {
                patterns.push('Component-Based');
                layers.push('Component Layer');
            }
            
            // Check for anti-patterns
            if (dirNames.includes('utils') && dirNames.includes('helpers') && dirNames.includes('common')) {
                antiPatterns.push('God Object - Too many utility directories');
            }
            
            return {
                style: patterns.length > 0 ? patterns[0] : 'Unstructured',
                layers,
                patterns,
                antiPatterns
            };
        } catch (error) {
            throw new Error(`Failed to analyze architecture: ${error.message}`);
        }
    }
    
    private async analyzeTechnicalDebt(path: string): Promise<TechnicalDebtAnalysis> {
        const issues: TechnicalDebtIssue[] = [];
        const categories: TechnicalDebtCategory[] = [];
        
        try {
            const files = await this.getAllFiles(path, ['.js', '.ts', '.jsx', '.tsx']);
            const fs = require('fs').promises;
            
            for (const file of files) {
                const content = await fs.readFile(file, 'utf8');
                const lines = content.split('\n');
                
                // Check for code smells
                if (lines.length > 500) {
                    issues.push({
                        type: 'Large File',
                        severity: 6,
                        description: `File ${file} has ${lines.length} lines`,
                        location: file,
                        estimatedEffort: Math.ceil(lines.length / 100)
                    });
                }
                
                // Check for TODO/FIXME comments
                lines.forEach((line, index) => {
                    if (line.includes('TODO') || line.includes('FIXME') || line.includes('HACK')) {
                        issues.push({
                            type: 'Technical Debt Comment',
                            severity: 3,
                            description: `Technical debt comment at line ${index + 1}`,
                            location: `${file}:${index + 1}`,
                            estimatedEffort: 1
                        });
                    }
                });
                
                // Check for console.log statements (code smell in production)
                if (content.includes('console.log')) {
                    issues.push({
                        type: 'Debug Code',
                        severity: 2,
                        description: 'Console.log statements found',
                        location: file,
                        estimatedEffort: 0.5
                    });
                }
            }
            
            // Categorize issues
            const typeGroups = new Map<string, TechnicalDebtIssue[]>();
            for (const issue of issues) {
                if (!typeGroups.has(issue.type)) {
                    typeGroups.set(issue.type, []);
                }
                typeGroups.get(issue.type)!.push(issue);
            }
            
            for (const [type, typeIssues] of typeGroups) {
                categories.push({
                    name: type,
                    count: typeIssues.length,
                    totalEffort: typeIssues.reduce((sum, issue) => sum + issue.estimatedEffort, 0),
                    priority: typeIssues.reduce((sum, issue) => sum + issue.severity, 0) / typeIssues.length
                });
            }
            
            const totalScore = issues.reduce((sum, issue) => sum + issue.severity, 0);
            
            return {
                score: Math.max(0, 100 - totalScore), // Lower score = more debt
                issues,
                categories
            };
        } catch (error) {
            throw new Error(`Failed to analyze technical debt: ${error.message}`);
        }
    }
    
    // Additional helper method implementations would go here...
    private async identifyCriticalPaths(discovery: DiscoveryContext): Promise<CriticalPath[]> {
        const criticalPaths: CriticalPath[] = [];
        
        // Identify core business logic paths
        const corePatterns = discovery.patterns.patterns.filter(p => 
            p.type === 'service' || p.type === 'component'
        );
        
        for (const pattern of corePatterns) {
            criticalPaths.push({
                name: pattern.name,
                importance: pattern.confidence,
                risk: 1 - pattern.confidence, // Higher confidence = lower risk
                dependencies: [] // Would analyze actual dependencies
            });
        }
        
        // Add API endpoints as critical paths
        criticalPaths.push({
            name: 'API Routes',
            importance: 0.9,
            risk: 0.3,
            dependencies: ['database', 'authentication']
        });
        
        return criticalPaths;
    }
    
    private async mapBusinessLogic(discovery: DiscoveryContext): Promise<BusinessLogicMap> {
        return {} as BusinessLogicMap;
    }
    
    private async extractAPIContracts(discovery: DiscoveryContext): Promise<APIContract[]> {
        return [];
    }
    
    private async analyzeDataStructures(discovery: DiscoveryContext): Promise<DataStructure[]> {
        return [];
    }
    
    private async identifyPerformanceCritical(discovery: DiscoveryContext): Promise<PerformanceCriticalPath[]> {
        return [];
    }
    
    private async identifyOpportunities(
        discovery: DiscoveryContext, 
        preservation: PreservationContext
    ): Promise<ImprovementOpportunity[]> {
        const opportunities: ImprovementOpportunity[] = [];
        
        // Analyze technical debt for improvement opportunities
        for (const issue of discovery.technicalDebt.issues) {
            opportunities.push({
                area: issue.type,
                description: issue.description,
                impact: issue.severity,
                effort: issue.estimatedEffort,
                priority: issue.severity / issue.estimatedEffort // High impact, low effort = high priority
            });
        }
        
        // Check for modernization opportunities
        if (discovery.codebase.language === 'javascript') {
            opportunities.push({
                area: 'Language Modernization',
                description: 'Migrate to TypeScript for better type safety',
                impact: 8,
                effort: 6,
                priority: 8/6
            });
        }
        
        // Security opportunities
        for (const vuln of discovery.dependencies.security) {
            opportunities.push({
                area: 'Security',
                description: `Fix ${vuln.dependency} vulnerability`,
                impact: this.severityToNumber(vuln.severity),
                effort: 2,
                priority: this.severityToNumber(vuln.severity) / 2
            });
        }
        
        return opportunities.sort((a, b) => b.priority - a.priority);
    }
    
    private async identifyModernizationTargets(discovery: DiscoveryContext): Promise<ModernizationTarget[]> {
        return [];
    }
    
    private async identifyQualityEnhancements(discovery: DiscoveryContext): Promise<QualityEnhancement[]> {
        return [];
    }
    
    private async identifySecurityUpdates(discovery: DiscoveryContext): Promise<SecurityUpdate[]> {
        return [];
    }
    
    private async identifyPerformanceOptimizations(discovery: DiscoveryContext): Promise<PerformanceOptimization[]> {
        return [];
    }
    
    private async planMigration(
        discovery: DiscoveryContext,
        preservation: PreservationContext,
        improvement: ImprovementContext
    ): Promise<MigrationStep[]> {
        const steps: MigrationStep[] = [];
        
        // Phase 1: Safety and preparation
        steps.push({
            phase: 1,
            name: 'Backup and Test Coverage',
            description: 'Create comprehensive backup and ensure 95%+ test coverage',
            dependencies: [],
            duration: 3,
            risk: 'low'
        });
        
        // Phase 2: Security fixes (high priority, low risk)
        const securityOps = improvement.opportunities.filter(op => op.area === 'Security');
        if (securityOps.length > 0) {
            steps.push({
                phase: 2,
                name: 'Security Updates',
                description: 'Apply security patches and dependency updates',
                dependencies: ['Backup and Test Coverage'],
                duration: 2,
                risk: 'low'
            });
        }
        
        // Phase 3: Code quality improvements
        steps.push({
            phase: 3,
            name: 'Code Quality Enhancement',
            description: 'Implement linting, formatting, and quality gates',
            dependencies: ['Security Updates'],
            duration: 5,
            risk: 'medium'
        });
        
        // Phase 4: Modernization
        if (improvement.opportunities.find(op => op.area === 'Language Modernization')) {
            steps.push({
                phase: 4,
                name: 'Language Migration',
                description: 'Migrate to TypeScript with gradual adoption',
                dependencies: ['Code Quality Enhancement'],
                duration: 15,
                risk: 'medium'
            });
        }
        
        return steps;
    }
    
    private async planPhases(improvement: ImprovementContext): Promise<PhaseStrategy> {
        return {} as PhaseStrategy;
    }
    
    private async createRollbackPlan(preservation: PreservationContext): Promise<RollbackPlan> {
        return {} as RollbackPlan;
    }
    
    private async defineValidationGates(preservation: PreservationContext): Promise<ValidationGate[]> {
        return [];
    }
    
    private async planTeamCoordination(improvement: ImprovementContext): Promise<TeamCoordinationPlan> {
        return {} as TeamCoordinationPlan;
    }
    
    // Helper method implementations
    private async getDirectoryStats(path: string): Promise<DirectoryStats> {
        const fs = require('fs').promises;
        const pathLib = require('path');
        
        let totalFiles = 0;
        let totalLines = 0;
        let fileSizes: number[] = [];
        
        const files = await this.getAllFiles(path, ['.js', '.ts', '.jsx', '.tsx', '.css', '.html']);
        
        for (const file of files) {
            try {
                const content = await fs.readFile(file, 'utf8');
                const lines = content.split('\n').length;
                totalFiles++;
                totalLines += lines;
                fileSizes.push(lines);
            } catch (e) {
                // Skip unreadable files
            }
        }
        
        return {
            totalFiles,
            totalLines,
            avgFileSize: totalLines / totalFiles || 0,
            maxFileSize: Math.max(...fileSizes, 0)
        };
    }
    
    private async getAllFiles(dirPath: string, extensions: string[]): Promise<string[]> {
        const fs = require('fs').promises;
        const pathLib = require('path');
        const files: string[] = [];
        
        async function scan(currentPath: string) {
            try {
                const entries = await fs.readdir(currentPath, { withFileTypes: true });
                
                for (const entry of entries) {
                    const fullPath = pathLib.join(currentPath, entry.name);
                    
                    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                        await scan(fullPath);
                    } else if (entry.isFile()) {
                        const ext = pathLib.extname(entry.name);
                        if (extensions.includes(ext)) {
                            files.push(fullPath);
                        }
                    }
                }
            } catch (e) {
                // Skip inaccessible directories
            }
        }
        
        await scan(dirPath);
        return files;
    }
    
    private calculateComplexity(stats: DirectoryStats): number {
        // Simple complexity calculation based on file count and average size
        const fileComplexity = Math.log(stats.totalFiles + 1);
        const sizeComplexity = Math.log(stats.avgFileSize + 1);
        return Math.min(10, fileComplexity + sizeComplexity);
    }
    
    private calculateMaintainability(stats: DirectoryStats): number {
        // Maintainability index (0-100, higher is better)
        const complexity = this.calculateComplexity(stats);
        const sizeScore = Math.max(0, 100 - (stats.avgFileSize / 10));
        const complexityScore = Math.max(0, 100 - (complexity * 10));
        return Math.round((sizeScore + complexityScore) / 2);
    }
    
    private categorizePatterns(patterns: DetectedPattern[]): PatternCategory[] {
        const categories = new Map<string, DetectedPattern[]>();
        
        for (const pattern of patterns) {
            if (!categories.has(pattern.type)) {
                categories.set(pattern.type, []);
            }
            categories.get(pattern.type)!.push(pattern);
        }
        
        return Array.from(categories.entries()).map(([name, patternList]) => ({
            name,
            count: patternList.length,
            patterns: patternList
        }));
    }
    
    private severityToNumber(severity: string): number {
        switch (severity.toLowerCase()) {
            case 'critical': return 10;
            case 'high': return 8;
            case 'medium': return 5;
            case 'low': return 2;
            default: return 1;
        }
    }
}

// Supporting interface definitions
export interface CodebaseProfile {
    size: number;
    language: string;
    framework?: string;
    complexity: number;
    maintainabilityIndex: number;
}

export interface DependencyMap {
    direct: Dependency[];
    transitive: Dependency[];
    outdated: OutdatedDependency[];
    security: SecurityVulnerability[];
}

export interface Dependency {
    name: string;
    version: string;
    type: 'production' | 'development';
    size: number;
}

export interface OutdatedDependency extends Dependency {
    latestVersion: string;
    breakingChanges: boolean;
}

export interface SecurityVulnerability {
    dependency: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    fix: string;
}

export interface ArchitectureProfile {
    style: string;
    layers: string[];
    patterns: string[];
    antiPatterns: string[];
}

export interface TechnicalDebtAnalysis {
    score: number;
    issues: TechnicalDebtIssue[];
    categories: TechnicalDebtCategory[];
}

export interface TechnicalDebtIssue {
    type: string;
    severity: number;
    description: string;
    location: string;
    estimatedEffort: number;
}

export interface TechnicalDebtCategory {
    name: string;
    count: number;
    totalEffort: number;
    priority: number;
}

// Additional interfaces for other contexts would be defined here...
export interface CriticalPath {
    name: string;
    importance: number;
    risk: number;
    dependencies: string[];
}

export interface BusinessLogicMap {
    core: string[];
    supporting: string[];
    utilities: string[];
}

export interface APIContract {
    endpoint: string;
    method: string;
    version: string;
    consumers: string[];
}

export interface DataStructure {
    name: string;
    type: string;
    schema: any;
    migrations: string[];
}

export interface PerformanceCriticalPath {
    path: string;
    metrics: PerformanceMetrics;
    constraints: string[];
}

export interface PerformanceMetrics {
    latency: number;
    throughput: number;
    memoryUsage: number;
}

export interface ImprovementOpportunity {
    area: string;
    description: string;
    impact: number;
    effort: number;
    priority: number;
}

export interface ModernizationTarget {
    component: string;
    currentState: string;
    targetState: string;
    strategy: string;
}

export interface QualityEnhancement {
    type: string;
    description: string;
    tools: string[];
    benefits: string[];
}

export interface SecurityUpdate {
    vulnerability: string;
    severity: string;
    fix: string;
    testing: string[];
}

export interface PerformanceOptimization {
    target: string;
    technique: string;
    expectedGain: number;
    risk: string;
}

export interface MigrationStep {
    phase: number;
    name: string;
    description: string;
    dependencies: string[];
    duration: number;
    risk: string;
}

export interface PhaseStrategy {
    phases: Phase[];
    parallelism: boolean;
    rollbackPoints: string[];
}

export interface Phase {
    number: number;
    name: string;
    goals: string[];
    deliverables: string[];
    duration: number;
}

export interface RollbackPlan {
    triggers: string[];
    steps: RollbackStep[];
    timeToRevert: number;
}

export interface RollbackStep {
    action: string;
    command: string;
    verification: string;
}

export interface ValidationGate {
    phase: string;
    criteria: string[];
    automated: boolean;
    blocking: boolean;
}

export interface TeamCoordinationPlan {
    roles: TeamRole[];
    communication: CommunicationPlan;
    training: TrainingPlan[];
}

export interface TeamRole {
    name: string;
    responsibilities: string[];
    skills: string[];
}

export interface CommunicationPlan {
    frequency: string;
    channels: string[];
    stakeholders: string[];
}

export interface TrainingPlan {
    topic: string;
    audience: string[];
    duration: number;
    materials: string[];
}

// Helper method implementations for RetrofitContextBuilder
declare module './context-layers' {
    namespace RetrofitContextBuilder {
        interface RetrofitContextBuilder {
            getDirectoryStats(path: string): Promise<DirectoryStats>;
            getAllFiles(path: string, extensions: string[]): Promise<string[]>;
            calculateComplexity(stats: DirectoryStats): number;
            calculateMaintainability(stats: DirectoryStats): number;
            categorizePatterns(patterns: DetectedPattern[]): PatternCategory[];
            severityToNumber(severity: string): number;
        }
    }
}

interface DirectoryStats {
    totalFiles: number;
    totalLines: number;
    avgFileSize: number;
    maxFileSize: number;
}