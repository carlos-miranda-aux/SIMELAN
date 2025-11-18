-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_departamentoId_fkey`;

-- DropForeignKey
ALTER TABLE `device` DROP FOREIGN KEY `Device_sistemaOperativoId_fkey`;

-- AlterTable
ALTER TABLE `device` MODIFY `sistemaOperativoId` INTEGER NULL,
    MODIFY `departamentoId` INTEGER NULL,
    MODIFY `ip_equipo` VARCHAR(191) NULL,
    MODIFY `motivo_baja` VARCHAR(191) NULL,
    MODIFY `observaciones_baja` TEXT NULL;

-- AlterTable
ALTER TABLE `maintenance` MODIFY `fecha_programada` DATETIME(3) NULL,
    MODIFY `acciones_realizadas` TEXT NULL,
    MODIFY `diagnostico` TEXT NULL;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_sistemaOperativoId_fkey` FOREIGN KEY (`sistemaOperativoId`) REFERENCES `OperatingSystem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
