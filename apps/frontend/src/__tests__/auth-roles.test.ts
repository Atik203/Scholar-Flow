import { describe, expect, it } from "@jest/globals";
import {
  getDashboardBasePath,
  getRoleBadgeVariant,
  hasPermission,
  hasRoleAccess,
  USER_ROLES,
} from "@/lib/auth/roles";

describe("auth role helpers", () => {
  it("enforces the role hierarchy and canonical dashboard paths", () => {
    expect(hasRoleAccess(USER_ROLES.ADMIN, USER_ROLES.TEAM_LEAD)).toBe(true);
    expect(hasRoleAccess(USER_ROLES.RESEARCHER, USER_ROLES.TEAM_LEAD)).toBe(false);
    expect(hasRoleAccess(undefined, USER_ROLES.RESEARCHER)).toBe(false);

    expect(getDashboardBasePath(USER_ROLES.ADMIN)).toBe("/dashboard/admin");
    expect(getDashboardBasePath(USER_ROLES.RESEARCHER)).toBe("/dashboard");
  });

  it("checks permissions per role", () => {
    expect(hasPermission(USER_ROLES.ADMIN, "admin:settings")).toBe(true);
    expect(hasPermission(USER_ROLES.RESEARCHER, "admin:settings")).toBe(false);
    expect(hasPermission(USER_ROLES.RESEARCHER, "paper:read")).toBe(true);
  });

  it("maps roles to badge variants", () => {
    expect(getRoleBadgeVariant(USER_ROLES.ADMIN)).toBe("destructive");
    expect(getRoleBadgeVariant(USER_ROLES.TEAM_LEAD)).toBe("default");
    expect(getRoleBadgeVariant(USER_ROLES.RESEARCHER)).toBe("outline");
  });
});
