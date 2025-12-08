'use client';

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { Footer } from '../components/Layout';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  useSpring: () => ({ set: vi.fn() }),
  useMotionValue: () => ({ set: vi.fn() }),
  AnimatePresence: ({ children }) => children,
}));

// **Feature: legal-pages, Property 2: Footer legal links navigation**
// **Validates: Requirements 5.2**
describe('Property 2: Footer legal links navigation', () => {
  const expectedLegalLinks = [
    { text: 'Terms of Service', href: '/legal/terms' },
    { text: 'Privacy Policy', href: '/legal/privacy' },
    { text: 'Cookie Policy', href: '/legal/cookies' },
    { text: 'Acceptable Use', href: '/legal/acceptable-use' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('*For any* legal link in the footer, the link href SHALL point to the correct corresponding legal page route', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...expectedLegalLinks),
        (legalLink) => {
          const setCursorVariant = vi.fn();
          
          const { unmount } = render(<Footer setCursorVariant={setCursorVariant} />);
          
          // Find the link by its text content
          const linkElement = screen.getByRole('link', { name: legalLink.text });
          
          // Verify the link exists and has the correct href
          expect(linkElement).toBeInTheDocument();
          expect(linkElement).toHaveAttribute('href', legalLink.href);
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('footer SHALL contain all four legal links with correct routes', () => {
    const setCursorVariant = vi.fn();
    
    render(<Footer setCursorVariant={setCursorVariant} />);
    
    // Verify all legal links are present with correct hrefs
    for (const legalLink of expectedLegalLinks) {
      const linkElement = screen.getByRole('link', { name: legalLink.text });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', legalLink.href);
    }
  });
});
