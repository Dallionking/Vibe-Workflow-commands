# Digital Ocean MCP Setup Guide

## Overview
Digital Ocean MCP provides comprehensive integration with Digital Ocean cloud services including Droplets, Databases, Spaces, App Platform, and Kubernetes. Essential for projects using Digital Ocean as their cloud infrastructure provider.

## Installation

### Automated Installation
```bash
# Via Vibe Coding Step 2.5 (when Digital Ocean is selected in Step 2)
/vibe-step-2.5-mcp-setup

# Digital Ocean MCP will be auto-selected and configured
```

### Manual Installation
```bash
# Install Digital Ocean MCP
npm install -g @digitalocean/mcp-cli

# Verify installation
doctl-mcp --version
```

## Authentication Setup

### 1. Generate API Token
1. Log in to [Digital Ocean Control Panel](https://cloud.digitalocean.com)
2. Navigate to API → Tokens/Keys
3. Click "Generate New Token"
4. Set token name: "Vibe Coding Development"
5. Select scopes: Read and Write
6. Set expiration (90 days recommended)
7. Copy the token (starts with `dop_v1_`)

### 2. Configure Environment
```bash
# Add to .env.mcp
DO_API_TOKEN=dop_v1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Or configure directly
claude-mcp configure digitalocean --token dop_v1_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Verify Authentication
```bash
# Test connection
claude-mcp test digitalocean

# Expected output:
# ✅ Digital Ocean MCP: Connected (234ms)
# ✅ API Token: Valid
# ✅ Rate Limits: 4,998/5,000 remaining
# ✅ Account: your-email@example.com
# ✅ Team: your-team-name
```

## Usage in Vibe Coding

### Step Integration
Digital Ocean MCP is automatically used when selected in:
- **Step 2 (Architecture)**: Cloud infrastructure planning
- **Step 6 (Technical Spec)**: Deployment and scaling specifications
- **Step 8 (Vertical Slices)**: Environment provisioning per phase
- **Step 10 (Service Init)**: Infrastructure validation and setup

### Command Patterns
```bash
# Droplet management
/digitalocean create-droplet --name "app-server" --size "s-1vcpu-1gb" --image "ubuntu-22-04-x64"
/digitalocean list-droplets --tag "production"

# Database operations
/digitalocean create-database --name "app-db" --engine "postgresql" --size "db-s-1vcpu-1gb"
/digitalocean database-backups --database "app-db"

# App Platform deployment
/digitalocean create-app --spec "app-spec.yaml" --name "vibe-app"
/digitalocean deploy-app --app-id "12345" --force-rebuild
```

## Core Features

### 1. Droplet Management
```bash
# List available resources
/digitalocean list-sizes
/digitalocean list-images --type "distribution"
/digitalocean list-regions

# Create droplet
/digitalocean create-droplet \
  --name "web-server-01" \
  --size "s-2vcpu-2gb" \
  --image "ubuntu-22-04-x64" \
  --region "nyc3" \
  --ssh-keys "12345,67890" \
  --tags "web,production"

# Droplet operations
/digitalocean list-droplets --tag "production"
/digitalocean droplet-info --id "12345678"
/digitalocean resize-droplet --id "12345678" --size "s-4vcpu-8gb"
/digitalocean snapshot-droplet --id "12345678" --name "backup-2024-07-05"
/digitalocean destroy-droplet --id "12345678"

# Droplet actions
/digitalocean reboot-droplet --id "12345678"
/digitalocean power-on-droplet --id "12345678"
/digitalocean power-off-droplet --id "12345678"
/digitalocean shutdown-droplet --id "12345678"
```

### 2. Managed Databases
```bash
# Database cluster management
/digitalocean list-database-engines
/digitalocean create-database \
  --name "production-db" \
  --engine "postgresql" \
  --version "15" \
  --size "db-s-2vcpu-4gb" \
  --region "nyc3" \
  --num-nodes 1

# Database operations
/digitalocean list-databases
/digitalocean database-info --id "db-12345"
/digitalocean resize-database --id "db-12345" --size "db-s-4vcpu-8gb"
/digitalocean create-database-backup --id "db-12345"

# Database users and security
/digitalocean create-db-user --database "db-12345" --name "app-user"
/digitalocean list-db-users --database "db-12345"
/digitalocean create-db-firewall --database "db-12345" --rule "ip:192.168.1.0/24"
```

### 3. Spaces Object Storage
```bash
# Spaces management
/digitalocean list-spaces
/digitalocean create-space --name "app-assets" --region "nyc3" --acl "private"
/digitalocean space-info --name "app-assets" --region "nyc3"

# File operations
/digitalocean upload-to-space --space "app-assets" --file "./image.jpg" --key "uploads/image.jpg"
/digitalocean list-space-objects --space "app-assets" --prefix "uploads/"
/digitalocean download-from-space --space "app-assets" --key "uploads/image.jpg" --output "./downloads/"
/digitalocean delete-space-object --space "app-assets" --key "uploads/image.jpg"

# CDN configuration
/digitalocean enable-space-cdn --space "app-assets"
/digitalocean configure-space-cors --space "app-assets" --origins "https://myapp.com"
```

### 4. App Platform
```bash
# App creation and deployment
/digitalocean create-app --spec "app-spec.yaml" --name "vibe-application"
/digitalocean list-apps
/digitalocean app-info --id "app-12345"

# App management
/digitalocean update-app --id "app-12345" --spec "updated-app-spec.yaml"
/digitalocean deploy-app --id "app-12345" --force-rebuild
/digitalocean cancel-deployment --id "app-12345" --deployment-id "dep-67890"

# App logs and metrics
/digitalocean app-logs --id "app-12345" --component "web" --follow
/digitalocean app-metrics --id "app-12345" --start "2024-07-01" --end "2024-07-05"

# App domains
/digitalocean add-app-domain --id "app-12345" --domain "myapp.com"
/digitalocean list-app-domains --id "app-12345"
```

### 5. Kubernetes (DOKS)
```bash
# Cluster management
/digitalocean create-k8s-cluster \
  --name "production-cluster" \
  --region "nyc3" \
  --version "1.28.2-do.0" \
  --node-pool "name=worker-pool,size=s-2vcpu-4gb,count=3"

/digitalocean list-k8s-clusters
/digitalocean k8s-cluster-info --id "cluster-12345"
/digitalocean upgrade-k8s-cluster --id "cluster-12345" --version "1.29.1-do.0"

# Node pool management
/digitalocean create-node-pool --cluster "cluster-12345" --name "high-memory" --size "s-4vcpu-8gb" --count 2
/digitalocean resize-node-pool --cluster "cluster-12345" --pool "pool-67890" --count 5
/digitalocean delete-node-pool --cluster "cluster-12345" --pool "pool-67890"

# Kubernetes configuration
/digitalocean get-k8s-credentials --cluster "cluster-12345" --save --set-current-context
```

### 6. Networking
```bash
# VPC management
/digitalocean create-vpc --name "app-network" --region "nyc3" --ip-range "10.0.0.0/16"
/digitalocean list-vpcs
/digitalocean vpc-info --id "vpc-12345"

# Load Balancer
/digitalocean create-load-balancer \
  --name "app-lb" \
  --algorithm "round_robin" \
  --region "nyc3" \
  --forwarding-rules "entry_protocol:http,entry_port:80,target_protocol:http,target_port:80"

# Firewall rules
/digitalocean create-firewall \
  --name "web-firewall" \
  --inbound-rules "protocol:tcp,ports:80,sources:0.0.0.0/0,::/0" \
  --inbound-rules "protocol:tcp,ports:443,sources:0.0.0.0/0,::/0"
```

### 7. Monitoring and Alerting
```bash
# Monitoring setup
/digitalocean enable-monitoring --droplet "12345678"
/digitalocean monitoring-metrics --droplet "12345678" --start "2024-07-01" --end "2024-07-05"

# Alert policies
/digitalocean create-alert-policy \
  --name "High CPU Usage" \
  --type "cpu" \
  --comparison "greater_than" \
  --value 80 \
  --window "5m" \
  --entities "12345678"

/digitalocean list-alert-policies
```

## Vibe Coding Integration Examples

### Step 2 (Architecture) - Infrastructure Planning
```bash
# Automated infrastructure assessment
/digitalocean estimate-costs \
  --droplets "2x s-2vcpu-4gb" \
  --database "db-s-2vcpu-4gb" \
  --spaces "100gb" \
  --load-balancer "1"

# Region selection based on requirements
/digitalocean compare-regions --metrics "latency,features,pricing"
```

### Step 6 (Technical Spec) - Environment Setup
```yaml
# app-spec.yaml for App Platform deployment
name: vibe-saas-app
services:
- name: web
  source_dir: /
  github:
    repo: your-username/vibe-saas-app
    branch: main
    deploy_on_push: true
  run_command: npm start
  environment_slug: node-js
  instance_count: 2
  instance_size_slug: basic-xxs
  http_port: 3000
  routes:
  - path: /
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}

databases:
- name: db
  engine: PG
  production: true
  version: "15"
```

### Step 8 (Vertical Slices) - Phased Infrastructure
```bash
# Phase 1: Development Environment
/digitalocean create-droplet --name "dev-server" --size "s-1vcpu-2gb" --tag "development"
/digitalocean create-database --name "dev-db" --engine "postgresql" --size "db-s-1vcpu-1gb" --tag "development"

# Phase 2: Staging Environment  
/digitalocean create-app --spec "staging-app-spec.yaml" --name "vibe-app-staging"
/digitalocean create-database --name "staging-db" --engine "postgresql" --size "db-s-2vcpu-4gb" --tag "staging"

# Phase 3: Production Environment
/digitalocean create-app --spec "production-app-spec.yaml" --name "vibe-app-production"
/digitalocean create-database --name "production-db" --engine "postgresql" --size "db-s-4vcpu-8gb" --tag "production"
/digitalocean create-load-balancer --name "production-lb" --tag "production"
```

### Step 10 (Service Init) - Infrastructure Validation
```bash
# Comprehensive infrastructure health check
/digitalocean health-check --all

# Service connectivity tests
/digitalocean test-droplet-connectivity --id "12345678" --port 22,80,443
/digitalocean test-database-connectivity --id "db-12345"
/digitalocean test-space-access --space "app-assets"
/digitalocean test-app-deployment --id "app-12345"
```

## Performance Optimization

### Droplet Optimization
```bash
# Performance monitoring
/digitalocean droplet-metrics --id "12345678" --metrics "cpu,memory,disk,network"

# Resize recommendations
/digitalocean analyze-droplet-performance --id "12345678" --period "last-7-days"
/digitalocean resize-recommendation --id "12345678"
```

### Database Optimization
```bash
# Database performance analysis
/digitalocean database-metrics --id "db-12345" --metrics "cpu,memory,connections,queries"
/digitalocean database-slow-queries --id "db-12345" --limit 10
```

### Response Time Targets
- **API calls**: < 500ms
- **Droplet operations**: < 10s
- **Database operations**: < 5s
- **App deployments**: < 5 minutes

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
```bash
Error: Unable to authenticate you

Solutions:
1. Verify API token format (should start with dop_v1_)
2. Check token hasn't expired in DO dashboard
3. Ensure token has correct scopes (read/write)
4. Test token directly:
   curl -H "Authorization: Bearer $DO_API_TOKEN" \
        "https://api.digitalocean.com/v2/account"
```

#### 2. Rate Limit Exceeded
```bash
Error: API rate limit exceeded

Solutions:
1. Check current limits: /digitalocean rate-limits
2. Implement request batching
3. Add delays between API calls
4. Contact support for higher limits if needed
```

#### 3. Resource Creation Failures
```bash
Error: Cannot create droplet

Solutions:
1. Check account limits: /digitalocean account-limits
2. Verify region availability: /digitalocean region-status
3. Ensure sufficient account balance
4. Check for resource naming conflicts
```

#### 4. Network Connectivity Issues
```bash
Error: Cannot connect to droplet

Solutions:
1. Check firewall rules: /digitalocean list-firewalls
2. Verify SSH keys: /digitalocean list-ssh-keys
3. Check droplet status: /digitalocean droplet-info --id "12345"
4. Review security group settings
```

#### 5. App Platform Deployment Failures
```bash
Error: App deployment failed

Solutions:
1. Check app logs: /digitalocean app-logs --id "app-12345"
2. Validate app spec: /digitalocean validate-app-spec --file "app-spec.yaml"
3. Review build logs and error messages
4. Check resource limits and dependencies
```

## Security Best Practices

### API Token Management
- ✅ Use tokens with minimal required scopes
- ✅ Set token expiration (90 days or less)
- ✅ Rotate tokens regularly
- ✅ Store tokens in secure environment variables
- ❌ Never commit tokens to version control
- ❌ Share tokens in chat/email

### Infrastructure Security
- ✅ Use SSH keys instead of passwords
- ✅ Configure firewall rules restrictively
- ✅ Enable VPC for network isolation
- ✅ Use managed databases with SSL
- ❌ Expose services to 0.0.0.0/0 unnecessarily
- ❌ Use default passwords

### Access Control
- ✅ Use team accounts for shared resources
- ✅ Implement least privilege access
- ✅ Tag resources for organization
- ✅ Monitor access logs
- ❌ Share root access
- ❌ Skip access reviews

## Cost Optimization

### Cost Monitoring
```bash
# Usage and billing
/digitalocean account-usage --period "current-month"
/digitalocean estimate-monthly-cost --resources "current"

# Cost optimization recommendations
/digitalocean cost-optimization-report --period "last-30-days"
```

### Optimization Strategies
```bash
# Identify underutilized resources
/digitalocean unused-resources --threshold "cpu:10,memory:20"

# Resize recommendations
/digitalocean resize-recommendations --savings-threshold 20

# Reserved instances for predictable workloads
/digitalocean reserved-instances --term "1-year"
```

## Monitoring and Analytics

### Infrastructure Monitoring
```bash
# Overall infrastructure health
/digitalocean infrastructure-overview

# Resource utilization
/digitalocean utilization-report --resources "droplets,databases,spaces"

# Performance metrics
/digitalocean performance-dashboard --period "last-24-hours"
```

### Alerting Setup
```bash
# Critical alerts
/digitalocean create-alert-policy --name "Droplet Down" --type "droplet_status" --value "down"
/digitalocean create-alert-policy --name "High Database CPU" --type "database_cpu" --value 90

# Notification channels
/digitalocean configure-notifications --email "admin@company.com" --slack "webhook-url"
```

## Configuration Examples

### Environment Configuration
```json
{
  "digitalocean": {
    "api_token": "${DO_API_TOKEN}",
    "default_region": "nyc3",
    "default_size": "s-2vcpu-4gb",
    "default_image": "ubuntu-22-04-x64",
    "tags": ["vibe-coding", "production"],
    "vpc_uuid": "vpc-12345",
    "ssh_keys": ["12345", "67890"]
  }
}
```

### Infrastructure as Code Template
```yaml
# digitalocean-infrastructure.yml
infrastructure:
  droplets:
    - name: web-server-01
      size: s-2vcpu-4gb
      image: ubuntu-22-04-x64
      region: nyc3
      tags: [web, production]
    
  databases:
    - name: production-db
      engine: postgresql
      version: "15"
      size: db-s-2vcpu-4gb
      region: nyc3
      
  spaces:
    - name: app-assets
      region: nyc3
      acl: private
      cdn: true
      
  load_balancers:
    - name: production-lb
      algorithm: round_robin
      region: nyc3
      forwarding_rules:
        - entry_protocol: https
          entry_port: 443
          target_protocol: http
          target_port: 80
```

## Support and Resources

### Documentation
- [Digital Ocean API Documentation](https://docs.digitalocean.com/reference/api/)
- [Digital Ocean Product Documentation](https://docs.digitalocean.com/products/)
- [doctl CLI Reference](https://docs.digitalocean.com/reference/doctl/)

### Community
- [Digital Ocean Community](https://www.digitalocean.com/community)
- [Digital Ocean Discord](https://discord.gg/digitalocean)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/digital-ocean)

### Support Channels
- Basic support: Community forums and documentation
- Pro support: Email support with SLA
- Business support: Priority support with phone access
- Enterprise support: Dedicated customer success manager

### Learning Resources
- [Digital Ocean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Kubernetes Guide](https://www.digitalocean.com/products/kubernetes)
- [Infrastructure Monitoring Guide](https://docs.digitalocean.com/products/monitoring/)

---

**Digital Ocean MCP provides comprehensive cloud infrastructure management for scalable applications! ☁️**