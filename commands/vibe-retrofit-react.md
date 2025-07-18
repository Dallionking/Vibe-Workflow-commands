# vibe-retrofit-react

Modernize React components systematically - upgrade patterns, improve performance, and enhance maintainability.

## Usage
```
/vibe-retrofit-react [component-pattern] [options]
```

## Parameters
- `component-pattern` - Optional pattern to match components (e.g., "components/legacy/*")

## Options
- `--to-functional` - Convert class components to functional
- `--add-hooks` - Migrate to React Hooks
- `--add-typescript` - Add TypeScript types
- `--optimize-renders` - Add memo, useMemo, useCallback
- `--modernize-state` - Update state management patterns
- `--add-tests` - Generate component tests
- `--add-storybook` - Create Storybook stories
- `--dry-run` - Preview changes

## Modernization Features

### Component Upgrades
1. **Class to Functional**
   - Convert class components
   - Migrate lifecycle methods to hooks
   - Update state management
   - Preserve component logic

2. **Hooks Migration**
   - useState for local state
   - useEffect for side effects
   - useContext for context
   - Custom hooks extraction

3. **TypeScript Integration**
   - Add component prop types
   - Define state interfaces
   - Type event handlers
   - Generic component types

4. **Performance Optimization**
   - React.memo for pure components
   - useMemo for expensive computations
   - useCallback for stable callbacks
   - Code splitting with lazy/Suspense

### Code Quality
- **Testing**: Generate Jest/RTL tests
- **Documentation**: Add JSDoc comments
- **Storybook**: Create component stories
- **Accessibility**: Add ARIA attributes

## Examples
```bash
# Retrofit all components
/vibe-retrofit-react

# Target specific directory
/vibe-retrofit-react "components/legacy/*"

# Convert to functional with hooks
/vibe-retrofit-react --to-functional --add-hooks

# Full modernization
/vibe-retrofit-react --to-functional --add-hooks --add-typescript --optimize-renders

# Add testing and documentation
/vibe-retrofit-react --add-tests --add-storybook
```

## Smart Features
- **Pattern Detection**: Identifies existing patterns
- **Style Preservation**: Maintains CSS/styling approach
- **Import Organization**: Cleans up imports
- **PropTypes to TypeScript**: Automatic conversion
- **Hook Suggestions**: Recommends custom hooks

## Output
- Modernized component files
- TypeScript definitions
- Test files (*.test.tsx)
- Storybook stories (*.stories.tsx)
- Migration report
- Performance improvements

## Safety
- Preserves component behavior
- Maintains API compatibility
- Creates backups before changes
- Validates with existing tests