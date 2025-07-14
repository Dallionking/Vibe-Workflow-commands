# Vibe Coding Project Initialization Agent

## Agent Configuration
- **Command**: `/vibe-init`
- **Parameters**: 
  - `project-name` (required)
  - `template-type` (optional, default: saas-startup)
- **Outputs**: Project structure, CLAUDE.md, .vibe-status.md, git repository

## Execution Steps

### 1. Validate Parameters
```
- Check if project name is provided
- Validate project name (alphanumeric, hyphens only)
- Check if directory already exists
- Validate template type (saas-startup, enterprise-app, mobile-app)
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
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   └── .gitkeep
├── phases/
│   └── .gitkeep
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
└── tsconfig.json (or relevant config)
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

## Progress Tracker
- [x] Project Initialization
- [ ] Step 1: Project Ideation
- [ ] Step 2: Technical Architecture
- [ ] Step 3: UX Design
- [ ] Step 4: Design System
- [ ] Step 5: Interface States
- [ ] Step 6: Technical Specification
- [ ] Step 7: Landing Page
- [ ] Step 8: Vertical Slices

## Next Steps
Run `/vibe-step-1-ideation` to begin project specification.
```

### 6. Apply Template
Based on selected template, create:
- Package.json with relevant dependencies
- Configuration files (webpack, vite, etc.)
- Example components/pages
- Test setup files
- CI/CD configurations

### 7. Final Output
```
✅ Project "[project-name]" initialized successfully!

📁 Project structure created
🔧 Git repository initialized
📋 CLAUDE.md configured
📊 Status tracking enabled

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