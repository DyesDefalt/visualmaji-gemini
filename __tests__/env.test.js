import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should load env module without errors', async () => {
    const { env } = await import('../lib/env.js');
    expect(env).toBeDefined();
    expect(env.gemini).toBeDefined();
    expect(env.supabase).toBeDefined();
  });

  it('should validate missing environment variables', async () => {
    process.env.GEMINI_API_KEY = '';
    const { validateEnv } = await import('../lib/env.js');
    
    const result = validateEnv(['gemini.apiKey']);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('gemini.apiKey');
  });

  it('should detect placeholder values as unconfigured', async () => {
    process.env.OPENAI_API_KEY = '[YOUR_OPENAI_API_KEY]';
    const { isProviderConfigured } = await import('../lib/env.js');
    
    const configured = isProviderConfigured('openai');
    expect(configured).toBe(false);
  });

  it('should detect configured providers', async () => {
    process.env.GEMINI_API_KEY = 'real-api-key-here';
    const { isProviderConfigured } = await import('../lib/env.js');
    
    const configured = isProviderConfigured('gemini');
    expect(configured).toBe(true);
  });

  it('should use default model values when not specified', async () => {
    delete process.env.GEMINI_MODEL;
    const { env } = await import('../lib/env.js');
    
    expect(env.gemini.model).toBe('gemini-2.5-flash');
  });
});
