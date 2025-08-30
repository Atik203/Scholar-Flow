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

// Export types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
