# Vibe Coding Claude - Project Configuration

## Project Overview
This is the Vibe Coding Claude slash command system that automates the entire Vibe Coding methodology within Claude Code. It transforms Claude into a comprehensive development IDE with systematic project planning and implementation.

## Core Principles
1. **Systematic Development** - Follow the 8-step Vibe Coding methodology exactly
2. **Quality Standards** - Enforce 95%+ test coverage and Universal Format compliance
3. **Context Preservation** - Maintain project state across all steps
4. **MCP Integration** - Leverage Context7, Perplexity, and other tools systematically
5. **Professional Output** - Generate enterprise-ready documentation automatically

## Project Structure
```
vibe-coding-claude/
├── agents/          # Step-specific AI agents
├── templates/       # Project and documentation templates
├── mcps/           # MCP integration patterns
├── validation/     # Quality assurance rules
└── examples/       # Sample implementations
```

## Development Guidelines

### When Working on Agents
- Each agent must follow the exact format from the original Vibe Coding steps
- Preserve all instructional content and formatting
- Add slash command integration logic at the beginning
- Include file I/O operations for reading previous outputs
- Implement validation before proceeding

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

## Quality Standards
- All generated code must target 95%+ test coverage
- Documentation must be comprehensive and clear
- Follow Universal Format for vertical slices exactly
- Implement proper error handling throughout
- Ensure MCP tools degrade gracefully if unavailable

## MCP Integration Rules
- Context7 for documentation fetching
- Perplexity for research and validation
- TaskMaster for complex implementation
- Sequential Thinking for detailed planning
- Magic UI for component generation

## Git Workflow
- Each project gets initialized with git
- Feature branches follow: feature/phase-[number]-[kebab-case-title]
- Commits follow conventional commit format
- Include git checkpoints in vertical slices

## File Naming Conventions
- Documentation: `docs/0[step]-[description].md`
- Phase slices: `phases/phase-[number]-[feature].md`
- Status files: `.vibe-[type].md`
- Templates: `[type]-template.md`

## Testing Requirements
- Test all slash commands thoroughly
- Validate file generation and structure
- Ensure proper error handling
- Test MCP integration fallbacks
- Verify context passing between steps

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