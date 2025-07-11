# Vibe Coding Claude Commands 🚀

Transform your development process with AI-powered slash commands that implement the complete Vibe Coding methodology in Claude - now with automatic service initialization and support for existing codebases!

## 🎯 What is this?

A comprehensive system of slash commands for Claude that includes:

1. **Full Vibe Coding Methodology** - Automates all 10 steps from ideation to production
2. **YAML-Based Agent System** - Feature-level development, retrofitting, and dynamic agent generation
3. **Service Auto-Connection** - Automatically connects databases, APIs, and monitoring tools
4. **Claude.md Agent Configuration** - Transforms Claude into a specialized project assistant

This unified system works with both new projects AND existing codebases, providing multiple entry points for different development scenarios.

## ✨ Features

- **Automated Workflow**: Progress through all 10 Vibe Coding steps with simple slash commands
- **MCP Integration**: Leverages Context7, Perplexity, and other MCP tools for research
- **Context Preservation**: Each step builds on previous outputs automatically
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

### Usage

Start a new project:
```
/vibe-init my-awesome-saas
/vibe-step-1-ideation
```

Follow the prompts and let the AI guide you through each step!

## 📋 Complete Command Reference

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
├── .vibe/
│   ├── services.json                     # Service configuration
│   ├── init-services.log                 # Initialization logs
│   └── status.json
├── .taskmaster/
├── .claude/                              # Agent configuration files
│   ├── patterns.json
│   ├── shortcuts.yaml
│   └── behaviors.yaml
├── CLAUDE.md                             # AI Agent configuration
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
│   ├── yaml-based/        # YAML agent system
│   │   ├── feature-ideation/
│   │   │   ├── ideation-orchestrator.yaml
│   │   │   ├── clarification-agent.yaml
│   │   │   └── ...
│   │   └── retrofit/
│   │       ├── api-endpoint-orchestrator.yaml
│   │       └── ...
│   └── agent-generator/   # Dynamic agent creation
├── commands/              # Command documentation
│   ├── vibe-feature-ideate.md
│   ├── vibe-retrofit-existing.md
│   └── vibe-generate-agents.md
├── docs/
│   ├── extensions/        # Extended documentation
│   └── ...
├── templates/
└── examples/
```

## 🎓 The Complete Vibe Coding Methodology

Vibe Coding is a systematic, AI-first approach to software development:

1. **Ideation** → Transform vague ideas into detailed specifications
2. **Architecture** → Design scalable, maintainable systems
3. **UX Design** → Create user-centered interfaces
4. **Design System** → Build consistent visual language
5. **Interface States** → Specify every possible user interaction
6. **Technical Spec** → Document complete implementation details
7. **Landing Page** → Create high-converting marketing pages
8. **Vertical Slices** → Break into manageable development phases
9. **Claude.md Generation** → Create comprehensive AI assistant rules
10. **Service Initialization** → Auto-connect all development services

Each step builds on the previous, creating a comprehensive blueprint for development with automatic environment setup.

## 🔌 Service Auto-Initialization (NEW!)

Step 10 automatically handles:

### Database Connections
- Google Cloud SQL/Firestore
- Digital Ocean Databases
- Supabase
- PostgreSQL/MongoDB
- Redis Cache

### Authentication Services
- Firebase Auth
- Auth0
- Clerk
- Custom JWT

### Monitoring & Analytics
- Sentry (error tracking)
- Google Analytics
- Mixpanel
- Application Insights

### Cloud Services
- AWS (S3, Lambda, etc.)
- Google Cloud Platform
- Digital Ocean
- Vercel/Netlify

### Development Tools
- GitHub/GitLab
- Linear/Jira
- Slack notifications
- CI/CD pipelines

## 🤖 Claude.md Auto-Configuration (NEW!)

Step 9 generates a comprehensive Claude.md that:
- Runs service initialization on project open
- Maintains consistent coding standards
- Provides project-specific rules and guidelines
- Includes quick reference commands
- Handles common troubleshooting

## 📚 Documentation

- [Installation Guide](docs/installation.md)
- [Command Reference](docs/commands.md)
- [MCP Integration Guide](docs/mcp-integration.md)
- [Service Configuration Guide](docs/service-config.md)
- [Contributing Guide](CONTRIBUTING.md)

## 🚦 Typical Workflow

1. **Initialize**: `/vibe-init my-project`
2. **Ideation**: `/vibe-step-1-ideation` (Define what you're building)
3. **Architecture**: `/vibe-step-2-architecture` (Design the system)
4. **UX Design**: `/vibe-step-3-ux-design` (Create user experiences)
5. **Design System**: `/vibe-step-4-design-system` (Visual consistency)
6. **Interface States**: `/vibe-step-5-interface-states` (Every interaction)
7. **Technical Spec**: `/vibe-step-6-technical-spec` (Complete blueprint)
8. **Landing Page**: `/vibe-step-7-landing-page` (Marketing ready)
9. **Phase Slices**: `/vibe-step-8-vertical-slices` (Development plan)
10. **Claude Config**: `/vibe-step-9-claude-md` (AI assistant setup)
11. **Auto-Init**: `/vibe-step-10-init-services` (Connect everything)
12. **Start Coding**: With everything connected and configured!

## 🤝 Contributing

We welcome contributions! Feel free to:
- Add new commands
- Improve existing agents
- Add service integrations
- Share your success stories
- Report issues

## 📄 License

MIT License - use freely in your projects!

## 🙏 Acknowledgments

Created by the Vibe Coding community. Special thanks to all contributors who've made this methodology accessible to everyone.

---

**Ready to revolutionize your development process? Start with `/vibe-init` and let AI guide you to success! 🚀**

*No more copy-paste. No more manual reconnections. Just pure, AI-powered development flow.*