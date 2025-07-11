# Step 7: Landing Page Creation Methodology Documentation

## Overview

Step 7 of the Vibe Coding methodology is uniquely structured as a **3-part sequential landing page creation process** that differs from all other steps in the framework. Unlike standard steps that focus on technical implementation, Step 7 employs a specialized marketing and conversion optimization approach designed to create high-converting landing pages through deep customer psychology understanding.

## Unique Structure Characteristics

### 1. Multi-Part Sequential Process
Step 7 is the only step in the Vibe Coding methodology that consists of **three mandatory sequential sub-steps**, each building upon the previous one:

```
Step 7 = Part 1 (Avatar Research) → Part 2 (Emotional Diary) → Part 3 (Landing Page Copy)
```

### 2. Marketing-Focused Rather Than Technical
While all other Vibe Coding steps focus on technical implementation, Step 7 focuses on:
- Customer psychology and behavioral analysis
- Conversion optimization and marketing strategy  
- Emotional triggers and persuasive copywriting
- Market research and competitor analysis

### 3. Dedicated Output Directory
Step 7 creates its own dedicated output directory structure:
```
docs/07-landing-page/
├── customer-avatars.md    # From Part 1
├── emotional-diary.md     # From Part 2
└── landing-page.md        # From Part 3
```

### 4. Integration with Step 8
Step 7's outputs are **uniquely required by Step 8** (Vertical Slices), making it the only step whose outputs directly feed into feature implementation phases.

## Three-Part Process Deep Dive

### Part 1: Avatar Research (`/vibe-landing-avatar`)
**Purpose**: Deep customer psychology research and avatar development  
**Agent**: `agents/step-7-landing-page/avatar-research.md`  
**Output**: `docs/07-landing-page/customer-avatars.md`

#### Unique Methodology:
- **5 Awareness Stages Analysis**: Unaware → Problem Aware → Solution Aware → Product Aware → Most Aware
- **Psychological Profiling**: Demographics, psychographics, pain points, desires, objections
- **Market Research Integration**: Uses Perplexity MCP for real-time market analysis
- **Competitor Analysis**: Uses Context7 MCP for industry research

#### Key Deliverables:
```markdown
- Detailed customer avatars for each awareness stage
- Pain point analysis and emotional triggers
- Language patterns and communication preferences  
- Objection identification and handling strategies
- Market positioning insights
```

### Part 2: Emotional Diary Creation (`/vibe-landing-diary`)
**Purpose**: Create emotional journey mapping and persuasive narrative development  
**Agent**: `agents/step-7-landing-page/diary-creation.md`  
**Output**: `docs/07-landing-page/emotional-diary.md`

#### Unique Methodology:
- **Emotional Journey Mapping**: Customer's emotional state progression
- **Day-in-the-Life Scenarios**: Detailed behavioral patterns and frustrations
- **Transformation Visualization**: Before/after emotional states
- **Trigger Event Analysis**: Moments that drive purchase decisions

#### Key Deliverables:
```markdown
- Emotional journey maps for each avatar
- Day-in-the-life scenario documentation
- Transformation stories and desired outcomes
- Emotional trigger identification
- Motivation and barrier analysis
```

### Part 3: Landing Page Copy Optimization (`/vibe-landing-copy`)
**Purpose**: Convert research and emotional insights into high-converting landing page copy  
**Agent**: `agents/step-7-landing-page/copy-optimization.md`  
**Output**: `docs/07-landing-page/landing-page.md`

#### Unique Methodology:
- **Psychology-Driven Copywriting**: Uses avatar research and emotional insights
- **Conversion Optimization**: Applies proven persuasion frameworks
- **A/B Testing Strategy**: Includes copy variations and testing plan
- **CRO Best Practices**: Implements conversion rate optimization principles

#### Key Deliverables:
```markdown
- Complete landing page copy (headlines, subheads, body, CTAs)
- Conversion-optimized content strategy
- A/B testing variations and hypotheses
- SEO-optimized content structure
- Mobile-responsive copy guidelines
```

## Integration Points

### With Previous Steps
Step 7 uniquely integrates data from **all previous steps**:

```markdown
Step 1 (Project Spec) → Target audience and business goals
Step 2 (Architecture) → Technical feasibility and constraints  
Step 3 (UX Design) → User personas and journey maps
Step 4 (Design System) → Brand voice and visual guidelines
Step 5 (Interface States) → User interaction patterns
Step 6 (Technical Spec) → Feature prioritization and capabilities
```

### With Step 8 (Vertical Slices)
Step 7's outputs are **critical inputs for Step 8**:

```json
"requires": [
  "docs/06-technical-specification.md",
  "docs/07-landing-page/customer-avatars.md",
  "docs/07-landing-page/emotional-diary.md", 
  "docs/07-landing-page/landing-page.md"
]
```

This integration ensures that:
- Feature development is driven by customer needs (avatars)
- Implementation considers emotional user journey (diary)
- Marketing message aligns with technical features (landing page)

## Command Structure and Usage

### Primary Command
```bash
/vibe-step-7-landing
```
This command initiates the full 3-part process but does not execute automatically. Instead, it provides guidance to run each part sequentially.

### Sequential Execution
```bash
# Part 1: Customer Avatar Research
/vibe-landing-avatar

# Part 2: Emotional Diary Creation (requires Part 1 completion)
/vibe-landing-diary

# Part 3: Landing Page Copy (requires Parts 1 & 2 completion)
/vibe-landing-copy
```

### Validation Requirements
Each part validates prerequisites before execution:

**Part 1 Requirements:**
- All Steps 1-6 completed
- `docs/06-technical-specification.md` exists

**Part 2 Requirements:**
- Part 1 completed
- `docs/07-landing-page/customer-avatars.md` exists

**Part 3 Requirements:**
- Parts 1 & 2 completed
- `docs/07-landing-page/emotional-diary.md` exists

## MCP Tool Integration

### Specialized MCP Usage
Step 7 employs MCP tools differently than other steps:

**Context7 MCP:**
- Market research and industry analysis
- Landing page best practices research
- Conversion optimization case studies

**Perplexity MCP:**
- Real-time competitor analysis
- Market trend identification  
- Customer behavior research
- Copywriting best practices

**Magic UI MCP (Part 2 only):**
- Landing page component generation
- Visual layout optimization

## Quality Standards

### Step 7-Specific Quality Criteria

#### Content Quality
- **Customer Avatar Accuracy**: Validated against real market research
- **Emotional Resonance**: Diary entries must reflect authentic customer emotions
- **Copy Conversion Potential**: Landing page copy must follow proven frameworks

#### Research Rigor
- **Market Research Depth**: Minimum 3 competitor analysis per avatar
- **Data Validation**: Customer insights backed by research sources
- **Trend Relevance**: Current market trends and behavioral patterns

#### Integration Completeness
- **Cross-Step Alignment**: Consistency with previous step outputs
- **Step 8 Readiness**: All required outputs generated for vertical slice creation

### Validation Checkpoints
```markdown
✓ Avatar research includes all 5 awareness stages
✓ Emotional diary covers complete customer journey
✓ Landing page copy addresses all identified pain points
✓ All outputs align with brand voice from design system
✓ Research sources documented and verifiable
✓ Content optimized for target conversion goals
```

## Success Metrics

### Immediate Outputs
- 3 complete documentation files in `docs/07-landing-page/`
- Customer avatars for 5 awareness stages
- Emotional journey maps for each avatar
- Conversion-optimized landing page copy

### Downstream Impact
- **Step 8 Enhancement**: Vertical slices informed by customer psychology
- **Marketing Alignment**: Technical features aligned with market needs
- **Conversion Optimization**: Landing page ready for high-conversion deployment

## Common Challenges and Solutions

### Challenge 1: Insufficient Customer Research
**Problem**: Generic avatars without deep psychological insights  
**Solution**: Use Perplexity MCP for real-time market research and competitor analysis

### Challenge 2: Emotional Diary Lacks Authenticity
**Problem**: Diary entries feel artificial or marketing-focused  
**Solution**: Base emotional states on real customer feedback and behavioral research

### Challenge 3: Copy Doesn't Convert
**Problem**: Landing page copy lacks persuasive power  
**Solution**: Apply proven conversion frameworks (AIDA, PAS, Before/After/Bridge)

### Challenge 4: Integration Gaps
**Problem**: Step 7 outputs don't align with previous steps  
**Solution**: Validate alignment with design system, UX patterns, and technical constraints

## Best Practices

### Research Phase (Part 1)
1. **Start with Real Data**: Use actual customer interviews, surveys, or research
2. **Leverage MCP Tools**: Use Perplexity for current market trends
3. **Document Sources**: Maintain research references for validation
4. **Validate with Stakeholders**: Review avatars with business stakeholders

### Emotional Mapping (Part 2)
1. **Stay Authentic**: Base emotions on real customer experiences
2. **Focus on Transformation**: Emphasize before/after emotional states
3. **Identify Trigger Moments**: Pinpoint exact decision-making moments
4. **Map to User Journey**: Align with UX design user flows

### Copywriting (Part 3)
1. **Apply Psychology**: Use avatar insights and emotional triggers
2. **Follow Frameworks**: Implement proven conversion copywriting structures
3. **Test Variations**: Create A/B testing hypotheses
4. **Optimize for Mobile**: Ensure copy works across all devices

## Advanced Usage

### Iterative Improvement
Step 7 supports iterative improvement through the `/vibe-update` command:

```bash
# Update specific parts
/vibe-update step-7 --part=avatar
/vibe-update step-7 --part=diary  
/vibe-update step-7 --part=copy
```

### A/B Testing Integration
Part 3 generates multiple copy variations for testing:
- Headlines variations (3-5 options)
- CTA variations (2-3 options)
- Value proposition tests
- Social proof variations

### Conversion Tracking Setup
Step 7 outputs include conversion tracking recommendations:
- Goal definitions for analytics
- Conversion funnel mapping
- Success metrics definition

## Conclusion

Step 7's unique 3-part structure represents a sophisticated approach to landing page creation that bridges marketing psychology with technical implementation. By understanding its distinctive methodology and integration points, teams can leverage this step to create landing pages that not only convert effectively but also inform better product development decisions in subsequent phases.

The sequential nature of the process ensures that each part builds upon the previous one, creating a comprehensive understanding of customer psychology that directly enhances the technical implementation phases that follow.