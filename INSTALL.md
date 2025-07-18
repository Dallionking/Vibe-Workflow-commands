# Claude Vibe Installation Guide

This guide will help you install Claude Vibe with all its features, including the enhanced multi-agent system.

## Prerequisites

### Required Software
- **Node.js v20** (REQUIRED - v24 is not compatible with multi-agent dependencies)
- **npm** v10+ (comes with Node.js)
- **Git** for cloning the repository
- **Claude Desktop** with Developer mode enabled

### System Requirements
- macOS, Linux, or Windows with WSL
- 500MB free disk space
- 4GB RAM minimum

## Step 1: Install Node.js v20

The multi-agent system requires Node.js v20 due to dependency compatibility.

### Using nvm (Recommended)

```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh

# Install and use Node.js v20
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

### Alternative: Direct Download
Download Node.js v20 from [nodejs.org](https://nodejs.org/en/download/releases/) and install using the installer for your platform.

## Step 2: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Dallionking/claude-vibe.git
cd claude-vibe

# Verify you're in the correct directory
ls -la  # Should show README.md, package.json, etc.
```

## Step 3: Install Core Dependencies

```bash
# Install all npm dependencies
npm install

# This installs:
# - TypeScript 5.2+ for type checking
# - Phase 3 dependencies (chokidar, js-yaml, chalk, ws, glob, uuid)
# - Testing and validation tools
```

## Step 4: Install Enhanced Multi-Agent System

The multi-agent system requires additional setup for the MCP server:

```bash
# Navigate to multi-agent directory
cd multi-agent

# Make install script executable
chmod +x install.sh

# Run the installer
./install.sh

# Return to root directory
cd ..
```

The installer will:
1. Check Node.js version compatibility
2. Install better-sqlite3 and other dependencies
3. Register the vibeAgentBus MCP server with Claude
4. Create the SQLite database for agent communication
5. Run validation tests

## Step 5: Configure Claude Desktop

1. Open Claude Desktop
2. Go to **Settings → Developer**
3. Enable **"Developer mode"** if not already enabled
4. Click **"Import Configuration"**
5. Select the `claude.json` file from the cloned repository
6. Restart Claude Desktop to apply changes

## Step 6: Verify Installation

Run the comprehensive verification:

```bash
# Check overall system health
npm run doctor

# Validate project structure
npm run validate

# Test command implementations
npm test

# Check multi-agent MCP server
cd multi-agent
npm run status
cd ..
```

Expected output:
- ✅ All commands validated
- ✅ MCP tools accessible
- ✅ Multi-agent server registered
- ✅ Database initialized

## Step 7: Test Slash Commands

In Claude, test that slash commands are working:

```bash
# Test basic command
/vibe-status

# Test multi-agent commands
/vibe-multi-agent-enhanced
/getVibeProjectStatus
```

## Troubleshooting

### Node.js Version Issues

If you encounter C++ compilation errors with better-sqlite3:
```bash
# Ensure you're using Node.js v20
nvm use 20
node --version  # Must show v20.x.x

# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### MCP Server Issues

If the MCP server isn't responding:
```bash
# Check MCP registration
claude mcp list | grep vibeAgentBus

# Re-register if needed
cd multi-agent
npm run uninstall-mcp
npm run install-mcp
npm run ping
```

### Permission Issues

If you get permission denied errors:
```bash
# Fix script permissions
chmod +x multi-agent/install.sh
chmod +x scripts/*.js
```

### Claude Not Finding Commands

If slash commands aren't appearing:
1. Ensure Developer mode is enabled in Claude
2. Re-import the `claude.json` configuration
3. Restart Claude Desktop
4. Check that all `.md` files exist in `commands/` directory

## Post-Installation

### Initialize Your First Project

```bash
# Start a new Vibe project
/vibe-init my-awesome-project

# Or retrofit an existing codebase
/vibe-retrofit-existing
```

### Enable Multi-Agent System

```bash
# Initialize enhanced multi-agent system
/vibe-multi-agent-enhanced

# Test agent coordination
/coordinateUltraThink taskDescription="implement user authentication"
```

### Explore Features

- Run `/vibe-steps-reference` to see all available commands
- Check `examples/` directory for sample projects
- Read `CLAUDE.md` for detailed usage instructions

## Updating Claude Vibe

To update to the latest version:

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Update multi-agent system
cd multi-agent
npm install
./install.sh
cd ..

# Verify update
npm run validate
```

## Support

- **Issues**: [GitHub Issues](https://github.com/Dallionking/claude-vibe/issues)
- **Documentation**: See `CLAUDE.md` for detailed usage
- **Examples**: Check `examples/` directory

## Next Steps

1. **Start a new project**: `/vibe-init [project-name]`
2. **Enable multi-agent**: `/vibe-multi-agent-enhanced`
3. **Run through steps**: `/vibe-step-1-ideation` → `/vibe-step-10-init-services`
4. **Use advanced features**: Try YOLO commands, UI healing, repository cleanup

Congratulations! Claude Vibe is now fully installed and ready to revolutionize your development workflow! 🚀