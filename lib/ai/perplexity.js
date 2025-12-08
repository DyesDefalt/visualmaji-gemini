/**
 * Perplexity AI Service - Research, compliance, and best practices
 * Used for: Platform guidelines, copyright checks, plagiarism detection
 */
import { env, isProviderConfigured } from '../env.js';

const PERPLEXITY_API_BASE = 'https://api.perplexity.ai';

/**
 * Research using Perplexity API
 * @param {string} query - The research query
 * @param {object} options - Optional configuration
 * @returns {Promise<{ success: boolean, text?: string, error?: string }>}
 */
export async function researchWithPerplexity(query, options = {}) {
  if (!isProviderConfigured('perplexity')) {
    return { success: false, error: 'Perplexity API is not configured' };
  }

  const model = options.model || env.perplexity.model;

  try {
    const response = await fetch(`${PERPLEXITY_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.perplexity.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: query }],
        temperature: options.temperature ?? 0.2, // Lower for factual research
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'API request failed' };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    return { success: true, text, model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check platform advertising guidelines
 * @param {string} platform - Platform name (meta, tiktok, google, x)
 * @param {string} contentType - Type of content (image, video, text)
 */
export async function checkPlatformGuidelines(platform, contentType) {
  const query = `What are the latest ${platform} advertising guidelines and best practices for ${contentType} ads? Include:
1. Content requirements and restrictions
2. Technical specifications
3. Prohibited content
4. Recent policy updates`;

  return researchWithPerplexity(query);
}

/**
 * Check content for copyright and plagiarism concerns
 * @param {string} content - The content to check
 */
export async function checkContentCompliance(content) {
  const query = `Analyze this content for potential copyright or plagiarism issues. Is it safe for commercial use?

Content: "${content}"

Check for:
1. Similarity to known copyrighted works
2. Trademark concerns
3. Commercial usage safety
4. Recommendations for safe usage`;

  return researchWithPerplexity(query);
}

/**
 * Get best practices for ad creative
 * @param {string} platform - Target platform
 * @param {string} objective - Campaign objective
 */
export async function getAdBestPractices(platform, objective) {
  const query = `What are the current best practices for creating ${platform} ads with ${objective} objective? Include:
1. Creative recommendations
2. Copy guidelines
3. Call-to-action best practices
4. Common mistakes to avoid`;

  return researchWithPerplexity(query);
}
