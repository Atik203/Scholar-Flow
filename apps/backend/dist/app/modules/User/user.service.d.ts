import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
export declare const userService: {
    getAllFromDB: (params: any, options: IPaginationOptions) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
        };
        data: {
            createdAt: Date;
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            updatedAt: Date;
        }[];
    }>;
    getMyProfile: (user: IAuthUser) => Promise<{
        createdAt: Date;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        updatedAt: Date;
    }>;
    changePassword: (user: IAuthUser, payload: any) => Promise<void>;
};
//# sourceMappingURL=user.service.d.ts.map