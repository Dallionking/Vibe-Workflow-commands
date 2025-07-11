# Phase 3. Shopping Cart Feature (Context-Enhanced Universal Format)

## Context Assembly Layer (NEW)
```yaml
context_requirements:
  global_context:
    - Project conventions from CLAUDE.md v2.0
    - Detected patterns: React FC + Hooks, Redux Toolkit, Express REST, Jest + RTL
    - Team preferences: TypeScript strict, destructured props, early returns
  
  phase_dependencies:
    - Phase 1: User Authentication (completed)
    - Phase 2: Product Catalog (completed)
    - Required: JWT tokens, product models, user sessions, Redux store
  
  learned_patterns:
    - Component pattern: "Functional components with custom hooks"
    - State pattern: "Redux Toolkit slices with createAsyncThunk"
    - API pattern: "Express routes with middleware chains"
    - Test pattern: "Jest with React Testing Library and store mocking"
```

## Product Requirements Prompt (PRP) - Context Enhanced
```markdown
You are implementing a shopping cart feature for an e-commerce platform.

CONTEXT FROM YOUR CODEBASE (Auto-loaded):
- Authentication pattern: JWT with refresh tokens (src/auth/authSlice.ts)
- State management: Redux Toolkit with typed hooks (src/store/hooks.ts)
- API structure: /api/v1/{resource} with auth middleware (src/middleware/auth.ts)
- Component patterns: FC with custom hooks and error boundaries (src/components/*)

PATTERN EXAMPLES FROM YOUR CODE:
- Component example: src/components/ProductList/ProductList.tsx
- API example: src/routes/products.routes.ts
- State example: src/store/slices/userSlice.ts
- Test example: __tests__/components/ProductList.test.tsx

VALIDATION REQUIREMENTS:
- Match detected patterns with 95%+ similarity
- Follow camelCase for functions, PascalCase for components
- Use established error codes from src/constants/errors.ts
- Maintain folder structure: features/{feature}/* pattern
```

## Role & Background
**Senior FANG Engineer Profile**: 10+ years experience at major tech companies (Google, Facebook, Amazon, Netflix), specializing in e-commerce platforms, React/Redux architectures, and scalable API design. Expert in YOUR SPECIFIC STACK: React 18.2, Redux Toolkit 1.9, Express 4.18, PostgreSQL 14, TypeScript 5.0, Jest 29/React Testing Library. Experienced in building shopping cart systems with real-time inventory, persistent sessions, and high-performance state management.

## Feature Description
Implement a full-featured shopping cart that integrates seamlessly with the existing authentication and product catalog systems. The cart must persist across sessions using Redis, handle real-time inventory updates via WebSocket connections, support guest checkout flows, and maintain state consistency across multiple devices. All implementation must match existing codebase patterns with 95%+ similarity.

⚠️ **CONTEXT-AWARE INSTRUCTIONS:**

**CRITICAL: Before starting any tasks, read these files to understand current project state:**
- `current_status.md` - Current project state and active features
- `known_issues.md` - Existing bugs and technical debt  
- `changelog.md` - All previous changes and updates
- `features.md` - Completed, in-progress, and planned features

**NEW CONTEXT-AWARE FEATURES:**
- ✅ **Pattern Detection Active** - System has analyzed 127 files in your codebase
- ✅ **Context Loaded** - Your conventions from 23 React components, 15 API routes
- ✅ **Adaptive Generation** - All code will match YOUR team's style
- ✅ **Learning Enabled** - System will learn from this phase implementation

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
- [ ] **FIRST**: Create feature branch for Phase 3
  - [ ] Use command: `git checkout main && git pull origin main && git checkout -b feature/phase-3-shopping-cart`
  - [ ] Initial commit: `git commit -m "feat(phase-3): Initialize Phase 3 - Shopping Cart branch" --allow-empty`

#### Subtask 1.2: Cart State Management Infrastructure
- [ ] **CONTEXT LOADING**: System automatically loads relevant patterns
  ```yaml
  Detected Patterns for this task:
  - Redux slices: userSlice.ts (lines 12-89), productSlice.ts (lines 15-102)
  - Async thunks: createAsyncThunk pattern with typed errors
  - Selectors: Memoized with createSelector
  - Types: Separate interfaces in types/ directory
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze shopping cart state management infrastructure considering: Redux Toolkit patterns from userSlice.ts and productSlice.ts, async thunk patterns for API calls, TypeScript interfaces from types/, memoized selectors pattern, and middleware integration. USE THESE DETECTED PATTERNS: slice structure from lines 12-89 of userSlice.ts, async thunk pattern from fetchUserProfile, selector pattern from selectUser"`
  - [ ] **UltraThink will automatically:**
    - [ ] Enter comprehensive planning mode
    - [ ] Deploy 4 specialist sub-agents (Architect, Research, Coder, Tester)
    - [ ] **NEW**: Receive your specific Redux patterns and examples
    - [ ] Use Context7 MCP for Redux Toolkit best practices
    - [ ] Use Perplexity MCP for shopping cart state patterns
    - [ ] Generate plan that matches YOUR slice structure exactly
    - [ ] Present complete plan for user validation
  - [ ] **USER ACTION REQUIRED**: Review UltraThink's comprehensive plan and approve before proceeding
  
- [ ] **EXECUTION PHASE**: Implement Approved UltraThink Plan (Pattern-Aware)
  - [ ] Create cart slice matching your patterns:
    ```typescript
    // Will match pattern from userSlice.ts:
    export const cartSlice = createSlice({
      name: 'cart',
      initialState,
      reducers: {
        // Your exact reducer pattern
      },
      extraReducers: (builder) => {
        // Your exact async thunk pattern
      }
    });
    ```
  - [ ] Implement cart types in `src/types/cart.types.ts` (matching your type patterns)
  - [ ] Create cart selectors matching your memoization pattern
  - [ ] Add cart persistence middleware (following your middleware pattern)
  - [ ] **Browser Testing Infrastructure** (if frontend feature):
    - [ ] Configure browser testing environment: `/vibe-setup-browser-testing`
    - [ ] Create initial visual baselines: `/vibe-test-visual-regression --update-baseline`
    - [ ] Verify accessibility testing setup: `/vibe-test-accessibility --url http://localhost:3000`
    - [ ] Validate performance testing configuration: `/vibe-test-performance --url http://localhost:3000`
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Complete cart state infrastructure matching project patterns"`

📎 Pattern references: src/store/slices/userSlice.ts, src/store/slices/productSlice.ts

#### Subtask 1.3: Cart API Foundation
- [ ] **PATTERN EXAMPLES LOADED**:
  ```typescript
  // System detected your Express pattern from: src/routes/products.routes.ts
  router.get('/', authenticate, validate(getProductsSchema), productsController.getAll);
  router.post('/', authenticate, authorize('admin'), validate(createProductSchema), productsController.create);
  // Will generate matching cart routes with same middleware chain
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze cart API foundation requirements. MUST MATCH THESE PATTERNS: Express route structure from products.routes.ts, controller pattern from products.controller.ts, service layer pattern from products.service.ts, error handling from errorHandler middleware. Reference these exact files for patterns."`
  - [ ] Review and approve UltraThink's pattern-aware plan
  
- [ ] **EXECUTION PHASE**: Implement with Pattern Matching
  - [ ] Create `src/routes/cart.routes.ts` matching your route patterns
  - [ ] Create `src/controllers/cart.controller.ts` matching your controller patterns
  - [ ] Create `src/services/cart.service.ts` matching your service patterns
  - [ ] Implement validation schemas matching your Joi patterns
  - [ ] Add error handling matching your middleware patterns
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Add cart API foundation matching project patterns"`

📎 Pattern similarity target: 95%+ match with existing routes/controllers/services

✅ **Checkpoint**: Ensure all Tier 1 subtasks complete and pattern-compliant before proceeding to Tier 2

### Tier 2 Task - Core Feature Implementation

#### Subtask 2.1: Cart Component Implementation
- [ ] **CONTEXT FOR THIS COMPONENT**:
  ```yaml
  Matching patterns from:
  - Component: src/components/ProductList/ProductList.tsx
  - Hooks: src/hooks/useProducts.ts
  - Styles: src/components/ProductList/ProductList.module.css
  - Tests: __tests__/components/ProductList.test.tsx
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze cart component implementation. CRITICAL: Must match these exact patterns from ProductList.tsx: FC type with props interface, useAppDispatch and useAppSelector hooks, loading/error states with early returns, custom hooks for business logic, CSS modules for styling. Generate CartList and CartItem components that look identical in structure to ProductList and ProductItem."`
  - [ ] **USER ACTION REQUIRED**: Review pattern-aware plan
  
- [ ] **EXECUTION PHASE**: Pattern-Matched Implementation
  - [ ] Create `src/components/Cart/CartList.tsx` matching ProductList structure:
    ```typescript
    // Matching your component pattern exactly:
    const CartList: FC<CartListProps> = ({ className }) => {
      const dispatch = useAppDispatch();
      const { items, loading, error } = useAppSelector(selectCart);
      const { processedItems } = useCartProcessing(items);
      
      if (loading) return <LoadingSpinner />;
      if (error) return <ErrorMessage error={error} />;
      
      return (
        // Your exact JSX structure pattern
      );
    };
    ```
  - [ ] Create `src/components/Cart/CartItem.tsx` matching your item pattern
  - [ ] Create `src/hooks/useCart.ts` matching your hook patterns
  - [ ] Implement Shadcn/UI components:
    - [ ] Use shadcn/ui: "Generate a CartList component EXACTLY like ProductList.tsx in structure. Use the same loading states, error handling, and component composition. Apply design tokens from docs/04-design-system.md: primary-500 for actions, neutral-100 for backgrounds, spacing-4 for gaps."
    - [ ] Ensure 95%+ pattern similarity with ProductList
    - [ ] Use YOUR exact prop patterns and types
    - [ ] Follow YOUR component organization
  - [ ] Add CSS modules matching your styling patterns
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Implement cart components matching ProductList patterns"`

#### Subtask 2.2: Cart Functionality Integration
- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze cart functionality integration including: add to cart flow matching product selection pattern, quantity updates like inventory management, remove items following delete patterns, cart persistence using Redis like session storage. Reference existing integration patterns in checkout flow and user preferences."`
  - [ ] Review and approve plan before proceeding
  
- [ ] **EXECUTION PHASE**: Implement with Pattern Matching
  - [ ] Implement add to cart matching your action patterns
  - [ ] Create quantity update logic matching your update patterns
  - [ ] Add remove from cart matching your delete patterns
  - [ ] Implement cart calculations matching your business logic patterns
  - [ ] Add real-time inventory checks matching your WebSocket patterns
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Complete cart functionality matching existing patterns"`

#### Subtask 2.3: Cart Data Flow Integration
- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze complete cart data flow including: Redux state updates matching your dispatch patterns, API integration matching your service calls, optimistic updates like your UI patterns, error recovery matching your error boundaries, cache invalidation like your data refresh patterns."`
  - [ ] Review and approve comprehensive integration plan
  
- [ ] **EXECUTION PHASE**: Implement Approved Plan
  - [ ] Connect cart state to API matching your data flow
  - [ ] Implement optimistic updates matching your UI patterns
  - [ ] Add error handling matching your error boundaries
  - [ ] Create cart persistence matching your storage patterns
  - [ ] Integrate with user sessions matching your auth flow
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Complete cart data flow integration"`

✅ **Checkpoint**: Ensure all Tier 2 subtasks complete and pattern-compliant before proceeding to Tier 3

### Tier 3 Task - Polish, Optimization, and Quality Assurance

#### Subtask 3.1: UI/UX Polish & Accessibility
- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze UI/UX polish for cart feature including: micro-interactions matching ProductList animations, loading states like your skeleton patterns, empty states matching your design system, mobile responsiveness like your breakpoints, accessibility matching your ARIA patterns. Ensure WCAG 2.1 AA compliance."`
  - [ ] Review and approve polish strategy
  
- [ ] **EXECUTION PHASE**: Implement Approved Polish Strategy
  - [ ] Add animations matching your interaction patterns
  - [ ] Implement skeleton loading matching your patterns
  - [ ] Create empty cart state matching your empty states
  - [ ] Ensure responsive design matching your breakpoints
  - [ ] Add ARIA labels matching your accessibility patterns
  - [ ] Keyboard navigation matching your patterns
  - [ ] Focus management matching your UX patterns
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Complete UI/UX polish and accessibility"`

#### Subtask 3.2: Performance Optimization
- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Analyze cart performance optimization including: memoization matching your React.memo patterns, Redux selector optimization like your createSelector usage, API call batching like your request patterns, bundle size optimization matching your code splitting, render optimization like your virtualization patterns."`
  - [ ] Review and approve optimization strategy
  
- [ ] **EXECUTION PHASE**: Implement Performance Optimizations
  - [ ] Add React.memo matching your memoization patterns
  - [ ] Optimize selectors matching your selector patterns
  - [ ] Implement request batching matching your API patterns
  - [ ] Add code splitting matching your lazy loading
  - [ ] Optimize re-renders matching your patterns
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Complete performance optimization"`

#### Subtask 3.3: Comprehensive Testing
- [ ] **PATTERN-AWARE TEST GENERATION**:
  ```yaml
  Test patterns detected:
  - Test structure: describe blocks with nested contexts
  - Mocking: jest.mock for modules, mockStore for Redux
  - Assertions: Testing Library queries and Jest matchers
  - Coverage: Minimum 95% with edge cases
  ```

- [ ] **PLANNING PHASE**: Context-Enhanced UltraThink Analysis
  - [ ] `/ultrathink "Design comprehensive testing strategy that EXACTLY matches test patterns in __tests__/components/ProductList.test.tsx and __tests__/api/products.test.ts. Use same describe structure, same mocking approach with mockStore, same assertion patterns with Testing Library, same coverage standards."`
  - [ ] Review and approve testing strategy
  
- [ ] **EXECUTION PHASE**: Pattern-Matched Testing
  - [ ] Create cart component tests matching your component test patterns:
    ```typescript
    // Matching your test pattern exactly:
    describe('CartList', () => {
      let store: MockStore;
      
      beforeEach(() => {
        store = mockStore({
          cart: mockCartState
        });
      });
      
      it('should render loading state', () => {
        // Your exact test pattern
      });
    });
    ```
  - [ ] Create API tests matching your API test patterns
  - [ ] Add integration tests matching your patterns
  - [ ] Create E2E tests matching your Cypress patterns
  - [ ] **Pattern Compliance Check**: Verify 95%+ test similarity
  - [ ] **Browser Testing Suite**:
    - [ ] **Cross-Browser Compatibility**: `/vibe-test-browsers --browser all --mobile`
      - [ ] Chrome, Firefox, Safari, Edge validation
      - [ ] Mobile device compatibility testing
      - [ ] Responsive design verification
    - [ ] **Accessibility Compliance**: `/vibe-test-accessibility --url http://localhost:3000/cart`
      - [ ] WCAG 2.1 AA compliance validation
      - [ ] Screen reader compatibility testing
      - [ ] Keyboard navigation validation
      - [ ] Color contrast verification
    - [ ] **Performance Validation**: `/vibe-test-performance --device mobile --throttling fast-3g`
      - [ ] Lighthouse performance audit (target: 85+ score)
      - [ ] Core Web Vitals validation (LCP < 2.5s, FID < 100ms, CLS < 0.1)
      - [ ] Cart-specific performance metrics
    - [ ] **Visual Regression Testing**: `/vibe-test-visual-regression`
      - [ ] Cart component visual consistency
      - [ ] Cross-browser visual validation
      - [ ] Theme consistency verification
  - [ ] **Git Checkpoint**: `git commit -m "feat(cart): Complete comprehensive testing with pattern compliance"`

#### Subtask 3.4: Pre-Commit Validation & Quality Assurance (ENHANCED)
- [ ] **CRITICAL**: Invoke context-aware validation agent
  - [ ] `/vibe-validate-work --phase="3" --feature="Shopping Cart" --comprehensive --pattern-check`
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
    - [ ] Check accessibility compliance
  - [ ] **Pattern Compliance Report**:
    ```yaml
    Pattern Matching Results:
    - Component patterns: 97% match
    - API patterns: 96% match
    - Test patterns: 98% match
    - Redux patterns: 97% match
    - Overall compliance: 97% (exceeds 95% requirement)
    
    Naming Convention Check:
    - Components: ✅ PascalCase
    - Functions: ✅ camelCase
    - Files: ✅ Match existing
    - Constants: ✅ UPPER_SNAKE_CASE
    ```
  - [ ] **If validation finds issues**: 
    - [ ] Review detailed validation report
    - [ ] Fix pattern compliance issues first
    - [ ] Fix all other identified problems
    - [ ] Re-run validation: `/vibe-validate-work --recheck`
  - [ ] **USER ACTION REQUIRED**: Review validation report and confirm pattern compliance

#### Subtask 3.5: Documentation & Final Phase Commit (ENHANCED)
- [ ] Update API documentation matching your OpenAPI patterns
- [ ] Create component documentation matching your Storybook patterns
- [ ] Update README with cart feature matching your format
- [ ] Add inline JSDoc comments matching your documentation style
- [ ] **CRITICAL**: Update project status files and context memory:
  - [ ] Update `current_status.md` with Phase 3 completion status
  - [ ] Update `known_issues.md` (no new technical debt added)
  - [ ] Update `changelog.md` with cart feature additions
  - [ ] Update `features.md` with completed cart functionality
  - [ ] **NEW**: Update context memory with learned patterns:
    ```json
    {
      "phase_3_patterns": {
        "successful_patterns": [
          "Cart state matches Redux patterns exactly",
          "API routes follow established middleware chains",
          "Components mirror ProductList structure",
          "Tests maintain consistent mock patterns"
        ],
        "team_preferences": [
          "Prefers early returns in components",
          "Always uses TypeScript strict mode",
          "Destructures all props",
          "Groups related state in slices"
        ],
        "avoided_patterns": [
          "No direct state mutations",
          "No any types without justification",
          "No inline styles",
          "No synchronous storage access"
        ],
        "performance_optimizations": [
          "Memoized cart calculations",
          "Optimistic UI updates",
          "Batched API requests",
          "Virtualized long cart lists"
        ]
      }
    }
    ```
- [ ] **FINAL VALIDATION**: Run validation agent one more time
  - [ ] `/vibe-validate-work --final --pre-merge --pattern-check=strict`
  - [ ] Ensure all validation checks pass
  - [ ] Verify pattern compliance is 95%+
- [ ] Final phase commit and merge to main
  - [ ] `git commit -m "feat(phase-3): Complete Phase 3 - Shopping Cart with 97% pattern compliance"`
  - [ ] `git checkout main && git merge feature/phase-3-shopping-cart && git push origin main && git branch -d feature/phase-3-shopping-cart`

✅ **Final Checkpoint**: All tasks complete, validated, and pattern-compliant

---

## Phase 3 Completion Summary

✅ **Phase 3 completed on:** December 15, 2023

### Completed Tasks:
1. **Cart State Infrastructure**: Redux slice matching userSlice pattern (97% match)
2. **Cart API**: Express routes matching products routes (96% match)
3. **Cart Components**: React components matching ProductList (98% match)
4. **Cart Integration**: Data flow matching existing patterns (97% match)
5. **Testing & Validation**: 96.5% coverage with pattern-compliant tests

### UltraThink Planning Sessions (ENHANCED):
- Total UltraThink analyses: 8
- Key architectural decisions from UltraThink:
  - Use existing Redux patterns for consistency
  - Mirror ProductList component structure
  - Follow established API middleware chains
  - Maintain test mock patterns
- **Pattern compliance achieved**: 97% average
- **Codebase consistency maintained**: ✅

### Validation Results (ENHANCED):
- Code quality score: A+
- **Pattern compliance score**: 97% (exceeds 95% target)
- Test coverage achieved: 96.5%
- Performance benchmarks met: All green
- Security vulnerabilities found and fixed: 0
- Accessibility compliance: WCAG 2.1 AA ✅

### Context Learning Summary (NEW):
```yaml
Patterns Learned:
- New component patterns: 3 (cart-specific variations)
- API patterns reinforced: 5 (middleware chains confirmed)
- Test patterns improved: 2 (async cart test helpers)
- Team preferences discovered: 4 (listed above)

Pattern Matching Success:
- Generated code similarity: 97%
- Naming convention compliance: 100%
- Structure compliance: 96%
- Style guide adherence: 98%
```

### Key Deliverables:
- Shopping cart with real-time updates (pattern-compliant)
- Persistent cart across sessions (matches storage patterns)
- Guest checkout support (follows auth patterns)
- Multi-device synchronization (uses WebSocket patterns)

### Technical Achievements:
- Zero new technical debt (validated by agent)
- Performance: 85+ Lighthouse score
- 97% pattern match with existing code
- Seamless integration with Phase 1 & 2

### Files Created/Modified:
```
src/
├── store/
│   └── slices/
│       ├── cartSlice.ts (97% match with userSlice.ts)
│       └── cartSlice.test.ts (98% match with test patterns)
├── types/
│   └── cart.types.ts (100% match with type patterns)
├── routes/
│   ├── cart.routes.ts (96% match with products.routes.ts)
│   └── cart.routes.test.ts (97% match)
├── controllers/
│   ├── cart.controller.ts (96% match with patterns)
│   └── cart.controller.test.ts (97% match)
├── services/
│   ├── cart.service.ts (97% match with patterns)
│   └── cart.service.test.ts (96% match)
├── components/
│   └── Cart/
│       ├── CartList.tsx (98% match with ProductList.tsx)
│       ├── CartItem.tsx (97% match with ProductItem.tsx)
│       ├── CartList.module.css (100% match with CSS patterns)
│       ├── CartList.stories.tsx (96% match with story patterns)
│       └── __tests__/
│           ├── CartList.test.tsx (98% match)
│           └── CartItem.test.tsx (97% match)
└── hooks/
    ├── useCart.ts (97% match with hook patterns)
    └── useCart.test.ts (96% match)
```

### Notes:
- All code reviewed by team required zero style changes
- UltraThink successfully incorporated codebase patterns
- Validation agent confirmed 97% pattern compliance
- Context memory improved pattern matching for next phase
- Team impressed by consistency with existing code
- Ready for Phase 4 with enhanced pattern knowledge

---