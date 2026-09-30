import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/lib/auth/authCookies", () => ({
  setAuthCookie: jest.fn(),
  clearAuthCookie: jest.fn(),
}));

import authReducer, {
  clearCredentials,
  setCredentials,
  updateUser,
} from "@/redux/auth/authSlice";
import type { TUser } from "@/types/user";

const user = {
  id: "user_1",
  email: "demo@scholarflow.com",
  name: "Demo User",
  role: "RESEARCHER",
} as unknown as TUser;

describe("authSlice reducer", () => {
  it("sets credentials, updates the profile, and clears the session", () => {
    const signedIn = authReducer(
      undefined,
      setCredentials({ user, accessToken: "token-123", sessionToken: "s-1" })
    );

    expect(signedIn.user?.email).toBe("demo@scholarflow.com");
    expect(signedIn.accessToken).toBe("token-123");
    expect(signedIn.sessionToken).toBe("s-1");
    expect(signedIn.isAuthenticated).toBe(true);
    expect(signedIn.isLoading).toBe(false);

    const updated = authReducer(signedIn, updateUser({ name: "Renamed" }));
    expect(updated.user?.name).toBe("Renamed");

    const signedOut = authReducer(updated, clearCredentials());
    expect(signedOut.user).toBeNull();
    expect(signedOut.accessToken).toBeNull();
    expect(signedOut.isAuthenticated).toBe(false);
  });

  it("ignores profile updates when signed out", () => {
    const state = authReducer(undefined, updateUser({ name: "Ghost" }));

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
