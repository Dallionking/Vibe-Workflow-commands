export interface TaskGenerationOptions {
    granularity: 'high' | 'medium' | 'low';
    includeTestingTasks: boolean;
    includeDocumentationTasks: boolean;
}
export declare class TaskGenerator {
    constructor();
    generateTasks(architecture: any, options: TaskGenerationOptions): Promise<any[]>;
    private generateFoundationTasks;
    private generateComponentTasks;
    private generateAuthTasks;
    private generateUserTasks;
    private generateApiTasks;
    private generateFrontendTasks;
    private generateDatabaseTasks;
    private generateBillingTasks;
    private generateAnalyticsTasks;
    private generateGenericComponentTasks;
    private generateTestingTasks;
    private generateDocumentationTasks;
    private generateDeploymentTasks;
    private addTaskDependencies;
    private setPriorities;
}
