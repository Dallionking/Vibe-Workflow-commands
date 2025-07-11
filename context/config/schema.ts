/**
 * Context Configuration Schema
 * Defines the configuration structure for the context engineering system
 */

import { 
  ContextConfig, 
  ContextLayerConfig, 
  TokenBudgetConfig, 
  ValidationConfig, 
  CacheConfig,
  FeatureFlags 
} from '../types/context.types';

export const DEFAULT_CONFIG: ContextConfig = {
  version: '1.0.0',
  layers: [
    {
      type: 'global',
      enabled: true,
      budget: 2000,
      sources: ['CLAUDE.md', '.eslintrc.json', 'tsconfig.json'],
      rules: []
    },
    {
      type: 'phase',
      enabled: true,
      budget: 3000,
      sources: ['phases/*.md', 'docs/vibe-coding/*.md', '.vibe-status.md'],
      rules: []
    },
    {
      type: 'task',
      enabled: true,
      budget: 2000,
      sources: ['git-status', 'recent-files', 'error-context'],
      rules: []
    }
  ],
  tokenBudget: {
    total: 8000,
    distribution: {
      global: 2000,
      phase: 3000,
      task: 2000
    },
    reservePercent: 10,
    compressionThreshold: 0.9
  },
  validation: {
    enabled: true,
    rules: ['structure', 'content', 'performance', 'consistency'],
    strictMode: false,
    autoFix: true
  },
  cache: {
    maxSize: 100,
    ttl: 300000, // 5 minutes
    strategy: 'lru'
  },
  features: {
    enableCompression: true,
    enableCaching: true,
    enableLearning: true,
    enableMetrics: true,
    debugMode: false
  }
};

export class ConfigValidator {
  static validate(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check version
    if (!config.version || typeof config.version !== 'string') {
      errors.push('Config must have a version string');
    }

    // Validate layers
    if (!Array.isArray(config.layers)) {
      errors.push('Config must have a layers array');
    } else {
      config.layers.forEach((layer: any, index: number) => {
        const layerErrors = this.validateLayer(layer);
        layerErrors.forEach(err => errors.push(`layers[${index}]: ${err}`));
      });
    }

    // Validate token budget
    if (!config.tokenBudget || typeof config.tokenBudget !== 'object') {
      errors.push('Config must have a tokenBudget object');
    } else {
      const budgetErrors = this.validateTokenBudget(config.tokenBudget);
      budgetErrors.forEach(err => errors.push(`tokenBudget: ${err}`));
    }

    // Validate other sections
    if (config.validation) {
      const validationErrors = this.validateValidationConfig(config.validation);
      validationErrors.forEach(err => errors.push(`validation: ${err}`));
    }

    if (config.cache) {
      const cacheErrors = this.validateCacheConfig(config.cache);
      cacheErrors.forEach(err => errors.push(`cache: ${err}`));
    }

    if (config.features) {
      const featureErrors = this.validateFeatures(config.features);
      featureErrors.forEach(err => errors.push(`features: ${err}`));
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private static validateLayer(layer: any): string[] {
    const errors: string[] = [];
    const validTypes = ['global', 'phase', 'task'];

    if (!layer.type || !validTypes.includes(layer.type)) {
      errors.push(`Invalid layer type: ${layer.type}`);
    }

    if (typeof layer.enabled !== 'boolean') {
      errors.push('Layer enabled must be boolean');
    }

    if (typeof layer.budget !== 'number' || layer.budget <= 0) {
      errors.push('Layer budget must be positive number');
    }

    if (!Array.isArray(layer.sources)) {
      errors.push('Layer sources must be array');
    }

    return errors;
  }

  private static validateTokenBudget(budget: any): string[] {
    const errors: string[] = [];

    if (typeof budget.total !== 'number' || budget.total <= 0) {
      errors.push('Total must be positive number');
    }

    if (!budget.distribution || typeof budget.distribution !== 'object') {
      errors.push('Distribution must be object');
    } else {
      const sum = Object.values(budget.distribution as Record<string, number>)
        .reduce((a, b) => a + b, 0);
      
      if (sum > budget.total) {
        errors.push('Distribution sum exceeds total budget');
      }
    }

    if (typeof budget.reservePercent !== 'number' || 
        budget.reservePercent < 0 || 
        budget.reservePercent > 100) {
      errors.push('Reserve percent must be between 0 and 100');
    }

    return errors;
  }

  private static validateValidationConfig(validation: any): string[] {
    const errors: string[] = [];
    const validRules = ['structure', 'content', 'performance', 'consistency'];

    if (typeof validation.enabled !== 'boolean') {
      errors.push('Enabled must be boolean');
    }

    if (!Array.isArray(validation.rules)) {
      errors.push('Rules must be array');
    } else {
      validation.rules.forEach((rule: string) => {
        if (!validRules.includes(rule)) {
          errors.push(`Invalid rule: ${rule}`);
        }
      });
    }

    return errors;
  }

  private static validateCacheConfig(cache: any): string[] {
    const errors: string[] = [];
    const validStrategies = ['lru', 'lfu', 'fifo'];

    if (typeof cache.maxSize !== 'number' || cache.maxSize <= 0) {
      errors.push('Max size must be positive number');
    }

    if (typeof cache.ttl !== 'number' || cache.ttl <= 0) {
      errors.push('TTL must be positive number');
    }

    if (!validStrategies.includes(cache.strategy)) {
      errors.push(`Invalid cache strategy: ${cache.strategy}`);
    }

    return errors;
  }

  private static validateFeatures(features: any): string[] {
    const errors: string[] = [];
    const booleanFeatures = [
      'enableCompression',
      'enableCaching',
      'enableLearning',
      'enableMetrics',
      'debugMode'
    ];

    booleanFeatures.forEach(feature => {
      if (typeof features[feature] !== 'boolean') {
        errors.push(`${feature} must be boolean`);
      }
    });

    return errors;
  }
}

export class ConfigLoader {
  static load(configPath?: string): ContextConfig {
    if (!configPath) {
      return DEFAULT_CONFIG;
    }

    try {
      const fs = require('fs');
      const content = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(content);
      
      const validation = ConfigValidator.validate(config);
      if (!validation.valid) {
        console.error('Invalid config:', validation.errors);
        return DEFAULT_CONFIG;
      }
      
      return config;
    } catch (error) {
      console.error('Failed to load config:', error);
      return DEFAULT_CONFIG;
    }
  }

  static merge(base: ContextConfig, override: Partial<ContextConfig>): ContextConfig {
    const merged = {
      ...base,
      ...override,
      layers: override.layers || base.layers,
      tokenBudget: {
        ...base.tokenBudget,
        ...(override.tokenBudget || {})
      },
      validation: {
        ...base.validation,
        ...(override.validation || {})
      },
      cache: {
        ...base.cache,
        ...(override.cache || {})
      },
      features: {
        ...base.features,
        ...(override.features || {})
      }
    };

    const validation = ConfigValidator.validate(merged);
    if (!validation.valid) {
      console.error('Invalid merged config:', validation.errors);
      return base;
    }

    return merged;
  }

  static save(config: ContextConfig, path: string): void {
    const fs = require('fs');
    const content = JSON.stringify(config, null, 2);
    fs.writeFileSync(path, content, 'utf-8');
  }
}