/**
 * Gemini AI Service
 */
import { env, isProviderConfigured } from '../env.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Generate content using Gemini API
 * @param {string} prompt - The prompt to send
 * @param {object} options - Optional configuration
 * @returns {Promise<{ success: boolean, text?: string, error?: string }>}
 */
export async function generateWithGemini(prompt, options = {}) {
  if (!isProviderConfigured('gemini')) {
    return { success: false, error: 'Gemini API is not configured' };
  }

  const model = options.model || env.gemini.model;
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${env.gemini.apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 1024,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'API request failed' };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return { success: true, text };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if Gemini is available and working
 * @returns {Promise<{ available: boolean, model: string, error?: string }>}
 */
export async function checkGeminiStatus() {
  if (!isProviderConfigured('gemini')) {
    return { available: false, model: '', error: 'Not configured' };
  }

  const result = await generateWithGemini('Say "OK" if you can hear me.', {
    maxTokens: 10,
  });

  return {
    available: result.success,
    model: env.gemini.model,
    error: result.error,
  };
}
