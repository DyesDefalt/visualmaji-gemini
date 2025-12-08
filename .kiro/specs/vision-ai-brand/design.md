# Design Document: Vision AI with Brand Customization

## Overview

This design describes the Vision AI feature that enables paid users to analyze images using selectable vision AI models and apply Visual Brand customization to generated outputs. The system integrates with multiple AI providers (Gemini, OpenAI, OpenRouter, Perplexity) for vision capabilities and provides a brand profile management system that automatically adjusts AI-generated prompts to match user brand identity.

Key capabilities:
- Vision model selector dropdown for paid users (grouped by provider)
- Visual Brand Profile configuration (logo, colors, fonts)
- Brand-adjusted output generation
- Usage tracking per vision model
- Brand profile export/import (JSON serialization)

## Architecture

```mermaid
graph TB
    subgraph "Frontend (React/Next.js)"
        Dashboard[Dashboard Page]
        ModelSelector[Vision Model Selector]
        BrandSettings[Brand Settings Panel]
        BrandPreview[Brand Preview Component]
    end
    
    subgraph "API Routes"
        VisionAPI[/api/ai/vision]
        BrandAPI[/api/brand]
    end
    
    subgraph "Services"
        VisionService[Vision AI Service]
        BrandService[Brand Profile Service]
        UsageService[Usage Tracking Service]
    end
    
    subgraph "AI Providers"
        Gemini[Gemini Vision]
        OpenAI[OpenAI Vision]
        OpenRouter[OpenRouter Vision]
        Perplexity[Perplexity]
    end
    
    subgraph "Storage"
        LocalStorage[Browser LocalStorage]
    end
    
    Dashboard --> ModelSelector
    Dashboard --> BrandSettings
    BrandSettings --> BrandPreview
    
    ModelSelector --> VisionAPI
    BrandSettings --> BrandAPI
    
    VisionAPI --> VisionService
    VisionAPI --> UsageService
    BrandAPI --> BrandService
    
    VisionService --> Gemini
    VisionService --> OpenAI
    VisionService --> OpenRouter
    VisionService --> Perplexity
    
    BrandService --> LocalStorage
```

## Components and Interfaces

### 1. Vision Model Configuration (`lib/ai/vision-config.js`)

```javascript
// Vision model definitions with provider grouping
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
```

### 2. Vision Model Selector Component (`components/VisionModelSelector.jsx`)

```typescript
interface VisionModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  userTier: 'free' | 'basic' | 'pro';
  disabled?: boolean;
}
```

- Renders grouped dropdown with provider sections
- Shows free/paid badges per model
- Hidden for free users (returns null)
- Persists selection to localStorage

### 3. Brand Profile Interface (`lib/brand/types.js`)

```typescript
interface BrandProfile {
  id: string;
  name: string;
  logo?: {
    url: string;
    extractedColors: string[];
  };
  colorPalette: string[];  // 2-6 hex colors
  fonts: {
    primary: string;
    secondary: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### 4. Brand Settings Component (`components/BrandSettings.jsx`)

```typescript
interface BrandSettingsProps {
  profile: BrandProfile | null;
  onSave: (profile: BrandProfile) => void;
  onExport: () => void;
  onImport: (json: string) => void;
  isPaidUser: boolean;
}
```

- Logo upload with color extraction
- Color palette picker (2-6 colors validation)
- Font selector (primary/secondary)
- Live preview panel
- Export/Import buttons

### 5. Vision AI Service (`lib/ai/vision.js`)

```typescript
interface VisionAnalysisOptions {
  modelId: string;
  userId: string;
  userTier: string;
  brandProfile?: BrandProfile;
}

interface AnalysisResult {
  subject: string;
  medium: string;
  lighting: string;
  composition: string;
  style: string;
  colorPalette: string[];
  prompt: string;
  brandAdjustedPrompt?: string;
}

async function analyzeImage(
  imageData: string,
  options: VisionAnalysisOptions
): Promise<AnalysisResult>
```

### 6. Brand Profile Service (`lib/brand/service.js`)

```typescript
// Core functions
function saveBrandProfile(userId: string, profile: BrandProfile): void
function loadBrandProfile(userId: string): BrandProfile | null
function deleteBrandProfile(userId: string): void

// Serialization
function serializeBrandProfile(profile: BrandProfile): string
function deserializeBrandProfile(json: string): BrandProfile

// Validation
function validateBrandProfile(profile: unknown): ValidationResult
function validateColorPalette(colors: string[]): boolean
```

### 7. API Routes

#### `/api/ai/vision/route.js`
- POST: Analyze image with selected vision model
- Validates user tier and usage limits
- Applies brand adjustments if profile exists

#### `/api/brand/route.js`
- GET: Retrieve user's brand profile
- POST: Save brand profile
- DELETE: Remove brand profile

## Data Models

### Brand Profile Schema

```javascript
const BrandProfileSchema = {
  id: { type: 'string', required: true },
  name: { type: 'string', required: true, maxLength: 100 },
  logo: {
    type: 'object',
    required: false,
    properties: {
      url: { type: 'string', format: 'data-url' },
      extractedColors: { type: 'array', items: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' } }
    }
  },
  colorPalette: {
    type: 'array',
    required: true,
    minItems: 2,
    maxItems: 6,
    items: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' }
  },
  fonts: {
    type: 'object',
    required: true,
    properties: {
      primary: { type: 'string', required: true },
      secondary: { type: 'string', required: true }
    }
  },
  createdAt: { type: 'string', format: 'iso-date' },
  updatedAt: { type: 'string', format: 'iso-date' }
};
```

### Vision Usage Record

```javascript
const VisionUsageSchema = {
  userId: { type: 'string', required: true },
  modelId: { type: 'string', required: true },
  provider: { type: 'string', enum: ['gemini', 'openai', 'openrouter', 'perplexity'] },
  timestamp: { type: 'string', format: 'iso-date' },
  dailyCount: { type: 'number' },
  monthlyCount: { type: 'number' }
};
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Model Selector Display for Paid Users
*For any* paid user (basic or pro tier), the model selector component SHALL render with all available models grouped by provider, where each model displays its name, provider, and free/paid indicator.
**Validates: Requirements 1.1, 1.4, 1.6**

### Property 2: Model Selection Persistence
*For any* valid model selection by a paid user, subsequent image analysis requests SHALL use the selected model ID.
**Validates: Requirements 1.2**

### Property 3: Free User Model Restriction
*For any* free user, the model selector SHALL be hidden and all analysis requests SHALL use the default OpenRouter free model.
**Validates: Requirements 1.3**

### Property 4: Model Fallback on Failure
*For any* vision model that becomes unavailable during analysis, the system SHALL fall back to the default model and the response SHALL include a notification about the fallback.
**Validates: Requirements 1.5**

### Property 5: Color Palette Validation
*For any* color palette input, validation SHALL accept arrays with 2-6 valid hex colors and reject arrays with fewer than 2 or more than 6 colors.
**Validates: Requirements 2.3**

### Property 6: Brand Profile Persistence Round-Trip
*For any* valid brand profile that is saved, loading the profile SHALL return an equivalent profile with all fields preserved.
**Validates: Requirements 2.6**

### Property 7: Brand-Adjusted Output Generation
*For any* paid user with a configured brand profile, image analysis SHALL produce a Brand_Adjusted_Output that incorporates the user's color palette and font preferences into the generated prompt.
**Validates: Requirements 3.1, 3.2, 3.3**

### Property 8: No Brand Adjustment Without Profile
*For any* paid user without a configured brand profile, image analysis SHALL produce standard output without brand adjustments (brandAdjustedPrompt field is undefined or null).
**Validates: Requirements 3.5**

### Property 9: Preview Color Swatches Match Palette
*For any* brand profile configuration, the preview component SHALL display color swatches that exactly match the configured color palette.
**Validates: Requirements 4.2**

### Property 10: Usage Tracking Per Provider
*For any* image analysis operation, the usage counter for the specific provider SHALL be incremented, and counters for other providers SHALL remain unchanged.
**Validates: Requirements 5.1, 5.2**

### Property 11: Usage Limit Enforcement
*For any* user who has exceeded their tier's usage limit for a specific provider, analysis requests with that provider SHALL be rejected with an appropriate error and alternative suggestions.
**Validates: Requirements 5.3**

### Property 12: Brand Profile Serialization Round-Trip
*For any* valid brand profile, serializing to JSON and then deserializing SHALL produce an equivalent brand profile with all fields matching the original.
**Validates: Requirements 6.4**

### Property 13: Brand Profile Validation
*For any* JSON input to the brand profile deserializer, validation SHALL correctly identify whether all required fields are present and correctly typed, rejecting invalid inputs with appropriate error messages.
**Validates: Requirements 6.3**

## Error Handling

### Vision API Errors

| Error Type | Handling Strategy |
|------------|-------------------|
| Model unavailable | Fall back to default model, notify user |
| Rate limit exceeded | Return error with remaining time, suggest alternatives |
| Invalid image format | Return validation error with supported formats |
| API timeout | Retry once, then return timeout error |
| Authentication failure | Return auth error, prompt re-login |

### Brand Profile Errors

| Error Type | Handling Strategy |
|------------|-------------------|
| Invalid color format | Reject with specific color validation error |
| Palette size invalid | Reject with min/max size message |
| Logo upload failed | Return upload error, allow retry |
| Storage full | Return storage error, suggest cleanup |
| Import parse error | Return JSON parse error with line number |
| Import validation error | Return list of missing/invalid fields |

### Access Control Errors

| Error Type | Handling Strategy |
|------------|-------------------|
| Free user accessing paid feature | Show upgrade prompt |
| Expired subscription | Show renewal prompt |
| Usage limit exceeded | Show limit info and upgrade options |

## Testing Strategy

### Property-Based Testing Library
We will use **fast-check** for property-based testing in JavaScript/TypeScript.

### Unit Tests

Unit tests will cover:
- Component rendering for different user tiers
- API route request/response handling
- Individual validation functions
- Error handling paths

### Property-Based Tests

Each correctness property will be implemented as a property-based test using fast-check. Tests will be configured to run a minimum of 100 iterations.

**Test File Structure:**
```
__tests__/
  vision-model-selector.test.jsx    # Properties 1-4
  brand-profile.test.js             # Properties 5-6, 12-13
  brand-adjusted-output.test.js     # Properties 7-8
  brand-preview.test.jsx            # Property 9
  vision-usage.test.js              # Properties 10-11
```

**Property Test Annotations:**
Each property-based test will be tagged with:
```javascript
// **Feature: vision-ai-brand, Property 12: Brand Profile Serialization Round-Trip**
```

### Test Generators

Custom generators for property-based tests:

```javascript
// Brand Profile Generator
const brandProfileArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  logo: fc.option(fc.record({
    url: fc.string(),
    extractedColors: fc.array(hexColorArb, { minLength: 0, maxLength: 5 })
  })),
  colorPalette: fc.array(hexColorArb, { minLength: 2, maxLength: 6 }),
  fonts: fc.record({
    primary: fc.constantFrom('Inter', 'Roboto', 'Open Sans', 'Lato'),
    secondary: fc.constantFrom('Inter', 'Roboto', 'Open Sans', 'Lato')
  }),
  createdAt: fc.date().map(d => d.toISOString()),
  updatedAt: fc.date().map(d => d.toISOString())
});

// Hex Color Generator
const hexColorArb = fc.hexaString({ minLength: 6, maxLength: 6 })
  .map(s => '#' + s.toUpperCase());

// User Tier Generator
const userTierArb = fc.constantFrom('free', 'basic', 'pro');

// Vision Model Generator
const visionModelArb = fc.constantFrom(
  'gemini-2.5-flash',
  'gemini-3-pro-preview',
  'gpt-5-nano',
  'gpt-5-mini',
  'gpt-5.1',
  'google/gemma-3-27b-it:free',
  'sonar'
);
```

### Integration Tests

Integration tests will verify:
- End-to-end flow from image upload to brand-adjusted output
- API route integration with AI providers
- Storage persistence across sessions
