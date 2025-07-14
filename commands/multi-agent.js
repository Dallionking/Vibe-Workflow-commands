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
    '/multi-agent': showMultiAgentHelp,
    '/re-channel': reChannelValidation
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

async function reChannelValidation(args = '') {
    const [targetAgent, timeWindow = 'last-24h'] = args.split(' ');
    
    console.log('🔍 Re-Channel Validation - Comprehensive QA Review');
    console.log('');
    
    try {
        // Initialize context manager
        await contextManager.initialize();
        
        // Read channel content
        const channelContent = await contextManager.readChannel();
        
        // Parse completion claims from channel
        const completionClaims = parseCompletionClaims(channelContent, targetAgent, timeWindow);
        
        if (completionClaims.length === 0) {
            return {
                success: true,
                message: 'No recent completion claims found to validate',
                details: [
                    `Target agent: ${targetAgent || 'all agents'}`,
                    `Time window: ${timeWindow}`,
                    'No validation needed'
                ]
            };
        }
        
        console.log(`📋 Found ${completionClaims.length} completion claims to validate`);
        
        // Execute QA validation agent
        const qaAgent = await agentLoader.loadAgent('qa-validator-agent');
        
        if (!qaAgent) {
            // Create QA validation summary manually
            const validationSummary = await performBasicValidation(completionClaims);
            
            return {
                success: true,
                message: 'Basic validation completed (QA agent not available)',
                validationSummary,
                recommendations: [
                    'Install qa-validator-agent.yaml for comprehensive validation',
                    'Review files mentioned in completion claims manually',
                    'Run tests to verify claimed functionality'
                ]
            };
        }
        
        // Execute comprehensive QA validation
        const validationResult = await qaAgent.execute({
            capability: 're_channel_validation',
            targetAgent: targetAgent,
            timeWindow: timeWindow,
            completionClaims: completionClaims
        });
        
        // Generate validation report
        const report = await generateValidationReport(validationResult, completionClaims);
        
        // Write validation results to channel
        await contextManager.writeToChannel('qa-validator-agent',
            `Re-channel validation completed. Found ${report.gapsFound} gaps in ${completionClaims.length} claims.`,
            {
                type: 'validation-complete',
                gapsFound: report.gapsFound,
                criticalIssues: report.criticalIssues,
                target: targetAgent || 'all-agents'
            }
        );
        
        console.log(`✅ Validation complete - ${report.gapsFound} gaps found`);
        
        return {
            success: true,
            message: `Re-channel validation completed for ${completionClaims.length} claims`,
            validationReport: report,
            nextSteps: report.gapsFound > 0 ? [
                'Review validation report for specific gaps',
                'Address critical issues first',
                'Re-run /re-channel after fixes'
            ] : ['All validations passed - no action needed']
        };
        
    } catch (error) {
        console.error('Re-channel validation failed:', error);
        
        return {
            success: false,
            message: `Re-channel validation failed: ${error.message}`,
            troubleshooting: [
                'Check if .workflow/context/channel.md exists',
                'Verify QA validator agent is properly configured',
                'Try running /channel show to check communication'
            ]
        };
    }
}

async function parseCompletionClaims(channelContent, targetAgent, timeWindow) {
    const claims = [];
    const lines = channelContent.split('\n');
    
    // Convert time window to timestamp
    const cutoffTime = getTimeWindowCutoff(timeWindow);
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Look for completion markers
        if (line.includes('task-complete') || line.includes('execution-complete') || line.includes('step-complete')) {
            const timestampMatch = line.match(/\[(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\]/);
            const agentMatch = line.match(/^### \[.*\] (.+)$/);
            
            if (timestampMatch && agentMatch) {
                const timestamp = new Date(timestampMatch[1]);
                const agent = agentMatch[1];
                
                // Filter by target agent if specified
                if (targetAgent && agent !== targetAgent) continue;
                
                // Filter by time window
                if (timestamp < cutoffTime) continue;
                
                // Extract claim details from following lines
                const claimDetails = extractClaimDetails(lines, i);
                
                claims.push({
                    timestamp: timestamp.toISOString(),
                    agent,
                    type: line.includes('task-complete') ? 'task' : 'execution',
                    details: claimDetails
                });
            }
        }
    }
    
    return claims;
}

function extractClaimDetails(lines, startIndex) {
    const details = {
        message: '',
        filesModified: [],
        featuresClaimed: [],
        testsClaimed: [],
        integrationClaimed: []
    };
    
    // Look at the next few lines for details
    for (let i = startIndex + 1; i < Math.min(startIndex + 20, lines.length); i++) {
        const line = lines[i];
        
        if (line.startsWith('---')) break; // End of message
        
        if (line.includes('file') || line.includes('File')) {
            const fileMatch = line.match(/([a-zA-Z0-9\-_.\/]+\.(js|ts|jsx|tsx|py|md|yaml|json))/g);
            if (fileMatch) {
                details.filesModified.push(...fileMatch);
            }
        }
        
        if (line.includes('implement') || line.includes('creat') || line.includes('feature')) {
            details.featuresClaimed.push(line.trim());
        }
        
        if (line.includes('test') || line.includes('coverage')) {
            details.testsClaimed.push(line.trim());
        }
        
        if (line.includes('integration') || line.includes('connect')) {
            details.integrationClaimed.push(line.trim());
        }
        
        if (!details.message && line.trim()) {
            details.message = line.trim();
        }
    }
    
    return details;
}

function getTimeWindowCutoff(timeWindow) {
    const now = new Date();
    
    switch (timeWindow) {
        case 'last-1h':
            return new Date(now.getTime() - 60 * 60 * 1000);
        case 'last-24h':
        default:
            return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case 'last-7d':
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'all':
            return new Date(0);
    }
}

async function performBasicValidation(completionClaims) {
    const validation = {
        totalClaims: completionClaims.length,
        fileValidation: [],
        gapsFound: 0,
        criticalIssues: 0
    };
    
    for (const claim of completionClaims) {
        const { filesModified } = claim.details;
        
        for (const file of filesModified) {
            try {
                const content = await fs.readFile(file, 'utf8');
                const fileValidation = {
                    file,
                    exists: true,
                    size: content.length,
                    isEmpty: content.trim().length === 0,
                    hasPlaceholders: content.includes('TODO') || content.includes('FIXME') || content.includes('placeholder')
                };
                
                if (fileValidation.isEmpty || fileValidation.hasPlaceholders) {
                    validation.gapsFound++;
                    if (fileValidation.isEmpty) validation.criticalIssues++;
                }
                
                validation.fileValidation.push(fileValidation);
            } catch (error) {
                validation.fileValidation.push({
                    file,
                    exists: false,
                    error: error.message
                });
                validation.gapsFound++;
                validation.criticalIssues++;
            }
        }
    }
    
    return validation;
}

async function generateValidationReport(validationResult, completionClaims) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalClaims: completionClaims.length,
            gapsFound: 0,
            criticalIssues: 0,
            passedValidation: 0
        },
        details: [],
        recommendations: []
    };
    
    // Process validation results
    if (validationResult) {
        report.summary.gapsFound = validationResult.gapsFound || 0;
        report.summary.criticalIssues = validationResult.criticalIssues || 0;
        report.summary.passedValidation = completionClaims.length - report.summary.gapsFound;
        report.details = validationResult.details || [];
        report.recommendations = validationResult.recommendations || [];
    }
    
    // Add standard recommendations
    if (report.summary.gapsFound > 0) {
        report.recommendations.push(
            'Review and complete all flagged implementations',
            'Run comprehensive tests to verify functionality',
            'Update documentation for completed features'
        );
    }
    
    return report;
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
            },
            {
                command: '/re-channel',
                description: 'Re-read channel and validate agent work comprehensively',
                usage: '/re-channel [agent-name] [time-window]',
                subcommands: [
                    'Default: Validate all recent work',
                    'coding-agent - Validate specific agent work',
                    'last-1h - Validate last hour only',
                    'last-24h - Validate last 24 hours (default)',
                    'last-7d - Validate last 7 days',
                    'all - Validate all historical work'
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