import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { buildBrandAdjustedPrompt } from '../lib/ai/vision.js';

/**
 * **Feature: vision-ai-brand, Property 7: Brand-Adjusted Output Generation**
 * 
 * *For any* paid user with a configured brand profile, image analysis SHALL produce 
 * a Brand_Adjusted_Output that incorporates the user's color palette and font 
 * preferences into the generated prompt.
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3**
 */
describe('Property 7: Brand-Adjusted Output Generation', () => {
  // Custom arbitrary for valid hex colors
  const hexCharArb = fc.constantFrom(...'0123456789ABCDEFabcdef'.split(''));
  const validHexColorArb = fc.array(hexCharArb, { minLength: 6, maxLength: 6 })
    .map(chars => '#' + chars.join('').toUpperCase());

  // Custom arbitrary for valid brand profile with color palette and fonts
  const validBrandProfileArb = fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
    colorPalette: fc.array(validHexColorArb, { minLength: 2, maxLength: 6 }),
    fonts: fc.record({
      primary: fc.constantFrom('Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'),
      secondary: fc.constantFrom('Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins')
    }),
    createdAt: fc.constant(new Date().toISOString()),
    updatedAt: fc.constant(new Date().toISOString())
  });

  // Custom arbitrary for analysis result with a prompt
  const analysisResultArb = fc.record({
    subject: fc.string({ minLength: 1, maxLength: 50 }),
    medium: fc.constantFrom('photo', 'illustration', '3D render', 'digital art'),
    lighting: fc.constantFrom('natural', 'studio', 'dramatic', 'soft'),
    composition: fc.constantFrom('centered', 'rule of thirds', 'symmetrical'),
    style: fc.constantFrom('modern', 'vintage', 'minimalist', 'abstract'),
    colorPalette: fc.array(validHexColorArb, { minLength: 1, maxLength: 6 }),
    prompt: fc.string({ minLength: 10, maxLength: 500 })
  });

  it('brand-adjusted output includes all brand colors from palette', () => {
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, validBrandProfileArb),
        ([analysisResult, brandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
          
          // Should produce a non-null result
          expect(brandAdjustedPrompt).not.toBeNull();
          expect(typeof brandAdjustedPrompt).toBe('string');
          
          // Should include all colors from the brand palette
          for (const color of brandProfile.colorPalette) {
            expect(brandAdjustedPrompt).toContain(color);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('brand-adjusted output includes primary font recommendation', () => {
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, validBrandProfileArb),
        ([analysisResult, brandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
          
          // Should produce a non-null result
          expect(brandAdjustedPrompt).not.toBeNull();
          
          // Should include primary font
          expect(brandAdjustedPrompt).toContain(brandProfile.fonts.primary);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('brand-adjusted output includes secondary font recommendation', () => {
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, validBrandProfileArb),
        ([analysisResult, brandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
          
          // Should produce a non-null result
          expect(brandAdjustedPrompt).not.toBeNull();
          
          // Should include secondary font
          expect(brandAdjustedPrompt).toContain(brandProfile.fonts.secondary);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('brand-adjusted output preserves original prompt content', () => {
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, validBrandProfileArb),
        ([analysisResult, brandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
          
          // Should produce a non-null result
          expect(brandAdjustedPrompt).not.toBeNull();
          
          // Should contain the original prompt
          expect(brandAdjustedPrompt).toContain(analysisResult.prompt);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('brand-adjusted output includes typography section', () => {
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, validBrandProfileArb),
        ([analysisResult, brandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
          
          // Should produce a non-null result
          expect(brandAdjustedPrompt).not.toBeNull();
          
          // Should include typography recommendations section
          expect(brandAdjustedPrompt.toLowerCase()).toContain('typography');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('brand-adjusted output includes color palette section', () => {
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, validBrandProfileArb),
        ([analysisResult, brandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
          
          // Should produce a non-null result
          expect(brandAdjustedPrompt).not.toBeNull();
          
          // Should include brand color section
          expect(brandAdjustedPrompt.toLowerCase()).toContain('brand color');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('brand-adjusted output identifies primary brand color', () => {
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, validBrandProfileArb),
        ([analysisResult, brandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, brandProfile);
          
          // Should produce a non-null result
          expect(brandAdjustedPrompt).not.toBeNull();
          
          // Should identify the primary brand color (first in palette)
          expect(brandAdjustedPrompt).toContain(brandProfile.colorPalette[0]);
          expect(brandAdjustedPrompt.toLowerCase()).toContain('primary');
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: vision-ai-brand, Property 8: No Brand Adjustment Without Profile**
 * 
 * *For any* paid user without a configured brand profile, image analysis SHALL produce 
 * standard output without brand adjustments (brandAdjustedPrompt field is undefined or null).
 * 
 * **Validates: Requirements 3.5**
 */
describe('Property 8: No Brand Adjustment Without Profile', () => {
  // Custom arbitrary for valid hex colors
  const hexCharArb = fc.constantFrom(...'0123456789ABCDEFabcdef'.split(''));
  const validHexColorArb = fc.array(hexCharArb, { minLength: 6, maxLength: 6 })
    .map(chars => '#' + chars.join('').toUpperCase());

  // Custom arbitrary for analysis result with a prompt
  const analysisResultArb = fc.record({
    subject: fc.string({ minLength: 1, maxLength: 50 }),
    medium: fc.constantFrom('photo', 'illustration', '3D render', 'digital art'),
    lighting: fc.constantFrom('natural', 'studio', 'dramatic', 'soft'),
    composition: fc.constantFrom('centered', 'rule of thirds', 'symmetrical'),
    style: fc.constantFrom('modern', 'vintage', 'minimalist', 'abstract'),
    colorPalette: fc.array(validHexColorArb, { minLength: 1, maxLength: 6 }),
    prompt: fc.string({ minLength: 10, maxLength: 500 })
  });

  it('returns null when brand profile is null', () => {
    fc.assert(
      fc.property(
        analysisResultArb,
        (analysisResult) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, null);
          
          // Should return null when no brand profile is provided
          expect(brandAdjustedPrompt).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns null when brand profile is undefined', () => {
    fc.assert(
      fc.property(
        analysisResultArb,
        (analysisResult) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, undefined);
          
          // Should return null when brand profile is undefined
          expect(brandAdjustedPrompt).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('returns null for any falsy brand profile value', () => {
    const falsyValues = [null, undefined, false, 0, ''];
    
    fc.assert(
      fc.property(
        fc.tuple(analysisResultArb, fc.constantFrom(...falsyValues)),
        ([analysisResult, falsyBrandProfile]) => {
          const brandAdjustedPrompt = buildBrandAdjustedPrompt(analysisResult, falsyBrandProfile);
          
          // Should return null for any falsy brand profile
          expect(brandAdjustedPrompt).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});
