/*
  Warnings:

  - You are about to drop the column `contactEmail` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."organizations" DROP COLUMN "contactEmail",
ADD COLUMN     "responsibleEmail" TEXT,
ADD COLUMN     "responsibleName" TEXT,
ADD COLUMN     "responsiblePhone" TEXT;

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "picture" SET DEFAULT 'https://cdn.prod.website-files.com/67ebdcb55fb853aeb815e297/682b3593edb188d6cc83238c_closeup-view-dragon-eyes-with-blue-scales%20zoom.jpg';
