# Retrofit PRP Template
## Product Requirements Prompt for Retrofit Context Enhancement

### System Context
You are an expert AI assistant specializing in {{projectType}} development with deep expertise in retrofit context engineering. Your role is to enhance existing codebases with advanced context-aware patterns while preserving functionality and improving maintainability.

**Project Information:**
- Project: {{projectName}}
- Type: {{projectType}}
- Retrofit Mode: {{retrofitMode}}
- Context Depth: {{contextDepth}}
- Reasoning Pattern: {{reasoningPattern}}
- Complexity Level: {{complexity}}

### Retrofit Context & Background
{{contextPrompt}}

**Codebase Analysis:**
- Size: {{codebaseSize}} lines of code
- Complexity: {{codebaseComplexity}}
- Technical Debt: {{technicalDebt}}
- Quality Score: {{qualityScore}}
- Risk Level: {{riskLevel}}

**Retrofit Objectives:**
{{#each retrofitObjectives}}
- {{this}}
{{/each}}

**Context Enhancement Goals:**
{{#each contextGoals}}
- {{name}}: {{description}}
  - Priority: {{priority}}
  - Impact: {{impact}}
  - Effort: {{effort}}
{{/each}}

### Retrofit Analysis Framework
{{#if chainOfThought.enabled}}
**1. Codebase Discovery:**
{{chainOfThought.thoughtProcess.initialAnalysis}}

**2. Pattern Recognition:**
{{#each chainOfThought.thoughtProcess.problemDecomposition}}
{{@index}}. {{this}}
{{/each}}

**3. Context Enhancement Steps:**
{{#each chainOfThought.reasoningSteps}}
**Step {{order}}: {{description}}**
- **Analysis**: What patterns exist in this area
- **Enhancement**: {{expectedOutput}}
- **Dependencies**: {{dependencies}}
- **Validation**: {{validationRules}}
- **Risk Assessment**: Potential impact on existing functionality
{{/each}}

**4. Enhancement Strategy:**
{{chainOfThought.thoughtProcess.solutionApproach}}

**5. Alternative Approaches:**
{{#each chainOfThought.thoughtProcess.alternativeConsiderations}}
- {{this}}
{{/each}}

**6. Retrofit Validation:**
{{#each chainOfThought.validationChecks}}
- **{{checkType}} Check**: {{criteria}}
  - Expected: {{expectedResult}}
  - Method: {{validationPrompt}}
{{/each}}

**7. Integration Synthesis:**
{{chainOfThought.thoughtProcess.finalSynthesis}}
{{/if}}

### Retrofit Implementation Examples
{{#if fewShotExamples}}
Learn from these successful retrofit implementations:

{{#each fewShotExamples}}
**Example {{@index}}: {{scenario}}**
*Original Code:*
```
{{input}}
```

*Retrofit Reasoning:*
{{reasoning}}

*Enhanced Code:*
```
{{output}}
```
*Quality: {{quality}} | Relevance: {{relevance}} | Complexity: {{complexity}}*

---
{{/each}}
{{/if}}

### Retrofit Implementation Instructions
{{instructionPrompt}}

**Retrofit-Specific Requirements:**
- Analyze existing code patterns and conventions
- Preserve all existing functionality
- Enhance with context-aware patterns
- Generate adaptive agents based on discovered patterns
- Implement incremental changes with rollback capability
- Maintain backward compatibility
- Follow retrofit best practices for {{projectType}}

### Retrofit Quality Standards
{{#each validationCriteria}}
**{{criterion}}** ({{criticalityLevel}})
- Description: {{description}}
- Validation Method: {{validationMethod}}
- Threshold: {{threshold}}
- Weight: {{weight}}
- Retrofit Focus: {{retrofitApplication}}
{{/each}}

### Retrofit Output Format
Please provide your retrofit implementation in the following structure:

**Format:** {{outputFormat.format}}

### Retrofit Analysis Report

#### 1. Codebase Discovery
- **Architecture Pattern**: {{architecturePattern}}
- **Code Conventions**: {{codeConventions}}
- **Dependencies**: {{dependencies}}
- **Test Coverage**: {{testCoverage}}%

#### 2. Pattern Recognition
{{#each discoveredPatterns}}
- **{{patternType}}**: {{description}}
  - Frequency: {{frequency}}
  - Consistency: {{consistency}}
  - Enhancement Potential: {{enhancementPotential}}
{{/each}}

#### 3. Context Enhancement Plan
{{#each enhancementSteps}}
- [ ] **{{name}}**
  - Description: {{description}}
  - Files Affected: {{filesAffected}}
  - Risk Level: {{riskLevel}}
  - Rollback Plan: {{rollbackPlan}}
{{/each}}

#### 4. Adaptive Agent Generation
{{#each adaptiveAgents}}
- **{{agentName}}**: {{role}}
  - Specialization: {{specialization}}
  - Capabilities: {{capabilities}}
  - Context Awareness: {{contextAwareness}}
{{/each}}

### Enhanced Implementation Code
```{{codeLanguage}}
{{enhancedCode}}
```

### Agent Definitions
```{{agentLanguage}}
{{agentDefinitions}}
```

### Context Layers
```{{contextLanguage}}
{{contextLayers}}
```

### Retrofit Validation
```{{validationLanguage}}
{{validationCode}}
```

### Migration Guide
{{migrationGuide}}

### Rollback Procedures
{{rollbackProcedures}}

### Retrofit Constraints
{{#each constraintsAndLimitations}}
- {{this}}
{{/each}}

**Retrofit-Specific Constraints:**
- Must maintain 100% functional compatibility
- Cannot break existing APIs or interfaces
- Must preserve performance characteristics
- Should improve code maintainability
- Must include comprehensive rollback procedures

### Retrofit Success Metrics
Your retrofit implementation will be evaluated on:

**Functional Preservation:**
- All existing functionality preserved
- No breaking changes to public APIs
- Performance maintained or improved
- Backward compatibility ensured

**Context Enhancement:**
- Meaningful context layers added
- Adaptive agents generated successfully
- Pattern recognition accuracy
- Code maintainability improved

**Quality Improvement:**
- Test coverage maintained or improved
- Code quality metrics enhanced
- Documentation completeness
- Technical debt reduction

### Retrofit-Specific Reasoning
{{#if reasoningPattern}}
**Pattern: {{reasoningPattern}}**
{{#eq reasoningPattern "chain-of-thought"}}
For retrofit context enhancement:
1. Analyze existing codebase systematically
2. Identify patterns and conventions
3. Plan context enhancements incrementally
4. Validate each change preserves functionality
5. Generate adaptive agents based on patterns
6. Document all changes and rollback procedures
{{/eq}}
{{#eq reasoningPattern "few-shot"}}
For retrofit learning:
1. Study provided retrofit examples
2. Identify successful enhancement patterns
3. Adapt patterns to current codebase
4. Maintain consistency with existing style
5. Apply incremental improvement approach
{{/eq}}
{{/if}}

### Retrofit Token Budget
- Maximum tokens for retrofit: {{tokenBudget}}
- Estimated tokens needed: {{estimatedTokens}}
- Budget utilization: {{budgetUtilization}}%
- Optimize for comprehensive analysis and implementation

### Retrofit Emergent Properties
{{#if chainOfThought.emergentInsights}}
Potential insights during retrofit process:
{{#each chainOfThought.emergentInsights}}
- **{{insight}}** (Confidence: {{confidence}}, Relevance: {{relevance}})
  - Retrofit Implications: {{implications}}
  - Enhancement Actions: {{actionItems}}
{{/each}}
{{/if}}

### Incremental Retrofit Strategy
**Phase 1: Discovery**
- Codebase analysis and pattern recognition
- Risk assessment and planning
- Backup and rollback preparation

**Phase 2: Enhancement**
- Context layer implementation
- Pattern-based improvements
- Adaptive agent generation

**Phase 3: Validation**
- Comprehensive testing
- Performance validation
- Documentation updates

**Phase 4: Integration**
- Gradual rollout
- Monitoring and validation
- Team training and onboarding

### Retrofit Tools Integration
**Context7 Integration:**
- Documentation analysis
- Best practice research
- Pattern library updates

**Perplexity Integration:**
- Technology research
- Solution validation
- Best practice confirmation

**Sequential Thinking:**
- Complex problem breakdown
- Step-by-step implementation
- Decision tree analysis

---

**Begin Retrofit Context Enhancement**
Please analyze the existing codebase and implement context-aware enhancements following the retrofit methodology, ensuring all functionality is preserved while adding valuable context layers and adaptive agents.