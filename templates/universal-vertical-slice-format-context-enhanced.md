# Context-Enhanced Universal Vertical Slice Phase Documentation Format Template

## Overview
This template integrates Context Engineering with the existing UltraThink planning automation and pre-commit validation agents. It adds intelligent context awareness, pattern learning, and adaptive code generation while maintaining the powerful automation features already in place.

## Key Enhancements (Building on Existing Features)
1. **Context Assembly Layer** - Loads project-specific patterns before UltraThink planning
2. **Pattern-Aware PRPs** - UltraThink receives YOUR codebase patterns automatically
3. **Learned Context Integration** - Validation agent checks pattern compliance
4. **Context Memory Updates** - System learns from each phase completion
5. **UI Healer Integration** - Automated UI quality enhancement throughout the workflow

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

### 3. Automatic Workflow (Now Context-Aware)
- Claude loads context from your codebase automatically
- UltraThink receives your patterns for better planning
- Validation agent checks pattern compliance
- Context memory updates after completion

---

# Context-Enhanced Universal Format Template

```markdown
# [Phase Number]. [Feature Name]

## Context Assembly Layer (NEW)
```yaml
context_requirements:
  global_context:
    - Project conventions from CLAUDE.md v2.0
    - Detected patterns: [Auto-detected from your codebase]
    - Team preferences: [Learned from previous phases]
  
  phase_dependencies:
    - Phase X: [Previous phase] (status)
    - Required: [Dependencies from previous phases]
  
  learned_patterns:
    - Component pattern: "[Your detected pattern]"
    - State pattern: "[Your detected pattern]"
    - API pattern: "[Your detected pattern]"
    - Test pattern: "[Your detected pattern]"
```

## Product Requirements Prompt (PRP) - Context Enhanced
```markdown
You are implementing [Feature Name] for [project type].

CONTEXT FROM YOUR CODEBASE (Auto-loaded):
- Authentication pattern: [Detected from your code]
- State management: [Your specific Redux/Context patterns]
- API structure: [Your REST/GraphQL patterns]
- Component patterns: [Your React/Vue/Angular patterns]

PATTERN EXAMPLES FROM YOUR CODE:
- Component example: src/components/[YourComponent].tsx
- API example: src/routes/[YourRoute].ts
- State example: src/store/[YourSlice].ts
- Test example: __tests__/[YourTest].test.ts

VALIDATION REQUIREMENTS:
- Match detected patterns with 95%+ similarity
- Follow your naming conventions exactly
- Use your error handling patterns
- Maintain your file structure
```

## Role & Background
**Senior [Company Tier] Engineer Profile**: 10+ years experience at major tech companies (Google, Facebook, Amazon, Netflix), specializing in [specific technologies and domains relevant to this feature]. Expert in YOUR SPECIFIC STACK: [auto-detected technologies]. Experienced in [your frameworks], [your databases], [your cloud platforms], and [your specific tools] for building scalable applications with 95%+ test coverage.

## Feature Description
[Comprehensive description of the feature being implemented. Should include:
- What the feature does and its core purpose
- How it fits into the overall platform architecture
- Key technical components and system integrations
- Expected user experience and business outcomes
- Dependencies on other features or systems]

⚠️ **CONTEXT-AWARE INSTRUCTIONS:**

**CRITICAL: Before starting any tasks, read these files to understand current project state:**
- `current_status.md` - Current project state and active features
- `known_issues.md` - Existing bugs and technical debt  
- `changelog.md` - All previous changes and updates
- `features.md` - Completed, in-progress, and planned features

**NEW CONTEXT-AWARE FEATURES:**
- ✅ **Pattern Detection Active** - System has analyzed your codebase
- ✅ **Context Loaded** - Your conventions and patterns are loaded
- ✅ **Adaptive Generation** - All code will match YOUR style
- ✅ **Learning Enabled** - System will learn from this phase

1. Check off each subtask with [x] as you complete it
2. Do not proceed to the next task until ALL checkboxes in the current task are marked complete
3. For UI components: Create detailed prompts for user to generate components via Shadcn/UI MCP
4. Reference `docs/04-design-system.md` for all UI styling and design tokens
5. Reference `docs/03-ux-design.md` for UX patterns and user flows
6. Use Context7 MCP to fetch up-to-date documentation before starting each subtask
7. Use Perplexity MCP for any research needs or best practices
8. Follow the design system's color tokens, typography, and component patterns for all UI work
9. **ENHANCED**: UltraThink now receives your codebase patterns automatically
10. **ENHANCED**: Validation agent checks pattern compliance (95%+ similarity required)

## Implementation Tasks:

### Tier 1 Task - Infrastructure & Foundation Setup

#### Subtask 1.1: Git Branch Setup & Initial Configuration
- [ ] **FIRST**: Create feature branch for Phase [Phase Number]
  - [ ] Use command: `git checkout main && git pull origin main && git checkout -b feature/phase-[number]-[kebab-case-title]`
  - [ ] Initial commit: `git commit -m "feat(phase-[number]): Initialize Phase [Phase Number] - [Feature Name] branch" --allow-empty`

#### Subtask 1.2: [Foundational Infrastructure Task]
- [ ] **CONTEXT LOADING**: System automatically loads relevant patterns
  ```yaml
  Detected Patterns for this task:
  - Database: [Your schema patterns]
  - API: [Your endpoint patterns]
  - Services: [Your service patterns]
  - Tests: [Your test patterns]
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze [Feature Name] infrastructure setup requirements considering: existing codebase structure, database schema dependencies, API integration points, security considerations, performance requirements, and scalability needs. USE THESE DETECTED PATTERNS: [auto-loaded patterns from your codebase]"`
  - [ ] **UltraThink will automatically:**
    - [ ] Enter comprehensive planning mode
    - [ ] Deploy 4 specialist sub-agents (Architect, Research, Coder, Tester)
    - [ ] **NEW**: Receive your codebase patterns and examples
    - [ ] Use Context7 MCP for technical documentation research
    - [ ] Use Perplexity MCP for best practices analysis
    - [ ] Generate plan that matches YOUR patterns
    - [ ] Present complete plan for user validation
  - [ ] **USER ACTION REQUIRED**: Review UltraThink's comprehensive plan and approve before proceeding
  
- [ ] **EXECUTION PHASE**: Implement Approved UltraThink Plan (Pattern-Aware)
  - [ ] [Specific infrastructure setup step - following YOUR patterns]
  - [ ] [Environment configuration - matching YOUR config style]
  - [ ] [Security implementation - using YOUR security patterns]
  - [ ] [Testing setup - following YOUR test structure]
  - [ ] **Browser Testing Infrastructure** (if frontend feature):
    - [ ] Configure browser testing environment: `/vibe-setup-browser-testing`
    - [ ] Create initial visual baselines: `/vibe-test-visual-regression --update-baseline`
    - [ ] Verify accessibility testing setup: `/vibe-test-accessibility --url http://localhost:3000`
    - [ ] Validate performance testing configuration: `/vibe-test-performance --url http://localhost:3000`
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete infrastructure setup per UltraThink plan"`

📎 [Reference to YOUR codebase examples and patterns]

#### Subtask 1.3: [Core Foundation Component]
- [ ] **PATTERN EXAMPLES LOADED**:
  ```typescript
  // System detected your pattern from: src/[similar-component]
  // Will generate matching: [pattern description]
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze [Core Foundation Component] implementation requirements. MUST MATCH THESE PATTERNS: [your component patterns], [your state patterns], [your API patterns]. Reference these files: [specific files from your codebase]"`
  - [ ] Review and approve UltraThink's pattern-aware plan
  
- [ ] **EXECUTION PHASE**: Implement with Pattern Matching
  - [ ] [Specific implementation following YOUR patterns]
  - [ ] [Basic UI component creation with Shadcn/UI]
    - [ ] Use shadcn/ui: "Generate a [Component Name] component MATCHING the pattern in src/components/[YourExistingComponent]. Use the same structure, naming conventions, and patterns. Include [specific features] following the style in [your component]."
    - [ ] Reference: Your patterns from existing components
    - [ ] Apply YOUR UX patterns
    - [ ] Ensure component follows YOUR conventions
    - [ ] **Initial UI Validation**: `/vibe-ui-healer --components="[Component Name]" --mode=analyze`
      - [ ] Check initial quality score
      - [ ] Identify any immediate issues
      - [ ] Apply auto-fixes if score < 7
  - [ ] [Integration points - following YOUR integration patterns]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Add core foundation component matching project patterns"`

📎 Pattern similarity target: 95%+ match with existing code

✅ **Checkpoint**: Ensure all Tier 1 subtasks complete and pattern-compliant

### Tier 2 Task - Core Feature Implementation

#### Subtask 2.1: [Primary Feature Component]
- [ ] **CONTEXT FOR THIS COMPONENT**:
  ```yaml
  Matching patterns from:
  - Frontend: src/features/[similar-feature]
  - Backend: src/api/[similar-endpoint]
  - Database: src/models/[similar-model]
  - Tests: __tests__/[similar-tests]
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze [Primary Feature Component] implementation. CRITICAL: Must match these exact patterns from our codebase: [list of specific patterns]. Generate code that looks like it was written by our team, matching files: [specific example files]"`
  - [ ] **USER ACTION REQUIRED**: Review pattern-aware plan
  
- [ ] **EXECUTION PHASE**: Pattern-Matched Implementation
  - [ ] [Database layer - matching YOUR schema patterns]
  - [ ] [API layer - following YOUR endpoint patterns]
  - [ ] [Service layer - using YOUR service patterns]
  - [ ] [Frontend component implementation]
    - [ ] Use shadcn/ui: "Generate [Component] EXACTLY like our [ExistingComponent] pattern. Match the hooks usage, state management, error handling, and styling from [your files]."
    - [ ] Ensure 95%+ pattern similarity
    - [ ] Use YOUR naming conventions
    - [ ] Follow YOUR file structure
  - [ ] **Quick UI Quality Check**: `/vibe-ui-healer --components="[Component]" --threshold=7 --quick`
    - [ ] Verify component meets minimum UI quality standards
    - [ ] Check accessibility basics (labels, contrast)
    - [ ] Validate responsive behavior
    - [ ] Apply quick fixes if needed
  - [ ] [Testing - matching YOUR test patterns exactly]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Implement primary feature matching codebase patterns"`

#### Subtask 2.2: [Secondary Feature Component]
[Similar pattern-aware structure as 2.1]

#### Subtask 2.3: [Integration & Data Flow]
[Similar pattern-aware structure as 2.1]

✅ **Checkpoint**: Pattern compliance verification before Tier 3

### Tier 3 Task - Polish, Optimization, and Quality Assurance

#### Subtask 3.1: UI/UX Polish & Accessibility
- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze UI/UX polish requirements including: micro-interactions matching [your patterns], loading states like [your skeleton patterns], empty states matching [your design system], mobile responsiveness like [your breakpoints], accessibility matching [your ARIA patterns]. Ensure WCAG 2.1 AA compliance."`
  - [ ] Review and approve polish strategy
  
- [ ] **EXECUTION PHASE**: Implement Approved Polish Strategy
  - [ ] Add animations matching your interaction patterns
  - [ ] Implement skeleton loading matching your patterns
  - [ ] Create empty state matching your empty states
  - [ ] Ensure responsive design matching your breakpoints
  - [ ] Add ARIA labels matching your accessibility patterns
  - [ ] Keyboard navigation matching your patterns
  - [ ] Focus management matching your UX patterns
  
- [ ] **UI HEALER PHASE**: Automated UI Quality Enhancement
  - [ ] **Initial UI Quality Check**: `/vibe-ui-healer --pages="[feature-routes]" --threshold=8 --mode=analyze`
    - [ ] Review baseline UI quality score and identified issues
    - [ ] Document current accessibility violations
    - [ ] Note browser compatibility problems
    - [ ] Identify design system compliance gaps
  
  - [ ] **Automated UI Healing**: `/vibe-ui-healer --pages="[feature-routes]" --threshold=8 --heal=true`
    - [ ] **UI Healer will automatically:**
      - [ ] Fix accessibility issues (ARIA labels, color contrast)
      - [ ] Apply design system tokens consistently
      - [ ] Improve responsive behavior
      - [ ] Enhance loading states and animations
      - [ ] Fix cross-browser compatibility issues
      - [ ] Optimize component spacing and alignment
    - [ ] Review healing report showing all improvements
    - [ ] Test UI changes in development environment
    - [ ] Accept or reject individual healing suggestions
  
  - [ ] **Visual Regression Testing**: `/vibe-ui-healer --visual-regression --update-baseline`
    - [ ] Capture visual baselines for all UI states
    - [ ] Document responsive breakpoints
    - [ ] Verify dark/light theme consistency
  
  - [ ] **Final UI Quality Validation**: `/vibe-ui-healer --pages="[feature-routes]" --comprehensive`
    - [ ] Verify UI quality score meets threshold (8+/10)
    - [ ] Confirm all accessibility issues resolved
    - [ ] Validate cross-browser compatibility
    - [ ] Check responsive design at all breakpoints
  
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete UI/UX polish with UI Healer (score: X/10)"`

#### Subtask 3.2: Performance Optimization
[Existing content with pattern awareness]

#### Subtask 3.3: Comprehensive Testing
- [ ] **PATTERN-AWARE TEST GENERATION**:
  ```yaml
  Test patterns detected:
  - Test structure: [Your test organization]
  - Mocking style: [Your mocking patterns]
  - Assertion style: [Your assertion patterns]
  - Coverage requirements: [Your standards]
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Design comprehensive testing strategy that EXACTLY matches our test patterns in [test directories]. Use same describe blocks, same mocking approach, same assertion style as [example test files]"`
  
- [ ] **EXECUTION PHASE**: Pattern-Matched Testing
  - [ ] [Unit tests - matching YOUR patterns exactly]
  - [ ] [Integration tests - following YOUR style]
  - [ ] [End-to-end tests - using YOUR frameworks]
  - [ ] **Pattern Compliance Check**: 95%+ similarity required
  - [ ] [Browser Testing Suite remains the same]
  - [ ] **Git Checkpoint**: `git commit -m "feat([phase-name]): Complete testing with pattern compliance"`

#### Subtask 3.4: Pre-Commit Validation & Quality Assurance (ENHANCED)
- [ ] **CRITICAL**: Two-Phase Validation Process
  
  - [ ] **Phase 1 - Code Validation**: `/vibe-validate-work --phase="[Phase Number]" --feature="[Feature Name]" --comprehensive --pattern-check`
    - [ ] **Validation agent will automatically:**
      - [ ] Perform comprehensive code quality review
      - [ ] **NEW**: Check pattern compliance (95%+ similarity)
      - [ ] **NEW**: Verify naming conventions match
      - [ ] **NEW**: Validate file structure compliance
      - [ ] Check for bugs and potential issues
      - [ ] Verify test coverage meets 95%+ requirement
      - [ ] Validate documentation completeness
      - [ ] Test all integration points
      - [ ] Verify performance benchmarks
      - [ ] Scan for security vulnerabilities
    - [ ] **Pattern Compliance Report**:
      ```yaml
      Pattern Matching Results:
      - Component patterns: X% match
      - API patterns: X% match
      - Test patterns: X% match
      - Overall compliance: X% (must be 95%+)
      ```
    - [ ] Fix any code issues found
    - [ ] Re-run if needed: `/vibe-validate-work --recheck`
  
  - [ ] **Phase 2 - Final UI Validation**: `/vibe-ui-healer --comprehensive --final --threshold=8`
    - [ ] **UI Healer will validate:**
      - [ ] Overall UI quality score (8+/10 required)
      - [ ] Cross-browser compatibility (all target browsers)
      - [ ] Accessibility compliance (WCAG 2.1 AA)
      - [ ] Visual regression tests pass
      - [ ] Design system compliance
      - [ ] Responsive design coverage
      - [ ] Performance metrics (LCP, FID, CLS)
    - [ ] **UI Quality Report**:
      ```yaml
      UI Quality Results:
      - Overall Score: X/10 (minimum 8)
      - Accessibility: WCAG AA ✓
      - Browser Support: Chrome ✓, Firefox ✓, Safari ✓
      - Design System: X% compliance
      - Visual Regression: X tests passing
      ```
    - [ ] Apply final UI improvements if needed
    - [ ] Re-run if score < 8: `/vibe-ui-healer --recheck`
  
  - [ ] **USER ACTION REQUIRED**: Review both validation reports and confirm all standards met

#### Subtask 3.5: Documentation & Final Phase Commit (ENHANCED)
- [ ] [API documentation updates - matching YOUR style]
- [ ] [Component documentation - following YOUR patterns]
- [ ] [README updates - using YOUR format]
- [ ] [Inline code documentation - matching YOUR conventions]
- [ ] **CRITICAL**: Update project status files and context memory:
  - [ ] Update `current_status.md` with Phase [Phase Number] completion status
  - [ ] Update `known_issues.md` with any remaining technical debt
  - [ ] Update `changelog.md` with all feature additions and improvements
  - [ ] Update `features.md` with completed features and new planned items
  - [ ] **NEW**: Update context memory with learned patterns:
    ```json
    {
      "phase_[number]_patterns": {
        "successful_patterns": [],
        "team_preferences": [],
        "avoided_patterns": [],
        "performance_optimizations": []
      }
    }
    ```
- [ ] **FINAL VALIDATION**: Run validation agent one more time
  - [ ] `/vibe-validate-work --final --pre-merge --pattern-check=strict`
  - [ ] Ensure all validation checks pass
  - [ ] Verify pattern compliance is 95%+
- [ ] Final phase commit and merge to main
  - [ ] `git commit -m "feat(phase-[number]): Complete Phase [Phase Number] - [Feature Name] with pattern compliance"`
  - [ ] `git checkout main && git merge feature/phase-[number]-[kebab-case-title] && git push origin main && git branch -d feature/phase-[number]-[kebab-case-title]`

✅ **Final Checkpoint**: All tasks complete, validated, and pattern-compliant

---

## Phase [Phase Number] Completion Summary

✅ **Phase [Phase Number] completed on:** [Date]

### Completed Tasks:
1. **Infrastructure Setup**: [Brief description - pattern-compliant]
2. **Core Implementation**: [Brief description - matches codebase]
3. **UI/UX Polish**: [Brief description - follows conventions]
4. **Performance Optimization**: [Brief description - using your patterns]
5. **Testing & Validation**: [Brief description - 95%+ coverage & pattern match]

### UltraThink Planning Sessions (ENHANCED):
- Total UltraThink analyses: [Number]
- Key architectural decisions from UltraThink: [List major decisions]
- **Pattern compliance achieved**: [Percentage]%
- **Codebase consistency maintained**: ✅

### Validation Results (ENHANCED):
- Code quality score: [Score from validation agent]
- **Pattern compliance score**: [Percentage]% (target: 95%+)
- Test coverage achieved: [Percentage]%
- Performance benchmarks met: [Yes/No with details]
- Security vulnerabilities found and fixed: [Number]
- **UI Quality Score**: [X]/10 (from UI Healer)
- Accessibility compliance: [WCAG 2.1 AA status] ✓
- Browser compatibility: [List of tested browsers] ✓
- Visual regression tests: [X] passing
- Design system compliance: [X]%

### Context Learning Summary (NEW):
```yaml
Patterns Learned:
- New component patterns: [count]
- API patterns reinforced: [count]
- Test patterns improved: [count]
- Team preferences discovered: [list]

Pattern Matching Success:
- Generated code similarity: X%
- Naming convention compliance: X%
- Structure compliance: X%
- Style guide adherence: X%
```

### Key Deliverables:
- [Specific deliverable 1 - pattern-compliant]
- [Specific deliverable 2 - matches existing code]
- [Specific deliverable 3 - follows conventions]

### Technical Achievements:
- [Technical milestone 1 - using your patterns]
- [Technical milestone 2 - maintaining consistency]
- [Technical milestone 3 - pattern validated]

### Files Created/Modified:
```
backend/
├── models/[Feature].model.ts (matches your model patterns)
├── controllers/[feature].controller.ts (matches your controllers)
├── services/[feature].service.ts (matches your services)
├── routes/[feature].routes.ts (matches your routes)
└── tests/[feature].test.ts (matches your tests)

frontend/
├── components/[Feature]/
│   ├── [Feature].tsx (matches your components)
│   ├── [Feature]Form.tsx (matches your forms)
│   └── [Feature].stories.tsx (matches your stories)
├── hooks/use[Feature].ts (matches your hooks)
├── api/[feature]Api.ts (matches your API clients)
└── tests/[Feature].test.tsx (matches your tests)

database/
└── migrations/[timestamp]_create_[feature]_table.ts (matches migrations)
```

### Notes:
- All code matches existing patterns with 95%+ similarity
- UltraThink plans incorporated codebase context successfully
- Validation agent confirmed pattern compliance
- Context memory updated with new learnings
- Ready for next phase with improved pattern knowledge

---
```

## Enhanced Workflow Benefits (Building on Existing)

### Context Engineering Additions:
1. **Pattern Learning** - System learns YOUR specific patterns
2. **Adaptive Generation** - Code matches YOUR style automatically
3. **Pattern Validation** - Ensures 95%+ similarity to existing code
4. **Context Memory** - Improves with each phase
5. **Team Consistency** - All generated code looks native

### Combined with Existing Features:
1. **UltraThink** gets your patterns for better planning
2. **Validation Agent** checks pattern compliance
3. **Automated Workflow** remains unchanged
4. **User Control Points** stay the same
5. **Quality Standards** enhanced with pattern matching

## Pattern Compliance Standards

### New Validation Criteria:
- [ ] Component structure matches existing: 95%+
- [ ] API patterns match existing: 95%+
- [ ] Test patterns match existing: 95%+
- [ ] Naming conventions exact match: 100%
- [ ] File structure compliance: 100%

### Pattern Sources:
- Automatically detected from your codebase
- Learned from previous phases
- Stored in context memory
- Shared across all commands

---

**This enhanced template maintains all existing automation while adding intelligent context awareness for perfect pattern matching! 🚀**