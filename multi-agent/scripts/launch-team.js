#!/usr/bin/env node

const terminalManager = require('../core/terminal-manager');
const loadBalancer = require('../core/load-balancer');

async function launchDevelopmentTeam(teamSize = 8) {
    console.log(`🚀 Launching ${teamSize}-agent development team...`);
    
    const teams = {
        frontend: [
            'frontend-agent-1',
            'frontend-agent-2',
            'frontend-agent-3'
        ],
        backend: [
            'backend-agent-1',
            'backend-agent-2',
            'backend-agent-3'
        ],
        support: [
            'database-agent',
            'testing-agent',
            'documentation-agent',
            'security-agent',
            'performance-agent'
        ]
    };
    
    // Register specializations
    loadBalancer.registerSpecialization('frontend-agent-1', {
        expertise: ['frontend', 'components'],
        capacity: 8
    });
    
    loadBalancer.registerSpecialization('backend-agent-1', {
        expertise: ['backend', 'api'],
        capacity: 10
    });
    
    const launchedAgents = [];
    
    // Launch orchestrator first
    console.log('📋 Launching orchestrator...');
    await terminalManager.launchAgent('orchestrator', {
        terminal: 'integrated'
    });
    
    // Launch teams
    for (const [teamName, agents] of Object.entries(teams)) {
        console.log(`\n🔧 Launching ${teamName} team...`);
        
        for (const agent of agents.slice(0, Math.ceil(teamSize / 3))) {
            try {
                const terminalId = await terminalManager.launchAgent(agent, {
                    terminal: 'integrated'
                });
                launchedAgents.push({ agent, terminalId });
                console.log(`  ✅ ${agent} launched`);
                
                // Small delay to avoid overwhelming the system
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.log(`  ❌ Failed to launch ${agent}: ${error.message}`);
            }
        }
    }
    
    console.log(`\n✨ Development team ready!`);
    console.log(`Total agents running: ${launchedAgents.length}`);
    
    // Show quick commands
    console.log('\n📝 Quick Commands:');
    console.log('  /terminals list     - See all agents');
    console.log('  /channel show       - View communications');
    console.log('  /workflow run parallel-development - Start parallel work');
    
    return launchedAgents;
}

// Run if called directly
if (require.main === module) {
    const teamSize = parseInt(process.argv[2]) || 8;
    launchDevelopmentTeam(teamSize).catch(console.error);
}

module.exports = { launchDevelopmentTeam };