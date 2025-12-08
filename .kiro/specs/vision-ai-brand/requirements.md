# Requirements Document

## Introduction

This document specifies the requirements for a Vision AI feature that enables paid users to analyze images using selectable vision AI models and apply Visual Brand customization to generated outputs. The feature allows users to choose from multiple vision AI providers (such as OpenAI GPT-4 Vision, Google Gemini Vision, etc.) and configure their brand assets (colors, fonts, logo) so that AI-generated prompts and analysis results automatically incorporate brand-specific styling recommendations.

## Glossary

- **Vision_AI_System**: The image analysis subsystem that processes uploaded images using vision-capable AI models to extract visual attributes and generate prompts
- **Vision_Model**: An AI model capable of analyzing images. Available models include:
  - Gemini: gemini-2.5-flash, gemini-3-pro-preview
  - OpenAI: gpt-5-nano, gpt-5-mini, gpt-5.1
  - OpenRouter (Free): google/gemma-3-27b-it:free, mistralai/mistral-small-3.1-24b-instruct:free, qwen/qwen2.5-vl-32b-instruct:free, mistralai/mistral-small-3.2-24b-instruct:free, nvidia/nemotron-nano-12b-v2-vl:free, x-ai/grok-4.1-fast
  - Perplexity: sonar
- **Visual_Brand_Profile**: A user-defined configuration containing brand assets including color palette, typography preferences, and logo
- **Paid_User**: A user with an active subscription plan (basic, pro, or higher tiers) as defined in the AuthContext
- **Free_User**: A user on the free tier without access to premium features
- **Analysis_Result**: The structured output from vision AI containing subject, medium, lighting, composition, style, color palette, and generated prompt
- **Brand_Adjusted_Output**: An Analysis_Result that has been modified to incorporate the user's Visual_Brand_Profile settings

## Requirements

### Requirement 1

**User Story:** As a paid user, I want to select which vision AI model to use for image analysis, so that I can choose the model that best fits my needs and preferences.

#### Acceptance Criteria

1. WHEN a paid user accesses the analyze page THEN the Vision_AI_System SHALL display a model selector dropdown containing available vision models grouped by provider (Gemini, OpenAI, OpenRouter, Perplexity)
2. WHEN a paid user selects a vision model from the dropdown THEN the Vision_AI_System SHALL use the selected model for subsequent image analysis
3. WHILE a free user accesses the analyze page THEN the Vision_AI_System SHALL hide the model selector and use the default OpenRouter free model
4. WHEN the Vision_AI_System displays the model selector THEN the Vision_AI_System SHALL show model name, provider name, and indicate free vs paid models
5. IF a selected vision model becomes unavailable THEN the Vision_AI_System SHALL fall back to the default model and notify the user
6. WHEN displaying OpenRouter models THEN the Vision_AI_System SHALL clearly mark free-tier models (gemma-3-27b-it:free, mistral-small-3.1-24b-instruct:free, qwen2.5-vl-32b-instruct:free, mistral-small-3.2-24b-instruct:free, nemotron-nano-12b-v2-vl:free, grok-4.1-fast)

### Requirement 2

**User Story:** As a paid user, I want to configure my Visual Brand Profile with colors, fonts, and logo, so that AI-generated outputs reflect my brand identity.

#### Acceptance Criteria

1. WHEN a paid user navigates to brand settings THEN the Vision_AI_System SHALL display a brand configuration interface
2. WHEN a paid user uploads a logo THEN the Vision_AI_System SHALL store the logo and extract dominant colors from the logo image
3. WHEN a paid user defines a color palette THEN the Vision_AI_System SHALL validate that the palette contains between 2 and 6 colors
4. WHEN a paid user selects font preferences THEN the Vision_AI_System SHALL store primary and secondary font choices
5. WHILE a free user attempts to access brand settings THEN the Vision_AI_System SHALL display an upgrade prompt instead of the configuration interface
6. WHEN a paid user saves the brand profile THEN the Vision_AI_System SHALL persist the profile to storage immediately

### Requirement 3

**User Story:** As a paid user, I want my image analysis results to automatically incorporate my brand settings, so that generated prompts are ready for brand-consistent content creation.

#### Acceptance Criteria

1. WHEN a paid user with a configured brand profile analyzes an image THEN the Vision_AI_System SHALL generate a Brand_Adjusted_Output
2. WHEN generating a Brand_Adjusted_Output THEN the Vision_AI_System SHALL incorporate the user's color palette into the generated prompt
3. WHEN generating a Brand_Adjusted_Output THEN the Vision_AI_System SHALL include typography recommendations based on the user's font preferences
4. WHEN displaying analysis results THEN the Vision_AI_System SHALL show both the original analysis and brand-adjusted recommendations
5. IF a paid user has no configured brand profile THEN the Vision_AI_System SHALL generate standard analysis without brand adjustments

### Requirement 4

**User Story:** As a paid user, I want to preview how my brand settings affect generated outputs, so that I can fine-tune my brand profile before using it in production.

#### Acceptance Criteria

1. WHEN a paid user modifies brand settings THEN the Vision_AI_System SHALL display a live preview of brand-adjusted output
2. WHEN the preview updates THEN the Vision_AI_System SHALL show color swatches reflecting the configured palette
3. WHEN the preview updates THEN the Vision_AI_System SHALL display sample text in the selected fonts
4. WHEN a paid user is satisfied with the preview THEN the Vision_AI_System SHALL allow saving the brand profile

### Requirement 5

**User Story:** As a system administrator, I want vision AI usage to be tracked per model, so that costs can be monitored and usage limits enforced.

#### Acceptance Criteria

1. WHEN a user performs image analysis THEN the Vision_AI_System SHALL record the vision model used and increment the usage counter
2. WHEN tracking usage THEN the Vision_AI_System SHALL maintain separate counters for each vision model provider
3. WHILE a user exceeds their tier's vision model usage limit THEN the Vision_AI_System SHALL prevent further analysis with that model and suggest alternatives
4. WHEN displaying usage statistics THEN the Vision_AI_System SHALL show vision model usage separately from text generation usage

### Requirement 6

**User Story:** As a paid user, I want to serialize and deserialize my brand profile, so that I can export, backup, or transfer my brand settings.

#### Acceptance Criteria

1. WHEN a paid user exports their brand profile THEN the Vision_AI_System SHALL serialize the profile to JSON format
2. WHEN a paid user imports a brand profile THEN the Vision_AI_System SHALL parse the JSON and validate the profile structure
3. WHEN parsing a brand profile THEN the Vision_AI_System SHALL validate all required fields are present and correctly typed
4. WHEN serializing a brand profile THEN the Vision_AI_System SHALL produce output that can be deserialized back to an equivalent profile
