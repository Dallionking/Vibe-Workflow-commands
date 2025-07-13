const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const contextManager = require('./context-manager');
const channelMonitor = require('./channel-monitor');

class AgentBase {
    constructor(agentName, config = {}) {
        this.name = agentName;
        this.config = config;
        this.role = config.role || 'agent';
        this.terminalId = config.terminalId || 'unknown';
        this.isRunning = false;
        this.fileWatchers = new Map();
    }

    async start() {
        console.log(`\n🤖 ${this.name} Starting...`);
        console.log(`📍 Role: ${this.role}`);
        console.log(`🖥️  Terminal: ${this.terminalId}\n`);

        // Initialize context
        await contextManager.initialize();

        // Announce presence
        await this.announcePresence();

        // Start monitoring
        await this.startMonitoring();

        // Show ready message
        this.showReadyMessage();

        this.isRunning = true;

        // Keep process alive
        process.stdin.resume();
    }

    async announcePresence() {
        await contextManager.writeToChannel(this.name,
            `Agent started in Terminal ${this.terminalId}`,
            { 
                type: 'agent-startup',
                role: this.role,
                terminal: this.terminalId,
                capabilities: this.config.capabilities || []
            }
        );
    }

    async startMonitoring() {
        // Monitor channel for messages
        channelMonitor.on('message', async (msg) => {
            // Check if message is for this agent
            if (this.shouldHandleMessage(msg)) {
                await this.handleMessage(msg);
            }
        });

        // Start channel monitor
        await channelMonitor.start();

        // Monitor specific files based on role
        this.setupFileWatchers();
    }

    shouldHandleMessage(message) {
        // Handle messages targeted to this agent
        if (message.metadata.target === this.name) {
            return true;
        }

        // Handle broadcast messages
        if (message.metadata.target === 'all-agents') {
            return true;
        }

        // Handle role-based messages
        if (message.metadata.target === `role:${this.role}`) {
            return true;
        }

        // Handle task assignments
        if (message.metadata.type === 'task-assignment') {
            const task = JSON.parse(message.content);
            if (task.assignedTo === this.name || task.role === this.role) {
                return true;
            }
        }

        return false;
    }

    async handleMessage(message) {
        console.log(`\n📨 Received message from ${message.agent}`);
        console.log(`Type: ${message.metadata.type}`);
        
        switch (message.metadata.type) {
            case 'task-assignment':
                await this.handleTaskAssignment(message);
                break;
            
            case 'status-request':
                await this.reportStatus();
                break;
            
            case 'file-update':
                await this.handleFileUpdate(message);
                break;
            
            case 'dependency-satisfied':
                await this.handleDependencySatisfied(message);
                break;
            
            default:
                // Agent-specific handling
                if (this.config.messageHandler) {
                    await this.config.messageHandler(message);
                }
        }
    }

    async handleTaskAssignment(message) {
        const task = JSON.parse(message.content);
        console.log(`\n🎯 New task assigned: ${task.name}`);
        console.log(`Description: ${task.description}`);
        
        // Acknowledge task
        await contextManager.writeToChannel(this.name,
            `Task acknowledged: ${task.name}`,
            { 
                type: 'task-acknowledged',
                taskId: task.id,
                target: message.agent
            }
        );

        // Execute task based on agent capabilities
        if (this.config.executeTask) {
            const result = await this.config.executeTask(task);
            
            // Report completion
            await contextManager.writeToChannel(this.name,
                JSON.stringify(result),
                { 
                    type: 'task-complete',
                    taskId: task.id,
                    target: message.agent
                }
            );
        }
    }

    setupFileWatchers() {
        // Watch channel.md
        const channelPath = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
        
        // Watch project files based on role
        if (this.role === 'frontend' || this.role === 'developer') {
            this.watchDirectory('src', ['js', 'jsx', 'ts', 'tsx', 'css']);
        }
        
        if (this.role === 'backend' || this.role === 'developer') {
            this.watchDirectory('api', ['js', 'ts', 'py']);
            this.watchDirectory('server', ['js', 'ts', 'py']);
        }
        
        if (this.role === 'tester' || this.role === 'qa') {
            this.watchDirectory('tests', ['js', 'ts', 'spec.js']);
            this.watchDirectory('__tests__', ['js', 'ts']);
        }

        // Watch .vibe-status.md for phase changes
        this.watchFile('.vibe-status.md', async (event) => {
            if (event === 'change') {
                console.log('\n📊 Project status updated');
                await this.checkPhaseChange();
            }
        });
    }

    watchDirectory(dir, extensions) {
        const watchPath = path.join(process.cwd(), dir);
        
        try {
            const watcher = chokidar.watch(watchPath, {
                ignored: /(^|[\/\\])\../, // ignore dotfiles
                persistent: true,
                ignoreInitial: true
            });

            watcher.on('change', async (filepath) => {
                const ext = path.extname(filepath).slice(1);
                if (extensions.includes(ext)) {
                    await this.handleFileChange(filepath, 'change');
                }
            });

            watcher.on('add', async (filepath) => {
                const ext = path.extname(filepath).slice(1);
                if (extensions.includes(ext)) {
                    await this.handleFileChange(filepath, 'add');
                }
            });

            this.fileWatchers.set(dir, watcher);
            console.log(`👁️  Watching: ${dir}/ for ${extensions.join(', ')} files`);
            
        } catch (error) {
            // Directory doesn't exist yet
        }
    }

    watchFile(filepath, handler) {
        try {
            const watcher = chokidar.watch(filepath, {
                persistent: true,
                ignoreInitial: true
            });

            watcher.on('change', handler);
            watcher.on('add', handler);

            this.fileWatchers.set(filepath, watcher);
            console.log(`👁️  Watching: ${filepath}`);
            
        } catch (error) {
            // File doesn't exist yet
        }
    }

    async handleFileChange(filepath, event) {
        const relPath = path.relative(process.cwd(), filepath);
        console.log(`\n📝 File ${event}: ${relPath}`);
        
        // Notify other agents about file change
        await contextManager.writeToChannel(this.name,
            JSON.stringify({ file: relPath, event }),
            { 
                type: 'file-update',
                target: 'all-agents'
            }
        );

        // Agent-specific file handling
        if (this.config.onFileChange) {
            await this.config.onFileChange(filepath, event);
        }
    }

    async checkPhaseChange() {
        try {
            const status = await fs.promises.readFile('.vibe-status.md', 'utf8');
            const phaseMatch = status.match(/Current Phase:\s*(phase-\d+)/i);
            
            if (phaseMatch) {
                const newPhase = phaseMatch[1];
                if (newPhase !== this.currentPhase) {
                    console.log(`\n🔄 Phase changed to: ${newPhase}`);
                    this.currentPhase = newPhase;
                    
                    // Notify about phase change
                    await contextManager.writeToChannel(this.name,
                        `Detected phase change to ${newPhase}`,
                        { 
                            type: 'phase-change',
                            phase: newPhase,
                            target: 'orchestrator'
                        }
                    );
                }
            }
        } catch (error) {
            // Error reading status
        }
    }

    async reportStatus() {
        const status = {
            agent: this.name,
            role: this.role,
            terminal: this.terminalId,
            running: this.isRunning,
            uptime: process.uptime(),
            watching: Array.from(this.fileWatchers.keys())
        };

        await contextManager.writeToChannel(this.name,
            JSON.stringify(status),
            { 
                type: 'status-report',
                target: 'orchestrator'
            }
        );
    }

    showReadyMessage() {
        console.log('\n' + '='.repeat(60));
        console.log(`✅ ${this.name} is ready and monitoring`);
        console.log('='.repeat(60));
        console.log('\n📋 Capabilities:');
        
        if (this.role === 'orchestrator' || this.role === 'coordinator') {
            console.log('  • Coordinate other agents');
            console.log('  • Manage workflows');
            console.log('  • Handle user commands');
            console.log('\n💬 You can interact with me directly!');
            console.log('Try: /workflow list');
        } else {
            console.log(`  • ${this.role} tasks`);
            console.log('  • File monitoring');
            console.log('  • Task execution');
            console.log('\n💬 Waiting for tasks from orchestrator...');
        }
        
        console.log('\n👁️  Monitoring:');
        console.log('  • channel.md for messages');
        console.log('  • Project files for changes');
        console.log('  • .vibe-status.md for phase updates');
        console.log('\n');
    }

    async shutdown() {
        console.log(`\n🛑 ${this.name} shutting down...`);
        
        // Close file watchers
        for (const [path, watcher] of this.fileWatchers) {
            await watcher.close();
        }
        
        // Announce shutdown
        await contextManager.writeToChannel(this.name,
            'Agent shutting down',
            { type: 'agent-shutdown' }
        );
        
        this.isRunning = false;
    }
}

module.exports = AgentBase;