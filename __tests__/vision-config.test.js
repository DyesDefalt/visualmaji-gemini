import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  VISION_MODELS, 
  DEFAULT_MODEL, 
  getAllModels, 
  getModelById,
  getProviderKeyFromModelId 
} from '../lib/ai/vision-config.js';

describe('Vision Model Configuration', () => {
  /**
   * **Feature: vision-ai-brand, Property 1: Model Selector Display for Paid Users**
   * 
   * *For any* paid user (basic or pro tier), the model selector component SHALL render 
   * with all available models grouped by provider, where each model displays its name, 
   * provider, and free/paid indicator.
   * 
   * **Validates: Requirements 1.1, 1.4, 1.6**
   */
  describe('Property 1: Model Selector Display for Paid Users', () => {
    it('all models have required fields (id, name, tier)', () => {
      const allModels = getAllModels();
      
      fc.assert(
        fc.property(
          fc.constantFrom(...allModels),
          (model) => {
            // Each model must have id, name, and tier
            expect(model).toHaveProperty('id');
            expect(model).toHaveProperty('name');
            expect(model).toHaveProperty('tier');
            expect(model).toHaveProperty('provider');
            
            // id and name must be non-empty strings
            expect(typeof model.id).toBe('string');
            expect(model.id.length).toBeGreaterThan(0);
            expect(typeof model.name).toBe('string');
            expect(model.name.length).toBeGreaterThan(0);
            
            // tier must be 'free' or 'paid'
            expect(['free', 'paid']).toContain(model.tier);
            
            // provider must be non-empty string
            expect(typeof model.provider).toBe('string');
            expect(model.provider.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('provider grouping is correct - each provider key maps to correct provider name', () => {
      const providerKeys = Object.keys(VISION_MODELS);
      
      fc.assert(
        fc.property(
          fc.constantFrom(...providerKeys),
          (providerKey) => {
            const group = VISION_MODELS[providerKey];
            
            // Each group must have provider name and models array
            expect(group).toHaveProperty('provider');
            expect(group).toHaveProperty('models');
            expect(Array.isArray(group.models)).toBe(true);
            expect(group.models.length).toBeGreaterThan(0);
            
            // Provider name should be a capitalized version or known mapping
            const expectedProviders = {
              gemini: 'Gemini',
              openai: 'OpenAI',
              openrouter: 'OpenRouter',
              perplexity: 'Perplexity'
            };
            expect(group.provider).toBe(expectedProviders[providerKey]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('OpenRouter free models are correctly marked with :free suffix', () => {
      const openRouterModels = VISION_MODELS.openrouter.models;
      const freeModels = openRouterModels.filter(m => m.tier === 'free');
      
      fc.assert(
        fc.property(
          fc.constantFrom(...freeModels),
          (model) => {
            // Free OpenRouter models should have :free suffix in their ID
            expect(model.id).toMatch(/:free$|grok/);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('getModelById returns correct model with provider info', () => {
      const allModels = getAllModels();
      
      fc.assert(
        fc.property(
          fc.constantFrom(...allModels),
          (originalModel) => {
            const retrieved = getModelById(originalModel.id);
            
            expect(retrieved).not.toBeNull();
            expect(retrieved.id).toBe(originalModel.id);
            expect(retrieved.name).toBe(originalModel.name);
            expect(retrieved.tier).toBe(originalModel.tier);
            expect(retrieved.provider).toBe(originalModel.provider);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('getProviderKeyFromModelId returns correct provider key', () => {
      const allModels = getAllModels();
      const providerNameToKey = {
        'Gemini': 'gemini',
        'OpenAI': 'openai',
        'OpenRouter': 'openrouter',
        'Perplexity': 'perplexity'
      };
      
      fc.assert(
        fc.property(
          fc.constantFrom(...allModels),
          (model) => {
            const providerKey = getProviderKeyFromModelId(model.id);
            const expectedKey = providerNameToKey[model.provider];
            
            expect(providerKey).toBe(expectedKey);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('DEFAULT_MODEL configuration', () => {
    it('DEFAULT_MODEL is a valid free model', () => {
      const model = getModelById(DEFAULT_MODEL);
      
      expect(model).not.toBeNull();
      expect(model.tier).toBe('free');
    });

    it('DEFAULT_MODEL exists in OpenRouter free models', () => {
      const openRouterFreeModels = VISION_MODELS.openrouter.models
        .filter(m => m.tier === 'free')
        .map(m => m.id);
      
      expect(openRouterFreeModels).toContain(DEFAULT_MODEL);
    });
  });
});
