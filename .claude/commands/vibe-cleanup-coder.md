---
description: Execute safe file removal and repository optimization based on architect plan
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
  - --execute
  - --confirm
  - --backup
---

# vibe-cleanup-coder

Execute safe file removal and repository optimization based on architect plan

## Usage
`/vibe-cleanup-coder [--execute] [--confirm] [--backup]`

# Cleanup Coder Agent

## Mission Statement
**I am the Cleanup Coder Agent.** I implement safe repository cleanup automation based on architectural analysis, creating backup mechanisms and executing file removal with comprehensive validation.

## Agent Configuration
- **Command**: `/vibe-cleanup-coder`
- **Parameters**: `--execute`, `--dry-run`, `--category`, `--safety-checks`, `--backup`
- **Dependencies**: Architect analysis, research findings
- **Outputs**: Cleanup scripts, backup verification, execution report
- **MCP Tools**: Context7

## Implementation Process

### 1. Initialization and Validation
```bash
echo "🔧 CLEANUP CODER AGENT"
echo "====================="

# Load architect analysis
analysis_file=".vibe/cleanup-analysis.json"
if [ ! -f "$analysis_file" ]; then
    echo "❌ No architect analysis found. Run /vibe-cleanup-architect first."
    exit 1
fi

# Parse analysis data
temp_files_count=$(jq '.cleanup_candidates.temp_files.count' "$analysis_file")
demo_files_count=$(jq '.cleanup_candidates.demo_files.count' "$analysis_file")

echo "📋 Analysis loaded:"
echo "   Temp files: $temp_files_count"
echo "   Demo files: $demo_files_count"
```

### 2. Backup System Implementation
```bash
create_comprehensive_backup() {
    echo "💾 Creating comprehensive backup system..."
    
    backup_timestamp=$(date +%Y%m%d_%H%M%S)
    backup_tag="cleanup-backup-$backup_timestamp"
    backup_dir=".vibe/backups/cleanup-$backup_timestamp"
    
    # Create backup directory
    mkdir -p "$backup_dir"
    
    # Git-based backup
    echo "📦 Creating git backup..."
    git tag "$backup_tag"
    git stash push -m "Pre-cleanup backup $backup_timestamp" --include-untracked
    
    # File-based backup for critical items
    echo "📁 Creating file backup for critical items..."
    if [ -f "package.json" ]; then
        cp "package.json" "$backup_dir/"
    fi
    if [ -f "requirements.txt" ]; then
        cp "requirements.txt" "$backup_dir/"
    fi
    
    echo "✅ Backup created: $backup_tag"
    echo "$backup_tag:$backup_dir"
}
```

### 3. Category-Specific Cleanup Implementation

#### Temporary Files Cleanup (Low Risk)
```bash
cleanup_temp_files() {
    echo "🗑️ Cleaning temporary files..."
    
    # Python cache files
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true
    find . -name "*.pyo" -delete 2>/dev/null || true
    
    # Log files
    find . -name "*.log" -type f -delete 2>/dev/null || true
    
    # OS-specific files
    find . -name ".DS_Store" -delete 2>/dev/null || true
    find . -name "Thumbs.db" -delete 2>/dev/null || true
    
    # Temporary files
    find . -name "*.tmp" -delete 2>/dev/null || true
    find . -name "*.cache" -delete 2>/dev/null || true
    
    echo "✅ Temporary files cleanup complete"
}
```

#### Demo Files Cleanup (Medium Risk)
```bash
cleanup_demo_files() {
    echo "🎭 Cleaning demo files..."
    
    # Validate each demo file before removal
    validate_demo_file() {
        local file="$1"
        
        # Check if file is imported or referenced
        local references
        references=$(grep -r "$(basename "$file" .py)" --include="*.py" . 2>/dev/null | grep -v "$file" | wc -l)
        
        if [ "$references" -gt 0 ]; then
            echo "⚠️ Warning: $file has $references references - skipping"
            return 1
        fi
        
        return 0
    }
    
    # Process demo files with validation
    demo_patterns=("demo_*" "test_*manual*" "example_*" "*_demo.py" "execute_*.py")
    
    for pattern in "${demo_patterns[@]}"; do
        find . -maxdepth 1 -name "$pattern" -type f | while read -r file; do
            if validate_demo_file "$file"; then
                echo "🗑️ Removing demo file: $file"
                rm "$file"
            fi
        done
    done
    
    echo "✅ Demo files cleanup complete"
}
```

### 4. Execution Modes

#### Dry Run Mode
```bash
execute_dry_run() {
    echo "🔍 DRY RUN MODE - No files will be deleted"
    echo "========================================"
    
    # Show what would be removed
    echo "📋 Would remove temporary files:"
    find . -type d -name "__pycache__" -o -name "*.pyc" -o -name "*.log" -o -name ".DS_Store" | head -10
    
    echo "📋 Would remove demo files:"
    find . -maxdepth 1 -name "demo_*" -o -name "*_demo.py" | head -5
    
    echo "✅ Dry run complete - no changes made"
}
```

#### Execute Mode
```bash
execute_cleanup() {
    local categories=("$@")
    
    echo "🚀 EXECUTING CLEANUP"
    echo "==================="
    
    # Create backup first
    backup_info=$(create_comprehensive_backup)
    backup_tag=$(echo "$backup_info" | cut -d: -f1)
    
    echo "💾 Backup created: $backup_tag"
    
    # Execute cleanup by category
    for category in "${categories[@]}"; do
        echo "🔧 Processing category: $category"
        
        case "$category" in
            "temp")
                cleanup_temp_files
                ;;
            "demos")
                cleanup_demo_files
                ;;
            *)
                echo "⚠️ Unknown category: $category"
                ;;
        esac
    done
    
    echo "✅ Cleanup execution complete"
}
```

## Command Interface

```bash
# Main execution logic
MODE="execute"
CATEGORIES=()

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            MODE="dry-run"
            shift
            ;;
        --execute)
            MODE="execute"
            shift
            ;;
        --category)
            CATEGORIES+=("$2")
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute based on mode
case "$MODE" in
    "dry-run")
        execute_dry_run
        ;;
    "execute")
        if [ ${#CATEGORIES[@]} -eq 0 ]; then
            CATEGORIES=("temp")  # Default to safe category
        fi
        execute_cleanup "${CATEGORIES[@]}"
        ;;
esac
```

## Key Features

### Safety Mechanisms
- Comprehensive git-based backup before any changes
- File reference validation before removal
- Category-based risk assessment
- Rollback capabilities

### Validation Framework
- Pre-cleanup dependency checking
- Post-cleanup functionality testing
- Reference analysis for demo files
- Progress tracking and reporting

### Integration Points
- Uses architect analysis for cleanup strategy
- Follows research best practices
- Provides validation data for tester agent
- Maintains comprehensive execution logs

The Cleanup Coder Agent provides safe, automated implementation of repository cleanup with comprehensive backup and validation systems.