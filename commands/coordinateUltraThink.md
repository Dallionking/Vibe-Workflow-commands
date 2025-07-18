# coordinateUltraThink

Execute 5-agent coordination for complex tasks with architecture diagrams. This leverages the virtual agent system to analyze tasks from multiple perspectives within your single Claude session.

## Usage
```
/coordinateUltraThink taskDescription="[your task description]"
```

## Parameters
- `taskDescription` - The task you want the 5 agents to analyze and coordinate on

## Virtual Agents Involved
1. **Architect Agent**: System design and architecture diagrams
2. **Research Agent**: Best practices and documentation research
3. **Coder Agent**: Implementation approach and code structure
4. **Testing Agent**: Validation strategy and test coverage
5. **Context Agent**: Pattern consistency and conventions

## Prerequisites
- Must run `/vibe-multi-agent-enhanced` first to initialize the system
- Requires MCP tools: Context7, Perplexity, Sequential Thinking

## Example
```
/coordinateUltraThink taskDescription="implement user authentication with JWT tokens and role-based access control"

# Results in:
# - Architecture diagram from Architect Agent
# - Best practices research from Research Agent
# - Implementation plan from Coder Agent
# - Test strategy from Testing Agent
# - Pattern compliance from Context Agent
# - All coordinated through MCP message bus
```

## Output
- Unified solution with Mermaid architecture diagrams
- Coordinated implementation approach
- Test coverage strategy
- Pattern compliance recommendations