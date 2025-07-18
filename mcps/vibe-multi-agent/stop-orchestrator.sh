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
