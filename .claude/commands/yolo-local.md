# yolo-local

Execute phases locally with zero-friction automation - all commands auto-approved while maintaining full quality standards.

## Usage
```
/yolo-local [options]
```

## Options
- `--phase=N` - Execute specific phase (default: current phase)
- `--tier=N` - Execute specific tier only (1, 2, or 3)
- `--verbose` - Show detailed command execution
- `--dry-run` - Preview what would be executed without running
- `--emergency-stop` - Create periodic checkpoints for safety
- `--interval=N` - Checkpoint interval in minutes (default: 5)

## Philosophy
- **Zero Permission Prompts**: All commands auto-approved for maximum velocity
- **Full Quality Maintained**: 95%+ test coverage, UI healing, validation
- **Dynamic Phase Support**: Works with any phases in your project
- **Safety First**: Emergency stops, periodic checkpoints, rollback capabilities
- **Maximum Velocity**: Executes complete phases end-to-end automatically

## Examples
```bash
# Execute current phase locally
/yolo-local

# Execute specific phase with verbose output
/yolo-local --phase=2 --verbose

# Execute only tier 1 of current phase
/yolo-local --tier=1

# Preview what would be executed
/yolo-local --dry-run

# Execute with emergency stops every 10 minutes
/yolo-local --emergency-stop --interval=10
```

## Safety Features
- Automatic git commits at phase boundaries
- Rollback capabilities if errors occur
- Emergency stop checkpoints
- Dry-run mode for preview
- Full validation after each tier

## What Gets Executed
Based on your current phase files, this will:
1. Read phase requirements
2. Execute all tier 1 tasks (foundation)
3. Execute all tier 2 tasks (implementation)
4. Execute all tier 3 tasks (enhancement)
5. Run full validation suite
6. Commit changes with appropriate message