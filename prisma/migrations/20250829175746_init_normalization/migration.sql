-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Department_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperatingSystem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `OperatingSystem_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DeviceType_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DeviceStatus_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `departamentoId` INTEGER NULL,
    `ip_equipo` VARCHAR(191) NULL,
    `usuario_login` VARCHAR(191) NULL,
    `password_login` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etiqueta` VARCHAR(191) NOT NULL,
    `nombre_equipo` VARCHAR(191) NULL,
    `descripcion` VARCHAR(191) NULL,
    `usuarioId` INTEGER NULL,
    `tipoId` INTEGER NULL,
    `marca` VARCHAR(191) NULL,
    `modelo` VARCHAR(191) NULL,
    `numero_serie` VARCHAR(191) NOT NULL,
    `estadoId` INTEGER NULL,
    `sistemaOperativoId` INTEGER NULL,
    `licencia_so` VARCHAR(191) NULL,
    `office_version` VARCHAR(191) NULL,
    `office_tipo_licencia` VARCHAR(191) NULL,
    `office_serial` VARCHAR(191) NULL,
    `office_key` VARCHAR(191) NULL,
    `garantia_numero_producto` VARCHAR(191) NULL,
    `garantia_inicio` DATETIME(3) NULL,
    `garantia_fin` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Device_etiqueta_key`(`etiqueta`),
    UNIQUE INDEX `Device_numero_serie_key`(`numero_serie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Maintenance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NULL,
    `fecha_programada` DATETIME(3) NULL,
    `fecha_realizacion` DATETIME(3) NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'pendiente',
    `proveedor` VARCHAR(191) NULL,
    `deviceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Disposal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area` VARCHAR(191) NOT NULL DEFAULT 'SISTEMAS',
    `motivo` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NULL,
    `fecha_baja` DATETIME(3) NULL,
    `deviceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_departamentoId_fkey` FOREIGN KEY (`departamentoId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_tipoId_fkey` FOREIGN KEY (`tipoId`) REFERENCES `DeviceType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `DeviceStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Device` ADD CONSTRAINT `Device_sistemaOperativoId_fkey` FOREIGN KEY (`sistemaOperativoId`) REFERENCES `OperatingSystem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Disposal` ADD CONSTRAINT `Disposal_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
