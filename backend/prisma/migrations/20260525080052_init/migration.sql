-- CreateTable
CREATE TABLE "UserReadingHistory" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UserReadingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserReadingHistory_user_id_idx" ON "UserReadingHistory"("user_id");

-- CreateIndex
CREATE INDEX "UserReadingHistory_post_id_idx" ON "UserReadingHistory"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserReadingHistory_user_id_post_id_key" ON "UserReadingHistory"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "UserReadingHistory" ADD CONSTRAINT "UserReadingHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReadingHistory" ADD CONSTRAINT "UserReadingHistory_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
