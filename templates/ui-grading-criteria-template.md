# UI Grading Criteria Template

## Overview

This template provides a customizable framework for defining UI quality grading criteria based on your specific design system and requirements. Use this to create project-specific grading rubrics that the UI healing system will use to evaluate and improve your components.

## How to Use This Template

1. Copy this template to your project's `.vibe/ui-grading-criteria.md`
2. Customize each section based on your design system
3. Add specific values from your `docs/04-design-system.md`
4. Set minimum scores for each category
5. Configure in `.vibe/validation.config.json`

---

# [Project Name] UI Grading Criteria

## Overall Scoring System

```yaml
scoring:
  scale: 1-10
  passing_threshold: 8.0
  excellence_threshold: 9.0
  weights:
    color_contrast: 0.20      # 20% - Accessibility critical
    typography: 0.15          # 15% - Readability
    spacing: 0.15            # 15% - Visual consistency
    interactions: 0.20        # 20% - User experience
    consistency: 0.15         # 15% - Design cohesion
    accessibility: 0.15       # 15% - Inclusive design
```

## Category 1: Color & Contrast (20%)

### Grading Criteria

| Score | Criteria | Specific Requirements |
|-------|----------|----------------------|
| 10 | Perfect | All text exceeds WCAG AAA (7:1 normal, 4.5:1 large) |
| 9 | Excellent | All text meets WCAG AAA, decorative elements AA |
| 8 | **Good (Min)** | All text meets WCAG AA (4.5:1 normal, 3:1 large) |
| 7 | Acceptable | Minor contrast issues in non-critical elements |
| 6 | Needs Work | Some important text fails WCAG AA |
| 5 | Poor | Multiple contrast failures |
| <5 | Failing | Widespread contrast issues |

### Specific Checks
```yaml
color_checks:
  text_on_background:
    - primary_text: "#1A202C" on "#FFFFFF" # Must be 12.63:1
    - secondary_text: "#4A5568" on "#FFFFFF" # Must be 7.24:1
    - light_text: "#FFFFFF" on primary_color # Must be 4.5:1+
    - error_text: error_color on "#FFF5F5" # Must be 4.5:1+
  
  interactive_elements:
    - links: Must have 3:1 contrast with surrounding text
    - buttons: Text must meet 4.5:1 on button background
    - hover_states: Must maintain contrast requirements
  
  functional_colors:
    - success: "#38A169" # Check on white and gray backgrounds
    - warning: "#D69E2E" # Often fails on white, needs check
    - error: "#E53E3E" # Check on light backgrounds
    - info: "#3182CE" # Check on light backgrounds
```

### Automatic Fixes
- Darken light text on light backgrounds
- Lighten dark text on dark backgrounds  
- Adjust functional colors for contrast
- Add text shadows for borderline cases

## Category 2: Typography (15%)

### Grading Criteria

| Score | Criteria | Specific Requirements |
|-------|----------|----------------------|
| 10 | Perfect | Flawless hierarchy, spacing, and readability |
| 9 | Excellent | Clear hierarchy, consistent spacing |
| 8 | **Good (Min)** | Proper heading order, readable line heights |
| 7 | Acceptable | Minor hierarchy issues |
| 6 | Needs Work | Skipped heading levels, inconsistent sizing |
| 5 | Poor | Unclear hierarchy, poor readability |
| <5 | Failing | No clear structure |

### Specific Checks
```yaml
typography_checks:
  hierarchy:
    - h1: Only one per page, 32-48px
    - h2: Section headers, 24-32px
    - h3: Subsections, 20-24px
    - h4_h6: Progressive scaling
    - no_skipped_levels: h1→h3 is invalid
  
  readability:
    - line_height:
        body_text: 1.5-1.7
        headings: 1.2-1.4
        compact: 1.4 minimum
    - paragraph_width: 45-75 characters ideal
    - font_size:
        minimum: 14px (desktop), 16px (mobile)
        body: 16px standard
  
  consistency:
    - font_families: Maximum 2 (plus monospace)
    - font_weights: Use defined scale only
    - text_transform: Sparingly, not for body text
```

### Automatic Fixes
- Adjust line heights to readable ranges
- Fix heading hierarchy skips
- Standardize font sizes to scale
- Remove excessive font families

## Category 3: Spacing & Layout (15%)

### Grading Criteria

| Score | Criteria | Grid Compliance |
|-------|----------|----------------|
| 10 | Perfect | 100% grid aligned, harmonious |
| 9 | Excellent | 95%+ grid aligned |
| 8 | **Good (Min)** | 90%+ grid aligned, consistent |
| 7 | Acceptable | 85%+ grid aligned |
| 6 | Needs Work | 70%+ grid aligned |
| 5 | Poor | <70% grid aligned |
| <5 | Failing | Random spacing |

### Specific Checks
```yaml
spacing_checks:
  grid_system:
    base_unit: 8px
    allowed_values: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
    
  component_spacing:
    - button_padding: "12px 24px" # 1.5x3 units
    - card_padding: "24px" # 3 units
    - input_padding: "8px 16px" # 1x2 units
    - section_spacing: "48px" # 6 units
  
  responsive_spacing:
    mobile_reduction: 0.75x # Reduce by 25% on mobile
    tablet_reduction: 0.875x # Reduce by 12.5% on tablet
    
  visual_grouping:
    related_items: 8-16px
    separate_groups: 24-32px
    sections: 48-64px
```

### Automatic Fixes
- Round to nearest grid unit (8px)
- Standardize component padding
- Fix inconsistent margins
- Align flexbox/grid gaps

## Category 4: Interactions & States (20%)

### Grading Criteria

| Score | Criteria | Coverage |
|-------|----------|----------|
| 10 | Perfect | All states, delightful micro-interactions |
| 9 | Excellent | All states, smooth transitions |
| 8 | **Good (Min)** | Hover, focus, active states present |
| 7 | Acceptable | Most states present |
| 6 | Needs Work | Missing important states |
| 5 | Poor | Minimal interaction feedback |
| <5 | Failing | No interaction states |

### Specific Checks
```yaml
interaction_checks:
  required_states:
    - default: Base appearance
    - hover: Mouse over feedback
    - focus: Keyboard navigation indicator
    - active: Click/tap feedback
    - disabled: Inactive state
    - loading: Async operation feedback
  
  hover_effects:
    - buttons: Transform, shadow, or color change
    - links: Underline or color change
    - cards: Elevation or border change
    - inputs: Border color change
  
  focus_indicators:
    - outline: "2px solid focusColor"
    - outline_offset: "2px"
    - never_remove: "outline: none" forbidden without alternative
  
  transitions:
    - duration: "200ms" standard, "300ms" for larger movements
    - easing: "ease-out" for enter, "ease-in" for exit
    - properties: transform, opacity, box-shadow (not width/height)
  
  touch_targets:
    - minimum_size: "44px x 44px"
    - spacing: "8px" between targets
    - mobile_adjustments: Increase clickable area
```

### Automatic Fixes
- Add missing hover states
- Implement focus-visible outlines
- Add transitions to state changes
- Increase small touch targets

## Category 5: Component Consistency (15%)

### Grading Criteria

| Score | Criteria | Consistency Level |
|-------|----------|------------------|
| 10 | Perfect | 100% consistent, pixel-perfect |
| 9 | Excellent | Minor variations, intentional |
| 8 | **Good (Min)** | Consistent patterns, minor deviations |
| 7 | Acceptable | Mostly consistent |
| 6 | Needs Work | Noticeable inconsistencies |
| 5 | Poor | Many variations |
| <5 | Failing | No clear patterns |

### Specific Checks
```yaml
consistency_checks:
  button_variants:
    allowed:
      - primary: "bg-primary text-white"
      - secondary: "border-primary text-primary"
      - ghost: "text-primary hover:bg-gray-100"
    max_variants: 3
  
  card_patterns:
    - shadow: "0 2px 4px rgba(0,0,0,0.1)"
    - border_radius: "8px"
    - padding: "24px"
    - background: "white or gray-50"
  
  form_elements:
    - input_height: "44px"
    - border_radius: "4px"
    - border_color: "gray-300"
    - focus_border: "primary-500"
  
  icon_usage:
    - size_scale: [16, 20, 24, 32]
    - style: "outline or filled, not mixed"
    - color: "currentColor or specific from palette"
```

### Automatic Fixes
- Standardize component variants
- Unify border radius values
- Normalize shadows across components
- Align icon sizes to scale

## Category 6: Accessibility (15%)

### Grading Criteria

| Score | Criteria | WCAG Compliance |
|-------|----------|----------------|
| 10 | Perfect | Exceeds WCAG AAA |
| 9 | **Excellent (Min)** | Full WCAG AA, some AAA |
| 8 | Good | WCAG AA compliant |
| 7 | Acceptable | Minor AA issues |
| 6 | Needs Work | Several AA failures |
| 5 | Poor | Many accessibility issues |
| <5 | Failing | Not accessible |

### Specific Checks
```yaml
accessibility_checks:
  semantic_html:
    - headings: Proper hierarchy
    - landmarks: header, nav, main, footer
    - lists: ul/ol for groups
    - buttons_vs_links: Correct usage
  
  aria_requirements:
    - images: alt="" or descriptive
    - icons: aria-label or aria-hidden
    - live_regions: aria-live for updates
    - form_associations: label[for] or aria-label
  
  keyboard_navigation:
    - tab_order: Logical flow
    - skip_links: "Skip to content"
    - focus_trap: Modals and menus
    - escape_key: Close overlays
  
  screen_reader:
    - announcements: Status messages
    - descriptions: Complex widgets
    - context: Sufficient information
    - errors: Clear association
```

### Automatic Fixes
- Add missing alt text
- Implement aria-labels
- Fix heading hierarchy
- Add keyboard handlers

## Custom Project Rules

### Brand-Specific Requirements
```yaml
brand_requirements:
  # Add your specific brand guidelines
  - logo_clear_space: "32px minimum"
  - brand_colors_only: No off-brand colors
  - imagery_style: "Natural, authentic photos only"
  - illustration_style: "Flat, geometric shapes"
```

### Industry-Specific Needs
```yaml
industry_requirements:
  # E-commerce example
  ecommerce:
    - price_prominence: Font size +2px from body
    - cta_contrast: Minimum 5:1 ratio
    - trust_badges: Consistent size and placement
  
  # Healthcare example  
  healthcare:
    - readability: Minimum 16px fonts
    - contrast: WCAG AAA preferred
    - error_clarity: Critical for dosage info
  
  # Finance example
  finance:
    - data_tables: Strict alignment
    - number_formatting: Consistent decimals
    - security_indicators: Visible lock icons
```

## Implementation Example

### Configuration File
```json
// .vibe/validation.config.json
{
  "validation": {
    "uiQuality": {
      "enabled": true,
      "criteriaFile": ".vibe/ui-grading-criteria.md",
      "threshold": 8.0,
      "autoHeal": true,
      "weights": {
        "colorContrast": 0.20,
        "typography": 0.15,
        "spacing": 0.15,
        "interactions": 0.20,
        "consistency": 0.15,
        "accessibility": 0.15
      },
      "minimumScores": {
        "colorContrast": 7,
        "typography": 7,
        "spacing": 7,
        "interactions": 8,
        "consistency": 7,
        "accessibility": 9
      }
    }
  }
}
```

### Usage in Validation
```bash
# Standard validation uses your criteria
/vibe-validate-work

# Override threshold for specific components
/vibe-validate-work --ui-threshold=9.0 --component="CheckoutForm"

# Use different criteria file
/vibe-validate-work --ui-criteria=".vibe/mobile-criteria.md"
```

## Tips for Customization

1. **Start with Standards** - Use WCAG as baseline
2. **Add Brand Specifics** - Layer your unique requirements
3. **Set Realistic Minimums** - 8/10 is good for most projects
4. **Weight by Priority** - Adjust weights for your needs
5. **Document Exceptions** - Some components may need different rules
6. **Iterate Based on Results** - Refine criteria as you learn

---

**This template ensures consistent, high-quality UI across your entire application! 💯**