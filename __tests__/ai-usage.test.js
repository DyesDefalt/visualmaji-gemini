import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getUserUsage, 
  incrementUsage, 
  canUseProvider, 
  getAllUsageStats 
} from '../lib/ai/usage.js';
import { getProviderLimits, isWithinLimits } from '../lib/ai/config.js';

describe('AI Usage Tracking', () => {
  const testUserId = 'test-user-' + Date.now();

  describe('getProviderLimits', () => {
    it('should return correct limits for free tier', () => {
      const limits = getProviderLimits('gemini', 'free');
      expect(limits.daily).toBe(3);
      expect(limits.monthly).toBe(10);
    });

    it('should return unlimited for openrouter', () => {
      const limits = getProviderLimits('openrouter', 'free');
      expect(limits.daily).toBe(Infinity);
      expect(limits.monthly).toBe(Infinity);
    });

    it('should return higher limits for pro tier', () => {
      const limits = getProviderLimits('gemini', 'pro');
      expect(limits.daily).toBe(50);
      expect(limits.monthly).toBe(500);
    });

    it('should return null for invalid provider', () => {
      const limits = getProviderLimits('invalid', 'free');
      expect(limits).toBeNull();
    });
  });

  describe('isWithinLimits', () => {
    it('should return true when under limits', () => {
      expect(isWithinLimits('gemini', 'free', 1, 5)).toBe(true);
    });

    it('should return false when daily limit reached', () => {
      expect(isWithinLimits('gemini', 'free', 3, 5)).toBe(false);
    });

    it('should return false when monthly limit reached', () => {
      expect(isWithinLimits('gemini', 'free', 1, 10)).toBe(false);
    });

    it('should always return true for openrouter', () => {
      expect(isWithinLimits('openrouter', 'free', 1000, 10000)).toBe(true);
    });
  });

  describe('getUserUsage', () => {
    it('should return zero usage for new user', () => {
      const usage = getUserUsage('new-user-' + Date.now(), 'gemini');
      expect(usage.daily).toBe(0);
      expect(usage.monthly).toBe(0);
    });
  });

  describe('incrementUsage', () => {
    it('should increment daily and monthly counts', () => {
      const userId = 'increment-test-' + Date.now();
      
      incrementUsage(userId, 'gemini');
      const usage = getUserUsage(userId, 'gemini');
      
      expect(usage.daily).toBe(1);
      expect(usage.monthly).toBe(1);
    });

    it('should track usage separately per provider', () => {
      const userId = 'multi-provider-' + Date.now();
      
      incrementUsage(userId, 'gemini');
      incrementUsage(userId, 'openai');
      incrementUsage(userId, 'gemini');
      
      expect(getUserUsage(userId, 'gemini').daily).toBe(2);
      expect(getUserUsage(userId, 'openai').daily).toBe(1);
    });
  });

  describe('canUseProvider', () => {
    it('should allow usage when under limits', () => {
      const userId = 'can-use-' + Date.now();
      const result = canUseProvider(userId, 'gemini', 'free');
      
      expect(result.allowed).toBe(true);
      expect(result.usage.daily).toBe(0);
    });

    it('should deny usage when daily limit reached', () => {
      const userId = 'daily-limit-' + Date.now();
      
      // Use up daily limit (3 for free tier)
      incrementUsage(userId, 'gemini');
      incrementUsage(userId, 'gemini');
      incrementUsage(userId, 'gemini');
      
      const result = canUseProvider(userId, 'gemini', 'free');
      
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Daily limit');
    });

    it('should always allow openrouter', () => {
      const userId = 'openrouter-' + Date.now();
      
      // Simulate heavy usage
      for (let i = 0; i < 100; i++) {
        incrementUsage(userId, 'openrouter');
      }
      
      const result = canUseProvider(userId, 'openrouter', 'free');
      expect(result.allowed).toBe(true);
    });
  });

  describe('getAllUsageStats', () => {
    it('should return stats for all providers', () => {
      const userId = 'all-stats-' + Date.now();
      const stats = getAllUsageStats(userId, 'free');
      
      expect(stats.gemini).toBeDefined();
      expect(stats.openai).toBeDefined();
      expect(stats.openrouter).toBeDefined();
      expect(stats.perplexity).toBeDefined();
    });

    it('should include remaining counts', () => {
      const userId = 'remaining-' + Date.now();
      incrementUsage(userId, 'gemini');
      
      const stats = getAllUsageStats(userId, 'free');
      
      expect(stats.gemini.remaining.daily).toBe(2); // 3 - 1
      expect(stats.gemini.remaining.monthly).toBe(9); // 10 - 1
    });
  });
});
