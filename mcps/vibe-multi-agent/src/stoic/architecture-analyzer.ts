import { log } from '../common/logger.js';

export interface ArchitectureAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  risks: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  complexity: {
    overall: number;
    frontend: number;
    backend: number;
    database: number;
    deployment: number;
  };
  scalability: {
    horizontal: boolean;
    vertical: boolean;
    bottlenecks: string[];
    recommendations: string[];
  };
  security: {
    score: number;
    vulnerabilities: string[];
    recommendations: string[];
  };
  performance: {
    score: number;
    bottlenecks: string[];
    optimizations: string[];
  };
}

export class ArchitectureAnalyzer {
  constructor() {}

  async analyzeArchitecture(architecture: any, focusAreas: string[] = []): Promise<ArchitectureAnalysis> {
    log.info('Analyzing architecture');

    const analysis: ArchitectureAnalysis = {
      score: 0,
      strengths: [],
      weaknesses: [],
      recommendations: [],
      risks: [],
      complexity: this.analyzeComplexity(architecture),
      scalability: this.analyzeScalability(architecture),
      security: this.analyzeSecurity(architecture),
      performance: this.analyzePerformance(architecture)
    };

    // Overall analysis
    analysis.score = this.calculateOverallScore(analysis);
    analysis.strengths = this.identifyStrengths(architecture);
    analysis.weaknesses = this.identifyWeaknesses(architecture);
    analysis.recommendations = this.generateRecommendations(architecture, analysis);
    analysis.risks = this.identifyRisks(architecture);

    // Focus on specific areas if requested
    if (focusAreas.length > 0) {
      analysis.recommendations = analysis.recommendations.filter(rec => 
        focusAreas.some(area => rec.toLowerCase().includes(area.toLowerCase()))
      );
    }

    log.info(`Architecture analysis completed with score: ${analysis.score}/100`);
    return analysis;
  }

  private analyzeComplexity(architecture: any): any {
    const complexity = {
      overall: 0,
      frontend: 0,
      backend: 0,
      database: 0,
      deployment: 0
    };

    // Frontend complexity
    complexity.frontend = this.calculateFrontendComplexity(architecture);
    
    // Backend complexity
    complexity.backend = this.calculateBackendComplexity(architecture);
    
    // Database complexity
    complexity.database = this.calculateDatabaseComplexity(architecture);
    
    // Deployment complexity
    complexity.deployment = this.calculateDeploymentComplexity(architecture);
    
    // Overall complexity (weighted average)
    complexity.overall = Math.round(
      (complexity.frontend * 0.25 + 
       complexity.backend * 0.35 + 
       complexity.database * 0.25 + 
       complexity.deployment * 0.15)
    );

    return complexity;
  }

  private calculateFrontendComplexity(architecture: any): number {
    let complexity = 1;
    
    // Base complexity from framework
    const frameworkComplexity = {
      'react': 2,
      'vue': 2,
      'angular': 3,
      'svelte': 1,
      'vanilla': 1
    };
    
    const frontend = architecture.frontend || 'react';
    complexity += frameworkComplexity[frontend] || 2;
    
    // Add complexity for state management
    if (architecture.stateManagement) {
      complexity += 1;
    }
    
    // Add complexity for components
    if (architecture.components) {
      const frontendComponents = architecture.components.filter(c => c.type === 'frontend');
      complexity += Math.min(frontendComponents.length * 0.5, 3);
    }
    
    // Add complexity for routing
    if (architecture.routing) {
      complexity += 1;
    }
    
    return Math.min(complexity, 10);
  }

  private calculateBackendComplexity(architecture: any): number {
    let complexity = 1;
    
    // Base complexity from framework
    const frameworkComplexity = {
      'express': 2,
      'fastify': 2,
      'nest': 3,
      'koa': 2,
      'hapi': 3
    };
    
    const backend = architecture.backend || 'express';
    complexity += frameworkComplexity[backend] || 2;
    
    // Add complexity for microservices
    if (architecture.pattern === 'microservices') {
      complexity += 3;
    }
    
    // Add complexity for authentication
    if (architecture.auth) {
      complexity += 1;
    }
    
    // Add complexity for external integrations
    if (architecture.integrations) {
      complexity += Math.min(architecture.integrations.length * 0.5, 2);
    }
    
    // Add complexity for components
    if (architecture.components) {
      const backendComponents = architecture.components.filter(c => c.type === 'backend');
      complexity += Math.min(backendComponents.length * 0.3, 2);
    }
    
    return Math.min(complexity, 10);
  }

  private calculateDatabaseComplexity(architecture: any): number {
    let complexity = 1;
    
    // Base complexity from database type
    const dbComplexity = {
      'postgresql': 2,
      'mysql': 2,
      'mongodb': 2,
      'sqlite': 1,
      'redis': 1
    };
    
    const database = architecture.database?.primary || 'postgresql';
    complexity += dbComplexity[database] || 2;
    
    // Add complexity for multiple databases
    if (architecture.database?.secondary) {
      complexity += 1;
    }
    
    // Add complexity for caching
    if (architecture.cache) {
      complexity += 1;
    }
    
    // Add complexity for migrations
    if (architecture.database?.migrations) {
      complexity += 1;
    }
    
    // Add complexity for replication
    if (architecture.database?.replication) {
      complexity += 1;
    }
    
    return Math.min(complexity, 10);
  }

  private calculateDeploymentComplexity(architecture: any): number {
    let complexity = 1;
    
    // Base complexity from deployment strategy
    const deploymentComplexity = {
      'docker-compose': 2,
      'kubernetes': 4,
      'serverless': 3,
      'traditional': 1
    };
    
    const deployment = architecture.deployment?.strategy || 'docker-compose';
    complexity += deploymentComplexity[deployment] || 2;
    
    // Add complexity for multiple environments
    if (architecture.deployment?.environment) {
      complexity += architecture.deployment.environment.length * 0.5;
    }
    
    // Add complexity for CI/CD
    if (architecture.deployment?.cicd) {
      complexity += 1;
    }
    
    // Add complexity for monitoring
    if (architecture.monitoring) {
      complexity += 1;
    }
    
    return Math.min(complexity, 10);
  }

  private analyzeScalability(architecture: any): any {
    const scalability = {
      horizontal: false,
      vertical: true,
      bottlenecks: [],
      recommendations: []
    };

    // Check for horizontal scalability
    if (architecture.pattern === 'microservices' || 
        architecture.deployment?.strategy === 'kubernetes' ||
        architecture.scalability?.horizontal) {
      scalability.horizontal = true;
    }

    // Identify bottlenecks
    if (architecture.database?.primary === 'sqlite') {
      scalability.bottlenecks.push('SQLite database limits horizontal scaling');
    }

    if (!architecture.cache) {
      scalability.bottlenecks.push('No caching layer may limit performance under load');
    }

    if (architecture.pattern === 'monolithic') {
      scalability.bottlenecks.push('Monolithic architecture may limit independent scaling');
    }

    if (!architecture.database?.replication) {
      scalability.bottlenecks.push('No database replication may create read bottlenecks');
    }

    // Generate recommendations
    if (!scalability.horizontal) {
      scalability.recommendations.push('Consider microservices architecture for horizontal scaling');
    }

    if (!architecture.cache) {
      scalability.recommendations.push('Add caching layer (Redis) for better performance');
    }

    if (!architecture.database?.replication) {
      scalability.recommendations.push('Implement database read replicas for scaling reads');
    }

    if (!architecture.scalability?.loadBalancer) {
      scalability.recommendations.push('Add load balancer for distributing traffic');
    }

    return scalability;
  }

  private analyzeSecurity(architecture: any): any {
    const security = {
      score: 0,
      vulnerabilities: [],
      recommendations: []
    };

    let score = 0;

    // Authentication
    if (architecture.auth) {
      score += 20;
    } else {
      security.vulnerabilities.push('No authentication system configured');
    }

    // HTTPS
    if (architecture.security?.https) {
      score += 15;
    } else {
      security.vulnerabilities.push('HTTPS not enforced');
      security.recommendations.push('Enable HTTPS in production');
    }

    // Input validation
    if (architecture.security?.validation) {
      score += 15;
    } else {
      security.vulnerabilities.push('No input validation configured');
      security.recommendations.push('Implement input validation middleware');
    }

    // CORS
    if (architecture.security?.cors) {
      score += 10;
    } else {
      security.vulnerabilities.push('CORS not configured');
      security.recommendations.push('Configure CORS properly');
    }

    // Rate limiting
    if (architecture.security?.rateLimit) {
      score += 10;
    } else {
      security.vulnerabilities.push('No rate limiting configured');
      security.recommendations.push('Implement rate limiting');
    }

    // Encryption
    if (architecture.security?.encryption) {
      score += 15;
    } else {
      security.vulnerabilities.push('No encryption strategy defined');
      security.recommendations.push('Implement data encryption');
    }

    // Security scanning
    if (architecture.security?.scanning) {
      score += 10;
    } else {
      security.vulnerabilities.push('No security scanning configured');
      security.recommendations.push('Add security scanning to CI/CD');
    }

    // Environment variables
    if (architecture.security?.envVars) {
      score += 5;
    } else {
      security.vulnerabilities.push('Environment variables not properly managed');
      security.recommendations.push('Use proper environment variable management');
    }

    security.score = score;
    return security;
  }

  private analyzePerformance(architecture: any): any {
    const performance = {
      score: 0,
      bottlenecks: [],
      optimizations: []
    };

    let score = 0;

    // Caching
    if (architecture.cache) {
      score += 25;
    } else {
      performance.bottlenecks.push('No caching layer configured');
      performance.optimizations.push('Add Redis or similar caching solution');
    }

    // Database indexing
    if (architecture.database?.indexing) {
      score += 20;
    } else {
      performance.bottlenecks.push('Database indexing not configured');
      performance.optimizations.push('Implement proper database indexing');
    }

    // CDN
    if (architecture.deployment?.cdn) {
      score += 15;
    } else {
      performance.bottlenecks.push('No CDN configured for static assets');
      performance.optimizations.push('Add CDN for static asset delivery');
    }

    // Database connection pooling
    if (architecture.database?.connectionPool) {
      score += 10;
    } else {
      performance.bottlenecks.push('Database connection pooling not configured');
      performance.optimizations.push('Configure database connection pooling');
    }

    // Compression
    if (architecture.deployment?.compression) {
      score += 10;
    } else {
      performance.bottlenecks.push('Response compression not enabled');
      performance.optimizations.push('Enable gzip compression');
    }

    // Monitoring
    if (architecture.monitoring) {
      score += 10;
    } else {
      performance.bottlenecks.push('No performance monitoring configured');
      performance.optimizations.push('Add performance monitoring');
    }

    // Load balancing
    if (architecture.scalability?.loadBalancer) {
      score += 10;
    } else {
      performance.bottlenecks.push('No load balancing configured');
      performance.optimizations.push('Add load balancer for better performance');
    }

    performance.score = score;
    return performance;
  }

  private calculateOverallScore(analysis: ArchitectureAnalysis): number {
    // Weighted average of different aspects
    const weights = {
      complexity: 0.2,
      scalability: 0.25,
      security: 0.3,
      performance: 0.25
    };

    const complexityScore = Math.max(0, 100 - (analysis.complexity.overall * 10));
    const scalabilityScore = (analysis.scalability.horizontal ? 50 : 25) + 
                           (analysis.scalability.vertical ? 25 : 0) + 
                           Math.max(0, 25 - (analysis.scalability.bottlenecks.length * 5));
    const securityScore = analysis.security.score;
    const performanceScore = analysis.performance.score;

    return Math.round(
      complexityScore * weights.complexity +
      scalabilityScore * weights.scalability +
      securityScore * weights.security +
      performanceScore * weights.performance
    );
  }

  private identifyStrengths(architecture: any): string[] {
    const strengths = [];

    if (architecture.testing?.unit?.coverage >= 90) {
      strengths.push('High unit test coverage configured');
    }

    if (architecture.pattern === 'microservices') {
      strengths.push('Microservices architecture enables independent scaling');
    }

    if (architecture.security?.https && architecture.security?.validation) {
      strengths.push('Strong security foundation with HTTPS and validation');
    }

    if (architecture.cache) {
      strengths.push('Caching layer improves performance');
    }

    if (architecture.deployment?.cicd) {
      strengths.push('CI/CD pipeline enables rapid deployment');
    }

    if (architecture.monitoring) {
      strengths.push('Monitoring system provides operational visibility');
    }

    if (architecture.database?.replication) {
      strengths.push('Database replication improves availability and performance');
    }

    return strengths;
  }

  private identifyWeaknesses(architecture: any): string[] {
    const weaknesses = [];

    if (!architecture.testing || architecture.testing.unit?.coverage < 80) {
      weaknesses.push('Low or missing test coverage');
    }

    if (!architecture.security?.https) {
      weaknesses.push('HTTPS not enforced');
    }

    if (!architecture.cache) {
      weaknesses.push('No caching layer configured');
    }

    if (!architecture.monitoring) {
      weaknesses.push('No monitoring system configured');
    }

    if (!architecture.database?.backup) {
      weaknesses.push('No backup strategy defined');
    }

    if (!architecture.security?.rateLimit) {
      weaknesses.push('No rate limiting configured');
    }

    if (architecture.pattern === 'monolithic' && !architecture.scalability?.horizontal) {
      weaknesses.push('Monolithic architecture limits scalability');
    }

    return weaknesses;
  }

  private generateRecommendations(architecture: any, analysis: ArchitectureAnalysis): string[] {
    const recommendations = [];

    // High priority recommendations
    if (analysis.security.score < 70) {
      recommendations.push('PRIORITY: Improve security implementation');
    }

    if (analysis.performance.score < 60) {
      recommendations.push('PRIORITY: Address performance bottlenecks');
    }

    // General recommendations
    if (!architecture.testing || architecture.testing.unit?.coverage < 95) {
      recommendations.push('Increase test coverage to 95% for better quality');
    }

    if (analysis.complexity.overall > 7) {
      recommendations.push('Consider simplifying architecture to reduce complexity');
    }

    if (!analysis.scalability.horizontal) {
      recommendations.push('Plan for horizontal scaling capabilities');
    }

    // Specific recommendations from sub-analyses
    recommendations.push(...analysis.scalability.recommendations);
    recommendations.push(...analysis.security.recommendations);
    recommendations.push(...analysis.performance.optimizations);

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private identifyRisks(architecture: any): any[] {
    const risks = [];

    // Security risks
    if (!architecture.security?.https) {
      risks.push({
        type: 'security',
        description: 'Data transmission not encrypted',
        severity: 'high' as const,
        mitigation: 'Implement HTTPS with proper SSL certificates'
      });
    }

    // Performance risks
    if (!architecture.cache) {
      risks.push({
        type: 'performance',
        description: 'Database may become bottleneck under load',
        severity: 'medium' as const,
        mitigation: 'Implement caching layer (Redis)'
      });
    }

    // Scalability risks
    if (architecture.pattern === 'monolithic') {
      risks.push({
        type: 'scalability',
        description: 'Monolithic architecture may limit growth',
        severity: 'medium' as const,
        mitigation: 'Plan migration to microservices architecture'
      });
    }

    // Availability risks
    if (!architecture.database?.backup) {
      risks.push({
        type: 'availability',
        description: 'Data loss risk without backup strategy',
        severity: 'high' as const,
        mitigation: 'Implement automated backup and recovery procedures'
      });
    }

    // Maintainability risks
    if (!architecture.testing || architecture.testing.unit?.coverage < 80) {
      risks.push({
        type: 'maintainability',
        description: 'Low test coverage increases regression risk',
        severity: 'medium' as const,
        mitigation: 'Increase test coverage and implement TDD practices'
      });
    }

    return risks;
  }
}