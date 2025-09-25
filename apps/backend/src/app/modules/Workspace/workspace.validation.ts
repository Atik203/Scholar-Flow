import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(120),
});

export const workspaceParamsSchema = z.object({
  id: z.string().uuid("Invalid workspace ID format. Expected UUID."),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional(),
});

export const listQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  scope: z.enum(["all", "owned", "shared"]).optional(),
});

export const addMemberSchema = z
  .object({
    // allow add by either userId or email
    userId: z.string().uuid().optional(),
    email: z.string().email().optional(),
    role: z
      .enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"])
      .optional(),
  })
  .refine((data) => !!data.userId || !!data.email, {
    message: "Either userId or email is required",
    path: ["userId"],
  });

export const updateMemberRoleSchema = z.object({
  role: z.enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"]),
});

export const memberParamsSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
});

// Invite a member to a workspace by email
export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z
    .enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"])
    .optional()
    .default("RESEARCHER"),
});
