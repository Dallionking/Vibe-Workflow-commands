#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

const VIBE_MULTI_AGENT_PATH = process.cwd();

async function main() {
  console.log(chalk.cyan.bold('🚀 Vibe Multi-Agent MCP Installation'));
  console.log(chalk.gray('Setting up the multi-agent orchestration system...\n'));

  try {
    // Check prerequisites
    await checkPrerequisites();

    // Get user preferences
    const config = await getUserPreferences();

    // Build the MCP servers
    await buildMCPServers();

    // Install MCP servers
    await installMCPServers(config);

    // Create configuration files
    await createConfigFiles(config);

    // Setup example project
    if (config.setupExample) {
      await setupExampleProject();
    }

    console.log(chalk.green.bold('\n✅ Installation completed successfully!'));
    console.log(chalk.yellow('\nNext steps:'));
    console.log(chalk.white('1. cd into your project directory'));
    console.log(chalk.white('2. Run: @vibe-stoic "Your project description"'));
    console.log(chalk.white('3. Watch as agents spawn and collaborate!\n'));

  } catch (error) {
    console.error(chalk.red.bold('❌ Installation failed:'), error.message);
    process.exit(1);
  }
}

async function checkPrerequisites() {
  const spinner = ora('Checking prerequisites...').start();

  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ required, found ${nodeVersion}`);
    }

    // Check Claude Code installation
    try {
      execSync('claude --version', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('Claude Code not found. Install from: https://claude.ai/code');
    }

    // Check Git installation
    try {
      execSync('git --version', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('Git not found. Please install Git.');
    }

    // Check TypeScript installation
    try {
      execSync('npm list -g typescript', { stdio: 'pipe' });
    } catch (error) {
      console.log(chalk.yellow('TypeScript not found globally, installing...'));
      execSync('npm install -g typescript', { stdio: 'inherit' });
    }

    spinner.succeed('Prerequisites check passed');
  } catch (error) {
    spinner.fail('Prerequisites check failed');
    throw error;
  }
}

async function getUserPreferences() {
  const questions = [
    {
      type: 'input',
      name: 'orchestratorPort',
      message: 'Orchestrator WebSocket port:',
      default: '8080',
      validate: (input) => {
        const port = parseInt(input);
        return port > 0 && port < 65536 ? true : 'Please enter a valid port number';
      }
    },
    {
      type: 'input',
      name: 'maxAgents',
      message: 'Maximum concurrent agents:',
      default: '5',
      validate: (input) => {
        const num = parseInt(input);
        return num > 0 && num <= 10 ? true : 'Please enter a number between 1 and 10';
      }
    },
    {
      type: 'list',
      name: 'logLevel',
      message: 'Log level:',
      choices: ['debug', 'info', 'warn', 'error'],
      default: 'info'
    },
    {
      type: 'confirm',
      name: 'enableMonitoring',
      message: 'Enable monitoring and metrics?',
      default: true
    },
    {
      type: 'confirm',
      name: 'setupExample',
      message: 'Setup example project?',
      default: true
    }
  ];

  return await inquirer.prompt(questions);
}

async function buildMCPServers() {
  const spinner = ora('Building MCP servers...').start();

  try {
    // Install dependencies
    execSync('npm install', { stdio: 'pipe', cwd: VIBE_MULTI_AGENT_PATH });

    // Build TypeScript
    execSync('npm run build', { stdio: 'pipe', cwd: VIBE_MULTI_AGENT_PATH });

    spinner.succeed('MCP servers built successfully');
  } catch (error) {
    spinner.fail('Failed to build MCP servers');
    throw error;
  }
}

async function installMCPServers(config) {
  const spinner = ora('Installing MCP servers...').start();

  try {
    const orchestratorPath = join(VIBE_MULTI_AGENT_PATH, 'dist/orchestrator/index.js');
    const stoicPath = join(VIBE_MULTI_AGENT_PATH, 'dist/stoic/index.js');

    // Install orchestrator MCP
    execSync(`claude mcp add vibe-orchestrator node "${orchestratorPath}"`, { 
      stdio: 'pipe'
    });

    // Install STOIC MCP
    execSync(`claude mcp add vibe-stoic node "${stoicPath}"`, { 
      stdio: 'pipe'
    });

    // Verify installations
    const mcpList = execSync('claude mcp list', { encoding: 'utf8' });
    
    if (!mcpList.includes('vibe-orchestrator')) {
      throw new Error('vibe-orchestrator MCP not installed properly');
    }
    
    if (!mcpList.includes('vibe-stoic')) {
      throw new Error('vibe-stoic MCP not installed properly');
    }

    spinner.succeed('MCP servers installed successfully');
  } catch (error) {
    spinner.fail('Failed to install MCP servers');
    throw error;
  }
}

async function createConfigFiles(config) {
  const spinner = ora('Creating configuration files...').start();

  try {
    // Create orchestrator config
    const orchestratorConfig = {
      host: 'localhost',
      port: parseInt(config.orchestratorPort),
      ssl: false,
      auth: {
        type: 'none'
      },
      agents: {
        maxConcurrent: parseInt(config.maxAgents),
        defaultTimeout: 300000,
        heartbeatInterval: 5000,
        reconnectAttempts: 3
      },
      git: {
        worktreePath: '.worktrees',
        mergeStrategy: 'merge',
        autoMerge: true
      },
      logging: {
        level: config.logLevel
      },
      monitoring: {
        enabled: config.enableMonitoring
      }
    };

    const configPath = join(VIBE_MULTI_AGENT_PATH, 'config.json');
    writeFileSync(configPath, JSON.stringify(orchestratorConfig, null, 2));

    // Create environment file
    const envContent = `# Vibe Multi-Agent Configuration
LOG_LEVEL=${config.logLevel}
ORCHESTRATOR_PORT=${config.orchestratorPort}
MAX_AGENTS=${config.maxAgents}
MONITORING_ENABLED=${config.enableMonitoring}
NODE_ENV=development
`;

    const envPath = join(VIBE_MULTI_AGENT_PATH, '.env');
    writeFileSync(envPath, envContent);

    // Create startup script
    const startupScript = `#!/bin/bash
# Vibe Multi-Agent Startup Script

echo "🚀 Starting Vibe Multi-Agent Orchestrator..."

# Check if orchestrator is already running
if pgrep -f "vibe-orchestrator" > /dev/null; then
  echo "⚠️  Orchestrator already running"
  exit 1
fi

# Start orchestrator in background
node "${join(VIBE_MULTI_AGENT_PATH, 'dist/orchestrator/index.js')}" &
ORCHESTRATOR_PID=$!

echo "✅ Orchestrator started with PID: $ORCHESTRATOR_PID"
echo "🌐 WebSocket server running on port ${config.orchestratorPort}"
echo "📝 Log level: ${config.logLevel}"

# Save PID for cleanup
echo $ORCHESTRATOR_PID > "${join(VIBE_MULTI_AGENT_PATH, 'orchestrator.pid')}"

echo "🎯 Ready for multi-agent development!"
echo "   Use: @vibe-stoic 'Your project description'"
`;

    const startupPath = join(VIBE_MULTI_AGENT_PATH, 'start-orchestrator.sh');
    writeFileSync(startupPath, startupScript);
    execSync(`chmod +x "${startupPath}"`);

    // Create stop script
    const stopScript = `#!/bin/bash
# Vibe Multi-Agent Stop Script

PID_FILE="${join(VIBE_MULTI_AGENT_PATH, 'orchestrator.pid')}"

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "🛑 Stopping orchestrator (PID: $PID)..."
    kill "$PID"
    rm "$PID_FILE"
    echo "✅ Orchestrator stopped"
  else
    echo "⚠️  Orchestrator not running"
    rm "$PID_FILE"
  fi
else
  echo "⚠️  No PID file found"
fi
`;

    const stopPath = join(VIBE_MULTI_AGENT_PATH, 'stop-orchestrator.sh');
    writeFileSync(stopPath, stopScript);
    execSync(`chmod +x "${stopPath}"`);

    spinner.succeed('Configuration files created');
  } catch (error) {
    spinner.fail('Failed to create configuration files');
    throw error;
  }
}

async function setupExampleProject() {
  const spinner = ora('Setting up example project...').start();

  try {
    const examplePath = join(VIBE_MULTI_AGENT_PATH, 'examples/task-manager-saas');
    
    // Create example directory
    execSync(`mkdir -p "${examplePath}"`);

    // Create example README
    const exampleReadme = `# Task Manager SaaS - Multi-Agent Example

This example demonstrates the Vibe Multi-Agent system by building a task management SaaS application.

## Quick Start

1. **Start the orchestrator:**
   \`\`\`bash
   ./start-orchestrator.sh
   \`\`\`

2. **Plan the project:**
   \`\`\`bash
   claude
   > @vibe-stoic "Build a task management SaaS with React frontend, Node.js backend, user authentication, team collaboration, and subscription billing"
   \`\`\`

3. **Watch the magic happen:**
   - STOIC will analyze requirements and create architecture
   - Orchestrator will spawn specialized agents
   - Agents will collaborate on parallel development
   - Automatic merging and conflict resolution

## Features Implemented

- ✅ User authentication and authorization
- ✅ Task creation and management
- ✅ Team collaboration features
- ✅ Subscription billing with Stripe
- ✅ Real-time updates with WebSockets
- ✅ Comprehensive testing suite
- ✅ Production deployment setup

## Architecture

The system will create:
- **Frontend Agent**: React components and UI
- **Backend Agent**: Node.js API and business logic
- **Database Agent**: PostgreSQL schema and migrations
- **Testing Agent**: Unit, integration, and e2e tests
- **DevOps Agent**: Docker, CI/CD, and deployment

## Monitoring

Monitor agent progress at: http://localhost:${config.orchestratorPort}/status
`;

    writeFileSync(join(examplePath, 'README.md'), exampleReadme);

    spinner.succeed('Example project setup complete');
  } catch (error) {
    spinner.fail('Failed to setup example project');
    throw error;
  }
}

// Run the installer
main().catch(console.error);