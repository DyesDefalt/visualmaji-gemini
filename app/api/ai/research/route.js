/**
 * API Route: Research with Perplexity
 * POST /api/ai/research
 * 
 * Body: { query, userId?, userTier? }
 * 
 * Used for:
 * - Platform advertising guidelines (Meta, TikTok, Google, X)
 * - Copyright and plagiarism checks
 * - Best practices research
 */
import { research } from '@/lib/ai';

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, userId = 'anonymous', userTier = 'free' } = body;

    if (!query) {
      return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await research(query, { userId, userTier });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: result.error?.includes('limit') ? 429 : 500 });
    }

    return Response.json({ 
      text: result.text, 
      provider: result.provider,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
