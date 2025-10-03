import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AsyncRequestHandler } from "../../types/express";
import { userService } from "./user.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const options = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as "asc" | "desc",
  };

  const result = await userService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user as IAuthUser;
  const result = await userService.getMyProfile(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully!",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user as IAuthUser;

  if (!user || !user.id) {
    throw new Error(
      "User authentication failed: user object is missing or invalid"
    );
  }

  const result = await userService.updateProfile(user, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully!",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user as IAuthUser;
  await userService.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully!",
    data: null,
  });
});

const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user as IAuthUser;

  if (!user || !user.id) {
    throw new Error(
      "User authentication failed: user object is missing or invalid"
    );
  }

  const result = await userService.deleteAccount(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Account deleted successfully!",
    data: result,
  });
});

const uploadProfilePicture = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user as IAuthUser;

  if (!user || !user.id) {
    throw new ApiError(401, "User authentication failed");
  }

  if (!req.file) {
    throw new ApiError(400, "Profile picture file is required");
  }

  // Validate file type
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new ApiError(
      400,
      "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
    );
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    throw new ApiError(400, "File size too large. Maximum size is 5MB");
  }

  const result = await userService.uploadProfilePicture(user, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile picture uploaded successfully!",
    data: result,
  });
});

const getUserAnalytics = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user as IAuthUser;

  if (!user || !user.id) {
    throw new ApiError(401, "User authentication failed");
  }

  const result = await userService.getUserAnalytics(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User analytics retrieved successfully!",
    data: result,
  });
});

export const userController: {
  getAllFromDB: AsyncRequestHandler;
  getMyProfile: AsyncRequestHandler;
  updateProfile: AsyncRequestHandler;
  changePassword: AsyncRequestHandler;
  deleteAccount: AsyncRequestHandler;
  uploadProfilePicture: AsyncRequestHandler;
  getUserAnalytics: AsyncRequestHandler;
} = {
  getAllFromDB,
  getMyProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  uploadProfilePicture,
  getUserAnalytics,
};
