'use client';

import React, { useState, useEffect } from 'react';
import { AVAILABLE_FONTS } from '../lib/brand/types';
import { validateColorPalette, validateHexColor } from '../lib/brand/validation';
import { saveBrandProfile, loadBrandProfile, serializeBrandProfile, deserializeBrandProfile } from '../lib/brand/service';

/**
 * BrandSettings Component
 * 
 * Provides interface for paid users to configure their Visual Brand Profile.
 * Includes logo upload with color extraction, color palette picker, font selector,
 * and export/import functionality.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.1, 6.2
 */
export default function BrandSettings({ userId, userTier = 'free' }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState(null);
  const [colorPalette, setColorPalette] = useState(['#000000', '#FFFFFF']);
  const [primaryFont, setPrimaryFont] = useState('Inter');
  const [secondaryFont, setSecondaryFont] = useState('Roboto');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const isPaidUser = userTier !== 'free';

  // Load existing profile on mount
  useEffect(() => {
    if (isPaidUser && userId) {
      const result = loadBrandProfile(userId);
      if (result.profile) {
        setProfile(result.profile);
        setName(result.profile.name);
        setLogo(result.profile.logo || null);
        setColorPalette(result.profile.colorPalette);
        setPrimaryFont(result.profile.fonts.primary);
        setSecondaryFont(result.profile.fonts.secondary);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [userId, isPaidUser]);

  // Requirement 2.5: Show upgrade prompt for free users
  if (!isPaidUser) {
    return (
      <div className="brand-settings-upgrade-prompt bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <svg 
            className="mx-auto h-16 w-16 text-indigo-600 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" 
            />
          </svg>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Brand Customization
          </h3>
          <p className="text-gray-600 mb-6">
            Unlock brand customization to automatically apply your colors, fonts, and logo to AI-generated content.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading brand settings...</div>
      </div>
    );
  }

  // Requirement 2.2: Handle logo upload with color extraction
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(['Please upload a valid image file']);
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      
      // Extract colors from image
      const extractedColors = await extractColorsFromImage(dataUrl);
      
      setLogo({
        url: dataUrl,
        extractedColors
      });
      
      // Optionally update color palette with extracted colors
      if (extractedColors.length >= 2) {
        setColorPalette(extractedColors.slice(0, 6));
      }
      
      setErrors([]);
    };
    reader.readAsDataURL(file);
  };

  // Simple color extraction using canvas
  const extractColorsFromImage = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize to small size for faster processing
        canvas.width = 50;
        canvas.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const pixels = imageData.data;
        
        // Sample colors from different regions
        const colors = [];
        const step = Math.floor(pixels.length / 20); // Sample ~20 colors
        
        for (let i = 0; i < pixels.length; i += step) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
          if (!colors.includes(hex)) {
            colors.push(hex);
          }
          
          if (colors.length >= 6) break;
        }
        
        resolve(colors.slice(0, 6));
      };
      img.src = dataUrl;
    });
  };

  // Requirement 2.3: Handle color palette changes (2-6 colors)
  const handleColorChange = (index, value) => {
    const newPalette = [...colorPalette];
    newPalette[index] = value;
    setColorPalette(newPalette);
    setErrors([]);
  };

  const addColor = () => {
    if (colorPalette.length < 6) {
      setColorPalette([...colorPalette, '#000000']);
    }
  };

  const removeColor = (index) => {
    if (colorPalette.length > 2) {
      const newPalette = colorPalette.filter((_, i) => i !== index);
      setColorPalette(newPalette);
    }
  };

  // Save brand profile
  const handleSave = () => {
    setErrors([]);
    setSuccessMessage('');

    // Validate color palette
    const paletteValidation = validateColorPalette(colorPalette);
    if (!paletteValidation.valid) {
      setErrors(paletteValidation.errors);
      return;
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      setErrors(['Brand name is required']);
      return;
    }

    if (name.length > 100) {
      setErrors(['Brand name must be at most 100 characters']);
      return;
    }

    // Create profile object
    const now = new Date().toISOString();
    const brandProfile = {
      id: profile?.id || `brand_${Date.now()}`,
      name: name.trim(),
      logo,
      colorPalette,
      fonts: {
        primary: primaryFont,
        secondary: secondaryFont
      },
      createdAt: profile?.createdAt || now,
      updatedAt: now
    };

    // Save to localStorage
    const result = saveBrandProfile(userId, brandProfile);
    if (result.success) {
      setProfile(brandProfile);
      setSuccessMessage('Brand profile saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrors(result.errors);
    }
  };

  // Requirement 6.1: Export brand profile to JSON
  const handleExport = () => {
    if (!profile) {
      setErrors(['No brand profile to export. Please save your profile first.']);
      return;
    }

    try {
      const json = serializeBrandProfile(profile);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `brand-profile-${profile.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccessMessage('Brand profile exported successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors([error.message]);
    }
  };

  // Requirement 6.2: Import brand profile from JSON
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target.result;
      const result = deserializeBrandProfile(json);
      
      if (result.profile) {
        // Apply imported profile
        setProfile(result.profile);
        setName(result.profile.name);
        setLogo(result.profile.logo || null);
        setColorPalette(result.profile.colorPalette);
        setPrimaryFont(result.profile.fonts.primary);
        setSecondaryFont(result.profile.fonts.secondary);
        
        setSuccessMessage('Brand profile imported successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setErrors([]);
      } else {
        setErrors(result.errors);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="brand-settings max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Profile Settings</h2>
        
        {/* Error messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Brand Name */}
        <div className="mb-6">
          <label htmlFor="brand-name" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            id="brand-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            placeholder="My Brand"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">{name.length}/100 characters</p>
        </div>

        {/* Logo Upload - Requirement 2.2 */}
        <div className="mb-6">
          <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Logo (Optional)
          </label>
          <div className="flex items-start space-x-4">
            {logo && (
              <div className="flex-shrink-0">
                <img 
                  src={logo.url} 
                  alt="Brand logo" 
                  className="h-24 w-24 object-contain border border-gray-300 rounded-md"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload your logo to automatically extract brand colors
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette - Requirement 2.3 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Palette * (2-6 colors)
          </label>
          <div className="space-y-2">
            {colorPalette.map((color, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value.toUpperCase())}
                  className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value.toUpperCase())}
                  placeholder="#000000"
                  maxLength={7}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                />
                {colorPalette.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    title="Remove color"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {colorPalette.length < 6 && (
            <button
              type="button"
              onClick={addColor}
              className="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Color
            </button>
          )}
        </div>

        {/* Font Selectors - Requirement 2.4 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="primary-font" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Font *
            </label>
            <select
              id="primary-font"
              value={primaryFont}
              onChange={(e) => setPrimaryFont(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {AVAILABLE_FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="secondary-font" className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Font *
            </label>
            <select
              id="secondary-font"
              value={secondaryFont}
              onChange={(e) => setSecondaryFont(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {AVAILABLE_FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Profile
          </button>

          {/* Export Button - Requirement 6.1 */}
          <button
            type="button"
            onClick={handleExport}
            disabled={!profile}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>

          {/* Import Button - Requirement 6.2 */}
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12" />
            </svg>
            Import
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
