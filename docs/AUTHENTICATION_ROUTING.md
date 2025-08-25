# Enhanced Authentication & Routing System

## Overview

The ScholarFlow frontend now includes a comprehensive authentication and routing system that handles all edge cases for user navigation and access control.

## Key Features

### 1. Middleware-Based Route Protection

- **File**: `src/middleware.ts`
- Automatically redirects unauthenticated users from protected routes to login
- Redirects authenticated users from auth routes (login/register) to dashboard
- Supports callback URLs for post-authentication redirects
- Handles API routes, static files, and Next.js internals properly

### 2. Client-Side Auth Guards

- **File**: `src/hooks/useAuthGuard.ts`
- `useProtectedRoute()` - For pages requiring authentication
- `useAuthRoute()` - For login/register pages that should redirect if authenticated
- `usePublicRoute()` - For public pages that don't require auth checks

### 3. Smart Redirect Utilities

- **File**: `src/lib/auth/redirects.ts`
- Validates callback URLs to prevent open redirects
- Builds secure login/register URLs with callback parameters
- Provides smart "Get Started" button logic based on auth status

### 4. Higher-Order Components

- **File**: `src/components/auth/withAuth.tsx`
- `withAuthProtection()` - HOC for protected pages
- `withAuthRedirection()` - HOC for auth pages
- `withPublicRoute()` - HOC for public pages

## Protected Routes

The following routes require authentication:

- `/dashboard`
- `/profile`
- `/papers/**`
- `/collections/**`
- `/collaborate/**`
- `/settings/**`
- `/admin/**`

## Auth Routes

These routes redirect to dashboard if user is already authenticated:

- `/login`
- `/register`
- `/auth/signin`

## Public Routes

These routes are accessible regardless of authentication status:

- `/` (home)
- `/about`
- `/features`
- `/how-it-works`
- `/pricing`
- `/contact`
- `/faq`
- `/terms`
- `/privacy`

## Implementation Examples

### Protected Page Component

```tsx
"use client";
import { useProtectedRoute } from "@/hooks/useAuthGuard";

export default function ProtectedPage() {
  const { isLoading, user } = useProtectedRoute();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Protected content for {user?.name}</div>;
}
```

### Auth Page Component

```tsx
"use client";
import { useAuthRoute } from "@/hooks/useAuthGuard";

export default function LoginPage() {
  const { isLoading } = useAuthRoute();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Login form</div>;
}
```

### Using HOCs

```tsx
import { withAuthProtection } from "@/components/auth/withAuth";

function DashboardComponent() {
  return <div>Dashboard content</div>;
}

export default withAuthProtection(DashboardComponent);
```

### Smart Navigation Buttons

```tsx
import { usePublicRoute } from "@/hooks/useAuthGuard";
import { getGetStartedUrl } from "@/lib/auth/redirects";

function HeroButton() {
  const { isAuthenticated } = usePublicRoute();
  const pathname = usePathname();
  const url = getGetStartedUrl(isAuthenticated, pathname);

  return (
    <Button asChild>
      <Link href={url}>
        {isAuthenticated ? "Go to Dashboard" : "Get Started"}
      </Link>
    </Button>
  );
}
```

## Callback URL Handling

The system automatically handles callback URLs for post-authentication redirects:

1. When an unauthenticated user visits a protected route, they're redirected to `/login?callbackUrl=/original-route`
2. After successful authentication, they're redirected back to the original route
3. Callback URLs are validated to prevent open redirect attacks
4. Only internal routes are allowed as callbacks

## Error Handling

- Invalid sessions are automatically cleared
- Network errors during auth checks are handled gracefully
- Users are redirected to appropriate fallback pages when auth fails
- Loading states prevent flash of incorrect content

## Security Features

- Callback URL validation prevents open redirects
- Middleware runs on server-side for better security
- Client-side guards provide UX improvements
- JWT tokens are validated on both client and server
- Automatic session cleanup on logout

## Testing

All authentication flows include comprehensive test coverage:

- Protected route access without authentication
- Auth route access with existing authentication
- Callback URL validation and redirect flow
- Edge cases like expired sessions and network errors

## Migration Notes

Existing pages have been updated to use the new auth system:

- Dashboard and profile pages use `useProtectedRoute()`
- Login and register pages use `useAuthRoute()`
- Hero and CTA components use smart navigation
- All callback URLs are properly handled

This enhanced system provides a production-ready authentication experience with comprehensive edge case handling and security best practices.
