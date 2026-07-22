import { db } from "@/lib/db";
import { Award, Eye, Calendar, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CertificatesAdminPage() {
  const certificates = await db.certificate.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">گواهی‌نامه‌ها و افتخارات</h1>
          <p className="mt-2 text-ink-900/60">
            فهرست گواهی‌نامه‌های ثبت‌شده (نسخه ۱: نمایش خواندنی)
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-gold-500/10 px-4 py-2 text-sm font-bold text-gold-500">
          <Eye className="h-4 w-4" />
          <span>حالت صرفاً خواندنی</span>
        </div>
      </div>

      <div className="mt-7 overflow-x-auto rounded-card border border-navy-900/10 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-start">
          <thead className="border-b border-navy-900/10 bg-paper-50">
            <tr>
              <th className="p-4 text-start">ترتیب</th>
              <th className="p-4 text-start">عنوان گواهی‌نامه</th>
              <th className="p-4 text-start">مرجع صادرکننده</th>
              <th className="p-4 text-start">تاریخ صدور</th>
              <th className="p-4 text-start">وضعیت نمایش</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id} className="border-t border-navy-900/10 hover:bg-slate-50/50">
                <td className="p-4 font-mono font-bold text-ink-900/70">{cert.order}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy-900/5 text-blue-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <b className="block text-ink-900">{cert.title}</b>
                      <span className="text-xs text-ink-900/50" dir="ltr">{cert.imageUrl || "تصویر پیش‌فرض"}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  {cert.issuedBy ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink-900/80">
                      <Building2 className="h-4 w-4 text-navy-900/40" />
                      {cert.issuedBy}
                    </span>
                  ) : (
                    <span className="text-sm text-ink-900/40">—</span>
                  )}
                </td>
                <td className="p-4">
                  {cert.issuedAt ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink-900/80">
                      <Calendar className="h-4 w-4 text-navy-900/40" />
                      {new Date(cert.issuedAt).toLocaleDateString("fa-IR")}
                    </span>
                  ) : (
                    <span className="text-sm text-ink-900/40">—</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-blue-600">
                    فعال در صفحه اصلی
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!certificates.length && (
          <div className="p-12 text-center text-ink-900/60">
            <Award className="mx-auto h-12 w-12 text-navy-900/20" />
            <p className="mt-3">هیچ گواهی‌نامه‌ای ثبت نشده است.</p>
          </div>
        )}
      </div>
    </>
  );
}
