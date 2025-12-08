import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { 
  getVisionUsage, 
  incrementVisionUsage,
  getVisionUsageStats
} from '../lib/ai/usage.js';
import { VISION_MODELS, getProviderKeyFromModelId } from '../lib/ai/vision-config.js';

/**
 * **Feature: vision-ai-brand, Property 10: Usage Tracking Per Provider**
 * 
 * *For any* image analysis operation, the usage counter for the specific provider 
 * SHALL be incremented, and counters for other providers SHALL remain unchanged.
 * 
 * **Validates: Requirements 5.1, 5.2**
 */
describe('Vision Usage Tracking - Property 10', () => {
  // Get all valid model IDs from the configuration
  const allModelIds = Object.values(VISION_MODELS).flatMap(group => 
    group.models.map(m => m.id)
  );
  
  // Get all provider keys
  const allProviderKeys = Object.keys(VISION_MODELS);

  // Arbitrary for valid model IDs
  const modelIdArb = fc.constantFrom(...allModelIds);
  
  // Arbitrary for user IDs (unique per test to avoid state pollution)
  const userIdArb = fc.uuid();

  it('should increment the correct provider counter when vision usage is tracked', () => {
    fc.assert(
      fc.property(userIdArb, modelIdArb, (userId, modelId) => {
        // Get the expected provider for this model
        const expectedProvider = getProviderKeyFromModelId(modelId);
        expect(expectedProvider).not.toBeNull();

        // Get usage before increment for all providers
        const usageBefore = {};
        for (const provider of allProviderKeys) {
          usageBefore[provider] = getVisionUsage(userId, provider);
        }

        // Increment usage for the selected model
        const result = incrementVisionUsage(userId, modelId);
        
        // Verify the result contains the correct provider
        expect(result).not.toBeNull();
        expect(result.provider).toBe(expectedProvider);

        // Get usage after increment for all providers
        const usageAfter = {};
        for (const provider of allProviderKeys) {
          usageAfter[provider] = getVisionUsage(userId, provider);
        }

        // Property: The correct provider counter should be incremented by 1
        expect(usageAfter[expectedProvider].daily).toBe(usageBefore[expectedProvider].daily + 1);
        expect(usageAfter[expectedProvider].monthly).toBe(usageBefore[expectedProvider].monthly + 1);

        // Property: All other provider counters should remain unchanged
        for (const provider of allProviderKeys) {
          if (provider !== expectedProvider) {
            expect(usageAfter[provider].daily).toBe(usageBefore[provider].daily);
            expect(usageAfter[provider].monthly).toBe(usageBefore[provider].monthly);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should track usage separately per provider across multiple increments', () => {
    fc.assert(
      fc.property(
        userIdArb,
        fc.array(modelIdArb, { minLength: 1, maxLength: 10 }),
        (userId, modelIds) => {
          // Calculate expected increments per provider
          const expectedIncrements = {};
          for (const provider of allProviderKeys) {
            expectedIncrements[provider] = 0;
          }
          
          for (const modelId of modelIds) {
            const provider = getProviderKeyFromModelId(modelId);
            if (provider) {
              expectedIncrements[provider]++;
            }
          }

          // Get initial usage for all providers
          const initialUsage = {};
          for (const provider of allProviderKeys) {
            initialUsage[provider] = getVisionUsage(userId, provider);
          }

          // Perform all increments
          for (const modelId of modelIds) {
            incrementVisionUsage(userId, modelId);
          }

          // Verify each provider has the correct increment
          for (const provider of allProviderKeys) {
            const finalUsage = getVisionUsage(userId, provider);
            expect(finalUsage.daily).toBe(initialUsage[provider].daily + expectedIncrements[provider]);
            expect(finalUsage.monthly).toBe(initialUsage[provider].monthly + expectedIncrements[provider]);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return null for invalid model IDs without affecting any counters', () => {
    fc.assert(
      fc.property(
        userIdArb,
        fc.string({ minLength: 1 }).filter(s => !allModelIds.includes(s)),
        (userId, invalidModelId) => {
          // Get usage before for all providers
          const usageBefore = {};
          for (const provider of allProviderKeys) {
            usageBefore[provider] = getVisionUsage(userId, provider);
          }

          // Attempt to increment with invalid model
          const result = incrementVisionUsage(userId, invalidModelId);
          
          // Should return null for invalid model
          expect(result).toBeNull();

          // All counters should remain unchanged
          for (const provider of allProviderKeys) {
            const usageAfter = getVisionUsage(userId, provider);
            expect(usageAfter.daily).toBe(usageBefore[provider].daily);
            expect(usageAfter.monthly).toBe(usageBefore[provider].monthly);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
