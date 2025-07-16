/**
 * Type declarations for tree-sitter
 * This provides TypeScript types for the tree-sitter library
 */

declare module 'tree-sitter' {
  export interface Point {
    row: number;
    column: number;
  }

  export interface Range {
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
  }

  export interface Node {
    type: string;
    text: string;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
    parent: Node | null;
    children: Node[];
    namedChildren: Node[];
    childCount: number;
    namedChildCount: number;
    firstChild: Node | null;
    firstNamedChild: Node | null;
    lastChild: Node | null;
    lastNamedChild: Node | null;
    nextSibling: Node | null;
    nextNamedSibling: Node | null;
    previousSibling: Node | null;
    previousNamedSibling: Node | null;
    
    hasChanges(): boolean;
    hasError(): boolean;
    isNamed(): boolean;
    isMissing(): boolean;
    toString(): string;
    child(index: number): Node | null;
    namedChild(index: number): Node | null;
    childForFieldName(fieldName: string): Node | null;
    childrenForFieldName(fieldName: string): Node[];
    fieldNameForChild(index: number): string | null;
    descendantForIndex(index: number): Node;
    descendantForIndex(startIndex: number, endIndex: number): Node;
    namedDescendantForIndex(index: number): Node;
    namedDescendantForIndex(startIndex: number, endIndex: number): Node;
    descendantForPosition(position: Point): Node;
    descendantForPosition(startPosition: Point, endPosition: Point): Node;
    namedDescendantForPosition(position: Point): Node;
    namedDescendantForPosition(startPosition: Point, endPosition: Point): Node;
    descendantsOfType(type: string, startPosition?: Point, endPosition?: Point): Node[];
    walk(): TreeCursor;
  }

  export interface TreeCursor {
    nodeType: string;
    nodeText: string;
    nodeIsNamed: boolean;
    nodeIsMissing: boolean;
    currentNode(): Node;
    currentFieldName(): string | null;
    currentDepth(): number;
    reset(node: Node): void;
    gotoParent(): boolean;
    gotoFirstChild(): boolean;
    gotoFirstChildForIndex(index: number): boolean;
    gotoNextSibling(): boolean;
  }

  export interface Tree {
    rootNode: Node;
    edit(edit: Edit): void;
    walk(): TreeCursor;
    getChangedRanges(other: Tree): Range[];
    getEditedRange(other: Tree): Range;
  }

  export interface Edit {
    startIndex: number;
    oldEndIndex: number;
    newEndIndex: number;
    startPosition: Point;
    oldEndPosition: Point;
    newEndPosition: Point;
  }

  export interface Query {
    captureNames: string[];
    matches(node: Node, startPosition?: Point, endPosition?: Point): QueryMatch[];
    captures(node: Node, startPosition?: Point, endPosition?: Point): QueryCapture[];
  }

  export interface QueryMatch {
    pattern: number;
    captures: QueryCapture[];
  }

  export interface QueryCapture {
    name: string;
    node: Node;
  }

  export interface Language {
    version: number;
    fieldCount: number;
    stateCount: number;
    nodeTypeCount: number;
    fieldNameForId(id: number): string | null;
    fieldIdForName(name: string): number | null;
    idForNodeType(type: string, named: boolean): number;
    nodeTypeForId(id: number): string | null;
    nodeTypeIsNamed(id: number): boolean;
    nodeTypeIsVisible(id: number): boolean;
    query(source: string): Query;
  }

  export default class Parser {
    constructor();
    parse(input: string | ((index: number, position?: Point) => string | null), oldTree?: Tree, options?: { includedRanges?: Range[] }): Tree;
    getLanguage(): Language | null;
    setLanguage(language: Language | null): void;
    getLogger(): Logger | null;
    setLogger(logger: Logger | null): void;
    printDotGraphs(fd: number): void;
    
    static Language: {
      load(path: string): Language;
    };
  }

  export interface Logger {
    log(message: string, params: Record<string, string>, type: 'parse' | 'lex'): void;
  }
}