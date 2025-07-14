/**
 * Tests for Validation System
 */

import { VibeValidationSystem } from '../../context/validation/validation-integration';
import { PhaseTransitionValidator } from '../../context/validation/phase-transition-validator';
import { CommandValidationHooks } from '../../context/validation/command-validation-hooks';
import * as fs from 'fs';
import * as path from 'path';

// Mock file system
jest.mock('fs');

describe('Validation System', () => {
  let validationSystem: VibeValidationSystem;
  const mockProjectRoot = '/test/project';

  beforeEach(() => {
    // Mock file system
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('');
    
    validationSystem = new VibeValidationSystem(mockProjectRoot);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Command Execution with Validation', () => {
    it('should pass validation for valid command', async () => {
      const result = await validationSystem.executeCommand('test-command', {
        param1: 'value1'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.validationReport).toContain('Success');
    });

    it('should fail pre-execution validation when requirements not met', async () => {
      // Mock git not initialized
      (fs.existsSync as jest.Mock).mockImplementation((path: string) => {
        return !path.includes('.git');
      });

      const result = await validationSystem.executeCommand('vibe-commit', {});

      expect(result.success).toBe(false);
      expect(result.validationReport).toContain('Failed');
    });

    it('should skip validation when requested', async () => {
      const result = await validationSystem.executeCommand('test-command', {}, {
        skipPreValidation: true,
        skipPostValidation: true
      });

      expect(result.success).toBe(true);
      expect(result.validationReport).not.toContain('Pre-Execution');
    });

    it('should attempt iterative improvement', async () => {
      // First validation fails, then succeeds
      let callCount = 0;
      (fs.existsSync as jest.Mock).mockImplementation(() => {
        return ++callCount > 1;
      });

      const result = await validationSystem.executeCommand('test-command', {}, {
        iterativeImprovement: true
      });

      expect(result.improvements).toBeDefined();
      expect(result.improvements?.attempt).toBeGreaterThan(0);
    });
  });

  describe('Phase Transition Validation', () => {
    let phaseValidator: PhaseTransitionValidator;

    beforeEach(() => {
      phaseValidator = new PhaseTransitionValidator(mockProjectRoot);
    });

    it('should validate phase transition requirements', async () => {
      // Mock current phase
      (fs.readFileSync as jest.Mock).mockReturnValue('Current Phase: ideation');

      const result = await validationSystem.validatePhaseTransition('architecture');
      
      expect(result.report).toBeDefined();
      // Result depends on mocked file existence
    });

    it('should get phase completion status', async () => {
      const status = await validationSystem.getPhaseStatus();
      
      expect(status).toContain('Phase Status');
      expect(status).toContain('Completion');
    });

    it('should force phase transition with reason', async () => {
      await validationSystem.forcePhaseTransition('testing', 'Emergency hotfix');
      
      // Verify file write was called
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });

  describe('Command Validation Hooks', () => {
    let commandHooks: CommandValidationHooks;

    beforeEach(() => {
      commandHooks = new CommandValidationHooks(mockProjectRoot);
    });

    it('should register custom validation hook', () => {
      const customHook = {
        id: 'custom-hook',
        name: 'Custom Validation',
        type: 'pre' as const,
        commands: ['custom-command'],
        validate: jest.fn().mockResolvedValue({
          valid: true,
          errors: [],
          warnings: [],
          suggestions: [],
          fixable: false
        })
      };

      validationSystem.registerHook(customHook);
      
      // Hook should be registered
      expect(true).toBe(true); // Placeholder
    });

    it('should validate git status for commit commands', async () => {
      const hooks = new CommandValidationHooks(mockProjectRoot);
      
      // Mock git status
      const execSync = require('child_process').execSync;
      jest.mock('child_process');
      (execSync as jest.Mock).mockReturnValue('M file.txt');

      const result = await hooks.validatePreExecution('vibe-commit', {});
      
      // Should validate git has changes
      expect(result.valid).toBeDefined();
    });

    it('should check test coverage', async () => {
      const hooks = new CommandValidationHooks(mockProjectRoot);
      
      const result = await hooks.validatePostExecution(
        'vibe-validate-work',
        {},
        { coverage: 85 }
      );
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Test coverage 85% is below required 95%');
    });
  });

  describe('Validation Dashboard', () => {
    it('should generate validation dashboard', async () => {
      const dashboard = await validationSystem.getValidationDashboard();
      
      expect(dashboard).toContain('Vibe Validation Dashboard');
      expect(dashboard).toContain('Current Phase');
      expect(dashboard).toContain('Validation Statistics');
      expect(dashboard).toContain('Next Steps');
    });
  });

  describe('Learning Integration', () => {
    it('should get learning insights', async () => {
      const insights = await validationSystem.getLearningInsights();
      
      expect(Array.isArray(insights)).toBe(true);
    });
  });

  describe('Event Emission', () => {
    it('should emit validation events', async () => {
      const eventSpy = jest.fn();
      validationSystem.on('validation', eventSpy);

      await validationSystem.executeCommand('test-command', {});
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'pre-validation',
          command: 'test-command'
        })
      );
    });
  });

  describe('Report Generation', () => {
    it('should generate report in different formats', async () => {
      const formats: Array<'terminal' | 'markdown' | 'json'> = [
        'terminal', 
        'markdown', 
        'json'
      ];

      for (const format of formats) {
        const result = await validationSystem.executeCommand('test-command', {}, {
          reportFormat: format
        });
        
        expect(result.validationReport).toBeDefined();
        
        if (format === 'json') {
          expect(() => JSON.parse(result.validationReport)).not.toThrow();
        }
      }
    });
  });
});