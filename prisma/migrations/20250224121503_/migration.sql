-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SportsField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "sportsCenterId" INTEGER,
    CONSTRAINT "SportsField_sportsCenterId_fkey" FOREIGN KEY ("sportsCenterId") REFERENCES "SportsCenter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SportsField" ("id", "name", "sportsCenterId") SELECT "id", "name", "sportsCenterId" FROM "SportsField";
DROP TABLE "SportsField";
ALTER TABLE "new_SportsField" RENAME TO "SportsField";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
