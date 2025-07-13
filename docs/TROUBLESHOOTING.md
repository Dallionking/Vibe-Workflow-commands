# 🔧 Troubleshooting Guide - Vibe Coding Claude

## Common Issues and Solutions

### 🚫 Command Not Recognized

**Symptom**: Claude says "I don't recognize that command"

**Solutions**:
1. **Check you're in Claude Code**
   ```bash
   # Must be in Claude Code, not regular Claude
   # Look for "Claude Code" in the interface
   ```

2. **Verify installation**
   ```bash
   cd vibe-coding-claude
   npm install
   ```

3. **Check command syntax**
   ```bash
   # Correct
   /vibe-init my-app
   
   # Wrong
   vibe-init my-app     # Missing slash
   /vibe init my-app    # Extra space
   ```

---

### 🔌 Multi-Agent Connection Issues

**Symptom**: Agents not connecting or showing in status

**Solutions**:

1. **Check exact command syntax**
   ```bash
   # CORRECT - Note the quotes and double dashes
   /agent research-agent --terminal-id=2
   
   # WRONG - Common mistakes
   /agent research-agent --terminal-id 2    # Missing =
   /agent research-agent terminal-id=2      # Missing --
   /agent research-agent                    # Missing terminal ID
   ```

2. **Verify terminals are in correct directory**
   ```bash
   # Each terminal must be in project directory
   pwd  # Should show your project path
   ```

3. **Check orchestrator is running**
   ```bash
   # Terminal 1 must show:
   🎯 ORCHESTRATOR READY
   orchestrator>
   ```

4. **Try manual restart**
   ```bash
   # In each terminal, restart agent
   Ctrl+C  # Stop current agent
   /agent [name] --terminal-id=[number]  # Restart
   ```

---

### 📁 File Permission Issues

**Symptom**: channel.md not updating, files not created

**Solutions**:

1. **Check directory permissions**
   ```bash
   ls -la .workflow/
   # Should show your user as owner
   ```

2. **Create directories manually**
   ```bash
   mkdir -p .workflow/context
   touch .workflow/context/channel.md
   ```

3. **Fix permissions**
   ```bash
   chmod -R 755 .workflow/
   ```

---

### 🛠️ MCP Tools Not Working

**Symptom**: Context7, Perplexity, etc. not responding

**Solutions**:

1. **Check Claude Desktop settings**
   - Settings → Developer → MCP Configuration
   - Ensure tools are listed and enabled

2. **Verify MCP server is running**
   ```bash
   # Check MCP processes
   ps aux | grep mcp
   ```

3. **System works without MCPs**
   ```bash
   # Features degrade gracefully
   # Research uses web search instead
   # Documentation fetching uses local files
   ```

---

### 🔄 Workflow Execution Issues

**Symptom**: Workflows not running or getting stuck

**Solutions**:

1. **Check all agents are connected**
   ```bash
   orchestrator> status
   # All agents should show "active"
   ```

2. **Verify workflow exists**
   ```bash
   orchestrator> workflow list
   # Your workflow should be listed
   ```

3. **Check for blocking tasks**
   ```bash
   orchestrator> channel show
   # Look for "blocked" or "waiting" messages
   ```

4. **Manual task assignment**
   ```bash
   # Instead of workflow, try direct task
   orchestrator> task implement simple feature
   ```

---

### 💬 Channel Communication Problems

**Symptom**: Agents not seeing each other's messages

**Solutions**:

1. **Verify channel.md exists**
   ```bash
   cat .workflow/context/channel.md
   # Should show agent messages
   ```

2. **Check file watchers**
   ```bash
   # In agent terminal, should see:
   👁️  Watching: channel.md for messages
   ```

3. **Test communication**
   ```bash
   orchestrator> broadcast test message
   # All agents should acknowledge
   ```

---

### 🐛 Node.js / NPM Issues

**Symptom**: npm install fails, module not found errors

**Solutions**:

1. **Check Node version**
   ```bash
   node --version  # Should be 14.x or higher
   npm --version   # Should be 6.x or higher
   ```

2. **Clean install**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

3. **Install specific missing module**
   ```bash
   npm install chokidar  # If file watching fails
   npm install js-yaml   # If YAML parsing fails
   npm install chalk     # If colors missing
   ```

---

### 🔍 Debugging Techniques

#### 1. **Enable Debug Mode**
```bash
# In orchestrator
orchestrator> debug on
# Shows detailed logs
```

#### 2. **Check Individual Agent Logs**
```bash
# Each agent shows its activity
# Look for error messages in red
```

#### 3. **Monitor Channel Manually**
```bash
# Keep channel.md open in editor
# Watch for communication patterns
tail -f .workflow/context/channel.md
```

#### 4. **Test Minimal Setup**
```bash
# Try with just 2 agents first
/multi-agent
# Select "Minimal (3 agents)"
```

---

### 🆘 Emergency Recovery

**When everything seems broken:**

1. **Full Reset**
   ```bash
   # Stop all agents (Ctrl+C in each terminal)
   rm -rf .workflow/
   npm install
   /multi-agent  # Start fresh
   ```

2. **Single Agent Fallback**
   ```bash
   # Skip multi-agent, use traditional:
   /vibe-init test-project
   /vibe-step-1-ideation
   ```

3. **Manual Testing**
   ```bash
   # Test basic functionality
   node multi-agent/examples/simple-feature.js
   ```

---

### 💡 Pro Tips for Avoiding Issues

1. **Always copy exact commands** - Quotes and flags matter!
2. **Start with fewer agents** - 3-4 is easier than 8
3. **Keep channel.md visible** - See what's happening
4. **Use status frequently** - Check agent health
5. **Read error messages** - They usually explain the issue

---

### 📞 Getting Help

If issues persist:

1. **Check existing documentation**
   - [USER-GUIDE.md](./USER-GUIDE.md)
   - [Multi-Agent README](../multi-agent/README.md)

2. **Run diagnostics**
   ```bash
   npm run doctor
   ```

3. **Create detailed issue report**
   - What command failed?
   - What was the exact error?
   - What's your setup? (OS, Node version)
   - Can you reproduce it?

4. **Community Support**
   - GitHub Issues
   - Discord/Slack community
   - Stack Overflow with tag

---

## Quick Reference Card

### Most Common Fixes

| Problem | Quick Fix |
|---------|-----------|
| Command not found | Add `/` prefix |
| Agent not connecting | Check `--terminal-id=X` |
| No channel updates | Create `.workflow/context/` |
| Workflow not found | Run `workflow list` |
| Task not assigned | Check agent `status` |
| File not created | Check permissions |
| Module errors | Run `npm install` |

### Essential Commands

```bash
# Check everything
orchestrator> status
orchestrator> channel show
orchestrator> help

# Test communication  
orchestrator> test
orchestrator> broadcast hello

# Reset if needed
rm -rf .workflow/
/multi-agent
```

Remember: The system is designed to be resilient. Most issues are simple syntax or setup problems!