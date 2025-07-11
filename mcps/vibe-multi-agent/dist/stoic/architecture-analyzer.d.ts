export interface ArchitectureAnalysis {
    score: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    risks: Array<{
        type: string;
        description: string;
        severity: 'low' | 'medium' | 'high';
        mitigation: string;
    }>;
    complexity: {
        overall: number;
        frontend: number;
        backend: number;
        database: number;
        deployment: number;
    };
    scalability: {
        horizontal: boolean;
        vertical: boolean;
        bottlenecks: string[];
        recommendations: string[];
    };
    security: {
        score: number;
        vulnerabilities: string[];
        recommendations: string[];
    };
    performance: {
        score: number;
        bottlenecks: string[];
        optimizations: string[];
    };
}
export declare class ArchitectureAnalyzer {
    constructor();
    analyzeArchitecture(architecture: any, focusAreas?: string[]): Promise<ArchitectureAnalysis>;
    private analyzeComplexity;
    private calculateFrontendComplexity;
    private calculateBackendComplexity;
    private calculateDatabaseComplexity;
    private calculateDeploymentComplexity;
    private analyzeScalability;
    private analyzeSecurity;
    private analyzePerformance;
    private calculateOverallScore;
    private identifyStrengths;
    private identifyWeaknesses;
    private generateRecommendations;
    private identifyRisks;
}
