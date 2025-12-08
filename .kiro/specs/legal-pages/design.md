# Design Document: Legal Pages Feature

## Overview

This feature adds four legal pages (Terms of Service, Privacy Policy, Cookie Policy, and Acceptable Use Policy) to the Visual Maji (VIMA) Next.js application. Each page will follow the existing design patterns and use the shared Layout components (Header and Footer). The Footer component will be updated to include a new "Legal" section with links to all legal pages.

## Architecture

The legal pages feature follows the existing Next.js App Router architecture:

```
app/
├── legal/
│   ├── terms/
│   │   └── page.jsx          # Terms of Service page
│   ├── privacy/
│   │   └── page.jsx          # Privacy Policy page
│   ├── cookies/
│   │   └── page.jsx          # Cookie Policy page
│   └── acceptable-use/
│       └── page.jsx          # Acceptable Use Policy page
components/
└── Layout.jsx                 # Updated Footer with Legal section
```

All legal pages will be static pages using Next.js App Router conventions. They will share a common layout pattern with the Header and Footer components.

## Components and Interfaces

### LegalPageLayout Pattern

Each legal page will follow a consistent structure:

```jsx
// Common structure for all legal pages
const LegalPage = () => {
  const [cursorVariant, setCursorVariant] = useState('default');
  
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <CustomCursor cursorVariant={cursorVariant} />
      <Header setCursorVariant={setCursorVariant} />
      
      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-500 mb-4">Last updated: [DATE]</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">[PAGE TITLE]</h1>
          
          {/* Content sections */}
          <div className="prose prose-stone prose-lg max-w-none">
            {/* Section content */}
          </div>
        </div>
      </main>
      
      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
};
```

### Footer Component Update

The existing Footer component in `components/Layout.jsx` will be updated to include a new "Legal" column:

```jsx
// New Legal section in Footer grid
<div>
  <h5 className="text-white font-bold mb-4">Legal</h5>
  <ul className="space-y-2">
    <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
    <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
    <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
    <li><Link href="/legal/acceptable-use" className="hover:text-white transition-colors">Acceptable Use</Link></li>
  </ul>
</div>
```

### Legal Page Routes

| Route | Page | Description |
|-------|------|-------------|
| `/legal/terms` | Terms of Service | Service usage rules and conditions |
| `/legal/privacy` | Privacy Policy | Data collection and usage practices |
| `/legal/cookies` | Cookie Policy | Cookie usage and management |
| `/legal/acceptable-use` | Acceptable Use Policy | Permitted and prohibited activities |

## Data Models

This feature uses static content and does not require database models. The legal content is hardcoded in each page component.

### Content Structure

Each legal page contains:
- `lastUpdated`: Date string (e.g., "December 7, 2025")
- `title`: Page title string
- `sections`: Array of content sections with headings and paragraphs

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following correctness properties have been identified:

### Property 1: Legal page layout consistency
*For any* legal page (terms, privacy, cookies, acceptable-use), the rendered page SHALL include both the standard Header component and the standard Footer component with all legal links.
**Validates: Requirements 6.1, 6.2**

### Property 2: Footer legal links navigation
*For any* legal link in the footer (Terms of Service, Privacy Policy, Cookie Policy, Acceptable Use Policy), the link href SHALL point to the correct corresponding legal page route.
**Validates: Requirements 5.2**

## Error Handling

Since legal pages are static content pages, error handling is minimal:

1. **404 Handling**: Next.js built-in 404 handling will apply if a user navigates to a non-existent legal page route
2. **Component Errors**: React error boundaries in the root layout will catch any rendering errors
3. **Navigation Errors**: Next.js Link component handles navigation errors gracefully

## Testing Strategy

### Testing Framework

- **Unit/Integration Testing**: Vitest with React Testing Library (already configured in the project)
- **Property-Based Testing**: fast-check library for generating test cases

### Unit Tests

Unit tests will verify:
- Each legal page renders without errors
- Required content sections are present on each page
- Last updated date is displayed on each page
- Footer contains all four legal links

### Property-Based Tests

Property-based tests will verify the correctness properties:

1. **Property 1 Test**: Generate random legal page routes and verify Header and Footer presence
   - Tag: `**Feature: legal-pages, Property 1: Legal page layout consistency**`
   
2. **Property 2 Test**: Generate all footer legal links and verify correct href attributes
   - Tag: `**Feature: legal-pages, Property 2: Footer legal links navigation**`

### Test Configuration

- Minimum 100 iterations per property-based test
- Tests located in `__tests__/legal-pages/` directory
- Each property-based test explicitly references the correctness property it implements
