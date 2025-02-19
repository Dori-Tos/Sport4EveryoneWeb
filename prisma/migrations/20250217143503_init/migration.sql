/*
  Warnings:

  - You are about to drop the `_SportsCenterToSportsField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `Sport` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `SportsCenter` table. All the data in the column will be lost.
  - Added the required column `attendance` to the `SportsCenter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sportsCenterId` to the `SportsField` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_SportsCenterToSportsField_B_index";

-- DropIndex
DROP INDEX "_SportsCenterToSportsField_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_SportsCenterToSportsField";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Sport" ("id", "name") SELECT "id", "name" FROM "Sport";
DROP TABLE "Sport";
ALTER TABLE "new_Sport" RENAME TO "Sport";
CREATE TABLE "new_SportsCenter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "attendance" INTEGER NOT NULL
);
INSERT INTO "new_SportsCenter" ("id", "location", "name") SELECT "id", "location", "name" FROM "SportsCenter";
DROP TABLE "SportsCenter";
ALTER TABLE "new_SportsCenter" RENAME TO "SportsCenter";
CREATE TABLE "new_SportsField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sportsCenterId" INTEGER NOT NULL,
    CONSTRAINT "SportsField_sportsCenterId_fkey" FOREIGN KEY ("sportsCenterId") REFERENCES "SportsCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SportsField" ("id", "name") SELECT "id", "name" FROM "SportsField";
DROP TABLE "SportsField";
ALTER TABLE "new_SportsField" RENAME TO "SportsField";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
