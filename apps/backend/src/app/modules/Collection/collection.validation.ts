import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().optional().default(false),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export const updateCollectionSchema = z.object({
  name: z
    .string()
    .min(1, "Collection name is required")
    .max(100, "Name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  isPublic: z.boolean().optional(),
});

export const addPaperToCollectionSchema = z.object({
  paperId: z.string().uuid("Invalid paper ID"),
});

export const removePaperFromCollectionSchema = z.object({
  paperId: z.string().uuid("Invalid paper ID"),
});

export const collectionParamsSchema = z.object({
  id: z.string().uuid("Invalid collection ID"),
});

export const collectionIdParamsSchema = z.object({
  collectionId: z.string().uuid("Invalid collection ID"),
});

export const paperCollectionParamsSchema = z.object({
  collectionId: z.string().uuid("Invalid collection ID"),
  paperId: z.string().uuid("Invalid paper ID"),
});

// Invite a member to a collection by email
export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z
    .enum(["RESEARCHER", "PRO_RESEARCHER", "TEAM_LEAD", "ADMIN"]) // mirrors Role enum
    .optional()
    .default("RESEARCHER"),
  permission: z
    .enum(["VIEW", "EDIT"]) // mirrors CollectionPermission enum
    .optional()
    .default("EDIT"),
});

// Accept or decline an invite
export const inviteActionSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
export type AddPaperToCollectionInput = z.infer<
  typeof addPaperToCollectionSchema
>;
export type RemovePaperFromCollectionInput = z.infer<
  typeof removePaperFromCollectionSchema
>;
export type CollectionParams = z.infer<typeof collectionParamsSchema>;
export type CollectionIdParams = z.infer<typeof collectionIdParamsSchema>;
export type PaperCollectionParams = z.infer<typeof paperCollectionParamsSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type InviteActionInput = z.infer<typeof inviteActionSchema>;
