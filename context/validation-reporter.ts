/**
 * User-Friendly Validation Reporting System
 * Provides clear, actionable feedback on validation results
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { 
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationGate
} from './types/context.types';
import { 
  ValidationExecutionResult,
  GateExecutionResult,
  ImprovementSuggestion
} from './validation-engine';
import { PhaseState } from './phase-transition-validator';

export interface ReportOptions {
  format: 'terminal' | 'markdown' | 'html' | 'json';
  verbosity: 'minimal' | 'normal' | 'detailed' | 'debug';
  includeSuccesses: boolean;
  includeSuggestions: boolean;
  includeTimings: boolean;
  colorize: boolean;
  outputFile?: string;
}

export interface ReportSection {
  title: string;
  content: string;
  severity: 'success' | 'warning' | 'error' | 'info';
  collapsible?: boolean;
}

export class ValidationReporter {
  private defaultOptions: ReportOptions = {
    format: 'terminal',
    verbosity: 'normal',
    includeSuccesses: true,
    includeSuggestions: true,
    includeTimings: true,
    colorize: true
  };

  /**
   * Generate validation report
   */
  generateReport(
    result: ValidationExecutionResult,
    options: Partial<ReportOptions> = {}
  ): string {
    const opts = { ...this.defaultOptions, ...options };
    
    switch (opts.format) {
      case 'terminal':
        return this.generateTerminalReport(result, opts);
      case 'markdown':
        return this.generateMarkdownReport(result, opts);
      case 'html':
        return this.generateHtmlReport(result, opts);
      case 'json':
        return this.generateJsonReport(result, opts);
      default:
        return this.generateTerminalReport(result, opts);
    }
  }

  /**
   * Generate terminal-friendly report
   */
  private generateTerminalReport(
    result: ValidationExecutionResult,
    options: ReportOptions
  ): string {
    const sections: string[] = [];
    const c = options.colorize ? chalk : this.noColor();

    // Header
    sections.push(this.generateTerminalHeader(result, c));

    // Summary
    sections.push(this.generateTerminalSummary(result, c));

    // Gate results
    if (options.verbosity !== 'minimal') {
      sections.push(this.generateTerminalGateResults(result, options, c));
    }

    // Improvements
    if (options.includeSuggestions && result.improvements.length > 0) {
      sections.push(this.generateTerminalImprovements(result.improvements, c));
    }

    // Footer
    if (options.includeTimings) {
      sections.push(this.generateTerminalFooter(result, c));
    }

    const report = sections.join('\n\n');

    // Save to file if requested
    if (options.outputFile) {
      this.saveReport(report, options.outputFile, 'txt');
    }

    return report;
  }

  /**
   * Generate markdown report
   */
  private generateMarkdownReport(
    result: ValidationExecutionResult,
    options: ReportOptions
  ): string {
    const sections: string[] = [];

    // Header
    sections.push(`# Validation Report - ${result.phase}`);
    sections.push(`> Generated: ${result.timestamp.toISOString()}`);

    // Summary
    sections.push(this.generateMarkdownSummary(result));

    // Gate results
    if (options.verbosity !== 'minimal') {
      sections.push(this.generateMarkdownGateResults(result, options));
    }

    // Improvements
    if (options.includeSuggestions && result.improvements.length > 0) {
      sections.push(this.generateMarkdownImprovements(result.improvements));
    }

    // Metrics
    if (options.includeTimings) {
      sections.push(this.generateMarkdownMetrics(result));
    }

    const report = sections.join('\n\n');

    // Save to file if requested
    if (options.outputFile) {
      this.saveReport(report, options.outputFile, 'md');
    }

    return report;
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(
    result: ValidationExecutionResult,
    options: ReportOptions
  ): string {
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Validation Report - ${result.phase}</title>
    <style>
        ${this.getHtmlStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Validation Report</h1>
            <div class="phase-badge">${result.phase}</div>
            <time>${result.timestamp.toLocaleString()}</time>
        </header>

        ${this.generateHtmlSummary(result)}
        
        ${options.verbosity !== 'minimal' ? this.generateHtmlGateResults(result, options) : ''}
        
        ${options.includeSuggestions && result.improvements.length > 0 
          ? this.generateHtmlImprovements(result.improvements) 
          : ''}
        
        ${options.includeTimings ? this.generateHtmlMetrics(result) : ''}
    </div>
    <script>
        ${this.getHtmlScript()}
    </script>
</body>
</html>`;

    // Save to file if requested
    if (options.outputFile) {
      this.saveReport(html, options.outputFile, 'html');
    }

    return html;
  }

  /**
   * Generate JSON report
   */
  private generateJsonReport(
    result: ValidationExecutionResult,
    options: ReportOptions
  ): string {
    const report = {
      phase: result.phase,
      timestamp: result.timestamp.toISOString(),
      duration: result.duration,
      summary: result.summary,
      gates: options.verbosity === 'minimal' 
        ? result.gates.map(g => ({
            id: g.gateId,
            status: g.status,
            attempts: g.attempts
          }))
        : result.gates,
      improvements: options.includeSuggestions ? result.improvements : [],
      metrics: options.includeTimings ? {
        totalDuration: result.duration,
        averageGateDuration: result.gates.length > 0
          ? Math.round(result.gates.reduce((sum, g) => sum + g.duration, 0) / result.gates.length)
          : 0
      } : undefined
    };

    const json = JSON.stringify(report, null, 2);

    // Save to file if requested
    if (options.outputFile) {
      this.saveReport(json, options.outputFile, 'json');
    }

    return json;
  }

  /**
   * Generate phase progress report
   */
  generatePhaseProgressReport(
    phaseState: PhaseState,
    currentProgress: any,
    options: Partial<ReportOptions> = {}
  ): string {
    const opts = { ...this.defaultOptions, ...options };
    
    if (opts.format === 'terminal') {
      return this.generateTerminalPhaseProgress(phaseState, currentProgress, opts);
    } else {
      return this.generateMarkdownPhaseProgress(phaseState, currentProgress);
    }
  }

  /**
   * Terminal report helpers
   */
  private generateTerminalHeader(result: ValidationExecutionResult, c: any): string {
    const status = result.summary.failed === 0 ? 'PASSED' : 'FAILED';
    const statusColor = result.summary.failed === 0 ? c.green : c.red;
    
    return `
${c.bold('╔═══════════════════════════════════════════════════════════════╗')}
${c.bold('║')} ${statusColor.bold(` VALIDATION ${status} `.padEnd(61))} ${c.bold('║')}
${c.bold('║')} Phase: ${c.cyan(result.phase.padEnd(54))} ${c.bold('║')}
${c.bold('║')} Time: ${result.timestamp.toLocaleString().padEnd(55)} ${c.bold('║')}
${c.bold('╚═══════════════════════════════════════════════════════════════╝')}`;
  }

  private generateTerminalSummary(result: ValidationExecutionResult, c: any): string {
    const { summary } = result;
    const successRate = (summary.successRate * 100).toFixed(1);
    
    return `${c.bold('Summary:')}
  ${c.green('✓')} Passed: ${c.green(summary.passed)}
  ${summary.failed > 0 ? c.red('✗') : c.gray('○')} Failed: ${summary.failed > 0 ? c.red(summary.failed) : c.gray(summary.failed)}
  ${summary.warnings > 0 ? c.yellow('⚠') : c.gray('○')} Warnings: ${summary.warnings > 0 ? c.yellow(summary.warnings) : c.gray(summary.warnings)}
  ${c.blue('↻')} Auto-fixed: ${c.blue(summary.fixedAutomatically)}
  ${c.bold('Success Rate:')} ${successRate}%`;
  }

  private generateTerminalGateResults(
    result: ValidationExecutionResult,
    options: ReportOptions,
    c: any
  ): string {
    const sections: string[] = [c.bold('Validation Gates:')];
    
    for (const gate of result.gates) {
      if (!options.includeSuccesses && gate.status === 'passed') {
        continue;
      }

      const icon = this.getStatusIcon(gate.status);
      const color = this.getStatusColor(gate.status, c);
      
      sections.push(`\n  ${color(icon)} ${c.bold(gate.gateName)}`);
      
      if (options.verbosity === 'detailed' || options.verbosity === 'debug') {
        sections.push(`     Type: ${gate.type}`);
        sections.push(`     Attempts: ${gate.attempts}`);
        
        if (gate.fixApplied) {
          sections.push(`     ${c.blue('↻ Auto-fix applied')}`);
        }
        
        if (options.includeTimings) {
          sections.push(`     Duration: ${gate.duration}ms`);
        }
      }

      if (gate.result.errors && gate.result.errors.length > 0) {
        sections.push(`     ${c.red('Errors:')}`);
        gate.result.errors.forEach(error => {
          sections.push(`       ${c.red('•')} ${error.message}`);
        });
      }

      if (gate.result.warnings && gate.result.warnings.length > 0) {
        sections.push(`     ${c.yellow('Warnings:')}`);
        gate.result.warnings.forEach(warning => {
          sections.push(`       ${c.yellow('•')} ${warning.message}`);
        });
      }
    }

    return sections.join('\n');
  }

  private generateTerminalImprovements(improvements: ImprovementSuggestion[], c: any): string {
    const sections: string[] = [c.bold('Improvement Suggestions:')];
    
    const grouped = this.groupImprovementsByPriority(improvements);
    
    if (grouped.high.length > 0) {
      sections.push(`\n  ${c.red.bold('High Priority:')}`);
      grouped.high.forEach(imp => {
        sections.push(`    ${c.red('!')} ${imp.suggestion}`);
        if (imp.estimatedImpact) {
          sections.push(`      ${c.gray(`Impact: ${imp.estimatedImpact}`)}`);
        }
      });
    }

    if (grouped.medium.length > 0) {
      sections.push(`\n  ${c.yellow.bold('Medium Priority:')}`);
      grouped.medium.forEach(imp => {
        sections.push(`    ${c.yellow('!')} ${imp.suggestion}`);
      });
    }

    if (grouped.low.length > 0) {
      sections.push(`\n  ${c.gray.bold('Low Priority:')}`);
      grouped.low.forEach(imp => {
        sections.push(`    ${c.gray('!')} ${imp.suggestion}`);
      });
    }

    return sections.join('\n');
  }

  private generateTerminalFooter(result: ValidationExecutionResult, c: any): string {
    const avgGateDuration = result.gates.length > 0
      ? Math.round(result.gates.reduce((sum, g) => sum + g.duration, 0) / result.gates.length)
      : 0;

    return `${c.gray('─'.repeat(65))}
${c.gray(`Total Duration: ${result.duration}ms | Avg Gate: ${avgGateDuration}ms`)}`;
  }

  private generateTerminalPhaseProgress(
    phaseState: PhaseState,
    progress: any,
    options: ReportOptions
  ): string {
    const c = options.colorize ? chalk : this.noColor();
    const sections: string[] = [];

    // Header
    sections.push(c.bold('\n📊 Phase Progress Report\n'));

    // Current phase
    sections.push(`${c.bold('Current Phase:')} ${c.cyan(phaseState.currentPhase)}`);
    sections.push(`Started: ${phaseState.startedAt.toLocaleString()}`);

    // Progress bar
    const progressBar = this.generateProgressBar(progress.progress, 30, c);
    sections.push(`\n${c.bold('Overall Progress:')} ${progressBar} ${progress.progress.toFixed(1)}%`);

    // Completed phases
    if (phaseState.completedPhases.length > 0) {
      sections.push(`\n${c.bold('Completed Phases:')}`);
      phaseState.completedPhases.forEach(phase => {
        const duration = this.formatDuration(phase.duration);
        sections.push(`  ${c.green('✓')} ${phase.phaseId} (${duration})`);
      });
    }

    // Remaining phases
    if (progress.remaining.length > 0) {
      sections.push(`\n${c.bold('Remaining Phases:')}`);
      progress.remaining.forEach((phase: string) => {
        sections.push(`  ${c.gray('○')} ${phase}`);
      });
    }

    // Pending transition
    if (phaseState.pendingTransition) {
      sections.push(`\n${c.yellow.bold('⚠ Pending Transition:')}`);
      sections.push(`  From: ${phaseState.pendingTransition.from}`);
      sections.push(`  To: ${phaseState.pendingTransition.to}`);
      
      if (phaseState.pendingTransition.blockers.length > 0) {
        sections.push(`  ${c.red('Blockers:')}`);
        phaseState.pendingTransition.blockers.forEach(blocker => {
          sections.push(`    ${c.red('•')} ${blocker}`);
        });
      }
    }

    return sections.join('\n');
  }

  /**
   * Markdown report helpers
   */
  private generateMarkdownSummary(result: ValidationExecutionResult): string {
    const { summary } = result;
    const status = summary.failed === 0 ? '✅ PASSED' : '❌ FAILED';
    
    return `## Summary

**Status:** ${status}

| Metric | Value |
|--------|-------|
| Total Gates | ${summary.total} |
| Passed | ${summary.passed} |
| Failed | ${summary.failed} |
| Warnings | ${summary.warnings} |
| Auto-fixed | ${summary.fixedAutomatically} |
| Success Rate | ${(summary.successRate * 100).toFixed(1)}% |`;
  }

  private generateMarkdownGateResults(
    result: ValidationExecutionResult,
    options: ReportOptions
  ): string {
    const sections: string[] = ['## Validation Gates'];
    
    for (const gate of result.gates) {
      if (!options.includeSuccesses && gate.status === 'passed') {
        continue;
      }

      const icon = this.getStatusIcon(gate.status);
      sections.push(`\n### ${icon} ${gate.gateName}`);
      
      const details: string[] = [];
      details.push(`- **Status:** ${gate.status}`);
      details.push(`- **Type:** ${gate.type}`);
      details.push(`- **Attempts:** ${gate.attempts}`);
      
      if (gate.fixApplied) {
        details.push(`- **Auto-fix:** Applied ✓`);
      }
      
      if (options.includeTimings) {
        details.push(`- **Duration:** ${gate.duration}ms`);
      }
      
      sections.push(details.join('\n'));

      if (gate.result.errors && gate.result.errors.length > 0) {
        sections.push('\n**Errors:**');
        gate.result.errors.forEach(error => {
          sections.push(`- ${error.message}`);
        });
      }

      if (gate.result.warnings && gate.result.warnings.length > 0) {
        sections.push('\n**Warnings:**');
        gate.result.warnings.forEach(warning => {
          sections.push(`- ${warning.message}`);
        });
      }
    }

    return sections.join('\n');
  }

  private generateMarkdownImprovements(improvements: ImprovementSuggestion[]): string {
    const sections: string[] = ['## Improvement Suggestions'];
    
    const grouped = this.groupImprovementsByPriority(improvements);
    
    if (grouped.high.length > 0) {
      sections.push('\n### 🔴 High Priority');
      grouped.high.forEach(imp => {
        sections.push(`\n**${imp.suggestion}**`);
        if (imp.rationale) {
          sections.push(`- Rationale: ${imp.rationale}`);
        }
        if (imp.estimatedImpact) {
          sections.push(`- Estimated Impact: ${imp.estimatedImpact}`);
        }
      });
    }

    if (grouped.medium.length > 0) {
      sections.push('\n### 🟡 Medium Priority');
      grouped.medium.forEach(imp => {
        sections.push(`- ${imp.suggestion}`);
      });
    }

    if (grouped.low.length > 0) {
      sections.push('\n### 🟢 Low Priority');
      grouped.low.forEach(imp => {
        sections.push(`- ${imp.suggestion}`);
      });
    }

    return sections.join('\n');
  }

  private generateMarkdownMetrics(result: ValidationExecutionResult): string {
    const avgGateDuration = result.gates.length > 0
      ? Math.round(result.gates.reduce((sum, g) => sum + g.duration, 0) / result.gates.length)
      : 0;

    return `## Performance Metrics

- **Total Duration:** ${result.duration}ms
- **Average Gate Duration:** ${avgGateDuration}ms
- **Gates Processed:** ${result.gates.length}`;
  }

  private generateMarkdownPhaseProgress(phaseState: PhaseState, progress: any): string {
    const sections: string[] = ['# Phase Progress Report'];
    
    sections.push(`\n## Current Status`);
    sections.push(`- **Current Phase:** ${phaseState.currentPhase}`);
    sections.push(`- **Started:** ${phaseState.startedAt.toISOString()}`);
    sections.push(`- **Progress:** ${progress.progress.toFixed(1)}%`);

    if (phaseState.completedPhases.length > 0) {
      sections.push(`\n## Completed Phases`);
      sections.push('| Phase | Completed | Duration |');
      sections.push('|-------|-----------|----------|');
      
      phaseState.completedPhases.forEach(phase => {
        const duration = this.formatDuration(phase.duration);
        sections.push(`| ${phase.phaseId} | ${phase.completedAt.toLocaleDateString()} | ${duration} |`);
      });
    }

    if (progress.remaining.length > 0) {
      sections.push(`\n## Remaining Phases`);
      progress.remaining.forEach((phase: string, index: number) => {
        sections.push(`${index + 1}. ${phase}`);
      });
    }

    return sections.join('\n');
  }

  /**
   * HTML report helpers
   */
  private generateHtmlSummary(result: ValidationExecutionResult): string {
    const { summary } = result;
    const status = summary.failed === 0 ? 'passed' : 'failed';
    
    return `
<section class="summary ${status}">
    <h2>Summary</h2>
    <div class="metrics">
        <div class="metric">
            <span class="label">Total Gates</span>
            <span class="value">${summary.total}</span>
        </div>
        <div class="metric">
            <span class="label">Passed</span>
            <span class="value success">${summary.passed}</span>
        </div>
        <div class="metric">
            <span class="label">Failed</span>
            <span class="value error">${summary.failed}</span>
        </div>
        <div class="metric">
            <span class="label">Warnings</span>
            <span class="value warning">${summary.warnings}</span>
        </div>
        <div class="metric">
            <span class="label">Success Rate</span>
            <span class="value">${(summary.successRate * 100).toFixed(1)}%</span>
        </div>
    </div>
</section>`;
  }

  private generateHtmlGateResults(
    result: ValidationExecutionResult,
    options: ReportOptions
  ): string {
    const gates = result.gates
      .filter(g => options.includeSuccesses || g.status !== 'passed')
      .map(gate => {
        const errors = gate.result.errors?.map(e => 
          `<li class="error">${this.escapeHtml(e.message)}</li>`
        ).join('') || '';
        
        const warnings = gate.result.warnings?.map(w => 
          `<li class="warning">${this.escapeHtml(w.message)}</li>`
        ).join('') || '';

        return `
<div class="gate ${gate.status}">
    <h3>${this.getStatusIcon(gate.status)} ${this.escapeHtml(gate.gateName)}</h3>
    <div class="gate-details">
        <span class="badge">${gate.type}</span>
        <span class="attempts">Attempts: ${gate.attempts}</span>
        ${gate.fixApplied ? '<span class="auto-fix">Auto-fixed</span>' : ''}
        ${options.includeTimings ? `<span class="duration">${gate.duration}ms</span>` : ''}
    </div>
    ${errors ? `<ul class="errors">${errors}</ul>` : ''}
    ${warnings ? `<ul class="warnings">${warnings}</ul>` : ''}
</div>`;
      }).join('');

    return `
<section class="gates">
    <h2>Validation Gates</h2>
    ${gates}
</section>`;
  }

  private generateHtmlImprovements(improvements: ImprovementSuggestion[]): string {
    const grouped = this.groupImprovementsByPriority(improvements);
    
    const sections: string[] = [];
    
    if (grouped.high.length > 0) {
      sections.push(`
<div class="improvements high">
    <h3>🔴 High Priority</h3>
    ${grouped.high.map(imp => `
    <div class="improvement">
        <p class="suggestion">${this.escapeHtml(imp.suggestion)}</p>
        ${imp.rationale ? `<p class="rationale">Rationale: ${this.escapeHtml(imp.rationale)}</p>` : ''}
        ${imp.estimatedImpact ? `<p class="impact">Impact: ${this.escapeHtml(imp.estimatedImpact)}</p>` : ''}
    </div>`).join('')}
</div>`);
    }

    if (grouped.medium.length > 0) {
      sections.push(`
<div class="improvements medium">
    <h3>🟡 Medium Priority</h3>
    ${grouped.medium.map(imp => `
    <div class="improvement">
        <p class="suggestion">${this.escapeHtml(imp.suggestion)}</p>
    </div>`).join('')}
</div>`);
    }

    return `
<section class="improvements">
    <h2>Improvement Suggestions</h2>
    ${sections.join('')}
</section>`;
  }

  private generateHtmlMetrics(result: ValidationExecutionResult): string {
    return `
<section class="metrics">
    <h2>Performance Metrics</h2>
    <table>
        <tr>
            <td>Total Duration</td>
            <td>${result.duration}ms</td>
        </tr>
        <tr>
            <td>Gates Processed</td>
            <td>${result.gates.length}</td>
        </tr>
    </table>
</section>`;
  }

  private getHtmlStyles(): string {
    return `
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f5f5f5;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e0e0e0;
}

h1 {
    margin: 0 0 10px;
    color: #2c3e50;
}

.phase-badge {
    display: inline-block;
    background: #3498db;
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 14px;
    margin: 10px 0;
}

.summary {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
}

.summary.passed {
    border-left: 4px solid #27ae60;
}

.summary.failed {
    border-left: 4px solid #e74c3c;
}

.metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.metric {
    text-align: center;
}

.metric .label {
    display: block;
    font-size: 14px;
    color: #7f8c8d;
    margin-bottom: 5px;
}

.metric .value {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
}

.metric .value.success { color: #27ae60; }
.metric .value.error { color: #e74c3c; }
.metric .value.warning { color: #f39c12; }

.gate {
    background: #f8f9fa;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    border-left: 4px solid #bdc3c7;
}

.gate.passed { border-left-color: #27ae60; }
.gate.failed { border-left-color: #e74c3c; }
.gate.warning { border-left-color: #f39c12; }

.gate h3 {
    margin: 0 0 10px;
    color: #2c3e50;
}

.gate-details {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    font-size: 14px;
    color: #7f8c8d;
}

.badge {
    background: #ecf0f1;
    padding: 2px 8px;
    border-radius: 4px;
}

.auto-fix {
    color: #3498db;
    font-weight: 500;
}

ul.errors, ul.warnings {
    margin: 10px 0 0;
    padding-left: 20px;
}

ul.errors li { color: #e74c3c; }
ul.warnings li { color: #f39c12; }

.improvements {
    margin-top: 30px;
}

.improvement {
    background: #f8f9fa;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
}

.improvements.high .improvement {
    border-left: 4px solid #e74c3c;
}

.improvements.medium .improvement {
    border-left: 4px solid #f39c12;
}

.suggestion {
    font-weight: 500;
    margin: 0 0 10px;
}

.rationale, .impact {
    font-size: 14px;
    color: #7f8c8d;
    margin: 5px 0;
}
`;
  }

  private getHtmlScript(): string {
    return `
// Add collapsible sections
document.querySelectorAll('.gate h3').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        const details = header.nextElementSibling;
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    });
});
`;
  }

  /**
   * Utility methods
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'warning': return '⚠️';
      case 'skipped': return '⏭️';
      default: return '❓';
    }
  }

  private getStatusColor(status: string, c: any): any {
    switch (status) {
      case 'passed': return c.green;
      case 'failed': return c.red;
      case 'warning': return c.yellow;
      case 'skipped': return c.gray;
      default: return c.white;
    }
  }

  private groupImprovementsByPriority(improvements: ImprovementSuggestion[]): {
    high: ImprovementSuggestion[];
    medium: ImprovementSuggestion[];
    low: ImprovementSuggestion[];
  } {
    return {
      high: improvements.filter(i => i.priority === 'high'),
      medium: improvements.filter(i => i.priority === 'medium'),
      low: improvements.filter(i => i.priority === 'low')
    };
  }

  private generateProgressBar(progress: number, width: number, c: any): string {
    const filled = Math.round((progress / 100) * width);
    const empty = width - filled;
    
    return c.green('█'.repeat(filled)) + c.gray('░'.repeat(empty));
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  private noColor(): any {
    // Mock chalk interface for no color
    const identity = (s: string) => s;
    return {
      bold: identity,
      green: identity,
      red: identity,
      yellow: identity,
      blue: identity,
      cyan: identity,
      gray: identity,
      white: identity
    };
  }

  private saveReport(content: string, filename: string, extension: string): void {
    try {
      const dir = path.dirname(filename);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const fullPath = filename.endsWith(`.${extension}`) 
        ? filename 
        : `${filename}.${extension}`;
      
      fs.writeFileSync(fullPath, content);
      console.log(`Report saved to: ${fullPath}`);
    } catch (error) {
      console.error(`Failed to save report: ${error}`);
    }
  }

  /**
   * Generate real-time validation status
   */
  generateRealTimeStatus(
    currentGate: string,
    progress: number,
    status: 'running' | 'passed' | 'failed'
  ): string {
    const c = chalk;
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const frame = spinner[Math.floor(Date.now() / 100) % spinner.length];
    
    const statusIcon = status === 'running' ? c.blue(frame) :
                      status === 'passed' ? c.green('✓') :
                      c.red('✗');
    
    return `${statusIcon} Validating: ${currentGate} [${this.generateProgressBar(progress, 20, c)}] ${progress}%`;
  }
}