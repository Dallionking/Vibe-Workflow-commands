# MCP Installation Guide - Vibe Coding Claude

## Overview
This guide provides comprehensive instructions for installing and configuring Model Context Protocol (MCP) tools for optimal Vibe Coding development experience. MCPs extend Claude's capabilities with specialized tools for research, documentation, service integration, and automation.

## Quick Start

### Automated Installation (Recommended)
```bash
# Run Step 2.5 to auto-install MCPs based on your tech stack
/vibe-step-2.5-mcp-setup
```

### Manual Installation
If you prefer manual control or need to troubleshoot, use the guides below.

## MCP Categories

### 🔧 Core MCPs (Always Required)
Essential tools for all Vibe Coding projects:

| MCP | Purpose | Installation | Guide |
|-----|---------|-------------|-------|
| **Context7** | Documentation fetching | `npm install -g @context7/mcp-client` | [Guide](core-mcps/context7-setup.md) |
| **Perplexity** | Real-time research | `npm install -g @perplexity/mcp-integration` | [Guide](core-mcps/perplexity-setup.md) |
| **GitHub** | Repository management | `npm install -g @github/mcp-cli` | [Guide](core-mcps/github-setup.md) |
| **Sequential Thinking** | Complex analysis | `npm install -g @sequential-thinking/mcp` | [Guide](core-mcps/sequential-thinking-setup.md) |

### 🎨 Frontend MCPs
Framework-specific development tools:

| Framework | MCP | Purpose | Guide |
|-----------|-----|---------|-------|
| React/Next.js | Magic UI | Component generation | [Guide](service-mcps/magic-ui-setup.md) |
| Vue/Nuxt | Vue Devtools | Component debugging | [Guide](service-mcps/vue-devtools-setup.md) |
| Angular | Angular DevKit | CLI automation | [Guide](service-mcps/angular-devkit-setup.md) |

### 🗄️ Database MCPs
Database integration and management:

| Database | MCP | Purpose | Guide |
|----------|-----|---------|-------|
| PostgreSQL | PostgreSQL Admin | Database management | [Guide](service-mcps/postgresql-setup.md) |
| MongoDB | Compass MCP | Database visualization | [Guide](service-mcps/mongodb-setup.md) |
| Supabase | Supabase Integration | Full-stack integration | [Guide](service-mcps/supabase-setup.md) |
| Firebase | Firebase Tools | Google services | [Guide](service-mcps/firebase-setup.md) |

### ☁️ Cloud Service MCPs
Cloud platform integrations:

| Provider | MCP | Purpose | Guide |
|----------|-----|---------|-------|
| Digital Ocean | DO CLI | Droplet management | [Guide](service-mcps/digital-ocean-setup.md) |
| AWS | AWS Toolkit | Service management | [Guide](service-mcps/aws-setup.md) |
| Google Cloud | GCP Integration | GCP services | [Guide](service-mcps/google-cloud-setup.md) |
| Vercel | Vercel CLI | Deployment automation | [Guide](service-mcps/vercel-setup.md) |

### 🛠️ Development Tool MCPs
Project management and collaboration:

| Tool | MCP | Purpose | Guide |
|------|-----|---------|-------|
| Linear | Linear Integration | Issue tracking | [Guide](service-mcps/linear-setup.md) |
| Slack | Slack Bot | Team notifications | [Guide](service-mcps/slack-setup.md) |
| Sentry | Error Tracking | Monitoring integration | [Guide](service-mcps/sentry-setup.md) |
| Jira | Jira Connector | Enterprise PM | [Guide](service-mcps/jira-setup.md) |

## System Requirements

### Prerequisites
- **Claude Desktop**: Latest version with MCP support enabled
- **Node.js**: Version 16+ for npm-based MCPs
- **Internet Connection**: For downloading and authentication
- **System Permissions**: Admin rights for global installations

### Platform Support
- ✅ **macOS**: Full support (Intel & Apple Silicon)
- ✅ **Windows**: Full support (Windows 10+)
- ✅ **Linux**: Full support (Ubuntu 20.04+, other distros)

## Installation Methods

### Method 1: Vibe Coding Auto-Setup (Recommended)
```bash
# Complete Steps 1-2 first
/vibe-step-1-ideation
/vibe-step-2-architecture

# Auto-install based on tech stack
/vibe-step-2.5-mcp-setup
```

**Advantages:**
- Analyzes your tech stack automatically
- Installs only required MCPs
- Configures authentication
- Tests connections
- Generates documentation

### Method 2: Interactive Installation Script
```bash
# Run interactive installer
node mcps/installation-scripts/interactive-installer.js

# Follow prompts to select MCPs
# Automatic configuration and testing
```

### Method 3: Manual Installation
```bash
# Install MCPs individually
npm install -g @context7/mcp-client
npm install -g @perplexity/mcp-integration
npm install -g @github/mcp-cli

# Configure each MCP
claude-mcp configure context7 --api-key YOUR_KEY
claude-mcp configure perplexity --api-key YOUR_KEY
claude-mcp configure github --token YOUR_TOKEN

# Test connections
claude-mcp test --all
```

### Method 4: Batch Installation
```bash
# Install all core MCPs at once
bash mcps/installation-scripts/install-core-mcps.sh

# Install service-specific MCPs
bash mcps/installation-scripts/install-service-mcps.sh [service-list]
```

## Authentication Setup

### Environment Variables
Create `.env.mcp` in your project root:
```env
# Core MCPs
CONTEXT7_API_KEY=ctx7_xxxxxxxx
PERPLEXITY_API_KEY=pplx_xxxxxxxx
GITHUB_TOKEN=ghp_xxxxxxxx
SEQUENTIAL_THINKING_KEY=st_xxxxxxxx

# Service MCPs  
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxxxxx
DO_API_TOKEN=dop_v1_xxxxxxxx
LINEAR_API_KEY=lin_api_xxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx

# Cloud Services
AWS_ACCESS_KEY_ID=AKIAXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxx
GCP_SERVICE_ACCOUNT_KEY=/path/to/service-account.json
```

### Security Best Practices
- ✅ Use environment variables, never hardcode keys
- ✅ Rotate API keys regularly (30-90 days)
- ✅ Use least-privilege access scopes
- ✅ Store keys in secure credential managers
- ❌ Never commit keys to version control
- ❌ Avoid sharing keys in chat/email

### Key Sources
- **Context7**: [Dashboard](https://context7.ai/dashboard)
- **Perplexity**: [API Settings](https://perplexity.ai/settings/api)
- **GitHub**: Settings → Developer settings → Personal access tokens
- **Supabase**: Project → Settings → API
- **Digital Ocean**: API → Tokens/Keys

## Testing and Validation

### Quick Health Check
```bash
# Test all installed MCPs
claude-mcp test --all

# Test specific MCP
claude-mcp test github

# Get detailed status
claude-mcp status --verbose
```

### Connection Validation
```bash
# Validate with actual operations
claude-mcp validate context7 --fetch-docs react
claude-mcp validate perplexity --search "AI development trends"
claude-mcp validate github --list-repos
claude-mcp validate supabase --test-connection
```

### Performance Benchmarks
```bash
# Run performance tests
claude-mcp benchmark --all

# Expected response times:
# Context7: < 500ms
# Perplexity: < 2s
# GitHub: < 300ms
# Database MCPs: < 200ms
```

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
```bash
Error: MCP authentication failed for [service]

Solutions:
1. Verify API key is correct and not expired
2. Check environment variable name matches exactly
3. Ensure API key has required permissions
4. Test key directly with service API:
   curl -H "Authorization: Bearer $API_KEY" [service-endpoint]
```

#### 2. Network Connectivity
```bash
Error: Unable to connect to MCP service

Solutions:
1. Check internet connection
2. Verify firewall settings allow MCP traffic
3. Test direct connection:
   ping [mcp-service-domain]
4. Check proxy settings if behind corporate firewall
```

#### 3. Permission Errors
```bash
Error: Permission denied installing MCP

Solutions:
1. Run with sudo (Linux/Mac): sudo npm install -g [mcp]
2. Configure npm global directory: npm config set prefix ~/.npm-global
3. Use alternative installation: npx [mcp-command]
4. Check system administrator policies
```

#### 4. Version Conflicts
```bash
Error: MCP version incompatible with Claude Desktop

Solutions:
1. Update Claude Desktop to latest version
2. Update MCP to compatible version: npm update -g [mcp]
3. Check compatibility matrix in documentation
4. Use legacy version if needed: npm install -g [mcp]@[version]
```

### Diagnostic Commands
```bash
# System diagnostics
claude-mcp doctor

# Detailed system info
claude-mcp info --system

# Export configuration for support
claude-mcp export-config --support
```

### Getting Help
1. **Vibe Coding Issues**: [GitHub Issues](https://github.com/vibe-coding/claude/issues)
2. **Claude Desktop**: [Anthropic Support](https://support.anthropic.com)
3. **MCP-Specific**: Check individual MCP documentation
4. **Community**: [Discord](https://discord.gg/vibe-coding)

## Advanced Configuration

### Custom MCP Development
```bash
# Create custom MCP for your project
claude-mcp create --name custom-project-mcp
claude-mcp develop --watch
claude-mcp publish --registry local
```

### Performance Optimization
```env
# MCP performance settings
MCP_CACHE_ENABLED=true
MCP_CACHE_TTL=300
MCP_RETRY_ATTEMPTS=3
MCP_TIMEOUT=30000
MCP_CONCURRENT_REQUESTS=5
```

### Load Balancing
```bash
# Configure multiple MCP instances
claude-mcp cluster --instances 3
claude-mcp load-balance --strategy round-robin
```

## Integration with Vibe Coding Steps

### Step Integration Matrix
| Vibe Step | Primary MCPs | Optional MCPs |
|-----------|-------------|---------------|
| Step 1 (Ideation) | Perplexity | Context7 |
| Step 2 (Architecture) | Context7, Perplexity | Service MCPs |
| Step 3 (UX Design) | Perplexity | Magic UI |
| Step 4 (Design System) | Context7 | Magic UI |
| Step 5 (Interface States) | Magic UI | Context7 |
| Step 6 (Technical Spec) | Context7 | All Service MCPs |
| Step 7 (Landing Page) | Perplexity | Context7 |
| Step 8 (Vertical Slices) | All MCPs | TaskMaster |
| Step 9 (Claude.md) | Sequential Thinking | All MCPs |
| Step 10 (Service Init) | All Service MCPs | All MCPs |

### Automatic MCP Selection
The Step 2.5 agent automatically selects MCPs based on:
- **Frontend Framework**: React → Magic UI, Vue → Vue Devtools
- **Backend Technology**: Node.js → GitHub, Python → GitHub + Context7
- **Database Choice**: PostgreSQL → PostgreSQL MCP, Supabase → Supabase MCP
- **Cloud Provider**: AWS → AWS Toolkit, DO → Digital Ocean MCP
- **Project Management**: Linear → Linear MCP, Jira → Jira MCP

## Maintenance

### Regular Updates
```bash
# Update all MCPs monthly
npm update -g @context7/mcp-client
npm update -g @perplexity/mcp-integration
# ... or use update script
bash mcps/installation-scripts/update-all-mcps.sh
```

### Health Monitoring
```bash
# Set up automated health checks
crontab -e
# Add: */5 * * * * claude-mcp health-check --alert-on-failure
```

### Backup Configuration
```bash
# Backup MCP configuration
claude-mcp backup --output mcp-config-backup.json

# Restore configuration
claude-mcp restore --input mcp-config-backup.json
```

## Migration Guide

### From Manual to Automated Setup
1. Document current MCP configuration
2. Run `/vibe-step-2.5-mcp-setup`
3. Compare configurations
4. Migrate any custom settings
5. Test all functionality

### Upgrading Claude Desktop
1. Backup current MCP configuration
2. Update Claude Desktop
3. Verify MCP compatibility
4. Reinstall incompatible MCPs
5. Restore configuration

---

## Quick Reference

### Essential Commands
```bash
# Status and health
/vibe-mcp-status                    # Check MCP status
claude-mcp test --all               # Test all connections
claude-mcp doctor                   # System diagnostics

# Installation and updates
/vibe-step-2.5-mcp-setup           # Auto-install MCPs
npm update -g [mcp-name]           # Update specific MCP
bash update-all-mcps.sh            # Update all MCPs

# Configuration
claude-mcp configure [mcp] --key [key]  # Configure authentication
claude-mcp validate [mcp]               # Validate configuration
claude-mcp benchmark --all              # Performance testing
```

### Support Resources
- 📖 [Individual MCP Guides](core-mcps/) 
- 🛠️ [Installation Scripts](installation-scripts/)
- 🧪 [Validation Tools](mcp-validator.md)
- 💬 [Community Support](https://discord.gg/vibe-coding)
- 🐛 [Report Issues](https://github.com/vibe-coding/claude/issues)

**Your development environment will be supercharged with AI-powered automation once MCPs are properly configured! 🚀**