# Vibe Coding Claude Commands 🚀

Transform your development process with AI-powered slash commands that implement the complete Vibe Coding methodology in Claude - now with automatic service initialization!

## 🎯 What is this?

A collection of slash commands for Claude that automates the entire Vibe Coding development methodology - from initial ideation to production-ready code with automatic service connections. No more copying and pasting between AI tools or manually reconnecting services every session!

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

### 🚀 Project Initialization
| Command | Description | Details |
|---------|-------------|---------|  
| `/vibe-init <project-name>` | Initialize new project | Creates project structure with context engineering, git setup, and templates |
| `/vibe-retrofit` | Retrofit existing project | Analyzes codebase, learns patterns, creates compatibility layer |
| `/vibe-mcp-setup` | Setup MCP tools | Configure Context7, Perplexity, GitHub, and other MCPs |

### 📋 10-Step Vibe Methodology  
| Step | Command | Description | MCP Tools |
|------|---------|-------------|----------|
| 1 | `/vibe-step-1-ideation` | Feature ideation with AI research, market analysis, user personas | Context7, Perplexity |
| 2 | `/vibe-step-2-architecture` | System architecture design with tech stack selection | Context7, Perplexity |
| 2.5 | `/vibe-step-2.5-mcp-setup` | MCP tool configuration and integration | All MCPs |
| 3 | `/vibe-step-3-ux-design` | UX/UI design specifications and user flows | Perplexity |
| 4 | `/vibe-step-4-design-system` | Design system creation with tokens and components | - |
| 5 | `/vibe-step-5-interface-states` | Interface state specifications for all interactions | - |
| 6 | `/vibe-step-6-technical-spec` | Technical specification with API design, database schema | Context7 |
| 7 | `/vibe-step-7-landing-page` | Landing page creation (3-part process) | Perplexity |
| 8 | `/vibe-step-8-vertical-slices` | Development phase slicing with Universal Format | Context7, TaskMaster |
| 9 | `/vibe-step-9-claude-md` | Generate intelligent CLAUDE.md configuration | Sequential Thinking |
| 10 | `/vibe-step-10-init-services` | Auto-initialize all project services | All project MCPs |

### 🎯 Phase Management
| Command | Description | Features |
|---------|-------------|----------|
| `/vibe-phase current` | Show current phase status | View active tier, completed tasks, progress |
| `/vibe-phase start <N>` | Start phase N implementation | Creates branch, sets up tracking |
| `/vibe-phase complete` | Mark current phase complete | Validates all tasks, creates checkpoint |
| `/vibe-subtask complete <N.M>` | Complete specific subtask | Updates progress, validates dependencies |
| `/vibe-mark-task-complete` | Mark tasks complete in phase docs | `--task=1.1`, `--all-tier=1`, `--interactive` |
| `/vibe-reformat-phases` | Upgrade existing phases to enhanced format | Adds context layer, UI healing, pattern learning |

### ✅ Validation & Quality Assurance
| Command | Description | Options |
|---------|-------------|---------|  
| `/vibe-validate-work` | Comprehensive validation | `--strict` for 95%+ coverage requirement |
| `/vibe-ui-healer` | UI quality validation & healing | `--autoFix`, `--threshold=8`, `--browsers=all` |
| `/vibe-test-runner` | Run all test suites | Includes unit, integration, e2e tests |
| `/vibe-test-browsers` | Cross-browser testing | Chrome, Firefox, Safari, Edge testing |
| `/vibe-test-accessibility` | WCAG compliance testing | Full accessibility audit |
| `/vibe-test-performance` | Lighthouse performance audits | Core Web Vitals analysis |
| `/vibe-test-visual-regression` | Visual regression testing | Screenshot comparison |

### 🧠 Context Engineering  
| Command | Description | Actions |
|---------|-------------|---------|  
| `/vibe-context show` | Display context statistics | View tokens, layers, cache stats |
| `/vibe-context update` | Update context layers | Refresh global, phase, task contexts |
| `/vibe-context optimize` | Optimize for performance | Compress, deduplicate, prioritize |
| `/vibe-context learn` | View learning insights | Pattern recognition, suggestions |
| `/vibe-context reset` | Reset context layers | Clear cache, reset to defaults |
| `/vibe-learn insights` | AI learning insights | View learned patterns, improvements |

### 🔧 Utility Commands
| Command | Description | Purpose |
|---------|-------------|---------|  
| `/vibe-status` | Project progress overview | Shows completed steps, current phase |
| `/vibe-doctor` | System health check | MCP connections, dependencies, issues |
| `/vibe-export` | Export documentation | Generate PDF/HTML documentation |
| `/vibe-update` | Update existing steps | Refresh with latest patterns |
| `/vibe-mcp-status` | Check MCP connections | Verify all tools are connected |
| `/vibe-changelog` | View change history | Track all project modifications |
| `/vibe-features` | Feature status tracker | Shows completed/planned features |
| `/vibe-timeline` | Project timeline view | Visual progress representation |

### 🧹 Cleanup & Maintenance  
| Command | Description | Features |
|---------|-------------|----------|  
| `/vibe-cleanup-repo` | Repository cleanup orchestrator | Analyzes and cleans codebase |
| `/vibe-cleanup-analyze` | Analyze cleanup opportunities | Find unused code, duplicates |
| `/vibe-cleanup-risk` | Assess cleanup risks | Safety analysis before cleanup |
| `/vibe-cleanup-execute` | Execute cleanup plan | Safe removal with backups |
| `/vibe-cleanup-code` | Code quality improvements | Refactoring, optimization |

### 🔄 Version Management
| Command | Description | Actions |
|---------|-------------|---------|  
| `/vibe-version create` | Create new version | Tag current state with metadata |
| `/vibe-version list` | List all versions | Show version history |
| `/vibe-version compare` | Compare versions | Diff between versions |
| `/vibe-version rollback` | Rollback to version | Safe restoration with validation |

### ⚔️ Conflict Resolution  
| Command | Description | Resolves |
|---------|-------------|----------|  
| `/vibe-resolve-conflicts` | Main conflict resolver | All types of conflicts |
| `/vibe-detect-conflicts` | Detect all conflicts | File, step, phase conflicts |
| `/vibe-conflict-report` | Generate conflict report | Detailed analysis |

### 🏗️ Setup & Configuration
| Command | Description | Configures |
|---------|-------------|------------|  
| `/vibe-setup-rollback` | Configure rollback system | Automated rollback capability |
| `/vibe-setup-github-rollback` | GitHub Actions rollback | CI/CD rollback integration |
| `/vibe-setup-monitoring` | Health monitoring setup | Real-time monitoring |
| `/vibe-setup-logging` | Logging system setup | Comprehensive logging |
| `/vibe-setup-browser-testing` | Browser testing setup | Playwright configuration |

### 🎭 Landing Page Creation (Step 7)  
| Command | Description | Creates |
|---------|-------------|---------|  
| `/vibe-landing-avatar` | Customer avatar research | Detailed user personas |
| `/vibe-landing-diary` | Emotional diary creation | Day-in-life narratives |
| `/vibe-landing-copy` | Landing page copy | Optimized marketing content |

### 🤖 Multi-Agent Collaboration
| Command | Description | Function |
|---------|-------------|----------|  
| `/multi-agent` | Initialize multi-agent system | Sets up collaboration infrastructure |
| `/orchestrate` | Start orchestrator | Manages task distribution and coordination |
| `/agent <name> --terminal-id=<N>` | Start specialized agent | Launch specific agent instance |

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

```
your-project/
├── docs/
│   └── vibe-coding/
│       ├── 01-project-specification.md
│       ├── 02-technical-architecture.md
│       ├── 02-services-config.json      # NEW: Service configurations
│       ├── 03-ux-ui-design.md
│       ├── 04-design-system.md
│       ├── 05-interface-states.md
│       ├── 06-technical-specification.md
│       ├── 06-service-integrations.md    # NEW: Integration specs
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
│   ├── services.json                     # NEW: Service configuration
│   ├── init-services.log                 # NEW: Initialization logs
│   └── status.json
├── .taskmaster/
├── claude.md                             # NEW: Generated in Step 9
├── .env.local
└── [your source code]
```

## 🔄 Retrofitting Existing Projects

The `/vibe-retrofit` command helps you transform existing projects to use the Vibe methodology:

### Features:
- **Intelligent Analysis**: Scans your codebase to understand structure and patterns
- **Incremental Adoption**: Start with small parts of your codebase
- **Compatibility Layer**: Works alongside your existing workflow
- **Pattern Learning**: Learns from your code style and conventions

### Usage:
```bash
# Analyze existing project
/vibe-retrofit --analyze

# Start retrofitting with specific feature
/vibe-retrofit --feature="user-authentication"

# Generate retrofit plan
/vibe-retrofit --plan
```

## 🤖 Multi-Agent Collaboration System

Transform Claude into a team of specialized AI agents working together:

### Available Agents:
- **Research Agent**: Gathers documentation, best practices, and solutions
- **Architect Agent**: Designs system architecture and technical decisions
- **Coding Agent**: Implements features with high-quality code
- **Testing Agent**: Ensures 95%+ test coverage and quality
- **UI/UX Agent**: Handles frontend and design implementation

### Multi-Agent Workflow:
```bash
# Terminal 1: Initialize system
/multi-agent

# Terminal 2-4: Start specialized agents
/agent research-agent --terminal-id=2
/agent coding-agent --terminal-id=3
/agent testing-agent --terminal-id=4

# Terminal 1: Start orchestrator
/orchestrate

# Assign complex tasks
task: implement complete authentication system with JWT
```

### Benefits:
- **Parallel Development**: Multiple agents work simultaneously
- **Specialized Expertise**: Each agent focuses on their domain
- **Automatic Coordination**: Agents communicate through shared context
- **Complex Task Handling**: Break down large projects automatically

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

## 📊 Universal Vertical Slice Format

The heart of Vibe development - phases organize work into complete, shippable features:

### Enhanced Phase Structure

Each phase uses the **Context-Enhanced Universal Format** with intelligent learning and automation:

```markdown
# Phase X: Feature Name

## Context Assembly Layer (NEW)
```yaml
context_requirements:
  global_context:
    - Project conventions from CLAUDE.md v2.0
    - Detected patterns: [Auto-detected from codebase]
    - Team preferences: [Learned from previous phases]
  phase_dependencies:
    - Phase X: [Previous phase] (status)
    - Required: [Dependencies from previous phases]
```

## Performance Reference Points (PRPs)
- UltraThink integration for intelligent planning
- Automated task breakdown and estimation
- Pattern-aware recommendations

## Tier 1: Foundation (Days 1-3)
- [ ] Infrastructure setup with context awareness
- [ ] Database schema using learned patterns
- [ ] API endpoints following project conventions
- [ ] Basic components with design system integration
- [ ] UI Healing checkpoint: `/vibe-ui-healer --tier=1`
- [ ] Git checkpoint with pattern validation

## Tier 2: Enhancement (Days 4-6)
- [ ] Feature implementation with pattern compliance
- [ ] Business logic following project conventions
- [ ] UI components with automatic healing
- [ ] Integration tests with 95%+ coverage
- [ ] UI Healing checkpoint: `/vibe-ui-healer --tier=2`
- [ ] Git checkpoint with quality gates

## Tier 3: Polish (Days 7-9)
- [ ] UI/UX refinement with design system compliance
- [ ] Performance optimization using learned patterns
- [ ] Documentation with auto-generated examples
- [ ] Final testing and accessibility validation
- [ ] UI Healing checkpoint: `/vibe-ui-healer --tier=3`
- [ ] Final git checkpoint with release preparation

## Validation Gates (Enhanced)
- [ ] `/vibe-validate-progress` before tier completion
- [ ] `/vibe-validate-quality` before phase completion
- [ ] All UI Healing checkpoints passed (score ≥ 8)
- [ ] Pattern compliance verified
- [ ] Context learning updates applied
```

### Working with Phases

**1. View Current Phase:**
```bash
/vibe-phase current
# Shows: Active phase, current tier, completed tasks
```

**2. Start Implementation:**
```bash
/vibe-phase start 1
# Creates: feature/phase-1-[feature-name] branch
# Sets up: Task tracking, validation gates
```

**3. Complete Subtasks:**
```bash
/vibe-subtask complete 1.1
# Updates: Progress tracking
# Validates: Dependencies and prerequisites

# Alternative: Mark tasks complete manually
/vibe-mark-task-complete --task="1.1"
# Marks: Task 1.1 as [x] complete in phase document
# Updates: Progress tracking and git commit

# Interactive task completion
/vibe-mark-task-complete --interactive
# Shows: List of all incomplete tasks
# Allows: Multi-select completion

# Complete entire tier
/vibe-mark-task-complete --all-tier=1
# Marks: All Tier 1 tasks complete
# Validates: Dependencies before completion
```

**4. Phase Validation Gates:**
Before phase completion, these must pass:
- ✅ All subtasks marked [x] complete
- ✅ 95%+ test coverage achieved
- ✅ UI healing validation passed
- ✅ Documentation updated
- ✅ Git checkpoints created
- ✅ No critical issues

**5. Complete Phase:**
```bash
/vibe-phase complete
# Runs: All validation gates
# Creates: Git tag and release notes
# Suggests: Next phase to start
```

### Phase Benefits
- **Complete Features**: Each phase delivers working functionality
- **Quality Gates**: Automated validation ensures standards
- **Clear Progress**: Visual tracking of completion
- **Git Integration**: Automatic branching and tagging
- **Team Coordination**: Clear handoffs between phases

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

## 🎨 UI Healer - Automated UI Quality System

The UI Healer is your comprehensive UI quality assurance system that ensures every interface meets the highest standards:

### What It Does

**Automated Testing:**
- 🌐 Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- 📱 Mobile responsive testing
- ♿ WCAG accessibility compliance
- 📸 Visual regression testing
- ⚡ Performance optimization
- 🎯 Design system compliance

**Self-Healing Capabilities:**
- Automatically fixes common UI issues
- Adjusts spacing and alignment
- Ensures color contrast compliance
- Fixes keyboard navigation
- Optimizes responsive breakpoints
- Updates deprecated patterns

### Usage

**Basic UI Healing:**
```bash
/vibe-ui-healer
# Scans all UI components
# Grades against design system (0-10 scale)
# Applies automatic fixes if score < 8
```

**Advanced Options:**
```bash
/vibe-ui-healer --pages="dashboard,settings" --threshold=9
# Target specific pages
# Set higher quality threshold

/vibe-ui-healer --browsers="chrome,safari" --visual-regression
# Test specific browsers
# Include visual regression tests

/vibe-ui-healer --accessibility --fix-auto
# Focus on accessibility
# Apply all automatic fixes
```

### Quality Scoring

Components are graded on:
1. **Design System Compliance** (30%)
2. **Accessibility** (25%)
3. **Responsive Design** (20%)
4. **Performance** (15%)
5. **Cross-Browser** (10%)

### Integration with Workflow

The UI Healer is automatically run:
- After each phase completion
- Before deployment
- As part of `/vibe-validate-work`
- In continuous integration

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