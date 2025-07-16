import { readFile, writeFile, access, watch } from 'fs/promises';
import { constants } from 'fs';
import { watchFile, unwatchFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

class MessageStorage {
  constructor(filePath = process.env.STORAGE_FILE || '/tmp/claude-message-bus.json') {
    this.filePath = filePath;
    this.data = {};
    this.saveTimeout = null;
    this.TTL_MS = 24 * 60 * 60 * 1000; // 1 day
    this.lockFile = `${this.filePath}.lock`;
    this.isLocked = false;
    this.lastModified = 0;
    this.watchingFile = false;
  }

  async initialize() {
    try {
      await this.mergeWithDisk();
      this.startFileWatcher();
      console.error(`Shared storage initialized: ${this.filePath}`);
    } catch (error) {
      console.error(`Storage initialization error: ${error.message}`);
      this.data = {};
    }
  }

  startFileWatcher() {
    if (this.watchingFile) return;
    
    this.watchingFile = true;
    watchFile(this.filePath, { interval: 500 }, async (curr, prev) => {
      // Only reload if file was modified by another process
      if (curr.mtime.getTime() !== this.lastModified && curr.mtime > prev.mtime) {
        console.error('Storage file changed by another process, reloading...');
        await this.load();
      }
    });
    
    console.error('File watcher started for shared storage');
  }

  stopFileWatcher() {
    if (this.watchingFile) {
      unwatchFile(this.filePath);
      this.watchingFile = false;
      console.error('File watcher stopped');
    }
  }

  async acquireLock(timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        // Try to create lock file
        await writeFile(this.lockFile, process.pid.toString(), { flag: 'wx' });
        this.isLocked = true;
        return true;
      } catch (error) {
        if (error.code === 'EEXIST') {
          // Lock file exists, check if process is still alive
          try {
            const lockContent = await readFile(this.lockFile, 'utf8');
            const lockPid = parseInt(lockContent);
            
            // Check if process is still running
            try {
              process.kill(lockPid, 0); // Signal 0 checks if process exists
              // Process exists, wait and retry
              await sleep(100);
              continue;
            } catch (killError) {
              // Process doesn't exist, remove stale lock
              console.error(`Removing stale lock file from PID ${lockPid}`);
              await this.releaseLock();
              continue;
            }
          } catch (readError) {
            // Can't read lock file, assume it's stale
            await this.releaseLock();
            continue;
          }
        } else {
          throw error;
        }
      }
    }
    
    throw new Error(`Failed to acquire lock within ${timeout}ms`);
  }

  async releaseLock() {
    if (this.isLocked) {
      try {
        await access(this.lockFile, constants.F_OK);
        await writeFile(this.lockFile, '', { flag: 'w' }); // Clear the file first
        // Remove lock file by writing empty and deleting
        const fs = await import('fs');
        fs.unlinkSync(this.lockFile);
        this.isLocked = false;
      } catch (error) {
        // Lock file might not exist, that's fine
        this.isLocked = false;
      }
    }
  }

  async load() {
    try {
      // Check if file exists
      await access(this.filePath, constants.F_OK);
      
      const content = await readFile(this.filePath, 'utf8');
      const stats = await import('fs').then(fs => fs.promises.stat(this.filePath));
      this.lastModified = stats.mtime.getTime();
      
      const parsed = JSON.parse(content);
      
      // Validate structure
      if (typeof parsed === 'object' && parsed !== null) {
        this.data = parsed;
        console.error(`Loaded ${Object.keys(this.data).length} rooms from shared storage`);
      } else {
        throw new Error('Invalid JSON structure');
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error('Shared storage file does not exist, starting with empty storage');
        this.data = {};
        this.lastModified = 0;
      } else {
        console.error(`Error loading storage: ${error.message}`);
        // Backup corrupted file and start fresh
        if (error.name === 'SyntaxError') {
          await this.backupCorruptedFile();
        }
        this.data = {};
        this.lastModified = 0;
      }
    }
  }

  async mergeWithDisk() {
    try {
      // Check if file exists
      await access(this.filePath, constants.F_OK);
      
      const content = await readFile(this.filePath, 'utf8');
      const stats = await import('fs').then(fs => fs.promises.stat(this.filePath));
      
      const diskData = JSON.parse(content);
      
      if (typeof diskData === 'object' && diskData !== null) {
        // Merge disk data with in-memory data
        for (const room in diskData) {
          if (!this.data[room]) {
            this.data[room] = [];
          }
          // Add any messages from disk that aren't already in memory
          for (const diskMessage of diskData[room]) {
            const exists = this.data[room].some(msg => msg.ts === diskMessage.ts && msg.msg === diskMessage.msg);
            if (!exists) {
              this.data[room].push(diskMessage);
            }
          }
          // Sort by timestamp
          this.data[room].sort((a, b) => a.ts - b.ts);
        }
        
        this.lastModified = stats.mtime.getTime();
        console.error(`Merged data from disk: ${Object.keys(diskData).length} rooms`);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, nothing to merge
        console.error('No existing file to merge with');
      } else {
        console.error(`Error merging with disk: ${error.message}`);
      }
    }
  }

  async backupCorruptedFile() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${this.filePath}.backup-${timestamp}`;
      const content = await readFile(this.filePath, 'utf8');
      await writeFile(backupPath, content);
      console.error(`Corrupted file backed up to: ${backupPath}`);
    } catch (backupError) {
      console.error(`Failed to backup corrupted file: ${backupError.message}`);
    }
  }

  async save(immediate = false) {
    // Debounced save - prevents excessive I/O
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    const doSave = async () => {
      try {
        // Acquire lock before saving
        await this.acquireLock();
        
        // Merge with any changes from other processes
        await this.mergeWithDisk();
        
        // Clean expired messages before saving
        this.cleanExpiredMessages();
        
        // Atomic write: write to temp file, then rename
        const tempPath = `${this.filePath}.tmp`;
        const content = JSON.stringify(this.data, null, 2);
        
        await writeFile(tempPath, content, 'utf8');
        await writeFile(this.filePath, content, 'utf8');
        
        // Update our last modified time
        const stats = await import('fs').then(fs => fs.promises.stat(this.filePath));
        this.lastModified = stats.mtime.getTime();
        
        console.error(`Shared storage saved: ${Object.keys(this.data).length} rooms`);
      } catch (error) {
        console.error(`Error saving storage: ${error.message}`);
      } finally {
        await this.releaseLock();
      }
    };

    if (immediate) {
      await doSave();
    } else {
      this.saveTimeout = setTimeout(doSave, 1000); // Save after 1 second delay
    }
  }

  cleanExpiredMessages() {
    const now = Date.now();
    let cleanedRooms = 0;
    let cleanedMessages = 0;

    for (const room in this.data) {
      const originalLength = this.data[room].length;
      this.data[room] = this.data[room].filter(msg => (now - msg.ts) < this.TTL_MS);
      
      const newLength = this.data[room].length;
      cleanedMessages += (originalLength - newLength);

      if (this.data[room].length === 0) {
        delete this.data[room];
        cleanedRooms++;
      }
    }

    if (cleanedMessages > 0 || cleanedRooms > 0) {
      console.error(`Cleaned ${cleanedMessages} expired messages from ${cleanedRooms} rooms`);
    }
  }

  async postMessage(room, message) {
    // Note: merging with disk happens in save() method
    
    if (!this.data[room]) {
      this.data[room] = [];
    }

    const messageObj = {
      ts: Date.now(),
      msg: message
    };

    this.data[room].push(messageObj);
    
    // Save to disk (debounced)
    await this.save();
    
    return messageObj;
  }

  async getMessages(room) {
    // Merge with any changes from disk without losing in-memory data
    await this.mergeWithDisk();
    this.cleanExpiredMessages();
    return this.data[room] || [];
  }

  async getRecentMessage(room) {
    // Merge with any changes from disk without losing in-memory data
    await this.mergeWithDisk();
    this.cleanExpiredMessages();
    const messages = this.data[room] || [];
    const totalCount = messages.length;
    
    if (totalCount === 0) {
      return { message: null, totalCount: 0 };
    }
    
    // Return the most recent message (last in array) with metadata
    return {
      message: messages[totalCount - 1],
      totalCount: totalCount,
      messageNumber: totalCount
    };
  }

  async clearRoom(room) {
    // Merge with disk before clearing
    await this.mergeWithDisk();
    
    if (this.data[room]) {
      const messageCount = this.data[room].length;
      delete this.data[room];
      await this.save(true); // Immediate save
      return messageCount;
    }
    return 0;
  }

  async listRooms() {
    // Merge with disk before listing
    await this.mergeWithDisk();
    this.cleanExpiredMessages();
    return Object.keys(this.data).map(room => ({
      room,
      messageCount: this.data[room].length,
      lastMessage: this.data[room].length > 0 ? 
        this.data[room][this.data[room].length - 1].ts : null
    }));
  }

  async shutdown() {
    // Stop file watcher
    this.stopFileWatcher();
    
    // Clear any pending save timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // Force immediate save on shutdown
    await this.save(true);
    
    // Release any remaining lock
    await this.releaseLock();
    
    console.error('Shared storage shutdown complete');
  }
}

export default MessageStorage;