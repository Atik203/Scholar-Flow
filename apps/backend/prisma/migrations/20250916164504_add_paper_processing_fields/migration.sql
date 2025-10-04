-- CreateEnum
CREATE TYPE "public"."PaperProcessingStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Paper" ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processingError" TEXT,
ADD COLUMN     "processingStatus" "public"."PaperProcessingStatus" NOT NULL DEFAULT 'UPLOADED';

-- AlterTable
ALTER TABLE "public"."PaperFile" ADD COLUMN     "extractedAt" TIMESTAMP(3),
ADD COLUMN     "originalFilename" TEXT;
