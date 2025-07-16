/**
 * Vibe Context Manager
 * 
 * Enhanced context management for Vibe Coding multi-agent system
 * Implements advanced memory strategies with Vibe methodology awareness
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { VibeStorageManager } from './vibe-storage-manager.js';

export class VibeContextManager {
  constructor(storage = null) {
    this.storage = storage || new VibeStorageManager();
    this.projectRoot = process.cwd();
    this.vibeConfigPath = path.join(this.projectRoot, '.vibe');
    this.contextCachePath = path.join(this.projectRoot, '.context-cache');
    
    // Vibe-specific memory type weights
    this.memoryWeights = {
      procedural: 3.0,    // Vibe methodology knowledge
      project: 2.5,       // Project-specific context
      phase: 2.0,         // Phase implementation details
      context: 1.5,       // Advanced Context Features
      scratch: 0.5        // Temporary working memory
    };
    
    // Vibe step specializations
    this.vibeStepCapabilities = {
      'step-1': ['ideation', 'market-research', 'Context7', 'Perplexity'],
      'step-2': ['architecture', 'technical-planning', 'Context7', 'Perplexity'],
      'step-3': ['ux-design', 'user-experience', 'Context7'],
      'step-4': ['design-system', 'ui-components'],
      'step-5': ['interface-states', 'state-management'],
      'step-6': ['technical-spec', 'Context7', 'Perplexity', 'Sequential Thinking'],
      'step-7': ['landing-page', 'copywriting', 'Perplexity'],
      'step-8': ['vertical-slices', 'universal-format', 'Context7', 'Perplexity', 'TaskMaster'],
      'step-9': ['claude-md', 'configuration', 'Sequential Thinking'],
      'step-10': ['service-init', 'automation', 'All project MCPs']
    };
  }

  async initialize() {
    // Ensure directories exist
    for (const dir of [this.vibeConfigPath, this.contextCachePath]) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }
    
    // Load current project state
    await this.loadProjectState();
    
    console.error("🧠 Vibe Context Manager initialized");
  }

  async loadProjectState() {
    try {
      // Read .vibe-status.md if exists
      const statusPath = path.join(this.projectRoot, '.vibe-status.md');
      if (existsSync(statusPath)) {
        const status = await readFile(statusPath, 'utf8');
        this.projectState = this.parseVibeStatus(status);
      } else {
        this.projectState = {
          currentStep: 'initialization',
          currentPhase: null,
          completedSteps: [],
          features: []
        };
      }
      
      // Update storage with current state
      if (this.storage.db) {
        await this.storage.updateProjectContext(
          this.projectState.currentStep,
          this.projectState.currentPhase,
          this.projectState
        );
      }
    } catch (error) {
      console.error("⚠️ Could not load project state:", error.message);
      this.projectState = { currentStep: 'initialization' };
    }
  }

  parseVibeStatus(statusContent) {
    const state = {
      currentStep: 'initialization',
      currentPhase: null,
      completedSteps: [],
      features: []
    };
    
    // Extract current step
    const stepMatch = statusContent.match(/current.*step[:\s]+(\d+|[\w-]+)/i);
    if (stepMatch) {
      state.currentStep = stepMatch[1];
    }
    
    // Extract current phase
    const phaseMatch = statusContent.match(/current.*phase[:\s]+([\w-]+)/i);
    if (phaseMatch) {
      state.currentPhase = phaseMatch[1];
    }
    
    // Extract completed steps
    const completedMatches = statusContent.match(/✅.*step[:\s]*(\d+)/gi);
    if (completedMatches) {
      state.completedSteps = completedMatches.map(match => {
        const stepNum = match.match(/(\d+)/);
        return stepNum ? stepNum[1] : null;
      }).filter(Boolean);
    }
    
    return state;
  }

  // Enhanced agent registration with Vibe capabilities
  async registerVibeAgent(agentId, profile) {
    // Enhance profile with Vibe-specific capabilities
    const enhancedProfile = await this.enhanceAgentProfile(agentId, profile);
    
    // Register with storage
    const registration = await this.storage.registerAgent(agentId, enhancedProfile);
    
    // Initialize agent memory
    await this.initializeAgentMemory(agentId, enhancedProfile);
    
    return { ...registration, profile: enhancedProfile };
  }

  async enhanceAgentProfile(agentId, profile) {
    const enhanced = { ...profile };
    
    // Auto-detect Vibe capabilities based on agent name
    if (agentId.includes('step-')) {
      const stepNum = agentId.match(/step-(\d+)/)?.[1];
      if (stepNum && this.vibeStepCapabilities[`step-${stepNum}`]) {
        enhanced.vibeSteps = enhanced.vibeSteps || [];
        enhanced.vibeSteps.push(`step-${stepNum}`);
        enhanced.capabilities = enhanced.capabilities || [];
        enhanced.capabilities.push(...this.vibeStepCapabilities[`step-${stepNum}`]);
      }
    }
    
    // Detect UltraThink capabilities
    if (agentId.includes('ultrathink') || agentId.includes('orchestrator')) {
      enhanced.capabilities = enhanced.capabilities || [];
      enhanced.capabilities.push('5-agent-coordination', 'codebase-indexing', 'pattern-analysis');
      enhanced.specializations = enhanced.specializations || [];
      enhanced.specializations.push('multi-agent-orchestration', 'advanced-planning');
    }
    
    // Detect validation capabilities
    if (agentId.includes('validation') || agentId.includes('qa') || agentId.includes('test')) {
      enhanced.capabilities = enhanced.capabilities || [];
      enhanced.capabilities.push('code-validation', 'pattern-compliance', 'quality-assurance');
    }
    
    enhanced.registeredAt = Date.now();
    enhanced.vibeVersion = '2.1.0';
    
    return enhanced;
  }

  async initializeAgentMemory(agentId, profile) {
    // Initialize procedural memory with Vibe methodology
    const proceduralMemory = {
      vibeSteps: this.vibeStepCapabilities,
      methodology: await this.loadVibeMethodology(),
      agentSpecializations: profile.vibeSteps || [],
      capabilities: profile.capabilities || []
    };
    
    await this.saveVibeAgentMemory(agentId, 'procedural', proceduralMemory);
    
    // Initialize project memory with current state
    await this.saveVibeAgentMemory(agentId, 'project', this.projectState);
  }

  async loadVibeMethodology() {
    try {
      // Try to load from CLAUDE.md
      const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
      if (existsSync(claudeMdPath)) {
        const content = await readFile(claudeMdPath, 'utf8');
        return {
          source: 'CLAUDE.md',
          methodology: this.extractMethodologyFromClaudeMd(content),
          lastUpdated: Date.now()
        };
      }
      
      // Fallback to default Vibe methodology
      return {
        source: 'default',
        methodology: this.getDefaultVibeMethodology(),
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error("⚠️ Could not load Vibe methodology:", error.message);
      return { source: 'error', methodology: {}, lastUpdated: Date.now() };
    }
  }

  extractMethodologyFromClaudeMd(content) {
    const methodology = {};
    
    // Extract core principles
    const principlesMatch = content.match(/## Core Principles\s*([\s\S]*?)(?=##|$)/);
    if (principlesMatch) {
      methodology.corePrinciples = principlesMatch[1].trim();
    }
    
    // Extract step information
    const stepsMatch = content.match(/### (\d+)-Step Development Process\s*([\s\S]*?)(?=###|##|$)/);
    if (stepsMatch) {
      methodology.developmentProcess = stepsMatch[0];
    }
    
    return methodology;
  }

  getDefaultVibeMethodology() {
    return {
      corePrinciples: [
        "Systematic Development - Follow the 10-step Vibe Coding methodology exactly",
        "Quality Standards - Enforce 95%+ test coverage and Universal Format compliance",
        "Context Preservation - Maintain project state across all steps",
        "MCP Integration - Leverage Context7, Perplexity, and other tools systematically"
      ],
      steps: Object.keys(this.vibeStepCapabilities),
      qualityStandards: {
        testCoverage: 0.95,
        universalFormatCompliance: true,
        patternCompliance: 0.95
      }
    };
  }

  // Enhanced memory management with Vibe context
  async saveVibeAgentMemory(agentId, memoryType, content, context = {}) {
    const enhancedContext = {
      ...context,
      step: context.step || this.projectState.currentStep,
      phase: context.phase || this.projectState.currentPhase,
      timestamp: Date.now()
    };
    
    const result = await this.storage.saveAgentMemory(agentId, memoryType, content, enhancedContext);
    
    // Update utility score based on Vibe importance
    await this.updateMemoryUtility(agentId, memoryType, enhancedContext);
    
    return result;
  }

  async loadVibeAgentMemory(agentId, memoryType, context = {}) {
    const memory = await this.storage.loadAgentMemory(agentId, memoryType, context);
    
    if (!memory) return null;
    
    // Enhance with current project context if needed
    if (memoryType === 'project') {
      memory.content = {
        ...memory.content,
        currentProjectState: this.projectState
      };
    }
    
    return memory;
  }

  async updateMemoryUtility(agentId, memoryType, context) {
    const baseUtility = this.memoryWeights[memoryType] || 1.0;
    
    // Boost utility for current step/phase context
    let contextBoost = 1.0;
    if (context.step === this.projectState.currentStep) {
      contextBoost += 0.5;
    }
    if (context.phase === this.projectState.currentPhase) {
      contextBoost += 0.3;
    }
    
    const utilityScore = baseUtility * contextBoost;
    
    // Update in database (would need to modify storage schema)
    // For now, we'll track this in memory
    return utilityScore;
  }

  // Agent matching for Vibe tasks
  async findVibeAgentsForTask(task, requirements = {}) {
    const activeAgents = await this.storage.getActiveAgents();
    const matches = [];
    
    for (const agent of activeAgents) {
      const score = await this.calculateVibeMatchScore(agent, task, requirements);
      if (score > 0) {
        matches.push({
          agent: agent.agent_id,
          profile: agent.profile,
          score,
          reasoning: this.generateMatchReasoning(agent, task, requirements, score)
        });
      }
    }
    
    return matches.sort((a, b) => b.score - a.score);
  }

  async calculateVibeMatchScore(agent, task, requirements) {
    let score = 0;
    const profile = agent.profile;
    
    // Vibe step matching
    if (requirements.requiredSteps && profile.vibeSteps) {
      for (const step of requirements.requiredSteps) {
        if (profile.vibeSteps.includes(step)) {
          score += 3;
        }
      }
    }
    
    // Capability matching
    if (requirements.preferredCapabilities && profile.capabilities) {
      for (const capability of requirements.preferredCapabilities) {
        if (profile.capabilities.includes(capability)) {
          score += 2;
        }
      }
    }
    
    // Task content analysis
    const taskLower = task.toLowerCase();
    
    // UltraThink tasks
    if (taskLower.includes('ultrathink') || taskLower.includes('planning') || taskLower.includes('analyze')) {
      if (profile.capabilities?.includes('5-agent-coordination')) {
        score += 4;
      }
    }
    
    // Step-specific tasks
    for (let i = 1; i <= 10; i++) {
      if (taskLower.includes(`step ${i}`) || taskLower.includes(`step-${i}`)) {
        if (profile.vibeSteps?.includes(`step-${i}`)) {
          score += 5;
        }
      }
    }
    
    // Validation tasks
    if (taskLower.includes('validate') || taskLower.includes('test') || taskLower.includes('qa')) {
      if (profile.capabilities?.includes('code-validation')) {
        score += 3;
      }
    }
    
    // Current step relevance boost
    if (profile.vibeSteps?.includes(`step-${this.projectState.currentStep}`)) {
      score += 1;
    }
    
    return score;
  }

  generateMatchReasoning(agent, task, requirements, score) {
    const reasons = [];
    const profile = agent.profile;
    
    if (profile.vibeSteps?.length > 0) {
      reasons.push(`Specialized in Vibe steps: ${profile.vibeSteps.join(', ')}`);
    }
    
    if (profile.capabilities?.length > 0) {
      reasons.push(`Capabilities: ${profile.capabilities.slice(0, 3).join(', ')}${profile.capabilities.length > 3 ? '...' : ''}`);
    }
    
    if (score >= 5) {
      reasons.push("🎯 Excellent match for this task");
    } else if (score >= 3) {
      reasons.push("✅ Good match for this task");
    } else if (score > 0) {
      reasons.push("⚠️ Partial match for this task");
    }
    
    return reasons;
  }

  // Project status and coordination
  async getProjectStatus(includeMemory = false) {
    const status = {
      currentStep: this.projectState.currentStep,
      currentPhase: this.projectState.currentPhase,
      completedSteps: this.projectState.completedSteps,
      activeAgents: await this.storage.getActiveAgents(),
      timestamp: Date.now()
    };
    
    if (includeMemory) {
      status.agentMemories = {};
      for (const agent of status.activeAgents) {
        const memories = await this.getAgentMemorySummary(agent.agent_id);
        status.agentMemories[agent.agent_id] = memories;
      }
    }
    
    return status;
  }

  async getAgentMemorySummary(agentId) {
    const memoryTypes = ['procedural', 'project', 'phase', 'context', 'scratch'];
    const summary = {};
    
    for (const type of memoryTypes) {
      const memory = await this.loadVibeAgentMemory(agentId, type);
      summary[type] = memory ? {
        exists: true,
        lastAccessed: memory.last_accessed,
        size: JSON.stringify(memory.content).length
      } : { exists: false };
    }
    
    return summary;
  }

  async shutdown() {
    console.error("🧠 Shutting down Vibe Context Manager...");
    // Save any pending context updates
    if (this.projectState) {
      await this.storage.updateProjectContext(
        this.projectState.currentStep,
        this.projectState.currentPhase,
        this.projectState
      );
    }
  }
}

export default VibeContextManager;