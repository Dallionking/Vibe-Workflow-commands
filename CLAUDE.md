# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Vibe Coding Claude - Project Configuration

## Project Overview
This is the Vibe Coding Claude slash command system that automates the entire Vibe Coding methodology within Claude Code. It transforms Claude into a comprehensive development IDE with systematic project planning and implementation.

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

## Project Structure
```
vibe-coding-claude/
├── agents/          # Step-specific AI agents
│   ├── step-*/      # Individual step agents (MD format)
│   ├── yaml-based/  # Modern YAML agent system
│   └── core/        # Utility and helper agents
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

## Future Enhancements
- Team collaboration features
- Custom workflow creation
- Template marketplace
- Analytics and metrics
- CI/CD integration

Remember: This tool will revolutionize how developers approach AI-assisted development. Build it with the quality and care it deserves.