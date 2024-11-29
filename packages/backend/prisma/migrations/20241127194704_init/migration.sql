-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "deployUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
