# Agent Chaining Reference

Quick reference for how agents invoke each other in the Vibe Workflow system.

## Chain Structure

```
/vibe-feature-ideate
    │
    ├─→ ideation-orchestrator
    │       │
    │       ├─→ clarification-agent
    │       │       ├─→ question-generator
    │       │       ├─→ response-analyzer
    │       │       └─→ requirement-extractor
    │       │
    │       ├─→ research-agent
    │       │
    │       ├─→ documentation-agent
    │       │       ├─→ library-resolver
    │       │       ├─→ docs-fetcher
    │       │       └─→ docs-processor
    │       │
    │       ├─→ architecture-analyst
    │       │
    │       ├─→ planning-synthesizer
    │       │       ├─→ task-breakdown
    │       │       ├─→ dependency-mapper
    │       │       └─→ plan-generator
    │       │
    │       └─→ phase-formatter
```

## How Chaining Works

### 1. Orchestrator Control
The `ideation-orchestrator` manages the entire workflow:
```yaml
execution_flow:
  - stage: "clarification"
    agent: "clarification-agent"
    next_agent: "research-agent"
    approval_prompt: "..."
```

### 2. Agent Completion
Each agent:
1. Performs its work
2. Saves output to files
3. Returns control to orchestrator
4. Orchestrator seeks user approval
5. On approval, orchestrator invokes `next_agent`

### 3. Sub-Agent Orchestration
Some agents are orchestrators themselves:
```yaml
# clarification-agent.yaml
sub_agents:
  - clarifiers/question-generator
  - clarifiers/response-analyzer
  - clarifiers/requirement-extractor
```

## File-Based Communication

### Context Flow
```
.vibe/
├── context.md                    # Shared context
├── feature-requirements.md       # From clarification
├── research-findings.md          # From research
├── technical-documentation.md    # From documentation
├── integration-plan.md           # From architecture
├── implementation-plan.md        # From planning
└── vibe-implementation-guide.md  # From formatter
```

### Read/Write Pattern
```yaml
# Agent reads previous outputs
Read(".vibe/feature-requirements.md")
Read(".vibe/research-findings.md")

# Agent writes its output
Write(".vibe/technical-documentation.md", results)
```

## Approval Checkpoints

### User Approval Flow
1. Agent completes work
2. Orchestrator displays results
3. Prompts user: `[y/n/modify]`
4. Based on response:
   - `y` → Invoke next agent
   - `n` → Re-run current agent
   - `modify` → Accept changes and re-run

### Example Approval
```
✅ Clarification Complete

[Results displayed]

Are these clarifications accurate? Proceed to research phase?
[y/n/modify]: y

→ Invoking research-agent...
```

## Agent Configuration

### Required Fields for Chaining
```yaml
agent:
  name: "agent_name"
  
tools_required:
  claude_code:
    - Read   # To read context
    - Write  # To save results
    
configuration:
  input_file: ".vibe/previous-output.md"
  output_file: ".vibe/my-output.md"
```

### Orchestrator Configuration
```yaml
sub_agents:
  - sub-agent-1
  - sub-agent-2
  
workflow: "sequential"  # or "parallel"
```

## Error Handling in Chains

### Chain Interruption
- Progress saved in files
- Can resume from last successful agent
- Orchestrator tracks completion status

### Agent Failure
```yaml
error_handling:
  agent_failure:
    retry_count: 2
    fallback: "continue_with_partial"
```

## Best Practices

### 1. Always Save Context
```yaml
# Good
Write(".vibe/my-output.md", results)

# Bad
# Only returning results without saving
```

### 2. Read All Relevant Context
```yaml
# Good
context = Read(".vibe/context.md")
requirements = Read(".vibe/feature-requirements.md")

# Bad
# Only reading immediate predecessor
```

### 3. Clear Status Updates
```yaml
# Good
TodoWrite("Starting documentation retrieval...")
# ... work ...
TodoWrite("Documentation complete")
```

### 4. Handle Missing Files
```yaml
try:
  data = Read(".vibe/optional-file.md")
except:
  data = "default_values"
```

## Debugging Chains

### Check Execution Order
1. Review orchestrator's `execution_flow`
2. Verify `next_agent` properties
3. Check approval prompts

### Trace File Creation
```bash
ls -la .vibe/
# Shows all context files with timestamps
```

### Monitor Progress
- Check TodoWrite outputs
- Review partial results in `.vibe/`
- Verify agent completion messages

## Extending the Chain

### Adding New Agent to Chain
1. Create agent YAML file
2. Add to orchestrator's `execution_flow`
3. Set `next_agent` in previous stage
4. Define input/output files
5. Add approval prompt

### Creating Sub-Agent Chain
1. Make parent agent an orchestrator
2. List sub-agents in order
3. Define workflow type
4. Handle sub-agent coordination

## Quick Command Reference

### Start Chain
```bash
/vibe-feature-ideate "Your feature idea"
```

### Skip Stages
```bash
/vibe-feature-ideate "idea" --skip-research --skip-docs
```

### Quick Mode
```bash
/vibe-feature-ideate "idea" --quick
```

## Conclusion

The agent chaining system ensures smooth workflow progression while maintaining user control at each step. File-based communication provides transparency and debuggability, while the orchestrator pattern allows for complex multi-agent workflows.