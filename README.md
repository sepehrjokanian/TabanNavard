# Taban Nourd Elevator

A premium marketing website with a Persian (RTL) admin dashboard for Taban Nourd Elevator, built with Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Prisma, Neon PostgreSQL, and Auth.js.

## Features

### Public Website

- Complete landing page with:
  - Hero section
  - Company history and timeline
  - Founder section
  - Featured products
  - Certifications
  - Contact section
- Product catalog with:
  - Search
  - Category filtering
  - Price range filtering
  - Technical specification filters
- Product details page with:
  - Image gallery
  - Technical specifications table
  - Quote request form
- Contact and inquiry forms powered by Server Actions, Zod validation, and honeypot spam protection
- Fully responsive Persian RTL interface
- Supports `prefers-reduced-motion` for accessibility
- Persian metadata, Open Graph tags, sitemap, and robots.txt

### Admin Dashboard

- Secure authentication using Auth.js Credentials with hashed passwords
- Dashboard with product and inquiry statistics
- Complete product management:
  - Search and filtering
  - Create and edit products
  - Dynamic key-value technical specifications
  - Enable/disable products
- Inquiry management with status tracking and internal notes
- Company content management

---

## Requirements

- Node.js 20+
- npm 10+
- PostgreSQL database (Neon)

---

## Local Setup

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Required environment variables:

```env
DATABASE_URL="postgresql://...?...sslmode=require"
AUTH_SECRET="your-secure-random-secret"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="your-strong-password"
```

Generate an `AUTH_SECRET` using:

```bash
openssl rand -base64 32
```

The administrator credentials are only read during the database seed process from environment variables. No passwords are stored in the repository.

---

## Available Scripts

```bash
npm run dev          # Development server
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run check        # TypeScript + ESLint + Prisma validation
npm run build        # Prisma generate + migrate deploy + production build
npm run start        # Start production server
npm run db:seed      # Seed Persian sample data
npm run lighthouse   # Run Lighthouse CI (90+ thresholds)
```

---

## Deployment (Vercel + Neon)

1. Create a new project and PostgreSQL database in Neon.
2. Copy the SSL-enabled connection string.
3. Connect your GitHub repository to Vercel.
4. Configure the following Production environment variables:

   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL`
   - `NEXT_PUBLIC_SITE_URL`
   - `SEED_ADMIN_EMAIL`
   - `SEED_ADMIN_PASSWORD`

5. Use the following build command:

```bash
npm run build
```

This command automatically runs:

```bash
prisma generate
prisma migrate deploy
next build
```

The initial migration is located at:

```
prisma/migrations/20260721160000_init
```

A fresh Neon database will be fully initialized during the first deployment.

After the initial deployment:

- Run the seed command once in a secure production environment.
- Update `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your final HTTPS domain.
- Redeploy the application.

The `vercel.json` file defines the framework, build command, and deployment region.

Always commit Prisma migrations to the repository. Never use `prisma migrate dev` in production.

---

## Quality Assurance

Before pushing changes:

```bash
npm run check
```

After configuring the database and creating a production build:

```bash
npm run build
npm run lighthouse
```

The `lighthouserc.json` configuration audits the following pages:

- `/`
- `/products`

Minimum Lighthouse score requirements:

- Accessibility: 90+
- SEO: 90+

Performance and Best Practices are also reported with a target score of 90 or higher.

Running Lighthouse requires a working production build and an accessible database.

---

## Accessibility

- Skip-to-content link
- Semantic navigation for desktop and mobile
- Visible focus indicators
- Properly labeled form controls
- Brand-compliant color contrast
- Motion reduced or disabled based on user system preferences
- Admin dashboard excluded from search indexing

---

## Project Structure

```text
app/                    # Public routes, admin routes, server actions, metadata
components/marketing/   # Marketing UI components
components/admin/       # Admin forms and UI components
lib/                    # Prisma, validation, utilities
prisma/                 # Schema, migrations, and seed
middleware.ts           # Route protection for /admin/*
```

---

## Security

- All `/admin/*` routes, except `/admin/login`, are protected by middleware.
- Passwords are securely hashed using bcrypt.
- Public forms use server-side validation and honeypot spam protection.
- Admin routes and API endpoints are excluded from search engine indexing via `robots.txt`.