/**
 * CLAUDE.md v2.0 Integration Example
 * Demonstrates how the enhanced CLAUDE.md system works in practice
 */

import { ClaudeMdIntegration } from './claude-md-integration';
import { ValidationGateSystem } from './validation-gates';
import { ClaudeMdMigrator } from './claude-md-migrator';
import * as fs from 'fs';

// Example 1: Creating a new CLAUDE.md v2.0 file
async function createClaudeMdV2Example() {
  const content = `---
version: 2.0
context:
  global:
    priority: 1000
    maxTokens: 2000
    compression: true
  phase:
    priority: 800
    maxTokens: 3000
    dependencies: ["global"]
  task:
    priority: 600
    maxTokens: 2000
    dependencies: ["global", "phase"]
validationGates:
  - id: "requirements-complete"
    phase: "planning"
    requires:
      sections: ["project-overview", "user-stories"]
      files: ["requirements.md", ".vibe-status.md"]
      conditions: ["has_project_description", "has_user_stories"]
  - id: "ready-to-code"
    phase: "implementation"
    requires:
      sections: ["architecture", "coding-standards"]
      previousGates: ["requirements-complete"]
      conditions: ["dependencies_installed", "git_clean"]
  - id: "ready-to-deploy"
    phase: "deployment"
    requires:
      sections: ["deployment-checklist", "security-requirements"]
      previousGates: ["ready-to-code"]
      conditions: ["passes_tests", "passes_linting", "has_documentation"]
dynamicSections:
  - id: "typescript-context"
    trigger: "file:*.ts"
    priority: 900
    sections: ["typescript-standards", "type-patterns"]
  - id: "react-context"
    trigger: "file:*.tsx"
    priority: 900
    sections: ["react-patterns", "component-guidelines"]
  - id: "mcp-context7"
    trigger: "tool:context7"
    priority: 950
    sections: ["context7-usage", "context7-patterns"]
learningPatterns:
  - pattern: "frequent_typescript_errors"
    action: "increase_typescript_context_priority"
  - pattern: "successful_deployments"
    action: "cache_deployment_context"
features:
  autoCompression: true
  contextLearning: true
  dynamicPrioritization: true
  validationStrictMode: false
---

# My SaaS Project

## @global Project Overview
This is a modern SaaS application built with TypeScript, React, and Node.js. 
The application provides a comprehensive solution for team collaboration and project management.

Key features:
- Real-time collaboration
- Advanced project tracking
- Integration with popular tools
- Enterprise-grade security

## @global Architecture Principles
Our architecture follows these core principles:
1. **Microservices**: Each domain is a separate service
2. **Event-driven**: Services communicate via events
3. **API-first**: All functionality exposed via REST/GraphQL
4. **Cloud-native**: Designed for Kubernetes deployment
5. **Security-first**: Zero-trust architecture

## @phase:planning User Stories
As a project manager, I want to:
- Create and manage projects with custom workflows
- Assign tasks to team members with deadlines
- Track progress with real-time dashboards
- Generate reports for stakeholders

## @phase:planning Requirements Analysis
### Functional Requirements
- User authentication and authorization
- Project CRUD operations
- Task management system
- Real-time notifications
- Reporting and analytics

### Non-functional Requirements
- 99.9% uptime SLA
- Response time < 200ms
- Support 10,000 concurrent users
- GDPR and SOC2 compliance

## @phase:implementation Coding Standards
### TypeScript Guidelines
- Use strict mode always
- Define explicit types (no 'any')
- Use interfaces for object shapes
- Implement proper error types

### React Patterns
- Functional components with hooks
- Custom hooks for shared logic
- Proper component composition
- Performance optimization with memo

## @phase:implementation API Design
All APIs follow REST principles:
- Use proper HTTP methods
- Return appropriate status codes
- Include pagination for lists
- Version APIs properly (/v1, /v2)

## @task:testing Test Requirements
### Unit Tests
- Minimum 80% code coverage
- Test all edge cases
- Mock external dependencies
- Use descriptive test names

### Integration Tests
- Test API endpoints
- Verify database operations
- Check service communication
- Validate error handling

## @task:git Git Workflow
### Branch Strategy
- main: production-ready code
- develop: integration branch
- feature/*: new features
- hotfix/*: urgent fixes

### Commit Standards
- Use conventional commits
- Include ticket numbers
- Write clear descriptions
- Sign commits with GPG

## @dynamic:typescript TypeScript Standards
### Type Definitions
\`\`\`typescript
// Good
interface User {
  id: string;
  email: string;
  profile: UserProfile;
}

// Bad
interface User {
  id: any;
  email: any;
  profile: any;
}
\`\`\`

### Error Handling
\`\`\`typescript
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}
\`\`\`

## @dynamic:react React Patterns
### Custom Hooks
\`\`\`typescript
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Auth logic
  }, []);
  
  return { user, loading };
}
\`\`\`

## @dynamic:context7 Context7 Usage
When using Context7 for documentation:
1. Always specify the exact version
2. Request specific sections
3. Cache responses for performance
4. Handle rate limits gracefully

## @validation:security Security Requirements
### Pre-deployment Checklist
- [ ] All dependencies updated
- [ ] Security scan passed
- [ ] Secrets properly managed
- [ ] HTTPS enforced
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] SQL injection prevented
- [ ] XSS protection enabled

## @validation:deployment Deployment Checklist
### Production Readiness
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Rollback plan documented
- [ ] Database migrations tested
- [ ] CDN configured
- [ ] Backup strategy implemented
`;

  await fs.promises.writeFile('CLAUDE.md', content, 'utf-8');
  console.log('✅ Created CLAUDE.md v2.0 example');
}

// Example 2: Migrating from v1.0 to v2.0
async function migrateExample() {
  // Create a v1.0 CLAUDE.md for demonstration
  const v1Content = `# CLAUDE.md

## Project Overview
This is a legacy project that needs migration.

## Development Guidelines
Follow these guidelines when developing.

## Testing Requirements
All code must be tested.

## Git Workflow
Use feature branches.
`;

  await fs.promises.writeFile('CLAUDE-v1.md', v1Content, 'utf-8');
  
  // Migrate to v2.0
  await ClaudeMdMigrator.migrate('CLAUDE-v1.md', {
    interactive: false,
    backup: true,
    autoDetect: true
  });
  
  console.log('✅ Migrated CLAUDE.md to v2.0');
}

// Example 3: Using the integrated system
async function useIntegratedSystem() {
  // Initialize the integration
  const integration = new ClaudeMdIntegration({
    claudeMdPath: 'CLAUDE.md',
    enableDynamic: true,
    enableValidation: true,
    enableLearning: true
  });

  await integration.initialize();
  console.log('✅ Initialized CLAUDE.md integration');

  // Load context for planning phase
  console.log('\n📋 Loading context for planning phase...');
  const planningContext = await integration.loadContext({
    phase: 'planning',
    task: 'requirements',
    files: ['requirements.md'],
    tools: ['context7']
  });
  
  console.log('Planning context sections:', planningContext.sections.length);

  // Validate gates for implementation
  console.log('\n🔍 Validating gates for implementation phase...');
  const gates = integration.getValidationGates('implementation');
  
  const gateSystem = new ValidationGateSystem();
  gateSystem.registerGates(gates);
  
  const validation = await gateSystem.validatePhase('implementation', {
    sections: ['architecture', 'coding-standards'],
    files: ['package.json', 'tsconfig.json']
  });

  if (validation.passed) {
    console.log('✅ All validation gates passed');
  } else {
    console.log('❌ Validation gates failed:');
    validation.gates.forEach(gate => {
      if (!gate.passed) {
        console.log(`  - ${gate.id}: ${gate.errors.join(', ')}`);
      }
    });
  }

  // Load context with dynamic triggers
  console.log('\n🔄 Loading context with dynamic triggers...');
  integration.addDynamicTrigger('file:*.ts');
  integration.addDynamicTrigger('file:*.tsx');
  integration.addDynamicTrigger('tool:context7');

  const dynamicContext = await integration.loadContext({
    phase: 'implementation',
    task: 'coding',
    files: ['src/index.ts', 'src/App.tsx']
  });

  console.log('Dynamic sections loaded:', 
    dynamicContext.sections.filter((s: any) => s.metadata?.type === 'dynamic').length
  );

  // Export current state
  const state = integration.exportState();
  console.log('\n📊 Current state:');
  console.log('- Active triggers:', state.triggers.length);
  console.log('- Total sections:', state.sections.length);
  console.log('- Token budgets:', {
    global: state.config.tokenBudget?.distribution.global,
    phase: state.config.tokenBudget?.distribution.phase,
    task: state.config.tokenBudget?.distribution.task
  });
}

// Example 4: Custom validation gate
async function customValidationExample() {
  const gateSystem = new ValidationGateSystem();

  // Register custom condition
  gateSystem.registerCondition('has_readme', async (context) => {
    return context.files.some(f => f.toLowerCase().includes('readme'));
  });

  // Register custom validator
  gateSystem.registerValidator('custom-security-check', async (gate, context) => {
    const errors: string[] = [];

    // Check for security files
    if (!context.files.some(f => f.includes('security'))) {
      errors.push('Missing security documentation');
    }

    // Check for vulnerability scan results
    const scanResults = context.metadata.securityScan;
    if (!scanResults) {
      errors.push('No security scan performed');
    } else if (scanResults.vulnerabilities > 0) {
      errors.push(`Found ${scanResults.vulnerabilities} vulnerabilities`);
    }

    return {
      passed: errors.length === 0,
      errors
    };
  });

  // Register gate
  gateSystem.registerGate({
    id: 'custom-security-check',
    phase: 'deployment',
    requires: {
      sections: ['security-requirements'],
      files: ['security.md'],
      conditions: ['has_readme']
    }
  });

  // Validate
  const result = await gateSystem.validateGate('custom-security-check', {
    files: ['README.md', 'security.md'],
    sections: ['security-requirements'],
    metadata: {
      securityScan: {
        vulnerabilities: 0,
        lastScan: new Date()
      }
    }
  });

  console.log('Custom validation result:', result);
}

// Example 5: Generate validation report
async function generateValidationReport() {
  const integration = new ClaudeMdIntegration();
  await integration.initialize();

  const gateSystem = new ValidationGateSystem();
  
  // Register all gates from CLAUDE.md
  const allPhases = ['planning', 'implementation', 'testing', 'deployment'];
  allPhases.forEach(phase => {
    const gates = integration.getValidationGates(phase);
    gateSystem.registerGates(gates);
  });

  // Validate all phases
  for (const phase of allPhases) {
    await gateSystem.validatePhase(phase, {
      sections: integration.getSectionsForContext('phase', phase).map(s => s.title),
      files: ['package.json', 'README.md', '.env.example']
    });
  }

  // Generate report
  const report = gateSystem.createReport();
  await fs.promises.writeFile('validation-report.md', report, 'utf-8');
  console.log('✅ Generated validation report');
}

// Run examples
async function runExamples() {
  console.log('🚀 Running CLAUDE.md v2.0 Examples\n');

  // Create example file
  await createClaudeMdV2Example();

  // Demonstrate migration
  await migrateExample();

  // Use integrated system
  await useIntegratedSystem();

  // Custom validation
  await customValidationExample();

  // Generate report
  await generateValidationReport();

  console.log('\n✅ All examples completed successfully!');
}

// Execute if run directly
if (require.main === module) {
  runExamples().catch(console.error);
}

export {
  createClaudeMdV2Example,
  migrateExample,
  useIntegratedSystem,
  customValidationExample,
  generateValidationReport
};