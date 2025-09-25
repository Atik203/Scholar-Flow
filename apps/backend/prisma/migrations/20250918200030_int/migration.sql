-- CreateEnum
CREATE TYPE "public"."MembershipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "public"."CollectionMember" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "declinedAt" TIMESTAMP(3),
ADD COLUMN     "invitedById" TEXT,
ADD COLUMN     "status" "public"."MembershipStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "public"."CollectionMember" ADD CONSTRAINT "CollectionMember_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
