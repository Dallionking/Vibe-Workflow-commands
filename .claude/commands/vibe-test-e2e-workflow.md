---
description: Run comprehensive end-to-end workflow validation test
allowed-tools:
  - mcp__sequential-thinking__sequentialthinking
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
parameters:
  - --project-type
  - --verbose
  - --quick
  - --performance-only
---

# vibe-test-e2e-workflow

Run comprehensive end-to-end workflow validation test

## Usage
`/vibe-test-e2e-workflow [--project-type] [--verbose] [--quick] [--performance-only]`

# Vibe Coding End-to-End Workflow Tester

## Agent Configuration
- **Command**: `/vibe-test-e2e-workflow`
- **Prerequisites**: None (creates test environment)
- **Outputs**: 
  - `tests/e2e-workflow-report.md`
  - `.vibe-test/workflow-validation.json`
  - `tests/e2e-logs/`
- **MCP Tools**: 
  - Sequential Thinking (for detailed testing steps)
  - Context7 (for validation research)

## Mission Statement
**I am the End-to-End Workflow Tester Agent.** I validate the complete Vibe Coding methodology by running through all 10 steps in a controlled test environment, ensuring seamless integration, proper file generation, and adherence to quality standards.

## Core Functionality

### 1. Pre-Test Environment Setup
```bash
# Create isolated test environment
mkdir -p vibe-e2e-test
cd vibe-e2e-test
mkdir -p tests/e2e-logs
mkdir -p .vibe-test
```

### 2. Full Workflow Simulation
**Test Project Specifications:**
- Project Type: SaaS Startup (Task Management App)
- Target: Small business teams
- Tech Stack: React, Node.js, PostgreSQL
- Features: Task creation, team collaboration, reporting

### 3. Step-by-Step Validation

#### Step 1: Project Initialization
```bash
# Test: /vibe-init
Expected Outputs:
- .vibe-status.md created
- CLAUDE.md generated
- Git repository initialized
- Project structure created

Validation Checks:
✓ All required directories exist
✓ .vibe-status.md contains correct metadata
✓ Git repository properly initialized
✓ CLAUDE.md follows project template
```

#### Step 2: Project Specification
```bash
# Test: /vibe-step-1-ideation
Expected Outputs:
- docs/01-project-specification.md

Validation Checks:
✓ Document contains all required sections
✓ Business goals clearly defined
✓ Target audience specified
✓ Value proposition articulated
✓ Success metrics identified
```

#### Step 3: Technical Architecture
```bash
# Test: /vibe-step-2-architecture
Expected Outputs:
- docs/02-technical-architecture.md

Validation Checks:
✓ Technology stack defined
✓ Architecture patterns selected
✓ Scalability considerations included
✓ Security requirements outlined
✓ Integration points identified
```

#### Step 4: MCP Setup
```bash
# Test: /vibe-step-2.5-mcp-setup
Expected Outputs:
- .vibe/mcp-status.json
- docs/02.5-mcp-configuration.md

Validation Checks:
✓ MCP tools properly configured
✓ Installation scripts generated
✓ Configuration validated
✓ Health checks passing
```

#### Step 5: UX Design
```bash
# Test: /vibe-step-3-ux-design
Expected Outputs:
- docs/03-ux-design.md

Validation Checks:
✓ User personas defined
✓ User journeys mapped
✓ Information architecture complete
✓ Wireframes specified
✓ Interaction patterns documented
```

#### Step 6: Design System
```bash
# Test: /vibe-step-4-design-system
Expected Outputs:
- docs/04-design-system.md

Validation Checks:
✓ Brand guidelines established
✓ Color palette defined
✓ Typography scale specified
✓ Component library outlined
✓ Accessibility standards included
```

#### Step 7: Interface States
```bash
# Test: /vibe-step-5-interface
Expected Outputs:
- docs/05-interface-states.md

Validation Checks:
✓ Application states mapped
✓ State transitions defined
✓ Loading states specified
✓ Error handling documented
✓ User feedback patterns established
```

#### Step 8: Technical Specification
```bash
# Test: /vibe-step-6-technical
Expected Outputs:
- docs/06-technical-specification.md

Validation Checks:
✓ API design complete
✓ Database schema defined
✓ Security implementation planned
✓ Integration specifications ready
✓ Feature Implementation Priority Matrix created
```

#### Step 9: Landing Page Creation (3-Part Process)
```bash
# Test: /vibe-landing-avatar
Expected Outputs:
- docs/07-landing-page/customer-avatars.md

Validation Checks:
✓ 5 awareness stages documented
✓ Customer psychology analyzed
✓ Pain points identified
✓ Language patterns captured

# Test: /vibe-landing-diary
Expected Outputs:
- docs/07-landing-page/emotional-diary.md

Validation Checks:
✓ Emotional journey mapped
✓ Page structure defined
✓ Conversion elements planned
✓ Mobile experience optimized

# Test: /vibe-landing-copy
Expected Outputs:
- docs/07-landing-page/landing-page.md

Validation Checks:
✓ Complete copy generated
✓ A/B test variations included
✓ SEO optimization applied
✓ Conversion psychology implemented
```

#### Step 10: Vertical Slices
```bash
# Test: /vibe-step-8-slices
Expected Outputs:
- phases/phase-*.md (multiple files)

Validation Checks:
✓ Universal Format compliance
✓ Feature-to-phase mapping accurate
✓ Customer avatar insights integrated
✓ Implementation priorities respected
✓ All phases contain required sections
```

#### Step 11: Claude.md Generation
```bash
# Test: /vibe-step-9-claude-md
Expected Outputs:
- claude.md (updated)

Validation Checks:
✓ Project-specific rules included
✓ Auto-initialization configured
✓ Quality standards enforced
✓ Team guidelines established
```

#### Step 12: Service Initialization
```bash
# Test: /vibe-step-10-init-services
Expected Outputs:
- Service connection status

Validation Checks:
✓ All MCPs properly connected
✓ Project services initialized
✓ Health checks passing
✓ Configuration validated
```

### 4. Integration Testing

#### Cross-Step Dependencies
```bash
# Validate data flow between steps
Test 1: Step 1 → Step 2 data inheritance
Test 2: Step 6 → Step 8 feature mapping
Test 3: Step 7 → Step 8 avatar integration
Test 4: Design system → landing page consistency
Test 5: Architecture → technical spec alignment
```

#### File Integrity Checks
```bash
# Validate all generated files
✓ All required files exist
✓ No broken internal links
✓ Consistent formatting applied
✓ No placeholder content remaining
✓ Proper markdown structure
```

#### Universal Format Compliance
```bash
# Validate vertical slice format
✓ All sections present and complete
✓ Acceptance criteria properly defined
✓ Testing requirements specified
✓ Git workflow included
✓ Documentation standards met
```

### 5. Performance Testing

#### Execution Time Metrics
```bash
Step 1 (Init): Target < 30 seconds
Step 2 (Spec): Target < 2 minutes
Step 3 (Architecture): Target < 3 minutes
Step 4 (MCP): Target < 1 minute
Step 5 (UX): Target < 3 minutes
Step 6 (Design): Target < 2 minutes
Step 7 (Interface): Target < 2 minutes
Step 8 (Technical): Target < 5 minutes
Step 9 (Landing): Target < 4 minutes each part
Step 10 (Slices): Target < 8 minutes
Step 11 (Claude.md): Target < 1 minute
Step 12 (Services): Target < 2 minutes

Total Workflow: Target < 45 minutes
```

#### Resource Usage
```bash
✓ Memory usage stays within limits
✓ File system impact reasonable
✓ MCP connection efficiency
✓ No resource leaks detected
```

### 6. Quality Validation

#### Documentation Quality
```bash
✓ All documents professionally formatted
✓ Technical accuracy verified
✓ Consistency across documents
✓ Completeness validated
✓ Readability scores acceptable
```

#### Code Quality Standards
```bash
✓ Generated code follows best practices
✓ Security considerations implemented
✓ Performance optimizations included
✓ Testing requirements specified
✓ Documentation standards met
```

### 7. Error Handling Testing

#### Intentional Failure Scenarios
```bash
Test 1: Missing prerequisite files
Test 2: Invalid project configurations
Test 3: MCP connection failures
Test 4: Disk space limitations
Test 5: Permission issues
Test 6: Network connectivity problems
```

#### Recovery Testing
```bash
✓ Graceful error messages
✓ Recovery suggestions provided
✓ Partial progress preserved
✓ Rollback capabilities tested
✓ User guidance clear
```

### 8. Browser Testing Integration
```bash
# Validate browser testing components
✓ Playwright configuration generated
✓ Test templates created
✓ Visual regression setup
✓ Accessibility testing enabled
✓ Performance monitoring configured
```

### 9. Report Generation

#### Test Results Summary
```markdown
# E2E Workflow Test Report

## Test Environment
- Date: [Test execution date]
- Duration: [Total execution time]
- Project Type: SaaS Startup Task Management
- Success Rate: [Percentage of tests passed]

## Step-by-Step Results
[Detailed results for each step]

## Integration Test Results
[Cross-step dependency validation]

## Performance Metrics
[Execution times and resource usage]

## Quality Scores
[Documentation and code quality ratings]

## Issues Identified
[List of problems found with severity levels]

## Recommendations
[Improvement suggestions based on findings]

## Next Steps
[Actions required to address any issues]
```

#### Validation JSON Output
```json
{
  "testRun": {
    "timestamp": "2024-01-XX",
    "duration": "42 minutes",
    "successRate": "98%",
    "environment": "e2e-test"
  },
  "stepResults": {
    "step1": { "status": "passed", "duration": "28s", "issues": [] },
    "step2": { "status": "passed", "duration": "95s", "issues": [] },
    // ... all steps
  },
  "integrationTests": {
    "crossStepDependencies": "passed",
    "fileIntegrity": "passed",
    "universalFormat": "passed"
  },
  "performance": {
    "totalTime": "42:15",
    "averageStepTime": "3:45",
    "resourceUsage": "acceptable"
  },
  "quality": {
    "documentationScore": 9.2,
    "codeQualityScore": 8.8,
    "consistencyScore": 9.5
  },
  "issues": [
    {
      "severity": "low",
      "step": "step8",
      "description": "Minor formatting inconsistency",
      "recommendation": "Update template formatting"
    }
  ]
}
```

## Execution Process

### 1. Environment Preparation
```bash
echo "🧪 Starting E2E Workflow Test"
echo "Creating isolated test environment..."
mkdir -p vibe-e2e-test && cd vibe-e2e-test
```

### 2. Sequential Step Execution
```bash
echo "📋 Executing all workflow steps..."
# Run each step in sequence with validation
# Log all outputs and errors
# Measure execution times
# Validate file generation
```

### 3. Integration Validation
```bash
echo "🔗 Validating step integrations..."
# Check data flow between steps
# Validate file dependencies
# Ensure consistency across outputs
```

### 4. Quality Assessment
```bash
echo "🎯 Assessing output quality..."
# Analyze generated documentation
# Validate code quality
# Check compliance standards
```

### 5. Report Generation
```bash
echo "📊 Generating test report..."
# Compile all results
# Generate recommendations
# Create actionable insights
```

## Success Criteria

### Primary Objectives
- ✅ All 12 workflow steps execute successfully
- ✅ All required files generated correctly
- ✅ Integration points work seamlessly
- ✅ Quality standards maintained throughout
- ✅ Total execution time under 45 minutes

### Quality Thresholds
- Documentation quality score: > 8.5/10
- Code quality score: > 8.0/10
- Consistency score: > 9.0/10
- Error rate: < 2%
- Performance: All steps within target times

## Continuous Integration

### Automated Testing Schedule
- Run full E2E test before major releases
- Quick validation tests on agent updates
- Performance regression testing weekly
- Quality threshold monitoring daily

### Integration with Development Workflow
- Pre-commit hooks for agent validation
- PR checks include E2E subset testing
- Release validation includes full test suite
- Performance benchmarking on every build

## Troubleshooting Guide

### Common Issues
1. **MCP Connection Failures**: Check network, retry with fallbacks
2. **File Generation Errors**: Validate permissions, disk space
3. **Template Inconsistencies**: Review template updates, format validation
4. **Performance Degradation**: Profile execution, identify bottlenecks
5. **Quality Score Drops**: Analyze content generation, update prompts

### Debug Commands
```bash
# Enable verbose logging
export VIBE_DEBUG=true

# Run specific step in isolation
/vibe-test-step --step=6 --verbose

# Validate specific integration
/vibe-test-integration --from=7 --to=8

# Check quality metrics only
/vibe-test-quality --analyze-only
```

## Future Enhancements

### Test Coverage Expansion
- Multi-project type testing (enterprise, mobile)
- Different technology stack combinations
- Various team size scenarios
- International localization testing

### Advanced Validation
- AI-powered quality assessment
- Automated code review integration
- Performance regression detection
- User experience simulation

### Reporting Improvements
- Interactive HTML reports
- Trend analysis over time
- Comparison with industry benchmarks
- Automated improvement suggestions

This comprehensive E2E testing ensures the Vibe Coding methodology delivers consistent, high-quality results across all scenarios and maintains reliability as the system evolves.