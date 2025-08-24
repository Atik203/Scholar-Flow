import { NextFunction, Request, Response } from "express";
declare const catchAsync: (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map