---
description: Comprehensive UI testing, visual regression, and automatic healing
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
  - mcp__playwright__*
  - mcp__context7__*
parameters:
  - pages
  - threshold
  - browsers
  - options
---

# UI Healer - Comprehensive UI Testing & Auto-Healing

Advanced UI testing with browser compatibility, visual regression, accessibility, and automatic healing capabilities.

## Usage
`/ui-healer --pages=[pages] --threshold=[0-100] [options]`

## Options
- `--pages` - Pages to test (comma-separated URLs or "all")
- `--threshold` - UI quality threshold (0-100, default: 85)
- `--browsers` - Browsers to test (chrome, firefox, safari, edge)
- `--visual-regression` - Enable visual regression testing
- `--accessibility` - Run WCAG 2.1 AA compliance tests
- `--responsive` - Test responsive design breakpoints
- `--heal` - Automatically fix UI issues found
- `--mode` - Testing mode (quick, standard, comprehensive)
- `--report` - Report format (summary, detailed, json)

## Features
- Cross-browser compatibility testing
- Visual regression detection
- Accessibility compliance (WCAG 2.1 AA)
- Responsive design validation
- Automatic UI healing
- Performance metrics
- Before/after screenshots

ARGUMENTS: $ARGUMENTS
