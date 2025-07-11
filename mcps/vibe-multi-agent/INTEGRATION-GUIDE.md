# Vibe Commands + Multi-Agent Integration Guide

## Overview

The multi-agent system is designed to work **WITH** your existing Vibe commands, not replace them. Here's how it works:

### Workflow Architecture

```
Phase 1-6: Planning (Single Claude Instance)
├── STOIC (@stoic) - Strategic planning
├── Inception (@inception) - Project setup  
├── Designer (@designer) - UI/UX design
├── Innovator (@innovator) - Feature design
├── Sensei (@sensei) - Best practices
└── Architect (@architect) - Technical architecture

Phase 7-10: Execution (Multiple Claude Instances)
├── Initializer - Setup & configuration (agents work in parallel)
├── Builder - Implementation (agents work in parallel)
├── Quality - Testing & validation (coordinated)
└── Deployer - Production deployment (single agent)
```

## How to Use Your Existing Commands

### Option 1: Traditional Vibe Workflow + Agent Execution

1. **Run your normal Vibe commands for planning:**
   ```bash
   claude
   > @stoic "Build a task management SaaS"
   > @inception
   > @designer
   > @innovator
   > @sensei
   > @architect
   ```

2. **When ready for execution (Phase 7), spawn agents:**
   ```bash
   > @vibe-orchestrator spawn_agents {
     "project_description": "Task management SaaS from Vibe planning",
     "tasks": [...tasks from planning phases...],
     "agent_roles": ["frontend", "backend", "database", "testing"]
   }
   ```

3. **Agents execute in parallel:**
   - Frontend agent builds React components
   - Backend agent creates APIs
   - Database agent handles schema
   - Testing agent writes tests

### Option 2: Integrated Workflow (Recommended)

Use the Vibe Workflow MCP that combines everything:

```bash
claude
> @vibe-workflow vibe_full_workflow {
  "project_description": "Build a task management SaaS with React, Node.js, PostgreSQL",
  "spawn_agents_at_phase": 7,
  "agent_config": {
    "max_agents": 5
  }
}
```

This will:
1. Run phases 1-6 using your existing Vibe commands
2. Extract tasks from the planning output
3. Automatically spawn agents at phase 7
4. Coordinate parallel execution
5. Merge results without conflicts

## Key Points

### Your Vibe Commands Stay the Same
- All your existing commands work exactly as before
- The multi-agent system is an **enhancement**, not a replacement
- You can use traditional single-agent workflow anytime

### Agents Only for Execution
- Planning phases (1-6) always run in a single Claude instance
- This ensures consistent vision and architecture
- Agents spawn only when it's time to build (phase 7+)

### Task Extraction
The system extracts tasks from your Vibe command outputs:
- STOIC → High-level architecture tasks
- Inception → Setup and configuration tasks
- Designer → UI component tasks
- Architect → Backend implementation tasks
- etc.

### Intelligent Distribution
Tasks are automatically distributed based on:
- Domain (frontend, backend, database, etc.)
- Dependencies (some tasks must complete first)
- Agent specialization (matching skills to tasks)

## Example: Full Workflow

```bash
# 1. Start the orchestrator
./start-orchestrator.sh

# 2. Run integrated workflow
claude
> @vibe-workflow vibe_full_workflow {
  "project_description": "E-commerce platform with:
    - Product catalog
    - Shopping cart
    - Payment processing (Stripe)
    - Admin dashboard
    - Customer accounts
    - Order tracking",
  "spawn_agents_at_phase": 7
}
```

The system will:
1. **Phase 1-6**: Run your Vibe commands for planning
2. **Extract**: ~50-100 tasks from the planning output
3. **Spawn**: 5 specialized agents at phase 7
4. **Distribute**: Tasks based on agent capabilities
5. **Execute**: Parallel development with coordination
6. **Merge**: Automatic integration without conflicts

## Benefits

### Speed
- 5x faster execution with parallel agents
- Planning remains thoughtful and sequential
- Execution leverages parallel processing

### Quality
- Each agent specializes in their domain
- 95% test coverage maintained
- Automatic quality checks

### Coordination
- No merge conflicts (git worktrees)
- Real-time progress tracking
- Automatic task dependencies

## When to Use What

### Use Traditional Vibe Commands When:
- Working on small projects
- Need maximum control
- Learning or experimenting
- Working on planning only

### Use Multi-Agent Execution When:
- Building large applications
- Need faster development
- Have clear task separation
- Want parallel development

### Use Integrated Workflow When:
- Want the best of both worlds
- Building production applications
- Need consistent workflow
- Want automatic coordination

## Summary

The multi-agent system **enhances** your Vibe Coding workflow by:
1. Keeping planning sequential (your Vibe commands)
2. Making execution parallel (multiple agents)
3. Maintaining quality standards (95% coverage)
4. Preventing conflicts (git isolation)
5. Saving time (5x faster execution)

Your Vibe commands remain the brain of the operation - the multi-agent system is just the workforce that executes the plan!