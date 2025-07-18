# yolo

Zero-friction phase execution system - execute complete development phases automatically with all commands auto-approved while maintaining full quality standards.

## Available Commands

### Local Execution
```
/yolo-local [options]
```
Execute phases directly in your local environment with full automation.

### Docker Execution
```
/yolo-docker [options]
```
Execute phases in a clean Docker container for reproducible results.

## Quick Start

```bash
# Execute current phase locally
/yolo-local

# Execute current phase in Docker
/yolo-docker

# Execute specific phase with details
/yolo-local --phase=2 --verbose

# Preview what would be executed
/yolo-docker --dry-run
```

## Philosophy

YOLO (You Only Launch Once) commands embody maximum development velocity:
- **Zero Permission Prompts**: No interruptions, full automation
- **Full Quality Maintained**: 95%+ test coverage, validation, UI healing
- **Safety First**: Emergency stops, checkpoints, rollback capabilities
- **Maximum Velocity**: Complete phases executed end-to-end

## Common Options

Both commands support:
- `--phase=N` - Target specific phase
- `--tier=N` - Execute specific tier (1, 2, or 3)
- `--verbose` - Detailed output
- `--dry-run` - Preview mode
- `--emergency-stop` - Safety checkpoints

## When to Use

- **Use `/yolo-local`** when:
  - You want fastest execution
  - Your environment is already set up
  - You're actively developing

- **Use `/yolo-docker`** when:
  - You need a clean environment
  - You want reproducible builds
  - You're testing final implementation

## Safety Features

- Automatic git commits at boundaries
- Rollback on critical errors
- Emergency stop capabilities
- Dry-run preview mode
- Full validation after execution

See individual command help for detailed options:
- `/yolo-local --help`
- `/yolo-docker --help`