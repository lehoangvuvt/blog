/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Added the required column `html_content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `json_content` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ADD COLUMN     "html_content" TEXT NOT NULL,
ADD COLUMN     "json_content" JSONB NOT NULL;
