# Sequential Thinking MCP Setup Guide

## Overview
Sequential Thinking MCP provides advanced analysis and planning capabilities using structured reasoning frameworks. Essential for complex decision-making, architectural planning, and comprehensive analysis throughout the Vibe Coding process.

## Installation

### Automated Installation
```bash
# Via Vibe Coding Step 2.5
/vibe-step-2.5-mcp-setup

# Sequential Thinking will be auto-selected and configured
```

### Manual Installation
```bash
# Install Sequential Thinking MCP
npm install -g @sequential-thinking/mcp

# Verify installation
sequential-thinking --version
```

## Authentication Setup

### 1. Get API Key
1. Visit [Sequential Thinking Dashboard](https://sequential-thinking.ai/dashboard)
2. Create account or sign in
3. Navigate to API Access
4. Generate new API key
5. Copy the key (starts with `st_`)

### 2. Configure Environment
```bash
# Add to .env.mcp
SEQUENTIAL_THINKING_KEY=st_xxxxxxxxxxxxxxxxxxxxxxxx

# Or configure directly
claude-mcp configure sequential-thinking --key st_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Verify Authentication
```bash
# Test connection
claude-mcp test sequential-thinking

# Expected output:
# ✅ Sequential Thinking MCP: Connected (1.2s)
# ✅ API Key: Valid
# ✅ Analysis Credits: 450/500 remaining
# ✅ Reasoning Models: Available
```

## Usage in Vibe Coding

### Step Integration
Sequential Thinking is automatically used in:
- **Step 2 (Architecture)**: System design analysis and technology decisions
- **Step 6 (Technical Spec)**: Implementation strategy analysis
- **Step 8 (Vertical Slices)**: Phase breakdown and dependency analysis
- **Step 9 (Claude.md)**: Comprehensive project analysis
- **Complex Decisions**: Multi-factor analysis across all steps

### Command Patterns
```bash
# Comprehensive analysis
/sequential-thinking "Analyze the trade-offs between microservices vs monolith for a SaaS startup"

# Decision framework
/sequential-thinking "Compare React vs Vue for enterprise dashboard application considering team skills, performance, and ecosystem"

# Planning analysis
/sequential-thinking "Break down user authentication system implementation into optimal development phases"

# Risk assessment
/sequential-thinking "Identify potential risks and mitigation strategies for launching a B2B productivity tool"
```

## Core Analysis Frameworks

### 1. Multi-Criteria Decision Analysis (MCDA)
```bash
# Technology selection
/sequential-thinking framework="mcda" "
Compare database options for e-commerce platform:
- PostgreSQL
- MongoDB  
- MySQL

Criteria:
- Performance
- Scalability
- Developer experience
- Cost
- Ecosystem support
"
```

### 2. SWOT Analysis
```bash
# Strategic analysis
/sequential-thinking framework="swot" "
Analyze launching an AI-powered project management tool:

Context:
- Target: Small development teams
- Competition: Notion, Linear, Asana
- Differentiator: AI automation
- Resources: 2 developers, $50k budget
"
```

### 3. Root Cause Analysis
```bash
# Problem analysis
/sequential-thinking framework="root-cause" "
Problem: User engagement drops 60% after first week

Symptoms:
- Low feature adoption
- High support ticket volume
- Users not completing onboarding
- Mobile app crash reports
"
```

### 4. Risk Assessment Matrix
```bash
# Risk evaluation
/sequential-thinking framework="risk-matrix" "
Evaluate risks for marketplace platform launch:

Technical risks:
- Payment processing integration
- High traffic scalability
- Data security compliance

Business risks:
- Market competition
- User acquisition cost
- Revenue model validation
"
```

### 5. Dependency Analysis
```bash
# Project planning
/sequential-thinking framework="dependency" "
Plan development phases for social media management tool:

Features:
- User authentication
- Post scheduling
- Analytics dashboard
- Team collaboration
- Payment processing
- Mobile app

Constraints:
- 3-person team
- 6-month timeline
- MVP launch goal
"
```

## Advanced Analysis Capabilities

### 1. Scenario Planning
```bash
# Multiple outcome analysis
/sequential-thinking scenario-planning "
Product launch scenarios for SaaS productivity tool:

Optimistic: 1000 users in 3 months
Realistic: 300 users in 3 months  
Pessimistic: 50 users in 3 months

Variables:
- Marketing budget: $10k-50k
- Team size: 2-5 people
- Feature scope: MVP vs full
- Market conditions: competitive/favorable
"
```

### 2. Cost-Benefit Analysis
```bash
# Financial impact analysis
/sequential-thinking cost-benefit "
Evaluate migrating from monolith to microservices:

Costs:
- Development time: 6 months
- Infrastructure: +$2k/month
- Team training: $15k
- Migration risks: High

Benefits:
- Scalability: Support 10x users
- Development speed: +30%
- Team autonomy: Increased
- Technology flexibility: High
"
```

### 3. Stakeholder Impact Analysis
```bash
# Stakeholder consideration
/sequential-thinking stakeholder-impact "
Analyze impact of adding AI features to existing app:

Stakeholders:
- Users: Learning curve vs new capabilities
- Developers: Complexity vs innovation
- Support team: New training vs automation
- Business: Development cost vs competitive advantage
- Investors: Risk vs market positioning
"
```

### 4. Technical Debt Assessment
```bash
# Code quality analysis
/sequential-thinking technical-debt "
Assess technical debt in React application:

Current state:
- 15,000 lines of code
- 2-year development
- 60% test coverage
- Performance issues
- Legacy components

Options:
- Incremental refactoring
- Major rewrite
- Migration to new framework
- Maintain status quo
"
```

## Vibe Coding Integration Examples

### Step 2 (Architecture) Analysis
```bash
/sequential-thinking "
Architecture Decision: Full-stack framework selection

Project: B2B project management tool
Team: 3 full-stack developers
Timeline: 4 months to MVP
Scale: 100-1000 users initially

Options:
1. Next.js + Supabase
2. T3 Stack (Next.js + tRPC + Prisma)
3. SvelteKit + PocketBase
4. Remix + PostgreSQL

Evaluation criteria:
- Development speed
- Team learning curve
- Scalability potential
- Community support
- Total cost of ownership
- Long-term maintainability
"

# Output: Comprehensive analysis with scoring matrix,
# pros/cons, recommendations, and implementation roadmap
```

### Step 6 (Technical Spec) Analysis
```bash
/sequential-thinking "
Implementation Strategy: User Authentication System

Requirements:
- Email/password login
- OAuth (Google, GitHub)
- Role-based permissions
- Session management
- Password reset
- Account verification

Technical considerations:
- Security compliance (GDPR)
- Mobile app support
- API authentication
- Scalability to 10k users
- Development timeline: 3 weeks

Analyze optimal implementation approach and identify potential risks."
```

### Step 8 (Vertical Slices) Planning
```bash
/sequential-thinking "
Development Phase Planning: E-commerce Platform

Features to implement:
- Product catalog
- Shopping cart
- Payment processing
- User accounts
- Order management
- Admin dashboard
- Search functionality
- Reviews/ratings

Constraints:
- 2 developers
- 5-month timeline
- Budget: $75k
- Must generate revenue by month 3

Create optimal phase breakdown with dependencies,
risk mitigation, and revenue-generating priorities."
```

### Step 9 (Claude.md) Comprehensive Analysis
```bash
/sequential-thinking "
Project Analysis: AI-powered note-taking application

Complete Vibe Coding documentation analysis:
- Market positioning and competitive advantage
- Technical architecture strengths and weaknesses
- User experience design effectiveness
- Implementation feasibility and risks
- Resource allocation optimization
- Success probability assessment

Generate comprehensive insights for Claude.md configuration
including critical patterns, potential pitfalls, and
optimization opportunities."
```

## Analysis Quality Indicators

### Response Quality Metrics
- **Depth Score**: 8-10/10 (comprehensive analysis)
- **Structure Score**: 9-10/10 (logical flow)
- **Actionability**: High (specific recommendations)
- **Evidence Base**: Strong (reasoning provided)

### Analysis Completeness Checklist
- ✅ Multiple perspectives considered
- ✅ Quantitative and qualitative factors
- ✅ Short-term and long-term implications  
- ✅ Risk assessment included
- ✅ Implementation roadmap provided
- ✅ Success metrics defined
- ✅ Contingency planning addressed

## Performance Optimization

### Response Time Targets
- **Simple analysis**: < 3 seconds
- **Framework analysis**: < 8 seconds
- **Comprehensive analysis**: < 15 seconds
- **Complex planning**: < 25 seconds

### Credit Management
- **Free tier**: 50 analyses/month
- **Pro tier**: 500 analyses/month
- **Enterprise**: Unlimited analyses
- **Credit usage**: Varies by complexity (1-10 credits per analysis)

### Optimization Tips
1. **Be specific**: Provide clear context and constraints
2. **Use frameworks**: Specify analysis type for structured output
3. **Batch related**: Group similar decisions together
4. **Cache results**: Save analysis for reference

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
```bash
Error: Sequential Thinking API key invalid

Solutions:
1. Verify API key format (should start with st_)
2. Check subscription status in dashboard
3. Regenerate key if expired
4. Ensure environment variable is correct:
   echo $SEQUENTIAL_THINKING_KEY
```

#### 2. Credit Limit Exceeded
```bash
Error: Analysis credit limit exceeded

Solutions:
1. Check current usage: sequential-thinking usage
2. Upgrade subscription for more credits
3. Optimize analysis frequency
4. Use simpler queries for basic decisions
```

#### 3. Analysis Quality Issues
```bash
Issue: Analysis results are too generic or unhelpful

Solutions:
1. Provide more specific context and constraints
2. Include relevant background information
3. Specify desired analysis framework
4. Break complex problems into smaller parts
```

#### 4. Response Timeouts
```bash
Error: Analysis request timeout

Solutions:
1. Simplify complex analysis requests
2. Check internet connectivity
3. Break into smaller analysis chunks
4. Retry with more focused scope
```

## Configuration Options

### Global Settings
```json
{
  "sequential_thinking": {
    "default_framework": "mcda",
    "analysis_depth": "comprehensive",
    "timeout": 30000,
    "cache_results": true,
    "auto_save": true
  }
}
```

### Project-Specific Settings
```json
{
  "project_mcps": {
    "sequential_thinking": {
      "domain_context": "saas-development",
      "analysis_templates": ["architecture", "planning", "risk-assessment"],
      "auto_analyze_on": ["major-decisions", "phase-planning"],
      "save_analysis_log": true
    }
  }
}
```

## Best Practices

### 1. Analysis Setup
- ✅ Provide comprehensive context
- ✅ Define clear constraints and criteria
- ✅ Specify timeline and resource limitations
- ❌ Make requests too vague or open-ended

### 2. Framework Selection
- ✅ Use MCDA for technology decisions
- ✅ Use SWOT for strategic planning
- ✅ Use dependency analysis for project planning
- ✅ Use risk assessment for critical decisions

### 3. Result Integration
- ✅ Document analysis in project decisions
- ✅ Include reasoning in technical specifications
- ✅ Share insights with team members
- ✅ Update analysis when context changes

### 4. Decision Documentation
```markdown
## Technology Decision: Database Selection

**Analysis Date**: 2024-07-05
**Framework**: Multi-Criteria Decision Analysis
**Analyst**: Sequential Thinking MCP

### Context
[Project context and requirements]

### Options Evaluated
1. PostgreSQL + Supabase
2. MongoDB Atlas
3. PlanetScale MySQL

### Analysis Results
[Detailed scoring and reasoning]

### Recommendation
PostgreSQL + Supabase selected based on:
- Highest overall score (8.3/10)
- Best fit for structured data
- Excellent developer experience
- Cost-effective scaling

### Implementation Plan
[Next steps and timeline]
```

## Enterprise Features

### Team Collaboration
```bash
# Share analysis results
sequential-thinking share --analysis-id abc123 --team developers

# Analysis templates
sequential-thinking template create --name "architecture-decision"

# Collaborative analysis
sequential-thinking collaborate --session team-planning-2024
```

### Audit and Compliance
- Full analysis history and audit logs
- Decision traceability and versioning
- Compliance reporting capabilities
- Team access controls and permissions

### Advanced Analytics
- Decision pattern analysis
- Team decision-making insights
- Analysis effectiveness metrics
- Recommendation success tracking

## Support and Resources

### Documentation
- [Sequential Thinking API Docs](https://docs.sequential-thinking.ai)
- [Analysis Framework Guide](https://sequential-thinking.ai/frameworks)
- [Best Practices Manual](https://sequential-thinking.ai/best-practices)

### Training Resources
- [Decision-Making Course](https://sequential-thinking.ai/course)
- [Framework Selection Guide](https://sequential-thinking.ai/framework-guide)
- [Case Studies](https://sequential-thinking.ai/case-studies)

### Community
- [Discord Community](https://discord.gg/sequential-thinking)
- [LinkedIn Group](https://linkedin.com/groups/sequential-thinking)
- [Monthly Webinars](https://sequential-thinking.ai/webinars)

### Support Channels
- Email: support@sequential-thinking.ai
- Response time: < 24 hours
- Enterprise support: < 4 hours
- Live chat: Available during business hours

---

**Sequential Thinking MCP transforms complex decisions into structured, actionable insights! 🧠**