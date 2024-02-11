/*
  Warnings:

  - Added the required column `companies_id` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `articles` ADD COLUMN `companies_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_companies_id_fkey` FOREIGN KEY (`companies_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
