---
description: Run WCAG 2.1 AA accessibility compliance testing
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
  - --url
  - --output-format
  - --rules
---

# vibe-test-accessibility

Run WCAG 2.1 AA accessibility compliance testing

## Usage
`/vibe-test-accessibility [--url] [--output-format] [--rules]`

# Accessibility Tester Agent

## Mission Statement
**I am the Accessibility Tester Agent.** I perform comprehensive WCAG 2.1 AA compliance testing, keyboard navigation validation, and screen reader compatibility checks to ensure inclusive web applications.

## Agent Configuration
- **Command**: `/vibe-test-accessibility`
- **Parameters**: `--url`, `--output-format`, `--rules`
- **Dependencies**: Axe-core, Playwright, accessibility testing tools
- **Outputs**: Accessibility report, compliance score, remediation guide
- **MCP Tools**: Context7

## Testing Framework

### 1. Accessibility Standards Setup
```bash
echo "♿ ACCESSIBILITY TESTER AGENT"
echo "=========================="

initialize_accessibility_testing() {
    echo "🔧 Initializing accessibility testing environment..."
    
    # Check required tools
    check_dependencies() {
        local missing_deps=()
        
        if ! command -v npx &> /dev/null; then
            missing_deps+=("Node.js/npm")
        fi
        
        if ! npx playwright --version &>/dev/null; then
            missing_deps+=("Playwright")
        fi
        
        if [ ${#missing_deps[@]} -gt 0 ]; then
            echo "❌ Missing dependencies: ${missing_deps[*]}"
            echo "   Run /vibe-setup-browser-testing first"
            exit 1
        fi
    }
    
    check_dependencies
    
    # Install accessibility testing packages if not present
    if ! npm list @axe-core/playwright &>/dev/null; then
        echo "📦 Installing accessibility testing tools..."
        npm install --save-dev @axe-core/playwright
        npm install --save-dev axe-playwright
        npm install --save-dev @axe-core/cli
    fi
    
    echo "✅ Accessibility testing environment ready"
}
```

### 2. WCAG 2.1 AA Compliance Testing
```bash
run_wcag_compliance_test() {
    local url="$1"
    local output_dir="$2"
    
    echo "📋 Running WCAG 2.1 AA compliance test for: $url"
    
    # Create Playwright test for comprehensive WCAG testing
    cat > /tmp/accessibility-test.js << 'EOF'
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('WCAG 2.1 AA Compliance Tests', () => {
  test('full page accessibility scan', async ({ page }) => {
    await page.goto(process.env.TEST_URL);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Save detailed results
    const fs = require('fs');
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/wcag-results.json',
      JSON.stringify(accessibilityScanResults, null, 2)
    );
    
    // Generate human-readable report
    const violations = accessibilityScanResults.violations;
    let reportContent = `# WCAG 2.1 AA Compliance Report\n\n`;
    reportContent += `**URL**: ${process.env.TEST_URL}\n`;
    reportContent += `**Test Date**: ${new Date().toISOString()}\n`;
    reportContent += `**Total Violations**: ${violations.length}\n\n`;
    
    if (violations.length === 0) {
      reportContent += `✅ **PASSED**: No accessibility violations found!\n\n`;
    } else {
      reportContent += `❌ **FAILED**: ${violations.length} accessibility violations found\n\n`;
      
      reportContent += `## Violations by Severity\n\n`;
      const severityCounts = violations.reduce((acc, v) => {
        acc[v.impact] = (acc[v.impact] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(severityCounts).forEach(([severity, count]) => {
        reportContent += `- **${severity}**: ${count}\n`;
      });
      
      reportContent += `\n## Detailed Violations\n\n`;
      
      violations.forEach((violation, index) => {
        reportContent += `### ${index + 1}. ${violation.help}\n\n`;
        reportContent += `- **Impact**: ${violation.impact}\n`;
        reportContent += `- **Rule ID**: ${violation.id}\n`;
        reportContent += `- **WCAG**: ${violation.tags.filter(tag => tag.startsWith('wcag')).join(', ')}\n`;
        reportContent += `- **Description**: ${violation.description}\n`;
        reportContent += `- **Help URL**: ${violation.helpUrl}\n`;
        
        if (violation.nodes.length > 0) {
          reportContent += `\n**Affected Elements**:\n`;
          violation.nodes.forEach(node => {
            reportContent += `- \`${node.target.join(' ')}\`\n`;
            if (node.failureSummary) {
              reportContent += `  - ${node.failureSummary}\n`;
            }
          });
        }
        reportContent += `\n---\n\n`;
      });
    }
    
    // Save report
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/accessibility-report.md',
      reportContent
    );
    
    // Assert no violations for test result
    expect(violations).toEqual([]);
  });
  
  test('keyboard navigation test', async ({ page }) => {
    await page.goto(process.env.TEST_URL);
    await page.waitForLoadState('networkidle');
    
    const keyboardResults = [];
    
    // Test Tab navigation
    let tabIndex = 0;
    let previousElement = null;
    
    while (tabIndex < 20) { // Limit to prevent infinite loops
      await page.keyboard.press('Tab');
      const activeElement = await page.locator(':focus').first();
      
      if (await activeElement.count() === 0) {
        break;
      }
      
      const elementInfo = await activeElement.evaluate(el => ({
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        text: el.textContent?.slice(0, 50),
        href: el.href,
        ariaLabel: el.getAttribute('aria-label'),
        role: el.getAttribute('role')
      }));
      
      // Check if element is actually visible and focusable
      const isVisible = await activeElement.isVisible();
      const boundingBox = await activeElement.boundingBox();
      
      keyboardResults.push({
        tabIndex,
        element: elementInfo,
        isVisible,
        hasFocusIndicator: boundingBox !== null,
        timestamp: Date.now()
      });
      
      // Break if we're cycling back to same element
      if (previousElement && 
          elementInfo.tagName === previousElement.tagName &&
          elementInfo.id === previousElement.id) {
        break;
      }
      
      previousElement = elementInfo;
      tabIndex++;
    }
    
    // Save keyboard navigation results
    const fs = require('fs');
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/keyboard-navigation.json',
      JSON.stringify(keyboardResults, null, 2)
    );
    
    // Validate keyboard navigation
    expect(keyboardResults.length).toBeGreaterThan(0);
    
    const visibleFocusableElements = keyboardResults.filter(r => r.isVisible);
    expect(visibleFocusableElements.length).toBeGreaterThan(0);
  });
  
  test('color contrast validation', async ({ page }) => {
    await page.goto(process.env.TEST_URL);
    await page.waitForLoadState('networkidle');
    
    const contrastResults = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();
    
    const fs = require('fs');
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/color-contrast.json',
      JSON.stringify(contrastResults, null, 2)
    );
    
    expect(contrastResults.violations).toEqual([]);
  });
  
  test('screen reader compatibility', async ({ page }) => {
    await page.goto(process.env.TEST_URL);
    await page.waitForLoadState('networkidle');
    
    // Test for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingStructure = [];
    
    for (const heading of headings) {
      const level = await heading.evaluate(el => parseInt(el.tagName.charAt(1)));
      const text = await heading.textContent();
      const ariaLabel = await heading.getAttribute('aria-label');
      
      headingStructure.push({
        level,
        text: text?.slice(0, 100),
        ariaLabel,
        isVisible: await heading.isVisible()
      });
    }
    
    // Test for alt text on images
    const images = await page.locator('img').all();
    const imageResults = [];
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      const ariaLabel = await img.getAttribute('aria-label');
      const isDecorative = await img.getAttribute('role') === 'presentation';
      
      imageResults.push({
        src: src?.slice(0, 100),
        alt,
        ariaLabel,
        isDecorative,
        hasAltText: alt !== null && alt !== '',
        isVisible: await img.isVisible()
      });
    }
    
    // Test for form labels
    const formInputs = await page.locator('input, select, textarea').all();
    const formResults = [];
    
    for (const input of formInputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Check for associated label
      let hasLabel = false;
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        hasLabel = label > 0;
      }
      
      formResults.push({
        id,
        hasLabel,
        ariaLabel,
        ariaLabelledBy,
        placeholder,
        hasAccessibleName: hasLabel || ariaLabel || ariaLabelledBy
      });
    }
    
    const screenReaderResults = {
      headingStructure,
      imageResults,
      formResults,
      summary: {
        totalHeadings: headingStructure.length,
        properH1Count: headingStructure.filter(h => h.level === 1).length,
        totalImages: imageResults.length,
        imagesWithAlt: imageResults.filter(img => img.hasAltText).length,
        totalFormInputs: formResults.length,
        inputsWithLabels: formResults.filter(input => input.hasAccessibleName).length
      }
    };
    
    const fs = require('fs');
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/screen-reader.json',
      JSON.stringify(screenReaderResults, null, 2)
    );
    
    // Assertions for screen reader compatibility
    expect(screenReaderResults.summary.properH1Count).toBe(1); // Exactly one H1
    
    const visibleImages = imageResults.filter(img => img.isVisible && !img.isDecorative);
    const imagesWithoutAlt = visibleImages.filter(img => !img.hasAltText);
    expect(imagesWithoutAlt).toEqual([]);
    
    const inputsWithoutLabels = formResults.filter(input => !input.hasAccessibleName);
    expect(inputsWithoutLabels).toEqual([]);
  });
});
EOF
    
    # Run the accessibility test
    TEST_URL="$url" OUTPUT_DIR="$output_dir" npx playwright test /tmp/accessibility-test.js \
        --reporter=json:"$output_dir/playwright-results.json" \
        --output-dir="$output_dir"
    
    local exit_code=$?
    
    # Clean up temp file
    rm /tmp/accessibility-test.js
    
    return $exit_code
}
```

### 3. Accessibility Score Calculation
```bash
calculate_accessibility_score() {
    local output_dir="$1"
    
    echo "📊 Calculating accessibility compliance score..."
    
    node << 'EOF'
const fs = require('fs');
const outputDir = process.argv[2];

try {
    // Load all test results
    const wcagResults = JSON.parse(fs.readFileSync(`${outputDir}/wcag-results.json`, 'utf8'));
    const keyboardResults = JSON.parse(fs.readFileSync(`${outputDir}/keyboard-navigation.json`, 'utf8'));
    const screenReaderResults = JSON.parse(fs.readFileSync(`${outputDir}/screen-reader.json`, 'utf8'));
    
    // Calculate scores for each category
    let scores = {
        wcag: 100,
        keyboard: 100,
        screenReader: 100,
        overall: 0
    };
    
    // WCAG Score (deduct points based on violation severity)
    const violationWeights = { critical: 25, serious: 15, moderate: 5, minor: 2 };
    wcagResults.violations.forEach(violation => {
        const weight = violationWeights[violation.impact] || 5;
        scores.wcag = Math.max(0, scores.wcag - weight);
    });
    
    // Keyboard Navigation Score
    const focusableElements = keyboardResults.filter(r => r.isVisible);
    const elementsWithFocus = focusableElements.filter(r => r.hasFocusIndicator);
    if (focusableElements.length > 0) {
        scores.keyboard = Math.round((elementsWithFocus.length / focusableElements.length) * 100);
    }
    
    // Screen Reader Score
    const sr = screenReaderResults.summary;
    let screenReaderDeductions = 0;
    
    if (sr.properH1Count !== 1) screenReaderDeductions += 10;
    if (sr.totalImages > 0) {
        const altTextRatio = sr.imagesWithAlt / sr.totalImages;
        screenReaderDeductions += Math.round((1 - altTextRatio) * 30);
    }
    if (sr.totalFormInputs > 0) {
        const labelRatio = sr.inputsWithLabels / sr.totalFormInputs;
        screenReaderDeductions += Math.round((1 - labelRatio) * 20);
    }
    
    scores.screenReader = Math.max(0, 100 - screenReaderDeductions);
    
    // Overall Score (weighted average)
    scores.overall = Math.round((scores.wcag * 0.5) + (scores.keyboard * 0.25) + (scores.screenReader * 0.25));
    
    // Determine compliance level
    let complianceLevel = 'Non-Compliant';
    if (scores.overall >= 95) complianceLevel = 'Fully Compliant';
    else if (scores.overall >= 85) complianceLevel = 'Mostly Compliant';
    else if (scores.overall >= 70) complianceLevel = 'Partially Compliant';
    
    const scoreReport = {
        timestamp: new Date().toISOString(),
        scores,
        complianceLevel,
        details: {
            wcagViolations: wcagResults.violations.length,
            keyboardNavigation: {
                totalElements: focusableElements.length,
                focusableElements: elementsWithFocus.length
            },
            screenReader: sr
        }
    };
    
    // Save score report
    fs.writeFileSync(`${outputDir}/accessibility-score.json`, JSON.stringify(scoreReport, null, 2));
    
    console.log('📊 ACCESSIBILITY SCORE SUMMARY');
    console.log('==============================');
    console.log(`Overall Score: ${scores.overall}/100`);
    console.log(`Compliance Level: ${complianceLevel}`);
    console.log('');
    console.log('Category Breakdown:');
    console.log(`  WCAG 2.1 AA: ${scores.wcag}/100`);
    console.log(`  Keyboard Navigation: ${scores.keyboard}/100`);
    console.log(`  Screen Reader: ${scores.screenReader}/100`);
    console.log('');
    console.log('Details:');
    console.log(`  WCAG Violations: ${wcagResults.violations.length}`);
    console.log(`  Keyboard Navigation: ${elementsWithFocus.length}/${focusableElements.length} elements focusable`);
    console.log(`  Images with Alt Text: ${sr.imagesWithAlt}/${sr.totalImages}`);
    console.log(`  Form Inputs with Labels: ${sr.inputsWithLabels}/${sr.totalFormInputs}`);
    
} catch (error) {
    console.error('Error calculating accessibility score:', error.message);
    process.exit(1);
}
EOF "$output_dir"
}
```

### 4. Remediation Guide Generation
```bash
generate_remediation_guide() {
    local output_dir="$1"
    
    echo "🔧 Generating remediation guide..."
    
    node << 'EOF'
const fs = require('fs');
const outputDir = process.argv[2];

try {
    const wcagResults = JSON.parse(fs.readFileSync(`${outputDir}/wcag-results.json`, 'utf8'));
    const scoreReport = JSON.parse(fs.readFileSync(`${outputDir}/accessibility-score.json`, 'utf8'));
    
    let guideContent = `# Accessibility Remediation Guide\n\n`;
    guideContent += `**Generated**: ${new Date().toLocaleString()}\n`;
    guideContent += `**Overall Score**: ${scoreReport.scores.overall}/100\n`;
    guideContent += `**Compliance Level**: ${scoreReport.complianceLevel}\n\n`;
    
    if (wcagResults.violations.length === 0) {
        guideContent += `🎉 **Congratulations!** No WCAG violations found.\n\n`;
        guideContent += `## Maintenance Recommendations\n\n`;
        guideContent += `1. **Regular Testing**: Run accessibility tests with each deployment\n`;
        guideContent += `2. **User Testing**: Include users with disabilities in testing process\n`;
        guideContent += `3. **Team Training**: Ensure team understands accessibility principles\n`;
        guideContent += `4. **Documentation**: Maintain accessibility guidelines for new features\n\n`;
    } else {
        guideContent += `## Priority Fixes Needed\n\n`;
        
        // Group violations by priority
        const critical = wcagResults.violations.filter(v => v.impact === 'critical');
        const serious = wcagResults.violations.filter(v => v.impact === 'serious');
        const moderate = wcagResults.violations.filter(v => v.impact === 'moderate');
        const minor = wcagResults.violations.filter(v => v.impact === 'minor');
        
        if (critical.length > 0) {
            guideContent += `### 🚨 Critical Issues (Fix Immediately)\n\n`;
            critical.forEach((violation, index) => {
                guideContent += `#### ${index + 1}. ${violation.help}\n`;
                guideContent += `- **Elements affected**: ${violation.nodes.length}\n`;
                guideContent += `- **Fix**: ${violation.description}\n`;
                guideContent += `- **Learn more**: [${violation.id}](${violation.helpUrl})\n\n`;
            });
        }
        
        if (serious.length > 0) {
            guideContent += `### ⚠️ Serious Issues (Fix Soon)\n\n`;
            serious.forEach((violation, index) => {
                guideContent += `#### ${index + 1}. ${violation.help}\n`;
                guideContent += `- **Elements affected**: ${violation.nodes.length}\n`;
                guideContent += `- **Fix**: ${violation.description}\n`;
                guideContent += `- **Learn more**: [${violation.id}](${violation.helpUrl})\n\n`;
            });
        }
        
        if (moderate.length > 0) {
            guideContent += `### 📋 Moderate Issues (Address in Next Sprint)\n\n`;
            moderate.forEach((violation, index) => {
                guideContent += `#### ${index + 1}. ${violation.help}\n`;
                guideContent += `- **Elements affected**: ${violation.nodes.length}\n`;
                guideContent += `- **Fix**: ${violation.description}\n`;
                guideContent += `- **Learn more**: [${violation.id}](${violation.helpUrl})\n\n`;
            });
        }
        
        if (minor.length > 0) {
            guideContent += `### 💡 Minor Issues (Enhancement Opportunities)\n\n`;
            minor.forEach((violation, index) => {
                guideContent += `#### ${index + 1}. ${violation.help}\n`;
                guideContent += `- **Elements affected**: ${violation.nodes.length}\n`;
                guideContent += `- **Fix**: ${violation.description}\n`;
                guideContent += `- **Learn more**: [${violation.id}](${violation.helpUrl})\n\n`;
            });
        }
    }
    
    // Add general best practices
    guideContent += `## Best Practices Checklist\n\n`;
    guideContent += `### Semantic HTML\n`;
    guideContent += `- [ ] Use proper heading hierarchy (h1 → h2 → h3)\n`;
    guideContent += `- [ ] Use semantic elements (nav, main, section, article)\n`;
    guideContent += `- [ ] Use lists for grouped items\n`;
    guideContent += `- [ ] Use buttons for actions, links for navigation\n\n`;
    
    guideContent += `### Keyboard Navigation\n`;
    guideContent += `- [ ] All interactive elements are focusable\n`;
    guideContent += `- [ ] Focus indicators are visible\n`;
    guideContent += `- [ ] Tab order is logical\n`;
    guideContent += `- [ ] No keyboard traps\n\n`;
    
    guideContent += `### Images and Media\n`;
    guideContent += `- [ ] All images have appropriate alt text\n`;
    guideContent += `- [ ] Decorative images have empty alt or role="presentation"\n`;
    guideContent += `- [ ] Videos have captions\n`;
    guideContent += `- [ ] Audio has transcripts\n\n`;
    
    guideContent += `### Forms\n`;
    guideContent += `- [ ] All inputs have associated labels\n`;
    guideContent += `- [ ] Error messages are descriptive\n`;
    guideContent += `- [ ] Required fields are indicated\n`;
    guideContent += `- [ ] Form validation is accessible\n\n`;
    
    guideContent += `### Color and Contrast\n`;
    guideContent += `- [ ] Text has sufficient contrast ratio (4.5:1 for normal, 3:1 for large)\n`;
    guideContent += `- [ ] Information isn't conveyed by color alone\n`;
    guideContent += `- [ ] Focus indicators are high contrast\n\n`;
    
    guideContent += `## Testing Tools\n\n`;
    guideContent += `### Automated Testing\n`;
    guideContent += `- **axe DevTools**: Browser extension for quick checks\n`;
    guideContent += `- **Lighthouse**: Built into Chrome DevTools\n`;
    guideContent += `- **WAVE**: Web accessibility evaluation tool\n\n`;
    
    guideContent += `### Manual Testing\n`;
    guideContent += `- **Keyboard Navigation**: Tab through entire page\n`;
    guideContent += `- **Screen Reader**: Test with NVDA, JAWS, or VoiceOver\n`;
    guideContent += `- **Zoom**: Test at 200% zoom level\n`;
    guideContent += `- **Color Blindness**: Use color blindness simulators\n\n`;
    
    guideContent += `## Resources\n\n`;
    guideContent += `- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)\n`;
    guideContent += `- [WebAIM Accessibility Guide](https://webaim.org/)\n`;
    guideContent += `- [A11y Project Checklist](https://www.a11yproject.com/checklist/)\n`;
    guideContent += `- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)\n`;
    
    fs.writeFileSync(`${outputDir}/remediation-guide.md`, guideContent);
    console.log('✅ Remediation guide generated');
    
} catch (error) {
    console.error('Error generating remediation guide:', error.message);
}
EOF "$output_dir"
}
```

## Command Interface

```bash
# Parse command line arguments
URL="http://localhost:3000"
OUTPUT_FORMAT="markdown"
RULES="wcag2a,wcag2aa,wcag21aa"

while [[ $# -gt 0 ]]; do
    case $1 in
        --url)
            URL="$2"
            shift 2
            ;;
        --output-format)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        --rules)
            RULES="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute accessibility testing
echo "🚀 Starting accessibility testing for: $URL"

# Create output directory
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="tests/reports/accessibility/run-$TIMESTAMP"
mkdir -p "$OUTPUT_DIR"

initialize_accessibility_testing

if run_wcag_compliance_test "$URL" "$OUTPUT_DIR"; then
    echo "✅ WCAG compliance test completed"
    TEST_PASSED=true
else
    echo "❌ WCAG compliance test failed"
    TEST_PASSED=false
fi

calculate_accessibility_score "$OUTPUT_DIR"
generate_remediation_guide "$OUTPUT_DIR"

echo ""
echo "🎯 ACCESSIBILITY TESTING COMPLETE!"
echo ""
echo "📊 Results directory: $OUTPUT_DIR"
echo "📄 Full report: $OUTPUT_DIR/accessibility-report.md"
echo "🔧 Remediation guide: $OUTPUT_DIR/remediation-guide.md"
echo "📈 Score details: $OUTPUT_DIR/accessibility-score.json"
echo ""

if [ "$TEST_PASSED" = true ]; then
    echo "✅ Accessibility testing passed!"
    exit 0
else
    echo "❌ Accessibility violations found. Check the remediation guide."
    exit 1
fi
```

## Integration Points

### Work Validator Integration
- Accessibility scores feed into overall quality metrics
- WCAG compliance tracked in validation reports
- Remediation recommendations included in improvement plans

### Browser Testing Integration
- Runs as part of comprehensive browser test suite
- Results included in browser testing reports
- Accessibility project configuration in Playwright

### CI/CD Integration
- Automated accessibility testing in deployment pipeline
- Compliance gates for production releases
- Historical tracking of accessibility scores

## Key Features

1. **WCAG 2.1 AA Compliance** - Comprehensive standard validation
2. **Keyboard Navigation** - Tab order and focus management testing
3. **Screen Reader Compatibility** - Semantic structure validation
4. **Color Contrast** - Automated contrast ratio checking
5. **Score Calculation** - Quantitative accessibility assessment
6. **Remediation Guidance** - Actionable improvement recommendations
7. **Multiple Output Formats** - Markdown, JSON, HTML reports
8. **Historical Tracking** - Score trends over time

The Accessibility Tester Agent ensures comprehensive accessibility validation with detailed remediation guidance for creating inclusive web applications.