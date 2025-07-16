# MCP Installation Guide - Automated Setup for Claude Code

This guide provides automated MCP (Model Context Protocol) installation commands for Claude Code instances. All commands include API keys and are ready for direct execution.

## Prerequisites

Before installation, ensure you have:
- Node.js (v16+) and npm installed
- Python with uv package manager installed (`pip install uv`)
- Claude Code CLI configured

## Quick Installation Commands

Copy and run each command directly in Claude Code. These commands use the proper `claude mcp add` syntax:

### 1. GitHub MCP - Repository Management
```bash
claude mcp add github -e GITHUB_TOKEN="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" -- npx -y @modelcontextprotocol/server-github
```

### 2. Supabase MCP - Database Operations
```bash
claude mcp add supabase-mcp-server -- npx -y @supabase/mcp-server-supabase@latest --access-token sbp_a33b0ab23dbdc69b058cb871c019911cdfdf8c83
```

### 3. Web Eval Agent MCP - UI/UX Testing
```bash
claude mcp add web-eval-agent -e OPERATIVE_API_KEY="op-d1WSdI1cxNEU1SeVnIgExGXTbSyJ5PMArVy3S-3bEhc" -- uvx --refresh-package webEvalAgent --from git+https://github.com/Operative-Sh/web-eval-agent.git webEvalAgent
```

### 4. Perplexity Ask MCP - AI Conversations (Sonar API)
```bash
claude mcp add perplexity-ask -e PERPLEXITY_API_KEY="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" -- npx -y server-perplexity-ask
```

### 5. Perplexity MCP - Web Search
```bash
claude mcp add perplexity-mcp -e PERPLEXITY_API_KEY="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" -e PERPLEXITY_MODEL="sonar" -- uvx perplexity-mcp
```

### 6. Context7 MCP - Library Documentation
```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

### 7. Sequential Thinking MCP - Advanced Problem Solving
```bash
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

### 8. TaskMaster AI MCP - Task Management
```bash
claude mcp add taskmaster-ai -e ANTHROPIC_API_KEY="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" -e PERPLEXITY_API_KEY="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" -e OPENAI_API_KEY="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" -- npx -y --package=task-master-ai task-master-ai
```

### 9. Shadcn Registry MCP - UI Components
```bash
claude mcp add shadcn -e REGISTRY_URL="https://animate-ui.com/r/registry.json" -- npx -y shadcn@canary registry:mcp
```


### 11. Playwright MCP - Browser Automation
```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```
### 13. GitHub Repo MCP - Enhanced Repository Tools
```bash
claude mcp add github-repo-mcp -- npx -y github-repo-mcp
```

### 14. GCP MCP - Google Cloud Platform
```bash
claude mcp add gcp-mcp -e GOOGLE_CLOUD_PROJECT="elegant-fort-454200-p1" -- npx -y gcp-mcp
```

### 15. Sentry MCP - Error Monitoring (Remote SSE)
```bash
claude mcp add sentry -e SENTRY_AUTH_TOKEN="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" -- npx mcp-remote@latest https://mcp.sentry.dev/sse
```

### 16. Bright Data MCP - Web Scraping
```bash
claude mcp add bright-data -e API_TOKEN="b20ffa8418315037b8d3b845095e177ab12013f440368331f92b4967a12461b8" -e WEB_UNLOCKER_ZONE="mcp_unlocker" -e BROWSER_ZONE="mcp_browser" -e RATE_LIMIT="100/1h" -- npx @brightdata/mcp
```

### 17. Supermemory MCP - Shared Memory Workspace (Remote SSE)
```bash
claude mcp add supermemory --url https://mcp.supermemory.ai/69KypfM_PMB_HxOk281fy/sse
```

## Batch Installation Script

To install all MCPs at once, run these commands sequentially:

```bash
# Core Development Tools
claude mcp add github -e GITHUB_TOKEN="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" -- npx -y @modelcontextprotocol/server-github
claude mcp add supabase-mcp-server -- npx -y @supabase/mcp-server-supabase@latest --access-token sbp_a33b0ab23dbdc69b058cb871c019911cdfdf8c83
claude mcp add ide -- code --verbose
claude mcp add github-repo-mcp -- npx -y github-repo-mcp

# AI and Search Tools
claude mcp add perplexity-ask -e PERPLEXITY_API_KEY="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" -- npx -y server-perplexity-ask
claude mcp add perplexity-mcp -e PERPLEXITY_API_KEY="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" -e PERPLEXITY_MODEL="sonar" -- uvx perplexity-mcp
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking

# Testing and Quality Tools
claude mcp add web-eval-agent -e OPERATIVE_API_KEY="op-d1WSdI1cxNEU1SeVnIgExGXTbSyJ5PMArVy3S-3bEhc" -- uvx --refresh-package webEvalAgent --from git+https://github.com/Operative-Sh/web-eval-agent.git webEvalAgent
claude mcp add playwright -- npx @playwright/mcp@latest
claude mcp add eslint-linter -- npx @eslint/mcp@latest

# Project Management
claude mcp add taskmaster-ai -e ANTHROPIC_API_KEY="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" -e PERPLEXITY_API_KEY="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" -e OPENAI_API_KEY="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" -- npx -y --package=task-master-ai task-master-ai

# UI and Cloud Services
claude mcp add shadcn -e REGISTRY_URL="https://animate-ui.com/r/registry.json" -- npx -y shadcn@canary registry:mcp
claude mcp add gcp-mcp -e GOOGLE_CLOUD_PROJECT="elegant-fort-454200-p1" -- npx -y gcp-mcp

# Monitoring and Data Services
claude mcp add sentry -e SENTRY_AUTH_TOKEN="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" -- npx mcp-remote@latest https://mcp.sentry.dev/sse
claude mcp add bright-data -e API_TOKEN="b20ffa8418315037b8d3b845095e177ab12013f440368331f92b4967a12461b8" -e WEB_UNLOCKER_ZONE="mcp_unlocker" -e BROWSER_ZONE="mcp_browser" -e RATE_LIMIT="100/1h" -- npx @brightdata/mcp
claude mcp add supermemory --url https://mcp.supermemory.ai/69KypfM_PMB_HxOk281fy/sse
```

## Special Installation: GitLab MCP (Requires Local Build)

GitLab MCP requires building from source. Follow these steps:

```bash
# Step 1: Clone and build
git clone https://github.com/zereight/gitlab-mcp.git
cd gitlab-mcp
npm install
npm run build

# Step 2: Add to Claude (run from the gitlab-mcp directory)
claude mcp add gitlab-mcp \
  -e GITLAB_PERSONAL_ACCESS_TOKEN="glpat-Nz5XcN2-zrSYnxL8CEd2" \
  -e GITLAB_API_URL="https://gitlab.com/api/v4" \
  -e GITLAB_READ_ONLY_MODE="false" \
  -e USE_GITLAB_WIKI="true" \
  -e USE_MILESTONE="true" \
  -e USE_PIPELINE="true" \
  -- node $(pwd)/build/index.js
```

## Verification

After installation, verify all MCPs are properly installed:

```bash
# List all installed MCPs
claude mcp list

# Check if specific MCPs are responding
claude mcp test github
claude mcp test supabase-mcp-server
```

## Troubleshooting

### Python-based MCPs (Web Eval Agent, Perplexity MCP)
If these fail to install:
```bash
# Clear uv cache and reinstall
uv cache clean
# Then re-run the installation command
```

### Web Eval Agent Specific
If browser automation fails:
```bash
# Install Playwright browsers
uvx --with playwright playwright install --with-deps
```

### General MCP Issues
To reinstall a specific MCP:
```bash
# Remove the MCP
claude mcp remove [mcp-name]
# Then re-run the installation command
```

### GitLab MCP Path Issues
If GitLab MCP shows "module not found":
```bash
# Use absolute paths
claude mcp add gitlab-mcp \
  -e GITLAB_PERSONAL_ACCESS_TOKEN="glpat-Nz5XcN2-zrSYnxL8CEd2" \
  -e GITLAB_API_URL="https://gitlab.com/api/v4" \
  -e GITLAB_READ_ONLY_MODE="false" \
  -- /usr/local/bin/node /absolute/path/to/gitlab-mcp/build/index.js
```

## API Keys Reference

All API keys are included in the installation commands above. These keys are configured for the STOIC project and should remain secure.

| Service | Key Type | Purpose |
|---------|----------|---------|
| GitHub | Personal Access Token | Repository operations |
| Supabase | Service Role Key | Database operations |
| Operative | API Key | Web UI/UX testing |
| Perplexity | API Keys (2) | AI chat & web search |
| Anthropic | API Key | TaskMaster AI |
| OpenAI | API Key | TaskMaster AI |
| GCP | Project ID | Google Cloud services |
| Sentry | Auth Token | Error monitoring |
| Bright Data | API Token | Web scraping |
| GitLab | Personal Access Token | GitLab operations |

## Notes for Claude Code Instances

1. Run commands exactly as shown - they include all necessary API keys
2. Install MCPs in the order listed for best results
3. Python-based MCPs require `uv` to be installed first
4. GitLab MCP requires manual build steps before installation
5. Some MCPs use remote SSE endpoints (Sentry, Supermemory) - no local installation needed
6. VS Code must be installed for the IDE MCP to work properly

This guide is designed for automated execution. Simply copy and run the commands in sequence.