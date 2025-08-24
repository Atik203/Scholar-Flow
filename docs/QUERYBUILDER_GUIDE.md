# PostgreSQL QueryBuilder & Modular SQL Guide

## Overview

This document explains the enhanced query system for Scholar-Flow that includes:

1. **PostgreSQL QueryBuilder** - A Prisma-compatible query builder for dynamic filtering, searching, sorting, and pagination
2. **Modular TypedSQL Structure** - Organized SQL files by feature modules for complex, optimized queries

## 📁 Project Structure

```
apps/backend/
├── src/app/builders/
│   └── QueryBuilder.ts                 # PostgreSQL QueryBuilder class
├── prisma/sql/                        # Modular TypedSQL files
│   ├── auth/                          # Authentication queries
│   │   ├── createAccount.sql
│   │   ├── createSession.sql
│   │   ├── deleteSession.sql
│   │   └── getSessionByToken.sql
│   ├── user/                          # User management queries
│   │   ├── createUser.sql
│   │   ├── getUserByEmail.sql
│   │   ├── getUserById.sql
│   │   ├── getUsersWithPagination.sql
│   │   ├── countUsers.sql
│   │   └── user.sql
│   ├── paper/                         # Paper management queries
│   │   ├── getPapersWithPagination.sql
│   │   ├── countPapers.sql
│   │   ├── searchPapers.sql
│   │   └── searchPaperChunksByEmbedding.sql
│   └── collection/                    # Collection management queries
│       ├── getCollectionsWithPagination.sql
│       ├── countCollections.sql
│       └── getUserCollections.sql
```

## 🚀 QueryBuilder Usage

### Basic Usage

```typescript
import QueryBuilder from "../../builders/QueryBuilder";
import prisma from "../../shared/prisma";

// Simple query with search, filter, sort, and pagination
const queryBuilder = QueryBuilder.create("user", req.query)
  .search(["email", "name"]) // Search in specified fields
  .filter() // Apply filters from query params
  .sort() // Apply sorting
  .paginate() // Apply pagination
  .fields(["id", "email", "role"]); // Select specific fields

const result = await queryBuilder.executeWithMeta(prisma.user);
```

### Advanced Features

#### 1. Search with Multiple Fields

```typescript
const searchableFields = ["title", "authors", "fileName", "extractedText"];
const queryBuilder = QueryBuilder.create("paper", query)
  .search(searchableFields) // Case-insensitive search across all fields
  .filter()
  .sort()
  .paginate();
```

#### 2. Include Relations

```typescript
const queryBuilder = QueryBuilder.create("paper", query)
  .include({
    uploader: {
      select: { id: true, email: true },
    },
    chunks: true,
    collections: {
      include: {
        collection: {
          select: { id: true, name: true },
        },
      },
    },
  })
  .paginate();
```

#### 3. Date Range Filtering

```typescript
const queryBuilder = QueryBuilder.create("paper", query)
  .dateRange("createdAt", "2024-01-01", "2024-12-31")
  .filter()
  .sort();
```

#### 4. Numeric Range Filtering

```typescript
const queryBuilder = QueryBuilder.create("paper", query)
  .numericRange("fileSize", 1000, 10000000) // Min 1KB, Max 10MB
  .filter()
  .sort();
```

#### 5. Custom Where Conditions

```typescript
const queryBuilder = QueryBuilder.create("user", query);
const prismaQuery = queryBuilder.build();

// Add custom conditions
prismaQuery.where = {
  ...prismaQuery.where,
  isDeleted: false,
  role: { in: ["USER", "ADMIN"] },
};

const users = await prisma.user.findMany(prismaQuery);
```

### Query Parameters

The QueryBuilder accepts these URL query parameters:

- `searchTerm`: Global search across specified fields
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sorting field(s) with direction (e.g., `-createdAt,title`)
- `fields`: Select specific fields (e.g., `id,email,role`)
- Any other field for filtering (e.g., `role=ADMIN&isActive=true`)

**Example URLs:**

```
GET /api/papers?searchTerm=machine learning&page=2&limit=20&sort=-createdAt,title&fields=id,title,authors
GET /api/users?role=ADMIN&isActive=true&sort=email&page=1&limit=50
GET /api/collections?isPublic=true&sort=-updatedAt&searchTerm=AI
```

## 🗃️ TypedSQL Usage

### Setup

1. Create SQL files in appropriate module folders
2. Generate TypedSQL functions:

```bash
yarn db:generate  # Generates Prisma Client + TypedSQL functions
```

### Writing SQL Files

#### Naming Convention

- Use camelCase for file names (becomes function name)
- File name must be valid JavaScript identifier
- Cannot start with `$`

#### Parameter Syntax

```sql
-- @param {Int} $1:limit
-- @param {Int} $2:skip
-- @param {String} $3:searchTerm

SELECT * FROM "User"
WHERE email ILIKE '%' || $3 || '%'
ORDER BY "createdAt" DESC
LIMIT $1 OFFSET $2;
```

#### Complex Example with Joins and Aggregations

```sql
-- Get collections with paper count and owner info
-- @param {String} $1:userId

SELECT
  c.id,
  c.name,
  c.description,
  c."isPublic",
  c."createdAt",
  u.email as "ownerEmail",
  COUNT(cp.id) as "paperCount"
FROM "Collection" c
LEFT JOIN "User" u ON c."ownerId" = u.id
LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId"
WHERE c."ownerId" = $1 AND c."isDeleted" = false
GROUP BY c.id, u.email
ORDER BY c."createdAt" DESC;
```

### Using Generated TypedSQL Functions

```typescript
// Import generated functions
import { getUsersWithPagination, countUsers } from "@prisma/client/sql";

// Execute typed queries
const users = await prisma.$queryRawTyped(getUsersWithPagination(10, 0));
const totalResult = await prisma.$queryRawTyped(countUsers());
const total = totalResult[0].total;
```

## 🔄 When to Use What

### Use QueryBuilder When:

- ✅ Dynamic filtering based on user input
- ✅ Standard CRUD operations
- ✅ Simple to moderate complexity queries
- ✅ Need for flexible field selection
- ✅ Rapid development with type safety

### Use TypedSQL When:

- ✅ Complex joins and aggregations
- ✅ Performance-critical queries
- ✅ Custom PostgreSQL features (full-text search, arrays, JSON)
- ✅ Reporting and analytics queries
- ✅ Bulk operations

### Hybrid Approach Example

```typescript
export class PaperService {
  // Use QueryBuilder for flexible filtering
  static async getAll(params: any, options: IPaginationOptions) {
    const queryBuilder = QueryBuilder.create("paper", { ...params, ...options })
      .search(["title", "authors"])
      .filter()
      .sort()
      .paginate();

    return await queryBuilder.executeWithMeta(prisma.paper);
  }

  // Use TypedSQL for complex analytics
  static async getAnalytics(startDate: string, endDate: string) {
    return await prisma.$queryRawTyped(getPaperAnalytics(startDate, endDate));
  }
}
```

## 🛡️ Best Practices

### QueryBuilder Best Practices

1. **Limit Field Selection**

```typescript
.fields(['id', 'title', 'createdAt'])  // Don't select large text fields unless needed
```

2. **Use Includes Wisely**

```typescript
.include({
  uploader: { select: { id: true, email: true } }  // Select only needed fields
})
```

3. **Validate Pagination Limits**

```typescript
const validLimit = Math.min(100, Math.max(1, limit)); // Built into QueryBuilder
```

4. **Handle Errors Gracefully**

```typescript
try {
  const result = await queryBuilder.executeWithMeta(prisma.paper);
  return result;
} catch (error) {
  console.error("Query error:", error);
  throw new AppError(500, "Database query failed");
}
```

### TypedSQL Best Practices

1. **Use Meaningful Comments**

```sql
-- Get user dashboard statistics with paper and collection counts
-- @param {String} $1:userId - The ID of the user
```

2. **Leverage PostgreSQL Features**

```sql
-- Use PostgreSQL-specific functions
SELECT
  title,
  ts_rank(to_tsvector('english', title || ' ' || authors), plainto_tsquery($1)) as rank
FROM "Paper"
WHERE to_tsvector('english', title || ' ' || authors) @@ plainto_tsquery($1)
ORDER BY rank DESC;
```

3. **Handle NULL Values**

```sql
COALESCE(COUNT(papers.id), 0) as "paperCount"
```

4. **Use Proper Indexing**

```sql
-- Ensure indexes exist for WHERE and ORDER BY clauses
CREATE INDEX IF NOT EXISTS idx_papers_title_gin ON "Paper" USING gin(to_tsvector('english', title));
```

## 🔧 Migration Strategy

### Phase 1: Introduce QueryBuilder

1. Update existing services to use QueryBuilder
2. Keep TypedSQL for existing complex queries
3. Test thoroughly with existing API endpoints

### Phase 2: Add Modular SQL

1. Organize existing SQL files into modules
2. Run `yarn db:generate` to regenerate functions
3. Update imports in services

### Phase 3: Optimize Performance

1. Identify slow QueryBuilder queries
2. Convert to optimized TypedSQL
3. Add database indexes as needed
4. Monitor query performance

## 📊 Performance Considerations

### QueryBuilder Performance

- ✅ Good for < 10,000 records with proper indexing
- ✅ Automatic query optimization by Prisma
- ⚠️ May generate suboptimal SQL for complex joins
- ⚠️ Limited control over query execution plan

### TypedSQL Performance

- ✅ Full control over SQL optimization
- ✅ Can leverage advanced PostgreSQL features
- ✅ Better for complex reporting queries
- ⚠️ Requires SQL expertise
- ⚠️ Manual optimization needed

## 🧪 Testing

### QueryBuilder Tests

```typescript
describe("PaperService with QueryBuilder", () => {
  it("should search papers by title", async () => {
    const result = await PaperService.getAllWithQueryBuilder(
      { searchTerm: "machine learning" },
      { page: 1, limit: 10 }
    );

    expect(result.result).toBeDefined();
    expect(result.meta.total).toBeGreaterThan(0);
  });
});
```

### TypedSQL Tests

```typescript
describe("PaperService with TypedSQL", () => {
  it("should get papers with pagination", async () => {
    const result = await PaperService.getAllWithTypedSQL(10, 0);

    expect(result.result).toHaveLength(10);
    expect(result.meta.page).toBe(1);
  });
});
```

## 🎯 Next Steps

1. **Complete Migration**: Update all existing services to use the new QueryBuilder
2. **Add More SQL Modules**: Create additional TypedSQL files for complex operations
3. **Performance Monitoring**: Set up query performance tracking
4. **Documentation**: Add API documentation with query examples
5. **Caching Layer**: Consider adding Redis caching for frequently accessed data

---

**Need Help?**

- Check the QueryBuilder source code for all available methods
- Review existing SQL files for patterns and examples
- Monitor Prisma documentation for TypedSQL updates
