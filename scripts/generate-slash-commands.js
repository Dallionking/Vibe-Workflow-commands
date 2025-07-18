#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * @typedef {Object} Command
 * @property {string} name - Command name
 * @property {string} description - Command description
 * @property {string} [agent] - Agent file path
 * @property {string[]} [parameters] - Command parameters
 * @property {string[]} [requires] - Prerequisites
 * @property {string[]} [outputs] - Expected outputs
 * @property {string[]} [mcps] - MCP tools required
 * @property {string[]} [subcommands] - Sub-commands
 */

/**
 * @typedef {Object} ClaudeConfig
 * @property {string} name - Project name
 * @property {string} version - Project version
 * @property {Command[]} commands - Array of commands
 * @property {Object.<string, any>} [mcps] - MCP configurations
 */

/**
 * @typedef {Object} SpecialCommand
 * @property {string} name - Command name
 * @property {string} description - Command description
 * @property {string} content - Full markdown content
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Generating Claude Code slash commands...\n');

// Read claude.json
const claudeJsonPath = path.join(__dirname, '..', 'claude.json');
if (!fs.existsSync(claudeJsonPath)) {
  console.error('❌ claude.json not found!');
  process.exit(1);
}

const fileContent = fs.readFileSync(claudeJsonPath, 'utf8');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const claudeConfig = /** @type {ClaudeConfig} */ (JSON.parse(fileContent));

// Create .claude/commands directory
const commandsDir = path.join(__dirname, '..', '.claude', 'commands');
if (!fs.existsSync(commandsDir)) {
  fs.mkdirSync(commandsDir, { recursive: true });
  console.log('✅ Created .claude/commands directory');
}

// Generate command files
let generatedCount = 0;
const skippedCount = 0;

claudeConfig.commands.forEach(command => {
  // Skip subcommands - they're handled by their parent
  if (command.subcommands) {
    console.log(`ℹ️  Skipping parent command with subcommands: ${command.name}`);
    return;
  }

  const commandFilePath = path.join(commandsDir, `${command.name}.md`);

  // Read agent file content if it exists
  let agentContent = '';
  if (command.agent) {
    const agentPath = path.join(__dirname, '..', command.agent);
    if (fs.existsSync(agentPath)) {
      agentContent = fs.readFileSync(agentPath, 'utf8');
    } else {
      console.warn(`⚠️  Agent file not found for ${command.name}: ${command.agent}`);
    }
  }

  // Build allowed tools list
  /** @type {string[]} */
  const allowedTools = [];
  if (command.mcps && Array.isArray(command.mcps)) {
    // Map MCP names to actual tool names
    /** @type {Object.<string, string[]>} */
    const mcpMapping = {
      'context7': ['mcp__context7__resolve-library-id', 'mcp__context7__get-library-docs'],
      'perplexity': ['mcp__perplexity-mcp__perplexity_search_web', 'mcp__perplexity-ask__perplexity_ask'],
      'sequential-thinking': ['mcp__sequential-thinking__sequentialthinking'],
      'taskmaster': ['Task'],
      'github': ['mcp__github__*'],
      'playwright': ['mcp__playwright__*'],
      'supabase': ['mcp__supabase-mcp-server__*'],
      'shadcn-ui': ['mcp__shadcn__*'],
      'vibeAgentBus': ['mcp__vibe-agent-bus__*']
    };

    command.mcps.forEach(mcp => {
      if (mcp === 'all-available' || mcp === 'all-project-specific') {
        // Add common tools
        allowedTools.push('Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'WebSearch', 'TodoWrite', 'Glob', 'Grep', 'LS');
        Object.values(mcpMapping).forEach(tools => allowedTools.push(...tools));
      } else if (mcpMapping[mcp]) {
        allowedTools.push(...mcpMapping[mcp]);
      }
    });
  }

  // Always include basic tools
  if (!allowedTools.includes('Read')) {
    allowedTools.push('Read', 'Write', 'Edit', 'MultiEdit', 'Bash', 'TodoWrite', 'Glob', 'Grep', 'LS');
  }

  // Generate the command file content
  let fileContent = '';

  // Add YAML frontmatter
  fileContent += '---\n';
  fileContent += `description: ${command.description}\n`;
  if (allowedTools.length > 0) {
    fileContent += 'allowed-tools:\n';
    allowedTools.forEach(tool => {
      fileContent += `  - ${tool}\n`;
    });
  }
  if (command.parameters && command.parameters.length > 0) {
    fileContent += 'parameters:\n';
    command.parameters.forEach(param => {
      fileContent += `  - ${param}\n`;
    });
  }
  fileContent += '---\n\n';

  // Add command header
  fileContent += `# ${command.name}\n\n`;
  fileContent += `${command.description}\n\n`;

  // Add usage information
  if (command.parameters && command.parameters.length > 0) {
    fileContent += '## Usage\n';
    fileContent += `\`/${command.name}`;
    command.parameters.forEach(param => {
      if (param.startsWith('--')) {
        fileContent += ` [${param}]`;
      } else {
        fileContent += ` <${param}>`;
      }
    });
    fileContent += '`\n\n';
  }

  // Add agent content or basic implementation
  if (agentContent) {
    fileContent += agentContent;
  } else {
    fileContent += '## Implementation\n\n';
    fileContent += 'This command is part of the Vibe Coding methodology.\n\n';

    if (command.requires && command.requires.length > 0) {
      fileContent += '### Prerequisites\n';
      command.requires.forEach(req => {
        fileContent += `- ${req}\n`;
      });
      fileContent += '\n';
    }

    if (command.outputs && command.outputs.length > 0) {
      fileContent += '### Outputs\n';
      command.outputs.forEach(output => {
        fileContent += `- ${output}\n`;
      });
      fileContent += '\n';
    }

    fileContent += 'ARGUMENTS: $ARGUMENTS\n';
  }

  // Write the command file
  fs.writeFileSync(commandFilePath, fileContent);
  console.log(`✅ Generated: ${command.name}`);
  generatedCount++;
});

// Special handling for commands that might be missing
/** @type {SpecialCommand[]} */
const specialCommands = [
  {
    name: 'yolo',
    description: 'Zero-friction phase execution system - see yolo-local and yolo-docker',
    content: fs.readFileSync(path.join(__dirname, '..', 'commands', 'yolo.md'), 'utf8')
  },
  {
    name: 'yolo-local',
    description: 'Execute phases locally with zero-friction automation',
    content: fs.readFileSync(path.join(__dirname, '..', 'commands', 'yolo-local.md'), 'utf8')
  },
  {
    name: 'yolo-docker',
    description: 'Execute phases in Docker with zero-friction automation',
    content: fs.readFileSync(path.join(__dirname, '..', 'commands', 'yolo-docker.md'), 'utf8')
  },
  {
    name: 'ui-healer',
    description: 'Comprehensive UI testing, visual regression, and automatic healing',
    content: `---
description: Comprehensive UI testing, visual regression, and automatic healing
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
  - mcp__playwright__*
  - mcp__context7__*
parameters:
  - pages
  - threshold
  - browsers
  - options
---

# UI Healer - Comprehensive UI Testing & Auto-Healing

Advanced UI testing with browser compatibility, visual regression, accessibility, and automatic healing capabilities.

## Usage
\`/ui-healer --pages=[pages] --threshold=[0-100] [options]\`

## Options
- \`--pages\` - Pages to test (comma-separated URLs or "all")
- \`--threshold\` - UI quality threshold (0-100, default: 85)
- \`--browsers\` - Browsers to test (chrome, firefox, safari, edge)
- \`--visual-regression\` - Enable visual regression testing
- \`--accessibility\` - Run WCAG 2.1 AA compliance tests
- \`--responsive\` - Test responsive design breakpoints
- \`--heal\` - Automatically fix UI issues found
- \`--mode\` - Testing mode (quick, standard, comprehensive)
- \`--report\` - Report format (summary, detailed, json)

## Features
- Cross-browser compatibility testing
- Visual regression detection
- Accessibility compliance (WCAG 2.1 AA)
- Responsive design validation
- Automatic UI healing
- Performance metrics
- Before/after screenshots

ARGUMENTS: $ARGUMENTS
`
  }
];

// Add special commands
specialCommands.forEach(cmd => {
  const commandFilePath = path.join(commandsDir, `${cmd.name}.md`);
  fs.writeFileSync(commandFilePath, cmd.content);
  console.log(`✅ Generated special command: ${cmd.name}`);
  generatedCount++;
});

console.log('\n✨ Command generation complete!');
console.log(`   Generated: ${generatedCount} commands`);
console.log(`   Skipped: ${skippedCount} parent commands with subcommands`);
console.log('\n📍 Commands location: .claude/commands/');
console.log('\n🎉 Your slash commands should now be available in Claude Code!');
console.log('   Try typing "/" to see the list of available commands.');
