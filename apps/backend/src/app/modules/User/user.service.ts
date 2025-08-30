import QueryBuilder from "../../builders/QueryBuilder";
import prisma from "../../shared/prisma";
// TypedSQL usage is optional; fallback to Prisma count in Phase 1
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { UpdateProfileInput } from "./user.validation";

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
      name: true,
      firstName: true,
      lastName: true,
      institution: true,
      fieldOfStudy: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      emailVerified: true,
    },
  });

  return userInfo;
};

const updateProfile = async (_user: IAuthUser, payload: UpdateProfileInput) => {
  // Debug logging
  console.log("UpdateProfile Service - User:", _user);
  console.log("UpdateProfile Service - Payload:", payload);

  if (!_user || !_user.id) {
    throw new Error("User object is missing or invalid in service layer");
  }

  // Extract allowed fields for update
  const allowedFields = {
    name: payload.name,
    firstName: payload.firstName,
    lastName: payload.lastName,
    institution: payload.institution,
    fieldOfStudy: payload.fieldOfStudy,
    image: payload.image,
  };

  // Remove undefined values
  const updateData = Object.fromEntries(
    Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
  );

  const updatedUser = await prisma.user.update({
    where: {
      id: _user.id,
      isDeleted: false,
    },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      lastName: true,
      institution: true,
      fieldOfStudy: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const changePassword = async (_user: IAuthUser, _payload: any) => {
  // Password-based auth isn't implemented in Prisma User model; skipping for dev boot.
  return;
};

export const userService = {
  getAllFromDB,
  getMyProfile,
  updateProfile,
  changePassword,
};
