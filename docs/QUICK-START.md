# Claude Vibe - Quick Start Guide 🚀

Get up and running with Claude Vibe in under 5 minutes! This guide covers the fastest path to start using the most powerful AI-assisted development system.

## ⚡ 30-Second Setup

### Prerequisites Check
- ✅ Claude Code Desktop (latest version)
- ✅ Node.js v18+ installed
- ✅ Git configured

### Installation
```bash
# 1. Clone and setup
git clone https://github.com/Dallionking/claude-vibe.git
cd claude-vibe
npm install

# 2. Verify installation
npm run doctor

# 3. Import claude.json into Claude Code Desktop
# Settings → Developer → Import Configuration
```

## 🎯 Choose Your Development Style

### Option 1: Traditional Single-Agent (Beginner-Friendly)
Perfect for learning the system and smaller projects.

```bash
# Initialize new project
/vibe-init my-awesome-app

# Start the methodology
/vibe-step-1-ideation

# Check progress anytime
/vibe-status
```

**Next Steps:** Follow prompts through steps 2-10, each building on the previous.

### Option 2: Enhanced Multi-Agent System (Recommended) 🆕
**Virtual agents in your single Claude session** - no multiple terminals needed!

```bash
# One-time setup
cd multi-agent && ./install.sh

# In your Claude session:
/vibe-multi-agent-enhanced

# Use intelligent coordination:
/coordinateUltraThink taskDescription="implement user authentication system"

# Or use legacy multi-terminal approach:
/multi-agent
/orchestrate
```

**What happens:** 5 virtual agents analyze, plan, and coordinate within your session with Mermaid diagrams!

### Option 3: YOLO Maximum Velocity
Execute complete phases with zero prompts while maintaining full quality.

```bash
# Execute complete phases automatically
/yolo local --phase=1 --verbose
/yolo local --phase=2
/yolo docker --phase=3 --rebuild

# Preview what would execute
/yolo local --dry-run --phase=2
```

## 🔥 Most Popular Quick Workflows

### New SaaS Project (5 minutes)
```bash
/vibe-init my-saas-startup
/vibe-step-1-ideation
/vibe-step-2-architecture
/vibe-step-6-technical    # Skip to technical spec
/vibe-step-8-slices      # Generate implementation phases
```

### Add Feature to Existing Project (2 minutes)
```bash
cd your-existing-project
/vibe-feature-ideate "Add user dashboard with analytics"
# Follow prompts for instant feature planning
```

### Transform Messy Codebase (10 minutes)
```bash
cd legacy-project
/vibe-retrofit-existing --mode full
# Watch as chaos becomes organized with documentation
```

### Multi-Agent Feature Development (3 minutes)
```bash
# Terminal 1
/multi-agent
/orchestrate

# Give one command, watch the magic:
task implement shopping cart with payment integration
```

## 🛠️ Essential Commands to Know

### Health & Status
```bash
npm run doctor           # System health check
/vibe-status            # Project progress
/vibe-mcp-status        # MCP tools health
/context-analyze        # Context system performance
```

### Quality Assurance
```bash
/vibe-validate-work --comprehensive    # Full quality check
/re-channel all last-24h              # Validate recent agent work
npm run test                          # Run all tests
```

### Multi-Agent Management
```bash
# In orchestrator terminal:
status                  # Show all agent status
workflow [name]         # Run predefined workflows
task [description]      # Intelligent task breakdown
help                    # Show available commands
```

### YOLO Development
```bash
/yolo local --verbose           # Execute with detailed output
/yolo docker --rebuild          # Fresh container execution
/yolo local --emergency-stop    # Execute with periodic checkpoints
```

## 📊 Phase 3 Advanced Features

### Context Engineering
```bash
/context-analyze --verbose     # Analyze context performance
/context-optimize             # Optimize memory usage
/context-validate             # Validate system integrity
```

### Pattern Recognition & Processing
Phase 3 automatically provides:
- 🧠 **Smart Code Analysis** - Understands your project patterns
- 📋 **Field Protocols** - Optimizes context management
- ⚡ **Token Budget Management** - Efficient memory usage
- 🔄 **Integration Adapter** - Seamless existing codebase integration

## 🎯 Common Use Cases

### 1. Quick Prototype (5 minutes)
```bash
/vibe-init prototype-app
/vibe-step-1-ideation
/vibe-step-8-slices --quick
```

### 2. Enterprise Planning (15 minutes)
```bash
/vibe-init enterprise-solution
# Follow all 10 steps for comprehensive planning
/vibe-step-1-ideation
# ... through step 10
```

### 3. Bug Investigation (2 minutes)
```bash
/ultrathink "analyze performance issues in checkout flow"
```

### 4. Code Quality Audit (5 minutes)
```bash
/vibe-validate-work --comprehensive
/vibe-test-e2e-workflow --verbose
/re-channel all comprehensive
```

### 5. Team Collaboration Setup (10 minutes)
```bash
/multi-agent
# Setup 4+ agents for team development
# Coordinate multiple features in parallel
```

## 🚨 Troubleshooting Quick Fixes

### Commands Not Found
```bash
# Restart Claude Code Desktop
# Re-import claude.json
npm run doctor
```

### MCP Tools Not Working
```bash
# Check API keys in Claude Code settings
/vibe-mcp-status
npm run doctor
```

### Multi-Agent Issues
```bash
# Ensure dependencies installed
npm install
# Check file permissions
ls -la .workflow/
```

### Performance Issues
```bash
/context-optimize
npm run benchmark:memory --gc
```

## 💡 Pro Tips for Maximum Productivity

1. **Start with Multi-Agent**: It's faster and more powerful than single-agent
2. **Use YOLO for Speed**: When you know what you want, YOLO is unbeatable
3. **Monitor Context**: Run `/context-analyze` regularly for optimal performance
4. **Validate Often**: Use `/re-channel` to catch issues early
5. **Leverage Phase 3**: Let PRP System analyze your code patterns automatically
6. **Batch Commands**: Use orchestrator to coordinate multiple agents efficiently

## 🔗 Next Steps

### Learn More
- **[COMMANDS-CHEATSHEET.md](./COMMANDS-CHEATSHEET.md)** - Complete command reference
- **[INSTALLATION.md](./INSTALLATION.md)** - Detailed installation guide
- **[Multi-Agent Guide](./multi-agent/README.md)** - Advanced multi-agent features

### Get Advanced
- Try custom agent creation with `/vibe-generate-agents`
- Explore retrofitting with `/vibe-retrofit-existing`
- Set up monitoring with `/vibe-setup-monitoring`
- Configure custom workflows in `.workflow/definitions/`

### Join the Community
- Star the repository: https://github.com/Dallionking/claude-vibe
- Report issues: https://github.com/Dallionking/claude-vibe/issues
- Share your success stories and use cases

---

## 🎉 You're Ready!

**Choose your adventure:**

```bash
# New to AI development? Start here:
/vibe-init learning-project

# Ready for maximum power? Go multi-agent:
/multi-agent

# Need maximum speed? Go YOLO:
/yolo local --verbose

# Have an existing project? Transform it:
/vibe-retrofit-existing
```

**Welcome to the future of AI-assisted development with Phase 3 Context Engineering!** 🚀

**Questions? Run `/vibe-doctor` or check the troubleshooting guide.**