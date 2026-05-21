/*
  Warnings:

  - A unique constraint covering the columns `[post_id,ip_address,user_agent,bucket]` on the table `PostViewLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bucket` to the `PostViewLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PostViewLog_ip_address_idx";

-- DropIndex
DROP INDEX "PostViewLog_post_id_idx";

-- DropIndex
DROP INDEX "PostViewLog_viewed_at_idx";

-- AlterTable
ALTER TABLE "PostViewLog" ADD COLUMN     "bucket" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PostViewLog_post_id_ip_address_user_agent_bucket_key" ON "PostViewLog"("post_id", "ip_address", "user_agent", "bucket");
