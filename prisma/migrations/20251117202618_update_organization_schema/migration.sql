-- AlterTable
ALTER TABLE "public"."organizations" ADD COLUMN     "coinsSupply" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "maxRedemptions" INTEGER,
ADD COLUMN     "reportSendInterval" INTEGER NOT NULL DEFAULT 4;
