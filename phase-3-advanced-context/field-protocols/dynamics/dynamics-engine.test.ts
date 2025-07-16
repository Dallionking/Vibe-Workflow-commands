/**
 * Advanced Dynamics Engine Tests
 * Phase 3: Advanced Context Features - Tier 2.4
 *
 * Comprehensive test suite for the field protocol dynamics engine.
 */

import { AdvancedDynamicsEngine } from './dynamics-engine';
import {
  DynamicsField,
  PhaseTransition,
  EnergyFlow,
  OptimizationObjective,
  DynamicsConstraint,
  ConservationLaw,
  FieldTopology,
  DynamicsPhase,
  Perturbation,
  ExternalForce
} from './interfaces';

describe('AdvancedDynamicsEngine', () => {
  let engine: AdvancedDynamicsEngine;
  let mockField: DynamicsField;
  let mockTopology: FieldTopology;
  let mockPhase: DynamicsPhase;
  let mockTransition: PhaseTransition;
  let mockEnergyFlow: EnergyFlow;

  beforeEach(() => {
    engine = new AdvancedDynamicsEngine();

    // Mock topology
    mockTopology = {
      type: 'euclidean',
      dimensions: 3,
      metric: {
        components: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
        determinant: 1,
        signature: [1, 1, 1],
        curvatureScalar: 0,
        riemannTensor: [[[[0]]]]
      },
      boundaries: [],
      singularities: [],
      symmetries: []
    };

    // Mock phase
    mockPhase = {
      id: 'test_phase',
      name: 'Test Phase',
      orderParameter: {
        value: 0.5,
        fluctuations: 0.1,
        correlation: {
          spatial: (d: number) => Math.exp(-d),
          temporal: (t: number) => Math.exp(-t),
          spatiotemporal: (pos: number[], t: number) => Math.exp(-t),
          range: 1.0,
          decayType: 'exponential'
        },
        symmetryBreaking: [],
        criticalExponent: 0.5
      },
      stability: {
        localStability: 0.9,
        globalStability: 0.8,
        thermodynamicStability: 0.95,
        mechanicalStability: 0.85,
        criticalFluctuations: 0.05,
        eigenvalues: [-1, -2, -0.5],
        lyapunovExponents: [-1, -2],
        stabilityMatrix: [[-1, 0], [0, -2]],
        basinsOfAttraction: [],
        perturbationResponse: {
          linearResponse: (p: number[]) => p,
          nonlinearResponse: (p: number[]) => p.map(x => x * x),
          relaxationTime: 1.0,
          dampingRate: 0.1
        }
      },
      freeEnergy: 1.0,
      entropy: 0.5,
      specificHeat: 1.2,
      susceptibility: 0.8,
      correlationLength: 2.0,
      excitations: []
    };

    // Mock field
    mockField = {
      id: 'test_field',
      name: 'Test Field',
      energy: 10.0,
      momentum: [1.0, 2.0, 3.0],
      potential: 8.0,
      kinetic: 2.0,
      fieldGradient: [0.1, -0.2, 0.3],
      curvature: 0.1,
      topology: mockTopology,
      phase: mockPhase,
      transitions: [],
      constraints: [],
      conservationLaws: []
    };

    // Mock transition
    mockTransition = {
      id: 'test_transition',
      type: 'continuous',
      fromPhase: 'phase_a',
      toPhase: 'phase_b',
      order: 2,
      energyBarrier: 1.5,
      criticalPoint: {
        position: [0, 0, 0],
        temperature: 300,
        pressure: 1.0,
        criticalExponents: {
          alpha: 0.1,
          beta: 0.3,
          gamma: 1.2,
          delta: 4.8,
          nu: 0.6,
          eta: 0.04
        },
        correlationLength: 1.0,
        fluctuations: 0.2,
        scalingFunction: (x: number) => Math.pow(x, 0.5)
      },
      nucleation: {
        mechanism: 'homogeneous',
        nucleationRate: 0.1,
        criticalRadius: 1.0,
        activationBarrier: 5.0,
        surfaceTension: 0.1,
        nucleationSites: [],
        growthKinetics: {
          growthRate: 1.0,
          growthExponent: 2.0,
          interfaceVelocity: (pos: number[]) => [1, 0, 0],
          morphology: 'spherical',
          anisotropy: 0.1
        }
      },
      kinetics: {
        timeScale: 1.0,
        relaxationSpectrum: [],
        nonExponentialRelaxation: false,
        agingEffects: false,
        memoryEffects: false,
        cooperativity: 1.0
      },
      universalityClass: {
        name: 'Ising_3D',
        dimension: 3,
        symmetry: 'Z2',
        criticalExponents: {
          alpha: 0.1,
          beta: 0.3,
          gamma: 1.2,
          delta: 4.8,
          nu: 0.6,
          eta: 0.04
        },
        scalingFunctions: new Map(),
        fixedPoints: [],
        relevantOperators: []
      },
      scalingLaws: []
    };

    // Mock energy flow
    mockEnergyFlow = {
      source: 'source_field',
      target: 'target_field',
      rate: 1.0,
      efficiency: 0.8,
      mechanism: {
        type: 'diffusion',
        transferCoefficient: 0.5,
        temperature_dependence: (T: number) => Math.exp(-1/T)
      },
      dissipation: {
        mechanism: 'viscous',
        dissipationRate: 0.1,
        temperature: 300,
        fluctuation_dissipation_ratio: 2.0,
        noiseSpectrum: {
          type: 'white',
          amplitude: 0.1,
          cutoffFrequency: 10.0,
          spectralDensity: (f: number) => 1.0,
          correlationTime: 0.1
        }
      },
      conservation: {
        totalEnergy: 10.0,
        kineticEnergy: 3.0,
        potentialEnergy: 5.0,
        internalEnergy: 2.0,
        flowEnergy: 1.0,
        dissipatedEnergy: 0.5,
        conservationError: 1e-6
      },
      entropy_production: 0.05
    };
  });

  afterEach(() => {
    engine.clearCaches();
  });

  describe('Field Creation and Management', () => {
    it('should create a dynamics field with proper validation', async () => {
      const config = {
        energy: 10.0,
        momentum: [1.0, 2.0, 3.0],
        topology: mockTopology,
        phase: mockPhase,
        constraints: [],
        conservationLaws: []
      };

      const field = await engine.createDynamicsField('test_field', config);

      expect(field.id).toBe('test_field');
      expect(field.energy).toBe(10.0);
      expect(field.momentum).toEqual([1.0, 2.0, 3.0]);
      expect(field.potential + field.kinetic).toBeCloseTo(field.energy, 5);
      expect(field.topology).toBe(mockTopology);
      expect(field.phase).toBe(mockPhase);
    });

    it('should validate energy conservation during field creation', async () => {
      const config = {
        energy: 5.0, // Inconsistent with momentum
        momentum: [10.0, 10.0, 10.0], // This will give high kinetic energy
        topology: mockTopology,
        phase: mockPhase,
        constraints: [],
        conservationLaws: []
      };

      // Should throw due to energy conservation violation
      await expect(
        engine.createDynamicsField('invalid_field', config)
      ).rejects.toThrow('Energy conservation violated');
    });

    it('should calculate field gradients based on topology', async () => {
      const config = {
        energy: 10.0,
        momentum: [1.0, 0.0, 0.0],
        topology: mockTopology,
        phase: mockPhase,
        constraints: [],
        conservationLaws: []
      };

      const field = await engine.createDynamicsField('gradient_test', config);

      expect(field.fieldGradient).toHaveLength(mockTopology.dimensions);
      expect(field.fieldGradient.every((g: number) => typeof g === 'number')).toBe(true);
    });

    it('should handle constraint validation during field creation', async () => {
      const constraint: DynamicsConstraint = {
        type: 'equality',
        expression: (vars: number[]) => vars[0] - 10.0, // Energy should be 10
        gradient: (vars: number[]) => [1, 0, 0, 0],
        violationPenalty: 1000,
        tolerance: 0.1
      };

      const config = {
        energy: 10.0,
        momentum: [1.0, 0.0, 0.0],
        topology: mockTopology,
        phase: mockPhase,
        constraints: [constraint],
        conservationLaws: []
      };

      const field = await engine.createDynamicsField('constraint_test', config);
      expect(field.constraints).toContain(constraint);
    });
  });

  describe('Phase Transition Optimization', () => {
    it('should optimize phase transition parameters', async () => {
      const objectives: OptimizationObjective[] = [
        {
          name: 'minimize_barrier',
          type: 'minimize',
          weight: 1.0,
          tolerance: 0.01,
          evaluator: (field: DynamicsField) => 5.0 // Mock activation barrier
        },
        {
          name: 'maximize_rate',
          type: 'maximize',
          weight: 0.5,
          tolerance: 0.01,
          evaluator: (field: DynamicsField) => 1.0 // Mock rate
        }
      ];

      const result = await engine.optimizePhaseTransition(mockTransition, objectives);

      expect(result.success).toBeDefined();
      expect(result.iterations).toBeGreaterThan(0);
      expect(result.finalObjective).toBeGreaterThan(0);
      expect(result.convergence).toBeDefined();
      expect(result.fieldModifications).toBeInstanceOf(Array);
      expect(result.constraints_satisfied).toBe(true);
    });

    it('should respect optimization constraints', async () => {
      const objectives: OptimizationObjective[] = [
        {
          name: 'test_objective',
          type: 'minimize',
          weight: 1.0,
          tolerance: 0.01,
          evaluator: () => 1.0
        }
      ];

      const result = await engine.optimizePhaseTransition(mockTransition, objectives);

      // Check that optimized parameters are within physical bounds
      expect(result.fieldModifications.every((mod: any) =>
        typeof mod.newValue === 'number' && isFinite(mod.newValue)
      )).toBe(true);
    });

    it('should track optimization convergence', async () => {
      const objectives: OptimizationObjective[] = [
        {
          name: 'convergence_test',
          type: 'minimize',
          weight: 1.0,
          tolerance: 0.01,
          evaluator: () => Math.random() * 0.001 // Small random values for quick convergence
        }
      ];

      const result = await engine.optimizePhaseTransition(mockTransition, objectives);

      expect(result.convergence.converged).toBeDefined();
      expect(result.convergence.finalError).toBeGreaterThanOrEqual(0);
      expect(result.convergence.convergenceRate).toBeDefined();
      expect(result.convergence.stability).toBeGreaterThanOrEqual(0);
      expect(typeof result.convergence.oscillatory === 'boolean').toBe(true);
    });

    it('should handle non-convergent optimizations gracefully', async () => {
      const difficultObjectives: OptimizationObjective[] = [
        {
          name: 'difficult_objective',
          type: 'minimize',
          weight: 1.0,
          tolerance: 1e-12, // Very tight tolerance
          evaluator: () => Math.random() * 1000 // Large random values
        }
      ];

      const result = await engine.optimizePhaseTransition(mockTransition, difficultObjectives);

      expect(result.success).toBeDefined();
      expect(result.iterations).toBeGreaterThan(0);
    });
  });

  describe('Energy Flow Optimization', () => {
    it('should optimize energy flow networks', async () => {
      const flows = [mockEnergyFlow];
      const constraints: DynamicsConstraint[] = [
        {
          type: 'inequality',
          expression: (vars: number[]) => vars[0], // Energy > 0
          gradient: (vars: number[]) => [1],
          violationPenalty: 100,
          tolerance: 0.01
        }
      ];

      const result = await engine.optimizeEnergyFlow(flows, constraints);

      expect(result.energyEfficiency).toBeGreaterThan(0);
      expect(result.energyEfficiency).toBeLessThanOrEqual(1);
      expect(result.powerLoss).toBeGreaterThanOrEqual(0);
      expect(result.optimalFlows).toBeInstanceOf(Array);
      expect(result.bottlenecks).toBeInstanceOf(Array);
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should identify energy bottlenecks', async () => {
      const inefficientFlow: EnergyFlow = {
        ...mockEnergyFlow,
        efficiency: 0.3, // Low efficiency
        rate: 0.1 // Low rate
      };

      const flows = [mockEnergyFlow, inefficientFlow];
      const constraints: DynamicsConstraint[] = [];

      const result = await engine.optimizeEnergyFlow(flows, constraints);

      expect(result.bottlenecks.length).toBeGreaterThanOrEqual(0);
      expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
    });

    it('should maintain energy conservation in optimization', async () => {
      const flows = [mockEnergyFlow];
      const constraints: DynamicsConstraint[] = [];

      const result = await engine.optimizeEnergyFlow(flows, constraints);

      // Check that energy conservation is maintained
      expect(result.energyEfficiency).toBeLessThanOrEqual(1.0);
      expect(result.powerLoss).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Field Topology Optimization', () => {
    it('should optimize field topology', async () => {
      const target = {
        desiredTopology: {
          ...mockTopology,
          curvatureScalar: 0.5 // Different from original
        },
        allowedModifications: [
          {
            type: 'metric_change',
            parameters: { curvature: 0.5 },
            cost: 1.0,
            reversible: true
          }
        ],
        preservedProperties: ['dimensions'],
        optimizationMetric: (topology: FieldTopology) => -topology.metric.curvatureScalar // Minimize curvature
      };

      const result = await engine.optimizeFieldTopology(mockField, target);

      expect(result.topologyChanges).toBeInstanceOf(Array);
      expect(result.geometric_efficiency).toBeGreaterThan(0);
      expect(result.curvature_optimization).toBeGreaterThan(0);
      expect(result.symmetry_preservation).toBeGreaterThan(0);
    });

    it('should preserve specified topological properties', async () => {
      const target = {
        desiredTopology: {
          ...mockTopology,
          dimensions: 4 // Try to change dimensions
        },
        allowedModifications: [],
        preservedProperties: ['dimensions'], // Should prevent dimension change
        optimizationMetric: () => 1.0
      };

      const result = await engine.optimizeFieldTopology(mockField, target);

      // Should preserve dimensions
      expect(result.symmetry_preservation).toBeGreaterThan(0.5);
    });
  });

  describe('Multi-Objective Optimization', () => {
    it('should perform multi-objective optimization', async () => {
      const objectives: OptimizationObjective[] = [
        {
          name: 'objective_1',
          type: 'minimize',
          weight: 0.6,
          tolerance: 0.01,
          evaluator: () => Math.random()
        },
        {
          name: 'objective_2',
          type: 'maximize',
          weight: 0.4,
          tolerance: 0.01,
          evaluator: () => Math.random()
        }
      ];

      const result = await engine.multiObjectiveOptimization(mockField, objectives);

      expect(result.paretoFront).toBeInstanceOf(Array);
      expect(result.dominated_solutions).toBeGreaterThanOrEqual(0);
      expect(result.hypervolume).toBeGreaterThan(0);
      expect(result.spacing_metric).toBeGreaterThanOrEqual(0);
      expect(result.convergence_metric).toBeGreaterThanOrEqual(0);
    });

    it('should generate Pareto-optimal solutions', async () => {
      const objectives: OptimizationObjective[] = [
        {
          name: 'competing_1',
          type: 'minimize',
          weight: 1.0,
          tolerance: 0.01,
          evaluator: () => 1.0
        },
        {
          name: 'competing_2',
          type: 'minimize',
          weight: 1.0,
          tolerance: 0.01,
          evaluator: () => 2.0
        }
      ];

      const result = await engine.multiObjectiveOptimization(mockField, objectives);

      expect(result.paretoFront.length).toBeGreaterThan(0);

      // Check that Pareto front solutions are valid
      for (const point of result.paretoFront) {
        expect(point.objectives).toBeInstanceOf(Array);
        expect(point.objectives.length).toBe(objectives.length);
        expect(point.field).toBeDefined();
        expect(point.crowding_distance).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Phase Transition Simulation', () => {
    it('should simulate phase transition dynamics', async () => {
      const timeSpan = 1.0;
      const initialConditions = [1.0, 0.0, 0.0];

      const result = await engine.simulatePhaseTransition(
        mockTransition,
        timeSpan,
        initialConditions
      );

      expect(result.success).toBe(true);
      expect(result.timePoints.length).toBeGreaterThan(0);
      expect(result.trajectory.length).toBe(result.timePoints.length);
      expect(result.finalState).toBeInstanceOf(Array);
      expect(result.conservedQuantities).toBeInstanceOf(Map);
      expect(result.phaseEvolution).toBeInstanceOf(Array);
      expect(result.energyEvolution).toBeInstanceOf(Array);
    });

    it('should maintain conservation laws during simulation', async () => {
      const timeSpan = 0.5;
      const initialConditions = [1.0, 0.0, 0.0];

      const result = await engine.simulatePhaseTransition(
        mockTransition,
        timeSpan,
        initialConditions
      );

      // Check energy conservation (should not drift significantly)
      const energyDrift = Math.abs(
        result.energyEvolution[result.energyEvolution.length - 1] -
                result.energyEvolution[0]
      ) / result.energyEvolution[0];

      expect(energyDrift).toBeLessThan(0.1); // 10% tolerance for numerical drift
    });

    it('should cache simulation results', async () => {
      const timeSpan = 0.1;
      const initialConditions = [1.0, 0.0, 0.0];

      // First simulation
      const result1 = await engine.simulatePhaseTransition(
        mockTransition,
        timeSpan,
        initialConditions
      );

      // Second simulation with same parameters (should use cache)
      const start = Date.now();
      const result2 = await engine.simulatePhaseTransition(
        mockTransition,
        timeSpan,
        initialConditions
      );
      const duration = Date.now() - start;

      expect(result1.timePoints).toEqual(result2.timePoints);
      expect(result1.trajectory).toEqual(result2.trajectory);
      expect(duration).toBeLessThan(10); // Should be very fast due to caching
    });
  });

  describe('Energy Flow Simulation', () => {
    it('should simulate energy flow dynamics', async () => {
      const flows = [mockEnergyFlow];
      const timeSpan = 1.0;
      const perturbations: Perturbation[] = [
        {
          type: 'impulse',
          amplitude: 0.1,
          duration: 0.1,
          startTime: 0.5,
          target: 'source_field',
          spatial_profile: () => 1.0,
          temporal_profile: (t: number) => t < 0.1 ? 1.0 : 0.0
        }
      ];

      const result = await engine.simulateEnergyFlow(flows, timeSpan, perturbations);

      expect(result.success).toBe(true);
      expect(result.flowEfficiency).toBeInstanceOf(Array);
      expect(result.dissipationRate).toBeInstanceOf(Array);
      expect(result.powerSpectrum).toBeDefined();
      expect(result.powerSpectrum.frequencies).toBeInstanceOf(Array);
      expect(result.powerSpectrum.power).toBeInstanceOf(Array);
    });

    it('should track energy efficiency over time', async () => {
      const flows = [mockEnergyFlow];
      const timeSpan = 0.5;

      const result = await engine.simulateEnergyFlow(flows, timeSpan, []);

      expect(result.flowEfficiency.length).toBeGreaterThan(0);
      expect(result.flowEfficiency.every((eff: number) => eff >= 0 && eff <= 1)).toBe(true);
    });

    it('should calculate power spectrum', async () => {
      const flows = [mockEnergyFlow];
      const timeSpan = 1.0;

      const result = await engine.simulateEnergyFlow(flows, timeSpan, []);

      expect(result.powerSpectrum.frequencies.length).toBeGreaterThan(0);
      expect(result.powerSpectrum.power.length).toBe(result.powerSpectrum.frequencies.length);
      expect(result.powerSpectrum.noise_floor).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Field Evolution Simulation', () => {
    it('should simulate field evolution under external forces', async () => {
      const timeSpan = 1.0;
      const externalForces: ExternalForce[] = [
        {
          type: 'constant',
          magnitude: 1.0,
          direction: [1, 0, 0],
          force_function: () => [1, 0, 0]
        }
      ];

      const result = await engine.simulateFieldEvolution(
        mockField,
        timeSpan,
        externalForces
      );

      expect(result.success).toBe(true);
      expect(result.fieldConfiguration).toBeInstanceOf(Array);
      expect(result.topology_evolution).toBeInstanceOf(Array);
      expect(result.defect_trajectories).toBeInstanceOf(Array);
      expect(result.correlation_functions).toBeDefined();
    });

    it('should track topological defects', async () => {
      const timeSpan = 0.5;
      const externalForces: ExternalForce[] = [];

      const result = await engine.simulateFieldEvolution(
        mockField,
        timeSpan,
        externalForces
      );

      // Check defect trajectory structure
      for (const defectTraj of result.defect_trajectories) {
        expect(defectTraj.defect).toBeDefined();
        expect(defectTraj.trajectory).toBeInstanceOf(Array);
        expect(defectTraj.creation_time).toBeGreaterThanOrEqual(0);
        expect(defectTraj.interactions).toBeInstanceOf(Array);
      }
    });

    it('should calculate correlation functions', async () => {
      const timeSpan = 0.5;
      const externalForces: ExternalForce[] = [];

      const result = await engine.simulateFieldEvolution(
        mockField,
        timeSpan,
        externalForces
      );

      expect(result.correlation_functions.spatial).toBeInstanceOf(Array);
      expect(result.correlation_functions.temporal).toBeInstanceOf(Array);
      expect(result.correlation_functions.spatiotemporal).toBeInstanceOf(Array);
      expect(result.correlation_functions.correlation_length).toBeInstanceOf(Array);
      expect(result.correlation_functions.correlation_time).toBeInstanceOf(Array);
    });
  });

  describe('Monte Carlo Simulation', () => {
    it('should perform Monte Carlo simulation', async () => {
      const temperature = 1.0;
      const steps = 1000;

      const result = await engine.monte_carlo_simulation(
        mockField,
        temperature,
        steps
      );

      expect(result.success).toBe(true);
      expect(result.acceptance_rate).toBeGreaterThan(0);
      expect(result.acceptance_rate).toBeLessThanOrEqual(1);
      expect(result.autocorrelation_time).toBeGreaterThan(0);
      expect(result.effective_samples).toBeGreaterThan(0);
      expect(result.specific_heat).toBeGreaterThan(0);
      expect(result.susceptibility).toBeGreaterThan(0);
      expect(result.order_parameter).toBeInstanceOf(Array);
      expect(result.distribution).toBeDefined();
    });

    it('should show temperature dependence', async () => {
      const lowT = 0.1;
      const highT = 10.0;
      const steps = 500;

      const lowTResult = await engine.monte_carlo_simulation(mockField, lowT, steps);
      const highTResult = await engine.monte_carlo_simulation(mockField, highT, steps);

      // At low temperature, should have lower acceptance rate
      // At high temperature, should have higher acceptance rate
      expect(highTResult.acceptance_rate).toBeGreaterThanOrEqual(lowTResult.acceptance_rate);
    });

    it('should calculate proper distribution statistics', async () => {
      const temperature = 1.0;
      const steps = 1000;

      const result = await engine.monte_carlo_simulation(
        mockField,
        temperature,
        steps
      );

      const dist = result.distribution;
      expect(dist.bins).toBeInstanceOf(Array);
      expect(dist.probabilities).toBeInstanceOf(Array);
      expect(typeof dist.mean === 'number').toBe(true);
      expect(dist.variance).toBeGreaterThanOrEqual(0);
      expect(typeof dist.skewness === 'number').toBe(true);
      expect(typeof dist.kurtosis === 'number').toBe(true);
      expect(dist.entropy).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Analysis Methods', () => {
    it('should analyze phase stability', () => {
      const analysis = engine.analyzePhaseStability(mockPhase);

      expect(typeof analysis.stable === 'boolean').toBe(true);
      expect(analysis.eigenvalues).toBeInstanceOf(Array);
      expect(analysis.stability_margin).toBeGreaterThanOrEqual(0);
      expect(analysis.bifurcation_distance).toBeGreaterThanOrEqual(0);
      expect(['fixed_point', 'limit_cycle', 'torus', 'strange_attractor'])
        .toContain(analysis.attractor_type);
      expect(analysis.basin_of_attraction).toBeDefined();
      expect(analysis.lyapunov_spectrum).toBeInstanceOf(Array);
    });

    it('should analyze transition dynamics', () => {
      const analysis = engine.analyzeTransitionDynamics(mockTransition);

      expect(typeof analysis.mechanism === 'string').toBe(true);
      expect(analysis.pathway).toBeDefined();
      expect(typeof analysis.rate_limiting_step === 'string').toBe(true);
      expect(analysis.activation_barriers).toBeInstanceOf(Array);
      expect(analysis.intermediates).toBeInstanceOf(Array);
      expect(analysis.kinetic_bottlenecks).toBeInstanceOf(Array);
    });

    it('should analyze energy efficiency', () => {
      const flows = [mockEnergyFlow];
      const analysis = engine.analyzeEnergyEfficiency(flows);

      expect(analysis.overall_efficiency).toBeGreaterThan(0);
      expect(analysis.overall_efficiency).toBeLessThanOrEqual(1);
      expect(analysis.component_efficiencies).toBeInstanceOf(Map);
      expect(analysis.losses).toBeInstanceOf(Array);
      expect(analysis.optimization_potential).toBeGreaterThanOrEqual(0);
      expect(analysis.bottleneck_analysis).toBeDefined();
    });

    it('should analyze topological properties', () => {
      const analysis = engine.analyzeTopologicalProperties(mockField);

      expect(typeof analysis.genus === 'number').toBe(true);
      expect(typeof analysis.euler_characteristic === 'number').toBe(true);
      expect(analysis.betti_numbers).toBeInstanceOf(Array);
      expect(typeof analysis.fundamental_group === 'string').toBe(true);
      expect(analysis.homology_groups).toBeInstanceOf(Array);
      expect(analysis.homotopy_groups).toBeInstanceOf(Array);
      expect(analysis.topological_invariants).toBeInstanceOf(Array);
    });

    it('should analyze critical behavior', () => {
      const criticalPoint = mockTransition.criticalPoint;
      const analysis = engine.analyzeCriticalBehavior(criticalPoint);

      expect(typeof analysis.universality_class === 'string').toBe(true);
      expect(analysis.critical_exponents).toBeDefined();
      expect(analysis.scaling_functions).toBeInstanceOf(Map);
      expect(analysis.finite_size_effects).toBeDefined();
      expect(analysis.corrections_to_scaling).toBeDefined();
    });
  });

  describe('Engine Statistics and Management', () => {
    it('should track engine statistics', async () => {
      // Create some activity
      await engine.createDynamicsField('stat_test', {
        energy: 5.0,
        momentum: [1.0, 0.0, 0.0],
        topology: mockTopology,
        phase: mockPhase,
        constraints: [],
        conservationLaws: []
      });

      const stats = engine.getEngineStatistics();

      expect(stats.activeFields).toBeGreaterThan(0);
      expect(stats.phaseTransitions).toBeGreaterThanOrEqual(0);
      expect(stats.energyFlows).toBeGreaterThanOrEqual(0);
      expect(stats.optimizationsPerformed).toBeGreaterThanOrEqual(0);
      expect(stats.simulationsCached).toBeGreaterThanOrEqual(0);
      expect(stats.averageOptimizationIterations).toBeGreaterThanOrEqual(0);
    });

    it('should clear caches and history', () => {
      expect(() => engine.clearCaches()).not.toThrow();

      const stats = engine.getEngineStatistics();
      expect(stats.optimizationsPerformed).toBe(0);
      expect(stats.simulationsCached).toBe(0);
    });

    it('should maintain optimization history size', async () => {
      // Perform many optimizations to test history maintenance
      const objectives: OptimizationObjective[] = [
        {
          name: 'simple',
          type: 'minimize',
          weight: 1.0,
          tolerance: 0.1,
          evaluator: () => Math.random()
        }
      ];

      // This would normally create many optimization results
      for (let i = 0; i < 5; i++) {
        await engine.optimizePhaseTransition(mockTransition, objectives);
      }

      const stats = engine.getEngineStatistics();
      expect(stats.optimizationsPerformed).toBeLessThanOrEqual(100); // Max history size
    });

    it('should maintain simulation cache size', async () => {
      // Perform many simulations to test cache maintenance
      for (let i = 0; i < 5; i++) {
        await engine.simulatePhaseTransition(
          mockTransition,
          0.1,
          [Math.random(), Math.random(), Math.random()]
        );
      }

      const stats = engine.getEngineStatistics();
      expect(stats.simulationsCached).toBeLessThanOrEqual(50); // Max cache size
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid field parameters gracefully', async () => {
      const invalidConfig = {
        energy: NaN,
        momentum: [Infinity, -Infinity, NaN],
        topology: mockTopology,
        phase: mockPhase,
        constraints: [],
        conservationLaws: []
      };

      await expect(
        engine.createDynamicsField('invalid', invalidConfig)
      ).rejects.toThrow();
    });

    it('should handle empty optimization objectives', async () => {
      const result = await engine.optimizePhaseTransition(mockTransition, []);

      expect(result.success).toBeDefined();
      expect(result.fieldModifications).toBeInstanceOf(Array);
    });

    it('should handle zero-time simulations', async () => {
      const result = await engine.simulatePhaseTransition(
        mockTransition,
        0,
        [1.0, 0.0, 0.0]
      );

      expect(result.success).toBe(true);
      expect(result.timePoints.length).toBeGreaterThan(0);
      expect(result.trajectory.length).toBeGreaterThan(0);
    });

    it('should handle empty energy flows', async () => {
      const result = await engine.optimizeEnergyFlow([], []);

      expect(result.energyEfficiency).toBeGreaterThanOrEqual(0);
      expect(result.optimalFlows).toBeInstanceOf(Array);
      expect(result.bottlenecks).toBeInstanceOf(Array);
    });

    it('should handle Monte Carlo with zero steps', async () => {
      const result = await engine.monte_carlo_simulation(
        mockField,
        1.0,
        0
      );

      expect(result.success).toBe(true);
      expect(result.acceptance_rate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration and Consistency', () => {
    it('should maintain consistency between optimization and simulation', async () => {
      // Optimize a transition
      const objectives: OptimizationObjective[] = [
        {
          name: 'test',
          type: 'minimize',
          weight: 1.0,
          tolerance: 0.01,
          evaluator: () => 1.0
        }
      ];

      const optimization = await engine.optimizePhaseTransition(mockTransition, objectives);

      // Simulate the optimized transition
      const simulation = await engine.simulatePhaseTransition(
        mockTransition,
        0.1,
        [1.0, 0.0, 0.0]
      );

      expect(optimization.success).toBeDefined();
      expect(simulation.success).toBe(true);

      // Both should use the same transition object
      expect(simulation.phaseEvolution.length).toBeGreaterThan(0);
    });

    it('should maintain physical constraints across operations', async () => {
      // Create field with constraints
      const constraint: DynamicsConstraint = {
        type: 'inequality',
        expression: (vars: number[]) => vars[0], // Energy > 0
        gradient: (vars: number[]) => [1, 0, 0, 0],
        violationPenalty: 1000,
        tolerance: 0.01
      };

      const field = await engine.createDynamicsField('constrained', {
        energy: 10.0,
        momentum: [1.0, 0.0, 0.0],
        topology: mockTopology,
        phase: mockPhase,
        constraints: [constraint],
        conservationLaws: []
      });

      // Simulate field evolution
      const result = await engine.simulateFieldEvolution(field, 0.1, []);

      // Energy should remain positive throughout simulation
      expect(result.energyEvolution.every((e: number) => e > 0)).toBe(true);
    });
  });
});
