/**
 * Context Manager for Multi-Agent Message Bus
 * Implements context engineering strategies for better agent coordination
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';

class ContextManager {
  constructor(baseDir = '/tmp/claude-context') {
    this.baseDir = baseDir;
    this.memoryDir = path.join(baseDir, 'memory');
    this.profilesDir = path.join(baseDir, 'profiles');
    this.threadsDir = path.join(baseDir, 'threads');
    this.compressionThreshold = 50; // messages before compression
    this.retentionDays = 7; // days to keep compressed contexts
  }

  async initialize() {
    // Create directory structure
    for (const dir of [this.baseDir, this.memoryDir, this.profilesDir, this.threadsDir]) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
  }

  // === WRITE STRATEGY: Persistent Memory ===
  
  /**
   * Save agent's scratchpad/working memory
   */
  async saveAgentMemory(agentId, memoryType, content) {
    const memoryFile = path.join(this.memoryDir, `${agentId}_${memoryType}.json`);
    const memory = {
      agentId,
      type: memoryType,
      content,
      timestamp: Date.now(),
      lastAccessed: Date.now()
    };
    
    await writeFile(memoryFile, JSON.stringify(memory, null, 2));
    return memory;
  }

  /**
   * Load agent's memory
   */
  async loadAgentMemory(agentId, memoryType) {
    const memoryFile = path.join(this.memoryDir, `${agentId}_${memoryType}.json`);
    
    if (!existsSync(memoryFile)) {
      return null;
    }
    
    const data = await readFile(memoryFile, 'utf8');
    const memory = JSON.parse(data);
    
    // Update last accessed time
    memory.lastAccessed = Date.now();
    await writeFile(memoryFile, JSON.stringify(memory, null, 2));
    
    return memory;
  }

  /**
   * List all memories for an agent
   */
  async listAgentMemories(agentId) {
    const files = await readdir(this.memoryDir);
    const agentFiles = files.filter(f => f.startsWith(`${agentId}_`));
    
    const memories = [];
    for (const file of agentFiles) {
      const data = await readFile(path.join(this.memoryDir, file), 'utf8');
      memories.push(JSON.parse(data));
    }
    
    return memories.sort((a, b) => b.lastAccessed - a.lastAccessed);
  }

  // === COMPRESS STRATEGY: Summarization ===
  
  /**
   * Compress messages in a room when they exceed threshold
   */
  async compressRoomContext(room, messages) {
    if (messages.length < this.compressionThreshold) {
      return null;
    }
    
    // Group messages by time windows (e.g., hourly)
    const hourlyGroups = this.groupMessagesByHour(messages);
    
    const summary = {
      room,
      originalCount: messages.length,
      compressed: true,
      startTime: messages[0].ts,
      endTime: messages[messages.length - 1].ts,
      hourlyBreakdown: []
    };
    
    for (const [hour, msgs] of Object.entries(hourlyGroups)) {
      const agents = [...new Set(msgs.map(m => this.extractAgent(m.msg)))];
      const topics = this.extractTopics(msgs);
      
      summary.hourlyBreakdown.push({
        hour,
        messageCount: msgs.length,
        agents: agents.filter(a => a),
        topics,
        keyMessages: this.selectKeyMessages(msgs)
      });
    }
    
    // Save compressed context
    const summaryFile = path.join(
      this.threadsDir, 
      `${room}_summary_${Date.now()}.json`
    );
    await writeFile(summaryFile, JSON.stringify(summary, null, 2));
    
    return summary;
  }

  /**
   * Group messages by hour
   */
  groupMessagesByHour(messages) {
    const groups = {};
    
    for (const msg of messages) {
      const hour = new Date(msg.ts).toISOString().slice(0, 13);
      if (!groups[hour]) groups[hour] = [];
      groups[hour].push(msg);
    }
    
    return groups;
  }

  /**
   * Extract agent name from message
   */
  extractAgent(message) {
    const match = message.match(/Message for (\w+):/);
    return match ? match[1] : null;
  }

  /**
   * Extract topics from messages (simple keyword extraction)
   */
  extractTopics(messages) {
    const keywords = new Set();
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    
    for (const msg of messages) {
      const words = msg.msg.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 4 && !commonWords.has(word)) {
          keywords.add(word);
        }
      }
    }
    
    return Array.from(keywords).slice(0, 10);
  }

  /**
   * Select key messages based on patterns
   */
  selectKeyMessages(messages) {
    const keyPatterns = [
      /complete|done|finish/i,
      /error|fail|issue/i,
      /start|begin|implement/i,
      /question|help|\?/i,
      /important|critical|urgent/i
    ];
    
    return messages
      .filter(msg => keyPatterns.some(pattern => pattern.test(msg.msg)))
      .slice(0, 5)
      .map(msg => ({
        ts: msg.ts,
        preview: msg.msg.slice(0, 100) + (msg.msg.length > 100 ? '...' : '')
      }));
  }

  // === SELECT STRATEGY: Agent Profiles & Procedural Memory ===
  
  /**
   * Save agent profile with capabilities and instructions
   */
  async saveAgentProfile(agentId, profile) {
    const profileFile = path.join(this.profilesDir, `${agentId}.json`);
    const fullProfile = {
      agentId,
      ...profile,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };
    
    await writeFile(profileFile, JSON.stringify(fullProfile, null, 2));
    return fullProfile;
  }

  /**
   * Load agent profile
   */
  async loadAgentProfile(agentId) {
    const profileFile = path.join(this.profilesDir, `${agentId}.json`);
    
    if (!existsSync(profileFile)) {
      return null;
    }
    
    const data = await readFile(profileFile, 'utf8');
    return JSON.parse(data);
  }

  /**
   * Match agents based on task requirements
   */
  async findAgentsForTask(taskRequirements) {
    const files = await readdir(this.profilesDir);
    const matches = [];
    
    for (const file of files) {
      const data = await readFile(path.join(this.profilesDir, file), 'utf8');
      const profile = JSON.parse(data);
      
      const score = this.calculateMatchScore(profile, taskRequirements);
      if (score > 0) {
        matches.push({ profile, score });
      }
    }
    
    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate how well an agent matches task requirements
   */
  calculateMatchScore(profile, requirements) {
    let score = 0;
    
    if (profile.capabilities) {
      for (const capability of profile.capabilities) {
        if (requirements.needed && requirements.needed.includes(capability)) {
          score += 2;
        }
        if (requirements.preferred && requirements.preferred.includes(capability)) {
          score += 1;
        }
      }
    }
    
    if (profile.specializations) {
      for (const spec of profile.specializations) {
        if (requirements.domain === spec) {
          score += 3;
        }
      }
    }
    
    return score;
  }

  // === ISOLATE STRATEGY: Threading & Context Boundaries ===
  
  /**
   * Create a new thread for isolated context
   */
  async createThread(threadId, metadata) {
    const thread = {
      id: threadId || crypto.randomUUID(),
      createdAt: Date.now(),
      metadata,
      messages: [],
      participants: [],
      status: 'active'
    };
    
    const threadFile = path.join(this.threadsDir, `thread_${thread.id}.json`);
    await writeFile(threadFile, JSON.stringify(thread, null, 2));
    
    return thread;
  }

  /**
   * Add message to thread
   */
  async addToThread(threadId, message, agentId) {
    const threadFile = path.join(this.threadsDir, `thread_${threadId}.json`);
    
    if (!existsSync(threadFile)) {
      throw new Error(`Thread ${threadId} not found`);
    }
    
    const data = await readFile(threadFile, 'utf8');
    const thread = JSON.parse(data);
    
    thread.messages.push({
      ...message,
      agentId,
      addedAt: Date.now()
    });
    
    if (!thread.participants.includes(agentId)) {
      thread.participants.push(agentId);
    }
    
    thread.lastActivity = Date.now();
    
    await writeFile(threadFile, JSON.stringify(thread, null, 2));
    return thread;
  }

  /**
   * Get thread context
   */
  async getThreadContext(threadId, options = {}) {
    const threadFile = path.join(this.threadsDir, `thread_${threadId}.json`);
    
    if (!existsSync(threadFile)) {
      return null;
    }
    
    const data = await readFile(threadFile, 'utf8');
    const thread = JSON.parse(data);
    
    // Apply filters if provided
    if (options.afterTimestamp) {
      thread.messages = thread.messages.filter(m => m.addedAt > options.afterTimestamp);
    }
    
    if (options.agentId) {
      thread.messages = thread.messages.filter(m => m.agentId === options.agentId);
    }
    
    return thread;
  }

  // === UTILITY-BASED RETENTION ===
  
  /**
   * Clean up old contexts based on utility scores
   */
  async cleanupOldContexts() {
    const now = Date.now();
    const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;
    
    // Clean up old memories
    const memoryFiles = await readdir(this.memoryDir);
    for (const file of memoryFiles) {
      const data = await readFile(path.join(this.memoryDir, file), 'utf8');
      const memory = JSON.parse(data);
      
      const utility = this.calculateUtility(memory);
      
      if (utility < 0.1 && (now - memory.lastAccessed) > retentionMs) {
        await unlink(path.join(this.memoryDir, file));
      }
    }
    
    // Clean up old threads
    const threadFiles = await readdir(this.threadsDir);
    for (const file of threadFiles) {
      if (!file.startsWith('thread_')) continue;
      
      const data = await readFile(path.join(this.threadsDir, file), 'utf8');
      const thread = JSON.parse(data);
      
      if (thread.status === 'completed' && (now - thread.lastActivity) > retentionMs) {
        await unlink(path.join(this.threadsDir, file));
      }
    }
  }

  /**
   * Calculate utility score for memory
   */
  calculateUtility(memory) {
    const now = Date.now();
    const age = now - memory.timestamp;
    const accessRecency = now - memory.lastAccessed;
    
    // Factors that increase utility:
    // - Recent access
    // - Type importance (procedural > episodic > scratch)
    // - Frequency of access (if tracked)
    
    let utility = 1.0;
    
    // Decay based on access recency
    utility *= Math.exp(-accessRecency / (7 * 24 * 60 * 60 * 1000)); // 7-day half-life
    
    // Type weighting
    const typeWeights = {
      procedural: 2.0,
      plan: 1.5,
      episodic: 1.0,
      scratch: 0.5
    };
    
    utility *= typeWeights[memory.type] || 1.0;
    
    return utility;
  }
}

// Helper function to import readdir and unlink
import { readdir, unlink } from 'fs/promises';

export default ContextManager;