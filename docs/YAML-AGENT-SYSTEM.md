# YAML-Based Agent System Documentation

## Overview

The YAML-based agent system represents the next evolution in Vibe Workflow agent architecture, providing a declarative, structured approach to defining AI agent behaviors, dependencies, and multi-agent orchestration.

## Why YAML Agents?

### Benefits over Markdown Agents
1. **Structured Configuration** - Clear separation of metadata, configuration, and logic
2. **Schema Validation** - Enforce consistency with YAML schemas
3. **Multi-Agent Orchestration** - Built-in support for agent coordination
4. **Better Tooling** - IDE support, linting, and validation
5. **Version Control** - Cleaner diffs and easier merging

### Current Implementation
Located in `agents/yaml-based/`, the system currently includes:
- **Feature Ideation** - Complete multi-agent workflow for feature planning
- **Retrofit Operations** - Specialized agents for codebase transformation

## YAML Agent Structure

### Basic Agent Definition
```yaml
# Agent header with metadata
agent:
  name: "agent_unique_name"
  version: "1.0.0"
  purpose: "Clear single-line purpose"
  command: "/slash-command-name"
  
metadata:
  description: |
    Detailed multi-line description of what this agent does,
    how it fits into workflows, and when to use it.
  
  author: "Your Name"
  created: "2024-07-16"
  tags: ["feature", "planning", "orchestration"]

configuration:
  # Agent behavior settings
  approval_settings:
    require_approval: true
    approval_points: ["after_research", "before_generation"]
    
  context_management:
    preserve_in_session: true
    store_in_files: true
    output_format: "markdown"
    
  error_handling:
    retry_on_failure: true
    max_retries: 3
    fallback_strategy: "graceful_degradation"

# Required tools/capabilities
tools_required:
  claude_code:
    - Read
    - Write
    - TodoWrite
  mcp_tools:
    - context7
    - perplexity
    - sequential_thinking

# Workflow definition
workflow:
  stages:
    - name: "initialization"
      description: "Set up agent context and validate inputs"
      actions:
        - validate_prerequisites
        - load_context
        - create_todo_list
        
    - name: "execution"
      description: "Main agent logic"
      actions:
        - research_best_practices
        - analyze_requirements
        - generate_solution
        
    - name: "finalization"
      description: "Clean up and prepare outputs"
      actions:
        - validate_outputs
        - update_status
        - commit_changes

# Agent-specific parameters
parameters:
  required:
    - name: "feature_name"
      type: "string"
      description: "Name of the feature to ideate"
      
  optional:
    - name: "complexity"
      type: "enum"
      values: ["simple", "medium", "complex"]
      default: "medium"
      
    - name: "include_tests"
      type: "boolean"
      default: true

# Output specifications
outputs:
  files:
    - path: "docs/features/{feature_name}.md"
      format: "markdown"
      description: "Feature specification document"
      
  status_updates:
    - ".vibe-status.md"
    - ".vibe/features.json"
    
  artifacts:
    - type: "mermaid_diagram"
      description: "Architecture diagram"
      
# Integration with other agents
integrations:
  depends_on:
    - "clarification_agent"
    - "research_agent"
    
  triggers:
    - "architecture_analyst"
    - "phase_formatter"
    
  communicates_with:
    - agent: "planning_synthesizer"
      protocol: "file_based"
      data_format: "json"
```

## Multi-Agent Orchestration

### Orchestrator Pattern
```yaml
# Example: Feature Ideation Orchestrator
agent:
  name: "feature_ideation_orchestrator"
  type: "orchestrator"  # Special type for coordinators
  
orchestration:
  workflow_type: "sequential_with_approvals"
  
  agents:
    - stage: "clarification"
      agent: "clarification_agent"
      timeout: "5m"
      required: true
      
    - stage: "research"
      agents:  # Parallel execution
        - "research_agent"
        - "documentation_agent"
      wait_for_all: true
      
    - stage: "synthesis"
      agent: "planning_synthesizer"
      depends_on: ["clarification", "research"]
      
  error_recovery:
    on_agent_failure: "retry_with_fallback"
    on_timeout: "continue_with_partial"
    
  context_passing:
    method: "shared_files"
    directory: ".workflow/context/"
    format: "markdown"
```

### Communication Patterns

#### 1. File-Based Communication
```yaml
communication:
  type: "file_based"
  settings:
    input_file: ".workflow/context/{stage}_input.md"
    output_file: ".workflow/context/{stage}_output.md"
    watch_for_changes: false  # Claude Code doesn't watch files
```

#### 2. Context Accumulation
```yaml
communication:
  type: "context_accumulation"
  settings:
    context_file: ".workflow/context/shared_context.json"
    merge_strategy: "append"
    deduplication: true
```

#### 3. Message Passing (Future)
```yaml
communication:
  type: "mcp_message_bus"
  settings:
    channel: "feature_ideation"
    protocol: "vibeAgentBus"
```

## Best Practices

### 1. Agent Design Principles
- **Single Responsibility** - Each agent should do one thing well
- **Clear Interfaces** - Well-defined inputs and outputs
- **Idempotent Operations** - Safe to run multiple times
- **Graceful Degradation** - Handle missing tools/data

### 2. Configuration Guidelines
```yaml
# Good: Explicit, validated configuration
configuration:
  approval_settings:
    require_approval: true
    approval_points: ["after_research"]  # Clear checkpoint
    
# Bad: Ambiguous settings
configuration:
  approvals: true  # When? Where?
```

### 3. Error Handling
```yaml
error_handling:
  strategies:
    missing_tool:
      action: "use_fallback"
      fallback: "web_search"
      log_level: "warning"
      
    api_failure:
      action: "retry"
      max_attempts: 3
      backoff: "exponential"
      
    validation_error:
      action: "fail_fast"
      message: "Invalid input: {error}"
```

### 4. Testing YAML Agents
```yaml
# Include test cases in agent definition
test_cases:
  - name: "basic_feature_ideation"
    inputs:
      feature_name: "user_authentication"
      complexity: "medium"
    expected_outputs:
      - file: "docs/features/user_authentication.md"
      - status: "completed"
    
  - name: "error_handling"
    inputs:
      feature_name: ""  # Invalid
    expected_behavior: "validation_error"
```

## Migration Guide

### Converting Markdown to YAML

#### Before (Markdown):
```markdown
# Feature Analyzer Agent

You are the Feature Analyzer. Your job is to analyze features
and create implementation plans...

ARGUMENTS: $ARGUMENTS
```

#### After (YAML):
```yaml
agent:
  name: "feature_analyzer"
  purpose: "Analyze features and create implementation plans"
  
metadata:
  description: |
    Detailed analysis of features including dependency mapping,
    complexity assessment, and implementation strategies.
    
workflow:
  stages:
    - name: "analyze"
      actions:
        - parse_requirements
        - map_dependencies
        - assess_complexity
        - generate_plan
```

## Advanced Features

### 1. Dynamic Agent Selection
```yaml
orchestration:
  agent_selection:
    type: "dynamic"
    selector_logic: |
      if (complexity == "high") {
        include_agents: ["senior_architect", "security_reviewer"]
      }
```

### 2. Conditional Workflows
```yaml
workflow:
  conditional_stages:
    - condition: "has_ui_components"
      stage:
        name: "ui_design"
        agent: "design_system_agent"
```

### 3. Resource Management
```yaml
resources:
  token_budget: 50000
  time_limit: "30m"
  
  allocation_strategy:
    research: "40%"
    generation: "40%"
    validation: "20%"
```

## Integration with Vibe Workflow

### 1. Command Registration
To register a YAML agent as a slash command:

```javascript
// In claude.json
{
  "name": "vibe-feature-ideate",
  "description": "AI-powered feature ideation workflow",
  "agent": "agents/yaml-based/feature-ideation/ideation-orchestrator.yaml",
  "mcps": ["context7", "perplexity", "sequential-thinking"]
}
```

### 2. Status Integration
YAML agents automatically update:
- `.vibe-status.md` - Progress tracking
- `.vibe/features.json` - Feature registry
- `docs/vibe-coding/` - Step outputs

### 3. MCP Tool Usage
```yaml
mcp_integration:
  context7:
    use_for: ["documentation_fetch", "library_research"]
    
  perplexity:
    use_for: ["best_practices", "market_research"]
    
  sequential_thinking:
    use_for: ["complex_planning", "multi_step_analysis"]
```

## Debugging YAML Agents

### 1. Validation Commands
```bash
# Validate YAML syntax
npm run validate:yaml agents/yaml-based/my-agent.yaml

# Test agent locally
npm run test:agent -- --agent=my-agent --dry-run
```

### 2. Common Issues
- **Schema Violations** - Use YAML schema validation
- **Missing Dependencies** - Check `depends_on` agents exist
- **Context Conflicts** - Ensure unique file paths
- **Tool Availability** - Verify MCP tools are configured

### 3. Debug Mode
```yaml
configuration:
  debug:
    enabled: true
    log_level: "verbose"
    save_intermediates: true
    trace_execution: true
```

## Future Roadmap

### Planned Enhancements
1. **Visual Workflow Designer** - Drag-and-drop agent creation
2. **Agent Marketplace** - Share and reuse agent definitions
3. **Performance Analytics** - Track agent efficiency
4. **Native MCP Integration** - Direct message bus support
5. **Agent Versioning** - Manage agent evolution

### Migration Timeline
- **Phase 1** (Current) - Feature ideation and retrofit in YAML
- **Phase 2** - Core workflow steps (1-10) in YAML
- **Phase 3** - All utilities in YAML
- **Phase 4** - Deprecate markdown agents

## Examples

### Simple Utility Agent
```yaml
agent:
  name: "code_formatter"
  purpose: "Format code according to project standards"
  command: "/format-code"
  
configuration:
  simple_mode: true
  
workflow:
  stages:
    - name: "format"
      actions:
        - detect_language
        - apply_formatting
        - save_changes
```

### Complex Orchestrator
See `agents/yaml-based/feature-ideation/ideation-orchestrator.yaml` for a complete example of multi-agent orchestration with approvals, context management, and error handling.

## Getting Started

1. **Study Existing Examples** - Review the feature-ideation workflow
2. **Start Simple** - Convert one utility agent to YAML
3. **Test Thoroughly** - Use the validation tools
4. **Document Changes** - Update this guide with learnings

## Support

- **Questions** - Create an issue in the repository
- **Examples** - See `agents/yaml-based/examples/`
- **Schema** - Reference `schemas/agent-schema.yaml`
- **Tools** - Use VS Code with YAML extension for best experience