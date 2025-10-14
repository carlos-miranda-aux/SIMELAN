/*
  Warnings:

  - You are about to drop the `disposal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `disposal` DROP FOREIGN KEY `Disposal_deviceId_fkey`;

-- AlterTable
ALTER TABLE `device` ADD COLUMN `fecha_baja` DATETIME(3) NULL;

-- DropTable
DROP TABLE `disposal`;
