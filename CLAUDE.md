# CLAUDE.md v2.0

---
version: 2.0
project_type: developer-tools
created: 2024-01-01
context_layers:
  global:
    enabled: true
    budget: 2000
  phase:
    enabled: true
    budget: 3000
  task:
    enabled: true
    budget: 2000
---

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Vibe Workflow Commands - Context-Enhanced Development System

## Project Overview
This is the Vibe Workflow Commands v2.0 - a revolutionary context-enhanced AI-powered development system that transforms Claude into an intelligent development partner. It implements the 10-step Vibe Coding methodology with advanced context engineering for optimal AI assistance.

## Context Layers (L1: Global Rules)

### Project Conventions
- **Architecture**: TypeScript-based modular architecture with clear separation of concerns
- **Code Style**: ESLint + Prettier enforced, 2-space indentation, single quotes
- **Testing**: Jest with 85%+ coverage requirement, comprehensive test suites
- **Documentation**: JSDoc for all public APIs, comprehensive README and guides
- **Error Handling**: Graceful degradation, helpful error messages, recovery strategies
- **Performance**: Token optimization, caching, real-time monitoring

### Quality Standards
- Maintain 95%+ test coverage for generated code
- All commands must validate prerequisites before execution
- Context must be preserved across all operations
- MCP tools must degrade gracefully when unavailable
- Performance metrics must be tracked and optimized
- Security scanning on all commits

### Security Policies
- Never commit sensitive data or API keys
- Validate and sanitize all user inputs
- Use environment variables for configuration
- Implement proper access controls
- Regular security audits with npm audit

## Essential Commands

### Development Commands
```bash
npm test              # Run comprehensive test suite
npm run test:unit     # Run unit tests only
npm run test:context  # Test context engineering
npm run validate      # Validate project structure
npm run doctor        # System health check
npm run lint          # Run ESLint
npm run typecheck     # TypeScript validation
npm run precommit     # Full pre-commit validation
```

### Context Management
```bash
/vibe-context show    # Display context state
/vibe-context update  # Update context layers
/vibe-context optimize # Optimize for performance
/vibe-learn           # Learn from patterns
```

## Core Architecture

### Project Structure
```
vibe-workflow-commands/
├── src/                    # Source code
│   ├── commands/          # Command implementations
│   │   ├── base-command.ts # Base class for all commands
│   │   └── enhanced/      # Context-enhanced commands
│   └── integration/       # System integration
├── context/               # Context engineering system
│   ├── layers/           # Context layer implementations
│   ├── assembly/         # Dynamic context assembly
│   ├── memory/           # Learning and pattern recognition
│   ├── validation/       # Validation gates
│   └── performance/      # Optimization components
├── agents/               # AI agent configurations
├── templates/            # Project templates
├── tests/               # Test suites
└── scripts/             # Utility scripts
```

### Context Engineering Architecture
```typescript
// Three-tier context system
interface ContextSystem {
  layers: {
    global: GlobalContextLayer;    // L1: Project-wide rules (2k tokens)
    phase: PhaseContextLayer;       // L2: Current phase context (3k tokens)
    task: TaskContextLayer;         // L3: Task-specific context (2k tokens)
  };
  assembly: DynamicContextManager;  // Real-time context assembly
  memory: ContextMemoryStore;       // Pattern learning system
  optimization: TokenOptimizer;     // Performance optimization
}
```

## Development Patterns

### Command Implementation Pattern
```typescript
class EnhancedCommand extends BaseCommand {
  async execute(params: CommandParams): Promise<CommandResult> {
    // 1. Pre-execution validation
    await this.validate(params);
    
    // 2. Assemble context
    const context = await this.assembleContext(params);
    
    // 3. Execute with context
    const result = await this.implement(params, context);
    
    // 4. Post-execution validation
    await this.validateResult(result);
    
    // 5. Learn from execution
    await this.recordPattern(result);
    
    return result;
  }
}
```

### MCP Tool Integration
1. **Context7** - Primary documentation source
2. **Perplexity** - Research with conversation context
3. **Sequential Thinking** - Complex planning
4. **TaskMaster** - Task breakdown
5. **Playwright** - UI testing automation
6. **GitHub** - Version control operations

### Error Recovery Strategy
```typescript
try {
  // Primary execution path
  result = await executePrimary();
} catch (error) {
  // Fallback to secondary
  if (fallbackAvailable()) {
    result = await executeFallback();
  } else {
    // Graceful degradation
    result = await executeMinimal();
  }
  // Always inform user
  logWarning(error);
}
```

## Validation Gates

### Phase Transition Requirements
```yaml
phase_1_to_2:
  conditions:
    - all_tests_passing: true
    - coverage_threshold: 95
    - documentation_complete: true
    - no_critical_issues: true
```

### Pre-commit Validation
- ESLint and TypeScript checks
- Unit test execution
- Security scanning
- Context integrity verification
- Documentation validation

## Performance Optimization

### Token Budget Management
- Global layer: 2000 tokens max
- Phase layer: 3000 tokens max
- Task layer: 2000 tokens max
- Total budget: 7000 tokens

### Optimization Strategies
1. **Compression**: Remove whitespace, minify when possible
2. **Deduplication**: Reference shared content
3. **Summarization**: Intelligently summarize low-priority content
4. **Caching**: Reuse assembled contexts
5. **Lazy Loading**: Load only required sections

## Pattern Library

### Detected Patterns
- **Command Pattern**: Base class with validation, execution, learning
- **Context Pattern**: Three-tier layered architecture
- **Validation Pattern**: Pre/post execution gates
- **Learning Pattern**: Record, analyze, adapt

### Code Conventions
```typescript
// Async/await over promises
async function preferred() { }

// Explicit types over inference
function explicit(param: string): Promise<Result> { }

// Error-first handling
if (error) return handleError(error);

// Early returns for clarity
if (!valid) return null;
```

## Testing Strategy

### Test Categories
1. **Unit Tests**: Individual component testing
2. **Integration Tests**: System integration validation
3. **Context Tests**: Context engineering verification
4. **Performance Tests**: Optimization validation
5. **E2E Tests**: Full workflow validation

### Coverage Requirements
- Lines: 85%+
- Statements: 85%+
- Functions: 80%+
- Branches: 80%+

## Git Workflow

### Branch Strategy
- `main`: Stable releases
- `develop`: Active development
- `feature/context-engineering`: Current feature branch
- `feature/phase-X-*`: Phase-specific features

### Commit Convention
```
feat(context): add dynamic context assembly
fix(commands): resolve validation error in vibe-init
docs: update context engineering guide
test: add performance optimization tests
```

## Monitoring and Metrics

### Key Metrics
- Context assembly time: <100ms target
- Cache hit rate: >60% target
- Token optimization: >40% reduction target
- Command success rate: >95% target

### Performance Monitoring
```bash
# View real-time metrics
/vibe-metrics show

# Export performance report
/vibe-metrics export --format=json
```

## Future Enhancements

### Planned Features
- Multi-agent collaboration
- Visual context editor
- Custom pattern definitions
- Real-time collaboration
- AI model fine-tuning

### Research Areas
- Advanced token compression algorithms
- Predictive context assembly
- Cross-project pattern sharing
- Automated optimization tuning

## Important Notes

### When Implementing Features
1. Always check context availability first
2. Implement fallback strategies
3. Track performance metrics
4. Update documentation immediately
5. Add comprehensive tests

### When Debugging
1. Enable debug mode: `VIBE_DEBUG=true`
2. Check context assembly: `/vibe-context show --verbose`
3. Review performance metrics: `/vibe-metrics show`
4. Validate structure: `npm run validate`
5. Run health check: `npm run doctor`

### When Optimizing
1. Profile token usage first
2. Identify redundant content
3. Apply optimization incrementally
4. Measure impact
5. Document changes

Remember: This system represents the future of AI-assisted development. Every feature should enhance developer productivity while maintaining code quality and system performance.