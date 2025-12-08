/**
 * AI Usage Tracking Service
 * Tracks daily/monthly usage per user per provider
 */
import { AI_PROVIDERS, getProviderLimits, isWithinLimits } from './config.js';
import { VISION_MODELS, getProviderKeyFromModelId } from './vision-config.js';

// In-memory storage (replace with database in production)
const usageStore = new Map();

// Separate storage for vision model usage
const visionUsageStore = new Map();

/**
 * Vision usage limits per provider per tier
 */
export const VISION_USAGE_LIMITS = {
  gemini: {
    free: { daily: 0, monthly: 0 },
    basic: { daily: 10, monthly: 100 },
    pro: { daily: 50, monthly: 500 },
  },
  openai: {
    free: { daily: 0, monthly: 0 },
    basic: { daily: 10, monthly: 100 },
    pro: { daily: 50, monthly: 500 },
  },
  openrouter: {
    free: { daily: Infinity, monthly: Infinity },
    basic: { daily: Infinity, monthly: Infinity },
    pro: { daily: Infinity, monthly: Infinity },
  },
  perplexity: {
    free: { daily: 0, monthly: 0 },
    basic: { daily: 20, monthly: 200 },
    pro: { daily: 100, monthly: 1000 },
  },
};

/**
 * Get usage key for storage
 */
function getUsageKey(userId, provider) {
  return `${userId}:${provider}`;
}

/**
 * Get current date strings for tracking
 */
function getDateKeys() {
  const now = new Date();
  return {
    day: now.toISOString().split('T')[0], // YYYY-MM-DD
    month: now.toISOString().slice(0, 7),  // YYYY-MM
  };
}

/**
 * Get user's usage for a provider
 * @param {string} userId
 * @param {string} provider
 * @returns {{ daily: number, monthly: number, lastDay: string, lastMonth: string }}
 */
export function getUserUsage(userId, provider) {
  const key = getUsageKey(userId, provider);
  const { day, month } = getDateKeys();
  
  const stored = usageStore.get(key) || {
    daily: 0,
    monthly: 0,
    lastDay: day,
    lastMonth: month,
  };

  // Reset daily count if new day
  if (stored.lastDay !== day) {
    stored.daily = 0;
    stored.lastDay = day;
  }

  // Reset monthly count if new month
  if (stored.lastMonth !== month) {
    stored.monthly = 0;
    stored.lastMonth = month;
  }

  return stored;
}

/**
 * Increment usage for a user/provider
 * @param {string} userId
 * @param {string} provider
 */
export function incrementUsage(userId, provider) {
  const key = getUsageKey(userId, provider);
  const usage = getUserUsage(userId, provider);
  
  usage.daily += 1;
  usage.monthly += 1;
  
  usageStore.set(key, usage);
  return usage;
}

/**
 * Check if user can use a provider
 * @param {string} userId
 * @param {string} provider
 * @param {string} userTier - 'free', 'basic', or 'pro'
 * @returns {{ allowed: boolean, usage: object, limits: object, reason?: string }}
 */
export function canUseProvider(userId, provider, userTier = 'free') {
  const limits = getProviderLimits(provider, userTier);
  if (!limits) {
    return { allowed: false, reason: 'Invalid provider' };
  }

  const usage = getUserUsage(userId, provider);
  const allowed = isWithinLimits(provider, userTier, usage.daily, usage.monthly);

  let reason;
  if (!allowed) {
    if (usage.daily >= limits.daily) {
      reason = `Daily limit reached (${limits.daily}/day)`;
    } else {
      reason = `Monthly limit reached (${limits.monthly}/month)`;
    }
  }

  return {
    allowed,
    usage: { daily: usage.daily, monthly: usage.monthly },
    limits,
    reason,
  };
}

/**
 * Get all usage stats for a user
 * @param {string} userId
 * @param {string} userTier
 */
export function getAllUsageStats(userId, userTier = 'free') {
  const stats = {};
  
  for (const provider of Object.keys(AI_PROVIDERS)) {
    const usage = getUserUsage(userId, provider);
    const limits = getProviderLimits(provider, userTier);
    
    stats[provider] = {
      name: AI_PROVIDERS[provider].name,
      purpose: AI_PROVIDERS[provider].purpose,
      usage: { daily: usage.daily, monthly: usage.monthly },
      limits,
      remaining: {
        daily: Math.max(0, limits.daily - usage.daily),
        monthly: Math.max(0, limits.monthly - usage.monthly),
      },
    };
  }
  
  return stats;
}

/**
 * Get vision usage key for storage
 */
function getVisionUsageKey(userId, provider) {
  return `vision:${userId}:${provider}`;
}

/**
 * Get user's vision usage for a provider
 * @param {string} userId
 * @param {string} provider - Provider key (gemini, openai, openrouter, perplexity)
 * @returns {{ daily: number, monthly: number, lastDay: string, lastMonth: string }}
 */
export function getVisionUsage(userId, provider) {
  const key = getVisionUsageKey(userId, provider);
  const { day, month } = getDateKeys();
  
  const stored = visionUsageStore.get(key) || {
    daily: 0,
    monthly: 0,
    lastDay: day,
    lastMonth: month,
  };

  // Reset daily count if new day
  if (stored.lastDay !== day) {
    stored.daily = 0;
    stored.lastDay = day;
  }

  // Reset monthly count if new month
  if (stored.lastMonth !== month) {
    stored.monthly = 0;
    stored.lastMonth = month;
  }

  return stored;
}

/**
 * Increment vision usage for a user/provider
 * @param {string} userId
 * @param {string} modelId - The vision model ID
 * @returns {{ provider: string, usage: object } | null}
 */
export function incrementVisionUsage(userId, modelId) {
  const provider = getProviderKeyFromModelId(modelId);
  if (!provider) {
    return null;
  }

  const key = getVisionUsageKey(userId, provider);
  const usage = getVisionUsage(userId, provider);
  
  usage.daily += 1;
  usage.monthly += 1;
  
  visionUsageStore.set(key, usage);
  return { provider, usage };
}

/**
 * Get vision usage limits for a provider and tier
 * @param {string} provider
 * @param {string} userTier
 * @returns {{ daily: number, monthly: number } | null}
 */
export function getVisionUsageLimits(provider, userTier = 'free') {
  const providerLimits = VISION_USAGE_LIMITS[provider];
  if (!providerLimits) return null;
  return providerLimits[userTier] || providerLimits.free;
}

/**
 * Get all vision usage stats for a user
 * @param {string} userId
 * @param {string} userTier
 * @returns {Object} Stats per provider with usage, limits, and remaining
 */
export function getVisionUsageStats(userId, userTier = 'free') {
  const stats = {};
  
  for (const providerKey of Object.keys(VISION_MODELS)) {
    const providerConfig = VISION_MODELS[providerKey];
    const usage = getVisionUsage(userId, providerKey);
    const limits = getVisionUsageLimits(providerKey, userTier);
    
    // Calculate remaining, handling Infinity properly
    const remainingDaily = limits.daily === Infinity 
      ? Infinity 
      : Math.max(0, limits.daily - usage.daily);
    const remainingMonthly = limits.monthly === Infinity 
      ? Infinity 
      : Math.max(0, limits.monthly - usage.monthly);
    
    stats[providerKey] = {
      name: providerConfig.provider,
      models: providerConfig.models,
      usage: { daily: usage.daily, monthly: usage.monthly },
      limits,
      remaining: {
        daily: remainingDaily,
        monthly: remainingMonthly,
      },
    };
  }
  
  return stats;
}


/**
 * Check if user can use a vision model
 * @param {string} userId
 * @param {string} modelId - The vision model ID
 * @param {string} userTier - 'free', 'basic', or 'pro'
 * @returns {{ allowed: boolean, usage?: object, limits?: object, reason?: string, alternatives?: string[] }}
 */
export function checkVisionUsageLimit(userId, modelId, userTier = 'free') {
  const provider = getProviderKeyFromModelId(modelId);
  
  if (!provider) {
    return { 
      allowed: false, 
      reason: 'Invalid vision model',
      alternatives: getAlternativeModels(null, userTier)
    };
  }

  const limits = getVisionUsageLimits(provider, userTier);
  if (!limits) {
    return { 
      allowed: false, 
      reason: 'Invalid provider',
      alternatives: getAlternativeModels(provider, userTier)
    };
  }

  const usage = getVisionUsage(userId, provider);
  
  // Check if within limits (handle Infinity)
  const dailyAllowed = limits.daily === Infinity || usage.daily < limits.daily;
  const monthlyAllowed = limits.monthly === Infinity || usage.monthly < limits.monthly;
  const allowed = dailyAllowed && monthlyAllowed;

  if (!allowed) {
    let reason;
    if (!dailyAllowed) {
      reason = `Daily vision limit reached for ${VISION_MODELS[provider].provider} (${limits.daily}/day)`;
    } else {
      reason = `Monthly vision limit reached for ${VISION_MODELS[provider].provider} (${limits.monthly}/month)`;
    }
    
    return {
      allowed: false,
      usage: { daily: usage.daily, monthly: usage.monthly },
      limits,
      reason,
      alternatives: getAlternativeModels(provider, userTier)
    };
  }

  return {
    allowed: true,
    usage: { daily: usage.daily, monthly: usage.monthly },
    limits
  };
}

/**
 * Get alternative vision models when a provider limit is exceeded
 * @param {string} excludeProvider - Provider to exclude from alternatives
 * @param {string} userTier - User's subscription tier
 * @returns {string[]} Array of alternative model IDs
 */
function getAlternativeModels(excludeProvider, userTier) {
  const alternatives = [];
  
  for (const [providerKey, providerConfig] of Object.entries(VISION_MODELS)) {
    if (providerKey === excludeProvider) continue;
    
    const limits = getVisionUsageLimits(providerKey, userTier);
    if (!limits) continue;
    
    // Only suggest providers with available limits
    const hasAvailability = limits.daily > 0 || limits.daily === Infinity;
    
    if (hasAvailability) {
      // Add free models first, then paid models for paid users
      for (const model of providerConfig.models) {
        if (model.tier === 'free') {
          alternatives.push(model.id);
        } else if (userTier !== 'free') {
          alternatives.push(model.id);
        }
      }
    }
  }
  
  return alternatives;
}
