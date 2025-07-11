/**
 * CLAUDE.md Migration Utility
 * Migrates v1.0 CLAUDE.md files to v2.0 format
 */

import * as fs from 'fs';
import * as path from 'path';
import { ClaudeMdParser, ClaudeMdV2, ClaudeMdSection } from '../parsers/claude-md-parser';

export interface MigrationOptions {
  backup?: boolean;
  interactive?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
}

export interface MigrationResult {
  success: boolean;
  fromVersion: string;
  toVersion: string;
  backupPath?: string;
  changes: string[];
  warnings: string[];
  errors: string[];
}

export class ClaudeMdMigrator {
  private options: MigrationOptions;

  constructor(options: MigrationOptions = {}) {
    this.options = {
      backup: true,
      interactive: false,
      dryRun: false,
      verbose: false,
      ...options
    };
  }

  async migrate(filePath: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      fromVersion: '1.0',
      toVersion: '2.0',
      changes: [],
      warnings: [],
      errors: []
    };

    try {
      // Read file
      if (!fs.existsSync(filePath)) {
        result.errors.push(`File not found: ${filePath}`);
        return result;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const parser = new ClaudeMdParser(content);
      const version = parser.getVersion();
      result.fromVersion = version;

      // Check if already v2
      if (version === '2.0') {
        result.warnings.push('File is already v2.0 format');
        result.success = true;
        return result;
      }

      // Create backup
      if (this.options.backup && !this.options.dryRun) {
        const backupPath = filePath.replace('.md', '.v1.backup.md');
        fs.copyFileSync(filePath, backupPath);
        result.backupPath = backupPath;
        result.changes.push(`Created backup at ${backupPath}`);
      }

      // Parse and convert
      const claudeMd = parser.parse();
      
      // Enhance migration with intelligent categorization
      const enhanced = await this.enhanceMigration(claudeMd, content);
      result.changes.push(...enhanced.changes);

      // Interactive mode
      if (this.options.interactive) {
        const confirmed = await this.interactiveReview(enhanced.claudeMd);
        if (!confirmed) {
          result.warnings.push('Migration cancelled by user');
          return result;
        }
      }

      // Export to v2 format
      const v2Content = ClaudeMdParser.export(enhanced.claudeMd);

      // Write file
      if (!this.options.dryRun) {
        fs.writeFileSync(filePath, v2Content, 'utf-8');
        result.changes.push(`Updated ${filePath} to v2.0 format`);
      } else {
        result.changes.push('[DRY RUN] Would update file to v2.0 format');
        if (this.options.verbose) {
          console.log('--- Generated v2.0 content ---');
          console.log(v2Content);
          console.log('--- End of content ---');
        }
      }

      result.success = true;

    } catch (error) {
      result.errors.push(`Migration failed: ${error}`);
    }

    return result;
  }

  private async enhanceMigration(
    claudeMd: ClaudeMdV2, 
    originalContent: string
  ): Promise<{ claudeMd: ClaudeMdV2; changes: string[] }> {
    const changes: string[] = [];

    // Enhance section categorization
    claudeMd.sections = claudeMd.sections.map(section => {
      const enhanced = this.enhanceSection(section, originalContent);
      if (enhanced.type !== section.type) {
        changes.push(`Re-categorized "${section.name}" from ${section.type} to ${enhanced.type}`);
      }
      return enhanced;
    });

    // Add default patterns if none exist
    if (!claudeMd.patternLibrary || Object.keys(claudeMd.patternLibrary).length === 0) {
      claudeMd.patternLibrary = this.generateDefaultPatterns();
      changes.push('Added default pattern library');
    }

    // Add validation gates if none exist
    if (!claudeMd.validationGates) {
      claudeMd.validationGates = this.generateDefaultValidationGates();
      changes.push('Added default validation gates');
    }

    // Ensure all layer sections exist
    const hasGlobal = claudeMd.sections.some(s => s.type === 'global');
    const hasPhase = claudeMd.sections.some(s => s.type === 'phase');
    const hasTask = claudeMd.sections.some(s => s.type === 'task');

    if (!hasGlobal) {
      claudeMd.sections.unshift({
        type: 'global',
        name: 'Global Rules',
        content: this.generateDefaultGlobalContent()
      });
      changes.push('Added default global rules section');
    }

    if (!hasPhase) {
      claudeMd.sections.push({
        type: 'phase',
        name: 'Phase Context',
        content: this.generateDefaultPhaseContent()
      });
      changes.push('Added default phase context section');
    }

    if (!hasTask) {
      claudeMd.sections.push({
        type: 'task',
        name: 'Task Context',
        content: this.generateDefaultTaskContent()
      });
      changes.push('Added default task context section');
    }

    return { claudeMd, changes };
  }

  private enhanceSection(section: ClaudeMdSection, originalContent: string): ClaudeMdSection {
    // Use more sophisticated pattern matching
    const patterns = {
      global: [
        /convention|standard|policy|security|quality|rule|guideline/i,
        /always|must|never|require/i,
        /project[- ]wide|global|entire|all/i
      ],
      phase: [
        /phase|feature|milestone|sprint|iteration/i,
        /requirement|specification|design|architecture/i,
        /current|active|ongoing/i
      ],
      task: [
        /task|command|step|action|operation/i,
        /instruction|guide|how[- ]to/i,
        /specific|particular|individual/i
      ]
    };

    // Score each category
    const scores = {
      global: 0,
      phase: 0,
      task: 0,
      general: 0
    };

    const contentToCheck = section.name + ' ' + section.content;

    // Check patterns
    Object.entries(patterns).forEach(([type, patternList]) => {
      patternList.forEach(pattern => {
        if (pattern.test(contentToCheck)) {
          scores[type as keyof typeof scores] += 1;
        }
      });
    });

    // Determine best category
    const bestCategory = Object.entries(scores)
      .filter(([type]) => type !== 'general')
      .sort(([, a], [, b]) => b - a)[0];

    if (bestCategory && bestCategory[1] > 0) {
      return { ...section, type: bestCategory[0] as any };
    }

    return section;
  }

  private generateDefaultPatterns(): Record<string, string> {
    return {
      'Component Pattern': `export const Component: FC<Props> = ({ prop1, prop2 }) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};`,
      'API Pattern': `export const handler = async (req: Request, res: Response) => {
  try {
    const result = await service.method(req.params);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};`,
      'Test Pattern': `describe('Feature', () => {
  it('should work correctly', () => {
    const result = functionUnderTest(input);
    expect(result).toBe(expected);
  });
});`
    };
  }

  private generateDefaultValidationGates(): Record<string, any> {
    return {
      phase_completion: {
        conditions: {
          tests_passing: true,
          documentation_complete: true,
          code_review_approved: true
        }
      }
    };
  }

  private generateDefaultGlobalContent(): string {
    return `Project Conventions:
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Write self-documenting code

Quality Standards:
- Maintain 95%+ test coverage
- Ensure all public APIs are documented
- Follow security best practices

Security Policies:
- Never commit sensitive data
- Validate all user inputs
- Use environment variables for configuration`;
  }

  private generateDefaultPhaseContent(): string {
    return `Phase Dependencies:
- Previous phase outputs are automatically loaded
- Pattern library from completed features
- Design system components

Active Patterns:
- Component patterns relevant to current phase
- API patterns from previous implementations
- Testing patterns that have proven successful`;
  }

  private generateDefaultTaskContent(): string {
    return `Task Instructions:
- Specific instructions loaded based on current command
- Recent git changes and status
- Error context from previous attempts

Recent Context:
- Currently modified files
- Recent commits
- Active branch information`;
  }

  private async interactiveReview(claudeMd: ClaudeMdV2): Promise<boolean> {
    console.log('\n=== Migration Review ===');
    console.log(`Version: ${claudeMd.version}`);
    console.log(`Sections: ${claudeMd.sections.length}`);
    
    claudeMd.sections.forEach((section, index) => {
      console.log(`\n[${index + 1}] ${section.name} (${section.type})`);
      console.log(`    Preview: ${section.content.substring(0, 100)}...`);
    });

    // In a real implementation, this would prompt for user input
    // For now, we'll auto-approve
    console.log('\n[Auto-approved in non-interactive mode]');
    return true;
  }

  async migrateDirectory(directory: string): Promise<Map<string, MigrationResult>> {
    const results = new Map<string, MigrationResult>();
    
    // Find all CLAUDE.md files
    const files = this.findClaudeMdFiles(directory);
    
    if (files.length === 0) {
      console.log('No CLAUDE.md files found');
      return results;
    }

    console.log(`Found ${files.length} CLAUDE.md file(s)`);

    for (const file of files) {
      console.log(`\nMigrating: ${file}`);
      const result = await this.migrate(file);
      results.set(file, result);
      
      if (result.success) {
        console.log(`✓ Success: ${file}`);
      } else {
        console.log(`✗ Failed: ${file}`);
        result.errors.forEach(err => console.error(`  - ${err}`));
      }
    }

    return results;
  }

  private findClaudeMdFiles(directory: string): string[] {
    const files: string[] = [];
    
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && 
            entry.name !== 'node_modules') {
          walk(fullPath);
        } else if (entry.isFile() && entry.name === 'CLAUDE.md') {
          files.push(fullPath);
        }
      }
    };

    walk(directory);
    return files;
  }

  generateReport(results: Map<string, MigrationResult>): string {
    const report: string[] = ['# CLAUDE.md Migration Report'];
    report.push(`Generated: ${new Date().toISOString()}`);
    report.push('');
    
    const successful = Array.from(results.values()).filter(r => r.success).length;
    const failed = results.size - successful;
    
    report.push('## Summary');
    report.push(`- Total files: ${results.size}`);
    report.push(`- Successful: ${successful}`);
    report.push(`- Failed: ${failed}`);
    report.push('');
    
    report.push('## Details');
    
    results.forEach((result, file) => {
      report.push(`\n### ${file}`);
      report.push(`- Status: ${result.success ? '✓ Success' : '✗ Failed'}`);
      report.push(`- Version: ${result.fromVersion} → ${result.toVersion}`);
      
      if (result.backupPath) {
        report.push(`- Backup: ${result.backupPath}`);
      }
      
      if (result.changes.length > 0) {
        report.push('- Changes:');
        result.changes.forEach(change => report.push(`  - ${change}`));
      }
      
      if (result.warnings.length > 0) {
        report.push('- Warnings:');
        result.warnings.forEach(warning => report.push(`  - ⚠️ ${warning}`));
      }
      
      if (result.errors.length > 0) {
        report.push('- Errors:');
        result.errors.forEach(error => report.push(`  - ❌ ${error}`));
      }
    });
    
    return report.join('\n');
  }
}