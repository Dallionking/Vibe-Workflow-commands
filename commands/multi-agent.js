const Orchestrator = require('../multi-agent/core/orchestrator');
const WorkflowBuilder = require('../multi-agent/core/workflow-builder');
const terminalManager = require('../multi-agent/core/terminal-manager');
const agentLoader = require('../multi-agent/core/agent-loader');
const contextManager = require('../multi-agent/core/context-manager');
const channelMonitor = require('../multi-agent/core/channel-monitor');
const OrchestratorIntelligence = require('../multi-agent/core/orchestrator-intelligence');
const TaskParser = require('../multi-agent/core/task-parser');
const CommandExecutor = require('../multi-agent/core/command-executor');
const fs = require('fs').promises;
const path = require('path');

// Initialize automation components
const orchestratorAI = new OrchestratorIntelligence();
const taskParser = new TaskParser();
let isAutomationActive = false;

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
    console.log('⚠️  /agent command has been updated');
    console.log('');
    console.log('❌ ISSUE: Claude Code doesn\'t support multi-instance agent coordination');
    console.log('');
    console.log('✅ SOLUTION: Use the new wrapper script approach:');
    console.log('');
    console.log('Instead of: /agent research-agent --terminal-id=2');
    console.log('Use this in a separate terminal:');
    console.log('  ./multi-agent/scripts/start-research-agent.sh');
    console.log('');
    console.log('Available agents:');
    console.log('  ./multi-agent/scripts/start-research-agent.sh   - Codebase analysis');
    console.log('  ./multi-agent/scripts/start-coding-agent.sh     - Feature implementation');
    console.log('  ./multi-agent/scripts/start-testing-agent.sh    - Test creation');
    console.log('');
    console.log('📡 These scripts create real agents that monitor channel.md for tasks');
    console.log('🔧 Each agent provides guidance for using Claude Code tools');
    console.log('');
    console.log('For coordination, start the orchestrator:');
    console.log('  node multi-agent/core/simple-orchestrator.js');
    console.log('');
    
    return {
        success: false,
        message: 'Use wrapper scripts instead of /agent command',
        details: [
            'The /agent command assumed Claude Code capabilities that don\'t exist',
            'Use the wrapper scripts in separate terminals instead',
            'This provides real multi-agent coordination that actually works'
        ]
    };
}

async function startOrchestration(args = '') {
    console.log('🚀 Multi-Agent System Setup');
    console.log('');
    console.log('⚠️  NOTE: This command has been updated to use a real multi-agent system.');
    console.log('   The previous automated approach required capabilities Claude Code doesn\'t have.');
    console.log('');
    console.log('✅ NEW APPROACH: Manual coordination with real file monitoring');
    console.log('');
    console.log('📋 To start the multi-agent system:');
    console.log('');
    console.log('1. Terminal 1 (Orchestrator):');
    console.log('   node multi-agent/core/simple-orchestrator.js');
    console.log('');
    console.log('2. Terminal 2 (Research Agent):');
    console.log('   ./multi-agent/scripts/start-research-agent.sh');
    console.log('');
    console.log('3. Terminal 3 (Coding Agent):');
    console.log('   ./multi-agent/scripts/start-coding-agent.sh');
    console.log('');
    console.log('4. Terminal 4 (Testing Agent):');
    console.log('   ./multi-agent/scripts/start-testing-agent.sh');
    console.log('');
    console.log('📡 Communication: Agents communicate via .workflow/context/channel.md');
    console.log('🔧 Tools: Each agent provides guidance for using Claude Code tools');
    console.log('');
    console.log('💡 Example usage in orchestrator:');
    console.log('   orchestrator> task research-agent Analyze React patterns in src/');
    console.log('   orchestrator> task coding-agent Create UserCard component');
    console.log('   orchestrator> status');
    console.log('');
    
    return {
        success: true,
        message: 'Multi-agent system instructions provided',
        details: [
            'Run the commands above in separate terminals',
            'Agents will coordinate via channel.md file monitoring',
            'Each agent provides guidance for manual execution',
            'This approach works with Claude Code\'s actual capabilities'
        ]
    };
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

// AUTOMATION CORE FUNCTIONS - Zero Manual Intervention

async function startAutomatedOrchestrator() {
    if (!isAutomationActive) return;
    
    console.log('🤖 Starting Automated Orchestrator - Zero manual intervention mode!');
    
    // Monitor channel for user commands and automatically process them
    const chokidar = require('chokidar');
    const channelPath = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
    
    // Watch for changes to channel.md
    chokidar.watch(channelPath).on('change', async () => {
        if (!isAutomationActive) return;
        
        try {
            const channelContent = await fs.readFile(channelPath, 'utf8');
            const lines = channelContent.split('\n');
            
            // Look for user commands that haven't been processed
            for (const line of lines) {
                if (line.includes('task ') && !line.includes('[PROCESSED]')) {
                    const taskMatch = line.match(/task (.+)/);
                    if (taskMatch) {
                        const taskDescription = taskMatch[1];
                        await processUserCommandAutomatically(taskDescription);
                        
                        // Mark as processed
                        const updatedContent = channelContent.replace(line, `${line} [PROCESSED]`);
                        await fs.writeFile(channelPath, updatedContent);
                    }
                }
            }
        } catch (error) {
            console.error('Automation error:', error.message);
        }
    });
}

async function startAutomatedAgent(agentName, role) {
    if (!isAutomationActive) return;
    
    console.log(`🤖 Starting Automated Agent: ${agentName} (${role})`);
    
    // Monitor channel for tasks assigned to this agent
    const chokidar = require('chokidar');
    const channelPath = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
    
    chokidar.watch(channelPath).on('change', async () => {
        if (!isAutomationActive) return;
        
        try {
            const channelContent = await fs.readFile(channelPath, 'utf8');
            const lines = channelContent.split('\n');
            
            // Look for tasks assigned to this agent
            for (const line of lines) {
                if (line.includes(`@${agentName}`) && !line.includes('[EXECUTING]') && !line.includes('[COMPLETED]')) {
                    const taskMatch = line.match(/Task: (.+) @${agentName}/);
                    if (taskMatch) {
                        const taskDescription = taskMatch[1];
                        await executeTaskAutomatically(agentName, role, taskDescription);
                        
                        // Mark as executing
                        const updatedContent = channelContent.replace(line, `${line} [EXECUTING]`);
                        await fs.writeFile(channelPath, updatedContent);
                    }
                }
            }
        } catch (error) {
            console.error(`Automation error for ${agentName}:`, error.message);
        }
    });
}

async function processUserCommandAutomatically(taskDescription) {
    console.log(`🚀 AUTO-PROCESSING: ${taskDescription}`);
    
    try {
        // Use OrchestratorIntelligence to analyze and break down the task
        const analysis = await orchestratorAI.processUserCommand(taskDescription);
        
        // Write task breakdown to channel
        const channelPath = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
        const timestamp = new Date().toISOString();
        
        const taskAssignments = analysis.taskBreakdown.map(task => 
            `Task: ${task.description} @${task.assignedAgent} [Priority: ${task.priority}]`
        ).join('\n');
        
        const automationUpdate = `\n\n## Automatic Task Breakdown - ${timestamp}\n${taskAssignments}\n`;
        
        await fs.appendFile(channelPath, automationUpdate);
        
        console.log(`✅ AUTO-ASSIGNED ${analysis.taskBreakdown.length} tasks to agents`);
        
    } catch (error) {
        console.error('Auto-processing failed:', error.message);
    }
}

async function executeTaskAutomatically(agentName, role, taskDescription) {
    console.log(`🔥 AUTO-EXECUTING [${agentName}]: ${taskDescription}`);
    
    try {
        const commandExecutor = new (require('../multi-agent/core/command-executor'))();
        
        // Determine the type of task and auto-execute
        let result;
        if (role === 'research-agent' || taskDescription.includes('research') || taskDescription.includes('analyze')) {
            result = await commandExecutor.executeUltraThink(taskDescription);
        } else if (role === 'coding-agent' || taskDescription.includes('implement') || taskDescription.includes('create')) {
            result = await commandExecutor.executeImplementation(taskDescription);
        } else if (role === 'testing-agent' || taskDescription.includes('test') || taskDescription.includes('validate')) {
            result = await commandExecutor.executeTesting(taskDescription);
        } else {
            result = await commandExecutor.executeCommand(taskDescription);
        }
        
        // Update channel with completion
        const channelPath = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
        const timestamp = new Date().toISOString();
        const completion = `\n\n## Task Completed - ${timestamp}\n**Agent**: ${agentName}\n**Task**: ${taskDescription}\n**Result**: ${result.success ? 'SUCCESS' : 'FAILED'}\n**Details**: ${result.message}\n`;
        
        await fs.appendFile(channelPath, completion);
        
        console.log(`✅ AUTO-COMPLETED [${agentName}]: ${taskDescription}`);
        
    } catch (error) {
        console.error(`Auto-execution failed for ${agentName}:`, error.message);
    }
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
    multiAgentCommands,
    startAutomatedOrchestrator,
    startAutomatedAgent,
    processUserCommandAutomatically,
    executeTaskAutomatically
};