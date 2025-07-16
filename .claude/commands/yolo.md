---
description: Execute phases with zero-friction automation
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
  - Task
parameters:
  - mode
  - options
---

# YOLO Commands - Zero-Friction Phase Execution

Execute complete development phases automatically with full quality maintained.

## Usage
`/yolo local [options]` - Execute phases locally with full automation
`/yolo docker [options]` - Execute phases in Docker container

## Options
- `--phase=N` - Execute specific phase (default: current)
- `--tier=N` - Execute specific tier only (1, 2, or 3)
- `--verbose` - Show detailed command execution
- `--dry-run` - Preview what would be executed
- `--emergency-stop` - Create periodic checkpoints
- `--interval=N` - Checkpoint interval in minutes (default: 5)

## Docker-specific Options
- `--rebuild` - Force rebuild of Docker image
- `--no-cache` - Build Docker image without cache
- `--keep-container` - Keep container after execution

## Philosophy
- Zero Permission Prompts: All commands auto-approved
- Full Quality Maintained: 95%+ test coverage, UI healing, validation
- Dynamic Phase Support: Works with any phases in your project
- Safety First: Emergency stops, periodic checkpoints, rollback capabilities
- Maximum Velocity: Executes complete phases end-to-end automatically

ARGUMENTS: $ARGUMENTS
