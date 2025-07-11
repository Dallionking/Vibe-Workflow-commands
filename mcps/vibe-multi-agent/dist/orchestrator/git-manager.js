import { EventEmitter } from 'events';
import { simpleGit } from 'simple-git';
import { join } from 'path';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { sanitizeBranchName } from '../common/utils.js';
import { log } from '../common/logger.js';
export class GitManager extends EventEmitter {
    git;
    config;
    worktrees = new Map();
    rootPath;
    constructor(config, rootPath) {
        super();
        this.config = config;
        this.rootPath = rootPath || process.cwd();
        this.git = simpleGit(this.rootPath);
        this.ensureWorktreeDirectory();
    }
    ensureWorktreeDirectory() {
        const worktreePath = join(this.rootPath, this.config.git.worktreePath);
        if (!existsSync(worktreePath)) {
            mkdirSync(worktreePath, { recursive: true });
            log.info(`Created worktree directory: ${worktreePath}`);
        }
    }
    async createWorktree(agentId, branchName) {
        const sanitizedBranchName = sanitizeBranchName(branchName);
        const worktreePath = join(this.rootPath, this.config.git.worktreePath, sanitizedBranchName);
        try {
            // Ensure we're in a git repository
            await this.ensureGitRepository();
            // Create and checkout new branch from main
            await this.git.checkoutLocalBranch(sanitizedBranchName);
            // Create worktree
            await this.git.raw(['worktree', 'add', worktreePath, sanitizedBranchName]);
            const worktree = {
                path: worktreePath,
                branch: sanitizedBranchName,
                agentId,
                locked: false
            };
            this.worktrees.set(agentId, worktree);
            log.git.worktreeCreated(worktreePath, sanitizedBranchName, agentId);
            this.emit('worktree_created', worktree);
            return worktree;
        }
        catch (error) {
            log.error(`Failed to create worktree for agent ${agentId}:`, error);
            throw error;
        }
    }
    async removeWorktree(agentId) {
        const worktree = this.worktrees.get(agentId);
        if (!worktree)
            return;
        try {
            // Remove worktree
            await this.git.raw(['worktree', 'remove', worktree.path, '--force']);
            // Delete branch
            await this.git.branch(['-D', worktree.branch]);
            this.worktrees.delete(agentId);
            log.info(`Removed worktree for agent ${agentId}: ${worktree.path}`);
            this.emit('worktree_removed', worktree);
        }
        catch (error) {
            log.error(`Failed to remove worktree for agent ${agentId}:`, error);
            throw error;
        }
    }
    async cleanupWorktree(branchName) {
        const worktree = Array.from(this.worktrees.values()).find(w => w.branch === branchName);
        if (!worktree)
            return;
        try {
            // Force remove worktree directory if it exists
            if (existsSync(worktree.path)) {
                rmSync(worktree.path, { recursive: true, force: true });
            }
            // Clean up git worktree reference
            await this.git.raw(['worktree', 'prune']);
            // Remove branch if it exists
            try {
                await this.git.branch(['-D', worktree.branch]);
            }
            catch (error) {
                // Branch might not exist, ignore error
            }
            this.worktrees.delete(worktree.agentId);
            log.info(`Cleaned up worktree: ${worktree.path}`);
            this.emit('worktree_cleaned', worktree);
        }
        catch (error) {
            log.error(`Failed to cleanup worktree ${worktree.path}:`, error);
        }
    }
    async cleanupAllWorktrees() {
        const cleanupPromises = Array.from(this.worktrees.keys()).map(agentId => this.removeWorktree(agentId).catch(error => log.error(`Failed to cleanup worktree for agent ${agentId}:`, error)));
        await Promise.all(cleanupPromises);
        log.info('All worktrees cleaned up');
    }
    async mergeWorktree(sourceBranch, targetBranch, strategy = 'merge') {
        try {
            log.git.mergeStarted(sourceBranch, targetBranch);
            // Switch to target branch
            await this.git.checkout(targetBranch);
            // Pull latest changes
            await this.git.pull();
            let mergeCommit;
            switch (strategy) {
                case 'merge':
                    await this.git.merge([sourceBranch]);
                    const log = await this.git.log(['-1', '--pretty=format:%H']);
                    mergeCommit = log.latest?.hash;
                    break;
                case 'rebase':
                    await this.git.rebase([sourceBranch]);
                    const rebaseLog = await this.git.log(['-1', '--pretty=format:%H']);
                    mergeCommit = rebaseLog.latest?.hash;
                    break;
                case 'squash':
                    await this.git.merge([sourceBranch, '--squash']);
                    const commitResult = await this.git.commit(`Squash merge of ${sourceBranch}`);
                    mergeCommit = commitResult.commit;
                    break;
                default:
                    throw new Error(`Unknown merge strategy: ${strategy}`);
            }
            log.git.mergeCompleted(sourceBranch, targetBranch, mergeCommit || 'unknown');
            this.emit('merge_completed', { sourceBranch, targetBranch, mergeCommit });
            return {
                success: true,
                mergeCommit
            };
        }
        catch (error) {
            log.error(`Merge failed: ${sourceBranch} -> ${targetBranch}:`, error);
            // Check for conflicts
            const conflicts = await this.detectConflicts();
            if (conflicts.length > 0) {
                return {
                    success: false,
                    conflicts: conflicts.map(file => ({
                        file,
                        type: 'content',
                        details: `Merge conflict in ${file}`
                    }))
                };
            }
            return {
                success: false,
                error: error.message
            };
        }
    }
    async detectConflicts() {
        try {
            const status = await this.git.status();
            return status.conflicted || [];
        }
        catch (error) {
            log.error('Failed to detect conflicts:', error);
            return [];
        }
    }
    async resolveConflict(filePath, resolution) {
        try {
            switch (resolution) {
                case 'ours':
                    await this.git.raw(['checkout', '--ours', filePath]);
                    break;
                case 'theirs':
                    await this.git.raw(['checkout', '--theirs', filePath]);
                    break;
                case 'manual':
                    // Manual resolution - just add the file as resolved
                    await this.git.add(filePath);
                    break;
            }
            log.info(`Resolved conflict in ${filePath} using ${resolution} strategy`);
        }
        catch (error) {
            log.error(`Failed to resolve conflict in ${filePath}:`, error);
            throw error;
        }
    }
    async getCurrentBranch() {
        try {
            const branches = await this.git.branch();
            return branches.current;
        }
        catch (error) {
            log.error('Failed to get current branch:', error);
            return 'unknown';
        }
    }
    async listWorktrees() {
        return Array.from(this.worktrees.values());
    }
    async getWorktreeStatus(agentId) {
        const worktree = this.worktrees.get(agentId);
        if (!worktree)
            return null;
        try {
            const worktreeGit = simpleGit(worktree.path);
            const status = await worktreeGit.status();
            const log = await worktreeGit.log({ maxCount: 5 });
            return {
                worktree,
                status,
                recentCommits: log.all
            };
        }
        catch (error) {
            log.error(`Failed to get worktree status for agent ${agentId}:`, error);
            return null;
        }
    }
    async commitWorktreeChanges(agentId, message) {
        const worktree = this.worktrees.get(agentId);
        if (!worktree)
            return null;
        try {
            const worktreeGit = simpleGit(worktree.path);
            // Stage all changes
            await worktreeGit.add('.');
            // Commit changes
            const result = await worktreeGit.commit(message);
            // Update worktree info
            worktree.lastCommit = result.commit;
            log.info(`Committed changes in worktree for agent ${agentId}: ${result.commit}`);
            this.emit('worktree_committed', worktree, result.commit);
            return result.commit;
        }
        catch (error) {
            log.error(`Failed to commit worktree changes for agent ${agentId}:`, error);
            throw error;
        }
    }
    async pushWorktreeBranch(agentId) {
        const worktree = this.worktrees.get(agentId);
        if (!worktree)
            return;
        try {
            const worktreeGit = simpleGit(worktree.path);
            await worktreeGit.push('origin', worktree.branch);
            log.info(`Pushed branch ${worktree.branch} for agent ${agentId}`);
            this.emit('worktree_pushed', worktree);
        }
        catch (error) {
            log.error(`Failed to push worktree branch for agent ${agentId}:`, error);
            throw error;
        }
    }
    async syncWorktreeWithMain(agentId) {
        const worktree = this.worktrees.get(agentId);
        if (!worktree)
            return;
        try {
            const worktreeGit = simpleGit(worktree.path);
            // Fetch latest changes
            await worktreeGit.fetch();
            // Merge main into worktree branch
            await worktreeGit.merge(['origin/main']);
            log.info(`Synced worktree with main for agent ${agentId}`);
            this.emit('worktree_synced', worktree);
        }
        catch (error) {
            log.error(`Failed to sync worktree with main for agent ${agentId}:`, error);
            throw error;
        }
    }
    async lockWorktree(agentId) {
        const worktree = this.worktrees.get(agentId);
        if (!worktree)
            return;
        worktree.locked = true;
        this.worktrees.set(agentId, worktree);
        log.info(`Locked worktree for agent ${agentId}`);
        this.emit('worktree_locked', worktree);
    }
    async unlockWorktree(agentId) {
        const worktree = this.worktrees.get(agentId);
        if (!worktree)
            return;
        worktree.locked = false;
        this.worktrees.set(agentId, worktree);
        log.info(`Unlocked worktree for agent ${agentId}`);
        this.emit('worktree_unlocked', worktree);
    }
    async ensureGitRepository() {
        try {
            await this.git.status();
        }
        catch (error) {
            // Initialize git repository if it doesn't exist
            await this.git.init();
            // Create initial commit if needed
            const status = await this.git.status();
            if (status.isClean()) {
                // Create a .gitignore file
                const gitignorePath = join(this.rootPath, '.gitignore');
                if (!existsSync(gitignorePath)) {
                    await this.git.raw(['touch', '.gitignore']);
                    await this.git.add('.gitignore');
                    await this.git.commit('Initial commit');
                }
            }
            log.info('Initialized git repository');
        }
    }
    // Health check
    async healthCheck() {
        try {
            const status = await this.git.status();
            const worktrees = this.listWorktrees();
            // Check for orphaned worktrees
            const orphanedWorktrees = [];
            for (const worktree of await worktrees) {
                if (!existsSync(worktree.path)) {
                    orphanedWorktrees.push(worktree);
                }
            }
            return {
                healthy: orphanedWorktrees.length === 0,
                details: {
                    currentBranch: await this.getCurrentBranch(),
                    worktreeCount: this.worktrees.size,
                    gitStatus: {
                        modified: status.modified.length,
                        created: status.created.length,
                        deleted: status.deleted.length,
                        conflicted: status.conflicted.length
                    },
                    orphanedWorktrees
                }
            };
        }
        catch (error) {
            return {
                healthy: false,
                details: { error: error.message }
            };
        }
    }
}
//# sourceMappingURL=git-manager.js.map