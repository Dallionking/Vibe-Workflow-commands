---
description: Transform existing phase documentation into new context-enhanced format with integrated UI healing
allowed-tools:
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
  - file_path
  - --backup
  - --dry-run
  - --verbose
---

# vibe-reformat-phases

Transform existing phase documentation into new context-enhanced format with integrated UI healing

## Usage
`/vibe-reformat-phases <file_path> [--backup] [--dry-run] [--verbose]`

# Phase Reformatter Agent - Convert Existing Phases to New Format

## Mission Statement
**I am the Phase Reformatter Agent.** I transform existing phase documentation into the new context-enhanced format with integrated UI healing and the two-command validation system. I preserve all your existing content while adding powerful new capabilities for context awareness, pattern matching, and automated UI quality assurance.

## Agent Configuration
- **Command**: `/vibe-reformat-phases`
- **Parameters**: 
  - `[file_path]` - Single phase file or directory path
  - `--backup` - Create backup files (default: true)
  - `--dry-run` - Preview changes without modifying files
  - `--verbose` - Show detailed transformation steps
- **Dependencies**: None (works with existing phase files)
- **Outputs**: Reformatted phase files with new sections added
- **MCP Tools**: None required

## Pre-Execution Validation
```bash
echo "📄 PHASE REFORMATTER AGENT"
echo "=========================="

validate_input() {
    local input_path="$1"
    
    echo "🔍 Validating input path: $input_path"
    
    if [ -z "$input_path" ]; then
        echo "❌ Error: Please provide a file or directory path"
        echo "   Usage: /vibe-reformat-phases [path]"
        echo "   Example: /vibe-reformat-phases phases/"
        echo "   Example: /vibe-reformat-phases phase-01-auth.md"
        exit 1
    fi
    
    if [ ! -e "$input_path" ]; then
        echo "❌ Error: Path does not exist: $input_path"
        exit 1
    fi
    
    echo "✅ Input validation passed"
}
```

## Execution Framework

<goal>
You are an expert in phase documentation transformation with deep understanding of:
- The Vibe Coding 10-step methodology
- Context engineering principles
- The two-command validation system (work validator + UI healer)
- Pattern recognition and matching requirements
- UI quality standards and design system compliance

Your task is to intelligently transform existing phase documentation by:
1. Preserving ALL existing content
2. Adding context engineering enhancements
3. Integrating UI healing checkpoints
4. Updating validation to use the two-command system
5. Adding PRPs and measurable success criteria
6. Maintaining backward compatibility
</goal>

### Phase 1: Analysis & Detection

#### 1.1 Format Detection
```javascript
function detectPhaseFormat(content) {
    const formats = {
        contextEnhanced: {
            markers: ['Context Assembly Layer', 'PRPs', 'Pattern Matching'],
            version: '3.0'
        },
        standard: {
            markers: ['Implementation Tasks', 'Tier 1', 'Subtask'],
            version: '2.0'
        },
        legacy: {
            markers: ['## Tasks', '### Task'],
            version: '1.0'
        }
    };
    
    for (const [name, format] of Object.entries(formats)) {
        const hasAllMarkers = format.markers.every(marker => 
            content.includes(marker)
        );
        if (hasAllMarkers) {
            return { name, version: format.version };
        }
    }
    
    return { name: 'unknown', version: '0.0' };
}
```

#### 1.2 Content Structure Analysis
```javascript
function analyzePhaseContent(content) {
    const analysis = {
        hasUITasks: false,
        hasBackendTasks: false,
        hasDatabaseTasks: false,
        technologyStack: [],
        existingSections: [],
        taskCount: 0,
        validationMentions: []
    };
    
    // Detect UI tasks
    const uiKeywords = ['component', 'UI', 'frontend', 'React', 'Vue', 'Angular', 'CSS', 'design', 'shadcn'];
    analysis.hasUITasks = uiKeywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Detect backend tasks
    const backendKeywords = ['API', 'endpoint', 'database', 'server', 'backend', 'Node', 'Python'];
    analysis.hasBackendTasks = backendKeywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Count tasks
    analysis.taskCount = (content.match(/Subtask \d+\.\d+/g) || []).length;
    
    // Find existing sections
    const sectionRegex = /^#{1,3} (.+)$/gm;
    let match;
    while ((match = sectionRegex.exec(content)) !== null) {
        analysis.existingSections.push(match[1]);
    }
    
    return analysis;
}
```

### Phase 2: Transformation Engine

#### 2.1 Add Context Assembly Layer
```javascript
function addContextAssemblyLayer(content, phaseNumber) {
    const contextLayer = `
## Context Assembly Layer (NEW)
\`\`\`yaml
context_requirements:
  global_context:
    - Project conventions from CLAUDE.md v2.0
    - Detected patterns: [Auto-detected from your codebase]
    - Team preferences: [Learned from previous phases]
  
  phase_dependencies:
    - Phase ${phaseNumber - 1}: [Previous phase] (status)
    - Required: [Dependencies from previous phases]
  
  learned_patterns:
    - Component pattern: "[Your detected pattern]"
    - State pattern: "[Your detected pattern]"
    - API pattern: "[Your detected pattern]"
    - Test pattern: "[Your detected pattern]"
\`\`\`
`;
    
    // Insert after phase title
    const titleMatch = content.match(/^# .+$/m);
    if (titleMatch) {
        const insertPos = titleMatch.index + titleMatch[0].length;
        return content.slice(0, insertPos) + '\n' + contextLayer + content.slice(insertPos);
    }
    
    return contextLayer + content;
}
```

#### 2.2 Add Product Requirements Prompts (PRPs)
```javascript
function addPRPSection(content, analysis) {
    const prpSection = `
## Product Requirements Prompt (PRP) - Context Enhanced
\`\`\`markdown
You are implementing [Feature Name] for [project type].

CONTEXT FROM YOUR CODEBASE (Auto-loaded):
- Authentication pattern: [Detected from your code]
- State management: [Your specific Redux/Context patterns]
- API structure: [Your REST/GraphQL patterns]
- Component patterns: [Your React/Vue/Angular patterns]

PATTERN EXAMPLES FROM YOUR CODE:
- Component example: src/components/[YourComponent].tsx
- API example: src/routes/[YourRoute].ts
- State example: src/store/[YourSlice].ts
- Test example: __tests__/[YourTest].test.ts

VALIDATION REQUIREMENTS:
- Match detected patterns with 95%+ similarity
- Follow your naming conventions exactly
- Use your error handling patterns
- Maintain your file structure
\`\`\`
`;
    
    // Insert after Context Assembly Layer
    const contextMatch = content.match(/## Context Assembly Layer[\s\S]*?\`\`\`/m);
    if (contextMatch) {
        const insertPos = contextMatch.index + contextMatch[0].length;
        return content.slice(0, insertPos) + '\n' + prpSection + content.slice(insertPos);
    }
    
    return content + prpSection;
}
```

#### 2.3 Transform Validation Sections
```javascript
function updateValidationSections(content) {
    // Replace old validation patterns with two-command system
    const validationPatterns = [
        {
            old: /\/vibe-validate-work\s+--comprehensive/g,
            new: '/vibe-validate-work --comprehensive\n  - [ ] Review code quality report\n  - [ ] /vibe-ui-healer --threshold=8 # For UI components'
        },
        {
            old: /Run validation agent/g,
            new: 'Run two-command validation:\n  - [ ] Code validation: `/vibe-validate-work`\n  - [ ] UI validation: `/vibe-ui-healer`'
        },
        {
            old: /\*\*CRITICAL\*\*: Invoke validation agent/g,
            new: '**CRITICAL**: Invoke two-command validation system'
        }
    ];
    
    let updatedContent = content;
    for (const pattern of validationPatterns) {
        updatedContent = updatedContent.replace(pattern.old, pattern.new);
    }
    
    return updatedContent;
}
```

#### 2.4 Add UI Healing Checkpoints
```javascript
function addUIHealingCheckpoints(content, analysis) {
    if (!analysis.hasUITasks) {
        return content; // No UI tasks, no healing needed
    }
    
    const uiHealingCheckpoint = `
##### 🏥 UI Quality Validation Checkpoint
- [ ] **Run UI testing and healing**: \`/vibe-ui-healer --threshold=8\`
  \`\`\`yaml
  Expected Results:
  - Browser Compatibility: All browsers pass ✓
  - Visual Regression: Matches baseline ✓
  - Accessibility: WCAG AA compliant ✓
  - Responsive Design: All breakpoints ✓
  - Design System Score: 8+/10 ✓
  \`\`\`
- [ ] Review UI quality report
- [ ] Verify automated improvements
- [ ] Test UI changes in browser
- [ ] Approve healing modifications
`;
    
    // Add after UI-related subtasks
    const uiTaskPattern = /#### Subtask \d+\.\d+:.*(?:UI|Component|Frontend|Design)[\s\S]*?(?=####|###|$)/g;
    
    return content.replace(uiTaskPattern, (match) => {
        // Only add if checkpoint doesn't already exist
        if (!match.includes('UI Quality Validation Checkpoint')) {
            return match.trimEnd() + '\n' + uiHealingCheckpoint + '\n\n';
        }
        return match;
    });
}
```

#### 2.5 Update Final Validation Section
```javascript
function updateFinalValidation(content) {
    const oldValidationPattern = /#### Subtask \d+\.\d+:.*(?:Validation|Quality Assurance)[\s\S]*?(?=####|###|$)/;
    
    const newValidation = `
#### Subtask 3.4: Pre-Commit Validation & Quality Assurance (ENHANCED)
- [ ] **CRITICAL**: Invoke two-command validation system
  
  **Step 1 - Code Validation**:
  - [ ] \`/vibe-validate-work --phase="[Phase Number]" --comprehensive\`
  - [ ] Validation checks:
    - [ ] Code quality review
    - [ ] Bug detection
    - [ ] Security scanning
    - [ ] Test coverage (95%+ requirement)
    - [ ] Integration testing
    - [ ] Pattern compliance (95%+ similarity)
    - [ ] Documentation completeness
  
  **Step 2 - UI Validation** (if UI changes exist):
  - [ ] \`/vibe-ui-healer --comprehensive --threshold=8\`
  - [ ] UI checks:
    - [ ] Browser compatibility (all target browsers)
    - [ ] Visual regression testing
    - [ ] Accessibility compliance (WCAG AA)
    - [ ] Responsive design validation
    - [ ] Design system adherence (8+/10)
    - [ ] Performance metrics
  
  - [ ] **Pattern Compliance Report**:
    \`\`\`yaml
    Pattern Matching Results:
    - Component patterns: X% match
    - API patterns: X% match
    - Test patterns: X% match
    - Overall compliance: X% (must be 95%+)
    \`\`\`
  
  - [ ] **If validation finds issues**: 
    - [ ] Review detailed reports
    - [ ] Fix all identified problems
    - [ ] Re-run validation: \`/vibe-validate-work --recheck\`
    - [ ] Re-run UI healing if needed: \`/vibe-ui-healer --recheck\`
  
  - [ ] **USER ACTION REQUIRED**: Review both validation reports
`;
    
    if (content.match(oldValidationPattern)) {
        return content.replace(oldValidationPattern, newValidation);
    }
    
    // If no validation section exists, add before final documentation task
    const docPattern = /#### Subtask \d+\.\d+:.*(?:Documentation|Final)/;
    if (content.match(docPattern)) {
        return content.replace(docPattern, newValidation + '\n\n$&');
    }
    
    return content + newValidation;
}
```

### Phase 3: File Processing

#### 3.1 Process Single File
```javascript
function processSingleFile(filePath, options) {
    console.log(`\n📄 Processing: ${filePath}`);
    
    try {
        // Read file
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Detect format
        const format = detectPhaseFormat(content);
        console.log(`   Format detected: ${format.name} (v${format.version})`);
        
        if (format.version === '3.0') {
            console.log(`   ✅ Already in new format, skipping`);
            return { status: 'skipped', reason: 'already-formatted' };
        }
        
        // Create backup if requested
        if (options.backup) {
            const backupPath = filePath.replace(/\.md$/, '.backup.md');
            fs.copyFileSync(filePath, backupPath);
            console.log(`   📋 Backup created: ${backupPath}`);
        }
        
        // Analyze content
        const analysis = analyzePhaseContent(content);
        console.log(`   📊 Analysis: UI=${analysis.hasUITasks}, Backend=${analysis.hasBackendTasks}`);
        
        // Extract phase number
        const phaseMatch = filePath.match(/phase[\-_]?(\d+)/i);
        const phaseNumber = phaseMatch ? parseInt(phaseMatch[1]) : 1;
        
        // Apply transformations
        let transformedContent = content;
        
        // 1. Add Context Assembly Layer
        transformedContent = addContextAssemblyLayer(transformedContent, phaseNumber);
        
        // 2. Add PRPs
        transformedContent = addPRPSection(transformedContent, analysis);
        
        // 3. Update validation sections
        transformedContent = updateValidationSections(transformedContent);
        
        // 4. Add UI healing checkpoints
        transformedContent = addUIHealingCheckpoints(transformedContent, analysis);
        
        // 5. Update final validation
        transformedContent = updateFinalValidation(transformedContent);
        
        // 6. Add context memory update section
        transformedContent = addContextMemorySection(transformedContent, phaseNumber);
        
        // Write transformed content
        if (!options.dryRun) {
            fs.writeFileSync(filePath, transformedContent);
            console.log(`   ✅ File reformatted successfully`);
        } else {
            console.log(`   🔍 Dry run - no changes written`);
        }
        
        return { 
            status: 'success', 
            changes: {
                contextLayer: true,
                prps: true,
                uiHealing: analysis.hasUITasks,
                validation: true
            }
        };
        
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return { status: 'error', error: error.message };
    }
}
```

#### 3.2 Add Context Memory Section
```javascript
function addContextMemorySection(content, phaseNumber) {
    const memorySection = `
  - [ ] **NEW**: Update context memory with learned patterns:
    \`\`\`json
    {
      "phase_${phaseNumber}_patterns": {
        "successful_patterns": [],
        "team_preferences": [],
        "avoided_patterns": [],
        "performance_optimizations": []
      }
    }
    \`\`\``;
    
    // Add to documentation section
    const docPattern = /Update \`features\.md\` with completed features/;
    if (content.match(docPattern)) {
        return content.replace(docPattern, '$&\n' + memorySection);
    }
    
    return content;
}
```

### Phase 4: Batch Processing

```bash
process_directory() {
    local dir_path="$1"
    local options="$2"
    
    echo "📁 Processing directory: $dir_path"
    echo "================================"
    
    # Find all .md files
    local phase_files=($(find "$dir_path" -name "phase*.md" -o -name "Phase*.md" | sort))
    
    if [ ${#phase_files[@]} -eq 0 ]; then
        echo "❌ No phase files found in directory"
        exit 1
    fi
    
    echo "Found ${#phase_files[@]} phase files to process"
    
    local success_count=0
    local skip_count=0
    local error_count=0
    
    for file in "${phase_files[@]}"; do
        result=$(process_single_file "$file" "$options")
        case $? in
            0) ((success_count++)) ;;
            1) ((skip_count++)) ;;
            *) ((error_count++)) ;;
        esac
    done
    
    echo "\n📊 PROCESSING SUMMARY"
    echo "===================="
    echo "✅ Successfully reformatted: $success_count"
    echo "⏭️  Already formatted: $skip_count"
    echo "❌ Errors: $error_count"
    echo "📁 Total processed: ${#phase_files[@]}"
}
```

## Command Interface

```bash
# Parse command line arguments
INPUT_PATH="$1"
BACKUP=true
DRY_RUN=false
VERBOSE=false

while [[ $# -gt 1 ]]; do
    case $2 in
        --no-backup)
            BACKUP=false
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo "Unknown option: $2"
            exit 1
            ;;
    esac
done

# Validate input
validate_input "$INPUT_PATH"

# Process based on input type
if [ -f "$INPUT_PATH" ]; then
    # Single file
    process_single_file "$INPUT_PATH" "$OPTIONS"
else
    # Directory
    process_directory "$INPUT_PATH" "$OPTIONS"
fi

echo "\n✅ Phase reformatting complete!"
echo "Your phases now include:"
echo "  • Context Assembly Layer for pattern awareness"
echo "  • Product Requirements Prompts (PRPs)"
echo "  • Two-command validation system"
echo "  • UI healing integration"
echo "  • Pattern compliance checking"
echo "  • Context memory updates"
```

## Usage Examples

### Single File
```bash
/vibe-reformat-phases phases/phase-01-authentication.md
```

### Directory of Phases
```bash
/vibe-reformat-phases phases/
```

### Preview Changes
```bash
/vibe-reformat-phases phases/phase-02-dashboard.md --dry-run
```

### No Backup
```bash
/vibe-reformat-phases phases/ --no-backup
```

## What Gets Added

### 1. Context Assembly Layer
- Global context requirements
- Phase dependencies
- Learned patterns from codebase

### 2. Enhanced PRPs
- Auto-loaded codebase context
- Pattern examples from your code
- 95%+ pattern matching requirements

### 3. Two-Command Validation
- `/vibe-validate-work` for code quality
- `/vibe-ui-healer` for UI quality
- Clear separation of concerns

### 4. UI Healing Checkpoints
- Added after UI-related tasks
- Automatic quality improvement
- Design system compliance

### 5. Pattern Compliance
- Validation includes pattern matching
- Context memory updates
- Team preference learning

## Notes
- Always creates backups by default
- Preserves all existing content
- Only adds new sections, never removes
- Skips files already in new format
- Works with any phase structure

---

**Transform your existing phases to leverage context engineering and UI healing! 🔄✨**