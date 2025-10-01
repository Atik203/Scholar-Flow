# 🔴 ROOT CAUSE IDENTIFIED!

## The Real Problem

Your authentication flow has **TWO layers of auth checking**:

1. **NextAuth Session** (Working ✅) - Cookie is set, JWT callback runs, session callback would run if called
2. **Redux `useAuth()` Hook** (Failing ❌) - Makes additional API call to `/api/auth/me`

## The Issue

### Dashboard `/dashboard/page.tsx`:

```typescript
const { user, isLoading, isAuthenticated } = useAuth(); // ← Using Redux hook

if (!isAuthenticated) {
  router.replace("/login?callbackUrl=/dashboard"); // ← Redirects to login!
}
```

### Redux `useAuth()` Hook:

```typescript
const { data: userData } = useGetCurrentUserQuery(undefined, {
  skip: !session?.accessToken, // ← Skips if no accessToken
});

return {
  isAuthenticated: !!session && !!userData?.data?.user, // ← Requires BOTH
};
```

## Why It's Failing

After successful NextAuth login:

1. ✅ Session cookie is set
2. ✅ JWT callback creates token with `backendAccessToken`
3. ❓ **Session callback is never called** ← This is where `accessToken` is added to session!
4. ❌ `useSession()` returns session WITHOUT `accessToken`
5. ❌ `useGetCurrentUserQuery` is skipped (no accessToken)
6. ❌ `useAuth()` returns `isAuthenticated: false`
7. ❌ Dashboard redirects to login

## The Root Problem

**The session callback is not being invoked after login!**

When you do:

- `signIn("credentials", { ... })` → JWT callback runs ✅
- User is redirected to dashboard
- Dashboard calls `useSession()` → Should trigger session callback ❌ (but doesn't!)
- Without session callback, `session.accessToken` is undefined
- Without `accessToken`, API call is skipped
- Without API data, `isAuthenticated` is false

## Why Session Callback Doesn't Fire

Possible causes:

1. **Race condition**: Page loads before NextAuth finishes setting up session
2. **Cookie timing**: Cookie is set but not immediately available to next request
3. **Middleware interference**: Middleware might be blocking the request
4. **NextAuth bug**: With JWT strategy, session callback might not fire on initial page load

## The Fix

### Option 1: Make `useAuth()` less strict (RECOMMENDED)

```typescript
// apps/frontend/src/redux/auth/useAuth.ts

return {
  user: session?.user || userData?.data?.user || null,
  isLoading: status === "loading" || isUserLoading,
  // ✅ Trust NextAuth session if it exists, don't require API call
  isAuthenticated: !!session, // Changed from: !!session && !!userData?.data?.user
  error: userError,
  session,
};
```

### Option 2: Force session callback to fire

Add this to login page after successful login:

```typescript
if (result?.ok) {
  // Force NextAuth to fetch session (triggers session callback)
  await getSession(); // Import from next-auth/react

  router.push(redirectUrl);
}
```

### Option 3: Add fallback in dashboard

```typescript
// Use NextAuth session directly instead of Redux
const { data: session, status } = useSession();

if (status === "loading") return <Loading />;
if (!session) router.replace("/login");
```

## Immediate Action

**Test this change in `useAuth.ts`:**

```typescript
export function useAuth() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !session?.accessToken,
  });

  // ... existing useEffect ...

  return {
    user: session?.user || userData?.data?.user || null, // ← Use session.user as fallback
    isLoading: status === "loading" || isUserLoading,
    isAuthenticated: !!session, // ← Trust NextAuth session
    error: userError,
    session,
  };
}
```

This will make authentication work immediately after login, even if the backend API call hasn't completed yet.

---

## Testing

1. Make the change to `useAuth.ts`
2. Clear browser data
3. Login
4. Should redirect to dashboard successfully!

The session callback will fire eventually (on next API call to `/api/auth/session`), and then `session.accessToken` will be available for the backend API call.
