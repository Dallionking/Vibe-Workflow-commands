/**
 * Validation Reporter
 * Provides user-friendly reporting for validation results
 */

import { HookResult } from './command-validation-hooks';
import { TransitionResult } from './phase-transition-validator';
import * as chalk from 'chalk';

export type ReportFormat = 'terminal' | 'markdown' | 'json' | 'html';

export interface ReportOptions {
  format: ReportFormat;
  verbosity: 'minimal' | 'normal' | 'detailed';
  includeTimestamp?: boolean;
  includeMetadata?: boolean;
  colorize?: boolean;
}

export class ValidationReporter {
  private defaultOptions: ReportOptions = {
    format: 'terminal',
    verbosity: 'normal',
    includeTimestamp: true,
    includeMetadata: false,
    colorize: true
  };

  generateHookReport(result: HookResult, options?: Partial<ReportOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    
    switch (opts.format) {
      case 'terminal':
        return this.generateTerminalHookReport(result, opts);
      case 'markdown':
        return this.generateMarkdownHookReport(result, opts);
      case 'json':
        return JSON.stringify(result, null, 2);
      case 'html':
        return this.generateHtmlHookReport(result, opts);
      default:
        return this.generateTerminalHookReport(result, opts);
    }
  }

  private generateTerminalHookReport(result: HookResult, opts: ReportOptions): string {
    const lines: string[] = [];
    const c = opts.colorize && chalk.supportsColor ? chalk : {
      green: (s: string) => s,
      red: (s: string) => s,
      yellow: (s: string) => s,
      blue: (s: string) => s,
      gray: (s: string) => s,
      bold: (s: string) => s
    };

    // Header
    if (result.valid) {
      lines.push(c.green('✅ Validation Passed'));
    } else {
      lines.push(c.red('❌ Validation Failed'));
    }

    if (opts.includeTimestamp) {
      lines.push(c.gray(`   ${new Date().toLocaleString()}`));
    }

    lines.push('');

    // Errors
    if (result.errors.length > 0) {
      lines.push(c.red(c.bold('Errors:')));
      result.errors.forEach(error => {
        lines.push(c.red(`  • ${error}`));
      });
      lines.push('');
    }

    // Warnings
    if (result.warnings.length > 0 && opts.verbosity !== 'minimal') {
      lines.push(c.yellow(c.bold('Warnings:')));
      result.warnings.forEach(warning => {
        lines.push(c.yellow(`  ⚠ ${warning}`));
      });
      lines.push('');
    }

    // Suggestions
    if (result.suggestions.length > 0 && opts.verbosity !== 'minimal') {
      lines.push(c.blue(c.bold('Suggestions:')));
      result.suggestions.forEach(suggestion => {
        lines.push(c.blue(`  💡 ${suggestion}`));
      });
      lines.push('');
    }

    // Auto-fix available
    if (result.fixable && !result.valid) {
      lines.push(c.green('🔧 Auto-fix available'));
      lines.push('');
    }

    // Metadata
    if (opts.includeMetadata && result.metadata && opts.verbosity === 'detailed') {
      lines.push(c.gray(c.bold('Metadata:')));
      Object.entries(result.metadata).forEach(([key, value]) => {
        lines.push(c.gray(`  ${key}: ${JSON.stringify(value)}`));
      });
    }

    return lines.join('\n');
  }

  private generateMarkdownHookReport(result: HookResult, opts: ReportOptions): string {
    const lines: string[] = [];

    // Header
    lines.push(`# Validation Report`);
    lines.push('');
    lines.push(`**Status:** ${result.valid ? '✅ Passed' : '❌ Failed'}`);
    
    if (opts.includeTimestamp) {
      lines.push(`**Timestamp:** ${new Date().toISOString()}`);
    }
    
    lines.push('');

    // Errors
    if (result.errors.length > 0) {
      lines.push('## Errors');
      result.errors.forEach(error => {
        lines.push(`- ${error}`);
      });
      lines.push('');
    }

    // Warnings
    if (result.warnings.length > 0 && opts.verbosity !== 'minimal') {
      lines.push('## Warnings');
      result.warnings.forEach(warning => {
        lines.push(`- ⚠️ ${warning}`);
      });
      lines.push('');
    }

    // Suggestions
    if (result.suggestions.length > 0 && opts.verbosity !== 'minimal') {
      lines.push('## Suggestions');
      result.suggestions.forEach(suggestion => {
        lines.push(`- 💡 ${suggestion}`);
      });
      lines.push('');
    }

    // Auto-fix
    if (result.fixable && !result.valid) {
      lines.push('## Auto-fix');
      lines.push('An automatic fix is available for this issue.');
      lines.push('');
    }

    // Metadata
    if (opts.includeMetadata && result.metadata && opts.verbosity === 'detailed') {
      lines.push('## Metadata');
      lines.push('```json');
      lines.push(JSON.stringify(result.metadata, null, 2));
      lines.push('```');
    }

    return lines.join('\n');
  }

  private generateHtmlHookReport(result: HookResult, opts: ReportOptions): string {
    const statusClass = result.valid ? 'success' : 'error';
    const statusText = result.valid ? '✅ Validation Passed' : '❌ Validation Failed';

    let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Validation Report</title>
  <style>
    body { font-family: -apple-system, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    .status { padding: 10px; border-radius: 5px; margin-bottom: 20px; }
    .status.success { background: #d4edda; color: #155724; }
    .status.error { background: #f8d7da; color: #721c24; }
    .section { margin-bottom: 20px; }
    .section h2 { color: #333; font-size: 18px; margin-bottom: 10px; }
    .error { color: #dc3545; }
    .warning { color: #ffc107; }
    .suggestion { color: #17a2b8; }
    .metadata { background: #f8f9fa; padding: 10px; border-radius: 5px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Validation Report</h1>
  <div class="status ${statusClass}">${statusText}</div>
`;

    if (opts.includeTimestamp) {
      html += `<p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>`;
    }

    // Errors
    if (result.errors.length > 0) {
      html += `
  <div class="section">
    <h2>Errors</h2>
    <ul>
${result.errors.map(e => `      <li class="error">${this.escapeHtml(e)}</li>`).join('\n')}
    </ul>
  </div>`;
    }

    // Warnings
    if (result.warnings.length > 0 && opts.verbosity !== 'minimal') {
      html += `
  <div class="section">
    <h2>Warnings</h2>
    <ul>
${result.warnings.map(w => `      <li class="warning">⚠️ ${this.escapeHtml(w)}</li>`).join('\n')}
    </ul>
  </div>`;
    }

    // Suggestions
    if (result.suggestions.length > 0 && opts.verbosity !== 'minimal') {
      html += `
  <div class="section">
    <h2>Suggestions</h2>
    <ul>
${result.suggestions.map(s => `      <li class="suggestion">💡 ${this.escapeHtml(s)}</li>`).join('\n')}
    </ul>
  </div>`;
    }

    // Metadata
    if (opts.includeMetadata && result.metadata && opts.verbosity === 'detailed') {
      html += `
  <div class="section">
    <h2>Metadata</h2>
    <pre class="metadata">${JSON.stringify(result.metadata, null, 2)}</pre>
  </div>`;
    }

    html += `
</body>
</html>`;

    return html;
  }

  generateTransitionReport(
    result: TransitionResult, 
    options?: Partial<ReportOptions>
  ): string {
    const opts = { ...this.defaultOptions, ...options };
    
    switch (opts.format) {
      case 'terminal':
        return this.generateTerminalTransitionReport(result, opts);
      case 'markdown':
        return this.generateMarkdownTransitionReport(result, opts);
      case 'json':
        return JSON.stringify(result, null, 2);
      default:
        return this.generateTerminalTransitionReport(result, opts);
    }
  }

  private generateTerminalTransitionReport(
    result: TransitionResult, 
    opts: ReportOptions
  ): string {
    const lines: string[] = [];
    const c = opts.colorize && chalk.supportsColor ? chalk : {
      green: (s: string) => s,
      red: (s: string) => s,
      yellow: (s: string) => s,
      blue: (s: string) => s,
      gray: (s: string) => s,
      bold: (s: string) => s,
      cyan: (s: string) => s
    };

    // Header
    lines.push(c.cyan(c.bold('🔄 Phase Transition Validation')));
    lines.push(c.gray(`   ${result.fromPhase} → ${result.toPhase}`));
    lines.push('');

    // Status
    if (result.allowed) {
      lines.push(c.green('✅ Transition Allowed'));
    } else {
      lines.push(c.red('❌ Transition Blocked'));
    }
    lines.push('');

    // Failed gates
    if (result.failedGates.length > 0) {
      lines.push(c.red(c.bold('Failed Gates:')));
      result.failedGates.forEach(gate => {
        lines.push(c.red(`  • ${gate}`));
      });
      lines.push('');
    }

    // Missing outputs
    if (result.missingOutputs.length > 0) {
      lines.push(c.red(c.bold('Missing Outputs:')));
      result.missingOutputs.forEach(output => {
        lines.push(c.red(`  • ${output}`));
      });
      lines.push('');
    }

    // Warnings
    if (result.warnings.length > 0 && opts.verbosity !== 'minimal') {
      lines.push(c.yellow(c.bold('Warnings:')));
      result.warnings.forEach(warning => {
        lines.push(c.yellow(`  ⚠ ${warning}`));
      });
      lines.push('');
    }

    // Suggestions
    if (result.suggestions.length > 0) {
      lines.push(c.blue(c.bold('Next Steps:')));
      result.suggestions.forEach(suggestion => {
        lines.push(c.blue(`  → ${suggestion}`));
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  private generateMarkdownTransitionReport(
    result: TransitionResult, 
    opts: ReportOptions
  ): string {
    const lines: string[] = [];

    lines.push(`# Phase Transition Report`);
    lines.push('');
    lines.push(`**Transition:** ${result.fromPhase} → ${result.toPhase}`);
    lines.push(`**Status:** ${result.allowed ? '✅ Allowed' : '❌ Blocked'}`);
    lines.push('');

    if (result.failedGates.length > 0) {
      lines.push('## Failed Gates');
      result.failedGates.forEach(gate => {
        lines.push(`- ${gate}`);
      });
      lines.push('');
    }

    if (result.missingOutputs.length > 0) {
      lines.push('## Missing Outputs');
      result.missingOutputs.forEach(output => {
        lines.push(`- ${output}`);
      });
      lines.push('');
    }

    if (result.warnings.length > 0 && opts.verbosity !== 'minimal') {
      lines.push('## Warnings');
      result.warnings.forEach(warning => {
        lines.push(`- ⚠️ ${warning}`);
      });
      lines.push('');
    }

    if (result.suggestions.length > 0) {
      lines.push('## Next Steps');
      result.suggestions.forEach(suggestion => {
        lines.push(`1. ${suggestion}`);
      });
    }

    return lines.join('\n');
  }

  generateProgressBar(current: number, total: number, width: number = 40): string {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    
    return `[${bar}] ${percentage}%`;
  }

  generateSummaryStats(stats: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  }, options?: Partial<ReportOptions>): string {
    const opts = { ...this.defaultOptions, ...options };
    const c = opts.colorize && chalk.supportsColor ? chalk : {
      green: (s: string) => s,
      red: (s: string) => s,
      yellow: (s: string) => s,
      bold: (s: string) => s
    };

    const lines: string[] = [];
    
    lines.push(c.bold('📊 Validation Summary'));
    lines.push(`   Total: ${stats.total}`);
    lines.push(c.green(`   Passed: ${stats.passed}`));
    lines.push(c.red(`   Failed: ${stats.failed}`));
    if (stats.warnings > 0) {
      lines.push(c.yellow(`   Warnings: ${stats.warnings}`));
    }
    
    const successRate = stats.total > 0 ? 
      Math.round((stats.passed / stats.total) * 100) : 0;
    
    lines.push('');
    lines.push(`   Success Rate: ${successRate}%`);
    lines.push(`   ${this.generateProgressBar(stats.passed, stats.total)}`);
    
    return lines.join('\n');
  }

  private escapeHtml(text: string): string {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    return text.replace(/[&<>"']/g, char => escapeMap[char]);
  }
}