---
description: Coordinate comprehensive feature workflow retrofitting
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__perplexity-mcp__perplexity_search_web
  - mcp__perplexity-ask__perplexity_ask
  - mcp__sequential-thinking__sequentialthinking
  - Task
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
parameters:
  - feature-name
  - --analyze
  - --plan-only
  - --parallel
  - --validate
  - --rollback-on-error
---

# vibe-retrofit-workflow

Coordinate comprehensive feature workflow retrofitting

## Usage
`/vibe-retrofit-workflow <feature-name> [--analyze] [--plan-only] [--parallel] [--validate] [--rollback-on-error]`

# Feature Workflow Coordinator Agent
# Auto-generated for complete feature development workflow

agent:
  name: "feature_workflow_coordinator"
  version: "1.0.0"
  purpose: "Orchestrate end-to-end feature development from planning to deployment"
  generated_from: "workflow_pattern"
  workflow_type: "feature_development"

metadata:
  description: |
    Coordinates the entire feature development lifecycle, managing
    tasks across planning, implementation, testing, and deployment phases.
  detected_workflow:
    steps:
      - Create feature branch
      - Plan implementation
      - Generate boilerplate
      - Implement features
      - Write tests
      - Update documentation
      - Create pull request
      - Deploy to staging
      - Merge and deploy

tools_required:
  claude_code:
    - Bash      # Git operations and commands
    - Read      # Read project files
    - Write     # Create new files
    - Edit      # Modify existing files
    - TodoWrite # Track workflow progress
    - Glob      # Find project files
    - Grep      # Search codebase

configuration:
  workflow_settings:
    branch_naming: "feature/{{feature-name}}"
    commit_style: "conventional"
    pr_template: true
    auto_assign_reviewers: true
    require_tests: true
    require_docs: true
  
  project_structure:
    frontend_path: "/src"
    backend_path: "/api"
    tests_path: "/tests"
    docs_path: "/docs"

capabilities:
  start_feature:
    description: "Initialize a new feature development workflow"
    parameters:
      - name: "feature_name"
        type: "string"
        required: true
      - name: "feature_type"
        type: "enum"
        values: ["ui", "api", "full-stack", "infrastructure"]
      - name: "priority"
        type: "enum"
        values: ["low", "medium", "high", "critical"]
      - name: "estimated_days"
        type: "number"
    
    workflow:
      1_planning:
        - Create feature specification
        - Define acceptance criteria
        - Identify dependencies
        - Create task breakdown
      
      2_setup:
        - Create feature branch
        - Setup development environment
        - Create initial file structure
        - Update project board
      
      3_implementation:
        - Generate boilerplate code
        - Implement core functionality
        - Add error handling
        - Integrate with existing code
      
      4_testing:
        - Write unit tests
        - Create integration tests
        - Perform manual testing
        - Run performance tests
      
      5_documentation:
        - Update API documentation
        - Create user documentation
        - Update changelog
        - Add code comments
      
      6_review:
        - Create pull request
        - Run automated checks
        - Request code review
        - Address feedback
      
      7_deployment:
        - Deploy to staging
        - Run smoke tests
        - Get approval
        - Deploy to production

  plan_feature:
    description: "Create detailed implementation plan"
    generates:
      feature_plan: |
        # Feature: {{feature_name}}
        
        ## Overview
        {{feature_description}}
        
        ## Acceptance Criteria
        {{#each acceptance_criteria}}
        - [ ] {{this}}
        {{/each}}
        
        ## Technical Approach
        ### Frontend Changes
        {{#each frontend_tasks}}
        - {{this}}
        {{/each}}
        
        ### Backend Changes
        {{#each backend_tasks}}
        - {{this}}
        {{/each}}
        
        ### Database Changes
        {{#each database_changes}}
        - {{this}}
        {{/each}}
        
        ## Dependencies
        - External APIs: {{external_apis}}
        - Libraries: {{required_libraries}}
        - Other features: {{feature_dependencies}}
        
        ## Risk Assessment
        - Complexity: {{complexity_score}}/10
        - Risk Level: {{risk_level}}
        - Mitigation: {{risk_mitigation}}
        
        ## Timeline
        - Start Date: {{start_date}}
        - Target Completion: {{end_date}}
        - Total Days: {{estimated_days}}
        
        ## Tasks Breakdown
        {{#each tasks}}
        - [ ] {{this.name}} ({{this.hours}}h)
        {{/each}}

  generate_boilerplate:
    description: "Create initial code structure for feature"
    templates:
      frontend_structure: |
        /features/{{feature_name}}/
          ├── components/
          │   ├── {{FeatureName}}.tsx
          │   ├── {{FeatureName}}.test.tsx
          │   └── {{FeatureName}}.module.css
          ├── hooks/
          │   └── use{{FeatureName}}.ts
          ├── services/
          │   └── {{featureName}}Service.ts
          ├── types/
          │   └── {{featureName}}.types.ts
          └── index.ts
      
      backend_structure: |
        /api/features/{{feature_name}}/
          ├── routes/
          │   └── {{featureName}}.routes.js
          ├── controllers/
          │   └── {{featureName}}.controller.js
          ├── services/
          │   └── {{featureName}}.service.js
          ├── models/
          │   └── {{featureName}}.model.js
          ├── validators/
          │   └── {{featureName}}.validator.js
          └── tests/
              └── {{featureName}}.test.js

  track_progress:
    description: "Monitor feature development progress"
    tracking:
      status_updates:
        - Check task completion
        - Monitor blockers
        - Update estimates
        - Report progress
      
      metrics:
        - Tasks completed
        - Code coverage
        - Tests passing
        - Documentation status
      
      notifications:
        - Daily progress summary
        - Blocker alerts
        - Deadline reminders
        - Review requests

  coordinate_agents:
    description: "Orchestrate other agents for feature development"
    agent_coordination:
      planning_phase:
        - documentation_agent: "Create feature spec"
        - architecture_agent: "Review design"
      
      implementation_phase:
        - component_generator: "Create UI components"
        - api_creator: "Build endpoints"
        - database_agent: "Update schema"
      
      testing_phase:
        - test_generator: "Create test suites"
        - performance_agent: "Run benchmarks"
      
      deployment_phase:
        - ci_cd_agent: "Run pipeline"
        - monitoring_agent: "Setup alerts"

prompts:
  system: |
    You are a Feature Workflow Coordinator managing end-to-end feature development.
    
    Your responsibilities:
    1. Plan and organize feature implementation
    2. Coordinate between different agents and tasks
    3. Track progress and identify blockers
    4. Ensure quality standards are met
    5. Manage the deployment process
    
    Current workflow context:
    - Project type: {{project_type}}
    - Team size: {{team_size}}
    - Sprint duration: {{sprint_duration}}
    - Quality gates: {{quality_requirements}}
    
  feature_planning: |
    Plan the implementation of feature: "{{feature_name}}"
    
    Consider:
    - Current codebase structure
    - Existing patterns and conventions
    - Dependencies and integrations
    - Performance requirements
    - Security considerations
    
    Create a comprehensive plan including:
    - Technical approach
    - Task breakdown
    - Time estimates
    - Risk assessment
    - Success criteria

automation:
  git_hooks:
    pre_commit:
      - Format code
      - Run linters
      - Check types
    
    post_checkout:
      - Install dependencies
      - Run migrations
      - Update environment
  
  ci_cd_triggers:
    on_push:
      - Run tests
      - Check coverage
      - Build artifacts
    
    on_pr:
      - Full test suite
      - Security scan
      - Performance check
      - Documentation check
  
  notifications:
    slack:
      - Progress updates
      - Blocker alerts
      - Review requests
      - Deployment status
    
    email:
      - Daily summaries
      - Weekly reports

examples:
  start_new_feature:
    command: "/feature start user-notifications --type=full-stack --priority=high"
    output: |
      🚀 Starting new feature: user-notifications
      
      ✓ Created branch: feature/user-notifications
      ✓ Generated feature plan: docs/features/user-notifications.md
      ✓ Created task breakdown (12 tasks)
      ✓ Set up project board
      ✓ Generated boilerplate structure
      
      Next steps:
      1. Review feature plan
      2. Run: /feature implement user-notifications
      
      Estimated completion: 5 days
  
  implement_feature:
    command: "/feature implement user-notifications"
    output: |
      📝 Implementing user-notifications
      
      Frontend tasks:
      ✓ Created NotificationCenter component
      ✓ Added notification hooks
      ✓ Integrated with Redux store
      
      Backend tasks:
      ✓ Created notification endpoints
      ✓ Added WebSocket support
      ✓ Set up notification queue
      
      Database tasks:
      ✓ Created notifications table
      ✓ Added user preferences
      
      Tests created: 24
      Coverage: 87%
      
      Run: /feature test user-notifications
  
  complete_feature:
    command: "/feature complete user-notifications"
    output: |
      ✅ Completing user-notifications
      
      Checklist:
      ✓ All tests passing (24/24)
      ✓ Code coverage: 87% (exceeds minimum 80%)
      ✓ Documentation updated
      ✓ Changelog updated
      ✓ No security vulnerabilities
      ✓ Performance benchmarks passed
      
      Creating pull request...
      ✓ PR #234 created: "Feature: User Notifications"
      ✓ Reviewers assigned: @john, @sarah
      ✓ CI/CD pipeline triggered
      
      Feature ready for review!

interactions:
  orchestrates:
    - component_generator_agent
    - api_endpoint_agent
    - test_automation_agent
    - documentation_agent
    - deployment_agent
  
  reports_to:
    - project_manager_agent
    - tech_lead_agent
  
  triggers:
    - "/feature start"
    - "/feature implement"
    - "/feature test"
    - "/feature complete"

validation:
  quality_gates:
    code_quality:
      - Linting passes
      - Type checking passes
      - No security vulnerabilities
    
    test_coverage:
      - Minimum 80% coverage
      - All critical paths tested
      - E2E tests for user flows
    
    documentation:
      - API docs updated
      - User guide updated
      - Code comments present
    
    performance:
      - Load time < 3s
      - API response < 200ms
      - Memory usage stable

phase_integration:
  phase_1_planning:
    - Feature specifications
    - Architecture decisions
    - Risk assessment
  
  phase_3_core_logic:
    - Business logic implementation
    - Data models
    - Service layer
  
  phase_4_interface:
    - UI components
    - API endpoints
    - User interactions
  
  phase_6_testing:
    - Test suites
    - Test data
    - Test reports
  
  phase_7_deployment:
    - Deployment scripts
    - Environment configs
    - Monitoring setup