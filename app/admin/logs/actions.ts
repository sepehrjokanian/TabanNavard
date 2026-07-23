"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteActivityLog(
  prevState: any,
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.isActive === false) {
      return { ok: false, message: "دسترسی غیرمجاز؛ لطفاً وارد شوید." };
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return { ok: false, message: "حذف سوابق تغییرات فقط برای مدیر ارشد مجاز است." };
    }

    const id = String(formData.get("id"));
    if (!id) {
      return { ok: false, message: "شناسه سابقه نامعتبر است." };
    }

    await db.adminActivityLog.delete({
      where: { id },
    });

    revalidatePath("/admin/logs");

    return { ok: true, message: "سابقه مورد نظر با موفقیت از سیستم حذف شد." };
  } catch (error: any) {
    return { ok: false, message: error?.message || "خطا در حذف سابقه تغییرات." };
  }
}

export async function clearAllActivityLogs(
  prevState: any,
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user || session.user.isActive === false) {
      return { ok: false, message: "دسترسی غیرمجاز؛ لطفاً وارد شوید." };
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return { ok: false, message: "پاکسازی سوابق تغییرات فقط برای مدیر ارشد مجاز است." };
    }

    await db.adminActivityLog.deleteMany();

    revalidatePath("/admin/logs");

    return { ok: true, message: "تمام سوابق تغییرات با موفقیت پاکسازی شدند." };
  } catch (error: any) {
    return { ok: false, message: error?.message || "خطا در پاکسازی سوابق تغییرات." };
  }
}
