# sendVibeMessage

Send messages to specific virtual agents through the MCP message bus. Enables inter-agent communication within your single Claude session.

## Usage
```
/sendVibeMessage agent="[agent-name]" message="[your message]" [optional params]
```

## Required Parameters
- `agent` - Target agent ID (e.g., "step-8-agent", "research-agent", "architect-agent")
- `message` - The message content to send

## Optional Parameters
- `step` - Vibe step number (1-10)
- `priority` - Message priority ("high", "medium", "low")
- `context` - Additional context object

## Available Agents
- `ultrathink-coordinator` - 5-agent orchestration
- `step-[1-10]-agent` - Step-specific agents
- `architect-agent` - System design and diagrams
- `research-agent` - Documentation and best practices
- `coder-agent` - Implementation and code generation
- `testing-agent` - Validation and test coverage
- `context-agent` - Pattern analysis and consistency
- `validation-agent` - Quality assurance
- `ui-healer-agent` - UI testing and browser validation

## Prerequisites
- Must run `/vibe-multi-agent-enhanced` first

## Examples
```
# Send high-priority message to step 8 agent
/sendVibeMessage agent="step-8-agent" message="Generate Phase 3 with user authentication" step="8" priority="high"

# Request research on best practices
/sendVibeMessage agent="research-agent" message="Research JWT token best practices for Node.js"

# Coordinate with architect
/sendVibeMessage agent="architect-agent" message="Design microservices architecture for e-commerce platform"
```

## Response
- Message delivery confirmation
- Agent acknowledgment
- Any immediate responses from the agent