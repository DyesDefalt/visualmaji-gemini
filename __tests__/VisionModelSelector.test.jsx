'use client';

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import VisionModelSelector, { useVisionModelSelection, STORAGE_KEY } from '../components/VisionModelSelector';
import { VISION_MODELS, getAllModels, DEFAULT_MODEL } from '../lib/ai/vision-config';

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
  beforeEach(() => {
    localStorage.clear();
  });

  // Paid user tier generator
  const paidUserTierArb = fc.constantFrom('basic', 'pro');
  
  // Valid model ID generator
  const validModelIdArb = fc.constantFrom(...getAllModels().map(m => m.id));

  it('renders model selector for paid users (basic or pro tier)', () => {
    fc.assert(
      fc.property(
        paidUserTierArb,
        validModelIdArb,
        (userTier, selectedModel) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={selectedModel}
              onModelChange={mockOnModelChange}
              userTier={userTier}
              disabled={false}
            />
          );

          // Component should render (not return null)
          const selector = container.querySelector('.vision-model-selector');
          expect(selector).not.toBeNull();
          
          // Should have a select element
          const selectElement = container.querySelector('select');
          expect(selectElement).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('displays all models grouped by provider with optgroup elements', () => {
    fc.assert(
      fc.property(
        paidUserTierArb,
        (userTier) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={DEFAULT_MODEL}
              onModelChange={mockOnModelChange}
              userTier={userTier}
              disabled={false}
            />
          );

          // Check that all provider groups are rendered as optgroups
          const optgroups = container.querySelectorAll('optgroup');
          const providerKeys = Object.keys(VISION_MODELS);
          
          expect(optgroups.length).toBe(providerKeys.length);
          
          // Verify each provider group has correct label
          const optgroupLabels = Array.from(optgroups).map(og => og.getAttribute('label'));
          for (const key of providerKeys) {
            expect(optgroupLabels).toContain(VISION_MODELS[key].provider);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('displays all available models with name and free/paid indicator', () => {
    fc.assert(
      fc.property(
        paidUserTierArb,
        (userTier) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={DEFAULT_MODEL}
              onModelChange={mockOnModelChange}
              userTier={userTier}
              disabled={false}
            />
          );

          const allModels = getAllModels();
          const options = container.querySelectorAll('option');
          
          // Should have an option for each model
          expect(options.length).toBe(allModels.length);
          
          // Each model should be represented with name and tier indicator
          for (const model of allModels) {
            const option = container.querySelector(`option[value="${model.id}"]`);
            expect(option).not.toBeNull();
            
            // Option text should contain model name
            expect(option.textContent).toContain(model.name);
            
            // Option text should contain tier indicator (Free) or (Paid)
            const expectedTierIndicator = model.tier === 'free' ? '(Free)' : '(Paid)';
            expect(option.textContent).toContain(expectedTierIndicator);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each model option has correct value attribute matching model id', () => {
    fc.assert(
      fc.property(
        paidUserTierArb,
        validModelIdArb,
        (userTier, modelId) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={modelId}
              onModelChange={mockOnModelChange}
              userTier={userTier}
              disabled={false}
            />
          );

          // Find the option with the selected model id
          const option = container.querySelector(`option[value="${modelId}"]`);
          expect(option).not.toBeNull();
          expect(option.getAttribute('value')).toBe(modelId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('OpenRouter free models are clearly marked with (Free) indicator', () => {
    fc.assert(
      fc.property(
        paidUserTierArb,
        (userTier) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={DEFAULT_MODEL}
              onModelChange={mockOnModelChange}
              userTier={userTier}
              disabled={false}
            />
          );

          // Get all OpenRouter free models
          const openRouterFreeModels = VISION_MODELS.openrouter.models.filter(m => m.tier === 'free');
          
          // Each free model should have (Free) indicator
          for (const model of openRouterFreeModels) {
            const option = container.querySelector(`option[value="${model.id}"]`);
            expect(option).not.toBeNull();
            expect(option.textContent).toContain('(Free)');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('selected model is reflected in the select element value', () => {
    fc.assert(
      fc.property(
        paidUserTierArb,
        validModelIdArb,
        (userTier, selectedModel) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={selectedModel}
              onModelChange={mockOnModelChange}
              userTier={userTier}
              disabled={false}
            />
          );

          const selectElement = container.querySelector('select');
          expect(selectElement).not.toBeNull();
          expect(selectElement.value).toBe(selectedModel);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * **Feature: vision-ai-brand, Property 3: Free User Model Restriction**
 * 
 * *For any* free user, the model selector SHALL be hidden and all analysis requests 
 * SHALL use the default OpenRouter free model.
 * 
 * **Validates: Requirements 1.3**
 */
describe('Property 3: Free User Model Restriction', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Valid model ID generator
  const validModelIdArb = fc.constantFrom(...getAllModels().map(m => m.id));

  it('model selector is hidden (returns null) for free users', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        (selectedModel) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={selectedModel}
              onModelChange={mockOnModelChange}
              userTier="free"
              disabled={false}
            />
          );

          // Component should return null for free users - container should be empty
          const selector = container.querySelector('.vision-model-selector');
          expect(selector).toBeNull();
          
          // No select element should be rendered
          const selectElement = container.querySelector('select');
          expect(selectElement).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('free user tier always results in hidden selector regardless of other props', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        fc.boolean(), // disabled prop
        (selectedModel, disabled) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={selectedModel}
              onModelChange={mockOnModelChange}
              userTier="free"
              disabled={disabled}
            />
          );

          // Container should be empty regardless of other props
          expect(container.innerHTML).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('default model is used for free users (verified by component returning null)', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        (attemptedModel) => {
          const mockOnModelChange = () => {};
          
          const { container } = render(
            <VisionModelSelector
              selectedModel={attemptedModel}
              onModelChange={mockOnModelChange}
              userTier="free"
              disabled={false}
            />
          );

          // Free users cannot select models - selector is hidden
          // This ensures they use the default model (handled by the service layer)
          expect(container.querySelector('select')).toBeNull();
          
          // Verify DEFAULT_MODEL is the expected free model
          expect(DEFAULT_MODEL).toBe('google/gemma-3-27b-it:free');
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * **Feature: vision-ai-brand, Property 2: Model Selection Persistence**
 * 
 * *For any* valid model selection by a paid user, subsequent image analysis requests 
 * SHALL use the selected model ID.
 * 
 * **Validates: Requirements 1.2**
 */
describe('Property 2: Model Selection Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Valid model ID generator
  const validModelIdArb = fc.constantFrom(...getAllModels().map(m => m.id));

  it('selected model is persisted to localStorage when changed', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        (modelId) => {
          // Clear localStorage before each test
          localStorage.clear();
          
          // Render hook to test persistence
          const { result } = renderHook(() => useVisionModelSelection());
          
          // Change the model
          act(() => {
            result.current.onModelChange(modelId);
          });
          
          // Verify the model is persisted to localStorage
          const storedModel = localStorage.getItem(STORAGE_KEY);
          expect(storedModel).toBe(modelId);
          
          // Verify the hook state is updated
          expect(result.current.selectedModel).toBe(modelId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('persisted model is loaded from localStorage on mount', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        (modelId) => {
          // Clear and set localStorage before rendering
          localStorage.clear();
          localStorage.setItem(STORAGE_KEY, modelId);
          
          // Render hook - it should load the persisted model
          const { result } = renderHook(() => useVisionModelSelection());
          
          // Wait for effect to run (isLoaded becomes true)
          // The hook should have loaded the model from localStorage
          expect(result.current.selectedModel).toBe(modelId);
          expect(result.current.isLoaded).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('model selection round-trip: save then load produces same model', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        (modelId) => {
          // Clear localStorage
          localStorage.clear();
          
          // First hook instance - save the model
          const { result: saveResult, unmount } = renderHook(() => useVisionModelSelection());
          
          act(() => {
            saveResult.current.onModelChange(modelId);
          });
          
          // Unmount first hook
          unmount();
          
          // Second hook instance - should load the saved model
          const { result: loadResult } = renderHook(() => useVisionModelSelection());
          
          // Verify round-trip: saved model equals loaded model
          expect(loadResult.current.selectedModel).toBe(modelId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('selected model is passed to VisionModelSelector component correctly', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        fc.constantFrom('basic', 'pro'),
        (modelId, userTier) => {
          // Clear localStorage
          localStorage.clear();
          
          // Set up the hook
          const { result } = renderHook(() => useVisionModelSelection());
          
          // Change the model
          act(() => {
            result.current.onModelChange(modelId);
          });
          
          // Render the selector with the hook's values
          const { container } = render(
            <VisionModelSelector
              selectedModel={result.current.selectedModel}
              onModelChange={result.current.onModelChange}
              userTier={userTier}
              disabled={false}
            />
          );
          
          // Verify the select element has the correct value
          const selectElement = container.querySelector('select');
          expect(selectElement).not.toBeNull();
          expect(selectElement.value).toBe(modelId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('changing model via selector updates localStorage', () => {
    fc.assert(
      fc.property(
        validModelIdArb,
        validModelIdArb,
        fc.constantFrom('basic', 'pro'),
        (initialModel, newModel, userTier) => {
          // Clear localStorage
          localStorage.clear();
          
          // Track model changes
          let currentModel = initialModel;
          const handleModelChange = (modelId) => {
            currentModel = modelId;
            localStorage.setItem(STORAGE_KEY, modelId);
          };
          
          // Render the selector
          const { container } = render(
            <VisionModelSelector
              selectedModel={currentModel}
              onModelChange={handleModelChange}
              userTier={userTier}
              disabled={false}
            />
          );
          
          // Simulate changing the model via the select element
          const selectElement = container.querySelector('select');
          fireEvent.change(selectElement, { target: { value: newModel } });
          
          // Verify localStorage is updated
          const storedModel = localStorage.getItem(STORAGE_KEY);
          expect(storedModel).toBe(newModel);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('default model is used when no model is persisted', () => {
    // Clear localStorage
    localStorage.clear();
    
    // Render hook without any persisted model
    const { result } = renderHook(() => useVisionModelSelection());
    
    // Should use DEFAULT_MODEL when nothing is persisted
    expect(result.current.selectedModel).toBe(DEFAULT_MODEL);
  });
});
