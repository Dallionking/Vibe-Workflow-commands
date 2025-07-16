# Phase PRP Template
## Product Requirements Prompt for Phase {{currentPhase}} Implementation

### System Context
You are an expert AI assistant specializing in {{projectType}} development, with deep expertise in the Vibe Coding methodology. Your role is to implement Phase {{currentPhase}} of the {{projectName}} project with the highest quality standards.

**Project Information:**
- Project: {{projectName}}
- Type: {{projectType}}
- Current Phase: {{currentPhase}}
- Total Phases: {{totalPhases}}
- Context Depth: {{contextDepth}}
- Reasoning Pattern: {{reasoningPattern}}
- Complexity Level: {{complexity}}

### Phase-Specific Context
{{contextPrompt}}

**Phase {{currentPhase}} Objectives:**
{{#each phaseObjectives}}
- {{this}}
{{/each}}

**Phase Dependencies:**
{{#if previousPhases}}
This phase builds upon:
{{#each previousPhases}}
- Phase {{this}}: {{lookupPhaseTitle this}}
  - Key Deliverables: {{lookupPhaseDeliverables this}}
  - Status: {{lookupPhaseStatus this}}
{{/each}}
{{/if}}

**Phase Deliverables:**
{{#each phaseDeliverables}}
- {{name}}: {{description}}
  - Priority: {{priority}}
  - Complexity: {{complexity}}
  - Dependencies: {{dependencies}}
{{/each}}

### Vibe Coding Methodology Integration
**10-Step Process Application:**
{{#each vibeSteps}}
**Step {{order}}: {{name}}**
- Phase {{currentPhase}} Focus: {{phaseApplication}}
- Key Activities: {{keyActivities}}
- Success Criteria: {{successCriteria}}
{{/each}}

### Chain of Thought for Phase Implementation
{{#if chainOfThought.enabled}}
**Phase Analysis Framework:**

**1. Initial Phase Assessment:**
{{chainOfThought.thoughtProcess.initialAnalysis}}

**2. Phase Decomposition:**
{{#each chainOfThought.thoughtProcess.problemDecomposition}}
{{@index}}. {{this}}
{{/each}}

**3. Implementation Reasoning Steps:**
{{#each chainOfThought.reasoningSteps}}
**Step {{order}}: {{description}}**
- **Context**: What needs to be done in this phase
- **Approach**: {{expectedOutput}}
- **Dependencies**: {{dependencies}}
- **Validation**: {{validationRules}}
- **Quality Gates**: Ensure 95%+ test coverage and Universal Format compliance
{{/each}}

**4. Phase Solution Strategy:**
{{chainOfThought.thoughtProcess.solutionApproach}}

**5. Alternative Implementation Approaches:**
{{#each chainOfThought.thoughtProcess.alternativeConsiderations}}
- {{this}}
{{/each}}

**6. Phase Validation Framework:**
{{#each chainOfThought.validationChecks}}
- **{{checkType}} Validation**: {{criteria}}
  - Expected Result: {{expectedResult}}
  - Validation Method: {{validationPrompt}}
{{/each}}

**7. Phase Synthesis:**
{{chainOfThought.thoughtProcess.finalSynthesis}}
{{/if}}

### Phase Implementation Examples
{{#if fewShotExamples}}
Learn from these Phase {{currentPhase}} implementation examples:

{{#each fewShotExamples}}
**Example {{@index}}: {{scenario}}**
*Phase Context:*
```
{{input}}
```

*Implementation Reasoning:*
{{reasoning}}

*Phase Output:*
```
{{output}}
```
*Quality Assessment: {{quality}} | Relevance: {{relevance}} | Complexity: {{complexity}}*

---
{{/each}}
{{/if}}

### Phase Implementation Instructions
{{instructionPrompt}}

**Phase-Specific Requirements:**
- Implement all subtasks in the correct tier order (Tier 1 → Tier 2 → Tier 3)
- Mark each subtask as [x] when completed
- Generate comprehensive documentation following Universal Format
- Ensure 95%+ test coverage for all implemented features
- Create proper error handling and validation
- Follow existing project patterns and conventions
- Integrate with MCP tools (Context7, Perplexity, etc.)

### Phase Quality Standards
{{#each validationCriteria}}
**{{criterion}}** ({{criticalityLevel}})
- Description: {{description}}
- Validation Method: {{validationMethod}}
- Threshold: {{threshold}}
- Weight: {{weight}}
- Phase Application: {{phaseApplication}}
{{/each}}

### Phase Output Format
Please provide your Phase {{currentPhase}} implementation in the following structure:

**Format:** {{outputFormat.format}}

### Phase {{currentPhase}} Implementation

#### Tier 1: Foundation
{{#each tier1Tasks}}
- [ ] {{name}}
  - Description: {{description}}
  - Acceptance Criteria: {{acceptanceCriteria}}
  - Validation: {{validation}}
{{/each}}

#### Tier 2: Integration
{{#each tier2Tasks}}
- [ ] {{name}}
  - Description: {{description}}
  - Acceptance Criteria: {{acceptanceCriteria}}
  - Validation: {{validation}}
{{/each}}

#### Tier 3: Optimization
{{#each tier3Tasks}}
- [ ] {{name}}
  - Description: {{description}}
  - Acceptance Criteria: {{acceptanceCriteria}}
  - Validation: {{validation}}
{{/each}}

### Implementation Code
```{{codeLanguage}}
{{implementationCode}}
```

### Test Coverage
```{{testLanguage}}
{{testCode}}
```

### Documentation
{{documentationContent}}

### Validation Results
{{validationResults}}

### Phase Constraints
{{#each constraintsAndLimitations}}
- {{this}}
{{/each}}

**Phase-Specific Constraints:**
- Complete all subtasks before moving to next tier
- Maintain backward compatibility with previous phases
- Follow the exact file structure and naming conventions
- Use existing MCP integrations where applicable
- Generate artifacts that can be used by subsequent phases

### Phase Success Metrics
Your Phase {{currentPhase}} implementation will be evaluated on:

**Technical Excellence:**
- Code quality and maintainability
- Test coverage (95%+ required)
- Documentation completeness
- Error handling robustness

**Vibe Methodology Adherence:**
- Proper tier-based implementation
- Universal Format compliance
- Context preservation across phases
- MCP tool integration effectiveness

**Project Integration:**
- Seamless integration with existing codebase
- Proper dependency management
- Convention consistency
- Performance optimization

### Phase-Specific Reasoning Pattern
{{#if reasoningPattern}}
**Pattern: {{reasoningPattern}}**
{{#eq reasoningPattern "chain-of-thought"}}
For Phase {{currentPhase}}, use systematic reasoning:
1. Analyze phase requirements and dependencies
2. Break down into implementable subtasks
3. Plan tier-by-tier implementation approach
4. Validate each tier before proceeding
5. Ensure integration with previous phases
6. Generate comprehensive documentation
{{/eq}}
{{#eq reasoningPattern "few-shot"}}
For Phase {{currentPhase}}, learn from examples:
1. Study provided implementation examples
2. Identify successful patterns and approaches
3. Adapt patterns to current phase context
4. Maintain consistency with project standards
5. Apply lessons learned to current implementation
{{/eq}}
{{/if}}

### Phase Token Budget
- Maximum tokens for Phase {{currentPhase}}: {{tokenBudget}}
- Estimated tokens needed: {{estimatedTokens}}
- Budget utilization: {{budgetUtilization}}%
- Optimize for comprehensive implementation within budget

### Phase Emergent Properties
{{#if chainOfThought.emergentInsights}}
Potential insights that may emerge during Phase {{currentPhase}}:
{{#each chainOfThought.emergentInsights}}
- **{{insight}}** (Confidence: {{confidence}}, Relevance: {{relevance}})
  - Phase Implications: {{implications}}
  - Implementation Actions: {{actionItems}}
{{/each}}
{{/if}}

### Phase Integration Points
**Previous Phase Integration:**
{{#if previousPhases}}
{{#each previousPhases}}
- Phase {{this}}: {{integrationPoints}}
{{/each}}
{{/if}}

**Next Phase Preparation:**
{{#if nextPhase}}
- Phase {{nextPhase}}: {{preparationSteps}}
{{/if}}

---

**Begin Phase {{currentPhase}} Implementation**
Please implement Phase {{currentPhase}} following the Vibe Coding methodology, ensuring all subtasks are completed in tier order with comprehensive documentation and testing.