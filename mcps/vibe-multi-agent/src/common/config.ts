import { OrchestratorConfig, AgentRole } from './types.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'yaml';

export const DEFAULT_CONFIG: OrchestratorConfig = {
  host: 'localhost',
  port: 8080,
  ssl: false,
  auth: {
    type: 'none'
  },
  agents: {
    maxConcurrent: 5,
    defaultTimeout: 300000, // 5 minutes
    heartbeatInterval: 5000, // 5 seconds
    reconnectAttempts: 3
  },
  git: {
    worktreePath: '.worktrees',
    mergeStrategy: 'merge',
    autoMerge: true
  },
  logging: {
    level: 'info'
  }
};

export const DEFAULT_AGENT_ROLES: AgentRole[] = [
  {
    id: 'frontend',
    name: 'Frontend Developer',
    capabilities: ['react', 'vue', 'angular', 'css', 'html', 'typescript', 'javascript', 'ui', 'ux'],
    description: 'Specializes in frontend development, UI components, and user experience',
    systemPrompt: `You are a specialized Frontend Developer agent. Your expertise includes:
- React, Vue, Angular development
- TypeScript/JavaScript
- CSS, HTML, responsive design
- UI component development
- User experience optimization
- Frontend testing

Focus on creating clean, maintainable, and accessible frontend code. Follow modern best practices and design patterns.`,
    allowedTools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
    maxConcurrentTasks: 3
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    capabilities: ['nodejs', 'python', 'api', 'database', 'auth', 'security', 'microservices'],
    description: 'Specializes in backend development, APIs, and server-side logic',
    systemPrompt: `You are a specialized Backend Developer agent. Your expertise includes:
- Node.js, Python, Java development
- RESTful API design and implementation
- Database design and optimization
- Authentication and authorization
- Security best practices
- Microservices architecture

Focus on creating scalable, secure, and performant backend solutions. Follow industry standards and best practices.`,
    allowedTools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
    maxConcurrentTasks: 5
  },
  {
    id: 'database',
    name: 'Database Specialist',
    capabilities: ['sql', 'nosql', 'migrations', 'schema', 'optimization', 'postgresql', 'mongodb'],
    description: 'Specializes in database design, migrations, and optimization',
    systemPrompt: `You are a specialized Database Specialist agent. Your expertise includes:
- SQL and NoSQL database design
- Database migrations and schema management
- Query optimization
- Data modeling
- Database security
- Performance tuning

Focus on creating efficient, normalized, and scalable database solutions. Ensure data integrity and optimal performance.`,
    allowedTools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
    maxConcurrentTasks: 2
  },
  {
    id: 'testing',
    name: 'Testing Specialist',
    capabilities: ['unit-testing', 'integration-testing', 'e2e-testing', 'jest', 'cypress', 'playwright'],
    description: 'Specializes in testing strategy and implementation',
    systemPrompt: `You are a specialized Testing Specialist agent. Your expertise includes:
- Unit testing and TDD
- Integration testing
- End-to-end testing
- Test automation
- Testing frameworks (Jest, Cypress, Playwright)
- Code coverage analysis

Focus on creating comprehensive test suites that ensure code quality and reliability. Follow testing best practices and maintain high coverage.`,
    allowedTools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
    maxConcurrentTasks: 4
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    capabilities: ['docker', 'kubernetes', 'ci-cd', 'deployment', 'monitoring', 'aws', 'gcp'],
    description: 'Specializes in deployment, CI/CD, and infrastructure',
    systemPrompt: `You are a specialized DevOps Engineer agent. Your expertise includes:
- Docker containerization
- Kubernetes orchestration
- CI/CD pipeline design
- Cloud infrastructure (AWS, GCP, Azure)
- Monitoring and observability
- Infrastructure as Code

Focus on creating reliable, scalable, and automated deployment solutions. Ensure system reliability and performance monitoring.`,
    allowedTools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
    maxConcurrentTasks: 2
  },
  {
    id: 'documentation',
    name: 'Documentation Specialist',
    capabilities: ['technical-writing', 'api-docs', 'user-guides', 'markdown', 'documentation'],
    description: 'Specializes in technical documentation and user guides',
    systemPrompt: `You are a specialized Documentation Specialist agent. Your expertise includes:
- Technical writing and documentation
- API documentation
- User guides and tutorials
- README files and project documentation
- Code comments and inline documentation
- Documentation maintenance

Focus on creating clear, comprehensive, and user-friendly documentation. Ensure documentation is kept up-to-date and accessible.`,
    allowedTools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
    maxConcurrentTasks: 3
  }
];

export function loadConfig(configPath?: string): OrchestratorConfig {
  if (!configPath) {
    return DEFAULT_CONFIG;
  }

  try {
    const configFile = readFileSync(configPath, 'utf-8');
    const config = yaml.parse(configFile);
    
    // Merge with defaults
    return {
      ...DEFAULT_CONFIG,
      ...config,
      agents: {
        ...DEFAULT_CONFIG.agents,
        ...config.agents
      },
      git: {
        ...DEFAULT_CONFIG.git,
        ...config.git
      },
      logging: {
        ...DEFAULT_CONFIG.logging,
        ...config.logging
      }
    };
  } catch (error) {
    console.warn(`Failed to load config from ${configPath}, using defaults:`, error);
    return DEFAULT_CONFIG;
  }
}

export function getAgentRole(roleId: string): AgentRole | undefined {
  return DEFAULT_AGENT_ROLES.find(role => role.id === roleId);
}

export function getAgentRoles(): AgentRole[] {
  return DEFAULT_AGENT_ROLES;
}

export function validateConfig(config: OrchestratorConfig): boolean {
  const required = ['host', 'port', 'agents', 'git', 'logging'];
  
  for (const field of required) {
    if (!config[field as keyof OrchestratorConfig]) {
      throw new Error(`Missing required config field: ${field}`);
    }
  }
  
  if (config.port < 1 || config.port > 65535) {
    throw new Error('Invalid port number');
  }
  
  if (config.agents.maxConcurrent < 1) {
    throw new Error('maxConcurrent must be at least 1');
  }
  
  return true;
}