# MCP Servers Summary from .claude.json

## Total Unique Servers: 16

### 1. NPX-based Servers (using Node Package Manager)

#### **context7**
- **Package**: `@upstash/context7-mcp`
- **Command**: `npx` (or `/opt/homebrew/bin/npx`)
- **Args**: `["-y", "@upstash/context7-mcp", "--transport", "stdio"]`
- **Type**: stdio

#### **gcp**
- **Package**: `gcp-mcp`
- **Command**: `npx` (or `/opt/homebrew/bin/npx`)
- **Args**: `["-y", "gcp-mcp", "--transport", "stdio"]`
- **Type**: stdio

#### **sequential-thinking**
- **Package**: `@modelcontextprotocol/server-sequential-thinking`
- **Command**: `npx`
- **Args**: `["-y", "@modelcontextprotocol/server-sequential-thinking", "--transport", "stdio"]`
- **Type**: stdio

#### **supermemory**
- **Package**: `supergateway`
- **Command**: `npx`
- **Args**: `["-y", "supergateway", "--sse", "https://mcp.supermemory.ai/69KypfM_PMB_HxOk281fy/sse"]`
- **Type**: stdio

#### **playwright**
- **Package**: `@playwright/mcp@latest`
- **Command**: `npx`
- **Args**: `["@playwright/mcp@latest"]`
- **Type**: stdio

### 2. UVX-based Servers (Python Package Manager)

#### **voice-mode**
- **Package**: `voice-mode-mcp`
- **Command**: `uvx`
- **Args**: `["voice-mode-mcp"]`
- **Type**: not specified

#### **perplexity-ask**
- **Package**: `perplexity-mcp`
- **Command**: `uvx`
- **Args**: `["perplexity-mcp", "--transport", "stdio"]`
- **Type**: stdio

#### **mcp-playwright**
- **Package**: `mcp-playwright`
- **Command**: `uvx`
- **Args**: `["mcp-playwright"]`
- **Type**: stdio

#### **web-eval-agent**
- **Package**: `webEvalAgent` (from GitHub)
- **Command**: `uvx`
- **Args**: `["--refresh-package", "webEvalAgent", "--from", "git+https://github.com/Operative-Sh/web-eval-agent.git", "webEvalAgent"]`
- **Type**: stdio

### 3. Local Script-based Servers

#### **messageBus**
- **Script**: `/Volumes/extra-storage/tools/claude-mailbox/bus.js`
- **Command**: `node`
- **Args**: `["/Volumes/extra-storage/tools/claude-mailbox/bus.js", "--transport", "stdio"]`
- **Type**: stdio

#### **project-sql**
- **Script**: `/Volumes/extra-storage/tools/contextAgent/servers/project-sql-mcp/dist/index.js`
- **Command**: `node`
- **Args**: `["/Volumes/extra-storage/tools/contextAgent/servers/project-sql-mcp/dist/index.js"]`
- **Type**: stdio

### 4. Shell Script-based Servers

#### **knowledge-graph**
- **Script**: `/Volumes/extra-storage/tools/contextAgent/scripts/start_knowledge_graph.sh`
- **Command**: `bash`
- **Args**: `["/Volumes/extra-storage/tools/contextAgent/scripts/start_knowledge_graph.sh"]`
- **Type**: stdio

#### **knowledge-graph-mcp**
- **Script**: `/Volumes/extra-storage/tools/contextAgent/scripts/start_knowledge_graph.sh`
- **Command**: Direct script execution
- **Args**: `[]`
- **Type**: stdio

#### **vector-search**
- **Script**: `/Volumes/extra-storage/tools/contextAgent/scripts/start_vector_search.sh`
- **Command**: `bash`
- **Args**: `["/Volumes/extra-storage/tools/contextAgent/scripts/start_vector_search.sh"]`
- **Type**: stdio

#### **vector-search-mcp**
- **Script**: `/Volumes/extra-storage/tools/contextAgent/scripts/start_vector_search.sh`
- **Command**: Direct script execution
- **Args**: `[]`
- **Type**: stdio

#### **project-sql-mcp**
- **Script**: `/Volumes/extra-storage/tools/contextAgent/scripts/start_project_sql.sh`
- **Command**: Direct script execution
- **Args**: `[]`
- **Type**: stdio

## Summary by Category

- **NPX-based servers**: 5 (context7, gcp, sequential-thinking, supermemory, playwright)
- **UVX-based servers**: 4 (voice-mode, perplexity-ask, mcp-playwright, web-eval-agent)
- **Node.js local scripts**: 2 (messageBus, project-sql)
- **Shell scripts**: 5 (knowledge-graph variants, vector-search variants, project-sql-mcp)

## Observations

1. Most servers use the `stdio` transport type for communication
2. Some servers have duplicate entries with slight variations (e.g., knowledge-graph vs knowledge-graph-mcp)
3. The messageBus server appears most frequently across projects (4 occurrences)
4. Context7 appears in 3 different projects
5. Several servers are installed from npm packages using `npx -y` for automatic installation
6. Some servers are local implementations specific to your projects (contextAgent tools)