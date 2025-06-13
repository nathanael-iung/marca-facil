/*
  Warnings:

  - Added the required column `razao_social` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "razao_social" TEXT NOT NULL;
