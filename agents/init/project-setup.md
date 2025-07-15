# Vibe Coding Project Initialization Agent

## Agent Configuration
- **Command**: `/vibe-init`
- **Parameters**: 
  - `project-name` (required)
  - `template-type` (optional, default: saas-startup)
  - `--context-mode` (optional, default: standard, options: standard|advanced)
- **Outputs**: Project structure, CLAUDE.md, .vibe-status.md, git repository

### Context Mode Options
- **standard**: Basic context engineering with core features
- **advanced**: Full context engineering with memory learning, pattern recognition, and performance optimization

## Execution Steps

### 1. Validate Parameters
```
- Check if project name is provided
- Validate project name (alphanumeric, hyphens only)
- Check if directory already exists
- Validate template type (saas-startup, enterprise-app, mobile-app)
- Validate context mode (standard, advanced)
- Log initialization mode for user confirmation
```

### 2. Create Project Structure
```
project-name/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── config/
├── context/                  # Context Engineering System
│   ├── types/
│   ├── assembly/
│   ├── cache/
│   ├── memory/
│   ├── integration/
│   └── performance/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── context/             # Context system tests
├── docs/
│   ├── vibe-coding/         # Step documentation
│   └── .gitkeep
├── phases/
│   └── .gitkeep
├── .vibe/                   # Vibe system files
│   ├── status.json
│   ├── features.json
│   └── mcp-status.json
├── public/
├── scripts/
├── .github/
│   └── workflows/
├── package.json
├── README.md
├── CLAUDE.md
├── .vibe-status.md
├── .gitignore
├── .env.example
├── tsconfig.json (or relevant config)
├── jest.config.js           # Testing configuration
└── jest.setup.js           # Jest setup with memory optimization
```

### 3. Initialize Git Repository
```bash
cd [project-name]
git init
git add .
git commit -m "Initial commit: Vibe Coding project structure"
```

### 4. Create CLAUDE.md
Generate project-specific CLAUDE.md with:
- Project name and description
- Vibe Coding methodology reference
- Quality standards (95% test coverage)
- MCP tool configurations
- Development guidelines

### 5. Create .vibe-status.md
Initialize project status tracking:
```markdown
# Vibe Coding Project Status

## Project: [project-name]
- **Created**: [timestamp]
- **Template**: [template-type]
- **Current Step**: Initialization Complete
- **Context Engineering**: Enabled
- **Performance Monitoring**: Active

## Progress Tracker
- [x] Project Initialization
- [x] Context Engineering Setup
- [ ] Step 1: Project Ideation
- [ ] Step 2: Technical Architecture
- [ ] Step 3: UX Design
- [ ] Step 4: Design System
- [ ] Step 5: Interface States
- [ ] Step 6: Technical Specification
- [ ] Step 7: Landing Page
- [ ] Step 8: Vertical Slices

## Context Engineering Status
- [x] Core system initialized
- [x] Memory optimization configured
- [x] Performance monitoring enabled
- [x] LRU caching setup
- [ ] Production optimization
- [ ] Advanced analytics

## Available Commands
- `/vibe-context analyze` - System performance analysis
- `/vibe-context optimize` - Memory optimization
- `/vibe-context validate` - System integrity check
- `/vibe-context memory` - Context memory management
- `/vibe-step-1-ideation` - Begin project specification

## Next Steps
Run `/vibe-step-1-ideation` to begin project specification.
For context system help: `/vibe-context validate`
```

### 6. Initialize Context Engineering System

#### Standard Mode (Default)
Set up basic context system for the project:
```
- Copy core context/ directory structure from vibe-coding-claude template
- Create essential TypeScript interfaces and types  
- Set up basic memory optimization configurations
- Configure standard LRU caching
- Add core context engineering dependencies to package.json
- Create jest.setup.js with basic memory monitoring
- Add TypeScript compilation configuration for context/
```

#### Advanced Mode (--context-mode=advanced)
Set up full context system with advanced features:
```
- Copy complete context/ directory structure from vibe-coding-claude template
- Create comprehensive TypeScript interfaces and types
- Set up advanced memory optimization and learning systems
- Configure intelligent LRU caching with pattern recognition
- Enable context memory and learning algorithms
- Add full context engineering dependencies to package.json
- Create jest.setup.js with comprehensive memory monitoring and leak detection
- Add TypeScript compilation configuration for context/ with advanced features
- Initialize context memory database with learning capabilities
- Configure performance benchmarking and analytics
- Set up context pattern recognition and optimization
```

Required dependencies to add:
```json
"devDependencies": {
  "@types/node": "^20.9.0",
  "typescript": "^5.2.2",
  "ts-jest": "^29.4.0",
  "@jest/globals": "^29.7.0"
}
```

Package.json config section:
```json
"config": {
  "contextEngineering": true,
  "testCoverageThreshold": 0.95,
  "memoryOptimization": true
}
```

### 7. Apply Template
Based on selected template, create:
- Package.json with relevant dependencies (including context system)
- Configuration files (webpack, vite, etc.)
- Example components/pages
- Test setup files with context system testing
- CI/CD configurations with context validation

### 8. Final Output
```
✅ Project "[project-name]" initialized successfully!

📁 Project structure created
🔧 Git repository initialized
📋 CLAUDE.md configured
📊 Status tracking enabled
🧠 Context Engineering system initialized
⚡ Performance monitoring configured
🔍 Memory optimization enabled

Context Commands Available:
- `/context-analyze` - Analyze system performance
- `/context-optimize` - Optimize memory usage
- `/context-validate` - Validate system integrity

Next step: Run `/vibe-step-1-ideation` to begin your project specification.

For help: `/vibe-status` or `/vibe-doctor`
```

## Error Handling
- Directory exists: Prompt for overwrite or new name
- Invalid project name: Show naming requirements
- Template not found: Use default (saas-startup)
- Git init fails: Continue without git, warn user

## MCP Integration
This step doesn't require MCP tools but prepares the project for their use in subsequent steps.