/**
 * Vibe Agent Router
 * 
 * Intelligent message routing and enhancement for Vibe Coding multi-agent system
 * Provides smart room selection, message enhancement, and agent coordination
 */

export class VibeAgentRouter {
  constructor() {
    // Vibe-specific room routing patterns
    this.vibeRoomPatterns = {
      // Step-specific rooms
      'step-1-ideation': /ideation|market.*research|specification|step.?1/i,
      'step-2-architecture': /architecture|technical.*planning|step.?2/i,
      'step-3-ux': /ux|user.*experience|design|step.?3/i,
      'step-4-design-system': /design.*system|components|tokens|step.?4/i,
      'step-5-interface': /interface.*states|state.*management|step.?5/i,
      'step-6-technical': /technical.*spec|implementation|step.?6/i,
      'step-7-landing': /landing.*page|copywriting|marketing|step.?7/i,
      'step-8-slices': /vertical.*slice|phase|universal.*format|step.?8/i,
      'step-9-claude': /claude\.md|configuration|agent.*setup|step.?9/i,
      'step-10-services': /service.*init|automation|deployment|step.?10/i,
      
      // Phase-specific rooms
      'phase-coordination': /phase.*\d+|phase.*coordination|implementation.*phase/i,
      'phase-validation': /phase.*validation|phase.*testing|phase.*qa/i,
      
      // UltraThink and coordination
      'ultrathink-coordination': /ultrathink|5.*agent|multi.*agent.*planning|orchestrat/i,
      'ultrathink-architect': /architect.*agent|codebase.*index|file.*mapping/i,
      'ultrathink-research': /research.*agent|best.*practices|documentation/i,
      'ultrathink-coder': /coder.*agent|implementation|coding/i,
      'ultrathink-tester': /tester.*agent|testing|coverage|validation/i,
      'ultrathink-context': /context.*agent|pattern.*analysis|team.*convention/i,
      
      // Quality assurance and validation
      'qa-validation': /validation|test.*coverage|quality.*assurance|qa/i,
      'qa-pattern-compliance': /pattern.*compliance|95.*percent|similarity/i,
      'qa-ui-healing': /ui.*healer|ui.*quality|browser.*testing|accessibility/i,
      
      // Status and coordination
      'status-updates': /status|progress|complete|done|finished/i,
      'error-reporting': /error|fail|issue|bug|problem/i,
      'coordination': /coordinate|sync|handoff|next.*step/i,
      
      // Advanced Context Features (Phase 3)
      'context-engineering': /context.*engineering|prp.*system|field.*protocol/i,
      'pattern-recognition': /pattern.*recognition|code.*analysis|similarity/i,
      'token-budget': /token.*budget|memory.*optimization|context.*cache/i
    };
    
    // Priority-based routing
    this.priorityRooms = {
      urgent: 'urgent-coordination',
      high: 'high-priority',
      normal: 'coordination',
      low: 'low-priority'
    };
    
    // Agent-specific routing preferences
    this.agentPreferences = {
      'ultrathink-coordinator': ['ultrathink-coordination', 'status-updates'],
      'step-8-agent': ['step-8-slices', 'phase-coordination'],
      'validation-agent': ['qa-validation', 'qa-pattern-compliance'],
      'ui-healer-agent': ['qa-ui-healing', 'qa-validation']
    };
  }

  async initialize() {
    console.error("🧭 Vibe Agent Router initialized");
  }

  // Intelligent room selection based on Vibe context
  async selectVibeRoom(message, step = null, phase = null, targetAgent = null) {
    const messageLower = message.toLowerCase();
    
    // 1. Check for explicit agent preferences
    if (targetAgent && this.agentPreferences[targetAgent]) {
      for (const preferredRoom of this.agentPreferences[targetAgent]) {
        if (this.matchesRoomPattern(messageLower, preferredRoom)) {
          return preferredRoom;
        }
      }
    }
    
    // 2. Check for step-specific context
    if (step) {
      const stepRoom = `step-${step.replace('step-', '')}`;
      for (const [roomName, pattern] of Object.entries(this.vibeRoomPatterns)) {
        if (roomName.startsWith(stepRoom) && pattern.test(messageLower)) {
          return roomName;
        }
      }
    }
    
    // 3. Check for phase-specific context
    if (phase) {
      const phasePatterns = [
        'phase-coordination',
        'phase-validation'
      ];
      for (const roomName of phasePatterns) {
        if (this.vibeRoomPatterns[roomName].test(messageLower)) {
          return roomName;
        }
      }
    }
    
    // 4. Pattern-based room matching
    for (const [roomName, pattern] of Object.entries(this.vibeRoomPatterns)) {
      if (pattern.test(messageLower)) {
        return roomName;
      }
    }
    
    // 5. Fallback to coordination
    return 'coordination';
  }

  matchesRoomPattern(message, roomName) {
    const pattern = this.vibeRoomPatterns[roomName];
    return pattern ? pattern.test(message) : false;
  }

  // Enhanced message formatting with Vibe context
  async enhanceMessage(message, targetAgent, step = null, phase = null, priority = 'normal') {
    let enhanced = message;
    
    // Add Vibe context prefix
    const contextParts = [];
    if (step) contextParts.push(`Step: ${step}`);
    if (phase) contextParts.push(`Phase: ${phase}`);
    if (priority !== 'normal') contextParts.push(`Priority: ${priority.toUpperCase()}`);
    
    if (contextParts.length > 0) {
      enhanced = `[${contextParts.join(' | ')}] ${enhanced}`;
    }
    
    // Add agent-specific formatting
    enhanced = `🎯 **For ${targetAgent}**: ${enhanced}`;
    
    // Add timestamp for coordination
    const timestamp = new Date().toLocaleTimeString();
    enhanced = `${enhanced}\n\n⏰ *Sent at ${timestamp}*`;
    
    // Add UltraThink coordination hints
    if (targetAgent.includes('ultrathink')) {
      enhanced = `${enhanced}\n\n💡 *UltraThink: Use 5-agent coordination and codebase indexing for optimal results*`;
    }
    
    // Add validation hints
    if (targetAgent.includes('validation') || targetAgent.includes('qa')) {
      enhanced = `${enhanced}\n\n🔍 *QA Note: Ensure 95%+ pattern compliance and comprehensive validation*`;
    }
    
    return enhanced;
  }

  // Format messages for display with Vibe intelligence
  async formatVibeMessages(messages) {
    const formatted = [];
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const index = i + 1;
      
      // Format timestamp
      const timestamp = new Date(msg.ts).toLocaleString('en-US', {
        month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      
      // Extract context information
      const contextInfo = [];
      if (msg.agent) contextInfo.push(`Agent: ${msg.agent}`);
      if (msg.step) contextInfo.push(`Step: ${msg.step}`);
      if (msg.phase) contextInfo.push(`Phase: ${msg.phase}`);
      if (msg.priority && msg.priority !== 'normal') {
        contextInfo.push(`Priority: ${this.formatPriority(msg.priority)}`);
      }
      
      // Create formatted message
      let formattedMsg = `**[${index}]** *${timestamp}*`;
      
      if (contextInfo.length > 0) {
        formattedMsg += ` | ${contextInfo.join(' | ')}`;
      }
      
      formattedMsg += `\n${msg.msg}`;
      
      // Add visual separators for better readability
      if (i < messages.length - 1) {
        formattedMsg += '\n\n---\n';
      }
      
      formatted.push(formattedMsg);
    }
    
    return formatted.join('\n');
  }

  formatPriority(priority) {
    const priorityEmojis = {
      urgent: '🚨 URGENT',
      high: '⚡ HIGH',
      normal: '📝 NORMAL',
      low: '📋 LOW'
    };
    return priorityEmojis[priority] || priority;
  }

  // Agent coordination intelligence
  async suggestAgentCoordination(task, availableAgents = []) {
    const taskLower = task.toLowerCase();
    const suggestions = [];
    
    // UltraThink coordination
    if (taskLower.includes('complex') || taskLower.includes('analyze') || taskLower.includes('plan')) {
      suggestions.push({
        type: 'ultrathink-coordination',
        agents: ['ultrathink-coordinator'],
        reasoning: 'Complex task requiring multi-agent analysis and planning'
      });
    }
    
    // Step-specific coordination
    for (let i = 1; i <= 10; i++) {
      if (taskLower.includes(`step ${i}`) || taskLower.includes(`step-${i}`)) {
        suggestions.push({
          type: 'step-specific',
          agents: [`step-${i}-agent`],
          reasoning: `Task specifically mentions Vibe Step ${i}`
        });
      }
    }
    
    // Phase coordination
    if (taskLower.includes('phase') || taskLower.includes('implement')) {
      suggestions.push({
        type: 'phase-coordination',
        agents: ['step-8-agent', 'validation-agent'],
        reasoning: 'Phase implementation requires coordination between development and validation'
      });
    }
    
    // Quality assurance coordination
    if (taskLower.includes('test') || taskLower.includes('validate') || taskLower.includes('quality')) {
      suggestions.push({
        type: 'qa-coordination',
        agents: ['validation-agent', 'ui-healer-agent'],
        reasoning: 'Quality assurance requires comprehensive validation and testing'
      });
    }
    
    return suggestions;
  }

  // Room health and optimization
  async analyzeRoomHealth(roomName, messages = []) {
    const analysis = {
      roomName,
      messageCount: messages.length,
      lastActivity: messages.length > 0 ? Math.max(...messages.map(m => m.ts)) : null,
      agentParticipation: this.analyzeAgentParticipation(messages),
      communicationPatterns: this.analyzeCommunicationPatterns(messages),
      recommendations: []
    };
    
    // Generate recommendations
    if (analysis.messageCount === 0) {
      analysis.recommendations.push("Room is inactive - consider archiving or promoting usage");
    } else if (analysis.agentParticipation.uniqueAgents < 2) {
      analysis.recommendations.push("Low agent participation - consider promoting cross-agent collaboration");
    }
    
    if (analysis.communicationPatterns.averageGapHours > 24) {
      analysis.recommendations.push("Long gaps between messages - consider more frequent coordination");
    }
    
    return analysis;
  }

  analyzeAgentParticipation(messages) {
    const agentCounts = {};
    messages.forEach(msg => {
      if (msg.agent) {
        agentCounts[msg.agent] = (agentCounts[msg.agent] || 0) + 1;
      }
    });
    
    return {
      uniqueAgents: Object.keys(agentCounts).length,
      agentCounts,
      mostActiveAgent: Object.entries(agentCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    };
  }

  analyzeCommunicationPatterns(messages) {
    if (messages.length < 2) {
      return { averageGapHours: 0, patterns: 'insufficient-data' };
    }
    
    const sortedMessages = messages.sort((a, b) => a.ts - b.ts);
    const gaps = [];
    
    for (let i = 1; i < sortedMessages.length; i++) {
      const gap = sortedMessages[i].ts - sortedMessages[i-1].ts;
      gaps.push(gap);
    }
    
    const averageGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const averageGapHours = averageGap / (1000 * 60 * 60);
    
    return {
      averageGapHours,
      patterns: this.classifyCommunicationPattern(averageGapHours)
    };
  }

  classifyCommunicationPattern(averageGapHours) {
    if (averageGapHours < 0.5) return 'high-frequency';
    if (averageGapHours < 2) return 'active';
    if (averageGapHours < 8) return 'moderate';
    if (averageGapHours < 24) return 'low';
    return 'very-low';
  }

  async shutdown() {
    console.error("🧭 Vibe Agent Router shutting down...");
  }
}

export default VibeAgentRouter;