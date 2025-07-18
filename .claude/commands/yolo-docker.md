# yolo-docker

Execute phases in Docker container with zero-friction automation - clean, reproducible environment with all commands auto-approved.

## Usage
```
/yolo-docker [options]
```

## Options
- `--phase=N` - Execute specific phase (default: current phase)
- `--tier=N` - Execute specific tier only (1, 2, or 3)
- `--verbose` - Show detailed command execution
- `--dry-run` - Preview what would be executed without running
- `--rebuild` - Force rebuild of Docker image
- `--no-cache` - Build Docker image without cache
- `--keep-container` - Keep container after execution for debugging
- `--emergency-stop` - Create periodic checkpoints for safety
- `--interval=N` - Checkpoint interval in minutes (default: 5)

## Philosophy
- **Clean Environment**: Each execution in fresh Docker container
- **Reproducible**: Consistent environment across all executions
- **Zero Friction**: No permission prompts, full automation
- **Isolated**: No impact on local development environment
- **Debuggable**: Option to keep container for inspection

## Examples
```bash
# Execute current phase in Docker
/yolo-docker

# Execute phase 3 with image rebuild
/yolo-docker --phase=3 --rebuild

# Execute with no cache and keep container
/yolo-docker --no-cache --keep-container

# Preview execution plan
/yolo-docker --dry-run

# Execute tier 1 only with verbose output
/yolo-docker --tier=1 --verbose
```

## Docker Environment
- Base image: Node.js 20 Alpine
- Includes all project dependencies
- MCP tools pre-configured
- Git configured for commits
- Full project mounted as volume

## Safety Features
- Isolated execution environment
- Automatic cleanup (unless --keep-container)
- Volume mounts for persistence
- Emergency stop capabilities
- Full validation in container

## What Gets Executed
1. Build/pull Docker image with project environment
2. Mount project as volume in container
3. Execute phase tasks in clean environment
4. Run validation suite
5. Commit changes from container
6. Clean up container (unless kept)