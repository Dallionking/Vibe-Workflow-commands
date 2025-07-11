# /vibe-feature-ideate Command

## Purpose
Transform a **feature-level** idea within an existing project into a fully-researched, codebase-aware implementation plan using multiple specialized agents with user approval at each step.

**Note**: This command is for planning individual features within a project. For full project ideation (Vibe Step 1), use `/vibe-project-ideate` or `/vibe-step-1`.

## Command Structure
```bash
/vibe-feature-ideate "feature idea" [options]
```

## Options
- `--skip-research`: Skip Perplexity research phase
- `--skip-docs`: Skip Context7 documentation phase
- `--quick`: Minimal questions, faster process
- `--retrofit`: For existing codebase features
- `--greenfield`: For new project features

## Workflow Overview

The command orchestrates 6 specialized agents in sequence, with user approval between each step. Each agent automatically invokes the next agent upon approval:

1. **Clarification Agent** (3 sub-agents) → User Approval →
2. **Research Agent** → User Approval →
3. **Documentation Agent** (3 sub-agents) → User Approval →
4. **Architecture Analyst** → User Approval →
5. **Planning Synthesizer** (3 sub-agents) → User Approval →
6. **Phase Formatter** → Final Implementation Guide

## Detailed Workflow

### Step 1: Clarification (clarification-agent)
```yaml
purpose: "Understand the feature request deeply"
architecture: "Orchestrator with 3 sub-agents"
sub_agents:
  - question-generator: "Creates targeted questions"
  - response-analyzer: "Analyzes user responses"
  - requirement-extractor: "Extracts final requirements"
actions:
  - Detects feature type
  - Generates 3-8 relevant questions
  - Analyzes responses for gaps
  - Extracts clear requirements
output: 
  - Feature requirements document
  - Research keywords
  - Success criteria
files_created:
  - .vibe/clarification-questions.md
  - .vibe/user-responses.md
  - .vibe/feature-requirements.md
user_approval: "Are these clarifications accurate? Proceed to research?"
next_agent: "research-agent"
```

### Step 2: Research (research-agent)
```yaml
purpose: "Research similar implementations and best practices"
tools_used:
  - mcp__perplexity-ask__perplexity_ask (with fallback)
actions:
  - Generates 2-4 targeted queries
  - Uses Perplexity Ask API if available
  - Falls back to pattern library if needed
  - Identifies common pitfalls
  - Discovers best practices
output:
  - Research findings document
  - Recommended patterns
  - Common pitfalls
  - Technology suggestions
files_created:
  - .vibe/research-findings.md
user_approval: "Research complete. Review findings and proceed to documentation?"
next_agent: "documentation-agent"
```

### Step 3: Documentation (documentation-agent)
```yaml
purpose: "Gather relevant technical documentation"
architecture: "Orchestrator with 3 sub-agents"
sub_agents:
  - library-resolver: "Converts names to Context7 IDs"
  - docs-fetcher: "Retrieves documentation"
  - docs-processor: "Organizes documentation"
tools_used:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
actions:
  - Identifies libraries from research
  - Resolves to Context7 IDs
  - Fetches relevant documentation
  - Processes into actionable format
output:
  - Technical documentation package
  - Quick start guide
  - Core API reference
  - Integration examples
files_created:
  - .vibe/library-list.md
  - .vibe/resolved-libraries.md
  - .vibe/technical-documentation.md
user_approval: "Documentation gathered. Proceed to codebase analysis?"
next_agent: "architecture-analyst"
```

### Step 4: Architecture Analysis (architecture-analyst)
```yaml
purpose: "Analyze existing codebase for integration"
tools_used:
  - LS: "List directories"
  - Glob: "Find files by pattern"
  - Grep: "Search code patterns"
  - Read: "Read specific files"
actions:
  - Maps codebase structure
  - Detects coding patterns
  - Identifies integration points
  - Assesses potential risks
output:
  - Codebase structure analysis
  - Code patterns document
  - Integration plan
  - Risk assessment
files_created:
  - .vibe/codebase-structure.md
  - .vibe/code-patterns.md
  - .vibe/integration-plan.md
user_approval: "Analysis complete. Proceed to planning?"
next_agent: "planning-synthesizer"
```

### Step 5: Planning Synthesis (planning-synthesizer)
```yaml
purpose: "Create comprehensive implementation plan"
architecture: "Orchestrator with 3 sub-agents"
sub_agents:
  - task-breakdown: "Creates task hierarchy"
  - dependency-mapper: "Maps task dependencies"
  - plan-generator: "Creates final plan"
actions:
  - Compiles all previous outputs
  - Breaks down into 10-20 tasks
  - Maps dependencies and critical path
  - Creates timeline with phases
  - Identifies risks
output:
  - Task breakdown structure
  - Dependency map
  - Implementation timeline
  - Risk management plan
files_created:
  - .vibe/planning-inputs.md
  - .vibe/task-breakdown.md
  - .vibe/dependency-map.md
  - .vibe/implementation-plan.md
  - Task dependencies
  - Risk mitigation strategies
user_approval: "Plan ready. Convert to Vibe phase format?"
next_agent: "phase-formatter"
```

### Step 6: Phase Formatting (phase-formatter)
```yaml
purpose: "Convert plan to Vibe phase structure"
actions:
  - Maps tasks to 7 Vibe phases
  - Creates phase objectives
  - Defines deliverables
  - Identifies parallel work
output:
  - Vibe implementation guide
  - Phase breakdown
  - Implementation order
  - Success criteria
files_created:
  - .vibe/vibe-implementation-guide.md
user_approval: "Phase guide complete. Ready to implement?"
next_agent: null  # End of workflow
```

## Usage Examples

### Basic Feature Ideation
```bash
/vibe-feature-ideate "Add real-time notifications to the app"

> Clarification Agent:
> I need to understand your notification requirements better:
> 
> 1. What types of notifications? (push/email/in-app/SMS)
> 2. What events should trigger notifications?
> 3. Who are the target recipients?
> 4. Do you need user preferences/settings?
> 5. Any specific delivery requirements?
> 
> Your answers: [user provides responses]
> 
> ✓ Clarifications recorded
> Approve and proceed to research? [y/n]: y

> Research Agent:
> Researching real-time notification implementations...
> 
> ✓ Found 5 common patterns
> ✓ WebSocket vs SSE comparison
> ✓ Popular libraries analyzed
> ✓ Scalability considerations documented
> 
> Key findings:
> - Socket.io most popular for real-time
> - Redis pub/sub for scaling
> - Consider notification queuing
> 
> Review complete. Proceed to documentation? [y/n]: y

[continues through all agents...]
```

### Quick Mode
```bash
/vibe-feature-ideate "User authentication system" --quick

> Streamlined process with minimal questions
> Focuses on common patterns
> Faster but less customized
```

### Retrofit Mode
```bash
/vibe-feature-ideate "Upgrade authentication to OAuth2" --retrofit

> Focuses on existing code analysis
> Emphasizes migration strategies
> Considers backward compatibility
```

## Agent Chaining

Each agent knows its next agent in the workflow. Upon user approval, the orchestrator automatically invokes the next agent, passing context through files in the `.vibe/` directory.

### Chain Flow
```
clarification-agent → research-agent → documentation-agent → 
architecture-analyst → planning-synthesizer → phase-formatter
```

### Context Passing
Agents communicate through files:
- Each agent reads previous outputs
- Adds its own findings
- Saves for next agent
- Orchestrator manages the flow

## Output Format

### Final Phase Guide Structure
```yaml
feature_name: "Real-time Notifications"
overview: "Complete implementation guide for adding real-time notifications"

phases:
  phase_1_planning:
    objectives: "Define notification architecture"
    tasks:
      - Define notification types
      - Design delivery system
      - Plan user preferences
    
  phase_2_foundation:
    objectives: "Set up core infrastructure"
    tasks:
      - Configure WebSocket server
      - Set up Redis pub/sub
      - Create base classes
    - websocket_setup.js
    - redis_connection.js
    
  phase_3_core_logic:
    - NotificationService.js
    - NotificationQueue.js
    - UserPreferences.js
    
  phase_4_interface:
    - NotificationCenter.jsx
    - NotificationAPI.js
    - WebSocketHandlers.js
    
  phase_5_integration:
    - EmailProvider.js
    - PushNotifications.js
    - SMSIntegration.js
    
  phase_6_testing:
    - notification.test.js
    - websocket.test.js
    - integration.test.js
    
  phase_7_deployment:
    - notification_monitoring.js
    - scaling_config.yaml
    - deployment_guide.md

agent_assignments:
  - notification_orchestrator
  - websocket_manager
  - queue_processor
  - preference_handler

next_steps:
  1. Run /vibe-generate-agents --feature=notifications
  2. Execute /vibe-vertical-slice notifications
  3. Begin with phase_2_foundation
```

## Integration Points

### With Other Vibe Commands
- **Pre-commands**: Can follow `/vibe-retrofit-existing` for context
- **Post-commands**: Feeds into `/vibe-vertical-slice` for implementation
- **Agent Generation**: Triggers `/vibe-generate-agents` for new patterns
- **Orchestration**: Integrates with `/vibe-orchestrate` for execution

### With External Tools
- **Perplexity Ask**: For AI-powered research
- **Context7**: For documentation retrieval
- **Git**: For codebase analysis
- **VS Code**: For file inspection

## Error Handling

### Common Issues
```yaml
perplexity_timeout:
  message: "Research phase timed out"
  solution: "Retry or skip with --skip-research"
  
context7_not_found:
  message: "Documentation not found for technology"
  solution: "Proceed with general patterns"
  
codebase_too_large:
  message: "Analysis taking too long"
  solution: "Focus on specific module/directory"
  
approval_cancelled:
  message: "User cancelled at step X"
  solution: "Resume from last checkpoint or restart"
```

## Best Practices

### Do's
1. ✅ Provide detailed initial description
2. ✅ Answer clarification questions thoroughly
3. ✅ Review each step's output carefully
4. ✅ Ask for modifications if needed
5. ✅ Save the final phase guide

### Don'ts
1. ❌ Rush through approvals
2. ❌ Skip important phases
3. ❌ Ignore research findings
4. ❌ Overlook integration warnings
5. ❌ Forget to generate agents

## Advanced Features

### Custom Agent Chains
```yaml
custom_chain:
  - security_analyst  # Add for sensitive features
  - performance_analyzer  # Add for high-load features
  - accessibility_checker  # Add for UI features
```

### Parallel Research
```yaml
parallel_mode:
  research_branches:
    - technical_implementation
    - user_experience
    - security_considerations
  merge_strategy: "synthesize_all"
```

### Template Library
```yaml
feature_templates:
  - authentication_system
  - payment_processing
  - real_time_chat
  - file_upload
  - search_functionality
```

## Success Metrics

- **Clarity**: Feature fully understood before implementation
- **Research**: Best practices and pitfalls identified
- **Integration**: Seamless fit with existing architecture
- **Planning**: Comprehensive task breakdown
- **Phases**: Clear implementation path
- **Time Saved**: 70% reduction in planning time

## Next Steps

After running `/vibe-feature-ideate`, typically:

1. Generate custom agents: `/vibe-generate-agents --feature=X`
2. Create vertical slice: `/vibe-vertical-slice X`
3. Begin implementation: `/vibe-implement-phase 2`
4. Test thoroughly: `/vibe-test-feature X`
5. Deploy: `/vibe-deploy X`

## Claude Code Compatibility

### Design Principles
This system is specifically designed for Claude Code:
- **No State Persistence**: Works within single-session constraints
- **File-Based Communication**: Uses `.vibe/` directory for agent communication
- **Explicit Tool Usage**: Every agent specifies required Claude Code tools
- **Simple Approvals**: Text-based user prompts (y/n)
- **Progress Tracking**: Uses TodoWrite for workflow visibility

### Required Tools
- **Write/Read**: For file-based context passing
- **TodoWrite**: For progress tracking
- **LS/Glob/Grep**: For codebase analysis
- **Edit/MultiEdit**: For code modifications

### MCP Tool Fallbacks
- **Perplexity Unavailable**: Uses built-in pattern library
- **Context7 Unavailable**: Provides generic documentation guidance
- **Taskmaster Unavailable**: Uses manual task tracking

## Conclusion

The `/vibe-feature-ideate` command transforms vague feature ideas into concrete, well-researched, phase-based implementation plans. By leveraging multiple specialized agents and maintaining user control through approval checkpoints, it ensures that every feature is thoroughly planned before a single line of code is written.

## Related Commands

- `/vibe-project-ideate` - For full project ideation (Vibe Step 1)
- `/vibe-step-1` through `/vibe-step-10` - Complete Vibe workflow steps
- `/vibe-retrofit-existing` - For retrofitting existing codebases
- `/vibe-generate-agents` - Generate agents based on feature plan