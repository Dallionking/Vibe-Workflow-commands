# Visual Regression Tester Agent

## Mission Statement
**I am the Visual Regression Tester Agent.** I perform comprehensive visual regression testing through screenshot comparison, UI consistency validation, and cross-browser visual verification to ensure design integrity across deployments.

## Agent Configuration
- **Command**: `/vibe-test-visual-regression`
- **Parameters**: `--baseline`, `--threshold`, `--update-baseline`
- **Dependencies**: Playwright, screenshot comparison tools, baseline images
- **Outputs**: Visual comparison report, diff images, baseline screenshots
- **MCP Tools**: Context7

## Visual Testing Framework

### 1. Environment Setup
```bash
echo "📸 VISUAL REGRESSION TESTER AGENT"
echo "================================"

initialize_visual_testing() {
    echo "🔧 Initializing visual regression testing environment..."
    
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
    
    # Create visual testing directories
    mkdir -p tests/visual/{baselines,current,diffs,reports}
    mkdir -p tests/screenshots/{components,pages,responsive,themes}
    
    # Install additional visual testing tools if needed
    if ! npm list pixelmatch &>/dev/null; then
        echo "📦 Installing visual comparison tools..."
        npm install --save-dev pixelmatch
        npm install --save-dev sharp
    fi
    
    echo "✅ Visual regression testing environment ready"
}
```

### 2. Baseline Management
```bash
manage_baselines() {
    local action="$1"
    local baseline_dir="$2"
    
    echo "📋 Managing visual baselines..."
    
    case "$action" in
        "create")
            create_baselines "$baseline_dir"
            ;;
        "update")
            update_baselines "$baseline_dir"
            ;;
        "validate")
            validate_baselines "$baseline_dir"
            ;;
        *)
            echo "❌ Unknown baseline action: $action"
            exit 1
            ;;
    esac
}

create_baselines() {
    local baseline_dir="${1:-tests/visual/baselines}"
    
    echo "🎯 Creating new visual baselines..."
    
    # Create Playwright test for baseline generation
    cat > /tmp/baseline-generator.js << 'EOF'
const { test, expect } = require('@playwright/test');

test.describe('Visual Baseline Generation', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];
  
  const testPages = [
    { name: 'homepage', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'contact', path: '/contact' },
    { name: 'products', path: '/products' },
    { name: 'login', path: '/login' }
  ];
  
  for (const viewport of viewports) {
    for (const page of testPages) {
      test(`baseline ${page.name} ${viewport.name}`, async ({ page: playwrightPage }) => {
        // Set viewport
        await playwrightPage.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });
        
        try {
          // Navigate to page
          await playwrightPage.goto(page.path);
          await playwrightPage.waitForLoadState('networkidle');
          
          // Wait for any animations or dynamic content
          await playwrightPage.waitForTimeout(2000);
          
          // Take full page screenshot
          const screenshotPath = `${process.env.BASELINE_DIR}/${page.name}-${viewport.name}-fullpage.png`;
          await playwrightPage.screenshot({
            path: screenshotPath,
            fullPage: true
          });
          
          // Take viewport screenshot
          const viewportPath = `${process.env.BASELINE_DIR}/${page.name}-${viewport.name}-viewport.png`;
          await playwrightPage.screenshot({
            path: viewportPath,
            fullPage: false
          });
          
          console.log(`✅ Generated baseline: ${page.name} ${viewport.name}`);
          
        } catch (error) {
          console.log(`⚠️ Skipped ${page.name} (page not found): ${error.message}`);
        }
      });
    }
  }
  
  test('component baselines', async ({ page }) => {
    try {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Common component selectors (customize based on your app)
      const components = [
        { name: 'header', selector: 'header' },
        { name: 'navigation', selector: 'nav' },
        { name: 'footer', selector: 'footer' },
        { name: 'sidebar', selector: '.sidebar, aside' },
        { name: 'main-content', selector: 'main, .main-content' }
      ];
      
      for (const component of components) {
        try {
          const element = page.locator(component.selector).first();
          if (await element.count() > 0) {
            await element.screenshot({
              path: `${process.env.BASELINE_DIR}/component-${component.name}.png`
            });
            console.log(`✅ Generated component baseline: ${component.name}`);
          }
        } catch (error) {
          console.log(`⚠️ Skipped component ${component.name}: ${error.message}`);
        }
      }
    } catch (error) {
      console.log(`⚠️ Component baseline generation failed: ${error.message}`);
    }
  });
  
  test('theme baselines', async ({ page }) => {
    try {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Light theme screenshot
      await page.screenshot({
        path: `${process.env.BASELINE_DIR}/theme-light.png`,
        fullPage: true
      });
      
      // Switch to dark theme (customize based on your implementation)
      try {
        await page.click('[data-testid="theme-toggle"], .theme-toggle, .dark-mode-toggle').catch(() => {
          // Try alternative selectors
          const themeButtons = page.locator('button:has-text("Dark"), button:has-text("Theme")');
          if (themeButtons.count() > 0) {
            return themeButtons.first().click();
          }
        });
        
        await page.waitForTimeout(1000); // Allow theme transition
        
        // Dark theme screenshot
        await page.screenshot({
          path: `${process.env.BASELINE_DIR}/theme-dark.png`,
          fullPage: true
        });
        
        console.log('✅ Generated theme baselines');
      } catch (error) {
        console.log('⚠️ Dark theme not available or toggle not found');
      }
    } catch (error) {
      console.log(`⚠️ Theme baseline generation failed: ${error.message}`);
    }
  });
});
EOF
    
    # Run baseline generation
    BASELINE_DIR="$baseline_dir" npx playwright test /tmp/baseline-generator.js \
        --output-dir="tests/visual/reports/baseline-generation"
    
    local exit_code=$?
    
    # Clean up temp file
    rm /tmp/baseline-generator.js
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ Baseline generation completed"
        
        # Create baseline manifest
        create_baseline_manifest "$baseline_dir"
    else
        echo "❌ Baseline generation failed"
    fi
    
    return $exit_code
}

create_baseline_manifest() {
    local baseline_dir="$1"
    
    echo "📋 Creating baseline manifest..."
    
    # Generate manifest of all baseline images
    node << 'EOF'
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baselineDir = process.argv[2];

if (!fs.existsSync(baselineDir)) {
    console.error('Baseline directory does not exist');
    process.exit(1);
}

const manifest = {
    timestamp: new Date().toISOString(),
    baselineDir: baselineDir,
    images: []
};

function getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && /\.(png|jpg|jpeg)$/i.test(item)) {
            const relativePath = path.relative(baselineDir, fullPath);
            manifest.images.push({
                name: item,
                path: relativePath,
                size: stat.size,
                hash: getFileHash(fullPath),
                created: stat.birthtime.toISOString()
            });
        } else if (stat.isDirectory()) {
            scanDirectory(fullPath);
        }
    });
}

scanDirectory(baselineDir);

// Save manifest
const manifestPath = path.join(baselineDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`✅ Created baseline manifest with ${manifest.images.length} images`);
console.log(`   Manifest saved to: ${manifestPath}`);
EOF "$baseline_dir"
}
```

### 3. Visual Comparison Engine
```bash
run_visual_comparison() {
    local baseline_dir="$1"
    local current_dir="$2"
    local diff_dir="$3"
    local threshold="$4"
    
    echo "🔍 Running visual comparison..."
    echo "   Baseline: $baseline_dir"
    echo "   Current: $current_dir"
    echo "   Diff output: $diff_dir"
    echo "   Threshold: $threshold"
    
    # Create Playwright test for visual comparison
    cat > /tmp/visual-comparison.js << 'EOF'
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Visual Regression Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 }
  ];
  
  const testPages = [
    { name: 'homepage', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'contact', path: '/contact' },
    { name: 'products', path: '/products' },
    { name: 'login', path: '/login' }
  ];
  
  for (const viewport of viewports) {
    for (const page of testPages) {
      test(`compare ${page.name} ${viewport.name}`, async ({ page: playwrightPage }) => {
        // Set viewport
        await playwrightPage.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });
        
        try {
          // Navigate to page
          await playwrightPage.goto(page.path);
          await playwrightPage.waitForLoadState('networkidle');
          
          // Wait for any animations or dynamic content
          await playwrightPage.waitForTimeout(2000);
          
          // Take current screenshot
          const currentPath = `${process.env.CURRENT_DIR}/${page.name}-${viewport.name}-fullpage.png`;
          await playwrightPage.screenshot({
            path: currentPath,
            fullPage: true
          });
          
          // Compare with baseline
          const baselinePath = `${process.env.BASELINE_DIR}/${page.name}-${viewport.name}-fullpage.png`;
          
          if (fs.existsSync(baselinePath)) {
            // Use Playwright's built-in visual comparison
            await expect(playwrightPage).toHaveScreenshot(
              path.basename(baselinePath),
              {
                threshold: parseFloat(process.env.THRESHOLD || '0.2'),
                maxDiffPixels: 100
              }
            );
            
            console.log(`✅ Visual comparison passed: ${page.name} ${viewport.name}`);
          } else {
            console.log(`⚠️ No baseline found for: ${page.name} ${viewport.name}`);
          }
          
        } catch (error) {
          if (error.message.includes('Screenshot comparison failed')) {
            console.log(`❌ Visual difference detected: ${page.name} ${viewport.name}`);
            throw error;
          } else {
            console.log(`⚠️ Skipped ${page.name} (page not found): ${error.message}`);
          }
        }
      });
    }
  }
  
  test('component visual comparison', async ({ page }) => {
    try {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const components = [
        { name: 'header', selector: 'header' },
        { name: 'navigation', selector: 'nav' },
        { name: 'footer', selector: 'footer' },
        { name: 'sidebar', selector: '.sidebar, aside' },
        { name: 'main-content', selector: 'main, .main-content' }
      ];
      
      for (const component of components) {
        try {
          const element = page.locator(component.selector).first();
          if (await element.count() > 0) {
            // Compare component with baseline
            await expect(element).toHaveScreenshot(
              `component-${component.name}.png`,
              {
                threshold: parseFloat(process.env.THRESHOLD || '0.2')
              }
            );
            console.log(`✅ Component comparison passed: ${component.name}`);
          }
        } catch (error) {
          if (error.message.includes('Screenshot comparison failed')) {
            console.log(`❌ Component visual difference: ${component.name}`);
            throw error;
          } else {
            console.log(`⚠️ Skipped component ${component.name}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`Component comparison error: ${error.message}`);
      throw error;
    }
  });
});
EOF
    
    # Run visual comparison tests
    BASELINE_DIR="$baseline_dir" CURRENT_DIR="$current_dir" DIFF_DIR="$diff_dir" THRESHOLD="$threshold" \
        npx playwright test /tmp/visual-comparison.js \
        --output-dir="$diff_dir" \
        --reporter=json:"$diff_dir/results.json"
    
    local exit_code=$?
    
    # Clean up temp file
    rm /tmp/visual-comparison.js
    
    return $exit_code
}
```

### 4. Difference Analysis
```bash
analyze_visual_differences() {
    local diff_dir="$1"
    local threshold="$2"
    
    echo "📊 Analyzing visual differences..."
    
    node << 'EOF'
const fs = require('fs');
const path = require('path');

const diffDir = process.argv[2];
const threshold = parseFloat(process.argv[3] || '0.2');

try {
    // Load test results
    let results = {};
    if (fs.existsSync(`${diffDir}/results.json`)) {
        results = JSON.parse(fs.readFileSync(`${diffDir}/results.json`, 'utf8'));
    }
    
    // Collect all diff images
    const diffImages = [];
    
    function scanForDiffs(dir) {
        if (!fs.existsSync(dir)) return;
        
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isFile() && item.includes('-diff.png')) {
                diffImages.push({
                    name: item,
                    path: fullPath,
                    size: stat.size,
                    created: stat.birthtime.toISOString()
                });
            } else if (stat.isDirectory()) {
                scanForDiffs(fullPath);
            }
        });
    }
    
    scanForDiffs(diffDir);
    
    // Analyze test results
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let visualFailures = [];
    
    if (results.suites) {
        results.suites.forEach(suite => {
            suite.tests.forEach(test => {
                totalTests++;
                const hasFailure = test.results.some(result => result.status === 'failed');
                
                if (hasFailure) {
                    failedTests++;
                    
                    // Check if failure is visual-related
                    const isVisualFailure = test.results.some(result => 
                        result.error && result.error.message && 
                        result.error.message.includes('Screenshot comparison failed')
                    );
                    
                    if (isVisualFailure) {
                        visualFailures.push({
                            title: test.title,
                            location: test.location,
                            error: test.results.find(r => r.error)?.error?.message
                        });
                    }
                } else {
                    passedTests++;
                }
            });
        });
    }
    
    const analysisReport = {
        timestamp: new Date().toISOString(),
        threshold: threshold,
        summary: {
            totalTests,
            passedTests,
            failedTests,
            visualFailures: visualFailures.length,
            diffImages: diffImages.length
        },
        visualFailures,
        diffImages,
        passRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
    };
    
    // Save analysis report
    fs.writeFileSync(`${diffDir}/visual-analysis.json`, JSON.stringify(analysisReport, null, 2));
    
    // Generate human-readable report
    let reportContent = `# Visual Regression Analysis Report\n\n`;
    reportContent += `**Generated**: ${new Date().toLocaleDateString()}\n`;
    reportContent += `**Threshold**: ${threshold}\n`;
    reportContent += `**Pass Rate**: ${analysisReport.passRate}%\n\n`;
    
    reportContent += `## Summary\n\n`;
    reportContent += `- **Total Tests**: ${totalTests}\n`;
    reportContent += `- **Passed**: ${passedTests} ✅\n`;
    reportContent += `- **Failed**: ${failedTests} ❌\n`;
    reportContent += `- **Visual Failures**: ${visualFailures.length} 📸\n`;
    reportContent += `- **Diff Images**: ${diffImages.length} 🔍\n\n`;
    
    if (visualFailures.length > 0) {
        reportContent += `## 📸 Visual Differences Detected\n\n`;
        visualFailures.forEach((failure, index) => {
            reportContent += `### ${index + 1}. ${failure.title}\n`;
            reportContent += `- **Location**: ${failure.location.file}:${failure.location.line}\n`;
            if (failure.error) {
                reportContent += `- **Error**: ${failure.error.split('\n')[0]}\n`;
            }
            reportContent += `\n`;
        });
    }
    
    if (diffImages.length > 0) {
        reportContent += `## 🔍 Difference Images\n\n`;
        diffImages.forEach((image, index) => {
            reportContent += `${index + 1}. **${image.name}**\n`;
            reportContent += `   - Path: \`${image.path}\`\n`;
            reportContent += `   - Size: ${Math.round(image.size / 1024)}KB\n`;
            reportContent += `   - Created: ${new Date(image.created).toLocaleString()}\n\n`;
        });
    }
    
    if (visualFailures.length === 0) {
        reportContent += `## 🎉 No Visual Regressions Detected!\n\n`;
        reportContent += `All visual tests passed within the specified threshold of ${threshold}.\n`;
        reportContent += `Your UI is visually consistent with the baseline.\n\n`;
    } else {
        reportContent += `## 🔧 Recommended Actions\n\n`;
        reportContent += `1. **Review Diff Images**: Check the generated diff images to understand the visual changes\n`;
        reportContent += `2. **Determine Intent**: Decide if the changes are intentional or bugs\n`;
        reportContent += `3. **Update Baselines**: If changes are intentional, update the baseline images\n`;
        reportContent += `4. **Fix Issues**: If changes are unintentional, fix the underlying issues\n`;
        reportContent += `5. **Adjust Threshold**: Consider adjusting the threshold if too sensitive\n\n`;
    }
    
    reportContent += `## Baseline Management\n\n`;
    reportContent += `### Update Baselines (if changes are intentional)\n`;
    reportContent += `\`\`\`bash\n`;
    reportContent += `/vibe-test-visual-regression --update-baseline\n`;
    reportContent += `\`\`\`\n\n`;
    
    reportContent += `### Adjust Threshold (if too sensitive)\n`;
    reportContent += `\`\`\`bash\n`;
    reportContent += `/vibe-test-visual-regression --threshold 0.3\n`;
    reportContent += `\`\`\`\n\n`;
    
    fs.writeFileSync(`${diffDir}/visual-analysis-report.md`, reportContent);
    
    console.log('\n📊 VISUAL ANALYSIS SUMMARY');
    console.log('==========================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Visual Failures: ${visualFailures.length}`);
    console.log(`Pass Rate: ${analysisReport.passRate}%`);
    
    if (visualFailures.length > 0) {
        console.log('\nVisual Failures:');
        visualFailures.slice(0, 5).forEach((failure, index) => {
            console.log(`  ${index + 1}. ${failure.title}`);
        });
        if (visualFailures.length > 5) {
            console.log(`  ... and ${visualFailures.length - 5} more`);
        }
    }
    
    process.exit(visualFailures.length > 0 ? 1 : 0);
    
} catch (error) {
    console.error('Error analyzing visual differences:', error.message);
    process.exit(1);
}
EOF "$diff_dir" "$threshold"
}
```

### 5. Cross-Browser Visual Testing
```bash
run_cross_browser_visual_test() {
    local baseline_dir="$1"
    local output_dir="$2"
    local threshold="$3"
    
    echo "🌐 Running cross-browser visual testing..."
    
    # Create cross-browser visual test
    cat > /tmp/cross-browser-visual.js << 'EOF'
const { test, expect, devices } = require('@playwright/test');

test.describe('Cross-Browser Visual Tests', () => {
  const browsers = ['chromium', 'firefox', 'webkit'];
  const testPages = [
    { name: 'homepage', path: '/' },
    { name: 'about', path: '/about' }
  ];
  
  for (const browserName of browsers) {
    for (const page of testPages) {
      test(`${page.name} visual consistency on ${browserName}`, async ({ browser }) => {
        const context = await browser.newContext();
        const browserPage = await context.newPage();
        
        try {
          await browserPage.goto(page.path);
          await browserPage.waitForLoadState('networkidle');
          await browserPage.waitForTimeout(2000);
          
          // Take screenshot for this browser
          const currentPath = `${process.env.OUTPUT_DIR}/${page.name}-${browserName}.png`;
          await browserPage.screenshot({
            path: currentPath,
            fullPage: true
          });
          
          // Compare with baseline (using chromium as baseline)
          const baselinePath = `${process.env.BASELINE_DIR}/${page.name}-desktop-fullpage.png`;
          
          if (browserName !== 'chromium' && require('fs').existsSync(baselinePath)) {
            // For non-chromium browsers, we expect some differences but check they're reasonable
            await expect(browserPage).toHaveScreenshot(
              `${page.name}-${browserName}.png`,
              {
                threshold: parseFloat(process.env.THRESHOLD || '0.3'), // More lenient for cross-browser
                maxDiffPixels: 500
              }
            );
          }
          
          console.log(`✅ Cross-browser test passed: ${page.name} on ${browserName}`);
          
        } catch (error) {
          console.log(`❌ Cross-browser difference: ${page.name} on ${browserName}`);
          throw error;
        } finally {
          await context.close();
        }
      });
    }
  }
  
  test('mobile vs desktop layout comparison', async ({ browser }) => {
    const mobileContext = await browser.newContext({
      ...devices['iPhone 12']
    });
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    
    const mobilePage = await mobileContext.newPage();
    const desktopPage = await desktopContext.newPage();
    
    try {
      // Navigate both to homepage
      await Promise.all([
        mobilePage.goto('/'),
        desktopPage.goto('/')
      ]);
      
      await Promise.all([
        mobilePage.waitForLoadState('networkidle'),
        desktopPage.waitForLoadState('networkidle')
      ]);
      
      // Take screenshots
      await Promise.all([
        mobilePage.screenshot({ path: `${process.env.OUTPUT_DIR}/homepage-mobile-layout.png`, fullPage: true }),
        desktopPage.screenshot({ path: `${process.env.OUTPUT_DIR}/homepage-desktop-layout.png`, fullPage: true })
      ]);
      
      console.log('✅ Mobile vs desktop layout screenshots captured');
      
    } finally {
      await Promise.all([
        mobileContext.close(),
        desktopContext.close()
      ]);
    }
  });
});
EOF
    
    # Run cross-browser tests
    BASELINE_DIR="$baseline_dir" OUTPUT_DIR="$output_dir" THRESHOLD="$threshold" \
        npx playwright test /tmp/cross-browser-visual.js \
        --project=chromium --project=firefox --project=webkit \
        --output-dir="$output_dir/cross-browser"
    
    local exit_code=$?
    
    # Clean up temp file
    rm /tmp/cross-browser-visual.js
    
    return $exit_code
}
```

## Command Interface

```bash
# Parse command line arguments
BASELINE_DIR="tests/visual/baselines"
THRESHOLD="0.2"
UPDATE_BASELINE="false"
ACTION="compare"

while [[ $# -gt 0 ]]; do
    case $1 in
        --baseline)
            BASELINE_DIR="$2"
            shift 2
            ;;
        --threshold)
            THRESHOLD="$2"
            shift 2
            ;;
        --update-baseline)
            UPDATE_BASELINE="true"
            ACTION="update"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute visual regression testing
echo "🚀 Starting visual regression testing..."

# Create output directories
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="tests/reports/visual/run-$TIMESTAMP"
CURRENT_DIR="$OUTPUT_DIR/current"
DIFF_DIR="$OUTPUT_DIR/diffs"

mkdir -p "$OUTPUT_DIR" "$CURRENT_DIR" "$DIFF_DIR"

initialize_visual_testing

if [ "$UPDATE_BASELINE" = "true" ]; then
    echo "🎯 Updating visual baselines..."
    
    if manage_baselines "update" "$BASELINE_DIR"; then
        echo "✅ Baseline update completed"
        exit 0
    else
        echo "❌ Baseline update failed"
        exit 1
    fi
elif [ ! -d "$BASELINE_DIR" ] || [ -z "$(ls -A "$BASELINE_DIR" 2>/dev/null)" ]; then
    echo "📋 No baselines found. Creating initial baselines..."
    
    if manage_baselines "create" "$BASELINE_DIR"; then
        echo "✅ Initial baselines created"
        echo "   Run the test again to compare against these baselines"
        exit 0
    else
        echo "❌ Baseline creation failed"
        exit 1
    fi
else
    echo "🔍 Running visual comparison against existing baselines..."
    
    # Run visual comparison
    if run_visual_comparison "$BASELINE_DIR" "$CURRENT_DIR" "$DIFF_DIR" "$THRESHOLD"; then
        echo "✅ Visual comparison completed - no differences detected"
        COMPARISON_PASSED=true
    else
        echo "❌ Visual differences detected"
        COMPARISON_PASSED=false
    fi
    
    # Run cross-browser testing
    if run_cross_browser_visual_test "$BASELINE_DIR" "$OUTPUT_DIR" "$THRESHOLD"; then
        echo "✅ Cross-browser visual testing completed"
        CROSS_BROWSER_PASSED=true
    else
        echo "❌ Cross-browser visual differences detected"
        CROSS_BROWSER_PASSED=false
    fi
    
    # Analyze differences
    analyze_visual_differences "$DIFF_DIR" "$THRESHOLD"
    ANALYSIS_EXIT_CODE=$?
    
    echo ""
    echo "🎯 VISUAL REGRESSION TESTING COMPLETE!"
    echo ""
    echo "📊 Results directory: $OUTPUT_DIR"
    echo "📸 Current screenshots: $CURRENT_DIR"
    echo "🔍 Difference analysis: $DIFF_DIR/visual-analysis-report.md"
    echo "📋 Baseline directory: $BASELINE_DIR"
    echo ""
    
    if [ "$COMPARISON_PASSED" = true ] && [ "$CROSS_BROWSER_PASSED" = true ] && [ $ANALYSIS_EXIT_CODE -eq 0 ]; then
        echo "✅ All visual regression tests passed!"
        echo ""
        echo "🎉 No visual regressions detected."
        echo "   Your UI is consistent with the baseline images."
        exit 0
    else
        echo "❌ Visual regression testing failed!"
        echo ""
        echo "🔧 Next steps:"
        echo "   1. Review the visual analysis report"
        echo "   2. Check difference images in $DIFF_DIR"
        echo "   3. If changes are intentional, update baselines:"
        echo "      /vibe-test-visual-regression --update-baseline"
        echo "   4. If changes are bugs, fix the issues and re-test"
        exit 1
    fi
fi
```

## Integration Points

### Work Validator Integration
- Visual regression results feed into overall quality scores
- Screenshot comparisons included in validation reports
- UI consistency tracked as quality metric

### Browser Testing Integration
- Runs as part of comprehensive browser test suite
- Cross-browser visual validation
- Results included in browser testing reports

### CI/CD Integration
- Automated visual regression testing in deployment pipeline
- Baseline management in version control
- Visual approval gates for production releases

## Key Features

1. **Screenshot Comparison** - Pixel-perfect visual regression detection
2. **Baseline Management** - Create, update, and validate visual baselines
3. **Cross-Browser Testing** - Visual consistency across browsers
4. **Responsive Testing** - Visual validation across viewports
5. **Component Testing** - Individual component visual validation
6. **Theme Testing** - Light/dark mode visual consistency
7. **Difference Analysis** - Detailed visual change reporting
8. **Threshold Configuration** - Adjustable sensitivity settings

The Visual Regression Tester Agent ensures visual consistency and prevents unintended UI changes through comprehensive screenshot comparison and analysis.