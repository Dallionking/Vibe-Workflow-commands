/**
 * Field Protocol Dynamics Engine Interfaces
 * Phase 3: Advanced Context Features - Tier 2.4
 *
 * Defines interfaces for phase transitions, energy flow optimization,
 * and advanced field dynamics in the context system.
 */

export interface DynamicsField {
    id: string;
    name: string;
    energy: number;
    momentum: number[];
    potential: number;
    kinetic: number;
    fieldGradient: number[];
    curvature: number;
    topology: FieldTopology;
    phase: DynamicsPhase;
    transitions: PhaseTransition[];
    constraints: DynamicsConstraint[];
    conservationLaws: ConservationLaw[];
}

export interface FieldTopology {
    type: 'euclidean' | 'hyperbolic' | 'spherical' | 'torus' | 'manifold';
    dimensions: number;
    metric: MetricTensor;
    boundaries: BoundaryCondition[];
    singularities: Singularity[];
    symmetries: Symmetry[];
}

export interface MetricTensor {
    components: number[][];
    determinant: number;
    signature: number[];
    curvatureScalar: number;
    riemannTensor: number[][][][];
}

export interface BoundaryCondition {
    type: 'dirichlet' | 'neumann' | 'periodic' | 'absorbing' | 'reflecting';
    region: GeometricRegion;
    value?: number | ((position: number[]) => number);
    gradient?: number[];
}

export interface Singularity {
    type: 'pole' | 'branch_cut' | 'essential' | 'removable';
    position: number[];
    strength: number;
    residue?: number;
    neighborhood: number;
}

export interface Symmetry {
    type: 'translation' | 'rotation' | 'reflection' | 'gauge' | 'scale';
    generator: number[][];
    conservedQuantity: string;
    noetherCharge: number;
}

export interface GeometricRegion {
    type: 'sphere' | 'cube' | 'torus' | 'cylinder' | 'plane' | 'custom';
    center: number[];
    parameters: Record<string, number>;
    boundaryFunction?: (position: number[]) => number;
}

export interface DynamicsPhase {
    id: string;
    name: string;
    orderParameter: OrderParameter;
    stability: PhaseStability;
    criticalTemperature?: number;
    criticalPressure?: number;
    freeEnergy: number;
    entropy: number;
    specificHeat: number;
    susceptibility: number;
    correlationLength: number;
    excitations: Excitation[];
}

export interface OrderParameter {
    value: number;
    fluctuations: number;
    correlation: CorrelationFunction;
    symmetryBreaking: SymmetryBreaking[];
    criticalExponent: number;
}

export interface CorrelationFunction {
    spatial: (distance: number) => number;
    temporal: (time: number) => number;
    spatiotemporal: (position: number[], time: number) => number;
    range: number;
    decayType: 'exponential' | 'power_law' | 'algebraic' | 'stretched';
}

export interface SymmetryBreaking {
    brokenSymmetry: Symmetry;
    vacuumState: number[];
    goldstoneBoson?: Excitation;
    maslessMode?: Excitation;
    topologicalDefect?: TopologicalDefect;
}

export interface TopologicalDefect {
    type: 'domain_wall' | 'vortex' | 'monopole' | 'instanton' | 'skyrmion';
    dimension: number;
    topologicalCharge: number;
    energy: number;
    size: number;
    stability: number;
}

export interface PhaseStability {
    localStability: number;
    globalStability: number;
    thermodynamicStability: number;
    mechanicalStability: number;
    criticalFluctuations: number;
    eigenvalues: number[];
    lyapunovExponents: number[];
    stabilityMatrix: number[][];
    basinsOfAttraction: AttractorBasin[];
    perturbationResponse: PerturbationResponse;
}

export interface AttractorBasin {
    attractor: DynamicsPhase;
    volume: number;
    shape: GeometricRegion;
    fractalDimension?: number;
    riddledBasin: boolean;
}

export interface PerturbationResponse {
    linearResponse: (perturbation: number[]) => number[];
    nonlinearResponse: (perturbation: number[]) => number[];
    relaxationTime: number;
    oscillationFrequency?: number;
    dampingRate: number;
}

export interface Excitation {
    type: 'phonon' | 'magnon' | 'plasmon' | 'polaron' | 'soliton' | 'breather';
    energy: number;
    momentum: number[];
    wavelength: number;
    frequency: number;
    amplitude: number;
    groupVelocity: number[];
    phaseVelocity: number[];
    dispersionRelation: (momentum: number[]) => number;
    lifetime: number;
    scatteringCrossSection: number;
}

export interface PhaseTransition {
    id: string;
    type: PhaseTransitionType;
    fromPhase: string;
    toPhase: string;
    order: number;
    energyBarrier: number;
    criticalPoint: CriticalPoint;
    nucleation: NucleationProcess;
    kinetics: TransitionKinetics;
    universalityClass: UniversalityClass;
    scalingLaws: ScalingLaw[];
    hysteresis?: HysteresisLoop;
}

export type PhaseTransitionType =
    | 'continuous'
    | 'discontinuous'
    | 'quantum'
    | 'topological'
    | 'glass'
    | 'jamming'
    | 'percolation'
    | 'metal_insulator'
    | 'superconducting'
    | 'magnetic';

export interface CriticalPoint {
    position: number[];
    temperature: number;
    pressure: number;
    magneticField?: number;
    criticalExponents: CriticalExponents;
    correlationLength: number;
    fluctuations: number;
    scalingFunction: (variable: number) => number;
}

export interface CriticalExponents {
    alpha: number;  // Specific heat
    beta: number;   // Order parameter
    gamma: number;  // Susceptibility
    delta: number;  // Critical isotherm
    nu: number;     // Correlation length
    eta: number;    // Correlation function
}

export interface NucleationProcess {
    mechanism: 'homogeneous' | 'heterogeneous' | 'spinodal' | 'quantum';
    nucleationRate: number;
    criticalRadius: number;
    activationBarrier: number;
    surfaceTension: number;
    nucleationSites: NucleationSite[];
    growthKinetics: GrowthKinetics;
}

export interface NucleationSite {
    position: number[];
    type: 'defect' | 'interface' | 'impurity' | 'thermal_fluctuation';
    energyBarrierReduction: number;
    preferentialGrowthDirection?: number[];
}

export interface GrowthKinetics {
    growthRate: number;
    growthExponent: number;
    interfaceVelocity: (position: number[]) => number[];
    morphology: 'spherical' | 'dendritic' | 'fractal' | 'cellular';
    anisotropy: number;
}

export interface TransitionKinetics {
    timeScale: number;
    relaxationSpectrum: RelaxationMode[];
    nonExponentialRelaxation: boolean;
    agingEffects: boolean;
    memoryEffects: boolean;
    cooperativity: number;
}

export interface RelaxationMode {
    relaxationTime: number;
    amplitude: number;
    stretchingExponent: number;
    temperature_dependence: (temperature: number) => number;
    activationEnergy: number;
}

export interface UniversalityClass {
    name: string;
    dimension: number;
    symmetry: string;
    criticalExponents: CriticalExponents;
    scalingFunctions: Map<string, (x: number) => number>;
    fixedPoints: FixedPoint[];
    relevantOperators: RelevantOperator[];
}

export interface FixedPoint {
    coordinates: number[];
    stability: 'stable' | 'unstable' | 'saddle';
    eigenvalues: number[];
    scalingDimensions: number[];
    universalAmplitudes: number[];
}

export interface RelevantOperator {
    name: string;
    scalingDimension: number;
    universalAmplitude: number;
    operator: (field: number[]) => number;
}

export interface ScalingLaw {
    quantity: string;
    exponent: number;
    amplitude: number;
    correction_exponent?: number;
    scalingFunction: (x: number) => number;
    crossoverScale?: number;
}

export interface HysteresisLoop {
    area: number;
    coercivity: number;
    remanence: number;
    saturation: number;
    squareness: number;
    branches: HysteresisBranch[];
}

export interface HysteresisBranch {
    direction: 'forward' | 'backward';
    curve: (input: number) => number;
    switchingField: number;
    slope: number;
}

export interface EnergyFlow {
    source: string;
    target: string;
    rate: number;
    efficiency: number;
    mechanism: EnergyTransferMechanism;
    dissipation: DissipationProcess;
    conservation: EnergyConservation;
    entropy_production: number;
}

export interface EnergyTransferMechanism {
    type: 'diffusion' | 'convection' | 'radiation' | 'tunneling' | 'resonance' | 'nonlinear';
    transferCoefficient: number;
    temperature_dependence: (temperature: number) => number;
    frequency_dependence?: (frequency: number) => number;
    nonlinearity?: NonlinearTransfer;
}

export interface NonlinearTransfer {
    order: number;
    coefficients: number[];
    threshold: number;
    saturation: number;
    bistability?: boolean;
}

export interface DissipationProcess {
    mechanism: 'viscous' | 'ohmic' | 'radiative' | 'collision' | 'dephasing';
    dissipationRate: number;
    temperature: number;
    fluctuation_dissipation_ratio: number;
    noiseSpectrum: NoiseSpectrum;
}

export interface NoiseSpectrum {
    type: 'white' | 'pink' | 'brown' | 'blue' | 'violet';
    amplitude: number;
    cutoffFrequency: number;
    spectralDensity: (frequency: number) => number;
    correlationTime: number;
}

export interface EnergyConservation {
    totalEnergy: number;
    kineticEnergy: number;
    potentialEnergy: number;
    internalEnergy: number;
    flowEnergy: number;
    dissipatedEnergy: number;
    conservationError: number;
}

export interface DynamicsConstraint {
    type: 'holonomic' | 'nonholonomic' | 'inequality' | 'equality';
    expression: (variables: number[]) => number;
    gradient: (variables: number[]) => number[];
    lagrangeMultiplier?: number;
    violationPenalty: number;
    tolerance: number;
}

export interface ConservationLaw {
    name: string;
    quantity: string;
    value: number;
    uncertainty: number;
    noetherTheorem: NoetherTheorem;
    violationRate: number;
    localVsGlobal: 'local' | 'global' | 'both';
}

export interface NoetherTheorem {
    symmetry: Symmetry;
    conservedCurrent: (position: number[], time: number) => number[];
    continuityEquation: boolean;
    anomaly?: number;
}

export interface DynamicsOptimizer {
    optimizePhaseTransition(
        transition: PhaseTransition,
        objectives: OptimizationObjective[]
    ): Promise<OptimizationResult>;

    optimizeEnergyFlow(
        flows: EnergyFlow[],
        constraints: DynamicsConstraint[]
    ): Promise<EnergyOptimizationResult>;

    optimizeFieldTopology(
        field: DynamicsField,
        target: TopologyTarget
    ): Promise<TopologyOptimizationResult>;

    multiObjectiveOptimization(
        field: DynamicsField,
        objectives: OptimizationObjective[]
    ): Promise<ParetoOptimizationResult>;
}

export interface OptimizationObjective {
    name: string;
    type: 'minimize' | 'maximize' | 'target';
    weight: number;
    target?: number;
    tolerance: number;
    evaluator: (field: DynamicsField) => number;
    gradient?: (field: DynamicsField) => number[];
}

export interface OptimizationResult {
    success: boolean;
    iterations: number;
    finalObjective: number;
    improvement: number;
    convergence: ConvergenceInfo;
    fieldModifications: FieldModification[];
    constraints_satisfied: boolean;
}

export interface EnergyOptimizationResult extends OptimizationResult {
    energyEfficiency: number;
    powerLoss: number;
    optimalFlows: EnergyFlow[];
    bottlenecks: EnergyBottleneck[];
    recommendations: string[];
}

export interface EnergyBottleneck {
    location: string;
    type: 'capacity' | 'resistance' | 'dissipation' | 'mismatch';
    severity: number;
    impact: number;
    mitigation: string[];
}

export interface TopologyTarget {
    desiredTopology: FieldTopology;
    allowedModifications: TopologyModification[];
    preservedProperties: string[];
    optimizationMetric: (topology: FieldTopology) => number;
}

export interface TopologyModification {
    type: 'metric_change' | 'boundary_change' | 'dimension_change' | 'singularity_add' | 'singularity_remove';
    parameters: Record<string, any>;
    cost: number;
    reversible: boolean;
}

export interface TopologyOptimizationResult extends OptimizationResult {
    topologyChanges: TopologyModification[];
    geometric_efficiency: number;
    curvature_optimization: number;
    symmetry_preservation: number;
}

export interface ParetoOptimizationResult extends OptimizationResult {
    paretoFront: ParetoPoint[];
    dominated_solutions: number;
    hypervolume: number;
    spacing_metric: number;
    convergence_metric: number;
}

export interface ParetoPoint {
    objectives: number[];
    field: DynamicsField;
    dominates: string[];
    dominated_by: string[];
    crowding_distance: number;
}

export interface FieldModification {
    parameter: string;
    originalValue: any;
    newValue: any;
    change: number;
    impact: number;
    reversible: boolean;
}

export interface ConvergenceInfo {
    converged: boolean;
    finalError: number;
    iterations: number;
    convergenceRate: number;
    stability: number;
    oscillatory: boolean;
}

export interface DynamicsSimulator {
    simulatePhaseTransition(
        transition: PhaseTransition,
        timeSpan: number,
        initialConditions: number[]
    ): Promise<SimulationResult>;

    simulateEnergyFlow(
        flows: EnergyFlow[],
        timeSpan: number,
        perturbations: Perturbation[]
    ): Promise<EnergySimulationResult>;

    simulateFieldEvolution(
        field: DynamicsField,
        timeSpan: number,
        externalForces: ExternalForce[]
    ): Promise<FieldSimulationResult>;

    monte_carlo_simulation(
        field: DynamicsField,
        temperature: number,
        steps: number
    ): Promise<MonteCarloResult>;
}

export interface SimulationResult {
    success: boolean;
    timePoints: number[];
    trajectory: number[][];
    finalState: number[];
    conservedQuantities: Map<string, number[]>;
    phaseEvolution: DynamicsPhase[];
    energyEvolution: number[];
}

export interface EnergySimulationResult extends SimulationResult {
    flowEfficiency: number[];
    dissipationRate: number[];
    powerSpectrum: PowerSpectrum;
    thermodynamicCycle?: ThermodynamicCycle;
}

export interface PowerSpectrum {
    frequencies: number[];
    power: number[];
    peaks: SpectrumPeak[];
    noise_floor: number;
}

export interface SpectrumPeak {
    frequency: number;
    power: number;
    width: number;
    quality_factor: number;
}

export interface ThermodynamicCycle {
    processes: ThermodynamicProcess[];
    efficiency: number;
    work_output: number;
    heat_input: number;
    entropy_change: number;
}

export interface ThermodynamicProcess {
    type: 'isothermal' | 'adiabatic' | 'isobaric' | 'isochoric';
    initialState: ThermodynamicState;
    finalState: ThermodynamicState;
    work: number;
    heat: number;
    entropy_change: number;
}

export interface ThermodynamicState {
    temperature: number;
    pressure: number;
    volume: number;
    internal_energy: number;
    enthalpy: number;
    entropy: number;
    free_energy: number;
}

export interface FieldSimulationResult extends SimulationResult {
    fieldConfiguration: number[][][];
    topology_evolution: FieldTopology[];
    defect_trajectories: DefectTrajectory[];
    correlation_functions: CorrelationEvolution;
}

export interface DefectTrajectory {
    defect: TopologicalDefect;
    trajectory: number[][];
    creation_time: number;
    annihilation_time?: number;
    interactions: DefectInteraction[];
}

export interface DefectInteraction {
    partner: string;
    type: 'attraction' | 'repulsion' | 'annihilation' | 'creation';
    strength: number;
    time: number;
    outcome?: string;
}

export interface CorrelationEvolution {
    spatial: number[][];
    temporal: number[][];
    spatiotemporal: number[][][];
    correlation_length: number[];
    correlation_time: number[];
}

export interface MonteCarloResult extends SimulationResult {
    acceptance_rate: number;
    autocorrelation_time: number;
    effective_samples: number;
    equilibration_time: number;
    specific_heat: number;
    susceptibility: number;
    order_parameter: number[];
    distribution: ProbabilityDistribution;
}

export interface ProbabilityDistribution {
    bins: number[];
    probabilities: number[];
    mean: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    entropy: number;
}

export interface Perturbation {
    type: 'impulse' | 'step' | 'ramp' | 'sinusoidal' | 'random' | 'custom';
    amplitude: number;
    duration: number;
    startTime: number;
    target: string;
    spatial_profile: (position: number[]) => number;
    temporal_profile: (time: number) => number;
}

export interface ExternalForce {
    type: 'constant' | 'linear' | 'harmonic' | 'random' | 'custom';
    magnitude: number;
    direction: number[];
    frequency?: number;
    phase?: number;
    force_function: (position: number[], time: number) => number[];
}

export interface DynamicsAnalyzer {
    analyzePhaseStability(phase: DynamicsPhase): StabilityAnalysis;
    analyzeTransitionDynamics(transition: PhaseTransition): TransitionAnalysis;
    analyzeEnergyEfficiency(flows: EnergyFlow[]): EfficiencyAnalysis;
    analyzeTopologicalProperties(field: DynamicsField): TopologyAnalysis;
    analyzeCriticalBehavior(criticalPoint: CriticalPoint): CriticalityAnalysis;
}

export interface StabilityAnalysis {
    stable: boolean;
    eigenvalues: number[];
    stability_margin: number;
    bifurcation_distance: number;
    attractor_type: 'fixed_point' | 'limit_cycle' | 'torus' | 'strange_attractor';
    basin_of_attraction: AttractorBasin;
    lyapunov_spectrum: number[];
}

export interface TransitionAnalysis {
    mechanism: string;
    pathway: TransitionPathway;
    rate_limiting_step: string;
    activation_barriers: ActivationBarrier[];
    intermediates: DynamicsPhase[];
    kinetic_bottlenecks: KineticBottleneck[];
}

export interface TransitionPathway {
    coordinates: number[][];
    energies: number[];
    reaction_coordinate: number[];
    free_energy_profile: number[];
    committor_probability: number[];
}

export interface ActivationBarrier {
    height: number;
    width: number;
    temperature_dependence: (T: number) => number;
    tunneling_rate?: number;
    classical_rate: number;
}

export interface KineticBottleneck {
    location: number[];
    type: 'entropic' | 'energetic' | 'geometric' | 'dynamic';
    severity: number;
    mitigation: string[];
}

export interface EfficiencyAnalysis {
    overall_efficiency: number;
    component_efficiencies: Map<string, number>;
    losses: EnergyLoss[];
    optimization_potential: number;
    bottleneck_analysis: BottleneckAnalysis;
}

export interface EnergyLoss {
    mechanism: string;
    amount: number;
    percentage: number;
    location: string;
    avoidable: boolean;
}

export interface BottleneckAnalysis {
    primary_bottleneck: string;
    bottleneck_severity: number;
    alternative_pathways: string[];
    mitigation_strategies: string[];
}

export interface TopologyAnalysis {
    genus: number;
    euler_characteristic: number;
    betti_numbers: number[];
    fundamental_group: string;
    homology_groups: HomologyGroup[];
    homotopy_groups: HomotopyGroup[];
    topological_invariants: TopologicalInvariant[];
}

export interface HomologyGroup {
    dimension: number;
    rank: number;
    torsion: number[];
    generators: number[][];
}

export interface HomotopyGroup {
    dimension: number;
    group: string;
    generators: number[][];
    relations: string[];
}

export interface TopologicalInvariant {
    name: string;
    value: number;
    stability: number;
    physical_meaning: string;
}

export interface CriticalityAnalysis {
    universality_class: string;
    critical_exponents: CriticalExponents;
    scaling_functions: Map<string, (x: number) => number>;
    finite_size_effects: FiniteSizeScaling;
    corrections_to_scaling: CorrectionAnalysis;
}

export interface FiniteSizeScaling {
    size_dependence: (size: number) => number;
    aspect_ratio_effects: boolean;
    boundary_condition_dependence: boolean;
    scaling_corrections: number[];
}

export interface CorrectionAnalysis {
    leading_correction: number;
    subleading_corrections: number[];
    confluent_correction: number;
    analytic_corrections: boolean;
}
