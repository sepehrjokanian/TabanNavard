"use server";

import { Prisma, ProductCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";

const productSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "عنوان محصول الزامی است"),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "نامک باید انگلیسی و خط‌تیره‌دار باشد"),
  category: z.nativeEnum(ProductCategory),
  subtype: z.string().trim().optional(),
  price: z.preprocess((value) => value === "" ? undefined : Number(value), z.number().nonnegative().optional()),
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
  const id = z.string().cuid().parse(formData.get("id"));
  const product = await db.product.findUniqueOrThrow({ where: { id } });
  await db.product.update({ where: { id }, data: { isActive: !product.isActive } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function saveProduct(formData: FormData) {
  const parsed = productSchema.parse({
    id: formData.get("id") || undefined,
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
  if (parsed.id) await db.product.update({ where: { id: parsed.id }, data });
  else await db.product.create({ data });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
