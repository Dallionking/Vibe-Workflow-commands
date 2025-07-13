const { exec, spawn } = require('child_process');
const EventEmitter = require('events');
const path = require('path');
const fs = require('fs').promises;

class TerminalManager extends EventEmitter {
    constructor() {
        super();
        this.terminals = new Map();
        this.agentProcesses = new Map();
    }

    async launchAgent(agentName, options = {}) {
        const {
            workspace = process.cwd(),
            terminal = 'integrated',
            shell = process.env.SHELL || '/bin/bash',
            env = {},
            autoConnect = true
        } = options;

        const terminalId = `${agentName}-${Date.now()}`;
        
        try {
            let terminalProcess;

            if (terminal === 'integrated') {
                // Launch in VS Code integrated terminal
                terminalProcess = await this.launchInVSCode(agentName, workspace, env);
            } else if (terminal === 'external') {
                // Launch in external terminal
                terminalProcess = await this.launchInExternalTerminal(agentName, workspace, env);
            } else if (terminal === 'headless') {
                // Launch headless process
                terminalProcess = await this.launchHeadless(agentName, workspace, env);
            }

            this.terminals.set(terminalId, {
                id: terminalId,
                agentName,
                terminal: terminal,
                process: terminalProcess,
                workspace,
                startTime: new Date(),
                status: 'running'
            });

            this.emit('terminal:launched', { terminalId, agentName });

            if (autoConnect) {
                await this.connectAgentToChannel(terminalId, agentName);
            }

            return terminalId;

        } catch (error) {
            this.emit('terminal:error', { agentName, error });
            throw error;
        }
    }

    async launchInVSCode(agentName, workspace, env) {
        // Create agent startup script
        const scriptPath = await this.createAgentScript(agentName, workspace);
        
        // Use VS Code CLI to create new terminal
        const vscodeCommand = `code --new-window --goto "${scriptPath}" && code --command "workbench.action.terminal.new"`;
        
        return new Promise((resolve, reject) => {
            exec(vscodeCommand, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    // Return a mock process object for VS Code terminal
                    resolve({
                        type: 'vscode',
                        command: vscodeCommand,
                        kill: () => {
                            // VS Code terminals need to be closed manually
                            console.log(`Please close VS Code terminal for ${agentName}`);
                        }
                    });
                }
            });
        });
    }

    async launchInExternalTerminal(agentName, workspace, env) {
        const scriptPath = await this.createAgentScript(agentName, workspace);
        
        // Platform-specific terminal launch commands
        const platform = process.platform;
        let command;

        if (platform === 'darwin') {
            // macOS - use Terminal.app or iTerm2
            command = `osascript -e 'tell app "Terminal" to do script "cd ${workspace} && ${scriptPath}"'`;
        } else if (platform === 'win32') {
            // Windows - use Windows Terminal or cmd
            command = `start cmd /k "cd /d ${workspace} && ${scriptPath}"`;
        } else {
            // Linux - try common terminal emulators
            command = `gnome-terminal -- bash -c "cd ${workspace} && ${scriptPath}; exec bash"`;
        }

        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        type: 'external',
                        command,
                        kill: () => {
                            console.log(`External terminal for ${agentName} must be closed manually`);
                        }
                    });
                }
            });
        });
    }

    async launchHeadless(agentName, workspace, env) {
        const scriptPath = await this.createAgentScript(agentName, workspace);
        
        // Launch as background process
        const agentProcess = spawn('node', [scriptPath], {
            cwd: workspace,
            env: { ...process.env, ...env, AGENT_NAME: agentName },
            detached: false,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // Capture output
        agentProcess.stdout.on('data', (data) => {
            this.emit('agent:output', { agentName, data: data.toString() });
        });

        agentProcess.stderr.on('data', (data) => {
            this.emit('agent:error', { agentName, data: data.toString() });
        });

        agentProcess.on('close', (code) => {
            this.emit('agent:closed', { agentName, code });
        });

        this.agentProcesses.set(agentName, agentProcess);

        return agentProcess;
    }

    async createAgentScript(agentName, workspace) {
        const scriptDir = path.join(workspace, '.workflow', 'scripts');
        await fs.mkdir(scriptDir, { recursive: true });
        
        const scriptPath = path.join(scriptDir, `${agentName}-launcher.js`);
        
        const scriptContent = `#!/usr/bin/env node

const path = require('path');
const { Orchestrator } = require('${path.join(__dirname, '..', 'orchestrator.js')}');
const agentLoader = require('${path.join(__dirname, '..', 'agent-loader.js')}');
const contextManager = require('${path.join(__dirname, '..', 'context-manager.js')}');

async function runAgent() {
    const agentName = '${agentName}';
    console.log(\`Starting agent: \${agentName}\`);
    console.log(\`Workspace: ${workspace}\`);
    console.log('---');

    try {
        // Initialize context manager
        await contextManager.initialize();
        
        // Load agent
        const agent = await agentLoader.loadAgent(agentName);
        
        if (!agent) {
            console.error(\`Agent '\${agentName}' not found\`);
            process.exit(1);
        }

        // Write startup message to channel
        await contextManager.writeToChannel(agentName, 
            \`Agent started in \${process.env.TERMINAL_TYPE || 'terminal'}\`,
            { type: 'agent-startup' }
        );

        // Start monitoring channel for messages
        const channelMonitor = require('${path.join(__dirname, '..', 'channel-monitor.js')}');
        await channelMonitor.start();

        // Register message handler
        channelMonitor.registerHandler(agentName, async (message) => {
            console.log(\`Received message from \${message.agent}: \${message.content}\`);
            
            // Process message based on type
            if (message.metadata.type === 'task-assignment') {
                const task = JSON.parse(message.content);
                const result = await agent.execute(task);
                
                // Write result back to channel
                await contextManager.writeToChannel(agentName,
                    JSON.stringify(result),
                    { type: 'task-result', target: message.agent }
                );
            }
        });

        console.log(\`Agent \${agentName} is ready and monitoring channel\`);
        console.log('Press Ctrl+C to stop');

        // Keep process alive
        process.stdin.resume();

    } catch (error) {
        console.error('Agent startup error:', error);
        process.exit(1);
    }
}

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\\nShutting down agent...');
    
    try {
        await contextManager.writeToChannel('${agentName}',
            'Agent shutting down',
            { type: 'agent-shutdown' }
        );
    } catch (e) {
        // Ignore errors during shutdown
    }
    
    process.exit(0);
});

// Run the agent
runAgent().catch(console.error);
`;

        await fs.writeFile(scriptPath, scriptContent);
        await fs.chmod(scriptPath, '755');
        
        return scriptPath;
    }

    async connectAgentToChannel(terminalId, agentName) {
        // Write connection message to channel
        const contextManager = require('./context-manager');
        await contextManager.writeToChannel('terminal-manager',
            `Agent ${agentName} connected via terminal ${terminalId}`,
            { type: 'agent-connected', agent: agentName }
        );
    }

    async sendToAgent(agentName, message, metadata = {}) {
        const contextManager = require('./context-manager');
        await contextManager.writeToChannel('terminal-manager',
            JSON.stringify(message),
            { type: 'task-assignment', target: agentName, ...metadata }
        );
    }

    async broadcastToAgents(message, metadata = {}) {
        const contextManager = require('./context-manager');
        await contextManager.writeToChannel('terminal-manager',
            JSON.stringify(message),
            { type: 'broadcast', ...metadata }
        );
    }

    async stopTerminal(terminalId) {
        const terminal = this.terminals.get(terminalId);
        
        if (!terminal) {
            return false;
        }

        // Send shutdown message
        await this.sendToAgent(terminal.agentName, {
            action: 'shutdown',
            reason: 'Terminal stop requested'
        });

        // Kill process if it's headless
        if (terminal.process && terminal.process.kill) {
            terminal.process.kill();
        }

        terminal.status = 'stopped';
        terminal.endTime = new Date();
        
        this.emit('terminal:stopped', { terminalId, agentName: terminal.agentName });
        
        return true;
    }

    async stopAllTerminals() {
        const promises = [];
        
        for (const [terminalId] of this.terminals) {
            promises.push(this.stopTerminal(terminalId));
        }
        
        await Promise.all(promises);
    }

    getTerminal(terminalId) {
        return this.terminals.get(terminalId);
    }

    getAgentTerminals(agentName) {
        const terminals = [];
        
        for (const [id, terminal] of this.terminals) {
            if (terminal.agentName === agentName) {
                terminals.push(terminal);
            }
        }
        
        return terminals;
    }

    getActiveTerminals() {
        const active = [];
        
        for (const [id, terminal] of this.terminals) {
            if (terminal.status === 'running') {
                active.push(terminal);
            }
        }
        
        return active;
    }

    async launchWorkflow(workflow, options = {}) {
        const {
            parallel = true,
            terminalType = 'integrated'
        } = options;

        const agents = this.extractAgentsFromWorkflow(workflow);
        const launchedTerminals = [];

        if (parallel) {
            // Launch all agents in parallel
            const promises = agents.map(agent => 
                this.launchAgent(agent, { terminal: terminalType })
            );
            
            const terminalIds = await Promise.all(promises);
            launchedTerminals.push(...terminalIds);
        } else {
            // Launch agents sequentially
            for (const agent of agents) {
                const terminalId = await this.launchAgent(agent, { terminal: terminalType });
                launchedTerminals.push(terminalId);
            }
        }

        return launchedTerminals;
    }

    extractAgentsFromWorkflow(workflow) {
        const agents = new Set();
        
        const extractFromSteps = (steps) => {
            for (const step of steps || []) {
                if (step.agent) {
                    agents.add(step.agent);
                }
                if (step.agents) {
                    step.agents.forEach(a => agents.add(a));
                }
                if (step.then) {
                    extractFromSteps(step.then);
                }
                if (step.else) {
                    extractFromSteps(step.else);
                }
                if (step.steps) {
                    extractFromSteps(step.steps);
                }
            }
        };

        extractFromSteps(workflow.steps);
        return Array.from(agents);
    }

    async getTerminalStatus() {
        const status = {
            total: this.terminals.size,
            running: 0,
            stopped: 0,
            byAgent: {},
            byType: {}
        };

        for (const [id, terminal] of this.terminals) {
            if (terminal.status === 'running') {
                status.running++;
            } else {
                status.stopped++;
            }

            // Count by agent
            status.byAgent[terminal.agentName] = (status.byAgent[terminal.agentName] || 0) + 1;

            // Count by terminal type
            status.byType[terminal.terminal] = (status.byType[terminal.terminal] || 0) + 1;
        }

        return status;
    }
}

module.exports = new TerminalManager();