# getVibeProjectStatus

Check the current status of the multi-agent system and project coordination. Provides insights into agent activity, memory state, and project progress.

## Usage
```
/getVibeProjectStatus [options]
```

## Options
- `includeMemory=true` - Include agent memory state in status
- `showMessages=true` - Show recent inter-agent messages
- `detailed=true` - Show detailed agent capabilities and status

## Information Provided
- Active virtual agents and their current state
- Recent agent communications
- Project phase and step progression
- Agent memory utilization
- System health and performance metrics
- Current task coordination status

## Prerequisites
- Must run `/vibe-multi-agent-enhanced` first

## Examples
```
# Basic status check
/getVibeProjectStatus

# Detailed status with memory
/getVibeProjectStatus includeMemory=true

# Full diagnostic
/getVibeProjectStatus includeMemory=true showMessages=true detailed=true
```

## Output Includes
- 📡 **Agent Status**: List of active agents and capabilities
- 💬 **Recent Messages**: Inter-agent communications
- 🧠 **Memory State**: Agent memory utilization
- 📊 **Project Progress**: Current Vibe step and phase
- 🔧 **System Health**: Performance metrics and diagnostics