#!/bin/bash

# Coding Agent Wrapper Script
# Starts a Claude Code instance configured as a coding agent

echo "💻 Starting Coding Agent"
echo "========================"
echo ""
echo "This script starts a Claude Code instance that acts as a coding agent."
echo "The agent will monitor .workflow/context/channel.md for task assignments."
echo ""

# Set environment variables for agent identification
export AGENT_NAME="coding-agent"
export AGENT_ROLE="coding-agent"
export TERMINAL_ID="3"

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
    echo "🛑 Shutting down Coding Agent..."
    kill $WRAPPER_PID 2>/dev/null
    echo "👋 Coding Agent stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📋 Coding Agent Instructions:"
echo "============================="
echo ""
echo "This coding agent specializes in:"
echo "  • Feature implementation and code generation"
echo "  • Component creation and modification"
echo "  • Code refactoring and optimization"
echo ""
echo "Available tools:"
echo "  • Read - Read existing code to understand patterns"
echo "  • Write - Create new files and components"
echo "  • Edit - Modify existing code"
echo "  • MultiEdit - Make multiple changes to files"
echo "  • Bash - Run build and test commands"
echo ""
echo "To assign tasks to this agent, use the orchestrator:"
echo "  orchestrator> task coding-agent Create a UserCard React component"
echo ""
echo "The agent will automatically detect task assignments and provide"
echo "detailed guidance on how to execute them using Claude Code tools."
echo ""
echo "🔴 This agent is now monitoring for tasks. Keep this terminal open."
echo "   Press Ctrl+C to stop the agent."
echo ""

# Wait for wrapper process
wait $WRAPPER_PID