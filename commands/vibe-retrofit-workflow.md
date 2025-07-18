# vibe-retrofit-workflow

Coordinate comprehensive feature workflow retrofitting - orchestrate multiple retrofit operations for complete feature modernization.

## Usage
```
/vibe-retrofit-workflow <feature-name> [options]
```

## Parameters
- `feature-name` - Name of the feature to retrofit (e.g., "user-authentication", "shopping-cart")

## Options
- `--analyze` - Deep analysis of feature dependencies
- `--plan-only` - Generate retrofit plan without execution
- `--parallel` - Run compatible retrofits in parallel
- `--validate` - Run validation after each step
- `--rollback-on-error` - Auto rollback on failures

## Workflow Orchestration

### Phase 1: Feature Analysis
- **Dependency Mapping**: Identify all related files
- **Component Inventory**: List UI components
- **API Mapping**: Catalog endpoints
- **Data Flow**: Trace data through system
- **Test Coverage**: Assess existing tests

### Phase 2: Retrofit Planning
- **Priority Order**: Determine retrofit sequence
- **Risk Assessment**: Identify breaking changes
- **Parallel Opportunities**: Find independent tasks
- **Rollback Strategy**: Plan recovery approach
- **Timeline Estimation**: Project completion time

### Phase 3: Coordinated Execution
1. **Backend Retrofit**
   - API modernization
   - Database optimization
   - Service refactoring

2. **Frontend Retrofit**
   - Component modernization
   - State management update
   - UI/UX improvements

3. **Integration Retrofit**
   - API-UI connection
   - Real-time features
   - Error handling

4. **Testing Retrofit**
   - Test modernization
   - Coverage improvement
   - E2E test updates

## Coordination Features
- **Smart Sequencing**: Optimal retrofit order
- **Dependency Tracking**: Prevent conflicts
- **Progress Monitoring**: Real-time status
- **Quality Gates**: Validation checkpoints
- **Rollback Points**: Safe recovery options

## Examples
```bash
# Full feature retrofit
/vibe-retrofit-workflow "user-authentication"

# Analysis and planning only
/vibe-retrofit-workflow "shopping-cart" --analyze --plan-only

# Parallel execution with validation
/vibe-retrofit-workflow "payment-system" --parallel --validate

# Safe retrofit with rollback
/vibe-retrofit-workflow "inventory-management" --validate --rollback-on-error
```

## Workflow Integration
Automatically coordinates:
- `/vibe-retrofit-api` for backend
- `/vibe-retrofit-react` for frontend
- `/vibe-retrofit-orchestrator` for overall coordination
- Test suite updates
- Documentation generation

## Output
- **Workflow Plan**: Detailed execution strategy
- **Progress Dashboard**: Real-time status
- **Retrofit Report**: Changes summary
- **Quality Metrics**: Before/after comparison
- **Documentation**: Updated feature docs

## Safety Features
- Incremental changes with validation
- Automated rollback capabilities
- Backup creation before changes
- Compatibility verification
- Performance regression detection