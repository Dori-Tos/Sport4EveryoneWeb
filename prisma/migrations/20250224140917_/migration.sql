/*
  Warnings:

  - Added the required column `openingTime` to the `SportsCenter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `SportsField` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SportsCenter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "attendance" INTEGER NOT NULL,
    "openingTime" TEXT NOT NULL
);
INSERT INTO "new_SportsCenter" ("attendance", "id", "location", "name") SELECT "attendance", "id", "location", "name" FROM "SportsCenter";
DROP TABLE "SportsCenter";
ALTER TABLE "new_SportsCenter" RENAME TO "SportsCenter";
CREATE TABLE "new_SportsField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "sportsCenterId" INTEGER,
    CONSTRAINT "SportsField_sportsCenterId_fkey" FOREIGN KEY ("sportsCenterId") REFERENCES "SportsCenter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SportsField" ("id", "name", "sportsCenterId") SELECT "id", "name", "sportsCenterId" FROM "SportsField";
DROP TABLE "SportsField";
ALTER TABLE "new_SportsField" RENAME TO "SportsField";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
