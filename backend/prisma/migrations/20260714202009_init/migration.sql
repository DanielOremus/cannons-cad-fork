-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "CharacterFlag" AS ENUM ('MENTAL_HEALTH', 'BOLO', 'WARRANT');

-- CreateEnum
CREATE TYPE "LicenseCategory" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('REGISTERED', 'POLICE', 'DISPATCH', 'EMS', 'CIVILIAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "VehicleFlag" AS ENUM ('Stolen', 'Impounded', 'BOLO');

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" "Gender" NOT NULL,
    "idNumber" CHAR(6) NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "hasGunPermit" BOOLEAN NOT NULL DEFAULT false,
    "flags" "CharacterFlag"[] DEFAULT ARRAY[]::"CharacterFlag"[],
    "userId" UUID NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverLicense" (
    "id" SERIAL NOT NULL,
    "categories" "LicenseCategory"[] DEFAULT ARRAY[]::"LicenseCategory"[],
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "DriverLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailConfirmation" (
    "email" TEXT NOT NULL,
    "code" CHAR(6) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailConfirmation_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT,
    "licensePlate" TEXT NOT NULL,
    "flags" "VehicleFlag"[] DEFAULT ARRAY[]::"VehicleFlag"[],
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_idNumber_key" ON "Character"("idNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DriverLicense_characterId_key" ON "DriverLicense"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicense" ADD CONSTRAINT "DriverLicense_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailConfirmation" ADD CONSTRAINT "EmailConfirmation_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
