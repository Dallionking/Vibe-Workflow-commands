/**
 * L3: Task Context Layer Implementation
 * Task-specific context for individual operations and commands
 */

import {
  TaskContextLayer,
  TaskContextData,
  TaskType,
  TaskParameter,
  ExpectedOutput,
  ValidationRule,
  ContextPriority,
  ContextMetadata
} from '../types/context.types';

/**
 * Task Context Manager
 * Manages L3 context specific to individual tasks and commands
 */
export class TaskContextManager {
  private taskContext: TaskContextLayer | null = null;
  private taskStack: TaskContextLayer[] = [];
  private taskHistory: Map<string, TaskContextLayer> = new Map();

  /**
   * Initialize task context for a specific task
   */
  public async initializeTask(
    taskId: string,
    taskType: TaskType,
    objective: string,
    instructions: string[],
    parameters: TaskParameter[] = [],
    expectedOutputs: ExpectedOutput[] = [],
    parentTask?: string
  ): Promise<TaskContextLayer> {
    const contextId = `task-${taskId}-${Date.now()}`;
    const timestamp = Date.now();

    const taskData: TaskContextData = {
      objective,
      instructions,
      parameters,
      expectedOutputs,
      validationRules: this.generateValidationRules(taskType, expectedOutputs)
    };

    const metadata: ContextMetadata = {
      source: { type: 'task', taskId, taskType },
      priority: this.getTaskPriority(taskType),
      tags: ['task', taskType, taskId],
      dependencies: parentTask ? [parentTask] : [],
      created: timestamp,
      lastModified: timestamp
    };

    // If we have an existing task, push it to stack
    if (this.taskContext) {
      this.taskStack.push(this.taskContext);
    }

    this.taskContext = {
      id: contextId,
      timestamp,
      version: '1.0.0',
      layer: 'task',
      taskId,
      taskType,
      parentTask,
      subtasks: [],
      data: taskData,
      metadata
    };

    // Store in history
    this.taskHistory.set(taskId, { ...this.taskContext });

    return this.taskContext;
  }

  /**
   * Get current task context
   */
  public getCurrentTask(): TaskContextLayer | null {
    return this.taskContext;
  }

  /**
   * Get task context by ID
   */
  public getTask(taskId: string): TaskContextLayer | null {
    return this.taskHistory.get(taskId) || null;
  }

  /**
   * Add subtask to current task
   */
  public addSubtask(subtaskId: string): void {
    if (!this.taskContext) {
      throw new Error('No active task context');
    }

    if (!this.taskContext.subtasks.includes(subtaskId)) {
      this.taskContext.subtasks.push(subtaskId);
      this.taskContext.metadata.lastModified = Date.now();
    }
  }

  /**
   * Update task parameters
   */
  public updateParameters(parameters: TaskParameter[]): void {
    if (!this.taskContext) {
      throw new Error('No active task context');
    }

    // Merge with existing parameters
    const paramMap = new Map(this.taskContext.data.parameters.map(p => [p.name, p]));
    
    parameters.forEach(param => {
      paramMap.set(param.name, param);
    });

    this.taskContext.data.parameters = Array.from(paramMap.values());
    this.taskContext.metadata.lastModified = Date.now();
  }

  /**
   * Add expected output
   */
  public addExpectedOutput(output: ExpectedOutput): void {
    if (!this.taskContext) {
      throw new Error('No active task context');
    }

    this.taskContext.data.expectedOutputs.push(output);
    
    // Update validation rules based on new output
    const newRules = this.generateValidationRulesForOutput(output);
    this.taskContext.data.validationRules.push(...newRules);
    
    this.taskContext.metadata.lastModified = Date.now();
  }

  /**
   * Validate task completion
   */
  public validateTask(): ValidationResult {
    if (!this.taskContext) {
      throw new Error('No active task context');
    }

    const results: ValidationResult = {
      taskId: this.taskContext.taskId,
      passed: true,
      errors: [],
      warnings: [],
      validatedRules: []
    };

    for (const rule of this.taskContext.data.validationRules) {
      const ruleResult = this.executeValidationRule(rule);
      results.validatedRules.push(ruleResult);

      if (!ruleResult.passed) {
        results.passed = false;
        if (rule.severity === 'error') {
          results.errors.push({
            ruleId: rule.id,
            description: rule.description,
            message: `Validation failed: ${rule.rule}`
          });
        } else if (rule.severity === 'warning') {
          results.warnings.push({
            ruleId: rule.id,
            description: rule.description,
            message: `Validation warning: ${rule.rule}`
          });
        }
      }
    }

    return results;
  }

  /**
   * Complete current task and return to parent
   */
  public completeTask(outputs?: Record<string, unknown>): TaskContextLayer | null {
    if (!this.taskContext) {
      throw new Error('No active task context');
    }

    const completedTask = { ...this.taskContext };
    
    // Add completion metadata
    completedTask.metadata.lastModified = Date.now();
    if (outputs) {
      completedTask.data.parameters.push({
        name: 'completion-outputs',
        type: 'object',
        value: outputs,
        required: false,
        description: 'Task completion outputs'
      });
    }

    // Update history
    this.taskHistory.set(completedTask.taskId, completedTask);

    // Return to parent task or clear
    if (this.taskStack.length > 0) {
      this.taskContext = this.taskStack.pop()!;
      return this.taskContext;
    } else {
      this.taskContext = null;
      return null;
    }
  }

  /**
   * Get task summary for context assembly
   */
  public getTaskSummary(): string {
    if (!this.taskContext) {
      return 'No active task';
    }

    const { taskId, taskType, data } = this.taskContext;
    const { objective, instructions, parameters } = data;

    const paramSummary = parameters
      .filter(p => p.required)
      .map(p => `${p.name}: ${p.value}`)
      .join(', ');

    return `Task: ${taskId} (${taskType})
Objective: ${objective}
Instructions: ${instructions.slice(0, 2).join('; ')}${instructions.length > 2 ? '...' : ''}
Key Parameters: ${paramSummary || 'None'}
Subtasks: ${this.taskContext.subtasks.length}`;
  }

  /**
   * Get task chain (current task + parents)
   */
  public getTaskChain(): TaskContextLayer[] {
    const chain: TaskContextLayer[] = [];
    
    if (this.taskContext) {
      chain.push(this.taskContext);
      
      // Add parent tasks from stack
      chain.push(...this.taskStack.reverse());
    }

    return chain;
  }

  /**
   * Get task context for specific command
   */
  public getContextForCommand(commandName: string): TaskCommandContext {
    if (!this.taskContext) {
      return {
        commandName,
        taskId: 'no-active-task',
        taskType: 'implementation' as TaskType,
        relevantParameters: [],
        expectedOutputs: [],
        validationRules: []
      };
    }

    const relevantParameters = this.taskContext.data.parameters.filter(
      p => this.isParameterRelevantToCommand(p, commandName)
    );

    return {
      commandName,
      taskId: this.taskContext.taskId,
      taskType: this.taskContext.taskType,
      relevantParameters,
      expectedOutputs: this.taskContext.data.expectedOutputs,
      validationRules: this.taskContext.data.validationRules
    };
  }

  /**
   * Export task context for serialization
   */
  public exportTaskContext(): TaskContextLayer | null {
    return this.taskContext ? { ...this.taskContext } : null;
  }

  /**
   * Import task context from serialized data
   */
  public importTaskContext(context: TaskContextLayer): void {
    this.taskContext = context;
    this.taskHistory.set(context.taskId, { ...context });
  }

  // Private helper methods

  private getTaskPriority(taskType: TaskType): ContextPriority {
    switch (taskType) {
      case 'validation':
        return ContextPriority.CRITICAL;
      case 'implementation':
        return ContextPriority.HIGH;
      case 'testing':
        return ContextPriority.HIGH;
      case 'research':
        return ContextPriority.MEDIUM;
      case 'documentation':
        return ContextPriority.MEDIUM;
      case 'integration':
        return ContextPriority.MEDIUM;
      case 'optimization':
        return ContextPriority.LOW;
      default:
        return ContextPriority.MEDIUM;
    }
  }

  private generateValidationRules(
    taskType: TaskType,
    expectedOutputs: ExpectedOutput[]
  ): ValidationRule[] {
    const rules: ValidationRule[] = [];

    // Add type-specific validation rules
    switch (taskType) {
      case 'implementation':
        rules.push({
          id: 'code-quality',
          description: 'Code must meet quality standards',
          rule: 'No syntax errors, proper formatting, 95%+ coverage',
          severity: 'error'
        });
        break;
      case 'testing':
        rules.push({
          id: 'test-coverage',
          description: 'Tests must achieve 95%+ coverage',
          rule: 'Coverage >= 95% for lines, branches, and functions',
          severity: 'error'
        });
        break;
      case 'documentation':
        rules.push({
          id: 'documentation-completeness',
          description: 'Documentation must be comprehensive',
          rule: 'All public APIs documented with examples',
          severity: 'warning'
        });
        break;
    }

    // Add output-specific validation rules
    expectedOutputs.forEach(output => {
      rules.push(...this.generateValidationRulesForOutput(output));
    });

    return rules;
  }

  private generateValidationRulesForOutput(output: ExpectedOutput): ValidationRule[] {
    return output.validationRules.map(rule => ({
      id: `output-${output.type}-${Date.now()}`,
      description: `Validation for ${output.type} output`,
      rule,
      severity: 'error' as const
    }));
  }

  private executeValidationRule(rule: ValidationRule): ValidationRuleResult {
    // This would contain actual validation logic
    // For now, return a placeholder implementation
    return {
      ruleId: rule.id,
      passed: true,
      message: `Rule ${rule.id} passed`,
      details: {}
    };
  }

  private isParameterRelevantToCommand(parameter: TaskParameter, commandName: string): boolean {
    // Command-specific parameter filtering logic
    const commandParameterMap: Record<string, string[]> = {
      'Read': ['file_path', 'encoding', 'limit'],
      'Write': ['file_path', 'content', 'encoding'],
      'Bash': ['command', 'timeout', 'directory'],
      'Edit': ['file_path', 'old_string', 'new_string'],
      'TodoWrite': ['todos', 'priority', 'status']
    };

    const relevantParams = commandParameterMap[commandName] || [];
    return relevantParams.some(param => 
      parameter.name.toLowerCase().includes(param.toLowerCase())
    );
  }
}

// Supporting interfaces

interface ValidationResult {
  taskId: string;
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  validatedRules: ValidationRuleResult[];
}

interface ValidationError {
  ruleId: string;
  description: string;
  message: string;
}

interface ValidationWarning {
  ruleId: string;
  description: string;
  message: string;
}

interface ValidationRuleResult {
  ruleId: string;
  passed: boolean;
  message: string;
  details: Record<string, unknown>;
}

interface TaskCommandContext {
  commandName: string;
  taskId: string;
  taskType: TaskType;
  relevantParameters: TaskParameter[];
  expectedOutputs: ExpectedOutput[];
  validationRules: ValidationRule[];
}

/**
 * Singleton instance for task context management
 */
export const taskContextManager = new TaskContextManager();