"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const globalErrorHandler = (err, req, res, _next) => {
    let statusCode = 500;
    const success = false;
    let message = "Something went wrong!";
    let error = undefined;
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation error";
        error = err.issues;
    }
    else if (isPrismaKnownRequestError(err)) {
        const code = err.code;
        switch (code) {
            case "P2002":
                statusCode = 409;
                message = "Unique constraint failed";
                break;
            case "P2025":
                statusCode = 404;
                message = "Record not found";
                break;
            default:
                statusCode = 400;
                message = "Database request error";
        }
        error = { code, meta: err.meta };
    }
    else if (err instanceof ApiError_1.default) {
        statusCode = err.statusCode || statusCode;
        message = err.message || message;
    }
    else if (err instanceof Error) {
        message = err.message || message;
    }
    const maybeStatus = err?.statusCode;
    if (typeof maybeStatus === "number") {
        statusCode = maybeStatus;
    }
    res.status(statusCode).json({
        success,
        message,
        error,
    });
};
function isPrismaKnownRequestError(e) {
    const code = e?.code;
    return typeof code === "string" && code.startsWith("P");
}
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map