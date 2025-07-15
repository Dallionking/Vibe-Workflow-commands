/**
 * Pattern Classification Engine
 * Phase 2: Retrofit Context Enhancement
 * 
 * Classifies and categorizes detected patterns using machine learning approaches
 * and rule-based classification for intelligent pattern organization
 */

import {
  CodePattern,
  PatternType,
  PatternCategory,
  SupportedLanguage,
  ContextPriority,
  PatternMetadata
} from '../types/retrofit.types';

export interface ClassificationRule {
  id: string;
  name: string;
  condition: (pattern: CodePattern) => boolean;
  category: PatternCategory;
  priority: ContextPriority;
  confidence: number;
}

export interface ClassificationResult {
  pattern: CodePattern;
  originalCategory: PatternCategory;
  suggestedCategory: PatternCategory;
  confidence: number;
  reasoning: string[];
  reclassified: boolean;
}

export interface PatternCluster {
  id: string;
  name: string;
  description: string;
  patterns: CodePattern[];
  centroid: PatternVector;
  category: PatternCategory;
  confidence: number;
}

export interface PatternVector {
  features: Map<string, number>;
  magnitude: number;
}

export class PatternClassifier {
  private classificationRules: ClassificationRule[] = [];
  private patternClusters: Map<string, PatternCluster> = new Map();
  private patternVectors: Map<string, PatternVector> = new Map();
  private categoryThresholds: Map<PatternCategory, number> = new Map();
  private languageWeights: Map<SupportedLanguage, number> = new Map();

  constructor() {
    this.initializeClassificationRules();
    this.initializeCategoryThresholds();
    this.initializeLanguageWeights();
  }

  /**
   * Classify a single pattern
   */
  public classifyPattern(pattern: CodePattern): ClassificationResult {
    const vector = this.extractPatternVector(pattern);
    this.patternVectors.set(pattern.id, vector);

    // Apply rule-based classification
    const ruleResults = this.applyClassificationRules(pattern);
    
    // Apply clustering-based classification
    const clusterResult = this.findBestCluster(pattern, vector);
    
    // Combine results using ensemble method
    const finalResult = this.combineClassificationResults(pattern, ruleResults, clusterResult);
    
    return finalResult;
  }

  /**
   * Classify multiple patterns in batch
   */
  public classifyPatterns(patterns: CodePattern[]): ClassificationResult[] {
    const results: ClassificationResult[] = [];
    
    // First pass: classify individual patterns
    for (const pattern of patterns) {
      const result = this.classifyPattern(pattern);
      results.push(result);
    }
    
    // Second pass: refine classifications based on context
    this.refineClassificationsWithContext(results);
    
    // Third pass: update clusters with new patterns
    this.updateClusters(results);
    
    return results;
  }

  /**
   * Learn from user feedback to improve classification
   */
  public learnFromFeedback(
    pattern: CodePattern,
    correctCategory: PatternCategory,
    confidence: number
  ): void {
    // Update pattern metadata
    pattern.metadata.category = correctCategory;
    
    // Create or update classification rule based on feedback
    this.createFeedbackRule(pattern, correctCategory, confidence);
    
    // Update cluster assignments
    this.updateClusterWithFeedback(pattern, correctCategory);
    
    // Adjust category thresholds
    this.adjustCategoryThresholds(pattern, correctCategory, confidence);
  }

  /**
   * Get pattern recommendations based on classification
   */
  public getPatternRecommendations(
    targetCategory: PatternCategory,
    language?: SupportedLanguage
  ): CodePattern[] {
    const recommendations: CodePattern[] = [];
    
    // Find patterns in target category
    for (const cluster of this.patternClusters.values()) {
      if (cluster.category === targetCategory) {
        const filteredPatterns = language
          ? cluster.patterns.filter(p => p.language === language)
          : cluster.patterns;
        
        recommendations.push(...filteredPatterns);
      }
    }
    
    // Sort by confidence and stability
    return recommendations.sort((a, b) => {
      const scoreA = a.confidence * a.metadata.stability;
      const scoreB = b.confidence * b.metadata.stability;
      return scoreB - scoreA;
    });
  }

  /**
   * Initialize classification rules
   */
  private initializeClassificationRules(): void {
    // Critical patterns - must preserve exactly
    this.classificationRules.push({
      id: 'critical_naming',
      name: 'Critical Naming Patterns',
      condition: (pattern) => 
        pattern.type === PatternType.NAMING_CONVENTION && 
        pattern.confidence > 0.9 &&
        pattern.metadata.coverage > 0.8,
      category: PatternCategory.CRITICAL,
      priority: ContextPriority.CRITICAL,
      confidence: 0.95
    });

    this.classificationRules.push({
      id: 'critical_api',
      name: 'Critical API Patterns',
      condition: (pattern) =>
        pattern.type === PatternType.API_PATTERN &&
        pattern.confidence > 0.8 &&
        pattern.examples.length > 10,
      category: PatternCategory.CRITICAL,
      priority: ContextPriority.CRITICAL,
      confidence: 0.9
    });

    // Important patterns - should preserve
    this.classificationRules.push({
      id: 'important_structure',
      name: 'Important Structural Patterns',
      condition: (pattern) =>
        pattern.type === PatternType.COMPONENT_STRUCTURE &&
        pattern.confidence > 0.7,
      category: PatternCategory.IMPORTANT,
      priority: ContextPriority.HIGH,
      confidence: 0.8
    });

    this.classificationRules.push({
      id: 'important_error_handling',
      name: 'Important Error Handling',
      condition: (pattern) =>
        pattern.type === PatternType.ERROR_HANDLING &&
        pattern.confidence > 0.6,
      category: PatternCategory.IMPORTANT,
      priority: ContextPriority.HIGH,
      confidence: 0.75
    });

    // Preferred patterns - nice to preserve
    this.classificationRules.push({
      id: 'preferred_styling',
      name: 'Preferred Styling Patterns',
      condition: (pattern) =>
        pattern.type === PatternType.STYLING &&
        pattern.confidence > 0.5,
      category: PatternCategory.PREFERRED,
      priority: ContextPriority.MEDIUM,
      confidence: 0.7
    });

    // Optional patterns - can be changed
    this.classificationRules.push({
      id: 'optional_config',
      name: 'Optional Configuration Patterns',
      condition: (pattern) =>
        pattern.type === PatternType.CONFIGURATION &&
        pattern.confidence < 0.6,
      category: PatternCategory.OPTIONAL,
      priority: ContextPriority.LOW,
      confidence: 0.5
    });

    // Language-specific rules
    this.addLanguageSpecificRules();
  }

  /**
   * Add language-specific classification rules
   */
  private addLanguageSpecificRules(): void {
    // TypeScript-specific rules
    this.classificationRules.push({
      id: 'ts_interface_critical',
      name: 'TypeScript Interface Patterns',
      condition: (pattern) =>
        pattern.language === SupportedLanguage.TYPESCRIPT &&
        pattern.type === PatternType.COMPONENT_STRUCTURE &&
        pattern.name.toLowerCase().includes('interface'),
      category: PatternCategory.CRITICAL,
      priority: ContextPriority.CRITICAL,
      confidence: 0.9
    });

    // Python-specific rules
    this.classificationRules.push({
      id: 'python_snake_case',
      name: 'Python Snake Case Convention',
      condition: (pattern) =>
        pattern.language === SupportedLanguage.PYTHON &&
        pattern.type === PatternType.NAMING_CONVENTION &&
        pattern.name.includes('snake_case'),
      category: PatternCategory.CRITICAL,
      priority: ContextPriority.HIGH,
      confidence: 0.85
    });

    // Java-specific rules
    this.classificationRules.push({
      id: 'java_camel_case',
      name: 'Java CamelCase Convention',
      condition: (pattern) =>
        pattern.language === SupportedLanguage.JAVA &&
        pattern.type === PatternType.NAMING_CONVENTION &&
        pattern.name.includes('camelCase'),
      category: PatternCategory.CRITICAL,
      priority: ContextPriority.HIGH,
      confidence: 0.85
    });
  }

  /**
   * Initialize category thresholds
   */
  private initializeCategoryThresholds(): void {
    this.categoryThresholds.set(PatternCategory.CRITICAL, 0.9);
    this.categoryThresholds.set(PatternCategory.IMPORTANT, 0.7);
    this.categoryThresholds.set(PatternCategory.PREFERRED, 0.5);
    this.categoryThresholds.set(PatternCategory.OPTIONAL, 0.3);
  }

  /**
   * Initialize language weights for classification
   */
  private initializeLanguageWeights(): void {
    this.languageWeights.set(SupportedLanguage.TYPESCRIPT, 1.0);
    this.languageWeights.set(SupportedLanguage.JAVASCRIPT, 0.9);
    this.languageWeights.set(SupportedLanguage.PYTHON, 0.8);
    this.languageWeights.set(SupportedLanguage.JAVA, 0.8);
    this.languageWeights.set(SupportedLanguage.GO, 0.7);
    this.languageWeights.set(SupportedLanguage.RUST, 0.7);
    this.languageWeights.set(SupportedLanguage.GENERIC, 0.5);
  }

  /**
   * Extract feature vector from pattern
   */
  private extractPatternVector(pattern: CodePattern): PatternVector {
    const features = new Map<string, number>();
    
    // Basic features
    features.set('confidence', pattern.confidence);
    features.set('coverage', pattern.metadata.coverage);
    features.set('stability', pattern.metadata.stability);
    features.set('example_count', pattern.examples.length);
    
    // Type features
    features.set(`type_${pattern.type}`, 1.0);
    features.set(`language_${pattern.language}`, 1.0);
    
    // Priority features
    features.set(`priority_${pattern.metadata.priority}`, 1.0);
    
    // Frequency features
    const avgFrequency = pattern.examples.reduce((sum, ex) => sum + ex.frequency, 0) / 
                        Math.max(pattern.examples.length, 1);
    features.set('avg_frequency', avgFrequency / 100); // Normalize
    
    // Calculate magnitude
    let magnitude = 0;
    for (const value of features.values()) {
      magnitude += value * value;
    }
    magnitude = Math.sqrt(magnitude);
    
    return { features, magnitude };
  }

  /**
   * Apply rule-based classification
   */
  private applyClassificationRules(pattern: CodePattern): {
    category: PatternCategory;
    priority: ContextPriority;
    confidence: number;
    matchedRules: string[];
  } {
    const matchedRules: string[] = [];
    let bestCategory = pattern.metadata.category;
    let bestPriority = pattern.metadata.priority;
    let maxConfidence = 0;
    
    for (const rule of this.classificationRules) {
      if (rule.condition(pattern)) {
        matchedRules.push(rule.name);
        
        if (rule.confidence > maxConfidence) {
          bestCategory = rule.category;
          bestPriority = rule.priority;
          maxConfidence = rule.confidence;
        }
      }
    }
    
    return {
      category: bestCategory,
      priority: bestPriority,
      confidence: maxConfidence,
      matchedRules
    };
  }

  /**
   * Find best cluster for pattern using similarity
   */
  private findBestCluster(pattern: CodePattern, vector: PatternVector): {
    clusterId: string | null;
    similarity: number;
    category: PatternCategory;
  } {
    let bestCluster: string | null = null;
    let maxSimilarity = 0;
    let bestCategory = pattern.metadata.category;
    
    for (const [clusterId, cluster] of this.patternClusters.entries()) {
      const similarity = this.calculateSimilarity(vector, cluster.centroid);
      
      if (similarity > maxSimilarity && similarity > 0.7) {
        maxSimilarity = similarity;
        bestCluster = clusterId;
        bestCategory = cluster.category;
      }
    }
    
    return {
      clusterId: bestCluster,
      similarity: maxSimilarity,
      category: bestCategory
    };
  }

  /**
   * Calculate cosine similarity between vectors
   */
  private calculateSimilarity(vector1: PatternVector, vector2: PatternVector): number {
    if (vector1.magnitude === 0 || vector2.magnitude === 0) return 0;
    
    let dotProduct = 0;
    const allKeys = new Set([
      ...vector1.features.keys(),
      ...vector2.features.keys()
    ]);
    
    for (const key of allKeys) {
      const val1 = vector1.features.get(key) || 0;
      const val2 = vector2.features.get(key) || 0;
      dotProduct += val1 * val2;
    }
    
    return dotProduct / (vector1.magnitude * vector2.magnitude);
  }

  /**
   * Combine classification results using ensemble method
   */
  private combineClassificationResults(
    pattern: CodePattern,
    ruleResult: any,
    clusterResult: any
  ): ClassificationResult {
    const originalCategory = pattern.metadata.category;
    
    // Weight the results
    const ruleWeight = 0.7;
    const clusterWeight = 0.3;
    
    const ruleScore = ruleResult.confidence * ruleWeight;
    const clusterScore = clusterResult.similarity * clusterWeight;
    
    let suggestedCategory: PatternCategory;
    let confidence: number;
    const reasoning: string[] = [];
    
    if (ruleScore > clusterScore) {
      suggestedCategory = ruleResult.category;
      confidence = ruleResult.confidence;
      reasoning.push(`Rule-based classification: ${ruleResult.matchedRules.join(', ')}`);
    } else {
      suggestedCategory = clusterResult.category;
      confidence = clusterResult.similarity;
      reasoning.push(`Cluster-based classification: similar to cluster ${clusterResult.clusterId}`);
    }
    
    // Apply language-specific adjustments
    const languageWeight = this.languageWeights.get(pattern.language) || 0.5;
    confidence *= languageWeight;
    
    return {
      pattern,
      originalCategory,
      suggestedCategory,
      confidence,
      reasoning,
      reclassified: originalCategory !== suggestedCategory
    };
  }

  /**
   * Refine classifications based on context
   */
  private refineClassificationsWithContext(results: ClassificationResult[]): void {
    // Group patterns by file/module
    const fileGroups = new Map<string, ClassificationResult[]>();
    
    results.forEach(result => {
      const file = result.pattern.examples[0]?.location?.file || 'unknown';
      if (!fileGroups.has(file)) {
        fileGroups.set(file, []);
      }
      fileGroups.get(file)!.push(result);
    });
    
    // Apply contextual refinements
    for (const [file, groupResults] of fileGroups.entries()) {
      this.refineFileGroupClassifications(groupResults);
    }
  }

  /**
   * Refine classifications within a file group
   */
  private refineFileGroupClassifications(results: ClassificationResult[]): void {
    // If most patterns in a file are critical, upgrade borderline patterns
    const criticalCount = results.filter(r => 
      r.suggestedCategory === PatternCategory.CRITICAL
    ).length;
    
    const upgradeThreshold = 0.6;
    
    if (criticalCount / results.length > upgradeThreshold) {
      results.forEach(result => {
        if (result.suggestedCategory === PatternCategory.IMPORTANT && 
            result.confidence > 0.7) {
          result.suggestedCategory = PatternCategory.CRITICAL;
          result.confidence *= 1.1;
          result.reasoning.push('Upgraded due to critical file context');
          result.reclassified = true;
        }
      });
    }
  }

  /**
   * Update clusters with new patterns
   */
  private updateClusters(results: ClassificationResult[]): void {
    for (const result of results) {
      const clusterId = this.findOrCreateCluster(result);
      const cluster = this.patternClusters.get(clusterId);
      
      if (cluster) {
        cluster.patterns.push(result.pattern);
        this.updateClusterCentroid(cluster);
      }
    }
  }

  /**
   * Find or create appropriate cluster for pattern
   */
  private findOrCreateCluster(result: ClassificationResult): string {
    const pattern = result.pattern;
    const vector = this.patternVectors.get(pattern.id)!;
    
    // Try to find existing cluster
    for (const [clusterId, cluster] of this.patternClusters.entries()) {
      const similarity = this.calculateSimilarity(vector, cluster.centroid);
      if (similarity > 0.8) {
        return clusterId;
      }
    }
    
    // Create new cluster
    const newClusterId = `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCluster: PatternCluster = {
      id: newClusterId,
      name: `${result.suggestedCategory} ${pattern.type} Cluster`,
      description: `Cluster for ${pattern.type} patterns of ${result.suggestedCategory} category`,
      patterns: [pattern],
      centroid: vector,
      category: result.suggestedCategory,
      confidence: result.confidence
    };
    
    this.patternClusters.set(newClusterId, newCluster);
    return newClusterId;
  }

  /**
   * Update cluster centroid
   */
  private updateClusterCentroid(cluster: PatternCluster): void {
    const allFeatures = new Set<string>();
    const vectors = cluster.patterns.map(p => this.patternVectors.get(p.id)!);
    
    // Collect all feature keys
    vectors.forEach(vector => {
      vector.features.forEach((_, key) => allFeatures.add(key));
    });
    
    // Calculate centroid
    const centroidFeatures = new Map<string, number>();
    for (const feature of allFeatures) {
      const sum = vectors.reduce((acc, vector) => 
        acc + (vector.features.get(feature) || 0), 0
      );
      centroidFeatures.set(feature, sum / vectors.length);
    }
    
    // Calculate magnitude
    let magnitude = 0;
    for (const value of centroidFeatures.values()) {
      magnitude += value * value;
    }
    magnitude = Math.sqrt(magnitude);
    
    cluster.centroid = { features: centroidFeatures, magnitude };
  }

  /**
   * Create feedback rule from user correction
   */
  private createFeedbackRule(
    pattern: CodePattern,
    correctCategory: PatternCategory,
    confidence: number
  ): void {
    const ruleId = `feedback_${Date.now()}`;
    const rule: ClassificationRule = {
      id: ruleId,
      name: `Feedback Rule: ${pattern.type} -> ${correctCategory}`,
      condition: (p) => 
        p.type === pattern.type &&
        p.language === pattern.language &&
        Math.abs(p.confidence - pattern.confidence) < 0.1,
      category: correctCategory,
      priority: this.categoryToPriority(correctCategory),
      confidence
    };
    
    this.classificationRules.push(rule);
  }

  /**
   * Update cluster assignment based on feedback
   */
  private updateClusterWithFeedback(
    pattern: CodePattern,
    correctCategory: PatternCategory
  ): void {
    // Find cluster containing this pattern and update its category if needed
    for (const cluster of this.patternClusters.values()) {
      const patternIndex = cluster.patterns.findIndex(p => p.id === pattern.id);
      if (patternIndex !== -1) {
        cluster.category = correctCategory;
        this.updateClusterCentroid(cluster);
        break;
      }
    }
  }

  /**
   * Adjust category thresholds based on feedback
   */
  private adjustCategoryThresholds(
    pattern: CodePattern,
    correctCategory: PatternCategory,
    confidence: number
  ): void {
    const currentThreshold = this.categoryThresholds.get(correctCategory) || 0.5;
    const adjustment = (confidence - currentThreshold) * 0.1;
    const newThreshold = Math.max(0.1, Math.min(0.95, currentThreshold + adjustment));
    
    this.categoryThresholds.set(correctCategory, newThreshold);
  }

  /**
   * Convert category to priority
   */
  private categoryToPriority(category: PatternCategory): ContextPriority {
    switch (category) {
      case PatternCategory.CRITICAL: return ContextPriority.CRITICAL;
      case PatternCategory.IMPORTANT: return ContextPriority.HIGH;
      case PatternCategory.PREFERRED: return ContextPriority.MEDIUM;
      case PatternCategory.OPTIONAL: return ContextPriority.LOW;
      default: return ContextPriority.MEDIUM;
    }
  }

  /**
   * Get classification statistics
   */
  public getClassificationStatistics(): {
    totalPatterns: number;
    clusterCount: number;
    ruleCount: number;
    categoryDistribution: Map<PatternCategory, number>;
    languageDistribution: Map<SupportedLanguage, number>;
  } {
    const totalPatterns = Array.from(this.patternClusters.values())
      .reduce((sum, cluster) => sum + cluster.patterns.length, 0);
    
    const categoryDistribution = new Map<PatternCategory, number>();
    const languageDistribution = new Map<SupportedLanguage, number>();
    
    for (const cluster of this.patternClusters.values()) {
      // Category distribution
      const currentCount = categoryDistribution.get(cluster.category) || 0;
      categoryDistribution.set(cluster.category, currentCount + cluster.patterns.length);
      
      // Language distribution
      cluster.patterns.forEach(pattern => {
        const langCount = languageDistribution.get(pattern.language) || 0;
        languageDistribution.set(pattern.language, langCount + 1);
      });
    }
    
    return {
      totalPatterns,
      clusterCount: this.patternClusters.size,
      ruleCount: this.classificationRules.length,
      categoryDistribution,
      languageDistribution
    };
  }

  /**
   * Export classification model for sharing
   */
  public exportClassificationModel(): {
    rules: ClassificationRule[];
    clusters: PatternCluster[];
    thresholds: Map<PatternCategory, number>;
    languageWeights: Map<SupportedLanguage, number>;
  } {
    return {
      rules: [...this.classificationRules],
      clusters: Array.from(this.patternClusters.values()),
      thresholds: new Map(this.categoryThresholds),
      languageWeights: new Map(this.languageWeights)
    };
  }

  /**
   * Import classification model
   */
  public importClassificationModel(model: {
    rules: ClassificationRule[];
    clusters: PatternCluster[];
    thresholds: Map<PatternCategory, number>;
    languageWeights: Map<SupportedLanguage, number>;
  }): void {
    this.classificationRules = [...model.rules];
    this.categoryThresholds = new Map(model.thresholds);
    this.languageWeights = new Map(model.languageWeights);
    
    // Rebuild cluster map
    this.patternClusters.clear();
    model.clusters.forEach(cluster => {
      this.patternClusters.set(cluster.id, cluster);
    });
  }
}