#!/usr/bin/env node

// Simple MCP server with proper Content-Length framing
const bus = {};
const TTL_MS = 24 * 60 * 60 * 1000; // 1 day

function cleanExpiredMessages() {
  const now = Date.now();
  for (const room in bus) {
    bus[room] = bus[room].filter(msg => (now - msg.ts) < TTL_MS);
    if (bus[room].length === 0) {
      delete bus[room];
    }
  }
}

function sendMessage(obj) {
  const content = JSON.stringify(obj);
  const message = `Content-Length: ${content.length}\r\n\r\n${content}`;
  process.stdout.write(message);
  console.error('Sent:', obj);
}

function handleMessage(msg) {
  console.error('Received:', msg);
  
  if (msg.method === 'initialize') {
    sendMessage({
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'messageBus',
          version: '1.0.0'
        }
      }
    });
  } else if (msg.method === 'tools/list') {
    sendMessage({
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        tools: [
          {
            name: 'postMessage',
            description: 'Send a message to a room',
            inputSchema: {
              type: 'object',
              properties: {
                room: { type: 'string' },
                msg: { type: 'string' }
              },
              required: ['room', 'msg']
            }
          },
          {
            name: 'getMessages',
            description: 'Get messages from a room',
            inputSchema: {
              type: 'object',
              properties: {
                room: { type: 'string' }
              },
              required: ['room']
            }
          }
        ]
      }
    });
  } else if (msg.method === 'tools/call') {
    const { name, arguments: args } = msg.params;
    let result;
    
    try {
      switch (name) {
        case 'postMessage':
          const { room, msg } = args;
          if (!room || msg === undefined) {
            result = {
              isError: true,
              content: [{ type: 'text', text: 'Missing room or msg parameter' }]
            };
          } else {
            if (!bus[room]) bus[room] = [];
            bus[room].push({ ts: Date.now(), msg });
            cleanExpiredMessages();
            result = {
              content: [{ type: 'text', text: JSON.stringify({ ok: true }) }]
            };
          }
          break;
          
        case 'getMessages':
          const { room: getRoom } = args;
          if (!getRoom) {
            result = {
              isError: true,
              content: [{ type: 'text', text: 'Missing room parameter' }]
            };
          } else {
            cleanExpiredMessages();
            const messages = bus[getRoom] || [];
            result = {
              content: [{ type: 'text', text: JSON.stringify(messages) }]
            };
          }
          break;
          
        default:
          result = {
            isError: true,
            content: [{ type: 'text', text: `Unknown tool: ${name}` }]
          };
      }
    } catch (error) {
      result = {
        isError: true,
        content: [{ type: 'text', text: `Error: ${error.message}` }]
      };
    }
    
    sendMessage({
      jsonrpc: '2.0',
      id: msg.id,
      result
    });
  } else if (msg.method === 'ping') {
    sendMessage({
      jsonrpc: '2.0',
      id: msg.id,
      result: {}
    });
  }
}

// Parse stdin with Content-Length framing
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  
  while (true) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) break;
    
    const headerPart = buffer.substring(0, headerEnd);
    const contentLengthMatch = headerPart.match(/Content-Length: (\d+)/);
    
    if (!contentLengthMatch) {
      console.error('No Content-Length header found');
      break;
    }
    
    const contentLength = parseInt(contentLengthMatch[1]);
    const messageStart = headerEnd + 4;
    
    if (buffer.length < messageStart + contentLength) {
      break; // Wait for more data
    }
    
    const messageContent = buffer.substring(messageStart, messageStart + contentLength);
    buffer = buffer.substring(messageStart + contentLength);
    
    try {
      const message = JSON.parse(messageContent);
      handleMessage(message);
    } catch (error) {
      console.error('Parse error:', error.message);
    }
  }
});

process.stdin.on('end', () => {
  console.error('stdin closed');
});

console.error('MCP Message Bus server started');