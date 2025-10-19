import { Request } from "express";

export interface IAuthUser {
  userId: string;
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: IAuthUser;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
