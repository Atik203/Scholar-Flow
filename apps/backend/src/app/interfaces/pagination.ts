export interface IPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IGenericResponse<T> {
    meta: {
        total: number;
        page: number;
        limit: number;
    };
    data: T;
}
