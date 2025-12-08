# Design Document: Vite to Next.js Migration

## Overview

This document outlines the technical design for migrating the Visual Maji (VIMA) application from Vite to Next.js. The migration involves restructuring the project to use Next.js App Router conventions, replacing react-router-dom with Next.js navigation, ensuring SSR compatibility, and preserving all existing functionality including authentication, animations, and styling.

## Architecture

### Current Architecture (Vite)
```
src/
├── main.jsx          # Entry point with ReactDOM.createRoot
├── App.jsx           # Router configuration with react-router-dom
├── index.css         # Global styles
├── components/       # Shared components
├── context/          # React Context providers
└── pages/            # Page components
```

### Target Architecture (Next.js App Router)
```
app/
├── layout.jsx        # Root layout with providers
├── page.jsx          # Home page (/)
├── globals.css       # Global styles
├── pricing/
│   └── page.jsx      # Pricing page
├── login/
│   └── page.jsx      # Login page
├── dashboard/
│   └── page.jsx      # Dashboard page (protected)
├── about/
│   └── page.jsx      # About page
├── contact/
│   └── page.jsx      # Contact page
└── articles/
    └── page.jsx      # Articles page
components/           # Shared components (client components)
context/              # React Context providers (client components)
```

### Key Architectural Changes

1. **File-based Routing**: Replace react-router-dom Routes with Next.js file-based routing in the `app` directory
2. **Server/Client Components**: Mark components using browser APIs with `'use client'` directive
3. **Layout System**: Use Next.js layouts for shared UI (providers, metadata)
4. **Navigation**: Replace `useNavigate`, `useLocation`, `Link` from react-router-dom with Next.js equivalents

## Components and Interfaces

### Root Layout (`app/layout.jsx`)
- Wraps all pages with AuthProvider
- Includes global CSS imports
- Sets up metadata (title, fonts)
- Must be a Server Component wrapper with Client Component children

### AuthProvider (`components/context/AuthContext.jsx`)
- Must be marked as `'use client'`
- Handles localStorage access safely (check `typeof window !== 'undefined'`)
- Provides: `user`, `loading`, `login`, `signup`, `logout`, `updatePlan`

### Navigation Components
- **Header**: Use `next/link` for Link, `usePathname` for current route, `useRouter` for programmatic navigation
- **MagneticButton**: Update to use `useRouter().push()` instead of `useNavigate()`
- **ProtectedRoute**: Use `redirect()` from `next/navigation` or client-side redirect

### Page Components
All page components will be Client Components (marked with `'use client'`) because they use:
- Framer Motion animations
- useState/useEffect hooks
- Browser APIs (window, localStorage)

## Data Models

### User Model (unchanged)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'lite' | 'standard' | 'creator' | 'business';
  usageToday: number;
  usageMonth: number;
  credits: number;
  createdAt: string;
}
```

### Auth Context Value (unchanged)
```typescript
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name?: string) => Promise<User>;
  logout: () => void;
  updatePlan: (plan: string) => void;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid login credentials result in authenticated state
*For any* valid email and password (password length >= 6), calling the login function SHALL result in a non-null user state and the user being stored in localStorage.
**Validates: Requirements 3.1**

### Property 2: Valid signup data creates authenticated user
*For any* valid email, password (length >= 6), and optional name, calling the signup function SHALL result in a non-null user state with the provided email and name.
**Validates: Requirements 3.2**

### Property 3: Session restoration round-trip
*For any* user object stored in localStorage under 'vima_user', when the AuthProvider initializes, it SHALL restore that exact user object to the user state.
**Validates: Requirements 3.5**

### Property 4: localStorage access is SSR-safe
*For any* code path that accesses localStorage, the access SHALL be guarded by a check for `typeof window !== 'undefined'` to prevent SSR errors.
**Validates: Requirements 7.1**

## Error Handling

### SSR Compatibility Errors
- **Problem**: Accessing `window`, `localStorage`, `document` during server-side rendering
- **Solution**: Guard all browser API access with `typeof window !== 'undefined'` checks
- **Implementation**: Use `useEffect` for client-side only code, mark components with `'use client'`

### Navigation Errors
- **Problem**: Using react-router-dom hooks in Next.js
- **Solution**: Replace with Next.js equivalents:
  - `useNavigate()` → `useRouter().push()`
  - `useLocation()` → `usePathname()`
  - `<Link to="">` → `<Link href="">`
  - `<Navigate to="">` → `redirect()` or `useRouter().replace()`

### Authentication Redirect Errors
- **Problem**: ProtectedRoute using react-router-dom Navigate
- **Solution**: Use `useRouter().replace('/login')` in useEffect or Next.js middleware

## Testing Strategy

### Dual Testing Approach

This migration will use both unit tests and property-based tests to ensure correctness:

1. **Unit Tests**: Verify specific examples and edge cases
2. **Property-Based Tests**: Verify universal properties across many inputs

### Property-Based Testing Framework

- **Library**: fast-check (JavaScript property-based testing library)
- **Configuration**: Minimum 100 iterations per property test
- **Location**: `__tests__/` directory with `.test.js` suffix

### Test Categories

#### Unit Tests
- Route existence verification
- Component rendering tests
- Navigation hook usage verification

#### Property-Based Tests
- Authentication flow properties (login, signup, session restoration)
- SSR safety properties (localStorage access patterns)

### Test Annotations
Each property-based test will be tagged with:
```javascript
// **Feature: vite-to-nextjs-migration, Property {number}: {property_text}**
// **Validates: Requirements X.Y**
```
