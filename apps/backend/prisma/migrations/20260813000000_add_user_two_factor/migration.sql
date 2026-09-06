-- Reconciliation migration (2026-08-13)
-- Two-factor authentication (TOTP) fields for the User model.
--
-- Additive + idempotent: ADD COLUMN IF NOT EXISTS. Drift-safe for the
-- shared cloud DB. twoFactorSecret stores AES-256-GCM ciphertext
-- (iv:tag:cipher) so the raw TOTP secret never sits in plaintext.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
