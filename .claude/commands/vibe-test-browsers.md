---
description: Run comprehensive browser testing suite across all configured browsers
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
  - --browser
  - --headless
  - --mobile
  - --visual
  - --accessibility
---

# vibe-test-browsers

Run comprehensive browser testing suite across all configured browsers

## Usage
`/vibe-test-browsers [--browser] [--headless] [--mobile] [--visual] [--accessibility]`

# Browser Test Runner Agent

## Mission Statement
**I am the Browser Test Runner Agent.** I execute comprehensive browser testing suites across multiple browsers, devices, and testing scenarios with detailed reporting and analysis.

## Agent Configuration
- **Command**: `/vibe-test-browsers`
- **Parameters**: `--browser`, `--headless`, `--mobile`, `--visual`, `--accessibility`
- **Dependencies**: Playwright setup, test files, development server
- **Outputs**: Test results, screenshots, accessibility reports, performance metrics
- **MCP Tools**: Context7

## Execution Framework

### 1. Pre-Test Validation
```bash
echo "🧪 BROWSER TEST RUNNER AGENT"
echo "============================"

validate_environment() {
    echo "🔍 Validating test environment..."
    
    # Check Playwright installation
    if ! npx playwright --version &>/dev/null; then
        echo "❌ Playwright not installed. Run /vibe-setup-browser-testing first."
        exit 1
    fi
    
    # Check test files exist
    if [ ! -d "tests" ]; then
        echo "❌ No tests directory found. Run /vibe-setup-browser-testing first."
        exit 1
    fi
    
    # Check if development server is running
    if ! curl -s http://localhost:3000 &>/dev/null; then
        echo "⚠️ Development server not running on localhost:3000"
        echo "   Start your dev server before running tests"
        return 1
    fi
    
    echo "✅ Environment validation passed"
    return 0
}
```

### 2. Test Configuration
```bash
configure_test_run() {
    local browser="$1"
    local headless="$2"
    local mobile="$3"
    local visual="$4"
    local accessibility="$5"
    
    echo "⚙️ Configuring test run..."
    echo "   Browser: $browser"
    echo "   Headless: $headless"
    echo "   Mobile: $mobile"
    echo "   Visual: $visual"
    echo "   Accessibility: $accessibility"
    
    # Build Playwright command arguments
    PLAYWRIGHT_ARGS=""
    
    # Browser selection
    case "$browser" in
        "chrome"|"chromium")
            PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=chromium"
            ;;
        "firefox")
            PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=firefox"
            ;;
        "safari"|"webkit")
            PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=webkit"
            ;;
        "edge")
            PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=edge"
            ;;
        "all")
            PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=chromium --project=firefox --project=webkit --project=edge"
            ;;
    esac
    
    # Mobile testing
    if [ "$mobile" = "true" ]; then
        PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=\"Mobile Chrome\" --project=\"Mobile Safari\""
    fi
    
    # Visual regression
    if [ "$visual" = "true" ]; then
        PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=visual"
    fi
    
    # Accessibility testing
    if [ "$accessibility" = "true" ]; then
        PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --project=accessibility"
    fi
    
    # Headless mode
    if [ "$headless" = "true" ]; then
        PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --headed=false"
    else
        PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --headed"
    fi
    
    # Output configuration
    PLAYWRIGHT_ARGS="$PLAYWRIGHT_ARGS --reporter=html,json,junit"
    
    echo "   Command args: $PLAYWRIGHT_ARGS"
}
```

### 3. Test Execution Engine
```bash
execute_test_suite() {
    echo "🚀 Executing browser test suite..."
    
    # Create results directory with timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    RESULTS_DIR="tests/reports/run-$TIMESTAMP"
    mkdir -p "$RESULTS_DIR"
    
    # Start test execution
    echo "📋 Test Run Details:"
    echo "   Start time: $(date)"
    echo "   Results dir: $RESULTS_DIR"
    echo "   Command: npx playwright test $PLAYWRIGHT_ARGS"
    
    # Execute tests with timeout
    timeout 600 npx playwright test $PLAYWRIGHT_ARGS \
        --output-dir="$RESULTS_DIR" \
        --reporter=html:"$RESULTS_DIR/html",json:"$RESULTS_DIR/results.json",junit:"$RESULTS_DIR/junit.xml" \
        2>&1 | tee "$RESULTS_DIR/execution.log"
    
    TEST_EXIT_CODE=$?
    
    echo "   End time: $(date)"
    echo "   Exit code: $TEST_EXIT_CODE"
    
    return $TEST_EXIT_CODE
}
```

### 4. Results Analysis
```bash
analyze_test_results() {
    local results_dir="$1"
    
    echo "📊 Analyzing test results..."
    
    # Parse JSON results if available
    if [ -f "$results_dir/results.json" ]; then
        # Use node to parse JSON results
        node << EOF
const fs = require('fs');
const results = JSON.parse(fs.readFileSync('$results_dir/results.json', 'utf8'));

console.log('\\n📈 TEST RESULTS SUMMARY');
console.log('========================');
console.log('Total tests:', results.suites.reduce((acc, suite) => acc + suite.tests.length, 0));
console.log('Passed:', results.suites.reduce((acc, suite) => 
    acc + suite.tests.filter(test => test.outcome === 'expected').length, 0));
console.log('Failed:', results.suites.reduce((acc, suite) => 
    acc + suite.tests.filter(test => test.outcome === 'unexpected').length, 0));
console.log('Skipped:', results.suites.reduce((acc, suite) => 
    acc + suite.tests.filter(test => test.outcome === 'skipped').length, 0));
console.log('Duration:', Math.round(results.stats.duration / 1000) + 's');

// Analyze by project/browser
const projectResults = {};
results.suites.forEach(suite => {
    suite.tests.forEach(test => {
        test.results.forEach(result => {
            const project = result.workerIndex || 'unknown';
            if (!projectResults[project]) {
                projectResults[project] = { passed: 0, failed: 0, total: 0 };
            }
            projectResults[project].total++;
            if (result.status === 'passed') {
                projectResults[project].passed++;
            } else {
                projectResults[project].failed++;
            }
        });
    });
});

console.log('\\n🌐 BROWSER RESULTS');
console.log('==================');
Object.entries(projectResults).forEach(([project, stats]) => {
    const passRate = Math.round((stats.passed / stats.total) * 100);
    console.log(\`\${project}: \${stats.passed}/\${stats.total} (\${passRate}%)\`);
});

EOF
    else
        echo "⚠️ JSON results not found, using basic analysis"
        
        # Count test files executed
        local total_tests=$(find tests -name "*.spec.js" | wc -l)
        echo "   Test files found: $total_tests"
        
        # Check exit code
        if [ $TEST_EXIT_CODE -eq 0 ]; then
            echo "   Overall result: ✅ PASSED"
        else
            echo "   Overall result: ❌ FAILED"
        fi
    fi
}
```

### 5. Screenshot and Artifact Management
```bash
process_artifacts() {
    local results_dir="$1"
    
    echo "📸 Processing test artifacts..."
    
    # Copy screenshots
    if [ -d "test-results" ]; then
        echo "   Moving screenshots..."
        cp -r test-results/* "$results_dir/" 2>/dev/null || true
    fi
    
    # Process visual regression results
    if [ -d "tests/screenshots" ]; then
        echo "   Processing visual regression artifacts..."
        cp -r tests/screenshots "$results_dir/visual-regression" 2>/dev/null || true
    fi
    
    # Compress large artifacts
    cd "$results_dir"
    if [ -d "videos" ]; then
        echo "   Compressing videos..."
        tar -czf videos.tar.gz videos/ && rm -rf videos/
    fi
    
    if [ -d "traces" ]; then
        echo "   Compressing traces..."
        tar -czf traces.tar.gz traces/ && rm -rf traces/
    fi
    
    cd - > /dev/null
    
    echo "✅ Artifacts processed"
}
```

### 6. Performance Metrics Collection
```bash
collect_performance_metrics() {
    local results_dir="$1"
    
    echo "⚡ Collecting performance metrics..."
    
    # Create performance report
    cat > "$results_dir/performance-summary.md" << EOF
# Performance Test Summary

## Test Run: $(date)

### Lighthouse Scores
EOF
    
    # Look for Lighthouse reports
    if [ -d "tests/reports/lighthouse" ]; then
        for report in tests/reports/lighthouse/*.json; do
            if [ -f "$report" ]; then
                echo "   Processing Lighthouse report: $report"
                
                # Extract key metrics using node
                node << JSEOF
const fs = require('fs');
try {
    const report = JSON.parse(fs.readFileSync('$report', 'utf8'));
    const categories = report.lhr.categories;
    
    console.log(\`- **Performance**: \${Math.round(categories.performance.score * 100)}/100\`);
    console.log(\`- **Accessibility**: \${Math.round(categories.accessibility.score * 100)}/100\`);
    console.log(\`- **Best Practices**: \${Math.round(categories['best-practices'].score * 100)}/100\`);
    console.log(\`- **SEO**: \${Math.round(categories.seo.score * 100)}/100\`);
} catch (error) {
    console.log('Error processing report:', error.message);
}
JSEOF
            fi
        done >> "$results_dir/performance-summary.md"
    fi
    
    echo "✅ Performance metrics collected"
}
```

### 7. Accessibility Report Generation
```bash
generate_accessibility_report() {
    local results_dir="$1"
    
    echo "♿ Generating accessibility report..."
    
    # Create accessibility summary
    cat > "$results_dir/accessibility-summary.md" << EOF
# Accessibility Test Summary

## Test Run: $(date)

### WCAG 2.1 AA Compliance Results
EOF
    
    # Parse accessibility test results
    if [ -f "$results_dir/results.json" ]; then
        node << JSEOF
const fs = require('fs');
try {
    const results = JSON.parse(fs.readFileSync('$results_dir/results.json', 'utf8'));
    
    // Find accessibility test results
    const accessibilityTests = results.suites
        .flatMap(suite => suite.tests)
        .filter(test => test.title.toLowerCase().includes('accessibility') || 
                       test.location.file.includes('accessibility'));
    
    console.log(\`### Summary\`);
    console.log(\`- Total accessibility tests: \${accessibilityTests.length}\`);
    
    const passed = accessibilityTests.filter(test => 
        test.results.some(result => result.status === 'passed')).length;
    const failed = accessibilityTests.filter(test => 
        test.results.some(result => result.status === 'failed')).length;
    
    console.log(\`- Passed: \${passed}\`);
    console.log(\`- Failed: \${failed}\`);
    console.log(\`- Success rate: \${Math.round((passed / accessibilityTests.length) * 100)}%\`);
    
    if (failed > 0) {
        console.log(\`\\n### Failed Tests\`);
        accessibilityTests
            .filter(test => test.results.some(result => result.status === 'failed'))
            .forEach(test => {
                console.log(\`- ❌ \${test.title}\`);
            });
    }
    
} catch (error) {
    console.log('No accessibility test results found');
}
JSEOF
    fi >> "$results_dir/accessibility-summary.md"
    
    echo "✅ Accessibility report generated"
}
```

### 8. Report Generation
```bash
generate_comprehensive_report() {
    local results_dir="$1"
    
    echo "📄 Generating comprehensive test report..."
    
    cat > "$results_dir/test-report.md" << EOF
# Browser Testing Report

**Generated**: $(date)
**Test Run ID**: $(basename "$results_dir")

## Quick Summary
EOF
    
    # Overall pass/fail status
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo "**Status**: ✅ PASSED" >> "$results_dir/test-report.md"
    else
        echo "**Status**: ❌ FAILED" >> "$results_dir/test-report.md"
    fi
    
    cat >> "$results_dir/test-report.md" << EOF

## Test Configuration
- **Browsers**: $BROWSER
- **Headless**: $HEADLESS
- **Mobile**: $MOBILE
- **Visual**: $VISUAL  
- **Accessibility**: $ACCESSIBILITY

## Detailed Results

### Test Execution
EOF
    
    # Include execution log snippet
    if [ -f "$results_dir/execution.log" ]; then
        echo "\`\`\`" >> "$results_dir/test-report.md"
        tail -20 "$results_dir/execution.log" >> "$results_dir/test-report.md"
        echo "\`\`\`" >> "$results_dir/test-report.md"
    fi
    
    # Include performance summary if available
    if [ -f "$results_dir/performance-summary.md" ]; then
        cat "$results_dir/performance-summary.md" >> "$results_dir/test-report.md"
    fi
    
    # Include accessibility summary if available  
    if [ -f "$results_dir/accessibility-summary.md" ]; then
        cat "$results_dir/accessibility-summary.md" >> "$results_dir/test-report.md"
    fi
    
    cat >> "$results_dir/test-report.md" << EOF

## Artifacts
- **HTML Report**: [View Results](./html/index.html)
- **JSON Results**: [results.json](./results.json)
- **JUnit XML**: [junit.xml](./junit.xml)

## Next Steps
EOF
    
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        cat >> "$results_dir/test-report.md" << EOF
✅ All tests passed! Consider:
- Running performance tests if not included
- Checking accessibility compliance
- Updating visual regression baselines if needed
EOF
    else
        cat >> "$results_dir/test-report.md" << EOF
❌ Some tests failed. Recommended actions:
1. Review failed test details in HTML report
2. Check screenshots for visual failures
3. Fix failing tests and re-run
4. Consider updating test selectors if UI changed
EOF
    fi
    
    echo "✅ Comprehensive report generated"
}
```

## Command Interface

```bash
# Parse command line arguments
BROWSER="all"
HEADLESS="true"
MOBILE="false"
VISUAL="false"
ACCESSIBILITY="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        --browser)
            BROWSER="$2"
            shift 2
            ;;
        --headless)
            HEADLESS="$2"
            shift 2
            ;;
        --mobile)
            MOBILE="true"
            shift
            ;;
        --visual)
            VISUAL="true"
            shift
            ;;
        --accessibility)
            ACCESSIBILITY="true"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute test runner
echo "🚀 Starting browser test execution..."

if validate_environment; then
    configure_test_run "$BROWSER" "$HEADLESS" "$MOBILE" "$VISUAL" "$ACCESSIBILITY"
    
    RESULTS_DIR=$(execute_test_suite)
    
    analyze_test_results "$RESULTS_DIR"
    process_artifacts "$RESULTS_DIR"
    collect_performance_metrics "$RESULTS_DIR"
    generate_accessibility_report "$RESULTS_DIR"
    generate_comprehensive_report "$RESULTS_DIR"
    
    echo ""
    echo "🎯 TEST EXECUTION COMPLETE!"
    echo ""
    echo "📊 Results available at: $RESULTS_DIR"
    echo "📄 View HTML report: $RESULTS_DIR/html/index.html"
    echo "📋 Full report: $RESULTS_DIR/test-report.md"
    echo ""
    
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo "✅ All tests passed successfully!"
    else
        echo "❌ Some tests failed. Check the reports for details."
    fi
    
    echo ""
    echo "🔧 Quick Commands:"
    echo "   npx playwright show-report $RESULTS_DIR/html"
    echo "   cat $RESULTS_DIR/test-report.md"
    
    exit $TEST_EXIT_CODE
else
    echo "❌ Environment validation failed"
    exit 1
fi
```

## Usage Examples

### Basic Cross-Browser Testing
```bash
/vibe-test-browsers
```

### Specific Browser Testing
```bash
/vibe-test-browsers --browser chrome
/vibe-test-browsers --browser firefox
```

### Mobile Testing
```bash
/vibe-test-browsers --mobile
```

### Comprehensive Testing
```bash
/vibe-test-browsers --mobile --visual --accessibility
```

### Debug Mode (Non-Headless)
```bash
/vibe-test-browsers --headless false --browser chrome
```

## Integration Points

### Work Validator Integration
- Results feed into comprehensive validation pipeline
- Performance metrics included in quality scores
- Accessibility compliance tracked in validation reports

### CI/CD Integration
- Designed for automated execution in GitHub Actions
- JUnit XML output for CI system integration
- Artifact uploading for result preservation

### MCP Tools Integration
- Context7 for documentation and best practices
- Research capabilities for troubleshooting failures

## Key Features

1. **Multi-Browser Support** - Chrome, Firefox, Safari, Edge
2. **Mobile Testing** - iOS and Android device simulation
3. **Comprehensive Reporting** - HTML, JSON, JUnit formats
4. **Performance Tracking** - Lighthouse integration
5. **Accessibility Validation** - WCAG 2.1 AA compliance
6. **Visual Regression** - Screenshot comparison
7. **Artifact Management** - Screenshots, videos, traces
8. **CI/CD Ready** - Automated execution support

The Browser Test Runner Agent provides robust test execution with detailed analysis and reporting for comprehensive frontend application validation.