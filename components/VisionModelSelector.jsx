'use client';

import React, { useState, useEffect } from 'react';
import { VISION_MODELS, DEFAULT_MODEL } from '../lib/ai/vision-config';

const STORAGE_KEY = 'vima_selected_vision_model';

/**
 * VisionModelSelector Component
 * 
 * Renders a grouped dropdown for selecting vision AI models.
 * Only visible to paid users (basic, pro tiers).
 * Free users see nothing (returns null).
 * 
 * Requirements: 1.1, 1.3, 1.4, 1.6
 */
export default function VisionModelSelector({
  selectedModel,
  onModelChange,
  userTier = 'free',
  disabled = false
}) {
  // Return null for free users - they use default model automatically
  // Requirement 1.3: Hide model selector for free users
  if (userTier === 'free') {
    return null;
  }

  return (
    <div className="vision-model-selector">
      <label 
        htmlFor="vision-model-select" 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Vision Model
      </label>
      <select
        id="vision-model-select"
        value={selectedModel || DEFAULT_MODEL}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {/* Requirement 1.1, 1.4: Display models grouped by provider */}
        {Object.entries(VISION_MODELS).map(([key, group]) => (
          <optgroup key={key} label={group.provider}>
            {group.models.map((model) => (
              <option key={model.id} value={model.id}>
                {/* Requirement 1.4, 1.6: Show model name and free/paid indicator */}
                {model.name} {model.tier === 'free' ? '(Free)' : '(Paid)'}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

/**
 * Hook for managing vision model selection with localStorage persistence
 * 
 * Requirements: 1.2
 */
export function useVisionModelSelection() {
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved selection on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelectedModel(saved);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save selection to localStorage
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, modelId);
    }
  };

  return {
    selectedModel,
    onModelChange: handleModelChange,
    isLoaded
  };
}

// Export storage key for testing
export { STORAGE_KEY };
