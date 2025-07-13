#!/usr/bin/env node

/**
 * Simplified entry point for multi-agent system
 * This is what the user runs first
 */

const chalk = require('chalk');
const setupWizard = require('../core/setup-wizard');
const fs = require('fs').promises;
const path = require('path');

async function startMultiAgent() {
    console.clear();
    console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         🤖 Vibe Coding Multi-Agent System 🤖                ║
║                                                              ║
║     Transform Claude Code into a collaborative AI team       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`));

    // Check if already initialized
    const isInitialized = await checkIfInitialized();
    
    if (isInitialized) {
        console.log(chalk.yellow('⚠️  Multi-agent system appears to be already initialized.'));
        console.log(chalk.gray('   Check .workflow/agent-setup.md for existing setup instructions.\n'));
        
        const choice = await promptUser('Continue with new setup? (y/n): ');
        if (choice.toLowerCase() !== 'y') {
            process.exit(0);
        }
    }

    // Determine setup type
    console.log(chalk.green.bold('\n📋 Setup Options:\n'));
    console.log('1. Standard (3-4 agents) - Good for most tasks');
    console.log('2. Minimal (3 agents) - Quick setup for simple tasks');
    console.log('3. Full Team (8 agents) - Maximum parallel development');
    console.log('4. Phase-based (auto) - Based on current Vibe Coding phase\n');

    const setupType = await promptUser('Select setup type (1-4): ');
    
    let workflowType;
    switch (setupType) {
        case '1': workflowType = 'standard'; break;
        case '2': workflowType = 'minimal'; break;
        case '3': workflowType = 'full-team'; break;
        case '4': workflowType = 'phase-based'; break;
        default: workflowType = 'standard';
    }

    // Get current phase if phase-based
    let phase = null;
    if (workflowType === 'phase-based') {
        phase = await detectCurrentPhase();
        console.log(chalk.cyan(`\nDetected current phase: ${phase || 'None'}`));
        
        if (!phase) {
            phase = await promptUser('Enter phase (e.g., phase-1): ');
        }
    }

    // Start the setup wizard
    const requirements = await setupWizard.startMultiAgentSetup({
        workflowType,
        phase
    });

    // Show visual guide
    console.log(chalk.yellow.bold('\n🖼️  Visual Setup Guide:\n'));
    console.log(await generateVisualGuide(requirements.agentCount));

    // Create a quick-start script
    await createQuickStartScript(requirements);

    console.log(chalk.green.bold('\n✅ Setup Complete!\n'));
    console.log(chalk.white('Next steps:'));
    console.log(chalk.white('1. Follow the terminal setup instructions above'));
    console.log(chalk.white('2. Or use the quick-start script: .workflow/quick-start.sh'));
    console.log(chalk.white('3. Once all agents are running, start your workflow\n'));

    console.log(chalk.cyan('💡 Pro tip: Keep the channel.md file open in your editor to watch agent communications!\n'));
}

async function checkIfInitialized() {
    try {
        await fs.access(path.join(process.cwd(), '.workflow', 'agent-setup.md'));
        return true;
    } catch (error) {
        return false;
    }
}

async function detectCurrentPhase() {
    try {
        const status = await fs.readFile('.vibe-status.md', 'utf8');
        const match = status.match(/Current Phase:\s*(phase-\d+)/i);
        return match ? match[1] : null;
    } catch (error) {
        return null;
    }
}

async function promptUser(question) {
    // In a real implementation, this would use readline or inquirer
    console.log(chalk.yellow(question));
    // For now, return default
    return '1';
}

async function generateVisualGuide(agentCount) {
    const layouts = {
        3: `
    ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
    │   Terminal 1    │     │   Terminal 2    │     │   Terminal 3    │
    │  Orchestrator   │     │ Research Agent  │     │ Testing Agent   │
    │                 │     │                 │     │                 │
    │ > /orchestrate  │     │ > /agent res... │     │ > /agent test.. │
    └─────────────────┘     └─────────────────┘     └─────────────────┘
              │                       │                       │
              └───────────────────────┴───────────────────────┘
                                     │
                            ┌────────▼────────┐
                            │   channel.md    │
                            │ (Communication) │
                            └─────────────────┘`,
        
        4: `
    ┌─────────────────┐     ┌─────────────────┐
    │   Terminal 1    │     │   Terminal 2    │
    │  Orchestrator   │     │ Planning Agent  │
    └─────────────────┘     └─────────────────┘
    
    ┌─────────────────┐     ┌─────────────────┐
    │   Terminal 3    │     │   Terminal 4    │
    │ Frontend Agent  │     │ Backend Agent   │
    └─────────────────┘     └─────────────────┘
              │
              ▼
         channel.md`,
              
        8: `
    Orchestrator → Research Team → Development Team → Testing Team
        (T1)        (T2, T3)      (T4, T5, T6)       (T7, T8)
                          │
                     channel.md
                   (Central Hub)`
    };

    return layouts[agentCount] || layouts[4];
}

async function createQuickStartScript(requirements) {
    const scriptPath = path.join(process.cwd(), '.workflow', 'quick-start.sh');
    
    const scriptContent = `#!/bin/bash
# Multi-Agent Quick Start Script
# Generated: ${new Date().toISOString()}

echo "🚀 Starting Multi-Agent System..."
echo "This script will help you set up ${requirements.agentCount} terminals"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS Terminal/iTerm
    echo "📱 Detected macOS"
    echo ""
    echo "Opening ${requirements.agentCount} new terminal windows..."
    echo "In each window, run the command shown for that terminal."
    echo ""
    
    # Open terminals with commands
${requirements.agents.map(agent => `    osascript -e 'tell app "Terminal" to do script "cd ${process.cwd()} && echo \\"Terminal ${agent.terminal} - ${agent.name}\\" && echo \\"Run: /agent ${agent.name} --terminal-id=${agent.terminal}\\""'`).join('\n')}
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🐧 Detected Linux"
    echo "Please manually open ${requirements.agentCount} terminals"
    
else
    # Windows
    echo "🪟 Detected Windows"
    echo "Please manually open ${requirements.agentCount} terminals"
fi

echo ""
echo "📋 Commands for each terminal:"
echo ""
${requirements.agents.map(agent => `echo "Terminal ${agent.terminal}: /agent ${agent.name} --terminal-id=${agent.terminal}"`).join('\n')}

echo ""
echo "✅ Once all agents are running, your multi-agent system is ready!"
`;

    await fs.writeFile(scriptPath, scriptContent);
    await fs.chmod(scriptPath, '755');
}

// Run if called directly
if (require.main === module) {
    startMultiAgent().catch(console.error);
}

module.exports = { startMultiAgent };