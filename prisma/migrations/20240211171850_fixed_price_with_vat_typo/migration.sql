/*
  Warnings:

  - You are about to drop the column `price_wtih_vat` on the `articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `articles` DROP COLUMN `price_wtih_vat`,
    ADD COLUMN `price_with_vat` DOUBLE NOT NULL DEFAULT 0;
