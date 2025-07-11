# UI Healing-Integrated Universal Vertical Slice Phase Template

## Overview

This enhanced template integrates UI healing directly into the validation workflow. When UI components are created or modified, the validation agent automatically grades and heals them to ensure they meet design system standards (8/10 minimum score) before moving to the next subtask.

## Key UI Healing Integration Points

1. **After Every UI Subtask** - Automatic UI grading and healing
2. **Inline Validation** - No separate UI testing commands needed
3. **Immediate Feedback** - Issues fixed before moving forward
4. **Design System Compliance** - Enforced automatically

---

# UI Healing-Enhanced Phase Template

```markdown
# [Phase Number]. [Feature Name]

## UI Quality Configuration
```yaml
ui_quality_standards:
  minimum_score: 8.0  # UI must score 8/10 or higher
  auto_healing: true  # Automatic fixes applied
  design_system: docs/04-design-system.md
  interface_states: docs/05-interface-states.md
  categories:
    color_contrast: { weight: 0.2, min: 7 }
    typography: { weight: 0.15, min: 7 }
    spacing: { weight: 0.15, min: 7 }
    interactions: { weight: 0.2, min: 8 }
    consistency: { weight: 0.15, min: 7 }
    accessibility: { weight: 0.15, min: 9 }
```

## Implementation Tasks

### Tier 2 Task - Core Feature Implementation

#### Subtask 2.1: Dashboard Component Implementation

##### Development Tasks
- [ ] **PLANNING PHASE**: UltraThink Analysis
  - [ ] `/ultrathink "Design dashboard component with data visualization, responsive grid, and real-time updates. Consider accessibility, performance, and design system compliance."`
  - [ ] Review and approve UltraThink's plan

- [ ] **EXECUTION PHASE**: Component Development
  - [ ] Create dashboard layout component
    ```tsx
    // Following your component patterns from src/components/[similar]
    ```
  - [ ] Implement data visualization components
    - [ ] Use shadcn/ui: "Generate a DataChart component with line, bar, and pie chart options. Follow our design system colors and spacing."
    - [ ] Reference design tokens from `docs/04-design-system.md`
  - [ ] Add responsive grid system
  - [ ] Connect to state management
  - [ ] Implement loading states from `docs/05-interface-states.md`
  - [ ] Add error states and empty states

##### 🏥 Integrated UI Quality Validation
- [ ] **Run validation with automatic UI healing**:
  ```bash
  /vibe-validate-work --phase="[Phase Number]" --comprehensive
  ```
  
  **The validation agent will automatically:**
  1. ✅ Perform standard code quality checks
  2. 🎨 **Detect UI changes in dashboard components**
  3. 📊 **Grade UI quality against design system** (NEW)
  4. 🔧 **Apply automatic fixes if score < 8/10** (NEW)
  5. 📸 Take screenshots for visual record
  6. ♿ Verify accessibility compliance
  7. ⚡ Check performance metrics

- [ ] **Review UI Quality Report** (auto-generated):
  ```yaml
  UI Quality Assessment - Dashboard Component:
    Overall Score: 8.3/10 ✅
    
    Initial Score: 6.5/10
    Healing Applied: Yes
    
    Improvements Made:
    - Fixed 3 color contrast issues (6.2 → 7.5)
    - Aligned 5 spacing values to 8px grid (6.8 → 8.0)
    - Added missing hover states to buttons (7.0 → 8.5)
    - Added focus indicators for keyboard nav (7.5 → 8.8)
    - Fixed touch target sizes on mobile (8.0 → 8.3)
    
    Breakdown:
    - Color Contrast: 8.5/10 ✅
    - Typography: 8.0/10 ✅
    - Spacing: 8.2/10 ✅
    - Interactions: 8.5/10 ✅
    - Consistency: 8.0/10 ✅
    - Accessibility: 9.0/10 ✅
    
    Files Modified:
    - components/Dashboard/Dashboard.tsx (3 fixes)
    - components/Dashboard/DataChart.tsx (2 fixes)
    - styles/dashboard.module.css (4 fixes)
  ```

- [ ] **Verify UI improvements**:
  - [ ] Check that color contrast meets WCAG AA
  - [ ] Confirm spacing follows 8px grid
  - [ ] Test hover and focus states
  - [ ] Validate on mobile devices

- [ ] **Git Checkpoint**: 
  ```bash
  git add -A
  git commit -m "feat(dashboard): Implement dashboard with UI quality score 8.3/10"
  ```

#### Subtask 2.2: User Profile Component

##### Development Tasks
- [ ] Create profile layout following patterns
- [ ] Implement profile form with validation
- [ ] Add avatar upload functionality
- [ ] Create profile view states (view/edit modes)

##### 🏥 Integrated UI Quality Validation
- [ ] **Run validation with UI healing**: `/vibe-validate-work`
  
  **Automatic UI Quality Process**:
  - Detects changes in profile components ✓
  - Grades against design system ✓
  - Applies fixes for issues found ✓
  - Re-grades to ensure 8/10+ ✓

- [ ] **Example Healing Report**:
  ```yaml
  UI Healing Applied:
  - Profile form inputs: Added consistent padding (24px)
  - Avatar component: Fixed border radius to match design system
  - Edit button: Added hover transition (0.2s ease)
  - Form labels: Improved color contrast (#4A5568)
  - Success message: Added icon and proper spacing
  
  Score improved: 7.2 → 8.5/10 ✅
  ```

#### Subtask 2.3: Navigation Component Update

##### Development Tasks
- [ ] Update main navigation with new routes
- [ ] Add mobile responsive menu
- [ ] Implement breadcrumb navigation
- [ ] Add keyboard navigation support

##### 🏥 Integrated UI Quality Validation
- [ ] **Special Note for Navigation**:
  Navigation components have higher interaction requirements.
  The validation agent will automatically:
  - Check keyboard navigation (Tab, Enter, Escape)
  - Verify ARIA attributes for screen readers
  - Test mobile menu animations
  - Ensure focus trap in mobile menu
  - Validate touch targets (min 44x44px)

- [ ] **Run validation**: `/vibe-validate-work`

- [ ] **Navigation-Specific Healing**:
  ```yaml
  Navigation UI Quality:
    Interactions Score: 8.8/10 ✅ (min: 8.0)
    Accessibility Score: 9.2/10 ✅ (min: 9.0)
    
    Applied Fixes:
    - Added aria-label to menu button
    - Implemented focus trap in mobile menu
    - Added keyboard shortcuts (Esc to close)
    - Increased touch targets from 36px to 44px
    - Added focus-visible outlines
  ```

### Tier 3 Task - Polish & Optimization

#### Subtask 3.1: Comprehensive UI Polish

##### Polish Tasks
- [ ] Review all UI components for consistency
- [ ] Add micro-interactions and transitions
- [ ] Implement loading skeletons
- [ ] Add empty state illustrations
- [ ] Polish error messages and feedback

##### 🏥 Final UI Quality Assessment
- [ ] **Run comprehensive UI validation**:
  ```bash
  /vibe-validate-work --comprehensive --ui-threshold=8.5
  ```
  
  **Higher threshold for final polish phase**

- [ ] **Final UI Quality Report**:
  ```yaml
  Phase UI Quality Summary:
    Average Score: 8.7/10 ✅
    Components Analyzed: 12
    Components Healed: 8
    Total Fixes Applied: 47
    
    Top Improvements:
    1. Color contrast: 15 fixes
    2. Spacing consistency: 12 fixes
    3. Interaction states: 10 fixes
    4. Accessibility: 7 fixes
    5. Typography: 3 fixes
    
    All Components Above Threshold: ✅
    Design System Compliance: 96% ✅
  ```

#### Subtask 3.2: Cross-Browser UI Validation

- [ ] **Run cross-browser validation with UI healing**:
  ```bash
  /vibe-validate-work --browsers=all
  ```
  
  **Browser-Specific UI Healing**:
  - Chrome: Baseline (usually no fixes needed)
  - Firefox: May fix custom scrollbar styles
  - Safari: May fix backdrop filters, aspect-ratio
  - Edge: May fix grid/flexbox edge cases

### Special UI Component Scenarios

#### Complex Data Tables
When implementing data tables, validation includes:
- [ ] Column alignment consistency
- [ ] Row hover states
- [ ] Sort indicator visibility
- [ ] Responsive behavior (horizontal scroll)
- [ ] Loading state for data

#### Forms and Inputs
Form validation automatically checks:
- [ ] Label-input association
- [ ] Error message styling
- [ ] Focus states on all inputs
- [ ] Validation feedback timing
- [ ] Success state styling

#### Modal and Overlays
Modal components receive extra checks:
- [ ] Focus trap implementation
- [ ] Escape key handling
- [ ] Background scroll lock
- [ ] Animation performance
- [ ] Overlay opacity and blur

## Configuration Options

### .vibe/validation.config.json
```json
{
  "validation": {
    "uiQuality": {
      "enabled": true,
      "threshold": 8.0,
      "autoHeal": true,
      "screenshotOnHeal": true,
      "categories": {
        "colorContrast": { "weight": 0.2, "autoFix": true },
        "typography": { "weight": 0.15, "autoFix": true },
        "spacing": { "weight": 0.15, "autoFix": true },
        "interactions": { "weight": 0.2, "autoFix": true },
        "consistency": { "weight": 0.15, "autoFix": false },
        "accessibility": { "weight": 0.15, "autoFix": true }
      },
      "componentOverrides": {
        "navigation": { "threshold": 8.5 },
        "forms": { "threshold": 8.5 },
        "modals": { "threshold": 9.0 }
      }
    }
  }
}
```

## Benefits of Integrated UI Healing

1. **Continuous Quality** - UI never drops below quality threshold
2. **Immediate Fixes** - Issues resolved inline, not later
3. **Design System Compliance** - Automatic enforcement
4. **Reduced Review Cycles** - Fewer UI bugs in review
5. **Consistent Output** - All developers produce same quality

## Troubleshooting

### UI Score Remains Low After Healing
- Check if design system file exists and is properly formatted
- Verify component has standard structure for detection
- Some complex fixes may need manual intervention
- Review the detailed breakdown for specific issues

### Healing Makes Unwanted Changes
- Adjust category weights in config
- Disable auto-fix for specific categories
- Use `--skip-ui-healing` flag temporarily
- Submit feedback to improve healing rules

### Performance Impact
- UI healing adds ~10-30 seconds per component
- Only runs when UI files are changed
- Can be disabled for quick iterations
- Screenshots can be disabled to save time

---

**Every UI component ships with guaranteed quality through automatic healing! 🏥✨**
```