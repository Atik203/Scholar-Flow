export interface IUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

export interface IUserData {
  id?: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
}

export interface IAccountData {
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface ISessionData {
  sessionToken: string;
  expires: Date;
  userId?: string;
}

export interface IOAuthProfile {
  email: string;
  name?: string;
  image?: string;
  picture?: string;
  avatar_url?: string;
}

export interface IOAuthSignInRequest {
  profile: IOAuthProfile;
  account: IAccountData;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface ITokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IValidationRequest {
  token: string;
}

export interface ISessionValidationRequest {
  sessionToken: string;
}

export interface IPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IPasswordResetRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  institution?: string;
  fieldOfStudy?: string;
}

export interface IAuthUser {
  id: string;
  email: string;
  role: string;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
