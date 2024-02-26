-- CreateTable
CREATE TABLE `currencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `course` DOUBLE NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offer_number` VARCHAR(191) NOT NULL DEFAULT '0000',
    `offer_total` DOUBLE NOT NULL DEFAULT 0,
    `vat` DOUBLE NOT NULL DEFAULT 0,
    `vat_value` DOUBLE NOT NULL DEFAULT 0,
    `total_discount` DOUBLE NOT NULL DEFAULT 0,
    `date_of_order` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `delivery_due_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `payment_due_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `companies_id` INTEGER NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `currencies_id` INTEGER NOT NULL,
    `worker_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_articles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `base_price` DOUBLE NOT NULL DEFAULT 0,
    `base_price_with_vat` DOUBLE NOT NULL DEFAULT 0,
    `selling_price` DOUBLE NOT NULL DEFAULT 0,
    `selling_price_with_vat` DOUBLE NOT NULL DEFAULT 0,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `total` DOUBLE NOT NULL DEFAULT 0,
    `vat` DOUBLE NOT NULL DEFAULT 0,
    `vat_value` DOUBLE NOT NULL DEFAULT 0,
    `discount` DOUBLE NOT NULL DEFAULT 0,
    `discount_value` DOUBLE NOT NULL DEFAULT 0,
    `articles_id` INTEGER NOT NULL,
    `offers_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_worker_id_fkey` FOREIGN KEY (`worker_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_companies_id_fkey` FOREIGN KEY (`companies_id`) REFERENCES `companies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_currencies_id_fkey` FOREIGN KEY (`currencies_id`) REFERENCES `currencies`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_articles` ADD CONSTRAINT `offer_articles_articles_id_fkey` FOREIGN KEY (`articles_id`) REFERENCES `articles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offer_articles` ADD CONSTRAINT `offer_articles_offers_id_fkey` FOREIGN KEY (`offers_id`) REFERENCES `offers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
