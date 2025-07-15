# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Claude Vibe - Project Configuration

## Project Overview
This is Claude Vibe, the comprehensive slash command system that automates the entire Vibe Coding methodology within Claude Code. It transforms Claude into a comprehensive development IDE with systematic project planning and implementation. Now enhanced with Multi-Agent Collaboration System that enables multiple Claude Code instances to work together as a coordinated AI development team.

## Essential Commands

### Development Commands
```bash
npm test              # Run command validation tests
npm run validate      # Validate project structure and agents
npm run doctor        # Check system health and MCP connections
npm install          # Install dependencies and setup
npm run update       # Update dependencies and pull latest
```

### Key Script Files
- `scripts/test-commands.js` - Tests all slash command implementations
- `scripts/validate-structure.js` - Validates agent files and project structure
- `scripts/doctor.js` - Health checks for MCP tools and system state
- `scripts/install.js` - Setup and installation procedures

## Core Principles
1. **Systematic Development** - Follow the 10-step Vibe Coding methodology exactly
2. **Quality Standards** - Enforce 95%+ test coverage and Universal Format compliance
3. **Context Preservation** - Maintain project state across all steps
4. **MCP Integration** - Leverage Context7, Perplexity, and other tools systematically
5. **Professional Output** - Generate enterprise-ready documentation automatically
6. **Multi-Agent Collaboration** - Enable parallel development with specialized AI agents
7. **Real-time Coordination** - Agents communicate through channel.md for seamless teamwork

## Project Structure
```
vibe-coding-claude/
├── agents/          # Step-specific AI agents
│   ├── step-*/      # Individual step agents (MD format)
│   ├── yaml-based/  # Modern YAML agent system
│   └── core/        # Utility and helper agents
├── multi-agent/     # Multi-agent collaboration system
│   ├── core/        # Core infrastructure (orchestrator, registry)
│   ├── agents/      # Agent definitions and implementations
│   ├── workflows/   # Pre-built workflow templates
│   └── examples/    # Example multi-agent setups
├── templates/       # Project and documentation templates
├── mcps/           # MCP integration patterns
├── validation/     # Quality assurance rules
├── scripts/        # Build and test scripts
└── examples/       # Sample implementations
```

## Claude Code Tool Usage Patterns

### MCP Tool Priority (Use in this order)
1. **Context7** - First choice for documentation and library research
2. **Perplexity Ask** - For detailed research with conversation context
3. **Sequential Thinking** - For complex multi-step planning
4. **TaskMaster** - For complex task management and breakdown
5. **GitHub** - For repository operations and version control

### Essential Tool Usage Guidelines
- **Always use TodoWrite** to plan and track multi-step tasks
- **Read previous step outputs** before starting new steps (check docs/vibe-coding/)
- **Use Task tool** for complex searches to reduce context usage
- **Batch tool calls** when possible for parallel execution
- **Validate outputs** using npm run validate after major changes

### Context Preservation Strategy
```
Before each step:
1. Read .vibe-status.md for current progress
2. Check docs/vibe-coding/ for previous outputs
3. Review relevant phase files in phases/
4. Update status after completion
```

### Error Recovery Procedures
- If MCP tools fail, document the failure and continue with available tools
- Use fallback research methods (web search, existing documentation)
- Never halt progress due to tool failures - adapt and inform user
- Test core functionality with npm run doctor

## Development Guidelines

### When Working on Agents
- Each agent must follow the exact format from the original Vibe Coding steps
- Preserve all instructional content and formatting
- Add slash command integration logic at the beginning
- Include file I/O operations for reading previous outputs
- Implement validation before proceeding
- **Always read context from previous steps** before generating new content

### When Creating Templates
- Templates must be comprehensive and production-ready
- Include all necessary configuration files
- Follow industry best practices
- Support multiple project types (SaaS, mobile, enterprise)

### When Implementing Commands
- Commands must validate prerequisites before executing
- Generate status updates in .vibe-status.md
- Handle errors gracefully with helpful messages
- Prompt users for next steps after completion
- **Use TodoWrite to track command execution steps**

## Quality Standards
- All generated code must target 95%+ test coverage
- Documentation must be comprehensive and clear
- Follow Universal Format for vertical slices exactly
- Implement proper error handling throughout
- Ensure MCP tools degrade gracefully if unavailable

## MCP Integration Rules
- **Context7** for documentation fetching and library research
- **Perplexity Ask** for research and validation with conversation context
- **TaskMaster** for complex task management and implementation
- **Sequential Thinking** for detailed planning and step-by-step execution
- **GitHub** for repository operations and version control
- **Shadcn** for UI component generation when available

### MCP Degradation Strategy
When MCPs are unavailable:
1. Use WebSearch as fallback for research
2. Use Task tool for file operations
3. Use Sequential Thinking for complex planning
4. Document missing tools and continue with available functionality

## Architecture-Specific Guidelines

### Agent File Structure
```
agents/
├── step-*/           # Core 10-step methodology agents
├── yaml-based/       # Modern YAML agent system
│   ├── feature-ideation/
│   ├── retrofit/
│   └── agent-generator/
└── core/            # Utility agents (status, validation, etc.)
```

### Command Implementation Pattern
1. **Validate prerequisites** (check for required files, tools)
2. **Read context** from previous steps
3. **Use TodoWrite** to plan execution
4. **Execute with MCP tools** (Context7 → Perplexity → others)
5. **Validate outputs** with npm run validate
6. **Update status** and prompt for next steps

### Context File Pattern
Always check these files before executing steps:
- `.vibe-status.md` - Current progress tracking
- `docs/vibe-coding/0X-*.md` - Previous step outputs
- `phases/phase-*.md` - Development phase documentation
- `.vibe/status.json` - Detailed project state

## Git Workflow
- Each project gets initialized with git
- Feature branches follow: `feature/phase-[number]-[kebab-case-title]`
- Commits follow conventional commit format
- Include git checkpoints in vertical slices
- **Never commit without user approval**

## File Naming Conventions
- Documentation: `docs/vibe-coding/0[step]-[description].md`
- Phase slices: `phases/phase-[number]-[feature].md`
- Status files: `.vibe-[type].md`
- Templates: `[type]-template.md`
- Agent configs: `.claude/[type].yaml`

## Testing Requirements
- Run `npm test` after implementing new commands
- Use `npm run validate` to check project structure
- Use `npm run doctor` to verify MCP tool connections
- Test MCP integration fallbacks
- Verify context passing between steps
- Validate all generated file outputs

## Marketing Considerations
- Keep code clean and professional (this will be public eventually)
- Include compelling examples
- Document everything thoroughly
- Optimize for developer experience
- Build with community sharing in mind

## Security Notes
- Never commit sensitive data
- Use environment variables for API keys
- Validate all user inputs
- Sanitize file paths
- Implement proper access controls

## Multi-Agent System

### Overview
The **fully automated multi-agent system** enables multiple Claude Code instances to work together as specialized agents with **zero manual intervention required**. Agents automatically coordinate, communicate, and execute tasks based on intelligent task breakdown and assignment.

### Multi-Agent Commands (Fully Automated)
```bash
# Setup Commands
/multi-agent                           # Initialize multi-agent system
/agent [name] --terminal-id=[N]       # Start specialized agent (auto-executes tasks)
/orchestrate                          # Start automated orchestrator

# Orchestrator Commands (Auto-executes tasks)
task [description]                    # Intelligent task breakdown and auto-assignment
workflow [name]                       # Execute multi-agent workflows automatically
status                               # Show all agent status and progress
help                                 # Show available commands

# QA Validation Commands (NEW)
/re-channel [agent] [time-window]     # Comprehensive validation of agent work
```

### YOLO Commands (Zero-Friction Phase Execution)
```bash
# Core YOLO Commands
/yolo local [options]                 # Execute phases locally with full automation
/yolo docker [options]                # Execute phases in Docker container

# Common Options
--phase=N                            # Execute specific phase (default: current)
--tier=N                             # Execute specific tier only (1, 2, or 3)
--verbose                            # Show detailed command execution
--dry-run                            # Preview what would be executed

# Docker-specific Options
--rebuild                            # Force rebuild of Docker image
--no-cache                           # Build Docker image without cache
--keep-container                     # Keep container after execution

# Safety Options
--emergency-stop                     # Create periodic checkpoints
--interval=N                         # Checkpoint interval in minutes (default: 5)
```

### Agent Roles and Responsibilities (Auto-Executing)
- **Orchestrator**: Intelligent task analysis, auto-assignment, coordination
- **Research Agent**: **Auto-executes UltraThink**, gathers best practices, documentation analysis
- **Coding Agent**: **Auto-implements features**, creates infrastructure, handles refactoring
- **Testing Agent**: **Auto-validates code**, ensures 95%+ coverage, runs comprehensive tests
- **Frontend Agent**: **Auto-creates UI components**, styling, responsive design
- **Backend Agent**: **Auto-implements APIs**, server logic, database integration
- **QA Validator Agent**: **Auto-validates implementations**, catches half-completed work, ensures quality

### Communication Protocol (Enhanced)
- All agents communicate through `.workflow/context/channel.md`
- **Auto-monitoring**: Agents automatically watch for task assignments
- **Auto-execution**: Tasks are parsed and executed without manual intervention
- **Real-time coordination**: File changes trigger automatic responses
- **Intelligent routing**: Inter-agent requests are automatically forwarded
- **Status tracking**: Progress updates and completion notifications are automatic

### Multi-Agent Development Patterns (Fully Automated)
1. **Zero-Intervention Setup**:
   ```bash
   Terminal 1: /multi-agent           # Initialize system
   Terminal 2: /agent research-agent --terminal-id=2
   Terminal 3: /agent coding-agent --terminal-id=3  
   Terminal 4: /agent testing-agent --terminal-id=4
   Terminal 1: /orchestrate          # Start coordination
   ```

2. **Intelligent Task Execution**:
   ```
   orchestrator> task implement user authentication system
   # Auto-breakdown: research → implementation → testing
   # Auto-assignment: research-agent gets analysis task
   # Auto-execution: UltraThink runs automatically
   # Auto-handoff: results passed to coding-agent
   # Auto-completion: testing-agent validates automatically
   ```

## YOLO Development Patterns (Zero-Friction Execution)
1. **Local YOLO Execution**:
   ```bash
   /yolo local                       # Execute current phase locally
   /yolo local --phase=2             # Execute specific phase
   /yolo local --tier=1 --verbose    # Execute tier 1 with detailed output
   /yolo local --dry-run             # Preview execution plan
   ```

2. **Docker YOLO Execution**:
   ```bash
   /yolo docker                      # Execute current phase in container
   /yolo docker --phase=3 --rebuild  # Rebuild image and execute phase 3
   /yolo docker --keep-container     # Keep container for debugging
   /yolo docker --no-cache           # Build without cache
   ```

3. **YOLO Philosophy**:
   - **Zero Permission Prompts**: All commands auto-approved
   - **Full Quality Maintained**: 95%+ test coverage, UI healing, validation
   - **Dynamic Phase Support**: Works with any phases in your project
   - **Safety First**: Emergency stops, periodic checkpoints, rollback capabilities
   - **Maximum Velocity**: Executes complete phases end-to-end automatically

3. **Autonomous Parallel Development**:
   - Research and implementation happen simultaneously when possible
   - Dependencies are automatically detected and managed
   - Agents coordinate handoffs without manual intervention
   - Real-time progress tracking across all agents

4. **Self-Coordinating Workflows**:
   - Agents understand project context and current phase
   - Task prioritization based on dependencies
   - Automatic error recovery and alternative approaches
   - Continuous quality validation throughout process

### File Monitoring
Agents automatically monitor:
- **Source files**: Based on role (frontend watches src/, backend watches api/)
- **Configuration**: .vibe-status.md, package.json, etc.
- **Channel**: .workflow/context/channel.md
- **Dependencies**: Files they're waiting for

### Best Practices for Multi-Agent
1. **Start with 3-4 agents** for most projects
2. **Use orchestrator for all commands** - don't directly command worker agents
3. **Monitor channel.md** to understand agent activities
4. **Let agents specialize** - don't make all agents do everything
5. **Use workflows** for complex multi-step operations
6. **Run `/re-channel` regularly** - validate work after major implementations
7. **Use QA validation** - catch half-implemented features before they become problems

### Troubleshooting Multi-Agent Issues
- **Agents not connecting**: Check exact command syntax, verify terminal ID
- **Channel not updating**: Check file permissions, ensure .workflow/context/ exists
- **Tasks not executing**: Verify agent is connected with `status` command
- **Circular dependencies**: Dependency coordinator will detect and alert
- **Half-implemented features**: Use `/re-channel` to validate and identify gaps
- **Quality issues**: Run comprehensive validation with `/re-channel all comprehensive`

## Future Enhancements
- Team collaboration features
- Custom workflow creation
- Template marketplace
- Analytics and metrics
- CI/CD integration
- Enhanced multi-agent visualization
- Cloud-based agent execution

Remember: This tool will revolutionize how developers approach AI-assisted development. Build it with the quality and care it deserves.