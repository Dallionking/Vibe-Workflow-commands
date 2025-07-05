# Supabase MCP Setup Guide

## Overview
Supabase MCP provides seamless integration with Supabase services including database management, authentication, storage, and real-time subscriptions. Essential for projects using Supabase as their Backend-as-a-Service solution.

## Installation

### Automated Installation
```bash
# Via Vibe Coding Step 2.5 (when Supabase is selected in Step 2)
/vibe-step-2.5-mcp-setup

# Supabase MCP will be auto-selected and configured
```

### Manual Installation
```bash
# Install Supabase MCP
npm install -g @supabase/mcp-integration

# Verify installation
supabase-mcp --version
```

## Authentication Setup

### 1. Get Supabase Credentials
1. Visit [Supabase Dashboard](https://app.supabase.com)
2. Create new project or select existing
3. Go to Settings → API
4. Copy the following:
   - **Project URL**: `https://[project-id].supabase.co`
   - **Anon (public) key**: For client-side operations
   - **Service role (secret) key**: For server-side operations

### 2. Configure Environment
```bash
# Add to .env.mcp
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Or configure directly
claude-mcp configure supabase \
  --url "https://xxxxxxxxxxxxxxxxxxxxx.supabase.co" \
  --anon-key "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  --service-key "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Verify Authentication
```bash
# Test connection
claude-mcp test supabase

# Expected output:
# ✅ Supabase MCP: Connected (89ms)
# ✅ Project URL: Valid
# ✅ Anon Key: Valid
# ✅ Service Key: Valid
# ✅ Database: PostgreSQL 15.1
# ✅ Auth: Enabled
# ✅ Storage: Enabled
```

## Usage in Vibe Coding

### Step Integration
Supabase MCP is automatically used when selected in:
- **Step 2 (Architecture)**: Database and auth service selection
- **Step 6 (Technical Spec)**: Database schema and API specifications
- **Step 8 (Vertical Slices)**: Feature implementation and testing
- **Step 10 (Service Init)**: Connection testing and configuration

### Command Patterns
```bash
# Database operations
/supabase db-status
/supabase create-table --name "users" --schema "user-schema.sql"
/supabase migrate --file "001_initial_schema.sql"

# Authentication management
/supabase auth-config --providers "google,github"
/supabase create-user --email "test@example.com" --password "secure123"

# Storage operations
/supabase create-bucket --name "avatars" --public
/supabase upload-file --bucket "avatars" --file "./avatar.png"
```

## Core Features

### 1. Database Management
```bash
# Database status and info
/supabase db-info

# Table operations
/supabase list-tables
/supabase describe-table --name "users"
/supabase create-table --name "posts" --columns "title:text,content:text,author_id:uuid"

# Schema migrations
/supabase generate-migration --name "add_posts_table"
/supabase migrate --up
/supabase migrate --down --steps 1

# Query operations
/supabase query --sql "SELECT * FROM users LIMIT 5"
/supabase query-builder --table "posts" --select "title,created_at" --order "created_at.desc"
```

### 2. Authentication Management
```bash
# Auth configuration
/supabase auth-status
/supabase configure-auth --enable-signup --require-email-confirmation

# OAuth providers
/supabase add-oauth-provider --provider "google" --client-id "your-id" --client-secret "your-secret"
/supabase add-oauth-provider --provider "github" --client-id "your-id" --client-secret "your-secret"

# User management
/supabase list-users --limit 10
/supabase create-user --email "user@example.com" --password "password123" --metadata '{"role": "admin"}'
/supabase update-user --id "user-uuid" --email "newemail@example.com"
/supabase delete-user --id "user-uuid"

# Email templates
/supabase update-email-template --type "confirmation" --subject "Confirm your email" --body-html "<html>..."
```

### 3. Storage Management
```bash
# Bucket operations
/supabase list-buckets
/supabase create-bucket --name "documents" --public false --file-size-limit 10485760
/supabase update-bucket --name "documents" --public true

# File operations
/supabase upload-file --bucket "documents" --file "./document.pdf" --path "user123/document.pdf"
/supabase list-files --bucket "documents" --path "user123/"
/supabase download-file --bucket "documents" --path "user123/document.pdf" --output "./downloads/"
/supabase delete-file --bucket "documents" --path "user123/document.pdf"

# Storage policies (RLS)
/supabase create-storage-policy --bucket "documents" --name "Users can upload own files" --definition "auth.uid()::text = (storage.foldername(name))[1]"
```

### 4. Real-time Subscriptions
```bash
# Real-time configuration
/supabase realtime-status
/supabase enable-realtime --table "posts"
/supabase disable-realtime --table "posts"

# Subscription management
/supabase list-subscriptions
/supabase test-subscription --table "posts" --event "INSERT"
```

### 5. Edge Functions
```bash
# Function management
/supabase list-functions
/supabase create-function --name "send-email" --file "./functions/send-email.ts"
/supabase deploy-function --name "send-email"
/supabase invoke-function --name "send-email" --data '{"to": "user@example.com", "subject": "Hello"}'

# Function logs
/supabase function-logs --name "send-email" --tail
```

### 6. Row Level Security (RLS)
```bash
# RLS management
/supabase enable-rls --table "posts"
/supabase disable-rls --table "posts"

# Policy management
/supabase create-policy --table "posts" --name "Users can read own posts" --command "SELECT" --definition "auth.uid() = author_id"
/supabase create-policy --table "posts" --name "Users can insert own posts" --command "INSERT" --definition "auth.uid() = author_id"
/supabase list-policies --table "posts"
/supabase drop-policy --table "posts" --name "Users can read own posts"
```

## Vibe Coding Integration Examples

### Step 2 (Architecture) - Service Setup
```bash
# Automated during architecture selection
/supabase init-project --name "vibe-saas-project"
/supabase configure-auth --providers "google,github" --require-email-confirmation
/supabase create-bucket --name "user-uploads" --public false
/supabase enable-realtime --tables "posts,comments,notifications"
```

### Step 6 (Technical Spec) - Schema Implementation
```sql
-- Generated schema from technical specification
-- /supabase migrate --file "001_initial_schema.sql"

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table with RLS
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Users can read own posts" ON posts
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);
```

### Step 8 (Vertical Slices) - Feature Implementation
```bash
# Phase 1: Authentication
/supabase configure-auth --enable-signup --providers "email"
/supabase create-email-template --type "confirmation" --template "custom-confirmation.html"

# Phase 2: Core Features
/supabase create-table --name "projects" --file "projects-schema.sql"
/supabase enable-realtime --table "projects"
/supabase create-storage-policy --bucket "project-files" --name "Project member access"

# Phase 3: Advanced Features
/supabase create-function --name "send-notifications" --file "notification-function.ts"
/supabase create-function --name "generate-reports" --file "report-function.ts"
```

### Step 10 (Service Init) - Connection Testing
```bash
# Comprehensive connection testing
/supabase health-check --verbose

# Database connectivity
/supabase test-query --sql "SELECT 1 as health_check"

# Auth service test
/supabase test-auth --create-test-user

# Storage test
/supabase test-storage --upload-test-file

# Real-time test
/supabase test-realtime --table "posts"

# Edge functions test
/supabase test-function --name "health-check"
```

## Performance Optimization

### Database Optimization
```bash
# Index management
/supabase create-index --table "posts" --columns "author_id,created_at"
/supabase analyze-performance --table "posts"

# Query optimization
/supabase explain-query --sql "SELECT * FROM posts WHERE author_id = 'uuid'"
/supabase query-stats --table "posts"
```

### Connection Optimization
```bash
# Connection pooling
/supabase configure-pooling --mode "transaction" --pool-size 15

# Performance monitoring
/supabase monitor-performance --duration "1h"
```

### Response Time Targets
- **Database queries**: < 100ms (indexed)
- **Auth operations**: < 200ms
- **File uploads**: < 2s (< 10MB)
- **Real-time events**: < 50ms latency

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
```bash
Error: Invalid API key

Solutions:
1. Verify project URL is correct
2. Check anon/service key hasn't been regenerated
3. Ensure environment variables are loaded:
   echo $SUPABASE_URL
   echo $SUPABASE_ANON_KEY
4. Test direct API access:
   curl -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/"
```

#### 2. Database Connection Issues
```bash
Error: Connection to database failed

Solutions:
1. Check project is not paused (free tier auto-pauses)
2. Verify database is healthy: /supabase db-status
3. Check connection limits (free tier: 60 connections)
4. Review database logs in Supabase dashboard
```

#### 3. Row Level Security Errors
```bash
Error: Permission denied for table posts

Solutions:
1. Check RLS policies: /supabase list-policies --table "posts"
2. Verify user authentication status
3. Test policies with different user contexts
4. Review policy definitions for logic errors
```

#### 4. Storage Upload Failures
```bash
Error: File upload failed

Solutions:
1. Check bucket exists and is accessible
2. Verify file size limits: /supabase bucket-info --name "uploads"
3. Check storage policies allow upload
4. Ensure file path doesn't conflict with existing files
```

#### 5. Real-time Not Working
```bash
Error: Real-time subscription failed

Solutions:
1. Verify real-time is enabled for table
2. Check RLS policies allow SELECT on table
3. Test subscription in Supabase dashboard
4. Review network connectivity and websocket support
```

## Security Best Practices

### API Key Management
- ✅ Use anon key for client-side operations only
- ✅ Use service key for server-side operations only
- ✅ Store keys in environment variables
- ✅ Regenerate keys if compromised
- ❌ Never expose service key to client
- ❌ Commit keys to version control

### Row Level Security
- ✅ Enable RLS on all user data tables
- ✅ Create specific policies for each operation
- ✅ Test policies with different user contexts
- ✅ Use auth.uid() for user-specific data
- ❌ Disable RLS without replacement security
- ❌ Create overly permissive policies

### Authentication Security
- ✅ Enable email confirmation
- ✅ Set strong password requirements
- ✅ Configure OAuth providers securely
- ✅ Use secure redirect URLs
- ❌ Allow weak passwords
- ❌ Skip email verification

## Monitoring and Analytics

### Usage Tracking
```bash
# Database usage
/supabase usage --service "database" --period "last-30-days"

# Auth usage
/supabase usage --service "auth" --period "last-7-days"

# Storage usage
/supabase usage --service "storage" --period "current-month"

# Function invocations
/supabase usage --service "functions" --period "yesterday"
```

### Performance Monitoring
```bash
# Database performance
/supabase monitor --service "database" --metrics "query-time,connections"

# API response times
/supabase monitor --service "api" --metrics "response-time,error-rate"

# Real-time performance
/supabase monitor --service "realtime" --metrics "connection-count,message-rate"
```

## Configuration Examples

### Project Configuration
```json
{
  "supabase": {
    "project_id": "xxxxxxxxxxxxxxxxxxxxx",
    "region": "us-east-1",
    "settings": {
      "auth": {
        "enable_signup": true,
        "require_email_confirmation": true,
        "password_min_length": 8,
        "oauth_providers": ["google", "github"]
      },
      "database": {
        "enable_rls": true,
        "connection_pooling": true,
        "max_connections": 100
      },
      "storage": {
        "file_size_limit": 52428800,
        "allowed_mime_types": ["image/*", "application/pdf"]
      },
      "realtime": {
        "enabled_tables": ["posts", "comments", "notifications"]
      }
    }
  }
}
```

### Environment Template
```env
# Supabase Configuration
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Database Direct Connection
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres

# Optional: Additional Services
SUPABASE_FUNCTIONS_URL=https://[project-id].functions.supabase.co
SUPABASE_STORAGE_URL=https://[project-id].supabase.co/storage/v1
```

## Support and Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Auth Guide](https://supabase.com/docs/guides/auth)
- [Storage Guide](https://supabase.com/docs/guides/storage)

### Community
- [Discord Community](https://discord.supabase.com)
- [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- [Twitter Updates](https://twitter.com/supabase)

### Support Channels
- Community support: Discord and GitHub
- Pro support: Email support with SLA
- Enterprise support: Dedicated support team
- Status page: [status.supabase.com](https://status.supabase.com)

### Learning Resources
- [Supabase University](https://supabase.com/docs/guides/getting-started)
- [YouTube Channel](https://youtube.com/c/supabase)
- [Blog Tutorials](https://supabase.com/blog)

---

**Supabase MCP provides a complete Backend-as-a-Service integration for rapid development! ⚡**