/**
 * Brand Profile Service
 * 
 * Implements storage, serialization, and deserialization for brand profiles.
 * Requirements: 2.6, 6.1, 6.2, 6.4
 */

import { validateBrandProfile } from './validation.js';

/**
 * Storage key prefix for brand profiles in localStorage
 */
const STORAGE_KEY_PREFIX = 'brand_profile_';

/**
 * Gets the storage key for a user's brand profile
 * @param {string} userId - The user's unique identifier
 * @returns {string} The localStorage key
 */
function getStorageKey(userId) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Serializes a brand profile to JSON string
 * @param {import('./types.js').BrandProfile} profile - The profile to serialize
 * @returns {string} JSON string representation of the profile
 * @throws {Error} If profile is invalid
 */
export function serializeBrandProfile(profile) {
  const validation = validateBrandProfile(profile);
  if (!validation.valid) {
    throw new Error(`Cannot serialize invalid profile: ${validation.errors.join(', ')}`);
  }
  return JSON.stringify(profile);
}

/**
 * Deserializes a JSON string to a brand profile
 * @param {string} json - The JSON string to parse
 * @returns {{ profile: import('./types.js').BrandProfile | null, errors: string[] }} 
 *          The parsed profile or null with validation errors
 */
export function deserializeBrandProfile(json) {
  if (typeof json !== 'string') {
    return { profile: null, errors: ['Input must be a JSON string'] };
  }

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    return { profile: null, errors: [`Invalid JSON: ${e.message}`] };
  }

  const validation = validateBrandProfile(parsed);
  if (!validation.valid) {
    return { profile: null, errors: validation.errors };
  }

  return { profile: parsed, errors: [] };
}


/**
 * Saves a brand profile to localStorage
 * @param {string} userId - The user's unique identifier
 * @param {import('./types.js').BrandProfile} profile - The profile to save
 * @returns {{ success: boolean, errors: string[] }} Result of the save operation
 */
export function saveBrandProfile(userId, profile) {
  if (!userId || typeof userId !== 'string') {
    return { success: false, errors: ['userId is required and must be a string'] };
  }

  const validation = validateBrandProfile(profile);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  try {
    const json = serializeBrandProfile(profile);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getStorageKey(userId), json);
    }
    return { success: true, errors: [] };
  } catch (e) {
    return { success: false, errors: [`Failed to save profile: ${e.message}`] };
  }
}

/**
 * Loads a brand profile from localStorage
 * @param {string} userId - The user's unique identifier
 * @returns {{ profile: import('./types.js').BrandProfile | null, errors: string[] }}
 *          The loaded profile or null with errors
 */
export function loadBrandProfile(userId) {
  if (!userId || typeof userId !== 'string') {
    return { profile: null, errors: ['userId is required and must be a string'] };
  }

  try {
    if (typeof localStorage === 'undefined') {
      return { profile: null, errors: ['localStorage is not available'] };
    }

    const json = localStorage.getItem(getStorageKey(userId));
    if (json === null) {
      return { profile: null, errors: [] }; // No profile exists, not an error
    }

    return deserializeBrandProfile(json);
  } catch (e) {
    return { profile: null, errors: [`Failed to load profile: ${e.message}`] };
  }
}

/**
 * Deletes a brand profile from localStorage
 * @param {string} userId - The user's unique identifier
 * @returns {{ success: boolean, errors: string[] }} Result of the delete operation
 */
export function deleteBrandProfile(userId) {
  if (!userId || typeof userId !== 'string') {
    return { success: false, errors: ['userId is required and must be a string'] };
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(getStorageKey(userId));
    }
    return { success: true, errors: [] };
  } catch (e) {
    return { success: false, errors: [`Failed to delete profile: ${e.message}`] };
  }
}
