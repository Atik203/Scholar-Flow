import { z } from "zod";

// Profile update validation schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  firstName: z.string().min(1, "First name is required").max(50, "First name too long").optional(),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long").optional(),
  institution: z.string().max(200, "Institution name too long").optional(),
  fieldOfStudy: z.string().max(200, "Field of study too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

// Change password validation schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

export const updateOnboardingSchema = z.object({
  onboardingCompleted: z.boolean().optional(),
  onboardingStep: z.number().int().min(0).max(4).optional(),
});

// User preferences (Phase 3)
export const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().min(2).max(10).optional(),
  timezone: z.string().min(1).max(64).optional(),
  emailDigest: z.boolean().optional(),
  defaultCitationStyle: z.enum(["APA", "MLA", "CHICAGO", "HARVARD", "IEEE", "BIBTEX", "ENDNOTE"]).optional(),
  compactMode: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateOnboardingInput = z.infer<typeof updateOnboardingSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
