#!/usr/bin/env node

/**
 * Vibe Agent Bus - MCP Server for Multi-Agent Communication
 * 
 * Enhanced version of claude-mailbox adapted for Vibe Coding methodology
 * Provides reliable, persistent communication between Claude Code terminals
 * with intelligent routing and Vibe-specific features.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { VibeStorageManager } from './core/vibe-storage-manager.js';
import { VibeContextManager } from './core/vibe-context-manager.js';
import { VibeAgentRouter } from './core/vibe-agent-router.js';
import { VibeTaskRouter } from './core/vibe-task-router.js';
import { VibeUltraThinkCoordinator } from './core/vibe-ultrathink-coordinator.js';

// Initialize enhanced storage and context management
const storage = new VibeStorageManager();
const contextManager = new VibeContextManager(storage);
const agentRouter = new VibeAgentRouter();
const taskRouter = new VibeTaskRouter(storage);
const ultrathinkCoordinator = new VibeUltraThinkCoordinator(storage);

// Create MCP server with Vibe branding
const server = new Server(
  {
    name: "vibeAgentBus",
    version: "2.1.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// Enhanced tool definitions for Vibe Coding
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Core Communication Tools
      {
        name: "sendVibeMessage",
        description: "Send a message to another Vibe agent with intelligent routing",
        inputSchema: {
          type: "object",
          properties: {
            agent: {
              type: "string",
              description: "Target agent name (e.g., 'step-8-agent', 'ultrathink-coordinator')"
            },
            room: {
              type: "string",
              description: "Room name (optional - auto-selects based on Vibe context)"
            },
            message: {
              type: "string",
              description: "Message content to send"
            },
            priority: {
              type: "string",
              enum: ["low", "normal", "high", "urgent"],
              description: "Message priority level"
            },
            step: {
              type: "string",
              description: "Current Vibe step context (optional)"
            },
            phase: {
              type: "string",
              description: "Current phase context (optional)"
            }
          },
          required: ["agent", "message"]
        }
      },
      {
        name: "checkVibeMessages",
        description: "Check messages in a Vibe room with enhanced formatting",
        inputSchema: {
          type: "object",
          properties: {
            room: {
              type: "string",
              description: "Room name to check"
            },
            filter: {
              type: "string",
              description: "Filter by agent, step, or priority"
            },
            limit: {
              type: "number",
              description: "Maximum number of messages to return (default: 20)"
            }
          },
          required: ["room"]
        }
      },
      {
        name: "getVibeProjectStatus",
        description: "Get current project status and active agents",
        inputSchema: {
          type: "object",
          properties: {
            includeMemory: {
              type: "boolean",
              description: "Include agent memory summaries"
            }
          },
          additionalProperties: false
        }
      },
      // Vibe-Specific Context Tools
      {
        name: "saveVibeAgentMemory",
        description: "Save agent's working memory with Vibe context",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "Agent identifier"
            },
            memoryType: {
              type: "string",
              enum: ["procedural", "project", "phase", "context", "scratch"],
              description: "Type of Vibe memory"
            },
            content: {
              type: "object",
              description: "Memory content with Vibe structure"
            },
            step: {
              type: "string",
              description: "Associated Vibe step"
            },
            phase: {
              type: "string",
              description: "Associated phase"
            }
          },
          required: ["agentId", "memoryType", "content"]
        }
      },
      {
        name: "loadVibeAgentMemory",
        description: "Load agent's memory with Vibe context filtering",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "Agent identifier"
            },
            memoryType: {
              type: "string",
              description: "Type of memory to load"
            },
            step: {
              type: "string",
              description: "Filter by Vibe step"
            },
            phase: {
              type: "string",
              description: "Filter by phase"
            }
          },
          required: ["agentId", "memoryType"]
        }
      },
      // Agent Coordination Tools
      {
        name: "registerVibeAgent",
        description: "Register agent with Vibe capabilities and specializations",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "Agent identifier"
            },
            profile: {
              type: "object",
              description: "Agent profile with Vibe capabilities",
              properties: {
                vibeSteps: {
                  type: "array",
                  items: { type: "string" },
                  description: "Vibe steps this agent can handle"
                },
                capabilities: {
                  type: "array",
                  items: { type: "string" },
                  description: "Agent capabilities (MCP tools, specializations)"
                },
                mcpTools: {
                  type: "array",
                  items: { type: "string" },
                  description: "Available MCP tools"
                },
                terminalId: {
                  type: "string",
                  description: "Terminal identifier for coordination"
                }
              }
            }
          },
          required: ["agentId", "profile"]
        }
      },
      {
        name: "findVibeAgentsForTask",
        description: "Find optimal agents for a Vibe task",
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "Task description"
            },
            requiredSteps: {
              type: "array",
              items: { type: "string" },
              description: "Required Vibe steps"
            },
            preferredCapabilities: {
              type: "array",
              items: { type: "string" },
              description: "Preferred capabilities"
            }
          },
          required: ["task"]
        }
      },
      // Legacy compatibility tools
      {
        name: "postMessage",
        description: "Legacy: Send a raw message to a room",
        inputSchema: {
          type: "object",
          properties: {
            room: { type: "string" },
            msg: { type: "string" },
            apiKey: { type: "string" }
          },
          required: ["room", "msg"]
        }
      },
      {
        name: "getMessages",
        description: "Legacy: Get all messages from a room",
        inputSchema: {
          type: "object",
          properties: {
            room: { type: "string" }
          },
          required: ["room"]
        }
      },
      {
        name: "listRooms",
        description: "List all active rooms with Vibe context",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      // Smart Task Routing Tools
      {
        name: "analyzeVibeTask",
        description: "Analyze a task for complexity, requirements, and optimal execution strategy",
        inputSchema: {
          type: "object",
          properties: {
            taskDescription: {
              type: "string",
              description: "Detailed description of the task to analyze"
            },
            priority: {
              type: "string",
              enum: ["low", "normal", "high", "urgent"],
              description: "Task priority level"
            },
            currentStep: {
              type: "string",
              description: "Current Vibe step context"
            },
            currentPhase: {
              type: "string",
              description: "Current phase context"
            }
          },
          required: ["taskDescription"]
        }
      },
      {
        name: "routeVibeTask",
        description: "Route a task to optimal agents with execution plan and coordination strategy",
        inputSchema: {
          type: "object",
          properties: {
            taskDescription: {
              type: "string",
              description: "Task to route and execute"
            },
            options: {
              type: "object",
              properties: {
                priority: {
                  type: "string",
                  enum: ["low", "normal", "high", "urgent"]
                },
                preferredAgents: {
                  type: "array",
                  items: { type: "string" },
                  description: "Preferred agent IDs (optional)"
                },
                maxAgents: {
                  type: "number",
                  description: "Maximum number of agents to assign"
                },
                autoExecute: {
                  type: "boolean",
                  description: "Whether to auto-execute or just plan"
                }
              }
            }
          },
          required: ["taskDescription"]
        }
      },
      {
        name: "createVibeExecutionPlan",
        description: "Create detailed execution plan for complex Vibe tasks",
        inputSchema: {
          type: "object",
          properties: {
            taskAnalysis: {
              type: "object",
              description: "Task analysis from analyzeVibeTask"
            },
            agentRecommendations: {
              type: "array",
              description: "Agent recommendations"
            },
            coordinationStrategy: {
              type: "string",
              enum: ["sequential", "parallel", "hybrid", "phase-based"],
              description: "Coordination approach"
            }
          },
          required: ["taskAnalysis"]
        }
      },
      // UltraThink Coordination Tools
      {
        name: "coordinateUltraThink",
        description: "Execute UltraThink 5-agent coordination through message bus for complex analysis and implementation",
        inputSchema: {
          type: "object",
          properties: {
            taskDescription: {
              type: "string",
              description: "Complex task requiring multi-agent analysis and coordination"
            },
            options: {
              type: "object",
              properties: {
                priority: {
                  type: "string",
                  enum: ["low", "normal", "high", "urgent"],
                  description: "Task priority level"
                },
                agentPattern: {
                  type: "string",
                  enum: ["comprehensive-analysis", "feature-implementation", "architecture-design", "quality-assurance", "codebase-analysis"],
                  description: "Specific UltraThink pattern to use (auto-detected if not specified)"
                },
                currentStep: {
                  type: "string",
                  description: "Current Vibe step context"
                },
                currentPhase: {
                  type: "string",
                  description: "Current phase context"
                }
              }
            }
          },
          required: ["taskDescription"]
        }
      },
      {
        name: "getUltraThinkSession",
        description: "Get status of an active UltraThink coordination session",
        inputSchema: {
          type: "object",
          properties: {
            sessionId: {
              type: "string",
              description: "UltraThink session ID to check"
            }
          },
          required: ["sessionId"]
        }
      },
      {
        name: "listUltraThinkSessions",
        description: "List all active UltraThink coordination sessions",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      }
    ]
  };
});

// Enhanced prompt definitions for Vibe workflows
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "sendVibeMessage",
        description: "Send a message to another Vibe agent with intelligent routing",
        arguments: [
          { name: "agent", description: "Target agent name", required: true },
          { name: "message", description: "Message content", required: true },
          { name: "step", description: "Current Vibe step", required: false },
          { name: "phase", description: "Current phase", required: false }
        ]
      },
      {
        name: "coordinateVibeAgents",
        description: "Coordinate multiple agents for a Vibe workflow",
        arguments: [
          { name: "workflow", description: "Workflow type", required: true },
          { name: "agents", description: "Agents to coordinate", required: true }
        ]
      },
      {
        name: "checkVibeProjectStatus",
        description: "Check current Vibe project status and agent coordination",
        arguments: []
      }
    ]
  };
});

// Enhanced tool execution with Vibe intelligence
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "sendVibeMessage": {
        const { agent, room, message, priority = "normal", step, phase } = args;
        
        if (!agent || !message) {
          return {
            content: [{ type: "text", text: "Error: Missing agent or message parameter" }],
            isError: true
          };
        }

        // Use intelligent Vibe routing
        const selectedRoom = room || await agentRouter.selectVibeRoom(message, step, phase, agent);
        const enhancedMessage = await agentRouter.enhanceMessage(message, agent, step, phase, priority);
        
        const messageObj = await storage.postVibeMessage(selectedRoom, enhancedMessage, {
          agent, step, phase, priority, timestamp: Date.now()
        });
        
        return {
          content: [{ 
            type: "text", 
            text: `✅ **Vibe Message Sent Successfully!**\n\n**Details:**\n- **Agent:** ${agent}\n- **Room:** ${selectedRoom}${room ? '' : ' (🧠 auto-selected)'}\n- **Step Context:** ${step || 'auto-detected'}\n- **Phase Context:** ${phase || 'current'}\n- **Priority:** ${priority}\n- **Message:** "${message}"\n- **Enhanced:** ${enhancedMessage !== message ? 'Yes' : 'No'}\n- **Timestamp:** ${messageObj.timestamp}`
          }]
        };
      }

      case "checkVibeMessages": {
        const { room, filter, limit = 20 } = args;
        
        if (!room) {
          return {
            content: [{ type: "text", text: "Error: Missing room parameter" }],
            isError: true
          };
        }

        const messages = await storage.getVibeMessages(room, { filter, limit });
        
        if (messages.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `📭 **No messages in "${room}" room yet.**\n\n*Tip: Use \`sendVibeMessage\` to start agent coordination!*` 
            }]
          };
        }

        const formattedMessages = await agentRouter.formatVibeMessages(messages);
        
        return {
          content: [{ 
            type: "text", 
            text: `📨 **Vibe Messages in "${room}" room:**\n\n${formattedMessages}\n\n**Total: ${messages.length} messages** | **Filter:** ${filter || 'none'}`
          }]
        };
      }

      case "getVibeProjectStatus": {
        const { includeMemory = false } = args;
        
        const status = await contextManager.getProjectStatus(includeMemory);
        
        return {
          content: [{ 
            type: "text", 
            text: `🎯 **Vibe Project Status**\n\n${JSON.stringify(status, null, 2)}`
          }]
        };
      }

      case "saveVibeAgentMemory": {
        const { agentId, memoryType, content, step, phase } = args;
        
        const memory = await contextManager.saveVibeAgentMemory(agentId, memoryType, content, { step, phase });
        
        return {
          content: [{ 
            type: "text", 
            text: `💾 **Memory saved for ${agentId}**\n\n**Type:** ${memoryType}\n**Step:** ${step || 'none'}\n**Phase:** ${phase || 'none'}\n**Size:** ${JSON.stringify(content).length} chars`
          }]
        };
      }

      case "loadVibeAgentMemory": {
        const { agentId, memoryType, step, phase } = args;
        
        const memory = await contextManager.loadVibeAgentMemory(agentId, memoryType, { step, phase });
        
        if (!memory) {
          return {
            content: [{ 
              type: "text", 
              text: `📭 **No ${memoryType} memory found for ${agentId}**`
            }]
          };
        }
        
        return {
          content: [{ 
            type: "text", 
            text: `🧠 **Memory loaded for ${agentId}**\n\n${JSON.stringify(memory, null, 2)}`
          }]
        };
      }

      case "registerVibeAgent": {
        const { agentId, profile } = args;
        
        const registration = await contextManager.registerVibeAgent(agentId, profile);
        
        return {
          content: [{ 
            type: "text", 
            text: `🤖 **Agent registered: ${agentId}**\n\n**Vibe Steps:** ${profile.vibeSteps?.join(', ') || 'none'}\n**Capabilities:** ${profile.capabilities?.join(', ') || 'none'}\n**Terminal:** ${profile.terminalId || 'unknown'}`
          }]
        };
      }

      case "findVibeAgentsForTask": {
        const { task, requiredSteps, preferredCapabilities } = args;
        
        const matches = await contextManager.findVibeAgentsForTask(task, { requiredSteps, preferredCapabilities });
        
        return {
          content: [{ 
            type: "text", 
            text: `🔍 **Agent matches for task:** "${task}"\n\n${JSON.stringify(matches, null, 2)}`
          }]
        };
      }

      // Legacy compatibility
      case "postMessage": {
        const { room, msg, apiKey } = args;
        const messageObj = await storage.postMessage(room, msg);
        return {
          content: [{ type: "text", text: JSON.stringify({ ok: true, timestamp: messageObj.ts }) }]
        };
      }

      case "getMessages": {
        const { room } = args;
        const messages = await storage.getMessages(room);
        return {
          content: [{ type: "text", text: JSON.stringify(messages) }]
        };
      }

      case "listRooms": {
        const rooms = await storage.listVibeRooms();
        return {
          content: [{ type: "text", text: JSON.stringify(rooms) }]
        };
      }

      // Smart Task Routing Tools
      case "analyzeVibeTask": {
        const { taskDescription, priority, currentStep, currentPhase } = args;
        
        if (!taskDescription) {
          return {
            content: [{ type: "text", text: "Error: Missing taskDescription parameter" }],
            isError: true
          };
        }

        const analysis = await taskRouter.analyzeTask(taskDescription, { priority, currentStep, currentPhase });
        
        return {
          content: [{ 
            type: "text", 
            text: `🎯 **Vibe Task Analysis**\n\n**Task:** "${taskDescription}"\n\n**Analysis Results:**\n\`\`\`json\n${JSON.stringify(analysis, null, 2)}\n\`\`\`\n\n**Next Steps:**\n- Use \`routeVibeTask\` to assign optimal agents\n- Or use \`createVibeExecutionPlan\` for detailed planning`
          }]
        };
      }

      case "routeVibeTask": {
        const { taskDescription, options = {} } = args;
        
        if (!taskDescription) {
          return {
            content: [{ type: "text", text: "Error: Missing taskDescription parameter" }],
            isError: true
          };
        }

        const routingResult = await taskRouter.analyzeAndRouteTask(taskDescription, options);
        
        // Format the response for better readability
        const formattedResult = {
          task: taskDescription,
          complexity: routingResult.taskAnalysis.complexity,
          categories: routingResult.taskAnalysis.categories.map(cat => cat.category),
          recommendedAgents: routingResult.agentRecommendations.slice(0, 3).map(agent => ({
            agent: agent.agent,
            score: agent.score,
            reasoning: agent.reasoning.slice(0, 2)
          })),
          executionPlan: {
            phases: routingResult.executionPlan.phases.length,
            estimatedTime: routingResult.executionPlan.totalEstimatedTime,
            parallelizable: routingResult.executionPlan.parallelizable
          },
          projectReadiness: routingResult.projectContext.readiness.overallReadiness,
          coordinationStrategy: routingResult.coordinationStrategy.communicationPattern
        };
        
        return {
          content: [{ 
            type: "text", 
            text: `🚀 **Vibe Task Routing Results**\n\n**Task:** "${taskDescription}"\n\n**Routing Analysis:**\n\`\`\`json\n${JSON.stringify(formattedResult, null, 2)}\n\`\`\`\n\n**Recommended Next Steps:**\n${routingResult.agentRecommendations.length > 0 ? 
              `- **Primary Agent:** ${routingResult.agentRecommendations[0].agent} (Score: ${routingResult.agentRecommendations[0].score})\n- **Backup Agent:** ${routingResult.agentRecommendations[1]?.agent || 'none'}\n- **Coordination:** ${routingResult.coordinationStrategy.communicationPattern}` :
              '- No suitable agents found - consider registering more agents'
            }\n\n**Execution Ready:** ${routingResult.projectContext.readiness.overallReadiness === 'ready' ? '✅ Yes' : '⚠️ ' + routingResult.projectContext.readiness.blockers.join(', ')}`
          }]
        };
      }

      case "createVibeExecutionPlan": {
        const { taskAnalysis, agentRecommendations, coordinationStrategy = "hybrid" } = args;
        
        if (!taskAnalysis) {
          return {
            content: [{ type: "text", text: "Error: Missing taskAnalysis parameter" }],
            isError: true
          };
        }

        // Create a comprehensive execution plan
        const projectContext = await contextManager.getProjectStatus();
        const executionPlan = await taskRouter.createExecutionPlan(taskAnalysis, agentRecommendations || [], projectContext);
        const coordination = await taskRouter.generateCoordinationStrategy(executionPlan, projectContext);
        
        const planDetails = {
          overview: {
            task: taskAnalysis.originalTask,
            complexity: taskAnalysis.complexity,
            estimatedDuration: `${executionPlan.totalEstimatedTime} minutes`,
            phases: executionPlan.phases.length,
            parallelizable: executionPlan.parallelizable
          },
          phases: executionPlan.phases.map((phase, index) => ({
            phaseNumber: index + 1,
            name: phase.name,
            agents: phase.agents.map(a => a.agent || a),
            estimatedTime: `${phase.estimatedTime} minutes`,
            deliverables: phase.deliverables
          })),
          coordination: {
            pattern: coordination.communicationPattern,
            checkpoints: coordination.checkpointFrequency,
            qualityGates: coordination.qualityGates,
            escalationPath: coordination.escalationPath
          },
          riskMitigation: coordination.riskMitigation
        };
        
        return {
          content: [{ 
            type: "text", 
            text: `📋 **Vibe Execution Plan Created**\n\n**Task:** "${taskAnalysis.originalTask}"\n\n**Detailed Plan:**\n\`\`\`json\n${JSON.stringify(planDetails, null, 2)}\n\`\`\`\n\n**Implementation Guide:**\n1. **Setup:** Ensure all recommended agents are active\n2. **Phase Execution:** Follow the phase sequence with proper handoffs\n3. **Coordination:** Use ${coordination.communicationPattern} communication pattern\n4. **Quality:** Implement quality gates at each phase completion\n5. **Monitoring:** Check progress ${coordination.checkpointFrequency}\n\n**Ready to Execute:** Use \`sendVibeMessage\` to coordinate with assigned agents`
          }]
        };
      }

      // UltraThink Coordination Tools
      case "coordinateUltraThink": {
        const { taskDescription, options = {} } = args;
        
        if (!taskDescription) {
          return {
            content: [{ type: "text", text: "Error: Missing taskDescription parameter" }],
            isError: true
          };
        }

        try {
          const result = await ultrathinkCoordinator.coordinateUltraThink(taskDescription, options);
          
          if (!result.success) {
            return {
              content: [{ 
                type: "text", 
                text: `❌ **UltraThink Coordination Failed**\n\n**Error:** ${result.error}\n\n**Troubleshooting:**\n- Ensure all UltraThink agents are properly registered\n- Check that the message bus is operational\n- Verify task complexity is appropriate for UltraThink coordination`
              }],
              isError: true
            };
          }
          
          const summary = {
            sessionId: result.session.id,
            task: result.session.task,
            pattern: result.session.pattern,
            duration: `${Math.ceil(result.session.duration / 1000 / 60)} minutes`,
            agents: result.session.agents.length,
            confidence: `${(result.results.synthesis.confidence * 100).toFixed(1)}%`,
            phases: result.results.implementationPlan.phases.length,
            readiness: result.synthesis.implementationReadiness
          };
          
          return {
            content: [{ 
              type: "text", 
              text: `🧠 **UltraThink Coordination Complete!**\n\n**Session Summary:**\n\`\`\`json\n${JSON.stringify(summary, null, 2)}\n\`\`\`\n\n**Key Achievements:**\n${result.synthesis.keyFindings.map(finding => `✅ ${finding}`).join('\\n')}\n\n**Next Steps:**\n${result.synthesis.nextActions.map(action => `🎯 ${action}`).join('\\n')}\n\n**Room:** Check \`${result.session.room}\` for detailed coordination messages\n**Quality Score:** ${(result.synthesis.qualityScore * 100).toFixed(1)}%\n\n**🚀 Enhanced multi-agent coordination successfully completed!**`
            }]
          };
          
        } catch (error) {
          return {
            content: [{ 
              type: "text", 
              text: `❌ **UltraThink Coordination Error**\n\n**Error:** ${error.message}\n\n**Please try again or check system status.**`
            }],
            isError: true
          };
        }
      }

      case "getUltraThinkSession": {
        const { sessionId } = args;
        
        if (!sessionId) {
          return {
            content: [{ type: "text", text: "Error: Missing sessionId parameter" }],
            isError: true
          };
        }

        const session = await ultrathinkCoordinator.getSessionStatus(sessionId);
        
        if (!session) {
          return {
            content: [{ 
              type: "text", 
              text: `📭 **Session not found:** ${sessionId}\n\n*Use \`listUltraThinkSessions\` to see active sessions.*`
            }]
          };
        }
        
        return {
          content: [{ 
            type: "text", 
            text: `🧠 **UltraThink Session Status**\n\n**Session:** ${sessionId}\n\n**Details:**\n\`\`\`json\n${JSON.stringify(session, null, 2)}\n\`\`\`\n\n**Phase:** ${session.phase}\n**Agents:** ${session.agents?.length || 0}\n**Duration:** ${session.duration ? Math.ceil(session.duration / 1000 / 60) + ' minutes' : 'ongoing'}`
          }]
        };
      }

      case "listUltraThinkSessions": {
        const sessions = await ultrathinkCoordinator.getActiveSessions();
        
        if (sessions.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `📭 **No active UltraThink sessions**\n\n*Use \`coordinateUltraThink\` to start a new coordination session.*`
            }]
          };
        }
        
        return {
          content: [{ 
            type: "text", 
            text: `🧠 **Active UltraThink Sessions**\n\n**Sessions:** ${sessions.length}\n\n**Details:**\n${sessions.map((session, index) => 
              `**${index + 1}. ${session.room}**\\n- Pattern: ${session.pattern}\\n- Messages: ${session.messageCount}\\n- Last Activity: ${new Date(session.lastActivity).toLocaleString()}`
            ).join('\\n\\n')}\n\n*Use \`getUltraThinkSession\` with a session ID for detailed status.*`
          }]
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Error: Unknown tool: ${name}` }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Enhanced startup and lifecycle management
async function main() {
  console.error("🚀 Initializing Vibe Agent Bus v2.1.0...");
  
  // Initialize all components
  await storage.initialize();
  await contextManager.initialize();
  await agentRouter.initialize();
  await taskRouter.initialize();
  await ultrathinkCoordinator.initialize();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Enhanced graceful shutdown
  const shutdown = async () => {
    console.error("🛑 Shutting down Vibe Agent Bus gracefully...");
    await storage.shutdown();
    await contextManager.shutdown();
    await agentRouter.shutdown();
    await taskRouter.shutdown();
    await ultrathinkCoordinator.shutdown();
    process.exit(0);
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  
  console.error("✅ Vibe Agent Bus started successfully - Ready for multi-agent coordination!");
}

main().catch((error) => {
  console.error("💥 Fatal error in Vibe Agent Bus:", error);
  process.exit(1);
});