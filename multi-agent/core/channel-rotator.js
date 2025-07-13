const fs = require('fs').promises;
const path = require('path');
const contextManager = require('./context-manager');

class ChannelRotator {
    constructor() {
        this.config = {
            maxLines: 1000,              // Rotate after 1000 lines
            maxSizeKB: 500,              // Rotate after 500KB
            archiveRetention: 30,        // Keep archives for 30 days
            compressionEnabled: true,
            channelNaming: 'sequential'  // or 'timestamp'
        };
        
        this.currentChannel = 'channel.md';
        this.channelIndex = 1;
        this.lineCount = 0;
    }

    async checkRotation() {
        const channelPath = path.join(process.cwd(), '.workflow', 'context', this.currentChannel);
        
        try {
            const stats = await fs.stat(channelPath);
            const content = await fs.readFile(channelPath, 'utf8');
            const lines = content.split('\n').length;
            const sizeKB = stats.size / 1024;
            
            this.lineCount = lines;
            
            // Check if rotation needed
            if (lines > this.config.maxLines || sizeKB > this.config.maxSizeKB) {
                await this.rotateChannel();
                return true;
            }
        } catch (error) {
            // Channel doesn't exist yet
        }
        
        return false;
    }

    async rotateChannel() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const phase = await this.getCurrentPhase();
        
        // Archive current channel
        const archiveName = `channel-${phase}-${this.channelIndex}-${timestamp}.md`;
        const archivePath = path.join(process.cwd(), '.workflow', 'archives', phase, archiveName);
        
        await fs.mkdir(path.dirname(archivePath), { recursive: true });
        
        // Copy current channel to archive
        const currentPath = path.join(process.cwd(), '.workflow', 'context', this.currentChannel);
        await fs.copyFile(currentPath, archivePath);
        
        // Compress if enabled
        if (this.config.compressionEnabled) {
            await this.compressArchive(archivePath);
        }
        
        // Create new channel with rotation notice
        const newChannelContent = `# Agent Communication Channel - Rotation ${this.channelIndex + 1}

## Previous Channel
- Archived to: ${archiveName}
- Lines: ${this.lineCount}
- Phase: ${phase}
- Rotated at: ${new Date().toISOString()}

## Active Agents
Carried over from previous channel

## Messages
<!-- Agents will append their messages below -->

---

### [${new Date().toISOString()}] orchestrator
**Type:** channel-rotation
**Target:** all-agents

Channel rotated. Previous channel archived to ${archiveName}.
All agents should continue normal operations.

---
`;
        
        await fs.writeFile(currentPath, newChannelContent);
        
        // Notify all agents
        await this.notifyRotation(archiveName);
        
        this.channelIndex++;
        this.lineCount = 0;
    }

    async getCurrentPhase() {
        try {
            const statusPath = path.join(process.cwd(), '.vibe-status.md');
            const status = await fs.readFile(statusPath, 'utf8');
            const phaseMatch = status.match(/Current Phase:\s*(\d+)/);
            return phaseMatch ? `phase-${phaseMatch[1]}` : 'phase-unknown';
        } catch (error) {
            return 'phase-unknown';
        }
    }

    async compressArchive(archivePath) {
        const zlib = require('zlib');
        const { pipeline } = require('stream/promises');
        const { createReadStream, createWriteStream } = require('fs');
        
        const gzipPath = `${archivePath}.gz`;
        
        await pipeline(
            createReadStream(archivePath),
            zlib.createGzip(),
            createWriteStream(gzipPath)
        );
        
        // Remove uncompressed file
        await fs.unlink(archivePath);
    }

    async notifyRotation(archiveName) {
        // This will be picked up by all monitoring agents
        const notification = {
            type: 'system-notification',
            event: 'channel-rotated',
            archive: archiveName,
            newChannelIndex: this.channelIndex
        };
        
        // Agents will automatically pick up the new channel
    }

    async getArchives(phase = null) {
        const archiveDir = path.join(process.cwd(), '.workflow', 'archives');
        const archives = [];
        
        try {
            const phases = phase ? [phase] : await fs.readdir(archiveDir);
            
            for (const p of phases) {
                const phaseDir = path.join(archiveDir, p);
                const files = await fs.readdir(phaseDir);
                
                for (const file of files) {
                    if (file.startsWith('channel-')) {
                        archives.push({
                            phase: p,
                            file: file,
                            path: path.join(phaseDir, file)
                        });
                    }
                }
            }
        } catch (error) {
            // No archives yet
        }
        
        return archives;
    }

    async searchAcrossChannels(searchTerm, options = {}) {
        const results = [];
        
        // Search current channel
        const currentPath = path.join(process.cwd(), '.workflow', 'context', this.currentChannel);
        try {
            const content = await fs.readFile(currentPath, 'utf8');
            const matches = this.searchInContent(content, searchTerm, 'current');
            results.push(...matches);
        } catch (error) {
            // Current channel doesn't exist
        }
        
        // Search archives
        const archives = await this.getArchives(options.phase);
        for (const archive of archives) {
            try {
                let content;
                if (archive.file.endsWith('.gz')) {
                    // Decompress and search
                    content = await this.decompressAndRead(archive.path);
                } else {
                    content = await fs.readFile(archive.path, 'utf8');
                }
                
                const matches = this.searchInContent(content, searchTerm, archive.file);
                results.push(...matches);
            } catch (error) {
                // Skip failed archives
            }
        }
        
        return results;
    }

    searchInContent(content, searchTerm, source) {
        const lines = content.split('\n');
        const matches = [];
        
        lines.forEach((line, index) => {
            if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
                matches.push({
                    source,
                    line: index + 1,
                    content: line.trim()
                });
            }
        });
        
        return matches;
    }

    async decompressAndRead(gzipPath) {
        const zlib = require('zlib');
        const compressedData = await fs.readFile(gzipPath);
        const decompressed = zlib.gunzipSync(compressedData);
        return decompressed.toString('utf8');
    }

    async cleanupOldArchives() {
        const archives = await this.getArchives();
        const now = Date.now();
        const retentionMs = this.config.archiveRetention * 24 * 60 * 60 * 1000;
        
        for (const archive of archives) {
            const stats = await fs.stat(archive.path);
            if (now - stats.mtime.getTime() > retentionMs) {
                await fs.unlink(archive.path);
                console.log(`Cleaned up old archive: ${archive.file}`);
            }
        }
    }
}

module.exports = new ChannelRotator();