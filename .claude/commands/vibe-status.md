---
description: Check project progress and next steps
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

# vibe-status

Check project progress and next steps

# Vibe Status - Project Status Checker Agent

## Agent Configuration
- **Command**: `/vibe-status`
- **Prerequisites**: `.vibe-status.md` must exist
- **Output**: Console display and status report
- **Purpose**: Show current project progress and recommend next actions

## Status Check Process

### Step 1: Read Status File
```python
# Read .vibe-status.md
1. Locate and parse .vibe-status.md
2. Extract project metadata
3. Parse progress table
4. Identify completed and pending steps
```

### Step 2: Analyze Project State
```python
# Determine current state
1. Count completed steps
2. Identify current step in progress
3. Check for any blocked steps
4. Validate file outputs exist
5. Calculate completion percentage
```

### Step 3: Generate Status Report
```
📊 Vibe Coding Project Status Report
════════════════════════════════════

📁 Project: [project-name]
📋 Template: [template-type]
📅 Created: [created-date]
🕐 Last Updated: [last-update]

📈 Overall Progress: [X/8 Steps] ([percentage]% Complete)
[████████████░░░░░░░░] 

✅ Completed Steps:
1. ✓ Project Ideation → docs/01-project-specification.md
2. ✓ Technical Architecture → docs/02-technical-architecture.md

🔄 In Progress:
3. ◐ UX Design → docs/03-ux-design.md (started [date])

⏳ Pending Steps:
4. ○ Design System
5. ○ Interface States
6. ○ Technical Specification
7. ○ Landing Page
8. ○ Vertical Slices

🚀 Next Action:
→ Complete Step 3 with `/vibe-step-3-ux-design`
  or
→ Check for issues with `/vibe-doctor`

📊 Project Metrics:
- Days Since Start: [X]
- Average Step Duration: [X] days
- Estimated Completion: [date]

💡 Quick Commands:
- Continue current: `/vibe-step-3-ux-design`
- Skip to step: `/vibe-update 3`
- View help: `/vibe-help`
- Export project: `/vibe-export`
```

### Step 4: Provide Intelligent Recommendations

Based on project state, provide contextual recommendations:

#### If No Steps Completed:
```
🎯 Getting Started:
Looks like you're just getting started! Here's your roadmap:

1. Begin with `/vibe-step-1-ideation` to define your project
2. This will create your project specification
3. Each step builds on the previous one

💡 Pro Tip: Have your project idea ready before starting Step 1!
```

#### If Some Steps Completed:
```
🎯 Keep the Momentum Going!
You're making great progress! Here's what's next:

Current Step: [step-name]
Time on Step: [duration]

Recommendations:
- Complete the current step to maintain flow
- Review previous outputs for consistency
- Consider your timeline goals
```

#### If Many Steps Completed:
```
🎯 You're Almost There!
Fantastic progress! Here's your final push:

Remaining Steps: [list]
Estimated Time: [based on average]

Focus Areas:
- Ensure quality over speed
- Review all outputs for consistency
- Prepare for deployment planning
```

### Step 5: Validation Checks
```python
# Run integrity checks
1. Verify all completed files exist
2. Check file sizes (not empty)
3. Validate markdown formatting
4. Ensure git repository health
5. Check for common issues
```

### Step 6: Generate Warnings (if any)
```
⚠️ Warnings Detected:

1. Missing file: docs/02-technical-architecture.md
   → Run `/vibe-doctor` to fix

2. Step 1 completed 30 days ago
   → Consider reviewing for updates

3. Git uncommitted changes detected
   → Commit your work to preserve progress
```

## Additional Features

### Progress Visualization
```
Step Progress Timeline:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1 ████ (2 days)
2 ██████ (3 days) 
3 ██... (1 day - in progress)
4-8 [pending]
```

### File Size Report
```
📂 Generated Documentation:
- Step 1: 12.4 KB ✓
- Step 2: 18.7 KB ✓
- Step 3: 5.2 KB (in progress)
- Total: 36.3 KB
```

### MCP Tool Usage Stats
```
🔧 MCP Tool Usage:
- Context7: Used 12 times
- Perplexity: Used 8 times
- TaskMaster: Not yet used
- Sequential Thinking: Not yet used
- Magic UI: Not yet used
```

## Error Handling

### Common Issues
1. **Missing status file**: Suggest running `/vibe-init`
2. **Corrupted status**: Offer to rebuild from existing files
3. **Missing outputs**: Run `/vibe-doctor` for repair
4. **Git issues**: Provide git troubleshooting steps

## Integration with Other Commands

### Suggested Next Commands
Based on status, intelligently suggest:
- `/vibe-step-[X]` for next step
- `/vibe-update [X]` to revise completed steps
- `/vibe-doctor` if issues detected
- `/vibe-export` if nearing completion

### Quick Actions Menu
```
🔧 Quick Actions:
[1] Continue to next step
[2] Update previous step
[3] Run diagnostics
[4] Export project
[5] View detailed help

Select an option or use the command directly.
```

## Output Formatting
- Use color coding (if terminal supports)
- Clear visual hierarchy
- Emoji for quick scanning
- Progress bars for visual feedback
- Actionable recommendations
- Quick command references