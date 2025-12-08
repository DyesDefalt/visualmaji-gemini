/**
 * Environment variable configuration and validation
 */

export const env = {
  // AI Providers
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o',
  },
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY,
    model: process.env.PERPLEXITY_MODEL || 'sonar',
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'google/gemma-3-27b-it:free',
  },
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
  },
};

/**
 * Validates that required environment variables are set
 * @param {string[]} required - Array of required env var paths (e.g., ['supabase.url'])
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateEnv(required = []) {
  const missing = [];
  
  for (const path of required) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], env);
    if (!value || value.startsWith('[YOUR_')) {
      missing.push(path);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Check if a specific provider is configured
 * @param {'gemini' | 'openai' | 'perplexity' | 'openrouter' | 'supabase'} provider
 */
export function isProviderConfigured(provider) {
  const config = env[provider];
  if (!config) return false;
  
  if (provider === 'supabase') {
    return config.url && config.anonKey && 
           !config.url.startsWith('[YOUR_') && 
           !config.anonKey.startsWith('[YOUR_');
  }
  
  return config.apiKey && !config.apiKey.startsWith('[YOUR_');
}
