import QueryBuilder from "../../builders/QueryBuilder";
import prisma from "../../shared/prisma";
// TypedSQL usage is optional; fallback to Prisma count in Phase 1
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  // Combine params and options for QueryBuilder
  const query = { ...params, ...options };

  // Define searchable fields for users
  const searchableFields = ["email", "role"];

  // Create QueryBuilder instance
  const queryBuilder = QueryBuilder.create("user", query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields(["id", "email", "role", "createdAt", "updatedAt"]);

  // Execute query with metadata
  const result = await queryBuilder.executeWithMeta(prisma.user);

  return result;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      isDeleted: false,
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userInfo;
};

const changePassword = async (user: IAuthUser, payload: any) => {
  // Password-based auth isn't implemented in Prisma User model; skipping for dev boot.
  return;
};

export const userService = {
  getAllFromDB,
  getMyProfile,
  changePassword,
};
