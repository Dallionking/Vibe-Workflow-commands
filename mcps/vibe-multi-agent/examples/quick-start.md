# Quick Start Guide

Get up and running with the Vibe Multi-Agent system in minutes!

## Installation

```bash
# Navigate to the multi-agent directory
cd /Users/dallionking/Vibe\ Workflow\ commands\ /vibe-coding-claude/mcps/vibe-multi-agent

# Install dependencies
npm install

# Run the installation script
node install-mcps.js
```

## Basic Usage

### 1. Start the Orchestrator

```bash
# Start the orchestrator in the background
./start-orchestrator.sh
```

### 2. Use STOIC for Planning

Open Claude Code and use the STOIC MCP:

```bash
claude
```

Then in Claude:

```
@vibe-stoic "Build a task management SaaS application with React frontend, Node.js backend, PostgreSQL database, user authentication, team collaboration features, and subscription billing"
```

### 3. Spawn Agents Automatically

The STOIC MCP will automatically:
1. Analyze your requirements
2. Design the architecture
3. Break down tasks
4. Spawn specialized agents
5. Begin parallel development

### 4. Monitor Progress

Check the orchestrator dashboard:
```
http://localhost:8080/status
```

Or check status via MCP:
```
@vibe-orchestrator get_project_status
```

## Example Projects

### Simple Blog
```
@vibe-stoic "Create a personal blog with Markdown posts, authentication, and comments"
```

### E-commerce Store
```
@vibe-stoic "Build an e-commerce store with product catalog, shopping cart, payment processing, and admin dashboard"
```

### Social Media App
```
@vibe-stoic "Create a social media application with user profiles, posts, likes, comments, and real-time chat"
```

### SaaS Dashboard
```
@vibe-stoic "Build a SaaS analytics dashboard with user management, data visualization, subscription billing, and API access"
```

## Advanced Usage

### Custom Agent Configuration

```javascript
// Spawn specific agents
@vibe-orchestrator spawn_agents {
  "project_description": "Custom project",
  "agent_roles": ["frontend", "backend", "testing"],
  "tasks": [
    {
      "title": "Setup authentication",
      "description": "Implement JWT authentication",
      "domain": "backend",
      "priority": "high"
    }
  ]
}
```

### Manual Task Distribution

```javascript
// Assign task to specific agent
@vibe-orchestrator distribute_task {
  "task_id": "task_123",
  "agent_id": "agent_frontend_456",
  "priority": 1
}
```

### Merge Agent Work

```javascript
// Merge completed work
@vibe-orchestrator merge_agent_work {
  "agent_ids": ["agent_frontend_456", "agent_backend_789"],
  "strategy": "merge"
}
```

## Troubleshooting

### Orchestrator Won't Start
```bash
# Check if port is in use
lsof -i :8080

# Stop existing orchestrator
./stop-orchestrator.sh

# Restart
./start-orchestrator.sh
```

### MCP Not Found
```bash
# Check MCP installation
claude mcp list

# Reinstall if needed
node install-mcps.js
```

### Agent Spawn Failure
```bash
# Check Claude Code installation
claude --version

# Verify git repository
git status

# Check permissions
chmod +x start-orchestrator.sh
```

## Tips for Success

1. **Start Simple**: Begin with basic projects to understand the workflow
2. **Be Specific**: Provide detailed requirements for better results
3. **Monitor Progress**: Use the dashboard to track agent activity
4. **Review Architecture**: Check the STOIC plan before proceeding
5. **Test Incrementally**: Let agents complete tasks before adding more

## Next Steps

Once you're comfortable with the basics:
- Explore advanced configuration options
- Customize agent roles and capabilities
- Integrate with your existing development workflow
- Contribute to the project on GitHub

Happy coding with your AI development team! 🚀