# Implementation Plan

- [x] 1. Set up Vision AI configuration and model definitions
  - [x] 1.1 Create vision model configuration file with all providers and models
    - Create `lib/ai/vision-config.js` with VISION_MODELS object
    - Define model groups for Gemini, OpenAI, OpenRouter, Perplexity
    - Include model id, name, provider, and tier (free/paid) for each model
    - Export DEFAULT_MODEL constant
    - _Requirements: 1.1, 1.4, 1.6_

  - [x] 1.2 Write property test for model configuration
    - **Property 1: Model Selector Display for Paid Users**
    - Verify all models have required fields (id, name, tier)
    - Verify provider grouping is correct
    - **Validates: Requirements 1.1, 1.4, 1.6**

- [x] 2. Implement Brand Profile data model and validation
  - [x] 2.1 Create brand profile types and schema
    - Create `lib/brand/types.js` with BrandProfile interface
    - Define schema validation for all fields
    - Implement hex color validation regex
    - _Requirements: 2.3, 6.3_

  - [x] 2.2 Implement color palette validation function
    - Create `lib/brand/validation.js`
    - Implement validateColorPalette function (2-6 colors)
    - Implement validateHexColor function
    - _Requirements: 2.3_

  - [x] 2.3 Write property test for color palette validation
    - **Property 5: Color Palette Validation**
    - Test accepts 2-6 valid hex colors
    - Test rejects <2 or >6 colors
    - **Validates: Requirements 2.3**

  - [x] 2.4 Implement brand profile validation function
    - Implement validateBrandProfile function
    - Check all required fields present and typed correctly
    - Return detailed validation errors
    - _Requirements: 6.3_

  - [x] 2.5 Write property test for brand profile validation
    - **Property 13: Brand Profile Validation**
    - Test correctly identifies valid/invalid profiles
    - **Validates: Requirements 6.3**

- [x] 3. Implement Brand Profile serialization and storage
  - [x] 3.1 Create brand profile service
    - Create `lib/brand/service.js`
    - Implement saveBrandProfile function (localStorage)
    - Implement loadBrandProfile function
    - Implement deleteBrandProfile function
    - _Requirements: 2.6_

  - [x] 3.2 Implement serialization functions
    - Implement serializeBrandProfile (to JSON)
    - Implement deserializeBrandProfile (from JSON)
    - Include validation during deserialization
    - _Requirements: 6.1, 6.2, 6.4_

  - [x] 3.3 Write property test for serialization round-trip
    - **Property 12: Brand Profile Serialization Round-Trip**
    - Test serialize then deserialize produces equivalent profile
    - **Validates: Requirements 6.4**

  - [x] 3.4 Write property test for persistence round-trip
    - **Property 6: Brand Profile Persistence Round-Trip**
    - Test save then load produces equivalent profile
    - **Validates: Requirements 2.6**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Vision AI service with provider routing
  - [x] 5.1 Create vision analysis service
    - Create `lib/ai/vision.js`
    - Implement analyzeImage function with model routing
    - Add support for Gemini, OpenAI, OpenRouter vision calls
    - _Requirements: 1.2_

  - [x] 5.2 Implement model fallback logic
    - Add try-catch with fallback to default model
    - Include notification in response when fallback occurs
    - _Requirements: 1.5_

  - [x] 5.3 Write property test for model fallback
    - **Property 4: Model Fallback on Failure**
    - Test fallback occurs on model failure
    - **Validates: Requirements 1.5**

  - [x] 5.4 Implement brand-adjusted output generation
    - Add brandProfile parameter to analyzeImage
    - Generate brandAdjustedPrompt incorporating colors and fonts
    - Return both original and brand-adjusted prompts
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 5.5 Write property test for brand-adjusted output
    - **Property 7: Brand-Adjusted Output Generation**
    - Test output includes brand colors and fonts
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x] 5.6 Write property test for no brand adjustment without profile
    - **Property 8: No Brand Adjustment Without Profile**
    - Test no brandAdjustedPrompt when profile is null
    - **Validates: Requirements 3.5**

- [x] 6. Implement Vision usage tracking
  - [x] 6.1 Extend usage tracking for vision models
    - Update `lib/ai/usage.js` to track vision model usage
    - Add separate counters per provider
    - Implement getVisionUsageStats function
    - _Requirements: 5.1, 5.2_

  - [x] 6.2 Write property test for usage tracking
    - **Property 10: Usage Tracking Per Provider**
    - Test correct provider counter incremented
    - Test other counters unchanged
    - **Validates: Requirements 5.1, 5.2**

  - [x] 6.3 Implement usage limit enforcement
    - Add checkVisionUsageLimit function
    - Return error with alternatives when limit exceeded
    - _Requirements: 5.3_

  - [x] 6.4 Write property test for usage limit enforcement
    - **Property 11: Usage Limit Enforcement**
    - Test analysis rejected when limit exceeded
    - **Validates: Requirements 5.3**

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Create Vision Model Selector component
  - [x] 8.1 Implement VisionModelSelector component
    - Create `components/VisionModelSelector.jsx`
    - Render grouped dropdown with provider sections
    - Show free/paid badges per model
    - Return null for free users
    - _Requirements: 1.1, 1.3, 1.4, 1.6_

  - [x] 8.2 Implement model selection persistence
    - Save selected model to localStorage
    - Load saved selection on mount
    - _Requirements: 1.2_

  - [x] 8.3 Write property test for model selector display
    - **Property 1: Model Selector Display for Paid Users**
    - Test renders for paid users with all models
    - **Validates: Requirements 1.1, 1.4, 1.6**

  - [x] 8.4 Write property test for free user restriction
    - **Property 3: Free User Model Restriction**
    - Test selector hidden for free users
    - **Validates: Requirements 1.3**

  - [x] 8.5 Write property test for model selection persistence
    - **Property 2: Model Selection Persistence**
    - Test selected model used in analysis
    - **Validates: Requirements 1.2**

- [x] 9. Create Brand Settings component
  - [x] 9.1 Implement BrandSettings component
    - Create `components/BrandSettings.jsx`
    - Add logo upload with color extraction
    - Add color palette picker (2-6 colors)
    - Add font selector (primary/secondary)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 9.2 Implement upgrade prompt for free users
    - Show upgrade prompt instead of settings for free users
    - Link to pricing page
    - _Requirements: 2.5_

  - [x] 9.3 Implement export/import functionality
    - Add export button that downloads JSON
    - Add import button that accepts JSON file
    - Validate imported profile before applying
    - _Requirements: 6.1, 6.2_

- [x] 10. Create Brand Preview component
  - [x] 10.1 Implement BrandPreview component
    - Create `components/BrandPreview.jsx`
    - Display color swatches from palette
    - Display sample text in selected fonts
    - Update live as settings change
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 10.2 Write property test for preview color swatches
    - **Property 9: Preview Color Swatches Match Palette**
    - **Validates: Requirements 4.2**

- [x] 11. Create API routes
  - [x] 11.1 Create vision analysis API route
    - Create `app/api/ai/vision/route.js`
    - Handle POST requests with image and model selection
    - Validate user tier and usage limits using checkVisionUsageLimit
    - Call analyzeImage from vision service with brand profile
    - Track usage with incrementVisionUsage
    - Return analysis result with brand adjustments if applicable
    - _Requirements: 1.2, 3.1, 5.1_

  - [x] 11.2 Create brand profile API route
    - Create `app/api/brand/route.js`
    - Handle GET (load), POST (save), DELETE operations
    - Validate user is paid before allowing access
    - Use brand service functions (saveBrandProfile, loadBrandProfile, deleteBrandProfile)
    - _Requirements: 2.1, 2.5, 2.6_

- [x] 12. Integrate components into Dashboard
  - [x] 12.1 Add Vision Model Selector to analyze tab
    - Import VisionModelSelector and useVisionModelSelection hook
    - Render VisionModelSelector in analyze tab above upload area
    - Pass selected model to vision API route
    - Show only for paid users (basic, pro, creator, business)
    - _Requirements: 1.1, 1.3_

  - [x] 12.2 Update analyze function to use vision API
    - Replace mock analysis with actual API call to /api/ai/vision
    - Pass selected model ID and uploaded image
    - Load and pass brand profile if available
    - Handle fallback notifications in UI
    - Display error messages for usage limits
    - _Requirements: 1.2, 1.5, 3.1_

  - [x] 12.3 Add Brand Settings to settings tab
    - Add "Brand Profile" section to settings tab
    - Render BrandSettings component
    - Show upgrade prompt for free users
    - Load existing profile on mount using /api/brand
    - _Requirements: 2.1, 2.5_

  - [x] 12.4 Update analysis results to show brand-adjusted output
    - Display both original and brand-adjusted prompts when available
    - Show brand color palette in results if brand profile exists
    - Add visual distinction between original and brand-adjusted prompts
    - Add separate copy buttons for each prompt
    - _Requirements: 3.4_

  - [x] 12.5 Update usage stats display
    - Add vision model usage stats to dashboard
    - Display per-provider breakdown using getVisionUsageStats
    - Show remaining limits per provider
    - Add visual indicators for approaching limits
    - _Requirements: 5.4_

- [x] 13. Final Checkpoint - Ensure all tests pass
  - Run all tests with `npm test`
  - Verify all property-based tests pass (100 iterations each)
  - Ensure all tests pass, ask the user if questions arise.
