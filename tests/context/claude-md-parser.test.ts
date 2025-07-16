/**
 * Tests for CLAUDE.md Parser
 */

import { ClaudeMdParser } from '../../context/parsers/claude-md-parser';
import * as fs from 'fs';
import * as path from 'path';

describe('ClaudeMdParser', () => {
  describe('Version Detection', () => {
    it('should detect v2.0 format with YAML frontmatter', () => {
      const content = `---
version: 2.0
project_type: full-stack
---

## Content`;

      const parser = new ClaudeMdParser(content);
      expect(parser.getVersion()).toBe('2.0');
    });

    it('should detect v2.0 format with layer markers', () => {
      const content = `# CLAUDE.md

### L1: Global Rules
Content here`;

      const parser = new ClaudeMdParser(content);
      expect(parser.getVersion()).toBe('2.0');
    });

    it('should detect v1.0 format without v2 markers', () => {
      const content = `# CLAUDE.md

## Project Conventions
Some conventions`;

      const parser = new ClaudeMdParser(content);
      expect(parser.getVersion()).toBe('1.0');
    });
  });

  describe('V2 Parsing', () => {
    const v2Content = `---
version: 2.0
project_type: full-stack
context_layers:
  global:
    enabled: true
    budget: 2000
---

## Context Layers

### L1: Global Rules (Always Active)

#### Project Conventions
- Use TypeScript
- Follow ESLint rules

#### Quality Standards
- 95%+ test coverage
- Performance first

### L2: Phase Context (Current Phase)

#### Phase Dependencies
- Previous outputs loaded

### L3: Task Context (Current Task)

#### Task Instructions
- Specific to current task

## Validation Gates
\`\`\`yaml
phase_1_to_2:
  conditions:
    - tests_passing: true
\`\`\`

## Pattern Library

### Component Pattern
\`\`\`typescript
export const Component = () => {};
\`\`\`

## Dynamic Sections

### @dynamic(tool:typescript)
TypeScript specific rules

## Command Customizations
Custom command configs`;

    it('should parse v2.0 frontmatter correctly', () => {
      const parser = new ClaudeMdParser(v2Content);
      const result = parser.parse();

      expect(result.version).toBe('2.0');
      expect(result.metadata.project_type).toBe('full-stack');
      expect(result.contextLayers.global.budget).toBe(2000);
    });

    it('should parse context layer sections', () => {
      const parser = new ClaudeMdParser(v2Content);
      const result = parser.parse();

      const globalSection = result.sections.find(s => s.type === 'global');
      expect(globalSection).toBeDefined();
      expect(globalSection?.name).toBe('Global Rules');
      expect(globalSection?.content).toContain('Project Conventions');
      expect(globalSection?.content).toContain('Quality Standards');
    });

    it('should parse validation gates', () => {
      const parser = new ClaudeMdParser(v2Content);
      const result = parser.parse();

      expect(result.validationGates).toBeDefined();
      expect(result.validationGates?.phase_1_to_2).toBeDefined();
      expect(result.validationGates?.phase_1_to_2.conditions[0].tests_passing).toBe(true);
    });

    it('should parse pattern library', () => {
      const parser = new ClaudeMdParser(v2Content);
      const result = parser.parse();

      expect(result.patternLibrary).toBeDefined();
      expect(result.patternLibrary?.['Component Pattern']).toContain('export const Component');
    });

    it('should parse dynamic sections', () => {
      const parser = new ClaudeMdParser(v2Content);
      const result = parser.parse();

      const dynamicSection = result.sections.find(s => s.type === 'dynamic');
      expect(dynamicSection).toBeDefined();
      expect(dynamicSection?.conditions).toEqual({ tool: 'typescript' });
    });
  });

  describe('V1 to V2 Conversion', () => {
    const v1Content = `# CLAUDE.md

## Project Conventions
- Use TypeScript
- Follow standards

## Security Policies  
- Never commit secrets
- Validate inputs

## Feature Requirements
- User authentication
- Data validation

## Task Instructions
- How to run tests
- Deployment steps`;

    it('should convert v1 sections to appropriate v2 layers', () => {
      const parser = new ClaudeMdParser(v1Content);
      const result = parser.parse();

      expect(result.version).toBe('2.0');
      expect(result.metadata.migrated_from).toBe('1.0');

      // Check categorization
      const conventions = result.sections.find(s => s.name === 'Project Conventions');
      expect(conventions?.type).toBe('global');

      const security = result.sections.find(s => s.name === 'Security Policies');
      expect(security?.type).toBe('global');

      const features = result.sections.find(s => s.name === 'Feature Requirements');
      expect(features?.type).toBe('phase');

      const tasks = result.sections.find(s => s.name === 'Task Instructions');
      expect(tasks?.type).toBe('task');
    });
  });

  describe('Export Functionality', () => {
    it('should export v2 format correctly', () => {
      const claudeMd = {
        version: '2.0',
        metadata: { project_type: 'api' },
        sections: [
          {
            type: 'global' as const,
            name: 'Global Rules',
            content: 'Test content'
          }
        ],
        contextLayers: {
          global: { enabled: true, budget: 1000 },
          phase: { enabled: true, budget: 2000 },
          task: { enabled: true, budget: 1000 }
        }
      };

      const exported = ClaudeMdParser.export(claudeMd);

      expect(exported).toContain('---');
      expect(exported).toContain('version: 2.0');
      expect(exported).toContain('### L1: Global Rules');
      expect(exported).toContain('Test content');
    });
  });

  describe('Context Config Conversion', () => {
    it('should convert to context config format', () => {
      const claudeMd = {
        version: '2.0',
        metadata: {},
        sections: [],
        contextLayers: {
          global: { enabled: true, budget: 1500 },
          phase: { enabled: false, budget: 2500 },
          task: { enabled: true, budget: 1500 }
        }
      };

      const config = ClaudeMdParser.toContextConfig(claudeMd);

      expect(config.version).toBe('2.0');
      expect(config.layers).toHaveLength(3);

      const globalLayer = config.layers?.find(l => l.type === 'global');
      expect(globalLayer?.budget).toBe(1500);
      expect(globalLayer?.enabled).toBe(true);
    });
  });
});
