# Claude Code Auto-Detection and Integration Plan

## Overview
This plan outlines how to implement auto-detection and connection to installed Claude Code instances for the Kanban Multi-Agent Integration system, enabling seamless integration without requiring API keys for local instances.

## Research Findings

### Claude Code Architecture
- **Installation**: Global npm package `@anthropic-ai/claude-code`
- **Runtime**: Node.js process with MCP (Model Context Protocol) support
- **Transport Methods**: stdio (local), SSE (Server-Sent Events), HTTP (streamable)
- **Configuration**: Hierarchical scoping (local → project → user)

### Current Limitations
- Direct API-key-free connection not natively supported
- Authentication still required for most operations
- No built-in auto-discovery for arbitrary connections

## Implementation Strategy

### Phase 1: MCP Server Bridge Architecture

#### 1.1 Create MCP Server Bridge
```typescript
// mcp-bridge/claude-bridge-server.ts
interface ClaudeBridgeServer {
  // Auto-detect running Claude Code instances
  detectClaudeInstances(): Promise<ClaudeInstance[]>
  
  // Connect to specific Claude instance via MCP
  connectToInstance(instanceId: string): Promise<MCPConnection>
  
  // Relay messages between Kanban and Claude
  relayMessage(instanceId: string, message: string): Promise<string>
  
  // Subscribe to Claude instance events
  subscribeToInstance(instanceId: string, callback: (event: ClaudeEvent) => void): void
}

interface ClaudeInstance {
  id: string
  pid: number
  version: string
  workingDirectory: string
  mcpEndpoint?: string
  status: 'running' | 'idle' | 'busy'
  capabilities: string[]
}

interface MCPConnection {
  instanceId: string
  transport: 'stdio' | 'http' | 'sse'
  endpoint: string
  status: 'connected' | 'connecting' | 'disconnected'
  tools: MCPTool[]
}
```

#### 1.2 Process Detection System
```typescript
// mcp-bridge/process-detector.ts
class ClaudeProcessDetector {
  async detectRunningInstances(): Promise<ClaudeInstance[]> {
    // Use multiple detection methods
    const processes = await this.getClaudeProcesses()
    const mcpServers = await this.getMCPServers()
    const configuredInstances = await this.getConfiguredInstances()
    
    return this.mergeDetectionResults(processes, mcpServers, configuredInstances)
  }
  
  private async getClaudeProcesses(): Promise<ProcessInfo[]> {
    // Detect via process list
    const { exec } = require('child_process')
    const processes = await this.execAsync('ps aux | grep claude-code')
    return this.parseProcessList(processes)
  }
  
  private async getMCPServers(): Promise<MCPServerInfo[]> {
    // Detect via MCP configuration
    const mcpConfig = await this.readMCPConfig()
    return this.extractClaudeServers(mcpConfig)
  }
  
  private async getConfiguredInstances(): Promise<ConfiguredInstance[]> {
    // Check known configuration locations
    const configPaths = [
      '~/.claude/config.json',
      '~/.config/claude-code/config.json',
      './claude.config.json'
    ]
    
    return this.parseConfigFiles(configPaths)
  }
}
```

### Phase 2: Enhanced Chat Interface with Auto-Discovery

#### 2.1 Updated ChatWindow Component
```typescript
// components/ChatWindow.tsx
interface ChatWindowProps {
  agents: Agent[]
  messages: Message[]
  claudeInstances: ClaudeInstance[]  // NEW: Auto-detected instances
  onSendMessage: (message: string, targetInstance?: string) => void
  onConnectToInstance: (instanceId: string) => void  // NEW: Connect to specific instance
  isLoading?: boolean
  height?: string
  className?: string
}

interface ChatWindowState {
  inputValue: string
  isScrolledToBottom: boolean
  isTyping: boolean
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
  selectedInstance?: string  // NEW: Currently selected Claude instance
  availableInstances: ClaudeInstance[]  // NEW: Auto-detected instances
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  agents,
  messages,
  claudeInstances,
  onSendMessage,
  onConnectToInstance,
  isLoading = false,
  height = '400px',
  className
}) => {
  const [state, setState] = useState<ChatWindowState>({
    inputValue: '',
    isScrolledToBottom: true,
    isTyping: false,
    connectionStatus: 'connected',
    selectedInstance: claudeInstances[0]?.id,
    availableInstances: claudeInstances
  })

  // Auto-detect Claude instances periodically
  useEffect(() => {
    const detectInstances = async () => {
      try {
        const instances = await claudeBridgeAPI.detectInstances()
        setState(prev => ({ ...prev, availableInstances: instances }))
      } catch (error) {
        console.error('Failed to detect Claude instances:', error)
      }
    }

    detectInstances()
    const interval = setInterval(detectInstances, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Handle instance selection
  const handleInstanceSelect = (instanceId: string) => {
    setState(prev => ({ ...prev, selectedInstance: instanceId }))
    onConnectToInstance(instanceId)
  }

  // Enhanced message sending with instance targeting
  const handleSendMessage = useCallback(() => {
    if (state.inputValue.trim() && !isLoading) {
      onSendMessage(state.inputValue.trim(), state.selectedInstance)
      setState(prev => ({ ...prev, inputValue: '' }))
    }
  }, [state.inputValue, state.selectedInstance, isLoading, onSendMessage])

  return (
    <div className={`chat-window ${className}`} style={{ height }}>
      <ChatHeader 
        agents={agents} 
        connectionStatus={state.connectionStatus}
        claudeInstances={state.availableInstances}  // NEW: Show available instances
        selectedInstance={state.selectedInstance}
        onInstanceSelect={handleInstanceSelect}
      />
      <MessagesContainer
        messages={messages}
        onScroll={handleScroll}
        isLoading={isLoading}
      />
      <div ref={messagesEndRef} />
      <ChatInput
        ref={inputRef}
        value={state.inputValue}
        onChange={(value) => setState(prev => ({ ...prev, inputValue: value }))}
        onKeyDown={handleKeyDown}
        onSend={handleSendMessage}
        isLoading={isLoading}
        placeholder={`Type a message to ${state.selectedInstance ? 'Claude instance' : 'your AI agents'}...`}
        selectedInstance={state.selectedInstance}  // NEW: Show selected instance
      />
    </div>
  )
}
```

#### 2.2 Claude Instance Selector Component
```typescript
// components/ClaudeInstanceSelector.tsx
interface ClaudeInstanceSelectorProps {
  instances: ClaudeInstance[]
  selectedInstance?: string
  onSelect: (instanceId: string) => void
  onRefresh: () => void
}

const ClaudeInstanceSelector: React.FC<ClaudeInstanceSelectorProps> = ({
  instances,
  selectedInstance,
  onSelect,
  onRefresh
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="claude-instance-selector">
      <button 
        className="instance-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ClaudeIcon />
        <span>
          {selectedInstance 
            ? instances.find(i => i.id === selectedInstance)?.version || 'Claude'
            : 'Select Claude Instance'
          }
        </span>
        <ChevronDown />
      </button>
      
      {isOpen && (
        <div className="instance-selector-dropdown">
          <div className="dropdown-header">
            <span>Available Claude Instances</span>
            <button onClick={onRefresh}>
              <RefreshIcon />
            </button>
          </div>
          
          {instances.length === 0 ? (
            <div className="no-instances">
              <p>No Claude Code instances detected</p>
              <p className="help-text">
                Make sure Claude Code is installed and running
              </p>
            </div>
          ) : (
            <div className="instance-list">
              {instances.map(instance => (
                <button
                  key={instance.id}
                  className={`instance-item ${selectedInstance === instance.id ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(instance.id)
                    setIsOpen(false)
                  }}
                >
                  <div className="instance-info">
                    <div className="instance-name">
                      Claude Code {instance.version}
                    </div>
                    <div className="instance-details">
                      PID: {instance.pid} | {instance.workingDirectory}
                    </div>
                  </div>
                  <StatusDot color={instance.status === 'running' ? 'green' : 'yellow'} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

### Phase 3: MCP Protocol Integration

#### 3.1 MCP Connection Manager
```typescript
// mcp-bridge/connection-manager.ts
class MCPConnectionManager {
  private connections: Map<string, MCPConnection> = new Map()
  private bridgeServer: ClaudeBridgeServer
  
  constructor() {
    this.bridgeServer = new ClaudeBridgeServer()
    this.initializeAutoDiscovery()
  }
  
  private async initializeAutoDiscovery() {
    // Set up MCP server that Claude instances can connect to
    const serverConfig = {
      name: 'vibe-kanban-bridge',
      version: '1.0.0',
      transport: 'stdio',
      tools: [
        {
          name: 'send_to_kanban',
          description: 'Send message to Kanban board',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              targetAgent: { type: 'string' },
              taskId: { type: 'string', optional: true }
            }
          }
        },
        {
          name: 'get_kanban_state',
          description: 'Get current Kanban board state',
          inputSchema: { type: 'object', properties: {} }
        }
      ]
    }
    
    await this.bridgeServer.start(serverConfig)
  }
  
  async connectToInstance(instanceId: string): Promise<boolean> {
    try {
      const connection = await this.bridgeServer.connectToInstance(instanceId)
      this.connections.set(instanceId, connection)
      
      // Subscribe to instance events
      this.bridgeServer.subscribeToInstance(instanceId, (event) => {
        this.handleInstanceEvent(instanceId, event)
      })
      
      return true
    } catch (error) {
      console.error(`Failed to connect to Claude instance ${instanceId}:`, error)
      return false
    }
  }
  
  async sendMessage(instanceId: string, message: string): Promise<string> {
    const connection = this.connections.get(instanceId)
    if (!connection) {
      throw new Error(`No connection to instance ${instanceId}`)
    }
    
    return await this.bridgeServer.relayMessage(instanceId, message)
  }
  
  private handleInstanceEvent(instanceId: string, event: ClaudeEvent) {
    // Handle events from Claude instance
    switch (event.type) {
      case 'task_completed':
        this.updateKanbanTask(event.taskId, 'completed')
        break
      case 'agent_response':
        this.forwardAgentResponse(instanceId, event.response)
        break
      case 'error':
        this.handleInstanceError(instanceId, event.error)
        break
    }
  }
}
```

#### 3.2 Auto-Discovery Configuration
```json
// claude-bridge-config.json
{
  "mcp_servers": {
    "vibe-kanban-bridge": {
      "command": "node",
      "args": ["./mcp-bridge/server.js"],
      "env": {
        "KANBAN_API_URL": "http://localhost:3000",
        "BRIDGE_MODE": "auto-discovery"
      }
    }
  },
  "auto_discovery": {
    "enabled": true,
    "detection_interval": 30000,
    "detection_methods": [
      "process_scan",
      "mcp_config",
      "file_system"
    ],
    "connection_timeout": 5000
  },
  "security": {
    "allow_local_connections": true,
    "require_authentication": false,
    "trusted_processes": ["claude-code", "claude"]
  }
}
```

### Phase 4: Enhanced Kanban Integration

#### 4.1 Claude-Aware Task Assignment
```typescript
// components/TaskAssignment.tsx
interface TaskAssignmentProps {
  task: Task
  availableAgents: Agent[]
  claudeInstances: ClaudeInstance[]  // NEW: Available Claude instances
  onAssign: (agentId: string, taskId: string) => void
  onAssignToClaude: (instanceId: string, taskId: string) => void  // NEW: Assign to Claude
  onUnassign: (taskId: string) => void
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  task,
  availableAgents,
  claudeInstances,
  onAssign,
  onAssignToClaude,
  onUnassign
}) => {
  const [assignmentMode, setAssignmentMode] = useState<'agents' | 'claude'>('agents')
  
  return (
    <div className="task-assignment">
      <div className="assignment-mode-selector">
        <button 
          className={assignmentMode === 'agents' ? 'active' : ''}
          onClick={() => setAssignmentMode('agents')}
        >
          AI Agents
        </button>
        <button 
          className={assignmentMode === 'claude' ? 'active' : ''}
          onClick={() => setAssignmentMode('claude')}
        >
          Claude Instances
        </button>
      </div>
      
      {assignmentMode === 'agents' ? (
        <AgentAssignmentList
          agents={availableAgents}
          onAssign={(agentId) => onAssign(agentId, task.id)}
        />
      ) : (
        <ClaudeInstanceAssignmentList
          instances={claudeInstances}
          onAssign={(instanceId) => onAssignToClaude(instanceId, task.id)}
        />
      )}
    </div>
  )
}
```

#### 4.2 Real-time Claude Status Integration
```typescript
// hooks/useClaudeIntegration.ts
export const useClaudeIntegration = () => {
  const [instances, setInstances] = useState<ClaudeInstance[]>([])
  const [connections, setConnections] = useState<Map<string, MCPConnection>>(new Map())
  const connectionManager = useRef<MCPConnectionManager>()
  
  useEffect(() => {
    connectionManager.current = new MCPConnectionManager()
    
    const detectAndConnect = async () => {
      const detectedInstances = await connectionManager.current.detectInstances()
      setInstances(detectedInstances)
      
      // Auto-connect to detected instances
      for (const instance of detectedInstances) {
        if (instance.status === 'running') {
          await connectionManager.current.connectToInstance(instance.id)
        }
      }
    }
    
    detectAndConnect()
    
    // Set up periodic detection
    const interval = setInterval(detectAndConnect, 30000)
    return () => clearInterval(interval)
  }, [])
  
  const sendToClaudeInstance = async (instanceId: string, message: string) => {
    if (!connectionManager.current) return
    
    try {
      return await connectionManager.current.sendMessage(instanceId, message)
    } catch (error) {
      console.error('Failed to send message to Claude instance:', error)
      throw error
    }
  }
  
  const assignTaskToClaude = async (instanceId: string, taskId: string) => {
    const message = `You have been assigned task ${taskId}. Please begin working on it.`
    return await sendToClaudeInstance(instanceId, message)
  }
  
  return {
    instances,
    connections,
    sendToClaudeInstance,
    assignTaskToClaude,
    isConnected: (instanceId: string) => connections.has(instanceId)
  }
}
```

### Phase 5: Implementation Roadmap

#### Week 1-2: Core Infrastructure
1. **MCP Bridge Server Setup**
   - Create basic MCP server structure
   - Implement process detection system
   - Add configuration management

2. **Auto-Discovery System**
   - Implement multiple detection methods
   - Add periodic scanning
   - Create connection management

#### Week 3-4: UI Integration
1. **Enhanced Chat Interface**
   - Add Claude instance selector
   - Implement real-time status display
   - Create connection management UI

2. **Kanban Board Updates**
   - Add Claude-aware task assignment
   - Implement instance status indicators
   - Create direct task routing

#### Week 5-6: Advanced Features
1. **Real-time Synchronization**
   - Implement bidirectional communication
   - Add event-driven updates
   - Create conflict resolution

2. **Performance Optimization**
   - Optimize detection algorithms
   - Implement connection pooling
   - Add caching strategies

### Phase 6: Security and Reliability

#### Security Measures
```typescript
// security/claude-security.ts
export class ClaudeSecurityManager {
  validateInstance(instance: ClaudeInstance): boolean {
    // Verify instance is legitimate Claude Code
    return this.verifyProcessSignature(instance.pid) &&
           this.verifyExecutablePath(instance.executablePath) &&
           this.verifyVersion(instance.version)
  }
  
  establishSecureConnection(instanceId: string): Promise<SecureConnection> {
    // Create secure communication channel
    return this.createEncryptedChannel(instanceId)
  }
  
  private verifyProcessSignature(pid: number): boolean {
    // Verify process is signed by Anthropic
    // Implementation depends on platform
    return true // Placeholder
  }
}
```

#### Reliability Features
- **Connection Recovery**: Auto-reconnect to dropped instances
- **Fallback Mechanisms**: Graceful degradation when instances unavailable
- **Error Handling**: Comprehensive error reporting and recovery
- **Health Monitoring**: Continuous monitoring of instance health

## Updated Integration Plan

### Key Enhancements to Original Plan
1. **Auto-Discovery**: Automatic detection of Claude Code instances
2. **Direct Connection**: Connect without API keys for local instances
3. **Real-time Integration**: Bidirectional communication with Claude
4. **Enhanced UI**: Instance selector and status indicators
5. **Task Routing**: Direct task assignment to Claude instances

### Benefits
- **Seamless Integration**: No manual configuration required
- **Improved Workflow**: Direct task delegation to Claude
- **Enhanced Productivity**: Real-time collaboration with Claude
- **Better Monitoring**: Visual status of all Claude instances
- **Reduced Friction**: No API key management for local instances

This comprehensive plan enables the Kanban Multi-Agent Integration system to automatically detect, connect to, and collaborate with installed Claude Code instances, creating a seamless development experience without requiring API key management for local instances.