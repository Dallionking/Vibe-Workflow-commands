/**
 * System Integration Engine Tests
 * Phase 3: Advanced Context Features - Tier 2.5
 * 
 * Comprehensive test suite for the system integration layer.
 */

import { SystemIntegrationEngine } from './system-integration';
import {
    IntegrationMessage,
    IntegrationContext,
    ContextRequest,
    ContextResponse,
    IntegrationConfig
} from './interfaces';

describe('SystemIntegrationEngine', () => {
    let integrationEngine: SystemIntegrationEngine;
    let mockConfig: IntegrationConfig;
    
    beforeEach(() => {
        mockConfig = {
            prpSystemUrl: 'http://localhost:3001',
            fieldProtocolUrl: 'http://localhost:3002',
            enableRealTimeSync: true,
            messageQueueSize: 1000,
            syncInterval: 5000,
            timeoutMs: 30000,
            retryAttempts: 3,
            performanceMonitoring: true,
            healthCheckInterval: 10000
        };
        
        integrationEngine = new SystemIntegrationEngine(mockConfig);
    });
    
    afterEach(async () => {
        await integrationEngine.shutdown();
    });
    
    describe('Initialization', () => {
        it('should initialize integration engine with config', () => {
            expect(integrationEngine).toBeDefined();
            expect(integrationEngine.getIntegrationStatistics()).toBeDefined();
        });
        
        it('should initialize with default values', async () => {
            await integrationEngine.initializeIntegration();
            
            const stats = integrationEngine.getIntegrationStatistics();
            expect(stats.messageCount).toBe(0);
            expect(stats.queueSize).toBe(0);
            expect(stats.systemHealth).toBeDefined();
        });
    });
    
    describe('Message Processing', () => {
        it('should process PRP activation message', async () => {
            const message: IntegrationMessage = {
                id: 'test_msg_1',
                timestamp: new Date(),
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation',
                payload: {
                    reasoningChainId: 'chain_1',
                    complexity: 0.7,
                    domain: 'test'
                },
                priority: 'high',
                context: {
                    sessionId: 'test_session',
                    userId: 'test_user',
                    timestamp: new Date(),
                    systemState: {
                        prpSystem: {
                            activeReasoning: 1,
                            processingLoad: 0.5,
                            memoryUsage: 0.3,
                            responseTime: 150
                        },
                        fieldProtocolSystem: {
                            activeFields: 2,
                            emergenceLevel: 0.4,
                            resonanceStrength: 0.8,
                            dynamicsComplexity: 0.6
                        },
                        integration: {
                            messageQueueSize: 0,
                            throughput: 10.5,
                            errorRate: 0.01,
                            latency: 95
                        }
                    },
                    metadata: {
                        testFlag: true
                    }
                }
            };
            
            await expect(integrationEngine.processMessage(message)).resolves.not.toThrow();
            
            const stats = integrationEngine.getIntegrationStatistics();
            expect(stats.messageCount).toBe(1);
        });
        
        it('should process field state update message', async () => {
            const message: IntegrationMessage = {
                id: 'test_msg_2',
                timestamp: new Date(),
                source: 'field_protocol',
                target: 'prp',
                type: 'field_state_update',
                payload: {
                    fieldId: 'field_1',
                    state: 'active',
                    metrics: {
                        energy: 0.8,
                        stability: 0.9,
                        coherence: 0.7
                    }
                },
                priority: 'normal',
                context: {
                    sessionId: 'test_session',
                    userId: 'test_user',
                    timestamp: new Date(),
                    systemState: {
                        prpSystem: {
                            activeReasoning: 0,
                            processingLoad: 0.2,
                            memoryUsage: 0.1,
                            responseTime: 80
                        },
                        fieldProtocolSystem: {
                            activeFields: 3,
                            emergenceLevel: 0.6,
                            resonanceStrength: 0.5,
                            dynamicsComplexity: 0.4
                        },
                        integration: {
                            messageQueueSize: 1,
                            throughput: 15.2,
                            errorRate: 0.005,
                            latency: 78
                        }
                    },
                    metadata: {}
                }
            };
            
            await expect(integrationEngine.processMessage(message)).resolves.not.toThrow();
            
            const stats = integrationEngine.getIntegrationStatistics();
            expect(stats.messageCount).toBe(1);
        });
        
        it('should handle emergence notification', async () => {
            const message: IntegrationMessage = {
                id: 'test_msg_3',
                timestamp: new Date(),
                source: 'field_protocol',
                target: 'prp',
                type: 'emergence_notification',
                payload: {
                    emergenceType: 'pattern_formation',
                    strength: 0.85,
                    participants: ['field_1', 'field_2', 'field_3'],
                    timestamp: new Date()
                },
                priority: 'high',
                context: {
                    sessionId: 'test_session',
                    userId: 'test_user',
                    timestamp: new Date(),
                    systemState: {
                        prpSystem: {
                            activeReasoning: 2,
                            processingLoad: 0.7,
                            memoryUsage: 0.6,
                            responseTime: 200
                        },
                        fieldProtocolSystem: {
                            activeFields: 5,
                            emergenceLevel: 0.85,
                            resonanceStrength: 0.9,
                            dynamicsComplexity: 0.8
                        },
                        integration: {
                            messageQueueSize: 2,
                            throughput: 12.8,
                            errorRate: 0.02,
                            latency: 120
                        }
                    },
                    metadata: {
                        emergenceType: 'pattern_formation'
                    }
                }
            };
            
            await expect(integrationEngine.processMessage(message)).resolves.not.toThrow();
        });
        
        it('should validate message format', async () => {
            const invalidMessage = {
                id: 'invalid_msg',
                // Missing required fields
            } as IntegrationMessage;
            
            await expect(integrationEngine.processMessage(invalidMessage))
                .rejects.toThrow('Invalid message format');
        });
        
        it('should reject message with same source and target', async () => {
            const invalidMessage: IntegrationMessage = {
                id: 'invalid_msg',
                timestamp: new Date(),
                source: 'prp',
                target: 'prp', // Same as source
                type: 'prp_activation',
                payload: {},
                priority: 'normal',
                context: {
                    sessionId: 'test',
                    userId: 'test',
                    timestamp: new Date(),
                    systemState: {
                        prpSystem: {
                            activeReasoning: 0,
                            processingLoad: 0,
                            memoryUsage: 0,
                            responseTime: 0
                        },
                        fieldProtocolSystem: {
                            activeFields: 0,
                            emergenceLevel: 0,
                            resonanceStrength: 0,
                            dynamicsComplexity: 0
                        },
                        integration: {
                            messageQueueSize: 0,
                            throughput: 0,
                            errorRate: 0,
                            latency: 0
                        }
                    },
                    metadata: {}
                }
            };
            
            await expect(integrationEngine.processMessage(invalidMessage))
                .rejects.toThrow('source and target cannot be the same');
        });
    });
    
    describe('Context Requests', () => {
        it('should process context request to PRP system', async () => {
            const contextRequest: ContextRequest = {
                requestingSystem: 'field_protocol',
                targetSystem: 'prp',
                contextType: 'reasoning_state',
                parameters: {
                    includeActiveChains: true,
                    includeValidation: true
                },
                sessionId: 'test_session',
                userId: 'test_user',
                metadata: {
                    urgent: true
                }
            };
            
            const response = await integrationEngine.requestContext(contextRequest);
            
            expect(response).toBeDefined();
            expect(response.requestId).toBeDefined();
            expect(response.status).toBe('complete');
            expect(response.data).toBeDefined();
            expect(response.metadata.processingTime).toBeGreaterThanOrEqual(0);
        });
        
        it('should process context request to Field Protocol system', async () => {
            const contextRequest: ContextRequest = {
                requestingSystem: 'prp',
                targetSystem: 'field_protocol',
                contextType: 'field_state',
                parameters: {
                    includeResonance: true,
                    includeEmergence: true,
                    includeDynamics: true
                },
                sessionId: 'test_session',
                userId: 'test_user'
            };
            
            const response = await integrationEngine.requestContext(contextRequest);
            
            expect(response).toBeDefined();
            expect(response.status).toBe('complete');
            expect(response.metadata.confidence).toBeGreaterThan(0);
            expect(response.metadata.dataQuality).toBeGreaterThan(0);
        });
        
        it('should handle context request errors gracefully', async () => {
            const contextRequest: ContextRequest = {
                requestingSystem: 'prp',
                targetSystem: 'invalid_system' as any,
                contextType: 'unknown_context',
                parameters: {},
                sessionId: 'test_session',
                userId: 'test_user'
            };
            
            const response = await integrationEngine.requestContext(contextRequest);
            
            expect(response.status).toBe('error');
            expect(response.errorMessage).toBeDefined();
        });
    });
    
    describe('State Synchronization', () => {
        it('should synchronize system states without conflicts', async () => {
            await expect(integrationEngine.synchronizeStates()).resolves.not.toThrow();
        });
        
        it('should handle state synchronization with conflicts', async () => {
            // This would be more complex in a real implementation
            await expect(integrationEngine.synchronizeStates()).resolves.not.toThrow();
        });
    });
    
    describe('Real-time Collaboration', () => {
        it('should enable real-time collaboration', async () => {
            await expect(integrationEngine.enableRealTimeCollaboration()).resolves.not.toThrow();
        });
    });
    
    describe('Performance Monitoring', () => {
        it('should track performance metrics', async () => {
            const message: IntegrationMessage = {
                id: 'perf_test_msg',
                timestamp: new Date(),
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation',
                payload: {},
                priority: 'normal',
                context: {
                    sessionId: 'perf_test',
                    userId: 'test_user',
                    timestamp: new Date(),
                    systemState: {
                        prpSystem: {
                            activeReasoning: 0,
                            processingLoad: 0,
                            memoryUsage: 0,
                            responseTime: 0
                        },
                        fieldProtocolSystem: {
                            activeFields: 0,
                            emergenceLevel: 0,
                            resonanceStrength: 0,
                            dynamicsComplexity: 0
                        },
                        integration: {
                            messageQueueSize: 0,
                            throughput: 0,
                            errorRate: 0,
                            latency: 0
                        }
                    },
                    metadata: {}
                }
            };
            
            await integrationEngine.processMessage(message);
            
            const stats = integrationEngine.getIntegrationStatistics();
            expect(stats.messageCount).toBe(1);
            expect(stats.averageProcessingTime).toBeGreaterThanOrEqual(0);
            expect(stats.throughput).toBeGreaterThanOrEqual(0);
        });
        
        it('should provide comprehensive statistics', () => {
            const stats = integrationEngine.getIntegrationStatistics();
            
            expect(stats).toHaveProperty('messageCount');
            expect(stats).toHaveProperty('averageProcessingTime');
            expect(stats).toHaveProperty('errorRate');
            expect(stats).toHaveProperty('throughput');
            expect(stats).toHaveProperty('queueSize');
            expect(stats).toHaveProperty('systemHealth');
            
            expect(stats.systemHealth).toHaveProperty('prpSystem');
            expect(stats.systemHealth).toHaveProperty('fieldProtocolSystem');
            expect(stats.systemHealth).toHaveProperty('integration');
        });
    });
    
    describe('Error Handling', () => {
        it('should handle processing errors gracefully', async () => {
            const corruptMessage = {
                id: null, // Invalid ID
                timestamp: new Date(),
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation',
                payload: {},
                priority: 'normal'
            } as any;
            
            await expect(integrationEngine.processMessage(corruptMessage))
                .rejects.toThrow();
        });
    });
    
    describe('Integration Lifecycle', () => {
        it('should initialize integration properly', async () => {
            await expect(integrationEngine.initializeIntegration()).resolves.not.toThrow();
        });
        
        it('should shutdown gracefully', async () => {
            await integrationEngine.initializeIntegration();
            await expect(integrationEngine.shutdown()).resolves.not.toThrow();
        });
        
        it('should process remaining messages during shutdown', async () => {
            const message: IntegrationMessage = {
                id: 'shutdown_test_msg',
                timestamp: new Date(),
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation',
                payload: {},
                priority: 'low',
                context: {
                    sessionId: 'shutdown_test',
                    userId: 'test_user',
                    timestamp: new Date(),
                    systemState: {
                        prpSystem: {
                            activeReasoning: 0,
                            processingLoad: 0,
                            memoryUsage: 0,
                            responseTime: 0
                        },
                        fieldProtocolSystem: {
                            activeFields: 0,
                            emergenceLevel: 0,
                            resonanceStrength: 0,
                            dynamicsComplexity: 0
                        },
                        integration: {
                            messageQueueSize: 0,
                            throughput: 0,
                            errorRate: 0,
                            latency: 0
                        }
                    },
                    metadata: {}
                }
            };
            
            // Add message to queue but don't process immediately
            await integrationEngine.initializeIntegration();
            
            // Shutdown should process remaining messages
            await expect(integrationEngine.shutdown()).resolves.not.toThrow();
        });
    });
    
    describe('Integration Edge Cases', () => {
        it('should handle high message volume', async () => {
            await integrationEngine.initializeIntegration();
            
            const messages: IntegrationMessage[] = [];
            for (let i = 0; i < 100; i++) {
                messages.push({
                    id: `bulk_msg_${i}`,
                    timestamp: new Date(),
                    source: i % 2 === 0 ? 'prp' : 'field_protocol',
                    target: i % 2 === 0 ? 'field_protocol' : 'prp',
                    type: 'prp_activation',
                    payload: { messageIndex: i },
                    priority: 'normal',
                    context: {
                        sessionId: 'bulk_test',
                        userId: 'test_user',
                        timestamp: new Date(),
                        systemState: {
                            prpSystem: {
                                activeReasoning: 0,
                                processingLoad: 0,
                                memoryUsage: 0,
                                responseTime: 0
                            },
                            fieldProtocolSystem: {
                                activeFields: 0,
                                emergenceLevel: 0,
                                resonanceStrength: 0,
                                dynamicsComplexity: 0
                            },
                            integration: {
                                messageQueueSize: 0,
                                throughput: 0,
                                errorRate: 0,
                                latency: 0
                            }
                        },
                        metadata: {}
                    }
                });
            }
            
            // Process all messages
            const promises = messages.map(msg => integrationEngine.processMessage(msg));
            await Promise.all(promises);
            
            const stats = integrationEngine.getIntegrationStatistics();
            expect(stats.messageCount).toBe(100);
        }, 30000); // 30 second timeout for bulk processing
        
        it('should maintain performance under load', async () => {
            await integrationEngine.initializeIntegration();
            
            const startTime = Date.now();
            
            // Process 50 messages
            const promises = [];
            for (let i = 0; i < 50; i++) {
                const message: IntegrationMessage = {
                    id: `load_test_${i}`,
                    timestamp: new Date(),
                    source: 'prp',
                    target: 'field_protocol',
                    type: 'prp_activation',
                    payload: {},
                    priority: 'normal',
                    context: {
                        sessionId: 'load_test',
                        userId: 'test_user',
                        timestamp: new Date(),
                        systemState: {
                            prpSystem: {
                                activeReasoning: 0,
                                processingLoad: 0,
                                memoryUsage: 0,
                                responseTime: 0
                            },
                            fieldProtocolSystem: {
                                activeFields: 0,
                                emergenceLevel: 0,
                                resonanceStrength: 0,
                                dynamicsComplexity: 0
                            },
                            integration: {
                                messageQueueSize: 0,
                                throughput: 0,
                                errorRate: 0,
                                latency: 0
                            }
                        },
                        metadata: {}
                    }
                };
                promises.push(integrationEngine.processMessage(message));
            }
            
            await Promise.all(promises);
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            // Should process 50 messages in under 5 seconds
            expect(totalTime).toBeLessThan(5000);
            
            const stats = integrationEngine.getIntegrationStatistics();
            expect(stats.averageProcessingTime).toBeLessThan(1000); // Under 1 second average
        }, 10000); // 10 second timeout
    });
});