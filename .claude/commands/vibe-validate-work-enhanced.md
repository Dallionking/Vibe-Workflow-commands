---
description: Enhanced work validation with integrated UI healing and quality assurance
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__playwright__*
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
  - --phase
  - --feature
  - --comprehensive
  - --ui-healing
  - --threshold
---

# vibe-validate-work-enhanced

Enhanced work validation with integrated UI healing and quality assurance

## Usage
`/vibe-validate-work-enhanced [--phase] [--feature] [--comprehensive] [--ui-healing] [--threshold]`

# Enhanced Work Validator with Integrated UI Healing

## Overview
This is an enhanced version of the work validator that includes automatic UI quality healing. When UI changes are detected, it automatically grades the UI against the design system and applies fixes if the quality score is below threshold.

## Key Enhancements

### 1. UI Change Detection
```bash
# Add to validation flow after line 73
detect_ui_changes() {
    echo "🎨 Detecting UI changes..."
    
    # Check for changes in UI-related files
    UI_CHANGED=false
    UI_CHANGED_FILES=$()
    
    # Get list of changed files
    if [ -n "$(git status --porcelain)" ]; then
        # For uncommitted changes
        UI_FILES=$(git diff --name-only | grep -E "\.(jsx|tsx|vue|svelte|css|scss|sass|less)$" || true)
        COMPONENT_FILES=$(git diff --name-only | grep -E "(components|pages|views|layouts)/" || true)
    else
        # For committed changes
        UI_FILES=$(git diff HEAD~1 --name-only | grep -E "\.(jsx|tsx|vue|svelte|css|scss|sass|less)$" || true)
        COMPONENT_FILES=$(git diff HEAD~1 --name-only | grep -E "(components|pages|views|layouts)/" || true)
    fi
    
    if [ -n "$UI_FILES" ] || [ -n "$COMPONENT_FILES" ]; then
        UI_CHANGED=true
        UI_CHANGED_FILES=(${UI_FILES} ${COMPONENT_FILES})
        echo "   ✅ UI changes detected in ${#UI_CHANGED_FILES[@]} files"
    else
        echo "   ℹ️ No UI changes detected"
    fi
    
    export UI_CHANGED
    export UI_CHANGED_FILES
}
```

### 2. UI Quality Grading Integration
```javascript
// ui-quality-grader.js
const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class UIQualityGrader {
    constructor(designSystemPath) {
        this.designSystem = null;
        this.designSystemPath = designSystemPath;
        this.browser = null;
        this.context = null;
    }
    
    async initialize() {
        // Parse design system
        const designSystemContent = await fs.readFile(this.designSystemPath, 'utf8');
        this.designSystem = this.parseDesignSystem(designSystemContent);
        
        // Launch browser
        this.browser = await chromium.launch({ headless: true });
        this.context = await this.browser.newContext();
    }
    
    parseDesignSystem(content) {
        // Extract design tokens from markdown
        const designSystem = {
            colors: {},
            typography: {},
            spacing: {},
            shadows: {},
            borderRadius: {}
        };
        
        // Parse color values
        const colorMatches = content.matchAll(/([A-Za-z\s]+):\s*#([A-Fa-f0-9]{6})/g);
        for (const match of colorMatches) {
            designSystem.colors[match[1].trim()] = `#${match[2]}`;
        }
        
        // Parse spacing values
        const spacingMatches = content.matchAll(/(\d+)px\s*\((\d+\.?\d*)rem\).*?:\s*\[([^\]]+)\]/g);
        for (const match of spacingMatches) {
            designSystem.spacing[`${match[1]}px`] = {
                rem: match[2],
                usage: match[3]
            };
        }
        
        return designSystem;
    }
    
    async gradeComponent(componentPath, url) {
        const page = await this.context.newPage();
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        
        const scores = {
            colorContrast: await this.gradeColorContrast(page),
            typography: await this.gradeTypography(page),
            spacing: await this.gradeSpacing(page),
            interactions: await this.gradeInteractions(page),
            consistency: await this.gradeConsistency(page),
            accessibility: await this.gradeAccessibility(page)
        };
        
        const weights = {
            colorContrast: 0.2,
            typography: 0.15,
            spacing: 0.15,
            interactions: 0.2,
            consistency: 0.15,
            accessibility: 0.15
        };
        
        const overallScore = Object.entries(scores).reduce(
            (total, [category, score]) => total + (score * weights[category]),
            0
        );
        
        await page.close();
        
        return {
            component: componentPath,
            url: url,
            overallScore: Math.round(overallScore * 10) / 10,
            breakdown: scores,
            failingAreas: Object.entries(scores)
                .filter(([_, score]) => score < 7)
                .map(([category, score]) => ({ category, score }))
        };
    }
    
    async gradeColorContrast(page) {
        const contrastIssues = await page.evaluate(() => {
            const issues = [];
            const elements = document.querySelectorAll('*');
            
            for (const el of elements) {
                const style = window.getComputedStyle(el);
                const bg = style.backgroundColor;
                const fg = style.color;
                
                if (bg !== 'rgba(0, 0, 0, 0)' && fg !== 'rgba(0, 0, 0, 0)') {
                    // Simple contrast check (would use proper WCAG algorithm)
                    const bgLuminance = this.getLuminance(bg);
                    const fgLuminance = this.getLuminance(fg);
                    const contrast = (Math.max(bgLuminance, fgLuminance) + 0.05) / 
                                   (Math.min(bgLuminance, fgLuminance) + 0.05);
                    
                    if (contrast < 4.5) {
                        issues.push({
                            element: el.tagName,
                            contrast: contrast,
                            bg: bg,
                            fg: fg
                        });
                    }
                }
            }
            
            return issues;
        });
        
        // Score based on number of contrast issues
        if (contrastIssues.length === 0) return 10;
        if (contrastIssues.length <= 2) return 8;
        if (contrastIssues.length <= 5) return 6;
        return 4;
    }
    
    async gradeTypography(page) {
        const typographyScore = await page.evaluate((designSystem) => {
            let score = 10;
            const issues = [];
            
            // Check heading hierarchy
            const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            let lastHeadingLevel = 0;
            
            for (const heading of headings) {
                const elements = document.querySelectorAll(heading);
                const currentLevel = parseInt(heading[1]);
                
                if (elements.length > 0 && currentLevel > lastHeadingLevel + 1) {
                    issues.push(`Skipped heading level: ${heading}`);
                    score -= 1;
                }
                
                if (elements.length > 0) {
                    lastHeadingLevel = currentLevel;
                }
            }
            
            // Check font consistency
            const fonts = new Set();
            document.querySelectorAll('*').forEach(el => {
                const font = window.getComputedStyle(el).fontFamily;
                if (font) fonts.add(font);
            });
            
            if (fonts.size > 3) {
                score -= 2;
                issues.push(`Too many font families: ${fonts.size}`);
            }
            
            return { score: Math.max(score, 0), issues };
        }, this.designSystem);
        
        return typographyScore.score;
    }
    
    async gradeSpacing(page) {
        const spacingScore = await page.evaluate((designSystem) => {
            let score = 10;
            const baseUnit = 8; // 8px grid system
            const issues = [];
            
            const elements = document.querySelectorAll('*');
            for (const el of elements) {
                const style = window.getComputedStyle(el);
                const padding = [
                    parseInt(style.paddingTop),
                    parseInt(style.paddingRight),
                    parseInt(style.paddingBottom),
                    parseInt(style.paddingLeft)
                ];
                const margin = [
                    parseInt(style.marginTop),
                    parseInt(style.marginRight),
                    parseInt(style.marginBottom),
                    parseInt(style.marginLeft)
                ];
                
                // Check if spacing follows grid system
                const nonGridSpacing = [...padding, ...margin].filter(value => 
                    value > 0 && value % baseUnit !== 0
                );
                
                if (nonGridSpacing.length > 0) {
                    issues.push({
                        element: el.tagName,
                        nonGridValues: nonGridSpacing
                    });
                }
            }
            
            // Deduct points based on violations
            const violationRatio = issues.length / elements.length;
            score = Math.max(10 - (violationRatio * 20), 4);
            
            return { score, issues };
        }, this.designSystem);
        
        return spacingScore.score;
    }
    
    async gradeInteractions(page) {
        const interactionScore = await page.evaluate(() => {
            let score = 10;
            const issues = [];
            
            // Check interactive elements
            const interactiveElements = document.querySelectorAll(
                'button, a, input, select, textarea, [role="button"], [tabindex]'
            );
            
            for (const el of interactiveElements) {
                const style = window.getComputedStyle(el);
                
                // Check for hover states
                if (!el.matches(':hover')) {
                    // Would need to trigger hover and check style changes
                    // For now, check if cursor changes
                    if (style.cursor === 'auto') {
                        issues.push({
                            element: el.tagName,
                            issue: 'No cursor change on interactive element'
                        });
                        score -= 0.5;
                    }
                }
                
                // Check focus states
                if (!el.matches(':focus-visible')) {
                    // Check for focus styles
                    const hasFocusStyle = style.outline !== 'none' || 
                                        style.boxShadow !== 'none';
                    if (!hasFocusStyle) {
                        issues.push({
                            element: el.tagName,
                            issue: 'No focus indicator'
                        });
                        score -= 0.5;
                    }
                }
                
                // Check touch target size
                const rect = el.getBoundingClientRect();
                if (rect.width < 44 || rect.height < 44) {
                    issues.push({
                        element: el.tagName,
                        issue: 'Touch target too small',
                        size: `${rect.width}x${rect.height}`
                    });
                    score -= 0.3;
                }
            }
            
            return { score: Math.max(score, 4), issues };
        });
        
        return interactionScore.score;
    }
    
    async gradeConsistency(page) {
        // Check component consistency
        const consistencyScore = await page.evaluate(() => {
            let score = 10;
            const issues = [];
            
            // Check button consistency
            const buttons = document.querySelectorAll('button, [role="button"]');
            const buttonStyles = new Set();
            
            buttons.forEach(btn => {
                const style = window.getComputedStyle(btn);
                const styleKey = `${style.backgroundColor}-${style.color}-${style.borderRadius}`;
                buttonStyles.add(styleKey);
            });
            
            if (buttonStyles.size > 3) {
                score -= 2;
                issues.push(`Too many button variations: ${buttonStyles.size}`);
            }
            
            // Check card consistency
            const cards = document.querySelectorAll('[class*="card"], .card');
            const cardStyles = new Set();
            
            cards.forEach(card => {
                const style = window.getComputedStyle(card);
                const styleKey = `${style.boxShadow}-${style.borderRadius}`;
                cardStyles.add(styleKey);
            });
            
            if (cardStyles.size > 2) {
                score -= 1;
                issues.push(`Inconsistent card styles: ${cardStyles.size} variations`);
            }
            
            return { score: Math.max(score, 5), issues };
        });
        
        return consistencyScore.score;
    }
    
    async gradeAccessibility(page) {
        const a11yScore = await page.evaluate(() => {
            let score = 10;
            const issues = [];
            
            // Check images for alt text
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!img.alt && !img.getAttribute('aria-label')) {
                    issues.push('Image missing alt text');
                    score -= 0.5;
                }
            });
            
            // Check form labels
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                const id = input.id;
                if (!id || !document.querySelector(`label[for="${id}"]`)) {
                    issues.push('Form input missing label');
                    score -= 0.5;
                }
            });
            
            // Check ARIA attributes
            const interactiveElements = document.querySelectorAll(
                'button, a, [onclick], [role="button"]'
            );
            interactiveElements.forEach(el => {
                if (!el.textContent.trim() && !el.getAttribute('aria-label')) {
                    issues.push('Interactive element missing accessible name');
                    score -= 0.5;
                }
            });
            
            return { score: Math.max(score, 4), issues };
        });
        
        return a11yScore.score;
    }
    
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

module.exports = UIQualityGrader;
```

### 3. UI Healing Engine
```javascript
// ui-healing-engine.js
const fs = require('fs').promises;
const path = require('path');

class UIHealingEngine {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.fixes = [];
    }
    
    async healComponent(gradingResult, designSystem) {
        console.log(`🔧 Healing component: ${gradingResult.component}`);
        console.log(`   Current score: ${gradingResult.overallScore}/10`);
        
        for (const area of gradingResult.failingAreas) {
            switch (area.category) {
                case 'colorContrast':
                    await this.fixColorContrast(gradingResult.component, area);
                    break;
                case 'typography':
                    await this.fixTypography(gradingResult.component, area);
                    break;
                case 'spacing':
                    await this.fixSpacing(gradingResult.component, area);
                    break;
                case 'interactions':
                    await this.fixInteractions(gradingResult.component, area);
                    break;
                case 'consistency':
                    await this.fixConsistency(gradingResult.component, area);
                    break;
                case 'accessibility':
                    await this.fixAccessibility(gradingResult.component, area);
                    break;
            }
        }
        
        return this.fixes;
    }
    
    async fixColorContrast(componentPath, issue) {
        console.log(`   🎨 Fixing color contrast issues...`);
        
        // Read component file
        const filePath = path.join(this.projectPath, componentPath);
        let content = await fs.readFile(filePath, 'utf8');
        
        // Common contrast fixes
        const contrastFixes = [
            // Darken light text on light backgrounds
            { pattern: /color:\s*['"]#[89ABCDEF]{6}/gi, replacement: 'color: "#4A5568"' },
            // Lighten dark text on dark backgrounds
            { pattern: /color:\s*['"]#[0123]{6}/gi, replacement: 'color: "#E2E8F0"' },
        ];
        
        let fixCount = 0;
        for (const fix of contrastFixes) {
            const matches = content.match(fix.pattern);
            if (matches) {
                content = content.replace(fix.pattern, fix.replacement);
                fixCount += matches.length;
            }
        }
        
        if (fixCount > 0) {
            await fs.writeFile(filePath, content);
            this.fixes.push({
                component: componentPath,
                category: 'colorContrast',
                fixes: fixCount,
                description: `Fixed ${fixCount} color contrast issues`
            });
        }
    }
    
    async fixSpacing(componentPath, issue) {
        console.log(`   📐 Fixing spacing inconsistencies...`);
        
        const filePath = path.join(this.projectPath, componentPath);
        let content = await fs.readFile(filePath, 'utf8');
        
        // Fix non-grid spacing values
        const spacingPatterns = [
            // Fix padding values
            { pattern: /padding:\s*['"]?(\d+)px/g, replacer: (match, value) => {
                const gridValue = Math.round(parseInt(value) / 8) * 8;
                return `padding: "${gridValue}px`;
            }},
            // Fix margin values
            { pattern: /margin:\s*['"]?(\d+)px/g, replacer: (match, value) => {
                const gridValue = Math.round(parseInt(value) / 8) * 8;
                return `margin: "${gridValue}px`;
            }},
            // Fix gap values
            { pattern: /gap:\s*['"]?(\d+)px/g, replacer: (match, value) => {
                const gridValue = Math.round(parseInt(value) / 8) * 8;
                return `gap: "${gridValue}px`;
            }}
        ];
        
        let fixCount = 0;
        for (const pattern of spacingPatterns) {
            const matches = content.matchAll(pattern.pattern);
            for (const match of matches) {
                const original = match[0];
                const fixed = pattern.replacer(match[0], match[1]);
                if (original !== fixed) {
                    content = content.replace(original, fixed);
                    fixCount++;
                }
            }
        }
        
        if (fixCount > 0) {
            await fs.writeFile(filePath, content);
            this.fixes.push({
                component: componentPath,
                category: 'spacing',
                fixes: fixCount,
                description: `Aligned ${fixCount} spacing values to 8px grid`
            });
        }
    }
    
    async fixInteractions(componentPath, issue) {
        console.log(`   🖱️ Adding missing interaction states...`);
        
        const filePath = path.join(this.projectPath, componentPath);
        let content = await fs.readFile(filePath, 'utf8');
        
        // Add hover states to buttons
        if (content.includes('button') || content.includes('Button')) {
            // Check if hover states exist
            if (!content.includes(':hover') && !content.includes('hover:')) {
                // Add hover state styles
                const hoverStyles = `
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },`;
                
                // Insert hover styles after button styles
                const buttonStyleRegex = /(button|Button)\s*:\s*{([^}]+)}/g;
                content = content.replace(buttonStyleRegex, (match, name, styles) => {
                    return `${name}: {${styles}${hoverStyles}\n}`;
                });
                
                this.fixes.push({
                    component: componentPath,
                    category: 'interactions',
                    fixes: 1,
                    description: 'Added hover and active states to buttons'
                });
            }
        }
        
        // Add focus states
        if (!content.includes(':focus') && !content.includes('focus:')) {
            const focusStyles = `
  '&:focus-visible': {
    outline: '2px solid #4299E1',
    outlineOffset: '2px',
  },`;
            
            // Add to interactive elements
            const interactiveRegex = /(button|input|select|textarea)\s*:\s*{([^}]+)}/gi;
            content = content.replace(interactiveRegex, (match, name, styles) => {
                return `${name}: {${styles}${focusStyles}\n}`;
            });
            
            this.fixes.push({
                component: componentPath,
                category: 'interactions',
                fixes: 1,
                description: 'Added focus-visible states'
            });
        }
        
        await fs.writeFile(filePath, content);
    }
    
    async fixAccessibility(componentPath, issue) {
        console.log(`   ♿ Fixing accessibility issues...`);
        
        const filePath = path.join(this.projectPath, componentPath);
        let content = await fs.readFile(filePath, 'utf8');
        
        // Add alt text to images
        const imgRegex = /<img([^>]+)>/g;
        content = content.replace(imgRegex, (match, attrs) => {
            if (!attrs.includes('alt=')) {
                return `<img${attrs} alt=""`;
            }
            return match;
        });
        
        // Add aria-labels to icon buttons
        const iconButtonRegex = /<button([^>]+)>\s*<(?:Icon|i)([^>]+)>\s*<\/(?:Icon|i)>\s*<\/button>/g;
        content = content.replace(iconButtonRegex, (match, attrs, iconAttrs) => {
            if (!attrs.includes('aria-label=')) {
                return match.replace('<button', '<button aria-label="Button"');
            }
            return match;
        });
        
        await fs.writeFile(filePath, content);
        
        this.fixes.push({
            component: componentPath,
            category: 'accessibility',
            fixes: 1,
            description: 'Added missing accessibility attributes'
        });
    }
    
    generateHealingReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalFixes: this.fixes.length,
            fixesByCategory: {},
            components: {}
        };
        
        for (const fix of this.fixes) {
            // Group by category
            if (!report.fixesByCategory[fix.category]) {
                report.fixesByCategory[fix.category] = 0;
            }
            report.fixesByCategory[fix.category] += fix.fixes;
            
            // Group by component
            if (!report.components[fix.component]) {
                report.components[fix.component] = [];
            }
            report.components[fix.component].push(fix);
        }
        
        return report;
    }
}

module.exports = UIHealingEngine;
```

### 4. Integration Script
```bash
# Add to work-validator.md after browser testing section

run_ui_quality_healing() {
    if [ "$UI_CHANGED" = "true" ] && [ "$PROJECT_HAS_FRONTEND" = "true" ] && [ "$BROWSER_TESTING_AVAILABLE" = "true" ]; then
        echo "🏥 UI QUALITY HEALING"
        echo "==================="
        
        # Check for design system
        if [ ! -f "docs/04-design-system.md" ]; then
            echo "⚠️ Design system not found - skipping UI healing"
            return 0
        fi
        
        # Create healing script
        cat > /tmp/ui-healing-runner.js << 'EOF'
const UIQualityGrader = require('./ui-quality-grader');
const UIHealingEngine = require('./ui-healing-engine');

async function runUIHealing() {
    const grader = new UIQualityGrader('docs/04-design-system.md');
    const healer = new UIHealingEngine(process.cwd());
    
    try {
        await grader.initialize();
        
        // Get changed UI files from environment
        const changedFiles = process.env.UI_CHANGED_FILES?.split(' ') || [];
        
        let totalScore = 0;
        let componentCount = 0;
        const results = [];
        
        for (const file of changedFiles) {
            // Skip non-component files
            if (!file.includes('components/') && !file.includes('pages/')) continue;
            
            // Grade component
            const url = `http://localhost:3000/component-preview/${file}`;
            const gradingResult = await grader.gradeComponent(file, url);
            results.push(gradingResult);
            
            totalScore += gradingResult.overallScore;
            componentCount++;
            
            console.log(`\n📊 Component: ${file}`);
            console.log(`   Score: ${gradingResult.overallScore}/10`);
            
            // Heal if below threshold
            if (gradingResult.overallScore < 8) {
                console.log(`   🔧 Score below threshold - initiating healing...`);
                
                await healer.healComponent(gradingResult, grader.designSystem);
                
                // Re-grade after healing
                const newGrade = await grader.gradeComponent(file, url);
                console.log(`   ✅ New score: ${newGrade.overallScore}/10`);
                
                results.push({
                    ...newGrade,
                    wasHealed: true,
                    previousScore: gradingResult.overallScore
                });
            }
        }
        
        // Generate report
        const avgScore = componentCount > 0 ? totalScore / componentCount : 10;
        const healingReport = healer.generateHealingReport();
        
        console.log(`\n📈 UI QUALITY SUMMARY`);
        console.log(`====================`);
        console.log(`Average Score: ${avgScore.toFixed(1)}/10`);
        console.log(`Components Analyzed: ${componentCount}`);
        console.log(`Components Healed: ${healingReport.totalFixes}`);
        
        if (healingReport.fixesByCategory) {
            console.log(`\nFixes by Category:`);
            for (const [category, count] of Object.entries(healingReport.fixesByCategory)) {
                console.log(`  - ${category}: ${count} fixes`);
            }
        }
        
        // Save report
        await require('fs').promises.writeFile(
            'tests/ui-healing-report.json',
            JSON.stringify({ results, healingReport, avgScore }, null, 2)
        );
        
        await grader.cleanup();
        
        // Return success if average score is above threshold
        process.exit(avgScore >= 7 ? 0 : 1);
        
    } catch (error) {
        console.error('UI Healing failed:', error);
        await grader.cleanup();
        process.exit(1);
    }
}

runUIHealing();
EOF
        
        # Run UI healing
        echo "🔍 Analyzing UI quality and applying fixes..."
        
        if node /tmp/ui-healing-runner.js; then
            echo "✅ UI quality healing completed successfully"
            
            # Show summary from report
            if [ -f "tests/ui-healing-report.json" ]; then
                echo ""
                echo "📊 Healing Report Summary:"
                node -e "
                    const report = require('./tests/ui-healing-report.json');
                    console.log('Average Score:', report.avgScore.toFixed(1) + '/10');
                    if (report.healingReport.totalFixes > 0) {
                        console.log('\\nApplied Fixes:');
                        for (const [cat, count] of Object.entries(report.healingReport.fixesByCategory)) {
                            console.log('  -', cat + ':', count, 'fixes');
                        }
                    }
                "
            fi
            
            return 0
        else
            echo "❌ UI quality below threshold after healing"
            echo "   Review the healing report and make manual adjustments"
            return 1
        fi
    else
        echo "ℹ️ UI healing skipped (no UI changes or missing requirements)"
        return 0
    fi
}

# Add to main validation flow
execute_validation() {
    local validation_mode="$1"
    local exit_code=0
    
    echo "🚀 EXECUTING VALIDATION SUITE"
    echo "============================="
    echo "Mode: $validation_mode"
    
    # Detect UI changes first
    detect_ui_changes
    
    # ... existing validation steps ...
    
    # Add UI quality healing after browser testing
    if [ "$UI_CHANGED" = "true" ]; then
        echo "🏥 Step 8: UI Quality Healing"
        run_ui_quality_healing || exit_code=1
    fi
    
    # ... rest of validation ...
}
```

## Configuration

### Validation Config Enhancement
```json
// .vibe/validation.config.json
{
  "validation": {
    "testCoverage": {
      "minimum": 95,
      "excludePatterns": ["*.stories.tsx", "*.mock.ts"]
    },
    "uiQuality": {
      "enabled": true,
      "threshold": 8.0,
      "autoHeal": true,
      "maxHealingIterations": 3,
      "categories": {
        "colorContrast": { "weight": 0.2, "minScore": 7 },
        "typography": { "weight": 0.15, "minScore": 7 },
        "spacing": { "weight": 0.15, "minScore": 7 },
        "interactions": { "weight": 0.2, "minScore": 8 },
        "consistency": { "weight": 0.15, "minScore": 7 },
        "accessibility": { "weight": 0.15, "minScore": 9 }
      },
      "componentPaths": [
        "src/components",
        "src/pages",
        "src/views",
        "components",
        "pages"
      ]
    }
  }
}
```

## Usage

### Standard Validation (includes UI healing)
```bash
/vibe-validate-work
# Automatically detects UI changes and heals if needed
```

### Force UI Healing
```bash
/vibe-validate-work --force-ui-healing
# Runs UI healing even without detected changes
```

### Skip UI Healing
```bash
/vibe-validate-work --skip-ui-healing
# Runs validation without UI quality checks
```

### UI-Only Validation
```bash
/vibe-validate-work --ui-only
# Only runs UI quality checks and healing
```

## Benefits

1. **Seamless Integration** - UI quality is part of standard validation
2. **Automatic Remediation** - Issues are fixed inline, not flagged for later
3. **Continuous Quality** - Every UI change is validated and improved
4. **No Context Switching** - Developers stay in their flow
5. **Objective Standards** - Design system compliance is enforced automatically