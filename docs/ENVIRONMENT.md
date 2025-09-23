# Scholar-Flow Environment Setup Guide

This guide explains all environment variables for both backend (Express + Prisma) and frontend (Next.js + NextAuth), where to get them, and how to configure them for development and production.

## Locations and Quick Start

- Backend env file: `apps/backend/.env`
- Frontend env file: `apps/frontend/.env.local`

Recommended bootstrap (from repo root):

```bash
# Copy example envs
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Then fill in the variables below.

## Generate Strong Secrets

- NEXTAUTH_SECRET: a 32+ byte random string

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- JWT/other secrets: you can reuse the same method.

## Backend (.env)

Required unless marked optional.

- DATABASE_URL
  - What: PostgreSQL connection string
  - Dev example: `postgresql://username:password@localhost:5432/scholar_flow`
  - How: Create a DB named `scholar_flow` locally. For pgvector, ensure extension is installed: `CREATE EXTENSION IF NOT EXISTS vector;`

- NODE_ENV
  - What: Node environment (development|production)
  - Dev: `development`

- PORT
  - What: Backend port
  - Dev: `5000`

- FRONTEND_URL
- USE_PGVECTOR
  - What: Feature flag to enable vector operations (embeddings & similarity)
  - Dev: `false` by default; set `true` after pgvector extension and embeddings are ready

  - What: CORS allowlist origin
  - Dev: `http://localhost:3000`

- NEXTAUTH_SECRET
  - What: Secret used by Auth.js JWT; also used by backend middleware for token verification
  - How: Generate via Node crypto (see above) and keep in sync with frontend NEXTAUTH_SECRET

- JWT_SECRET
  - What: JWT signing secret for backend-only tokens (if used)
  - How: Generate via Node crypto (see above)

- EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN
  - What: Access/refresh token lifetimes and secret (if using refresh flow)
  - Dev example: `EXPIRES_IN=1d`, `REFRESH_TOKEN_SECRET=<random>`, `REFRESH_TOKEN_EXPIRES_IN=7d`

- RESET_PASS_TOKEN, RESET_PASS_TOKEN_EXPIRES_IN, RESET_PASS_LINK
  - What: Password reset token secret, expiry, and frontend link to reset page
  - Dev example: `RESET_PASS_TOKEN=<random>`, `RESET_PASS_TOKEN_EXPIRES_IN=5m`, `RESET_PASS_LINK=http://localhost:3000/reset-password`

- Email/SMTP (choose one approach)
  - EMAIL, APP_PASS (Gmail App Password)
    - What: Sender email and its app password
    - How: Enable 2FA in Google Account > Security > App passwords > create one for “Mail”
  - OR SMTP\_\* (hosted SMTP)
    - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
    - How: Use your provider’s credentials (e.g., SendGrid, Mailgun)

- OpenAI
  - OPENAI_API_KEY
  - How: [OpenAI Platform](https://platform.openai.com) > API keys (optional if AI features disabled)

- AWS S3 (for file uploads)
  - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME, AWS_REGION
  - How:
    1. AWS Console > IAM > Users > Create user with Programmatic access
    2. Attach policy for S3 access (at minimum bucket-limited put/get)
    3. Create an S3 bucket (e.g., `scholar-flow-uploads`) and note the region (e.g., `us-east-1`)

- Stripe (payments; optional in MVP)
  - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
  - How: [Stripe Dashboard (test API keys)](https://dashboard.stripe.com/test/apikeys); install Stripe CLI to obtain and forward webhooks
  - Dev Webhook URL: `http://localhost:5000/webhooks/stripe`

- SSLCommerz (BD local payments; optional)
  - STORE_ID, STORE_PASS, SUCCESS_URL, CANCEL_URL, FAIL_URL, SSL_PAYMENT_API, SSL_VALIDATIOIN_API
  - How: Sandbox credentials from [SSLCommerz Developer](https://developer.sslcommerz.com/)
  - Dev URLs: `http://localhost:3000/payment/{success|cancel|fail}`

- Redis (optional; background jobs/cache)

## Frontend Flags (.env.local)

- NEXT_PUBLIC_FEATURE_SEMANTIC_SEARCH: `true|false`
- NEXT_PUBLIC_FEATURE_ANNOTATIONS: `true|false`
- NEXT_PUBLIC_FEATURE_CITATION_GRAPH: `false` (Phase 2+)
- NEXT_PUBLIC_ENABLE_AI_FEATURES: `true|false`
- NEXT_PUBLIC_ENABLE_PAYMENTS: `true|false`
- NEXT_PUBLIC_USE_PGVECTOR: `true|false` (mirrors backend USE_PGVECTOR for UI gating)
  - REDIS_URL
  - Dev: `redis://localhost:6379`

## Frontend (.env.local)

Required unless marked optional. These run in Next.js (some are public via NEXT*PUBLIC*\*).

- NEXTAUTH_URL
  - What: Site URL for NextAuth
  - Dev: `http://localhost:3000`

- NEXTAUTH_SECRET
  - What: Must match backend/auth validator secret usage (used by Auth.js JWT)
  - How: Generate via Node crypto (same as above)

- NEXT_PUBLIC_API_BASE_URL
  - What: Base URL for calling backend API in the browser
  - Dev: `http://localhost:5000/api`

- OAuth Providers (optional but recommended)
  - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
    - How (Google Cloud Console):
  1. [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services 2) Create project > OAuth consent screen: External > add test users (your Gmail) 3) Credentials > Create Credentials > OAuth client ID (Web application) 4) Authorized redirect URIs: - `http://localhost:3000/api/auth/callback/google` 5) Copy Client ID/Secret to env
  - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
    - How (GitHub):
  1. [GitHub OAuth Apps](https://github.com/settings/developers) > OAuth Apps > New OAuth App
  2. Homepage URL: `http://localhost:3000`
  3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github` 4) Copy Client ID/Secret to env

- Database (optional here unless using an adapter in NextAuth)
  - DATABASE_URL (only if Auth.js adapter is used)

- Analytics/Flags (optional)
  - NEXT_PUBLIC_GOOGLE_ANALYTICS
  - NEXT_PUBLIC_ENABLE_AI_FEATURES ("true" | "false")
  - NEXT_PUBLIC_ENABLE_PAYMENTS ("true" | "false")

## Redirect URIs Summary (Dev)

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Set NEXTAUTH_URL=`http://localhost:3000` in dev.

## Webhooks (Dev)

- Stripe: `POST http://localhost:5000/webhooks/stripe`
- SSLCommerz: `POST http://localhost:5000/webhooks/sslcommerz`

If using Stripe CLI, forward events locally:

```bash
# Example (once Stripe CLI is installed and logged in)
# Replace <whsec_...> with the returned signing secret and set STRIPE_WEBHOOK_SECRET
stripe listen --forward-to http://localhost:5000/webhooks/stripe
```

## Gotenberg on GCP (Cloud Run)

Use Cloud Run to host the Gotenberg container for DOCX→PDF conversion. This keeps conversions off Vercel serverless and gives you longer timeouts and more memory.

Prerequisites

- Google Cloud project with billing enabled
- gcloud CLI installed and authenticated
- Cloud Run and Artifact Registry APIs enabled

Quick deploy (official image)

```bash
# Pick a region (e.g., us-central1)
gcloud run deploy scholarflow-gotenberg \
  --image=gotenberg/gotenberg:8 \
  --port=3000 \
  --region=us-central1 \
  --memory=1Gi --cpu=1 \
  --allow-unauthenticated
```

After deploy, copy the service URL (e.g., <https://scholarflow-gotenberg-xxxx-uc.a.run.app>).

Optional: custom image with fonts

```dockerfile
FROM gotenberg/gotenberg:8
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends fonts-dejavu fonts-liberation fonts-noto-core && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
USER 1001
```

Build and push to Artifact Registry, then deploy that image to Cloud Run.

Backend env wiring

- In `apps/backend/.env` (and `.env.example`):
  - `DOCX_TO_PDF_ENGINE=gotenberg`
  - `GOTENBERG_URL=<your-cloud-run-url>`

Example:

```env
DOCX_TO_PDF_ENGINE=gotenberg
GOTENBERG_URL=https://scholarflow-gotenberg-xxxx-uc.a.run.app
```

Verification

- From your dev machine:
  - Open the URL to ensure it responds. For full testing, run a DOCX→PDF conversion from the backend worker and confirm a PDF is produced.
  - Watch logs: `gcloud run services logs tail scholarflow-gotenberg --region=us-central1`

Security & limits

- Leave the service public during early dev; later, restrict with an auth proxy or Cloud Run “authenticated” and sign requests from your backend.
- Choose `--memory=1Gi` (or more) for complex files; increase if you see OOM.
- Keep conversions async in your queue with a 2–5 minute timeout and retry with backoff.

## Gotenberg on AWS (EC2 Free Tier)

If GCP isn’t an option, you can run Gotenberg on an AWS EC2 Free Tier instance (t2.micro/t3.micro) for low-volume usage and development.

What you’ll set up

- 1x EC2 instance (Ubuntu) eligible for Free Tier
- Docker installed on the instance
- Gotenberg container running on port 3000
- Security Group locked down to your backend’s IP

Step-by-step

1. Launch EC2 instance

- Navigate to AWS Console → EC2 → Instances → Launch instances
- Name: `scholarflow-gotenberg`
- AMI: Ubuntu LTS (e.g., 22.04)
- Instance type: `t2.micro` or `t3.micro` (Free Tier eligible)
- Key pair: create/download one (for SSH)
- Network settings:
  - Create/select a Security Group
  - Inbound rules: allow SSH (22) from your IP; add TCP 3000 from your backend’s known IP or temporarily from your IP for testing
- Storage: keep defaults
- Launch instance

1. Connect and install Docker

SSH into the instance (replace with your values):

```bash
ssh -i /path/to/key.pem ubuntu@ec2-xx-yy-zz-ww.compute-1.amazonaws.com
```

Install Docker and fonts:

```bash
sudo apt-get update
sudo apt-get install -y docker.io fonts-dejavu fonts-liberation fonts-noto-core
sudo usermod -aG docker $USER
sudo systemctl enable --now docker
newgrp docker
```

1. Run Gotenberg

```bash
docker run -d --name gotenberg \
  -p 3000:3000 \
  -e LOG_LEVEL=info \
  --restart unless-stopped \
  gotenberg/gotenberg:8
```

1. Set backend env vars

- In `apps/backend/.env`:

```env
DOCX_TO_PDF_ENGINE=gotenberg
GOTENBERG_URL=http://<ec2-public-ip>:3000
```

1. Lock down access

- Edit the EC2 Security Group:
  - Restrict inbound port 3000 to only your backend server’s IP address (or your office/static IP during testing)
  - Keep SSH (22) restricted to your IP

1. Verify conversion

- From your backend machine, call the service via your worker and ensure a PDF is generated
- Tail container logs if needed:

```bash
docker logs -f gotenberg
```

Ops tips

- Instance sizing: micro is fine for small/medium DOCX; upgrade if you see OOM or slow conversions
- Reliability: configure retries/backoff in your queue; keep conversions asynchronous
- Fonts: install the fonts your documents use for better fidelity (Noto, Liberation, DejaVu)
- Backups: this service is stateless; you can recreate it quickly if needed

Cost notes

- The EC2 Free Tier allows ~750 hours/month for 12 months; data transfer and extras may incur costs
- Avoid Elastic IP charges by keeping the EIP attached; otherwise use the instance public IP
- Do not add a load balancer or ECR unless needed—they add cost

## End-to-End Dev Checklist

1. Copy example envs into place
1. Fill secrets and URLs as above (ensure NEXTAUTH_SECRET matches both sides)
1. Start Postgres; create DB `scholar_flow` (and optionally enable pgvector)
1. Run migrations/seeds from repo root:

```bash
yarn db:generate
yarn db:migrate
yarn db:seed # optional
```

1. Start dev servers:

```bash
yarn dev
```

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:5000>

## Production Notes

- Set NEXTAUTH_URL to your production domain (e.g., `https://app.scholar-flow.com`)
- Update OAuth redirect URIs in Google/GitHub to use production URLs
- Use production DATABASE_URL, S3 bucket/region, and provider keys
- Restrict CORS via FRONTEND_URL and server middleware
- Rotate and store secrets securely (Vercel/hosted env manager)

## Security

- Never commit .env files
- Use strong secrets (32+ bytes) and rotate periodically
- Limit IAM/S3 permissions to least privilege
- Restrict webhook endpoints by validating signatures

---

If anything is unclear or missing, open an issue or ping the team. This document tracks the authoritative list of env vars for Scholar-Flow.
