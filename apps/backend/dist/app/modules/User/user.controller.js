"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = req.query;
    const options = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };
    const result = await user_service_1.userService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully!",
        meta: result.meta,
        data: result.data
    });
});
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await user_service_1.userService.getMyProfile(user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Profile retrieved successfully!",
        data: result
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    await user_service_1.userService.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully!",
        data: null
    });
});
exports.userController = {
    getAllFromDB,
    getMyProfile,
    changePassword
};
//# sourceMappingURL=user.controller.js.map