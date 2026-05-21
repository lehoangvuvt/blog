/*
  Warnings:

  - You are about to drop the column `deleted_comments_count` on the `PostMetricDaily` table. All the data in the column will be lost.
  - You are about to drop the column `unlikes_count` on the `PostMetricDaily` table. All the data in the column will be lost.
  - You are about to drop the column `unreposts_count` on the `PostMetricDaily` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostMetricDaily" DROP COLUMN "deleted_comments_count",
DROP COLUMN "unlikes_count",
DROP COLUMN "unreposts_count";
