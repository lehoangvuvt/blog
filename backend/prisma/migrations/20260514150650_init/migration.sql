/*
  Warnings:

  - Added the required column `sub_title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "sub_title" TEXT NOT NULL;
