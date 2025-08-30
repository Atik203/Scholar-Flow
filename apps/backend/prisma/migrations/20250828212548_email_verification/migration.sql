-- CreateEnum
CREATE TYPE "public"."TokenType" AS ENUM ('PASSWORD_RESET', 'EMAIL_VERIFICATION');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."UserToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "public"."TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_token_key" ON "public"."UserToken"("token");

-- CreateIndex
CREATE INDEX "UserToken_userId_idx" ON "public"."UserToken"("userId");

-- CreateIndex
CREATE INDEX "UserToken_token_idx" ON "public"."UserToken"("token");

-- CreateIndex
CREATE INDEX "UserToken_type_idx" ON "public"."UserToken"("type");

-- CreateIndex
CREATE INDEX "UserToken_expiresAt_idx" ON "public"."UserToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "public"."UserToken" ADD CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
