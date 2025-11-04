-- AlterTable
ALTER TABLE "public"."squads" ADD COLUMN     "squadLeaderId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."squads" ADD CONSTRAINT "squads_squadLeaderId_fkey" FOREIGN KEY ("squadLeaderId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
