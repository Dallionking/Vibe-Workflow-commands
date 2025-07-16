/**
 * Vibe Storage Manager
 * 
 * Enhanced SQLite storage for Vibe Coding multi-agent system
 * Extends claude-mailbox storage with Vibe-specific features
 */

import Database from 'better-sqlite3';
import path from 'path';
import { mkdir } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';

export class VibeStorageManager {
  constructor(dbPath = '/tmp/vibe-agent-bus.db') {
    this.dbPath = dbPath;
    this.db = null;
  }

  async initialize() {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.dbPath);
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }

      // Open database connection
      this.db = new Database(this.dbPath);
      
      // Enable WAL mode for better concurrency
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      
      // Create Vibe-enhanced tables
      this.createTables();
      
      console.error(`📚 Vibe Storage Manager initialized: ${this.dbPath}`);
    } catch (error) {
      console.error(`💥 Vibe Storage initialization error: ${error.message}`);
      throw error;
    }
  }

  createTables() {
    // Enhanced messages table with Vibe context
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vibe_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        agent TEXT,
        step TEXT,
        phase TEXT,
        priority TEXT DEFAULT 'normal',
        context JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Agent registry table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vibe_agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id TEXT UNIQUE NOT NULL,
        profile JSON NOT NULL,
        last_seen INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        terminal_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Agent memory table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vibe_agent_memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id TEXT NOT NULL,
        memory_type TEXT NOT NULL,
        content JSON NOT NULL,
        step TEXT,
        phase TEXT,
        utility_score REAL DEFAULT 1.0,
        last_accessed INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(agent_id, memory_type, step, phase)
      )
    `);

    // Project context table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vibe_project_context (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id TEXT DEFAULT 'default',
        current_step TEXT,
        current_phase TEXT,
        status TEXT DEFAULT 'active',
        context JSON,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Room metadata table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vibe_rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_name TEXT UNIQUE NOT NULL,
        room_type TEXT DEFAULT 'general',
        step_context TEXT,
        phase_context TEXT,
        metadata JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_vibe_messages_room_timestamp 
      ON vibe_messages (room, timestamp DESC)
    `);
    
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_vibe_messages_agent_step 
      ON vibe_messages (agent, step, timestamp DESC)
    `);

    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_vibe_agent_memory_access 
      ON vibe_agent_memory (agent_id, memory_type, last_accessed DESC)
    `);

    // Clean up old messages (older than 14 days for Vibe projects)
    const cleanupStmt = this.db.prepare(`
      DELETE FROM vibe_messages 
      WHERE timestamp < ?
    `);
    
    const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
    cleanupStmt.run(fourteenDaysAgo);

    // Initialize default project context if not exists
    this.initializeProjectContext();
  }

  initializeProjectContext() {
    const checkStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM vibe_project_context 
      WHERE project_id = 'default'
    `);
    
    const { count } = checkStmt.get();
    
    if (count === 0) {
      const insertStmt = this.db.prepare(`
        INSERT INTO vibe_project_context (project_id, current_step, status, context)
        VALUES (?, ?, ?, ?)
      `);
      
      insertStmt.run('default', 'initialization', 'active', JSON.stringify({
        created: Date.now(),
        vibeVersion: '2.1.0',
        features: ['enhanced-ultrathink', 'phase-modernization', 'multi-agent-v2']
      }));
    }
  }

  // Enhanced message posting with Vibe context
  async postVibeMessage(room, message, context = {}) {
    const timestamp = Date.now();
    
    const stmt = this.db.prepare(`
      INSERT INTO vibe_messages (room, message, timestamp, agent, step, phase, priority, context)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      room, 
      message, 
      timestamp, 
      context.agent || null,
      context.step || null,
      context.phase || null,
      context.priority || 'normal',
      JSON.stringify(context)
    );
    
    // Update room metadata
    await this.updateRoomMetadata(room, context);
    
    return { ok: true, timestamp, room, context };
  }

  async updateRoomMetadata(room, context) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO vibe_rooms (room_name, room_type, step_context, phase_context, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const roomType = this.determineRoomType(room, context);
    const metadata = {
      lastActivity: Date.now(),
      messageCount: this.getMessageCount(room),
      ...context
    };
    
    stmt.run(room, roomType, context.step, context.phase, JSON.stringify(metadata));
  }

  determineRoomType(room, context) {
    if (room.includes('step-')) return 'vibe-step';
    if (room.includes('phase-')) return 'vibe-phase';
    if (room.includes('ultrathink')) return 'ultrathink';
    if (room.includes('validation')) return 'qa-validation';
    if (context.step) return 'step-specific';
    return 'general';
  }

  getMessageCount(room) {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM vibe_messages WHERE room = ?
    `);
    return stmt.get(room).count;
  }

  // Enhanced message retrieval with filtering
  async getVibeMessages(room, options = {}) {
    let query = `
      SELECT message as msg, timestamp as ts, agent, step, phase, priority, context
      FROM vibe_messages
      WHERE room = ?
    `;
    const params = [room];
    
    // Add filters
    if (options.filter) {
      if (options.filter.includes('agent:')) {
        const agent = options.filter.replace('agent:', '');
        query += ' AND agent = ?';
        params.push(agent);
      } else if (options.filter.includes('step:')) {
        const step = options.filter.replace('step:', '');
        query += ' AND step = ?';
        params.push(step);
      } else if (options.filter.includes('priority:')) {
        const priority = options.filter.replace('priority:', '');
        query += ' AND priority = ?';
        params.push(priority);
      }
    }
    
    query += ' ORDER BY timestamp ASC';
    
    if (options.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }
    
    const stmt = this.db.prepare(query);
    const messages = stmt.all(...params);
    
    // Parse context JSON
    return messages.map(msg => ({
      ...msg,
      context: msg.context ? JSON.parse(msg.context) : {}
    }));
  }

  // Agent registration and management
  async registerAgent(agentId, profile) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO vibe_agents (agent_id, profile, last_seen, terminal_id)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(agentId, JSON.stringify(profile), Date.now(), profile.terminalId);
    
    return { agentId, registered: true, timestamp: Date.now() };
  }

  async getActiveAgents() {
    const stmt = this.db.prepare(`
      SELECT agent_id, profile, last_seen, status, terminal_id
      FROM vibe_agents
      WHERE status = 'active' AND last_seen > ?
      ORDER BY last_seen DESC
    `);
    
    // Consider agents active if seen in last 10 minutes
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    const agents = stmt.all(tenMinutesAgo);
    
    return agents.map(agent => ({
      ...agent,
      profile: JSON.parse(agent.profile)
    }));
  }

  // Agent memory management
  async saveAgentMemory(agentId, memoryType, content, context = {}) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO vibe_agent_memory 
      (agent_id, memory_type, content, step, phase, last_accessed)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      agentId,
      memoryType,
      JSON.stringify(content),
      context.step || null,
      context.phase || null,
      Date.now()
    );
    
    return { agentId, memoryType, saved: true, timestamp: Date.now() };
  }

  async loadAgentMemory(agentId, memoryType, context = {}) {
    let query = `
      SELECT content, step, phase, utility_score, last_accessed, created_at
      FROM vibe_agent_memory
      WHERE agent_id = ? AND memory_type = ?
    `;
    const params = [agentId, memoryType];
    
    if (context.step) {
      query += ' AND step = ?';
      params.push(context.step);
    }
    
    if (context.phase) {
      query += ' AND phase = ?';
      params.push(context.phase);
    }
    
    query += ' ORDER BY last_accessed DESC LIMIT 1';
    
    const stmt = this.db.prepare(query);
    const memory = stmt.get(...params);
    
    if (!memory) return null;
    
    // Update last accessed time
    const updateStmt = this.db.prepare(`
      UPDATE vibe_agent_memory 
      SET last_accessed = ?
      WHERE agent_id = ? AND memory_type = ?
    `);
    updateStmt.run(Date.now(), agentId, memoryType);
    
    return {
      ...memory,
      content: JSON.parse(memory.content)
    };
  }

  // Project context management
  async updateProjectContext(step, phase, context = {}) {
    const stmt = this.db.prepare(`
      UPDATE vibe_project_context 
      SET current_step = ?, current_phase = ?, context = ?, updated_at = CURRENT_TIMESTAMP
      WHERE project_id = 'default'
    `);
    
    stmt.run(step, phase, JSON.stringify(context));
    
    return { step, phase, updated: true };
  }

  async getProjectContext() {
    const stmt = this.db.prepare(`
      SELECT current_step, current_phase, status, context, updated_at
      FROM vibe_project_context
      WHERE project_id = 'default'
    `);
    
    const result = stmt.get();
    
    if (!result) return null;
    
    return {
      ...result,
      context: result.context ? JSON.parse(result.context) : {}
    };
  }

  // Room management with Vibe intelligence
  async listVibeRooms() {
    const stmt = this.db.prepare(`
      SELECT 
        r.room_name,
        r.room_type,
        r.step_context,
        r.phase_context,
        r.metadata,
        COUNT(m.id) as messageCount,
        MAX(m.timestamp) as lastMessage
      FROM vibe_rooms r
      LEFT JOIN vibe_messages m ON r.room_name = m.room
      GROUP BY r.room_name
      ORDER BY lastMessage DESC NULLS LAST
    `);
    
    const rooms = stmt.all();
    
    return {
      rooms: rooms.map(room => ({
        ...room,
        metadata: room.metadata ? JSON.parse(room.metadata) : {}
      })),
      totalRooms: rooms.length
    };
  }

  // Legacy compatibility methods
  async postMessage(room, msg) {
    return await this.postVibeMessage(room, msg);
  }

  async getMessages(room) {
    const messages = await this.getVibeMessages(room);
    return messages.map(msg => ({ msg: msg.msg, ts: msg.ts }));
  }

  async getRecentMessage(room) {
    const stmt = this.db.prepare(`
      SELECT message as msg, timestamp as ts
      FROM vibe_messages
      WHERE room = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `);
    
    const message = stmt.get(room);
    const count = this.getMessageCount(room);
    
    return {
      message: message || null,
      totalCount: count,
      messageNumber: message ? count : 0
    };
  }

  async clearRoom(room) {
    const stmt = this.db.prepare(`
      DELETE FROM vibe_messages WHERE room = ?
    `);
    
    const info = stmt.run(room);
    
    return {
      ok: true,
      messagesCleared: info.changes
    };
  }

  async listRooms() {
    return await this.listVibeRooms();
  }

  async shutdown() {
    if (this.db) {
      console.error("💾 Saving Vibe Storage state...");
      this.db.close();
      this.db = null;
    }
  }
}

export default VibeStorageManager;