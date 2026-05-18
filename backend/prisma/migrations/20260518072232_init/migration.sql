-- CreateTable
CREATE TABLE "UserRegistration" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashed_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "hashed_session_token" TEXT,
    "session_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UserRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRegistration_email_key" ON "UserRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRegistration_hashed_token_key" ON "UserRegistration"("hashed_token");

-- CreateIndex
CREATE UNIQUE INDEX "UserRegistration_hashed_session_token_key" ON "UserRegistration"("hashed_session_token");
