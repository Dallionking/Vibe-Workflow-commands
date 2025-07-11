# /vibe-reformat-phases - Phase Documentation Reformatter

## Command Overview
Reformats existing phase documentation to the new context-enhanced format with UI healing integration. This command intelligently parses existing phase files and upgrades them with Context Assembly Layer (CAL), Performance Reference Points (PRPs), UI healing checkpoints, and the two-command validation system.

## Usage
```
/vibe-reformat-phases [file_path|directory_path]
```

## Prerequisites
- Existing phase documentation files (markdown format)
- Read/write access to phase files
- Understanding of new context engineering format

## Execution Steps

### 1. Input Validation
```javascript
// Validate input path
const inputPath = args[0] || 'phases/';
const isDirectory = await fs.stat(inputPath).then(s => s.isDirectory()).catch(() => false);
const isFile = await fs.stat(inputPath).then(s => s.isFile()).catch(() => false);

if (!isDirectory && !isFile) {
    throw new Error(`Invalid path: ${inputPath}. Please provide a valid file or directory path.`);
}

// Collect files to process
const filesToProcess = [];
if (isFile && inputPath.endsWith('.md')) {
    filesToProcess.push(inputPath);
} else if (isDirectory) {
    const files = await glob(`${inputPath}/**/*.md`);
    filesToProcess.push(...files.filter(f => f.includes('phase-')));
}

console.log(`Found ${filesToProcess.length} phase files to reformat`);
```

### 2. Phase Format Detection
```javascript
// Analyze existing format structure
function detectPhaseFormat(content) {
    const format = {
        hasContextLayer: content.includes('Context Assembly Layer'),
        hasPRPs: content.includes('Performance Reference Points'),
        hasUIHealing: content.includes('UI Healing'),
        hasTwoCommandValidation: content.includes('/vibe-validate-progress'),
        hasVerticalSlices: content.includes('Vertical Slice'),
        hasImplementationTasks: content.includes('Implementation Tasks'),
        version: 'legacy'
    };
    
    if (format.hasContextLayer && format.hasPRPs) {
        format.version = 'context-enhanced';
    } else if (format.hasVerticalSlices) {
        format.version = 'standard';
    }
    
    return format;
}
```

### 3. Content Parser
```javascript
// Parse existing phase structure
function parsePhaseContent(content) {
    const phase = {
        title: '',
        description: '',
        verticalSlices: [],
        implementationTasks: [],
        validation: {},
        dependencies: [],
        gitCheckpoints: [],
        rawSections: {}
    };
    
    // Extract title and description
    const titleMatch = content.match(/^#\s+(.+)/m);
    if (titleMatch) phase.title = titleMatch[1];
    
    const descMatch = content.match(/^#\s+.+\n\n(.+?)(?=\n##)/ms);
    if (descMatch) phase.description = descMatch[1].trim();
    
    // Extract vertical slices
    const sliceRegex = /###\s+Vertical Slice \d+:(.+?)(?=###\s+Vertical Slice|\n##|$)/gs;
    let sliceMatch;
    while ((sliceMatch = sliceRegex.exec(content)) !== null) {
        const sliceContent = sliceMatch[0];
        const slice = parseVerticalSlice(sliceContent);
        phase.verticalSlices.push(slice);
    }
    
    // Extract other sections
    const sectionRegex = /^##\s+(.+?)\n([\s\S]+?)(?=\n##|$)/gm;
    let sectionMatch;
    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
        const sectionName = sectionMatch[1].trim();
        const sectionContent = sectionMatch[2].trim();
        phase.rawSections[sectionName] = sectionContent;
    }
    
    return phase;
}

function parseVerticalSlice(content) {
    const slice = {
        title: '',
        tasks: [],
        uiTasks: [],
        hasUI: false
    };
    
    const titleMatch = content.match(/###\s+Vertical Slice \d+:\s*(.+)/);
    if (titleMatch) slice.title = titleMatch[1].trim();
    
    // Parse tasks
    const taskRegex = /\d+\.\s+(.+?)(?=\n\d+\.|\n\n|$)/gs;
    let taskMatch;
    while ((taskMatch = taskRegex.exec(content)) !== null) {
        const task = taskMatch[1].trim();
        slice.tasks.push(task);
        
        // Check if it's a UI task
        if (task.match(/UI|component|interface|screen|view|form|button|modal/i)) {
            slice.uiTasks.push(task);
            slice.hasUI = true;
        }
    }
    
    return slice;
}
```

### 4. Context Enhancement Generator
```javascript
// Generate Context Assembly Layer
function generateContextLayer(phase) {
    const cal = {
        priorContext: [],
        currentScope: [],
        futureRequirements: []
    };
    
    // Analyze dependencies for prior context
    if (phase.dependencies && phase.dependencies.length > 0) {
        cal.priorContext = phase.dependencies.map(dep => ({
            source: dep,
            relevance: 'Required for implementation',
            data: `Reference ${dep} for implementation details`
        }));
    }
    
    // Define current scope from vertical slices
    cal.currentScope = phase.verticalSlices.map(slice => ({
        component: slice.title,
        complexity: estimateComplexity(slice),
        uiElements: slice.uiTasks.length
    }));
    
    // Project future requirements
    cal.futureRequirements = inferFutureRequirements(phase);
    
    return cal;
}

// Generate Performance Reference Points
function generatePRPs(phase) {
    const prps = [];
    
    // Add standard PRPs
    prps.push({
        metric: 'Implementation Time',
        target: `${phase.verticalSlices.length * 2} hours`,
        measurement: 'Track time per vertical slice'
    });
    
    prps.push({
        metric: 'Test Coverage',
        target: '95%+',
        measurement: 'Automated test report'
    });
    
    // Add UI-specific PRPs if applicable
    const totalUITasks = phase.verticalSlices.reduce((sum, slice) => sum + slice.uiTasks.length, 0);
    if (totalUITasks > 0) {
        prps.push({
            metric: 'UI Consistency',
            target: '100% design system compliance',
            measurement: 'UI healing validation'
        });
        
        prps.push({
            metric: 'Accessibility Score',
            target: 'WCAG 2.1 AA compliance',
            measurement: 'Automated accessibility audit'
        });
    }
    
    return prps;
}
```

### 5. Format Enhancer
```javascript
// Apply context enhancements to phase
function enhancePhaseFormat(phase, originalContent) {
    const enhanced = [];
    
    // Title and description
    enhanced.push(`# ${phase.title}`);
    enhanced.push('');
    enhanced.push(phase.description);
    enhanced.push('');
    
    // Add Context Assembly Layer
    enhanced.push('## Context Assembly Layer (CAL)');
    enhanced.push('');
    const cal = generateContextLayer(phase);
    
    enhanced.push('### Prior Context Requirements');
    cal.priorContext.forEach(ctx => {
        enhanced.push(`- **${ctx.source}**: ${ctx.relevance}`);
        enhanced.push(`  - ${ctx.data}`);
    });
    enhanced.push('');
    
    enhanced.push('### Current Implementation Scope');
    cal.currentScope.forEach(scope => {
        enhanced.push(`- **${scope.component}**`);
        enhanced.push(`  - Complexity: ${scope.complexity}`);
        enhanced.push(`  - UI Elements: ${scope.uiElements}`);
    });
    enhanced.push('');
    
    enhanced.push('### Future Integration Points');
    cal.futureRequirements.forEach(req => {
        enhanced.push(`- ${req}`);
    });
    enhanced.push('');
    
    // Add Performance Reference Points
    enhanced.push('## Performance Reference Points (PRPs)');
    enhanced.push('');
    const prps = generatePRPs(phase);
    prps.forEach(prp => {
        enhanced.push(`### ${prp.metric}`);
        enhanced.push(`- **Target**: ${prp.target}`);
        enhanced.push(`- **Measurement**: ${prp.measurement}`);
        enhanced.push('');
    });
    
    // Enhanced Vertical Slices
    enhanced.push('## Implementation Plan');
    enhanced.push('');
    
    phase.verticalSlices.forEach((slice, index) => {
        enhanced.push(`### Vertical Slice ${index + 1}: ${slice.title}`);
        enhanced.push('');
        
        // Add context for this slice
        enhanced.push('#### Context Requirements');
        enhanced.push(`- Prior slices: ${index > 0 ? `Slices 1-${index}` : 'None'}`);
        enhanced.push(`- Dependencies: ${identifySliceDependencies(slice, phase)}`);
        enhanced.push('');
        
        enhanced.push('#### Implementation Tasks');
        slice.tasks.forEach((task, taskIndex) => {
            enhanced.push(`${taskIndex + 1}. ${task}`);
        });
        enhanced.push('');
        
        // Add UI healing checkpoint if UI tasks exist
        if (slice.hasUI) {
            enhanced.push('#### UI Healing Checkpoint');
            enhanced.push('```bash');
            enhanced.push('# After completing UI tasks, run:');
            enhanced.push('/vibe-ui-heal --component="' + slice.title.toLowerCase().replace(/\s+/g, '-') + '"');
            enhanced.push('```');
            enhanced.push('');
        }
        
        // Add validation checkpoint
        enhanced.push('#### Validation Checkpoint');
        enhanced.push('```bash');
        enhanced.push(`/vibe-validate-slice --phase=${getPhaseNumber(phase)} --slice=${index + 1}`);
        enhanced.push('```');
        enhanced.push('');
    });
    
    // Two-command validation system
    enhanced.push('## Validation Commands');
    enhanced.push('');
    enhanced.push('### Progress Validation');
    enhanced.push('```bash');
    enhanced.push('# Check implementation progress and context integrity');
    enhanced.push(`/vibe-validate-progress --phase=${getPhaseNumber(phase)}`);
    enhanced.push('```');
    enhanced.push('');
    enhanced.push('### Quality Validation');
    enhanced.push('```bash');
    enhanced.push('# Validate code quality, tests, and PRPs');
    enhanced.push(`/vibe-validate-quality --phase=${getPhaseNumber(phase)} --prp-check`);
    enhanced.push('```');
    enhanced.push('');
    
    // Preserve any additional sections from original
    const standardSections = ['Context Assembly Layer', 'Performance Reference Points', 
                            'Implementation Plan', 'Validation Commands'];
    
    Object.entries(phase.rawSections).forEach(([section, content]) => {
        if (!standardSections.some(std => section.includes(std))) {
            enhanced.push(`## ${section}`);
            enhanced.push('');
            enhanced.push(content);
            enhanced.push('');
        }
    });
    
    // Add context preservation footer
    enhanced.push('## Context Preservation');
    enhanced.push('');
    enhanced.push('### Generated Artifacts');
    enhanced.push('- Implementation code with context comments');
    enhanced.push('- Test suites with PRP validation');
    enhanced.push('- UI component library updates');
    enhanced.push('- Context handoff documentation');
    enhanced.push('');
    
    enhanced.push('### Next Phase Context');
    enhanced.push('This phase output will be automatically included in the Context Assembly Layer of the next phase.');
    
    return enhanced.join('\n');
}
```

### 6. Batch Processing
```javascript
// Process all files
async function reformatPhases(filesToProcess) {
    const results = {
        success: [],
        failed: [],
        skipped: []
    };
    
    for (const filePath of filesToProcess) {
        try {
            console.log(`Processing: ${filePath}`);
            
            // Read original content
            const content = await fs.readFile(filePath, 'utf-8');
            
            // Detect format
            const format = detectPhaseFormat(content);
            
            // Skip if already enhanced
            if (format.version === 'context-enhanced') {
                console.log(`  → Skipped (already enhanced)`);
                results.skipped.push(filePath);
                continue;
            }
            
            // Parse content
            const phase = parsePhaseContent(content);
            
            // Enhance format
            const enhanced = enhancePhaseFormat(phase, content);
            
            // Backup original
            const backupPath = filePath.replace('.md', '.backup.md');
            await fs.writeFile(backupPath, content);
            
            // Write enhanced version
            await fs.writeFile(filePath, enhanced);
            
            console.log(`  → Success (backed up to ${backupPath})`);
            results.success.push(filePath);
            
        } catch (error) {
            console.error(`  → Failed: ${error.message}`);
            results.failed.push({ file: filePath, error: error.message });
        }
    }
    
    return results;
}
```

### 7. Helper Functions
```javascript
// Estimate complexity based on tasks
function estimateComplexity(slice) {
    const taskCount = slice.tasks.length;
    const uiComplexity = slice.uiTasks.length * 1.5;
    const totalComplexity = taskCount + uiComplexity;
    
    if (totalComplexity <= 5) return 'Low';
    if (totalComplexity <= 10) return 'Medium';
    return 'High';
}

// Infer future requirements
function inferFutureRequirements(phase) {
    const requirements = [];
    
    // Check for API mentions
    if (JSON.stringify(phase).includes('API')) {
        requirements.push('API integration patterns for next phase');
    }
    
    // Check for UI components
    const hasUI = phase.verticalSlices.some(s => s.hasUI);
    if (hasUI) {
        requirements.push('UI component library extensions');
        requirements.push('Design system updates');
    }
    
    // Check for data mentions
    if (JSON.stringify(phase).match(/database|model|schema/i)) {
        requirements.push('Data model extensions for related features');
    }
    
    return requirements;
}

// Extract phase number from content or filename
function getPhaseNumber(phase) {
    const numberMatch = phase.title.match(/Phase\s+(\d+)/i);
    if (numberMatch) return numberMatch[1];
    return '1';
}

// Identify dependencies for a slice
function identifySliceDependencies(slice, phase) {
    const deps = [];
    
    // Check for model references
    if (slice.tasks.some(t => t.match(/model|schema|database/i))) {
        deps.push('Data models');
    }
    
    // Check for API references
    if (slice.tasks.some(t => t.match(/API|endpoint|route/i))) {
        deps.push('API contracts');
    }
    
    // Check for UI references
    if (slice.hasUI) {
        deps.push('Design system');
    }
    
    return deps.length > 0 ? deps.join(', ') : 'None';
}
```

### 8. Main Execution
```javascript
async function main() {
    try {
        // Show introduction
        console.log('🔄 Vibe Phase Reformatter');
        console.log('========================');
        console.log('Upgrading phase documentation to context-enhanced format...\n');
        
        // Execute reformatting
        const results = await reformatPhases(filesToProcess);
        
        // Show results
        console.log('\n📊 Reformatting Results');
        console.log('======================');
        console.log(`✅ Successfully reformatted: ${results.success.length} files`);
        console.log(`⏭️  Skipped (already enhanced): ${results.skipped.length} files`);
        console.log(`❌ Failed: ${results.failed.length} files`);
        
        if (results.failed.length > 0) {
            console.log('\n❌ Failed Files:');
            results.failed.forEach(f => {
                console.log(`  - ${f.file}: ${f.error}`);
            });
        }
        
        if (results.success.length > 0) {
            console.log('\n✅ Enhanced Files:');
            results.success.forEach(f => {
                console.log(`  - ${f}`);
            });
            
            console.log('\n💡 Next Steps:');
            console.log('1. Review the enhanced phase files');
            console.log('2. Verify context assembly layers are accurate');
            console.log('3. Update any custom sections as needed');
            console.log('4. Run validation: /vibe-validate-structure phases/');
        }
        
    } catch (error) {
        console.error('❌ Reformatting failed:', error.message);
        process.exit(1);
    }
}

main();
```

## Output Format
Enhanced phase files will include:
- Context Assembly Layer (CAL) with prior/current/future context
- Performance Reference Points (PRPs) with measurable targets
- UI healing checkpoints after UI-related tasks
- Two-command validation system
- Context preservation sections
- All original content preserved and properly integrated

## Error Handling
- Invalid file paths are reported clearly
- Backup files are created before modification
- Already enhanced files are skipped
- Parsing errors are logged with file details
- Original content is never lost

## Example Usage
```bash
# Reformat a single phase file
/vibe-reformat-phases phases/phase-01-user-authentication.md

# Reformat all phases in a directory
/vibe-reformat-phases phases/

# Reformat phases in current directory
/vibe-reformat-phases .
```

## Dependencies
- File system access for reading/writing phase files
- Markdown parsing capabilities
- Pattern matching for content analysis
- Backup file creation

## Notes
- Always creates backup files before modification
- Preserves all original content while enhancing structure
- Intelligently detects existing format versions
- Adds context engineering without disrupting existing flow
- Integrates UI healing at appropriate checkpoints