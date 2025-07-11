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
