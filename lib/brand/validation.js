/**
 * Brand Profile Validation Functions
 * 
 * Implements validation for color palettes and brand profiles.
 * Requirements: 2.3, 6.3
 */

import {
  HEX_COLOR_REGEX,
  COLOR_PALETTE_CONSTRAINTS
} from './types.js';

/**
 * Validates a single hex color string
 * @param {string} color - The color string to validate
 * @returns {boolean} True if valid hex color (#RRGGBB format)
 */
export function validateHexColor(color) {
  if (typeof color !== 'string') {
    return false;
  }
  return HEX_COLOR_REGEX.test(color);
}

/**
 * Validates a color palette array
 * @param {string[]} colors - Array of color strings to validate
 * @returns {{ valid: boolean, errors: string[] }} Validation result with errors
 */
export function validateColorPalette(colors) {
  const errors = [];
  
  // Check if colors is an array
  if (!Array.isArray(colors)) {
    return { valid: false, errors: ['Color palette must be an array'] };
  }
  
  // Check minimum colors
  if (colors.length < COLOR_PALETTE_CONSTRAINTS.minColors) {
    errors.push(`Color palette must contain at least ${COLOR_PALETTE_CONSTRAINTS.minColors} colors`);
  }
  
  // Check maximum colors
  if (colors.length > COLOR_PALETTE_CONSTRAINTS.maxColors) {
    errors.push(`Color palette must contain at most ${COLOR_PALETTE_CONSTRAINTS.maxColors} colors`);
  }
  
  // Validate each color
  colors.forEach((color, index) => {
    if (!validateHexColor(color)) {
      errors.push(`Invalid hex color at index ${index}: ${color}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}


/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the profile is valid
 * @property {string[]} errors - Array of validation error messages
 */

/**
 * Validates a complete brand profile
 * @param {unknown} profile - The profile object to validate
 * @returns {ValidationResult} Validation result with detailed errors
 */
export function validateBrandProfile(profile) {
  const errors = [];
  
  // Check if profile is an object
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    return { valid: false, errors: ['Brand profile must be an object'] };
  }
  
  // Validate id (required string)
  if (!profile.id || typeof profile.id !== 'string') {
    errors.push('id is required and must be a string');
  }
  
  // Validate name (required string, max 100 chars)
  if (!profile.name || typeof profile.name !== 'string') {
    errors.push('name is required and must be a string');
  } else if (profile.name.length > 100) {
    errors.push('name must be at most 100 characters');
  }
  
  // Validate logo (optional object with url and extractedColors)
  if (profile.logo !== undefined && profile.logo !== null) {
    if (typeof profile.logo !== 'object' || Array.isArray(profile.logo)) {
      errors.push('logo must be an object');
    } else {
      if (!profile.logo.url || typeof profile.logo.url !== 'string') {
        errors.push('logo.url is required and must be a string');
      }
      if (!Array.isArray(profile.logo.extractedColors)) {
        errors.push('logo.extractedColors must be an array');
      } else {
        profile.logo.extractedColors.forEach((color, index) => {
          if (!validateHexColor(color)) {
            errors.push(`logo.extractedColors[${index}] is not a valid hex color`);
          }
        });
      }
    }
  }
  
  // Validate colorPalette (required array of 2-6 hex colors)
  if (!profile.colorPalette) {
    errors.push('colorPalette is required');
  } else {
    const paletteResult = validateColorPalette(profile.colorPalette);
    if (!paletteResult.valid) {
      errors.push(...paletteResult.errors);
    }
  }
  
  // Validate fonts (required object with primary and secondary)
  if (!profile.fonts || typeof profile.fonts !== 'object' || Array.isArray(profile.fonts)) {
    errors.push('fonts is required and must be an object');
  } else {
    if (!profile.fonts.primary || typeof profile.fonts.primary !== 'string') {
      errors.push('fonts.primary is required and must be a string');
    }
    if (!profile.fonts.secondary || typeof profile.fonts.secondary !== 'string') {
      errors.push('fonts.secondary is required and must be a string');
    }
  }
  
  // Validate createdAt (required ISO date string)
  if (!profile.createdAt || typeof profile.createdAt !== 'string') {
    errors.push('createdAt is required and must be a string');
  }
  
  // Validate updatedAt (required ISO date string)
  if (!profile.updatedAt || typeof profile.updatedAt !== 'string') {
    errors.push('updatedAt is required and must be a string');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
