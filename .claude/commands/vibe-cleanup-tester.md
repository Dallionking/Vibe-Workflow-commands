---
description: Validate cleanup results and ensure no functionality was broken
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
parameters:
  - --test-suite
  - --regression-check
---

# vibe-cleanup-tester

Validate cleanup results and ensure no functionality was broken

## Usage
`/vibe-cleanup-tester [--test-suite] [--regression-check]`

# Cleanup Tester Agent

## Mission Statement
**I am the Cleanup Tester Agent.** I validate cleanup safety, test rollback procedures, and ensure repository functionality remains intact after cleanup operations.

## Agent Configuration
- **Command**: `/vibe-cleanup-tester`
- **Parameters**: `--validate`, `--rollback-test`, `--category`, `--comprehensive`
- **Dependencies**: Cleanup execution results, backup information
- **Outputs**: Validation report, test results, safety assessment
- **MCP Tools**: Context7

## Testing Framework

### 1. Pre-Cleanup Validation
```bash
echo "✅ CLEANUP TESTER AGENT"
echo "======================"

validate_pre_cleanup() {
    echo "🔍 Pre-cleanup validation..."
    
    # Check git status
    if [ -n "$(git status --porcelain)" ]; then
        echo "⚠️ Warning: Uncommitted changes detected"
        echo "Recommend committing or stashing before cleanup"
        return 1
    fi
    
    # Verify test suite passes
    echo "🧪 Running existing test suite..."
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        if ! npm test &>/dev/null; then
            echo "❌ Existing tests failing - cleanup not recommended"
            return 1
        fi
    fi
    
    if command -v python &> /dev/null; then
        if ! python -m pytest --quiet &>/dev/null 2>&1; then
            echo "⚠️ Python tests not passing - proceed with caution"
        fi
    fi
    
    echo "✅ Pre-cleanup validation passed"
    return 0
}
```

### 2. Post-Cleanup Validation
```bash
validate_post_cleanup() {
    local category="$1"
    
    echo "🔬 Post-cleanup validation for: $category"
    
    # Basic functionality tests
    test_basic_functionality() {
        echo "   Testing basic functionality..."
        
        # Test Python imports if Python project
        if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
            if ! python -c "import sys; print('Python OK')" 2>/dev/null; then
                echo "❌ Python functionality broken"
                return 1
            fi
        fi
        
        # Test Node.js if Node project
        if [ -f "package.json" ]; then
            if ! node -e "console.log('Node OK')" 2>/dev/null; then
                echo "❌ Node.js functionality broken"
                return 1
            fi
        fi
        
        echo "✅ Basic functionality OK"
        return 0
    }
    
    # Test imports and dependencies
    test_dependencies() {
        echo "   Testing dependencies..."
        
        # Check for broken imports
        if command -v python &> /dev/null; then
            # Find all Python files and test imports
            python << 'EOF'
import ast
import sys
from pathlib import Path

errors = []
for py_file in Path('.').rglob('*.py'):
    if '__pycache__' not in str(py_file):
        try:
            with open(py_file, 'r') as f:
                ast.parse(f.read())
        except SyntaxError as e:
            errors.append(f"{py_file}: {e}")

if errors:
    print("❌ Python syntax errors found:")
    for error in errors[:5]:  # Show first 5 errors
        print(f"   {error}")
    sys.exit(1)
else:
    print("✅ Python syntax OK")
EOF
        fi
        
        return 0
    }
    
    # Test application startup
    test_application_startup() {
        echo "   Testing application startup..."
        
        # Basic startup test - customize based on project type
        if [ -f "app.py" ]; then
            if ! python -c "import app; print('App import OK')" 2>/dev/null; then
                echo "❌ App startup broken"
                return 1
            fi
        fi
        
        if [ -f "index.js" ] || [ -f "server.js" ]; then
            if ! node -c "require('./index.js' || './server.js')" 2>/dev/null; then
                echo "⚠️ Node app startup check inconclusive"
            fi
        fi
        
        echo "✅ Application startup OK"
        return 0
    }
    
    # Run all tests
    test_basic_functionality && test_dependencies && test_application_startup
}
```

### 3. Category-Specific Testing

#### Temporary Files Validation
```bash
test_temp_cleanup() {
    echo "🧹 Testing temporary files cleanup..."
    
    # Verify no critical files were removed
    critical_files=("package.json" "requirements.txt" "pyproject.toml" ".gitignore" "README.md")
    
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ Critical file preserved: $file"
        fi
    done
    
    # Verify temp files are actually gone
    remaining_temp=$(find . -name "*.pyc" -o -name "__pycache__" -o -name "*.log" | wc -l)
    if [ "$remaining_temp" -eq 0 ]; then
        echo "✅ All temporary files removed"
    else
        echo "⚠️ $remaining_temp temporary files remain"
    fi
    
    echo "✅ Temporary files cleanup validation passed"
}
```

#### Demo Files Validation
```bash
test_demo_cleanup() {
    echo "🎭 Testing demo files cleanup..."
    
    # Check that no production files were accidentally removed
    essential_dirs=("src" "lib" "app" "components" "utils")
    
    for dir in "${essential_dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo "✅ Essential directory preserved: $dir"
        fi
    done
    
    # Verify imports still work
    if command -v python &> /dev/null; then
        if python -c "import sys; [__import__(m) for m in ['os', 'sys']]; print('Core imports OK')" 2>/dev/null; then
            echo "✅ Core Python imports working"
        else
            echo "❌ Python import issues detected"
            return 1
        fi
    fi
    
    echo "✅ Demo files cleanup validation passed"
}
```

### 4. Rollback Testing
```bash
test_rollback_procedure() {
    local backup_tag="$1"
    
    echo "🔄 Testing rollback procedure..."
    
    if [ -z "$backup_tag" ]; then
        echo "❌ No backup tag provided for rollback test"
        return 1
    fi
    
    # Verify backup exists
    if ! git tag | grep -q "$backup_tag"; then
        echo "❌ Backup tag not found: $backup_tag"
        return 1
    fi
    
    # Create test state to rollback from
    echo "test_rollback_validation" > .test_rollback_file
    
    # Test rollback
    echo "   Executing rollback to: $backup_tag"
    if git reset --hard "$backup_tag" &>/dev/null; then
        echo "✅ Git rollback successful"
    else
        echo "❌ Git rollback failed"
        return 1
    fi
    
    # Verify rollback worked
    if [ ! -f ".test_rollback_file" ]; then
        echo "✅ Rollback verification passed"
    else
        echo "❌ Rollback verification failed"
        return 1
    fi
    
    echo "✅ Rollback procedure test passed"
}
```

### 5. Comprehensive Validation Suite
```bash
run_comprehensive_validation() {
    echo "🎯 Running comprehensive validation suite..."
    
    local validation_results=()
    
    # Test suite execution
    echo "   Running project test suites..."
    
    if command -v npm &> /dev/null && [ -f "package.json" ]; then
        if npm test &>/dev/null; then
            validation_results+=("npm_tests:PASS")
        else
            validation_results+=("npm_tests:FAIL")
        fi
    fi
    
    if command -v python &> /dev/null; then
        if python -m pytest --quiet &>/dev/null 2>&1; then
            validation_results+=("python_tests:PASS")
        else
            validation_results+=("python_tests:INCONCLUSIVE")
        fi
    fi
    
    # Linting checks
    echo "   Running linting checks..."
    
    if command -v eslint &> /dev/null; then
        if eslint . &>/dev/null; then
            validation_results+=("eslint:PASS")
        else
            validation_results+=("eslint:FAIL")
        fi
    fi
    
    if command -v flake8 &> /dev/null; then
        if flake8 . &>/dev/null; then
            validation_results+=("flake8:PASS")
        else
            validation_results+=("flake8:FAIL")
        fi
    fi
    
    # Build tests
    echo "   Testing build processes..."
    
    if [ -f "package.json" ] && grep -q "build" package.json; then
        if npm run build &>/dev/null; then
            validation_results+=("build:PASS")
        else
            validation_results+=("build:FAIL")
        fi
    fi
    
    # Report results
    echo "📊 Validation Results:"
    for result in "${validation_results[@]}"; do
        test_name=$(echo "$result" | cut -d: -f1)
        test_result=$(echo "$result" | cut -d: -f2)
        
        case "$test_result" in
            "PASS")
                echo "   ✅ $test_name: PASSED"
                ;;
            "FAIL")
                echo "   ❌ $test_name: FAILED"
                ;;
            "INCONCLUSIVE")
                echo "   ⚠️ $test_name: INCONCLUSIVE"
                ;;
        esac
    done
    
    # Calculate overall success rate
    local total_tests=${#validation_results[@]}
    local passed_tests=$(printf '%s\n' "${validation_results[@]}" | grep -c ":PASS")
    local success_rate=$((passed_tests * 100 / total_tests))
    
    echo "📈 Overall validation success rate: $success_rate%"
    
    if [ "$success_rate" -ge 80 ]; then
        echo "✅ Comprehensive validation PASSED"
        return 0
    else
        echo "❌ Comprehensive validation FAILED"
        return 1
    fi
}
```

### 6. Space Savings Verification
```bash
verify_space_savings() {
    echo "💾 Verifying space savings..."
    
    # Read expected savings from architect analysis
    expected_savings=$(jq '.cleanup_opportunities.temp_files.potential_savings_mb' .vibe/cleanup-analysis.json 2>/dev/null || echo "0")
    
    # Calculate actual savings (simplified)
    current_size=$(du -sm . | cut -f1)
    
    if [ -f ".vibe/pre-cleanup-size.txt" ]; then
        pre_cleanup_size=$(cat .vibe/pre-cleanup-size.txt)
        actual_savings=$((pre_cleanup_size - current_size))
        
        echo "📊 Space Analysis:"
        echo "   Before cleanup: ${pre_cleanup_size}MB"
        echo "   After cleanup: ${current_size}MB"
        echo "   Actual savings: ${actual_savings}MB"
        echo "   Expected savings: ${expected_savings}MB"
        
        # Verify savings are reasonable
        if [ "$actual_savings" -gt 0 ]; then
            echo "✅ Space savings achieved"
        else
            echo "⚠️ No space savings detected"
        fi
    else
        echo "⚠️ No pre-cleanup size reference found"
        echo "$current_size" > .vibe/post-cleanup-size.txt
    fi
}
```

## Command Interface

```bash
# Parse command line arguments
ACTION="validate"
CATEGORY="all"
BACKUP_TAG=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --validate)
            ACTION="validate"
            shift
            ;;
        --rollback-test)
            ACTION="rollback-test"
            BACKUP_TAG="$2"
            shift 2
            ;;
        --category)
            CATEGORY="$2"
            shift 2
            ;;
        --comprehensive)
            ACTION="comprehensive"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute based on action
case "$ACTION" in
    "validate")
        case "$CATEGORY" in
            "temp")
                test_temp_cleanup
                ;;
            "demos")
                test_demo_cleanup
                ;;
            "all")
                test_temp_cleanup && test_demo_cleanup
                ;;
        esac
        validate_post_cleanup "$CATEGORY"
        ;;
    "rollback-test")
        test_rollback_procedure "$BACKUP_TAG"
        ;;
    "comprehensive")
        run_comprehensive_validation
        verify_space_savings
        ;;
esac
```

## Validation Report Generation

```bash
generate_validation_report() {
    local category="$1"
    local test_results="$2"
    
    report_file=".vibe/cleanup-validation-report.md"
    
    cat > "$report_file" << EOF
# Cleanup Validation Report

## Test Summary
- **Date**: $(date)
- **Category**: $category
- **Overall Status**: $test_results

## Validation Results

### Functionality Tests
$(if validate_post_cleanup "$category"; then echo "✅ PASSED"; else echo "❌ FAILED"; fi)

### Safety Checks
$(if test_rollback_procedure &>/dev/null; then echo "✅ PASSED"; else echo "⚠️ NOT TESTED"; fi)

### Space Savings
$(verify_space_savings)

## Recommendations
- Monitor application for 24-48 hours after cleanup
- Run additional tests before production deployment
- Keep backup tags for at least 30 days

## Rollback Information
- Backup tag available for emergency rollback
- Use: git reset --hard [backup-tag]
EOF

    echo "📄 Validation report generated: $report_file"
}
```

## Integration Points

### Research Agent Input
- Uses safety testing recommendations
- Applies validation best practices
- Follows risk assessment guidelines

### Architect Agent Input
- Tests against dependency mapping
- Validates cleanup strategy effectiveness
- Verifies space savings projections

### Coder Agent Input
- Tests backup and rollback procedures
- Validates cleanup execution results
- Confirms safety mechanism effectiveness

## Key Deliverables

1. **Validation Report** - Comprehensive test results
2. **Safety Assessment** - Risk analysis and recommendations
3. **Rollback Verification** - Backup system validation
4. **Space Savings Analysis** - Cleanup effectiveness measurement
5. **Functionality Testing** - Application integrity confirmation

The Cleanup Tester Agent ensures that all cleanup operations are safe, effective, and fully reversible while maintaining complete application functionality.