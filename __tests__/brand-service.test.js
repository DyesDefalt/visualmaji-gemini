import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { 
  serializeBrandProfile, 
  deserializeBrandProfile,
  saveBrandProfile,
  loadBrandProfile,
  deleteBrandProfile
} from '../lib/brand/service.js';

// Custom arbitrary for valid hex colors - generates 6 hex characters
const hexCharArb = fc.constantFrom(...'0123456789ABCDEFabcdef'.split(''));
const validHexColorArb = fc.array(hexCharArb, { minLength: 6, maxLength: 6 })
  .map(chars => '#' + chars.join('').toUpperCase());

// Custom arbitrary for valid ISO date strings
const validDateArb = fc.integer({ 
  min: new Date('2020-01-01').getTime(), 
  max: new Date('2030-12-31').getTime() 
}).map(ts => new Date(ts).toISOString());

// Custom arbitrary for valid brand profile
const validBrandProfileArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  logo: fc.option(fc.record({
    url: fc.string({ minLength: 1 }),
    extractedColors: fc.array(validHexColorArb, { minLength: 0, maxLength: 5 })
  }), { nil: undefined }),
  colorPalette: fc.array(validHexColorArb, { minLength: 2, maxLength: 6 }),
  fonts: fc.record({
    primary: fc.constantFrom('Inter', 'Roboto', 'Open Sans', 'Lato'),
    secondary: fc.constantFrom('Inter', 'Roboto', 'Open Sans', 'Lato')
  }),
  createdAt: validDateArb,
  updatedAt: validDateArb
});

// Custom arbitrary for user IDs
const userIdArb = fc.uuid();


describe('Brand Profile Service', () => {
  /**
   * **Feature: vision-ai-brand, Property 12: Brand Profile Serialization Round-Trip**
   * 
   * *For any* valid brand profile, serializing to JSON and then deserializing 
   * SHALL produce an equivalent brand profile with all fields matching the original.
   * 
   * **Validates: Requirements 6.4**
   */
  describe('Property 12: Brand Profile Serialization Round-Trip', () => {
    it('serialize then deserialize produces equivalent profile', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb,
          (profile) => {
            // Serialize the profile to JSON
            const json = serializeBrandProfile(profile);
            
            // Deserialize back to object
            const result = deserializeBrandProfile(json);
            
            // Should succeed without errors
            expect(result.errors).toHaveLength(0);
            expect(result.profile).not.toBeNull();
            
            // All fields should match the original
            expect(result.profile.id).toBe(profile.id);
            expect(result.profile.name).toBe(profile.name);
            expect(result.profile.colorPalette).toEqual(profile.colorPalette);
            expect(result.profile.fonts).toEqual(profile.fonts);
            expect(result.profile.createdAt).toBe(profile.createdAt);
            expect(result.profile.updatedAt).toBe(profile.updatedAt);
            
            // Handle optional logo field
            if (profile.logo === undefined) {
              expect(result.profile.logo).toBeUndefined();
            } else {
              expect(result.profile.logo).toEqual(profile.logo);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects invalid JSON strings', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => {
            try { JSON.parse(s); return false; } catch { return true; }
          }),
          (invalidJson) => {
            const result = deserializeBrandProfile(invalidJson);
            expect(result.profile).toBeNull();
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some(e => e.includes('Invalid JSON'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects non-string inputs to deserialize', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.integer(),
            fc.object(),
            fc.array(fc.anything()),
            fc.constant(null),
            fc.constant(undefined)
          ),
          (input) => {
            const result = deserializeBrandProfile(input);
            expect(result.profile).toBeNull();
            expect(result.errors).toContain('Input must be a JSON string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });


  /**
   * **Feature: vision-ai-brand, Property 6: Brand Profile Persistence Round-Trip**
   * 
   * *For any* valid brand profile that is saved, loading the profile SHALL return 
   * an equivalent profile with all fields preserved.
   * 
   * **Validates: Requirements 2.6**
   */
  describe('Property 6: Brand Profile Persistence Round-Trip', () => {
    // Mock localStorage for testing
    let mockStorage = {};
    
    beforeEach(() => {
      mockStorage = {};
      global.localStorage = {
        getItem: (key) => mockStorage[key] ?? null,
        setItem: (key, value) => { mockStorage[key] = value; },
        removeItem: (key) => { delete mockStorage[key]; },
        clear: () => { mockStorage = {}; }
      };
    });

    afterEach(() => {
      delete global.localStorage;
    });

    it('save then load produces equivalent profile', () => {
      fc.assert(
        fc.property(
          fc.tuple(userIdArb, validBrandProfileArb),
          ([userId, profile]) => {
            // Save the profile
            const saveResult = saveBrandProfile(userId, profile);
            expect(saveResult.success).toBe(true);
            expect(saveResult.errors).toHaveLength(0);
            
            // Load the profile back
            const loadResult = loadBrandProfile(userId);
            expect(loadResult.errors).toHaveLength(0);
            expect(loadResult.profile).not.toBeNull();
            
            // All fields should match the original
            expect(loadResult.profile.id).toBe(profile.id);
            expect(loadResult.profile.name).toBe(profile.name);
            expect(loadResult.profile.colorPalette).toEqual(profile.colorPalette);
            expect(loadResult.profile.fonts).toEqual(profile.fonts);
            expect(loadResult.profile.createdAt).toBe(profile.createdAt);
            expect(loadResult.profile.updatedAt).toBe(profile.updatedAt);
            
            // Handle optional logo field
            if (profile.logo === undefined) {
              expect(loadResult.profile.logo).toBeUndefined();
            } else {
              expect(loadResult.profile.logo).toEqual(profile.logo);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns null profile when no profile exists for user', () => {
      fc.assert(
        fc.property(
          userIdArb,
          (userId) => {
            const result = loadBrandProfile(userId);
            expect(result.profile).toBeNull();
            expect(result.errors).toHaveLength(0); // Not an error, just no profile
          }
        ),
        { numRuns: 100 }
      );
    });

    it('delete removes the profile', () => {
      fc.assert(
        fc.property(
          fc.tuple(userIdArb, validBrandProfileArb),
          ([userId, profile]) => {
            // Save the profile
            saveBrandProfile(userId, profile);
            
            // Delete the profile
            const deleteResult = deleteBrandProfile(userId);
            expect(deleteResult.success).toBe(true);
            expect(deleteResult.errors).toHaveLength(0);
            
            // Load should return null
            const loadResult = loadBrandProfile(userId);
            expect(loadResult.profile).toBeNull();
            expect(loadResult.errors).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects invalid userId for save', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.oneof(
              fc.constant(null),
              fc.constant(undefined),
              fc.constant(''),
              fc.integer()
            ),
            validBrandProfileArb
          ),
          ([invalidUserId, profile]) => {
            const result = saveBrandProfile(invalidUserId, profile);
            expect(result.success).toBe(false);
            expect(result.errors.some(e => e.includes('userId'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects invalid userId for load', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(null),
            fc.constant(undefined),
            fc.constant(''),
            fc.integer()
          ),
          (invalidUserId) => {
            const result = loadBrandProfile(invalidUserId);
            expect(result.profile).toBeNull();
            expect(result.errors.some(e => e.includes('userId'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects invalid profile for save', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            userIdArb,
            fc.oneof(
              fc.constant(null),
              fc.constant(undefined),
              fc.string(),
              fc.integer()
            )
          ),
          ([userId, invalidProfile]) => {
            const result = saveBrandProfile(userId, invalidProfile);
            expect(result.success).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
