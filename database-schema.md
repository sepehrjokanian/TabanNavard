# Database Schema — Taban Elevator (Prisma / Postgres via Neon)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProductCategory {
  ELEVATOR
  SPARE_PART
}

enum InquiryStatus {
  NEW
  CONTACTED
  CLOSED
}

enum InquirySource {
  PRODUCT
  CONTACT_FORM
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Product {
  id           String           @id @default(cuid())
  slug         String           @unique
  title        String
  category     ProductCategory
  subtype      String?          // e.g. "آسانسور مسافربری", "آسانسور باری", "موتور", "درب اتوماتیک"
  price        Decimal?         @db.Decimal(12, 2) // null => "تماس بگیرید"
  shortDesc    String
  longDesc     String           @db.Text
  specs        Json             // key-value pairs, e.g. {"ظرفیت": "630 کیلوگرم", "سرعت": "1 متر بر ثانیه"}
  images       ProductImage[]
  isActive     Boolean          @default(true)
  isFeatured   Boolean          @default(false)
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt
  inquiries    Inquiry[]

  @@index([category])
  @@index([isActive])
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String   // placeholder path or Blob URL
  altText   String
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model Inquiry {
  id          String         @id @default(cuid())
  name        String
  phone       String
  email       String?
  message     String         @db.Text
  status      InquiryStatus  @default(NEW)
  source      InquirySource
  productId   String?
  product     Product?       @relation(fields: [productId], references: [id], onDelete: SetNull)
  adminNotes  String?        @db.Text
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([status])
  @@index([createdAt])
}

model CompanyContent {
  id           String   @id @default("singleton") // single-row content table
  historyText  String   @db.Text
  missionText  String?  @db.Text
  foundedYear  Int?
  founderName  String
  founderTitle String
  founderBio   String   @db.Text
  founderPhoto String?  // placeholder or Blob URL
  phone        String
  whatsapp     String?
  email        String
  address      String
  mapEmbedUrl  String?
  updatedAt    DateTime @updatedAt
}

model Certificate {
  id        String   @id @default(cuid())
  title     String
  imageUrl  String   // static placeholder path initially
  issuedBy  String?
  issuedAt  DateTime?
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model CompanyStat {
  id     String @id @default(cuid())
  label  String // e.g. "سال تجربه", "پروژه موفق"
  value  Int
  order  Int    @default(0)
}
```

## Notes
- `Product.specs` uses `Json` for flexibility across elevators vs. parts (different attribute sets) without needing an EAV table — simplest for v1, queryable enough via Prisma/Postgres JSON operators if advanced spec-filtering is needed later.
- `CompanyContent` is a singleton row (id fixed as `"singleton"`) to keep the lightweight CMS simple — no need for a separate content-versioning system in v1.
- `Certificate` table exists even though v1 content is hardcoded/placeholder — makes the admin-upload feature a pure UI addition later with zero schema migration needed.
- Price filtering on the product list uses `price` range queries; null prices excluded/handled separately ("تماس بگیرید" bucket).
- Seed script should create: 1 AdminUser (from env-provided email/password), 1 CompanyContent row, ~6–8 sample Products (mix of elevators/parts) with placeholder images, 3–4 sample Certificates, a few CompanyStat rows.
