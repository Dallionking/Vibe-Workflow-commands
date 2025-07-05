# MCP Validation and Testing Guide

## Overview
This guide provides comprehensive testing and validation procedures for MCP installations, ensuring all tools are properly configured and functioning optimally for Vibe Coding development.

## Quick Validation

### One-Command Health Check
```bash
# Test all installed MCPs
claude-mcp test --all

# Test with detailed output
claude-mcp test --all --verbose

# Test specific MCP category
claude-mcp test --category "core"
claude-mcp test --category "service"
```

### Expected Output
```
🧪 MCP Validation Results

Core MCPs:
✅ Context7: Connected (245ms) - API key valid, 950/1000 daily requests remaining
✅ Perplexity: Connected (892ms) - Pro subscription, 280/300 monthly queries remaining  
✅ GitHub: Connected (156ms) - Token valid (expires in 89 days), 4,998/5,000 rate limit remaining
✅ Sequential Thinking: Connected (1.2s) - 450/500 analysis credits remaining

Service MCPs:
✅ Supabase: Connected (89ms) - Project healthy, all services operational
✅ Digital Ocean: Connected (234ms) - Account active, 4,998/5,000 API calls remaining
✅ Linear: Connected (445ms) - Team access confirmed, API key valid
✅ Slack: Connected (167ms) - Webhook functional, channel access verified

Summary: 8/8 MCPs operational ✅
Average response time: 341ms
System ready for Vibe Coding development! 🚀
```

## Detailed Validation Procedures

### 1. Core MCP Validation

#### Context7 Validation
```bash
# Basic connection test
claude-mcp test context7

# Functional test with documentation fetch
claude-mcp validate context7 --test-query "react hooks best practices"

# Performance test
claude-mcp benchmark context7 --requests 10 --concurrent 3

# Expected results
# ✅ Authentication: Valid
# ✅ Rate limits: Under threshold
# ✅ Response time: < 800ms
# ✅ Data quality: Documentation retrieved successfully
```

#### Perplexity Validation
```bash
# Basic connection test
claude-mcp test perplexity

# Research capability test
claude-mcp validate perplexity --test-query "SaaS pricing trends 2024"

# Model availability test
claude-mcp validate perplexity --test-models "pplx-7b-online,pplx-70b-online"

# Expected results
# ✅ Authentication: Valid
# ✅ Credit balance: Sufficient
# ✅ Response quality: Relevant and current
# ✅ Model access: All models available
```

#### GitHub Validation
```bash
# Basic connection test
claude-mcp test github

# Repository access test
claude-mcp validate github --test-repo-access

# Permission scope test
claude-mcp validate github --test-permissions "repo,workflow"

# Expected results
# ✅ Authentication: Valid token
# ✅ Rate limits: Under threshold
# ✅ Repository access: Confirmed
# ✅ Required scopes: Available
```

#### Sequential Thinking Validation
```bash
# Basic connection test
claude-mcp test sequential-thinking

# Analysis capability test
claude-mcp validate sequential-thinking --test-analysis "Compare React vs Vue for dashboard app"

# Framework availability test
claude-mcp validate sequential-thinking --test-frameworks "mcda,swot,risk-matrix"

# Expected results
# ✅ Authentication: Valid
# ✅ Credit balance: Sufficient
# ✅ Analysis quality: Comprehensive and structured
# ✅ Frameworks: All available
```

### 2. Service MCP Validation

#### Supabase Validation
```bash
# Connection test
claude-mcp test supabase

# Database connectivity test
claude-mcp validate supabase --test-database --query "SELECT 1 as health_check"

# Auth service test
claude-mcp validate supabase --test-auth --create-test-user

# Storage test
claude-mcp validate supabase --test-storage --upload-test-file

# Real-time test
claude-mcp validate supabase --test-realtime --table "test_table"

# Expected results
# ✅ Project status: Active
# ✅ Database: Connected and responsive
# ✅ Auth service: Functional
# ✅ Storage: Upload/download working
# ✅ Real-time: WebSocket connection stable
```

#### Digital Ocean Validation
```bash
# Connection test
claude-mcp test digitalocean

# Account access test
claude-mcp validate digitalocean --test-account-access

# Resource listing test
claude-mcp validate digitalocean --test-resource-listing "droplets,databases,spaces"

# API functionality test
claude-mcp validate digitalocean --test-crud-operations --dry-run

# Expected results
# ✅ Account: Active and accessible
# ✅ API limits: Under threshold
# ✅ Resource access: All services available
# ✅ Operations: CRUD operations functional
```

### 3. Integration Testing

#### Cross-MCP Integration Test
```bash
# Test MCP interaction capabilities
claude-mcp validate-integration --mcps "context7,perplexity" --test "research-workflow"

# Test Vibe Coding workflow integration
claude-mcp validate-integration --workflow "vibe-coding" --steps "ideation,architecture"

# Expected results
# ✅ MCP communication: Seamless
# ✅ Data sharing: Functional
# ✅ Workflow integration: Operational
```

#### Performance Integration Test
```bash
# Test concurrent MCP usage
claude-mcp benchmark-integration --concurrent-mcps 4 --duration 60s

# Test under load
claude-mcp stress-test --mcps "all" --requests-per-second 10 --duration 30s

# Expected results
# ✅ Concurrent performance: Stable
# ✅ Resource utilization: Acceptable
# ✅ Error rate: < 1%
```

## Validation Scripts

### Automated Daily Health Check
```bash
#!/bin/bash
# daily-mcp-health-check.sh

echo "🔍 Daily MCP Health Check - $(date)"
echo "======================================="

# Test all MCPs
RESULTS=$(claude-mcp test --all --json)

# Parse results and check for failures
FAILED_MCPS=$(echo $RESULTS | jq -r '.failed[] // empty')
SUCCESS_COUNT=$(echo $RESULTS | jq -r '.summary.successful')
TOTAL_COUNT=$(echo $RESULTS | jq -r '.summary.total')

if [ "$SUCCESS_COUNT" = "$TOTAL_COUNT" ]; then
    echo "✅ All MCPs operational ($SUCCESS_COUNT/$TOTAL_COUNT)"
    
    # Log success
    echo "$(date): All MCPs healthy" >> .vibe/mcp-health.log
    
    # Update status
    echo '{"status": "healthy", "last_check": "'$(date)'", "success_rate": "100%"}' > .vibe/mcp-status.json
    
else
    echo "⚠️ Some MCPs have issues ($SUCCESS_COUNT/$TOTAL_COUNT operational)"
    echo "Failed MCPs: $FAILED_MCPS"
    
    # Log failures
    echo "$(date): MCPs failed: $FAILED_MCPS" >> .vibe/mcp-health.log
    
    # Update status
    echo '{"status": "degraded", "last_check": "'$(date)'", "failed_mcps": "'$FAILED_MCPS'"}' > .vibe/mcp-status.json
    
    # Try to reconnect failed MCPs
    for mcp in $FAILED_MCPS; do
        echo "Attempting to reconnect $mcp..."
        claude-mcp reconnect $mcp
    done
fi

echo "======================================="
```

### Pre-Development Validation
```bash
#!/bin/bash
# pre-dev-validation.sh

echo "🚀 Pre-Development MCP Validation"
echo "=================================="

# Check if we're in a Vibe Coding project
if [ ! -f ".vibe-status.md" ]; then
    echo "❌ Not in a Vibe Coding project directory"
    exit 1
fi

# Read project requirements
PROJECT_MCPS=$(grep -o "MCP Tools.*:" .vibe-status.md | cut -d: -f2)

echo "Required MCPs for this project: $PROJECT_MCPS"

# Validate each required MCP
for mcp in $PROJECT_MCPS; do
    echo "Testing $mcp..."
    if claude-mcp test $mcp --quiet; then
        echo "✅ $mcp: Ready"
    else
        echo "❌ $mcp: Issues detected"
        echo "Run: claude-mcp diagnose $mcp"
        exit 1
    fi
done

echo "✅ All required MCPs are operational"
echo "🎯 Ready to begin development!"
```

### Performance Benchmark Script
```bash
#!/bin/bash
# mcp-performance-benchmark.sh

echo "📊 MCP Performance Benchmark"
echo "============================="

# Core MCP benchmarks
echo "Core MCPs:"
claude-mcp benchmark context7 --requests 5 --metric response-time
claude-mcp benchmark perplexity --requests 3 --metric response-time
claude-mcp benchmark github --requests 10 --metric response-time
claude-mcp benchmark sequential-thinking --requests 2 --metric response-time

echo ""
echo "Service MCPs:"
claude-mcp benchmark supabase --requests 5 --metric response-time
claude-mcp benchmark digitalocean --requests 5 --metric response-time

# Generate performance report
claude-mcp performance-report --output .vibe/mcp-performance-$(date +%Y%m%d).json

echo "📊 Performance report saved to .vibe/mcp-performance-$(date +%Y%m%d).json"
```

## Troubleshooting Validation Issues

### Common Validation Failures

#### 1. Authentication Failures
```bash
# Symptom
❌ Context7: Authentication failed

# Diagnosis
claude-mcp diagnose context7 --check-auth

# Common fixes
1. Verify API key in environment: echo $CONTEXT7_API_KEY
2. Regenerate API key in service dashboard
3. Check key permissions and scopes
4. Reload environment variables: source .env.mcp
```

#### 2. Network Connectivity Issues
```bash
# Symptom
❌ Perplexity: Connection timeout

# Diagnosis
claude-mcp diagnose perplexity --check-network

# Common fixes
1. Check internet connectivity: ping perplexity.ai
2. Verify firewall settings
3. Test direct API access: curl -H "Authorization: Bearer $API_KEY" api-url
4. Check corporate proxy settings
```

#### 3. Rate Limit Exceeded
```bash
# Symptom
⚠️ GitHub: Rate limit exceeded (0/5000)

# Diagnosis
claude-mcp diagnose github --check-limits

# Common fixes
1. Wait for rate limit reset (shown in error)
2. Optimize API usage patterns
3. Use authenticated requests (higher limits)
4. Implement request caching
```

#### 4. Service-Specific Issues
```bash
# Symptom
❌ Supabase: Database connection failed

# Diagnosis
claude-mcp diagnose supabase --check-database

# Common fixes
1. Check project status (not paused)
2. Verify connection string format
3. Test direct database connection
4. Check database health in dashboard
```

### Advanced Diagnostics

#### Deep System Analysis
```bash
# Comprehensive system check
claude-mcp system-check --verbose

# Network diagnostics
claude-mcp network-diagnostics --test-all-endpoints

# Configuration validation
claude-mcp validate-config --check-all-settings

# Performance analysis
claude-mcp performance-analysis --identify-bottlenecks
```

#### Environment Debugging
```bash
# Check environment variables
claude-mcp env-check --show-masked-values

# Validate configuration files
claude-mcp config-validate --files ".env.mcp,claude-mcp.json"

# Test MCP isolation
claude-mcp test-isolation --mcp-by-mcp
```

## Continuous Monitoring

### Automated Monitoring Setup
```bash
# Set up automated health checks (every 5 minutes)
crontab -e
# Add: */5 * * * * /path/to/daily-mcp-health-check.sh

# Set up performance monitoring (daily)
crontab -e  
# Add: 0 6 * * * /path/to/mcp-performance-benchmark.sh

# Set up weekly deep validation
crontab -e
# Add: 0 8 * * 1 /path/to/comprehensive-mcp-validation.sh
```

### Status Dashboard
```bash
# View current status
claude-mcp status-dashboard

# Historical performance
claude-mcp performance-history --period "last-7-days"

# Usage analytics
claude-mcp usage-analytics --breakdown-by-mcp
```

## Quality Assurance Checklist

### Pre-Project Validation ✅
- [ ] All required MCPs installed and authenticated
- [ ] Connection tests passing for all MCPs
- [ ] Performance benchmarks within acceptable ranges
- [ ] Integration tests successful
- [ ] Error handling verified
- [ ] Backup/fallback procedures tested

### Regular Maintenance ✅
- [ ] Daily automated health checks running
- [ ] Weekly performance benchmarks completed
- [ ] Monthly API key rotation performed
- [ ] Quarterly deep validation executed
- [ ] Configuration backups up to date
- [ ] Documentation updated with any changes

### Incident Response ✅
- [ ] Failure detection procedures in place
- [ ] Automatic retry mechanisms configured
- [ ] Manual remediation steps documented
- [ ] Escalation procedures defined
- [ ] Recovery validation steps identified

## Reporting and Analytics

### Generate Validation Report
```bash
# Comprehensive validation report
claude-mcp generate-report --type "validation" --period "last-30-days" --output "mcp-validation-report.pdf"

# Performance analysis report
claude-mcp generate-report --type "performance" --include-trends --output "mcp-performance-analysis.pdf"

# Usage and cost analysis
claude-mcp generate-report --type "usage" --include-costs --output "mcp-usage-report.pdf"
```

### Team Dashboard
```bash
# Real-time team dashboard
claude-mcp dashboard --port 3000 --auth-required

# Slack integration for alerts
claude-mcp configure-alerts --slack-webhook "$SLACK_WEBHOOK_URL" --critical-only

# Email reports
claude-mcp configure-reports --email "team@company.com" --frequency "weekly"
```

---

**Proper MCP validation ensures reliable, high-performance AI-assisted development! 🔧**