# UI Healer Workflow Integration Template

## Overview

This template shows how to integrate the two-command validation system into your development workflow:
- **`/vibe-validate-work`** - Code quality, bugs, integrations, task completion
- **`/vibe-ui-healer`** - UI testing, browser compatibility, visual quality, accessibility

## Two-Command Validation System

### Clear Separation of Concerns

```mermaid
graph LR
    A[Write Code] --> B[/vibe-validate-work]
    B --> C{Code OK?}
    C -->|No| D[Fix Code Issues]
    D --> B
    C -->|Yes| E[/vibe-ui-healer]
    E --> F{UI OK?}
    F -->|No| G[Auto-Heal UI]
    G --> H[Review Changes]
    H --> E
    F -->|Yes| I[Commit Code]
```

### Command Responsibilities

| Aspect | Work Validator | UI Healer |
|--------|---------------|-----------|
| Code Quality | ✓ | |
| Bug Detection | ✓ | |
| Security Scanning | ✓ | |
| Test Coverage | ✓ | |
| API Integration | ✓ | |
| Task Completion | ✓ | |
| Browser Testing | | ✓ |
| Visual Regression | | ✓ |
| Accessibility | | ✓ |
| Responsive Design | | ✓ |
| Design System | | ✓ |
| UI Healing | | ✓ |

## Phase Template Integration

```markdown
# Phase X: [Feature Name]

## Implementation Tasks

### Subtask 2.1: User Profile Component

#### Development Tasks
- [ ] Create profile layout component
- [ ] Implement profile form with validation
- [ ] Add avatar upload functionality
- [ ] Write unit tests for profile logic
- [ ] Add integration tests for API calls

#### Validation Checkpoint #1 - Code Quality
- [ ] **Run Code Validation**: `/vibe-validate-work`
  ```yaml
  Expected Results:
  - Code Quality: 85+/100 ✓
  - Test Coverage: 95%+ ✓
  - Bugs Found: 0 ✓
  - Security Issues: 0 ✓
  - Integration Tests: Pass ✓
  ```
- [ ] Fix any code issues found
- [ ] Re-run if needed: `/vibe-validate-work --recheck`

#### Validation Checkpoint #2 - UI Quality  
- [ ] **Run UI Testing & Healing**: `/vibe-ui-healer --pages="/profile" --threshold=8`
  ```yaml
  Expected Results:
  - Browser Compatibility: All Pass ✓
  - Visual Regression: Matches baseline ✓
  - Accessibility: WCAG AA ✓
  - Responsive: All breakpoints ✓
  - Design System Score: 8+/10 ✓
  ```
- [ ] Review UI improvements applied
- [ ] Test UI changes in browser
- [ ] Approve healing modifications

#### Git Commit
- [ ] Stage all changes: `git add -A`
- [ ] Commit with both validations passed:
  ```bash
  git commit -m "feat(profile): User profile component
  
  - Code validation: Passed (95% coverage)
  - UI quality: 8.5/10 (auto-healed)
  - Browser tested: Chrome, Firefox, Safari
  - Accessibility: WCAG AA compliant"
  ```
```

## Common Workflows

### Workflow 1: New Component Development

```bash
# 1. Create component and tests
vim components/NewComponent.tsx
vim __tests__/NewComponent.test.tsx

# 2. Validate code quality first
/vibe-validate-work
# Fix any issues...

# 3. Test and improve UI
/vibe-ui-healer --components="NewComponent"
# Review improvements...

# 4. Commit when both pass
git add -A
git commit -m "feat: new component with validations"
```

### Workflow 2: UI-Heavy Feature

```bash
# 1. Build the feature
# ... development work ...

# 2. Quick code check
/vibe-validate-work --quick

# 3. Comprehensive UI testing
/vibe-ui-healer --comprehensive --threshold=9
# Higher threshold for UI-critical features

# 4. Visual regression baseline
/vibe-ui-healer --visual-regression --update-baseline
```

### Workflow 3: Bug Fix

```bash
# 1. Fix the bug
vim src/buggy-component.tsx

# 2. Validate the fix
/vibe-validate-work --focus="bugs,security"
# Ensures bug is fixed and no new issues

# 3. Quick UI check
/vibe-ui-healer --pages="/affected-page" --heal=false
# Just verify UI wasn't broken
```

### Workflow 4: Before PR/Merge

```bash
# 1. Comprehensive code validation
/vibe-validate-work --comprehensive --final

# 2. Full UI test suite
/vibe-ui-healer --browsers="all" --accessibility --visual-regression

# 3. Generate reports
/vibe-validate-work --report=markdown > validation-report.md
/vibe-ui-healer --report=markdown > ui-report.md

# 4. Create PR with confidence
gh pr create --title "Feature X" --body "$(cat validation-report.md ui-report.md)"
```

## Configuration Best Practices

### For Backend-Heavy Projects
```json
{
  "validation": {
    "codeQuality": {
      "weight": "high",
      "testCoverage": { "minimum": 98 }
    },
    "uiQuality": {
      "enabled": true,
      "threshold": 7.0,
      "browsers": ["chrome"]
    }
  }
}
```

### For UI-Heavy Projects
```json
{
  "validation": {
    "codeQuality": {
      "testCoverage": { "minimum": 90 }
    },
    "uiQuality": {
      "threshold": 9.0,
      "browsers": ["all"],
      "visualRegression": true,
      "accessibility": { "level": "AAA" }
    }
  }
}
```

### For Rapid Prototyping
```json
{
  "validation": {
    "codeQuality": {
      "quickMode": true
    },
    "uiQuality": {
      "threshold": 7.0,
      "heal": true,
      "maxIterations": 1
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Vibe Validation Pipeline

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Environment
        run: |
          npm install
          npx playwright install
      
      - name: Start Dev Server
        run: npm run dev &
        
      - name: Code Validation
        run: /vibe-validate-work --ci
        
      - name: UI Testing
        run: /vibe-ui-healer --ci --browsers="chrome,firefox"
        
      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: validation-reports
          path: |
            tests/validation-report.json
            tests/ui-report.json
            tests/screenshots/
```

## Tips for Success

### 1. Order Matters
Always validate code first, then UI:
```bash
/vibe-validate-work && /vibe-ui-healer
```

### 2. Use Watch Mode During Development
```bash
# Terminal 1
/vibe-validate-work --watch

# Terminal 2  
/vibe-ui-healer --mode=watch
```

### 3. Customize Thresholds Per Feature
```bash
# Standard features
/vibe-ui-healer --threshold=8

# Critical UI (checkout, payment)
/vibe-ui-healer --threshold=9.5

# Internal tools
/vibe-ui-healer --threshold=7
```

### 4. Create Aliases for Common Uses
```bash
# In your .bashrc or .zshrc
alias vw="/vibe-validate-work"
alias vui="/vibe-ui-healer"
alias vcheck="/vibe-validate-work && /vibe-ui-healer"
```

### 5. Document Your Standards
```markdown
## Project Validation Standards

### Code Quality (via /vibe-validate-work)
- Minimum test coverage: 95%
- Zero critical bugs
- Zero security vulnerabilities
- All integrations tested

### UI Quality (via /vibe-ui-healer)
- Design system score: 8+/10
- Browser support: Chrome, Firefox, Safari
- Accessibility: WCAG AA minimum
- Mobile responsive: 320px-768px
```

## Common Issues & Solutions

### Issue: "Should I run both commands every time?"
**Solution**: No, use them based on what changed:
- Backend only changes: Just `/vibe-validate-work`
- UI only changes: Both commands (code first)
- Config changes: Both commands
- Documentation: Neither (unless it has code examples)

### Issue: "UI Healer takes too long"
**Solution**: Use focused testing:
```bash
# Test only what changed
/vibe-ui-healer --pages="/dashboard" --browsers="chrome"

# Skip healing during rapid iteration
/vibe-ui-healer --heal=false --quick
```

### Issue: "Commands have overlapping checks"
**Solution**: They don't! Clear separation:
- Work Validator: Never checks UI appearance
- UI Healer: Never checks code logic

## Summary

The two-command system provides:
1. **Clear mental model** - Code vs UI
2. **Focused validation** - Each tool does one thing well
3. **Flexible workflow** - Use what you need
4. **Comprehensive coverage** - Together they catch everything

Remember: **Code quality first, then UI quality!**