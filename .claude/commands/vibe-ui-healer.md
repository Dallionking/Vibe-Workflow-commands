---
description: Comprehensive UI testing, browser testing, visual regression, accessibility testing, and automatic healing
allowed-tools:
  - mcp__playwright__*
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
  - --pages
  - --threshold
  - --browsers
  - --visual-regression
  - --accessibility
  - --responsive
  - --heal
  - --mode
  - --report
---

# vibe-ui-healer

Comprehensive UI testing, browser testing, visual regression, accessibility testing, and automatic healing

## Usage
`/vibe-ui-healer [--pages] [--threshold] [--browsers] [--visual-regression] [--accessibility] [--responsive] [--heal] [--mode] [--report]`

# UI Healer Agent - Comprehensive UI Quality & Browser Testing System

## Mission Statement
**I am the UI Healer Agent.** I handle ALL UI-related validation, testing, and quality assurance including browser testing, visual regression, accessibility compliance, responsive design verification, and automatic UI healing. I ensure every UI component meets your design system standards through comprehensive testing and iterative improvements.

## Agent Configuration
- **Command**: `/vibe-ui-healer`
- **Parameters**: 
  - `--pages` - Specific pages/components to test and heal (default: all)
  - `--threshold` - Minimum quality score (default: 8)
  - `--browsers` - Browser testing targets (default: chrome,firefox,safari)
  - `--visual-regression` - Run visual regression tests (default: true)
  - `--accessibility` - Run accessibility tests (default: true)
  - `--responsive` - Test responsive breakpoints (default: true)
  - `--heal` - Apply automatic fixes (default: true)
  - `--mode` - single/watch/continuous (default: single)
  - `--report` - Generate detailed report (default: true)
- **Dependencies**: Playwright MCP, Design System (Step 4), Interface States (Step 5)
- **Outputs**: 
  - Comprehensive UI test results
  - Browser compatibility report
  - Visual regression screenshots
  - Accessibility audit
  - Responsive design validation
  - UI quality scores
  - Healing report with fixes applied
  - Before/after screenshots
- **MCP Tools**: Playwright (required), Context7

## The Self-Healing Philosophy
"One-shotting solutions is the big lie of the vibe coding world. Creating really dope stuff takes iterative improvement over time." - We implement this truth through automated, objective, iterative UI enhancement.

## Comprehensive UI Testing Scope

The UI Healer is your one-stop solution for ALL UI-related quality assurance:

### 1. 🌐 Browser Testing
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile browser testing (iOS Safari, Android Chrome)
- Browser-specific bug detection
- JavaScript console error monitoring
- Network request validation

### 2. 📸 Visual Regression Testing
- Screenshot comparison against baselines
- Component-level visual testing
- Full-page visual validation
- Responsive breakpoint screenshots
- Visual diff generation

### 3. ♿ Accessibility Testing
- WCAG 2.1 AA/AAA compliance
- Screen reader compatibility
- Keyboard navigation verification
- Color contrast validation
- ARIA attribute correctness
- Focus management testing

### 4. 📱 Responsive Design Testing
- Mobile viewport testing (320px - 768px)
- Tablet viewport testing (768px - 1024px)
- Desktop viewport testing (1024px+)
- Touch interaction validation
- Orientation change handling

### 5. 🎨 Design System Compliance
- Color usage validation
- Typography hierarchy checking
- Spacing grid compliance
- Component consistency
- Animation performance

### 6. 🏥 Automatic UI Healing
- Fix color contrast issues
- Align spacing to grid
- Add missing interaction states
- Improve accessibility
- Optimize performance

## Pre-Execution Validation
```bash
echo "🏥 UI HEALER AGENT - Comprehensive UI Testing & Quality System"
echo "============================================================="

validate_prerequisites() {
    echo "🔍 Validating prerequisites..."
    
    # Check Playwright MCP availability
    if ! check_mcp_tool "playwright"; then
        echo "❌ Playwright MCP not available. This is required for UI testing."
        echo "   Please install Playwright MCP in your Claude Code settings."
        exit 1
    fi
    
    # Check design system exists
    if [ ! -f "docs/04-design-system.md" ]; then
        echo "❌ Design system not found (docs/04-design-system.md)"
        echo "   Run /vibe-step-4-design-system first"
        exit 1
    fi
    
    # Check interface states exist  
    if [ ! -f "docs/05-interface-states.md" ]; then
        echo "❌ Interface states not found (docs/05-interface-states.md)"
        echo "   Run /vibe-step-5-interface first"
        exit 1
    fi
    
    # Check if dev server is running
    if ! check_dev_server; then
        echo "⚠️  Development server not detected on localhost:3000"
        echo "   Please start your dev server before running UI testing"
        exit 1
    fi
    
    # Setup test directories
    mkdir -p tests/{screenshots,visual-baselines,reports,accessibility}
    
    echo "✅ All prerequisites satisfied"
}
```

## Execution Framework

### Phase 1: Browser Testing & Visual Regression

<goal>
You are a Senior QA Engineer and Browser Testing Specialist with 15+ years of experience in automated UI testing, visual regression testing, and cross-browser compatibility. You ensure comprehensive UI quality through systematic testing before healing.

Your testing approach covers:
- Multi-browser compatibility testing
- Visual regression against baselines
- Accessibility compliance verification
- Responsive design validation
- Performance metric collection
- User interaction testing
</goal>

#### 1.1 Browser Compatibility Testing
```javascript
// browser-test-runner.js
const { chromium, firefox, webkit } = require('playwright');

class BrowserTestRunner {
    constructor(options = {}) {
        this.browsers = options.browsers || ['chromium', 'firefox', 'webkit'];
        this.baseURL = options.baseURL || 'http://localhost:3000';
        this.results = [];
    }
    
    async runTests(testPages) {
        for (const browserType of this.browsers) {
            console.log(`\n🌐 Testing in ${browserType}...`);
            const browser = await this.launchBrowser(browserType);
            const context = await browser.newContext();
            
            for (const page of testPages) {
                const result = await this.testPage(context, page, browserType);
                this.results.push(result);
            }
            
            await browser.close();
        }
        
        return this.results;
    }
    
    async testPage(context, pagePath, browserType) {
        const page = await context.newPage();
        const result = {
            browser: browserType,
            page: pagePath,
            issues: [],
            performance: {},
            accessibility: {},
            screenshots: {}
        };
        
        try {
            // Navigate and wait for load
            await page.goto(`${this.baseURL}${pagePath}`);
            await page.waitForLoadState('networkidle');
            
            // Check for console errors
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    result.issues.push({
                        type: 'console-error',
                        message: msg.text(),
                        browser: browserType
                    });
                }
            });
            
            // Check for JavaScript errors
            page.on('pageerror', error => {
                result.issues.push({
                    type: 'javascript-error',
                    message: error.message,
                    stack: error.stack,
                    browser: browserType
                });
            });
            
            // Capture performance metrics
            const metrics = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');
                
                return {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
                    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
                };
            });
            result.performance = metrics;
            
            // Take screenshot
            const screenshotPath = `tests/screenshots/${browserType}-${pagePath.replace(/\//g, '-')}.png`;
            await page.screenshot({ 
                path: screenshotPath,
                fullPage: true 
            });
            result.screenshots.fullPage = screenshotPath;
            
            // Test responsive viewports
            const viewports = [
                { name: 'mobile', width: 375, height: 667 },
                { name: 'tablet', width: 768, height: 1024 },
                { name: 'desktop', width: 1440, height: 900 }
            ];
            
            for (const viewport of viewports) {
                await page.setViewportSize(viewport);
                await page.waitForTimeout(500); // Allow for responsive adjustments
                
                const viewportScreenshot = `tests/screenshots/${browserType}-${pagePath.replace(/\//g, '-')}-${viewport.name}.png`;
                await page.screenshot({ 
                    path: viewportScreenshot,
                    fullPage: false 
                });
                result.screenshots[viewport.name] = viewportScreenshot;
            }
            
        } catch (error) {
            result.issues.push({
                type: 'navigation-error',
                message: error.message,
                browser: browserType
            });
        }
        
        await page.close();
        return result;
    }
    
    async launchBrowser(browserType) {
        const browserLaunchers = {
            chromium: () => chromium.launch({ headless: true }),
            firefox: () => firefox.launch({ headless: true }),
            webkit: () => webkit.launch({ headless: true })
        };
        
        return await browserLaunchers[browserType]();
    }
}
```

#### 1.2 Visual Regression Testing
```javascript
// visual-regression-tester.js
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const fs = require('fs').promises;

class VisualRegressionTester {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.1; // 10% difference threshold
        this.basePath = options.basePath || 'tests/visual-baselines';
        this.currentPath = options.currentPath || 'tests/screenshots';
        this.diffPath = options.diffPath || 'tests/visual-diffs';
    }
    
    async compareScreenshots(currentFile, baselineFile) {
        try {
            // Read images
            const baselineData = await fs.readFile(`${this.basePath}/${baselineFile}`);
            const currentData = await fs.readFile(`${this.currentPath}/${currentFile}`);
            
            const baseline = PNG.sync.read(baselineData);
            const current = PNG.sync.read(currentData);
            
            // Compare dimensions
            if (baseline.width !== current.width || baseline.height !== current.height) {
                return {
                    match: false,
                    reason: 'dimension-mismatch',
                    baseline: { width: baseline.width, height: baseline.height },
                    current: { width: current.width, height: current.height }
                };
            }
            
            // Create diff image
            const diff = new PNG({ width: baseline.width, height: baseline.height });
            
            // Compare pixels
            const numDiffPixels = pixelmatch(
                baseline.data,
                current.data,
                diff.data,
                baseline.width,
                baseline.height,
                { threshold: this.threshold }
            );
            
            const totalPixels = baseline.width * baseline.height;
            const diffPercentage = (numDiffPixels / totalPixels) * 100;
            
            // Save diff image if there are differences
            if (numDiffPixels > 0) {
                const diffFile = `${this.diffPath}/${currentFile.replace('.png', '-diff.png')}`;
                await fs.writeFile(diffFile, PNG.sync.write(diff));
            }
            
            return {
                match: diffPercentage < 5, // Allow up to 5% difference
                diffPercentage: diffPercentage.toFixed(2),
                diffPixels: numDiffPixels,
                totalPixels,
                diffImage: numDiffPixels > 0 ? `${this.diffPath}/${currentFile}` : null
            };
            
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {
                    match: false,
                    reason: 'baseline-missing',
                    message: 'No baseline image found for comparison'
                };
            }
            throw error;
        }
    }
    
    async createBaseline(screenshotFile) {
        const source = `${this.currentPath}/${screenshotFile}`;
        const destination = `${this.basePath}/${screenshotFile}`;
        
        await fs.mkdir(this.basePath, { recursive: true });
        await fs.copyFile(source, destination);
        
        return {
            created: true,
            baseline: destination
        };
    }
}
```

#### 1.3 Accessibility Testing
```javascript
// accessibility-tester.js
class AccessibilityTester {
    constructor(page) {
        this.page = page;
    }
    
    async runAudit() {
        const results = {
            score: 100,
            violations: [],
            warnings: [],
            passes: []
        };
        
        // WCAG 2.1 AA Checks
        const auditResults = await this.page.evaluate(() => {
            const audit = {
                colorContrast: [],
                missingAlt: [],
                missingLabels: [],
                headingOrder: [],
                focusIndicators: [],
                ariaIssues: [],
                keyboardNav: []
            };
            
            // Check color contrast
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.color && style.backgroundColor) {
                    // Simplified contrast check (real implementation would calculate proper ratios)
                    const hasText = el.textContent.trim().length > 0;
                    if (hasText) {
                        // Would calculate actual contrast ratio here
                        audit.colorContrast.push({
                            element: el.tagName,
                            text: el.textContent.substring(0, 50),
                            foreground: style.color,
                            background: style.backgroundColor
                        });
                    }
                }
            });
            
            // Check images for alt text
            document.querySelectorAll('img').forEach(img => {
                if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('role') === 'presentation') {
                    audit.missingAlt.push({
                        src: img.src,
                        element: img.outerHTML.substring(0, 100)
                    });
                }
            });
            
            // Check form labels
            document.querySelectorAll('input, select, textarea').forEach(input => {
                const id = input.id;
                const hasLabel = id && document.querySelector(`label[for="${id}"]`);
                const hasAriaLabel = input.getAttribute('aria-label');
                const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
                
                if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && input.type !== 'hidden') {
                    audit.missingLabels.push({
                        type: input.type,
                        name: input.name,
                        element: input.outerHTML.substring(0, 100)
                    });
                }
            });
            
            // Check heading hierarchy
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            let lastLevel = 0;
            headings.forEach(heading => {
                const level = parseInt(heading.tagName[1]);
                if (level > lastLevel + 1) {
                    audit.headingOrder.push({
                        skipped: `h${lastLevel} to h${level}`,
                        text: heading.textContent.substring(0, 50)
                    });
                }
                lastLevel = level;
            });
            
            // Check interactive elements for keyboard accessibility
            document.querySelectorAll('button, a, [onclick], [role="button"]').forEach(el => {
                const tabindex = el.getAttribute('tabindex');
                if (tabindex === '-1') {
                    audit.keyboardNav.push({
                        element: el.tagName,
                        text: el.textContent.substring(0, 50),
                        issue: 'not keyboard accessible'
                    });
                }
            });
            
            return audit;
        });
        
        // Calculate score based on violations
        let deductions = 0;
        Object.entries(auditResults).forEach(([category, issues]) => {
            if (issues.length > 0) {
                results.violations.push({
                    category,
                    count: issues.length,
                    samples: issues.slice(0, 3)
                });
                deductions += issues.length * 2; // 2 points per issue
            }
        });
        
        results.score = Math.max(0, 100 - deductions);
        results.wcagCompliance = results.score >= 90 ? 'AA' : results.score >= 70 ? 'A' : 'Fail';
        
        return results;
    }
}
```

### Phase 2: Design System Analysis & Grading Criteria Extraction

<goal>
You are a Senior Product Designer and UI/UX Quality Assurance Specialist with 15+ years of experience in design systems, visual design, and automated quality assessment. You understand that great UI requires iterative refinement and objective standards.

Your first task is to analyze the project's design system and extract measurable grading criteria that will be used to evaluate UI quality.
</goal>

#### 1.1 Extract Design Standards
```typescript
interface DesignStandards {
  colors: {
    palette: Record<string, string>;
    contrastRequirements: number; // WCAG AA = 4.5
    darkModeCompliance: boolean;
  };
  
  typography: {
    scale: TypographyScale[];
    hierarchy: string[];
    readabilityTargets: {
      lineHeight: number;
      characterWidth: number;
    };
  };
  
  spacing: {
    baseUnit: number; // e.g., 8px
    scale: number[];
    componentPadding: Record<string, number>;
  };
  
  interactions: {
    hoverStates: boolean;
    focusIndicators: boolean;
    animationDuration: number; // e.g., 300ms
    easingFunction: string;
  };
  
  components: {
    borderRadius: Record<string, number>;
    shadows: Record<string, string>;
    states: string[]; // default, hover, active, disabled
  };
}
```

#### 1.2 Generate Grading Rubric
Based on the design system, create specific grading criteria:

```markdown
## UI Quality Grading Rubric (1-10 Scale)

### Color & Contrast (Weight: 20%)
- [ ] All text meets WCAG AA contrast ratios (4.5:1 normal, 3:1 large)
- [ ] Brand colors used correctly according to hierarchy
- [ ] Functional colors (success/error/warning) properly applied
- [ ] Dark mode maintains readability and brand consistency

### Typography (Weight: 20%)
- [ ] Hierarchy follows design system scale exactly
- [ ] Line heights provide comfortable reading
- [ ] Font weights create clear visual hierarchy
- [ ] Responsive scaling maintains readability

### Spacing & Layout (Weight: 20%)
- [ ] Consistent use of 8px grid system
- [ ] Component padding matches specifications
- [ ] Margins create clear visual groupings
- [ ] Responsive breakpoints properly implemented

### Interactions & States (Weight: 25%)
- [ ] All interactive elements have hover states
- [ ] Focus indicators meet accessibility standards
- [ ] Animations use specified duration (300ms) and easing
- [ ] Loading and error states properly styled

### Component Consistency (Weight: 15%)
- [ ] Buttons follow all variant specifications
- [ ] Cards use consistent shadows and borders
- [ ] Forms maintain uniform styling
- [ ] Icons sized and colored correctly
```

### Phase 2: Screenshot Capture & Visual Analysis

#### 2.1 Automated Screenshot Collection
```javascript
async function captureUIScreenshots(pages) {
  const screenshots = [];
  
  // Use Playwright MCP to capture screenshots
  for (const page of pages) {
    const screenshot = await playwright.screenshot({
      url: `http://localhost:3000${page}`,
      fullPage: true,
      animations: 'disabled' // For consistent captures
    });
    
    screenshots.push({
      page,
      image: screenshot,
      timestamp: new Date().toISOString()
    });
  }
  
  return screenshots;
}
```

#### 2.2 Visual Context Extraction
```markdown
For each screenshot, extract:
1. Component inventory (what UI elements are present)
2. Color usage analysis
3. Typography implementation
4. Spacing measurements
5. Interactive element identification
```

### Phase 3: Automated Grading System

#### 3.1 Objective Evaluation
```typescript
interface UIGradingResult {
  overallScore: number; // 1-10
  breakdown: {
    colorContrast: ComponentScore;
    typography: ComponentScore;
    spacing: ComponentScore;
    interactions: ComponentScore;
    consistency: ComponentScore;
  };
  failingElements: FailedElement[];
  suggestions: Improvement[];
}

interface ComponentScore {
  score: number; // 1-10
  issues: string[];
  specifics: string[];
}

interface FailedElement {
  element: string;
  issue: string;
  severity: 'critical' | 'major' | 'minor';
  fix: string;
}
```

#### 3.2 Grading Process
```markdown
1. **Analyze Screenshot Against Design System**
   - Compare colors to palette
   - Measure text contrast ratios
   - Check typography scale compliance
   - Verify spacing grid adherence
   - Identify missing interaction states

2. **Calculate Scores**
   - Each category gets 1-10 score
   - Weight categories for overall score
   - Flag critical issues (< 5 score)
   - Generate specific feedback

3. **Identify Improvements**
   - List specific CSS changes needed
   - Prioritize by impact on score
   - Group related fixes
```

### Phase 4: Self-Healing Implementation Loop

#### 4.1 The Healing Loop
```javascript
async function selfHealingLoop(page, targetScore = 8) {
  let currentScore = 0;
  let iteration = 0;
  const maxIterations = 5;
  const improvements = [];
  
  while (currentScore < targetScore && iteration < maxIterations) {
    iteration++;
    
    // Step 1: Capture current state
    const screenshot = await captureScreenshot(page);
    
    // Step 2: Grade against standards
    const gradingResult = await gradeUI(screenshot);
    currentScore = gradingResult.overallScore;
    
    console.log(`Iteration ${iteration}: Score ${currentScore}/10`);
    
    if (currentScore >= targetScore) {
      console.log("✅ Target score achieved!");
      break;
    }
    
    // Step 3: Implement fixes for lowest scoring areas
    const fixes = prioritizeFixes(gradingResult);
    await implementFixes(page, fixes);
    
    improvements.push({
      iteration,
      score: currentScore,
      fixes: fixes
    });
  }
  
  return {
    finalScore: currentScore,
    iterations: iteration,
    improvements
  };
}
```

#### 4.2 Fix Implementation
```markdown
## Fix Priority Order
1. **Critical Issues (Score < 5)**
   - Contrast failures
   - Missing interactive states
   - Broken layouts

2. **Major Issues (Score 5-7)**
   - Inconsistent spacing
   - Typography hierarchy problems
   - Missing hover effects

3. **Polish Issues (Score 7-8)**
   - Subtle animations
   - Shadow refinements
   - Micro-interactions
```

### Phase 5: Improvement Implementation

#### 5.1 CSS Injection Strategy
```typescript
interface UIFix {
  selector: string;
  property: string;
  value: string;
  reason: string;
}

// Example fixes based on common issues
const commonFixes = {
  lowContrast: (element: string, foreground: string, background: string) => ({
    selector: element,
    property: 'color',
    value: adjustColorForContrast(foreground, background, 4.5),
    reason: 'Failed WCAG AA contrast ratio'
  }),
  
  missingHover: (element: string) => ({
    selector: `${element}:hover`,
    property: 'transform',
    value: 'translateY(-2px)',
    reason: 'Missing hover state feedback'
  }),
  
  inconsistentSpacing: (element: string, expected: number) => ({
    selector: element,
    property: 'padding',
    value: `${expected}px`,
    reason: 'Not following 8px grid system'
  })
};
```

#### 5.2 Progressive Enhancement
```markdown
## Iteration Strategy
1. **First Pass - Critical Fixes**
   - Fix contrast issues
   - Add missing states
   - Correct major spacing

2. **Second Pass - Consistency**
   - Align all components to grid
   - Standardize shadows
   - Fix typography scale

3. **Third Pass - Polish**
   - Add micro-animations
   - Refine hover states
   - Perfect transitions
```

### Phase 6: Reporting & Documentation

#### 6.1 Improvement Report Generation
```markdown
# UI Healing Report

## Summary
- **Initial Score**: 5.2/10
- **Final Score**: 8.7/10
- **Iterations**: 3
- **Total Fixes Applied**: 47

## Detailed Improvements

### Iteration 1 (5.2 → 6.8)
**Color & Contrast Fixes**
- Fixed 12 contrast violations
- Updated error state colors
- Improved link visibility

**Before/After Screenshots**
[Screenshot comparison]

### Iteration 2 (6.8 → 7.9)
**Spacing & Layout Fixes**
- Aligned 23 elements to 8px grid
- Standardized component padding
- Fixed responsive breakpoints

### Iteration 3 (7.9 → 8.7)
**Interaction & Polish**
- Added hover states to all buttons
- Implemented focus indicators
- Added subtle animations

## Remaining Recommendations
- Consider updating primary button color for better contrast
- Add loading skeleton states for async content
- Implement keyboard navigation indicators
```

#### 6.2 Visual Diff Generation
```javascript
async function generateVisualDiff(before, after) {
  return {
    sideBySide: await createSideBySideComparison(before, after),
    overlay: await createOverlayDiff(before, after),
    highlightedChanges: await identifyChangedAreas(before, after)
  };
}
```

## Integration with Vibe Coding Workflow

### Separation of Concerns

The Vibe Coding workflow uses two complementary validation commands:

#### 1. Work Validator (`/vibe-validate-work`)
- **Purpose**: Code quality, bugs, integration testing
- **Checks**: 
  - Code quality and complexity
  - Bug detection and security
  - Test coverage (95%+)
  - API integrations
  - Task completion verification
  - Documentation completeness

#### 2. UI Healer (`/vibe-ui-healer`) - THIS COMMAND
- **Purpose**: Everything UI-related
- **Checks**:
  - Browser compatibility
  - Visual regression
  - Accessibility compliance
  - Responsive design
  - Design system adherence
  - UI component quality
  - Automatic UI improvements

### Typical Workflow

#### After Creating UI Components
```bash
# Step 1: Validate code quality first
/vibe-validate-work
# Ensures: Code is clean, tests pass, no bugs

# Step 2: Test and heal UI
/vibe-ui-healer --threshold=8
# Ensures: UI looks great, works everywhere, accessible
```

#### In Phase Templates
```markdown
#### Subtask 2.3: Dashboard Component Implementation
- [ ] Create dashboard components
- [ ] Add data visualization
- [ ] Connect to state management
- [ ] **Code Validation**: `/vibe-validate-work`
  - [ ] Verify code quality passes
  - [ ] Ensure 95%+ test coverage
  - [ ] Check for bugs and issues
- [ ] **UI Quality Check**: `/vibe-ui-healer --pages="/dashboard" --threshold=8`
  - [ ] Review browser compatibility report
  - [ ] Check visual regression results
  - [ ] Verify accessibility score (WCAG AA)
  - [ ] Review and approve UI improvements
- [ ] Commit: `git commit -m "feat: dashboard with validated code and UI"`
```

### Continuous Development Mode
```bash
# Terminal 1: Watch for code issues
/vibe-validate-work --watch

# Terminal 2: Watch for UI issues
/vibe-ui-healer --mode=watch --heal=true

# Both run continuously during development
```

## Success Metrics

### Quality Improvements
- Average UI score increase: 2.5-3.5 points
- Consistency improvement: 85%+
- Accessibility compliance: 100% WCAG AA
- Design system adherence: 95%+

### Time Savings
- Manual UI review time: -75%
- Design iteration cycles: -60%
- Bug reports for UI issues: -80%

## Comprehensive Usage Examples

### Full UI Testing Suite
```bash
/vibe-ui-healer
# Runs complete UI testing:
# - Browser compatibility (Chrome, Firefox, Safari)
# - Visual regression testing
# - Accessibility audit
# - Responsive design check
# - Design system grading
# - Automatic healing to 8/10+
```

### Browser-Specific Testing
```bash
/vibe-ui-healer --browsers="chrome,firefox,safari,edge"
# Test across all major browsers

/vibe-ui-healer --browsers="mobile-chrome,mobile-safari"
# Mobile browser testing only
```

### Visual Regression Focus
```bash
/vibe-ui-healer --visual-regression --update-baseline
# Create new visual baselines

/vibe-ui-healer --visual-regression --threshold=0.1
# Strict visual comparison (10% threshold)
```

### Accessibility Testing
```bash
/vibe-ui-healer --accessibility --wcag="AAA"
# Test for WCAG AAA compliance

/vibe-ui-healer --accessibility --focus="keyboard,screen-reader"
# Focus on keyboard and screen reader testing
```

### Responsive Testing
```bash
/vibe-ui-healer --responsive --breakpoints="320,768,1024,1440"
# Test specific breakpoints

/vibe-ui-healer --responsive --orientation="both"
# Test portrait and landscape
```

### Specific Pages/Components
```bash
/vibe-ui-healer --pages="/dashboard,/profile" --threshold=9
# Higher standards for critical pages

/vibe-ui-healer --components="Button,Card,Modal"
# Test specific components only
```

### Healing Control
```bash
/vibe-ui-healer --heal=false
# Testing only, no automatic fixes

/vibe-ui-healer --heal=true --max-iterations=3
# Apply up to 3 rounds of healing
```

### CI/CD Integration
```bash
/vibe-ui-healer --ci --fail-below=7.5 --report=junit
# CI mode with JUnit report format
```

### Watch Mode
```bash
/vibe-ui-healer --mode=watch --heal=true
# Continuous testing and healing during development
```

## Command Outputs

### Comprehensive UI Report
```yaml
UI Quality Report - Generated: 2024-01-15 10:30:00
=================================================

Browser Compatibility:
  Chrome: ✓ Pass (0 issues)
  Firefox: ✓ Pass (2 minor issues)
  Safari: ✓ Pass (1 CSS issue fixed)
  Edge: ✓ Pass (0 issues)
  Mobile Chrome: ✓ Pass (0 issues)
  Mobile Safari: ✓ Pass (1 viewport issue fixed)

Visual Regression:
  Tested: 15 pages, 45 components
  Baseline Match: 14/15 (93%)
  Visual Differences: 1 (Dashboard chart updated)
  Action: Baseline updated for dashboard

Accessibility:
  WCAG Compliance: AA ✓
  Score: 96/100
  Issues Fixed:
    - 3 missing alt texts added
    - 2 form labels added
    - 1 heading hierarchy fixed
  Keyboard Navigation: 100% accessible
  Screen Reader: 100% compatible

Responsive Design:
  Mobile (320-768px): ✓ Pass
  Tablet (768-1024px): ✓ Pass 
  Desktop (1024px+): ✓ Pass
  Issues Fixed:
    - 2 overflow issues on mobile
    - 1 touch target size increased

Design System Compliance:
  Overall Score: 8.5/10 ✓
  
  Initial Score: 6.8/10
  Improvements Applied:
    - Color Contrast: 5 fixes (7.2 → 8.5)
    - Spacing: 8 fixes to match 8px grid (7.5 → 8.8)
    - Typography: 2 fixes (8.0 → 8.5)
    - Interactions: 4 hover states added (7.0 → 9.0)
    - Consistency: 3 component variants unified (7.8 → 8.2)
    - Accessibility: Already covered above

Files Modified:
  - components/Dashboard/Dashboard.tsx (5 improvements)
  - components/UserProfile/Profile.tsx (3 improvements)
  - components/Navigation/Nav.tsx (4 improvements)
  - styles/globals.css (2 improvements)

Performance Impact:
  First Contentful Paint: 1.2s ✓
  Largest Contentful Paint: 2.1s ✓
  Cumulative Layout Shift: 0.05 ✓
  Total Blocking Time: 150ms ✓

Recommendations:
  1. Consider lazy loading for dashboard charts
  2. Add skeleton loaders for better perceived performance
  3. Implement virtual scrolling for large lists
```

## Notes
- **Two-Command System**: Use `/vibe-validate-work` for code, `/vibe-ui-healer` for UI
- **Order Matters**: Validate code first, then test/heal UI
- **Comprehensive Coverage**: This single command replaces multiple UI testing tools
- **Development Server**: Always run against your local development server
- **Review Changes**: Always review healing changes before committing
- **Design System**: Works best with completed Step 4 (Design System)

---

**"Complete UI quality assurance in one command - testing, validation, and healing!"** 🏥✨