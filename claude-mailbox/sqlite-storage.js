/**
 * SQLite Storage for Message Bus
 * Provides reliable cross-process message storage
 */

import Database from 'better-sqlite3';
import path from 'path';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

class SQLiteStorage {
  constructor(dbPath = '/tmp/claude-message-bus.db') {
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
      
      // Create tables if they don't exist
      this.createTables();
      
      console.error(`SQLite storage initialized: ${this.dbPath}`);
    } catch (error) {
      console.error(`SQLite initialization error: ${error.message}`);
      throw error;
    }
  }

  createTables() {
    // Messages table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index separately
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_room_timestamp 
      ON messages (room, timestamp DESC)
    `);

    // Clean up old messages (older than 7 days)
    const cleanupStmt = this.db.prepare(`
      DELETE FROM messages 
      WHERE timestamp < ?
    `);
    
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    cleanupStmt.run(sevenDaysAgo);
  }

  async postMessage(room, message) {
    const timestamp = Date.now();
    
    const stmt = this.db.prepare(`
      INSERT INTO messages (room, message, timestamp)
      VALUES (?, ?, ?)
    `);
    
    stmt.run(room, message, timestamp);
    
    return { ok: true, timestamp };
  }

  async getMessages(room) {
    const stmt = this.db.prepare(`
      SELECT message as msg, timestamp as ts
      FROM messages
      WHERE room = ?
      ORDER BY timestamp ASC
    `);
    
    return stmt.all(room);
  }

  async getRecentMessage(room) {
    const stmt = this.db.prepare(`
      SELECT message as msg, timestamp as ts
      FROM messages
      WHERE room = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `);
    
    const message = stmt.get(room);
    
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM messages
      WHERE room = ?
    `);
    
    const { count } = countStmt.get(room);
    
    return {
      message: message || null,
      totalCount: count
    };
  }

  async clearRoom(room) {
    const stmt = this.db.prepare(`
      DELETE FROM messages
      WHERE room = ?
    `);
    
    const info = stmt.run(room);
    
    return {
      ok: true,
      messagesCleared: info.changes
    };
  }

  async listRooms() {
    const stmt = this.db.prepare(`
      SELECT 
        room,
        COUNT(*) as messageCount,
        MAX(timestamp) as lastMessage
      FROM messages
      GROUP BY room
      ORDER BY lastMessage DESC
    `);
    
    const rooms = stmt.all();
    
    return {
      rooms,
      totalRooms: rooms.length
    };
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export default SQLiteStorage;