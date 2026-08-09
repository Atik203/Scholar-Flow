-- Invite expiry (2026-08-10)
-- Pending workspace/collection invitations now expire. The invitationSweeper
-- flips stale PENDING rows to EXPIRED hourly; accept/decline endpoints reject
-- EXPIRED and past-expiry rows.
--
-- Additive + idempotent. ALTER TYPE ... ADD VALUE IF NOT EXISTS requires
-- PostgreSQL 12+ (cloud runs 16+).

ALTER TABLE "WorkspaceInvitation" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "CollectionMember" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TYPE "MembershipStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';
