# Context7 MCP Integration Guide

## Overview
Context7 is a Model Context Protocol (MCP) tool that provides real-time documentation fetching and research capabilities. This guide explains how to integrate Context7 throughout the Vibe Coding workflow.

## Integration Points

### Step 1: Project Ideation
```python
# Market Research
- Use Context7 to fetch documentation about:
  - Similar products and their features
  - Technology stack best practices
  - Industry standards and compliance

# Example Usage:
mcp1_get-library-docs:
  context7CompatibleLibraryID: "react"
  topic: "best-practices-2024"
```

### Step 2: Technical Architecture
```python
# Technology Documentation
- Fetch latest documentation for:
  - Framework specifications
  - Database optimization guides
  - Security best practices
  - Performance benchmarks

# Example Usage:
mcp1_get-library-docs:
  context7CompatibleLibraryID: "postgresql"
  topic: "performance-tuning"
```

### Step 3-5: Design Implementation
```python
# Design System Research
- Component library documentation
- Accessibility guidelines
- Platform-specific design patterns
- Animation performance guides

# Example Usage:
mcp1_get-library-docs:
  context7CompatibleLibraryID: "tailwindcss"
  topic: "component-patterns"
```

### Step 6: Technical Specification
```python
# Implementation Details
- API documentation
- Security protocols
- Testing frameworks
- CI/CD best practices

# Example Usage:
mcp1_get-library-docs:
  context7CompatibleLibraryID: "jest"
  topic: "testing-strategies"
```

### Step 8: Vertical Slices
```python
# Universal Format Implementation
- Framework-specific patterns
- Code organization
- Performance optimization
- Deployment strategies

# Example Usage:
mcp1_get-library-docs:
  context7CompatibleLibraryID: "nextjs"
  topic: "deployment-vercel"
```

## Usage Patterns

### 1. Documentation Fetching Pattern
```markdown
Before implementing [feature]:
1. Use Context7 to fetch latest [technology] documentation
2. Command: mcp1_get-library-docs
3. Parameters:
   - context7CompatibleLibraryID: "[library-name]"
   - topic: "[specific-topic]"
4. Integrate findings into implementation
```

### 2. Best Practices Research Pattern
```markdown
For [technology decision]:
1. Research current best practices via Context7
2. Compare multiple approaches
3. Document decision rationale
4. Update specifications accordingly
```

### 3. Version-Specific Documentation
```markdown
When using [framework]:
1. Fetch version-specific documentation
2. Ensure compatibility with project requirements
3. Note any deprecated features
4. Plan for future updates
```

## Common Context7 Libraries

### Frontend Frameworks
- react
- vue
- angular
- svelte
- nextjs
- nuxtjs

### Backend Frameworks
- express
- fastapi
- django
- rails
- nestjs
- spring

### Databases
- postgresql
- mongodb
- mysql
- redis
- elasticsearch

### DevOps Tools
- docker
- kubernetes
- terraform
- ansible
- jenkins

### Testing Frameworks
- jest
- cypress
- playwright
- vitest
- pytest

## Error Handling

### When Context7 is Unavailable
```markdown
If Context7 MCP is not available:
1. Notify user about degraded functionality
2. Provide manual research prompts
3. Suggest alternative documentation sources
4. Continue with cached/known information
5. Mark in status that MCP was unavailable
```

### Fallback Strategies
1. Use general knowledge with disclaimers
2. Prompt user to verify latest information
3. Provide links to official documentation
4. Suggest manual research steps

## Integration Tips

### 1. Systematic Usage
- Always check Context7 before major decisions
- Document which version of docs were used
- Update if significant time has passed

### 2. Caching Strategy
- Store fetched documentation references
- Note fetch timestamp
- Refresh for critical decisions

### 3. User Communication
```markdown
📚 Fetching latest documentation...
✓ Context7: Retrieved React 18.2 best practices
✓ Context7: Retrieved PostgreSQL 15 optimization guide
ℹ️ Using latest documentation from [date]
```

## Quality Assurance

### Documentation Validation
1. Cross-reference multiple sources
2. Verify version compatibility
3. Check for recent updates
4. Validate against project requirements

### Decision Documentation
```markdown
## Technology Decision: [Choice]
- Context7 Reference: [Library] v[Version]
- Documentation Date: [Fetch date]
- Key Findings: [Summary]
- Decision Rationale: [Reasoning]
```

## Advanced Usage

### Comparative Research
```python
# Compare multiple technologies
technologies = ["react", "vue", "angular"]
for tech in technologies:
    mcp1_get-library-docs(
        context7CompatibleLibraryID=tech,
        topic="performance-comparison"
    )
```

### Deep Dive Research
```python
# Comprehensive topic research
topics = [
    "security-best-practices",
    "performance-optimization",
    "testing-strategies",
    "deployment-options"
]
for topic in topics:
    mcp1_get-library-docs(
        context7CompatibleLibraryID="nextjs",
        topic=topic
    )
```

## Reporting

### Usage Statistics
Track Context7 usage throughout project:
- Total fetches per step
- Most researched topics
- Documentation versions used
- Cache hit rate

### Value Demonstration
Show how Context7 improved the project:
- Avoided deprecated features
- Implemented latest best practices
- Made informed architecture decisions
- Reduced technical debt