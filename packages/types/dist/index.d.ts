export interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
    createdAt?: Date | string;
    updatedAt?: Date | string;
    isDeleted?: boolean;
}
export type { User as TUser };
export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}
export interface SessionResponse {
    success: boolean;
    message: string;
    data: {
        valid: boolean;
        user?: User;
    };
}
