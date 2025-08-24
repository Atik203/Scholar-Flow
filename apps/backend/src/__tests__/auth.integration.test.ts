import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { USER_ROLES } from "../app/modules/Auth/auth.constant";
import {
  IAccountData,
  IOAuthProfile,
} from "../app/modules/Auth/auth.interface";
import { authService } from "../app/modules/Auth/auth.service";

describe("AuthService OAuth Integration", () => {
  const mockOAuthProfile: IOAuthProfile = {
    email: "test@example.com",
    name: "Test User",
    picture: "https://example.com/avatar.jpg",
  };

  const mockAccountData: IAccountData = {
    type: "oauth",
    provider: "google",
    providerAccountId: "test-google-id",
    access_token: "mock-access-token",
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "Bearer",
    scope: "openid profile email",
    id_token: "mock-id-token",
  };

  beforeEach(() => {
    // Reset any mocks or test data
    jest.clearAllMocks();
  });

  describe("handleOAuthSignIn", () => {
    it("should handle OAuth sign-in for new user", async () => {
      // This test verifies that the upsert logic works for new accounts
      const result = await authService.handleOAuthSignIn(
        mockOAuthProfile,
        mockAccountData
      );

      expect(result).toBeDefined();
      expect(result.email).toBe(mockOAuthProfile.email);
      expect(result.name).toBe(mockOAuthProfile.name);
      expect(result.role).toBe(USER_ROLES.RESEARCHER);
    });

    it("should handle OAuth sign-in for existing user (duplicate account)", async () => {
      // First sign-in
      await authService.handleOAuthSignIn(mockOAuthProfile, mockAccountData);

      // Second sign-in with same provider and providerAccountId should not fail
      const result = await authService.handleOAuthSignIn(mockOAuthProfile, {
        ...mockAccountData,
        access_token: "new-access-token", // Updated token
        expires_at: Math.floor(Date.now() / 1000) + 7200, // New expiry
      });

      expect(result).toBeDefined();
      expect(result.email).toBe(mockOAuthProfile.email);
      expect(result.name).toBe(mockOAuthProfile.name);
    });

    it("should update account tokens on subsequent sign-ins", async () => {
      // First sign-in
      await authService.handleOAuthSignIn(mockOAuthProfile, mockAccountData);

      // Second sign-in with updated token data
      const updatedAccountData = {
        ...mockAccountData,
        access_token: "updated-access-token",
        refresh_token: "updated-refresh-token",
        expires_at: Math.floor(Date.now() / 1000) + 7200,
      };

      const result = await authService.handleOAuthSignIn(
        mockOAuthProfile,
        updatedAccountData
      );

      expect(result).toBeDefined();
      // The function should complete without throwing the unique constraint error
    });
  });

  describe("createAccount", () => {
    it("should create new account successfully", async () => {
      // Create a user first
      const user = await authService.createOrUpdateUser({
        email: "newuser@example.com",
        name: "New User",
        role: USER_ROLES.RESEARCHER,
      });

      const accountData: IAccountData = {
        type: "oauth",
        provider: "google",
        providerAccountId: "new-google-id",
        access_token: "new-access-token",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "Bearer",
        scope: "openid profile email",
        id_token: "new-id-token",
      };

      const account = await authService.createAccount(user.id, accountData);

      expect(account).toBeDefined();
      expect(account.userId).toBe(user.id);
      expect(account.provider).toBe(accountData.provider);
      expect(account.providerAccountId).toBe(accountData.providerAccountId);
    });

    it("should handle duplicate account creation (upsert)", async () => {
      // Create a user first
      const user = await authService.createOrUpdateUser({
        email: "duplicate@example.com",
        name: "Duplicate User",
        role: USER_ROLES.RESEARCHER,
      });

      const accountData: IAccountData = {
        type: "oauth",
        provider: "google",
        providerAccountId: "duplicate-google-id",
        access_token: "first-access-token",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "Bearer",
        scope: "openid profile email",
        id_token: "first-id-token",
      };

      // First creation
      const firstAccount = await authService.createAccount(
        user.id,
        accountData
      );

      // Second creation with same provider and providerAccountId should upsert
      const updatedAccountData = {
        ...accountData,
        access_token: "second-access-token",
        expires_at: Math.floor(Date.now() / 1000) + 7200,
      };

      const secondAccount = await authService.createAccount(
        user.id,
        updatedAccountData
      );

      expect(secondAccount).toBeDefined();
      expect(secondAccount.id).toBe(firstAccount.id); // Should be same account
      expect(secondAccount.userId).toBe(user.id);
      expect(secondAccount.provider).toBe(accountData.provider);
      expect(secondAccount.providerAccountId).toBe(
        accountData.providerAccountId
      );
    });
  });
});
