-- CreateTable
CREATE TABLE "PostLikes" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReposts" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostReposts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostLikes_post_id_idx" ON "PostLikes"("post_id");

-- CreateIndex
CREATE INDEX "PostLikes_user_id_idx" ON "PostLikes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostLikes_user_id_post_id_key" ON "PostLikes"("user_id", "post_id");

-- CreateIndex
CREATE INDEX "PostReposts_post_id_idx" ON "PostReposts"("post_id");

-- CreateIndex
CREATE INDEX "PostReposts_user_id_idx" ON "PostReposts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostReposts_user_id_post_id_key" ON "PostReposts"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReposts" ADD CONSTRAINT "PostReposts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReposts" ADD CONSTRAINT "PostReposts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
