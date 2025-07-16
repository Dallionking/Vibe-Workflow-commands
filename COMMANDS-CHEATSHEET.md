# Claude Vibe Commands Cheatsheet 🚀

Comprehensive reference guide for all 105+ Claude Vibe commands organized by category.

## 🎯 Core Vibe Coding Workflow

### Project Initialization
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-init` | Initialize a new Vibe Coding project | `[project-name]`, `[template-type]` |
| `/vibe-status` | Check project progress and next steps | None |
| `/vibe-doctor` | Diagnose and fix project issues | None |

### 10-Step Development Process
| Step | Command | Description | MCP Tools |
|------|---------|-------------|-----------|
| 1 | `/vibe-step-1-ideation` | Project ideation and specification | Context7, Perplexity |
| 2 | `/vibe-step-2-architecture` | Technical architecture planning | Context7, Perplexity |
| 2.5 | `/vibe-step-2.5-mcp-setup` | Auto-analyze and install MCP tools | Perplexity, Context7 |
| 3 | `/vibe-step-3-ux-design` | User experience design | Context7 |
| 4 | `/vibe-step-4-design-system` | Build comprehensive design system | None |
| 5 | `/vibe-step-5-interface` | Create interface state specifications | None |
| 6 | `/vibe-step-6-technical` | Generate technical specification | Context7, Perplexity, Sequential Thinking |
| 7 | `/vibe-step-7-landing` | Create landing page (3-part process) | See Landing Page section |
| 8 | `/vibe-step-8-slices` | Create Context-Enhanced Universal Format vertical slices 🆕 | Context7, Perplexity, TaskMaster, Sequential Thinking |
| 9 | `/vibe-step-9-claude-md` | Generate Claude.md configuration | Sequential Thinking |
| 10 | `/vibe-step-10-init-services` | Auto-initialize all project services | All project MCPs |

### Quick Access Commands
| Command | Description |
|---------|-------------|
| `/vibe-mcp-setup` | Quick access: MCP auto-installation |
| `/vibe-init-services` | Quick access: Initialize all project services |

## 🧩 Step 6: Technical Specification Sub-Commands
| Command | Description | Purpose |
|---------|-------------|---------|
| `/vibe-step-6-feature-analysis` | Analyze features and create Priority Matrix | Foundation for all other sub-specs |
| `/vibe-step-6-api-design` | Create comprehensive API specifications | RESTful API design and documentation |
| `/vibe-step-6-database-schema` | Design database schema and architecture | Data modeling and relationships |
| `/vibe-step-6-security-compliance` | Create security architecture framework | Security protocols and compliance |
| `/vibe-step-6-integration-specs` | Design external service integrations | Third-party service connections |

## 🎨 Step 7: Landing Page Sub-Commands
| Command | Description | Purpose |
|---------|-------------|---------|
| `/vibe-landing-avatar` | Research customer avatars (5 awareness stages) | Customer research and personas |
| `/vibe-landing-diary` | Create emotional diary entries | Understand customer pain points |
| `/vibe-landing-copy` | Generate optimized landing page copy | Convert research into persuasive copy |

## 📊 Step 8: Vertical Slices Sub-Commands
| Command | Description | Purpose |
|---------|-------------|---------|
| `/vibe-step-8-feature-analysis` | Analyze features for dynamic phase creation | Plan Universal Format phases |
| `/vibe-step-8-phase-generation` | Generate Universal Format vertical slices | Create implementation phases |
| `/vibe-step-8-validation` | Validate phases for completeness | Ensure Universal Format compliance |

## 🤖 Multi-Agent System

### Enhanced MCP-Native Commands 🆕
| Command | Description | Features |
|---------|-------------|----------|
| `/vibe-multi-agent-enhanced` | Initialize enhanced multi-agent system | MCP server, virtual agents, single session |
| `/coordinateUltraThink` | 5-agent intelligent coordination | Generates Mermaid diagrams automatically |
| `/sendVibeMessage` | Send messages via MCP bus | Persistent SQLite communication |
| `/getVibeProjectStatus` | Check system status with memory | Shows agent states and coordination |
| `/checkVibeMessages` | Check messages in specific room | Intelligent routing and filtering |

### Legacy Multi-Terminal Commands (Still Supported)
| Command | Description | Features |
|---------|-------------|----------|
| `/multi-agent` | Initialize old multi-terminal system | Creates .workflow/, setup instructions |
| `/agent [name] --terminal-id=[N]` | Start agent in separate terminal | Manual coordination required |
| `/orchestrate` | Start orchestrator | Works with both new and old systems |

### Virtual Agent Types (All in Single Session)
- **Architect Agent**: System design, generates Mermaid diagrams 🆕
- **Research Agent**: Uses Context7/Perplexity for best practices
- **Coder Agent**: Implementation planning and code structure
- **Testing Agent**: Validates code, ensures 95%+ coverage
- **Context Agent**: Pattern analysis and consistency checking

### Orchestrator Commands (Zero Manual Prompting)
```bash
# In orchestrator terminal - agents work automatically:
task [description]           # Intelligent task breakdown and assignment
workflow [name]             # Execute multi-agent workflows
status                      # Show all agent status and progress
help                        # Show available commands
```

### QA Validation Commands (NEW)
| Command | Description | Features |
|---------|-------------|----------|
| `/re-channel` | Validate all recent agent work | Comprehensive QA validation |
| `/re-channel [agent]` | Validate specific agent's work | Targeted validation |
| `/re-channel all [time]` | Validate work in time window | `last-1h`, `last-7d`, etc. |

**Key Features of `/re-channel`:**
- 🔍 Validates all completion claims in channel.md
- 📁 Ensures all mentioned files exist with real code
- 🔗 Validates file relationships and dependencies
- 🧪 Tests that claimed features actually work
- 📊 Identifies missing implementations and gaps
- 🎯 Provides specific fix recommendations

## 🚀 YOLO Commands (Zero-Friction Execution)

### Core YOLO Commands
| Command | Description | Features |
|---------|-------------|----------|
| `/yolo local [options]` | Execute phases locally with full automation | Zero prompts, full quality |
| `/yolo docker [options]` | Execute phases in Docker container | Clean environment, reproducible |

### Common Options
```bash
--phase=N                    # Execute specific phase (default: current)
--tier=N                     # Execute specific tier only (1, 2, or 3)
--verbose                    # Show detailed command execution
--dry-run                    # Preview what would be executed
```

### Docker-specific Options
```bash
--rebuild                    # Force rebuild of Docker image
--no-cache                   # Build Docker image without cache
--keep-container             # Keep container after execution
```

### Safety Options
```bash
--emergency-stop             # Create periodic checkpoints
--interval=N                 # Checkpoint interval in minutes (default: 5)
```

## 🔄 YAML-Based Commands

### Feature-Level Development
| Command | Description | Options |
|---------|-------------|---------|
| `/vibe-feature-ideate` | Add features to existing projects | `--quick`, `--skip-research` |

### Codebase Retrofitting
| Command | Description | Options |
|---------|-------------|---------|
| `/vibe-retrofit-existing` | Transform chaotic codebases | `--mode full`, `--generate-agents` |

### Dynamic Agent Generation
| Command | Description | Options |
|---------|-------------|---------|
| `/vibe-generate-agents` | Create custom agents from patterns | `--analyze-codebase`, `--workflow-type` |

## 🔧 Utility Commands

### Project Management
| Command | Description | Purpose |
|---------|-------------|---------|
| `/vibe-export` | Export project for deployment/handoff | Project packaging |
| `/vibe-update` | Update a specific step with new information | `[step-number]` |
| `/ultrathink` | **🆕 Enhanced** 5-agent orchestration with codebase indexing | `[task-description]` |
| `/vibe-reformat-phases` | **🔥 NEW** Transform existing phases to context-enhanced format | `[file_path]`, `--backup`, `--dry-run` |

### Quality Assurance
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-validate-work` | Comprehensive code quality validation | `--phase`, `--feature`, `--comprehensive` |

### MCP and Status
| Command | Description | Purpose |
|---------|-------------|---------|
| `/vibe-mcp-status` | Check MCP connection status and health | MCP diagnostics |
| `/vibe-changelog` | View detailed project change history | Change tracking |
| `/vibe-features` | View feature implementation status | Feature roadmap |
| `/vibe-timeline` | View project timeline and milestones | Progress tracking |

## 🔄 Version Management
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-version` | Main version management command | See subcommands |
| `/vibe-version-create` | Create new project version | `[version-type]`, `[description]` |
| `/vibe-version-list` | List all project versions | `--format`, `--limit`, `--since` |
| `/vibe-version-compare` | Compare two project versions | `[from-version]`, `[to-version]` |
| `/vibe-version-rollback` | Rollback to previous version | `[target-version]`, `--confirm` |
| `/vibe-version-tag` | Tag current project state | `[version]`, `[description]` |

## 🛠️ Setup and Infrastructure

### Rollback Infrastructure
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-setup-rollback` | Set up rollback infrastructure | `--include-github`, `--include-database` |
| `/vibe-setup-github-rollback` | Create GitHub Actions rollback workflow | None |
| `/vibe-setup-database-rollback` | Set up database backup/rollback | `--database-type` |
| `/vibe-setup-monitoring` | Configure health monitoring | `--health-endpoint`, `--notification-webhook` |

### Logging Infrastructure
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-setup-logging` | Configure structured logging | `--cloud-provider`, `--log-level` |
| `/vibe-setup-cloud-logging` | Set up cloud logging integration | `--provider`, `--log-group` |
| `/vibe-setup-log-monitoring` | Create log monitoring and alerting | `--error-threshold`, `--alert-email` |

### Testing Infrastructure
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-setup-browser-testing` | Configure Playwright browser testing | `--browsers`, `--mobile-devices` |
| `/vibe-test-browsers` | Run comprehensive browser tests | `--browser`, `--headless`, `--mobile` |
| `/vibe-test-accessibility` | Run WCAG 2.1 AA compliance testing | `--url`, `--output-format` |
| `/vibe-test-performance` | Run Lighthouse performance audits | `--url`, `--device`, `--throttling` |
| `/vibe-test-visual-regression` | Run visual regression testing | `--baseline`, `--threshold` |
| `/vibe-test-e2e-workflow` | Run end-to-end workflow validation | `--project-type`, `--verbose` |

## 🎨 UI Testing & Healing
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-ui-healer` | **🔥 NEW** Comprehensive UI testing, browser testing, visual regression, accessibility testing, and automatic healing | `--pages`, `--threshold`, `--browsers`, `--visual-regression`, `--accessibility`, `--responsive`, `--heal`, `--mode`, `--report` |
| `/vibe-validate-work-enhanced` | **🔥 NEW** Enhanced work validation with integrated UI healing | `--phase`, `--feature`, `--comprehensive`, `--ui-healing`, `--threshold` |

**Key Features of `/vibe-ui-healer`:**
- 🌐 **Cross-browser Testing**: Chrome, Firefox, Safari, Edge, mobile browsers
- 📸 **Visual Regression**: Screenshot comparison with baseline images
- ♿ **Accessibility Testing**: WCAG 2.1 AA compliance validation
- 📱 **Responsive Design**: Multi-breakpoint testing and validation
- 🔧 **Automatic Healing**: Applies fixes when quality scores are below threshold
- 📊 **Quality Scoring**: Comprehensive UI quality assessment
- 🎯 **Design System Integration**: Validates against Step 4 design system standards

## 🧹 Repository Cleanup System
| Command | Description | Purpose |
|---------|-------------|---------|
| `/vibe-cleanup-repo` | **🔥 NEW** Coordinate comprehensive repository cleanup using specialized sub-agents | `--dry-run`, `--category`, `--aggressive`, `--confirm`, `--scope` |
| `/vibe-cleanup-research` | **🔥 NEW** Research industry best practices for repository cleanup | `--scope`, `--framework` |
| `/vibe-cleanup-architect` | **🔥 NEW** Analyze repository structure and create cleanup strategy | `--analysis-depth`, `--risk-assessment` |
| `/vibe-cleanup-coder` | **🔥 NEW** Execute safe file removal and optimization | `--execute`, `--confirm`, `--backup` |
| `/vibe-cleanup-tester` | **🔥 NEW** Validate cleanup results and ensure no functionality broken | `--test-suite`, `--regression-check` |

**Complete 4-Agent Cleanup System:**
1. **Research Agent**: Gathers cleanup best practices and safety guidelines
2. **Architect Agent**: Analyzes structure, maps dependencies, creates strategy
3. **Coder Agent**: Executes safe file removal with backup and confirmation
4. **Tester Agent**: Validates results and runs regression testing

## 🔄 Advanced Utilities
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-reformat-phases` | **🔥 NEW** Transform existing phases to new context-enhanced format | `[file_path]`, `--backup`, `--dry-run`, `--verbose` |
| `/vibe-rollback-manager` | **🔥 NEW** Advanced rollback management with automated backup | `--operation`, `--backup-id`, `--verify` |
| `/vibe-simple-rollback` | **🔥 NEW** Quick rollback operations for common scenarios | `--target`, `--confirm` |

## 🚨 Conflict Resolution
| Command | Description | Parameters |
|---------|-------------|------------|
| `/vibe-resolve-conflicts` | Main conflict resolution command | See subcommands |
| `/vibe-detect-conflicts` | Detect all project conflicts | `--type`, `--format`, `--output` |
| `/vibe-resolve-file-conflict` | Resolve file-level merge conflicts | `[file-path]`, `--strategy` |
| `/vibe-resolve-step-conflict` | Resolve workflow step conflicts | `[step-number]`, `--force-version` |
| `/vibe-resolve-phase-conflict` | Resolve phase implementation conflicts | `[phase-name]`, `--merge-strategy` |
| `/vibe-conflict-report` | Generate conflict analysis report | `--detailed`, `--recommendations` |

## 🧠 Context Engineering Commands
| Command | Description | Parameters |
|---------|-------------|------------|
| `/context-analyze` | Analyze context system state and performance | `--verbose` |
| `/context-optimize` | Optimize context system performance | None |
| `/context-validate` | Validate context system integrity | `--verbose` |

## 🆕 Latest Command Enhancements

### UltraThink 5-Agent System
- **Enhanced Architect Agent**: Now generates Mermaid architecture diagrams automatically 🆕
- **Virtual Agent Coordination**: All 5 agents work within your single Claude session
- **MCP Message Bus**: Persistent communication replacing file-based coordination
- **Pattern-Aware Solutions**: Generates code matching your existing patterns with 95%+ similarity
- **New `/coordinateUltraThink`**: Enhanced coordination with visual diagrams

### Phase Modernization
- **Step 8 Enhanced**: Now generates context-enhanced Universal Format phases
- **Legacy Transformation**: `/vibe-reformat-phases` upgrades existing phases to new format
- **Pattern Compliance**: All generated phases match your codebase patterns
- **Context Integration**: Templates automatically detect and use your project conventions

### Retrofit Command Analysis
**Question**: "Which retrofit command updates existing phases to correct format?"
**Answer**: `/vibe-reformat-phases` - This command transforms existing phase files to the context-enhanced Universal Format template from `/templates/universal-vertical-slice-format-context-enhanced.md`

## 📋 Command Categories Summary

### **Essential Commands (Start Here)**
- `/vibe-init` - Initialize new project
- `/vibe-step-1-ideation` through `/vibe-step-10-init-services` - Core workflow
- `/vibe-status` - Check progress
- `/multi-agent` - Setup multi-agent system

### **Multi-Agent Development**
- `/orchestrate` - Start orchestrator (fully automated)
- `/agent [name] --terminal-id=[N]` - Start specialized agents
- `/re-channel` - QA validation system

### **YOLO Development (Zero-Friction)**
- `/yolo local` - Execute phases locally
- `/yolo docker` - Execute in containers

### **Quality Assurance**
- `/vibe-validate-work` - Code quality validation
- `/vibe-validate-work-enhanced` - 🔥 **NEW** Enhanced validation with UI healing
- All `/vibe-test-*` commands - Comprehensive testing
- `/vibe-test-e2e-workflow` - End-to-end validation
- `/vibe-ui-healer` - 🔥 **NEW** Complete UI testing and automatic healing system

### **Project Maintenance**
- All `/vibe-version-*` commands - Version management
- All `/vibe-resolve-*` commands - Conflict resolution
- All `/vibe-setup-*` commands - Infrastructure setup
- All `/vibe-cleanup-*` commands - 🔥 **NEW** Repository cleanup system

### **Advanced Features**
- `/vibe-retrofit-existing` - Transform existing codebases
- `/vibe-reformat-phases` - 🔥 **NEW** Transform phases to enhanced format
- `/ultrathink` - **🆕 Enhanced** 5-agent orchestration with codebase indexing
- `/context-*` commands - Context engineering
- `/vibe-rollback-manager` - 🔥 **NEW** Advanced rollback management

## 💡 Quick Start Examples

### New Project
```bash
/vibe-init my-saas-app
/vibe-step-1-ideation
# Follow the 10-step process...
```

### Multi-Agent Development
```bash
# Terminal 1
/multi-agent
/orchestrate

# Give high-level commands, agents work automatically:
task implement user authentication system
```

### Existing Project Enhancement
```bash
cd existing-project
/vibe-feature-ideate "Add real-time notifications"
```

### Quality Assurance
```bash
/vibe-validate-work --comprehensive
/vibe-validate-work-enhanced --ui-healing --threshold=8
/vibe-ui-healer --pages="dashboard,checkout" --heal --report
/vibe-test-e2e-workflow --verbose
/re-channel all last-24h
```

### Repository Cleanup & Maintenance
```bash
/vibe-cleanup-repo --dry-run --scope=full
/vibe-cleanup-repo --category=build-artifacts --confirm
/vibe-reformat-phases phases/ --backup --verbose
/vibe-rollback-manager --operation=create-checkpoint
```

## 🎯 Command Success Tips

1. **Use MCP Tools**: Configure Context7, Perplexity, and other MCPs for best results
2. **Follow Sequence**: Complete Vibe Coding steps in order for optimal outcomes
3. **Try Multi-Agent**: For complex features, multi-agent development is significantly faster
4. **Leverage UI Healer**: Use `/vibe-ui-healer` regularly for automatic UI quality assurance
5. **Review Outputs**: Each step generates detailed documentation - read and review
6. **Use Enhanced Validation**: `/vibe-validate-work-enhanced` combines code and UI quality
7. **Clean Repositories**: Use `/vibe-cleanup-repo` to maintain codebase health
8. **Use QA Commands**: Regular validation prevents issues from accumulating
9. **Reformat Legacy Phases**: Use `/vibe-reformat-phases` to upgrade existing documentation
10. **Leverage YOLO**: For maximum velocity with maintained quality

---

**Ready to transform your development process? Start with `/vibe-init` or jump into multi-agent with `/multi-agent`!**