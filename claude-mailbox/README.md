# Claude Message-Bus (MCP)

A lightweight MCP stdio server that lets two (or more) running Claude Code terminals exchange short JSON messages in real time.

## Features

- **Real-time messaging**: Send and receive messages between Claude Code terminals
- **Room-based organization**: Messages are grouped by room names
- **Persistent storage**: Messages saved to JSON file, survive server restarts
- **TTL cleanup**: Messages expire after 24 hours
- **Authentication**: Optional API key protection via environment variable
- **MCP stdio integration**: Works seamlessly with Claude Code's MCP support
- **Room management**: List active rooms and clear room contents

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add to Claude Code**:
   ```bash
   claude mcp add messageBus node -- "/Volumes/extra-storage/tools/claude-mailbox/bus.js"
   ```

3. **Verify installation**:
   ```bash
   claude mcp list
   claude mcp ping messageBus
   ```

**✅ Slash commands are automatically available after installation - no manual setup required!**

## MCP Tools

### High-Level Tools (Recommended)

#### sendMessage
Send a message to another agent with smart room selection and formatting.

**Parameters**:
- `agent` (string): Target agent name
- `message` (string): Message content
- `room` (string, optional): Room name (auto-selects if not provided)

**Example**:
```bash
# Auto-selects room based on content
mcp__messageBus__sendMessage {"agent": "backend", "message": "implement user authentication API"}

# Explicit room selection
mcp__messageBus__sendMessage {"agent": "frontend", "room": "fe-be", "message": "API endpoints ready"}
```

#### checkMessages
Check all messages in a room with formatted display.

**Parameters**:
- `room` (string): Room name to check

**Example**:
```bash
mcp__messageBus__checkMessages {"room": "fe-be"}
```

#### checkRecentMessage
Check only the most recent message in a room with formatted display.

**Parameters**:
- `room` (string): Room name to check

**Example**:
```bash
mcp__messageBus__checkRecentMessage {"room": "fe-be"}
```

### Low-Level Tools

#### postMessage
Send a raw message to a room.

**Parameters**:
- `room` (string): Room name to send message to
- `msg` (string): Message content
- `apiKey` (string, optional): API key for authentication

**Example**:
```bash
mcp__messageBus__postMessage {"room": "fe-be", "msg": "Hello from frontend"}
```

### getMessages
Get all messages from a room.

**Parameters**:
- `room` (string): Room name to get messages from

**Example**:
```bash
# In Claude Code terminal
mcp__messageBus__getMessages {"room": "fe-be"}
```

### clearRoom
Clear all messages from a room.

**Parameters**:
- `room` (string): Room name to clear

**Example**:
```bash
# In Claude Code terminal
mcp__messageBus__clearRoom {"room": "test"}
```

### getRecentMessage
Get only the most recent message from a room.

**Parameters**:
- `room` (string): Room name to get recent message from

**Example**:
```bash
# In Claude Code terminal
mcp__messageBus__getRecentMessage {"room": "fe-be"}
```

**Returns**:
```json
{
  "message": {"ts": 1234567890, "msg": "Latest message content"},
  "totalCount": 5,
  "messageNumber": 5
}
```

### listRooms
List all active rooms with message counts.

**Parameters**: None

**Example**:
```bash
# In Claude Code terminal
mcp__messageBus__listRooms {}
```

## Manual Testing

You can test the MCP server manually using stdio:

```bash
# Start the server
node bus.js

# The server will output the initialize message and wait for input
# You can send JSON-RPC requests via stdin
```

## Authentication

Set the `API_KEY` environment variable to enable authentication:

```bash
export API_KEY=your-secret-key
claude mcp add messageBus node -- "/Volumes/extra-storage/tools/claude-mailbox/bus.js"
```

When enabled, include the API key in tool calls:

```bash
mcp__messageBus__postMessage {"room": "test", "msg": "Hello", "apiKey": "your-secret-key"}
```

## Example Usage

**Terminal A (Frontend Agent)**:
```bash
# Send message to backend
mcp__messageBus__postMessage {"room": "fe-be", "msg": "Need user authentication API"}
```

**Terminal B (Backend Agent)**:
```bash
# Check for messages
mcp__messageBus__getMessages {"room": "fe-be"}

# Respond back
mcp__messageBus__postMessage {"room": "fe-be", "msg": "Auth API ready at /api/auth"}
```

## Troubleshooting

### Server won't start
- Ensure Node.js >= 18 is installed
- Check that `@modelcontextprotocol/sdk` is installed: `npm list @modelcontextprotocol/sdk`
- Verify the path in the `claude mcp add` command is correct
- Check file permissions for the storage directory

### MCP timeout errors
- The server sends the required `initialize` notification immediately
- Check logs with: `claude mcp logs messageBus`
- Increase timeout if needed: `claude mcp update messageBus --timeout 60000`

### Tools not appearing
- Verify server is listed: `claude mcp list`
- Check server status: `claude mcp ping messageBus`
- Restart Claude Code if needed

## Storage Configuration

**Default storage**: `/tmp/claude-message-bus.db` (SQLite database shared across all Claude terminals)

**Custom storage location**:
```bash
export STORAGE_FILE=/path/to/custom/messages.json
claude mcp add messageBus node -- "/path/to/bus.js"
```

**Shared storage features**:
- **Cross-terminal communication**: All Claude Code terminals share the same message storage
- **File locking**: Prevents corruption during concurrent writes from multiple terminals
- **File watching**: Automatically detects changes made by other terminal instances
- **Atomic writes**: Safe concurrent access with proper locking mechanisms
- **Automatic backup**: Corrupted files are backed up before being reset
- **Debounced writes**: 1-second delay to prevent excessive I/O
- **Graceful shutdown**: Forced save and cleanup on exit

## Usage

### Built-in Slash Commands (Auto-Installed)
When you install this MCP server, these slash commands are automatically available:

- `/sendMessage <agent> [room] <message>` - Send a message to an agent
- `/checkMessages <room>` - Check all messages in a room
- `/checkRecentMessage <room>` - Check only the most recent message in a room  
- `/listRooms` - List all active rooms
- `/clearRoom <room>` - Clear all messages from a room

### Direct MCP Tools
You can also use the MCP tools directly:

- `mcp__messageBus__sendMessage {"agent": "backend", "message": "implement auth API"}` 
- `mcp__messageBus__checkMessages {"room": "fe-be"}`
- `mcp__messageBus__checkRecentMessage {"room": "fe-be"}`
- `mcp__messageBus__listRooms {}`
- `mcp__messageBus__clearRoom {"room": "test"}`

### Smart Features
- **Auto room selection**: `sendMessage` intelligently selects rooms based on message content
- **Formatted output**: All tools provide clean, readable responses with timestamps
- **Agent-friendly**: Tools designed specifically for agent-to-agent communication
- **No setup required**: Slash commands come with the MCP installation

## Technical Details

- **Framework**: Official @modelcontextprotocol/sdk for MCP stdio communication
- **Protocol**: Model Context Protocol over stdio
- **Storage**: SQLite database with ACID compliance
- **TTL**: Messages expire after 7 days
- **Transport**: stdio (not HTTP)
- **Size**: ~220 LOC total

## MCP Protocol Compliance

This server uses the official MCP SDK and implements the protocol correctly:

1. **SDK Integration**: Uses `@modelcontextprotocol/sdk` for proper MCP compliance
2. **Tool registration**: Handles `tools/list` requests with schema definitions
3. **Tool execution**: Processes `tools/call` requests with proper response format
4. **Stdio transport**: Uses `StdioServerTransport` for stdin/stdout communication
5. **Error handling**: Proper error responses with `isError` flag

The server follows the MCP specification and integrates seamlessly with Claude Code's MCP system.