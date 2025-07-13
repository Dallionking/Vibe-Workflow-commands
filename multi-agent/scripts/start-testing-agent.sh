#!/bin/bash

# Testing Agent Wrapper Script
# Starts a Claude Code instance configured as a testing agent

echo "🧪 Starting Testing Agent"
echo "========================="
echo ""
echo "This script starts a Claude Code instance that acts as a testing agent."
echo "The agent will monitor .workflow/context/channel.md for task assignments."
echo ""

# Set environment variables for agent identification
export AGENT_NAME="testing-agent"
export AGENT_ROLE="testing-agent"
export TERMINAL_ID="4"

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
    echo "🛑 Shutting down Testing Agent..."
    kill $WRAPPER_PID 2>/dev/null
    echo "👋 Testing Agent stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "📋 Testing Agent Instructions:"
echo "=============================="
echo ""
echo "This testing agent specializes in:"
echo "  • Test creation and validation"
echo "  • Code quality assurance"
echo "  • Coverage analysis and reporting"
echo ""
echo "Available tools:"
echo "  • Read - Read code that needs testing"
echo "  • Write - Create comprehensive test files"
echo "  • Bash - Run test suites and check coverage"
echo "  • Edit - Modify existing tests"
echo ""
echo "To assign tasks to this agent, use the orchestrator:"
echo "  orchestrator> task testing-agent Write tests for UserCard component"
echo ""
echo "The agent will automatically detect task assignments and provide"
echo "detailed guidance on how to execute them using Claude Code tools."
echo ""
echo "🔴 This agent is now monitoring for tasks. Keep this terminal open."
echo "   Press Ctrl+C to stop the agent."
echo ""

# Wait for wrapper process
wait $WRAPPER_PID