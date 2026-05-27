-- CreateTable
CREATE TABLE "PostHighlight" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "note" TEXT,
    "rects" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "PostHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostHighlight_user_id_idx" ON "PostHighlight"("user_id");

-- CreateIndex
CREATE INDEX "PostHighlight_post_id_idx" ON "PostHighlight"("post_id");

-- CreateIndex
CREATE INDEX "PostHighlight_user_id_post_id_idx" ON "PostHighlight"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "PostHighlight" ADD CONSTRAINT "PostHighlight_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostHighlight" ADD CONSTRAINT "PostHighlight_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
