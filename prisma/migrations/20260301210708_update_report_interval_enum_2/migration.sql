/*
  Warnings:

  - The `reportSendInterval` column on the `organizations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."organizations" DROP COLUMN "reportSendInterval",
ADD COLUMN     "reportSendInterval" INTEGER NOT NULL DEFAULT 4;

-- DropEnum
DROP TYPE "public"."ReportInterval";
