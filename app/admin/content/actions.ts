"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { logAdminActivity } from "@/lib/activity-logger";

export async function saveContent(prevState: any, fd: FormData): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.isActive === false) {
      return { ok: false, message: "دسترسی غیرمجاز؛ لطفاً دوباره وارد شوید." };
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return { ok: false, message: "ویرایش محتوای شرکت فقط برای مدیر ارشد مجاز است." };
    }

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

    await logAdminActivity({
      adminUserId: session.user.id,
      action: "UPDATE_COMPANY_CONTENT",
      targetType: "COMPANY_CONTENT",
      targetId: "singleton",
      changes: {
        historyText: fd.get("historyText"),
        founderName: fd.get("founderName"),
      },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");

    return { ok: true, message: "اطلاعات محتوای شرکت با موفقیت بروزرسانی شد." };
  } catch (error: any) {
    return { ok: false, message: error?.message || "خطا در بروزرسانی اطلاعات شرکت." };
  }
}
