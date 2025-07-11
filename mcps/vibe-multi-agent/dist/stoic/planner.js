import { log } from '../common/logger.js';
import { generateId } from '../common/utils.js';
export class StoicPlanner {
    constructor() { }
    async generateStrategicPlan(requirements) {
        log.info('Generating strategic plan for project');
        const projectType = this.inferProjectType(requirements.description);
        const projectName = this.extractProjectName(requirements.description);
        const architecture = await this.designArchitecture(requirements, projectType);
        const phases = this.createImplementationPhases(architecture);
        const risks = this.identifyRisks(requirements, architecture);
        const timeline = this.createTimeline(phases);
        const resources = this.identifyResources(architecture);
        const recommendations = this.generateRecommendations(requirements, architecture);
        const plan = {
            id: generateId(),
            project: {
                name: projectName,
                type: projectType,
                description: requirements.description
            },
            architecture,
            phases,
            recommendations,
            risks,
            timeline,
            resources
        };
        log.info(`Strategic plan generated for ${projectName} (${projectType})`);
        return plan;
    }
    inferProjectType(description) {
        const lower = description.toLowerCase();
        if (lower.includes('saas') || lower.includes('software as a service')) {
            return 'saas';
        }
        else if (lower.includes('mobile') || lower.includes('app') || lower.includes('ios') || lower.includes('android')) {
            return 'mobile_app';
        }
        else if (lower.includes('web') || lower.includes('website') || lower.includes('frontend')) {
            return 'web_application';
        }
        else if (lower.includes('api') || lower.includes('backend') || lower.includes('service')) {
            return 'api_service';
        }
        else if (lower.includes('dashboard') || lower.includes('admin')) {
            return 'dashboard';
        }
        else if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store')) {
            return 'ecommerce';
        }
        else if (lower.includes('cms') || lower.includes('content management')) {
            return 'cms';
        }
        else if (lower.includes('blog') || lower.includes('news')) {
            return 'blog';
        }
        else if (lower.includes('portfolio')) {
            return 'portfolio';
        }
        else if (lower.includes('landing')) {
            return 'landing_page';
        }
        else {
            return 'web_application';
        }
    }
    extractProjectName(description) {
        // Simple extraction - look for quoted names or capitalize first few words
        const quoted = description.match(/["""']([^"""']+)["""']/);
        if (quoted) {
            return quoted[1];
        }
        const words = description.split(' ').slice(0, 3);
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    async designArchitecture(requirements, projectType) {
        const baseArchitecture = this.getBaseArchitecture(projectType);
        // Customize based on requirements and preferences
        const customizedArchitecture = {
            ...baseArchitecture,
            constraints: requirements.constraints,
            preferences: requirements.preferences,
            components: this.generateComponents(requirements, projectType),
            database: this.recommendDatabase(requirements.preferences),
            deployment: this.recommendDeployment(requirements.preferences),
            testing: this.createTestingStrategy(),
            security: this.createSecurityStrategy(),
            monitoring: this.createMonitoringStrategy(),
            scalability: this.createScalabilityStrategy(projectType)
        };
        return customizedArchitecture;
    }
    getBaseArchitecture(projectType) {
        const architectures = {
            saas: {
                type: 'multi-tenant-saas',
                pattern: 'microservices',
                frontend: 'react-spa',
                backend: 'node-express',
                database: 'postgresql',
                cache: 'redis',
                queue: 'bull',
                auth: 'jwt-oauth',
                payments: 'stripe',
                monitoring: 'prometheus-grafana'
            },
            web_application: {
                type: 'web-application',
                pattern: 'mvc',
                frontend: 'react',
                backend: 'node-express',
                database: 'postgresql',
                cache: 'redis',
                auth: 'jwt'
            },
            mobile_app: {
                type: 'mobile-application',
                pattern: 'client-server',
                frontend: 'react-native',
                backend: 'node-express',
                database: 'postgresql',
                push: 'firebase',
                auth: 'jwt'
            },
            api_service: {
                type: 'api-service',
                pattern: 'rest-api',
                backend: 'node-express',
                database: 'postgresql',
                cache: 'redis',
                docs: 'swagger',
                auth: 'jwt'
            },
            dashboard: {
                type: 'dashboard',
                pattern: 'spa',
                frontend: 'react-dashboard',
                backend: 'node-express',
                database: 'postgresql',
                charts: 'chartjs',
                auth: 'jwt'
            },
            ecommerce: {
                type: 'ecommerce',
                pattern: 'monolithic',
                frontend: 'react',
                backend: 'node-express',
                database: 'postgresql',
                payments: 'stripe',
                inventory: 'postgresql',
                auth: 'jwt'
            }
        };
        return architectures[projectType] || architectures.web_application;
    }
    generateComponents(requirements, projectType) {
        const baseComponents = [
            { name: 'Authentication', type: 'auth', critical: true },
            { name: 'User Management', type: 'users', critical: true },
            { name: 'Database Layer', type: 'database', critical: true },
            { name: 'API Layer', type: 'api', critical: true },
            { name: 'Frontend Application', type: 'frontend', critical: true }
        ];
        const typeSpecificComponents = {
            saas: [
                { name: 'Tenant Management', type: 'tenant', critical: true },
                { name: 'Subscription Management', type: 'billing', critical: true },
                { name: 'Analytics Dashboard', type: 'analytics', critical: false },
                { name: 'Admin Panel', type: 'admin', critical: false }
            ],
            ecommerce: [
                { name: 'Product Catalog', type: 'catalog', critical: true },
                { name: 'Shopping Cart', type: 'cart', critical: true },
                { name: 'Payment Processing', type: 'payments', critical: true },
                { name: 'Order Management', type: 'orders', critical: true },
                { name: 'Inventory Management', type: 'inventory', critical: true }
            ],
            mobile_app: [
                { name: 'Push Notifications', type: 'notifications', critical: false },
                { name: 'Offline Support', type: 'offline', critical: false },
                { name: 'App Store Integration', type: 'appstore', critical: false }
            ]
        };
        return [...baseComponents, ...(typeSpecificComponents[projectType] || [])];
    }
    recommendDatabase(preferences) {
        const database = preferences.database || 'postgresql';
        return {
            primary: database,
            schema: 'relational',
            migrations: true,
            backup: 'automated',
            replication: 'read-replicas',
            monitoring: 'enabled'
        };
    }
    recommendDeployment(preferences) {
        const deployment = preferences.deployment || 'docker-compose';
        return {
            strategy: deployment,
            environment: ['development', 'staging', 'production'],
            cicd: 'github-actions',
            monitoring: 'prometheus',
            logging: 'winston',
            scaling: 'horizontal'
        };
    }
    createTestingStrategy() {
        return {
            unit: {
                framework: 'jest',
                coverage: 95,
                required: true
            },
            integration: {
                framework: 'supertest',
                coverage: 85,
                required: true
            },
            e2e: {
                framework: 'playwright',
                coverage: 75,
                required: true
            },
            performance: {
                framework: 'artillery',
                required: false
            }
        };
    }
    createSecurityStrategy() {
        return {
            authentication: 'jwt-oauth',
            authorization: 'rbac',
            encryption: 'bcrypt-aes',
            https: 'enforced',
            cors: 'configured',
            rateLimit: 'enabled',
            validation: 'joi',
            scanning: 'snyk'
        };
    }
    createMonitoringStrategy() {
        return {
            metrics: 'prometheus',
            logging: 'winston',
            tracing: 'jaeger',
            alerts: 'alertmanager',
            uptime: 'pingdom',
            performance: 'newrelic'
        };
    }
    createScalabilityStrategy(projectType) {
        return {
            horizontal: projectType === 'saas',
            vertical: true,
            caching: 'redis',
            cdn: 'cloudflare',
            database: 'read-replicas',
            loadBalancer: 'nginx',
            microservices: projectType === 'saas'
        };
    }
    createImplementationPhases(architecture) {
        const phases = [
            {
                id: 'phase-1',
                name: 'Foundation & Setup',
                description: 'Project setup, infrastructure, and basic authentication',
                order: 1,
                duration: 1,
                dependencies: [],
                deliverables: ['Project structure', 'CI/CD pipeline', 'Database schema', 'Basic auth'],
                milestones: ['Development environment ready', 'Authentication working']
            },
            {
                id: 'phase-2',
                name: 'Core Backend',
                description: 'Core API endpoints and business logic',
                order: 2,
                duration: 2,
                dependencies: ['phase-1'],
                deliverables: ['Core API', 'Database models', 'Business logic', 'Unit tests'],
                milestones: ['API endpoints functional', 'Database populated']
            },
            {
                id: 'phase-3',
                name: 'Frontend Foundation',
                description: 'Basic UI components and routing',
                order: 3,
                duration: 2,
                dependencies: ['phase-2'],
                deliverables: ['UI components', 'Routing', 'State management', 'API integration'],
                milestones: ['Basic UI working', 'API integration complete']
            },
            {
                id: 'phase-4',
                name: 'Feature Development',
                description: 'Implement main features and functionality',
                order: 4,
                duration: 3,
                dependencies: ['phase-3'],
                deliverables: ['Main features', 'Advanced UI', 'Integration tests', 'Documentation'],
                milestones: ['Core features complete', 'Testing complete']
            },
            {
                id: 'phase-5',
                name: 'Polish & Deployment',
                description: 'Final polish, performance optimization, and deployment',
                order: 5,
                duration: 1,
                dependencies: ['phase-4'],
                deliverables: ['Performance optimization', 'Final testing', 'Deployment', 'Documentation'],
                milestones: ['Production ready', 'Successfully deployed']
            }
        ];
        return phases;
    }
    identifyRisks(requirements, architecture) {
        const risks = [
            {
                id: 'tech-complexity',
                category: 'technical',
                description: 'Technology stack complexity may slow development',
                probability: 'medium',
                impact: 'medium',
                mitigation: ['Choose proven technologies', 'Adequate training', 'Proof of concepts']
            },
            {
                id: 'scope-creep',
                category: 'project',
                description: 'Requirements may change during development',
                probability: 'high',
                impact: 'high',
                mitigation: ['Clear requirements', 'Change management process', 'Regular reviews']
            },
            {
                id: 'performance',
                category: 'technical',
                description: 'Performance issues under load',
                probability: 'medium',
                impact: 'high',
                mitigation: ['Load testing', 'Performance monitoring', 'Caching strategy']
            },
            {
                id: 'security',
                category: 'security',
                description: 'Security vulnerabilities',
                probability: 'medium',
                impact: 'high',
                mitigation: ['Security audit', 'Regular updates', 'Penetration testing']
            }
        ];
        return risks;
    }
    createTimeline(phases) {
        const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
        const startDate = new Date();
        const milestones = phases.map(phase => ({
            name: phase.name,
            date: new Date(startDate.getTime() + phase.order * 7 * 24 * 60 * 60 * 1000).toISOString(),
            description: phase.description
        }));
        return {
            startDate: startDate.toISOString(),
            estimatedDuration: totalDuration,
            milestones
        };
    }
    identifyResources(architecture) {
        return [
            {
                type: 'human',
                name: 'Frontend Developer',
                description: 'React/TypeScript specialist',
                quantity: 1,
                critical: true
            },
            {
                type: 'human',
                name: 'Backend Developer',
                description: 'Node.js/API specialist',
                quantity: 1,
                critical: true
            },
            {
                type: 'human',
                name: 'Database Specialist',
                description: 'Database design and optimization',
                quantity: 1,
                critical: true
            },
            {
                type: 'human',
                name: 'DevOps Engineer',
                description: 'Deployment and infrastructure',
                quantity: 1,
                critical: false
            },
            {
                type: 'infrastructure',
                name: 'Development Environment',
                description: 'Local development setup',
                quantity: 1,
                critical: true
            },
            {
                type: 'infrastructure',
                name: 'Staging Environment',
                description: 'Testing and staging server',
                quantity: 1,
                critical: true
            },
            {
                type: 'infrastructure',
                name: 'Production Environment',
                description: 'Live production server',
                quantity: 1,
                critical: true
            }
        ];
    }
    generateRecommendations(requirements, architecture) {
        return [
            'Start with a minimal viable product (MVP) approach',
            'Implement comprehensive testing from the beginning',
            'Use TypeScript for better code quality and maintainability',
            'Set up continuous integration and deployment early',
            'Implement proper error handling and logging',
            'Focus on security best practices throughout development',
            'Plan for scalability from the start',
            'Maintain comprehensive documentation',
            'Use code review processes for all changes',
            'Implement monitoring and alerting for production'
        ];
    }
}
//# sourceMappingURL=planner.js.map