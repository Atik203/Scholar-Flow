/*
  Warnings:

  - You are about to drop the column `role` on the `CollectionMember` table. All the data in the column will be lost.
  - The `role` column on the `WorkspaceInvitation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `WorkspaceMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."WorkspaceRole" AS ENUM ('VIEWER', 'EDITOR', 'MANAGER', 'OWNER');

-- AlterTable
ALTER TABLE "public"."CollectionMember" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "public"."WorkspaceInvitation" DROP COLUMN "role",
ADD COLUMN     "role" "public"."WorkspaceRole" NOT NULL DEFAULT 'EDITOR';

-- AlterTable
ALTER TABLE "public"."WorkspaceMember" DROP COLUMN "role",
ADD COLUMN     "role" "public"."WorkspaceRole" NOT NULL DEFAULT 'EDITOR';

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_isDeleted_role_idx" ON "public"."WorkspaceMember"("workspaceId", "isDeleted", "role");
