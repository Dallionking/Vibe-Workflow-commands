# CLAUDE.md v2.0 Structure Specification

## Overview
CLAUDE.md v2.0 introduces a three-tier context system while maintaining backward compatibility with v1.0 files. The new structure supports dynamic context loading, validation gates, and intelligent section prioritization.

## Format Evolution

### Version 1.0 (Current)
```markdown
# CLAUDE.md
Project description and instructions...

## Project Overview
Basic project information...

## Essential Commands
Command listings...

## Development Guidelines
Guidelines and standards...
```

### Version 2.0 (Enhanced)
```yaml
---
version: 2.0
context:
  global:
    priority: 1000
    maxTokens: 2000
  phase:
    priority: 800
    maxTokens: 3000
  task:
    priority: 600
    maxTokens: 2000
validationGates:
  - phase: "planning"
    requires: ["project-overview", "architecture"]
  - phase: "implementation"
    requires: ["coding-standards", "testing-requirements"]
dynamicSections:
  - id: "mcp-tools"
    trigger: "mcp:*"
    priority: 900
  - id: "phase-specific"
    trigger: "phase:*"
    priority: 850
---

# CLAUDE.md

## @global Project Overview
Essential project information that's always included...

## @global Architecture Principles
Core architectural decisions and patterns...

## @phase:planning Requirements Analysis
Detailed requirements for planning phase...

## @phase:implementation Coding Standards
Implementation-specific guidelines...

## @task:testing Test Requirements
Task-specific testing instructions...

## @dynamic:mcp MCP Tool Usage
Dynamically loaded when MCP tools are detected...

## @validation:pre-commit Commit Standards
Validation rules for git operations...
```

## Section Types

### 1. Global Sections (@global)
- Always included in context
- Foundation knowledge
- Project constants
- Core principles

### 2. Phase Sections (@phase:phase-name)
- Loaded based on current development phase
- Phase-specific instructions
- Contextual guidelines

### 3. Task Sections (@task:task-type)
- Loaded for specific operations
- Granular instructions
- Tool-specific guidance

### 4. Dynamic Sections (@dynamic:trigger)
- Conditionally loaded
- Based on environment/tools
- Adaptive content

### 5. Validation Sections (@validation:gate)
- Define validation rules
- Gate requirements
- Quality checks

## Metadata Structure

```yaml
---
version: 2.0
context:
  # Layer configuration
  global:
    priority: 1000      # Higher = more important
    maxTokens: 2000     # Token budget
    compression: true   # Enable compression
    cache: true         # Enable caching
  
  phase:
    priority: 800
    maxTokens: 3000
    dependencies: ["global"]  # Requires global context
  
  task:
    priority: 600
    maxTokens: 2000
    dependencies: ["global", "phase"]

# Validation gates define requirements
validationGates:
  - id: "planning-complete"
    phase: "planning"
    requires:
      sections: ["project-overview", "requirements"]
      files: [".vibe-status.md", "requirements.md"]
      conditions:
        - "has_project_description"
        - "has_user_stories"
  
  - id: "ready-to-implement"
    phase: "implementation"
    requires:
      sections: ["architecture", "coding-standards"]
      previousGates: ["planning-complete"]

# Dynamic sections loaded conditionally
dynamicSections:
  - id: "mcp-context7"
    trigger: "tool:context7"
    priority: 950
    sections: ["context7-usage", "context7-patterns"]
  
  - id: "typescript-context"
    trigger: "file:*.ts"
    priority: 850
    sections: ["typescript-standards", "type-patterns"]

# Learning patterns for optimization
learningPatterns:
  - pattern: "repeated_mcp_failures"
    action: "increase_fallback_priority"
  
  - pattern: "phase_completion_success"
    action: "cache_effective_context"

# Feature flags
features:
  autoCompression: true
  contextLearning: true
  dynamicPrioritization: true
  validationStrictMode: false
---
```

## Section Headers

### Basic Format
```markdown
## @type:qualifier Section Name
```

### Examples
```markdown
## @global Project Overview
## @phase:planning Requirements Gathering
## @task:testing Unit Test Standards
## @dynamic:git Git Workflow
## @validation:security Security Requirements
```

### Multiple Qualifiers
```markdown
## @phase:planning,implementation Architecture Decisions
## @task:coding,refactoring Code Quality Standards
```

## Backward Compatibility

### Version Detection
```typescript
function detectVersion(content: string): string {
  // Check for YAML frontmatter
  if (content.startsWith('---')) {
    const match = content.match(/version:\s*([\d.]+)/);
    return match ? match[1] : '1.0';
  }
  
  // Check for @-prefixed sections
  if (content.includes('## @')) {
    return '2.0';
  }
  
  return '1.0';
}
```

### v1.0 Parsing Strategy
1. Treat entire file as global context
2. Apply default token budgets
3. No dynamic loading
4. No validation gates

### v2.0 Parsing Strategy
1. Parse YAML frontmatter
2. Categorize sections by type
3. Apply dynamic loading rules
4. Enforce validation gates

## Migration Path

### Automatic Migration
```typescript
function migrateV1ToV2(v1Content: string): string {
  const sections = parseV1Sections(v1Content);
  
  // Add frontmatter
  let v2Content = `---
version: 2.0
context:
  global:
    priority: 1000
    maxTokens: 2000
---

`;

  // Convert sections with smart detection
  sections.forEach(section => {
    const type = detectSectionType(section);
    v2Content += `## @${type} ${section.title}\n${section.content}\n\n`;
  });
  
  return v2Content;
}
```

### Manual Migration Guidelines
1. Add version 2.0 frontmatter
2. Prefix sections with @type
3. Define validation gates
4. Configure dynamic sections
5. Set token budgets

## Integration Points

### 1. Context Loader Integration
```typescript
// Enhanced loader reads CLAUDE.md
const claudeMd = await ClaudeMdParser.parse('CLAUDE.md');
const config = claudeMd.getContextConfig();
const sections = claudeMd.getSectionsForPhase(currentPhase);
```

### 2. Validation Gate Integration
```typescript
// Check gates before phase transition
const gates = claudeMd.getValidationGates(nextPhase);
const validation = await validateGates(gates);
if (!validation.passed) {
  throw new ValidationError(validation.errors);
}
```

### 3. Dynamic Section Loading
```typescript
// Load sections based on triggers
const triggers = detectTriggers(environment);
const dynamicSections = claudeMd.getDynamicSections(triggers);
context.addSections(dynamicSections);
```

## Best Practices

### 1. Section Organization
- Keep global sections concise
- Phase sections should be comprehensive
- Task sections should be specific
- Use dynamic sections for optional content

### 2. Token Budget Management
- Global: 20-25% of total
- Phase: 35-40% of total
- Task: 25-30% of total
- Reserve: 10-15% for dynamic

### 3. Validation Gates
- Define clear requirements
- Use progressive gates
- Include file dependencies
- Support partial validation

### 4. Performance Optimization
- Enable caching for stable sections
- Use compression for large sections
- Implement lazy loading
- Monitor token usage

## Example Implementations

### Simple Project
```yaml
---
version: 2.0
context:
  global:
    priority: 1000
    maxTokens: 2000
---

# My Project

## @global Overview
A simple web application...

## @phase:development Coding Standards
Follow these standards...

## @task:testing Test Requirements
All code must have tests...
```

### Complex Project
```yaml
---
version: 2.0
context:
  global:
    priority: 1000
    maxTokens: 2000
    compression: true
  phase:
    priority: 800
    maxTokens: 3000
  task:
    priority: 600
    maxTokens: 2000
validationGates:
  - id: "architecture-approved"
    phase: "implementation"
    requires:
      sections: ["architecture", "patterns"]
      approvals: ["tech-lead"]
dynamicSections:
  - id: "aws-deployment"
    trigger: "env:aws"
    sections: ["aws-standards", "deployment-checklist"]
---

# Enterprise Application

## @global Architecture Overview
Microservices architecture with...

## @phase:planning Business Requirements
Detailed business logic...

## @phase:implementation Service Patterns
Each service must follow...

## @dynamic:aws AWS Deployment
When deploying to AWS...

## @validation:security Security Checklist
Before deployment verify...
```