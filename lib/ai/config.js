/**
 * AI Provider Configuration and Usage Limits
 */

export const AI_PROVIDERS = {
  openrouter: {
    name: 'OpenRouter',
    description: 'Free tier - unlimited fair usage',
    purpose: 'General AI generation for all users',
    limits: {
      free: { daily: Infinity, monthly: Infinity },
      basic: { daily: Infinity, monthly: Infinity },
      pro: { daily: Infinity, monthly: Infinity },
    },
  },
  gemini: {
    name: 'Gemini',
    description: 'Premium AI with usage limits',
    purpose: 'High-quality content generation',
    limits: {
      free: { daily: 3, monthly: 10 },
      basic: { daily: 10, monthly: 100 },
      pro: { daily: 50, monthly: 500 },
    },
  },
  openai: {
    name: 'OpenAI',
    description: 'Premium AI with usage limits',
    purpose: 'Advanced content generation',
    limits: {
      free: { daily: 3, monthly: 10 },
      basic: { daily: 10, monthly: 100 },
      pro: { daily: 50, monthly: 500 },
    },
  },
  perplexity: {
    name: 'Perplexity',
    description: 'Research and compliance checking',
    purpose: 'Platform guidelines, copyright checks, best practices',
    limits: {
      free: { daily: 5, monthly: 20 },
      basic: { daily: 20, monthly: 200 },
      pro: { daily: 100, monthly: 1000 },
    },
  },
};

export const USER_TIERS = ['free', 'basic', 'pro'];

/**
 * Get usage limits for a provider and user tier
 */
export function getProviderLimits(provider, userTier = 'free') {
  const config = AI_PROVIDERS[provider];
  if (!config) return null;
  return config.limits[userTier] || config.limits.free;
}

/**
 * Check if usage is within limits
 */
export function isWithinLimits(provider, userTier, dailyUsage, monthlyUsage) {
  const limits = getProviderLimits(provider, userTier);
  if (!limits) return false;
  return dailyUsage < limits.daily && monthlyUsage < limits.monthly;
}
