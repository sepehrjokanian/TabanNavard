import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const fields: { key: string; label: string; rows?: number }[] = [
  { key: "historyText", label: "تاریخچه شرکت", rows: 4 },
  { key: "founderName", label: "نام بنیان‌گذار", rows: 1 },
  { key: "founderTitle", label: "عنوان/سمت بنیان‌گذار", rows: 1 },
  { key: "founderBio", label: "بیوگرافی و دیدگاه بنیان‌گذار", rows: 4 },
  { key: "phone", label: "شماره‌های تماس", rows: 1 },
  { key: "email", label: "ایمیل پشتیبانی", rows: 1 },
  { key: "address", label: "نشانی دفتر مرکزی", rows: 2 },
];

export default async function ContentAdminPage() {
  const content = await db.companyContent.findUnique({ where: { id: "singleton" } });

  async function saveContent(fd: FormData) {
    "use server";
    await db.companyContent.update({
      where: { id: "singleton" },
      data: {
        historyText: String(fd.get("historyText") ?? ""),
        founderName: String(fd.get("founderName") ?? ""),
        founderTitle: String(fd.get("founderTitle") ?? ""),
        founderBio: String(fd.get("founderBio") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        address: String(fd.get("address") ?? ""),
      },
    });
    revalidatePath("/admin/content");
    revalidatePath("/");
  }

  return (
    <>
      <h1 className="text-3xl font-bold">محتوای اصلی شرکت</h1>
      <p className="mt-2 text-ink-900/60">ویرایش اطلاعات عمومی، سوابق و راه‌های ارتباطی سایت</p>

      <form action={saveContent} className="mt-6 grid gap-5 rounded-card border border-navy-900/10 bg-white p-6 shadow-sm">
        {fields.map(({ key, label, rows }) => (
          <label key={key} className="block font-bold">
            <span className="mb-2 block text-sm text-ink-900">{label}</span>
            {rows === 1 ? (
              <input
                name={key}
                defaultValue={(content as any)?.[key] || ""}
                className="w-full rounded-button border border-navy-900/20 p-3 font-normal focus-visible:ring-2 focus-visible:ring-cyan-500"
              />
            ) : (
              <textarea
                name={key}
                rows={rows}
                defaultValue={(content as any)?.[key] || ""}
                className="w-full rounded-button border border-navy-900/20 p-3 font-normal focus-visible:ring-2 focus-visible:ring-cyan-500"
              />
            )}
          </label>
        ))}
        <button className="mt-2 justify-self-start rounded-button bg-blue-600 px-8 py-3 font-bold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-cyan-500">
          ذخیره تغییرات
        </button>
      </form>
    </>
  );
}