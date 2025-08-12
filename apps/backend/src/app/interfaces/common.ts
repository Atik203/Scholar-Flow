export interface IAuthUser {
    email: string;
    role: string;
}

export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
