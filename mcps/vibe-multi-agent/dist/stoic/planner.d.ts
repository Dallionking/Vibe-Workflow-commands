export interface ProjectRequirements {
    description: string;
    constraints: string[];
    preferences: Record<string, any>;
}
export interface StrategicPlan {
    id: string;
    project: {
        name: string;
        type: string;
        description: string;
    };
    architecture: any;
    phases: Phase[];
    recommendations: string[];
    risks: Risk[];
    timeline: Timeline;
    resources: Resource[];
}
export interface Phase {
    id: string;
    name: string;
    description: string;
    order: number;
    duration: number;
    dependencies: string[];
    deliverables: string[];
    milestones: string[];
}
export interface Risk {
    id: string;
    category: string;
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string[];
}
export interface Timeline {
    startDate: string;
    estimatedDuration: number;
    milestones: Array<{
        name: string;
        date: string;
        description: string;
    }>;
}
export interface Resource {
    type: string;
    name: string;
    description: string;
    quantity: number;
    critical: boolean;
}
export declare class StoicPlanner {
    constructor();
    generateStrategicPlan(requirements: ProjectRequirements): Promise<StrategicPlan>;
    private inferProjectType;
    private extractProjectName;
    private designArchitecture;
    private getBaseArchitecture;
    private generateComponents;
    private recommendDatabase;
    private recommendDeployment;
    private createTestingStrategy;
    private createSecurityStrategy;
    private createMonitoringStrategy;
    private createScalabilityStrategy;
    private createImplementationPhases;
    private identifyRisks;
    private createTimeline;
    private identifyResources;
    private generateRecommendations;
}
