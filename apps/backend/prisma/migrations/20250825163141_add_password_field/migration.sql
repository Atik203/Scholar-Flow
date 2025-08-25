/*
  Warnings:

  - You are about to drop the column `embedding` on the `PaperChunk` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."PaperChunk" DROP COLUMN "embedding";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT;
