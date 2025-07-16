/**
 * End-to-End Integration Tests for Tier 3 System Manager
 * Phase 3: Advanced Context Features - Complete System
 * 
 * Comprehensive test suite for the entire Tier 3 system integration
 * including all components and their interactions.
 */

import { 
    Tier3SystemManager, 
    Tier3SystemConfig, 
    createTier3System, 
    checkTier3Health,
    DEFAULT_TIER3_CONFIG 
} from './index';

// Mock all component imports
jest.mock('./phase-generation', () => ({
    PRPPhaseGenerator: jest.fn().mockImplementation(() => ({
        generateNewPhase: jest.fn().mockResolvedValue({
            success: true,
            phase: { id: 'test-phase', content: 'test' }
        })
    })),
    PhaseTransformer: jest.fn(),
    ValidationGate: jest.fn(),
    ExamplePatternLibrary: jest.fn()
}));

jest.mock('./performance', () => ({
    PerformanceOptimizer: jest.fn().mockImplementation(() => ({
        optimize: jest.fn().mockResolvedValue({
            success: true,
            improvements: 0.15
        }),
        getCurrentMetrics: jest.fn().mockResolvedValue({
            responseTime: 150,
            throughput: 100,
            memoryUsage: 400
        })
    })),
    BenchmarkFramework: jest.fn(),
    CacheOptimizer: jest.fn(),
    PerformanceMonitor: jest.fn(),
    LazyLoadManager: jest.fn(),
    TokenOptimizer: jest.fn()
}));

jest.mock('./integration-testing', () => ({
    IntegrationTestFramework: jest.fn().mockImplementation(() => ({
        runTestSuite: jest.fn().mockResolvedValue({
            passedTests: 95,
            failedTests: 0,
            totalTests: 95
        }),
        getTestCoverage: jest.fn().mockResolvedValue({
            statements: 92,
            branches: 88,
            functions: 90,
            lines: 91
        })
    })),
    ValidationTestSuite: jest.fn(),
    StressTestSuite: jest.fn()
}));

jest.mock('./pre-commit-validation', () => ({
    QualityAssuranceFramework: jest.fn().mockImplementation(() => ({
        runPreCommitValidation: jest.fn().mockResolvedValue({
            passed: true,
            checks: {
                codeQuality: { passed: true, score: 0.92 },
                tests: { passed: true, coverage: 95 },
                performance: { passed: true },
                security: { passed: true },
                documentation: { passed: true }
            }
        }),
        getCurrentQualityStatus: jest.fn().mockReturnValue({
            overall: 'healthy',
            metrics: {
                codeQuality: 0.92,
                testCoverage: 0.95,
                documentation: 0.88
            }
        })
    }))
}));

describe('Tier3SystemManager', () => {
    let manager: Tier3SystemManager;
    let config: Partial<Tier3SystemConfig>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(console, 'warn').mockImplementation();
        jest.spyOn(console, 'debug').mockImplementation();
        
        config = {
            system: {
                enableLogging: true,
                logLevel: 'info',
                enableMetrics: true,
                enableReporting: true
            }
        };
        
        manager = new Tier3SystemManager(config);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('initialization', () => {
        it('should initialize with default configuration', () => {
            expect(manager).toBeDefined();
            const status = manager.getSystemStatus();
            expect(status.overall).toBe('offline');
            expect(status.components.phaseGeneration).toBe('offline');
            expect(status.components.performance).toBe('offline');
            expect(status.components.testing).toBe('offline');
            expect(status.components.qualityAssurance).toBe('offline');
        });

        it('should initialize all components successfully', async () => {
            await manager.initialize();
            
            const status = manager.getSystemStatus();
            expect(status.overall).toBe('healthy');
            expect(status.components.phaseGeneration).toBe('healthy');
            expect(status.components.performance).toBe('healthy');
            expect(status.components.testing).toBe('healthy');
            expect(status.components.qualityAssurance).toBe('healthy');
        });

        it('should handle partial configuration', async () => {
            const partialConfig: Partial<Tier3SystemConfig> = {
                phaseGeneration: { enabled: false },
                performance: { enabled: true },
                testing: { enabled: false },
                qualityAssurance: { enabled: true }
            };
            
            const partialManager = new Tier3SystemManager(partialConfig);
            await partialManager.initialize();
            
            const status = partialManager.getSystemStatus();
            expect(status.components.phaseGeneration).toBe('offline');
            expect(status.components.performance).toBe('healthy');
            expect(status.components.testing).toBe('offline');
            expect(status.components.qualityAssurance).toBe('healthy');
        });

        it('should handle initialization errors', async () => {
            const { PerformanceOptimizer } = require('./performance');
            PerformanceOptimizer.mockImplementationOnce(() => {
                throw new Error('Performance initialization failed');
            });
            
            await expect(manager.initialize()).rejects.toThrow('Performance initialization failed');
            
            const status = manager.getSystemStatus();
            expect(status.overall).toBe('critical');
        });
    });

    describe('system status', () => {
        beforeEach(async () => {
            await manager.initialize();
        });

        it('should provide accurate system status', () => {
            const status = manager.getSystemStatus();
            
            expect(status).toMatchObject({
                overall: 'healthy',
                components: {
                    phaseGeneration: 'healthy',
                    performance: 'healthy',
                    testing: 'healthy',
                    qualityAssurance: 'healthy'
                },
                metrics: expect.objectContaining({
                    uptime: expect.any(Number),
                    totalPhases: expect.any(Number),
                    systemLoad: expect.any(Number)
                }),
                lastUpdated: expect.any(Date)
            });
        });

        it('should update metrics on status request', () => {
            const initialStatus = manager.getSystemStatus();
            const initialUpdate = initialStatus.lastUpdated;
            
            // Wait a bit
            jest.advanceTimersByTime(1000);
            
            const updatedStatus = manager.getSystemStatus();
            expect(updatedStatus.lastUpdated.getTime()).toBeGreaterThan(initialUpdate.getTime());
        });
    });

    describe('health reporting', () => {
        beforeEach(async () => {
            await manager.initialize();
        });

        it('should generate comprehensive health report', async () => {
            const report = await manager.getHealthReport();
            
            expect(report).toMatchObject({
                status: expect.objectContaining({
                    overall: 'healthy'
                }),
                componentDetails: expect.objectContaining({
                    performance: expect.any(Object),
                    testing: expect.any(Object),
                    quality: expect.any(Object)
                }),
                recommendations: expect.any(Array)
            });
        });

        it('should provide recommendations for warning status', async () => {
            // Simulate warning status
            (manager as any).status.components.performance = 'warning';
            (manager as any).updateOverallStatus();
            
            const report = await manager.getHealthReport();
            
            expect(report.recommendations).toContain(
                'Monitor performance component - showing warning status'
            );
        });

        it('should detect high system load', async () => {
            // Simulate high load
            (manager as any).status.metrics.systemLoad = 0.9;
            
            const report = await manager.getHealthReport();
            
            expect(report.recommendations).toContain(
                'High system load detected - consider optimization'
            );
        });
    });

    describe('system validation', () => {
        beforeEach(async () => {
            await manager.initialize();
        });

        it('should run comprehensive system validation', async () => {
            const validation = await manager.runSystemValidation();
            
            expect(validation).toMatchObject({
                passed: true,
                results: expect.arrayContaining([
                    expect.objectContaining({
                        component: 'phaseGeneration',
                        passed: true
                    }),
                    expect.objectContaining({
                        component: 'performance',
                        passed: true
                    }),
                    expect.objectContaining({
                        component: 'testing',
                        passed: true
                    }),
                    expect.objectContaining({
                        component: 'qualityAssurance',
                        passed: true
                    })
                ]),
                summary: expect.stringContaining('4/4 components passed')
            });
        });

        it('should handle component validation failures', async () => {
            const { PRPPhaseGenerator } = require('./phase-generation');
            PRPPhaseGenerator.mockImplementationOnce(() => ({
                generateNewPhase: jest.fn().mockResolvedValue({
                    success: false,
                    error: 'Phase generation failed'
                })
            }));
            
            const newManager = new Tier3SystemManager(config);
            await newManager.initialize();
            
            const validation = await newManager.runSystemValidation();
            
            expect(validation.passed).toBe(false);
            expect(validation.results).toContainEqual(
                expect.objectContaining({
                    component: 'phaseGeneration',
                    passed: false
                })
            );
        });

        it('should handle validation errors gracefully', async () => {
            const { IntegrationTestFramework } = require('./integration-testing');
            IntegrationTestFramework.mockImplementationOnce(() => ({
                runTestSuite: jest.fn().mockRejectedValue(new Error('Test suite error'))
            }));
            
            const newManager = new Tier3SystemManager(config);
            await newManager.initialize();
            
            const validation = await newManager.runSystemValidation();
            
            expect(validation.passed).toBe(false);
            expect(validation.results).toContainEqual(
                expect.objectContaining({
                    component: 'testing',
                    passed: false,
                    error: 'Test suite error'
                })
            );
        });
    });

    describe('system shutdown', () => {
        beforeEach(async () => {
            await manager.initialize();
        });

        it('should shutdown gracefully', async () => {
            const initialStatus = manager.getSystemStatus();
            expect(initialStatus.overall).toBe('healthy');
            
            await manager.shutdown();
            
            const shutdownStatus = manager.getSystemStatus();
            expect(shutdownStatus.overall).toBe('offline');
            expect(shutdownStatus.components.phaseGeneration).toBe('offline');
            expect(shutdownStatus.components.performance).toBe('offline');
            expect(shutdownStatus.components.testing).toBe('offline');
            expect(shutdownStatus.components.qualityAssurance).toBe('offline');
        });
    });

    describe('logging system', () => {
        it('should respect log level configuration', () => {
            const debugManager = new Tier3SystemManager({
                system: { 
                    enableLogging: true, 
                    logLevel: 'debug',
                    enableMetrics: true,
                    enableReporting: true
                }
            });
            
            (debugManager as any).log('debug', 'Debug message');
            (debugManager as any).log('info', 'Info message');
            (debugManager as any).log('warn', 'Warn message');
            (debugManager as any).log('error', 'Error message');
            
            expect(console.debug).toHaveBeenCalled();
            expect(console.log).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });

        it('should not log when logging is disabled', () => {
            const silentManager = new Tier3SystemManager({
                system: { 
                    enableLogging: false,
                    logLevel: 'info',
                    enableMetrics: true,
                    enableReporting: true
                }
            });
            
            jest.clearAllMocks();
            
            (silentManager as any).log('info', 'Should not appear');
            
            expect(console.log).not.toHaveBeenCalled();
        });
    });

    describe('edge cases', () => {
        it('should handle empty configuration', async () => {
            const emptyManager = new Tier3SystemManager({});
            await emptyManager.initialize();
            
            const status = emptyManager.getSystemStatus();
            expect(status.overall).toBe('healthy');
        });

        it('should handle all components disabled', async () => {
            const disabledManager = new Tier3SystemManager({
                phaseGeneration: { enabled: false },
                performance: { enabled: false },
                testing: { enabled: false },
                qualityAssurance: { enabled: false }
            });
            
            await disabledManager.initialize();
            
            const status = disabledManager.getSystemStatus();
            expect(status.overall).toBe('offline');
        });

        it('should handle concurrent operations', async () => {
            await manager.initialize();
            
            // Run multiple operations concurrently
            const operations = [
                manager.getSystemStatus(),
                manager.getHealthReport(),
                manager.runSystemValidation()
            ];
            
            const results = await Promise.all(operations);
            
            expect(results[0]).toBeDefined(); // Status
            expect(results[1]).toBeDefined(); // Health report
            expect(results[2]).toBeDefined(); // Validation
        });
    });
});

describe('Helper functions', () => {
    describe('createTier3System', () => {
        it('should create and initialize system with default config', async () => {
            const system = await createTier3System();
            
            expect(system).toBeInstanceOf(Tier3SystemManager);
            
            const status = system.getSystemStatus();
            expect(status.overall).toBe('healthy');
        });

        it('should merge custom config with defaults', async () => {
            const customConfig: Partial<Tier3SystemConfig> = {
                performance: { enabled: false }
            };
            
            const system = await createTier3System(customConfig);
            
            const status = system.getSystemStatus();
            expect(status.components.performance).toBe('offline');
            expect(status.components.phaseGeneration).toBe('healthy'); // From default
        });
    });

    describe('checkTier3Health', () => {
        it('should return healthy status for healthy system', async () => {
            const system = await createTier3System();
            const health = await checkTier3Health(system);
            
            expect(health).toMatchObject({
                healthy: true,
                status: 'healthy',
                issues: []
            });
        });

        it('should return issues for unhealthy system', async () => {
            const system = await createTier3System();
            
            // Simulate unhealthy state
            (system as any).status.components.performance = 'critical';
            (system as any).updateOverallStatus();
            
            const health = await checkTier3Health(system);
            
            expect(health).toMatchObject({
                healthy: false,
                status: 'critical',
                issues: expect.arrayContaining([
                    expect.stringContaining('performance')
                ])
            });
        });
    });
});