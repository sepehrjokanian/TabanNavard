# آسانسور تابان نورد

وب‌سایت بازاریابی و پنل مدیریت فارسی و RTL با Next.js 14، Prisma، Neon و Auth.js.

## راه‌اندازی محلی
1. `cp .env.example .env` و مقادیر را تکمیل کنید.
2. `npm install`
3. `npx prisma migrate dev --name init`
4. `npm run db:seed`
5. `npm run dev`

## استقرار Vercel + Neon
- یک دیتابیس Neon بسازید و `DATABASE_URL` را در Environment Variables پروژه Vercel ثبت کنید.
- `AUTH_SECRET` و `AUTH_URL` و متغیرهای seed را نیز ثبت کنید.
- Build Command را `npm run build` قرار دهید؛ این دستور ابتدا `prisma generate` و `prisma migrate deploy` را اجرا می‌کند.
- برای داده‌های اولیه، seed را یک‌بار از محیط امن اجرا کنید. رمز مدیر هرگز در مخزن نگهداری نمی‌شود.

## کنترل کیفیت
`npm run typecheck && npm run lint && npm run build`

تمام رابط‌ها فارسی، RTL و دارای حالت کاهش حرکت هستند. مسیرهای `/admin/*` به‌جز ورود توسط middleware محافظت می‌شوند.