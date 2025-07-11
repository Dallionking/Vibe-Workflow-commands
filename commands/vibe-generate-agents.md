# /vibe-generate-agents Command

## Purpose
Automatically generates custom agents based on detected patterns, architecture, and workflows in your codebase.

## Command Structure
```bash
/vibe-generate-agents [options]
```

## Options
- `--pattern="pattern_name"`: Generate agents for specific pattern
- `--architecture="arch_type"`: Generate architecture-specific agents  
- `--workflow="workflow_name"`: Generate workflow automation agents
- `--interactive`: Choose which agents to generate
- `--test`: Generate with test suites
- `--relationships`: Define agent interaction rules

## Agent Generation Process

### Step 1: Pattern Analysis
```yaml
pattern_detection:
  code_patterns:
    - CRUD_operations:
        detection: "Repeated create/read/update/delete patterns"
        agent: "crud_orchestrator"
        
    - form_handling:
        detection: "Multiple form validation/submission patterns"
        agent: "form_automation_agent"
        
    - API_integrations:
        detection: "External API calls with similar structure"
        agent: "api_integration_manager"
        
    - data_transformations:
        detection: "Repeated data mapping/transformation logic"
        agent: "data_pipeline_agent"
```

### Step 2: Architecture-Based Generation
```yaml
architecture_agents:
  react_spa:
    - component_orchestrator:
        purpose: "Generate and manage React components"
        capabilities:
          - "Create functional/class components"
          - "Manage component state and props"
          - "Handle component lifecycle"
          - "Optimize performance"
          
    - state_management_agent:
        purpose: "Handle Redux/Context/Zustand state"
        capabilities:
          - "Create actions and reducers"
          - "Manage global state"
          - "Handle side effects"
          - "State persistence"
          
    - routing_agent:
        purpose: "Manage React Router configuration"
        capabilities:
          - "Create and modify routes"
          - "Handle navigation guards"
          - "Manage URL parameters"
          
  microservices:
    - service_orchestrator:
        purpose: "Coordinate microservice communication"
        capabilities:
          - "Service discovery"
          - "Load balancing"
          - "Circuit breaking"
          - "Request routing"
          
    - api_gateway_agent:
        purpose: "Manage API gateway configuration"
        capabilities:
          - "Route management"
          - "Authentication handling"
          - "Rate limiting"
          - "Response aggregation"
          
  monolithic:
    - module_separator:
        purpose: "Help break monolith into modules"
        capabilities:
          - "Identify boundaries"
          - "Extract modules"
          - "Manage dependencies"
          - "Refactor safely"
```

### Step 3: Workflow Automation
```yaml
workflow_agents:
  deployment_pipeline:
    - ci_cd_orchestrator:
        triggers: ["push to main", "pull request"]
        actions:
          - "Run tests"
          - "Build artifacts"
          - "Deploy to staging"
          - "Run smoke tests"
          
  code_review:
    - review_assistant:
        triggers: ["pull request created"]
        actions:
          - "Check code style"
          - "Run security scan"
          - "Suggest improvements"
          - "Generate review summary"
          
  feature_development:
    - feature_coordinator:
        triggers: ["new feature branch"]
        actions:
          - "Create boilerplate"
          - "Update documentation"
          - "Generate tests"
          - "Track progress"
```

## Generated Agent Structure

### Base Agent Template
```yaml
# generated_agent_name.yaml
agent:
  name: "custom_feature_agent"
  version: "1.0.0"
  generated_from: "pattern|architecture|workflow"
  
metadata:
  purpose: "Specific purpose based on detected pattern"
  created: "2024-01-15"
  codebase_context: "Path and relevant files"
  
capabilities:
  - capability_1:
      description: "What it does"
      implementation: "How it does it"
      
  - capability_2:
      description: "Another capability"
      implementation: "Implementation details"
      
triggers:
  - on_command: "/command-name"
  - on_file_change: "**/*.jsx"
  - on_event: "pull_request"
  
interactions:
  depends_on: ["other_agent_1", "other_agent_2"]
  provides_to: ["consumer_agent_1"]
  communication: "async|sync"
  
configuration:
  working_directory: "/src"
  file_patterns: ["*.js", "*.jsx"]
  exclude_patterns: ["*.test.js"]
  
prompts:
  system: |
    You are a specialized agent for [specific purpose].
    You understand [codebase context].
    You follow [project conventions].
    
  task_templates:
    - create_component: |
        Create a new React component following project patterns
        
    - update_state: |
        Update Redux state following established patterns
```

### Specialized Agent Examples

#### React Component Generator
```yaml
agent:
  name: "react_component_orchestrator"
  version: "1.0.0"
  
capabilities:
  - generate_component:
      description: "Create new React components"
      templates:
        - functional_component
        - class_component
        - hook_based_component
      
  - refactor_component:
      description: "Refactor existing components"
      operations:
        - extract_sub_components
        - convert_to_hooks
        - optimize_renders
        
  - test_component:
      description: "Generate component tests"
      frameworks:
        - jest
        - react_testing_library
        - cypress_component
        
configuration:
  component_patterns:
    - container_presentational
    - atomic_design
    - feature_based
    
  style_approach: "css_modules|styled_components|tailwind"
  typescript: true
  prop_types: false
```

#### API Endpoint Manager
```yaml
agent:
  name: "api_endpoint_orchestrator"
  version: "1.0.0"
  
capabilities:
  - create_endpoint:
      description: "Generate new API endpoints"
      supports:
        - REST
        - GraphQL
        - WebSocket
        
  - validate_requests:
      description: "Add request validation"
      libraries:
        - joi
        - yup
        - express_validator
        
  - generate_documentation:
      description: "Create API documentation"
      formats:
        - OpenAPI/Swagger
        - Postman collection
        - Markdown
        
patterns:
  middleware_chain: ["auth", "validate", "handler", "error"]
  response_format: "JSend|JSON:API|Custom"
  error_handling: "centralized|per_endpoint"
```

#### Database Migration Agent
```yaml
agent:
  name: "database_migration_handler"
  version: "1.0.0"
  
capabilities:
  - create_migration:
      description: "Generate database migrations"
      supports:
        - sequelize
        - typeorm
        - knex
        - prisma
        
  - validate_schema:
      description: "Ensure schema consistency"
      checks:
        - foreign_key_integrity
        - index_optimization
        - naming_conventions
        
  - rollback_safety:
      description: "Ensure safe rollbacks"
      features:
        - backup_creation
        - validation_tests
        - rollback_scripts
        
configuration:
  database_type: "postgresql|mysql|mongodb"
  migration_style: "sql|programmatic"
  naming_pattern: "timestamp_description"
```

## Usage Examples

### Generate All Recommended Agents
```bash
/vibe-generate-agents

> Analyzing codebase for agent opportunities...
> 
> Detected Patterns:
> ✓ React component patterns (287 components)
> ✓ Redux state management pattern
> ✓ REST API pattern (42 endpoints)
> ✓ Database migration pattern
> ✓ Test automation pattern
> 
> Generating Agents:
> ✓ react_component_orchestrator.yaml
> ✓ redux_state_manager.yaml
> ✓ api_endpoint_creator.yaml
> ✓ database_migration_handler.yaml
> ✓ test_automation_agent.yaml
> 
> Agent Relationships Defined:
> - component_orchestrator → state_manager
> - api_creator → database_handler
> - All agents → test_automation
> 
> Created: agents/orchestration_map.yaml
> 
> Next: Run /vibe-orchestrate to activate agents
```

### Generate Pattern-Specific Agents
```bash
/vibe-generate-agents --pattern="form_handling"

> Analyzing form handling patterns...
> Found 23 forms with similar structure
> 
> Common patterns detected:
> - Validation with Yup
> - Formik for form state
> - Custom error handling
> - Multi-step forms
> 
> Generating form_automation_agent.yaml
> 
> Agent Capabilities:
> ✓ Generate form components
> ✓ Create validation schemas
> ✓ Handle form submission
> ✓ Manage form state
> ✓ Generate form tests
> 
> Example usage:
> /form-agent create --name="UserProfile" --fields="name,email,phone"
```

### Interactive Agent Selection
```bash
/vibe-generate-agents --interactive

> Detected agent opportunities:
> 
> 1. [✓] Component Generator (React)
> 2. [✓] State Manager (Redux)
> 3. [ ] GraphQL Resolver Generator
> 4. [✓] Test Orchestrator
> 5. [ ] Documentation Updater
> 6. [✓] Code Formatter
> 7. [ ] Performance Analyzer
> 
> Selected 4 agents for generation.
> 
> Configure Component Generator:
> - Style system? [css-modules/styled-components/tailwind]: tailwind
> - TypeScript? [y/n]: y
> - Test framework? [jest/vitest]: vitest
> 
> Generating selected agents...
> ✓ Complete! Agents created in: ./agents/
```

### Workflow-Based Generation
```bash
/vibe-generate-agents --workflow="feature_development"

> Analyzing feature development workflow...
> 
> Typical workflow detected:
> 1. Create feature branch
> 2. Add components
> 3. Update state/API
> 4. Write tests
> 5. Update docs
> 6. Create PR
> 
> Generating workflow automation agents:
> ✓ feature_branch_agent.yaml
> ✓ component_scaffolder.yaml
> ✓ api_updater.yaml
> ✓ test_generator.yaml
> ✓ doc_maintainer.yaml
> ✓ pr_assistant.yaml
> 
> Workflow orchestration created!
> Start new feature: /feature-start "user-profile"
```

## Agent Relationship Management

### Orchestration Configuration
```yaml
# agents/orchestration_map.yaml
agent_relationships:
  hierarchical:
    - orchestrator: "main_coordinator"
      subordinates:
        - "component_generator"
        - "state_manager"
        - "test_creator"
        
  peer_to_peer:
    - agents: ["api_creator", "database_handler"]
      communication: "bidirectional"
      protocol: "event-based"
      
  pipeline:
    - sequence:
      - "code_generator"
      - "formatter"
      - "test_runner"
      - "documentation_updater"
      
coordination_rules:
  - rule: "component_created"
    trigger: "component_generator"
    notify: ["state_manager", "test_creator"]
    
  - rule: "api_modified"
    trigger: "api_creator"
    actions:
      - "update_documentation"
      - "regenerate_client_types"
      - "run_integration_tests"
```

### Communication Protocols
```yaml
agent_communication:
  sync_patterns:
    request_response:
      - sender: "component_generator"
        receiver: "style_system_agent"
        message: "need_styles_for_component"
        
  async_patterns:
    event_broadcast:
      - event: "database_schema_changed"
        subscribers:
          - "api_endpoint_updater"
          - "type_generator"
          - "migration_validator"
          
    queue_based:
      - queue: "test_generation_queue"
        producers: ["component_generator", "api_creator"]
        consumers: ["test_automation_agent"]
```

## Validation and Testing

### Agent Validation
```yaml
validation_checks:
  - capability_test:
      agent: "component_generator"
      test: "Create sample component"
      expected: "Valid React component"
      
  - integration_test:
      agents: ["api_creator", "database_handler"]
      test: "Create endpoint with database"
      expected: "Working CRUD endpoint"
      
  - performance_test:
      agent: "test_automation"
      metric: "Test generation time"
      threshold: "<5 seconds per test"
```

## Best Practices

### Agent Design Principles
1. **Single Responsibility**: Each agent has one clear purpose
2. **Composability**: Agents work together seamlessly
3. **Configurability**: Adapt to project conventions
4. **Testability**: Include validation and tests
5. **Documentation**: Self-documenting behavior

### Naming Conventions
```yaml
naming_patterns:
  pattern_based: "{pattern}_orchestrator"
  feature_based: "{feature}_automation_agent"
  workflow_based: "{workflow}_coordinator"
  utility_based: "{utility}_helper_agent"
```

### Performance Considerations
- Lazy loading for large agents
- Caching for repeated operations
- Parallel execution where possible
- Resource limits per agent
- Cleanup procedures

## Integration Points

### With Other Vibe Commands
- `/vibe-retrofit-existing`: Initial agent suggestions
- `/vibe-orchestrate`: Coordinate generated agents
- `/vibe-learn`: Improve agents over time
- `/vibe-test`: Validate agent behavior

### External Tool Integration
- Git hooks for workflow agents
- CI/CD pipeline integration
- IDE plugin connections
- Monitoring tool webhooks