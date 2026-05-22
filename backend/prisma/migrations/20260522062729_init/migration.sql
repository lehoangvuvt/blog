/*
  Warnings:

  - You are about to drop the `PostBookmarks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostBookmarks" DROP CONSTRAINT "PostBookmarks_post_id_fkey";

-- DropForeignKey
ALTER TABLE "PostBookmarks" DROP CONSTRAINT "PostBookmarks_user_id_fkey";

-- DropTable
DROP TABLE "PostBookmarks";

-- CreateTable
CREATE TABLE "UserSavedPosts" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSavedPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSavedPosts_user_id_idx" ON "UserSavedPosts"("user_id");

-- CreateIndex
CREATE INDEX "UserSavedPosts_post_id_idx" ON "UserSavedPosts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedPosts_user_id_post_id_key" ON "UserSavedPosts"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "UserSavedPosts" ADD CONSTRAINT "UserSavedPosts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedPosts" ADD CONSTRAINT "UserSavedPosts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
