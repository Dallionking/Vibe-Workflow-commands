---
description: Transform current terminal into specialized agent (research, coding, testing, etc.)
allowed-tools:
  - mcp__context7__resolve-library-id
  - mcp__context7__get-library-docs
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
parameters:
  - agent-name
  - --terminal-id
---

# agent

Transform current terminal into specialized agent (research, coding, testing, etc.)

## Usage
`/agent <agent-name> [--terminal-id]`

# Individual Agent Command Handler

## Agent Configuration
- **Command**: `/agent [agent-name] --terminal-id=[number]`
- **Prerequisites**: Multi-agent system initialized (`.workflow/` exists)
- **Outputs**: Agent instance running in current terminal
- **Dependencies**: Channel monitoring, file watchers

## Pre-Execution Validation
```
1. Check if .workflow/context/ directory exists
2. Verify agent-name is provided and valid
3. Check terminal-id parameter is present
4. Ensure channel.md file exists for communication
5. Validate agent definition exists (if custom agent)
```

## Execution Flow

### 1. Parse Command Arguments
```javascript
const args = parseArguments(input);
const agentName = args.agentName;  // e.g., "research-agent"
const terminalId = args.terminalId; // e.g., "2"
const role = args.role || deriveRoleFromName(agentName);
```

### 2. Initialize Agent Infrastructure
```javascript
// Set up file monitoring
const chokidar = require('chokidar');

// Create agent workspace
await createAgentWorkspace(agentName, terminalId);

// Initialize context storage
await initializeAgentContext(agentName, terminalId);
```

### 3. Start Agent Implementation
```javascript
// Load agent-specific logic
const agentImpl = await loadAgentImplementation(agentName);

// Start monitoring systems
await startFileMonitoring(agentImpl.role);
await startChannelMonitoring();

// Announce presence to other agents
await announceAgentStartup(agentName, terminalId);
```

## Implementation

<goal>
You are an Individual Agent Handler that creates and manages specialized AI agents in the multi-agent system. When users run `/agent [name] --terminal-id=[N]`, you transform the current Claude Code instance into that specific agent with appropriate capabilities and monitoring.

## Core Functionality

### Agent Initialization
1. **Parse the command parameters** (agent name, terminal ID, optional role)
2. **Load agent-specific configuration** and capabilities
3. **Set up file monitoring** based on agent role
4. **Initialize communication** with channel.md
5. **Start the agent loop** listening for tasks and file changes

### Agent Types and Behaviors

#### Research Agent (`research-agent`)
**Role**: Information gathering and analysis
**Monitors**: Documentation files, requirement specs
**Capabilities**: Web search, documentation analysis, best practices research
**Response to**: Research requests, analysis tasks, information gathering

#### Coding Agent (`coding-agent`)
**Role**: Code implementation and development  
**Monitors**: Source files (.js, .ts, .py, .jsx, .tsx), configuration files
**Capabilities**: Code generation, feature implementation, refactoring
**Response to**: Implementation tasks, bug fixes, code improvement requests

#### Testing Agent (`testing-agent`)
**Role**: Quality assurance and testing
**Monitors**: Source files, test files, CI configuration
**Capabilities**: Test creation, test execution, coverage analysis
**Response to**: Testing requests, code changes (auto-test), quality checks

#### Frontend Agent (`frontend-agent`)
**Role**: UI/UX development specialist
**Monitors**: Frontend source files, style files, component files
**Capabilities**: Component creation, styling, user interface implementation
**Response to**: UI tasks, frontend implementation, styling requests

#### Backend Agent (`backend-agent`)
**Role**: Server-side development specialist
**Monitors**: API files, server configuration, database files
**Capabilities**: API development, database design, server logic
**Response to**: Backend tasks, API implementation, server configuration

### File Monitoring System
Set up intelligent file watching based on agent role:

```javascript
// Example for coding-agent
const watchPatterns = {
  'coding-agent': ['src/**/*.{js,ts,jsx,tsx}', 'api/**/*.{js,ts}'],
  'testing-agent': ['tests/**/*', 'src/**/*.test.{js,ts}', 'cypress/**/*'],
  'frontend-agent': ['src/components/**/*', 'src/pages/**/*', 'src/styles/**/*'],
  'backend-agent': ['api/**/*', 'server/**/*', 'database/**/*']
};
```

### Channel Communication Protocol
Monitor `.workflow/context/channel.md` for:
- **Direct messages** (target: agent-name)
- **Broadcast messages** (target: all-agents)
- **Role-based messages** (target: role:developer, role:tester, etc.)
- **Task assignments** (type: task-assignment)
- **File change notifications** (type: file-update)

### Agent Response Patterns
When receiving messages:

1. **Task Assignment**: 
   - Acknowledge receipt
   - Analyze task complexity
   - Execute or request clarification
   - Report progress and completion

2. **File Changes**:
   - Detect relevant file modifications
   - Analyze impact on current work
   - Take appropriate action (re-run tests, update implementation)
   - Notify other agents if needed

3. **Collaboration Requests**:
   - Respond to information requests from other agents
   - Provide expertise in specialized area
   - Coordinate on shared tasks

### Agent Status Display
Show clear agent status in terminal:

```
🤖 research-agent Starting...
📍 Role: researcher  
🖥️  Terminal: 2

✅ research-agent is ready and monitoring
📋 Capabilities:
  • Research and information gathering
  • Documentation analysis
  • Best practices research
  
👁️  Monitoring:
  • channel.md for messages
  • docs/ for documentation changes
  • requirements/ for spec updates

💬 Waiting for tasks from orchestrator...
```

## Task Execution Framework
Each agent should be able to:
1. **Receive and parse tasks** from orchestrator or other agents
2. **Break down complex tasks** into manageable steps
3. **Execute work** using appropriate tools and knowledge
4. **Report progress** with detailed updates
5. **Handle errors gracefully** and request help when needed

## Inter-Agent Coordination
Enable agents to work together:
- **Request information** from other agents
- **Share work products** through channel
- **Coordinate on dependencies** (frontend waits for API spec)
- **Notify of blocking issues** 
- **Celebrate shared successes**

## Error Handling and Recovery
- **Graceful degradation** when tools unavailable
- **Clear error reporting** to user and other agents
- **Recovery suggestions** for common issues
- **Escalation to orchestrator** for complex problems

Your goal is to create specialized, intelligent agents that feel like real team members working together toward common goals. Each agent should have personality appropriate to their role while maintaining professional effectiveness.
</goal>

## Automation Integration
```javascript
// AUTO-START AUTOMATION LAYER
const AgentBase = require('../../multi-agent/core/agent-base');
const CommandExecutor = require('../../multi-agent/core/command-executor');
const TaskParser = require('../../multi-agent/core/task-parser');
const ChannelMonitor = require('../../multi-agent/core/channel-monitor');

class AutomatedAgent extends AgentBase {
    constructor(agentName, config) {
        super(agentName, config);
        this.executor = new CommandExecutor(agentName);
        this.taskParser = new TaskParser();
        this.taskQueue = [];
        this.processing = false;
    }

    async start() {
        await super.start();
        
        // Start automated task processing
        this.startTaskProcessor();
        
        console.log(`🤖 ${this.name}: Automation layer active`);
        console.log(`⚡ Auto-executing tasks based on channel communications`);
    }

    async handleMessage(message) {
        await super.handleMessage(message);
        
        // Auto-process task assignments
        if (message.metadata.type === 'task-assignment') {
            await this.autoProcessTask(message);
        }
        
        // Handle inter-agent communications
        if (message.metadata.target === this.name || 
            message.metadata.target === `role:${this.role}`) {
            await this.autoRespondToCommunication(message);
        }
    }

    async autoProcessTask(message) {
        const task = this.taskParser.parseTaskFromMessage(message);
        const executable = this.taskParser.generateExecutableTask(task, this.name);
        
        console.log(`\n🎯 Auto-processing task: ${task.description || task.type}`);
        
        // Add to task queue
        this.taskQueue.push(executable);
        
        // Start processing if not already running
        if (!this.processing) {
            this.processTaskQueue();
        }
    }

    async processTaskQueue() {
        if (this.processing || this.taskQueue.length === 0) {
            return;
        }
        
        this.processing = true;
        
        while (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            
            try {
                console.log(`\n⚡ Executing task: ${task.description || task.type}`);
                
                // Execute all commands for this task
                for (const command of task.commands) {
                    const result = await this.executor.executeCommand(command);
                    
                    // Report progress
                    await this.reportTaskProgress(task, command, result);
                }
                
                // Mark task complete
                await this.reportTaskComplete(task);
                
            } catch (error) {
                console.error(`❌ Task execution failed: ${error.message}`);
                await this.reportTaskError(task, error);
            }
        }
        
        this.processing = false;
    }

    async autoRespondToCommunication(message) {
        // Auto-respond to specific communication types
        if (message.content.includes('status') || message.content.includes('health')) {
            await this.reportStatus();
        }
        
        if (message.content.includes('help') && this.role === 'research') {
            await this.offerResearchAssistance(message);
        }
        
        if (message.content.includes('ready') && message.agent === 'orchestrator') {
            await this.confirmReadiness();
        }
    }

    async reportTaskProgress(task, command, result) {
        await this.writeToChannel(
            `Task progress: ${command.type} - ${result.success ? '✅ Success' : '❌ Failed'}`,
            { 
                type: 'task-progress',
                taskId: task.id,
                command: command.type,
                success: result.success
            }
        );
    }

    async reportTaskComplete(task) {
        await this.writeToChannel(
            `Task completed: ${task.description || task.type}`,
            { 
                type: 'task-complete',
                taskId: task.id,
                agent: this.name,
                timestamp: new Date().toISOString()
            }
        );
    }

    async reportTaskError(task, error) {
        await this.writeToChannel(
            `Task failed: ${error.message}`,
            { 
                type: 'task-error',
                taskId: task.id,
                error: error.message,
                agent: this.name
            }
        );
    }

    async writeToChannel(message, metadata = {}) {
        const contextManager = require('../../multi-agent/core/context-manager');
        await contextManager.writeToChannel(this.name, message, metadata);
    }

    startTaskProcessor() {
        // Monitor for new tasks every 5 seconds
        setInterval(() => {
            if (this.taskQueue.length > 0 && !this.processing) {
                this.processTaskQueue();
            }
        }, 5000);
    }
}

// Agent-specific automation based on role
async function createSpecializedAgent(agentName, terminalId) {
    const role = agentName.split('-')[0]; // e.g., 'research' from 'research-agent'
    
    const config = {
        terminalId,
        role,
        capabilities: getAgentCapabilities(role),
        messageHandler: getAgentMessageHandler(role),
        executeTask: getAgentTaskExecutor(role)
    };
    
    const agent = new AutomatedAgent(agentName, config);
    await agent.start();
    
    return agent;
}

function getAgentCapabilities(role) {
    const capabilities = {
        'research': ['ultrathink', 'analysis', 'documentation', 'best-practices'],
        'coding': ['implementation', 'refactoring', 'infrastructure', 'integration'],
        'testing': ['validation', 'coverage', 'quality-assurance', 'performance']
    };
    
    return capabilities[role] || ['general'];
}

function getAgentMessageHandler(role) {
    return async function(message) {
        // Role-specific message handling
        console.log(`${role} agent processing: ${message.metadata.type}`);
    };
}

function getAgentTaskExecutor(role) {
    return async function(task) {
        const executor = new CommandExecutor(`${role}-agent`);
        
        // Map task to role-specific commands
        if (role === 'research' && task.description.includes('ultrathink')) {
            return await executor.executeCommand({
                type: 'ultrathink',
                description: task.description,
                command: `/ultrathink "${task.description}"`
            });
        }
        
        // Default task execution
        return await executor.executeCommand({
            type: 'generic',
            description: task.description
        });
    };
}

// AUTO-START when agent command runs
if (process.argv.length >= 3) {
    const agentName = process.argv[2];
    const terminalIdArg = process.argv.find(arg => arg.startsWith('--terminal-id='));
    const terminalId = terminalIdArg ? terminalIdArg.split('=')[1] : 'unknown';
    
    createSpecializedAgent(agentName, terminalId);
}
```

## Agent-Specific Implementations

### Research Agent Logic
```javascript
if (message.type === 'research-request') {
  console.log(`🔍 Researching: ${task.topic}`);
  
  // Use available research tools
  const results = await conductResearch(task.topic, task.depth);
  
  // Report findings
  await reportResearchResults(results);
}
```

### Coding Agent Logic  
```javascript
if (message.type === 'implementation-request') {
  console.log(`💻 Implementing: ${task.feature}`);
  
  // Analyze requirements
  const specs = await analyzeRequirements(task);
  
  // Implement feature
  const implementation = await implementFeature(specs);
  
  // Notify completion
  await reportImplementation(implementation);
}
```

### Testing Agent Logic
```javascript
if (message.type === 'test-request' || fileChanged) {
  console.log(`🧪 Testing: ${task.target}`);
  
  // Run appropriate tests
  const results = await runTests(task.target);
  
  // Report results
  await reportTestResults(results);
}
```

## File Change Reactions
```javascript
// When source files change
on('file:change', async (filepath) => {
  if (isRelevantFile(filepath, agentRole)) {
    console.log(`📝 File changed: ${filepath}`);
    await handleFileChange(filepath, agentRole);
    await notifyOtherAgents(filepath, 'file-update');
  }
});
```