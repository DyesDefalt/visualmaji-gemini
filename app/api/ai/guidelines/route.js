/**
 * API Route: Platform Advertising Guidelines
 * POST /api/ai/guidelines
 * 
 * Body: { platform, contentType, userId?, userTier? }
 * 
 * Supported platforms: meta, tiktok, google, x (twitter)
 * Content types: image, video, text, carousel
 */
import { getPlatformGuidelines } from '@/lib/ai';

const SUPPORTED_PLATFORMS = ['meta', 'tiktok', 'google', 'x', 'twitter', 'youtube', 'linkedin', 'snapchat'];
const SUPPORTED_CONTENT_TYPES = ['image', 'video', 'text', 'carousel', 'story', 'reel']; // eslint-disable-line no-unused-vars

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      platform, 
      contentType = 'image', 
      userId = 'anonymous', 
      userTier = 'free' 
    } = body;

    if (!platform) {
      return Response.json({ error: 'Platform is required' }, { status: 400 });
    }

    const normalizedPlatform = platform.toLowerCase();
    if (!SUPPORTED_PLATFORMS.includes(normalizedPlatform)) {
      return Response.json({ 
        error: `Unsupported platform. Supported: ${SUPPORTED_PLATFORMS.join(', ')}` 
      }, { status: 400 });
    }

    const result = await getPlatformGuidelines(normalizedPlatform, contentType, { userId, userTier });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: result.error?.includes('limit') ? 429 : 500 });
    }

    return Response.json({ 
      platform: normalizedPlatform,
      contentType,
      guidelines: result.text, 
      provider: result.provider,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
