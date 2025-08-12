import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    // Handle different types of errors
    if (err.name === 'ValidationError') {
        message = 'Validation Error';
        error = err.message;
    } else if (err.name === 'CastError') {
        message = 'Invalid ID';
        error = err.message;
    } else if (err.code === 11000) {
        message = 'Duplicate Entry';
        error = err.message;
    }

    if (err.statusCode) {
        statusCode = err.statusCode;
    }

    res.status(statusCode).json({
        success,
        message,
        error
    });
};

export default globalErrorHandler;
