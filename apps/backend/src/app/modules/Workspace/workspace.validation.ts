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
  cursor: z.string().uuid().optional(),
  limit: z.string().optional(),
  scope: z.string().optional(),
});

export const invitationListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const addMemberSchema = z
  .object({
    // allow add by either userId or email
    userId: z.string().uuid().optional(),
    email: z.string().email().optional(),
    role: z
      .enum(["VIEWER", "EDITOR", "MANAGER", "OWNER"])
      .optional(),
  })
  .refine((data) => !!data.userId || !!data.email, {
    message: "Either userId or email is required",
    path: ["userId"],
  });

export const updateMemberRoleSchema = z.object({
  role: z.enum(["VIEWER", "EDITOR", "MANAGER", "OWNER"]),
});

export const memberParamsSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
});

// Invite a member to a workspace by email
export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z
    .enum(["VIEWER", "EDITOR", "MANAGER", "OWNER"])
    .optional()
    .default("EDITOR"),
});

// Phase 5 — WorkspaceSettings update schema
export const updateWorkspaceSettingsSchema = z
  .object({
    color: z.enum(["blue", "purple", "green", "orange", "pink"]).optional(),
    coverImageKey: z.string().max(500).nullable().optional(),
    iconKey: z.string().max(500).nullable().optional(),
    allowExternalSharing: z.boolean().optional(),
    allowDownload: z.boolean().optional(),
    defaultMemberRole: z
      .enum(["VIEWER", "EDITOR", "MANAGER", "OWNER"])
      .optional(),
    requireApprovalForJoin: z.boolean().optional(),
    allowMemberInvites: z.boolean().optional(),
    allowPublicCollections: z.boolean().optional(),
    aiFeaturesEnabled: z.boolean().optional(),
    enforce2FAForMembers: z.boolean().optional(),
    allowedEmailDomains: z.array(z.string().max(255)).max(50).optional(),
  })
  .strict();
