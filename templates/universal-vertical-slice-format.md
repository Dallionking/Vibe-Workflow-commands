# Universal Vertical Slice Phase Documentation Format Template

## Overview
This template provides the exact structure for creating Universal Format vertical slice phases that work effectively with AI agents and follow the Vibe Coding methodology. Each phase represents a complete feature implementation with systematic task breakdown, MCP tool integration, and comprehensive quality assurance.

## Template Usage Instructions

### 1. Copy Template Structure
Copy the entire template below and customize for your specific feature.

### 2. Replace Placeholders
- `[Phase Number]` → Actual phase number (1, 2, 3, etc.)
- `[Feature Name]` → Descriptive feature name
- `[Company Tier]` → FANG, Fortune 500, Startup, etc.
- `[kebab-case-title]` → Feature name in kebab-case
- `[specific technology]` → Relevant technology for the feature
- `[property]`, `{type}`, `{value}` → Actual data fields and types

### 3. Customize for Your Project
- Update role description to match feature requirements
- Modify implementation tasks based on your technology stack
- Adjust MCP tool usage based on available integrations
- Ensure all paths reference your actual project structure

---

# Universal Format Template

```markdown
# [Phase Number]. [Feature Name]

## Role & Background
**Senior [Company Tier] Engineer Profile**: 10+ years experience at major tech companies (Google, Facebook, Amazon, Netflix), specializing in [specific technologies and domains relevant to this feature]. Expert in full-stack development, test-driven development, and systematic implementation of production-ready features. Experienced in [relevant frameworks], [databases], [cloud platforms], and [specific tools] for building scalable applications with 95%+ test coverage.

## Feature Description
[Comprehensive description of the feature being implemented. Should include:
- What the feature does and its core purpose
- How it fits into the overall platform architecture
- Key technical components and system integrations
- Expected user experience and business outcomes
- Dependencies on other features or systems]

⚠️ **IMPORTANT INSTRUCTIONS:**

**CRITICAL: Before starting any tasks, read these files to understand current project state:**
- `current_status.md` - Current project state and active features
- `known_issues.md` - Existing bugs and technical debt  
- `changelog.md` - All previous changes and updates
- `features.md` - Completed, in-progress, and planned features

1. Check off each subtask with [x] as you complete it
2. Do not proceed to the next task until ALL checkboxes in the current task are marked complete
3. For UI components: Create detailed prompts for user to generate components via Shadcn/UI MCP
4. Reference `docs/04-design-system.md` for all UI styling and design tokens
5. Reference `docs/03-ux-design.md` for UX patterns and user flows
6. Use Context7 MCP to fetch up-to-date documentation before starting each subtask
7. Use Perplexity MCP for any research needs or best practices
8. Create TaskMaster tasks for any complex implementation requirements
9. Follow the design system's color tokens, typography, and component patterns for all UI work

## Implementation Tasks:

### Tier 1 Task - Infrastructure & Foundation Setup

#### Subtask 1.1: Git Branch Setup & Initial Configuration
- [ ] **FIRST**: Create feature branch for Phase [Phase Number]
  - [ ] Use command: `git checkout main && git pull origin main && git checkout -b feature/phase-[number]-[kebab-case-title]`
  - [ ] Initial commit: `git commit -m "feat(phase-[number]): Initialize Phase [Phase Number] - [Feature Name] branch" --allow-empty`

#### Subtask 1.2: [Foundational Infrastructure Task]
- [ ] Before starting, use Context7 MCP to fetch latest [relevant technology] documentation
  - [ ] Use command: `mcp1_get-library-docs` with `context7CompatibleLibraryID: "[library-path]"` and topic: "[specific topic]"
- [ ] Use Perplexity MCP to research [relevant domain] best practices
  - [ ] Use command: `mcp3_perplexity_ask` with query: "[specific research question about implementation patterns]"
- [ ] [Specific infrastructure setup step - database schema, API endpoints, etc.]
- [ ] [Environment configuration and dependency setup]
- [ ] [Basic component structure creation]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete infrastructure setup"`

📎 [Reference to relevant documentation or MCP tool]

#### Subtask 1.3: [Core Foundation Component]
- [ ] Before starting, use Context7 MCP to fetch latest [technology] documentation
  - [ ] Use command: `mcp1_get-library-docs` with `context7CompatibleLibraryID: "[library-path]"` and topic: "[topic]"
- [ ] Use Perplexity MCP to research [domain] implementation patterns
  - [ ] Use command: `mcp3_perplexity_ask` with query: "[research question about specific implementation]"
- [ ] [Specific implementation step with clear deliverable]
- [ ] [Basic UI component creation with Shadcn/UI]
  - [ ] Use shadcn/ui: "Generate a [Component Name] component using the design system from docs/04-design-system.md with [specific features]. Include proper TypeScript interfaces, accessibility features, and responsive design. Use color tokens: [specific colors], typography scale: [specific fonts], and spacing: [specific spacing] from the established design system."
  - [ ] Reference: Design tokens from `docs/04-design-system.md`
  - [ ] Apply UX patterns from `docs/03-ux-design.md`
  - [ ] Ensure component follows interface states from `docs/05-interface-states.md`
  - [ ] Include proper ARIA labels and keyboard navigation
- [ ] [Integration points and error handling setup]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Add core foundation component"`

📎 [Reference link to documentation or examples]

✅ **Checkpoint**: Ensure all Tier 1 subtasks are complete before proceeding to Tier 2

### Tier 2 Task - Core Feature Implementation

#### Subtask 2.1: [Primary Feature Component]
- [ ] Before starting, use Context7 MCP to fetch latest documentation for [specific technology]
- [ ] Use Perplexity MCP to research best practices for [specific implementation area]
- [ ] [Database layer implementation - models, migrations, relationships]
- [ ] [API layer implementation - routes, controllers, validation]
- [ ] [Service layer implementation - business logic, data processing]
- [ ] [Frontend component implementation]
  - [ ] Use shadcn/ui: "Generate a [Specific Component] component for [specific functionality] using the design system from docs/04-design-system.md. Include [specific features], proper form validation, loading states, and error handling. Apply the established color tokens, typography, and spacing patterns."
  - [ ] Reference: Design system from `docs/04-design-system.md`
  - [ ] Apply component patterns from `docs/03-ux-design.md`
  - [ ] Include accessibility features and responsive design
  - [ ] Implement proper state management and data flow
- [ ] [Integration with existing systems and APIs]
- [ ] [Basic testing implementation]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Implement primary feature component"`

#### Subtask 2.2: [Secondary Feature Component]
- [ ] Before starting, use Context7 MCP to fetch relevant documentation
- [ ] Use Perplexity MCP for research on implementation patterns
- [ ] [Additional backend functionality implementation]
- [ ] [Extended frontend features]
  - [ ] Use shadcn/ui: "Generate a [Secondary Component] component that integrates with [Primary Component]. Include [specific interactions], proper state synchronization, and consistent styling using docs/04-design-system.md design tokens."
  - [ ] Reference: Design system from `docs/04-design-system.md`
  - [ ] Ensure consistent UX patterns from `docs/03-ux-design.md`
  - [ ] Implement proper component communication
- [ ] [Data validation and error handling]
- [ ] [Integration testing between components]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Add secondary feature component"`

#### Subtask 2.3: [Integration & Data Flow]
- [ ] [Complete end-to-end data flow implementation]
- [ ] [API integration and data synchronization]
- [ ] [State management and component communication]
- [ ] [Form handling and validation]
- [ ] [Error boundary and error handling implementation]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete integration and data flow"`

✅ **Checkpoint**: Ensure all Tier 2 subtasks are complete before proceeding to Tier 3

### Tier 3 Task - Polish, Optimization, and Quality Assurance

#### Subtask 3.1: UI/UX Polish & Accessibility
- [ ] [Visual design enhancements and micro-interactions]
- [ ] [Responsive design optimization for all screen sizes]
- [ ] [Animation and transition improvements]
- [ ] [Accessibility compliance validation (WCAG 2.1 AA)]
  - [ ] Screen reader compatibility testing
  - [ ] Keyboard navigation validation
  - [ ] Color contrast verification
  - [ ] Focus management implementation
- [ ] [Loading states and skeleton screens]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete UI/UX polish and accessibility"`

#### Subtask 3.2: Performance Optimization
- [ ] [Performance testing and bottleneck identification]
- [ ] [Load time optimization and code splitting]
- [ ] [Memory usage optimization and cleanup]
- [ ] [Database query optimization]
- [ ] [API response optimization]
- [ ] [Bundle size optimization]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete performance optimization"`

#### Subtask 3.3: Comprehensive Testing
- [ ] [Unit test implementation (95%+ coverage target)]
- [ ] [Integration test implementation]
- [ ] [End-to-end test implementation]
- [ ] [Cross-browser compatibility testing]
- [ ] [Mobile responsiveness testing]
- [ ] [API integration validation]
- [ ] [Error handling and edge case testing]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete comprehensive testing"`

#### Subtask 3.4: Documentation & Final Validation
- [ ] [API documentation updates]
- [ ] [Component documentation and Storybook stories]
- [ ] [README updates and usage examples]
- [ ] [Inline code documentation]
- [ ] [Final security review and validation]
- [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete documentation and final validation"`

#### Subtask 3.5: Final Phase Commit & Branch Merge
- [ ] Final comprehensive testing and validation
- [ ] Code review and quality assurance sign-off
- [ ] **CRITICAL**: Update project status files for next phase context:
  - [ ] Update `current_status.md` with Phase [Phase Number] completion status and new active features
  - [ ] Update `known_issues.md` with any remaining technical debt or new issues discovered
  - [ ] Update `changelog.md` with all feature additions, changes, and improvements from this phase
  - [ ] Update `features.md` with completed features, updated in-progress items, and new planned features
- [ ] Final phase commit and merge to main
  - [ ] `git commit -m "feat(phase-[number]): Complete Phase [Phase Number] - [Feature Name] with [key accomplishments]"`
  - [ ] `git checkout main && git merge feature/phase-[number]-[kebab-case-title] && git push origin main && git branch -d feature/phase-[number]-[kebab-case-title]`

✅ **Final Checkpoint**: All tasks complete, ready for phase completion

---

## Phase [Phase Number] Completion Summary

✅ **Phase [Phase Number] completed on:** [Date]

### Completed Tasks:
1. **Infrastructure Setup**: [Brief description of foundation work]
2. **Core Implementation**: [Brief description of main functionality]
3. **UI/UX Polish**: [Brief description of interface improvements]
4. **Performance Optimization**: [Brief description of optimizations]
5. **Testing & Documentation**: [Brief description of quality assurance]

### Key Deliverables:
- [Specific deliverable 1 with file paths]
- [Specific deliverable 2 with functionality description]
- [Specific deliverable 3 with integration points]

### Technical Achievements:
- [Technical milestone 1 with metrics]
- [Technical milestone 2 with performance improvements]
- [Technical milestone 3 with quality measurements]

### Files Created/Modified:
```
backend/
├── models/[Feature].model.ts
├── controllers/[feature].controller.ts
├── services/[feature].service.ts
├── routes/[feature].routes.ts
└── tests/[feature].test.ts

frontend/
├── components/[Feature]/
│   ├── [Feature].tsx
│   ├── [Feature]Form.tsx
│   └── [Feature].stories.tsx
├── hooks/use[Feature].ts
├── api/[feature]Api.ts
└── tests/[Feature].test.tsx

database/
└── migrations/[timestamp]_create_[feature]_table.ts
```

### Notes:
- [Any important implementation decisions made]
- [Performance metrics achieved]
- [Known limitations or deferred items for future phases]
- [Dependencies established for next phase]

---
```

## Customization Guidelines

### Role & Background Customization
Tailor the role description to match the specific technical requirements:
```markdown
**Senior [FANG/Fortune 500/Startup] Engineer Profile**: 10+ years experience at [specific companies], specializing in [React/Vue/Angular], [Node.js/Python/Java], [PostgreSQL/MongoDB/MySQL], [AWS/GCP/Azure], and [specific domain expertise like fintech/healthcare/e-commerce]. Expert in [specific patterns and tools relevant to this feature].
```

### Feature Description Customization
Include specific details about the feature:
```markdown
This phase implements [specific feature name] which [specific purpose]. The feature enables users to [specific user actions] and integrates with [specific systems]. Key components include [list major components] and the expected outcome is [specific business value and user experience improvements].
```

### Task Customization Examples

#### For Authentication Features:
```markdown
#### Subtask 1.2: Authentication Infrastructure Setup
- [ ] Before starting, use Context7 MCP to fetch latest authentication best practices
- [ ] Use Perplexity MCP to research JWT implementation patterns
- [ ] Set up authentication middleware and session management
- [ ] Configure password hashing and validation
- [ ] Create user authentication database schema
```

#### For Dashboard Features:
```markdown
#### Subtask 2.1: Dashboard Data Layer Implementation
- [ ] Use shadcn/ui: "Generate a responsive Dashboard Layout component with sidebar navigation, header, and main content area using the design system from docs/04-design-system.md. Include proper responsive breakpoints, navigation state management, and accessibility features."
- [ ] Implement data aggregation services for dashboard metrics
- [ ] Create real-time data update mechanisms
```

#### For E-commerce Features:
```markdown
#### Subtask 2.2: Product Catalog Implementation
- [ ] Use shadcn/ui: "Generate a Product Grid component with filtering, sorting, and pagination using docs/04-design-system.md design tokens. Include product cards with images, pricing, and action buttons."
- [ ] Implement product search and filtering logic
- [ ] Add shopping cart integration points
```

## Quality Standards Checklist

### Universal Format Compliance
- [ ] Mandatory project state file reading included
- [ ] Tiered task structure (Tier 1/2/3) implemented
- [ ] Git branch strategy with checkpoints included
- [ ] MCP tool integration commands specified
- [ ] Quality checkpoints between tiers
- [ ] Project state file updates in final subtask

### Implementation Requirements
- [ ] 95%+ test coverage target specified
- [ ] Accessibility requirements (WCAG 2.1 AA) included
- [ ] Performance optimization tasks included
- [ ] Security considerations addressed
- [ ] Documentation requirements specified

### Design System Integration
- [ ] Shadcn/UI component generation patterns included
- [ ] References to docs/04-design-system.md throughout
- [ ] UX pattern references to docs/03-ux-design.md
- [ ] Consistent styling and component usage

## Common Task Patterns

### Database Implementation Pattern
```markdown
- [ ] Create database models with proper TypeScript interfaces
- [ ] Implement migration files with rollback capability
- [ ] Add proper indexing for performance
- [ ] Include data validation and constraints
- [ ] Set up proper relationships and foreign keys
```

### API Implementation Pattern
```markdown
- [ ] Create RESTful API endpoints with proper HTTP methods
- [ ] Implement request validation and error handling
- [ ] Add authentication and authorization middleware
- [ ] Include proper API documentation
- [ ] Set up rate limiting and security measures
```

### Frontend Implementation Pattern
```markdown
- [ ] Use shadcn/ui: "[Component description with design system integration]"
- [ ] Implement proper state management with hooks or state library
- [ ] Add form validation and error handling
- [ ] Include loading states and user feedback
- [ ] Ensure responsive design and accessibility
```

### Testing Implementation Pattern
```markdown
- [ ] Write unit tests for all business logic (95%+ coverage)
- [ ] Create integration tests for API endpoints
- [ ] Implement component tests with user interaction testing
- [ ] Add end-to-end tests for critical user flows
- [ ] Include performance and accessibility testing
```

---

**This template ensures consistent, high-quality Universal Format phases that integrate seamlessly with the Vibe Coding methodology and provide comprehensive project context awareness! 🎯**