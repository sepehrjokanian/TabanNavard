"use client";

import { useFormState } from "react-dom";
import { createSubAdmin, toggleAdminStatus, deleteSubAdmin } from "@/app/admin/team/actions";
import { UserPlus, Shield, UserCheck, Trash2, Power, CheckCircle2, AlertCircle } from "lucide-react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "SUB_ADMIN";
  isActive: boolean;
  createdAt: Date;
};

function FeedbackBanner({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state?.message) return null;
  return (
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
  );
}

function ToggleForm({ user }: { user: AdminUser }) {
  const [state, formAction] = useFormState(toggleAdminStatus, null);
  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="id" value={user.id} />
        <button
          title={user.isActive ? "غیرفعال‌سازی حساب" : "فعال‌سازی حساب"}
          className="inline-flex items-center gap-1 font-medium text-xs rounded border px-2.5 py-1.5 hover:bg-slate-100"
        >
          <Power className={`h-3.5 w-3.5 ${user.isActive ? "text-amber-600" : "text-emerald-600"}`} />
          {user.isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
        </button>
      </form>
      <FeedbackBanner state={state} />
    </div>
  );
}

function DeleteForm({ user }: { user: AdminUser }) {
  const [state, formAction] = useFormState(deleteSubAdmin, null);
  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="id" value={user.id} />
        <button
          title="حذف حساب کاربری"
          className="inline-flex items-center gap-1 font-medium text-xs rounded border border-rose-200 text-rose-600 px-2.5 py-1.5 hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          حذف
        </button>
      </form>
      <FeedbackBanner state={state} />
    </div>
  );
}

export function TeamManagement({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [createState, createAction] = useFormState(createSubAdmin, null);

  return (
    <>
      <div className="mt-6 rounded-card bg-white p-6 shadow-sm border border-navy-900/10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-cyan-600" />
          افزودن مدیر پشتیبان جدید
        </h2>

        <FeedbackBanner state={createState} />

        <form action={createAction} className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="font-medium text-sm">
            نام و نام خانوادگی
            <input
              type="text"
              name="name"
              required
              placeholder="مثلاً علی محمدی"
              className="mt-1 w-full rounded-button border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </label>
          <label className="font-medium text-sm">
            ایمیل (نام کاربری)
            <input
              type="email"
              name="email"
              required
              dir="ltr"
              placeholder="user@example.com"
              className="mt-1 w-full rounded-button border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </label>
          <label className="font-medium text-sm">
            رمز عبور اولیه
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="حداقل ۸ کاراکتر"
              className="mt-1 w-full rounded-button border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </label>
          <div className="sm:col-span-3 flex justify-end">
            <button className="rounded-button bg-blue-600 px-6 py-2.5 font-bold text-white transition hover:bg-blue-700">
              ثبت و ایجاد حساب پشتیبان
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-navy-900/10 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-start">
          <thead className="bg-paper-50 border-b border-navy-900/10">
            <tr>
              <th className="p-4 text-start">کاربر</th>
              <th className="p-4 text-start">نقش</th>
              <th className="p-4 text-start">وضعیت</th>
              <th className="p-4 text-start">تاریخ ایجاد</th>
              <th className="p-4 text-start">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const isSuper = user.role === "SUPER_ADMIN";

              return (
                <tr key={user.id} className="border-b border-navy-900/10 hover:bg-slate-50/50">
                  <td className="p-4">
                    <b className="block text-ink-900">{user.name}</b>
                    <small className="text-ink-900/60 font-mono" dir="ltr">
                      {user.email}
                    </small>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        isSuper ? "bg-amber-100 text-amber-800" : "bg-cyan-100 text-cyan-800"
                      }`}
                    >
                      {isSuper ? <Shield className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                      {isSuper ? "مدیر ارشد" : "مدیر پشتیبان"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {user.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-ink-900/60">
                    {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-4">
                    {!isSuper && !isSelf ? (
                      <div className="flex items-center gap-3">
                        <ToggleForm user={user} />
                        <DeleteForm user={user} />
                      </div>
                    ) : isSuper ? (
                      <span className="text-xs text-ink-900/40">حساب اصلی سیستم</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
