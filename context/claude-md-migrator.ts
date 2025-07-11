/**
 * CLAUDE.md Migration Tool
 * Handles migration from v1.0 to v2.0 format with intelligent section categorization
 */

import * as fs from 'fs';
import * as path from 'path';
import { ClaudeMdParser } from './claude-md-parser';
import * as inquirer from 'inquirer';

interface MigrationOptions {
  interactive?: boolean;
  backup?: boolean;
  dryRun?: boolean;
  autoDetect?: boolean;
}

interface SectionMapping {
  original: string;
  type: string;
  qualifier?: string;
  reason: string;
}

export class ClaudeMdMigrator {
  private static readonly SECTION_PATTERNS = {
    global: [
      /overview|introduction|about/i,
      /architecture|principles|philosophy/i,
      /configuration|setup|installation/i
    ],
    phase: {
      planning: [
        /planning|requirements|analysis/i,
        /user stor|acceptance criteria/i,
        /scope|objectives/i
      ],
      design: [
        /design|architecture|system/i,
        /component|module|service/i,
        /interface|api|contract/i
      ],
      implementation: [
        /implement|coding|development/i,
        /build|compile|package/i,
        /integration|deployment/i
      ],
      testing: [
        /test|qa|quality/i,
        /validation|verification/i,
        /coverage|assertion/i
      ],
      deployment: [
        /deploy|release|publish/i,
        /production|staging|environment/i,
        /rollout|migration/i
      ]
    },
    task: {
      git: [
        /git|version|commit/i,
        /branch|merge|pull request/i,
        /repository|remote/i
      ],
      testing: [
        /unit test|integration test/i,
        /test case|test suite/i,
        /mock|stub|fixture/i
      ],
      documentation: [
        /document|readme|guide/i,
        /api doc|javadoc|jsdoc/i,
        /changelog|release notes/i
      ],
      security: [
        /security|authentication|authorization/i,
        /encryption|certificate|ssl/i,
        /vulnerability|threat|risk/i
      ]
    },
    dynamic: {
      mcp: [
        /mcp|tool|context7|perplexity/i,
        /sequential thinking|taskmaster/i
      ],
      environment: [
        /aws|azure|gcp|cloud/i,
        /docker|kubernetes|container/i,
        /ci\/cd|pipeline|automation/i
      ],
      language: [
        /typescript|javascript|python/i,
        /react|vue|angular/i,
        /node|deno|bun/i
      ]
    },
    validation: {
      commit: [
        /commit|conventional|changelog/i,
        /commit message|commit format/i
      ],
      code: [
        /lint|eslint|prettier/i,
        /code style|formatting|convention/i,
        /code review|pr review/i
      ],
      security: [
        /security check|vulnerability scan/i,
        /dependency audit|security audit/i
      ]
    }
  };

  /**
   * Migrate a CLAUDE.md file from v1.0 to v2.0
   */
  static async migrate(filePath: string, options: MigrationOptions = {}): Promise<void> {
    const {
      interactive = false,
      backup = true,
      dryRun = false,
      autoDetect = true
    } = options;

    console.log(`🔄 Migrating ${filePath} to v2.0 format...`);

    // Parse existing file
    const doc = await ClaudeMdParser.parse(filePath);
    
    if (doc.version === '2.0') {
      console.log('✅ File is already in v2.0 format');
      return;
    }

    // Create backup if requested
    if (backup && !dryRun) {
      const backupPath = `${filePath}.v1.backup`;
      await fs.promises.copyFile(filePath, backupPath);
      console.log(`📦 Backup created: ${backupPath}`);
    }

    // Analyze and map sections
    const mappings = await this.analyzeSections(doc, { interactive, autoDetect });
    
    // Generate v2.0 content
    const v2Content = this.generateV2Content(doc, mappings);

    if (dryRun) {
      console.log('\n📄 Generated v2.0 content (dry run):');
      console.log('─'.repeat(50));
      console.log(v2Content);
      console.log('─'.repeat(50));
    } else {
      // Write migrated content
      await fs.promises.writeFile(filePath, v2Content, 'utf-8');
      console.log('✅ Migration completed successfully');
    }

    // Generate migration report
    this.generateReport(mappings);
  }

  /**
   * Analyze sections and determine their types
   */
  private static async analyzeSections(
    doc: any, 
    options: { interactive: boolean; autoDetect: boolean }
  ): Promise<SectionMapping[]> {
    const mappings: SectionMapping[] = [];

    for (const section of doc.sections) {
      let mapping: SectionMapping;

      if (options.autoDetect) {
        mapping = this.autoDetectSectionType(section);
      } else {
        mapping = {
          original: section.title,
          type: 'global',
          reason: 'Default mapping'
        };
      }

      if (options.interactive) {
        mapping = await this.promptForSectionType(section, mapping);
      }

      mappings.push(mapping);
    }

    return mappings;
  }

  /**
   * Auto-detect section type based on content and title
   */
  private static autoDetectSectionType(section: any): SectionMapping {
    const title = section.title;
    const content = section.content;
    const combined = `${title} ${content}`;

    // Check global patterns
    for (const pattern of this.SECTION_PATTERNS.global) {
      if (pattern.test(combined)) {
        return {
          original: title,
          type: 'global',
          reason: `Matched global pattern: ${pattern}`
        };
      }
    }

    // Check phase patterns
    for (const [phase, patterns] of Object.entries(this.SECTION_PATTERNS.phase)) {
      for (const pattern of patterns) {
        if (pattern.test(combined)) {
          return {
            original: title,
            type: 'phase',
            qualifier: phase,
            reason: `Matched ${phase} phase pattern: ${pattern}`
          };
        }
      }
    }

    // Check task patterns
    for (const [task, patterns] of Object.entries(this.SECTION_PATTERNS.task)) {
      for (const pattern of patterns) {
        if (pattern.test(combined)) {
          return {
            original: title,
            type: 'task',
            qualifier: task,
            reason: `Matched ${task} task pattern: ${pattern}`
          };
        }
      }
    }

    // Check dynamic patterns
    for (const [dynamic, patterns] of Object.entries(this.SECTION_PATTERNS.dynamic)) {
      for (const pattern of patterns) {
        if (pattern.test(combined)) {
          return {
            original: title,
            type: 'dynamic',
            qualifier: dynamic,
            reason: `Matched ${dynamic} dynamic pattern: ${pattern}`
          };
        }
      }
    }

    // Check validation patterns
    for (const [validation, patterns] of Object.entries(this.SECTION_PATTERNS.validation)) {
      for (const pattern of patterns) {
        if (pattern.test(combined)) {
          return {
            original: title,
            type: 'validation',
            qualifier: validation,
            reason: `Matched ${validation} validation pattern: ${pattern}`
          };
        }
      }
    }

    // Default to global
    return {
      original: title,
      type: 'global',
      reason: 'No specific pattern matched'
    };
  }

  /**
   * Prompt user for section type (interactive mode)
   */
  private static async promptForSectionType(
    section: any, 
    suggested: SectionMapping
  ): Promise<SectionMapping> {
    console.log(`\n📄 Section: "${section.title}"`);
    console.log(`📊 Auto-detected: ${suggested.type}${suggested.qualifier ? `:${suggested.qualifier}` : ''}`);
    console.log(`💡 Reason: ${suggested.reason}`);

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Accept auto-detected type?',
        default: true
      }
    ]);

    if (confirm) {
      return suggested;
    }

    // Manual selection
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select section type:',
        choices: ['global', 'phase', 'task', 'dynamic', 'validation']
      }
    ]);

    let qualifier: string | undefined;

    // Get qualifier based on type
    if (type !== 'global') {
      const qualifiers = this.getQualifiersForType(type);
      const { selectedQualifier } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedQualifier',
          message: `Select ${type} qualifier:`,
          choices: [...qualifiers, 'custom']
        }
      ]);

      if (selectedQualifier === 'custom') {
        const { customQualifier } = await inquirer.prompt([
          {
            type: 'input',
            name: 'customQualifier',
            message: 'Enter custom qualifier:'
          }
        ]);
        qualifier = customQualifier;
      } else {
        qualifier = selectedQualifier;
      }
    }

    return {
      original: section.title,
      type,
      qualifier,
      reason: 'Manually selected'
    };
  }

  /**
   * Get available qualifiers for a type
   */
  private static getQualifiersForType(type: string): string[] {
    switch (type) {
      case 'phase':
        return ['planning', 'design', 'implementation', 'testing', 'deployment'];
      case 'task':
        return ['git', 'testing', 'documentation', 'security'];
      case 'dynamic':
        return ['mcp', 'environment', 'language'];
      case 'validation':
        return ['commit', 'code', 'security'];
      default:
        return [];
    }
  }

  /**
   * Generate v2.0 content with proper structure
   */
  private static generateV2Content(doc: any, mappings: SectionMapping[]): string {
    // Build metadata
    const metadata = {
      version: '2.0',
      context: {
        global: {
          priority: 1000,
          maxTokens: 2000,
          compression: true,
          cache: true
        },
        phase: {
          priority: 800,
          maxTokens: 3000,
          dependencies: ['global']
        },
        task: {
          priority: 600,
          maxTokens: 2000,
          dependencies: ['global', 'phase']
        }
      },
      validationGates: this.inferValidationGates(mappings),
      dynamicSections: this.inferDynamicSections(mappings),
      features: {
        autoCompression: true,
        contextLearning: true,
        dynamicPrioritization: true,
        validationStrictMode: false
      }
    };

    // Generate content
    let content = '---\n';
    content += require('js-yaml').dump(metadata, { lineWidth: 120 });
    content += '---\n\n';
    content += '# CLAUDE.md\n\n';

    // Add sections with proper annotations
    doc.sections.forEach((section: any, index: number) => {
      const mapping = mappings[index];
      const qualifier = mapping.qualifier ? `:${mapping.qualifier}` : '';
      
      content += `## @${mapping.type}${qualifier} ${section.title}\n`;
      content += `${section.content}\n\n`;
    });

    return content;
  }

  /**
   * Infer validation gates from sections
   */
  private static inferValidationGates(mappings: SectionMapping[]): any[] {
    const gates = [];

    // Check for planning sections
    const planningExists = mappings.some(m => 
      m.type === 'phase' && m.qualifier === 'planning'
    );

    if (planningExists) {
      gates.push({
        id: 'planning-complete',
        phase: 'planning',
        requires: {
          sections: ['project-overview', 'requirements'],
          files: ['.vibe-status.md']
        }
      });
    }

    // Check for implementation sections
    const implementationExists = mappings.some(m => 
      m.type === 'phase' && m.qualifier === 'implementation'
    );

    if (implementationExists) {
      gates.push({
        id: 'ready-to-implement',
        phase: 'implementation',
        requires: {
          sections: ['architecture', 'coding-standards'],
          previousGates: planningExists ? ['planning-complete'] : []
        }
      });
    }

    // Check for validation sections
    const validationExists = mappings.some(m => m.type === 'validation');

    if (validationExists) {
      gates.push({
        id: 'pre-commit-checks',
        phase: '*',
        requires: {
          sections: ['commit-standards'],
          conditions: ['passes-linting', 'passes-tests']
        }
      });
    }

    return gates;
  }

  /**
   * Infer dynamic sections from mappings
   */
  private static inferDynamicSections(mappings: SectionMapping[]): any[] {
    const dynamicSections = [];

    // MCP tools
    const mcpSections = mappings.filter(m => 
      m.type === 'dynamic' && m.qualifier === 'mcp'
    );

    if (mcpSections.length > 0) {
      dynamicSections.push({
        id: 'mcp-tools',
        trigger: 'tool:*',
        priority: 950,
        sections: mcpSections.map(s => s.original)
      });
    }

    // Language-specific
    const languageSections = mappings.filter(m => 
      m.type === 'dynamic' && m.qualifier === 'language'
    );

    if (languageSections.length > 0) {
      dynamicSections.push({
        id: 'language-context',
        trigger: 'file:*.{ts,js,py}',
        priority: 850,
        sections: languageSections.map(s => s.original)
      });
    }

    return dynamicSections;
  }

  /**
   * Generate migration report
   */
  private static generateReport(mappings: SectionMapping[]): void {
    console.log('\n📊 Migration Report:');
    console.log('─'.repeat(50));

    // Count by type
    const typeCounts = mappings.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📈 Section Distribution:');
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} sections`);
    });

    // Show phase distribution
    const phaseQualifiers = mappings
      .filter(m => m.type === 'phase' && m.qualifier)
      .reduce((acc, m) => {
        acc[m.qualifier!] = (acc[m.qualifier!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    if (Object.keys(phaseQualifiers).length > 0) {
      console.log('\n🔄 Phase Distribution:');
      Object.entries(phaseQualifiers).forEach(([phase, count]) => {
        console.log(`  ${phase}: ${count} sections`);
      });
    }

    console.log('\n✅ Migration Summary:');
    console.log(`  Total sections: ${mappings.length}`);
    console.log(`  Auto-detected: ${mappings.filter(m => m.reason.includes('Matched')).length}`);
    console.log(`  Manual overrides: ${mappings.filter(m => m.reason === 'Manually selected').length}`);
  }

  /**
   * Batch migrate multiple files
   */
  static async migrateBatch(
    pattern: string, 
    options: MigrationOptions = {}
  ): Promise<void> {
    const glob = require('glob');
    const files = glob.sync(pattern);

    console.log(`🔍 Found ${files.length} files to migrate`);

    for (const file of files) {
      try {
        await this.migrate(file, options);
      } catch (error) {
        console.error(`❌ Failed to migrate ${file}:`, error);
      }
    }
  }
}