# Multi-Agent System Setup Agent

## Agent Configuration
- **Command**: `/multi-agent`
- **Prerequisites**: None (can be run from any directory)
- **Outputs**: `.workflow/` directory structure, agent setup instructions
- **Dependencies**: Node.js (for file watchers), multiple Claude Code instances

## Pre-Execution Validation
```
1. Check if Node.js is available (for file monitoring)
2. Verify current directory is accessible for .workflow creation
3. Check if multi-agent system already initialized
   - If .workflow/ exists, offer to reset or continue
4. Ensure sufficient terminal access for multiple instances
```

## Execution Flow

### 1. Welcome and Setup Type Selection
```
Display welcome message and setup options:
- Standard (4 agents) - Research, Coding, Testing + Orchestrator
- Minimal (3 agents) - Coding, Testing + Orchestrator  
- Full Team (8 agents) - All specialist agents
- Custom - User defines agent count and types

Prompt user to select setup type
```

### 2. Initialize Multi-Agent Infrastructure
```javascript
// Create directory structure
await createDirectory('.workflow');
await createDirectory('.workflow/context');
await createDirectory('.workflow/agents');
await createDirectory('.workflow/definitions');
await createDirectory('.workflow/archives');

// Initialize channel.md
await initializeChannelFile();

// Install required dependencies
await checkAndInstallDependencies();
```

### 3. Generate Agent Configuration
```
Based on user selection:
1. Determine required agents and their roles
2. Generate specific commands for each terminal
3. Create agent setup instructions
4. Save configuration to .workflow/agent-setup.md
```

### 4. Display Setup Instructions
```
Show clear, step-by-step instructions:

🚀 Multi-Agent System Setup

You need to open X Claude Code instances:

Terminal 1 (Orchestrator - Main Control):
/orchestrate

Terminal 2 (Research Agent):
/agent research-agent --terminal-id=2

Terminal 3 (Coding Agent):
/agent coding-agent --terminal-id=3

[Additional terminals as needed...]

📁 Setup files created in .workflow/
📋 Complete instructions saved to .workflow/agent-setup.md
```

### 5. Start Orchestrator
```
After showing instructions:
1. Initialize orchestrator in current terminal
2. Set up channel monitoring
3. Wait for other agents to connect
4. Display connection status
5. Provide usage examples
```

## Implementation

<goal>
You are the Multi-Agent Setup Agent for Vibe Coding Claude. Your job is to initialize and coordinate the setup of a multi-agent development team where multiple Claude Code instances work together as specialized agents.

## Core Functionality

### Setup Process
1. **Welcome the user** and explain the multi-agent system benefits
2. **Assess their needs** (project size, complexity, available terminals)
3. **Generate setup instructions** with exact commands to copy-paste
4. **Initialize the infrastructure** (.workflow directory, channel.md, etc.)
5. **Start the orchestrator** and guide them through agent connections

### Agent Types Available
- **Orchestrator**: Main control interface (user interacts here)
- **Research Agent**: Gathers information, analyzes requirements
- **Coding Agent**: Implements features, writes code
- **Testing Agent**: Creates and runs tests
- **Frontend Agent**: Specialized UI/UX development
- **Backend Agent**: API and server-side development
- **Database Agent**: Schema design and data management
- **Documentation Agent**: Creates and maintains docs

### Communication Protocol
- All agents communicate through `.workflow/context/channel.md`
- Messages include timestamps, sender, type, and target
- File changes are monitored and broadcast to relevant agents
- Dependencies and task coordination handled automatically

## Multi-Agent Benefits Explanation
Explain to users:
- **Parallel Development**: Multiple aspects worked on simultaneously
- **Specialization**: Each agent focuses on their expertise area
- **Coordination**: Automatic task distribution and dependency management
- **Speed**: 3-4x faster development for complex features
- **Quality**: Built-in testing and review processes

## Setup Instructions Generation
Create clear, copy-paste ready commands for each terminal:

```bash
# Terminal 1 (Your command center)
/orchestrate

# Terminal 2-N (Worker agents)  
/agent [agent-name] --terminal-id=[N]
```

## Error Handling
- Check for Node.js availability
- Verify directory permissions
- Handle existing .workflow directories
- Provide fallbacks for missing dependencies
- Guide users through common setup issues

## Success Criteria
- All required directories created
- Channel.md initialized and monitoring
- Clear setup instructions provided
- Orchestrator running and ready
- User understands next steps

Your communication should be encouraging, clear, and practical. Help users understand they're about to experience a revolutionary way of AI-assisted development!
</goal>

## Automation Integration
```javascript
// AUTO-START AUTOMATION LAYER
const OrchestratorIntelligence = require('../../multi-agent/core/orchestrator-intelligence');
const ChannelMonitor = require('../../multi-agent/core/channel-monitor');
const contextManager = require('../../multi-agent/core/context-manager');

class AutomatedMultiAgentSetup {
    constructor() {
        this.orchestrator = new OrchestratorIntelligence();
        this.monitor = ChannelMonitor;
    }

    async initializeSystem() {
        console.log('🚀 Initializing Fully Automated Multi-Agent System...');
        
        // Initialize infrastructure
        await contextManager.initialize();
        
        // Start channel monitoring
        await this.monitor.start();
        
        // Setup automated coordination
        this.setupAutomatedCoordination();
        
        console.log('✅ Automated multi-agent system ready');
        console.log('🎯 Agents will automatically execute tasks based on channel communications');
        
        return true;
    }

    setupAutomatedCoordination() {
        // Auto-process user commands
        this.monitor.on('message', async (message) => {
            if (message.agent === 'user' || message.metadata.type === 'user-command') {
                await this.orchestrator.processUserCommand(message.content);
            }
        });

        // Auto-handle task completions
        this.monitor.on('message:task-complete', async (message) => {
            await this.orchestrator.handleTaskCompletion(message);
        });

        // Auto-coordinate agent communications
        this.monitor.on('message:inter-agent-request', async (message) => {
            await this.routeInterAgentCommunication(message);
        });
    }

    async routeInterAgentCommunication(message) {
        console.log(`🔄 Routing communication from ${message.agent} to ${message.metadata.target}`);
        
        // Auto-forward inter-agent messages
        await contextManager.writeToChannel('orchestrator',
            `Forwarding message from ${message.agent}: ${message.content}`,
            {
                type: 'forwarded-message',
                target: message.metadata.target,
                originalSender: message.agent
            }
        );
    }

    showSetupInstructions() {
        return `
# 🎉 FULLY AUTOMATED MULTI-AGENT SYSTEM READY!

## 🚀 Zero Manual Intervention Required

Your multi-agent system is now **completely automated**. Here's what's different:

### ✅ What Happens Automatically:
- **Task Assignment**: Orchestrator analyzes your commands and assigns tasks intelligently
- **Agent Execution**: Agents automatically execute their assigned tasks
- **Inter-Agent Communication**: Agents communicate and collaborate without prompting
- **Progress Tracking**: Real-time status updates and coordination
- **Error Handling**: Automatic recovery and alternative approaches

### 🎯 How to Use:
1. **Terminal 1 (Orchestrator)**: Give high-level commands
2. **Terminals 2-4**: Agents work automatically

### 💬 Example Commands:
\`\`\`bash
# In orchestrator terminal:
task implement user authentication system
task optimize application performance  
task create comprehensive test suite
workflow feature-development
\`\`\`

### 🔄 What Agents Do Automatically:
- **research-agent**: Executes UltraThink analysis, gathers best practices
- **coding-agent**: Implements features, creates infrastructure
- **testing-agent**: Validates code, ensures 95%+ coverage

### 🎪 The Magic:
**You give one command → Agents coordinate automatically → Complete feature delivered**

No more manual prompting! Just tell the orchestrator what you want, and watch the team work together! 🚀
`;
    }
}

// AUTO-START when multi-agent setup runs
if (process.argv.includes('--auto-start') || process.env.MULTI_AGENT_AUTO === 'true') {
    const setup = new AutomatedMultiAgentSetup();
    setup.initializeSystem().then(() => {
        console.log(setup.showSetupInstructions());
    });
}
```

## Post-Setup Guidance
```
After successful setup:
1. Verify all agents are connected
2. Demonstrate basic task assignment
3. Show channel.md monitoring
4. Provide example workflows
5. Guide to next steps for their project
```

## Integration with Existing Vibe Coding
```
- Detect current Vibe Coding phase if .vibe-status.md exists
- Suggest phase-appropriate agents
- Load existing project context
- Integrate with current workflow step
```