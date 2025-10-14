/*
  Warnings:

  - You are about to drop the column `ip_equipo` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `device` ADD COLUMN `departamentoId` INTEGER NULL,
    ADD COLUMN `ip_equipo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `ip_equipo`;

-- CreateIndex
CREATE INDEX `Device_departamentoId_idx` ON `Device`(`departamentoId`);

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `device` RENAME INDEX `Device_estadoId_fkey` TO `Device_estadoId_idx`;

-- RenameIndex
ALTER TABLE `device` RENAME INDEX `Device_sistemaOperativoId_fkey` TO `Device_sistemaOperativoId_idx`;

-- RenameIndex
ALTER TABLE `device` RENAME INDEX `Device_tipoId_fkey` TO `Device_tipoId_idx`;

-- RenameIndex
ALTER TABLE `device` RENAME INDEX `Device_usuarioId_fkey` TO `Device_usuarioId_idx`;

-- RenameIndex
ALTER TABLE `disposal` RENAME INDEX `Disposal_deviceId_fkey` TO `Disposal_deviceId_idx`;

-- RenameIndex
ALTER TABLE `maintenance` RENAME INDEX `Maintenance_deviceId_fkey` TO `Maintenance_deviceId_idx`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_departamentoId_fkey` TO `User_departamentoId_idx`;
