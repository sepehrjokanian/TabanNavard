import Link from "next/link";
import { ProductCategory } from "@prisma/client";
import { db } from "@/lib/db";
import { toggleProduct } from "./actions";

export const dynamic = "force-dynamic";
type Params = { q?: string; category?: string; active?: string };

export default async function ProductsAdmin({ searchParams }: { searchParams: Params }) {
  const category = Object.values(ProductCategory).includes(searchParams.category as ProductCategory) ? searchParams.category as ProductCategory : undefined;
  const active = searchParams.active === "true" ? true : searchParams.active === "false" ? false : undefined;
  const products = await db.product.findMany({
    where: {
      category,
      isActive: active,
      OR: searchParams.q ? [{ title: { contains: searchParams.q, mode: "insensitive" } }, { slug: { contains: searchParams.q, mode: "insensitive" } }] : undefined,
    },
    orderBy: { updatedAt: "desc" },
  });

  return <>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">مدیریت محصولات</h1><p className="mt-2 text-ink-900/60">ایجاد، ویرایش و کنترل نمایش محصولات سایت</p></div><Link href="/admin/products/new" className="rounded-button bg-blue-600 px-5 py-3 font-bold text-white">افزودن محصول</Link></div>
    <form className="mt-7 grid gap-3 rounded-card bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4" aria-label="فیلتر محصولات مدیریت">
      <label><span className="sr-only">جستجو</span><input name="q" defaultValue={searchParams.q} placeholder="جستجوی عنوان یا نامک" className="w-full rounded-button border p-3" /></label>
      <label><span className="sr-only">دسته‌بندی</span><select name="category" defaultValue={searchParams.category ?? ""} className="w-full rounded-button border bg-white p-3"><option value="">همه دسته‌ها</option><option value="ELEVATOR">آسانسور</option><option value="SPARE_PART">قطعه یدکی</option></select></label>
      <label><span className="sr-only">وضعیت</span><select name="active" defaultValue={searchParams.active ?? ""} className="w-full rounded-button border bg-white p-3"><option value="">همه وضعیت‌ها</option><option value="true">فعال</option><option value="false">غیرفعال</option></select></label>
      <button className="rounded-button bg-navy-900 p-3 font-bold text-white">اعمال فیلتر</button>
    </form>
    <div className="mt-6 overflow-x-auto rounded-card border border-navy-900/10 bg-white">
      <table className="w-full min-w-[720px] text-start"><thead className="bg-paper-50"><tr><th className="p-4 text-start">محصول</th><th className="p-4 text-start">دسته</th><th className="p-4 text-start">قیمت</th><th className="p-4 text-start">وضعیت</th><th className="p-4 text-start">عملیات</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-t border-navy-900/10"><td className="p-4"><b>{product.title}</b><small className="mt-1 block text-ink-900/50" dir="ltr">{product.slug}</small></td><td className="p-4">{product.category === "ELEVATOR" ? "آسانسور" : "قطعه"}</td><td className="p-4">{product.price ? Number(product.price).toLocaleString("fa-IR") : "تماس بگیرید"}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-sm font-bold ${product.isActive ? "bg-cyan-500/15 text-blue-600" : "bg-navy-900/10 text-ink-900"}`}>{product.isActive ? "فعال" : "غیرفعال"}</span></td><td className="p-4"><div className="flex gap-4"><Link className="font-bold text-blue-600" href={`/admin/products/${product.id}`}>ویرایش</Link><form action={toggleProduct}><input type="hidden" name="id" value={product.id} /><button className="font-bold text-ink-900">{product.isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}</button></form></div></td></tr>)}</tbody></table>
      {!products.length && <p className="p-8 text-center">محصولی یافت نشد.</p>}
    </div>
  </>;
}
