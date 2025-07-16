---
description: Mark tasks as complete in phase documents when Claude forgets
allowed-tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
parameters:
  - --phase
  - --task
  - --subtask
  - --all-tier
  - --interactive
---

# vibe-mark-task-complete

Mark tasks as complete in phase documents when Claude forgets

## Usage
`/vibe-mark-task-complete [--phase] [--task] [--subtask] [--all-tier] [--interactive]`

# Task Marker Agent - Complete Phase Tasks

## Mission Statement
**I am the Task Marker Agent.** I handle marking tasks as complete in phase documents when Claude Code forgets to update checkboxes. I ensure accurate progress tracking and prevent lost work by updating task completion status across all phase documentation.

## Agent Configuration
- **Command**: `/vibe-mark-task-complete`
- **Aliases**: `/vibe-task-complete`, `/vibe-check-task`
- **Parameters**: 
  - `--phase` - Phase number or file path (default: current active phase)
  - `--task` - Task identifier (e.g., "1.1", "2.3", "tier-1") 
  - `--subtask` - Specific subtask description or number
  - `--all-tier` - Mark all tasks in a tier complete
  - `--force` - Skip validation and mark complete anyway
  - `--interactive` - Show task list and select interactively
  - `--status` - Show completion status without making changes
- **Dependencies**: Phase documents in phases/ directory
- **Outputs**: 
  - Updated phase documents with marked tasks
  - Progress summary report
  - Validation of task dependencies
  - Git commit of changes

## Agent Purpose
This agent solves the common problem where Claude Code completes tasks but forgets to update the phase documentation checkboxes. It provides multiple ways to mark tasks complete and maintains accurate project progress tracking.

## Execution Flow

### 1. Task Location and Validation

```javascript
// Locate the target phase document
async function locatePhaseDocument(phaseParam) {
    let phasePath;
    
    if (phaseParam) {
        // Specific phase provided
        if (phaseParam.includes('.md')) {
            phasePath = phaseParam; // Full path provided
        } else {
            phasePath = `phases/phase-${phaseParam}.md`; // Phase number provided
        }
    } else {
        // Find current active phase from .vibe-status.md
        const status = await readFile('.vibe-status.md');
        const currentPhase = extractCurrentPhase(status);
        phasePath = `phases/phase-${currentPhase}.md`;
    }
    
    if (!await fileExists(phasePath)) {
        throw new Error(`Phase document not found: ${phasePath}`);
    }
    
    return phasePath;
}
```

### 2. Task Identification Strategies

```javascript
// Multiple ways to identify tasks
const taskIdentificationMethods = {
    
    // Method 1: By task number (1.1, 2.3, etc.)
    byTaskNumber: (content, taskId) => {
        const regex = new RegExp(`(- \\[ \\].*?Subtask ${taskId}[\\s\\S]*?)(?=\\n#### |\\n## |$)`, 'm');
        return content.match(regex);
    },
    
    // Method 2: By task description
    byDescription: (content, description) => {
        const regex = new RegExp(`(- \\[ \\].*?${escapeRegex(description)}.*?)(?=\\n|$)`, 'gm');
        return content.match(regex);
    },
    
    // Method 3: By tier (mark all tasks in tier complete)
    byTier: (content, tierNumber) => {
        const tierRegex = new RegExp(`(## Tier ${tierNumber}[\\s\\S]*?)(?=\\n## Tier |\\n## |$)`, 'm');
        const tierSection = content.match(tierRegex);
        if (tierSection) {
            return tierSection[1].match(/- \[ \].*?(?=\n|$)/gm) || [];
        }
        return [];
    },
    
    // Method 4: Interactive selection
    interactive: async (content) => {
        const allTasks = content.match(/- \[ \].*?(?=\n|$)/gm) || [];
        console.log('\n📋 Available incomplete tasks:');
        allTasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task.replace('- [ ]', '').trim()}`);
        });
        
        const selection = await promptUser('Select task number(s) to complete (comma-separated): ');
        const selectedIndexes = selection.split(',').map(s => parseInt(s.trim()) - 1);
        return selectedIndexes.map(i => allTasks[i]).filter(Boolean);
    }
};
```

### 3. Task Completion Logic

```javascript
// Mark tasks as complete with validation
async function markTasksComplete(phasePath, tasks, options = {}) {
    const content = await readFile(phasePath);
    let updatedContent = content;
    const completedTasks = [];
    const errors = [];
    
    for (const task of tasks) {
        try {
            // Validate task dependencies if not forcing
            if (!options.force) {
                const dependencies = extractTaskDependencies(content, task);
                const incompleteDeps = dependencies.filter(dep => !isTaskComplete(content, dep));
                
                if (incompleteDeps.length > 0) {
                    errors.push(`Task "${task}" has incomplete dependencies: ${incompleteDeps.join(', ')}`);
                    continue;
                }
            }
            
            // Mark task complete
            const completedTask = task.replace('- [ ]', '- [x]');
            updatedContent = updatedContent.replace(task, completedTask);
            completedTasks.push(completedTask);
            
            console.log(`✅ Marked complete: ${task.replace('- [ ]', '').trim()}`);
            
        } catch (error) {
            errors.push(`Failed to complete task "${task}": ${error.message}`);
        }
    }
    
    // Write updated content
    if (completedTasks.length > 0) {
        await writeFile(phasePath, updatedContent);
        console.log(`\n📝 Updated ${phasePath} with ${completedTasks.length} completed tasks`);
    }
    
    return { completedTasks, errors };
}
```

### 4. Progress Tracking Integration

```javascript
// Update .vibe-status.md with progress
async function updateProgressTracking(phasePath, completedTasks) {
    const phaseContent = await readFile(phasePath);
    const totalTasks = (phaseContent.match(/- \[[x ]\]/g) || []).length;
    const completedCount = (phaseContent.match(/- \[x\]/g) || []).length;
    const completionPercentage = Math.round((completedCount / totalTasks) * 100);
    
    // Update .vibe-status.md
    const statusPath = '.vibe-status.md';
    if (await fileExists(statusPath)) {
        let statusContent = await readFile(statusPath);
        const phaseNumber = extractPhaseNumber(phasePath);
        
        // Update phase progress section
        const progressUpdate = `## Phase ${phaseNumber} Progress
- Tasks Completed: ${completedCount}/${totalTasks} (${completionPercentage}%)
- Last Updated: ${new Date().toISOString()}
- Recent Completions: ${completedTasks.length}`;

        statusContent = updateStatusSection(statusContent, 'Phase Progress', progressUpdate);
        await writeFile(statusPath, statusContent);
    }
    
    return { totalTasks, completedCount, completionPercentage };
}
```

## Command Usage Examples

### 1. Mark Specific Task Complete
```bash
# Mark task 1.1 complete in current active phase
/vibe-mark-task-complete --task="1.1"

# Mark task in specific phase
/vibe-mark-task-complete --phase=2 --task="2.3"

# Mark by task description
/vibe-mark-task-complete --subtask="Database schema setup"
```

### 2. Mark Multiple Tasks Complete
```bash
# Mark all tasks in Tier 1 complete
/vibe-mark-task-complete --all-tier=1

# Interactive task selection
/vibe-mark-task-complete --interactive

# Force completion (skip dependency validation)
/vibe-mark-task-complete --task="3.2" --force
```

### 3. Check Status Without Changes
```bash
# Show completion status
/vibe-mark-task-complete --status

# Show status for specific phase
/vibe-mark-task-complete --phase=1 --status
```

## Integration with Workflow

### Automatic Git Commits
```javascript
// Commit changes after task completion
async function commitTaskCompletion(completedTasks, phasePath) {
    const phaseNumber = extractPhaseNumber(phasePath);
    const taskSummary = completedTasks.length === 1 
        ? completedTasks[0].replace('- [x]', '').trim()
        : `${completedTasks.length} tasks`;
    
    const commitMessage = `feat(phase-${phaseNumber}): Complete ${taskSummary}

Tasks completed:
${completedTasks.map(task => `- ${task.replace('- [x]', '').trim()}`).join('\n')}

🤖 Generated with [Claude Code](https://claude.ai/code)`;

    await execCommand(`git add ${phasePath} .vibe-status.md`);
    await execCommand(`git commit -m "${commitMessage}"`);
    
    console.log(`📦 Git commit created for task completion`);
}
```

### Validation Gates
```javascript
// Check if tier/phase can be marked complete
function validateTierCompletion(content, tierNumber) {
    const tierRegex = new RegExp(`## Tier ${tierNumber}[\\s\\S]*?(?=\\n## Tier |\\n## |$)`, 'm');
    const tierSection = content.match(tierRegex);
    
    if (!tierSection) return { valid: false, reason: `Tier ${tierNumber} not found` };
    
    const incompleteTasks = tierSection[1].match(/- \[ \]/g) || [];
    
    if (incompleteTasks.length > 0) {
        return { 
            valid: false, 
            reason: `${incompleteTasks.length} incomplete tasks in Tier ${tierNumber}`,
            incompleteTasks
        };
    }
    
    return { valid: true };
}
```

## Error Handling and Recovery

### Common Issues
1. **Phase file not found** - Search in common locations, suggest creating phase
2. **Task not found** - Show similar tasks, suggest correct format
3. **Dependency conflicts** - Show dependency chain, offer --force option
4. **Git conflicts** - Stash changes, retry, restore if needed

### Helpful Messages
```javascript
const helpfulMessages = {
    phaseNotFound: (phase) => `
❌ Phase ${phase} not found. Available phases:
${listAvailablePhases().map(p => `   - ${p}`).join('\n')}

💡 Use /vibe-phase current to see active phase
💡 Use /vibe-step-8-vertical-slices to create new phases`,

    taskNotFound: (task, suggestions) => `
❌ Task "${task}" not found. Did you mean:
${suggestions.map(s => `   - ${s}`).join('\n')}

💡 Use --interactive to see all available tasks
💡 Use --status to see current completion status`,

    dependencyConflict: (task, dependencies) => `
⚠️  Task "${task}" has incomplete dependencies:
${dependencies.map(d => `   - ${d}`).join('\n')}

💡 Complete dependencies first, or use --force to override
💡 Use /vibe-validate-progress to check all dependencies`
};
```

## Integration with Other Commands

The task marker integrates seamlessly with other Vibe commands:

- **After `/vibe-validate-progress`** - Mark validated tasks complete
- **Before `/vibe-phase complete`** - Ensure all tasks marked
- **With `/vibe-ui-healer`** - Auto-mark UI tasks after healing
- **During `/vibe-subtask complete`** - Alternative completion method

This agent ensures no completed work is lost and maintains accurate progress tracking throughout the development process.