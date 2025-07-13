const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class AgentLoader {
    constructor() {
        this.agents = new Map();
        this.agentPaths = [
            path.join(process.cwd(), 'multi-agent', 'agents'),
            path.join(process.cwd(), 'agents'),
            path.join(process.cwd(), '.vibe', 'agents')
        ];
    }

    async loadAgent(agentName) {
        if (this.agents.has(agentName)) {
            return this.agents.get(agentName);
        }

        for (const basePath of this.agentPaths) {
            const agent = await this.loadFromPath(basePath, agentName);
            if (agent) {
                this.agents.set(agentName, agent);
                return agent;
            }
        }

        throw new Error(`Agent '${agentName}' not found in any configured paths`);
    }

    async loadFromPath(basePath, agentName) {
        try {
            // Try YAML format first
            const yamlPath = path.join(basePath, `${agentName}.yaml`);
            try {
                const content = await fs.readFile(yamlPath, 'utf8');
                return this.parseYamlAgent(content, agentName);
            } catch (e) {
                // Continue to try other formats
            }

            // Try MD format
            const mdPath = path.join(basePath, `${agentName}.md`);
            try {
                const content = await fs.readFile(mdPath, 'utf8');
                return this.parseMdAgent(content, agentName);
            } catch (e) {
                // Continue to check subdirectories
            }

            // Check in subdirectories
            const dirs = await fs.readdir(basePath);
            for (const dir of dirs) {
                const subPath = path.join(basePath, dir);
                const stat = await fs.stat(subPath);
                if (stat.isDirectory()) {
                    const agent = await this.loadFromPath(subPath, agentName);
                    if (agent) return agent;
                }
            }
        } catch (e) {
            // Path doesn't exist
        }

        return null;
    }

    parseYamlAgent(content, name) {
        const parsed = yaml.load(content);
        return {
            name: name,
            type: 'yaml',
            config: parsed,
            execute: async (context) => {
                // Implementation will be in agent-executor.js
                const executor = require('./agent-executor');
                return await executor.executeYamlAgent(parsed, context);
            }
        };
    }

    parseMdAgent(content, name) {
        // Extract metadata from markdown frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let metadata = {};
        if (frontmatterMatch) {
            metadata = yaml.load(frontmatterMatch[1]);
        }

        return {
            name: name,
            type: 'markdown',
            metadata: metadata,
            content: content,
            execute: async (context) => {
                // Implementation will be in agent-executor.js
                const executor = require('./agent-executor');
                return await executor.executeMdAgent(content, context);
            }
        };
    }

    async loadAllAgents() {
        const allAgents = new Map();
        
        for (const basePath of this.agentPaths) {
            try {
                await this.loadAgentsFromPath(basePath, allAgents);
            } catch (e) {
                // Path doesn't exist, continue
            }
        }

        return allAgents;
    }

    async loadAgentsFromPath(basePath, agentMap) {
        const entries = await fs.readdir(basePath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(basePath, entry.name);
            
            if (entry.isDirectory()) {
                await this.loadAgentsFromPath(fullPath, agentMap);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                const name = path.basename(entry.name, ext);
                
                if ((ext === '.yaml' || ext === '.yml' || ext === '.md') && !agentMap.has(name)) {
                    try {
                        const agent = await this.loadAgent(name);
                        agentMap.set(name, agent);
                    } catch (e) {
                        console.warn(`Failed to load agent ${name}: ${e.message}`);
                    }
                }
            }
        }
    }

    clearCache() {
        this.agents.clear();
    }
}

module.exports = new AgentLoader();