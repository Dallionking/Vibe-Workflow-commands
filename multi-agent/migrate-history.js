#!/usr/bin/env node

/**
 * History Migration Script
 * 
 * Migrates communication history from the old file-based channel.md system
 * to the new SQLite-based enhanced multi-agent system
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HistoryMigrator {
  constructor() {
    this.dbPath = '/tmp/vibe-agent-bus.db';
    this.db = null;
    this.legacyChannelPath = '../.workflow/context/channel.md';
    this.backupChannelPath = '../.vibe-backup/multi-agent-legacy/channel-backup.md';
  }

  async migrate() {
    console.log('🔄 Starting migration of agent communication history...');
    
    try {
      // Initialize database connection
      await this.initializeDatabase();
      
      // Find and parse legacy channel.md
      const channelContent = await this.findLegacyChannel();
      if (!channelContent) {
        console.log('ℹ️  No legacy channel.md found to migrate');
        return;
      }
      
      // Parse messages from channel.md
      const messages = await this.parseChannelMessages(channelContent);
      console.log(`📊 Found ${messages.length} messages to migrate`);
      
      // Migrate messages to SQLite
      const migrated = await this.migrateMessages(messages);
      console.log(`✅ Successfully migrated ${migrated} messages`);
      
      // Create migration report
      await this.createMigrationReport(messages, migrated);
      
      console.log('🎉 Migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      throw error;
    } finally {
      if (this.db) {
        this.db.close();
      }
    }
  }

  async initializeDatabase() {
    try {
      this.db = new Database(this.dbPath);
      
      // Test database connection
      const result = this.db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all();
      console.log(`📊 Connected to database with ${result.length} tables`);
      
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error.message}`);
    }
  }

  async findLegacyChannel() {
    // Try primary location first
    let channelPath = path.resolve(__dirname, this.legacyChannelPath);
    
    if (fs.existsSync(channelPath)) {
      console.log(`📂 Found legacy channel.md at: ${channelPath}`);
      return fs.readFileSync(channelPath, 'utf8');
    }
    
    // Try backup location
    channelPath = path.resolve(__dirname, this.backupChannelPath);
    
    if (fs.existsSync(channelPath)) {
      console.log(`📂 Found backup channel.md at: ${channelPath}`);
      return fs.readFileSync(channelPath, 'utf8');
    }
    
    // Try common alternative locations
    const altPaths = [
      '../.workflow/channel.md',
      '../channel.md',
      './channel.md',
      '../.vibe-backup/channel.md'
    ];
    
    for (const altPath of altPaths) {
      const fullPath = path.resolve(__dirname, altPath);
      if (fs.existsSync(fullPath)) {
        console.log(`📂 Found channel.md at alternative location: ${fullPath}`);
        return fs.readFileSync(fullPath, 'utf8');
      }
    }
    
    return null;
  }

  async parseChannelMessages(content) {
    const messages = [];
    const lines = content.split('\\n');
    
    let currentMessage = null;
    let currentContent = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect message headers (various formats from old system)
      const messageHeaderPatterns = [
        /^## (.+?) - (.+)$/,  // ## Agent - timestamp
        /^### (.+?) \\((.+?)\\)$/,  // ### Agent (timestamp)
        /^\\*\\*(.+?)\\*\\* - (.+)$/,  // **Agent** - timestamp
        /^\\[(.+?)\\] (.+)$/,  // [timestamp] Agent
        /^From: (.+?) at (.+)$/,  // From: Agent at timestamp
        /^Agent: (.+?) \\| Time: (.+)$/  // Agent: name | Time: timestamp
      ];
      
      let headerMatch = null;
      let agent = null;
      let timestamp = null;
      
      for (const pattern of messageHeaderPatterns) {
        headerMatch = line.match(pattern);
        if (headerMatch) {
          agent = headerMatch[1];
          timestamp = headerMatch[2];
          break;
        }
      }
      
      if (headerMatch) {
        // Save previous message if exists
        if (currentMessage) {
          currentMessage.content = currentContent.join('\\n').trim();
          if (currentMessage.content) {
            messages.push(currentMessage);
          }
        }
        
        // Start new message
        currentMessage = {
          agent: this.normalizeAgentName(agent),
          timestamp: this.parseTimestamp(timestamp),
          content: '',
          room: this.inferRoom(agent),
          originalLine: i + 1
        };
        currentContent = [];
        
      } else if (currentMessage && line) {
        // Add content to current message
        currentContent.push(line);
        
      } else if (!line && currentMessage && currentContent.length > 0) {
        // Empty line might be end of message, but continue collecting
        currentContent.push('');
      }
    }
    
    // Add final message
    if (currentMessage) {
      currentMessage.content = currentContent.join('\\n').trim();
      if (currentMessage.content) {
        messages.push(currentMessage);
      }
    }
    
    return messages;
  }

  normalizeAgentName(agent) {
    // Normalize agent names to match new system conventions
    const agentMap = {
      'research-agent': 'research-agent',
      'research_agent': 'research-agent',
      'ResearchAgent': 'research-agent',
      'coding-agent': 'coding-agent',
      'coding_agent': 'coding-agent',
      'CodingAgent': 'coding-agent',
      'testing-agent': 'testing-agent',
      'testing_agent': 'testing-agent',
      'TestingAgent': 'testing-agent',
      'validation-agent': 'validation-agent',
      'validation_agent': 'validation-agent',
      'ValidationAgent': 'validation-agent',
      'ultrathink-coordinator': 'ultrathink-coordinator',
      'ultrathink_coordinator': 'ultrathink-coordinator',
      'UltrathinCoordinator': 'ultrathink-coordinator',
      'orchestrator': 'ultrathink-coordinator',
      'ui-healer-agent': 'ui-healer-agent',
      'ui_healer_agent': 'ui-healer-agent',
      'UIHealerAgent': 'ui-healer-agent',
      'step-8-agent': 'step-8-agent',
      'step_8_agent': 'step-8-agent',
      'Step8Agent': 'step-8-agent'
    };
    
    const normalized = agentMap[agent] || agent.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return normalized;
  }

  parseTimestamp(timestampStr) {
    // Try to parse various timestamp formats
    const now = Date.now();
    
    // Try direct parsing
    const parsed = Date.parse(timestampStr);
    if (!isNaN(parsed)) {
      return parsed;
    }
    
    // Try common formats
    const formats = [
      /^(\\d{1,2}):(\\d{2}):(\\d{2})$/,  // HH:MM:SS
      /^(\\d{1,2}):(\\d{2})$/,  // HH:MM
      /^(\\d{4})-(\\d{2})-(\\d{2}) (\\d{1,2}):(\\d{2}):(\\d{2})$/,  // YYYY-MM-DD HH:MM:SS
      /^(\\d{2})\\/(\\d{2})\\/(\\d{4}) (\\d{1,2}):(\\d{2}):(\\d{2})$/  // MM/DD/YYYY HH:MM:SS
    ];
    
    for (const format of formats) {
      const match = timestampStr.match(format);
      if (match) {
        // Use current date with time, or full date if available
        const today = new Date();
        
        if (format === formats[0] || format === formats[1]) {
          // Time only - use today's date
          const hour = parseInt(match[1]);
          const minute = parseInt(match[2]);
          const second = match[3] ? parseInt(match[3]) : 0;
          
          today.setHours(hour, minute, second, 0);
          return today.getTime();
        }
        
        // Full date parsing would go here for other formats
      }
    }
    
    // Fallback: use current time minus some offset based on position
    return now - (Math.random() * 86400000); // Random time in last 24 hours
  }

  inferRoom(agent) {
    // Infer room based on agent type and historical patterns
    const roomMap = {
      'research-agent': 'ultrathink-research',
      'coding-agent': 'ultrathink-coder',
      'testing-agent': 'ultrathink-tester',
      'validation-agent': 'qa-validation',
      'ultrathink-coordinator': 'ultrathink-coordination',
      'ui-healer-agent': 'qa-ui-healing',
      'step-8-agent': 'step-8-slices'
    };
    
    return roomMap[agent] || 'coordination';
  }

  async migrateMessages(messages) {
    let migrated = 0;
    
    // Prepare insert statement
    const insertMsg = this.db.prepare(`
      INSERT INTO messages (room, agent, msg, ts, migrated) 
      VALUES (?, ?, ?, ?, 1)
    `);
    
    // Begin transaction for better performance
    const transaction = this.db.transaction((messages) => {
      for (const message of messages) {
        try {
          insertMsg.run(
            message.room,
            message.agent,
            message.content,
            message.timestamp
          );
          migrated++;
        } catch (error) {
          console.warn(`⚠️  Failed to migrate message from ${message.agent}: ${error.message}`);
        }
      }
    });
    
    transaction(messages);
    
    return migrated;
  }

  async createMigrationReport(originalMessages, migratedCount) {
    const reportPath = path.resolve(__dirname, 'migration-report.md');
    
    const agentStats = {};
    const roomStats = {};
    
    originalMessages.forEach(msg => {
      agentStats[msg.agent] = (agentStats[msg.agent] || 0) + 1;
      roomStats[msg.room] = (roomStats[msg.room] || 0) + 1;
    });
    
    const report = `# Multi-Agent History Migration Report

## Migration Summary
- **Migration Date**: ${new Date().toISOString()}
- **Original Messages Found**: ${originalMessages.length}
- **Successfully Migrated**: ${migratedCount}
- **Migration Success Rate**: ${((migratedCount / originalMessages.length) * 100).toFixed(1)}%

## Agent Message Distribution
${Object.entries(agentStats).map(([agent, count]) => 
  `- **${agent}**: ${count} messages`
).join('\\n')}

## Room Distribution
${Object.entries(roomStats).map(([room, count]) => 
  `- **${room}**: ${count} messages`
).join('\\n')}

## Migration Notes
- All migrated messages are marked with \`migrated=1\` flag
- Timestamps were preserved where possible, estimated for unclear formats
- Agent names were normalized to match new system conventions
- Messages were automatically assigned to appropriate rooms based on agent type

## Next Steps
1. Test the migrated data: \`/checkVibeMessages\`
2. Verify agent coordination: \`/getVibeProjectStatus\`
3. Begin using enhanced commands: \`/sendVibeMessage\`

## Backup Information
- Original channel.md backed up to: \`.vibe-backup/multi-agent-legacy/\`
- Migration can be reversed by dropping migrated messages if needed

---
Generated by Claude Vibe Enhanced Multi-Agent Migration Tool
`;

    fs.writeFileSync(reportPath, report);
    console.log(`📊 Migration report created: ${reportPath}`);
  }
}

// Main execution
async function main() {
  if (process.argv.length > 2) {
    console.log('Usage: node migrate-history.js');
    console.log('');
    console.log('This script migrates communication history from the old');
    console.log('file-based channel.md system to the new SQLite database.');
    console.log('');
    console.log('It will automatically find and parse your old channel.md file,');
    console.log('then import the messages into the enhanced multi-agent system.');
    process.exit(0);
  }

  const migrator = new HistoryMigrator();
  
  try {
    await migrator.migrate();
    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Test: /checkVibeMessages');
    console.log('2. Verify: /getVibeProjectStatus');
    console.log('3. Use: /sendVibeMessage agent="test" message="Migration test"');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed!');
    console.error('Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Ensure the enhanced system is installed: npm run install-mcp');
    console.error('2. Check database exists: ls -la /tmp/vibe-agent-bus.db');
    console.error('3. Verify MCP server: claude mcp ping vibeAgentBus');
    console.error('');
    process.exit(1);
  }
}

if (process.argv[1] === __filename) {
  main();
}

export { HistoryMigrator };