/**
 * Vision AI Model Configuration
 * 
 * Defines available vision models grouped by provider with tier information.
 * Used by the Vision Model Selector component for paid users.
 */

export const VISION_MODELS = {
  gemini: {
    provider: 'Gemini',
    models: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tier: 'paid' },
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', tier: 'paid' }
    ]
  },
  openai: {
    provider: 'OpenAI',
    models: [
      { id: 'gpt-5-nano', name: 'GPT-5 Nano', tier: 'paid' },
      { id: 'gpt-5-mini', name: 'GPT-5 Mini', tier: 'paid' },
      { id: 'gpt-5.1', name: 'GPT-5.1', tier: 'paid' }
    ]
  },
  openrouter: {
    provider: 'OpenRouter',
    models: [
      { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', tier: 'free' },
      { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', tier: 'free' },
      { id: 'qwen/qwen2.5-vl-32b-instruct:free', name: 'Qwen 2.5 VL 32B', tier: 'free' },
      { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small 3.2', tier: 'free' },
      { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B VL', tier: 'free' },
      { id: 'x-ai/grok-4.1-fast', name: 'Grok 4.1 Fast', tier: 'free' }
    ]
  },
  perplexity: {
    provider: 'Perplexity',
    models: [
      { id: 'sonar', name: 'Sonar', tier: 'paid' }
    ]
  }
};

export const DEFAULT_MODEL = 'google/gemma-3-27b-it:free';

/**
 * Get all models as a flat array
 */
export function getAllModels() {
  return Object.values(VISION_MODELS).flatMap(group => 
    group.models.map(model => ({
      ...model,
      provider: group.provider
    }))
  );
}

/**
 * Get a model by its ID
 */
export function getModelById(modelId) {
  for (const group of Object.values(VISION_MODELS)) {
    const model = group.models.find(m => m.id === modelId);
    if (model) {
      return { ...model, provider: group.provider };
    }
  }
  return null;
}

/**
 * Get all free models
 */
export function getFreeModels() {
  return getAllModels().filter(model => model.tier === 'free');
}

/**
 * Get provider key from model ID
 */
export function getProviderKeyFromModelId(modelId) {
  for (const [key, group] of Object.entries(VISION_MODELS)) {
    if (group.models.some(m => m.id === modelId)) {
      return key;
    }
  }
  return null;
}
