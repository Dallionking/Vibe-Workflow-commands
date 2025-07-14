# Kanban Multi-Agent Component Specifications

## Component Architecture Overview

Based on the design system and state management requirements, this document provides detailed specifications for all components using the twin step methodology (design-first, then implementation).

## Core Component Specifications

### 1. Chat Interface Components

#### ChatWindow Component

**Design Specification**:
- **Layout**: Fixed height container with scrollable message area
- **Structure**: Header (agent count/status) + Message Area + Input Area
- **Styling**: Clean white background, subtle borders, modern typography
- **Interactions**: Auto-scroll to bottom, message timestamp hover effects
- **Responsive**: Adapts to mobile with collapsible agent list

**Technical Specification**:
```typescript
// ChatWindow.tsx
interface ChatWindowProps {
  agents: Agent[]
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  height?: string
  className?: string
}

interface ChatWindowState {
  inputValue: string
  isScrolledToBottom: boolean
  isTyping: boolean
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  agents,
  messages,
  onSendMessage,
  isLoading = false,
  height = '400px',
  className
}) => {
  const [state, setState] = useState<ChatWindowState>({
    inputValue: '',
    isScrolledToBottom: true,
    isTyping: false,
    connectionStatus: 'connected'
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (state.isScrolledToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, state.isScrolledToBottom])

  // Handle message sending
  const handleSendMessage = useCallback(() => {
    if (state.inputValue.trim() && !isLoading) {
      onSendMessage(state.inputValue.trim())
      setState(prev => ({ ...prev, inputValue: '' }))
    }
  }, [state.inputValue, isLoading, onSendMessage])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`chat-window ${className}`} style={{ height }}>
      <ChatHeader agents={agents} connectionStatus={state.connectionStatus} />
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
        placeholder="Type a message to your AI agents..."
      />
    </div>
  )
}
```

**Component Dependencies**:
- `ChatHeader`: Displays agent count and connection status
- `MessagesContainer`: Scrollable container for message list
- `ChatInput`: Message input with send button and keyboard shortcuts

#### MessageBubble Component

**Design Specification**:
- **Layout**: Flexible bubble with agent avatar, message content, timestamp
- **Styling**: Rounded corners, agent-specific colors, subtle shadows
- **States**: Own message (right-aligned), others (left-aligned), system messages
- **Animations**: Smooth appearance, hover effects, typing indicators

**Technical Specification**:
```typescript
// MessageBubble.tsx
interface MessageBubbleProps {
  message: Message
  agent: Agent
  isOwn?: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  onReply?: (message: Message) => void
  onEdit?: (messageId: string) => void
}

interface Message {
  id: string
  content: string
  agentId: string
  timestamp: Date
  type: 'text' | 'code' | 'system' | 'error'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  replyTo?: string
  attachments?: Attachment[]
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  agent,
  isOwn = false,
  showAvatar = true,
  showTimestamp = true,
  onReply,
  onEdit
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const bubbleClasses = clsx(
    'message-bubble',
    `message-bubble--${message.type}`,
    {
      'message-bubble--own': isOwn,
      'message-bubble--hovered': isHovered,
      'message-bubble--failed': message.status === 'failed'
    }
  )

  const formatContent = (content: string, type: Message['type']) => {
    switch (type) {
      case 'code':
        return <CodeBlock content={content} />
      case 'system':
        return <SystemMessage content={content} />
      case 'error':
        return <ErrorMessage content={content} />
      default:
        return <MessageText content={content} />
    }
  }

  return (
    <div 
      className={bubbleClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showAvatar && !isOwn && (
        <AgentAvatar 
          agent={agent} 
          size="small" 
          showStatus={false}
        />
      )}
      
      <div className="message-content">
        {!isOwn && (
          <div className="message-agent-name">
            {agent.name}
          </div>
        )}
        
        <div className="message-body">
          {formatContent(message.content, message.type)}
        </div>
        
        {showTimestamp && (
          <div className="message-timestamp">
            {formatTimestamp(message.timestamp)}
            <MessageStatus status={message.status} />
          </div>
        )}
        
        {isHovered && (
          <MessageActions
            message={message}
            onReply={onReply}
            onEdit={onEdit}
            canEdit={isOwn}
          />
        )}
      </div>
    </div>
  )
}
```

#### AgentStatus Component

**Design Specification**:
- **Layout**: Compact status indicator with agent info
- **Visual**: Circular status dot, agent name, current activity
- **States**: Online (green), idle (yellow), executing (blue), offline (gray)
- **Animations**: Smooth transitions, pulsing for active states

**Technical Specification**:
```typescript
// AgentStatus.tsx
interface AgentStatusProps {
  agent: Agent
  showDetails?: boolean
  compact?: boolean
  onClick?: (agentId: string) => void
}

interface Agent {
  id: string
  name: string
  status: 'online' | 'idle' | 'executing' | 'offline' | 'error'
  lastSeen: Date
  currentTask?: string
  capabilities: string[]
  avatar?: string
  workload: number
}

const AgentStatus: React.FC<AgentStatusProps> = ({
  agent,
  showDetails = true,
  compact = false,
  onClick
}) => {
  const statusConfig = {
    online: { color: 'green', label: 'Online', animated: false },
    idle: { color: 'yellow', label: 'Idle', animated: false },
    executing: { color: 'blue', label: 'Executing', animated: true },
    offline: { color: 'gray', label: 'Offline', animated: false },
    error: { color: 'red', label: 'Error', animated: true }
  }

  const config = statusConfig[agent.status]
  const isClickable = Boolean(onClick)

  return (
    <div 
      className={clsx('agent-status', {
        'agent-status--compact': compact,
        'agent-status--clickable': isClickable
      })}
      onClick={() => onClick?.(agent.id)}
    >
      <div className="agent-status__indicator">
        <StatusDot 
          color={config.color} 
          animated={config.animated}
          size={compact ? 'small' : 'medium'}
        />
        
        {!compact && (
          <AgentAvatar 
            agent={agent} 
            size="small" 
            showStatus={false}
          />
        )}
      </div>
      
      <div className="agent-status__info">
        <div className="agent-status__name">
          {agent.name}
        </div>
        
        {showDetails && (
          <>
            <div className="agent-status__label">
              {config.label}
            </div>
            
            {agent.currentTask && (
              <div className="agent-status__task">
                {agent.currentTask}
              </div>
            )}
            
            {agent.status === 'offline' && (
              <div className="agent-status__last-seen">
                Last seen: {formatRelativeTime(agent.lastSeen)}
              </div>
            )}
          </>
        )}
      </div>
      
      {showDetails && (
        <div className="agent-status__workload">
          <WorkloadIndicator workload={agent.workload} />
        </div>
      )}
    </div>
  )
}
```

### 2. Kanban Board Components

#### KanbanBoard Component

**Design Specification**:
- **Layout**: Horizontal scrollable board with phase columns
- **Structure**: Board header + Column container + Board actions
- **Interactions**: Drag-and-drop between columns, keyboard navigation
- **Responsive**: Stacked layout on mobile, side-scroll on tablet

**Technical Specification**:
```typescript
// KanbanBoard.tsx
interface KanbanBoardProps {
  phases: Phase[]
  tasks: Task[]
  agents: Agent[]
  onTaskMove: (taskId: string, newPhaseId: string, newIndex: number) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskCreate: (phaseId: string) => void
  onTaskDelete: (taskId: string) => void
  filters?: BoardFilters
  onFiltersChange?: (filters: BoardFilters) => void
}

interface Phase {
  id: string
  name: string
  description: string
  tier: number
  color: string
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked'
  taskCount: number
  order: number
}

interface BoardFilters {
  assignedAgent?: string
  priority?: TaskPriority
  status?: TaskStatus
  searchQuery?: string
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  phases,
  tasks,
  agents,
  onTaskMove,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  filters,
  onFiltersChange
}) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters?.assignedAgent && task.assignedAgent !== filters.assignedAgent) return false
      if (filters?.priority && task.priority !== filters.priority) return false
      if (filters?.status && task.status !== filters.status) return false
      if (filters?.searchQuery && !task.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false
      return true
    })
  }, [tasks, filters])

  // Group tasks by phase
  const tasksByPhase = useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      if (!acc[task.phaseId]) acc[task.phaseId] = []
      acc[task.phaseId].push(task)
      return acc
    }, {} as Record<string, Task[]>)
  }, [filteredTasks])

  // Handle drag and drop
  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (phaseId: string) => {
    setDragOverColumn(phaseId)
  }

  const handleDrop = (phaseId: string, index: number) => {
    if (draggedTask && draggedTask.phaseId !== phaseId) {
      onTaskMove(draggedTask.id, phaseId, index)
    }
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  // Sort phases by order
  const sortedPhases = useMemo(() => {
    return [...phases].sort((a, b) => a.order - b.order)
  }, [phases])

  return (
    <div className="kanban-board">
      <BoardHeader
        phases={phases}
        tasks={filteredTasks}
        agents={agents}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      
      <div className="kanban-board__container">
        <div className="kanban-board__columns">
          {sortedPhases.map(phase => (
            <KanbanColumn
              key={phase.id}
              phase={phase}
              tasks={tasksByPhase[phase.id] || []}
              agents={agents}
              onTaskCreate={() => onTaskCreate(phase.id)}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
              onDragStart={handleDragStart}
              onDragOver={() => handleDragOver(phase.id)}
              onDrop={(index) => handleDrop(phase.id, index)}
              isDragOver={dragOverColumn === phase.id}
              draggedTask={draggedTask}
            />
          ))}
        </div>
      </div>
      
      <BoardFooter
        totalTasks={filteredTasks.length}
        completedTasks={filteredTasks.filter(t => t.status === 'completed').length}
        activeAgents={agents.filter(a => a.status === 'online' || a.status === 'executing').length}
      />
    </div>
  )
}
```

#### TaskCard Component

**Design Specification**:
- **Layout**: Card with title, description, agent avatar, progress bar
- **Styling**: Rounded corners, subtle shadow, priority color border
- **States**: Default, dragging, selected, completed, failed
- **Interactions**: Click to edit, drag to move, hover for details

**Technical Specification**:
```typescript
// TaskCard.tsx
interface TaskCardProps {
  task: Task
  assignedAgent?: Agent
  onEdit: (taskId: string) => void
  onDelete: (taskId: string) => void
  onAssign: (taskId: string, agentId: string) => void
  onUnassign: (taskId: string) => void
  isDragging?: boolean
  isSelected?: boolean
  showDetails?: boolean
}

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedAgent?: string
  phaseId: string
  tier: number
  progress: number
  estimatedTime?: number
  actualTime?: number
  dependencies: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  assignedAgent,
  onEdit,
  onDelete,
  onAssign,
  onUnassign,
  isDragging = false,
  isSelected = false,
  showDetails = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const cardClasses = clsx(
    'task-card',
    `task-card--${task.status}`,
    `task-card--${task.priority}`,
    {
      'task-card--dragging': isDragging,
      'task-card--selected': isSelected,
      'task-card--assigned': Boolean(assignedAgent),
      'task-card--expanded': isExpanded
    }
  )

  const priorityConfig = {
    low: { color: 'gray', label: 'Low' },
    medium: { color: 'blue', label: 'Medium' },
    high: { color: 'orange', label: 'High' },
    urgent: { color: 'red', label: 'Urgent' }
  }

  const statusConfig = {
    pending: { color: 'gray', label: 'Pending', icon: 'clock' },
    in_progress: { color: 'blue', label: 'In Progress', icon: 'play' },
    completed: { color: 'green', label: 'Completed', icon: 'check' },
    blocked: { color: 'red', label: 'Blocked', icon: 'alert' },
    failed: { color: 'red', label: 'Failed', icon: 'x' }
  }

  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onEdit(task.id)}
    >
      {/* Priority Border */}
      <div 
        className="task-card__priority-border"
        style={{ backgroundColor: priorityConfig[task.priority].color }}
      />
      
      {/* Header */}
      <div className="task-card__header">
        <div className="task-card__title-section">
          <h3 className="task-card__title">{task.title}</h3>
          <TaskStatusBadge 
            status={task.status} 
            config={statusConfig[task.status]}
          />
        </div>
        
        {assignedAgent && (
          <AgentAvatar 
            agent={assignedAgent} 
            size="small" 
            showStatus={true}
            onClick={(agentId) => onUnassign(task.id)}
          />
        )}
        
        {showActions && (
          <TaskActions
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssign={onAssign}
            onUnassign={onUnassign}
          />
        )}
      </div>
      
      {/* Description */}
      {showDetails && task.description && (
        <div className="task-card__description">
          <p className={clsx('task-card__description-text', {
            'task-card__description-text--truncated': !isExpanded
          })}>
            {task.description}
          </p>
          
          {task.description.length > 100 && (
            <button 
              className="task-card__expand-button"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
      
      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="task-card__tags">
          {task.tags.map(tag => (
            <TaskTag key={tag} tag={tag} />
          ))}
        </div>
      )}
      
      {/* Progress and Metadata */}
      <div className="task-card__footer">
        <TaskProgress 
          progress={task.progress} 
          status={task.status}
          showPercentage={true}
          size="small"
        />
        
        <div className="task-card__metadata">
          {task.estimatedTime && (
            <div className="task-card__time">
              <Icon name="clock" size="small" />
              {formatDuration(task.estimatedTime)}
            </div>
          )}
          
          {task.dependencies.length > 0 && (
            <div className="task-card__dependencies">
              <Icon name="link" size="small" />
              {task.dependencies.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 3. Shared Components

#### StatusDot Component

**Design Specification**:
- **Layout**: Small circular indicator with color coding
- **Animations**: Pulse animation for active states
- **Variants**: Different sizes and colors based on status

**Technical Specification**:
```typescript
// StatusDot.tsx
interface StatusDotProps {
  color: 'green' | 'yellow' | 'blue' | 'red' | 'gray'
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
  className?: string
}

const StatusDot: React.FC<StatusDotProps> = ({
  color,
  size = 'medium',
  animated = false,
  className
}) => {
  const sizeConfig = {
    small: '6px',
    medium: '8px',
    large: '12px'
  }

  const colorConfig = {
    green: '#00CC44',
    yellow: '#FF9900',
    blue: '#0066FF',
    red: '#FF3333',
    gray: '#9CA3AF'
  }

  return (
    <div 
      className={clsx('status-dot', className, {
        'status-dot--animated': animated
      })}
      style={{
        width: sizeConfig[size],
        height: sizeConfig[size],
        backgroundColor: colorConfig[color]
      }}
    />
  )
}
```

## Component Testing Specifications

### Unit Tests
Each component should have comprehensive unit tests covering:
- **Rendering**: Component renders without crashing
- **Props**: All prop combinations work correctly
- **State**: Internal state changes work as expected
- **Events**: Event handlers are called correctly
- **Accessibility**: ARIA attributes and keyboard navigation

### Integration Tests
- **Drag and Drop**: Task movement between phases
- **Real-time Updates**: Message and status synchronization
- **Agent Interaction**: Agent assignment and communication
- **Error Handling**: Error states and recovery

### Performance Tests
- **Large Data Sets**: Handle 1000+ tasks efficiently
- **Real-time Updates**: Maintain performance with frequent updates
- **Memory Usage**: No memory leaks during long sessions
- **Rendering Performance**: Smooth animations and transitions

This component specification provides a comprehensive foundation for implementing the Kanban Multi-Agent Integration with consistent, maintainable, and performant components.