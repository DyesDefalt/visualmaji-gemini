'use client';

import React from 'react';

/**
 * BrandPreview Component
 * 
 * Displays a live preview of brand settings including color swatches
 * and sample text in selected fonts. Updates automatically as settings change.
 * 
 * Requirements: 4.1, 4.2, 4.3
 */
export default function BrandPreview({ 
  colorPalette = [], 
  primaryFont = 'Inter', 
  secondaryFont = 'Roboto',
  brandName = 'Your Brand'
}) {
  // Ensure we have valid colors to display
  const validColors = colorPalette.filter(color => 
    typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/i.test(color)
  );

  return (
    <div className="brand-preview bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Preview</h3>
      
      {/* Color Swatches - Requirement 4.2 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Color Palette</h4>
        {validColors.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {validColors.map((color, index) => (
              <div 
                key={`${color}-${index}`}
                className="color-swatch flex flex-col items-center"
              >
                <div
                  className="w-12 h-12 rounded-lg shadow-sm border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                  data-testid={`color-swatch-${index}`}
                  data-color={color}
                />
                <span className="mt-1 text-xs text-gray-500 font-mono">
                  {color.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No colors configured</p>
        )}
      </div>

      {/* Typography Preview - Requirement 4.3 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Typography</h4>
        <div className="space-y-4 bg-white rounded-lg p-4 border border-gray-100">
          {/* Primary Font Sample */}
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Primary Font</span>
            <p 
              className="text-2xl text-gray-900 mt-1"
              style={{ fontFamily: `"${primaryFont}", sans-serif` }}
              data-testid="primary-font-sample"
              data-font={primaryFont}
            >
              {brandName}
            </p>
            <p 
              className="text-base text-gray-600 mt-1"
              style={{ fontFamily: `"${primaryFont}", sans-serif` }}
            >
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
          
          {/* Secondary Font Sample */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Secondary Font</span>
            <p 
              className="text-xl text-gray-900 mt-1"
              style={{ fontFamily: `"${secondaryFont}", sans-serif` }}
              data-testid="secondary-font-sample"
              data-font={secondaryFont}
            >
              Subheading Example
            </p>
            <p 
              className="text-sm text-gray-600 mt-1"
              style={{ fontFamily: `"${secondaryFont}", sans-serif` }}
            >
              Body text using your secondary font. Perfect for paragraphs and longer content.
            </p>
          </div>
        </div>
      </div>

      {/* Combined Preview - Requirement 4.1 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sample Output</h4>
        <div 
          className="rounded-lg p-4 border border-gray-100"
          style={{ 
            backgroundColor: validColors[0] || '#f3f4f6',
            color: getContrastColor(validColors[0] || '#f3f4f6')
          }}
        >
          <h5 
            className="text-lg font-bold mb-2"
            style={{ fontFamily: `"${primaryFont}", sans-serif` }}
          >
            {brandName}
          </h5>
          <p 
            className="text-sm opacity-90"
            style={{ fontFamily: `"${secondaryFont}", sans-serif` }}
          >
            This is how your brand-adjusted AI output might look with your selected colors and fonts.
          </p>
          {validColors.length > 1 && (
            <div className="mt-3 flex gap-2">
              {validColors.slice(1).map((color, index) => (
                <span
                  key={`accent-${index}`}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: color,
                    color: getContrastColor(color)
                  }}
                >
                  Accent {index + 1}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate contrasting text color (black or white) based on background
 * @param {string} hexColor - Hex color string
 * @returns {string} - '#000000' or '#FFFFFF'
 */
function getContrastColor(hexColor) {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light backgrounds, white for dark
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
