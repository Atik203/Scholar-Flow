/**
 * Standardized cache key generation for consistent caching
 *
 * Phase 2: Critical Optimizations
 * Provides type-safe cache key generation with proper namespacing
 */

export const CacheKeys = {
  // User caches (TTL: 5 minutes)
  user: {
    byId: (userId: string) => `user:${userId}`,
    byEmail: (email: string) => `user:email:${email}`,
    profile: (userId: string) => `user:${userId}:profile`,
    all: () => `user:*`, // Pattern for invalidation
  },

  // Paper caches (TTL: 5 minutes for lists, 10 minutes for details)
  paper: {
    byId: (paperId: string) => `paper:${paperId}`,
    list: (
      userId: string,
      workspaceId: string | undefined,
      page: number,
      limit: number
    ) =>
      workspaceId
        ? `paper:list:${userId}:${workspaceId}:${page}:${limit}`
        : `paper:list:${userId}:all:${page}:${limit}`,
    byWorkspace: (workspaceId: string) => `paper:workspace:${workspaceId}:*`,
    byUser: (userId: string) => `paper:user:${userId}:*`,
    processingStatus: (paperId: string) => `paper:${paperId}:processing`,
    fileUrl: (paperId: string) => `paper:${paperId}:url`,
    all: () => `paper:*`,
  },

  // Collection caches (TTL: 5 minutes)
  collection: {
    byId: (collectionId: string) => `collection:${collectionId}`,
    list: (userId: string, page: number, limit: number) =>
      `collection:list:${userId}:${page}:${limit}`,
    byUser: (userId: string) => `collection:user:${userId}:*`,
    papers: (collectionId: string, page: number, limit: number) =>
      `collection:${collectionId}:papers:${page}:${limit}`,
    members: (collectionId: string) => `collection:${collectionId}:members`,
    all: () => `collection:*`,
  },

  // Workspace caches (TTL: 10 minutes - more stable)
  workspace: {
    byId: (workspaceId: string) => `workspace:${workspaceId}`,
    list: (userId: string) => `workspace:list:${userId}`,
    byUser: (userId: string) => `workspace:user:${userId}:*`,
    members: (workspaceId: string) => `workspace:${workspaceId}:members`,
    all: () => `workspace:*`,
  },

  // Search caches (TTL: 30 minutes - expensive operations)
  search: {
    papers: (query: string, filters: string, page: number) =>
      `search:papers:${query}:${filters}:${page}`,
    history: (userId: string) => `search:history:${userId}`,
    all: () => `search:*`,
  },

  // AI Insight caches (TTL: 15 minutes)
  aiInsight: {
    thread: (threadId: string) => `ai:thread:${threadId}`,
    byPaper: (paperId: string) => `ai:paper:${paperId}:threads`,
    messages: (threadId: string, page: number) =>
      `ai:thread:${threadId}:messages:${page}`,
    all: () => `ai:*`,
  },

  // Annotation caches (TTL: 5 minutes)
  annotation: {
    byId: (annotationId: string) => `annotation:${annotationId}`,
    byPaper: (paperId: string, page: number) =>
      `annotation:paper:${paperId}:${page}`,
    byUser: (userId: string) => `annotation:user:${userId}:*`,
    all: () => `annotation:*`,
  },
};

/**
 * Cache TTL (Time To Live) in seconds
 * Optimized for free Redis (30MB limit) - aggressive TTLs
 */
export const CacheTTL = {
  SHORT: 30, // 30 seconds - volatile data (was 60)
  MEDIUM: 120, // 2 minutes - default for most queries (was 300)
  LONG: 300, // 5 minutes - stable data (was 600)
  VERY_LONG: 600, // 10 minutes - expensive operations (was 1800)
  DAY: 3600, // 1 hour - rarely changing data (was 86400)
};

/**
 * Helper to invalidate related caches after mutations
 */
export const CacheInvalidation = {
  // Invalidate all paper-related caches for a user
  userPapers: (userId: string) => [
    CacheKeys.paper.byUser(userId),
    CacheKeys.paper.list(userId, undefined, 1, 10), // First page cache
  ],

  // Invalidate workspace-related caches
  workspace: (workspaceId: string, userId?: string) => [
    CacheKeys.workspace.byId(workspaceId),
    CacheKeys.workspace.members(workspaceId),
    CacheKeys.paper.byWorkspace(workspaceId),
    ...(userId ? [CacheKeys.workspace.list(userId)] : []),
  ],

  // Invalidate collection-related caches
  collection: (collectionId: string, userId?: string) => [
    CacheKeys.collection.byId(collectionId),
    CacheKeys.collection.members(collectionId),
    CacheKeys.collection.papers(collectionId, 1, 10),
    ...(userId ? [CacheKeys.collection.byUser(userId)] : []),
  ],

  // Invalidate paper-related caches
  paper: (paperId: string, userId: string, workspaceId: string) => [
    CacheKeys.paper.byId(paperId),
    CacheKeys.paper.processingStatus(paperId),
    CacheKeys.paper.fileUrl(paperId),
    CacheKeys.paper.byUser(userId),
    CacheKeys.paper.byWorkspace(workspaceId),
    CacheKeys.annotation.byPaper(paperId, 1),
  ],
};
