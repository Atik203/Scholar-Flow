class ApiError extends Error {
    statusCode: number;
    errorCode?: string;

    constructor(statusCode: number, message: string | undefined, errorCode?: string, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
