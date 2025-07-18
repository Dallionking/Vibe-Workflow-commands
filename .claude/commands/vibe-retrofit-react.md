---
description: Modernize React components systematically
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
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
  - component-pattern
  - --to-functional
  - --add-hooks
  - --add-typescript
  - --optimize-renders
  - --modernize-state
  - --add-tests
  - --add-storybook
  - --dry-run
---

# vibe-retrofit-react

Modernize React components systematically

## Usage
`/vibe-retrofit-react <component-pattern> [--to-functional] [--add-hooks] [--add-typescript] [--optimize-renders] [--modernize-state] [--add-tests] [--add-storybook] [--dry-run]`

# React Component Orchestrator Agent
# Auto-generated for React-based codebases

agent:
  name: "react_component_orchestrator"
  version: "1.0.0"
  purpose: "Orchestrate React component creation, modification, and optimization"
  generated_from: "architecture_pattern"
  codebase_type: "react_spa"

metadata:
  description: |
    This agent manages all aspects of React component development,
    from creation to optimization, following detected project patterns.
  capabilities:
    - Component generation (functional, class, hooks)
    - State management integration
    - Performance optimization
    - Test generation
    - Documentation updates

tools_required:
  claude_code:
    - Read      # Read existing components
    - Write     # Create new component files
    - Edit      # Modify components
    - MultiEdit # Update multiple related files
    - Glob      # Find component patterns
    - Grep      # Search for component usage
    - TodoWrite # Track component creation

configuration:
  working_directory: "${PROJECT_ROOT}/src"
  component_locations:
    - "/components"
    - "/pages"
    - "/features/*/components"
  
  detected_patterns:
    component_style: "functional_with_hooks"
    state_management: "redux_toolkit|context_api"
    styling_approach: "styled_components|css_modules|tailwind"
    typescript: true
    testing_library: "react_testing_library"

capabilities:
  create_component:
    description: "Generate new React components following project patterns"
    parameters:
      - name: "component_name"
        type: "string"
        required: true
      - name: "component_type"
        type: "enum"
        values: ["functional", "class", "page", "feature"]
        default: "functional"
      - name: "with_tests"
        type: "boolean"
        default: true
    
    templates:
      functional_component: |
        import React from 'react';
        {{#if has_props}}
        import PropTypes from 'prop-types';
        {{/if}}
        {{#if has_styles}}
        import styles from './{{component_name}}.module.css';
        {{/if}}
        
        const {{component_name}} = ({{#if has_props}}{ {{props}} }{{/if}}) => {
          {{#if has_state}}
          const [state, setState] = useState(initialState);
          {{/if}}
          
          {{#if has_effects}}
          useEffect(() => {
            // Effect logic
          }, []);
          {{/if}}
          
          return (
            <div className={{#if has_styles}}styles.container{{else}}"{{component_name_kebab}}"{{/if}}>
              {/* Component content */}
            </div>
          );
        };
        
        {{#if has_props}}
        {{component_name}}.propTypes = {
          // Define prop types
        };
        {{/if}}
        
        export default {{component_name}};
      
      test_template: |
        import React from 'react';
        import { render, screen } from '@testing-library/react';
        import userEvent from '@testing-library/user-event';
        import {{component_name}} from './{{component_name}}';
        
        describe('{{component_name}}', () => {
          it('renders without crashing', () => {
            render(<{{component_name}} />);
            expect(screen.getByRole('...')).toBeInTheDocument();
          });
          
          {{#each test_cases}}
          it('{{description}}', async () => {
            // Test implementation
          });
          {{/each}}
        });

  modify_component:
    description: "Modify existing React components"
    operations:
      add_state:
        description: "Add state to a component"
        templates:
          - useState_hook
          - useReducer_hook
          - redux_connection
      
      add_lifecycle:
        description: "Add lifecycle methods or hooks"
        templates:
          - useEffect
          - useLayoutEffect
          - useMemo
          - useCallback
      
      optimize_performance:
        description: "Apply performance optimizations"
        techniques:
          - memo_wrapper
          - useMemo_implementation
          - useCallback_implementation
          - lazy_loading
          - code_splitting

  refactor_component:
    description: "Refactor components for better structure"
    strategies:
      extract_subcomponents:
        description: "Break large components into smaller ones"
        process:
          - Identify logical sections
          - Extract as new components
          - Pass props appropriately
          - Update imports
      
      convert_to_hooks:
        description: "Convert class components to functional"
        process:
          - Map state to useState
          - Convert lifecycle to useEffect
          - Update method bindings
          - Test functionality
      
      improve_prop_handling:
        description: "Optimize prop usage"
        techniques:
          - Prop destructuring
          - Default props
          - Prop spreading
          - Type checking

prompts:
  system: |
    You are a React Component Orchestrator agent for a production React application.
    
    Project Context:
    - React version: ${REACT_VERSION}
    - TypeScript: ${USES_TYPESCRIPT}
    - State Management: ${STATE_MANAGEMENT}
    - Styling: ${STYLING_APPROACH}
    - Testing: ${TESTING_FRAMEWORK}
    
    Follow these principles:
    1. Always use functional components with hooks
    2. Follow the project's established patterns
    3. Include proper TypeScript types when applicable
    4. Generate tests for all new components
    5. Use performance optimizations when appropriate
    6. Follow accessibility best practices
    7. Maintain consistent code style
    
  component_generation: |
    Create a new React component named "{{component_name}}" with the following requirements:
    - Type: {{component_type}}
    - Props: {{props_definition}}
    - State needs: {{state_requirements}}
    - Features: {{required_features}}
    
    Ensure the component:
    - Follows project conventions
    - Is properly typed (if using TypeScript)
    - Includes appropriate tests
    - Has proper error handling
    - Is accessible
    
  refactoring: |
    Refactor the component at {{file_path}} to:
    {{refactoring_goals}}
    
    Maintain all existing functionality while improving:
    - Code organization
    - Performance
    - Readability
    - Testability

interactions:
  depends_on:
    - "style_system_agent"  # For consistent styling
    - "state_management_agent"  # For Redux/Context integration
    - "test_automation_agent"  # For test generation
    
  triggers:
    - command: "/component create"
    - file_pattern: "**/*.jsx|**/*.tsx"
    - event: "component_needed"
    
  provides_to:
    - "documentation_agent"  # Component docs
    - "storybook_agent"  # Component stories
    - "type_generation_agent"  # TypeScript types

validation:
  pre_creation:
    - Check component name uniqueness
    - Validate prop types
    - Ensure directory exists
    
  post_creation:
    - Verify component renders
    - Check test coverage
    - Validate TypeScript types
    - Ensure imports work

examples:
  create_simple_component:
    command: "/component create Button"
    result: |
      Created:
      - /src/components/Button/Button.tsx
      - /src/components/Button/Button.test.tsx
      - /src/components/Button/Button.module.css
      - /src/components/Button/index.ts
  
  create_feature_component:
    command: "/component create UserProfile --type=feature --with-redux"
    result: |
      Created:
      - /src/features/UserProfile/UserProfile.tsx
      - /src/features/UserProfile/UserProfile.test.tsx
      - /src/features/UserProfile/UserProfileSlice.ts
      - /src/features/UserProfile/UserProfile.types.ts
      - /src/features/UserProfile/index.ts

phase_awareness:
  default_phase: "phase_4_interface"
  phase_rules:
    - Only create UI components in phase_4
    - Business logic goes to phase_3
    - Styling utilities go to phase_2
    - Tests go to phase_6