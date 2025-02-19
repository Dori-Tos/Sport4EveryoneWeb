-- CreateTable
CREATE TABLE "Sport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "SportsField" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SportsCenter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "sportsCenterId" INTEGER NOT NULL,
    "sportsFieldId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_sportsCenterId_fkey" FOREIGN KEY ("sportsCenterId") REFERENCES "SportsCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_sportsFieldId_fkey" FOREIGN KEY ("sportsFieldId") REFERENCES "SportsField" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "userId" INTEGER NOT NULL,
    "contactId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "contactId"),
    CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SportToSportsField" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SportToSportsField_A_fkey" FOREIGN KEY ("A") REFERENCES "Sport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SportToSportsField_B_fkey" FOREIGN KEY ("B") REFERENCES "SportsField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SportsCenterToSportsField" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_SportsCenterToSportsField_A_fkey" FOREIGN KEY ("A") REFERENCES "SportsCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SportsCenterToSportsField_B_fkey" FOREIGN KEY ("B") REFERENCES "SportsField" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_SportToSportsField_AB_unique" ON "_SportToSportsField"("A", "B");

-- CreateIndex
CREATE INDEX "_SportToSportsField_B_index" ON "_SportToSportsField"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SportsCenterToSportsField_AB_unique" ON "_SportsCenterToSportsField"("A", "B");

-- CreateIndex
CREATE INDEX "_SportsCenterToSportsField_B_index" ON "_SportsCenterToSportsField"("B");
