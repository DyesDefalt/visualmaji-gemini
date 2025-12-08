/**
 * OpenRouter AI Service - Free tier for all users
 */
import { env, isProviderConfigured } from '../env.js';

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

/**
 * Generate content using OpenRouter API
 * @param {string} prompt - The prompt to send
 * @param {object} options - Optional configuration
 * @returns {Promise<{ success: boolean, text?: string, error?: string }>}
 */
export async function generateWithOpenRouter(prompt, options = {}) {
  if (!isProviderConfigured('openrouter')) {
    return { success: false, error: 'OpenRouter API is not configured' };
  }

  const model = options.model || env.openrouter.model;

  try {
    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.openrouter.apiKey}`,
        'HTTP-Referer': options.referer || 'http://localhost:3000',
        'X-Title': options.title || 'Visual Maji',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1024,
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
 * Check OpenRouter status
 */
export async function checkOpenRouterStatus() {
  if (!isProviderConfigured('openrouter')) {
    return { available: false, model: '', error: 'Not configured' };
  }

  const result = await generateWithOpenRouter('Say "OK"', { maxTokens: 10 });
  return {
    available: result.success,
    model: env.openrouter.model,
    error: result.error,
  };
}
