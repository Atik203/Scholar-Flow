import { describe, expect, it } from "@jest/globals";
import {
  inviteTeamMemberSchema,
  teamMemberParamsSchema,
  updateTeamSettingsSchema,
} from "../app/modules/Team/team.validation";

describe("team validation schemas", () => {
  it("accepts invites and defaults the role", () => {
    const result = inviteTeamMemberSchema.safeParse({
      email: "new.member@example.com",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe("RESEARCHER");
    }
  });

  it("rejects invalid member ids and unknown roles", () => {
    expect(teamMemberParamsSchema.safeParse({ userId: "not-a-uuid" }).success).toBe(
      false
    );
    expect(
      inviteTeamMemberSchema.safeParse({
        email: "new.member@example.com",
        role: "SUPERADMIN",
      }).success
    ).toBe(false);
  });

  it("bounds team security settings", () => {
    expect(
      updateTeamSettingsSchema.safeParse({ security: { sessionTimeout: 24 } })
        .success
    ).toBe(true);
    expect(
      updateTeamSettingsSchema.safeParse({ security: { sessionTimeout: 99999 } })
        .success
    ).toBe(false);
  });
});
