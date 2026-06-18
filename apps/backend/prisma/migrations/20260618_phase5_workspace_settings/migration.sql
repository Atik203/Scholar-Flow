-- Phase 5: Workspaces & Team
-- Adds WorkspaceSettings 1:1 model and denormalized Workspace.color + WorkspaceVisibility enum.
-- Purely additive: no column drops, no pgvector touch. Backfills every existing workspace.

-- CreateEnum
CREATE TYPE "WorkspaceVisibility" AS ENUM ('PRIVATE', 'INVITE_ONLY', 'PUBLIC');

-- AlterTable: add denormalized color and visibility to Workspace
ALTER TABLE "Workspace"
  ADD COLUMN "color"      TEXT          NOT NULL DEFAULT 'blue',
  ADD COLUMN "visibility" "WorkspaceVisibility" NOT NULL DEFAULT 'PRIVATE';

-- CreateTable: WorkspaceSettings
CREATE TABLE "WorkspaceSettings" (
    "id"                     TEXT NOT NULL,
    "workspaceId"            TEXT NOT NULL,
    "color"                  TEXT NOT NULL DEFAULT 'blue',
    "coverImageKey"          TEXT,
    "iconKey"                TEXT,
    "allowExternalSharing"   BOOLEAN NOT NULL DEFAULT false,
    "allowDownload"          BOOLEAN NOT NULL DEFAULT true,
    "defaultMemberRole"      "WorkspaceRole" NOT NULL DEFAULT 'EDITOR',
    "requireApprovalForJoin" BOOLEAN NOT NULL DEFAULT false,
    "allowMemberInvites"     BOOLEAN NOT NULL DEFAULT true,
    "allowPublicCollections" BOOLEAN NOT NULL DEFAULT true,
    "aiFeaturesEnabled"      BOOLEAN NOT NULL DEFAULT true,
    "enforce2FAForMembers"   BOOLEAN NOT NULL DEFAULT false,
    "allowedEmailDomains"    TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"              TIMESTAMP(3) NOT NULL,
    "isDeleted"              BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkspaceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceSettings_workspaceId_key" ON "WorkspaceSettings"("workspaceId");
CREATE INDEX "WorkspaceSettings_workspaceId_isDeleted_idx" ON "WorkspaceSettings"("workspaceId", "isDeleted");
CREATE INDEX "Workspace_isDeleted_visibility_idx" ON "Workspace"("isDeleted", "visibility");

-- AddForeignKey: WorkspaceSettings -> Workspace (cascade on delete)
ALTER TABLE "WorkspaceSettings" ADD CONSTRAINT "WorkspaceSettings_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: create a WorkspaceSettings row for every existing workspace.
-- Uses the denormalized color/visibility from Workspace so list views stay consistent.
INSERT INTO "WorkspaceSettings" (
    "id", "workspaceId", "color", "coverImageKey", "iconKey",
    "allowExternalSharing", "allowDownload", "defaultMemberRole", "requireApprovalForJoin",
    "allowMemberInvites", "allowPublicCollections", "aiFeaturesEnabled",
    "enforce2FAForMembers", "allowedEmailDomains",
    "createdAt", "updatedAt", "isDeleted"
)
SELECT
    gen_random_uuid(),
    w."id",
    w."color",
    NULL,
    NULL,
    false,
    true,
    'EDITOR'::"WorkspaceRole",
    false,
    true,
    true,
    true,
    false,
    ARRAY[]::TEXT[],
    NOW(),
    NOW(),
    false
FROM "Workspace" w
WHERE w."isDeleted" = false
ON CONFLICT ("workspaceId") DO NOTHING;
