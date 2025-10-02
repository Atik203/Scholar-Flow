# OAuth Configuration Guide

## OAuth Redirect URLs for Development (localhost)

When setting up OAuth applications for Google and GitHub, use the following redirect URLs for local development:

### Google OAuth

- **Authorized JavaScript Origins**: `http://localhost:3000`
- **Authorized Redirect URIs**:
  - `http://localhost:3000/api/auth/callback/google`
  - `http://localhost:3000/auth/callback/google`

### GitHub OAuth

- **Homepage URL**: `http://localhost:3000`
- **Authorization Callback URL**:
  - `http://localhost:3000/api/auth/callback/github`
  - `http://localhost:3000/auth/callback/github`

## OAuth Configuration for Production

For production deployments, replace `http://localhost:3000` with your production domain (e.g., `https://scholarflow.app`).

### Google OAuth (Production)

- **Authorized JavaScript Origins**: `https://scholarflow.app`
- **Authorized Redirect URIs**:
  - `https://scholarflow.app/api/auth/callback/google`
  - `https://scholarflow.app/auth/callback/google`

### GitHub OAuth (Production)

- **Homepage URL**: `https://scholarflow.app`
- **Authorization Callback URL**:
  - `https://scholarflow.app/api/auth/callback/github`
  - `https://scholarflow.app/auth/callback/google`

## Environment Variables

Make sure these environment variables are set in your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Frontend URL (for OAuth redirects)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000  # or your production URL

# Backend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api  # or your production URL
```

## Backend OAuth Endpoints

The backend handles OAuth authentication at these endpoints:

- **Initiate Google OAuth**: `GET /api/auth/oauth/google?state={callbackUrl}`
- **Google Callback**: `POST /api/auth/oauth/google/callback` (with code)
- **Initiate GitHub OAuth**: `GET /api/auth/oauth/github?state={callbackUrl}`
- **GitHub Callback**: `POST /api/auth/oauth/github/callback` (with code)

## Frontend OAuth Flow

1. User clicks OAuth button (e.g., "Sign in with Google")
2. Frontend calls `signInWithOAuth("google", callbackUrl)` which redirects to backend
3. Backend redirects to OAuth provider (Google/GitHub)
4. User authorizes the application
5. OAuth provider redirects back to frontend callback route: `/auth/callback/{provider}`
6. Frontend callback page extracts authorization code
7. Frontend calls `completeOAuthSignIn()` which POSTs code to backend callback endpoint
8. Backend exchanges code for tokens, creates/updates user, returns JWT
9. Frontend stores JWT and user in Redux + localStorage
10. User is redirected to dashboard or original callback URL

## Testing OAuth Locally

1. Set up OAuth applications on Google Cloud Console and GitHub
2. Add the localhost redirect URLs shown above
3. Copy client IDs and secrets to `.env.local`
4. Start both frontend and backend: `yarn dev:turbo`
5. Navigate to `http://localhost:3000/login`
6. Click "Sign in with Google" or "Sign in with GitHub"
7. Authorize the application
8. You should be redirected back and logged in

## Troubleshooting

- **"redirect_uri_mismatch"**: Check that the exact redirect URL is added to your OAuth app settings
- **"invalid_client"**: Verify your client ID and secret are correct in `.env.local`
- **"Network error"**: Ensure backend is running on port 5000
- **"Authentication failed"**: Check browser console and backend logs for detailed error messages
