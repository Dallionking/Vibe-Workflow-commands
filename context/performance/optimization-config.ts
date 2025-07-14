/**
 * Performance Optimization Configuration
 * Central configuration for all performance features
 */

export interface OptimizationProfile {
  name: string;
  description: string;
  tokenOptimization: {
    enabled: boolean;
    compression: boolean;
    deduplication: boolean;
    summarization: boolean;
    aggressiveness: 'conservative' | 'moderate' | 'aggressive';
  };
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
    persistToDisk: boolean;
    warmupCommands: string[];
  };
  monitoring: {
    enabled: boolean;
    alertThresholds: {
      maxOperationTime: number;
      maxMemoryUsage: number;
      maxTokensPerOperation: number;
      minCacheHitRate: number;
    };
    metricsRetention: number;
  };
}

export const OPTIMIZATION_PROFILES: Record<string, OptimizationProfile> = {
  development: {
    name: 'Development',
    description: 'Optimized for development with balanced performance',
    tokenOptimization: {
      enabled: true,
      compression: true,
      deduplication: true,
      summarization: false,
      aggressiveness: 'conservative'
    },
    caching: {
      enabled: true,
      ttl: 15 * 60 * 1000, // 15 minutes
      maxSize: 50, // 50MB
      persistToDisk: true,
      warmupCommands: [
        'vibe-init',
        'vibe-step-1-ideation',
        'vibe-validate-work'
      ]
    },
    monitoring: {
      enabled: true,
      alertThresholds: {
        maxOperationTime: 5000,
        maxMemoryUsage: 100,
        maxTokensPerOperation: 8000,
        minCacheHitRate: 50
      },
      metricsRetention: 1000
    }
  },
  
  production: {
    name: 'Production',
    description: 'Maximum optimization for production environments',
    tokenOptimization: {
      enabled: true,
      compression: true,
      deduplication: true,
      summarization: true,
      aggressiveness: 'moderate'
    },
    caching: {
      enabled: true,
      ttl: 60 * 60 * 1000, // 1 hour
      maxSize: 200, // 200MB
      persistToDisk: true,
      warmupCommands: [
        'vibe-init',
        'vibe-retrofit',
        'vibe-step-1-ideation',
        'vibe-step-2-architecture',
        'vibe-validate-work',
        'vibe-ui-healer'
      ]
    },
    monitoring: {
      enabled: true,
      alertThresholds: {
        maxOperationTime: 3000,
        maxMemoryUsage: 150,
        maxTokensPerOperation: 10000,
        minCacheHitRate: 70
      },
      metricsRetention: 5000
    }
  },
  
  minimal: {
    name: 'Minimal',
    description: 'Minimal optimization for debugging',
    tokenOptimization: {
      enabled: false,
      compression: false,
      deduplication: false,
      summarization: false,
      aggressiveness: 'conservative'
    },
    caching: {
      enabled: false,
      ttl: 5 * 60 * 1000,
      maxSize: 10,
      persistToDisk: false,
      warmupCommands: []
    },
    monitoring: {
      enabled: false,
      alertThresholds: {
        maxOperationTime: 10000,
        maxMemoryUsage: 500,
        maxTokensPerOperation: 20000,
        minCacheHitRate: 0
      },
      metricsRetention: 100
    }
  },
  
  aggressive: {
    name: 'Aggressive',
    description: 'Maximum token savings, may impact quality',
    tokenOptimization: {
      enabled: true,
      compression: true,
      deduplication: true,
      summarization: true,
      aggressiveness: 'aggressive'
    },
    caching: {
      enabled: true,
      ttl: 2 * 60 * 60 * 1000, // 2 hours
      maxSize: 500, // 500MB
      persistToDisk: true,
      warmupCommands: [
        'vibe-init',
        'vibe-retrofit',
        'vibe-step-1-ideation',
        'vibe-step-2-architecture',
        'vibe-step-3-setup',
        'vibe-step-4-ui-principles',
        'vibe-step-5-ui-design',
        'vibe-step-6-backend',
        'vibe-step-7-phases',
        'vibe-step-8-refinement',
        'vibe-step-9-review',
        'vibe-step-10-implementation',
        'vibe-validate-work',
        'vibe-ui-healer'
      ]
    },
    monitoring: {
      enabled: true,
      alertThresholds: {
        maxOperationTime: 2000,
        maxMemoryUsage: 100,
        maxTokensPerOperation: 6000,
        minCacheHitRate: 80
      },
      metricsRetention: 10000
    }
  }
};

export class OptimizationConfigManager {
  private currentProfile: string;
  private customSettings: Partial<OptimizationProfile>;
  
  constructor(profile: string = 'development') {
    this.currentProfile = profile;
    this.customSettings = {};
  }
  
  getProfile(): OptimizationProfile {
    const baseProfile = OPTIMIZATION_PROFILES[this.currentProfile] || OPTIMIZATION_PROFILES.development;
    
    // Merge custom settings
    return this.mergeSettings(baseProfile, this.customSettings);
  }
  
  setProfile(profile: string): void {
    if (OPTIMIZATION_PROFILES[profile]) {
      this.currentProfile = profile;
      console.log(`🌟 Switched to ${profile} optimization profile`);
    } else {
      console.warn(`Unknown profile: ${profile}`);
    }
  }
  
  updateSettings(settings: Partial<OptimizationProfile>): void {
    this.customSettings = this.mergeSettings(this.customSettings, settings);
  }
  
  private mergeSettings(
    base: any,
    overrides: any
  ): any {
    const merged = { ...base };
    
    for (const key in overrides) {
      if (typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
        merged[key] = this.mergeSettings(merged[key] || {}, overrides[key]);
      } else {
        merged[key] = overrides[key];
      }
    }
    
    return merged;
  }
  
  getRecommendedProfile(metrics: {
    averageTokens: number;
    commandFrequency: number;
    cacheHitRate: number;
  }): string {
    // High token usage
    if (metrics.averageTokens > 6000) {
      return 'aggressive';
    }
    
    // High frequency usage
    if (metrics.commandFrequency > 50) {
      return 'production';
    }
    
    // Low cache hit rate
    if (metrics.cacheHitRate < 30) {
      return 'minimal';
    }
    
    return 'development';
  }
  
  exportConfig(): string {
    return JSON.stringify({
      profile: this.currentProfile,
      customSettings: this.customSettings,
      effective: this.getProfile()
    }, null, 2);
  }
  
  importConfig(config: string): void {
    try {
      const parsed = JSON.parse(config);
      this.currentProfile = parsed.profile || 'development';
      this.customSettings = parsed.customSettings || {};
    } catch (error) {
      console.error('Failed to import configuration:', error);
    }
  }
}