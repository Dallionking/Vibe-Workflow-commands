# Vibe Coding Version Management System

## Agent Configuration
- **Command**: `/vibe-version`
- **Subcommands**: 
  - `/vibe-version-create` - Create new version/release
  - `/vibe-version-list` - List all versions
  - `/vibe-version-compare` - Compare versions
  - `/vibe-version-rollback` - Rollback to previous version
  - `/vibe-version-tag` - Tag current state as version
- **Prerequisites**: `.vibe-status.md` exists
- **Outputs**: 
  - `.vibe/versions/`
  - `.vibe/version-history.json`
  - `CHANGELOG.md` (updated)
- **MCP Tools**: 
  - Context7 (for documentation research)
  - Sequential Thinking (for detailed version analysis)

## Mission Statement
**I am the Version Management Agent.** I help teams track, manage, and navigate different versions of their Vibe Coding projects, providing semantic versioning, changelog generation, and intelligent rollback capabilities.

## Core Functionality

### 1. Version Creation and Tagging
**Purpose**: Create meaningful project versions that capture complete project state

```typescript
interface ProjectVersion {
  version: string;           // Semantic version (e.g., "1.2.3")
  timestamp: string;         // ISO timestamp
  author: string;           // Creator name/email
  description: string;      // Version description
  type: 'major' | 'minor' | 'patch' | 'prerelease';
  files: {
    docs: string[];         // Documentation files included
    phases: string[];       // Phase files included
    config: string[];       // Configuration files
    dependencies: string[]; // External dependencies
  };
  metrics: {
    completionPercentage: number;
    qualityScore: number;
    testCoverage: number;
    documentationScore: number;
  };
  gitCommit?: string;       // Associated git commit hash
  notes: string[];          // Additional notes and context
}
```

### 2. Intelligent Version Detection
**Algorithm**: Analyze project changes to suggest version type

```javascript
function detectVersionType(changes) {
  const majorChanges = [
    'Architecture overhaul',
    'Breaking API changes',
    'New step methodology',
    'Complete workflow redesign'
  ];
  
  const minorChanges = [
    'New features added',
    'New phase created',
    'Enhanced documentation',
    'New agent capabilities'
  ];
  
  const patchChanges = [
    'Bug fixes',
    'Documentation updates',
    'Template improvements',
    'Quality improvements'
  ];
  
  // Analyze git diff and file changes
  if (hasBreakingChanges(changes)) return 'major';
  if (hasNewFeatures(changes)) return 'minor';
  return 'patch';
}
```

### 3. Comprehensive Changelog Generation
**Purpose**: Auto-generate detailed changelogs from project evolution

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- Browser testing integration with Playwright
- Visual regression testing capabilities
- Accessibility testing (WCAG 2.1 AA)
- Performance monitoring with Lighthouse

### Changed
- Enhanced work validator with browser testing
- Updated Universal Format templates
- Improved MCP setup agent

### Fixed
- Step 7 → Step 8 integration issues
- Documentation formatting inconsistencies

### Documentation
- Added Step 7 methodology guide
- Created integration documentation
- Updated quality standards

### Technical
- Added 5 new browser testing commands
- Enhanced quality-checks.json validation
- Improved agent orchestration
```

### 4. Version Comparison and Analysis
**Purpose**: Compare different versions to understand evolution

```typescript
interface VersionComparison {
  from: ProjectVersion;
  to: ProjectVersion;
  differences: {
    filesAdded: string[];
    filesRemoved: string[];
    filesModified: string[];
    stepsChanged: string[];
    phasesChanged: string[];
  };
  metrics: {
    completionDelta: number;
    qualityDelta: number;
    featureCount: number;
    documentationGrowth: number;
  };
  recommendations: string[];
  riskAssessment: 'low' | 'medium' | 'high';
}
```

## Command Implementations

### `/vibe-version-create [type] [description]`
**Purpose**: Create a new project version

```bash
# Examples:
/vibe-version-create minor "Added browser testing integration"
/vibe-version-create major "Complete workflow redesign with new methodology"
/vibe-version-create patch "Fixed documentation formatting issues"
```

**Process**:
1. Analyze current project state
2. Detect changes since last version
3. Suggest version type if not specified
4. Generate comprehensive changelog
5. Create version snapshot
6. Update version history
7. Tag git commit (if applicable)

### `/vibe-version-list [--format=table|json]`
**Purpose**: Display all project versions

```bash
# Table format (default)
VERSION   DATE         TYPE    AUTHOR           DESCRIPTION
v1.2.0    2024-01-15   minor   marcus@team.com  Browser testing integration
v1.1.5    2024-01-10   patch   sarah@team.com   Documentation updates
v1.1.0    2024-01-05   minor   emily@team.com   Enhanced design system

# JSON format
/vibe-version-list --format=json
```

### `/vibe-version-compare <from-version> <to-version>`
**Purpose**: Compare two versions in detail

```bash
# Compare specific versions
/vibe-version-compare v1.1.0 v1.2.0

# Compare with current state
/vibe-version-compare v1.1.0 current

# Compare with previous version
/vibe-version-compare v1.1.0 previous
```

### `/vibe-version-rollback <version> [--confirm]`
**Purpose**: Rollback to a previous version

```bash
# Preview rollback (safe mode)
/vibe-version-rollback v1.1.0

# Execute rollback (requires confirmation)
/vibe-version-rollback v1.1.0 --confirm
```

### `/vibe-version-tag <version> [description]`
**Purpose**: Tag current state as a specific version

```bash
# Tag current state
/vibe-version-tag v1.2.0-beta "Beta release for testing"

# Tag with detailed description
/vibe-version-tag v2.0.0-rc1 "Release candidate with new architecture"
```

## Version Management Workflow

### 1. Development Cycle Integration
```bash
# Start new feature development
git checkout -b feature/browser-testing
/vibe-version-tag dev-start "Starting browser testing feature"

# Development iterations
# ... make changes ...
/vibe-version-create patch "Work in progress - browser setup"

# Feature completion
/vibe-version-create minor "Browser testing integration complete"
git tag v1.2.0
```

### 2. Release Management
```bash
# Pre-release preparation
/vibe-version-compare v1.1.0 current
/vibe-validate-work --comprehensive

# Create release candidate
/vibe-version-create prerelease "Release candidate for v1.2.0"

# Final release
/vibe-version-create minor "Browser testing and quality improvements"
```

### 3. Maintenance and Hotfixes
```bash
# Critical bug fix
git checkout v1.1.0
git checkout -b hotfix/critical-security-fix

# Apply fix and create patch version
/vibe-version-create patch "Security vulnerability fix"
git tag v1.1.1
```

## Version Storage Structure

### Directory Organization
```
.vibe/versions/
├── v1.0.0/
│   ├── snapshot.json          # Complete project state
│   ├── docs/                  # Documentation at this version
│   ├── phases/                # Phase files at this version
│   ├── agents/                # Agent configurations
│   └── metadata.json          # Version metadata
├── v1.1.0/
│   └── ... (same structure)
└── version-index.json         # Index of all versions
```

### Version Metadata Format
```json
{
  "version": "1.2.0",
  "type": "minor",
  "timestamp": "2024-01-15T10:30:00Z",
  "author": {
    "name": "Marcus Rodriguez",
    "email": "marcus@teamflow.com"
  },
  "description": "Browser testing integration and quality improvements",
  "changes": {
    "filesAdded": [
      "agents/utilities/browser-testing-setup.md",
      "agents/utilities/visual-regression-tester.md"
    ],
    "filesModified": [
      "validation/quality-checks.json",
      "templates/universal-vertical-slice-format.md"
    ],
    "stepsAffected": ["step-2.5", "validation"],
    "phasesAffected": []
  },
  "metrics": {
    "completionPercentage": 95,
    "qualityScore": 9.2,
    "testCoverage": 97,
    "documentationScore": 9.4,
    "agentCount": 23,
    "commandCount": 47
  },
  "gitCommit": "a1b2c3d4e5f6",
  "dependencies": {
    "mcpTools": ["context7", "perplexity", "sequential-thinking"],
    "browserTesting": ["playwright", "lighthouse", "axe-core"]
  },
  "notes": [
    "Major enhancement to quality assurance capabilities",
    "Integrated browser testing across all phases",
    "Enhanced accessibility and performance validation"
  ]
}
```

## Intelligent Version Suggestions

### Change Analysis Engine
```typescript
class VersionAnalyzer {
  analyzeChanges(previousVersion: ProjectVersion, currentState: ProjectState): VersionSuggestion {
    const changes = this.detectChanges(previousVersion, currentState);
    
    // Breaking changes detection
    if (this.hasBreakingChanges(changes)) {
      return {
        suggestedType: 'major',
        reason: 'Breaking changes detected',
        details: changes.breakingChanges
      };
    }
    
    // New features detection
    if (this.hasNewFeatures(changes)) {
      return {
        suggestedType: 'minor',
        reason: 'New features added',
        details: changes.newFeatures
      };
    }
    
    // Bug fixes and improvements
    return {
      suggestedType: 'patch',
      reason: 'Bug fixes and improvements',
      details: changes.improvements
    };
  }
  
  private hasBreakingChanges(changes: ProjectChanges): boolean {
    return changes.files.some(file => 
      file.path.includes('technical-architecture.md') ||
      file.path.includes('claude.json') ||
      file.changeType === 'structure-change'
    );
  }
}
```

### Quality Impact Assessment
```typescript
interface QualityImpact {
  score: number;           // Overall quality impact (-10 to +10)
  areas: {
    documentation: number; // Impact on documentation quality
    testing: number;       // Impact on test coverage
    architecture: number;  // Impact on system architecture
    usability: number;     // Impact on user experience
  };
  risks: Risk[];          // Identified risks
  recommendations: string[]; // Improvement suggestions
}
```

## Rollback System Integration

### Safe Rollback Procedures
```bash
# Create safety checkpoint before rollback
/vibe-version-create checkpoint "Pre-rollback safety checkpoint"

# Analyze rollback impact
/vibe-version-compare current v1.1.0 --analysis

# Execute staged rollback
/vibe-version-rollback v1.1.0 --staged --backup-current

# Verify rollback success
/vibe-validate-work --post-rollback
```

### Rollback Impact Analysis
```typescript
interface RollbackAnalysis {
  version: string;
  impact: {
    filesAffected: number;
    featuresLost: string[];
    configurationChanges: string[];
    dependencyChanges: string[];
  };
  risks: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigations: string[];
  };
  recommendations: {
    preRollback: string[];
    postRollback: string[];
    alternatives: string[];
  };
}
```

## Advanced Features

### 1. Version Branching Strategy
```bash
# Create development branch from version
/vibe-version-branch v1.1.0 feature/new-analytics

# Merge branch with version tracking
/vibe-version-merge feature/new-analytics --into=main --version-type=minor
```

### 2. Collaborative Version Management
```json
{
  "collaborators": [
    {
      "name": "Sarah Chen",
      "role": "Product Manager",
      "permissions": ["create", "tag", "compare"],
      "restricted": ["rollback"]
    },
    {
      "name": "Marcus Rodriguez", 
      "role": "Lead Developer",
      "permissions": ["all"],
      "restricted": []
    }
  ],
  "approvalWorkflow": {
    "majorVersions": ["product-manager", "lead-developer"],
    "minorVersions": ["lead-developer"],
    "patchVersions": ["any-developer"]
  }
}
```

### 3. Automated Version Management
```yaml
# .vibe/automation/versioning.yml
triggers:
  onPhaseCompletion:
    action: "create-patch"
    description: "Auto-patch on phase completion"
  
  onStepCompletion:
    action: "tag-checkpoint"
    description: "Checkpoint on major step completion"
  
  onQualityGatePass:
    action: "suggest-minor"
    description: "Suggest minor version on quality improvements"

policies:
  maxPatchVersions: 10      # Auto-consolidate after 10 patches
  autoCleanup: true         # Remove old development versions
  backupBeforeRollback: true # Always create backup before rollback
```

## Integration with Existing Systems

### Git Integration
```bash
# Sync with git tags
/vibe-version-sync-git

# Create git tags from versions
/vibe-version-to-git-tags

# Import git tags as versions
/vibe-git-tags-to-versions
```

### CI/CD Integration
```yaml
# Integration with GitHub Actions
- name: Create Version
  if: github.ref == 'refs/heads/main'
  run: |
    /vibe-version-create minor "Automated release from CI/CD"
    
- name: Deploy Version
  run: |
    VERSION=$(/vibe-version-list --latest --format=json | jq -r '.version')
    echo "Deploying version $VERSION"
```

### Quality Assurance Integration
```bash
# Version-aware quality checks
/vibe-validate-work --version=v1.2.0 --compare-with=v1.1.0

# Quality trend analysis
/vibe-version-quality-trend --from=v1.0.0 --to=current
```

## Reporting and Analytics

### Version History Report
```markdown
# Project Version History

## Summary
- **Total Versions**: 15
- **Latest Version**: v1.2.0
- **Development Duration**: 3 months
- **Quality Trend**: ↗ Improving
- **Completion Rate**: 95%

## Version Timeline
- v1.0.0 (2023-10-15): Initial release
- v1.1.0 (2023-11-20): Enhanced UX design
- v1.2.0 (2024-01-15): Browser testing integration

## Quality Evolution
- Documentation Score: 7.2 → 9.4 (+30%)
- Test Coverage: 85% → 97% (+14%)
- Completion Rate: 70% → 95% (+36%)
```

### Version Comparison Dashboard
```typescript
interface VersionDashboard {
  metrics: {
    totalVersions: number;
    avgTimeBetweenVersions: string;
    qualityTrend: 'improving' | 'stable' | 'declining';
    featureVelocity: number;
  };
  recentActivity: VersionActivity[];
  upcomingMilestones: Milestone[];
  qualityMetrics: QualityTrend[];
}
```

## Error Handling and Recovery

### Version Corruption Recovery
```bash
# Detect version corruption
/vibe-version-validate --all

# Repair corrupted version
/vibe-version-repair v1.1.0 --from-git

# Rebuild version index
/vibe-version-rebuild-index
```

### Conflict Resolution
```bash
# Detect version conflicts
/vibe-version-conflicts

# Resolve version conflicts
/vibe-version-resolve-conflicts --strategy=merge
```

## Best Practices and Guidelines

### Version Naming Convention
- **Major (X.0.0)**: Breaking changes, new methodology
- **Minor (X.Y.0)**: New features, enhanced capabilities
- **Patch (X.Y.Z)**: Bug fixes, documentation updates
- **Prerelease (X.Y.Z-alpha/beta/rc)**: Testing versions

### Version Description Guidelines
```markdown
# Good version descriptions:
- "Added comprehensive browser testing with Playwright"
- "Enhanced Step 7 methodology with 3-part landing page process"
- "Fixed integration issues between customer avatars and vertical slices"

# Avoid:
- "Updates"
- "Changes"
- "Improvements"
```

### Version Management Workflow
1. **Regular Checkpoints**: Create versions at step completions
2. **Quality Gates**: Validate before version creation
3. **Backup Strategy**: Always backup before major changes
4. **Documentation**: Keep detailed version notes
5. **Team Communication**: Share version updates with stakeholders

This comprehensive version management system ensures that Vibe Coding projects maintain clear evolution tracking, enable safe rollbacks, and provide valuable insights into project development patterns and quality trends.