"use client";

import { useEffect } from "react";

/**
 * Senior-level browser cleanup component
 * Runs aggressive cleanup on app initialization to prevent stale auth state
 * This helps resolve persistent user data issues
 */
export function BrowserCleanup() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    try {
      // 1. Clear any orphaned NextAuth cookies
      const cookiesToCheck = [
        "next-auth.session-token",
        "__Secure-next-auth.session-token",
        "next-auth.callback-url",
        "__Secure-next-auth.callback-url",
        "next-auth.csrf-token",
        "__Host-next-auth.csrf-token",
      ];

      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        const trimmedName = name.trim();

        // Check if this is a NextAuth cookie
        if (
          trimmedName.includes("next-auth") ||
          trimmedName.includes("__Secure-next-auth") ||
          trimmedName.includes("__Host-next-auth")
        ) {
          // Get the cookie value to check if it's invalid/expired
          const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${trimmedName}=`))
            ?.split("=")[1];

          // If cookie seems malformed or empty, clear it
          if (
            !cookieValue ||
            cookieValue === "undefined" ||
            cookieValue === "null"
          ) {
            const deletionStrings = [
              `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,
              `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure;`,
              `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`,
            ];
            deletionStrings.forEach((str) => (document.cookie = str));
          }
        }
      });

      // 2. Check for and clear any orphaned localStorage keys (non-auth, for safety)
      // We don't use localStorage for auth anymore, but clear any legacy keys
      const keysToCheck = [
        "auth-token",
        "user-data",
        "session-data",
        "access-token",
        "refresh-token",
      ];

      keysToCheck.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(
            `[BrowserCleanup] Removed orphaned localStorage key: ${key}`
          );
        }
      });

      // 3. Check sessionStorage too
      keysToCheck.forEach((key) => {
        if (sessionStorage.getItem(key)) {
          sessionStorage.removeItem(key);
          console.log(
            `[BrowserCleanup] Removed orphaned sessionStorage key: ${key}`
          );
        }
      });
    } catch (error) {
      // Silently fail - cleanup is best effort
      if (process.env.NODE_ENV === "development") {
        console.error("[BrowserCleanup] Error during cleanup:", error);
      }
    }
  }, []); // Run once on mount

  return null; // This component doesn't render anything
}
