# vibe-retrofit-api

Systematically retrofit API endpoints in existing codebases to modern standards and best practices.

## Usage
```
/vibe-retrofit-api [endpoint-pattern] [options]
```

## Parameters
- `endpoint-pattern` - Optional pattern to match specific endpoints (e.g., "/api/users/*")

## Options
- `--rest-to-graphql` - Convert REST APIs to GraphQL
- `--add-versioning` - Add API versioning (v1, v2, etc.)
- `--enhance-validation` - Add comprehensive input validation
- `--add-rate-limiting` - Implement rate limiting
- `--improve-errors` - Standardize error responses
- `--add-documentation` - Generate OpenAPI/Swagger docs
- `--dry-run` - Preview changes without applying

## Features

### API Analysis
- Scan all API endpoints
- Identify patterns and inconsistencies
- Detect security vulnerabilities
- Analyze performance bottlenecks

### Modernization Options
1. **RESTful Standards**
   - Proper HTTP methods
   - Status code compliance
   - Resource naming conventions
   - HATEOAS implementation

2. **Security Enhancements**
   - Authentication/authorization
   - Input validation and sanitization
   - Rate limiting and throttling
   - CORS configuration

3. **Performance Optimization**
   - Response caching
   - Pagination implementation
   - Query optimization
   - Compression

4. **Documentation**
   - OpenAPI/Swagger generation
   - Inline code documentation
   - Example requests/responses
   - Error code reference

## Examples
```bash
# Retrofit all APIs
/vibe-retrofit-api

# Target specific endpoints
/vibe-retrofit-api "/api/v1/users/*"

# Convert REST to GraphQL
/vibe-retrofit-api --rest-to-graphql

# Add versioning and validation
/vibe-retrofit-api --add-versioning --enhance-validation

# Full modernization
/vibe-retrofit-api --add-versioning --enhance-validation --add-rate-limiting --improve-errors --add-documentation
```

## Output
- Updated API files with improvements
- Migration guide for breaking changes
- OpenAPI documentation
- Test suite updates
- Performance benchmarks

## Integration
- Works with existing test suites
- Maintains backward compatibility options
- Updates route configurations
- Integrates with API gateways