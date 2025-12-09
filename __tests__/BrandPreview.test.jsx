'use client';

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import BrandPreview from '../components/BrandPreview';

// Custom arbitrary for valid hex colors - generates 6 hex characters
const hexCharArb = fc.constantFrom(...'0123456789ABCDEFabcdef'.split(''));
const validHexColorArb = fc.array(hexCharArb, { minLength: 6, maxLength: 6 })
  .map(chars => '#' + chars.join('').toUpperCase());

// Valid color palette generator (2-6 colors as per requirements)
const validColorPaletteArb = fc.array(validHexColorArb, { minLength: 2, maxLength: 6 });

// Font generator
const fontArb = fc.constantFrom('Inter', 'Roboto', 'Open Sans', 'Lato');

// Brand name generator
const brandNameArb = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0);

/**
 * **Feature: vision-ai-brand, Property 9: Preview Color Swatches Match Palette**
 * 
 * *For any* brand profile configuration, the preview component SHALL display 
 * color swatches that exactly match the configured color palette.
 * 
 * **Validates: Requirements 4.2**
 */
describe('Property 9: Preview Color Swatches Match Palette', () => {
  it('renders color swatches that exactly match the configured color palette', () => {
    fc.assert(
      fc.property(
        validColorPaletteArb,
        fontArb,
        fontArb,
        brandNameArb,
        (colorPalette, primaryFont, secondaryFont, brandName) => {
          const { container } = render(
            <BrandPreview
              colorPalette={colorPalette}
              primaryFont={primaryFont}
              secondaryFont={secondaryFont}
              brandName={brandName}
            />
          );

          // Get all rendered color swatches
          const swatches = container.querySelectorAll('[data-testid^="color-swatch-"]');
          
          // Number of swatches should match palette length
          expect(swatches.length).toBe(colorPalette.length);
          
          // Each swatch should have the correct color from the palette
          colorPalette.forEach((color, index) => {
            const swatch = container.querySelector(`[data-testid="color-swatch-${index}"]`);
            expect(swatch).not.toBeNull();
            
            // Verify the data-color attribute matches the palette color
            const swatchColor = swatch.getAttribute('data-color');
            expect(swatchColor.toUpperCase()).toBe(color.toUpperCase());
            
            // Verify the background color style is set correctly
            expect(swatch.style.backgroundColor).toBeTruthy();
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('renders swatches in the same order as the color palette', () => {
    fc.assert(
      fc.property(
        validColorPaletteArb,
        (colorPalette) => {
          const { container } = render(
            <BrandPreview colorPalette={colorPalette} />
          );

          // Get all swatches in DOM order
          const swatches = container.querySelectorAll('[data-testid^="color-swatch-"]');
          const renderedColors = Array.from(swatches).map(s => s.getAttribute('data-color').toUpperCase());
          
          // Colors should be in the same order as the input palette
          const normalizedPalette = colorPalette.map(c => c.toUpperCase());
          expect(renderedColors).toEqual(normalizedPalette);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('displays no swatches when color palette is empty', () => {
    const { container } = render(
      <BrandPreview colorPalette={[]} />
    );

    const swatches = container.querySelectorAll('[data-testid^="color-swatch-"]');
    expect(swatches.length).toBe(0);
    
    // Should show "No colors configured" message
    expect(container.textContent).toContain('No colors configured');
  });

  it('filters out invalid hex colors and only renders valid ones', () => {
    fc.assert(
      fc.property(
        validColorPaletteArb,
        fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 3 }),
        (validColors, invalidColors) => {
          // Mix valid and invalid colors
          const mixedPalette = [...validColors, ...invalidColors];
          
          const { container } = render(
            <BrandPreview colorPalette={mixedPalette} />
          );

          // Get all rendered swatches
          const swatches = container.querySelectorAll('[data-testid^="color-swatch-"]');
          
          // Should only render valid hex colors
          expect(swatches.length).toBe(validColors.length);
          
          // Each rendered swatch should be from the valid colors
          Array.from(swatches).forEach(swatch => {
            const swatchColor = swatch.getAttribute('data-color').toUpperCase();
            const isValidColor = validColors.some(c => c.toUpperCase() === swatchColor);
            expect(isValidColor).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('each swatch displays the hex color code as text', () => {
    fc.assert(
      fc.property(
        validColorPaletteArb,
        (colorPalette) => {
          const { container } = render(
            <BrandPreview colorPalette={colorPalette} />
          );

          // Each color in the palette should have its hex code displayed
          colorPalette.forEach(color => {
            // The component displays colors in uppercase
            expect(container.textContent).toContain(color.toUpperCase());
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('handles lowercase and uppercase hex colors consistently', () => {
    fc.assert(
      fc.property(
        fc.array(hexCharArb, { minLength: 6, maxLength: 6 }),
        fc.boolean(),
        (hexChars, useUppercase) => {
          const hexString = hexChars.join('');
          const color = '#' + (useUppercase ? hexString.toUpperCase() : hexString.toLowerCase());
          
          const { container } = render(
            <BrandPreview colorPalette={[color, '#FFFFFF']} />
          );

          // Should render the swatch regardless of case
          const swatches = container.querySelectorAll('[data-testid^="color-swatch-"]');
          expect(swatches.length).toBe(2);
          
          // First swatch should match our color (case-insensitive)
          const firstSwatch = container.querySelector('[data-testid="color-swatch-0"]');
          expect(firstSwatch.getAttribute('data-color').toUpperCase()).toBe(('#' + hexString).toUpperCase());
        }
      ),
      { numRuns: 100 }
    );
  });
});
