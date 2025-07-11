# Shadcn/UI MCP Setup Guide

## Overview
The Shadcn/UI MCP enables seamless integration with the shadcn/ui component system, allowing for consistent UI component generation that leverages your established design system from Steps 3 & 4 of the Vibe Coding methodology.

## Prerequisites
- **Design System**: Completed Steps 3 (UX Design) and 4 (Design System) in Vibe Coding workflow
- **React/Next.js Project**: Project must use React or Next.js framework
- **Tailwind CSS**: Project must have Tailwind CSS configured
- **Design Tokens**: Established color tokens, typography, and spacing from Step 4

## Installation

### Automatic Installation (Recommended)
If you're using Vibe Coding Step 2.5 MCP auto-installation:
```bash
/vibe-step-2.5-mcp-setup
```
The agent will automatically detect React/Next.js projects and offer to install Shadcn/UI MCP.

### Manual Installation

#### 1. Install the MCP Package
```bash
npm install -g @shadcn/ui-mcp
```

#### 2. Configure Claude Desktop
Add to your Claude Desktop MCP configuration:
```json
{
  "mcps": {
    "shadcn-ui": {
      "command": "shadcn-ui-mcp",
      "args": [],
      "env": {
        "DESIGN_SYSTEM_PATH": "docs/04-design-system.md",
        "UX_DESIGN_PATH": "docs/03-ux-design.md",
        "PROJECT_TYPE": "react"
      }
    }
  }
}
```

#### 3. Initialize Shadcn/UI in Your Project
```bash
npx shadcn-ui@latest init
```

Follow the prompts to configure:
- **Framework**: React/Next.js
- **Styling**: Tailwind CSS
- **Components location**: `./components/ui`
- **Utils location**: `./lib/utils`
- **CSS file**: `./app/globals.css` or `./styles/globals.css`

## Configuration

### Environment Variables
No API keys required! Shadcn/UI MCP is completely free and open source.

### Project Structure Integration
The MCP expects your project to have:
```
project/
├── docs/
│   ├── 03-ux-design.md          # UX patterns and user flows
│   └── 04-design-system.md      # Design tokens and component specs
├── components/
│   └── ui/                      # Generated shadcn/ui components
├── lib/
│   └── utils.ts                 # Utility functions
├── tailwind.config.js           # Tailwind configuration
└── package.json
```

### Design System Integration
The MCP automatically reads your design system specifications from Step 4:
- **Color Tokens**: Primary, secondary, accent colors
- **Typography Scale**: Font sizes, weights, line heights
- **Spacing System**: Margin and padding scales
- **Border Radius**: Consistent radius values
- **Shadow System**: Elevation and shadow definitions

## Usage Patterns

### Component Generation Commands
Use these patterns in your Vibe Coding phases:

#### Basic Component Generation
```markdown
- [ ] Create Button component with design system integration
  - [ ] Use shadcn/ui: "Generate a Button component with primary, secondary, and ghost variants using the color tokens from docs/04-design-system.md"
  - [ ] Apply spacing and typography from established design system
  - [ ] Include accessibility features and focus states
```

#### Complex Component Generation
```markdown
- [ ] Create Navigation component with responsive design
  - [ ] Use shadcn/ui: "Generate a responsive Navigation component with mobile menu, using typography scale and color tokens from docs/04-design-system.md"
  - [ ] Reference user flows from docs/03-ux-design.md for navigation patterns
  - [ ] Include proper ARIA labels and keyboard navigation
```

#### Form Component Generation
```markdown
- [ ] Create Contact Form with validation
  - [ ] Use shadcn/ui: "Generate a Contact Form component with validation, using input styling and spacing from docs/04-design-system.md"
  - [ ] Apply error state colors and typography from design system
  - [ ] Include form validation and submission states
```

## Integration with Vibe Coding Steps

### Step 4: Design System Agent
When Step 4 generates your design system, ensure it includes:
```markdown
## Component Specifications

### Button System
- **Primary Button**: Uses primary color token with high contrast text
- **Secondary Button**: Uses secondary color with appropriate contrast
- **Ghost Button**: Transparent background with primary text color
- **Sizing**: Small (32px), Medium (40px), Large (48px) heights
- **Border Radius**: 6px for consistency with design language

### Typography Scale
- **Heading 1**: 2.25rem (36px) / font-weight: 700
- **Heading 2**: 1.875rem (30px) / font-weight: 600
- **Body Text**: 1rem (16px) / font-weight: 400
- **Small Text**: 0.875rem (14px) / font-weight: 400

### Color Tokens
- **Primary**: #3b82f6 (Blue-500)
- **Secondary**: #6b7280 (Gray-500)
- **Accent**: #10b981 (Emerald-500)
- **Error**: #ef4444 (Red-500)
- **Warning**: #f59e0b (Amber-500)
- **Success**: #10b981 (Emerald-500)
```

### Step 5: Interface States Agent
Ensure interface states reference shadcn/ui components:
```markdown
## Component States

### Button States
- **Default**: Normal button appearance using shadcn/ui Button component
- **Hover**: Subtle background color change with transition
- **Active**: Pressed state with slight scale transform
- **Disabled**: Reduced opacity with cursor-not-allowed
- **Loading**: Spinner component with disabled interaction
```

### Step 8: Universal Format Integration
In your Universal Format phases, use this pattern:
```markdown
#### Subtask 2.1: Primary Feature Implementation
- [ ] Before starting, use Context7 MCP to fetch latest React best practices
- [ ] Use Perplexity MCP to research component accessibility patterns
- [ ] [Create Dashboard Layout Component]
  - [ ] Use shadcn/ui: "Generate a responsive Dashboard Layout with sidebar navigation, header, and main content area using the design system from docs/04-design-system.md"
  - [ ] Reference: Design system from `docs/04-design-system.md`
  - [ ] Apply component patterns from `docs/03-ux-design.md`
  - [ ] Use established color tokens, typography, and spacing from Step 4
  - [ ] Include proper semantic HTML structure and ARIA labels
- [ ] [Integration with existing systems]
- [ ] **Git Checkpoint**: `git commit -m "feat(dashboard): Add responsive dashboard layout component"`
```

## Available Shadcn/UI Components

### Basic Components
- **Button**: Various styles and sizes
- **Input**: Text inputs with validation states
- **Label**: Form labels with proper associations
- **Textarea**: Multi-line text inputs
- **Select**: Dropdown selection components
- **Checkbox**: Checkbox inputs with custom styling
- **Radio Group**: Radio button groups
- **Switch**: Toggle switches

### Layout Components
- **Card**: Content containers with consistent styling
- **Sheet**: Side panels and overlays
- **Dialog**: Modal dialogs and confirmations
- **Popover**: Contextual popovers and tooltips
- **Tabs**: Tabbed content navigation
- **Accordion**: Collapsible content sections

### Navigation Components
- **Navigation Menu**: Complex navigation structures
- **Breadcrumb**: Hierarchical navigation
- **Pagination**: Page navigation controls
- **Command**: Command palette and search

### Data Display
- **Table**: Data tables with sorting and filtering
- **Badge**: Status and category indicators
- **Avatar**: User profile images and placeholders
- **Progress**: Progress bars and indicators
- **Skeleton**: Loading state placeholders

### Feedback Components
- **Alert**: Status messages and notifications
- **Toast**: Temporary notification messages
- **Alert Dialog**: Important confirmations
- **Loading Spinner**: Loading state indicators

## Best Practices

### Design System Consistency
1. **Always Reference Design System**: Include path to `docs/04-design-system.md` in component generation
2. **Use Established Tokens**: Reference specific color, typography, and spacing tokens
3. **Maintain Component Hierarchy**: Follow the component patterns established in Step 4
4. **Accessibility First**: Include ARIA labels and keyboard navigation in all components

### Component Organization
1. **Consistent Naming**: Use descriptive component names that match design system
2. **Proper File Structure**: Place components in `./components/ui/` as expected by shadcn/ui
3. **Export Consistency**: Use consistent export patterns for reusability
4. **Documentation**: Include component documentation with props and usage examples

### Integration Patterns
1. **State Management**: Integrate components with your chosen state management solution
2. **Form Handling**: Use with form libraries like React Hook Form or Formik
3. **Routing**: Integrate navigation components with your routing solution
4. **Theme Integration**: Ensure components respect dark/light mode preferences

## Troubleshooting

### Common Issues

#### Component Styling Not Applied
**Problem**: Generated components don't match design system
**Solution**: 
1. Verify `docs/04-design-system.md` contains specific color tokens and typography
2. Check Tailwind configuration includes design system colors
3. Ensure shadcn/ui configuration matches your project structure

#### Design System Path Not Found
**Problem**: MCP can't locate design system files
**Solution**:
1. Verify file paths in MCP configuration
2. Ensure Steps 3 and 4 have been completed
3. Check file permissions and accessibility

#### Component Generation Errors
**Problem**: shadcn/ui commands fail during generation
**Solution**:
1. Verify shadcn/ui is properly installed in project
2. Check Tailwind CSS configuration
3. Ensure project structure matches expected layout

### Validation Commands
Test your shadcn/ui MCP installation:
```bash
# Test basic component generation
npx shadcn-ui@latest add button

# Verify design system integration
npx shadcn-ui@latest list

# Check Tailwind configuration
npx tailwindcss --help
```

## Advanced Configuration

### Custom Component Templates
Create custom component templates that match your design system:
```typescript
// components/ui/custom-button.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  // ... other props based on design system
}

export function CustomButton({ variant = 'primary', size = 'md', ...props }: CustomButtonProps) {
  return (
    <Button
      className={cn(
        // Apply design system specific styles
        "transition-all duration-200",
        variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        // ... size and other variant styles
      )}
      {...props}
    />
  )
}
```

### Theme Integration
Configure theme support based on your design system:
```typescript
// lib/theme.ts
export const theme = {
  colors: {
    // Colors from docs/04-design-system.md
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    // ... other design system colors
  },
  typography: {
    // Typography from design system
    fontSizes: {
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      // ... other sizes
    }
  }
}
```

## Integration Examples

### Complete Component Generation Workflow
1. **Read Design System**: MCP automatically reads `docs/04-design-system.md`
2. **Generate Component**: Create component with design system integration
3. **Apply Styling**: Use established tokens and patterns
4. **Add Accessibility**: Include proper ARIA labels and keyboard support
5. **Test Integration**: Verify component works with existing design system

### Example Phase Implementation
```markdown
### Tier 2 Task - User Authentication Interface

#### Subtask 2.1: Login Form Component
- [ ] Before starting, use Context7 MCP to fetch latest React authentication patterns
- [ ] Use Perplexity MCP to research form validation best practices
- [ ] Create responsive login form with validation
  - [ ] Use shadcn/ui: "Generate a Login Form component with email/password inputs, validation states, and submit button using the design system from docs/04-design-system.md"
  - [ ] Reference: Form patterns from `docs/03-ux-design.md`
  - [ ] Apply input styling and error states from `docs/04-design-system.md`
  - [ ] Include proper form validation and accessibility features
  - [ ] Use established color tokens for success/error states
- [ ] Integrate form with authentication system
- [ ] Add loading states and error handling
- [ ] **Git Checkpoint**: `git commit -m "feat(auth): Add login form component with validation"`
```

---

**Shadcn/UI MCP provides a powerful, free solution for maintaining design system consistency while generating production-ready React components! 🎨**