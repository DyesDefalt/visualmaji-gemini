# Implementation Plan

- [x] 1. Set up Next.js project structure and configuration

  - [x] 1.1 Create Next.js configuration file (next.config.js)
    - Configure Next.js with App Router
    - Set up image domains for external images
    - _Requirements: 1.1_

  - [x] 1.2 Update package.json with Next.js dependencies and scripts
    - Replace Vite dependencies with Next.js
    - Update scripts (dev, build, start)
    - _Requirements: 1.2_

  - [x] 1.3 Create app directory structure with root layout
    - Create app/layout.jsx with metadata and font configuration
    - Create app/globals.css from existing index.css
    - _Requirements: 1.1, 6.3_

  - [x] 1.4 Update Tailwind configuration for Next.js
    - Update content paths for app directory
    - _Requirements: 6.1_

- [x] 2. Migrate authentication context with SSR safety

  - [x] 2.1 Create SSR-safe AuthContext provider
    - Add 'use client' directive
    - Guard localStorage access with window check
    - Move to components/context/AuthContext.jsx
    - _Requirements: 3.5, 7.1, 7.2_

  - [x] 2.2 Write property test for session restoration round-trip
    - **Property 3: Session restoration round-trip**
    - **Validates: Requirements 3.5**

  - [x] 2.3 Write property test for SSR-safe localStorage access
    - **Property 4: localStorage access is SSR-safe**
    - **Validates: Requirements 7.1**

- [x] 3. Migrate shared components with Next.js navigation

  - [x] 3.1 Update Layout component (Header, Footer, CustomCursor, MagneticButton)
    - Add 'use client' directive
    - Replace react-router-dom Link with next/link
    - Replace useNavigate with useRouter
    - Replace useLocation with usePathname
    - _Requirements: 5.1, 5.2, 5.3, 7.2_

  - [x] 3.2 Update ProtectedRoute component for Next.js
    - Add 'use client' directive
    - Use useRouter for redirect instead of Navigate component
    - _Requirements: 3.3, 5.2_

  - [x] 3.3 Update ScrollHighlightText component
    - Add 'use client' directive
    - _Requirements: 4.3, 7.2_

- [x] 4. Migrate page components to App Router

  - [x] 4.1 Create Home page (app/page.jsx)
    - Add 'use client' directive
    - Update imports for new component locations
    - _Requirements: 2.1, 4.1_

  - [x] 4.2 Create Pricing page (app/pricing/page.jsx)
    - Add 'use client' directive
    - Replace useNavigate with useRouter
    - _Requirements: 2.2_

  - [x] 4.3 Create Login page (app/login/page.jsx)
    - Add 'use client' directive
    - Replace useNavigate/useLocation with Next.js hooks
    - _Requirements: 2.3, 3.1, 3.2_

  - [x] 4.4 Write property test for valid login credentials
    - **Property 1: Valid login credentials result in authenticated state**
    - **Validates: Requirements 3.1**

  - [x] 4.5 Write property test for valid signup data
    - **Property 2: Valid signup data creates authenticated user**
    - **Validates: Requirements 3.2**

  - [x] 4.6 Create Dashboard page (app/dashboard/page.jsx)
    - Add 'use client' directive
    - Replace useNavigate with useRouter
    - _Requirements: 2.4, 3.3_

  - [x] 4.7 Create About page (app/about/page.jsx)
    - Add 'use client' directive
    - _Requirements: 2.5_

  - [x] 4.8 Create Contact page (app/contact/page.jsx)
    - Add 'use client' directive
    - _Requirements: 2.6_

  - [x] 4.9 Create Articles page (app/articles/page.jsx)
    - Add 'use client' directive
    - _Requirements: 2.7_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Clean up and remove Vite artifacts

  - [x] 6.1 Remove Vite-specific files and old src directory
    - Delete vite.config.js
    - Delete index.html (Next.js generates this)
    - Delete src/main.jsx and src/App.jsx
    - Remove old src directory after migration complete
    - _Requirements: 1.1_

  - [x] 6.2 Update package.json to remove Vite dependencies
    - Remove vite, @vitejs/plugin-react from devDependencies
    - Keep vitest and related test dependencies (Vitest is independent of Vite)
    - _Requirements: 1.2_

  - [x] 6.3 Verify build and run
    - Run npm install
    - Run npm run build to verify production build works
    - _Requirements: 1.3, 1.4_

- [x] 7. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Final cleanup - Remove empty src directory

  - [x] 8.1 Remove empty src directory structure
    - Delete src/components (empty)
    - Delete src/context (empty)
    - Delete src/pages (empty)
    - Delete src directory
    - _Requirements: 1.1_

---

## Migration Complete ✓

All tasks have been verified against the current codebase (December 6, 2025):

**Verified Implementation:**
- Next.js App Router structure in place (`app/` directory with all pages)
- `next.config.js` configured with App Router and image domains
- `package.json` updated with Next.js dependencies, Vite dependencies removed
- Authentication context (`components/context/AuthContext.jsx`) is SSR-safe with `typeof window !== 'undefined'` guards
- All components use Next.js navigation (`next/link`, `useRouter`, `usePathname`)
- All pages have `'use client'` directive for client-side features
- Property-based tests implemented for all 4 correctness properties in `__tests__/AuthContext.test.jsx`
- No remaining Vite artifacts (`vite.config.js`, `src/` directory removed)
- Tailwind CSS configured for Next.js app directory
