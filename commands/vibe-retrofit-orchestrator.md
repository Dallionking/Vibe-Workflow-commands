# vibe-retrofit-orchestrator

Orchestrate comprehensive retrofit operations for existing codebases using the Vibe Coding methodology.

## Usage
```
/vibe-retrofit-orchestrator [options]
```

## Options
- `--analyze-only` - Only analyze the codebase without making changes
- `--phase=N` - Target specific retrofit phase
- `--verbose` - Show detailed analysis and operations
- `--dry-run` - Preview what would be changed

## Features
- **Comprehensive Analysis**: Deep codebase understanding
- **Pattern Detection**: Identify existing patterns and conventions
- **Retrofit Planning**: Generate detailed retrofit roadmap
- **Agent Coordination**: Orchestrate multiple retrofit agents
- **Quality Validation**: Ensure retrofit maintains code quality

## Process Flow
1. **Codebase Analysis**
   - Scan project structure
   - Identify technology stack
   - Detect patterns and conventions
   - Map dependencies

2. **Retrofit Planning**
   - Generate retrofit phases
   - Identify high-impact areas
   - Create migration strategy
   - Risk assessment

3. **Agent Orchestration**
   - Deploy specialized retrofit agents
   - Coordinate API, UI, and data retrofits
   - Manage dependencies
   - Track progress

4. **Validation**
   - Test retrofit changes
   - Ensure backward compatibility
   - Validate quality standards
   - Generate reports

## Examples
```bash
# Full retrofit orchestration
/vibe-retrofit-orchestrator

# Analyze only mode
/vibe-retrofit-orchestrator --analyze-only

# Target specific phase
/vibe-retrofit-orchestrator --phase=2

# Dry run with verbose output
/vibe-retrofit-orchestrator --dry-run --verbose
```

## Integration
- Works with existing Vibe Coding workflow
- Coordinates with step agents
- Maintains project context
- Updates .vibe-status.md automatically