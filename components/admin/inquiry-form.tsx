"use client";

import { useFormState } from "react-dom";
import { updateInquiry } from "@/app/admin/inquiries/actions";
import { InquiryStatus } from "@prisma/client";
import { CheckCircle2, AlertCircle } from "lucide-react";

type InquiryData = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  status: InquiryStatus;
  adminNotes?: string | null;
  createdAt: Date;
};

export function InquiryForm({ inquiry }: { inquiry: InquiryData }) {
  const [state, formAction] = useFormState(updateInquiry, null);

  return (
    <div className="rounded-card bg-white p-6 shadow-sm border border-navy-900/10">
      <div className="border-b border-navy-900/10 pb-4 mb-6">
        <h2 className="text-xl font-bold text-ink-900">{inquiry.name}</h2>
        <div className="mt-1 flex flex-wrap gap-4 text-sm text-ink-900/60">
          <span>شماره تماس: <b dir="ltr" className="font-mono text-ink-900">{inquiry.phone}</b></span>
          {inquiry.email && <span>ایمیل: <b dir="ltr" className="font-mono text-ink-900">{inquiry.email}</b></span>}
          <span>تاریخ ثبت: <b>{new Date(inquiry.createdAt).toLocaleDateString("fa-IR")}</b></span>
        </div>
      </div>

      <div className="mb-6 rounded-button bg-paper-50 p-4 border border-navy-900/10">
        <span className="block text-xs font-bold text-ink-900/50 mb-1">متن پیام / درخواست:</span>
        <p className="text-ink-900 leading-relaxed">{inquiry.message}</p>
      </div>

      <form action={formAction} className="grid gap-5">
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

        <input type="hidden" name="id" value={inquiry.id} />

        <label className="block font-bold text-sm">
          وضعیت پیگیری
          <select
            name="status"
            defaultValue={inquiry.status}
            className="mt-2 w-full rounded-button border border-navy-900/20 bg-white p-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <option value="NEW">جدید</option>
            <option value="CONTACTED">تماس گرفته شده</option>
            <option value="CLOSED">بسته شده</option>
          </select>
        </label>

        <label className="block font-bold text-sm">
          یادداشت‌های داخلی کارشناسان
          <textarea
            name="adminNotes"
            rows={4}
            defaultValue={inquiry.adminNotes || ""}
            placeholder="مثلاً: کاتالوگ ارسال شد، منتظر تایید نهایی کاربر..."
            className="mt-2 w-full rounded-button border border-navy-900/20 bg-white p-3 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          />
        </label>

        <button className="justify-self-start rounded-button bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-cyan-500">
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}
