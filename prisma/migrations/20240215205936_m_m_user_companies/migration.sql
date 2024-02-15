/*
  Warnings:

  - You are about to drop the `_companiesTousers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_companiesTousers` DROP FOREIGN KEY `_companiesTousers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_companiesTousers` DROP FOREIGN KEY `_companiesTousers_B_fkey`;

-- DropTable
DROP TABLE `_companiesTousers`;
