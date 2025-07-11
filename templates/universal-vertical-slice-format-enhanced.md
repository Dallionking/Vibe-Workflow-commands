# Enhanced Universal Vertical Slice Phase Documentation Format Template

## Overview
This enhanced template integrates UltraThink planning automation and pre-commit validation agents into the Universal Format vertical slice phases. Each phase includes comprehensive AI-powered planning before implementation and rigorous validation before Git commits, ensuring the highest quality development cycle.

## Key Enhancements
1. **UltraThink Planning Integration** - Automatic comprehensive analysis before each subtask
2. **Pre-Commit Validation Agent** - Automatic quality assurance before Git operations
3. **Planning Mode Automation** - User reviews and approves plans before execution
4. **Zero Copy/Paste Workflow** - All commands are automatically invoked

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

### 3. Automatic Workflow
- Claude reads and automatically invokes UltraThink for planning
- User reviews and approves plans before implementation
- Validation agent automatically checks work before commits
- No manual command execution needed

---

# Enhanced Universal Format Template

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
8. Follow the design system's color tokens, typography, and component patterns for all UI work
9. **NEW**: UltraThink planning is automatically invoked for each major subtask
10. **NEW**: Pre-commit validation agent runs before all Git operations

## Implementation Tasks:

### Tier 1 Task - Infrastructure & Foundation Setup

#### Subtask 1.1: Git Branch Setup & Initial Configuration
- [ ] **FIRST**: Create feature branch for Phase [Phase Number]
  - [ ] Use command: `git checkout main && git pull origin main && git checkout -b feature/phase-[number]-[kebab-case-title]`
  - [ ] Initial commit: `git commit -m "feat(phase-[number]): Initialize Phase [Phase Number] - [Feature Name] branch" --allow-empty`

#### Subtask 1.2: [Foundational Infrastructure Task]
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze [Feature Name] infrastructure setup requirements considering: existing codebase structure, database schema dependencies, API integration points, security considerations, performance requirements, and scalability needs for this specific implementation"`
  - [ ] **UltraThink will automatically:**
    - [ ] Enter comprehensive planning mode
    - [ ] Deploy 4 specialist sub-agents (Architect, Research, Coder, Tester)
    - [ ] Use Context7 MCP for technical documentation research
    - [ ] Use Perplexity MCP for best practices analysis
    - [ ] Generate comprehensive implementation strategy
    - [ ] Present complete plan for user validation
  - [ ] **USER ACTION REQUIRED**: Review UltraThink's comprehensive plan and approve before proceeding
  
- [ ] **EXECUTION PHASE**: Implement Approved UltraThink Plan (Only after user approval)
  - [ ] [Specific infrastructure setup step - following UltraThink Architect recommendations]
  - [ ] [Environment configuration - following UltraThink Coder guidelines]
  - [ ] [Security implementation - following UltraThink Research best practices]
  - [ ] [Testing setup - following UltraThink Tester strategy]
  - [ ] **Browser Testing Infrastructure** (if frontend feature):
    - [ ] Configure browser testing environment: `/vibe-setup-browser-testing`
    - [ ] Create initial visual baselines: `/vibe-test-visual-regression --update-baseline`
    - [ ] Verify accessibility testing setup: `/vibe-test-accessibility --url http://localhost:3000`
    - [ ] Validate performance testing configuration: `/vibe-test-performance --url http://localhost:3000`
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete infrastructure setup per UltraThink plan"`

📎 [Reference to relevant documentation or MCP tool]

#### Subtask 1.3: [Core Foundation Component]
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze [Core Foundation Component] implementation requirements considering: component architecture, integration patterns, data flow design, error handling strategies, and testing approach"`
  - [ ] Review and approve UltraThink's comprehensive plan
  
- [ ] **EXECUTION PHASE**: Implement Approved Plan
  - [ ] [Specific implementation following UltraThink strategy]
  - [ ] [Basic UI component creation with Shadcn/UI]
    - [ ] Use shadcn/ui: "Generate a [Component Name] component using the design system from docs/04-design-system.md with [specific features]. Include proper TypeScript interfaces, accessibility features, and responsive design. Use color tokens: [specific colors], typography scale: [specific fonts], and spacing: [specific spacing] from the established design system."
    - [ ] Reference: Design tokens from `docs/04-design-system.md`
    - [ ] Apply UX patterns from `docs/03-ux-design.md`
    - [ ] Ensure component follows interface states from `docs/05-interface-states.md`
    - [ ] Include proper ARIA labels and keyboard navigation
  - [ ] [Integration points - following UltraThink integration strategy]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Add core foundation component per UltraThink plan"`

📎 [Reference link to documentation or examples]

✅ **Checkpoint**: Ensure all Tier 1 subtasks are complete before proceeding to Tier 2

### Tier 2 Task - Core Feature Implementation

#### Subtask 2.1: [Primary Feature Component]
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze [Primary Feature Component] implementation including: database layer design, API endpoint architecture, service layer patterns, frontend component structure, state management approach, and comprehensive testing strategy"`
  - [ ] **USER ACTION REQUIRED**: Review and approve UltraThink's plan
  
- [ ] **EXECUTION PHASE**: Implement Approved Plan
  - [ ] [Database layer - following UltraThink Architect design]
  - [ ] [API layer - following UltraThink Coder patterns]
  - [ ] [Service layer - following UltraThink best practices]
  - [ ] [Frontend component implementation]
    - [ ] Use shadcn/ui: "Generate a [Specific Component] component for [specific functionality] using the design system from docs/04-design-system.md. Include [specific features], proper form validation, loading states, and error handling. Apply the established color tokens, typography, and spacing patterns."
    - [ ] Reference: Design system from `docs/04-design-system.md`
    - [ ] Apply component patterns from `docs/03-ux-design.md`
    - [ ] Include accessibility features and responsive design
    - [ ] Implement proper state management and data flow
  - [ ] [Testing - following UltraThink Tester recommendations]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Implement primary feature component per UltraThink"`

#### Subtask 2.2: [Secondary Feature Component]
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze [Secondary Feature Component] implementation focusing on: integration with primary component, extended functionality design, performance optimization opportunities, and user experience enhancements"`
  - [ ] Review and approve plan before proceeding
  
- [ ] **EXECUTION PHASE**: Implement Approved Plan
  - [ ] [Additional backend functionality - per UltraThink plan]
  - [ ] [Extended frontend features]
    - [ ] Use shadcn/ui: "Generate a [Secondary Component] component that integrates with [Primary Component]. Include [specific interactions], proper state synchronization, and consistent styling using docs/04-design-system.md design tokens."
    - [ ] Reference: Design system from `docs/04-design-system.md`
    - [ ] Ensure consistent UX patterns from `docs/03-ux-design.md`
    - [ ] Implement proper component communication
  - [ ] [Data validation - following UltraThink validation strategy]
  - [ ] [Integration testing - following UltraThink test patterns]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Add secondary feature component"`

#### Subtask 2.3: [Integration & Data Flow]
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze complete integration and data flow implementation including: end-to-end data flow design, state management patterns, error handling strategies, and performance considerations"`
  - [ ] Review and approve comprehensive integration plan
  
- [ ] **EXECUTION PHASE**: Implement Approved Plan
  - [ ] [Complete end-to-end data flow - per UltraThink architecture]
  - [ ] [API integration - following UltraThink patterns]
  - [ ] [State management - following UltraThink recommendations]
  - [ ] [Error handling - implementing UltraThink strategies]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete integration and data flow"`

✅ **Checkpoint**: Ensure all Tier 2 subtasks are complete before proceeding to Tier 3

### Tier 3 Task - Polish, Optimization, and Quality Assurance

#### Subtask 3.1: UI/UX Polish & Accessibility
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze UI/UX polish requirements including: visual design enhancements, micro-interactions, responsive design optimization, accessibility compliance (WCAG 2.1 AA), and user experience improvements"`
  - [ ] Review and approve polish strategy
  
- [ ] **EXECUTION PHASE**: Implement Approved Polish Strategy
  - [ ] [Visual design enhancements - per UltraThink recommendations]
  - [ ] [Responsive design optimization - following UltraThink patterns]
  - [ ] [Animation improvements - per UltraThink guidelines]
  - [ ] [Accessibility compliance - following UltraThink checklist]
    - [ ] Screen reader compatibility testing
    - [ ] Keyboard navigation validation
    - [ ] Color contrast verification
    - [ ] Focus management implementation
  - [ ] [Loading states - per UltraThink UX patterns]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete UI/UX polish and accessibility"`

#### Subtask 3.2: Performance Optimization
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze performance optimization opportunities including: bottleneck identification, load time improvements, memory optimization, database query optimization, API response optimization, and bundle size reduction"`
  - [ ] Review and approve optimization strategy
  
- [ ] **EXECUTION PHASE**: Implement Performance Optimizations
  - [ ] [Performance testing - using UltraThink metrics]
  - [ ] [Load time optimization - per UltraThink recommendations]
  - [ ] [Memory optimization - following UltraThink patterns]
  - [ ] [Database optimization - per UltraThink analysis]
  - [ ] [API optimization - following UltraThink guidelines]
  - [ ] [Bundle optimization - per UltraThink strategy]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete performance optimization"`

#### Subtask 3.3: Comprehensive Testing
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Design comprehensive testing strategy including: unit test patterns for 95%+ coverage, integration test scenarios, end-to-end test flows, cross-browser compatibility approach, and edge case identification"`
  - [ ] Review and approve testing strategy
  
- [ ] **EXECUTION PHASE**: Implement Comprehensive Testing
  - [ ] [Unit tests - following UltraThink patterns for 95%+ coverage]
  - [ ] [Integration tests - per UltraThink test scenarios]
  - [ ] [End-to-end tests - following UltraThink user flows]
  - [ ] [Cross-browser testing - per UltraThink compatibility matrix]
  - [ ] [Mobile testing - following UltraThink responsive patterns]
  - [ ] [API validation - per UltraThink test cases]
  - [ ] [Edge case testing - following UltraThink analysis]
  - [ ] **Browser Testing Suite** (following UltraThink strategy):
    - [ ] **Cross-Browser Compatibility**: `/vibe-test-browsers --browser all --mobile`
      - [ ] Chrome, Firefox, Safari, Edge validation
      - [ ] Mobile device compatibility testing
      - [ ] Responsive design verification
    - [ ] **Accessibility Compliance**: `/vibe-test-accessibility --url http://localhost:3000`
      - [ ] WCAG 2.1 AA compliance validation
      - [ ] Screen reader compatibility testing
      - [ ] Keyboard navigation validation
      - [ ] Color contrast verification
    - [ ] **Performance Validation**: `/vibe-test-performance --device mobile --throttling fast-3g`
      - [ ] Lighthouse performance audit (target: 75+ score)
      - [ ] Core Web Vitals validation (LCP < 2.5s, FID < 100ms, CLS < 0.1)
      - [ ] Performance budget compliance
      - [ ] Mobile performance optimization
    - [ ] **Visual Regression Testing**: `/vibe-test-visual-regression`
      - [ ] Screenshot comparison against baselines
      - [ ] Cross-browser visual consistency
      - [ ] Component visual integrity validation
      - [ ] Theme consistency verification
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete comprehensive testing with browser validation"`

#### Subtask 3.4: Pre-Commit Validation & Quality Assurance
- [ ] **CRITICAL**: Invoke validation agent before final Git operations
  - [ ] `/vibe-validate-work --phase="[Phase Number]" --feature="[Feature Name]" --comprehensive`
  - [ ] **Validation agent will automatically:**
    - [ ] Perform comprehensive code quality review
    - [ ] Check for bugs and potential issues
    - [ ] Verify test coverage meets 95%+ requirement
    - [ ] Validate documentation completeness
    - [ ] Test all integration points
    - [ ] Verify performance benchmarks
    - [ ] Scan for security vulnerabilities
    - [ ] Check accessibility compliance
  - [ ] **If validation finds issues**: 
    - [ ] Review detailed validation report
    - [ ] Fix all identified problems
    - [ ] Re-run validation: `/vibe-validate-work --recheck`
    - [ ] Only proceed when validation passes
  - [ ] **USER ACTION REQUIRED**: Review validation report and confirm all issues resolved

#### Subtask 3.5: Documentation & Final Phase Commit
- [ ] [API documentation updates]
- [ ] [Component documentation and Storybook stories]
- [ ] [README updates and usage examples]
- [ ] [Inline code documentation]
- [ ] **CRITICAL**: Update project status files for next phase context:
  - [ ] Update `current_status.md` with Phase [Phase Number] completion status
  - [ ] Update `known_issues.md` with any remaining technical debt
  - [ ] Update `changelog.md` with all feature additions and improvements
  - [ ] Update `features.md` with completed features and new planned items
- [ ] **FINAL VALIDATION**: Run validation agent one more time
  - [ ] `/vibe-validate-work --final --pre-merge`
  - [ ] Ensure all validation checks pass
- [ ] Final phase commit and merge to main
  - [ ] `git commit -m "feat(phase-[number]): Complete Phase [Phase Number] - [Feature Name] with comprehensive validation"`
  - [ ] `git checkout main && git merge feature/phase-[number]-[kebab-case-title] && git push origin main && git branch -d feature/phase-[number]-[kebab-case-title]`

✅ **Final Checkpoint**: All tasks complete, validated, and ready for merge

---

## Phase [Phase Number] Completion Summary

✅ **Phase [Phase Number] completed on:** [Date]

### Completed Tasks:
1. **Infrastructure Setup**: [Brief description - implemented per UltraThink plan]
2. **Core Implementation**: [Brief description - following UltraThink architecture]
3. **UI/UX Polish**: [Brief description - per UltraThink UX recommendations]
4. **Performance Optimization**: [Brief description - following UltraThink metrics]
5. **Testing & Validation**: [Brief description - 95%+ coverage achieved]

### UltraThink Planning Sessions:
- Total UltraThink analyses: [Number]
- Key architectural decisions from UltraThink: [List major decisions]
- Performance improvements identified by UltraThink: [List improvements]
- Security enhancements from UltraThink: [List security measures]

### Validation Results:
- Code quality score: [Score from validation agent]
- Test coverage achieved: [Percentage]%
- Performance benchmarks met: [Yes/No with details]
- Security vulnerabilities found and fixed: [Number]
- Accessibility compliance: [WCAG 2.1 AA status]

### Key Deliverables:
- [Specific deliverable 1 with validation status]
- [Specific deliverable 2 with quality metrics]
- [Specific deliverable 3 with performance data]

### Technical Achievements:
- [Technical milestone 1 validated by UltraThink]
- [Technical milestone 2 with test coverage data]
- [Technical milestone 3 with performance metrics]

### Files Created/Modified:
```
backend/
├── models/[Feature].model.ts (95% test coverage)
├── controllers/[feature].controller.ts (98% test coverage)
├── services/[feature].service.ts (96% test coverage)
├── routes/[feature].routes.ts (100% test coverage)
└── tests/[feature].test.ts (comprehensive test suite)

frontend/
├── components/[Feature]/
│   ├── [Feature].tsx (validated for accessibility)
│   ├── [Feature]Form.tsx (form validation tested)
│   └── [Feature].stories.tsx (Storybook documentation)
├── hooks/use[Feature].ts (custom hook with tests)
├── api/[feature]Api.ts (API client with error handling)
└── tests/[Feature].test.tsx (component tests)

database/
└── migrations/[timestamp]_create_[feature]_table.ts (migration tested)
```

### Notes:
- UltraThink identified and resolved [Number] potential issues during planning
- Validation agent caught [Number] issues before commit
- Performance improved by [Percentage]% through UltraThink optimization strategies
- All security vulnerabilities identified by validation agent were resolved
- Next phase dependencies identified by UltraThink: [List dependencies]

---
```

## Enhanced Workflow Benefits

### UltraThink Integration Benefits
1. **Never Working Blind** - Comprehensive analysis before every major task
2. **4-Agent Intelligence** - Architect, Research, Coder, and Tester perspectives
3. **Automatic Planning Mode** - User reviews plans before implementation
4. **MCP-Enhanced Research** - Latest documentation and best practices
5. **Risk Mitigation** - Issues identified before implementation

### Validation Agent Benefits
1. **Zero Broken Commits** - Issues caught before they reach main branch
2. **Consistent Quality** - Every commit meets 95%+ test coverage
3. **Security Assurance** - Vulnerabilities detected and fixed pre-commit
4. **Performance Validation** - Benchmarks verified before merge
5. **Documentation Completeness** - Ensures comprehensive documentation

### Workflow Automation Benefits
1. **No Copy/Paste** - All commands automatically invoked
2. **Strategic User Control** - Review and approve at key points
3. **Consistent Process** - Same quality standards every phase
4. **Reduced Errors** - Automated validation catches issues early
5. **Faster Development** - Less manual work, more building

## Quality Standards Checklist

### Enhanced Universal Format Compliance
- [ ] UltraThink planning integration for all major tasks
- [ ] Pre-commit validation agent before Git operations
- [ ] Automatic command invocation (no copy/paste)
- [ ] User approval gates at strategic points
- [ ] Comprehensive validation before merge

### Planning & Analysis Requirements
- [ ] UltraThink analysis for infrastructure tasks
- [ ] UltraThink planning for implementation tasks
- [ ] UltraThink optimization for performance tasks
- [ ] UltraThink validation for testing strategies
- [ ] User review and approval for all plans

### Validation Requirements
- [ ] Pre-commit validation for all Git checkpoints
- [ ] Final validation before merge to main
- [ ] 95%+ test coverage verification
- [ ] Security vulnerability scanning
- [ ] Performance benchmark validation
- [ ] Accessibility compliance checking

## Common Enhanced Patterns

### UltraThink Planning Pattern
```markdown
- [ ] **PLANNING PHASE**: Automated UltraThink Analysis
  - [ ] `/ultrathink "Analyze [specific task] considering: [key considerations]"`
  - [ ] Review comprehensive plan from 4 specialist agents
  - [ ] Approve plan before proceeding to execution
```

### Validation Agent Pattern
```markdown
- [ ] **VALIDATION**: Pre-commit quality assurance
  - [ ] `/vibe-validate-work --feature="[feature]" --comprehensive`
  - [ ] Review validation report for any issues
  - [ ] Fix all identified problems before proceeding
  - [ ] Re-run validation to ensure all issues resolved
```

### Enhanced Git Checkpoint Pattern
```markdown
- [ ] **Git Checkpoint with Validation**:
  - [ ] `/vibe-validate-work --pre-commit`
  - [ ] Only proceed if validation passes
  - [ ] `git commit -m "feat([feature]): [Description] - validated and tested"`
```

---

**This enhanced template creates a bulletproof development workflow with AI-powered planning and comprehensive validation, ensuring the highest quality code delivery! 🚀**