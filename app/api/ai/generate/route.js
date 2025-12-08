/**
 * API Route: Generate AI content
 * POST /api/ai/generate
 * 
 * Body: { prompt, userId?, userTier?, preferredProvider?, options? }
 * 
 * Provider selection:
 * - openrouter: Free for all users (default)
 * - gemini/openai: Limited usage based on tier
 */
import { generate } from '@/lib/ai';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      userId = 'anonymous', 
      userTier = 'free', 
      preferredProvider,
      ...options 
    } = body;

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await generate(prompt, {
      userId,
      userTier,
      preferredProvider,
      ...options,
    });

    if (!result.success) {
      return Response.json({ error: result.error, provider: result.provider }, { status: 500 });
    }

    return Response.json({ 
      text: result.text, 
      provider: result.provider,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
