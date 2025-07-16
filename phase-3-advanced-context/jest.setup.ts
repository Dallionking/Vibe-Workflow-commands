/**
 * Jest Setup File
 * Configure mocks and global test environment
 */

// Mock external services for testing
global.fetch = jest.fn();

// Mock timers for time-dependent tests
jest.useFakeTimers();

// Mock console methods to reduce test noise
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
};

// Mock process.env
process.env.NODE_ENV = 'test';

// Mock file system operations
jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
        writeFile: jest.fn(),
        mkdir: jest.fn(),
        access: jest.fn()
    },
    existsSync: jest.fn().mockReturnValue(true),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn()
}));

// Mock integration connections for bridge tests
jest.mock('./integration/integration-bridge', () => {
    const originalModule = jest.requireActual('./integration/integration-bridge');
    
    class MockConnectionChannel {
        constructor(public name: string, public endpoint: string) {}
        
        async connect(): Promise<void> {
            return Promise.resolve();
        }
        
        async disconnect(): Promise<void> {
            return Promise.resolve();
        }
        
        isActive(): boolean {
            return true;
        }
        
        async send(data: any): Promise<any> {
            return { success: true, data };
        }
    }
    
    return {
        ...originalModule,
        ConnectionChannel: MockConnectionChannel
    };
});

// Mock performance.now for consistent timing
global.performance = {
    now: jest.fn(() => Date.now())
} as any;

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});

// Cleanup after all tests
afterAll(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
});

// Increase test timeout for integration tests
jest.setTimeout(10000);

// Export empty object to make this a module
export {};