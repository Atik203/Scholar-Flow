import crypto from "crypto";
import { getRedisClient, isRedisConfigured } from "../../shared/redis";
import type { AiSummaryResult } from "./ai.types";

const DEFAULT_TTL_SECONDS = 60 * 60; // 1 hour

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const inMemoryCache = new Map<string, CacheEntry<AiSummaryResult>>();

const generateCacheKey = (
  paperId: string,
  prompt: string,
  extraParams?: Record<string, unknown>
) => {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ paperId, prompt, extraParams }))
    .digest("hex");

  return `ai:summary:${paperId}:${hash}`;
};

const getFromMemory = (key: string) => {
  const entry = inMemoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    inMemoryCache.delete(key);
    return null;
  }
  return entry.value;
};

const setInMemory = (
  key: string,
  value: AiSummaryResult,
  ttlSeconds: number
) => {
  inMemoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const aiSummaryCache = {
  buildKey: generateCacheKey,

  async get(
    paperId: string,
    prompt: string,
    extraParams?: Record<string, unknown>
  ): Promise<AiSummaryResult | null> {
    const cacheKey = generateCacheKey(paperId, prompt, extraParams);

    if (isRedisConfigured()) {
      const client = await getRedisClient();
      if (client) {
        try {
          const cached = await client.get(cacheKey);
          if (cached) {
            return JSON.parse(cached) as AiSummaryResult;
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[AI Summary Cache] Redis get failed:", error);
          }
        }
      }
    }

    return getFromMemory(cacheKey);
  },

  async set(
    paperId: string,
    prompt: string,
    value: AiSummaryResult,
    extraParams?: Record<string, unknown>,
    options?: {
      ttlSeconds?: number;
      cacheKey?: string;
    }
  ) {
    const ttlSeconds = options?.ttlSeconds ?? DEFAULT_TTL_SECONDS;
    const cacheKey =
      options?.cacheKey || generateCacheKey(paperId, prompt, extraParams);

    if (isRedisConfigured()) {
      const client = await getRedisClient();
      if (client) {
        try {
          await client.set(cacheKey, JSON.stringify(value), {
            EX: ttlSeconds,
          });
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[AI Summary Cache] Redis set failed:", error);
          }
        }
      }
    }

    setInMemory(cacheKey, value, ttlSeconds);
  },

  async invalidate(paperId: string) {
    const prefix = `ai:summary:${paperId}`;
    for (const key of inMemoryCache.keys()) {
      if (key.startsWith(prefix)) {
        inMemoryCache.delete(key);
      }
    }

    if (isRedisConfigured()) {
      const client = await getRedisClient();
      if (client) {
        try {
          const keys = await client.keys(`${prefix}:*`);
          if (keys.length) {
            await client.del(keys);
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn("[AI Summary Cache] Redis invalidate failed:", error);
          }
        }
      }
    }
  },
};
