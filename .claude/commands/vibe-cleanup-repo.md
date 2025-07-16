---
description: Coordinate comprehensive repository cleanup using specialized sub-agents
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__perplexity-mcp__perplexity_search_web
  - mcp__perplexity-ask__perplexity_ask
  - mcp__sequential-thinking__sequentialthinking
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
  - --dry-run
  - --category
  - --aggressive
  - --confirm
  - --scope
---

# vibe-cleanup-repo

Coordinate comprehensive repository cleanup using specialized sub-agents

## Usage
`/vibe-cleanup-repo [--dry-run] [--category] [--aggressive] [--confirm] [--scope]`

# Repository Cleanup Orchestrator Agent

## Mission Statement
**I am the Repository Cleanup Orchestrator.** I coordinate comprehensive repository cleanup operations using four specialized sub-agents to safely remove unnecessary files, optimize structure, and maintain codebase health.

## Agent Configuration
- **Command**: `/vibe-cleanup-repo`
- **Parameters**: `--dry-run`, `--category`, `--aggressive`, `--confirm`, `--scope`
- **Sub-Agents**: 4 specialized cleanup agents
- **Outputs**: Cleanup report, space savings, safety validation
- **MCP Tools**: Context7, Perplexity, Sequential Thinking

## Sub-Agent Architecture

### Available Sub-Agents
1. **Cleanup Research Agent** (`/vibe-cleanup-research`)
   - Gathers industry best practices for repository cleanup
   - Researches safe file removal strategies
   - Provides risk assessment frameworks

2. **Cleanup Architect Agent** (`/vibe-cleanup-architect`)
   - Analyzes repository structure and identifies cleanup opportunities
   - Creates prioritized cleanup strategy with risk assessment
   - Maps file dependencies to prevent breaking changes

3. **Cleanup Coder Agent** (`/vibe-cleanup-coder`)
   - Implements cleanup scripts and automation
   - Creates backup mechanisms and safety checks
   - Executes file removal with validation

4. **Cleanup Tester Agent** (`/vibe-cleanup-tester`)
   - Validates cleanup safety and effectiveness
   - Tests rollback procedures
   - Ensures no functionality is broken

## Execution Options

### Option 1: Complete Cleanup (Recommended)
**Command**: `/vibe-cleanup-repo`
**Description**: Execute all sub-agents in sequence for comprehensive repository cleanup

**Execution Flow**:
```
1. Run Research Agent → Gather cleanup best practices
2. Run Architect Agent → Analyze structure and create strategy  
3. Run Coder Agent → Implement cleanup with safety checks
4. Run Tester Agent → Validate results and test rollback
5. Generate final cleanup report
```

### Option 2: Individual Sub-Agent Execution
**Description**: Run specific sub-agents independently for targeted cleanup

**Available Commands**:
- `/vibe-cleanup-research` - Research cleanup best practices
- `/vibe-cleanup-architect` - Analyze and strategize cleanup
- `/vibe-cleanup-coder` - Implement cleanup scripts
- `/vibe-cleanup-tester` - Validate and test cleanup

## Cleanup Categories

### Safe Categories (Low Risk)
- **temp**: Cache files, logs, build artifacts (`__pycache__`, `*.pyc`, `.DS_Store`)
- **build**: Build outputs and temporary compilation files
- **cache**: Package manager caches and temporary downloads

### Medium Risk Categories
- **demos**: Root-level demo scripts and test files
- **test-results**: Old test result JSON files and validation evidence
- **temp-docs**: Temporary documentation and progress trackers

### High Risk Categories (Review Required)
- **archives**: Archive directories and old validation evidence  
- **docs**: Outdated documentation (requires manual review)
- **migrations**: Old migration files (database-specific)

## Orchestrator Execution Flow

### 1. Prerequisites Validation
```bash
echo "🧹 REPOSITORY CLEANUP ORCHESTRATOR"
echo "================================="

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️ Uncommitted changes detected!"
    echo "Please commit or stash changes before cleanup"
    exit 1
fi

# Create backup tag
backup_tag="cleanup-backup-$(date +%Y%m%d_%H%M%S)"
git tag "$backup_tag"
echo "💾 Backup tag created: $backup_tag"
```

### 2. Sub-Agent Orchestration

#### Phase 1: Research (KNOWLEDGE GATHERING)
```bash
echo "📚 Phase 1: Research Best Practices"
echo "=================================="

# Execute research agent
if ! /vibe-cleanup-research --output .vibe/cleanup-research.json; then
    echo "❌ Research phase failed"
    exit 1
fi

echo "✅ Research complete - Best practices gathered"
```

#### Phase 2: Architecture Analysis (STRATEGY CREATION)
```bash
echo "🏗️ Phase 2: Repository Analysis"
echo "==============================="

# Execute architect agent
if ! /vibe-cleanup-architect --repo-path . --output .vibe/cleanup-analysis.json; then
    echo "❌ Architecture analysis failed"
    exit 1
fi

# Parse results
total_files=$(jq '.metrics.total_files' .vibe/cleanup-analysis.json)
potential_savings=$(jq '.metrics.potential_savings_mb' .vibe/cleanup-analysis.json)

echo "✅ Analysis complete:"
echo "   Files analyzed: $total_files"
echo "   Potential savings: ${potential_savings}MB"
```

#### Phase 3: Implementation (SAFE CLEANUP)
```bash
echo "🔧 Phase 3: Cleanup Implementation"
echo "================================="

# Execute coder agent with safety checks
if ! /vibe-cleanup-coder --execute --safety-checks=enabled --backup=git-stash; then
    echo "❌ Cleanup implementation failed"
    echo "Rolling back to backup tag: $backup_tag"
    git reset --hard "$backup_tag"
    exit 1
fi

echo "✅ Cleanup implementation complete"
```

#### Phase 4: Validation (SAFETY TESTING)
```bash
echo "✅ Phase 4: Cleanup Validation"
echo "============================="

# Execute tester agent
if ! /vibe-cleanup-tester --validate --rollback-test; then
    echo "❌ Validation failed - Issues detected"
    echo "Rolling back to backup tag: $backup_tag"
    git reset --hard "$backup_tag"
    exit 1
fi

echo "✅ Validation complete - Cleanup successful"
```

### 3. Final Reporting

```bash
echo "📊 CLEANUP SUMMARY REPORT"
echo "========================"

# Calculate actual savings
size_before=$(jq '.metrics.size_before_mb' .vibe/cleanup-analysis.json)
size_after=$(du -sm . | cut -f1)
actual_savings=$((size_before - size_after))

echo "📈 Results:"
echo "   Size before: ${size_before}MB"
echo "   Size after: ${size_after}MB"
echo "   Space saved: ${actual_savings}MB"
echo ""
echo "🗂️ Files processed:"
echo "   Safe removals: $(jq '.results.safe_removals' .vibe/cleanup-analysis.json)"
echo "   Review items: $(jq '.results.review_required' .vibe/cleanup-analysis.json)"
echo ""
echo "🔒 Safety:"
echo "   Backup tag: $backup_tag"
echo "   Rollback available: git reset --hard $backup_tag"
```

## Safety Features

### Automatic Backup System
```bash
# Create git backup before any changes
create_cleanup_backup() {
    backup_tag="cleanup-backup-$(date +%Y%m%d_%H%M%S)"
    git tag "$backup_tag"
    
    # Also create stash backup
    git stash push -m "Pre-cleanup backup $backup_tag" --include-untracked
    
    echo "✅ Backup created: $backup_tag"
    return 0
}
```

### Rollback Mechanism
```bash
# Rollback if issues detected
rollback_cleanup() {
    local backup_tag="$1"
    echo "🔄 Rolling back cleanup..."
    
    git reset --hard "$backup_tag"
    git stash pop 2>/dev/null || true
    
    echo "✅ Rollback complete"
}
```

### Validation Gates
```bash
# Validation checkpoints throughout process
validate_checkpoint() {
    local phase="$1"
    
    # Run basic functionality tests
    if command -v npm &> /dev/null; then
        npm test --silent || return 1
    fi
    
    if command -v python &> /dev/null; then
        python -m pytest --quiet || return 1
    fi
    
    echo "✅ Checkpoint $phase validated"
    return 0
}
```

## Command Arguments

### Execution Modes
- `--dry-run` - Preview cleanup without making changes
- `--execute` - Perform actual cleanup operations
- `--interactive` - Prompt for confirmation at each step

### Category Selection
- `--category temp` - Clean temporary files only
- `--category demos` - Clean demo scripts and test files
- `--category all` - Clean all safe categories
- `--aggressive` - Include medium-risk categories

### Safety Options
- `--backup=git-tag` - Create git tag backup (default)
- `--backup=git-stash` - Create git stash backup
- `--no-backup` - Skip backup (not recommended)
- `--validate` - Run validation tests after cleanup

## Error Handling

### Sub-Agent Failure Recovery
```bash
handle_subagent_failure() {
    local agent="$1"
    local backup_tag="$2"
    
    echo "❌ $agent failed"
    echo "🔄 Initiating rollback to $backup_tag"
    
    git reset --hard "$backup_tag"
    echo "✅ Rollback complete"
    
    exit 1
}
```

### Validation Failure Recovery
```bash
handle_validation_failure() {
    echo "❌ Cleanup validation failed"
    echo "🔍 Running diagnostics..."
    
    # Run diagnostic checks
    /vibe-doctor --focus=cleanup-issues
    
    echo "💡 Consider running individual cleanup categories"
    echo "   /vibe-cleanup-coder --category temp --dry-run"
}
```

## Integration Points

### MCP Tool Integration
- **Context7**: Research cleanup best practices and documentation
- **Perplexity**: Validate cleanup strategies against industry standards  
- **Sequential Thinking**: Complex dependency analysis and cleanup planning

### Git Integration
- Automatic backup creation before cleanup
- Tag-based rollback system
- Stash integration for uncommitted changes

### Quality System Integration
- Integration with work validator for post-cleanup testing
- Updates to quality metrics after cleanup
- Documentation updates for maintained codebase

## Success Metrics
- Space savings achieved (target: 50-100MB typical)
- Files safely removed without breaking functionality
- Zero post-cleanup test failures
- Successful rollback capability verification

The Repository Cleanup Orchestrator ensures safe, systematic cleanup of codebases while maintaining full functionality and providing comprehensive rollback capabilities.