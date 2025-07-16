/**
 * Vibe Task Router
 * 
 * Advanced task analysis and intelligent routing for Vibe Coding multi-agent system
 * Provides smart task breakdown, complexity analysis, and optimal agent assignment
 */

import { VibeContextManager } from './vibe-context-manager.js';
import { VibeAgentRouter } from './vibe-agent-router.js';

export class VibeTaskRouter {
  constructor(storage = null) {
    this.contextManager = new VibeContextManager(storage);
    this.agentRouter = new VibeAgentRouter();
    
    // Task complexity indicators
    this.complexityPatterns = {
      // High complexity indicators
      high: [
        /multi.*agent|orchestrat|coordin/i,
        /ultrathink|5.*agent/i,
        /architecture|design.*system/i,
        /integrate.*multiple|cross.*system/i,
        /refactor.*entire|complete.*rewrite/i,
        /analyze.*codebase|deep.*analysis/i
      ],
      
      // Medium complexity indicators  
      medium: [
        /implement.*feature|add.*functionality/i,
        /step.*\d+|phase.*\d+/i,
        /vertical.*slice|universal.*format/i,
        /validate.*implementation|qa.*check/i,
        /ui.*healing|browser.*testing/i,
        /database.*design|api.*specification/i
      ],
      
      // Low complexity indicators
      low: [
        /fix.*bug|simple.*fix/i,
        /update.*documentation|add.*comment/i,
        /test.*single|unit.*test/i,
        /format.*code|lint.*check/i,
        /status.*check|health.*check/i
      ]
    };
    
    // Task categories with required capabilities
    this.taskCategories = {
      'research-analysis': {
        patterns: [/research|analyze|investigate|study|explore/i],
        requiredCapabilities: ['Context7', 'Perplexity', 'analysis'],
        preferredAgents: ['research-agent', 'ultrathink-coordinator'],
        vibeSteps: ['step-1', 'step-2', 'step-6']
      },
      
      'architecture-design': {
        patterns: [/architect|design|structure|plan.*system/i],
        requiredCapabilities: ['architecture', 'technical-planning', 'Context7'],
        preferredAgents: ['ultrathink-coordinator', 'step-2-agent'],
        vibeSteps: ['step-2', 'step-6']
      },
      
      'implementation': {
        patterns: [/implement|create|build|develop|code/i],
        requiredCapabilities: ['coding', 'implementation'],
        preferredAgents: ['coding-agent', 'step-8-agent'],
        vibeSteps: ['step-8', 'step-10']
      },
      
      'validation-testing': {
        patterns: [/test|validate|verify|check|qa/i],
        requiredCapabilities: ['testing', 'validation', 'quality-assurance'],
        preferredAgents: ['validation-agent', 'testing-agent'],
        vibeSteps: ['all']
      },
      
      'ui-frontend': {
        patterns: [/ui|frontend|interface|design.*system|component/i],
        requiredCapabilities: ['ui-development', 'frontend', 'shadcn-ui'],
        preferredAgents: ['ui-healer-agent', 'frontend-agent'],
        vibeSteps: ['step-3', 'step-4', 'step-5']
      },
      
      'phase-coordination': {
        patterns: [/phase|vertical.*slice|universal.*format/i],
        requiredCapabilities: ['phase-generation', 'universal-format'],
        preferredAgents: ['step-8-agent', 'ultrathink-coordinator'],
        vibeSteps: ['step-8']
      },
      
      'multi-agent-orchestration': {
        patterns: [/ultrathink|orchestrat|multi.*agent|coordinate.*team/i],
        requiredCapabilities: ['5-agent-coordination', 'orchestration'],
        preferredAgents: ['ultrathink-coordinator'],
        vibeSteps: ['all']
      }
    };
    
    // Dependencies between Vibe steps
    this.stepDependencies = {
      'step-1': [],
      'step-2': ['step-1'],
      'step-3': ['step-1', 'step-2'],
      'step-4': ['step-1', 'step-2', 'step-3'],
      'step-5': ['step-1', 'step-2', 'step-3', 'step-4'],
      'step-6': ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'],
      'step-7': ['step-6'],
      'step-8': ['step-6'],
      'step-9': ['step-6'],
      'step-10': ['step-2', 'step-6']
    };
  }

  async initialize() {
    await this.contextManager.initialize();
    await this.agentRouter.initialize();
    console.error("🎯 Vibe Task Router initialized");
  }

  // Advanced task analysis and routing
  async analyzeAndRouteTask(taskDescription, options = {}) {
    // 1. Analyze task complexity and category
    const analysis = await this.analyzeTask(taskDescription, options);
    
    // 2. Get current project context
    const projectContext = await this.contextManager.getProjectStatus();
    
    // 3. Find optimal agents for the task
    const agentRecommendations = await this.findOptimalAgents(analysis, projectContext);
    
    // 4. Create execution plan
    const executionPlan = await this.createExecutionPlan(analysis, agentRecommendations, projectContext);
    
    // 5. Generate coordination strategy
    const coordinationStrategy = await this.generateCoordinationStrategy(executionPlan, projectContext);
    
    return {
      taskAnalysis: analysis,
      agentRecommendations,
      executionPlan,
      coordinationStrategy,
      projectContext: {
        currentStep: projectContext.currentStep,
        currentPhase: projectContext.currentPhase,
        readiness: this.assessTaskReadiness(analysis, projectContext)
      }
    };
  }

  async analyzeTask(taskDescription, options = {}) {
    const analysis = {
      originalTask: taskDescription,
      complexity: this.assessComplexity(taskDescription),
      categories: this.categorizeTask(taskDescription),
      vibeStepRelevance: this.assessVibeStepRelevance(taskDescription),
      mcpRequirements: this.identifyMCPRequirements(taskDescription),
      estimatedDuration: this.estimateDuration(taskDescription),
      prerequisites: this.identifyPrerequisites(taskDescription),
      deliverables: this.identifyDeliverables(taskDescription)
    };
    
    // Enhanced analysis with context awareness
    analysis.contextualFactors = {
      urgency: options.priority || this.assessUrgency(taskDescription),
      scope: this.assessScope(taskDescription),
      riskLevel: this.assessRisk(taskDescription),
      collaboration: this.assessCollaborationNeeds(taskDescription)
    };
    
    return analysis;
  }

  assessComplexity(task) {
    const taskLower = task.toLowerCase();
    
    for (const [level, patterns] of Object.entries(this.complexityPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(taskLower)) {
          return level;
        }
      }
    }
    
    // Default complexity based on task length and keywords
    const complexityKeywords = taskLower.split(/\\s+/).length;
    if (complexityKeywords > 20) return 'high';
    if (complexityKeywords > 10) return 'medium';
    return 'low';
  }

  categorizeTask(task) {
    const categories = [];
    const taskLower = task.toLowerCase();
    
    for (const [category, config] of Object.entries(this.taskCategories)) {
      for (const pattern of config.patterns) {
        if (pattern.test(taskLower)) {
          categories.push({
            category,
            confidence: this.calculatePatternConfidence(taskLower, config.patterns),
            ...config
          });
          break;
        }
      }
    }
    
    return categories.length > 0 ? categories : [{
      category: 'general',
      confidence: 0.5,
      patterns: [],
      requiredCapabilities: ['general-purpose'],
      preferredAgents: ['general-agent'],
      vibeSteps: ['current']
    }];
  }

  calculatePatternConfidence(task, patterns) {
    let matchCount = 0;
    for (const pattern of patterns) {
      if (pattern.test(task)) matchCount++;
    }
    return Math.min(matchCount / patterns.length + 0.3, 1.0);
  }

  assessVibeStepRelevance(task) {
    const relevance = {};
    const taskLower = task.toLowerCase();
    
    // Direct step mentions
    for (let i = 1; i <= 10; i++) {
      const stepPattern = new RegExp(`step.?${i}|${i}.*step`, 'i');
      if (stepPattern.test(taskLower)) {
        relevance[`step-${i}`] = 1.0;
      }
    }
    
    // Content-based relevance
    const stepKeywords = {
      'step-1': ['ideation', 'specification', 'market', 'research'],
      'step-2': ['architecture', 'technical', 'planning', 'design'],
      'step-3': ['ux', 'user', 'experience', 'interface'],
      'step-4': ['design', 'system', 'component', 'tokens'],
      'step-5': ['interface', 'states', 'state', 'management'],
      'step-6': ['technical', 'specification', 'implementation'],
      'step-7': ['landing', 'page', 'copy', 'marketing'],
      'step-8': ['vertical', 'slice', 'phase', 'universal'],
      'step-9': ['claude', 'configuration', 'setup'],
      'step-10': ['service', 'deployment', 'automation']
    };
    
    for (const [step, keywords] of Object.entries(stepKeywords)) {
      if (!relevance[step]) {
        const keywordMatches = keywords.filter(keyword => 
          taskLower.includes(keyword.toLowerCase())
        ).length;
        relevance[step] = keywordMatches / keywords.length;
      }
    }
    
    return relevance;
  }

  identifyMCPRequirements(task) {
    const requirements = [];
    const taskLower = task.toLowerCase();
    
    const mcpPatterns = {
      'Context7': [/documentation|research|library|framework|context7/i],
      'Perplexity': [/market.*research|best.*practices|trends|perplexity/i],
      'Sequential Thinking': [/planning|complex.*analysis|step.*by.*step|sequential/i],
      'TaskMaster': [/task.*management|complex.*task|breakdown/i],
      'Shadcn UI': [/ui.*component|design.*system|shadcn/i],
      'Playwright': [/browser.*test|ui.*test|automation/i]
    };
    
    for (const [mcp, patterns] of Object.entries(mcpPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(taskLower)) {
          requirements.push(mcp);
          break;
        }
      }
    }
    
    return requirements;
  }

  estimateDuration(task) {
    const complexity = this.assessComplexity(task);
    const categories = this.categorizeTask(task);
    
    const baseDurations = {
      'low': 15,      // 15 minutes
      'medium': 45,   // 45 minutes
      'high': 120     // 2 hours
    };
    
    let duration = baseDurations[complexity] || 30;
    
    // Adjust for specific categories
    if (categories.some(cat => cat.category === 'multi-agent-orchestration')) {
      duration *= 1.5;
    }
    
    if (categories.some(cat => cat.category === 'research-analysis')) {
      duration *= 1.3;
    }
    
    return {
      estimated: duration,
      unit: 'minutes',
      confidence: 0.7
    };
  }

  identifyPrerequisites(task) {
    const prerequisites = [];
    const categories = this.categorizeTask(task);
    
    for (const category of categories) {
      if (category.vibeSteps && category.vibeSteps[0] !== 'all') {
        for (const step of category.vibeSteps) {
          const deps = this.stepDependencies[step] || [];
          prerequisites.push(...deps);
        }
      }
    }
    
    return [...new Set(prerequisites)];
  }

  identifyDeliverables(task) {
    const deliverables = [];
    const taskLower = task.toLowerCase();
    
    const deliverablePatterns = {
      'documentation': /document|spec|readme|guide/i,
      'code': /implement|create|build|develop/i,
      'analysis': /analyze|research|investigate/i,
      'design': /design|wireframe|mockup/i,
      'test': /test|validate|verify/i,
      'phase': /phase|slice|universal.*format/i
    };
    
    for (const [type, pattern] of Object.entries(deliverablePatterns)) {
      if (pattern.test(taskLower)) {
        deliverables.push(type);
      }
    }
    
    return deliverables;
  }

  assessUrgency(task) {
    const urgencyPatterns = {
      'urgent': [/urgent|asap|immediately|critical|emergency/i],
      'high': [/high.*priority|important|soon|deadline/i],
      'normal': [/normal|standard|regular/i],
      'low': [/low.*priority|when.*convenient|eventually/i]
    };
    
    const taskLower = task.toLowerCase();
    for (const [level, patterns] of Object.entries(urgencyPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(taskLower)) {
          return level;
        }
      }
    }
    
    return 'normal';
  }

  assessScope(task) {
    const taskLower = task.toLowerCase();
    
    if (/entire.*system|complete.*rewrite|full.*implementation/i.test(taskLower)) {
      return 'system-wide';
    }
    if (/multiple.*components|cross.*module|several.*files/i.test(taskLower)) {
      return 'multi-component';
    }
    if (/single.*component|one.*file|specific.*function/i.test(taskLower)) {
      return 'single-component';
    }
    
    return 'moderate';
  }

  assessRisk(task) {
    const riskPatterns = {
      'high': [/refactor.*entire|delete|remove.*all|breaking.*change/i],
      'medium': [/modify.*existing|update.*core|change.*api/i],
      'low': [/add.*new|create.*additional|enhance.*existing/i]
    };
    
    const taskLower = task.toLowerCase();
    for (const [level, patterns] of Object.entries(riskPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(taskLower)) {
          return level;
        }
      }
    }
    
    return 'low';
  }

  assessCollaborationNeeds(task) {
    const taskLower = task.toLowerCase();
    
    if (/multi.*agent|orchestrat|coordinate|team/i.test(taskLower)) {
      return 'high';
    }
    if (/integrate|connect|combine|merge/i.test(taskLower)) {
      return 'medium';
    }
    
    return 'low';
  }

  async findOptimalAgents(analysis, projectContext) {
    const recommendations = [];
    
    // Get all active agents
    const activeAgents = projectContext.activeAgents || [];
    
    for (const category of analysis.categories) {
      for (const agentName of category.preferredAgents) {
        const agent = activeAgents.find(a => a.agent_id === agentName);
        if (agent) {
          const score = await this.calculateAgentScore(agent, analysis, projectContext);
          recommendations.push({
            agent: agent.agent_id,
            profile: agent.profile,
            score,
            category: category.category,
            reasoning: this.generateAgentReasoning(agent, analysis, category, score)
          });
        }
      }
    }
    
    // Also check for agents via context manager
    const contextMatches = await this.contextManager.findVibeAgentsForTask(
      analysis.originalTask,
      {
        requiredSteps: Object.keys(analysis.vibeStepRelevance).filter(step => 
          analysis.vibeStepRelevance[step] > 0.5
        ),
        preferredCapabilities: analysis.categories.flatMap(cat => cat.requiredCapabilities)
      }
    );
    
    recommendations.push(...contextMatches);
    
    // Remove duplicates and sort by score
    const uniqueRecommendations = recommendations.reduce((acc, rec) => {
      const existing = acc.find(r => r.agent === rec.agent);
      if (!existing || rec.score > existing.score) {
        acc = acc.filter(r => r.agent !== rec.agent);
        acc.push(rec);
      }
      return acc;
    }, []);
    
    return uniqueRecommendations.sort((a, b) => b.score - a.score);
  }

  async calculateAgentScore(agent, analysis, projectContext) {
    let score = 0;
    const profile = agent.profile;
    
    // Complexity match
    if (analysis.complexity === 'high' && profile.capabilities?.includes('5-agent-coordination')) {
      score += 5;
    } else if (analysis.complexity === 'medium' && profile.vibeSteps?.length > 0) {
      score += 3;
    } else if (analysis.complexity === 'low') {
      score += 2;
    }
    
    // Category match
    for (const category of analysis.categories) {
      if (category.preferredAgents.includes(agent.agent_id)) {
        score += 4 * category.confidence;
      }
      
      // Capability match
      for (const capability of category.requiredCapabilities) {
        if (profile.capabilities?.includes(capability)) {
          score += 2;
        }
      }
    }
    
    // Step relevance
    for (const [step, relevance] of Object.entries(analysis.vibeStepRelevance)) {
      if (relevance > 0.5 && profile.vibeSteps?.includes(step)) {
        score += 3 * relevance;
      }
    }
    
    // Current step bonus
    if (profile.vibeSteps?.includes(`step-${projectContext.currentStep}`)) {
      score += 2;
    }
    
    return Math.round(score * 10) / 10;
  }

  generateAgentReasoning(agent, analysis, category, score) {
    const reasons = [];
    const profile = agent.profile;
    
    if (score >= 8) {
      reasons.push("🎯 Excellent match - optimal capabilities and experience");
    } else if (score >= 5) {
      reasons.push("✅ Good match - suitable capabilities");
    } else if (score >= 2) {
      reasons.push("⚠️ Partial match - some relevant capabilities");
    } else {
      reasons.push("❌ Poor match - limited relevant capabilities");
    }
    
    if (category.category === 'multi-agent-orchestration') {
      reasons.push("🎭 Multi-agent coordination expertise");
    }
    
    if (profile.vibeSteps?.length > 0) {
      reasons.push(`📋 Vibe steps: ${profile.vibeSteps.join(', ')}`);
    }
    
    if (analysis.complexity === 'high' && profile.capabilities?.includes('5-agent-coordination')) {
      reasons.push("🧠 Complex task analysis capabilities");
    }
    
    return reasons;
  }

  async createExecutionPlan(analysis, agentRecommendations, projectContext) {
    const plan = {
      phases: [],
      totalEstimatedTime: analysis.estimatedDuration.estimated,
      parallelizable: this.assessParallelization(analysis),
      criticalPath: [],
      dependencies: analysis.prerequisites
    };
    
    // Create phases based on task complexity and categories
    if (analysis.complexity === 'high' || analysis.categories.some(cat => 
      cat.category === 'multi-agent-orchestration')) {
      
      // Multi-phase execution for complex tasks
      plan.phases = [
        {
          name: 'Analysis & Planning',
          agents: agentRecommendations.filter(agent => 
            agent.profile.capabilities?.includes('analysis') || 
            agent.profile.capabilities?.includes('5-agent-coordination')
          ).slice(0, 2),
          estimatedTime: Math.ceil(analysis.estimatedDuration.estimated * 0.3),
          deliverables: ['Task breakdown', 'Implementation plan', 'Resource requirements']
        },
        {
          name: 'Implementation',
          agents: agentRecommendations.filter(agent => 
            agent.profile.capabilities?.includes('implementation') ||
            agent.profile.capabilities?.includes('coding')
          ).slice(0, 3),
          estimatedTime: Math.ceil(analysis.estimatedDuration.estimated * 0.6),
          deliverables: analysis.deliverables.filter(d => ['code', 'phase', 'design'].includes(d))
        },
        {
          name: 'Validation & Integration',
          agents: agentRecommendations.filter(agent => 
            agent.profile.capabilities?.includes('validation') ||
            agent.profile.capabilities?.includes('testing')
          ).slice(0, 2),
          estimatedTime: Math.ceil(analysis.estimatedDuration.estimated * 0.1),
          deliverables: ['Validation report', 'Quality assurance', 'Integration confirmation']
        }
      ];
    } else {
      // Single phase execution for simpler tasks
      plan.phases = [
        {
          name: 'Execution',
          agents: agentRecommendations.slice(0, 2),
          estimatedTime: analysis.estimatedDuration.estimated,
          deliverables: analysis.deliverables
        }
      ];
    }
    
    return plan;
  }

  assessParallelization(analysis) {
    // High complexity tasks often benefit from parallel execution
    if (analysis.complexity === 'high') return true;
    
    // Multi-category tasks can often be parallelized
    if (analysis.categories.length > 1) return true;
    
    // Research and implementation can often be done in parallel
    const hasResearch = analysis.categories.some(cat => cat.category === 'research-analysis');
    const hasImplementation = analysis.categories.some(cat => cat.category === 'implementation');
    if (hasResearch && hasImplementation) return true;
    
    return false;
  }

  async generateCoordinationStrategy(executionPlan, projectContext) {
    return {
      communicationPattern: this.determineCommPattern(executionPlan),
      checkpointFrequency: this.determineCheckpointFreq(executionPlan),
      escalationPath: this.createEscalationPath(executionPlan),
      qualityGates: this.defineQualityGates(executionPlan),
      riskMitigation: this.identifyRiskMitigation(executionPlan)
    };
  }

  determineCommPattern(plan) {
    if (plan.phases.length > 1) {
      return 'phase-based-handoffs';
    }
    if (plan.parallelizable) {
      return 'parallel-coordination';
    }
    return 'sequential-updates';
  }

  determineCheckpointFreq(plan) {
    const totalTime = plan.totalEstimatedTime;
    if (totalTime > 120) return 'every-30-minutes';
    if (totalTime > 60) return 'every-20-minutes';
    return 'every-15-minutes';
  }

  createEscalationPath(plan) {
    return [
      'Primary agent self-resolution (5 minutes)',
      'Cross-agent consultation (10 minutes)',
      'UltraThink coordinator intervention (15 minutes)',
      'Human developer escalation (20 minutes)'
    ];
  }

  defineQualityGates(plan) {
    return [
      'Phase completion validation',
      '95% pattern compliance check',
      'Deliverable quality verification',
      'Integration testing (if applicable)'
    ];
  }

  identifyRiskMitigation(plan) {
    return [
      'Regular progress checkpoints',
      'Automated backup before changes',
      'Rollback plan availability',
      'Alternative agent assignments ready'
    ];
  }

  assessTaskReadiness(analysis, projectContext) {
    const readiness = {
      score: 0,
      blockers: [],
      recommendations: []
    };
    
    // Check prerequisites
    for (const prereq of analysis.prerequisites) {
      if (!projectContext.completedSteps?.includes(prereq.replace('step-', ''))) {
        readiness.blockers.push(`Missing prerequisite: ${prereq}`);
      } else {
        readiness.score += 1;
      }
    }
    
    // Check agent availability
    if (projectContext.activeAgents?.length > 0) {
      readiness.score += 2;
    } else {
      readiness.blockers.push('No active agents available');
    }
    
    // Check MCP requirements
    for (const mcp of analysis.mcpRequirements) {
      // This would check actual MCP availability
      readiness.recommendations.push(`Ensure ${mcp} MCP is available`);
    }
    
    readiness.overallReadiness = readiness.blockers.length === 0 ? 'ready' : 'blocked';
    
    return readiness;
  }

  async shutdown() {
    console.error("🎯 Shutting down Vibe Task Router...");
    await this.contextManager.shutdown();
    await this.agentRouter.shutdown();
  }
}

export default VibeTaskRouter;