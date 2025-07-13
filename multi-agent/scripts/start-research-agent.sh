#!/bin/bash

# Research Agent Wrapper Script
# Starts a Claude Code instance configured as a research agent

echo "🔬 Starting Research Agent"
echo "=========================="
echo ""
echo "This script starts a Claude Code instance that acts as a research agent."
echo "The agent will monitor .workflow/context/channel.md for task assignments."
echo ""

# Set environment variables for agent identification
export AGENT_NAME="research-agent"
export AGENT_ROLE="research-agent"
export TERMINAL_ID="2"

# Change to project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
cd "$PROJECT_DIR"

echo "📁 Working directory: $PROJECT_DIR"
echo "🤖 Agent: $AGENT_NAME"
echo "🎭 Role: $AGENT_ROLE"
echo ""

# Start the agent wrapper in background
echo "🚀 Starting agent wrapper..."
node multi-agent/core/agent-wrapper.js "$AGENT_NAME" "$AGENT_ROLE" &
WRAPPER_PID=$!

echo "✅ Agent wrapper started (PID: $WRAPPER_PID)"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down Research Agent..."
    kill $WRAPPER_PID 2>/dev/null
    echo "👋 Research Agent stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📋 Research Agent Instructions:"
echo "==============================="
echo ""
echo "This research agent specializes in:"
echo "  • Codebase analysis and pattern detection"
echo "  • Documentation review and research"
echo "  • Information gathering and exploration"
echo ""
echo "Available tools:"
echo "  • Read - Read files and documentation"
echo "  • Grep - Search for patterns in code"
echo "  • LS - Explore directory structures"
echo "  • WebSearch - Research external information"
echo "  • WebFetch - Fetch and analyze web content"
echo ""
echo "To assign tasks to this agent, use the orchestrator:"
echo "  orchestrator> task research-agent Analyze React patterns in src/"
echo ""
echo "The agent will automatically detect task assignments and provide"
echo "detailed guidance on how to execute them using Claude Code tools."
echo ""
echo "🔴 This agent is now monitoring for tasks. Keep this terminal open."
echo "   Press Ctrl+C to stop the agent."
echo ""

# Wait for wrapper process
wait $WRAPPER_PID