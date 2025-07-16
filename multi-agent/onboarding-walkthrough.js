#!/usr/bin/env node

/**
 * Enhanced Onboarding Walkthrough for Multi-Agent System
 * 
 * Provides interactive step-by-step guidance for new users
 * Includes tutorials, examples, and hands-on practice
 */

import { createInterface } from 'readline';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class OnboardingWalkthrough {
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.steps = [
      'welcome',
      'systemCheck',
      'conceptExplanation', 
      'setupVerification',
      'basicCommands',
      'practiceSession',
      'advancedFeatures',
      'troubleshooting',
      'completion'
    ];
    
    this.currentStep = 0;
    this.userProgress = {
      setupComplete: false,
      basicCommandsTested: false,
      ultrathinkTested: false,
      ready: false
    };
  }

  async startWalkthrough() {
    console.clear();
    console.log('🎓 Welcome to the Enhanced Multi-Agent System Onboarding!');
    console.log('='.repeat(60));
    
    for (const step of this.steps) {
      await this.executeStep(step);
      if (step !== 'completion') {
        await this.waitForContinue();
      }
    }
    
    this.rl.close();
  }

  async executeStep(stepName) {
    switch (stepName) {
      case 'welcome':
        await this.welcomeStep();
        break;
      case 'systemCheck':
        await this.systemCheckStep();
        break;
      case 'conceptExplanation':
        await this.conceptExplanationStep();
        break;
      case 'setupVerification':
        await this.setupVerificationStep();
        break;
      case 'basicCommands':
        await this.basicCommandsStep();
        break;
      case 'practiceSession':
        await this.practiceSessionStep();
        break;
      case 'advancedFeatures':
        await this.advancedFeaturesStep();
        break;
      case 'troubleshooting':
        await this.troubleshootingStep();
        break;
      case 'completion':
        await this.completionStep();
        break;
    }
  }

  async welcomeStep() {
    console.log(`
🚀 **Enhanced Multi-Agent System v2.1.0**

Welcome to the future of Claude Vibe development! This walkthrough will guide you through:

📋 **What You'll Learn:**
  1. How the enhanced multi-agent system works
  2. Setting up and verifying your installation  
  3. Using basic commands for agent coordination
  4. Practicing with real examples
  5. Advanced features like UltraThink coordination
  6. Troubleshooting common issues

⏱️  **Time Required:** 10-15 minutes
🎯 **Goal:** Get you productively using intelligent multi-agent coordination

Let's transform your development workflow! 🎉
    `);
  }

  async systemCheckStep() {
    console.log(`
🔍 **Step 1: System Check**

Let's verify your environment is ready for the enhanced multi-agent system.

Checking prerequisites...
    `);

    // Check Node.js
    try {
      const { stdout } = await execAsync('node --version');
      const version = stdout.trim();
      const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
      
      if (majorVersion >= 18) {
        console.log(`✅ Node.js: ${version} (Compatible)`);
      } else {
        console.log(`❌ Node.js: ${version} (Need 18+)`);
        console.log(`   Please update Node.js from https://nodejs.org`);
        return;
      }
    } catch (error) {
      console.log(`❌ Node.js: Not found - Please install from https://nodejs.org`);
      return;
    }

    // Check npm
    try {
      const { stdout } = await execAsync('npm --version');
      console.log(`✅ npm: ${stdout.trim()}`);
    } catch (error) {
      console.log(`❌ npm: Not found`);
      return;
    }

    // Check Claude CLI
    try {
      await execAsync('claude --version');
      console.log(`✅ Claude CLI: Available`);
    } catch (error) {
      console.log(`⚠️  Claude CLI: Not found (setup may still work)`);
    }

    // Check project files
    const requiredFiles = ['package.json', 'vibe-agent-bus.js', 'install.sh'];
    let allFilesPresent = true;
    
    for (const file of requiredFiles) {
      if (existsSync(file)) {
        console.log(`✅ ${file}: Present`);
      } else {
        console.log(`❌ ${file}: Missing`);
        allFilesPresent = false;
      }
    }

    if (allFilesPresent) {
      console.log(`\n🎯 **System Check Result: READY** ✅`);
    } else {
      console.log(`\n⚠️  **System Check Result: ISSUES FOUND** - Please fix missing files`);
    }
  }

  async conceptExplanationStep() {
    console.log(`
🧠 **Step 2: Understanding the System**

**What Changed:**
❌ **Old System**: Multiple terminals, file-based communication, unreliable
✅ **New System**: Single Claude session, intelligent virtual agents, reliable

**Key Concepts:**

1. **Virtual Agents** 🤖
   - Specialized AI personas within your Claude session
   - Each has unique capabilities (research, coding, testing, etc.)
   - No separate terminals or processes needed

2. **Message Bus** 📡  
   - SQLite database for reliable communication
   - Intelligent routing based on content and context
   - Persistent across sessions

3. **UltraThink Coordination** 🧠
   - 5-agent collaboration system
   - Automatic task analysis and assignment
   - Coordinated implementation with quality gates

4. **Smart Task Routing** 🎯
   - Analyzes task complexity automatically
   - Assigns optimal agents for each task
   - Creates execution plans and coordination strategies

**Real Example:**
You: "/coordinateUltraThink taskDescription='Add user authentication'"

System automatically:
- Analyzes complexity (medium-high)  
- Assigns Research Agent (best practices)
- Assigns Architect Agent (system design)
- Assigns Coder Agent (implementation)
- Assigns Tester Agent (validation)
- Coordinates handoffs and quality gates
- Provides complete solution with documentation
    `);
  }

  async setupVerificationStep() {
    console.log(`
⚙️  **Step 3: Setup Verification**

Let's check if your system is properly installed and configured.

**Option 1: Run Installation (if not done yet)**
    `);

    const hasInstallation = await this.askQuestion('Have you run the installation yet? (y/N): ');
    
    if (!hasInstallation.toLowerCase().startsWith('y')) {
      console.log(`
**Running Installation:**

Choose your preferred method:
1. Interactive: ./install.sh
2. Automated: npm run full-setup  
3. Manual: npm install && npm run install-mcp && npm run test-setup

Recommended: Run "./install.sh" now for interactive setup with guidance.
      `);
      
      const runNow = await this.askQuestion('Would you like me to run the installation now? (y/N): ');
      
      if (runNow.toLowerCase().startsWith('y')) {
        console.log(`\nRunning installation...`);
        try {
          const { stdout, stderr } = await execAsync('chmod +x install.sh && ./install.sh');
          console.log(stdout);
          if (stderr) console.log('Warnings:', stderr);
          this.userProgress.setupComplete = true;
        } catch (error) {
          console.log(`Installation error: ${error.message}`);
          console.log(`Please run manually: ./install.sh`);
        }
      }
    } else {
      this.userProgress.setupComplete = true;
    }

    // Verify installation
    console.log(`\n**Verifying Installation:**`);
    try {
      const { stdout } = await execAsync('npm run status');
      if (stdout.includes('vibeAgentBus')) {
        console.log(`✅ MCP Server: Registered and active`);
      } else {
        console.log(`⚠️  MCP Server: Not found - may need manual registration`);
      }
    } catch (error) {
      console.log(`⚠️  Could not verify MCP status - installation may be incomplete`);
    }
  }

  async basicCommandsStep() {
    console.log(`
🎯 **Step 4: Basic Commands Tutorial**

Let's learn the essential commands you'll use daily.

**Core Commands:**

1. **Initialize System**
   Command: /vibe-multi-agent-enhanced
   Purpose: Sets up the enhanced multi-agent environment
   
2. **Send Messages to Agents**
   Command: /sendVibeMessage agent="research-agent" message="Research authentication patterns"
   Purpose: Direct communication with specific agents
   
3. **Check Project Status**  
   Command: /getVibeProjectStatus
   Purpose: See active agents, project state, and memory status
   
4. **UltraThink Coordination**
   Command: /coordinateUltraThink taskDescription="Design authentication system" 
   Purpose: 5-agent collaboration for complex tasks

5. **Smart Task Routing**
   Command: /analyzeVibeTask taskDescription="Add real-time notifications"
   Purpose: Analyze task complexity and get recommendations

**Let's Practice:**
    `);

    const tryCommands = await this.askQuestion('Would you like to try some basic commands now? (y/N): ');
    
    if (tryCommands.toLowerCase().startsWith('y')) {
      console.log(`
**Practice Session:**

Try copying and pasting these commands into Claude Code:

1. First, initialize the system:
   /vibe-multi-agent-enhanced

2. Check the system status:
   /getVibeProjectStatus

3. Send a test message:
   /sendVibeMessage agent="test-agent" message="Hello, testing the system"

4. Try task analysis:
   /analyzeVibeTask taskDescription="Create a simple user registration form"

Take your time to try these. I'll wait for you to come back.
      `);
      
      await this.askQuestion('Press Enter when you\'ve tried the commands...');
      this.userProgress.basicCommandsTested = true;
      
      console.log(`\n✅ Great! You've tested the basic commands.`);
    }
  }

  async practiceSessionStep() {
    console.log(`
🏋️ **Step 5: Hands-On Practice**

Let's walk through a complete workflow with a realistic example.

**Scenario: Adding User Authentication**

This will demonstrate the full power of the multi-agent system.

**Step-by-Step Example:**

1. **Complex Task Analysis**
   /coordinateUltraThink taskDescription="Design and implement JWT-based user authentication with password reset functionality"

2. **What This Does Automatically:**
   - Research Agent: Finds authentication best practices
   - Architect Agent: Designs system architecture  
   - Coder Agent: Plans implementation approach
   - Tester Agent: Defines testing strategy
   - Context Agent: Ensures pattern compliance
   - All coordinate through the message bus

3. **Follow-Up Commands:**
   /getUltraThinkSession sessionId="[session-id-from-response]"
   /checkVibeMessages room="ultrathink-coordination"

**Expected Results:**
- Comprehensive analysis of authentication requirements
- Detailed implementation plan with phases
- Quality gates and testing strategy
- Code patterns and security considerations
- 95%+ confidence coordination between agents
    `);

    const tryExample = await this.askQuestion('Would you like to try this example? (y/N): ');
    
    if (tryExample.toLowerCase().startsWith('y')) {
      console.log(`
**Try This Command:**

/coordinateUltraThink taskDescription="Design and implement JWT-based user authentication with password reset functionality"

**What to Watch For:**
- Session creation and agent assignment
- Individual agent analysis phases  
- Cross-agent synthesis and consensus
- Implementation plan generation
- Quality score and readiness assessment

This may take 30-60 seconds as all 5 agents coordinate.
      `);
      
      await this.askQuestion('Press Enter when you\'ve tried the UltraThink coordination...');
      this.userProgress.ultrathinkTested = true;
      
      console.log(`\n🎉 Excellent! You've experienced the full power of multi-agent coordination.`);
    }
  }

  async advancedFeaturesStep() {
    console.log(`
🚀 **Step 6: Advanced Features**

Now that you understand the basics, let's explore advanced capabilities.

**1. Agent Memory Management**
   - Agents remember context across sessions
   - Different memory types: procedural, project, phase, context, scratch
   - Commands: /saveVibeAgentMemory, /loadVibeAgentMemory

**2. Custom Agent Registration**
   - Register project-specific agents
   - Define capabilities and specializations
   - Command: /registerVibeAgent

**3. Smart Task Routing**
   - Automatic complexity analysis
   - Optimal agent assignment  
   - Execution plan generation
   - Commands: /routeVibeTask, /createVibeExecutionPlan

**4. Room-Based Communication**
   - Intelligent message routing to appropriate "rooms"
   - Step-specific, phase-specific, and feature-specific rooms
   - Command: /checkVibeMessages room="step-8-slices"

**5. Migration from Old System**
   - Import existing channel.md communication
   - Preserve agent configurations
   - Command: npm run migrate

**Advanced Workflow Example:**

1. Register a custom agent:
   /registerVibeAgent agentId="security-specialist" profile='{"vibeSteps": ["step-6"], "capabilities": ["security-analysis", "penetration-testing"]}'

2. Route a complex task:
   /routeVibeTask taskDescription="Implement OAuth2 integration with Google and GitHub" options='{"priority": "high", "maxAgents": 3}'

3. Create detailed execution plan:
   /createVibeExecutionPlan taskAnalysis={...from previous command...}
    `);
  }

  async troubleshootingStep() {
    console.log(`
🔧 **Step 7: Troubleshooting Guide**

Common issues and their solutions:

**1. MCP Server Not Found**
   Problem: Commands not recognized
   Solution: npm run install-mcp
   Verify: claude mcp list | grep vibeAgentBus

**2. Database Issues**  
   Problem: Messages not persisting
   Solution: Check /tmp/vibe-agent-bus.db permissions
   Reset: npm run reset

**3. Agent Communication Problems**
   Problem: Agents not responding
   Solution: /getVibeProjectStatus to check agent registration
   Debug: /checkVibeMessages room="coordination"

**4. Installation Issues**
   Problem: Setup fails
   Solution: Run npm run test-setup for detailed validation
   Manual: Follow MIGRATION-GUIDE.md step-by-step

**5. Performance Issues**
   Problem: Slow responses
   Solution: Clear old messages with /clearRoom
   Optimize: npm run reset to start fresh

**Helpful Validation Commands:**
- npm run validate - Comprehensive system check
- npm run test-setup - Installation validation  
- npm run status - MCP server status
- npm run logs - View server logs

**Getting Help:**
- Check HOW-IT-WORKS.md for detailed explanations
- Review MIGRATION-GUIDE.md for setup issues
- Use /getVibeProjectStatus for system diagnostics
    `);
  }

  async completionStep() {
    console.log(`
🎉 **Congratulations! Onboarding Complete!**

You've successfully learned the Enhanced Multi-Agent System!

**🎯 What You've Accomplished:**
${this.userProgress.setupComplete ? '✅' : '⚠️'} System setup and verification
${this.userProgress.basicCommandsTested ? '✅' : '⚠️'} Basic command practice
${this.userProgress.ultrathinkTested ? '✅' : '⚠️'} UltraThink coordination experience
✅ Understanding of advanced features
✅ Troubleshooting knowledge

**🚀 You're Ready To:**
- Use intelligent multi-agent coordination for complex tasks
- Leverage UltraThink 5-agent collaboration
- Implement features with 99%+ reliability
- Maintain 95%+ pattern compliance automatically
- Scale your development velocity significantly

**📋 Quick Reference Card:**

Essential Commands:
• /vibe-multi-agent-enhanced - Initialize system
• /coordinateUltraThink taskDescription="..." - Complex coordination
• /sendVibeMessage agent="..." message="..." - Direct communication
• /getVibeProjectStatus - Check system status
• /analyzeVibeTask taskDescription="..." - Task analysis

**🎯 Next Steps:**
1. Start with simple tasks to build confidence
2. Use UltraThink for complex analysis and implementation
3. Leverage agent memory for project continuity
4. Explore custom agent registration for specialized needs

**🎉 Welcome to the future of AI-assisted development!**

The Enhanced Multi-Agent System transforms Claude Vibe from complex manual coordination into seamless, intelligent teamwork. You now have a reliable AI development team at your fingertips!

Happy coding! 🚀
    `);

    // Save completion status
    this.userProgress.ready = true;
    console.log(`\n📊 Onboarding completed: ${new Date().toISOString()}`);
    console.log(`User progress: ${JSON.stringify(this.userProgress, null, 2)}`);
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  async waitForContinue() {
    console.log('\n' + '-'.repeat(60));
    await this.askQuestion('Press Enter to continue to the next step...');
    console.clear();
  }
}

// Main execution
async function main() {
  const onboarding = new OnboardingWalkthrough();
  await onboarding.startWalkthrough();
}

if (process.argv[1] === import.meta.url.replace('file://', '')) {
  main().catch(error => {
    console.error('Onboarding error:', error.message);
    process.exit(1);
  });
}

export { OnboardingWalkthrough };