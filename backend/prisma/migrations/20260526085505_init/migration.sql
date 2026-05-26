-- CreateTable
CREATE TABLE "PendingResetPasswordRequest" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "hashed_token" TEXT NOT NULL,
    "used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingResetPasswordRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingResetPasswordRequest_hashed_token_key" ON "PendingResetPasswordRequest"("hashed_token");

-- CreateIndex
CREATE INDEX "PendingResetPasswordRequest_user_id_idx" ON "PendingResetPasswordRequest"("user_id");

-- CreateIndex
CREATE INDEX "PendingResetPasswordRequest_expires_at_idx" ON "PendingResetPasswordRequest"("expires_at");

-- AddForeignKey
ALTER TABLE "PendingResetPasswordRequest" ADD CONSTRAINT "PendingResetPasswordRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
