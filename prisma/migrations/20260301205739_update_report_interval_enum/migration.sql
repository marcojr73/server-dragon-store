/*
  Warnings:

  - The `reportSendInterval` column on the `organizations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."ReportInterval" AS ENUM ('ON_EACH_CLAIM', 'DAILY', 'WEEKLY', 'MONTHLY', 'NEVER');

-- AlterTable
ALTER TABLE "public"."organizations" DROP COLUMN "reportSendInterval",
ADD COLUMN     "reportSendInterval" "public"."ReportInterval" NOT NULL DEFAULT 'MONTHLY';
