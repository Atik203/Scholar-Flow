# Scholar-Flow Environment Variables

This guide explains every environment variable used by the three apps (frontend, backend, socket-server). Each section tells you what the variable does, where to get its value, and what to set in development.

## Quick Start (Minimum Vars to Get Running)

To start the dev servers with basic functionality, you only need to set these:

**Backend (`apps/backend/.env`):**
```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
DIRECT_DATABASE_URL=postgresql://postgres:admin@localhost:5432/scholarflow_dev
```

**Frontend (`apps/frontend/.env.local`):**
```env
BETTER_AUTH_SECRET=your-secret-here
NEXTAUTH_SECRET=your-secret-here
```

**Socket-server (`apps/socket-server/.env`):**
```env
NEXTAUTH_SECRET=same-as-frontend-secret
FRONTEND_URL=http://localhost:3000
```

> Copy the example files first: `cp apps/backend/.env.example apps/backend/.env`, and similarly for frontend and socket-server.

## Generating Strong Secrets

For any secret (*_SECRET, *_KEY), generate a random 32+ byte value:

```bash
openssl rand -base64 32
# Example output: x7R3kP9mZ2qL8vN4wB6cF1gH5jK0lM2n
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Backend Environment Variables

File: `apps/backend/.env`

### Database (Required)

| Variable | Description | Dev Value |
|----------|-------------|-----------|
| `DATABASE_URL` | PostgreSQL connection string (used by Prisma Accelerate) | `postgresql://user:pass@localhost:5432/scholarflow_dev` |
| `DIRECT_DATABASE_URL` | Direct connection string (used by migrations and adapter) | Same as above for local dev |
| `USE_PGVECTOR` | Enable pgvector semantic search features | `true` |

To create the database:
```bash
createdb scholarflow_dev
# Then enable pgvector:
psql -d scholarflow_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### Server (Required)

| Variable | Description | Dev Value |
|----------|-------------|-----------|
| `NODE_ENV` | Environment name | `development` |
| `PORT` | Backend API port | `5000` |
| `FRONTEND_URL` | CORS allowed origin (no trailing slash) | `http://localhost:3000` |
| `WS_URL` | WebSocket server URL for backend | `http://localhost:5001` |

### Authentication (Required)

| Variable | Description | How to Get |
|----------|-------------|------------|
| `NEXTAUTH_SECRET` | Used by better-auth and backend for JWT verification | Generate with `openssl rand -base64 32` — must match frontend |
| `JWT_SECRET` | JWT signing secret for backend tokens | Generate with `openssl rand -base64 32` |
| `EXPIRES_IN` | Access token lifetime | `3d` |
| `REFRESH_TOKEN_SECRET` | Refresh token signing secret | Generate separate from JWT_SECRET |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime | `15d` |
| `RESET_PASS_TOKEN` | Password reset token signing secret | Generate with `openssl rand -base64 32` |
| `RESET_PASS_TOKEN_EXPIRES_IN` | Reset token lifetime | `10m` |
| `RESET_PASS_LINK` | Frontend password reset page URL | `http://localhost:3000/reset-password` |
| `VERIFY_EMAIL_LINK` | Frontend email verification URL | `http://localhost:3000/verify-email` |

### OAuth Providers (Optional)

Register OAuth apps to enable Google/GitHub login.

**Google OAuth:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services
2. Create a project → OAuth consent screen (External, add test users)
3. Credentials → Create Credentials → OAuth client ID (Web application)
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy the Client ID and Client Secret to your `.env`

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**GitHub OAuth:**

1. Go to [GitHub OAuth Apps](https://github.com/settings/developers) → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Secret to your `.env`

```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Email (Optional)

Choose one method:

**Option 1: Gmail App Password (simplest)**

```env
EMAIL=your.email@gmail.com
APP_PASS=your-16-char-app-password
```

How to get: Google Account → Security → 2-Step Verification → App passwords → Generate "Mail" app password.

**Option 2: Resend (recommended for production)**

```env
RESEND_API_KEY=re_xxxx
```

Get from: [resend.com](https://resend.com) → API Keys.

**Option 3: Custom SMTP**

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-smtp-password
```

### AI Providers (Optional)

Add API keys for the AI providers you want to use. Providers with empty keys are skipped.

```env
OPENAI_API_KEY=sk-...           # platform.openai.com
GEMINI_API_KEY=AIza...          # aistudio.google.com
ANTHROPIC_API_KEY=sk-ant-...    # console.anthropic.com
DEEPSEEK_API_KEY=sk-...         # platform.deepseek.com
AI_PROVIDER_FALLBACK_ORDER=openai,gemini,claude,deepseek
AI_FEATURES_ENABLED=true
AI_REQUEST_TIMEOUT_MS=15000     # 15 seconds per provider call
```

### AWS S3 (Required for file uploads)

```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=scholar-flow-uploads
AWS_REGION=us-east-1
```

How to get:
1. AWS Console → IAM → Users → Create user with Programmatic access
2. Attach an S3 policy (minimum: `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on your bucket)
3. Create an S3 bucket (e.g., `scholar-flow-uploads`) in your chosen region

### Stripe (Optional — for billing features)

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_pro_monthly_id
STRIPE_PRICE_PRO_ANNUAL=price_pro_annual_id
STRIPE_PRICE_TEAM_MONTHLY=price_team_monthly_id
STRIPE_PRICE_TEAM_ANNUAL=price_team_annual_id
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_enterprise_monthly_id
STRIPE_PRICE_ENTERPRISE_ANNUAL=price_enterprise_annual_id
STRIPE_BILLING_PORTAL_RETURN_URL=http://localhost:3000/dashboard/billing
```

Get test keys from: [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
Create price IDs in: Stripe Dashboard → Products → Create product with recurring pricing.

For local webhook testing:
```bash
# Install Stripe CLI, then forward events
stripe listen --forward-to http://localhost:5000/webhooks/stripe
# Copy the returned signing secret to STRIPE_WEBHOOK_SECRET
```

### SSLCommerz (Optional — Bangladesh payments)

```env
STORE_ID=your-store-id
STORE_PASS=your-store-password
SUCCESS_URL=http://localhost:3000/payment/success
CANCEL_URL=http://localhost:3000/payment/cancel
FAIL_URL=http://localhost:3000/payment/fail
SSL_PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
SSL_VALIDATIOIN_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
```

Sandbox credentials: [SSLCommerz Developer](https://developer.sslcommerz.com/)

### Redis (Optional — for background jobs and caching)

```env
REDIS_URL=redis://localhost:6379          # Preferred — single connection string
# OR individual fields:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_USERNAME=
```

If Redis is unavailable, the app falls back gracefully:
- PDF/document processing runs synchronously instead of queued
- AI responses are fetched directly (no caching)
- The server still starts normally

See [Redis Setup Guide](./REDIS_SETUP.md) for installation options.

### Document Conversion (Optional)

```env
DOCX_TO_PDF_ENGINE=soffice          # soffice (free) or gotenberg
GOTENBERG_URL=                      # Only needed with gotenberg engine
GOTENBERG_TIMEOUT_MS=10000
DOCX_TO_PDF_QUALITY=print           # draft | screen | print | prepress
```

`soffice` (LibreOffice) is the default — it's free and requires no additional setup. `gotenberg` is a Docker-based alternative for higher volume.

### File Upload Settings

```env
FEATURE_UPLOADS=true
MAX_UPLOAD_MB=25
ALLOWED_UPLOAD_MIME=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document
TEXT_EXTRACTION_TIMEOUT_MS=20000
CHUNK_MAX_TOKENS=800
VIRUS_SCAN_ENABLED=false
```

## Frontend Environment Variables

File: `apps/frontend/.env.local`

### Authentication (Required)

| Variable | Description | Dev Value |
|----------|-------------|-----------|
| `BETTER_AUTH_SECRET` | Secret for better-auth session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Alias for better-auth secret (keep in sync with backend) | Same as `BETTER_AUTH_SECRET` |
| `NEXTAUTH_URL` | Site URL for auth callbacks | `http://localhost:3000` |

> `NEXTAUTH_SECRET` and `BETTER_AUTH_SECRET` should have the same value. The project uses better-auth (not NextAuth.js), but `NEXTAUTH_SECRET` is kept as an alias for compatibility.

### API & WebSocket URLs (Required)

| Variable | Description | Dev Value |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL (used by browser) | `http://localhost:5000/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `http://localhost:5001` |
| `NEXT_PUBLIC_SITE_URL` | Site URL for metadata/SEO | `http://localhost:3000` |

### OAuth Providers (Optional)

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

These must match the values in the backend `.env`. Each provider's callback URL is:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Feature Flags (Optional)

```env
NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH=false
NEXT_PUBLIC_FEATURE_ANNOTATIONS=false
NEXT_PUBLIC_FEATURE_CITATION_GRAPH=false
NEXT_PUBLIC_FEATURE_BILLING=true
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_AI_ASSISTANT_ENABLED=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_USE_PGVECTOR=false
```

These toggle UI visibility for features. Set to `"true"` or `"false"` (as strings).

### Stripe (Optional)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID=prctbl_...
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_pro_monthly
NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL=price_pro_annual
NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY=price_team_monthly
NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL=price_team_annual
```

Get publishable key from: Stripe Dashboard → API keys.

### Analytics (Optional)

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

## Socket-Server Environment Variables

File: `apps/socket-server/.env`

| Variable | Description | Dev Value |
|----------|-------------|-----------|
| `PORT` | WebSocket server port | `5001` |
| `NEXTAUTH_SECRET` | Must match the backend/frontend `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `FRONTEND_URL` | CORS allowed origin (no trailing slash) | `http://localhost:3000` |

The socket server verifies JWT tokens on WebSocket handshake using `NEXTAUTH_SECRET`. It must match exactly what the backend and frontend use.

## Dev Redirect URIs Summary

| Service | Provider | Callback URL |
|---------|----------|--------------|
| better-auth | Google | `http://localhost:3000/api/auth/callback/google` |
| better-auth | GitHub | `http://localhost:3000/api/auth/callback/github` |

## Dev Webhook URLs

| Service | Endpoint |
|---------|----------|
| Stripe | `POST http://localhost:5000/webhooks/stripe` |
| SSLCommerz | `POST http://localhost:5000/webhooks/sslcommerz` |

## Production Notes

When deploying:

- Set `NEXTAUTH_URL` to your production domain (e.g., `https://app.scholar-flow.com`)
- Update OAuth redirect URIs in Google/GitHub consoles to use production URLs
- Use production database, S3 bucket, and Stripe live keys
- Restrict CORS by updating `FRONTEND_URL`
- Generate new, strong secrets (never reuse dev secrets in production)
- Store secrets in Vercel/Render dashboard, not in `.env` files

## Security

- Never commit `.env` files (they're in `.gitignore`)
- Use strong secrets (32+ bytes) and rotate periodically
- Limit AWS IAM/S3 permissions to least privilege
- Validate Stripe webhook signatures (don't trust unverified payloads)
- Keep `NEXTAUTH_SECRET` in sync across all three apps

## Troubleshooting

**Problem: Auth callback fails with "redirect_uri_mismatch"**
Cause: The OAuth provider's configured redirect URI doesn't match what the app sends.
Fix: Verify the callback URL in Google/GitHub console matches `http://localhost:3000/api/auth/callback/{provider}`.

**Problem: Backend won't start — "Missing NEXTAUTH_SECRET"**
Cause: The backend can't start without an auth secret.
Fix: Set `NEXTAUTH_SECRET` in `apps/backend/.env`. Even a placeholder value works for dev.

**Problem: CORS errors in browser console**
Cause: `FRONTEND_URL` in the backend doesn't match your actual frontend URL.
Fix: Ensure `FRONTEND_URL=http://localhost:3000` (no trailing slash).

**Problem: Prisma client errors on `yarn dev:backend`**
Cause: Prisma client needs to be generated.
Fix: Run `yarn db:generate` from the repo root.

## Related Docs

- [Setup Guide](./SETUP.md) — initial environment setup
- [Redis Setup](./REDIS_SETUP.md) — Redis configuration options
- [Database Setup](./DATABASE.md) — PostgreSQL + pgvector
- [Deployment Guide](./DEPLOY.md) — production env configuration
