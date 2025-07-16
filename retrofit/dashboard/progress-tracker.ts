/**
 * Progress Tracking Dashboard
 * Phase 2: Tier 3 - Integration and Quality Assurance
 *
 * Real-time progress tracking for incremental retrofit operations
 */

import { RetrofitProgress, Milestone, ProgressIssue, ScopeAnalysis } from '../incremental/incremental-system';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface DashboardData {
    progress: RetrofitProgress;
    analytics: ProgressAnalytics;
    visualizations: ProgressVisualization[];
    recommendations: DashboardRecommendation[];
    alerts: Alert[];
}

export interface ProgressAnalytics {
    velocity: number; // scopes per hour
    efficiency: number; // percentage of successful scopes
    qualityTrend: QualityTrend;
    riskDistribution: RiskDistribution;
    timeAnalysis: TimeAnalysis;
}

export interface QualityTrend {
    dataPoints: QualityDataPoint[];
    trend: 'improving' | 'stable' | 'declining';
    averageScore: number;
    projectedScore: number;
}

export interface QualityDataPoint {
    timestamp: Date;
    scope: string;
    score: number;
    patternsApplied: number;
    issuesResolved: number;
}

export interface RiskDistribution {
    low: number;
    medium: number;
    high: number;
    critical: number;
}

export interface TimeAnalysis {
    averageTimePerScope: number;
    fastestScope: ScopeTime;
    slowestScope: ScopeTime;
    timeVariance: number;
}

export interface ScopeTime {
    scope: string;
    duration: number;
    factors: string[];
}

export interface ProgressVisualization {
    type: 'bar' | 'line' | 'pie' | 'gauge';
    title: string;
    data: VisualizationData;
    config: VisualizationConfig;
}

export interface VisualizationData {
    labels: string[];
    datasets: Dataset[];
}

export interface Dataset {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
}

export interface VisualizationConfig {
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins?: any;
    scales?: any;
}

export interface DashboardRecommendation {
    type: 'performance' | 'quality' | 'risk' | 'process';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    action: string;
    impact: string;
    effort: number;
}

export interface Alert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    scope?: string;
    actionRequired: boolean;
    actions?: AlertAction[];
}

export interface AlertAction {
    label: string;
    action: string;
    destructive: boolean;
}

export class ProgressTracker {
  private progressHistory: RetrofitProgress[] = [];
  private scopeAnalyses: Map<string, ScopeAnalysis> = new Map();
  private milestoneHistory: Milestone[] = [];
  private dashboardData: DashboardData;

  constructor() {
    this.dashboardData = {
      progress: this.createInitialProgress(),
      analytics: this.createInitialAnalytics(),
      visualizations: [],
      recommendations: [],
      alerts: []
    };
  }

  /**
     * Update progress tracking with new data
     */
  async updateProgress(progress: RetrofitProgress): Promise<void> {
    this.progressHistory.push({ ...progress });
    this.dashboardData.progress = progress;

    // Update analytics
    this.dashboardData.analytics = await this.calculateAnalytics();

    // Update visualizations
    this.dashboardData.visualizations = await this.generateVisualizations();

    // Update recommendations
    this.dashboardData.recommendations = await this.generateRecommendations();

    // Check for alerts
    const newAlerts = await this.checkForAlerts(progress);
    this.dashboardData.alerts.push(...newAlerts);

    // Save dashboard state
    await this.saveDashboardState();

    // Emit progress update (for real-time updates)
    await this.emitProgressUpdate();
  }

  /**
     * Add scope analysis data
     */
  addScopeAnalysis(scope: string, analysis: ScopeAnalysis): void {
    this.scopeAnalyses.set(scope, analysis);
  }

  /**
     * Record milestone completion
     */
  async recordMilestone(milestone: Milestone): Promise<void> {
    this.milestoneHistory.push(milestone);
    this.dashboardData.progress.milestones.push(milestone);

    // Generate milestone alert
    const alert: Alert = {
      id: `milestone-${Date.now()}`,
      type: 'success',
      title: 'Milestone Achieved',
      message: `${milestone.name} completed successfully`,
      timestamp: milestone.timestamp,
      scope: milestone.scope,
      actionRequired: false
    };

    this.dashboardData.alerts.push(alert);
    await this.saveDashboardState();
  }

  /**
     * Generate HTML dashboard
     */
  async generateHTMLDashboard(): Promise<string> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Retrofit Progress Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #45a049);
            transition: width 0.3s ease;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .metric:last-child {
            border-bottom: none;
        }
        .metric-label {
            font-weight: 500;
        }
        .metric-value {
            font-weight: bold;
            color: #333;
        }
        .alert {
            padding: 12px;
            margin: 8px 0;
            border-radius: 4px;
            border-left: 4px solid;
        }
        .alert.success {
            background: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        .alert.warning {
            background: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        .alert.error {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .alert.info {
            background: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        .chart-container {
            position: relative;
            height: 300px;
            margin: 20px 0;
        }
        .recommendations {
            list-style: none;
            padding: 0;
        }
        .recommendation {
            padding: 15px;
            margin: 10px 0;
            background: #f8f9fa;
            border-radius: 4px;
            border-left: 4px solid;
        }
        .recommendation.high {
            border-color: #dc3545;
        }
        .recommendation.medium {
            border-color: #ffc107;
        }
        .recommendation.low {
            border-color: #28a745;
        }
        .refresh-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        }
        .refresh-btn:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 Retrofit Progress Dashboard</h1>
            <p>Real-time tracking of incremental retrofit operations</p>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
        </div>
        
        <div class="grid">
            <div class="card">
                <h2>📊 Overall Progress</h2>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${this.dashboardData.progress.percentage}%"></div>
                </div>
                <div class="metric">
                    <span class="metric-label">Progress</span>
                    <span class="metric-value">${this.dashboardData.progress.percentage.toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Scopes Completed</span>
                    <span class="metric-value">${this.dashboardData.progress.completedScopes}/${this.dashboardData.progress.totalScopes}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Current Scope</span>
                    <span class="metric-value">${this.dashboardData.progress.currentScope || 'None'}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Time Remaining</span>
                    <span class="metric-value">${this.formatTime(this.dashboardData.progress.timeRemaining)}</span>
                </div>
            </div>
            
            <div class="card">
                <h2>⚡ Performance Analytics</h2>
                <div class="metric">
                    <span class="metric-label">Velocity</span>
                    <span class="metric-value">${this.dashboardData.analytics.velocity.toFixed(2)} scopes/hour</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Efficiency</span>
                    <span class="metric-value">${(this.dashboardData.analytics.efficiency * 100).toFixed(1)}%</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Quality Trend</span>
                    <span class="metric-value">${this.dashboardData.analytics.qualityTrend.trend}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Average Quality</span>
                    <span class="metric-value">${(this.dashboardData.analytics.qualityTrend.averageScore * 100).toFixed(1)}%</span>
                </div>
            </div>
            
            <div class="card">
                <h2>🎯 Milestones</h2>
                ${this.dashboardData.progress.milestones.slice(-5).map(m => `
                    <div class="metric">
                        <span class="metric-label">${m.name}</span>
                        <span class="metric-value">${m.completed ? '✅' : '⏳'}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="card">
                <h2>⚠️ Issues & Alerts</h2>
                ${this.dashboardData.alerts.slice(-5).map(a => `
                    <div class="alert ${a.type}">
                        <strong>${a.title}</strong><br>
                        ${a.message}
                        ${a.scope ? `<br><small>Scope: ${a.scope}</small>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h2>📈 Progress Chart</h2>
                <div class="chart-container">
                    <canvas id="progressChart"></canvas>
                </div>
            </div>
            
            <div class="card">
                <h2>🔍 Risk Distribution</h2>
                <div class="chart-container">
                    <canvas id="riskChart"></canvas>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>💡 Recommendations</h2>
            <ul class="recommendations">
                ${this.dashboardData.recommendations.map(r => `
                    <li class="recommendation ${r.priority}">
                        <strong>${r.title}</strong><br>
                        ${r.description}<br>
                        <small><strong>Action:</strong> ${r.action} | <strong>Impact:</strong> ${r.impact}</small>
                    </li>
                `).join('')}
            </ul>
        </div>
    </div>
    
    <script>
        // Progress Chart
        const progressCtx = document.getElementById('progressChart').getContext('2d');
        new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(this.getProgressLabels())},
                datasets: [{
                    label: 'Progress %',
                    data: ${JSON.stringify(this.getProgressData())},
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
        
        // Risk Chart
        const riskCtx = document.getElementById('riskChart').getContext('2d');
        new Chart(riskCtx, {
            type: 'doughnut',
            data: {
                labels: ['Low', 'Medium', 'High', 'Critical'],
                datasets: [{
                    data: [
                        ${this.dashboardData.analytics.riskDistribution.low},
                        ${this.dashboardData.analytics.riskDistribution.medium},
                        ${this.dashboardData.analytics.riskDistribution.high},
                        ${this.dashboardData.analytics.riskDistribution.critical}
                    ],
                    backgroundColor: ['#28a745', '#ffc107', '#fd7e14', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        
        // Auto-refresh every 30 seconds
        setTimeout(() => location.reload(), 30000);
    </script>
</body>
</html>`;

    return html;
  }

  /**
     * Save dashboard to HTML file
     */
  async saveDashboard(): Promise<string> {
    const html = await this.generateHTMLDashboard();
    const dashboardPath = join(process.cwd(), '.vibe', 'dashboard');

    await fs.mkdir(dashboardPath, { recursive: true });

    const filePath = join(dashboardPath, 'index.html');
    await fs.writeFile(filePath, html);

    console.log(`📊 Dashboard saved to: ${filePath}`);
    return filePath;
  }

  // Private helper methods
  private createInitialProgress(): RetrofitProgress {
    return {
      totalScopes: 0,
      completedScopes: 0,
      currentScope: '',
      percentage: 0,
      timeElapsed: 0,
      timeRemaining: 0,
      issues: [],
      milestones: []
    };
  }

  private createInitialAnalytics(): ProgressAnalytics {
    return {
      velocity: 0,
      efficiency: 0,
      qualityTrend: {
        dataPoints: [],
        trend: 'stable',
        averageScore: 0,
        projectedScore: 0
      },
      riskDistribution: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      timeAnalysis: {
        averageTimePerScope: 0,
        fastestScope: { scope: '', duration: 0, factors: [] },
        slowestScope: { scope: '', duration: 0, factors: [] },
        timeVariance: 0
      }
    };
  }

  private async calculateAnalytics(): Promise<ProgressAnalytics> {
    const analytics = this.createInitialAnalytics();

    if (this.progressHistory.length === 0) {
      return analytics;
    }

    // Calculate velocity
    const timeElapsed = this.dashboardData.progress.timeElapsed / (1000 * 60 * 60); // hours
    analytics.velocity = timeElapsed > 0 ? this.dashboardData.progress.completedScopes / timeElapsed : 0;

    // Calculate efficiency
    const totalAttempts = this.dashboardData.progress.completedScopes + this.dashboardData.progress.issues.length;
    analytics.efficiency = totalAttempts > 0 ? this.dashboardData.progress.completedScopes / totalAttempts : 0;

    // Calculate risk distribution
    const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    this.scopeAnalyses.forEach(analysis => {
      riskCounts[analysis.riskLevel]++;
    });

    const total = this.scopeAnalyses.size;
    if (total > 0) {
      analytics.riskDistribution = {
        low: riskCounts.low / total,
        medium: riskCounts.medium / total,
        high: riskCounts.high / total,
        critical: riskCounts.critical / total
      };
    }

    return analytics;
  }

  private async generateVisualizations(): Promise<ProgressVisualization[]> {
    return [
      {
        type: 'line',
        title: 'Progress Over Time',
        data: {
          labels: this.getProgressLabels(),
          datasets: [{
            label: 'Progress %',
            data: this.getProgressData(),
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderColor: '#4CAF50'
          }]
        },
        config: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    ];
  }

  private async generateRecommendations(): Promise<DashboardRecommendation[]> {
    const recommendations: DashboardRecommendation[] = [];

    // Performance recommendations
    if (this.dashboardData.analytics.velocity < 1) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        title: 'Low Velocity Detected',
        description: 'Retrofit velocity is below 1 scope per hour',
        action: 'Consider parallelizing scope processing or reducing scope size',
        impact: 'Could improve overall completion time by 30-50%',
        effort: 3
      });
    }

    // Quality recommendations
    if (this.dashboardData.analytics.qualityTrend.trend === 'declining') {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        title: 'Quality Trend Declining',
        description: 'Quality scores are decreasing over time',
        action: 'Review pattern application and validation processes',
        impact: 'Prevent technical debt accumulation',
        effort: 4
      });
    }

    // Risk recommendations
    if (this.dashboardData.analytics.riskDistribution.critical > 0.1) {
      recommendations.push({
        type: 'risk',
        priority: 'critical',
        title: 'High Risk Scopes Detected',
        description: 'More than 10% of scopes are marked as critical risk',
        action: 'Focus on critical risk scopes with additional validation',
        impact: 'Reduce likelihood of breaking changes',
        effort: 5
      });
    }

    return recommendations;
  }

  private async checkForAlerts(progress: RetrofitProgress): Promise<Alert[]> {
    const alerts: Alert[] = [];

    // Check for stalled progress
    if (progress.currentScope && progress.timeElapsed > 0) {
      const timeSinceLastUpdate = Date.now() - this.progressHistory[this.progressHistory.length - 2]?.timeElapsed || 0;
      if (timeSinceLastUpdate > 30 * 60 * 1000) { // 30 minutes
        alerts.push({
          id: `stalled-${Date.now()}`,
          type: 'warning',
          title: 'Progress Stalled',
          message: 'No progress detected for 30 minutes',
          timestamp: new Date(),
          scope: progress.currentScope,
          actionRequired: true,
          actions: [
            { label: 'Check Logs', action: 'check-logs', destructive: false },
            { label: 'Restart Scope', action: 'restart-scope', destructive: true }
          ]
        });
      }
    }

    // Check for high error rate
    const errorRate = progress.issues.length / (progress.completedScopes + progress.issues.length);
    if (errorRate > 0.2) {
      alerts.push({
        id: `error-rate-${Date.now()}`,
        type: 'error',
        title: 'High Error Rate',
        message: `Error rate is ${(errorRate * 100).toFixed(1)}%`,
        timestamp: new Date(),
        actionRequired: true,
        actions: [
          { label: 'Review Errors', action: 'review-errors', destructive: false },
          { label: 'Pause Retrofit', action: 'pause-retrofit', destructive: true }
        ]
      });
    }

    return alerts;
  }

  private async saveDashboardState(): Promise<void> {
    const stateDir = join(process.cwd(), '.vibe', 'dashboard');
    await fs.mkdir(stateDir, { recursive: true });

    const stateFile = join(stateDir, 'state.json');
    await fs.writeFile(stateFile, JSON.stringify(this.dashboardData, null, 2));
  }

  private async emitProgressUpdate(): Promise<void> {
    // Emit progress update event (placeholder for WebSocket or event system)
    console.log('📡 Progress update emitted');
  }

  private getProgressLabels(): string[] {
    return this.progressHistory.map((_, index) => `Step ${index + 1}`);
  }

  private getProgressData(): number[] {
    return this.progressHistory.map(p => p.percentage);
  }

  private formatTime(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  }
}

// Export for CLI usage
export const progressTracker = new ProgressTracker();
