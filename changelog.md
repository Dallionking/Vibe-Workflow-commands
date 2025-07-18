# Changelog

All notable changes to the Vibe Workflow Commands project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Command Improvements v2.1.1 - 2025-01-18

#### Added
- **New Retrofit Commands**
  - `/vibe-retrofit-orchestrator` - Orchestrate comprehensive retrofit operations
  - `/vibe-retrofit-api` - Systematically modernize API endpoints  
  - `/vibe-retrofit-react` - Update React components to modern patterns
  - `/vibe-retrofit-workflow` - Coordinate feature workflow retrofitting
  
- **New Ideation Command**
  - `/vibe-ideate-feature` - AI-powered feature ideation and planning

- **YOLO Command Improvements**
  - `/yolo-local` - Execute phases locally with zero-friction
  - `/yolo-docker` - Execute phases in Docker container
  - Fixed YOLO command discovery issues

#### Fixed
- Missing commands for YAML-based agents
- Retrofit orchestrator agents now have proper commands
- YOLO commands now properly show as separate options
- Total command count: 86 (was 81)

### Enhanced Multi-Agent System v2.1.0 - 2025-01-18

#### Added
- **MCP-Native Multi-Agent Architecture**
  - Virtual agents within single Claude session (NOT multiple terminals!)
  - SQLite-based persistent message bus replacing file-based channel.md
  - 99%+ reliability compared to ~60% with old file-based system
  - Cross-session agent memory persistence
  - Intelligent message routing based on Vibe context

- **New Slash Commands**
  - `/vibe-multi-agent-enhanced` - Initialize enhanced multi-agent system
  - `/coordinateUltraThink` - 5-agent coordination with Mermaid diagrams
  - `/sendVibeMessage` - Send messages through MCP bus
  - `/getVibeProjectStatus` - Check system and agent status

- **UltraThink Enhancements**
  - Architect Agent now generates Mermaid architecture diagrams
  - Automatic codebase indexing and analysis
  - Enhanced coordination through persistent message bus
  - Agent memory for continuous context

- **Installation Improvements**
  - Comprehensive `INSTALL.md` guide
  - Node.js v20 requirement clearly documented
  - One-command setup with `./install.sh`
  - Automatic MCP server registration

#### Changed
- Multi-agent system now uses virtual agents instead of multiple terminals
- Communication through SQLite database instead of channel.md file
- Agent coordination is now automatic with intelligent routing
- Memory persistence across Claude sessions

#### Fixed
- Race conditions in file-based communication
- Agent synchronization issues
- Message delivery reliability
- Cross-session context loss

#### Requirements
- **Node.js v20** (REQUIRED - v24 not compatible with better-sqlite3)
- Claude Desktop with MCP support
- 100MB disk space for SQLite database

### Phase 9: DeepWiki-Style Codebase Indexing - 2025-07-17

#### Added
- Universal code parser with AST-based parsing for multiple languages
- Token-aware chunking system adapting to model context windows (4K to 1T+)
- Semantic code search using vector embeddings (Pinecone integration)
- AI-powered documentation generation for all code elements
- Automatic architecture and dependency diagram generation
- Knowledge Base Agent as new LangGraph node
- Real-time code synchronization via GitHub webhooks
- Natural language code queries in chat interface
- `/context` command suite for repository management
- Wiki-style documentation viewer UI component

#### Enhanced
- Memory architecture extended for code storage
- Chat interface with code-aware responses
- Agent capabilities with code context
- Orchestrator with code indexing coordination

#### Technical
- AST parsing for JavaScript, TypeScript, Python, Java, Go, Rust
- Adaptive context management for different AI models
- Incremental indexing for performance
- File watcher for local development
- Mermaid.js integration for diagram rendering

### Phase 8: Kanban Multi-Agent Integration - [Previous Date]

#### Added
- Visual Kanban board for task management
- Enhanced multi-agent orchestrator with MCP commands
- LangGraph communication replacing file-based channel.md
- Real-time agent chat interface
- Automatic phase file parsing with task extraction
- Claude Code MAX integration
- Memory persistence layer (Vector DB + Redis)
- Dynamic agent spawning based on workload

#### Enhanced
- Multi-agent coordination with visual feedback
- Task distribution with drag-and-drop
- Agent communication through WebSocket
- Performance optimization for 50+ agents

## [Initial Release]

### Core Features
- Vibe Coding methodology implementation
- Slash command system
- Multi-agent framework
- MCP tool integration
- Context management system
- Retrofit capabilities
- Template system
- Validation framework

### Infrastructure
- Node.js/TypeScript architecture
- Jest testing framework
- Command validation system
- Agent structure validation
- Installation scripts
- Health check system (doctor.js)

---

## Version History

### v1.0.0 - Initial Release
- Complete Vibe Coding methodology
- 10-step development process
- Agent-based architecture
- MCP integration

### v2.0.0 - Multi-Agent Enhancement (Phase 8)
- Kanban visualization
- LangGraph communication
- Enhanced orchestration
- Real-time collaboration

### v3.0.0 - Code Intelligence (Phase 9) [Planned]
- DeepWiki-style indexing
- Semantic code search
- AI documentation
- Visual diagrams

---

## Upgrade Guide

### Upgrading to Phase 9
1. Ensure Phase 8 is fully operational
2. Install additional dependencies:
   ```bash
   npm install @babel/parser @typescript-eslint/parser
   npm install @pinecone-database/pinecone
   npm install mermaid
   ```
3. Configure vector database credentials
4. Run migration scripts (if any)
5. Test with `/context connect` on a sample repository

### Breaking Changes
- None in Phase 9 (fully backward compatible)
- All Phase 8 features preserved and enhanced

---

*For detailed implementation status, see [features.md](./features.md)*
*For current development phase, see [.vibe-status.md](./.vibe-status.md)*