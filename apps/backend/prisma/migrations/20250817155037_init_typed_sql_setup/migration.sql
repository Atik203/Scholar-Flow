-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM (
    'RESEARCHER',
    'PRO_RESEARCHER',
    'TEAM_LEAD',
    'ADMIN'
);

-- CreateEnum
CREATE TYPE "public"."AnnotationType" AS ENUM ('HIGHLIGHT', 'COMMENT', 'NOTE');

-- CreateEnum
CREATE TYPE "public"."PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "public"."PlanTier" AS ENUM ('FREE', 'PRO', 'INSTITUTIONAL');

-- CreateTable
CREATE TABLE
    "public"."User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "image" TEXT,
        "role" "public"."Role" NOT NULL DEFAULT 'RESEARCHER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Workspace" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "ownerId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."WorkspaceMember" (
        "id" TEXT NOT NULL,
        "workspaceId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "role" "public"."Role" NOT NULL DEFAULT 'RESEARCHER',
        "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Paper" (
        "id" TEXT NOT NULL,
        "workspaceId" TEXT NOT NULL,
        "uploaderId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "abstract" TEXT,
        "metadata" JSONB NOT NULL,
        "source" TEXT,
        "doi" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."PaperFile" (
        "id" TEXT NOT NULL,
        "paperId" TEXT NOT NULL,
        "storageProvider" TEXT NOT NULL,
        "objectKey" TEXT NOT NULL,
        "contentType" TEXT,
        "sizeBytes" INTEGER,
        "pageCount" INTEGER,
        "checksum" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "PaperFile_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."PaperChunk" (
        "id" TEXT NOT NULL,
        "paperId" TEXT NOT NULL,
        "idx" INTEGER NOT NULL,
        "page" INTEGER,
        "content" TEXT NOT NULL,
        "embedding" JSONB,
        "tokenCount" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "PaperChunk_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Citation" (
        "id" TEXT NOT NULL,
        "sourcePaperId" TEXT NOT NULL,
        "targetPaperId" TEXT NOT NULL,
        "context" TEXT,
        "location" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Annotation" (
        "id" TEXT NOT NULL,
        "paperId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" "public"."AnnotationType" NOT NULL DEFAULT 'HIGHLIGHT',
        "anchor" JSONB NOT NULL,
        "text" TEXT NOT NULL,
        "version" INTEGER NOT NULL DEFAULT 1,
        "parentId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."AnnotationVersion" (
        "id" TEXT NOT NULL,
        "annotationId" TEXT NOT NULL,
        "version" INTEGER NOT NULL,
        "text" TEXT NOT NULL,
        "changedById" TEXT NOT NULL,
        "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "AnnotationVersion_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Collection" (
        "id" TEXT NOT NULL,
        "workspaceId" TEXT NOT NULL,
        "ownerId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "isPublic" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."CollectionPaper" (
        "id" TEXT NOT NULL,
        "collectionId" TEXT NOT NULL,
        "paperId" TEXT NOT NULL,
        "addedById" TEXT NOT NULL,
        "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "CollectionPaper_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."CollectionMember" (
        "id" TEXT NOT NULL,
        "collectionId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "role" "public"."Role" NOT NULL DEFAULT 'RESEARCHER',
        "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "CollectionMember_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."SearchHistory" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "query" TEXT NOT NULL,
        "filters" JSONB,
        "results" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."AISummary" (
        "id" TEXT NOT NULL,
        "paperId" TEXT NOT NULL,
        "model" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "promptHash" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "AISummary_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Plan" (
        "id" TEXT NOT NULL,
        "code" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "priceCents" INTEGER NOT NULL,
        "currency" TEXT NOT NULL,
        "interval" TEXT NOT NULL,
        "stripePriceId" TEXT,
        "features" JSONB,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Subscription" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "workspaceId" TEXT,
        "planId" TEXT NOT NULL,
        "status" "public"."SubscriptionStatus" NOT NULL,
        "provider" "public"."PaymentProvider" NOT NULL,
        "providerCustomerId" TEXT,
        "providerSubscriptionId" TEXT,
        "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
        "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Payment" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "subscriptionId" TEXT,
        "provider" "public"."PaymentProvider" NOT NULL,
        "amountCents" INTEGER NOT NULL,
        "currency" TEXT NOT NULL,
        "transactionId" TEXT NOT NULL,
        "status" "public"."PaymentStatus" NOT NULL,
        "raw" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."WebhookEvent" (
        "id" TEXT NOT NULL,
        "provider" "public"."PaymentProvider" NOT NULL,
        "eventId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "payload" JSONB NOT NULL,
        "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "processedAt" TIMESTAMP(3),
        "status" TEXT NOT NULL,
        "error" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Notification" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "payload" JSONB NOT NULL,
        "readAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."UsageEvent" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "workspaceId" TEXT,
        "kind" TEXT NOT NULL,
        "units" INTEGER NOT NULL DEFAULT 1,
        "paperId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."ActivityLog" (
        "id" TEXT NOT NULL,
        "userId" TEXT,
        "workspaceId" TEXT,
        "entity" TEXT NOT NULL,
        "entityId" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "details" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "public"."VerificationToken" (
        "id" TEXT NOT NULL,
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "isDeleted" BOOLEAN NOT NULL DEFAULT false,
        CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User" ("email");

-- CreateIndex
CREATE INDEX "Workspace_ownerId_idx" ON "public"."Workspace" ("ownerId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "public"."WorkspaceMember" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "public"."WorkspaceMember" ("workspaceId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Paper_doi_key" ON "public"."Paper" ("doi");

-- CreateIndex
CREATE INDEX "Paper_workspaceId_createdAt_idx" ON "public"."Paper" ("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Paper_uploaderId_idx" ON "public"."Paper" ("uploaderId");

-- CreateIndex
CREATE UNIQUE INDEX "PaperFile_paperId_key" ON "public"."PaperFile" ("paperId");

-- CreateIndex
CREATE INDEX "PaperChunk_paperId_idx" ON "public"."PaperChunk" ("paperId");

-- CreateIndex
CREATE UNIQUE INDEX "PaperChunk_paperId_idx_key" ON "public"."PaperChunk" ("paperId", "idx");

-- CreateIndex
CREATE INDEX "Citation_targetPaperId_idx" ON "public"."Citation" ("targetPaperId");

-- CreateIndex
CREATE UNIQUE INDEX "Citation_sourcePaperId_targetPaperId_context_key" ON "public"."Citation" ("sourcePaperId", "targetPaperId", "context");

-- CreateIndex
CREATE INDEX "Annotation_paperId_idx" ON "public"."Annotation" ("paperId");

-- CreateIndex
CREATE INDEX "Annotation_userId_idx" ON "public"."Annotation" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnnotationVersion_annotationId_version_key" ON "public"."AnnotationVersion" ("annotationId", "version");

-- CreateIndex
CREATE INDEX "Collection_workspaceId_idx" ON "public"."Collection" ("workspaceId");

-- CreateIndex
CREATE INDEX "Collection_ownerId_idx" ON "public"."Collection" ("ownerId");

-- CreateIndex
CREATE INDEX "CollectionPaper_paperId_idx" ON "public"."CollectionPaper" ("paperId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionPaper_collectionId_paperId_key" ON "public"."CollectionPaper" ("collectionId", "paperId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionMember_collectionId_userId_key" ON "public"."CollectionMember" ("collectionId", "userId");

-- CreateIndex
CREATE INDEX "SearchHistory_userId_createdAt_idx" ON "public"."SearchHistory" ("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AISummary_paperId_model_promptHash_key" ON "public"."AISummary" ("paperId", "model", "promptHash");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_code_key" ON "public"."Plan" ("code");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "public"."Subscription" ("userId");

-- CreateIndex
CREATE INDEX "Subscription_workspaceId_idx" ON "public"."Subscription" ("workspaceId");

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "public"."Subscription" ("planId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "public"."Payment" ("transactionId");

-- CreateIndex
CREATE INDEX "Payment_userId_createdAt_idx" ON "public"."Payment" ("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_provider_eventId_key" ON "public"."WebhookEvent" ("provider", "eventId");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "public"."Notification" ("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UsageEvent_userId_createdAt_idx" ON "public"."UsageEvent" ("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_workspaceId_createdAt_idx" ON "public"."ActivityLog" ("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account" ("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session" ("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken" ("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken" ("identifier", "token");

-- AddForeignKey
ALTER TABLE "public"."Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Paper" ADD CONSTRAINT "Paper_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Paper" ADD CONSTRAINT "Paper_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaperFile" ADD CONSTRAINT "PaperFile_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaperChunk" ADD CONSTRAINT "PaperChunk_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Citation" ADD CONSTRAINT "Citation_sourcePaperId_fkey" FOREIGN KEY ("sourcePaperId") REFERENCES "public"."Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Citation" ADD CONSTRAINT "Citation_targetPaperId_fkey" FOREIGN KEY ("targetPaperId") REFERENCES "public"."Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Annotation" ADD CONSTRAINT "Annotation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Annotation" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Annotation" ADD CONSTRAINT "Annotation_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Annotation" ADD CONSTRAINT "Annotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnnotationVersion" ADD CONSTRAINT "AnnotationVersion_annotationId_fkey" FOREIGN KEY ("annotationId") REFERENCES "public"."Annotation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnnotationVersion" ADD CONSTRAINT "AnnotationVersion_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collection" ADD CONSTRAINT "Collection_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collection" ADD CONSTRAINT "Collection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionPaper" ADD CONSTRAINT "CollectionPaper_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionPaper" ADD CONSTRAINT "CollectionPaper_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionPaper" ADD CONSTRAINT "CollectionPaper_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionMember" ADD CONSTRAINT "CollectionMember_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollectionMember" ADD CONSTRAINT "CollectionMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AISummary" ADD CONSTRAINT "AISummary_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."Subscription" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageEvent" ADD CONSTRAINT "UsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageEvent" ADD CONSTRAINT "UsageEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsageEvent" ADD CONSTRAINT "UsageEvent_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;