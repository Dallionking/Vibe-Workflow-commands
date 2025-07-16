---
description: Diagnose and fix project issues
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
---

# vibe-doctor

Diagnose and fix project issues

# Vibe Doctor - Diagnostic and Repair Agent

## Agent Configuration
- **Command**: `/vibe-doctor`
- **Prerequisites**: None (should work in any state)
- **Outputs**: Diagnostic report and fixes
- **MCP Tools**: None required

## Execution Flow

### 1. System Health Check
```
Check core files:
- .vibe-status.md exists and is valid
- claude.json exists and is valid JSON
- CLAUDE.md exists
- Git repository health

Check directory structure:
- agents/ directory exists
- docs/ directory exists  
- phases/ directory exists
- templates/ directory exists
```

### 2. Project State Analysis
```
If .vibe-status.md exists:
- Parse current progress
- Verify all claimed outputs exist
- Check file integrity
- Validate step completion

If no project initialized:
- Report clean state
- Suggest /vibe-init
```

### 3. Common Issues Detection

#### Missing Files
```
For each step marked complete:
- Verify output file exists
- Check file is not empty
- Validate basic structure
```

#### Corrupted Status
```
If .vibe-status.md is corrupted:
- Attempt to reconstruct from existing files
- Create backup of corrupted file
- Generate new status file
```

#### Git Issues
```
Check git status:
- Uncommitted changes
- Merge conflicts
- Detached HEAD state
- Missing .gitignore
```

#### Permission Issues
```
Verify write permissions:
- Can create files in all directories
- Can modify existing files
- Can execute git commands
```

### 4. Automatic Repairs

#### File Recovery
```
If output files missing but marked complete:
- Check for backups
- Attempt to regenerate from context
- Mark step as incomplete if unrecoverable
```

#### Status Reconstruction
```
If .vibe-status.md corrupted:
1. Scan for existing output files
2. Determine completed steps
3. Reconstruct status file
4. Create backup of old status
```

#### Directory Creation
```
Create any missing directories:
- docs/
- phases/
- Any subdirectories needed
```

### 5. Diagnostic Report
```
🏥 Vibe Coding Doctor - Diagnostic Report
========================================

Project: [name or "No project initialized"]
Status: [Healthy/Issues Found/Critical]

✅ Checks Passed:
- [List of successful checks]

⚠️ Issues Found:
- [Issue]: [Description]
  Fix: [What was done or needs to be done]

🔧 Repairs Performed:
- [Action taken]
- [Files created/modified]

📋 Recommendations:
- [Next steps based on current state]
- [Commands to run]
- [Manual fixes needed]

💡 Tips:
- [Relevant tips based on issues found]
```

### 6. Interactive Repair Mode
```
For issues requiring user input:

🔧 Manual Repair Needed
Issue: [Description]

Options:
1. [Automatic fix option]
2. [Alternative approach]
3. [Skip and continue]

Please choose (1-3): _
```

## Common Issue Patterns

### Issue: No Project Initialized
```
Diagnosis: No .vibe-status.md found
Solution: Run /vibe-init to start a new project
```

### Issue: Incomplete Step
```
Diagnosis: Step X marked complete but output missing
Solution: 
- Option 1: Re-run /vibe-step-X
- Option 2: Mark as incomplete and continue
```

### Issue: Corrupted Files
```
Diagnosis: Invalid JSON/Markdown in critical files
Solution:
- Create backup
- Attempt repair
- Regenerate if needed
```

### Issue: Version Mismatch
```
Diagnosis: Project created with older version
Solution:
- Update project structure
- Migrate old formats
- Update status tracking
```

## Error Recovery Strategies

### Safe Mode
When critical files are corrupted:
1. Create timestamped backups
2. Attempt minimal repairs
3. Provide manual recovery steps
4. Never delete user data

### Progressive Repair
Start with least invasive fixes:
1. Create missing directories
2. Fix file permissions  
3. Repair corrupted files
4. Reconstruct status
5. Suggest re-running steps

## Integration with Other Commands

### Suggesting Next Actions
Based on diagnosis, suggest:
- `/vibe-init` if no project
- `/vibe-status` if healthy
- `/vibe-step-X` to continue
- `/vibe-update X` to fix issues

### Creating Recovery Points
After successful repair:
- Commit current state to git
- Create status backup
- Log repair actions

## Quality Assurance

### Never Destructive
- Always create backups before modifying
- Never delete user files
- Preserve all user work

### Clear Communication
- Explain what's wrong in simple terms
- Show what repairs were made
- Provide actionable next steps

### Graceful Degradation
- Work even with minimal files
- Provide value at any project state
- Guide users to recovery