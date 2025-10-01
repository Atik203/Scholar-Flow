import { createClient, RedisClientType } from "redis";

/**
 * Cache Service for Redis-based caching
 * Provides in-memory fallback when Redis is unavailable
 *
 * Phase 2: Critical Optimizations
 * Target: -200-400ms for cached queries
 *
 * Optimized for free Redis (30MB limit):
 * - Conservative caching strategy
 * - Aggressive TTLs
 * - Pattern-based eviction
 * - In-memory fallback for non-critical data
 */
class CacheService {
  private client: RedisClientType | null = null;
  private memoryCache: Map<string, { value: string; expiry: number }> =
    new Map();
  private isRedisEnabled: boolean = false;
  private isConnecting: boolean = false;

  // Free Redis optimization: limit cache size
  private readonly MAX_MEMORY_CACHE_SIZE = 100; // Conservative limit for in-memory
  private readonly MAX_CACHE_VALUE_SIZE = 1024 * 50; // 50KB max per cached value

  // Track cache hits for smart eviction (LRU-like behavior)
  private cacheHits: Map<string, number> = new Map();

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    // Only initialize if REDIS_URL is provided
    if (!process.env.REDIS_URL) {
      console.warn(
        "⚠️ REDIS_URL not configured. Using in-memory cache fallback."
      );
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      this.client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          connectTimeout: 5000, // 5 seconds
          reconnectStrategy: (retries) => {
            if (retries > 3) {
              console.error(
                "❌ Redis connection failed after 3 retries. Using in-memory cache."
              );
              return false; // Stop reconnecting
            }
            return Math.min(retries * 100, 3000); // Exponential backoff
          },
        },
      });

      this.client.on("error", (err) => {
        console.error("Redis Client Error:", err.message);
        this.isRedisEnabled = false;
      });

      this.client.on("connect", () => {
        console.log("✅ Redis client connected");
        this.isRedisEnabled = true;
      });

      this.client.on("disconnect", () => {
        console.log("⚠️ Redis client disconnected");
        this.isRedisEnabled = false;
      });

      await this.client.connect();
      this.isRedisEnabled = true;
      console.log("✅ CacheService initialized with Redis");
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
      this.isRedisEnabled = false;
      console.log("✅ CacheService initialized with in-memory fallback");
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Check if caching is enabled (Redis or in-memory)
   */
  public isEnabled(): boolean {
    return this.isRedisEnabled || this.memoryCache.size >= 0;
  }

  /**
   * Get a value from cache
   * Track hits for smart eviction
   */
  public async get<T>(key: string): Promise<T | null> {
    try {
      // Try Redis first
      if (this.isRedisEnabled && this.client) {
        const value = await this.client.get(key);
        if (value) {
          this.cacheHits.set(key, (this.cacheHits.get(key) || 0) + 1);
          return JSON.parse(value) as T;
        }
      }

      // Fallback to in-memory cache
      const cached = this.memoryCache.get(key);
      if (cached) {
        // Check if expired
        if (cached.expiry < Date.now()) {
          this.memoryCache.delete(key);
          this.cacheHits.delete(key);
          return null;
        }
        this.cacheHits.set(key, (this.cacheHits.get(key) || 0) + 1);
        return JSON.parse(cached.value) as T;
      }

      return null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set a value in cache with TTL (in seconds)
   * Optimized for free Redis: skip large values, use aggressive eviction
   */
  public async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);

      // Skip caching if value is too large (free Redis optimization)
      if (stringValue.length > this.MAX_CACHE_VALUE_SIZE) {
        console.warn(
          `⚠️ Cache value too large (${stringValue.length} bytes), skipping: ${key}`
        );
        return;
      }

      // Try Redis first (for critical data)
      if (this.isRedisEnabled && this.client) {
        try {
          await this.client.setEx(key, ttl, stringValue);
        } catch (redisError: any) {
          // If Redis is full or has error, fallback to memory cache
          if (
            redisError.message?.includes("OOM") ||
            redisError.message?.includes("maxmemory")
          ) {
            console.warn("⚠️ Redis memory full, using in-memory cache");
            this.isRedisEnabled = false; // Temporarily disable Redis
          }
        }
      }

      // Always maintain in-memory cache as backup
      this.memoryCache.set(key, {
        value: stringValue,
        expiry: Date.now() + ttl * 1000,
      });

      // Aggressive eviction for in-memory cache (free tier optimization)
      if (this.memoryCache.size > this.MAX_MEMORY_CACHE_SIZE) {
        // LRU eviction: remove least frequently accessed entries
        const entries = Array.from(this.memoryCache.keys()).map((k) => ({
          key: k,
          hits: this.cacheHits.get(k) || 0,
        }));

        // Sort by hits (ascending) and remove bottom 20%
        entries.sort((a, b) => a.hits - b.hits);
        const entriesToRemove = Math.floor(this.MAX_MEMORY_CACHE_SIZE * 0.2);

        for (let i = 0; i < entriesToRemove; i++) {
          this.memoryCache.delete(entries[i].key);
          this.cacheHits.delete(entries[i].key);
        }
      }
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete a value from cache
   */
  public async delete(key: string): Promise<void> {
    try {
      if (this.isRedisEnabled && this.client) {
        await this.client.del(key);
      }
      this.memoryCache.delete(key);
      this.cacheHits.delete(key);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys matching a pattern
   * Note: Pattern matching only works with Redis, not in-memory cache
   */
  public async deletePattern(pattern: string): Promise<void> {
    try {
      if (this.isRedisEnabled && this.client) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      }

      // For in-memory cache, delete all matching keys
      const memoryKeys = Array.from(this.memoryCache.keys()).filter((key) =>
        this.matchPattern(key, pattern)
      );
      memoryKeys.forEach((key) => this.memoryCache.delete(key));
    } catch (error) {
      console.error(`Cache delete pattern error for ${pattern}:`, error);
    }
  }

  /**
   * Simple pattern matching for in-memory cache
   */
  private matchPattern(key: string, pattern: string): boolean {
    // Convert Redis pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(key);
  }

  /**
   * Clear all cache entries
   */
  public async clear(): Promise<void> {
    try {
      if (this.isRedisEnabled && this.client) {
        await this.client.flushDb();
      }
      this.memoryCache.clear();
      this.cacheHits.clear();
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }

  /**
   * Graceful shutdown
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.quit();
      }
      this.memoryCache.clear();
      this.cacheHits.clear();
      console.log("✅ CacheService disconnected");
    } catch (error) {
      console.error("Error disconnecting cache:", error);
    }
  }

  /**
   * Get cache statistics (useful for monitoring free Redis usage)
   */
  public getStats(): {
    redisEnabled: boolean;
    memoryCacheSize: number;
    isConnecting: boolean;
    totalHits: number;
    avgHitsPerKey: number;
  } {
    const totalHits = Array.from(this.cacheHits.values()).reduce(
      (sum, hits) => sum + hits,
      0
    );
    const avgHits =
      this.cacheHits.size > 0 ? totalHits / this.cacheHits.size : 0;

    return {
      redisEnabled: this.isRedisEnabled,
      memoryCacheSize: this.memoryCache.size,
      isConnecting: this.isConnecting,
      totalHits,
      avgHitsPerKey: Math.round(avgHits * 100) / 100,
    };
  }
}

// Singleton instance
export const cacheService = new CacheService();
export default cacheService;
