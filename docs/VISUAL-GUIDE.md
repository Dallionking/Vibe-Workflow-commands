# 🎨 Visual Guide - Multi-Agent System

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         VIBE CODING CLAUDE SYSTEM                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐             │
│  │   Terminal   │     │   Terminal   │     │   Terminal   │     ...    │
│  │      1       │     │      2       │     │      3       │             │
│  │ ORCHESTRATOR │     │   RESEARCH   │     │   CODING    │             │
│  │   (You) ⬅️    │     │    AGENT     │     │    AGENT    │             │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘             │
│         │                     │                     │                     │
│         └─────────────────────┴─────────────────────┘                    │
│                               │                                           │
│                        ┌──────▼──────┐                                   │
│                        │ channel.md  │                                   │
│                        │ (Hub) 📝    │                                   │
│                        └─────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Communication Flow

```
User Input                    Orchestrator                    Worker Agents
    │                             │                                 │
    ▼                             ▼                                 ▼
┌────────┐                ┌─────────────┐                  ┌─────────────┐
│  "task │                │  Analyzes   │                  │   Wait for  │
│   do X"│───────────────▶│    Task     │                  │    Tasks    │
└────────┘                └──────┬──────┘                  └──────▲──────┘
                                 │                                 │
                                 ▼                                 │
                          ┌─────────────┐                          │
                          │   Assigns   │                          │
                          │  to Agent   │──────────────────────────┘
                          └──────┬──────┘
                                 │
                                 ▼
                          ┌─────────────┐
                          │  Updates    │
                          │ channel.md  │
                          └─────────────┘
```

## Agent Lifecycle

```
START
  │
  ▼
┌─────────────────┐
│ Paste Command   │ → /agent research-agent --terminal-id=2
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Agent Starts    │ → 🤖 research-agent Starting...
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Connect Channel │ → ✅ Monitoring channel.md
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Announce Ready │ → 📢 "Agent ready" → channel.md
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────┐     ┌─────────────┐
│   Wait for      │────▶│   Execute   │────▶│   Report    │
│     Tasks       │     │    Task     │     │   Results   │
└─────────────────┘     └─────────────┘     └─────────────┘
         ▲                                           │
         └───────────────────────────────────────────┘
```

## Multi-Agent Workflow Example

```
Feature: "Implement User Authentication"

┌─────────────────────────────────────────────────────────────────┐
│ ORCHESTRATOR                                                    │
│ "task implement user authentication"                            │
└────────────────────┬───────────────────────────────────────────┘
                     │
     ┌───────────────┼───────────────┬────────────────┐
     ▼               ▼               ▼                ▼
┌──────────┐   ┌──────────┐   ┌──────────┐    ┌──────────┐
│ RESEARCH │   │ FRONTEND │   │ BACKEND  │    │ TESTING  │
│  AGENT   │   │  AGENT   │   │  AGENT   │    │  AGENT   │
└────┬─────┘   └────┬─────┘   └────┬─────┘    └────┬─────┘
     │              │              │                │
     ▼              ▼              ▼                ▼
"Find auth    "Wait for      "Wait for       "Wait for
 patterns"     research"      research"        impl"
     │              │              │                │
     ▼              │              │                │
[Research]          │              │                │
     │              │              │                │
     ▼              ▼              ▼                │
"JWT, OAuth"  "Build UI"    "Build API"           │
     │              │              │                │
     └──────────────┴──────────────┴────────────────┘
                           │
                           ▼
                    "Run all tests"
                           │
                           ▼
                    "✅ Complete"
```

## Channel.md Message Format

```markdown
┌─────────────────────────────────────────────────┐
│ ### [2024-01-15T10:30:00Z] orchestrator        │ ← Timestamp & Sender
│ **Type:** task-assignment                       │ ← Message Type
│ **Target:** research-agent                      │ ← Target Agent
│                                                 │
│ {"task": "research auth patterns"}              │ ← Message Content
│                                                 │
│ ---                                            │ ← Message Separator
└─────────────────────────────────────────────────┘
```

## Terminal Layout Options

### Option 1: Side-by-Side (Recommended)
```
┌───────────────────┬───────────────────┐
│   Orchestrator    │   Research Agent  │
│   Terminal 1      │   Terminal 2      │
├───────────────────┼───────────────────┤
│   Coding Agent    │   Testing Agent   │
│   Terminal 3      │   Terminal 4      │
└───────────────────┴───────────────────┘
         Editor: channel.md
```

### Option 2: Tabbed Terminals
```
┌─────────────────────────────────────┐
│ [Orch] [Research] [Code] [Test]     │ ← Tabs
├─────────────────────────────────────┤
│                                     │
│    Active Terminal Content          │
│                                     │
└─────────────────────────────────────┘
```

### Option 3: VS Code Integrated
```
┌─────────────────────────────────────┐
│         VS Code Window              │
├─────────────────┬───────────────────┤
│                 │   channel.md      │
│  Source Files   ├───────────────────┤
│                 │   Terminal Panel: │
│                 │ [1][2][3][4]      │
└─────────────────┴───────────────────┘
```

## Task Assignment Logic

```
                  Task: "implement feature X"
                           │
                           ▼
                 ┌─────────────────┐
                 │ Analyze Keywords │
                 └────────┬────────┘
                          │
     ┌────────────────────┼────────────────────┐
     ▼                    ▼                    ▼
"research"           "implement"            "test"
"analyze"            "create"               "verify"
"find"               "build"                "check"
     │                    │                    │
     ▼                    ▼                    ▼
RESEARCH AGENT      CODING AGENT        TESTING AGENT
```

## Agent Status Dashboard

```
┌─────────────────────────────────────────────────────┐
│ 🤖 Agent Status Dashboard                           │
├─────────────────────────────────────────────────────┤
│ Agent Name      │ Terminal │ Status │ Last Active  │
├─────────────────┼──────────┼────────┼──────────────┤
│ orchestrator    │    1     │   ✅   │ 2s ago       │
│ research-agent  │    2     │   ✅   │ 10s ago      │
│ coding-agent    │    3     │   🔄   │ working...   │
│ testing-agent   │    4     │   ⏸️   │ waiting...   │
└─────────────────┴──────────┴────────┴──────────────┘

Legend: ✅ Active  🔄 Working  ⏸️ Waiting  ❌ Disconnected
```

## Workflow Execution Visualization

```
Workflow: feature-implementation
┌────────────────────────────────────────────────┐
│ Step 1: Research        [████████████] 100% ✅ │
├────────────────────────────────────────────────┤
│ Step 2: Planning        [████████████] 100% ✅ │
├────────────────────────────────────────────────┤
│ Step 3: Implementation  [████████░░░░]  70% 🔄 │
│         ├─ Frontend     [████████████] 100% ✅ │
│         ├─ Backend      [████░░░░░░░░]  40% 🔄 │
│         └─ Database     [████████████] 100% ✅ │
├────────────────────────────────────────────────┤
│ Step 4: Testing         [░░░░░░░░░░░░]   0% ⏸️ │
└────────────────────────────────────────────────┘
```

## Dependency Flow

```
┌─────────────┐     Depends On      ┌─────────────┐
│  Frontend   │ ◄────────────────── │  Research   │
│   Agent     │                     │   Agent     │
└─────┬───────┘                     └─────────────┘
      │
      │ Provides API Spec
      ▼
┌─────────────┐     Depends On      ┌─────────────┐
│   Testing   │ ◄────────────────── │   Backend   │
│   Agent     │                     │   Agent     │
└─────────────┘                     └─────────────┘
```

## Common Patterns

### Pattern 1: Research → Implementation → Test
```
[Research] ──▶ [Frontend/Backend] ──▶ [Testing]
    │                  │                  │
    └──────────────────┴──────────────────┘
                       │
                   channel.md
```

### Pattern 2: Parallel Development
```
         ┌──▶ [Frontend] ──┐
         │                 │
[Plan] ──┼──▶ [Backend]  ──┼──▶ [Integration]
         │                 │
         └──▶ [Database] ──┘
```

### Pattern 3: Continuous Testing
```
[Implementation] ←──────┐
       │                │
       ▼                │
   [Testing] ───────────┘
   "Run on every change"
```

## Success Indicators

```
✅ All Green = System Working
┌─────────────────────────────────┐
│ ✅ Orchestrator connected       │
│ ✅ All agents responding        │
│ ✅ Channel.md updating          │
│ ✅ Tasks being assigned         │
│ ✅ Results being reported       │
└─────────────────────────────────┘

❌ Red = Need Attention
┌─────────────────────────────────┐
│ ❌ Agent disconnected           │
│ ❌ Channel.md not found         │
│ ❌ No response to tasks         │
│ ❌ Circular dependency detected │
└─────────────────────────────────┘
```

---

These visual guides help understand:
1. **System Architecture** - How components connect
2. **Communication Flow** - How messages travel
3. **Agent Lifecycle** - What happens when agents start
4. **Task Distribution** - How work gets assigned
5. **Status Monitoring** - How to check system health

Keep these diagrams handy while using the multi-agent system!