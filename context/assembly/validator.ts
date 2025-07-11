/**
 * Context Validator
 * Validates context layers and content for consistency and correctness
 */

import {
  ContextLayer,
  ContextContent,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationRule
} from '../types/context.types';

export class ContextValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    // Structure validation rules
    this.rules.push({
      id: 'layer-structure',
      name: 'Layer Structure Validation',
      type: 'structure',
      validate: (layer) => this.validateLayerStructure(layer)
    });

    // Content validation rules
    this.rules.push({
      id: 'content-format',
      name: 'Content Format Validation',
      type: 'content',
      validate: (layer) => this.validateContentFormat(layer)
    });

    // Performance validation rules
    this.rules.push({
      id: 'token-budget',
      name: 'Token Budget Validation',
      type: 'performance',
      validate: (layer) => this.validateTokenBudget(layer)
    });

    // Consistency validation rules
    this.rules.push({
      id: 'metadata-consistency',
      name: 'Metadata Consistency Validation',
      type: 'consistency',
      validate: (layer) => this.validateMetadataConsistency(layer)
    });
  }

  async validateLayer(layer: ContextLayer): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Run all applicable rules
    for (const rule of this.rules) {
      try {
        const result = rule.validate(layer);
        errors.push(...result.errors);
        warnings.push(...result.warnings);
        suggestions.push(...result.suggestions);
      } catch (error) {
        errors.push({
          rule: rule.id,
          message: `Rule execution failed: ${error}`,
          severity: 'error'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private validateLayerStructure(layer: ContextLayer): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Check required fields
    if (!layer.type) {
      errors.push({
        rule: 'layer-structure',
        message: 'Layer type is required',
        severity: 'critical'
      });
    }

    if (!layer.name) {
      errors.push({
        rule: 'layer-structure',
        message: 'Layer name is required',
        severity: 'error'
      });
    }

    if (!Array.isArray(layer.contents)) {
      errors.push({
        rule: 'layer-structure',
        message: 'Layer contents must be an array',
        severity: 'critical'
      });
    }

    // Check budget structure
    if (!layer.budget || typeof layer.budget !== 'object') {
      errors.push({
        rule: 'layer-structure',
        message: 'Layer must have a valid token budget',
        severity: 'error'
      });
    } else {
      if (layer.budget.total <= 0) {
        errors.push({
          rule: 'layer-structure',
          message: 'Token budget total must be positive',
          severity: 'error'
        });
      }

      if (layer.budget.used > layer.budget.total) {
        warnings.push({
          rule: 'layer-structure',
          message: 'Token usage exceeds total budget',
          severity: 'warning'
        });
      }
    }

    // Check for empty layer
    if (layer.contents.length === 0 && layer.enabled) {
      warnings.push({
        rule: 'layer-structure',
        message: 'Enabled layer has no contents',
        severity: 'info'
      });
    }

    return { valid: errors.length === 0, errors, warnings, suggestions };
  }

  private validateContentFormat(layer: ContextLayer): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    layer.contents.forEach((content, index) => {
      const location = `contents[${index}]`;

      // Check required fields
      if (!content.id) {
        errors.push({
          rule: 'content-format',
          message: 'Content ID is required',
          location,
          severity: 'error'
        });
      }

      if (!content.type) {
        errors.push({
          rule: 'content-format',
          message: 'Content type is required',
          location,
          severity: 'error'
        });
      }

      if (!content.content || content.content.trim() === '') {
        errors.push({
          rule: 'content-format',
          message: 'Content cannot be empty',
          location,
          severity: 'error'
        });
      }

      // Validate priority
      const validPriorities = ['critical', 'high', 'medium', 'low'];
      if (!validPriorities.includes(content.priority)) {
        errors.push({
          rule: 'content-format',
          message: `Invalid priority: ${content.priority}`,
          location,
          severity: 'error'
        });
      }

      // Check metadata
      if (!content.metadata) {
        warnings.push({
          rule: 'content-format',
          message: 'Content metadata is missing',
          location,
          severity: 'warning'
        });
      } else {
        if (!content.metadata.source) {
          warnings.push({
            rule: 'content-format',
            message: 'Content source is not specified',
            location,
            severity: 'info'
          });
        }

        if (!Array.isArray(content.metadata.tags)) {
          warnings.push({
            rule: 'content-format',
            message: 'Content tags should be an array',
            location,
            severity: 'info'
          });
        }
      }

      // Content-specific validations
      if (content.type === 'pattern' && !content.content.includes('Pattern:')) {
        suggestions.push(`Pattern content in ${location} should include pattern definition`);
      }

      if (content.type === 'instruction' && content.content.length < 50) {
        warnings.push({
          rule: 'content-format',
          message: 'Instruction content seems too short',
          location,
          severity: 'info'
        });
      }
    });

    return { valid: errors.length === 0, errors, warnings, suggestions };
  }

  private validateTokenBudget(layer: ContextLayer): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Calculate actual token usage
    const actualTokens = layer.contents.reduce((sum, content) => {
      const tokens = content.tokens || Math.ceil(content.content.length / 4);
      return sum + tokens;
    }, 0);

    // Check if calculated matches reported
    const reportedTokens = layer.budget.used;
    const difference = Math.abs(actualTokens - reportedTokens);
    
    if (difference > reportedTokens * 0.1) { // 10% tolerance
      warnings.push({
        rule: 'token-budget',
        message: `Token count mismatch: reported ${reportedTokens}, calculated ${actualTokens}`,
        severity: 'warning'
      });
    }

    // Check token efficiency
    const efficiency = layer.budget.used / layer.budget.total;
    
    if (efficiency < 0.5 && layer.enabled) {
      suggestions.push('Layer is using less than 50% of allocated tokens. Consider reducing budget or adding more content.');
    }

    if (efficiency > 0.95) {
      warnings.push({
        rule: 'token-budget',
        message: 'Layer is near token capacity. Consider increasing budget or prioritizing content.',
        severity: 'warning'
      });
    }

    // Check for missing token counts
    const missingTokens = layer.contents.filter(c => !c.tokens).length;
    if (missingTokens > 0) {
      warnings.push({
        rule: 'token-budget',
        message: `${missingTokens} content items missing token count`,
        severity: 'info'
      });
    }

    return { valid: errors.length === 0, errors, warnings, suggestions };
  }

  private validateMetadataConsistency(layer: ContextLayer): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Check version consistency
    const versions = new Set(
      layer.contents
        .map(c => c.metadata?.version)
        .filter(v => v)
    );

    if (versions.size > 1) {
      warnings.push({
        rule: 'metadata-consistency',
        message: `Multiple metadata versions detected: ${Array.from(versions).join(', ')}`,
        severity: 'info'
      });
    }

    // Check timestamp validity
    const now = Date.now();
    layer.contents.forEach((content, index) => {
      if (content.metadata?.timestamp) {
        const timestamp = new Date(content.metadata.timestamp).getTime();
        if (timestamp > now) {
          errors.push({
            rule: 'metadata-consistency',
            message: 'Content timestamp is in the future',
            location: `contents[${index}]`,
            severity: 'error'
          });
        }
      }
    });

    // Check for duplicate IDs
    const ids = layer.contents.map(c => c.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    
    if (duplicates.length > 0) {
      errors.push({
        rule: 'metadata-consistency',
        message: `Duplicate content IDs found: ${duplicates.join(', ')}`,
        severity: 'critical'
      });
    }

    // Check layer type consistency
    layer.contents.forEach((content, index) => {
      if (content.layer !== layer.type) {
        warnings.push({
          rule: 'metadata-consistency',
          message: `Content layer type mismatch`,
          location: `contents[${index}]`,
          severity: 'warning'
        });
      }
    });

    return { valid: errors.length === 0, errors, warnings, suggestions };
  }

  async validateContent(content: ContextContent): Promise<ValidationResult> {
    // Create a temporary layer for validation
    const tempLayer: ContextLayer = {
      type: content.layer,
      name: 'temp-validation',
      enabled: true,
      contents: [content],
      budget: {
        total: 1000,
        used: content.tokens || Math.ceil(content.content.length / 4),
        reserved: 0,
        available: 1000
      },
      rules: []
    };

    return this.validateLayer(tempLayer);
  }

  addCustomRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }

  getRules(): ValidationRule[] {
    return [...this.rules];
  }
}