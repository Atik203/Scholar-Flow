import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
// TypedSQL generated functions (after running `yarn db:generate` which includes --sql)
// These come from files in prisma/sql/*.sql
// If not yet generated (first run), ensure you executed prisma generate with --sql
import { countUsers } from "@prisma/client/sql";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // For now, keep dynamic filtering using Prisma Client (TypedSQL current queries are static examples)
  // TODO: Extend generated SQL to accept search/filter args when stabilizing filter set.
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Example usage of TypedSQL (static total & page query if no filters applied)
  let total: number;
  if (Object.keys(whereConditions).length === 0) {
    const totalRow = await prisma.$queryRawTyped(countUsers());
    total = (totalRow[0] as any).total;
  } else {
    total = await prisma.user.count({ where: whereConditions });
  }

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
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
