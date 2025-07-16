#!/usr/bin/env node

// Minimal MCP server test - just log what we receive
import { createReadStream, createWriteStream } from 'fs';

console.error('MCP test server starting...');

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    console.error('Received:', chunk);
    
    // Try to parse as JSON-RPC
    try {
      const lines = chunk.trim().split('\n');
      for (const line of lines) {
        if (line.startsWith('{')) {
          const msg = JSON.parse(line);
          console.error('Parsed message:', msg);
          
          if (msg.method === 'initialize') {
            console.error('Got initialize request');
            const response = {
              jsonrpc: '2.0',
              id: msg.id,
              result: {
                protocolVersion: '2024-11-05',
                capabilities: {
                  tools: {}
                },
                serverInfo: {
                  name: 'test-server',
                  version: '1.0.0'
                }
              }
            };
            console.log(JSON.stringify(response));
            console.error('Sent initialize response');
          }
        }
      }
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  }
});

process.stdin.on('end', () => {
  console.error('stdin closed');
});

console.error('MCP test server ready');