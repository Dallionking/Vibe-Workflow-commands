# Performance Tester Agent

## Mission Statement
**I am the Performance Tester Agent.** I conduct comprehensive Lighthouse performance audits, Core Web Vitals analysis, and performance budget validation to ensure optimal web application performance.

## Agent Configuration
- **Command**: `/vibe-test-performance`
- **Parameters**: `--url`, `--device`, `--throttling`, `--budget`
- **Dependencies**: Lighthouse, Playwright, performance monitoring tools
- **Outputs**: Lighthouse report, performance metrics, optimization recommendations
- **MCP Tools**: Context7

## Performance Testing Framework

### 1. Environment Setup
```bash
echo "⚡ PERFORMANCE TESTER AGENT"
echo "=========================="

initialize_performance_testing() {
    echo "🔧 Initializing performance testing environment..."
    
    # Check required tools
    check_dependencies() {
        local missing_deps=()
        
        if ! command -v npx &> /dev/null; then
            missing_deps+=("Node.js/npm")
        fi
        
        if ! command -v lighthouse &> /dev/null && ! npx lighthouse --version &>/dev/null; then
            missing_deps+=("Lighthouse")
        fi
        
        if [ ${#missing_deps[@]} -gt 0 ]; then
            echo "❌ Missing dependencies: ${missing_deps[*]}"
            echo "   Installing required tools..."
            
            # Install Lighthouse if missing
            npm install -g lighthouse
        fi
    }
    
    check_dependencies
    
    # Install additional performance testing tools
    if ! npm list web-vitals &>/dev/null; then
        echo "📦 Installing performance testing tools..."
        npm install --save-dev web-vitals
        npm install --save-dev playwright
    fi
    
    echo "✅ Performance testing environment ready"
}
```

### 2. Lighthouse Performance Audit
```bash
run_lighthouse_audit() {
    local url="$1"
    local device="$2"
    local throttling="$3"
    local output_dir="$4"
    
    echo "🏃 Running Lighthouse performance audit..."
    echo "   URL: $url"
    echo "   Device: $device"
    echo "   Throttling: $throttling"
    
    # Configure Lighthouse settings based on device
    local lighthouse_config=""
    local device_flags=""
    
    case "$device" in
        "mobile")
            device_flags="--preset=perf --form-factor=mobile --throttling-method=devtools"
            ;;
        "desktop")
            device_flags="--preset=perf --form-factor=desktop --throttling-method=devtools"
            ;;
        *)
            device_flags="--preset=perf"
            ;;
    esac
    
    # Configure throttling
    case "$throttling" in
        "slow-3g")
            device_flags="$device_flags --throttling.rttMs=300 --throttling.throughputKbps=700"
            ;;
        "regular-3g")
            device_flags="$device_flags --throttling.rttMs=150 --throttling.throughputKbps=1600"
            ;;
        "fast-3g")
            device_flags="$device_flags --throttling.rttMs=150 --throttling.throughputKbps=3000"
            ;;
        "none")
            device_flags="$device_flags --throttling-method=provided"
            ;;
    esac
    
    # Run Lighthouse audit
    lighthouse "$url" \
        --output=html,json \
        --output-path="$output_dir/lighthouse-report" \
        --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage" \
        $device_flags \
        --quiet
    
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo "✅ Lighthouse audit completed successfully"
        
        # Parse and display key metrics
        if [ -f "$output_dir/lighthouse-report.json" ]; then
            node << 'EOF'
const fs = require('fs');
const report = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const metrics = report.lhr.audits;
const categories = report.lhr.categories;

console.log('\n📊 LIGHTHOUSE PERFORMANCE RESULTS');
console.log('==================================');
console.log(`Performance Score: ${Math.round(categories.performance.score * 100)}/100`);
console.log(`Accessibility Score: ${Math.round(categories.accessibility.score * 100)}/100`);
console.log(`Best Practices Score: ${Math.round(categories['best-practices'].score * 100)}/100`);
console.log(`SEO Score: ${Math.round(categories.seo.score * 100)}/100`);

console.log('\n⚡ CORE WEB VITALS');
console.log('==================');
if (metrics['first-contentful-paint']) {
    console.log(`First Contentful Paint: ${metrics['first-contentful-paint'].displayValue}`);
}
if (metrics['largest-contentful-paint']) {
    console.log(`Largest Contentful Paint: ${metrics['largest-contentful-paint'].displayValue}`);
}
if (metrics['cumulative-layout-shift']) {
    console.log(`Cumulative Layout Shift: ${metrics['cumulative-layout-shift'].displayValue}`);
}
if (metrics['speed-index']) {
    console.log(`Speed Index: ${metrics['speed-index'].displayValue}`);
}
if (metrics['total-blocking-time']) {
    console.log(`Total Blocking Time: ${metrics['total-blocking-time'].displayValue}`);
}

console.log('\n🔍 DETAILED METRICS');
console.log('===================');
if (metrics['first-meaningful-paint']) {
    console.log(`First Meaningful Paint: ${metrics['first-meaningful-paint'].displayValue}`);
}
if (metrics['time-to-interactive']) {
    console.log(`Time to Interactive: ${metrics['time-to-interactive'].displayValue}`);
}
if (metrics['server-response-time']) {
    console.log(`Server Response Time: ${metrics['server-response-time'].displayValue}`);
}
EOF "$output_dir/lighthouse-report.json"
        fi
    else
        echo "❌ Lighthouse audit failed"
    fi
    
    return $exit_code
}
```

### 3. Core Web Vitals Testing
```bash
run_core_web_vitals_test() {
    local url="$1"
    local output_dir="$2"
    
    echo "📈 Running Core Web Vitals test..."
    
    # Create Playwright test for Core Web Vitals
    cat > /tmp/core-web-vitals-test.js << 'EOF'
const { test, expect } = require('@playwright/test');

test.describe('Core Web Vitals Tests', () => {
  test('measure core web vitals', async ({ page }) => {
    // Navigate to page
    await page.goto(process.env.TEST_URL);
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Inject Web Vitals library
    await page.addScriptTag({
      url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js'
    });
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitalsData = {};
        let reportedCount = 0;
        const expectedVitals = 3; // LCP, FID, CLS
        
        function sendToAnalytics(metric) {
          vitalsData[metric.name] = {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta
          };
          
          reportedCount++;
          if (reportedCount >= expectedVitals) {
            resolve(vitalsData);
          }
        }
        
        // Register listeners for each Core Web Vital
        webVitals.getLCP(sendToAnalytics);
        webVitals.getFID(sendToAnalytics);
        webVitals.getCLS(sendToAnalytics);
        
        // Also get FCP and TTFB
        webVitals.getFCP((metric) => {
          vitalsData[metric.name] = {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta
          };
        });
        
        webVitals.getTTFB((metric) => {
          vitalsData[metric.name] = {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta
          };
        });
        
        // Timeout fallback
        setTimeout(() => {
          resolve(vitalsData);
        }, 10000);
      });
    });
    
    // Calculate performance score based on Core Web Vitals
    let performanceScore = 100;
    let recommendations = [];
    
    // LCP Scoring (Largest Contentful Paint)
    if (vitals.LCP) {
      if (vitals.LCP.value > 4000) {
        performanceScore -= 30;
        recommendations.push('Optimize LCP: Consider image optimization, server response times, and render-blocking resources');
      } else if (vitals.LCP.value > 2500) {
        performanceScore -= 15;
        recommendations.push('Improve LCP: Focus on critical resource optimization');
      }
    }
    
    // FID Scoring (First Input Delay) 
    if (vitals.FID) {
      if (vitals.FID.value > 300) {
        performanceScore -= 25;
        recommendations.push('Optimize FID: Reduce JavaScript execution time and break up long tasks');
      } else if (vitals.FID.value > 100) {
        performanceScore -= 10;
        recommendations.push('Improve FID: Consider code splitting and reducing main thread work');
      }
    }
    
    // CLS Scoring (Cumulative Layout Shift)
    if (vitals.CLS) {
      if (vitals.CLS.value > 0.25) {
        performanceScore -= 25;
        recommendations.push('Fix CLS: Set dimensions for images/videos and avoid inserting content above existing content');
      } else if (vitals.CLS.value > 0.1) {
        performanceScore -= 10;
        recommendations.push('Improve CLS: Ensure proper size allocation for dynamic content');
      }
    }
    
    const results = {
      timestamp: new Date().toISOString(),
      url: process.env.TEST_URL,
      vitals,
      performanceScore: Math.max(0, performanceScore),
      recommendations,
      thresholds: {
        LCP: { good: 2500, needsImprovement: 4000 },
        FID: { good: 100, needsImprovement: 300 },
        CLS: { good: 0.1, needsImprovement: 0.25 }
      }
    };
    
    // Save results
    const fs = require('fs');
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/core-web-vitals.json',
      JSON.stringify(results, null, 2)
    );
    
    // Generate human-readable report
    let reportContent = `# Core Web Vitals Report\n\n`;
    reportContent += `**URL**: ${process.env.TEST_URL}\n`;
    reportContent += `**Test Date**: ${new Date().toLocaleDateString()}\n`;
    reportContent += `**Performance Score**: ${results.performanceScore}/100\n\n`;
    
    reportContent += `## Core Web Vitals Results\n\n`;
    
    Object.entries(vitals).forEach(([metric, data]) => {
      const emoji = data.rating === 'good' ? '✅' : data.rating === 'needs-improvement' ? '⚠️' : '❌';
      reportContent += `### ${emoji} ${metric}\n`;
      reportContent += `- **Value**: ${data.value}${metric === 'CLS' ? '' : 'ms'}\n`;
      reportContent += `- **Rating**: ${data.rating}\n\n`;
    });
    
    if (recommendations.length > 0) {
      reportContent += `## Optimization Recommendations\n\n`;
      recommendations.forEach((rec, index) => {
        reportContent += `${index + 1}. ${rec}\n`;
      });
      reportContent += `\n`;
    }
    
    reportContent += `## Performance Thresholds\n\n`;
    reportContent += `| Metric | Good | Needs Improvement | Poor |\n`;
    reportContent += `|--------|------|-------------------|------|\n`;
    reportContent += `| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |\n`;
    reportContent += `| FID | ≤ 100ms | ≤ 300ms | > 300ms |\n`;
    reportContent += `| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |\n\n`;
    
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/core-web-vitals-report.md',
      reportContent
    );
    
    console.log('\n📈 CORE WEB VITALS RESULTS');
    console.log('===========================');
    Object.entries(vitals).forEach(([metric, data]) => {
      const emoji = data.rating === 'good' ? '✅' : data.rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`${emoji} ${metric}: ${data.value}${metric === 'CLS' ? '' : 'ms'} (${data.rating})`);
    });
    
    // Performance budget assertions
    if (vitals.LCP && vitals.LCP.value > 4000) {
      throw new Error(`LCP (${vitals.LCP.value}ms) exceeds 4000ms threshold`);
    }
    if (vitals.FID && vitals.FID.value > 300) {
      throw new Error(`FID (${vitals.FID.value}ms) exceeds 300ms threshold`);
    }
    if (vitals.CLS && vitals.CLS.value > 0.25) {
      throw new Error(`CLS (${vitals.CLS.value}) exceeds 0.25 threshold`);
    }
  });
  
  test('network performance analysis', async ({ page }) => {
    const performanceEntries = [];
    
    // Listen for network events
    page.on('response', response => {
      performanceEntries.push({
        url: response.url(),
        status: response.status(),
        size: response.headers()['content-length'] || 0,
        type: response.headers()['content-type'] || 'unknown'
      });
    });
    
    await page.goto(process.env.TEST_URL);
    await page.waitForLoadState('networkidle');
    
    // Analyze network performance
    const totalRequests = performanceEntries.length;
    const failedRequests = performanceEntries.filter(entry => entry.status >= 400).length;
    const totalSize = performanceEntries.reduce((acc, entry) => acc + parseInt(entry.size || 0), 0);
    
    const networkAnalysis = {
      timestamp: new Date().toISOString(),
      totalRequests,
      failedRequests,
      totalSize,
      averageSize: Math.round(totalSize / totalRequests),
      requestsByType: {}
    };
    
    // Group by content type
    performanceEntries.forEach(entry => {
      const type = entry.type.split('/')[0] || 'other';
      if (!networkAnalysis.requestsByType[type]) {
        networkAnalysis.requestsByType[type] = { count: 0, size: 0 };
      }
      networkAnalysis.requestsByType[type].count++;
      networkAnalysis.requestsByType[type].size += parseInt(entry.size || 0);
    });
    
    const fs = require('fs');
    fs.writeFileSync(
      process.env.OUTPUT_DIR + '/network-analysis.json',
      JSON.stringify(networkAnalysis, null, 2)
    );
    
    console.log('\n🌐 NETWORK PERFORMANCE');
    console.log('======================');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Failed Requests: ${failedRequests}`);
    console.log(`Total Size: ${Math.round(totalSize / 1024)}KB`);
    console.log(`Average Size: ${Math.round(networkAnalysis.averageSize / 1024)}KB`);
    
    // Network performance assertions
    expect(failedRequests).toBe(0);
    expect(totalRequests).toBeLessThan(100); // Reasonable request limit
    expect(totalSize).toBeLessThan(5 * 1024 * 1024); // 5MB total size limit
  });
});
EOF
    
    # Run the Core Web Vitals test
    TEST_URL="$url" OUTPUT_DIR="$output_dir" npx playwright test /tmp/core-web-vitals-test.js \
        --reporter=json:"$output_dir/playwright-results.json" \
        --output-dir="$output_dir"
    
    local exit_code=$?
    
    # Clean up temp file
    rm /tmp/core-web-vitals-test.js
    
    return $exit_code
}
```

### 4. Performance Budget Validation
```bash
validate_performance_budget() {
    local output_dir="$1"
    local budget_config="$2"
    
    echo "💰 Validating performance budget..."
    
    # Default performance budget if not specified
    if [ -z "$budget_config" ]; then
        cat > /tmp/performance-budget.json << 'EOF'
{
  "budget": {
    "performance": {
      "lighthouse_score": 75,
      "first_contentful_paint": 1800,
      "largest_contentful_paint": 2500,
      "cumulative_layout_shift": 0.1,
      "total_blocking_time": 300,
      "speed_index": 3000
    },
    "network": {
      "total_requests": 100,
      "total_size_kb": 5000,
      "javascript_size_kb": 1000,
      "css_size_kb": 500,
      "image_size_kb": 2000
    },
    "accessibility": {
      "lighthouse_score": 95
    }
  }
}
EOF
        budget_config="/tmp/performance-budget.json"
    fi
    
    node << 'EOF'
const fs = require('fs');
const outputDir = process.argv[2];
const budgetConfigPath = process.argv[3];

try {
    // Load budget configuration
    const budgetConfig = JSON.parse(fs.readFileSync(budgetConfigPath, 'utf8'));
    const budget = budgetConfig.budget;
    
    // Load test results
    let lighthouseData = {};
    let vitalsData = {};
    let networkData = {};
    
    if (fs.existsSync(`${outputDir}/lighthouse-report.json`)) {
        const lighthouseReport = JSON.parse(fs.readFileSync(`${outputDir}/lighthouse-report.json`, 'utf8'));
        lighthouseData = {
            performance: Math.round(lighthouseReport.lhr.categories.performance.score * 100),
            accessibility: Math.round(lighthouseReport.lhr.categories.accessibility.score * 100),
            fcp: lighthouseReport.lhr.audits['first-contentful-paint']?.numericValue,
            lcp: lighthouseReport.lhr.audits['largest-contentful-paint']?.numericValue,
            cls: lighthouseReport.lhr.audits['cumulative-layout-shift']?.numericValue,
            tbt: lighthouseReport.lhr.audits['total-blocking-time']?.numericValue,
            speedIndex: lighthouseReport.lhr.audits['speed-index']?.numericValue
        };
    }
    
    if (fs.existsSync(`${outputDir}/core-web-vitals.json`)) {
        const vitalsReport = JSON.parse(fs.readFileSync(`${outputDir}/core-web-vitals.json`, 'utf8'));
        vitalsData = vitalsReport.vitals;
    }
    
    if (fs.existsSync(`${outputDir}/network-analysis.json`)) {
        networkData = JSON.parse(fs.readFileSync(`${outputDir}/network-analysis.json`, 'utf8'));
    }
    
    // Validate budget
    const violations = [];
    const warnings = [];
    
    // Performance budget validation
    if (budget.performance) {
        if (lighthouseData.performance && lighthouseData.performance < budget.performance.lighthouse_score) {
            violations.push(`Lighthouse Performance Score: ${lighthouseData.performance} < ${budget.performance.lighthouse_score}`);
        }
        
        if (lighthouseData.fcp && lighthouseData.fcp > budget.performance.first_contentful_paint) {
            violations.push(`First Contentful Paint: ${Math.round(lighthouseData.fcp)}ms > ${budget.performance.first_contentful_paint}ms`);
        }
        
        if (lighthouseData.lcp && lighthouseData.lcp > budget.performance.largest_contentful_paint) {
            violations.push(`Largest Contentful Paint: ${Math.round(lighthouseData.lcp)}ms > ${budget.performance.largest_contentful_paint}ms`);
        }
        
        if (lighthouseData.cls && lighthouseData.cls > budget.performance.cumulative_layout_shift) {
            violations.push(`Cumulative Layout Shift: ${lighthouseData.cls} > ${budget.performance.cumulative_layout_shift}`);
        }
    }
    
    // Network budget validation
    if (budget.network && networkData.totalRequests) {
        if (networkData.totalRequests > budget.network.total_requests) {
            warnings.push(`Total Requests: ${networkData.totalRequests} > ${budget.network.total_requests}`);
        }
        
        const totalSizeKb = Math.round(networkData.totalSize / 1024);
        if (totalSizeKb > budget.network.total_size_kb) {
            violations.push(`Total Size: ${totalSizeKb}KB > ${budget.network.total_size_kb}KB`);
        }
    }
    
    // Accessibility budget validation
    if (budget.accessibility && lighthouseData.accessibility) {
        if (lighthouseData.accessibility < budget.accessibility.lighthouse_score) {
            violations.push(`Lighthouse Accessibility Score: ${lighthouseData.accessibility} < ${budget.accessibility.lighthouse_score}`);
        }
    }
    
    const budgetReport = {
        timestamp: new Date().toISOString(),
        budget: budget,
        results: {
            lighthouse: lighthouseData,
            vitals: vitalsData,
            network: networkData
        },
        violations,
        warnings,
        passed: violations.length === 0
    };
    
    // Save budget report
    fs.writeFileSync(`${outputDir}/performance-budget-report.json`, JSON.stringify(budgetReport, null, 2));
    
    // Generate budget report
    let reportContent = `# Performance Budget Report\n\n`;
    reportContent += `**Generated**: ${new Date().toLocaleDateString()}\n`;
    reportContent += `**Status**: ${budgetReport.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
    reportContent += `**Violations**: ${violations.length}\n`;
    reportContent += `**Warnings**: ${warnings.length}\n\n`;
    
    if (violations.length > 0) {
        reportContent += `## 🚨 Budget Violations\n\n`;
        violations.forEach(violation => {
            reportContent += `- ❌ ${violation}\n`;
        });
        reportContent += `\n`;
    }
    
    if (warnings.length > 0) {
        reportContent += `## ⚠️ Budget Warnings\n\n`;
        warnings.forEach(warning => {
            reportContent += `- ⚠️ ${warning}\n`;
        });
        reportContent += `\n`;
    }
    
    if (violations.length === 0 && warnings.length === 0) {
        reportContent += `## 🎉 All Budget Targets Met!\n\n`;
        reportContent += `Your application meets all performance budget requirements.\n\n`;
    }
    
    reportContent += `## Budget vs Actual\n\n`;
    reportContent += `| Metric | Budget | Actual | Status |\n`;
    reportContent += `|--------|--------|--------|--------|\n`;
    
    if (budget.performance) {
        if (lighthouseData.performance) {
            const status = lighthouseData.performance >= budget.performance.lighthouse_score ? '✅' : '❌';
            reportContent += `| Lighthouse Performance | ${budget.performance.lighthouse_score} | ${lighthouseData.performance} | ${status} |\n`;
        }
        if (lighthouseData.fcp) {
            const status = lighthouseData.fcp <= budget.performance.first_contentful_paint ? '✅' : '❌';
            reportContent += `| First Contentful Paint | ${budget.performance.first_contentful_paint}ms | ${Math.round(lighthouseData.fcp)}ms | ${status} |\n`;
        }
        if (lighthouseData.lcp) {
            const status = lighthouseData.lcp <= budget.performance.largest_contentful_paint ? '✅' : '❌';
            reportContent += `| Largest Contentful Paint | ${budget.performance.largest_contentful_paint}ms | ${Math.round(lighthouseData.lcp)}ms | ${status} |\n`;
        }
    }
    
    fs.writeFileSync(`${outputDir}/performance-budget-report.md`, reportContent);
    
    console.log('\n💰 PERFORMANCE BUDGET VALIDATION');
    console.log('=================================');
    console.log(`Status: ${budgetReport.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Violations: ${violations.length}`);
    console.log(`Warnings: ${warnings.length}`);
    
    if (violations.length > 0) {
        console.log('\nViolations:');
        violations.forEach(violation => console.log(`  ❌ ${violation}`));
    }
    
    if (warnings.length > 0) {
        console.log('\nWarnings:');
        warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
    }
    
    process.exit(budgetReport.passed ? 0 : 1);
    
} catch (error) {
    console.error('Error validating performance budget:', error.message);
    process.exit(1);
}
EOF "$output_dir" "$budget_config"
}
```

### 5. Optimization Recommendations
```bash
generate_optimization_recommendations() {
    local output_dir="$1"
    
    echo "🔧 Generating optimization recommendations..."
    
    node << 'EOF'
const fs = require('fs');
const outputDir = process.argv[2];

try {
    // Load all performance data
    let lighthouseData = {};
    let vitalsData = {};
    let networkData = {};
    
    if (fs.existsSync(`${outputDir}/lighthouse-report.json`)) {
        const report = JSON.parse(fs.readFileSync(`${outputDir}/lighthouse-report.json`, 'utf8'));
        lighthouseData = report.lhr;
    }
    
    if (fs.existsSync(`${outputDir}/core-web-vitals.json`)) {
        vitalsData = JSON.parse(fs.readFileSync(`${outputDir}/core-web-vitals.json`, 'utf8'));
    }
    
    if (fs.existsSync(`${outputDir}/network-analysis.json`)) {
        networkData = JSON.parse(fs.readFileSync(`${outputDir}/network-analysis.json`, 'utf8'));
    }
    
    let recommendations = [];
    
    // Analyze Lighthouse opportunities
    if (lighthouseData.audits) {
        const opportunities = Object.entries(lighthouseData.audits)
            .filter(([key, audit]) => audit.score !== null && audit.score < 1)
            .sort((a, b) => (b[1].details?.overallSavingsMs || 0) - (a[1].details?.overallSavingsMs || 0))
            .slice(0, 10); // Top 10 opportunities
        
        opportunities.forEach(([key, audit]) => {
            if (audit.details?.overallSavingsMs > 100) {
                recommendations.push({
                    category: 'Performance',
                    priority: audit.details.overallSavingsMs > 1000 ? 'High' : 'Medium',
                    title: audit.title,
                    description: audit.description,
                    savings: `${Math.round(audit.details.overallSavingsMs)}ms`,
                    impact: audit.score < 0.5 ? 'High' : 'Medium'
                });
            }
        });
    }
    
    // Analyze Core Web Vitals
    if (vitalsData.vitals) {
        if (vitalsData.vitals.LCP && vitalsData.vitals.LCP.value > 2500) {
            recommendations.push({
                category: 'Core Web Vitals',
                priority: 'High',
                title: 'Optimize Largest Contentful Paint (LCP)',
                description: 'LCP measures loading performance. Optimize images, server response times, and render-blocking resources.',
                savings: `Current: ${vitalsData.vitals.LCP.value}ms, Target: <2500ms`,
                impact: 'High'
            });
        }
        
        if (vitalsData.vitals.FID && vitalsData.vitals.FID.value > 100) {
            recommendations.push({
                category: 'Core Web Vitals',
                priority: 'High',
                title: 'Improve First Input Delay (FID)',
                description: 'FID measures interactivity. Reduce JavaScript execution time and break up long tasks.',
                savings: `Current: ${vitalsData.vitals.FID.value}ms, Target: <100ms`,
                impact: 'High'
            });
        }
        
        if (vitalsData.vitals.CLS && vitalsData.vitals.CLS.value > 0.1) {
            recommendations.push({
                category: 'Core Web Vitals',
                priority: 'High',
                title: 'Fix Cumulative Layout Shift (CLS)',
                description: 'CLS measures visual stability. Set dimensions for images and avoid inserting content above existing content.',
                savings: `Current: ${vitalsData.vitals.CLS.value}, Target: <0.1`,
                impact: 'High'
            });
        }
    }
    
    // Analyze network performance
    if (networkData.totalRequests) {
        if (networkData.totalRequests > 50) {
            recommendations.push({
                category: 'Network',
                priority: 'Medium',
                title: 'Reduce HTTP Requests',
                description: 'Consider bundling resources, using CSS sprites, or implementing resource hints.',
                savings: `Current: ${networkData.totalRequests} requests`,
                impact: 'Medium'
            });
        }
        
        const totalSizeMB = networkData.totalSize / (1024 * 1024);
        if (totalSizeMB > 3) {
            recommendations.push({
                category: 'Network',
                priority: 'High',
                title: 'Reduce Total Page Size',
                description: 'Compress images, minify CSS/JS, and consider implementing progressive loading.',
                savings: `Current: ${totalSizeMB.toFixed(1)}MB`,
                impact: 'High'
            });
        }
    }
    
    // General performance recommendations
    const generalRecommendations = [
        {
            category: 'Images',
            priority: 'Medium',
            title: 'Implement Modern Image Formats',
            description: 'Use WebP or AVIF formats for better compression. Implement responsive images with srcset.',
            impact: 'Medium'
        },
        {
            category: 'Caching',
            priority: 'High',
            title: 'Implement Aggressive Caching',
            description: 'Set up proper cache headers, use CDN, and implement service worker caching strategies.',
            impact: 'High'
        },
        {
            category: 'JavaScript',
            priority: 'Medium',
            title: 'Implement Code Splitting',
            description: 'Split your JavaScript bundles and load only what\'s needed for each page.',
            impact: 'Medium'
        },
        {
            category: 'CSS',
            priority: 'Low',
            title: 'Optimize CSS Delivery',
            description: 'Inline critical CSS and load non-critical CSS asynchronously.',
            impact: 'Low'
        }
    ];
    
    // Add general recommendations if no specific issues found
    if (recommendations.length < 5) {
        recommendations.push(...generalRecommendations.slice(0, 5 - recommendations.length));
    }
    
    // Sort by priority and impact
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    const optimizationReport = {
        timestamp: new Date().toISOString(),
        totalRecommendations: recommendations.length,
        highPriority: recommendations.filter(r => r.priority === 'High').length,
        mediumPriority: recommendations.filter(r => r.priority === 'Medium').length,
        lowPriority: recommendations.filter(r => r.priority === 'Low').length,
        recommendations
    };
    
    // Save optimization report
    fs.writeFileSync(`${outputDir}/optimization-recommendations.json`, JSON.stringify(optimizationReport, null, 2));
    
    // Generate markdown report
    let reportContent = `# Performance Optimization Recommendations\n\n`;
    reportContent += `**Generated**: ${new Date().toLocaleDateString()}\n`;
    reportContent += `**Total Recommendations**: ${recommendations.length}\n`;
    reportContent += `**High Priority**: ${optimizationReport.highPriority}\n`;
    reportContent += `**Medium Priority**: ${optimizationReport.mediumPriority}\n`;
    reportContent += `**Low Priority**: ${optimizationReport.lowPriority}\n\n`;
    
    const priorityGroups = {
        'High': recommendations.filter(r => r.priority === 'High'),
        'Medium': recommendations.filter(r => r.priority === 'Medium'),
        'Low': recommendations.filter(r => r.priority === 'Low')
    };
    
    Object.entries(priorityGroups).forEach(([priority, recs]) => {
        if (recs.length > 0) {
            const emoji = priority === 'High' ? '🚨' : priority === 'Medium' ? '⚠️' : '💡';
            reportContent += `## ${emoji} ${priority} Priority\n\n`;
            
            recs.forEach((rec, index) => {
                reportContent += `### ${index + 1}. ${rec.title}\n`;
                reportContent += `- **Category**: ${rec.category}\n`;
                reportContent += `- **Impact**: ${rec.impact}\n`;
                if (rec.savings) {
                    reportContent += `- **Potential Savings**: ${rec.savings}\n`;
                }
                reportContent += `- **Description**: ${rec.description}\n\n`;
            });
        }
    });
    
    reportContent += `## Implementation Priority\n\n`;
    reportContent += `1. **Focus on High Priority items first** - These provide the biggest performance gains\n`;
    reportContent += `2. **Core Web Vitals** - Prioritize LCP, FID, and CLS improvements\n`;
    reportContent += `3. **Network Optimization** - Reduce request counts and total payload size\n`;
    reportContent += `4. **Progressive Enhancement** - Implement optimizations incrementally\n\n`;
    
    reportContent += `## Performance Monitoring\n\n`;
    reportContent += `- Set up continuous performance monitoring\n`;
    reportContent += `- Establish performance budgets\n`;
    reportContent += `- Monitor Core Web Vitals in production\n`;
    reportContent += `- Regular Lighthouse audits in CI/CD pipeline\n`;
    
    fs.writeFileSync(`${outputDir}/optimization-recommendations.md`, reportContent);
    
    console.log('\n🔧 OPTIMIZATION RECOMMENDATIONS');
    console.log('===============================');
    console.log(`Total Recommendations: ${recommendations.length}`);
    console.log(`High Priority: ${optimizationReport.highPriority}`);
    console.log(`Medium Priority: ${optimizationReport.mediumPriority}`);
    console.log(`Low Priority: ${optimizationReport.lowPriority}`);
    
    if (optimizationReport.highPriority > 0) {
        console.log('\nTop High Priority Items:');
        recommendations.filter(r => r.priority === 'High').slice(0, 3).forEach((rec, index) => {
            console.log(`  ${index + 1}. ${rec.title}`);
            if (rec.savings) console.log(`     Savings: ${rec.savings}`);
        });
    }
    
} catch (error) {
    console.error('Error generating optimization recommendations:', error.message);
}
EOF "$output_dir"
}
```

## Command Interface

```bash
# Parse command line arguments
URL="http://localhost:3000"
DEVICE="desktop"
THROTTLING="fast-3g"
BUDGET=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --url)
            URL="$2"
            shift 2
            ;;
        --device)
            DEVICE="$2"
            shift 2
            ;;
        --throttling)
            THROTTLING="$2"
            shift 2
            ;;
        --budget)
            BUDGET="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute performance testing
echo "🚀 Starting performance testing for: $URL"

# Create output directory
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="tests/reports/performance/run-$TIMESTAMP"
mkdir -p "$OUTPUT_DIR"

initialize_performance_testing

# Run Lighthouse audit
if run_lighthouse_audit "$URL" "$DEVICE" "$THROTTLING" "$OUTPUT_DIR"; then
    echo "✅ Lighthouse audit completed"
    LIGHTHOUSE_PASSED=true
else
    echo "❌ Lighthouse audit failed"
    LIGHTHOUSE_PASSED=false
fi

# Run Core Web Vitals test
if run_core_web_vitals_test "$URL" "$OUTPUT_DIR"; then
    echo "✅ Core Web Vitals test completed"
    VITALS_PASSED=true
else
    echo "❌ Core Web Vitals test failed"
    VITALS_PASSED=false
fi

# Validate performance budget
if validate_performance_budget "$OUTPUT_DIR" "$BUDGET"; then
    echo "✅ Performance budget validation passed"
    BUDGET_PASSED=true
else
    echo "❌ Performance budget validation failed"
    BUDGET_PASSED=false
fi

# Generate optimization recommendations
generate_optimization_recommendations "$OUTPUT_DIR"

echo ""
echo "🎯 PERFORMANCE TESTING COMPLETE!"
echo ""
echo "📊 Results directory: $OUTPUT_DIR"
echo "📄 Lighthouse report: $OUTPUT_DIR/lighthouse-report.html"
echo "📈 Core Web Vitals: $OUTPUT_DIR/core-web-vitals-report.md"
echo "💰 Budget report: $OUTPUT_DIR/performance-budget-report.md"
echo "🔧 Recommendations: $OUTPUT_DIR/optimization-recommendations.md"
echo ""

# Overall test result
if [ "$LIGHTHOUSE_PASSED" = true ] && [ "$VITALS_PASSED" = true ] && [ "$BUDGET_PASSED" = true ]; then
    echo "✅ All performance tests passed!"
    exit 0
else
    echo "❌ Some performance tests failed. Check the reports for details."
    exit 1
fi
```

## Integration Points

### Work Validator Integration
- Performance scores feed into overall quality metrics
- Budget violations tracked in validation reports
- Optimization recommendations included in improvement plans

### Browser Testing Integration
- Runs as part of comprehensive testing suite
- Performance project configuration in Playwright
- Results included in browser testing reports

### CI/CD Integration
- Performance budgets enforced in deployment pipeline
- Lighthouse audits in GitHub Actions
- Historical performance tracking

## Key Features

1. **Lighthouse Integration** - Comprehensive performance auditing
2. **Core Web Vitals** - LCP, FID, CLS measurement and validation
3. **Performance Budgets** - Configurable performance thresholds
4. **Network Analysis** - Request count and payload size monitoring
5. **Optimization Recommendations** - Actionable improvement suggestions
6. **Multiple Device Testing** - Mobile and desktop performance validation
7. **Throttling Simulation** - Network condition testing
8. **Historical Tracking** - Performance trends over time

The Performance Tester Agent provides comprehensive performance validation with detailed optimization guidance for creating fast, responsive web applications.