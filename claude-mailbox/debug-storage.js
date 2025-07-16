#!/usr/bin/env node

import MessageStorage from './storage.js';

async function testStorage() {
  console.log('=== Storage Debug Test ===');
  
  const storage = new MessageStorage('/tmp/claude-message-bus-debug.json');
  
  try {
    console.log('1. Initializing storage...');
    await storage.initialize();
    
    console.log('2. Posting a test message...');
    const result = await storage.postMessage('debug', 'Test message from debug script');
    console.log('   Result:', result);
    
    console.log('3. Getting messages...');
    const messages = await storage.getMessages('debug');
    console.log('   Messages:', messages);
    
    console.log('4. Listing rooms...');
    const rooms = await storage.listRooms();
    console.log('   Rooms:', rooms);
    
    console.log('5. Shutting down...');
    await storage.shutdown();
    
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testStorage();