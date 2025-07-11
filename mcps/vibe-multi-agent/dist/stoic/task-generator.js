import { generateId } from '../common/utils.js';
import { log } from '../common/logger.js';
export class TaskGenerator {
    constructor() { }
    async generateTasks(architecture, options) {
        log.info('Generating tasks from architecture');
        const tasks = [];
        // Generate foundation tasks
        tasks.push(...this.generateFoundationTasks(architecture, options));
        // Generate component-specific tasks
        if (architecture.components) {
            for (const component of architecture.components) {
                tasks.push(...this.generateComponentTasks(component, architecture, options));
            }
        }
        // Generate testing tasks
        if (options.includeTestingTasks) {
            tasks.push(...this.generateTestingTasks(architecture, options));
        }
        // Generate documentation tasks
        if (options.includeDocumentationTasks) {
            tasks.push(...this.generateDocumentationTasks(architecture, options));
        }
        // Generate deployment tasks
        tasks.push(...this.generateDeploymentTasks(architecture, options));
        // Add dependencies and priorities
        this.addTaskDependencies(tasks);
        this.setPriorities(tasks);
        log.info(`Generated ${tasks.length} tasks`);
        return tasks;
    }
    generateFoundationTasks(architecture, options) {
        const tasks = [
            {
                id: generateId(),
                title: 'Setup Project Structure',
                description: 'Initialize project with proper folder structure, configuration files, and basic setup',
                domain: 'setup',
                priority: 'high',
                estimatedEffort: 2,
                files: ['package.json', 'tsconfig.json', 'src/', 'README.md'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Configure Development Environment',
                description: 'Set up development tools, linting, formatting, and editor configuration',
                domain: 'setup',
                priority: 'high',
                estimatedEffort: 1,
                files: ['.eslintrc.js', '.prettierrc', '.vscode/settings.json', '.env.example'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup Database Schema',
                description: 'Design and implement database schema with migrations',
                domain: 'database',
                priority: 'high',
                estimatedEffort: 3,
                files: ['migrations/', 'models/', 'seeds/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement Authentication System',
                description: 'Create authentication middleware, JWT handling, and user sessions',
                domain: 'backend',
                priority: 'high',
                estimatedEffort: 4,
                files: ['auth/', 'middleware/auth.js', 'models/User.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup CI/CD Pipeline',
                description: 'Configure GitHub Actions for automated testing and deployment',
                domain: 'devops',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['.github/workflows/', 'docker-compose.yml', 'Dockerfile'],
                dependencies: [],
                status: 'pending'
            }
        ];
        return tasks;
    }
    generateComponentTasks(component, architecture, options) {
        const tasks = [];
        switch (component.type) {
            case 'auth':
                tasks.push(...this.generateAuthTasks(component, options));
                break;
            case 'users':
                tasks.push(...this.generateUserTasks(component, options));
                break;
            case 'api':
                tasks.push(...this.generateApiTasks(component, options));
                break;
            case 'frontend':
                tasks.push(...this.generateFrontendTasks(component, architecture, options));
                break;
            case 'database':
                tasks.push(...this.generateDatabaseTasks(component, options));
                break;
            case 'billing':
                tasks.push(...this.generateBillingTasks(component, options));
                break;
            case 'analytics':
                tasks.push(...this.generateAnalyticsTasks(component, options));
                break;
            default:
                tasks.push(...this.generateGenericComponentTasks(component, options));
        }
        return tasks;
    }
    generateAuthTasks(component, options) {
        return [
            {
                id: generateId(),
                title: 'Implement User Registration',
                description: 'Create user registration endpoint with validation and email verification',
                domain: 'backend',
                priority: 'high',
                estimatedEffort: 3,
                files: ['auth/register.js', 'validators/user.js', 'services/email.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement User Login',
                description: 'Create login endpoint with JWT token generation and session management',
                domain: 'backend',
                priority: 'high',
                estimatedEffort: 2,
                files: ['auth/login.js', 'auth/jwt.js', 'middleware/auth.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement Password Reset',
                description: 'Create password reset flow with email tokens and validation',
                domain: 'backend',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['auth/reset.js', 'services/email.js', 'models/PasswordReset.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create Auth Frontend Components',
                description: 'Build login, register, and password reset forms with validation',
                domain: 'frontend',
                priority: 'high',
                estimatedEffort: 4,
                files: ['components/auth/', 'hooks/useAuth.js', 'context/AuthContext.js'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateUserTasks(component, options) {
        return [
            {
                id: generateId(),
                title: 'Implement User Profile Management',
                description: 'Create user profile CRUD operations and profile page',
                domain: 'backend',
                priority: 'medium',
                estimatedEffort: 3,
                files: ['routes/users.js', 'models/User.js', 'controllers/user.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create User Profile UI',
                description: 'Build user profile page with edit functionality',
                domain: 'frontend',
                priority: 'medium',
                estimatedEffort: 3,
                files: ['pages/Profile.js', 'components/UserForm.js', 'hooks/useUser.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement User Roles and Permissions',
                description: 'Create role-based access control system',
                domain: 'backend',
                priority: 'medium',
                estimatedEffort: 4,
                files: ['middleware/rbac.js', 'models/Role.js', 'models/Permission.js'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateApiTasks(component, options) {
        return [
            {
                id: generateId(),
                title: 'Setup API Router and Middleware',
                description: 'Create main API router with error handling and logging middleware',
                domain: 'backend',
                priority: 'high',
                estimatedEffort: 2,
                files: ['routes/index.js', 'middleware/error.js', 'middleware/logger.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement API Validation',
                description: 'Add request validation middleware and schemas',
                domain: 'backend',
                priority: 'high',
                estimatedEffort: 2,
                files: ['middleware/validation.js', 'schemas/', 'validators/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup API Documentation',
                description: 'Configure Swagger/OpenAPI documentation',
                domain: 'backend',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['docs/swagger.yml', 'routes/docs.js', 'middleware/swagger.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement Rate Limiting',
                description: 'Add rate limiting middleware for API protection',
                domain: 'backend',
                priority: 'medium',
                estimatedEffort: 1,
                files: ['middleware/rateLimit.js', 'config/rateLimit.js'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateFrontendTasks(component, architecture, options) {
        const tasks = [
            {
                id: generateId(),
                title: 'Setup Frontend Build System',
                description: 'Configure Webpack, Vite, or similar build system with hot reloading',
                domain: 'frontend',
                priority: 'high',
                estimatedEffort: 2,
                files: ['webpack.config.js', 'vite.config.js', 'public/index.html'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup Frontend Router',
                description: 'Configure React Router or similar for navigation',
                domain: 'frontend',
                priority: 'high',
                estimatedEffort: 2,
                files: ['router/index.js', 'pages/', 'components/Layout.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement State Management',
                description: 'Setup Redux, Zustand, or Context API for state management',
                domain: 'frontend',
                priority: 'high',
                estimatedEffort: 3,
                files: ['store/', 'context/', 'hooks/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create UI Component Library',
                description: 'Build reusable UI components and styling system',
                domain: 'frontend',
                priority: 'medium',
                estimatedEffort: 5,
                files: ['components/ui/', 'styles/', 'theme/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Implement API Integration',
                description: 'Setup API client with error handling and loading states',
                domain: 'frontend',
                priority: 'high',
                estimatedEffort: 3,
                files: ['services/api.js', 'hooks/useApi.js', 'utils/http.js'],
                dependencies: [],
                status: 'pending'
            }
        ];
        return tasks;
    }
    generateDatabaseTasks(component, options) {
        return [
            {
                id: generateId(),
                title: 'Design Database Schema',
                description: 'Create comprehensive database schema with relationships',
                domain: 'database',
                priority: 'high',
                estimatedEffort: 4,
                files: ['schema.sql', 'migrations/', 'models/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup Database Migrations',
                description: 'Create migration system for schema changes',
                domain: 'database',
                priority: 'high',
                estimatedEffort: 2,
                files: ['migrations/', 'scripts/migrate.js', 'config/database.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create Database Seeders',
                description: 'Create seed data for development and testing',
                domain: 'database',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['seeds/', 'scripts/seed.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup Database Indexing',
                description: 'Optimize database performance with proper indexing',
                domain: 'database',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['migrations/indexes.sql', 'docs/indexing.md'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateBillingTasks(component, options) {
        return [
            {
                id: generateId(),
                title: 'Implement Subscription Management',
                description: 'Create subscription plans and management system',
                domain: 'backend',
                priority: 'high',
                estimatedEffort: 5,
                files: ['models/Subscription.js', 'services/billing.js', 'routes/billing.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Integrate Payment Gateway',
                description: 'Setup Stripe or similar payment processing',
                domain: 'backend',
                priority: 'high',
                estimatedEffort: 4,
                files: ['services/stripe.js', 'webhooks/stripe.js', 'models/Payment.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create Billing Dashboard',
                description: 'Build subscription and billing management UI',
                domain: 'frontend',
                priority: 'medium',
                estimatedEffort: 4,
                files: ['pages/Billing.js', 'components/billing/', 'hooks/useBilling.js'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateAnalyticsTasks(component, options) {
        return [
            {
                id: generateId(),
                title: 'Setup Analytics Tracking',
                description: 'Implement event tracking and analytics collection',
                domain: 'backend',
                priority: 'medium',
                estimatedEffort: 3,
                files: ['services/analytics.js', 'models/Event.js', 'middleware/tracking.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create Analytics Dashboard',
                description: 'Build dashboard for viewing analytics and metrics',
                domain: 'frontend',
                priority: 'low',
                estimatedEffort: 4,
                files: ['pages/Analytics.js', 'components/charts/', 'hooks/useAnalytics.js'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateGenericComponentTasks(component, options) {
        return [
            {
                id: generateId(),
                title: `Implement ${component.name} Component`,
                description: `Create ${component.name} functionality with proper error handling`,
                domain: component.type === 'frontend' ? 'frontend' : 'backend',
                priority: component.critical ? 'high' : 'medium',
                estimatedEffort: 3,
                files: [`${component.name.toLowerCase()}/`],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateTestingTasks(architecture, options) {
        return [
            {
                id: generateId(),
                title: 'Setup Testing Framework',
                description: 'Configure Jest, React Testing Library, and testing utilities',
                domain: 'testing',
                priority: 'high',
                estimatedEffort: 2,
                files: ['jest.config.js', 'setupTests.js', 'utils/testUtils.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Write Unit Tests',
                description: 'Create comprehensive unit tests for all components and functions',
                domain: 'testing',
                priority: 'high',
                estimatedEffort: 8,
                files: ['**/*.test.js', 'tests/unit/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Write Integration Tests',
                description: 'Create integration tests for API endpoints and user flows',
                domain: 'testing',
                priority: 'high',
                estimatedEffort: 6,
                files: ['tests/integration/', 'tests/api/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Write E2E Tests',
                description: 'Create end-to-end tests for critical user journeys',
                domain: 'testing',
                priority: 'medium',
                estimatedEffort: 4,
                files: ['tests/e2e/', 'playwright.config.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup Test Coverage',
                description: 'Configure code coverage reporting and enforcement',
                domain: 'testing',
                priority: 'medium',
                estimatedEffort: 1,
                files: ['jest.config.js', '.github/workflows/coverage.yml'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateDocumentationTasks(architecture, options) {
        return [
            {
                id: generateId(),
                title: 'Create API Documentation',
                description: 'Write comprehensive API documentation with examples',
                domain: 'documentation',
                priority: 'medium',
                estimatedEffort: 3,
                files: ['docs/api.md', 'docs/swagger.yml', 'examples/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Write User Guide',
                description: 'Create user documentation and tutorials',
                domain: 'documentation',
                priority: 'medium',
                estimatedEffort: 4,
                files: ['docs/user-guide.md', 'docs/tutorials/', 'docs/faq.md'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create Developer Documentation',
                description: 'Write setup and contribution guides for developers',
                domain: 'documentation',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['docs/development.md', 'docs/contributing.md', 'docs/architecture.md'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Update README',
                description: 'Create comprehensive README with setup instructions',
                domain: 'documentation',
                priority: 'high',
                estimatedEffort: 1,
                files: ['README.md', 'docs/quick-start.md'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    generateDeploymentTasks(architecture, options) {
        return [
            {
                id: generateId(),
                title: 'Setup Production Environment',
                description: 'Configure production server and environment variables',
                domain: 'devops',
                priority: 'high',
                estimatedEffort: 3,
                files: ['docker-compose.prod.yml', '.env.production', 'config/production.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Configure Monitoring',
                description: 'Setup application monitoring and alerting',
                domain: 'devops',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['monitoring/', 'config/monitoring.js', 'alerts/'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Setup SSL and Security',
                description: 'Configure HTTPS, security headers, and protection',
                domain: 'devops',
                priority: 'high',
                estimatedEffort: 2,
                files: ['config/ssl.js', 'middleware/security.js', 'config/cors.js'],
                dependencies: [],
                status: 'pending'
            },
            {
                id: generateId(),
                title: 'Create Backup Strategy',
                description: 'Implement database and file backup systems',
                domain: 'devops',
                priority: 'medium',
                estimatedEffort: 2,
                files: ['scripts/backup.js', 'config/backup.js', 'cron/backup.cron'],
                dependencies: [],
                status: 'pending'
            }
        ];
    }
    addTaskDependencies(tasks) {
        // Add logical dependencies between tasks
        const tasksByTitle = new Map(tasks.map(task => [task.title, task]));
        // Setup dependencies
        const setupTask = tasksByTitle.get('Setup Project Structure');
        const envTask = tasksByTitle.get('Configure Development Environment');
        if (setupTask && envTask) {
            envTask.dependencies.push(setupTask.id);
        }
        // Database dependencies
        const schemaTask = tasksByTitle.get('Setup Database Schema');
        const migrationsTask = tasksByTitle.get('Setup Database Migrations');
        if (schemaTask && migrationsTask) {
            migrationsTask.dependencies.push(schemaTask.id);
        }
        // Auth dependencies
        const authTask = tasksByTitle.get('Implement Authentication System');
        const loginTask = tasksByTitle.get('Implement User Login');
        if (authTask && loginTask) {
            loginTask.dependencies.push(authTask.id);
        }
        // Frontend dependencies
        const buildTask = tasksByTitle.get('Setup Frontend Build System');
        const routerTask = tasksByTitle.get('Setup Frontend Router');
        if (buildTask && routerTask) {
            routerTask.dependencies.push(buildTask.id);
        }
        // Testing dependencies
        const testFrameworkTask = tasksByTitle.get('Setup Testing Framework');
        const unitTestTask = tasksByTitle.get('Write Unit Tests');
        if (testFrameworkTask && unitTestTask) {
            unitTestTask.dependencies.push(testFrameworkTask.id);
        }
    }
    setPriorities(tasks) {
        // Adjust priorities based on task types and dependencies
        tasks.forEach(task => {
            if (task.domain === 'setup' || task.domain === 'database') {
                task.priority = 'high';
            }
            else if (task.domain === 'testing') {
                task.priority = 'high';
            }
            else if (task.domain === 'documentation') {
                task.priority = 'medium';
            }
            else if (task.domain === 'devops') {
                task.priority = 'medium';
            }
        });
    }
}
//# sourceMappingURL=task-generator.js.map