'use client';

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../components/context/AuthContext';

// **Feature: vite-to-nextjs-migration, Property 1: Valid login credentials result in authenticated state**
// **Validates: Requirements 3.1**
describe('Property 1: Valid login credentials result in authenticated state', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should authenticate user with valid email and password (length >= 6)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 6, maxLength: 20 }),
        async (email, password) => {
          localStorage.clear();
          
          const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
          });

          // Wait for initial loading to complete
          await waitFor(() => {
            expect(result.current.loading).toBe(false);
          });

          // Perform login
          await act(async () => {
            await result.current.login(email, password);
          });

          // Verify user is authenticated (non-null user state)
          expect(result.current.user).not.toBeNull();
          expect(result.current.user.email).toBe(email);
          
          // Verify user is stored in localStorage
          const storedUser = localStorage.getItem('vima_user');
          expect(storedUser).not.toBeNull();
          const parsedUser = JSON.parse(storedUser);
          expect(parsedUser.email).toBe(email);
          
          localStorage.clear();
        }
      ),
      { numRuns: 10 } // Reduced for async operations with 1s delay
    );
  }, 60000); // 60 second timeout for property test

  it('should reject login with password shorter than 6 characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 1, maxLength: 5 }),
        async (email, shortPassword) => {
          localStorage.clear();
          
          const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
          });

          await waitFor(() => {
            expect(result.current.loading).toBe(false);
          });

          // Attempt login with short password should reject
          let errorThrown = false;
          await act(async () => {
            try {
              await result.current.login(email, shortPassword);
            } catch (e) {
              errorThrown = true;
            }
          });

          expect(errorThrown).toBe(true);
          // User should remain null
          expect(result.current.user).toBeNull();
          
          localStorage.clear();
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);
});


// **Feature: vite-to-nextjs-migration, Property 2: Valid signup data creates authenticated user**
// **Validates: Requirements 3.2**
describe('Property 2: Valid signup data creates authenticated user', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create authenticated user with valid email, password (>= 6), and optional name', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 6, maxLength: 20 }),
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
        async (email, password, name) => {
          localStorage.clear();
          
          const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
          });

          await waitFor(() => {
            expect(result.current.loading).toBe(false);
          });

          // Perform signup
          await act(async () => {
            await result.current.signup(email, password, name);
          });

          // Verify user is authenticated (non-null user state)
          expect(result.current.user).not.toBeNull();
          expect(result.current.user.email).toBe(email);
          
          // Verify name is set correctly (provided name or derived from email)
          if (name) {
            expect(result.current.user.name).toBe(name);
          } else {
            expect(result.current.user.name).toBe(email.split('@')[0]);
          }
          
          // Verify user is stored in localStorage
          const storedUser = localStorage.getItem('vima_user');
          expect(storedUser).not.toBeNull();
          
          localStorage.clear();
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);

  it('should reject signup with password shorter than 6 characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 1, maxLength: 5 }),
        fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
        async (email, shortPassword, name) => {
          localStorage.clear();
          
          const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
          });

          await waitFor(() => {
            expect(result.current.loading).toBe(false);
          });

          // Attempt signup with short password should reject
          let errorThrown = false;
          await act(async () => {
            try {
              await result.current.signup(email, shortPassword, name);
            } catch (e) {
              errorThrown = true;
            }
          });

          expect(errorThrown).toBe(true);
          // User should remain null
          expect(result.current.user).toBeNull();
          
          localStorage.clear();
        }
      ),
      { numRuns: 10 }
    );
  }, 60000);
});

// **Feature: vite-to-nextjs-migration, Property 3: Session restoration round-trip**
// **Validates: Requirements 3.5**
describe('Property 3: Session restoration round-trip', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should restore user from localStorage on initialization', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 20 }),
          email: fc.emailAddress(),
          name: fc.string({ minLength: 1, maxLength: 20 }),
          plan: fc.constantFrom('free', 'lite', 'standard', 'creator', 'business'),
          usageToday: fc.nat({ max: 1000 }),
          usageMonth: fc.nat({ max: 10000 }),
          credits: fc.nat({ max: 10000 }),
          createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).map(d => d.toISOString()),
        }),
        async (mockUser) => {
          // Store user in localStorage
          localStorage.setItem('vima_user', JSON.stringify(mockUser));

          // Render the hook with AuthProvider
          const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
          });

          // Wait for loading to complete
          await waitFor(() => {
            expect(result.current.loading).toBe(false);
          });

          // Verify the user was restored correctly
          expect(result.current.user).toEqual(mockUser);

          // Clean up for next iteration
          localStorage.clear();
        }
      ),
      { numRuns: 50 } // No async delay, can run more iterations
    );
  }, 30000);
});

// **Feature: vite-to-nextjs-migration, Property 4: localStorage access is SSR-safe**
// **Validates: Requirements 7.1**
describe('Property 4: localStorage access is SSR-safe', () => {
  it('should guard all localStorage access with window check', async () => {
    // Read the AuthContext source file and verify all localStorage accesses are guarded
    const fs = await import('fs');
    const path = await import('path');
    
    const authContextPath = path.join(process.cwd(), 'components', 'context', 'AuthContext.jsx');
    const sourceCode = fs.readFileSync(authContextPath, 'utf-8');
    
    // Count unique localStorage access locations by finding lines with localStorage
    const lines = sourceCode.split('\n');
    let localStorageLines = 0;
    let guardedBlocks = 0;
    let inGuardedBlock = false;
    let braceCount = 0;
    
    for (const line of lines) {
      if (line.includes("typeof window !== 'undefined'") || line.includes('typeof window !== "undefined"')) {
        inGuardedBlock = true;
        braceCount = 0;
      }
      
      if (inGuardedBlock) {
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;
        if (braceCount <= 0 && line.includes('}')) {
          inGuardedBlock = false;
        }
      }
      
      if (line.includes('localStorage.')) {
        localStorageLines++;
        if (inGuardedBlock || line.includes("typeof window !== 'undefined'")) {
          guardedBlocks++;
        }
      }
    }
    
    // All localStorage accesses should be guarded
    expect(guardedBlocks).toBe(localStorageLines);
    expect(localStorageLines).toBeGreaterThan(0); // Ensure we found some localStorage accesses
  });

  it('should initialize with null user when localStorage is empty', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null), // Just need to run the test
        async () => {
          // Clear localStorage
          localStorage.clear();
          
          // The AuthProvider should initialize without errors even with empty localStorage
          const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
          });

          // Wait for loading to complete
          await waitFor(() => {
            expect(result.current.loading).toBe(false);
          });

          // User should be null when no stored user exists
          expect(result.current.user).toBeNull();
        }
      ),
      { numRuns: 10 }
    );
  }, 10000);
});
