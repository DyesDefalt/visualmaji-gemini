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
  // Paid tiers include: basic, pro, creator, business
  const paidTiers = ['basic', 'pro', 'creator', 'business'];
  if (!paidTiers.includes(userTier)) {
    return null;
  }

  return (
    <div className="vision-model-selector">
      <select
        id="vision-model-select"
        value={selectedModel || DEFAULT_MODEL}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="block w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Requirement 1.1, 1.4: Display models grouped by provider */}
        {Object.entries(VISION_MODELS).map(([key, group]) => (
          <optgroup key={key} label={group.provider} className="bg-stone-900 text-white">
            {group.models.map((model) => (
              <option key={model.id} value={model.id} className="bg-stone-800 text-white">
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
