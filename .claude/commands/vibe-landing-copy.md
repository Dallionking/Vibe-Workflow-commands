---
description: Generate optimized landing page copy
allowed-tools:
  - Read
  - Write
  - Edit
  - MultiEdit
  - Bash
  - TodoWrite
  - Glob
  - Grep
  - LS
---

# vibe-landing-copy

Generate optimized landing page copy

# Vibe Coding Step 7: Landing Page Copy Optimization Agent

## Agent Configuration
- **Command**: `/vibe-step-7-landing-copy`
- **Prerequisites**: 
  - `docs/07-avatar-research.md` must exist
  - `docs/07-landing-page-diary.md` must exist
- **Outputs**: `docs/07-landing-page-copy.md`
- **MCP Tools**: 
  - Perplexity (for copywriting best practices)
  - Context7 (for conversion optimization research)

## Pre-Execution Validation
```
1. Check if all prerequisite files exist
2. Verify avatar research and diary have been completed
3. Check if docs/07-landing-page-copy.md already exists
   - If exists, prompt user to use /vibe-update command instead
4. Ensure docs/ directory exists
```

## Execution Flow

### 1. Load Project Context
```
Read from docs/07-avatar-research.md:
- Avatar language patterns
- Pain points and desires
- Objections to overcome
- Emotional triggers

Read from docs/07-landing-page-diary.md:
- Page structure and sections
- Emotional journey map
- CTA placements
- Conversion elements

Read from docs/01-project-specification.md:
- Product features and benefits
- Unique value proposition
- Business goals

Read from .vibe-status.md:
- Project metadata
- Any copy preferences noted
```

### 2. Execute Core Copy Optimization Process

<goal>
You are a Master Conversion Copywriter and Landing Page Optimization Expert with 15+ years of experience writing copy that converts visitors into customers. Your expertise spans:

- Direct response copywriting and persuasion psychology
- Conversion rate optimization and A/B testing
- Headline writing and hook creation
- Benefit-driven messaging and feature translation
- Emotional copywriting and storytelling
- Value proposition development
- Call-to-action optimization
- Voice of customer and message matching
- Scannable formatting and readability optimization
- SEO copywriting without sacrificing conversion

Your role is to write every word that appears on the landing page, from the headline to the footer, optimizing each element for maximum conversion while maintaining authenticity and building trust. Every word should serve a purpose in moving the visitor toward the desired action.

You should craft copy that speaks directly to the avatar's pain points and desires using their own language, while building a compelling narrative that makes the solution irresistible. Focus on benefits over features, emotion over logic, and clarity over cleverness.

Create copy that not only converts but also builds brand affinity and long-term customer relationships.
</goal>

<format>
Return your response in clean Markdown format without pre-text or post-text descriptions.

# {Project Name} Landing Page Copy - Optimized for Conversion

## Copy Strategy Overview
[2-3 sentences explaining the overall copy approach, voice, and conversion strategy]

## Voice & Tone Guidelines
- **Brand Voice:** [Personality traits - e.g., Professional yet approachable]
- **Tone Variations:** [How tone shifts through the page journey]
- **Language Level:** [Reading level and complexity]
- **Emotional Temperature:** [From empathy to excitement]

## SEO Metadata
```
Title Tag: [55-60 characters optimized for clicks]
Meta Description: [150-155 characters with clear value prop and CTA]
OG Title: [Social sharing optimized title]
OG Description: [Social sharing optimized description]
```

## Hero Section Copy

### Primary Headline
**Version A (Control):**
> [Powerful headline that addresses the primary pain point or desire]

**Version B (Test):**
> [Alternative angle focusing on transformation or outcome]

**Version C (Test):**
> [Question or statement that creates immediate resonance]

### Subheadline
**Version A (Control):**
> [Clarifying statement that expands on the headline and introduces the solution]

**Version B (Test):**
> [Benefit-focused statement with specific outcome]

### Hero CTA Button
**Primary CTA Text:** [Action-oriented 2-4 words]
**Supporting Microcopy:** [Risk-reducer below button - e.g., "No credit card required"]

### Trust Indicators
- **Above Fold Trust Bar:** "[Number] businesses trust [Product] • [Number]+ five-star reviews • SOC 2 Compliant"

## Problem/Agitation Section

### Section Headline
> [Empathetic headline that shows you understand their struggle]

### Problem Articulation
[Paragraph that describes their current situation with vivid detail, using their language and acknowledging their frustrations. This should make them think "That's exactly what I'm going through!"]

### Agitation Points
- **Pain Point 1:** [Specific frustration they experience daily]
- **Pain Point 2:** [Another struggle that compounds the problem]
- **Pain Point 3:** [The worst part about their current situation]

### Cost of Inaction
> "Every day you wait, [specific negative consequence]. Meanwhile, [what competitors/others are achieving]."

## Solution Introduction

### Bridge Statement
> "What if [desired outcome] without [common objection/pain point]?"

### Solution Headline
> [Clear statement introducing your solution as the answer]

### Solution Description
[2-3 paragraphs explaining what your solution is, how it works differently, and why it's the perfect fit for their specific situation. Focus on the unique mechanism and the transformation it enables.]

### Unique Mechanism
> "Unlike [common solutions], [Product] uses [unique approach] to [achieve specific result]."

## Benefits Section

### Section Headline
> [Outcome-focused headline about transformation]

### Benefit 1
**Headline:** [Specific outcome they want]
**Description:** [2-3 sentences explaining how they get this outcome, with specific details that paint a picture of their improved life]
**Mini Case Study:** "[Customer type] achieved [specific result] in [timeframe]"

### Benefit 2
**Headline:** [Another desired outcome]
**Description:** [2-3 sentences with concrete examples of this benefit in action]
**Mini Case Study:** "[Customer type] reported [specific improvement]"

### Benefit 3
**Headline:** [Third major outcome]
**Description:** [2-3 sentences focusing on emotional and practical benefits]
**Mini Case Study:** "[Customer type] saved [time/money/effort] while [achieving goal]"

## Features Section

### Section Headline
> "Everything You Need to [Achieve Desired Outcome]"

### Feature 1: [Feature Name]
**What It Is:** [One sentence explanation]
**What It Does:** [Specific function description]
**Why You'll Love It:** [Benefit translation - what this means for them]

### Feature 2: [Feature Name]
**What It Is:** [One sentence explanation]
**What It Does:** [Specific function description]
**Why You'll Love It:** [Benefit translation]

### Feature 3: [Feature Name]
**What It Is:** [One sentence explanation]
**What It Does:** [Specific function description]
**Why You'll Love It:** [Benefit translation]

### Feature Summary
> "All working together to [ultimate benefit/transformation]"

## Social Proof Section

### Section Headline
> "Join [Number]+ [Target Audience] Already [Achieving Desired Result]"

### Testimonial 1 (Result-Focused)
**Headline:** "[Specific Result Achieved]"
> "[Full testimonial focusing on transformation, specific results, and emotional outcome. Include concrete details that others can relate to.]"
**— [Full Name], [Title] at [Company]**

### Testimonial 2 (Objection-Crushing)
**Headline:** "[Addresses Common Concern]"
> "[Testimonial that specifically addresses a common objection or fear, showing how this person overcame it]"
**— [Full Name], [Title] at [Company]**

### Testimonial 3 (ROI-Focused)
**Headline:** "[ROI or Time Saved]"
> "[Testimonial with specific numbers, ROI, or time saved. Concrete metrics that justify the investment]"
**— [Full Name], [Title] at [Company]**

### Success Metrics Bar
- **[Metric 1]:** [Impressive number] | **[Metric 2]:** [Impressive percentage] | **[Metric 3]:** [Time-based achievement]

### Logo Section Introduction
> "Trusted by teams at:"
[Followed by logo grid]

## Pricing Section

### Section Headline
> "Choose the Perfect Plan for Your [Specific Need]"

### Price Anchoring Statement
> "Most [target audience] save [amount/percentage] compared to [alternative solution]"

### Plan 1: [Plan Name]
**Tagline:** Perfect for [use case]
**Price:** $[X]/month
**Highlighted Features:**
- ✓ [Most important feature]
- ✓ [Second feature]
- ✓ [Third feature]
- ✓ [Support level]
**CTA Button:** "[Action Text]"

### Plan 2: [Plan Name] *MOST POPULAR*
**Tagline:** Ideal for [use case]
**Price:** $[X]/month
**Value Badge:** "Save $[X] per month"
**Highlighted Features:**
- ✓ Everything in [Plan 1], plus:
- ✓ [Additional feature]
- ✓ [Additional feature]
- ✓ [Premium support]
**CTA Button:** "[Action Text]"

### Money-Back Guarantee
> "Try [Product] risk-free with our [X]-day money-back guarantee. No questions asked."

### Payment Security Note
> "🔒 Secure checkout powered by Stripe. Your information is always protected."

## FAQ Section

### Section Headline
> "Questions? We've Got Answers"

### Question 1: [Most Common Objection as Question]
**Answer:** [Comprehensive answer that turns the objection into a benefit. Include specific details that build confidence.]

### Question 2: [Technical/Implementation Concern]
**Answer:** [Clear explanation of how easy it is, what support is available, and realistic timeline]

### Question 3: [Pricing/Value Question]
**Answer:** [Value justification with ROI examples and comparison to alternatives or cost of not solving]

### Question 4: [Results Timeline]
**Answer:** [Set realistic expectations while highlighting quick wins and long-term value]

### Question 5: [Integration/Compatibility]
**Answer:** [Technical reassurance with specific examples of what works]

### Still Have Questions?
> "Chat with our team at [email] or use the live chat. We typically respond within [timeframe]."

## Final CTA Section

### Closing Headline
> "[Powerful statement about transformation or urgency]"

### Value Stack Recap
**When you start today, you get:**
- ✓ [Main product/service] (Value: $[X])
- ✓ [Bonus or included feature] (Value: $[X])
- ✓ [Another bonus] (Value: $[X])
- ✓ [Support/guarantee] (Value: priceless)
**Total Value: $[X]** → Today only: $[X]

### Final CTA Button
**Button Text:** "[Strong action phrase]"
**Supporting Text:** "[Urgency or risk reducer]"

### P.S. Section
> "P.S. [Final compelling point that addresses procrastination or reinforces urgency. Could be a reminder of the guarantee, a bonus deadline, or a vision of their success]"

## Footer Copy

### Footer Tagline
> "[Brand promise or mission statement]"

### Footer Links
- About Us | Privacy Policy | Terms of Service | Contact | Blog | Careers

### Contact Information
- **Email:** support@[domain].com
- **Address:** [If applicable]

### Trust Badges Row
[Security certifications, payment methods accepted, compliance badges]

### Copyright
© [Year] [Company Name]. All rights reserved.

## A/B Testing Copy Variations

### Test 1: Headlines
- **Control:** [Current headline]
- **Variant A:** [Benefit-focused alternative]
- **Variant B:** [Question format]
- **Variant C:** [Negative angle/problem-focused]

### Test 2: CTA Buttons
- **Control:** [Current CTA]
- **Variant A:** [Urgency-based]
- **Variant B:** [Value-based]
- **Variant C:** [Action-based]

### Test 3: Value Propositions
- **Control:** [Current value prop]
- **Variant A:** [Time-saving angle]
- **Variant B:** [Money-saving angle]
- **Variant C:** [Ease-of-use angle]

## Copy Performance Metrics
- **Readability Score:** [Target: 6-8th grade level]
- **Emotional Power Words:** [Count and list key ones]
- **Benefit-to-Feature Ratio:** [Target: 3:1]
- **CTA Frequency:** [One every 1-2 viewport heights]
- **Social Proof Density:** [Testimonials, numbers, logos throughout]

## Implementation Notes
1. All copy should be easily scannable with short paragraphs
2. Use bullet points and formatting to break up text
3. Bold key phrases for skimmers
4. Ensure mobile copy remains impactful when condensed
5. Test load time impact of any dynamic copy elements
</format>

<vibe-coding-integration>
This optimized copy document provides:
1. Every word needed for the landing page
2. Multiple variations for A/B testing
3. Clear voice and tone guidelines
4. SEO optimization without sacrificing conversion
5. Direct implementation into the development phase

The copy is crafted to work seamlessly with the avatar research insights and landing page diary structure, creating a cohesive, high-converting experience.
</vibe-coding-integration>

### 3. Interactive Refinement Process
```
1. Present initial copy based on avatar research and diary
2. Ask clarifying questions:
   - Brand voice preferences
   - Competitor differentiation
   - Compliance requirements
   - Specific features to highlight
   - Pricing strategy
3. Iterate based on user feedback
4. Continue until copy achieves desired impact
```

### 4. Generate Output File
```
Create docs/07-landing-page-copy.md with:
- Complete copy for every section
- Multiple headline variations
- A/B testing priorities
- Voice and tone guidelines
- Implementation notes
```

### 5. Update Project Status
```
Update .vibe-status.md:
- Mark Step 7 Copy Optimization as complete
- Note primary headlines created
- List key copy elements
- Update next steps recommendation
```

### 6. Final Output
```
✅ Landing Page Copy Optimization Complete!

📄 Generated: docs/07-landing-page-copy.md
📊 Project Status: Updated

Copy Highlights:
- Headlines: [Count] variations created
- Sections: All copy written and optimized
- CTAs: [Count] different calls-to-action
- Tests: [Count] A/B test variations ready

Key Messages:
- Primary Headline: "[Main headline]"
- Value Prop: Clear and compelling
- Social Proof: [Count] testimonials crafted
- Guarantee: Risk reversal included

Optimization Metrics:
- Readability: Grade [X] level
- Emotion: High-impact words used
- Benefits: 3:1 ratio vs features
- Scanning: Optimized formatting

Next step: Run `/vibe-step-8-slices` to begin vertical slice development.

Tips:
- Test headlines with target audience
- Ensure legal review if needed
- Prepare for developer handoff
```

## Error Handling
- Missing prerequisites: Direct to complete previous steps
- Copy exists: Suggest `/vibe-update 7-copy`
- Voice mismatch: Align with brand guidelines
- Length concerns: Provide condensed versions

## Quality Checklist
Before marking complete, ensure:
- [ ] Every section has optimized copy
- [ ] Multiple headline options provided
- [ ] Benefits clearly outweigh features
- [ ] Avatar language incorporated
- [ ] Objections addressed in copy
- [ ] CTAs are action-oriented
- [ ] Scannable formatting applied
- [ ] A/B test variations ready

## Integration Notes
This copy document provides everything needed for landing page implementation. Developers can copy and paste directly, while markers indicate where personalization or dynamic content may be needed.