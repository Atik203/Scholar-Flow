# 🚀 Quick Start - Testing Authentication

## Step 1: Update OAuth Provider Settings (IMPORTANT!)

### Google OAuth Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. **Update Authorized redirect URIs** from:
   - ❌ `http://localhost:3000/api/auth/callback/google`
   - ✅ `http://localhost:3000/auth/callback/google` (NEW)
4. Click **Save**

### GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Find your OAuth App
3. **Update Authorization callback URL** from:
   - ❌ `http://localhost:3000/api/auth/callback/github`
   - ✅ `http://localhost:3000/auth/callback/github` (NEW)
4. Click **Update application**

## Step 2: Verify Environment Variables

Check `apps/backend/.env`:

```env
NEXTAUTH_SECRET=your-jwt-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
FRONTEND_URL=http://localhost:3000
```

Check `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Step 3: Start Servers

```bash
# From project root
yarn dev:turbo
```

This starts:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Step 4: Clear Browser Data (Important!)

Before testing, clear your browser data to avoid conflicts with old NextAuth cookies:

1. Open DevTools (F12)
2. Go to **Application** tab
3. Clear:
   - **Cookies** (all domains)
   - **Local Storage** (delete "scholarflow-auth" and "persist:root")
   - **Session Storage** (all)
4. Refresh page

OR use the diagnostics page: http://localhost:3000/dev/diagnostics

## Step 5: Test Authentication

### Test Email/Password Registration

1. Go to: http://localhost:3000/register
2. Fill out form with valid data
3. Click "Create Account"
4. ✅ Should redirect to dashboard with user logged in
5. Check DevTools → Application → Local Storage → "scholarflow-auth" (should have user + token)

### Test Email/Password Login

1. Go to: http://localhost:3000/login
2. Enter email + password
3. Click "Sign In"
4. ✅ Should redirect to dashboard
5. Check localStorage for "scholarflow-auth"

### Test Google OAuth

1. Go to: http://localhost:3000/login
2. Click "Continue with Google"
3. ✅ Should redirect to backend: `http://localhost:5000/api/auth/oauth/google`
4. ✅ Then to Google OAuth consent screen
5. Authorize
6. ✅ Should redirect back to: `http://localhost:3000/auth/callback/google`
7. ✅ Then to dashboard with user logged in

### Test GitHub OAuth

1. Go to: http://localhost:3000/login
2. Click "Continue with GitHub"
3. ✅ Should redirect to backend: `http://localhost:5000/api/auth/oauth/github`
4. ✅ Then to GitHub OAuth authorization
5. Authorize
6. ✅ Should redirect back to: `http://localhost:3000/auth/callback/github`
7. ✅ Then to dashboard with user logged in

### Test Session Persistence

1. Log in with any method
2. Refresh the page (F5)
3. ✅ Should remain logged in (no redirect to login page)
4. Close browser tab and reopen
5. Go to: http://localhost:3000/dashboard
6. ✅ Should still be logged in

### Test Logout

1. Click user menu → Sign Out
2. ✅ Should redirect to login page
3. Check localStorage → "scholarflow-auth" should be cleared
4. Try accessing: http://localhost:3000/dashboard
5. ✅ Should redirect to login page

## Step 6: Debugging

### If Login Says "Authentication response was incomplete"

- Check backend logs for errors
- Verify `NEXTAUTH_SECRET` is set in backend `.env`
- Check backend response in DevTools Network tab (should include `accessToken`)

### If OAuth Says "redirect_uri_mismatch"

- Verify you updated OAuth app redirect URIs (Step 1)
- Check spelling: `http://localhost:3000/auth/callback/google` (not `/api/auth/`)

### If OAuth Says "Failed to exchange authorization code"

- Check backend logs for detailed error
- Verify `GOOGLE_CLIENT_SECRET` / `GITHUB_CLIENT_SECRET` are set
- Verify OAuth provider redirected with `code` parameter

### If Session Doesn't Persist After Refresh

- Check localStorage has "scholarflow-auth" key
- Check Redux DevTools → State → auth (should have user + accessToken)
- Verify `redux-persist` is working (check console for persist logs)

### Use Diagnostics Page

Go to: http://localhost:3000/dev/diagnostics

This shows:

- Redux auth state
- localStorage keys
- Cookies
- Analysis of auth state

## Common Issues

### Issue: "JsonWebTokenError: jwt malformed"

- **Solution**: The accessToken is invalid. Clear localStorage and log in again.

### Issue: "User not authenticated" on protected routes

- **Solution**: Check if `authMiddleware` is applied to backend routes
- Verify JWT token is being sent in `Authorization: Bearer <token>` header

### Issue: OAuth works but email/password doesn't

- **Solution**: Check if backend is generating JWT token in `signIn` method
- Verify response includes `accessToken` field

### Issue: Can't access dashboard after login

- **Solution**: Check if user has correct `role` in database
- Verify dashboard route doesn't have unnecessary auth guards

## Success Indicators

When everything is working:

1. ✅ Login redirects to dashboard
2. ✅ localStorage has "scholarflow-auth" with user + token
3. ✅ Page refresh keeps you logged in
4. ✅ Protected routes are accessible
5. ✅ Logout clears state and redirects to login
6. ✅ OAuth providers redirect correctly
7. ✅ No errors in browser console
8. ✅ No errors in backend logs

## Need Help?

Check these files:

- `docs/AUTH_FIXES.md` - Detailed explanation of changes
- Backend logs in terminal running `yarn dev:turbo`
- Browser DevTools → Console
- Browser DevTools → Network tab (filter: "auth")
