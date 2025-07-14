const fs = require('fs').promises;
const path = require('path');
const contextManager = require('./context-manager');
const agentGenerator = require('./agent-generator');
let chalk;
try {
    chalk = require('chalk');
} catch (error) {
    // Fallback if chalk is not available
    chalk = {
        cyan: { bold: (text) => text },
        yellow: { bold: (text) => text },
        green: { bold: (text) => text },
        gray: (text) => text,
        white: (text) => text,
        bgBlack: { white: (text) => text, green: (text) => text }
    };
}

class SetupWizard {
    constructor() {
        this.requiredTerminals = 0;
        this.setupInstructions = [];
        this.agentCommands = new Map();
    }

    async startMultiAgentSetup(options = {}) {
        const { phase, workflowType = 'standard', teamSize = 3 } = options;
        
        console.clear();
        console.log(chalk.cyan.bold('\n🤖 Multi-Agent Setup Wizard\n'));
        console.log(chalk.gray('═'.repeat(60)));
        
        // Step 1: Analyze requirements
        const requirements = await this.analyzeRequirements(phase, workflowType);
        this.requiredTerminals = requirements.agentCount;
        
        // Step 2: Generate setup instructions
        await this.generateSetupInstructions(requirements);
        
        // Step 3: Display instructions
        await this.displaySetupInstructions();
        
        // Step 4: Create setup files
        await this.createSetupFiles(requirements);
        
        // Step 5: Wait for user confirmation
        await this.waitForUserReady();
        
        return requirements;
    }

    async analyzeRequirements(phase, workflowType) {
        const requirements = {
            phase: phase || await this.detectCurrentPhase(),
            workflowType,
            agents: [],
            agentCount: 0
        };

        if (workflowType === 'full-team') {
            requirements.agents = [
                { name: 'orchestrator', role: 'coordinator', terminal: 1 },
                { name: 'research-agent', role: 'researcher', terminal: 2 },
                { name: 'planning-agent', role: 'planner', terminal: 3 },
                { name: 'frontend-agent-1', role: 'developer', terminal: 4 },
                { name: 'frontend-agent-2', role: 'developer', terminal: 5 },
                { name: 'backend-agent-1', role: 'developer', terminal: 6 },
                { name: 'backend-agent-2', role: 'developer', terminal: 7 },
                { name: 'testing-agent', role: 'qa', terminal: 8 }
            ];
        } else if (workflowType === 'minimal') {
            requirements.agents = [
                { name: 'orchestrator', role: 'coordinator', terminal: 1 },
                { name: 'development-agent', role: 'developer', terminal: 2 },
                { name: 'testing-agent', role: 'qa', terminal: 3 }
            ];
        } else {
            // Standard phase-based team
            if (requirements.phase) {
                const phaseAgents = await agentGenerator.generateAgentForPhase(
                    requirements.phase, 
                    await this.getProjectContext()
                );
                
                requirements.agents = [
                    { name: 'orchestrator', role: 'coordinator', terminal: 1 }
                ];
                
                phaseAgents.forEach((agent, index) => {
                    requirements.agents.push({
                        name: agent.name,
                        role: agent.definition.agent.role,
                        terminal: index + 2
                    });
                });
            }
        }

        requirements.agentCount = requirements.agents.length;
        return requirements;
    }

    async generateSetupInstructions(requirements) {
        this.setupInstructions = [
            {
                step: 1,
                title: 'Open Claude Code Terminals',
                description: `You need to open ${requirements.agentCount} Claude Code instances`,
                actions: [
                    `Open your terminal application (Terminal, iTerm, Windows Terminal, etc.)`,
                    `Create ${requirements.agentCount} new terminal tabs or windows`,
                    `In each terminal, navigate to: ${process.cwd()}`
                ]
            },
            {
                step: 2,
                title: 'Start Claude Code in Each Terminal',
                description: 'In each terminal window/tab, start a Claude Code instance',
                actions: requirements.agents.map((agent, index) => 
                    `Terminal ${agent.terminal}: Run 'claude' or your Claude Code start command`
                )
            },
            {
                step: 3,
                title: 'Initialize Each Agent',
                description: 'Copy and paste the following commands into each Claude Code instance',
                actions: []
            }
        ];

        // Generate agent-specific commands
        for (const agent of requirements.agents) {
            const command = await this.generateAgentCommand(agent);
            this.agentCommands.set(agent.terminal, command);
            this.setupInstructions[2].actions.push(
                `Terminal ${agent.terminal} (${agent.name}): ${command}`
            );
        }
    }

    async generateAgentCommand(agent) {
        if (agent.name === 'orchestrator') {
            return `/orchestrate --agent-role="${agent.role}" --agent-name="${agent.name}" --terminal-id=${agent.terminal}`;
        } else {
            return `/agent ${agent.name} --role="${agent.role}" --terminal-id=${agent.terminal} --auto-monitor`;
        }
    }

    async displaySetupInstructions() {
        console.log(chalk.yellow.bold('\n📋 Setup Instructions\n'));

        for (const instruction of this.setupInstructions) {
            console.log(chalk.green.bold(`\nStep ${instruction.step}: ${instruction.title}`));
            console.log(chalk.gray(instruction.description));
            
            instruction.actions.forEach(action => {
                console.log(chalk.white(`  • ${action}`));
            });
        }

        console.log(chalk.cyan.bold('\n📦 Quick Setup Commands:\n'));
        console.log(chalk.gray('Copy these commands for easy setup:\n'));

        // Display copyable command blocks
        for (const [terminal, command] of this.agentCommands) {
            console.log(chalk.bgBlack.white(`\n# Terminal ${terminal}:`));
            console.log(chalk.bgBlack.green(command));
        }
    }

    async createSetupFiles(requirements) {
        // Create a setup script file
        const setupScriptPath = path.join(process.cwd(), '.workflow', 'agent-setup.md');
        
        const setupContent = `# Multi-Agent Setup Instructions

Generated: ${new Date().toISOString()}
Phase: ${requirements.phase || 'General'}
Workflow Type: ${requirements.workflowType}
Required Terminals: ${requirements.agentCount}

## Terminal Setup Commands

Copy and paste each command into the corresponding Claude Code terminal:

${Array.from(this.agentCommands.entries()).map(([terminal, command]) => 
`### Terminal ${terminal}
\`\`\`bash
${command}
\`\`\`
`).join('\n')}

## Verification

After running all commands, you should see:
- Terminal 1: Orchestrator showing "Monitoring channel..."
- Other Terminals: Agents showing "Ready and monitoring channel"
- channel.md file being created/updated in your editor

## Quick Test

In Terminal 1 (Orchestrator), run:
\`\`\`bash
/workflow status
\`\`\`

You should see all agents listed as "active".
`;

        await fs.mkdir(path.dirname(setupScriptPath), { recursive: true });
        await fs.writeFile(setupScriptPath, setupContent);

        // Create individual agent instruction files
        for (const agent of requirements.agents) {
            const agentSetupPath = path.join(
                process.cwd(), 
                '.workflow', 
                'agents', 
                `${agent.name}-setup.txt`
            );
            
            const agentContent = `# ${agent.name} Setup

Terminal: ${agent.terminal}
Role: ${agent.role}

Run this command in Claude Code Terminal ${agent.terminal}:

${this.agentCommands.get(agent.terminal)}

After running, you should see:
- "Agent ${agent.name} initialized"
- "Monitoring channel for messages"
- "Ready to receive tasks"
`;

            await fs.writeFile(agentSetupPath, agentContent);
        }

        console.log(chalk.green(`\n✅ Setup files created in .workflow/`));
        console.log(chalk.gray(`   • agent-setup.md - Complete instructions`));
        console.log(chalk.gray(`   • agents/*-setup.txt - Individual agent commands`));
    }

    async waitForUserReady() {
        console.log(chalk.yellow.bold('\n⏸️  Next Steps:\n'));
        console.log(chalk.white('1. Open the required number of terminals'));
        console.log(chalk.white('2. Start Claude Code in each terminal'));
        console.log(chalk.white('3. Run the setup commands in each Claude Code instance'));
        console.log(chalk.white('4. Return here and type "ready" when all agents are running'));
        
        console.log(chalk.cyan('\n💡 Tip: The setup file ".workflow/agent-setup.md" contains all commands\n'));

        // In a real implementation, this would wait for user input
        console.log(chalk.gray('(In production, this would wait for user confirmation)'));
    }

    async detectCurrentPhase() {
        try {
            const status = await fs.readFile('.vibe-status.md', 'utf8');
            const match = status.match(/Current Phase:\s*(phase-\d+)/i);
            return match ? match[1] : 'phase-1';
        } catch (error) {
            return 'phase-1';
        }
    }

    async getProjectContext() {
        try {
            const status = await fs.readFile('.vibe-status.md', 'utf8');
            return {
                projectName: status.match(/Project:\s*(.+)/)?.[1] || 'Unknown',
                type: status.match(/Type:\s*(.+)/)?.[1] || 'Unknown'
            };
        } catch (error) {
            return { projectName: 'Unknown', type: 'Unknown' };
        }
    }

    async generateVisualGuide() {
        const visualGuide = `
┌─────────────────────────────────────────────────────────────┐
│                   Terminal Layout Guide                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Terminal 1 (Orchestrator)          Terminal 2 (Research)  │
│  ┌─────────────────────┐           ┌─────────────────────┐ │
│  │ > /orchestrate      │           │ > /agent research.. │ │
│  │ Monitoring channel..│           │ Agent ready...      │ │
│  └─────────────────────┘           └─────────────────────┘ │
│                                                             │
│  Terminal 3 (Frontend)              Terminal 4 (Backend)    │
│  ┌─────────────────────┐           ┌─────────────────────┐ │
│  │ > /agent frontend.. │           │ > /agent backend... │ │
│  │ Agent ready...      │           │ Agent ready...      │ │
│  └─────────────────────┘           └─────────────────────┘ │
│                                                             │
│  Editor Window (channel.md)                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ # Agent Communication Channel                        │   │
│  │                                                      │   │
│  │ ### [timestamp] orchestrator                        │   │
│  │ All agents initialized. Ready for workflow.         │   │
│  │ ---                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
`;
        return visualGuide;
    }
}

module.exports = new SetupWizard();