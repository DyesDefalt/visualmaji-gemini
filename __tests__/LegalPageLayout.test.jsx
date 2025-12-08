'use client';

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../components/context/AuthContext';

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
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  },
  useSpring: () => ({ set: vi.fn() }),
  useMotionValue: () => ({ set: vi.fn() }),
  AnimatePresence: ({ children }) => children,
}));

// Import legal page components
import TermsOfService from '../app/legal/terms/page';
import PrivacyPolicy from '../app/legal/privacy/page';
import CookiePolicy from '../app/legal/cookies/page';
import AcceptableUse from '../app/legal/acceptable-use/page';

// Wrapper component to provide AuthContext
const TestWrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

// **Feature: legal-pages, Property 1: Legal page layout consistency**
// **Validates: Requirements 6.1, 6.2**
describe('Property 1: Legal page layout consistency', () => {
  const legalPages = [
    { name: 'Terms of Service', component: TermsOfService, route: '/legal/terms' },
    { name: 'Privacy Policy', component: PrivacyPolicy, route: '/legal/privacy' },
    { name: 'Cookie Policy', component: CookiePolicy, route: '/legal/cookies' },
    { name: 'Acceptable Use Policy', component: AcceptableUse, route: '/legal/acceptable-use' },
  ];

  const expectedFooterLegalLinks = [
    { text: 'Terms of Service', href: '/legal/terms' },
    { text: 'Privacy Policy', href: '/legal/privacy' },
    { text: 'Cookie Policy', href: '/legal/cookies' },
    { text: 'Acceptable Use', href: '/legal/acceptable-use' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('*For any* legal page, the rendered page SHALL include both the standard Header component and the standard Footer component with all legal links', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...legalPages),
        (legalPage) => {
          const PageComponent = legalPage.component;
          
          const { unmount } = render(<PageComponent />, { wrapper: TestWrapper });
          
          // Verify Header is present by checking for VIMA logo/brand text
          const vimaElements = screen.getAllByText('VIMA');
          expect(vimaElements.length).toBeGreaterThan(0);
          
          // Verify Header navigation links are present
          const homeLink = screen.getByRole('link', { name: 'Home' });
          expect(homeLink).toBeInTheDocument();
          
          const aboutLink = screen.getByRole('link', { name: 'About' });
          expect(aboutLink).toBeInTheDocument();
          
          // Verify Footer is present by checking for footer legal links
          for (const footerLink of expectedFooterLegalLinks) {
            const linkElements = screen.getAllByRole('link', { name: footerLink.text });
            // At least one link should exist (in footer)
            expect(linkElements.length).toBeGreaterThan(0);
            // Verify at least one has the correct href
            const hasCorrectHref = linkElements.some(
              (el) => el.getAttribute('href') === footerLink.href
            );
            expect(hasCorrectHref).toBe(true);
          }
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  it('each legal page SHALL display the standard VIMA header with navigation', () => {
    for (const legalPage of legalPages) {
      const PageComponent = legalPage.component;
      
      const { unmount } = render(<PageComponent />, { wrapper: TestWrapper });
      
      // Verify Header navigation elements (use getAllByRole since some links appear in both header and footer)
      expect(screen.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Articles' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Pricing' }).length).toBeGreaterThan(0);
      expect(screen.getAllByRole('link', { name: 'Contact' }).length).toBeGreaterThan(0);
      
      unmount();
    }
  });

  it('each legal page SHALL display the standard VIMA footer with all legal links', () => {
    for (const legalPage of legalPages) {
      const PageComponent = legalPage.component;
      
      const { unmount } = render(<PageComponent />, { wrapper: TestWrapper });
      
      // Verify all footer legal links are present with correct hrefs
      for (const footerLink of expectedFooterLegalLinks) {
        const linkElements = screen.getAllByRole('link', { name: footerLink.text });
        expect(linkElements.length).toBeGreaterThan(0);
        
        const hasCorrectHref = linkElements.some(
          (el) => el.getAttribute('href') === footerLink.href
        );
        expect(hasCorrectHref).toBe(true);
      }
      
      unmount();
    }
  });
});
