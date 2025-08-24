"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || undefined,
        data: data.data || null
    };
    res.status(data.statusCode).json(responseData);
};
exports.default = sendResponse;
//# sourceMappingURL=sendResponse.js.map