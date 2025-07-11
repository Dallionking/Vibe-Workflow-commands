# Vibe Coding Retrofit System

## Overview
A comprehensive system for transforming existing, chaotic codebases into well-organized, agent-orchestrated Vibe Coding environments.

## Core Components

### 1. Analysis Engine
- **Deep Codebase Scanner**: Analyzes file structure, dependencies, patterns
- **Architecture Detector**: Identifies frameworks, design patterns, tech stack
- **Complexity Analyzer**: Measures technical debt, code quality, refactoring needs
- **Dependency Mapper**: Creates visual and data representations of dependencies

### 2. Documentation Generator
- **Auto-Documentation**: Creates missing Vibe Coding documents
- **Context Builder**: Generates comprehensive context files
- **Feature Extractor**: Identifies and documents existing features
- **Status Reporter**: Creates current_status.md with actual codebase state

### 3. Agent Factory
- **Pattern-Based Agent Generator**: Creates agents based on detected patterns
- **Architecture-Specific Agents**: Generates agents for specific frameworks
- **Custom Workflow Agents**: Builds agents for unique codebase workflows
- **Agent Relationship Mapper**: Defines how agents should interact

### 4. Phase Retrofitter
- **Code Segmentation**: Breaks existing code into Universal Format phases
- **Phase Mapper**: Maps existing functionality to appropriate phases
- **Transition Planner**: Creates migration paths for gradual retrofitting
- **Validation System**: Ensures retrofitted code maintains functionality

### 5. Integration Layer
- **Gradual Migration**: Allows incremental adoption of Vibe Coding
- **Compatibility Bridge**: Maintains existing functionality during transition
- **Testing Framework**: Ensures no regression during retrofitting
- **Progress Tracker**: Monitors retrofit completion status

## Command Structure

### Primary Commands

#### `/vibe-retrofit-existing`
The main entry point for retrofitting an existing codebase.

**Workflow:**
1. Scans entire codebase
2. Generates analysis report
3. Creates initial documentation
4. Suggests custom agents
5. Proposes retrofit plan

#### `/vibe-analyze-deep`
Performs ultra-deep analysis of codebase architecture.

**Features:**
- Dependency graph generation
- Code quality metrics
- Pattern detection
- Technical debt assessment
- Security vulnerability scan

#### `/vibe-generate-agents`
Automatically creates custom agents based on codebase analysis.

**Agent Types Generated:**
- Architecture-specific agents
- Pattern-based agents
- Workflow agents
- Integration agents
- Migration agents

#### `/vibe-retrofit-phases`
Retrofits existing code into Universal Format phases.

**Process:**
1. Analyzes current code structure
2. Proposes phase breakdown
3. Creates migration scripts
4. Validates phase transitions
5. Updates documentation

#### `/vibe-document-existing`
Generates comprehensive Vibe Coding documentation for existing projects.

**Documents Created:**
- project_context.md
- current_status.md
- features.md
- changelog.md (from git history)
- agent_orchestration.md
- technical_architecture.md

## Agent Templates

### 1. Codebase Analyzer Agent
```yaml
name: codebase_analyzer
purpose: Deep analysis of existing codebases
capabilities:
  - File structure analysis
  - Dependency mapping
  - Pattern recognition
  - Complexity measurement
  - Architecture identification
```

### 2. Documentation Generator Agent
```yaml
name: doc_generator
purpose: Create missing documentation
capabilities:
  - Extract features from code
  - Generate API documentation
  - Create architectural diagrams
  - Build context files
  - Maintain documentation sync
```

### 3. Retrofit Orchestrator Agent
```yaml
name: retrofit_orchestrator
purpose: Manage the entire retrofit process
capabilities:
  - Coordinate other agents
  - Track progress
  - Validate changes
  - Manage rollbacks
  - Report status
```

### 4. Pattern Detector Agent
```yaml
name: pattern_detector
purpose: Identify patterns for agent generation
capabilities:
  - Detect design patterns
  - Identify workflows
  - Find common operations
  - Suggest optimizations
  - Map relationships
```

### 5. Phase Migration Agent
```yaml
name: phase_migrator
purpose: Convert existing code to Universal Format
capabilities:
  - Segment code logically
  - Create phase boundaries
  - Maintain functionality
  - Update imports/exports
  - Validate migrations
```

## User Experience Flow

### Initial Retrofit
```bash
# 1. Start retrofit process
/vibe-retrofit-existing /path/to/project

# 2. System performs analysis
> Analyzing codebase structure...
> Detecting architecture: React + Node.js + PostgreSQL
> Identifying patterns and workflows...
> Measuring complexity and technical debt...

# 3. Generate initial report
> Analysis complete. Generating retrofit plan...
> Created: retrofit_analysis.md
> Created: suggested_agents.md
> Created: migration_roadmap.md

# 4. User reviews and approves
/vibe-approve-retrofit

# 5. System generates documentation
> Generating documentation...
> Created: project_context.md
> Created: current_status.md
> Created: features.md
> Created: technical_architecture.md

# 6. System creates custom agents
> Generating custom agents...
> Created: react_component_agent.yaml
> Created: api_endpoint_agent.yaml
> Created: database_migration_agent.yaml
> Created: test_automation_agent.yaml

# 7. Begin phase retrofitting
/vibe-retrofit-phases --incremental

> Analyzing code for phase separation...
> Suggested phases:
  - Planning & Analysis
  - Core Infrastructure
  - Feature Implementation
  - Testing & Validation
  - Deployment & Monitoring
```

### Incremental Adoption
```bash
# Retrofit specific modules
/vibe-retrofit-module /src/components/Dashboard

# Generate agents for specific patterns
/vibe-generate-agents --pattern="API handlers"

# Document specific features
/vibe-document-feature "User Authentication"

# Retrofit phases for specific workflows
/vibe-retrofit-phases --workflow="Order Processing"
```

## Analysis Strategies

### 1. Static Code Analysis
- AST parsing for structure understanding
- Dependency graph construction
- Code metrics calculation
- Pattern matching algorithms

### 2. Dynamic Analysis
- Runtime behavior observation
- API endpoint discovery
- Database query patterns
- Performance profiling

### 3. Git History Analysis
- Feature evolution tracking
- Developer patterns identification
- Change frequency analysis
- Bug-prone area detection

### 4. Documentation Mining
- Extract inline documentation
- Analyze commit messages
- Parse existing docs
- Identify knowledge gaps

## Agent Generation Logic

### Pattern-Based Generation
```python
def generate_agent_from_pattern(pattern_type, codebase_context):
    """
    Generates custom agent based on detected patterns
    """
    if pattern_type == "MVC":
        return generate_mvc_agents(codebase_context)
    elif pattern_type == "Microservices":
        return generate_microservice_agents(codebase_context)
    elif pattern_type == "Monolithic":
        return generate_monolith_agents(codebase_context)
    # ... more patterns
```

### Architecture-Specific Templates
```yaml
# React Application Agent Template
react_app_agents:
  - component_generator:
      purpose: "Generate and modify React components"
      patterns: ["*.jsx", "*.tsx"]
      
  - state_manager:
      purpose: "Manage Redux/Context state"
      patterns: ["**/store/**", "**/context/**"]
      
  - hook_creator:
      purpose: "Create and refactor custom hooks"
      patterns: ["**/hooks/**"]
```

## Phase Retrofitting Strategies

### 1. Logical Segmentation
- Group related functionality
- Identify natural boundaries
- Preserve dependencies
- Maintain testability

### 2. Incremental Migration
```yaml
migration_phases:
  phase_1:
    name: "Core Infrastructure"
    includes:
      - Database connections
      - Authentication
      - Base configurations
    
  phase_2:
    name: "Business Logic"
    includes:
      - Domain models
      - Service layer
      - Validation rules
    
  phase_3:
    name: "API Layer"
    includes:
      - Controllers
      - Middleware
      - Route definitions
```

### 3. Validation Framework
- Unit test preservation
- Integration test updates
- Performance benchmarking
- Rollback capabilities

## Success Metrics

### Retrofit Quality Indicators
1. **Documentation Coverage**: % of code documented
2. **Agent Efficiency**: Tasks automated vs manual
3. **Phase Clarity**: Clean separation of concerns
4. **Technical Debt Reduction**: Before/after metrics
5. **Developer Velocity**: Speed improvements

### Progress Tracking
```yaml
retrofit_progress:
  analysis_complete: true
  documentation_generated: 85%
  agents_created: 12
  phases_retrofitted: 3/5
  tests_passing: 98%
  migration_status: "In Progress"
```

## Implementation Roadmap

### Phase 1: Analysis Tools (Week 1-2)
- Build codebase scanner
- Implement pattern detection
- Create dependency mapper
- Design analysis reports

### Phase 2: Documentation Engine (Week 3-4)
- Auto-documentation generator
- Context builder
- Feature extractor
- Status reporter

### Phase 3: Agent Factory (Week 5-6)
- Pattern-based generation
- Architecture templates
- Custom agent builder
- Relationship mapper

### Phase 4: Phase Retrofitter (Week 7-8)
- Code segmentation logic
- Migration planner
- Validation system
- Progress tracker

### Phase 5: Integration & Testing (Week 9-10)
- Full system integration
- User experience polish
- Performance optimization
- Documentation finalization