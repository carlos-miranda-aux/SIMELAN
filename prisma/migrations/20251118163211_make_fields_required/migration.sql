/*
  Warnings:

  - Made the column `nombre_equipo` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tipoId` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `marca` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modelo` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estadoId` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sistemaOperativoId` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departamentoId` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ip_equipo` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `motivo_baja` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `observaciones_baja` on table `device` required. This step will fail if there are existing NULL values in that column.
  - Made the column `descripcion` on table `maintenance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_programada` on table `maintenance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `acciones_realizadas` on table `maintenance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `diagnostico` on table `maintenance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_departamentoId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_estadoId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_sistemaOperativoId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_tipoId_fkey`;

-- AlterTable
ALTER TABLE `device` MODIFY `etiqueta` VARCHAR(191) NULL,
    MODIFY `nombre_equipo` VARCHAR(191) NOT NULL,
    MODIFY `tipoId` INTEGER NOT NULL,
    MODIFY `marca` VARCHAR(191) NOT NULL,
    MODIFY `modelo` VARCHAR(191) NOT NULL,
    MODIFY `estadoId` INTEGER NOT NULL,
    MODIFY `sistemaOperativoId` INTEGER NOT NULL,
    MODIFY `departamentoId` INTEGER NOT NULL,
    MODIFY `ip_equipo` VARCHAR(191) NOT NULL,
    MODIFY `motivo_baja` VARCHAR(191) NOT NULL,
    MODIFY `observaciones_baja` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `maintenance` MODIFY `descripcion` VARCHAR(191) NOT NULL,
    MODIFY `fecha_programada` DATETIME(3) NOT NULL,
    MODIFY `acciones_realizadas` TEXT NOT NULL,
    MODIFY `diagnostico` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_tipoId_fkey` FOREIGN KEY (`tipoId`) REFERENCES `DeviceType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `DeviceStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_sistemaOperativoId_fkey` FOREIGN KEY (`sistemaOperativoId`) REFERENCES `OperatingSystem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
