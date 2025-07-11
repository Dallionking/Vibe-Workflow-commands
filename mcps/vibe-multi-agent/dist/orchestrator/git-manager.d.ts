import { EventEmitter } from 'events';
import { GitWorktree, MergeResult } from '../common/types.js';
export declare class GitManager extends EventEmitter {
    private git;
    private config;
    private worktrees;
    private rootPath;
    constructor(config: any, rootPath?: string);
    private ensureWorktreeDirectory;
    createWorktree(agentId: string, branchName: string): Promise<GitWorktree>;
    removeWorktree(agentId: string): Promise<void>;
    cleanupWorktree(branchName: string): Promise<void>;
    cleanupAllWorktrees(): Promise<void>;
    mergeWorktree(sourceBranch: string, targetBranch: string, strategy?: 'merge' | 'rebase' | 'squash'): Promise<MergeResult>;
    private detectConflicts;
    resolveConflict(filePath: string, resolution: 'ours' | 'theirs' | 'manual'): Promise<void>;
    getCurrentBranch(): Promise<string>;
    listWorktrees(): Promise<GitWorktree[]>;
    getWorktreeStatus(agentId: string): Promise<any>;
    commitWorktreeChanges(agentId: string, message: string): Promise<string | null>;
    pushWorktreeBranch(agentId: string): Promise<void>;
    syncWorktreeWithMain(agentId: string): Promise<void>;
    lockWorktree(agentId: string): Promise<void>;
    unlockWorktree(agentId: string): Promise<void>;
    private ensureGitRepository;
    healthCheck(): Promise<{
        healthy: boolean;
        details: any;
    }>;
}
