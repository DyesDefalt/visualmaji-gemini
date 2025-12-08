import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  checkVisionUsageLimit,
  getVisionUsage,
  incrementVisionUsage,
  getVisionUsageLimits,
  VISION_USAGE_LIMITS
} from '../lib/ai/usage.js';
import { VISION_MODELS, getProviderKeyFromModelId } from '../lib/ai/vision-config.js';

/**
 * **Feature: vision-ai-brand, Property 11: Usage Limit Enforcement**
 * 
 * *For any* user who has exceeded their tier's usage limit for a specific provider,
 * analysis requests with that provider SHALL be rejected with an appropriate error
 * and alternative suggestions.
 * 
 * **Validates: Requirements 5.3**
 */
describe('Property 11: Usage Limit Enforcement', () => {
  // Generators for property-based testing
  const userIdArb = fc.uuid();
  const userTierArb = fc.constantFrom('free', 'basic', 'pro');
  
  // Get all model IDs from providers with finite limits (not openrouter)
  const limitedProviders = Object.entries(VISION_MODELS)
    .filter(([key]) => key !== 'openrouter')
    .flatMap(([, group]) => group.models.map(m => m.id));
  
  const limitedModelIdArb = fc.constantFrom(...limitedProviders);
  
  // All model IDs for general testing
  const allModelIds = Object.values(VISION_MODELS)
    .flatMap(group => group.models.map(m => m.id));
  const modelIdArb = fc.constantFrom(...allModelIds);

  it('should reject analysis when daily limit is exceeded', () => {
    fc.assert(
      fc.property(
        userIdArb,
        limitedModelIdArb,
        userTierArb,
        (userId, modelId, userTier) => {
          const provider = getProviderKeyFromModelId(modelId);
          const limits = getVisionUsageLimits(provider, userTier);
          
          // Skip if no limits or unlimited
          if (!limits || limits.daily === Infinity || limits.daily === 0) {
            return true;
          }
          
          // Simulate exceeding daily limit by incrementing usage
          const uniqueUserId = `${userId}-daily-${Date.now()}-${Math.random()}`;
          for (let i = 0; i < limits.daily; i++) {
            incrementVisionUsage(uniqueUserId, modelId);
          }
          
          // Check that the limit is now enforced
          const result = checkVisionUsageLimit(uniqueUserId, modelId, userTier);
          
          // Should be rejected
          expect(result.allowed).toBe(false);
          // Should have a reason explaining the rejection
          expect(result.reason).toBeDefined();
          expect(result.reason).toContain('limit');
          // Should suggest alternatives
          expect(result.alternatives).toBeDefined();
          expect(Array.isArray(result.alternatives)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject analysis when monthly limit is exceeded', () => {
    fc.assert(
      fc.property(
        userIdArb,
        userTierArb,
        (userId, userTier) => {
          // Use perplexity as it has reasonable monthly limits for testing
          const modelId = 'sonar';
          const provider = 'perplexity';
          const limits = getVisionUsageLimits(provider, userTier);
          
          // Skip if no limits or unlimited or zero (free tier)
          if (!limits || limits.monthly === Infinity || limits.monthly === 0) {
            return true;
          }
          
          // Create unique user to avoid test interference
          const uniqueUserId = `${userId}-monthly-${Date.now()}-${Math.random()}`;
          
          // Simulate exceeding monthly limit
          for (let i = 0; i < limits.monthly; i++) {
            incrementVisionUsage(uniqueUserId, modelId);
          }
          
          // Check that the limit is now enforced
          const result = checkVisionUsageLimit(uniqueUserId, modelId, userTier);
          
          // Should be rejected
          expect(result.allowed).toBe(false);
          // Should have a reason
          expect(result.reason).toBeDefined();
          expect(result.reason.toLowerCase()).toContain('limit');
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should allow analysis when under limits', () => {
    fc.assert(
      fc.property(
        userIdArb,
        modelIdArb,
        userTierArb,
        (userId, modelId, userTier) => {
          const provider = getProviderKeyFromModelId(modelId);
          const limits = getVisionUsageLimits(provider, userTier);
          
          // Skip invalid providers
          if (!limits) {
            return true;
          }
          
          // Skip if tier has no access (0 limits)
          if (limits.daily === 0 && limits.monthly === 0) {
            return true;
          }
          
          // Create unique user with no prior usage
          const uniqueUserId = `${userId}-under-${Date.now()}-${Math.random()}`;
          
          // Check that analysis is allowed
          const result = checkVisionUsageLimit(uniqueUserId, modelId, userTier);
          
          // Should be allowed
          expect(result.allowed).toBe(true);
          // Should not have a rejection reason
          expect(result.reason).toBeUndefined();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should provide alternative models when limit exceeded', () => {
    fc.assert(
      fc.property(
        userIdArb,
        limitedModelIdArb,
        fc.constantFrom('basic', 'pro'), // Only paid tiers have limits > 0
        (userId, modelId, userTier) => {
          const provider = getProviderKeyFromModelId(modelId);
          const limits = getVisionUsageLimits(provider, userTier);
          
          // Skip if no limits or unlimited
          if (!limits || limits.daily === Infinity || limits.daily === 0) {
            return true;
          }
          
          // Create unique user and exceed limit
          const uniqueUserId = `${userId}-alt-${Date.now()}-${Math.random()}`;
          for (let i = 0; i < limits.daily; i++) {
            incrementVisionUsage(uniqueUserId, modelId);
          }
          
          const result = checkVisionUsageLimit(uniqueUserId, modelId, userTier);
          
          // Should provide alternatives
          expect(result.alternatives).toBeDefined();
          expect(Array.isArray(result.alternatives)).toBe(true);
          
          // Alternatives should not include models from the same provider
          const alternativeProviders = result.alternatives.map(getProviderKeyFromModelId);
          expect(alternativeProviders.every(p => p !== provider)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always allow openrouter models (unlimited)', () => {
    fc.assert(
      fc.property(
        userIdArb,
        userTierArb,
        fc.integer({ min: 1, max: 1000 }),
        (userId, userTier, usageCount) => {
          // Pick an openrouter model
          const openrouterModels = VISION_MODELS.openrouter.models;
          const modelId = openrouterModels[0].id;
          
          // Create unique user
          const uniqueUserId = `${userId}-openrouter-${Date.now()}-${Math.random()}`;
          
          // Simulate heavy usage
          for (let i = 0; i < usageCount; i++) {
            incrementVisionUsage(uniqueUserId, modelId);
          }
          
          // Should still be allowed
          const result = checkVisionUsageLimit(uniqueUserId, modelId, userTier);
          expect(result.allowed).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
