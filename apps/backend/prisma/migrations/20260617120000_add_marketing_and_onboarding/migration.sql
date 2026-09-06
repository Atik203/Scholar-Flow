-- Add MAGIC_LINK to TokenType enum
ALTER TYPE "TokenType" ADD VALUE IF NOT EXISTS 'MAGIC_LINK';

-- Create NotificationType enum
CREATE TYPE "NotificationType" AS ENUM ('MENTION', 'COMMENT', 'SHARE', 'INVITE', 'PAPER', 'COLLECTION', 'SYSTEM', 'ACHIEVEMENT');

-- Create ContactSubmissionStatus enum
CREATE TYPE "ContactSubmissionStatus" AS ENUM ('NEW', 'READ', 'REPLIED');

-- Rebuild Notification table (drop old columns, add new ones)
ALTER TABLE "Notification" DROP CONSTRAINT IF EXISTS "Notification_userId_fkey";

DROP INDEX IF EXISTS "Notification_userId_createdAt_idx";
DROP INDEX IF EXISTS "idx_notification_user_created";
DROP INDEX IF EXISTS "Notification_createdAt_idx";

ALTER TABLE "Notification" DROP COLUMN IF EXISTS "isDeleted";
ALTER TABLE "Notification" DROP COLUMN IF EXISTS "payload";
ALTER TABLE "Notification" DROP COLUMN IF EXISTS "readAt";
ALTER TABLE "Notification" DROP COLUMN IF EXISTS "updatedAt";

ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "message" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "starred" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "actionUrl" TEXT;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "actorId" TEXT;
ALTER TABLE "Notification" ADD COLUMN IF NOT EXISTS "resourceId" TEXT;

-- Change type column type (drop old, add new)
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType" USING "type"::text::"NotificationType";

-- Add onboarding fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "onboardingStep" INTEGER NOT NULL DEFAULT 0;

-- Create Faq table
CREATE TABLE IF NOT EXISTS "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- Create Testimonial table
CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "avatar" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- Create NewsletterSubscriber table
CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- Create ContactSubmission table
CREATE TABLE IF NOT EXISTS "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactSubmissionStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- Create PageContent table
CREATE TABLE IF NOT EXISTS "PageContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id")
);

-- Create UserPreference table
CREATE TABLE IF NOT EXISTS "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "emailDigest" BOOLEAN NOT NULL DEFAULT true,
    "defaultCitationStyle" TEXT NOT NULL DEFAULT 'APA',
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Faq_category_order_idx" ON "Faq"("category", "order");
CREATE INDEX IF NOT EXISTS "Faq_isPublished_category_order_idx" ON "Faq"("isPublished", "category", "order");
CREATE INDEX IF NOT EXISTS "Testimonial_isPublished_order_idx" ON "Testimonial"("isPublished", "order");
CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_isActive_idx" ON "NewsletterSubscriber"("isActive");
CREATE INDEX IF NOT EXISTS "NewsletterSubscriber_createdAt_idx" ON "NewsletterSubscriber"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt" DESC);
CREATE UNIQUE INDEX IF NOT EXISTS "PageContent_slug_key" ON "PageContent"("slug");
CREATE INDEX IF NOT EXISTS "PageContent_slug_isPublished_idx" ON "PageContent"("slug", "isPublished");
CREATE UNIQUE INDEX IF NOT EXISTS "UserPreference_userId_key" ON "UserPreference"("userId");
CREATE INDEX IF NOT EXISTS "UserPreference_userId_idx" ON "UserPreference"("userId");
CREATE INDEX IF NOT EXISTS "Notification_userId_read_idx" ON "Notification"("userId", "read");
CREATE INDEX IF NOT EXISTS "Notification_createdAt_idx" ON "Notification"("createdAt");

-- Add foreign keys
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
