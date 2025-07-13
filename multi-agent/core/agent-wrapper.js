#!/usr/bin/env node

/**
 * Agent Wrapper for Claude Code Instances
 * Provides agent-like behavior around Claude Code
 */

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { spawn } = require('child_process');

class AgentWrapper {
    constructor(agentName, agentRole) {
        this.agentName = agentName;
        this.agentRole = agentRole;
        this.channelFile = path.join(process.cwd(), '.workflow', 'context', 'channel.md');
        this.isRunning = false;
        this.lastChannelPosition = 0;
        this.tasksCompleted = 0;
        
        // Agent configuration
        this.capabilities = this.getAgentCapabilities(agentRole);
        
        // Setup graceful shutdown
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());
    }

    getAgentCapabilities(role) {
        const capabilities = {
            'research-agent': {
                description: 'Analyzes codebases and gathers information',
                tools: ['Read', 'Grep', 'LS', 'WebSearch', 'WebFetch'],
                specialties: ['pattern analysis', 'documentation review', 'codebase exploration']
            },
            'coding-agent': {
                description: 'Implements features and writes code',
                tools: ['Read', 'Write', 'Edit', 'MultiEdit', 'Bash'],
                specialties: ['component creation', 'feature implementation', 'code generation']
            },
            'testing-agent': {
                description: 'Creates tests and validates code quality',
                tools: ['Read', 'Write', 'Bash', 'Edit'],
                specialties: ['test creation', 'quality validation', 'coverage analysis']
            },
            'validation-agent': {
                description: 'Validates compliance and conventions',
                tools: ['Read', 'Grep', 'LS'],
                specialties: ['convention checking', 'compliance validation', 'code review']
            }
        };
        
        return capabilities[role] || capabilities['coding-agent'];
    }

    async start() {
        console.log(`🤖 Starting ${this.agentName} (${this.agentRole})`);
        console.log(`📋 Description: ${this.capabilities.description}`);
        console.log(`🔧 Tools: ${this.capabilities.tools.join(', ')}`);
        console.log(`⭐ Specialties: ${this.capabilities.specialties.join(', ')}`);
        console.log('');
        
        // Ensure channel exists
        await this.ensureChannelExists();
        
        // Announce agent ready
        await this.announceReady();
        
        // Start monitoring channel
        this.startChannelMonitoring();
        
        this.isRunning = true;
        
        console.log('✅ Agent is ready and monitoring channel for tasks');
        console.log('👁️  Watching .workflow/context/channel.md for assignments');
        console.log('📝 Agent will automatically respond to task assignments');
        console.log('');
        console.log('Press Ctrl+C to stop this agent');
        console.log('');
        
        // Keep process alive
        this.keepAlive();
    }

    async ensureChannelExists() {
        const channelDir = path.dirname(this.channelFile);
        
        try {
            await fs.promises.mkdir(channelDir, { recursive: true });
            
            if (!fs.existsSync(this.channelFile)) {
                const initialContent = `# Multi-Agent Communication Channel

## System Status  
- **Orchestrator**: Waiting
- **Active Agents**: 0

---

`;
                await fs.promises.writeFile(this.channelFile, initialContent);
            }
            
            // Get initial file position
            this.lastChannelPosition = fs.statSync(this.channelFile).size;
            
        } catch (error) {
            console.error('❌ Failed to setup channel:', error.message);
            process.exit(1);
        }
    }

    async announceReady() {
        const readyMessage = `
### [${new Date().toISOString()}] ${this.agentName}
**Type:** agent-ready
**Target:** orchestrator

🤖 **${this.agentName} is ready**

**Role:** ${this.agentRole}
**Capabilities:** ${this.capabilities.specialties.join(', ')}
**Status:** Monitoring channel for task assignments
**Tools Available:** ${this.capabilities.tools.join(', ')}

Ready to receive and execute tasks automatically.

---

`;
        
        try {
            fs.appendFileSync(this.channelFile, readyMessage);
            console.log('📡 Announced ready status to orchestrator');
        } catch (error) {
            console.error('⚠️  Failed to announce ready:', error.message);
        }
    }

    startChannelMonitoring() {
        console.log('👁️  Starting channel monitoring...');
        
        const watcher = chokidar.watch(this.channelFile, {
            persistent: true,
            ignoreInitial: true
        });

        watcher.on('change', () => {
            this.checkForNewTasks();
        });

        watcher.on('error', (error) => {
            console.log('⚠️  Channel monitoring error:', error.message);
        });
        
        // Also check periodically in case file watching fails
        setInterval(() => {
            this.checkForNewTasks();
        }, 5000);
    }

    checkForNewTasks() {
        try {
            const currentSize = fs.statSync(this.channelFile).size;
            
            if (currentSize > this.lastChannelPosition) {
                const content = fs.readFileSync(this.channelFile, 'utf8');
                const newContent = content.slice(this.lastChannelPosition);
                
                this.parseNewMessages(newContent);
                this.lastChannelPosition = currentSize;
            }
        } catch (error) {
            console.log('⚠️  Error checking for tasks:', error.message);
        }
    }

    parseNewMessages(content) {
        // Look for task assignments to this agent
        const taskRegex = new RegExp(`### \\[(.*?)\\] orchestrator[\\s\\S]*?\\*\\*Target:\\*\\* ${this.agentName}[\\s\\S]*?\\*\\*Task:\\*\\* ([^\\n]+)[\\s\\S]*?---`, 'g');
        
        let match;
        while ((match = taskRegex.exec(content)) !== null) {
            const [, timestamp, taskDescription] = match;
            console.log(`\n📨 New task received at ${timestamp}:`);
            console.log(`📝 Task: ${taskDescription}`);
            
            this.executeTask(taskDescription, timestamp);
        }
    }

    async executeTask(taskDescription, timestamp) {
        console.log(`\n🚀 Executing task: ${taskDescription}`);
        
        try {
            // Simulate task execution with guidance for manual execution
            const result = await this.processTask(taskDescription);
            
            // Report completion
            await this.reportTaskComplete(taskDescription, result, timestamp);
            
            this.tasksCompleted++;
            console.log(`✅ Task completed successfully (Total: ${this.tasksCompleted})`);
            
        } catch (error) {
            console.log(`❌ Task execution failed: ${error.message}`);
            await this.reportTaskError(taskDescription, error.message, timestamp);
        }
    }

    async processTask(taskDescription) {
        // Provide specific guidance based on agent role and task
        const guidance = this.generateTaskGuidance(taskDescription);
        
        console.log('📋 Task Analysis:');
        console.log(`   ${guidance.analysis}`);
        console.log('');
        console.log('🔧 Recommended Approach:');
        guidance.steps.forEach((step, index) => {
            console.log(`   ${index + 1}. ${step}`);
        });
        console.log('');
        console.log('💡 Suggested Claude Code Tools:');
        console.log(`   ${guidance.tools.join(', ')}`);
        console.log('');
        
        // In a real implementation, this would integrate with Claude Code
        // For now, we provide guidance and simulate completion
        return {
            guidance,
            status: 'guidance_provided',
            timestamp: new Date().toISOString()
        };
    }

    generateTaskGuidance(taskDescription) {
        const task = taskDescription.toLowerCase();
        
        // Generate specific guidance based on agent role and task content
        if (this.agentRole === 'research-agent') {
            if (task.includes('analyze') || task.includes('pattern')) {
                return {
                    analysis: 'Codebase analysis task detected - examining patterns and structure',
                    steps: [
                        'Use Grep to search for specific patterns in the codebase',
                        'Use LS to understand directory structure',
                        'Use Read to examine key files identified',
                        'Compile findings into a comprehensive analysis'
                    ],
                    tools: ['Grep', 'LS', 'Read', 'WebSearch']
                };
            }
        } else if (this.agentRole === 'coding-agent') {
            if (task.includes('create') || task.includes('component') || task.includes('implement')) {
                return {
                    analysis: 'Code creation task detected - implementing new functionality',
                    steps: [
                        'Read existing code to understand patterns and conventions',
                        'Create new file with Write tool or modify existing with Edit',
                        'Follow project conventions for naming and structure',
                        'Test implementation for basic functionality'
                    ],
                    tools: ['Read', 'Write', 'Edit', 'MultiEdit']
                };
            }
        } else if (this.agentRole === 'testing-agent') {
            if (task.includes('test') || task.includes('validate') || task.includes('coverage')) {
                return {
                    analysis: 'Testing task detected - ensuring code quality and coverage',
                    steps: [
                        'Read the code that needs testing',
                        'Create comprehensive test files with Write tool',
                        'Run tests using Bash tool to ensure they pass',
                        'Verify coverage meets requirements (95%+)'
                    ],
                    tools: ['Read', 'Write', 'Bash']
                };
            }
        }
        
        // Default guidance
        return {
            analysis: 'General task detected - applying standard approach',
            steps: [
                'Analyze the task requirements carefully',
                'Use appropriate Claude Code tools for the task',
                'Follow project conventions and best practices',
                'Validate results before completion'
            ],
            tools: this.capabilities.tools
        };
    }

    async reportTaskComplete(taskDescription, result, originalTimestamp) {
        const completionMessage = `
### [${new Date().toISOString()}] ${this.agentName}
**Type:** task-complete
**Target:** orchestrator
**Original Task Time:** ${originalTimestamp}

✅ **Task Completed Successfully**

**Task:** ${taskDescription}
**Status:** ${result.status}
**Approach:** ${result.guidance.analysis}
**Tools Used:** ${result.guidance.tools.join(', ')}
**Completion Time:** ${result.timestamp}

**Summary:** Task guidance provided and ready for manual execution using Claude Code tools.

---

`;
        
        try {
            fs.appendFileSync(this.channelFile, completionMessage);
        } catch (error) {
            console.log('⚠️  Failed to report completion:', error.message);
        }
    }

    async reportTaskError(taskDescription, errorMessage, originalTimestamp) {
        const errorReport = `
### [${new Date().toISOString()}] ${this.agentName}
**Type:** task-error
**Target:** orchestrator
**Original Task Time:** ${originalTimestamp}

❌ **Task Execution Error**

**Task:** ${taskDescription}
**Error:** ${errorMessage}
**Status:** Failed
**Agent:** ${this.agentName} (${this.agentRole})

**Recommendation:** Review task requirements and retry with manual intervention.

---

`;
        
        try {
            fs.appendFileSync(this.channelFile, errorReport);
        } catch (error) {
            console.log('⚠️  Failed to report error:', error.message);
        }
    }

    keepAlive() {
        // Send periodic heartbeat
        setInterval(() => {
            if (this.isRunning) {
                const heartbeat = `
### [${new Date().toISOString()}] ${this.agentName}
**Type:** heartbeat
**Target:** orchestrator

💓 ${this.agentName} heartbeat - still monitoring (${this.tasksCompleted} tasks completed)

---

`;
                
                try {
                    fs.appendFileSync(this.channelFile, heartbeat);
                } catch (error) {
                    // Ignore heartbeat errors
                }
            }
        }, 60000); // Every minute
    }

    shutdown() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        console.log(`\n👋 Shutting down ${this.agentName}...`);
        
        // Report shutdown
        const shutdownMessage = `
### [${new Date().toISOString()}] ${this.agentName}
**Type:** agent-shutdown
**Target:** orchestrator

🛑 **${this.agentName} shutting down**

**Final Stats:**
- Tasks Completed: ${this.tasksCompleted}
- Role: ${this.agentRole}
- Status: Offline

Agent wrapper terminated.

---

`;
        
        try {
            fs.appendFileSync(this.channelFile, shutdownMessage);
        } catch (error) {
            // Ignore shutdown errors
        }
        
        process.exit(0);
    }
}

// CLI interface
if (require.main === module) {
    const agentName = process.argv[2];
    const agentRole = process.argv[3];
    
    if (!agentName || !agentRole) {
        console.log('Usage: node agent-wrapper.js <agent-name> <agent-role>');
        console.log('Example: node agent-wrapper.js research-agent research-agent');
        console.log('');
        console.log('Available roles:');
        console.log('  research-agent   - Analyzes codebases and gathers information');
        console.log('  coding-agent     - Implements features and writes code'); 
        console.log('  testing-agent    - Creates tests and validates code quality');
        console.log('  validation-agent - Validates compliance and conventions');
        process.exit(1);
    }
    
    const agent = new AgentWrapper(agentName, agentRole);
    agent.start().catch(error => {
        console.error('❌ Agent startup failed:', error.message);
        process.exit(1);
    });
}

module.exports = AgentWrapper;