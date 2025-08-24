declare class ApiError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string | undefined, stack?: string);
}
export default ApiError;
//# sourceMappingURL=ApiError.d.ts.map