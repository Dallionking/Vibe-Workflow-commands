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

### 8. Connection Testing and Validation

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

Connection Summary:
- Total MCPs: 9
- Successful: 9
- Failed: 0
- Average Response Time: 341ms
```

### 9. Generate MCP Status Report

Create `.vibe/mcp-status.json`:
```json
{
  "timestamp": "2025-07-05T10:30:00Z",
  "project": "project-name",
  "total_mcps": 9,
  "successful_connections": 9,
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
    }
  },
  "configuration": {
    "auto_refresh": true,
    "health_check_interval": "5m",
    "retry_failed_connections": true
  }
}
```

### 10. Generate MCP Documentation

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

### Quick Fixes
```bash
# Reconnect all MCPs
claude-mcp reconnect --all

# Test specific MCP
claude-mcp test github

# Update MCP status
/vibe-mcp-status --refresh
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
- **Total MCPs Installed**: 9
- **Successful Connections**: 9  
- **Failed Connections**: 0
- **Installation Time**: 2m 34s
- **Average Response Time**: 341ms

🔧 **Configuration Status:**
- Authentication: All services authenticated
- Health Monitoring: Enabled (5min intervals)
- Auto-Retry: Enabled for failed connections
- Documentation: Generated and updated

🚀 **Ready for Enhanced Development!**

Your Vibe Coding project now has access to:
- Real-time documentation and research
- Automated component generation
- Seamless cloud service integration
- Project management automation
- Team collaboration tools

**Next Steps:**
1. 🎨 Continue to Step 3 (UX Design) with Perplexity research
2. 🔧 Run `/vibe-mcp-status` to monitor MCP health
3. 📖 Review `docs/02.5-mcp-configuration.md` for details
4. 🛠️ Use enhanced MCPs throughout development

**Quick Commands:**
- `/vibe-mcp-status` - Check MCP connection status
- `/vibe-mcp-reconnect` - Reconnect failed MCPs
- `/vibe-mcp-update` - Update all MCPs to latest versions

💡 **Pro Tip**: MCPs will auto-reconnect if you restart Claude Desktop. Your configuration is persistent and project-specific.

🎉 **Your development environment is now supercharged with AI-powered automation!**
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