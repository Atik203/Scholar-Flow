import { z } from "zod";

// ============================================================================
// Team Member schemas
// ============================================================================

export const listTeamMembersSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  role: z.enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"]).optional(),
  status: z.enum(["active", "pending", "inactive", "invited"]).optional(),
});

export const teamMemberParamsSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const updateTeamMemberSchema = z.object({
  role: z.enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"]).optional(),
  // Future: add name, image, etc. as optional fields when admin can edit profile
});

// ============================================================================
// Team Invitation schemas
// ============================================================================

export const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z
    .enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"])
    .optional()
    .default("RESEARCHER"),
  message: z.string().max(500).optional(),
});

export const teamInvitationParamsSchema = z.object({
  id: z.string().uuid("Invalid invitation ID"),
});

export const listTeamInvitationsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "EXPIRED"]).optional(),
  type: z.enum(["received", "sent"]).optional(),
});

// ============================================================================
// Team Activity schemas
// ============================================================================

export const teamActivityQuerySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.string().optional(),
  entity: z.string().optional(),
  memberId: z.string().uuid().optional(),
  startDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  endDate: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
  days: z.string().optional(),
});

export const teamStatsQuerySchema = z.object({
  days: z.string().optional(),
});

// ============================================================================
// Team Settings schemas
// ============================================================================

export const teamGeneralSettingsSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(1000).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY"]).optional(),
  defaultRole: z
    .enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD"])
    .optional(),
  timezone: z.string().max(50).optional(),
  language: z.string().max(10).optional(),
});

export const teamPermissionsSettingsSchema = z.object({
  canMembersInvite: z.boolean().optional(),
  canMembersCreateCollections: z.boolean().optional(),
  canMembersShareExternally: z.boolean().optional(),
  canMembersAccessAI: z.boolean().optional(),
  canMembersExportData: z.boolean().optional(),
  canMembersDeletePapers: z.boolean().optional(),
  requireApprovalForPapers: z.boolean().optional(),
  requireApprovalForCollections: z.boolean().optional(),
});

export const teamNotificationsSettingsSchema = z.object({
  newMemberJoins: z.boolean().optional(),
  paperUploaded: z.boolean().optional(),
  collectionCreated: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  activityAlerts: z.boolean().optional(),
  mentionNotifications: z.boolean().optional(),
});

export const teamSecuritySettingsSchema = z.object({
  enforce2FA: z.boolean().optional(),
  sessionTimeout: z.number().int().min(1).max(720).optional(), // hours (1h to 30d)
  allowedDomains: z.array(z.string().max(255)).optional(),
  passwordPolicy: z.enum(["basic", "strong", "enterprise"]).optional(),
});

export const teamIntegrationsSettingsSchema = z.object({
  slackWebhook: z.string().url().or(z.literal("")).optional(),
  discordWebhook: z.string().url().or(z.literal("")).optional(),
  customWebhook: z.string().url().or(z.literal("")).optional(),
});

export const updateTeamSettingsSchema = z.object({
  general: teamGeneralSettingsSchema.optional(),
  permissions: teamPermissionsSettingsSchema.optional(),
  notifications: teamNotificationsSettingsSchema.optional(),
  security: teamSecuritySettingsSchema.optional(),
  integrations: teamIntegrationsSettingsSchema.optional(),
});
