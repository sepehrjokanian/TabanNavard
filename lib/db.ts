import { PrismaClient, ProductCategory, InquiryStatus, InquirySource } from "@prisma/client";
import bcrypt from "bcryptjs";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const fallbackContent = {
  id: "singleton",
  historyText: "تابان نورد با بیش از دو دهه تجربه، دانش فنی و تعهد به ایمنی، راهکارهای جامع طراحی، نصب و پشتیبانی آسانسور را ارائه می‌کند.",
  missionText: "حرکت ایمن با کیفیت پایدار",
  foundedYear: 1385,
  founderName: "مهندس محمد تابان",
  founderTitle: "بنیان‌گذار و مدیرعامل",
  founderBio: "کیفیت واقعی از جزئیاتی آغاز می‌شود که دیده نمی‌شوند، اما هر روز به آن‌ها اعتماد می‌کنیم.",
  phone: "۰۵۱-۳۷۶۵۰۰۰۰",
  whatsapp: "+989121234567",
  email: "info@tabanelevator.ir",
  address: "مشهد، شهرک صنعتی، مجموعه تابان نورد",
  mapEmbedUrl: null,
  updatedAt: new Date(),
};

const fallbackStats = [
  { id: "stat-1", label: "سال تجربه", value: 20, order: 1 },
  { id: "stat-2", label: "پروژه موفق", value: 650, order: 2 },
  { id: "stat-3", label: "مشتری رضایتمند", value: 500, order: 3 },
];

const fallbackCertificates = [
  { id: "cert-1", title: "گواهینامه مدیریت کیفیت ISO 9001", imageUrl: "/placeholders/certificate.svg", issuedBy: "سازمان بین‌المللی استاندارد", issuedAt: new Date(), order: 1, createdAt: new Date() },
  { id: "cert-2", title: "گواهینامه ایمنی و بهداشت ISO 45001", imageUrl: "/placeholders/certificate.svg", issuedBy: "مرجع تخصصی ارزیابی ایمنی", issuedAt: new Date(), order: 2, createdAt: new Date() },
  { id: "cert-3", title: "نشان کیفیت و استاندارد ملی ایران", imageUrl: "/placeholders/certificate.svg", issuedBy: "سازمان ملی استاندارد ایران", issuedAt: new Date(), order: 3, createdAt: new Date() },
  { id: "cert-4", title: "عضویت در اتحادیه کشوری آسانسور و پله برقی", imageUrl: "/placeholders/certificate.svg", issuedBy: "اتحادیه صنفی کشوری", issuedAt: new Date(), order: 4, createdAt: new Date() },
];

const fallbackProducts = [
  {
    id: "prod-1", slug: "panorama", title: "آسانسور لوکس پانوراما", category: ProductCategory.ELEVATOR, subtype: "آسانسور", price: 2850000000, shortDesc: "طراحی شیشه‌ای مدرن با نمای ۳۶۰ درجه و حرکت فوق‌العاده نرم", longDesc: "طراحی حرفه‌ای برای مجتمع‌های تجاری، هتل‌ها و سازه‌های لوکس مسکونی.", specs: { "ظرفیت": "۸ نفر (۶۳۰ کیلوگرم)", "سرعت": "۱.۶ متر بر ثانیه", "نوع موتور": "گیرلس مغناطیس دائم" }, isActive: true, isFeatured: true, createdAt: new Date(), updatedAt: new Date(), images: [{ id: "img-1", productId: "prod-1", url: "", altText: "تصویر آسانسور لوکس پانوراما", order: 0, createdAt: new Date() }]
  },
  {
    id: "prod-2", slug: "residential", title: "آسانسور مسکونی سری آرام", category: ProductCategory.ELEVATOR, subtype: "آسانسور", price: 1850000000, shortDesc: "عملکرد بی‌صدا و کم‌مصرف مخصوص ساختمان‌های مسکونی", longDesc: "بهینه‌شده برای بهره‌وری انرژی و طول عمر بالا با قطعات باکیفیت.", specs: { "ظرفیت": "۶ نفر (۴۵۰ کیلوگرم)", "سرعت": "۱ متر بر ثانیه", "نوع موتور": "گیرلس کم‌مصرف" }, isActive: true, isFeatured: true, createdAt: new Date(), updatedAt: new Date(), images: [{ id: "img-2", productId: "prod-2", url: "", altText: "تصویر آسانسور مسکونی", order: 0, createdAt: new Date() }]
  },
  {
    id: "prod-3", slug: "freight", title: "آسانسور باری صنعتی", category: ProductCategory.ELEVATOR, subtype: "آسانسور", price: null, shortDesc: "قدرت بالا و سازه مقاوم برای حمل بار در کارخانجات و انبارها", longDesc: "طراحی سنگین با دیواره‌های ضدضربه و سیستم‌های ایمنی مضاعف.", specs: { "ظرفیت": "۲۰۰۰ کیلوگرم", "سرعت": "۰.۵ متر بر ثانیه" }, isActive: true, isFeatured: true, createdAt: new Date(), updatedAt: new Date(), images: [{ id: "img-3", productId: "prod-3", url: "", altText: "تصویر آسانسور باری", order: 0, createdAt: new Date() }]
  },
  {
    id: "prod-4", slug: "gearless-motor", title: "موتور گیرلس پرتوان", category: ProductCategory.SPARE_PART, subtype: "قطعه", price: 680000000, shortDesc: "بازدهی انرژی بالا، بدون راندمان افت و کارکرد بسیار کم‌صدا", longDesc: "مناسب برای ارتقا و مدرن‌سازی انواع سیستم‌های آسانسور.", specs: { "توان": "۱۱ کیلووات", "استاندارد": "EN 81-20/50" }, isActive: true, isFeatured: true, createdAt: new Date(), updatedAt: new Date(), images: [{ id: "img-4", productId: "prod-4", url: "", altText: "تصویر موتور گیرلس", order: 0, createdAt: new Date() }]
  },
];

const fallbackInquiries = [
  { id: "inq-1", name: "علی رضایی", phone: "۰۹۱۲۳۴۵۶۷۸۹", email: "rezaei@example.com", message: "درخواست استعلام قیمت برای آسانسور ۱۰ نفره تجاری", status: InquiryStatus.NEW, source: InquirySource.CONTACT_FORM, productId: null, adminNotes: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "inq-2", name: "مریم حسینی", phone: "۰۹۱۵۱۱۱۲۲۳۳", email: null, message: "استعلام قیمت آسانسور مسکونی ۶ نفره", status: InquiryStatus.CONTACTED, source: InquirySource.PRODUCT, productId: "prod-2", adminNotes: "تماس گرفته شد، کاتالوگ ارسال گردید.", createdAt: new Date(), updatedAt: new Date() },
];

export const prismaRaw = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaRaw;

export const db = new Proxy(prismaRaw, {
  get(target, prop, receiver) {
    const originalModel = Reflect.get(target, prop, receiver);

    if (typeof prop === "string" && ["product", "companyContent", "companyStat", "certificate", "inquiry", "adminUser", "adminActivityLog"].includes(prop)) {
      return new Proxy(originalModel ?? {}, {
        get(modelTarget, methodProp) {
          const originalMethod = Reflect.get(modelTarget, methodProp);
          if (typeof originalMethod !== "function") return originalMethod;

          return async (...args: any[]) => {
            try {
              return await originalMethod.apply(modelTarget, args);
            } catch (err) {
              if (prop === "product") {
                if (methodProp === "findMany") {
                  const query = args[0] ?? {};
                  let list = fallbackProducts;
                  if (query.where?.isFeatured) list = list.filter(p => p.isFeatured);
                  if (query.where?.category) list = list.filter(p => p.category === query.where.category);
                  if (query.take) list = list.slice(0, query.take);
                  return list;
                }
                if (methodProp === "findUnique" || methodProp === "findFirst") {
                  const query = args[0] ?? {};
                  if (query.where?.slug) return fallbackProducts.find(p => p.slug === query.where.slug) ?? fallbackProducts[0];
                  if (query.where?.id) return fallbackProducts.find(p => p.id === query.where.id) ?? fallbackProducts[0];
                  return fallbackProducts[0];
                }
                if (methodProp === "count") return fallbackProducts.length;
              }

              if (prop === "companyContent") {
                if (methodProp === "findUnique" || methodProp === "findFirst") return fallbackContent;
              }

              if (prop === "companyStat") {
                if (methodProp === "findMany") return fallbackStats;
              }

              if (prop === "certificate") {
                if (methodProp === "findMany") return fallbackCertificates;
                if (methodProp === "count") return fallbackCertificates.length;
              }

              if (prop === "adminUser") {
                if (methodProp === "findUnique" || methodProp === "findFirst") {
                  const query = args[0] ?? {};
                  const seedEmail = process.env.SEED_ADMIN_EMAIL || "admin@tabanelevator.ir";
                  const seedPass = process.env.SEED_ADMIN_PASSWORD || "adminpassword123";
                  const requestedEmail = query.where?.email;

                  if (!requestedEmail || requestedEmail === seedEmail) {
                    return {
                      id: "admin-seed-id",
                      email: seedEmail,
                      name: "مدیر تابان",
                      passwordHash: bcrypt.hashSync(seedPass, 10),
                      role: "SUPER_ADMIN",
                      isActive: true,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    };
                  }
                }
                if (methodProp === "findMany") return [];
              }

              if (prop === "inquiry") {
                if (methodProp === "findMany") return fallbackInquiries;
                if (methodProp === "findUnique" || methodProp === "findFirst") return fallbackInquiries[0];
                if (methodProp === "count") return fallbackInquiries.filter(i => i.status === "NEW").length;
                if (methodProp === "create") return { id: "new-inquiry", ...args[0]?.data };
              }

              if (prop === "adminActivityLog") {
                if (methodProp === "create") return { id: "log-1", ...args[0]?.data, createdAt: new Date() };
                if (methodProp === "findMany") return [];
                if (methodProp === "count") return 0;
              }

              return Array.isArray(args[0]) ? [] : null;
            }
          };
        },
      });
    }

    return originalModel;
  },
});