/**
 * API Route: Check AI provider status and usage
 * GET /api/ai/status?userId=xxx&userTier=free
 */
import { env, isProviderConfigured } from '@/lib/env';
import { getUsageStats, AI_PROVIDERS } from '@/lib/ai';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'anonymous';
  const userTier = searchParams.get('userTier') || 'free';

  const providers = {};

  for (const [key, config] of Object.entries(AI_PROVIDERS)) {
    providers[key] = {
      name: config.name,
      description: config.description,
      purpose: config.purpose,
      configured: isProviderConfigured(key),
      model: env[key]?.model,
    };
  }

  // Add Supabase status
  providers.supabase = {
    name: 'Supabase',
    configured: isProviderConfigured('supabase'),
    url: env.supabase.url,
  };

  // Get usage stats for the user
  const usage = getUsageStats(userId, userTier);

  return Response.json({ 
    providers, 
    usage,
    userTier,
  });
}
