-- AlterTable
ALTER TABLE `area` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `department` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `device` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `devicestatus` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `devicetype` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `maintenance` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `operatingsystem` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `usersistema` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- RenameIndex
ALTER TABLE `usersistema` RENAME INDEX `userSistema_email_key` TO `UserSistema_email_key`;

-- RenameIndex
ALTER TABLE `usersistema` RENAME INDEX `userSistema_username_key` TO `UserSistema_username_key`;
