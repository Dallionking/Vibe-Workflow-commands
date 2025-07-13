# Vibe Coding Multi-Agent System

A powerful multi-agent workflow system that enables Claude Code instances to collaborate through a shared communication channel, similar to the workflow demonstrated in the video.

## Overview

This system allows you to:
- Run multiple Claude Code instances as specialized agents
- Coordinate agents through a shared `channel.md` file
- Execute complex workflows with parallel and sequential agent execution
- Integrate with existing Vibe Coding slash commands
- Launch agents in VS Code integrated terminals or external terminals

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Orchestrator   │     │ Research Agent  │     │  Coding Agent   │
│   (Main)        │────▶│  (Terminal 1)   │────▶│  (Terminal 2)   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                        │
         └───────────────────────┴────────────────────────┘
                                 │
                          ┌──────▼──────┐
                          │ channel.md  │
                          │ (Shared)    │
                          └─────────────┘
```

## Quick Start

### 1. Initialize Multi-Agent System

```bash
# Start the orchestration system
/orchestrate

# This will:
# - Initialize the context manager
# - Start channel monitoring
# - Create the workflow directory structure
```

### 2. Launch Agents

```bash
# Launch individual agents in terminals
/terminals launch research-agent
/terminals launch coding-agent
/terminals launch testing-agent

# List active terminals
/terminals list
```

### 3. Run a Workflow

```bash
# Execute a predefined workflow
/workflow run feature-implementation

# Create a new workflow
/workflow create my-custom-workflow
```

### 4. Monitor Communication

```bash
# View channel messages
/channel show

# Open channel in editor for live monitoring
/channel monitor

# Clear channel
/channel clear
```

## File Structure

```
multi-agent/
├── core/                    # Core infrastructure
│   ├── agent-loader.js      # Loads agent definitions
│   ├── agent-registry.js    # Manages agent registration
│   ├── agent-executor.js    # Executes agent logic
│   ├── context-manager.js   # Manages shared context
│   ├── channel-monitor.js   # Monitors channel.md
│   ├── orchestrator.js      # Coordinates workflows
│   ├── terminal-manager.js  # Manages agent terminals
│   └── workflow-builder.js  # Builds workflows programmatically
├── agents/                  # Agent definitions
│   ├── research-agent.yaml
│   ├── coding-agent.yaml
│   └── testing-agent.yaml
├── workflows/               # Workflow definitions
│   ├── feature-implementation.yaml
│   └── vibe-coding-phase.yaml
└── commands/               # Slash command integration
    └── multi-agent.js
```

## Creating Custom Agents

### YAML Agent Format

```yaml
agent:
  name: my-custom-agent
  version: 1.0.0
  purpose: Clear description of agent's purpose

capabilities:
  main_capability:
    description: What this capability does
    parameters:
      - name: param1
        type: string
        required: true
    workflow:
      - action: read-context
        params:
          source: shared
          key: project-context
      - action: invoke-agent
        params:
          agent: helper-agent
          input:
            data: "{{param1}}"

tools_required:
  claude_code: [Read, Write, Bash]
  mcp_tools: [perplexity, github]

interactions:
  coordinates_with: [other-agent-1, other-agent-2]
  triggers:
    - command: /my-command
    - event: workflow:custom-event
```

## Creating Workflows

### Using Workflow Builder

```javascript
const WorkflowBuilder = require('./multi-agent/core/workflow-builder');

const workflow = WorkflowBuilder.create()
  .name('my-workflow')
  .description('My custom workflow')
  
  // Single agent execution
  .agent('research-agent', { topic: 'AI trends' })
  
  // User approval checkpoint
  .approval('Review research before proceeding')
  
  // Parallel agent execution
  .parallel('frontend-agent', 'backend-agent', 'database-agent')
  
  // Sequential execution
  .sequential('test-writer', 'test-runner')
  
  // Conditional logic
  .conditional(
    WorkflowBuilder.conditions.fieldEquals('test_results.passed', true),
    (workflow) => workflow.agent('deploy-agent'),
    (workflow) => workflow.agent('fix-agent')
  )
  
  .build();

// Save workflow
await workflow.save('.workflow/definitions/my-workflow.yaml');
```

## Channel Communication

The `channel.md` file serves as the primary communication mechanism between agents:

```markdown
# Agent Communication Channel

### [2024-01-15T10:30:00Z] research-agent
**Type:** research-complete
**Target:** coding-agent

Found 3 relevant implementation patterns for the feature.
See research-output.md for details.

---

### [2024-01-15T10:31:00Z] coding-agent
**Type:** implementation-started
**Target:** orchestrator

Beginning implementation based on research results.
Estimated completion: 15 minutes.

---
```

## Integration with Existing Projects

### 1. Add to Existing Vibe Coding Project

```bash
# Copy multi-agent directory to your project
cp -r multi-agent your-project/

# Install dependencies
cd your-project
npm install js-yaml uuid chokidar

# Initialize the system
/orchestrate
```

### 2. Modify Existing Slash Commands

```javascript
// In your existing slash command handler
const { handleMultiAgentCommand } = require('./multi-agent/commands/multi-agent');

// Add multi-agent commands to your command registry
const commands = {
  ...existingCommands,
  '/workflow': (args) => handleMultiAgentCommand('/workflow', args),
  '/agent': (args) => handleMultiAgentCommand('/agent', args),
  '/orchestrate': (args) => handleMultiAgentCommand('/orchestrate', args),
  // ... other multi-agent commands
};
```

### 3. Create Project-Specific Agents

Create agents tailored to your project's needs:

```yaml
# agents/my-project-agent.yaml
agent:
  name: my-project-agent
  purpose: Specific to my project's requirements
  
capabilities:
  custom_task:
    description: Performs project-specific task
    workflow:
      - action: read-context
        params:
          source: shared
          key: project-config
      # ... custom workflow steps
```

## Advanced Features

### Parallel Terminal Execution

The system supports launching multiple agents in parallel terminals:

```javascript
// Launch multiple agents for a Vibe Coding phase
await terminalManager.launchWorkflow(vibePhaseWorkflow, {
  parallel: true,
  terminalType: 'integrated'  // or 'external' or 'headless'
});
```

### Context Passing

Agents can pass context to each other:

```javascript
// In one agent
await contextManager.passContext('agent-1', 'agent-2', {
  results: analysisResults,
  recommendations: suggestions
});

// In another agent
const context = await contextManager.receiveContext('agent-2', { latest: true });
```

### Event-Driven Coordination

Agents can respond to events:

```javascript
channelMonitor.on('message:task-complete', async (message) => {
  if (message.metadata.target === 'my-agent') {
    // Handle task completion
  }
});
```

## Best Practices

1. **Agent Specialization**: Keep agents focused on specific tasks
2. **Clear Communication**: Use structured messages in channel.md
3. **Error Handling**: Implement proper error handling in workflows
4. **Context Preservation**: Save important context for other agents
5. **Workflow Testing**: Test workflows with simple tasks first

## Troubleshooting

### Agents Not Communicating

1. Check if channel.md exists: `ls .workflow/context/channel.md`
2. Verify channel monitor is running: `/channel monitor`
3. Check agent terminals are active: `/terminals list`

### Workflow Failures

1. Review workflow logs in channel.md
2. Check individual agent outputs in `.workflow/context/agents/`
3. Verify all required agents are registered: `/agents`

### Terminal Issues

1. Ensure VS Code is in PATH for integrated terminals
2. Check terminal permissions for external terminals
3. Use headless mode for debugging: `terminal: 'headless'`

## Examples

See the `multi-agent/workflows/` directory for complete examples:

- `feature-implementation.yaml`: Full feature development workflow
- `vibe-coding-phase.yaml`: Vibe Coding phase orchestration
- More examples coming soon!

## Contributing

To add new agents or workflows:

1. Create agent definition in `multi-agent/agents/`
2. Test agent individually: `/agent your-new-agent`
3. Create workflow using the agent
4. Submit PR with documentation

## Future Enhancements

- [ ] Web UI for workflow visualization
- [ ] Agent marketplace for sharing
- [ ] Cloud-based agent execution
- [ ] Real-time collaboration features
- [ ] Advanced workflow debugging tools