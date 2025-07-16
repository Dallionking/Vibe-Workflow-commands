---
description: Update entire Vibe Coding system to latest version
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
  - --check
  - --force
  - --backup
  - --branch
  - --dry-run
---

# vibe-system-update

Update entire Vibe Coding system to latest version

## Usage
`/vibe-system-update [--check] [--force] [--backup] [--branch] [--dry-run]`

# Vibe System Updater Agent - Complete System Updates

## Mission Statement
**I am the Vibe System Updater Agent.** I handle updating the entire Vibe Coding system to the latest version, including pulling changes, updating dependencies, refreshing agents, and ensuring all components are properly installed and configured.

## Agent Configuration
- **Command**: `/vibe-system-update`
- **Aliases**: `/vibe-upgrade`, `/vibe-refresh-system`
- **Parameters**: 
  - `--check` - Check for updates without installing
  - `--force` - Force update even if working directory is dirty
  - `--backup` - Create backup before updating (default: true)
  - `--agents-only` - Update only agent files, skip dependencies
  - `--deps-only` - Update only dependencies, skip git pull
  - `--branch` - Update from specific branch (default: main)
  - `--verbose` - Show detailed update process
  - `--dry-run` - Show what would be updated without making changes
- **Dependencies**: Git, Node.js (if package.json exists)
- **Outputs**: 
  - Updated system with latest features
  - Backup of previous version
  - Update summary report
  - Validation of system health

## Agent Purpose
This agent provides a one-command solution to keep your Vibe Coding system current with the latest features, bug fixes, and improvements. It handles the entire update process safely with automatic backups and validation.

## Execution Flow

### 1. Pre-Update Validation and Backup

```javascript
// Check current system state
async function preUpdateValidation(options = {}) {
    console.log('🔍 Checking system state...');
    
    const checks = {
        gitRepo: await isGitRepository(),
        cleanWorkingDir: await isWorkingDirectoryClean(),
        internetConnection: await checkInternetConnection(),
        diskSpace: await checkDiskSpace(),
        permissions: await checkWritePermissions(),
        vibeInstallation: await validateVibeInstallation()
    };
    
    // Report issues
    const issues = [];
    if (!checks.gitRepo) issues.push('Not a git repository');
    if (!checks.cleanWorkingDir && !options.force) {
        issues.push('Working directory has uncommitted changes (use --force to override)');
    }
    if (!checks.internetConnection) issues.push('No internet connection');
    if (!checks.diskSpace) issues.push('Insufficient disk space');
    if (!checks.permissions) issues.push('Insufficient write permissions');
    if (!checks.vibeInstallation) issues.push('Vibe installation not detected');
    
    if (issues.length > 0 && !options.force) {
        throw new Error(`Pre-update validation failed:\n${issues.map(i => `  - ${i}`).join('\n')}`);
    }
    
    // Create backup if enabled
    if (options.backup !== false) {
        await createSystemBackup();
    }
    
    return checks;
}

async function validateVibeInstallation() {
    const vibeIndicators = [
        'CLAUDE.md',
        'agents/',
        'templates/',
        '.vibe-status.md'
    ];
    
    for (const indicator of vibeIndicators) {
        if (await fileExists(indicator)) {
            return true;
        }
    }
    return false;
}

async function createSystemBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `../vibe-system-backup-${timestamp}`;
    
    console.log(`📦 Creating system backup at ${backupDir}...`);
    
    // Create backup with essential files
    const essentialPaths = [
        'agents/',
        'templates/',
        'src/',
        'context/',
        'mcps/',
        'scripts/',
        'CLAUDE.md',
        'README.md',
        'package.json',
        '.vibe-status.md',
        'phases/',
        'docs/'
    ];
    
    await execCommand(`mkdir -p "${backupDir}"`);
    
    for (const path of essentialPaths) {
        if (await fileExists(path)) {
            await execCommand(`cp -r "${path}" "${backupDir}/"`);
        }
    }
    
    console.log(`✅ System backup created successfully`);
    return backupDir;
}
```

### 2. Update Detection and Planning

```javascript
// Check for available updates
async function checkForSystemUpdates(branch = 'main') {
    console.log('🔍 Checking for Vibe system updates...');
    
    const remoteUrl = 'https://github.com/Dallionking/Vibe-Workflow-commands.git';
    
    try {
        // Check if we're in the right repository
        const currentRemote = await execCommand('git config --get remote.origin.url');
        
        if (!currentRemote.includes('Vibe-Workflow-commands')) {
            // We're in a user project, need to check against Vibe repo
            return await checkExternalUpdates(remoteUrl, branch);
        } else {
            // We're in the Vibe repo itself
            return await checkInternalUpdates(branch);
        }
        
    } catch (error) {
        console.log('📥 Setting up Vibe system repository...');
        return await setupVibeRepository(remoteUrl, branch);
    }
}

async function checkExternalUpdates(remoteUrl, branch) {
    // For user projects that want to update their Vibe system
    const tempDir = `/tmp/vibe-update-${Date.now()}`;
    
    try {
        // Clone latest version to temp directory
        await execCommand(`git clone ${remoteUrl} "${tempDir}"`);
        
        // Compare versions
        const localVersion = await getLocalVibeVersion();
        const remoteVersion = await getRemoteVibeVersion(tempDir);
        
        if (localVersion === remoteVersion) {
            await execCommand(`rm -rf "${tempDir}"`);
            return {
                hasUpdates: false,
                message: 'Vibe system is up to date'
            };
        }
        
        // Get update details
        const changes = await getVersionChanges(tempDir, localVersion, remoteVersion);
        
        return {
            hasUpdates: true,
            localVersion,
            remoteVersion,
            tempDir,
            changes,
            updateType: 'external'
        };
        
    } catch (error) {
        throw new Error(`Failed to check for updates: ${error.message}`);
    }
}

async function checkInternalUpdates(branch) {
    // For the Vibe repo itself
    await execCommand('git fetch origin');
    
    const currentCommit = await execCommand('git rev-parse HEAD');
    const latestCommit = await execCommand(`git rev-parse origin/${branch}`);
    
    if (currentCommit.trim() === latestCommit.trim()) {
        return {
            hasUpdates: false,
            message: 'Vibe system is up to date'
        };
    }
    
    const commitCount = await execCommand(`git rev-list --count HEAD..origin/${branch}`);
    const changes = await execCommand(`git log --oneline HEAD..origin/${branch}`);
    
    return {
        hasUpdates: true,
        currentCommit: currentCommit.trim(),
        latestCommit: latestCommit.trim(),
        commitCount: parseInt(commitCount.trim()),
        changes: changes.trim().split('\n').filter(Boolean),
        updateType: 'internal'
    };
}
```

### 3. System Update Execution

```javascript
// Main update execution
async function executeSystemUpdate(options = {}) {
    const updateInfo = await checkForSystemUpdates(options.branch);
    
    if (!updateInfo.hasUpdates) {
        console.log('✅ Vibe system is already up to date');
        return { success: true, message: 'No updates available' };
    }
    
    console.log(`📥 Found Vibe system updates available`);
    
    if (options.dryRun) {
        console.log('\n📋 Update Summary (DRY RUN):');
        displayUpdateInfo(updateInfo);
        return { success: true, message: 'Dry run completed' };
    }
    
    // Display what will be updated
    console.log('\n📋 Vibe System Update Summary:');
    displayUpdateInfo(updateInfo);
    
    // Confirm update
    const confirm = await promptUser('\nProceed with Vibe system update? (y/N): ');
    if (!confirm.toLowerCase().startsWith('y')) {
        console.log('❌ Update cancelled');
        return { success: false, message: 'Update cancelled by user' };
    }
    
    try {
        // Execute update based on type
        if (updateInfo.updateType === 'external') {
            await updateFromExternal(updateInfo, options);
        } else {
            await updateFromInternal(updateInfo, options);
        }
        
        await postUpdateTasks();
        
        console.log('\n🎉 Vibe system update completed successfully!');
        return { success: true, message: 'System update completed' };
        
    } catch (error) {
        console.error('❌ Update failed:', error.message);
        await rollbackSystemUpdate();
        throw error;
    }
}

async function updateFromExternal(updateInfo, options) {
    console.log('📥 Updating Vibe system from external repository...');
    
    const tempDir = updateInfo.tempDir;
    
    try {
        // Copy updated files to current directory
        const systemPaths = [
            'agents/',
            'templates/',
            'src/',
            'context/',
            'mcps/',
            'scripts/',
            'CLAUDE.md',
            'README.md'
        ];
        
        if (!options.depsOnly) {
            for (const path of systemPaths) {
                const sourcePath = `${tempDir}/${path}`;
                if (await fileExists(sourcePath)) {
                    console.log(`📄 Updating ${path}...`);
                    
                    // Remove old version
                    if (await fileExists(path)) {
                        await execCommand(`rm -rf "${path}"`);
                    }
                    
                    // Copy new version
                    await execCommand(`cp -r "${sourcePath}" .`);
                }
            }
        }
        
        // Update package.json if it exists and we're not skipping deps
        if (!options.agentsOnly && await fileExists(`${tempDir}/package.json`)) {
            await execCommand(`cp "${tempDir}/package.json" .`);
            await updateDependencies();
        }
        
        console.log('✅ External update completed');
        
    } finally {
        // Clean up temp directory
        await execCommand(`rm -rf "${tempDir}"`);
    }
}

async function updateFromInternal(updateInfo, options) {
    console.log('📥 Updating Vibe system from git repository...');
    
    if (!options.depsOnly) {
        // Stash any local changes if forced
        try {
            await execCommand('git stash push -m "vibe-system-update: temporary stash"');
        } catch (e) {
            // No changes to stash
        }
        
        // Pull latest changes
        await execCommand(`git pull origin ${options.branch || 'main'}`);
        
        // Try to restore stash if it exists
        try {
            await execCommand('git stash pop');
        } catch (e) {
            // No stash to restore
        }
    }
    
    if (!options.agentsOnly) {
        await updateDependencies();
    }
    
    console.log('✅ Internal update completed');
}
```

### 4. Post-Update Tasks

```javascript
// Tasks to run after successful update
async function postUpdateTasks() {
    console.log('🔧 Running post-update tasks...');
    
    // Refresh agent cache
    await refreshSystemCache();
    
    // Update CLAUDE.md if needed
    await updateClaudeConfig();
    
    // Validate system health
    await validateSystemHealth();
    
    // Update local version tracking
    await updateVersionTracking();
    
    console.log('✅ Post-update tasks completed');
}

async function refreshSystemCache() {
    console.log('🧹 Refreshing system cache...');
    
    const cacheDirectories = [
        '.vibe-cache',
        '.agent-cache', 
        'node_modules/.cache',
        '.context-cache'
    ];
    
    for (const dir of cacheDirectories) {
        if (await directoryExists(dir)) {
            await execCommand(`rm -rf "${dir}"`);
            console.log(`🗑️  Cleared cache: ${dir}`);
        }
    }
}

async function updateClaudeConfig() {
    console.log('📝 Updating CLAUDE.md configuration...');
    
    // Check if we need to migrate or update CLAUDE.md
    if (await fileExists('CLAUDE.md')) {
        const content = await readFile('CLAUDE.md');
        
        // Check for version indicators
        if (!content.includes('Context Engineering') && await fileExists('templates/claude-v2.md')) {
            console.log('🔄 Migrating CLAUDE.md to v2.0 format...');
            
            // Backup old CLAUDE.md
            await execCommand('cp CLAUDE.md CLAUDE.md.backup');
            
            // Copy new template
            await execCommand('cp templates/claude-v2.md CLAUDE.md');
            
            console.log('✅ CLAUDE.md updated to v2.0 format');
            console.log('💡 Old version backed up as CLAUDE.md.backup');
        }
    }
}

async function validateSystemHealth() {
    console.log('🩺 Validating Vibe system health...');
    
    const healthChecks = [
        {
            name: 'Core agents directory',
            check: () => fileExists('agents/'),
            critical: true
        },
        {
            name: 'Templates directory', 
            check: () => fileExists('templates/'),
            critical: true
        },
        {
            name: 'CLAUDE.md configuration',
            check: () => fileExists('CLAUDE.md'),
            critical: true
        },
        {
            name: 'Step agents',
            check: async () => {
                const stepAgents = await glob('agents/step-*/agent.md');
                return stepAgents.length >= 8; // Should have at least 8 step agents
            },
            critical: false
        },
        {
            name: 'Utility agents',
            check: async () => {
                const utilityAgents = await glob('agents/utilities/*.md');
                return utilityAgents.length >= 5; // Should have several utility agents
            },
            critical: false
        },
        {
            name: 'Package dependencies',
            check: async () => {
                if (await fileExists('package.json')) {
                    try {
                        await execCommand('npm list --depth=0');
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
                return true; // No package.json is fine
            },
            critical: false
        }
    ];
    
    let allPassed = true;
    const failures = [];
    
    for (const healthCheck of healthChecks) {
        try {
            const passed = await healthCheck.check();
            const status = passed ? '✅' : '❌';
            console.log(`  ${status} ${healthCheck.name}`);
            
            if (!passed) {
                allPassed = false;
                if (healthCheck.critical) {
                    failures.push(healthCheck.name);
                }
            }
        } catch (error) {
            console.log(`  ❌ ${healthCheck.name} (error: ${error.message})`);
            allPassed = false;
            if (healthCheck.critical) {
                failures.push(healthCheck.name);
            }
        }
    }
    
    if (failures.length > 0) {
        throw new Error(`Critical system components failed: ${failures.join(', ')}`);
    }
    
    if (!allPassed) {
        console.log('⚠️  Some non-critical checks failed, but system should function');
    } else {
        console.log('✅ All system health checks passed');
    }
}
```

## Command Usage Examples

### 1. Basic System Update
```bash
# Check for and install Vibe system updates
/vibe-system-update

# This will:
# - Check for updates from official Vibe repo
# - Show summary of changes
# - Create system backup
# - Update all components
# - Validate system health
```

### 2. Update Options
```bash
# Check for updates without installing
/vibe-system-update --check

# Show what would be updated
/vibe-system-update --dry-run

# Force update with uncommitted changes
/vibe-system-update --force

# Update without backup (not recommended)
/vibe-system-update --backup=false
```

### 3. Selective Updates
```bash
# Update only agent files and templates
/vibe-system-update --agents-only

# Update only dependencies
/vibe-system-update --deps-only

# Update from development branch
/vibe-system-update --branch=development
```

## Integration with README

Now let me add this command to the README:

```bash
# Quick system update
/vibe-system-update

# Check what updates are available
/vibe-system-update --check
```

This ensures your Vibe Coding system stays current with the latest features, bug fixes, and agent improvements while maintaining the safety of your project data through automatic backups.