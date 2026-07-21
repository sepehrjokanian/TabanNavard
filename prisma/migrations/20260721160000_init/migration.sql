-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ELEVATOR', 'SPARE_PART');
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');
CREATE TYPE "InquirySource" AS ENUM ('PRODUCT', 'CONTACT_FORM');

CREATE TABLE "AdminUser" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "name" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Product" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "category" "ProductCategory" NOT NULL, "subtype" TEXT, "price" DECIMAL(12,2), "shortDesc" TEXT NOT NULL, "longDesc" TEXT NOT NULL, "specs" JSONB NOT NULL, "isActive" BOOLEAN NOT NULL DEFAULT true, "isFeatured" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Product_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ProductImage" ("id" TEXT NOT NULL, "productId" TEXT NOT NULL, "url" TEXT NOT NULL, "altText" TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Inquiry" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "phone" TEXT NOT NULL, "email" TEXT, "message" TEXT NOT NULL, "status" "InquiryStatus" NOT NULL DEFAULT 'NEW', "source" "InquirySource" NOT NULL, "productId" TEXT, "adminNotes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id"));
CREATE TABLE "CompanyContent" ("id" TEXT NOT NULL DEFAULT 'singleton', "historyText" TEXT NOT NULL, "missionText" TEXT, "foundedYear" INTEGER, "founderName" TEXT NOT NULL, "founderTitle" TEXT NOT NULL, "founderBio" TEXT NOT NULL, "founderPhoto" TEXT, "phone" TEXT NOT NULL, "whatsapp" TEXT, "email" TEXT NOT NULL, "address" TEXT NOT NULL, "mapEmbedUrl" TEXT, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "CompanyContent_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Certificate" ("id" TEXT NOT NULL, "title" TEXT NOT NULL, "imageUrl" TEXT NOT NULL, "issuedBy" TEXT, "issuedAt" TIMESTAMP(3), "order" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id"));
CREATE TABLE "CompanyStat" ("id" TEXT NOT NULL, "label" TEXT NOT NULL, "value" INTEGER NOT NULL, "order" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "CompanyStat_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
