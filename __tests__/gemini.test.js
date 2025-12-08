import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Gemini AI Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should return error when not configured', async () => {
    process.env.GEMINI_API_KEY = '';
    const { generateWithGemini } = await import('../lib/ai/gemini.js');
    
    const result = await generateWithGemini('Hello');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Gemini API is not configured');
  });

  it('should return error for placeholder API key', async () => {
    process.env.GEMINI_API_KEY = '[YOUR_GEMINI_API_KEY]';
    const { generateWithGemini } = await import('../lib/ai/gemini.js');
    
    const result = await generateWithGemini('Hello');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Gemini API is not configured');
  });

  it('should use default model when not specified', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    delete process.env.GEMINI_MODEL;
    
    const { env } = await import('../lib/env.js');
    expect(env.gemini.model).toBe('gemini-2.5-flash');
  });

  it('should handle API errors gracefully', async () => {
    process.env.GEMINI_API_KEY = 'invalid-key';
    process.env.GEMINI_MODEL = 'gemini-2.5-flash';
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
    });

    const { generateWithGemini } = await import('../lib/ai/gemini.js');
    const result = await generateWithGemini('Hello');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid API key');
  });

  it('should parse successful response correctly', async () => {
    process.env.GEMINI_API_KEY = 'valid-key';
    process.env.GEMINI_MODEL = 'gemini-2.5-flash';
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        candidates: [{
          content: {
            parts: [{ text: 'Hello! How can I help you?' }]
          }
        }]
      }),
    });

    const { generateWithGemini } = await import('../lib/ai/gemini.js');
    const result = await generateWithGemini('Hello');
    
    expect(result.success).toBe(true);
    expect(result.text).toBe('Hello! How can I help you?');
  });

  it('should handle network errors', async () => {
    process.env.GEMINI_API_KEY = 'valid-key';
    process.env.GEMINI_MODEL = 'gemini-2.5-flash';
    
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { generateWithGemini } = await import('../lib/ai/gemini.js');
    const result = await generateWithGemini('Hello');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });
});
