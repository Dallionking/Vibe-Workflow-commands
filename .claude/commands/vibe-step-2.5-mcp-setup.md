---
description: Automatically analyze tech stack and install/configure required MCP tools
allowed-tools:
  - mcp__perplexity-mcp__perplexity_search_web
  - mcp__perplexity-ask__perplexity_ask
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
---

# vibe-step-2.5-mcp-setup

Automatically analyze tech stack and install/configure required MCP tools

# Vibe Coding Step 2.5: MCP Auto-Installation & Configuration Agent

## Agent Configuration
- **Command**: `/vibe-step-2.5-mcp-setup` (also available as `/vibe-mcp-setup`)
- **Description**: Automatically analyze tech stack and install/configure required MCP tools
- **Prerequisites**: 
  - `docs/02-technical-architecture.md` must exist (from Step 2)
  - Claude Desktop with MCP support
- **Outputs**: 
  - `.vibe/mcp-status.json` - MCP installation and connection status
  - `docs/02.5-mcp-configuration.md` - MCP setup documentation
- **MCP Tools**: Perplexity (for research), Context7 (for documentation)

## Pre-Execution Validation
```
1. Check if Step 2 (Technical Architecture) is complete
2. Verify Claude Desktop MCP support is available
3. Check system permissions for MCP installation
4. Ensure Perplexity and Context7 are available for research
5. Create .vibe/ directory if it doesn't exist
```

## Execution Flow

### 1. Tech Stack Analysis
```
🔍 **Analyzing your project's technology stack...**

Reading technology decisions from:
- docs/02-technical-architecture.md (Framework selections)
- .vibe-status.md (Project metadata)
- docs/01-project-specification.md (Project requirements)

Extracting MCP requirements from:
- Frontend framework selections
- Backend technology choices
- Database and service selections
- Development tools and integrations
- Monitoring and analytics needs
```

### 2. Load Project Context and Analyze Requirements

<goal>
You are the **Vibe Coding Step 2.5 MCP Auto-Installation Agent** - an expert in MCP (Model Context Protocol) tools, Claude Desktop configuration, and development environment automation.

Your expertise includes:
- MCP tool installation and configuration across all platforms
- Automated dependency management and system setup
- Service integration and authentication flows
- Development environment optimization
- Troubleshooting MCP connection issues
- Research automation using Perplexity and Context7
- Claude Desktop advanced configuration

Your role is to analyze the project's technology stack from Step 2 and automatically install, configure, and test all required MCP tools to ensure seamless development assistance throughout the Vibe Coding process.
</goal>

### 3. Research Required MCPs with Perplexity

```
📚 **Researching optimal MCP tools for your tech stack...**

Using Perplexity to research:
- Latest MCP tools for [Frontend Framework]
- Best MCPs for [Backend Technology] development
- Database-specific MCP tools for [Database Choice]
- Service integration MCPs for [External Services]
- Development workflow optimization tools

Research Query Examples:
/perplexity "Best MCP tools for React Next.js development 2024"
/perplexity "Claude MCP integrations for PostgreSQL database management"
/perplexity "GitHub MCP vs Linear MCP for project management"
```

### 4. Fetch Installation Documentation with Context7

```
📖 **Fetching installation guides and best practices...**

Using Context7 to get documentation for:
- MCP installation procedures
- Configuration best practices
- Authentication setup guides
- Troubleshooting common issues

Documentation Fetching:
/context7 library="claude-mcp" topic="installation-guide"
/context7 library="github-mcp" topic="authentication-setup"
/context7 library="digital-ocean-mcp" topic="api-configuration"
```

### 5. MCP Installation Matrix

Based on tech stack analysis, determine required MCPs:

#### Core MCPs (Always Required)
```
🔧 **Installing Core MCP Tools...**

✓ Context7 MCP
  - Purpose: Documentation fetching and research
  - Installation: npm install -g @context7/mcp-client
  - Configuration: API key setup
  - Testing: Fetch test documentation

✓ Perplexity MCP  
  - Purpose: Real-time research and market analysis
  - Installation: npm install -g @perplexity/mcp-integration
  - Configuration: API authentication
  - Testing: Research query execution

✓ GitHub MCP
  - Purpose: Repository management and CI/CD integration
  - Installation: npm install -g @github/mcp-cli
  - Configuration: Personal access token or GitHub App
  - Testing: Repository access verification

✓ Sequential Thinking MCP
  - Purpose: Complex analysis and planning
  - Installation: npm install -g @sequential-thinking/mcp
  - Configuration: Claude integration setup
  - Testing: Analysis task execution
```

#### Framework-Specific MCPs
```
📱 **Installing Framework-Specific Tools...**

[If React/Next.js Selected]:
✓ Magic UI MCP
  - Purpose: Component generation and UI automation
  - Installation: npm install -g @magic-ui/mcp-react
  - Configuration: Project template setup
  - Testing: Component generation test

[If Vue/Nuxt Selected]:
✓ Vue Devtools MCP
  - Purpose: Vue component debugging and optimization
  - Installation: npm install -g @vue/devtools-mcp
  - Configuration: Development environment setup
  - Testing: Component inspection test
```

#### Database MCPs
```
🗄️ **Installing Database Integration Tools...**

[If PostgreSQL Selected]:
✓ PostgreSQL MCP
  - Purpose: Database management and query optimization
  - Installation: npm install -g @postgresql/mcp-admin
  - Configuration: Database connection setup
  - Testing: Connection and query test

[If MongoDB Selected]:
✓ MongoDB Compass MCP
  - Purpose: Database visualization and management
  - Installation: npm install -g @mongodb/compass-mcp
  - Configuration: Connection string setup
  - Testing: Database access verification

[If Supabase Selected]:
✓ Supabase MCP
  - Purpose: Full-stack Supabase integration
  - Installation: npm install -g @supabase/mcp-integration
  - Configuration: Project URL and service key
  - Testing: Auth and database test
```

#### Cloud Service MCPs
```
☁️ **Installing Cloud Service Integrations...**

[If Digital Ocean Selected]:
✓ Digital Ocean MCP
  - Purpose: Droplet and service management
  - Installation: npm install -g @digitalocean/mcp-cli
  - Configuration: API token authentication
  - Testing: Service listing and access

[If AWS Selected]:
✓ AWS MCP Toolkit
  - Purpose: AWS service management and deployment
  - Installation: npm install -g @aws/mcp-toolkit
  - Configuration: IAM credentials setup
  - Testing: S3 and Lambda access verification

[If Google Cloud Selected]:
✓ Google Cloud MCP
  - Purpose: GCP service integration
  - Installation: npm install -g @google-cloud/mcp-integration
  - Configuration: Service account authentication
  - Testing: Cloud functions and storage access
```

#### Development Tools MCPs
```
🛠️ **Installing Development Workflow Tools...**

[If Linear Selected]:
✓ Linear MCP
  - Purpose: Issue tracking and project management
  - Installation: npm install -g @linear/mcp-integration
  - Configuration: API key and workspace setup
  - Testing: Issue creation and retrieval

[If Slack Selected]:
✓ Slack MCP
  - Purpose: Team notifications and collaboration
  - Installation: npm install -g @slack/mcp-bot
  - Configuration: Webhook URLs and bot tokens
  - Testing: Message sending and channel access

[If Sentry Selected]:
✓ Sentry MCP
  - Purpose: Error tracking and performance monitoring
  - Installation: npm install -g @sentry/mcp-monitoring
  - Configuration: DSN and project setup
  - Testing: Error capture and reporting
```

#### Browser Testing MCPs
```
🌐 **Installing Browser Testing Tools...**

[If Frontend Project Detected]:
✓ Playwright MCP
  - Purpose: Browser automation and testing
  - Installation: npm install -g @playwright/test
  - Configuration: Browser binaries and config
  - Testing: Basic browser automation test

✓ Puppeteer MCP (Alternative)
  - Purpose: Chrome browser automation
  - Installation: npm install -g puppeteer
  - Configuration: Chrome binary setup
  - Testing: Page screenshot and interaction

✓ Axe Accessibility MCP
  - Purpose: WCAG 2.1 AA compliance testing
  - Installation: npm install -g @axe-core/cli
  - Configuration: Accessibility rules setup
  - Testing: Accessibility scan verification

✓ Lighthouse MCP
  - Purpose: Performance and quality auditing
  - Installation: npm install -g lighthouse
  - Configuration: Audit settings and thresholds
  - Testing: Performance audit execution
```

### 6. Automated Installation Process

```
🚀 **Executing Automated MCP Installation...**

For each required MCP:
1. Check if already installed
2. Install via package manager
3. Configure authentication
4. Test connection
5. Document status

Installation Commands:
npm install -g [mcp-package]
claude-mcp configure [mcp-name] --config [config-file]
claude-mcp test [mcp-name]
```

### 7. Configuration and Authentication

```
🔐 **Configuring MCP Authentication...**

Setting up authentication for each MCP:

GitHub MCP:
- GitHub Personal Access Token required
- Scope: repo, workflow, admin:org
- Command: claude-mcp configure github --token $GITHUB_TOKEN

Digital Ocean MCP:
- API Token required from DO Control Panel
- Command: claude-mcp configure digitalocean --token $DO_API_TOKEN

Supabase MCP:
- Project URL and Service Key required
- Command: claude-mcp configure supabase --url $SUPABASE_URL --key $SERVICE_KEY

[Continue for all selected MCPs...]
```

### 8. Browser Testing Setup and Configuration

```
🌐 **Setting up Browser Testing Environment...**

[If Frontend Project Detected]:
Installing Playwright with browser binaries:
- Chrome/Chromium: Downloading stable version
- Firefox: Downloading latest ESR
- Safari/WebKit: Downloading latest stable
- Edge: Downloading latest stable

Creating Playwright configuration:
- Cross-browser testing setup
- Mobile device emulation
- Visual regression testing
- Accessibility testing integration
- Performance auditing

Setting up test directories:
- tests/e2e/ for end-to-end tests
- tests/screenshots/ for visual regression
- tests/accessibility/ for WCAG reports
- tests/performance/ for Lighthouse audits

Browser Testing Configuration Complete:
✓ Playwright: Cross-browser testing ready
✓ Puppeteer: Chrome automation ready
✓ Axe: Accessibility testing ready
✓ Lighthouse: Performance auditing ready
```

### 9. Connection Testing and Validation

```
🧪 **Testing MCP Connections...**

Running comprehensive tests:

✓ Context7: Fetching React documentation... SUCCESS (245ms)
✓ Perplexity: Research query test... SUCCESS (892ms)
✓ GitHub: Repository access test... SUCCESS (156ms)
✓ Sequential Thinking: Analysis task... SUCCESS (1.2s)
✓ Magic UI: Component generation... SUCCESS (543ms)
✓ Supabase: Database connection... SUCCESS (89ms)
✓ Digital Ocean: Droplet listing... SUCCESS (234ms)
✓ Linear: Issue retrieval... SUCCESS (445ms)
✓ Slack: Message posting... SUCCESS (167ms)
✓ Playwright: Browser automation test... SUCCESS (1.8s)
✓ Lighthouse: Performance audit... SUCCESS (2.1s)

Connection Summary:
- Total MCPs: 11
- Successful: 11
- Failed: 0
- Average Response Time: 428ms
```

### 10. Generate MCP Status Report

Create `.vibe/mcp-status.json`:
```json
{
  "timestamp": "2025-07-05T10:30:00Z",
  "project": "project-name",
  "total_mcps": 11,
  "successful_connections": 11,
  "failed_connections": 0,
  "mcps": {
    "context7": {
      "status": "connected",
      "version": "2.1.4",
      "last_test": "2025-07-05T10:29:45Z",
      "response_time": "245ms",
      "purpose": "Documentation fetching and research"
    },
    "perplexity": {
      "status": "connected", 
      "version": "1.8.2",
      "last_test": "2025-07-05T10:29:47Z",
      "response_time": "892ms",
      "purpose": "Real-time research and market analysis"
    },
    "github": {
      "status": "connected",
      "version": "3.2.1",
      "last_test": "2025-07-05T10:29:49Z", 
      "response_time": "156ms",
      "purpose": "Repository management and CI/CD"
    },
    "playwright": {
      "status": "connected",
      "version": "1.40.1",
      "last_test": "2025-07-05T10:29:52Z",
      "response_time": "1.8s",
      "purpose": "Cross-browser testing and automation",
      "browsers": ["chromium", "firefox", "webkit", "edge"]
    },
    "lighthouse": {
      "status": "connected",
      "version": "11.4.0",
      "last_test": "2025-07-05T10:29:54Z",
      "response_time": "2.1s",
      "purpose": "Performance auditing and optimization"
    }
  },
  "browser_testing": {
    "enabled": true,
    "playwright_config": "playwright.config.js",
    "test_directories": {
      "e2e": "tests/e2e/",
      "screenshots": "tests/screenshots/",
      "accessibility": "tests/accessibility/",
      "performance": "tests/performance/"
    },
    "supported_browsers": ["chromium", "firefox", "webkit", "edge"],
    "mobile_devices": ["iPhone 12", "Pixel 5", "iPad Pro"]
  },
  "configuration": {
    "auto_refresh": true,
    "health_check_interval": "5m",
    "retry_failed_connections": true,
    "browser_testing_enabled": true
  }
}
```

### 11. Generate MCP Documentation

Create `docs/02.5-mcp-configuration.md`:
```markdown
# MCP Configuration Documentation

## Installed MCPs

### Core MCPs
- **Context7**: Documentation fetching - Connected ✓
- **Perplexity**: Research automation - Connected ✓  
- **GitHub**: Repository management - Connected ✓
- **Sequential Thinking**: Complex analysis - Connected ✓

### Project-Specific MCPs
- **Magic UI**: Component generation - Connected ✓
- **Supabase**: Database integration - Connected ✓
- **Digital Ocean**: Cloud management - Connected ✓
- **Linear**: Project management - Connected ✓
- **Slack**: Team notifications - Connected ✓

### Browser Testing MCPs
- **Playwright**: Cross-browser testing - Connected ✓
- **Lighthouse**: Performance auditing - Connected ✓
- **Axe**: Accessibility testing - Connected ✓
- **Puppeteer**: Chrome automation - Connected ✓

## Browser Testing Configuration

### Playwright Setup
```js
// playwright.config.js
module.exports = {
  testDir: './tests/e2e',
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
    { name: 'Mobile Safari', use: devices['iPhone 12'] }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000'
  }
};
```

### Test Directory Structure
```
tests/
├── e2e/                 # End-to-end tests
├── screenshots/         # Visual regression
├── accessibility/       # WCAG compliance
└── performance/         # Lighthouse audits
```

### Available Browser Testing Commands
- `npm run test:e2e` - Run all browser tests
- `npm run test:visual` - Visual regression testing
- `npm run test:accessibility` - WCAG compliance
- `npm run test:performance` - Lighthouse audits

## Authentication Configuration

### Environment Variables Required
```env
GITHUB_TOKEN=ghp_xxx
DO_API_TOKEN=dop_v1_xxx  
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx
LINEAR_API_KEY=lin_api_xxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx
```

### MCP Health Monitoring
- Automatic health checks every 5 minutes
- Failed connections auto-retry 3 times
- Status dashboard: `/vibe-mcp-status`

## Troubleshooting

### Common Issues
1. **Authentication Failures**: Verify API keys in environment
2. **Network Timeouts**: Check internet connection and firewall
3. **Permission Errors**: Ensure proper API scopes
4. **Version Conflicts**: Update to latest MCP versions
5. **Browser Binary Issues**: Run `npx playwright install`

### Quick Fixes
```bash
# Reconnect all MCPs
claude-mcp reconnect --all

# Test specific MCP
claude-mcp test github

# Update MCP status
/vibe-mcp-status --refresh

# Reinstall browser binaries
npx playwright install

# Run browser test verification
npx playwright test --project=chromium tests/health-check.spec.js
```
```

### 11. Integration with Vibe Coding Workflow

```
🔗 **Integrating MCPs with Vibe Coding Process...**

Updating workflow integration:
- Step 3 (UX Design): Enable Perplexity for market research
- Step 4 (Design System): Enable Magic UI for component generation  
- Step 6 (Technical Spec): Enable Context7 for documentation
- Step 8 (Vertical Slices): Enable all project MCPs
- Step 9 (Claude.md): Include MCP configuration
- Step 10 (Service Init): Verify MCP connections

Auto-configuration completed for all subsequent steps.
```

### 12. Final Output Report

```
✅ MCP Auto-Installation Complete!

📊 **Installation Summary:**
- **Total MCPs Installed**: 11
- **Successful Connections**: 11  
- **Failed Connections**: 0
- **Installation Time**: 3m 42s
- **Average Response Time**: 428ms

🔧 **Configuration Status:**
- Authentication: All services authenticated
- Health Monitoring: Enabled (5min intervals)
- Auto-Retry: Enabled for failed connections
- Documentation: Generated and updated
- Browser Testing: Fully configured

🌐 **Browser Testing Ready:**
- **Cross-Browser Support**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iPhone 12, Pixel 5, iPad Pro
- **Visual Regression**: Screenshot comparison enabled
- **Accessibility**: WCAG 2.1 AA compliance testing
- **Performance**: Lighthouse auditing configured

🚀 **Ready for Enhanced Development!**

Your Vibe Coding project now has access to:
- Real-time documentation and research
- Automated component generation
- Seamless cloud service integration
- Project management automation
- Team collaboration tools
- Comprehensive browser testing suite
- Performance and accessibility validation

**Next Steps:**
1. 🎨 Continue to Step 3 (UX Design) with Perplexity research
2. 🔧 Run `/vibe-mcp-status` to monitor MCP health
3. 📖 Review `docs/02.5-mcp-configuration.md` for details
4. 🛠️ Use enhanced MCPs throughout development
5. 🌐 Run browser tests with `/vibe-validate-work --comprehensive`

**Quick Commands:**
- `/vibe-mcp-status` - Check MCP connection status
- `/vibe-mcp-reconnect` - Reconnect failed MCPs
- `/vibe-mcp-update` - Update all MCPs to latest versions
- `npm run test:e2e` - Run browser tests
- `npm run test:accessibility` - Check WCAG compliance

💡 **Pro Tip**: MCPs will auto-reconnect if you restart Claude Desktop. Your configuration is persistent and project-specific. Browser tests integrate seamlessly with the work validation agent.

🎉 **Your development environment is now supercharged with AI-powered automation and comprehensive testing!**
```

## Error Handling

### Missing Step 2 Documentation
```
❌ Cannot setup MCPs - Step 2 (Technical Architecture) not complete

**Required Documentation Missing:**
- docs/02-technical-architecture.md

**Solution:**
1. Complete Step 2 first: `/vibe-step-2-architecture`
2. Return to MCP setup: `/vibe-step-2.5-mcp-setup`

**Why This Matters:**
MCP selection depends on your technology stack decisions from Step 2.
```

### MCP Installation Failures
```
⚠️ Some MCPs failed to install:

**Failed MCPs:**
❌ Digital Ocean MCP - Network timeout
❌ Linear MCP - Authentication error

**Successful MCPs:**
✅ Context7, Perplexity, GitHub, Magic UI, Supabase

**Remediation Steps:**

1. **Digital Ocean MCP**:
   - Check internet connection
   - Verify DO API token: `curl -H "Authorization: Bearer $DO_API_TOKEN" https://api.digitalocean.com/v2/account`
   - Retry: `claude-mcp install digitalocean --force`

2. **Linear MCP**:
   - Verify API key in Linear settings
   - Check key permissions: Admin or Member required
   - Retry: `claude-mcp configure linear --key $LINEAR_API_KEY`

**Partial Setup Impact:**
- ✅ Core development functions available
- ⚠️ Cloud management limited (Digital Ocean)  
- ⚠️ Project management manual (Linear)
- 🔄 Can continue and retry failed MCPs later

**Continue Development:**
You can proceed with `/vibe-step-3-ux-design` while troubleshooting failed MCPs.
```

### Claude Desktop MCP Support Issues
```
⚠️ Claude Desktop MCP Support Not Detected

**Possible Issues:**
1. Claude Desktop version too old
2. MCP feature not enabled
3. System permissions issue

**Solutions:**
1. **Update Claude Desktop**:
   - Download latest version from anthropic.com
   - Restart Claude Desktop
   - Re-run `/vibe-step-2.5-mcp-setup`

2. **Enable MCP Support**:
   - Claude Desktop → Settings → Developer
   - Enable "Model Context Protocol"
   - Restart application

3. **Check System Permissions**:
   - Ensure Claude has network access
   - Check firewall settings
   - Verify npm global install permissions

**Fallback Mode:**
If MCP support unavailable, Vibe Coding will:
- Use built-in knowledge for development
- Provide manual research prompts
- Generate documentation without MCP assistance
- Mark MCP-dependent features as unavailable
```

## Quality Checklist
Before marking complete, ensure:
- [ ] Tech stack analysis completed successfully
- [ ] All required MCPs identified correctly
- [ ] Installation completed for core MCPs
- [ ] Authentication configured for all services
- [ ] Connection testing passed
- [ ] Status documentation generated
- [ ] Error handling for failed installations
- [ ] Integration with subsequent Vibe steps verified

## Integration Notes
This MCP auto-installation agent serves as the foundation for enhanced AI assistance throughout the Vibe Coding process. It ensures that all subsequent steps have access to the optimal set of MCP tools for research, development, and automation based on the project's specific technology stack and requirements.