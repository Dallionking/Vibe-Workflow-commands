const Orchestrator = require('../multi-agent/core/orchestrator');
const WorkflowBuilder = require('../multi-agent/core/workflow-builder');
const terminalManager = require('../multi-agent/core/terminal-manager');
const agentLoader = require('../multi-agent/core/agent-loader');
const contextManager = require('../multi-agent/core/context-manager');
const channelMonitor = require('../multi-agent/core/channel-monitor');
const fs = require('fs').promises;
const path = require('path');

// Command registry for multi-agent commands
const multiAgentCommands = {
    '/workflow': executeWorkflow,
    '/agent': executeAgent,
    '/orchestrate': startOrchestration,
    '/channel': viewChannel,
    '/agents': listAgents,
    '/terminals': manageTerminals,
    '/multi-agent': showMultiAgentHelp
};

async function executeWorkflow(args) {
    const [action, ...params] = args.split(' ');
    
    switch (action) {
        case 'run':
            return await runWorkflow(params[0]);
        case 'create':
            return await createWorkflow(params[0]);
        case 'list':
            return await listWorkflows();
        case 'status':
            return await getWorkflowStatus(params[0]);
        default:
            return {
                success: false,
                message: 'Usage: /workflow [run|create|list|status] [workflow-name]'
            };
    }
}

async function runWorkflow(workflowName) {
    try {
        const orchestrator = new Orchestrator();
        await orchestrator.initialize();
        
        // Load workflow definition
        const workflowPath = path.join(process.cwd(), '.workflow', 'definitions', `${workflowName}.yaml`);
        const workflowContent = await fs.readFile(workflowPath, 'utf8');
        const workflow = require('js-yaml').load(workflowContent);
        
        // Define workflow in orchestrator
        await orchestrator.defineWorkflow(workflowName, workflow);
        
        // Launch required agents in terminals
        const agents = terminalManager.extractAgentsFromWorkflow(workflow);
        console.log(`Launching ${agents.length} agents for workflow: ${workflowName}`);
        
        await terminalManager.launchWorkflow(workflow, {
            parallel: true,
            terminalType: 'integrated'
        });
        
        // Wait for agents to initialize
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Execute workflow
        const result = await orchestrator.executeWorkflow(workflowName);
        
        return {
            success: true,
            message: `Workflow ${workflowName} completed`,
            result
        };
        
    } catch (error) {
        return {
            success: false,
            message: `Workflow execution failed: ${error.message}`
        };
    }
}

async function createWorkflow(name) {
    const builder = WorkflowBuilder.create()
        .name(name)
        .description('Multi-agent workflow created via slash command');
    
    // Interactive workflow creation would go here
    // For now, create a sample workflow
    builder
        .agent('research-agent', { topic: 'placeholder' })
        .approval('Review research results')
        .parallel('coding-agent', 'testing-agent')
        .agent('review-agent');
    
    const workflowPath = path.join(process.cwd(), '.workflow', 'definitions', `${name}.yaml`);
    await fs.mkdir(path.dirname(workflowPath), { recursive: true });
    await builder.save(workflowPath);
    
    return {
        success: true,
        message: `Workflow '${name}' created at ${workflowPath}`
    };
}

async function executeAgent(args) {
    const [agentName, ...params] = args.split(' ');
    
    if (!agentName) {
        return {
            success: false,
            message: 'Usage: /agent <agent-name> [params...]'
        };
    }
    
    try {
        // Load and execute agent directly
        const agent = await agentLoader.loadAgent(agentName);
        
        if (!agent) {
            return {
                success: false,
                message: `Agent '${agentName}' not found`
            };
        }
        
        const context = {
            params: params.join(' '),
            executeWorkflow: true
        };
        
        const result = await agent.execute(context);
        
        return {
            success: true,
            message: `Agent ${agentName} executed successfully`,
            result
        };
        
    } catch (error) {
        return {
            success: false,
            message: `Agent execution failed: ${error.message}`
        };
    }
}

async function startOrchestration(args) {
    const [mode, ...params] = args.split(' ');
    const setupWizard = require('../multi-agent/core/setup-wizard');
    
    try {
        // Check if this is the first agent being set up
        const isFirstSetup = !args.includes('--agent-name');
        
        if (isFirstSetup) {
            // This is the orchestrator - show setup wizard
            console.log('\n🚀 Starting Multi-Agent System Setup\n');
            
            const options = {
                workflowType: args.includes('--full-team') ? 'full-team' : 
                             args.includes('--minimal') ? 'minimal' : 'standard',
                phase: args.find(a => a.startsWith('--phase='))?.split('=')[1]
            };
            
            const requirements = await setupWizard.startMultiAgentSetup(options);
            
            // Initialize orchestrator after showing instructions
            const orchestrator = new Orchestrator('main-orchestrator');
            await orchestrator.initialize();
            
            // Start monitoring
            await channelMonitor.start();
            await createOrchestrationDashboard();
            
            // Initialize agent monitor
            const agentMonitor = require('../multi-agent/core/agent-monitor');
            await agentMonitor.initialize(requirements.agents);
            
            // Show real-time connection status
            console.log(chalk.yellow('\n⏳ Waiting for agents to connect...\n'));
            agentMonitor.displayAgentGrid();
            
            return {
                success: true,
                message: `Multi-Agent System Setup Complete!`,
                details: [
                    `Required terminals: ${requirements.agentCount}`,
                    `Setup instructions saved to: .workflow/agent-setup.md`,
                    '',
                    'Please follow the setup instructions displayed above.',
                    'The orchestrator is now running and waiting for other agents.'
                ]
            };
            
        } else {
            // This is a regular agent initialization
            const agentName = args.match(/--agent-name="([^"]+)"/)?.[1];
            const agentRole = args.match(/--agent-role="([^"]+)"/)?.[1];
            const terminalId = args.match(/--terminal-id=(\d+)/)?.[1];
            
            const orchestrator = new Orchestrator(agentName || 'agent');
            await orchestrator.initialize();
            
            await contextManager.writeToChannel(agentName || 'agent',
                `Agent initialized in Terminal ${terminalId}`,
                { type: 'agent-ready', role: agentRole }
            );
            
            return {
                success: true,
                message: `${agentName} is ready and monitoring channel`,
                terminal: terminalId
            };
        }
        
    } catch (error) {
        return {
            success: false,
            message: `Failed to start orchestration: ${error.message}`
        };
    }
}

async function viewChannel(args) {
    const [action, ...params] = args.split(' ');
    
    try {
        await contextManager.initialize();
        
        switch (action) {
            case 'show':
            case undefined:
                const content = await contextManager.readChannel();
                return {
                    success: true,
                    message: 'Channel contents:',
                    content
                };
                
            case 'clear':
                await contextManager.clearChannel();
                return {
                    success: true,
                    message: 'Channel cleared'
                };
                
            case 'monitor':
                // Open channel.md in editor
                const channelPath = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
                require('child_process').exec(`code "${channelPath}"`);
                return {
                    success: true,
                    message: `Channel opened in editor: ${channelPath}`
                };
                
            default:
                return {
                    success: false,
                    message: 'Usage: /channel [show|clear|monitor]'
                };
        }
        
    } catch (error) {
        return {
            success: false,
            message: `Channel operation failed: ${error.message}`
        };
    }
}

async function listAgents() {
    try {
        const agents = await agentLoader.loadAllAgents();
        const agentList = [];
        
        for (const [name, agent] of agents) {
            agentList.push({
                name,
                type: agent.type,
                capabilities: agent.config?.capabilities ? Object.keys(agent.config.capabilities) : []
            });
        }
        
        return {
            success: true,
            message: `Found ${agentList.length} agents`,
            agents: agentList
        };
        
    } catch (error) {
        return {
            success: false,
            message: `Failed to list agents: ${error.message}`
        };
    }
}

async function manageTerminals(args) {
    const [action, ...params] = args.split(' ');
    
    switch (action) {
        case 'launch':
            const agentName = params[0];
            if (!agentName) {
                return {
                    success: false,
                    message: 'Usage: /terminals launch <agent-name>'
                };
            }
            
            try {
                const terminalId = await terminalManager.launchAgent(agentName, {
                    terminal: 'integrated'
                });
                
                return {
                    success: true,
                    message: `Launched ${agentName} in terminal ${terminalId}`
                };
            } catch (error) {
                return {
                    success: false,
                    message: `Failed to launch terminal: ${error.message}`
                };
            }
            
        case 'list':
            const terminals = terminalManager.getActiveTerminals();
            return {
                success: true,
                message: `${terminals.length} active terminals`,
                terminals: terminals.map(t => ({
                    id: t.id,
                    agent: t.agentName,
                    type: t.terminal,
                    status: t.status,
                    uptime: Date.now() - t.startTime.getTime()
                }))
            };
            
        case 'stop':
            const terminalId = params[0];
            if (!terminalId) {
                return {
                    success: false,
                    message: 'Usage: /terminals stop <terminal-id>'
                };
            }
            
            const stopped = await terminalManager.stopTerminal(terminalId);
            return {
                success: stopped,
                message: stopped ? `Terminal ${terminalId} stopped` : 'Terminal not found'
            };
            
        case 'status':
            const status = await terminalManager.getTerminalStatus();
            return {
                success: true,
                message: 'Terminal status',
                status
            };
            
        default:
            return {
                success: false,
                message: 'Usage: /terminals [launch|list|stop|status] [params...]'
            };
    }
}

async function showMultiAgentHelp() {
    // Check if system is initialized
    const fs = require('fs').promises;
    const path = require('path');
    let isInitialized = false;
    
    try {
        await fs.access(path.join(process.cwd(), '.workflow', 'agent-setup.md'));
        isInitialized = true;
    } catch (error) {
        // Not initialized
    }
    
    if (!isInitialized) {
        // First time - show setup wizard
        console.log('\n🚀 Welcome to the Multi-Agent System!\n');
        console.log('It looks like this is your first time. Let\'s set up your agent team.\n');
        console.log('The system will guide you through:\n');
        console.log('  1. 📋 Determining how many agents you need');
        console.log('  2. 🔧 Generating setup instructions');
        console.log('  3. 💻 Showing you exactly what to run in each terminal');
        console.log('  4. 🚀 Getting your AI team collaborating\n');
        
        const setupWizard = require('../multi-agent/core/setup-wizard');
        const requirements = await setupWizard.startMultiAgentSetup({
            workflowType: 'standard'
        });
        
        return {
            success: true,
            message: 'Setup wizard completed!',
            nextSteps: [
                `Open ${requirements.agentCount} terminal windows/tabs`,
                'Start Claude Code in each terminal',
                'Run the commands shown above in each terminal',
                'Come back to Terminal 1 and run /workflow list'
            ]
        };
    }
    
    return {
        success: true,
        message: 'Multi-Agent System Commands',
        commands: [
            {
                command: '/workflow',
                description: 'Manage and execute multi-agent workflows',
                subcommands: [
                    'run <name> - Execute a workflow',
                    'create <name> - Create a new workflow',
                    'list - List available workflows',
                    'status <id> - Check workflow status'
                ]
            },
            {
                command: '/agent',
                description: 'Execute individual agents',
                usage: '/agent <agent-name> [params...]'
            },
            {
                command: '/orchestrate',
                description: 'Start multi-agent orchestration system'
            },
            {
                command: '/channel',
                description: 'View and manage agent communication channel',
                subcommands: [
                    'show - Display channel contents',
                    'clear - Clear channel messages',
                    'monitor - Open channel in editor'
                ]
            },
            {
                command: '/agents',
                description: 'List all available agents'
            },
            {
                command: '/terminals',
                description: 'Manage agent terminals',
                subcommands: [
                    'launch <agent> - Launch agent in terminal',
                    'list - List active terminals',
                    'stop <id> - Stop a terminal',
                    'status - Terminal statistics'
                ]
            }
        ]
    };
}

async function createOrchestrationDashboard() {
    const dashboardPath = path.join(process.cwd(), '.workflow', 'dashboard.md');
    const content = `# Multi-Agent Orchestration Dashboard

## Status
- Orchestrator: Active
- Channel Monitor: Running
- Active Agents: 0

## Quick Actions
1. View channel: /channel show
2. Launch agent: /terminals launch <agent-name>
3. Run workflow: /workflow run <workflow-name>
4. List agents: /agents

## Active Workflows
None

## Recent Messages
Check channel.md for agent communications

---
Last updated: ${new Date().toISOString()}
`;
    
    await fs.mkdir(path.dirname(dashboardPath), { recursive: true });
    await fs.writeFile(dashboardPath, content);
}

// Export command handler
async function handleMultiAgentCommand(command, args) {
    const handler = multiAgentCommands[command];
    
    if (handler) {
        return await handler(args);
    }
    
    return {
        success: false,
        message: `Unknown multi-agent command: ${command}`
    };
}

module.exports = {
    handleMultiAgentCommand,
    multiAgentCommands
};