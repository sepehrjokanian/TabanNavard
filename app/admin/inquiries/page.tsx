import { db } from "@/lib/db";
import Link from "next/link";
import { InquiryStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const statusLabels: Record<InquiryStatus, { label: string; style: string }> = {
  NEW: { label: "جدید", style: "bg-cyan-500/15 text-blue-600" },
  CONTACTED: { label: "تماس گرفته شده", style: "bg-gold-500/15 text-gold-600" },
  CLOSED: { label: "بسته شده", style: "bg-navy-900/10 text-ink-900/70" },
};

export default async function InquiriesAdminPage({
  searchParams,
}: {
  searchParams: { status?: InquiryStatus };
}) {
  const inquiries = await db.inquiry.findMany({
    where: searchParams.status ? { status: searchParams.status } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">درخواست‌های دریافت شده</h1>
          <p className="mt-2 text-ink-900/60">مدیریت و پیگیری استعلام قیمت‌ها و پیام‌های تماس</p>
        </div>
      </div>

      <div className="my-6 flex flex-wrap gap-2 rounded-card bg-white p-2 border border-navy-900/10">
        <Link
          href="/admin/inquiries"
          className={`rounded-button px-4 py-2 text-sm font-bold transition ${!searchParams.status ? "bg-navy-900 text-white" : "hover:bg-slate-100 text-ink-900/70"}`}
        >
          همه
        </Link>
        <Link
          href="?status=NEW"
          className={`rounded-button px-4 py-2 text-sm font-bold transition ${searchParams.status === "NEW" ? "bg-navy-900 text-white" : "hover:bg-slate-100 text-ink-900/70"}`}
        >
          جدید
        </Link>
        <Link
          href="?status=CONTACTED"
          className={`rounded-button px-4 py-2 text-sm font-bold transition ${searchParams.status === "CONTACTED" ? "bg-navy-900 text-white" : "hover:bg-slate-100 text-ink-900/70"}`}
        >
          تماس گرفته
        </Link>
        <Link
          href="?status=CLOSED"
          className={`rounded-button px-4 py-2 text-sm font-bold transition ${searchParams.status === "CLOSED" ? "bg-navy-900 text-white" : "hover:bg-slate-100 text-ink-900/70"}`}
        >
          بسته شده
        </Link>
      </div>

      <div className="grid gap-3">
        {inquiries.map((x) => (
          <Link
            key={x.id}
            href={`/admin/inquiries/${x.id}`}
            className="flex items-center justify-between rounded-card border border-navy-900/10 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div>
              <b className="text-lg text-ink-900">{x.name}</b>
              <span className="ms-3 text-sm text-ink-900/60" dir="ltr">{x.phone}</span>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusLabels[x.status]?.style ?? "bg-slate-100"}`}>
              {statusLabels[x.status]?.label ?? x.status}
            </span>
          </Link>
        ))}
        {!inquiries.length && (
          <p className="rounded-card border border-navy-900/10 bg-white p-8 text-center text-ink-900/60">
            درخواستی در این بخش یافت نشد.
          </p>
        )}
      </div>
    </>
  );
}