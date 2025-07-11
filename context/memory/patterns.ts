/**
 * Pattern Recognition System
 * Identifies and learns patterns from code and development practices
 */

import { Pattern, PatternUsage } from '../types/context.types';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

export class PatternRecognizer {
  private projectRoot: string;
  private patterns: Map<string, Pattern> = new Map();
  private minConfidenceThreshold = 70;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async analyzeCodebase(): Promise<Pattern[]> {
    const detectedPatterns: Pattern[] = [];

    // Analyze component patterns
    const componentPatterns = await this.analyzeComponentPatterns();
    detectedPatterns.push(...componentPatterns);

    // Analyze API patterns
    const apiPatterns = await this.analyzeAPIPatterns();
    detectedPatterns.push(...apiPatterns);

    // Analyze test patterns
    const testPatterns = await this.analyzeTestPatterns();
    detectedPatterns.push(...testPatterns);

    // Analyze style patterns
    const stylePatterns = await this.analyzeStylePatterns();
    detectedPatterns.push(...stylePatterns);

    // Analyze project structure
    const structurePatterns = await this.analyzeStructurePatterns();
    detectedPatterns.push(...structurePatterns);

    return detectedPatterns;
  }

  private async analyzeComponentPatterns(): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    const componentFiles = glob.sync(
      path.join(this.projectRoot, '**/*.{jsx,tsx}'),
      { ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] }
    );

    if (componentFiles.length === 0) return patterns;

    // Analyze import patterns
    const importPattern = this.detectImportPattern(componentFiles);
    if (importPattern) patterns.push(importPattern);

    // Analyze component structure
    const structurePattern = this.detectComponentStructure(componentFiles);
    if (structurePattern) patterns.push(structurePattern);

    // Analyze state management
    const statePattern = this.detectStatePattern(componentFiles);
    if (statePattern) patterns.push(statePattern);

    // Analyze prop patterns
    const propPattern = this.detectPropPattern(componentFiles);
    if (propPattern) patterns.push(propPattern);

    return patterns;
  }

  private detectImportPattern(files: string[]): Pattern | null {
    const importStyles: Record<string, number> = {
      named: 0,
      default: 0,
      namespace: 0
    };

    const importPaths: Record<string, number> = {
      relative: 0,
      alias: 0,
      package: 0
    };

    for (const file of files.slice(0, 20)) { // Sample first 20 files
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const imports = content.match(/import\s+(.+?)\s+from\s+['"](.+?)['"]/g) || [];

        imports.forEach(imp => {
          // Detect import style
          if (imp.includes('{')) importStyles.named++;
          else if (imp.includes('* as')) importStyles.namespace++;
          else importStyles.default++;

          // Detect import path style
          const pathMatch = imp.match(/from\s+['"](.+?)['"]/);
          if (pathMatch) {
            const importPath = pathMatch[1];
            if (importPath.startsWith('.')) importPaths.relative++;
            else if (importPath.startsWith('@/') || importPath.startsWith('~')) importPaths.alias++;
            else importPaths.package++;
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }

    // Determine dominant patterns
    const dominantStyle = Object.entries(importStyles)
      .sort(([, a], [, b]) => b - a)[0][0];
    
    const dominantPath = Object.entries(importPaths)
      .sort(([, a], [, b]) => b - a)[0][0];

    const totalImports = Object.values(importStyles).reduce((a, b) => a + b, 0);
    if (totalImports < 10) return null;

    const confidence = Math.min(95, 70 + (totalImports / 10));

    return {
      id: 'import-pattern',
      name: 'Import Style Pattern',
      type: 'component',
      pattern: `${dominantStyle} imports with ${dominantPath} paths`,
      examples: [
        dominantStyle === 'named' ? "import { Component } from './Component'" : 
        dominantStyle === 'default' ? "import Component from './Component'" :
        "import * as Components from './Components'"
      ],
      confidence,
      usage: {
        count: totalImports,
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: []
      }
    };
  }

  private detectComponentStructure(files: string[]): Pattern | null {
    const structures: Record<string, number> = {
      functional: 0,
      class: 0,
      arrow: 0
    };

    const hooks: Set<string> = new Set();

    for (const file of files.slice(0, 20)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Detect component type
        if (content.match(/function\s+\w+\s*\([^)]*\)\s*{/)) structures.functional++;
        if (content.match(/class\s+\w+\s+extends\s+(React\.)?Component/)) structures.class++;
        if (content.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>/)) structures.arrow++;

        // Detect hooks usage
        const hookMatches = content.match(/use[A-Z]\w+/g) || [];
        hookMatches.forEach(hook => hooks.add(hook));
      } catch (error) {
        // Skip
      }
    }

    const dominantStructure = Object.entries(structures)
      .sort(([, a], [, b]) => b - a)[0][0];

    const totalComponents = Object.values(structures).reduce((a, b) => a + b, 0);
    if (totalComponents < 5) return null;

    const commonHooks = Array.from(hooks).slice(0, 5);

    return {
      id: 'component-structure',
      name: 'Component Structure Pattern',
      type: 'component',
      pattern: `${dominantStructure} components with ${commonHooks.length > 0 ? 'hooks' : 'no hooks'}`,
      examples: [
        dominantStructure === 'functional' ? 
          `function MyComponent(props) {\n  ${commonHooks[0] ? `const state = ${commonHooks[0]}()` : ''}\n  return <div>...</div>\n}` :
        dominantStructure === 'arrow' ?
          `const MyComponent = (props) => {\n  return <div>...</div>\n}` :
          `class MyComponent extends Component {\n  render() {\n    return <div>...</div>\n  }\n}`
      ],
      confidence: 75 + (totalComponents / 2),
      usage: {
        count: totalComponents,
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: commonHooks
      }
    };
  }

  private detectStatePattern(files: string[]): Pattern | null {
    const stateManagement: Record<string, number> = {
      useState: 0,
      redux: 0,
      context: 0,
      mobx: 0,
      zustand: 0
    };

    for (const file of files.slice(0, 30)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        if (content.includes('useState')) stateManagement.useState++;
        if (content.includes('useSelector') || content.includes('useDispatch')) stateManagement.redux++;
        if (content.includes('useContext')) stateManagement.context++;
        if (content.includes('observer') || content.includes('observable')) stateManagement.mobx++;
        if (content.includes('useStore') && content.includes('zustand')) stateManagement.zustand++;
      } catch (error) {
        // Skip
      }
    }

    const usedPatterns = Object.entries(stateManagement)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a);

    if (usedPatterns.length === 0) return null;

    const primary = usedPatterns[0][0];
    const secondary = usedPatterns[1]?.[0];

    return {
      id: 'state-management',
      name: 'State Management Pattern',
      type: 'component',
      pattern: `${primary}${secondary ? ` with ${secondary}` : ''} for state management`,
      examples: [
        primary === 'useState' ? 'const [state, setState] = useState(initialValue)' :
        primary === 'redux' ? 'const data = useSelector(state => state.data)' :
        primary === 'context' ? 'const value = useContext(MyContext)' :
        'observable state management'
      ],
      confidence: 70 + Math.min(25, usedPatterns[0][1] * 2),
      usage: {
        count: Object.values(stateManagement).reduce((a, b) => a + b, 0),
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: usedPatterns.map(([name]) => name)
      }
    };
  }

  private detectPropPattern(files: string[]): Pattern | null {
    const propPatterns: Record<string, number> = {
      destructured: 0,
      props: 0,
      typed: 0,
      defaultProps: 0
    };

    for (const file of files.slice(0, 20)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Detect destructured props
        if (content.match(/function\s+\w+\s*\(\s*{[^}]+}\s*\)/)) propPatterns.destructured++;
        
        // Detect props object
        if (content.match(/function\s+\w+\s*\(props\)/)) propPatterns.props++;
        
        // Detect TypeScript props
        if (content.match(/:\s*(React\.)?FC<\w+>/) || content.match(/interface\s+\w+Props/)) {
          propPatterns.typed++;
        }
        
        // Detect default props
        if (content.includes('defaultProps')) propPatterns.defaultProps++;
      } catch (error) {
        // Skip
      }
    }

    const dominantPattern = Object.entries(propPatterns)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)[0];

    if (!dominantPattern || dominantPattern[1] < 3) return null;

    return {
      id: 'prop-pattern',
      name: 'Component Props Pattern',
      type: 'component',
      pattern: `${dominantPattern[0]} props pattern`,
      examples: [
        dominantPattern[0] === 'destructured' ? 'function Component({ prop1, prop2 }) { ... }' :
        dominantPattern[0] === 'props' ? 'function Component(props) { ... }' :
        dominantPattern[0] === 'typed' ? 'const Component: FC<ComponentProps> = (props) => { ... }' :
        'Component.defaultProps = { ... }'
      ],
      confidence: 70 + Math.min(25, dominantPattern[1] * 3),
      usage: {
        count: dominantPattern[1],
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: []
      }
    };
  }

  private async analyzeAPIPatterns(): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    const apiFiles = glob.sync(
      path.join(this.projectRoot, '**/*.{js,ts}'),
      { 
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.test.*', '**/*.spec.*']
      }
    );

    // Filter likely API files
    const likelyAPIFiles = apiFiles.filter(file => 
      file.includes('api') || 
      file.includes('routes') || 
      file.includes('controllers') ||
      file.includes('services')
    );

    if (likelyAPIFiles.length === 0) return patterns;

    // Detect HTTP method patterns
    const httpPattern = this.detectHTTPPattern(likelyAPIFiles);
    if (httpPattern) patterns.push(httpPattern);

    // Detect response patterns
    const responsePattern = this.detectResponsePattern(likelyAPIFiles);
    if (responsePattern) patterns.push(responsePattern);

    // Detect authentication patterns
    const authPattern = this.detectAuthPattern(likelyAPIFiles);
    if (authPattern) patterns.push(authPattern);

    return patterns;
  }

  private detectHTTPPattern(files: string[]): Pattern | null {
    const frameworks: Record<string, number> = {
      express: 0,
      fastify: 0,
      koa: 0,
      nextjs: 0,
      fetch: 0,
      axios: 0
    };

    const methods: Set<string> = new Set();

    for (const file of files.slice(0, 20)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Detect frameworks
        if (content.match(/app\.(get|post|put|delete|patch)/)) frameworks.express++;
        if (content.includes('fastify.')) frameworks.fastify++;
        if (content.includes('ctx.body')) frameworks.koa++;
        if (content.includes('NextApiRequest')) frameworks.nextjs++;
        if (content.includes('fetch(')) frameworks.fetch++;
        if (content.includes('axios.')) frameworks.axios++;

        // Detect HTTP methods
        const methodMatches = content.match(/\.(get|post|put|delete|patch|head|options)\(/gi) || [];
        methodMatches.forEach(m => methods.add(m.slice(1, -1).toUpperCase()));
      } catch (error) {
        // Skip
      }
    }

    const dominantFramework = Object.entries(frameworks)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)[0];

    if (!dominantFramework) return null;

    return {
      id: 'http-pattern',
      name: 'HTTP/API Pattern',
      type: 'api',
      pattern: `${dominantFramework[0]} for API with ${Array.from(methods).join(', ')} methods`,
      examples: [
        dominantFramework[0] === 'express' ? 'app.get("/api/users", (req, res) => { ... })' :
        dominantFramework[0] === 'axios' ? 'const response = await axios.get("/api/users")' :
        `${dominantFramework[0]} API implementation`
      ],
      confidence: 75 + Math.min(20, dominantFramework[1] * 2),
      usage: {
        count: dominantFramework[1],
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: Array.from(methods)
      }
    };
  }

  private detectResponsePattern(files: string[]): Pattern | null {
    const responsePatterns: Record<string, number> = {
      json: 0,
      statusCode: 0,
      structured: 0,
      errors: 0
    };

    const commonFields: Map<string, number> = new Map();

    for (const file of files.slice(0, 20)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Detect JSON responses
        if (content.match(/res\.json\(|response\.json\(/)) responsePatterns.json++;
        
        // Detect status code usage
        if (content.match(/status\((\d+)\)/)) responsePatterns.statusCode++;
        
        // Detect structured responses
        const structuredMatches = content.match(/{\s*(data|result|payload):\s*[^,}]+,?\s*(error|message|status):\s*[^}]+}/g) || [];
        responsePatterns.structured += structuredMatches.length;
        
        // Detect error handling
        if (content.match(/catch|error|throw/)) responsePatterns.errors++;

        // Extract common response fields
        const fieldMatches = content.match(/[{,]\s*(\w+):\s*[^,}]+/g) || [];
        fieldMatches.forEach(match => {
          const field = match.match(/(\w+):/)?.[1];
          if (field && ['data', 'error', 'message', 'status', 'success', 'result'].includes(field)) {
            commonFields.set(field, (commonFields.get(field) || 0) + 1);
          }
        });
      } catch (error) {
        // Skip
      }
    }

    const hasStructuredResponses = responsePatterns.structured > 3;
    const topFields = Array.from(commonFields.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([field]) => field);

    if (topFields.length === 0) return null;

    return {
      id: 'response-pattern',
      name: 'API Response Pattern',
      type: 'api',
      pattern: hasStructuredResponses ? 
        `Structured JSON responses with fields: ${topFields.join(', ')}` :
        'Simple JSON responses',
      examples: [
        `{\n  ${topFields.map(f => `${f}: ${f === 'success' ? 'true' : '...'}`).join(',\n  ')}\n}`
      ],
      confidence: 70 + Math.min(25, responsePatterns.structured * 2),
      usage: {
        count: Object.values(responsePatterns).reduce((a, b) => a + b, 0),
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: topFields
      }
    };
  }

  private detectAuthPattern(files: string[]): Pattern | null {
    const authPatterns: Record<string, number> = {
      jwt: 0,
      session: 0,
      oauth: 0,
      basic: 0,
      apiKey: 0
    };

    for (const file of files.slice(0, 30)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        if (content.match(/jwt|jsonwebtoken/i)) authPatterns.jwt++;
        if (content.match(/session|express-session/i)) authPatterns.session++;
        if (content.match(/oauth|passport/i)) authPatterns.oauth++;
        if (content.match(/basic\s*auth|authorization:\s*basic/i)) authPatterns.basic++;
        if (content.match(/api[_-]?key|x-api-key/i)) authPatterns.apiKey++;
      } catch (error) {
        // Skip
      }
    }

    const usedAuth = Object.entries(authPatterns)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a);

    if (usedAuth.length === 0) return null;

    return {
      id: 'auth-pattern',
      name: 'Authentication Pattern',
      type: 'api',
      pattern: `${usedAuth[0][0]} authentication`,
      examples: [
        usedAuth[0][0] === 'jwt' ? 'Bearer token authentication with JWT' :
        usedAuth[0][0] === 'session' ? 'Session-based authentication' :
        usedAuth[0][0] === 'oauth' ? 'OAuth 2.0 authentication flow' :
        `${usedAuth[0][0]} authentication method`
      ],
      confidence: 70 + Math.min(25, usedAuth[0][1] * 3),
      usage: {
        count: usedAuth[0][1],
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: usedAuth.map(([type]) => type)
      }
    };
  }

  private async analyzeTestPatterns(): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    const testFiles = glob.sync(
      path.join(this.projectRoot, '**/*.{test,spec}.{js,ts,jsx,tsx}'),
      { ignore: ['**/node_modules/**'] }
    );

    if (testFiles.length === 0) return patterns;

    // Detect testing framework
    const frameworkPattern = this.detectTestFramework(testFiles);
    if (frameworkPattern) patterns.push(frameworkPattern);

    // Detect test structure pattern
    const structurePattern = this.detectTestStructure(testFiles);
    if (structurePattern) patterns.push(structurePattern);

    return patterns;
  }

  private detectTestFramework(files: string[]): Pattern | null {
    const frameworks: Record<string, number> = {
      jest: 0,
      mocha: 0,
      vitest: 0,
      jasmine: 0,
      ava: 0
    };

    for (const file of files.slice(0, 20)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        if (content.includes('jest.') || content.includes('expect(')) frameworks.jest++;
        if (content.includes('mocha') || content.includes('chai')) frameworks.mocha++;
        if (content.includes('vitest')) frameworks.vitest++;
        if (content.includes('jasmine')) frameworks.jasmine++;
        if (content.includes('test.serial')) frameworks.ava++;
      } catch (error) {
        // Skip
      }
    }

    const dominant = Object.entries(frameworks)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)[0];

    if (!dominant) return null;

    return {
      id: 'test-framework',
      name: 'Testing Framework Pattern',
      type: 'test',
      pattern: `${dominant[0]} testing framework`,
      examples: [
        dominant[0] === 'jest' ? 'describe("Component", () => { test("should...", () => { ... }) })' :
        dominant[0] === 'vitest' ? 'import { describe, it, expect } from "vitest"' :
        `${dominant[0]} test structure`
      ],
      confidence: 80 + Math.min(15, dominant[1] * 2),
      usage: {
        count: dominant[1],
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: []
      }
    };
  }

  private detectTestStructure(files: string[]): Pattern | null {
    const structures: Record<string, number> = {
      describe: 0,
      test: 0,
      it: 0,
      nested: 0
    };

    for (const file of files.slice(0, 20)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        if (content.includes('describe(')) structures.describe++;
        if (content.includes('test(')) structures.test++;
        if (content.includes('it(')) structures.it++;
        
        // Check for nested describes
        if (content.match(/describe\([^)]+\)\s*{\s*describe\(/)) structures.nested++;
      } catch (error) {
        // Skip
      }
    }

    const useDescribe = structures.describe > structures.test;
    const useIt = structures.it > structures.test;
    const useNested = structures.nested > files.length * 0.3;

    return {
      id: 'test-structure',
      name: 'Test Structure Pattern',
      type: 'test',
      pattern: `${useDescribe ? 'describe' : 'test'} blocks with ${useIt ? 'it' : 'test'} assertions${useNested ? ' (nested)' : ''}`,
      examples: [
        useDescribe ? 
          `describe('Feature', () => {\n  ${useIt ? 'it' : 'test'}('should work', () => {\n    expect(result).toBe(expected)\n  })\n})` :
          `test('Feature works', () => {\n  expect(result).toBe(expected)\n})`
      ],
      confidence: 75,
      usage: {
        count: Math.max(structures.describe, structures.test),
        lastUsed: new Date(),
        locations: files.slice(0, 5),
        variations: []
      }
    };
  }

  private async analyzeStylePatterns(): Promise<Pattern[]> {
    const patterns: Pattern[] = [];
    const styleFiles = glob.sync(
      path.join(this.projectRoot, '**/*.{css,scss,sass,less,styled.js,styled.ts}'),
      { ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] }
    );

    const componentFiles = glob.sync(
      path.join(this.projectRoot, '**/*.{jsx,tsx}'),
      { ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] }
    );

    // Detect styling approach
    const styleApproach = this.detectStyleApproach(styleFiles, componentFiles);
    if (styleApproach) patterns.push(styleApproach);

    return patterns;
  }

  private detectStyleApproach(styleFiles: string[], componentFiles: string[]): Pattern | null {
    const approaches: Record<string, number> = {
      css: 0,
      cssModules: 0,
      styledComponents: 0,
      emotion: 0,
      tailwind: 0,
      sass: 0
    };

    // Check style files
    styleFiles.forEach(file => {
      if (file.endsWith('.css')) approaches.css++;
      if (file.includes('.module.')) approaches.cssModules++;
      if (file.endsWith('.scss') || file.endsWith('.sass')) approaches.sass++;
      if (file.includes('styled')) approaches.styledComponents++;
    });

    // Check component files for inline styles
    for (const file of componentFiles.slice(0, 20)) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        if (content.includes('styled.') || content.includes('styled(')) approaches.styledComponents++;
        if (content.includes('@emotion') || content.includes('css`')) approaches.emotion++;
        if (content.match(/className=["'][^"']*(?:flex|grid|p-|m-|bg-)/)) approaches.tailwind++;
      } catch (error) {
        // Skip
      }
    }

    const dominant = Object.entries(approaches)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)[0];

    if (!dominant || dominant[1] < 2) return null;

    return {
      id: 'style-approach',
      name: 'Styling Approach Pattern',
      type: 'style',
      pattern: `${dominant[0]} for styling`,
      examples: [
        dominant[0] === 'tailwind' ? 'className="flex items-center p-4 bg-blue-500"' :
        dominant[0] === 'styledComponents' ? 'const Button = styled.button`...`' :
        dominant[0] === 'cssModules' ? 'import styles from "./Component.module.css"' :
        `${dominant[0]} styling approach`
      ],
      confidence: 70 + Math.min(25, dominant[1] * 2),
      usage: {
        count: dominant[1],
        lastUsed: new Date(),
        locations: [...styleFiles.slice(0, 3), ...componentFiles.slice(0, 2)],
        variations: []
      }
    };
  }

  private async analyzeStructurePatterns(): Promise<Pattern[]> {
    const patterns: Pattern[] = [];

    // Analyze directory structure
    const structure = this.analyzeDirectoryStructure();
    if (structure) patterns.push(structure);

    return patterns;
  }

  private analyzeDirectoryStructure(): Pattern | null {
    const directories = glob.sync(
      path.join(this.projectRoot, '**/'),
      { ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**'] }
    );

    const structureIndicators: Record<string, number> = {
      feature: 0,
      layer: 0,
      domain: 0,
      type: 0
    };

    // Check for feature-based structure
    if (directories.some(d => d.includes('/features/') || d.includes('/modules/'))) {
      structureIndicators.feature = 10;
    }

    // Check for layer-based structure
    const layers = ['controllers', 'services', 'models', 'views', 'components'];
    layers.forEach(layer => {
      if (directories.some(d => d.includes(`/${layer}/`))) {
        structureIndicators.layer++;
      }
    });

    // Check for domain-based structure
    if (directories.some(d => d.match(/\/(user|auth|product|order)s?\//))) {
      structureIndicators.domain = 5;
    }

    // Check for type-based structure
    const types = ['components', 'hooks', 'utils', 'types', 'styles'];
    types.forEach(type => {
      if (directories.some(d => d.includes(`/${type}/`))) {
        structureIndicators.type++;
      }
    });

    const dominant = Object.entries(structureIndicators)
      .sort(([, a], [, b]) => b - a)[0];

    if (dominant[1] < 3) return null;

    return {
      id: 'project-structure',
      name: 'Project Structure Pattern',
      type: 'structure',
      pattern: `${dominant[0]}-based project structure`,
      examples: [
        dominant[0] === 'feature' ? 'src/features/auth/components/LoginForm.tsx' :
        dominant[0] === 'layer' ? 'src/controllers/UserController.ts' :
        dominant[0] === 'domain' ? 'src/user/services/UserService.ts' :
        'src/components/Button/Button.tsx'
      ],
      confidence: 70 + Math.min(25, dominant[1] * 3),
      usage: {
        count: dominant[1],
        lastUsed: new Date(),
        locations: directories.slice(0, 5),
        variations: []
      }
    };
  }

  matchPattern(code: string, patternId: string): number {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return 0;

    // Simple similarity check - can be enhanced with more sophisticated algorithms
    let score = 0;
    
    // Check if code contains pattern examples
    pattern.examples.forEach(example => {
      if (code.includes(example)) score += 30;
    });

    // Check for pattern variations
    pattern.usage.variations.forEach(variation => {
      if (code.includes(variation)) score += 10;
    });

    // Additional pattern-specific checks
    switch (pattern.type) {
      case 'component':
        score += this.matchComponentPattern(code, pattern);
        break;
      case 'api':
        score += this.matchAPIPattern(code, pattern);
        break;
      case 'test':
        score += this.matchTestPattern(code, pattern);
        break;
    }

    return Math.min(100, score);
  }

  private matchComponentPattern(code: string, pattern: Pattern): number {
    let score = 0;

    if (pattern.id === 'import-pattern') {
      // Check import style consistency
      const imports = code.match(/import\s+.+\s+from/g) || [];
      const consistent = imports.every(imp => 
        pattern.pattern.includes('named') ? imp.includes('{') :
        pattern.pattern.includes('default') ? !imp.includes('{') :
        true
      );
      if (consistent) score += 20;
    }

    return score;
  }

  private matchAPIPattern(code: string, pattern: Pattern): number {
    let score = 0;

    if (pattern.id === 'response-pattern') {
      // Check response structure
      pattern.usage.variations.forEach(field => {
        if (code.includes(`${field}:`)) score += 5;
      });
    }

    return score;
  }

  private matchTestPattern(code: string, pattern: Pattern): number {
    let score = 0;

    if (pattern.id === 'test-structure') {
      // Check test structure consistency
      const hasDescribe = code.includes('describe(');
      const expectedDescribe = pattern.pattern.includes('describe');
      if (hasDescribe === expectedDescribe) score += 20;
    }

    return score;
  }

  async findSimilarPatterns(code: string, minSimilarity: number = 70): Promise<Pattern[]> {
    const patterns = await this.analyzeCodebase();
    const similar: Array<{ pattern: Pattern; score: number }> = [];

    patterns.forEach(pattern => {
      const score = this.matchPattern(code, pattern.id);
      if (score >= minSimilarity) {
        similar.push({ pattern, score });
      }
    });

    return similar
      .sort((a, b) => b.score - a.score)
      .map(s => s.pattern);
  }
}