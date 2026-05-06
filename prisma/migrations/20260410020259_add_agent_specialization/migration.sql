-- CreateEnum
CREATE TYPE "SupervisorType" AS ENUM ('general', 'specialized');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "supervisorType" "SupervisorType";

-- CreateTable
CREATE TABLE "agent_specializations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_specializations_userId_idx" ON "agent_specializations"("userId");

-- CreateIndex
CREATE INDEX "agent_specializations_categoryId_idx" ON "agent_specializations"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "agent_specializations_userId_categoryId_key" ON "agent_specializations"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "agent_specializations" ADD CONSTRAINT "agent_specializations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_specializations" ADD CONSTRAINT "agent_specializations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
