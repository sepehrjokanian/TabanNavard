"use client";

import { useFormState } from "react-dom";
import { saveContent } from "@/app/admin/content/actions";
import { CheckCircle2, AlertCircle } from "lucide-react";

const fields: { key: string; label: string; rows?: number }[] = [
  { key: "historyText", label: "تاریخچه شرکت", rows: 4 },
  { key: "founderName", label: "نام بنیان‌گذار", rows: 1 },
  { key: "founderTitle", label: "عنوان/سمت بنیان‌گذار", rows: 1 },
  { key: "founderBio", label: "بیوگرافی و دیدگاه بنیان‌گذار", rows: 4 },
  { key: "phone", label: "شماره‌های تماس", rows: 1 },
  { key: "email", label: "ایمیل پشتیبانی", rows: 1 },
  { key: "address", label: "نشانی دفتر مرکزی", rows: 2 },
];

export function ContentForm({ content }: { content: Record<string, any> | null }) {
  const [state, formAction] = useFormState(saveContent, null);

  return (
    <form action={formAction} className="mt-6 grid gap-5 rounded-card border border-navy-900/10 bg-white p-6 shadow-sm">
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

      {fields.map(({ key, label, rows }) => (
        <label key={key} className="block font-bold">
          <span className="mb-2 block text-sm text-ink-900">{label}</span>
          {rows === 1 ? (
            <input
              name={key}
              defaultValue={content?.[key] || ""}
              className="w-full rounded-button border border-navy-900/20 p-3 font-normal focus-visible:ring-2 focus-visible:ring-cyan-500"
            />
          ) : (
            <textarea
              name={key}
              rows={rows}
              defaultValue={content?.[key] || ""}
              className="w-full rounded-button border border-navy-900/20 p-3 font-normal focus-visible:ring-2 focus-visible:ring-cyan-500"
            />
          )}
        </label>
      ))}

      <button className="mt-2 justify-self-start rounded-button bg-blue-600 px-8 py-3 font-bold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-cyan-500">
        ذخیره تغییرات
      </button>
    </form>
  );
}
