# Vibe Workflow Commands for Claude Code

A comprehensive system of agents and commands that implement the Vibe Coding methodology within Claude Code. This system helps transform feature ideas into well-researched, phase-based implementation plans.

## 🎯 Overview

The Vibe Workflow Commands provide an automated workflow that takes a feature idea through six stages:
1. **Clarification** - Understanding requirements
2. **Research** - Finding best practices
3. **Documentation** - Gathering technical resources
4. **Architecture Analysis** - Examining codebase
5. **Planning** - Creating implementation strategy
6. **Phase Formatting** - Converting to Vibe phases

## 🚀 Main Command

### `/vibe-feature-ideate`

Transform a feature idea into a comprehensive implementation plan.

```bash
/vibe-feature-ideate "Add user authentication"
```

**Options:**
- `--quick` - Streamlined process with fewer questions
- `--skip-research` - Skip the research phase
- `--skip-docs` - Skip documentation gathering
- `--retrofit` - Focus on retrofitting existing code

## 🤖 Agent Architecture

### Orchestrator Agent
- **File**: `ideation-agents/ideation-orchestrator.yaml`
- **Purpose**: Coordinates all sub-agents and manages workflow
- **Key Features**:
  - User approval at each stage
  - Context management via files
  - Progress tracking with TodoWrite
  - Agent chaining support

### Sub-Agents

#### 1. Clarification Agent (Orchestrator)
- **File**: `ideation-agents/clarification-agent.yaml`
- **Sub-agents**:
  - `question-generator` - Creates targeted questions
  - `response-analyzer` - Analyzes user responses
  - `requirement-extractor` - Extracts final requirements

#### 2. Research Agent
- **File**: `ideation-agents/research-agent.yaml`
- **Features**:
  - Uses Perplexity Ask API
  - Fallback patterns when API unavailable
  - Simplified to 2-4 queries max

#### 3. Documentation Agent (Orchestrator)
- **File**: `ideation-agents/documentation-agent.yaml`
- **Sub-agents**:
  - `library-resolver` - Converts names to Context7 IDs
  - `docs-fetcher` - Retrieves documentation
  - `docs-processor` - Organizes documentation

#### 4. Architecture Analyst
- **File**: `ideation-agents/architecture-analyst.yaml`
- **Tools Used**:
  - LS, Glob, Grep for codebase analysis
  - Read/Write for results

#### 5. Planning Synthesizer (Orchestrator)
- **File**: `ideation-agents/planning-synthesizer.yaml`
- **Sub-agents**:
  - `task-breakdown` - Creates task hierarchy
  - `dependency-mapper` - Maps task dependencies
  - `plan-generator` - Creates final plan

#### 6. Phase Formatter
- **File**: `ideation-agents/phase-formatter.yaml`
- **Purpose**: Formats plan into Vibe's 7-phase structure

## 📁 File Structure

```
Vibe Workflow commands/
├── ideation-agents/
│   ├── ideation-orchestrator.yaml
│   ├── clarification-agent.yaml
│   ├── research-agent.yaml
│   ├── documentation-agent.yaml
│   ├── architecture-analyst.yaml
│   ├── planning-synthesizer.yaml
│   ├── phase-formatter.yaml
│   │
│   ├── clarifiers/
│   │   ├── question-generator.yaml
│   │   ├── response-analyzer.yaml
│   │   └── requirement-extractor.yaml
│   │
│   ├── docs/
│   │   ├── library-resolver.yaml
│   │   ├── docs-fetcher.yaml
│   │   └── docs-processor.yaml
│   │
│   └── planning/
│       ├── task-breakdown.yaml
│       ├── dependency-mapper.yaml
│       └── plan-generator.yaml
│
├── vibe-feature-ideate.md
├── vibe-generate-agents.md
├── vibe-retrofit-phases.md
└── README.md
```

## 🔧 Claude Code Integration

### Required Tools

All agents specify their required Claude Code tools:
- **Write** - Save outputs to files
- **Read** - Read context and previous outputs
- **TodoWrite** - Track workflow progress
- **LS/Glob/Grep** - For codebase analysis
- **Edit/MultiEdit** - For code modifications

### MCP Tools (Optional)
- **mcp__perplexity-ask__perplexity_ask** - For research
- **mcp__context7__resolve-library-id** - For documentation
- **mcp__context7__get-library-docs** - For documentation
- **mcp__taskmaster-ai__add_task** - For task management

### File-Based Communication

Agents communicate through files in the `.vibe/` directory:
- `.vibe/feature-requirements.md` - From clarification
- `.vibe/research-findings.md` - From research
- `.vibe/technical-documentation.md` - From documentation
- `.vibe/integration-plan.md` - From architecture analysis
- `.vibe/implementation-plan.md` - From planning
- `.vibe/vibe-implementation-guide.md` - Final output

## 🔄 Workflow Process

### 1. Start the Workflow
```bash
/vibe-feature-ideate "Your feature idea"
```

### 2. Clarification Stage
- Agent generates questions based on feature type
- You answer the questions
- Agent extracts clear requirements
- **Approval checkpoint**

### 3. Research Stage
- Agent searches for best practices (with Perplexity if available)
- Falls back to pattern library if needed
- Compiles findings and recommendations
- **Approval checkpoint**

### 4. Documentation Stage
- Resolves library names to Context7 IDs
- Fetches relevant documentation
- Processes into actionable format
- **Approval checkpoint**

### 5. Architecture Analysis
- Examines your codebase structure
- Identifies integration points
- Detects patterns to follow
- **Approval checkpoint**

### 6. Planning Stage
- Breaks down into implementable tasks
- Maps dependencies
- Creates timeline and phases
- **Approval checkpoint**

### 7. Phase Formatting
- Organizes tasks into Vibe's 7 phases
- Creates final implementation guide
- **Final approval**

## 🎯 Vibe Phases

The system organizes implementation into 7 standard phases:

1. **Planning & Design** - Requirements, architecture
2. **Foundation & Setup** - Configuration, utilities
3. **Core Logic** - Business logic, models
4. **User Interface** - UI components, APIs
5. **Integration** - External services
6. **Testing** - Comprehensive testing
7. **Deployment** - Release and monitoring

## 💡 Usage Examples

### Basic Usage
```bash
/vibe-feature-ideate "Add user authentication with JWT"
```

### Quick Mode
```bash
/vibe-feature-ideate "Add search functionality" --quick
```

### Skip Research
```bash
/vibe-feature-ideate "Add logging system" --skip-research
```

### Retrofit Existing Code
```bash
/vibe-feature-ideate "Upgrade to GraphQL" --retrofit
```

## 🛠️ Customization

### Adding New Agents
1. Create YAML file in appropriate directory
2. Specify required tools
3. Define capabilities and prompts
4. Update orchestrator if needed

### Modifying Workflow
1. Edit `ideation-orchestrator.yaml`
2. Adjust execution_flow section
3. Update approval prompts
4. Test the changes

## 🚨 Error Handling

The system handles various failure scenarios:
- **MCP Tools Unavailable**: Falls back to basic patterns
- **File Write Errors**: Retries with alternative paths
- **User Cancellation**: Saves progress for resumption
- **Agent Failures**: Retries or provides manual fallback

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. MCP Tools Not Working
**Symptoms**: Research or documentation stages fail immediately
**Solutions**:
- Check if MCP servers are configured: `claude mcp list`
- Verify Perplexity API key is set in MCP config
- Use `--skip-research` or `--skip-docs` flags as workaround
- Run with `--mcp-debug` flag for detailed errors

#### 2. Workflow Interruption
**Symptoms**: Process stops unexpectedly
**Solutions**:
- Check `.vibe/` directory for saved progress
- Restart with same feature idea (will use existing context)
- Future: Use `--resume-from-stage` option (planned)

#### 3. Large Codebase Performance
**Symptoms**: Architecture analysis takes too long or times out
**Solutions**:
- Focus on specific directories in your feature description
- Limit scan with more specific feature scope
- Consider breaking large features into smaller ones

#### 4. File Permission Errors
**Symptoms**: Cannot create `.vibe/` directory or write files
**Solutions**:
- Check directory permissions
- Run from project root with write access
- Ensure no conflicting `.vibe/` directory exists

#### 5. Agent Chain Breaking
**Symptoms**: Next agent doesn't start after approval
**Solutions**:
- Type exactly 'y' or 'yes' for approval (case-sensitive)
- Check for error messages in previous agent output
- Verify all agent files exist in correct locations

#### 6. Context7 Library Not Found
**Symptoms**: Documentation stage can't find libraries
**Solutions**:
- Try alternative library names (e.g., 'react' vs 'reactjs')
- Check if library exists in Context7 database
- Skip documentation phase if library is uncommon

#### 7. Perplexity Rate Limiting
**Symptoms**: Research queries fail or timeout
**Solutions**:
- Wait a few minutes before retrying
- Use `--quick` mode for fewer queries
- Check Perplexity API usage limits

### Performance Warnings

⚠️ **Large Codebases**: Projects with >1000 files may experience slow analysis. Consider:
- Running analysis on specific modules
- Using more targeted feature descriptions
- Excluding directories like `node_modules` (automatic)

⚠️ **Memory Usage**: Complex features may use significant memory. If issues occur:
- Break down into smaller features
- Close other applications
- Use `--quick` mode

### Debug Mode

For detailed debugging information:
```bash
clause --mcp-debug
/vibe-feature-ideate "Your feature" 
```

### Getting Help

If issues persist:
1. Check agent YAML files for syntax errors
2. Verify Claude Code is up to date: `npm update -g @anthropic-ai/claude-code`
3. Review agent output files in `.vibe/` directory
4. Report issues with full error messages and context

## 📝 Notes

- All agents work within Claude Code's single-session constraint
- No state persistence between sessions
- User approval required at each stage
- File-based communication ensures transparency
- Progress tracked with TodoWrite tool

## 🔗 Related Commands

### Implemented Commands
- `/vibe-feature-ideate` - Transform feature ideas into implementation plans
- `/vibe-generate-agents` - Generate custom agents for your feature
- `/vibe-retrofit-phases` - Retrofit existing code into phases
- `/vibe-retrofit-existing` - Analyze and retrofit existing codebases

### Under Development
- `/vibe-project-ideate` - Full project ideation (see stub documentation)
- `/vibe-step-1` through `/vibe-step-10` - Individual Vibe workflow steps
- `/vibe-vertical-slice` - Create a working vertical slice

See `vibe-steps-reference.md` for details on planned commands.

## 🤝 Contributing

To contribute to this system:
1. Follow the existing agent structure
2. Ensure Claude Code compatibility
3. Add appropriate error handling
4. Update documentation

## 📄 License

This system is part of the Vibe Coding methodology and follows its licensing terms.