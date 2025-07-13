# How the Multi-Agent System Works

## Quick Answers to Your Questions

### 1. Which Agent Do I Talk To?
**The ORCHESTRATOR (Terminal 1) is your main interface.**

```
Terminal 1 (Orchestrator) - YOU INTERACT HERE ✅
Terminal 2 (Research Agent) - Works automatically
Terminal 3 (Coding Agent) - Works automatically  
Terminal 4 (Testing Agent) - Works automatically
```

### 2. How Agents Start When You Paste Commands

When you paste `/agent research-agent --terminal-id=2` in Terminal 2:

1. **Agent Auto-Starts** immediately
2. **Announces itself** in channel.md
3. **Starts monitoring** for tasks
4. **Shows ready message**

Example output:
```
🤖 research-agent Starting...
📍 Role: researcher
🖥️  Terminal: 2

✅ research-agent is ready and monitoring
👁️  Monitoring:
  • channel.md for messages
  • Project files for changes
  
💬 Waiting for tasks from orchestrator...
```

### 3. Can Claude Code See File Changes?

**Yes!** Each agent monitors files relevant to its role:

- **Frontend Agents**: Watch `src/` for .js, .jsx, .ts, .tsx files
- **Backend Agents**: Watch `api/`, `server/` for backend files
- **Testing Agents**: Watch `tests/`, `__tests__/` for test files
- **All Agents**: Watch `.vibe-status.md` for phase changes

When a file changes:
1. Agent detects the change
2. Logs it locally
3. Notifies other agents via channel.md
4. Can trigger actions (like re-running tests)

## Complete Workflow Example

### Step 1: You Start Orchestrator (Terminal 1)
```bash
> /orchestrate

🚀 Starting Multi-Agent System Setup

You need to open 4 Claude Code instances

Terminal 1: /orchestrate --agent-role="coordinator"
Terminal 2: /agent research-agent --terminal-id=2
Terminal 3: /agent coding-agent --terminal-id=3
Terminal 4: /agent testing-agent --terminal-id=4
```

### Step 2: You Open Other Terminals and Paste Commands

**Terminal 2:**
```bash
> /agent research-agent --terminal-id=2

🤖 research-agent Starting...
✅ research-agent is ready and monitoring
💬 Waiting for tasks from orchestrator...
```

**Terminal 3:**
```bash
> /agent coding-agent --terminal-id=3

🤖 coding-agent Starting...
✅ coding-agent is ready and monitoring
💬 Waiting for tasks from orchestrator...
```

### Step 3: Back in Terminal 1 (Orchestrator) - You Give Commands

```bash
orchestrator> status

🤖 Agent Status:
─────────────────────────────────────────────────
Agent Name        Terminal   Status      Last Activity
─────────────────────────────────────────────────
orchestrator      1          active      2s ago
research-agent    2          active      5s ago
coding-agent      3          active      3s ago
testing-agent     4          active      1s ago
─────────────────────────────────────────────────

orchestrator> task research best practices for user authentication

📋 Creating task: research best practices for user authentication
Task type: research
Assigning to: research-agent

✅ Task assigned to research-agent
```

### Step 4: Agents Work Automatically

**In Terminal 2 (research-agent):**
```
📨 Received message from orchestrator
Type: task-assignment

🎯 New task assigned: research best practices for user authentication
🔍 Researching: research best practices for user authentication
📚 Gathering information...
🌐 Searching documentation...
📊 Analyzing patterns...
```

**In channel.md (visible to all):**
```markdown
### [2024-01-15T10:30:00Z] orchestrator
**Type:** task-assignment
**Target:** research-agent

{"id":"1234","name":"research best practices for user authentication","type":"research"}

---

### [2024-01-15T10:30:05Z] research-agent
**Type:** task-acknowledged
**Target:** orchestrator

Task acknowledged: research best practices for user authentication

---

### [2024-01-15T10:31:00Z] research-agent
**Type:** task-complete
**Target:** orchestrator

{"taskId":"1234","status":"complete","results":{"findings":["JWT tokens","OAuth2","2FA"]}}

---
```

## File Change Detection Example

When you edit a file in your editor:

**In Terminal 3 (coding-agent):**
```
📝 File change: src/auth/login.js
🔄 Code file change: login.js
🔍 Checking for syntax errors...
```

**In channel.md:**
```markdown
### [2024-01-15T10:35:00Z] coding-agent
**Type:** file-update
**Target:** all-agents

{"file":"src/auth/login.js","event":"change"}

---

### [2024-01-15T10:35:02Z] testing-agent
**Type:** response
**Target:** coding-agent

🔄 Source file changed, may need to re-run tests
🧪 Would run: tests/auth/login.test.js

---
```

## Key Points

1. **Orchestrator = Your Command Center**
   - All user commands go here
   - It assigns tasks to other agents
   - Shows status and results

2. **Worker Agents = Automatic Workers**
   - Start with one command
   - Work independently
   - Communicate via channel.md
   - React to file changes

3. **channel.md = Communication Hub**
   - All agents read/write here
   - You can watch it in your editor
   - Shows real-time collaboration

4. **File Monitoring = Reactive System**
   - Agents see your edits
   - Can trigger automatic actions
   - Keeps everyone in sync

## Common Commands in Orchestrator

```bash
# Check who's connected
orchestrator> status

# Assign a task
orchestrator> task implement user login form

# Run a workflow
orchestrator> workflow run feature-implementation

# Broadcast to all
orchestrator> broadcast Starting new feature development

# Test connections
orchestrator> test

# See current phase
orchestrator> phase
```

## Visual Flow

```
You → Orchestrator → Task Assignment → Worker Agent
                          ↓                 ↓
                     channel.md ← Updates & Results
                          ↓
                  All Agents See Progress
```

That's it! You talk to the Orchestrator, and it manages the team for you!