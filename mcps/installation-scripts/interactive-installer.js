#!/usr/bin/env node

/**
 * Interactive MCP Installer for Vibe Coding
 * Provides a user-friendly installation experience with guided setup
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const readline = require('readline');

// Colors for console output
const colors = {
    reset: '\033[0m',
    red: '\033[31m',
    green: '\033[32m',
    yellow: '\033[33m',
    blue: '\033[34m',
    magenta: '\033[35m',
    cyan: '\033[36m',
    bold: '\033[1m'
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// MCP Catalog
const mcpCatalog = {
    core: {
        name: 'Core MCPs',
        description: 'Essential tools for all Vibe Coding projects',
        required: true,
        mcps: {
            context7: {
                name: 'Context7',
                package: '@context7/mcp-client',
                description: 'Documentation fetching and research',
                setup: {
                    url: 'https://context7.ai/dashboard',
                    envVar: 'CONTEXT7_API_KEY',
                    keyPrefix: 'ctx7_'
                }
            },
            perplexity: {
                name: 'Perplexity',
                package: '@perplexity/mcp-integration',
                description: 'Real-time research and market analysis',
                setup: {
                    url: 'https://perplexity.ai/settings/api',
                    envVar: 'PERPLEXITY_API_KEY',
                    keyPrefix: 'pplx_'
                }
            },
            github: {
                name: 'GitHub',
                package: '@github/mcp-cli',
                description: 'Repository management and CI/CD',
                setup: {
                    url: 'https://github.com/settings/tokens',
                    envVar: 'GITHUB_TOKEN',
                    keyPrefix: 'ghp_'
                }
            },
            sequentialThinking: {
                name: 'Sequential Thinking',
                package: '@sequential-thinking/mcp',
                description: 'Complex analysis and planning',
                setup: {
                    url: 'https://sequential-thinking.ai/dashboard',
                    envVar: 'SEQUENTIAL_THINKING_KEY',
                    keyPrefix: 'st_'
                }
            }
        }
    },
    frontend: {
        name: 'Frontend MCPs',
        description: 'Framework-specific development tools',
        mcps: {
            magicUI: {
                name: 'Magic UI',
                package: '@magic-ui/mcp-react',
                description: 'Component generation for React/Next.js',
                frameworks: ['react', 'nextjs']
            },
            vueDevtools: {
                name: 'Vue Devtools',
                package: '@vue/devtools-mcp',
                description: 'Vue component debugging',
                frameworks: ['vue', 'nuxt']
            }
        }
    },
    database: {
        name: 'Database MCPs',
        description: 'Database integration and management',
        mcps: {
            supabase: {
                name: 'Supabase',
                package: '@supabase/mcp-integration',
                description: 'Full-stack Supabase integration',
                setup: {
                    url: 'https://app.supabase.com',
                    envVars: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY']
                }
            },
            postgresql: {
                name: 'PostgreSQL',
                package: '@postgresql/mcp-admin',
                description: 'Database management and optimization'
            },
            mongodb: {
                name: 'MongoDB',
                package: '@mongodb/compass-mcp',
                description: 'Database visualization and management'
            }
        }
    },
    cloud: {
        name: 'Cloud Service MCPs',
        description: 'Cloud platform integrations',
        mcps: {
            digitalocean: {
                name: 'Digital Ocean',
                package: '@digitalocean/mcp-cli',
                description: 'Droplet and service management',
                setup: {
                    url: 'https://cloud.digitalocean.com/api/tokens',
                    envVar: 'DO_API_TOKEN',
                    keyPrefix: 'dop_v1_'
                }
            },
            aws: {
                name: 'AWS Toolkit',
                package: '@aws/mcp-toolkit',
                description: 'AWS service management'
            },
            googleCloud: {
                name: 'Google Cloud',
                package: '@google-cloud/mcp-integration',
                description: 'GCP service integration'
            }
        }
    },
    development: {
        name: 'Development Tool MCPs',
        description: 'Project management and collaboration',
        mcps: {
            linear: {
                name: 'Linear',
                package: '@linear/mcp-integration',
                description: 'Issue tracking and project management',
                setup: {
                    url: 'https://linear.app/settings/api',
                    envVar: 'LINEAR_API_KEY',
                    keyPrefix: 'lin_api_'
                }
            },
            slack: {
                name: 'Slack',
                package: '@slack/mcp-bot',
                description: 'Team notifications and collaboration',
                setup: {
                    url: 'https://api.slack.com/apps',
                    envVar: 'SLACK_WEBHOOK_URL'
                }
            },
            sentry: {
                name: 'Sentry',
                package: '@sentry/mcp-monitoring',
                description: 'Error tracking and monitoring'
            }
        }
    }
};

// State management
let installationState = {
    selectedMCPs: {},
    techStack: {},
    installationResults: {},
    configurationNeeded: []
};

// Utility functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(`${colors.cyan}${prompt}${colors.reset}`, resolve);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkPrerequisites() {
    log('🔍 Checking Prerequisites...', 'blue');
    
    return new Promise((resolve) => {
        exec('npm --version', (error, stdout) => {
            if (error) {
                log('❌ Node.js/npm is required but not installed', 'red');
                log('Please install Node.js 16+ from https://nodejs.org', 'yellow');
                process.exit(1);
            } else {
                log(`✅ Node.js/npm detected (npm ${stdout.trim()})`, 'green');
                resolve();
            }
        });
    });
}

async function welcomeScreen() {
    console.clear();
    log('🚀 Vibe Coding MCP Interactive Installer', 'bold');
    log('========================================', 'blue');
    log('');
    log('This installer will help you set up Model Context Protocol (MCP) tools', 'cyan');
    log('for optimal AI-assisted development with the Vibe Coding methodology.', 'cyan');
    log('');
    log('What this installer does:', 'yellow');
    log('• Analyzes your project requirements', 'reset');
    log('• Recommends optimal MCP tools', 'reset');
    log('• Installs selected MCPs automatically', 'reset');
    log('• Guides you through configuration', 'reset');
    log('• Tests all connections', 'reset');
    log('');
    
    const proceed = await question('Ready to begin? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
        log('Installation cancelled.', 'yellow');
        process.exit(0);
    }
}

async function gatherProjectInfo() {
    log('');
    log('📋 Project Information', 'blue');
    log('======================', 'blue');
    log('');
    log('Let\'s gather some information about your project to recommend the best MCPs.');
    log('');
    
    // Project type
    log('What type of project are you building?', 'cyan');
    log('1. SaaS Web Application');
    log('2. Mobile App (React Native/Flutter)');
    log('3. E-commerce Platform');
    log('4. Enterprise Dashboard');
    log('5. AI/ML Application');
    log('6. Static Website/Blog');
    log('7. Other');
    
    const projectType = await question('Select project type (1-7): ');
    installationState.techStack.projectType = projectType;
    
    // Frontend framework
    log('');
    log('Which frontend framework will you use?', 'cyan');
    log('1. React/Next.js');
    log('2. Vue/Nuxt.js');
    log('3. Angular');
    log('4. Svelte/SvelteKit');
    log('5. Vanilla JavaScript');
    log('6. Other/Not applicable');
    
    const frontend = await question('Select frontend framework (1-6): ');
    installationState.techStack.frontend = frontend;
    
    // Backend/Database
    log('');
    log('What will you use for backend/database?', 'cyan');
    log('1. Supabase (PostgreSQL + Auth + Storage)');
    log('2. Firebase (Firestore + Auth)');
    log('3. PostgreSQL (self-managed)');
    log('4. MongoDB');
    log('5. SQLite');
    log('6. Other/Not applicable');
    
    const backend = await question('Select backend/database (1-6): ');
    installationState.techStack.backend = backend;
    
    // Cloud provider
    log('');
    log('Which cloud provider will you use for hosting?', 'cyan');
    log('1. Digital Ocean');
    log('2. AWS');
    log('3. Google Cloud Platform');
    log('4. Vercel/Netlify');
    log('5. Self-hosted');
    log('6. Not decided yet');
    
    const cloud = await question('Select cloud provider (1-6): ');
    installationState.techStack.cloud = cloud;
    
    // Team size
    log('');
    const teamSize = await question('Team size (number of developers): ');
    installationState.techStack.teamSize = parseInt(teamSize) || 1;
}

function generateRecommendations() {
    log('');
    log('🎯 Generating Recommendations...', 'blue');
    log('================================', 'blue');
    
    // Always recommend core MCPs
    installationState.selectedMCPs.core = Object.keys(mcpCatalog.core.mcps);
    
    // Frontend recommendations
    const frontend = installationState.techStack.frontend;
    if (frontend === '1') { // React/Next.js
        installationState.selectedMCPs.frontend = ['magicUI'];
    } else if (frontend === '2') { // Vue/Nuxt.js
        installationState.selectedMCPs.frontend = ['vueDevtools'];
    }
    
    // Database recommendations
    const backend = installationState.techStack.backend;
    if (backend === '1') { // Supabase
        installationState.selectedMCPs.database = ['supabase'];
    } else if (backend === '3') { // PostgreSQL
        installationState.selectedMCPs.database = ['postgresql'];
    } else if (backend === '4') { // MongoDB
        installationState.selectedMCPs.database = ['mongodb'];
    }
    
    // Cloud recommendations
    const cloud = installationState.techStack.cloud;
    if (cloud === '1') { // Digital Ocean
        installationState.selectedMCPs.cloud = ['digitalocean'];
    } else if (cloud === '2') { // AWS
        installationState.selectedMCPs.cloud = ['aws'];
    } else if (cloud === '3') { // GCP
        installationState.selectedMCPs.cloud = ['googleCloud'];
    }
    
    // Team recommendations
    if (installationState.techStack.teamSize > 1) {
        installationState.selectedMCPs.development = ['linear', 'slack'];
    }
    
    // Display recommendations
    log('Based on your project requirements, here are the recommended MCPs:', 'green');
    log('');
    
    Object.entries(installationState.selectedMCPs).forEach(([category, mcps]) => {
        const categoryInfo = mcpCatalog[category];
        log(`${categoryInfo.name}:`, 'yellow');
        mcps.forEach(mcpKey => {
            const mcp = categoryInfo.mcps[mcpKey];
            log(`  ✓ ${mcp.name} - ${mcp.description}`, 'green');
        });
        log('');
    });
}

async function confirmSelection() {
    log('Would you like to:', 'cyan');
    log('1. Install all recommended MCPs');
    log('2. Customize the selection');
    log('3. Install only Core MCPs');
    
    const choice = await question('Your choice (1-3): ');
    
    if (choice === '2') {
        await customizeSelection();
    } else if (choice === '3') {
        installationState.selectedMCPs = { core: Object.keys(mcpCatalog.core.mcps) };
    }
}

async function customizeSelection() {
    log('');
    log('🛠️ Customize MCP Selection', 'blue');
    log('==========================', 'blue');
    
    for (const [categoryKey, categoryData] of Object.entries(mcpCatalog)) {
        if (categoryKey === 'core') continue; // Core is always included
        
        log('');
        log(`${categoryData.name}:`, 'yellow');
        log(`${categoryData.description}`, 'reset');
        
        const mcpChoices = [];
        for (const [mcpKey, mcpData] of Object.entries(categoryData.mcps)) {
            mcpChoices.push({ key: mcpKey, data: mcpData });
            log(`${mcpChoices.length}. ${mcpData.name} - ${mcpData.description}`);
        }
        
        const selection = await question(`Select MCPs for ${categoryData.name} (comma-separated numbers, or 'none'): `);
        
        if (selection.toLowerCase() !== 'none' && selection.trim() !== '') {
            const indices = selection.split(',').map(s => parseInt(s.trim()) - 1);
            installationState.selectedMCPs[categoryKey] = indices
                .filter(i => i >= 0 && i < mcpChoices.length)
                .map(i => mcpChoices[i].key);
        }
    }
}

async function installMCPs() {
    log('');
    log('📦 Installing MCPs...', 'blue');
    log('====================', 'blue');
    
    const totalMCPs = Object.values(installationState.selectedMCPs)
        .reduce((acc, mcps) => acc + mcps.length, 0);
    
    let installedCount = 0;
    
    for (const [categoryKey, mcpKeys] of Object.entries(installationState.selectedMCPs)) {
        const categoryData = mcpCatalog[categoryKey];
        
        for (const mcpKey of mcpKeys) {
            const mcp = categoryData.mcps[mcpKey];
            installedCount++;
            
            log('');
            log(`[${installedCount}/${totalMCPs}] Installing ${mcp.name}...`, 'cyan');
            
            try {
                await installMCP(mcp.package);
                installationState.installationResults[mcpKey] = 'success';
                log(`✅ ${mcp.name} installed successfully`, 'green');
                
                if (mcp.setup) {
                    installationState.configurationNeeded.push({ key: mcpKey, mcp });
                }
            } catch (error) {
                installationState.installationResults[mcpKey] = 'failed';
                log(`❌ Failed to install ${mcp.name}: ${error.message}`, 'red');
            }
            
            await sleep(500); // Small delay between installations
        }
    }
}

function installMCP(packageName) {
    return new Promise((resolve, reject) => {
        const child = spawn('npm', ['install', '-g', packageName], {
            stdio: ['ignore', 'pipe', 'pipe']
        });
        
        let output = '';
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        child.stderr.on('data', (data) => {
            output += data.toString();
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Installation failed with code ${code}`));
            }
        });
    });
}

async function configurationGuide() {
    if (installationState.configurationNeeded.length === 0) {
        log('🎉 All MCPs installed and ready to use!', 'green');
        return;
    }
    
    log('');
    log('🔧 Configuration Guide', 'blue');
    log('=====================', 'blue');
    log('');
    log('The following MCPs need API keys or configuration:', 'yellow');
    log('');
    
    // Generate .env.mcp template
    let envContent = '# Vibe Coding MCP Configuration\n';
    envContent += '# Generated by Interactive Installer\n\n';
    
    for (const { key, mcp } of installationState.configurationNeeded) {
        log(`${mcp.name}:`, 'cyan');
        log(`  1. Visit: ${mcp.setup.url}`);
        log(`  2. Generate API key`);
        
        if (mcp.setup.envVar) {
            log(`  3. Add to .env.mcp: ${mcp.setup.envVar}=your_key_here`);
            envContent += `# ${mcp.name}\n`;
            envContent += `${mcp.setup.envVar}=your_key_here\n\n`;
        } else if (mcp.setup.envVars) {
            log(`  3. Add to .env.mcp:`);
            mcp.setup.envVars.forEach(envVar => {
                log(`     ${envVar}=your_value_here`);
            });
            envContent += `# ${mcp.name}\n`;
            mcp.setup.envVars.forEach(envVar => {
                envContent += `${envVar}=your_value_here\n`;
            });
            envContent += '\n';
        }
        log('');
    }
    
    // Create .env.mcp template
    const envPath = path.join(process.cwd(), '.env.mcp.template');
    fs.writeFileSync(envPath, envContent);
    
    log(`📝 Configuration template created: ${envPath}`, 'green');
    log('');
    log('Next steps:', 'yellow');
    log('1. Copy .env.mcp.template to .env.mcp');
    log('2. Fill in your actual API keys');
    log('3. Run: claude-mcp test --all');
    log('');
}

async function testConnections() {
    const runTests = await question('Would you like to test MCP connections now? (y/n): ');
    
    if (runTests.toLowerCase() === 'y') {
        log('');
        log('🧪 Testing MCP Connections...', 'blue');
        log('=============================', 'blue');
        
        // Check if claude-mcp CLI is available
        try {
            await new Promise((resolve, reject) => {
                exec('claude-mcp --version', (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
            
            // Run tests
            const child = spawn('claude-mcp', ['test', '--all', '--verbose'], {
                stdio: 'inherit'
            });
            
            child.on('close', (code) => {
                log('');
                if (code === 0) {
                    log('✅ All tests completed!', 'green');
                } else {
                    log('⚠️ Some tests failed. Check configuration and try again.', 'yellow');
                }
            });
        } catch (error) {
            log('⚠️ Claude MCP CLI not available. Install with: npm install -g @claude/mcp-cli', 'yellow');
        }
    }
}

function generateSummary() {
    log('');
    log('📊 Installation Summary', 'blue');
    log('=======================', 'blue');
    
    const successCount = Object.values(installationState.installationResults)
        .filter(result => result === 'success').length;
    const totalCount = Object.keys(installationState.installationResults).length;
    
    log(`✅ Successfully installed: ${successCount}/${totalCount} MCPs`, 'green');
    
    if (installationState.configurationNeeded.length > 0) {
        log(`⚙️ Need configuration: ${installationState.configurationNeeded.length} MCPs`, 'yellow');
    }
    
    log('');
    log('🚀 Next Steps:', 'cyan');
    log('• Configure API keys (see .env.mcp.template)');
    log('• Test connections: claude-mcp test --all');
    log('• Start your project: /vibe-init my-project');
    log('• Run Step 2.5: /vibe-step-2.5-mcp-setup');
    log('');
    log('📚 Documentation: https://github.com/vibe-coding/claude/tree/main/mcps');
    log('');
    log('Happy coding with AI-powered development! 🤖', 'green');
}

// Main execution flow
async function main() {
    try {
        await welcomeScreen();
        await checkPrerequisites();
        await gatherProjectInfo();
        generateRecommendations();
        await confirmSelection();
        await installMCPs();
        await configurationGuide();
        await testConnections();
        generateSummary();
    } catch (error) {
        log(`❌ Installation failed: ${error.message}`, 'red');
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Handle process termination
process.on('SIGINT', () => {
    log('\n\nInstallation cancelled by user.', 'yellow');
    rl.close();
    process.exit(0);
});

// Start the installer
main().catch(console.error);