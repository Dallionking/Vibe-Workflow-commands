import { EventEmitter } from 'events';
import { validateTaskDependencies, sortTasksByDependencies } from '../common/utils.js';
import { log } from '../common/logger.js';
export class TaskQueue extends EventEmitter {
    tasks = new Map();
    priorityQueue = [];
    constructor() {
        super();
    }
    addTask(task) {
        // Validate task
        if (!task.id || !task.title || !task.description || !task.domain) {
            throw new Error('Task missing required fields');
        }
        // Add to tasks map
        this.tasks.set(task.id, task);
        // Add to priority queue and sort
        this.priorityQueue.push(task);
        this.sortPriorityQueue();
        log.info(`Task added to queue: ${task.id} - ${task.title}`);
        this.emit('task_queued', task);
    }
    addTasks(tasks) {
        // Validate dependencies
        const validation = validateTaskDependencies(tasks);
        if (!validation.valid) {
            throw new Error(`Invalid task dependencies: ${validation.errors.join(', ')}`);
        }
        // Sort tasks by dependencies
        const sortedTasks = sortTasksByDependencies(tasks);
        // Add tasks in dependency order
        sortedTasks.forEach(task => this.addTask(task));
        log.info(`Added ${tasks.length} tasks to queue`);
    }
    getTask(taskId) {
        return this.tasks.get(taskId);
    }
    getAllTasks() {
        return Array.from(this.tasks.values());
    }
    getPendingTasks() {
        return this.getAllTasks().filter(task => task.status === 'pending');
    }
    getInProgressTasks() {
        return this.getAllTasks().filter(task => task.status === 'in_progress' || task.status === 'claimed');
    }
    getCompletedTasks() {
        return this.getAllTasks().filter(task => task.status === 'completed');
    }
    getFailedTasks() {
        return this.getAllTasks().filter(task => task.status === 'failed');
    }
    getTasksByDomain(domain) {
        return this.getAllTasks().filter(task => task.domain === domain);
    }
    getTasksByPriority(priority) {
        return this.getAllTasks().filter(task => task.priority === priority);
    }
    getTasksByStatus(status) {
        return this.getAllTasks().filter(task => task.status === status);
    }
    getTasksByAssignee(assigneeId) {
        return this.getAllTasks().filter(task => task.assignedTo === assigneeId);
    }
    getNextTask() {
        // Get pending tasks sorted by priority
        const pendingTasks = this.getPendingTasks();
        if (pendingTasks.length === 0)
            return undefined;
        // Find tasks with no unresolved dependencies
        const availableTasks = pendingTasks.filter(task => {
            if (task.dependencies.length === 0)
                return true;
            return task.dependencies.every(depId => {
                const dependency = this.tasks.get(depId);
                return dependency && dependency.status === 'completed';
            });
        });
        if (availableTasks.length === 0)
            return undefined;
        // Sort by priority and return first
        return this.sortTasksByPriority(availableTasks)[0];
    }
    getNextTaskForDomain(domain) {
        const nextTask = this.getNextTask();
        if (!nextTask)
            return undefined;
        const domainTasks = this.getPendingTasks().filter(task => task.domain === domain &&
            task.dependencies.every(depId => {
                const dependency = this.tasks.get(depId);
                return dependency && dependency.status === 'completed';
            }));
        return this.sortTasksByPriority(domainTasks)[0];
    }
    updateTask(task) {
        const existingTask = this.tasks.get(task.id);
        if (!existingTask) {
            throw new Error(`Task not found: ${task.id}`);
        }
        // Update timestamp
        task.updatedAt = new Date();
        // Update task in map
        this.tasks.set(task.id, task);
        // Update priority queue
        this.updatePriorityQueue();
        log.info(`Task updated: ${task.id} - status: ${task.status}`);
        this.emit('task_updated', task);
        // Emit specific status events
        if (task.status !== existingTask.status) {
            this.emit(`task_${task.status}`, task);
        }
    }
    removeTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task)
            return false;
        // Remove from tasks map
        this.tasks.delete(taskId);
        // Remove from priority queue
        this.priorityQueue = this.priorityQueue.filter(t => t.id !== taskId);
        // Remove this task from other tasks' dependencies
        this.tasks.forEach(otherTask => {
            if (otherTask.dependencies.includes(taskId)) {
                otherTask.dependencies = otherTask.dependencies.filter(id => id !== taskId);
                this.updateTask(otherTask);
            }
        });
        log.info(`Task removed: ${taskId}`);
        this.emit('task_removed', task);
        return true;
    }
    claimTask(taskId, agentId) {
        const task = this.tasks.get(taskId);
        if (!task)
            return undefined;
        if (task.status !== 'pending') {
            throw new Error(`Task ${taskId} is not available for claiming (status: ${task.status})`);
        }
        // Check dependencies
        const unmetDependencies = task.dependencies.filter(depId => {
            const dependency = this.tasks.get(depId);
            return !dependency || dependency.status !== 'completed';
        });
        if (unmetDependencies.length > 0) {
            throw new Error(`Task ${taskId} has unmet dependencies: ${unmetDependencies.join(', ')}`);
        }
        // Claim the task
        task.status = 'claimed';
        task.assignedTo = agentId;
        task.updatedAt = new Date();
        this.updateTask(task);
        log.info(`Task claimed: ${taskId} by agent ${agentId}`);
        this.emit('task_claimed', task, agentId);
        return task;
    }
    startTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task)
            return undefined;
        if (task.status !== 'claimed') {
            throw new Error(`Task ${taskId} is not claimed (status: ${task.status})`);
        }
        task.status = 'in_progress';
        task.updatedAt = new Date();
        this.updateTask(task);
        log.info(`Task started: ${taskId}`);
        this.emit('task_started', task);
        return task;
    }
    completeTask(taskId, results) {
        const task = this.tasks.get(taskId);
        if (!task)
            return undefined;
        if (task.status !== 'in_progress' && task.status !== 'claimed') {
            throw new Error(`Task ${taskId} is not in progress (status: ${task.status})`);
        }
        task.status = 'completed';
        task.completedAt = new Date();
        task.updatedAt = new Date();
        if (results) {
            task.metadata = { ...task.metadata, results };
        }
        this.updateTask(task);
        log.info(`Task completed: ${taskId}`);
        this.emit('task_completed', task);
        return task;
    }
    failTask(taskId, error) {
        const task = this.tasks.get(taskId);
        if (!task)
            return undefined;
        task.status = 'failed';
        task.updatedAt = new Date();
        task.metadata = { ...task.metadata, error };
        this.updateTask(task);
        log.warn(`Task failed: ${taskId} - ${error}`);
        this.emit('task_failed', task);
        return task;
    }
    resetTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task)
            return undefined;
        task.status = 'pending';
        task.assignedTo = undefined;
        task.updatedAt = new Date();
        delete task.completedAt;
        this.updateTask(task);
        log.info(`Task reset: ${taskId}`);
        this.emit('task_reset', task);
        return task;
    }
    sortPriorityQueue() {
        this.priorityQueue = this.sortTasksByPriority(this.priorityQueue);
    }
    updatePriorityQueue() {
        this.priorityQueue = this.getPendingTasks();
        this.sortPriorityQueue();
    }
    sortTasksByPriority(tasks) {
        const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
        return tasks.sort((a, b) => {
            // First sort by priority
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0)
                return priorityDiff;
            // Then by creation time (older first)
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
    }
    // Queue statistics
    getQueueStats() {
        const tasks = this.getAllTasks();
        const stats = {
            total: tasks.length,
            pending: 0,
            claimed: 0,
            in_progress: 0,
            completed: 0,
            failed: 0,
            by_priority: { urgent: 0, high: 0, medium: 0, low: 0 },
            by_domain: new Map(),
            avg_completion_time: 0
        };
        let totalCompletionTime = 0;
        let completedCount = 0;
        tasks.forEach(task => {
            stats[task.status]++;
            stats.by_priority[task.priority]++;
            const domainCount = stats.by_domain.get(task.domain) || 0;
            stats.by_domain.set(task.domain, domainCount + 1);
            if (task.status === 'completed' && task.completedAt) {
                totalCompletionTime += task.completedAt.getTime() - task.createdAt.getTime();
                completedCount++;
            }
        });
        stats.avg_completion_time = completedCount > 0 ? totalCompletionTime / completedCount : 0;
        return {
            ...stats,
            by_domain: Object.fromEntries(stats.by_domain)
        };
    }
    // Health check
    async healthCheck() {
        const stats = this.getQueueStats();
        const stuckTasks = this.getAllTasks().filter(task => {
            if (task.status === 'in_progress' || task.status === 'claimed') {
                const timeSinceUpdate = Date.now() - task.updatedAt.getTime();
                return timeSinceUpdate > 300000; // 5 minutes
            }
            return false;
        });
        return {
            healthy: stuckTasks.length === 0,
            details: {
                ...stats,
                stuckTasks: stuckTasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    status: task.status,
                    assignedTo: task.assignedTo,
                    lastUpdate: task.updatedAt
                }))
            }
        };
    }
    // Clear all tasks
    clear() {
        this.tasks.clear();
        this.priorityQueue = [];
        log.info('Task queue cleared');
        this.emit('queue_cleared');
    }
    // Export tasks for persistence
    export() {
        return {
            tasks: Array.from(this.tasks.values()),
            timestamp: new Date().toISOString()
        };
    }
    // Import tasks from persistence
    import(data) {
        this.clear();
        if (data.tasks && Array.isArray(data.tasks)) {
            data.tasks.forEach((task) => {
                // Restore date objects
                task.createdAt = new Date(task.createdAt);
                task.updatedAt = new Date(task.updatedAt);
                if (task.completedAt) {
                    task.completedAt = new Date(task.completedAt);
                }
                this.tasks.set(task.id, task);
            });
            this.updatePriorityQueue();
            log.info(`Imported ${data.tasks.length} tasks`);
        }
    }
}
//# sourceMappingURL=task-queue.js.map