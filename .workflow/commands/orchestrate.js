#!/usr/bin/env node

// Multi-Agent Orchestrator Command
// Usage: /orchestrate

const fs = require('fs').promises;
const path = require('path');

class OrchestratorCommand {
    constructor() {
        this.orchestrator = null;
        this.isRunning = false;
        this.commandHistory = [];
    }

    async initialize() {
        // Load the orchestrator configuration
        const configPath = path.join(process.cwd(), '.workflow/orchestrator/config.js');
        
        try {
            const OrchestratorClass = require(configPath);
            this.orchestrator = new OrchestratorClass();
            await this.orchestrator.start();
            this.isRunning = true;
            
            console.log('🎯 Multi-Agent Orchestrator is now active');
            console.log('Type "help" for available commands');
            
            // Start interactive command loop
            await this.startCommandLoop();
            
        } catch (error) {
            console.error('❌ Failed to initialize orchestrator:', error.message);
            process.exit(1);
        }
    }

    async startCommandLoop() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'orchestrator> '
        });

        rl.prompt();

        rl.on('line', async (input) => {
            const trimmed = input.trim();
            
            if (trimmed === 'exit' || trimmed === 'quit') {
                console.log('👋 Shutting down orchestrator...');
                rl.close();
                return;
            }

            if (trimmed) {
                await this.processCommand(trimmed);
                this.commandHistory.push(trimmed);
            }
            
            rl.prompt();
        });

        rl.on('close', () => {
            console.log('Orchestrator stopped.');
            process.exit(0);
        });
    }

    async processCommand(input) {
        const parts = input.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        try {
            const result = await this.orchestrator.processCommand(command, args);
            
            if (typeof result === 'object') {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(result);
            }
            
        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }

    // Status monitoring
    async showStatus() {
        if (!this.orchestrator) {
            console.log('Orchestrator not initialized');
            return;
        }

        const status = this.orchestrator.getStatus();
        
        console.log('\n📊 Multi-Agent System Status');
        console.log('============================');
        console.log(`Active: ${status.active ? '✅' : '❌'}`);
        console.log(`Agents Connected: ${status.agents.length}`);
        console.log(`Active Tasks: ${status.activeTasks}`);
        console.log(`Completed Tasks: ${status.completedTasks}`);
        
        if (status.agents.length > 0) {
            console.log('\n🤖 Connected Agents:');
            status.agents.forEach(agent => {
                console.log(`  • ${agent.name} (Terminal ${agent.terminalId}) - ${agent.status}`);
                console.log(`    Specializations: ${agent.specializations.join(', ')}`);
                console.log(`    Current Tasks: ${agent.currentTasks.length}`);
            });
        }
    }

    // Quick task assignment
    async quickTask(description) {
        if (!this.orchestrator) {
            console.error('Orchestrator not initialized');
            return;
        }

        console.log(`🎯 Analyzing task: "${description}"`);
        
        try {
            const breakdown = await this.orchestrator.analyzeAndAssignTask(description);
            
            console.log('\n📋 Task Breakdown:');
            breakdown.forEach((subtask, index) => {
                console.log(`  ${index + 1}. ${subtask.description} (${subtask.type})`);
                console.log(`     Assigned to: ${subtask.assignedTo || 'Not assigned'}`);
                console.log(`     Dependencies: ${subtask.dependencies.join(', ') || 'None'}`);
            });
            
        } catch (error) {
            console.error('❌ Task assignment failed:', error.message);
        }
    }

    // Workflow execution
    async runWorkflow(workflowName, description) {
        if (!this.orchestrator) {
            console.error('Orchestrator not initialized');
            return;
        }

        console.log(`🔄 Executing workflow: ${workflowName}`);
        console.log(`Description: ${description}`);
        
        try {
            await this.orchestrator.executeWorkflow(workflowName, description);
            console.log('✅ Workflow started successfully');
            
        } catch (error) {
            console.error('❌ Workflow execution failed:', error.message);
        }
    }
}

// Command line interface
async function main() {
    const command = new OrchestratorCommand();
    
    // Handle different invocation methods
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Interactive mode
        await command.initialize();
    } else if (args[0] === 'status') {
        // Quick status check
        await command.initialize();
        await command.showStatus();
        process.exit(0);
    } else if (args[0] === 'task') {
        // Quick task assignment
        const taskDescription = args.slice(1).join(' ');
        if (taskDescription) {
            await command.initialize();
            await command.quickTask(taskDescription);
            process.exit(0);
        } else {
            console.error('Usage: /orchestrate task <description>');
            process.exit(1);
        }
    } else if (args[0] === 'workflow') {
        // Quick workflow execution
        if (args.length >= 3) {
            const workflowName = args[1];
            const description = args.slice(2).join(' ');
            await command.initialize();
            await command.runWorkflow(workflowName, description);
            process.exit(0);
        } else {
            console.error('Usage: /orchestrate workflow <name> <description>');
            process.exit(1);
        }
    } else {
        console.error('Unknown command. Use: /orchestrate [status|task|workflow]');
        process.exit(1);
    }
}

// Export for testing
module.exports = OrchestratorCommand;

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Orchestrator failed:', error);
        process.exit(1);
    });
}