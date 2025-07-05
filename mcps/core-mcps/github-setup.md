# GitHub MCP Setup Guide

## Overview
GitHub MCP provides seamless integration with GitHub repositories, enabling automated repository management, CI/CD workflows, issue tracking, and collaboration features. Essential for all Vibe Coding projects for version control automation and team coordination.

## Installation

### Automated Installation
```bash
# Via Vibe Coding Step 2.5
/vibe-step-2.5-mcp-setup

# GitHub MCP will be auto-selected and configured
```

### Manual Installation
```bash
# Install GitHub MCP
npm install -g @github/mcp-cli

# Verify installation
github-mcp --version
```

## Authentication Setup

### 1. Generate Personal Access Token (Recommended)
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Set expiration (90 days recommended)
4. Select required scopes:
   - ✅ `repo` - Full repository access
   - ✅ `workflow` - GitHub Actions access
   - ✅ `admin:org` - Organization management (if needed)
   - ✅ `project` - Project board access
   - ✅ `delete_repo` - Repository deletion (optional)
5. Copy the token (starts with `ghp_`)

### 2. Alternative: GitHub App (Enterprise)
```bash
# For organizations requiring enhanced security
# Create GitHub App at: https://github.com/settings/apps/new
# Install app to repositories
# Use app installation credentials
```

### 3. Configure Environment
```bash
# Add to .env.mcp
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Or configure directly
claude-mcp configure github --token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Verify Authentication
```bash
# Test connection
claude-mcp test github

# Expected output:
# ✅ GitHub MCP: Connected (156ms)
# ✅ Token: Valid (expires in 89 days)
# ✅ Rate Limits: 4,998/5,000 remaining
# ✅ User: your-username
```

## Usage in Vibe Coding

### Step Integration
GitHub MCP is automatically used in:
- **Init**: Repository creation and initial setup
- **All Steps**: Automatic commits and documentation updates
- **Step 8 (Vertical Slices)**: Branch management and feature tracking
- **Step 10 (Service Init)**: CI/CD pipeline configuration

### Command Patterns
```bash
# Repository management
/github create-repo --name "my-project" --private

# Issue management
/github create-issue --title "Implement auth system" --labels "feature,p1"

# Pull request automation
/github create-pr --branch "feature/auth" --title "Add authentication"

# Workflow management
/github trigger-workflow --name "deploy" --branch "main"
```

## Core Features

### 1. Repository Management
```bash
# Create new repository
/github create-repo --name "vibe-project" --description "AI-powered app" --private

# Clone repository
/github clone --repo "username/repo-name" --path "./local-path"

# Repository information
/github repo-info --repo "username/repo-name"

# List repositories
/github list-repos --user "username" --type "owner"
```

### 2. Branch Management
```bash
# Create feature branch
/github create-branch --name "feature/user-auth" --from "main"

# List branches
/github list-branches --repo "username/repo-name"

# Delete branch
/github delete-branch --name "feature/completed" --force

# Branch protection
/github protect-branch --branch "main" --require-reviews 2
```

### 3. Issue Tracking
```bash
# Create issue
/github create-issue --title "Add dark mode" --body "Users requesting dark theme" --labels "enhancement,ui"

# List issues
/github list-issues --state "open" --assignee "username"

# Update issue
/github update-issue --number 42 --state "closed" --comment "Fixed in v2.1"

# Issue templates
/github create-issue-template --name "bug-report" --title "Bug Report"
```

### 4. Pull Request Automation
```bash
# Create pull request
/github create-pr --head "feature/auth" --base "main" --title "Authentication System" --draft

# Review pull request
/github review-pr --number 15 --action "approve" --comment "LGTM!"

# Merge pull request
/github merge-pr --number 15 --method "squash" --delete-branch

# Auto-merge setup
/github enable-auto-merge --number 15 --method "squash"
```

### 5. GitHub Actions Integration
```bash
# List workflows
/github list-workflows

# Trigger workflow
/github run-workflow --name "CI" --branch "main" --inputs '{"environment": "staging"}'

# Workflow status
/github workflow-status --run-id 123456789

# Download workflow artifacts
/github download-artifacts --run-id 123456789 --path "./artifacts"
```

### 6. Release Management
```bash
# Create release
/github create-release --tag "v1.0.0" --title "First Release" --notes "Initial stable release"

# List releases
/github list-releases --repo "username/repo-name"

# Update release
/github update-release --tag "v1.0.0" --draft false --prerelease false
```

## Vibe Coding Integration Examples

### Project Initialization
```bash
# Automated during /vibe-init
/github create-repo --name "my-saas-project" --private --auto-init
/github add-topics --topics "saas,nextjs,typescript,vibe-coding"
/github create-branch --name "development" --from "main"
/github protect-branch --branch "main" --require-reviews 1
```

### Phase Development Workflow
```bash
# Step 8: Vertical Slices - Automatic branch creation
/github create-branch --name "phase-1-foundation" --from "development"
/github create-issue --title "Phase 1: Foundation" --body "Core infrastructure setup" --milestone "Phase 1"

# Automatic commits during development
/github commit --message "feat: add user authentication system" --files "./src/auth/*"
/github push --branch "phase-1-foundation"

# Phase completion
/github create-pr --head "phase-1-foundation" --base "development" --title "Phase 1: Foundation Complete"
```

### Documentation Automation
```bash
# Automatic documentation updates
/github commit --message "docs: update technical specification" --files "./docs/06-technical-specification.md"
/github create-pr --head "docs/update-specs" --base "main" --title "Update project documentation"
```

## Advanced Features

### Project Board Integration
```bash
# Create project board
/github create-project --name "Development Board" --description "Track development progress"

# Add cards to project
/github add-to-project --project-id 123 --issue-number 42 --column "In Progress"

# Move cards
/github move-project-card --card-id 456 --column "Done"
```

### Team Management
```bash
# Add collaborators
/github add-collaborator --username "teammate" --permission "push"

# Create team
/github create-team --name "developers" --description "Development team"

# Team repository access
/github add-team-repo --team "developers" --repo "my-project" --permission "admin"
```

### Security Features
```bash
# Enable security features
/github enable-vulnerability-alerts
/github enable-automated-security-fixes
/github enable-dependency-graph

# Security analysis
/github list-security-alerts
/github dismiss-security-alert --id 123 --reason "false-positive"
```

### Webhooks and Integrations
```bash
# Create webhook
/github create-webhook --url "https://api.myapp.com/github" --events "push,pull_request"

# List webhooks
/github list-webhooks

# Test webhook
/github test-webhook --id 123456
```

## Configuration Examples

### Vibe Coding Repository Setup
```yaml
# .github/workflows/vibe-coding.yml
name: Vibe Coding Workflow
on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Vibe Status Check
        run: npm run vibe:status
```

### Branch Protection Rules
```bash
# Main branch protection
/github protect-branch --branch "main" \
  --require-status-checks \
  --require-branches-up-to-date \
  --required-status-checks "ci,tests" \
  --require-review-from-codeowners \
  --dismiss-stale-reviews \
  --require-linear-history
```

### Issue Templates
```markdown
<!-- .github/ISSUE_TEMPLATE/feature.md -->
---
name: Feature Request
about: Suggest a new feature for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
Brief description of the feature

## Vibe Coding Step
Which step of the Vibe Coding process is this related to?
- [ ] Step 1: Ideation
- [ ] Step 2: Architecture
- [ ] Step 3: UX Design
- [ ] Step 4: Design System
- [ ] Step 5: Interface States
- [ ] Step 6: Technical Spec
- [ ] Step 7: Landing Page
- [ ] Step 8: Vertical Slices

## Implementation Details
How should this feature be implemented?

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
```

## Performance Optimization

### Rate Limiting
- **Authenticated**: 5,000 requests/hour
- **GraphQL API**: 5,000 points/hour
- **Search API**: 30 requests/minute
- **Enterprise**: Higher limits available

### Optimization Strategies
1. **Use GraphQL**: Reduce API calls with precise queries
2. **Batch operations**: Group related API calls
3. **Cache responses**: Store frequently accessed data
4. **Conditional requests**: Use ETags for unchanged data

### Response Time Targets
- **Repository operations**: < 300ms
- **Issue/PR creation**: < 500ms
- **File operations**: < 200ms
- **Workflow triggers**: < 1s

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
```bash
Error: Bad credentials

Solutions:
1. Verify token hasn't expired
2. Check token permissions/scopes
3. Regenerate token if needed
4. Ensure correct environment variable:
   echo $GITHUB_TOKEN
```

#### 2. Rate Limit Exceeded
```bash
Error: API rate limit exceeded

Solutions:
1. Check current limits: /github rate-limit
2. Wait for reset (shown in error)
3. Optimize API usage patterns
4. Consider GitHub Enterprise for higher limits
```

#### 3. Permission Denied
```bash
Error: Resource not accessible by integration

Solutions:
1. Check repository permissions
2. Verify token scopes include required permissions
3. Ensure you're a collaborator on private repos
4. Check organization restrictions
```

#### 4. Repository Not Found
```bash
Error: Not Found

Solutions:
1. Verify repository name/owner spelling
2. Check if repository is private and you have access
3. Ensure repository exists
4. Check for typos in commands
```

## Security Best Practices

### Token Management
- ✅ Use tokens with minimal required scopes
- ✅ Set token expiration (90 days max)
- ✅ Rotate tokens regularly
- ✅ Store tokens in environment variables
- ❌ Never commit tokens to repositories
- ❌ Don't share tokens in chat/email

### Repository Security
- ✅ Enable branch protection on main branches
- ✅ Require code reviews
- ✅ Enable security alerts
- ✅ Use signed commits
- ❌ Allow force pushes to protected branches
- ❌ Disable security features

### Workflow Security
- ✅ Pin action versions to specific commits
- ✅ Use secrets for sensitive data
- ✅ Limit workflow permissions
- ✅ Review third-party actions
- ❌ Use untrusted actions
- ❌ Expose secrets in logs

## Monitoring and Analytics

### Usage Tracking
```bash
# API usage statistics
/github usage --period "last-30-days"

# Repository activity
/github repo-stats --repo "username/repo-name"

# Team productivity metrics
/github team-metrics --team "developers"
```

### Performance Monitoring
```bash
# API response times
/github metrics --response-times

# Success rate tracking
/github metrics --success-rate

# Error rate analysis
/github metrics --error-rate
```

## Enterprise Features

### Advanced Security
- SAML single sign-on
- Advanced audit logging
- IP allowlisting
- Required two-factor authentication

### Compliance
- SOC 2 Type II certified
- GDPR compliant
- HIPAA eligible configurations
- Custom data retention policies

### Support
- Priority support
- Dedicated account manager
- SLA guarantees
- Custom training sessions

## Support and Resources

### Documentation
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [GitHub Actions](https://docs.github.com/en/actions)

### Community
- [GitHub Community Forum](https://github.community)
- [GitHub Developer Discord](https://discord.gg/github)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/github)

### Support Channels
- Community support: GitHub Community Forum
- Pro/Team support: GitHub Support Portal
- Enterprise support: Dedicated support team
- Emergency support: 24/7 for Enterprise

---

**GitHub MCP powers your development workflow with seamless repository automation! 🚀**