"use client";

import { useFormState } from "react-dom";
import { deleteActivityLog, clearAllActivityLogs } from "@/app/admin/logs/actions";
import { Activity, ShieldCheck, UserCheck, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

type LogEntry = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  changes: any;
  createdAt: Date;
  adminUser?: {
    name: string;
    email: string;
    role: string;
  } | null;
};

const actionLabels: Record<string, string> = {
  UPDATE_PRODUCT_SUB_ADMIN: "ویرایش قیمت / تصویر محصول (پشتیبان)",
  UPDATE_PRODUCT_FULL: "ویرایش کامل محصول",
  CREATE_PRODUCT: "ایجاد محصول جدید",
  TOGGLE_PRODUCT_STATUS: "تغییر وضعیت فعال محصول",
  UPDATE_INQUIRY: "به‌روزرسانی وضعیت/یادداشت درخواست",
  CREATE_SUB_ADMIN: "تعریف مدیر پشتیبان جدید",
  TOGGLE_ADMIN_STATUS: "تغییر وضعیت فعال حساب مدیر",
  DELETE_SUB_ADMIN: "حذف حساب مدیر پشتیبان",
  UPDATE_COMPANY_CONTENT: "ویرایش محتوای اصلی شرکت",
};

function FeedbackBanner({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state?.message) return null;
  return (
    <div
      className={`mb-4 flex items-center gap-3 rounded-button p-4 text-sm font-bold border ${
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
  );
}

function SingleDeleteForm({ logId }: { logId: string }) {
  const [state, formAction] = useFormState(deleteActivityLog, null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm("آیا از حذف این سابقه فعالیت اطمینان دارید؟ این عمل قابل بازگشت نیست.")) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <FeedbackBanner state={state} />
      <form action={formAction} onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={logId} />
        <button
          title="حذف سابقه"
          className="inline-flex items-center gap-1 font-medium text-xs rounded border border-rose-200 text-rose-600 px-2.5 py-1.5 hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          حذف
        </button>
      </form>
    </div>
  );
}

export function ActivityLogsTable({ logs }: { logs: LogEntry[] }) {
  const [clearState, clearAction] = useFormState(clearAllActivityLogs, null);

  const handleClearAllSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (
      !window.confirm(
        "آیا از پاکسازی تمام سوابق تغییرات اطمینان دارید؟ این عمل غیرقابل بازگشت است و کلیه سوابق حذف خواهند شد."
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-7 w-7 text-cyan-600" />
            سوابق تغییرات و فعالیت‌ها
          </h1>
          <p className="mt-2 text-ink-900/60">گزارش تمام اقدامات ثبت‌شده توسط مدیران ارشد و پشتیبان</p>
        </div>

        {logs.length > 0 && (
          <form action={clearAction} onSubmit={handleClearAllSubmit}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-button border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
              پاکسازی تمام سوابق
            </button>
          </form>
        )}
      </div>

      <div className="mt-6">
        <FeedbackBanner state={clearState} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-card border border-navy-900/10 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-start">
          <thead className="bg-paper-50 border-b border-navy-900/10">
            <tr>
              <th className="p-4 text-start">زمان</th>
              <th className="p-4 text-start">مدیر انجام‌دهنده</th>
              <th className="p-4 text-start">عنوان اقدام</th>
              <th className="p-4 text-start">جزئیات و تغییرات</th>
              <th className="p-4 text-start">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const isSuper = log.adminUser?.role === "SUPER_ADMIN";
              const formattedDate = new Date(log.createdAt).toLocaleString("fa-IR");

              return (
                <tr key={log.id} className="border-b border-navy-900/10 hover:bg-slate-50/50">
                  <td className="p-4 text-xs font-medium text-ink-900/70 dir-ltr text-end whitespace-nowrap">
                    {formattedDate}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {isSuper ? (
                        <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-cyan-600 shrink-0" />
                      )}
                      <div>
                        <b className="block text-sm text-ink-900">{log.adminUser?.name || "مدیر"}</b>
                        <small className="text-ink-900/50 font-mono" dir="ltr">
                          {log.adminUser?.email}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded bg-navy-900/5 px-2.5 py-1 text-xs font-bold text-navy-900">
                      {actionLabels[log.action] || log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <pre className="max-w-md overflow-x-auto rounded bg-slate-100 p-2.5 text-[11px] text-ink-900/80 font-mono" dir="ltr">
                      {JSON.stringify(log.changes, null, 2)}
                    </pre>
                  </td>
                  <td className="p-4">
                    <SingleDeleteForm logId={log.id} />
                  </td>
                </tr>
              );
            })}
            {!logs.length && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-900/60">
                  هنوز هیچ فعالیتی در سیستم ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
