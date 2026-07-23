"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Plus, Trash2, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { saveProduct } from "@/app/admin/products/actions";

type SpecRow = { key: string; value: string };
type ProductValue = {
  id?: string;
  title?: string;
  slug?: string;
  category?: "ELEVATOR" | "SPARE_PART";
  subtype?: string | null;
  price?: string | number | null;
  shortDesc?: string;
  longDesc?: string;
  specs?: Record<string, unknown>;
  isFeatured?: boolean;
  imageUrl?: string;
};

const fieldClass = "mt-2 w-full rounded-button border border-navy-900/20 bg-white p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:bg-slate-100 disabled:text-ink-900/60 disabled:cursor-not-allowed";

export function ProductForm({
  product,
  isSubAdmin = false,
}: {
  product?: ProductValue;
  isSubAdmin?: boolean;
}) {
  const [state, formAction] = useFormState(saveProduct, null);

  const initialSpecs = Object.entries(product?.specs ?? { "ظرفیت": "۶۳۰ کیلوگرم" }).map(([key, value]) => ({ key, value: String(value) }));
  const [specs, setSpecs] = useState<SpecRow[]>(initialSpecs.length ? initialSpecs : [{ key: "", value: "" }]);
  const updateSpec = (index: number, field: keyof SpecRow, value: string) => setSpecs((rows) => rows.map((row, i) => i === index ? { ...row, [field]: value } : row));
  const addSpec = () => setSpecs((rows) => [...rows, { key: "", value: "" }]);
  const removeSpec = (index: number) => setSpecs((rows) => rows.length === 1 ? [{ key: "", value: "" }] : rows.filter((_, i) => i !== index));
  const serializedSpecs = JSON.stringify(Object.fromEntries(specs.filter((row) => row.key.trim()).map((row) => [row.key.trim(), row.value.trim()])));

  return (
    <form action={formAction} className="grid gap-5" aria-label={product?.id ? "ویرایش محصول" : "افزودن محصول"}>
      {state?.message && (
        <div
          className={`flex items-center gap-3 rounded-button p-4 text-sm font-bold border ${
            state.ok
              ? "border-emerald-500/30 bg-emerald-50 text-emerald-800"
              : "border-rose-500/30 bg-rose-50 text-rose-800"
          }`}
        >
          {state.ok ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      {isSubAdmin && (
        <div className="flex items-center gap-3 rounded-button border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm font-medium">
            دسترسی شما محدود به پشتیبانی است. شما فقط امکان ویرایش <b>قیمت</b> و <b>آدرس تصویر</b> محصول را دارید.
          </p>
        </div>
      )}

      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="specs" value={serializedSpecs} />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="font-bold">
          عنوان محصول
          <input className={fieldClass} required disabled={isSubAdmin} name="title" defaultValue={product?.title} />
        </label>
        <label className="font-bold">
          نامک انگلیسی
          <input className={fieldClass} required disabled={isSubAdmin} name="slug" dir="ltr" pattern="[a-z0-9-]+" defaultValue={product?.slug} />
        </label>
        <label className="font-bold">
          دسته‌بندی
          <select className={fieldClass} disabled={isSubAdmin} name="category" defaultValue={product?.category ?? "ELEVATOR"}>
            <option value="ELEVATOR">آسانسور</option>
            <option value="SPARE_PART">قطعه یدکی</option>
          </select>
        </label>
        <label className="font-bold">
          نوع فرعی
          <input className={fieldClass} disabled={isSubAdmin} name="subtype" defaultValue={product?.subtype ?? ""} />
        </label>
        <label className="font-bold">
          قیمت به تومان (قابل ویرایش)
          <input className={fieldClass} min="0" step="1" type="number" name="price" defaultValue={product?.price == null ? "" : String(product.price)} placeholder="خالی = تماس بگیرید" />
        </label>
        <label className="font-bold">
          آدرس تصویر محصول (قابل ویرایش)
          <input className={fieldClass} name="imageUrl" dir="ltr" defaultValue={product?.imageUrl ?? ""} placeholder="/images/products/example.webp" />
        </label>
        <label className="flex items-center gap-3 self-end rounded-button border border-navy-900/10 p-4 font-bold md:col-span-2">
          <input className="h-5 w-5 accent-cyan-500 disabled:cursor-not-allowed" disabled={isSubAdmin} type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} />
          محصول ویژه
        </label>
      </div>

      <label className="font-bold">
        توضیح کوتاه
        <textarea className={fieldClass} required disabled={isSubAdmin} rows={2} name="shortDesc" defaultValue={product?.shortDesc} />
      </label>
      <label className="font-bold">
        توضیح کامل
        <textarea className={fieldClass} required disabled={isSubAdmin} rows={6} name="longDesc" defaultValue={product?.longDesc} />
      </label>

      <fieldset className="rounded-card border border-navy-900/10 p-5 disabled:opacity-60">
        <legend className="px-2 text-lg font-bold">مشخصات فنی</legend>
        <p className="mb-4 text-sm text-ink-900/60">مشخصات را به‌صورت کلید و مقدار اضافه کنید.</p>
        <div className="grid gap-3">
          {specs.map((row, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label>
                <span className="sr-only">نام مشخصه {index + 1}</span>
                <input disabled={isSubAdmin} value={row.key} onChange={(e) => updateSpec(index, "key", e.target.value)} placeholder="مثلاً ظرفیت" className="w-full rounded-button border p-3 disabled:bg-slate-100" />
              </label>
              <label>
                <span className="sr-only">مقدار مشخصه {index + 1}</span>
                <input disabled={isSubAdmin} value={row.value} onChange={(e) => updateSpec(index, "value", e.target.value)} placeholder="مثلاً ۶۳۰ کیلوگرم" className="w-full rounded-button border p-3 disabled:bg-slate-100" />
              </label>
              {!isSubAdmin && (
                <button type="button" onClick={() => removeSpec(index)} aria-label={`حذف مشخصه ${index + 1}`} className="rounded-button border border-navy-900/20 p-3 text-ink-900 hover:bg-paper-50">
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
        {!isSubAdmin && (
          <button type="button" onClick={addSpec} className="mt-4 inline-flex items-center gap-2 rounded-button border border-blue-600 px-4 py-2 font-bold text-blue-600">
            <Plus className="h-4 w-4" /> افزودن مشخصه
          </button>
        )}
      </fieldset>

      <button className="rounded-button bg-gradient-to-l from-cyan-500 to-blue-600 px-7 py-3 font-bold text-white focus-visible:ring-2 focus-visible:ring-cyan-500">
        {product?.id ? "ذخیره تغییرات" : "ایجاد محصول"}
      </button>
    </form>
  );
}
