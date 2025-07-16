---
description: Quick and simple rollback operations for common scenarios
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
  - --target
  - --confirm
---

# vibe-simple-rollback

Quick and simple rollback operations for common scenarios

## Usage
`/vibe-simple-rollback [--target] [--confirm]`

# Simple Rollback Agent (Claude Code Compatible)

## Mission Statement
**I am the Simple Rollback Agent.** I provide basic rollback capabilities using git operations and file management that work within Claude Code's current limitations.

## What This Agent CAN Do in Claude Code

### 1. Git-Based Code Rollback
```bash
# Rollback to previous commit
git log --oneline -10  # Show recent commits
git checkout HEAD~1    # Go back one commit
git checkout -b rollback-$(date +%Y%m%d_%H%M%S)  # Create rollback branch
```

### 2. File-Based Configuration Rollback
```bash
# Backup current config
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
cp -r config/ config.backup.$(date +%Y%m%d_%H%M%S)/

# Restore from backup
cp .env.backup.20240705_143022 .env
cp -r config.backup.20240705_143022/ config/
```

### 3. Simple Log Rotation
```bash
# Rotate logs when they get too large
if [ $(stat -f%z "app.log" 2>/dev/null || echo 0) -gt 52428800 ]; then  # 50MB
    mv app.log "app.log.$(date +%Y%m%d_%H%M%S)"
    touch app.log
    gzip "app.log.$(date +%Y%m%d_%H%M%S)"
fi

# Clean old logs (keep last 10)
ls -t *.log.*.gz | tail -n +11 | xargs rm -f
```

### 4. Dependency Rollback
```bash
# Backup package files
cp package.json package.json.backup.$(date +%Y%m%d_%H%M%S)
cp package-lock.json package-lock.json.backup.$(date +%Y%m%d_%H%M%S)

# Restore dependencies
cp package.json.backup.20240705_143022 package.json
cp package-lock.json.backup.20240705_143022 package-lock.json
npm ci  # Clean install from lock file
```

## Practical Rollback Commands

### `/vibe-simple-rollback`
```bash
#!/bin/bash
echo "🔄 Simple Git Rollback"
echo "====================="

# Show recent commits
echo "Recent commits:"
git log --oneline -5

echo ""
read -p "Enter commit hash to rollback to: " commit_hash

if [ -n "$commit_hash" ]; then
    # Create backup branch
    backup_branch="backup-$(date +%Y%m%d_%H%M%S)"
    git checkout -b "$backup_branch"
    git checkout main
    
    # Rollback to target commit
    git reset --hard "$commit_hash"
    
    echo "✅ Rolled back to $commit_hash"
    echo "💾 Backup branch created: $backup_branch"
else
    echo "❌ No commit hash provided"
fi
```

### `/vibe-backup-config`
```bash
#!/bin/bash
echo "💾 Creating Configuration Backup"
echo "==============================="

timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir=".vibe/backups/$timestamp"

mkdir -p "$backup_dir"

# Backup important files
[ -f .env ] && cp .env "$backup_dir/"
[ -d config ] && cp -r config/ "$backup_dir/"
[ -f package.json ] && cp package.json "$backup_dir/"
[ -f package-lock.json ] && cp package-lock.json "$backup_dir/"

echo "✅ Backup created in: $backup_dir"
echo "Files backed up:"
ls -la "$backup_dir"
```

### `/vibe-rotate-logs`
```bash
#!/bin/bash
echo "📝 Rotating Log Files"
echo "===================="

log_dir=".vibe/logs"
mkdir -p "$log_dir"

# Find and rotate large log files
find . -name "*.log" -size +50M | while read logfile; do
    if [ -f "$logfile" ]; then
        timestamp=$(date +%Y%m%d_%H%M%S)
        rotated_name="${logfile%.log}.${timestamp}.log"
        
        mv "$logfile" "$rotated_name"
        touch "$logfile"
        gzip "$rotated_name"
        
        echo "✅ Rotated: $logfile → ${rotated_name}.gz"
    fi
done

# Clean old compressed logs (keep last 10)
find . -name "*.log.*.gz" -type f | sort -r | tail -n +11 | while read oldlog; do
    rm -f "$oldlog"
    echo "🗑️ Cleaned: $oldlog"
done
```

## What Users Should Expect

### ✅ Works in Claude Code:
- Basic git rollbacks to previous commits
- File backup and restore operations  
- Simple log rotation based on file size
- Package.json rollback and dependency restoration
- Creating timestamped backups

### ❌ Requires External Setup:
- Automatic monitoring and triggers
- Database rollbacks (needs DB-specific tools)
- Real-time notifications
- Production deployment rollbacks
- Integration with external monitoring systems

## Implementation Strategy

1. **Phase 1 (Claude Code)**: Implement basic git and file operations
2. **Phase 2 (External)**: Add monitoring scripts and automation
3. **Phase 3 (Production)**: Integrate with CI/CD and monitoring systems

## Realistic Usage

```bash
# What you can do NOW in Claude Code:
/vibe-simple-rollback           # Git-based code rollback
/vibe-backup-config            # Create configuration backup
/vibe-restore-config           # Restore from backup
/vibe-rotate-logs              # Manual log rotation
/vibe-rollback-dependencies    # Package rollback

# What requires external implementation:
- Automatic quality gate monitoring
- Production database rollbacks  
- Real-time log streaming
- Slack/email notifications
- CI/CD pipeline integration
```

This agent provides practical, immediately usable rollback capabilities within Claude Code's current limitations, while the comprehensive specification in `quality-checks.json` serves as a roadmap for future external implementation.