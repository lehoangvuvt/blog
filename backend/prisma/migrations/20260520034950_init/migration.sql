-- CreateTable
CREATE TABLE "PostCollections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "thumbnail_image" TEXT,
    "creator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "PostCollections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCollectionItems" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "collection_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostCollectionItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostCollections_slug_key" ON "PostCollections"("slug");

-- CreateIndex
CREATE INDEX "PostCollectionItems_post_id_idx" ON "PostCollectionItems"("post_id");

-- CreateIndex
CREATE INDEX "PostCollectionItems_collection_id_idx" ON "PostCollectionItems"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostCollectionItems_post_id_collection_id_key" ON "PostCollectionItems"("post_id", "collection_id");

-- AddForeignKey
ALTER TABLE "PostCollections" ADD CONSTRAINT "PostCollections_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCollectionItems" ADD CONSTRAINT "PostCollectionItems_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCollectionItems" ADD CONSTRAINT "PostCollectionItems_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "PostCollections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
