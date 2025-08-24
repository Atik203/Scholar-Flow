"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let { statusCode = 500, message } = err;
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
    }
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid data format';
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    console.error(`Error ${statusCode}: ${message}`, {
        error: err,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    return error;
};
exports.createError = createError;
//# sourceMappingURL=errorHandler.js.map