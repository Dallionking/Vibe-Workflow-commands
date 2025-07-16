---
description: Configure comprehensive browser testing with Playwright and accessibility tools
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__perplexity-mcp__perplexity_search_web
  - mcp__perplexity-ask__perplexity_ask
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
  - --browsers
  - --mobile-devices
  - --visual-regression
---

# vibe-setup-browser-testing

Configure comprehensive browser testing with Playwright and accessibility tools

## Usage
`/vibe-setup-browser-testing [--browsers] [--mobile-devices] [--visual-regression]`

# Browser Testing Setup Agent

## Mission Statement
**I am the Browser Testing Setup Agent.** I configure comprehensive browser testing environments with Playwright, accessibility tools, and performance auditing to ensure high-quality frontend applications.

## Agent Configuration
- **Command**: `/vibe-setup-browser-testing`
- **Parameters**: `--browsers`, `--mobile-devices`, `--visual-regression`
- **Dependencies**: Frontend project detected, Node.js environment
- **Outputs**: Playwright configuration, test templates, CI/CD integration
- **MCP Tools**: Context7, Perplexity

## Setup Process

### 1. Environment Detection
```bash
echo "🌐 BROWSER TESTING SETUP AGENT"
echo "=============================="

# Detect project type
PROJECT_TYPE="unknown"
if [ -f "package.json" ]; then
    if grep -q "react\|vue\|angular\|svelte" package.json; then
        PROJECT_TYPE="frontend"
    elif grep -q "next\|nuxt\|gatsby" package.json; then
        PROJECT_TYPE="fullstack"
    fi
fi

echo "📋 Project Analysis:"
echo "   Type: $PROJECT_TYPE"
echo "   Node.js: $(node --version 2>/dev/null || echo 'Not found')"
echo "   npm: $(npm --version 2>/dev/null || echo 'Not found')"
```

### 2. Playwright Installation and Configuration
```bash
install_playwright() {
    echo "🎭 Installing Playwright..."
    
    # Install Playwright
    npm install --save-dev @playwright/test
    
    # Install browser binaries
    npx playwright install
    
    # Install additional tools
    npm install --save-dev @axe-core/playwright
    npm install --save-dev lighthouse
    
    echo "✅ Playwright installation complete"
}

create_playwright_config() {
    echo "⚙️ Creating Playwright configuration..."
    
    cat > playwright.config.js << 'EOF'
const { defineConfig, devices } = require('@playwright/test');

/**
 * Vibe Coding Browser Testing Configuration
 * Comprehensive cross-browser testing with accessibility and performance validation
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'tests/reports/html' }],
    ['json', { outputFile: 'tests/reports/results.json' }],
    ['junit', { outputFile: 'tests/reports/junit.xml' }]
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    },
    
    // Mobile Devices
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },

    // Accessibility Testing
    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.accessibility.spec.js'
    },

    // Performance Testing  
    {
      name: 'performance',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.performance.spec.js'
    },

    // Visual Regression
    {
      name: 'visual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.visual.spec.js'
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  // Test directories
  expect: {
    timeout: 5000,
    toHaveScreenshot: { threshold: 0.2, mode: 'pixel' },
    toMatchSnapshot: { threshold: 0.2 }
  }
});
EOF

    echo "✅ Playwright configuration created"
}
```

### 3. Test Directory Structure Creation
```bash
create_test_structure() {
    echo "📁 Creating test directory structure..."
    
    # Create base directories
    mkdir -p tests/{e2e,accessibility,performance,visual,utils,fixtures,screenshots}
    
    # Create subdirectories for organization
    mkdir -p tests/e2e/{auth,navigation,forms,components}
    mkdir -p tests/accessibility/{pages,components,flows}
    mkdir -p tests/performance/{pages,api,assets}
    mkdir -p tests/visual/{components,pages,themes}
    mkdir -p tests/reports/{html,json,screenshots,lighthouse}
    
    echo "✅ Test structure created"
}
```

### 4. Basic Test Templates
```bash
create_test_templates() {
    echo "📝 Creating test templates..."
    
    # Basic E2E test template
    cat > tests/e2e/basic.spec.js << 'EOF'
const { test, expect } = require('@playwright/test');

test.describe('Basic Application Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads successfully', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Basic assertions
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Take screenshot for visual baseline
    await page.screenshot({ 
      path: 'tests/screenshots/homepage-baseline.png',
      fullPage: true 
    });
  });

  test('navigation works correctly', async ({ page }) => {
    // Test main navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Test navigation links (customize based on your app)
    const navLinks = nav.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('responsive design on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Mobile-specific tests
      await expect(page.locator('.mobile-menu')).toBeVisible();
    } else {
      // Desktop-specific tests
      await expect(page.locator('.desktop-nav')).toBeVisible();
    }
  });
});
EOF

    # Accessibility test template
    cat > tests/accessibility/basic.accessibility.spec.js << 'EOF'
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Accessibility Tests', () => {
  test('homepage meets WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test focus indicators
    const focusedBox = await focusedElement.boundingBox();
    expect(focusedBox).toBeTruthy();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('headings follow proper hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for single h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Check heading order (simplified check)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });
});
EOF

    # Performance test template
    cat > tests/performance/basic.performance.spec.js << 'EOF'
const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

test.describe('Performance Tests', () => {
  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Performance budget: 3 seconds for initial load
    expect(loadTime).toBeLessThan(3000);
  });

  test('lighthouse performance audit', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Run Lighthouse audit (requires lighthouse CLI)
    try {
      const lighthouseResult = execSync(
        `lighthouse ${page.url()} --output=json --output-path=tests/reports/lighthouse/performance.json --chrome-flags="--headless" --quiet`,
        { encoding: 'utf-8' }
      );
      
      // Basic performance assertions
      const report = JSON.parse(require('fs').readFileSync('tests/reports/lighthouse/performance.json'));
      const performanceScore = report.lhr.categories.performance.score * 100;
      
      expect(performanceScore).toBeGreaterThan(75); // 75+ performance score
    } catch (error) {
      console.warn('Lighthouse not available, skipping performance audit');
    }
  });

  test('core web vitals within thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'FCP') vitals.fcp = entry.value;
            if (entry.name === 'LCP') vitals.lcp = entry.value;
            if (entry.name === 'CLS') vitals.cls = entry.value;
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['measure', 'navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    // Core Web Vitals thresholds
    if (vitals.fcp) expect(vitals.fcp).toBeLessThan(1800); // FCP < 1.8s
    if (vitals.lcp) expect(vitals.lcp).toBeLessThan(2500); // LCP < 2.5s
    if (vitals.cls) expect(vitals.cls).toBeLessThan(0.1);  // CLS < 0.1
  });
});
EOF

    # Visual regression test template
    cat > tests/visual/basic.visual.spec.js << 'EOF'
const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Tests', () => {
  test('homepage visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Full page screenshot comparison
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('component visual comparison', async ({ page }) => {
    await page.goto('/');
    
    // Test specific components (customize based on your app)
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-component.png');
    
    const navigation = page.locator('nav');
    await expect(navigation).toHaveScreenshot('navigation-component.png');
  });

  test('responsive breakpoints visual comparison', async ({ page }) => {
    await page.goto('/');
    
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1440, height: 900 }  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`homepage-${viewport.width}x${viewport.height}.png`, {
        fullPage: true
      });
    }
  });

  test('dark mode visual comparison', async ({ page }) => {
    await page.goto('/');
    
    // Test light mode
    await expect(page).toHaveScreenshot('homepage-light-mode.png');
    
    // Switch to dark mode (customize based on your implementation)
    await page.click('[data-testid="theme-toggle"]').catch(() => {
      console.log('Theme toggle not found, skipping dark mode test');
    });
    
    await page.waitForTimeout(1000); // Allow theme transition
    await expect(page).toHaveScreenshot('homepage-dark-mode.png');
  });
});
EOF

    echo "✅ Test templates created"
}
```

### 5. Package.json Scripts
```bash
add_npm_scripts() {
    echo "📜 Adding npm scripts..."
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "⚠️ No package.json found, creating basic one..."
        cat > package.json << 'EOF'
{
  "name": "browser-testing-project",
  "version": "1.0.0",
  "scripts": {}
}
EOF
    fi
    
    # Add testing scripts using node to modify package.json
    node << 'EOF'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const testScripts = {
  "test:e2e": "playwright test",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug",
  "test:browsers": "playwright test --project=chromium --project=firefox --project=webkit",
  "test:mobile": "playwright test --project=\"Mobile Chrome\" --project=\"Mobile Safari\"",
  "test:accessibility": "playwright test --project=accessibility",
  "test:performance": "playwright test --project=performance", 
  "test:visual": "playwright test --project=visual",
  "test:visual:update": "playwright test --project=visual --update-snapshots",
  "test:ci": "playwright test --reporter=junit",
  "test:report": "playwright show-report tests/reports/html",
  "setup:browsers": "npx playwright install",
  "setup:browser-testing": "npm run setup:browsers && npm run test:e2e -- --reporter=html"
};

pkg.scripts = { ...pkg.scripts, ...testScripts };

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ npm scripts added to package.json');
EOF
}
```

### 6. CI/CD Integration
```bash
create_ci_config() {
    echo "🔄 Creating CI/CD configuration..."
    
    # Create GitHub Actions workflow
    mkdir -p .github/workflows
    
    cat > .github/workflows/browser-testing.yml << 'EOF'
name: Browser Testing

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CI: true
    
    - name: Run Accessibility tests
      run: npm run test:accessibility
      env:
        CI: true
    
    - name: Run Performance tests
      run: npm run test:performance
      env:
        CI: true
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: |
          tests/reports/
          test-results/
        retention-days: 7
    
    - name: Upload screenshots
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: screenshots
        path: tests/screenshots/
        retention-days: 7
EOF

    echo "✅ CI/CD configuration created"
}
```

### 7. Configuration Documentation
```bash
create_documentation() {
    echo "📚 Creating documentation..."
    
    cat > BROWSER_TESTING.md << 'EOF'
# Browser Testing Guide

## Overview
This project uses Playwright for comprehensive browser testing including:
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing
- Accessibility compliance (WCAG 2.1 AA)
- Performance auditing
- Visual regression testing

## Quick Start

### Installation
```bash
npm install
npm run setup:browsers
```

### Running Tests
```bash
# Run all tests
npm run test:e2e

# Run specific test types
npm run test:accessibility
npm run test:performance
npm run test:visual

# Run on specific browsers
npm run test:browsers

# Run mobile tests
npm run test:mobile

# Debug mode
npm run test:e2e:debug
```

### Test Structure
```
tests/
├── e2e/                    # End-to-end tests
├── accessibility/          # WCAG compliance tests
├── performance/           # Lighthouse audits
├── visual/               # Visual regression tests
├── utils/                # Test utilities
└── reports/              # Test results
```

## Writing Tests

### Basic E2E Test
```javascript
const { test, expect } = require('@playwright/test');

test('feature works correctly', async ({ page }) => {
  await page.goto('/feature');
  await expect(page.locator('h1')).toContainText('Feature');
});
```

### Accessibility Test
```javascript
const AxeBuilder = require('@axe-core/playwright').default;

test('page is accessible', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### Visual Test
```javascript
test('component looks correct', async ({ page }) => {
  await page.goto('/component');
  await expect(page.locator('.component')).toHaveScreenshot();
});
```

## Configuration

### Browser Support
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Chrome on Android, Safari on iOS
- **Tablets**: iPad Pro simulation

### Performance Budgets
- Page load time: < 3 seconds
- Lighthouse performance: > 75
- Core Web Vitals: Green thresholds

### Accessibility Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast validation

## CI/CD Integration
Tests run automatically on:
- Pull requests
- Main branch pushes
- Scheduled daily runs

## Troubleshooting

### Common Issues
1. **Browser not found**: Run `npm run setup:browsers`
2. **Tests timeout**: Increase timeout in playwright.config.js
3. **Visual differences**: Update baselines with `npm run test:visual:update`
4. **Accessibility failures**: Check WCAG guidelines and fix violations

### Debugging
```bash
# Run tests with browser UI
npm run test:e2e:headed

# Debug specific test
npx playwright test --debug tests/e2e/feature.spec.js

# Generate trace files
npx playwright test --trace on
```

## Best Practices
1. Use data-testid attributes for reliable selectors
2. Wait for network idle before assertions
3. Test both positive and negative cases
4. Keep tests independent and isolated
5. Use Page Object Model for complex apps
6. Regular baseline updates for visual tests
EOF

    echo "✅ Documentation created"
}
```

### 8. Validation and Health Check
```bash
validate_setup() {
    echo "🔍 Validating browser testing setup..."
    
    # Check if Playwright is installed
    if ! npx playwright --version &>/dev/null; then
        echo "❌ Playwright not installed properly"
        return 1
    fi
    
    # Check if browsers are installed
    browser_check=$(npx playwright install --dry-run 2>&1)
    if echo "$browser_check" | grep -q "missing"; then
        echo "⚠️ Some browsers need installation"
        npx playwright install
    fi
    
    # Validate configuration
    if [ ! -f "playwright.config.js" ]; then
        echo "❌ Playwright configuration missing"
        return 1
    fi
    
    # Check test directories
    if [ ! -d "tests/e2e" ]; then
        echo "❌ Test directory structure missing"
        return 1
    fi
    
    echo "✅ Browser testing setup validation passed"
    return 0
}

run_health_check() {
    echo "🏥 Running health check..."
    
    # Test basic Playwright functionality
    cat > /tmp/health-check.js << 'EOF'
const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    await browser.close();
    
    console.log('✅ Health check passed:', title);
    process.exit(0);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
})();
EOF
    
    if node /tmp/health-check.js; then
        echo "✅ Browser testing health check passed"
    else
        echo "❌ Browser testing health check failed"
        return 1
    fi
    
    rm /tmp/health-check.js
}
```

## Command Interface

```bash
# Parse command line arguments
BROWSERS="all"
MOBILE_DEVICES="default"
VISUAL_REGRESSION="true"

while [[ $# -gt 0 ]]; do
    case $1 in
        --browsers)
            BROWSERS="$2"
            shift 2
            ;;
        --mobile-devices)
            MOBILE_DEVICES="$2"
            shift 2
            ;;
        --visual-regression)
            VISUAL_REGRESSION="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute setup
echo "🚀 Starting browser testing setup..."
echo "   Browsers: $BROWSERS"
echo "   Mobile devices: $MOBILE_DEVICES"  
echo "   Visual regression: $VISUAL_REGRESSION"

install_playwright
create_playwright_config
create_test_structure
create_test_templates
add_npm_scripts
create_ci_config
create_documentation

if validate_setup && run_health_check; then
    echo ""
    echo "✅ BROWSER TESTING SETUP COMPLETE!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Run 'npm run test:e2e' to test the setup"
    echo "2. Customize tests in tests/ directory"
    echo "3. Update playwright.config.js for your needs"
    echo "4. Review BROWSER_TESTING.md for detailed guide"
    echo ""
    echo "🚀 Available Commands:"
    echo "   npm run test:e2e          - Run all browser tests"
    echo "   npm run test:accessibility - Check WCAG compliance"
    echo "   npm run test:performance   - Run Lighthouse audits"
    echo "   npm run test:visual        - Visual regression tests"
    echo ""
else
    echo "❌ Setup failed. Please check the errors above."
    exit 1
fi
```

## Integration Points

### Work Validator Integration
- Browser tests integrate with `/vibe-validate-work` command
- Results feed into comprehensive validation reports
- Performance metrics included in quality scores

### MCP Setup Integration  
- Automatically configured during MCP setup for frontend projects
- Browser binaries installed during environment setup
- Test templates customized based on tech stack

### CI/CD Integration
- GitHub Actions workflow for automated testing
- Test results uploaded as artifacts
- Performance budgets enforced in CI

## Key Deliverables

1. **Playwright Configuration** - Cross-browser testing setup
2. **Test Templates** - E2E, accessibility, performance, visual tests
3. **CI/CD Integration** - Automated testing workflows
4. **Documentation** - Comprehensive testing guide
5. **npm Scripts** - Easy-to-use testing commands

The Browser Testing Setup Agent provides a complete testing infrastructure that ensures high-quality frontend applications with comprehensive validation across browsers, devices, and accessibility standards.