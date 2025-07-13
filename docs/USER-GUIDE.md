# 📚 Vibe Coding Claude - Complete User Guide

Welcome to the Vibe Coding Claude system! This guide will walk you through everything you need to know, from basic usage to advanced multi-agent development.

## Table of Contents

1. [What is Vibe Coding Claude?](#what-is-vibe-coding-claude)
2. [Getting Started](#getting-started)
3. [Traditional Workflow (Single Agent)](#traditional-workflow-single-agent)
4. [Multi-Agent System (NEW!)](#multi-agent-system-new)
5. [Real-World Examples](#real-world-examples)
6. [Tips for Success](#tips-for-success)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

## What is Vibe Coding Claude?

Vibe Coding Claude is a comprehensive system that transforms Claude into your AI development team. It provides:

- **10-Step Methodology**: From idea to production
- **Multi-Agent Collaboration**: Multiple AI specialists working together
- **Automatic Documentation**: Every decision documented
- **Quality Assurance**: Built-in testing and standards

## Getting Started

### Prerequisites

1. **Claude Desktop App** (latest version)
2. **Node.js** installed (for multi-agent features)
3. **Terminal/Command Line** access
4. **Text Editor** (VS Code recommended)

### Installation

```bash
# 1. Clone or download the repository
git clone [repository-url]

# 2. Install dependencies
cd vibe-coding-claude
npm install

# 3. Configure Claude Desktop
# - Open Settings → Developer
# - Enable Developer Mode
# - Import the commands
```

## Traditional Workflow (Single Agent)

Perfect for learning or smaller projects. One Claude instance handles everything.

### Example: Building a Todo App

#### Step 1: Initialize Project
```
You: /vibe-init my-todo-app

Claude: Creating new Vibe Coding project: my-todo-app
✅ Created project directory
✅ Initialized git repository
✅ Created .vibe-status.md
✅ Created initial structure

Next: Run /vibe-step-1-ideation to start planning!
```

#### Step 2: Project Ideation
```
You: /vibe-step-1-ideation

Claude: Let's plan your todo app! I'll help you think through:
- Target users and their needs
- Core features and MVP scope
- Technical considerations

[Interactive discussion follows...]

✅ Created: docs/vibe-coding/01-project-specification.md
Next: Run /vibe-step-2-architecture
```

#### Step 3: Continue Through Steps
```
You: /vibe-step-2-architecture
You: /vibe-step-3-ux-design
You: /vibe-step-4-design-system
... and so on
```

Each step builds on the previous, creating comprehensive documentation and code.

### 📝 What Each Step Does

| Step | Creates | Purpose |
|------|---------|---------|
| 1. Ideation | Project specification | Define what you're building |
| 2. Architecture | Technical blueprint | How it will work |
| 3. UX Design | User flows & mockups | How it will look |
| 4. Design System | Component library | Consistent styling |
| 5. Interface States | All UI variations | Handle all scenarios |
| 6. Tech Spec | Detailed implementation | Exact coding plan |
| 7. Landing Page | Marketing copy | Sell your product |
| 8. Vertical Slices | Development phases | Step-by-step coding |
| 9. Claude.md | AI configuration | Future AI assistance |
| 10. Init Services | Live connections | Deploy to production |

## Multi-Agent System (NEW!)

For larger projects or faster development, use multiple Claude instances working as a team!

### 🚀 Quick Start Multi-Agent

#### Step 1: Start the System
```
Terminal 1: /multi-agent

Output:
🚀 Welcome to the Multi-Agent System!

📋 Setup Options:
1. Standard (3-4 agents) - Good for most tasks
2. Minimal (3 agents) - Quick setup
3. Full Team (8 agents) - Maximum power

Select: 1

You need to open 4 Claude Code instances
```

#### Step 2: Follow Setup Instructions
The system shows exactly what to do:

```
Step 1: Open 4 terminal windows
Step 2: Start Claude Code in each
Step 3: Copy these commands:

Terminal 1: /orchestrate --agent-role="coordinator"
Terminal 2: /agent research-agent --terminal-id=2
Terminal 3: /agent coding-agent --terminal-id=3
Terminal 4: /agent testing-agent --terminal-id=4
```

#### Step 3: Set Up Each Agent

**In Terminal 1** (Your command center):
```
You: /orchestrate --agent-role="coordinator"

Output:
🎯 ORCHESTRATOR READY
This is your main control terminal.
Type 'help' for commands.

orchestrator>
```

**In Terminal 2** (Research specialist):
```
You: /agent research-agent --terminal-id=2

Output:
🤖 research-agent Starting...
✅ research-agent is ready and monitoring
💬 Waiting for tasks from orchestrator...
```

**In Terminal 3 & 4**: Similar setup for other agents

#### Step 4: Use Your AI Team!

Back in Terminal 1 (Orchestrator):
```
orchestrator> status

🤖 Agent Status:
─────────────────────────────────────
Agent Name      Terminal   Status
─────────────────────────────────────
orchestrator    1          active ✓
research-agent  2          active ✓
coding-agent    3          active ✓
testing-agent   4          active ✓
─────────────────────────────────────

orchestrator> task implement user login feature

📋 Creating task: implement user login feature
Assigning to: coding-agent
✅ Task assigned!
```

### 🔄 How Agents Collaborate

1. **You give commands** to the Orchestrator
2. **Orchestrator assigns tasks** to appropriate agents
3. **Agents work** and update progress in channel.md
4. **You see results** in real-time

Example flow:
```
You → Orchestrator: "implement user auth"
      ↓
Orchestrator → Research Agent: "research auth best practices"
      ↓
Research Agent → channel.md: "Found 5 patterns..."
      ↓
Orchestrator → Coding Agent: "implement using JWT pattern"
      ↓
Coding Agent → channel.md: "Created auth module..."
      ↓
Orchestrator → Testing Agent: "test auth module"
      ↓
Testing Agent → channel.md: "All tests passing!"
```

## Real-World Examples

### Example 1: SaaS Dashboard (Traditional)

```bash
# Day 1: Planning
/vibe-init analytics-dashboard
/vibe-step-1-ideation
/vibe-step-2-architecture

# Day 2: Design
/vibe-step-3-ux-design
/vibe-step-4-design-system
/vibe-step-5-interface-states

# Day 3: Implementation Planning
/vibe-step-6-technical-spec
/vibe-step-7-landing-page

# Day 4-7: Development
/vibe-step-8-vertical-slices
# Work through each phase slice

# Day 8: Deployment
/vibe-step-9-claude-md
/vibe-step-10-init-services
```

### Example 2: E-commerce Site (Multi-Agent)

```bash
# Terminal 1 - Orchestrator
/multi-agent
# Select "Full Team" for 8 agents

orchestrator> task design product catalog system
# Research agent investigates best practices
# UX agent creates wireframes
# Backend agent designs database schema
# Frontend agents plan components

orchestrator> workflow run feature-implementation
# All agents work in parallel!
# 4x faster than single agent
```

### Example 3: Adding Features to Existing Project

```bash
# For existing projects
cd my-existing-project

# Single feature addition
/vibe-feature-ideate "Add payment processing"

# Or retrofit entire codebase
/vibe-retrofit-existing --mode full
```

## Tips for Success

### 🎯 Best Practices

1. **Start Small**: Try single-agent first to learn the system
2. **Read the Docs**: Each step creates detailed documentation - read it!
3. **Trust the Process**: Follow steps in order for best results
4. **Use Multi-Agent for**:
   - Large features
   - Time-critical work
   - Complex systems
   - Team simulation

### 📊 When to Use What

| Scenario | Recommended Approach |
|----------|---------------------|
| Learning Vibe Coding | Single agent, follow steps |
| Small project (<1 week) | Single agent |
| Medium project (1-4 weeks) | Multi-agent (3-4 agents) |
| Large project (>1 month) | Multi-agent (full team) |
| Adding single feature | `/vibe-feature-ideate` |
| Fixing messy codebase | `/vibe-retrofit-existing` |

### 💡 Power User Tips

1. **Watch channel.md**: Keep it open to see agent communications
2. **Use workflows**: Pre-built workflows save time
3. **Create custom agents**: For specialized tasks
4. **Parallel tasks**: Assign different features to different agents
5. **Phase awareness**: Agents understand Vibe Coding phases

## Troubleshooting

### Common Issues

#### "Command not recognized"
```bash
# Make sure you're in the right directory
cd vibe-coding-claude

# Check installation
npm install

# Restart Claude Desktop
```

#### "Agents not connecting"
```bash
# In orchestrator:
orchestrator> status

# Check each agent terminal for errors
# Ensure all commands were copied correctly
# Try restarting agents
```

#### "MCP tools not working"
```bash
# Check Claude Desktop settings
# Ensure MCP tools are configured
# Some features work without MCPs (with degraded functionality)
```

#### "Channel.md not updating"
```bash
# Check file permissions
# Ensure .workflow/context/ directory exists
# Try: orchestrator> test
```

## FAQ

### Q: Do I need multiple monitors for multi-agent?
A: No! Use terminal tabs or split screen. VS Code's integrated terminal works great.

### Q: Can I use this with existing projects?
A: Yes! Use `/vibe-retrofit-existing` or `/vibe-feature-ideate` commands.

### Q: How many agents should I use?
A: Start with 3-4. More agents = more parallel work but more complexity.

### Q: What if I don't have MCP tools?
A: The system still works! Some features degrade gracefully without MCPs.

### Q: Can agents work overnight?
A: Agents pause when waiting for input. They're interactive, not fully autonomous.

### Q: How do I customize agents?
A: Create YAML files in `multi-agent/agents/` directory. See examples provided.

### Q: Is this production-ready?
A: The generated code is production-ready. The tool itself is for development.

## Next Steps

1. **Try the Basics**: Start with `/vibe-init` and single agent
2. **Experiment with Multi-Agent**: Even 2-3 agents speed up work
3. **Read Generated Docs**: Learn from what the system creates
4. **Join the Community**: Share your experiences and get help
5. **Contribute**: Help improve the system!

---

## 🎉 Congratulations!

You're now ready to use Vibe Coding Claude! Remember:
- Single agent = Learning and small projects
- Multi-agent = Speed and complex projects
- Always read the generated documentation
- Have fun building amazing things!

Need help? The orchestrator is always ready with the `help` command!