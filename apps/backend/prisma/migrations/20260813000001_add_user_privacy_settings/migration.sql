-- Reconciliation migration (2026-08-13)
-- Privacy settings persistence for UserPreference (same JsonB pattern as
-- notificationPreferences). Additive + idempotent, drift-safe.

ALTER TABLE "UserPreference" ADD COLUMN IF NOT EXISTS "privacySettings" JSONB;
