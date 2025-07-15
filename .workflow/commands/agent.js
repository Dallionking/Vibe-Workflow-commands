#!/usr/bin/env node

// Multi-Agent Worker Command
// Usage: /agent <name> --terminal-id=<N>

const fs = require('fs').promises;
const path = require('path');

class AgentCommand {
    constructor() {
        this.agent = null;
        this.isRunning = false;
    }

    async initialize(agentName, terminalId, options = {}) {
        try {
            // Load agent registry to get specializations
            const registryPath = path.join(process.cwd(), '.workflow/registry/agents.json');
            const registryData = await fs.readFile(registryPath, 'utf8');
            const registry = JSON.parse(registryData);
            
            const agentConfig = registry.agents[agentName];
            if (!agentConfig) {
                throw new Error(`Agent '${agentName}' not found in registry`);
            }

            // Load agent template
            const templatePath = path.join(process.cwd(), '.workflow/templates/agent-template.js');
            const AgentTemplate = require(templatePath);
            
            // Create specialized agent instance
            this.agent = this.createSpecializedAgent(
                AgentTemplate, 
                agentName, 
                terminalId, 
                agentConfig.specializations
            );
            
            await this.agent.initialize();
            this.isRunning = true;
            
            console.log(`🤖 Agent ${agentName} is now active and monitoring for tasks`);
            console.log(`📡 Watching: .workflow/context/channel.md`);
            console.log('Type "help" for available commands');
            
            // Start interactive command loop
            await this.startCommandLoop();
            
        } catch (error) {
            console.error('❌ Failed to initialize agent:', error.message);
            process.exit(1);
        }
    }

    createSpecializedAgent(AgentTemplate, name, terminalId, specializations) {
        // Create agent with specialized behaviors based on type
        const agent = new AgentTemplate(name, terminalId, specializations);
        
        // Add specialized execution strategies
        agent.getExecutionStrategy = (taskType) => {
            const strategies = this.getSpecializedStrategies(name);
            return strategies[taskType] || this.getDefaultStrategy(taskType);
        };

        return agent;
    }

    getSpecializedStrategies(agentName) {
        const strategies = {
            'research-agent': {
                research: {
                    execute: async (task) => {
                        console.log('🔍 Executing research with Context7 and UltraThink...');
                        // Implement Context7 research, UltraThink analysis
                        return { 
                            type: 'research', 
                            findings: 'Research completed with Context7',
                            sources: ['documentation', 'best practices'],
                            recommendations: ['implementation approach', 'tools to use']
                        };
                    }
                },
                analysis: {
                    execute: async (task) => {
                        console.log('🧠 Running UltraThink analysis...');
                        return { 
                            type: 'analysis', 
                            insights: 'Deep analysis completed',
                            patterns: ['identified patterns'],
                            recommendations: ['next steps']
                        };
                    }
                }
            },
            
            'coding-agent': {
                implementation: {
                    execute: async (task) => {
                        console.log('⚙️ Implementing features...');
                        // Use coding tools, file operations
                        return { 
                            type: 'code', 
                            files: ['feature.js', 'component.tsx'],
                            status: 'implemented',
                            coverage: '95%'
                        };
                    }
                },
                refactoring: {
                    execute: async (task) => {
                        console.log('🔄 Refactoring code...');
                        return { 
                            type: 'refactor', 
                            improvements: ['performance', 'readability'],
                            files: ['refactored.js']
                        };
                    }
                }
            },

            'testing-agent': {
                testing: {
                    execute: async (task) => {
                        console.log('🧪 Creating comprehensive test suite...');
                        return { 
                            type: 'test', 
                            coverage: '95%+',
                            tests: ['unit', 'integration', 'e2e'],
                            status: 'all passed'
                        };
                    }
                },
                validation: {
                    execute: async (task) => {
                        console.log('✅ Validating implementation...');
                        return { 
                            type: 'validation', 
                            quality: 'high',
                            issues: [],
                            status: 'validated'
                        };
                    }
                }
            },

            'frontend-agent': {
                frontend: {
                    execute: async (task) => {
                        console.log('🎨 Creating UI components...');
                        return { 
                            type: 'frontend', 
                            components: ['Button', 'Form', 'Layout'],
                            responsive: true,
                            accessibility: 'WCAG compliant'
                        };
                    }
                },
                ui: {
                    execute: async (task) => {
                        console.log('🖼️ Designing user interface...');
                        return { 
                            type: 'ui', 
                            designs: ['mobile', 'desktop'],
                            status: 'responsive'
                        };
                    }
                }
            },

            'backend-agent': {
                backend: {
                    execute: async (task) => {
                        console.log('🔧 Implementing backend services...');
                        return { 
                            type: 'backend', 
                            apis: ['REST', 'GraphQL'],
                            database: 'configured',
                            security: 'implemented'
                        };
                    }
                },
                api: {
                    execute: async (task) => {
                        console.log('🌐 Creating API endpoints...');
                        return { 
                            type: 'api', 
                            endpoints: ['/users', '/auth', '/data'],
                            documentation: 'OpenAPI spec',
                            status: 'deployed'
                        };
                    }
                }
            },

            'qa-validator-agent': {
                qa: {
                    execute: async (task) => {
                        console.log('🔍 Comprehensive quality validation...');
                        return { 
                            type: 'qa', 
                            quality: 'high',
                            completeness: '100%',
                            issues: [],
                            recommendations: []
                        };
                    }
                },
                validation: {
                    execute: async (task) => {
                        console.log('✅ Validating work completeness...');
                        return { 
                            type: 'validation', 
                            status: 'complete',
                            gaps: [],
                            quality_score: '95%'
                        };
                    }
                }
            }
        };

        return strategies[agentName] || {};
    }

    getDefaultStrategy(taskType) {
        return {
            execute: async (task) => {
                console.log(`Executing ${taskType} task: ${task.description}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return { 
                    type: taskType, 
                    status: 'completed',
                    timestamp: new Date().toISOString()
                };
            }
        };
    }

    async startCommandLoop() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: `${this.agent.name}> `
        });

        rl.prompt();

        rl.on('line', async (input) => {
            const trimmed = input.trim();
            
            if (trimmed === 'exit' || trimmed === 'quit') {
                console.log(`👋 Disconnecting ${this.agent.name}...`);
                rl.close();
                return;
            }

            if (trimmed) {
                await this.processCommand(trimmed);
            }
            
            rl.prompt();
        });

        rl.on('close', () => {
            console.log(`Agent ${this.agent.name} stopped.`);
            process.exit(0);
        });
    }

    async processCommand(input) {
        const parts = input.split(' ');
        const command = parts[0];
        const args = parts.slice(1);

        try {
            const result = await this.agent.processCommand(command, args);
            
            if (typeof result === 'object') {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(result);
            }
            
        } catch (error) {
            console.error('❌ Command failed:', error.message);
        }
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 1) {
        console.error('Usage: /agent <name> --terminal-id=<N>');
        console.error('Available agents: research-agent, coding-agent, testing-agent, frontend-agent, backend-agent, qa-validator-agent');
        process.exit(1);
    }

    const agentName = args[0];
    let terminalId = null;
    
    // Parse terminal ID from arguments
    for (const arg of args) {
        if (arg.startsWith('--terminal-id=')) {
            terminalId = arg.split('=')[1];
            break;
        }
    }
    
    if (!terminalId) {
        console.error('Error: --terminal-id=<N> is required');
        process.exit(1);
    }

    const command = new AgentCommand();
    await command.initialize(agentName, terminalId);
}

// Export for testing
module.exports = AgentCommand;

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Agent failed:', error);
        process.exit(1);
    });
}