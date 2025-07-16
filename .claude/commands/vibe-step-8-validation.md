---
description: Validate Universal Format phases for completeness and compliance
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__perplexity-mcp__perplexity_search_web
  - mcp__perplexity-ask__perplexity_ask
  - mcp__sequential-thinking__sequentialthinking
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
---

# vibe-step-8-validation

Validate Universal Format phases for completeness and compliance

# Step 8.3: Universal Format Phase Validation

## Agent Configuration
- **Command**: `/vibe-step-8-validation`
- **Description**: Validate Universal Format phases for completeness, accuracy, and compliance
- **Prerequisites**: Step 8.2 (Phase Generation) must be completed
- **Outputs**: Validation report with compliance assessment and improvement recommendations
- **MCP Tools**: Context7, Perplexity, Sequential Thinking

## Role & Background
**Senior Quality Assurance Architect and Universal Format Compliance Specialist**: 12+ years experience in software quality assurance, technical documentation review, and development process optimization. Expert in Universal Format standards, vertical slice architecture validation, test-driven development requirements, and systematic quality assessment frameworks.

## Agent Purpose
This sub-agent validates generated Universal Format phases to ensure they meet all structural, content, and quality requirements. It performs comprehensive compliance checking, identifies gaps or inconsistencies, and provides specific recommendations for improvements to ensure phases are ready for successful implementation.

## Validation Framework

### Universal Format Compliance Standards
1. **Structural Compliance** - Exact template adherence with all required sections
2. **Content Quality** - Feature-specific content with proper references and detail
3. **Implementation Readiness** - Actionable tasks with clear deliverables and checkpoints
4. **Integration Consistency** - Proper MCP tool integration and design system references
5. **Quality Standards** - 95%+ test coverage and comprehensive validation requirements

## Execution Flow

### 1. Read Generated Phase Documents (MANDATORY)

```
CRITICAL: Before validation, read all generated phase documents:
1. phases/phase-0-foundation.md (if exists)
2. phases/phase-1-{feature-name}.md through phases/phase-N-{feature-name}.md
3. Step 8.1 Feature Analysis Report for validation context
4. docs/06-technical-specification.md Section 3.X for feature requirements
5. Universal Vertical Slice Phase Documentation Format template for compliance checking
```

### 2. Structural Compliance Validation

#### Section 2.1: Universal Format Structure Check
```
FOR EACH GENERATED PHASE, validate structure:

REQUIRED SECTIONS CHECKLIST:
- [ ] Title follows exact format: "Phase {N}. {Actual Feature Name}"
- [ ] Role & Background section with Senior Engineer profile (8-10+ years experience)
- [ ] Feature Description section with comprehensive feature context
- [ ] ⚠️ IMPORTANT INSTRUCTIONS section with all 9 critical instructions
- [ ] Implementation Tasks section with three-tier structure
- [ ] Tier 1 Task - {Feature Name} Infrastructure Setup
- [ ] Tier 2 Task - {Feature Name} Core Implementation  
- [ ] Tier 3 Task - {Feature Name} Polish, Optimization, and Quality Assurance
- [ ] Subtask structure with specific checkboxes and deliverables
- [ ] Git workflow integration with branch creation and checkpoints
- [ ] MCP tool integration (Context7, Perplexity, Shadcn/UI)
- [ ] Project status file update requirements
- [ ] Phase completion summary section

STRUCTURAL VALIDATION RESULTS:
Phase 0: {Compliance percentage}% - {Issues found}
Phase 1: {Compliance percentage}% - {Issues found}
Phase 2: {Compliance percentage}% - {Issues found}
[Continue for all phases]
```

#### Section 2.2: Content Quality Assessment
```
FOR EACH PHASE, validate content quality:

FEATURE-SPECIFIC CONTENT VALIDATION:
- [ ] Phase title uses actual feature name from Section 3.X (not generic)
- [ ] Role & Background specific to feature domain and technology requirements
- [ ] Feature Description derived from Section 3.X.1 with complete context
- [ ] Technical requirements incorporated from Section 3.X.3
- [ ] User stories integrated from Section 3.X.2
- [ ] Implementation approach follows Section 3.X.4
- [ ] API endpoints reference Section 3.X.6
- [ ] Data models reference Section 3.X.7
- [ ] Error handling includes Section 3.X.8 requirements
- [ ] Performance considerations from Section 3.X.9

CONTENT QUALITY METRICS:
- Feature Specificity: {High/Medium/Low}
- Technical Detail Level: {Comprehensive/Adequate/Insufficient}
- Implementation Clarity: {Clear/Unclear/Needs Improvement}
- Reference Accuracy: {All references valid/Some missing/Major gaps}
```

### 3. Implementation Readiness Validation

#### Section 3.1: Task Breakdown Assessment
```
FOR EACH PHASE, validate task structure:

TIER 1 VALIDATION (Infrastructure Setup):
- [ ] Git branch creation with feature-specific naming
- [ ] Context7 MCP research commands with specific library/topic
- [ ] Perplexity MCP research queries with feature-specific questions
- [ ] Database schema changes specific to this feature
- [ ] API endpoint setup specific to this feature
- [ ] Infrastructure components needed for this feature
- [ ] Git checkpoints with meaningful commit messages

TIER 2 VALIDATION (Core Implementation):
- [ ] Core feature logic implementation with specific requirements
- [ ] Database operations referencing Section 3.X.7 data models
- [ ] API endpoint implementation referencing Section 3.X.6
- [ ] Shadcn/UI component generation with detailed specifications
- [ ] Design system integration (docs/04-design-system.md referenced)
- [ ] UX pattern integration (docs/03-ux-design.md referenced)
- [ ] Feature integration with existing systems
- [ ] Feature-specific testing and validation

TIER 3 VALIDATION (Polish & QA):
- [ ] UI/UX polish specific to feature requirements
- [ ] Performance optimization with feature-specific benchmarks
- [ ] Integration testing with comprehensive scenarios
- [ ] 95%+ test coverage requirement clearly defined
- [ ] Accessibility compliance (WCAG 2.1 AA) requirements
- [ ] Project status file updates for context continuity

TASK GRANULARITY ASSESSMENT:
- Atomic Tasks: {Percentage}% of tasks are specific and actionable
- Vague Tasks: {Count} tasks need more specificity
- Missing Checkboxes: {Count} tasks missing proper checkbox format
- Unclear Deliverables: {Count} tasks with unclear expected outcomes
```

#### Section 3.2: MCP Tool Integration Validation
```
FOR EACH PHASE, validate MCP integration:

CONTEXT7 INTEGRATION:
- [ ] Research commands specific to feature technology stack
- [ ] Library paths and topics relevant to feature domain
- [ ] Commands properly formatted with required parameters
- [ ] Research timing (before implementation tasks) is appropriate

PERPLEXITY INTEGRATION:
- [ ] Research queries specific to feature domain and requirements
- [ ] Best practices research relevant to feature implementation
- [ ] Timing of research aligned with implementation needs
- [ ] Query formulation clear and specific

SHADCN/UI INTEGRATION:
- [ ] Component generation commands with detailed specifications
- [ ] Design system integration (docs/04-design-system.md) referenced
- [ ] UX pattern integration (docs/03-ux-design.md) referenced
- [ ] Feature-specific functionality included in component descriptions
- [ ] Accessibility requirements included in component generation

MCP INTEGRATION QUALITY:
- Context7 Usage: {Excellent/Good/Needs Improvement}
- Perplexity Usage: {Excellent/Good/Needs Improvement}
- Shadcn/UI Usage: {Excellent/Good/Needs Improvement}
- Integration Timing: {Well-coordinated/Adequate/Poor}
```

### 4. Design System Integration Validation

#### Section 4.1: Design System Reference Validation
```
FOR EACH PHASE, validate design system integration:

DESIGN SYSTEM REFERENCES:
- [ ] docs/04-design-system.md referenced in Important Instructions
- [ ] Design system referenced in Shadcn/UI component generation
- [ ] Color tokens, typography, and spacing mentioned appropriately
- [ ] Component patterns from design system integrated
- [ ] Brand guidelines and styling consistency addressed

UX PATTERN REFERENCES:
- [ ] docs/03-ux-design.md referenced for user flows
- [ ] Feature-specific user journeys incorporated
- [ ] Interaction patterns appropriate for feature type
- [ ] Navigation and workflow patterns consistent

INTERFACE STATE REFERENCES:
- [ ] docs/05-interface-states.md patterns referenced where applicable
- [ ] Error states and user feedback mechanisms included
- [ ] Loading states and data management patterns addressed
- [ ] State transitions and user flow continuity planned

DESIGN INTEGRATION SCORE:
- Reference Completeness: {Percentage}%
- Pattern Appropriateness: {High/Medium/Low}
- Consistency with Design System: {Excellent/Good/Needs Improvement}
```

### 5. Quality Standards Validation

#### Section 5.1: Testing Coverage Assessment
```
FOR EACH PHASE, validate testing requirements:

TEST COVERAGE REQUIREMENTS:
- [ ] 95%+ test coverage explicitly required
- [ ] Unit testing for business logic specified
- [ ] Integration testing for API endpoints required
- [ ] End-to-end testing for user workflows planned
- [ ] Component testing for UI elements included
- [ ] Performance testing requirements specified
- [ ] Security testing considerations included
- [ ] Accessibility testing requirements defined

TESTING SPECIFICITY:
- Test Scenarios: {Specific/Generic/Missing}
- Coverage Metrics: {Clearly defined/Vague/Not specified}
- Testing Tools: {Specified/Implied/Not mentioned}
- Validation Criteria: {Clear/Unclear/Missing}

QUALITY ASSURANCE METRICS:
- Testing Comprehensiveness: {Percentage}%
- Performance Requirements: {Well-defined/Adequate/Insufficient}
- Security Considerations: {Comprehensive/Basic/Missing}
- Accessibility Compliance: {WCAG 2.1 AA addressed/Partial/Not mentioned}
```

#### Section 5.2: Performance and Security Validation
```
FOR EACH PHASE, validate performance and security:

PERFORMANCE REQUIREMENTS:
- [ ] Feature-specific performance benchmarks from Section 3.X.9
- [ ] Load time optimization requirements specified
- [ ] Database query optimization planned
- [ ] Caching strategies appropriate for feature type
- [ ] Memory usage optimization considered
- [ ] API response time requirements defined

SECURITY CONSIDERATIONS:
- [ ] Authentication requirements appropriate for feature
- [ ] Authorization checks planned for feature access
- [ ] Input validation and sanitization included
- [ ] Error handling secure and informative
- [ ] Data protection measures appropriate for feature data sensitivity
- [ ] API security measures (rate limiting, validation) included

PERFORMANCE & SECURITY SCORES:
- Performance Planning: {Excellent/Good/Needs Improvement}
- Security Integration: {Comprehensive/Adequate/Insufficient}
- Optimization Strategy: {Well-planned/Basic/Missing}
```

### 6. Cross-Phase Consistency Validation

#### Section 6.1: Feature Integration Validation
```
VALIDATE INTEGRATION BETWEEN PHASES:

DEPENDENCY VALIDATION:
- [ ] Phase dependencies clearly identified and logical
- [ ] Feature integration points properly planned
- [ ] Database schema evolution consistent across phases
- [ ] API endpoint relationships maintained
- [ ] User experience flow continuity preserved
- [ ] Authentication and authorization consistent

CONSISTENCY CHECKS:
- [ ] Data models consistent across phases
- [ ] API naming conventions consistent
- [ ] UI component library usage consistent
- [ ] Error handling patterns consistent
- [ ] Performance requirements aligned
- [ ] Security measures consistent

INTEGRATION ASSESSMENT:
- Dependency Management: {Well-planned/Adequate/Unclear}
- Cross-Phase Consistency: {Excellent/Good/Needs Improvement}
- Feature Isolation: {Proper/Some overlap/Excessive coupling}
```

### 7. Generate Validation Report

#### Comprehensive Validation Report
```markdown
# Universal Format Phase Validation Report

## Executive Summary
**Total Phases Validated:** {N} phases
**Overall Compliance Score:** {Percentage}%
**Implementation Readiness:** {Ready/Needs Minor Fixes/Needs Major Revisions}

## Structural Compliance Results

### Universal Format Adherence
**Phase 0 (Foundation):** {Compliance percentage}% - {Status}
- Strengths: {List key strengths}
- Issues: {List specific issues}
- Recommendations: {List specific improvements}

**Phase 1 ({Feature Name}):** {Compliance percentage}% - {Status}
- Strengths: {List key strengths}
- Issues: {List specific issues}  
- Recommendations: {List specific improvements}

[Continue for all phases]

### Critical Issues Identified
**High Priority Issues:**
1. {Issue description} - Found in Phase {N}
2. {Issue description} - Found in Phase {N}

**Medium Priority Issues:**
1. {Issue description} - Found in Phase {N}
2. {Issue description} - Found in Phase {N}

**Low Priority Issues:**
1. {Issue description} - Found in Phase {N}
2. {Issue description} - Found in Phase {N}

## Content Quality Assessment

### Feature-Specific Content Quality
**Average Content Quality Score:** {Percentage}%

**Excellent Phases (90%+):**
- Phase {N}: {Feature Name} - {Score}%
- Phase {N}: {Feature Name} - {Score}%

**Good Phases (75-89%):**
- Phase {N}: {Feature Name} - {Score}% - {Improvement areas}

**Needs Improvement (<75%):**
- Phase {N}: {Feature Name} - {Score}% - {Critical improvements needed}

### Reference Accuracy
**Design System Integration:** {Percentage}% of phases properly reference design system
**Technical Specification Integration:** {Percentage}% of phases properly reference feature specs
**UX Pattern Integration:** {Percentage}% of phases properly reference UX patterns

## Implementation Readiness Assessment

### Task Quality Metrics
**Atomic Task Percentage:** {Percentage}% of tasks are specific and actionable
**MCP Integration Quality:** {Excellent/Good/Needs Improvement}
**Git Workflow Compliance:** {Percentage}% of phases have proper git workflow

### Testing and Quality Standards
**95%+ Test Coverage Requirement:** {Percentage}% of phases clearly specify
**Performance Requirements:** {Percentage}% of phases include specific benchmarks
**Accessibility Compliance:** {Percentage}% of phases address WCAG 2.1 AA

## Cross-Phase Consistency Analysis

### Integration Validation
**Dependency Management:** {Well-planned/Adequate/Unclear}
**Feature Isolation:** {Proper/Some overlap/Excessive coupling}
**Data Model Consistency:** {Consistent/Minor inconsistencies/Major issues}
**API Design Consistency:** {Consistent/Minor inconsistencies/Major issues}

## Recommendations for Improvement

### Immediate Actions Required (Before Implementation)
1. **{High Priority Issue}**
   - Phases Affected: {List phases}
   - Specific Actions: {List required changes}
   - Impact: {Implementation impact if not fixed}

2. **{High Priority Issue}**
   - Phases Affected: {List phases}
   - Specific Actions: {List required changes}
   - Impact: {Implementation impact if not fixed}

### Recommended Improvements (Can be addressed during implementation)
1. **{Medium Priority Issue}**
   - Phases Affected: {List phases}
   - Suggested Improvements: {List improvements}
   - Benefits: {Benefits of implementing improvements}

### Quality Enhancements (Optional but recommended)
1. **{Low Priority Enhancement}**
   - Potential Benefits: {List benefits}
   - Implementation Effort: {Low/Medium/High}

## Implementation Readiness Checklist

### Ready for Implementation
- [ ] All phases follow Universal Format structure
- [ ] Feature-specific content is comprehensive and accurate
- [ ] MCP tool integration is properly configured
- [ ] Design system integration is consistent
- [ ] Testing requirements meet 95%+ coverage standard
- [ ] Performance and security requirements are defined
- [ ] Cross-phase dependencies are clearly identified
- [ ] Git workflow is properly structured
- [ ] Project status file updates are included

### Final Recommendation
**Implementation Status:** {Ready to Begin/Ready with Minor Fixes/Requires Revision}

**Next Steps:**
1. {Specific next step}
2. {Specific next step}  
3. {Specific next step}

**Quality Assurance Notes:**
- {Important note about quality standards}
- {Important note about implementation approach}
- {Important note about team coordination}
```

### 8. MCP Tool Integration for Validation

#### Context7 Validation Research
```
Use Context7 MCP to research:
1. Universal Format best practices and compliance standards
2. Vertical slice architecture validation techniques
3. Quality assurance frameworks for technical documentation
4. Test-driven development requirements and coverage standards
5. Design system integration patterns and validation methods
```

#### Perplexity Validation Analysis
```
Use Perplexity MCP to:
1. Research industry standards for technical specification validation
2. Validate testing coverage requirements and quality metrics
3. Analyze phase planning and implementation readiness criteria
4. Research quality assurance best practices for development workflows
```

#### Sequential Thinking Validation Logic
```
Use Sequential Thinking MCP to:
1. Analyze validation logic and assessment criteria
2. Validate cross-phase consistency and integration patterns
3. Review quality standards and implementation readiness requirements
4. Assess overall compliance and recommendation priorities
```

### 9. Output Summary

```
✅ Universal Format Phase Validation Complete

📊 Validation Results:
- Total Phases Validated: {N} phases
- Overall Compliance Score: {Percentage}%
- Implementation Readiness: {Status}
- Critical Issues: {Count} high priority
- Improvement Opportunities: {Count} medium priority

📄 Generated Validation Report:
- Comprehensive compliance assessment
- Feature-specific content quality analysis
- Implementation readiness evaluation
- Cross-phase consistency validation
- Specific improvement recommendations

🎯 Quality Assessment:
- Structural Compliance: {Percentage}% average
- Content Quality: {Percentage}% average
- MCP Integration: {Quality level}
- Design System Integration: {Percentage}% compliant
- Testing Standards: {Percentage}% meet 95%+ requirement

🔧 Key Findings:
- Excellent Phases: {Count} phases scoring 90%+
- Good Phases: {Count} phases scoring 75-89%
- Needs Improvement: {Count} phases scoring <75%
- Ready for Implementation: {Yes/With Minor Fixes/Requires Revision}

Next Steps:
1. Review validation report for critical issues
2. Address high-priority issues before implementation
3. Consider medium-priority improvements for quality enhancement
4. Begin implementation with validated Universal Format phases
5. Maintain quality standards throughout development

🎯 **Validation Achievement**: Comprehensive quality assurance ensuring
Universal Format phases meet all standards for successful implementation!
```

## Error Handling

### Missing Phase Documents
```
If generated phases are missing:
1. Direct user to complete Step 8.2 (Phase Generation) first
2. Verify phase documents exist in phases/ directory
3. Check that Universal Format template was followed
```

### Validation Failures
```
If validation identifies critical issues:
1. Provide specific remediation steps for each issue
2. Prioritize issues by implementation impact
3. Recommend re-generation of problematic phases
4. Suggest quality improvement strategies
```

This sub-agent ensures Universal Format phases meet all quality, compliance, and implementation readiness standards before development begins.