import { EventEmitter } from 'events';
import { Task } from '../common/types.js';
export declare class TaskQueue extends EventEmitter {
    private tasks;
    private priorityQueue;
    constructor();
    addTask(task: Task): void;
    addTasks(tasks: Task[]): void;
    getTask(taskId: string): Task | undefined;
    getAllTasks(): Task[];
    getPendingTasks(): Task[];
    getInProgressTasks(): Task[];
    getCompletedTasks(): Task[];
    getFailedTasks(): Task[];
    getTasksByDomain(domain: string): Task[];
    getTasksByPriority(priority: string): Task[];
    getTasksByStatus(status: string): Task[];
    getTasksByAssignee(assigneeId: string): Task[];
    getNextTask(): Task | undefined;
    getNextTaskForDomain(domain: string): Task | undefined;
    updateTask(task: Task): void;
    removeTask(taskId: string): boolean;
    claimTask(taskId: string, agentId: string): Task | undefined;
    startTask(taskId: string): Task | undefined;
    completeTask(taskId: string, results?: any): Task | undefined;
    failTask(taskId: string, error: string): Task | undefined;
    resetTask(taskId: string): Task | undefined;
    private sortPriorityQueue;
    private updatePriorityQueue;
    private sortTasksByPriority;
    getQueueStats(): any;
    healthCheck(): Promise<{
        healthy: boolean;
        details: any;
    }>;
    clear(): void;
    export(): any;
    import(data: any): void;
}
