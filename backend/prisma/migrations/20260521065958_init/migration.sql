-- CreateTable
CREATE TABLE "PostStatistics" (
    "id" SERIAL NOT NULL,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "reposts_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "PostStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostMetricDaily" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "unlikes_count" INTEGER NOT NULL DEFAULT 0,
    "reposts_count" INTEGER NOT NULL DEFAULT 0,
    "unreposts_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "deleted_comments_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "PostMetricDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostStatistics_post_id_key" ON "PostStatistics"("post_id");

-- CreateIndex
CREATE INDEX "PostStatistics_post_id_idx" ON "PostStatistics"("post_id");

-- CreateIndex
CREATE INDEX "PostMetricDaily_date_idx" ON "PostMetricDaily"("date");

-- CreateIndex
CREATE INDEX "PostMetricDaily_post_id_date_idx" ON "PostMetricDaily"("post_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PostMetricDaily_post_id_date_key" ON "PostMetricDaily"("post_id", "date");

-- AddForeignKey
ALTER TABLE "PostStatistics" ADD CONSTRAINT "PostStatistics_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMetricDaily" ADD CONSTRAINT "PostMetricDaily_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
