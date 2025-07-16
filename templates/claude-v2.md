# CLAUDE.md v2.0

---
version: 2.0
project_type: full-stack
created: ${new Date().toISOString()}
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

## Context Layers

### L1: Global Rules (Always Active)
This layer contains project-wide rules and standards that apply to all commands and operations.

#### Project Conventions
- **Code Style**: Follow ESLint and Prettier configurations
- **Naming**: Use camelCase for variables, PascalCase for components
- **File Structure**: Feature-based organization with clear separation of concerns
- **Comments**: Minimal comments, self-documenting code preferred

#### Quality Standards  
- **Test Coverage**: Maintain 95%+ test coverage on all new code
- **Performance**: No UI operations should block thread > 16ms
- **Accessibility**: WCAG 2.1 AA compliance required
- **Documentation**: All public APIs must be documented

#### Security Policies
- Never commit sensitive data or credentials
- Use environment variables for all configuration
- Validate and sanitize all user inputs
- Follow OWASP security guidelines

### L2: Phase Context (Current Phase)
This layer loads dynamically based on the current development phase.

#### Phase Dependencies
- Previous phase outputs are automatically loaded
- Pattern library from completed features
- Design system components and tokens

#### Active Patterns
The system will detect and load patterns relevant to the current phase:
- Component patterns
- API patterns  
- State management patterns
- Testing patterns

### L3: Task Context (Current Task)
This layer provides task-specific context and recent changes.

#### Task Instructions
Specific instructions for the current command will be loaded here.

#### Recent Context
- Git status and recent commits
- Currently modified files
- Error context from previous attempts

## Validation Gates

### Phase Transition Requirements
```yaml
phase_1_to_2:
  conditions:
    - all_tests_passing: true
    - documentation_complete: true
    - code_review_approved: true
  
phase_2_to_3:
  conditions:
    - api_contracts_defined: true
    - integration_tests_passing: true
    - performance_benchmarks_met: true
```

## Context Memory

### Learned Patterns
The system learns from your development patterns and preferences:
- Successfully used patterns increase in confidence
- Team preferences are detected and reinforced
- Common error patterns are avoided

### Decision History
Important decisions are tracked for consistency:
- Architecture choices
- Technology selections
- Naming conventions

## Dynamic Sections

### @dynamic(tool:typescript)
When working with TypeScript files:
- Enforce strict type checking
- Prefer interfaces over types
- Use proper generic constraints

### @dynamic(phase:testing)
During testing phases:
- Write tests first (TDD approach)
- Focus on edge cases
- Maintain test isolation

### @dynamic(env:production)
For production deployments:
- Enable all optimizations
- Verify security checklist
- Confirm monitoring setup

## Command Customizations

### vibe-init
- Initialize with TypeScript by default
- Set up git hooks for validation
- Create initial context memory

### vibe-retrofit
- Preserve all existing functionality
- Detect and maintain current patterns
- Generate compatibility layer

### vibe-validate-work
- Check pattern compliance (95%+ similarity)
- Verify test coverage requirements
- Scan for security vulnerabilities

## Pattern Library

### Component Patterns
```typescript
// Functional component with hooks
export const Component: FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  return <div>{/* JSX */}</div>;
};
```

### API Patterns
```typescript
// RESTful endpoint pattern
export const handler = async (req: Request, res: Response) => {
  try {
    const result = await service.method(req.params);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Test Patterns
```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });

  it('should behave correctly', () => {
    // Arrange
    const input = createInput();
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toMatchExpectation();
  });
});
```

## Notes
This file is automatically loaded and parsed by the Vibe Coding context system. Sections are dynamically included based on the current command, phase, and task context.