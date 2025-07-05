# Perplexity MCP Setup Guide

## Overview
Perplexity MCP provides real-time research capabilities, market analysis, and up-to-date information gathering. Essential for Vibe Coding projects for competitive research, trend analysis, and validating technical decisions with current market data.

## Installation

### Automated Installation
```bash
# Via Vibe Coding Step 2.5
/vibe-step-2.5-mcp-setup

# Perplexity will be auto-selected and configured
```

### Manual Installation
```bash
# Install Perplexity MCP
npm install -g @perplexity/mcp-integration

# Verify installation
perplexity-mcp --version
```

## Authentication Setup

### 1. Get API Key
1. Visit [Perplexity AI Settings](https://perplexity.ai/settings/api)
2. Sign in to your account
3. Navigate to API section
4. Generate new API key
5. Copy the key (starts with `pplx_`)

### 2. Configure Environment
```bash
# Add to .env.mcp
PERPLEXITY_API_KEY=pplx_xxxxxxxxxxxxxxxx

# Or configure directly
claude-mcp configure perplexity --api-key pplx_xxxxxxxxxxxxxxxx
```

### 3. Verify Authentication
```bash
# Test connection
claude-mcp test perplexity

# Expected output:
# ✅ Perplexity MCP: Connected (892ms)
# ✅ API Key: Valid
# ✅ Rate Limits: 5000/month remaining
```

## Usage in Vibe Coding

### Step Integration
Perplexity is automatically used in:
- **Step 1 (Ideation)**: Market research and competitive analysis
- **Step 2 (Architecture)**: Technology trend validation
- **Step 3 (UX Design)**: User behavior research and design trends
- **Step 7 (Landing Page)**: Marketing research and copywriting
- **All Steps**: Real-time validation of decisions

### Command Patterns
```bash
# Market research
/perplexity "SaaS pricing models 2024 trends"

# Technology validation
/perplexity "Next.js vs Remix performance comparison 2024"

# Competitive analysis
/perplexity "AI-powered project management tools market analysis"

# User behavior research
/perplexity "B2B software user onboarding best practices"
```

## Research Categories

### 1. Market Research
```bash
# Industry analysis
/perplexity "EdTech market size growth predictions 2024-2026"

# Competitor analysis
/perplexity "Figma competitors feature comparison 2024"

# Pricing research
/perplexity "Subscription pricing psychology B2B software"

# User research
/perplexity "Remote work productivity tools user preferences"
```

### 2. Technology Research
```bash
# Framework comparison
/perplexity "React 18 vs Vue 3 performance benchmarks 2024"

# Architecture decisions
/perplexity "Microservices vs monolith for startup scaling"

# Security best practices
/perplexity "Web application security vulnerabilities 2024"

# Performance optimization
/perplexity "Web Core Vitals optimization techniques 2024"
```

### 3. Design & UX Research
```bash
# Design trends
/perplexity "Dashboard design trends B2B software 2024"

# Accessibility research
/perplexity "Web accessibility compliance requirements 2024"

# User experience patterns
/perplexity "Mobile-first design principles ecommerce"

# Color psychology
/perplexity "Color psychology SaaS application design"
```

### 4. Business Strategy
```bash
# Go-to-market research
/perplexity "Product Hunt launch strategy successful examples"

# Monetization research
/perplexity "Freemium vs paid subscription conversion rates"

# Content marketing
/perplexity "Developer community building strategies 2024"

# Partnership research
/perplexity "SaaS integration partnership models"
```

## Advanced Features

### Model Selection
```bash
# Use specific models for different tasks
/perplexity model="pplx-7b-online" "Real-time tech news analysis"
/perplexity model="pplx-70b-online" "Complex market research query"
/perplexity model="pplx-7b-chat" "Quick factual lookup"
```

### Search Parameters
```bash
# Time-bound research
/perplexity date-range="last-6-months" "AI startup funding trends"

# Source filtering
/perplexity sources="authoritative" "GDPR compliance requirements"

# Geographic targeting
/perplexity region="US" "Enterprise software adoption rates"
```

### Batch Research
```bash
# Multiple related queries
/perplexity batch="[
  'SaaS onboarding completion rates 2024',
  'User authentication UX best practices',
  'Progressive web app adoption enterprise'
]"
```

## Research Methodologies

### 1. Competitive Analysis Framework
```bash
# Step 1: Market overview
/perplexity "[Your product category] market leaders 2024"

# Step 2: Feature analysis
/perplexity "[Competitor name] key features and pricing"

# Step 3: User sentiment
/perplexity "[Competitor name] user reviews and complaints"

# Step 4: Market gaps
/perplexity "[Product category] unmet user needs opportunities"
```

### 2. Technology Decision Framework
```bash
# Step 1: Current landscape
/perplexity "[Technology] adoption trends enterprise 2024"

# Step 2: Pros and cons
/perplexity "[Technology A] vs [Technology B] comparison"

# Step 3: Case studies
/perplexity "[Technology] successful implementation examples"

# Step 4: Future outlook
/perplexity "[Technology] roadmap and future predictions"
```

### 3. User Research Framework
```bash
# Step 1: Behavior patterns
/perplexity "[Target audience] software usage patterns"

# Step 2: Pain points
/perplexity "[Target audience] common frustrations [domain]"

# Step 3: Preferences
/perplexity "[Target audience] preferred features [product type]"

# Step 4: Trends
/perplexity "[Target audience] behavioral trends 2024"
```

## Integration Examples

### Step 1 (Ideation) Usage
```markdown
# Market Research Report

## Competitive Landscape
Research via Perplexity:
- Query: "AI-powered development tools market analysis 2024"
- Key findings: 67% growth in AI coding assistants
- Market size: $2.9B projected by 2026
- Top competitors: GitHub Copilot, Tabnine, Amazon CodeWhisperer

## Target Audience Validation
- Query: "Developer productivity pain points remote work"
- Findings: Context switching reduces productivity by 40%
- Opportunity: Unified development environment
```

### Step 2 (Architecture) Usage
```markdown
# Technology Validation

## Framework Selection Research
- Query: "Next.js vs Remix performance 2024 enterprise"
- Result: Next.js leads in ecosystem, Remix in performance
- Decision: Next.js for faster development and deployment

## Database Choice Validation
- Query: "PostgreSQL vs MongoDB startup scaling 2024"
- Finding: PostgreSQL preferred for structured data, better tooling
- Decision: PostgreSQL with Supabase for managed hosting
```

### Step 7 (Landing Page) Usage
```markdown
# Marketing Research

## Copywriting Research
- Query: "High-converting SaaS landing page headlines 2024"
- Patterns: Problem-focused headlines convert 23% better
- Emotion: Productivity and time-saving themes resonate

## Pricing Psychology
- Query: "SaaS pricing page psychology user decision-making"
- Insight: Three-tier pricing with middle option highlighted
- Strategy: Position premium tier at 3x basic for anchor effect
```

## Performance Optimization

### Response Time Targets
- **Simple queries**: < 2 seconds
- **Complex research**: < 5 seconds
- **Batch queries**: < 8 seconds

### Rate Limiting
- **Free tier**: 5 queries/day
- **Pro tier**: 300 queries/month
- **Enterprise**: 1,000+ queries/month

### Query Optimization Tips
1. **Be specific**: Use precise keywords and context
2. **Include timeframe**: Add "2024" or "latest" for current info
3. **Use modifiers**: Include "best practices", "comparison", "trends"
4. **Batch related**: Group similar queries together

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
```bash
Error: Perplexity API key invalid

Solutions:
1. Verify API key format (should start with pplx_)
2. Check subscription status in Perplexity dashboard
3. Regenerate key if expired
4. Ensure environment variable is set:
   echo $PERPLEXITY_API_KEY
```

#### 2. Rate Limit Exceeded
```bash
Error: Rate limit exceeded

Solutions:
1. Check current usage: perplexity-mcp usage
2. Upgrade subscription for higher limits
3. Optimize query frequency
4. Use caching for repeated research
```

#### 3. Low-Quality Results
```bash
Issue: Research results not relevant or outdated

Solutions:
1. Add "2024" or "latest" to queries
2. Be more specific with keywords
3. Use authoritative sources filter
4. Rephrase query with different terms
```

#### 4. Network Timeouts
```bash
Error: Request timeout

Solutions:
1. Check internet connectivity
2. Retry with simpler query
3. Break complex queries into smaller parts
4. Check Perplexity service status
```

## Best Practices

### 1. Query Crafting
- ✅ Use specific, targeted questions
- ✅ Include relevant timeframes
- ✅ Add context about your industry/domain
- ❌ Ask overly broad or vague questions

### 2. Research Integration
- ✅ Document research findings in decisions
- ✅ Include Perplexity sources in documentation
- ✅ Update research periodically
- ❌ Make decisions without validation

### 3. Information Validation
- ✅ Cross-reference with multiple sources
- ✅ Check recency of information
- ✅ Verify claims with authoritative sources
- ❌ Rely solely on single research query

## Configuration Options

### Global Settings
```json
{
  "perplexity": {
    "default_model": "pplx-7b-online",
    "timeout": 30000,
    "max_retries": 3,
    "cache_results": true,
    "source_preference": ["authoritative", "recent"]
  }
}
```

### Project-Specific Settings
```json
{
  "project_mcps": {
    "perplexity": {
      "research_domains": ["saas", "ai", "productivity"],
      "auto_research_on": ["ideation", "architecture", "landing"],
      "save_research_log": true
    }
  }
}
```

## Monitoring and Analytics

### Usage Tracking
```bash
# Check monthly usage
perplexity-mcp usage --month

# Research history
perplexity-mcp history --last-10

# Most valuable queries
perplexity-mcp analytics --top-queries
```

### Research Quality Metrics
```bash
# Query success rate
perplexity-mcp metrics --success-rate

# Average response time
perplexity-mcp metrics --response-time

# Source authority analysis
perplexity-mcp metrics --source-quality
```

## Enterprise Features

### Team Collaboration
```bash
# Share research findings
perplexity-mcp share --query-id abc123 --team-channel

# Research templates
perplexity-mcp template create --name "competitor-analysis"

# Batch research workflows
perplexity-mcp workflow run --template "market-research"
```

### Compliance and Privacy
- GDPR compliant data handling
- No storage of sensitive research queries
- Audit logs for enterprise accounts
- Team access controls and permissions

## Support and Resources

### Documentation
- [Perplexity API Docs](https://docs.perplexity.ai)
- [Research Best Practices](https://perplexity.ai/research-guide)
- [Model Comparison Guide](https://perplexity.ai/models)

### Community
- [Discord Community](https://discord.gg/perplexity)
- [Reddit Community](https://reddit.com/r/perplexity)
- [Twitter Updates](https://twitter.com/perplexity_ai)

### Support Channels
- Email: support@perplexity.ai
- Response time: < 48 hours
- Enterprise support: < 12 hours

---

**Perplexity transforms your project decisions with real-time research and market intelligence! 🔍**