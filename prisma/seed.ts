import { PrismaClient, ProductCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const samples = [
  ["panorama", "آسانسور لوکس پانوراما", ProductCategory.ELEVATOR, null],
  ["residential", "آسانسور مسکونی سری آرام", ProductCategory.ELEVATOR, 1850000000],
  ["freight", "آسانسور باری صنعتی", ProductCategory.ELEVATOR, null],
  ["gearless", "آسانسور گیرلس کم‌مصرف", ProductCategory.ELEVATOR, 2250000000],
  ["motor", "موتور گیرلس پرتوان", ProductCategory.SPARE_PART, 680000000],
  ["door", "درب اتوماتیک تلسکوپی", ProductCategory.SPARE_PART, 240000000],
  ["controller", "تابلو فرمان هوشمند", ProductCategory.SPARE_PART, 190000000],
  ["rail", "ریل راهنمای استاندارد", ProductCategory.SPARE_PART, null],
] as const;

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@tabanelevator.ir";
  const password = process.env.SEED_ADMIN_PASSWORD || "adminpassword123";

  await db.adminUser.upsert({
    where: { email },
    update: { role: "SUPER_ADMIN", isActive: true },
    create: {
      email,
      name: "مدیر تابان",
      passwordHash: await bcrypt.hash(password, 12),
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  await db.companyContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      historyText: "تابان نورد با تکیه بر تجربه، دانش فنی و تعهد به ایمنی، راهکارهای جامع آسانسور را ارائه می‌کند.",
      missionText: "حرکت ایمن با کیفیت پایدار",
      foundedYear: 1385,
      founderName: "مهندس محمد تابان",
      founderTitle: "بنیان‌گذار و مدیرعامل",
      founderBio: "کیفیت واقعی از جزئیاتی آغاز می‌شود که دیده نمی‌شوند، اما هر روز به آن‌ها اعتماد می‌کنیم.",
      phone: "۰۵۱-۳۷۶۵۰۰۰۰",
      whatsapp: "+989121234567",
      email: "info@tabanelevator.ir",
      address: "مشهد، شهرک صنعتی، مجموعه تابان نورد",
    },
  });

  for (let i = 0; i < samples.length; i++) {
    const [slug, title, category, price] = samples[i];
    await db.product.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title,
        category,
        subtype: category === ProductCategory.ELEVATOR ? "آسانسور" : "قطعه",
        price,
        shortDesc: "ترکیب مهندسی دقیق، عملکرد آرام و ایمنی پایدار",
        longDesc: "محصولی حرفه‌ای برای پروژه‌هایی که کیفیت ساخت، دوام و خدمات مطمئن را هم‌زمان می‌خواهند.",
        specs: category === ProductCategory.ELEVATOR ? { "ظرفیت": "۶۳۰ کیلوگرم", "سرعت": "۱ متر بر ثانیه" } : { "استاندارد": "EN 81", "گارانتی": "۲۴ ماه" },
        isFeatured: i < 4,
        images: { create: { url: "/placeholders/product.svg", altText: `تصویر ${title}`, order: 0 } },
      },
    });
  }

  const certificates = ["گواهینامه مدیریت کیفیت ISO 9001", "گواهینامه ایمنی آسانسور", "نشان استاندارد ملی ایران", "عضویت اتحادیه تخصصی"];
  for (let i = 0; i < certificates.length; i++) {
    await db.certificate.upsert({
      where: { id: `certificate-${i}` },
      update: {},
      create: { id: `certificate-${i}`, title: certificates[i], imageUrl: "/placeholders/certificate.svg", issuedBy: "مرجع معتبر", order: i },
    });
  }

  await db.companyStat.deleteMany();
  await db.companyStat.createMany({
    data: [
      { label: "سال تجربه", value: 20, order: 1 },
      { label: "پروژه موفق", value: 650, order: 2 },
      { label: "مشتری رضایتمند", value: 500, order: 3 },
    ],
  });
}

main().finally(() => db.$disconnect());
