#!/usr/bin/env node

const agentGenerator = require('../core/agent-generator');
const terminalManager = require('../core/terminal-manager');
const contextManager = require('../core/context-manager');
const fs = require('fs').promises;
const path = require('path');

async function initializePhaseAgents(options = {}) {
    const { phase, projectType = 'new', launchAgents = true } = options;
    
    console.log('🚀 Initializing Phase-Aware Multi-Agent System');
    console.log('=' .repeat(50));
    
    try {
        // Determine current phase
        let currentPhase = phase;
        if (!currentPhase) {
            currentPhase = await detectCurrentPhase();
        }
        
        console.log(`\n📋 Current Phase: ${currentPhase || 'Not detected'}`);
        
        // Get project context
        const projectContext = await getProjectContext();
        console.log(`📁 Project: ${projectContext.projectName}`);
        console.log(`🏗️  Type: ${projectType}`);
        
        if (projectType === 'retrofit') {
            // Generate retrofit agents for existing projects
            console.log('\n🔧 Generating retrofit agents...');
            const retrofitAgents = await agentGenerator.generateRetrofitAgents(projectContext);
            
            console.log(`✅ Generated ${retrofitAgents.length} retrofit agents:`);
            retrofitAgents.forEach(agent => {
                console.log(`  - ${agent.name}`);
            });
            
            if (launchAgents) {
                console.log('\n🚀 Launching retrofit agents...');
                await launchAgentTeam(retrofitAgents.map(a => a.name));
            }
            
        } else if (currentPhase) {
            // Generate phase-specific agents
            console.log(`\n🔧 Generating agents for ${currentPhase}...`);
            const phaseAgents = await agentGenerator.generateAgentForPhase(currentPhase, projectContext);
            
            console.log(`✅ Generated ${phaseAgents.length} agents:`);
            phaseAgents.forEach(agent => {
                console.log(`  - ${agent.name} (${agent.definition.agent.role})`);
            });
            
            // Create phase workflow
            await createPhaseWorkflow(currentPhase, phaseAgents);
            
            if (launchAgents) {
                console.log('\n🚀 Launching phase agents...');
                await launchAgentTeam(phaseAgents.map(a => a.name));
            }
            
        } else {
            console.log('\n⚠️  No phase detected. Please specify a phase or ensure .vibe-status.md exists.');
            return;
        }
        
        // Initialize channel with phase context
        await initializeChannelForPhase(currentPhase || 'retrofit', projectContext);
        
        console.log('\n✨ Phase-aware multi-agent system initialized!');
        console.log('\n📝 Next Steps:');
        console.log('1. Review generated agents in multi-agent/agents/generated/');
        console.log('2. Monitor channel.md for agent communications');
        console.log('3. Use /workflow run <phase-workflow> to execute phase tasks');
        console.log('4. Agents will coordinate based on phase dependencies');
        
    } catch (error) {
        console.error('❌ Error initializing phase agents:', error);
        process.exit(1);
    }
}

async function detectCurrentPhase() {
    try {
        const status = await fs.readFile('.vibe-status.md', 'utf8');
        
        // Look for current phase
        const phaseMatch = status.match(/Current Phase:\s*(phase-\d+)/i);
        if (phaseMatch) {
            return phaseMatch[1];
        }
        
        // Look for last completed phase
        const completedPhases = status.match(/phase-\d+:\s*✅/gi) || [];
        if (completedPhases.length > 0) {
            const lastPhase = completedPhases[completedPhases.length - 1];
            const num = parseInt(lastPhase.match(/\d+/)[0]);
            return `phase-${num + 1}`;
        }
        
        return 'phase-1'; // Default to phase 1
    } catch (error) {
        return null;
    }
}

async function getProjectContext() {
    try {
        const status = await fs.readFile('.vibe-status.md', 'utf8');
        return {
            projectName: status.match(/Project:\s*(.+)/)?.[1] || 'Unknown Project',
            type: status.match(/Type:\s*(.+)/)?.[1] || 'Unknown Type',
            description: status.match(/Description:\s*(.+)/)?.[1] || '',
            techStack: status.match(/Tech Stack:\s*(.+)/)?.[1] || ''
        };
    } catch (error) {
        return {
            projectName: 'New Project',
            type: 'Unknown',
            description: '',
            techStack: ''
        };
    }
}

async function createPhaseWorkflow(phase, agents) {
    const workflowPath = path.join(
        process.cwd(),
        '.workflow',
        'definitions',
        `${phase}-workflow.yaml`
    );
    
    const primaryAgent = agents.find(a => a.definition.agent.role === 'primary');
    const supportAgents = agents.filter(a => a.definition.agent.role === 'support');
    
    const workflow = {
        name: `${phase}-workflow`,
        description: `Automated workflow for ${phase}`,
        version: '1.0.0',
        
        steps: [
            // Primary agent leads
            {
                type: 'agent',
                agent: primaryAgent.name,
                params: {
                    action: 'initialize-phase',
                    phase: phase
                }
            },
            
            // Support agents work in parallel
            {
                type: 'parallel',
                agents: supportAgents.map(a => a.name),
                params: {
                    phase: phase,
                    coordination: 'channel'
                }
            },
            
            // Primary agent synthesizes
            {
                type: 'agent',
                agent: primaryAgent.name,
                params: {
                    action: 'synthesize-results',
                    phase: phase
                }
            },
            
            // Update phase status
            {
                type: 'agent',
                agent: 'phase-updater',
                params: {
                    phase: phase,
                    status: 'complete'
                }
            }
        ],
        
        dependencies: {
            phase: phase,
            requires: phase !== 'phase-1' ? [`phase-${parseInt(phase.split('-')[1]) - 1}`] : []
        }
    };
    
    await fs.mkdir(path.dirname(workflowPath), { recursive: true });
    await fs.writeFile(workflowPath, require('js-yaml').dump(workflow));
    
    console.log(`  📄 Created workflow: ${workflowPath}`);
}

async function launchAgentTeam(agentNames) {
    const launched = [];
    
    // Always launch orchestrator first
    try {
        await terminalManager.launchAgent('orchestrator', {
            terminal: 'integrated'
        });
        console.log('  ✅ Orchestrator launched');
    } catch (error) {
        console.log('  ⚠️  Orchestrator may already be running');
    }
    
    // Launch phase agents
    for (const agentName of agentNames) {
        try {
            const terminalId = await terminalManager.launchAgent(agentName, {
                terminal: 'integrated'
            });
            launched.push({ agent: agentName, terminalId });
            console.log(`  ✅ ${agentName} launched`);
            
            // Small delay
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.log(`  ❌ Failed to launch ${agentName}: ${error.message}`);
        }
    }
    
    return launched;
}

async function initializeChannelForPhase(phase, projectContext) {
    await contextManager.initialize();
    
    // Write phase initialization to channel
    await contextManager.writeToChannel('orchestrator',
        `Initializing ${phase} with phase-aware agents`,
        { type: 'phase-init', phase: phase }
    );
    
    await contextManager.writeToChannel('orchestrator',
        `Project Context: ${JSON.stringify(projectContext, null, 2)}`,
        { type: 'context-broadcast' }
    );
    
    // Save phase context
    await contextManager.saveSharedContext(`${phase}-context`, {
        phase: phase,
        project: projectContext,
        startTime: new Date().toISOString(),
        agents: 'auto-generated'
    });
}

// CLI interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        phase: args.find(a => a.startsWith('--phase='))?.split('=')[1],
        projectType: args.includes('--retrofit') ? 'retrofit' : 'new',
        launchAgents: !args.includes('--no-launch')
    };
    
    if (args.includes('--help')) {
        console.log(`
Usage: node init-phase-agents.js [options]

Options:
  --phase=<phase>    Specify phase (e.g., phase-1, phase-2)
  --retrofit         Initialize for retrofitting existing project
  --no-launch        Generate agents without launching terminals
  --help             Show this help message

Examples:
  node init-phase-agents.js                    # Auto-detect phase
  node init-phase-agents.js --phase=phase-3    # Specific phase
  node init-phase-agents.js --retrofit          # Retrofit existing project
        `);
        process.exit(0);
    }
    
    initializePhaseAgents(options).catch(console.error);
}

module.exports = { initializePhaseAgents };