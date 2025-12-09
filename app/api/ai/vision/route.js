/**
 * API Route: Vision AI Analysis
 * POST /api/ai/vision
 * 
 * Analyzes images using selectable vision AI models with brand profile support.
 * 
 * Body: { 
 *   imageData: string (base64 data URL),
 *   modelId?: string,
 *   userId?: string,
 *   userTier?: string,
 *   brandProfile?: object
 * }
 * 
 * Requirements: 1.2, 3.1, 5.1
 */
import { analyzeImage } from '@/lib/ai/vision.js';
import { checkVisionUsageLimit, incrementVisionUsage } from '@/lib/ai/usage.js';
import { DEFAULT_MODEL } from '@/lib/ai/vision-config.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      imageData,
      modelId = DEFAULT_MODEL,
      userId = 'anonymous',
      userTier = 'free',
      brandProfile = null,
    } = body;

    // Validate required fields
    if (!imageData) {
      return Response.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate image data format (should be a data URL)
    if (!imageData.startsWith('data:image/')) {
      return Response.json(
        { error: 'Invalid image format. Expected base64 data URL.' },
        { status: 400 }
      );
    }

    // Check usage limits before processing
    const usageCheck = checkVisionUsageLimit(userId, modelId, userTier);
    if (!usageCheck.allowed) {
      return Response.json(
        {
          error: usageCheck.reason,
          usage: usageCheck.usage,
          limits: usageCheck.limits,
          alternatives: usageCheck.alternatives,
        },
        { status: 429 }
      );
    }

    // Perform image analysis
    const result = await analyzeImage(imageData, {
      modelId,
      userId,
      userTier,
      brandProfile,
    });

    // If analysis failed, return error
    if (!result.success) {
      return Response.json(
        {
          error: result.error,
          fallbackOccurred: result.fallbackOccurred,
          fallbackReason: result.fallbackReason,
        },
        { status: 500 }
      );
    }

    // Track usage after successful analysis
    incrementVisionUsage(userId, result.model);

    // Return successful analysis result
    // Wrap in 'result' object as expected by dashboard
    return Response.json({
      success: true,
      result: {
        subject: result.subject,
        medium: result.medium,
        lighting: result.lighting,
        composition: result.composition,
        style: result.style,
        colorPalette: result.colorPalette,
        prompt: result.prompt,
        brandAdjustedPrompt: result.brandAdjustedPrompt,
      },
      modelUsed: result.model,
      provider: result.provider,
      fallbackUsed: result.fallbackOccurred,
      notification: result.notification,
      originalModel: result.originalModel,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
