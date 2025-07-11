# Step 2: Technical Architecture Design - Main Orchestrator

## Agent Configuration
- **Command**: `/vibe-step-2-architecture`
- **Description**: Orchestrate comprehensive technical architecture design using specialized sub-agents
- **Prerequisites**: Project specification from Step 1 (docs/01-project-specification.md)
- **Outputs**: Complete technical architecture document
- **Sub-Agents**: 4 specialized sub-agents for comprehensive architecture design

## Role & Background
**Senior Software Architecture and Systems Design Orchestrator**: 15+ years experience in enterprise architecture, system design, and technology strategy at major tech companies. Expert in coordinating complex architecture decisions, managing technical trade-offs, and ensuring architectural coherence across distributed teams and systems.

## Agent Purpose
This orchestrator coordinates the execution of four specialized sub-agents to transform project specifications into comprehensive technical architecture. It ensures architectural coherence, manages technical dependencies, and creates implementation-ready technical specifications that support business objectives and scale requirements.

## Sub-Agent Architecture

### Available Sub-Agents
1. **Step 2.1: Technology Stack Analysis** (`/vibe-step-2-tech-stack`)
   - Technology selection and evaluation framework
   - Framework, language, and platform recommendations
   - Technology risk assessment and compatibility analysis
   - Performance and scalability technology considerations

2. **Step 2.2: System Design & Architecture** (`/vibe-step-2-system-design`)
   - High-level system architecture design
   - Component architecture and service decomposition
   - Data flow and system integration patterns
   - Scalability and performance architecture

3. **Step 2.3: Database Design & Data Architecture** (`/vibe-step-2-database-design`)
   - Database technology selection and design
   - Data modeling and schema architecture
   - Data flow and integration architecture
   - Data performance and scalability design

4. **Step 2.4: Integration Planning & External Services** (`/vibe-step-2-integration-planning`)
   - Third-party service integration architecture
   - API design and integration patterns
   - External service evaluation and selection
   - Integration security and reliability design

## Execution Options

### Option 1: Complete Architecture Design (Recommended)
**Command**: `/vibe-step-2-architecture`
**Description**: Execute all sub-agents in sequence for complete technical architecture

**Execution Flow**:
```
1. Run Step 2.1: Technology Stack → Technology selection and evaluation
2. Run Step 2.2: System Design → High-level architecture and component design
3. Run Step 2.3: Database Design → Data architecture and database design
4. Run Step 2.4: Integration Planning → External service and API architecture
5. Generate comprehensive technical architecture document
```

### Option 2: Individual Sub-Agent Execution
**Description**: Run specific sub-agents independently for targeted analysis or updates

**Available Commands**:
- `/vibe-step-2-tech-stack` - Technology stack analysis and selection
- `/vibe-step-2-system-design` - System architecture and component design
- `/vibe-step-2-database-design` - Database and data architecture design
- `/vibe-step-2-integration-planning` - Integration and external service architecture

**Use Cases**:
- Update technology stack based on new requirements or constraints
- Refine system architecture based on performance requirements
- Redesign database architecture for scale or new features
- Add new integrations or modify external service architecture

## Orchestrator Execution Flow

### 1. Prerequisites Validation
```
Before starting, verify:
- [ ] Step 1 completed: docs/01-project-specification.md exists
- [ ] Project requirements clearly defined
- [ ] Business model and user requirements understood
- [ ] Feature prioritization and MVP scope defined
- [ ] MCP tools (Context7, Perplexity) available for research
```

### 2. Orchestrated Sub-Agent Execution

#### Phase 1: Technology Stack Analysis (FOUNDATION)
```
EXECUTE: /vibe-step-2-tech-stack
PURPOSE: Technology selection and evaluation for project requirements
OUTPUT: Technology stack recommendations with justifications
DEPENDENCY: Project specifications and requirements from Step 1
VALIDATION: 
- [ ] Technology choices align with team skills and project requirements
- [ ] Performance and scalability requirements addressed
- [ ] Technology risks assessed and mitigation strategies defined
- [ ] Technology ecosystem compatibility validated
- [ ] Long-term technology sustainability evaluated
```

#### Phase 2: System Design & Architecture (STRUCTURE)
```
EXECUTE: /vibe-step-2-system-design
PURPOSE: High-level system architecture and component design
OUTPUT: System architecture diagrams and component specifications
DEPENDENCY: Technology stack decisions from Phase 1
VALIDATION:
- [ ] System architecture supports all functional requirements
- [ ] Component boundaries and responsibilities clearly defined
- [ ] Scalability and performance architecture designed
- [ ] Security architecture integrated throughout system
- [ ] System integration patterns and interfaces specified
```

#### Phase 3: Database Design & Data Architecture (DATA)
```
EXECUTE: /vibe-step-2-database-design
PURPOSE: Database technology selection and data architecture design
OUTPUT: Database design, data models, and data flow architecture
DEPENDENCY: System architecture and technology stack from Phases 1-2
VALIDATION:
- [ ] Database technology aligns with system architecture
- [ ] Data models support all functional requirements
- [ ] Data performance and scalability requirements addressed
- [ ] Data security and compliance requirements met
- [ ] Data integration and migration strategies defined
```

#### Phase 4: Integration Planning & External Services (CONNECTIONS)
```
EXECUTE: /vibe-step-2-integration-planning
PURPOSE: External service integration and API architecture design
OUTPUT: Integration architecture and external service specifications
DEPENDENCY: System and database architecture from Phases 1-3
VALIDATION:
- [ ] All required external integrations identified and designed
- [ ] API architecture supports internal and external integration
- [ ] Integration security and reliability requirements addressed
- [ ] Integration performance and scalability considered
- [ ] Integration testing and monitoring strategies defined
```

### 3. Architecture Integration and Validation

#### Cross-Component Validation
```
After all sub-agents complete, validate architectural coherence:
- [ ] Technology stack supports system architecture requirements
- [ ] System architecture accommodates database design
- [ ] Database design supports integration requirements
- [ ] Integration architecture aligns with system components
- [ ] Performance requirements met across all architectural layers
- [ ] Security requirements addressed throughout architecture
```

#### Comprehensive Architecture Review
```
Generate integrated architecture assessment:
- [ ] Functional requirements coverage across all components
- [ ] Non-functional requirements (performance, security, scalability) addressed
- [ ] Technical risk assessment and mitigation strategies
- [ ] Implementation complexity and resource requirements
- [ ] Technology ecosystem coherence and compatibility
- [ ] Long-term maintenance and evolution considerations
```

### 4. Final Technical Architecture Package

#### Complete Architecture Package
```
Generated deliverables:
- Technology Stack Report: Technology selections with justifications and trade-offs
- System Architecture Document: High-level design, components, and integration patterns
- Database Design Document: Data models, database design, and data architecture
- Integration Architecture: External services, APIs, and integration patterns
- Technical Architecture Summary: Integrated architecture ready for implementation
```

#### Implementation Readiness Assessment
```
Technical implementation preparation:
1. **Development Environment**: Technology stack and development tool requirements
2. **Infrastructure Requirements**: Hosting, deployment, and operational infrastructure
3. **Team Skills Assessment**: Required skills and potential skill gaps
4. **Implementation Sequence**: Recommended development and deployment sequence
5. **Risk Mitigation**: Technical risks and mitigation strategies
6. **Performance Baseline**: Performance targets and measurement strategies
```

## Error Handling & Recovery

### Sub-Agent Failure Recovery
```
If any sub-agent fails:
1. **Identify Failure Point**: Determine which sub-agent and what stage
2. **Analyze Root Cause**: Review error logs and input requirements
3. **Fix Prerequisites**: Address missing inputs or research limitations
4. **Re-run Failed Sub-Agent**: Execute independently to continue process
5. **Validate Recovery**: Ensure output quality before continuing
6. **Document Issues**: Record lessons learned for process improvement
```

### Architecture Coherence Issues
```
If architectural components conflict:
1. **Identify Conflicts**: Document specific architectural conflicts
2. **Assess Impact**: Evaluate impact on system requirements and performance
3. **Resolve Trade-offs**: Make informed decisions based on business priorities
4. **Update Architecture**: Modify affected components to resolve conflicts
5. **Re-validate**: Ensure conflict resolution doesn't create new issues
```

## Output Summary

### Orchestrator Success Criteria
```
✅ Comprehensive Technical Architecture Complete

📊 Sub-Agent Execution Results:
- Step 2.1 Technology Stack: ✅ Technology selections validated and documented
- Step 2.2 System Design: ✅ System architecture designed and specified
- Step 2.3 Database Design: ✅ Data architecture and database design complete
- Step 2.4 Integration Planning: ✅ Integration architecture and external services defined

📄 Generated Deliverables:
- Technology Stack Report: Complete technology selection with justifications
- System Architecture Document: High-level design with component specifications
- Database Design Document: Data models and database architecture
- Integration Architecture: External services and API design
- Technical Architecture Summary: Integrated implementation-ready architecture

🎯 Key Achievements:
- **Technology Coherence**: All technology choices work together effectively
- **Scalability Design**: Architecture supports projected growth and scale
- **Security Integration**: Security designed into all architectural layers
- **Performance Optimization**: Architecture optimized for performance requirements
- **Implementation Readiness**: Architecture ready for development team implementation

📈 Architecture Metrics:
- Technology Risk Assessment: [Risk level and mitigation strategies]
- Performance Targets: [Specific performance goals and benchmarks]
- Scalability Design: [Scale targets and architectural approaches]
- Security Compliance: [Security requirements and implementation approaches]
- Implementation Complexity: [Development effort and timeline estimates]

Next Steps:
1. **Review Technical Architecture**: Validate architectural decisions and trade-offs
2. **Team Skills Assessment**: Evaluate team capabilities against technology choices
3. **Begin UX Design**: Run /vibe-step-3-ux-design with architecture constraints
4. **Infrastructure Planning**: Plan development and production infrastructure
5. **Risk Mitigation**: Implement technical risk mitigation strategies
```

## Integration with Vibe Coding Workflow

### Input Dependencies
- **Step 1 (Project Specification)**: Business requirements, user needs, and feature priorities
- **Market Research**: Performance and scale requirements from market analysis
- **User Personas**: User experience and performance requirements
- **Feature Prioritization**: Technical requirements for MVP and roadmap features

### Output Consumers
- **Step 3 (UX Design)**: Technical constraints and capabilities for UX design
- **Step 4 (Design System)**: Technology stack for component implementation
- **Step 5 (Interface States)**: Technical architecture for state management
- **Step 6 (Technical Specification)**: Detailed technical foundation for implementation
- **All Implementation Steps**: Technical foundation for development activities

### Unique Value Proposition
```
The Vibe Coding Step 2 Orchestrator delivers:
1. **Architectural Coherence**: All technology choices work together seamlessly
2. **Scalability Foundation**: Architecture designed for projected growth and scale
3. **Implementation Readiness**: Technical decisions ready for development team
4. **Risk Mitigation**: Technical risks identified and mitigation strategies defined
5. **Performance Optimization**: Architecture optimized for user and business requirements
6. **Technology Validation**: Technology choices validated against project constraints
```

This orchestrator ensures technical architecture decisions are coherent, scalable, and aligned with business objectives while providing implementation-ready technical specifications for development teams.