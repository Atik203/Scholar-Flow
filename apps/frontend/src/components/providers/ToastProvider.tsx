"use client";

import { useTheme } from "next-themes";
import { Toaster, toast } from "sonner";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme as any}
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        className: "bg-background text-foreground border",
      }}
    />
  );
}

// Toast utility functions with role-based styling
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 5000,
  });
};

export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 4000,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 3000,
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// Role-specific toast messages
export const showRoleUpdateToast = (
  oldRole: string,
  newRole: string,
  userName: string
) => {
  showSuccessToast(
    "Role Updated Successfully",
    `${userName}'s role has been changed from ${oldRole} to ${newRole}`
  );
};

export const showAccessDeniedToast = (requiredRole: string) => {
  showErrorToast(
    "Access Denied",
    `This feature requires ${requiredRole} privileges or higher`
  );
};

export const showAuthSuccessToast = (provider: string) => {
  showSuccessToast(
    "Authentication Successful",
    `Successfully signed in with ${provider}`
  );
};

export const showAuthErrorToast = (error?: string) => {
  showErrorToast(
    "Authentication Failed",
    error || "There was an error signing in. Please try again."
  );
};
