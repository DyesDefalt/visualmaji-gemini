/**
 * API Route: Brand Profile Management
 * 
 * GET /api/brand - Load user's brand profile
 * POST /api/brand - Save brand profile
 * DELETE /api/brand - Delete brand profile
 * 
 * Query params (GET/DELETE): userId, userTier
 * Body (POST): { userId, userTier, profile }
 * 
 * Requirements: 2.1, 2.5, 2.6
 */
import {
  saveBrandProfile,
  loadBrandProfile,
  deleteBrandProfile,
} from '@/lib/brand/service.js';

/**
 * Paid user tiers that have access to brand profile features
 */
const PAID_TIERS = ['basic', 'pro', 'creator', 'business'];

/**
 * Check if user tier is a paid tier
 * @param {string} userTier
 * @returns {boolean}
 */
function isPaidUser(userTier) {
  return PAID_TIERS.includes(userTier);
}

/**
 * GET /api/brand
 * Load user's brand profile
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userTier = searchParams.get('userTier') || 'free';

    // Validate userId
    if (!userId) {
      return Response.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if user is paid (Requirement 2.5)
    if (!isPaidUser(userTier)) {
      return Response.json(
        {
          error: 'Brand profile is a premium feature',
          upgradeRequired: true,
          message: 'Upgrade to a paid plan to access brand profile features.',
        },
        { status: 403 }
      );
    }

    // Load the brand profile
    const result = loadBrandProfile(userId);

    if (result.errors.length > 0) {
      return Response.json(
        { error: result.errors.join(', ') },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      profile: result.profile,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/brand
 * Save brand profile
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, userTier = 'free', profile } = body;

    // Validate userId
    if (!userId) {
      return Response.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Validate profile
    if (!profile) {
      return Response.json(
        { error: 'profile is required' },
        { status: 400 }
      );
    }

    // Check if user is paid (Requirement 2.5)
    if (!isPaidUser(userTier)) {
      return Response.json(
        {
          error: 'Brand profile is a premium feature',
          upgradeRequired: true,
          message: 'Upgrade to a paid plan to access brand profile features.',
        },
        { status: 403 }
      );
    }

    // Save the brand profile
    const result = saveBrandProfile(userId, profile);

    if (!result.success) {
      return Response.json(
        { error: result.errors.join(', ') },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: 'Brand profile saved successfully',
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/brand
 * Delete brand profile
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userTier = searchParams.get('userTier') || 'free';

    // Validate userId
    if (!userId) {
      return Response.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if user is paid (Requirement 2.5)
    if (!isPaidUser(userTier)) {
      return Response.json(
        {
          error: 'Brand profile is a premium feature',
          upgradeRequired: true,
          message: 'Upgrade to a paid plan to access brand profile features.',
        },
        { status: 403 }
      );
    }

    // Delete the brand profile
    const result = deleteBrandProfile(userId);

    if (!result.success) {
      return Response.json(
        { error: result.errors.join(', ') },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Brand profile deleted successfully',
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
