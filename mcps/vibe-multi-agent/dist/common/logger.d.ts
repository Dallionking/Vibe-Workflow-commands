import winston from 'winston';
export declare const logger: winston.Logger;
export declare function createServiceLogger(service: string): winston.Logger;
export declare const log: {
    info: (message: string, meta?: any) => winston.Logger;
    warn: (message: string, meta?: any) => winston.Logger;
    error: (message: string, meta?: any) => winston.Logger;
    debug: (message: string, meta?: any) => winston.Logger;
    agent: {
        spawned: (agentId: string, role: string, branch: string) => winston.Logger;
        taskClaimed: (agentId: string, taskId: string) => winston.Logger;
        taskCompleted: (agentId: string, taskId: string, duration: number) => winston.Logger;
        error: (agentId: string, error: Error, context?: any) => winston.Logger;
    };
    system: {
        ready: (port: number) => winston.Logger;
        shutdown: () => winston.Logger;
        error: (error: Error, context?: any) => winston.Logger;
    };
    git: {
        worktreeCreated: (path: string, branch: string, agentId: string) => winston.Logger;
        mergeStarted: (sourceBranch: string, targetBranch: string) => winston.Logger;
        mergeCompleted: (sourceBranch: string, targetBranch: string, mergeCommit: string) => winston.Logger;
        conflict: (file: string, type: string, details: string) => winston.Logger;
    };
};
export default logger;
