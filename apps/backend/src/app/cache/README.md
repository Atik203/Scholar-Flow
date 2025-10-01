# Cache Configuration for Free Redis (30MB)

## Overview

ScholarFlow uses Redis for caching with an intelligent fallback to in-memory caching. The system is optimized for free Redis tiers with ~30MB storage limit.

## Free Redis Optimization Strategy

### 1. **Aggressive TTLs (Time To Live)**

- Short: 30 seconds (volatile data)
- Medium: 2 minutes (most queries)
- Long: 5 minutes (stable data)
- Very Long: 10 minutes (expensive operations)
- Day: 1 hour (rarely changing data)

### 2. **Value Size Limits**

- Maximum cached value: 50KB
- Larger values are skipped automatically
- Prevents cache bloat

### 3. **Smart Eviction (LRU-like)**

- Tracks cache hit frequency
- Evicts least frequently accessed entries first
- Removes 20% of entries when limit reached
- In-memory cache limited to 100 entries

### 4. **Dual-Layer Caching**

- **Redis (Primary)**: Fast, shared across instances
- **In-Memory (Fallback)**: When Redis unavailable or full
- Automatic fallback on OOM errors

## Environment Setup

```bash
# Optional: Redis URL (uses in-memory fallback if not provided)
REDIS_URL=redis://user:password@host:port/db
```

## What Gets Cached

### High Priority (Always cached)

- Paper lists by user (2 min TTL)
- User profiles (5 min TTL)
- Workspace memberships (5 min TTL)

### Medium Priority (Conditionally cached)

- Search results (10 min TTL, but only popular queries)
- Collection papers (2 min TTL)

### Not Cached

- Large PDF files
- Search queries with filters
- Real-time data (processing status)
- Values > 50KB

## Cache Invalidation

### Automatic Invalidation

- On paper delete → invalidates user's paper lists
- On paper create → invalidates workspace paper lists
- Pattern-based: `paper:user:123:*` clears all user's paper caches

### Manual Invalidation

```typescript
import cacheService from "@/app/cache/cacheService";
import { CacheKeys } from "@/app/cache/cacheKeys";

// Clear specific cache
await cacheService.delete(CacheKeys.paper.byId(paperId));

// Clear pattern
await cacheService.deletePattern(CacheKeys.paper.byUser(userId));
```

## Monitoring

### Check Cache Stats

```typescript
const stats = cacheService.getStats();
console.log(stats);
// {
//   redisEnabled: true,
//   memoryCacheSize: 45,
//   isConnecting: false,
//   totalHits: 1234,
//   avgHitsPerKey: 27.42
// }
```

### Health Check Endpoint

```bash
GET /api/health/cache
```

## Performance Impact

### Expected Improvements

- Paper list queries: -200-400ms (from 500ms → 100-300ms)
- User profile lookups: -150ms
- Workspace queries: -180ms

### Free Redis Capacity Planning

With 30MB Redis:

- ~600 paper list caches (50KB each)
- ~3,000 user profile caches (10KB each)
- Mixed workload: ~1,000-2,000 cached queries

## Best Practices

### DO ✅

- Cache expensive database queries
- Use appropriate TTLs for data volatility
- Invalidate caches on mutations
- Monitor cache hit rates

### DON'T ❌

- Cache files or binary data
- Cache user-specific sensitive data long-term
- Cache without invalidation strategy
- Cache values > 50KB

## Troubleshooting

### Redis Connection Issues

- System automatically falls back to in-memory cache
- Check `REDIS_URL` environment variable
- Verify Redis server is accessible

### Cache Not Working

```typescript
// Check if cache is enabled
if (cacheService.isEnabled()) {
  // Cache is working
}

// View statistics
console.log(cacheService.getStats());
```

### High Memory Usage

- Reduce TTLs in `cacheKeys.ts`
- Lower `MAX_MEMORY_CACHE_SIZE` in `cacheService.ts`
- Implement more aggressive eviction

## Phase 2 Performance Targets

- ✅ Cache hit rate: >40%
- ✅ Avg query time reduction: -200-400ms
- ✅ Page load improvement: -500ms
- ✅ Performance score: +15-25 points

## Future Enhancements

1. **Redis Cluster** (when scaling)
2. **Cache warming** (pre-populate on server start)
3. **Distributed cache** (multi-region)
4. **Cache analytics** (hit/miss tracking)

---

**Last Updated**: Phase 2 Implementation (October 1, 2025)  
**Optimized For**: Free Redis (30MB) with in-memory fallback
