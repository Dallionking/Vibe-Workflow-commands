# Claude Vibe 🚀

Transform your development process with AI-powered slash commands that implement the complete Vibe Coding methodology in Claude - now with **Multi-Agent Collaboration System** that turns Claude Code into a coordinated AI development team!

## 🎯 What is this?

A comprehensive system of slash commands for Claude that includes:

1. **Full Vibe Coding Methodology** - Automates all 10 steps from ideation to production
2. **Multi-Agent Collaboration System** - Run multiple Claude Code instances as specialized agents working together
3. **YAML-Based Agent System** - Feature-level development, retrofitting, and dynamic agent generation
4. **Service Auto-Connection** - Automatically connects databases, APIs, and monitoring tools
5. **Claude.md Agent Configuration** - Transforms Claude into a specialized project assistant

This unified system works with both new projects AND existing codebases, providing multiple entry points for different development scenarios.

## 🆕 NEW: Fully Automated Multi-Agent System

Turn multiple Claude Code instances into a **completely autonomous AI development team**! **Zero manual intervention required** - agents automatically coordinate, communicate, and execute tasks based on your high-level commands.

### Revolutionary Features
- **🚀 Zero Manual Prompting**: Give one command, agents work automatically
- **🧠 Intelligent Task Breakdown**: Orchestrator analyzes and assigns tasks intelligently  
- **⚡ Real-time Coordination**: Agents communicate and coordinate seamlessly
- **🔄 Automatic Execution**: UltraThink, implementation, testing happen automatically
- **📊 Progress Tracking**: Real-time status updates and completion notifications

### Quick Demo
```bash
# Terminal 1 - Start orchestrator
/orchestrate

# Give high-level command, watch agents work automatically:
task implement user authentication system

# Magic happens:
# → research-agent: Auto-executes UltraThink analysis
# → coding-agent: Auto-implements based on research  
# → testing-agent: Auto-validates with 95%+ coverage
# → No manual prompting needed!
```

## ✨ Features

- **Automated Workflow**: Progress through all 10 Vibe Coding steps with simple slash commands
- **Multi-Agent Collaboration**: Run specialized AI agents in parallel for faster development
- **MCP Integration**: Leverages Context7, Perplexity, and other MCP tools for research
- **Context Preservation**: Each step builds on previous outputs automatically
- **Real-time Coordination**: Agents communicate through channel.md for seamless collaboration
- **Project Management**: Automatic file creation and organization
- **Quality Assurance**: Built-in 95% test coverage requirements
- **Service Auto-Init**: Automatically connect to databases, APIs, and monitoring tools
- **Claude.md Generation**: Create comprehensive AI assistant configurations

## 🚀 Quick Start

### Installation

1. Clone this repository or download the files
2. In Claude Desktop, go to Settings → Developer
3. Enable "Developer mode" if not already enabled
4. Import these commands into your Claude configuration
5. Install dependencies for multi-agent system:
   ```bash
   npm install
   ```
   (Dependencies: chokidar, js-yaml, chalk, ws - all included in package.json)

### Basic Usage

Start a new project:
```
/vibe-init my-awesome-saas
/vibe-step-1-ideation
```

### Multi-Agent Usage (FULLY AUTOMATED!)

#### Option 1: Complete Setup (Recommended)
```bash
# Terminal 1 - Initialize multi-agent system
/multi-agent

# Follow setup instructions to open additional terminals:
# Terminal 2: /agent research-agent --terminal-id=2  
# Terminal 3: /agent coding-agent --terminal-id=3
# Terminal 4: /agent testing-agent --terminal-id=4

# Then start orchestrator in Terminal 1:
/orchestrate
```

#### Option 2: Quick Start (Direct to Orchestrator)
```bash
# If .workflow/ already exists from previous setup:
/orchestrate

# Give commands like:
task implement authentication system
task optimize database queries
workflow feature-development
```

## 📋 Complete Command Reference

### Core Vibe Coding Commands

| Step | Command | Description | MCP Tools Used |
|------|---------|-------------|----------------|
| Init | `/vibe-init [project-name]` | Initialize a new Vibe Coding project | GitHub |
| 1 | `/vibe-step-1-ideation` | Project ideation and specification | Context7, Perplexity |
| 2 | `/vibe-step-2-architecture` | Technical architecture planning | Context7, Perplexity |
| 3 | `/vibe-step-3-ux-design` | UX/UI design specifications | Perplexity |
| 4 | `/vibe-step-4-design-system` | Design system creation | - |
| 5 | `/vibe-step-5-interface-states` | Interface state specifications | - |
| 6 | `/vibe-step-6-technical-spec` | Technical specification | Context7 |
| 7 | `/vibe-step-7-landing-page` | Landing page creation (3 parts) | Perplexity |
| 8 | `/vibe-step-8-vertical-slices` | Development phase slicing | Context7, TaskMaster |
| 9 | `/vibe-step-9-claude-md` | Generate Claude.md configuration | Sequential Thinking |
| 10 | `/vibe-step-10-init-services` | Auto-initialize all services | All project MCPs |
| - | `/vibe-status` | Check project progress | - |
| - | `/vibe-init-services` | Quick access to service init | All project MCPs |

### Multi-Agent Commands (FULLY AUTOMATED!)

| Command | Description | Features |
|---------|-------------|----------|
| `/multi-agent` | Initialize multi-agent system | Creates .workflow/, shows setup instructions |
| `/orchestrate` | Start automated orchestrator | **Auto-executes tasks, intelligent coordination** |
| `/agent [name] --terminal-id=[N]` | Start specialized agent | **Auto-monitors, auto-executes assigned tasks** |
| `/re-channel [agent] [time]` | **NEW**: Comprehensive QA validation | **Validates all claimed work, catches half-implementations** |

#### Agent Types Available:
- **research-agent**: Auto-executes UltraThink, gathers best practices
- **coding-agent**: Auto-implements features, creates infrastructure  
- **testing-agent**: Auto-validates code, ensures 95%+ coverage
- **frontend-agent**: Auto-creates UI components and styling
- **backend-agent**: Auto-implements APIs and server logic

#### Orchestrator Commands (Zero Manual Intervention):
```bash
# In orchestrator terminal - agents work automatically:
task [description]           # Intelligent task breakdown and assignment
workflow [name]             # Execute multi-agent workflows  
status                      # Show all agent status and progress
help                        # Show available commands
```

#### QA Validation Commands:
```bash
# Comprehensive quality assurance:
/re-channel                 # Validate all recent agent work
/re-channel coding-agent    # Validate specific agent's work
/re-channel all last-1h     # Validate last hour's work
/re-channel all last-7d     # Validate last week's work
```

**Key Features of `/re-channel`:**
- 🔍 **Validates All Claims**: Checks every completion claim in channel.md
- 📁 **File Verification**: Ensures all mentioned files exist and contain real code
- 🔗 **Integration Testing**: Validates file relationships and dependencies
- 🧪 **Functional Verification**: Tests that claimed features actually work
- 📊 **Gap Analysis**: Identifies missing implementations and half-completed work
- 🎯 **Actionable Reports**: Provides specific fix recommendations
- ⚡ **Automatic QA**: Catches the "half-implemented" problem automatically

### YOLO Commands (Zero-Friction Phase Execution) 🚀

**NEW**: Execute complete phases with zero permission prompts while maintaining full quality!

| Command | Description | Features |
|---------|-------------|----------|
| `/yolo local [options]` | Execute phases locally with full automation | Zero prompts, full quality, dynamic phase support |
| `/yolo docker [options]` | Execute phases in Docker container | Clean environment, reproducible, auto-installation |

#### Common Options:
```bash
--phase=N                    # Execute specific phase (default: current)
--tier=N                     # Execute specific tier only (1, 2, or 3)
--verbose                    # Show detailed command execution
--dry-run                    # Preview what would be executed
```

#### Docker-specific Options:
```bash
--rebuild                    # Force rebuild of Docker image
--no-cache                   # Build Docker image without cache
--keep-container             # Keep container after execution
```

#### Safety Options:
```bash
--emergency-stop             # Create periodic checkpoints
--interval=N                 # Checkpoint interval in minutes (default: 5)
```

#### YOLO Examples:
```bash
# Execute current phase locally
/yolo local

# Execute specific phase with verbose output
/yolo local --phase=2 --verbose

# Execute in Docker container
/yolo docker --phase=1 --rebuild

# Preview execution plan
/yolo docker --dry-run

# Execute single tier only
/yolo local --tier=1 --verbose
```

## 🤖 Multi-Agent System Guide

### How It Works

1. **Orchestrator (Terminal 1)**: Your command center - you interact here
2. **Worker Agents (Other Terminals)**: Specialized agents that execute tasks
3. **channel.md**: Communication hub where agents coordinate
4. **Automatic Coordination**: Agents work together based on their specialties

### Example Multi-Agent Workflow

```bash
# Terminal 1 (You talk here)
orchestrator> task implement user authentication

# The system automatically:
# - Assigns research to research-agent
# - Coordinates implementation across coding agents
# - Runs tests with testing-agent
# - All visible in channel.md!
```

### Agent Types

- **Research Agent**: Gathers information and best practices
- **Coding Agents**: Implement features (frontend/backend)
- **Testing Agent**: Writes and runs tests
- **Documentation Agent**: Creates documentation
- **Specialized Agents**: Custom agents for your project needs

## 🔄 Additional YAML-Based Commands

The system now includes powerful YAML-based agents for specific scenarios:

### Feature-Level Development
| Command | Description | Use Case |
|---------|-------------|----------|
| `/vibe-feature-ideate` | Add features to existing projects | When you need to add a feature without full project rebuild |
| `--quick` | Skip research steps | For simple, well-understood features |
| `--skip-research` | Skip external research | When you have all requirements defined |

### Codebase Retrofitting
| Command | Description | Use Case |
|---------|-------------|----------|
| `/vibe-retrofit-existing` | Transform chaotic codebases | When inheriting messy projects |
| `--mode full` | Complete analysis and transformation | For comprehensive retrofitting |
| `--generate-agents` | Create custom agents for the codebase | For unique project patterns |

### Dynamic Agent Generation
| Command | Description | Use Case |
|---------|-------------|----------|
| `/vibe-generate-agents` | Create custom agents from patterns | When standard agents don't fit |
| `--analyze-codebase` | Learn from existing code | To match current patterns |
| `--workflow-type` | Specify agent purpose | For targeted agent creation |

## 🔧 Requirements

- Claude Desktop App (latest version)
- Node.js (for multi-agent system)
- MCP Tools configured:
  - **Core Tools** (Required):
    - Context7 (for documentation)
    - Perplexity (for research)
    - GitHub (for version control)
    - Sequential Thinking (for planning)
  - **Optional Tools** (Project-specific):
    - TaskMaster (task management)
    - Digital Ocean (if using DO)
    - Supabase (if using Supabase)
    - Slack (team notifications)
    - Linear (project management)
    - Magic UI (component generation)

## 📁 Complete Project Structure

### Generated Project Structure
```
your-project/
├── docs/
│   └── vibe-coding/
│       ├── 01-project-specification.md
│       ├── 02-technical-architecture.md
│       ├── 02-services-config.json      # Service configurations
│       ├── 03-ux-ui-design.md
│       ├── 04-design-system.md
│       ├── 05-interface-states.md
│       ├── 06-technical-specification.md
│       ├── 06-service-integrations.md    # Integration specs
│       ├── 07-landing-page/
│       │   ├── avatar-research.md
│       │   ├── emotional-diary.md
│       │   └── landing-page-copy.md
│       └── 08-phase-slices/
├── phases/
│   ├── phase-0-foundation.md
│   ├── phase-1-core.md
│   └── ...
├── .workflow/                             # Multi-agent workspace
│   ├── context/
│   │   ├── channel.md                     # Agent communication
│   │   ├── agents/                        # Agent contexts
│   │   └── shared/                        # Shared data
│   ├── definitions/                       # Workflow definitions
│   └── agent-setup.md                     # Setup instructions
├── .vibe/
│   ├── services.json                      # Service configuration
│   ├── init-services.log                  # Initialization logs
│   └── status.json
├── .taskmaster/
├── .claude/                               # Agent configuration files
│   ├── patterns.json
│   ├── shortcuts.yaml
│   └── behaviors.yaml
├── CLAUDE.md                              # AI Agent configuration
├── .env.local
└── [your source code]
```

### Vibe-Coding-Claude System Structure
```
vibe-coding-claude/
├── agents/
│   ├── core/              # Core system agents
│   ├── step-*/            # Step-specific agents (MD format)
│   ├── retrofit/          # Retrofit agents (MD format)
│   ├── yaml-based/        # YAML-based agents
│   └── generated/         # Auto-generated agents
├── multi-agent/           # NEW: Multi-agent system
│   ├── core/              # Core infrastructure
│   ├── agents/            # Agent definitions
│   ├── workflows/         # Workflow templates
│   └── examples/          # Example implementations
├── templates/
├── validation/
├── mcps/
├── phase-projects/
└── scripts/
```

## 🎓 Learning Path

1. **Start Simple**: Use `/vibe-init` and follow the step commands
2. **Try Multi-Agent**: Run `/multi-agent` for parallel development
3. **Explore Features**: Try feature ideation on existing projects
4. **Advanced Usage**: Create custom agents and workflows

## 📚 Documentation

- [USER-GUIDE.md](./docs/USER-GUIDE.md) - Comprehensive user guide
- [QUICK-START.md](./docs/QUICK-START.md) - Get started in 5 minutes
- [Multi-Agent Guide](./multi-agent/README.md) - Detailed multi-agent documentation
- [How It Works](./multi-agent/README-how-it-works.md) - Simple explanation of multi-agent system

## 🔥 Examples

### Simple Project
```bash
/vibe-init todo-app
/vibe-step-1-ideation
# Follow prompts...
```

### Multi-Agent Development
```bash
/multi-agent
# Opens setup wizard
# Follow instructions to set up agents
orchestrator> task implement user dashboard
# Agents collaborate automatically!
```

### Add Feature to Existing Project
```bash
cd existing-project
/vibe-feature-ideate "Add real-time notifications"
```

### Retrofit Messy Codebase
```bash
cd legacy-project
/vibe-retrofit-existing --mode full
```

## 💡 Tips

1. **Use MCP Tools**: The more MCP tools you have configured, the better the results
2. **Follow Order**: Complete steps in sequence for best results
3. **Try Multi-Agent**: For complex features, multi-agent is much faster
4. **Review Outputs**: Each step generates detailed documentation
5. **Customize Agents**: Create agents specific to your project needs

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built on the Vibe Coding methodology and powered by Claude's advanced capabilities.

---

**Ready to revolutionize your development process? Start with `/vibe-init` or jump into multi-agent with `/multi-agent`!**