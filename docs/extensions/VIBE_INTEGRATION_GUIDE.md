# Vibe Workflow Integration Guide

This guide explains how the `/vibe-feature-ideate` command and its agents integrate with the existing Vibe Coding methodology and step commands.

## Overview of Integration Points

The feature ideation system acts as a bridge between initial ideas and the formal Vibe Coding workflow steps.

```
User Idea → /vibe-feature-ideate → Implementation Plan → Vibe Steps 2-10
```

## Integration with Vibe Steps

### Vibe Step 1: User Experience Design
- **Relationship**: `/vibe-feature-ideate` operates at the feature level within an existing project
- **For full project ideation**: Use `/vibe-project-ideate` or `/vibe-step-1`
- **Output feeds into**: UX refinement in Step 1

### Vibe Step 2: Project Initialization
- **Integration Point**: Phase 2 (Foundation) from ideation output
- **Command Flow**:
  ```bash
  /vibe-feature-ideate "feature" → /vibe-step-2 --from-ideation
  ```
- **Shared Context**: `.vibe/vibe-implementation-guide.md`

### Vibe Step 3: Development Environment Setup
- **Integration Point**: Environment requirements from architecture analysis
- **Automated Setup**: Can trigger environment configuration based on tech stack

### Vibe Step 4: Implementation of Core Logic
- **Integration Point**: Phase 3 (Core Logic) tasks
- **Command Flow**:
  ```bash
  /vibe-implement-phase 3 → /vibe-step-4
  ```

### Vibe Step 5: User Interface Creation
- **Integration Point**: Phase 4 (User Interface) tasks
- **UI Components**: Identified during planning phase

### Vibe Step 6: System Integration
- **Integration Point**: Phase 5 (Integration) tasks
- **External Services**: Documented during research phase

### Vibe Step 7: Testing Protocols
- **Integration Point**: Phase 6 (Testing) requirements
- **Test Strategy**: Defined in planning synthesis

### Vibe Step 8: Optimization
- **Integration Point**: Performance considerations from research
- **Optimization Targets**: Identified during architecture analysis

### Vibe Step 9: Documentation
- **Integration Point**: Documentation templates from phase formatter
- **Auto-generated**: Initial docs from ideation process

### Vibe Step 10: Deployment
- **Integration Point**: Phase 7 (Deployment) plans
- **Deployment Strategy**: Defined based on architecture

## Command Chaining Examples

### Feature to Implementation
```bash
# 1. Ideate the feature
/vibe-feature-ideate "Add real-time chat"

# 2. Generate required agents
/vibe-generate-agents --from-ideation

# 3. Create vertical slice
/vibe-vertical-slice --feature="real-time-chat"

# 4. Start implementation
/vibe-step-4 --feature="real-time-chat"
```

### Retrofit to Vibe
```bash
# 1. Analyze existing code
/vibe-retrofit-existing

# 2. Ideate improvements
/vibe-feature-ideate "Modernize authentication" --retrofit

# 3. Apply Vibe phases
/vibe-retrofit-phases --from-ideation
```

## Data Flow Between Systems

### Files Created by Ideation
```
.vibe/
├── feature-requirements.md      → Input for Step 1 refinement
├── research-findings.md         → Input for Step 4 implementation
├── technical-documentation.md   → Input for Step 9 documentation
├── integration-plan.md          → Input for Step 6 integration
├── implementation-plan.md       → Input for Steps 4-7
└── vibe-implementation-guide.md → Master guide for all steps
```

### Context Passing
1. **Ideation → Steps**: Via `.vibe/` directory files
2. **Steps → Ideation**: Can re-run ideation for sub-features
3. **Agents → Steps**: Direct invocation with context

## Agent Integration

### Agent Hierarchy
```
/vibe-feature-ideate (orchestrator)
    ├── clarification-agent
    │   ├── question-generator
    │   ├── response-analyzer
    │   └── requirement-extractor
    ├── research-agent
    ├── documentation-agent
    │   ├── library-resolver
    │   ├── docs-fetcher
    │   └── docs-processor
    ├── architecture-analyst
    ├── planning-synthesizer
    │   ├── task-breakdown
    │   ├── dependency-mapper
    │   └── plan-generator
    └── phase-formatter
```

### Agent to Step Mapping
- **Clarification agents** → Step 1 (UX Design)
- **Research agent** → Step 4 (Core Logic)
- **Documentation agents** → Step 9 (Documentation)
- **Architecture analyst** → Step 3 (Environment) & 6 (Integration)
- **Planning agents** → All implementation steps (4-8)
- **Phase formatter** → Vibe phase structure

## Workflow Orchestration

### Sequential Flow
```
1. Feature Idea
2. Clarification (with user approval)
3. Research (with user approval)
4. Documentation (with user approval)
5. Architecture Analysis (with user approval)
6. Planning Synthesis (with user approval)
7. Phase Formatting (with user approval)
8. Vibe Steps 2-10 Implementation
```

### Parallel Opportunities
- Research + Documentation (if independent)
- Multiple Step 4 core logic tasks
- UI components while building APIs

## Best Practices for Integration

### 1. Use Ideation for New Features
- Always start with `/vibe-feature-ideate` for new features
- Ensures research-backed implementation
- Maintains architectural consistency

### 2. Leverage Context Files
- Read `.vibe/` files in step commands
- Update files as implementation progresses
- Maintain traceability

### 3. Follow Phase Structure
- Respect the 7-phase breakdown
- Complete phases sequentially when possible
- Use parallel work opportunities

### 4. Agent Reusability
- Reuse agents for similar features
- Extend agents for special requirements
- Share agents across projects

## Troubleshooting Integration Issues

### Common Problems

1. **Context Lost Between Commands**
   - Solution: Ensure `.vibe/` directory exists
   - Check file permissions

2. **Agent Not Found**
   - Solution: Verify agent yaml files exist
   - Check path references

3. **Step Command Doesn't Read Ideation Output**
   - Solution: Pass `--from-ideation` flag
   - Manually specify context file

4. **Workflow Interruption**
   - Solution: Resume from last completed stage
   - Use saved context files

## Future Integration Enhancements

### Planned Features
1. **Automatic Step Triggering**: Ideation directly triggers steps
2. **Bi-directional Updates**: Steps update ideation context
3. **Progress Dashboard**: Unified view of ideation + implementation
4. **Template Library**: Reusable ideation patterns

### Extension Points
1. **Custom Agents**: Add domain-specific agents
2. **Step Modifications**: Customize step integration
3. **Workflow Variants**: Alternative flows for different project types

## Conclusion

The `/vibe-feature-ideate` command and its agents are designed to seamlessly integrate with the existing Vibe Coding workflow. By providing a research-backed, well-planned foundation, it ensures that the implementation steps (2-10) proceed smoothly with clear direction and comprehensive preparation.