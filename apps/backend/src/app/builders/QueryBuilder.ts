import { Prisma } from "@prisma/client";

/**
 * PostgreSQL QueryBuilder for Prisma
 * Adapts the pattern from University Management Backend for PostgreSQL + Prisma
 */
class QueryBuilder<T> {
  public query: Record<string, unknown>;
  public prismaQuery: any;
  public modelName: string;

  constructor(modelName: string, query: Record<string, unknown>) {
    this.modelName = modelName;
    this.query = query;
    this.prismaQuery = {
      where: {},
      orderBy: {},
      skip: 0,
      take: 10,
      select: undefined,
      include: undefined,
    };
  }

  /**
   * Add search functionality using PostgreSQL ILIKE for case-insensitive search
   */
  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;

    if (searchTerm && searchableFields.length > 0) {
      const searchConditions = searchableFields.map((field) => {
        // Handle nested fields like "name.firstName"
        const fieldParts = field.split(".");

        if (fieldParts.length === 1) {
          // Simple field
          return {
            [field]: {
              contains: searchTerm,
              mode: "insensitive" as Prisma.QueryMode,
            },
          };
        } else {
          // Nested field
          const [parent, child] = fieldParts;
          return {
            [parent]: {
              [child]: {
                contains: searchTerm,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          };
        }
      });

      // Add OR condition to existing where clause
      if (this.prismaQuery.where.OR) {
        this.prismaQuery.where.OR.push(...searchConditions);
      } else {
        this.prismaQuery.where.OR = searchConditions;
      }
    }

    return this;
  }

  /**
   * Add filtering functionality
   */
  filter() {
    const queryObj = { ...this.query };
    const excludedFields = ["searchTerm", "page", "limit", "sort", "fields"];

    // Remove excluded fields
    excludedFields.forEach((field) => {
      delete queryObj[field];
    });

    // Convert remaining fields to Prisma where conditions
    Object.entries(queryObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        // Handle different types of filters
        if (typeof value === "string") {
          // For string values, use exact match or contains based on field
          if (key.includes("Id") || key === "id") {
            this.prismaQuery.where[key] = value;
          } else {
            this.prismaQuery.where[key] = {
              contains: value,
              mode: "insensitive" as Prisma.QueryMode,
            };
          }
        } else if (typeof value === "boolean") {
          this.prismaQuery.where[key] = value;
        } else if (typeof value === "number") {
          this.prismaQuery.where[key] = value;
        } else if (Array.isArray(value)) {
          // Handle array filters (e.g., status: ['active', 'pending'])
          this.prismaQuery.where[key] = {
            in: value,
          };
        } else {
          // For other types, use direct assignment
          this.prismaQuery.where[key] = value;
        }
      }
    });

    return this;
  }

  /**
   * Add sorting functionality
   */
  sort() {
    const sortString = this.query.sort as string;

    if (sortString) {
      const sortFields = sortString.split(",");
      const orderBy: any[] = [];

      sortFields.forEach((field) => {
        const trimmedField = field.trim();

        if (trimmedField.startsWith("-")) {
          // Descending order
          const fieldName = trimmedField.substring(1);
          const fieldParts = fieldName.split(".");

          if (fieldParts.length === 1) {
            orderBy.push({ [fieldName]: "desc" });
          } else {
            // Handle nested sorting like "user.name"
            const [parent, child] = fieldParts;
            orderBy.push({
              [parent]: {
                [child]: "desc",
              },
            });
          }
        } else {
          // Ascending order
          const fieldParts = trimmedField.split(".");

          if (fieldParts.length === 1) {
            orderBy.push({ [trimmedField]: "asc" });
          } else {
            // Handle nested sorting
            const [parent, child] = fieldParts;
            orderBy.push({
              [parent]: {
                [child]: "asc",
              },
            });
          }
        }
      });

      this.prismaQuery.orderBy = orderBy;
    } else {
      // Default sorting by createdAt descending
      this.prismaQuery.orderBy = { createdAt: "desc" };
    }

    return this;
  }

  /**
   * Add pagination functionality
   */
  paginate() {
    const page = this.query?.page ? parseInt(this.query.page as string) : 1;
    const limit = this.query?.limit ? parseInt(this.query.limit as string) : 10;

    // Ensure positive values
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // Max 100 items per page

    const skip = (validPage - 1) * validLimit;

    this.prismaQuery.skip = skip;
    this.prismaQuery.take = validLimit;

    return this;
  }

  /**
   * Select specific fields
   */
  fields(defaultFields?: string[]) {
    const fieldsString = this.query.fields as string;

    if (fieldsString) {
      const fields = fieldsString.split(",").map((f) => f.trim());
      const select: any = {};

      fields.forEach((field) => {
        if (field && !field.startsWith("-")) {
          // Handle nested fields
          const fieldParts = field.split(".");
          if (fieldParts.length === 1) {
            select[field] = true;
          } else {
            // For nested fields, we need to use include instead
            const [parent] = fieldParts;
            if (!this.prismaQuery.include) {
              this.prismaQuery.include = {};
            }
            this.prismaQuery.include[parent] = true;
          }
        }
      });

      if (Object.keys(select).length > 0) {
        this.prismaQuery.select = select;
      }
    } else if (defaultFields) {
      // Use default fields if provided
      const select: any = {};
      defaultFields.forEach((field) => {
        select[field] = true;
      });
      this.prismaQuery.select = select;
    }

    return this;
  }

  /**
   * Add include/relations functionality
   */
  include(relations: Record<string, any>) {
    if (!this.prismaQuery.include) {
      this.prismaQuery.include = {};
    }

    Object.assign(this.prismaQuery.include, relations);
    return this;
  }

  /**
   * Add date range filtering
   */
  dateRange(field: string, startDate?: string, endDate?: string) {
    if (startDate || endDate) {
      const dateFilter: any = {};

      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }

      if (endDate) {
        dateFilter.lte = new Date(endDate);
      }

      this.prismaQuery.where[field] = dateFilter;
    }

    return this;
  }

  /**
   * Add numeric range filtering
   */
  numericRange(field: string, min?: number, max?: number) {
    if (min !== undefined || max !== undefined) {
      const numericFilter: any = {};

      if (min !== undefined) {
        numericFilter.gte = min;
      }

      if (max !== undefined) {
        numericFilter.lte = max;
      }

      this.prismaQuery.where[field] = numericFilter;
    }

    return this;
  }

  /**
   * Add full-text search using PostgreSQL
   */
  fullTextSearch(fields: string[], searchTerm: string) {
    if (searchTerm && fields.length > 0) {
      // Use raw SQL for full-text search if needed
      // This would require using Prisma's raw query functionality
      console.warn("Full-text search requires raw SQL implementation");
    }

    return this;
  }

  /**
   * Get the built query object
   */
  build() {
    return this.prismaQuery;
  }

  /**
   * Execute the query and get metadata
   */
  async executeWithMeta(prismaModel: any) {
    const [result, total] = await Promise.all([
      prismaModel.findMany(this.prismaQuery),
      prismaModel.count({ where: this.prismaQuery.where }),
    ]);

    const page = this.query?.page ? parseInt(this.query.page as string) : 1;
    const limit = this.query?.limit ? parseInt(this.query.limit as string) : 10;
    const totalPage = Math.ceil(total / limit);

    return {
      result,
      meta: {
        page,
        limit,
        total,
        totalPage,
      },
    };
  }

  /**
   * Static method to create a new QueryBuilder
   */
  static create<T>(modelName: string, query: Record<string, unknown>) {
    return new QueryBuilder<T>(modelName, query);
  }
}

export default QueryBuilder;
