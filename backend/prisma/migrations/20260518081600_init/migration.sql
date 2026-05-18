/*
  Warnings:

  - You are about to drop the `UserRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserRegistration";

-- CreateTable
CREATE TABLE "PendingRegistration" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashed_token" TEXT NOT NULL,
    "verified_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "PendingRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_hashed_token_key" ON "PendingRegistration"("hashed_token");

-- CreateIndex
CREATE INDEX "PendingRegistration_email_idx" ON "PendingRegistration"("email");
