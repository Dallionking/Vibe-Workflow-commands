#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import SQLiteStorage from './sqlite-storage.js';
import ContextManager from './context-manager.js';

// Initialize persistent storage
const storage = new SQLiteStorage();
const contextManager = new ContextManager();

// Create MCP server
const server = new Server(
  {
    name: "messageBus",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// Handle tools/list request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Context Management Tools
      {
        name: "saveAgentMemory",
        description: "Save agent's working memory/scratchpad",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "Agent identifier"
            },
            memoryType: {
              type: "string",
              description: "Type of memory: procedural, plan, episodic, scratch"
            },
            content: {
              type: "object",
              description: "Memory content to save"
            }
          },
          required: ["agentId", "memoryType", "content"]
        }
      },
      {
        name: "loadAgentMemory",
        description: "Load agent's saved memory",
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
            }
          },
          required: ["agentId", "memoryType"]
        }
      },
      {
        name: "saveAgentProfile",
        description: "Save agent profile with capabilities and specializations",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "Agent identifier"
            },
            profile: {
              type: "object",
              description: "Agent profile data",
              properties: {
                capabilities: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of agent capabilities"
                },
                specializations: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of agent specializations"
                },
                instructions: {
                  type: "string",
                  description: "Procedural instructions for the agent"
                }
              }
            }
          },
          required: ["agentId", "profile"]
        }
      },
      {
        name: "createThread",
        description: "Create a new thread for isolated context",
        inputSchema: {
          type: "object",
          properties: {
            threadId: {
              type: "string",
              description: "Optional thread ID (auto-generated if not provided)"
            },
            metadata: {
              type: "object",
              description: "Thread metadata"
            }
          },
          required: []
        }
      },
      {
        name: "postMessage",
        description: "Send a message to a room",
        inputSchema: {
          type: "object",
          properties: {
            room: {
              type: "string",
              description: "Room name to send message to"
            },
            msg: {
              type: "string", 
              description: "Message content"
            },
            apiKey: {
              type: "string",
              description: "API key for authentication (optional)"
            }
          },
          required: ["room", "msg"]
        }
      },
      {
        name: "getMessages",
        description: "Get all messages from a room",
        inputSchema: {
          type: "object",
          properties: {
            room: {
              type: "string",
              description: "Room name to get messages from"
            }
          },
          required: ["room"]
        }
      },
      {
        name: "clearRoom",
        description: "Clear all messages from a room",
        inputSchema: {
          type: "object",
          properties: {
            room: {
              type: "string",
              description: "Room name to clear"
            }
          },
          required: ["room"]
        }
      },
      {
        name: "getRecentMessage",
        description: "Get the most recent message from a room",
        inputSchema: {
          type: "object",
          properties: {
            room: {
              type: "string",
              description: "Room name to get recent message from"
            }
          },
          required: ["room"]
        }
      },
      {
        name: "listRooms",
        description: "List all active rooms with message counts",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: "sendMessage",
        description: "Send a message to another agent with smart room selection",
        inputSchema: {
          type: "object",
          properties: {
            agent: {
              type: "string",
              description: "Target agent name"
            },
            room: {
              type: "string",
              description: "Room name (optional - will auto-select if not provided)"
            },
            message: {
              type: "string",
              description: "Message content to send"
            }
          },
          required: ["agent", "message"]
        }
      },
      {
        name: "checkMessages",
        description: "Check all messages in a room with formatted display",
        inputSchema: {
          type: "object",
          properties: {
            room: {
              type: "string",
              description: "Room name to check"
            }
          },
          required: ["room"]
        }
      },
      {
        name: "checkRecentMessage",
        description: "Check only the most recent message in a room with formatted display",
        inputSchema: {
          type: "object",
          properties: {
            room: {
              type: "string",
              description: "Room name to check"
            }
          },
          required: ["room"]
        }
      }
    ]
  };
});

// Handle prompts/list request
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "sendMessage",
        description: "Send a message to another agent via the message bus",
        arguments: [
          {
            name: "agent",
            description: "Target agent name",
            required: true
          },
          {
            name: "room",
            description: "Room name (optional - auto-selects if not provided)",
            required: false
          },
          {
            name: "message",
            description: "Message content to send",
            required: true
          }
        ]
      },
      {
        name: "checkMessages",
        description: "Check all messages from a specific room in the message bus",
        arguments: [
          {
            name: "room",
            description: "Room name to check",
            required: true
          }
        ]
      },
      {
        name: "checkRecentMessage",
        description: "Check the most recent message from a specific room in the message bus",
        arguments: [
          {
            name: "room",
            description: "Room name to check",
            required: true
          }
        ]
      },
      {
        name: "listRooms",
        description: "List all active rooms in the message bus",
        arguments: []
      },
      {
        name: "clearRoom",
        description: "Clear all messages from a specific room in the message bus",
        arguments: [
          {
            name: "room",
            description: "Room name to clear",
            required: true
          }
        ]
      }
    ]
  };
});

// Handle prompts/get request
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "sendMessage":
      const agent = args?.agent || "<agent-name>";
      const room = args?.room || "";
      const message = args?.message || "<message-content>";
      
      const roomParam = room ? `, "room": "${room}"` : "";
      
      return {
        description: `Send a message to ${agent} via the message bus.`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Send a message to ${agent} using the message bus. Use the sendMessage tool:\n\nmcp__messageBus__sendMessage {"agent": "${agent}"${roomParam}, "message": "${message}"}\n\nThis will send the message with smart room selection and proper formatting for agent communication.`
            }
          }
        ]
      };

    case "checkMessages":
      const checkRoom = args?.room || "<room-name>";
      return {
        description: `Check all messages in the "${checkRoom}" room.`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Check all messages in the "${checkRoom}" room using:\n\nmcp__messageBus__checkMessages {"room": "${checkRoom}"}\n\nThis will display all messages with timestamps and formatting.`
            }
          }
        ]
      };

    case "checkRecentMessage":
      const recentRoom = args?.room || "<room-name>";
      return {
        description: `Check the most recent message in the "${recentRoom}" room.`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Check the most recent message in the "${recentRoom}" room using:\n\nmcp__messageBus__checkRecentMessage {"room": "${recentRoom}"}\n\nThis will show only the latest message with context (e.g., "message 3 of 5").`
            }
          }
        ]
      };

    case "listRooms":
      return {
        description: "List all active rooms in the message bus.",
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `List all active rooms in the message bus using:\n\nmcp__messageBus__listRooms {}\n\nThis will show all rooms with message counts and last activity.`
            }
          }
        ]
      };

    case "clearRoom":
      const clearRoom = args?.room || "<room-name>";
      return {
        description: `Clear all messages from the "${clearRoom}" room.`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Clear all messages from the "${clearRoom}" room using:\n\nmcp__messageBus__clearRoom {"room": "${clearRoom}"}\n\nWarning: This action cannot be undone. All messages in the room will be permanently deleted.`
            }
          }
        ]
      };

    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Handle tools/call request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "postMessage": {
        const { room, msg, apiKey } = args;
        
        if (!room || msg === undefined) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Missing room or msg parameter" 
            }],
            isError: true
          };
        }
        
        // Auth check (via environment variable)
        const serverApiKey = process.env.API_KEY;
        if (serverApiKey && apiKey !== serverApiKey) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Unauthorized - invalid API key" 
            }],
            isError: true
          };
        }
        
        const messageObj = await storage.postMessage(room, msg);
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({ ok: true, timestamp: messageObj.ts }) 
          }]
        };
      }
      
      case "getMessages": {
        const { room } = args;
        
        if (!room) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Missing room parameter" 
            }],
            isError: true
          };
        }
        
        const messages = await storage.getMessages(room);
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(messages) 
          }]
        };
      }
      
      case "getRecentMessage": {
        const { room } = args;
        
        if (!room) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Missing room parameter" 
            }],
            isError: true
          };
        }
        
        const recentData = await storage.getRecentMessage(room);
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(recentData) 
          }]
        };
      }
      
      case "clearRoom": {
        const { room } = args;
        
        if (!room) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Missing room parameter" 
            }],
            isError: true
          };
        }
        
        const clearedCount = await storage.clearRoom(room);
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({ 
              ok: true, 
              room, 
              clearedMessages: clearedCount 
            }) 
          }]
        };
      }
      
      case "listRooms": {
        const rooms = await storage.listRooms();
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify({ 
              rooms, 
              totalRooms: rooms.length 
            }) 
          }]
        };
      }
      
      case "sendMessage": {
        const { agent, room, message } = args;
        
        if (!agent || !message) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Missing agent or message parameter" 
            }],
            isError: true
          };
        }
        
        // Auto-select room if not provided
        let selectedRoom = room;
        if (!selectedRoom) {
          // Smart room selection based on message content
          const msg = message.toLowerCase();
          if (msg.includes('frontend') || msg.includes('backend') || msg.includes('api') || msg.includes('endpoint')) {
            selectedRoom = 'fe-be';
          } else if (msg.includes('status') || msg.includes('progress') || msg.includes('complete')) {
            selectedRoom = 'status';
          } else if (msg.includes('question') || msg.includes('help') || msg.includes('?')) {
            selectedRoom = 'questions';
          } else if (msg.includes('error') || msg.includes('fail') || msg.includes('bug')) {
            selectedRoom = 'errors';
          } else {
            selectedRoom = 'coordination';
          }
        }
        
        // Format message with agent prefix
        const formattedMessage = `Message for ${agent}: ${message}`;
        const messageObj = await storage.postMessage(selectedRoom, formattedMessage);
        
        return {
          content: [{ 
            type: "text", 
            text: `✅ Message sent successfully!\n\n**Details:**\n- **Target agent:** ${agent}\n- **Room:** ${selectedRoom}${room ? '' : ' (auto-selected)'}\n- **Message:** "${message}"\n- **Timestamp:** ${messageObj.ts}` 
          }]
        };
      }
      
      case "checkMessages": {
        const { room } = args;
        
        if (!room) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Missing room parameter" 
            }],
            isError: true
          };
        }
        
        const messages = await storage.getMessages(room);
        
        if (messages.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `📭 No messages in "${room}" room yet.` 
            }]
          };
        }
        
        const formatTimestamp = (ts) => new Date(ts).toLocaleString('en-US', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        
        const formattedMessages = messages.map((msg, index) => 
          `[${index + 1}] ${formatTimestamp(msg.ts)} - ${msg.msg}`
        ).join('\n');
        
        return {
          content: [{ 
            type: "text", 
            text: `📨 **Messages in "${room}" room:**\n\n${formattedMessages}\n\n**Total: ${messages.length} messages**` 
          }]
        };
      }
      
      case "checkRecentMessage": {
        const { room } = args;
        
        if (!room) {
          return {
            content: [{ 
              type: "text", 
              text: "Error: Missing room parameter" 
            }],
            isError: true
          };
        }
        
        const recentData = await storage.getRecentMessage(room);
        
        if (!recentData.message) {
          return {
            content: [{ 
              type: "text", 
              text: `📭 No messages in "${room}" room yet.` 
            }]
          };
        }
        
        const formatTimestamp = (ts) => new Date(ts).toLocaleString('en-US', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        
        return {
          content: [{ 
            type: "text", 
            text: `📬 **Latest message in "${room}" room:**\n\n[${formatTimestamp(recentData.message.ts)}] ${recentData.message.msg}\n\n**(message ${recentData.messageNumber} of ${recentData.totalCount} total messages)**` 
          }]
        };
      }
      
      default:
        return {
          content: [{ 
            type: "text", 
            text: `Error: Unknown tool: ${name}` 
          }],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [{ 
        type: "text", 
        text: `Error: ${error.message}` 
      }],
      isError: true
    };
  }
});

// Start the server
async function main() {
  // Initialize storage before starting server
  await storage.initialize();
  await contextManager.initialize();
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Graceful shutdown handler
  process.on('SIGINT', async () => {
    console.error('Shutting down gracefully...');
    await storage.shutdown();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.error('Shutting down gracefully...');
    await storage.shutdown();
    process.exit(0);
  });
  
  console.error("MCP Message Bus server started successfully");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});