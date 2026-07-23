"use server";

import { Prisma, ProductCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { logAdminActivity } from "@/lib/activity-logger";

const productSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "عنوان محصول الزامی است"),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "نامک باید انگلیسی و خط‌تیره‌دار باشد"),
  category: z.nativeEnum(ProductCategory),
  subtype: z.string().trim().optional(),
  price: z.preprocess((value) => (value === "" ? undefined : Number(value)), z.number().nonnegative().optional()),
  shortDesc: z.string().trim().min(10, "توضیح کوتاه کافی نیست"),
  longDesc: z.string().trim().min(20, "توضیح کامل کافی نیست"),
  specs: z.string().transform((value, context) => {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error();
      return parsed;
    } catch {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "مشخصات فنی معتبر نیست" });
      return z.NEVER;
    }
  }),
  isFeatured: z.boolean(),
});

export async function toggleProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.isActive === false) {
    throw new Error("دسترسی غیرمجاز");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("فقط مدیر ارشد می‌تواند وضعیت محصول را تغییر دهد.");
  }

  const id = z.string().cuid().parse(formData.get("id"));
  const product = await db.product.findUniqueOrThrow({ where: { id } });
  const newStatus = !product.isActive;

  await db.product.update({ where: { id }, data: { isActive: newStatus } });

  await logAdminActivity({
    adminUserId: session.user.id,
    action: "TOGGLE_PRODUCT_STATUS",
    targetType: "PRODUCT",
    targetId: id,
    changes: { title: product.title, oldStatus: product.isActive, newStatus },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function saveProduct(prevState: any, formData: FormData): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.isActive === false) {
      return { ok: false, message: "دسترسی غیرمجاز؛ لطفاً وارد شوید." };
    }

    const productId = formData.get("id") ? String(formData.get("id")) : undefined;
    const imageUrl = formData.get("imageUrl") ? String(formData.get("imageUrl")).trim() : undefined;

    if (session.user.role === "SUB_ADMIN") {
      if (!productId) {
        return { ok: false, message: "مدیران پشتیبان اجازه ایجاد محصول جدید ندارند." };
      }

      const existingProduct = await db.product.findUniqueOrThrow({ where: { id: productId } });
      const rawPrice = formData.get("price");
      const newPrice = rawPrice === "" || rawPrice === null ? null : Number(rawPrice);

      await db.product.update({
        where: { id: productId },
        data: { price: newPrice },
      });

      if (imageUrl) {
        const existingImages = await db.productImage.findMany({ where: { productId } });
        if (existingImages.length > 0) {
          await db.productImage.update({
            where: { id: existingImages[0].id },
            data: { url: imageUrl },
          });
        } else {
          await db.productImage.create({
            data: {
              productId,
              url: imageUrl,
              altText: existingProduct.title,
              order: 0,
            },
          });
        }
      }

      await logAdminActivity({
        adminUserId: session.user.id,
        action: "UPDATE_PRODUCT_SUB_ADMIN",
        targetType: "PRODUCT",
        targetId: productId,
        changes: {
          productTitle: existingProduct.title,
          price: { old: existingProduct.price ? Number(existingProduct.price) : null, new: newPrice },
          imageUrl: imageUrl || "unchanged",
        },
      });

      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/admin/products");
      revalidatePath(`/admin/products/${productId}`);

      return { ok: true, message: "قیمت و تصویر محصول با موفقیت بروزرسانی شد." };
    }

    // Super Admin path
    const parsed = productSchema.parse({
      id: productId,
      title: formData.get("title"),
      slug: formData.get("slug"),
      category: formData.get("category"),
      subtype: formData.get("subtype"),
      price: formData.get("price"),
      shortDesc: formData.get("shortDesc"),
      longDesc: formData.get("longDesc"),
      specs: formData.get("specs"),
      isFeatured: formData.get("isFeatured") === "on",
    });

    const data = {
      title: parsed.title,
      slug: parsed.slug,
      category: parsed.category,
      subtype: parsed.subtype || null,
      price: parsed.price ?? null,
      shortDesc: parsed.shortDesc,
      longDesc: parsed.longDesc,
      specs: parsed.specs as Prisma.InputJsonValue,
      isFeatured: parsed.isFeatured,
    };

    let savedId = parsed.id;
    if (parsed.id) {
      await db.product.update({ where: { id: parsed.id }, data });
    } else {
      const created = await db.product.create({ data });
      savedId = created.id;
    }

    if (savedId && imageUrl) {
      const existingImages = await db.productImage.findMany({ where: { productId: savedId } });
      if (existingImages.length > 0) {
        await db.productImage.update({
          where: { id: existingImages[0].id },
          data: { url: imageUrl },
        });
      } else {
        await db.productImage.create({
          data: {
            productId: savedId,
            url: imageUrl,
            altText: parsed.title,
            order: 0,
          },
        });
      }
    }

    await logAdminActivity({
      adminUserId: session.user.id,
      action: parsed.id ? "UPDATE_PRODUCT_FULL" : "CREATE_PRODUCT",
      targetType: "PRODUCT",
      targetId: savedId || "unknown",
      changes: { title: parsed.title, price: parsed.price, imageUrl },
    });

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    if (savedId) revalidatePath(`/admin/products/${savedId}`);

    return {
      ok: true,
      message: parsed.id ? "اطلاعات محصول با موفقیت بروزرسانی شد." : "محصول جدید با موفقیت ایجاد شد.",
    };
  } catch (error: any) {
    return { ok: false, message: error?.message || "خطا در ذخیره اطلاعات محصول." };
  }
}
