/*
  Warnings:

  - You are about to drop the column `companies_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_companies_id_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `companies_id`;

-- CreateTable
CREATE TABLE `_companiesTousers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_companiesTousers_AB_unique`(`A`, `B`),
    INDEX `_companiesTousers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_companiesTousers` ADD CONSTRAINT `_companiesTousers_A_fkey` FOREIGN KEY (`A`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_companiesTousers` ADD CONSTRAINT `_companiesTousers_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
