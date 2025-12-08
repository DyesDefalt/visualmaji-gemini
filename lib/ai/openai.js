/**
 * OpenAI Service - Premium tier with usage limits
 */
import { env, isProviderConfigured } from '../env.js';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

/**
 * Generate content using OpenAI API
 * @param {string} prompt - The prompt to send
 * @param {object} options - Optional configuration
 * @returns {Promise<{ success: boolean, text?: string, error?: string }>}
 */
export async function generateWithOpenAI(prompt, options = {}) {
  if (!isProviderConfigured('openai')) {
    return { success: false, error: 'OpenAI API is not configured' };
  }

  const model = options.model || env.openai.model;

  try {
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.openai.apiKey}`,
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
 * Check OpenAI status
 */
export async function checkOpenAIStatus() {
  if (!isProviderConfigured('openai')) {
    return { available: false, model: '', error: 'Not configured' };
  }

  // Don't waste API calls on status check for premium providers
  return {
    available: true,
    model: env.openai.model,
    configured: true,
  };
}
