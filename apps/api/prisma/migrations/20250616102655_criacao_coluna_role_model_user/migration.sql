-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CLIENT', 'COMPANY', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
