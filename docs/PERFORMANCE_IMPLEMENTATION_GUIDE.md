# 🎯 Performance Implementation Guide

**Current Status:** Phase 2 Complete ✅ | Performance Score: 51/100 (+13 from baseline 38)

**Completion Timeline:**

- ✅ Phase 1: Completed October 1, 2025
- ✅ Phase 2: Completed October 1, 2025
- 🎯 Phase 3: Ready to Start

**Phase 2 Achievements:**

- React performance hooks (memo, useMemo, useCallback) on PapersList
- Redis caching with free tier optimization (30MB limit, LRU eviction)
- 8 new database indexes on hot query paths
- Enhanced SEO metadata (OpenGraph, Twitter Cards)
- FCP: 0.8s (-1.1s), LCP: 2.3s (-0.5s), TBT: 1,040ms (-1,320ms)

---

## Quick Navigation

- [Phase 1: Quick Wins](#phase-1-quick-wins-1-2-days)
- [Phase 2: Critical Optimizations](#phase-2-critical-optimizations-2-3-days)
- [Phase 3: Advanced Optimizations](#phase-3-advanced-optimizations-3-4-days)
- [Phase 4: Security & SEO](#phase-4-security--seo-1-2-days)
- [Testing & Validation](#testing--validation)

---

## Phase 1: Quick Wins (1-2 days)

### 1.1 Enable Next.js Compiler Optimizations

**File:** `apps/frontend/next.config.ts`

**Current State:**

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [...]
  },
};
```

**Optimized Code:**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Enable SWC minification (default in Next.js 13+)
  swcMinify: true,

  // Optimize package imports
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
    "@radix-ui/react-icons": {
      transform: "@radix-ui/react-icons/dist/{{member}}",
    },
  },

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "lucide-react",
    ],
    optimizeCss: true, // Enable CSS optimization
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Checklist:**

- [ ] Add compiler optimizations
- [ ] Configure modularizeImports for tree-shaking
- [ ] Enable optimizePackageImports
- [ ] Configure image formats (AVIF, WebP)
- [ ] Add cache headers for static assets
- [ ] Test build output: `yarn build`
- [ ] Verify bundle size reduction

**Expected Impact:** -200KB bundle size, +5-10 performance points

---

### 1.2 Implement Route-based Code Splitting

**File:** `apps/frontend/src/app/layout.tsx`

**Current State:**

```typescript
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ToastProvider } from "@/components/providers/ToastProvider";
// ... all imports loaded upfront
```

**Optimized Code:**

```typescript
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

// Lazy load heavy components
const GoogleAnalytics = dynamic(
  () => import("@/components/analytics/GoogleAnalytics").then(mod => ({ default: mod.GoogleAnalytics })),
  { ssr: false }
);

const ToastProvider = dynamic(
  () => import("@/components/providers/ToastProvider").then(mod => ({ default: mod.ToastProvider })),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Add font-display: swap
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "ScholarFlow - AI-Powered Research Paper Hub",
  description: "Organize, annotate, and collaborate on research papers with AI assistance",
  keywords: ["research", "papers", "collaboration", "AI", "academia"],
  authors: [{ name: "ScholarFlow Team" }],
  openGraph: {
    title: "ScholarFlow - AI-Powered Research Paper Hub",
    description: "Organize, annotate, and collaborate on research papers with AI assistance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <html lang="en" suppressHydrationWarning data-lt-installed="true">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <ReduxProvider>
            <ThemeProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <ToastProvider />
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthProvider>
        <Analytics />
        {gaId && <GoogleAnalytics measurementId={gaId} />}
      </body>
    </html>
  );
}
```

**Checklist:**

- [ ] Import `next/dynamic`
- [ ] Lazy load GoogleAnalytics with `ssr: false`
- [ ] Lazy load ToastProvider with `ssr: false`
- [ ] Add `display: "swap"` to font config
- [ ] Add font fallbacks
- [ ] Add preconnect links
- [ ] Enhance metadata with OpenGraph
- [ ] Test that analytics still works
- [ ] Verify toast notifications work

**Expected Impact:** -100KB initial bundle, +3-5 performance points

---

### 1.3 Lazy Load Heavy Dashboard Components

**File:** `apps/frontend/src/app/dashboard/(roles)/researcher/page.tsx` (and similar)

**Pattern to Implement:**

```typescript
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load heavy components
const PaperList = dynamic(
  () => import("@/components/papers/PaperList"),
  {
    loading: () => <PaperListSkeleton />,
    ssr: false,
  }
);

const CollectionGrid = dynamic(
  () => import("@/components/collections/CollectionGrid"),
  {
    loading: () => <CollectionGridSkeleton />,
    ssr: false,
  }
);

// Lazy load modals/dialogs
const UploadPaperDialog = dynamic(
  () => import("@/components/papers/UploadPaperDialog"),
  { ssr: false }
);

export default function ResearcherDashboard() {
  return (
    <div>
      <Suspense fallback={<DashboardSkeleton />}>
        <PaperList />
        <CollectionGrid />
      </Suspense>
    </div>
  );
}
```

**Files to Update:**

- [ ] `apps/frontend/src/app/dashboard/(roles)/researcher/page.tsx`
- [ ] `apps/frontend/src/app/dashboard/(roles)/admin/page.tsx`
- [ ] `apps/frontend/src/app/dashboard/(roles)/reviewer/page.tsx`
- [ ] All components importing TipTap editor
- [ ] All modal/dialog components

**Checklist:**

- [ ] Create skeleton loading components
- [ ] Lazy load paper list components
- [ ] Lazy load collection components
- [ ] Lazy load all modals/dialogs
- [ ] Lazy load TipTap editor (largest dependency ~3.5MB)
- [ ] Add Suspense boundaries
- [ ] Test loading states
- [ ] Verify functionality after lazy loading

**Expected Impact:** -2MB initial bundle, +10-15 performance points

---

### 1.4 Optimize Backend Query Selection

**File:** `apps/backend/src/app/modules/Paper/paper.service.ts`

**Current Pattern (FOUND):**

```typescript
const papers = await prisma.$queryRaw<any[]>`
  SELECT * FROM "Paper"
  WHERE "uploaderId" = ${userId}
`;
```

**Optimized Pattern:**

```typescript
const papers = await prisma.$queryRaw<any[]>`
  SELECT 
    id,
    title,
    authors,
    "publicationDate",
    status,
    "fileUrl",
    "thumbnailUrl",
    "pageCount",
    "uploaderId",
    "createdAt"
  FROM "Paper"
  WHERE "uploaderId" = ${userId}
  LIMIT ${limit}
  OFFSET ${offset}
`;
```

**Search and Replace Pattern:**

```bash
# Find all SELECT * queries
grep -r "SELECT \*" apps/backend/src/app/modules/
```

**Checklist:**

- [ ] Find all `SELECT *` queries in codebase
- [ ] Replace with specific column selection
- [ ] Add LIMIT to all list queries
- [ ] Add OFFSET for pagination
- [ ] Ensure only necessary columns are selected
- [ ] Test that responses still work
- [ ] Add indexes for WHERE clause columns
- [ ] Run EXPLAIN ANALYZE on updated queries

**Expected Impact:** -50-100ms per query, +5-10 performance points

---

### 1.5 Add Query Performance Logging

**File:** `apps/backend/src/app/shared/prisma.ts`

**Current State:**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;
```

**Optimized Code:**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],

  // Connection pool optimization
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Query performance logging
if (process.env.NODE_ENV === "development") {
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    const duration = after - before;

    // Log slow queries (>100ms)
    if (duration > 100) {
      console.warn(
        `⚠️ Slow query detected: ${params.model}.${params.action} took ${duration}ms`
      );
    }

    return result;
  });
}

// Graceful shutdown
const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default prisma;
```

**Checklist:**

- [ ] Add query logging configuration
- [ ] Add performance middleware
- [ ] Log queries over 100ms threshold
- [ ] Configure connection pool
- [ ] Add graceful shutdown handlers
- [ ] Test query logging in development
- [ ] Verify production doesn't log queries
- [ ] Monitor slow query log

**Expected Impact:** Better visibility for optimization, 0 direct performance impact

---

## Phase 2: Critical Optimizations (2-3 days)

### 2.1 Optimize RTK Query Configuration

**File:** `apps/frontend/src/redux/api/apiSlice.ts`

**Current State:**

```typescript
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [...],
  keepUnusedDataFor: 30,
  refetchOnMountOrArgChange: 30,
  endpoints: () => ({}),
});
```

**Optimized Code:**

```typescript
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

// Enhanced base query with retry logic
const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
    prepareHeaders: async (headers) => {
      try {
        const session = await getSession();
        const token = (session as { accessToken?: string } | null)?.accessToken;

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Auth error:", error);
        }
      }
      return headers;
    },
  }),
  {
    maxRetries: 2, // Retry failed requests twice
  }
);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "Paper",
    "Collection",
    "CollectionPaper",
    "CollectionMember",
    "CollectionInvite",
    "Workspace",
    "User",
    "Annotation",
    "ProcessingStatus",
    "AIInsight",
    "Admin",
  ],

  // Optimize cache timing
  keepUnusedDataFor: 300, // 5 minutes for stable data
  refetchOnMountOrArgChange: 60, // Only refetch if data is older than 1 minute
  refetchOnFocus: false, // Disable refetch on window focus (can be expensive)
  refetchOnReconnect: true, // Refetch when internet reconnects

  endpoints: () => ({}),
});

// Export hooks for better tree-shaking
export const {
  // Will be populated by injected endpoints
} = apiSlice;
```

**Checklist:**

- [ ] Import `retry` from RTK Query
- [ ] Wrap baseQuery with retry logic
- [ ] Increase `keepUnusedDataFor` to 5 minutes
- [ ] Increase `refetchOnMountOrArgChange` to 60 seconds
- [ ] Disable `refetchOnFocus` (expensive)
- [ ] Enable `refetchOnReconnect`
- [ ] Test cache behavior
- [ ] Verify retry works on network failures
- [ ] Ensure stale data is acceptable for 5 minutes

**Expected Impact:** -30-50% API calls, +5-10 performance points

---

### 2.2 Add React.memo and Performance Hooks

**Pattern for List Item Components:**

**Before:**

```typescript
export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <div onClick={() => handleClick(paper.id)}>
      {/* ... */}
    </div>
  );
}
```

**After:**

```typescript
import { memo, useCallback, useMemo } from "react";

export const PaperCard = memo(function PaperCard({ paper }: { paper: Paper }) {
  // Memoize expensive computations
  const formattedDate = useMemo(
    () => formatDate(paper.publicationDate),
    [paper.publicationDate]
  );

  // Memoize callbacks
  const handleClick = useCallback(() => {
    navigateToPaper(paper.id);
  }, [paper.id]);

  return (
    <div onClick={handleClick}>
      <h3>{paper.title}</h3>
      <p>{formattedDate}</p>
    </div>
  );
});
```

**Files to Update:**

- [ ] All list item components (PaperCard, CollectionCard, etc.)
- [ ] Dashboard widget components
- [ ] Heavy computation components
- [ ] Components with event handlers in lists

**Checklist:**

- [ ] Wrap list items with `React.memo()`
- [ ] Use `useMemo()` for expensive calculations
- [ ] Use `useCallback()` for event handlers
- [ ] Add proper dependency arrays
- [ ] Test that memoization works (use React DevTools Profiler)
- [ ] Verify no stale closure bugs
- [ ] Check that props are properly compared

**Expected Impact:** -30-50% unnecessary re-renders, +5-8 performance points

---

### 2.3 Implement Virtual Scrolling for Lists

**File:** Create `apps/frontend/src/components/papers/VirtualPaperList.tsx`

**Installation:**

```bash
cd apps/frontend
yarn add react-window react-virtualized-auto-sizer
yarn add -D @types/react-window
```

**Implementation:**

```typescript
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { PaperCard } from "./PaperCard";

interface VirtualPaperListProps {
  papers: Paper[];
}

export function VirtualPaperList({ papers }: VirtualPaperListProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <PaperCard paper={papers[index]} />
    </div>
  );

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={papers.length}
          itemSize={120} // Height of each paper card
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
}
```

**Checklist:**

- [ ] Install react-window and auto-sizer
- [ ] Create VirtualPaperList component
- [ ] Create VirtualCollectionList component
- [ ] Replace regular lists with virtual lists
- [ ] Adjust item sizes based on actual heights
- [ ] Test scrolling performance
- [ ] Verify accessibility (keyboard navigation)
- [ ] Test with 1000+ items

**Expected Impact:** Smooth scrolling for 10,000+ items, +10-15 performance points for large lists

---

### 2.4 Implement Database Query Caching

**File:** Create `apps/backend/src/app/cache/cacheService.ts`

**Installation:**

```bash
cd apps/backend
yarn add ioredis
yarn add -D @types/ioredis
```

**Implementation:**

```typescript
import Redis from "ioredis";

class CacheService {
  private client: Redis | null = null;
  private enabled: boolean = false;

  constructor() {
    // Only enable Redis in production or if REDIS_URL is set
    if (process.env.REDIS_URL) {
      try {
        this.client = new Redis(process.env.REDIS_URL, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          retryStrategy: (times) => {
            if (times > 3) return null;
            return Math.min(times * 50, 2000);
          },
        });
        this.enabled = true;
        console.log("✅ Redis cache enabled");
      } catch (error) {
        console.warn("⚠️ Redis connection failed, falling back to no cache");
        this.enabled = false;
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled || !this.client) return null;

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (!this.enabled || !this.client) return;

    try {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async del(key: string | string[]): Promise<void> {
    if (!this.enabled || !this.client) return;

    try {
      if (Array.isArray(key)) {
        await this.client.del(...key);
      } else {
        await this.client.del(key);
      }
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    if (!this.enabled || !this.client) return;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error("Cache invalidate error:", error);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const cacheService = new CacheService();
export default cacheService;
```

**File:** Create `apps/backend/src/app/cache/cacheKeys.ts`

```typescript
/**
 * Standardized cache key generation
 */
export const CacheKeys = {
  // User caches (TTL: 5 minutes)
  user: (userId: string) => `user:${userId}`,
  userProfile: (userId: string) => `user:${userId}:profile`,

  // Paper caches (TTL: 2 minutes)
  paper: (paperId: string) => `paper:${paperId}`,
  paperList: (userId: string, page: number, filters: string) =>
    `papers:${userId}:${page}:${filters}`,
  paperStats: (userId: string) => `paper:stats:${userId}`,

  // Collection caches (TTL: 5 minutes)
  collection: (collectionId: string) => `collection:${collectionId}`,
  collectionList: (userId: string) => `collections:${userId}`,
  collectionPapers: (collectionId: string) =>
    `collection:${collectionId}:papers`,

  // Patterns for bulk invalidation
  patterns: {
    userAll: (userId: string) => `user:${userId}*`,
    paperAll: (userId: string) => `paper*:${userId}*`,
    collectionAll: (userId: string) => `collection*:${userId}*`,
  },
};

export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};
```

**Usage in Service:**

**File:** Update `apps/backend/src/app/modules/Paper/paper.service.ts`

```typescript
import cacheService from "../../cache/cacheService";
import { CacheKeys, CacheTTL } from "../../cache/cacheKeys";

class PaperService {
  async getPaperById(paperId: string, userId: string) {
    // Try cache first
    const cacheKey = CacheKeys.paper(paperId);
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      console.log("✅ Cache hit for paper:", paperId);
      return cached;
    }

    // Cache miss - query database
    const paper = await prisma.$queryRaw<any[]>`
      SELECT 
        id, title, authors, abstract, "publicationDate",
        status, "fileUrl", "thumbnailUrl", "uploaderId"
      FROM "Paper"
      WHERE id = ${paperId} AND "uploaderId" = ${userId}
      LIMIT 1
    `;

    if (paper[0]) {
      // Cache the result
      await cacheService.set(cacheKey, paper[0], CacheTTL.MEDIUM);
    }

    return paper[0];
  }

  async deletePaper(paperId: string, userId: string) {
    // Delete from database
    await prisma.$executeRaw`
      DELETE FROM "Paper"
      WHERE id = ${paperId} AND "uploaderId" = ${userId}
    `;

    // Invalidate cache
    await cacheService.del(CacheKeys.paper(paperId));
    await cacheService.invalidatePattern(CacheKeys.patterns.paperAll(userId));
  }
}
```

**Checklist:**

- [ ] Install ioredis
- [ ] Create CacheService class
- [ ] Create CacheKeys utility
- [ ] Add REDIS_URL to .env.example
- [ ] Implement caching in Paper service
- [ ] Implement caching in Collection service
- [ ] Implement caching in User service
- [ ] Add cache invalidation on mutations
- [ ] Test cache hit/miss scenarios
- [ ] Monitor cache hit rate

**Expected Impact:** -200-400ms for cached queries, +15-25 performance points

---

## Phase 3: Advanced Optimizations (3-4 days)

### 3.1 Add Bundle Analyzer

**Installation:**

```bash
cd apps/frontend
yarn add -D @next/bundle-analyzer
```

**File:** Update `apps/frontend/next.config.ts`

```typescript
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // ... existing config
};

export default withBundleAnalyzer(nextConfig);
```

**File:** Update `apps/frontend/package.json`

```json
{
  "scripts": {
    "analyze": "ANALYZE=true yarn build"
  }
}
```

**Checklist:**

- [ ] Install bundle analyzer
- [ ] Configure in next.config.ts
- [ ] Add analyze script
- [ ] Run analysis: `yarn analyze`
- [ ] Review bundle report
- [ ] Identify large dependencies
- [ ] Plan replacements for heavy libs
- [ ] Document findings

**Expected Impact:** Visibility for further optimization

---

### 3.2 Add Database Indexes

**File:** `apps/backend/prisma/schema.prisma`

**Add Missing Indexes:**

```prisma
model Paper {
  id String @id @default(cuid())
  title String
  authors String[]
  uploaderId String
  workspaceId String?
  status PaperStatus @default(PENDING)
  createdAt DateTime @default(now())

  // Add indexes for frequent queries
  @@index([uploaderId, status]) // Filter by user and status
  @@index([uploaderId, createdAt(sort: Desc)]) // Sort by date
  @@index([workspaceId, status]) // Workspace papers
  @@index([status, createdAt]) // Processing queue
  @@map("Paper")
}

model Collection {
  id String @id @default(cuid())
  name String
  ownerId String
  workspaceId String?
  createdAt DateTime @default(now())

  @@index([ownerId, createdAt(sort: Desc)])
  @@index([workspaceId, ownerId])
  @@map("Collection")
}

model CollectionPaper {
  id String @id @default(cuid())
  collectionId String
  paperId String
  addedAt DateTime @default(now())

  @@unique([collectionId, paperId]) // Prevent duplicates
  @@index([collectionId, addedAt(sort: Desc)]) // List papers in collection
  @@index([paperId]) // Find collections for paper
  @@map("CollectionPaper")
}
```

**Run Migration:**

```bash
yarn db:migrate
```

**Analyze Queries:**

```sql
-- Run in database to check query performance
EXPLAIN ANALYZE
SELECT * FROM "Paper"
WHERE "uploaderId" = 'xxx' AND status = 'PROCESSED'
ORDER BY "createdAt" DESC;
```

**Checklist:**

- [ ] Review all models in schema
- [ ] Add indexes for WHERE clauses
- [ ] Add indexes for ORDER BY columns
- [ ] Add composite indexes for combined filters
- [ ] Run migration
- [ ] Test query performance before/after
- [ ] Run EXPLAIN ANALYZE on slow queries
- [ ] Monitor index usage

**Expected Impact:** -100-300ms for indexed queries, +10-15 performance points

---

### 3.3 Implement Request Batching

**File:** Create `apps/backend/src/app/utils/batchLoader.ts`

```typescript
import DataLoader from "dataloader";
import prisma from "../shared/prisma";

// Batch load papers by IDs
export const paperLoader = new DataLoader(
  async (paperIds: readonly string[]) => {
    const papers = await prisma.$queryRaw<any[]>`
    SELECT id, title, authors, "fileUrl", "uploaderId"
    FROM "Paper"
    WHERE id = ANY(${paperIds as string[]})
  `;

    // Map results back in the same order as requested IDs
    const paperMap = new Map(papers.map((p) => [p.id, p]));
    return paperIds.map((id) => paperMap.get(id) || null);
  }
);

// Batch load users by IDs
export const userLoader = new DataLoader(async (userIds: readonly string[]) => {
  const users = await prisma.$queryRaw<any[]>`
    SELECT id, name, email, "imageUrl"
    FROM "User"
    WHERE id = ANY(${userIds as string[]})
  `;

  const userMap = new Map(users.map((u) => [u.id, u]));
  return userIds.map((id) => userMap.get(id) || null);
});

// Reset loaders per request
export function createLoaders() {
  return {
    papers: new DataLoader(paperLoader.batchScheduleFn as any),
    users: new DataLoader(userLoader.batchScheduleFn as any),
  };
}
```

**Usage:**

```typescript
// In middleware, attach loaders to request
app.use((req, res, next) => {
  (req as any).loaders = createLoaders();
  next();
});

// In controller
async function getPapers(req: AuthenticatedRequest, res: Response) {
  const papers = await paperService.getUserPapers(req.user!.id);

  // Batch load uploader info for all papers
  const uploadersInfo = await Promise.all(
    papers.map((p) => req.loaders.users.load(p.uploaderId))
  );

  // Combine results
  const papersWithUploaders = papers.map((paper, i) => ({
    ...paper,
    uploader: uploadersInfo[i],
  }));

  res.json(papersWithUploaders);
}
```

**Checklist:**

- [ ] Install DataLoader
- [ ] Create batch loaders
- [ ] Add loaders to request context
- [ ] Use loaders in controllers
- [ ] Test N+1 query elimination
- [ ] Monitor query count reduction

**Expected Impact:** -50-80% database queries, +5-10 performance points

---

## Phase 4: Security & SEO (1-2 days)

### 4.1 Implement Content Security Policy

**File:** Update `apps/frontend/next.config.ts`

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
```

**Checklist:**

- [ ] Add CSP headers
- [ ] Add X-Frame-Options
- [ ] Add X-Content-Type-Options
- [ ] Add Referrer-Policy
- [ ] Add Permissions-Policy
- [ ] Test that app still works
- [ ] Check browser console for CSP violations
- [ ] Adjust CSP as needed

**Expected Impact:** +10-15 Best Practices points

---

### 4.2 Create robots.txt

**File:** Create `apps/frontend/public/robots.txt`

```
# Allow crawling of public pages
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/
Disallow: /admin

# Sitemap
Sitemap: https://scholarflow.com/sitemap.xml
```

**File:** Create `apps/frontend/public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://scholarflow.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://scholarflow.com/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Checklist:**

- [ ] Create robots.txt
- [ ] Create sitemap.xml
- [ ] Disallow sensitive routes
- [ ] Allow public pages
- [ ] Test with Google Search Console
- [ ] Submit sitemap

**Expected Impact:** +5-10 SEO points

---

## Testing & Validation

### Performance Testing Commands

```bash
# Frontend build analysis
cd apps/frontend
yarn build
yarn analyze

# Run Lighthouse
npx lighthouse http://localhost:3000/dashboard --output=html --output-path=./lighthouse-report.html

# Check bundle size
npm run build -- --profile
```

### Backend Load Testing

**File:** Create `artillery-load-test.yml`

```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
  defaults:
    headers:
      Authorization: "Bearer YOUR_TEST_TOKEN"

scenarios:
  - name: "Get papers"
    flow:
      - get:
          url: "/api/papers"
      - get:
          url: "/api/collections"

  - name: "Get paper detail"
    flow:
      - get:
          url: "/api/papers/{{ paperId }}"
```

**Run Load Test:**

```bash
artillery run artillery-load-test.yml
```

### Database Query Analysis

```sql
-- Enable query timing
SET track_io_timing = on;

-- Analyze slow queries
SELECT
  calls,
  total_time,
  mean_time,
  query
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

---

## Success Metrics

### Performance Score Targets

| Metric      | Current | Phase 1 | Phase 2 | Phase 3 | Target |
| ----------- | ------- | ------- | ------- | ------- | ------ |
| Performance | 38      | 60      | 80      | 85+     | 90+    |
| FCP         | 1.9s    | 1.2s    | 0.9s    | 0.8s    | <0.9s  |
| LCP         | 2.8s    | 1.8s    | 1.2s    | 1.0s    | <1.2s  |
| TBT         | 2,360ms | 800ms   | 300ms   | 150ms   | <200ms |
| CLS         | 0       | 0       | 0       | 0       | <0.1   |
| Bundle Size | ~5MB    | ~3MB    | ~2MB    | ~1.5MB  | <2MB   |

### Backend Performance Targets

| Metric            | Current | Target |
| ----------------- | ------- | ------ |
| P50 Response Time | 500ms   | <50ms  |
| P95 Response Time | 1000ms+ | <200ms |
| P99 Response Time | 2000ms+ | <500ms |
| Query Time        | 500ms+  | <20ms  |
| Cache Hit Rate    | 0%      | >60%   |

---

**Document Version:** 1.0.0  
**Last Updated:** October 1, 2025  
**Status:** Ready for Implementation
