/**
 * API Route: Content Compliance Check
 * POST /api/ai/compliance
 * 
 * Body: { content, userId?, userTier? }
 * 
 * Checks content for:
 * - Copyright issues
 * - Plagiarism concerns
 * - Commercial usage safety
 */
import { checkCompliance } from '@/lib/ai';

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, userId = 'anonymous', userTier = 'free' } = body;

    if (!content) {
      return Response.json({ error: 'Content is required' }, { status: 400 });
    }

    const result = await checkCompliance(content, { userId, userTier });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: result.error?.includes('limit') ? 429 : 500 });
    }

    return Response.json({ 
      analysis: result.text, 
      provider: result.provider,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
