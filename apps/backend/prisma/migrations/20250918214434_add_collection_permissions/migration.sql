-- CreateEnum
CREATE TYPE "public"."CollectionPermission" AS ENUM ('VIEW', 'EDIT');

-- AlterTable
ALTER TABLE "public"."CollectionMember" ADD COLUMN     "permission" "public"."CollectionPermission" NOT NULL DEFAULT 'EDIT';
