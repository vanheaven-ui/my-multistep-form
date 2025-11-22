/*
  Warnings:

  - Added the required column `url` to the `FileAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileAttachment" ADD COLUMN     "url" TEXT NOT NULL;
