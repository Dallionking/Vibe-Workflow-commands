# Vibe Coding Claude - Installation Guide

## Prerequisites

Before installing Vibe Coding Claude, ensure you have:

- **Claude Code Desktop** (latest version)
- **Git** installed and configured
- **Node.js** (v18+ recommended) - for multi-agent system and project templates
- **TypeScript** (v5.2+) - for Phase 3 advanced context features
- **MCP Tools** (optional but recommended):
  - Context7 - For documentation fetching and research
  - Perplexity - For research and best practices
  - TaskMaster - For complex task management
  - Sequential Thinking - For detailed planning
  - Magic UI - For component generation
  - GitHub - For version control operations
  - Supabase (if using Supabase for backend)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Dallionking/claude-vibe.git
cd claude-vibe
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required dependencies for the multi-agent system and Phase 3 features:
- `chokidar` - File system monitoring for multi-agent coordination
- `js-yaml` - YAML configuration parsing
- `chalk` - Terminal output formatting
- `ws` - WebSocket support for real-time agent communication
- `commander` - Command-line interface tools
- `glob` - File pattern matching
- `uuid` - Unique identifier generation

### 3. Configure Claude Code

Add the vibe-coding-claude directory to your Claude Code configuration by importing the `claude.json` file.

### 4. Verify Installation

Test that the commands are available:

```bash
/vibe-init test-project
```

### 5. Validate System Health

Run the comprehensive health check:

```bash
npm run doctor
```

This validates:
- All command configurations
- MCP tool connections
- File structure integrity
- Context engineering system
- Multi-agent infrastructure

## Configuration

### MCP Tools Setup (Optional)

1. **Context7**
   - Sign up at context7.com
   - Add API key to Claude Code settings
   - Used for documentation fetching and library research

2. **Perplexity**
   - Get API access at perplexity.ai
   - Configure in Claude Code
   - Used for market research and best practices

3. **Sequential Thinking**
   - Usually available by default in Claude Code
   - Used for complex multi-step planning

4. **GitHub**
   - Configure GitHub access in Claude Code
   - Used for repository operations and version control

### Environment Variables

Create a `.env` file:

```bash
# MCP Configuration
CONTEXT7_API_KEY=your-key
PERPLEXITY_API_KEY=your-key

# Project Defaults
DEFAULT_TEMPLATE=saas-startup
DEFAULT_TEST_COVERAGE=0.95

# Phase 3 Context Engineering
CONTEXT_ENGINEERING_ENABLED=true
PRP_SYSTEM_ENABLED=true
FIELD_PROTOCOLS_ENABLED=true

# Multi-Agent System
MULTI_AGENT_ENABLED=true
AGENT_COORDINATION_ENABLED=true
```

### Phase 3 Advanced Context Features + Enhanced UltraThink

Phase 3 introduces advanced context engineering capabilities:

- **PRP System** (Pattern Recognition & Processing)
- **Field Protocols** for context management  
- **Multi-Agent Coordination** with real-time communication
- **Token Budget Management** for efficient context usage
- **🆕 Enhanced UltraThink**: 5-agent system with codebase indexing
- **🆕 Context-Enhanced Phases**: Automatic pattern detection and compliance

These features are automatically enabled but can be configured via environment variables.

## Quick Start

### Option 1: Traditional Single-Agent Development

1. Initialize a new project:
   ```bash
   /vibe-init my-awesome-app
   ```

2. Start the development process:
   ```bash
   /vibe-step-1-ideation
   ```

3. Check your progress:
   ```bash
   /vibe-status
   ```

### Option 2: Multi-Agent Development (Recommended)

1. Initialize multi-agent system:
   ```bash
   /multi-agent
   ```

2. Follow setup instructions to open additional terminals:
   ```bash
   # Terminal 2: /agent research-agent --terminal-id=2
   # Terminal 3: /agent coding-agent --terminal-id=3
   # Terminal 4: /agent testing-agent --terminal-id=4
   ```

3. Start orchestrator and give high-level commands:
   ```bash
   /orchestrate
   # Then: task implement user authentication system
   ```

### Option 3: YOLO Development (Maximum Velocity)

Execute complete phases with zero prompts:

```bash
/yolo local --phase=1 --verbose
/yolo docker --phase=2 --rebuild
```

## Troubleshooting

### Common Issues

**Commands not found**
- Restart Claude Code
- Check installation path
- Verify `claude.json` is properly imported
- Run `npm run doctor` for comprehensive health check

**MCP tools not working**
- Verify API keys are correctly configured
- Check MCP tool installation in Claude Code settings
- Test with `npm run doctor` or `/vibe-mcp-status`
- Ensure MCP tools are enabled in Claude Code

**Multi-agent system not starting**
- Check Node.js installation (v18+ required)
- Verify dependencies are installed: `npm install`
- Ensure `.workflow/` directory is created by `/multi-agent`
- Check file permissions for monitoring

**Phase 3 context features not working**
- Verify TypeScript installation (v5.2+ required)
- Check `tsconfig.json` configuration
- Run `npm run typecheck` to validate setup
- Ensure context engineering environment variables are set

**Tree-sitter compilation errors**
- This is expected on some systems (Windows/Node.js v24+)
- Phase 3 includes TypeScript-only mock implementations
- No action required - system will use fallback implementations

### Performance Issues

**High memory usage during context operations**
- Run `/context-optimize` to optimize context system
- Use `/context-analyze --verbose` to identify bottlenecks
- Consider reducing context window size in environment variables

**Slow multi-agent coordination**
- Check file system permissions for `.workflow/` directory
- Verify WebSocket dependencies are properly installed
- Monitor with `npm run benchmark:memory --gc`

## Validation Commands

Run these commands to verify installation:

```bash
# Basic system validation
npm run doctor

# Test command structure
npm run validate

# Test context engineering
/context-validate --verbose

# Test enhanced UltraThink (5-agent system)
/ultrathink "analyze project structure and suggest improvements"

# Test multi-agent system
/multi-agent
# (Then test with a simple task)

# Test phase modernization
/vibe-reformat-phases --dry-run

# Test MCP connections
/vibe-mcp-status
```

## Getting Help

- **Comprehensive Commands Reference**: See `COMMANDS-CHEATSHEET.md`
- **Health Diagnostics**: `npm run doctor`
- **System Status**: `/vibe-status` and `/vibe-doctor`
- **Context Analysis**: `/context-analyze --verbose`
- **GitHub Issues**: https://github.com/Dallionking/claude-vibe/issues
- **Quick Start Guide**: See `QUICK-START.md` (when available)

## Advanced Configuration

### Custom Agent Configuration

Create custom agents by placing YAML files in `agents/yaml-based/`:

```yaml
# agents/yaml-based/custom-agent.yaml
name: custom-agent
description: My custom development agent
capabilities:
  - code-generation
  - testing
  - documentation
```

### Performance Tuning

Optimize for your system in `.env`:

```bash
# Context Engineering Performance
CONTEXT_CACHE_SIZE=1000
FIELD_PROTOCOL_BUFFER_SIZE=500
PRP_PROCESSING_THREADS=4

# Multi-Agent Performance
AGENT_HEARTBEAT_INTERVAL=1000
COORDINATION_POLLING_RATE=500
```

---

**Welcome to the future of AI-assisted development with Phase 3 Advanced Context Features! 🚀**

**Ready to revolutionize your development process? Choose your path:**
- **Traditional**: `/vibe-init my-project`
- **Multi-Agent**: `/multi-agent`
- **Maximum Velocity**: `/yolo local`