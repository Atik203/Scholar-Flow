import { PrismaClient } from "@prisma/client";

/**
 * Query performance analyzer using EXPLAIN ANALYZE
 */
export class QueryOptimizer {
  constructor(private prisma: PrismaClient) {}

  /**
   * Analyze query performance using EXPLAIN ANALYZE
   * @param query - Raw SQL query to analyze
   * @param params - Query parameters
   */
  async explainAnalyze(
    query: string,
    params: any[] = []
  ): Promise<{
    planningTime: number;
    executionTime: number;
    totalTime: number;
    plan: any[];
  }> {
    try {
      const explainQuery = `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`;
      const result = await this.prisma.$queryRawUnsafe<any[]>(
        explainQuery,
        ...params
      );

      const plan = result[0]["QUERY PLAN"][0];
      const planningTime = plan["Planning Time"] || 0;
      const executionTime = plan["Execution Time"] || 0;

      return {
        planningTime,
        executionTime,
        totalTime: planningTime + executionTime,
        plan: result,
      };
    } catch (error) {
      console.error("Error analyzing query:", error);
      throw error;
    }
  }

  /**
   * Get query execution plan without executing
   * @param query - Raw SQL query
   */
  async explain(query: string, params: any[] = []): Promise<any[]> {
    try {
      const explainQuery = `EXPLAIN (FORMAT JSON) ${query}`;
      const result = await this.prisma.$queryRawUnsafe<any[]>(
        explainQuery,
        ...params
      );
      return result;
    } catch (error) {
      console.error("Error explaining query:", error);
      throw error;
    }
  }

  /**
   * Profile a query and return execution statistics
   */
  async profileQuery<T>(
    queryFn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    const result = await queryFn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (duration > 100) {
      console.warn(`Slow query detected: ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
  }

  /**
   * Get table statistics
   */
  async getTableStats(tableName: string): Promise<{
    rowCount: bigint;
    tableSize: string;
    indexSize: string;
    totalSize: string;
  }> {
    const stats = await this.prisma.$queryRaw<
      Array<{
        table_name: string;
        row_count: bigint;
        table_size: string;
        index_size: string;
        total_size: string;
      }>
    >`
      SELECT
        schemaname || '.' || tablename AS table_name,
        n_live_tup AS row_count,
        pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
        pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS table_size,
        pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename) - pg_relation_size(schemaname || '.' || tablename)) AS index_size
      FROM pg_stat_user_tables
      WHERE tablename = ${tableName}
    `;

    if (stats.length === 0) {
      throw new Error(`Table ${tableName} not found`);
    }

    return {
      rowCount: stats[0].row_count,
      tableSize: stats[0].table_size,
      indexSize: stats[0].index_size,
      totalSize: stats[0].total_size,
    };
  }

  /**
   * Get missing indexes suggestions
   */
  async findMissingIndexes(): Promise<
    Array<{
      table: string;
      column: string;
      seqScans: bigint;
      seqTuples: bigint;
      indexScans: bigint;
      suggestion: string;
    }>
  > {
    const results = await this.prisma.$queryRaw<
      Array<{
        schemaname: string;
        tablename: string;
        attname: string;
        seq_scan: bigint;
        seq_tup_read: bigint;
        idx_scan: bigint | null;
        suggestion: string;
      }>
    >`
      SELECT
        schemaname,
        tablename,
        attname,
        seq_scan,
        seq_tup_read,
        idx_scan,
        CASE
          WHEN seq_scan > 100 AND (idx_scan IS NULL OR idx_scan < seq_scan / 10)
          THEN 'Consider adding index on ' || schemaname || '.' || tablename || '(' || attname || ')'
          ELSE 'Index exists or not needed'
        END AS suggestion
      FROM pg_stat_user_tables st
      JOIN pg_attribute a ON a.attrelid = st.relid
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        AND a.attnum > 0
        AND NOT a.attisdropped
        AND seq_scan > 100
      ORDER BY seq_scan DESC, seq_tup_read DESC
      LIMIT 20
    `;

    return results.map((r) => ({
      table: `${r.schemaname}.${r.tablename}`,
      column: r.attname,
      seqScans: r.seq_scan,
      seqTuples: r.seq_tup_read,
      indexScans: r.idx_scan || BigInt(0),
      suggestion: r.suggestion,
    }));
  }

  /**
   * Get slow queries from pg_stat_statements (requires extension)
   */
  async getSlowQueries(limit: number = 10): Promise<
    Array<{
      query: string;
      calls: bigint;
      totalTime: number;
      meanTime: number;
      maxTime: number;
    }>
  > {
    try {
      const results = await this.prisma.$queryRaw<
        Array<{
          query: string;
          calls: bigint;
          total_exec_time: number;
          mean_exec_time: number;
          max_exec_time: number;
        }>
      >`
        SELECT
          query,
          calls,
          total_exec_time,
          mean_exec_time,
          max_exec_time
        FROM pg_stat_statements
        WHERE query NOT LIKE '%pg_stat_statements%'
        ORDER BY mean_exec_time DESC
        LIMIT ${limit}
      `;

      return results.map((r) => ({
        query: r.query,
        calls: r.calls,
        totalTime: r.total_exec_time,
        meanTime: r.mean_exec_time,
        maxTime: r.max_exec_time,
      }));
    } catch (error) {
      console.warn(
        "pg_stat_statements extension not available. Install it to track slow queries."
      );
      return [];
    }
  }

  /**
   * Get connection pool statistics
   */
  async getConnectionStats(): Promise<{
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
    maxConnections: number;
  }> {
    const results = await this.prisma.$queryRaw<
      Array<{
        total: bigint;
        active: bigint;
        idle: bigint;
        max_conn: number;
      }>
    >`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE state = 'active') as active,
        COUNT(*) FILTER (WHERE state = 'idle') as idle,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_conn
      FROM pg_stat_activity
      WHERE datname = current_database()
    `;

    return {
      totalConnections: Number(results[0].total),
      activeConnections: Number(results[0].active),
      idleConnections: Number(results[0].idle),
      maxConnections: results[0].max_conn,
    };
  }

  /**
   * Vacuum analyze a table to update statistics
   */
  async vacuumAnalyze(tableName: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(`VACUUM ANALYZE ${tableName}`);
  }
}

/**
 * Query performance hints and best practices
 */
export const QueryHints = {
  // Use LIMIT in all list queries
  addLimit: (query: string, limit: number = 100): string => {
    if (!query.toLowerCase().includes("limit")) {
      return `${query} LIMIT ${limit}`;
    }
    return query;
  },

  // Add index hint (PostgreSQL specific)
  addIndexHint: (query: string, indexName: string): string => {
    return `/*+ IndexScan(${indexName}) */ ${query}`;
  },

  // Suggest pagination
  addPagination: (
    query: string,
    page: number = 1,
    pageSize: number = 20
  ): string => {
    const offset = (page - 1) * pageSize;
    return `${query} LIMIT ${pageSize} OFFSET ${offset}`;
  },
};

/**
 * Query performance monitoring middleware
 */
export function createQueryLogger(prisma: PrismaClient) {
  return async (params: any, next: (params: any) => Promise<any>) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    const duration = after - before;

    // Log slow queries
    if (duration > 1000) {
      console.error(
        `SLOW QUERY (${duration}ms): ${params.model}.${params.action}`,
        params.args
      );
    } else if (duration > 500) {
      console.warn(
        `Slow query (${duration}ms): ${params.model}.${params.action}`
      );
    }

    // Log in development
    if (process.env.NODE_ENV === "development" && duration > 100) {
      console.log(
        `Query: ${params.model}.${params.action} - ${duration}ms`,
        params.args
      );
    }

    return result;
  };
}
