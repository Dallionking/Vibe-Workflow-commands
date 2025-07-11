import { v4 as uuidv4 } from 'uuid';
import { Task, Agent, AgentCapabilities } from './types.js';

export function generateId(): string {
  return uuidv4();
}

export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateAgentId(role: string): string {
  return `agent_${role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateBranchName(agentId: string): string {
  return `agent-${agentId}-${Date.now()}`;
}

export function calculateTaskComplexity(task: Task): number {
  let complexity = 1;
  
  // Base complexity on description length
  complexity += Math.floor(task.description.length / 100);
  
  // Add complexity for dependencies
  complexity += task.dependencies.length * 0.5;
  
  // Add complexity for file count
  complexity += task.files.length * 0.3;
  
  // Priority affects complexity
  const priorityMultiplier = {
    'low': 1,
    'medium': 1.2,
    'high': 1.5,
    'urgent': 2
  };
  
  complexity *= priorityMultiplier[task.priority];
  
  return Math.min(complexity, 10); // Cap at 10
}

export function matchAgentToTask(agents: Agent[], task: Task): Agent | null {
  // Filter agents that can handle the task domain
  const suitableAgents = agents.filter(agent => {
    if (agent.status !== 'idle') return false;
    if (agent.currentTasks.length >= agent.role.maxConcurrentTasks) return false;
    
    return agent.role.capabilities.some(capability => 
      task.domain.includes(capability) || 
      task.description.toLowerCase().includes(capability.toLowerCase())
    );
  });
  
  if (suitableAgents.length === 0) return null;
  
  // Sort by expertise and availability
  return suitableAgents.sort((a, b) => {
    // Prefer agents with fewer current tasks
    const taskDiff = a.currentTasks.length - b.currentTasks.length;
    if (taskDiff !== 0) return taskDiff;
    
    // Prefer agents with higher success rate
    const successDiff = b.successRate - a.successRate;
    if (successDiff !== 0) return successDiff;
    
    // Prefer agents with more relevant capabilities
    const aRelevance = a.role.capabilities.filter(cap => 
      task.domain.includes(cap) || task.description.toLowerCase().includes(cap.toLowerCase())
    ).length;
    const bRelevance = b.role.capabilities.filter(cap => 
      task.domain.includes(cap) || task.description.toLowerCase().includes(cap.toLowerCase())
    ).length;
    
    return bRelevance - aRelevance;
  })[0];
}

export function groupTasksByDomain(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    if (!groups[task.domain]) {
      groups[task.domain] = [];
    }
    groups[task.domain].push(task);
  });
  
  return groups;
}

export function calculateEstimatedDuration(tasks: Task[]): number {
  return tasks.reduce((total, task) => {
    const complexity = calculateTaskComplexity(task);
    const baseDuration = 30; // 30 minutes base
    return total + (baseDuration * complexity);
  }, 0);
}

export function validateTaskDependencies(tasks: Task[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const taskIds = new Set(tasks.map(t => t.id));
  
  // Check for circular dependencies
  const visited = new Set<string>();
  const visiting = new Set<string>();
  
  function hasCycle(taskId: string): boolean {
    if (visiting.has(taskId)) return true;
    if (visited.has(taskId)) return false;
    
    visiting.add(taskId);
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      for (const depId of task.dependencies) {
        if (hasCycle(depId)) return true;
      }
    }
    
    visiting.delete(taskId);
    visited.add(taskId);
    return false;
  }
  
  // Check each task for issues
  tasks.forEach(task => {
    // Check for invalid dependencies
    task.dependencies.forEach(depId => {
      if (!taskIds.has(depId)) {
        errors.push(`Task ${task.id} depends on non-existent task ${depId}`);
      }
    });
    
    // Check for circular dependencies
    if (hasCycle(task.id)) {
      errors.push(`Circular dependency detected involving task ${task.id}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

export function sortTasksByDependencies(tasks: Task[]): Task[] {
  const sorted: Task[] = [];
  const visited = new Set<string>();
  const taskMap = new Map(tasks.map(t => [t.id, t]));
  
  function visit(taskId: string) {
    if (visited.has(taskId)) return;
    
    const task = taskMap.get(taskId);
    if (!task) return;
    
    // Visit all dependencies first
    task.dependencies.forEach(depId => visit(depId));
    
    visited.add(taskId);
    sorted.push(task);
  }
  
  // Visit all tasks
  tasks.forEach(task => visit(task.id));
  
  return sorted;
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

export function isValidGitBranch(name: string): boolean {
  // Git branch name validation
  const invalid = [
    /^[\s\-]/,           // Cannot start with space or dash
    /[\s\-]$/,           // Cannot end with space or dash
    /\.\./,              // Cannot contain double dots
    /[@{~^:?*\[\]\\]/,   // Cannot contain special characters
    /^@$/,               // Cannot be just @
    /\.lock$/,           // Cannot end with .lock
    /\//                 // Cannot contain slashes (for simplicity)
  ];
  
  return !invalid.some(pattern => pattern.test(name)) && name.length > 0 && name.length <= 100;
}

export function sanitizeBranchName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  return fn().catch(error => {
    if (attempts <= 1) throw error;
    
    return new Promise(resolve => {
      setTimeout(() => resolve(retry(fn, attempts - 1, delay)), delay);
    });
  });
}

export function createTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(message)), ms)
    )
  ]);
}