# Redis Configuration for Scholar-Flow

## Quick Fix for Development

If you're getting Redis connection timeouts during backend startup, you have two options:

### Option 1: Disable Redis (Simplest for Local Dev)

Comment out or remove these from your `.env` file:

```bash
# REDIS_HOST=
# REDIS_PORT=
# REDIS_PASSWORD=
```

**What happens**:

- Background job queuing will be disabled
- Document processing will run synchronously (still works!)
- AI caching will be disabled (direct API calls)
- Server will start immediately

### Option 2: Use Local Redis

Install and run Redis locally:

**Windows (via Chocolatey)**:

```bash
choco install redis-64
redis-server
```

**macOS (via Homebrew)**:

```bash
brew install redis
brew services start redis
```

**Linux (Ubuntu/Debian)**:

```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Or use Docker**:

```bash
docker run -d -p 6379:6379 redis:alpine
```

Then set in `.env`:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_PASSWORD= (leave empty for local)
```

### Option 3: Use Redis Cloud (Free Tier)

1. Sign up at [Redis Cloud](https://redis.com/try-free/)
2. Create a free 30MB database
3. Copy connection details to `.env`:

```bash
REDIS_HOST=your-endpoint.redis.cloud
REDIS_PORT=12345
REDIS_PASSWORD=your-password
```

## What Uses Redis in Scholar-Flow?

1. **PDF/DOCX Processing Queue** (`pdfProcessingQueue.ts`)
   - Handles background document extraction
   - Falls back to synchronous processing if Redis unavailable

2. **AI Response Caching** (`ai.cache.ts`)
   - Caches AI summaries and insights
   - Falls back to direct API calls if Redis unavailable

3. **Performance Caching** (future use)
   - Query result caching
   - Session storage

## Recent Fixes Applied

✅ Reduced connection timeout from 10s → 3s (fail fast)
✅ Added retry strategy with 3 max attempts
✅ Graceful fallback when Redis unavailable
✅ Non-blocking server startup
✅ Clear logging for Redis status

## Verifying Setup

After starting the backend, look for:

**✅ Redis Connected:**

```
✅ [PDFQueue] Redis connection established successfully
```

**⚠️ Redis Unavailable (OK for dev):**

```
[PDFQueue] Redis error (queue disabled): connect ECONNREFUSED
[DocumentQueue] Redis not available, falling back to synchronous processing
```

Both scenarios work! Redis just enables background processing and caching.

## Production Deployment

For production (Vercel), use:

- **Redis Cloud** (recommended): 30MB free tier
- **Upstash Redis**: Serverless Redis with free tier
- **Railway Redis**: One-click Redis deployment

Set environment variables in Vercel dashboard.
