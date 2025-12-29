-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNFOLLOWED', 'NOT_EXISTED', 'APPROVED');

-- CreateTable
CREATE TABLE "Profile" (
    "username" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "status" "Status",

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("username")
);
