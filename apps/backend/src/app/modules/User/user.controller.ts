import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { userService } from "./user.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = req.query;
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };

    const result = await userService.getAllFromDB(filters, options);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully!",
        meta: result.meta,
        data: result.data
    });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user as IAuthUser;
    const result = await userService.getMyProfile(user);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile retrieved successfully!",
        data: result
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user as IAuthUser;
    await userService.changePassword(user, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully!",
        data: null
    });
});

export const userController = {
    getAllFromDB,
    getMyProfile,
    changePassword
};
