import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await db.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "weekly", priority: .9 },
    ...products.map((product) => ({ url: `${base}/products/${product.slug}`, lastModified: product.updatedAt, changeFrequency: "monthly" as const, priority: .8 })),
  ];
}
