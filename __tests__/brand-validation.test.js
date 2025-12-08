import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  validateHexColor, 
  validateColorPalette 
} from '../lib/brand/validation.js';
import { COLOR_PALETTE_CONSTRAINTS } from '../lib/brand/types.js';

// Custom arbitrary for valid hex colors - generates 6 hex characters
const hexCharArb = fc.constantFrom(...'0123456789ABCDEFabcdef'.split(''));
const validHexColorArb = fc.array(hexCharArb, { minLength: 6, maxLength: 6 })
  .map(chars => '#' + chars.join('').toUpperCase());

// Custom arbitrary for hex string of specific length
const hexStringArb = (length) => fc.array(hexCharArb, { minLength: length, maxLength: length })
  .map(chars => chars.join(''));

describe('Brand Validation', () => {
  /**
   * **Feature: vision-ai-brand, Property 5: Color Palette Validation**
   * 
   * *For any* color palette input, validation SHALL accept arrays with 2-6 valid 
   * hex colors and reject arrays with fewer than 2 or more than 6 colors.
   * 
   * **Validates: Requirements 2.3**
   */
  describe('Property 5: Color Palette Validation', () => {
    it('accepts arrays with 2-6 valid hex colors', () => {
      fc.assert(
        fc.property(
          fc.array(validHexColorArb, { 
            minLength: COLOR_PALETTE_CONSTRAINTS.minColors, 
            maxLength: COLOR_PALETTE_CONSTRAINTS.maxColors 
          }),
          (colors) => {
            const result = validateColorPalette(colors);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects arrays with fewer than 2 colors', () => {
      fc.assert(
        fc.property(
          fc.array(validHexColorArb, { 
            minLength: 0, 
            maxLength: COLOR_PALETTE_CONSTRAINTS.minColors - 1 
          }),
          (colors) => {
            const result = validateColorPalette(colors);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('at least'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects arrays with more than 6 colors', () => {
      fc.assert(
        fc.property(
          fc.array(validHexColorArb, { 
            minLength: COLOR_PALETTE_CONSTRAINTS.maxColors + 1, 
            maxLength: 10 
          }),
          (colors) => {
            const result = validateColorPalette(colors);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('at most'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects arrays containing invalid hex colors', () => {
      // Generate array with at least one invalid color mixed with valid ones
      const shortHexArb = fc.array(hexCharArb, { minLength: 1, maxLength: 5 })
        .map(chars => '#' + chars.join(''));
      
      const arrayWithInvalidColor = fc.tuple(
        fc.array(validHexColorArb, { minLength: 1, maxLength: 4 }),
        shortHexArb, // Invalid: wrong length
        fc.array(validHexColorArb, { minLength: 0, maxLength: 2 })
      ).map(([before, invalid, after]) => [...before, invalid, ...after]);

      fc.assert(
        fc.property(
          arrayWithInvalidColor,
          (colors) => {
            const result = validateColorPalette(colors);
            // Should have at least one error about invalid hex color
            expect(result.errors.some(e => e.includes('Invalid hex color'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects non-array inputs', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.object(),
            fc.constant(null),
            fc.constant(undefined)
          ),
          (input) => {
            const result = validateColorPalette(input);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Color palette must be an array');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('validateHexColor', () => {
    it('accepts valid hex colors in #RRGGBB format', () => {
      fc.assert(
        fc.property(
          validHexColorArb,
          (color) => {
            expect(validateHexColor(color)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('accepts both uppercase and lowercase hex colors', () => {
      fc.assert(
        fc.property(
          hexStringArb(6),
          (hex) => {
            expect(validateHexColor('#' + hex.toLowerCase())).toBe(true);
            expect(validateHexColor('#' + hex.toUpperCase())).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects colors without hash prefix', () => {
      fc.assert(
        fc.property(
          hexStringArb(6),
          (hex) => {
            expect(validateHexColor(hex)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects colors with wrong length', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 5 }).chain(len => hexStringArb(len)),
          (hex) => {
            expect(validateHexColor('#' + hex)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects non-string inputs', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.integer(),
            fc.constant(null),
            fc.constant(undefined),
            fc.array(fc.string())
          ),
          (input) => {
            expect(validateHexColor(input)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


import { validateBrandProfile } from '../lib/brand/validation.js';

// Custom arbitrary for valid ISO date strings (using integer timestamps)
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

describe('Brand Profile Validation', () => {
  /**
   * **Feature: vision-ai-brand, Property 13: Brand Profile Validation**
   * 
   * *For any* JSON input to the brand profile deserializer, validation SHALL correctly 
   * identify whether all required fields are present and correctly typed, rejecting 
   * invalid inputs with appropriate error messages.
   * 
   * **Validates: Requirements 6.3**
   */
  describe('Property 13: Brand Profile Validation', () => {
    it('accepts valid brand profiles with all required fields', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb,
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects profiles missing required id field', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb.map(p => {
            const { id, ...rest } = p;
            return rest;
          }),
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('id'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects profiles missing required name field', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb.map(p => {
            const { name, ...rest } = p;
            return rest;
          }),
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('name'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects profiles missing required colorPalette field', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb.map(p => {
            const { colorPalette, ...rest } = p;
            return rest;
          }),
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('colorPalette'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects profiles missing required fonts field', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb.map(p => {
            const { fonts, ...rest } = p;
            return rest;
          }),
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('fonts'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects profiles with name exceeding 100 characters', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb.chain(p => 
            fc.string({ minLength: 101, maxLength: 200 }).map(longName => ({
              ...p,
              name: longName
            }))
          ),
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('name') && e.includes('100'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects non-object inputs', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.array(fc.anything()),
            fc.constant(null),
            fc.constant(undefined)
          ),
          (input) => {
            const result = validateBrandProfile(input);
            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Brand profile must be an object');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects profiles with invalid logo structure', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb.map(p => ({
            ...p,
            logo: { url: 123, extractedColors: 'not-an-array' } // Invalid types
          })),
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('logo'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects profiles with invalid fonts structure', () => {
      fc.assert(
        fc.property(
          validBrandProfileArb.map(p => ({
            ...p,
            fonts: { primary: 123, secondary: null } // Invalid types
          })),
          (profile) => {
            const result = validateBrandProfile(profile);
            expect(result.valid).toBe(false);
            expect(result.errors.some(e => e.includes('fonts'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
