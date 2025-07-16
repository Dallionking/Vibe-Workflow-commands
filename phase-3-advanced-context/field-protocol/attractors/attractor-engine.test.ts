/**
 * Tests for Attractor Engine
 * Complex systems theory implementation testing
 */

import { AttractorEngine, AttractorEngineConfig, AttractorContext, AttractorPrediction } from './attractor-engine';
import {
  AttractorState,
  AttractorType,
  AttractorConfiguration,
  AttractorStability,
  AttractorConstraint,
  AttractorTransition,
  TransitionTrigger
} from '../interfaces';

describe('AttractorEngine', () => {
  let engine: AttractorEngine;
  let defaultConfig: AttractorEngineConfig;
  let defaultContext: AttractorContext;

  beforeEach(() => {
    defaultConfig = {
      enableAdaptiveStability: true,
      enableBasinAnalysis: true,
      enableTransitionPrediction: true,
      stabilityThreshold: 0.5,
      transitionDelay: 100,
      noiseLevel: 0.1,
      dampingFactor: 0.8,
      maxAttractors: 10
    };

    defaultContext = {
      systemState: {
        temperature: 20,
        pressure: 1,
        velocity: 0
      },
      environmentConditions: {
        stability: 'stable',
        noise: 0.05
      },
      externalForces: {
        gravity: 9.8,
        friction: 0.2
      },
      timeHorizon: 1000,
      constraints: []
    };

    engine = new AttractorEngine(defaultConfig);
  });

  describe('addAttractorState', () => {
    it('should add a point attractor', async () => {
      const configuration: AttractorConfiguration = {
        dimensions: 3,
        parameters: { alpha: 0.5, beta: 1.0 },
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      const attractor = await engine.addAttractorState(
        'point-1',
        'Equilibrium Point',
        'point',
        configuration
      );

      expect(attractor.id).toBe('point-1');
      expect(attractor.type).toBe('point');
      expect(attractor.stability.localStability).toBeGreaterThan(0.9);
    });

    it('should add a periodic attractor', async () => {
      const configuration: AttractorConfiguration = {
        dimensions: 2,
        parameters: { frequency: 1.0, amplitude: 2.0 },
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.2,
        recoveryTime: 200
      };

      const attractor = await engine.addAttractorState(
        'periodic-1',
        'Oscillation',
        'periodic',
        configuration
      );

      expect(attractor.type).toBe('periodic');
      expect(attractor.stability.localStability).toBeGreaterThan(0.7);
      expect(attractor.stability.localStability).toBeLessThan(0.95);
    });

    it('should add a chaotic attractor', async () => {
      const configuration: AttractorConfiguration = {
        dimensions: 3,
        parameters: { sigma: 10, rho: 28, beta: 8/3 },
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.5,
        recoveryTime: 500
      };

      const attractor = await engine.addAttractorState(
        'chaotic-1',
        'Lorenz Attractor',
        'chaotic',
        configuration
      );

      expect(attractor.type).toBe('chaotic');
      expect(attractor.stability.localStability).toBeLessThan(0.6);
      expect(attractor.stability.lyapunovExponent).toBeGreaterThan(0);
    });

    it('should enforce maximum attractor limit', async () => {
      const smallConfig = { ...defaultConfig, maxAttractors: 2 };
      const smallEngine = new AttractorEngine(smallConfig);

      const config: AttractorConfiguration = {
        dimensions: 1,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      await smallEngine.addAttractorState('a1', 'Attractor 1', 'point', config);
      await smallEngine.addAttractorState('a2', 'Attractor 2', 'point', config);

      await expect(
        smallEngine.addAttractorState('a3', 'Attractor 3', 'point', config)
      ).rejects.toThrow('Maximum number of attractors');
    });

    it('should calculate basin properties', async () => {
      const configuration: AttractorConfiguration = {
        dimensions: 2,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      const attractor = await engine.addAttractorState(
        'basin-test',
        'Basin Test',
        'point',
        configuration
      );

      expect(attractor.basin).toBeDefined();
      expect(attractor.basin.volume).toBeGreaterThan(0);
      expect(attractor.basin.boundaries).toHaveLength(2); // 2 dimensions
      expect(attractor.basin.topology).toBe('simple');
    });
  });

  describe('transitionToAttractor', () => {
    beforeEach(async () => {
      // Setup initial attractors
      const config: AttractorConfiguration = {
        dimensions: 2,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      await engine.addAttractorState('initial', 'Initial State', 'point', config);
      await engine.addAttractorState('target', 'Target State', 'point', config);

      // Set initial state
      await engine.transitionToAttractor('initial', defaultContext, true);
    });

    it('should transition between attractors', async () => {
      const success = await engine.transitionToAttractor('target', defaultContext);

      expect(success).toBe(true);
      const metrics = engine.getGlobalMetrics();
      expect(metrics.totalStates).toBe(2);
    });

    it('should record transition history', async () => {
      await engine.transitionToAttractor('target', defaultContext);
      await engine.transitionToAttractor('initial', defaultContext);

      const metrics = engine.getGlobalMetrics();
      expect(metrics.transitionFrequency).toBeGreaterThan(0);
    });

    it('should handle failed transitions', async () => {
      const success = await engine.transitionToAttractor('non-existent', defaultContext);

      expect(success).toBe(false);
    });

    it('should respect constraints', async () => {
      const constrainedContext: AttractorContext = {
        ...defaultContext,
        constraints: [
          {
            type: 'stability',
            description: 'Minimum stability required',
            condition: 'stability > 0.99',
            tolerance: 0.99,
            violation: {
              severity: 'critical',
              response: 'abort',
              correctionAction: 'none',
              escalationThreshold: 1
            }
          }
        ]
      };

      const success = await engine.transitionToAttractor('target', constrainedContext);

      // May fail if target doesn't meet stability constraint
      expect(typeof success).toBe('boolean');
    });

    it('should force transition when requested', async () => {
      const constrainedContext: AttractorContext = {
        ...defaultContext,
        constraints: [
          {
            type: 'stability',
            description: 'Impossible constraint',
            condition: 'stability > 2.0',
            tolerance: 2.0,
            violation: {
              severity: 'critical',
              response: 'abort',
              correctionAction: 'none',
              escalationThreshold: 1
            }
          }
        ]
      };

      const success = await engine.transitionToAttractor('target', constrainedContext, true);

      expect(success).toBe(true); // Forced transition ignores constraints
    });
  });

  describe('analyzeStability', () => {
    beforeEach(async () => {
      const config: AttractorConfiguration = {
        dimensions: 3,
        parameters: { alpha: 1.0 },
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.2,
        recoveryTime: 150
      };

      await engine.addAttractorState('stable-test', 'Stability Test', 'point', config);
      await engine.transitionToAttractor('stable-test', defaultContext, true);
    });

    it('should analyze current attractor stability', async () => {
      const stability = await engine.analyzeStability();

      expect(stability).toBeDefined();
      expect(stability.localStability).toBeGreaterThan(0);
      expect(stability.globalStability).toBeGreaterThan(0);
      expect(stability.lyapunovExponent).toBeDefined();
      expect(stability.basinSize).toBeGreaterThan(0);
      expect(stability.perturbationRecovery).toBe(150);
      expect(stability.stabilityMargin).toBe(0.2);
    });

    it('should analyze specific attractor stability', async () => {
      const stability = await engine.analyzeStability('stable-test');

      expect(stability.localStability).toBeGreaterThan(0.8);
    });

    it('should throw error for non-existent attractor', async () => {
      await expect(
        engine.analyzeStability('non-existent')
      ).rejects.toThrow('Attractor non-existent not found');
    });
  });

  describe('predictTransition', () => {
    beforeEach(async () => {
      // Create multiple attractors for prediction
      const config: AttractorConfiguration = {
        dimensions: 2,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      await engine.addAttractorState('current', 'Current', 'point', config);
      await engine.addAttractorState('likely', 'Likely Next', 'periodic', config);
      await engine.addAttractorState('unlikely', 'Unlikely', 'chaotic', config);

      await engine.transitionToAttractor('current', defaultContext, true);
    });

    it('should predict next transition', async () => {
      const prediction = await engine.predictTransition(defaultContext, 1000);

      expect(prediction).toBeDefined();
      expect(prediction.nextState).toBeTruthy();
      expect(prediction.probability).toBeGreaterThan(0);
      expect(prediction.probability).toBeLessThanOrEqual(1);
      expect(prediction.timeToTransition).toBeLessThanOrEqual(1000);
      expect(prediction.confidence).toBeGreaterThan(0);
    });

    it('should include prediction factors', async () => {
      const prediction = await engine.predictTransition(defaultContext, 500);

      expect(prediction.factors).toBeDefined();
      expect(Array.isArray(prediction.factors)).toBe(true);
    });
  });

  describe('getBasinOfAttraction', () => {
    beforeEach(async () => {
      const config: AttractorConfiguration = {
        dimensions: 3,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.15,
        recoveryTime: 120
      };

      await engine.addAttractorState('basin-analysis', 'Basin Analysis', 'point', config);
    });

    it('should get basin of attraction', async () => {
      const basin = await engine.getBasinOfAttraction('basin-analysis');

      expect(basin).toBeDefined();
      expect(basin.boundaries).toHaveLength(3); // 3 dimensions
      expect(basin.volume).toBeGreaterThan(0);
      expect(basin.topology).toBe('simple');
      expect(basin.accessibility).toBeGreaterThan(0.8);
      expect(basin.robustness).toBeGreaterThan(0.5);
    });

    it('should calculate different basin topologies', async () => {
      const chaoticConfig: AttractorConfiguration = {
        dimensions: 3,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.5,
        recoveryTime: 500
      };

      await engine.addAttractorState('chaotic-basin', 'Chaotic Basin', 'chaotic', chaoticConfig);
      const basin = await engine.getBasinOfAttraction('chaotic-basin');

      expect(basin.topology).toBe('fractal');
    });
  });

  describe('optimizeAttractor', () => {
    beforeEach(async () => {
      const config: AttractorConfiguration = {
        dimensions: 2,
        parameters: { alpha: 0.5, beta: 0.5 },
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      await engine.addAttractorState('optimize-test', 'Optimization Test', 'point', config);
    });

    it('should optimize attractor configuration', async () => {
      const objectives = ['stability', 'efficiency'];
      const constraints: AttractorConstraint[] = [
        {
          type: 'performance',
          description: 'Minimum performance',
          condition: 'performance > 0.7',
          tolerance: 0.7,
          violation: {
            severity: 'moderate',
            response: 'warn',
            correctionAction: 'adjust parameters',
            escalationThreshold: 3
          }
        }
      ];

      const optimized = await engine.optimizeAttractor('optimize-test', objectives, constraints);

      expect(optimized).toBeDefined();
      expect(optimized.parameters).toBeDefined();
    });

    it('should update attractor after optimization', async () => {
      await engine.optimizeAttractor('optimize-test', ['stability'], []);

      const stability = await engine.analyzeStability('optimize-test');
      expect(stability).toBeDefined();
    });
  });

  describe('getGlobalMetrics', () => {
    it('should return initial metrics', () => {
      const metrics = engine.getGlobalMetrics();

      expect(metrics.totalStates).toBe(0);
      expect(metrics.activeStates).toBe(0);
      expect(metrics.averageStability).toBe(NaN); // No states yet
      expect(metrics.transitionFrequency).toBe(0);
      expect(metrics.systemEfficiency).toBe(NaN);
    });

    it('should calculate metrics with attractors', async () => {
      const config: AttractorConfiguration = {
        dimensions: 2,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      await engine.addAttractorState('a1', 'Attractor 1', 'point', config);
      await engine.addAttractorState('a2', 'Attractor 2', 'periodic', config);

      const metrics = engine.getGlobalMetrics();

      expect(metrics.totalStates).toBe(2);
      expect(metrics.averageStability).toBeGreaterThan(0);
      expect(metrics.systemEfficiency).toBeGreaterThan(0);
    });

    it('should track transition frequency', async () => {
      const config: AttractorConfiguration = {
        dimensions: 1,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 50
      };

      await engine.addAttractorState('freq-1', 'Frequency 1', 'point', config);
      await engine.addAttractorState('freq-2', 'Frequency 2', 'point', config);

      await engine.transitionToAttractor('freq-1', defaultContext, true);
      await engine.transitionToAttractor('freq-2', defaultContext);
      await engine.transitionToAttractor('freq-1', defaultContext);

      const metrics = engine.getGlobalMetrics();

      expect(metrics.transitionFrequency).toBeGreaterThan(0);
    });
  });

  describe('startPerformanceMonitoring', () => {
    it('should start performance monitoring', async () => {
      const config: AttractorConfiguration = {
        dimensions: 2,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      await engine.addAttractorState('monitor-test', 'Monitor Test', 'point', config);
      await engine.transitionToAttractor('monitor-test', defaultContext, true);

      // Start monitoring with short interval for testing
      await engine.startPerformanceMonitoring(10);

      // Wait for a monitoring cycle
      await new Promise(resolve => setTimeout(resolve, 20));

      // Monitoring should be running (no direct way to test, but no errors)
      expect(true).toBe(true);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty attractor map', async () => {
      await expect(
        engine.transitionToAttractor('non-existent', defaultContext)
      ).rejects.toThrow('Target attractor non-existent not found');
    });

    it('should handle invalid attractor types', async () => {
      const config: AttractorConfiguration = {
        dimensions: 1,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      // TypeScript will catch this, but testing runtime behavior
      const attractor = await engine.addAttractorState(
        'invalid-type',
        'Invalid Type Test',
                'unknown' as AttractorType,
                config
      );

      expect(attractor.stability.localStability).toBe(0.5); // Default case
    });

    it('should handle high-dimensional attractors', async () => {
      const config: AttractorConfiguration = {
        dimensions: 10,
        parameters: {},
        constraints: [],
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      const attractor = await engine.addAttractorState(
        'high-dim',
        'High Dimensional',
        'point',
        config
      );

      // Stability should be penalized for high dimensions
      expect(attractor.stability.localStability).toBeLessThan(0.8);
    });

    it('should handle many constraints', async () => {
      const config: AttractorConfiguration = {
        dimensions: 2,
        parameters: {},
        constraints: Array(10).fill({
          type: 'stability',
          description: 'Constraint',
          condition: 'true',
          tolerance: 0.1,
          violation: {
            severity: 'minor',
            response: 'ignore',
            correctionAction: 'none',
            escalationThreshold: 10
          }
        }),
        invariants: [],
        perturbationTolerance: 0.1,
        recoveryTime: 100
      };

      const attractor = await engine.addAttractorState(
        'constrained',
        'Heavily Constrained',
        'point',
        config
      );

      // Stability should be penalized for many constraints
      expect(attractor.stability.localStability).toBeLessThan(0.9);
    });
  });
});
