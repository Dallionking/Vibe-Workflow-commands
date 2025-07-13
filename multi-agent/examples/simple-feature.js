#!/usr/bin/env node

/**
 * Simple example of using the multi-agent system to implement a feature
 * This demonstrates the workflow similar to what was shown in the video
 */

const Orchestrator = require('../core/orchestrator');
const WorkflowBuilder = require('../core/workflow-builder');
const terminalManager = require('../core/terminal-manager');
const contextManager = require('../core/context-manager');
const channelMonitor = require('../core/channel-monitor');

async function implementFeatureWithMultipleAgents() {
    console.log('🚀 Starting Multi-Agent Feature Implementation');
    console.log('=' .repeat(50));
    
    // Step 1: Initialize the orchestrator
    console.log('\n1️⃣ Initializing Orchestrator...');
    const orchestrator = new Orchestrator('feature-orchestrator');
    await orchestrator.initialize();
    
    // Step 2: Create a workflow for implementing a user authentication feature
    console.log('\n2️⃣ Creating Feature Implementation Workflow...');
    const workflow = WorkflowBuilder.create()
        .name('user-auth-feature')
        .description('Implement user authentication with multi-agent collaboration')
        
        // Research phase - Agent 1
        .agent('research-agent', {
            topic: 'user authentication best practices',
            depth: 'deep',
            sources: ['documentation', 'web_search']
        })
        
        // Planning phase - Agent 2 
        .agent('planning-agent', {
            feature: 'user-authentication',
            requirements: {
                oauth: true,
                jwt: true,
                two_factor: false
            }
        })
        
        // User approval checkpoint
        .approval('Review research and planning before implementation')
        
        // Parallel implementation - Agents 3, 4, 5
        .parallel(
            'frontend-agent',  // Agent 3: UI components
            'backend-agent',   // Agent 4: API endpoints
            'database-agent'   // Agent 5: Schema design
        )
        .withParams({
            feature: 'user-authentication',
            specs: '{{steps[1].result}}'  // Use planning results
        })
        
        // Testing phase - Agent 6
        .agent('testing-agent', {
            target: 'user-authentication',
            test_types: ['unit', 'integration', 'e2e']
        })
        
        // Documentation - Agent 7
        .agent('documentation-agent', {
            feature: 'user-authentication',
            format: 'markdown'
        })
        
        .build();
    
    // Step 3: Save the workflow
    const workflowPath = '.workflow/definitions/user-auth-feature.yaml';
    await workflow.save(workflowPath);
    console.log(`✅ Workflow saved to: ${workflowPath}`);
    
    // Step 4: Launch agents in terminals (like in the video)
    console.log('\n3️⃣ Launching Agents in Terminals...');
    console.log('This will open multiple terminal windows/tabs');
    
    const agents = [
        'research-agent',
        'planning-agent',
        'frontend-agent',
        'backend-agent',
        'database-agent',
        'testing-agent',
        'documentation-agent'
    ];
    
    // Launch first 3 agents (orchestrator + 2 workers)
    const terminalIds = [];
    for (let i = 0; i < 3; i++) {
        if (agents[i]) {
            const terminalId = await terminalManager.launchAgent(agents[i], {
                terminal: 'integrated',  // Use VS Code integrated terminal
                workspace: process.cwd()
            });
            terminalIds.push(terminalId);
            console.log(`  ✅ Launched ${agents[i]} in terminal ${terminalId}`);
        }
    }
    
    // Step 5: Monitor the channel
    console.log('\n4️⃣ Opening channel.md for monitoring...');
    const channelPath = '.workflow/context/channel.md';
    require('child_process').exec(`code "${channelPath}"`);
    console.log(`  ✅ Channel opened in editor: ${channelPath}`);
    
    // Step 6: Define and execute the workflow
    console.log('\n5️⃣ Executing Workflow...');
    await orchestrator.defineWorkflow('user-auth-feature', workflow);
    
    // Simulate workflow execution
    console.log('\n📋 Workflow Steps:');
    console.log('  1. Research Agent: Gathering authentication best practices');
    console.log('  2. Planning Agent: Creating implementation plan');
    console.log('  3. [User Approval Required]');
    console.log('  4. Frontend, Backend, Database Agents: Parallel implementation');
    console.log('  5. Testing Agent: Running comprehensive tests');
    console.log('  6. Documentation Agent: Generating docs');
    
    // Example of agent communication
    console.log('\n💬 Example Agent Communication:');
    
    await contextManager.writeToChannel('research-agent',
        'Research complete. Found 5 authentication patterns:\n' +
        '1. JWT with refresh tokens\n' +
        '2. OAuth2 integration\n' +
        '3. Session-based auth\n' +
        '4. API key authentication\n' +
        '5. Certificate-based auth',
        { type: 'research-complete', target: 'planning-agent' }
    );
    
    await contextManager.writeToChannel('planning-agent',
        'Based on research, recommending JWT + OAuth2 approach.\n' +
        'Created implementation plan with 12 tasks.',
        { type: 'plan-ready', target: 'orchestrator' }
    );
    
    await contextManager.writeToChannel('orchestrator',
        'Waiting for user approval before proceeding with implementation.',
        { type: 'approval-needed' }
    );
    
    // Show terminal status
    console.log('\n📊 Terminal Status:');
    const status = await terminalManager.getTerminalStatus();
    console.log(`  Total Terminals: ${status.total}`);
    console.log(`  Running: ${status.running}`);
    console.log(`  By Agent: ${JSON.stringify(status.byAgent, null, 2)}`);
    
    // Instructions for the user
    console.log('\n📝 Next Steps:');
    console.log('1. Check the channel.md file to see agent communications');
    console.log('2. Approve the workflow when prompted');
    console.log('3. Watch agents collaborate in their terminals');
    console.log('4. Review outputs in .workflow/context/');
    
    console.log('\n🎯 Useful Commands:');
    console.log('  /channel show        - View channel messages');
    console.log('  /terminals list      - List active agent terminals');
    console.log('  /workflow status     - Check workflow progress');
    console.log('  /terminals stop all  - Stop all agents');
    
    console.log('\n✨ Multi-Agent System Ready!');
}

// Run the example if executed directly
if (require.main === module) {
    implementFeatureWithMultipleAgents()
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = { implementFeatureWithMultipleAgents };