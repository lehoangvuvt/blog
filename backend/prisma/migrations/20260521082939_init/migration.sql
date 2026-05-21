-- CreateTable
CREATE TABLE "PostViewLog" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostViewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostViewLog_post_id_idx" ON "PostViewLog"("post_id");

-- CreateIndex
CREATE INDEX "PostViewLog_ip_address_idx" ON "PostViewLog"("ip_address");

-- CreateIndex
CREATE INDEX "PostViewLog_viewed_at_idx" ON "PostViewLog"("viewed_at");
