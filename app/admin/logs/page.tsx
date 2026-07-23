import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Activity, ShieldCheck, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const actionLabels: Record<string, string> = {
  UPDATE_PRODUCT_SUB_ADMIN: "ویرایش قیمت / تصویر محصول (پشتیبان)",
  UPDATE_PRODUCT_FULL: "ویرایش کامل محصول",
  CREATE_PRODUCT: "ایجاد محصول جدید",
  TOGGLE_PRODUCT_STATUS: "تغییر وضعیت فعال محصول",
  UPDATE_INQUIRY: "به‌روزرسانی وضعیت/یادداشت درخواست",
  CREATE_SUB_ADMIN: "تعریف مدیر پشتیبان جدید",
  TOGGLE_ADMIN_STATUS: "تغییر وضعیت فعال حساب مدیر",
  DELETE_SUB_ADMIN: "حذف حساب مدیر پشتیبان",
};

export default async function ActivityLogsPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/admin/products");
  }

  const logs = await db.adminActivityLog.findMany({
    include: {
      adminUser: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

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
      </div>

      <div className="mt-8 overflow-x-auto rounded-card border border-navy-900/10 bg-white shadow-sm">
        <table className="w-full min-w-[750px] text-start">
          <thead className="bg-paper-50 border-b border-navy-900/10">
            <tr>
              <th className="p-4 text-start">زمان</th>
              <th className="p-4 text-start">مدیر انجام‌دهنده</th>
              <th className="p-4 text-start">عنوان اقدام</th>
              <th className="p-4 text-start">جزئیات و تغییرات</th>
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
                </tr>
              );
            })}
            {!logs.length && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-ink-900/60">
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
