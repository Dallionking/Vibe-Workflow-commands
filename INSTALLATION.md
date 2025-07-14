# Vibe Coding Claude - Installation Guide

## Prerequisites

Before installing Vibe Coding Claude, ensure you have:

- **Claude Code Desktop** (latest version)
- **Git** installed and configured
- **Node.js** (v18+ recommended) - for project templates
- **MCP Tools** (optional but recommended):
  - Context7 - For documentation fetching
  - Perplexity - For research and best practices
  - TaskMaster - For complex task management
  - Sequential Thinking - For detailed planning
  - Magic UI - For component generation

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/[your-username]/vibe-coding-claude.git
cd vibe-coding-claude
```

### 2. Configure Claude Code

Add the vibe-coding-claude directory to your Claude Code configuration.

### 3. Verify Installation

Test that the commands are available:

```bash
/vibe-init test-project
```

## Configuration

### MCP Tools Setup (Optional)

1. **Context7**
   - Sign up at context7.com
   - Add API key to Claude Code settings

2. **Perplexity**
   - Get API access at perplexity.ai
   - Configure in Claude Code

### Environment Variables

Create a `.env` file:

```bash
# MCP Configuration
CONTEXT7_API_KEY=your-key
PERPLEXITY_API_KEY=your-key

# Project Defaults
DEFAULT_TEMPLATE=saas-startup
DEFAULT_TEST_COVERAGE=0.95
```

## Quick Start

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

## Troubleshooting

### Common Issues

**Commands not found**
- Restart Claude Code
- Check installation path
- Run `/vibe-doctor`

**MCP tools not working**
- Verify API keys
- Check MCP tool installation
- Test with `/vibe-doctor`

## Getting Help

- Documentation: `/vibe-help`
- Status Check: `/vibe-doctor`
- GitHub Issues: [Coming soon]

---

**Welcome to the future of AI-assisted development! 🚀**