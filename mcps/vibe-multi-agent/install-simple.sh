#!/bin/bash

echo "🚀 Installing Vibe Multi-Agent MCP System..."

# Create config.json with defaults
cat > config.json << EOF
{
  "host": "localhost",
  "port": 8080,
  "ssl": false,
  "auth": {
    "type": "none"
  },
  "agents": {
    "maxConcurrent": 5,
    "defaultTimeout": 300000,
    "heartbeatInterval": 5000,
    "reconnectAttempts": 3
  },
  "git": {
    "worktreePath": ".worktrees",
    "mergeStrategy": "merge",
    "autoMerge": true
  },
  "logging": {
    "level": "info"
  }
}
EOF

# Create .env file
cat > .env << EOF
LOG_LEVEL=info
ORCHESTRATOR_PORT=8080
MAX_AGENTS=5
MONITORING_ENABLED=true
NODE_ENV=development
EOF

# Create start script
cat > start-orchestrator.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Vibe Multi-Agent Orchestrator..."

# Check if orchestrator is already running
if pgrep -f "dist/orchestrator/index.js" > /dev/null; then
  echo "⚠️  Orchestrator already running"
  exit 1
fi

# Start orchestrator
node "$(pwd)/dist/orchestrator/index.js" &
ORCHESTRATOR_PID=$!

echo "✅ Orchestrator started with PID: $ORCHESTRATOR_PID"
echo "🌐 WebSocket server running on port 8080"
echo "📝 Log level: info"

# Save PID for cleanup
echo $ORCHESTRATOR_PID > orchestrator.pid

echo "🎯 Ready for multi-agent development!"
echo "   Use: @vibe-stoic 'Your project description'"
EOF

# Create stop script
cat > stop-orchestrator.sh << 'EOF'
#!/bin/bash
PID_FILE="orchestrator.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "🛑 Stopping orchestrator (PID: $PID)..."
    kill "$PID"
    rm "$PID_FILE"
    echo "✅ Orchestrator stopped"
  else
    echo "⚠️  Orchestrator not running"
    rm "$PID_FILE"
  fi
else
  echo "⚠️  No PID file found"
fi
EOF

# Make scripts executable
chmod +x start-orchestrator.sh
chmod +x stop-orchestrator.sh

# Install MCP servers
echo "📦 Installing MCP servers in Claude Code..."

# Get full paths
ORCHESTRATOR_PATH="$(pwd)/dist/orchestrator/index.js"
STOIC_PATH="$(pwd)/dist/stoic/index.js"
WORKFLOW_PATH="$(pwd)/dist/vibe-workflow-mcp/index.js"

# Install orchestrator MCP
claude mcp add vibe-orchestrator node "$ORCHESTRATOR_PATH" || echo "⚠️  Orchestrator MCP may already be installed"

# Install STOIC MCP
claude mcp add vibe-stoic node "$STOIC_PATH" || echo "⚠️  STOIC MCP may already be installed"

# Install workflow MCP
claude mcp add vibe-workflow node "$WORKFLOW_PATH" || echo "⚠️  Workflow MCP may already be installed"

echo ""
echo "✅ Installation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the orchestrator: ./start-orchestrator.sh"
echo "2. Open Claude Code: claude"
echo "3. Use: @vibe-stoic 'Your project description'"
echo ""
echo "🛑 To stop: ./stop-orchestrator.sh"