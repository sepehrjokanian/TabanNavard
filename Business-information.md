# Business Information — Taban Elevator (آسانسور تابان نورد / آسان طوس)

## Company
- **Name (brand):** آسانسور تابان نورد — آسان طوس (Taban Elevator)
- **Industry:** Elevators, lifts, escalators, and spare parts/components manufacturing & sales
- **Language:** Farsi (Persian), RTL layout throughout (site + admin)
- **Positioning:** Premium, professional, modern, trustworthy industrial/engineering brand

## Brand Assets
- Logo provided (attached image): white circle background, dark navy Farsi calligraphy headline, secondary blue "آسان طوس" script, geometric roof/house mark in two blues, "TABAN ELEVATOR" wordmark in black.
- **Color palette (derived from logo):**
  - Deep Navy: `#0B2A4A` / `#0E3A63` (primary dark)
  - Sky/Cyan Blue: `#29ABE2` / `#3FB6EC` (accent, light blue block from mark)
  - Mid Blue: `#1565A8` (secondary accent, roof shape gradient)
  - Off-white / Paper: `#F7F9FB` (backgrounds)
  - Near-black: `#111417` (text, wordmark)
  - Optional gold/metallic accent for "premium" feel: `#C9A24B` (used sparingly — CTAs, dividers, premium badges)

## Content Sections Required
1. **Hero / Landing** — full-bleed hero, company tagline, short intro, CTA buttons (see products / request quote)
2. **About / Company History** — story, mission, years of experience, milestones/timeline
3. **Products (Objects for sale)** — Elevators + spare parts/components, each with:
   - Title, category, price (or "price on request"), short + long description, spec sheet, placeholder image(s)
4. **Founder Section** — single founder profile: photo, name, title, bio/quote
5. **Certificates / Awards** — gallery of certification images (static placeholders for now; admin-manageable structure built in, but content hardcoded initially per decision)
6. **Contact Section** — address, phone, WhatsApp, email, map embed, contact form
7. **Quote/Inquiry System** — customers submit request-a-quote forms; tracked in admin with status: `new → contacted → closed`

## Admin Panel Requirements
- **Auth:** Email + password login (multiple admin users allowed, single role level — no need for granular RBAC at this stage, but schema should allow adding roles later)
- **Manage:** Products (CRUD, categories, pricing, specs, placeholder/real images), Inquiries (view, update status, notes), Company content (history text, founder bio — optional CMS-lite), Certificates (structure ready, manual for now)
- **Not required initially:** payment processing, multi-role permissions, public user accounts

## Products Detail
- **Types:** Elevators (passenger/freight — subtype attribute) + Spare parts/components
- **Filtering:** Advanced — by category, price range, and specs (e.g. capacity, speed, type)
- **Pricing:** Numeric price field, nullable (falls back to "تماس بگیرید" / "Contact for price")
- **Images:** Use placeholder images (e.g. generic elevator/parts stock placeholders) — swappable later via admin upload

## Deployment & Infra (decided)
- **Hosting:** Vercel
- **Database:** Neon (Postgres, serverless, easy free-tier setup, works great with Vercel) — chosen over Vercel Postgres for portability and generous free tier
- **ORM:** Prisma (pairs well with Neon + Next.js)
- **Image storage:** Vercel Blob (simple, native to Vercel) for future real product/certificate images; placeholders initially can be static files or a placeholder service

## Open items to revisit later (not blocking build)
- Real product photography
- Real certificate scans
- Final copy for company history (can start with placeholder Farsi text, client fills in later)
- Multi-language (English) version — out of scope for v1
