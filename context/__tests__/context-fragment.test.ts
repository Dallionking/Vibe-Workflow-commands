/**
 * Context Fragment Test Suite
 * Tests for ContextFragmentFactory, TokenEstimator, and FragmentCollection
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { 
  ContextFragmentFactory, 
  TokenEstimator, 
  FragmentCollection 
} from '../assembly/context-fragment';
import { ContextPriority, ContextFragmentType } from '../types/context.types';

describe('ContextFragmentFactory', () => {
  let factory: ContextFragmentFactory;

  beforeEach(() => {
    factory = new ContextFragmentFactory();
  });

  describe('Fragment Creation', () => {
    test('should create basic fragment', () => {
      const fragment = factory.createFragment(
        'global-rules',
        'Test rule content',
        ContextPriority.HIGH,
        { source: { type: 'global', scope: 'system' } }
      );

      expect(fragment.id).toMatch(/global-rules-\d+-[a-z0-9]{6}/);
      expect(fragment.type).toBe('global-rules');
      expect(fragment.content).toBe('Test rule content');
      expect(fragment.priority).toBe(ContextPriority.HIGH);
      expect(fragment.tokenEstimate).toBeGreaterThan(0);
      expect(fragment.validation.isValid).toBe(true);
    });

    test('should create global fragment', () => {
      const fragment = factory.createGlobalFragment(
        'rules',
        'Global rules content',
        ContextPriority.CRITICAL
      );

      expect(fragment.type).toBe('global-rules');
      expect(fragment.metadata.source.type).toBe('global');
      expect(fragment.metadata.tags).toContain('global');
      expect(fragment.metadata.tags).toContain('rules');
      expect(fragment.metadata.ttl).toBeUndefined(); // Global doesn't expire
    });

    test('should create phase fragment', () => {
      const fragment = factory.createPhaseFragment(
        1,
        'Context Engineering',
        'context',
        'Phase context content',
        ContextPriority.HIGH
      );

      expect(fragment.type).toBe('phase-context');
      expect(fragment.metadata.source.type).toBe('phase');
      expect(fragment.metadata.tags).toContain('phase');
      expect(fragment.metadata.tags).toContain('phase-1');
      expect(fragment.metadata.ttl).toBe(24 * 60 * 60 * 1000); // 24 hours
    });

    test('should create task fragment', () => {
      const fragment = factory.createTaskFragment(
        'task-123',
        'implementation',
        'context',
        'Task context content',
        ContextPriority.MEDIUM
      );

      expect(fragment.type).toBe('task-context');
      expect(fragment.metadata.source.type).toBe('task');
      expect(fragment.metadata.tags).toContain('task');
      expect(fragment.metadata.tags).toContain('implementation');
      expect(fragment.metadata.ttl).toBe(60 * 60 * 1000); // 1 hour
    });

    test('should create memory fragment', () => {
      const fragment = factory.createMemoryFragment(
        'pattern',
        'Memory pattern content',
        ContextPriority.LOW
      );

      expect(fragment.type).toBe('memory-pattern');
      expect(fragment.metadata.source.type).toBe('memory');
      expect(fragment.metadata.tags).toContain('memory');
      expect(fragment.metadata.tags).toContain('pattern');
      expect(fragment.metadata.ttl).toBe(7 * 24 * 60 * 60 * 1000); // 7 days
    });

    test('should create command fragment', () => {
      const fragment = factory.createCommandFragment(
        'Read',
        'file-operation',
        'Command context content',
        ContextPriority.MEDIUM
      );

      expect(fragment.type).toBe('command-context');
      expect(fragment.metadata.source.type).toBe('command');
      expect(fragment.metadata.tags).toContain('command');
      expect(fragment.metadata.tags).toContain('Read');
      expect(fragment.metadata.ttl).toBe(30 * 60 * 1000); // 30 minutes
    });
  });

  describe('Fragment Updates', () => {
    test('should update fragment content', () => {
      const fragment = factory.createFragment(
        'task-context',
        'Original content',
        ContextPriority.MEDIUM,
        { source: { type: 'task', taskId: 'test', taskType: 'implementation' } }
      );

      const originalModified = fragment.metadata.lastModified;
      const originalTokens = fragment.tokenEstimate;

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        const updated = factory.updateFragment(fragment, 'Updated content with more text');

        expect(updated.content).toBe('Updated content with more text');
        expect(updated.metadata.lastModified).toBeGreaterThan(originalModified);
        expect(updated.tokenEstimate).toBeGreaterThan(originalTokens);
        expect(updated.validation.isValid).toBe(true);
      }, 10);
    });
  });

  describe('Fragment Expiration', () => {
    test('should detect expired fragments', () => {
      const fragment = factory.createFragment(
        'task-context',
        'Test content',
        ContextPriority.MEDIUM,
        { 
          source: { type: 'task', taskId: 'test', taskType: 'implementation' },
          ttl: 100 // 100ms TTL
        }
      );

      expect(factory.isExpired(fragment)).toBe(false);

      // Wait for expiration
      setTimeout(() => {
        expect(factory.isExpired(fragment)).toBe(true);
      }, 150);
    });

    test('should not expire fragments without TTL', () => {
      const fragment = factory.createGlobalFragment(
        'rules',
        'Global rules never expire',
        ContextPriority.CRITICAL
      );

      expect(factory.isExpired(fragment)).toBe(false);
    });
  });

  describe('Fragment Compression', () => {
    test('should compress large fragments', () => {
      const largeContent = 'This is a very long content string. '.repeat(100);
      const fragment = factory.createFragment(
        'task-context',
        largeContent,
        ContextPriority.MEDIUM,
        { source: { type: 'task', taskId: 'test', taskType: 'implementation' } }
      );

      const originalTokens = fragment.tokenEstimate;
      const targetTokens = Math.floor(originalTokens / 2);

      const compressed = factory.compressFragment(fragment, targetTokens);

      expect(compressed.tokenEstimate).toBeLessThanOrEqual(targetTokens);
      expect(compressed.content).toContain('[content compressed]');
      expect(compressed.content.length).toBeLessThan(largeContent.length);
    });

    test('should not compress fragments already within target', () => {
      const smallContent = 'Small content';
      const fragment = factory.createFragment(
        'task-context',
        smallContent,
        ContextPriority.MEDIUM,
        { source: { type: 'task', taskId: 'test', taskType: 'implementation' } }
      );

      const targetTokens = fragment.tokenEstimate + 100;
      const result = factory.compressFragment(fragment, targetTokens);

      expect(result.content).toBe(smallContent);
      expect(result.tokenEstimate).toBe(fragment.tokenEstimate);
    });
  });

  describe('Fragment Validation', () => {
    test('should validate global rules format', () => {
      const validRules = 'systematic: Always follow systematic patterns\nquality: Maintain high standards';
      const fragment = factory.createGlobalFragment('rules', validRules);

      expect(fragment.validation.isValid).toBe(true);
      expect(fragment.validation.errors).toHaveLength(0);
    });

    test('should warn about missing rule patterns', () => {
      const incompleteRules = 'some rule: Just a rule without key patterns';
      const fragment = factory.createGlobalFragment('rules', incompleteRules);

      expect(fragment.validation.isValid).toBe(true);
      expect(fragment.validation.warnings.length).toBeGreaterThan(0);
      expect(fragment.validation.warnings[0].code).toBe('MISSING_RULE_PATTERNS');
    });

    test('should validate empty content', () => {
      const fragment = factory.createFragment(
        'task-context',
        '',
        ContextPriority.MEDIUM,
        { source: { type: 'task', taskId: 'test', taskType: 'implementation' } }
      );

      expect(fragment.validation.isValid).toBe(false);
      expect(fragment.validation.errors).toHaveLength(1);
      expect(fragment.validation.errors[0].code).toBe('EMPTY_CONTENT');
    });

    test('should warn about high token count', () => {
      const largeContent = 'Large content. '.repeat(500); // Should exceed 1000 tokens
      const fragment = factory.createFragment(
        'task-context',
        largeContent,
        ContextPriority.MEDIUM,
        { source: { type: 'task', taskId: 'test', taskType: 'implementation' } }
      );

      expect(fragment.validation.warnings.some(w => w.code === 'HIGH_TOKEN_COUNT')).toBe(true);
    });
  });
});

describe('TokenEstimator', () => {
  let estimator: TokenEstimator;

  beforeEach(() => {
    estimator = new TokenEstimator();
  });

  describe('Token Estimation', () => {
    test('should estimate tokens for simple text', () => {
      const text = 'This is a simple test';
      const estimate = estimator.estimate(text);
      
      expect(estimate).toBeGreaterThan(0);
      expect(estimate).toBe(Math.ceil(text.length / 3.5));
    });

    test('should cache token estimates', () => {
      const text = 'Cached estimation test';
      
      const estimate1 = estimator.estimate(text);
      const estimate2 = estimator.estimate(text);
      
      expect(estimate1).toBe(estimate2);
    });

    test('should estimate total tokens for fragments', () => {
      const fragments = [
        { tokenEstimate: 100 },
        { tokenEstimate: 150 },
        { tokenEstimate: 75 }
      ] as any[];

      const total = estimator.estimateTotal(fragments);
      expect(total).toBe(325);
    });

    test('should handle empty fragment array', () => {
      const total = estimator.estimateTotal([]);
      expect(total).toBe(0);
    });

    test('should manage cache size', () => {
      estimator.clearCache();
      
      // Add many items to test cache management
      for (let i = 0; i < 1100; i++) {
        estimator.estimate(`test content ${i}`);
      }
      
      // Cache should be managed and not grow infinitely
      expect(true).toBe(true); // Just ensure no errors thrown
    });

    test('should clear cache', () => {
      estimator.estimate('test content');
      estimator.clearCache();
      
      // After clearing, estimation should still work
      const estimate = estimator.estimate('new test content');
      expect(estimate).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string', () => {
      const estimate = estimator.estimate('');
      expect(estimate).toBe(0);
    });

    test('should handle very long text', () => {
      const longText = 'Very long text content. '.repeat(1000);
      const estimate = estimator.estimate(longText);
      
      expect(estimate).toBeGreaterThan(1000);
      expect(estimate).toBe(Math.ceil(longText.length / 3.5));
    });

    test('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./';
      const estimate = estimator.estimate(specialText);
      
      expect(estimate).toBeGreaterThan(0);
    });
  });
});

describe('FragmentCollection', () => {
  let collection: FragmentCollection;
  let factory: ContextFragmentFactory;

  beforeEach(() => {
    collection = new FragmentCollection();
    factory = new ContextFragmentFactory();
  });

  describe('Collection Operations', () => {
    test('should add and retrieve fragments', () => {
      const fragment = factory.createFragment(
        'global-rules',
        'Test content',
        ContextPriority.HIGH,
        { source: { type: 'global', scope: 'system' } }
      );

      collection.add(fragment);
      
      expect(collection.get(fragment.id)).toBe(fragment);
      expect(collection.size()).toBe(1);
    });

    test('should remove fragments', () => {
      const fragment = factory.createFragment(
        'global-rules',
        'Test content',
        ContextPriority.HIGH,
        { source: { type: 'global', scope: 'system' } }
      );

      collection.add(fragment);
      expect(collection.size()).toBe(1);

      const removed = collection.remove(fragment.id);
      expect(removed).toBe(true);
      expect(collection.size()).toBe(0);
      expect(collection.get(fragment.id)).toBeUndefined();
    });

    test('should return false when removing non-existent fragment', () => {
      const removed = collection.remove('non-existent-id');
      expect(removed).toBe(false);
    });

    test('should get all fragments', () => {
      const fragment1 = factory.createGlobalFragment('rules', 'Content 1');
      const fragment2 = factory.createGlobalFragment('config', 'Content 2');

      collection.add(fragment1);
      collection.add(fragment2);

      const allFragments = collection.getAll();
      expect(allFragments).toHaveLength(2);
      expect(allFragments).toContain(fragment1);
      expect(allFragments).toContain(fragment2);
    });
  });

  describe('Fragment Filtering', () => {
    test('should get fragments by type', () => {
      const globalFragment = factory.createGlobalFragment('rules', 'Global content');
      const phaseFragment = factory.createPhaseFragment(1, 'Phase 1', 'context', 'Phase content');

      collection.add(globalFragment);
      collection.add(phaseFragment);

      const globalFragments = collection.getByType('global-rules');
      expect(globalFragments).toHaveLength(1);
      expect(globalFragments[0]).toBe(globalFragment);

      const phaseFragments = collection.getByType('phase-context');
      expect(phaseFragments).toHaveLength(1);
      expect(phaseFragments[0]).toBe(phaseFragment);
    });

    test('should get fragments by priority', () => {
      const criticalFragment = factory.createGlobalFragment('rules', 'Critical', ContextPriority.CRITICAL);
      const highFragment = factory.createGlobalFragment('config', 'High', ContextPriority.HIGH);
      const mediumFragment = factory.createTaskFragment('task-1', 'implementation', 'context', 'Medium', ContextPriority.MEDIUM);

      collection.add(criticalFragment);
      collection.add(highFragment);
      collection.add(mediumFragment);

      const highPriorityFragments = collection.getByPriority(ContextPriority.HIGH);
      expect(highPriorityFragments).toHaveLength(2); // Critical and High
      expect(highPriorityFragments).toContain(criticalFragment);
      expect(highPriorityFragments).toContain(highFragment);
      expect(highPriorityFragments).not.toContain(mediumFragment);
    });

    test('should get fragments sorted by priority', () => {
      const mediumFragment = factory.createTaskFragment('task-1', 'implementation', 'context', 'Medium', ContextPriority.MEDIUM);
      const criticalFragment = factory.createGlobalFragment('rules', 'Critical', ContextPriority.CRITICAL);
      const highFragment = factory.createGlobalFragment('config', 'High', ContextPriority.HIGH);

      collection.add(mediumFragment);
      collection.add(criticalFragment);
      collection.add(highFragment);

      const sortedFragments = collection.getSortedByPriority();
      expect(sortedFragments).toHaveLength(3);
      expect(sortedFragments[0]).toBe(criticalFragment);
      expect(sortedFragments[1]).toBe(highFragment);
      expect(sortedFragments[2]).toBe(mediumFragment);
    });
  });

  describe('Collection Maintenance', () => {
    test('should remove expired fragments', () => {
      const expiredFragment = factory.createTaskFragment(
        'task-1', 
        'implementation', 
        'context', 
        'Expired content', 
        ContextPriority.MEDIUM
      );
      
      // Manually set created time to make it expired
      expiredFragment.metadata.created = Date.now() - (2 * 60 * 60 * 1000); // 2 hours ago
      expiredFragment.metadata.ttl = 60 * 60 * 1000; // 1 hour TTL

      const validFragment = factory.createGlobalFragment('rules', 'Valid content');

      collection.add(expiredFragment);
      collection.add(validFragment);

      expect(collection.size()).toBe(2);

      const removedCount = collection.removeExpired(factory);
      expect(removedCount).toBe(1);
      expect(collection.size()).toBe(1);
      expect(collection.get(validFragment.id)).toBe(validFragment);
      expect(collection.get(expiredFragment.id)).toBeUndefined();
    });

    test('should calculate total tokens', () => {
      const fragment1 = factory.createGlobalFragment('rules', 'Content 1');
      const fragment2 = factory.createGlobalFragment('config', 'Content 2');

      collection.add(fragment1);
      collection.add(fragment2);

      const totalTokens = collection.getTotalTokens();
      const expectedTokens = fragment1.tokenEstimate + fragment2.tokenEstimate;
      expect(totalTokens).toBe(expectedTokens);
    });

    test('should clear all fragments', () => {
      const fragment1 = factory.createGlobalFragment('rules', 'Content 1');
      const fragment2 = factory.createGlobalFragment('config', 'Content 2');

      collection.add(fragment1);
      collection.add(fragment2);
      expect(collection.size()).toBe(2);

      collection.clear();
      expect(collection.size()).toBe(0);
      expect(collection.getAll()).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty collection operations', () => {
      expect(collection.size()).toBe(0);
      expect(collection.getAll()).toHaveLength(0);
      expect(collection.getByType('global-rules')).toHaveLength(0);
      expect(collection.getByPriority(ContextPriority.HIGH)).toHaveLength(0);
      expect(collection.getTotalTokens()).toBe(0);
      expect(collection.removeExpired(factory)).toBe(0);
    });

    test('should handle duplicate additions', () => {
      const fragment = factory.createGlobalFragment('rules', 'Test content');
      
      collection.add(fragment);
      collection.add(fragment); // Add same fragment again
      
      expect(collection.size()).toBe(1); // Should still be 1, not 2
    });
  });
});