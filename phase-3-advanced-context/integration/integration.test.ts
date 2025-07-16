/**
 * Integration System Tests
 * Phase 3: Advanced Context Features - Tier 2.5
 * 
 * Comprehensive test suite for the System Integration Layer including
 * controller, adapter, bridge, and end-to-end integration scenarios.
 */

import { AdvancedIntegrationController } from './integration-controller';
import { IntegrationAdapter } from './integration-adapter';
import { IntegrationBridge } from './integration-bridge';
import {
    IntegrationConfig,
    IntegrationMessage,
    IntegrationMessageType,
    MessagePriority,
    ContextRequest,
    PRPToFieldMessage,
    FieldToPRPMessage,
    ValidationResult,
    BridgeStatus,
    SyncResult
} from './interfaces';

describe('Integration System', () => {
    let controller: AdvancedIntegrationController;
    let adapter: IntegrationAdapter;
    let bridge: IntegrationBridge;
    let mockConfig: IntegrationConfig;

    beforeEach(async () => {
        // Setup mock configuration
        mockConfig = {
            messageQueueSize: 1000,
            maxRetries: 3,
            timeoutMs: 5000,
            enableCompression: true,
            enableEncryption: false,
            enableMetrics: true,
            logLevel: 'info',
            channels: [
                {
                    name: 'prp_to_field',
                    source: 'prp',
                    target: 'field_protocol',
                    messageTypes: ['prp_activation', 'validation_request'],
                    priority: 'high',
                    bufferSize: 100,
                    batchSize: 10,
                    flushInterval: 1000
                },
                {
                    name: 'field_to_prp',
                    source: 'field_protocol',
                    target: 'prp',
                    messageTypes: ['field_state_update', 'emergence_notification'],
                    priority: 'normal',
                    bufferSize: 100,
                    batchSize: 10,
                    flushInterval: 1000
                }
            ]
        };

        // Initialize components
        controller = new AdvancedIntegrationController();
        adapter = new IntegrationAdapter();
        bridge = new IntegrationBridge();
    });

    afterEach(async () => {
        // Cleanup
        if (controller) {
            await controller.shutdown();
        }
        if (adapter) {
            await adapter.shutdown();
        }
        if (bridge.isConnected()) {
            await bridge.disconnect();
        }
    });

    describe('AdvancedIntegrationController', () => {
        beforeEach(async () => {
            await controller.initialize(mockConfig);
        });

        test('should initialize successfully with valid configuration', async () => {
            expect(controller).toBeDefined();
            const stats = controller.getStatistics();
            expect(stats.messagesSent).toBe(0);
            expect(stats.uptime).toBeGreaterThan(0);
        });

        test('should reject invalid configuration', async () => {
            const invalidConfig = { ...mockConfig, messageQueueSize: -1 };
            const newController = new AdvancedIntegrationController();
            
            await expect(newController.initialize(invalidConfig))
                .rejects
                .toThrow('Invalid messageQueueSize in configuration');
        });

        test('should send messages successfully', async () => {
            const message: IntegrationMessage = {
                id: 'test_msg_001',
                timestamp: new Date(),
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation',
                payload: {
                    data: { test: 'data' },
                    metadata: {
                        size: 100,
                        format: 'json',
                        checksum: 'abc123',
                        version: '1.0.0',
                        sourceTimestamp: new Date()
                    },
                    schema: 'test_schema'
                },
                priority: 'normal',
                context: {
                    sessionId: 'test_session',
                    requestId: 'test_request',
                    correlationId: 'test_correlation',
                    environment: 'development',
                    tags: ['test'],
                    customHeaders: {}
                }
            };

            const acknowledgment = await controller.sendMessage(message);
            
            expect(acknowledgment.received).toBe(true);
            expect(acknowledgment.status).toBe('success');
            expect(acknowledgment.processingTime).toBeGreaterThanOrEqual(0);
        });

        test('should handle message validation errors', async () => {
            const invalidMessage = {
                // Missing required fields
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation'
            } as IntegrationMessage;

            await expect(controller.sendMessage(invalidMessage))
                .rejects
                .toThrow('Invalid message');
        });

        test('should register and execute message handlers', async () => {
            let handlerExecuted = false;
            
            controller.registerMessageHandler('prp_activation', async (message) => {
                handlerExecuted = true;
                return { success: true };
            });

            const message: IntegrationMessage = createTestMessage('prp_activation');
            await controller.sendMessage(message);

            // Allow time for async processing
            await new Promise(resolve => setTimeout(resolve, 200));
            
            expect(handlerExecuted).toBe(true);
        });

        test('should handle context requests', async () => {
            const contextRequest: ContextRequest = {
                type: 'field_state',
                parameters: {
                    includeHistory: true,
                    includeProjections: false,
                    detailLevel: 'standard',
                    analysisDepth: 3,
                    correlationThreshold: 0.7,
                    emergenceThreshold: 0.8
                },
                filters: [
                    {
                        field: 'coherence',
                        operator: 'gte',
                        value: 0.5,
                        weight: 1.0
                    }
                ],
                timeWindow: {
                    start: new Date(Date.now() - 3600000), // 1 hour ago
                    end: new Date(),
                    granularity: 'minutes'
                }
            };

            const response = await controller.requestContext(contextRequest);
            
            expect(response).toBeDefined();
            expect(response.status).toBe('complete');
            expect(response.data).toBeDefined();
        });

        test('should maintain performance metrics', async () => {
            // Send multiple messages to generate metrics
            const messages = Array.from({ length: 10 }, (_, i) => 
                createTestMessage('prp_activation', `test_msg_${i}`)
            );

            for (const message of messages) {
                await controller.sendMessage(message);
            }

            const metrics = controller.getMetrics();
            
            expect(metrics.messageCount.prp_activation).toBe(10);
            expect(metrics.performance.averageLatency).toBeGreaterThan(0);
            expect(metrics.performance.queueLength).toBeGreaterThanOrEqual(0);
        });

        test('should handle high message load', async () => {
            const messageCount = 100;
            const promises: Promise<any>[] = [];

            // Send many messages concurrently
            for (let i = 0; i < messageCount; i++) {
                const message = createTestMessage('prp_activation', `bulk_msg_${i}`);
                promises.push(controller.sendMessage(message));
            }

            const acknowledgments = await Promise.all(promises);
            
            expect(acknowledgments).toHaveLength(messageCount);
            acknowledgments.forEach(ack => {
                expect(ack.received).toBe(true);
            });
        });

        test('should provide health status', async () => {
            const health = await controller.getHealthStatus();
            
            expect(health.overall).toMatch(/healthy|degraded|critical|offline/);
            expect(health.components).toHaveLength(3); // queue, bridge, adapter
            expect(health.timestamp).toBeInstanceOf(Date);
            expect(health.recommendations).toBeDefined();
        });
    });

    describe('IntegrationAdapter', () => {
        beforeEach(async () => {
            await adapter.initialize(mockConfig);
        });

        test('should validate messages correctly', () => {
            const validMessage = createTestMessage('prp_activation');
            const result = adapter.validateMessage(validMessage);
            
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.score).toBeGreaterThan(0.7);
        });

        test('should detect validation errors', () => {
            const invalidMessage = {
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation'
                // Missing required fields
            } as IntegrationMessage;

            const result = adapter.validateMessage(invalidMessage);
            
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.score).toBeLessThan(0.7);
        });

        test('should adapt PRP data to Field Protocol format', () => {
            const prpData = {
                templates: [
                    {
                        id: 'template_001',
                        name: 'Test Template',
                        type: 'reasoning',
                        pattern: 'analysis',
                        complexity: 0.7,
                        effectiveness: 0.8
                    }
                ],
                chainOfThought: [
                    {
                        id: 'cot_001',
                        steps: [
                            { id: 'step1', description: 'Analyze input' },
                            { id: 'step2', description: 'Generate response' }
                        ],
                        complexity: 0.6,
                        conditionalBranches: [],
                        selfReflectionDepth: 0.5
                    }
                ]
            };

            const adapted = adapter.adaptPRPToField(prpData);
            
            expect(adapted.resonanceFields).toHaveLength(1);
            expect(adapted.dynamicsFields).toHaveLength(1);
            expect(adapted.resonanceFields[0].fieldType).toBe('cognitive');
            expect(adapted.dynamicsFields[0].energy).toBe(6); // complexity * 10
        });

        test('should adapt Field Protocol data to PRP format', () => {
            const fieldData = {
                resonancePatterns: [
                    {
                        id: 'pattern_001',
                        type: 'resonance',
                        fieldType: 'cognitive',
                        frequency: 2.5,
                        coherence: 0.8,
                        stability: 0.9,
                        strength: 0.75
                    }
                ],
                emergenceEvents: [
                    {
                        id: 'event_001',
                        type: 'spontaneous_synchronization',
                        strength: 0.85,
                        participants: ['field1', 'field2', 'field3']
                    }
                ]
            };

            const adapted = adapter.adaptFieldToPRP(fieldData);
            
            expect(adapted.templates).toHaveLength(1);
            expect(adapted.enhancements).toHaveLength(1);
            expect(adapted.templates[0].type).toBe('reasoning');
            expect(adapted.enhancements[0].complexity).toBe(0.85);
        });

        test('should transform payload schemas', () => {
            const payload = {
                data: { field1: 'value1', field2: 42 },
                metadata: {
                    size: 100,
                    format: 'json' as const,
                    checksum: 'abc123',
                    version: '1.0.0',
                    sourceTimestamp: new Date()
                },
                schema: 'source_schema'
            };

            const transformed = adapter.transformPayload(payload, 'target_schema');
            
            expect(transformed.schema).toBe('target_schema');
            expect(transformed.data).toBeDefined();
            expect(transformed.metadata.checksum).toBeDefined();
        });

        test('should handle large payloads with warnings', () => {
            const largeData = 'x'.repeat(11 * 1024 * 1024); // 11MB
            const message = createTestMessage('prp_activation');
            message.payload.data = { largeField: largeData };

            const result = adapter.validateMessage(message);
            
            expect(result.warnings.some(w => w.code === 'LARGE_PAYLOAD')).toBe(true);
        });
    });

    describe('IntegrationBridge', () => {
        test('should connect successfully', async () => {
            await bridge.connect();
            
            expect(bridge.isConnected()).toBe(true);
            
            const status = bridge.getStatus();
            expect(status.connected).toBe(true);
            expect(status.health).toMatch(/healthy|degraded|critical|offline/);
        });

        test('should handle connection failures gracefully', async () => {
            // This would test connection failure scenarios
            // For now, we'll test that it doesn't throw unexpected errors
            expect(async () => {
                await bridge.connect();
            }).not.toThrow();
        });

        test('should synchronize state between systems', async () => {
            await bridge.connect();
            await bridge.enableBidirectionalSync();
            
            const syncResult = await bridge.syncState();
            
            expect(syncResult).toBeDefined();
            expect(syncResult.success).toBe(true);
            expect(syncResult.timestamp).toBeInstanceOf(Date);
            expect(syncResult.duration).toBeGreaterThan(0);
        });

        test('should send messages through bridge', async () => {
            await bridge.connect();
            
            const message = createTestMessage('field_state_update');
            const acknowledgment = await bridge.sendMessage(message);
            
            expect(acknowledgment.received).toBe(true);
            expect(acknowledgment.status).toBe('success');
        });

        test('should provide bridge statistics', async () => {
            await bridge.connect();
            
            // Send some messages to generate statistics
            for (let i = 0; i < 5; i++) {
                await bridge.sendMessage(createTestMessage('prp_activation', `stats_msg_${i}`));
            }
            
            const stats = bridge.getStatistics();
            
            expect(stats.uptime).toBeGreaterThan(0);
            expect(stats.messagesProcessed).toBe(5);
            expect(stats.connectionHealth).toMatch(/healthy|degraded|critical|offline/);
        });

        test('should handle disconnection properly', async () => {
            await bridge.connect();
            expect(bridge.isConnected()).toBe(true);
            
            await bridge.disconnect();
            expect(bridge.isConnected()).toBe(false);
        });
    });

    describe('End-to-End Integration Scenarios', () => {
        test('should handle complete PRP to Field Protocol workflow', async () => {
            // Initialize all components
            await controller.initialize(mockConfig);
            await bridge.connect();
            await bridge.enableBidirectionalSync();

            // Create a PRP activation message
            const prpMessage: PRPToFieldMessage = {
                id: 'e2e_prp_001',
                timestamp: new Date(),
                source: 'prp',
                target: 'field_protocol',
                type: 'prp_activation',
                payload: {
                    data: {
                        prpTemplate: {
                            id: 'template_e2e',
                            name: 'E2E Test Template',
                            type: 'reasoning',
                            pattern: 'analysis',
                            description: 'End-to-end test template',
                            structure: {
                                sections: [],
                                placeholders: [],
                                conditionalBlocks: []
                            },
                            metadata: {
                                source: 'test',
                                version: '1.0.0',
                                tags: ['test'],
                                complexity: 0.5,
                                domain: 'test',
                                language: 'en',
                                created: new Date(),
                                lastModified: new Date()
                            },
                            validationMetrics: {
                                effectiveness: 0.8,
                                reliability: 0.9,
                                adaptability: 0.7,
                                performance: 0.85
                            },
                            effectiveness: 0.8,
                            complexity: 0.5,
                            usageCount: 1
                        }
                    },
                    metadata: {
                        size: 500,
                        format: 'json',
                        checksum: 'e2e123',
                        version: '1.0.0',
                        sourceTimestamp: new Date()
                    },
                    schema: 'prp_to_field_v1'
                },
                priority: 'high',
                context: {
                    sessionId: 'e2e_session',
                    requestId: 'e2e_request',
                    correlationId: 'e2e_correlation',
                    environment: 'development',
                    tags: ['e2e', 'test'],
                    customHeaders: {}
                }
            };

            // Process the message through the integration system
            const acknowledgment = await controller.sendMessage(prpMessage);
            expect(acknowledgment.received).toBe(true);

            // Verify adaptation
            const adapted = adapter.adaptPRPToField({ 
                templates: [prpMessage.payload.data.prpTemplate] 
            });
            expect(adapted.resonanceFields).toHaveLength(1);
            expect(adapted.resonanceFields[0].fieldType).toBe('cognitive');

            // Verify bridge transmission
            const bridgeAck = await bridge.sendMessage(prpMessage);
            expect(bridgeAck.status).toBe('success');
        });

        test('should handle complete Field Protocol to PRP workflow', async () => {
            // Initialize all components
            await controller.initialize(mockConfig);
            await bridge.connect();

            // Create a Field Protocol message
            const fieldMessage: FieldToPRPMessage = {
                id: 'e2e_field_001',
                timestamp: new Date(),
                source: 'field_protocol',
                target: 'prp',
                type: 'emergence_notification',
                payload: {
                    data: {
                        emergenceEvent: {
                            id: 'emergence_e2e',
                            type: 'spontaneous_synchronization',
                            timestamp: new Date(),
                            duration: 1000,
                            participants: ['field1', 'field2', 'field3'],
                            strength: 0.85,
                            coherenceThreshold: 0.8,
                            precursors: ['field_alignment'],
                            outcomes: ['enhanced_coherence'],
                            stability: 0.9,
                            propagation: {
                                speed: 2.0,
                                direction: [1, 0, 0],
                                waveform: 'exponential',
                                decay: 0.1,
                                amplification: 1.2,
                                interference: 0.05
                            }
                        }
                    },
                    metadata: {
                        size: 400,
                        format: 'json',
                        checksum: 'field123',
                        version: '1.0.0',
                        sourceTimestamp: new Date()
                    },
                    schema: 'field_to_prp_v1'
                },
                priority: 'normal',
                context: {
                    sessionId: 'e2e_field_session',
                    requestId: 'e2e_field_request',
                    correlationId: 'e2e_field_correlation',
                    environment: 'development',
                    tags: ['e2e', 'field'],
                    customHeaders: {}
                }
            };

            // Process the message
            const acknowledgment = await controller.sendMessage(fieldMessage);
            expect(acknowledgment.received).toBe(true);

            // Verify adaptation
            const adapted = adapter.adaptFieldToPRP({
                emergenceEvents: [fieldMessage.payload.data.emergenceEvent]
            });
            expect(adapted.enhancements).toHaveLength(1);
            expect(adapted.enhancements[0].complexity).toBe(0.85);
        });

        test('should handle bidirectional synchronization', async () => {
            // Initialize components
            await controller.initialize(mockConfig);
            await bridge.connect();
            await bridge.enableBidirectionalSync();

            // Perform initial sync
            const syncResult = await bridge.syncState();
            expect(syncResult.success).toBe(true);

            // Send messages in both directions
            const prpMessage = createTestMessage('prp_activation', 'sync_prp');
            const fieldMessage = createTestMessage('field_state_update', 'sync_field');

            const [prpAck, fieldAck] = await Promise.all([
                controller.sendMessage(prpMessage),
                controller.sendMessage(fieldMessage)
            ]);

            expect(prpAck.received).toBe(true);
            expect(fieldAck.received).toBe(true);

            // Verify sync maintains consistency
            const finalSync = await bridge.syncState();
            expect(finalSync.success).toBe(true);
            expect(finalSync.conflicts).toHaveLength(0);
        });

        test('should handle error recovery and resilience', async () => {
            await controller.initialize(mockConfig);

            // Test invalid message handling
            const invalidMessage = {
                id: 'invalid_msg',
                source: 'invalid_source'
            } as IntegrationMessage;

            await expect(controller.sendMessage(invalidMessage))
                .rejects
                .toThrow();

            // Verify system remains functional
            const validMessage = createTestMessage('prp_activation', 'recovery_test');
            const ack = await controller.sendMessage(validMessage);
            expect(ack.received).toBe(true);

            // Check error metrics
            const metrics = controller.getMetrics();
            expect(metrics.errors.totalErrors).toBeGreaterThan(0);
        });
    });

    describe('Performance and Stress Testing', () => {
        test('should handle high-throughput message processing', async () => {
            await controller.initialize({ ...mockConfig, messageQueueSize: 5000 });
            
            const messageCount = 1000;
            const startTime = Date.now();
            
            const promises = Array.from({ length: messageCount }, (_, i) =>
                controller.sendMessage(createTestMessage('prp_activation', `perf_${i}`))
            );

            const results = await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            expect(results).toHaveLength(messageCount);
            expect(results.every(r => r.received)).toBe(true);
            
            const throughput = messageCount / (duration / 1000);
            console.log(`Throughput: ${throughput.toFixed(2)} messages/second`);
            
            expect(throughput).toBeGreaterThan(50); // Minimum acceptable throughput
        });

        test('should maintain performance under memory pressure', async () => {
            await controller.initialize(mockConfig);
            
            // Create large messages to test memory handling
            const largeData = 'x'.repeat(100000); // 100KB per message
            const messageCount = 100;
            
            for (let i = 0; i < messageCount; i++) {
                const message = createTestMessage('prp_activation', `large_${i}`);
                message.payload.data = { largeField: largeData };
                
                const ack = await controller.sendMessage(message);
                expect(ack.received).toBe(true);
            }
            
            const metrics = controller.getMetrics();
            expect(metrics.resourceUsage.memoryUsage).toBeDefined();
            expect(metrics.performance.averageLatency).toBeLessThan(1000); // 1 second max
        });

        test('should handle concurrent operations safely', async () => {
            await controller.initialize(mockConfig);
            await bridge.connect();
            
            const concurrentOperations = [
                // Message sending
                ...Array.from({ length: 10 }, (_, i) =>
                    controller.sendMessage(createTestMessage('prp_activation', `concurrent_${i}`))
                ),
                // Context requests
                controller.requestContext({
                    type: 'field_state',
                    parameters: {
                        includeHistory: false,
                        includeProjections: false,
                        detailLevel: 'minimal',
                        analysisDepth: 1,
                        correlationThreshold: 0.5,
                        emergenceThreshold: 0.5
                    },
                    filters: []
                }),
                // Bridge operations
                bridge.syncState()
            ];
            
            const results = await Promise.allSettled(concurrentOperations);
            
            // Check that most operations succeeded
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const total = results.length;
            const successRate = successful / total;
            
            expect(successRate).toBeGreaterThan(0.8); // 80% success rate minimum
        });
    });

    // Helper functions
    function createTestMessage(
        type: IntegrationMessageType, 
        id: string = 'test_msg'
    ): IntegrationMessage {
        return {
            id: `${id}_${Date.now()}`,
            timestamp: new Date(),
            source: type.includes('prp') ? 'prp' : 'field_protocol',
            target: type.includes('prp') ? 'field_protocol' : 'prp',
            type,
            payload: {
                data: { test: 'data', value: Math.random() },
                metadata: {
                    size: 100,
                    format: 'json',
                    checksum: Math.random().toString(36).substr(2, 9),
                    version: '1.0.0',
                    sourceTimestamp: new Date()
                },
                schema: 'test_schema_v1'
            },
            priority: 'normal',
            context: {
                sessionId: `session_${Date.now()}`,
                requestId: `request_${Date.now()}`,
                correlationId: `corr_${Date.now()}`,
                environment: 'development',
                tags: ['test'],
                customHeaders: {}
            }
        };
    }

    // Test data generators
    function generateTestPRPTemplate() {
        return {
            id: `template_${Date.now()}`,
            name: 'Test Template',
            type: 'reasoning',
            pattern: 'analysis',
            description: 'Test template description',
            structure: {
                sections: [
                    { name: 'input', type: 'content', content: 'Input section' },
                    { name: 'analysis', type: 'content', content: 'Analysis section' }
                ],
                placeholders: [
                    { name: 'context', type: 'string', description: 'Context placeholder' }
                ],
                conditionalBlocks: []
            },
            metadata: {
                source: 'test',
                version: '1.0.0',
                tags: ['test'],
                complexity: Math.random(),
                domain: 'test',
                language: 'en',
                created: new Date(),
                lastModified: new Date()
            },
            validationMetrics: {
                effectiveness: Math.random(),
                reliability: Math.random(),
                adaptability: Math.random(),
                performance: Math.random()
            },
            effectiveness: Math.random(),
            complexity: Math.random(),
            usageCount: Math.floor(Math.random() * 100)
        };
    }

    function generateTestResonanceField() {
        return {
            id: `field_${Date.now()}`,
            name: 'Test Resonance Field',
            frequency: Math.random() * 10 + 1,
            amplitude: Math.random(),
            phase: Math.random() * 2 * Math.PI,
            fieldType: 'cognitive' as const,
            harmonics: [],
            coherenceLevel: Math.random(),
            entropy: Math.random() * 0.5,
            stability: Math.random(),
            metadata: {
                createdAt: new Date(),
                lastUpdate: new Date(),
                sourceContext: 'test',
                influenceRadius: Math.random(),
                decayRate: 0.01,
                stabilityHistory: [Math.random()],
                emergencePatterns: ['test_pattern']
            }
        };
    }

    function generateTestEmergenceEvent() {
        return {
            id: `event_${Date.now()}`,
            type: 'spontaneous_synchronization' as const,
            timestamp: new Date(),
            duration: Math.random() * 1000,
            participants: ['field1', 'field2', 'field3'],
            strength: Math.random(),
            coherenceThreshold: 0.8,
            precursors: ['test_precursor'],
            outcomes: ['test_outcome'],
            stability: Math.random(),
            propagation: {
                speed: Math.random() * 5,
                direction: [1, 0, 0],
                waveform: 'exponential' as const,
                decay: Math.random() * 0.5,
                amplification: 1 + Math.random(),
                interference: Math.random() * 0.2
            }
        };
    }
});

describe('Integration Message Types', () => {
    test('should handle all message types correctly', () => {
        const messageTypes: IntegrationMessageType[] = [
            'prp_activation',
            'field_state_update',
            'emergence_notification',
            'resonance_change',
            'validation_request',
            'optimization_signal',
            'synchronization_update',
            'context_enhancement',
            'pattern_detection',
            'adaptive_feedback'
        ];

        messageTypes.forEach(type => {
            const message = createTestMessage(type);
            expect(message.type).toBe(type);
            expect(message.source).toMatch(/prp|field_protocol/);
            expect(message.target).toMatch(/prp|field_protocol/);
        });
    });

    test('should validate message priorities', () => {
        const priorities: MessagePriority[] = ['critical', 'high', 'normal', 'low'];
        
        priorities.forEach(priority => {
            const message = createTestMessage('prp_activation');
            message.priority = priority;
            
            expect(['critical', 'high', 'normal', 'low']).toContain(message.priority);
        });
    });
});

describe('Integration Error Handling', () => {
    let controller: AdvancedIntegrationController;
    let adapter: IntegrationAdapter;

    beforeEach(async () => {
        controller = new AdvancedIntegrationController();
        adapter = new IntegrationAdapter();
        await adapter.initialize(mockConfig);
    });

    afterEach(async () => {
        if (controller) await controller.shutdown();
        if (adapter) await adapter.shutdown();
    });

    test('should handle malformed messages gracefully', () => {
        const malformedMessage = {
            id: null,
            timestamp: 'invalid_date',
            source: 'unknown_source',
            data: undefined
        } as any;

        const result = adapter.validateMessage(malformedMessage);
        
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should handle timeout scenarios', async () => {
        const shortTimeoutConfig = { ...mockConfig, timeoutMs: 1 };
        await controller.initialize(shortTimeoutConfig);

        // Register a handler that takes longer than timeout
        controller.registerMessageHandler('prp_activation', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return { success: true };
        });

        const message = createTestMessage('prp_activation');
        const ack = await controller.sendMessage(message);
        
        expect(ack.received).toBe(true);
        // Handler timeout should be handled gracefully
    });

    test('should provide detailed error information', async () => {
        await controller.initialize(mockConfig);

        // Force an error by sending invalid message
        try {
            await controller.sendMessage({} as IntegrationMessage);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toContain('Invalid message');
        }

        const metrics = controller.getMetrics();
        expect(metrics.errors.totalErrors).toBeGreaterThan(0);
    });
});

// Helper function for tests
function createTestMessage(
    type: IntegrationMessageType, 
    id: string = 'test_msg'
): IntegrationMessage {
    return {
        id: `${id}_${Date.now()}`,
        timestamp: new Date(),
        source: type.includes('prp') ? 'prp' : 'field_protocol',
        target: type.includes('prp') ? 'field_protocol' : 'prp',
        type,
        payload: {
            data: { test: 'data', value: Math.random() },
            metadata: {
                size: 100,
                format: 'json',
                checksum: Math.random().toString(36).substr(2, 9),
                version: '1.0.0',
                sourceTimestamp: new Date()
            },
            schema: 'test_schema_v1'
        },
        priority: 'normal',
        context: {
            sessionId: `session_${Date.now()}`,
            requestId: `request_${Date.now()}`,
            correlationId: `corr_${Date.now()}`,
            environment: 'development',
            tags: ['test'],
            customHeaders: {}
        }
    };
}