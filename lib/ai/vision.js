/**
 * Vision AI Service
 * 
 * Analyzes images using selectable vision AI models with provider routing.
 * Supports Gemini, OpenAI, OpenRouter, and Perplexity vision models.
 * Includes brand-adjusted output generation for paid users.
 */
import { env, isProviderConfigured } from '../env.js';
import { DEFAULT_MODEL, getProviderKeyFromModelId } from './vision-config.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const OPENAI_API_BASE = 'https://api.openai.com/v1';
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';
const PERPLEXITY_API_BASE = 'https://api.perplexity.ai';

/**
 * Build the vision analysis prompt
 */
function buildAnalysisPrompt() {
  return `Analyze this image and provide a detailed description including:
1. Subject: What is the main subject of the image?
2. Medium: What type of image is this (photo, illustration, 3D render, etc.)?
3. Lighting: Describe the lighting conditions
4. Composition: How is the image composed?
5. Style: What artistic style does this represent?
6. Color Palette: List the dominant colors (as hex codes if possible)
7. Prompt: Generate a detailed prompt that could recreate this image

Respond in JSON format:
{
  "subject": "",
  "medium": "",
  "lighting": "",
  "composition": "",
  "style": "",
  "colorPalette": [],
  "prompt": ""
}`;
}

/**
 * Build brand-adjusted prompt incorporating user's brand profile
 * @param {object} analysisResult - The original analysis result
 * @param {object} brandProfile - User's brand profile
 * @returns {string} Brand-adjusted prompt
 */
function buildBrandAdjustedPrompt(analysisResult, brandProfile) {
  if (!brandProfile || !analysisResult.prompt) {
    return null;
  }

  const { colorPalette, fonts } = brandProfile;
  
  let brandPrompt = analysisResult.prompt;
  
  // Incorporate brand colors
  if (colorPalette && colorPalette.length > 0) {
    const colorList = colorPalette.join(', ');
    brandPrompt += `\n\nBrand Color Adjustments: Use the following brand color palette: ${colorList}. `;
    brandPrompt += `Primary brand color: ${colorPalette[0]}. `;
    if (colorPalette.length > 1) {
      brandPrompt += `Secondary colors: ${colorPalette.slice(1).join(', ')}.`;
    }
  }
  
  // Incorporate typography recommendations
  if (fonts) {
    brandPrompt += `\n\nTypography Recommendations: `;
    if (fonts.primary) {
      brandPrompt += `Use ${fonts.primary} as the primary font for headlines and key text. `;
    }
    if (fonts.secondary) {
      brandPrompt += `Use ${fonts.secondary} as the secondary font for body text and supporting elements.`;
    }
  }
  
  return brandPrompt;
}

/**
 * Analyze image with Gemini Vision
 */
async function analyzeWithGemini(imageData, modelId, options = {}) {
  if (!isProviderConfigured('gemini')) {
    return { success: false, error: 'Gemini API is not configured' };
  }

  const model = modelId || env.gemini.model;
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${env.gemini.apiKey}`;

  try {
    // Extract base64 data and mime type from data URL
    const matches = imageData.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return { success: false, error: 'Invalid image data format' };
    }
    const [, mimeType, base64Data] = matches;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: buildAnalysisPrompt() },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }],
        generationConfig: {
          temperature: options.temperature ?? 0.4,
          maxOutputTokens: options.maxTokens ?? 2048,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Gemini API request failed' };
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return { success: true, text, model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Analyze image with OpenAI Vision
 */
async function analyzeWithOpenAI(imageData, modelId, options = {}) {
  if (!isProviderConfigured('openai')) {
    return { success: false, error: 'OpenAI API is not configured' };
  }

  const model = modelId || env.openai.model;

  try {
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.openai.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: buildAnalysisPrompt() },
            {
              type: 'image_url',
              image_url: { url: imageData }
            }
          ]
        }],
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'OpenAI API request failed' };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    return { success: true, text, model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Analyze image with OpenRouter Vision
 */
async function analyzeWithOpenRouter(imageData, modelId, options = {}) {
  if (!isProviderConfigured('openrouter')) {
    return { success: false, error: 'OpenRouter API is not configured' };
  }

  const model = modelId || env.openrouter.model;

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
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: buildAnalysisPrompt() },
            {
              type: 'image_url',
              image_url: { url: imageData }
            }
          ]
        }],
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'OpenRouter API request failed' };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    return { success: true, text, model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Analyze image with Perplexity Vision
 */
async function analyzeWithPerplexity(imageData, modelId, options = {}) {
  if (!isProviderConfigured('perplexity')) {
    return { success: false, error: 'Perplexity API is not configured' };
  }

  const model = modelId || env.perplexity.model;

  try {
    const response = await fetch(`${PERPLEXITY_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.perplexity.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: buildAnalysisPrompt() },
            {
              type: 'image_url',
              image_url: { url: imageData }
            }
          ]
        }],
        temperature: options.temperature ?? 0.4,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error?.message || 'Perplexity API request failed' };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    return { success: true, text, model };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Parse analysis response text to structured result
 */
function parseAnalysisResponse(text) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // If no JSON found, return raw text as prompt
    return {
      subject: '',
      medium: '',
      lighting: '',
      composition: '',
      style: '',
      colorPalette: [],
      prompt: text
    };
  } catch {
    return {
      subject: '',
      medium: '',
      lighting: '',
      composition: '',
      style: '',
      colorPalette: [],
      prompt: text
    };
  }
}

/**
 * Route analysis to appropriate provider based on model ID
 */
async function routeToProvider(imageData, modelId, options) {
  const providerKey = getProviderKeyFromModelId(modelId);
  
  switch (providerKey) {
    case 'gemini':
      return analyzeWithGemini(imageData, modelId, options);
    case 'openai':
      return analyzeWithOpenAI(imageData, modelId, options);
    case 'openrouter':
      return analyzeWithOpenRouter(imageData, modelId, options);
    case 'perplexity':
      return analyzeWithPerplexity(imageData, modelId, options);
    default:
      // Unknown model, try OpenRouter as default
      return analyzeWithOpenRouter(imageData, modelId, options);
  }
}


/**
 * Analyze an image using the specified vision model
 * 
 * @param {string} imageData - Base64 encoded image data (data URL format)
 * @param {object} options - Analysis options
 * @param {string} options.modelId - Vision model ID to use
 * @param {string} options.userId - User ID for tracking
 * @param {string} options.userTier - User tier (free, basic, pro)
 * @param {object} [options.brandProfile] - Optional brand profile for adjusted output
 * @returns {Promise<object>} Analysis result with optional brand adjustments
 */
export async function analyzeImage(imageData, options = {}) {
  const {
    modelId = DEFAULT_MODEL,
    // eslint-disable-next-line no-unused-vars
    userId = 'anonymous',
    // eslint-disable-next-line no-unused-vars
    userTier = 'free',
    brandProfile = null,
    ...restOptions
  } = options;

  let result;
  let usedModel = modelId;
  let fallbackOccurred = false;
  let fallbackReason = null;

  // Try the requested model first
  try {
    result = await routeToProvider(imageData, modelId, restOptions);
  } catch (error) {
    result = { success: false, error: error.message };
  }

  // If the requested model failed, fall back to default model
  if (!result.success && modelId !== DEFAULT_MODEL) {
    fallbackOccurred = true;
    fallbackReason = result.error || 'Model unavailable';
    usedModel = DEFAULT_MODEL;

    try {
      result = await routeToProvider(imageData, DEFAULT_MODEL, restOptions);
    } catch (error) {
      result = { success: false, error: error.message };
    }
  }

  // If still failed, return error
  if (!result.success) {
    return {
      success: false,
      error: result.error || 'Vision analysis failed',
      fallbackOccurred,
      fallbackReason
    };
  }

  // Parse the response
  const analysisResult = parseAnalysisResponse(result.text);

  // Build response object
  const response = {
    success: true,
    model: usedModel,
    provider: getProviderKeyFromModelId(usedModel),
    ...analysisResult
  };

  // Add fallback notification if it occurred
  if (fallbackOccurred) {
    response.fallbackOccurred = true;
    response.fallbackReason = fallbackReason;
    response.originalModel = modelId;
    response.notification = `The selected model (${modelId}) was unavailable. Analysis was performed using the default model (${DEFAULT_MODEL}).`;
  }

  // Generate brand-adjusted output if brand profile is provided
  if (brandProfile) {
    const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
    if (brandAdjustedPrompt) {
      response.brandAdjustedPrompt = brandAdjustedPrompt;
    }
  }

  return response;
}

/**
 * Check if a vision model is available
 * @param {string} modelId - Model ID to check
 * @returns {Promise<boolean>} Whether the model is available
 */
export async function isModelAvailable(modelId) {
  const providerKey = getProviderKeyFromModelId(modelId);
  if (!providerKey) return false;
  return isProviderConfigured(providerKey);
}

/**
 * Get the default vision model
 * @returns {string} Default model ID
 */
export function getDefaultModel() {
  return DEFAULT_MODEL;
}

// Export for testing
export {
  buildAnalysisPrompt,
  buildBrandAdjustedPrompt,
  parseAnalysisResponse,
  routeToProvider,
  analyzeWithGemini,
  analyzeWithOpenAI,
  analyzeWithOpenRouter,
  analyzeWithPerplexity
};
