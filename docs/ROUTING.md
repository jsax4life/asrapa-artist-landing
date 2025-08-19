# Routing Setup

This project uses React Router v6 with a modern, scalable architecture following best practices.

## Architecture Overview

### File Structure
```
src/
├── routes/
│   └── index.tsx          # Main router configuration
├── constants/
│   └── routes.ts          # Route constants
├── components/
│   ├── Layout.tsx         # Main layout wrapper
│   ├── ProtectedRoute.tsx # Route protection component
│   └── ErrorBoundary.tsx  # Error handling
├── hooks/
│   └── useNavigation.ts   # Navigation utilities
└── pages/
    ├── Index.tsx          # Home page
    └── NotFound.tsx       # 404 page
```

## Key Features

### 1. Lazy Loading
All pages are lazy-loaded for better performance:
```typescript
const Index = lazy(() => import('@/pages/Index'));
```

### 2. Error Boundaries
Comprehensive error handling with fallback UI:
- Route errors are caught and displayed gracefully
- Development error details are available
- User-friendly error messages

### 3. Loading States
Suspense boundaries with loading spinners during page transitions.

### 4. Type Safety
Full TypeScript support with proper typing for routes and navigation.

### 5. Centralized Route Management
Route constants prevent typos and make maintenance easier:
```typescript
import { ROUTES } from '@/constants/routes';
navigate(ROUTES.HOME);
```

## Usage

### Adding New Routes

1. **Create the page component** in `src/pages/`:
```typescript
// src/pages/About.tsx
import React from 'react';

const About = () => {
  return <div>About Page</div>;
};

export default About;
```

2. **Add route constant** in `src/constants/routes.ts`:
```typescript
export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
  ABOUT: '/about', // Add this
} as const;
```

3. **Update router configuration** in `src/routes/index.tsx`:
```typescript
const About = lazy(() => import('@/pages/About'));

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Index />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: ROUTES.ABOUT, // Add this
    element: (
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <About />
        </Suspense>
      </Layout>
    ),
  },
  // ... other routes
]);
```

### Navigation

Use the `useNavigation` hook for type-safe navigation:

```typescript
import { useNavigation } from '@/hooks/useNavigation';

const MyComponent = () => {
  const { goTo, goHome, goBack, isCurrentPath } = useNavigation();

  return (
    <div>
      <button onClick={() => goTo('/about')}>Go to About</button>
      <button onClick={goHome}>Go Home</button>
      <button onClick={goBack}>Go Back</button>
      {isCurrentPath('/about') && <span>You're on the about page</span>}
    </div>
  );
};
```

### Protected Routes

Use the `ProtectedRoute` component for authentication:

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

const ProtectedPage = () => {
  return (
    <ProtectedRoute isAuthenticated={userIsLoggedIn} redirectTo="/login">
      <div>Protected content</div>
    </ProtectedRoute>
  );
};
```

### Dynamic Routes

For dynamic routes with parameters:

```typescript
// In routes.ts
export const ROUTES = {
  BLOG_POST: '/blog/:id',
} as const;

// In router configuration
{
  path: ROUTES.BLOG_POST,
  element: <BlogPost />,
}

// In the component
import { useParams } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams();
  return <div>Blog post {id}</div>;
};
```

## Best Practices

1. **Always use route constants** instead of hardcoded strings
2. **Lazy load all pages** for better performance
3. **Use the Layout component** for consistent page structure
4. **Handle errors gracefully** with ErrorBoundary
5. **Use TypeScript** for type safety
6. **Keep routes organized** in the constants file
7. **Use the useNavigation hook** for consistent navigation patterns

## Error Handling

The routing system includes comprehensive error handling:

- **404 errors**: Automatically redirect to the 404 page
- **Route errors**: Caught by ErrorBoundary with fallback UI
- **Loading errors**: Displayed with Suspense fallbacks
- **Navigation errors**: Handled gracefully with user feedback

## Performance Optimizations

- **Code splitting**: Each page is loaded separately
- **Lazy loading**: Pages load only when needed
- **Suspense boundaries**: Smooth loading transitions
- **Error boundaries**: Prevent app crashes
- **Type safety**: Catch errors at compile time
