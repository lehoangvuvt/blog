-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facebook_link" TEXT,
ADD COLUMN     "linkedin_link" TEXT,
ADD COLUMN     "website_link" TEXT,
ADD COLUMN     "x_link" TEXT,
ADD COLUMN     "youtube_link" TEXT;

-- CreateTable
CREATE TABLE "PostBookmarks" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostBookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostBookmarks_post_id_idx" ON "PostBookmarks"("post_id");

-- CreateIndex
CREATE INDEX "PostBookmarks_user_id_idx" ON "PostBookmarks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostBookmarks_user_id_post_id_key" ON "PostBookmarks"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "PostBookmarks" ADD CONSTRAINT "PostBookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostBookmarks" ADD CONSTRAINT "PostBookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
