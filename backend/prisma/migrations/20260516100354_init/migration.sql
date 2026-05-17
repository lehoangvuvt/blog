-- AlterTable
ALTER TABLE "PostComments" ADD COLUMN     "reply_to_comment_id" TEXT;

-- CreateIndex
CREATE INDEX "PostComments_post_id_idx" ON "PostComments"("post_id");

-- CreateIndex
CREATE INDEX "PostComments_reply_to_comment_id_idx" ON "PostComments"("reply_to_comment_id");

-- AddForeignKey
ALTER TABLE "PostComments" ADD CONSTRAINT "PostComments_reply_to_comment_id_fkey" FOREIGN KEY ("reply_to_comment_id") REFERENCES "PostComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
