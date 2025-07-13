# 🚀 Vibe Coding Claude - 5 Minute Quick Start

Get up and running with Vibe Coding Claude in just 5 minutes!

## Option 1: Traditional (Single Claude) - 2 Minutes

### 1️⃣ Initialize Project (30 seconds)
```bash
/vibe-init my-app
```

### 2️⃣ Start Building (90 seconds)
```bash
/vibe-step-1-ideation
# Answer a few questions about your app
# Claude generates complete project specification
```

### 3️⃣ Continue (Optional)
```bash
/vibe-step-2-architecture
# And so on through all 10 steps...
```

**That's it!** You're now using Vibe Coding methodology.

---

## Option 2: Multi-Agent Team - 5 Minutes

### 1️⃣ Start Multi-Agent (30 seconds)
```bash
# In Terminal 1
/multi-agent

# Choose option 1 (Standard - 4 agents)
```

### 2️⃣ Open 3 More Terminals (1 minute)
- Open 3 new terminal tabs/windows
- Navigate to project directory in each

### 3️⃣ Start Claude in Each Terminal (2 minutes)
Start Claude Code in each terminal, then paste:

**Terminal 1:** Already running (orchestrator)

**Terminal 2:**
```bash
/agent research-agent --terminal-id=2
```

**Terminal 3:**
```bash
/agent coding-agent --terminal-id=3
```

**Terminal 4:**
```bash
/agent testing-agent --terminal-id=4
```

### 4️⃣ Give Your First Command (30 seconds)
Back in Terminal 1:
```bash
orchestrator> status
# See all agents connected ✓

orchestrator> task create a user authentication system
# Watch agents collaborate!
```

### 5️⃣ Monitor Progress (1 minute)
- Open `channel.md` in your editor
- Watch agents communicate in real-time
- See tasks completed automatically

---

## 🎯 Quick Command Reference

### Essential Commands (Terminal 1)
```bash
help          # Show all commands
status        # Check agent connections
task <desc>   # Assign work to agents
workflow list # See available workflows
```

### Example Tasks
```bash
task research best practices for real-time chat
task implement user profile page with avatar upload
task create comprehensive test suite for auth module
task optimize database queries for better performance
```

---

## 📺 What You'll See

### Single Agent Mode
```
You: /vibe-step-1-ideation
Claude: [Asks questions, creates detailed specification]
You: /vibe-step-2-architecture  
Claude: [Designs technical architecture based on step 1]
```

### Multi-Agent Mode
```
Terminal 1: orchestrator> task build landing page
Terminal 2: [Research agent finds best practices]
Terminal 3: [Coding agent implements]
Terminal 4: [Testing agent validates]
channel.md: [All communication visible]
```

---

## 🏃‍♂️ Even Quicker Start

### Fastest Project Setup (1 minute)
```bash
# Copy-paste these 4 commands:
/vibe-init quick-app
/vibe-step-1-ideation --quick
/vibe-step-2-architecture --quick
/vibe-step-8-vertical-slices --phase 1
```

### Fastest Multi-Agent (2 minutes)
```bash
# Terminal 1
/multi-agent
# Select 2 (Minimal - 3 agents)

# Terminal 2
/agent coding-agent --terminal-id=2

# Terminal 3  
/agent testing-agent --terminal-id=3

# Back to Terminal 1
orchestrator> task implement hello world API endpoint
```

---

## 💡 Quick Tips

1. **Start Simple**: Try single-agent first
2. **Read channel.md**: See what agents are doing
3. **Use `status`**: Check connections
4. **Ask for `help`**: Orchestrator explains everything

---

## 🆘 Quick Troubleshooting

**"Command not found"**
→ Make sure you're in the vibe-coding-claude directory

**"Agent not connecting"**
→ Check you copied the exact command with quotes

**"Nothing happening"**
→ Give orchestrator a task: `task do something`

---

## Next: [Full User Guide](./USER-GUIDE.md) | [Examples](../examples/)

**Ready? Start with `/vibe-init` or `/multi-agent` now!**