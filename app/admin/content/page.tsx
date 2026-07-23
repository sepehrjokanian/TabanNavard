import { db } from "@/lib/db";
import { ContentForm } from "@/components/admin/content-form";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  const content = await db.companyContent.findUnique({ where: { id: "singleton" } });

  return (
    <>
      <h1 className="text-3xl font-bold">محتوای اصلی شرکت</h1>
      <p className="mt-2 text-ink-900/60">ویرایش اطلاعات عمومی، سوابق و راه‌های ارتباطی سایت</p>
      <ContentForm content={content as Record<string, any>} />
    </>
  );
}