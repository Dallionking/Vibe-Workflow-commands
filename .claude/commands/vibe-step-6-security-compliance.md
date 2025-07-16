---
description: Create security architecture and compliance framework
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - mcp__perplexity-mcp__perplexity_search_web
  - mcp__perplexity-ask__perplexity_ask
  - mcp__sequential-thinking__sequentialthinking
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
---

# vibe-step-6-security-compliance

Create security architecture and compliance framework

# Step 6.4: Security Architecture & Compliance

## Agent Configuration
- **Command**: `/vibe-step-6-security-compliance`
- **Description**: Create comprehensive security architecture and compliance framework
- **Prerequisites**: Steps 6.1-6.3 (Feature Analysis, API Design, Database Schema) must be completed
- **Outputs**: Section 6 of technical specification with complete security architecture
- **MCP Tools**: Context7, Perplexity, Sequential Thinking

## Role & Background
**Senior Security Architect and Compliance Engineer**: 15+ years experience at major tech companies (Google, Microsoft, Amazon, Stripe) specializing in application security, data protection, compliance frameworks (GDPR, HIPAA, SOC 2), threat modeling, penetration testing, and security-by-design architecture. Expert in OAuth 2.0, JWT security, encryption strategies, API security, and security monitoring systems.

## Agent Purpose
This sub-agent creates comprehensive security architecture covering authentication, authorization, data protection, compliance requirements, and security monitoring. It integrates with the feature specifications, API design, and database schema to ensure security is built into every layer of the application.

## Execution Flow

### 1. Read Previous Sub-Agent Outputs (MANDATORY)

```
CRITICAL: Before security design, read these outputs:
1. Section 3.X: All feature specifications with security requirements (Section 3.X.3)
2. Section 4: API specifications with authentication and authorization patterns
3. Section 5: Database schema with data sensitivity analysis
4. docs/01-project-specification.md: Business requirements and compliance needs
5. docs/02-technical-architecture.md: Infrastructure and deployment security context
```

### 2. Security Requirements Analysis

#### Step 1: Identify Security Domains
```
SECURITY DOMAINS TO ANALYZE:
- Authentication and Identity Management
- Authorization and Access Control
- Data Protection and Encryption
- API Security and Rate Limiting
- Infrastructure and Network Security
- Application Security (XSS, CSRF, SQL Injection)
- Privacy and Compliance (GDPR, CCPA, HIPAA)
- Monitoring and Incident Response
- Security Testing and Vulnerability Management

COMPLIANCE REQUIREMENTS:
- Geographic regulations (GDPR, CCPA, local privacy laws)
- Industry standards (PCI DSS, HIPAA, SOC 2)
- Security frameworks (OWASP, NIST, ISO 27001)
- Data residency and sovereignty requirements
```

#### Step 2: Threat Modeling
```
THREAT ANALYSIS PER FEATURE:
For each feature from Section 3.X:
- Data classification (public, internal, confidential, restricted)
- Attack vectors and threat scenarios
- Risk assessment and impact analysis
- Mitigation strategies and security controls
- User access patterns and permission requirements

COMMON THREAT VECTORS:
- Unauthorized access and privilege escalation
- Data breaches and information disclosure
- Injection attacks (SQL, XSS, CSRF)
- Authentication and session attacks
- API abuse and rate limiting bypass
- Data tampering and integrity violations
```

### 3. Authentication & Authorization Architecture

#### Section 6: Security Architecture & Compliance

```markdown
## 6. Security Architecture & Compliance

### 6.1 Authentication & Authorization Architecture

#### 6.1.1 Authentication Strategy
**Primary Authentication:** JWT-based authentication with RS256 signing
**Token Lifecycle:**
- Access Token: 1 hour expiration, contains user identity and permissions
- Refresh Token: 30 days expiration, stored securely, single-use rotation
- Session Management: Server-side session tracking with Redis storage
- Token Revocation: Immediate invalidation on logout or security events

**Authentication Flows:**
```javascript
// Standard login flow
POST /auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "rt_secure_random_string",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["user"],
    "permissions": ["read:profile", "write:profile"]
  }
}
```

**Multi-Factor Authentication (MFA):**
- TOTP (Time-based One-Time Password) using Google Authenticator/Authy
- SMS backup codes for account recovery
- Hardware token support (YubiKey) for high-security accounts
- Admin accounts require MFA enforcement

**Social Authentication Integration:**
- OAuth 2.0 with Google, GitHub, Microsoft
- OpenID Connect for enterprise SSO integration
- Account linking for users with multiple authentication methods
- Secure token exchange and profile mapping

#### 6.1.2 Authorization Framework
**Permission Model:** Feature-based Role-Based Access Control (RBAC)
```sql
-- Permission structure
{
  "user_id": "uuid",
  "roles": ["admin", "editor", "viewer"],
  "permissions": [
    "feature:user_profile:read",
    "feature:user_profile:write",
    "feature:content_creation:read",
    "feature:content_creation:write",
    "feature:analytics:read",
    "admin:user_management:all"
  ],
  "feature_flags": {
    "advanced_analytics": true,
    "beta_features": false
  }
}
```

**Role Definitions:**
- **Super Admin:** Full system access, user management, security configuration
- **Admin:** Feature administration, user role management, content moderation
- **Editor:** Content creation and editing, limited user interaction features
- **User:** Standard user permissions based on subscription tier
- **Viewer:** Read-only access to public and shared content

**Feature-Level Permissions:**
[For each feature from Section 3.X, define specific permissions]
- `feature:{feature_name}:read` - View feature content
- `feature:{feature_name}:write` - Create/edit feature content
- `feature:{feature_name}:delete` - Remove feature content
- `feature:{feature_name}:admin` - Administrative access to feature

#### 6.1.3 API Authorization
**Middleware Implementation:**
```javascript
// Authorization middleware for each endpoint
const authorize = (permissions) => {
  return async (req, res, next) => {
    const token = extractBearerToken(req.headers.authorization);
    const payload = await verifyJWT(token);
    const userPermissions = await getUserPermissions(payload.user_id);
    
    if (!hasRequiredPermissions(userPermissions, permissions)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: permissions,
        granted: userPermissions
      });
    }
    
    req.user = payload;
    req.permissions = userPermissions;
    next();
  };
};

// Usage in API routes
app.get('/api/users/:id', 
  authorize(['feature:user_profile:read']), 
  getUserProfile
);
```

**Resource-Level Authorization:**
- User can only access their own data unless explicitly granted access
- Team-based access for collaborative features
- Organization-level permissions for enterprise features
- Temporary access grants with expiration dates
```

### 4. Data Protection & Encryption

#### Section 6.2: Data Protection Strategy
```markdown
### 6.2 Data Protection & Encryption

#### 6.2.1 Data Classification
**Public Data:** Non-sensitive information available to all users
- User public profiles, published content, feature descriptions
- No encryption required, standard access controls apply

**Internal Data:** Business information restricted to authorized users
- User analytics, system metrics, feature usage statistics
- Application-level access controls, audit logging required

**Confidential Data:** Sensitive user information requiring protection
- User email addresses, names, payment information
- Database column-level encryption, restricted access logging

**Restricted Data:** Highly sensitive information requiring maximum protection
- Authentication credentials, payment tokens, personal identification
- Field-level encryption with hardware security modules (HSM)

#### 6.2.2 Encryption Implementation
**Encryption at Rest:**
```sql
-- Database encryption for sensitive columns
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypted user data
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    encrypted_email BYTEA, -- AES-256 encrypted
    encrypted_phone BYTEA, -- AES-256 encrypted
    encrypted_address JSONB, -- Application-level encryption
    
    -- Encryption metadata
    encryption_key_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Encryption functions
CREATE OR REPLACE FUNCTION encrypt_pii(data TEXT, key_id TEXT)
RETURNS BYTEA AS $$
BEGIN
    -- Integration with key management service
    RETURN pgp_sym_encrypt(data, get_encryption_key(key_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Encryption in Transit:**
- TLS 1.3 for all API communications
- Certificate pinning for mobile applications
- HSTS headers for web applications
- End-to-end encryption for sensitive data exchanges

**Key Management:**
- AWS KMS / Google Cloud KMS for encryption key storage
- Key rotation every 90 days for active keys
- Hardware Security Module (HSM) for production key storage
- Separate keys per environment (development, staging, production)

#### 6.2.3 Data Privacy & Compliance
**GDPR Compliance Implementation:**
- User consent tracking and management
- Right to access: User data export functionality
- Right to rectification: User profile editing capabilities
- Right to erasure: Hard delete functionality with audit trails
- Data portability: Structured data export in common formats
- Privacy by design: Default privacy settings and minimal data collection

**Data Retention Policies:**
```sql
-- Automated data retention enforcement
CREATE OR REPLACE FUNCTION enforce_data_retention()
RETURNS VOID AS $$
BEGIN
    -- Delete user sessions older than 30 days
    DELETE FROM user_sessions 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Archive user data for deleted accounts after 90 days
    UPDATE users 
    SET archived_data = encrypted_user_data,
        email = '[REDACTED]',
        first_name = '[REDACTED]',
        last_name = '[REDACTED]'
    WHERE deleted_at < CURRENT_TIMESTAMP - INTERVAL '90 days'
    AND archived_data IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Schedule retention policy execution
SELECT cron.schedule('data-retention', '0 2 * * *', 'SELECT enforce_data_retention();');
```
```

### 5. Application Security Controls

#### Section 6.3: Application Security
```markdown
### 6.3 Application Security Controls

#### 6.3.1 Input Validation & Sanitization
**API Input Validation:**
```javascript
// Comprehensive input validation middleware
const validateInput = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false
    });
    
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      });
    }
    
    req.validatedBody = value;
    next();
  };
};

// Input sanitization for XSS prevention
const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};
```

**SQL Injection Prevention:**
- Parameterized queries exclusively (no string concatenation)
- ORM usage with prepared statements
- Stored procedures for complex database operations
- Database user permissions limited to necessary operations only

**XSS Prevention:**
- Content Security Policy (CSP) headers
- Output encoding for all user-generated content
- DOM purification for rich text content
- Secure cookie configuration (HttpOnly, Secure, SameSite)

#### 6.3.2 CSRF Protection
**CSRF Token Implementation:**
```javascript
// CSRF token generation and validation
const csrfProtection = require('csurf')({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Double submit cookie pattern
const validateCSRF = (req, res, next) => {
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const cookieToken = req.cookies['csrf-token'];
  
  if (!token || !cookieToken || token !== cookieToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  next();
};
```

#### 6.3.3 Rate Limiting & DDoS Protection
**Rate Limiting Strategy:**
```javascript
// Multi-tier rate limiting
const rateLimit = require('express-rate-limit');

// Global rate limit
const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP'
});

// Authentication endpoint limits
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});

// Feature-specific limits
const featureLimits = {
  'content_creation': { max: 100, window: 3600000 }, // 100 per hour
  'analytics_queries': { max: 1000, window: 3600000 }, // 1000 per hour
  'file_uploads': { max: 10, window: 3600000 } // 10 per hour
};
```

**DDoS Protection:**
- CloudFlare/AWS WAF integration for network-level protection
- Application-level rate limiting with Redis backing store
- Progressive delays for repeated failed attempts
- IP-based blocking with automatic expiration
- Bot detection and CAPTCHA challenges
```

### 6. Infrastructure Security

#### Section 6.4: Infrastructure Security
```markdown
### 6.4 Infrastructure Security

#### 6.4.1 Network Security
**Security Groups & Firewall Rules:**
- Database access restricted to application servers only
- Admin access through VPN or bastion hosts only
- API endpoints exposed through load balancer only
- Redis/cache access restricted to internal network
- Monitoring and logging infrastructure isolated

**SSL/TLS Configuration:**
```nginx
# NGINX SSL configuration
server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

#### 6.4.2 Container Security
**Docker Security Configuration:**
```dockerfile
# Secure Docker configuration
FROM node:18-alpine AS base
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Security: Run as non-root user
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV NODE_ENV production

# Security: Read-only file system
COPY --from=builder --chown=nextjs:nodejs /app ./
RUN chmod -R 755 /app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

**Kubernetes Security Policies:**
- Pod security standards enforcement
- Network policies for service-to-service communication
- Resource limits and quotas
- Secrets management with sealed secrets or external secret operators
- Service mesh (Istio) for zero-trust networking

#### 6.4.3 Secrets Management
**Environment-Specific Secrets:**
```yaml
# Kubernetes secrets configuration
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: production
type: Opaque
data:
  database-url: <base64-encoded-value>
  jwt-secret: <base64-encoded-value>
  encryption-key: <base64-encoded-value>
```

**Secret Rotation Strategy:**
- Database passwords: 90-day rotation
- API keys: 30-day rotation
- JWT signing keys: 7-day rotation with graceful overlap
- TLS certificates: Automated renewal with Let's Encrypt
```

### 7. Security Monitoring & Incident Response

#### Section 6.5: Security Monitoring
```markdown
### 6.5 Security Monitoring & Incident Response

#### 6.5.1 Security Event Logging
**Audit Logging Requirements:**
```javascript
// Security event logging
const logSecurityEvent = (event) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event_type: event.type,
    user_id: event.user_id,
    ip_address: event.ip_address,
    user_agent: event.user_agent,
    resource: event.resource,
    action: event.action,
    result: event.result, // success/failure/blocked
    risk_score: calculateRiskScore(event),
    metadata: event.metadata
  };
  
  // Send to security SIEM
  securityLogger.info(securityLog);
  
  // Real-time alerting for high-risk events
  if (securityLog.risk_score > 8) {
    alertSecurityTeam(securityLog);
  }
};

// Events to log
const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  PASSWORD_CHANGE: 'password_change',
  PERMISSION_DENIED: 'permission_denied',
  DATA_ACCESS: 'data_access',
  ADMIN_ACTION: 'admin_action',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity'
};
```

**Real-time Monitoring:**
- Failed login attempt detection and alerting
- Unusual access pattern detection
- Permission escalation monitoring
- Data export and bulk access monitoring
- API abuse and rate limit violations

#### 6.5.2 Vulnerability Management
**Security Testing Pipeline:**
- Automated SAST (Static Application Security Testing) in CI/CD
- DAST (Dynamic Application Security Testing) for deployed applications
- Dependency vulnerability scanning with automated updates
- Container image scanning for known vulnerabilities
- Regular penetration testing by third-party security firms

**Vulnerability Response Process:**
1. **Detection:** Automated scanning and manual security reviews
2. **Assessment:** Risk scoring and impact analysis
3. **Prioritization:** Critical/High/Medium/Low based on CVSS scores
4. **Remediation:** Patch deployment with testing and rollback plans
5. **Verification:** Post-patch security testing and validation

#### 6.5.3 Incident Response Plan
**Security Incident Classifications:**
- **P0 (Critical):** Active security breach, data exposure, system compromise
- **P1 (High):** Potential security vulnerability, suspicious activity
- **P2 (Medium):** Security policy violation, access control issues
- **P3 (Low):** Security configuration drift, minor policy violations

**Response Procedures:**
1. **Detection & Analysis:** Automated alerting and manual investigation
2. **Containment:** Isolate affected systems and prevent spread
3. **Eradication:** Remove threat and close security gaps
4. **Recovery:** Restore systems and monitor for recurring issues
5. **Post-Incident:** Document lessons learned and improve security posture
```

### 8. MCP Tool Integration

#### Context7 Security Research
```
Use Context7 MCP to research:
1. Latest security best practices for chosen technology stack
2. OWASP guidelines and security testing methodologies
3. Compliance frameworks and regulatory requirements
4. Security monitoring and incident response tools
5. Encryption standards and key management practices
```

#### Perplexity Security Validation
```
Use Perplexity MCP to:
1. Research current security threats and attack vectors
2. Validate security architecture against industry standards
3. Analyze security incidents and lessons learned from similar companies
4. Research emerging security technologies and practices
```

#### Sequential Thinking Security Analysis
```
Use Sequential Thinking MCP to:
1. Validate security architecture completeness and consistency
2. Analyze threat models and risk assessments
3. Review security controls and their effectiveness
4. Validate compliance requirements and implementation gaps
```

### 9. Compliance Framework Implementation

Create comprehensive compliance documentation:
- **GDPR Compliance Guide** with implementation details
- **Security Policies** covering all aspects of application security
- **Incident Response Playbooks** with step-by-step procedures
- **Security Training Materials** for development and operations teams
- **Compliance Audit Checklist** for regular security assessments

### 10. Output Summary

```
✅ Security Architecture & Compliance Complete

📊 Security Implementation:
- Authentication: JWT-based with MFA support
- Authorization: Feature-based RBAC with granular permissions
- Data Protection: Column-level encryption with key management
- Application Security: XSS, CSRF, SQL injection prevention
- Infrastructure Security: Network isolation, container security, secrets management
- Monitoring: Real-time security event logging and alerting

📄 Generated Sections:
- Section 6.1: Authentication & Authorization Architecture
- Section 6.2: Data Protection & Encryption Strategy
- Section 6.3: Application Security Controls
- Section 6.4: Infrastructure Security Configuration
- Section 6.5: Security Monitoring & Incident Response

🎯 Ready for:
- Security implementation during vertical slice development
- Compliance auditing and certification processes
- Security testing and vulnerability assessments
- Production deployment with security controls

Next: Run /vibe-step-6-integration-specs for external service integrations
```

## Error Handling

### Missing Security Requirements
```
If security requirements are unclear:
1. Review feature specifications for security needs
2. Identify data sensitivity and protection requirements
3. Research applicable compliance frameworks
4. Recommend security architecture components
```

### Compliance Gaps
```
If compliance requirements are incomplete:
1. Research applicable regulations based on business model
2. Identify required security controls and documentation
3. Recommend compliance framework implementation
4. Suggest third-party compliance consultation if needed
```

This sub-agent creates comprehensive security architecture that protects all features and data throughout the application lifecycle.