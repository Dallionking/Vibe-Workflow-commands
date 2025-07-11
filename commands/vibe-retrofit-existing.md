# /vibe-retrofit-existing Command

## Purpose
Analyzes an existing codebase and creates a complete Vibe Coding environment around it.

## Command Structure
```bash
/vibe-retrofit-existing [path] [options]
```

## Options
- `--deep`: Perform ultra-deep analysis (slower but more thorough)
- `--incremental`: Allow incremental adoption
- `--framework=[name]`: Specify framework if known (react, vue, django, etc.)
- `--focus=[area]`: Focus on specific area (frontend, backend, database, etc.)
- `--generate-all`: Generate all agents and documentation immediately
- `--dry-run`: Preview what would be created without making changes

## Workflow

### Step 1: Initial Scan
```yaml
scan_process:
  - file_structure: Map all files and directories
  - tech_stack: Detect languages, frameworks, tools
  - size_metrics: Count files, lines of code, complexity
  - dependency_scan: Analyze package.json, requirements.txt, etc.
  - git_analysis: Examine commit history and patterns
```

### Step 2: Pattern Detection
```yaml
patterns_analyzed:
  - architecture_patterns:
    - MVC/MVP/MVVM
    - Microservices
    - Monolithic
    - Serverless
    - Event-driven
    
  - code_patterns:
    - Design patterns used
    - Common workflows
    - Repeated structures
    - Anti-patterns
    
  - team_patterns:
    - Commit styles
    - Branch strategies
    - Code ownership
    - Review processes
```

### Step 3: Report Generation
```yaml
retrofit_report:
  summary:
    codebase_name: "Project Name"
    primary_language: "JavaScript/TypeScript"
    framework: "React + Express"
    architecture: "Microservices"
    complexity_score: 7.2/10
    
  recommendations:
    - high_priority:
      - "Add comprehensive documentation"
      - "Create state management agents"
      - "Implement phase separation"
      
    - medium_priority:
      - "Refactor authentication module"
      - "Standardize API responses"
      
    - low_priority:
      - "Update deprecated dependencies"
      - "Optimize build process"
  
  suggested_agents:
    - react_component_orchestrator
    - api_endpoint_manager
    - database_migration_handler
    - test_automation_coordinator
    - deployment_pipeline_agent
    
  proposed_phases:
    phase_1: "Infrastructure & Setup"
    phase_2: "Core Business Logic"
    phase_3: "User Interface"
    phase_4: "Integration & APIs"
    phase_5: "Testing & Validation"
    phase_6: "Deployment & Monitoring"
```

### Step 4: Documentation Creation
```yaml
generated_documents:
  - project_context.md:
    - Project overview
    - Technical stack
    - Architecture decisions
    - Key components
    
  - current_status.md:
    - Feature completion status
    - Known issues
    - Technical debt
    - Performance metrics
    
  - features.md:
    - Existing features
    - Planned features
    - Feature dependencies
    - User stories
    
  - retrofit_roadmap.md:
    - Migration timeline
    - Priority order
    - Risk assessment
    - Success metrics
```

### Step 5: Agent Generation
```yaml
agent_creation_process:
  1. analyze_patterns:
    - Identify repetitive tasks
    - Find automation opportunities
    - Map workflows
    
  2. generate_templates:
    - Create base agent structure
    - Define capabilities
    - Set interaction rules
    
  3. customize_agents:
    - Add project-specific logic
    - Configure parameters
    - Define triggers
    
  4. create_orchestration:
    - Define agent relationships
    - Set communication protocols
    - Create coordination rules
```

## Example Usage

### Basic Retrofit
```bash
/vibe-retrofit-existing /Users/project/my-app

> Starting Vibe Coding Retrofit...
> Scanning codebase structure... ✓
> Detecting architecture: React SPA with Node.js backend
> Analyzing 1,247 files across 89 directories
> Identifying patterns and workflows... ✓
> 
> Retrofit Analysis Complete!
> 
> Summary:
> - Architecture: Client-Server with REST API
> - Complexity: Medium (6.8/10)
> - Technical Debt: Moderate
> - Suggested Agents: 8
> - Proposed Phases: 6
> 
> Generated Files:
> ✓ retrofit_analysis.md
> ✓ project_context.md
> ✓ current_status.md
> ✓ suggested_agents/
> ✓ migration_roadmap.md
> 
> Next Steps:
> 1. Review retrofit_analysis.md
> 2. Run /vibe-approve-retrofit to proceed
> 3. Or run /vibe-retrofit-customize to adjust
```

### Deep Analysis with Focus
```bash
/vibe-retrofit-existing /Users/project/enterprise-app --deep --focus=backend

> Starting Deep Retrofit Analysis (Backend Focus)...
> Performing comprehensive backend analysis...
> 
> Backend Architecture Detected:
> - Framework: Express.js with TypeScript
> - Database: PostgreSQL with Sequelize ORM
> - Authentication: JWT with refresh tokens
> - API Style: RESTful with some GraphQL endpoints
> - Microservices: 4 services detected
> 
> Analyzing Service Patterns:
> ✓ Auth Service: Token management, user sessions
> ✓ Data Service: CRUD operations, data validation
> ✓ Notification Service: Email, SMS, push notifications
> ✓ Analytics Service: Event tracking, reporting
> 
> Generating Specialized Backend Agents:
> ✓ api_orchestrator_agent.yaml
> ✓ database_migration_agent.yaml
> ✓ service_communication_agent.yaml
> ✓ error_handling_agent.yaml
> ✓ performance_monitoring_agent.yaml
```

### Incremental Adoption
```bash
/vibe-retrofit-existing ./frontend --incremental

> Starting Incremental Retrofit...
> This will allow gradual adoption of Vibe Coding
> 
> Phase 1 Suggestions (Start Here):
> - Add project_context.md
> - Create component_generator agent
> - Document existing components
> 
> Phase 2 Suggestions (After Phase 1):
> - Implement state management agents
> - Add testing orchestration
> - Create style guide agent
> 
> Phase 3 Suggestions (Advanced):
> - Full phase retrofitting
> - Complete agent orchestration
> - Automated workflows
> 
> Created: incremental_adoption_plan.md
> Start with: /vibe-retrofit-module /src/components --phase=1
```

## Integration with Existing Commands

### Works With:
- `/vibe-learn`: Learn from retrofitted codebase patterns
- `/vibe-orchestrate`: Coordinate retrofitted agents
- `/ultrathink`: Deep analysis of retrofit options
- `/document-all`: Enhance generated documentation

### Triggers:
- `vibe-generate-agents`: After pattern analysis
- `vibe-retrofit-phases`: After initial retrofit
- `vibe-document-existing`: During documentation phase

## Success Indicators

### Immediate Benefits
1. **Documentation**: 0% → 80% coverage
2. **Automation**: Manual tasks → Agent-handled
3. **Organization**: Chaos → Structured phases
4. **Understanding**: Confusion → Clear architecture

### Long-term Benefits
1. **Velocity**: 2x faster feature development
2. **Quality**: 50% fewer bugs
3. **Onboarding**: Days → Hours
4. **Maintenance**: Reactive → Proactive

## Error Handling

### Common Issues
```yaml
error_scenarios:
  - unsupported_framework:
    message: "Framework not recognized"
    solution: "Use --framework option or continue with generic retrofit"
    
  - massive_codebase:
    message: "Codebase too large for single analysis"
    solution: "Use --focus option to analyze in sections"
    
  - no_clear_pattern:
    message: "No clear architecture pattern detected"
    solution: "Manual configuration required, see retrofit_manual.md"
    
  - git_history_missing:
    message: "No git history found"
    solution: "Proceeding without historical analysis"
```

## Customization Options

### Custom Pattern Detection
```yaml
# .vibe-retrofit-config.yaml
custom_patterns:
  - name: "Custom Auth Flow"
    files: ["**/auth/**", "**/login/**"]
    generate_agent: true
    
  - name: "Data Pipeline"
    files: ["**/etl/**", "**/pipeline/**"]
    phase: "Data Processing"
```

### Agent Template Overrides
```yaml
agent_overrides:
  component_generator:
    include_patterns: ["*.jsx", "*.tsx", "*.vue"]
    exclude_patterns: ["*.test.*", "*.spec.*"]
    custom_prompts:
      - "Always use TypeScript"
      - "Follow team style guide"
```