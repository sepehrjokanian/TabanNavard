import Link from "next/link";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/admin/inquiry-form";

export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiry = await db.inquiry.findUnique({
    where: { id: params.id },
    include: { product: true },
  });

  if (!inquiry) notFound();

  return (
    <>
      <Link href="/admin/inquiries" className="font-bold text-blue-600">
        → بازگشت به لیست درخواست‌ها
      </Link>
      <div className="mt-6">
        <h1 className="mb-6 text-3xl font-bold">جزئیات درخواست دریافت شده</h1>
        <InquiryForm inquiry={inquiry} />
      </div>
    </>
  );
}