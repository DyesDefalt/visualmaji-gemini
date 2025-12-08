import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('AI Provider Services', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('OpenRouter Service', () => {
    it('should return error when not configured', async () => {
      process.env.OPENROUTER_API_KEY = '';
      const { generateWithOpenRouter } = await import('../lib/ai/openrouter.js');
      
      const result = await generateWithOpenRouter('Hello');
      expect(result.success).toBe(false);
      expect(result.error).toBe('OpenRouter API is not configured');
    });

    it('should make correct API call when configured', async () => {
      process.env.OPENROUTER_API_KEY = 'test-key';
      process.env.OPENROUTER_MODEL = 'google/gemma-3-27b-it:free';
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Hello there!' } }]
        }),
      });

      const { generateWithOpenRouter } = await import('../lib/ai/openrouter.js');
      const result = await generateWithOpenRouter('Hello');
      
      expect(result.success).toBe(true);
      expect(result.text).toBe('Hello there!');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
          }),
        })
      );
    });
  });

  describe('OpenAI Service', () => {
    it('should return error when not configured', async () => {
      process.env.OPENAI_API_KEY = '';
      const { generateWithOpenAI } = await import('../lib/ai/openai.js');
      
      const result = await generateWithOpenAI('Hello');
      expect(result.success).toBe(false);
      expect(result.error).toBe('OpenAI API is not configured');
    });

    it('should parse successful response', async () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.OPENAI_MODEL = 'gpt-4o';
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'AI response' } }]
        }),
      });

      const { generateWithOpenAI } = await import('../lib/ai/openai.js');
      const result = await generateWithOpenAI('Hello');
      
      expect(result.success).toBe(true);
      expect(result.text).toBe('AI response');
    });
  });

  describe('Perplexity Service', () => {
    it('should return error when not configured', async () => {
      process.env.PERPLEXITY_API_KEY = '';
      const { researchWithPerplexity } = await import('../lib/ai/perplexity.js');
      
      const result = await researchWithPerplexity('Research query');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Perplexity API is not configured');
    });

    it('should use lower temperature for research', async () => {
      process.env.PERPLEXITY_API_KEY = 'test-key';
      process.env.PERPLEXITY_MODEL = 'sonar';
      
      let capturedBody;
      global.fetch = vi.fn().mockImplementation((url, options) => {
        capturedBody = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            choices: [{ message: { content: 'Research results' } }]
          }),
        });
      });

      const { researchWithPerplexity } = await import('../lib/ai/perplexity.js');
      await researchWithPerplexity('Research query');
      
      expect(capturedBody.temperature).toBe(0.2);
    });

    it('should have helper functions for specific research types', async () => {
      const { 
        checkPlatformGuidelines, 
        checkContentCompliance, 
        getAdBestPractices 
      } = await import('../lib/ai/perplexity.js');
      
      expect(typeof checkPlatformGuidelines).toBe('function');
      expect(typeof checkContentCompliance).toBe('function');
      expect(typeof getAdBestPractices).toBe('function');
    });
  });
});
