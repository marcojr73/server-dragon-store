-- AlterTable
ALTER TABLE "public"."organizations" ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#2ec7d6',
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "logo" TEXT NOT NULL DEFAULT 'https://cdn.prod.website-files.com/67ebdcb55fb853aeb815e297/6807d1d69d08fad7a55568c1_Webclip.png';
