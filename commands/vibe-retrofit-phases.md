# /vibe-retrofit-phases Command

## Purpose
Retrofits existing code into Universal Format phases, creating clear separation of concerns and enabling phase-based development.

## Command Structure
```bash
/vibe-retrofit-phases [options]
```

## Options
- `--analyze`: Only analyze and suggest phases without making changes
- `--incremental`: Retrofit one phase at a time
- `--module="path"`: Retrofit specific module/directory
- `--workflow="name"`: Retrofit based on specific workflow
- `--preserve-structure`: Maintain current file structure
- `--aggressive`: More aggressive refactoring for cleaner phases

## Universal Format Phases

### Standard Phase Structure
```yaml
phases:
  phase_1_planning:
    purpose: "Requirements, design, architecture"
    typical_contents:
      - Requirements documents
      - Architecture diagrams
      - API specifications
      - Database schemas
      
  phase_2_foundation:
    purpose: "Core infrastructure and setup"
    typical_contents:
      - Configuration files
      - Database connections
      - Authentication setup
      - Base utilities
      
  phase_3_core_logic:
    purpose: "Business logic and domain models"
    typical_contents:
      - Domain models
      - Business rules
      - Core algorithms
      - Service layer
      
  phase_4_interface:
    purpose: "User interfaces and APIs"
    typical_contents:
      - UI components
      - API endpoints
      - Controllers
      - View layers
      
  phase_5_integration:
    purpose: "External integrations and services"
    typical_contents:
      - Third-party APIs
      - Payment processing
      - Email services
      - Analytics
      
  phase_6_testing:
    purpose: "Comprehensive testing"
    typical_contents:
      - Unit tests
      - Integration tests
      - E2E tests
      - Test utilities
      
  phase_7_deployment:
    purpose: "Deployment and monitoring"
    typical_contents:
      - CI/CD configs
      - Docker files
      - Monitoring setup
      - Performance tools
```

## Retrofitting Process

### Step 1: Code Analysis
```yaml
analysis_process:
  dependency_mapping:
    - Identify import/export relationships
    - Create dependency graph
    - Find circular dependencies
    - Determine load order
    
  logical_grouping:
    - Group related functionality
    - Identify natural boundaries
    - Find shared utilities
    - Detect cross-cutting concerns
    
  complexity_assessment:
    - Measure coupling between modules
    - Identify refactoring needs
    - Estimate migration effort
    - Risk assessment
```

### Step 2: Phase Assignment
```yaml
assignment_strategy:
  automatic_detection:
    - Config files → Phase 2 (Foundation)
    - Models/Schemas → Phase 3 (Core Logic)
    - Components/Views → Phase 4 (Interface)
    - Tests → Phase 6 (Testing)
    
  pattern_matching:
    - "**/config/**" → Foundation
    - "**/models/**" → Core Logic
    - "**/components/**" → Interface
    - "**/services/**" → Core Logic/Integration
    
  smart_inference:
    - Analyze file content
    - Understand purpose
    - Consider dependencies
    - Assign optimal phase
```

### Step 3: Migration Planning
```yaml
migration_plan:
  phase_order:
    - Start with least dependent code
    - Move utilities first
    - Handle core logic
    - Migrate interfaces
    - Update integrations
    - Relocate tests
    
  dependency_resolution:
    - Update import paths
    - Create phase bridges
    - Handle circular deps
    - Maintain functionality
    
  validation_steps:
    - Test after each move
    - Verify imports work
    - Check functionality
    - Performance testing
```

## Retrofitting Strategies

### Strategy 1: Preserve Structure
```bash
# Maintains current directory structure while adding phase markers

Before:
/src
  /components
    Button.jsx
    Form.jsx
  /services
    api.js
    auth.js
  /utils
    helpers.js

After:
/src
  /phase_2_foundation
    /utils
      helpers.js
    /services
      auth.js
  /phase_3_core_logic
    /services
      api.js
  /phase_4_interface
    /components
      Button.jsx
      Form.jsx
```

### Strategy 2: Full Restructure
```bash
# Complete reorganization into phase-based structure

Before:
/src
  scattered files and mixed concerns

After:
/phases
  /phase_1_planning
    requirements.md
    architecture.md
  /phase_2_foundation
    setup.js
    config/
    database/
  /phase_3_core_logic
    models/
    services/
    business/
  /phase_4_interface
    components/
    pages/
    api/
```

### Strategy 3: Hybrid Approach
```bash
# Mix of preservation and restructuring

/src
  /phases
    /foundation
    /core
    /interface
  /legacy  # Unchanged code
  /shared  # Cross-phase utilities
```

## Usage Examples

### Basic Analysis
```bash
/vibe-retrofit-phases --analyze

> Analyzing codebase for phase retrofitting...
> 
> Current Structure Analysis:
> - Total Files: 342
> - Logical Groups: 12
> - Dependency Depth: 4 levels
> - Circular Dependencies: 2 found
> 
> Suggested Phase Distribution:
> - Phase 1 (Planning): 5 files (docs, specs)
> - Phase 2 (Foundation): 28 files (config, setup)
> - Phase 3 (Core Logic): 89 files (models, services)
> - Phase 4 (Interface): 124 files (components, pages)
> - Phase 5 (Integration): 31 files (external APIs)
> - Phase 6 (Testing): 65 files (tests, mocks)
> 
> Complexity Assessment:
> - Easy to retrofit: 78%
> - Requires refactoring: 18%
> - Complex dependencies: 4%
> 
> Generated: phase_retrofit_plan.md
```

### Incremental Retrofitting
```bash
/vibe-retrofit-phases --incremental

> Starting Incremental Phase Retrofitting...
> 
> Phase 1: Foundation (Recommended to start)
> Files to move: 28
> Dependencies: None (safe to move)
> 
> Would you like to proceed? [y/n]: y
> 
> Creating phase structure...
> ✓ Created: /phases/phase_2_foundation/
> 
> Moving files...
> ✓ Moved: config/database.js
> ✓ Moved: config/environment.js
> ✓ Moved: utils/logger.js
> ... (25 more files)
> 
> Updating imports...
> ✓ Updated 47 import statements
> ✓ Created path aliases
> ✓ Updated tsconfig paths
> 
> Running validation...
> ✓ All tests passing
> ✓ Build successful
> ✓ No runtime errors
> 
> Phase 2 Foundation retrofitted successfully!
> Next recommended: Phase 3 Core Logic
```

### Module-Specific Retrofitting
```bash
/vibe-retrofit-phases --module="/src/components" --aggressive

> Retrofitting /src/components with aggressive refactoring...
> 
> Component Analysis:
> - Total Components: 47
> - Shared Components: 12
> - Page Components: 23
> - Utility Components: 12
> 
> Aggressive Refactoring Plan:
> 1. Extract shared styles → Phase 2
> 2. Create component library → Phase 3
> 3. Organize by feature → Phase 4
> 4. Extract component logic → Phase 3
> 5. Separate presentational → Phase 4
> 
> Executing refactoring...
> ✓ Extracted shared styles
> ✓ Created component library structure
> ✓ Separated logic from presentation
> ✓ Organized by feature
> ✓ Updated all imports
> 
> New Structure:
> /phases/phase_3_core_logic/
>   /component-library/
>     /atoms/
>     /molecules/
>     /organisms/
> 
> /phases/phase_4_interface/
>   /features/
>     /user-profile/
>     /dashboard/
>     /settings/
```

### Workflow-Based Retrofitting
```bash
/vibe-retrofit-phases --workflow="user-authentication"

> Analyzing user authentication workflow...
> 
> Workflow Components Found:
> - Login page component
> - Registration form
> - Auth service
> - JWT utilities
> - User model
> - Auth middleware
> - Password reset flow
> - Session management
> 
> Retrofitting into phases:
> 
> Phase 2 (Foundation):
> ✓ JWT utilities
> ✓ Session config
> ✓ Auth constants
> 
> Phase 3 (Core Logic):
> ✓ User model
> ✓ Auth service
> ✓ Password encryption
> 
> Phase 4 (Interface):
> ✓ Login page
> ✓ Registration form
> ✓ Password reset UI
> 
> Phase 5 (Integration):
> ✓ OAuth providers
> ✓ Email service
> 
> Creating workflow documentation...
> ✓ Created: phases/workflows/authentication.md
> ✓ Updated: phases/phase_*/README.md
```

## Phase Organization

### Phase Documentation
```markdown
# Phase 3: Core Logic

## Purpose
Contains all business logic, domain models, and core algorithms.

## Contents
- `/models` - Domain models and schemas
- `/services` - Business logic services  
- `/algorithms` - Core algorithms
- `/validators` - Business rule validation

## Dependencies
- Depends on: Phase 2 (Foundation)
- Required by: Phase 4 (Interface), Phase 5 (Integration)

## Key Files
- `models/User.js` - User domain model
- `services/OrderService.js` - Order processing logic
- `algorithms/pricing.js` - Pricing calculations

## Migration Notes
- Extracted from scattered `/src` files
- Refactored to remove UI dependencies
- Added clear interfaces for Phase 4
```

### Phase Boundaries
```yaml
# phases/phase_boundaries.yaml
phase_rules:
  phase_2_foundation:
    can_import_from: []  # No dependencies
    can_be_imported_by: ["all"]
    
  phase_3_core_logic:
    can_import_from: ["phase_2"]
    can_be_imported_by: ["phase_4", "phase_5", "phase_6"]
    
  phase_4_interface:
    can_import_from: ["phase_2", "phase_3"]
    can_be_imported_by: ["phase_6"]
    
  phase_5_integration:
    can_import_from: ["phase_2", "phase_3"]
    can_be_imported_by: ["phase_4", "phase_6"]
    
boundary_enforcement:
  - Use ESLint rules
  - Import path validation
  - Build-time checks
  - Runtime warnings
```

## Validation and Testing

### Phase Validation
```yaml
validation_steps:
  structural_validation:
    - No circular dependencies between phases
    - Each file assigned to exactly one phase
    - Import paths updated correctly
    - No broken imports
    
  functional_validation:
    - All tests still pass
    - Application builds successfully
    - Runtime behavior unchanged
    - Performance not degraded
    
  phase_cohesion:
    - Files in phase serve similar purpose
    - Minimal cross-phase coupling
    - Clear phase boundaries
    - Logical organization
```

### Testing Strategy
```bash
# Run after each phase migration
/vibe-retrofit-phases --validate

> Running Phase Validation...
> 
> Structural Checks:
> ✓ No circular dependencies
> ✓ All imports resolved
> ✓ Phase boundaries respected
> 
> Functional Checks:
> ✓ 342/342 tests passing
> ✓ Build successful (2.3s)
> ✓ No runtime errors
> 
> Performance Checks:
> ✓ Bundle size: -2.1% (improved!)
> ✓ Build time: +0.1s (acceptable)
> ✓ Test time: -0.5s (improved!)
> 
> Phase validation passed!
```

## Rollback Procedures

### Automatic Rollback
```yaml
rollback_triggers:
  - Test failures
  - Build errors
  - Runtime exceptions
  - Performance degradation > 10%
  
rollback_process:
  1. Stop migration
  2. Restore file positions
  3. Revert import changes
  4. Restore configurations
  5. Validate restoration
```

### Manual Rollback
```bash
/vibe-retrofit-phases --rollback

> Rolling back phase retrofitting...
> 
> Restoration Points:
> 1. Before phase 4 migration (2 hours ago)
> 2. Before phase 3 migration (4 hours ago)
> 3. Initial state (6 hours ago)
> 
> Select restoration point: 1
> 
> Restoring...
> ✓ Files moved back
> ✓ Imports reverted
> ✓ Configs restored
> ✓ Tests passing
> 
> Rollback complete!
```

## Best Practices

### Do's
1. **Start Small**: Begin with foundation/utilities
2. **Test Continuously**: Validate after each phase
3. **Document Changes**: Update phase documentation
4. **Maintain Functionality**: Never break working code
5. **Communicate**: Keep team informed of structure changes

### Don'ts
1. **Don't Rush**: Take time to plan migrations
2. **Don't Mix Phases**: Keep clear boundaries
3. **Don't Ignore Dependencies**: Resolve them properly
4. **Don't Skip Testing**: Always validate changes
5. **Don't Over-Engineer**: Keep it simple

## Integration with Agents

### Phase-Aware Agents
```yaml
agent_phase_rules:
  component_generator:
    default_phase: "phase_4_interface"
    can_modify: ["phase_4"]
    
  service_creator:
    default_phase: "phase_3_core_logic"
    can_modify: ["phase_3", "phase_5"]
    
  test_generator:
    default_phase: "phase_6_testing"
    can_modify: ["phase_6"]
    can_read: ["all"]
```

### Agent Coordination
- Agents understand phase boundaries
- Automatic phase detection for new files
- Phase-appropriate code generation
- Cross-phase dependency management