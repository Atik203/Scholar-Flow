# Redis Configuration for Scholar-Flow

Redis is used for background job queuing (PDF/document processing) and AI response caching. If Redis isn't available, the app falls back to synchronous processing — everything still works, just without background queues.

## Prerequisites

- Docker (for Option 2b) or direct installation access (for Option 2a)
- A Redis Cloud/Upstash account (for Option 3/4)

## Quick Fix for Development

If you're getting Redis connection timeouts during backend startup, you have several options below.

### Option 1: Disable Redis (Simplest for Local Dev)

Comment out or remove these from your `apps/backend/.env` file:

```bash
# REDIS_URL=
# REDIS_HOST=
# REDIS_PORT=
# REDIS_PASSWORD=
```

**What happens:**
- Background job queuing is disabled
- Document processing runs synchronously (still works!)
- AI caching is disabled (direct API calls)
- Server starts immediately with no Redis dependency

---

### Option 2a: Install Redis Locally

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**macOS (via Homebrew):**
```bash
brew install redis
brew services start redis
```

**Windows:**
```bash
# Using Chocolatey
choco install redis-64
redis-server
```

### Option 2b: Use Docker (Works on All Platforms)

```bash
docker run -d -p 6379:6379 --name scholar-redis redis:7-alpine
```

Then set in `apps/backend/.env`:

```bash
REDIS_URL=redis://localhost:6379
```

Or using individual fields:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD= (leave empty for local)
```

---

### Option 3: Redis Cloud (Free Tier)

1. Sign up at [Redis Cloud](https://redis.com/try-free/)
2. Create a free 30MB database
3. Copy connection details to `apps/backend/.env`:

```bash
REDIS_URL=redis://:your-password@your-endpoint.redis.cloud:12345
```

Or using individual fields:

```bash
REDIS_HOST=your-endpoint.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-password
```

---

### Option 4: Upstash Redis (Serverless, Good for Vercel)

1. Sign up at [Upstash](https://upstash.com/)
2. Create a Redis database (free tier: 10MB, 5000 commands/day)
3. Copy the `REDIS_URL` connection string to `apps/backend/.env`

Upstash is recommended for Vercel deployments because it's serverless (no open TCP connection needed).

## What Uses Redis in Scholar-Flow?

1. **PDF/DOCX Processing Queue** — handles background document extraction; falls back to synchronous if Redis is unavailable
2. **AI Response Caching** — caches AI summaries and insights; falls back to direct API calls if Redis is unavailable
3. **Performance Caching** — query result caching and session storage (future use)

## Verifying Setup

After starting the backend, look for these log messages:

**✅ Redis Connected:**
```
✅ [PDFQueue] Redis connection established successfully
```

**⚠️ Redis Unavailable (OK for dev):**
```
[PDFQueue] Redis error (queue disabled): connect ECONNREFUSED
[DocumentQueue] Redis not available, falling back to synchronous processing
```

Both scenarios work. Redis just enables background processing and caching.

### Manual Verification

If you have `redis-cli` installed:

```bash
redis-cli ping
# Expected output: PONG
```

## Production Deployment

For production (Vercel), use:

- **Upstash Redis** (recommended for Vercel): Serverless Redis with free tier
- **Redis Cloud**: 30MB free tier
- **Railway Redis**: One-click Redis deployment

Set the `REDIS_URL` environment variable in the Vercel dashboard (Backend project).
