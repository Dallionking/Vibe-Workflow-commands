# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Vibe Coding Claude - Project Configuration

## Project Overview
This is the Vibe Coding Claude slash command system that automates the entire Vibe Coding methodology within Claude Code. It transforms Claude into a comprehensive development IDE with systematic project planning and implementation. Now enhanced with Multi-Agent Collaboration System that enables multiple Claude Code instances to work together as a coordinated AI development team.

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
The multi-agent system enables multiple Claude Code instances to work together as specialized agents, dramatically increasing development speed through parallel execution.

### Multi-Agent Commands
```bash
/multi-agent          # Start setup wizard
/orchestrate         # Initialize orchestrator (Terminal 1)
/agent [name]        # Start specific agent (Other terminals)
/workflow list       # List available workflows
/workflow run [name] # Execute multi-agent workflow
/channel show        # View agent communications
/terminals list      # Check connected agents
/agents status       # Detailed agent health
```

### Agent Roles and Responsibilities
- **Orchestrator**: Main control interface, assigns tasks, coordinates workflow
- **Research Agent**: Gathers information, best practices, documentation
- **Coding Agents**: Implement features (frontend/backend specialists)
- **Testing Agent**: Writes and executes tests, ensures quality
- **Documentation Agent**: Creates and maintains documentation

### Communication Protocol
- All agents communicate through `.workflow/context/channel.md`
- Messages include metadata (type, target, timestamp)
- Agents monitor channel for relevant messages
- File changes are broadcast to all agents
- Dependencies are tracked and coordinated

### Multi-Agent Development Patterns
1. **Setup Pattern**:
   - Start orchestrator in Terminal 1
   - Launch worker agents in other terminals
   - Verify connections with `status` command

2. **Task Assignment Pattern**:
   ```
   orchestrator> task implement feature X
   # Orchestrator analyzes and assigns to appropriate agent
   # Agent acknowledges and begins work
   # Progress updates in channel.md
   ```

3. **Parallel Execution Pattern**:
   - Research and planning happen simultaneously
   - Frontend and backend developed in parallel
   - Testing runs continuously

4. **Phase-Aware Pattern**:
   - Agents understand Vibe Coding phases
   - Auto-generate phase-specific agents
   - Coordinate phase transitions

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

### Troubleshooting Multi-Agent Issues
- **Agents not connecting**: Check exact command syntax, verify terminal ID
- **Channel not updating**: Check file permissions, ensure .workflow/context/ exists
- **Tasks not executing**: Verify agent is connected with `status` command
- **Circular dependencies**: Dependency coordinator will detect and alert

## Future Enhancements
- Team collaboration features
- Custom workflow creation
- Template marketplace
- Analytics and metrics
- CI/CD integration
- Enhanced multi-agent visualization
- Cloud-based agent execution

Remember: This tool will revolutionize how developers approach AI-assisted development. Build it with the quality and care it deserves.