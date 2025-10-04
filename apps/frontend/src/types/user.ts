// Generic API response type for User or {data: User}
export type UserApiResponse = { data: User };
export interface User {
  id: string;
  email: string;
  emailVerified?: Date | string | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  institution: string | null;
  fieldOfStudy: string | null;
  image: string | null;
  role: "RESEARCHER" | "PRO_RESEARCHER" | "TEAM_LEAD" | "ADMIN";
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  stripeCurrentPeriodEnd?: Date | string | null;
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
