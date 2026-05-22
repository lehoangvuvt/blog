-- CreateTable
CREATE TABLE "TagFollow" (
    "id" SERIAL NOT NULL,
    "tag_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagFollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TagFollow_user_id_idx" ON "TagFollow"("user_id");

-- CreateIndex
CREATE INDEX "TagFollow_tag_id_idx" ON "TagFollow"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "TagFollow_tag_id_user_id_key" ON "TagFollow"("tag_id", "user_id");

-- AddForeignKey
ALTER TABLE "TagFollow" ADD CONSTRAINT "TagFollow_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagFollow" ADD CONSTRAINT "TagFollow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
