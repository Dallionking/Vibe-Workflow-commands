# Context7 MCP Setup Guide

## Overview
Context7 is a core MCP tool that provides real-time documentation fetching and research capabilities. Essential for all Vibe Coding projects for accessing up-to-date framework documentation, best practices, and technical specifications.

## Installation

### Automated Installation
```bash
# Via Vibe Coding Step 2.5
/vibe-step-2.5-mcp-setup

# Context7 will be auto-selected and configured
```

### Manual Installation
```bash
# Install Context7 MCP
npm install -g @context7/mcp-client

# Verify installation
context7 --version
```

## Authentication Setup

### 1. Get API Key
1. Visit [Context7 Dashboard](https://context7.ai/dashboard)
2. Create account or sign in
3. Navigate to API Keys
4. Generate new API key
5. Copy the key (starts with `ctx7_`)

### 2. Configure Environment
```bash
# Add to .env.mcp
CONTEXT7_API_KEY=ctx7_xxxxxxxxxxxxxxxx

# Or configure directly
claude-mcp configure context7 --api-key ctx7_xxxxxxxxxxxxxxxx
```

### 3. Verify Authentication
```bash
# Test connection
claude-mcp test context7

# Expected output:
# ✅ Context7 MCP: Connected (245ms)
# ✅ API Key: Valid
# ✅ Rate Limits: 1000/day remaining
```

## Usage in Vibe Coding

### Step Integration
Context7 is automatically used in:
- **Step 2 (Architecture)**: Framework documentation and best practices
- **Step 4 (Design System)**: Component library research
- **Step 6 (Technical Spec)**: API documentation and implementation guides
- **Step 8 (Vertical Slices)**: Framework-specific patterns

### Command Patterns
```bash
# Fetch documentation for specific library
/context7 library="react" topic="hooks-best-practices"

# Get latest version information
/context7 library="nextjs" topic="app-router-migration"

# Research implementation patterns
/context7 library="tailwindcss" topic="component-variants"
```

## Available Libraries

### Frontend Frameworks
- `react` - React.js documentation and patterns
- `vue` - Vue.js framework docs
- `angular` - Angular framework
- `svelte` - Svelte framework
- `nextjs` - Next.js full-stack framework
- `nuxtjs` - Nuxt.js Vue framework

### Backend Frameworks
- `express` - Express.js Node framework
- `fastapi` - FastAPI Python framework
- `django` - Django Python framework
- `rails` - Ruby on Rails
- `nestjs` - NestJS Node framework
- `spring` - Spring Boot Java

### Databases
- `postgresql` - PostgreSQL database
- `mongodb` - MongoDB database
- `mysql` - MySQL database
- `redis` - Redis cache
- `elasticsearch` - Elasticsearch search

### DevOps & Tools
- `docker` - Docker containerization
- `kubernetes` - Kubernetes orchestration
- `terraform` - Infrastructure as code
- `jenkins` - CI/CD automation
- `github-actions` - GitHub workflows

## Common Use Cases

### 1. Architecture Research
```bash
# Research framework comparison
/context7 library="react" topic="performance-comparison-vue"
/context7 library="nextjs" topic="ssr-vs-ssg-performance"

# Get latest recommendations
/context7 library="nodejs" topic="best-practices-2024"
```

### 2. Implementation Guidance
```bash
# Fetch specific API documentation
/context7 library="supabase" topic="authentication-setup"
/context7 library="stripe" topic="webhook-implementation"

# Get code examples
/context7 library="react" topic="custom-hooks-patterns"
```

### 3. Troubleshooting
```bash
# Find solutions to common problems
/context7 library="nextjs" topic="hydration-errors"
/context7 library="postgresql" topic="connection-pooling-issues"

# Get migration guides
/context7 library="react" topic="class-to-hooks-migration"
```

## Advanced Features

### Topic Filtering
```bash
# Specific version documentation
/context7 library="react" topic="v18-concurrent-features"

# Platform-specific docs
/context7 library="reactnative" topic="ios-specific-features"

# Performance optimization
/context7 library="nextjs" topic="bundle-optimization"
```

### Batch Requests
```bash
# Multiple related topics
/context7 batch="[
  {library: 'react', topic: 'state-management'},
  {library: 'redux', topic: 'rtk-query'},
  {library: 'zustand', topic: 'typescript-integration'}
]"
```

### Caching Strategy
```bash
# Check cache status
context7 cache status

# Clear cache
context7 cache clear

# Set cache duration
context7 cache set-ttl 3600  # 1 hour
```

## Performance Optimization

### Response Time Targets
- **Fast queries**: < 300ms (cached results)
- **Fresh queries**: < 800ms (API requests)
- **Batch queries**: < 1.5s (multiple requests)

### Rate Limiting
- **Free tier**: 1,000 requests/day
- **Pro tier**: 10,000 requests/day
- **Enterprise**: Unlimited

### Optimization Tips
1. **Use caching**: Enable local caching for repeated queries
2. **Batch requests**: Group related documentation fetches
3. **Specific topics**: Use precise topic names for faster results
4. **Version pinning**: Specify framework versions when needed

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
```bash
Error: Context7 API key invalid

Solutions:
1. Verify API key format (should start with ctx7_)
2. Check key hasn't expired in dashboard
3. Regenerate key if necessary
4. Ensure environment variable is loaded:
   echo $CONTEXT7_API_KEY
```

#### 2. Rate Limit Exceeded
```bash
Error: Rate limit exceeded (1000/day)

Solutions:
1. Check current usage: context7 usage
2. Upgrade to Pro tier for higher limits
3. Implement request caching
4. Optimize query frequency
```

#### 3. Library Not Found
```bash
Error: Library 'xyz' not supported

Solutions:
1. Check supported libraries: context7 libraries
2. Use similar/alternative library
3. Request library addition via support
4. Use general programming topics
```

#### 4. Network Connectivity
```bash
Error: Unable to connect to Context7 API

Solutions:
1. Check internet connection
2. Verify firewall settings
3. Test direct API access:
   curl -H "Authorization: Bearer $CONTEXT7_API_KEY" \
        https://api.context7.ai/health
4. Check corporate proxy settings
```

## Integration Examples

### Step 2 (Architecture)
```markdown
# Vibe Coding Step 2 Usage

## Framework Research
Before selecting React vs Vue:
1. /context7 library="react" topic="enterprise-scalability"
2. /context7 library="vue" topic="performance-benchmarks"
3. /context7 library="nextjs" topic="deployment-options"

## Decision Documentation
Based on Context7 research:
- React chosen for enterprise ecosystem
- Next.js for full-stack capabilities
- Deployment via Vercel for optimal performance
```

### Step 6 (Technical Specification)
```typescript
// Example: Fetching API design patterns
// /context7 library="express" topic="rest-api-best-practices"

interface APIResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    version: string;
  };
}

// Implementation based on Context7 research
```

## Configuration Options

### Global Settings
```json
{
  "context7": {
    "cache_enabled": true,
    "cache_ttl": 3600,
    "rate_limit_buffer": 100,
    "preferred_sources": ["official", "community"],
    "language": "en",
    "format": "markdown"
  }
}
```

### Project-Specific Settings
```json
{
  "project_mcps": {
    "context7": {
      "primary_libraries": ["react", "nextjs", "postgresql"],
      "auto_fetch_on": ["architecture", "technical-spec"],
      "cache_project_docs": true
    }
  }
}
```

## Monitoring and Analytics

### Usage Tracking
```bash
# Check daily usage
context7 usage --today

# Historical usage
context7 usage --last-30-days

# Most queried topics
context7 analytics --top-topics
```

### Quality Metrics
```bash
# Response time analysis
context7 metrics --response-times

# Cache hit rate
context7 metrics --cache-performance

# Success rate
context7 metrics --success-rate
```

## Best Practices

### 1. Query Optimization
- ✅ Use specific topic names
- ✅ Include version when relevant
- ✅ Cache frequently used docs
- ❌ Avoid overly broad queries

### 2. Integration Patterns
- ✅ Fetch docs before implementation
- ✅ Include Context7 findings in decisions
- ✅ Update docs when libraries change
- ❌ Skip research for familiar libraries

### 3. Team Collaboration
- ✅ Share Context7 findings in documentation
- ✅ Use consistent library names
- ✅ Document Context7 usage in ADRs
- ❌ Duplicate research efforts

## Support and Resources

### Documentation
- [Context7 Official Docs](https://docs.context7.ai)
- [API Reference](https://api.context7.ai/docs)
- [Best Practices Guide](https://context7.ai/best-practices)

### Community
- [Discord Server](https://discord.gg/context7)
- [GitHub Discussions](https://github.com/context7/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/context7)

### Enterprise Support
- Email: enterprise@context7.ai
- Response time: < 24 hours
- Dedicated account manager available

---

**Context7 is your gateway to always up-to-date technical documentation and best practices! 📚**