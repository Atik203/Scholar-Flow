import { Response } from 'express';
interface IApiResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data?: T | null;
}
declare const sendResponse: <T>(res: Response, data: IApiResponse<T>) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map