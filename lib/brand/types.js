/**
 * Brand Profile Types and Schema
 * 
 * Defines the BrandProfile interface and schema validation for all fields.
 * Requirements: 2.3, 6.3
 */

/**
 * Hex color validation regex - matches #RRGGBB format
 */
export const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

/**
 * @typedef {Object} BrandLogo
 * @property {string} url - Data URL or external URL of the logo
 * @property {string[]} extractedColors - Array of hex colors extracted from logo
 */

/**
 * @typedef {Object} BrandFonts
 * @property {string} primary - Primary font family name
 * @property {string} secondary - Secondary font family name
 */

/**
 * @typedef {Object} BrandProfile
 * @property {string} id - Unique identifier for the profile
 * @property {string} name - Display name for the brand profile
 * @property {BrandLogo} [logo] - Optional logo with extracted colors
 * @property {string[]} colorPalette - Array of 2-6 hex colors
 * @property {BrandFonts} fonts - Primary and secondary font choices
 * @property {string} createdAt - ISO date string of creation
 * @property {string} updatedAt - ISO date string of last update
 */

/**
 * Schema definition for BrandProfile validation
 */
export const BrandProfileSchema = {
  id: { type: 'string', required: true },
  name: { type: 'string', required: true, maxLength: 100 },
  logo: {
    type: 'object',
    required: false,
    properties: {
      url: { type: 'string', required: true },
      extractedColors: { 
        type: 'array', 
        required: true,
        items: { type: 'string', pattern: HEX_COLOR_REGEX }
      }
    }
  },
  colorPalette: {
    type: 'array',
    required: true,
    minItems: 2,
    maxItems: 6,
    items: { type: 'string', pattern: HEX_COLOR_REGEX }
  },
  fonts: {
    type: 'object',
    required: true,
    properties: {
      primary: { type: 'string', required: true },
      secondary: { type: 'string', required: true }
    }
  },
  createdAt: { type: 'string', required: true },
  updatedAt: { type: 'string', required: true }
};

/**
 * Available font options for brand profiles
 */
export const AVAILABLE_FONTS = [
  'Inter',
  'Roboto', 
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Nunito',
  'Raleway',
  'Work Sans'
];

/**
 * Color palette constraints
 */
export const COLOR_PALETTE_CONSTRAINTS = {
  minColors: 2,
  maxColors: 6
};
