/*
  Warnings:

  - Changed the type of `refreshTokenExpiresDate` on the `UserToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserToken" DROP COLUMN "refreshTokenExpiresDate",
ADD COLUMN     "refreshTokenExpiresDate" TIMESTAMP(3) NOT NULL;
