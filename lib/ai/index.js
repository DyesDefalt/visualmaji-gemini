/**
 * Unified AI Service
 * Routes requests to appropriate providers based on usage limits
 */
import { generateWithGemini } from './gemini.js';
import { generateWithOpenAI } from './openai.js';
import { generateWithOpenRouter } from './openrouter.js';
import { researchWithPerplexity, checkPlatformGuidelines, checkContentCompliance, getAdBestPractices } from './perplexity.js';
import { canUseProvider, incrementUsage, getAllUsageStats } from './usage.js';
import { AI_PROVIDERS } from './config.js';

/**
 * Generate content with automatic provider selection and usage tracking
 * @param {string} prompt
 * @param {object} options - { userId, userTier, preferredProvider }
 */
export async function generate(prompt, options = {}) {
  const { userId = 'anonymous', userTier = 'free', preferredProvider } = options;

  // Determine which provider to use
  let provider = preferredProvider;
  
  if (provider && provider !== 'openrouter') {
    // Check if user can use preferred provider
    const check = canUseProvider(userId, provider, userTier);
    if (!check.allowed) {
      // Fall back to OpenRouter (always free)
      provider = 'openrouter';
    }
  } else {
    // Default to OpenRouter for free users, or if no preference
    provider = 'openrouter';
  }

  // Execute generation
  let result;
  switch (provider) {
    case 'gemini':
      result = await generateWithGemini(prompt, options);
      break;
    case 'openai':
      result = await generateWithOpenAI(prompt, options);
      break;
    case 'openrouter':
    default:
      result = await generateWithOpenRouter(prompt, options);
      break;
  }

  // Track usage on success
  if (result.success) {
    incrementUsage(userId, provider);
  }

  return { ...result, provider };
}

/**
 * Research with Perplexity (for compliance/guidelines)
 * @param {string} query
 * @param {object} options - { userId, userTier }
 */
export async function research(query, options = {}) {
  const { userId = 'anonymous', userTier = 'free' } = options;

  const check = canUseProvider(userId, 'perplexity', userTier);
  if (!check.allowed) {
    return { success: false, error: check.reason };
  }

  const result = await researchWithPerplexity(query, options);
  
  if (result.success) {
    incrementUsage(userId, 'perplexity');
  }

  return { ...result, provider: 'perplexity' };
}

/**
 * Check platform guidelines
 */
export async function getPlatformGuidelines(platform, contentType, options = {}) {
  const { userId = 'anonymous', userTier = 'free' } = options;

  const check = canUseProvider(userId, 'perplexity', userTier);
  if (!check.allowed) {
    return { success: false, error: check.reason };
  }

  const result = await checkPlatformGuidelines(platform, contentType);
  
  if (result.success) {
    incrementUsage(userId, 'perplexity');
  }

  return { ...result, provider: 'perplexity' };
}

/**
 * Check content compliance (copyright/plagiarism)
 */
export async function checkCompliance(content, options = {}) {
  const { userId = 'anonymous', userTier = 'free' } = options;

  const check = canUseProvider(userId, 'perplexity', userTier);
  if (!check.allowed) {
    return { success: false, error: check.reason };
  }

  const result = await checkContentCompliance(content);
  
  if (result.success) {
    incrementUsage(userId, 'perplexity');
  }

  return { ...result, provider: 'perplexity' };
}

/**
 * Get ad best practices
 */
export async function getAdCreativeBestPractices(platform, objective, options = {}) {
  const { userId = 'anonymous', userTier = 'free' } = options;

  const check = canUseProvider(userId, 'perplexity', userTier);
  if (!check.allowed) {
    return { success: false, error: check.reason };
  }

  const result = await getAdBestPractices(platform, objective);
  
  if (result.success) {
    incrementUsage(userId, 'perplexity');
  }

  return { ...result, provider: 'perplexity' };
}

/**
 * Get user's usage statistics
 */
export function getUsageStats(userId, userTier = 'free') {
  return getAllUsageStats(userId, userTier);
}

export { AI_PROVIDERS };
