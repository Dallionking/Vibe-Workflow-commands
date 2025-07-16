# Claude Vibe - File Organization & Structure 📁

Comprehensive guide to the Claude Vibe project structure, file organization, and directory purposes.

## 🏗️ Root Directory Structure

```
claude-vibe/
├── 📄 Core Configuration Files
├── 📚 Documentation Files  
├── 🤖 agents/                    # Agent definitions and implementations
├── 🔧 commands/                  # Command implementations
├── 🎯 examples/                  # Usage examples and templates
├── 🔗 mcps/                      # MCP integration patterns
├── 🤝 multi-agent/               # Multi-agent system infrastructure
├── 🔬 advanced-context-features/ # Advanced Context engineering
├── 📜 scripts/                   # Build, test, and utility scripts
├── 🎨 templates/                 # Project templates and structures
├── ✅ validation/                # Quality assurance and validation rules
└── 📊 Generated Project Files
```

## 📄 Core Configuration Files

### Essential Files (Never Delete)
```
claude-vibe/
├── claude.json              # Main command configuration (105+ commands)
├── package.json             # Dependencies and npm scripts  
├── tsconfig.json            # TypeScript configuration
├── CLAUDE.md                # Project instructions for Claude Code
├── README.md                # Main project documentation
├── LICENSE                  # MIT license
└── .gitignore               # Git ignore patterns
```

### Documentation Suite
```
claude-vibe/
├── COMMANDS-CHEATSHEET.md   # Complete command reference (105+ commands)
├── INSTALLATION.md          # Setup and installation guide
├── QUICK-START.md           # 5-minute getting started guide
├── TROUBLESHOOTING.md       # Common issues and solutions
├── FILE-ORGANIZATION.md     # This file - structure overview
├── current_status.md        # Current development status
├── changelog.md             # Version history and updates
├── features.md              # Complete feature overview
└── CONTEXT-ENGINEERING-STATUS.md # Advanced Context implementation status
```

## 🤖 Agents Directory Structure

### Core Agent Organization
```
agents/
├── 📋 Core System Agents
│   ├── core/
│   │   ├── ultrathink.md           # Advanced orchestration agent
│   │   └── status-manager.md       # Status tracking agent
│   └── utilities/                  # 20+ utility agents
│       ├── work-validator.md       # Code quality validation
│       ├── ui-healer.md           # UI testing and healing
│       ├── doctor.md              # System health diagnostics
│       ├── rollback-*.md          # Rollback management agents
│       ├── cleanup-*.md           # Project cleanup agents
│       └── [16 more utility agents]
│
├── 🔄 10-Step Methodology Agents
│   ├── step-1-ideation/
│   │   ├── agent.md               # Main ideation agent
│   │   ├── main-orchestrator.md   # Advanced sub-agent coordination
│   │   └── sub-agents/            # 4 specialized sub-agents
│   ├── step-2-architecture/
│   │   ├── agent.md               # Main architecture agent
│   │   ├── main-orchestrator.md   # Advanced orchestration
│   │   └── sub-agents/            # 2 specialized sub-agents
│   ├── step-3-ux-design/agent.md
│   ├── step-4-design-system/agent.md
│   ├── step-5-interface-states/agent.md
│   ├── step-6-technical-specification/
│   │   ├── main-orchestrator.md   # Coordinates 5 sub-agents
│   │   ├── agent.md               # Alternative implementation
│   │   └── sub-agents/            # 5 specialized agents
│   │       ├── feature-analysis.md
│   │       ├── api-design.md
│   │       ├── database-schema.md
│   │       ├── security-compliance.md
│   │       └── integration-specs.md
│   ├── step-7-landing-page/
│   │   ├── avatar-research.md     # Customer research
│   │   ├── diary-creation.md      # Emotional diary creation
│   │   ├── copy-optimization.md   # Landing page copy
│   │   └── main-orchestrator.md   # Advanced coordination
│   ├── step-8-vertical-slices/
│   │   ├── main-orchestrator.md   # Coordinates slice generation
│   │   ├── slice-generator.md     # Alternative implementation
│   │   └── sub-agents/            # 3 specialized agents
│   │       ├── feature-analysis.md
│   │       ├── advanced-context-generation.md
│   │       └── validation.md
│   ├── step-9-claude-md/agent.md
│   └── step-10-init-services/agent.md
│
├── 🔧 Retrofit & Enhancement Agents
│   ├── retrofit/
│   │   ├── retrofit-orchestrator.md    # Main retrofit coordination
│   │   └── codebase-analyzer.md        # Deep codebase analysis
│   └── yaml-based/                     # Modern YAML agent system
│       ├── feature-ideation/
│       ├── retrofit/
│       └── agent-generator/
│
├── 🤝 Multi-Agent System Agents  
│   └── multi-agent/
│       ├── multi-agent-setup.md        # System initialization
│       ├── agent-command.md            # Individual agent startup
│       └── orchestrator-command.md     # Main orchestrator
│
└── 🏗️ Setup and MCP Agents
    ├── init/project-setup.md           # Project initialization
    └── step-2.5-mcp-setup/agent.md     # MCP auto-configuration
```

## 🔧 Commands Directory Structure

```
commands/
├── context-engineering.js           # Advanced Context commands
├── validation-commands.js           # Quality assurance commands
├── multi-agent-setup.js            # Multi-agent initialization
└── multi-agent-test.js             # Multi-agent testing
```

## 🤝 Multi-Agent System Structure

```
multi-agent/
├── 📖 Documentation
│   ├── README.md                    # Multi-agent system overview
│   ├── README-how-it-works.md       # Simple explanation
│   └── SETUP-GUIDE.md               # Detailed setup instructions
│
├── 🏗️ Core Infrastructure  
│   ├── core/
│   │   ├── orchestrator.js          # Main coordination logic
│   │   ├── agent-registry.js        # Agent management
│   │   ├── communication.js         # Inter-agent communication
│   │   └── dependency-coordinator.js # Task dependency management
│   │
│   ├── 🤖 Agent Definitions
│   │   ├── agents/
│   │   │   ├── research-agent.yaml  # Research and analysis
│   │   │   ├── coding-agent.yaml    # Implementation and development
│   │   │   ├── testing-agent.yaml   # Quality assurance and testing
│   │   │   ├── frontend-agent.yaml  # UI/UX development
│   │   │   └── backend-agent.yaml   # Server and API development
│   │   │
│   │   ├── 🔄 Workflow Templates
│   │   │   ├── workflows/
│   │   │   │   ├── feature-development.yaml
│   │   │   │   ├── bug-fixing.yaml
│   │   │   │   ├── performance-optimization.yaml
│   │   │   │   └── deployment-preparation.yaml
│   │   │   │
│   │   │   └── 📚 Examples
│   │   │       └── examples/
│   │   │           ├── simple-feature/
│   │   │           ├── complex-system/
│   │   │           └── retrofit-project/
│   │   │
│   │   └── 🧪 Testing Infrastructure
│   │       └── tests/
│   │           ├── agent-tests/
│   │           ├── integration-tests/
│   │           └── workflow-tests/
│   │
└── 📊 Generated Project Structure (when using multi-agent)
    └── .workflow/
        ├── context/
        │   ├── channel.md           # Agent communication hub
        │   ├── agents/              # Individual agent contexts
        │   └── shared/              # Shared data and resources
        ├── definitions/             # Custom workflow definitions
        ├── temp/                    # Temporary processing files
        └── agent-setup.md           # Setup instructions
```

## 🔬 Advanced Context Features Structure

```
advanced-context-features/
├── 📖 Documentation
│   ├── README.md                    # Advanced Context overview
│   ├── PRP-SYSTEM.md               # Pattern Recognition & Processing
│   ├── FIELD-PROTOCOLS.md          # Context management protocols
│   └── TOKEN-BUDGET-MANAGEMENT.md  # Memory optimization
│
├── 🧠 Core Components
│   ├── core/
│   │   ├── prp-system.ts           # Pattern Recognition & Processing
│   │   ├── field-protocols.ts      # Advanced context management
│   │   ├── token-budget-manager.ts # Memory and token optimization
│   │   └── integration-adapter.ts  # Existing codebase integration
│   │
│   ├── 🔍 Pattern Detection
│   │   ├── patterns/
│   │   │   ├── detector.ts         # Pattern detection engine
│   │   │   ├── analyzer.ts         # Pattern analysis
│   │   │   └── categorizer.ts      # Pattern categorization
│   │   │
│   │   └── 🔄 Integration Systems
│   │       └── retrofit/
│   │           ├── types/           # TypeScript type definitions
│   │           │   ├── tree-sitter.d.ts # AST parsing types
│   │           │   └── tree-sitter.ts   # Mock implementation
│   │           ├── patterns/        # Pattern detection for retrofit
│   │           └── integration/     # Integration utilities
│   │
├── 🧪 Testing & Validation
│   ├── tests/
│   │   ├── unit/                   # Unit tests for core components
│   │   ├── integration/            # Integration tests
│   │   └── performance/            # Performance benchmarks
│   │
│   └── 📊 Coverage Reports
│       └── coverage/               # Test coverage reports
│
└── 📊 Runtime Files (Generated)
    ├── .context-cache/             # Context processing cache
    ├── .context-temp/              # Temporary context files
    ├── .field-protocols-cache/     # Field protocol optimizations
    └── .prp-cache/                 # Pattern recognition cache
```

## 🎨 Templates Directory Structure

```
templates/
├── 📋 Project Structures
│   ├── project-structures/
│   │   ├── saas-startup.json       # SaaS/startup template
│   │   ├── enterprise-app.json     # Enterprise application template
│   │   └── mobile-app.json         # Mobile application template
│   │
├── 📄 Documentation Templates
│   ├── documentation/
│   │   ├── step-templates/         # Templates for each methodology step
│   │   ├── claude-md-template.md   # Claude.md generation template
│   │   └── project-readme-template.md
│   │
├── 🏗️ Code Templates
│   ├── code-templates/
│   │   ├── component-templates/    # UI component templates
│   │   ├── api-templates/          # API endpoint templates
│   │   └── test-templates/         # Test file templates
│   │
└── 🔄 Workflow Templates
    └── workflow-templates/
        ├── simple-feature.yaml     # Basic feature development
        ├── complex-integration.yaml # Complex system integration
        └── performance-optimization.yaml
```

## 🔗 MCP Integration Structure

```
mcps/
├── 📖 Documentation
│   ├── README.md                   # MCP integration overview
│   └── SETUP-GUIDE.md             # MCP setup instructions
│
├── 🔧 Service MCPs
│   ├── service-mcps/
│   │   ├── supabase-setup.md       # Supabase integration
│   │   ├── digital-ocean-setup.md  # DigitalOcean integration
│   │   ├── github-setup.md         # GitHub integration
│   │   └── monitoring-setup.md     # Monitoring service integration
│   │
├── 🧠 Research MCPs
│   ├── research-mcps/
│   │   ├── context7-patterns.md    # Context7 usage patterns
│   │   ├── perplexity-research.md  # Perplexity research strategies
│   │   └── sequential-thinking.md  # Sequential thinking patterns
│   │
└── 🔄 Integration Patterns
    └── integration-patterns/
        ├── mcp-orchestration.md    # Coordinating multiple MCPs
        ├── fallback-strategies.md  # Handling MCP failures
        └── performance-optimization.md
```

## 📜 Scripts Directory Structure

```
scripts/
├── 🧪 Testing Scripts
│   ├── test-runner.js              # Main test execution
│   ├── test-commands.js            # Command validation tests
│   └── run-benchmarks.js          # Performance benchmarking
│
├── 🔧 Build & Maintenance
│   ├── validate-structure.js       # Project structure validation
│   ├── doctor.js                   # System health diagnostics
│   ├── install.js                 # Installation procedures
│   └── update.js                   # Update procedures
│
└── 🤖 Advanced Context Scripts
    ├── context-optimization.js     # Context system optimization
    ├── pattern-analysis.js         # Pattern detection utilities
    └── memory-management.js        # Memory usage optimization
```

## ✅ Validation Directory Structure

```
validation/
├── 📋 Quality Rules
│   ├── quality-rules/
│   │   ├── code-quality.json       # Code quality standards
│   │   ├── test-coverage.json      # Test coverage requirements
│   │   └── universal-format.json   # Universal Format compliance
│   │
├── 🔍 Validation Schemas
│   ├── schemas/
│   │   ├── command-schema.json     # Command definition validation
│   │   ├── agent-schema.json       # Agent file validation
│   │   └── project-schema.json     # Project structure validation
│   │
└── 🧪 Test Configurations
    └── test-configs/
        ├── jest.config.js          # Jest testing configuration
        ├── eslint.config.js        # ESLint rules
        └── typescript.config.js    # TypeScript validation
```

## 📊 Generated Project Files

When you use Claude Vibe, these structures are created in your projects:

```
your-project/
├── 📄 Vibe Documentation
│   └── docs/vibe-coding/
│       ├── 01-project-specification.md
│       ├── 02-technical-architecture.md
│       ├── 03-ux-design.md
│       ├── 04-design-system.md
│       ├── 05-interface-states.md
│       ├── 06-technical-specification.md
│       ├── 07-landing-page/
│       └── 08-advanced-context-slices/
│
├── 🔄 Implementation Advanced Contexts
│   └── advanced-contexts/
│       ├── advanced-context-0-foundation.md
│       ├── advanced-context-1-core.md
│       └── [additional advanced contexts based on features]
│
├── 🤖 AI Configuration
│   ├── CLAUDE.md                   # Generated AI assistant configuration
│   └── .claude/                    # Agent-specific configurations
│       ├── patterns.json
│       ├── shortcuts.yaml
│       └── behaviors.yaml
│
├── 📊 Project Management
│   ├── .vibe/
│   │   ├── status.json             # Project progress tracking
│   │   ├── services.json           # Service configurations
│   │   ├── init-services.log       # Service initialization logs
│   │   └── versions/               # Version management
│   ├── .vibe-status.md             # Human-readable status
│   └── .taskmaster/                # TaskMaster MCP integration
│
├── 🤝 Multi-Agent Workspace (when using multi-agent)
│   └── .workflow/
│       ├── context/channel.md      # Agent communication
│       ├── agents/                 # Individual agent contexts
│       ├── definitions/            # Custom workflows
│       └── temp/                   # Temporary files
│
└── 🔬 Advanced Context System (when using Advanced Context features)
    ├── .context-cache/             # Context processing cache
    ├── .context-temp/              # Temporary context files
    ├── .field-protocols-cache/     # Protocol optimizations
    └── .prp-cache/                 # Pattern recognition cache
```

## 🛡️ Protected Files (Never Delete)

### Critical System Files
- `claude.json` - Command definitions
- `package.json` - Dependencies and scripts
- `CLAUDE.md` - Project instructions
- `tsconfig.json` - TypeScript configuration

### Essential Documentation
- `README.md` - Main project documentation
- `COMMANDS-CHEATSHEET.md` - Command reference
- `INSTALLATION.md` - Setup guide
- `TROUBLESHOOTING.md` - Issue resolution

### Advanced Context Core Files
- `advanced-context-features/core/` - Core system components
- `advanced-context-features/patterns/` - Pattern detection
- `retrofit/types/` - TypeScript definitions

## 🧹 Safe to Clean/Regenerate

### Cache Directories
- `.context-cache/` - Context processing cache
- `.context-temp/` - Temporary context files
- `.prp-cache/` - Pattern recognition cache
- `.workflow/temp/` - Multi-agent temporary files
- `coverage/` - Test coverage reports
- `dist/` - Build output
- `node_modules/` - Dependencies (reinstall with `npm install`)

### Generated Reports
- Test coverage reports
- Benchmark results
- Performance logs
- Temporary status files

## 💡 Organization Principles

### 1. **Separation of Concerns**
- Core system files separated from user project files
- Agent definitions separated by type and complexity
- Documentation organized by audience and purpose

### 2. **Scalability**
- Agent system supports 105+ commands
- Sub-agent architecture for complex operations
- Modular MCP integration patterns

### 3. **Maintainability**
- Clear naming conventions
- Logical directory hierarchies
- Comprehensive documentation for each component

### 4. **Extensibility**
- YAML-based agent system for customization
- Template system for new project types
- Plugin architecture for MCP integrations

---

## 🚀 Quick Navigation

**Finding What You Need:**

- **Commands**: Check `COMMANDS-CHEATSHEET.md` first
- **Issues**: Look in `TROUBLESHOOTING.md`
- **Setup**: Start with `INSTALLATION.md`
- **Quick Start**: Use `QUICK-START.md`
- **Agent Definitions**: Browse `agents/` directory
- **Advanced Context**: Explore `advanced-context-features/`
- **Multi-Agent**: Check `multi-agent/` directory
- **Project Status**: Read `current_status.md`

**Remember**: This organization supports a sophisticated AI development system with 105+ commands, Advanced Context engineering, and multi-agent collaboration. Every file has a purpose in creating the most advanced AI-assisted development experience available.