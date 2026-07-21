# آسانسور تابان نورد

وب‌سایت بازاریابی لوکس و پنل مدیریت فارسی و RTL برای آسانسور تابان نورد، ساخته‌شده با Next.js 14 App Router، TypeScript، Tailwind CSS، Framer Motion، Prisma، Neon Postgres و Auth.js.

## امکانات

### سایت عمومی
- صفحه فرود کامل با Hero، تاریخچه و تایم‌لاین، بنیان‌گذار، محصولات منتخب، گواهینامه‌ها و تماس
- فهرست محصولات با جستجو، دسته‌بندی، بازه قیمت و فیلتر مشخصات فنی
- صفحه جزئیات با گالری، جدول مشخصات و درخواست پیش‌فاکتور
- فرم تماس و استعلام متصل به Server Action با Zod و honeypot
- رابط کاملاً فارسی و RTL، واکنش‌گرا و سازگار با `prefers-reduced-motion`
- متادیتای فارسی، Open Graph، sitemap و robots

### پنل مدیریت
- ورود امن با Auth.js Credentials و رمز هش‌شده
- داشبورد آمار محصولات و درخواست‌های جدید
- مدیریت کامل محصولات: جستجو/فیلتر، ایجاد، ویرایش، مشخصات کلید-مقدار پویا و فعال/غیرفعال‌سازی
- مدیریت درخواست‌ها، وضعیت و یادداشت داخلی
- ویرایش محتوای شرکت

## پیش‌نیازها
- Node.js 20+
- npm 10+
- دیتابیس PostgreSQL در Neon

## راه‌اندازی محلی

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

متغیرهای ضروری:

```env
DATABASE_URL="postgresql://...?...sslmode=require"
AUTH_SECRET="یک مقدار تصادفی امن"
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="یک رمز قوی"
```

برای تولید `AUTH_SECRET` می‌توانید اجرا کنید:

```bash
openssl rand -base64 32
```

اطلاعات مدیر تنها هنگام seed از متغیرهای محیطی خوانده می‌شود و هیچ رمز عبوری در مخزن ذخیره نشده است.

## دستورات

```bash
npm run dev          # محیط توسعه
npm run typecheck    # بررسی TypeScript
npm run lint         # ESLint
npm run check        # TypeScript + ESLint + Prisma validate
npm run build        # generate + migrate deploy + Next.js production build
npm run start        # اجرای build تولید
npm run db:seed      # داده‌های اولیه فارسی
npm run lighthouse   # Lighthouse CI با آستانه‌های 90+
```

## استقرار Vercel + Neon

1. در Neon یک پروژه و دیتابیس بسازید و connection string دارای SSL را کپی کنید.
2. مخزن GitHub را به Vercel متصل کنید.
3. متغیرهای `DATABASE_URL`، `AUTH_SECRET`، `AUTH_URL`، `NEXT_PUBLIC_SITE_URL`، `SEED_ADMIN_EMAIL` و `SEED_ADMIN_PASSWORD` را برای Production تنظیم کنید.
4. Build Command همان `npm run build` است. این دستور به‌ترتیب موارد زیر را اجرا می‌کند:
   - `prisma generate`
   - `prisma migrate deploy`
   - `next build`
5. migration اولیه در `prisma/migrations/20260721160000_init` قرار دارد؛ بنابراین یک دیتابیس خالی Neon در اولین deploy ساخته می‌شود.
6. پس از اولین استقرار، seed را یک بار از محیط امن و با متغیرهای Production اجرا کنید.
7. `AUTH_URL` و `NEXT_PUBLIC_SITE_URL` را روی دامنه نهایی HTTPS تنظیم و redeploy کنید.

فایل `vercel.json` فریم‌ورک، build command و region را مشخص می‌کند. migrationها باید همیشه در مخزن commit شوند؛ در Production از `migrate dev` استفاده نکنید.

## کنترل کیفیت و Lighthouse

قبل از push:

```bash
npm run check
```

پس از تنظیم دیتابیس و ساخت production build:

```bash
npm run build
npm run lighthouse
```

`lighthouserc.json` صفحات `/` و `/products` را بررسی می‌کند و حداقل امتیاز ۹۰ را برای Accessibility و SEO اجباری می‌داند؛ Performance و Best Practices نیز با آستانه ۹۰ گزارش می‌شوند. اجرای Lighthouse به build فعال و دیتابیس قابل‌دسترسی نیاز دارد.

## دسترس‌پذیری
- لینک پرش به محتوای اصلی
- ناوبری موبایل و desktop با برچسب‌های معنایی
- focus ring قابل‌مشاهده و کنترل‌های دارای label
- کنتراست مبتنی بر رنگ‌های مصوب برند
- کاهش یا حذف motion بر اساس تنظیمات سیستم کاربر
- پنل مدیریت با `noindex`

## ساختار اصلی

```text
app/                    # مسیرهای عمومی، مدیریت، actions و metadata
components/marketing/   # قابل توسعه برای بخش‌های بازاریابی
components/admin/       # فرم‌ها و اجزای مدیریت
lib/                    # Prisma، اعتبارسنجی و utilityها
prisma/                 # schema، migration و seed
middleware.ts           # حفاظت مسیرهای /admin/*
```

## امنیت
- تمام مسیرهای `/admin/*` به‌جز `/admin/login` توسط middleware محافظت می‌شوند.
- رمزها با bcrypt هش می‌شوند.
- فرم‌های عمومی اعتبارسنجی سمت سرور و honeypot دارند.
- مسیرهای admin و API از robots حذف شده‌اند.
