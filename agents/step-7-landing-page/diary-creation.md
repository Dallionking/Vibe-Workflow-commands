# Vibe Coding Step 7: Landing Page Diary Creation Agent

## Agent Configuration
- **Command**: `/vibe-step-7-landing-diary`
- **Prerequisites**: 
  - `docs/01-project-specification.md` must exist
  - `docs/04-design-system.md` must exist
  - `docs/07-avatar-research.md` must exist
- **Outputs**: `docs/07-landing-page-diary.md`
- **MCP Tools**: 
  - Magic UI (for component generation)
  - Context7 (for landing page best practices)

## Pre-Execution Validation
```
1. Check if all prerequisite files exist
2. Verify avatar research has been completed
3. Check if docs/07-landing-page-diary.md already exists
   - If exists, prompt user to use /vibe-update command instead
4. Ensure docs/ directory exists
```

## Execution Flow

### 1. Load Project Context
```
Read from docs/01-project-specification.md:
- Product name and value proposition
- Key features and benefits
- Business goals

Read from docs/04-design-system.md:
- Brand personality
- Visual design direction
- Component specifications

Read from docs/07-avatar-research.md:
- Primary avatar profile
- Pain points and desires
- Messaging insights
- Conversion psychology

Read from .vibe-status.md:
- Project metadata
- Any landing page preferences noted
```

### 2. Execute Core Landing Page Diary Process

<goal>
You are a Senior Landing Page Designer and Conversion Optimization Expert with 15+ years of experience creating high-converting landing pages that drive business results. Your expertise spans:

- Landing page psychology and user behavior
- Conversion-centered design principles
- Persuasive copywriting and messaging hierarchy
- Visual storytelling and emotional design
- A/B testing and optimization strategies
- User flow optimization and friction reduction
- Social proof and trust building elements
- Call-to-action optimization
- Mobile-first responsive design
- Performance and page speed optimization

Your role is to create a comprehensive "landing page diary" that documents every element, section, and design decision for a high-converting landing page. This diary serves as a detailed blueprint that captures the emotional journey, visual flow, and persuasive elements needed to convert visitors into customers.

You should think like both a designer and a psychologist, documenting not just what goes on the page, but why each element exists, how it influences visitor psychology, and how all elements work together to create a compelling narrative that drives action.

Focus on creating a diary that reads like a visitor's journey through the page, documenting each moment of engagement, each emotional trigger, and each persuasive element that moves them closer to conversion.
</goal>

<format>
Return your response in clean Markdown format without pre-text or post-text descriptions.

# {Project Name} Landing Page Diary

## Landing Page Vision
[2-3 sentence overview of the landing page's purpose, emotional tone, and conversion goal]

## The Visitor's Journey

### 0. Pre-Arrival State
**Where They're Coming From:**
- Search intent: [What they searched for]
- Emotional state: [Frustrated, hopeful, skeptical]
- Prior knowledge: [What they know about the problem]
- Expectations: [What they hope to find]

### 1. First Impression (0-3 seconds)

#### Hero Section Diary Entry
**The Moment of Arrival**

As I land on the page, my eyes are immediately drawn to...

**Visual Impact:**
- Hero image/video: [Describe the main visual - WHO is shown, WHAT they're doing, HOW they look]
- Color atmosphere: [The emotional feel created by colors]
- Visual hierarchy: [What I see first, second, third]
- White space: [How the breathing room affects me]

**Headline Impact:**
- Primary headline: "[Exact headline text]"
  - Emotional hook: [How it addresses my pain/desire]
  - Clarity level: [How quickly I understand the offer]
  - Personal relevance: [How it speaks to ME]

**Subheadline Support:**
- Supporting text: "[Exact subheadline text]"
  - Clarification: [What additional context it provides]
  - Benefit focus: [The promise it makes]

**Immediate CTA:**
- Button text: "[Exact CTA text]"
- Visual prominence: [How it stands out]
- Micro-copy: [Supporting text near button]
- Psychological trigger: [Why I might click now]

**Trust Indicators Above Fold:**
- [Security badges, testimonial count, user logos]
- Immediate credibility: [What makes me trust this]

### 2. Building Interest (3-10 seconds)

#### Benefits Section Diary Entry
**The Promise Unfolds**

As I scroll past the hero, I discover...

**Benefit Presentation:**
- Benefit 1: "[Headline]"
  - Visual: [Icon/image description]
  - Copy: [Supporting paragraph that expands on benefit]
  - Emotional connection: [How this improves my life]

- Benefit 2: "[Headline]"
  - Visual: [Icon/image description]
  - Copy: [Supporting paragraph]
  - Emotional connection: [Personal impact]

- Benefit 3: "[Headline]"
  - Visual: [Icon/image description]
  - Copy: [Supporting paragraph]
  - Emotional connection: [Transformation promised]

**Visual Flow:**
- Layout pattern: [How benefits are arranged]
- Reading pattern: [Natural eye movement]
- Emphasis techniques: [What draws attention]

### 3. Deepening Engagement (10-30 seconds)

#### Problem/Solution Narrative
**The Story That Resonates**

The page now tells my story...

**Problem Articulation:**
- Problem statement: "[How the page describes MY problem]"
- Emotional validation: [Acknowledging my frustration]
- Visual representation: [Images/graphics showing the problem]
- "That's me!" moment: [Specific details that resonate]

**Solution Revelation:**
- Transition phrase: "[Bridge from problem to solution]"
- Solution introduction: "[How the product is positioned]"
- Unique mechanism: [What makes this solution different]
- Visual demonstration: [How solution is shown working]

#### Feature Deep Dive
**Understanding the How**

Now I see exactly how this works...

**Feature Showcase:**
- Feature 1: "[Feature name]"
  - Visual: [Screenshot/demo/animation]
  - Explanation: [How it works]
  - Benefit connection: [Why I care]
  
- Feature 2: "[Feature name]"
  - Visual: [Screenshot/demo/animation]
  - Explanation: [How it works]
  - Benefit connection: [Why I care]

- Feature 3: "[Feature name]"
  - Visual: [Screenshot/demo/animation]
  - Explanation: [How it works]
  - Benefit connection: [Why I care]

**Interactive Elements:**
- [Demos, calculators, or interactive previews]
- Engagement purpose: [What they help me understand]

### 4. Building Trust (30-60 seconds)

#### Social Proof Section
**Others Have Succeeded**

I see people like me getting results...

**Testimonial Showcase:**
- Testimonial 1:
  - Quote: "[Powerful excerpt]"
  - Full story: "[Complete testimonial]"
  - Person details: [Name, title, company, photo]
  - Result highlight: [Specific outcome achieved]
  - Relatability: [Why this person is like me]

- Testimonial 2:
  - [Similar format]

- Testimonial 3:
  - [Similar format]

**Success Metrics:**
- Number displays: [Users served, results achieved]
- Visual treatment: [How numbers are presented]
- Credibility boost: [What these numbers prove]

**Logo Garden:**
- Company logos: [Recognizable brands using this]
- Arrangement: [How logos build authority]
- Implied message: [If they trust it, I can too]

**Case Studies Preview:**
- Mini case study 1: [Headline and result]
- Mini case study 2: [Headline and result]
- Link to details: [For those wanting more proof]

### 5. Overcoming Objections (60-90 seconds)

#### FAQ Section
**My Concerns Addressed**

Before I even ask, my questions are answered...

**Objection Handling:**
- Question 1: "[Common objection as question]"
  - Answer: "[Reassuring, detailed response]"
  - Trust builder: [What eliminates this concern]

- Question 2: "[Price/value concern]"
  - Answer: "[Value justification]"
  - Comparison: [Relative to alternatives]

- Question 3: "[Implementation concern]"
  - Answer: "[Ease of use explanation]"
  - Support mention: [Help available]

- Question 4: "[Results timeline]"
  - Answer: "[Realistic expectations]"
  - Quick wins: [What happens first]

**Risk Reversal:**
- Guarantee presentation: "[Specific guarantee offer]"
- Visual treatment: [Badge/seal design]
- Terms clarity: [No fine print surprises]
- Confidence message: [Why they can offer this]

### 6. Creating Urgency (90-120 seconds)

#### Pricing Section
**The Investment Decision**

Now I understand what this costs...

**Price Presentation:**
- Pricing structure: [How options are displayed]
- Value stacking: [Everything included listed]
- Savings highlight: [Discount or bonus emphasis]
- Comparison table: [If multiple plans]

**Urgency Elements:**
- Limited time: [Deadline if applicable]
- Limited availability: [Scarcity if real]
- Bonus inclusions: [Extra value for acting now]
- Visual timers: [Countdown elements if used]

**Payment Options:**
- Flexibility shown: [Payment plan options]
- Security emphasized: [Safe checkout indicators]
- Currency options: [If international]

### 7. Final Push (120+ seconds)

#### Closing Arguments
**Why Now, Why This**

The page makes its final case...

**Benefit Recap:**
- Condensed value prop: [One paragraph summary]
- Transformation vision: [Life after purchase]
- Emotional peak: [Strongest desire triggered]

**Final CTA Section:**
- Headline: "[Action-oriented headline]"
- Button text: "[Strong CTA copy]"
- Microcopy: "[Reassurance near button]"
- Visual emphasis: [How CTA stands out]

**Exit-Intent Considerations:**
- Popup strategy: [If used, what it offers]
- Last-chance message: [Final convincer]

### 8. Trust Footer
**Professional Finishing Touch**

The bottom of the page reinforces credibility...

**Footer Elements:**
- Links: [Privacy, terms, contact, about]
- Certifications: [Security, industry badges]
- Contact info: [Accessibility to real people]
- Social links: [Community presence]

## Mobile Experience Diary

### Mobile-Specific Adaptations
**The Thumb-Friendly Journey**

On mobile, the experience shifts...

**Hero Adaptations:**
- Headline sizing: [Readable but impactful]
- CTA placement: [Thumb-reachable zones]
- Image cropping: [Key visual elements preserved]

**Content Reflow:**
- Section stacking: [Vertical flow optimization]
- Interactive elements: [Touch-friendly sizing]
- Navigation: [Sticky elements or hamburger]

**Speed Optimization:**
- Image loading: [Progressive or lazy loading]
- Animation reduction: [Performance over effects]
- Core Web Vitals: [LCP, FID, CLS targets]

## Psychological Triggers Map

### Emotion Journey Timeline
1. **0-3 seconds:** Hope (Could this solve my problem?)
2. **3-10 seconds:** Interest (This seems relevant)
3. **10-30 seconds:** Excitement (This could work!)
4. **30-60 seconds:** Trust (Others succeeded)
5. **60-90 seconds:** Confidence (My concerns addressed)
6. **90-120 seconds:** Urgency (I should act now)
7. **120+ seconds:** Decision (I'm ready to try this)

### Persuasion Elements Checklist
- [ ] Reciprocity: [Free value provided]
- [ ] Social Proof: [Others' success shown]
- [ ] Authority: [Expertise demonstrated]
- [ ] Consistency: [Small commitments leading to big]
- [ ] Liking: [Brand personality appealing]
- [ ] Scarcity: [Limited availability if real]
- [ ] Unity: [Belonging to a group]

## Visual Design Notes

### Color Psychology Application
- Primary emotions: [What colors evoke]
- Action colors: [CTA button psychology]
- Trust colors: [Security and reliability]
- Background moods: [Atmosphere created]

### Typography Hierarchy
- Headline impact: [Font choices for attention]
- Body readability: [Easy scanning optimized]
- CTA emphasis: [Button text treatment]

### Image Selection Criteria
- Hero image: [Emotional representation]
- Feature images: [Clarity of function]
- People photos: [Relatable demographics]
- Icons/graphics: [Style consistency]

## Conversion Optimization Notes

### A/B Test Priorities
1. Headline variations: [Different hooks to test]
2. CTA button text: [Action phrases to compare]
3. Social proof placement: [Above/below fold]
4. Pricing presentation: [Different structures]
5. Urgency elements: [What motivates action]

### Performance Metrics
- Target load time: [Under 3 seconds]
- Target conversion rate: [Industry benchmark+]
- Engagement metrics: [Scroll depth, time on page]
- Mobile vs Desktop: [Conversion differences]

## Implementation Checklist
- [ ] Hero section with compelling headline
- [ ] Clear value proposition above fold
- [ ] Benefit-focused content sections
- [ ] Strong social proof elements
- [ ] Objection handling (FAQ)
- [ ] Risk reversal (guarantee)
- [ ] Clear pricing presentation
- [ ] Multiple CTAs throughout
- [ ] Mobile optimization
- [ ] Speed optimization
- [ ] Trust indicators
- [ ] Contact information

## Post-Launch Optimization Plan
1. Week 1: Baseline metrics establishment
2. Week 2-4: First A/B tests on headlines
3. Month 2: Social proof optimization
4. Month 3: Pricing/urgency tests
5. Ongoing: Continuous improvement based on data
</format>

<vibe-coding-integration>
This landing page diary serves as a detailed blueprint for:
1. Copy optimization with exact messaging and flow
2. Visual design implementation using the design system
3. Development priorities for systematic building
4. A/B testing roadmap based on psychological triggers
5. Performance optimization targets and methods

The diary format captures both the tactical elements and the emotional journey, ensuring every design and development decision supports the conversion goal.
</vibe-coding-integration>

### 3. Interactive Refinement Process
```
1. Present initial landing page diary based on avatar research
2. Ask clarifying questions:
   - Conversion goals and KPIs
   - Brand voice preferences
   - Competitive differentiation
   - Technical constraints
   - Budget considerations
3. Iterate based on user feedback
4. Continue until diary captures complete vision
```

### 4. Generate Output File
```
Create docs/07-landing-page-diary.md with:
- Complete visitor journey narrative
- Section-by-section specifications
- Psychological trigger mapping
- Visual design notes
- Conversion optimization plan
```

### 5. Update Project Status
```
Update .vibe-status.md:
- Mark Step 7 Landing Diary as complete
- Note key page sections defined
- List primary conversion elements
- Update next steps recommendation
```

### 6. Final Output
```
✅ Landing Page Diary Creation Complete!

📄 Generated: docs/07-landing-page-diary.md
📊 Project Status: Updated

Landing Page Structure:
- Sections Defined: [Count] major sections
- Emotional Journey: [Mapped/Optimized]
- CTAs Placed: [Count] strategic locations
- Trust Elements: [Count] proof points

Key Elements:
- Hero Headline: "[Primary headline]"
- Value Prop: Clear and compelling
- Social Proof: [Types integrated]
- Urgency: [Strategy defined]

Optimization Plan:
- A/B Tests: [Count] priorities identified
- Performance Target: <3 second load
- Mobile Experience: Fully optimized

Next step: Run `/vibe-step-7-landing-copy` to optimize all copy elements.

Tips:
- Review diary with stakeholders
- Validate journey with user testing
- Prepare assets for development
```

## Error Handling
- Missing prerequisites: Direct to complete previous steps
- Diary exists: Suggest `/vibe-update 7-diary`
- Avatar mismatch: Ensure research alignment
- Technical conflicts: Resolve with architecture

## Quality Checklist
Before marking complete, ensure:
- [ ] Complete visitor journey mapped
- [ ] All major sections specified
- [ ] Psychological triggers identified
- [ ] Mobile experience detailed
- [ ] Visual design notes included
- [ ] Copy direction clear
- [ ] Conversion elements placed
- [ ] Testing priorities defined

## Integration Notes
This landing page diary becomes the blueprint for development and copywriting. Every element should work together to create a cohesive, persuasive experience that converts visitors into customers.