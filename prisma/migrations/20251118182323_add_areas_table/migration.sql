/*
  Warnings:

  - You are about to drop the column `departamentoId` on the `device` table. All the data in the column will be lost.
  - You are about to drop the column `departamentoId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_departamentoId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_departamentoId_fkey`;

-- DropIndex
DROP INDEX `Device_departamentoId_idx` ON `device`;

-- DropIndex
DROP INDEX `Device_etiqueta_key` ON `device`;

-- DropIndex
DROP INDEX `User_departamentoId_idx` ON `user`;

-- AlterTable
ALTER TABLE `device` DROP COLUMN `departamentoId`,
    ADD COLUMN `areaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `departamentoId`,
    ADD COLUMN `areaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Area` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `departamentoId` INTEGER NOT NULL,

    UNIQUE INDEX `Area_nombre_departamentoId_key`(`nombre`, `departamentoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Device_areaId_idx` ON `Device`(`areaId`);

-- CreateIndex
CREATE INDEX `User_areaId_idx` ON `User`(`areaId`);

-- AddForeignKey
ALTER TABLE `Area` ADD CONSTRAINT `Area_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `Area`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
