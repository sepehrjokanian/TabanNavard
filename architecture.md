# Architecture — Taban Elevator

## Stack
- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS + custom lightweight UI system (`components/ui.tsx`) chosen over shadcn/ui to minimize bundle size, avoid external dependency bloat, and maintain direct control over brand aesthetics
- **Animation:** Framer Motion
- **ORM:** Prisma
- **Database:** Neon (Postgres, serverless)
- **Auth (admin):** Auth.js (NextAuth) — Credentials provider, email+password, bcrypt hashing, JWT/session via cookie
- **Image storage:** Vercel Blob (for future real uploads); placeholders served as static assets/SVGs initially
- **Hosting:** Vercel (both public site and admin live in the same Next.js app, under `/admin` route group, protected by middleware)
- **Forms:** React Hook Form + Zod validation (shared schemas client/server)
- **Email (optional, later):** Resend — notify admin on new inquiry

## High-Level Structure
```
/app
  /(public)
    /page.tsx                → Landing (hero, about, founder, products preview, certs, contact)
    /products/page.tsx       → Product listing + filters
    /products/[slug]/page.tsx→ Product detail + quote CTA
    /contact/page.tsx        → (optional standalone, or anchor on landing)
  /(admin)
    /admin/login/page.tsx
    /admin/dashboard/page.tsx
    /admin/products/page.tsx
    /admin/products/[id]/page.tsx
    /admin/inquiries/page.tsx
    /admin/inquiries/[id]/page.tsx
    /admin/content/page.tsx
  /api
    /inquiries/route.ts       → POST create inquiry
    /admin/products/route.ts  → CRUD (protected)
    /admin/inquiries/route.ts → list/update (protected)
    /auth/[...nextauth]/route.ts
/lib
  /db.ts        → Prisma client singleton
  /auth.ts      → Auth.js config
  /validations/ → Zod schemas (product, inquiry, contact)
/components
  /marketing/   → Hero, About, FounderSection, ProductCard, CertificateGallery, ContactForm, Nav, Footer
  /admin/       → DataTable, ProductForm, InquiryStatusBadge, AdminNav
/prisma
  /schema.prisma
```

## Rendering Strategy
- **Landing & product listing:** Server Components, ISR (revalidate every N minutes) — fast, SEO-friendly, mostly static content pulled from DB at build/revalidate time
- **Product detail:** Server Component with dynamic route, `generateStaticParams` + ISR
- **Admin pages:** fully dynamic/SSR, no caching (`export const dynamic = 'force-dynamic'`), auth-gated
- **Forms (quote/contact):** Client Component islands within server-rendered pages, submit via API route (Server Action alternative also viable — recommend Server Actions for simplicity in Next.js 14+)

## Auth & Protection
- Middleware (`middleware.ts`) checks session on any `/admin/*` route except `/admin/login`
- Passwords hashed with bcrypt, never stored plain
- Admin users seeded manually first via a seed script or one-time setup route (not public signup)

## API Design (if not using Server Actions)
- `POST /api/inquiries` — public, rate-limited, creates inquiry (status=new)
- `GET/POST /api/admin/products` — protected
- `PATCH/DELETE /api/admin/products/:id` — protected
- `GET /api/admin/inquiries` — protected, filter by status
- `PATCH /api/admin/inquiries/:id` — protected, update status/notes

## SEO & Performance
- Farsi metadata (title/description) per page, Open Graph tags with logo
- `next/image` for optimized images (with SVG/placeholder fallback component)
- Sitemap + robots.txt generated via Next.js conventions
- Lighthouse targets: 90+ performance, accessibility, SEO

## Environment Variables
```
DATABASE_URL=            # Neon connection string
NEXTAUTH_SECRET=
NEXTAUTH_URL=
BLOB_READ_WRITE_TOKEN=   # Vercel Blob (future)
RESEND_API_KEY=          # optional, notifications
```

## Deployment
- GitHub repo → Vercel project (auto-deploy on push to main)
- Neon DB provisioned separately, connection string added to Vercel env vars
- `prisma migrate deploy` run as part of build step (or via Vercel's postinstall/build script)
- Preview deployments per PR for safe iteration
