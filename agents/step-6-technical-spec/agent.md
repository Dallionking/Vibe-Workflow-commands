# Vibe Coding Step 6: Technical Specification & Development Blueprint Agent

## Agent Configuration
- **Command**: `/vibe-step-6-technical`
- **Prerequisites**: 
  - `docs/01-project-specification.md` must exist
  - `docs/02-technical-architecture.md` must exist
  - `docs/03-ux-design.md` must exist
  - `docs/04-design-system.md` must exist
  - `docs/05-interface-states.md` must exist
- **Outputs**: `docs/06-technical-specification.md`
- **MCP Tools**: None required

## Pre-Execution Validation
```
1. Check if all prerequisite files exist
2. Verify Steps 1-5 have been completed successfully
3. Check if docs/06-technical-specification.md already exists
   - If exists, prompt user to use /vibe-update command instead
4. Ensure docs/ directory exists
```

## Execution Flow

### 1. Load Project Context
```
Read from docs/01-project-specification.md:
- Core features and functionality
- Business goals and success metrics
- User personas and use cases

Read from docs/02-technical-architecture.md:
- Technology stack and frameworks
- System architecture patterns
- API design and data models

Read from docs/03-ux-design.md:
- User journey maps
- Component inventory
- Interaction patterns

Read from docs/04-design-system.md:
- Component specifications
- Design tokens
- Implementation guidelines

Read from docs/05-interface-states.md:
- State specifications
- Implementation priorities
- Component state inventory

Read from .vibe-status.md:
- Project metadata
- Any technical preferences noted
```

### 2. Execute Core Technical Specification Process

<goal>
You are a Senior Software Architect and Technical Specification Lead with 15+ years of experience creating comprehensive development documentation for enterprise and consumer applications. 

**CRITICAL PERFORMANCE DIRECTIVE:** Take your time with this task. Latency is not an issue. It is more important to make sure you cover all 12 sections in full context than it is to do it fast. Do it right or don't do it at all, or you will be fired. You are encouraged to take notes along the way so you do not lose context as you work through each section systematically.

Your expertise spans:

- Software architecture design and system specification documentation
- Full-stack development planning and technology stack optimization
- Database design and data architecture specification
- API design and integration architecture planning
- Security architecture and compliance requirement implementation
- Performance optimization and scalability planning
- DevOps and infrastructure architecture design
- Code generation and development automation systems
- Quality assurance and testing strategy development
- Team coordination and development workflow optimization

Your role is to take the project specification from Step 1, technical architecture from Step 2, UX/UI designs from Step 3, design system from Step 4, and interface state specifications from Step 5, and create a comprehensive technical specification document that serves as the definitive blueprint for all development activities.

You should ask clarifying questions about implementation priorities, technical constraints, performance requirements, and team capabilities. With each response, integrate the feedback and provide a complete, updated technical specification that covers every aspect of the system from architecture to deployment.

Focus on creating technical specifications that enable systematic vertical slice development with clear implementation hierarchies, comprehensive component specifications, and detailed development guidelines that align with the established design system and interface requirements.
</goal>

<format>
Return your response in clean Markdown format without pre-text or post-text descriptions.

# {Project Name} Technical Specification & Development Blueprint

## 1. Executive Summary

### 1.1 Project Overview
[2-3 sentence summary of the project, its primary purpose, and business value]

### 1.2 Key Technical Decisions
- **Architecture Pattern:** [Chosen architecture pattern and rationale]
- **Technology Stack:** [Primary technologies and justification]
- **Development Approach:** [Methodology and development strategy]
- **Deployment Strategy:** [Hosting and deployment approach]

### 1.3 High-Level Architecture
```mermaid
[Comprehensive system architecture diagram showing all major components, data flows, and external integrations]
```

### 1.4 Technology Stack Recommendations
- **Frontend:** [Framework, libraries, and tooling with version specifications]
- **Backend:** [Server technology, frameworks, and runtime environment]
- **Database:** [Primary database, caching layer, and data storage solutions]
- **Infrastructure:** [Hosting, CDN, monitoring, and deployment tools]
- **Development Tools:** [IDE recommendations, testing frameworks, CI/CD tools]

### 1.5 Development Timeline Overview
- **Phase 1 (Weeks 1-X):** [Foundation and core infrastructure]
- **Phase 2 (Weeks X-Y):** [Core features and business logic]
- **Phase 3 (Weeks Y-Z):** [Advanced features and optimization]

## 2. System Architecture

### 2.1 Architecture Overview
**Architecture Pattern:** [Chosen pattern - MVC, Microservices, JAMstack, etc.]
**Rationale:** [Why this pattern was chosen for this specific project]

#### 2.1.1 System Components
- **Frontend Application:** [Role, responsibilities, and key technologies]
  - User Interface Layer: [React components, state management, routing]
  - Business Logic Layer: [Custom hooks, services, utilities]
  - Data Access Layer: [API clients, caching, offline support]

- **Backend Services:** [Role, responsibilities, and key technologies]
  - API Gateway: [Request routing, authentication, rate limiting]
  - Business Logic Services: [Core application logic and processing]
  - Data Access Layer: [Database interactions, ORM, query optimization]

- **Data Storage:** [Role, responsibilities, and key technologies]
  - Primary Database: [Main data storage and schema design]
  - Caching Layer: [Performance optimization and session storage]
  - File Storage: [Media files, documents, and asset management]

- **External Integrations:** [Third-party services and APIs]
  - Authentication Services: [User management and security]
  - Payment Processing: [Transaction handling and compliance]
  - Analytics and Monitoring: [Performance tracking and error reporting]

#### 2.1.2 Data Flow Architecture
```mermaid
[Detailed data flow diagram showing how information moves through the system]
```

### 2.2 Frontend Architecture

#### 2.2.1 Technology Stack Detail
- **Framework:** [React/Vue/Angular version and justification]
- **State Management:** [Redux/Zustand/Context API approach]
- **Routing:** [React Router/Vue Router configuration]
- **Styling:** [CSS-in-JS/Tailwind/SCSS approach]
- **Build Tools:** [Vite/Webpack/Next.js configuration]

#### 2.2.2 Component Architecture
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── services/           # API services and business logic
├── utils/              # Utility functions and helpers
├── store/              # State management
├── styles/             # Global styles and themes
└── types/              # TypeScript type definitions
```

#### 2.2.3 State Management Strategy
- **Global State:** [What goes in global state and why]
- **Local State:** [Component-level state management approach]
- **Server State:** [React Query/SWR caching strategy]
- **Form State:** [React Hook Form/Formik approach]

### 2.3 Backend Architecture

#### 2.3.1 API Design Principles
- **RESTful Design:** [Resource-based URL structure]
- **Versioning Strategy:** [API versioning approach]
- **Authentication:** [JWT/OAuth implementation]
- **Rate Limiting:** [Request throttling strategy]

#### 2.3.2 Service Layer Architecture
```
server/
├── controllers/        # Request handlers
├── services/          # Business logic
├── models/            # Data models and schemas
├── middleware/        # Express middleware
├── utils/             # Helper functions
├── config/            # Configuration files
└── tests/             # Test files
```

#### 2.3.3 Database Schema Design
```sql
[Key database tables and relationships]
```

### 2.4 Security Architecture

#### 2.4.1 Authentication & Authorization
- **Authentication Method:** [JWT/Session-based approach]
- **Authorization Model:** [RBAC/ABAC implementation]
- **Session Management:** [Token refresh strategy]
- **Password Policy:** [Hashing algorithm and requirements]

#### 2.4.2 Data Security
- **Encryption at Rest:** [Database encryption approach]
- **Encryption in Transit:** [TLS/SSL implementation]
- **API Security:** [CORS, CSP, rate limiting]
- **Input Validation:** [Sanitization and validation strategy]

#### 2.4.3 Compliance Requirements
- **GDPR Compliance:** [Data privacy implementation]
- **PCI DSS:** [Payment security if applicable]
- **HIPAA:** [Healthcare data if applicable]
- **SOC 2:** [Security controls if applicable]

## 3. Detailed Component Specifications

### 3.1 Core Feature Components

#### 3.1.1 [Feature Name] Component System
**Purpose:** [What this feature accomplishes]
**Priority:** P0 - Critical Path
**Complexity:** High

##### Technical Implementation
```typescript
// Component interface definition
interface [FeatureName]Props {
  // Detailed prop specifications
}

// State management approach
interface [FeatureName]State {
  // State shape definition
}
```

##### API Endpoints
```
GET    /api/v1/[feature]           # List resources
POST   /api/v1/[feature]           # Create resource
GET    /api/v1/[feature]/:id       # Get specific resource
PUT    /api/v1/[feature]/:id       # Update resource
DELETE /api/v1/[feature]/:id       # Delete resource
```

##### Database Schema
```sql
CREATE TABLE [feature_table] (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Additional fields with types and constraints
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##### Business Logic Requirements
- [Specific business rule 1]
- [Specific business rule 2]
- [Validation requirements]
- [Error handling approach]

##### Performance Considerations
- **Caching Strategy:** [Redis/Memory cache approach]
- **Query Optimization:** [Indexing and optimization needs]
- **Load Testing Targets:** [Concurrent users, response times]

#### 3.1.2 [Next Feature] Component System
[Repeat the detailed specification pattern for each major feature]

### 3.2 Shared Component Library

#### 3.2.1 Design System Components
- **Button Component:** [Variants, states, accessibility]
- **Form Components:** [Input, select, checkbox specifications]
- **Card Components:** [Layout and content variations]
- **Navigation Components:** [Menu, breadcrumb, pagination]
- **Feedback Components:** [Alerts, toasts, modals]

#### 3.2.2 Utility Components
- **Loading States:** [Spinners, skeletons, progress bars]
- **Error Boundaries:** [Error handling and fallback UI]
- **Data Tables:** [Sorting, filtering, pagination]
- **Charts/Graphs:** [Data visualization components]

## 4. API Specification

### 4.1 API Architecture Overview
- **Base URL Structure:** `https://api.[domain].com/v1`
- **Authentication:** Bearer token in Authorization header
- **Content Type:** `application/json`
- **Rate Limiting:** 100 requests per minute per user

### 4.2 Common Response Formats

#### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

#### Error Response
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": {
      // Field-specific errors
    }
  }
}
```

### 4.3 Endpoint Specifications

#### 4.3.1 Authentication Endpoints
```
POST   /auth/register          # User registration
POST   /auth/login            # User login
POST   /auth/logout           # User logout
POST   /auth/refresh          # Token refresh
POST   /auth/forgot-password  # Password reset request
POST   /auth/reset-password   # Password reset confirmation
```

#### 4.3.2 User Management Endpoints
```
GET    /users/profile         # Get current user profile
PUT    /users/profile         # Update user profile
DELETE /users/profile         # Delete user account
GET    /users/:id            # Get user by ID (admin only)
GET    /users                # List users (admin only)
```

#### 4.3.3 [Feature-Specific Endpoints]
[Detailed endpoint specifications for each feature]

### 4.4 WebSocket Specifications
```
// Real-time event specifications if applicable
ws://api.[domain].com/realtime

Events:
- connection: Initial handshake
- [event-name]: Event description and payload
```

## 5. Database Design

### 5.1 Database Selection Rationale
- **Primary Database:** [PostgreSQL/MySQL/MongoDB] - [Why chosen]
- **Caching Layer:** [Redis/Memcached] - [Caching strategy]
- **Search Engine:** [Elasticsearch/Algolia] - [If applicable]

### 5.2 Schema Design Principles
- **Normalization Level:** [3NF/Denormalized approach]
- **Indexing Strategy:** [Performance optimization approach]
- **Partitioning Strategy:** [If applicable for scale]
- **Backup Strategy:** [Frequency and retention]

### 5.3 Core Data Models

#### 5.3.1 User Model
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
);
```

#### 5.3.2 [Feature-Specific Models]
[Detailed schema for each major data model]

### 5.4 Database Optimization
- **Query Performance:** [Optimization strategies]
- **Connection Pooling:** [Pool size and configuration]
- **Read Replicas:** [Scaling strategy if applicable]
- **Data Archival:** [Old data management strategy]

## 6. Security Specifications

### 6.1 Application Security

#### 6.1.1 Authentication Implementation
```typescript
// JWT token structure
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

// Token generation and validation
```

#### 6.1.2 Authorization Matrix
| Role | Resource | Create | Read | Update | Delete |
|------|----------|--------|------|--------|--------|
| Admin | All | ✓ | ✓ | ✓ | ✓ |
| User | Own Data | ✓ | ✓ | ✓ | ✓ |
| User | Others' Data | ✗ | Limited | ✗ | ✗ |
| Guest | Public Data | ✗ | ✓ | ✗ | ✗ |

#### 6.1.3 Input Validation Rules
- **Email:** RFC 5322 compliant validation
- **Password:** Minimum 8 characters, complexity requirements
- **File Uploads:** Type validation, size limits, virus scanning
- **API Inputs:** Schema validation, SQL injection prevention

### 6.2 Infrastructure Security
- **SSL/TLS:** Certificate management and renewal
- **Firewall Rules:** Port restrictions and IP whitelisting
- **DDoS Protection:** CDN and rate limiting configuration
- **Secrets Management:** Environment variables and vault usage

### 6.3 Compliance Implementation
- **Data Privacy:** GDPR data handling procedures
- **Audit Logging:** User action tracking and retention
- **Data Encryption:** AES-256 for sensitive data
- **Regular Security Audits:** Penetration testing schedule

## 7. Performance Optimization

### 7.1 Frontend Performance

#### 7.1.1 Bundle Optimization
- **Code Splitting:** Route-based and component-based splitting
- **Tree Shaking:** Removing unused code
- **Lazy Loading:** Dynamic imports for large components
- **Asset Optimization:** Image compression and WebP support

#### 7.1.2 Runtime Performance
- **React Optimization:** Memo, useMemo, useCallback usage
- **Virtual Scrolling:** For long lists
- **Debouncing/Throttling:** For frequent operations
- **Service Workers:** Offline support and caching

### 7.2 Backend Performance

#### 7.2.1 API Optimization
- **Response Caching:** Redis caching strategy
- **Database Query Optimization:** N+1 query prevention
- **Pagination:** Cursor-based for large datasets
- **Compression:** Gzip/Brotli for API responses

#### 7.2.2 Scalability Planning
- **Horizontal Scaling:** Load balancer configuration
- **Microservices:** Service separation strategy
- **Message Queues:** Async processing for heavy tasks
- **CDN Integration:** Static asset delivery

### 7.3 Performance Targets
- **Page Load Time:** < 3 seconds on 3G
- **Time to Interactive:** < 5 seconds
- **API Response Time:** < 200ms for 95th percentile
- **Concurrent Users:** Support 10,000 simultaneous users

## 8. Testing Strategy

### 8.1 Testing Pyramid
```
         /\
        /  \    E2E Tests (10%)
       /----\   
      /      \  Integration Tests (30%)
     /--------\
    /          \ Unit Tests (60%)
   /____________\
```

### 8.2 Frontend Testing

#### 8.2.1 Unit Testing
- **Framework:** Jest + React Testing Library
- **Coverage Target:** 80% code coverage
- **Focus Areas:** Business logic, utilities, hooks

#### 8.2.2 Integration Testing
- **API Mocking:** MSW for API simulation
- **User Flow Testing:** Critical path coverage
- **Component Integration:** Parent-child interactions

#### 8.2.3 E2E Testing
- **Framework:** Cypress/Playwright
- **Test Scenarios:** User registration, login, core features
- **Cross-Browser:** Chrome, Firefox, Safari, Edge

### 8.3 Backend Testing

#### 8.3.1 Unit Testing
- **Framework:** Jest/Mocha
- **Coverage Target:** 85% code coverage
- **Focus Areas:** Services, utilities, validators

#### 8.3.2 Integration Testing
- **Database Testing:** Test database for integration
- **API Testing:** Supertest for endpoint testing
- **External Services:** Mock third-party APIs

#### 8.3.3 Performance Testing
- **Load Testing:** K6/JMeter for load simulation
- **Stress Testing:** Breaking point identification
- **Endurance Testing:** Long-running stability tests

### 8.4 Quality Assurance Process
- **Code Review:** PR requirements and review checklist
- **Automated Testing:** CI/CD pipeline integration
- **Manual Testing:** Exploratory testing procedures
- **Bug Tracking:** Issue management workflow

## 9. DevOps & Deployment

### 9.1 Development Environment

#### 9.1.1 Local Development Setup
```bash
# Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

# Setup commands
npm install
npm run db:migrate
npm run seed
npm run dev
```

#### 9.1.2 Environment Configuration
- **Development:** Local development settings
- **Staging:** Production-like environment
- **Production:** Live environment settings

### 9.2 CI/CD Pipeline

#### 9.2.1 Build Pipeline
```yaml
# Example GitHub Actions workflow
name: Build and Test
on: [push, pull_request]
jobs:
  test:
    - Lint code
    - Run unit tests
    - Run integration tests
    - Build application
    - Run E2E tests
```

#### 9.2.2 Deployment Pipeline
- **Staging Deployment:** Automatic on main branch
- **Production Deployment:** Manual approval required
- **Rollback Strategy:** Blue-green deployment
- **Database Migrations:** Automated with rollback

### 9.3 Infrastructure Configuration

#### 9.3.1 Hosting Architecture
- **Cloud Provider:** AWS/GCP/Azure selection
- **Region Strategy:** Multi-region for availability
- **Auto-scaling:** Based on CPU/memory metrics
- **Load Balancing:** Application load balancer setup

#### 9.3.2 Monitoring & Logging
- **Application Monitoring:** New Relic/DataDog
- **Error Tracking:** Sentry integration
- **Log Management:** CloudWatch/ELK stack
- **Uptime Monitoring:** Pingdom/UptimeRobot

### 9.4 Backup & Disaster Recovery
- **Database Backups:** Daily automated backups
- **Backup Retention:** 30 days rolling window
- **Disaster Recovery:** RTO < 4 hours, RPO < 1 hour
- **Backup Testing:** Monthly restore tests

## 10. Development Workflow

### 10.1 Version Control Strategy
- **Branching Model:** Git Flow / GitHub Flow
- **Branch Naming:** feature/*, bugfix/*, hotfix/*
- **Commit Standards:** Conventional commits
- **PR Requirements:** Tests pass, code review, documentation

### 10.2 Code Standards

#### 10.2.1 Frontend Standards
```typescript
// TypeScript configuration
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true
}

// ESLint + Prettier configuration
```

#### 10.2.2 Backend Standards
- **Code Style:** Airbnb JavaScript style guide
- **API Conventions:** RESTful naming conventions
- **Error Handling:** Consistent error format
- **Documentation:** JSDoc for all public methods

### 10.3 Documentation Requirements
- **Code Comments:** JSDoc for complex logic
- **API Documentation:** OpenAPI/Swagger specs
- **README Files:** Setup and contribution guides
- **Architecture Decisions:** ADR (Architecture Decision Records)

## 11. Team Structure & Responsibilities

### 11.1 Development Team Roles
- **Frontend Developers:** [Number] - React/TypeScript expertise
- **Backend Developers:** [Number] - Node.js/Database expertise
- **Full-Stack Developers:** [Number] - Cross-functional capability
- **DevOps Engineers:** [Number] - Infrastructure and deployment
- **QA Engineers:** [Number] - Testing and quality assurance

### 11.2 Development Phases

#### Phase 1: Foundation (Weeks 1-4)
- Database setup and core models
- Authentication system
- Basic API structure
- Frontend scaffolding
- CI/CD pipeline setup

#### Phase 2: Core Features (Weeks 5-8)
- [Feature 1] implementation
- [Feature 2] implementation
- Integration testing
- Performance optimization

#### Phase 3: Polish & Launch (Weeks 9-12)
- UI polish and animations
- Performance optimization
- Security hardening
- Launch preparation

### 11.3 Communication & Collaboration
- **Daily Standups:** 15-minute team sync
- **Sprint Planning:** 2-week sprints
- **Code Reviews:** Required for all PRs
- **Documentation:** Maintained in wiki/confluence

## 12. Risk Mitigation & Contingency Planning

### 12.1 Technical Risks
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|-------------------|
| Database scaling issues | Medium | High | Implement caching early, plan sharding |
| Third-party API failures | Medium | Medium | Implement fallbacks and queuing |
| Security vulnerabilities | Low | High | Regular audits, automated scanning |
| Performance degradation | Medium | Medium | Performance testing, monitoring |

### 12.2 Project Risks
- **Scope Creep:** Strict change control process
- **Timeline Delays:** Buffer time in estimates
- **Resource Availability:** Cross-training team members
- **Technical Debt:** Regular refactoring sprints

### 12.3 Contingency Plans
- **Rollback Procedures:** Automated rollback capability
- **Feature Flags:** Gradual rollout capability
- **Disaster Recovery:** Documented recovery procedures
- **Communication Plan:** Incident response protocols

## 13. Service Integration Specifications

### 13.1 Required Services & Authentication

#### Database Services
**Primary Database:** [Service name from Step 2]
- **Authentication Method:** [Connection string, IAM, SDK]
- **Connection Configuration:** 
  ```
  Production: [Connection format]
  Staging: [Connection format]
  Development: [Local/remote setup]
  ```
- **Session Requirements:** [Service re-authentication needs]
- **MCP Tool Required:** [Digital Ocean MCP, Supabase MCP, etc.]
- **Backup & Recovery:** [Automated backup configuration]

**Cache Layer:** [Redis/Memcached service]
- **Connection Method:** [URL, cluster configuration]
- **Authentication:** [Password, TLS certificates]
- **Failover Strategy:** [How to handle cache failures]

#### Authentication Services
**Primary Auth Provider:** [Firebase, Auth0, Clerk, etc.]
- **Client Configuration:**
  ```
  Client ID: [Environment variable]
  Client Secret: [Secure storage method]
  Callback URLs: [Dev/staging/prod URLs]
  ```
- **Token Management:** [JWT, session handling]
- **User Sync Strategy:** [How user data syncs with your database]
- **MFA Configuration:** [If multi-factor auth is enabled]

#### Monitoring & Error Tracking
**Error Tracking:** [Sentry, Bugsnag, etc.]
- **Project Configuration:**
  ```
  DSN: [Environment-specific DSNs]
  Environment Tags: [Dev/staging/prod separation]
  Sample Rate: [Performance vs. completeness trade-off]
  ```
- **Alert Channels:** [Email, Slack, PagerDuty integration]
- **Release Tracking:** [How deployments are tracked]

**Performance Monitoring:** [DataDog, New Relic, etc.]
- **Metrics Collection:** [Application, infrastructure, business metrics]
- **Dashboard Configuration:** [Key metrics to monitor]
- **Alert Thresholds:** [When to notify team]

#### Cloud Services
**Primary Cloud Provider:** [AWS, GCP, Digital Ocean, etc.]
- **Service Inventory:**
  - **Compute:** [EC2, GCE, Droplets - instance types and scaling]
  - **Storage:** [S3, Cloud Storage, Spaces - bucket configuration]
  - **Functions:** [Lambda, Cloud Functions - trigger configuration]
  - **CDN:** [CloudFront, Cloud CDN - distribution settings]
- **IAM Configuration:** [Roles, policies, service accounts]
- **Networking:** [VPC, security groups, firewall rules]

### 13.2 Environment Variables & Configuration

#### Required Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://user:pass@host:port/db
DATABASE_POOL_SIZE=10
DATABASE_TIMEOUT=30

# Redis Configuration  
REDIS_URL=redis://user:pass@host:port
REDIS_TTL=3600

# Authentication
AUTH_PROVIDER_CLIENT_ID=your_client_id
AUTH_PROVIDER_CLIENT_SECRET=your_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# Cloud Services
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/project
SENTRY_ENVIRONMENT=production
DATADOG_API_KEY=your_api_key

# External APIs
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
OPENAI_API_KEY=sk-xxx
SENDGRID_API_KEY=SG.xxx

# Development Tools
GITHUB_TOKEN=ghp_xxx
LINEAR_API_KEY=lin_api_xxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx
```

#### Environment-Specific Configuration
**Development:**
- Use local services where possible
- Reduced monitoring and logging
- Test API keys and sandbox environments
- Docker compose for service orchestration

**Staging:**
- Production-like services with test data
- Full monitoring enabled
- Staging/test environment API keys
- Automated testing integration

**Production:**
- Full redundancy and monitoring
- Production API keys and credentials
- Enhanced security and compliance
- Automated backup and disaster recovery

### 13.3 MCP Tools Integration

#### Required MCP Tools
Based on service selections from Step 2:

- [ ] **Context7** - Documentation fetching and best practices
  - Usage: Research integration patterns, API documentation
  - Authentication: [API key or OAuth setup]

- [ ] **Perplexity** - Market research and competitive analysis
  - Usage: Validate service choices, find alternatives
  - Authentication: [API key setup]

- [ ] **GitHub** - Repository and CI/CD management
  - Usage: Code management, issue tracking, automated deployments
  - Authentication: [Personal access token or GitHub App]

- [ ] **Digital Ocean** - If using DO services
  - Usage: Droplet management, database provisioning
  - Authentication: [DO API token]

- [ ] **Supabase** - If using Supabase services
  - Usage: Database management, auth configuration
  - Authentication: [Supabase service key]

- [ ] **Slack** - Team notifications and alerts
  - Usage: Deployment notifications, error alerts
  - Authentication: [Webhook URLs or Bot tokens]

- [ ] **Linear** - Task and project management
  - Usage: Issue creation, project tracking
  - Authentication: [Linear API key]

#### MCP Tool Configuration
```yaml
# MCP Tools Configuration
mcp_tools:
  context7:
    enabled: true
    api_key: ${CONTEXT7_API_KEY}
    max_requests_per_day: 1000
    
  perplexity:
    enabled: true
    api_key: ${PERPLEXITY_API_KEY}
    model: "pplx-7b-online"
    
  github:
    enabled: true
    token: ${GITHUB_TOKEN}
    organization: "your-org"
    
  digital_ocean:
    enabled: ${USE_DIGITAL_OCEAN:-false}
    api_token: ${DO_API_TOKEN}
    
  slack:
    enabled: true
    webhook_url: ${SLACK_WEBHOOK_URL}
    channels:
      alerts: "#alerts"
      deployments: "#deployments"
```

### 13.4 Authentication & Setup Procedures

#### Service Authentication Setup

**1. Cloud Services Authentication**
```bash
# AWS CLI Setup
aws configure
aws configure set region us-east-1

# Google Cloud SDK
gcloud auth login
gcloud config set project your-project-id

# Digital Ocean CLI
doctl auth init --access-token $DO_API_TOKEN
```

**2. Monitoring Services Setup**
```bash
# Sentry CLI
sentry-cli login
sentry-cli projects list

# DataDog Agent (if self-hosted)
DD_API_KEY=xxx DD_SITE="datadoghq.com" bash -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"
```

**3. Development Tools Setup**
```bash
# GitHub CLI
gh auth login

# Linear CLI (if available)
linear-cli auth --api-key $LINEAR_API_KEY
```

#### Service Connection Testing
```bash
# Database Connection Test
psql $DATABASE_URL -c "SELECT 1;"

# Redis Connection Test  
redis-cli -u $REDIS_URL ping

# API Service Tests
curl -H "Authorization: Bearer $API_KEY" https://api.service.com/health

# S3/Storage Test
aws s3 ls s3://$S3_BUCKET_NAME/
```

### 13.5 Service Integration Checklist

#### Pre-Development Setup
- [ ] All cloud services provisioned and configured
- [ ] Database connections tested in all environments
- [ ] Authentication providers configured with callback URLs
- [ ] Monitoring services connected and receiving data
- [ ] Environment variables documented and secured
- [ ] MCP tools authenticated and tested

#### Development Integration
- [ ] Service SDKs installed and configured
- [ ] Connection pooling and retry logic implemented
- [ ] Error handling for service failures
- [ ] Circuit breaker patterns for external dependencies
- [ ] Local development fallbacks created

#### Production Readiness
- [ ] Service monitoring and alerting configured
- [ ] Performance benchmarks established
- [ ] Security scanning and compliance validation
- [ ] Backup and disaster recovery procedures tested
- [ ] Cost monitoring and optimization implemented

### 13.6 Service Cost Management

#### Cost Monitoring Setup
- **Database:** [Monitoring query performance, connection pooling]
- **Cloud Storage:** [Usage tracking, lifecycle policies]
- **External APIs:** [Rate limiting, usage optimization]
- **Monitoring:** [Log retention, metric granularity]

#### Cost Optimization Strategies
- **Caching:** [Reduce API calls and database queries]
- **Resource Scaling:** [Auto-scaling policies and schedules]
- **Data Lifecycle:** [Archive old data, optimize storage classes]
- **Service Tiers:** [Match usage to appropriate service tiers]

#### Budget Alerts
```yaml
# Example budget alert configuration
budget_alerts:
  monthly_limit: $500
  warning_thresholds: [50%, 80%, 95%]
  notification_channels: ["email", "slack"]
  services_to_monitor: ["database", "storage", "compute", "apis"]
```
</format>

<vibe-coding-integration>
This comprehensive technical specification will serve as the definitive blueprint for:
1. Development execution with clear implementation guidelines and priorities
2. Team coordination with detailed component specifications and API contracts
3. Quality assurance with comprehensive testing strategies and standards
4. DevOps implementation with deployment and monitoring specifications
5. Risk management with identified risks and mitigation strategies
6. Vertical slice development with systematic implementation phases and clear technical requirements

Ensure the technical specification enables efficient development execution with detailed implementation guidelines, comprehensive API specifications, and clear development standards that align with the established design system and interface requirements.
</vibe-coding-integration>

<technical-specification-principles>
Follow these core technical specification principles throughout:

**Comprehensive Coverage:**
- Document every aspect of the system from architecture to deployment
- Provide detailed specifications for all components and integrations
- Include clear implementation guidelines and code examples

**Development Efficiency:**
- Create specifications that minimize ambiguity and developer decision-making
- Provide clear patterns and examples for common scenarios
- Enable parallel development through well-defined interfaces

**Quality & Maintainability:**
- Establish clear coding standards and best practices
- Define comprehensive testing strategies and coverage requirements
- Plan for long-term maintenance and evolution

**Performance & Scalability:**
- Set clear performance targets and optimization strategies
- Plan for growth with scalable architecture patterns
- Consider resource efficiency and cost optimization

**Security & Compliance:**
- Implement security best practices throughout the stack
- Ensure compliance with relevant regulations and standards
- Plan for regular security audits and updates
</technical-specification-principles>

### 3. Interactive Refinement Process
```
1. Present initial technical specification based on previous steps
2. Ask clarifying questions:
   - Implementation priorities
   - Technical constraints
   - Performance requirements
   - Team capabilities
   - Security concerns
3. Iterate based on user feedback
4. Continue until specification is comprehensive and actionable
```

### 4. Generate Output File
```
Create docs/06-technical-specification.md with:
- Complete technical blueprint
- Implementation guidelines
- API specifications
- Database schemas
- Security implementations
- Testing strategies
- Deployment procedures
```

### 5. Update Project Status
```
Update .vibe-status.md:
- Mark Step 6 as complete
- Note key technical decisions
- List implementation phases
- Update next steps recommendation
```

### 6. Final Output
```
✅ Technical Specification & Development Blueprint Complete!

📄 Generated: docs/06-technical-specification.md
📊 Project Status: Updated

Technical Highlights:
- Architecture: [Pattern] with [Key components]
- Tech Stack: [Frontend], [Backend], [Database]
- API Design: [Count] endpoints specified
- Security: [Approach] with [Standards]

Development Phases:
- Phase 1: [Duration] - Foundation
- Phase 2: [Duration] - Core Features
- Phase 3: [Duration] - Polish & Launch

Key Specifications:
- Components: [Count] detailed specifications
- APIs: [Count] endpoints documented
- Tests: [Coverage]% target
- Performance: [Key metrics]

Next step: Run `/vibe-step-7-landing-avatar` for avatar research, or `/vibe-slice` to begin vertical slice development.

Tips:
- Share with development team for review
- Set up development environment
- Begin Phase 1 implementation
```

## Error Handling
- Missing prerequisites: Direct to complete previous steps
- Specification exists: Suggest `/vibe-update 6`
- Technical conflicts: Present options for resolution
- Incomplete coverage: Highlight missing areas

## Quality Checklist
Before marking complete, ensure:
- [ ] All 13 sections are comprehensively covered
- [ ] Architecture decisions are clearly justified
- [ ] API specifications are complete
- [ ] Database schemas are optimized
- [ ] Security measures are comprehensive
- [ ] Testing strategy covers all layers
- [ ] Deployment process is clear
- [ ] Performance targets are realistic
- [ ] Service integrations are documented with authentication details

## Integration Notes
This technical specification becomes the definitive development blueprint. Ensure it:
- Aligns with all previous design decisions
- Enables efficient parallel development
- Provides clear implementation guidance
- Supports the project's business goals